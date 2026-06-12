/* ============================================================================
   E.10 — SLO & error-budget board (operator + research).
   Defines the platform's service-level objectives, shows budget remaining and
   burn rate, and connects burn to whether risky changes (canary advances,
   deploys) are allowed. Honest budgets; the "freeze" state is a real safeguard,
   not a scare. No PHI — these are aggregate service metrics. Loaded after kit.js.
   ============================================================================ */

const NAV = [
  { id: 'overview', label: 'Reliability overview', icon: 'layout-dashboard' },
  { id: 'slo', label: 'SLO & budgets', icon: 'target' },
  { id: 'canary', label: 'Canary rollout', icon: 'bird' },
  { id: 'breakers', label: 'Circuit breakers', icon: 'git-fork' },
  { id: 'flags', label: 'Feature flags', icon: 'toggle-right' },
  { id: 'dlq', label: 'Dead-letter queues', icon: 'inbox' },
];
const NAV_EXTRA = [{ id: 'runbooks', label: 'Runbooks', icon: 'book-open' }, { id: 'access', label: 'Access & roles', icon: 'shield' }];
const USER = { initials: 'PA', name: 'P. Adeyemi', role: 'Platform reliability · operator' };

/* SLOs: name, icon, target, window, [remaining%, burnX, sparkData] per kind */
const SLODEFS = [
  { key: 'avail', name: 'API availability', icon: 'activity', target: '99.9%', win: '30-day rolling' },
  { key: 'latency', name: 'Analysis p95 latency', icon: 'timer', target: '< 20s', win: '30-day rolling' },
  { key: 'explain', name: 'Explanation success', icon: 'layers', target: '99.0%', win: '30-day rolling' },
  { key: 'consent', name: 'Consent write durability', icon: 'shield-check', target: '99.99%', win: '30-day rolling' },
  { key: 'ocr', name: 'Lab OCR success', icon: 'file-text', target: '95.0%', win: '7-day rolling' },
  { key: 'fresh', name: 'Heatmap freshness', icon: 'refresh-cw', target: '< 2s', win: '7-day rolling' },
];
function sloData(kind) {
  const D = {
    healthy: { avail: [86, 0.4], latency: [78, 0.6], explain: [72, 0.7], consent: [99, 0.1], ocr: [64, 0.9], fresh: [81, 0.5] },
    burning: { avail: [41, 2.6], latency: [33, 3.1], explain: [58, 1.2], consent: [97, 0.2], ocr: [49, 1.4], fresh: [70, 0.8] },
    freeze: { avail: [6, 4.8], latency: [0, 5.5], explain: [22, 2.9], consent: [88, 0.6], ocr: [31, 1.9], fresh: [44, 1.2] },
  };
  return D[kind] || D.healthy;
}
const spk = { healthy: [88, 88, 87, 87, 86, 86, 86], burning: [72, 66, 60, 54, 49, 45, 41], freeze: [44, 33, 24, 17, 11, 8, 6] };
const tone = (rem) => rem <= 10 ? 'red' : rem <= 50 ? 'amber' : 'green';

function summary(kind) {
  if (kind === 'healthy') return stateHero('green', 'shield-check', 'All SLOs healthy — budgets comfortable', 'Every objective is within budget and burn rates are slow. Risky changes — canary advances and deploys — are permitted. This is the green-light state for shipping.', { meta: [['target', '6/6 in budget'], ['flame', 'max burn 0.9×']], ts: '09:18 UTC' });
  if (kind === 'burning') return stateHero('amber', 'flame', 'Two budgets burning fast — slow down', 'Availability and latency budgets are draining at 2.6–3.1× the sustainable rate. Still in budget, but at this pace they\u2019ll exhaust within days. Hold non-essential changes and investigate.', { meta: [['flame', 'burn 3.1×'], ['target', 'latency 33% left']], ts: '09:18 UTC' });
  if (kind === 'freeze') return stateHero('red', 'snowflake', 'Latency budget exhausted — change freeze active', 'The analysis-latency SLO has spent its entire 30-day budget. A change freeze is in effect: canary advances and non-emergency deploys are blocked until the budget recovers or the window rolls.', { meta: [['lock', 'freeze active'], ['target', 'latency 0% left']], ts: '09:18 UTC' });
  return stateHero('neutral', 'hourglass', 'SLO window still filling', 'A new SLO definition was applied 3 days ago; the 30-day budget needs a full window before burn rate is meaningful. Metrics show but the freeze policy is paused until the window completes.', { meta: [['calendar', '3 of 30 days'], ['pause', 'policy paused']], ts: '09:18 UTC' });
}

function sloCard(def, kind) {
  const [rem, burn] = sloData(kind)[def.key];
  const t = tone(rem);
  const spent = 100 - rem;
  return `<div class="slo-card ${t === 'amber' ? 'warn' : t === 'red' ? 'crit' : ''}">
    <div class="sl-top"><div><div class="sl-name">${ic(def.icon)}${def.name}</div><div class="sl-target">target ${def.target} · ${def.win}</div></div>${statline(t, t === 'green' ? 'check-circle' : t === 'amber' ? 'flame' : 'alert-octagon', t === 'green' ? 'Healthy' : t === 'amber' ? 'Burning' : rem === 0 ? 'Exhausted' : 'Critical')}</div>
    <div class="sl-budget"><span class="sl-pct ${t}">${rem}%</span><span class="sl-pctlab">error budget remaining</span></div>
    <div class="budgbar"><i class="brem ${t}" style="width:${rem}%"></i></div>
    <div class="sl-foot"><span class="sl-burn" style="color:var(--${burn >= 2 ? (burn >= 4 ? 'red' : 'amber') : 'text-secondary'})">${ic('flame')}${burn.toFixed(1)}× burn</span><span style="font-family:var(--font-mono);color:var(--text-muted)">${spent}% spent</span></div>
    <div class="sl-spark">${sparkline(spk[kind] || spk.healthy, { tone: t, w: 240, h: 30 })}</div>
  </div>`;
}
function sloGrid(kind) { return `<div class="slo-grid">${SLODEFS.map(d => sloCard(d, kind)).join('')}</div>`; }

function changeGate(kind) {
  const blocked = kind === 'freeze';
  const caution = kind === 'burning';
  return `<div class="opc"><div class="opc-head"><span class="oh-t">${ic(blocked ? 'lock' : caution ? 'alert-triangle' : 'unlock')}Change gate</span><span class="oh-spacer"></span><span class="oh-sub">driven by budget burn</span></div>
    <div style="padding:var(--sp-md);display:flex;flex-direction:column;gap:10px">
      ${[['Canary advance', blocked ? 'blocked' : caution ? 'caution' : 'allowed'], ['Standard deploy', blocked ? 'blocked' : caution ? 'caution' : 'allowed'], ['Config / flag change', 'allowed'], ['Emergency fix', 'allowed']].map(([n, st]) => {
        const map = { allowed: ['green', 'check-circle', 'Allowed'], caution: ['amber', 'alert-triangle', 'Allowed with review'], blocked: ['red', 'lock', 'Blocked by freeze'] };
        const [tn, icn, lab] = map[st];
        return `<div class="policy-row" style="border:none;padding:9px 0"><span class="pr-name">${n}</span><span></span>${statline(tn, icn, lab)}</div>`;
      }).join('')}
    </div>
    <div class="flags-foot" style="background:var(--surface)">${ic('info')}${blocked ? 'The freeze lifts automatically when the exhausted budget recovers above 5% or the 30-day window rolls forward.' : caution ? 'Burn is elevated — risky changes need a second reviewer until budgets recover.' : 'Budgets are healthy; all change types are permitted.'}</div>
  </div>`;
}
function incidentLink(kind) {
  if (kind === 'healthy' || kind === 'filling') return `<div class="opc"><div class="state-box"><div class="sb-ic green">${ic('check-circle')}</div><h4>No budget-affecting incidents in this window</h4><p>Burn has stayed within sustainable rates. Incidents that consume budget would be linked here with their attributed spend.</p></div></div>`;
  const items = kind === 'freeze' ? [
    ['red', 'alert-octagon', 'INC-2043 · Analysis latency regression', '2026-06-05 → ongoing', 'attributed 71% of latency budget'],
    ['amber', 'alert-triangle', 'INC-2039 · GPU pool saturation', '2026-06-03 → resolved', 'attributed 18% of latency budget'],
  ] : [['amber', 'alert-triangle', 'INC-2039 · GPU pool saturation', '2026-06-03 → resolved', 'attributed 22% of availability budget']];
  return `<div class="opc">${items.map(([t, i, title, when, spend]) => `<div class="m-audit" style="padding:13px var(--sp-md)"><div class="ma-rail"><div class="ma-ic ${t}">${ic(i)}</div></div><div class="ma-body"><div class="ma-l1"><span class="ma-action">${title}</span><span class="ma-time">${when}</span></div><div class="ma-target">${spend}</div><div class="ma-actor"><span class="statline neutral">${ic('external-link')}Open incident</span></div></div></div>`).join('')}</div>`;
}

function kpis(kind) {
  const worst = kind === 'freeze' ? 0 : kind === 'burning' ? 33 : 72;
  const maxBurn = kind === 'freeze' ? 5.5 : kind === 'burning' ? 3.1 : 0.9;
  return `<div class="kpi-strip c4">
    <div class="kpi-tile lead"><span class="kt-l">${ic('target')}SLOs in budget</span><span class="kt-v">${kind === 'freeze' ? '5' : '6'}<small>/ 6</small></span><span class="kt-foot">${kind === 'freeze' ? statline('red', 'alert-octagon', '1 exhausted') : kind === 'burning' ? statline('amber', 'flame', '2 burning fast') : statline('green', 'check-circle', 'all healthy')}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('flame')}Worst burn rate</span><span class="kt-v">${maxBurn.toFixed(1)}<small>×</small></span><span class="kt-foot">${maxBurn >= 1 ? 'above sustainable (1×)' : 'sustainable'}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('battery-low')}Lowest budget</span><span class="kt-v">${worst}<small>%</small></span><span class="kt-foot">${kind === 'freeze' ? 'analysis latency' : kind === 'burning' ? 'analysis latency' : 'lab OCR'}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic(kind === 'freeze' ? 'lock' : 'unlock')}Change gate</span><span class="kt-v" style="font-size:18px;padding-top:5px">${kind === 'freeze' ? 'Freeze' : kind === 'burning' ? 'Caution' : 'Open'}</span><span class="kt-foot">${kind === 'freeze' ? 'deploys blocked' : kind === 'burning' ? 'review required' : 'changes allowed'}</span></div>
  </div>`;
}

function body(kind) {
  return `
  ${summary(kind)}
  ${kpis(kind === 'filling' ? 'healthy' : kind)}
  ${kind === 'freeze' ? runbook('red', 'Freeze is protecting patients — fix latency, don\u2019t override', 'The latency budget is spent. The freeze blocks risky changes automatically. Focus on INC-2043; the freeze lifts on its own when the budget recovers. Override only for an emergency fix with director sign-off.', 'Open freeze runbook') : kind === 'burning' ? runbook('amber', 'Slow down before the budget exhausts', 'Two budgets are burning at 3×. Hold canary advances and non-essential deploys, and work the GPU-saturation incident before the latency budget runs out and a freeze kicks in.') : ''}
  ${rsec('target', 'Service-level objectives', { meta: 'budget remaining · burn rate', opOnly: true })}
  ${kind === 'filling' ? `<div style="opacity:.55;pointer-events:none;filter:grayscale(.4)">${sloGrid('healthy')}</div>` : sloGrid(kind)}
  ${rsec('git-pull-request', 'Change gate', { meta: 'what burn allows right now' })}
  ${changeGate(kind === 'filling' ? 'healthy' : kind)}
  ${rsec('siren', 'Budget-affecting incidents', { meta: 'attributed spend' })}
  ${incidentLink(kind)}
  ${opsNote('<b>Operator + research surface — not patient-facing.</b> SLOs are aggregate service metrics with no patient data. The change freeze is an automatic safeguard, not a punishment — it protects the patient experience when reliability is at risk.')}`;
}
function bodySkeleton() {
  const t = () => `<div class="kpi-tile"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:40%;height:24px;margin:9px 0 6px"></div></div>`;
  const c = () => `<div class="slo-card"><div class="skel skel-line" style="width:60%"></div><div class="skel" style="width:35%;height:28px;margin:10px 0 8px"></div><div class="skel" style="width:100%;height:10px;border-radius:5px"></div><div class="skel" style="width:100%;height:30px;margin-top:10px;border-radius:5px"></div></div>`;
  return `<div class="kpi-strip c4">${t()}${t()}${t()}${t()}</div><div class="r-sec" style="margin-top:var(--sp-xl)"><div class="skel skel-line" style="width:160px;height:13px"></div><span class="r-rule"></span></div><div class="slo-grid">${c()}${c()}${c()}</div><div style="display:flex;align-items:center;gap:10px;justify-content:center;color:var(--text-muted);font-size:12.5px;margin-top:var(--sp-xl)"><span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Computing budgets over the rolling window…</div>`;
}

/* mobile */
const M_TABS = [{ id: 'overview', label: 'Overview', icon: 'layout-dashboard' }, { id: 'slo', label: 'SLO', icon: 'target' }, { id: 'canary', label: 'Canary', icon: 'bird' }, { id: 'breakers', label: 'Breakers', icon: 'git-fork' }];
function mHero(kind) {
  const map = { healthy: ['green', 'shield-check', 'All SLOs healthy', 'Budgets comfortable; changes allowed.'], burning: ['amber', 'flame', 'Two budgets burning', '3× burn — slow down before freeze.'], freeze: ['red', 'snowflake', 'Change freeze active', 'Latency budget spent; deploys blocked.'], filling: ['neutral', 'hourglass', 'Window still filling', '3 of 30 days; policy paused.'] };
  const [tn, icn, t, d] = map[kind];
  return `<div class="m-hero ${tn}"><div class="mh-ic">${ic(icn)}</div><div class="mh-main"><div class="mh-t">${t}</div><div class="mh-d">${d}</div></div></div>`;
}
function mKpis(kind) {
  const worst = kind === 'freeze' ? 0 : kind === 'burning' ? 33 : 72;
  const maxBurn = kind === 'freeze' ? 5.5 : kind === 'burning' ? 3.1 : 0.9;
  return `<div class="m-kpis"><div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('target')}</span><span class="mk-name">In budget</span></div><div class="mk-val">${kind === 'freeze' ? 5 : 6}<span class="u">/6</span></div><div class="mk-foot">${kind === 'freeze' ? '1 exhausted' : 'SLOs'}</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('flame')}</span><span class="mk-name">Worst burn</span></div><div class="mk-val sm">${maxBurn.toFixed(1)}×</div><div class="mk-foot">${maxBurn >= 1 ? 'fast' : 'ok'}</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('battery-low')}</span><span class="mk-name">Lowest</span></div><div class="mk-val sm">${worst}%</div><div class="mk-foot">left</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic(kind === 'freeze' ? 'lock' : 'unlock')}</span><span class="mk-name">Gate</span></div><div class="mk-val sm">${kind === 'freeze' ? 'Freeze' : kind === 'burning' ? 'Caution' : 'Open'}</div><div class="mk-foot">changes</div></div></div>`;
}
function mSlo(def, kind) {
  const [rem, burn] = sloData(kind)[def.key]; const t = tone(rem);
  return `<div style="padding:13px;border-bottom:1px solid var(--border)"><div style="display:flex;justify-content:space-between;align-items:center"><span style="font:600 12.5px var(--font-sans)">${ic(def.icon)} ${def.name}</span>${statline(t, t === 'green' ? 'check-circle' : t === 'amber' ? 'flame' : 'alert-octagon', `${rem}%`)}</div><div class="budgbar" style="margin-top:9px"><i class="brem ${t}" style="width:${rem}%"></i></div><div style="display:flex;justify-content:space-between;margin-top:7px;font:500 10.5px var(--font-mono);color:var(--text-muted)"><span>target ${def.target}</span><span style="color:var(--${burn >= 2 ? 'amber' : 'text-muted'})">${burn.toFixed(1)}× burn</span></div></div>`;
}
function mBody(kind) {
  const k = kind === 'filling' ? 'healthy' : kind;
  return `${mHero(kind)}${mKpis(k)}${kind === 'freeze' ? `<div class="m-runbook red"><div class="mr-ic">${ic('book-open')}</div><div><div class="mr-t">What to do now</div><div class="mr-h">Fix latency, don't override</div><div class="mr-d">Freeze protects patients; it lifts when budget recovers.</div><a class="mr-link">${ic('external-link')}Runbook</a></div></div>` : kind === 'burning' ? `<div class="m-runbook amber"><div class="mr-ic">${ic('book-open')}</div><div><div class="mr-t">What to do now</div><div class="mr-h">Slow down</div><div class="mr-d">Hold canary & deploys; work the incident.</div></div></div>` : ''}${mSecHead('target', 'SLOs', { opOnly: true, more: '6' })}<div class="m-card" ${kind === 'filling' ? 'style="opacity:.55"' : ''}>${SLODEFS.map(d => mSlo(d, k)).join('')}</div>`;
}
function mBodySkeleton() {
  const k = () => `<div class="m-kpi"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:40%;height:18px;margin:9px 0 5px"></div></div>`;
  const s = () => `<div style="padding:13px;border-bottom:1px solid var(--border)"><div class="skel skel-line" style="width:60%"></div><div class="skel" style="width:100%;height:10px;margin-top:10px;border-radius:5px"></div></div>`;
  return `<div class="m-kpis">${k()}${k()}${k()}${k()}</div><div class="m-card">${s()}${s()}${s()}</div>`;
}

const app = (b, o = {}) => desktopApp(b, { nav: NAV, navExtra: NAV_EXTRA, navActive: 'slo', navLabel: 'Reliability', title: 'SLO & error budgets', user: USER, search: 'Search SLOs, incidents, runbooks…', ...o });
const phone = (b, o = {}) => mPhone(b, { tabs: M_TABS, active: 'slo', eyebrow: 'Reliability · operator', title: 'SLO & budgets', ...o });

const mast = masthead({
  eyebrow: 'Skin Lesion XAI · Clinical Premium · operator + research',
  title: 'SLO & error-budget board',
  sub: 'Defines the platform\u2019s service-level objectives, shows the error budget remaining and how fast it is burning, and ties that burn to a change gate: when budgets are healthy, risky changes ship; when a budget exhausts, an automatic change freeze blocks non-emergency deploys and canary advances until reliability recovers. Honest budgets and a real safeguard — not a scare. Not patient-facing; SLOs are aggregate service metrics with no patient data.',
  legend: ['Budget state — color + icon + text', ['green', 'check-circle', 'Healthy (> 50%)'], ['amber', 'flame', 'Burning (10–50%)'], ['red', 'alert-octagon', 'Critical / exhausted'], ['red', 'snowflake', 'Change freeze']],
});

const desktop = sectionHead('A', 'Desktop — SLO & error-budget board', '1440px · operator console')
  + frame('01', 'Loading skeleton', 'KPI and SLO-card scaffolds paint immediately; budgets and burn sparklines pulse while the rolling window is computed.', app(bodySkeleton()), { url: 'ops.skinlesionxai.health/slo' })
  + frame('02', 'All SLOs healthy — change gate open', 'Six objectives in budget with slow burn; the change gate permits canary advances and deploys. The green-light state for shipping.', app(body('healthy'), { envState: 'green' }), { url: 'ops.skinlesionxai.health/slo' })
  + frame('03', 'Budgets burning fast — caution', 'Availability and latency burn at 3×. An amber hero and runbook say slow down; the change gate downgrades risky changes to "allowed with review".', app(body('burning'), { envState: 'amber', notif: 1 }), { url: 'ops.skinlesionxai.health/slo' })
  + frame('04', 'Budget exhausted — change freeze', 'The latency budget hits zero and an automatic freeze blocks deploys and canary advances. The hero frames the freeze as protection and links the driving incident.', app(body('freeze'), { envState: 'red', notif: 2 }), { url: 'ops.skinlesionxai.health/slo' })
  + frame('05', 'Window still filling', 'A freshly defined SLO needs a full window before burn is meaningful; cards are greyed and the freeze policy is paused.', app(body('filling'), { envState: 'neutral' }), { url: 'ops.skinlesionxai.health/slo' });

const mobile = sectionHead('B', 'Mobile — budgets at a glance', '375px · bottom tabs · budget cards')
  + '<div class="frame-grid">'
  + mframe('M01', 'Loading skeleton', 'KPI tiles and budget bars pulse while the window computes.', phone(mBodySkeleton(), { active: 'slo' }))
  + mframe('M02', 'All healthy', 'Green hero; every budget bar comfortably full with slow burn.', phone(mBody('healthy'), { active: 'slo' }))
  + mframe('M03', 'Burning fast', 'Amber hero and runbook; two budget bars draining at 3×.', phone(mBody('burning'), { active: 'slo', envState: 'amber', notif: 1 }))
  + mframe('M04', 'Change freeze', 'Red hero with the freeze; the latency budget bar is empty.', phone(mBody('freeze'), { active: 'slo', envState: 'red', notif: 2 }))
  + mframe('M05', 'Window filling', 'Neutral hero; budget cards greyed until the window completes.', phone(mBody('filling'), { active: 'slo', envState: 'neutral' }))
  + '</div>';

mountShowcase([mast, desktop, mobile]);
