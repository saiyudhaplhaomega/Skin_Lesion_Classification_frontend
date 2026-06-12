/* ============================================================================
   Cloud operations dashboard — MOBILE renderer.
   Loaded AFTER ops.js, so it reuses its data + helpers from the shared script
   scope: ic, statusLine, ENV_STATUS, ENVS, COST_TOTAL, COST_ROWS, TREND_DAYS,
   TREND_ANOM, TREND_BUDGET, TF_PLAN, trendChart.
   Environment rows → tappable cards; Terraform plan → bottom sheet; the
   Production shutdown confirm → centered modal. Same safety stance.
   ============================================================================ */

/* ── Phone shell ─────────────────────────────────────────────────────── */
function mStatusBar() {
  return `<div class="m-status"><span>9:18</span><span class="ms-r">${ic('signal')}${ic('wifi')}${ic('battery-full')}</span></div>`;
}
function mAppbar(title, { eyebrow='Cloud ops · operator', back=false, notif=0, env='eu-central-1', envState='green' } = {}) {
  const led = envState==='amber'?'var(--amber)':envState==='red'?'var(--red)':'var(--green)';
  return `<div class="m-appbar">
    <button class="m-iconbtn" aria-label="${back?'Back':'Menu'}">${ic(back?'chevron-left':'menu')}</button>
    <div class="m-title"><div class="mt-eyebrow">${eyebrow}</div><div class="mt-h">${title}</div></div>
    <span class="env-pill"><span class="led" style="background:${led}"></span>${env}</span>
    <button class="m-iconbtn" aria-label="Alerts">${ic('bell')}${notif>0?'<span class="dot"></span>':''}</button>
  </div>`;
}
const M_TABS = [
  { id:'overview', label:'Overview', icon:'layout-dashboard' },
  { id:'envs',     label:'Envs',     icon:'server' },
  { id:'cost',     label:'Cost',     icon:'circle-dollar-sign' },
  { id:'infra',    label:'Infra',    icon:'box' },
  { id:'alerts',   label:'Alerts',   icon:'bell-ring', badge:'1' },
];
function mTabbar(active) {
  return `<nav class="m-tabbar">${M_TABS.map(t=>`<button class="m-tab ${t.id===active?'on':''}">${ic(t.icon)}<span class="tl">${t.label}</span>${t.badge&&t.id!==active?`<span class="badge">${t.badge}</span>`:''}</button>`).join('')}</nav>`;
}
function mPhone(bodyHtml, { title='Overview', eyebrow='Cloud ops · operator', active='overview', overlay='', notif=0, env='eu-central-1', envState='green', back=false } = {}) {
  return `<div class="device-phone"><div class="m-notch"></div><div class="phone-viewport">
    ${mStatusBar()}
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
const mSecHead = (icon, title, { opOnly=false, more='' } = {}) =>
  `<div class="m-sec"><h3>${ic(icon)}${title}${opOnly?`<span class="op-only">${ic('terminal')}Operator</span>`:''}</h3><span class="rule"></span>${more?`<span class="more">${more}</span>`:''}</div>`;

/* ── Mobile banner ───────────────────────────────────────────────────── */
function mBanner(kind) {
  if (kind === 'anomaly') {
    return `<div class="m-banner amber">
      <div class="mb-ic">${ic('trending-up')}</div>
      <div class="mb-main">
        <div class="mb-t">Cost anomaly — 38% above baseline</div>
        <div class="mb-d">2 staging GPU workers <b>running 47h with no activity</b>. <b>+$1,210</b> projected this cycle.</div>
        <div class="mb-act"><button class="mini-btn">${ic('pause')}Pause staging</button><button class="mini-btn ghost">${ic('eye')}Investigate</button></div>
      </div>
    </div>`;
  }
  return `<div class="m-banner green">
    <div class="mb-ic">${ic('shield-check')}</div>
    <div class="mb-main">
      <div class="mb-t">No cost anomalies</div>
      <div class="mb-d">Run-rate within <b>4%</b> of the 7-day average. No idle resources flagged.</div>
    </div>
  </div>`;
}

/* ── Mobile summary tiles ────────────────────────────────────────────── */
function mSummary(kind) {
  const projHigh = kind === 'anomaly';
  return `<div class="m-sum">
    <div class="m-sumtile lead"><span class="mst-l">${ic('gauge')}Platform run-rate</span><span class="mst-v"><span class="cur">$</span>${COST_TOTAL}<small> / mo</small></span><span class="mst-foot">${ic('refresh-cw')}live · 3 environments</span></div>
    <div class="m-sumtile"><span class="mst-l">${ic('trending-up')}Projected</span><span class="mst-v"><span class="cur">$</span>${projHigh?'34.8k':'32.6k'}</span><span class="mst-foot"><span class="delta ${projHigh?'down':'up'}">${ic(projHigh?'arrow-up':'arrow-down')}${projHigh?'+6.8%':'-2.1%'}</span>vs budget</span></div>
    <div class="m-sumtile"><span class="mst-l">${ic('piggy-bank')}Idle savings</span><span class="mst-v"><span class="cur">$</span>1,940<small>/mo</small></span><span class="mst-foot">${ic('circle-pause')}staging paused</span></div>
  </div>`;
}

/* ── Mobile environment card ─────────────────────────────────────────── */
function mEnvActions(env) {
  if (env.status === 'running') {
    const sd = env.live ? `${ic('power')}Shutdown…` : `${ic('power')}Shutdown`;
    return `<button class="btn btn-warn">${ic('pause')}Pause</button><button class="btn btn-danger">${sd}</button>`;
  }
  if (env.status === 'paused') return `<button class="btn btn-primary">${ic('play')}Resume</button><button class="btn btn-danger">${ic('power')}Shutdown</button>`;
  return `<button class="btn btn-primary">${ic('play')}Start</button>`;
}
function mEnvCard(env) {
  return `<div class="m-env ${env.id} ${env.status}">
    <div class="me-head">
      <span class="me-tier">${env.tier}</span>
      <span class="me-name">${env.name}${env.live?`<span class="ec-live">${ic('activity')}Live</span>`:''}</span>
      ${statusLine(env.status)}
    </div>
    <div class="me-body">
      <div class="me-cost"><div class="mc-l">Estimated cost</div><div class="mc-v"><span class="cur">$</span>${env.cost}<small> /mo</small></div><div class="mc-sub">${env.costNote}</div></div>
    </div>
    <div class="me-res">
      ${env.res.slice(0,3).map(([i,v,l])=>`<span class="me-chip ${env.stale&&i==='zap'?'stale':''}">${ic(i)}${v}</span>`).join('')}
    </div>
    <div class="me-activity">${ic('history')}Last activity ${env.last} · ${env.lastWho}</div>
    <div class="me-foot">${mEnvActions(env)}</div>
  </div>`;
}
function mEnvList(kind) {
  const dev = ENVS.dev, prod = ENVS.prod;
  let staging = ENVS.staging;
  if (kind === 'anomaly') {
    staging = { ...ENVS.staging, status:'running', cost:'2,180', costNote:'run-rate · 38% over baseline', last:'47h ago', lastWho:'idle since test #318', stale:true,
      res:[['cpu','12 vCPU','4 tasks'],['zap','2 GPU','idle'],['hard-drive','340 GB','retained']] };
  }
  return `<div class="m-card"><div class="m-list">${mEnvCard(dev)}${mEnvCard(staging)}${mEnvCard(prod)}</div></div>`;
}

/* ── Mobile cost breakdown + chart ───────────────────────────────────── */
function mCostBreakdown() {
  return `<div class="m-card">
    <div class="m-costtotal"><div class="mct-v"><span class="cur">$</span>${COST_TOTAL}</div><div class="mct-m">est. monthly run-rate<br>all environments</div></div>
    <div class="m-coststack">${COST_ROWS.map(r=>`<i style="width:${r.pct}%;background:${r.color}"></i>`).join('')}</div>
    <div class="m-costrows">${COST_ROWS.map(r=>`<div class="m-costrow"><span class="mcr-sw" style="background:${r.color}"></span><span class="mcr-name">${ic(r.icon)}${r.name}</span><span class="mcr-amt">$${r.amt}</span><span class="mcr-pct">${r.pct}%</span></div>`).join('')}</div>
    <div class="cost-foot" style="padding:12px 13px;margin:0;border-top:1px solid var(--border)">${ic('info')}Billing estimates, refreshed hourly.</div>
  </div>`;
}
function mChartCard(kind) {
  const anom = kind === 'anomaly';
  return `<div class="m-card m-chartcard">
    <div class="mcc-head"><h4>${ic('line-chart')}Daily spend</h4><span class="sub">30 days</span></div>
    ${trendChart(anom ? TREND_ANOM : TREND_DAYS, { anomalyFrom: anom ? 20 : -1 })}
    <div class="ops-legend"><span><span class="sw" style="background:var(--accent)"></span>Spend</span>${anom?`<span><span class="sw" style="background:var(--amber)"></span>Anomaly</span>`:''}<span><span class="sw budget"></span>Budget</span></div>
  </div>`;
}

/* ── Mobile Terraform strip ──────────────────────────────────────────── */
function mTfStrip() {
  return `<div class="m-card m-tf">
    <div class="mtf-top"><div class="mtf-ic">${ic('box')}</div><div><div class="mtf-t">Pending plan · staging</div><div class="mtf-s">${TF_PLAN.cmd}</div></div></div>
    <div class="mtf-counts">
      <span class="tf-count add">${ic('plus')}${TF_PLAN.add} add</span>
      <span class="tf-count change">${ic('pencil')}${TF_PLAN.change} chg</span>
      <span class="tf-count destroy">${ic('minus')}${TF_PLAN.destroy} del</span>
    </div>
    <button class="btn btn-secondary mtf-btn">${ic('file-diff')}Review plan</button>
  </div>`;
}

const mOpsNote = () => `<div class="m-opsnote">${ic('lock')}<span><b>Operator surface — not patient-facing.</b> No PHI. Terraform diffs show resource addresses only; secrets are never displayed.</span></div>`;

/* ── Mobile bodies ───────────────────────────────────────────────────── */
function mOverviewBody(kind) {
  return `
  ${mBanner(kind === 'anomaly' ? 'anomaly' : 'clear')}
  ${mSummary(kind)}
  ${mSecHead('server','Environments', { more:'All' })}
  ${mEnvList(kind)}
  ${mSecHead('circle-dollar-sign','Cost breakdown')}
  ${mCostBreakdown()}
  ${mSecHead('box','Infrastructure', { opOnly:true })}
  ${mTfStrip()}
  ${mOpsNote()}`;
}
function mCostBody(kind) {
  return `
  ${mBanner(kind === 'anomaly' ? 'anomaly' : 'clear')}
  ${mSummary(kind)}
  ${mSecHead('line-chart','Daily spend trend')}
  ${mChartCard(kind)}
  ${mSecHead('circle-dollar-sign','Breakdown')}
  ${mCostBreakdown()}
  ${mOpsNote()}`;
}
function mErrorBody() {
  return `
  <div class="m-card"><div class="state-box"><div class="sb-ic red">${ic('plug-zap')}</div>
    <h4>Cost data unavailable</h4><p>The billing &amp; metrics provider didn't respond. Environment controls still work — only cost figures failed to load.</p>
    <div class="sb-act" style="flex-direction:column;width:100%"><button class="btn btn-primary" style="width:100%;justify-content:center">${ic('refresh-cw')}Retry now</button><button class="btn btn-secondary" style="width:100%;justify-content:center">${ic('external-link')}Provider status</button></div>
    <span class="t-time" style="margin-top:8px">Last sync 08:46 UTC · 32 min ago</span></div></div>
  ${mSecHead('server','Environments', { more:'All' })}
  ${mEnvList('healthy')}
  ${mOpsNote()}`;
}
function mSkeletonBody() {
  const tile = () => `<div class="m-sumtile"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:60%;height:22px;margin:9px 0 6px"></div><div class="skel skel-line" style="width:70%"></div></div>`;
  const env = () => `<div style="padding:13px;border-bottom:1px solid var(--border)"><div class="skel skel-line" style="width:45%"></div><div class="skel" style="width:40%;height:20px;margin:12px 0 6px"></div><div class="skel skel-line" style="width:75%"></div><div class="skel" style="width:100%;height:34px;margin-top:12px;border-radius:6px"></div></div>`;
  return `
  <div class="m-banner green" style="border-style:dashed"><div class="skel" style="width:28px;height:28px;border-radius:6px"></div><div class="mb-main"><div class="skel skel-line" style="width:60%"></div><div class="skel skel-line" style="width:85%;margin-top:8px"></div></div></div>
  <div class="m-sum"><div class="m-sumtile lead"><div class="skel skel-line" style="width:50%;background:rgba(255,255,255,.15)"></div><div class="skel" style="width:55%;height:22px;margin-top:9px;background:rgba(255,255,255,.15)"></div></div>${tile()}${tile()}</div>
  <div class="m-sec" style="margin-bottom:0"><div class="skel skel-line" style="width:110px;height:11px"></div></div>
  <div class="m-card">${env()}${env()}</div>
  <div style="display:flex;align-items:center;gap:9px;justify-content:center;color:var(--text-muted);font-size:12px;margin-top:6px"><span class="spinner" style="width:16px;height:16px;border-width:2px"></span>Loading status &amp; cost…</div>`;
}

/* ── Mobile Terraform bottom sheet ───────────────────────────────────── */
function mTfSheet() {
  const group = (g) => `<div class="tf-diff-group"><div class="tdg-h">${ic(g.cls==='add'?'plus-circle':g.cls==='change'?'edit-3':'minus-circle')}${g.label} · ${g.items.length}</div>
    ${g.items.map(it => `<div class="tf-line ${g.cls}"><span class="tl-sign">${g.sign}</span><span class="tl-addr">${it.addr}</span></div>`).join('')}</div>`;
  return `<div class="m-scrim"></div>
  <div class="m-sheet"><div class="sh-grab"></div>
    <div class="sh-head"><div class="sh-av" style="background:var(--ink-900);color:#fff">${ic('box')}</div><div class="sh-main"><div class="sh-name">Terraform plan</div><div class="sh-id">staging · dry run</div></div><button class="sh-close">${ic('x')}</button></div>
    <div class="sh-body">
      <div style="display:flex;gap:6px">
        <span class="tf-count add" style="flex:1;justify-content:center">${ic('plus')}${TF_PLAN.add} add</span>
        <span class="tf-count change" style="flex:1;justify-content:center">${ic('pencil')}${TF_PLAN.change} change</span>
        <span class="tf-count destroy" style="flex:1;justify-content:center">${ic('minus')}${TF_PLAN.destroy} destroy</span>
      </div>
      <div class="m-tfdiff">${TF_PLAN.groups.map(group).join('')}</div>
      <div class="m-tfsafe">${ic('shield-check')}<span><b>Resource addresses only.</b> Variable values, connection strings and secrets are redacted and never shown here.</span></div>
    </div>
    <div class="sh-foot"><button class="btn btn-secondary">${ic('x')}Cancel</button><button class="btn btn-primary">${ic('check')}Apply</button></div>
  </div>`;
}

/* ── Mobile production-shutdown confirm modal ────────────────────────── */
function mShutdownModal() {
  return `<div class="m-scrim"></div>
  <div class="m-modal">
    <div class="mm-head"><div class="mm-ic">${ic('power')}</div><div class="mm-t">Shut down Production?</div><div class="mm-s">Production · <b>eu-central-1</b>. Read the impact first.</div></div>
    <div class="mm-body">
      <div class="live-warning">${ic('alert-octagon')}<div><div class="lw-t">This affects live patients</div><div class="lw-d">Production serves <b>real patient traffic now</b>. Shutdown takes the patient app, doctor queue and notifications <b>offline for everyone</b> until restarted.</div></div></div>
      <div class="consequences"><div class="cq-h">What this does</div><ul>
        <li class="neg">${ic('power-off')}<span>All Production compute <b>stops</b> — app &amp; dashboard go offline.</span></li>
        <li class="neg">${ic('inbox')}<span>Queued <b>reviews pause</b>; no new cases accepted.</span></li>
        <li class="keep">${ic('database')}<span>Storage &amp; databases <b>retained</b>. No data lost.</span></li>
        <li class="keep">${ic('rotate-ccw')}<span><b>Reversible</b> — restart restores service in ~6–8 min.</span></li>
      </ul></div>
      <div class="notice amber" style="margin-top:12px">${ic('users')}<div><div class="n-d" style="margin:0"><b>41 active sessions</b> affected. A status-page incident opens automatically; logged with your operator ID.</div></div></div>
      <div class="confirm-input"><label>Type <b>SHUTDOWN PRODUCTION</b> to confirm</label><input placeholder="SHUTDOWN PRODUCTION" /></div>
    </div>
    <div class="mm-foot"><button class="btn btn-danger-solid">${ic('power')}Shut down Production</button><button class="btn btn-secondary">${ic('x')}Cancel</button></div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════════════════
   ASSEMBLE MOBILE SECTION
   ════════════════════════════════════════════════════════════════════════ */
const mobileSection = `
<div class="sc-section-head" style="margin-top:var(--sp-3xl)"><span class="ix">B</span><h2>Mobile — operator on call</h2><span class="rule"></span><span class="sh-meta">375px · bottom tabs · cards · bottom sheets</span></div>
<div class="frame-grid">
  ${mframe('M01','Loading skeleton','Shell and tab bar paint instantly; banner, summary and environment cards pulse while status and cost data load.', mPhone(mSkeletonBody(), { title:'Overview', active:'overview' }))}
  ${mframe('M02','Operations overview','All three environments stacked as cards — Dev running (green), Staging paused (amber, Resume prominent), Production running with a live marker — plus cost summary, breakdown and the pending plan.', mPhone(mOverviewBody('healthy'), { title:'Overview', active:'overview' }))}
  ${mframe('M03','Cost anomaly','The amber alert leads the screen; staging now shows running/idle with a flagged GPU chip, and the spend trend breaks above budget.', mPhone(mCostBody('anomaly'), { title:'Cost control', eyebrow:'Cloud ops · operator', active:'cost', back:true, envState:'amber', notif:1 }))}
  ${mframe('M04','Terraform plan preview','The plan opens as a bottom sheet: add / change / destroy with resource addresses only and a redaction notice. Apply is the explicit next step.', mPhone(mOverviewBody('healthy'), { title:'Infrastructure', active:'infra', back:true, overlay:mTfSheet() }))}
  ${mframe('M05','Production shutdown — confirm','Destructive Production action gated by a centered modal that leads with the live-patients warning, splits stops-vs-retained, shows session impact, and requires the typed phrase.', mPhone(mEnvList('healthy')+mOpsNote(), { title:'Environments', active:'envs', back:true, overlay:mShutdownModal() }))}
  ${mframe('M06','Error with retry','The cost provider is unreachable; a plain-language message offers retry and a status link. The environment control plane keeps working below.', mPhone(mErrorBody(), { title:'Cost control', active:'cost', back:true, envState:'amber', notif:1 }))}
</div>`;

document.getElementById('sc-wrap').insertAdjacentHTML('beforeend', mobileSection);
lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
