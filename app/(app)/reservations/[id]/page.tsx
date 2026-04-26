import Link from "next/link";
import { AgentRunLog, AuditLogTable, Card, Ic, PageHead, RiskFactors, RiskScoreBadge, StatusBadge, fmtMoney, fmtTime } from "@/components/restauranty-core";
import { RecoveryActionPanel } from "@/components/recovery-action-panel";
import { reservationDetailData } from "@/lib/view-models";

export const dynamic = "force-dynamic";

export default async function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await reservationDetailData(id);
  if (!data) {
    return (
      <div className="page" style={{ maxWidth: 720, margin: "0 auto" }}>
        <PageHead
          title="Reservation not found"
          subtitle="This reservation isn't visible from this server yet — it may still be syncing."
          actions={
            <Link className="btn primary" href="/reservations">
              Back to all reservations
            </Link>
          }
        />
        <div className="card">
          <div className="card-body col" style={{ gap: 10, fontSize: 13.5 }}>
            <p style={{ margin: 0 }}>
              If you just created this reservation, it may take a moment to appear. Refresh, or
              return to the reservation table — the booking has already been recorded.
            </p>
            <div className="row" style={{ gap: 8 }}>
              <Link className="btn" href={`/reservations/${id}`}>
                Refresh
              </Link>
              <Link className="btn" href="/reservations">
                View all reservations
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const circ = 2 * Math.PI * 90;
  const dash = (Math.max(0, Math.min(100, data.risk.score)) / 100) * circ;
  const riskColor =
    data.risk.level === "high"
      ? "var(--risk-high)"
      : data.risk.level === "medium"
        ? "var(--risk-med)"
        : "var(--risk-low)";
  return (
    <div className="page">
      <PageHead
        title={`${data.restaurant.name} - ${fmtTime(data.reservation.startTime)}`}
        subtitle={`Reservation ${data.reservation._id} · Party of ${data.reservation.partySize} · ${data.diner.name}`}
        actions={
          <>
            <StatusBadge state={data.risk.level}>{data.risk.level} risk</StatusBadge>
            <Link className="btn accent" href={`/recovery/${data.reservation._id}`}><Ic.bolt /> Recovery view</Link>
          </>
        }
      />
      <div className="split">
        <div className="col" style={{ gap: 16 }}>
          <Card title="Reservation summary">
            <div className="grid-2" style={{ gap: 24 }}>
              <div>
                <div className="kv"><span className="k">Party size</span><span className="v">{data.reservation.partySize}</span></div>
                <div className="kv"><span className="k">Date</span><span className="v">{data.reservation.date}</span></div>
                <div className="kv"><span className="k">Start time</span><span className="v">{fmtTime(data.reservation.startTime)}</span></div>
                <div className="kv"><span className="k">Reminder opened</span><span className="v">{data.reservation.reminderOpened ? "Yes" : "No"}</span></div>
              </div>
              <div>
                <div className="kv"><span className="k">Confirmation</span><span className="v">{data.reservation.confirmationStatus}</span></div>
                <div className="kv"><span className="k">Policy</span><span className="v">{data.policy.waitlistRefillEnabled ? "Refill enabled" : "Refill disabled"}</span></div>
                <div className="kv"><span className="k">Cancellation fee</span><span className="v">{fmtMoney(data.reservation.cancellationFee)}</span></div>
                <div className="kv"><span className="k">Card on file</span><span className="v">{data.reservation.cardOnFile ? "Yes" : "No"}</span></div>
              </div>
            </div>
          </Card>
          <Card title="Risk factors" subtitle={`${data.risk.factors.length} weighted signals`}>
            <RiskFactors factors={data.risk.factors} />
            <div className="notice" style={{ marginTop: 14 }}>{data.risk.explanation}</div>
          </Card>
          <RecoveryActionPanel reservationId={data.reservation._id} />
          <Card title="Audit history">
            <AuditLogTable logs={data.auditLogs} />
          </Card>
        </div>
        <div className="col" style={{ gap: 16 }}>
          <Card title="No-show risk score">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div className="score-viz">
                <svg width="220" height="220" viewBox="0 0 220 220">
                  <circle cx="110" cy="110" r="90" fill="none" stroke="var(--bg-sunken)" strokeWidth="14" />
                  <circle cx="110" cy="110" r="90" fill="none" stroke={riskColor} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} />
                </svg>
                <div className="center">
                  <div className="n">{data.risk.score}</div>
                  <div className="d">/ 100</div>
                  <div className="lab" style={{ color: riskColor }}>{data.risk.level} risk</div>
                </div>
              </div>
              <RiskScoreBadge score={data.risk.score} />
            </div>
          </Card>
          <Card title="Diner profile">
            <div className="row" style={{ gap: 12 }}>
              <div className="avatar av-2" style={{ width: 40, height: 40, borderRadius: 12, fontSize: 13, color: "white" }}>{data.diner.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}</div>
              <div>
                <div style={{ fontWeight: 600 }}>{data.diner.name}</div>
                <div className="muted" style={{ fontSize: 12 }}>{data.diner.verifiedHuman ? "Verified diner" : "Unverified diner"}</div>
              </div>
            </div>
            <div className="divider" />
            <div className="kv"><span className="k">Completed</span><span className="v">{data.diner.completedReservations}</span></div>
            <div className="kv"><span className="k">Late cancellations</span><span className="v">{data.diner.lateCancellationCount}</span></div>
            <div className="kv"><span className="k">No-shows</span><span className="v">{data.diner.noShowCount}</span></div>
            <div className="kv"><span className="k">Trust score</span><span className="v">{data.diner.trustScore}</span></div>
          </Card>
          <Card title="Agent history">
            <AgentRunLog logs={data.agentLogs} />
          </Card>
        </div>
      </div>
    </div>
  );
}
