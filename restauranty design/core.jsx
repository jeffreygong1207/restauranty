/* global React */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---------- ICONS (minimal stroke set) ----------
const Ic = {
  overview: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>,
  risk: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2L2 21h20L12 2z"/><path d="M12 9v5"/><circle cx="12" cy="17.5" r="0.6" fill="currentColor"/></svg>,
  recovery: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>,
  waitlist: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M17 6h4M19 4v4M16 14h5M16 18h3"/></svg>,
  policy: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 4h11l4 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M16 4v4h4"/><path d="M8 12h8M8 16h6"/></svg>,
  agents: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="6" y="9" width="12" height="10" rx="2"/><path d="M12 9V5"/><circle cx="12" cy="4" r="1.5"/><path d="M9 14h.01M15 14h.01"/><path d="M3 13v3M21 13v3"/></svg>,
  trust: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>,
  diner: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 3v18M8 3v6c0 2-1.8 3-4 3"/><path d="M16 3c-1.5 2.5-1.5 5 0 8v10"/></svg>,
  search: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  bell: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>,
  arrow: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  check: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12.5l5 5L20 7"/></svg>,
  x: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 6l12 12M18 6l-12 12"/></svg>,
  clock: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  pin: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  user: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>,
  bolt: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>,
  shield: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"/></svg>,
  spark: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/><path d="M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2"/></svg>,
  table: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 8h18M3 12h18M3 16h18M5 4h14v16H5z"/></svg>,
  dollar: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2v20"/><path d="M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7"/></svg>,
  filter: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 5h18l-7 9v6l-4-2v-4z"/></svg>,
  plus: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  refresh: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12a9 9 0 0 1-15.7 6"/><path d="M21 4v5h-5"/><path d="M3 12a9 9 0 0 1 15.7-6"/><path d="M3 20v-5h5"/></svg>,
  ext: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 4h6v6"/><path d="M10 14L20 4"/><path d="M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6"/></svg>,
};

// ---------- DATA ----------
const RESERVATIONS = [
  { id: 'r1', time: '8:15 PM', restaurant: 'Katsuya West Hollywood', area: 'WeHo', party: 2, status: 'Unconfirmed', risk: 82, action: 'Final confirmation → waitlist recovery', state: 'action', revenue: 180 },
  { id: 'r2', time: '7:45 PM', restaurant: 'Felix Trattoria', area: 'Venice', party: 2, status: 'Confirmed', risk: 18, action: 'Hold reservation', state: 'healthy', revenue: 220 },
  { id: 'r3', time: '9:00 PM', restaurant: 'Bestia', area: 'Arts District', party: 4, status: 'Reminder ignored', risk: 74, action: 'Prepare backup diners', state: 'monitoring', revenue: 410 },
  { id: 'r4', time: '7:30 PM', restaurant: 'République', area: 'Hancock Park', party: 2, status: 'Released by diner', risk: 95, action: 'Refill from waitlist', state: 'recovery', revenue: 165 },
  { id: 'r5', time: '8:45 PM', restaurant: 'Nobu Malibu', area: 'Malibu', party: 2, status: 'Suspicious transfer', risk: 91, action: 'Block / review', state: 'flagged', revenue: 320 },
];

const RISK_FACTORS = [
  { name: 'Missed 24h confirmation', w: +24 },
  { name: 'Reminder unopened', w: +18 },
  { name: 'Prior late cancellation', w: +14 },
  { name: 'Reservation starts in 3 hours', w: +12 },
  { name: 'High-demand time slot', w: +8 },
  { name: 'Verified diner account', w: -10 },
  { name: 'Card on file', w: -6 },
];

const FLOW_STEPS = [
  { id: 1, agent: 'Risk Agent', title: 'Detect risk', desc: 'Risk Agent identified missed confirmation and ignored reminder.', meta: ['Score: 82/100', 'Confidence: 91%'] },
  { id: 2, agent: 'Policy Agent', title: 'Check policy', desc: 'Restaurant Policy Agent confirmed waitlist refill is allowed after final confirmation window.', meta: ['Refill: allowed', 'Fee waiver: yes'] },
  { id: 3, agent: 'Confirmation Agent', title: 'Contact diner', desc: 'Confirmation Agent sends: “Still coming tonight at 8:15 PM?”', meta: ['Channel: SMS', 'Window: 15 min'] },
  { id: 4, agent: 'Waitlist Agent', title: 'Match replacement diners', desc: 'Waitlist Agent finds verified diners who match party size, cuisine, location, and arrival time.', meta: ['Candidates: 4', 'Top match: Maya C.'] },
  { id: 5, agent: 'Restaurant Agent', title: 'Restaurant approval', desc: 'Restaurant Agent asks the manager to approve the refill.', meta: ['Manager: Sofia', 'Auto-expire: 5 min'] },
  { id: 6, agent: 'Settlement Agent', title: 'Settle outcome', desc: 'Settlement Agent records the recovered table and waives or captures fees according to policy.', meta: ['Fee: waived', 'Cover: refilled'] },
];

const LOG_LINES = [
  { t: '5:12 PM', agent: 'Risk Agent', text: 'scored Katsuya 8:15 PM reservation 82/100' },
  { t: '5:13 PM', agent: 'Confirmation Agent', text: 'sent final SMS confirmation to diner' },
  { t: '5:15 PM', agent: 'Waitlist Agent', text: 'found 4 verified diners within 5 mi' },
  { t: '5:17 PM', agent: 'Fairness Agent', text: 'blocked 1 suspicious account (booking velocity)' },
  { t: '5:19 PM', agent: 'Waitlist Agent', text: 'replacement diner Maya Chen accepted' },
  { t: '5:20 PM', agent: 'Restaurant Agent', text: 'manager Sofia approved refill' },
  { t: '5:21 PM', agent: 'Settlement Agent', text: 'table recovered, fee waived per policy' },
];

const CANDIDATES = [
  { name: 'Maya Chen', initials: 'MC', av: 'av-1', party: 2, distance: '1.4 mi', cuisine: 'Sushi match', eta: '18 min', verified: true, commit: 'Deposit ready', priority: 96 },
  { name: 'Jordan Lee', initials: 'JL', av: 'av-2', party: 2, distance: '2.1 mi', cuisine: 'Japanese match', eta: '24 min', verified: true, commit: 'Quick confirm', priority: 91 },
  { name: 'Priya Shah', initials: 'PS', av: 'av-3', party: 3, distance: '1.8 mi', cuisine: 'Sushi match', eta: '20 min', verified: true, commit: 'Party mismatch', priority: 73 },
  { name: 'Alex Kim', initials: 'AK', av: 'av-4', party: 2, distance: '4.5 mi', cuisine: 'Sushi match', eta: '35 min', verified: false, commit: 'Needs verification', priority: 62 },
];

const AGENTS = [
  { name: 'Confirmation Agent', av: 'av-2', desc: 'Reaches out to diners through SMS, push, and email to confirm intent before the cancellation window closes.', stat: 'Confirmations sent: 84 today', status: 'Idle' },
  { name: 'Risk Agent', av: 'av-1', desc: 'Scores each reservation continuously using behavior, timing, and history. Surfaces only when intervention is useful.', stat: 'Reservations scored: 312', status: 'Active' },
  { name: 'Policy Agent', av: 'av-7', desc: 'Reads each restaurant’s policy and constrains every other agent. Refill, transfer, fees, caps — the source of truth.', stat: '12 venues governed', status: 'Active' },
  { name: 'Waitlist Agent', av: 'av-3', desc: 'Matches verified diners to released tables by party size, cuisine, distance, and arrival ETA.', stat: 'Tables recovered: 38', status: 'Matching' },
  { name: 'Fairness Agent', av: 'av-5', desc: 'Detects hoarding, scalping, bot-like booking velocity, and unverified accounts. Blocks before they reach the restaurant.', stat: 'Blocked today: 6', status: 'Active' },
  { name: 'Restaurant Agent', av: 'av-8', desc: 'Routes approval requests to the right manager and gives them one-tap accept/decline with full context.', stat: 'Approvals: 21', status: 'Awaiting' },
  { name: 'Settlement Agent', av: 'av-4', desc: 'Closes the loop: records the cover, waives or captures fees per policy, and updates analytics.', stat: 'Settlements: 38', status: 'Idle' },
  { name: 'Explanation Agent', av: 'av-6', desc: 'Translates each decision into plain English for diners, managers, and admins. Every action is auditable.', stat: 'Explanations: 412', status: 'Idle' },
];

const DEBATE = [
  { who: 'Risk Agent', av: 'av-1', when: '5:12 PM', text: 'This reservation is high risk due to missed confirmation and proximity to start time. Score: 82/100.' },
  { who: 'Policy Agent', av: 'av-7', when: '5:12 PM', text: 'Katsuya allows waitlist refill after a missed final confirmation. Fee waiver permitted on successful refill.' },
  { who: 'Fairness Agent', av: 'av-5', when: '5:17 PM', text: 'One replacement candidate was blocked due to unverified account and suspicious booking velocity (5 high-demand bookings in 2 hours).' },
  { who: 'Waitlist Agent', av: 'av-3', when: '5:18 PM', text: 'Maya Chen is the best replacement: party size match, verified human, 18-minute ETA, sushi preference confirmed.' },
  { who: 'Restaurant Agent', av: 'av-8', when: '5:19 PM', text: 'Manager approval required before releasing the table. Pinging Sofia at the host stand.' },
  { who: 'Settlement Agent', av: 'av-4', when: '5:20 PM', text: 'If refill is approved, mark original diner fee as waived per Katsuya policy.' },
  { who: 'Explanation Agent', av: 'av-6', when: '5:20 PM', text: 'Recommended action: activate verified waitlist refill, not paid public transfer. Aligns with restaurant intent and diner fairness.' },
];

const SUSPICIOUS = [
  { account: 'newuser_842', behavior: '5 high-demand reservations in 2 hours', risk: 'High', action: 'Require verification' },
  { account: 'tableflipLA', behavior: 'Attempted fee above policy cap ($85 vs $0)', risk: 'High', action: 'Block transfer' },
  { account: 'guest_193', behavior: 'Duplicate waitlist claims across venues', risk: 'Medium', action: 'Rate limit' },
  { account: 'unknown_seller', behavior: 'Unverified account, no booking history', risk: 'Medium', action: 'Hold for review' },
  { account: 'dlr_quickbk', behavior: 'Same device, 3 different identities', risk: 'High', action: 'Block account' },
  { account: 'guest_5582', behavior: 'Released 8 reservations in past week', risk: 'Low', action: 'Send to restaurant review' },
];

// ---------- STATUS BADGE ----------
const StatusBadge = ({ state, children }) => {
  const map = {
    healthy: 'success', monitoring: 'warn', flagged: 'danger',
    recovery: 'accent', action: 'warn', confirmed: 'success',
    completed: 'success', active: 'accent', waiting: 'neutral',
    blocked: 'danger', approved: 'success', idle: 'neutral',
  };
  const cls = map[state] || 'neutral';
  const labels = {
    healthy: 'Healthy', monitoring: 'Monitoring', flagged: 'Flagged',
    recovery: 'Recovery active', action: 'Needs action', confirmed: 'Confirmed',
  };
  return <span className={`badge ${cls}`}><span className="b-dot"/>{children || labels[state] || state}</span>;
};

// ---------- RISK SCORE BADGE ----------
const RiskScoreBadge = ({ score, size = 'sm' }) => {
  const color = score >= 80 ? 'var(--risk-high)' : score >= 50 ? 'var(--risk-med)' : 'var(--risk-low)';
  return (
    <span className="risk-pill" style={{ borderColor: color }}>
      <span className="bar"><span style={{ background: color, width: `${score}%` }}/></span>
      {score}
    </span>
  );
};

// ---------- METRIC CARD ----------
const MetricCard = ({ label, value, unit, delta, deltaTone, icon, sparkColor = 'var(--accent)', sparkData }) => (
  <div className="metric">
    <div className="label">{icon}{label}</div>
    <div className="v">{value}{unit && <span className="unit">{unit}</span>}</div>
    {delta && <div className={`delta ${deltaTone || ''}`}>{delta}</div>}
    {sparkData && <Sparkline data={sparkData} color={sparkColor}/>}
  </div>
);

const Sparkline = ({ data, color = 'var(--accent)' }) => {
  const w = 100, h = 22;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

// ---------- TOPBAR ----------
const Topbar = ({ page }) => {
  const labels = {
    overview: 'Overview', risk: 'Risk Monitor', detail: 'Reservation Risk', recovery: 'Recovery Flow',
    waitlist: 'Verified Waitlist', policies: 'Restaurant Policies', agents: 'Agent Room', trust: 'Admin / Trust',
    diner: 'Diner Rescue', landing: 'Product Overview',
  };
  return (
    <div className="topbar">
      <div className="crumbs">
        <span>Katsuya West Hollywood</span>
        <span>/</span>
        <span className="here">{labels[page] || ''}</span>
      </div>
      <div className="spacer"/>
      <div className="search">
        <Ic.search/>
        <span>Search reservations, diners, accounts</span>
        <kbd>⌘K</kbd>
      </div>
      <button className="icon-btn" title="Live"><span className="live-dot"/> Live</button>
      <button className="icon-btn"><Ic.bell/></button>
    </div>
  );
};

// ---------- SIDEBAR ----------
const SidebarNav = ({ page, setPage }) => {
  const items = [
    { id: 'overview', label: 'Overview', icon: <Ic.overview/> },
    { id: 'risk', label: 'Risk Monitor', icon: <Ic.risk/>, badge: '12' },
    { id: 'recovery', label: 'Recovery Flow', icon: <Ic.recovery/> },
    { id: 'waitlist', label: 'Waitlist', icon: <Ic.waitlist/>, badgeMuted: '46' },
    { id: 'policies', label: 'Restaurant Policies', icon: <Ic.policy/> },
    { id: 'agents', label: 'Agent Room', icon: <Ic.agents/> },
    { id: 'trust', label: 'Admin / Trust', icon: <Ic.trust/> },
  ];
  return (
    <aside className="side">
      <div className="brand">
        <div className="brand-mark">R</div>
        <div className="brand-name">ResoFlow<span className="dot">.</span></div>
        <span className="chip" style={{ marginLeft: 'auto' }}>Demo</span>
      </div>
      <button className="nav-item" onClick={() => setPage('landing')}>
        <span className="ic"><Ic.spark/></span>Product overview
      </button>
      <div className="nav-group-label">Restaurant</div>
      {items.map(it => (
        <button key={it.id} className={`nav-item ${page === it.id ? 'active' : ''}`} onClick={() => setPage(it.id)}>
          <span className="ic">{it.icon}</span>{it.label}
          {it.badge && <span className="badge">{it.badge}</span>}
          {it.badgeMuted && <span className="badge muted">{it.badgeMuted}</span>}
        </button>
      ))}
      <div className="nav-group-label">Diner</div>
      <button className={`nav-item ${page === 'diner' ? 'active' : ''}`} onClick={() => setPage('diner')}>
        <span className="ic"><Ic.diner/></span>Rescue flow
      </button>
      <div className="side-foot">
        <div className="avatar">SR</div>
        <div className="who">
          <div className="n">Sofia Reyes</div>
          <div className="r">Katsuya · Manager</div>
        </div>
      </div>
    </aside>
  );
};

window.RFCore = {
  Ic, RESERVATIONS, RISK_FACTORS, FLOW_STEPS, LOG_LINES, CANDIDATES, AGENTS, DEBATE, SUSPICIOUS,
  StatusBadge, RiskScoreBadge, MetricCard, Sparkline, Topbar, SidebarNav,
};
