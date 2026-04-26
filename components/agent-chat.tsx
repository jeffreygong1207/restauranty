"use client";

import { useState } from "react";
import { Ic } from "./restauranty-core";

export function AgentChat({ reservationId }: { reservationId?: string }) {
  const [message, setMessage] = useState("Why is this reservation risky?");
  const [reply, setReply] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function send() {
    setBusy(true);
    const res = await fetch("/api/agentverse/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, reservationId }),
    });
    const data = await res.json();
    setReply(data.reply ?? data.error ?? "No reply");
    setBusy(false);
  }

  return (
    <div className="card">
      <div className="card-head">
        <h3>Local Chat Protocol tester</h3>
        <span className="sub">Agentverse-compatible payload</span>
      </div>
      <div className="card-body">
        <div className="field">
          <label>Manager intent</label>
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} />
        </div>
        <button className="btn accent" onClick={send} disabled={busy} style={{ marginTop: 10 }}>
          <Ic.agents /> {busy ? "Thinking..." : "Ask recovery agent"}
        </button>
        {reply && <div className="notice" style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{reply}</div>}
      </div>
    </div>
  );
}
