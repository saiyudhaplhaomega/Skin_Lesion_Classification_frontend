// Notification center — desktop component. Interactive: tabs, bulk actions, per-row dismiss.
const { useState } = React;

function NotifRow({ n, onDismiss }) {
  return (
    <div className={`n-row ${n.unread ? 'unread' : 'read'}`} role="listitem">
      <div className={`n-ic ${n.tone}`}><Icon name={n.icon} size={19} /></div>
      <div className="n-main">
        <div className="n-top">
          <span className="n-title">{n.title}</span>
          {n.tag && (
            <span className={`n-tag ${n.tag.tone}`}><Icon name={n.tag.icon} size={11} />{n.tag.label}</span>
          )}
        </div>
        <p className="n-desc">{n.desc}</p>
        <div className="n-meta">
          <span className="n-time">{n.time}</span>
          {n.cta && <span className="dotsep" aria-hidden="true"></span>}
          {n.cta && (
            <button className="n-cta">{n.cta.label}<Icon name={n.cta.icon} size={13} /></button>
          )}
        </div>
      </div>
      <div className="n-aside">
        {n.unread
          ? <span className="n-unreaddot" aria-label="Unread" title="Unread"></span>
          : <span style={{ width: 8, height: 8 }} aria-hidden="true"></span>}
        <button className="n-dismiss" aria-label={`Dismiss: ${n.title}`} onClick={() => onDismiss(n.id)}>
          <Icon name="x" size={15} />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ compact }) {
  return (
    <div className={`nc-empty ${compact ? 'm-empty' : ''}`}>
      <div className="ei"><Icon name="check-check" size={compact ? 24 : 26} /></div>
      <h3>All caught up</h3>
      <p>You have no new notifications. New analysis results, reviews, and account notices will appear here.</p>
    </div>
  );
}

function NotifCenter({ seed }) {
  const [items, setItems] = useState(seed);
  const [tab, setTab] = useState('all');

  const dismiss = (id) => setItems(xs => xs.filter(x => x.id !== id));
  const markAllRead = () => setItems(xs => xs.map(x => ({ ...x, unread: false })));
  const clearRead = () => setItems(xs => xs.filter(x => x.unread));

  const counts = {
    all: items.filter(x => x.unread).length,
    analysis: items.filter(x => x.cat === 'analysis' && x.unread).length,
    doctor: items.filter(x => x.cat === 'doctor' && x.unread).length,
    system: items.filter(x => x.cat === 'system' && x.unread).length,
  };
  const totalUnread = counts.all;
  const hasRead = items.some(x => !x.unread);

  const visible = items.filter(x => tab === 'all' || x.cat === tab);
  const groups = ['today', 'earlier']
    .map(g => ({ g, rows: visible.filter(x => x.group === g) }))
    .filter(o => o.rows.length);

  return (
    <div className="nc">
      <div className="nc-head">
        <div>
          <div className="nc-title">
            <h2>Notifications</h2>
            {totalUnread > 0 && <span className="unread-pill">{totalUnread} new</span>}
          </div>
          <p className="nc-sub">Updates about your analyses, reviews, and account — newest first.</p>
        </div>
      </div>

      <div className="nc-tabs" role="tablist" aria-label="Notification categories">
        {TABS.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`nc-tab ${tab === t.id ? 'on' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {counts[t.id] > 0 && <span className="tcount">{counts[t.id]}</span>}
          </button>
        ))}
      </div>

      <div className="nc-bulk">
        <div className="legend"><span className="ud"></span> Bold = unread</div>
        <div className="acts">
          <button className="linkbtn" onClick={markAllRead} disabled={totalUnread === 0}>
            <Icon name="check-check" size={14} />Mark all read
          </button>
          <button className="linkbtn" onClick={clearRead} disabled={!hasRead}>
            <Icon name="archive" size={14} />Clear read
          </button>
        </div>
      </div>

      {visible.length === 0 ? <EmptyState /> : (
        <div role="list">
          {groups.map(({ g, rows }) => (
            <div key={g}>
              <div className="nc-group">{GROUP_LABEL[g]}</div>
              <div className="nc-list">
                {rows.map(n => <NotifRow key={n.id} n={n} onDismiss={dismiss} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      <Disclaimer />
    </div>
  );
}

// Loading skeleton list
function NotifSkeleton() {
  return (
    <div className="nc">
      <div className="nc-head">
        <div>
          <div className="nc-title"><h2>Notifications</h2></div>
          <p className="nc-sub">Loading your latest updates…</p>
        </div>
      </div>
      <div className="nc-tabs">
        {TABS.map(t => <button key={t.id} className={`nc-tab ${t.id === 'all' ? 'on' : ''}`}>{t.label}</button>)}
      </div>
      <div className="nc-bulk">
        <div className="skel sk-line" style={{ width: 96 }}></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="skel" style={{ width: 116, height: 32, borderRadius: 'var(--radius-md)' }}></div>
          <div className="skel" style={{ width: 104, height: 32, borderRadius: 'var(--radius-md)' }}></div>
        </div>
      </div>
      <div className="nc-group">Today</div>
      <div className="nc-list">
        {[68, 80, 56].map((w, i) => (
          <div className="sk-row" key={i}>
            <div className="skel sk-ic"></div>
            <div className="sk-main">
              <div className="skel sk-line" style={{ width: w + '%', marginBottom: 9 }}></div>
              <div className="skel sk-line" style={{ width: (w + 8) + '%', marginBottom: 11, opacity: .7 }}></div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div className="skel sk-line" style={{ width: 64, opacity: .6 }}></div>
                <div className="skel sk-tag"></div>
              </div>
            </div>
            <div className="skel" style={{ width: 28, height: 28, borderRadius: 'var(--radius-md)' }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { NotifCenter, NotifSkeleton, NotifRow, EmptyState });
