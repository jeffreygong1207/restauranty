/* global React, RFCore */

function Policies({ tweaks, setTweak }) {
  const { Ic } = RFCore;
  const policies = [
    { id: 'confirm', title: 'Confirmation window', desc: 'Require diner confirmation 3 hours before reservation. Triggers risk scoring if missed.', kind: 'hours', value: 3 },
    { id: 'refill', title: 'Waitlist refill', desc: 'Allow ResoFlow to refill released tables from a verified waitlist.', kind: 'toggle', value: tweaks.policyRefill },
    { id: 'transfer', title: 'Peer transfer', desc: 'Allow diners to transfer reservations directly to verified diners.', kind: 'choice', value: 'approval', options: ['off', 'approval', 'open'] },
    { id: 'resale', title: 'Paid resale', desc: 'Allow paid reservation resale between diners.', kind: 'toggle', value: false, locked: true },
    { id: 'waiver', title: 'Fee waiver on refill', desc: 'Waive cancellation fee when the table is successfully refilled.', kind: 'toggle', value: tweaks.policyWaiver },
    { id: 'cap', title: 'Max convenience fee', desc: 'Cap any fee added on top of the reservation cost.', kind: 'currency', value: 0 },
    { id: 'sus', title: 'Suspicious account threshold', desc: 'Auto-review accounts that exceed booking velocity or hoarding thresholds.', kind: 'choice', value: 'auto', options: ['off', 'auto', 'strict'] },
    { id: 'verify', title: 'Human verification', desc: 'Require human verification for replacement diners taking refilled tables.', kind: 'toggle', value: true, locked: true },
  ];
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Restaurant Policies</h1>
          <p className="page-sub">Katsuya West Hollywood · Your house, your rules. Every agent operates inside these.</p>
        </div>
        <div className="row">
          <button className="btn ghost">Restore defaults</button>
          <button className="btn primary">Save changes</button>
        </div>
      </div>

      <div style={{ padding: 14, marginBottom: 18, background: 'var(--accent-soft)', borderRadius: 10, fontSize: 12.5, color: 'var(--accent-deep)', display: 'flex', gap: 10, alignItems: 'center' }}>
        <Ic.shield/>
        <div>
          <b>ResoFlow is restaurant-controlled by design.</b> Paid resale is permanently disabled. Human verification cannot be turned off. These two are not configurable.
        </div>
      </div>

      <div className="grid-3">
        {policies.map(p => (
          <div key={p.id} className="policy">
            <div className="top">
              <div>
                <h4>{p.title}</h4>
                <p className="desc" style={{ marginTop: 4 }}>{p.desc}</p>
              </div>
              {p.locked && <span className="badge neutral"><Ic.shield/> Locked</span>}
            </div>
            <div className="control">
              {p.kind === 'toggle' && (
                <button className={`toggle accent ${p.value ? 'on' : ''}`} disabled={p.locked} onClick={() => {
                  if (p.locked) return;
                  if (p.id === 'refill') setTweak('policyRefill', !p.value);
                  if (p.id === 'waiver') setTweak('policyWaiver', !p.value);
                }}>
                  <span className="sw"/>
                  <span style={{ fontSize: 12.5, fontWeight: 500 }}>{p.value ? 'Enabled' : 'Disabled'}</span>
                </button>
              )}
              {p.kind === 'hours' && (
                <div className="row" style={{ gap: 8, width: '100%' }}>
                  <input className="slider" type="range" min="1" max="12" defaultValue={p.value}/>
                  <span className="mono" style={{ fontSize: 12.5, fontWeight: 600 }}>{p.value}h</span>
                </div>
              )}
              {p.kind === 'currency' && (
                <div className="row" style={{ gap: 8 }}>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>${p.value}</span>
                  <span className="muted" style={{ fontSize: 11.5 }}>(no convenience fee allowed)</span>
                </div>
              )}
              {p.kind === 'choice' && (
                <div className="row" style={{ gap: 4, padding: 2, background: 'var(--bg-sunken)', borderRadius: 6 }}>
                  {p.options.map(o => (
                    <button key={o} className="btn sm" style={{
                      background: p.value === o ? 'var(--bg-elev)' : 'transparent',
                      border: 'none',
                      boxShadow: p.value === o ? 'var(--sh-1)' : 'none',
                      textTransform: 'capitalize',
                    }}>{o}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.Policies = Policies;
