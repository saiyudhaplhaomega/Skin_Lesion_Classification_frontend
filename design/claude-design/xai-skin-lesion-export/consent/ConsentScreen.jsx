// Consent Management Center — Skin Lesion XAI
// One interactive <ConsentScreen> rendered per labeled frame. State is real:
// radios, the training switch, the storage-change confirm, withdrawal and the
// type-to-confirm deletion all work. Initial props set each frame's scenario.

const { useState, useRef } = React;

/* ── Plain-language content (no legal jargon without a plain summary) ──── */
const MODES = {
  full: {
    name: 'Full history', tagline: 'Keep your complete lesion timeline.',
    stored: 'All photos, heatmaps, analyses, and notes.',
    howLong: 'Kept until you delete them.',
    whoSees: 'You, plus any clinician you share a case with.',
  },
  balanced: {
    name: 'Privacy balanced', tagline: 'Keep active cases, summarise the rest.',
    stored: 'Photos for active cases; older entries become text summaries.',
    howLong: 'Photos 90 days, summaries 1 year.',
    whoSees: 'You, and clinicians on active cases only.',
  },
  max: {
    name: 'Maximum privacy', tagline: 'Keep only what a review needs.',
    stored: 'Only your current case. Nothing else is retained.',
    howLong: 'Deleted automatically when a case closes.',
    whoSees: 'You only, until you choose to share.',
  },
};
const RETENTIONS = {
  '30':  { name: '30 days', impl: 'Images and results are permanently deleted 30 days after upload.' },
  '90':  { name: '90 days', impl: 'Deleted 90 days after upload — enough to compare recent changes.' },
  '365': { name: '1 year',  impl: 'Deleted 1 year after upload — supports tracking a lesion over time.' },
  'inf': { name: 'Keep until I delete', impl: 'Nothing is deleted automatically. You remove items whenever you choose.' },
};
const RET_SHORT = { '30': '30 days', '90': '90 days', '365': '1 year', 'inf': 'Until you delete' };

const STATUS_META = {
  active:    { icon: 'shield-check', label: 'Consent active',     line: 'AI-assisted analysis and lesion-history storage are turned on. You can change or withdraw any part of this at any time.' },
  partial:   { icon: 'shield-alert', label: 'Partially withdrawn', line: 'Some permissions are off. Analysis still works, but model-training contribution has been withdrawn and storage was narrowed.' },
  withdrawn: { icon: 'shield-off',   label: 'Consent withdrawn',  line: 'New analysis and storage are paused. Your existing history stays viewable. Turn consent back on whenever you are ready.' },
};

/* ── Shell pieces ──────────────────────────────────────────────────────── */
const NAV = [
  { id: 'dashboard', label: 'Dashboard',   icon: 'layout-dashboard' },
  { id: 'analyze',   label: 'Analyze',     icon: 'scan-line' },
  { id: 'bodymap',   label: 'Body map',    icon: 'map-pin' },
  { id: 'labs',      label: 'Lab results', icon: 'file-text' },
  { id: 'privacy',   label: 'Consent & privacy', icon: 'shield-check' },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="mark"><div className="reticle"></div></div>
        <div className="wm">Skin Lesion <b>XAI</b></div>
      </div>
      <div className="nav-label">Monitoring</div>
      {NAV.map(n => (
        <div key={n.id} className={`nav-item ${n.id === 'privacy' ? 'active' : ''}`}>
          <Icon name={n.icon} size={18} />{n.label}
        </div>
      ))}
      <div className="sidebar-foot">
        <div className="sidebar-user">
          <div className="avatar">JM</div>
          <div><div className="nm">Jordan Mills</div><div className="rl">Patient</div></div>
        </div>
      </div>
    </aside>
  );
}

/* ── Section header helper ─────────────────────────────────────────────── */
function SecHead({ eyebrow, title, sub }) {
  return (
    <div className="csec-head">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {sub && <p className="sub">{sub}</p>}
    </div>
  );
}

/* ── Status hero ───────────────────────────────────────────────────────── */
function StatusHero({ status, mode, retention, training }) {
  const m = STATUS_META[status];
  return (
    <div className={`card cstatus s-${status}`}>
      <div className="cstatus-main">
        <div className="cstatus-medallion"><Icon name={m.icon} size={28} /></div>
        <div className="cstatus-text">
          <p className="eyebrow">Current consent status</p>
          <h2>{m.label}</h2>
          <p>{m.line}</p>
          <span className="cstatus-updated"><Icon name="clock" size={13} />Updated 2026-06-05 · 08:42</span>
        </div>
      </div>
      <div className="cstatus-side">
        <div className="side-h">Active settings</div>
        <div className="summ-row">
          <span className="k"><Icon name="database" size={15} />Storage</span>
          <span className="v">{MODES[mode].name}</span>
        </div>
        <div className="summ-row">
          <span className="k"><Icon name="calendar-clock" size={15} />Retention</span>
          <span className="v">{RET_SHORT[retention]}</span>
        </div>
        <div className="summ-row">
          <span className="k"><Icon name="cpu" size={15} />Model training</span>
          <span className={`v ${training ? '' : 'muted-v'}`}>{training ? 'On' : 'Off'}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Storage modes ─────────────────────────────────────────────────────── */
function StorageModes({ mode, current, onPick }) {
  return (
    <div className="modes" role="radiogroup" aria-label="Storage mode">
      {Object.entries(MODES).map(([key, d]) => {
        const sel = key === mode;
        return (
          <div key={key} role="radio" aria-checked={sel} tabIndex={0}
            className={`mode-card ${sel ? 'sel' : ''}`}
            onClick={() => onPick(key)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(key); } }}>
            {key === current && <span className="mode-current-tag"><Chip tone="blue" icon="check">Current</Chip></span>}
            <div className="mode-top">
              <span className="radio-dot" aria-hidden="true"></span>
              <span className="mode-name">{d.name}</span>
            </div>
            <p className="mode-tagline">{d.tagline}</p>
            <div className="mode-detail">
              <div className="mdrow"><span className="mdk">Stored</span><span className="mdv">{d.stored}</span></div>
              <div className="mdrow"><span className="mdk">How long</span><span className="mdv">{d.howLong}</span></div>
              <div className="mdrow"><span className="mdk">Who sees</span><span className="mdv">{d.whoSees}</span></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* implications shown when switching storage mode */
const MODE_CHANGE_IMPL = {
  full: 'Your full timeline will be kept again. Nothing is deleted by this change.',
  balanced: 'Photos older than 90 days will be converted to text summaries. You can still read those summaries.',
  max: 'This removes 12 stored photos that are not part of your current case. Older analyses are kept as summaries.',
};

function ChangeBanner({ target, saving, onConfirm, onCancel }) {
  const d = MODES[target];
  return (
    <div className="change-banner" role="alert">
      <span className="cb-ic"><Icon name="alert-triangle" size={18} /></span>
      <div style={{ flex: 1 }}>
        <h4>Change storage to {d.name}?</h4>
        <p>{MODE_CHANGE_IMPL[target]}</p>
        {saving
          ? <span className="saving-row"><span className="spinner-sm"></span>Updating storage mode…</span>
          : (
            <div className="cb-actions">
              <Btn variant="primary" onClick={onConfirm}>Confirm change</Btn>
              <Btn variant="ghost" onClick={onCancel}>Keep current mode</Btn>
            </div>
          )}
      </div>
    </div>
  );
}

/* ── Retention ─────────────────────────────────────────────────────────── */
function Retention({ retention, onPick }) {
  return (
    <div>
      <div className="retention" role="radiogroup" aria-label="Retention period">
        {Object.entries(RETENTIONS).map(([key, d]) => {
          const sel = key === retention;
          return (
            <div key={key} role="radio" aria-checked={sel} tabIndex={0}
              className={`ret-opt ${sel ? 'sel' : ''}`}
              onClick={() => onPick(key)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(key); } }}>
              <span className="radio-dot" aria-hidden="true"></span>
              <span className="ret-body">
                <span className="ret-name">{d.name}</span>
                <p className="ret-impl">{d.impl}</p>
              </span>
            </div>
          );
        })}
      </div>
      <div className="ret-note">
        <Icon name="info" size={15} />
        <p>Retention applies to your images and analyses. Deleting an item removes it everywhere it was shared — a clinician keeps only their own written opinion, never your photo.</p>
      </div>
    </div>
  );
}

/* ── Training toggle ───────────────────────────────────────────────────── */
function TrainingToggle({ on, onToggle }) {
  return (
    <div className="card toggle-card">
      <div className="tc-body">
        <h3>Help improve the educational model</h3>
        <p>When this is on, a fully anonymised copy of your image — with location data and any identifying details removed — may be used to train future versions of the model. Your name and account are never attached, and turning this on or off never changes your own results.</p>
        <span className="tc-meta"><Icon name="info" size={13} />Off unless you turn it on. You can change this at any time.</span>
      </div>
      <div className="tc-control">
        <div className="switch-wrap">
          <button type="button" className={`switch ${on ? 'on' : ''}`} role="switch" aria-checked={on}
            aria-label="Contribute anonymised data to model training" onClick={onToggle}></button>
        </div>
        <span className={`switch-state ${on ? 'on' : 'off'}`}>{on ? 'On' : 'Off'}</span>
      </div>
    </div>
  );
}

/* ── Data controls ─────────────────────────────────────────────────────── */
function DataControls({ onWithdraw, onDelete, withdrawn }) {
  return (
    <div className="controls">
      <div className="card control-card withdraw">
        <div className="cc-h">
          <span className="cc-ic"><Icon name="shield-off" size={19} /></span>
          <h3>Withdraw consent</h3>
        </div>
        <p>Pause AI-assisted analysis and new storage. Your existing lesion history stays viewable, and you can turn consent back on whenever you like.</p>
        <button type="button" className="btn btn-secondary btn-block" onClick={onWithdraw}>
          <Icon name={withdrawn ? 'shield-check' : 'shield-off'} size={16} />{withdrawn ? 'Restore consent' : 'Withdraw consent'}
        </button>
      </div>
      <div className="card control-card delete">
        <div className="cc-h">
          <span className="cc-ic"><Icon name="trash-2" size={19} /></span>
          <h3>Request data deletion</h3>
        </div>
        <p>Permanently remove your photos, heatmaps, analyses, and notes. This is separate from withdrawing consent, and it cannot be undone.</p>
        <button type="button" className="btn btn-danger btn-block" onClick={onDelete}>
          <Icon name="trash-2" size={16} />Request deletion
        </button>
      </div>
    </div>
  );
}

/* ── Audit log ─────────────────────────────────────────────────────────── */
function AuditLog({ entries }) {
  return (
    <div className="card audit">
      <div className="audit-head">
        <span className="ah-l"><Icon name="history" size={16} /><h3>Consent activity log</h3></span>
        <span className="audit-readonly"><Icon name="lock" size={12} />Read-only</span>
      </div>
      <div className="audit-table">
        {entries.map((e, i) => (
          <div className="audit-row" key={i}>
            <span className="at-time">{e.time}</span>
            <span className="at-action" dangerouslySetInnerHTML={{ __html: e.action }}></span>
            <span className="at-who"><span className="who-chip">{e.who}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Modals ────────────────────────────────────────────────────────────── */
function WithdrawModal({ onClose, onConfirm }) {
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal m-withdraw" role="dialog" aria-modal="true" aria-labelledby="wd-t" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span className="modal-ic"><Icon name="shield-off" size={21} /></span>
          <div>
            <h2 id="wd-t">Withdraw consent for AI-assisted analysis?</h2>
            <p>You can turn consent back on whenever you like. Here is exactly what changes while it is off:</p>
          </div>
        </div>
        <div className="modal-body">
          <ul className="conseq-list">
            <li className="keep"><Icon name="check-circle" size={16} /><span><b>You keep full access</b> to view your existing lesion history and past results.</span></li>
            <li className="lose"><Icon name="pause-circle" size={16} /><span><b>New analysis is paused</b> — you cannot run the educational model again until you consent.</span></li>
            <li className="lose"><Icon name="pause-circle" size={16} /><span><b>Storing new photos is paused</b> — nothing new is added to your history.</span></li>
          </ul>
          <div className="legal-well">
            <Icon name="info" size={15} />
            <p><b>A minimal record of this consent change is kept for 24 months</b> because data-protection law requires it. In plain terms: we log that you changed consent and when — this record contains none of your photos.</p>
          </div>
        </div>
        <div className="modal-foot">
          <Btn variant="secondary" onClick={onClose}>Keep consent active</Btn>
          <button type="button" className="btn btn-neutral" onClick={onConfirm}><Icon name="shield-off" size={16} />Withdraw consent</button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ mobile, onClose, onConfirm }) {
  const [val, setVal] = useState('');
  const matched = val.trim() === 'DELETE MY DATA';
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal m-delete" role="dialog" aria-modal="true" aria-labelledby="dl-t" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span className="modal-ic"><Icon name="trash-2" size={21} /></span>
          <div>
            <h2 id="dl-t">Request deletion of your data</h2>
            <p>This permanently removes your lesion photos, heatmaps, analyses, and notes from Skin Lesion XAI. It cannot be undone.</p>
          </div>
        </div>
        <div className="modal-body">
          <div className="timeline">
            <div className="tl-step">
              <div className="tl-rail"><span className="tl-dot filled"></span><span className="tl-line"></span></div>
              <div className="tl-content"><div className="tl-t">Request received</div><p className="tl-d">Deletion begins as soon as you confirm below.</p></div>
            </div>
            <div className="tl-step">
              <div className="tl-rail"><span className="tl-dot"></span><span className="tl-line"></span></div>
              <div className="tl-content"><div className="tl-t">Data removed</div><p className="tl-d">Your photos and analyses are erased within 30 days.</p></div>
            </div>
            <div className="tl-step">
              <div className="tl-rail"><span className="tl-dot"></span></div>
              <div className="tl-content"><div className="tl-t">Confirmation sent</div><p className="tl-d">You receive an email once deletion is complete.</p></div>
            </div>
          </div>
          <div className="legal-well">
            <Icon name="info" size={15} />
            <p><b>One small record is kept:</b> that a deletion happened, and when. The law requires this, and it contains no images or analysis.</p>
          </div>
          <div className="confirm-field">
            <label htmlFor={`del-${mobile ? 'm' : 'd'}`}>Type <span className="code">DELETE MY DATA</span> to confirm</label>
            <input id={`del-${mobile ? 'm' : 'd'}`} type="text" autoComplete="off" spellCheck="false"
              className={matched ? 'matched' : ''} placeholder="DELETE MY DATA" value={val}
              onChange={(e) => setVal(e.target.value)} aria-describedby={`delhint-${mobile ? 'm' : 'd'}`} />
            <div id={`delhint-${mobile ? 'm' : 'd'}`} className={`confirm-hint ${matched ? 'ok' : ''}`}>
              <Icon name={matched ? 'check-circle' : 'keyboard'} size={13} />
              {matched ? 'Confirmed — the button below is now active.' : 'The delete button stays off until the text matches exactly.'}
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <button type="button" className="btn btn-danger-solid" disabled={!matched} onClick={() => matched && onConfirm()}>
            <Icon name="trash-2" size={16} />Permanently delete my data
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Top-level interactive screen ──────────────────────────────────────── */
function ConsentScreen({
  device = 'desktop', status = 'active', mode = 'full', retention = '365',
  training = true, modal: initialModal = null, pendingMode: initialPending = null,
  audit,
}) {
  const mobile = device === 'mobile';
  const [st, setSt] = useState({ status, mode, retention, training });
  const [modal, setModal] = useState(initialModal);
  const [pending, setPending] = useState(initialPending);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [log, setLog] = useState(audit || DEFAULT_AUDIT[status] || DEFAULT_AUDIT.active);
  const toastTimer = useRef(null);

  const flash = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };
  const stamp = () => {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `2026-06-05  ${p(d.getHours())}:${p(d.getMinutes())}`;
  };
  const addLog = (action, who = 'You') => setLog((l) => [{ time: stamp(), action, who }, ...l]);

  const pickMode = (key) => { if (key !== st.mode) setPending(key); };
  const confirmMode = () => {
    setSaving(true);
    setTimeout(() => {
      const name = MODES[pending].name;
      setSt((s) => ({ ...s, mode: pending }));
      addLog(`Storage mode changed to <b>${name}</b>`);
      setSaving(false); setPending(null); flash(`Storage mode set to ${name}`);
    }, 1100);
  };
  const pickRetention = (key) => {
    if (key === st.retention) return;
    setSt((s) => ({ ...s, retention: key }));
    addLog(`Retention period set to <b>${RET_SHORT[key]}</b>`);
    flash(`Retention set to ${RET_SHORT[key]}`);
  };
  const toggleTraining = () => {
    setSt((s) => {
      const next = !s.training;
      addLog(`Model-training contribution <b>${next ? 'enabled' : 'withdrawn'}</b>`);
      flash(next ? 'Model-training contribution enabled' : 'Model-training contribution withdrawn');
      return { ...s, status: next ? s.status : (s.status === 'active' ? 'partial' : s.status), training: next };
    });
  };
  const doWithdraw = () => {
    setSt((s) => ({ ...s, status: 'withdrawn', training: false }));
    addLog('Consent for AI-assisted analysis <b>withdrawn</b>');
    setModal(null); flash('Consent withdrawn');
  };
  const restoreOrWithdraw = () => {
    if (st.status === 'withdrawn') {
      setSt((s) => ({ ...s, status: 'active' }));
      addLog('Consent for AI-assisted analysis <b>restored</b>');
      flash('Consent restored');
    } else {
      setModal('withdraw');
    }
  };
  const doDelete = () => { setModal(null); flash('Deletion requested — confirmation on the way'); addLog('Data deletion <b>requested</b>'); };

  const body = (
    <>
      <div className="cpage-head">
        <h1>Consent &amp; privacy</h1>
        <p>You decide what Skin Lesion XAI keeps, for how long, and who can see it. Change anything here at any time — nothing takes effect until you confirm it.</p>
      </div>

      <Disclaimer />

      <div className="csec">
        <StatusHero status={st.status} mode={st.mode} retention={st.retention} training={st.training} />
      </div>

      <div className="csec">
        <SecHead eyebrow="Storage mode" title="How much of your history we keep"
          sub="Choose how much Skin Lesion XAI stores. Each option spells out what is kept, for how long, and who can see it." />
        <StorageModes mode={pending || st.mode} current={st.mode} onPick={pickMode} />
        {pending && <ChangeBanner target={pending} saving={saving} onConfirm={confirmMode} onCancel={() => setPending(null)} />}
      </div>

      <div className="csec">
        <SecHead eyebrow="Retention period" title="When images are deleted"
          sub="Set how long your images and analyses are kept before they are removed automatically." />
        <Retention retention={st.retention} onPick={pickRetention} />
      </div>

      <div className="csec">
        <SecHead eyebrow="Model-training use" title="Contributing to the educational model"
          sub="This is a separate choice from storing your own history. It is off unless you turn it on." />
        <TrainingToggle on={st.training} onToggle={toggleTraining} />
      </div>

      <div className="csec">
        <SecHead eyebrow="Your data controls" title="Withdraw consent or delete your data"
          sub="Withdrawing consent pauses analysis but keeps your history. Deletion permanently removes your data. They are deliberately kept separate." />
        <DataControls withdrawn={st.status === 'withdrawn'} onWithdraw={restoreOrWithdraw} onDelete={() => setModal('delete')} />
      </div>

      <div className="csec">
        <AuditLog entries={log} />
      </div>

      <div className="cfooter">
        <a className="policy-link" href="#"><Icon name="file-text" size={16} />Read the full privacy policy</a>
        <span className="ts">Account · Jordan Mills · ID <span style={{ fontWeight: 600 }}>PT-4821</span></span>
      </div>
    </>
  );

  return (
    <div className={`screen ${mobile ? 'is-mobile' : ''}`} style={{ position: 'relative' }}>
      {mobile ? (
        <div className="phone">
          <header className="m-topbar">
            <div className="brand">
              <div className="mark"><div className="reticle"></div></div>
              <div className="wm">Skin Lesion <b>XAI</b></div>
            </div>
            <button className="icon-btn" aria-label="Notifications"><Icon name="bell" size={18} /></button>
          </header>
          <div className="m-content">{body}</div>
        </div>
      ) : (
        <div className="app">
          <Sidebar />
          <div className="main">
            <header className="topbar">
              <h1>Consent &amp; privacy</h1>
              <div className="topbar-right">
                <button className="icon-btn" aria-label="Notifications"><Icon name="bell" size={18} /><span className="dot"></span></button>
                <button className="icon-btn" aria-label="Settings"><Icon name="settings" size={18} /></button>
              </div>
            </header>
            <main className="content"><div className="content-inner">{body}</div></main>
          </div>
        </div>
      )}

      {modal === 'withdraw' && <WithdrawModal onClose={() => setModal(null)} onConfirm={doWithdraw} />}
      {modal === 'delete' && <DeleteModal mobile={mobile} onClose={() => setModal(null)} onConfirm={doDelete} />}

      {toast && (
        <div className="mini-toast"><Icon name="check-circle" size={16} />{toast}</div>
      )}
    </div>
  );
}

/* default audit histories per scenario */
const DEFAULT_AUDIT = {
  active: [
    { time: '2026-06-05  08:42', action: 'Retention period set to <b>1 year</b>', who: 'You' },
    { time: '2026-05-28  17:05', action: 'Model-training contribution <b>enabled</b>', who: 'You' },
    { time: '2026-05-12  10:18', action: 'Storage mode set to <b>Full history</b>', who: 'You' },
    { time: '2026-05-12  10:17', action: 'Consent for AI-assisted analysis <b>granted</b>', who: 'You' },
    { time: '2026-05-12  10:15', action: 'Account created', who: 'System' },
  ],
  partial: [
    { time: '2026-06-05  08:42', action: 'Model-training contribution <b>withdrawn</b>', who: 'You' },
    { time: '2026-06-05  08:41', action: 'Storage mode changed to <b>Privacy balanced</b>', who: 'You' },
    { time: '2026-05-28  17:05', action: 'Model-training contribution <b>enabled</b>', who: 'You' },
    { time: '2026-05-12  10:18', action: 'Storage mode set to <b>Full history</b>', who: 'You' },
    { time: '2026-05-12  10:17', action: 'Consent for AI-assisted analysis <b>granted</b>', who: 'You' },
  ],
};

window.ConsentScreen = ConsentScreen;
