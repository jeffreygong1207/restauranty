import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Ic,
  MetricCard,
  PageHead,
  StatusBadge,
  fmtMoney,
  fmtTime,
} from "@/components/restauranty-core";
import {
  listReservationsByDiner,
  listRestaurants,
  listWaitlistCandidates,
  listDiners,
} from "@/lib/repositories/store";
import { authLoginUrl, getSessionUser } from "@/lib/services/session";

export const dynamic = "force-dynamic";

export default async function DinerHomePage() {
  const user = await getSessionUser();
  if (!user) redirect(authLoginUrl("/home"));

  const [restaurants, waitlist, diners] = await Promise.all([
    listRestaurants(),
    listWaitlistCandidates(),
    listDiners(),
  ]);

  const dinerProfile = diners.find(
    (d) => d.userId === user._id || d.email.toLowerCase() === user.email.toLowerCase(),
  );
  const myReservations = dinerProfile
    ? await listReservationsByDiner(dinerProfile._id)
    : [];
  const upcoming = myReservations.filter(
    (r) => !["completed", "cancelled", "no_show"].includes(r.status),
  );
  const myWaitlist = dinerProfile
    ? waitlist.filter((c) => c.dinerId === dinerProfile._id)
    : [];

  const restaurantById = new Map(restaurants.map((r) => [r._id, r] as const));

  return (
    <div className="page">
      <PageHead
        title={`Hi ${user.name.split(" ")[0]}`}
        subtitle="Book reservations, manage upcoming tables, or release them so a waitlisted diner can take your spot."
        actions={
          <>
            <Link className="btn" href="/waitlist/join">
              <Ic.waitlist /> Join a waitlist
            </Link>
            <Link className="btn primary" href="/dine">
              <Ic.search /> Find a table
            </Link>
          </>
        }
      />

      <div className="grid-metrics" style={{ marginBottom: 18 }}>
        <MetricCard
          label="Upcoming reservations"
          value={upcoming.length}
          icon={<Ic.overview />}
        />
        <MetricCard
          label="Trust score"
          value={dinerProfile?.trustScore ?? 70}
          delta={dinerProfile?.verifiedHuman ? "Human verified" : "Verify with World ID"}
          deltaTone={dinerProfile?.verifiedHuman ? "pos" : undefined}
          icon={<Ic.shield />}
        />
        <MetricCard
          label="Active waitlists"
          value={myWaitlist.length}
          icon={<Ic.waitlist />}
        />
        <MetricCard
          label="Completed visits"
          value={dinerProfile?.completedReservations ?? 0}
          icon={<Ic.check />}
        />
      </div>

      <div className="split">
        <div className="card">
          <div className="card-head">
            <h3>Your upcoming reservations</h3>
            <span className="sub">{upcoming.length} tables</span>
          </div>
          <div className="card-body col" style={{ gap: 10 }}>
            {upcoming.length === 0 && (
              <div className="empty">
                You don&apos;t have any upcoming reservations.{" "}
                <Link href="/restaurants/search">Find a restaurant →</Link>
              </div>
            )}
            {upcoming.map((reservation) => {
              const restaurant = restaurantById.get(reservation.restaurantId);
              return (
                <Link
                  key={reservation._id}
                  href={`/my-reservations/${reservation._id}`}
                  className="row"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--line)",
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ fontSize: 13.5 }}>
                      {restaurant?.name ?? reservation.restaurantId}
                    </strong>
                    <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                      {reservation.date} · {fmtTime(reservation.startTime)} · party of{" "}
                      {reservation.partySize}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <StatusBadge state={reservation.status}>
                      {reservation.status.replaceAll("_", " ")}
                    </StatusBadge>
                    <Ic.arrow />
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="card-foot">
            <Link className="btn sm" href="/my-reservations">
              View all reservations
            </Link>
          </div>
        </div>

        <div className="col" style={{ gap: 14 }}>
          <div className="card">
            <div className="card-head">
              <h3>Your waitlists</h3>
              <span className="sub">{myWaitlist.length} active</span>
            </div>
            <div className="card-body col" style={{ gap: 8 }}>
              {myWaitlist.length === 0 && (
                <div className="empty" style={{ fontSize: 13 }}>
                  You haven&apos;t joined any waitlists yet.
                </div>
              )}
              {myWaitlist.slice(0, 4).map((candidate) => {
                const restaurant = restaurantById.get(candidate.restaurantId);
                return (
                  <div className="kv" key={candidate._id}>
                    <span className="k">{restaurant?.name ?? candidate.restaurantId}</span>
                    <span className="v">
                      x{candidate.partySize} · {candidate.desiredDate}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="card-foot">
              <Link className="btn sm" href="/waitlist/join">
                Join another waitlist
              </Link>
            </div>
          </div>
          <div className="card">
            <div className="card-head">
              <h3>Plans changing?</h3>
            </div>
            <div className="card-body col" style={{ gap: 10, fontSize: 13 }}>
              <p className="muted" style={{ margin: 0 }}>
                Don&apos;t ghost the restaurant — release your reservation and we&apos;ll refill it
                from a verified waitlist. No fees, no resale, no markup.
              </p>
              <Link className="btn" href="/my-reservations">
                Release a reservation
              </Link>
            </div>
          </div>
          <div className="card">
            <div className="card-head">
              <h3>How Restauranty protects you</h3>
            </div>
            <div className="card-body col" style={{ gap: 8, fontSize: 13 }}>
              <div>
                <strong>Free for diners.</strong> No fees, no markups — restaurants pay us for the
                fairness layer.
              </div>
              <div>
                <strong>Release responsibly.</strong> Cancel up front and we&apos;ll refill your
                table from a verified waitlist.
              </div>
              <div>
                <strong>No bots.</strong> World ID verification keeps replacement diners human.
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head">
              <h3>Estimated value protected</h3>
            </div>
            <div className="card-body">
              <div className="kv">
                <span className="k">Avg ticket on your reservations</span>
                <span className="v">
                  {fmtMoney(
                    upcoming.reduce((sum, r) => sum + r.estimatedRevenue, 0) /
                      Math.max(1, upcoming.length),
                  )}
                </span>
              </div>
              <div className="kv">
                <span className="k">Total upcoming revenue</span>
                <span className="v">
                  {fmtMoney(upcoming.reduce((sum, r) => sum + r.estimatedRevenue, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
