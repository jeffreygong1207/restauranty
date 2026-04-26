import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Ic,
  PageHead,
  StatusBadge,
  fmtMoney,
  fmtTime,
} from "@/components/restauranty-core";
import {
  listDiners,
  listReservations,
  listRestaurants,
} from "@/lib/repositories/store";
import { authLoginUrl, getSessionUser } from "@/lib/services/session";

export const dynamic = "force-dynamic";

export default async function MyReservationsPage() {
  const user = await getSessionUser();
  if (!user) redirect(authLoginUrl("/my-reservations"));

  const [reservations, restaurants, diners] = await Promise.all([
    listReservations(),
    listRestaurants(),
    listDiners(),
  ]);

  const dinerProfile = diners.find(
    (d) => d.userId === user._id || d.email.toLowerCase() === user.email.toLowerCase(),
  );
  const myReservations = dinerProfile
    ? reservations.filter((r) => r.dinerId === dinerProfile._id)
    : [];

  const sorted = [...myReservations].sort((a, b) =>
    `${b.date} ${b.startTime}`.localeCompare(`${a.date} ${a.startTime}`),
  );
  const upcoming = sorted.filter(
    (r) => !["completed", "cancelled", "no_show"].includes(r.status),
  );
  const past = sorted.filter((r) =>
    ["completed", "cancelled", "no_show"].includes(r.status),
  );
  const restaurantById = new Map(restaurants.map((r) => [r._id, r] as const));

  return (
    <div className="page">
      <PageHead
        title="My reservations"
        subtitle={`${upcoming.length} upcoming · ${past.length} past`}
        actions={
          <Link className="btn primary" href="/restaurants/search">
            <Ic.search /> Find a restaurant
          </Link>
        }
      />

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="card-head">
          <h3>Upcoming</h3>
          <span className="sub">{upcoming.length}</span>
        </div>
        <div className="card-body col" style={{ gap: 0 }}>
          {upcoming.length === 0 && (
            <div className="empty">No upcoming reservations.</div>
          )}
          {upcoming.map((reservation) => {
            const restaurant = restaurantById.get(reservation.restaurantId);
            return (
              <Link
                key={reservation._id}
                href={`/my-reservations/${reservation._id}`}
                className="row"
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid var(--line)",
                  textDecoration: "none",
                  color: "inherit",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ fontSize: 13.5 }}>
                    {restaurant?.name ?? reservation.restaurantId}
                  </strong>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                    {reservation.date} · {fmtTime(reservation.startTime)} · party of{" "}
                    {reservation.partySize} · {fmtMoney(reservation.estimatedRevenue)}
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
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Past</h3>
          <span className="sub">{past.length}</span>
        </div>
        <div className="card-body col" style={{ gap: 0 }}>
          {past.length === 0 && <div className="empty">Nothing in your history yet.</div>}
          {past.map((reservation) => {
            const restaurant = restaurantById.get(reservation.restaurantId);
            return (
              <Link
                key={reservation._id}
                href={`/my-reservations/${reservation._id}`}
                className="row"
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid var(--line)",
                  textDecoration: "none",
                  color: "inherit",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ fontSize: 13.5 }}>
                    {restaurant?.name ?? reservation.restaurantId}
                  </strong>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                    {reservation.date} · {fmtTime(reservation.startTime)}
                  </div>
                </div>
                <StatusBadge state={reservation.status}>
                  {reservation.status.replaceAll("_", " ")}
                </StatusBadge>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
