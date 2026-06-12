# Generate Screens — Skin Lesion XAI

**Start here after your Design System is set up.**

This file has all 14 screen prompts in the correct order. Each prompt is complete and ready to paste — no jumping to other files.

---

## How to use this file

Do this exact loop for every screen below, in order:

1. In Claude Design, click **New project** → choose **High Fidelity** → select **Skin Lesion XAI** as the design system
2. Copy the **entire prompt block** for the screen you are on (everything between the triple dashes, including the ROLE line at the top)
3. Paste it into Claude Design and click **Generate**
4. Review the result — click any element to edit text directly, or leave comments for small fixes (these are free and don't use your session budget)
5. When satisfied, use **Export** (PDF, PPTX, etc.) or **Hand over to Claude Code** to save it
6. Come back here and move to the next screen

That is the entire process. Repeat steps 1–6 for each screen below.

---

## Context already baked into every prompt below

Every prompt in this file already includes:

- The **role, product, and design system** instructions so Claude Design knows the brand
- The **DO NOT** rules so it avoids diagnosis language, generic AI aesthetics, and placeholder text
- The **required states** so every loading, empty, error, and success state gets rendered
- The **responsive requirements** so desktop and mobile are both shown
- A **safety disclaimer** requirement on every patient-facing surface

The prompts reference the **Skin Lesion XAI design system** you set up — that system already contains your microcopy style (from the design-specs files you fed it) and your clinical tone. Claude Design will apply both automatically. You do not need to paste microcopy separately.

---

## Screen 1 of 14 — Authentication Flow

```
ROLE: You are a senior product designer for a regulated clinical health product.

PRODUCT: Skin Lesion XAI — an educational, privacy-aware AI explainability and lesion-history platform. NOT a diagnosis tool.

DESIGN SYSTEM: Use the "Skin Lesion XAI" design system. Honor its palette, the semantic status colors, the 4px spacing scale, and the type scale.

SCREEN BRIEF:
Design a complete authentication flow for Skin Lesion XAI — a privacy-first health platform.

STYLE: Clinical Premium, trustworthy, secure-feeling without being intimidating.

SCREENS TO INCLUDE:

LOGIN:
- Email/username field
- Password field with show/hide toggle
- "Remember this device" checkbox
- "Forgot password" link
- "Sign In" primary button
- Divider: "or"
- SSO options: Google, Hospital SSO
- "Create Account" link

REGISTRATION:
- Full name, email, password (with strength indicator), confirm password
- Terms of service checkbox (link to full policy)
- Privacy consent checkbox (separate from terms)
- "Create Account" primary button

CONSENT ONBOARDING (immediately after registration):
- Welcome screen explaining the platform
- Privacy-first message
- Storage mode selection prompt
- Safety disclaimer acknowledgment
- "Continue to Dashboard" CTA

PASSWORD RESET:
- Email field, "Send Reset Link" button
- Confirmation: "Check your email for a reset link"
- New password + confirm password fields
- "Reset Password" button
- Success: "Password updated. Please sign in with your new password."

SESSION TIMEOUT WARNING:
- Modal overlay: "Your session will expire in 2:00"
- "Continue Session" and "Sign Out" buttons

MULTI-FACTOR AUTHENTICATION:
- TOTP code entry (6 digits, auto-advance)
- "Verify" button, backup code option
- "Trust this device for 30 days" checkbox

STATES: loading on submit, invalid credentials error, account locked error, network error, MFA pending, account locked after failed attempts.

OUTPUT FORMAT: Responsive High-Fidelity HTML/CSS. Show desktop and mobile. Render every state as a separate labeled frame.

NON-NEGOTIABLES:
- Include the safety disclaimer on every patient-facing surface.
- Status color must never be the only signal — pair with icon and text.
- Meet WCAG AA contrast and 44px touch targets.

DO NOT: pre-fill email without consent, use security questions, send passwords via email, use CAPTCHA, use lorem ipsum placeholder text.
```

---

## Screen 2 of 14 — Landing Page

```
ROLE: You are a senior product designer for a regulated clinical health product.

PRODUCT: Skin Lesion XAI — an educational, privacy-aware AI explainability and lesion-history platform. NOT a diagnosis tool.

DESIGN SYSTEM: Use the "Skin Lesion XAI" design system. Honor its palette, the semantic status colors, the 4px spacing scale, and the type scale.

SCREEN BRIEF:
Design a high-end responsive marketing landing page for Skin Lesion XAI — a clinical AI explainability and lesion-history platform (educational, NOT a diagnosis tool).

STYLE: Clinical Premium. Calm, product-led, quietly high-end. Restrained palette with one teal accent, strong editorial typography, generous negative space, realistic product previews instead of stock illustration.

LAYOUT (top to bottom):

STICKY NAV BAR:
- Left: wordmark/logo
- Center/right: anchor links — How it works, Features, Privacy, For doctors
- Right: secondary "Sign in" text button + primary "Analyze an image" CTA button
- Shrinks on scroll. Mobile: hamburger menu opening a full-height sheet.

HERO (first viewport):
- Left column: product name, value proposition ("See why the AI looked there — explainable skin-lesion monitoring you can take to your doctor"), one supporting sentence, safety disclaimer in smaller muted text, CTA buttons: "Analyze an image" (primary) and "See how it works" (secondary)
- Right column: polished dashboard preview or abstract attention-field visual — NOT a body/organ image
- Desktop: full viewport height. Mobile: visual stacked under copy.

HOW IT WORKS (4 steps):
- Upload image → AI analyzes → Grad-CAM heatmap shows where it looked → optional doctor review
- Horizontal on desktop, vertical on mobile. No diagnosis verbs.

FEATURE HIGHLIGHTS:
- Lesion timeline and change tracking
- 2D body mapping
- Privacy modes and consent control
- Explainable heatmaps
- Doctor-review support
Each with a product preview thumbnail and a one-line benefit.

TRUST STRIP:
- Privacy-first, no diagnosis claims, doctor-reviewed support, accessible
- Every icon paired with a text label

CLOSING CTA BAND:
- Restate value prop + "Analyze an image" button + safety disclaimer

FOOTER:
- Product links, privacy and terms, and full safety disclaimer: "This platform is not a medical diagnosis tool. It provides educational AI-supported information and helps organize lesion history for professional review."

RESPONSIVE: 3-col feature grid desktop, 2-col tablet, 1-col mobile. Render both desktop and mobile frames.

OUTPUT FORMAT: Responsive High-Fidelity HTML/CSS. Show desktop and mobile. Render every layout variant as a separate labeled frame.

NON-NEGOTIABLES:
- Safety disclaimer visible on the page.
- WCAG AA contrast, visible focus states, semantic landmarks (header/nav/main/footer).
- 44px touch targets.

DO NOT: sci-fi organ visuals, purple/blue gradients, generic AI dashboard aesthetic, cancer detection claims, emoji icons, decorative anatomy, lorem ipsum placeholder text.
```

---

## Screen 3 of 14 — Patient Dashboard

```
ROLE: You are a senior product designer for a regulated clinical health product.

PRODUCT: Skin Lesion XAI — an educational, privacy-aware AI explainability and lesion-history platform. NOT a diagnosis tool.

DESIGN SYSTEM: Use the "Skin Lesion XAI" design system. Honor its palette, the semantic status colors, the 4px spacing scale, and the type scale.

SCREEN BRIEF:
Design a patient dashboard for Skin Lesion XAI — a skin lesion educational AI tool (NOT a diagnosis tool).

STYLE: Clinical Premium, calm, privacy-aware. A clean overview that respects the sensitivity of health data: quiet hierarchy, generous spacing, no alarmist color.

APP SHELL:
- Sidebar (desktop) / bottom tab bar or hamburger (mobile): Dashboard, Body map, Lesions, Lab results, Privacy, Education
- Top bar: greeting, notifications bell with unread badge, account menu

ACCOUNT STATUS BAR (full width, top of content):
- Subscription/plan state, consent state, and storage-mode badge (Full History / Privacy Balanced / Maximum Privacy)
- Quiet link to the Privacy Center. Status colors with icon and text — never color alone.

QUICK ACTIONS (above the fold):
- Primary "Analyze a new image", plus "View body map" and "Manage privacy". Large touch targets.

LESION SUMMARY CARDS (responsive grid, min ~280px):
- Each card: thumbnail (abstract/neutral), location label + body-map pin, date last analyzed, last result band (benign/monitor/review with icon and text), Grad-CAM indicator, "View history" link

RECENT ACTIVITY FEED (right rail desktop, stacked mobile):
- Chronological: analyses run, doctor reviews returned, lab uploads, consent changes. Each row timestamped.

NOTIFICATIONS PANEL:
- Pending doctor reviews, upcoming reminders, consent expiry warnings. Non-alarmist.

EDUCATION SECTION:
- Links to ABCDE guide, "how to take a good photo", "what Grad-CAM means", AI-limitations page

REQUIRED STATES (render each as a labeled frame):
- Loading: skeleton cards and skeleton activity rows
- Empty (no lesions): friendly onboarding + "Analyze your first image" CTA
- Error: data failed to load with retry option
- Active: fully populated dashboard

RESPONSIVE: sticky 64px header, 3-col card grid desktop, 2-col tablet, 1-col mobile, activity feed as side rail on desktop and stacked section on mobile.

OUTPUT FORMAT: Responsive High-Fidelity HTML/CSS. Render every state as a separate labeled frame showing both desktop and mobile.

NON-NEGOTIABLES:
- Safety disclaimer in the footer or account area.
- Status color never the only signal — pair with icon and text.
- WCAG AA contrast, semantic landmarks, 44px touch targets.

DO NOT: cancer detection framing, emergency alerts, diagnosis claims, cluttered glass cards, emoji icons, lorem ipsum placeholder text.
```

---

## Screen 4 of 14 — Patient Upload and Analysis Flow

```
ROLE: You are a senior product designer for a regulated clinical health product.

PRODUCT: Skin Lesion XAI — an educational, privacy-aware AI explainability and lesion-history platform. NOT a diagnosis tool.

DESIGN SYSTEM: Use the "Skin Lesion XAI" design system. Honor its palette, the semantic status colors, the 4px spacing scale, and the type scale.

SCREEN BRIEF:
Design a patient-facing upload and analysis flow for Skin Lesion XAI — a skin lesion educational AI tool.

STYLE: Clinical Premium, calm, privacy-aware. Step-by-step wizard with clear progress and safe language throughout.

FLOW STEPS:
1. Upload screen: drag-drop or camera capture, image preview, file type/size guidance
2. Quality check: loading spinner, blur/exposure detection feedback, retake guidance if quality is poor
3. Result screen: educational result band (benign/monitor/review), temperature-scaled confidence bar, Grad-CAM heatmap toggle, AI explanation card with safe language, consent prompt
4. Success/complete state: case saved, timeline entry added

REQUIRED STATES (render each as a labeled frame):
- Default: upload prompt
- Loading: analyzing image animation
- Quality fail: retake guidance with specific tip (blur, lighting, angle)
- Result — low concern: calm green band, educational confidence, heatmap toggle, "not a diagnosis" disclaimer
- Result — professional review recommended: amber band, "professional review recommended" message, heatmap toggle, guidance, "not a diagnosis" disclaimer
- Error: API failure with retry option
- Empty: no cases yet

OUTPUT FORMAT: Responsive High-Fidelity HTML/CSS. Render every state as a separate labeled frame.

NON-NEGOTIABLES:
- Safety disclaimer visible on every result state.
- Status color never the only signal — pair with icon and text.
- WCAG AA contrast and 44px touch targets.

DO NOT: cancer diagnosis language, treatment recommendations, emergency urgency framing, generic red alert aesthetics, lorem ipsum placeholder text.
```

---

## Screen 5 of 14 — Mobile Camera Capture

```
ROLE: You are a senior product designer for a regulated clinical health product.

PRODUCT: Skin Lesion XAI — an educational, privacy-aware AI explainability and lesion-history platform. NOT a diagnosis tool.

DESIGN SYSTEM: Use the "Skin Lesion XAI" design system. Honor its palette, the semantic status colors, the 4px spacing scale, and the type scale.

SCREEN BRIEF:
Design a mobile-optimized camera capture experience for Skin Lesion XAI.

STYLE: Clinical Premium, focused, medical-device inspired. Minimal distractions, maximum guidance.

LAYOUT:
- Full-screen camera viewfinder
- Semi-transparent overlay guide shapes (elliptical, dermoscopy-style)
- Top bar: close button, flash toggle
- Bottom bar: large capture button (64px), gallery import, body map reference toggle

GUIDANCE OVERLAY:
- "Center the lesion within the guide"
- Distance indicator: Move closer / Good distance / Too close
- Lighting indicator: Improve lighting / Good lighting
- Motion indicator: Hold steady

POST-CAPTURE REVIEW:
- Full-screen captured image
- Retake button (prominent) and Use Photo button
- Quality score: Good quality / Acceptable / Retake recommended
- Warning callout if quality issues detected

CAMERA PERMISSIONS:
- Permission request screen: "Camera access needed to analyze skin images"
- Settings redirect if permission denied

REQUIRED STATES (render each as a labeled frame):
- Permission request
- Camera initializing
- Live preview with guidance overlay
- Capturing
- Quality check processing
- Review captured image
- Quality warning (advisory, not blocking)
- Error: camera unavailable or permission denied

MOBILE-SPECIFIC: portrait orientation lock during capture, pinch-to-zoom, haptic feedback on capture.

OUTPUT FORMAT: Responsive High-Fidelity HTML/CSS — mobile layout only. Render every state as a labeled frame.

NON-NEGOTIABLES:
- Quality warnings are advisory, never blocking.
- 44px touch targets minimum.
- WCAG AA contrast on all overlay text.

DO NOT: auto-upload without confirmation, block capture on quality warnings, collect location data without consent, show advertising, lorem ipsum placeholder text.
```

---

## Screen 6 of 14 — Grad-CAM Heatmap Viewer

```
ROLE: You are a senior product designer for a regulated clinical health product.

PRODUCT: Skin Lesion XAI — an educational, privacy-aware AI explainability and lesion-history platform. NOT a diagnosis tool.

DESIGN SYSTEM: Use the "Skin Lesion XAI" design system. Honor its palette, the semantic status colors, the 4px spacing scale, and the type scale.

SCREEN BRIEF:
Design a Grad-CAM heatmap viewer for Skin Lesion XAI — a skin lesion AI explainability platform.

STYLE: Clinical Premium. The heatmap is the core product differentiator. Make it readable, trustworthy, and clinically honest.

CORE DISPLAY:
- Original image (left/top)
- Grad-CAM heatmap overlay (right/bottom)
- Toggle between: original only, heatmap only, overlay blend
- Opacity slider for overlay blend control

EXPLANATION PANEL:
- Result label and confidence (temperature-scaled, not raw softmax)
- Safe AI-generated explanation (educational only, no diagnosis language)
- Heatmap quality indicator: clean / noisy / unreliable
- Safety disclaimer always visible

CLINICAL INTERPRETATION CALLOUT:
- "If the heatmap activates on healthy skin rather than the lesion, the prediction may be unreliable"
- "Always consult a healthcare professional for clinical decisions"

REQUIRED STATES (render each as a labeled frame):
- Loading: generating heatmap
- Result clean: heatmap is reliable
- Result noisy: heatmap shows unusual patterns, amber warning
- Error generating heatmap
- Comparison mode: side-by-side of same lesion from two different dates

OUTPUT FORMAT: Responsive High-Fidelity HTML/CSS. Show desktop (split view) and mobile (stacked view). Render every state as a labeled frame.

NON-NEGOTIABLES:
- Safety disclaimer always visible.
- Status color never the only signal — pair with icon and text.
- WCAG AA contrast and 44px touch targets.

DO NOT: diagnosis framing, treatment recommendations, show high-confidence results without professional review framing, lorem ipsum placeholder text.
```

---

## Screen 7 of 14 — 2D Body Map and Lesion Placement

```
ROLE: You are a senior product designer for a regulated clinical health product.

PRODUCT: Skin Lesion XAI — an educational, privacy-aware AI explainability and lesion-history platform. NOT a diagnosis tool.

DESIGN SYSTEM: Use the "Skin Lesion XAI" design system. Honor its palette, the semantic status colors, the 4px spacing scale, and the type scale.

SCREEN BRIEF:
Design a 2D body map lesion location screen for Skin Lesion XAI — a skin lesion tracking platform.

STYLE: Clinical Premium. Anatomically neutral, gender-neutral human silhouette with front/back toggle. Functional, not decorative.

CORE INTERACTION:
- Tap/click on a body region → confirm location → save lesion pin
- Existing lesion pins shown as numbered markers on the map
- Click a pin to view that lesion's timeline

REQUIRED STATES (render each as a labeled frame):
- Default: neutral silhouette, no pins
- Pin placement mode: selected region highlighted, confirmation modal
- Lesion pins visible: numbered markers, hover/tap shows lesion preview
- Pin detail: click expands lesion summary, link to full timeline
- Edit mode: relocate pin with confirmation
- Front view and back view (toggle between both)

ANATOMICAL REGIONS: include text labels for torso, arms, legs, head/neck, hands, feet. Keep anatomy abstract and non-graphic.

RESPONSIVE: minimum 400px map container, touch-friendly pin markers (32px on touch devices), info panel as floating overlay on mobile and side panel on desktop.

OUTPUT FORMAT: Responsive High-Fidelity HTML/CSS. Show desktop and mobile. Render every state as a labeled frame.

NON-NEGOTIABLES:
- Gender-neutral silhouette.
- 44px minimum touch targets for pins.
- WCAG AA contrast on all labels and controls.

DO NOT: explicit genital regions, realistic nude anatomy, decorative body visuals, gender-specific silhouettes, lorem ipsum placeholder text.
```

---

## Screen 8 of 14 — Lab Result Upload and Review

```
ROLE: You are a senior product designer for a regulated clinical health product.

PRODUCT: Skin Lesion XAI — an educational, privacy-aware AI explainability and lesion-history platform. NOT a diagnosis tool.

DESIGN SYSTEM: Use the "Skin Lesion XAI" design system. Honor its palette, the semantic status colors, the 4px spacing scale, and the type scale.

SCREEN BRIEF:
Design a lab result upload and review flow for Skin Lesion XAI — a skin lesion tracking platform.

STYLE: Clinical Premium, medical-document-aware. Clean handling of PDF and image lab reports.

PATIENT SIDE:
- Upload: drag-drop PDF or image, file preview, test date picker, lab name input, optional patient note
- Consent confirmation: explicit consent before doctor review is enabled
- Status tracker: Uploaded → OCR extracting → Review pending → Reviewed (approved/rejected)

DOCTOR SIDE:
- Queue of lab results awaiting review
- OCR-extracted fields shown for doctor verification
- Editable fields for corrections
- Approve or reject with notes
- Link to original case (body map pin, lesion history)

REQUIRED STATES (render each as a labeled frame):
- Upload prompt (patient)
- Uploading in progress
- Processing OCR
- Pending doctor review
- Reviewed — approved
- Reviewed — rejected
- Error state

OUTPUT FORMAT: Responsive High-Fidelity HTML/CSS. Show both patient and doctor views. Render every state as a labeled frame.

NON-NEGOTIABLES:
- Lab results are clinical context, not AI diagnostic proof — make this visible in the UI copy.
- Safety disclaimer on patient-facing surfaces.
- WCAG AA contrast and 44px touch targets.

DO NOT: auto-diagnose from lab results, show lab values without doctor verification framing, include treatment recommendations, lorem ipsum placeholder text.
```

---

## Screen 9 of 14 — Notification Center

```
ROLE: You are a senior product designer for a regulated clinical health product.

PRODUCT: Skin Lesion XAI — an educational, privacy-aware AI explainability and lesion-history platform. NOT a diagnosis tool.

DESIGN SYSTEM: Use the "Skin Lesion XAI" design system. Honor its palette, the semantic status colors, the 4px spacing scale, and the type scale.

SCREEN BRIEF:
Design a notification center for Skin Lesion XAI — a privacy-aware health tracking platform.

STYLE: Clinical Premium, calm, organized. Respects user attention with non-intrusive design.

LAYOUT:
- Notification list: timestamped, categorized, dismissible
- Category tabs: All, Analysis, Doctor, System
- Filter by status: unread (bold), read (normal weight)
- Bulk actions: mark all read, clear read notifications

NOTIFICATION TYPES TO SHOW:
- Analysis complete: "Your image analysis is ready" + link to results
- Doctor review submitted: verdict summary
- Consent expiring: "Your consent expires in 14 days" + renewal CTA
- Lab result reviewed: status update
- Account security: "New device sign-in detected"
- System maintenance notice

REQUIRED STATES (render each as a labeled frame):
- Empty: "All Caught Up" with supporting message
- Loading: skeleton list
- Populated: mix of read and unread notifications
- Swipe to dismiss (mobile)

OUTPUT FORMAT: Responsive High-Fidelity HTML/CSS. Show desktop and mobile. Render every state as a labeled frame.

NON-NEGOTIABLES:
- No PHI visible in notification previews.
- Status color never the only signal — pair with icon and text.
- WCAG AA contrast and 44px touch targets.

DO NOT: use urgent red for non-critical alerts, show PHI in notification text, include promotional content, lorem ipsum placeholder text.
```

---

## Screen 10 of 14 — Consent Management Center

```
ROLE: You are a senior product designer for a regulated clinical health product.

PRODUCT: Skin Lesion XAI — an educational, privacy-aware AI explainability and lesion-history platform. NOT a diagnosis tool.

DESIGN SYSTEM: Use the "Skin Lesion XAI" design system. Honor its palette, the semantic status colors, the 4px spacing scale, and the type scale.

SCREEN BRIEF:
Design a full-screen consent management center for Skin Lesion XAI — a privacy-first health data platform.

STYLE: Clinical Premium, privacy-forward. Transparent, clear, and empowering. This is about giving patients control over their own data.

SECTIONS:
- Current consent status: large visual indicator (active, pending, withdrawn)
- Storage mode selector: Full History / Privacy Balanced / Maximum Privacy — with a plain-language explanation of each (what is stored, how long, who can see it)
- Retention period: 30 days / 90 days / 1 year / indefinite — with data deletion implications shown clearly
- Training use consent: separate toggle with explanation of how anonymized data is used in model training
- Withdrawal flow: "Withdraw consent" with confirmation modal and explanation of consequences
- Deletion request: separate from consent withdrawal, with timeline and confirmation modal
- Audit log: timestamped read-only record of all consent changes
- Privacy policy link

REQUIRED STATES (render each as a labeled frame):
- All consented, active
- Consent partially withdrawn
- Withdrawal confirmation modal
- Deletion request confirmation modal (must type "DELETE MY DATA" to confirm)
- Storage mode changing

OUTPUT FORMAT: Responsive High-Fidelity HTML/CSS. Show desktop and mobile. Render every state as a labeled frame.

NON-NEGOTIABLES:
- No dark patterns. No pre-checked boxes.
- Every option explained in plain English — no legal jargon without a plain-language summary alongside it.
- WCAG AA contrast and 44px touch targets.

DO NOT: use dark patterns, pre-check any boxes, use confusing legal language without plain-English summary alongside it, lorem ipsum placeholder text.
```

---

## Screen 11 of 14 — Doctor Dashboard

```
ROLE: You are a senior product designer for a regulated clinical health product.

PRODUCT: Skin Lesion XAI — an educational, privacy-aware AI explainability and lesion-history platform. NOT a diagnosis tool.

DESIGN SYSTEM: Use the "Skin Lesion XAI" design system. Honor its palette, the semantic status colors, the 4px spacing scale, and the type scale.

SCREEN BRIEF:
Design a doctor dashboard for Skin Lesion XAI — a skin lesion review platform for clinical professionals.

STYLE: Clinical Premium, clinical efficiency. Dense but not cluttered. Professional workflow focus.

LAYOUT:
- Case queue: patient pseudonym (no real name), submission date, body map region, AI result band (benign/monitor/review), priority badge
- Case detail panel: lesion image, Grad-CAM heatmap, AI explanation, patient-submitted notes, body map pin location, lab results if available
- Opinion form: verdict options (confirmed benign, concerning, requires further review — educational framing only), free-text notes field, submit button
- Review history: past verdicts for this patient, trend over time

REQUIRED STATES (render each as a labeled frame):
- Queue empty: "No cases pending review" with supporting message
- Case selected: detail panel fully populated
- Submitting verdict: loading state on submit button
- Verdict submitted: success confirmation, case removed from queue
- Heatmap noisy warning: amber callout when AI heatmap reliability is low

DATA SHOWN: only what is needed for a professional opinion. Patient name replaced with pseudonym. No raw PHI.

OUTPUT FORMAT: Responsive High-Fidelity HTML/CSS. Show desktop (side-by-side queue + detail) and mobile (stacked). Render every state as a labeled frame.

NON-NEGOTIABLES:
- No patient identity information visible anywhere.
- Status color never the only signal — pair with icon and text.
- WCAG AA contrast and 44px touch targets.

DO NOT: show patient identity information, use diagnosis confirmation language, include treatment recommendations, lorem ipsum placeholder text.
```

---

## Screen 12 of 14 — Research and Model Performance Dashboard

```
ROLE: You are a senior product designer for a regulated clinical health product.

PRODUCT: Skin Lesion XAI — an educational, privacy-aware AI explainability and lesion-history platform. NOT a diagnosis tool.

DESIGN SYSTEM: Use the "Skin Lesion XAI" design system. Honor its palette, the semantic status colors, the 4px spacing scale, and the type scale.

SCREEN BRIEF:
Design a research and model performance dashboard for Skin Lesion XAI — an internal platform for ML researchers and platform administrators.

STYLE: Clinical Premium, data-dense but readable. Real metrics, real chart types, no decorative data visualizations.

SECTIONS:
- Model performance: AUC-ROC, sensitivity, specificity, calibration curve (ECE), confusion matrix
- Fairness metrics: performance broken down by Fitzpatrick skin type (I–VI), age bucket, and body location
- Calibration monitoring: temperature setting, confidence distribution vs actual accuracy
- Active learning queue: pending doctor-verified cases, queue depth, oldest item age
- CAM quality tracking: percentage of heatmaps passing quality check over time
- Drift detection: input distribution shift alert, output distribution shift alert

CONTROLS: date range filter, model version selector, export button.

REQUIRED STATES (render each as a labeled frame):
- Loading skeleton
- Data populated
- No data yet (new model)
- Drift alert active
- Calibration drift warning

OUTPUT FORMAT: Responsive High-Fidelity HTML/CSS. Desktop layout (data-dense). Render every state as a labeled frame.

NON-NEGOTIABLES:
- No individual patient data visible anywhere — aggregate and de-identified only.
- Status colors paired with text labels.
- WCAG AA contrast.

DO NOT: expose raw patient data, show individual patient predictions, reveal model architecture details, lorem ipsum placeholder text.
```

---

## Screen 13 of 14 — Administrator Dashboard

```
ROLE: You are a senior product designer for a regulated clinical health product.

PRODUCT: Skin Lesion XAI — an educational, privacy-aware AI explainability and lesion-history platform. NOT a diagnosis tool.

DESIGN SYSTEM: Use the "Skin Lesion XAI" design system. Honor its palette, the semantic status colors, the 4px spacing scale, and the type scale.

SCREEN BRIEF:
Design a full-control administrator dashboard for Skin Lesion XAI — an internal platform admin surface.

STYLE: Clinical Premium, comprehensive but navigable. Full platform visibility without being overwhelming.

SECTIONS:
- User management: table with role, status, consent state, last active — with search and filters
- Approval queue: training eligibility approvals, flagged cases
- Subscription overview: active patients, pending reviews, active doctors
- Audit log: timestamped platform actions, filterable by user, role, action type
- Feature flags: AppConfig flag states per environment (dev/staging/prod) — admin-only
- System health: API health, model service status, storage status, circuit breaker states

REQUIRED STATES (render each as a labeled frame):
- Loading skeleton
- Empty tables with helpful messages
- Error with retry
- User suspended state
- Consent withdrawn state

OUTPUT FORMAT: Responsive High-Fidelity HTML/CSS. Desktop layout (dense tables, side drawers). Render every state as a labeled frame.

NON-NEGOTIABLES:
- No raw PHI visible anywhere.
- Destructive actions (suspend, delete) require confirmation modals with explicit consequences shown.
- Status color never the only signal — pair with icon and text.
- WCAG AA contrast.

DO NOT: expose raw PHI, expose patient diagnoses, show circuit breaker internal names to non-operators, expose infrastructure secrets, lorem ipsum placeholder text.
```

---

## Screen 14 of 14 — Cloud Operations and Cost Control Dashboard

```
ROLE: You are a senior product designer for a regulated clinical health product.

PRODUCT: Skin Lesion XAI — an educational, privacy-aware AI explainability and lesion-history platform. NOT a diagnosis tool.

DESIGN SYSTEM: Use the "Skin Lesion XAI" design system. Honor its palette, the semantic status colors, the 4px spacing scale, and the type scale.

SCREEN BRIEF:
Design a cloud operations and cost control dashboard for Skin Lesion XAI — an internal admin/operator surface only. This is NOT patient-facing.

STYLE: Clinical Premium, operator-focused. Clear environment separation, cost visibility, safe actions with appropriate confirmation gates.

SECTIONS:
- Environment cards (Dev, Staging, Production): each showing status (running/paused/shutdown), estimated cost, last activity, resource summary
- Cost breakdown: compute, storage, data transfer, with a trend chart
- Action panel per environment: Start, Pause, Resume, Shutdown — Shutdown requires a confirmation modal
- Terraform plan preview: diff summary before applying any infrastructure change
- Alert banner for cost anomalies or resources left running unexpectedly

REQUIRED STATES (render each as a labeled frame):
- Dev running: normal display, green status
- Staging paused: amber badge, resume CTA prominent
- Production shutdown attempt: confirmation modal with explicit "this affects live patients" warning
- Cost anomaly: amber alert banner with details
- Terraform plan preview open

OUTPUT FORMAT: Responsive High-Fidelity HTML/CSS. Desktop layout. Render every state as a labeled frame.

NON-NEGOTIABLES:
- Production destructive actions (Shutdown) require a confirmation modal with explicit consequences.
- Status color never the only signal — pair with icon and text.
- WCAG AA contrast.

DO NOT: expose this to patient-facing surfaces, show raw database connection strings, expose infrastructure secrets, show PHI, lorem ipsum placeholder text.
```

---

## All 14 screens done? What comes next

Once you have exported all 14 screens:

1. **Extended screens** — if you need operator surfaces, 3D body map, agent chat UIs, or Power BI analytics shell, open `ADDITIONAL_SCREEN_PROMPTS.md` and use the same loop above for each prompt in that file.

2. **Brand imagery** — open `CHATGPT_IMAGE_PROMPTS.md` and generate the hero images, icons, and illustrations that your screens reference.

3. **Motion** — open `IMAGE_TO_ANIMATION_GUIDE.md` to turn the stills into hero video loops and Lottie animations.

4. **Build the code** — open `BUILD_FRONTEND.md` for the Next.js walkthrough, and `DESIGN_TO_CODE_MAP.md` to find which screen maps to which route and component file.
