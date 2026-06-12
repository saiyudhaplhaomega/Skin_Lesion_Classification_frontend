/* ============================================================================
   E.9 — Feature flag console (admin, backed by AWS AppConfig).
   Toggle runtime flags without a deploy; stage across environments, roll out by
   percentage, observe usage. Prod changes require confirmation + an audit note.
   Flag names are never exposed to patient-facing screens. No PHI. Loaded after kit.js.
   ============================================================================ */

const NAV = [
  { id: 'overview', label: 'Reliability overview', icon: 'layout-dashboard' },
  { id: 'flags', label: 'Feature flags', icon: 'toggle-right' },
  { id: 'breakers', label: 'Circuit breakers', icon: 'git-fork' },
  { id: 'canary', label: 'Canary rollout', icon: 'bird' },
  { id: 'slo', label: 'SLO & budgets', icon: 'target' },
  { id: 'audit', label: 'Audit log', icon: 'scroll-text' },
];
const NAV_EXTRA = [{ id: 'runbooks', label: 'Runbooks', icon: 'book-open' }, { id: 'access', label: 'Access & roles', icon: 'shield' }];
const USER = { initials: 'PA', name: 'P. Adeyemi', role: 'Platform admin · operator' };

/* flags: key, type, desc, [dev,staging,prod] (bool or pct), owner, changed, author, flag */
const FLAGS = [
  { key: 'gradcam_overlay_v2', type: 'boolean', desc: 'New Grad-CAM overlay renderer with opacity control.', env: [true, true, false], owner: 'Imaging', changed: '2d ago', author: 'M. Halvorsen' },
  { key: 'mobile_capture_guidance', type: 'percentage', desc: 'In-camera image-quality guidance for mobile capture.', env: [100, 100, 25], owner: 'Mobile', changed: '4h ago', author: 'P. Adeyemi', rollout: true },
  { key: 'consent_v3_form', type: 'boolean', desc: 'Consent form version 3 with plain-language storage modes.', env: [true, true, true], owner: 'Privacy', changed: '92d ago', author: 'L. Adesina', stale: true },
  { key: 'doctor_agent_trace', type: 'boolean', desc: 'Show the fact-trace expander in the doctor workflow agent.', env: [true, false, false], owner: 'Clinical', changed: '1d ago', author: 'R. Khoury', devOnly: true },
  { key: 'legacy_pdf_export', type: 'boolean', desc: 'Old PDF report export path (superseded by report-v2).', env: [false, false, false], owner: 'Reports', changed: '—', author: '—', dead: true },
];
const envName = ['Dev', 'Staging', 'Prod'];
function envCell(type, v, env) {
  if (type === 'percentage') { const on = v > 0; return `<div style="display:flex;flex-direction:column;gap:5px;align-items:flex-start"><span class="conf-chip ${v === 100 ? 'green' : v === 0 ? '' : 'amber'}" style="${v === 0 ? 'color:var(--text-muted);background:var(--surface-sunken);border-color:var(--border)' : ''}">${v}%</span><div class="microbar" style="width:62px"><i class="mb-${v === 100 ? 'green' : 'amber'}" style="width:${v}%"></i></div></div>`; }
  return `<span class="envtog ${v ? 'on' : 'off'}"><span class="sw"></span><span class="st">${v ? 'On' : 'Off'}</span></span>`;
}
function flagRow(f, sel) {
  return `<tr class="clickable ${sel ? 'sel' : ''}">
    <td><div class="flag-key">${f.key}</div><div class="flag-desc">${f.desc}</div></td>
    <td><span class="rolechip">${ic(f.type === 'boolean' ? 'toggle-right' : f.type === 'percentage' ? 'percent' : 'shuffle')}${f.type}</span></td>
    <td>${envCell(f.type, f.env[0])}</td>
    <td>${envCell(f.type, f.env[1])}</td>
    <td>${envCell(f.type, f.env[2])}</td>
    <td><span class="rolechip" style="border:none;background:none;padding-left:0">${f.owner}</span><div class="flag-desc" style="margin-top:2px">${f.changed}${f.author !== '—' ? ' · ' + f.author : ''}</div></td>
    <td class="num"><div class="row-act"><button class="mini-btn">${ic('history')}History</button></div></td>
  </tr>`;
}
function flagTable(selKey) {
  return `<div class="opc">
    <div class="filters"><span class="f-search">${ic('search')}<input placeholder="Filter flags by key, owner…" /></span><span class="f-sel">${ic('layers')}Type <span class="fv">All</span>${ic('chevron-down')}</span><span class="f-sel">${ic('git-branch')}Env <span class="fv">All</span>${ic('chevron-down')}</span><span class="f-spacer"></span><span class="t-time">AppConfig · 5 flags · 3 environments</span></div>
    <table class="dtable"><thead><tr><th>Flag</th><th>Type</th><th>Dev</th><th>Staging</th><th>Prod</th><th>Owner / last change</th><th class="num">History</th></tr></thead>
    <tbody>${FLAGS.map(f => flagRow(f, f.key === selKey)).join('')}</tbody></table>
    <div class="flags-foot">${ic('alert-triangle')}<b style="color:var(--amber);font-weight:600">consent_v3_form</b>&nbsp;has been on everywhere for 92 days — consider promoting it to a config default and removing the flag. <b style="color:var(--neutral);margin-left:8px">legacy_pdf_export</b>&nbsp;has had no reads in 60 days (dead flag).</div>
  </div>`;
}
function flagDetail(f) {
  return `<div class="detail-panel">
    <div class="dp-head"><div class="dp-ic blue">${ic('toggle-right')}</div><div class="dp-main"><div class="dp-t">${f.key}</div><div class="dp-id">${f.type} · owner ${f.owner}</div></div><button class="dh-close">${ic('x')}</button></div>
    <div class="dp-body">
      <div><div class="dp-sec-lab">${ic('info')}Description</div><p style="font:400 12.5px/1.6 var(--font-sans);color:var(--text-secondary);margin:0">${f.desc}</p></div>
      <div><div class="dp-sec-lab">${ic('percent')}Rollout per environment</div>
        ${envName.map((n, i) => `<div class="policy-row" style="grid-template-columns:60px 1fr auto"><span class="pr-name">${n}</span><div class="microbar"><i class="mb-${f.env[i] === 100 || f.env[i] === true ? 'green' : f.env[i] ? 'amber' : 'neutral'}" style="width:${f.type === 'percentage' ? f.env[i] : (f.env[i] ? 100 : 0)}%"></i></div><span class="pr-th">${f.type === 'percentage' ? f.env[i] + '%' : (f.env[i] ? 'On' : 'Off')}</span></div>`).join('')}
        <div style="display:flex;gap:8px;margin-top:11px"><button class="btn btn-secondary" style="flex:1;justify-content:center">${ic('sliders-horizontal')}Adjust prod…</button><button class="btn btn-primary" style="flex:1;justify-content:center">${ic('arrow-up')}Promote to next env</button></div>
      </div>
      <div><div class="dp-sec-lab">${ic('code')}Code paths reading this flag</div>
        <div class="codeblock"><pre><span class="cc"># deep-links to source</span>
<span class="ck">app/analyze/</span>gradcamOverlay.tsx<span class="cc">:42</span>
<span class="ck">app/result/</span>ResultViewer.tsx<span class="cc">:118</span></pre></div></div>
      <div><div class="dp-sec-lab">${ic('activity')}SLO impact since last change</div>
        <div class="dp-row"><span class="dl">explain p95 latency</span><span class="dv">+12 ms · within budget</span></div>
        <div class="dp-row"><span class="dl">explain error rate</span><span class="dv">no change</span></div></div>
    </div>
    <div class="dp-foot"><button class="btn btn-secondary">${ic('history')}Rollout history</button><button class="btn btn-secondary">${ic('trash-2')}Retire flag…</button></div>
  </div>`;
}
function auditLog() {
  const items = [
    ['blue', 'percent', '2026-06-06 05:18 UTC', 'mobile_capture_guidance → 25% in prod', 'P. Adeyemi', '"gradual rollout, watching capture-error SLO"'],
    ['green', 'toggle-right', '2026-06-04 11:02 UTC', 'gradcam_overlay_v2 enabled in staging', 'M. Halvorsen', '"QA sign-off on overlay renderer"'],
    ['neutral', 'toggle-left', '2026-06-01 16:44 UTC', 'doctor_agent_trace disabled in prod', 'R. Khoury', '"hold for clinical review of trace copy"'],
  ];
  return `<div class="opc">${items.map(([tone, icn, ts, action, who, why]) => `<div class="m-audit" style="padding:13px var(--sp-md)"><div class="ma-rail"><div class="ma-ic ${tone}">${ic(icn)}</div></div><div class="ma-body"><div class="ma-l1"><span class="ma-action">${action}</span><span class="ma-time">${ts}</span></div><div class="ma-target">${why}</div><div class="ma-actor"><span class="statline neutral">${ic('user')}${who}</span></div></div></div>`).join('')}</div>`;
}

function kpis() {
  return `<div class="kpi-strip c4">
    <div class="kpi-tile lead"><span class="kt-l">${ic('toggle-right')}Active flags</span><span class="kt-v">5</span><span class="kt-foot">across 3 environments</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('percent')}Rollouts in progress</span><span class="kt-v">1</span><span class="kt-foot">mobile_capture_guidance · 25%</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('alarm-clock')}Stale (90d+)</span><span class="kt-v">1</span><span class="kt-foot">${statline('amber', 'alert-triangle', 'consider removal')}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('moon')}Dead (no reads)</span><span class="kt-v">1</span><span class="kt-foot">${statline('neutral', 'trash-2', 'safe to retire')}</span></div>
  </div>`;
}

function body(kind) {
  if (kind === 'detail') return `${kpis()}${rsec('toggle-right', 'Flags', { meta: 'AppConfig · per environment', opOnly: true })}<div class="split">${flagTable('gradcam_overlay_v2')}${flagDetail(FLAGS[0])}</div>${opsNote('<b>Operator surface — not patient-facing.</b> Flag keys are never exposed to patient screens. Prod changes require confirmation and an audit note. No PHI.')}`;
  return `
  ${stateHero('green', 'shield-check', 'Feature flags — 5 active, 1 rollout in progress', 'Flags are toggled at runtime through AppConfig with no deploy. One percentage rollout is mid-flight; one flag is stale and one is dead — both candidates for cleanup.', { meta: [['toggle-right', '5 flags'], ['percent', '1 rolling out']], ts: '09:18 UTC' })}
  ${kpis()}
  ${rsec('toggle-right', 'Flags', { meta: 'AppConfig · per environment', opOnly: true })}
  ${flagTable(null)}
  ${runbook('amber', 'Clean up the stale and dead flags', 'consent_v3_form has been fully on for 92 days — fold it into config and remove the flag. legacy_pdf_export has had no reads in 60 days — retire it. Both reduce config drift and SLO ambiguity.')}
  ${rsec('scroll-text', 'Change audit', { meta: 'who · when · why' })}
  ${auditLog()}
  ${opsNote('<b>Operator surface — not patient-facing.</b> Flag keys never appear on patient screens. Production changes require a confirmation step and a free-text reason recorded to the audit log. No PHI.')}`;
}
function confirmModal() {
  return `<div class="modal-scrim"><div class="modal">
    <div class="modal-head"><div class="mh-ic" style="background:var(--amber-bg);color:var(--amber)">${ic('sliders-horizontal')}</div><div><div class="mh-t">Change a production flag</div><div class="mh-s">Set <b style="font-family:var(--font-mono);font-weight:500;color:var(--text-primary)">mobile_capture_guidance</b> to <b style="color:var(--text-primary)">50%</b> in <b style="color:var(--text-primary)">prod</b>. This takes effect immediately without a deploy.</div></div></div>
    <div class="modal-body"><div class="consequences"><div class="cq-h">Before you change prod</div><ul>
      <li class="keep">${ic('users')}<span>Roughly <b>half of mobile patients</b> will see in-camera quality guidance.</span></li>
      <li class="keep">${ic('activity')}<span>The capture-error SLO is watched; you can roll back instantly from here.</span></li>
      <li class="neg">${ic('scroll-text')}<span>This change is <b>recorded to the audit log</b> with your identity and reason.</span></li>
    </ul></div><div class="confirm-input"><label>Reason for this change (required)</label><input placeholder="e.g. expand rollout after 24h clean at 25%" /></div></div>
    <div class="modal-foot"><button class="btn btn-secondary">${ic('x')}Cancel</button><button class="btn btn-primary">${ic('check')}Apply to prod · 50%</button></div>
  </div></div>`;
}
function bodySkeleton() {
  const t = () => `<div class="kpi-tile"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:30%;height:24px;margin:9px 0 6px"></div></div>`;
  const r = () => `<div class="skel-row"><div style="flex:1"><div class="skel skel-line" style="width:40%"></div><div class="skel skel-line" style="width:70%;margin-top:7px"></div></div><div class="skel skel-line" style="width:50px"></div><div class="skel skel-line" style="width:40px"></div><div class="skel skel-line" style="width:40px"></div></div>`;
  return `<div class="kpi-strip c4">${t()}${t()}${t()}${t()}</div><div class="r-sec" style="margin-top:var(--sp-xl)"><div class="skel skel-line" style="width:100px;height:13px"></div><span class="r-rule"></span></div><div class="opc">${r()}${r()}${r()}</div><div style="display:flex;align-items:center;gap:10px;justify-content:center;color:var(--text-muted);font-size:12.5px;margin-top:var(--sp-xl)"><span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Loading AppConfig flags…</div>`;
}

/* mobile */
const M_TABS = [{ id: 'overview', label: 'Overview', icon: 'layout-dashboard' }, { id: 'flags', label: 'Flags', icon: 'toggle-right' }, { id: 'canary', label: 'Canary', icon: 'bird' }, { id: 'audit', label: 'Audit', icon: 'scroll-text' }];
function mFlag(f) {
  return `<div class="m-flag"><div class="mfl-key">${f.key}</div><div class="mfl-desc">${f.desc}</div>
    <div class="mfl-envs">${envName.map((n, i) => `<div class="mfl-env ${i === 2 ? 'prod' : ''}"><span class="ev-l">${n}</span>${f.type === 'percentage' ? `<span class="conf-chip ${f.env[i] === 100 ? 'green' : f.env[i] === 0 ? '' : 'amber'}" style="${f.env[i] === 0 ? 'color:var(--text-muted);background:var(--surface-sunken);border-color:var(--border)' : ''}">${f.env[i]}%</span>` : `<span class="envtog ${f.env[i] ? 'on' : 'off'}" style="gap:0"><span class="sw"></span></span>`}</div>`).join('')}</div>
    <div class="mfl-changed">${f.owner} · ${f.changed}${f.stale ? ' · <span style="color:var(--amber)">stale 92d</span>' : f.dead ? ' · <span style="color:var(--neutral)">dead flag</span>' : ''}</div></div>`;
}
function mBody() {
  return `${stateHero('green', 'shield-check', '5 flags, 1 rolling out', '', {}).replace('state-hero', 'm-hero').replace('sh-ic', 'mh-ic').replace('sh-main', 'mh-main').replace('sh-t', 'mh-t').replace('sh-d', 'mh-d')}
  ${kpisMobile()}
  ${mSecHead('toggle-right', 'Flags', { opOnly: true, more: '5' })}<div class="m-card">${FLAGS.map(mFlag).join('')}</div>
  <div class="m-runbook amber"><div class="mr-ic">${ic('book-open')}</div><div><div class="mr-t">What to do now</div><div class="mr-h">Clean up stale & dead flags</div><div class="mr-d">consent_v3_form (92d) and legacy_pdf_export (no reads).</div></div></div>`;
}
function kpisMobile() {
  return `<div class="m-kpis"><div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('toggle-right')}</span><span class="mk-name">Active</span></div><div class="mk-val">5</div><div class="mk-foot">flags</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('percent')}</span><span class="mk-name">Rolling out</span></div><div class="mk-val">1</div><div class="mk-foot">25%</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('alarm-clock')}</span><span class="mk-name">Stale</span></div><div class="mk-val">1</div><div class="mk-foot">90d+</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('moon')}</span><span class="mk-name">Dead</span></div><div class="mk-val">1</div><div class="mk-foot">no reads</div></div></div>`;
}
function mAuditView() {
  const items = [['blue', 'percent', '05:18 UTC', 'mobile_capture_guidance → 25% prod', 'P. Adeyemi'], ['green', 'toggle-right', '4 Jun', 'gradcam_overlay_v2 on · staging', 'M. Halvorsen'], ['neutral', 'toggle-left', '1 Jun', 'doctor_agent_trace off · prod', 'R. Khoury']];
  return `${mSecHead('scroll-text', 'Change audit')}<div class="m-card">${items.map(([t, i, ts, a, w]) => `<div class="m-audit"><div class="ma-rail"><div class="ma-ic ${t}">${ic(i)}</div></div><div class="ma-body"><div class="ma-l1"><span class="ma-action" style="font-size:11.5px">${a}</span></div><div class="ma-actor"><span class="ma-time">${ts}</span> · <span style="font:500 11px var(--font-sans)">${w}</span></div></div></div>`).join('')}</div>`;
}
function mBodySkeleton() {
  const k = () => `<div class="m-kpi"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:30%;height:18px;margin:9px 0 5px"></div></div>`;
  const f = () => `<div style="padding:13px;border-bottom:1px solid var(--border)"><div class="skel skel-line" style="width:55%"></div><div class="skel skel-line" style="width:80%;margin-top:7px"></div><div class="skel" style="width:100%;height:34px;margin-top:11px;border-radius:6px"></div></div>`;
  return `<div class="m-kpis">${k()}${k()}${k()}${k()}</div><div class="m-card">${f()}${f()}</div>`;
}

const app = (b, o = {}) => desktopApp(b, { nav: NAV, navExtra: NAV_EXTRA, navActive: 'flags', navLabel: 'Reliability', title: 'Feature flags', user: USER, search: 'Search flags, owners, audit…', ...o });
const phone = (b, o = {}) => mPhone(b, { tabs: M_TABS, active: 'flags', eyebrow: 'Admin · operator', title: 'Feature flags', ...o });

const mast = masthead({
  eyebrow: 'Skin Lesion XAI · Clinical Premium · admin only',
  title: 'Feature flag console',
  sub: 'Backed by AWS AppConfig: toggle runtime feature flags without a deploy, stage them across dev / staging / prod, roll them out by percentage, and observe usage. Each flag shows its type, per-environment value, owner and last change; the detail view links to the code paths that read it and the SLO impact since the last change. Production changes require a confirmation step and an audit note. Flag keys are never exposed to patient-facing screens.',
  legend: ['Flag state — color + icon + text', ['green', 'toggle-right', 'On / full rollout'], ['amber', 'percent', 'Partial rollout'], ['neutral', 'toggle-left', 'Off'], ['amber', 'alarm-clock', 'Stale — review']],
});

const desktop = sectionHead('A', 'Desktop — feature flag console', '1440px · admin console')
  + frame('01', 'Loading skeleton', 'KPI and table scaffolds paint immediately; per-environment values pulse while AppConfig loads.', app(bodySkeleton()), { url: 'ops.skinlesionxai.health/flags' })
  + frame('02', 'Flag list', 'Five flags across three environments showing boolean toggles and percentage rollouts, owners, and a footer that flags the stale and dead flags.', app(body('list'), { envState: 'green' }), { url: 'ops.skinlesionxai.health/flags' })
  + frame('03', 'Flag detail', 'Opening a flag shows its description, per-environment rollout, the code paths that read it, and the SLO impact since the last change.', app(body('detail'), { envState: 'green' }), { url: 'ops.skinlesionxai.health/flags' })
  + frame('04', 'Change a production flag', 'Adjusting a prod flag is gated by a confirmation that states the blast radius, the watched SLO, and requires a reason for the audit log.', app(body('list'), { overlay: confirmModal() }), { url: 'ops.skinlesionxai.health/flags' })
  + frame('05', 'Change audit', 'Every change is recorded with who, when and a free-text reason — the basis for safe runtime configuration.', app(body('list'), { navActive: 'audit', title: 'Audit log' }), { url: 'ops.skinlesionxai.health/flags' });

const mobile = sectionHead('B', 'Mobile — flag console', '375px · bottom tabs · flag cards')
  + '<div class="frame-grid">'
  + mframe('M01', 'Loading skeleton', 'KPI tiles and flag cards pulse while AppConfig loads.', phone(mBodySkeleton(), { active: 'flags' }))
  + mframe('M02', 'Flag list', 'Flags collapse to cards with a three-up per-environment row of toggles and percentages.', phone(mBody(), { active: 'flags' }))
  + mframe('M03', 'Change audit', 'The audit tab lists every change with who and a reason.', phone(`${kpisMobile()}${mAuditView()}`, { active: 'audit', title: 'Audit log' }))
  + '</div>';

mountShowcase([mast, desktop, mobile]);
