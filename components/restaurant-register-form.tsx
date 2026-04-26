"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Ic } from "./restauranty-core";

export function RestaurantRegisterForm({ signedIn }: { signedIn: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setBusy(true);
    setError(null);
    const body = Object.fromEntries(formData.entries());
    if (body.averageCheck) body.averageCheck = Number(body.averageCheck) as never;
    const res = await fetch("/api/restaurants/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Registration failed.");
      return;
    }
    router.push(`/restaurants/${data.restaurant._id}/dashboard?registered=1`);
    router.refresh();
  }

  if (!signedIn) {
    return (
      <div className="card">
        <div className="card-body" style={{ textAlign: "center" }}>
          <h3 style={{ margin: "0 0 8px" }}>Sign in to register your restaurant</h3>
          <p className="muted" style={{ margin: "0 0 14px" }}>
            We&apos;ll create an owner account and link this venue to it.
          </p>
          <a
            className="btn accent lg"
            href={`/api/auth/login?returnTo=${encodeURIComponent("/restaurants/new")}`}
          >
            Sign in to continue <Ic.arrow />
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="card" action={submit}>
      <div className="card-head">
        <h3>Register a restaurant manually</h3>
        <span className="sub">Use this if your venue isn&apos;t in Google Places</span>
      </div>
      <div className="card-body">
        <div className="form-grid">
          <div className="field">
            <label>Restaurant name *</label>
            <input name="name" required />
          </div>
          <div className="field">
            <label>Address *</label>
            <input name="address" required placeholder="123 Main St, Los Angeles, CA" />
          </div>
          <div className="field">
            <label>Phone</label>
            <input name="phone" placeholder="+1 310 555 0100" />
          </div>
          <div className="field">
            <label>Website</label>
            <input name="website" placeholder="https://example.com" />
          </div>
          <div className="field">
            <label>Cuisine (comma-separated)</label>
            <input name="cuisine" placeholder="Italian, Wine bar" />
          </div>
          <div className="field">
            <label>Average check ($)</label>
            <input name="averageCheck" type="number" min="0" placeholder="90" />
          </div>
          <div className="field">
            <label>Manager name</label>
            <input name="managerName" />
          </div>
          <div className="field">
            <label>Manager phone</label>
            <input name="managerPhone" />
          </div>
        </div>
        {error && <div className="notice" style={{ marginTop: 12, color: "var(--danger)" }}>{error}</div>}
      </div>
      <div className="card-foot">
        <button className="btn primary" disabled={busy}>{busy ? "Saving…" : "Register restaurant"}</button>
      </div>
    </form>
  );
}
