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

## Notes For Stitch Iteration

After Stitch generates the first version, ask it to refine with:

```text
Make the interface more realistic and production-ready. Reduce decorative clutter, improve table density, make forms clearer, strengthen mobile responsiveness, preserve clinical trust, and keep the visual system calm enough for healthcare workflows.
```

Then ask:

```text
Create three alternate visual directions for this same UI: lighter clinical, darker professional, and investor-demo premium. Keep the same information architecture, status states, privacy rules, and admin control requirements. Do not add organ spectacle, generic AI purple gradients, or diagnosis claims.
```
