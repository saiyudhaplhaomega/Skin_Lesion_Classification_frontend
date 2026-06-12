// Lab flow — shared building blocks. Exposes helpers on window.
// Icon, Btn, Chip, StatusChip, Disclaimer come from design-system/primitives.jsx.
const { useState } = React;

/* ── Phone screen chrome (content-driven height) ──────────────────────── */
function PhoneScreen({ title, back = true, privacy = 'Private', children }) {
  return (
    <div className="screen" data-screen-label={'Patient · ' + title}>
      <div className="sbar">
        <span>9:41</span>
        <span className="dots"><i></i><i></i><i></i><span className="battery"></span></span>
      </div>
      <div className="app-bar">
        {back && <button className="nav-btn" aria-label="Go back"><Icon name="chevron-left" size={18} /></button>}
        <span className="title">{title}</span>
        {privacy && <span className="privacy-tag"><Icon name="shield-check" size={13} />{privacy}</span>}
      </div>
      <div className="screen-body">{children}</div>
    </div>
  );
}

/* ── Lab "clinical context" banner — the core safety framing ──────────── */
function LabContextBanner({ teal = false }) {
  return (
    <div className={`ctx-banner ${teal ? 'tealedge' : ''}`}>
      <Icon name="info" size={16} />
      <p><strong>Lab results are clinical context, not diagnostic proof.</strong> Values are transcribed to organize your history for a clinician — the AI model does not read or interpret them.</p>
    </div>
  );
}

/* ── Status tracker: Uploaded → Extracting → Review pending → Reviewed ── */
// steps: array of { key, title, desc, time, state: 'done'|'active'|'pending', tone }
function StatusTracker({ steps, compact = false }) {
  return (
    <div className={`tracker ${compact ? 'compact' : ''}`}>
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        const toneCls = s.tone ? `${s.tone}node` : '';
        return (
          <div key={s.key} className={`trk-step ${s.state} ${toneCls}`}>
            <div className="trk-rail">
              <div className="trk-node">
                {s.state === 'done' ? <Icon name="check" size={14} />
                  : s.state === 'active'
                    ? (s.spin ? <span className="trk-spin" aria-hidden="true"></span> : <Icon name={s.icon || 'circle'} size={14} />)
                    : <Icon name={s.icon || 'circle'} size={14} />}
              </div>
              {!last && <div className="trk-line"></div>}
            </div>
            <div className="trk-body">
              <div className="trk-t">{s.title}{s.chip}</div>
              {s.desc && <div className="trk-d">{s.desc}</div>}
              {s.time && <div className="trk-time">{s.time}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── File preview card ────────────────────────────────────────────────── */
function FileCard({ kind = 'pdf', name, sub, verified = false, onRemove = true }) {
  return (
    <div className="filecard">
      <div className={`ftn ${kind}`}>
        {kind === 'pdf' ? <Icon name="file-text" size={22} /> : <div className="ph"></div>}
      </div>
      <div className="fmeta">
        <div className="fname">{name}</div>
        <div className="fsub">
          <span>{sub}</span>
          {verified && <span className="ok"><Icon name="shield-check" size={12} />Scanned, no malware</span>}
        </div>
      </div>
      {onRemove && <button className="fx" aria-label="Remove file"><Icon name="x" size={15} /></button>}
    </div>
  );
}

/* ── Form field ───────────────────────────────────────────────────────── */
function Field({ label, optional, icon, value, placeholder, area, mono }) {
  return (
    <div className="field">
      <label>{label}{optional && <span className="opt">· optional</span>}</label>
      <div className={`ctrl ${area ? 'area' : ''}`}>
        {icon && <Icon name={icon} size={15} />}
        {area
          ? <textarea rows={2} placeholder={placeholder} defaultValue={value}></textarea>
          : <input type="text" placeholder={placeholder} defaultValue={value} style={mono ? { fontFamily: 'var(--font-mono)' } : null} />}
      </div>
    </div>
  );
}

/* ── Consent row (interactive) ────────────────────────────────────────── */
function ConsentRow({ on = false, children }) {
  const [v, setV] = useState(on);
  return (
    <div className={`consent ${v ? 'on' : ''}`} role="checkbox" aria-checked={v} tabIndex={0}
      onClick={() => setV(!v)} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setV(!v); } }}>
      <span className="box">{v && <Icon name="check" size={14} />}</span>
      <span className="ct">{children}</span>
    </div>
  );
}

/* ── Read-only lab summary (patient, after verification) ──────────────── */
function LabSummary({ title, rows }) {
  return (
    <div className="lab-summary">
      <div className="lsh">
        <span className="t"><Icon name="clipboard-list" size={15} />{title}</span>
        <Chip tone="green" icon="shield-check">Verified</Chip>
      </div>
      {rows.map((r, i) => (
        <div className="lab-row" key={i}>
          <span className="k">{r.k}</span>
          <span className={`v ${r.mono ? 'mono' : ''}`}>{r.v}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { PhoneScreen, LabContextBanner, StatusTracker, FileCard, Field, ConsentRow, LabSummary });
