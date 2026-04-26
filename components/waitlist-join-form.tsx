"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Ic } from "./restauranty-core";
import type { Restaurant } from "@/lib/types";

export function WaitlistJoinForm({
  restaurants,
  defaultRestaurantId,
  defaultName,
  defaultEmail,
  defaultPhone,
}: {
  restaurants: Pick<Restaurant, "_id" | "name" | "neighborhood" | "cuisineCategories">[];
  defaultRestaurantId?: string;
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setBusy(true);
    setError(null);
    setConfirmation(null);

    const body = {
      restaurantId: formData.get("restaurantId")?.toString() ?? "",
      desiredDate: formData.get("desiredDate")?.toString() ?? "",
      desiredTimeWindowStart: formData.get("desiredTimeWindowStart")?.toString() ?? "",
      desiredTimeWindowEnd: formData.get("desiredTimeWindowEnd")?.toString() ?? "",
      partySize: Number(formData.get("partySize") ?? 2),
      distanceMiles: Number(formData.get("distanceMiles") ?? 2),
      cuisineMatchScore: 70,
      arrivalEtaMinutes: Number(formData.get("arrivalEtaMinutes") ?? 20),
      verifiedHuman: formData.get("verifiedHuman") === "on",
      commitmentLevel:
        (formData.get("commitmentLevel")?.toString() as
          | "browsing"
          | "quick_confirm"
          | "deposit_ready"
          | "instant_confirm") ?? "quick_confirm",
      name: formData.get("name")?.toString() || undefined,
      email: formData.get("email")?.toString() || undefined,
      phone: formData.get("phone")?.toString() || undefined,
    };

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Could not join the waitlist.");
      return;
    }
    setConfirmation("You're on the waitlist. Restauranty will notify you when a table opens.");
    router.refresh();
  }

  return (
    <form className="card" action={submit}>
      <div className="card-head">
        <h3>Join a verified waitlist</h3>
        <span className="sub">No fees. Free to leave at any time.</span>
      </div>
      <div className="card-body">
        <div className="form-grid">
          <div className="field">
            <label>Restaurant *</label>
            <select name="restaurantId" defaultValue={defaultRestaurantId} required>
              {restaurants.map((restaurant) => (
                <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.name}
                  {restaurant.neighborhood ? ` — ${restaurant.neighborhood}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Date *</label>
            <input
              name="desiredDate"
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              required
            />
          </div>
          <div className="field">
            <label>From *</label>
            <input name="desiredTimeWindowStart" type="time" defaultValue="18:00" required />
          </div>
          <div className="field">
            <label>To *</label>
            <input name="desiredTimeWindowEnd" type="time" defaultValue="21:00" required />
          </div>
          <div className="field">
            <label>Party size *</label>
            <input name="partySize" type="number" min={1} defaultValue={2} required />
          </div>
          <div className="field">
            <label>Distance (mi)</label>
            <input name="distanceMiles" type="number" step="0.1" min={0} defaultValue={2} />
          </div>
          <div className="field">
            <label>Arrival ETA (min)</label>
            <input name="arrivalEtaMinutes" type="number" min={0} defaultValue={20} />
          </div>
          <div className="field">
            <label>Commitment level</label>
            <select name="commitmentLevel" defaultValue="quick_confirm">
              <option value="browsing">Browsing</option>
              <option value="quick_confirm">Quick confirm</option>
              <option value="deposit_ready">Deposit ready</option>
              <option value="instant_confirm">Instant confirm</option>
            </select>
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: 12 }}>
          <div className="field">
            <label>Your name</label>
            <input name="name" defaultValue={defaultName} placeholder="As it appears on reservations" />
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" defaultValue={defaultEmail} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input name="phone" defaultValue={defaultPhone} placeholder="+1 310 555 0100" />
          </div>
          <div className="field" style={{ alignSelf: "end" }}>
            <label className="row" style={{ gap: 6 }}>
              <input type="checkbox" name="verifiedHuman" /> Human verified (World ID)
            </label>
          </div>
        </div>

        {error && (
          <div className="notice" style={{ marginTop: 12, color: "var(--danger)" }}>{error}</div>
        )}
        {confirmation && <div className="notice" style={{ marginTop: 12 }}>{confirmation}</div>}
      </div>
      <div className="card-foot">
        <button className="btn primary" disabled={busy}>
          {busy ? "Joining…" : "Join waitlist"} <Ic.arrow />
        </button>
      </div>
    </form>
  );
}
