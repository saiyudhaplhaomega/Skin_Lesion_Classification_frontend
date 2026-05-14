# Google Stitch Prompt Pack - Skin Lesion XAI

Use these prompts in Google Stitch to generate the design direction first. Do not treat this as implementation code. The goal is to create strong clinical product concepts and a design specification before building the frontend.

## Shared Clinical Premium Design Brief

Apply this brief to every Google Stitch prompt in this file.

```text
Audience:
Patients, doctors, administrators, and research reviewers. The product handles sensitive health-adjacent workflows, so every screen must feel calm, trustworthy, private, and usable under stress.

Design tone:
Clinical Premium. Make the interface polished and memorable without turning it into sci-fi medical fantasy. Use workflow-first composition, quiet confidence, clear hierarchy, and realistic healthcare-product details.

Visual system:
- Use off-black, charcoal, white, or light clinical surfaces depending on the screen purpose.
- Use one restrained product accent and semantic status colors only.
- Avoid decorative purple/blue gradient glow, generic AI visual tropes, emoji icons, cluttered glass cards, excessive rounded cards, and unnecessary decorative anatomy.
- Avoid default Inter unless it is already part of the approved app design system.
- Use accessible contrast, clear typography, strong spacing, and stable responsive layouts.

Status color language:
- low concern = calm green
- monitor / needs follow-up = amber
- professional review recommended = blue or amber
- urgent review recommended = limited red used only for status and warnings
- pending = neutral
- consent withdrawn / deletion requested = neutral warning treatment, not alarmist decoration

Medical safety language:
Use AI-assisted monitoring, educational support, model explanation, image quality guidance, lesion history, privacy-aware health tool, and doctor-review support.

Do not imply diagnosis, melanoma detection, cancer testing, guaranteed detection, treatment advice, dermatologist replacement, clinician replacement, or emergency support.

Every patient-facing concept should include:
This platform is not a medical diagnosis tool. It provides educational AI-supported information and helps organize lesion history for professional review.

State coverage:
Show realistic states where relevant: loading, empty, error, pending approval, active, suspended, expired, consent withdrawn, deletion requested, retake image, not enough information, doctor review pending, report generated, lab result uploaded, lab result reviewed, lab result rejected, notification unread, and success.

Functional 3D rule:
3D is for body mapping, lesion pin placement, region selection, coordinate review, and fallback states. It is not a decorative organ spectacle.

Role-based agent rule:
Show AI agents as role-scoped assistants, not one universal chatbot. Clinical/XAI, doctor workflow, customer education, research/fairness, and admin market research agents must have separate surfaces, permissions, source labels, and safety boundaries.

System design visibility rules (for operator and observability screens):
- Redis activation cache: operator screens may show cache latency, hit rate, TTL, and eviction rate. Patient screens must never expose cache internals.
- Rate limiting: admin and operator screens show rate limit tier per user (Tier 1: unauthenticated, Tier 2: authenticated patient, Tier 3: doctor/admin). Patient UI shows only "Request limit reached - try again in Ns."
- Feature flags: admin screens show AppConfig feature flag toggles per environment (dev/staging/prod). Patient and doctor screens show only the resulting enabled/disabled feature, never the flag name or config value.
- Circuit breakers: operator screens show per-circuit state (closed/half-open/open). Patient screens show a calm degraded-mode banner. Never expose technical circuit names to patients.
```

## Master Design Prompt

```text
Create a Clinical Premium medical AI product design for a web app called Skin Lesion XAI.

Product purpose:
Skin Lesion XAI helps patients upload or capture skin lesion images, receive AI-assisted educational analysis, view Grad-CAM model-explanation heatmaps, track lesion history, mark lesion locations on 2D and 3D body maps, upload optional lab results as doctor-review context, request doctor review, export reports, and manage privacy consent. Doctors review cases and submit expert opinions. Administrators control the full platform. Research reviewers inspect de-identified approved data, model performance, calibration, fairness, and active learning queues. Internal admin, doctor, research, model, image-quality, consent, lab, and operations analytics can be embedded through Power BI, but patient/customer dashboards stay native.

Visual direction:
Clinical Premium, medically calm, privacy-aware, and workflow-first. Use refined surfaces, precise typography, clear data hierarchy, realistic dashboard density, and restrained accent color. Make the design feel like a serious healthcare product and a strong portfolio piece without relying on sci-fi organ visuals or generic AI gradients.

Design requirements:
- Create a landing page concept.
- Create a patient dashboard.
- Create a customer dashboard overview.
- Create a lab result upload and review-status screen.
- Create a doctor dashboard.
- Create a full-control administrator dashboard.
- Create a 2D body-map lesion location screen.
- Create a 3D body-map lesion location screen.
- Create a React Native mobile 3D body-map screen.
- Create a research/model performance dashboard.
- Create an admin market research RAG and strategy brief screen.
- Create an internal Power BI embedded analytics shell for admin/doctor/research users.
- Create a cloud operations/cost-control screen showing dev, staging, and production-style environments, start/pause/resume/shutdown states, and clear cost warnings.
- Create a mobile capture concept.
- Use responsive desktop and mobile layouts.
- Include complete loading, empty, error, approval, access, privacy, review, and success states where relevant.
- Avoid misleading medical claims. Use AI support language, not final diagnosis language.
- Keep market research intelligence admin-only. Do not mix strategy docs with patient, doctor, lab-result, lesion, or clinical explanation data.
- Keep cloud and infrastructure language operator-focused: EKS is the main runtime path, Aurora DSQL is the planned cloud database target, Aurora PostgreSQL is fallback only, and Terraform module/Lambda folders are not part of the user-facing UI.

Reject the design direction if it looks like sci-fi medical fantasy, a generic AI dashboard, a cancer-detection product, decorative anatomy spectacle, cluttered glass-card interface, or a patient-facing Power BI dashboard.
```

## Landing Page Prompt

```text
Design a high-end responsive landing page for Skin Lesion XAI, a clinical AI explainability and lesion-history platform.

Style:
Clinical Premium. Use a calm product-led hero with real workflow signals: upload, Grad-CAM explanation, lesion timeline, body mapping, privacy modes, and doctor-review support. Use a restrained palette, strong typography, and realistic product previews.

First viewport:
Show the product name, concise value proposition, safety disclaimer, and clear CTA buttons: Analyze Image, View Explainability, Doctor Review, Privacy Modes. The main visual can be an abstract body-map/product composition or a polished dashboard preview, but it must not be decorative organ spectacle.

Sections:
1. AI-assisted skin lesion monitoring
2. Grad-CAM model explanation
3. Lesion history and body mapping
4. Doctor review workflow
5. Privacy, consent, and storage modes
6. Reports and educational support
7. Research and platform trust

Make the design memorable but medically calm. Keep text readable, product surfaces realistic, and safety language visible.
```

## Patient Dashboard Prompt

```text
Design a responsive patient dashboard for Skin Lesion XAI.

Style:
Clinical Premium healthcare app. Calm, clear, privacy-aware, and easy for patients. Use refined surfaces, generous spacing, accessible contrast, and one restrained accent. Do not make the dashboard look like a cancer prediction cockpit.

Navigation:
Dashboard, My Lesions, Body Map, Analyze, Lab Results, Reports, Doctor Reviews, Reminders, Privacy & Consent, Settings, Education.

Main content:
- Account status bar showing one of: Pending Approval, Active Lifetime, Active Subscription, Trial, Expired, Suspended.
- Upload or Capture Skin Image panel.
- Optional symptom/context questionnaire: duration, recent change, itching, bleeding, pain, crusting, family history, photo lighting.
- Image quality checklist: lighting, focus, distance, glare, surrounding skin visible.
- Smart retake guidance: move closer, move farther, brighter light, avoid flash glare, center lesion, hold steady, use ruler or coin, match previous angle.
- AI-assisted result panel with non-diagnostic triage wording, calibrated confidence, reliability, and uncertainty warning.
- Heatmap viewer with tabs: Original, Grad-CAM Heatmap, Overlay, Compare.
- Segmentation viewer with mask, boundary, overlay, and comparison states.
- 2D body-map selector and 3D body-map preview for lesion pins.
- Storage and retention controls: full clinical history, privacy balanced, maximum privacy, delete after analysis, 30 days, 1 year, until deleted, metadata only.
- Lab results section with PDF/image upload, test date, lab name, patient note, consent to share with doctor, and doctor review status.
- Reminder and notification cards.
- AI explanation panel with simple explanation, technical explanation, doctor-style summary, suggested questions, and free-text follow-up.
- Lesion timeline with previous captures, analysis history, doctor reviews, and reports.
- Subscription/access card showing plan, renewal date, expiry date, lifetime access, or admin override.
- Clear disclaimer: educational AI-supported information, not a medical diagnosis.

States to include:
New user pending admin approval, expired subscription, suspended account, empty lesion history, failed upload, failed heatmap, analysis loading, analysis complete, retake image, not enough information, professional review recommended, urgent review recommended, consent withdrawn, deletion requested.
```

## Customer Dashboard Prompt

```text
Design a responsive customer dashboard for Skin Lesion XAI.

The dashboard should feel like a personal skin-monitoring dashboard, not a cancer-prediction dashboard.

Include summary cards or compact summary modules for tracked lesions, lesions needing follow-up, recent analysis, doctor review pending, next reminder, storage/privacy mode, and lab result status. Avoid excessive card boxes if the screen becomes cluttered; use tables, timelines, dividers, and grouped sections where clearer.

Include sections for lesion list, body map pins with verification status, recent activity feed, analyze lesion entry point, reminders, reports, privacy and consent center, notifications, and education.

Use safe medical language. Do not imply diagnosis, cancer detection, or clinician replacement.
```

## Lab Results Prompt

```text
Design a lab results screen for Skin Lesion XAI.

Patients can upload a PDF lab report or image/photo of a lab report, add test date, lab provider/lab name, patient note, and choose whether to share it with a doctor.

Show statuses: uploaded, doctor reviewed, rejected, deleted. Show that lab results are clinical context for doctor review, not AI diagnostic proof.

Include private storage, consent, signed-link style access, deletion request, and doctor review notes. Keep free-text medical details private and avoid exposing raw lab report URLs.
```

## Doctor Dashboard Prompt

```text
Design a responsive doctor dashboard for Skin Lesion XAI.

Style:
Clinical Premium professional workflow. Dense but organized. Prioritize scanability, evidence review, patient privacy, and clinical trust. Use compact tables, clear filters, restrained status colors, and calm evidence panels.

Navigation:
Case Queue, Reviewed Cases, Patients, Reports, Messages, Profile.

Main content:
- Doctor approval/license status at the top.
- Case queue table with filters: priority, date, AI support level, confidence, unread, reviewed.
- Case detail view with original lesion image, Grad-CAM heatmap, overlay comparison, AI-assisted output, confidence, reliability score, and image quality notes.
- Patient-safe metadata only: age range, lesion location, patient-reported symptoms/red flags, prior lesion timeline.
- Dermatology-style case summary with location, first recorded date, image quality, AI output, change since previous image, Grad-CAM attention summary, symptoms, and recommendation.
- Expert opinion form with fields: assessment category, agree/disagree with AI support, urgency, recommendation, notes, request retake, refer to dermatologist.
- Review history and audit trail.
- Submit opinion button with confirmation state.

States to include:
Pending doctor approval, rejected doctor, suspended doctor, no cases, loading cases, failed heatmap, submitted review, permission denied.
```

## Administrator Dashboard Prompt

```text
Design a full-control administrator dashboard for Skin Lesion XAI.

Style:
Clinical Premium operations UI. Powerful, precise, and not cluttered. Use dense tables, strong filters, right-side edit drawers, clear destructive-action warnings, and restrained status colors. This is an admin tool, not patient UI.

Admin navigation:
Overview, Users, Patients, Doctors, Administrators, Approvals, Subscriptions, Access Control, Forms, Cases, Doctor Reviews, Market Research, Training Pool, Model Settings, Reports, Audit Logs, System Settings, Performance, Fairness, Active Learning, Observability.

Core requirement:
The administrator has full control of the platform. Admin can create, read, update, deactivate, reactivate, suspend, expire, renew, approve, reject, and delete records where appropriate. Dangerous deletion must be a separate confirmation flow with reason and audit trail.

User/customer lifecycle:
Registered -> Pending Admin Approval -> Active.
Admin must approve/allow the customer before full access.
Admin can set access type:
- Lifetime access
- Subscription access
- Trial access
- Custom start and end date
- Suspended
- Expired
- Deactivated

Admin CRUD areas:
- Patients/customers
- Doctors
- Administrators
- Roles and permissions
- Subscription plans
- Patient access policies
- Intake forms
- Consent forms
- Feedback forms
- Doctor review forms
- Cases
- Doctor reviews
- Reports
- Training-pool approvals
- Model versions/settings
- App content/settings
- Audit logs

Main screen layout:
- KPI modules: pending customers, pending doctors, active subscriptions, expired users, suspended users, cases needing review, reports waiting, model version, system health.
- Approval queue with tabs: Customers, Doctors, Training Cases.
- User management table with search, filters, bulk actions, row actions.
- Right-side details drawer for editing selected user.
- Access policy editor for lifetime/subscription/trial/custom expiry.
- Subscription override form for renew, pause, cancel, expire, or manual extension.
- Form builder area for intake/consent/feedback/review forms.
- Danger zone with Deactivate, Suspend, Permanent Delete, and Anonymize actions.
- Audit log panel showing actor, target, action, timestamp, reason, previous value, new value.
- Model performance panel with accuracy, sensitivity, specificity, calibration, false positives, false negatives, skin tone subgroup, body region, image quality, and device/camera filters.
- Active learning queue with uncertainty, model disagreement, rare pattern, underrepresented body region, and edge-case reasons.
- Market research entry card showing Golden Docs health, source review queue, latest strategy briefs, missing market data, and admin-only access label.
- Observability panel with API latency, inference time, Grad-CAM time, failed uploads, poor image quality rate, LLM safety failure rate, doctor queue size, storage usage, and error rates.

States to include:
Pending approval, active lifetime, active subscription, trial, expired, suspended, deactivated, failed save, success toast, permission denied, deletion confirmation modal.
```

## Admin Market Research RAG Prompt

```text
Design an administrator-only market research RAG screen for Skin Lesion XAI.

Purpose:
Help administrators maintain Golden Docs, approve new market intelligence sources, ask strategic questions, and generate structured decision briefs. This is business intelligence, not clinical support.

Navigation context:
This screen lives inside the administrator dashboard under Market Research. It must look distinct from patient, doctor, and clinical review workflows.

Main content:
- Golden Docs status: company overview, ICP and buyer personas, competitor intelligence, market and AI trends, compliance/privacy positioning, pricing and packaging hypotheses, product positioning and messaging, agent policy.
- Source intake queue with status: draft, approved, golden, archived, rejected.
- Source cards with type, trust level, uploaded by, last reviewed, citations, and approval actions.
- Ask a market research question panel with focus areas: ICP, competitor, market trends, product opportunity, pricing, sales messaging, GTM.
- Multi-agent progress view showing: Request Classifier, RAG Retrieval, ICP Analyst, Competitor Analyst, Market Trends Analyst, Product Opportunity Analyst, Pricing Analyst, Sales Messaging Analyst, Evidence Reviewer, Risk Reviewer, Strategy Synthesis.
- Generated decision brief with executive summary, recommendation, evidence used, ICP impact, competitor impact, product opportunity, risks and assumptions, suggested next actions, confidence level, and missing data.
- Promote insight to Golden Doc candidate action.
- Admin audit trail for source approval, brief generation, promotion, archive, and rejection.

Safety and data boundaries:
- Clearly label that market research RAG cannot use patient images, lesion records, lab reports, doctor notes, patient free text, raw clinical reports, PHI, or PII.
- Show source IDs and citations, not private patient data.
- Include a warning when a request asks for clinical advice or patient-specific analysis and route it away from market research.

States to include:
No Golden Docs yet, source upload pending, source approved, source rejected, brief generating, no evidence found, stale source warning, admin permission denied, retrieval disabled, promoted to Golden Doc candidate.
```

## 2D Body Map Prompt

```text
Design a responsive 2D body-location mapping screen for Skin Lesion XAI.

Include front body, back body, left side, right side, face/scalp, hands, and feet. Let the user place a lesion pin, name the lesion, add a note, and choose New lesion, Existing lesion, or Not sure. Show nearby saved lesion pins and a compact lesion timeline preview.

Keep the UI medically calm and clear. Include storage mode, privacy reminder, and safety disclaimer in the flow. The body illustration should be plain, non-gory, inclusive, and functional.
```

## 3D Body Map Prompt

```text
Design a responsive 3D body-location mapping screen for Skin Lesion XAI.

Show a clean non-gory generic human body model that can rotate. Let the user tap a body region, place a lesion pin, view existing lesion pins, and open lesion history from a pin. Include a 2D fallback toggle, loading state, unsupported-device state, model-load error state, and precise coordinate summary for doctors/admins.

This 3D screen is functional body mapping. Do not make it dramatic, decorative, diagnosis-like, or organ-focused. Controls must be practical and readable.
```

## React Native Mobile 3D Body Map Prompt

```text
Design a React Native mobile 3D body-map screen for Skin Lesion XAI.

The screen lets a patient rotate a clean non-gory generic human body model, tap a body region, place a lesion pin, view existing pins, and open lesion details from a pin. The selected location must be labeled as patient-submitted until doctor verification.

Include a 2D fallback toggle, unsupported-device state, loading state, model-load error state, pin placement confirmation sheet, coordinate summary, privacy reminder, and safe copy that says the location is not clinically verified yet.

Controls should be thumb-friendly on mobile: rotate, reset view, front/back shortcuts, confirm location, cancel, and switch to 2D map.

Keep the design calm and medical-supportive. Do not make the 3D model dramatic, gory, or diagnosis-like.
```

## Research And Model Performance Dashboard Prompt

```text
Design a research/admin dashboard for Skin Lesion XAI.

Include approved training images, rejected images, class balance, body-region distribution, image-quality distribution, consent status, doctor-validated labels, model performance over time, confidence calibration, fairness evaluation by skin tone/body region/image quality/device, active learning queue, model disagreement, and observability metrics.

Use dense professional tables and charts. Keep patient identity protected and show only de-identified approved data. Avoid patient names, emails, raw image URLs, lab file URLs, or free-text medical notes.

Include a research/fairness agent panel that summarizes de-identified aggregate performance, calibration, fairness slices, dataset gaps, active learning recommendations, and governance risks. Label it as aggregate model governance, not patient advice.
```

## Embedded Power BI Analytics Prompt

```text
Design an internal embedded analytics page for Skin Lesion XAI.

This is not the patient dashboard. It is for admin, doctor, research, model monitoring, image quality, consent/privacy, lab review, and operations analytics.

Include a native app shell with role-aware tabs:
Overview, AI Analysis, Model Performance, Image Quality, Doctor Reviews, Body Location Verification, Consent & Privacy, Lab Results, Research Dataset, Operations.

Inside the shell, show a large embedded report area that feels like Power BI but is framed by the app's native navigation, access controls, and audit banner.

Privacy rules must be visible in the design language:
no patient names, no patient emails, no raw image URLs, no lab report file URLs, no free-text medical notes.

Use analytics-safe labels such as pseudonymous IDs, counts, trends, status, triage category, body region, model version, dataset version, consent status, and quality score.

Include states:
loading embed token, permission denied, token expired, report unavailable, RLS active, audit logged.
```

## Cloud Operations And Cost Control Prompt

```text
Design a cloud operations and cost-control dashboard for Skin Lesion XAI administrators.

Purpose:
Help a learner/operator see whether dev, staging, and production-style environments are running, paused, or shut down.

Show environment modules for Dev, Staging, and Prod with:
status, last started, last paused, last shutdown, estimated cost risk, active EKS workloads, database state, ALB/Ingress state, DSQL state, GuardDuty/logging state, and pending Terraform changes.

Controls:
Start, Pause Runtime, Resume Runtime, Full Shutdown, View Terraform Plan, View Runbook.

Safety:
Full Shutdown requires a strong confirmation state. Prod actions require an additional CONFIRM_PROD style warning. Use calm but explicit destructive-action design.

Do not make this look like patient UI. It is an operator/admin tool.
```

## Mobile Capture Prompt

```text
Design a React Native mobile app concept for Skin Lesion XAI.

Include camera capture, smart retake guidance, offline encrypted storage, upload when online, push reminders, 2D body-map pins, 3D body-map preview when supported, lesion timeline, privacy mode selection, consent controls, lab result upload, reports, and safe result display.

The mobile app should feel like the companion to the web platform, not a separate product. Keep capture guidance practical: lighting, focus, distance, glare, scale reference, same angle over time, and no face or identifying details.
```

## Role-Based Agent Surfaces Prompt

```text
Design a role-based AI agent overview for Skin Lesion XAI administrators.

Show five separated agent domains:
- Clinical/XAI Explanation Agent: safe structured explanation only.
- Doctor Workflow Agent: assigned-case summary drafting and report support.
- Customer Education Agent: user-scoped education, image-quality guidance, privacy explanation, and doctor-prep checklist.
- Research/Fairness Agent: de-identified aggregate model governance summaries.
- Admin Market Research Agent: Golden Docs, market intelligence RAG, and strategic decision briefs.

For each domain, show:
allowed sources, blocked sources, approval rules, trace status, last run, safety status, and owning role.

Make the interface clear that these are separate systems with separate RAG indexes, not one shared memory.
```

## Image Generation Prompts

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

### Grad-CAM And Lesion History Visual

```text
Clinical product visualization of an original skin image placeholder next to a Grad-CAM style heatmap overlay and lesion history timeline, educational model explanation concept only, calm healthcare UI, no diagnosis claim, no cancer-detection language, no text, no labels.
```

## Agentic XAI Chat Surfaces Prompt

```text
Design four separate role-scoped AI agent chat surfaces for Skin Lesion XAI.
Apply the Shared Clinical Premium Design Brief.
Each surface must look visually distinct from the others and must show its permission scope clearly.

--- Surface 1: Patient Education Agent ---
Accessible from the patient dashboard.
Purpose: educational skin health information, image quality guidance, privacy explanation, and doctor-appointment checklist.
Design the chat panel as a sidebar or modal inside the patient dashboard.
Show: agent name ("Skin Lesion Education Assistant"), a visible label "Educational information only - not medical advice", source attribution on every response ("Source: general skin care education"), clear "This agent cannot discuss your specific results."
The input bar should show suggested questions: "What is Grad-CAM?", "What does my confidence score mean?", "How do I prepare for a dermatologist visit?", "What is a benign lesion?"
Include streaming response animation, citation chips, and a "Learn More" link style for external education references.
States: idle, typing, streaming, error, session expired, PHI blocked (if the patient tries to paste raw image data).

--- Surface 2: Doctor Workflow Agent ---
Accessible from the doctor dashboard, case detail view only.
Purpose: assigned-case summary drafting and report support for the specific case open in context.
Show: "Doctor Workflow Agent - Case-Scoped", label "Access: this case only. No other patient data.", case ID in the header.
The input bar allows the doctor to ask: "Summarise the AI output for this case", "Draft an initial opinion note based on the Grad-CAM and patient-reported location", "What image quality issues should I note?"
The agent references structured facts (label, confidence, body region, image quality, Grad-CAM regions) - never raw patient text or images.
Show a "Trace" expand button per response showing which facts were used.
States: idle, case-loaded, drafting, submitted (disabled after doctor submits opinion).

--- Surface 3: Research/Fairness Agent ---
Accessible from the research dashboard.
Purpose: aggregate de-identified governance summaries - no individual patient records.
Show: "Research Governance Agent - Aggregate data only", label "Aggregate statistics only. No patient identity. No PHI."
Suggested inputs: "Summarise calibration drift over the last 30 days", "What subgroup has the highest false negative rate?", "How many cases are in the active learning queue?", "Is the training dataset balanced across skin tone groups?"
States: idle, generating summary, no data available, PHI-blocked (if a question implies individual-level access).

--- Surface 4: Admin Market Research Agent ---
Accessible from the admin dashboard, Market Research tab only.
Purpose: market intelligence and strategic decision support using Golden Docs only.
Show: "Market Research Agent - Admin only", label "Business intelligence only. No patient data. No clinical advice."
Suggested inputs: "Summarise our ICP for European dermatology practices", "What is the competitive positioning gap vs DermEngine?", "What are the top 3 objections to AI-assisted dermatology tools?"
Show a Golden Docs health indicator in the chat header.
Include a "Cite source" chip per fact, showing the Golden Doc section used.
States: idle, generating brief, no sources approved, source stale, question blocked (clinical or patient question detected).

Cross-cutting requirements for all four surfaces:
- Each surface has a distinct visual identity (background tint, header label, permission scope callout).
- None of them share a chat history with any other surface.
- All responses include a source or "no source" label.
- Input is disabled when the surface context is invalid (e.g., doctor surface disabled if no case is loaded).
```

## Consent Management Center Prompt

```text
Design a full-screen Consent Management Center for the patient role of Skin Lesion XAI.
Apply the Shared Clinical Premium Design Brief.

Navigation path:
Privacy & Consent in the patient sidebar.

Purpose:
Patients manage their data storage choices, consent status, deletion requests, and active consent history in one place.

Main content sections:

1. Current Consent Status
   - Per-analysis consent cards: analysis ID, date, label (blurred), consent status (consented / withdrawn / pending / deletion requested), storage mode, consent version.
   - Withdraw button per card (confirm before action).
   - Request Data Deletion button per card (confirm + reason).
   - Bulk withdrawal option for all active consents.

2. Storage Mode Center
   - Current active mode with a clear label and explanation of what data is stored.
   - Mode selector: Full Clinical History / Privacy Balanced / Maximum Privacy / Delete After Analysis / Metadata Only.
   - A plain-language summary of each mode (what is kept, for how long, who can see it).
   - A "What happens if I change this mode?" callout per mode.

3. Active Consent for Training
   - Show which analyses have been approved for training (doctor-validated and admin-approved cases).
   - Withdraw from training button per approved case.
   - "Once data is written to the training bucket, withdrawal removes it from future training runs but cannot undo past training." - show this clearly.

4. Deletion Request Center
   - Pending deletion requests with status: requested, processing, completed, failed.
   - Timeline of completed deletions.
   - "Deletion of all data" button with a strong confirmation modal: must type "DELETE MY DATA" to confirm.

5. Consent Version History
   - Show each consent form version the patient has accepted and when.
   - Download / view link for each accepted consent form.

6. Privacy Help
   - "What does Skin Lesion XAI store about me?" collapsible section.
   - GDPR rights summary.
   - Contact privacy@skinlesionxai.com link (placeholder).

States to include:
Empty (no analyses yet), all consented, some withdrawn, deletion pending, deletion complete, storage mode changing, bulk withdrawal confirmation, deletion confirmation modal.
```

## Lesion History Timeline Prompt

```text
Design a dedicated Lesion History Timeline screen for the patient role of Skin Lesion XAI.
Apply the Shared Clinical Premium Design Brief.

Navigation path:
My Lesions > select a lesion > History tab.

Purpose:
Show the complete history of one tracked lesion - all analyses, doctor reviews, lab results, consent events, and body location verifications - in chronological order.

Timeline design:
Use a vertical timeline with clearly separated event types.
Group by month if the timeline is long.
Each event has: date/time, event type icon, a one-line summary, and an expand arrow for details.

Event types:
- Analysis (original image thumbnail placeholder, label, confidence range label, quality note, Grad-CAM available indicator)
- Doctor Review (doctor pseudonym, decision: validated/corrected/inconclusive, urgency note, review date)
- Lab Result (lab name, test date, review status: uploaded/reviewed/rejected, note from doctor)
- Consent Event (consent given, consent withdrawn, storage mode change, deletion request)
- Body Location Event (2D pin placed, 3D coordinate placed, location verified by doctor)
- Report Generated (download link, report version)
- Reminder Set (reminder type, date triggered)

Visual change indicator:
If two or more analyses exist, show a "change since last analysis" panel:
- label change (benign → malignant warning: amber; malignant → benign: neutral)
- confidence trend (increasing / decreasing / stable)
- doctor review status change

Grad-CAM comparison:
Show a "Compare Analyses" panel when 2+ analyses exist.
Display two analysis cards side by side: original image placeholder, date, label, heatmap thumbnail placeholder.
Include a simple overlay comparison toggle (if heatmaps are available).

States:
Single analysis (no comparison available), multiple analyses, doctor review pending, all events, only analyses filter, only doctor reviews filter, empty timeline, export timeline as PDF.
```

## Lab OCR Result Review Prompt

```text
Design a Lab OCR Result Review screen for the doctor role of Skin Lesion XAI.
Apply the Shared Clinical Premium Design Brief.

Navigation path:
Doctor Dashboard > Case Detail > Lab Results tab.

Context:
A patient has uploaded a lab report PDF or image. The backend has run OCR and extracted structured fields. The doctor reviews the extracted fields, corrects errors, and approves or rejects the lab result as clinical context.

Main content:

1. Original Document Panel (left)
   Show a PDF viewer or image viewer for the uploaded lab report.
   Image is served via signed URL, not raw path.
   Include page navigation for multi-page PDFs.
   Include a "Download original" link.
   Blur or redact panel if consent is not active.

2. OCR Extracted Fields Panel (right)
   Each extracted field shows: field name, extracted value, confidence score (0-100%), and an edit input.
   Fields to extract: patient name (show as [REDACTED] - never show PHI), lab name, test date, report date, test type, result value, reference range, unit, interpretation (normal/abnormal/borderline), ordering physician, lab accreditation number.
   Color the confidence score: >= 90% green, 70-89% amber, < 70% red.
   Fields with low confidence are pre-highlighted for doctor review.
   Include a "Mark all correct" shortcut and an "Edit" mode toggle.

3. Doctor Review Panel (bottom right)
   Disposition buttons: Approve as clinical context / Reject (image too blurry, wrong patient, unreadable, not relevant, consent issue).
   If approving: add a "Doctor note" field and a "Share with patient" toggle.
   Rejection reason dropdown with a free-text option.
   Submit button with a confirmation step.

4. OCR Metadata Footer
   Show: OCR model version, extraction timestamp, page count, confidence summary (average, min field confidence).

States:
OCR in progress (loading), OCR failed (show original only), fields extracted (normal flow), all fields correct (green summary), some fields low confidence (amber callout), rejection confirmed, approval confirmed, consent not active (blurred panel + warning), permission denied (not assigned to this case).
```

## Notes For Stitch Iteration

After Stitch generates the first version, ask it to refine with:

```text
Make the interface more realistic and production-ready. Reduce decorative clutter, improve table density, make forms clearer, strengthen mobile responsiveness, preserve clinical trust, and keep the visual system calm enough for healthcare workflows.
```

Then ask:

```text
Create three alternate visual directions for this same UI: lighter clinical, darker professional, and investor-demo premium. Keep the same information architecture, status states, privacy rules, and admin control requirements. Do not add organ spectacle, generic AI purple gradients, or diagnosis claims.
```

# Operator Surfaces

Operator surfaces are the screens an admin, SRE, or research operator uses to keep the platform alive. These are NOT patient-facing. They share the Clinical Premium discipline but live in a different aesthetic register: denser, more numerical, more state-machine-y. The patterns below close the gaps identified in the engineering review and complete the production picture.

Use these prompts AFTER the patient and clinical screens are stable. They build on the same Shared Brief but apply the additional Operator Surface Brief below.

## Operator Surface Brief

Apply this brief to every prompt in this section, on top of the Shared Clinical Premium Design Brief.

```text
Audience:
Internal operators - administrators, SREs, ML researchers, clinical operations. These users read dashboards under pressure during incidents and during slow review cycles. The information density is higher than patient-facing surfaces.

Aesthetic register:
Same Clinical Premium calm as patient screens, but denser. Use tighter row heights, monospace for numerical fields, compact KPI tiles, log-style tables with severity bars, and small inline sparklines. Keep the same off-black / charcoal / clinical-white palette. No retro terminal, no Matrix-style green-on-black, no fake hacker aesthetics.

State language for operator screens:
- healthy = calm green dot or bar
- degraded = amber tag with clear definition of "degraded"
- circuit open = red tag with the dependency named
- queue full = red tag with current depth and threshold
- model degraded = amber tag with the failed gate named
- calibration drift exceeded = amber tag with the metric and threshold
- canary aborted = red tag with the SLO that triggered rollback
- sticky-affinity broken = amber tag with the pod and session count affected

Reject:
- sci-fi infrastructure diagrams
- decorative globe / network constellation spectacle
- terminal "hacker" aesthetics
- pie charts where a bar chart would be honest
- alarm pages that look like Christmas trees
- dashboards with no clear "what should I do now" answer

Required for every operator surface:
- a one-line "current state" summary at the top, plain language
- a "what to do now" callout that links to a runbook, never an empty alert
- timestamps with timezone (e.g., "2026-05-13 14:22 UTC")
- a clear distinction between "what is" (current state) and "what was" (history)
- consistent severity language across all screens

Safety reminder for operators:
Operator UIs can show technical detail (queue names, ARNs, alarm names) but never raw patient PHI. Patient identifiers, if shown, are tokens, not emails or names.
```

## Dead-Letter Queue Inspector

```text
Design a Dead-Letter Queue inspector screen for the admin role of the Skin Lesion XAI platform. Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
The operator inspects messages that failed processing in the training-eligibility, lab OCR, or de-identification SQS queues. Each message can be triaged, viewed in detail, replayed (after fix), or archived.

Sections:
1. Top KPI row: total DLQ depth across all queues, oldest message age, count of new arrivals in last 1h, count of replays in last 24h.
2. Queue selector: training-eligibility-dlq, lab-ocr-dlq, deidentification-dlq, training-pipeline-dlq.
3. Message table: timestamp (UTC), message ID, source queue, error class, retry count, age, payload preview (first 80 chars), severity tag, actions.
4. Detail panel (right side): full payload JSON with PHI redacted, full stack trace, the runbook link for this error class, "replay" and "archive" actions with a confirmation step.
5. Empty state: "No messages in the dead-letter queue. This is the happy path."
6. Error state: "Failed to load DLQ depth - check IAM permissions for the operator role."
7. Loading state.

Required states:
- healthy (depth=0), warning (depth>0 but no alarm), critical (alarm fired), unauthorised (operator missing permission), unknown (queue not provisioned yet).

Reject sci-fi infrastructure diagrams, fake hacker aesthetics, and any UI that shows raw PHI from the payload.
```

## Idempotency-Key Log Viewer

```text
Design an Idempotency-Key log viewer for the admin role of the Skin Lesion XAI platform. Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
The operator audits idempotency-key usage to spot retry storms, duplicate-key collisions, replay attacks, or backend bugs.

Sections:
1. Top KPI row: keys recorded in last 24h, replay-hit rate, collision count, p95 server-side handling time.
2. Filter bar: endpoint (consent, analysis, lab-results, doctor-review), status (200, 201, 4xx, 5xx), patient token (tokenised, not email), date range.
3. Log table: timestamp (UTC), endpoint, idempotency-key (truncated), patient token, request hash, response status, replay-count (number of times the same key was retried), action (view).
4. Detail panel: full request hash, full response body (PHI redacted), original creation time, all replay timestamps.
5. Empty state: "No idempotency keys recorded in this range."
6. Risky-pattern banner: red banner if collision count > 0; amber if replay rate > a defined threshold.

Reject any UI that shows the raw idempotency key without truncation or that mixes consent keys with analysis keys without a clear visual separator.
```

## Circuit-Breaker And Degraded-Mode Banner

```text
Design the circuit-breaker and degraded-mode banner system for the Skin Lesion XAI platform. Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
When a downstream dependency (model inference, LLM, OCR, RAG retrieval) is unhealthy, the platform shows a banner and serves a degraded experience. Operators see a separate operator-side view of the same circuits.

Patient-facing variant:
- Top banner across the app: "Some explanations are temporarily unavailable. Your upload and prediction still work. Detailed model explanations will return shortly."
- Never use the word "broken" or technical terms.
- Use amber, not red, unless the entire prediction flow is down.
- Include a small "what is affected" link to a public status page (placeholder URL is fine).

Operator-facing variant:
- Top status bar listing each circuit: inference, gradcam, llm-clinical, llm-customer, llm-doctor, llm-admin-market, ocr.
- For each: current state (closed/half-open/open), failure rate over last 60s, time since last state change.
- Click a circuit to see: dependency name, error class breakdown, the runbook link, "force close" / "force open" admin actions (with confirm).

Required states:
- all green
- one circuit half-open (transitional, info banner)
- one circuit open (amber banner, patient flow continues with degraded explanation)
- inference circuit open (red banner, prediction itself is degraded)
- multiple circuits open (page-level red banner)

Reject any UI that says "ERROR" in red across the entire page when only one circuit is open.
```

## Model Drift Dashboard

```text
Design a Model Drift dashboard for the research and admin roles of the Skin Lesion XAI platform. Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
Monitor whether the production input distribution and output distribution have drifted from the training distribution. Drift is the precursor to silent model failure.

Sections:
1. Top KPI row: current input PSI vs training, current output PSI vs training, days since last retrain, number of drift alarms in last 30 days.
2. Input feature drift: small panels per feature - image brightness, contrast, skin-tone proxy distribution, image resolution, EXIF camera count. Each shows a histogram overlay (training vs production) and the divergence metric.
3. Output drift: predicted class distribution over time, calibration over time (Expected Calibration Error trend), confidence distribution histogram.
4. Cohort drift: drift broken down by skin-tone bucket (if MILK10K-style data is integrated), by upload-source (web vs mobile), by approximate age band if collected.
5. Alarm history: timeline of drift alarms with the feature, the threshold, the action taken.

Required states:
- no drift (calm green hero summary)
- early signal (one feature above warning threshold, amber)
- alert (drift exceeded, red, with "what to do now" link to retraining runbook)
- not-enough-data (gray, "need 7 days of production data before drift is meaningful")

Reject any sci-fi data-river visualisation; favour simple, comparable histograms and trend lines.
```

## Calibration Curve And Reliability Diagram

```text
Design a Calibration view for the research role of the Skin Lesion XAI platform. Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
Show how well the model's predicted probability matches the empirical positive rate. A well-calibrated model that says 0.8 should be right 80% of the time.

Sections:
1. Reliability diagram: x-axis = predicted probability, y-axis = empirical positive rate, with the 45-degree perfect-calibration line, the model's curve, and confidence bands.
2. Histogram of prediction counts per probability bucket.
3. Expected Calibration Error (ECE) and Maximum Calibration Error (MCE) headline numbers.
4. Per-cohort calibration: same view but broken down by skin-tone bucket, image source, or model version.
5. Compare two model versions side by side (current vs candidate, or pre-temperature vs post-temperature).
6. Action callout: "if ECE > threshold, schedule recalibration" with a link to the calibration runbook.

Required states:
- well-calibrated
- under-confident (model says 0.6, truth is 0.8)
- over-confident (model says 0.95, truth is 0.85; the medical-AI bias direction to fear most)
- recalibration recommended

Reject decorative chart styles; use the simplest reliability diagram convention.
```

## Shadow Deployment Comparison

```text
Design a Shadow Deployment comparison view for the admin and research roles. Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
The candidate model runs in shadow alongside the production model. The view compares their predictions on the same inputs, without affecting the user's response.

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

Reject UI that returns the shadow result to the patient under any condition; always make clear the user response came from production.
```

## Canary Traffic-Split Control Panel

```text
Design a Canary Traffic-Split control panel for the admin role. Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
The operator gradually shifts traffic from the production model to the new candidate. The system can auto-rollback on SLO breach.

Sections:
1. Top KPI row: current canary percentage, current error-rate delta vs baseline, current p95 latency delta vs baseline, time since canary started.
2. Traffic-split control: stepped slider (0% / 5% / 25% / 50% / 100%) with confirmation modal, current bucketing rule (consistent hashing on patient token so the same patient sees a consistent model).
3. Comparison panel: production-side metrics vs canary-side metrics on the same axes - request rate, error rate, p95 latency, prediction distribution.
4. Rollback policy: visible thresholds for auto-rollback (error rate > X, p95 latency > Y, calibration ECE > Z), current burn state, manual "rollback now" action with confirmation.
5. Action callout: "if SLOs hold for 24 hours at 50%, advance to 100%; if any SLO breaches, auto-rollback already fired" with link to runbook.

Required states:
- canary running, healthy
- canary running, watching one threshold
- canary aborted (red, with the SLO that triggered shown prominently)
- canary at 100%, ready to promote
- no canary active

Reject control UI that allows skipping a stage without acknowledgement.
```

## Sticky-Session Affinity Diagnostic

```text
Design a Sticky-Session affinity diagnostic for the operator role. Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

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
- excessive breaks (red, with the recommendation to externalise state)
- sticky not configured (info, here's what would change)

Reject any UI that exposes the raw session cookie value.
```

## Feature Flag Console

```text
Design a Feature Flag console for the admin role, backed by AWS AppConfig. Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
Toggle runtime feature flags without a deploy. Stage flags across environments, roll them out by percentage, and observe usage.

Sections:
1. Flag list: flag name, type (boolean / percentage / variant), current value per environment (dev / staging / prod), owner, last changed at, change author.
2. Flag detail: description, the code paths that read this flag (deep-link to the file in source), the rollout history, the SLO impact since last change.
3. Rollout control: percentage slider per environment with confirmation; for boolean, a switch with a "promote to next env" button.
4. Risk banner: "this flag has been on for 90 days - consider promoting to a config or removing" - one of the patterns to teach the operator.
5. Audit log: every change with who, when, why (free-text reason).

Required states:
- flag off everywhere
- flag on in dev only
- flag percentage rollout in progress
- flag on everywhere (consider removal)
- flag with no recent reads (dead flag, suggest removal)

Reject any UI that lets you change a prod flag without a confirmation step or an audit note.
```

## SLO And Error-Budget Board

```text
Design an SLO and Error-Budget board for the operator role. Apply the Shared Clinical Premium Design Brief and the Operator Surface Brief.

Purpose:
Show each critical user journey's SLO, current attainment, error budget remaining for the month, and burn rate.

Sections:
1. Top: month-to-date error budget summary across all journeys.
2. Journey cards: one card per user journey - upload-and-predict, explain (Grad-CAM), doctor-review, lab-upload, admin-approve, research-query. Each card shows: SLO definition in one line, current attainment percentage, error budget remaining as a bar, burn rate (1h, 6h, 24h windows), runbook link.
3. Drill-in panel: latency histogram, error class breakdown, time-series of attainment over the month, related alarms.
4. Burn-rate alert banner: if 1h burn rate is high, show "fast burn - investigate now"; if 6h burn rate is high, show "slow burn - plan a fix this week".
5. Empty / no-data state: clear message about how many days of data are required before the SLO is meaningful.

Required states:
- all journeys healthy
- one journey in fast burn (red)
- one journey in slow burn (amber)
- budget exhausted (red, link to error-budget policy)
- not enough data yet (gray)

Reject 100-chart dashboards with no story; the operator must see "which journey to fix first" at a glance.
```
