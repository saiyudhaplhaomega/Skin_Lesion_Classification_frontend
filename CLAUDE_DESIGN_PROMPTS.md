# Claude Design Prompts — Skin Lesion XAI

Use these prompts with **Claude Design** (claude.design or claude.ai/code) to generate HTML prototype designs for the Skin Lesion XAI frontend. Each prompt is self-contained with audience, design constraints, required states, and explicit exclusions.

For **Google Stitch** (visual layout exploration), use [`GOOGLE_STITCH_PROMPTS.md`](GOOGLE_STITCH_PROMPTS.md) instead. For **production implementation**, use the design-to-code mapping in [`STITCH_HANDOFF_GUIDE.md`](STITCH_HANDOFF_GUIDE.md).

---

## Shared Clinical Premium Design Brief

Apply this brief to every prompt in this file:

**Audience:** Patients, doctors, administrators, research reviewers. Every screen must feel calm, trustworthy, private, and usable under stress.

**Design tone:** Clinical Premium. Workflow-first composition, quiet confidence, clear hierarchy, realistic healthcare-product details.

**Visual system:**
- Off-black, charcoal, white, or light clinical surfaces
- One restrained product accent + semantic status colors only
- NO decorative purple/blue gradient glow, generic AI visual tropes, emoji icons, cluttered glass cards, excessive rounded cards, or decorative anatomy
- Accessible contrast, clear typography, strong spacing, stable responsive layouts

**Status color language:**
- low concern = calm green
- monitor / needs follow-up = amber
- professional review recommended = blue or amber
- urgent review recommended = limited red for status/warnings only
- pending = neutral
- consent withdrawn / deletion requested = neutral warning, not alarmist

**Medical safety language:** AI-assisted monitoring, educational support, model explanation, image quality guidance, lesion history, privacy-aware health tool, doctor-review support.

**Do NOT imply:** diagnosis, melanoma detection, cancer testing, guaranteed detection, treatment advice, dermatologist replacement, clinician replacement, emergency support.

**Every patient-facing concept must include:** "This platform is not a medical diagnosis tool. It provides educational AI-supported information and helps organize lesion history for professional review."

**Required states:** loading, empty, error, pending approval, active, suspended, expired, consent withdrawn, deletion requested, retake image, not enough information, doctor review pending, report generated, lab result uploaded, lab result reviewed, lab result rejected, notification unread, success.

---

## 1. Landing Page

```text
Design a high-end responsive landing page for Skin Lesion XAI -- a clinical AI explainability and lesion-history platform.

Style: Clinical Premium. Calm product-led hero with real workflow signals: upload, Grad-CAM explanation, lesion timeline, body mapping, privacy modes, and doctor-review support. Restrained palette, strong typography, realistic product previews.

First viewport: product name, concise value proposition, safety disclaimer, CTA buttons: Analyze Image, View Explainability, Doctor Review, Privacy Modes. Main visual is abstract body-map/product composition or polished dashboard preview -- NOT decorative organ spectacle.

Sections to include:
- Hero with safety disclaimer and workflow CTAs
- How it works (upload -> AI explanation -> Grad-CAM heatmap -> doctor review)
- Feature highlights: lesion timeline, body mapping, privacy modes, consent control
- Trust signals: privacy, no diagnosis claims, doctor-reviewed
- Footer with safety disclaimer

States: desktop and mobile, no loading states needed for landing.

DO NOT: sci-fi organ visuals, purple/blue gradients, generic AI dashboard, cancer detection claims, emoji icons, decorative anatomy.
```

---

## 2. Patient Upload + Analysis Flow

```text
Design a patient-facing upload and analysis flow for Skin Lesion XAI -- a skin lesion educational AI tool.

Style: Clinical Premium, calm, privacy-aware. Step-by-step wizard with clear progress, safe language throughout.

Flow steps:
1. Upload screen: drag-drop or camera capture, image preview, file type/size guidance
2. Quality check: loading spinner, blur/exposure detection feedback, retake guidance if quality poor
3. Result screen: label (benign/malignant educational band), temperature-scaled confidence bar, Grad-CAM heatmap overlay toggle, AI explanation card (safe, no diagnosis language), consent prompt
4. Success/complete state: case saved, timeline entry added

Critical states to show:
- Default: upload prompt
- Loading: analyzing image animation
- Quality fail: retake guidance with specific tip (blur, lighting, angle)
- Result benign: calm green band, educational confidence, heatmap toggle, "not a diagnosis" disclaimer
- Result malignant: amber band, "professional review recommended" message, heatmap toggle, escalation guidance, "not a diagnosis" disclaimer
- Error: API failure with retry option
- Empty: no cases yet

DO NOT: cancer diagnosis language, treatment recommendations, emergency urgency framing, generic red alert aesthetics.
```

---

## 3. Patient Dashboard

```text
Design a patient dashboard for Skin Lesion XAI -- a skin lesion educational AI tool.

Style: Clinical Premium, calm, privacy-aware. Clean overview that respects the sensitivity of health data.

Layout sections:
- Account status bar (subscription, consent state, data storage mode)
- Lesion summary cards: each lesion with thumbnail, date, last prediction, Grad-CAM status, body map pin
- Quick actions: Analyze New Image, View Body Map, Manage Privacy
- Recent activity feed: timeline of analyses, doctor reviews, lab uploads
- Notifications panel: pending reviews, upcoming reminders, consent expiry
- Education section: ABCDE guide link, safe information resources

States: loading skeleton, empty (no lesions yet with onboarding prompt), error, active dashboard.

Include privacy center access link. Show storage mode badge. No diagnosis language anywhere.

DO NOT: cancer detection framing, emergency alerts, diagnosis claims, cluttered glass cards.
```

---

## 4. 2D Body Map + Lesion Placement

```text
Design a 2D body map lesion location screen for Skin Lesion XAI -- a skin lesion tracking platform.

Style: Clinical Premium. Anatomically neutral, gender-neutral human silhouette (front/back toggle). Functional, not decorative.

Core interaction: tap/click on body region -> confirm location -> save lesion pin. Show existing lesion pins as numbered markers on the map. Click a pin to view that lesion's timeline.

Required states:
- Default: neutral silhouette, no pins
- Pin placement mode: selected region highlighted, confirmation modal
- Lesion pins visible: numbered markers, hover shows lesion preview
- Pin detail: click to expand lesion summary, link to full timeline
- Edit mode: relocate pin with confirmation
- Body part toggle: front / back views
- Mobile responsive: touch-friendly tap targets (min 44px)

Include anatomical region labels (torso, arms, legs, head/neck, etc.) in accessible text. Keep anatomy abstract and non-graphic.

DO NOT: explicit genital regions, realistic nude anatomy, decorative body visuals, gender-specific silhouettes.
```

---

## 5. Grad-CAM Heatmap Viewer

```text
Design a Grad-CAM heatmap viewer for Skin Lesion XAI -- a skin lesion AI explainability platform.

Style: Clinical Premium. The heatmap is the core product differentiator. Make it readable, trustworthy, and clinically honest.

Core display:
- Original image (left/top)
- Grad-CAM heatmap overlay (right/bottom)
- Toggle between: original only, heatmap only, overlay blend
- Opacity slider for overlay blend control

Explanation panel:
- Label and confidence (temperature-scaled, not raw softmax)
- Safe LLM-generated explanation (educational only, no diagnosis)
- Heatmap quality indicator: clean / noisy / unreliable
- Safety disclaimer visible

Clinical interpretation callout:
- "If the heatmap activates on healthy skin rather than the lesion, the prediction may be unreliable"
- "Always consult a healthcare professional for clinical decisions"

States: loading (generating heatmap), result clean, result noisy, error generating heatmap, comparison mode (side-by-side timeline of same lesion over time).

DO NOT: diagnosis framing, treatment recommendations, high-confidence malignant predictions without professional review framing.
```

---

## 6. Doctor Dashboard

```text
Design a doctor dashboard for Skin Lesion XAI -- a skin lesion review platform for clinical professionals.

Style: Clinical Premium, clinical efficiency. Dense but not cluttered. Professional, not clinical software ugly.

Layout:
- Case queue: patient pseudonym, submission date, body map region, AI prediction band (benign/monitor/review), priority badge
- Case detail panel: lesion image, Grad-CAM heatmap, AI explanation, patient-submitted notes, body map pin location, lab results if any
- Action form: verdict options (confirmed benign, concerning, malignant -- educational framing), free-text notes, submit button
- Review history: past verdicts for this patient, trend over time

Required states:
- Queue empty: "No cases pending review"
- Case selected: detail panel populated
- Submitting verdict: loading state on submit button
- Verdict submitted: success confirmation, case removed from queue
- Heatmap noisy warning: amber callout if AI heatmap is unreliable

Data shown: only what is needed for a professional opinion. No raw PHI (patient name replaced with pseudonym).

DO NOT: show patient identity information, diagnosis confirmation language, treatment recommendations.
```

---

## 7. Consent Management Center

```text
Design a full-screen consent management center for Skin Lesion XAI -- a privacy-first health data platform.

Style: Clinical Premium, privacy-forward. Transparent, clear, empowering. This is about patient control.

Sections:
- Current consent status: big visual indicator (active, pending, withdrawn)
- Storage mode: Full History / Privacy Balanced / Maximum Privacy with clear explanation of each
- Retention period: 30 days / 90 days / 1 year / indefinite with data deletion implications
- Training use consent: separate toggle with explanation of how approved data is used
- Withdrawal flow: clear "withdraw consent" with confirmation and explanation of what happens
- Deletion request: separate from consent withdrawal, with timeline and confirmation
- Audit log: timestamped record of consent changes (read-only)
- Privacy policy and data handling link

States: loading, saved, error saving, withdrawal confirmation modal, deletion request confirmation modal.

Must be accessible, jargon-free, and empower the patient to make informed decisions.

DO NOT: dark patterns, pre-checked boxes, confusing legal language without plain-English summary.
```

---

## 8. Research / Model Performance Dashboard

```text
Design a research and model performance dashboard for Skin Lesion XAI -- an internal platform for ML researchers and platform administrators.

Style: Clinical Premium, data-dense but readable. Real metrics, real graphs, no fake numbers.

Sections:
- Model performance: AUC-ROC, sensitivity, specificity, calibration curve (ECE), confusion matrix
- Fairness metrics: performance per Fitzpatrick skin type (I-VI), per age bucket, per body location
- Calibration monitoring: temperature, confidence distribution vs actual accuracy
- Active learning queue: pending doctor-verified cases, queue depth, oldest item age
- CAM quality tracking: % of heatmaps passing quality check over time
- Drift detection: input distribution shift alert, output distribution shift alert

States: loading skeleton, data populated, no data yet for new model, drift alert active, calibration drift warning.

Include date range filters, model version selector, and export functionality. Keep research/reviewer and admin views separate from patient-facing UI.

DO NOT: expose raw patient data, show individual patient predictions, reveal model architecture details to unauthorized roles.
```

---

## 9. Cloud Operations / Cost Control Dashboard

```text
Design a cloud operations and cost control dashboard for Skin Lesion XAI -- an internal admin/operator surface.

Style: Clinical Premium, operator-focused. Clear environment separation, cost visibility, safe-to-operate actions.

Sections:
- Environment cards (dev, staging, production): each showing status (running/paused/shutdown), cost estimate, last activity, resource summary
- Cost breakdown: compute, storage, data transfer, with trend chart
- Action panel per environment: Start, Pause, Resume, Shutdown (with confirmation for Shutdown prod)
- Terraform plan preview for pending changes
- Alert banner for cost anomalies or resources left running

Critical states:
- Dev running: normal display, green status
- Staging paused: amber, "paused" badge, resume CTA prominent
- Production shutdown attempt: confirmation modal with explicit "this affects patients" warning
- Cost anomaly: amber alert banner with details
- Terraform plan preview: diff summary before apply

Operator concepts only -- no patient-facing UI, no PHI, no clinical features.

DO NOT: expose to patient-facing surfaces, show raw database URLs, expose AWS secrets.
```

---

## 10. Administrator Dashboard

```text
Design a full-control administrator dashboard for Skin Lesion XAI -- an internal platform admin surface.

Style: Clinical Premium, comprehensive but navigable. Full platform visibility without being overwhelming.

Sections:
- User management: table with role, status, consent state, last active
- Approval queue: training eligibility approvals, flagged cases
- Subscription/status overview: active patients, pending reviews, active doctors
- Audit log: timestamped platform actions, filterable by user, role, action type
- Feature flags: AppConfig flag states per environment (dev/staging/prod) -- admin-only view
- System health: API health, model service status, storage status, circuit breaker states

Required states: loading skeleton, empty tables with helpful messages, error with retry, user suspended state, consent withdrawn state.

DO NOT: expose raw PHI, expose patient diagnoses, show circuit breaker technical names to non-operators, expose AWS secrets or internal architecture.
```

---

## 11. Lab Result Upload + Review

```text
Design a lab result upload and review flow for Skin Lesion XAI -- a skin lesion tracking platform.

Style: Clinical Premium, medical-document-aware. Clean handling of PDF/image lab reports.

Patient side:
- Upload: drag-drop PDF or image, file preview, test date picker, lab name input, optional patient note
- Consent confirmation: explicit consent before doctor review
- Status tracker: Uploaded -> OCR extracting -> Review pending -> Reviewed (approved/rejected)

Doctor side:
- Queue of lab results awaiting review
- OCR-extracted fields shown for verification
- Editable fields with corrections
- Approve/reject with notes
- Link to original case (body map pin, lesion history)

States: upload prompt, uploading, processing OCR, pending review, reviewed approved, reviewed rejected, error.

DO NOT: auto-diagnosis from lab results, lab values without doctor verification framing, treatment recommendations.
```

---

## How to Use These Prompts

1. Open [claude.design](https://claude.design) or claude.ai/code
2. Paste the relevant prompt from this file
3. Add context from `docs/03_DOMAIN_PRIMER.md` and `docs/04_GRADCAM_CLINICAL_INTERPRETATION.md` for clinical accuracy
4. Generate the design
5. Save screenshots/HTML reference under `design/claude-design/`
6. Cross-reference with Google Stitch prompts (`GOOGLE_STITCH_PROMPTS.md`) for additional screen variants
7. Implement using the design-to-code mapping in `STITCH_HANDOFF_GUIDE.md`

---

## 12. Screen-to-Screen Flow Diagram (Mermaid Journey Map)

```text
Design a complete screen-to-screen user journey diagram using Mermaid for Skin Lesion XAI.

STYLE: Clinical Premium, clean flowchart, muted colors matching the design system.

USER ROLES to diagram:
- Patient (primary)
- Doctor (reviewer)
- Researcher (read-only)
- Administrator (full access)

JOURNEY FLOWS to include:

PATIENT FLOW:
Landing -> Register/Login -> Patient Dashboard
Patient Dashboard -> Upload Image -> Quality Check -> Analysis Loading -> Results View (Benign/Monitor/Review)
Results View -> Grad-CAM Toggle -> Explanation Panel -> Save to Timeline
Results View -> Request Doctor Review -> Confirmation Modal
Patient Dashboard -> View Body Map -> Lesion Pin Detail -> Timeline View
Patient Dashboard -> Consent Center -> Storage Mode -> Retention Period -> Audit Log
Patient Dashboard -> Lab Upload -> File Selection -> OCR Processing -> Review Status
Notifications -> Pending Reviews -> Navigate to Relevant Screen

DOCTOR FLOW:
Doctor Login -> Doctor Dashboard (Queue)
Queue Item Select -> Case Detail -> Image + Heatmap -> Explanation -> Patient Notes
Case Detail -> Submit Verdict -> Confirmation -> Queue Updates
Doctor Dashboard -> Lab Results Queue -> OCR Review -> Approve/Reject
Doctor Dashboard -> Patient History (pseudonymized)

ADMINISTRATOR FLOW:
Admin Login -> Admin Dashboard
User Management -> Filter/Suspend/Activate
Audit Log -> Filter by Action/User/Date
Feature Flags -> Environment Toggle (Dev/Staging/Prod)
System Health -> Service Status Cards
Cloud Ops -> Environment Cards -> Start/Pause/Resume/Shutdown

RESEARCHER FLOW:
Researcher Login -> Model Performance Dashboard
Fairness Metrics -> Skin Type/Age/Body Region filters
Calibration Monitoring -> Temperature/Confidence charts
Active Learning Queue -> Case Details -> Submit Verification

MERMAID SYNTAX EXAMPLE:
graph LR
    A[Landing] --> B{Auth}
    B -->|Patient| C[Patient Dashboard]
    B -->|Doctor| D[Doctor Dashboard]
    C --> E[Upload Flow]
    E --> F{Quality Check}
    F -->|Pass| G[Analysis]
    F -->|Fail| H[Retake Guidance]

Include all decision nodes, state transitions, and error/exception paths.
Use role-specific color coding consistent with the design system.

DO NOT: include PHI, real patient names, technical implementation details, or sensitive system paths.
```

---

## 13. Accessibility Interaction Specification

```text
Design an accessibility interaction specification document for Skin Lesion XAI.

STYLE: Technical documentation, Clinical Premium tone, comprehensive coverage.

SECTIONS TO COVER:

KEYBOARD NAVIGATION:
- Tab order for all interactive elements (upload, buttons, toggles, sliders)
- Arrow key navigation within: body map (regions), heatmap opacity slider, case queue table
- Enter/Space activation for buttons, toggles, pins
- Escape key: close modals, cancel operations, exit placement mode
- Focus trap within modals and overlay dialogs
- Skip links: "Skip to main content", "Skip to dashboard", "Skip to analysis"

ARIA ATTRIBUTES:
- Landmarks: header, nav, main, complementary (notifications), contentinfo
- Live regions: aria-live="polite" for status updates, analysis progress, queue changes
- aria-label for icon-only buttons (upload, heatmap toggle, close)
- aria-describedby linking form inputs to helper text
- aria-expanded for collapsible sections (consent toggles, filter panels)
- aria-selected for body map regions, queue multi-select
- aria-modal for all modal dialogs
- role="status" for toast notifications and loading messages

FOCUS MANAGEMENT:
- Focus moves to first interactive element on screen load
- Focus moves to modal heading on modal open
- Focus returns to trigger element on modal close
- Focus moves to next logical element after wizard step completion
- Visible focus indicator: 2px solid offset outline, high contrast
- No focus loss to background elements during loading states

MOTION AND ANIMATION:
- Respect prefers-reduced-motion: disable all non-essential animation
- Heatmap fade-in: 300ms ease-out (can be disabled)
- Progress spinner: continuous rotation (can be disabled)
- Toast slide-in: 200ms ease-out (can be disabled)
- Card/panel transitions: 150ms ease (can be disabled)
- Loading skeletons: subtle pulse animation (can be disabled)
- No auto-playing animations without user consent

COLOR AND CONTRAST:
- All text: minimum 4.5:1 contrast ratio (WCAG AA)
- Large text and UI components: minimum 3:1 contrast ratio
- Status colors must not be sole information carrier (use icons/text)
- Focus indicators: minimum 3:1 contrast against adjacent colors
- Error states: red + icon + text, not color alone

SCREEN READER CONSIDERATIONS:
- Image alt text: descriptive for content images, empty for decorative
- Heatmap: "Grad-CAM heatmap showing areas of interest overlaid on lesion image"
- Body map: "Interactive body map. Use arrow keys to navigate regions."
- Table headers: proper th with scope attributes
- Dynamic content updates announced via aria-live

TOUCH AND MOBILE:
- Touch targets: minimum 44x44px
- No hover-only interactions (hover implies focus/active)
- Swipe gestures: optional enhancement, not primary navigation
- Pinch-to-zoom allowed on image viewers (disabled by default is anti-pattern)

COGNITIVE ACCESSIBILITY:
- Clear, consistent navigation across all screens
- Progress indicators for multi-step flows
- Confirmation dialogs for destructive actions
- Timeout warnings with extension option
- Error messages: specific, actionable, non-technical

DO NOT: rely on color alone, use flashing content, auto-advance without user control, or trap keyboard users.
```

---

## 14. Responsive Grid Baseline

```text
Design a responsive grid specification document for Skin Lesion XAI.

STYLE: Technical specification, Clinical Premium, implementation-ready.

GRID SYSTEM:
- Base unit: 4px
- 12-column grid
- Column gutter: 24px (desktop), 16px (tablet), 12px (mobile)
- Outer margin: 32px (desktop), 24px (tablet), 16px (mobile)
- Max content width: 1280px
- Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop), 1440px (large desktop)

BREAKPOINT SPECIFICS:

MOBILE (320px - 767px):
- Columns: 4 (collapsed)
- Single column layouts, full-width cards
- Stacked navigation (hamburger menu)
- Upload flow: full-screen steps
- Body map: simplified front/back toggle
- Dashboard: vertical card stack
- Heatmap viewer: swipe between original/overlay
- Typography: 14px base, 20px h1, 16px h2
- Touch targets: 44px minimum

TABLET (768px - 1023px):
- Columns: 8
- 2-column layouts where appropriate
- Collapsible sidebar navigation
- Dashboard: 2-column card grid
- Heatmap viewer: side-by-side comparison option
- Case queue: scrollable table with sticky header
- Body map: full-size with side panel
- Typography: 15px base, 24px h1, 18px h2

DESKTOP (1024px - 1439px):
- Columns: 12
- Full sidebar navigation
- Dashboard: 3-column card grid + activity feed
- Heatmap viewer: 3-panel (original/overlay/slider)
- Case queue: full table with inline detail panel
- Body map: full-size with floating info panel
- Typography: 16px base, 28px h1, 20px h2

LARGE DESKTOP (1440px+):
- Columns: 12 (centered with max-width)
- Condensed density option for power users
- Multi-monitor support consideration
- Maximum content width: 1280px, centered
- Typography: 16px base, 32px h1, 24px h2

SCREEN-SPECIFIC SPECS:

LANDING PAGE:
- Hero: full viewport height on desktop, auto on mobile
- Feature grid: 3-col desktop, 2-col tablet, 1-col mobile
- How it works: horizontal steps desktop, vertical mobile

PATIENT DASHBOARD:
- Header: sticky on scroll, 64px height
- Card grid: auto-fit, min 280px
- Activity feed: 4-col desktop, full-width mobile
- Notifications: slide-in panel or modal on mobile

UPLOAD FLOW:
- Step indicator: horizontal desktop, vertical mobile
- Image preview: 60% width desktop, full-width mobile
- Controls: floating on mobile, sidebar on desktop

GRAD-CAM VIEWER:
- Split view: 50/50 desktop, stacked mobile
- Opacity slider: horizontal desktop, vertical mobile
- Toggle controls: inline desktop, dropdown mobile

DOCTOR DASHBOARD:
- Queue table: horizontal scroll on mobile
- Detail panel: slide-over on tablet, side-by-side desktop
- Verdict form: bottom sheet mobile, inline desktop

BODY MAP:
- Map container: 400px min-width, responsive scaling
- Pin markers: 24px desktop, 32px touch devices
- Info panel: floating overlay mobile, side panel desktop

CONSENT CENTER:
- Form layout: single column mobile, 2-column desktop
- Toggles: full-width on mobile
- Audit log: paginated table

SPACING SCALE (4px base):
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

DO NOT: use fixed pixel widths, assume desktop-only, use responsive images without srcset, or design mobile-first without desktop consideration.
```

---

## 15. Microcopy Samples

```text
Design a microcopy style guide with samples for Skin Lesion XAI.

STYLE: Clinical Premium, clear, reassuring, non-technical.

LOADING STATES:

Image Analysis:
- Primary: "Analyzing your image..."
- Secondary: "This typically takes 10-20 seconds"
- Cancel option: "Cancel Analysis"

Heatmap Generation:
- Primary: "Generating explanation heatmap..."
- Secondary: "Creating visual breakdown of areas influencing the prediction"

File Upload:
- Primary: "Uploading your image..."
- Secondary: "Please keep this page open"

OCR Processing:
- Primary: "Extracting information from your document..."
- Secondary: "Reading lab report details"

Doctor Review Queue:
- Primary: "Checking for new cases..."
- Secondary: "You'll be notified when a case is ready"

EMPTY STATES:

No Lesions Yet:
- Headline: "No Lesions Tracked Yet"
- Body: "Upload your first skin image to start building your lesion history. Each image helps you and your doctor monitor changes over time."
- CTA: "Analyze First Image"

No Cases Pending Review:
- Headline: "No Cases Pending"
- Body: "You're all caught up. New submissions will appear here when patients request your review."
- Subtext: "Last case reviewed: [Date]"

No Notifications:
- Headline: "All Caught Up"
- Body: "You have no new notifications. Important updates will appear here."

No Search Results:
- Headline: "No Results Found"
- Body: "Try adjusting your search terms or filters to find what you're looking for."

ERROR STATES:

Upload Failed:
- Headline: "Upload Could Not Be Completed"
- Body: "We couldn't upload your image. This might be due to a network issue or the file size exceeding 10MB."
- Action: "Try Again" | "Contact Support"

Analysis Failed:
- Headline: "Analysis Interrupted"
- Body: "Something unexpected happened while analyzing your image. Your image has been saved and you can try again."
- Action: "Retry Analysis" | "Save for Later"

Session Expired:
- Headline: "Session Ended"
- Body: "For your security, your session has timed out. Please sign in again to continue."
- Action: "Sign In Again"

Network Error:
- Headline: "Connection Lost"
- Body: "Please check your internet connection and try again."
- Action: "Retry Connection"

CONFIRMATION STATES:

Analysis Complete:
- Headline: "Analysis Complete"
- Body: "Your results are ready. Remember, this is educational information only and is not a medical diagnosis."
- Action: "View Results" | "Review Disclaimer"

Review Submitted:
- Headline: "Review Submitted"
- Body: "Your professional opinion has been saved. The patient will be notified."
- Action: "Back to Queue" | "View Case"

Consent Updated:
- Headline: "Consent Preferences Saved"
- Body: "Your privacy settings have been updated. Changes take effect immediately."
- Action: "Review Changes" | "Return to Dashboard"

Deletion Requested:
- Headline: "Deletion Request Received"
- Body: "Your data will be permanently deleted within 30 days. You can cancel this request during that period."
- Action: "Cancel Request" | "Confirm"

TOOLTIP TEXT:

Heatmap Toggle:
- "Show areas of the image that most influenced the AI prediction"

Confidence Bar:
- "Temperature-scaled confidence reflects model certainty. Higher values indicate more confident predictions."

Body Map Pin:
- "Tap to view lesion history and track changes over time"

Quality Indicator:
- "Indicates how clearly the AI could analyze your image. Low quality may affect prediction accuracy."

Doctor Review Badge:
- "A medical professional has reviewed this case"

Storage Mode:
- "Controls how long your images and data are retained. Higher privacy means shorter retention."

WARNING MESSAGES:

Image Quality Low:
- "Image quality is lower than recommended. For best results, ensure good lighting and a steady hand. The prediction may be less reliable."

Heatmap Noisy:
- "The explanation heatmap shows unusual patterns. This may indicate the prediction is less reliable. Professional review recommended."

Consent Expiring:
- "Your consent expires in [X] days. Review your preferences to maintain uninterrupted service."

REVAMPED CONSENT WITHDRAWN:
- Headline: "Consent Withdrawn"
- Body: "Your consent has been withdrawn. Your data will be retained for [X] days as required by law, then permanently deleted."
- Support: "Questions? Contact privacy@example.com"

DO NOT: use alarmist language, diagnosis terminology, patient identity in tooltips, technical jargon in user-facing text, or passive-aggressive tones.
```

---

## 16. Missing Screen Prompts (Notification Center + Auth Flow + Mobile Camera)

```text
Design screens 12-14 for Skin Lesion XAI to complete the screen inventory.

STYLE: Clinical Premium, consistent with existing screens in this document.

---

## 12. Notification Center

```text
Design a notification center for Skin Lesion XAI -- a privacy-aware health tracking platform.

STYLE: Clinical Premium, calm, organized. Respects user attention with non-intrusive design.

LAYOUT:
- Notification list: timestamped, categorized, dismissible
- Category tabs: All, Analysis, Doctor, System
- Filter by status: unread (bold), read (normal weight)
- Bulk actions: mark all read, clear read notifications

NOTIFICATION TYPES:
- Analysis complete: "Your image analysis is ready" + link to results
- Doctor review submitted: "Dr. [Name] has reviewed your case" + verdict summary
- Review requested: "Your doctor has a question about your case" + action required
- Consent expiring: "Your consent expires in 14 days" + renewal CTA
- Storage mode change: Confirmation of privacy setting update
- Lab result reviewed: "Your lab results have been reviewed" + status
- Account security: "New device sign-in detected" + security info
- System maintenance: Scheduled downtime notice (if patient-facing)

STATES:
- Empty: "No Notifications" with illustration
- Loading: skeleton list
- Unread count badge on nav icon
- Swipe to dismiss on mobile
- Hover actions on desktop

INTERACTION:
- Click notification -> navigate to relevant screen
- Hover -> show quick actions (mark read, dismiss)
- Pull-to-refresh on mobile
- Real-time updates via polling or push

DO NOT: show PHI in notification preview, use urgent red for non-critical alerts, include advertising or promotional content.
```

---

## 13. Authentication Flow

```text
Design a complete authentication flow for Skin Lesion XAI -- a privacy-first health platform.

STYLE: Clinical Premium, trustworthy, secure-feeling without being intimidating.

SCREENS:

LOGIN:
- Email/username field
- Password field with show/hide toggle
- "Remember this device" checkbox
- "Forgot password" link
- "Sign In" primary button
- Divider: "or"
- SSO options (if applicable): Google, Hospital SSO
- "Create Account" link

REGISTRATION:
- Full name
- Email
- Password (with strength indicator)
- Confirm password
- Terms of service checkbox (link to full policy)
- Privacy consent checkbox (separate from terms)
- "Create Account" primary button

CONSENT ONBOARDING (immediately after registration):
- Welcome screen explaining the platform
- Privacy-first message
- Storage mode selection prompt (optional for now)
- Safety disclaimer acknowledgment
- "Continue to Dashboard" CTA

PASSWORD RESET REQUEST:
- Email field
- "Send Reset Link" button
- Confirmation message: "Check your email for a reset link"
- "Back to Sign In" link

PASSWORD RESET CONFIRMATION:
- New password field
- Confirm password field
- "Reset Password" button
- Success: "Password updated. Please sign in with your new password."

SESSION TIMEOUT WARNING:
- Modal overlay
- "Your session will expire in 2:00"
- "Continue Session" button
- "Sign Out" button

DEVICE MANAGEMENT:
- List of logged-in devices
- Current device indicator
- "Sign out this device" option per device
- "Sign out all devices" (requires password confirmation)

MULTI-FACTOR AUTHENTICATION (if enabled):
- TOTP code entry (6 digits)
- Code input fields (auto-advance)
- "Verify" button
- Backup code option
- "Trust this device for 30 days" checkbox

STATES:
- Loading on submit
- Error: invalid credentials, account locked, network error
- Success: redirect to dashboard
- MFA pending
- Password reset flow
- Account locked after failed attempts

DO NOT: pre-fill email from记住了 accounts without consent, use security questions (use MFA instead), send passwords via email, use CAPTCHA (use honeypot fields instead).
```

---

## 14. Mobile Camera Capture

```text
Design a mobile-optimized camera capture experience for Skin Lesion XAI.

STYLE: Clinical Premium, focused, medical-device inspired. Minimal distractions, maximum guidance.

LAYOUT:
- Full-screen camera viewfinder
- Semi-transparent overlay guide shapes
- Top bar: close button, flash toggle, timer (optional)
- Bottom bar: capture button, gallery import, body map reference toggle

GUIDANCE OVERLAY:
- Elliptical guide shape (dermoscopy-style)
- "Center the lesion within the guide" instruction
- Distance indicator: "Move closer" / "Good distance" / "Too close"
- Lighting indicator: "Improve lighting" / "Good lighting"
- Motion indicator: "Hold steady"

GUIDANCE MODES:
- Auto: AI detects framing quality in real-time
- Manual: User follows static guidelines
- Guided: Step-by-step positioning instructions

CAPTURE BUTTON:
- Large (64px), centered
- Press-and-hold for burst mode
- Subtle pulse animation when good framing detected
- Disabled state when quality too low

GALLERY IMPORT:
- Thumbnail grid of recent photos
- "Select from Gallery" button
- Filter to recent images only (reduce decision fatigue)

FLASH CONTROL:
- Auto / On / Off toggle
- Red-eye reduction option
- Torch mode for close-up (with warning: "Avoid direct light contact with eyes")

BODY MAP REFERENCE:
- Mini body map overlay toggle
- Shows previously marked locations
- "Photo of [Location]?" prompt
- Helps user match photo to body map pin

POST-CAPTURE:
- Review screen: captured image full-screen
- Retake button (prominent)
- Use Photo button
- Advanced: crop, rotate, brightness adjust
- Quality score display: "Good quality" / "Acceptable" / "Retake recommended"
- Warning callout if quality concerns detected

MULTIPLE PHOTO MODE:
- Series capture for time progression
- "Add to lesion timeline" prompt
- Side-by-side comparison of previous photos
- "This photo is from [Date]" context

CAMERA PERMISSIONS:
- Permission request screen with clear explanation
- "Camera access needed to analyze skin images"
- Settings redirect if permission denied

STATES:
- Permission request
- Camera initializing
- Live preview with guidance
- Capturing
- Quality check processing
- Review captured
- Quality warning (advisory, not blocking)
- Error: camera unavailable, permission denied

MOBILE-SPECIFIC:
- Portrait orientation lock during capture
- Pinch-to-zoom on preview
- Haptic feedback on capture
- Auto-save to temp storage on capture

DO NOT: auto-upload without confirmation, make quality warnings blocking, use aggressive camera sounds, show advertising, collect location data without consent.
```

---

## 17. Revision Workflow

```text
Design a revision workflow specification for Skin Lesion XAI design iterations.

STYLE: Process documentation, Clinical Premium, actionable steps.

4-STEP ITERATION PROCESS:

STEP 1: INITIAL PROMPT EXECUTION
- Designer copies prompt from CLAUDE_DESIGN_PROMPTS.md
- Designer adds context from domain primer and clinical interpretation docs
- Designer generates 2-3 initial concepts (varying composition, color, layout)
- Designer saves all concepts with naming convention:
  - `concept-1-[screen]-[descriptor].png`
  - `concept-2-[screen]-[descriptor].png`
- Designer documents first impression notes per concept

STEP 2: STAKEHOLDER REVIEW
- Designer presents concepts in dedicated review session
- Stakeholders score concepts: 1-5 on Clarity, Visual Appeal, Clinical Trust, Usability
- Stakeholders provide specific feedback per concept
- Designer captures feedback verbatim for revision notes
- Designer identifies winning concept or hybrid elements
- Decision: proceed to revision, pivot concept, or return to prompt

STEP 3: REVISION CYCLE
- Designer applies specific, actionable feedback only
- Designer maintains design system consistency
- Designer documents changes made vs feedback addressed
- Designer creates revised version with clear version suffix:
  - `v2-[screen]-[descriptor].png`
- Designer submits for second review if needed
- Maximum 3 revision rounds per screen before escalation

STEP 4: FINALIZATION AND HANDOFF
- Designer verifies all required states are represented
- Designer confirms accessibility checklist completion
- Designer exports assets in required formats:
  - PNG for review
  - SVG for implementation reference
  - Figma/Sketch file for development handoff
- Designer updates STITCH_HANDOFF_GUIDE.md with screen status
- Designer marks screen as "Ready for Implementation" in tracking

STITCH TRANSITION:

GOOGLE STITCH INTEGRATION:
- After initial prompt execution, import winning concept to Stitch
- Use Stitch for rapid layout exploration (16px grid, component variants)
- Use Stitch to validate responsive breakpoints
- Use Stitch to test interaction patterns (prototype mode)
- Export Stitch artboards back to CLAUDE_DESIGN_PROMPTS.md review cycle

TRANSITION CHECKLIST:
- [ ] Import initial concept to Stitch workspace
- [ ] Verify design tokens map to Stitch components
- [ ] Create responsive variants using Stitch constraints
- [ ] Build interactive prototype for key flows
- [ ] Test with 3+ users if available
- [ ] Document findings
- [ ] Update design prompt if user testing reveals issues
- [ ] Re-export final Stitch artboards to design folder

HANDOFF TO DEVELOPMENT:
- All screens marked "Ready for Implementation"
- All states verified and documented
- Responsive specifications confirmed
- Accessibility review completed
- Design system tokens extracted to shared document
- Figma/Sketch file organized with proper naming
- Assets exported to `design/assets/[screen]/`
- Meeting scheduled for developer Q&A

VERSION CONTROL FOR DESIGNS:
- Main branch: latest approved designs
- Feature branches: `feat/[screen-name]-[description]`
- Pull requests for all changes
- Review required before merge to main
- Tag releases: `v1.0`, `v1.1`, `v2.0`

DO NOT: skip stakeholder review, make changes without documented feedback, skip accessibility checks, hand off incomplete states, proceed without responsive validation.
