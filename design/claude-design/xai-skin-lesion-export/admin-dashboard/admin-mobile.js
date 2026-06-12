/* ============================================================================
   Administrator dashboard — MOBILE renderer.
   Loaded AFTER admin.js, so it reuses its data + helpers (ic, statusLine,
   consentLine, roleChip, ROLE, USERS, TRAINING, FLAGGED, AUDIT, FLAGS,
   SERVICES, SVC_STATUS, BREAKERS, BREAKER_STATE) from the shared script scope.
   Dense tables → card-lists; side drawer → bottom sheet. Same privacy stance.
   ============================================================================ */

/* ── Phone shell pieces ──────────────────────────────────────────────── */
function mStatus() {
  return `<div class="m-status"><span>9:18</span><span class="ms-r">${ic('signal')}${ic('wifi')}${ic('battery-full')}</span></div>`;
}
function mAppbar(title, { eyebrow='Admin · full control', back=false, notif=0, env='Prod', envState='green' } = {}) {
  const led = envState==='amber'?'var(--amber)':envState==='red'?'var(--red)':envState==='neutral'?'var(--neutral)':'var(--green)';
  return `<div class="m-appbar">
    <button class="m-iconbtn" aria-label="${back?'Back':'Menu'}">${ic(back?'chevron-left':'menu')}</button>
    <div class="m-title"><div class="mt-eyebrow">${eyebrow}</div><div class="mt-h">${title}</div></div>
    <span class="env-pill"><span class="led" style="background:${led}"></span>${env}</span>
    <button class="m-iconbtn" aria-label="Notifications">${ic('bell')}${notif>0?'<span class="dot"></span>':''}</button>
  </div>`;
}
const M_TABS = [
  { id:'overview',  label:'Overview',  icon:'layout-dashboard' },
  { id:'users',     label:'Users',     icon:'users' },
  { id:'approvals', label:'Approvals', icon:'check-square', badge:'17' },
  { id:'audit',     label:'Audit',     icon:'scroll-text' },
  { id:'more',      label:'More',      icon:'menu' },
];
function mTabbar(active) {
  return `<nav class="m-tabbar">${M_TABS.map(t=>`<button class="m-tab ${t.id===active?'on':''}">${ic(t.icon)}<span class="tl">${t.label}</span>${t.badge&&t.id!==active?`<span class="badge">${t.badge}</span>`:''}</button>`).join('')}</nav>`;
}
function phone(bodyHtml, { title='Overview', eyebrow='Admin · full control', active='overview', overlay='', notif=0, env='Prod', envState='green', back=false } = {}) {
  return `<div class="device-phone"><div class="m-notch"></div><div class="phone-viewport">
    ${mStatus()}
    ${mAppbar(title, { eyebrow, notif, env, envState, back })}
    <div class="m-body">${bodyHtml}</div>
    ${mTabbar(active)}
    ${overlay}
  </div></div>`;
}
function mframe(no, title, desc, phoneHtml) {
  return `<div class="frame">
    <div class="frame-label"><span class="fl-no">${no}</span><span class="fl-title">${title}</span><span class="fl-desc">${desc}</span></div>
    ${phoneHtml}
  </div>`;
}
const mSec = (icon, title, { adminOnly=false, more='' } = {}) =>
  `<div class="m-sec"><h3>${ic(icon)}${title}${adminOnly?`<span class="admin-only">${ic('lock')}Admin</span>`:''}</h3><span class="rule"></span>${more?`<span class="more">${more}</span>`:''}</div>`;

/* ── Overview body (KPIs + seat + health snapshot) ───────────────────── */
function mScope() {
  return `<div class="m-scope">${ic('layers')}<span class="ms-t">Production · eu-central</span><span class="ms-sub">09:18 UTC</span></div>`;
}
function mOverviewBody() {
  const kpis = [
    { icon:'users', name:'Active patients', val:'8,412', u:'', dir:'up', delta:'+184' },
    { icon:'stethoscope', name:'Active doctors', val:'37', u:'', dir:'up', delta:'+2' },
    { icon:'clock', name:'Pending reviews', val:'126', u:'', dir:'flat', delta:'+19' },
    { icon:'flask-conical', name:'Research + admin', val:'9', u:'', dir:'flat', delta:'0' },
  ];
  const health = [
    ['API gateway','green','check-circle','Operational'],
    ['Model inference','green','check-circle','Operational'],
    ['Grad-CAM service','amber','alert-triangle','Degraded'],
    ['Lab OCR breaker','red','alert-octagon','Open · blocked'],
  ];
  return `
  ${mScope()}
  ${mSec('layout-dashboard','Subscription')}
  <div class="m-kpis">${kpis.map(k=>`
    <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic(k.icon)}</span><span class="mk-name">${k.name}</span></div>
    <div class="mk-val">${k.val}</div>
    <div class="mk-foot"><span class="delta ${k.dir}">${ic(k.dir==='up'?'arrow-up':k.dir==='down'?'arrow-down':'minus')}${k.delta}</span></div></div>`).join('')}</div>
  <div class="m-seat">
    <div class="msr"><span class="ms-plan">Institutional · 50 seats</span><span class="ms-renew">Renews 1 Jan 2027</span></div>
    <div class="ss-track"><div class="seg-used" style="width:74%"></div><div class="seg-pend" style="width:8%"></div></div>
    <div class="ms-legend"><span><span class="dot" style="background:var(--accent)"></span>37 active</span><span><span class="dot" style="background:var(--blue-border)"></span>4 invited</span><span><span class="dot" style="background:var(--surface-sunken);border:1px solid var(--border-strong)"></span>9 open</span></div>
  </div>
  ${mSec('check-square','Approval queue', { more:'View all' })}
  <div class="m-card"><div class="m-list">
    <div class="m-qitem"><div class="q-ic blue">${ic('graduation-cap')}</div><div class="q-body"><div class="q-head"><span class="q-id">12 cases</span></div><div class="q-desc">Awaiting training-eligibility sign-off</div></div><span class="mu-chev" style="align-self:center;color:var(--text-muted)">${ic('chevron-right')}</span></div>
    <div class="m-qitem"><div class="q-ic amber">${ic('flag')}</div><div class="q-body"><div class="q-head"><span class="q-id">5 flagged</span><span class="statline amber">${ic('alert-triangle')}Needs review</span></div><div class="q-desc">Image quality, consent &amp; duplicate flags</div></div><span class="mu-chev" style="align-self:center;color:var(--text-muted)">${ic('chevron-right')}</span></div>
  </div></div>
  ${mSec('activity','System health', { more:'Details' })}
  <div class="m-card"><div class="m-list">${health.map(([n,tone,icon,label])=>`
    <div class="m-svc"><div class="sv-ic">${ic('box')}</div><div class="sv-body"><div class="sv-name">${n}</div></div><span class="statline ${tone}">${ic(icon)}${label}</span></div>`).join('')}</div></div>
  ${dataNote()}`;
}

/* ── Users body (card-list) ──────────────────────────────────────────── */
function mUserCard(u) {
  return `<div class="m-user ${u.status==='suspended'?'suspended':''}">
    <div class="mu-top">
      <div class="av ${ROLE[u.role].av}">${u.role==='patient'?ic('user'):u.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
      <div class="mu-id"><div class="mu-name">${u.name}</div><div class="mu-sub">${u.id}</div></div>
      <span class="mu-chev">${ic('chevron-right')}</span>
    </div>
    <div class="mu-grid">
      <div class="mu-field"><span class="mf-l">Role</span><span class="mf-v">${roleChip(u.role)}</span></div>
      <div class="mu-field"><span class="mf-l">Status</span><span class="mf-v">${statusLine(u.status)}</span></div>
      <div class="mu-field"><span class="mf-l">Consent</span><span class="mf-v">${consentLine(u.consent)}</span></div>
      <div class="mu-field"><span class="mf-l">Last active</span><span class="mf-v">${u.last}</span></div>
    </div>
  </div>`;
}
function mUsersBody(mode='full') {
  const filters = `<div class="m-filterbar">
    <div class="m-search">${ic('search')}<input placeholder="Search account ID or role" ${mode==='empty'?'value="PT-22"':''} /></div>
    <div class="m-chips">
      <span class="m-fchip ${mode==='empty'?'on':''}">${ic('users')}Role: ${mode==='empty'?'Patient':'All'}</span>
      <span class="m-fchip">${ic('activity')}Status: All</span>
      <span class="m-fchip">${ic('shield-check')}Consent: All</span>
      <span class="m-fchip">${ic('arrow-up-down')}Sort</span>
    </div>
  </div>`;
  if (mode === 'empty') {
    return `${filters}
    <div class="m-card"><div class="state-box"><div class="sb-ic accent">${ic('search-x')}</div>
      <h4>No accounts match</h4><p>No patient accounts contain "PT-22". Try a different ID or clear the role filter.</p>
      <div class="sb-act"><button class="btn btn-secondary">${ic('x')}Clear filters</button></div></div></div>`;
  }
  return `${filters}
  ${mSec('users','8,495 accounts', { more:'Invite' })}
  <div class="m-card"><div class="m-list">${USERS.map(mUserCard).join('')}</div>
    <div class="m-listfoot"><span>8 of 8,495 · pseudonymized IDs</span><span class="lf-link">Load more${ic('chevron-down')}</span></div>
  </div>
  ${dataNote()}`;
}

/* ── Approvals body ──────────────────────────────────────────────────── */
function mApprovalsBody() {
  const tItem = (t)=>`<div class="m-qitem"><div class="q-ic blue">${ic('graduation-cap')}</div><div class="q-body">
    <div class="q-head"><span class="q-id">${t.id}</span><span class="tag">${t.tag}</span></div>
    <div class="q-meta">waiting ${t.age} · verified by ${t.by}</div>
    <div class="q-actions"><button class="mini-btn green">${ic('check')}Approve</button><button class="mini-btn ghost">${ic('clock')}Hold</button></div>
  </div></div>`;
  const fItem = (f)=>`<div class="m-qitem"><div class="q-ic amber">${ic(f.icon)}</div><div class="q-body">
    <div class="q-head"><span class="q-id">${f.id}</span></div>
    <div class="q-desc"><span class="statline ${f.tone}">${ic(f.tone==='red'?'alert-octagon':f.tone==='amber'?'alert-triangle':'info')}${f.flag}</span></div>
    <div class="q-meta">flagged ${f.age}</div>
    <div class="q-actions"><button class="mini-btn">${ic('eye')}Review</button><button class="mini-btn ghost">${ic('x')}Dismiss</button></div>
  </div></div>`;
  return `
  ${mSec('graduation-cap','Training eligibility · 12')}
  <div class="m-card"><div class="m-list">${TRAINING.map(tItem).join('')}</div>
    <div class="m-listfoot"><span>3 of 12 · case IDs only, no diagnoses</span><span class="lf-link">View all${ic('chevron-right')}</span></div></div>
  ${mSec('flag','Flagged cases · 5')}
  <div class="m-card"><div class="m-list">${FLAGGED.map(fItem).join('')}</div>
    <div class="m-listfoot"><span>3 of 5 · operational flags</span><span class="lf-link">View all${ic('chevron-right')}</span></div></div>
  ${dataNote()}`;
}

/* ── Audit + Flags body ──────────────────────────────────────────────── */
function mAuditRow(a) {
  const [tone, aicon, label] = a.action;
  const actor = a.actor.system ? 'System' : `${ROLE[a.actor.role].label} · ${a.actor.id}`;
  const actorChip = a.actor.system ? `<span class="rolechip">${ic('cpu')}System</span>` : roleChip(a.actor.role);
  return `<div class="m-audit">
    <div class="ma-ic ${tone}">${ic(aicon)}</div>
    <div class="ma-body">
      <div class="ma-l1"><span class="ma-action">${label}</span><span class="ma-time">${a.t}</span></div>
      <div class="ma-target">${a.target} · ${a.env}</div>
      <div class="ma-actor">${actorChip}<span class="ma-time">${a.actor.system?'automated':a.actor.id}</span></div>
    </div>
  </div>`;
}
function mFlag(f) {
  const env = (on, lab, cls='')=>`<div class="mfl-env ${cls}"><span class="ev-l">${lab}</span><span class="envtog ${on?'on':'off'}"><span class="sw"></span></span></div>`;
  return `<div class="m-flag">
    <div class="mfl-key">${f.key}</div>
    <div class="mfl-desc">${f.desc}</div>
    <div class="mfl-envs">${env(f.dev,'Dev')}${env(f.staging,'Staging')}${env(f.prod,'Prod','prod')}</div>
    <div class="mfl-changed">Last changed ${f.changed}</div>
  </div>`;
}
function mAuditBody(mode='full') {
  const filters = `<div class="m-filterbar">
    <div class="m-search">${ic('search')}<input placeholder="Search actor ID or target" ${mode==='empty'?'value="PT-0000"':''} /></div>
    <div class="m-chips">
      <span class="m-fchip ${mode==='empty'?'on':''}">${ic('zap')}${mode==='empty'?'Consent':'All actions'}</span>
      <span class="m-fchip">${ic('users')}All roles</span>
      <span class="m-fchip">${ic('layers')}All envs</span>
      <span class="m-fchip">${ic('calendar')}Today</span>
    </div>
  </div>`;
  if (mode === 'empty') {
    return `${filters}
    <div class="m-card"><div class="state-box"><div class="sb-ic accent">${ic('scroll-text')}</div>
      <h4>No entries for this filter</h4><p>No consent actions by "PT-0000" today. Widen the date range or clear the action filter.</p>
      <div class="sb-act"><button class="btn btn-secondary">${ic('x')}Clear filters</button></div></div></div>`;
  }
  return `${filters}
  ${mSec('scroll-text','Audit log · today')}
  <div class="m-card"><div class="m-list">${AUDIT.slice(0,6).map(mAuditRow).join('')}</div>
    <div class="m-listfoot"><span>6 of 1,240 · append-only</span><span class="lf-link">View all${ic('chevron-right')}</span></div></div>
  ${mSec('toggle-right','Feature flags', { adminOnly:true })}
  <div class="m-card"><div class="m-list">${FLAGS.slice(0,3).map(mFlag).join('')}</div>
    <div class="flags-foot">${ic('alert-triangle')}<span>Changing a <b>Prod</b> flag affects all users at once and is audited.</span></div></div>`;
}

/* ── System health body ──────────────────────────────────────────────── */
function mHealthBody(mode='full') {
  if (mode === 'error') {
    return `${mScope()}
    <div class="m-card"><div class="state-box"><div class="sb-ic red">${ic('server-off')}</div>
      <h4>Health data unavailable</h4><p>The monitoring service can't be reached. This affects only this view — platform services keep running.</p>
      <div class="sb-act" style="flex-direction:column;width:100%"><button class="btn btn-primary" style="width:100%;justify-content:center">${ic('refresh-cw')}Retry now</button><button class="btn btn-secondary" style="width:100%;justify-content:center">${ic('external-link')}Status page</button></div>
      <span class="t-time" style="margin-top:8px">Last check 09:11 UTC · 7 min ago</span></div></div>`;
  }
  const svc = (s)=>{ const [tone,icon,label]=SVC_STATUS[s.status]; return `<div class="m-svc"><div class="sv-ic">${ic(s.icon)}</div><div class="sv-body"><div class="sv-name">${s.name}</div><div class="sv-metric">${s.m[0][0]} ${s.m[0][1]}</div></div><span class="statline ${tone}">${ic(icon)}${label}</span></div>`; };
  const brk = (b)=>{ const [tone,icon,label]=BREAKER_STATE[b.state]; const led=tone==='green'?'var(--green)':tone==='amber'?'var(--amber)':'var(--red)'; return `<div class="m-breaker"><div class="mb-top"><span class="mb-led" style="background:${led}"></span><span class="mb-name">${b.name}</span></div><div class="mb-row2"><span class="statline ${tone}">${ic(icon)}${label}</span>${b.act?`<button class="mini-btn danger">${ic('rotate-ccw')}Reset</button>`:`<span class="mb-meta">${b.meta}</span>`}</div></div>`; };
  return `${mScope()}
  ${mSec('activity','Services')}
  <div class="m-card"><div class="m-list">${SERVICES.map(svc).join('')}</div></div>
  ${mSec('git-fork','Circuit breakers')}
  <div class="m-card"><div class="m-list">${BREAKERS.map(brk).join('')}</div></div>`;
}

/* ── Loading skeleton body ───────────────────────────────────────────── */
function mSkeletonBody() {
  const card = (h)=>`<div class="m-skelcard"><div class="skel skel-line" style="width:40%"></div><div class="skel" style="width:60%;height:22px;margin:10px 0 6px"></div><div class="skel skel-line" style="width:70%"></div></div>`;
  const row = ()=>`<div class="skel-row"><div class="skel" style="width:36px;height:36px;border-radius:8px"></div><div style="flex:1"><div class="skel skel-line" style="width:50%"></div><div class="skel skel-line" style="width:30%;margin-top:7px"></div></div></div>`;
  return `
  <div class="m-scope"><div class="skel skel-line" style="width:60%;height:12px"></div></div>
  <div class="m-sec" style="margin-bottom:0"><div class="skel skel-line" style="width:90px;height:11px"></div></div>
  <div class="m-kpis">${card()}${card()}${card()}${card()}</div>
  <div class="m-sec" style="margin-bottom:0"><div class="skel skel-line" style="width:110px;height:11px"></div></div>
  <div class="m-card">${row()}${row()}${row()}</div>
  <div style="display:flex;align-items:center;gap:9px;justify-content:center;color:var(--text-muted);font-size:12px;margin-top:8px"><span class="spinner" style="width:16px;height:16px;border-width:2px"></span>Loading overview…</div>`;
}

/* ── Bottom sheet: user detail (suspended / consent) ─────────────────── */
function mSheet(kind) {
  const u = kind === 'suspended' ? USERS.find(x=>x.id==='PT-9X4C07') : USERS.find(x=>x.id==='PT-3D8B11');
  let notice, foot;
  if (kind === 'suspended') {
    notice = `<div class="notice red">${ic('ban')}<div><div class="n-t">Account suspended</div><div class="n-d">Suspended <b>6 Jun, 08:22 UTC</b> by <b>AD-0007</b>. Signed out and blocked from sign-in. <b>Lesion history retained, not deleted.</b> Reversible.</div></div></div>`;
    foot = `<button class="btn btn-primary" style="flex:1.3">${ic('rotate-ccw')}Reactivate</button><button class="btn btn-danger">${ic('trash-2')}Delete…</button>`;
  } else {
    notice = `<div class="notice neutral">${ic('shield-off')}<div><div class="n-t">Consent withdrawn</div><div class="n-d">Withdrew research consent <b>31 May 2026</b>. Excluded from training and analytics. Held for the <b>30-day legal window</b>, then deleted. No action needed.</div></div></div>`;
    foot = `<button class="btn btn-secondary" style="flex:1.3">${ic('file-text')}Consent record</button><button class="btn btn-danger">${ic('ban')}Suspend…</button>`;
  }
  return `<div class="m-scrim"></div>
  <div class="m-sheet"><div class="sh-grab"></div>
    <div class="sh-head"><div class="sh-av">${ic('user')}</div><div class="sh-main"><div class="sh-name">Patient account</div><div class="sh-id">${u.id} · pseudonymized</div></div><button class="sh-close">${ic('x')}</button></div>
    <div class="sh-body">
      ${notice}
      <div><p class="m-dsec-lab">Account</p>
        <div class="m-drow"><span class="dl">Role</span><span class="dv">${roleChip(u.role)}</span></div>
        <div class="m-drow"><span class="dl">Status</span><span class="dv">${statusLine(u.status)}</span></div>
        <div class="m-drow"><span class="dl">Research consent</span><span class="dv">${consentLine(u.consent)}</span></div>
        <div class="m-drow"><span class="dl">Region</span><span class="dv">eu-central</span></div>
        <div class="m-drow"><span class="dl">Last active</span><span class="dv">${u.last}</span></div>
      </div>
      <div><p class="m-dsec-lab">Lesion history (count only)</p>
        <div class="m-drow"><span class="dl">Tracked lesions</span><span class="dv">4</span></div>
        <div class="m-drow"><span class="dl">Captures on file</span><span class="dv">11</span></div>
        <div class="priv-pill" style="margin-top:11px">${ic('eye-off')}Images, predictions &amp; diagnoses are never shown.</div>
      </div>
    </div>
    <div class="sh-foot">${foot}</div>
  </div>`;
}

/* ── Confirm modal (suspend) ─────────────────────────────────────────── */
function mSuspendModal() {
  return `<div class="m-scrim"></div>
  <div class="m-modal">
    <div class="mm-head"><div class="mm-ic">${ic('ban')}</div><div class="mm-t">Suspend this account?</div><div class="mm-s">Suspending patient account <b>PT-9X4C07</b>. Review what happens first.</div></div>
    <div class="mm-body">
      <div class="consequences"><div class="cq-h">What this does</div><ul>
        <li class="neg">${ic('log-out')}<span><b>Signed out immediately</b> and blocked from sign-in.</span></li>
        <li class="neg">${ic('pause')}<span>Queued <b>reviews are paused</b>.</span></li>
        <li class="keep">${ic('archive')}<span>Lesion history &amp; images <b>retained</b>.</span></li>
        <li class="keep">${ic('shield-check')}<span>Consent &amp; <b>audit trail preserved</b>.</span></li>
      </ul></div>
      <div class="notice neutral" style="margin-top:12px">${ic('info')}<div><div class="n-d" style="margin:0"><b>Reversible.</b> Logged as <b style="font-family:var(--font-mono)">user_suspended</b> with your admin ID.</div></div></div>
      <div class="confirm-input"><label>Type <b>PT-9X4C07</b> to confirm</label><input placeholder="PT-9X4C07" /></div>
    </div>
    <div class="mm-foot"><button class="btn btn-danger-solid">${ic('ban')}Suspend account</button><button class="btn btn-secondary">${ic('x')}Cancel</button></div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════════════════
   ASSEMBLE MOBILE SECTION
   ════════════════════════════════════════════════════════════════════════ */
const mobileSection = `
<div class="sc-section-head" style="margin-top:var(--sp-3xl)"><span class="ix">B</span><h2>Mobile — administrator on the go</h2><span class="rule"></span><span class="sh-meta">375px · bottom tabs · card-lists · bottom sheets</span></div>
<div class="frame-grid">
  ${mframe('M01','Loading skeleton','Shell and tab bar paint instantly; cards pulse while data loads.', phone(mSkeletonBody(), { title:'Overview', active:'overview' }))}
  ${mframe('M02','Overview','Subscription KPIs, plan seats, an approval-queue snapshot and a system-health summary — all stacked for one thumb.', phone(mOverviewBody(), { title:'Overview', active:'overview', notif:1 }))}
  ${mframe('M03','User management','Dense desktop rows become tappable cards: role, status, consent and last-active on every card. Search + filter chips above.', phone(mUsersBody('full'), { title:'Users', active:'users', back:true }))}
  ${mframe('M04','Approval queue','Training-eligibility approvals and flagged cases with full-width action buttons sized for touch.', phone(mApprovalsBody(), { title:'Approvals', active:'approvals', back:true, notif:1 }))}
  ${mframe('M05','Audit log + feature flags','The append-only log as a timeline; AppConfig flags below with per-environment toggles (admin-only).', phone(mAuditBody('full'), { title:'Audit log', active:'audit', back:true }))}
  ${mframe('M06','System health','Service statuses and circuit-breaker states, each paired with icon + text + color. Open breaker offers a reset.', phone(mHealthBody('full'), { title:'System health', eyebrow:'Operations', active:'more', back:true }))}
  ${mframe('M07','Empty tables','A helpful empty state under an active filter — nothing fabricated, with a one-tap clear.', phone(mUsersBody('empty'), { title:'Users', active:'users', back:true }))}
  ${mframe('M08','Error with retry','The health view fails to load; a plain-language message plus retry and status-page paths. Rest of the app keeps working.', phone(mHealthBody('error'), { title:'System health', eyebrow:'Operations', active:'more', back:true, envState:'amber' }))}
  ${mframe('M09','Suspend — confirm modal','Destructive action gated by a centered modal: consequences split removed-vs-retained, plus type-to-confirm.', phone(mUsersBody('full'), { title:'Users', active:'users', back:true, overlay:mSuspendModal() }))}
  ${mframe('M10','User suspended — detail sheet','The side drawer becomes a bottom sheet: red status notice, retained-vs-blocked explained, reactivate path.', phone(mUsersBody('full'), { title:'Users', active:'users', back:true, overlay:mSheet('suspended') }))}
  ${mframe('M11','Consent withdrawn — detail sheet','Neutral, non-alarmist sheet stating the legally-required retention window and exclusion from training.', phone(mUsersBody('full'), { title:'Users', active:'users', back:true, overlay:mSheet('consent') }))}
</div>`;

document.getElementById('sc-wrap').insertAdjacentHTML('beforeend', mobileSection);
lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
