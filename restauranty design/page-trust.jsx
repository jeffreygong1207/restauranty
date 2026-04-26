/* global React, RFCore */

function Trust() {
  const { Ic, SUSPICIOUS, MetricCard } = RFCore;
  const riskTone = { High: 'danger', Medium: 'warn', Low: 'neutral' };
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Admin / Trust</h1>
          <p className="page-sub">Anti-hoarding, anti-scalping, anti-bot. The fairness layer that keeps ResoFlow ethical.</p>
        </div>
        <div className="row">
          <button className="btn"><Ic.filter/> Filter</button>
          <button className="btn primary">Export audit log</button>
        </div>
      </div>

      <div className="grid-metrics-4" style={{ marginBottom: 18 }}>
        <MetricCard label="Suspicious accounts blocked" value="6" delta="+2 last hour" deltaTone="neg" icon={<Ic.shield/>}/>
        <MetricCard label="Excessive reservation holders" value="3" delta="3+ active reservations" icon={<Ic.user/>}/>
        <MetricCard label="Above-policy transfer attempts" value="5" delta="all blocked" deltaTone="pos" icon={<Ic.x/>}/>
        <MetricCard label="Unverified replacement diners" value="11" delta="held for review" icon={<Ic.user/>}/>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="card-head">
            <h3>Suspicious activity</h3>
            <span className="sub">Last 24 hours</span>
          </div>
          <table className="tbl">
            <thead>
              <tr><th>Account</th><th>Behavior</th><th>Risk</th><th>Action</th><th></th></tr>
            </thead>
            <tbody>
              {SUSPICIOUS.map(s => (
                <tr key={s.account}>
                  <td className="mono" style={{ fontWeight: 600 }}>{s.account}</td>
                  <td style={{ fontSize: 12.5 }}>{s.behavior}</td>
                  <td><span className={`badge ${riskTone[s.risk]}`}><span className="b-dot"/>{s.risk}</span></td>
                  <td style={{ fontSize: 12.5 }}>{s.action}</td>
                  <td><button className="btn sm">Review</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col" style={{ gap: 16 }}>
          <div className="card">
            <div className="card-head"><h3>Available actions</h3></div>
            <div className="card-body">
              <ActionRow icon={<Ic.shield/>} label="Require human verification" desc="Force a verification step on the next booking attempt."/>
              <ActionRow icon={<Ic.dollar/>} label="Cap fee" desc="Limit any added fees on this account to policy cap ($0)."/>
              <ActionRow icon={<Ic.x/>} label="Block account" desc="Prevent this account from booking, transferring, or claiming."/>
              <ActionRow icon={<Ic.refresh/>} label="Reclaim reservation" desc="Pull the reservation back to the restaurant for review."/>
              <ActionRow icon={<Ic.user/>} label="Send to restaurant review" desc="Surface this case to the venue manager with full context."/>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Trust posture</h3></div>
            <div className="card-body">
              <div className="kv"><span className="k">Verification rate</span><span className="v">94%</span></div>
              <div className="kv"><span className="k">Bot-like blocks (7d)</span><span className="v">38</span></div>
              <div className="kv"><span className="k">Hoarding interventions (7d)</span><span className="v">12</span></div>
              <div className="kv"><span className="k">False positive rate</span><span className="v">2.1%</span></div>
              <div style={{ marginTop: 12, padding: 12, background: 'var(--bg-sunken)', borderRadius: 8, fontSize: 12.5, color: 'var(--ink-3)', borderLeft: '3px solid var(--success)' }}>
                Every block is reviewable. Every action is logged. Diners can appeal within 7 days.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionRow({ icon, label, desc }) {
  return (
    <div className="row" style={{ padding: '10px 0', borderBottom: '1px dashed var(--line)', gap: 12 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--bg-sunken)', display: 'grid', placeItems: 'center', color: 'var(--ink-3)' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        <div className="muted" style={{ fontSize: 12 }}>{desc}</div>
      </div>
      <button className="btn sm">Apply</button>
    </div>
  );
}

window.Trust = Trust;
