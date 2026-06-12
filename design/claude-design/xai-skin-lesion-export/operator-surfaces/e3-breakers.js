/* ============================================================================
   E.3 — Circuit breakers & degraded-mode banner.
   Two audiences: patients see a calm degraded banner (never technical, amber
   unless the whole prediction flow is down); operators see the circuit board
   with per-dependency state, failure rate, and force-open/close actions.
   Circuit names (gradcam, llm-*) are NEVER exposed to patients. Loaded after kit.js.
   ============================================================================ */

const NAV = [
  { id: 'overview', label: 'Reliability overview', icon: 'layout-dashboard' },
  { id: 'dlq', label: 'Dead-letter queues', icon: 'inbox' },
  { id: 'idem', label: 'Idempotency keys', icon: 'key-round' },
  { id: 'breakers', label: 'Circuit breakers', icon: 'git-fork' },
  { id: 'flags', label: 'Feature flags', icon: 'toggle-right' },
  { id: 'slo', label: 'SLO & budgets', icon: 'target' },
];
const NAV_EXTRA = [{ id: 'runbooks', label: 'Runbooks', icon: 'book-open' }, { id: 'access', label: 'Access & roles', icon: 'shield' }];
const USER = { initials: 'PA', name: 'P. Adeyemi', role: 'Platform reliability · operator' };

/* circuits: [id, name, dependency, patientFacing] */
const CIRCUITS = [
  ['inference', 'Model inference', 'SageMaker endpoint · skin-lesion-v3', true],
  ['gradcam', 'Grad-CAM explanation', 'gradcam-worker · GPU pool', true],
  ['llm-clinical', 'Clinical XAI agent', 'Bedrock · structured-explain', false],
  ['llm-customer', 'Patient education agent', 'Bedrock · education-rag', false],
  ['llm-doctor', 'Doctor workflow agent', 'Bedrock · case-scoped', false],
  ['llm-admin-market', 'Market research agent', 'Bedrock · golden-docs-rag', false],
  ['ocr', 'Lab OCR', 'Textract · async', false],
];

/* per-kind circuit states: map id -> [state, fail60s, since, trend] */
function circuitStates(kind) {
  const base = {};
  CIRCUITS.forEach(([id]) => base[id] = ['closed', '0.2%', '4h 12m', [1, 1, 0, 1, 1, 0, 1]]);
  if (kind === 'half-open') base['gradcam'] = ['half', '3.1%', '40s', [6, 8, 9, 7, 5, 4, 3]];
  if (kind === 'one-open') base['gradcam'] = ['open', '11.4%', '2m 18s', [4, 7, 9, 12, 14, 13, 15]];
  if (kind === 'inference-open') { base['inference'] = ['open', '24.0%', '55s', [6, 9, 14, 19, 22, 24, 24]]; base['gradcam'] = ['open', '18%', '1m 40s', [8, 11, 15, 17, 18, 18, 18]]; }
  if (kind === 'multi-open') { base['gradcam'] = ['open', '15%', '6m', [9, 12, 14, 15, 15, 15, 15]]; base['llm-customer'] = ['open', '9%', '3m', [4, 6, 8, 9, 9, 9, 9]]; base['ocr'] = ['half', '5%', '90s', [7, 6, 5, 5, 4, 5, 5]]; }
  return base;
}
const stateMap = { closed: ['green', 'circle-check', 'Closed'], half: ['amber', 'circle-dot', 'Half-open'], open: ['red', 'circle-x', 'Open'] };

function patientBanner(kind) {
  const red = kind === 'inference-open' || kind === 'multi-open';
  return `<div class="pt-banner ${red ? 'red' : 'amber'}">
    <div class="ptb-ic">${ic(red ? 'alert-octagon' : 'info')}</div>
    <div class="ptb-main">
      <div class="ptb-t">${red ? 'Analysis is running slower than usual' : 'Some explanations are temporarily unavailable'}</div>
      <div class="ptb-d">${red
        ? 'We\u2019re working to restore full analysis. You can still upload images and they\u2019ll be saved \u2014 your results may take a little longer to appear.'
        : 'Your upload and prediction still work. Detailed model explanations will return shortly.'}</div>
      <a class="ptb-link">${ic('external-link')}What is affected</a>
    </div>
  </div>`;
}
function patientFrame(kind) {
  const red = kind === 'inference-open' || kind === 'multi-open';
  return `<div class="pt-shell">
    <div class="pt-topbar"><div class="pt-mark"><div class="pt-reticle"></div></div><div class="pt-wm">Skin Lesion <b>XAI</b></div><span style="margin-left:auto" class="statline ${red ? 'amber' : 'neutral'}">${ic(red ? 'clock' : 'check-circle')}${red ? 'Slower than usual' : 'Service normal'}</span></div>
    ${patientBanner(kind)}
    <div class="pt-body">
      <div class="pt-resultcard">
        <div class="pt-stage">
          <div class="pt-ph">${ic('image')}Your lesion image</div>
          <div class="pt-exploff">${ic('layers')}${red ? 'Prediction will appear once analysis catches up' : 'Explanation heatmap will appear shortly'}</div>
        </div>
        <div class="pt-band">
          ${red
            ? `<div class="band amber"><div class="bt">${ic('clock')}Analysis in progress</div><div class="bd">Your image has been saved. We\u2019ll notify you when your educational results are ready.</div></div>`
            : `<div class="band green"><div class="bt">${ic('check-circle')}Prediction ready</div><div class="bd">Your educational prediction is available. The detailed explanation heatmap will load as soon as that service is back.</div></div>`}
        </div>
      </div>
      <div class="disclaimer"><span class="app-icon"><i data-lucide="shield-check"></i></span><p><strong>This platform is not a medical diagnosis tool.</strong> It provides educational AI-supported information and helps organize lesion history for professional review.</p></div>
    </div>
  </div>`;
}

/* operator circuit board */
function circuitBoard(kind, selId) {
  const states = circuitStates(kind);
  const legend = `<span class="bh-legend">
    <span class="lg"><span class="dot" style="background:var(--green)"></span>Closed — traffic flowing</span>
    <span class="lg"><span class="dot" style="background:var(--amber)"></span>Half-open — probing</span>
    <span class="lg"><span class="dot" style="background:var(--red)"></span>Open — failing fast</span>
  </span>`;
  const rows = CIRCUITS.map(([id, name, dep, pf]) => {
    const [st, fail, since, trend] = states[id];
    const [tone, icn, lab] = stateMap[st];
    const sel = id === selId;
    return `<div class="breaker-row clickable ${sel ? 'sel' : ''}">
      <div><div class="br-name">${name}${pf ? '' : ` <span class="op-only" style="margin-left:4px">${ic('eye-off')}internal name</span>`}</div><div class="br-sub">${dep}</div></div>
      <div class="br-state"><span class="br-led ${st}"></span>${statline(tone, icn, lab)}</div>
      <div class="br-fail"><span class="bf-v">${fail}</span>${sparkline(trend, { tone, w: 72, h: 24, area: false })}<span class="br-sub" style="margin:0">60s · since ${since}</span></div>
      <div class="br-act"><button class="mini-btn ${st === 'open' ? 'green' : 'ghost'}">${ic(st === 'open' ? 'play' : 'settings-2')}${st === 'open' ? 'Force close…' : 'Manage'}</button></div>
    </div>`;
  }).join('');
  return `<div class="breaker-wrap"><div class="breaker-head"><span class="bh-t">${ic('git-fork')}Circuit board · 7 dependencies</span>${legend}</div>${rows}</div>`;
}

function circuitDetail(kind) {
  return `<div class="detail-panel">
    <div class="dp-head"><div class="dp-ic red">${ic('git-fork')}</div><div class="dp-main"><div class="dp-t">Grad-CAM explanation</div><div class="dp-id">gradcam-worker · GPU pool</div></div><button class="dh-close">${ic('x')}</button></div>
    <div class="dp-body">
      <div><div class="dp-sec-lab">${ic('info')}State</div>
        <div class="dp-row"><span class="dl">Current state</span><span class="dv">${statline('red', 'circle-x', 'Open')}</span></div>
        <div class="dp-row"><span class="dl">Failure rate · 60s</span><span class="dv mono">11.4%</span></div>
        <div class="dp-row"><span class="dl">Threshold</span><span class="dv mono">> 8% over 60s</span></div>
        <div class="dp-row"><span class="dl">Opened</span><span class="dv">2m 18s ago</span></div>
        <div class="dp-row"><span class="dl">Half-open probe in</span><span class="dv mono">42s</span></div>
      </div>
      <div><div class="dp-sec-lab">${ic('bar-chart-2')}Error class breakdown · 60s</div>
        <div class="errbar"><span class="eb-l">GpuOutOfMemory</span><div class="eb-track"><i style="width:62%"></i></div><span class="eb-v">62%</span></div>
        <div class="errbar"><span class="eb-l">WorkerTimeout</span><div class="eb-track"><i style="width:28%"></i></div><span class="eb-v">28%</span></div>
        <div class="errbar"><span class="eb-l">QueueRejected</span><div class="eb-track"><i style="width:10%"></i></div><span class="eb-v">10%</span></div>
      </div>
      <div class="notice neutral"><span class="app-icon"><i data-lucide="users"></i></span><div><div class="n-t">Patient impact</div><div class="n-d">Predictions are <b>unaffected</b> — only the explanation heatmap is degraded. Patients see a calm amber banner; the word "gradcam" is never shown to them.</div></div></div>
      ${runbook('red', 'Drain the GPU pool, then let the breaker self-heal', 'GPU OOM dominates. Scale the gradcam worker pool or shed heatmap load. The breaker will probe half-open in 42s; avoid force-closing until the pool has headroom.', 'Open gradcam runbook')}
    </div>
    <div class="dp-foot"><button class="btn btn-secondary">${ic('git-fork')}Force open</button><button class="btn btn-primary">${ic('play')}Force close…</button></div>
  </div>`;
}

function opSummary(kind) {
  if (kind === 'all-green') return stateHero('green', 'shield-check', 'All circuits closed — every dependency healthy', 'Inference, Grad-CAM, the four scoped agents, and OCR are all flowing normally. Failure rates are well below thresholds.', { meta: [['git-fork', '7/7 closed'], ['activity', 'max 0.3% fail']], ts: '09:18 UTC' });
  if (kind === 'half-open') return stateHero('amber', 'circle-dot', 'Grad-CAM is half-open — probing recovery', 'The Grad-CAM breaker tripped briefly and is now sending probe traffic. No patient banner yet; predictions are unaffected. It will close automatically if probes succeed.', { meta: [['git-fork', '1 half-open'], ['timer', 'probe in progress']], ts: '09:18 UTC' });
  if (kind === 'one-open') return stateHero('amber', 'alert-triangle', 'Grad-CAM circuit is open — explanations degraded', 'Heatmap explanations are failing fast and a calm amber banner is showing to patients. <b>Predictions still work.</b> The circuit name is never exposed to patients.', { meta: [['git-fork', '1 open'], ['percent', '11.4% fail']], ts: '09:18 UTC' });
  if (kind === 'inference-open') return stateHero('red', 'alert-octagon', 'Inference circuit is open — prediction flow degraded', 'Model inference itself is failing fast. Patients see a red banner saying analysis is slower than usual; uploads are still saved. This is the one case where the patient banner goes red.', { meta: [['git-fork', '2 open'], ['percent', '24% fail']], ts: '09:18 UTC' });
  return stateHero('red', 'alert-octagon', 'Multiple circuits open — page-level incident', 'Grad-CAM and the patient education agent are open and OCR is half-open. A page-level red banner is active for patients on affected features. Predictions continue from production.', { meta: [['git-fork', '2 open · 1 half'], ['siren', 'incident opened']], ts: '09:18 UTC' });
}

function body(kind, { detail = false } = {}) {
  const showRunbook = kind === 'one-open' || kind === 'inference-open' || kind === 'multi-open';
  const board = detail
    ? `<div class="split">${circuitBoard(kind, 'gradcam')}${circuitDetail(kind)}</div>`
    : circuitBoard(kind);
  return `
  ${opSummary(kind)}
  ${rsec('git-fork', 'Circuit board', { meta: 'state · failure rate · time since change', opOnly: true })}
  ${board}
  ${rsec('smartphone', 'Patient-facing banner', { meta: 'what patients see right now' })}
  <div class="device-desktop" style="box-shadow:none;border-radius:var(--radius-lg)"><div class="device-viewport">${patientFrame(kind)}</div></div>
  ${showRunbook && !detail ? runbook(kind === 'one-open' ? 'amber' : 'red', kind === 'inference-open' ? 'Stabilise inference first — explanations can wait' : kind === 'multi-open' ? 'Treat as a page-level incident' : 'Let Grad-CAM self-heal; watch the probe', kind === 'inference-open' ? 'The prediction flow is the priority. Check the SageMaker endpoint health and capacity; the heatmap circuit can stay open meanwhile.' : kind === 'multi-open' ? 'Two circuits are open and one is probing. The incident is already open. Work inference-adjacent dependencies first, then restore explanations.' : 'Grad-CAM is failing fast but predictions are fine. Open the circuit to inspect the error breakdown before any manual action.') : ''}
  ${opsNote('<b>Two audiences.</b> Operators see dependency names, failure rates and force actions. Patients never see circuit names like "gradcam" — only a calm, plain-language banner. No PHI on either surface.')}`;
}
function bodySkeleton() {
  const r = () => `<div class="skel-row" style="grid-template-columns:1.4fr 1fr 1.4fr auto"><div style="flex:1"><div class="skel skel-line" style="width:50%"></div><div class="skel skel-line" style="width:70%;margin-top:7px"></div></div><div class="skel skel-line" style="width:90px"></div><div class="skel skel-line" style="width:120px"></div><div class="skel" style="width:80px;height:30px;border-radius:6px"></div></div>`;
  return `<div class="kpi-strip c3"><div class="kpi-tile"><div class="skel skel-line" style="width:60%"></div><div class="skel" style="width:40%;height:24px;margin:9px 0 6px"></div></div><div class="kpi-tile"><div class="skel skel-line" style="width:60%"></div><div class="skel" style="width:40%;height:24px;margin:9px 0 6px"></div></div><div class="kpi-tile"><div class="skel skel-line" style="width:60%"></div><div class="skel" style="width:40%;height:24px;margin:9px 0 6px"></div></div></div>
  <div class="r-sec" style="margin-top:var(--sp-xl)"><div class="skel skel-line" style="width:120px;height:13px"></div><span class="r-rule"></span></div>
  <div class="breaker-wrap">${r()}${r()}${r()}${r()}</div>
  <div style="display:flex;align-items:center;gap:10px;justify-content:center;color:var(--text-muted);font-size:12.5px;margin-top:var(--sp-xl)"><span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Loading circuit states…</div>`;
}

/* mobile */
const M_TABS = [{ id: 'overview', label: 'Overview', icon: 'layout-dashboard' }, { id: 'breakers', label: 'Breakers', icon: 'git-fork' }, { id: 'dlq', label: 'DLQ', icon: 'inbox' }, { id: 'slo', label: 'SLO', icon: 'target' }];
function mBreaker(id, name, dep, pf, st, fail, since) {
  const [tone, icn, lab] = stateMap[st];
  return `<div class="m-breaker"><div class="mb-top"><span class="mb-led ${tone === 'green' ? '' : ''}" style="background:var(--${tone === 'green' ? 'green' : tone === 'amber' ? 'amber' : 'red'})"></span><span class="mb-name">${name}</span>${statline(tone, icn, lab)}</div><div class="mb-row2"><span class="mb-meta">${dep}</span><span class="mb-meta">${fail} · ${since}</span></div></div>`;
}
function mBoard(kind) {
  const states = circuitStates(kind);
  return `<div class="m-card">${CIRCUITS.map(([id, name, dep, pf]) => { const [st, fail, since] = states[id]; return mBreaker(id, name, dep, pf, st, fail, since); }).join('')}</div>`;
}
function mHero(kind) {
  const s = opSummary(kind); // reuse tone/text via simple map
  if (kind === 'all-green') return `<div class="m-hero green"><div class="mh-ic">${ic('shield-check')}</div><div class="mh-main"><div class="mh-t">All circuits closed</div><div class="mh-d">7/7 dependencies healthy.</div></div></div>`;
  if (kind === 'half-open') return `<div class="m-hero amber"><div class="mh-ic">${ic('circle-dot')}</div><div class="mh-main"><div class="mh-t">Grad-CAM half-open</div><div class="mh-d">Probing recovery. Predictions unaffected.</div></div></div>`;
  if (kind === 'one-open') return `<div class="m-hero amber"><div class="mh-ic">${ic('alert-triangle')}</div><div class="mh-main"><div class="mh-t">Grad-CAM open</div><div class="mh-d">Explanations degraded; <b>predictions still work</b>.</div></div></div>`;
  if (kind === 'inference-open') return `<div class="m-hero red"><div class="mh-ic">${ic('alert-octagon')}</div><div class="mh-main"><div class="mh-t">Inference open</div><div class="mh-d">Prediction flow degraded. Patients see a red banner.</div></div></div>`;
  return `<div class="m-hero red"><div class="mh-ic">${ic('alert-octagon')}</div><div class="mh-main"><div class="mh-t">Multiple circuits open</div><div class="mh-d">Page-level incident active.</div></div></div>`;
}
function mPatientBanner(kind) {
  const red = kind === 'inference-open' || kind === 'multi-open';
  return `<div class="m-card" style="overflow:hidden"><div class="pt-banner ${red ? 'red' : 'amber'}" style="border-bottom:none"><div class="ptb-ic">${ic(red ? 'alert-octagon' : 'info')}</div><div class="ptb-main"><div class="ptb-t">${red ? 'Analysis slower than usual' : 'Some explanations unavailable'}</div><div class="ptb-d">${red ? 'Uploads are saved; results may take longer.' : 'Upload & prediction still work. Explanations return shortly.'}</div><a class="ptb-link">${ic('external-link')}What is affected</a></div></div></div>`;
}
function mBody(kind) {
  return `${mHero(kind)}${mSecHead('git-fork', 'Circuit board', { opOnly: true, more: '7' })}${mBoard(kind)}${mSecHead('smartphone', 'Patient banner')}<div style="font:600 10px var(--font-sans);letter-spacing:.4px;text-transform:uppercase;color:var(--text-muted);margin:-6px 2px 0">What patients see</div>${mPatientBanner(kind)}`;
}
function mBodySkeleton() {
  const b = () => `<div style="padding:12px 13px;border-bottom:1px solid var(--border)"><div style="display:flex;gap:9px;align-items:center"><div class="skel" style="width:9px;height:9px;border-radius:50%"></div><div class="skel skel-line" style="width:55%"></div></div><div class="skel skel-line" style="width:75%;margin-top:9px"></div></div>`;
  return `<div class="m-card">${b()}${b()}${b()}${b()}</div><div style="display:flex;align-items:center;gap:9px;justify-content:center;color:var(--text-muted);font-size:12px"><span class="spinner" style="width:16px;height:16px;border-width:2px"></span>Loading circuits…</div>`;
}

const app = (b, o = {}) => desktopApp(b, { nav: NAV, navExtra: NAV_EXTRA, navActive: 'breakers', navLabel: 'Reliability', title: 'Circuit breakers', user: USER, search: 'Search circuits, dependencies, runbooks…', ...o });
const phone = (b, o = {}) => mPhone(b, { tabs: M_TABS, active: 'breakers', eyebrow: 'Reliability · operator', title: 'Circuit breakers', ...o });

const mast = masthead({
  eyebrow: 'Skin Lesion XAI · Clinical Premium · operator + patient',
  title: 'Circuit breakers & degraded-mode banner',
  sub: 'When a downstream dependency (model inference, Grad-CAM, an LLM agent, or OCR) is unhealthy, the platform serves a degraded experience. Patients see a calm, plain-language banner — amber unless the whole prediction flow is down — while operators see the circuit board with per-dependency state, failure rate, and force-open/close actions. Internal circuit names are never shown to patients.',
  legend: ['Circuit state — color + icon + text', ['green', 'circle-check', 'Closed — flowing'], ['amber', 'circle-dot', 'Half-open — probing'], ['red', 'circle-x', 'Open — failing fast'], ['neutral', 'eye-off', 'Hidden from patients']],
});

const desktop = sectionHead('A', 'Desktop — circuit board + patient banner', '1440px · operator console')
  + frame('01', 'Loading skeleton', 'The board scaffold paints immediately; circuit states and failure sparklines pulse while health checks resolve.', app(bodySkeleton()), { url: 'ops.skinlesionxai.health/breakers' })
  + frame('02', 'All circuits closed', 'Every dependency is healthy and the patient surface shows a normal "service normal" state with no banner-level warning.', app(body('all-green'), { envState: 'green' }), { url: 'ops.skinlesionxai.health/breakers' })
  + frame('03', 'One circuit half-open', 'Grad-CAM tripped and is probing recovery. The operator sees an amber half-open state; patients are not yet shown a banner.', app(body('half-open'), { envState: 'amber', notif: 1 }), { url: 'ops.skinlesionxai.health/breakers' })
  + frame('04', 'One circuit open — explanations degraded', 'Grad-CAM is open. Operators see an amber summary and a calm amber patient banner; predictions still work and the circuit name stays hidden from patients.', app(body('one-open'), { envState: 'amber', notif: 1 }), { url: 'ops.skinlesionxai.health/breakers' })
  + frame('05', 'Circuit detail — error breakdown', 'Opening a circuit reveals its error-class breakdown, patient-impact note, and a runbook. Force-close is available but gated behind judgement.', app(body('one-open', { detail: true }), { envState: 'amber', notif: 1 }), { url: 'ops.skinlesionxai.health/breakers' })
  + frame('06', 'Inference open — prediction flow degraded', 'The one case where the patient banner goes red: inference itself is failing. Uploads are still saved; the operator summary prioritises stabilising inference.', app(body('inference-open'), { envState: 'red', notif: 2 }), { url: 'ops.skinlesionxai.health/breakers' })
  + frame('07', 'Multiple circuits open — page-level incident', 'Two circuits open and one probing; a page-level red banner is active for affected features and an incident has been opened automatically.', app(body('multi-open'), { envState: 'red', notif: 3 }), { url: 'ops.skinlesionxai.health/breakers' });

const mobile = sectionHead('B', 'Mobile — on-call circuit board', '375px · bottom tabs · breaker cards')
  + '<div class="frame-grid">'
  + mframe('M01', 'Loading skeleton', 'The breaker list pulses while health checks resolve.', phone(mBodySkeleton(), { active: 'breakers' }))
  + mframe('M02', 'All closed', 'Seven healthy dependencies; the patient banner preview shows no warning.', phone(mBody('all-green'), { active: 'breakers' }))
  + mframe('M03', 'One open', 'Grad-CAM open; the amber hero leads and the patient-banner preview shows the calm amber message.', phone(mBody('one-open'), { active: 'breakers', envState: 'amber', notif: 1 }))
  + mframe('M04', 'Inference open', 'The red hero; the patient-banner preview goes red while explaining uploads are still saved.', phone(mBody('inference-open'), { active: 'breakers', envState: 'red', notif: 2 }))
  + mframe('M05', 'Multiple open', 'Page-level incident; several breakers open at once.', phone(mBody('multi-open'), { active: 'breakers', envState: 'red', notif: 3 }))
  + '</div>';

mountShowcase([mast, desktop, mobile]);
