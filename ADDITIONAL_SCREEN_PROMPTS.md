# Additional Screen Prompts

Extended screen prompts for surfaces not covered in `GENERATE_SCREENS.md`. This file covers:

- Extended patient-facing screens (3D body map, customer dashboard, agent chat UIs, consent, lesion timeline, lab OCR)
- Operator surfaces (DLQ, circuit breakers, model drift, calibration, shadow deployment, canary, sticky sessions, feature flags, SLO board)
- Image generation prompts for operator/brand visuals

Use these the same way you use the prompts in `GENERATE_SCREENS.md`: copy the **Shared Clinical Premium Design Brief** block below, then copy the prompt block for the screen you want, combine them, and paste both into Claude Design.

---

## Shared Clinical Premium Design Brief

Apply this to every prompt in this file - same as the brief in `CLAUDE_DESIGN_PROMPTS.md` Step 2.1.

```text
Audience:
Patients, doctors, administrators, and research reviewers. Every screen must feel calm, trustworthy, private, and usable under stress.

Design tone:
Clinical Premium. Workflow-first composition, quiet confidence, clear hierarchy, realistic healthcare-product details.

Visual system:
- Off-black, charcoal, white, or light clinical surfaces
- One restrained product accent and semantic status colors only
- No decorative purple/blue gradient glow, generic AI visual tropes, emoji icons, cluttered glass cards, excessive rounded cards, or decorative anatomy
- Accessible contrast, clear typography, strong spacing, stable responsive layouts

Status color language:
- low concern = calm green
- monitor / needs follow-up = amber
- professional review recommended = blue or amber
- urgent review recommended = limited red for status/warnings only
- pending = neutral
- consent withdrawn / deletion requested = neutral warning treatment, not alarmist

Medical safety language:
Use: AI-assisted monitoring, educational support, model explanation, image quality guidance, lesion history, privacy-aware health tool, doctor-review support.
Do NOT use: diagnosis, melanoma detection, cancer testing, guaranteed detection, treatment advice, dermatologist replacement, clinician replacement, emergency support.

Every patient-facing screen must include:
"This platform is not a medical diagnosis tool. It provides educational AI-supported information and helps organize lesion history for professional review."
```

---

## Group D — Extended Patient Screens

### D.1 Customer Dashboard (overview module)

```text
Design a responsive customer dashboard for Skin Lesion XAI.
Apply the Shared Clinical Premium Design Brief.

The dashboard should feel like a personal skin-monitoring dashboard, not a cancer-prediction dashboard.

Include summary cards or compact modules for: tracked lesions, lesions needing follow-up, recent analysis, doctor review pending, next reminder, storage/privacy mode, and lab result status. Avoid excessive card boxes if the screen becomes cluttered — use tables, timelines, dividers, and grouped sections where clearer.

Include sections for: lesion list, body map pins with verification status, recent activity feed, analyze lesion entry point, reminders, reports, privacy and consent center, notifications, and education.

States:
- Loading skeleton
- Empty (no lesions yet)
- Active with full content
- Account pending approval

DO NOT: imply diagnosis, cancer detection, or clinician replacement. No alarmist colors. No raw medical values without context.
```

### D.2 3D Body Map

```text
Design a responsive 3D body-location mapping screen for Skin Lesion XAI.
Apply the Shared Clinical Premium Design Brief.

Show a clean, non-gory, generic human body model that can rotate. Let the user tap a body region, place a lesion pin, view existing lesion pins, and open lesion history from a pin.

Include:
- 2D fallback toggle (always visible)
- Loading state (model loading)
- Unsupported-device state (no WebGL)
- Model-load error state
- Pin placement confirmation sheet
- Precise coordinate summary for doctors/admins
- Front/back shortcut buttons
- Privacy reminder

This is functional body mapping. Do not make it dramatic, decorative, or diagnosis-like. Controls must be practical and readable.

DO NOT: use realistic anatomical organs, explicit regions, dramatic lighting, or diagnosis-like language. Keep it gender-neutral and abstract.
```

### D.3 React Native Mobile 3D Body Map

```text
Design a React Native mobile 3D body-map screen for Skin Lesion XAI.
Apply the Shared Clinical Premium Design Brief.

The screen lets a patient rotate a clean, non-gory, generic human body model, tap a body region, place a lesion pin, view existing pins, and open lesion details from a pin. The selected location must be labeled as "patient-submitted" until doctor verification.

Include:
- 2D fallback toggle
- Unsupported-device state
- Loading state
- Model-load error state
- Pin placement confirmation sheet
- Coordinate summary
- Privacy reminder
- Safe copy that says location is not clinically verified yet

Controls must be thumb-friendly: rotate, reset view, front/back shortcuts, confirm location, cancel, switch to 2D map.

States:
- Loading
- Model loaded, no pins
- Model loaded, with existing pins
- Pin placement mode (region selected, confirm/cancel)
- Fallback 2D mode
- Error / unsupported device

DO NOT: make the 3D model dramatic, gory, or diagnosis-like. Never confirm a location as clinically verified on the patient screen.
```

### D.4 Consent Management Center (full version)

```text
Design a full-screen Consent Management Center for the patient role of Skin Lesion XAI.
Apply the Shared Clinical Premium Design Brief.

Navigation path:
Privacy & Consent in the patient sidebar.

Main content sections:

1. Current Consent Status
   - Per-analysis consent cards: analysis ID, date, label (blurred), consent status (consented / withdrawn / pending / deletion requested), storage mode, consent version.
   - Withdraw button per card (confirm before action).
   - Request Data Deletion button per card (confirm + reason).
   - Bulk withdrawal option for all active consents.

2. Storage Mode Center
   - Current active mode with clear label and explanation of what data is stored.
   - Mode selector: Full Clinical History / Privacy Balanced / Maximum Privacy / Delete After Analysis / Metadata Only.
   - Plain-language summary of each mode (what is kept, for how long, who can see it).
   - "What happens if I change this mode?" callout per mode.

3. Active Consent for Training
   - Show which analyses have been approved for training (doctor-validated and admin-approved cases).
   - Withdraw from training button per approved case.
   - "Once data is written to the training bucket, withdrawal removes it from future training runs but cannot undo past training." - show this clearly.

4. Deletion Request Center
   - Pending deletion requests with status: requested, processing, completed, failed.
   - Timeline of completed deletions.
   - "Deletion of all data" button with a strong confirmation modal (must type "DELETE MY DATA" to confirm).

5. Consent Version History
   - Show each consent form version the patient has accepted and when.
   - Download / view link for each accepted consent form.

6. Privacy Help
   - "What does Skin Lesion XAI store about me?" collapsible section.
   - GDPR rights summary.
   - Contact privacy@skinlesionxai.com link (placeholder).

States:
Empty (no analyses yet), all consented, some withdrawn, deletion pending, deletion complete, storage mode changing, bulk withdrawal confirmation modal, deletion confirmation modal.

DO NOT: use dark patterns, pre-checked boxes, or confusing legal language without plain-English summary. Never show alarmist colors for consent withdrawal.
```

### D.5 Lesion History Timeline

```text
Design a dedicated Lesion History Timeline screen for the patient role of Skin Lesion XAI.
Apply the Shared Clinical Premium Design Brief.

Navigation path:
My Lesions > select a lesion > History tab.

Purpose:
Show the complete history of one tracked lesion — all analyses, doctor reviews, lab results, consent events, and body location verifications — in chronological order.

Timeline design:
- Vertical timeline with clearly separated event types.
- Group by month if the timeline is long.
- Each event has: date/time, event type icon, one-line summary, and an expand arrow for details.

Event types:
- Analysis (thumbnail placeholder, label, confidence range label, quality note, Grad-CAM available indicator)
- Doctor Review (doctor pseudonym, decision: validated/corrected/inconclusive, urgency note, review date)
- Lab Result (lab name, test date, review status: uploaded/reviewed/rejected, note from doctor)
- Consent Event (consent given, consent withdrawn, storage mode change, deletion request)
- Body Location Event (2D pin placed, 3D coordinate placed, location verified by doctor)
- Report Generated (download link, report version)
- Reminder Set (reminder type, date triggered)

Visual change indicator:
If two or more analyses exist, show a "change since last analysis" panel:
- Label change (benign → amber; back to benign → neutral)
- Confidence trend (increasing / decreasing / stable)
- Doctor review status change

Grad-CAM comparison:
Show a "Compare Analyses" panel when 2+ analyses exist.
Display two analysis cards side by side with heatmap thumbnail placeholders.
Include a simple overlay comparison toggle.

States:
Single analysis (no comparison available), multiple analyses, doctor review pending, all events view, filtered views (analyses only / doctor reviews only), empty timeline, export as PDF.

DO NOT: use diagnosis language, show cancer risk framing, or compare analyses in alarming visual language. The "change" indicator is informational only.
```

### D.6 Agentic XAI Chat Surfaces

```text
Design four separate role-scoped AI agent chat surfaces for Skin Lesion XAI.
Apply the Shared Clinical Premium Design Brief.
Each surface must look visually distinct and show its permission scope clearly.

--- Surface 1: Patient Education Agent ---
Accessible from the patient dashboard.
Purpose: educational skin health information, image quality guidance, privacy explanation, and doctor-appointment checklist.
Design as a sidebar or modal inside the patient dashboard.
Show: agent name ("Skin Lesion Education Assistant"), a visible label "Educational information only - not medical advice", source attribution on every response ("Source: general skin care education"), clear "This agent cannot discuss your specific results."
Suggested questions: "What is Grad-CAM?", "What does my confidence score mean?", "How do I prepare for a dermatologist visit?", "What is a benign lesion?"
Include streaming response animation, citation chips, and "Learn More" links.
States: idle, typing, streaming, error, session expired, PHI blocked (patient tries to paste raw image data).

--- Surface 2: Doctor Workflow Agent ---
Accessible from the doctor dashboard, case detail view only.
Purpose: assigned-case summary drafting and report support for the specific open case.
Show: "Doctor Workflow Agent - Case-Scoped", label "Access: this case only. No other patient data.", case ID in the header.
The doctor can ask: "Summarise the AI output for this case", "Draft an initial opinion note based on the Grad-CAM and patient-reported location", "What image quality issues should I note?"
The agent references structured facts only (label, confidence, body region, image quality, Grad-CAM regions) — never raw patient text or images.
Show a "Trace" expand button per response showing which facts were used.
States: idle, case-loaded, drafting, submitted (disabled after doctor submits opinion).

--- Surface 3: Research/Fairness Agent ---
Accessible from the research dashboard.
Purpose: aggregate de-identified governance summaries — no individual patient records.
Show: "Research Governance Agent - Aggregate data only", label "Aggregate statistics only. No patient identity. No PHI."
Suggested inputs: "Summarise calibration drift over the last 30 days", "What subgroup has the highest false negative rate?", "How many cases are in the active learning queue?", "Is the training dataset balanced across skin tone groups?"
States: idle, generating summary, no data available, PHI-blocked.

--- Surface 4: Admin Market Research Agent ---
Accessible from the admin dashboard, Market Research tab only.
Purpose: market intelligence and strategic decision support using Golden Docs only.
Show: "Market Research Agent - Admin only", label "Business intelligence only. No patient data. No clinical advice."
Suggested inputs: "Summarise our ICP for European dermatology practices", "What is the competitive positioning gap vs DermEngine?", "What are the top 3 objections to AI-assisted dermatology tools?"
Show a Golden Docs health indicator in the chat header.
Include a "Cite source" chip per fact showing the Golden Doc section used.
States: idle, generating brief, no sources approved, source stale, question blocked (clinical or patient question detected).

Cross-cutting requirements:
- Each surface has a distinct visual identity (background tint, header label, permission scope callout).
- None of them share a chat history with any other surface.
- All responses include a source or "no source" label.
- Input is disabled when the surface context is invalid (e.g., doctor surface disabled if no case is loaded).

DO NOT: share chat histories between surfaces, show patient PHI in any surface, allow clinical advice from the market research agent, or allow market research questions in the clinical agent.
```

### D.7 Lab OCR Result Review (doctor view)

```text
Design a Lab OCR Result Review screen for the doctor role of Skin Lesion XAI.
Apply the Shared Clinical Premium Design Brief.

Navigation path:
Doctor Dashboard > Case Detail > Lab Results tab.

Context:
A patient has uploaded a lab report PDF or image. The backend has run OCR and extracted structured fields. The doctor reviews extracted fields, corrects errors, and approves or rejects the lab result as clinical context.

Main content:

1. Original Document Panel (left)
   - PDF viewer or image viewer for the uploaded lab report.
   - Image served via signed URL, not raw path.
   - Page navigation for multi-page PDFs.
   - "Download original" link.
   - Blur/redact panel if consent is not active.

2. OCR Extracted Fields Panel (right)
   - Each field shows: field name, extracted value, confidence score (0-100%), and an edit input.
   - Fields: patient name (show as [REDACTED]), lab name, test date, report date, test type, result value, reference range, unit, interpretation (normal/abnormal/borderline), ordering physician, lab accreditation number.
   - Confidence color: >= 90% green, 70-89% amber, < 70% red.
   - Low-confidence fields pre-highlighted for review.
   - "Mark all correct" shortcut and "Edit" mode toggle.

3. Doctor Review Panel (bottom right)
   - Disposition: Approve as clinical context / Reject (image too blurry, wrong patient, unreadable, not relevant, consent issue).
   - If approving: "Doctor note" field and "Share with patient" toggle.
   - Rejection reason dropdown with free-text option.
   - Submit button with confirmation step.

4. OCR Metadata Footer
   - OCR model version, extraction timestamp, page count, confidence summary (average, min field confidence).

States:
OCR in progress (loading), OCR failed (show original only), fields extracted (normal flow), all fields correct (green summary), some fields low confidence (amber callout), rejection confirmed, approval confirmed, consent not active (blurred panel + warning), permission denied (not assigned to this case).

DO NOT: auto-approve lab results, show raw patient name anywhere, allow treatment recommendations based on lab values.
```

### D.8 Embedded Power BI Analytics Shell

```text
Design an internal embedded analytics page for Skin Lesion XAI.
Apply the Shared Clinical Premium Design Brief.

This is NOT the patient dashboard. It is for admin, doctor, research, model monitoring, image quality, consent/privacy, lab review, and operations analytics only.

Include a native app shell with role-aware tabs:
Overview, AI Analysis, Model Performance, Image Quality, Doctor Reviews, Body Location Verification, Consent & Privacy, Lab Results, Research Dataset, Operations.

Inside the shell, show a large embedded report area that feels integrated but is clearly framed by the app's native navigation, access controls, and audit banner.

Privacy rules visible in the design language:
- No patient names, no patient emails, no raw image URLs, no lab report file URLs, no free-text medical notes.
- Use analytics-safe labels: pseudonymous IDs, counts, trends, status, triage category, body region, model version, dataset version, consent status, quality score.

States:
Loading embed token, permission denied, token expired, report unavailable, RLS active, audit logged.

DO NOT: design this as the patient/customer dashboard. Never expose patient PHI in this shell.
```

### D.9 Role-Based Agent Overview (admin view)

```text
Design a role-based AI agent overview for Skin Lesion XAI administrators.
Apply the Shared Clinical Premium Design Brief.

Show five separated agent domains:
- Clinical/XAI Explanation Agent: safe structured explanation only.
- Doctor Workflow Agent: assigned-case summary drafting and report support.
- Customer Education Agent: user-scoped education, image-quality guidance, privacy explanation, and doctor-prep checklist.
- Research/Fairness Agent: de-identified aggregate model governance summaries.
- Admin Market Research Agent: Golden Docs, market intelligence RAG, and strategic decision briefs.

For each domain, show:
allowed sources, blocked sources, approval rules, trace status, last run, safety status, and owning role.

Make the interface clear that these are separate systems with separate RAG indexes, not one shared memory.

DO NOT: mix agent domains, show patient data in the market research agent, allow cross-domain source access.
```

---

## Group E — Operator Surfaces

Apply the **Operator Surface Brief** below to every prompt in this section, on top of the Shared Clinical Premium Design Brief.

### Operator Surface Brief

```text
Audience:
Internal operators — administrators, SREs, ML researchers, clinical operations. These users read dashboards under pressure during incidents and slow review cycles. Information density is higher than patient-facing surfaces.

Aesthetic register:
Same Clinical Premium calm as patient screens, but denser. Use tighter row heights, monospace for numerical fields, compact KPI tiles, log-style tables with severity bars, and small inline sparklines. Off-black / charcoal / clinical-white palette. No retro terminal, no Matrix-style green-on-black, no fake hacker aesthetics.

State language for operator screens:
- healthy = calm green dot or bar
- degraded = amber tag with clear definition of "degraded"
- circuit open = red tag with the dependency named
- queue full = red tag with current depth and threshold
- model degraded = amber tag with the failed gate named
- calibration drift exceeded = amber tag with the metric and threshold
- canary aborted = red tag with the SLO that triggered rollback
- sticky-affinity broken = amber tag with the pod and session count affected

Required for every operator surface:
- One-line "current state" summary at the top in plain language
- A "what to do now" callout that links to a runbook — never an empty alert
- Timestamps with timezone (e.g., "2026-05-13 14:22 UTC")
- Clear distinction between "what is" (current state) and "what was" (history)
- Consistent severity language across all screens

Safety reminder:
Operator UIs can show technical detail (queue names, ARNs, alarm names) but never raw patient PHI. Patient identifiers, if shown, are tokens — not emails or names.

Reject:
- sci-fi infrastructure diagrams
- decorative globe / network constellation spectacle
- terminal "hacker" aesthetics
- pie charts where a bar chart would be honest
- alarm pages that look like Christmas trees
- dashboards with no clear "what should I do now" answer
```

### E.1 Dead-Letter Queue Inspector

```text
Design a Dead-Letter Queue inspector screen for the admin role of Skin Lesion XAI.
Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
The operator inspects messages that failed processing in the training-eligibility, lab OCR, or de-identification SQS queues. Each message can be triaged, viewed in detail, replayed (after fix), or archived.

Sections:
1. Top KPI row: total DLQ depth across all queues, oldest message age, count of new arrivals in last 1h, count of replays in last 24h.
2. Queue selector: training-eligibility-dlq, lab-ocr-dlq, deidentification-dlq, training-pipeline-dlq.
3. Message table: timestamp (UTC), message ID, source queue, error class, retry count, age, payload preview (first 80 chars, PHI redacted), severity tag, actions.
4. Detail panel (right side): full payload JSON with PHI redacted, full stack trace, runbook link for this error class, "replay" and "archive" actions with a confirmation step.
5. Empty state: "No messages in the dead-letter queue. This is the happy path."
6. Error state: "Failed to load DLQ depth - check IAM permissions for the operator role."
7. Loading state.

Required states:
healthy (depth=0), warning (depth>0 but no alarm), critical (alarm fired), unauthorised (operator missing permission), unknown (queue not provisioned yet).

DO NOT: show raw PHI from the payload, use dramatic red for non-critical queue depth, expose raw ARNs to patient-facing screens.
```

### E.2 Idempotency-Key Log Viewer

```text
Design an Idempotency-Key log viewer for the admin role of Skin Lesion XAI.
Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
The operator audits idempotency-key usage to spot retry storms, duplicate-key collisions, replay attacks, or backend bugs.

Sections:
1. Top KPI row: keys recorded in last 24h, replay-hit rate, collision count, p95 server-side handling time.
2. Filter bar: endpoint (consent, analysis, lab-results, doctor-review), status (200, 201, 4xx, 5xx), patient token (tokenised, not email), date range.
3. Log table: timestamp (UTC), endpoint, idempotency-key (truncated), patient token, request hash, response status, replay-count, action (view).
4. Detail panel: full request hash, full response body (PHI redacted), original creation time, all replay timestamps.
5. Empty state: "No idempotency keys recorded in this range."
6. Risky-pattern banner: red banner if collision count > 0; amber if replay rate exceeds a defined threshold.

DO NOT: show raw idempotency keys without truncation, mix consent keys with analysis keys without a clear visual separator, expose patient emails.
```

### E.3 Circuit Breaker and Degraded-Mode Banner

```text
Design the circuit-breaker and degraded-mode banner system for Skin Lesion XAI.
Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
When a downstream dependency (model inference, LLM, OCR, RAG retrieval) is unhealthy, the platform shows a patient-facing banner and serves a degraded experience. Operators see a separate view of the same circuits.

Patient-facing variant:
- Top banner across the app: "Some explanations are temporarily unavailable. Your upload and prediction still work. Detailed model explanations will return shortly."
- Never use the word "broken" or technical terms.
- Use amber, not red, unless the entire prediction flow is down.
- Small "what is affected" link to a public status page (placeholder URL).

Operator-facing variant:
- Top status bar listing each circuit: inference, gradcam, llm-clinical, llm-customer, llm-doctor, llm-admin-market, ocr.
- For each: current state (closed/half-open/open), failure rate over last 60s, time since last state change.
- Click a circuit to see: dependency name, error class breakdown, runbook link, "force close" / "force open" admin actions (with confirm).

Required states:
- all green
- one circuit half-open (info banner, transitional)
- one circuit open (amber banner, patient flow continues with degraded explanation)
- inference circuit open (red banner, prediction itself is degraded)
- multiple circuits open (page-level red banner)

DO NOT: say "ERROR" in red across the entire page when only one circuit is open. Never expose circuit names like "gradcam" to patients.
```

### E.4 Model Drift Dashboard

```text
Design a Model Drift dashboard for the research and admin roles of Skin Lesion XAI.
Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
Monitor whether the production input distribution and output distribution have drifted from the training distribution. Drift is the precursor to silent model failure.

Sections:
1. Top KPI row: current input PSI vs training, current output PSI vs training, days since last retrain, number of drift alarms in last 30 days.
2. Input feature drift: small panels per feature — image brightness, contrast, skin-tone proxy distribution, image resolution, EXIF camera count. Each shows a histogram overlay (training vs production) and the divergence metric.
3. Output drift: predicted class distribution over time, calibration over time (ECE trend), confidence distribution histogram.
4. Cohort drift: breakdown by skin-tone bucket, upload-source (web vs mobile), approximate age band if collected.
5. Alarm history: timeline of drift alarms with the feature, the threshold, and the action taken.

Required states:
- no drift (calm green hero summary)
- early signal (one feature above warning threshold, amber)
- alert (drift exceeded, red, with "what to do now" link to retraining runbook)
- not-enough-data (gray, "need 7 days of production data before drift is meaningful")

DO NOT: use sci-fi data-river visualisation. Use simple, comparable histograms and trend lines.
```

### E.5 Calibration Curve and Reliability Diagram

```text
Design a Calibration view for the research role of Skin Lesion XAI.
Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
Show how well the model's predicted probability matches the empirical positive rate. A well-calibrated model that says 0.8 should be right 80% of the time.

Sections:
1. Reliability diagram: x-axis = predicted probability, y-axis = empirical positive rate, with the 45-degree perfect-calibration line, the model's curve, and confidence bands.
2. Histogram of prediction counts per probability bucket.
3. Expected Calibration Error (ECE) and Maximum Calibration Error (MCE) headline numbers.
4. Per-cohort calibration: same view broken down by skin-tone bucket, image source, or model version.
5. Compare two model versions side by side (current vs candidate, or pre-temperature vs post-temperature).
6. Action callout: "if ECE > threshold, schedule recalibration" with a link to the calibration runbook.

Required states:
- well-calibrated
- under-confident (model says 0.6, truth is 0.8)
- over-confident (model says 0.95, truth is 0.85 — the medical-AI bias direction to watch most)
- recalibration recommended

DO NOT: use decorative chart styles. Use the simplest reliability diagram convention.
```

### E.6 Shadow Deployment Comparison

```text
Design a Shadow Deployment comparison view for the admin and research roles.
Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
The candidate model runs in shadow alongside the production model. This view compares their predictions on the same inputs without affecting the user's response.

Sections:
1. Top KPI row: shadow agreement rate, mean confidence delta, prediction shift count, time the shadow has been running.
2. Side-by-side prediction table: timestamp, image thumbnail (placeholder), production prediction with confidence, shadow prediction with confidence, agreement tag.
3. Disagreement detail panel: full prediction comparison, Grad-CAM heatmap overlay diff, confidence delta histogram, links to the original cases.
4. Cohort breakdown: disagreement rates by skin-tone bucket and image source.
5. Action callout: "if all gates pass, graduate shadow to canary" with the link to the promotion runbook.

Required states:
- shadow running, healthy agreement
- shadow running, elevated disagreement (amber)
- shadow running, severe disagreement (red, do not promote)
- shadow not deployed
- shadow paused

DO NOT: return the shadow result to the patient under any condition. Always make clear the user response came from production.
```

### E.7 Canary Traffic-Split Control Panel

```text
Design a Canary Traffic-Split control panel for the admin role.
Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
The operator gradually shifts traffic from the production model to the new candidate. The system can auto-rollback on SLO breach.

Sections:
1. Top KPI row: current canary percentage, current error-rate delta vs baseline, current p95 latency delta vs baseline, time since canary started.
2. Traffic-split control: stepped slider (0% / 5% / 25% / 50% / 100%) with confirmation modal, current bucketing rule (consistent hashing on patient token so the same patient sees a consistent model).
3. Comparison panel: production-side metrics vs canary-side metrics on the same axes — request rate, error rate, p95 latency, prediction distribution.
4. Rollback policy: visible thresholds for auto-rollback (error rate > X, p95 latency > Y, calibration ECE > Z), current burn state, manual "rollback now" action with confirmation.
5. Action callout: "if SLOs hold for 24 hours at 50%, advance to 100%; if any SLO breaches, auto-rollback already fired" with link to runbook.

Required states:
- canary running, healthy
- canary running, watching one threshold
- canary aborted (red, with the SLO that triggered it shown prominently)
- canary at 100%, ready to promote
- no canary active

DO NOT: allow skipping a traffic stage without acknowledgement. Never show canary results to patients without a clear internal label.
```

### E.8 Sticky-Session Affinity Diagnostic

```text
Design a Sticky-Session affinity diagnostic for the operator role.
Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
When sticky sessions are configured at the load balancer, the operator needs to see when affinity is broken (pod evicted, ALB re-targeted, deploy in progress) and how many active sessions are affected.

Sections:
1. Top KPI row: active sessions, sticky-bound sessions, affinity-broken sessions in last hour, mean session lifetime.
2. Pod table: pod name, active sessions on this pod, status (running / draining / evicted), uptime, "drain gracefully" admin action.
3. Affinity-break log: timestamp, session token, original pod, new pod, reason (deploy, eviction, health-check failure), patient impact (degraded explanation cache regenerated).
4. Recommendation panel: if affinity-broken count is non-trivial, suggest moving the affected state to Redis instead and link to the cache pattern documentation.

Required states:
- affinity stable
- deploy in progress (info banner, expected breaks)
- unexpected breaks (amber)
- excessive breaks (red, with recommendation to externalise state)
- sticky not configured (info, here's what would change)

DO NOT: expose the raw session cookie value. Never show patient identity alongside session data.
```

### E.9 Feature Flag Console

```text
Design a Feature Flag console for the admin role, backed by AWS AppConfig.
Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
Toggle runtime feature flags without a deploy. Stage flags across environments, roll them out by percentage, and observe usage.

Sections:
1. Flag list: flag name, type (boolean / percentage / variant), current value per environment (dev / staging / prod), owner, last changed at, change author.
2. Flag detail: description, the code paths that read this flag (deep-link to the file in source), rollout history, SLO impact since last change.
3. Rollout control: percentage slider per environment with confirmation; for boolean, a switch with a "promote to next env" button.
4. Risk banner: "this flag has been on for 90 days — consider promoting to a config or removing."
5. Audit log: every change with who, when, why (free-text reason).

Required states:
- flag off everywhere
- flag on in dev only
- flag percentage rollout in progress
- flag on everywhere (consider removal)
- flag with no recent reads (dead flag, suggest removal)

DO NOT: allow changing a prod flag without a confirmation step or an audit note. Never expose flag names to patient-facing screens.
```

### E.10 SLO and Error-Budget Board

```text
Design an SLO and Error-Budget board for the operator role.
Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
Show each critical user journey's SLO, current attainment, error budget remaining for the month, and burn rate.

Sections:
1. Top: month-to-date error budget summary across all journeys.
2. Journey cards: one card per user journey — upload-and-predict, explain (Grad-CAM), doctor-review, lab-upload, admin-approve, research-query. Each card shows: SLO definition in one line, current attainment percentage, error budget remaining as a bar, burn rate (1h, 6h, 24h windows), runbook link.
3. Drill-in panel: latency histogram, error class breakdown, time-series of attainment over the month, related alarms.
4. Burn-rate alert banner: if 1h burn rate is high, "fast burn — investigate now"; if 6h burn rate is high, "slow burn — plan a fix this week".
5. Empty / no-data state: clear message about how many days of data are required before the SLO is meaningful.

Required states:
- all journeys healthy
- one journey in fast burn (red)
- one journey in slow burn (amber)
- budget exhausted (red, link to error-budget policy)
- not enough data yet (gray)

DO NOT: show 100-chart dashboards with no story. The operator must see "which journey to fix first" at a glance.
```

---

## Image Generation Prompts (Operator and Brand)

Use these in ChatGPT image generation if you need visuals beyond what `CHATGPT_IMAGE_PROMPTS.md` covers.

### Abstract Body Map Product Visual

```text
Clinical premium product visual for a skin lesion monitoring platform, showing a clean abstract human body map with subtle lesion location pins, privacy-first UI panels, refined off-black and light clinical surfaces, one restrained accent color, no gore, no organs, no text, no labels.
```

### Clean Clinical Dashboard Mockup Aesthetic

```text
High-end clinical dashboard mockup aesthetic for a healthcare web app, refined typography, realistic tables, body map preview, Grad-CAM explanation panel, lesion timeline, privacy controls, calm semantic status colors, no purple gradient glow, no sci-fi medical fantasy, no text, no people.
```

### Restrained UI Detail Shots

```text
Close-up product UI detail shot for a clinical AI support platform, showing image quality checklist, doctor review status, privacy mode selector, and report timeline details, premium but understated, accessible contrast, precise spacing, no emoji icons, no decorative anatomy, no labels.
```

### Grad-CAM and Lesion History Visual

```text
Clinical product visualization of an original skin image placeholder next to a Grad-CAM style heatmap overlay and lesion history timeline, educational model explanation concept only, calm healthcare UI, no diagnosis claim, no cancer-detection language, no text, no labels.
```
