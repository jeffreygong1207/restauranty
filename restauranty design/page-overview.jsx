/* global React, RFCore */

function Overview({ goto, setSelectedRes }) {
  const { Ic, RESERVATIONS, MetricCard, RiskScoreBadge, StatusBadge } = RFCore;
  const [selected, setSelected] = React.useState('r1');
  const sel = RESERVATIONS.find(r => r.id === selected);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Tonight’s Reservation Recovery</h1>
          <p className="page-sub">Live monitor of at-risk reservations · Saturday, April 26 · 5:12 PM</p>
        </div>
        <div className="row">
          <button className="btn"><Ic.filter/> Filter</button>
          <button className="btn"><Ic.refresh/> Refresh</button>
          <button className="btn primary"><Ic.plus/> New reservation</button>
        </div>
      </div>

      <div className="grid-metrics" style={{ marginBottom: 18 }}>
        <MetricCard label="At-risk reservations" value="12" delta="+3 vs avg Sat" deltaTone="neg" icon={<Ic.risk/>} sparkData={[3,4,5,7,6,8,9,10,12]} sparkColor="var(--danger)"/>
        <MetricCard label="Recovery-ready covers" value="28" delta="14 verified diners standing by" deltaTone="pos" icon={<Ic.waitlist/>} sparkData={[12,14,18,22,24,26,28]} sparkColor="var(--accent)"/>
        <MetricCard label="Revenue at risk" value="$3,860" delta="$180 avg / cover" icon={<Ic.dollar/>} sparkData={[1200,1800,2400,2900,3200,3600,3860]} sparkColor="var(--warn)"/>
        <MetricCard label="Verified diners available" value="46" delta="within 5 mi tonight" deltaTone="pos" icon={<Ic.user/>} sparkData={[30,34,38,40,42,44,46]} sparkColor="var(--success)"/>
        <MetricCard label="Suspicious activity blocked" value="6" delta="2 last hour" icon={<Ic.shield/>} sparkData={[1,1,2,3,4,5,6]} sparkColor="var(--ink-3)"/>
      </div>

      <div className="split">
        <div className="card">
          <div className="card-head">
            <h3>Live Risk Monitor</h3>
            <span className="sub">5 active reservations</span>
            <div style={{ marginLeft: 'auto' }} className="row">
              <span className="chip"><span className="live-dot"/> Live</span>
              <button className="btn sm ghost"><Ic.ext/> Open full</button>
            </div>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Time</th><th>Restaurant / Table</th><th>Party</th>
                <th>Diner status</th><th>Risk</th><th>Recommended action</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {RESERVATIONS.map(r => (
                <tr key={r.id} className={r.id === selected ? 'row-action' : ''} onClick={() => setSelected(r.id)} style={{ cursor: 'pointer' }}>
                  <td className="num">{r.time}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.restaurant}</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>{r.area} · Table held</div>
                  </td>
                  <td className="num">×{r.party}</td>
                  <td>{r.status}</td>
                  <td><RiskScoreBadge score={r.risk}/></td>
                  <td style={{ fontSize: 12.5 }}>{r.action}</td>
                  <td><StatusBadge state={r.state}/></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="card-foot">
            <span>Updated 6 seconds ago</span>
            <span style={{ marginLeft: 'auto' }}>Showing 5 of 12 · <a style={{ color: 'var(--accent-deep)' }}>view all →</a></span>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Recommended next action</h3>
            <span className="badge accent">Selected</span>
          </div>
          <div className="card-body">
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 4 }}>{sel.time} · Party of {sel.party}</div>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em' }}>{sel.restaurant}</div>
            <div className="row" style={{ gap: 8, marginTop: 12 }}>
              <RiskScoreBadge score={sel.risk}/>
              <span className="muted" style={{ fontSize: 12 }}>{sel.status}</span>
            </div>

            <div className="divider"/>

            <div className="kv"><span className="k">Risk score</span><span className="v">{sel.risk}/100</span></div>
            <div className="kv"><span className="k">Main reason</span><span className="v">Missed confirmation window</span></div>
            <div className="kv"><span className="k">Backup diners ready</span><span className="v">4 verified</span></div>
            <div className="kv"><span className="k">Revenue protected if recovered</span><span className="v">${sel.revenue}</span></div>

            <div style={{ marginTop: 14, padding: 12, background: 'var(--accent-soft)', borderRadius: 8, fontSize: 12.5, color: 'var(--accent-deep)' }}>
              <b>Suggested:</b> Send final confirmation now. If no response in 15 min, activate verified waitlist refill.
            </div>

            <div className="row" style={{ marginTop: 14, gap: 8, flexWrap: 'wrap' }}>
              <button className="btn accent" onClick={() => goto('recovery')}><Ic.bolt/> Activate recovery flow</button>
              <button className="btn" onClick={() => { setSelectedRes(sel.id); goto('detail'); }}>View detail</button>
            </div>
            <button className="btn ghost sm" style={{ marginTop: 8 }}>Send reminder only</button>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 18 }}>
        <div className="card">
          <div className="card-head"><h3>Tonight at a glance</h3><span className="sub">All venues</span></div>
          <div className="card-body">
            <TonightHeatmap/>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Activity feed</h3><span className="sub">Last 30 min</span></div>
          <div className="card-body">
            <FeedItem t="5:11" agent="Risk Agent" text="Bestia 9:00 PM party of 4 escalated to monitoring (74)"/>
            <FeedItem t="5:08" agent="Confirmation" text="Felix 7:45 PM confirmed by diner"/>
            <FeedItem t="5:05" agent="Fairness" text="Account ‘newuser_842’ flagged · 5 high-demand bookings in 2h"/>
            <FeedItem t="4:58" agent="Settlement" text="République 7:30 PM table refilled · $165 protected"/>
            <FeedItem t="4:51" agent="Waitlist" text="3 new verified diners joined waitlist for sushi tonight"/>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedItem({ t, agent, text }) {
  return (
    <div className="row" style={{ padding: '8px 0', borderBottom: '1px dashed var(--line)', gap: 12, fontSize: 12.5 }}>
      <span className="mono" style={{ color: 'var(--ink-4)', width: 36 }}>{t}</span>
      <span style={{ color: 'var(--accent-deep)', fontWeight: 600, width: 110 }}>{agent}</span>
      <span style={{ color: 'var(--ink-2)', flex: 1 }}>{text}</span>
    </div>
  );
}

function TonightHeatmap() {
  const slots = ['5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00'];
  const venues = ['Katsuya WeHo', 'Bestia', 'République', 'Felix', 'Nobu Malibu', 'n/naka'];
  const data = [
    [0,1,1,2,3,3,4,3,2,1],
    [0,0,1,2,2,3,3,4,4,2],
    [1,2,2,3,4,3,2,1,1,0],
    [0,0,1,1,2,2,2,3,2,1],
    [0,1,1,2,2,3,3,3,2,2],
    [0,0,0,1,1,2,2,3,2,1],
  ];
  const colors = ['var(--bg-sunken)', '#FED7AA', '#FDBA74', '#FB923C', '#C2410C'];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '110px repeat(10, 1fr)', gap: 3, fontSize: 10.5, color: 'var(--ink-4)', marginBottom: 4 }}>
        <div></div>
        {slots.map(s => <div key={s} style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{s}</div>)}
      </div>
      {venues.map((v, i) => (
        <div key={v} style={{ display: 'grid', gridTemplateColumns: '110px repeat(10, 1fr)', gap: 3, marginBottom: 3, alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{v}</div>
          {data[i].map((d, j) => (
            <div key={j} style={{ height: 22, background: colors[d], borderRadius: 3, border: '1px solid var(--line)' }} title={`${slots[j]} · risk ${d}`}/>
          ))}
        </div>
      ))}
      <div className="row" style={{ marginTop: 12, gap: 6, fontSize: 11, color: 'var(--ink-3)' }}>
        <span>Risk:</span>
        {colors.map((c, i) => <span key={i} style={{ width: 18, height: 12, background: c, borderRadius: 2, border: '1px solid var(--line)' }}/>)}
        <span>low → high</span>
      </div>
    </div>
  );
}

window.Overview = Overview;
