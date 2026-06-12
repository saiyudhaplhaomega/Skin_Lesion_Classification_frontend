// Notification center — mobile phone frame + swipe-to-dismiss gesture.
const { useState: useStateM, useRef: useRefM } = React;

function StatusBar() {
  return (
    <div className="statusbar">
      <span className="clock">9:41</span>
      <span className="si">
        <Icon name="signal" size={15} />
        <Icon name="wifi" size={15} />
        <Icon name="battery-full" size={16} />
      </span>
    </div>
  );
}

// One swipeable notification row. Drag left to reveal "Dismiss" (neutral — not destructive red).
function SwipeRow({ n, onDismiss, preview = 0 }) {
  const [x, setX] = useStateM(preview);
  const [dragging, setDragging] = useStateM(false);
  const start = useRefM(0);
  const startX = useRefM(0);

  const THRESH = -84;
  const MAXBG = -104;

  const down = (e) => {
    setDragging(true);
    start.current = e.clientX;
    startX.current = x;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const move = (e) => {
    if (!dragging) return;
    const dx = e.clientX - start.current;
    let nx = Math.min(0, startX.current + dx);      // only left
    nx = Math.max(nx, MAXBG - 20);                  // rubber-band floor
    setX(nx);
  };
  const up = () => {
    if (!dragging) return;
    setDragging(false);
    if (x <= THRESH) { setX(-360); setTimeout(() => onDismiss(n.id), 160); }
    else setX(0);
  };

  return (
    <div className="swipe-wrap">
      <div className="swipe-bg"><Icon name="archive" size={18} />Dismiss</div>
      <div
        className={`swipe-row ${n.unread ? 'unread' : ''}`}
        style={{ transform: `translateX(${x}px)`, transition: dragging ? 'none' : 'transform .22s var(--ease-out)' }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <div className={`n-ic ${n.tone}`}><Icon name={n.icon} size={17} /></div>
        <div className="n-main">
          <div className="n-top">
            <span className="n-title">{n.title}</span>
            {n.tag && <span className={`n-tag ${n.tag.tone}`}><Icon name={n.tag.icon} size={11} />{n.tag.label}</span>}
          </div>
          <p className="n-desc">{n.desc}</p>
          <div className="n-meta">
            <span className="n-time">{n.time}</span>
            {n.cta && <span className="dotsep" aria-hidden="true"></span>}
            {n.cta && <button className="n-cta">{n.cta.label}<Icon name={n.cta.icon} size={13} /></button>}
          </div>
        </div>
        {n.unread && <span className="n-unreaddot" aria-label="Unread" style={{ marginTop: 2 }}></span>}
      </div>
    </div>
  );
}

// variant: 'live' (interactive) | 'swipe' (one row pre-revealed + hint) | 'empty'
function MobilePhone({ variant = 'live', tab = 'all' }) {
  const [items, setItems] = useStateM(variant === 'empty' ? [] : SEED);
  const [activeTab, setActiveTab] = useStateM(tab);
  const dismiss = (id) => setItems(xs => xs.filter(x => x.id !== id));
  const markAll = () => setItems(xs => xs.map(x => ({ ...x, unread: false })));

  const unread = items.filter(x => x.unread).length;
  const visible = items.filter(x => activeTab === 'all' || x.cat === activeTab);
  const groups = ['today', 'earlier']
    .map(g => ({ g, rows: visible.filter(x => x.group === g) }))
    .filter(o => o.rows.length);

  return (
    <div className="phone">
      <div className="phone-screen">
        <div className="notch"></div>
        <StatusBar />
        <div className="m-topbar">
          <div className="m-toprow">
            <button className="m-back" aria-label="Back"><Icon name="chevron-left" size={18} /></button>
            <h2>Notifications</h2>
            {unread > 0 && <span className="unread-pill">{unread}</span>}
            {variant === 'live' && unread > 0 && <button className="m-mark" onClick={markAll}>Mark all read</button>}
          </div>
        </div>
        <div className="m-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`m-tab ${activeTab === t.id ? 'on' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="m-scroll">
          {variant === 'swipe' && (
            <div className="swipe-hint"><Icon name="chevrons-left" size={14} />Swipe a card left to dismiss</div>
          )}
          {visible.length === 0 ? (
            <EmptyState compact />
          ) : (
            groups.map(({ g, rows }) => (
              <div key={g}>
                <div className="m-group">{GROUP_LABEL[g]}</div>
                {rows.map((n, i) => (
                  <SwipeRow
                    key={n.id}
                    n={n}
                    onDismiss={dismiss}
                    preview={variant === 'swipe' && g === 'today' && i === 0 ? -96 : 0}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MobilePhone, SwipeRow, StatusBar });
