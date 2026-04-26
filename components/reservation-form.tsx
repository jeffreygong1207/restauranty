"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Diner, Restaurant } from "@/lib/types";

export function ReservationForm({
  restaurants,
  diners,
}: {
  restaurants: Restaurant[];
  diners: Diner[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstRestaurant = restaurants[0]?._id ?? "";
  const firstDiner = diners[0]?._id ?? "";

  async function submit(formData: FormData) {
    setBusy(true);
    setError(null);
    const body = Object.fromEntries(formData.entries());
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Could not create reservation");
      return;
    }
    router.push(`/reservations/${data.reservation._id}`);
    router.refresh();
  }

  return (
    <form action={submit} className="card">
      <div className="card-head">
        <h3>New reservation</h3>
        <span className="sub">Risk recalculates on save</span>
      </div>
      <div className="card-body">
        <div className="form-grid">
          <div className="field">
            <label>Restaurant</label>
            <select name="restaurantId" defaultValue={firstRestaurant} required>
              {restaurants.map((restaurant) => (
                <option key={restaurant._id} value={restaurant._id}>{restaurant.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Diner</label>
            <select name="dinerId" defaultValue={firstDiner}>
              {diners.map((diner) => (
                <option key={diner._id} value={diner._id}>{diner.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Date</label>
            <input name="date" type="date" defaultValue="2026-04-26" required />
          </div>
          <div className="field">
            <label>Start time</label>
            <input name="startTime" type="time" defaultValue="20:15" required />
          </div>
          <div className="field">
            <label>Party size</label>
            <input name="partySize" type="number" min="1" defaultValue="2" required />
          </div>
          <div className="field">
            <label>Status</label>
            <select name="status" defaultValue="unconfirmed">
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="unconfirmed">Unconfirmed</option>
              <option value="released_by_diner">Released by diner</option>
            </select>
          </div>
          <div className="field">
            <label>Confirmation</label>
            <select name="confirmationStatus" defaultValue="requested">
              <option value="not_requested">Not requested</option>
              <option value="requested">Requested</option>
              <option value="confirmed">Confirmed</option>
              <option value="ignored">Ignored</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          <div className="field">
            <label>Estimated revenue</label>
            <input name="estimatedRevenue" type="number" min="0" defaultValue="180" />
          </div>
          <label className="toggle accent on">
            <input name="highDemandSlot" type="checkbox" defaultChecked hidden />
            <span className="sw" />
            <span>High-demand slot</span>
          </label>
          <label className="toggle accent">
            <input name="cardOnFile" type="checkbox" hidden />
            <span className="sw" />
            <span>Card on file</span>
          </label>
        </div>
        {error && <div className="notice" style={{ marginTop: 12, color: "var(--danger)" }}>{error}</div>}
      </div>
      <div className="card-foot">
        <button className="btn primary" disabled={busy}>{busy ? "Creating..." : "Create reservation"}</button>
      </div>
    </form>
  );
}
