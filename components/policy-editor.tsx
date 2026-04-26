"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Restaurant, RestaurantPolicy } from "@/lib/types";
import { Ic } from "./restauranty-core";

export function PolicyEditor({
  restaurants,
  policy,
}: {
  restaurants: Restaurant[];
  policy: RestaurantPolicy;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function submit(formData: FormData) {
    setBusy(true);
    setSaved(false);
    const body = Object.fromEntries(formData.entries());
    await fetch("/api/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        waitlistRefillEnabled: body.waitlistRefillEnabled === "on",
        feeWaiverIfRefilled: body.feeWaiverIfRefilled === "on",
        restaurantApprovalRequired: body.restaurantApprovalRequired === "on",
        paidResaleAllowed: false,
        humanVerificationRequired: true,
      }),
    });
    setBusy(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form action={submit} className="grid-3">
      <div className="policy">
        <div className="top">
          <div>
            <h4>Restaurant</h4>
            <p className="desc">Policy owner and approval scope.</p>
          </div>
        </div>
        <div className="field">
          <select name="restaurantId" defaultValue={policy.restaurantId}>
            {restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>{restaurant.name}</option>
            ))}
          </select>
        </div>
      </div>
      <PolicyToggle name="waitlistRefillEnabled" title="Waitlist refill" desc="Allow verified waitlist refill." defaultChecked={policy.waitlistRefillEnabled} />
      <PolicyToggle name="restaurantApprovalRequired" title="Manager approval" desc="Require manager approval before settlement." defaultChecked={policy.restaurantApprovalRequired} />
      <PolicyToggle name="feeWaiverIfRefilled" title="Fee waiver on refill" desc="Waive cancellation fee if refilled." defaultChecked={policy.feeWaiverIfRefilled} />
      <LockedPolicy title="Paid resale" desc="Disabled by default and saved as false." />
      <LockedPolicy title="Human verification" desc="Required for replacement diners." />
      <div className="policy">
        <div className="top">
          <div>
            <h4>Timing controls</h4>
            <p className="desc">Confirmation and grace windows.</p>
          </div>
        </div>
        <div className="field">
          <label>Confirmation window hours</label>
          <input name="confirmationWindowHours" type="number" min="1" defaultValue={policy.confirmationWindowHours} />
        </div>
        <div className="field">
          <label>Final confirmation minutes</label>
          <input name="finalConfirmationMinutes" type="number" min="5" defaultValue={policy.finalConfirmationMinutes} />
        </div>
        <div className="field">
          <label>No-show grace minutes</label>
          <input name="noShowGraceMinutes" type="number" min="0" defaultValue={policy.noShowGraceMinutes} />
        </div>
      </div>
      <div className="policy">
        <div className="top">
          <div>
            <h4>Save policy</h4>
            <p className="desc">Writes audit log and preserves locked controls.</p>
          </div>
        </div>
        <button className="btn primary" disabled={busy}>{busy ? "Saving..." : "Save changes"}</button>
        {saved && <span className="badge success"><span className="b-dot" />Saved</span>}
      </div>
    </form>
  );
}

function PolicyToggle({ name, title, desc, defaultChecked }: { name: string; title: string; desc: string; defaultChecked: boolean }) {
  return (
    <div className="policy">
      <div className="top">
        <div>
          <h4>{title}</h4>
          <p className="desc">{desc}</p>
        </div>
      </div>
      <label className={`toggle accent ${defaultChecked ? "on" : ""}`}>
        <input name={name} type="checkbox" defaultChecked={defaultChecked} hidden />
        <span className="sw" />
        <span>{defaultChecked ? "Enabled" : "Disabled"}</span>
      </label>
    </div>
  );
}

function LockedPolicy({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="policy">
      <div className="top">
        <div>
          <h4>{title}</h4>
          <p className="desc">{desc}</p>
        </div>
        <span className="badge neutral"><Ic.shield /> Locked</span>
      </div>
    </div>
  );
}
