/* ============================================================================
   E.1 — Dead-letter queue inspector (admin / operator).
   Inspect messages that failed processing in the training-eligibility, lab-OCR,
   and de-identification SQS queues; triage, view detail, replay, or archive.
   Operator surface — no raw PHI: payloads are redacted, patient identifiers are
   opaque tokens. Status is color + icon + text. Loaded after kit.js.
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

/* ── Queue fixtures (no PHI; payloads redacted, tokens opaque) ───────── */
const QUEUES = [
  { id: 'training-eligibility-dlq', short: 'training-eligibility', depth: 3, alarm: false },
  { id: 'lab-ocr-dlq', short: 'lab-ocr', depth: 2, alarm: false },
  { id: 'deidentification-dlq', short: 'deidentification', depth: 0, alarm: false },
  { id: 'training-pipeline-dlq', short: 'training-pipeline', depth: 1, alarm: true },
];

const MSGS = [
  { sev: 'amber', ts: '2026-06-06 08:41 UTC', id: 'msg-7f3a91c2', queue: 'training-eligibility-dlq', err: 'ConsentStateMismatch', retries: 3, age: '2h 17m',
    payload: '{ "caseToken":"tok_9Q…", "consent":"withdrawn", "eligible":true,…' },
  { sev: 'amber', ts: '2026-06-06 07:18 UTC', id: 'msg-2b8e44df', queue: 'lab-ocr-dlq', err: 'OcrTimeout', retries: 5, age: '3h 40m',
    payload: '{ "labDocToken":"tok_4F…", "pages":7, "engine":"textract-v2",…' },
  { sev: 'amber', ts: '2026-06-06 06:52 UTC', id: 'msg-91c0a7b5', queue: 'training-eligibility-dlq', err: 'SchemaValidationError', retries: 2, age: '4h 06m',
    payload: '{ "caseToken":"tok_1A…", "label":"[REDACTED]", "fitz":"unknown",…' },
  { sev: 'amber', ts: '2026-06-06 06:30 UTC', id: 'msg-5d7e10aa', queue: 'lab-ocr-dlq', err: 'UnreadableDocument', retries: 4, age: '4h 28m',
    payload: '{ "labDocToken":"tok_7C…", "mime":"image/heic", "blurScore":0.81,…' },
  { sev: 'amber', ts: '2026-06-06 05:09 UTC', id: 'msg-c4f2bb19', queue: 'training-eligibility-dlq', err: 'ConsentStateMismatch', retries: 3, age: '5h 49m',
    payload: '{ "caseToken":"tok_3D…", "consent":"pending", "eligible":false,…' },
];
const CRIT_MSG = { sev: 'red', ts: '2026-06-06 09:02 UTC', id: 'msg-e80a3f47', queue: 'training-pipeline-dlq', err: 'DeIdLeakGuardTripped', retries: 6, age: '14m',
  payload: '{ "batchToken":"tok_B2…", "guard":"phi-leak", "stage":"write",…' };

/* ── KPI strip ───────────────────────────────────────────────────────── */
function kpis(kind) {
  const crit = kind === 'critical';
  const warn = kind === 'warning' || crit;
  const depth = crit ? 6 : warn ? 5 : 0;
  return `<div class="kpi-strip c4">
    <div class="kpi-tile lead">
      <span class="kt-l">${ic('inbox')}Total DLQ depth</span>
      <span class="kt-v">${depth}<small>${depth === 1 ? 'message' : 'messages'}</small></span>
      <span class="kt-foot">across 4 queues · ${crit ? statline('red', 'alert-octagon', '1 alarm firing') : warn ? statline('amber', 'alert-triangle', 'no alarm') : statline('green', 'check-circle', 'happy path')}</span>
    </div>
    <div class="kpi-tile">
      <span class="kt-l">${ic('clock')}Oldest message age</span>
      <span class="kt-v">${depth === 0 ? '—' : crit ? '5h 49m' : '5h 49m'}</span>
      <span class="kt-foot">${depth === 0 ? 'no messages queued' : 'training-eligibility-dlq'}</span>
    </div>
    <div class="kpi-tile">
      <span class="kt-l">${ic('arrow-down-to-line')}New arrivals · 1h</span>
      <span class="kt-v">${crit ? 2 : warn ? 1 : 0}</span>
      <span class="kt-foot">${crit ? statline('red', 'trending-up', 'training-pipeline +1') : 'within expected rate'}</span>
    </div>
    <div class="kpi-tile">
      <span class="kt-l">${ic('rotate-ccw')}Replays · 24h</span>
      <span class="kt-v">7</span>
      <span class="kt-foot">5 succeeded · 2 re-queued</span>
    </div>
  </div>`;
}

/* ── Queue selector tabs ─────────────────────────────────────────────── */
function queueTabs(active, kind) {
  return `<div class="opc" style="margin-bottom:var(--sp-md)"><div class="qsel">
    ${QUEUES.map(q => {
      const depth = (kind === 'healthy') ? 0 : (q.id === 'training-pipeline-dlq' ? (kind === 'critical' ? 1 : 0) : q.depth);
      const alarm = kind === 'critical' && q.alarm;
      const tone = alarm ? 'red' : depth > 0 ? 'amber' : 'green';
      return `<button class="qtab ${q.id === active ? 'on' : ''}">
        <span class="qt-led ${tone}"></span>
        <span class="qt-name">${q.short}</span>
        <span class="qt-depth ${depth > 0 ? (alarm ? 'red' : 'amber') : ''}">${depth}</span>
      </button>`;
    }).join('')}
  </div></div>`;
}

/* ── Message table ───────────────────────────────────────────────────── */
function msgRow(m, sel) {
  return `<tr class="clickable sev-row ${sel ? 'sel' : ''}">
    <td><span class="sev-cell"><span class="sev-rail ${m.sev}"></span></span></td>
    <td class="mono">${m.ts}</td>
    <td><span class="tok">${m.id}</span></td>
    <td><span class="err-class">${m.err}</span></td>
    <td class="num"><span class="conf-chip ${m.retries >= 5 ? 'red' : 'amber'}">${m.retries}/6</span></td>
    <td class="mono">${m.age}</td>
    <td><span class="payload">${m.payload}</span> <span class="redact-pill">${ic('shield')}PHI redacted</span></td>
    <td class="num"><div class="row-act"><button class="mini-btn">${ic('eye')}View</button></div></td>
  </tr>`;
}
function msgTable(rows, selId) {
  return `<div class="opc">
    <div class="filters">
      <span class="f-search">${ic('search')}<input placeholder="Filter by message ID, error class…" /></span>
      <span class="f-sel">${ic('alert-triangle')}Error class <span class="fv">All</span>${ic('chevron-down')}</span>
      <span class="f-sel">${ic('layers')}Retries <span class="fv">≥ 2</span>${ic('chevron-down')}</span>
      <span class="f-spacer"></span>
      <span class="t-time">refreshed 09:18 UTC</span>
    </div>
    <table class="dtable">
      <thead><tr><th style="width:14px"></th><th>Timestamp</th><th>Message ID</th><th>Error class</th><th class="num">Retries</th><th>Age</th><th>Payload preview</th><th class="num">Action</th></tr></thead>
      <tbody>${rows.map(m => msgRow(m, m.id === selId)).join('')}</tbody>
    </table>
    <div class="t-foot"><span class="tf-info">Showing ${rows.length} of ${rows.length} messages · payloads truncated to 80 chars, PHI redacted</span></div>
  </div>`;
}

/* ── Detail panel ────────────────────────────────────────────────────── */
function detailPanel(m, { critical = false } = {}) {
  return `<div class="detail-panel">
    <div class="dp-head">
      <div class="dp-ic ${critical ? 'red' : 'amber'}">${ic(critical ? 'alert-octagon' : 'file-warning')}</div>
      <div class="dp-main"><div class="dp-t">${m.err}</div><div class="dp-id">${m.id} · ${m.queue}</div></div>
      <button class="dh-close">${ic('x')}</button>
    </div>
    <div class="dp-body">
      <div>
        <div class="dp-sec-lab">${ic('info')}Message facts</div>
        <div class="dp-row"><span class="dl">Source queue</span><span class="dv mono">${m.queue}</span></div>
        <div class="dp-row"><span class="dl">Received</span><span class="dv mono">${m.ts}</span></div>
        <div class="dp-row"><span class="dl">Retry count</span><span class="dv">${m.retries} of 6 (max)</span></div>
        <div class="dp-row"><span class="dl">Age in queue</span><span class="dv">${m.age}</span></div>
        <div class="dp-row"><span class="dl">Severity</span><span class="dv">${statline(m.sev, critical ? 'alert-octagon' : 'alert-triangle', critical ? 'Alarm firing' : 'Needs triage')}</span></div>
      </div>
      <div>
        <div class="dp-sec-lab">${ic('braces')}Payload (PHI redacted) <span class="redact-pill" style="margin-left:auto">${ic('shield')}safe view</span></div>
        <div class="codeblock"><pre>{
  <span class="ck">"messageId"</span>: <span class="cs">"${m.id}"</span>,
  <span class="ck">"caseToken"</span>: <span class="cs">"tok_9Q3f…c21"</span>,
  <span class="ck">"label"</span>: <span class="credact">"[REDACTED — PHI]"</span>,
  <span class="ck">"consentState"</span>: <span class="cs">"${critical ? 'consented' : 'withdrawn'}"</span>,
  <span class="ck">"bodyRegion"</span>: <span class="cs">"forearm-L"</span>,
  <span class="ck">"imageUri"</span>: <span class="credact">"[REDACTED — signed URL]"</span>,
  <span class="ck">"retryCount"</span>: <span class="cn">${m.retries}</span>
}</pre></div>
      </div>
      <div>
        <div class="dp-sec-lab">${ic('bug')}Stack trace</div>
        <div class="trace"><pre>${critical
          ? `DeIdLeakGuardError: phi token reached write stage
  <span class="tdim">at DeIdGuard.assertClean (deid/guard.ts:142)</span>
  <span class="tdim">at TrainingWriter.flush (pipeline/write.ts:88)</span>
  <span class="tdim">at processBatch (pipeline/batch.ts:51)</span>`
          : `ConsentStateMismatchError: eligible=true but consent=withdrawn
  <span class="tdim">at EligibilityCheck.run (train/eligibility.ts:73)</span>
  <span class="tdim">at QueueConsumer.handle (sqs/consumer.ts:39)</span>`}</pre></div>
      </div>
      ${runbook(critical ? 'red' : 'amber',
        critical ? 'Do not replay — escalate to the de-identification on-call' : 'Fix consent state, then replay',
        critical
          ? 'The PHI leak guard tripped before any data was written. <b>Replay is blocked.</b> Page the de-id on-call and attach this message ID.'
          : 'This case has withdrawn consent but was marked training-eligible. Correct the consent record upstream, then replay the message.',
        critical ? 'Open de-id incident runbook' : 'Open consent-mismatch runbook')}
    </div>
    <div class="dp-foot">
      ${critical
        ? `<button class="btn btn-secondary" style="flex:1">${ic('archive')}Archive</button><button class="btn btn-danger" disabled style="opacity:.55">${ic('rotate-ccw')}Replay blocked</button>`
        : `<button class="btn btn-secondary">${ic('archive')}Archive</button><button class="btn btn-primary">${ic('rotate-ccw')}Replay…</button>`}
    </div>
  </div>`;
}

/* ── Bodies ──────────────────────────────────────────────────────────── */
function bodyHealthy() {
  return `
  ${stateHero('green', 'shield-check', 'All dead-letter queues are empty', 'No messages failed processing across the training-eligibility, lab-OCR, de-identification, or training-pipeline queues. This is the happy path.', { ts: '09:18 UTC' })}
  ${kpis('healthy')}
  ${rsec('inbox', 'Queues', { meta: 'depth · alarm state', opOnly: true })}
  ${queueTabs('training-eligibility-dlq', 'healthy')}
  <div class="opc"><div class="state-box"><div class="sb-ic green">${ic('inbox')}</div>
    <h4>No messages in the dead-letter queue</h4>
    <p>This is the happy path. Messages only appear here after a handler exhausts its retries. When that happens, you'll see them listed with a redacted payload preview and a triage action.</p>
    <span class="t-time" style="margin-top:8px">Polling every 30s · last poll 09:18 UTC</span></div></div>
  ${opsNote('<b>Operator surface — not patient-facing.</b> No protected health information is present. Payloads are truncated and redacted; patient identifiers are opaque tokens. Replays and archives are recorded to the change log.')}`;
}
function bodyWarning() {
  return `
  ${stateHero('amber', 'alert-triangle', '5 messages waiting in 2 queues — no alarm fired', 'Depth is above zero but below the alarm threshold. The oldest message has been queued for <b>5h 49m</b>. Triage before the alarm trips.', { meta: [['inbox', '5 messages'], ['clock', 'oldest 5h 49m'], ['bell-off', 'no alarm']], ts: '09:18 UTC' })}
  ${kpis('warning')}
  ${rsec('inbox', 'Queues', { meta: 'depth · alarm state', opOnly: true })}
  ${queueTabs('training-eligibility-dlq', 'warning')}
  ${rsec('list', 'Messages · training-eligibility-dlq', { meta: 'newest first' })}
  ${msgTable(MSGS, null)}
  ${runbook('amber', 'Work the oldest messages first', 'Two error classes dominate: <b>ConsentStateMismatch</b> and <b>OcrTimeout</b>. Open each message to see the redacted payload and the per-class runbook before replaying.')}
  ${opsNote('<b>Operator surface — not patient-facing.</b> Payloads are truncated to 80 chars and PHI is redacted; identifiers are opaque tokens. Every replay / archive is logged with your operator ID.')}`;
}
function bodyCritical() {
  const rows = [CRIT_MSG, ...MSGS];
  return `
  ${stateHero('red', 'alert-octagon', 'PHI leak guard tripped — training-pipeline-dlq alarm firing', 'A message reached the dead-letter queue because the de-identification leak guard blocked it before write. <b>Replay is blocked</b> for this message until reviewed.', { meta: [['siren', 'alarm: dlq-phi-guard'], ['clock', 'fired 14m ago']], ts: '09:18 UTC' })}
  ${kpis('critical')}
  ${rsec('inbox', 'Queues', { meta: 'depth · alarm state', opOnly: true })}
  ${queueTabs('training-pipeline-dlq', 'critical')}
  ${rsec('list', 'Messages · all queues', { meta: 'severity-sorted' })}
  <div class="split">
    ${msgTable(rows, CRIT_MSG.id)}
    ${detailPanel(CRIT_MSG, { critical: true })}
  </div>
  ${opsNote('<b>Operator surface — not patient-facing.</b> The leak guard prevented any PHI from being written. No protected health information is displayed here; payloads are redacted and identifiers are tokens.')}`;
}
function bodyUnauthorised() {
  return `
  ${kpis('healthy')}
  <div class="opc"><div class="state-box"><div class="sb-ic red">${ic('lock')}</div>
    <h4>You don't have permission to read DLQ depth</h4>
    <p>Failed to load dead-letter queue depth — the operator role is missing the <span class="payload">sqs:GetQueueAttributes</span> permission for these queues. Ask an administrator to grant the reliability-operator policy, then reload.</p>
    <div class="sb-act"><button class="btn btn-primary">${ic('refresh-cw')}Retry</button><button class="btn btn-secondary">${ic('shield')}Request access</button></div>
    <span class="t-time" style="margin-top:8px">Checked 09:18 UTC · role: read-only-viewer</span></div></div>
  ${opsNote('<b>Operator surface — not patient-facing.</b> Access to queue internals is role-gated. No PHI is exposed even with full access; payloads are always redacted.')}`;
}
function bodySkeleton() {
  const tile = () => `<div class="kpi-tile"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:45%;height:26px;margin:9px 0 6px"></div><div class="skel skel-line" style="width:70%"></div></div>`;
  const row = () => `<div class="skel-row"><div class="skel" style="width:4px;height:34px;border-radius:2px"></div><div class="skel skel-line" style="width:120px"></div><div class="skel skel-line" style="width:90px"></div><div class="skel skel-line" style="width:130px"></div><div class="skel skel-line" style="width:50px"></div><div class="skel skel-line" style="flex:1"></div></div>`;
  return `
  <div class="kpi-strip c4">${tile()}${tile()}${tile()}${tile()}</div>
  <div class="r-sec" style="margin-top:var(--sp-xl)"><div class="skel skel-line" style="width:140px;height:13px"></div><span class="r-rule"></span></div>
  <div class="opc">${row()}${row()}${row()}${row()}</div>
  <div style="display:flex;align-items:center;gap:10px;justify-content:center;color:var(--text-muted);font-size:12.5px;margin-top:var(--sp-xl)"><span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Loading dead-letter queue depth & messages…</div>`;
}

/* ── Replay confirmation modal ───────────────────────────────────────── */
function replayModal() {
  return `<div class="modal-scrim"><div class="modal">
    <div class="modal-head">
      <div class="mh-ic" style="background:var(--accent-light);color:var(--accent)">${ic('rotate-ccw')}</div>
      <div><div class="mh-t">Replay this message?</div><div class="mh-s">Re-queues <b style="font-family:var(--font-mono);font-weight:500;color:var(--text-primary)">msg-7f3a91c2</b> to <b style="color:var(--text-primary)">training-eligibility</b> for another processing attempt. Confirm the upstream fix landed first.</div></div>
    </div>
    <div class="modal-body">
      <div class="consequences"><div class="cq-h">What this does</div><ul>
        <li class="keep">${ic('rotate-ccw')}<span>The message is moved back to the <b>source queue</b> and processed again from the start.</span></li>
        <li class="keep">${ic('shield-check')}<span>The payload is <b>unchanged and still redacted</b> in this view — no PHI is exposed.</span></li>
        <li class="neg">${ic('repeat')}<span>If the root cause isn't fixed, it will <b>return to the DLQ</b> after retries are exhausted.</span></li>
      </ul></div>
      <div class="confirm-input"><label>Replay reason (recorded to the change log)</label><input placeholder="e.g. consent record corrected in case service" /></div>
    </div>
    <div class="modal-foot"><button class="btn btn-secondary">${ic('x')}Cancel</button><button class="btn btn-primary">${ic('rotate-ccw')}Replay message</button></div>
  </div></div>`;
}

/* ════════════════════════════════════════════════════════════════════════
   MOBILE
   ════════════════════════════════════════════════════════════════════════ */
const M_TABS = [
  { id: 'overview', label: 'Overview', icon: 'layout-dashboard' },
  { id: 'dlq', label: 'DLQ', icon: 'inbox' },
  { id: 'breakers', label: 'Breakers', icon: 'git-fork' },
  { id: 'slo', label: 'SLO', icon: 'target' },
];
function mKpis(kind) {
  const crit = kind === 'critical'; const warn = kind === 'warning' || crit;
  const depth = crit ? 6 : warn ? 5 : 0;
  return `<div class="m-kpis">
    <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('inbox')}</span><span class="mk-name">DLQ depth</span></div><div class="mk-val">${depth}</div><div class="mk-foot">${crit ? '1 alarm firing' : warn ? 'no alarm' : 'happy path'}</div></div>
    <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('clock')}</span><span class="mk-name">Oldest age</span></div><div class="mk-val sm">${depth === 0 ? '—' : '5h 49m'}</div><div class="mk-foot">${depth === 0 ? 'none queued' : 'eligibility-dlq'}</div></div>
    <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('arrow-down-to-line')}</span><span class="mk-name">Arrivals 1h</span></div><div class="mk-val">${crit ? 2 : warn ? 1 : 0}</div><div class="mk-foot">expected rate</div></div>
    <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('rotate-ccw')}</span><span class="mk-name">Replays 24h</span></div><div class="mk-val">7</div><div class="mk-foot">5 ok · 2 re-queued</div></div>
  </div>`;
}
function mQueueChips(active, kind) {
  return `<div class="m-chips">${QUEUES.map(q => {
    const depth = (kind === 'healthy') ? 0 : (q.id === 'training-pipeline-dlq' ? (kind === 'critical' ? 1 : 0) : q.depth);
    const alarm = kind === 'critical' && q.alarm;
    return `<span class="m-fchip ${q.id === active ? 'on' : ''}"><span class="qt-led ${alarm ? 'red' : depth > 0 ? 'amber' : 'green'}" style="width:7px;height:7px;border-radius:50%"></span>${q.short} ${depth}</span>`;
  }).join('')}</div>`;
}
function mLogRow(m) {
  return `<div class="m-logrow"><span class="lr-rail ${m.sev}"></span><div class="lr-body">
    <div class="lr-top"><span class="lr-id">${m.id}</span><span class="lr-time">${m.age}</span></div>
    <div class="lr-err">${m.err}</div>
    <div class="lr-payload">${m.payload}</div>
    <div class="lr-meta"><span class="conf-chip ${m.retries >= 5 ? 'red' : 'amber'}">${m.retries}/6 retries</span><span class="redact-pill">${ic('shield')}PHI redacted</span></div>
  </div></div>`;
}
function mBodyHealthy() {
  return `
  <div class="m-hero green"><div class="mh-ic">${ic('shield-check')}</div><div class="mh-main"><div class="mh-t">All DLQs empty</div><div class="mh-d">No failed messages across 4 queues. Happy path.</div></div></div>
  ${mKpis('healthy')}
  ${mSecHead('inbox', 'Queues', { opOnly: true })}
  ${mQueueChips('training-eligibility-dlq', 'healthy')}
  <div class="m-card"><div class="state-box"><div class="sb-ic green">${ic('inbox')}</div><h4>No messages</h4><p>Messages only appear after a handler exhausts retries. Polling every 30s.</p></div></div>`;
}
function mBodyWarning() {
  return `
  <div class="m-hero amber"><div class="mh-ic">${ic('alert-triangle')}</div><div class="mh-main"><div class="mh-t">5 messages, no alarm</div><div class="mh-d">Oldest queued <b>5h 49m</b>. Triage before the alarm trips.</div></div></div>
  ${mKpis('warning')}
  ${mSecHead('inbox', 'Queues', { opOnly: true })}
  ${mQueueChips('training-eligibility-dlq', 'warning')}
  ${mSecHead('list', 'Messages', { more: '5' })}
  <div class="m-card">${MSGS.map(mLogRow).join('')}</div>
  <div class="m-runbook amber"><div class="mr-ic">${ic('book-open')}</div><div><div class="mr-t">What to do now</div><div class="mr-h">Work the oldest first</div><div class="mr-d">ConsentStateMismatch & OcrTimeout dominate. Open each for the per-class runbook.</div><a class="mr-link">${ic('external-link')}Open runbook</a></div></div>`;
}
function mBodyCritical() {
  return `
  <div class="m-hero red"><div class="mh-ic">${ic('alert-octagon')}</div><div class="mh-main"><div class="mh-t">PHI leak guard tripped</div><div class="mh-d">training-pipeline-dlq alarm firing. <b>Replay blocked</b> for this message.</div></div></div>
  ${mKpis('critical')}
  ${mSecHead('inbox', 'Queues', { opOnly: true })}
  ${mQueueChips('training-pipeline-dlq', 'critical')}
  ${mSecHead('list', 'Messages', { more: 'tap to inspect' })}
  <div class="m-card">${mLogRow(CRIT_MSG)}${MSGS.slice(0, 2).map(mLogRow).join('')}</div>`;
}
function mBodyUnauthorised() {
  return `
  <div class="m-card"><div class="state-box"><div class="sb-ic red">${ic('lock')}</div><h4>No permission to read DLQ depth</h4><p>The operator role is missing <span class="payload">sqs:GetQueueAttributes</span>. Ask an admin for the reliability-operator policy.</p>
  <div class="sb-act" style="flex-direction:column;width:100%"><button class="btn btn-primary" style="width:100%;justify-content:center">${ic('refresh-cw')}Retry</button><button class="btn btn-secondary" style="width:100%;justify-content:center">${ic('shield')}Request access</button></div></div></div>`;
}
function mBodySkeleton() {
  const k = () => `<div class="m-kpi"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:40%;height:20px;margin:9px 0 5px"></div><div class="skel skel-line" style="width:70%"></div></div>`;
  const r = () => `<div style="padding:12px 13px;border-bottom:1px solid var(--border);display:flex;gap:10px"><div class="skel" style="width:4px;height:46px;border-radius:2px"></div><div style="flex:1"><div class="skel skel-line" style="width:50%"></div><div class="skel skel-line" style="width:70%;margin-top:8px"></div><div class="skel skel-line" style="width:90%;margin-top:8px"></div></div></div>`;
  return `<div class="m-kpis">${k()}${k()}${k()}${k()}</div>
  <div class="m-card">${r()}${r()}</div>
  <div style="display:flex;align-items:center;gap:9px;justify-content:center;color:var(--text-muted);font-size:12px"><span class="spinner" style="width:16px;height:16px;border-width:2px"></span>Loading DLQ…</div>`;
}
function mDetailSheet(m) {
  return `<div class="m-scrim"></div><div class="m-sheet">
    <div class="sh-grab"></div>
    <div class="sh-head"><div class="sh-av" style="background:var(--red-bg);color:var(--red)">${ic('alert-octagon')}</div><div class="sh-main"><div class="sh-name">${m.err}</div><div class="sh-id">${m.id}</div></div><button class="sh-close">${ic('x')}</button></div>
    <div class="sh-body">
      <div><div class="m-dsec-lab">Message facts</div>
        <div class="m-drow"><span class="dl">Queue</span><span class="dv mono">${m.queue}</span></div>
        <div class="m-drow"><span class="dl">Received</span><span class="dv mono">${m.ts}</span></div>
        <div class="m-drow"><span class="dl">Retries</span><span class="dv">${m.retries} of 6</span></div>
        <div class="m-drow"><span class="dl">Severity</span><span class="dv">${statline('red', 'alert-octagon', 'Alarm firing')}</span></div>
      </div>
      <div><div class="m-dsec-lab">Payload (PHI redacted)</div>
        <div class="codeblock"><pre>{
  <span class="ck">"caseToken"</span>: <span class="cs">"tok_9Q…"</span>,
  <span class="ck">"label"</span>: <span class="credact">"[REDACTED]"</span>,
  <span class="ck">"guard"</span>: <span class="cs">"phi-leak"</span>
}</pre></div></div>
      <div class="m-runbook red"><div class="mr-ic">${ic('book-open')}</div><div><div class="mr-t">What to do now</div><div class="mr-h">Do not replay — escalate</div><div class="mr-d">Leak guard blocked the write. Page the de-id on-call with this message ID.</div></div></div>
    </div>
    <div class="sh-foot"><button class="btn btn-secondary">${ic('archive')}Archive</button><button class="btn btn-danger" disabled style="opacity:.55">${ic('rotate-ccw')}Replay blocked</button></div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════════════════
   ASSEMBLE
   ════════════════════════════════════════════════════════════════════════ */
const app = (body, o = {}) => desktopApp(body, { nav: NAV, navExtra: NAV_EXTRA, navActive: 'dlq', navLabel: 'Reliability', title: 'Dead-letter queues', user: USER, search: 'Search messages, error classes, runbooks…', ...o });
const phone = (body, o = {}) => mPhone(body, { tabs: M_TABS, active: 'dlq', eyebrow: 'Reliability · operator', title: 'Dead-letter queues', ...o });

const mast = masthead({
  eyebrow: 'Skin Lesion XAI · Clinical Premium · operator only',
  title: 'Dead-letter queue inspector',
  sub: 'An internal operator surface for messages that failed processing in the training-eligibility, lab-OCR, de-identification, and training-pipeline SQS queues. Each message can be triaged, inspected with a redacted payload and stack trace, replayed after a fix, or archived. Not patient-facing — no PHI: payloads are truncated and redacted, patient identifiers are opaque tokens.',
  legend: ['Queue state — color + icon + text',
    ['green', 'check-circle', 'Empty — happy path'],
    ['amber', 'alert-triangle', 'Depth > 0, no alarm'],
    ['red', 'alert-octagon', 'Alarm firing'],
    ['neutral', 'shield', 'PHI redacted'],
  ],
});

const desktop = sectionHead('A', 'Desktop — dead-letter queue inspector', '1440px · operator console')
  + frame('01', 'Loading skeleton', 'Shell, KPI scaffold and the message table frame paint immediately; depth and messages pulse while queue attributes load.', app(bodySkeleton(), { envState: 'green' }), { url: 'ops.skinlesionxai.health/dlq' })
  + frame('02', 'Healthy — all queues empty', 'The happy path: a green all-clear hero, zero depth across four queues, and a friendly empty state explaining when messages appear.', app(bodyHealthy(), { envState: 'green' }), { url: 'ops.skinlesionxai.health/dlq' })
  + frame('03', 'Warning — depth above zero, no alarm', 'Five messages across two queues with the oldest at 5h 49m. The amber hero names the dominant error classes; the table shows severity rails, retry chips and redacted payloads.', app(bodyWarning(), { envState: 'amber', notif: 1 }), { url: 'ops.skinlesionxai.health/dlq' })
  + frame('04', 'Critical — alarm firing, message detail open', 'The PHI leak guard tripped on the training pipeline. The red hero names the alarm; the detail panel shows redacted payload, stack trace, and a runbook that blocks replay and routes to the de-id on-call.', app(bodyCritical(), { navActive: 'dlq', title: 'Dead-letter queues', envState: 'red', notif: 1 }), { url: 'ops.skinlesionxai.health/dlq' })
  + frame('05', 'Replay confirmation', 'Replaying a message is gated by a confirmation that explains what re-queuing does, keeps the payload redacted, and records a reason to the change log.', app(bodyWarning(), { envState: 'amber', overlay: replayModal() }), { url: 'ops.skinlesionxai.health/dlq' })
  + frame('06', 'Unauthorised — missing IAM permission', 'The operator role lacks queue-read permission. A plain-language message names the missing action and offers retry and an access request — no stack dump, no ARNs leaked to patients.', app(bodyUnauthorised(), { envState: 'neutral' }), { url: 'ops.skinlesionxai.health/dlq' });

const mobile = sectionHead('B', 'Mobile — on-call triage', '375px · bottom tabs · cards · bottom sheet')
  + '<div class="frame-grid">'
  + mframe('M01', 'Loading skeleton', 'Shell and tab bar paint instantly; KPI tiles and message rows pulse while queue data loads.', phone(mBodySkeleton(), { active: 'dlq' }))
  + mframe('M02', 'Healthy — empty', 'A green hero and zero depth; the empty state explains the happy path.', phone(mBodyHealthy(), { active: 'dlq' }))
  + mframe('M03', 'Warning — message list', 'Messages collapse to cards with a severity rail, retry chip and redacted payload; a runbook tells the operator what to do now.', phone(mBodyWarning(), { active: 'dlq', envState: 'amber', notif: 1 }))
  + mframe('M04', 'Critical — detail sheet', 'Tapping a message opens a bottom sheet with redacted payload and a runbook that blocks replay and escalates.', phone(mBodyCritical(), { active: 'dlq', envState: 'red', notif: 1, overlay: mDetailSheet(CRIT_MSG) }))
  + mframe('M05', 'Unauthorised', 'The role-gated message offers retry and an access request, with no leaked internals.', phone(mBodyUnauthorised(), { active: 'dlq', envState: 'neutral' }))
  + '</div>';

mountShowcase([mast, desktop, mobile]);
