/* ============================================================================
   D.5 — Lesion history timeline (patient role).
   My Lesions > select a lesion > History. Shows the full history of ONE tracked
   lesion: analyses, doctor reviews, lab results, consent events, body-location
   events, reports, reminders — chronological. The "change since last analysis"
   panel is INFORMATIONAL ONLY, never alarming. No diagnosis language, no cancer
   framing. No PHI: doctors are pseudonyms. Loaded after kit.js.
   ============================================================================ */

const NAV = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'lesions', label: 'My lesions', icon: 'scan-line' },
  { id: 'bodymap', label: 'Body map', icon: 'map-pin' },
  { id: 'history', label: 'History', icon: 'history' },
  { id: 'labs', label: 'Lab results', icon: 'file-text' },
  { id: 'consent', label: 'Privacy & consent', icon: 'shield-check' },
];
const NAV_EXTRA = [{ id: 'help', label: 'Help & learning', icon: 'graduation-cap' }, { id: 'account', label: 'Account', icon: 'user' }];
const USER = { initials: 'AY', name: 'You', role: 'Patient' };

/* event types */
const EV = {
  analysis: ['analysis', 'scan-line', 'Analysis'],
  review: ['review', 'stethoscope', 'Doctor review'],
  lab: ['lab', 'file-text', 'Lab result'],
  consent: ['consent', 'shield-check', 'Consent'],
  location: ['location', 'map-pin', 'Body location'],
  report: ['report', 'download', 'Report'],
  reminder: ['reminder', 'bell', 'Reminder'],
};

/* timeline events grouped by month, newest first. Facts only; no PHI. */
const TIMELINE = [
  { month: 'June 2026', events: [
    { type: 'report', date: 'Jun 6, 2026 · 09:12', sum: '<b>History report v3</b> generated for your records', facts: [['Report version', 'v3 · PDF'], ['Includes', '3 analyses · 1 doctor review'], ['Pages', '4']], action: 'download' },
    { type: 'review', date: 'Jun 5, 2026 · 14:40', sum: 'Doctor review by <b>Dr. M·71</b> — marked <b>validated</b>', facts: [['Reviewing doctor', 'Dr. M·71 (pseudonym)'], ['Decision', 'Validated — agrees with model'], ['Urgency note', 'Routine monitoring · no concern flagged'], ['Reviewed', 'Jun 5, 2026']], decision: 'validated' },
    { type: 'analysis', date: 'Jun 5, 2026 · 09:03', sum: 'New analysis — <b>benign-band</b>, confidence range 78–86%', facts: [['Model prediction', 'Benign-band'], ['Confidence range', '78–86%'], ['Image quality', 'Good · in focus, even lighting'], ['Grad-CAM', 'Available — areas of interest highlighted']], analysis: true, label: 'benign', conf: '78–86%', cam: true },
  ] },
  { month: 'April 2026', events: [
    { type: 'location', date: 'Apr 18, 2026 · 16:22', sum: 'Body location <b>verified by doctor</b> — left forearm', facts: [['Region', 'Left forearm (dorsal)'], ['Pin', '2D + 3D coordinate placed'], ['Verified by', 'Dr. M·71 (pseudonym)']] },
    { type: 'lab', date: 'Apr 18, 2026 · 11:05', sum: 'Lab result <b>reviewed</b> — Meridian Pathology', facts: [['Lab', 'Meridian Pathology'], ['Test date', 'Apr 15, 2026'], ['Status', 'Reviewed — accepted as context'], ['Doctor note', 'Consistent with benign presentation']], review: 'reviewed' },
    { type: 'analysis', date: 'Apr 12, 2026 · 08:47', sum: 'Analysis — <b>benign-band</b>, confidence range 74–82%', facts: [['Model prediction', 'Benign-band'], ['Confidence range', '74–82%'], ['Image quality', 'Fair · slight blur at edge'], ['Grad-CAM', 'Available']], analysis: true, label: 'benign', conf: '74–82%', cam: true },
  ] },
  { month: 'February 2026', events: [
    { type: 'consent', date: 'Feb 2, 2026 · 19:30', sum: 'Storage mode changed to <b>encrypted cloud + research opt-in</b>', facts: [['Change', 'Local-only → encrypted cloud'], ['Research use', 'Opted in (de-identified)'], ['Effective', 'Immediately']] },
    { type: 'analysis', date: 'Feb 1, 2026 · 10:15', sum: 'First analysis — <b>monitor-band</b>, confidence range 55–63%', facts: [['Model prediction', 'Monitor-band'], ['Confidence range', '55–63%'], ['Image quality', 'Good'], ['Grad-CAM', 'Available'], ['Note', 'Baseline analysis for this lesion']], analysis: true, label: 'monitor', conf: '55–63%', cam: true, first: true },
    { type: 'reminder', date: 'Feb 1, 2026 · 10:16', sum: 'Re-check reminder set — every <b>90 days</b>', facts: [['Reminder type', 'Re-photograph & analyse'], ['Cadence', 'Every 90 days'], ['Next', 'May 2, 2026']] },
  ] },
];
const ALL_EVENTS = TIMELINE.flatMap(m => m.events);
const ANALYSES = ALL_EVENTS.filter(e => e.analysis);

const labelTone = { benign: 'green', monitor: 'amber', review: 'blue' };
const labelName = { benign: 'Benign-band', monitor: 'Monitor-band', review: 'Review-band' };
function predChip(label, conf) { return `<span class="conf-chip ${labelTone[label]}">${labelName[label]}${conf ? ' · ' + conf : ''}</span>`; }

function lesionHead() {
  return `<div class="lesion-head">
    <div class="lh-thumb">${ic('image')}</div>
    <div class="lh-main">
      <div class="lh-name">Lesion · left forearm</div>
      <div class="lh-meta"><span>${ic('hash')}LES-4F2A</span><span>${ic('calendar')}Tracked since Feb 2026</span><span>${ic('scan-line')}3 analyses</span><span>${ic('stethoscope')}1 doctor review</span></div>
    </div>
    <div class="lh-actions"><button class="btn btn-secondary">${ic('git-compare')}Compare</button><button class="btn btn-secondary">${ic('download')}Export PDF</button></div>
  </div>`;
}
function changePanel() {
  return `<div class="change-panel">
    <div class="change-cell"><div class="cc-l">${ic('git-compare')}Label change</div><div class="cc-v">${ic('arrow-right')}Monitor → Benign</div><div class="cc-sub">Most recent two analyses · informational only</div></div>
    <div class="change-cell"><div class="cc-l">${ic('trending-up')}Confidence trend</div><div class="cc-v"><span class="statline green">${ic('check-circle')}Stable</span></div><div class="cc-sub">78–86% vs 74–82% last analysis</div></div>
    <div class="change-cell"><div class="cc-l">${ic('stethoscope')}Doctor review</div><div class="cc-v"><span class="statline blue">${ic('check-circle')}Validated</span></div><div class="cc-sub">Reviewed Jun 5 by Dr. M·71</div></div>
  </div>`;
}
function filters(active) {
  const chips = [['all', 'list', 'All events'], ['analysis', 'scan-line', 'Analyses'], ['review', 'stethoscope', 'Doctor reviews'], ['lab', 'file-text', 'Labs'], ['consent', 'shield-check', 'Consent']];
  return `<div class="tl-filters">${chips.map(([id, icn, lab]) => `<span class="tl-chip ${id === active ? 'on' : ''}">${ic(icn)}${lab}</span>`).join('')}<span class="tl-spacer"></span><span class="t-time">${ALL_EVENTS.length} events · newest first</span></div>`;
}
function eventCard(e, open) {
  const [cls, icn, tlabel] = EV[e.type];
  const detail = `<div class="tl-detail"><div class="tl-detail-inner">
    ${e.analysis ? `<div class="tl-thumb">${ic('image')}${e.cam ? '<span class="tt-cam">Grad-CAM</span>' : ''}</div>` : `<div class="tl-thumb" style="background:var(--surface-sunken);color:var(--text-muted)">${ic(icn)}</div>`}
    <div class="tl-facts">${e.facts.map(([l, v]) => `<div class="tl-fact"><span class="tf-l">${l}</span><span class="tf-v">${v}</span></div>`).join('')}</div>
    <div class="tl-detail-foot">${e.analysis ? `<button class="btn btn-secondary">${ic('layers')}View heatmap</button><button class="btn btn-ghost">${ic('git-compare')}Compare with latest</button>` : e.type === 'report' ? `<button class="btn btn-secondary">${ic('download')}Download report</button>` : e.type === 'review' ? `<button class="btn btn-secondary">${ic('file-text')}Read full review</button>` : `<button class="btn btn-ghost">${ic('info')}Details</button>`}</div>
  </div></div>`;
  return `<div class="tl-event"><div class="tl-node ${cls}">${ic(icn)}</div>
    <div class="tl-card ${open ? 'open' : ''}">
      <div class="tl-row"><span class="tr-type ${cls}">${tlabel}</span><span class="tr-sum">${e.sum}</span><span class="tr-date">${e.date.split(' · ')[0]}</span><span class="tr-exp">${ic('chevron-right')}</span></div>
      ${open ? detail : ''}
    </div></div>`;
}
function timeline(filter, openKey) {
  return TIMELINE.map(m => {
    const evs = filter && filter !== 'all' ? m.events.filter(e => e.type === filter) : m.events;
    if (!evs.length) return '';
    return `<div class="tl-month">${m.month}</div><div class="timeline">${evs.map((e, i) => eventCard(e, `${m.month}-${e.type}-${e.date}` === openKey)).join('')}</div>`;
  }).join('');
}

function comparePanel(mode = 'side') {
  const a = ANALYSES[0], b = ANALYSES[1];
  const card = (e, tag) => `<div class="cmp-analysis"><div class="ca-stage"><span class="ca-tag">${tag}</span>${ic('image')}<span class="ca-cam">${ic('layers')}Grad-CAM</span></div><div class="ca-band"><div class="ca-date">${e.date.split(' · ')[0]}</div><div class="ca-label">${predChip(e.label, e.conf)}</div></div></div>`;
  return `<div class="compare-panel">
    <div class="cmp-head2"><span class="ch-t">${ic('git-compare')}Compare analyses</span><span class="seg"><button class="${mode === 'side' ? 'on' : ''}">Side by side</button><button class="${mode === 'overlay' ? 'on' : ''}">Overlay</button></span></div>
    <div class="cmp-body2">${mode === 'overlay'
      ? `<div class="overlay-stage">${ic('image')}<div class="os-divider"></div><div class="os-handle">${ic('move-horizontal')}</div><span class="os-tag l">Jun 5 · Grad-CAM</span><span class="os-tag r">Apr 12 · Grad-CAM</span></div><div style="grid-column:1/-1;font:400 12px var(--font-sans);color:var(--text-muted);text-align:center">Drag the handle to compare the two heatmaps. Informational only — areas of interest, not danger zones.</div>`
      : `${card(a, 'Latest · Jun 5')}${card(b, 'Previous · Apr 12')}`}</div>
  </div>`;
}

/* ── Bodies ──────────────────────────────────────────────────────────── */
function body(kind) {
  if (kind === 'empty') return `
    ${disclaimerTop()}
    <div class="lesion-head"><div class="lh-thumb">${ic('image')}</div><div class="lh-main"><div class="lh-name">Lesion · left forearm</div><div class="lh-meta"><span>${ic('hash')}LES-4F2A</span><span>${ic('calendar')}Just added</span></div></div></div>
    <div class="opc"><div class="state-box"><div class="sb-ic accent">${ic('history')}</div><h4>No history yet for this lesion</h4><p>Once you run your first analysis, it will appear here — along with any doctor reviews, lab results and consent events — building a clear, chronological history over time.</p><div class="sb-act"><button class="btn btn-primary">${ic('scan-line')}Analyze first image</button></div></div></div>`;
  if (kind === 'single') return `
    ${disclaimerTop()}
    ${lesionHead().replace('3 analyses', '1 analysis').replace('<button class="btn btn-secondary">' + ic('git-compare') + 'Compare</button>', '')}
    <div class="notice neutral" style="margin-bottom:var(--sp-lg)"><span class="app-icon"><i data-lucide="info"></i></span><div><div class="n-t">Comparison available after your next analysis</div><div class="n-d">A change panel and side-by-side comparison appear once this lesion has two or more analyses.</div></div></div>
    ${filters('all')}
    <div class="tl-month">February 2026</div><div class="timeline">${eventCard(TIMELINE[2].events[1], true)}${eventCard(TIMELINE[2].events[2], false)}</div>
    ${disclaimerBottom()}`;
  const openKey = kind === 'expanded' ? 'June 2026-review-Jun 5, 2026 · 14:40' : null;
  return `
    ${disclaimerTop()}
    ${lesionHead()}
    ${changePanel()}
    ${(kind === 'compare' || kind === 'overlay') ? `${rsec('git-compare', 'Compare analyses', { meta: 'latest two' })}${comparePanel(kind === 'overlay' ? 'overlay' : 'side')}<div style="height:var(--sp-lg)"></div>` : ''}
    ${rsec('history', 'Timeline', { meta: kind === 'filtered' ? 'analyses only' : 'all events' })}
    ${filters(kind === 'filtered' ? 'analysis' : 'all')}
    ${timeline(kind === 'filtered' ? 'analysis' : 'all', openKey)}
    ${disclaimerBottom()}`;
}
function disclaimerTop() {
  return `<div class="pt-disclaimer" style="margin-bottom:var(--sp-lg)"><span class="app-icon"><i data-lucide="shield-check"></i></span><p><strong>This platform is not a medical diagnosis tool.</strong> It provides educational AI-supported information and helps organize lesion history for professional review.</p></div>`;
}
function disclaimerBottom() {
  return `<div style="margin-top:var(--sp-lg)"><div class="notice neutral"><span class="app-icon"><i data-lucide="info"></i></span><div><div class="n-t">The change indicator is informational only</div><div class="n-d">Label and confidence changes describe what the educational model saw between photos — they are not a diagnosis or a measure of risk. Anything of concern is routed to professional review.</div></div></div></div>`;
}
function bodySkeleton() {
  const ev = () => `<div class="tl-event"><div class="tl-node" style="border-color:var(--border)"></div><div class="tl-card"><div class="tl-row"><div class="skel" style="width:70px;height:18px;border-radius:4px"></div><div class="skel skel-line" style="flex:1"></div><div class="skel skel-line" style="width:80px"></div></div></div></div>`;
  return `${disclaimerTop()}<div class="lesion-head"><div class="skel" style="width:72px;height:72px;border-radius:8px"></div><div style="flex:1"><div class="skel skel-line" style="width:200px;height:18px"></div><div class="skel skel-line" style="width:60%;margin-top:10px"></div></div></div>
  <div class="change-panel"><div class="change-cell"><div class="skel skel-line" style="width:50%"></div><div class="skel skel-line" style="width:70%;margin-top:10px"></div></div><div class="change-cell"><div class="skel skel-line" style="width:50%"></div><div class="skel skel-line" style="width:70%;margin-top:10px"></div></div><div class="change-cell"><div class="skel skel-line" style="width:50%"></div><div class="skel skel-line" style="width:70%;margin-top:10px"></div></div></div>
  <div class="tl-month">Loading…</div><div class="timeline">${ev()}${ev()}${ev()}</div>
  <div style="display:flex;align-items:center;gap:10px;justify-content:center;color:var(--text-muted);font-size:12.5px;margin-top:var(--sp-lg)"><span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Loading your lesion history…</div>`;
}

/* ════════════════════════════ MOBILE ════════════════════════════ */
const M_TABS = [{ id: 'home', label: 'Home', icon: 'home' }, { id: 'lesions', label: 'Lesions', icon: 'scan-line' }, { id: 'history', label: 'History', icon: 'history' }, { id: 'account', label: 'Account', icon: 'user' }];
function mDisclaimer() { return `<div class="pt-disclaimer"><span class="app-icon"><i data-lucide="shield-check"></i></span><p><strong>Not a diagnosis tool.</strong> Educational AI information to organize lesion history for professional review.</p></div>`; }
function mLesionHead(single) {
  return `<div class="m-card" style="padding:13px;display:flex;gap:12px;align-items:center"><div class="lh-thumb" style="width:52px;height:52px">${ic('image')}</div><div style="flex:1"><div style="font:700 15px var(--font-sans)">Lesion · left forearm</div><div style="font:500 11px var(--font-mono);color:var(--text-secondary);margin-top:4px">LES-4F2A · ${single ? '1 analysis' : '3 analyses'}</div></div></div>`;
}
function mChange() {
  return `<div class="m-card"><div style="padding:12px 13px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center"><span style="font:600 12px var(--font-sans)">${ic('git-compare')} Label change</span><span style="font:600 12.5px var(--font-sans)">Monitor → Benign</span></div>
  <div style="padding:12px 13px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center"><span style="font:600 12px var(--font-sans)">${ic('trending-up')} Confidence</span>${statline('green', 'check-circle', 'Stable')}</div>
  <div style="padding:12px 13px;display:flex;justify-content:space-between;align-items:center"><span style="font:600 12px var(--font-sans)">${ic('stethoscope')} Review</span>${statline('blue', 'check-circle', 'Validated')}</div></div>`;
}
function mFilters(active) {
  const chips = [['all', 'All'], ['analysis', 'Analyses'], ['review', 'Reviews'], ['lab', 'Labs']];
  return `<div class="m-chips">${chips.map(([id, l]) => `<span class="m-fchip ${id === active ? 'on' : ''}">${l}</span>`).join('')}</div>`;
}
function mEvent(e, open) {
  const [cls, icn, tlabel] = EV[e.type];
  return `<div class="m-tl-event"><div class="m-tl-node ${cls}">${ic(icn)}</div><div class="m-tl-card ${open ? 'open' : ''}">
    <div class="m-tl-row"><div style="flex:1"><div class="m-tl-type ${cls}">${tlabel}</div><div class="m-tl-sum">${e.sum}</div><div class="m-tl-date">${e.date}</div></div><span class="tr-exp">${ic(open ? 'chevron-down' : 'chevron-right')}</span></div>
    ${open ? `<div class="m-tl-detail">${e.analysis ? `<div class="tl-thumb" style="width:100%;aspect-ratio:16/9;margin-bottom:10px">${ic('image')}<span class="tt-cam">Grad-CAM</span></div>` : ''}${e.facts.map(([l, v]) => `<div class="tl-fact"><span class="tf-l">${l}</span><span class="tf-v">${v}</span></div>`).join('')}</div>` : ''}
  </div></div>`;
}
function mTimeline(filter, openIdx) {
  return TIMELINE.map(m => {
    const evs = filter && filter !== 'all' ? m.events.filter(e => e.type === filter) : m.events;
    if (!evs.length) return '';
    return `<div class="tl-month" style="margin-left:46px">${m.month}</div><div class="m-timeline">${evs.map((e, i) => mEvent(e, false)).join('')}</div>`;
  }).join('');
}
function mBody(kind) {
  if (kind === 'empty') return `${mDisclaimer()}${mLesionHead(true)}<div class="m-card"><div class="state-box"><div class="sb-ic accent">${ic('history')}</div><h4>No history yet</h4><p>Run your first analysis to start this lesion's timeline.</p></div></div>`;
  if (kind === 'single') return `${mDisclaimer()}${mLesionHead(true)}${mFilters('all')}<div class="tl-month" style="margin-left:46px">February 2026</div><div class="m-timeline">${mEvent(TIMELINE[2].events[1], true)}${mEvent(TIMELINE[2].events[2], false)}</div>`;
  const compare = kind === 'compare';
  return `${mDisclaimer()}${mLesionHead(false)}${mChange()}
  ${compare ? `${mSecHead('git-compare', 'Compare')}<div class="m-card" style="padding:11px"><div style="display:flex;gap:9px">${[['Jun 5', 'benign', '78–86%'], ['Apr 12', 'benign', '74–82%']].map(([d, l, c]) => `<div style="flex:1"><div class="tl-thumb" style="width:100%;aspect-ratio:1">${ic('image')}<span class="tt-cam">CAM</span></div><div style="font:400 10px var(--font-mono);color:var(--text-muted);margin-top:6px">${d}</div><div style="margin-top:4px">${predChip(l, c)}</div></div>`).join('')}</div></div>` : ''}
  ${mSecHead('history', 'Timeline', { more: kind === 'filtered' ? 'analyses' : 'all' })}${mFilters(kind === 'filtered' ? 'analysis' : 'all')}${mTimeline(kind === 'filtered' ? 'analysis' : 'all')}`;
}
function mBodySkeleton() {
  const e = () => `<div style="display:flex;gap:12px;padding:0 0 14px 0"><div class="skel" style="width:24px;height:24px;border-radius:50%"></div><div class="m-tl-card" style="flex:1"><div class="skel skel-line" style="width:40%"></div><div class="skel skel-line" style="width:80%;margin-top:8px"></div></div></div>`;
  return `${mDisclaimer()}${mLesionHead(false)}<div class="m-timeline" style="margin-top:10px">${e()}${e()}${e()}</div>`;
}

const app = (b, o = {}) => desktopApp(b, { nav: NAV, navExtra: NAV_EXTRA, navActive: 'history', navLabel: 'Patient', title: 'Lesion history', user: USER, search: 'Search your lesions & history…', env: 'Signed in', envState: 'green', ...o });
const phone = (b, o = {}) => mPhone(b, { tabs: M_TABS, active: 'history', eyebrow: 'My lesion', title: 'History', env: 'Secure', envState: 'green', ...o });

const mast = masthead({
  eyebrow: 'Skin Lesion XAI · Clinical Premium · patient',
  title: 'Lesion history timeline',
  sub: 'The complete history of one tracked lesion — every analysis, doctor review, lab result, consent event, body-location verification, report and reminder — in one calm chronological view. A change-since-last panel and a side-by-side or overlay heatmap comparison appear once a lesion has two or more analyses. The change indicator is informational only: it describes what the educational model saw, never a diagnosis or a measure of risk.',
  legend: ['Event type — color + icon + text', ['green', 'check-circle', 'Benign-band'], ['amber', 'alert-triangle', 'Monitor-band'], ['blue', 'stethoscope', 'Doctor review'], ['neutral', 'shield-check', 'Consent / pseudonymized']],
});

const desktop = sectionHead('A', 'Desktop — lesion history timeline', '1280px · patient app')
  + frame('01', 'Loading skeleton', 'The lesion header, change panel and timeline scaffold paint immediately; events pulse while the history loads.', app(bodySkeleton()), { url: 'app.skinlesionxai.health/lesions/LES-4F2A/history' })
  + frame('02', 'Multiple analyses — full timeline', 'Three analyses, a doctor review, labs, consent and reminders grouped by month. The change panel sits on top, informational and calm.', app(body('multiple'), { envState: 'green' }), { url: 'app.skinlesionxai.health/lesions/LES-4F2A/history' })
  + frame('03', 'Event expanded', 'Opening an event reveals its facts — here a doctor review with the pseudonymized doctor, decision and urgency note, plus a link to the full review.', app(body('expanded'), { envState: 'green' }), { url: 'app.skinlesionxai.health/lesions/LES-4F2A/history' })
  + frame('04', 'Compare analyses — side by side', 'The compare panel shows the latest two analyses with heatmap thumbnails and band labels, framed as areas of interest, never danger zones.', app(body('compare'), { envState: 'green' }), { url: 'app.skinlesionxai.health/lesions/LES-4F2A/history' })
  + frame('05', 'Compare analyses — overlay', 'A single-stage overlay with a draggable divider to compare the two heatmaps directly, with an informational caption.', app(body('overlay'), { envState: 'green' }), { url: 'app.skinlesionxai.health/lesions/LES-4F2A/history' })
  + frame('06', 'Filtered — analyses only', 'The filter chips narrow the timeline to a single event type, keeping the change panel for context.', app(body('filtered'), { envState: 'green' }), { url: 'app.skinlesionxai.health/lesions/LES-4F2A/history' })
  + frame('07', 'Single analysis — no comparison yet', 'With one analysis there is nothing to compare; a gentle note explains the comparison appears after the next analysis.', app(body('single'), { envState: 'green' }), { url: 'app.skinlesionxai.health/lesions/LES-4F2A/history' })
  + frame('08', 'Empty timeline', 'A freshly added lesion with no events; a friendly call to run the first analysis.', app(body('empty'), { envState: 'green' }), { url: 'app.skinlesionxai.health/lesions/LES-4F2A/history' });

const mobile = sectionHead('B', 'Mobile — lesion history', '375px · bottom tabs · vertical timeline')
  + '<div class="frame-grid">'
  + mframe('M01', 'Loading skeleton', 'The lesion header and timeline pulse while history loads.', phone(mBodySkeleton(), { active: 'history' }))
  + mframe('M02', 'Full timeline', 'Events stack vertically with type tags and dates, grouped by month; the change panel sits on top.', phone(mBody('multiple'), { active: 'history' }))
  + mframe('M03', 'Compare analyses', 'A two-up heatmap comparison with band labels, framed informationally.', phone(mBody('compare'), { active: 'history' }))
  + mframe('M04', 'Filtered — analyses only', 'Filter chips narrow the timeline to one event type.', phone(mBody('filtered'), { active: 'history' }))
  + mframe('M05', 'Single analysis', 'One analysis with a note that comparison comes later.', phone(mBody('single'), { active: 'history' }))
  + '</div>';

mountShowcase([mast, desktop, mobile]);
