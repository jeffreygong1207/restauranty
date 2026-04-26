/* global React, RFCore */
const { useState: useStateR, useEffect: useEffectR, useRef: useRefR } = React;

function Recovery({ tweaks }) {
  const { Ic, FLOW_STEPS, LOG_LINES, StatusBadge } = RFCore;
  const [activeStep, setActiveStep] = useStateR(2); // 0 = Detect risk completed, advancing
  const [logs, setLogs] = useStateR([]);
  const [running, setRunning] = useStateR(false);
  const [done, setDone] = useStateR(false);
  const timersRef = useRefR([]);

  const reset = () => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
    setActiveStep(0);
    setLogs([]);
    setDone(false);
    setRunning(false);
  };

  const play = () => {
    reset();
    setRunning(true);
    const stepDelay = 1100;
    LOG_LINES.forEach((l, i) => {
      const t = setTimeout(() => setLogs(prev => [...prev, l]), 200 + i * 900);
      timersRef.current.push(t);
    });
    FLOW_STEPS.forEach((_, i) => {
      const t = setTimeout(() => setActiveStep(i + 1), stepDelay * (i + 1));
      timersRef.current.push(t);
    });
    const finalT = setTimeout(() => { setRunning(false); setDone(true); }, stepDelay * (FLOW_STEPS.length + 1));
    timersRef.current.push(finalT);
  };

  useEffectR(() => {
    play();
    return () => timersRef.current.forEach(t => clearTimeout(t));
  }, [tweaks?.replayKey]);

  // Listen for tweak replay events
  useEffectR(() => {
    const handler = () => play();
    window.addEventListener('rf-replay-recovery', handler);
    return () => window.removeEventListener('rf-replay-recovery', handler);
  }, []);

  const stepStatus = (i) => {
    if (i < activeStep) return 'completed';
    if (i === activeStep) return 'active';
    return 'waiting';
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Recovery flow — Katsuya 8:15 PM</h1>
          <p className="page-sub">Six agents, one recovered table. Watch it run in real time.</p>
        </div>
        <div className="row">
          <button className="btn" onClick={play} disabled={running}><Ic.refresh/> {done ? 'Replay' : running ? 'Running…' : 'Play'}</button>
          <button className="btn ghost sm" onClick={reset}>Reset</button>
        </div>
      </div>

      <div className="split">
        <div className="card">
          <div className="card-head">
            <h3>Pipeline</h3>
            <span className="sub">{done ? 'Complete' : running ? `Step ${Math.min(activeStep + 1, FLOW_STEPS.length)} of ${FLOW_STEPS.length}` : 'Idle'}</span>
            <div style={{ marginLeft: 'auto' }}>
              {done ? <StatusBadge state="completed">Recovered</StatusBadge> : running ? <StatusBadge state="active">In progress</StatusBadge> : <StatusBadge state="waiting">Ready</StatusBadge>}
            </div>
          </div>
          <div className="card-body">
            <div className="flow">
              {FLOW_STEPS.map((s, i) => {
                const st = stepStatus(i);
                return (
                  <div key={s.id} className={`step ${st}`}>
                    <div className="marker">{st === 'completed' ? '✓' : i + 1}</div>
                    <div className="body">
                      <div className="agent">{s.agent} · <StatusBadge state={st}>{st === 'completed' ? 'Done' : st === 'active' ? 'Running' : 'Waiting'}</StatusBadge></div>
                      <div className="title">{s.title}</div>
                      <p className="desc">{s.desc}</p>
                      {st !== 'waiting' && (
                        <div className="meta">
                          {s.meta.map(m => <span key={m} className="chip">{m}</span>)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col" style={{ gap: 16 }}>
          <div className="card">
            <div className="card-head">
              <h3>Live log</h3>
              <span className="sub">{logs.length} events</span>
              <span className="chip" style={{ marginLeft: 'auto' }}><span className="live-dot"/> {running ? 'streaming' : 'paused'}</span>
            </div>
            <div className="card-body">
              <div className="log">
                {logs.length === 0 && <div style={{ color: 'var(--ink-4)' }}>// awaiting agent events…</div>}
                {logs.map((l, i) => (
                  <div key={i} className="ln">
                    <span className="t">{l.t}</span>
                    <span className="agent">{l.agent.replace(' Agent', '')}</span>
                    <span>{l.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {done ? (
            <div className="success-card">
              <div className="row" style={{ gap: 8, marginBottom: 8 }}>
                <span className="badge success"><span className="b-dot"/> Recovered</span>
                <span className="muted" style={{ fontSize: 12 }}>5:21 PM</span>
              </div>
              <h3 style={{ margin: '0 0 4px', fontSize: 20, letterSpacing: '-0.015em' }}>Table recovered</h3>
              <p className="muted" style={{ fontSize: 13, margin: 0 }}>Replacement diner Maya C. is on her way. Original diner Daniel K. fee waived.</p>
              <div className="divider"/>
              <div className="kv"><span className="k">Revenue protected</span><span className="v">$180</span></div>
              <div className="kv"><span className="k">Replacement diner ETA</span><span className="v">18 min</span></div>
              <div className="kv"><span className="k">Original diner status</span><span className="v" style={{ color: 'var(--success)' }}>Fee waived</span></div>
              <div className="kv"><span className="k">Restaurant approval</span><span className="v">Complete</span></div>
              <div className="row" style={{ marginTop: 14, gap: 8 }}>
                <button className="btn primary">Notify host stand</button>
                <button className="btn" onClick={play}>Run again</button>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-head"><h3>Outcome (pending)</h3></div>
              <div className="card-body">
                <p className="muted" style={{ fontSize: 12.5, margin: 0 }}>Agents are working. The settlement card will appear here once the table is recovered, declined, or expired.</p>
                <div className="divider"/>
                <div className="kv"><span className="k">Forecast revenue protected</span><span className="v">$180</span></div>
                <div className="kv"><span className="k">Top replacement match</span><span className="v">Maya C. (96)</span></div>
                <div className="kv"><span className="k">Manager</span><span className="v">Sofia · approving</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.Recovery = Recovery;
