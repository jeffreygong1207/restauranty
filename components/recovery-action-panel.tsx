"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Ic, StatusBadge } from "./restauranty-core";

export function RecoveryActionPanel({ reservationId }: { reservationId: string }) {
  const router = useRouter();
  const [state, setState] = useState<string>("ready");
  const [message, setMessage] = useState<string | null>(null);

  async function run() {
    setState("active");
    const res = await fetch(`/api/recovery/${reservationId}/run`, { method: "POST" });
    const data = await res.json();
    setState(res.ok && data.ok ? "completed" : "error");
    setMessage(data.error ?? data.result?.explanation ?? "Recovery workflow completed.");
    router.refresh();
  }

  async function approve() {
    setState("active");
    const role = window.localStorage.getItem("restauranty-role") ?? "restaurant_manager";
    const res = await fetch(`/api/recovery/${reservationId}/approve`, {
      method: "POST",
      headers: { "x-restauranty-role": role },
    });
    const data = await res.json();
    setState(res.ok && data.ok ? "completed" : "error");
    setMessage(data.error ?? "Recovery approved and settled.");
    router.refresh();
  }

  return (
    <div className="card">
      <div className="card-head">
        <h3>Manager controls</h3>
        <StatusBadge state={state}>{state}</StatusBadge>
      </div>
      <div className="card-body">
        <div className="row" style={{ flexWrap: "wrap" }}>
          <button className="btn accent" onClick={run} disabled={state === "active"}>
            <Ic.bolt /> Run recovery
          </button>
          <button className="btn primary" onClick={approve} disabled={state === "active"}>
            Approve refill
          </button>
        </div>
        {message && <div className="notice" style={{ marginTop: 12 }}>{message}</div>}
      </div>
    </div>
  );
}
