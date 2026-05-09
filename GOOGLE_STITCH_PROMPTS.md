# Google Stitch Prompt Pack - Skin Lesion XAI

Use these prompts in Google Stitch to generate the design direction first. Do not treat this as implementation code. The goal is to create strong visual dashboard concepts and a design specification before building the frontend.

## Master Design Prompt

```text
Create a premium medical AI product design for a web app called Skin Lesion XAI.

Product purpose:
Skin Lesion XAI helps patients upload or capture skin lesion images, receive AI-assisted skin lesion analysis, view Grad-CAM explainability heatmaps, track lesion history, mark lesion locations on 2D and 3D body maps, upload optional lab results as doctor-review context, request doctor review, export reports, and manage privacy consent. Doctors review cases and submit expert opinions. Administrators control the full platform. Research reviewers inspect de-identified approved data, model performance, calibration, fairness, and active learning queues.

Visual direction:
Elegant futuristic glassmorphism. Dark graphite clinical background. Transparent glass panels. Electric cyan, clinical teal, signal blue, subtle warm red pulse accents. Premium medical AI aesthetic. The design should look like a world-class portfolio project but still feel medically trustworthy.

Cinematic theme:
The landing page begins with an abstract transparent glass brain with electric pulses continuously flowing through neural pathways. On scroll, the experience moves down a translucent rotating spine. Later sections reveal abstract glass lungs and a beating glass heart with colored diagnostic energy flowing through them. Keep anatomy elegant, abstract, transparent, non-gory, and non-horror.

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
- Create a mobile capture concept.
- Use responsive desktop and mobile layouts.
- Include loading, empty, error, pending approval, suspended, expired, and success states where relevant.
- Include retake image, not enough information, professional review recommended, urgent review recommended, consent withdrawn, deletion requested, report generated, and demo mode states.
- Include lab result uploaded, lab result reviewed, lab result rejected, doctor review pending, reminder due, and notification read/unread states.
- Avoid misleading medical claims. Use AI support language, not final diagnosis language.
```

## Landing Page Prompt

```text
Design a high-end responsive landing page for Skin Lesion XAI, a medical AI explainability platform.

Style:
Premium glassmorphism, futuristic clinical, dark graphite background, transparent anatomy-inspired visuals, cyan/teal electric pulses, subtle diagnostic grid, elegant and non-gory.

First viewport:
Full-screen cinematic hero with a translucent glass brain as the main visual signal. Electric neural pulses flow through it continuously. Add premium navigation and clear CTA buttons: Analyze Image, View Explainability, Doctor Review, Admin Console.

Scroll story:
As the user scrolls, move from the glass brain down a rotating translucent spine. Later reveal abstract glass lungs and a beating glass heart with colored diagnostic energy flowing through them.

Sections:
1. AI skin lesion analysis
2. Grad-CAM heatmap explainability
3. Patient lesion timeline
4. Doctor review workflow
5. Admin platform control
6. Privacy, consent, and safety
7. Research evidence

Make the design cinematic but not cluttered. Keep text readable and dashboard previews realistic.
```

## Patient Dashboard Prompt

```text
Design a responsive patient dashboard for Skin Lesion XAI.

Style:
Premium dark glass medical AI interface. Transparent panels, soft blur, cyan/teal electric accents, subtle diagnostic grid, restrained warning colors. Calm, trustworthy, and easy for patients.

Navigation:
Dashboard, My Lesions, Body Map, Analyze, Lab Results, Reports, Doctor Reviews, Reminders, Privacy & Consent, Settings, Education.

Main content:
- Account status bar showing one of: Pending Approval, Active Lifetime, Active Subscription, Trial, Expired, Suspended.
- Upload or Capture Skin Image panel.
- Optional symptom/context questionnaire: duration, recent change, itching, bleeding, pain, crusting, family history, photo lighting.
- Image quality checklist: lighting, focus, distance, glare, surrounding skin visible.
- Smart retake guidance: move closer, move farther, brighter light, avoid flash glare, center lesion, hold steady, use ruler or coin, match previous angle.
- AI result panel with safe triage label, calibrated confidence, reliability, and uncertainty warning.
- Heatmap viewer with tabs: Original, Grad-CAM Heatmap, Overlay, Compare.
- Segmentation viewer with mask, boundary, overlay, and comparison states.
- 2D body-map selector and 3D body-map preview for lesion pins.
- Storage and retention controls: full clinical history, privacy balanced, maximum privacy, delete after analysis, 30 days, 1 year, until deleted, metadata only.
- Lab results section with PDF/image upload, test date, lab name, patient note, consent to share with doctor, and doctor review status.
- Reminder and notification cards.
- AI explanation panel with simple explanation, technical explanation, doctor-style summary, suggested questions, and free-text follow-up.
- Lesion timeline with previous captures, analysis history, doctor reviews, and reports.
- Subscription/access card showing plan, renewal date, expiry date, lifetime access, or admin override.
- Clear disclaimer: AI support, not a medical diagnosis.

States to include:
New user pending admin approval, expired subscription, suspended account, empty lesion history, failed upload, failed heatmap, analysis loading, analysis complete, retake image, not enough information, professional review recommended, urgent review recommended, consent withdrawn, deletion requested.
```

## Customer Dashboard Prompt

```text
Design a responsive customer dashboard for Skin Lesion XAI.

The dashboard should feel like a personal skin-monitoring dashboard, not a cancer-prediction dashboard.

Include summary cards for tracked lesions, lesions needing follow-up, recent analysis, doctor review pending, next reminder, storage/privacy mode, and lab result status.

Include sections for lesion list, body map pins with verification status, recent activity feed, analyze lesion entry point, reminders, reports, privacy and consent center, notifications, and education.

Use safe medical language. Do not imply diagnosis.
```

## Lab Results Prompt

```text
Design a lab results screen for Skin Lesion XAI.

Patients can upload a PDF lab report or image/photo of a lab report, add test date, lab provider/lab name, patient note, and choose whether to share it with a doctor.

Show statuses: uploaded, doctor reviewed, rejected, deleted. Show that lab results are clinical context for doctor review, not AI diagnostic proof.

Include private storage, consent, signed-link style access, deletion request, and doctor review notes.
```

## Doctor Dashboard Prompt

```text
Design a responsive doctor dashboard for Skin Lesion XAI.

Style:
Premium clinical glass interface. Dark graphite background, restrained cyan/teal highlights, dense but organized workflow. Prioritize scanability, evidence review, and clinical trust.

Navigation:
Case Queue, Reviewed Cases, Patients, Reports, Messages, Profile.

Main content:
- Doctor approval/license status at the top.
- Case queue table with filters: priority, date, AI risk, confidence, unread, reviewed.
- Case detail view with original lesion image, Grad-CAM heatmap, overlay comparison, AI prediction, confidence, reliability score, and image quality notes.
- Patient-safe metadata only: age range, lesion location, patient-reported symptoms/red flags, prior lesion timeline.
- Dermatology-style case summary with location, first recorded date, image quality, AI output, change since previous image, Grad-CAM attention summary, symptoms, and recommendation.
- Expert opinion form with fields: diagnosis category, agree/disagree with AI, urgency, recommendation, notes, request retake, refer to dermatologist.
- Review history and audit trail.
- Submit opinion button with confirmation state.

States to include:
Pending doctor approval, rejected doctor, suspended doctor, no cases, loading cases, failed heatmap, submitted review, permission denied.
```

## Administrator Dashboard Prompt

```text
Design a full-control administrator dashboard for Skin Lesion XAI.

Style:
Premium command-center glass UI. Dark clinical background, translucent panels, cyan/teal highlights, precise tables, strong filters, right-side edit drawers, clear destructive-action warnings. Powerful but not cluttered.

Admin navigation:
Overview, Users, Patients, Doctors, Administrators, Approvals, Subscriptions, Access Control, Forms, Cases, Doctor Reviews, Training Pool, Model Settings, Reports, Audit Logs, System Settings, Performance, Fairness, Active Learning, Observability.

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
- KPI cards: pending customers, pending doctors, active subscriptions, expired users, suspended users, high-risk cases, reports waiting, model version, system health.
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
- Observability panel with API latency, inference time, Grad-CAM time, failed uploads, poor image quality rate, LLM safety failure rate, doctor queue size, storage usage, and error rates.

States to include:
Pending approval, active lifetime, active subscription, trial, expired, suspended, deactivated, failed save, success toast, permission denied, deletion confirmation modal.
```

## 2D Body Map Prompt

```text
Design a responsive 2D body-location mapping screen for Skin Lesion XAI.

Include front body, back body, left side, right side, face/scalp, hands, and feet. Let the user place a lesion pin, name the lesion, add a note, and choose New lesion, Existing lesion, or Not sure. Show nearby saved lesion pins and a compact lesion timeline preview.

Keep the UI medically calm and clear. Include storage mode and safety disclaimer in the flow.
```

## 3D Body Map Prompt

```text
Design a responsive 3D body-location mapping screen for Skin Lesion XAI.

Show a clean non-gory generic human body model that can rotate. Let the user tap a body region, place a lesion pin, view existing lesion pins, and open lesion history from a pin. Include a 2D fallback toggle, loading state, unsupported-device state, and precise coordinate summary for doctors/admins.

Use premium clinical styling, but keep controls practical and readable.
```

## Research And Model Performance Dashboard Prompt

```text
Design a research/admin dashboard for Skin Lesion XAI.

Include approved training images, rejected images, class balance, body-region distribution, image-quality distribution, consent status, doctor-validated labels, model performance over time, confidence calibration, fairness evaluation by skin tone/body region/image quality/device, active learning queue, model disagreement, and observability metrics.

Use dense professional tables and charts. Keep patient identity protected and show only de-identified approved data.
```

## Mobile Capture Prompt

```text
Design a React Native mobile app concept for Skin Lesion XAI.

Include camera capture, smart retake guidance, offline encrypted storage, upload when online, push reminders, 2D body-map pins, 3D body-map preview when supported, lesion timeline, privacy mode selection, consent controls, lab result upload, reports, and safe result display.

The mobile app should feel like the companion to the web platform, not a separate product.
```

## React Native Mobile 3D Body Map Prompt

```text
Design a React Native mobile 3D body-map screen for Skin Lesion XAI.

The screen lets a patient rotate a clean non-gory generic human body model, tap a body region, place a lesion pin, view existing pins, and open lesion details from a pin. The selected location must be labeled as patient-submitted until doctor verification.

Include a 2D fallback toggle, unsupported-device state, loading state, model-load error state, pin placement confirmation sheet, coordinate summary, privacy reminder, and safe copy that says the location is not clinically verified yet.

Controls should be thumb-friendly on mobile: rotate, reset view, front/back shortcuts, confirm location, cancel, and switch to 2D map.

Keep the design calm and medical-supportive. Do not make the 3D model dramatic, gory, or diagnosis-like.
```

## Image Generation Prompts

### Glass Brain

```text
Abstract transparent glass brain floating in a dark clinical AI interface, electric cyan and teal pulses flowing through neural pathways, premium medical technology aesthetic, elegant non-gory anatomy, cinematic lighting, black graphite background, subtle diagnostic grid, no text, no labels.
```

### Glass Spine

```text
Translucent glass human spine descending vertically through a dark futuristic medical interface, electric pulses traveling down the vertebrae, cyan and blue light trails, elegant abstract anatomy, premium clinical sci-fi, no gore, no text, centered composition for scroll animation.
```

### Glass Heart And Lungs

```text
Abstract glass heart and lungs suspended in a premium medical AI environment, heart softly glowing with warm red pulse energy, lungs transparent with flowing blue oxygen-like light, cyan diagnostic particles, elegant non-gory anatomy, cinematic, no text, no labels.
```

### Admin Command Center Background

```text
Premium futuristic medical AI command center background, dark graphite glass panels, subtle cyan diagnostic grids, abstract neural network lines, clean clinical lighting, no text, no people, no gore, suitable as a dashboard background.
```

## Notes For Stitch Iteration

After Stitch generates the first version, ask it to refine with:

```text
Make the dashboard more realistic and production-ready. Reduce decorative clutter, improve table density, make forms clearer, strengthen mobile responsiveness, and keep the glassmorphism subtle enough for a medical workflow.
```

Then ask:

```text
Create three alternate visual directions for this same UI: more clinical, more futuristic, and more investor-demo premium. Keep the same information architecture and admin control requirements.
```
