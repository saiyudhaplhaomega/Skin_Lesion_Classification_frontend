/* ============================================================================
   E.4 — Model drift dashboard (research + admin).
   Monitor whether production input/output distributions have drifted from the
   training distribution — the precursor to silent model failure. Honest
   histograms and trend lines only; no sci-fi data-river. No PHI: cohorts are
   buckets, never individuals. Loaded after kit.js.
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

/* feature drift fixtures: training vs production histograms + divergence */
const FEATURES = [
  { name: 'Image brightness', icon: 'sun', train: [2, 5, 11, 16, 14, 8, 3], prod: [2, 4, 10, 15, 14, 9, 4], psi: 0.04 },
  { name: 'Contrast', icon: 'contrast', train: [3, 7, 13, 15, 12, 7, 2], prod: [3, 6, 12, 15, 13, 8, 3], psi: 0.05 },
  { name: 'Skin-tone proxy', icon: 'palette', train: [4, 9, 14, 13, 9, 6, 4], prod: [3, 7, 12, 13, 11, 8, 6], psi: 0.07 },
  { name: 'Image resolution', icon: 'maximize', train: [1, 4, 9, 14, 16, 10, 5], prod: [1, 3, 8, 13, 16, 11, 7], psi: 0.06 },
  { name: 'EXIF camera count', icon: 'camera', train: [6, 12, 14, 10, 6, 4, 2], prod: [4, 9, 12, 11, 8, 6, 4], psi: 0.09 },
];
const FEATURES_ALERT = JSON.parse(JSON.stringify(FEATURES));
FEATURES_ALERT[2] = { name: 'Skin-tone proxy', icon: 'palette', train: [4, 9, 14, 13, 9, 6, 4], prod: [1, 3, 7, 11, 14, 13, 11], psi: 0.27 };
FEATURES_ALERT[4] = { name: 'EXIF camera count', icon: 'camera', train: [6, 12, 14, 10, 6, 4, 2], prod: [2, 5, 8, 11, 12, 11, 9], psi: 0.21 };
const FEATURES_EARLY = JSON.parse(JSON.stringify(FEATURES));
FEATURES_EARLY[4] = { name: 'EXIF camera count', icon: 'camera', train: [6, 12, 14, 10, 6, 4, 2], prod: [3, 7, 11, 11, 9, 8, 6], psi: 0.14 };

const psiTone = (v) => v >= 0.2 ? 'red' : v >= 0.1 ? 'amber' : 'green';

function kpis(kind) {
  const alert = kind === 'alert'; const early = kind === 'early';
  const inPsi = alert ? 0.24 : early ? 0.14 : 0.06;
  const outPsi = alert ? 0.18 : early ? 0.08 : 0.05;
  return `<div class="kpi-strip c4">
    <div class="kpi-tile lead"><span class="kt-l">${ic('image')}Input PSI vs training</span><span class="kt-v">${inPsi.toFixed(2)}</span><span class="kt-foot">${statline(psiTone(inPsi), psiTone(inPsi) === 'green' ? 'check-circle' : 'alert-triangle', psiTone(inPsi) === 'red' ? 'exceeds 0.20' : psiTone(inPsi) === 'amber' ? 'warning 0.10' : 'stable')}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('pie-chart')}Output PSI vs training</span><span class="kt-v">${outPsi.toFixed(2)}</span><span class="kt-foot">${statline(psiTone(outPsi), psiTone(outPsi) === 'green' ? 'check-circle' : 'alert-triangle', psiTone(outPsi) === 'green' ? 'class mix stable' : 'class mix shifting')}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('calendar-clock')}Days since retrain</span><span class="kt-v">${alert ? 63 : 28}</span><span class="kt-foot">${alert ? statline('amber', 'clock', 'overdue window') : 'within cadence'}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('siren')}Drift alarms · 30d</span><span class="kt-v">${alert ? 3 : early ? 1 : 0}</span><span class="kt-foot">${alert ? '2 input · 1 output' : early ? '1 input · warning' : 'none fired'}</span></div>
  </div>`;
}

function summary(kind) {
  if (kind === 'no-drift') return stateHero('green', 'shield-check', 'No drift — production looks like training', 'Input and output distributions are within reference bounds across every monitored feature. The model is seeing the kind of data it was trained on.', { meta: [['image', 'input PSI 0.06'], ['pie-chart', 'output PSI 0.05']], ts: '2026-06-06 09:00 UTC' });
  if (kind === 'early') return stateHero('amber', 'alert-triangle', 'Early signal — one feature above the warning threshold', 'EXIF camera-count distribution is drifting (PSI 0.14). It hasn\u2019t crossed the alert threshold, but a new device population may be arriving. Keep watching.', { meta: [['camera', 'EXIF PSI 0.14'], ['trending-up', 'warning band']], ts: '2026-06-06 09:00 UTC' });
  if (kind === 'alert') return stateHero('red', 'alert-octagon', 'Drift alert — skin-tone proxy distribution exceeded the limit', 'Production skin-tone proxy (PSI 0.27) and EXIF camera count (0.21) are past the alert threshold. Output class mix is also shifting. This is the precursor to silent failure — schedule retraining.', { meta: [['palette', 'skin-tone PSI 0.27'], ['camera', 'EXIF PSI 0.21']], ts: '2026-06-06 09:00 UTC' });
  return stateHero('neutral', 'hourglass', 'Not enough production data yet', 'Drift needs at least 7 days of production traffic to be meaningful. So far there are 2 days. Metrics below are shown greyed until the window fills.', { meta: [['calendar', '2 of 7 days'], ['database', 'collecting']], ts: '2026-06-06 09:00 UTC' });
}

function featCard(f) {
  const tone = psiTone(f.psi);
  return `<div class="feat-card ${tone !== 'green' ? 'warn' : ''}">
    <div class="fc-top"><span class="fc-name">${ic(f.icon)} ${f.name}</span><span class="fc-div conf-chip ${tone}">PSI ${f.psi.toFixed(2)}</span></div>
    ${histogram(f.train, f.prod, { tone: tone === 'green' ? 'accent' : tone })}
    <div class="histo-legend"><span><span class="sw" style="background:var(--neutral-border)"></span>Training</span><span><span class="sw" style="background:var(--${tone === 'green' ? 'accent' : tone})"></span>Production</span></div>
    <div class="fc-foot">${tone === 'red' ? 'exceeds 0.20 alert' : tone === 'amber' ? 'above 0.10 warning' : 'within reference'}</div>
  </div>`;
}
function featGrid(feats) { return `<div class="feat-grid">${feats.map(featCard).join('')}</div>`; }

function outputDrift(kind) {
  const eceTrain = [0.031, 0.033, 0.034, 0.036, 0.035, 0.038, kind === 'alert' ? 0.061 : kind === 'early' ? 0.045 : 0.037];
  const classProd = [{ tone: 'accent', data: [44, 45, 43, 46, 45, 47, kind === 'alert' ? 38 : 46] }, { tone: 'amber', dash: true, data: [44, 44, 44, 44, 44, 44, 44] }];
  return `<div class="grid-2c">
    <div class="chart-panel ${kind === 'alert' ? 'red' : ''}">
      <div class="cp-head"><span class="cp-t">${ic('pie-chart')}Predicted class mix over time</span><span class="cp-div conf-chip ${kind === 'alert' ? 'red' : 'green'}">${kind === 'alert' ? 'shifting' : 'stable'}</span></div>
      ${linechart(classProd, { band: null, tone: 'accent', xticks: ['7d', '5d', '3d', 'now'], h: 140 })}
      <div class="histo-legend"><span><span class="sw" style="background:var(--accent)"></span>% benign-band</span><span><span class="sw" style="background:var(--amber)"></span>training baseline</span></div>
    </div>
    <div class="chart-panel ${kind === 'alert' ? 'amber' : ''}">
      <div class="cp-head"><span class="cp-t">${ic('scale')}Calibration (ECE) over time</span><span class="cp-div conf-chip ${kind === 'alert' ? 'amber' : 'green'}">ECE ${eceTrain[6].toFixed(3)}</span></div>
      ${linechart([{ tone: kind === 'alert' ? 'amber' : 'accent', data: eceTrain }], { band: 0.05, bandLabel: 'ECE limit 0.05', tone: 'accent', xticks: ['7d', '5d', '3d', 'now'], h: 140 })}
      <div class="histo-legend"><span><span class="sw" style="background:var(--${kind === 'alert' ? 'amber' : 'accent'})"></span>Expected calibration error</span></div>
    </div>
  </div>`;
}

function cohortDrift(kind) {
  const rows = [
    ['Skin-tone I–II', kind === 'alert' ? 0.09 : 0.05], ['Skin-tone III–IV', kind === 'alert' ? 0.12 : 0.06], ['Skin-tone V–VI', kind === 'alert' ? 0.31 : 0.08],
    ['Web upload', 0.05], ['Mobile capture', kind === 'alert' ? 0.22 : 0.07], ['Age band 18–39', 0.06], ['Age band 40+', 0.08],
  ];
  return `<div class="opc"><table class="dtable"><thead><tr><th>Cohort</th><th>Input PSI</th><th class="num">Drift</th></tr></thead><tbody>
    ${rows.map(([c, v]) => `<tr><td>${c}</td><td style="width:55%"><div class="microbar"><i class="mb-${psiTone(v)}" style="width:${Math.min(100, v / 0.35 * 100).toFixed(0)}%"></i></div></td><td class="num"><span class="conf-chip ${psiTone(v)}">${v.toFixed(2)}</span></td></tr>`).join('')}
  </tbody></table></div>`;
}

function alarmHistory(kind) {
  const items = kind === 'alert' ? [
    ['red', 'alert-octagon', '2026-06-06 08:42 UTC', 'Skin-tone proxy PSI exceeded 0.20', 'threshold 0.20 · value 0.27', 'Retraining scheduled'],
    ['red', 'alert-octagon', '2026-06-05 22:10 UTC', 'EXIF camera count PSI exceeded 0.20', 'threshold 0.20 · value 0.21', 'Data team notified'],
    ['amber', 'alert-triangle', '2026-06-04 14:03 UTC', 'Output class mix warning', 'threshold 0.10 · value 0.12', 'Watch — no action'],
  ] : kind === 'early' ? [
    ['amber', 'alert-triangle', '2026-06-06 07:31 UTC', 'EXIF camera count entered warning band', 'threshold 0.10 · value 0.14', 'Watch — no action yet'],
  ] : [];
  if (!items.length) return `<div class="opc"><div class="state-box"><div class="sb-ic green">${ic('check-circle')}</div><h4>No drift alarms in the last 30 days</h4><p>Input and output distributions have stayed within reference bounds for the full window.</p></div></div>`;
  return `<div class="opc">${items.map(([tone, icn, ts, title, sub, action]) => `<div class="m-audit" style="padding:13px var(--sp-md)"><div class="ma-rail"><div class="ma-ic ${tone}">${ic(icn)}</div></div><div class="ma-body"><div class="ma-l1"><span class="ma-action">${title}</span><span class="ma-time">${ts}</span></div><div class="ma-target">${sub}</div><div class="ma-actor"><span class="statline neutral">${ic('arrow-right')}${action}</span></div></div></div>`).join('')}</div>`;
}

function body(kind) {
  const feats = kind === 'alert' ? FEATURES_ALERT : kind === 'early' ? FEATURES_EARLY : FEATURES;
  const grey = kind === 'no-data' ? 'style="opacity:.5;pointer-events:none;filter:grayscale(.5)"' : '';
  return `
  ${summary(kind)}
  ${kpis(kind === 'no-data' ? 'no-drift' : kind)}
  ${kind === 'alert' ? runbook('red', 'Schedule retraining and freeze training-data eligibility', 'Skin-tone proxy and mobile-capture cohorts are drifting hardest. Pull a fresh labelled sample weighted to the new population, then retrain and recalibrate before promoting.', 'Open retraining runbook') : kind === 'early' ? runbook('amber', 'Keep watching EXIF camera count', 'One feature is in the warning band. No action required yet — confirm whether a new device population is arriving before reacting.') : ''}
  ${rsec('image', 'Input feature drift', { meta: 'training vs production · PSI', opOnly: true })}
  <div ${grey}>${featGrid(feats)}</div>
  ${rsec('pie-chart', 'Output drift', { meta: 'class mix · calibration trend' })}
  <div ${grey}>${outputDrift(kind === 'no-data' ? 'no-drift' : kind)}</div>
  ${rsec('users', 'Cohort drift', { meta: 'by skin-tone · source · age band' })}
  <div ${grey}>${cohortDrift(kind === 'no-data' ? 'no-drift' : kind)}</div>
  ${rsec('siren', 'Alarm history', { meta: 'last 30 days' })}
  ${alarmHistory(kind === 'no-data' ? 'no-drift' : kind)}
  ${opsNote('<b>Research surface — read-only on patient data.</b> Cohorts are aggregate buckets (skin-tone band, upload source, age band) — never individuals. No PHI, no images, no identifiers. Drift is informational; retraining is a human decision.')}`;
}
function bodySkeleton() {
  const fc = () => `<div class="feat-card"><div class="fc-top"><div class="skel skel-line" style="width:55%"></div><div class="skel skel-line" style="width:60px"></div></div><div class="skel" style="width:100%;height:64px;margin-top:8px;border-radius:6px"></div></div>`;
  const t = () => `<div class="kpi-tile"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:40%;height:24px;margin:9px 0 6px"></div></div>`;
  return `<div class="kpi-strip c4">${t()}${t()}${t()}${t()}</div><div class="r-sec" style="margin-top:var(--sp-xl)"><div class="skel skel-line" style="width:150px;height:13px"></div><span class="r-rule"></span></div><div class="feat-grid">${fc()}${fc()}${fc()}</div><div style="display:flex;align-items:center;gap:10px;justify-content:center;color:var(--text-muted);font-size:12.5px;margin-top:var(--sp-xl)"><span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Computing drift over the production window…</div>`;
}

/* mobile */
const M_TABS = [{ id: 'overview', label: 'Model', icon: 'layout-dashboard' }, { id: 'drift', label: 'Drift', icon: 'activity' }, { id: 'calib', label: 'Calib', icon: 'scale' }, { id: 'fair', label: 'Fairness', icon: 'scale-3d' }];
function mHero(kind) {
  if (kind === 'no-drift') return `<div class="m-hero green"><div class="mh-ic">${ic('shield-check')}</div><div class="mh-main"><div class="mh-t">No drift</div><div class="mh-d">Production looks like training. Input PSI 0.06.</div></div></div>`;
  if (kind === 'early') return `<div class="m-hero amber"><div class="mh-ic">${ic('alert-triangle')}</div><div class="mh-main"><div class="mh-t">Early signal</div><div class="mh-d">EXIF camera count PSI <b>0.14</b> — warning band.</div></div></div>`;
  if (kind === 'alert') return `<div class="m-hero red"><div class="mh-ic">${ic('alert-octagon')}</div><div class="mh-main"><div class="mh-t">Drift alert</div><div class="mh-d">Skin-tone proxy PSI <b>0.27</b>. Schedule retraining.</div></div></div>`;
  return `<div class="m-hero neutral"><div class="mh-ic">${ic('hourglass')}</div><div class="mh-main"><div class="mh-t">Not enough data</div><div class="mh-d">2 of 7 days collected.</div></div></div>`;
}
function mKpis(kind) {
  const alert = kind === 'alert'; const early = kind === 'early';
  const inPsi = alert ? 0.24 : early ? 0.14 : 0.06;
  return `<div class="m-kpis"><div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('image')}</span><span class="mk-name">Input PSI</span></div><div class="mk-val sm">${inPsi.toFixed(2)}</div><div class="mk-foot">${psiTone(inPsi) === 'green' ? 'stable' : 'shifting'}</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('pie-chart')}</span><span class="mk-name">Output PSI</span></div><div class="mk-val sm">${(alert ? 0.18 : 0.05).toFixed(2)}</div><div class="mk-foot">class mix</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('calendar-clock')}</span><span class="mk-name">Since retrain</span></div><div class="mk-val">${alert ? 63 : 28}<span class="u">d</span></div><div class="mk-foot">cadence</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('siren')}</span><span class="mk-name">Alarms 30d</span></div><div class="mk-val">${alert ? 3 : early ? 1 : 0}</div><div class="mk-foot">fired</div></div></div>`;
}
function mFeat(f) {
  const tone = psiTone(f.psi);
  return `<div style="padding:13px;border-bottom:1px solid var(--border)"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:9px"><span style="font:600 12.5px var(--font-sans)">${ic(f.icon)} ${f.name}</span><span class="conf-chip ${tone}">PSI ${f.psi.toFixed(2)}</span></div>${histogram(f.train, f.prod, { tone: tone === 'green' ? 'accent' : tone, h: 48 })}</div>`;
}
function mBody(kind) {
  const feats = kind === 'alert' ? FEATURES_ALERT : kind === 'early' ? FEATURES_EARLY : FEATURES;
  return `${mHero(kind)}${mKpis(kind === 'no-data' ? 'no-drift' : kind)}${kind === 'alert' ? `<div class="m-runbook red"><div class="mr-ic">${ic('book-open')}</div><div><div class="mr-t">What to do now</div><div class="mr-h">Schedule retraining</div><div class="mr-d">Skin-tone & mobile cohorts drift hardest. Pull a fresh weighted sample.</div><a class="mr-link">${ic('external-link')}Runbook</a></div></div>` : ''}${mSecHead('image', 'Input drift', { opOnly: true, more: '5 features' })}<div class="m-card">${feats.slice(0, 3).map(mFeat).join('')}</div>${mSecHead('users', 'Cohort drift')}<div class="m-card" style="padding:6px 0">${cohortDriftMobile(kind === 'no-data' ? 'no-drift' : kind)}</div>`;
}
function cohortDriftMobile(kind) {
  const rows = [['Skin-tone V–VI', kind === 'alert' ? 0.31 : 0.08], ['Mobile capture', kind === 'alert' ? 0.22 : 0.07], ['Web upload', 0.05]];
  return rows.map(([c, v]) => `<div style="display:flex;align-items:center;gap:10px;padding:9px 13px"><span style="flex:1;font:500 12px var(--font-sans)">${c}</span><div class="microbar" style="width:80px"><i class="mb-${psiTone(v)}" style="width:${Math.min(100, v / 0.35 * 100).toFixed(0)}%"></i></div><span class="conf-chip ${psiTone(v)}">${v.toFixed(2)}</span></div>`).join('');
}
function mBodySkeleton() {
  const k = () => `<div class="m-kpi"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:40%;height:18px;margin:9px 0 5px"></div></div>`;
  const f = () => `<div style="padding:13px;border-bottom:1px solid var(--border)"><div class="skel skel-line" style="width:50%"></div><div class="skel" style="width:100%;height:48px;margin-top:9px;border-radius:6px"></div></div>`;
  return `<div class="m-kpis">${k()}${k()}${k()}${k()}</div><div class="m-card">${f()}${f()}</div>`;
}

const app = (b, o = {}) => desktopApp(b, { nav: NAV, navExtra: NAV_EXTRA, navActive: 'drift', navLabel: 'Model monitoring', title: 'Model drift', user: USER, search: 'Search features, cohorts, alarms…', ...o });
const phone = (b, o = {}) => mPhone(b, { tabs: M_TABS, active: 'drift', eyebrow: 'Research · read-only', title: 'Model drift', ...o });

const mast = masthead({
  eyebrow: 'Skin Lesion XAI · Clinical Premium · research + admin',
  title: 'Model drift dashboard',
  sub: 'Monitors whether the production input and output distributions have drifted from the training distribution — the precursor to silent model failure. Shows per-feature training-vs-production histograms with PSI, output class-mix and calibration trends, cohort breakdowns, and an alarm history. Honest histograms and trend lines only. Read-only on patient data; cohorts are aggregate buckets, never individuals.',
  legend: ['Drift state — color + icon + text', ['green', 'check-circle', 'Stable (PSI < 0.10)'], ['amber', 'alert-triangle', 'Warning (0.10–0.20)'], ['red', 'alert-octagon', 'Alert (PSI > 0.20)'], ['neutral', 'hourglass', 'Not enough data']],
});

const desktop = sectionHead('A', 'Desktop — model drift dashboard', '1440px · research console')
  + frame('01', 'Loading skeleton', 'KPI and feature-panel scaffolds paint immediately; histograms and trend lines pulse while the production window is recomputed.', app(bodySkeleton()), { url: 'research.skinlesionxai.health/drift' })
  + frame('02', 'No drift — production matches training', 'A calm green hero, low PSI across every feature, stable class mix and a clear alarm history.', app(body('no-drift'), { envState: 'green' }), { url: 'research.skinlesionxai.health/drift' })
  + frame('03', 'Early signal — one feature in warning', 'EXIF camera count enters the warning band. The amber hero and a measured runbook say "keep watching" rather than acting prematurely.', app(body('early'), { envState: 'amber', notif: 1 }), { url: 'research.skinlesionxai.health/drift' })
  + frame('04', 'Drift alert — retraining recommended', 'Skin-tone proxy and EXIF camera count exceed the alert threshold; output class mix shifts and the cohort table flags skin-tone V–VI and mobile capture. The runbook routes to retraining.', app(body('alert'), { envState: 'red', notif: 2 }), { url: 'research.skinlesionxai.health/drift' })
  + frame('05', 'Not enough data', 'With only 2 of 7 days of production traffic, drift is not yet meaningful — panels are greyed and the hero explains why.', app(body('no-data'), { envState: 'neutral' }), { url: 'research.skinlesionxai.health/drift' });

const mobile = sectionHead('B', 'Mobile — drift at a glance', '375px · bottom tabs · histogram cards')
  + '<div class="frame-grid">'
  + mframe('M01', 'Loading skeleton', 'KPI tiles and feature histograms pulse while the window recomputes.', phone(mBodySkeleton(), { active: 'drift' }))
  + mframe('M02', 'No drift', 'Green hero, low PSI, stable cohorts.', phone(mBody('no-drift'), { active: 'drift' }))
  + mframe('M03', 'Early signal', 'EXIF camera count in the warning band; histograms show the small shift.', phone(mBody('early'), { active: 'drift', envState: 'amber', notif: 1 }))
  + mframe('M04', 'Drift alert', 'Red hero and runbook; skin-tone V–VI cohort flagged in the table.', phone(mBody('alert'), { active: 'drift', envState: 'red', notif: 2 }))
  + mframe('M05', 'Not enough data', 'Neutral hero explaining the 7-day minimum.', phone(mBody('no-data'), { active: 'drift', envState: 'neutral' }))
  + '</div>';

mountShowcase([mast, desktop, mobile]);
