import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  Ic,
  PageHead,
  StatusBadge,
  fmtMoney,
  fmtTime,
} from "@/components/restauranty-core";
import { DinerReservationActions } from "@/components/diner-reservation-actions";
import {
  getDiner,
  getReservation,
  getRestaurant,
} from "@/lib/repositories/store";
import { authLoginUrl, getSessionUser } from "@/lib/services/session";

export const dynamic = "force-dynamic";

export default async function MyReservationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, user] = await Promise.all([params, getSessionUser()]);
  if (!user) redirect(authLoginUrl(`/my-reservations/${id}`));

  const reservation = await getReservation(id);
  if (!reservation) notFound();
  const [restaurant, diner] = await Promise.all([
    getRestaurant(reservation.restaurantId),
    getDiner(reservation.dinerId),
  ]);

  const isOwnerOfDiner =
    diner &&
    (diner.userId === user._id ||
      diner.email.toLowerCase() === user.email.toLowerCase());

  if (!isOwnerOfDiner && user.role !== "admin") {
    return (
      <div className="page">
        <PageHead title="Reservation" subtitle="You don't have access to this reservation." />
        <div className="empty">
          This reservation belongs to another diner.{" "}
          <Link href="/my-reservations">Back to my reservations →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: 1080, margin: "0 auto" }}>
      <PageHead
        title={restaurant?.name ?? "Reservation"}
        subtitle={`${reservation.date} · ${fmtTime(reservation.startTime)} · party of ${reservation.partySize}`}
        actions={
          <Link className="btn" href="/my-reservations">
            Back to all
          </Link>
        }
      />

      <div className="split">
        <div className="col" style={{ gap: 14 }}>
          <div className="card">
            <div className="card-head">
              <h3>Reservation details</h3>
              <StatusBadge state={reservation.status}>
                {reservation.status.replaceAll("_", " ")}
              </StatusBadge>
            </div>
            <div className="card-body">
              <div className="kv">
                <span className="k">Restaurant</span>
                <span className="v">{restaurant?.name ?? reservation.restaurantId}</span>
              </div>
              <div className="kv">
                <span className="k">Address</span>
                <span className="v">{restaurant?.address ?? "—"}</span>
              </div>
              <div className="kv">
                <span className="k">Date & time</span>
                <span className="v">
                  {reservation.date} · {fmtTime(reservation.startTime)}
                </span>
              </div>
              <div className="kv">
                <span className="k">Party size</span>
                <span className="v">{reservation.partySize}</span>
              </div>
              <div className="kv">
                <span className="k">Estimated value</span>
                <span className="v">{fmtMoney(reservation.estimatedRevenue)}</span>
              </div>
              <div className="kv">
                <span className="k">Confirmation</span>
                <span className="v">{reservation.confirmationStatus.replaceAll("_", " ")}</span>
              </div>
              <div className="kv">
                <span className="k">Cancellation fee on file</span>
                <span className="v">{fmtMoney(reservation.cancellationFee)}</span>
              </div>
            </div>
          </div>

          <DinerReservationActions reservationId={reservation._id} status={reservation.status} />
        </div>

        <div className="col" style={{ gap: 14 }}>
          <div className="card">
            <div className="card-head">
              <h3>Restauranty fairness</h3>
            </div>
            <div className="card-body col" style={{ gap: 10, fontSize: 13 }}>
              <div>
                <strong>Risk score:</strong> {reservation.riskScore} / 100 ·{" "}
                {reservation.riskLevel}
              </div>
              <div>
                Restaurants use this score to decide which tables to refill from the waitlist —
                you keep your table when you confirm or release in time.
              </div>
              <div className="muted">
                Recommended action: <em>{reservation.recommendedAction.replaceAll("_", " ")}</em>
              </div>
            </div>
          </div>
          <div className="card flat" style={{ background: "var(--bg-sunken)" }}>
            <div className="card-body" style={{ fontSize: 12.5 }}>
              <Ic.shield />
              <p style={{ margin: "8px 0 0" }}>
                Releasing a table is free. Restauranty does not resell or markup reservations —
                we route them through a verified waitlist with policies set by the restaurant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
