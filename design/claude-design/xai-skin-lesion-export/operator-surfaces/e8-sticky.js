/* ============================================================================
   E.8 — Sticky-session affinity diagnostic (operator).
   When sticky sessions are configured at the load balancer, the operator needs
   to see when affinity breaks (pod evicted, ALB re-targeted, deploy in progress)
   and how many active sessions are affected. Never expose the raw session
   cookie; never show patient identity alongside session data. Loaded after kit.js.
   ============================================================================ */

const NAV = [
  { id: 'overview', label: 'Reliability overview', icon: 'layout-dashboard' },
  { id: 'sessions', label: 'Sticky sessions', icon: 'link' },
  { id: 'breakers', label: 'Circuit breakers', icon: 'git-fork' },
  { id: 'canary', label: 'Canary rollout', icon: 'bird' },
  { id: 'flags', label: 'Feature flags', icon: 'toggle-right' },
  { id: 'slo', label: 'SLO & budgets', icon: 'target' },
];
const NAV_EXTRA = [{ id: 'runbooks', label: 'Runbooks', icon: 'book-open' }, { id: 'access', label: 'Access & roles', icon: 'shield' }];
const USER = { initials: 'PA', name: 'P. Adeyemi', role: 'Platform reliability · operator' };

const podStatus = { running: ['green', 'circle-play', 'Running'], draining: ['amber', 'circle-pause', 'Draining'], evicted: ['neutral', 'power', 'Evicted'] };
function pods(kind) {
  if (kind === 'deploy') return [
    ['api-7d9c-aa', 312, 'draining', '2d 04h'], ['api-7d9c-bb', 298, 'running', '2d 04h'],
    ['api-8f1e-cc', 41, 'running', '3m', true], ['api-8f1e-dd', 38, 'running', '3m', true],
  ];
  if (kind === 'excessive') return [
    ['api-7d9c-aa', 96, 'evicted', '—'], ['api-7d9c-bb', 410, 'running', '1d 22h'],
    ['api-7d9c-cc', 388, 'running', '1d 22h'], ['api-7d9c-dd', 0, 'evicted', '—'],
  ];
  return [
    ['api-7d9c-aa', 326, 'running', '2d 06h'], ['api-7d9c-bb', 318, 'running', '2d 06h'],
    ['api-7d9c-cc', 301, 'running', '2d 06h'], ['api-7d9c-dd', 295, 'running', '2d 06h'],
  ];
}
const BREAKS = [
  { sev: 'neutral', ts: '2026-06-06 09:12 UTC', tok: 'sess_b81f', from: 'api-7d9c-aa', to: 'api-7d9c-bb', reason: 'deploy', impact: 'explanation cache regenerated' },
  { sev: 'neutral', ts: '2026-06-06 09:11 UTC', tok: 'sess_2c40', from: 'api-7d9c-aa', to: 'api-7d9c-cc', reason: 'deploy', impact: 'explanation cache regenerated' },
  { sev: 'amber', ts: '2026-06-06 08:58 UTC', tok: 'sess_9ad2', from: 'api-7d9c-cc', to: 'api-7d9c-bb', reason: 'health-check failure', impact: 'cache miss · re-fetched' },
];
const BREAKS_EXCESS = [
  { sev: 'red', ts: '2026-06-06 09:14 UTC', tok: 'sess_d10c', from: 'api-7d9c-aa', to: 'api-7d9c-bb', reason: 'eviction (OOM)', impact: 'cache regenerated · +1.2s' },
  { sev: 'red', ts: '2026-06-06 09:13 UTC', tok: 'sess_77e1', from: 'api-7d9c-dd', to: 'api-7d9c-cc', reason: 'eviction (OOM)', impact: 'cache regenerated · +1.4s' },
  { sev: 'amber', ts: '2026-06-06 09:11 UTC', tok: 'sess_5b3a', from: 'api-7d9c-aa', to: 'api-7d9c-cc', reason: 'health-check failure', impact: 'cache miss · re-fetched' },
  ...BREAKS.slice(1),
];

function kpis(kind) {
  const ex = kind === 'excessive'; const dep = kind === 'deploy'; const un = kind === 'unexpected';
  const broken = ex ? 188 : dep ? 79 : un ? 14 : 2;
  return `<div class="kpi-strip c4">
    <div class="kpi-tile lead"><span class="kt-l">${ic('users')}Active sessions</span><span class="kt-v">${ex ? '894' : '1,240'}</span><span class="kt-foot">${ex ? statline('red', 'trending-down', 'dropped on evictions') : 'across 4 pods'}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('link')}Sticky-bound</span><span class="kt-v">${ex ? '71' : '98'}<small>%</small></span><span class="kt-foot">${ex ? statline('red', 'unlink', 'affinity degraded') : statline('green', 'check-circle', 'healthy')}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('unlink')}Breaks · 1h</span><span class="kt-v">${broken}</span><span class="kt-foot">${ex ? statline('red', 'alert-octagon', 'externalise state') : dep ? statline('blue', 'rocket', 'expected · deploy') : un ? statline('amber', 'alert-triangle', 'above baseline') : 'within baseline'}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('clock')}Mean session life</span><span class="kt-v">${ex ? '8.1' : '14.6'}<small>min</small></span><span class="kt-foot">${ex ? 'shortened by churn' : 'stable'}</span></div>
  </div>`;
}
function summary(kind) {
  if (kind === 'stable') return stateHero('green', 'shield-check', 'Affinity stable — sessions pinned cleanly', '98% of active sessions are bound to their original pod. The handful of breaks in the last hour were absorbed by the explanation cache with no patient-visible impact.', { meta: [['link', '98% sticky'], ['unlink', '2 breaks / 1h']], ts: '09:18 UTC' });
  if (kind === 'deploy') return stateHero('blue', 'rocket', 'Deploy in progress — breaks are expected', 'A rolling deploy is draining two pods and bringing up replacements. The 79 affinity breaks are expected; sessions are re-pinning to healthy pods and regenerating their explanation cache.', { meta: [['rocket', 'rollout #1843'], ['unlink', '79 expected breaks']], ts: '09:18 UTC' });
  if (kind === 'unexpected') return stateHero('amber', 'alert-triangle', 'Unexpected affinity breaks', 'Affinity breaks are above baseline (14 in the last hour) with no deploy running. A pod is failing health checks intermittently. Investigate before it escalates.', { meta: [['unlink', '14 breaks / 1h'], ['heart-pulse', 'health-check flaps']], ts: '09:18 UTC' });
  if (kind === 'excessive') return stateHero('red', 'alert-octagon', 'Excessive breaks — externalise session state', 'Two pods were evicted under memory pressure, breaking 188 sessions in an hour and adding latency as caches rebuild. The durable fix is to move session state to Redis instead of pod-local memory.', { meta: [['unlink', '188 breaks / 1h'], ['server-crash', '2 pods evicted']], ts: '09:18 UTC' });
  return stateHero('neutral', 'info', 'Sticky sessions are not configured', 'The load balancer is round-robining requests with no affinity. That\u2019s fine if all state is external — but the explanation cache is currently pod-local, so enabling affinity would cut cache misses.', { meta: [['shuffle', 'round-robin'], ['database', 'cache is pod-local']], ts: '09:18 UTC' });
}

function podTable(kind) {
  const list = pods(kind);
  return `<div class="opc"><div class="opc-head"><span class="oh-t">${ic('server')}Pods · target group api-tg</span><span class="oh-spacer"></span><span class="oh-sub">${list.length} pods · eu-central-1</span></div>
    <table class="dtable"><thead><tr><th>Pod</th><th class="num">Active sessions</th><th>Status</th><th>Uptime</th><th class="num">Action</th></tr></thead><tbody>
    ${list.map(([name, sess, st, up, fresh]) => { const [tone, icn, lab] = podStatus[st]; return `<tr><td><span class="tok">${name}</span>${fresh ? ` <span class="redact-pill" style="color:var(--accent);background:var(--accent-light);border-color:var(--blue-border)">${ic('sparkles')}new</span>` : ''}</td><td class="num mono">${sess}</td><td>${statline(tone, icn, lab)}</td><td class="mono">${up}</td><td class="num"><div class="row-act">${st === 'running' ? `<button class="mini-btn ghost">${ic('circle-pause')}Drain gracefully</button>` : st === 'draining' ? `<span class="t-na">draining…</span>` : `<span class="t-na">—</span>`}</div></td></tr>`; }).join('')}
    </tbody></table></div>`;
}
function breakLog(kind) {
  const list = kind === 'excessive' ? BREAKS_EXCESS : BREAKS;
  return `<div class="opc"><div class="opc-head"><span class="oh-t">${ic('unlink')}Affinity-break log</span><span class="oh-spacer"></span><span class="oh-sub">newest first · session tokens only</span></div>
    <table class="dtable"><thead><tr><th style="width:14px"></th><th>Timestamp</th><th>Session</th><th>Original → new pod</th><th>Reason</th><th>Patient impact</th></tr></thead><tbody>
    ${list.map(b => `<tr class="sev-row"><td><span class="sev-cell"><span class="sev-rail ${b.sev}"></span></span></td><td class="mono">${b.ts}</td><td><span class="tok">${b.tok}</span></td><td class="mono">${b.from} → ${b.to}</td><td>${statline(b.reason.includes('evict') ? 'red' : b.reason.includes('health') ? 'amber' : 'blue', b.reason.includes('evict') ? 'server-crash' : b.reason.includes('health') ? 'heart-pulse' : 'rocket', b.reason)}</td><td class="payload">${b.impact}</td></tr>`).join('')}
    </tbody></table>
    <div class="t-foot"><span class="tf-info">Raw session cookies are never displayed — only opaque session tokens. No patient identity is shown alongside session data.</span></div></div>`;
}
function recommendation(kind) {
  if (kind === 'excessive' || kind === 'unexpected' || kind === 'notconfigured') {
    const red = kind === 'excessive';
    return runbook(red ? 'red' : kind === 'unexpected' ? 'amber' : 'amber', red ? 'Externalise session state to Redis' : kind === 'unexpected' ? 'Find and cordon the flapping pod' : 'Move the explanation cache to Redis, then drop affinity', red ? 'Pod-local session state is the root cause: every eviction breaks every session on that pod. Move the explanation cache and session state to Redis so a break becomes a cache lookup, not a regeneration.' : kind === 'unexpected' ? 'A pod is failing health checks intermittently. Identify it from the break log, cordon it, and let sessions drain to healthy pods while you investigate the cause.' : 'Affinity only helps because the cache is pod-local. Externalising the cache removes the need for stickiness entirely and makes pod churn invisible to patients.', 'Open cache-pattern docs');
  }
  return '';
}

function body(kind) {
  return `
  ${summary(kind)}
  ${kpis(kind === 'notconfigured' ? 'stable' : kind)}
  ${recommendation(kind)}
  ${rsec('server', 'Pods', { meta: 'active sessions · status', opOnly: true })}
  ${podTable(kind === 'notconfigured' ? 'stable' : kind)}
  ${kind !== 'notconfigured' ? `${rsec('unlink', 'Affinity breaks', { meta: 'session token · pod move · reason' })}${breakLog(kind)}` : `<div class="opc"><div class="state-box"><div class="sb-ic accent">${ic('shuffle')}</div><h4>No affinity to break — round-robin is active</h4><p>With stickiness off there is no affinity-break log. Requests are distributed evenly; the trade-off is explanation-cache misses while the cache stays pod-local.</p></div></div>`}
  ${opsNote('<b>Operator surface — not patient-facing.</b> Raw session cookie values are never displayed; sessions are shown as opaque tokens. No patient identity is ever shown alongside session data. No PHI.')}`;
}
function bodySkeleton() {
  const t = () => `<div class="kpi-tile"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:40%;height:24px;margin:9px 0 6px"></div></div>`;
  const r = () => `<div class="skel-row"><div class="skel skel-line" style="width:120px"></div><div class="skel skel-line" style="width:60px"></div><div class="skel skel-line" style="width:90px"></div><div class="skel skel-line" style="width:70px"></div></div>`;
  return `<div class="kpi-strip c4">${t()}${t()}${t()}${t()}</div><div class="r-sec" style="margin-top:var(--sp-xl)"><div class="skel skel-line" style="width:120px;height:13px"></div><span class="r-rule"></span></div><div class="opc">${r()}${r()}${r()}${r()}</div><div style="display:flex;align-items:center;gap:10px;justify-content:center;color:var(--text-muted);font-size:12.5px;margin-top:var(--sp-xl)"><span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Loading pod & session affinity state…</div>`;
}

/* mobile */
const M_TABS = [{ id: 'overview', label: 'Overview', icon: 'layout-dashboard' }, { id: 'sessions', label: 'Sessions', icon: 'link' }, { id: 'breakers', label: 'Breakers', icon: 'git-fork' }, { id: 'slo', label: 'SLO', icon: 'target' }];
function mHero(kind) {
  const map = { stable: ['green', 'shield-check', 'Affinity stable', '98% pinned; breaks absorbed by cache.'], deploy: ['blue', 'rocket', 'Deploy in progress', '79 expected breaks; re-pinning.'], unexpected: ['amber', 'alert-triangle', 'Unexpected breaks', '14/1h, no deploy — pod flapping.'], excessive: ['red', 'alert-octagon', 'Excessive breaks', '188/1h on evictions. Externalise state.'], notconfigured: ['neutral', 'info', 'Sticky not configured', 'Round-robin; cache is pod-local.'] };
  const [tone, icn, t, d] = map[kind];
  return `<div class="m-hero ${tone}"><div class="mh-ic">${ic(icn)}</div><div class="mh-main"><div class="mh-t">${t}</div><div class="mh-d">${d}</div></div></div>`;
}
function mKpis(kind) {
  const ex = kind === 'excessive'; const dep = kind === 'deploy'; const un = kind === 'unexpected';
  const broken = ex ? 188 : dep ? 79 : un ? 14 : 2;
  return `<div class="m-kpis"><div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('users')}</span><span class="mk-name">Active</span></div><div class="mk-val sm">${ex ? '894' : '1.2k'}</div><div class="mk-foot">sessions</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('link')}</span><span class="mk-name">Sticky</span></div><div class="mk-val sm">${ex ? '71%' : '98%'}</div><div class="mk-foot">${ex ? 'degraded' : 'healthy'}</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('unlink')}</span><span class="mk-name">Breaks 1h</span></div><div class="mk-val">${broken}</div><div class="mk-foot">${dep ? 'expected' : ex ? 'high' : 'baseline'}</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('clock')}</span><span class="mk-name">Session life</span></div><div class="mk-val sm">${ex ? '8.1' : '14.6'}m</div><div class="mk-foot">mean</div></div></div>`;
}
function mPods(kind) {
  return `<div class="m-card">${pods(kind).map(([name, sess, st, up, fresh]) => { const [tone, icn, lab] = podStatus[st]; return `<div class="m-svc"><div class="sv-ic">${ic('box')}</div><div class="sv-body"><div class="sv-name">${name}${fresh ? ' <span class="redact-pill" style="color:var(--accent);background:var(--accent-light);border-color:var(--blue-border)">new</span>' : ''}</div><div class="sv-metric">${sess} sessions · up ${up}</div></div>${statline(tone, icn, lab)}</div>`; }).join('')}</div>`;
}
function mBreaks(kind) {
  const list = kind === 'excessive' ? BREAKS_EXCESS : BREAKS;
  return `<div class="m-card">${list.slice(0, 4).map(b => `<div class="m-logrow"><span class="lr-rail ${b.sev}"></span><div class="lr-body"><div class="lr-top"><span class="lr-id">${b.tok}</span><span class="lr-time">${b.ts.split(' ')[1]}</span></div><div class="lr-err">${b.from} → ${b.to}</div><div class="lr-meta">${statline(b.reason.includes('evict') ? 'red' : b.reason.includes('health') ? 'amber' : 'blue', b.reason.includes('evict') ? 'server-crash' : b.reason.includes('health') ? 'heart-pulse' : 'rocket', b.reason)}</div><div class="lr-payload">${b.impact}</div></div></div>`).join('')}</div>`;
}
function mBody(kind) {
  const k = kind === 'notconfigured' ? 'stable' : kind;
  return `${mHero(kind)}${mKpis(k)}${kind === 'excessive' ? `<div class="m-runbook red"><div class="mr-ic">${ic('book-open')}</div><div><div class="mr-t">What to do now</div><div class="mr-h">Externalise state to Redis</div><div class="mr-d">Every eviction breaks every session on that pod.</div><a class="mr-link">${ic('external-link')}Cache-pattern docs</a></div></div>` : ''}${mSecHead('server', 'Pods', { opOnly: true, more: '4' })}${mPods(k)}${kind !== 'notconfigured' ? `${mSecHead('unlink', 'Affinity breaks')}${mBreaks(kind)}` : ''}`;
}
function mBodySkeleton() {
  const k = () => `<div class="m-kpi"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:40%;height:18px;margin:9px 0 5px"></div></div>`;
  const r = () => `<div style="padding:12px 13px;border-bottom:1px solid var(--border);display:flex;gap:10px;align-items:center"><div class="skel" style="width:32px;height:32px;border-radius:8px"></div><div style="flex:1"><div class="skel skel-line" style="width:50%"></div><div class="skel skel-line" style="width:70%;margin-top:7px"></div></div></div>`;
  return `<div class="m-kpis">${k()}${k()}${k()}${k()}</div><div class="m-card">${r()}${r()}${r()}</div>`;
}

const app = (b, o = {}) => desktopApp(b, { nav: NAV, navExtra: NAV_EXTRA, navActive: 'sessions', navLabel: 'Reliability', title: 'Sticky sessions', user: USER, search: 'Search pods, sessions, runbooks…', ...o });
const phone = (b, o = {}) => mPhone(b, { tabs: M_TABS, active: 'sessions', eyebrow: 'Reliability · operator', title: 'Sticky sessions', ...o });

const mast = masthead({
  eyebrow: 'Skin Lesion XAI · Clinical Premium · operator only',
  title: 'Sticky-session affinity diagnostic',
  sub: 'When sticky sessions are configured at the load balancer, this surface shows when affinity breaks — pod evicted, ALB re-targeted, deploy in progress — and how many active sessions are affected. It lists pods with their session counts and drain action, an affinity-break log, and a recommendation to externalise state when breaks are non-trivial. Raw session cookies are never shown; sessions are opaque tokens, never tied to patient identity.',
  legend: ['Break reason — color + icon + text', ['blue', 'rocket', 'Deploy (expected)'], ['amber', 'heart-pulse', 'Health-check flap'], ['red', 'server-crash', 'Eviction'], ['neutral', 'shield', 'Token-only, no PHI']],
});

const desktop = sectionHead('A', 'Desktop — sticky-session affinity', '1440px · operator console')
  + frame('01', 'Loading skeleton', 'Pod and break-log scaffolds paint immediately; session counts pulse while affinity state loads.', app(bodySkeleton()), { url: 'ops.skinlesionxai.health/sessions' })
  + frame('02', 'Affinity stable', 'A green hero, four healthy pods with balanced sessions, and a short break log absorbed by the explanation cache.', app(body('stable'), { envState: 'green' }), { url: 'ops.skinlesionxai.health/sessions' })
  + frame('03', 'Deploy in progress — expected breaks', 'A blue informational hero: two pods drain while replacements come up. The 79 breaks are expected and labelled "deploy" in the log.', app(body('deploy'), { envState: 'green', notif: 1 }), { url: 'ops.skinlesionxai.health/sessions' })
  + frame('04', 'Unexpected breaks', 'No deploy, yet breaks are above baseline from a flapping pod. An amber hero and runbook say cordon the pod.', app(body('unexpected'), { envState: 'amber', notif: 1 }), { url: 'ops.skinlesionxai.health/sessions' })
  + frame('05', 'Excessive breaks — externalise state', 'Two pods evicted under memory pressure break 188 sessions. The red hero and runbook recommend moving session state to Redis.', app(body('excessive'), { envState: 'red', notif: 2 }), { url: 'ops.skinlesionxai.health/sessions' })
  + frame('06', 'Sticky not configured', 'Round-robin is active with no affinity; the hero explains what enabling stickiness would change given the pod-local cache.', app(body('notconfigured'), { envState: 'neutral' }), { url: 'ops.skinlesionxai.health/sessions' });

const mobile = sectionHead('B', 'Mobile — affinity at a glance', '375px · bottom tabs · pod & break cards')
  + '<div class="frame-grid">'
  + mframe('M01', 'Loading skeleton', 'Pod and break cards pulse while affinity loads.', phone(mBodySkeleton(), { active: 'sessions' }))
  + mframe('M02', 'Affinity stable', 'Green hero; four balanced pods and a short break log.', phone(mBody('stable'), { active: 'sessions' }))
  + mframe('M03', 'Deploy in progress', 'Blue hero; draining pods and new replacements flagged, breaks labelled "deploy".', phone(mBody('deploy'), { active: 'sessions', notif: 1 }))
  + mframe('M04', 'Excessive breaks', 'Red hero and Redis recommendation; eviction breaks pinned to the top.', phone(mBody('excessive'), { active: 'sessions', envState: 'red', notif: 2 }))
  + mframe('M05', 'Not configured', 'Neutral hero explaining round-robin and the pod-local cache trade-off.', phone(mBody('notconfigured'), { active: 'sessions', envState: 'neutral' }))
  + '</div>';

mountShowcase([mast, desktop, mobile]);
