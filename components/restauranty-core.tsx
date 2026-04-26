import Link from "next/link";
import type {
  AgentLog,
  AuditLog,
  Diner,
  ExternalIntegration,
  Reservation,
  Restaurant,
  RiskFactor,
  SponsorEvent,
  WaitlistCandidate,
} from "@/lib/types";

type IconProps = React.SVGProps<SVGSVGElement>;

export const Ic = {
  overview: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  risk: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 2 2 21h20L12 2z" />
      <path d="M12 9v5" />
      <circle cx="12" cy="17.5" r="0.6" fill="currentColor" />
    </svg>
  ),
  recovery: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 4v5h-5" />
    </svg>
  ),
  waitlist: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M17 6h4M19 4v4M16 14h5M16 18h3" />
    </svg>
  ),
  policy: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 4h11l4 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <path d="M16 4v4h4M8 12h8M8 16h6" />
    </svg>
  ),
  agents: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="6" y="9" width="12" height="10" rx="2" />
      <path d="M12 9V5" />
      <circle cx="12" cy="4" r="1.5" />
      <path d="M9 14h.01M15 14h.01M3 13v3M21 13v3" />
    </svg>
  ),
  trust: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  diner: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 3v18M8 3v6c0 2-1.8 3-4 3M16 3c-1.5 2.5-1.5 5 0 8v10" />
    </svg>
  ),
  search: (p: IconProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  ),
  bell: (p: IconProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 0 0 4 0" />
    </svg>
  ),
  arrow: (p: IconProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  ),
  check: (p: IconProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12.5l5 5L20 7" />
    </svg>
  ),
  x: (p: IconProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  clock: (p: IconProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  user: (p: IconProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  ),
  bolt: (p: IconProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  ),
  shield: (p: IconProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
    </svg>
  ),
  spark: (p: IconProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2" />
    </svg>
  ),
  dollar: (p: IconProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7" />
    </svg>
  ),
  filter: (p: IconProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 5h18l-7 9v6l-4-2v-4z" />
    </svg>
  ),
  plus: (p: IconProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  refresh: (p: IconProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 12a9 9 0 0 1-15.7 6M21 4v5h-5M3 12a9 9 0 0 1 15.7-6M3 20v-5h5" />
    </svg>
  ),
  ext: (p: IconProps) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14 4h6v6M10 14 20 4M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" />
    </svg>
  ),
};

export function StatusBadge({ state, children }: { state: string; children?: React.ReactNode }) {
  const map: Record<string, string> = {
    low: "success",
    medium: "warn",
    high: "danger",
    critical: "danger",
    healthy: "success",
    monitoring: "warn",
    flagged: "danger",
    recovery: "accent",
    action: "warn",
    confirmed: "success",
    completed: "success",
    active: "accent",
    waiting: "neutral",
    blocked: "danger",
    approved: "success",
    recovered: "success",
    configured: "success",
    missing: "warn",
    error: "danger",
    ok: "success",
  };
  return (
    <span className={`badge ${map[state] ?? "neutral"}`}>
      <span className="b-dot" />
      {children ?? state}
    </span>
  );
}

export function RiskScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "var(--risk-high)" : score >= 50 ? "var(--risk-med)" : "var(--risk-low)";
  return (
    <span className="risk-pill" style={{ borderColor: color }}>
      <span className="bar">
        <span style={{ background: color, width: `${score}%` }} />
      </span>
      {score}
    </span>
  );
}

export function Sparkline({ data, color = "var(--accent)" }: { data: number[]; color?: string }) {
  const w = 100;
  const h = 22;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MetricCard({
  label,
  value,
  unit,
  delta,
  deltaTone,
  icon,
  sparkColor = "var(--accent)",
  sparkData,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  delta?: string;
  deltaTone?: "pos" | "neg";
  icon?: React.ReactNode;
  sparkColor?: string;
  sparkData?: number[];
}) {
  return (
    <div className="metric">
      <div className="label">
        {icon}
        {label}
      </div>
      <div className="v">
        {value}
        {unit && <span className="unit">{unit}</span>}
      </div>
      {delta && <div className={`delta ${deltaTone ?? ""}`}>{delta}</div>}
      {sparkData && <Sparkline data={sparkData} color={sparkColor} />}
    </div>
  );
}

export function PageHead({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-sub">{subtitle}</p>
      </div>
      {actions && <div className="row">{actions}</div>}
    </div>
  );
}

export function Card({
  title,
  subtitle,
  children,
  footer,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="card">
      {title && (
        <div className="card-head">
          <h3>{title}</h3>
          {subtitle && <span className="sub">{subtitle}</span>}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-foot">{footer}</div>}
    </div>
  );
}

export function fmtMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function fmtTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;
  const d = new Date(2026, 0, 1, hour, minute);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function ReservationTable({
  rows,
}: {
  rows: Array<{ reservation: Reservation; restaurant?: Restaurant; diner?: Diner }>;
}) {
  return (
    <table className="tbl">
      <thead>
        <tr>
          <th>Time</th>
          <th>Restaurant / Diner</th>
          <th>Party</th>
          <th>Status</th>
          <th>Risk</th>
          <th>Recommended action</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {rows.map(({ reservation, restaurant, diner }) => (
          <tr key={reservation._id} className={reservation.riskScore >= 80 ? "row-action" : ""}>
            <td className="num">{fmtTime(reservation.startTime)}</td>
            <td>
              <div style={{ fontWeight: 600 }}>{restaurant?.name ?? reservation.restaurantId}</div>
              <div className="muted" style={{ fontSize: 11.5 }}>
                {diner?.name ?? reservation.dinerId} · {reservation.date}
              </div>
            </td>
            <td className="num">x{reservation.partySize}</td>
            <td>
              <StatusBadge state={reservation.status}>{reservation.status.replaceAll("_", " ")}</StatusBadge>
            </td>
            <td>
              <RiskScoreBadge score={reservation.riskScore} />
            </td>
            <td style={{ fontSize: 12.5 }}>{reservation.recommendedAction}</td>
            <td>
              <Link className="btn sm" href={`/reservations/${reservation._id}`}>
                Open
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function RiskFactors({ factors }: { factors: RiskFactor[] }) {
  return (
    <>
      {factors.map((factor) => {
        const pct = Math.min(48, Math.abs(factor.weight) * 1.5);
        return (
          <div key={factor.name} className="factor">
            <div className="nm">{factor.name}</div>
            <div className="vis">
              <span className={factor.weight > 0 ? "up" : "down"} style={{ width: `${pct}%` }} />
            </div>
            <div className={`w ${factor.weight > 0 ? "up" : "down"}`}>
              {factor.weight > 0 ? `+${factor.weight}` : factor.weight}
            </div>
          </div>
        );
      })}
    </>
  );
}

export function WaitlistCandidateCard({
  candidate,
  diner,
  recommended,
}: {
  candidate: WaitlistCandidate;
  diner?: Diner;
  recommended?: boolean;
}) {
  return (
    <div className={`cand ${recommended ? "recd" : ""}`}>
      <div className="av av-1">{(diner?.name ?? "??").split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
      <div>
        <div className="nm">{diner?.name ?? candidate.dinerId}</div>
        <div className="meta">
          <span>x{candidate.partySize}</span>
          <span>{candidate.distanceMiles} mi</span>
          <span>{candidate.arrivalEtaMinutes} min ETA</span>
          <span>{candidate.commitmentLevel.replaceAll("_", " ")}</span>
        </div>
      </div>
      <div className="right">
        <span className="pri">{candidate.priorityScore}</span>
        <StatusBadge state={candidate.verifiedHuman ? "completed" : "waiting"}>
          {candidate.verifiedHuman ? "Human verified" : "Needs verification"}
        </StatusBadge>
      </div>
    </div>
  );
}

export function AgentCard({ name, desc, stat, status, av = "av-1" }: { name: string; desc: string; stat: string; status: string; av?: string }) {
  const tone: Record<string, string> = { Active: "success", Matching: "accent", Awaiting: "warn", Idle: "neutral" };
  return (
    <div className="agent-card">
      <div className="head">
        <div className={`av ${av}`}>{name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
        <div style={{ flex: 1 }}>
          <div className="nm">{name}</div>
          <div className="st">{stat}</div>
        </div>
        <span className={`badge ${tone[status] ?? "neutral"}`}>
          <span className="b-dot" />
          {status}
        </span>
      </div>
      <p className="desc">{desc}</p>
    </div>
  );
}

export function RecoveryTimeline({ logs }: { logs: AgentLog[] }) {
  const steps = [
    "RiskAgent",
    "PolicyAgent",
    "ConfirmationAgent",
    "WaitlistAgent",
    "FairnessAgent",
    "RestaurantAgent",
    "SettlementAgent",
  ];
  return (
    <div className="flow">
      {steps.map((agent, i) => {
        const found = logs.find((log) => log.agentName === agent);
        const st = found ? "completed" : i <= logs.length ? "active" : "waiting";
        return (
          <div key={agent} className={`step ${st}`}>
            <div className="marker">{st === "completed" ? "✓" : i + 1}</div>
            <div className="body">
              <div className="agent">
                {agent} · <StatusBadge state={st}>{st === "completed" ? "Done" : st === "active" ? "Running" : "Waiting"}</StatusBadge>
              </div>
              <div className="title">{agent.replace("Agent", " Agent")}</div>
              <p className="desc">{found?.message ?? "Awaiting deterministic trace."}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AgentRunLog({ logs }: { logs: AgentLog[] }) {
  return (
    <div className="log">
      {logs.length === 0 && <div style={{ color: "var(--ink-4)" }}>Awaiting agent events</div>}
      {logs.map((log) => (
        <div key={log._id} className="ln">
          <span className="t">
            {new Date(log.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
          </span>
          <span className="agent">{log.agentName.replace("Agent", "")}</span>
          <span>{log.message}</span>
        </div>
      ))}
    </div>
  );
}

export function AuditLogTable({ logs }: { logs: AuditLog[] }) {
  return (
    <table className="tbl">
      <thead>
        <tr>
          <th>Time</th>
          <th>Actor</th>
          <th>Action</th>
          <th>Entity</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log._id}>
            <td className="num">{new Date(log.createdAt).toLocaleString()}</td>
            <td>{log.actorId ?? log.actorType}</td>
            <td>{log.action}</td>
            <td className="mono">{log.entityId}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function IntegrationStatusCard({ integration }: { integration: ExternalIntegration | { label: string; enabled: boolean; configured: boolean; provider: string } }) {
  const state = integration.configured ? "configured" : integration.enabled ? "missing" : "waiting";
  return (
    <div className="policy">
      <div className="top">
        <div>
          <h4>{"label" in integration ? integration.label : integration.provider}</h4>
          <p className="desc" style={{ marginTop: 4 }}>
            {integration.enabled ? "Enabled by feature flag" : "Disabled by feature flag"}
          </p>
        </div>
        <StatusBadge state={state}>{integration.configured ? "Configured" : integration.enabled ? "Missing" : "Disabled"}</StatusBadge>
      </div>
    </div>
  );
}

export function SponsorTrackCard({
  title,
  sponsor,
  desc,
}: {
  title: string;
  sponsor: string;
  desc: string;
}) {
  return (
    <div className="feature">
      <div className="ico">
        <Ic.spark />
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <span className="chip" style={{ marginTop: "auto" }}>
        {sponsor}
      </span>
    </div>
  );
}

export function SponsorEventsTable({ events }: { events: SponsorEvent[] }) {
  return (
    <table className="tbl">
      <thead>
        <tr>
          <th>Sponsor</th>
          <th>Event</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event._id}>
            <td>{event.sponsor}</td>
            <td>{event.eventType}</td>
            <td className="num">{new Date(event.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
