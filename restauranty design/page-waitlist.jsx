/* global React, RFCore */

function Waitlist() {
  const { Ic, CANDIDATES } = RFCore;
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Verified Waitlist</h1>
          <p className="page-sub">Replacement diners for Katsuya · 8:15 PM · Party of 2 · Sushi</p>
        </div>
        <div className="row">
          <button className="btn"><Ic.filter/> Filter · Verified only</button>
          <button className="btn"><Ic.refresh/> Refresh matches</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16, borderColor: 'var(--accent)', background: 'color-mix(in oklab, var(--accent-soft) 50%, var(--bg-elev))' }}>
        <div className="card-body row" style={{ gap: 14 }}>
          <div className="cand av av-1" style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 12, color: 'white', fontWeight: 600 }}>MC</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-deep)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recommended replacement</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>Maya Chen — priority 96</div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>Party of 2 · 1.4 mi away · 18 min ETA · sushi preferred · deposit ready</div>
          </div>
          <button className="btn accent">Approve refill</button>
          <button className="btn">Hold</button>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>All candidates</h3>
          <span className="sub">{CANDIDATES.length} matches · sorted by priority</span>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Diner</th><th>Party</th><th>Distance</th><th>Cuisine match</th>
              <th>Arrival ETA</th><th>Verification</th><th>Commitment</th><th>Priority</th><th></th>
            </tr>
          </thead>
          <tbody>
            {CANDIDATES.map(c => (
              <tr key={c.name}>
                <td>
                  <div className="row" style={{ gap: 10 }}>
                    <div className={`avatar ${c.av}`} style={{ borderRadius: 10, color: 'white' }}>{c.initials}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div className="muted" style={{ fontSize: 11.5 }}>Member · 8 reservations</div>
                    </div>
                  </div>
                </td>
                <td className="num">×{c.party}</td>
                <td className="num">{c.distance}</td>
                <td>{c.cuisine}</td>
                <td className="num">{c.eta}</td>
                <td>{c.verified ? <span className="badge success"><span className="b-dot"/>Human verified</span> : <span className="badge warn"><span className="b-dot"/>Unverified</span>}</td>
                <td style={{ fontSize: 12.5, color: c.commit.includes('mismatch') || c.commit.includes('Needs') ? 'var(--warn)' : 'var(--ink-2)' }}>{c.commit}</td>
                <td><PriorityCell n={c.priority}/></td>
                <td><button className="btn sm">Match</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="card-foot">
          <span><Ic.shield/> Fairness Agent blocked 1 unverified account in the last 30 minutes.</span>
        </div>
      </div>
    </div>
  );
}

function PriorityCell({ n }) {
  const color = n >= 90 ? 'var(--success)' : n >= 75 ? 'var(--warn)' : 'var(--danger)';
  return (
    <div className="row" style={{ gap: 8 }}>
      <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{n}</span>
      <div style={{ width: 50, height: 4, background: 'var(--bg-sunken)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${n}%`, height: '100%', background: color }}/>
      </div>
    </div>
  );
}

window.Waitlist = Waitlist;
