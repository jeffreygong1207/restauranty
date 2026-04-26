import { Ic, MetricCard, PageHead, StatusBadge } from "@/components/restauranty-core";

export default function TrustPage() {
  const suspicious = [
    ["newuser_842", "5 high-demand reservations in 2 hours", "High", "Require verification"],
    ["tableflipLA", "Attempted fee above policy cap", "High", "Block transfer"],
    ["guest_193", "Duplicate waitlist claims across venues", "Medium", "Rate limit"],
    ["unknown_seller", "Unverified account, no booking history", "Medium", "Hold for review"],
  ];
  return (
    <div className="page">
      <PageHead title="Admin / Trust" subtitle="Anti-hoarding, anti-scalping, anti-bot fairness layer." />
      <div className="grid-metrics-4" style={{ marginBottom: 18 }}>
        <MetricCard label="Suspicious accounts blocked" value="6" delta="+2 last hour" deltaTone="neg" icon={<Ic.shield />} />
        <MetricCard label="Excessive reservation holders" value="3" delta="3+ active reservations" icon={<Ic.user />} />
        <MetricCard label="Above-policy transfer attempts" value="5" delta="all blocked" deltaTone="pos" icon={<Ic.x />} />
        <MetricCard label="Unverified replacement diners" value="11" delta="held for review" icon={<Ic.user />} />
      </div>
      <div className="card">
        <div className="card-head"><h3>Suspicious activity</h3><span className="sub">Last 24 hours</span></div>
        <table className="tbl">
          <thead><tr><th>Account</th><th>Behavior</th><th>Risk</th><th>Action</th></tr></thead>
          <tbody>
            {suspicious.map(([account, behavior, risk, action]) => (
              <tr key={account}>
                <td className="mono" style={{ fontWeight: 600 }}>{account}</td>
                <td>{behavior}</td>
                <td><StatusBadge state={risk === "High" ? "critical" : "medium"}>{risk}</StatusBadge></td>
                <td>{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
