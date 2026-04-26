/* global React, RFCore */

function RiskDetail({ goto }) {
  const { Ic, RISK_FACTORS, RiskScoreBadge, StatusBadge } = RFCore;
  const score = 82;
  const circ = 2 * Math.PI * 90;
  const dash = (score / 100) * circ;
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <button className="btn ghost sm" onClick={() => goto('overview')} style={{ marginBottom: 6, marginLeft: -8 }}>← Back to monitor</button>
          <h1 className="page-title">Katsuya West Hollywood — 8:15 PM</h1>
          <p className="page-sub">Reservation #KW-19284 · Booked April 15 · Party of 2</p>
        </div>
        <div className="row">
          <StatusBadge state="action"/>
          <button className="btn">Open in Resy</button>
          <button className="btn accent" onClick={() => goto('recovery')}><Ic.bolt/> Activate recovery</button>
        </div>
      </div>

      <div className="split">
        <div className="col" style={{ gap: 16 }}>
          <div className="card">
            <div className="card-head"><h3>Reservation summary</h3></div>
            <div className="card-body">
              <div className="grid-2" style={{ gap: 24 }}>
                <div>
                  <div className="kv"><span className="k">Party size</span><span className="v">2</span></div>
                  <div className="kv"><span className="k">Tonight at</span><span className="v">8:15 PM</span></div>
                  <div className="kv"><span className="k">Booked</span><span className="v">11 days ago</span></div>
                  <div className="kv"><span className="k">Reminder sent</span><span className="v">24h ago · unopened</span></div>
                </div>
                <div>
                  <div className="kv"><span className="k">Final confirmation</span><span className="v" style={{ color: 'var(--warn)' }}>Pending</span></div>
                  <div className="kv"><span className="k">Restaurant policy</span><span className="v">Refill enabled</span></div>
                  <div className="kv"><span className="k">Cancellation fee</span><span className="v">$40 after 6:00 PM</span></div>
                  <div className="kv"><span className="k">Card on file</span><span className="v">Visa ····4421</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Risk factors</h3>
              <span className="sub">7 weighted signals</span>
            </div>
            <div className="card-body">
              {RISK_FACTORS.map(f => {
                const pct = Math.min(48, Math.abs(f.w) * 1.5);
                return (
                  <div key={f.name} className="factor">
                    <div className="nm">{f.name}</div>
                    <div className="vis"><span className={f.w > 0 ? 'up' : 'down'} style={{ width: `${pct}%` }}/></div>
                    <div className={`w ${f.w > 0 ? 'up' : 'down'}`}>{f.w > 0 ? `+${f.w}` : f.w}</div>
                  </div>
                );
              })}
              <div style={{ marginTop: 14, padding: 12, background: 'var(--bg-sunken)', borderRadius: 8, fontSize: 12.5, color: 'var(--ink-3)', borderLeft: '3px solid var(--accent)' }}>
                ResoFlow does not predict the future with certainty. It identifies risk signals early enough for restaurants to intervene.
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Recommended action</h3></div>
            <div className="card-body">
              <p style={{ margin: '0 0 14px', fontSize: 14, color: 'var(--ink-2)' }}>
                Send final confirmation now. If no response within 15 minutes, activate verified waitlist recovery.
              </p>
              <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                <button className="btn accent">Send final confirmation</button>
                <button className="btn primary" onClick={() => goto('recovery')}>Activate recovery flow</button>
                <button className="btn">Hold reservation</button>
                <button className="btn">Mark as confirmed</button>
                <button className="btn danger">Reclaim table</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col" style={{ gap: 16 }}>
          <div className="card">
            <div className="card-head"><h3>No-show risk score</h3></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <div className="score-viz">
                <svg width="220" height="220" viewBox="0 0 220 220">
                  <circle cx="110" cy="110" r="90" fill="none" stroke="var(--bg-sunken)" strokeWidth="14"/>
                  <circle cx="110" cy="110" r="90" fill="none" stroke="var(--risk-high)" strokeWidth="14" strokeLinecap="round"
                    strokeDasharray={`${dash} ${circ}`}/>
                </svg>
                <div className="center">
                  <div className="n">{score}</div>
                  <div className="d">/ 100</div>
                  <div className="lab">High risk</div>
                </div>
              </div>
              <div style={{ textAlign: 'center', maxWidth: 260, fontSize: 12.5, color: 'var(--ink-3)' }}>
                Intervention recommended within 18 minutes to maximize successful refill.
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Diner profile</h3></div>
            <div className="card-body">
              <div className="row" style={{ gap: 12 }}>
                <div className="avatar av-2" style={{ width: 40, height: 40, borderRadius: 12, fontSize: 13, color: 'white' }}>DK</div>
                <div>
                  <div style={{ fontWeight: 600 }}>Daniel K.</div>
                  <div className="muted" style={{ fontSize: 12 }}>Verified diner · Member since 2024</div>
                </div>
              </div>
              <div className="divider"/>
              <div className="kv"><span className="k">Reservations completed</span><span className="v">14</span></div>
              <div className="kv"><span className="k">Late cancellations</span><span className="v" style={{ color: 'var(--warn)' }}>1 (Feb 2026)</span></div>
              <div className="kv"><span className="k">No-shows</span><span className="v">0</span></div>
              <div className="kv"><span className="k">Average notice</span><span className="v">16 hours</span></div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>If recovered</h3></div>
            <div className="card-body">
              <div className="kv"><span className="k">Estimated revenue protected</span><span className="v">$180</span></div>
              <div className="kv"><span className="k">Backup diners ready</span><span className="v">4 verified</span></div>
              <div className="kv"><span className="k">Top match ETA</span><span className="v">Maya C. · 18 min</span></div>
              <div className="kv"><span className="k">Diner fee</span><span className="v" style={{ color: 'var(--success)' }}>Waived per policy</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.RiskDetail = RiskDetail;
