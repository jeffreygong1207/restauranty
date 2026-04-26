import { AgentCard, PageHead, StatusBadge } from "@/components/restauranty-core";
import { AgentChat } from "@/components/agent-chat";
import { recoveryAgentManifest } from "@/lib/agents/agentverseAdapter";
import { adminData } from "@/lib/view-models";

export const dynamic = "force-dynamic";

const agents = [
  ["Confirmation Agent", "Reaches out to diners through SMS, push, and email to confirm intent before the cancellation window closes.", "Simulated/real SMS ready", "Idle", "av-2"],
  ["Risk Agent", "Scores each reservation continuously using deterministic behavior, timing, and history signals.", "Reservations scored", "Active", "av-1"],
  ["Policy Agent", "Reads restaurant policy and constrains every other agent. Refill, transfer, fees, caps.", "Policies governed", "Active", "av-7"],
  ["Waitlist Agent", "Matches verified diners to released tables by party size, cuisine, distance, and arrival ETA.", "Candidates ranked", "Matching", "av-3"],
  ["Fairness Agent", "Detects hoarding, scalping, bot-like velocity, and unverified accounts before they reach the restaurant.", "Blocks audited", "Active", "av-5"],
  ["Restaurant Agent", "Routes approval requests to managers with full context and role checks.", "Approvals gated", "Awaiting", "av-8"],
  ["Settlement Agent", "Records recovered cover, fee waiver, and sponsor events according to policy.", "Settlements persisted", "Idle", "av-4"],
  ["Explanation Agent", "Translates deterministic decisions into plain English without deciding business outcomes.", "Template fallback", "Idle", "av-6"],
] as const;

export default async function AgentsPage() {
  const manifest = recoveryAgentManifest();
  const { integrations } = await adminData();
  const agentverse = integrations.find((item) => item.provider === "agentverse");
  return (
    <div className="page">
      <PageHead title="Agent Room" subtitle="Eight specialized agents with deterministic execution, local chat, and Agentverse-visible framing." actions={<StatusBadge state={agentverse?.configured ? "configured" : "missing"}>{agentverse?.configured ? "Agentverse configured" : "Local agent mode"}</StatusBadge>} />
      <div className="split" style={{ gap: 18, alignItems: "start" }}>
        <div>
          <div className="sect-title">Agents</div>
          <div className="grid-2" style={{ gap: 12 }}>
            {agents.map(([name, desc, stat, status, av]) => (
              <AgentCard key={name} name={name} desc={desc} stat={stat} status={status} av={av} />
            ))}
          </div>
        </div>
        <div className="col" style={{ gap: 16 }}>
          <div className="card">
            <div className="card-head"><h3>Agentverse manifest</h3><span className="sub">{manifest.address}</span></div>
            <div className="card-body">
              <div className="notice">{manifest.framing}</div>
              <div className="divider" />
              {manifest.intents.map((intent) => <div className="kv" key={intent}><span className="k">Intent</span><span className="v">{intent}</span></div>)}
            </div>
          </div>
          <AgentChat reservationId="res_katsuya_815" />
        </div>
      </div>
    </div>
  );
}
