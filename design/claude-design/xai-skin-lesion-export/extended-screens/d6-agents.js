/* ============================================================================
   D.6 — Agentic XAI chat surfaces (4 role-scoped agents).
   Four visually distinct, permission-scoped agent chats that NEVER share a
   history: Patient Education, Doctor Workflow (case-scoped), Research Governance
   (aggregate only), Admin Market Research (Golden Docs only). Every response
   carries a source-or-"no source" label. No PHI on any surface. Loaded after kit.js.
   ============================================================================ */

/* ── reusable message + chrome builders ──────────────────────────────── */
function botMsg(theme, html, { sources = [], cite = false, learn = '', trace = null, streaming = false } = {}) {
  const av = { patient: 'sparkles', doctor: 'stethoscope', research: 'bar-chart-3', admin: 'briefcase' }[theme];
  return `<div class="msg bot"><div class="m-av">${ic(av)}</div><div class="m-bubble">${html}${streaming ? '<span class="stream-caret"></span>' : ''}
    ${sources.length ? `<div class="src-row">${sources.map(s => `<span class="src-chip ${cite ? 'cite' : ''}">${ic(cite ? 'quote' : 'book-open')}${s}</span>`).join('')}</div>` : ''}
    ${learn ? `<a class="learn-link">${ic('external-link')}${learn}</a>` : ''}
    ${trace ? `<div class="trace-box"><div class="tb-head">${ic('list-tree')}Trace · facts used</div><div class="tb-body">${trace.map(t => `<div><span class="tf">${t}</span></div>`).join('')}</div></div>` : ''}
  </div></div>`;
}
function userMsg(text) { return `<div class="msg user"><div class="m-av">${ic('user')}</div><div class="m-bubble">${text}</div></div>`; }
function typingMsg(theme) { const av = { patient: 'sparkles', doctor: 'stethoscope', research: 'bar-chart-3', admin: 'briefcase' }[theme]; return `<div class="msg bot"><div class="m-av">${ic(av)}</div><div class="m-bubble"><span class="typing"><i></i><i></i><i></i></span></div></div>`; }
function suggest(chips) { return `<div class="agent-suggest">${chips.map(c => `<span class="suggest-chip">${c}</span>`).join('')}</div>`; }
function inputBar(placeholder, { disabled = false, note = '' } = {}) {
  return `<div class="agent-foot"><div class="agent-input ${disabled ? 'disabled' : ''}"><input placeholder="${placeholder}" ${disabled ? 'disabled' : ''} /><button class="ai-send">${ic('arrow-up')}</button></div>${note ? `<div class="af-note">${ic('info')}${note}</div>` : ''}</div>`;
}
function agentShell(theme, head, scopebar, body, suggestRow, foot, { banner = '' } = {}) {
  return `<div class="agent-shell ${theme}">${head}${scopebar}${banner}<div class="agent-body">${body}</div>${suggestRow}${foot}</div>`;
}

/* ════════════════════ Surface 1 — PATIENT EDUCATION ════════════════════ */
function patientHead() {
  return `<div class="agent-head"><div class="ah-ic">${ic('sparkles')}</div><div class="ah-main"><div class="ah-name">Skin Lesion Education Assistant</div><div class="ah-scope">${ic('graduation-cap')}Educational information only — not medical advice</div></div><span class="ah-badge scope-pill patient">${ic('user')}Patient</span></div>`;
}
function patientScope() { return `<div class="agent-scopebar patient">${ic('shield-alert')}This agent cannot discuss your specific results or images.</div>`; }
function patientAgent(state) {
  const head = patientHead(), scope = patientScope();
  const chips = suggest(['What is Grad-CAM?', 'What does my confidence score mean?', 'How do I prepare for a dermatologist visit?', 'What is a benign lesion?']);
  if (state === 'idle') return agentShell('patient', head, scope, botMsg('patient', `<p>Hello. I can explain how the educational model works, help you take a clearer photo, and answer general skin-health questions.</p><p>I can\u2019t discuss your specific results — a doctor does that. What would you like to learn about?</p>`, { sources: ['general skin care education'] }), chips, inputBar('Ask an educational question…', { note: 'Educational information only · sources shown on every reply' }));
  if (state === 'streaming') return agentShell('patient', head, scope, userMsg('What is Grad-CAM?') + botMsg('patient', `<p><b>Grad-CAM</b> is a way of showing which parts of your photo the educational model paid most attention to. It produces an <b>explanation heatmap</b> — warmer colors mark the areas of interest the model focused on.</p><p>It does not mark danger or show a diagnosis. It simply makes the model\u2019s</p>`, { streaming: true }), chips, inputBar('Ask an educational question…'));
  if (state === 'response') return agentShell('patient', head, scope, userMsg('What does my confidence score mean?') + botMsg('patient', `<p>A confidence range describes how sure the educational model is about the band it suggested — for example <b>78–86%</b>. A wider range means the model is less certain.</p><p>It is <b>not</b> a probability of any condition, and it is not a diagnosis. Anything worth a closer look is routed to professional review.</p>`, { sources: ['general skin care education', 'what is a confidence range'], learn: 'Learn more: reading your results' }), chips, inputBar('Ask an educational question…'));
  if (state === 'phi-blocked') return agentShell('patient', head, scope, userMsg('[pasted image data] is this mole cancer?') + botMsg('patient', `<p>I can\u2019t look at images or tell you whether something is cancer — that\u2019s for a doctor, not an educational assistant.</p><p>I\u2019ve <b>not stored</b> what you pasted. If you\u2019d like, I can explain how to upload an image safely for analysis, or how to prepare for a dermatologist visit.</p>`, { sources: ['general skin care education'] }), suggest(['How do I upload an image safely?', 'How do I prepare for a dermatologist visit?']), inputBar('Ask an educational question…'), { banner: `<div class="agent-banner block">${ic('shield-off')}<div><div class="ab-t">Image data blocked</div><div class="ab-d">This assistant never receives your images or specific results. What you pasted was discarded, not saved.</div></div></div>` });
  if (state === 'expired') return agentShell('patient', head, scope, `<div class="state-box" style="margin:auto"><div class="sb-ic accent">${ic('clock')}</div><h4>Session ended</h4><p>For your security, this educational session has timed out. Your conversation isn\u2019t stored. Sign in again to continue learning.</p><div class="sb-act"><button class="btn btn-primary">${ic('refresh-cw')}Start a new session</button></div></div>`, '', inputBar('Sign in again to continue…', { disabled: true }));
  return agentShell('patient', head, scope, userMsg('What is a benign lesion?') + `<div class="agent-banner warn">${ic('wifi-off')}<div><div class="ab-t">Couldn\u2019t reach the assistant</div><div class="ab-d">Something interrupted the connection. Your question is safe — try again when you\u2019re ready.</div></div></div>`, chips, inputBar('Ask an educational question…'));
}

/* ════════════════════ Surface 2 — DOCTOR WORKFLOW ════════════════════ */
function doctorHead(caseId = 'CASE-7731') {
  return `<div class="agent-head"><div class="ah-ic">${ic('stethoscope')}</div><div class="ah-main"><div class="ah-name">Doctor Workflow Agent <span class="conf-chip blue" style="font-size:10px">Case-scoped</span></div><div class="ah-scope">${ic('folder-lock')}Access: this case only · ${caseId}</div></div><span class="ah-badge scope-pill doctor">${ic('shield')}Doctor</span></div>`;
}
function doctorScope() { return `<div class="agent-scopebar doctor">${ic('database')}References structured facts only — label, confidence, body region, image quality, Grad-CAM regions. Never raw notes or images.</div>`; }
function doctorAgent(state) {
  const head = doctorHead(), scope = doctorScope();
  const chips = suggest(['Summarise the AI output for this case', 'Draft an initial opinion note', 'What image quality issues should I note?']);
  if (state === 'idle') return agentShell('doctor', head, scope, `<div class="state-box" style="margin:auto"><div class="sb-ic blue">${ic('folder-open')}</div><h4>Case CASE-7731 loaded</h4><p>I can summarise the structured AI output, draft an initial opinion note, or flag image-quality issues — scoped to this case only.</p></div>`, chips, inputBar('Ask about this case…', { note: 'Case-scoped · structured facts only · no other patient data' }));
  if (state === 'drafting') return agentShell('doctor', head, scope, userMsg('Draft an initial opinion note based on the Grad-CAM and patient-reported location') + botMsg('doctor', `<p><b>Draft — for your review, not submitted:</b></p><p>Educational model suggests <b>benign-band</b> (confidence 78–86%) for the lesion at the <b>left forearm (dorsal)</b>, patient-reported and pin-placed. Grad-CAM areas of interest are central and well-circumscribed. Image quality is good. No urgent features indicated by the structured output. Recommend routine monitoring pending your professional opinion.</p>`, { trace: ['label = benign-band', 'confidence = 78–86%', 'body_region = left forearm (dorsal)', 'image_quality = good', 'gradcam_regions = central, circumscribed'] }), chips, inputBar('Ask about this case…'));
  if (state === 'summary') return agentShell('doctor', head, scope, userMsg('Summarise the AI output for this case') + botMsg('doctor', `<p>For <b>CASE-7731</b>, the structured output is:</p><ul><li><b>Prediction:</b> benign-band</li><li><b>Confidence:</b> 78–86%</li><li><b>Body region:</b> left forearm (dorsal), pin-verified</li><li><b>Image quality:</b> good</li><li><b>Grad-CAM:</b> central, well-circumscribed areas of interest</li></ul><p>This is the model\u2019s educational output only — your professional opinion governs the case.</p>`, { trace: ['label, confidence, body_region, image_quality, gradcam_regions for CASE-7731'] }), chips, inputBar('Ask about this case…'));
  if (state === 'submitted') return agentShell('doctor', head, scope, userMsg('Summarise the AI output for this case') + botMsg('doctor', `<p>For <b>CASE-7731</b>: benign-band, confidence 78–86%, left forearm (dorsal), good image quality.</p>`, { trace: ['structured facts for CASE-7731'] }), '', inputBar('Opinion submitted — agent locked for this case', { disabled: true, note: 'You submitted your opinion on CASE-7731. The agent is now read-only for this case.' }));
  return agentShell('doctor', doctorHead('— none —'), scope, `<div class="state-box" style="margin:auto"><div class="sb-ic" style="background:var(--neutral-bg);color:var(--neutral)">${ic('folder-x')}</div><h4>No case loaded</h4><p>Open a case from your review queue to use the workflow agent. It only operates inside an assigned, open case.</p></div>`, '', inputBar('Open a case to begin…', { disabled: true }));
}

/* ════════════════════ Surface 3 — RESEARCH GOVERNANCE ════════════════════ */
function researchHead() {
  return `<div class="agent-head"><div class="ah-ic">${ic('bar-chart-3')}</div><div class="ah-main"><div class="ah-name">Research Governance Agent <span class="conf-chip" style="font-size:10px;color:#7a6a4f;background:#efe9df;border-color:#d8cdb8">Aggregate</span></div><div class="ah-scope">${ic('shield-check')}Aggregate statistics only · no patient identity · no PHI</div></div><span class="ah-badge scope-pill research">${ic('flask-conical')}Research</span></div>`;
}
function researchScope() { return `<div class="agent-scopebar research">${ic('users')}De-identified group summaries only. Cannot return any individual record.</div>`; }
function researchAgent(state) {
  const head = researchHead(), scope = researchScope();
  const chips = suggest(['Summarise calibration drift over the last 30 days', 'Which subgroup has the highest false-negative rate?', 'How many cases are in the active-learning queue?', 'Is the training set balanced across skin-tone groups?']);
  if (state === 'idle') return agentShell('research', head, scope, botMsg('research', `<p>I produce <b>aggregate, de-identified</b> governance summaries — calibration, fairness across Fitzpatrick groups, drift, and queue counts. I can\u2019t surface any individual case.</p>`, { sources: ['model-metrics warehouse (aggregate)'] }), chips, inputBar('Ask for an aggregate summary…', { note: 'Aggregate only · no patient identity · no PHI' }));
  if (state === 'generating') return agentShell('research', head, scope, userMsg('Summarise calibration drift over the last 30 days') + typingMsg('research'), chips, inputBar('Ask for an aggregate summary…'));
  if (state === 'response') return agentShell('research', head, scope, userMsg('Which subgroup has the highest false-negative rate?') + botMsg('research', `<p>Across the last 30 days, the highest aggregate false-negative rate is in the <b>Fitzpatrick V–VI</b> group at <b>6.1%</b>, versus a 3.4% overall mean. The gap has <b>widened 1.2 points</b> since the last model version.</p><p>This is a group-level statistic over 1,180 labelled cases — no individual records are accessible.</p>`, { sources: ['fairness warehouse · 30d aggregate', 'cohort: Fitzpatrick V–VI (n=1,180)'] }), chips, inputBar('Ask for an aggregate summary…'));
  if (state === 'no-data') return agentShell('research', head, scope, userMsg('Summarise calibration drift over the last 30 days') + botMsg('research', `<p>There isn\u2019t enough labelled data in the selected window to report calibration drift reliably — only <b>3 of the 30 days</b> have settled labels. I\u2019d rather say so than give you a noisy number.</p>`, { sources: ['no source — insufficient data'] }), chips, inputBar('Ask for an aggregate summary…'));
  return agentShell('research', head, scope, userMsg('Show me case 7731\u2019s image and label') + botMsg('research', `<p>I can\u2019t do that. This agent only returns <b>aggregate, de-identified</b> statistics — never an individual case, image, or label. Try an aggregate question, such as a subgroup metric or a queue count.</p>`, { sources: ['no source — request blocked'] }), suggest(['How many cases are in the active-learning queue?']), inputBar('Ask for an aggregate summary…'), { banner: `<div class="agent-banner block">${ic('shield-off')}<div><div class="ab-t">Individual-record request blocked</div><div class="ab-d">No patient identity, image, or single case can be returned by this agent.</div></div></div>` });
}

/* ════════════════════ Surface 4 — ADMIN MARKET RESEARCH ════════════════════ */
function adminHead(health = 'green') {
  const map = { green: ['green', 'check-circle', 'Golden Docs healthy'], stale: ['amber', 'alert-triangle', 'Golden Docs stale'], none: ['neutral', 'circle-off', 'No sources approved'] };
  const [t, i, l] = map[health];
  return `<div class="agent-head"><div class="ah-ic">${ic('briefcase')}</div><div class="ah-main"><div class="ah-name">Market Research Agent <span class="conf-chip" style="font-size:10px;color:#5f5677;background:#ebe8f1;border-color:#d3cce4">Admin</span></div><div class="ah-scope">${ic('book-lock')}Business intelligence only · no patient data · no clinical advice</div></div><span class="ah-badge scope-pill admin">${statline(t, i, l)}</span></div>`;
}
function adminScope() { return `<div class="agent-scopebar admin">${ic('files')}Answers strictly from approved Golden Docs. Every fact carries its source section.</div>`; }
function adminAgent(state) {
  const head = adminHead(state === 'stale' ? 'stale' : state === 'no-sources' ? 'none' : 'green'), scope = adminScope();
  const chips = suggest(['Summarise our ICP for European dermatology practices', 'Competitive positioning gap vs DermEngine', 'Top 3 objections to AI-assisted dermatology']);
  if (state === 'idle') return agentShell('admin', head, scope, botMsg('admin', `<p>I generate market-intelligence briefs from our <b>approved Golden Docs</b> only. Every fact I give you is cited to a source section. I don\u2019t touch patient data and won\u2019t give clinical advice.</p>`, { sources: ['Golden Docs · index v12'], cite: true }), chips, inputBar('Ask a market-research question…', { note: 'Golden Docs only · no patient data · no clinical advice' }));
  if (state === 'generating') return agentShell('admin', head, scope, userMsg('Summarise our ICP for European dermatology practices') + botMsg('admin', `<p>Our primary ICP is <b>mid-size private dermatology groups (4–20 clinicians)</b> in DACH and Nordics with existing teledermatology intake and a compliance lead who owns data-governance sign-off.</p><p>Secondary: hospital-affiliated dermatology departments piloting AI triage under research</p>`, { streaming: true }), chips, inputBar('Ask a market-research question…'));
  if (state === 'response') return agentShell('admin', head, scope, userMsg('Top 3 objections to AI-assisted dermatology') + botMsg('admin', `<p>From the approved positioning docs, the top three objections are:</p><ul><li><b>Liability</b> — "who is responsible for a miss?" Countered by the educational, non-diagnostic framing.</li><li><b>Workflow fit</b> — integration cost into existing PACS/EMR.</li><li><b>Fairness</b> — performance across skin tones; answered with the published calibration work.</li></ul>`, { sources: ['Golden Docs › Positioning §3.2', 'Golden Docs › Objections §5.1'], cite: true }), chips, inputBar('Ask a market-research question…'));
  if (state === 'stale') return agentShell('admin', head, scope, userMsg('Competitive positioning gap vs DermEngine') + botMsg('admin', `<p>I can answer, but note the relevant Golden Doc <b>(Competitive §2)</b> was last approved <b>94 days ago</b> — figures may be out of date. Treat this as directional until it\u2019s refreshed.</p><p>Per that source, the main gap is explainability depth: our Grad-CAM explanation surface vs their score-only output.</p>`, { sources: ['Golden Docs › Competitive §2 · 94d old'], cite: true }), chips, inputBar('Ask a market-research question…'), { banner: `<div class="agent-banner warn">${ic('alert-triangle')}<div><div class="ab-t">Source is stale</div><div class="ab-d">Some Golden Docs are over 90 days old. Refresh and re-approve them for current figures.</div></div></div>` });
  if (state === 'blocked') return agentShell('admin', head, scope, userMsg('Is this patient\u2019s mole likely benign?') + botMsg('admin', `<p>That\u2019s a clinical question about a patient, which is outside my scope. I only provide <b>business intelligence</b> from Golden Docs — no patient data, no clinical advice.</p><p>I can help with market sizing, positioning, or objection handling instead.</p>`, { sources: ['no source — out of scope'] }), suggest(['Summarise our ICP for European dermatology practices']), inputBar('Ask a market-research question…'), { banner: `<div class="agent-banner block">${ic('shield-off')}<div><div class="ab-t">Clinical / patient question blocked</div><div class="ab-d">This admin agent never answers clinical or patient-specific questions.</div></div></div>` });
  return agentShell('admin', head, scope, `<div class="state-box" style="margin:auto"><div class="sb-ic" style="background:var(--neutral-bg);color:var(--neutral)">${ic('file-x')}</div><h4>No Golden Docs approved</h4><p>This agent can only answer from approved sources. None are currently approved, so it can\u2019t generate a brief. Approve at least one Golden Doc to begin.</p><div class="sb-act"><button class="btn btn-primary">${ic('file-check')}Review Golden Docs</button></div></div>`, '', inputBar('Approve a source to begin…', { disabled: true }));
}

/* ── isolation note ──────────────────────────────────────────────────── */
function isolationNote() {
  return `<div class="opc" style="margin-top:var(--sp-lg)"><div style="display:flex;align-items:center;gap:14px;padding:var(--sp-md)">
    <div style="width:40px;height:40px;border-radius:var(--radius-md);background:var(--ink-900);color:#fff;display:grid;place-items:center;flex-shrink:0">${ic('split')}</div>
    <div style="flex:1"><div style="font:700 13px var(--font-sans);color:var(--text-primary)">Four separate systems — not one shared memory</div><div style="font:400 12.5px/1.55 var(--font-sans);color:var(--text-secondary);margin-top:3px">Each agent has its own RAG index, permission scope, and chat history. No surface can read another\u2019s conversation, and none can reach patient PHI. Every response shows a source or an explicit "no source" label.</div></div>
  </div></div>`;
}

/* ════════════════════════════ MOBILE ════════════════════════════ */
function mAgentCard(theme, label, name, scopeText, msgHtml, scopePillText) {
  return `<div class="agent-shell ${theme}" style="height:auto;margin-bottom:14px">
    ${theme === 'patient' ? patientHead() : theme === 'doctor' ? doctorHead() : theme === 'research' ? researchHead() : adminHead('green')}
    ${theme === 'patient' ? patientScope() : theme === 'doctor' ? doctorScope() : theme === 'research' ? researchScope() : adminScope()}
    <div class="agent-body" style="max-height:300px">${msgHtml}</div>
    ${inputBar('Message…', {})}
  </div>`;
}

/* ASSEMBLE — desktop shows the 4 surfaces; this is a documentary showcase,
   not an app shell, since these are embedded panels in 4 different products. */
const mast = masthead({
  eyebrow: 'Skin Lesion XAI · Clinical Premium · four roles',
  title: 'Agentic XAI chat surfaces',
  sub: 'Four role-scoped AI assistants, each embedded in a different product surface, each visually distinct and permission-bounded. They never share a chat history or a knowledge index: the Patient Education assistant answers general questions and refuses specific results; the Doctor Workflow agent is locked to one open case and structured facts; the Research Governance agent returns aggregate, de-identified statistics only; the Admin Market Research agent answers strictly from approved Golden Docs with a citation on every fact. Every reply carries a source — or an explicit "no source" — and no surface can reach patient PHI.',
  legend: ['Permission scope — color + icon + text', ['blue', 'graduation-cap', 'Patient · education only'], ['blue', 'folder-lock', 'Doctor · one case'], ['neutral', 'users', 'Research · aggregate'], ['neutral', 'book-lock', 'Admin · Golden Docs']],
});

const s1 = sectionHead('1', 'Surface 1 — Patient Education Assistant', 'embedded in the patient dashboard · educational only')
  + `<div class="agent-2x2">`
  + frame('1·idle', 'Idle', 'Opens with a calm welcome, suggested questions, and a standing reminder it can\u2019t discuss specific results.', `<div style="padding:0">${patientAgent('idle')}</div>`, { url: 'app.skinlesionxai.health · education assistant' })
  + frame('1·stream', 'Streaming a reply', 'A "What is Grad-CAM?" answer streams in with a blinking caret and a source chip.', `<div style="padding:0">${patientAgent('streaming')}</div>`, { url: 'app.skinlesionxai.health · education assistant' })
  + frame('1·resp', 'Response with citations', 'A completed answer with citation chips and a "Learn more" link.', `<div style="padding:0">${patientAgent('response')}</div>`, { url: 'app.skinlesionxai.health · education assistant' })
  + frame('1·phi', 'PHI blocked', 'A patient pastes image data and asks for a diagnosis; the agent blocks it, confirms nothing was stored, and redirects.', `<div style="padding:0">${patientAgent('phi-blocked')}</div>`, { url: 'app.skinlesionxai.health · education assistant' })
  + `</div>`
  + `<div class="agent-2x2" style="margin-top:var(--sp-lg)">`
  + frame('1·exp', 'Session expired', 'A calm, security-framed timeout with no conversation stored.', `<div style="padding:0">${patientAgent('expired')}</div>`, { url: 'app.skinlesionxai.health · education assistant' })
  + frame('1·err', 'Error', 'A connection error that reassures the question is safe and offers a retry.', `<div style="padding:0">${patientAgent('error')}</div>`, { url: 'app.skinlesionxai.health · education assistant' })
  + `</div>`;

const s2 = sectionHead('2', 'Surface 2 — Doctor Workflow Agent', 'case detail only · structured facts only')
  + `<div class="agent-2x2">`
  + frame('2·loaded', 'Case loaded', 'Scoped to CASE-7731 with suggested case actions; the header shows the case ID and the "this case only" scope.', `<div style="padding:0">${doctorAgent('idle')}</div>`, { url: 'doctor.skinlesionxai.health/cases/7731 · agent' })
  + frame('2·draft', 'Drafting with trace', 'Drafts an opinion note from structured facts and exposes a Trace showing exactly which facts were used.', `<div style="padding:0">${doctorAgent('drafting')}</div>`, { url: 'doctor.skinlesionxai.health/cases/7731 · agent' })
  + frame('2·summary', 'AI-output summary', 'Summarises label, confidence, region, image quality and Grad-CAM regions — facts only, never raw notes.', `<div style="padding:0">${doctorAgent('summary')}</div>`, { url: 'doctor.skinlesionxai.health/cases/7731 · agent' })
  + frame('2·submitted', 'Opinion submitted — locked', 'Once the doctor submits their opinion, the agent goes read-only for the case.', `<div style="padding:0">${doctorAgent('submitted')}</div>`, { url: 'doctor.skinlesionxai.health/cases/7731 · agent' })
  + `</div>`
  + `<div class="agent-2x2" style="margin-top:var(--sp-lg)">`
  + frame('2·nocase', 'No case loaded — disabled', 'Outside a case, the input is disabled with a clear explanation.', `<div style="padding:0">${doctorAgent('no-case')}</div>`, { url: 'doctor.skinlesionxai.health · agent' })
  + `</div>`;

const s3 = sectionHead('3', 'Surface 3 — Research Governance Agent', 'aggregate, de-identified data only')
  + `<div class="agent-2x2">`
  + frame('3·idle', 'Idle', 'Introduces itself as aggregate-only and lists governance questions it can answer.', `<div style="padding:0">${researchAgent('idle')}</div>`, { url: 'research.skinlesionxai.health · governance agent' })
  + frame('3·gen', 'Generating summary', 'A typing indicator while it computes a 30-day aggregate.', `<div style="padding:0">${researchAgent('generating')}</div>`, { url: 'research.skinlesionxai.health · governance agent' })
  + frame('3·resp', 'Aggregate response', 'A subgroup false-negative statistic with cohort size and an explicit aggregate-only caveat.', `<div style="padding:0">${researchAgent('response')}</div>`, { url: 'research.skinlesionxai.health · governance agent' })
  + frame('3·phi', 'Individual record blocked', 'A request for one case is refused; only aggregate statistics are ever returned.', `<div style="padding:0">${researchAgent('phi-blocked')}</div>`, { url: 'research.skinlesionxai.health · governance agent' })
  + `</div>`
  + `<div class="agent-2x2" style="margin-top:var(--sp-lg)">`
  + frame('3·nodata', 'No data available', 'When the window lacks settled labels it says so rather than returning a noisy number.', `<div style="padding:0">${researchAgent('no-data')}</div>`, { url: 'research.skinlesionxai.health · governance agent' })
  + `</div>`;

const s4 = sectionHead('4', 'Surface 4 — Admin Market Research Agent', 'Golden Docs only · cited on every fact')
  + `<div class="agent-2x2">`
  + frame('4·idle', 'Idle · Golden Docs healthy', 'Header shows a Golden Docs health indicator; the agent cites every fact to a source section.', `<div style="padding:0">${adminAgent('idle')}</div>`, { url: 'admin.skinlesionxai.health/market · agent' })
  + frame('4·gen', 'Generating a brief', 'An ICP brief streams in, scoped to business intelligence only.', `<div style="padding:0">${adminAgent('generating')}</div>`, { url: 'admin.skinlesionxai.health/market · agent' })
  + frame('4·resp', 'Brief with cite chips', 'A finished objection-handling brief with "Cite source" chips pointing at Golden Doc sections.', `<div style="padding:0">${adminAgent('response')}</div>`, { url: 'admin.skinlesionxai.health/market · agent' })
  + frame('4·stale', 'Source stale', 'A 94-day-old Golden Doc triggers a stale-source banner and a directional caveat.', `<div style="padding:0">${adminAgent('stale')}</div>`, { url: 'admin.skinlesionxai.health/market · agent' })
  + `</div>`
  + `<div class="agent-2x2" style="margin-top:var(--sp-lg)">`
  + frame('4·blocked', 'Clinical question blocked', 'A patient/clinical question is refused — this agent only does business intelligence.', `<div style="padding:0">${adminAgent('blocked')}</div>`, { url: 'admin.skinlesionxai.health/market · agent' })
  + frame('4·nosrc', 'No sources approved', 'With no approved Golden Docs, the agent can\u2019t answer and routes to source approval.', `<div style="padding:0">${adminAgent('no-sources')}</div>`, { url: 'admin.skinlesionxai.health/market · agent' })
  + `</div>`
  + isolationNote();

const mobile = sectionHead('B', 'Mobile — embedded agent panels', '375px · each agent in its own product')
  + '<div class="frame-grid">'
  + mframe('M1', 'Patient · education', 'The education assistant as a full-screen sheet inside the patient app, with its scope banner and source chips.', mPhone(`${patientAgent('response')}`, { tabs: [], title: 'Education', eyebrow: 'Assistant', env: 'Secure', envState: 'green' }))
  + mframe('M2', 'Doctor · case-scoped', 'The workflow agent inside a case, showing a draft note and its fact trace.', mPhone(`${doctorAgent('drafting')}`, { tabs: [], title: 'CASE-7731', eyebrow: 'Workflow agent', env: 'Case', envState: 'green' }))
  + mframe('M3', 'Research · aggregate', 'The governance agent returning an aggregate subgroup statistic.', mPhone(`${researchAgent('response')}`, { tabs: [], title: 'Governance', eyebrow: 'Aggregate only', env: 'No PHI', envState: 'green' }))
  + mframe('M4', 'Admin · Golden Docs', 'The market-research agent with cited facts and a Golden Docs health indicator.', mPhone(`${adminAgent('response')}`, { tabs: [], title: 'Market research', eyebrow: 'Admin only', env: 'BI only', envState: 'green' }))
  + '</div>';

mountShowcase([mast, s1, s2, s3, s4, mobile]);
