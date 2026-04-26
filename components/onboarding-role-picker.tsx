"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Ic } from "./restauranty-core";
import type { UserRole } from "@/lib/types";

const choices: {
  role: UserRole;
  title: string;
  description: string;
  cta: string;
  icon: React.ReactNode;
}[] = [
  {
    role: "restaurant_manager",
    title: "I manage a restaurant",
    description:
      "Search Google Places, claim your venue, configure reservation policies, and recover at-risk covers.",
    cta: "Continue as restaurant manager",
    icon: <Ic.policy />,
  },
  {
    role: "diner",
    title: "I'm a diner",
    description:
      "View your reservations, confirm or release tables responsibly, and join verified waitlists.",
    cta: "Continue as diner",
    icon: <Ic.diner />,
  },
  {
    role: "replacement_diner",
    title: "I want to fill open tables",
    description:
      "Be matched to high-demand tables that other diners release. Verified humans only.",
    cta: "Continue as replacement diner",
    icon: <Ic.waitlist />,
  },
];

export function OnboardingRolePicker({
  currentRole,
  nextPath,
}: {
  currentRole: UserRole;
  nextPath: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function pick(role: UserRole) {
    setBusy(role);
    setError(null);
    const res = await fetch("/api/users/role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    setBusy(null);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Could not update role.");
      return;
    }
    const target = nextPath && nextPath !== "/onboarding" ? nextPath : data.redirectTo;
    router.push(target);
    router.refresh();
  }

  return (
    <div className="grid-cards">
      {choices.map((choice) => (
        <button
          key={choice.role}
          type="button"
          className={`card hover ${currentRole === choice.role ? "card-active" : ""}`}
          onClick={() => pick(choice.role)}
          disabled={Boolean(busy)}
          style={{ textAlign: "left", cursor: "pointer", padding: 0, border: 0, background: "var(--bg-elev)" }}
        >
          <div className="card-head">
            <span className="ic">{choice.icon}</span>
            <h3 style={{ margin: 0 }}>{choice.title}</h3>
          </div>
          <div className="card-body">
            <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>{choice.description}</p>
          </div>
          <div className="card-foot">
            <span className="btn sm primary">
              {busy === choice.role ? "Saving…" : choice.cta} <Ic.arrow />
            </span>
          </div>
        </button>
      ))}
      {error && <div className="notice" style={{ color: "var(--danger)" }}>{error}</div>}
    </div>
  );
}
