"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Ic } from "./restauranty-core";
import type { UserRole } from "@/lib/types";

const choices: {
  role: UserRole;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
  icon: React.ReactNode;
}[] = [
  {
    role: "diner",
    title: "I'm a diner",
    description:
      "Book reservations, join verified waitlists, and release tables responsibly so a waitlisted diner can take your spot when plans change.",
    bullets: [
      "Book at claimed restaurants in seconds",
      "Confirm or release reservations in one tap",
      "Free for diners — Restauranty never charges you",
    ],
    cta: "Continue as a diner",
    icon: <Ic.diner />,
  },
  {
    role: "restaurant_manager",
    title: "I manage a restaurant",
    description:
      "Claim your venue from Google Places, configure your reservation policy, and let deterministic agents triage tonight's at-risk covers in real time.",
    bullets: [
      "Claim and verify your listing instantly",
      "Risk monitor + verified waitlist refill",
      "Audit log on every recovery action",
    ],
    cta: "Continue as a manager",
    icon: <Ic.policy />,
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
  const [submitting, setSubmitting] = useState<UserRole | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const busy = submitting !== null || pending;

  async function pick(role: UserRole) {
    setSubmitting(role);
    setError(null);
    const res = await fetch("/api/users/role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    setSubmitting(null);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Could not update role.");
      return;
    }
    const target = nextPath && nextPath !== "/onboarding" ? nextPath : data.redirectTo;
    startTransition(() => {
      router.push(target);
      router.refresh();
    });
  }

  const isActive = (role: UserRole) => {
    if (role === "diner") return currentRole === "diner" || currentRole === "replacement_diner";
    return currentRole === role;
  };

  return (
    <div className="grid-2" style={{ gap: 16 }}>
      {choices.map((choice) => {
        const active = isActive(choice.role);
        return (
          <button
            key={choice.role}
            type="button"
            className="card"
            onClick={() => pick(choice.role)}
            disabled={busy}
            style={{
              textAlign: "left",
              cursor: busy ? "wait" : "pointer",
              padding: 0,
              border: active ? "1px solid var(--accent)" : undefined,
              boxShadow: active ? "0 0 0 3px color-mix(in oklab, var(--accent) 18%, transparent)" : undefined,
              background: "var(--bg-elev)",
            }}
          >
            <div className="card-head">
              <span className="ic" style={{ color: "var(--accent-deep)" }}>{choice.icon}</span>
              <h3 style={{ margin: 0 }}>{choice.title}</h3>
            </div>
            <div className="card-body col" style={{ gap: 10 }}>
              <p className="muted" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55 }}>
                {choice.description}
              </p>
              <ul style={{ margin: 0, paddingLeft: 18, color: "var(--ink-2)", fontSize: 12.5, lineHeight: 1.7 }}>
                {choice.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
            <div className="card-foot">
              <span className="btn sm primary">
                {submitting === choice.role
                  ? "Saving…"
                  : pending && active
                    ? "Loading…"
                    : choice.cta}{" "}
                <Ic.arrow />
              </span>
            </div>
          </button>
        );
      })}
      {error && (
        <div className="notice" style={{ gridColumn: "1 / -1", color: "var(--danger)" }}>
          {error}
        </div>
      )}
    </div>
  );
}
