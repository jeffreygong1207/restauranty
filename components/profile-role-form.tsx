"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Ic } from "./restauranty-core";
import type { UserRole } from "@/lib/types";

const roles: { value: UserRole; label: string }[] = [
  { value: "diner", label: "Diner" },
  { value: "restaurant_manager", label: "Restaurant manager" },
  { value: "admin", label: "Admin (demo only)" },
];

export function ProfileRoleForm({ currentRole }: { currentRole: UserRole }) {
  const router = useRouter();
  const initialRole: UserRole = currentRole === "replacement_diner" ? "diner" : currentRole;
  const [role, setRole] = useState<UserRole>(initialRole);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/users/role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Could not save role.");
      return;
    }
    setMessage("Role updated.");
    router.refresh();
  }

  return (
    <div className="card">
      <div className="card-head">
        <h3>Role</h3>
      </div>
      <div className="card-body col" style={{ gap: 10 }}>
        <p className="muted" style={{ margin: 0, fontSize: 13 }}>
          Switch how Restauranty shows itself to you. Restaurants land on the operator dashboard;
          diners land on the reservation rescue flow.
        </p>
        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          {roles.map((option) => (
            <label
              key={option.value}
              className={`btn ${role === option.value ? "primary" : ""}`}
              style={{ cursor: "pointer" }}
            >
              <input
                type="radio"
                name="role"
                value={option.value}
                checked={role === option.value}
                onChange={(event) => setRole(event.target.value as UserRole)}
                style={{ marginRight: 6 }}
              />
              {option.label}
            </label>
          ))}
        </div>
        {message && <div className="notice">{message}</div>}
        {error && <div className="notice" style={{ color: "var(--danger)" }}>{error}</div>}
      </div>
      <div className="card-foot">
        <button className="btn primary" type="button" disabled={busy} onClick={save}>
          {busy ? "Saving…" : "Save role"} <Ic.check />
        </button>
      </div>
    </div>
  );
}
