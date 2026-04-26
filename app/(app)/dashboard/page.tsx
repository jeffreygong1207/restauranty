import Link from "next/link";
import { Ic, MetricCard, PageHead, ReservationTable, fmtMoney, IntegrationStatusCard, SponsorTrackCard } from "@/components/restauranty-core";
import { dashboardData } from "@/lib/view-models";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await dashboardData();
  return (
    <div className="page">
      <PageHead
        title="Tonight's Reservation Recovery"
        subtitle="Live monitor of at-risk reservations, verified waitlists, and integration health."
        actions={
          <>
            <Link className="btn" href="/reservations"><Ic.filter /> Filter</Link>
            <Link className="btn primary" href="/reservations/new"><Ic.plus /> New reservation</Link>
          </>
        }
      />
      <div className="grid-metrics" style={{ marginBottom: 18 }}>
        <MetricCard label="At-risk reservations" value={data.metrics.atRisk} delta="+3 vs avg Sat" deltaTone="neg" icon={<Ic.risk />} sparkData={[3, 4, 5, 7, 6, 8, data.metrics.atRisk]} sparkColor="var(--danger)" />
        <MetricCard label="Recovery-ready covers" value={data.metrics.recoveryReadyCovers} delta="verified diners standing by" deltaTone="pos" icon={<Ic.waitlist />} sparkData={[1, 2, 2, 3, data.metrics.recoveryReadyCovers]} />
        <MetricCard label="Revenue at risk" value={fmtMoney(data.metrics.revenueAtRisk)} delta="from high-risk reservations" icon={<Ic.dollar />} sparkData={[120, 220, 360, data.metrics.revenueAtRisk]} sparkColor="var(--warn)" />
        <MetricCard label="Verified diners available" value={data.metrics.verifiedCandidates} delta="World ID or demo verified" deltaTone="pos" icon={<Ic.user />} sparkData={[1, 1, 2, data.metrics.verifiedCandidates]} sparkColor="var(--success)" />
        <MetricCard label="Suspicious activity blocked" value={data.metrics.suspiciousBlocked} delta="policy and fairness gates" icon={<Ic.shield />} sparkData={[1, 2, 3, data.metrics.suspiciousBlocked]} sparkColor="var(--ink-3)" />
      </div>

      <div className="split">
        <div className="card">
          <div className="card-head">
            <h3>Live Risk Monitor</h3>
            <span className="sub">{data.rows.length} active reservations</span>
            <span className="chip" style={{ marginLeft: "auto" }}><span className="live-dot" /> Live</span>
          </div>
          <ReservationTable rows={data.rows} />
        </div>
        <div className="col" style={{ gap: 16 }}>
          <div className="card">
            <div className="card-head"><h3>Integration health</h3></div>
            <div className="card-body col">
              {data.integrations.slice(0, 5).map((integration) => (
                <IntegrationStatusCard key={integration.provider} integration={integration} />
              ))}
            </div>
          </div>
          <SponsorTrackCard title="Connect the dots" sponsor="Arista" desc="Restaurants, diners, waitlists, verification, SMS, agents, and public restaurant APIs are routed into one recovery workflow." />
        </div>
      </div>
    </div>
  );
}
