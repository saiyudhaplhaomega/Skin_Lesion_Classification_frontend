/* ============================================================================
   E.5 — Calibration view & reliability diagram (research).
   Shows how well predicted probability matches the empirical positive rate.
   A well-calibrated 0.8 should be right 80% of the time. ECE/MCE headlines,
   per-cohort breakdown, and current-vs-candidate comparison. Simplest
   reliability-diagram convention; no decorative chart styles. Loaded after kit.js.
   ============================================================================ */

const NAV = [
  { id: 'overview', label: 'Model overview', icon: 'layout-dashboard' },
  { id: 'perf', label: 'Performance', icon: 'gauge' },
  { id: 'drift', label: 'Drift', icon: 'activity' },
  { id: 'calib', label: 'Calibration', icon: 'scale' },
  { id: 'fair', label: 'Fairness', icon: 'scale-3d' },
  { id: 'shadow', label: 'Shadow & canary', icon: 'split' },
];
const NAV_EXTRA = [{ id: 'runbooks', label: 'Runbooks', icon: 'book-open' }, { id: 'datasets', label: 'Datasets', icon: 'database' }];
const USER = { initials: 'RK', name: 'R. Khoury', role: 'ML research · read-only on PHI' };

const CURVES = {
  good: [[0.1, 0.11], [0.3, 0.31], [0.5, 0.49], [0.7, 0.71], [0.9, 0.89]],
  under: [[0.1, 0.19], [0.3, 0.44], [0.5, 0.64], [0.7, 0.82], [0.9, 0.96]],
  over: [[0.1, 0.06], [0.3, 0.21], [0.5, 0.39], [0.7, 0.55], [0.9, 0.76]],
  recal: [[0.1, 0.04], [0.3, 0.17], [0.5, 0.34], [0.7, 0.5], [0.9, 0.71]],
};
const STATE = {
  'well': { kind: 'good', tone: 'green', ece: 0.028, mce: 0.061, label: 'Well-calibrated' },
  'under': { kind: 'under', tone: 'amber', ece: 0.054, mce: 0.118, label: 'Under-confident' },
  'over': { kind: 'over', tone: 'amber', ece: 0.061, mce: 0.142, label: 'Over-confident' },
  'recal': { kind: 'recal', tone: 'red', ece: 0.092, mce: 0.205, label: 'Recalibration recommended' },
};
const PRED_HIST = [3, 6, 9, 12, 14, 13, 16, 19, 22, 28];

function kpis(s) {
  return `<div class="kpi-strip c4">
    <div class="kpi-tile lead"><span class="kt-l">${ic('scale')}Expected calibration error</span><span class="kt-v">${s.ece.toFixed(3)}</span><span class="kt-foot">${statline(s.tone, s.tone === 'green' ? 'check-circle' : 'alert-triangle', s.tone === 'red' ? 'exceeds 0.08 limit' : s.tone === 'amber' ? 'above 0.05 target' : 'within target')}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('trending-up')}Max calibration error</span><span class="kt-v">${s.mce.toFixed(3)}</span><span class="kt-foot">worst probability bin</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('layers')}Eval sample</span><span class="kt-v">11,840</span><span class="kt-foot">held-out + production-labelled</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('thermometer')}Temperature</span><span class="kt-v">${s.kind === 'recal' ? '1.00' : '1.32'}</span><span class="kt-foot">${s.kind === 'recal' ? 'pre-scaling' : 'post-scaling applied'}</span></div>
  </div>`;
}
function summary(key) {
  const s = STATE[key];
  if (key === 'well') return stateHero('green', 'shield-check', 'Model is well-calibrated', 'Predicted probability tracks the empirical positive rate closely — the curve hugs the 45° line. A prediction of 0.8 is right about 80% of the time.', { meta: [['scale', `ECE ${s.ece.toFixed(3)}`], ['trending-up', `MCE ${s.mce.toFixed(3)}`]], ts: '2026-06-06 09:00 UTC' });
  if (key === 'under') return stateHero('amber', 'alert-triangle', 'Model is under-confident', 'The curve sits above the diagonal: when the model says 0.6 the truth is closer to 0.8. Under-confidence is safer than over-confidence but still worth scaling.', { meta: [['scale', `ECE ${s.ece.toFixed(3)}`], ['arrow-up-right', 'curve above diagonal']], ts: '2026-06-06 09:00 UTC' });
  if (key === 'over') return stateHero('amber', 'alert-triangle', 'Model is over-confident — the direction to watch', 'The curve sits below the diagonal: when the model says 0.95 the truth is closer to 0.85. In medical AI this is the bias to watch most — overstated certainty.', { meta: [['scale', `ECE ${s.ece.toFixed(3)}`], ['arrow-down-right', 'curve below diagonal']], ts: '2026-06-06 09:00 UTC' });
  return stateHero('red', 'alert-octagon', 'Recalibration recommended', 'ECE has risen to 0.092, past the 0.08 limit, and the model is materially over-confident in the top bins. Apply temperature scaling and re-evaluate before the next promotion.', { meta: [['scale', `ECE ${s.ece.toFixed(3)}`], ['thermometer', 'no scaling applied']], ts: '2026-06-06 09:00 UTC' });
}

function relPanel(key) {
  const s = STATE[key];
  return `<div class="chart-panel ${s.tone === 'red' ? 'red' : s.tone === 'amber' ? 'amber' : ''}">
    <div class="cp-head"><span class="cp-t">${ic('scale')}Reliability diagram</span><span class="cp-div conf-chip ${s.tone}">${s.label}</span></div>
    <div style="display:flex;justify-content:center;padding:6px 0">${reliability(CURVES[s.kind], { kind: s.kind })}</div>
    <div class="histo-legend" style="justify-content:center"><span><span class="sw" style="background:var(--text-muted)"></span>Perfect calibration</span><span><span class="sw" style="background:var(--${s.tone === 'green' ? 'green' : s.tone === 'red' ? 'red' : 'accent'})"></span>Model curve</span></div>
    <div style="font:400 11px var(--font-sans);color:var(--text-muted);text-align:center;margin-top:8px">y-axis: empirical positive rate · vertical distance from the diagonal is miscalibration</div>
  </div>`;
}
function histPanel() {
  return `<div class="chart-panel">
    <div class="cp-head"><span class="cp-t">${ic('bar-chart-3')}Predictions per probability bin</span><span class="cp-div" style="color:var(--text-muted)">10 bins</span></div>
    ${histogram(PRED_HIST, PRED_HIST.map(() => 0), { tone: 'accent', h: 120 })}
    <div style="display:flex;justify-content:space-between;font:400 9.5px var(--font-mono);color:var(--text-muted);margin-top:6px"><span>0.0</span><span>0.5</span><span>1.0</span></div>
    <div class="histo-legend"><span><span class="sw" style="background:var(--neutral-border)"></span>Prediction count</span></div>
    <div style="font:400 11px var(--font-sans);color:var(--text-muted);margin-top:8px">Most mass sits in the high-probability bins — calibration error there matters most.</div>
  </div>`;
}
function cohortCalib(key) {
  const base = STATE[key].ece;
  const rows = [
    ['Skin-tone I–II', base * 0.9], ['Skin-tone III–IV', base], ['Skin-tone V–VI', key === 'recal' ? base * 1.6 : base * 1.2],
    ['Web upload', base * 0.95], ['Mobile capture', base * 1.15], ['Model v3.0', base], ['Model v3.1-rc', base * (key === 'recal' ? 0.5 : 0.8)],
  ];
  const t = (v) => v >= 0.08 ? 'red' : v >= 0.05 ? 'amber' : 'green';
  return `<div class="opc"><table class="dtable"><thead><tr><th>Cohort / version</th><th>ECE</th><th class="num">Calibration</th></tr></thead><tbody>
    ${rows.map(([c, v]) => `<tr><td>${c}</td><td style="width:55%"><div class="microbar"><i class="mb-${t(v)}" style="width:${Math.min(100, v / 0.12 * 100).toFixed(0)}%"></i></div></td><td class="num"><span class="conf-chip ${t(v)}">${v.toFixed(3)}</span></td></tr>`).join('')}
  </tbody></table></div>`;
}
function comparePanel(key) {
  const a = STATE[key];
  return `<div class="grid-2c">
    <div class="chart-panel ${a.tone === 'red' ? 'red' : ''}"><div class="cp-head"><span class="cp-t">${ic('cpu')}Current · v3.0 ${a.kind === 'recal' ? '(pre-temperature)' : ''}</span><span class="cp-div conf-chip ${a.tone}">ECE ${a.ece.toFixed(3)}</span></div><div style="display:flex;justify-content:center">${reliability(CURVES[a.kind], { kind: a.kind, w: 240, h: 240 })}</div></div>
    <div class="chart-panel"><div class="cp-head"><span class="cp-t">${ic('flask-conical')}Candidate · v3.1-rc ${a.kind === 'recal' ? '(post-temperature)' : ''}</span><span class="cp-div conf-chip green">ECE ${(a.ece * (key === 'recal' ? 0.4 : 0.7)).toFixed(3)}</span></div><div style="display:flex;justify-content:center">${reliability(CURVES.good, { kind: 'candidate', w: 240, h: 240 })}</div></div>
  </div>`;
}

function body(key) {
  const s = STATE[key];
  return `
  ${summary(key)}
  ${kpis(s)}
  ${(key === 'recal') ? runbook('red', 'Apply temperature scaling, then re-evaluate', 'ECE is past the limit and the model is over-confident in the high bins. Fit a temperature on the validation set, re-run this view, and confirm the candidate curve hugs the diagonal before promotion.', 'Open calibration runbook') : (key === 'over' || key === 'under') ? runbook('amber', 'Consider temperature scaling before the next release', `The model is ${s.label.toLowerCase()}. A single temperature parameter will pull the curve toward the diagonal without retraining. Re-evaluate after fitting.`) : ''}
  ${rsec('scale', 'Reliability', { meta: 'predicted probability vs empirical rate', opOnly: true })}
  <div class="grid-2c">${relPanel(key)}${histPanel()}</div>
  ${rsec('users', 'Per-cohort calibration', { meta: 'skin-tone · source · version' })}
  ${cohortCalib(key)}
  ${rsec('git-compare', 'Compare model versions', { meta: 'current vs candidate' })}
  ${comparePanel(key)}
  ${opsNote('<b>Research surface — read-only on patient data.</b> Calibration is computed on held-out and production-labelled samples in aggregate. No PHI, no images, no identifiers. Cohorts are buckets, never individuals.')}`;
}
function bodySkeleton() {
  const t = () => `<div class="kpi-tile"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:40%;height:24px;margin:9px 0 6px"></div></div>`;
  return `<div class="kpi-strip c4">${t()}${t()}${t()}${t()}</div><div class="r-sec" style="margin-top:var(--sp-xl)"><div class="skel skel-line" style="width:120px;height:13px"></div><span class="r-rule"></span></div><div class="grid-2c"><div class="chart-panel"><div class="skel" style="width:100%;height:280px;border-radius:8px"></div></div><div class="chart-panel"><div class="skel" style="width:100%;height:280px;border-radius:8px"></div></div></div><div style="display:flex;align-items:center;gap:10px;justify-content:center;color:var(--text-muted);font-size:12.5px;margin-top:var(--sp-xl)"><span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Building reliability diagram…</div>`;
}

/* mobile */
const M_TABS = [{ id: 'overview', label: 'Model', icon: 'layout-dashboard' }, { id: 'drift', label: 'Drift', icon: 'activity' }, { id: 'calib', label: 'Calib', icon: 'scale' }, { id: 'fair', label: 'Fairness', icon: 'scale-3d' }];
function mHero(key) {
  const map = { well: ['green', 'shield-check', 'Well-calibrated', 'Curve hugs the 45° line. 0.8 means ~80%.'], under: ['amber', 'alert-triangle', 'Under-confident', 'Says 0.6 when truth is ~0.8.'], over: ['amber', 'alert-triangle', 'Over-confident', 'Says 0.95 when truth is ~0.85 — watch this.'], recal: ['red', 'alert-octagon', 'Recalibration recommended', 'ECE 0.092, over-confident in top bins.'] };
  const [tone, icn, t, d] = map[key];
  return `<div class="m-hero ${tone}"><div class="mh-ic">${ic(icn)}</div><div class="mh-main"><div class="mh-t">${t}</div><div class="mh-d">${d}</div></div></div>`;
}
function mKpis(key) {
  const s = STATE[key];
  return `<div class="m-kpis"><div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('scale')}</span><span class="mk-name">ECE</span></div><div class="mk-val sm">${s.ece.toFixed(3)}</div><div class="mk-foot">${s.tone === 'green' ? 'in target' : 'over target'}</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('trending-up')}</span><span class="mk-name">MCE</span></div><div class="mk-val sm">${s.mce.toFixed(3)}</div><div class="mk-foot">worst bin</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('layers')}</span><span class="mk-name">Sample</span></div><div class="mk-val sm">11.8k</div><div class="mk-foot">held-out</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('thermometer')}</span><span class="mk-name">Temp</span></div><div class="mk-val sm">${s.kind === 'recal' ? '1.00' : '1.32'}</div><div class="mk-foot">scaling</div></div></div>`;
}
function mBody(key) {
  const s = STATE[key];
  return `${mHero(key)}${mKpis(key)}${key === 'recal' ? `<div class="m-runbook red"><div class="mr-ic">${ic('book-open')}</div><div><div class="mr-t">What to do now</div><div class="mr-h">Apply temperature scaling</div><div class="mr-d">Fit a temperature, re-run, confirm the curve hugs the diagonal.</div><a class="mr-link">${ic('external-link')}Runbook</a></div></div>` : ''}${mSecHead('scale', 'Reliability', { opOnly: true })}<div class="m-card" style="padding:14px"><div style="display:flex;justify-content:center">${reliability(CURVES[s.kind], { kind: s.kind, w: 250, h: 250 })}</div><div class="histo-legend" style="justify-content:center"><span><span class="sw" style="background:var(--text-muted)"></span>Perfect</span><span><span class="sw" style="background:var(--${s.tone === 'green' ? 'green' : s.tone === 'red' ? 'red' : 'accent'})"></span>Model</span></div></div>${mSecHead('git-compare', 'Current vs candidate')}<div class="m-card"><div style="display:flex;align-items:center;gap:10px;padding:11px 13px;border-bottom:1px solid var(--border)"><span style="flex:1;font:600 12px var(--font-sans)">${ic('cpu')} v3.0</span><span class="conf-chip ${s.tone}">ECE ${s.ece.toFixed(3)}</span></div><div style="display:flex;align-items:center;gap:10px;padding:11px 13px"><span style="flex:1;font:600 12px var(--font-sans)">${ic('flask-conical')} v3.1-rc</span><span class="conf-chip green">ECE ${(s.ece * (key === 'recal' ? 0.4 : 0.7)).toFixed(3)}</span></div></div>`;
}
function mBodySkeleton() {
  const k = () => `<div class="m-kpi"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:40%;height:18px;margin:9px 0 5px"></div></div>`;
  return `<div class="m-kpis">${k()}${k()}${k()}${k()}</div><div class="m-card" style="padding:14px"><div class="skel" style="width:100%;height:230px;border-radius:8px"></div></div>`;
}

const app = (b, o = {}) => desktopApp(b, { nav: NAV, navExtra: NAV_EXTRA, navActive: 'calib', navLabel: 'Model monitoring', title: 'Calibration', user: USER, search: 'Search cohorts, versions…', ...o });
const phone = (b, o = {}) => mPhone(b, { tabs: M_TABS, active: 'calib', eyebrow: 'Research · read-only', title: 'Calibration', ...o });

const mast = masthead({
  eyebrow: 'Skin Lesion XAI · Clinical Premium · research',
  title: 'Calibration & reliability diagram',
  sub: 'Shows how well the model\u2019s predicted probability matches the empirical positive rate — a well-calibrated 0.8 should be right about 80% of the time. The reliability diagram plots the model curve against the 45° perfect-calibration line, alongside ECE/MCE headlines, the prediction-count histogram, per-cohort calibration, and a current-vs-candidate comparison. Simplest reliability convention; no decorative chart styles.',
  legend: ['Calibration state — color + icon + text', ['green', 'check-circle', 'Well-calibrated'], ['amber', 'arrow-up-right', 'Under-confident'], ['amber', 'arrow-down-right', 'Over-confident'], ['red', 'alert-octagon', 'Recalibrate']],
});

const desktop = sectionHead('A', 'Desktop — calibration view', '1440px · research console')
  + frame('01', 'Loading skeleton', 'KPI and diagram scaffolds paint immediately; the reliability curve and histogram pulse while the evaluation set is scored.', app(bodySkeleton()), { url: 'research.skinlesionxai.health/calibration' })
  + frame('02', 'Well-calibrated', 'The model curve hugs the 45° line; ECE is within target. A green hero confirms predicted probabilities are trustworthy.', app(body('well'), { envState: 'green' }), { url: 'research.skinlesionxai.health/calibration' })
  + frame('03', 'Under-confident', 'The curve sits above the diagonal — the model understates certainty. An amber hero suggests temperature scaling without alarm.', app(body('under'), { envState: 'amber', notif: 1 }), { url: 'research.skinlesionxai.health/calibration' })
  + frame('04', 'Over-confident', 'The curve sits below the diagonal — the medical-AI bias to watch most. The hero names the risk and the comparison shows the candidate fixing it.', app(body('over'), { envState: 'amber', notif: 1 }), { url: 'research.skinlesionxai.health/calibration' })
  + frame('05', 'Recalibration recommended', 'ECE past the limit with strong over-confidence; a red runbook routes to temperature scaling and the candidate (post-temperature) curve is dramatically tighter.', app(body('recal'), { envState: 'red', notif: 2 }), { url: 'research.skinlesionxai.health/calibration' });

const mobile = sectionHead('B', 'Mobile — calibration at a glance', '375px · bottom tabs · reliability card')
  + '<div class="frame-grid">'
  + mframe('M01', 'Loading skeleton', 'KPI tiles and the reliability card pulse while the set is scored.', phone(mBodySkeleton(), { active: 'calib' }))
  + mframe('M02', 'Well-calibrated', 'Green hero; the curve hugs the diagonal.', phone(mBody('well'), { active: 'calib' }))
  + mframe('M03', 'Over-confident', 'Amber hero; the curve dips below the line and the candidate is tighter.', phone(mBody('over'), { active: 'calib', envState: 'amber', notif: 1 }))
  + mframe('M04', 'Recalibration recommended', 'Red hero and runbook; pre- vs post-temperature ECE shown.', phone(mBody('recal'), { active: 'calib', envState: 'red', notif: 2 }))
  + '</div>';

mountShowcase([mast, desktop, mobile]);
