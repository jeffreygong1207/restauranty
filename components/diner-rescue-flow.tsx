"use client";

import { useState } from "react";
import { Ic } from "./restauranty-core";

export function DinerRescueFlow() {
  const [selected, setSelected] = useState("refill");
  const [submitted, setSubmitted] = useState(false);
  const opts = [
    { id: "confirm", label: "Confirm I am coming", desc: "Locks the reservation. We will see you at 8:15 PM." },
    { id: "release", label: "Release to restaurant", desc: "Hand the table back. Cancellation fee may apply per policy." },
    { id: "refill", label: "Request waitlist refill", desc: "If a verified diner takes the table, your fee may be waived.", recommended: true },
    { id: "transfer", label: "Transfer to verified diner", desc: "Restaurant approval required. Free transfer only, no resale." },
  ];

  if (submitted) {
    return (
      <div className="success-card" style={{ textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--success)", color: "white", display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
          <Ic.check />
        </div>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, letterSpacing: "-0.02em" }}>Waitlist refill requested</h2>
        <p style={{ margin: 0, color: "var(--ink-2)" }}>We will text you within 15 minutes. If a verified diner takes your table, your $40 fee will be waived automatically.</p>
        <div className="divider" />
        <div style={{ textAlign: "left" }}>
          <div className="kv"><span className="k">Reservation</span><span className="v">Katsuya · 8:15 PM</span></div>
          <div className="kv"><span className="k">Backup diners</span><span className="v">4 verified ready</span></div>
          <div className="kv"><span className="k">If refilled</span><span className="v" style={{ color: "var(--success)" }}>$40 fee waived</span></div>
        </div>
        <button className="btn ghost" style={{ marginTop: 14 }} onClick={() => setSubmitted(false)}>Change my decision</button>
      </div>
    );
  }

  return (
    <div className="diner-card">
      <div className="diner-photo">
        <div>
          <div className="name">Katsuya West Hollywood</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Tonight · 8:15 PM · Party of 2</div>
        </div>
      </div>
      <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5, color: "var(--ink-3)", marginBottom: 14 }}>
        <span><Ic.clock /> Cancellation policy: $40 fee after 6:00 PM</span>
        <span className="mono">2:43 left</span>
      </div>
      <div className="col" style={{ gap: 8 }}>
        {opts.map((o) => (
          <div key={o.id} className={`opt-row ${selected === o.id ? "selected" : ""} ${o.recommended ? "recommended" : ""}`} onClick={() => setSelected(o.id)}>
            <div className="radio" />
            <div style={{ flex: 1 }}>
              <div className="label">{o.label}</div>
              <div className="desc">{o.desc}</div>
            </div>
            {o.recommended && <span className="recd-tag">Recommended</span>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, padding: 12, background: "var(--bg-sunken)", borderRadius: 8, fontSize: 12.5, color: "var(--ink-3)", borderLeft: "3px solid var(--accent)" }}>
        <b style={{ color: "var(--ink-2)" }}>Why we recommend this:</b> If the restaurant fills your table, your cancellation fee is waived per Katsuya policy. No resale, no markup, verified diners only.
      </div>
      <button className="btn accent lg" style={{ width: "100%", marginTop: 14 }} onClick={() => setSubmitted(true)}>
        {selected === "confirm" ? "Lock my reservation" : selected === "release" ? "Release table" : selected === "refill" ? "Request waitlist refill" : "Request transfer"}
        <Ic.arrow />
      </button>
    </div>
  );
}
