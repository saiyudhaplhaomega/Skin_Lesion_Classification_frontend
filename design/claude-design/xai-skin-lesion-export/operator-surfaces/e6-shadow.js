/* ============================================================================
   E.6 — Shadow deployment comparison (admin + research).
   The candidate model runs in shadow alongside production on the same inputs.
   This view compares their predictions WITHOUT affecting the patient response —
   the user always gets the production result. No PHI: cases are tokens, images
   are neutral placeholders. Loaded after kit.js.
   ============================================================================ */

const NAV = [
  { id: 'overview', label: 'Model overview', icon: 'layout-dashboard' },
  { id: 'perf', label: 'Performance', icon: 'gauge' },
  { id: 'drift', label: 'Drift', icon: 'activity' },
  { id: 'calib', label: 'Calibration', icon: 'scale' },
  { id: 'shadow', label: 'Shadow & canary', icon: 'split' },
  { id: 'fair', label: 'Fairness', icon: 'scale-3d' },
];
const NAV_EXTRA = [{ id: 'runbooks', label: 'Runbooks', icon: 'book-open' }, { id: 'datasets', label: 'Datasets', icon: 'database' }];
const USER = { initials: 'RK', name: 'R. Khoury', role: 'ML research · read-only on PHI' };

const BANDS = { benign: ['Benign-band', 'green'], monitor: ['Monitor-band', 'amber'], review: ['Review-band', 'blue'] };
function predChip(b, conf) { const [l, t] = BANDS[b]; return `<span class="conf-chip ${t}">${l} · ${conf}%</span>`; }

const ROWS = [
  { sev: 'green', ts: '09:17:41', tok: 'an_9Q3f', prod: ['benign', 82], shadow: ['benign', 84], agree: true },
  { sev: 'green', ts: '09:16:55', tok: 'an_2MX8', prod: ['monitor', 61], shadow: ['monitor', 58], agree: true },
  { sev: 'amber', ts: '09:15:12', tok: 'an_5RT1', prod: ['monitor', 55], shadow: ['review', 49], agree: false, note: 'band shift' },
  { sev: 'green', ts: '09:14:03', tok: 'an_7C0a', prod: ['benign', 90], shadow: ['benign', 88], agree: true },
  { sev: 'amber', ts: '09:12:47', tok: 'an_1ZB4', prod: ['benign', 74], shadow: ['monitor', 52], agree: false, note: 'band shift' },
];
const SEVERE = { sev: 'red', ts: '09:18:02', tok: 'an_B2ee', prod: ['review', 51], shadow: ['benign', 79], agree: false, note: 'review → benign' };

function kpis(kind) {
  const sev = kind === 'severe'; const elev = kind === 'elevated' || sev;
  const agree = sev ? 88.1 : elev ? 93.4 : 98.2;
  return `<div class="kpi-strip c4">
    <div class="kpi-tile lead"><span class="kt-l">${ic('equal')}Shadow agreement</span><span class="kt-v">${agree}<small>%</small></span><span class="kt-foot">${statline(sev ? 'red' : elev ? 'amber' : 'green', sev ? 'alert-octagon' : elev ? 'alert-triangle' : 'check-circle', sev ? 'below 90% gate' : elev ? 'watch' : 'gate passing')}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('move-horizontal')}Mean confidence Δ</span><span class="kt-v">${sev ? '+8.4' : elev ? '+3.1' : '+1.2'}<small>pts</small></span><span class="kt-foot">shadow vs production</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('shuffle')}Prediction shifts</span><span class="kt-v">${sev ? 412 : elev ? 168 : 41}</span><span class="kt-foot">band changes · 24h</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('clock')}Shadow running</span><span class="kt-v">${sev ? '18' : '72'}<small>h</small></span><span class="kt-foot">candidate v3.1-rc</span></div>
  </div>`;
}
function summary(kind) {
  if (kind === 'healthy') return stateHero('green', 'shield-check', 'Shadow running — healthy agreement', 'Candidate v3.1-rc agrees with production on 98.2% of inputs over 72h. Confidence deltas are small. If the gates hold, this candidate is ready to graduate to canary.', { meta: [['equal', '98.2% agree'], ['clock', '72h running']], ts: '09:18 UTC' });
  if (kind === 'elevated') return stateHero('amber', 'alert-triangle', 'Shadow running — elevated disagreement', 'Agreement has dipped to 93.4%, driven by benign↔monitor band shifts. Below the comfort line but above the abort gate. Inspect the disagreements before promoting.', { meta: [['equal', '93.4% agree'], ['shuffle', '168 shifts']], ts: '09:18 UTC' });
  if (kind === 'severe') return stateHero('red', 'alert-octagon', 'Severe disagreement — do not promote', 'Agreement fell to 88.1%, below the 90% gate, and the candidate is shifting some review-band cases to benign — the unsafe direction. Hold this candidate in shadow and investigate.', { meta: [['equal', '88.1% agree'], ['alert-triangle', 'review→benign shifts']], ts: '09:18 UTC' });
  if (kind === 'paused') return stateHero('neutral', 'pause', 'Shadow is paused', 'Shadow scoring is paused for candidate v3.1-rc; production is unaffected. Resume to continue collecting comparison data.', { meta: [['pause', 'paused 2h ago'], ['user', 'by R. Khoury']], ts: '09:18 UTC' });
  return stateHero('neutral', 'circle-off', 'No shadow deployment active', 'There is no candidate running in shadow right now. Deploy a candidate to begin comparing its predictions against production on live inputs.', { meta: [['circle-off', 'no candidate'], ['cpu', 'production only']], ts: '09:18 UTC' });
}

const thumb = `<span style="width:34px;height:34px;border-radius:6px;background:var(--ink-800);display:inline-grid;place-items:center;color:#3a4452;flex-shrink:0"><span class="app-icon"><i data-lucide="image"></i></span></span>`;
function row(r, sel) {
  const at = r.agree ? statline('green', 'equal', 'Agree') : statline(r.sev === 'red' ? 'red' : 'amber', 'git-compare', r.note || 'Shift');
  return `<tr class="clickable sev-row ${sel ? 'sel' : ''}">
    <td style="width:14px"><span class="sev-cell"><span class="sev-rail ${r.sev}"></span></span></td>
    <td class="mono">${r.ts}</td>
    <td><div class="acct"><span style="display:inline-flex;gap:9px;align-items:center">${thumb}<span class="tok">${r.tok}</span></span></div></td>
    <td>${predChip(r.prod[0], r.prod[1])}</td>
    <td>${predChip(r.shadow[0], r.shadow[1])}</td>
    <td class="num mono">${r.shadow[1] - r.prod[1] >= 0 ? '+' : ''}${r.shadow[1] - r.prod[1]}</td>
    <td>${at}</td>
    <td class="num"><div class="row-act"><button class="mini-btn">${ic('eye')}Diff</button></div></td>
  </tr>`;
}
function compareTable(rows, selTok) {
  return `<div class="opc">
    <div class="filters"><span class="f-search">${ic('search')}<input placeholder="Filter by case token, band…" /></span><span class="f-sel">${ic('git-compare')}<span class="fv">Disagreements only</span>${ic('chevron-down')}</span><span class="f-spacer"></span><span class="t-time">production result always served to patient</span></div>
    <table class="dtable"><thead><tr><th></th><th>Time</th><th>Case</th><th>Production (served)</th><th>Shadow (not served)</th><th class="num">Δconf</th><th>Agreement</th><th class="num">Diff</th></tr></thead>
    <tbody>${rows.map(r => row(r, r.tok === selTok)).join('')}</tbody></table>
    <div class="t-foot"><span class="tf-info">Shadow predictions are never returned to patients — the served result is always production.</span></div>
  </div>`;
}
function diffPanel(r) {
  return `<div class="detail-panel">
    <div class="dp-head"><div class="dp-ic red">${ic('git-compare')}</div><div class="dp-main"><div class="dp-t">Prediction disagreement</div><div class="dp-id">${r.tok} · ${r.ts} UTC</div></div><button class="dh-close">${ic('x')}</button></div>
    <div class="dp-body">
      <div class="notice red"><span class="app-icon"><i data-lucide="shield-alert"></i></span><div><div class="n-t">Unsafe direction</div><div class="n-d">The candidate moved a <b>review-band</b> case to <b>benign-band</b>. The patient was served the production (review) result; the shadow result was discarded.</div></div></div>
      <div class="grid-2c" style="gap:10px">
        <div><div class="dp-sec-lab">${ic('cpu')}Production · served</div><div style="aspect-ratio:1;background:var(--ink-900);border-radius:var(--radius-md);display:grid;place-items:center;color:#3a4452;position:relative"><span class="app-icon"><i data-lucide="layers"></i></span><span style="position:absolute;bottom:8px;left:8px;font:500 10px var(--font-mono);color:#9fd8b4">Grad-CAM A</span></div><div style="margin-top:7px">${predChip(r.prod[0], r.prod[1])}</div></div>
        <div><div class="dp-sec-lab">${ic('flask-conical')}Shadow · discarded</div><div style="aspect-ratio:1;background:var(--ink-900);border-radius:var(--radius-md);display:grid;place-items:center;color:#3a4452;position:relative"><span class="app-icon"><i data-lucide="layers"></i></span><span style="position:absolute;bottom:8px;left:8px;font:500 10px var(--font-mono);color:#e6b94d">Grad-CAM B</span></div><div style="margin-top:7px">${predChip(r.shadow[0], r.shadow[1])}</div></div>
      </div>
      <div><div class="dp-sec-lab">${ic('bar-chart-2')}Confidence delta histogram · 24h</div>${histogram([2, 5, 9, 14, 18, 12, 7, 4], [0, 0, 0, 0, 0, 0, 0, 0], { tone: 'red', h: 56 })}<div style="display:flex;justify-content:space-between;font:400 9.5px var(--font-mono);color:var(--text-muted);margin-top:5px"><span>-20</span><span>0</span><span>+20</span></div></div>
      ${runbook('red', 'Do not promote — investigate the review→benign shifts', 'The candidate is most aggressive exactly where it must be most cautious. Pull the disagreeing cases for expert review and re-train or recalibrate before considering canary.', 'Open shadow-eval runbook')}
    </div>
    <div class="dp-foot"><button class="btn btn-secondary">${ic('external-link')}Open case in eval set</button><button class="btn btn-secondary">${ic('flag')}Flag for review</button></div>
  </div>`;
}
function cohortBreakdown(kind) {
  const base = kind === 'severe' ? 11.9 : kind === 'elevated' ? 6.6 : 1.8;
  const rows = [['Skin-tone I–II', base * 0.7], ['Skin-tone III–IV', base * 0.9], ['Skin-tone V–VI', base * (kind === 'severe' ? 1.8 : 1.2)], ['Web upload', base * 0.8], ['Mobile capture', base * 1.3]];
  const t = (v) => v >= 10 ? 'red' : v >= 5 ? 'amber' : 'green';
  return `<div class="opc"><table class="dtable"><thead><tr><th>Cohort</th><th>Disagreement rate</th><th class="num">%</th></tr></thead><tbody>${rows.map(([c, v]) => `<tr><td>${c}</td><td style="width:55%"><div class="microbar"><i class="mb-${t(v)}" style="width:${Math.min(100, v / 20 * 100).toFixed(0)}%"></i></div></td><td class="num"><span class="conf-chip ${t(v)}">${v.toFixed(1)}%</span></td></tr>`).join('')}</tbody></table></div>`;
}

function body(kind) {
  if (kind === 'none' || kind === 'paused') {
    return `${summary(kind)}<div class="opc"><div class="state-box"><div class="sb-ic ${kind === 'paused' ? 'accent' : 'accent'}">${ic(kind === 'paused' ? 'pause' : 'split')}</div><h4>${kind === 'paused' ? 'Shadow scoring is paused' : 'No candidate is running in shadow'}</h4><p>${kind === 'paused' ? 'Production is serving patients normally. Resume shadow to keep collecting comparison data for v3.1-rc.' : 'Deploy a candidate model to start comparing its predictions against production on live inputs — with zero impact on the patient response.'}</p><div class="sb-act"><button class="btn btn-primary">${ic(kind === 'paused' ? 'play' : 'rocket')}${kind === 'paused' ? 'Resume shadow' : 'Deploy a candidate'}</button></div></div></div>${opsNote('<b>Shadow never reaches patients.</b> The served result is always production. No PHI: cases are tokens, images are neutral placeholders.')}`;
  }
  const rows = kind === 'severe' ? [SEVERE, ...ROWS] : ROWS;
  const showDiff = kind === 'severe';
  return `
  ${summary(kind)}
  ${kpis(kind)}
  ${kind === 'healthy' ? runbook('amber', 'Gates passing — graduate shadow to canary', 'Agreement, confidence delta and prediction-shift gates are all green over the required window. Promote v3.1-rc to a small canary slice and keep watching the same metrics.', 'Open promotion runbook') : ''}
  ${rsec('split', 'Prediction comparison', { meta: 'production (served) vs shadow (discarded)', opOnly: true })}
  ${showDiff ? `<div class="split">${compareTable(rows, SEVERE.tok)}${diffPanel(SEVERE)}</div>` : compareTable(rows, null)}
  ${rsec('users', 'Disagreement by cohort', { meta: 'skin-tone · source' })}
  ${cohortBreakdown(kind)}
  ${opsNote('<b>Shadow result is never returned to the patient under any condition.</b> The patient response always comes from production. This surface is read-only on patient data; cases are opaque tokens and images are neutral placeholders.')}`;
}
function bodySkeleton() {
  const t = () => `<div class="kpi-tile"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:40%;height:24px;margin:9px 0 6px"></div></div>`;
  const r = () => `<div class="skel-row"><div class="skel" style="width:4px;height:34px;border-radius:2px"></div><div class="skel" style="width:34px;height:34px;border-radius:6px"></div><div class="skel skel-line" style="width:110px"></div><div class="skel skel-line" style="width:110px"></div><div class="skel skel-line" style="width:60px"></div></div>`;
  return `<div class="kpi-strip c4">${t()}${t()}${t()}${t()}</div><div class="r-sec" style="margin-top:var(--sp-xl)"><div class="skel skel-line" style="width:150px;height:13px"></div><span class="r-rule"></span></div><div class="opc">${r()}${r()}${r()}${r()}</div><div style="display:flex;align-items:center;gap:10px;justify-content:center;color:var(--text-muted);font-size:12.5px;margin-top:var(--sp-xl)"><span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Loading shadow comparison…</div>`;
}

/* mobile */
const M_TABS = [{ id: 'overview', label: 'Model', icon: 'layout-dashboard' }, { id: 'shadow', label: 'Shadow', icon: 'split' }, { id: 'drift', label: 'Drift', icon: 'activity' }, { id: 'calib', label: 'Calib', icon: 'scale' }];
function mHero(kind) {
  const map = { healthy: ['green', 'shield-check', 'Healthy agreement', '98.2% over 72h — ready for canary.'], elevated: ['amber', 'alert-triangle', 'Elevated disagreement', '93.4% — inspect band shifts.'], severe: ['red', 'alert-octagon', 'Severe — do not promote', '88.1%; review→benign shifts.'], paused: ['neutral', 'pause', 'Shadow paused', 'Production unaffected.'], none: ['neutral', 'circle-off', 'No shadow active', 'Deploy a candidate to compare.'] };
  const [tone, icn, t, d] = map[kind];
  return `<div class="m-hero ${tone}"><div class="mh-ic">${ic(icn)}</div><div class="mh-main"><div class="mh-t">${t}</div><div class="mh-d">${d}</div></div></div>`;
}
function mKpis(kind) {
  const sev = kind === 'severe'; const elev = kind === 'elevated' || sev;
  return `<div class="m-kpis"><div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('equal')}</span><span class="mk-name">Agreement</span></div><div class="mk-val sm">${sev ? '88.1' : elev ? '93.4' : '98.2'}%</div><div class="mk-foot">${sev ? 'below gate' : 'vs prod'}</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('move-horizontal')}</span><span class="mk-name">Conf Δ</span></div><div class="mk-val sm">+${sev ? '8.4' : elev ? '3.1' : '1.2'}</div><div class="mk-foot">pts</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('shuffle')}</span><span class="mk-name">Shifts</span></div><div class="mk-val">${sev ? 412 : elev ? 168 : 41}</div><div class="mk-foot">24h</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('clock')}</span><span class="mk-name">Running</span></div><div class="mk-val">${sev ? 18 : 72}<span class="u">h</span></div><div class="mk-foot">v3.1-rc</div></div></div>`;
}
function mRow(r) {
  return `<div class="m-logrow"><span class="lr-rail ${r.sev}"></span><div class="lr-body"><div class="lr-top"><span class="lr-id">${r.tok}</span><span class="lr-time">${r.ts}</span></div>
  <div style="display:flex;gap:8px;align-items:center;margin-top:7px;flex-wrap:wrap"><span style="font:600 9px var(--font-sans);color:var(--text-muted);text-transform:uppercase">Prod</span>${predChip(r.prod[0], r.prod[1])}</div>
  <div style="display:flex;gap:8px;align-items:center;margin-top:5px;flex-wrap:wrap"><span style="font:600 9px var(--font-sans);color:var(--text-muted);text-transform:uppercase">Shadow</span>${predChip(r.shadow[0], r.shadow[1])}</div>
  <div class="lr-meta">${r.agree ? statline('green', 'equal', 'Agree') : statline(r.sev === 'red' ? 'red' : 'amber', 'git-compare', r.note || 'Shift')}</div></div></div>`;
}
function mBody(kind) {
  if (kind === 'none' || kind === 'paused') return `${mHero(kind)}<div class="m-card"><div class="state-box"><div class="sb-ic accent">${ic(kind === 'paused' ? 'pause' : 'split')}</div><h4>${kind === 'paused' ? 'Shadow paused' : 'No shadow active'}</h4><p>${kind === 'paused' ? 'Production unaffected. Resume to collect data.' : 'Deploy a candidate to compare on live inputs.'}</p></div></div>`;
  const rows = kind === 'severe' ? [SEVERE, ...ROWS] : ROWS;
  return `${mHero(kind)}${mKpis(kind)}${kind === 'severe' ? `<div class="m-runbook red"><div class="mr-ic">${ic('book-open')}</div><div><div class="mr-t">What to do now</div><div class="mr-h">Do not promote</div><div class="mr-d">Candidate shifts review-band cases to benign — the unsafe direction.</div><a class="mr-link">${ic('external-link')}Runbook</a></div></div>` : kind === 'healthy' ? `<div class="m-runbook amber"><div class="mr-ic">${ic('book-open')}</div><div><div class="mr-t">What to do now</div><div class="mr-h">Graduate to canary</div><div class="mr-d">All gates green over the window.</div></div></div>` : ''}${mSecHead('split', 'Comparison', { opOnly: true, more: 'disagree' })}<div style="font:600 10px var(--font-sans);letter-spacing:.3px;text-transform:uppercase;color:var(--text-muted);margin:-6px 2px 0">Patient is always served the production result</div><div class="m-card">${rows.slice(0, 4).map(mRow).join('')}</div>`;
}
function mBodySkeleton() {
  const k = () => `<div class="m-kpi"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:40%;height:18px;margin:9px 0 5px"></div></div>`;
  const r = () => `<div style="padding:12px 13px;border-bottom:1px solid var(--border);display:flex;gap:10px"><div class="skel" style="width:4px;height:50px;border-radius:2px"></div><div style="flex:1"><div class="skel skel-line" style="width:40%"></div><div class="skel skel-line" style="width:70%;margin-top:8px"></div></div></div>`;
  return `<div class="m-kpis">${k()}${k()}${k()}${k()}</div><div class="m-card">${r()}${r()}</div>`;
}

const app = (b, o = {}) => desktopApp(b, { nav: NAV, navExtra: NAV_EXTRA, navActive: 'shadow', navLabel: 'Model monitoring', title: 'Shadow deployment', user: USER, search: 'Search cases, cohorts…', ...o });
const phone = (b, o = {}) => mPhone(b, { tabs: M_TABS, active: 'shadow', eyebrow: 'Research · read-only', title: 'Shadow deploy', ...o });

const mast = masthead({
  eyebrow: 'Skin Lesion XAI · Clinical Premium · admin + research',
  title: 'Shadow deployment comparison',
  sub: 'The candidate model runs in shadow alongside production on the same inputs. This view compares their predictions without affecting the patient response — the served result is always production. It shows agreement rate, confidence deltas and prediction shifts, a per-case comparison with a Grad-CAM diff, and cohort breakdowns. The shadow result is never returned to a patient under any condition.',
  legend: ['Agreement — color + icon + text', ['green', 'equal', 'Agree'], ['amber', 'git-compare', 'Band shift'], ['red', 'alert-octagon', 'Unsafe shift'], ['neutral', 'circle-off', 'Shadow inactive']],
});

const desktop = sectionHead('A', 'Desktop — shadow deployment comparison', '1440px · research console')
  + frame('01', 'Loading skeleton', 'KPI and comparison-table scaffolds paint immediately; agreement and deltas pulse while the shadow stream is read.', app(bodySkeleton()), { url: 'research.skinlesionxai.health/shadow' })
  + frame('02', 'Shadow running — healthy agreement', '98.2% agreement over 72h with small deltas. A green hero and a runbook offer to graduate the candidate to canary.', app(body('healthy'), { envState: 'green' }), { url: 'research.skinlesionxai.health/shadow' })
  + frame('03', 'Elevated disagreement', 'Agreement dips to 93.4% on benign↔monitor shifts — below comfort but above the abort gate. An amber hero says inspect before promoting.', app(body('elevated'), { envState: 'amber', notif: 1 }), { url: 'research.skinlesionxai.health/shadow' })
  + frame('04', 'Severe disagreement — do not promote', 'Agreement falls below the 90% gate and the candidate shifts review-band cases to benign. The diff panel shows the unsafe direction and a hold runbook.', app(body('severe'), { envState: 'red', notif: 2 }), { url: 'research.skinlesionxai.health/shadow' })
  + frame('05', 'Shadow not deployed', 'No candidate is running in shadow; a clear call to action to deploy one, with production unaffected.', app(body('none'), { envState: 'neutral' }), { url: 'research.skinlesionxai.health/shadow' });

const mobile = sectionHead('B', 'Mobile — shadow at a glance', '375px · bottom tabs · comparison cards')
  + '<div class="frame-grid">'
  + mframe('M01', 'Loading skeleton', 'KPI tiles and comparison rows pulse while the stream is read.', phone(mBodySkeleton(), { active: 'shadow' }))
  + mframe('M02', 'Healthy agreement', 'Green hero; per-case cards show production vs shadow predictions with an "Agree" tag.', phone(mBody('healthy'), { active: 'shadow' }))
  + mframe('M03', 'Elevated disagreement', 'Amber hero; band-shift tags appear on disagreeing cases.', phone(mBody('elevated'), { active: 'shadow', envState: 'amber', notif: 1 }))
  + mframe('M04', 'Severe — do not promote', 'Red hero and hold runbook; the unsafe review→benign shift is pinned to the top.', phone(mBody('severe'), { active: 'shadow', envState: 'red', notif: 2 }))
  + mframe('M05', 'Shadow not deployed', 'A neutral empty state with a deploy CTA.', phone(mBody('none'), { active: 'shadow', envState: 'neutral' }))
  + '</div>';

mountShowcase([mast, desktop, mobile]);
