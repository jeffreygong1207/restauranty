"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Ic } from "./restauranty-core";

export function DinerReservationActions({ reservationId, status }: { reservationId: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const canConfirm = !["completed", "cancelled", "no_show", "confirmed"].includes(status);
  const canRelease = !["completed", "cancelled", "no_show"].includes(status);

  async function patch(action: "confirm" | "release") {
    setBusy(action);
    setError(null);
    setMessage(null);
    const update =
      action === "confirm"
        ? { status: "confirmed", confirmationStatus: "confirmed" as const }
        : { status: "released_by_diner", confirmationStatus: "declined" as const };
    const res = await fetch(`/api/reservations/${reservationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    const data = await res.json();
    setBusy(null);
    if (!res.ok || !data.ok) {
      setError(data.error ?? `Could not ${action}.`);
      return;
    }
    setMessage(
      action === "confirm"
        ? "Confirmed. Restaurant has been notified."
        : "Released. Waitlist refill is in progress.",
    );
    router.refresh();
  }

  return (
    <div className="card">
      <div className="card-head">
        <h3>Manage your reservation</h3>
      </div>
      <div className="card-body col" style={{ gap: 10 }}>
        <p className="muted" style={{ margin: 0, fontSize: 13 }}>
          Confirm to lock in your table, or release responsibly so Restauranty can refill it from
          the verified waitlist.
        </p>
        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn primary"
            disabled={!canConfirm || busy !== null}
            onClick={() => patch("confirm")}
          >
            {busy === "confirm" ? "Confirming…" : "Confirm reservation"} <Ic.check />
          </button>
          <button
            type="button"
            className="btn"
            disabled={!canRelease || busy !== null}
            onClick={() => patch("release")}
          >
            {busy === "release" ? "Releasing…" : "Release table"} <Ic.x />
          </button>
        </div>
        {message && <div className="notice">{message}</div>}
        {error && <div className="notice" style={{ color: "var(--danger)" }}>{error}</div>}
      </div>
    </div>
  );
}
