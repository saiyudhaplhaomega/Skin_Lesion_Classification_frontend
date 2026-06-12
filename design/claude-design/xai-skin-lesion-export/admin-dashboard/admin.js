/* ============================================================================
   Administrator / platform-ops dashboard — template renderer (vanilla JS)

   PRIVACY STANCE (enforced throughout):
   • No raw PHI. Patient accounts are pseudonymized (opaque IDs only) — no
     names, emails, images, or clinical content for patients.
   • No patient diagnoses or model predictions are ever shown here.
   • Status is always color + icon + text (never color alone).
   • Destructive actions route through a confirmation modal that states the
     exact consequences before anything happens.
   ============================================================================ */

const ic = (name) => `<span class="app-icon"><i data-lucide="${name}"></i></span>`;

/* ── Small shared chips ──────────────────────────────────────────────── */
const statusLine = (status) => {
  const map = {
    active:    ['green',  'check-circle', 'Active'],
    suspended: ['red',    'ban',          'Suspended'],
    invited:   ['blue',   'mail',         'Invited'],
    locked:    ['amber',  'lock',         'Locked'],
  };
  const [tone, icon, label] = map[status];
  return `<span class="statline ${tone}">${ic(icon)}${label}</span>`;
};
const consentLine = (consent) => {
  if (consent === 'na') return `<span class="t-na">—</span>`;
  const map = {
    granted:   ['green',   'shield-check', 'Granted'],
    withdrawn: ['neutral', 'shield-off',   'Withdrawn'],
  };
  const [tone, icon, label] = map[consent];
  return `<span class="statline ${tone}">${ic(icon)}${label}</span>`;
};
const ROLE = {
  patient:    { icon: 'user',          av: 'patient',    label: 'Patient' },
  doctor:     { icon: 'stethoscope',   av: 'doctor',     label: 'Doctor' },
  researcher: { icon: 'flask-conical', av: 'researcher', label: 'Researcher' },
  admin:      { icon: 'shield',        av: 'admin',      label: 'Admin' },
};
const roleChip = (role) => `<span class="rolechip">${ic(ROLE[role].icon)}${ROLE[role].label}</span>`;

/* ════════════════════════════════════════════════════════════════════════
   DATA (de-identified / pseudonymized fixtures)
   ════════════════════════════════════════════════════════════════════════ */
const USERS = [
  { role:'doctor',     name:'Dr. M. Okonkwo', id:'DR-2290',  sub:'Dermatology · review queue',       status:'active',    consent:'na',        last:'22 min ago', utc:'08:52 UTC' },
  { role:'patient',    name:'Patient account', id:'PT-7K2F9A', sub:'Self-managed account',            status:'active',    consent:'granted',   last:'2 hours ago', utc:'07:14 UTC' },
  { role:'patient',    name:'Patient account', id:'PT-3D8B11', sub:'Self-managed account',            status:'active',    consent:'withdrawn', last:'6 days ago',  utc:'31 May' },
  { role:'researcher', name:'R. Cheng',       id:'RS-0142',  sub:'ML research · read-only',          status:'active',    consent:'na',        last:'3 hours ago', utc:'06:30 UTC' },
  { role:'patient',    name:'Patient account', id:'PT-9X4C07', sub:'Self-managed account',            status:'suspended', consent:'granted',   last:'12 days ago', utc:'25 May' },
  { role:'doctor',     name:'Dr. L. Restrepo', id:'DR-2318',  sub:'Dermatology · pending first sign-in', status:'invited', consent:'na',     last:'never',       utc:'—' },
  { role:'admin',      name:'A. Salomon',     id:'AD-0007',  sub:'Platform administrator',           status:'active',    consent:'na',        last:'just now',    utc:'09:18 UTC' },
  { role:'patient',    name:'Patient account', id:'PT-5B2E90', sub:'Self-managed account',            status:'locked',    consent:'granted',   last:'1 day ago',   utc:'5 Jun' },
];

const TRAINING = [
  { id:'CS-4471A', reason:'Doctor-verified label · research consent on file', tag:'Fitzpatrick V', age:'2 days', by:'DR-2290' },
  { id:'CS-4470F', reason:'Doctor-verified label · research consent on file', tag:'Fitzpatrick VI', age:'2 days', by:'DR-2301' },
  { id:'CS-4468C', reason:'Doctor-verified label · research consent on file', tag:'Fitzpatrick II', age:'3 days', by:'DR-2290' },
];
const FLAGGED = [
  { id:'CS-4459D', flag:'Image quality below threshold', icon:'image-off', tone:'amber',   age:'4 hours ago' },
  { id:'CS-4452B', flag:'Consent changed after submission', icon:'shield-off', tone:'red', age:'1 day ago' },
  { id:'CS-4448A', flag:'Possible duplicate capture', icon:'copy', tone:'neutral',          age:'2 days ago' },
];

const AUDIT = [
  { t:'09:14:22', actor:{ role:'admin', id:'AD-0007' },      action:['neutral','toggle-right','Flag changed'],   target:'gradcam_v2_overlay → staging:on', env:'staging' },
  { t:'09:02:10', actor:{ system:true },                     action:['red','alert-octagon','Breaker opened'],     target:'lab-ocr-service',                  env:'prod' },
  { t:'08:51:39', actor:{ role:'doctor', id:'DR-2290' },     action:['neutral','stethoscope','Case reviewed'],    target:'CS-4419E',                         env:'prod' },
  { t:'08:40:05', actor:{ role:'patient', id:'PT-3D8B11' },  action:['neutral','shield-off','Consent withdrawn'], target:'own account',                      env:'prod' },
  { t:'08:22:47', actor:{ role:'admin', id:'AD-0007' },      action:['red','ban','User suspended'],               target:'PT-9X4C07',                        env:'prod' },
  { t:'08:05:13', actor:{ system:true },                     action:['blue','git-merge','Model promoted'],        target:'v2.4.1 → production',              env:'prod' },
  { t:'07:58:00', actor:{ role:'researcher', id:'RS-0142' }, action:['neutral','download','Report exported'],     target:'fairness_audit_2026-06',           env:'prod' },
  { t:'07:30:42', actor:{ role:'admin', id:'AD-0007' },      action:['amber','user-cog','Role changed'],          target:'DR-2318 → doctor',                 env:'prod' },
];

const FLAGS = [
  { key:'gradcam_v2_overlay',        desc:'New Grad-CAM rendering pipeline for the explanation heatmap', dev:1, staging:1, prod:0, changed:'AD-0007 · 09:14 today' },
  { key:'fairness_floor_enforcement', desc:'Hold auto-routing when a subgroup falls below the sensitivity floor', dev:1, staging:1, prod:1, changed:'AD-0007 · 2 Jun' },
  { key:'doctor_queue_autoassign',   desc:'Assign incoming cases to the least-loaded reviewer',          dev:1, staging:0, prod:0, changed:'AD-0007 · 28 May' },
  { key:'patient_lab_ocr',           desc:'Extract values from uploaded lab PDFs via OCR',               dev:1, staging:1, prod:1, changed:'AD-0007 · 20 May' },
  { key:'maintenance_banner',        desc:'Show the scheduled-maintenance notice to all roles',          dev:0, staging:0, prod:0, changed:'— · never set' },
  { key:'new_patient_onboarding',    desc:'Revised first-run consent walkthrough',                       dev:1, staging:1, prod:0, changed:'AD-0007 · 4 Jun' },
];

const SERVICES = [
  { name:'API gateway',          icon:'globe',   status:'green', m:[['142 ms','p95 latency'],['99.98%','30-day uptime']] },
  { name:'Model inference',      icon:'cpu',     status:'green', m:[['1.8 s','p95 latency'],['3','queue depth']] },
  { name:'Grad-CAM service',     icon:'layers',  status:'amber', m:[['4.2 s','p95 latency'],['+2.1 s','vs baseline']] },
  { name:'Image object storage', icon:'database',status:'green', m:[['68%','capacity used'],['AES-256','at rest']] },
  { name:'Primary database',     icon:'server',  status:'green', m:[['40 ms','replication lag'],['ready','failover']] },
  { name:'Notification delivery',icon:'bell',    status:'green', m:[['260 ms','p95 send'],['0.2%','retry rate']] },
];
const SVC_STATUS = {
  green: ['green','check-circle','Operational'],
  amber: ['amber','alert-triangle','Degraded'],
  red:   ['red','alert-octagon','Outage'],
};

const BREAKERS = [
  { name:'Model inference breaker',     sub:'Protects the inference path from overload',  state:'closed',    meta:'Last state change 4 Jun', act:false },
  { name:'Notification delivery breaker',sub:'Guards the outbound notification channel',  state:'half-open', meta:'Testing recovery · 2 probes passed', act:false },
  { name:'Lab OCR breaker',             sub:'Isolates the lab-PDF extraction worker',     state:'open',      meta:'Tripped 09:02 · auto-retry in 4m', act:true },
];
const BREAKER_STATE = {
  closed:    ['green',  'check-circle',  'Closed · healthy'],
  'half-open':['amber', 'loader',        'Half-open · recovering'],
  open:      ['red',    'alert-octagon', 'Open · calls blocked'],
};

/* ════════════════════════════════════════════════════════════════════════
   SECTION RENDERERS
   ════════════════════════════════════════════════════════════════════════ */
const rsec = (icon, title, { meta='', adminOnly=false, link='' } = {}) =>
  `<div class="r-sec"><h3>${ic(icon)}${title}${adminOnly?`<span class="admin-only">${ic('lock')}Admin only</span>`:''}</h3><span class="r-rule"></span>${meta?`<span class="r-meta">${meta}</span>`:''}${link?`<span class="r-link">${link}${ic('chevron-right')}</span>`:''}</div>`;

/* Controls bar */
function controls() {
  return `
  <div class="controls">
    <div class="control">
      <span class="c-label">Environment scope</span>
      <span class="select">${ic('layers')}Production${ic('chevron-down')}<span class="chev"></span></span>
    </div>
    <div class="control">
      <span class="c-label">Region</span>
      <span class="select mono">${ic('globe')}eu-central${ic('chevron-down')}</span>
    </div>
    <div class="spacer"></div>
    <span class="updated">Auto-refresh · last 6 Jun 2026 · 09:18 UTC</span>
    <button class="btn btn-secondary">${ic('refresh-cw')}Refresh</button>
  </div>`;
}

/* 1 ── Subscription / platform overview */
function subscriptionOverview() {
  const kpis = [
    { icon:'users',       name:'Active patients', val:'8,412', u:'', delta:'+184', dir:'up',   foot:'enrolled, consent on file · last 30 days' },
    { icon:'stethoscope', name:'Active doctors',  val:'37',    u:'', delta:'+2',   dir:'up',   foot:'reviewing the professional queue' },
    { icon:'clock',       name:'Pending reviews', val:'126',   u:'cases', delta:'+19',  dir:'flat', foot:'awaiting professional opinion' },
    { icon:'flask-conical',name:'Researchers + admins', val:'9', u:'', delta:'0', dir:'flat', foot:'6 research · 3 administrator' },
  ];
  return `
  <div class="kpi-row">${kpis.map(k=>`
    <div class="kpi">
      <div class="k-top"><span class="ki">${ic(k.icon)}</span><span class="k-name">${k.name}</span></div>
      <div class="k-val">${k.val}${k.u?`<span class="u">${k.u}</span>`:''}</div>
      <div class="k-foot"><span class="delta ${k.dir}">${ic(k.dir==='up'?'arrow-up':k.dir==='down'?'arrow-down':'minus')}${k.delta}</span><span class="muted">${k.foot}</span></div>
    </div>`).join('')}</div>
  <div class="seat-strip">
    <div class="ss-block"><span class="ss-lab">Plan</span><span class="ss-val">Institutional · 50 clinician seats</span></div>
    <div class="sep"></div>
    <div class="ss-bar">
      <div class="ss-track"><div class="seg-used" style="width:74%"></div><div class="seg-pend" style="width:8%"></div></div>
      <div class="ss-meta"><span><span class="dot" style="background:var(--accent)"></span>37 active</span><span><span class="dot" style="background:var(--blue-border)"></span>4 invited</span><span><span class="dot" style="background:var(--surface-sunken);border:1px solid var(--border-strong)"></span>9 open</span></div>
    </div>
    <div class="sep"></div>
    <div class="ss-block"><span class="ss-lab">Renews</span><span class="ss-val">1 Jan 2027</span></div>
  </div>`;
}

/* 2 ── User management table */
function userRow(u, { selectedId='' } = {}) {
  const sel = u.id === selectedId ? ' sel' : '';
  const susp = u.status === 'suspended' ? ' suspended-row' : '';
  return `<tr class="clickable${sel}${susp}">
    <td>
      <div class="acct">
        <div class="av ${ROLE[u.role].av}">${u.role==='patient'?ic('user'):u.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
        <div class="a-main"><div class="a-name">${u.name}</div><div class="a-id">${u.id}</div></div>
      </div>
    </td>
    <td>${roleChip(u.role)}</td>
    <td>${statusLine(u.status)}</td>
    <td>${consentLine(u.consent)}</td>
    <td><div class="t-time">${u.last}<span class="rel">${u.utc}</span></div></td>
    <td><div class="row-act"><button class="mini-btn ghost">${ic('eye')}View</button><button class="icon-kebab" aria-label="More actions">${ic('more-horizontal')}</button></div></td>
  </tr>`;
}
function userManagement(mode, opts = {}) {
  const filters = `
  <div class="filters">
    <div class="f-search">${ic('search')}<input placeholder="Search by account ID or role" ${mode==='empty'?'value="PT-22"':''} /></div>
    <span class="f-sel">${ic('users')}Role: <span class="fv">${mode==='empty'?'Patient':'All'}</span>${ic('chevron-down')}</span>
    <span class="f-sel">${ic('activity')}Status: <span class="fv">All</span>${ic('chevron-down')}</span>
    <span class="f-sel">${ic('shield-check')}Consent: <span class="fv">All</span>${ic('chevron-down')}</span>
    <span class="f-spacer"></span>
    <button class="btn btn-primary" style="padding:8px 14px;font-size:13px">${ic('user-plus')}Invite user</button>
  </div>`;
  const head = `<thead><tr><th>Account</th><th>Role</th><th>Status</th><th>Consent</th><th>Last active</th><th style="text-align:right">Actions</th></tr></thead>`;
  let body;
  if (mode === 'empty') {
    body = `<tbody><tr><td colspan="6" style="padding:0">
      <div class="state-box"><div class="sb-ic accent">${ic('search-x')}</div>
        <h4>No accounts match these filters</h4>
        <p>No patient accounts contain "PT-22". Try a different account ID, or clear the role filter to search every role.</p>
        <div class="sb-act"><button class="btn btn-secondary">${ic('x')}Clear filters</button></div>
      </div></td></tr></tbody>`;
  } else {
    body = `<tbody>${USERS.map(u=>userRow(u, opts)).join('')}</tbody>`;
  }
  const foot = mode === 'empty' ? '' : `<div class="t-foot"><span class="tf-info">Showing 8 of 8,495 accounts · patients shown by pseudonymized ID only</span><div class="tf-pages"><button>${ic('chevron-left')}</button><button class="on">1</button><button>2</button><button>3</button><button>…</button><button>${ic('chevron-right')}</button></div></div>`;
  return `<div class="panel">
    <div class="panel-head"><span class="ph-title">${ic('users')}User accounts</span><span class="ph-count">${mode==='empty'?'0':'8,495'}</span><span class="ph-spacer"></span><button class="mini-btn ghost">${ic('download')}Export list</button></div>
    ${filters}
    <table class="dtable">${head}${body}</table>
    ${foot}
  </div>`;
}

/* 3 ── Approval queue */
function trainingItem(t) {
  return `<div class="q-item">
    <div class="q-ic blue">${ic('graduation-cap')}</div>
    <div class="q-body">
      <div class="q-head"><span class="q-id">${t.id}</span><span class="tag">${t.tag}</span></div>
      <div class="q-desc">${t.reason}</div>
      <div class="q-meta"><span>${ic('clock')} waiting ${t.age}</span><span>verified by ${t.by}</span></div>
    </div>
    <div class="q-act"><button class="mini-btn green">${ic('check')}Approve</button><button class="mini-btn ghost">${ic('clock')}Hold</button></div>
  </div>`;
}
function flaggedItem(f) {
  return `<div class="q-item">
    <div class="q-ic ${f.tone==='red'?'amber':f.tone==='amber'?'amber':''}">${ic(f.icon)}</div>
    <div class="q-body">
      <div class="q-head"><span class="q-id">${f.id}</span><span class="statline ${f.tone}">${ic(f.tone==='red'?'alert-octagon':f.tone==='amber'?'alert-triangle':'info')}${f.flag}</span></div>
      <div class="q-meta"><span>${ic('clock')} flagged ${f.age}</span></div>
    </div>
    <div class="q-act"><button class="mini-btn">${ic('eye')}Review</button><button class="mini-btn ghost">${ic('x')}Dismiss</button></div>
  </div>`;
}
function approvalQueue(mode) {
  const trainingEmpty = `<div class="state-box"><div class="sb-ic green">${ic('check-circle')}</div><h4>Queue clear</h4><p>No cases are waiting for training-eligibility approval. Verified labels appear here for sign-off before joining the next training round.</p></div>`;
  const flaggedEmpty = `<div class="state-box"><div class="sb-ic green">${ic('check-circle')}</div><h4>Nothing flagged</h4><p>No operational flags are open. Image-quality, consent, and duplicate flags surface here for review.</p></div>`;
  return `<div class="grid-2">
    <div class="panel">
      <div class="panel-head"><span class="ph-title">${ic('graduation-cap')}Training eligibility</span><span class="ph-count">${mode==='empty'?'0':'12'}</span><span class="ph-spacer"></span>${mode==='empty'?'':`<button class="mini-btn">${ic('check-check')}Approve all visible</button>`}</div>
      <div class="q-list">${mode==='empty'?trainingEmpty:TRAINING.map(trainingItem).join('')}</div>
      ${mode==='empty'?'':`<div class="t-foot"><span class="tf-info">3 of 12 shown · aggregate case IDs only, no diagnoses</span><span class="r-link">View all${ic('chevron-right')}</span></div>`}
    </div>
    <div class="panel">
      <div class="panel-head"><span class="ph-title">${ic('flag')}Flagged cases</span><span class="ph-count">${mode==='empty'?'0':'5'}</span></div>
      <div class="q-list">${mode==='empty'?flaggedEmpty:FLAGGED.map(flaggedItem).join('')}</div>
      ${mode==='empty'?'':`<div class="t-foot"><span class="tf-info">3 of 5 shown · operational flags, not clinical findings</span><span class="r-link">View all${ic('chevron-right')}</span></div>`}
    </div>
  </div>`;
}

/* 4 ── Audit log */
function auditRow(a) {
  const actor = a.actor.system
    ? `<span class="rolechip">${ic('cpu')}System</span>`
    : `<div class="acct" style="gap:8px">${roleChip(a.actor.role)}<span class="a-id" style="margin:0">${a.actor.id}</span></div>`;
  const [tone, aicon, label] = a.action;
  return `<tr>
    <td><span class="t-time">${a.t}<span class="rel">6 Jun 2026</span></span></td>
    <td>${actor}</td>
    <td><span class="statline ${tone}">${ic(aicon)}${label}</span></td>
    <td><span class="t-target">${a.target}</span></td>
    <td><span class="rolechip" style="text-transform:uppercase;font-family:var(--font-mono);font-size:10.5px">${a.env}</span></td>
  </tr>`;
}
function auditLog(mode) {
  const filters = `
  <div class="filters">
    <div class="f-search">${ic('search')}<input placeholder="Search actor ID or target" ${mode==='empty'?'value="PT-0000"':''} /></div>
    <span class="f-sel">${ic('users')}Role: <span class="fv">All</span>${ic('chevron-down')}</span>
    <span class="f-sel">${ic('zap')}Action: <span class="fv">${mode==='empty'?'Consent':'All'}</span>${ic('chevron-down')}</span>
    <span class="f-sel">${ic('layers')}Env: <span class="fv">All</span>${ic('chevron-down')}</span>
    <span class="f-sel">${ic('calendar')}Today${ic('chevron-down')}</span>
    <span class="f-spacer"></span>
    <button class="mini-btn ghost">${ic('download')}Export CSV</button>
  </div>`;
  const head = `<thead><tr><th>Time (UTC)</th><th>Actor</th><th>Action</th><th>Target</th><th>Env</th></tr></thead>`;
  let body, foot;
  if (mode === 'error') {
    body = `<tbody><tr><td colspan="5" style="padding:0">
      <div class="state-box"><div class="sb-ic red">${ic('wifi-off')}</div>
        <h4>Couldn't load the audit log</h4>
        <p>The audit service didn't respond within the timeout. Entries are still being recorded — only this view failed to load.</p>
        <div class="sb-act"><button class="btn btn-primary">${ic('refresh-cw')}Retry</button><button class="btn btn-secondary">${ic('life-buoy')}Status page</button></div>
      </div></td></tr></tbody>`;
    foot = '';
  } else if (mode === 'empty') {
    body = `<tbody><tr><td colspan="5" style="padding:0">
      <div class="state-box"><div class="sb-ic accent">${ic('scroll-text')}</div>
        <h4>No audit entries for this filter</h4>
        <p>No consent actions by "PT-0000" were recorded today. Widen the date range or clear the action filter to see more.</p>
        <div class="sb-act"><button class="btn btn-secondary">${ic('x')}Clear filters</button></div>
      </div></td></tr></tbody>`;
    foot = '';
  } else {
    body = `<tbody>${AUDIT.map(auditRow).join('')}</tbody>`;
    foot = `<div class="t-foot"><span class="tf-info">8 of 1,240 events today · targets pseudonymized · tamper-evident, append-only</span><div class="tf-pages"><button>${ic('chevron-left')}</button><button class="on">1</button><button>2</button><button>3</button><button>${ic('chevron-right')}</button></div></div>`;
  }
  return `<div class="panel">
    <div class="panel-head"><span class="ph-title">${ic('scroll-text')}Platform audit log</span><span class="ph-spacer"></span><span class="statline neutral">${ic('lock')}Append-only</span></div>
    ${filters}
    <table class="dtable">${head}${body}</table>
    ${foot}
  </div>`;
}

/* 5 ── Feature flags (per environment) */
function envTog(on, label) {
  return `<span class="envtog ${on?'on':'off'}"><span class="sw"></span><span class="st">${on?'On':'Off'}</span></span>`;
}
function flagRow(f) {
  return `<tr>
    <td style="max-width:340px"><div class="flag-key">${f.key}</div><div class="flag-desc">${f.desc}</div></td>
    <td>${envTog(f.dev)}</td>
    <td>${envTog(f.staging)}</td>
    <td>${envTog(f.prod)}</td>
    <td><span class="t-time">${f.changed}</span></td>
    <td><div class="row-act"><button class="icon-kebab" aria-label="Flag history">${ic('history')}</button></div></td>
  </tr>`;
}
function featureFlags() {
  return `<div class="panel">
    <div class="panel-head"><span class="ph-title">${ic('toggle-right')}AppConfig feature flags</span><span class="ph-spacer"></span><span class="t-time">6 flags · 3 environments</span></div>
    <table class="dtable">
      <thead><tr><th>Flag</th><th>Dev</th><th>Staging</th><th>Prod</th><th>Last changed</th><th style="text-align:right">History</th></tr></thead>
      <tbody>${FLAGS.map(flagRow).join('')}</tbody>
    </table>
    <div class="flags-foot">${ic('alert-triangle')}<span>Changing a <b>Prod</b> flag takes effect for all users immediately and is recorded to the audit log. Promote through Dev → Staging first.</span></div>
  </div>`;
}

/* 6 ── System health */
function svcCard(s) {
  const [tone, icon, label] = SVC_STATUS[s.status];
  return `<div class="svc ${s.status==='amber'?'degraded':s.status==='red'?'down':''}">
    <div class="svc-top"><span class="svc-name">${ic(s.icon)}${s.name}</span><span class="statline ${tone}">${ic(icon)}${label}</span></div>
    <div class="svc-metrics">${s.m.map(([v,l])=>`<div class="sm"><span class="sm-v">${v}</span><span class="sm-l">${l}</span></div>`).join('')}</div>
  </div>`;
}
function breakerRow(b) {
  const [tone, icon, label] = BREAKER_STATE[b.state];
  const led = tone==='green'?'var(--green)':tone==='amber'?'var(--amber)':'var(--red)';
  return `<div class="breaker-row">
    <div><div class="br-name">${b.name}</div><div class="br-sub">${b.sub}</div></div>
    <div class="br-state"><span class="br-led" style="background:${led}"></span><span class="statline ${tone}">${ic(icon)}${label}</span></div>
    <div class="br-meta">${b.meta}</div>
    <div class="br-act">${b.act?`<button class="mini-btn danger">${ic('rotate-ccw')}Reset</button>`:`<button class="mini-btn ghost">${ic('line-chart')}Trace</button>`}</div>
  </div>`;
}
function systemHealth(mode) {
  if (mode === 'error') {
    return `<div class="panel"><div style="padding:0">
      <div class="state-box"><div class="sb-ic red">${ic('server-off')}</div>
        <h4>System health is temporarily unavailable</h4>
        <p>The monitoring service can't be reached right now. This affects only the health view — the platform services themselves continue to run.</p>
        <div class="sb-act"><button class="btn btn-primary">${ic('refresh-cw')}Retry now</button><button class="btn btn-secondary">${ic('external-link')}Open status page</button></div>
        <span class="t-time" style="margin-top:8px">Last successful check 09:11 UTC · 7 min ago</span>
      </div></div></div>`;
  }
  return `
  <div class="health-grid">${SERVICES.map(svcCard).join('')}</div>
  <div class="breaker-wrap" style="margin-top:var(--sp-md)">
    <div class="breaker-head">
      <span class="bh-t">${ic('git-fork')}Circuit breakers</span>
      <span class="bh-legend">
        <span class="lg"><span class="dot" style="background:var(--green)"></span>Closed — traffic flowing</span>
        <span class="lg"><span class="dot" style="background:var(--amber)"></span>Half-open — testing recovery</span>
        <span class="lg"><span class="dot" style="background:var(--red)"></span>Open — calls blocked</span>
      </span>
    </div>
    ${BREAKERS.map(breakerRow).join('')}
  </div>`;
}

/* footer privacy note */
const dataNote = () => `<div class="r-foot"><div class="data-note">${ic('shield-check')}<span><b>No protected health information is shown on this surface.</b> Patient accounts are pseudonymized; clinical images, model predictions, and diagnoses are never exposed to administrators. All actions here are recorded to the append-only audit log.</span></div></div>`;

/* ════════════════════════════════════════════════════════════════════════
   BODY ASSEMBLY
   ════════════════════════════════════════════════════════════════════════ */
function dashboardBody(variant) {
  const userMode  = variant === 'empty' ? 'empty' : 'full';
  const apprMode  = variant === 'empty' ? 'empty' : 'full';
  const auditMode = variant === 'error' ? 'error' : variant === 'empty' ? 'empty' : 'full';
  const healthMode= variant === 'error' ? 'error' : 'full';
  return `
  ${controls()}
  ${rsec('layout-dashboard','Subscription overview', { meta:'Production · eu-central' })}
  ${subscriptionOverview()}
  ${rsec('users','User management', { meta:'role · status · consent · last active' })}
  ${userManagement(userMode)}
  ${rsec('check-square','Approval queue', { meta:'training eligibility · flagged cases' })}
  ${approvalQueue(apprMode)}
  ${rsec('scroll-text','Audit log', { meta:'timestamped platform actions' })}
  ${auditLog(auditMode)}
  ${rsec('toggle-right','Feature flags', { adminOnly:true, meta:'AppConfig · per environment' })}
  ${featureFlags()}
  ${rsec('activity','System health', { meta:'services · circuit breakers' })}
  ${systemHealth(healthMode)}
  ${dataNote()}`;
}

/* Focused "Users" page for the drawer / modal frames */
function usersPage(opts = {}) {
  return `
  ${controls()}
  ${rsec('users','User management', { meta:'8,495 accounts · role · status · consent', link:'Manage roles' })}
  ${userManagement('full', opts)}
  ${dataNote()}`;
}

/* ── Loading skeleton ────────────────────────────────────────────────── */
function skelKpis() {
  return `<div class="kpi-row">${[0,1,2,3].map(()=>`<div class="kpi"><div class="k-top"><div class="skel" style="width:30px;height:30px;border-radius:6px"></div><div class="skel skel-line" style="width:50%"></div></div><div class="skel" style="width:60%;height:26px;margin:6px 0 4px"></div><div class="skel skel-line" style="width:80%"></div></div>`).join('')}</div>`;
}
function skelRows(n) {
  return Array.from({length:n}).map(()=>`<div class="skel-row"><div class="skel" style="width:34px;height:34px;border-radius:6px"></div><div style="flex:1"><div class="skel skel-line" style="width:38%"></div><div class="skel skel-line" style="width:22%;margin-top:7px"></div></div><div class="skel skel-line" style="width:80px"></div><div class="skel skel-line" style="width:80px"></div></div>`).join('');
}
function skeletonBody() {
  return `
  ${controls()}
  <div class="r-sec" style="margin-top:0"><div class="skel skel-line" style="width:170px;height:13px"></div><span class="r-rule"></span></div>
  ${skelKpis()}
  <div class="r-sec"><div class="skel skel-line" style="width:160px;height:13px"></div><span class="r-rule"></span></div>
  <div class="panel"><div class="panel-head"><div class="skel skel-line" style="width:130px;height:13px"></div></div>${skelRows(5)}</div>
  <div class="r-sec"><div class="skel skel-line" style="width:150px;height:13px"></div><span class="r-rule"></span></div>
  <div class="grid-2"><div class="panel"><div class="panel-head"><div class="skel skel-line" style="width:120px;height:13px"></div></div>${skelRows(3)}</div><div class="panel"><div class="panel-head"><div class="skel skel-line" style="width:120px;height:13px"></div></div>${skelRows(3)}</div></div>
  <div style="display:flex;align-items:center;gap:10px;justify-content:center;color:var(--text-muted);font-size:12.5px;margin-top:var(--sp-xl)">
    <span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Loading platform overview…
  </div>`;
}

/* ── Side drawer ─────────────────────────────────────────────────────── */
function drawer(kind) {
  const u = kind === 'suspended'
    ? USERS.find(x=>x.id==='PT-9X4C07')
    : USERS.find(x=>x.id==='PT-3D8B11');
  let notice, footActions;
  if (kind === 'suspended') {
    notice = `<div class="notice red">${ic('ban')}<div><div class="n-t">Account suspended</div><div class="n-d">Suspended on <b>6 Jun 2026, 08:22 UTC</b> by <b>AD-0007</b>. The account is signed out and blocked from signing in. <b>Lesion history and images are retained, not deleted.</b> This is reversible.</div></div></div>`;
    footActions = `<button class="btn btn-primary" style="flex:1.2">${ic('rotate-ccw')}Reactivate account</button><button class="btn btn-danger">${ic('trash-2')}Delete…</button>`;
  } else {
    notice = `<div class="notice neutral">${ic('shield-off')}<div><div class="n-t">Consent withdrawn</div><div class="n-d">The patient withdrew research consent on <b>31 May 2026</b>. Their data is excluded from training and aggregate analytics. Records are held only for the <b>legally-required 30-day window</b>, then queued for deletion. No action is required from you.</div></div></div>`;
    footActions = `<button class="btn btn-secondary" style="flex:1.2">${ic('file-text')}View consent record</button><button class="btn btn-danger">${ic('ban')}Suspend…</button>`;
  }
  const consentRow = kind === 'suspended'
    ? consentLine('granted')
    : consentLine('withdrawn');
  return `
  <div class="drawer-scrim"></div>
  <aside class="drawer">
    <div class="drawer-head">
      <div class="dh-av ${ROLE.patient.av}" style="background:var(--neutral-bg);color:var(--neutral)">${ic('user')}</div>
      <div class="dh-main"><div class="dh-name">Patient account</div><div class="dh-id">${u.id} · pseudonymized</div></div>
      <button class="dh-close" aria-label="Close">${ic('x')}</button>
    </div>
    <div class="drawer-body">
      ${notice}
      <div class="dsec">
        <p class="dsec-lab">Account</p>
        <div class="drow"><span class="dl">Role</span><span class="dv">${roleChip(u.role)}</span></div>
        <div class="drow"><span class="dl">Status</span><span class="dv">${statusLine(u.status)}</span></div>
        <div class="drow"><span class="dl">Research consent</span><span class="dv">${consentRow}</span></div>
        <div class="drow"><span class="dl">Account ID</span><span class="dv mono">${u.id}</span></div>
        <div class="drow"><span class="dl">Region</span><span class="dv mono">eu-central</span></div>
        <div class="drow"><span class="dl">Last active</span><span class="dv">${u.last} · ${u.utc}</span></div>
        <div class="drow"><span class="dl">Member since</span><span class="dv">14 Mar 2025</span></div>
      </div>
      <div class="dsec">
        <p class="dsec-lab">Lesion history (count only)</p>
        <div class="drow"><span class="dl">Tracked lesions</span><span class="dv mono">4</span></div>
        <div class="drow"><span class="dl">Captures on file</span><span class="dv mono">11</span></div>
        <div class="drow"><span class="dl">Open review requests</span><span class="dv mono">0</span></div>
        <div class="priv-pill" style="margin-top:12px">${ic('eye-off')}Images, predictions, and diagnoses are never shown to administrators.</div>
      </div>
      <div class="dsec">
        <p class="dsec-lab">Recent account actions</p>
        ${(kind==='suspended'
          ? [['08:22 · 6 Jun','User suspended','red','ban'],['09:40 · 25 May','Sign-in from new device','neutral','log-in'],['14:02 · 22 May','Review requested','blue','stethoscope']]
          : [['08:40 · 6 Jun','Consent withdrawn','neutral','shield-off'],['11:15 · 31 May','Data export downloaded','neutral','download'],['09:22 · 28 May','Sign-in','neutral','log-in']]
        ).map(([t,l,tone,icon])=>`<div class="drow"><span class="dl">${ic(icon)} ${l}</span><span class="dv mono" style="color:var(--text-muted)">${t}</span></div>`).join('')}
      </div>
    </div>
    <div class="drawer-foot">${footActions}</div>
  </aside>`;
}

/* ── Suspend confirmation modal ──────────────────────────────────────── */
function suspendModal() {
  return `
  <div class="modal-scrim">
    <div class="modal">
      <div class="modal-head">
        <div class="mh-ic">${ic('ban')}</div>
        <div><div class="mh-t">Suspend this account?</div><div class="mh-s">You're about to suspend patient account <b style="font-family:var(--font-mono);color:var(--text-primary);font-weight:500">PT-9X4C07</b>. Review what happens before confirming.</div></div>
      </div>
      <div class="modal-body">
        <div class="consequences">
          <div class="cq-h">What this does</div>
          <ul>
            <li class="neg">${ic('log-out')}<span>The account is <b>signed out immediately</b> and blocked from signing in again.</span></li>
            <li class="neg">${ic('pause')}<span>Any in-progress analysis stops; <b>queued professional reviews are paused</b>.</span></li>
            <li class="keep">${ic('archive')}<span>Lesion history and uploaded images are <b>retained, not deleted</b>.</span></li>
            <li class="keep">${ic('shield-check')}<span>Existing consent records and the <b>audit trail are preserved</b>.</span></li>
          </ul>
        </div>
        <div class="notice neutral" style="margin-top:var(--sp-md)">${ic('info')}<div><div class="n-d" style="margin:0"><b>This is reversible.</b> Reactivating restores access. The action is logged to the audit trail as <b style="font-family:var(--font-mono)">user_suspended</b> with your administrator ID.</div></div></div>
        <div class="confirm-input">
          <label>Type the account ID <b>PT-9X4C07</b> to confirm</label>
          <input placeholder="PT-9X4C07" aria-label="Type account ID to confirm" />
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-secondary">${ic('x')}Cancel</button>
        <button class="btn btn-danger-solid">${ic('ban')}Suspend account</button>
      </div>
    </div>
  </div>`;
}

/* ── Desktop app shell ───────────────────────────────────────────────── */
const NAV = [
  { id:'overview', label:'Overview',      icon:'layout-dashboard' },
  { id:'users',    label:'Users',         icon:'users' },
  { id:'approvals',label:'Approvals',     icon:'check-square' },
  { id:'audit',    label:'Audit log',     icon:'scroll-text' },
  { id:'flags',    label:'Feature flags', icon:'toggle-right' },
  { id:'health',   label:'System health', icon:'activity' },
];
function desktopApp(bodyHtml, { title='Platform overview', navActive='overview', overlay='', notif=0, env='Production', envState='green', user={ initials:'AS', name:'A. Salomon', role:'Administrator · full control' } } = {}) {
  const nav = NAV.map(n=>`<button class="nav-item ${n.id===navActive?'active':''}">${ic(n.icon)}${n.label}</button>`).join('');
  const ledColor = envState==='amber'?'var(--amber)':envState==='red'?'var(--red)':envState==='neutral'?'var(--neutral)':'var(--green)';
  return `
  <div class="app">
    <aside class="sidebar">
      <div class="brand"><div class="mark"><div class="reticle"></div></div><div class="wm">Skin Lesion <b>XAI</b></div></div>
      <div class="nav-label">Administration</div>
      ${nav}
      <div class="nav-label">Operations</div>
      <button class="nav-item">${ic('settings')}Configuration</button>
      <button class="nav-item">${ic('shield')}Access &amp; roles</button>
      <div class="sidebar-foot"><div class="sidebar-user"><div class="avatar">${user.initials}</div><div><div class="nm">${user.name}</div><div class="rl">${user.role}</div></div></div></div>
    </aside>
    <div class="main">
      <header class="topbar">
        <h1>${title}</h1>
        <div class="topbar-right">
          <div class="tb-search">${ic('search')}<input placeholder="Search accounts, cases, flags…" /><span class="kbd">⌘K</span></div>
          <div class="tb-meta"><span class="env-pill"><span class="led" style="background:${ledColor}"></span>${env}</span></div>
          <button class="icon-btn" aria-label="Notifications">${ic('bell')}${notif>0?'<span class="dot"></span>':''}</button>
          <button class="icon-btn" aria-label="Help">${ic('life-buoy')}</button>
        </div>
      </header>
      <main class="content"><div class="content-inner">${bodyHtml}</div></main>
      ${overlay}
    </div>
  </div>`;
}

/* ── Frame helper ────────────────────────────────────────────────────── */
function frame(no, title, desc, deviceHtml) {
  return `
  <div class="frame">
    <div class="frame-label"><span class="fl-no">${no}</span><span class="fl-title">${title}</span><span class="fl-desc">${desc}</span></div>
    <div class="device-desktop"><div class="device-bar"><span class="tl"></span><span class="tl"></span><span class="tl"></span><span class="url">${ic('lock')}admin.skinlesionxai.health/overview</span></div><div class="device-viewport">${deviceHtml}</div></div>
  </div>`;
}

/* ── Masthead + assembly ─────────────────────────────────────────────── */
const legendChip = (tone, icon, label) => `<span class="statline ${tone}">${ic(icon)}${label}</span>`;
const masthead = `
<div class="sc-masthead">
  <div>
    <div class="mh-brand">
      <div class="mh-mark"><div class="mh-reticle"></div></div>
      <div><p class="eyebrow">Skin Lesion XAI · Clinical Premium</p><h1>Administrator dashboard</h1></div>
    </div>
    <p class="mh-sub">A full-control internal platform surface for administrators: subscription overview, user management, the approval queue, the append-only audit log, per-environment feature flags, and system health with circuit breakers. No raw PHI — patient accounts are pseudonymized and clinical content is never exposed. Every required state is shown below as a labeled frame.</p>
  </div>
  <div class="mh-legend">
    <span class="lg-title">Status — color + icon + text</span>
    <span class="lg-row">${legendChip('green','check-circle','Active / operational')}</span>
    <span class="lg-row">${legendChip('amber','alert-triangle','Degraded / locked')}</span>
    <span class="lg-row">${legendChip('red','ban','Suspended / outage')}</span>
    <span class="lg-row">${legendChip('neutral','shield-off','Consent withdrawn / pending')}</span>
  </div>
</div>`;

const section = `
<div class="sc-section-head"><span class="ix">A</span><h2>Desktop — administrator / platform-ops dashboard</h2><span class="rule"></span><span class="sh-meta">1440px · dense tables · side drawers</span></div>
${frame('01','Loading skeleton','Shell, controls, and section scaffold render immediately; KPI and table rows pulse while platform data loads.', desktopApp(skeletonBody(), { env:'Production', envState:'green' }))}
${frame('02','Data populated','The full administrator overview: subscription metrics, user management, approval queue, audit log, per-environment feature flags, and system health with circuit breakers.', desktopApp(dashboardBody('healthy'), { env:'Production', envState:'green', notif:1 }))}
${frame('03','Empty tables','Helpful empty states under active filters — no matching accounts, an all-clear approval queue, and an audit log with no entries for the chosen filter. Nothing fabricated.', desktopApp(dashboardBody('empty'), { env:'Production', envState:'green' }))}
${frame('04','Error with retry','A partial outage: the audit and system-health views fail to load. Each shows a plain-language error and a retry path; the rest of the dashboard keeps working.', desktopApp(dashboardBody('error'), { env:'Production', envState:'amber', notif:1 }))}
${frame('05','Destructive action — suspend confirmation','Suspending an account is gated by a confirmation modal that states every consequence, separates what is removed from what is retained, and requires typing the account ID.', desktopApp(usersPage({ selectedId:'PT-9X4C07' }), { title:'User management', navActive:'users', env:'Production', envState:'green', overlay: suspendModal() }))}
${frame('06','User suspended — detail drawer','A suspended patient account opened in the side drawer: red status notice, retained-vs-blocked explained, and a reactivate path. Row highlighted in the table behind.', desktopApp(usersPage({ selectedId:'PT-9X4C07' }), { title:'User management', navActive:'users', env:'Production', envState:'green', overlay: drawer('suspended') }))}
${frame('07','Consent withdrawn — detail drawer','A patient who withdrew research consent: neutral, non-alarmist messaging, the legally-required retention window stated plainly, and data excluded from training and analytics.', desktopApp(usersPage({ selectedId:'PT-3D8B11' }), { title:'User management', navActive:'users', env:'Production', envState:'green', overlay: drawer('consent') }))}
`;

document.getElementById('sc-wrap').innerHTML = masthead + section;
lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
