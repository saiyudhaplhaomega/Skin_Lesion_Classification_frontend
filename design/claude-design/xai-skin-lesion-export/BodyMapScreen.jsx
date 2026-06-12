// BodyMapScreen.jsx — desktop shell + mobile screen for the 2D body map.
// Driven by a `s` (scenario) object. Exposes BodyMapDesktop, BodyMapMobile, PINS.

/* ── Shared lesion-pin dataset ────────────────────────────────────────── */
const PINS = {
  '02': { n: '02', loc: 'Right calf', region: 'leg-r', view: 'front', x: 200, y: 402, status: 'blue', statusLabel: 'Doctor review pending', statusIcon: 'stethoscope', date: '2026-05-30', images: 1 },
  '03': { n: '03', loc: 'Left forearm', region: 'arm-l', view: 'front', x: 280, y: 210, status: 'green', statusLabel: 'Low concern', statusIcon: 'check-circle', date: '2026-06-01', images: 4 },
  '05': { n: '05', loc: 'Right shoulder', region: 'torso', view: 'front', x: 200, y: 106, status: 'amber', statusLabel: 'Monitor', statusIcon: 'alert-triangle', date: '2026-05-24', images: 2 },
  '07': { n: '07', loc: 'Upper back', region: 'upper-back', view: 'back', x: 236, y: 150, status: 'amber', statusLabel: 'Monitor', statusIcon: 'alert-triangle', date: '2026-05-28', images: 2 },
  '09': { n: '09', loc: 'Left shoulder blade', region: 'upper-back', view: 'back', x: 250, y: 138, status: 'green', statusLabel: 'Low concern', statusIcon: 'check-circle', date: '2026-05-20', images: 3 },
};
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'analyze', label: 'Analyze', icon: 'scan-line' },
  { id: 'bodymap', label: 'Body map', icon: 'map-pin' },
  { id: 'labs', label: 'Lab results', icon: 'file-text' },
  { id: 'privacy', label: 'Privacy', icon: 'shield-check' },
];

/* ── Pieces ───────────────────────────────────────────────────────────── */
function Sidebar() {
  return (
    <aside className="bm-side">
      <div className="bm-brand">
        <div className="mark"><div className="reticle"></div></div>
        <div className="wm">Skin Lesion <b>XAI</b></div>
      </div>
      <div className="bm-navlabel">Monitoring</div>
      {NAV.map(n => (
        <div key={n.id} className={'bm-nav' + (n.id === 'bodymap' ? ' active' : '')}>
          <Icon name={n.icon} size={18} />{n.label}
        </div>
      ))}
      <div className="bm-side-foot">
        <div className="bm-avatar">JM</div>
        <div><div className="nm">Jordan Mills</div><div className="rl">Patient</div></div>
      </div>
    </aside>
  );
}

function Legend() {
  return (
    <div className="bm-legend" aria-hidden="true">
      <span className="lg"><span className="sw green"></span>Low concern</span>
      <span className="lg"><span className="sw amber"></span>Monitor</span>
      <span className="lg"><span className="sw blue"></span>Review pending</span>
    </div>
  );
}

function MapHead({ view, hasPins }) {
  const regionCount = view === 'back' ? 11 : 10;
  return (
    <div className="bm-maphead">
      <span className="vlabel"><Icon name={view === 'back' ? 'rotate-cw' : 'user'} size={15} />
        {view === 'back' ? 'Back view' : 'Front view'} · {regionCount} regions</span>
      {hasPins ? <Legend /> : <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>No lesion pins yet</span>}
    </div>
  );
}

/* side-panel cards */
function HintCard() {
  return (
    <div className="bm-card"><div className="cb">
      <div className="bm-hint">
        <div className="hi"><Icon name="map-pin" size={18} /></div>
        <div>
          <p className="ht">Add a lesion location</p>
          <p className="hd">Select any region on the silhouette to drop a numbered pin. You can attach a photo and run an educational analysis next.</p>
        </div>
      </div>
    </div></div>
  );
}
function PinList({ view, pins, activePin, onSelect, title = 'Your lesion pins' }) {
  return (
    <div className="bm-card">
      <div className="ch"><h3>{title}</h3><span className="chip neutral" style={{ fontSize: 11 }}>{pins.length} on {view}</span></div>
      <div className="bm-list">
        {pins.map(p => (
          <button key={p.n} className={'bm-row' + (activePin === p.n ? ' sel' : '')} onClick={() => onSelect && onSelect(p.n)}>
            <span className={'num ' + p.status}>{p.n}</span>
            <span className="rmain">
              <span className="rloc">{p.loc}</span>
              <span className="rdate">Updated {p.date}</span>
            </span>
            <Icon name="chevron-right" size={16} />
          </button>
        ))}
      </div>
    </div>
  );
}
function DetailCard({ pin }) {
  return (
    <div className="bm-card bm-detail">
      <div className="dtop">
        <span className={'num ' + pin.status} style={borderColorFor(pin.status)}>{pin.n}</span>
        <div><div className="dloc">{pin.loc}</div><div className="dsub">Lesion #{pin.n} · {pin.region.replace('-', ' ')}</div></div>
      </div>
      <div className="bm-thumb">
        <span className="tg">Latest photo</span>
        <Icon name="image" size={26} />
        <span>Image preview</span>
      </div>
      <div style={{ padding: '13px 16px 0' }}><StatusChip status={pin.status} label={pin.statusLabel} /></div>
      <div className="bm-meta" style={{ marginTop: 13 }}>
        <div className="mi"><div className="mk">First logged</div><div className="mv mono">2026-04-12</div></div>
        <div className="mi"><div className="mk">Last updated</div><div className="mv mono">{pin.date}</div></div>
        <div className="mi"><div className="mk">Photos</div><div className="mv"><Icon name="image" size={14} />{pin.images} in series</div></div>
        <div className="mi"><div className="mk">Size trend</div><div className="mv"><Icon name="minus" size={14} />Stable</div></div>
      </div>
      <div className="dacts">
        <button className="tlink"><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="history" size={16} />View full timeline</span><Icon name="arrow-right" size={16} /></button>
        <div style={{ display: 'flex', gap: 9 }}>
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}><Icon name="move" size={15} />Relocate pin</button>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}><Icon name="camera" size={15} />Add photo</button>
        </div>
      </div>
    </div>
  );
}
function borderColorFor() { return undefined; }
function PanelDisclaimer() {
  return <div className="disclaimer"><Icon name="shield-check" size={16} /><p><strong>This platform is not a medical diagnosis tool.</strong> It provides educational AI-supported information and helps organize lesion history for professional review.</p></div>;
}

/* modals */
function Modal({ s }) {
  if (s.modal === 'placement') {
    return (
      <div className="bm-overlay">
        <div className="bm-modal" role="dialog" aria-label="Confirm lesion location">
          <div className="mhead">
            <div className="micon"><Icon name="map-pin" size={20} /></div>
            <div><h3>Confirm lesion location</h3><p className="mh-sub">You're adding a new lesion marker to your body map. You can attach a photo and run an analysis next.</p></div>
          </div>
          <div className="mbody">
            <span className="bm-region-pill"><Icon name="crosshair" size={15} />{s.selLabel}</span>
            <div className="bm-field"><label>Add a short label (optional)</label><input placeholder="e.g. mole near left elbow" /></div>
          </div>
          <div className="mnote"><PanelDisclaimer /></div>
          <div className="mfoot">
            <button className="btn btn-secondary">Choose different area</button>
            <button className="btn btn-primary"><Icon name="check" size={16} />Save location</button>
          </div>
        </div>
      </div>
    );
  }
  if (s.modal === 'edit') {
    return (
      <div className="bm-overlay">
        <div className="bm-modal" role="dialog" aria-label="Move lesion pin">
          <div className="mhead">
            <div className="micon amber"><Icon name="move" size={20} /></div>
            <div><h3>Move this lesion pin?</h3><p className="mh-sub">Relocating pin {s.editPin} changes only where it appears on the body map. Its photos, history, and analysis stay linked.</p></div>
          </div>
          <div className="mbody">
            <span className="bm-region-pill"><span className="old">{s.editFrom}</span><Icon name="arrow-right" size={15} className="arrow" />{s.selLabel}</span>
          </div>
          <div className="mfoot">
            <button className="btn btn-secondary">Cancel</button>
            <button className="btn btn-primary"><Icon name="check" size={16} />Move pin</button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

/* ── Desktop screen ───────────────────────────────────────────────────── */
function BodyMapDesktop({ s }) {
  const pins = (s.pins || []).map(n => PINS[n]);
  const active = s.activePin ? PINS[s.activePin] : null;
  const mode = s.mode;
  return (
    <div className="bm-shell">
      <Sidebar />
      <div className="bm-work">
        <div className="bm-topbar">
          <div className="tt"><h2>Body map</h2><span className="ts">Pin where each lesion is on your body, then open its timeline</span></div>
          <div className="tr">
            <div className="seg" role="tablist" aria-label="Body view">
              <button className={s.view !== 'back' ? 'on' : ''} role="tab" aria-selected={s.view !== 'back'}><Icon name="user" size={14} />Front</button>
              <button className={s.view === 'back' ? 'on' : ''} role="tab" aria-selected={s.view === 'back'}><Icon name="rotate-cw" size={14} />Back</button>
            </div>
            {(mode === 'placement' || mode === 'edit') ? (
              <button className="btn btn-secondary"><Icon name="x" size={16} />Cancel</button>
            ) : (
              <button className="btn btn-primary"><Icon name="map-pin" size={16} />Add lesion location</button>
            )}
          </div>
        </div>

        <div className="bm-body">
          <div className="bm-mapcard">
            <MapHead view={s.view} hasPins={pins.length > 0} />
            <div className="bm-stage-wrap">
              <div className="bm-stage">
                <Silhouette view={s.view} sel={s.sel} locked={mode === 'detail'} onRegion={() => {}} />
                <div className="bm-pinlayer">
                  {s.ghost && <Pin p={s.ghost} ghost />}
                  {s.target && <span className="bm-target" style={pct(s.target.x, s.target.y)}><span className="ring"></span></span>}
                  {pins.map(p => (
                    <Pin key={p.n} p={p} preview={p} active={s.activePin === p.n} showPreview={s.hoverPin === p.n} onClick={() => {}} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bm-panel">
            {mode === 'detail' && active ? (
              <>
                <DetailCard pin={active} />
                <PanelDisclaimer />
              </>
            ) : mode === 'edit' ? (
              <>
                <div className="bm-card"><div className="cb">
                  <div className="bm-hint">
                    <div className="hi"><Icon name="move" size={18} /></div>
                    <div><p className="ht">Relocating pin {s.editPin}</p><p className="hd">Tap a new region on the map to move this lesion's marker. Confirm before it's saved — nothing changes until you do.</p></div>
                  </div>
                </div></div>
                <PinList view={s.view} pins={pins} activePin={s.editPin} title="Pin being moved" />
              </>
            ) : pins.length > 0 ? (
              <>
                <PinList view={s.view} pins={pins} activePin={s.activePin} />
                <HintCard />
                <PanelDisclaimer />
              </>
            ) : (
              <>
                <HintCard />
                <PanelDisclaimer />
              </>
            )}
          </div>
        </div>
      </div>
      <Modal s={s} />
    </div>
  );
}

/* ── Mobile screen ────────────────────────────────────────────────────── */
function BodyMapMobile({ s }) {
  const pins = (s.pins || []).map(n => PINS[n]);
  const active = s.activePin ? PINS[s.activePin] : null;
  return (
    <div className="bm-m">
      <div className="bm-m-top">
        <div className="bm-m-toprow">
          <div className="bm-m-back"><Icon name="arrow-left" size={18} /></div>
          <h2>Body map</h2>
          <div className="bm-m-back" aria-label="Help"><Icon name="info" size={18} /></div>
        </div>
        <div className="seg" role="tablist" aria-label="Body view">
          <button className={s.view !== 'back' ? 'on' : ''}><Icon name="user" size={14} />Front</button>
          <button className={s.view === 'back' ? 'on' : ''}><Icon name="rotate-cw" size={14} />Back</button>
        </div>
      </div>
      <div className="bm-m-stage-wrap">
        <div className="bm-m-stage">
          <Silhouette view={s.view} sel={s.sel} locked onRegion={() => {}} />
          <div className="bm-pinlayer">
            {pins.map(p => <Pin key={p.n} p={p} preview={p} active={s.activePin === p.n} showPreview={s.hoverPin === p.n} onClick={() => {}} />)}
          </div>
        </div>
        {s.sheet !== 'detail' && s.sheet !== 'placement' && (
          <div className="bm-m-hint">
            <div className="hi"><Icon name="map-pin" size={17} /></div>
            <div><div className="ht">Tap a region to add a lesion</div><div className="hd">{pins.length} pins on this view · tap one to open it</div></div>
          </div>
        )}
      </div>

      {s.sheet === 'detail' && active && (
        <>
          <div className="bm-sheet-scrim"></div>
          <div className="bm-sheet">
            <div className="grip"></div>
            <div className="sh-pad">
              <div className="sh-head">
                <span className={'num ' + active.status}>{active.n}</span>
                <div style={{ flex: 1 }}><div className="sloc">{active.loc}</div><div className="ssub">Lesion #{active.n} · updated {active.date}</div></div>
                <Icon name="x" size={20} color="var(--text-muted)" />
              </div>
              <StatusChip status={active.status} label={active.statusLabel} />
              <div className="bm-meta" style={{ marginTop: 14, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div className="mi"><div className="mk">Photos</div><div className="mv"><Icon name="image" size={14} />{active.images} in series</div></div>
                <div className="mi"><div className="mk">Size trend</div><div className="mv"><Icon name="minus" size={14} />Stable</div></div>
              </div>
              <div className="sh-acts">
                <button className="btn btn-primary btn-block"><Icon name="history" size={16} />View full timeline</button>
                <button className="btn btn-secondary btn-block"><Icon name="move" size={15} />Relocate pin</button>
              </div>
            </div>
          </div>
        </>
      )}

      {s.sheet === 'placement' && (
        <>
          <div className="bm-sheet-scrim"></div>
          <div className="bm-sheet">
            <div className="grip"></div>
            <div className="sh-pad">
              <div className="sh-head" style={{ paddingBottom: 8 }}>
                <span className="num" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}><Icon name="map-pin" size={16} /></span>
                <div style={{ flex: 1 }}><div className="sloc">Confirm location</div><div className="ssub">New lesion marker</div></div>
              </div>
              <span className="bm-region-pill" style={{ width: '100%' }}><Icon name="crosshair" size={15} />{s.selLabel}</span>
              <div className="bm-field"><label>Add a short label (optional)</label><input placeholder="e.g. mole near left elbow" /></div>
              <div style={{ marginTop: 14 }}><PanelDisclaimer /></div>
              <div className="sh-acts">
                <button className="btn btn-primary btn-block"><Icon name="check" size={16} />Save location</button>
                <button className="btn btn-ghost btn-block">Choose different area</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

Object.assign(window, { PINS, BodyMapDesktop, BodyMapMobile });
