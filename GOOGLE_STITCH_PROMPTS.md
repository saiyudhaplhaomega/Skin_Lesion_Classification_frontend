# Google Stitch Prompt Pack - Skin Lesion XAI

Use these prompts in Google Stitch to generate the design direction first. Do not treat this as implementation code. The goal is to create strong visual dashboard concepts and a design specification before building the frontend.

## Master Design Prompt

```text
Create a premium medical AI product design for a web app called Skin Lesion XAI.

Product purpose:
Skin Lesion XAI helps patients upload or capture skin lesion images, receive AI-assisted skin lesion analysis, view Grad-CAM explainability heatmaps, track lesion history, request doctor review, and manage privacy consent. Doctors review cases and submit expert opinions. Administrators control the full platform.

Visual direction:
Elegant futuristic glassmorphism. Dark graphite clinical background. Transparent glass panels. Electric cyan, clinical teal, signal blue, subtle warm red pulse accents. Premium medical AI aesthetic. The design should look like a world-class portfolio project but still feel medically trustworthy.

Cinematic theme:
The landing page begins with an abstract transparent glass brain with electric pulses continuously flowing through neural pathways. On scroll, the experience moves down a translucent rotating spine. Later sections reveal abstract glass lungs and a beating glass heart with colored diagnostic energy flowing through them. Keep anatomy elegant, abstract, transparent, non-gory, and non-horror.

Design requirements:
- Create a landing page concept.
- Create a patient dashboard.
- Create a doctor dashboard.
- Create a full-control administrator dashboard.
- Use responsive desktop and mobile layouts.
- Include loading, empty, error, pending approval, suspended, expired, and success states where relevant.
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
Dashboard, New Analysis, My Lesions, Timeline, Reports, Subscription, Profile, Consent.

Main content:
- Account status bar showing one of: Pending Approval, Active Lifetime, Active Subscription, Trial, Expired, Suspended.
- Upload or Capture Skin Image panel.
- Image quality checklist: lighting, focus, distance, glare, surrounding skin visible.
- Retake Photo and Proceed Anyway options for poor image quality.
- AI result panel with benign/malignant risk label, confidence, reliability, and uncertainty warning.
- Heatmap viewer with tabs: Original, Grad-CAM Heatmap, Overlay, Compare.
- AI explanation panel with simple explanation, technical explanation, doctor-style summary, suggested questions, and free-text follow-up.
- Lesion timeline with previous captures, analysis history, doctor reviews, and reports.
- Subscription/access card showing plan, renewal date, expiry date, lifetime access, or admin override.
- Clear disclaimer: AI support, not a medical diagnosis.

States to include:
New user pending admin approval, expired subscription, suspended account, empty lesion history, failed upload, failed heatmap, analysis loading, analysis complete.
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
Overview, Users, Patients, Doctors, Administrators, Approvals, Subscriptions, Access Control, Forms, Cases, Doctor Reviews, Training Pool, Model Settings, Reports, Audit Logs, System Settings.

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

States to include:
Pending approval, active lifetime, active subscription, trial, expired, suspended, deactivated, failed save, success toast, permission denied, deletion confirmation modal.
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
