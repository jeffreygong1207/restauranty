import { DinerRescueFlow } from "@/components/diner-rescue-flow";

export default function DinerPage() {
  return (
    <div className="page" style={{ background: "var(--bg-sunken)", minHeight: "calc(100vh - 56px)" }}>
      <div className="diner-shell">
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <h1 style={{ fontSize: 24, letterSpacing: "-0.025em", margin: "0 0 6px", fontFamily: "var(--font-display)", fontWeight: 500 }}>Can&apos;t make your reservation?</h1>
          <p style={{ margin: 0, color: "var(--ink-3)", fontSize: 13.5 }}>Rescue it before it becomes a no-show.</p>
        </div>
        <DinerRescueFlow />
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11.5, color: "var(--ink-4)" }}>
          Restauranty follows restaurant policies. We never resell or markup your reservation.
        </div>
      </div>
    </div>
  );
}
