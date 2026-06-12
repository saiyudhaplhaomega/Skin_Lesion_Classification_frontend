/* ============================================================================
   E.2 — Idempotency-key log viewer (admin / operator).
   Audit idempotency-key usage to spot retry storms, duplicate-key collisions,
   replay attacks, or backend bugs. Operator surface — no PHI: patient
   identifiers are opaque tokens; response bodies are redacted. Loaded after kit.js.
   ============================================================================ */

const NAV = [
  { id: 'overview', label: 'Reliability overview', icon: 'layout-dashboard' },
  { id: 'dlq', label: 'Dead-letter queues', icon: 'inbox' },
  { id: 'idem', label: 'Idempotency keys', icon: 'key-round' },
  { id: 'breakers', label: 'Circuit breakers', icon: 'git-fork' },
  { id: 'flags', label: 'Feature flags', icon: 'toggle-right' },
  { id: 'slo', label: 'SLO & budgets', icon: 'target' },
];
const NAV_EXTRA = [
  { id: 'runbooks', label: 'Runbooks', icon: 'book-open' },
  { id: 'access', label: 'Access & roles', icon: 'shield' },
];
const USER = { initials: 'PA', name: 'P. Adeyemi', role: 'Platform reliability · operator' };

const EP = { consent: ['Consent', 'shield-check'], analysis: ['Analysis', 'scan-line'], 'lab-results': ['Lab results', 'file-text'], 'doctor-review': ['Doctor review', 'stethoscope'] };
const statusTone = (s) => s >= 500 ? 'red' : s >= 400 ? 'amber' : 'green';

/* request log rows (no PHI; tokens opaque, hashes truncated) */
const LOGS = [
  { sev: 'green', ts: '2026-06-06 09:17:44 UTC', ep: 'analysis', key: 'idmp_a91f…7c2', tok: 'pt_8KQ…', hash: 'sha256:4f9c…a1', status: 201, replays: 0 },
  { sev: 'blue', ts: '2026-06-06 09:17:31 UTC', ep: 'analysis', key: 'idmp_a91f…7c2', tok: 'pt_8KQ…', hash: 'sha256:4f9c…a1', status: 200, replays: 1, replay: true },
  { sev: 'green', ts: '2026-06-06 09:16:58 UTC', ep: 'consent', key: 'idmp_3b0e…d4', tok: 'pt_2MX…', hash: 'sha256:7a21…ee', status: 201, replays: 0 },
  { sev: 'amber', ts: '2026-06-06 09:15:12 UTC', ep: 'lab-results', key: 'idmp_c7d2…90', tok: 'pt_5RT…', hash: 'sha256:1c88…bf', status: 409, replays: 4, replay: true },
  { sev: 'green', ts: '2026-06-06 09:14:03 UTC', ep: 'doctor-review', key: 'idmp_f44a…12', tok: 'dr_9PL…', hash: 'sha256:9e02…7d', status: 200, replays: 0 },
  { sev: 'amber', ts: '2026-06-06 09:12:47 UTC', ep: 'analysis', key: 'idmp_88c1…aa', tok: 'pt_1ZB…', hash: 'sha256:b3f7…40', status: 429, replays: 6, replay: true },
];
const COLLISION = { sev: 'red', ts: '2026-06-06 09:18:02 UTC', ep: 'consent', key: 'idmp_d10c…ef', tok: 'pt_7QW…', hash: 'sha256:c0ffee…2 ≠ sha256:dead…9', status: 422, replays: 0, collision: true };

function kpis(kind) {
  const coll = kind === 'collision'; const hi = kind === 'high-replay' || coll;
  return `<div class="kpi-strip c4">
    <div class="kpi-tile lead"><span class="kt-l">${ic('key-round')}Keys recorded · 24h</span><span class="kt-v">48,210</span><span class="kt-foot">${sparkline([41,43,42,45,44,47,48], { tone: 'accent', w: 120, h: 26 })}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('rotate-ccw')}Replay-hit rate</span><span class="kt-v">${hi ? '6.8' : '2.1'}<small>%</small></span><span class="kt-foot">${hi ? statline('amber', 'trending-up', 'above 4% threshold') : statline('green', 'check-circle', 'within range')}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('git-merge')}Collisions</span><span class="kt-v">${coll ? 1 : 0}</span><span class="kt-foot">${coll ? statline('red', 'alert-octagon', 'same key, different body') : statline('green', 'check-circle', 'none in range')}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('timer')}p95 handling</span><span class="kt-v">38<small>ms</small></span><span class="kt-foot">server-side dedupe lookup</span></div>
  </div>`;
}
function riskBanner(kind) {
  if (kind === 'collision') return stateHero('red', 'alert-octagon', 'Idempotency-key collision detected', 'A single key was reused with a <b>different request body</b> on the consent endpoint. This points to a client bug or a replay attack — the server rejected the second write with 422. Investigate the source before it corrupts state.', { meta: [['hash', 'request-hash mismatch'], ['shield-alert', 'consent endpoint']], ts: '09:18 UTC' });
  if (kind === 'high-replay') return stateHero('amber', 'alert-triangle', 'Replay rate is above the 4% threshold', 'Replay-hit rate has risen to <b>6.8%</b> over the last hour, concentrated on the analysis endpoint. Likely a client retry storm — not yet a collision, but worth tracing.', { meta: [['repeat', 'analysis +retries'], ['percent', '6.8% replays']], ts: '09:18 UTC' });
  return stateHero('green', 'shield-check', 'Idempotency keys look healthy', 'No collisions in the selected range and replay rate is within the normal band. Duplicate requests are being safely de-duplicated server-side.', { meta: [['key-round', '48,210 keys / 24h'], ['rotate-ccw', '2.1% replays']], ts: '09:18 UTC' });
}
function filters() {
  return `<div class="filters">
    <span class="f-search">${ic('search')}<input placeholder="Filter by key, patient token, request hash…" /></span>
    <span class="f-sel">${ic('git-branch')}Endpoint <span class="fv">All</span>${ic('chevron-down')}</span>
    <span class="f-sel">${ic('activity')}Status <span class="fv">All</span>${ic('chevron-down')}</span>
    <span class="f-sel">${ic('calendar')}<span class="fv">Last 1h</span>${ic('chevron-down')}</span>
    <span class="f-spacer"></span>
    <span class="t-time">live tail · 09:18 UTC</span>
  </div>`;
}
function logRow(l, sel) {
  return `<tr class="clickable sev-row ${sel ? 'sel' : ''}">
    <td style="width:14px"><span class="sev-cell"><span class="sev-rail ${l.sev}"></span></span></td>
    <td class="mono">${l.ts}</td>
    <td><span class="rolechip">${ic(EP[l.ep][1])}${EP[l.ep][0]}</span></td>
    <td><span class="tok">${l.key}</span></td>
    <td><span class="tok">${l.tok}</span> <span class="redact-pill">${ic('shield')}token</span></td>
    <td><span class="payload">${l.hash}</span></td>
    <td class="num"><span class="conf-chip ${statusTone(l.status)}">${l.status}</span></td>
    <td class="num">${l.replays > 0 ? `<span class="conf-chip ${l.replays >= 5 ? 'amber' : 'green'}">${l.replays}×</span>` : '<span class="t-na">—</span>'}</td>
    <td class="num"><div class="row-act"><button class="mini-btn">${ic('eye')}View</button></div></td>
  </tr>`;
}
function logTable(rows, selKey) {
  return `<div class="opc">
    ${filters()}
    <table class="dtable">
      <thead><tr><th></th><th>Timestamp</th><th>Endpoint</th><th>Idempotency key</th><th>Patient token</th><th>Request hash</th><th class="num">Status</th><th class="num">Replays</th><th class="num">Action</th></tr></thead>
      <tbody>${rows.map(l => logRow(l, l.key === selKey)).join('')}</tbody>
    </table>
    <div class="t-foot"><span class="tf-info">Keys truncated · patient identifiers are opaque tokens · response bodies redacted</span><span class="tf-pages"><button>1</button><button class="on">2</button><button>3</button></span></div>
  </div>`;
}
function detailPanel(l, { collision = false } = {}) {
  return `<div class="detail-panel">
    <div class="dp-head"><div class="dp-ic ${collision ? 'red' : 'blue'}">${ic(collision ? 'git-merge' : 'key-round')}</div>
      <div class="dp-main"><div class="dp-t">${collision ? 'Key collision' : 'Idempotency record'}</div><div class="dp-id">${l.key} · ${EP[l.ep][0]}</div></div>
      <button class="dh-close">${ic('x')}</button></div>
    <div class="dp-body">
      <div><div class="dp-sec-lab">${ic('info')}Record</div>
        <div class="dp-row"><span class="dl">Endpoint</span><span class="dv mono">POST /${l.ep}</span></div>
        <div class="dp-row"><span class="dl">Patient token</span><span class="dv mono">${l.tok}</span></div>
        <div class="dp-row"><span class="dl">Created</span><span class="dv mono">2026-06-06 09:17:31 UTC</span></div>
        <div class="dp-row"><span class="dl">Response status</span><span class="dv">${statline(statusTone(l.status), l.status >= 400 ? 'alert-triangle' : 'check-circle', String(l.status))}</span></div>
        <div class="dp-row"><span class="dl">Replay count</span><span class="dv">${l.replays}</span></div>
      </div>
      <div><div class="dp-sec-lab">${ic('hash')}Request hash${collision ? ' — mismatch' : ''}</div>
        <div class="codeblock"><pre>${collision
          ? `<span class="cc"># first write</span>
<span class="cs">sha256:c0ffee21…a1</span>
<span class="cc"># second write — same key, DIFFERENT body</span>
<span class="credact" style="color:#f0a0a0">sha256:dead0009…7d</span>  <span class="cc">← rejected (422)</span>`
          : `<span class="cs">${l.hash}</span>
<span class="cc"># matches original — returned cached 200</span>`}</pre></div></div>
      <div><div class="dp-sec-lab">${ic('braces')}Response body (PHI redacted)</div>
        <div class="codeblock"><pre>{
  <span class="ck">"status"</span>: <span class="cs">"${l.status >= 400 ? 'rejected' : 'ok'}"</span>,
  <span class="ck">"resourceId"</span>: <span class="cs">"tok_an_…"</span>,
  <span class="ck">"body"</span>: <span class="credact">"[REDACTED — PHI]"</span>
}</pre></div></div>
      <div><div class="dp-sec-lab">${ic('history')}Replay timestamps</div>
        ${l.replays > 0 ? `<div class="dp-row"><span class="dl mono">09:17:31</span><span class="dv">cache hit · 200</span></div>${l.replays > 3 ? `<div class="dp-row"><span class="dl mono">09:15:02</span><span class="dv">cache hit · 200</span></div><div class="dp-row"><span class="dl mono">09:13:48</span><span class="dv">cache hit · 200</span></div>` : ''}` : '<div class="dp-row"><span class="dl">No replays recorded</span><span class="dv">—</span></div>'}
      </div>
      ${collision ? runbook('red', 'Trace the client and freeze the key namespace', 'A reused key with a different body is a client bug or a replay attack. Identify the caller from the access log, then rotate the affected key prefix.', 'Open collision runbook') : ''}
    </div>
    <div class="dp-foot"><button class="btn btn-secondary">${ic('copy')}Copy key</button><button class="btn btn-secondary">${ic('list')}View all replays</button></div>
  </div>`;
}

function bodyHealthy() {
  return `${riskBanner('healthy')}${kpis('healthy')}${rsec('list', 'Request log', { meta: 'live tail · newest first', opOnly: true })}${logTable(LOGS, null)}${opsNote('<b>Operator surface — not patient-facing.</b> Idempotency keys are truncated; patient identifiers are opaque tokens; response bodies and request payloads are redacted. No PHI is present.')}`;
}
function bodyHighReplay() {
  return `${riskBanner('high-replay')}${kpis('high-replay')}${rsec('list', 'Request log', { meta: 'replay-weighted', opOnly: true })}${logTable(LOGS, null)}${runbook('amber', 'Confirm a client retry storm, not a real failure', 'Most replays returned cached 200s — the server is de-duplicating correctly. Check the client release that started the spike and tune its retry backoff.')}${opsNote('<b>Operator surface — not patient-facing.</b> No PHI. Replays are safe cache hits; bodies are redacted.')}`;
}
function bodyCollision() {
  const rows = [COLLISION, ...LOGS];
  return `${riskBanner('collision')}${kpis('collision')}${rsec('list', 'Request log', { meta: 'collision pinned to top', opOnly: true })}<div class="split">${logTable(rows, COLLISION.key)}${detailPanel(COLLISION, { collision: true })}</div>${opsNote('<b>Operator surface — not patient-facing.</b> The collision was rejected before any write. Hashes are shown to compare requests; no PHI is exposed.')}`;
}
function bodyEmpty() {
  return `${kpis('healthy')}<div class="opc"><div class="state-box"><div class="sb-ic accent">${ic('key-round')}</div><h4>No idempotency keys recorded in this range</h4><p>Widen the date range or clear the endpoint filter. Keys are written on every state-changing request and expire after 24h.</p><div class="sb-act"><button class="btn btn-secondary">${ic('calendar')}Last 24h</button><button class="btn btn-ghost">${ic('filter-x')}Clear filters</button></div></div></div>${opsNote('<b>Operator surface — not patient-facing.</b> No PHI. Keys expire 24h after creation.')}`;
}
function bodySkeleton() {
  const tile = () => `<div class="kpi-tile"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:40%;height:26px;margin:9px 0 6px"></div><div class="skel skel-line" style="width:70%"></div></div>`;
  const row = () => `<div class="skel-row"><div class="skel" style="width:4px;height:30px;border-radius:2px"></div><div class="skel skel-line" style="width:130px"></div><div class="skel skel-line" style="width:80px"></div><div class="skel skel-line" style="width:110px"></div><div class="skel skel-line" style="flex:1"></div><div class="skel skel-line" style="width:50px"></div></div>`;
  return `<div class="kpi-strip c4">${tile()}${tile()}${tile()}${tile()}</div><div class="r-sec" style="margin-top:var(--sp-xl)"><div class="skel skel-line" style="width:120px;height:13px"></div><span class="r-rule"></span></div><div class="opc">${row()}${row()}${row()}${row()}${row()}</div><div style="display:flex;align-items:center;gap:10px;justify-content:center;color:var(--text-muted);font-size:12.5px;margin-top:var(--sp-xl)"><span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Loading idempotency-key log…</div>`;
}

/* mobile */
const M_TABS = [{ id: 'overview', label: 'Overview', icon: 'layout-dashboard' }, { id: 'idem', label: 'Keys', icon: 'key-round' }, { id: 'breakers', label: 'Breakers', icon: 'git-fork' }, { id: 'slo', label: 'SLO', icon: 'target' }];
function mKpis(kind) {
  const coll = kind === 'collision'; const hi = kind === 'high-replay' || coll;
  return `<div class="m-kpis">
    <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('key-round')}</span><span class="mk-name">Keys 24h</span></div><div class="mk-val sm">48.2k</div><div class="mk-foot">recorded</div></div>
    <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('rotate-ccw')}</span><span class="mk-name">Replay rate</span></div><div class="mk-val sm">${hi ? '6.8%' : '2.1%'}</div><div class="mk-foot">${hi ? 'above threshold' : 'in range'}</div></div>
    <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('git-merge')}</span><span class="mk-name">Collisions</span></div><div class="mk-val">${coll ? 1 : 0}</div><div class="mk-foot">${coll ? 'investigate' : 'none'}</div></div>
    <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('timer')}</span><span class="mk-name">p95</span></div><div class="mk-val sm">38ms</div><div class="mk-foot">dedupe lookup</div></div>
  </div>`;
}
function mLogRow(l) {
  return `<div class="m-logrow"><span class="lr-rail ${l.sev}"></span><div class="lr-body">
    <div class="lr-top"><span class="lr-id">${l.key}</span><span class="lr-time">${l.ts.split(' ')[1]}</span></div>
    <div class="lr-err"><span class="rolechip">${ic(EP[l.ep][1])}${EP[l.ep][0]}</span></div>
    <div class="lr-payload">${l.hash}</div>
    <div class="lr-meta"><span class="conf-chip ${statusTone(l.status)}">${l.status}</span>${l.replays > 0 ? `<span class="conf-chip ${l.replays >= 5 ? 'amber' : 'green'}">${l.replays}× replay</span>` : ''}<span class="redact-pill">${ic('shield')}token</span></div>
  </div></div>`;
}
function mHero(kind) {
  if (kind === 'collision') return `<div class="m-hero red"><div class="mh-ic">${ic('alert-octagon')}</div><div class="mh-main"><div class="mh-t">Key collision detected</div><div class="mh-d">Same key, <b>different body</b> on consent. Server rejected with 422.</div></div></div>`;
  if (kind === 'high-replay') return `<div class="m-hero amber"><div class="mh-ic">${ic('alert-triangle')}</div><div class="mh-main"><div class="mh-t">Replay rate above 4%</div><div class="mh-d">Now <b>6.8%</b> on analysis — likely a client retry storm.</div></div></div>`;
  return `<div class="m-hero green"><div class="mh-ic">${ic('shield-check')}</div><div class="mh-main"><div class="mh-t">Keys healthy</div><div class="mh-d">No collisions; <b>2.1%</b> replays, safely de-duplicated.</div></div></div>`;
}
function mBody(kind) {
  const rows = kind === 'collision' ? [COLLISION, ...LOGS] : LOGS;
  return `${mHero(kind)}${mKpis(kind)}${mSecHead('list', 'Request log', { opOnly: true, more: 'live' })}<div class="m-card">${rows.slice(0, 5).map(mLogRow).join('')}</div>${kind === 'collision' ? `<div class="m-runbook red"><div class="mr-ic">${ic('book-open')}</div><div><div class="mr-t">What to do now</div><div class="mr-h">Trace the caller, rotate the key prefix</div><div class="mr-d">A reused key with a different body is a client bug or replay attack.</div><a class="mr-link">${ic('external-link')}Open runbook</a></div></div>` : ''}`;
}
function mBodyEmpty() {
  return `${mKpis('healthy')}<div class="m-card"><div class="state-box"><div class="sb-ic accent">${ic('key-round')}</div><h4>No keys in range</h4><p>Widen the range or clear filters. Keys expire after 24h.</p></div></div>`;
}
function mBodySkeleton() {
  const k = () => `<div class="m-kpi"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:40%;height:18px;margin:9px 0 5px"></div><div class="skel skel-line" style="width:70%"></div></div>`;
  const r = () => `<div style="padding:12px 13px;border-bottom:1px solid var(--border);display:flex;gap:10px"><div class="skel" style="width:4px;height:40px;border-radius:2px"></div><div style="flex:1"><div class="skel skel-line" style="width:60%"></div><div class="skel skel-line" style="width:40%;margin-top:8px"></div></div></div>`;
  return `<div class="m-kpis">${k()}${k()}${k()}${k()}</div><div class="m-card">${r()}${r()}${r()}</div>`;
}

const app = (b, o = {}) => desktopApp(b, { nav: NAV, navExtra: NAV_EXTRA, navActive: 'idem', navLabel: 'Reliability', title: 'Idempotency keys', user: USER, search: 'Search keys, tokens, hashes…', ...o });
const phone = (b, o = {}) => mPhone(b, { tabs: M_TABS, active: 'idem', eyebrow: 'Reliability · operator', title: 'Idempotency keys', ...o });

const mast = masthead({
  eyebrow: 'Skin Lesion XAI · Clinical Premium · operator only',
  title: 'Idempotency-key log viewer',
  sub: 'An internal operator surface for auditing idempotency-key usage across the consent, analysis, lab-results and doctor-review endpoints — to catch retry storms, duplicate-key collisions, replay attacks, and backend bugs. Not patient-facing: keys are truncated, patient identifiers are opaque tokens, and response bodies are redacted.',
  legend: ['Status — color + icon + text', ['green', 'check-circle', '2xx — accepted / cached'], ['amber', 'alert-triangle', '4xx — client / replay'], ['red', 'alert-octagon', 'Key collision'], ['neutral', 'shield', 'Tokenised, no PHI']],
});

const desktop = sectionHead('A', 'Desktop — idempotency-key log viewer', '1440px · operator console')
  + frame('01', 'Loading skeleton', 'Shell, KPI scaffold and the log table frame paint immediately; the live tail pulses while records load.', app(bodySkeleton()), { url: 'ops.skinlesionxai.health/idempotency' })
  + frame('02', 'Healthy — normal traffic', 'A green summary, healthy KPIs and a live request tail. Replays show as cache-hit rows in blue with a replay count.', app(bodyHealthy()), { url: 'ops.skinlesionxai.health/idempotency' })
  + frame('03', 'Elevated replay rate', 'An amber banner explains a retry storm on the analysis endpoint; the runbook confirms the replays are safe cache hits and points to the client release to tune.', app(bodyHighReplay(), { envState: 'amber', notif: 1 }), { url: 'ops.skinlesionxai.health/idempotency' })
  + frame('04', 'Key collision — detail open', 'A red banner pins the collision to the top of the log; the detail panel shows the two mismatched request hashes, the redacted response, and a runbook to trace the caller.', app(bodyCollision(), { envState: 'red', notif: 1 }), { url: 'ops.skinlesionxai.health/idempotency' })
  + frame('05', 'Empty range', 'No keys match the current filter. A friendly empty state offers a wider range and a filter reset.', app(bodyEmpty()), { url: 'ops.skinlesionxai.health/idempotency' });

const mobile = sectionHead('B', 'Mobile — on-call audit', '375px · bottom tabs · log cards')
  + '<div class="frame-grid">'
  + mframe('M01', 'Loading skeleton', 'Shell and tab bar paint instantly; KPI tiles and log rows pulse while the tail loads.', phone(mBodySkeleton(), { active: 'idem' }))
  + mframe('M02', 'Healthy tail', 'Log entries collapse to cards with endpoint chip, request hash, status and replay count.', phone(mBody('healthy'), { active: 'idem' }))
  + mframe('M03', 'Elevated replays', 'The amber hero leads; replay counts surface on each affected analysis row.', phone(mBody('high-replay'), { active: 'idem', envState: 'amber', notif: 1 }))
  + mframe('M04', 'Collision', 'The red hero names the collision; the runbook tells the operator to trace the caller and rotate the key prefix.', phone(mBody('collision'), { active: 'idem', envState: 'red', notif: 1 }))
  + mframe('M05', 'Empty range', 'No keys match — widen the range or clear filters.', phone(mBodyEmpty(), { active: 'idem' }))
  + '</div>';

mountShowcase([mast, desktop, mobile]);
