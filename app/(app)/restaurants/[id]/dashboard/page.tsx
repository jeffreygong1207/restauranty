import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Ic,
  MetricCard,
  PageHead,
  ReservationTable,
  StatusBadge,
  fmtMoney,
} from "@/components/restauranty-core";
import {
  getRestaurant,
  listAuditLogs,
  listDiners,
  listReservations,
  listWaitlistCandidates,
} from "@/lib/repositories/store";
import { getSessionUser } from "@/lib/services/session";

export const dynamic = "force-dynamic";

export default async function RestaurantOwnerDashboard({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ claimed?: string; registered?: string }>;
}) {
  const [{ id }, search, user] = await Promise.all([params, searchParams, getSessionUser()]);
  if (!user) redirect(`/api/auth/login?returnTo=${encodeURIComponent(`/restaurants/${id}/dashboard`)}`);
  const restaurant = await getRestaurant(id);
  if (!restaurant) {
    return (
      <div className="page" style={{ maxWidth: 720, margin: "0 auto" }}>
        <PageHead
          title="Restaurant not found"
          subtitle="This venue isn't visible from this server yet — it may have just been claimed."
          actions={
            <Link className="btn primary" href="/restaurant-dashboard">
              Back to my restaurants
            </Link>
          }
        />
        <div className="card">
          <div className="card-body col" style={{ gap: 10, fontSize: 13.5 }}>
            <p style={{ margin: 0 }}>
              If you just claimed or registered this restaurant, give it a moment and refresh.
            </p>
            <div className="row" style={{ gap: 8 }}>
              <Link className="btn" href={`/restaurants/${id}/dashboard`}>
                Refresh
              </Link>
              <Link className="btn" href="/restaurant-dashboard">
                My restaurants
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (restaurant.ownerUserId && restaurant.ownerUserId !== user._id && user.role !== "admin") {
    return (
      <div className="page">
        <PageHead title={restaurant.name} subtitle="You do not have access to this restaurant." />
        <div className="empty">
          This restaurant is owned by another Restauranty user. If this is your venue, contact
          admin@restauranty.demo.
        </div>
      </div>
    );
  }

  const [reservations, diners, waitlist, auditLogs] = await Promise.all([
    listReservations(),
    listDiners(),
    listWaitlistCandidates(restaurant._id),
    listAuditLogs(restaurant._id),
  ]);
  const todays = reservations.filter((r) => r.restaurantId === restaurant._id);
  const atRisk = todays.filter((r) => r.riskScore >= 60);
  const recovered = todays.filter((r) => r.status === "recovered");
  const pendingConfirm = todays.filter((r) => r.confirmationStatus === "requested");
  const recoveryActive = todays.filter((r) => r.status === "recovery_active");
  const verifiedWaitlist = waitlist.filter((c) => c.verifiedHuman);

  const rows = todays
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .map((reservation) => ({
      reservation,
      restaurant,
      diner: diners.find((d) => d._id === reservation.dinerId),
    }));

  const banner =
    search.claimed === "1"
      ? "Restaurant claimed and verified. You can manage everything below."
      : search.registered === "1"
        ? "Restaurant registered and verified. You can manage everything below."
        : null;

  return (
    <div className="page">
      <PageHead
        title={restaurant.name}
        subtitle={`${restaurant.address} · ${restaurant.cuisineCategories.slice(0, 2).join(", ")}`}
        actions={
          <>
            <StatusBadge state={restaurant.claimStatus === "verified" ? "configured" : "warning"}>
              {restaurant.claimStatus === "verified" ? "Verified" : "Pending verification"}
            </StatusBadge>
            <Link className="btn" href={`/policies?restaurantId=${restaurant._id}`}>
              <Ic.policy /> Edit policy
            </Link>
            <Link className="btn primary" href={`/reservations/new?restaurantId=${restaurant._id}`}>
              <Ic.plus /> New reservation
            </Link>
          </>
        }
      />

      {banner && <div className="notice" style={{ marginBottom: 14 }}>{banner}</div>}

      <div className="grid-metrics" style={{ marginBottom: 18 }}>
        <MetricCard label="Today's reservations" value={todays.length} icon={<Ic.overview />} />
        <MetricCard
          label="At-risk reservations"
          value={atRisk.length}
          delta={atRisk.length ? `${Math.round((atRisk.length / Math.max(1, todays.length)) * 100)}% of book` : "All clear"}
          deltaTone={atRisk.length ? "neg" : "pos"}
          icon={<Ic.risk />}
        />
        <MetricCard
          label="Pending confirmations"
          value={pendingConfirm.length}
          delta="awaiting diner reply"
          icon={<Ic.clock />}
        />
        <MetricCard
          label="Recovery in progress"
          value={recoveryActive.length}
          delta="agents working"
          icon={<Ic.recovery />}
        />
        <MetricCard
          label="Revenue at risk"
          value={fmtMoney(atRisk.reduce((sum, r) => sum + r.estimatedRevenue, 0))}
          icon={<Ic.dollar />}
          sparkColor="var(--warn)"
        />
      </div>

      <div className="split">
        <div className="card">
          <div className="card-head">
            <h3>Today&apos;s reservation list</h3>
            <span className="sub">{todays.length} bookings</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            {rows.length ? (
              <ReservationTable rows={rows} />
            ) : (
              <div className="empty">
                No reservations yet for {restaurant.name}.{" "}
                <Link href={`/reservations/new?restaurantId=${restaurant._id}`}>Add one →</Link>
              </div>
            )}
          </div>
        </div>
        <div className="col" style={{ gap: 14 }}>
          <div className="card">
            <div className="card-head"><h3>Waitlist candidates</h3><span className="sub">{verifiedWaitlist.length} verified</span></div>
            <div className="card-body">
              {waitlist.length === 0 && <div className="empty">No waitlist candidates yet.</div>}
              {waitlist.slice(0, 4).map((candidate) => {
                const diner = diners.find((d) => d._id === candidate.dinerId);
                return (
                  <div className="kv" key={candidate._id}>
                    <span className="k">{diner?.name ?? candidate.dinerId}</span>
                    <span className="v">
                      x{candidate.partySize} · {candidate.distanceMiles}mi
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="card-foot">
              <Link className="btn sm" href="/waitlist">Open waitlist</Link>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Recent audit log</h3></div>
            <div className="card-body">
              {auditLogs.length === 0 && <div className="empty">Audit log empty.</div>}
              {auditLogs.slice(0, 6).map((log) => (
                <div className="kv" key={log._id}>
                  <span className="k">{log.action}</span>
                  <span className="v mono" style={{ fontSize: 11 }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Quick actions</h3></div>
            <div className="card-body col" style={{ gap: 8 }}>
              <Link className="btn" href={`/reservations/new?restaurantId=${restaurant._id}`}>Add reservation</Link>
              <Link className="btn" href={`/policies?restaurantId=${restaurant._id}`}>Configure policy</Link>
              <Link className="btn" href={`/agents`}>Run risk scan</Link>
              <Link className="btn" href={`/recovery/${rows[0]?.reservation._id ?? ""}`}>Activate recovery</Link>
              <Link className="btn" href={`/admin`}>View audit log</Link>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Recovery summary</h3></div>
            <div className="card-body">
              <div className="kv"><span className="k">Recovered tables</span><span className="v">{recovered.length}</span></div>
              <div className="kv"><span className="k">Revenue recovered</span><span className="v">{fmtMoney(recovered.reduce((sum, r) => sum + r.estimatedRevenue, 0))}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
