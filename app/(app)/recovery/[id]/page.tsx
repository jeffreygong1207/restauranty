import { notFound } from "next/navigation";
import { AgentRunLog, AuditLogTable, Card, PageHead, RecoveryTimeline, RiskFactors, StatusBadge, WaitlistCandidateCard, fmtMoney, fmtTime } from "@/components/restauranty-core";
import { RecoveryActionPanel } from "@/components/recovery-action-panel";
import { recoveryDetailData } from "@/lib/view-models";

export const dynamic = "force-dynamic";

export default async function RecoveryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await recoveryDetailData(id);
  if (!data) notFound();
  return (
    <div className="page">
      <PageHead title={`Recovery flow - ${data.restaurant.name} ${fmtTime(data.reservation.startTime)}`} subtitle="Risk, policy, waitlist ranking, fairness review, manager approval, settlement, and Agentverse status." actions={<StatusBadge state={data.recoveryRequest?.status ?? "waiting"}>{data.recoveryRequest?.status?.replaceAll("_", " ") ?? "Ready"}</StatusBadge>} />
      <div className="split">
        <div className="col" style={{ gap: 16 }}>
          <Card title="Pipeline" subtitle="Deterministic agent trace">
            <RecoveryTimeline logs={data.agentLogs} />
          </Card>
          <Card title="Waitlist ranking" subtitle={`${data.rankedCandidates.length} matches`}>
            <div className="col">
              {data.rankedCandidates.map((candidate, index) => (
                <WaitlistCandidateCard key={candidate._id} candidate={candidate} diner={data.diners.find((diner) => diner._id === candidate.dinerId)} recommended={index === 0} />
              ))}
            </div>
          </Card>
          <Card title="Audit log">
            <AuditLogTable logs={data.auditLogs} />
          </Card>
        </div>
        <div className="col" style={{ gap: 16 }}>
          <Card title="Reservation summary">
            <div className="kv"><span className="k">Diner</span><span className="v">{data.diner.name}</span></div>
            <div className="kv"><span className="k">Party</span><span className="v">{data.reservation.partySize}</span></div>
            <div className="kv"><span className="k">Risk</span><span className="v">{data.risk.score}/100</span></div>
            <div className="kv"><span className="k">Revenue protected</span><span className="v">{fmtMoney(data.reservation.estimatedRevenue)}</span></div>
          </Card>
          <Card title="Policy decision">
            <div className="notice">{data.policyDecision.explanation}</div>
            <div className="divider" />
            {data.policyDecision.warnings.map((warning) => <div key={warning} className="kv"><span className="k">Warning</span><span className="v">{warning}</span></div>)}
          </Card>
          <Card title="Risk factors">
            <RiskFactors factors={data.risk.factors} />
          </Card>
          <RecoveryActionPanel reservationId={data.reservation._id} />
          <Card title="Live log">
            <AgentRunLog logs={data.agentLogs} />
          </Card>
        </div>
      </div>
    </div>
  );
}
