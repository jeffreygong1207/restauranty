/* global React, RFCore */

function Agents() {
  const { Ic, AGENTS, DEBATE } = RFCore;
  const statusTone = { Active: 'success', Matching: 'accent', Awaiting: 'warn', Idle: 'neutral' };
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Agent Room</h1>
          <p className="page-sub">Eight specialized agents working the Katsuya 8:15 PM recovery in real time.</p>
        </div>
        <div className="row">
          <span className="chip"><span className="live-dot"/> 8 agents online</span>
          <button className="btn">View graph</button>
        </div>
      </div>

      <div className="split" style={{ gap: 18, alignItems: 'start' }}>
        <div>
          <div className="sect-title">Agents</div>
          <div className="grid-2" style={{ gap: 12 }}>
            {AGENTS.map(a => (
              <div key={a.name} className="agent-card">
                <div className="head">
                  <div className={`av ${a.av}`}>{a.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
                  <div style={{ flex: 1 }}>
                    <div className="nm">{a.name}</div>
                    <div className="st">{a.stat}</div>
                  </div>
                  <span className={`badge ${statusTone[a.status]}`}><span className="b-dot"/>{a.status}</span>
                </div>
                <p className="desc">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="sect-title">Agent debate · Katsuya 8:15 PM</div>
          <div className="card">
            <div className="card-body">
              <div className="debate">
                {DEBATE.map((d, i) => (
                  <div key={i} className="bubble">
                    <div className={`av ${d.av}`}>{d.who.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
                    <div className="body">
                      <div className="who">{d.who} <span className="when">{d.when}</span></div>
                      <p>{d.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="divider"/>
              <div style={{ padding: 12, background: 'var(--accent-soft)', borderRadius: 8, fontSize: 13, color: 'var(--accent-deep)' }}>
                <b>Final recommendation:</b> Activate verified waitlist refill. Manager approval required. Aligns with Katsuya policy and diner fairness.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Agents = Agents;
