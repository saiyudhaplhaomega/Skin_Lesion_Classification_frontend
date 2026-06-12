/* ============================================================================
   E.7 — Canary traffic-split control panel (admin).
   Gradually shift traffic from production to the candidate; auto-rollback on
   SLO breach. Stepped traffic control, prod-vs-canary comparison, visible
   rollback thresholds. Bucketing is consistent-hash on patient TOKEN so a
   patient sees a stable model. Candidate output is never shown to patients
   without an internal label. No PHI. Loaded after kit.js.
   ============================================================================ */

const NAV = [
  { id: 'overview', label: 'Reliability overview', icon: 'layout-dashboard' },
  { id: 'shadow', label: 'Shadow deploy', icon: 'split' },
  { id: 'canary', label: 'Canary rollout', icon: 'bird' },
  { id: 'breakers', label: 'Circuit breakers', icon: 'git-fork' },
  { id: 'flags', label: 'Feature flags', icon: 'toggle-right' },
  { id: 'slo', label: 'SLO & budgets', icon: 'target' },
];
const NAV_EXTRA = [{ id: 'runbooks', label: 'Runbooks', icon: 'book-open' }, { id: 'access', label: 'Access & roles', icon: 'shield' }];
const USER = { initials: 'PA', name: 'P. Adeyemi', role: 'Platform reliability · operator' };

const STEPS = [0, 5, 25, 50, 100];
function kpis(kind) {
  const pct = kind === 'aborted' ? 0 : kind === 'ready' ? 50 : kind === 'none' ? 0 : kind === 'watching' ? 25 : 25;
  const errD = kind === 'aborted' ? '+2.9' : kind === 'watching' ? '+0.4' : '+0.1';
  const latD = kind === 'watching' ? '+180' : kind === 'aborted' ? '+40' : '+22';
  return `<div class="kpi-strip c4">
    <div class="kpi-tile lead"><span class="kt-l">${ic('bird')}Canary traffic</span><span class="kt-v">${pct}<small>%</small></span><span class="kt-foot">${kind === 'aborted' ? statline('red', 'rotate-ccw', 'rolled back to 0%') : kind === 'none' ? statline('neutral', 'circle-off', 'no canary') : statline('green', 'check-circle', 'on candidate v3.1-rc')}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('alert-triangle')}Error-rate Δ</span><span class="kt-v">${errD}<small>%</small></span><span class="kt-foot">${kind === 'aborted' ? statline('red', 'alert-octagon', 'breached 1.0% gate') : 'vs production baseline'}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('timer')}p95 latency Δ</span><span class="kt-v">${latD}<small>ms</small></span><span class="kt-foot">${kind === 'watching' ? statline('amber', 'trending-up', 'nearing 200ms gate') : 'vs production baseline'}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('clock')}Time at this stage</span><span class="kt-v">${kind === 'ready' ? '24' : kind === 'aborted' ? '0' : '6'}<small>h</small></span><span class="kt-foot">${kind === 'ready' ? 'SLOs held 24h' : 'started 06:18 UTC'}</span></div>
  </div>`;
}
function summary(kind) {
  if (kind === 'healthy') return stateHero('green', 'shield-check', 'Canary running at 25% — healthy', 'Candidate v3.1-rc is taking 25% of traffic with error rate and latency within gates. Bucketing is consistent-hash on patient token, so each patient sees a stable model.', { meta: [['bird', '25% on candidate'], ['hash', 'token-stable buckets']], ts: '09:18 UTC' });
  if (kind === 'watching') return stateHero('amber', 'alert-triangle', 'Canary running at 25% — watching p95 latency', 'Latency delta has crept to +180ms, nearing the 200ms auto-rollback gate. Error rate is fine. Hold at this stage and investigate before advancing.', { meta: [['timer', '+180ms p95'], ['gauge', 'gate 200ms']], ts: '09:18 UTC' });
  if (kind === 'aborted') return stateHero('red', 'alert-octagon', 'Canary aborted — auto-rollback fired', 'Error-rate delta hit +2.9%, breaching the 1.0% gate. The system automatically rolled traffic back to 0% production-only. The candidate is held; review before retrying.', { meta: [['rotate-ccw', 'rolled back to 0%'], ['alert-triangle', 'gate: error-rate > 1.0%']], ts: '09:14 UTC' });
  if (kind === 'ready') return stateHero('green', 'check-circle', 'Canary at 50% — SLOs held for 24h', 'All gates have held at 50% for the full 24-hour soak. The candidate is ready to advance to 100%. Confirm the final step explicitly.', { meta: [['bird', '50% · 24h clean'], ['arrow-up', 'ready for 100%']], ts: '09:18 UTC' });
  return stateHero('neutral', 'circle-off', 'No canary active — 100% production', 'All traffic is on the production model. Start a canary to roll a candidate out gradually with automatic rollback on SLO breach.', { meta: [['cpu', 'production only'], ['circle-off', 'no candidate']], ts: '09:18 UTC' });
}

function trafficControl(kind) {
  const cur = kind === 'aborted' ? 0 : kind === 'ready' ? 50 : kind === 'none' ? 0 : 25;
  const curIdx = STEPS.indexOf(cur);
  const fillPct = (curIdx / (STEPS.length - 1)) * 100;
  const steps = STEPS.map((s, i) => `<div class="cstep ${i < curIdx ? 'done' : i === curIdx ? 'cur' : ''}"><div class="cdot"></div><span class="clab">${s}%</span></div>`).join('');
  return `<div class="canary-ctrl">
    <div class="cc-top"><div><div class="cc-pct">${cur}<small>% canary</small></div></div><div class="cc-rule">${ic('hash')}consistent-hash · sha256(patientToken) → bucket</div></div>
    <div class="csteps"><div class="cfill" style="width:${fillPct}%"></div>${steps}</div>
    <div class="cc-foot">
      ${kind === 'ready' ? `<button class="btn btn-primary">${ic('arrow-up')}Advance to 100%…</button><button class="btn btn-secondary">${ic('pause')}Hold at 50%</button>` : kind === 'aborted' ? `<button class="btn btn-secondary">${ic('rotate-cw')}Retry canary…</button><button class="btn btn-ghost">${ic('eye')}Review breach</button>` : kind === 'none' ? `<button class="btn btn-primary">${ic('play')}Start canary at 5%…</button>` : `<button class="btn btn-primary">${ic('arrow-up')}Advance to 50%…</button><button class="btn btn-danger">${ic('rotate-ccw')}Roll back now</button>`}
    </div>
  </div>`;
}
function comparePanel(kind) {
  const errC = kind === 'aborted' ? 3.0 : 0.4; const latC = kind === 'watching' ? 100 : 70;
  const metric = (label, prodV, canV, prodPct, canPct, unit, tone) => `<div class="cmp-metric"><div class="cm-l">${label}</div><div class="cm-rows">
    <div class="cmp-row"><span class="cr-side"><span class="dot" style="background:var(--text-muted)"></span>Prod</span><div class="cr-track"><i style="width:${prodPct}%;background:var(--neutral)"></i></div><span class="cr-v" style="color:var(--text-secondary)">${prodV}${unit}</span></div>
    <div class="cmp-row"><span class="cr-side"><span class="dot" style="background:var(--accent)"></span>Canary</span><div class="cr-track"><i style="width:${canPct}%;background:var(--${tone})"></i></div><span class="cr-v" style="color:var(--${tone})">${canV}${unit}</span></div>
  </div></div>`;
  return `<div class="cmp-grid">
    ${metric('Request rate', '1,240', kind === 'none' ? '0' : '410', 80, kind === 'none' ? 0 : 27, ' rpm', 'accent')}
    ${metric('Error rate', '0.1', errC.toFixed(1), 10, Math.min(100, errC / 3 * 100), '%', kind === 'aborted' ? 'red' : 'green')}
    ${metric('p95 latency', '640', kind === 'watching' ? '820' : '662', 64, latC, ' ms', kind === 'watching' ? 'amber' : 'accent')}
    ${metric('Benign-band share', '44', kind === 'aborted' ? '39' : '45', 44, kind === 'aborted' ? 39 : 45, '%', kind === 'aborted' ? 'amber' : 'accent')}
  </div>`;
}
function rollbackPolicy(kind) {
  const rows = [
    ['Error-rate delta', 'over 5 min', '> 1.0%', kind === 'aborted' ? 'red' : 'green', kind === 'aborted' ? 'breached · +2.9%' : 'ok · +0.1%'],
    ['p95 latency delta', 'over 5 min', '> 200 ms', kind === 'watching' ? 'amber' : 'green', kind === 'watching' ? 'near · +180ms' : 'ok · +22ms'],
    ['Calibration ECE', 'rolling', '> 0.08', 'green', 'ok · 0.031'],
  ];
  return `<div class="opc"><div class="opc-head"><span class="oh-t">${ic('shield')}Auto-rollback policy</span><span class="oh-spacer"></span><span class="oh-sub">${kind === 'aborted' ? 'rollback fired 09:14 UTC' : 'armed'}</span></div>
    ${rows.map(([n, win, th, tone, state]) => `<div class="policy-row"><div><div class="pr-name">${n}</div><div class="pr-sub">${win}</div></div><span class="pr-th">${th}</span>${statline(tone, tone === 'green' ? 'check-circle' : tone === 'amber' ? 'alert-triangle' : 'alert-octagon', state)}</div>`).join('')}
    <div class="flags-foot" style="background:var(--surface)">${ic('rotate-ccw')}Auto-rollback returns traffic to 0% (production-only) the moment any gate breaches — no human in the loop required.</div>
  </div>`;
}

function body(kind) {
  if (kind === 'none') return `${summary('none')}${kpis('none')}${rsec('bird', 'Traffic split', { meta: '0% / 5% / 25% / 50% / 100%', opOnly: true })}${trafficControl('none')}${rsec('shield', 'Rollback policy', { meta: 'armed thresholds' })}${rollbackPolicy('none')}${opsNote('<b>Operator surface — not patient-facing.</b> Bucketing hashes the patient token (never an email). Candidate output is never shown to patients without an internal label. No PHI.')}`;
  return `
  ${summary(kind)}
  ${kpis(kind)}
  ${rsec('bird', 'Traffic split', { meta: 'stepped · confirmation required', opOnly: true })}
  ${trafficControl(kind)}
  ${kind === 'aborted' ? runbook('red', 'Auto-rollback already fired — review before retrying', 'Error-rate breached the gate and traffic is back on production. Pull the canary-window errors, fix the root cause, and only then retry from 5%.', 'Open rollback runbook') : kind === 'watching' ? runbook('amber', 'Hold at 25% until latency settles', 'p95 latency is nearing the 200ms gate. Don\u2019t advance. Check the candidate\u2019s GPU headroom; if it crosses the gate, auto-rollback will fire on its own.') : kind === 'ready' ? runbook('green', 'SLOs held 24h at 50% — advance to 100%', 'All gates have stayed green for the full soak. Advancing to 100% promotes the candidate to production. The step requires explicit confirmation.', 'Open promotion runbook') : ''}
  ${rsec('git-compare', 'Production vs canary', { meta: 'same axes · live' })}
  ${comparePanel(kind)}
  ${rsec('shield', 'Rollback policy', { meta: 'visible thresholds' })}
  ${rollbackPolicy(kind)}
  ${opsNote('<b>Operator surface — not patient-facing.</b> Each patient is pinned to one model by a consistent hash of their opaque token. Stages cannot be skipped without acknowledgement. No PHI.')}`;
}
function bodySkeleton() {
  const t = () => `<div class="kpi-tile"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:40%;height:24px;margin:9px 0 6px"></div></div>`;
  return `<div class="kpi-strip c4">${t()}${t()}${t()}${t()}</div><div class="r-sec" style="margin-top:var(--sp-xl)"><div class="skel skel-line" style="width:120px;height:13px"></div><span class="r-rule"></span></div><div class="canary-ctrl"><div class="skel" style="width:100%;height:64px;border-radius:8px"></div></div><div style="display:flex;align-items:center;gap:10px;justify-content:center;color:var(--text-muted);font-size:12.5px;margin-top:var(--sp-xl)"><span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Loading canary state & SLO deltas…</div>`;
}
function confirmModal() {
  return `<div class="modal-scrim"><div class="modal">
    <div class="modal-head"><div class="mh-ic" style="background:var(--accent-light);color:var(--accent)">${ic('arrow-up')}</div><div><div class="mh-t">Advance canary to 50%?</div><div class="mh-s">Shifts <b style="color:var(--text-primary)">half of all traffic</b> to candidate v3.1-rc. Each patient stays pinned to one model by token hash. Auto-rollback remains armed.</div></div></div>
    <div class="modal-body"><div class="consequences"><div class="cq-h">Before you advance</div><ul>
      <li class="keep">${ic('check-circle')}<span>SLOs held at 25% for <b>6h</b> with error and latency within gates.</span></li>
      <li class="keep">${ic('shield-check')}<span>Auto-rollback to 0% stays armed for error-rate, latency and ECE.</span></li>
      <li class="neg">${ic('alert-triangle')}<span>A breach at 50% affects <b>more patients</b> before rollback — though the served path stays safe.</span></li>
    </ul></div><div class="confirm-input"><label>Acknowledge by typing the stage <b>50</b></label><input placeholder="50" /></div></div>
    <div class="modal-foot"><button class="btn btn-secondary">${ic('x')}Cancel</button><button class="btn btn-primary">${ic('arrow-up')}Advance to 50%</button></div>
  </div></div>`;
}

/* mobile */
const M_TABS = [{ id: 'overview', label: 'Overview', icon: 'layout-dashboard' }, { id: 'canary', label: 'Canary', icon: 'bird' }, { id: 'shadow', label: 'Shadow', icon: 'split' }, { id: 'slo', label: 'SLO', icon: 'target' }];
function mHero(kind) {
  const map = { healthy: ['green', 'shield-check', 'Canary at 25% — healthy', 'Within gates. Token-stable buckets.'], watching: ['amber', 'alert-triangle', 'Watching p95 latency', '+180ms, nearing the 200ms gate.'], aborted: ['red', 'alert-octagon', 'Canary aborted', 'Error-rate breached; rolled back to 0%.'], ready: ['green', 'check-circle', 'Held 24h at 50%', 'Ready to advance to 100%.'], none: ['neutral', 'circle-off', 'No canary active', '100% production.'] };
  const [tone, icn, t, d] = map[kind];
  return `<div class="m-hero ${tone}"><div class="mh-ic">${ic(icn)}</div><div class="mh-main"><div class="mh-t">${t}</div><div class="mh-d">${d}</div></div></div>`;
}
function mKpis(kind) {
  const pct = kind === 'aborted' ? 0 : kind === 'ready' ? 50 : kind === 'none' ? 0 : 25;
  return `<div class="m-kpis"><div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('bird')}</span><span class="mk-name">Canary</span></div><div class="mk-val">${pct}<span class="u">%</span></div><div class="mk-foot">${kind === 'aborted' ? 'rolled back' : 'v3.1-rc'}</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('alert-triangle')}</span><span class="mk-name">Error Δ</span></div><div class="mk-val sm">${kind === 'aborted' ? '+2.9%' : '+0.1%'}</div><div class="mk-foot">${kind === 'aborted' ? 'breached' : 'gate 1%'}</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('timer')}</span><span class="mk-name">p95 Δ</span></div><div class="mk-val sm">${kind === 'watching' ? '+180ms' : '+22ms'}</div><div class="mk-foot">gate 200ms</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('clock')}</span><span class="mk-name">At stage</span></div><div class="mk-val">${kind === 'ready' ? 24 : 6}<span class="u">h</span></div><div class="mk-foot">soak</div></div></div>`;
}
function mCtrl(kind) {
  const cur = kind === 'aborted' ? 0 : kind === 'ready' ? 50 : kind === 'none' ? 0 : 25;
  const curIdx = STEPS.indexOf(cur); const fillPct = (curIdx / (STEPS.length - 1)) * 100;
  return `<div class="m-card" style="padding:16px 13px"><div style="font:500 26px var(--font-mono);color:var(--accent);text-align:center;margin-bottom:14px">${cur}<span style="font-size:13px;color:var(--text-muted)">% canary</span></div>
  <div class="csteps">${'<div class="cfill" style="width:' + fillPct + '%"></div>'}${STEPS.map((s, i) => `<div class="cstep ${i < curIdx ? 'done' : i === curIdx ? 'cur' : ''}"><div class="cdot"></div><span class="clab">${s}%</span></div>`).join('')}</div>
  <div style="display:flex;gap:8px;margin-top:14px">${kind === 'ready' ? `<button class="btn btn-primary" style="flex:1;justify-content:center">${ic('arrow-up')}To 100%</button>` : kind === 'aborted' ? `<button class="btn btn-secondary" style="flex:1;justify-content:center">${ic('rotate-cw')}Retry</button>` : kind === 'none' ? `<button class="btn btn-primary" style="flex:1;justify-content:center">${ic('play')}Start at 5%</button>` : `<button class="btn btn-primary" style="flex:1;justify-content:center">${ic('arrow-up')}To 50%</button><button class="btn btn-danger" style="flex:1;justify-content:center">${ic('rotate-ccw')}Roll back</button>`}</div></div>`;
}
function mBody(kind) {
  return `${mHero(kind)}${mKpis(kind)}${mSecHead('bird', 'Traffic split', { opOnly: true })}${mCtrl(kind)}${kind === 'aborted' ? `<div class="m-runbook red"><div class="mr-ic">${ic('book-open')}</div><div><div class="mr-t">What to do now</div><div class="mr-h">Review before retrying</div><div class="mr-d">Rollback fired. Fix root cause, retry from 5%.</div><a class="mr-link">${ic('external-link')}Runbook</a></div></div>` : kind === 'ready' ? `<div class="m-runbook"><div class="mr-ic">${ic('book-open')}</div><div><div class="mr-t">What to do now</div><div class="mr-h">Advance to 100%</div><div class="mr-d">SLOs held 24h at 50%.</div></div></div>` : ''}${mSecHead('shield', 'Rollback policy')}<div class="m-card">${mPolicy(kind)}</div>`;
}
function mPolicy(kind) {
  const rows = [['Error-rate Δ', '> 1.0%', kind === 'aborted' ? 'red' : 'green', kind === 'aborted' ? 'breached' : 'ok'], ['p95 latency Δ', '> 200ms', kind === 'watching' ? 'amber' : 'green', kind === 'watching' ? 'near' : 'ok'], ['ECE', '> 0.08', 'green', 'ok']];
  return rows.map(([n, th, tone, st]) => `<div style="display:flex;align-items:center;gap:9px;padding:11px 13px;border-bottom:1px solid var(--border)"><span style="flex:1;font:600 12px var(--font-sans)">${n}</span><span style="font:500 11px var(--font-mono);color:var(--text-muted)">${th}</span>${statline(tone, tone === 'green' ? 'check-circle' : tone === 'amber' ? 'alert-triangle' : 'alert-octagon', st)}</div>`).join('');
}
function mBodySkeleton() {
  const k = () => `<div class="m-kpi"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:40%;height:18px;margin:9px 0 5px"></div></div>`;
  return `<div class="m-kpis">${k()}${k()}${k()}${k()}</div><div class="m-card" style="padding:16px"><div class="skel" style="width:100%;height:60px;border-radius:8px"></div></div>`;
}

const app = (b, o = {}) => desktopApp(b, { nav: NAV, navExtra: NAV_EXTRA, navActive: 'canary', navLabel: 'Reliability', title: 'Canary rollout', user: USER, search: 'Search rollouts, SLOs, runbooks…', ...o });
const phone = (b, o = {}) => mPhone(b, { tabs: M_TABS, active: 'canary', eyebrow: 'Reliability · operator', title: 'Canary rollout', ...o });

const mast = masthead({
  eyebrow: 'Skin Lesion XAI · Clinical Premium · operator only',
  title: 'Canary traffic-split control panel',
  sub: 'Gradually shifts traffic from the production model to the candidate, with automatic rollback on SLO breach. A stepped traffic control (0/5/25/50/100), a production-vs-canary comparison on shared axes, and visible rollback thresholds. Bucketing is a consistent hash of the patient token, so each patient sees a stable model; candidate output is never shown to a patient without an internal label. Not patient-facing — no PHI.',
  legend: ['Rollout state — color + icon + text', ['green', 'check-circle', 'Healthy / ready'], ['amber', 'alert-triangle', 'Watching a gate'], ['red', 'rotate-ccw', 'Aborted — rolled back'], ['neutral', 'circle-off', 'No canary']],
});

const desktop = sectionHead('A', 'Desktop — canary traffic-split control', '1440px · operator console')
  + frame('01', 'Loading skeleton', 'The stepped control and comparison scaffold paint immediately; SLO deltas pulse while metrics stream in.', app(bodySkeleton()), { url: 'ops.skinlesionxai.health/canary' })
  + frame('02', 'Running at 25% — healthy', 'A green hero, the stepped slider at 25%, healthy prod-vs-canary metrics, and an armed rollback policy.', app(body('healthy'), { envState: 'green' }), { url: 'ops.skinlesionxai.health/canary' })
  + frame('03', 'Watching one threshold', 'Latency delta nears the 200ms gate; an amber hero and runbook say hold at 25% and investigate before advancing.', app(body('watching'), { envState: 'amber', notif: 1 }), { url: 'ops.skinlesionxai.health/canary' })
  + frame('04', 'Confirmation to advance', 'Advancing a stage requires explicit acknowledgement; the modal lists the soak result, the armed rollback, and the wider blast radius.', app(body('healthy'), { overlay: confirmModal() }), { url: 'ops.skinlesionxai.health/canary' })
  + frame('05', 'Aborted — auto-rollback fired', 'Error-rate breached the gate; the red hero names the SLO that triggered rollback and traffic is back to 0%. The policy row shows the breach.', app(body('aborted'), { envState: 'red', notif: 2 }), { url: 'ops.skinlesionxai.health/canary' })
  + frame('06', 'At 50% — ready to promote', 'SLOs held for the full 24h soak; a green hero and runbook offer the final advance to 100%.', app(body('ready'), { envState: 'green' }), { url: 'ops.skinlesionxai.health/canary' })
  + frame('07', 'No canary active', 'All traffic on production; a clear starting point to begin a rollout at 5%.', app(body('none'), { envState: 'neutral' }), { url: 'ops.skinlesionxai.health/canary' });

const mobile = sectionHead('B', 'Mobile — rollout control', '375px · bottom tabs · stepped control')
  + '<div class="frame-grid">'
  + mframe('M01', 'Loading skeleton', 'The stepped control pulses while deltas load.', phone(mBodySkeleton(), { active: 'canary' }))
  + mframe('M02', 'Running at 25%', 'Green hero; the stepped control shows 25% with advance / roll-back actions.', phone(mBody('healthy'), { active: 'canary' }))
  + mframe('M03', 'Watching a gate', 'Amber hero; latency nears the gate and the policy shows "near".', phone(mBody('watching'), { active: 'canary', envState: 'amber', notif: 1 }))
  + mframe('M04', 'Aborted', 'Red hero and runbook; control is back at 0% with a retry action.', phone(mBody('aborted'), { active: 'canary', envState: 'red', notif: 2 }))
  + mframe('M05', 'Ready to promote', 'Green hero; the control sits at 50% after a clean 24h soak.', phone(mBody('ready'), { active: 'canary' }))
  + '</div>';

mountShowcase([mast, desktop, mobile]);
