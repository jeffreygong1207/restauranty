/* global React, useTweaks, TweaksPanel, TweakSection, TweakToggle, TweakRadio, TweakSelect, TweakColor, TweakButton */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#A78BFA",
  "policyRefill": true,
  "policyWaiver": true,
  "replayKey": 0
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPage] = React.useState('landing');
  const [selectedRes, setSelectedRes] = React.useState('r1');

  // Apply theme
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme);
  }, [tweaks.theme]);

  // Apply accent
  React.useEffect(() => {
    const a = tweaks.accent || '#A78BFA';
    document.documentElement.style.setProperty('--accent', a);
    // derive deeper / softer
    const deepMap = { '#C2410C': '#9A3412', '#B45309': '#78350F', '#15803D': '#14532D', '#1E293B': '#0F172A', '#A78BFA': '#6D28D9' };
    const softMap = { '#C2410C': '#FFEDD5', '#B45309': '#FEF3C7', '#15803D': '#DCFCE7', '#1E293B': '#E2E8F0', '#A78BFA': '#EDE9FE' };
    document.documentElement.style.setProperty('--accent-deep', deepMap[a] || a);
    document.documentElement.style.setProperty('--accent-soft', softMap[a] || '#EDE9FE');
  }, [tweaks.accent]);

  const goto = (p) => { setPage(p); window.scrollTo(0, 0); };

  const replayRecovery = () => {
    setTweak('replayKey', (tweaks.replayKey || 0) + 1);
    if (page !== 'recovery') {
      setPage('recovery');
      setTimeout(() => window.dispatchEvent(new Event('rf-replay-recovery')), 80);
    } else {
      window.dispatchEvent(new Event('rf-replay-recovery'));
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'landing': return <Landing goto={goto}/>;
      case 'overview': return <Overview goto={goto} setSelectedRes={setSelectedRes}/>;
      case 'risk': return <Overview goto={goto} setSelectedRes={setSelectedRes}/>;
      case 'detail': return <RiskDetail goto={goto}/>;
      case 'recovery': return <Recovery tweaks={tweaks}/>;
      case 'diner': return <Diner/>;
      case 'waitlist': return <Waitlist/>;
      case 'policies': return <Policies tweaks={tweaks} setTweak={setTweak}/>;
      case 'agents': return <Agents/>;
      case 'trust': return <Trust/>;
      default: return <Landing goto={goto}/>;
    }
  };

  const isLanding = page === 'landing';
  const isDiner = page === 'diner';

  return (
    <>
      {isLanding ? renderPage() : (
        <div className="app">
          <RFCore.SidebarNav page={page} setPage={setPage}/>
          <div className="main">
            <RFCore.Topbar page={page}/>
            {renderPage()}
          </div>
        </div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection title="Appearance">
          <TweakRadio label="Theme" value={tweaks.theme} onChange={v => setTweak('theme', v)}
            options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]}/>
          <TweakRadio label="Accent" value={tweaks.accent} onChange={v => setTweak('accent', v)}
            options={[
              { value: '#A78BFA', label: 'Lavender' },
              { value: '#C2410C', label: 'Ember' },
              { value: '#15803D', label: 'Sage' },
              { value: '#1E293B', label: 'Ink' },
            ]}/>
        </TweakSection>
        <TweakSection title="Restaurant policies">
          <TweakToggle label="Waitlist refill" value={tweaks.policyRefill} onChange={v => setTweak('policyRefill', v)}/>
          <TweakToggle label="Fee waiver on refill" value={tweaks.policyWaiver} onChange={v => setTweak('policyWaiver', v)}/>
        </TweakSection>
        <TweakSection title="Demo">
          <TweakButton label="Replay recovery animation" onClick={replayRecovery}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
