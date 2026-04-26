import { AgentRunLog, AuditLogTable, MetricCard, PageHead, SponsorEventsTable, Ic } from "@/components/restauranty-core";
import { adminData } from "@/lib/view-models";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await adminData();
  return (
    <div className="page">
      <PageHead title="Admin" subtitle="Suspicious activity, audit logs, sponsor events, integration health, and smoke-test posture." />
      <div className="grid-metrics-4" style={{ marginBottom: 18 }}>
        <MetricCard label="Audit log entries" value={data.auditLogs.length} icon={<Ic.shield />} />
        <MetricCard label="Agent runs" value={data.agentRuns.length} icon={<Ic.agents />} />
        <MetricCard label="Sponsor events" value={data.sponsorEvents.length} icon={<Ic.spark />} />
        <MetricCard label="Integrations configured" value={data.integrations.filter((item) => item.configured).length} icon={<Ic.check />} />
      </div>
      <div className="grid-2">
        <div className="card"><div className="card-head"><h3>Audit logs</h3></div><AuditLogTable logs={data.auditLogs} /></div>
        <div className="card"><div className="card-head"><h3>Sponsor events</h3></div><SponsorEventsTable events={data.sponsorEvents} /></div>
        <div className="card"><div className="card-head"><h3>Agent log</h3></div><div className="card-body"><AgentRunLog logs={data.agentLogs} /></div></div>
        <div className="card"><div className="card-head"><h3>Smoke-test coverage</h3></div><div className="card-body notice">scripts/smoke-test.ts validates env loading, optional MongoDB, seed data, risk scoring, policy blocking, waitlist ranking, fairness blocking, audit logs, sponsor events, and build availability.</div></div>
      </div>
    </div>
  );
}
