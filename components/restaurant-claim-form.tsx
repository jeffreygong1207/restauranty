"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Ic } from "./restauranty-core";

export function RestaurantClaimForm({
  placeId,
  prefillName,
  prefillPhone,
  signedIn,
}: {
  placeId: string;
  prefillName?: string;
  prefillPhone?: string;
  signedIn: boolean;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const busy = submitting || pending;

  async function submit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    const body = {
      placeId,
      managerName: formData.get("managerName")?.toString() || undefined,
      managerPhone: formData.get("managerPhone")?.toString() || undefined,
      claimMethod: "self_attested" as const,
      evidence: {
        attestation: formData.get("attestation")?.toString() || undefined,
      },
    };
    const res = await fetch("/api/restaurants/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Claim failed.");
      return;
    }
    startTransition(() => {
      router.push(`/restaurants/${data.restaurant._id}/dashboard?claimed=1`);
      router.refresh();
    });
  }

  if (!signedIn) {
    return (
      <div className="card">
        <div className="card-body" style={{ textAlign: "center" }}>
          <h3 style={{ margin: "0 0 8px" }}>Sign in to claim this restaurant</h3>
          <p className="muted" style={{ margin: "0 0 14px" }}>
            We&apos;ll create an owner account and link this Google Places listing to it.
          </p>
          <a
            className="btn accent lg"
            href={`/api/auth/login?returnTo=${encodeURIComponent(`/restaurants/claim/${placeId}`)}`}
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
        <h3>Claim ownership</h3>
        <span className="sub">Self-attested · pending verification</span>
      </div>
      <div className="card-body">
        <div className="form-grid">
          <div className="field">
            <label>Manager name</label>
            <input name="managerName" defaultValue={prefillName} required />
          </div>
          <div className="field">
            <label>Manager phone</label>
            <input name="managerPhone" defaultValue={prefillPhone} placeholder="+1 310 555 0100" />
          </div>
        </div>
        <div className="field" style={{ marginTop: 12 }}>
          <label>Why you can claim this</label>
          <textarea
            name="attestation"
            placeholder="I am the owner / GM / authorized manager. Restauranty admins may verify this claim before public launch."
            required
          />
        </div>
        <div className="notice" style={{ marginTop: 12 }}>
          <b>Self-attested claim.</b> Your restaurant is verified instantly so you can start
          managing it. We never imply Google verified ownership.
        </div>
        {error && (
          <div className="notice" style={{ marginTop: 12, color: "var(--danger)" }}>{error}</div>
        )}
      </div>
      <div className="card-foot">
        <button className="btn primary" disabled={busy}>
          {submitting
            ? "Claiming…"
            : pending
              ? "Opening dashboard…"
              : "Claim restaurant"}
        </button>
      </div>
    </form>
  );
}
