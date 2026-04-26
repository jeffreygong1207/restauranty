"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Ic } from "./restauranty-core";

const TIME_SLOTS = [
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
];

export function DinerBookingForm({
  restaurantId,
  restaurantName,
  averageCheck,
  defaultName,
  defaultEmail,
  defaultPhone,
}: {
  restaurantId: string;
  restaurantName: string;
  averageCheck: number;
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
}) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setBusy(true);
    setError(null);
    const partySize = Number(formData.get("partySize") ?? 2);
    const body = {
      restaurantId,
      date: formData.get("date")?.toString() ?? today,
      startTime: formData.get("startTime")?.toString() ?? "19:00",
      partySize,
      status: "scheduled" as const,
      confirmationStatus: "requested" as const,
      cardOnFile: false,
      highDemandSlot: true,
      estimatedRevenue: averageCheck * partySize,
      cancellationFee: 0,
      source: "manual" as const,
      dinerName: formData.get("name")?.toString() || defaultName,
      dinerEmail: formData.get("email")?.toString() || defaultEmail,
      dinerPhone: formData.get("phone")?.toString() || defaultPhone,
    };
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Could not book this table.");
      return;
    }
    router.push(`/my-reservations/${data.reservation._id}?booked=1`);
    router.refresh();
  }

  return (
    <form className="card" action={submit}>
      <div className="card-head">
        <h3>Book {restaurantName}</h3>
        <span className="sub">No fees · free to release</span>
      </div>
      <div className="card-body">
        <div className="form-grid">
          <div className="field">
            <label>Date</label>
            <input name="date" type="date" defaultValue={today} required />
          </div>
          <div className="field">
            <label>Time</label>
            <select name="startTime" defaultValue="19:00" required>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Party size</label>
            <input name="partySize" type="number" min={1} max={20} defaultValue={2} required />
          </div>
        </div>
        <div className="form-grid" style={{ marginTop: 12 }}>
          <div className="field">
            <label>Your name</label>
            <input name="name" defaultValue={defaultName} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" defaultValue={defaultEmail} required />
          </div>
          <div className="field">
            <label>Phone</label>
            <input name="phone" defaultValue={defaultPhone} placeholder="+1 310 555 0100" />
          </div>
        </div>
        {error && (
          <div className="notice" style={{ marginTop: 12, color: "var(--danger)" }}>
            {error}
          </div>
        )}
      </div>
      <div className="card-foot">
        <button className="btn primary" disabled={busy}>
          {busy ? "Reserving…" : "Book this table"} <Ic.arrow />
        </button>
      </div>
    </form>
  );
}
