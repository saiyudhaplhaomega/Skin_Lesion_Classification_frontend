// Notification center — spec board. Full desktop shell + all labeled state frames.
const { useState: useStateB } = React;

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'analyze',   label: 'Analyze',   icon: 'scan-line' },
  { id: 'bodymap',   label: 'Body map',  icon: 'map-pin' },
  { id: 'labs',      label: 'Lab results', icon: 'file-text' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'privacy',   label: 'Privacy',   icon: 'shield-check' },
];

// Full patient app shell wrapping a notification page (used for the hero frame).
function DesktopShell({ children, unread = 3 }) {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="mark"><div className="reticle"></div></div>
          <div className="wm">Skin Lesion <b>XAI</b></div>
        </div>
        <div className="nav-label">Monitoring</div>
        {NAV.map(n => (
          <button key={n.id} className={`nav-item ${n.id === 'notifications' ? 'active' : ''}`}>
            <Icon name={n.icon} size={18} />{n.label}
          </button>
        ))}
        <div className="sidebar-foot">
          <div className="sidebar-user">
            <div className="avatar">JM</div>
            <div><div className="nm">Jordan Mills</div><div className="rl">Patient</div></div>
          </div>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <h1>Notifications</h1>
          <div className="topbar-right">
            <button className="icon-btn" aria-label={`Notifications, ${unread} unread`}>
              <Icon name="bell" size={18} />{unread > 0 && <span className="dot"></span>}
            </button>
            <button className="icon-btn" aria-label="Settings"><Icon name="settings" size={18} /></button>
          </div>
        </header>
        <main className="content"><div className="content-inner">{children}</div></main>
      </div>
    </div>
  );
}

function Frame({ dot, title, desc, children }) {
  return (
    <div className="frame">
      <div className="frame-cap">
        <span className="fc-dot" style={{ background: dot }}></span>
        <span className="fc-t">{title}</span>
        {desc && <span className="fc-d">— {desc}</span>}
      </div>
      {children}
    </div>
  );
}

function WinBar({ label }) {
  return (
    <div className="win-bar">
      <span className="tl"></span><span className="tl"></span><span className="tl"></span>
      <span className="wt">{label}</span>
    </div>
  );
}

function Board() {
  return (
    <div className="board">
      <div className="board-head">
        <p className="board-eyebrow">Skin Lesion XAI · Clinical Premium</p>
        <h1>Notification center</h1>
        <p>A calm, privacy-aware inbox for analysis results, professional reviews, and account notices. Categorized and dismissible, with unread items weighted heavier — never alarming. Status is always carried by icon, text, and color together, and no protected health information appears in any preview.</p>
        <span className="board-note"><Icon name="shield-check" size={14} />No PHI in previews · status never color-alone · 44px touch targets</span>
      </div>

      {/* ── DESKTOP ─────────────────────────────────────────────── */}
      <div className="board-section">
        <div className="section-bar">
          <span className="sx">Desktop</span>
          <span className="sx-sub">1280px · in-app notifications page</span>
          <span className="rule"></span>
        </div>

        <div className="frames">
          <Frame dot="var(--accent)" title="Populated" desc="live · tabs, mark-all-read, dismiss all work">
            <div className="win full">
              <WinBar label="app.skinlesionxai.health/notifications" />
              <DesktopShell unread={3}><NotifCenter seed={SEED} /></DesktopShell>
            </div>
          </Frame>
        </div>

        <div className="frames" style={{ marginTop: 40 }}>
          <Frame dot="var(--green)" title="Empty — “All caught up”" desc="no unread or stored notices">
            <div className="win">
              <WinBar label="notifications · empty" />
              <div className="panel-frame"><div className="nc"><EmptyState /></div></div>
            </div>
          </Frame>

          <Frame dot="var(--neutral)" title="Loading" desc="skeleton list while fetching">
            <div className="win">
              <WinBar label="notifications · loading" />
              <div className="panel-frame"><NotifSkeleton /></div>
            </div>
          </Frame>
        </div>
      </div>

      {/* ── MOBILE ──────────────────────────────────────────────── */}
      <div className="board-section">
        <div className="section-bar">
          <span className="sx">Mobile</span>
          <span className="sx-sub">390px · swipe to dismiss</span>
          <span className="rule"></span>
        </div>

        <div className="frames">
          <Frame dot="var(--accent)" title="Populated" desc="live · scroll, filter, swipe">
            <MobilePhone variant="live" />
          </Frame>

          <Frame dot="var(--neutral)" title="Swipe to dismiss" desc="drag a card left — neutral, non-destructive">
            <MobilePhone variant="swipe" />
          </Frame>

          <Frame dot="var(--green)" title="Empty — “All caught up”" desc="nothing to review">
            <MobilePhone variant="empty" />
          </Frame>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Board />);
