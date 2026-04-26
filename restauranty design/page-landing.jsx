/* global React, RFCore */
const { useState: useStateP1, useEffect: useEffectP1 } = React;

function Landing({ goto }) {
  const { Ic } = RFCore;
  return (
    <div className="lp">
      <div className="nav">
        <div className="brand-mark">R</div>
        <div className="brand-name">ResoFlow<span className="dot">.</span></div>
        <div className="links">
          <a>Product</a><a>For restaurants</a><a>For diners</a><a>Trust</a><a>Pricing</a>
        </div>
        <div className="right">
          <button className="btn ghost sm">Sign in</button>
          <button className="btn sm">Book a demo</button>
        </div>
      </div>

      <div className="hero">
        <div>
          <span className="tag-pill"><span className="b-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }}/> Live in 12 LA restaurants tonight</span>
          <h1>Recover at-risk reservations <em>before</em> they become empty tables.</h1>
          <p className="lede">ResoFlow uses AI agents, confirmation signals, restaurant policies, and verified waitlists to prevent no-shows and refill tables in time — without becoming a resale market.</p>
          <div className="ctas">
            <button className="btn accent lg" onClick={() => goto('overview')}>Launch recovery dashboard <Ic.arrow/></button>
            <button className="btn lg" onClick={() => goto('diner')}>See diner rescue flow</button>
          </div>
          <div className="row" style={{ marginTop: 24, gap: 14, color: 'var(--ink-3)', fontSize: 12.5 }}>
            <span className="row" style={{ gap: 6 }}><Ic.shield/> SOC-2 ready</span>
            <span className="row" style={{ gap: 6 }}><Ic.check/> Restaurant-controlled</span>
            <span className="row" style={{ gap: 6 }}><Ic.check/> No paid scalping</span>
          </div>
        </div>
        <HeroArt/>
      </div>

      <div className="metric-strip">
        <div><div className="v">38</div><div className="l">Covers recovered tonight</div></div>
        <div><div className="v">14</div><div className="l">No-shows prevented this week</div></div>
        <div><div className="v">$4,280</div><div className="l">Revenue protected</div></div>
        <div><div className="v">6</div><div className="l">Suspicious transfers blocked</div></div>
      </div>

      <div className="feature-grid">
        <Feature icon={<Ic.risk/>} title="Risk detection before no-show" desc="Confirmation behavior, timing, and diner history generate a live risk score so you can intervene at the right moment — not after."/>
        <Feature icon={<Ic.waitlist/>} title="Verified waitlist recovery" desc="Nearby verified diners can claim released tables fast. Party size, cuisine, distance, and ETA all match."/>
        <Feature icon={<Ic.policy/>} title="Restaurant-controlled policies" desc="Restaurants decide whether to release, refill, approve, block, or waive fees. Your house, your rules."/>
        <Feature icon={<Ic.shield/>} title="Anti-hoarding protection" desc="Fairness agents flag suspicious accounts, excessive listings, and bot-like behavior. Verified humans only."/>
      </div>

      <div style={{ marginTop: 64, display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 36, alignItems: 'center' }}>
        <div>
          <div className="sect-title" style={{ color: 'var(--accent-deep)' }}>The recovery loop</div>
          <h2 style={{ fontSize: 28, letterSpacing: '-0.025em', margin: '6px 0 14px', fontWeight: 600 }}>Seven agents. One outcome.</h2>
          <p className="lede" style={{ fontSize: 14.5 }}>Each agent has a narrow responsibility — risk scoring, policy enforcement, replacement matching, settlement. They work together so a manager only has to decide the things that matter: approve, decline, or override.</p>
          <button className="btn" style={{ marginTop: 14 }} onClick={() => goto('agents')}>Meet the agents <Ic.arrow/></button>
        </div>
        <div className="card">
          <div className="card-body" style={{ padding: 20 }}>
            <MiniFlow/>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 56, color: 'var(--ink-4)', fontSize: 12, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: 18 }}>
        <span>© 2026 ResoFlow Inc. — Hackathon prototype</span>
        <span>Privacy · Terms · Trust</span>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="feature">
      <div className="ico">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function HeroArt() {
  const { Ic, RiskScoreBadge, StatusBadge } = RFCore;
  return (
    <div className="hero-art">
      <div className="hero-pane">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h4>At-risk tonight</h4>
          <span className="chip"><span className="live-dot"/> Live</span>
        </div>
        {[
          { t: '8:15', n: 'Katsuya WeHo', p: 2, r: 82, s: 'action' },
          { t: '9:00', n: 'Bestia', p: 4, r: 74, s: 'monitoring' },
          { t: '7:30', n: 'République', p: 2, r: 95, s: 'recovery' },
          { t: '7:45', n: 'Felix', p: 2, r: 18, s: 'healthy' },
        ].map((r, i) => (
          <div key={i} className="row" style={{ gap: 10, padding: '7px 0', borderTop: i ? '1px solid var(--line)' : 'none' }}>
            <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)', width: 38 }}>{r.t}</span>
            <span style={{ fontSize: 12.5, fontWeight: 500, flex: 1 }}>{r.n}</span>
            <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>×{r.p}</span>
            <RiskScoreBadge score={r.r}/>
          </div>
        ))}
      </div>
      <div className="hero-pane">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h4>Agent timeline</h4>
          <span className="chip">Katsuya · 8:15</span>
        </div>
        <div style={{ position: 'relative' }}>
          {[
            { ag: 'Risk Agent', t: 'Scored 82/100', s: 'completed' },
            { ag: 'Policy Agent', t: 'Refill allowed', s: 'completed' },
            { ag: 'Confirmation', t: 'Final SMS sent', s: 'completed' },
            { ag: 'Waitlist Agent', t: 'Matching diners', s: 'active' },
            { ag: 'Restaurant', t: 'Awaiting approval', s: 'waiting' },
          ].map((s, i, arr) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '20px 1fr auto', gap: 8, alignItems: 'center', padding: '5px 0', position: 'relative' }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: s.s === 'completed' ? 'var(--success)' : s.s === 'active' ? 'var(--accent)' : 'var(--bg-sunken)',
                border: '1px solid ' + (s.s === 'waiting' ? 'var(--line-strong)' : 'transparent'),
                margin: 'auto', zIndex: 1, position: 'relative',
                boxShadow: s.s === 'active' ? '0 0 0 4px color-mix(in oklab, var(--accent) 18%, transparent)' : 'none',
              }}/>
              {i < arr.length - 1 && <div style={{ position: 'absolute', left: 9, top: 16, bottom: -6, width: 2, background: s.s === 'completed' ? 'var(--success)' : 'var(--line)' }}/>}
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 600 }}>{s.ag}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s.t}</div>
              </div>
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{s.s === 'active' ? '…' : s.s === 'completed' ? '✓' : ''}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto', padding: 10, background: 'var(--accent-soft)', borderRadius: 8, fontSize: 12, color: 'var(--accent-deep)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Ic.bolt/>
          <span><b>Recommend:</b> activate waitlist refill</span>
        </div>
      </div>
    </div>
  );
}

function MiniFlow() {
  const stages = [
    { l: 'Risk detected', s: 'completed' },
    { l: 'Policy checked', s: 'completed' },
    { l: 'Diner contacted', s: 'completed' },
    { l: 'Replacement matched', s: 'active' },
    { l: 'Approval', s: 'waiting' },
    { l: 'Settled', s: 'waiting' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
      {stages.map((s, i) => (
        <React.Fragment key={i}>
          <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%', margin: '0 auto 6px',
              background: s.s === 'completed' ? 'var(--success)' : s.s === 'active' ? 'var(--accent)' : 'var(--bg-sunken)',
              border: '1px solid ' + (s.s === 'waiting' ? 'var(--line-strong)' : 'transparent'),
              color: 'white',
              display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600,
              boxShadow: s.s === 'active' ? '0 0 0 5px color-mix(in oklab, var(--accent) 16%, transparent)' : 'none',
            }}>{s.s === 'completed' ? '✓' : i + 1}</div>
            <div style={{ fontSize: 11, color: s.s === 'waiting' ? 'var(--ink-4)' : 'var(--ink-2)', fontWeight: 500 }}>{s.l}</div>
          </div>
          {i < stages.length - 1 && <div style={{ flex: 1, height: 2, background: i < 3 ? 'var(--success)' : 'var(--line)', borderRadius: 1, marginBottom: 22 }}/>}
        </React.Fragment>
      ))}
    </div>
  );
}

window.Landing = Landing;
