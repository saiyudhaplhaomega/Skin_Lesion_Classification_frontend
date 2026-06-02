# Claude Design Prompts — Skin Lesion XAI

A step-by-step playbook for designing and building the Skin Lesion XAI frontend with AI tools. Read it top to bottom: each step feeds the next, so by the end you have a consistent, brand-locked, accessible, and (where appropriate) cinematically animated product — not a pile of disconnected screens.

Companion files: **Google Stitch** layout exploration lives in [`GOOGLE_STITCH_PROMPTS.md`](GOOGLE_STITCH_PROMPTS.md); the design-to-code mapping for production lives in [`STITCH_HANDOFF_GUIDE.md`](STITCH_HANDOFF_GUIDE.md).

---

## First time? Do exactly this (the 10-minute quickstart)

If you've never used Claude Design, ignore everything else for a moment and just do these in order. Each line links to the full detail.

1. **Check you're on a paid plan** (Pro / Max / Team / Enterprise). Free accounts don't have Claude Design.
2. **Open a regular Claude chat.** Paste the three code blocks from Step 2 one at a time (2.2 grid, 2.3 accessibility, 2.4 microcopy). Save each answer as a file. → *This is "place A."* (See Step 2.)
3. **Open the Design app** — click the **palette icon labeled "Design"** in the left sidebar of claude.ai.
4. **Build your brand kit once.** Inside the Design app click **Design Systems → Create a new design system**. Name it `Skin Lesion XAI`, upload your logo, paste in your colors/spacing, click **Generate**, fix anything off, then **Publish**. → *This is "place C."* (See Step 3.1.)
5. **Make your first screen.** Back in a regular chat, take the **Landing Page** prompt (6.2), drop it into the scaffold (5.1), and copy the result. Then in the Design app click **New project → High Fidelity**, **select the "Skin Lesion XAI" design system**, paste the prompt, and **Generate**. → *Prompt built in A, screen drawn in B.* (See Step 5.2.)
6. **Tweak it for free.** Click any element to edit text/colors directly, or leave inline comments — these don't cost session budget. (See Step 5.2 Part 3.)
7. **Repeat step 5 for each screen** in Step 6, in the order listed.

That's the whole thing. The sections below just explain each part in full, with a tag — **[in A]**, **[do in B]**, **[do in C]** — telling you which window you should be in.

---

## Build Sequence (the whole flow at a glance)

Do the steps in order. Steps 1–2 are once-per-project setup; steps 4–5 repeat per screen.

1. **Step 1 — Choose your build path.** Claude Design for screens, Bolt.new / Claude Code for the animated landing page.
2. **Step 2 — Lock the foundations.** The shared design brief, grid, accessibility spec, and microcopy. These are the inputs to everything else.
3. **Step 3 — Set up Claude Design & build the Design System.** The brand kit every screen inherits.
4. **Step 4 — Plan the product.** Map the screens and user journeys before designing them.
5. **Step 5 — The per-screen method.** The one-shot prompt scaffold + the generate/refine loop.
6. **Step 6 — Generate the screens.** The full screen-prompt library, in build order.
7. **Step 7 — Add cinematic animation.** High-end motion for the public landing page only.
8. **Step 8 — Iterate, review & hand off.** Revision workflow and handoff to development.

---

## Where to paste what (read this once — it removes all the guesswork)

There are **three different places** you type/paste things. Mixing them up is the most common mistake, so here is the rule for each:

| Place | How to open it | What goes here |
| --- | --- | --- |
| **A. Regular Claude chat** (normal claude.ai conversation) | Just your everyday Claude chat window — NOT the Design app | All "thinking" work: research, writing copy, and generating the **four foundation reference docs** in Step 2 (grid, accessibility, microcopy, brief). This does not cost Design sessions. |
| **B. Claude Design app** (the canvas) | Click the **palette icon labeled "Design"** in the left sidebar of claude.ai | The actual **screens** from Step 6. You paste a screen prompt here and it draws the UI. This costs your weekly Design session budget. |
| **C. Design System creator** (a tab inside the Design app) | Inside the Design app → top tab **"Design Systems"** → button **"Create a new design system"** | Only your brand kit setup in Step 3 (logo, colors, fonts). You build this ONCE. |

Quick mental model: **think and write in A → set up your brand once in C → draw every screen in B.** A fourth place (D) — **Bolt.new or Claude Code** — only appears in Step 7 for the animated landing page.

Throughout the steps below you'll see a tag like **[paste in A]**, **[do in B]**, or **[do in C]** so you always know where you are.

---

# Step 1 — Choose Your Build Path

Pick the tool by what you are building. You will usually use more than one.

- **Claude Design** (palette icon in the Claude.ai sidebar) — best for clean, brand-consistent high-fidelity *screens and states*: dashboards, flows, forms, modals. This is the primary tool for Steps 3–6. Its motion ceiling is limited (no real timelines, particles, or 3D).
- **Bolt.new / Claude Code** — best for the *public marketing landing page* when you want heavy, cinematic animation (scroll storytelling, parallax, 3D/video heroes). Covered in **Step 7**.
- **Google Stitch** — fast layout/structure exploration before committing to a high-fidelity direction (see `GOOGLE_STITCH_PROMPTS.md`).

Rule of thumb: design the app surfaces in Claude Design with calm, restrained motion; build the one animated marketing page separately and port the good parts into this repo's Next.js frontend.

---

# Step 2 — Lock the Foundations (read first)

These four specs are the inputs to your Design System and to every screen prompt. Settle them before generating any screen, because the prompts in Step 6 reference them by name ("the status colors", "the 4px spacing scale", "the microcopy").

**Exactly what to do for this whole step — [all in A, regular Claude chat]:**

1. Open a **regular Claude chat** (not the Design app — you don't want to spend Design sessions on text).
2. Copy the code block in **2.2** (everything between the triple backticks) and paste it into the chat. Press enter. Claude writes you a grid spec. **If you're happy with it,** save it to a file named `design/foundations/grid.md` (or just keep the chat open).
3. Do the same for **2.3** (accessibility → `accessibility.md`) and **2.4** (microcopy → `microcopy.md`), each in the same chat or a new one.
4. **2.1 is not a prompt** — it's the written brief you'll reuse. Keep it handy; you'll paste pieces of it into the Design System creator in Step 3 and into screen prompts in Step 6.
5. When all four exist, you're done with Step 2. You now carry these into Step 3.

> You do NOT paste these into the Design app. They are reference text that feeds the Design System (Step 3) and the screen prompts (Step 6).

## 2.1 Shared Clinical Premium Design Brief

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

## 2.2 Responsive Grid Baseline

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

## 2.3 Accessibility Interaction Specification

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

## 2.4 Microcopy Samples

This is the source of truth for screen text. Never let the AI invent placeholder copy — paste from here.

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

Consent Withdrawn:
- Headline: "Consent Withdrawn"
- Body: "Your consent has been withdrawn. Your data will be retained for [X] days as required by law, then permanently deleted."
- Support: "Questions? Contact privacy@example.com"

DO NOT: use alarmist language, diagnosis terminology, patient identity in tooltips, technical jargon in user-facing text, or passive-aggressive tones.
```

---

# Step 3 — Set Up Claude Design & Build the Design System

This is the operating manual for the Claude Design app. Following it is the single biggest lever for getting a polished, on-brand result on the **first generation** instead of burning a weekly session limit on rework.

### 3.0 Prerequisites

- **Paid plan required.** Claude Design is available on Pro, Max, Team, and Enterprise plans only — not the free tier.
- **Where to find it.** In Claude.ai, open the **palette icon labeled "Design"** in the left sidebar to enter the dedicated design app. It has its own weekly session limit, separate from regular Claude chat — treat those sessions as a scarce resource.

### 3.1 Build the Design System first (your brand kit)

Always create a **Design System before designing any screen**. It is a reusable brand kit (colors, logo, fonts, button/card components) that keeps every generated screen consistent, so you never re-explain the brand in each prompt. Building one is token-intensive (roughly 6% of a Max session) but pays for itself immediately. **You do this exactly once.**

**Click-by-click — [do in C, the Design System creator]:**

1. Open the **Design app** (palette icon in the sidebar). At the top, click the **"Design Systems"** tab, then the **"Create a new design system"** button.
2. **Name + mission field:** type the name `Skin Lesion XAI` and, in the description/mission box, paste this one line: *"An educational, privacy-aware AI explainability and lesion-history platform — calm, trustworthy, private, usable under stress. Not a diagnosis tool."* (This comes from the brief in Step 2.1.)
3. **Upload assets:** click the upload area and add your logo (PNG or SVG). If you have a brand-guideline or tokens file, add it too. Optional: paste your live site URL or GitHub repo so Claude reads existing CSS.
4. **Paste your color + spacing rules** into the same setup/description box so the system bakes them in. Copy the **"Status color language"** block from Step 2.1 and the **"SPACING SCALE"** lines from your `grid.md` (Step 2.2) and paste them in. This is why you did Step 2 first.
5. Click **Generate**. Claude produces palettes, font scales, and components (buttons, badges, cards). **Look at every element.**
6. **If something is off,** type a correction right there, one fix at a time, e.g. *"keep the logo exactly as the uploaded PNG"* or *"buttons should feel calm and clinical — no glow, no gradient."* Repeat until it looks right.
7. **If you're happy,** click **Publish**. Done — from now on this system appears as a selectable option whenever you start a new project (Step 3.3), and brand rules apply automatically so you never re-type them.
8. Optional: use **Export** to download it as ZIP / PDF / HTML if you want it in Canva or Claude Code later.

> The Design System must encode the **Status color language** (green / amber / blue / red-limited / neutral) and the **4px spacing scale** from 2.2, so status semantics and rhythm are consistent across every screen without restating them.

### 3.2 Save your session budget — brainstorm in regular chat

Claude Design sessions are limited and reset weekly. Do everything that does **not** require the design canvas in **regular Claude chat** first:

- Market/competitor research, naming, and tone exploration.
- Writing the actual website/screen copy (use the **Microcopy Samples, 2.4** as the source of truth).
- Producing a **single comprehensive markdown spec** per screen — combine the relevant prompt from Step 6 with context from `docs/03_DOMAIN_PRIMER.md` and `docs/04_GRADCAM_CLINICAL_INTERPRETATION.md`. Drop that finished spec into Claude Design so the session is spent rendering, not clarifying.

### 3.3 Launch the project correctly

- Start a new project and choose **High Fidelity** (full color + styling) for production-intent screens. Use **Wireframe** only when you want structure without aesthetics (e.g. validating the body-map layout).
- **Select the Design System** you built in 3.1 so the build inherits brand rules.

### 3.4 Communicate the layout visually, not just in text

Text alone rarely lands the composition on the first try. Combine these inputs:

- **Napkin sketch** — use the Sketch tool to rough out boxes for navbar, hero, panels, and content order. This is the highest-leverage way to get the intended layout in one shot.
- **Reference screenshot / URL** — paste a screenshot or URL of a layout density or aesthetic you want to echo (a calm clinical dashboard, not a flashy SaaS landing).
- **Dynamic media** — if a hero needs motion, an MP4 under ~30–40 MB can loop in the background (smaller is better — aim for ≤3–5 MB). You don't film this; you generate it from a still with an image-to-video model. The fastest clean path is **Higgsfield → Seedance** (same still in the start + end frame for a seamless loop). Full baby-step walkthrough in [`IMAGE_TO_ANIMATION_GUIDE.md`](IMAGE_TO_ANIMATION_GUIDE.md) §2.5–§2.7. For this clinical product, keep motion subtle and avoid anything that reads as marketing hype.

---

# Step 4 — Plan the Product (map screens & journeys)

Before generating individual screens, map how they connect. **[do in A, regular Claude chat]** — paste the prompt below into a regular chat (not the Design app). Claude returns a Mermaid diagram; save it as `design/foundations/journey.md`. Use it to decide build order and to catch missing states. **If you're happy with it,** move on to Step 5.

## 4.1 Screen-to-Screen Flow Diagram (Mermaid Journey Map)

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

# Step 5 — The Per-Screen Method

Every screen in Step 6 is generated the same way. Learn this loop once, then apply it to each prompt.

## 5.1 One-Shot Prompt Scaffold

Each numbered prompt in Step 6 is the **screen-specific core**. For the best single-generation result, wrap that core in this scaffold before pasting into Claude Design. Filling all the slots is what turns a decent first draft into a near-final screen.

```text
ROLE: You are a senior product designer for a regulated clinical health product.

PRODUCT: Skin Lesion XAI — an educational, privacy-aware AI explainability and
lesion-history platform. NOT a diagnosis tool.

DESIGN SYSTEM: Use the published "Skin Lesion XAI" design system (Clinical Premium).
Honor its palette, the semantic status colors, the 4px spacing scale, and the type scale.

SCREEN BRIEF:
<paste the relevant Step 6 prompt here>

OUTPUT FORMAT: Responsive High-Fidelity HTML/CSS. Show desktop and mobile.
Render EVERY required state listed in the brief as a separate frame/section, clearly labeled.

NON-NEGOTIABLES:
- Include the safety disclaimer on every patient-facing surface.
- Status color must never be the only signal — pair with icon + text.
- Meet WCAG AA contrast and 44px touch targets (see Step 2.3).

DO NOT:
<copy the brief's own DO NOT line, plus: no lorem ipsum — use the microcopy in Step 2.4>
```

## 5.2 Generate & refine loop (the exact click-by-click for every screen)

Repeat this for each screen in Step 6. The first half happens in **regular chat (A)**, then you move to the **Design app (B)**.

**Part 1 — build the prompt [in A, regular Claude chat]:**

1. Open a **regular Claude chat**. Paste the 5.1 scaffold template.
2. In the scaffold's `SCREEN BRIEF:` slot, **paste the screen prompt** you want from Step 6 (e.g. the 6.2 Landing Page block).
3. In the `DO NOT:` slot, **paste that same screen's own DO NOT line** (it's at the bottom of each Step 6 prompt).
4. Ask Claude in that chat: *"fill any copy in this screen using the microcopy in [paste relevant bits from 2.4]"* so there's no placeholder text.
5. **Copy the whole filled-in scaffold.** This is the thing you'll paste into the Design app. (Optional but recommended: also tell that chat to add 1–2 lines of clinical context from `docs/03_DOMAIN_PRIMER.md` and `docs/04_GRADCAM_CLINICAL_INTERPRETATION.md`.)

**Part 2 — generate the screen [in B, the Design app]:**

6. Open the **Design app** (palette icon). Click **New project**. Choose **High Fidelity**. In the design-system dropdown, **select "Skin Lesion XAI"** (the one you published in Step 3). If you skip this, the screen won't match your brand.
7. Before generating, **attach a napkin sketch or a reference screenshot** (drag it in) so Claude knows the layout you want.
8. **Paste the filled-in scaffold** from Part 1 into the prompt box. Press generate. Wait for the screen to render.

**Part 3 — refine (mostly free — does NOT cost Design sessions) [in B]:**

9. Look at the result. For small fixes, use the **free tools** before re-prompting:
   - **Direct edit:** click text/an element and change wording, font size, or color by hand.
   - **Inline comment:** click an element, leave a note like *"make this button the amber status color."*
   - **Draw tool:** circle a region and type what to change there.
   - **Tweaks panel:** ask *"give me a set of sliders to play with"* to nudge color intensity, spacing rhythm, and border radius live.
10. **If a bigger change is needed,** re-prompt — but **one change theme at a time** (fix the hero, generate; then the cards, generate; then the states). Don't stack five requests in one message. Keep a short `DO NOT` line each time.
11. Model choice: use the **most capable model (Opus-tier)** for the first full build, then switch to a **faster model (Sonnet-tier)** for tiny tweaks to save your weekly budget.

**Part 4 — finish this screen [in B]:**

12. **Mobile check:** open the responsive/device preview. If it looks broken, prompt *"optimize the layout for mobile using these breakpoints"* and paste the breakpoint lines from your `grid.md` (2.2).
13. **If you're happy:** use **Share → download ZIP**, and save screenshots/HTML under `design/claude-design/`.
14. Move to the next screen and repeat from step 1. (Later, implement against the Next.js frontend using `STITCH_HANDOFF_GUIDE.md` — treat exported HTML as reference, not a drop-in. For extra layout variants, see `GOOGLE_STITCH_PROMPTS.md`.)

### One-shot checklist (verify before each generation)

1. Design System selected and published.
2. A napkin sketch or reference screenshot attached for layout intent.
3. Real copy pasted from **Microcopy Samples (2.4)** — never placeholder text.
4. All **required states** for the screen named explicitly in the brief.
5. The `DO NOT` block present and specific.
6. Grid/breakpoint expectations from **2.2** referenced for any multi-column layout.

---

# Step 6 — Screen Prompt Library (build order)

Generate screens in roughly this order — entry/auth first, then the core patient journey, then reviewer and internal surfaces. Each prompt is self-contained; wrap it in the Step 5.1 scaffold before pasting.

## Group A — Entry & core patient journey

### 6.1 Authentication Flow

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

DO NOT: pre-fill email from remembered accounts without consent, use security questions (use MFA instead), send passwords via email, use CAPTCHA (use honeypot fields instead).
```

### 6.2 Landing Page

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

> For a cinematic, heavily animated version of this landing page, see **Step 7**.

### 6.3 Patient Dashboard

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

### 6.4 Patient Upload + Analysis Flow

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

### 6.5 Mobile Camera Capture

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

### 6.6 Grad-CAM Heatmap Viewer

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

### 6.7 2D Body Map + Lesion Placement

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

### 6.8 Lab Result Upload + Review

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

### 6.9 Notification Center

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

### 6.10 Consent Management Center

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

## Group B — Reviewer surface

### 6.11 Doctor Dashboard

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

## Group C — Internal / operator surfaces

### 6.12 Research / Model Performance Dashboard

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

### 6.13 Administrator Dashboard

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

### 6.14 Cloud Operations / Cost Control Dashboard

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

# Step 7 — Add Cinematic Animation (landing page only)

Claude Design is great for clean screens but limited on motion. When you want a cinematic, heavily animated **public landing page**, use one of the paths below. Keep clinical/patient surfaces calm — reserve heavy motion for marketing.

## 7.1 Path A — Bolt.new prompt-to-site (fastest for animated marketing)

[bolt.new](https://bolt.new) turns a text description into a working Next.js + Tailwind site in the browser, edits the code live, and deploys. It runs Claude models under the hood and adds animation libraries on request. **This is "place D" — a separate website, not the Claude Design app.**

**Click-by-click [in D, bolt.new]:**

1. **Go to [bolt.new](https://bolt.new)** in your browser and **sign in** (Google/GitHub/email). You land on a big prompt box in the center of the screen.
2. **Type your one big structural prompt into that box and press enter / the send arrow.** Use this exact starter and edit to taste:
   > Build a premium clinical-tech landing page for "Skin Lesion XAI", an educational AI explainability platform (not a diagnosis tool). Calm dark-on-light clinical palette with one restrained accent and semantic status colors. Include: scroll-triggered fade-ins and gentle parallax on each section, a sticky navbar that shrinks on scroll, subtle hover/tilt micro-interactions on feature cards, and a hero with a soft animated gradient mesh (no particles, no purple glow). Use Framer Motion for UI motion and GSAP ScrollTrigger for scroll sequences. Fully responsive, 60fps, respects prefers-reduced-motion.
3. **Wait for the build.** Bolt opens a workspace: chat on the **left**, code + a live **Preview** pane on the **right**. It installs packages and shows the site automatically — you don't run anything.
4. **Refine in the left chat, one theme per message.** Type each as a separate message and wait for the rebuild between them: *"add GSAP ScrollTrigger reveals to the How-It-Works section"* → *"give feature cards a subtle 3D tilt on hover with Framer Motion"* → *"add smooth section transitions"* → *"keep all animations at 60fps and disable them under prefers-reduced-motion."*
5. **If the preview looks wrong,** describe the bug plainly in the chat: *"fix the animation lag on mobile"* or *"the navbar overlaps the hero on small screens."* Use the device/responsive icon in the Preview toolbar to check mobile early.
6. **When you're happy, get the code out.** Two options:
   - **Download:** click the **Export / Download** button (top-right area) to get a ZIP, then copy the good parts into this repo's Next.js frontend.
   - **Or push to GitHub** via Bolt's GitHub button, then connect that repo to Vercel for hosting.
7. **Treat Bolt output as a reference build**, not the final repo — port the animation code into your existing frontend so it stays in version control.

Prompt tips: use vivid descriptors ("buttery smooth", "cinematic", "premium micro-interactions", "parallax depth"); start simple and layer motion in separate prompts so the model doesn't conflate them; test mobile early because heavy motion costs frames.

## 7.2 Path B — Claude Code + your repo (most control, production-grade)

For the cinematic landing page that actually ships from this repo, build it in Claude Code against the Next.js frontend and install one of the design skills below so the AI has real design taste and motion guidance. This is the route for animated 3D / video-background heroes that need to live in version control and pass review.

## 7.3 Design skills to install (give the AI taste + motion vocabulary)

These are agent skills (`SKILL.md` files) that load design intelligence into Claude Code / Cursor / Codex. Install once, then reference them while building. They are the single biggest quality lever after a good prompt.

**Where to run the install commands [in D]:** open a terminal in **VS Code** with your frontend repo folder open (the `npx ...` commands install into that project). On Windows, the VS Code terminal or PowerShell both work; run the command from the repo root so the skill lands in this project. After installing, restart Claude Code / the editor so the new skill is picked up, then you "use" a skill by typing its slash command (e.g. `/impeccable animate`) in the Claude Code chat.

- **Impeccable** ([github.com/pbakaus/impeccable](https://github.com/pbakaus/impeccable)) — 1 skill, 23 commands, 7 reference files (typography, color, **motion**, spatial, interaction, responsive, ux-writing) plus deterministic anti-slop rules. Most useful commands here: `/impeccable animate` (purposeful motion), `/impeccable overdrive` (technically extraordinary effects), `/impeccable craft`, `/impeccable polish`, `/impeccable audit` (a11y/perf/responsive), `/impeccable critique`. It also ships a linter: `npx impeccable detect <dir|file|url>` flags AI-slop tells (purple gradients, bounce easing, dark glows, tiny touch targets). Install: download from [impeccable.style](https://impeccable.style) or `cp -r dist/claude-code/.claude your-project/`.
- **Taste-Skill** ([github.com/leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill)) — anti-slop frontend framework with adjustable dials: `DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY` (1–10). Variants worth knowing: `soft-skill` (calm, premium, spring motion — best fit for this clinical product), `minimalist-ui` (Linear/Notion vibe), `gpt-taste` (stronger GSAP/motion enforcement), `stitch-design-taste` (Google Stitch + `DESIGN.md` export). Install: `npx skills add https://github.com/Leonxlnx/taste-skill --skill "high-end-visual-design"`. For the landing page push `MOTION_INTENSITY` higher; for patient screens keep it low.
- **UI-UX Pro Max** ([github.com/nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)) — design-intelligence skill for professional UI/UX across multiple platforms; useful as a general second opinion on layout and component decisions.
- **Huashu Design** ([github.com/alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design)) — a Claude Code skill with a real **Stage + Sprite motion engine** that exports MP4 / GIF (60fps interpolation) / editable PPTX / PDF, a brand-asset protocol, a design-direction advisor, and a 5-dimension critique. Install: `npx skills add alchaincyf/huashu-design`. Best for producing a cinematic hero video loop or a launch animation you can drop into the hero (see "dynamic media" in Step 3.4). **License caveat:** free for personal/portfolio use, but commercial/enterprise use requires the author's permission — relevant if this platform ever becomes a commercial product, so don't bake its output into a paid deliverable without clearing the license.

> Recommendation for this project: install **Taste-Skill `soft-skill`** (or **Impeccable**) as the default taste layer, use **Impeccable `/animate` + `/audit`** for motion and accessibility passes, and reach for **Huashu Design** only when you specifically need an exported hero video/GIF.

## 7.4 Animation toolkit — libraries & component sources

Tell the AI exactly which library to use; vague "add animations" produces slop. Map the effect to the right tool:

- **Motion / Framer Motion** ([motion.dev](https://motion.dev)) — React UI motion: enter/exit, layout transitions, hover/tap, scroll-linked (`useScroll`, `whileInView`). The default for component-level motion.
- **GSAP + ScrollTrigger** ([gsap.com](https://gsap.com)) — complex, sequenced, scroll-pinned timelines and parallax. Use for the landing page's scroll story.
- **Three.js / React Three Fiber** ([r3f.docs.pmnd.rs](https://r3f.docs.pmnd.rs)) + **drei** — real 3D scenes, depth, shader/gradient-mesh heroes. Use sparingly and lazy-load; it's heavy.
- **Lenis** ([lenis.darkroom.engineering](https://lenis.darkroom.engineering)) — smooth-scroll layer that makes scroll-triggered motion feel "buttery".
- **Lottie** ([lottiefiles.com](https://lottiefiles.com)) — lightweight vector animations exported from After Effects; good for small looping accents.
- **Spline** ([spline.design](https://spline.design)) — design interactive 3D in a GUI and embed it; an easier route to a 3D hero than hand-writing Three.js.
- **AI video-background hero (Seedance / Kling)** — for a cinematic looping `<video>` behind the hero, don't hand-animate it: generate it from a ChatGPT still with an image-to-video model and drop in the optimized MP4/WebM. Full step-by-step (Higgsfield → Seedance, the loop trick, ffmpeg compression, and the `<video>` wiring) is in [`IMAGE_TO_ANIMATION_GUIDE.md`](IMAGE_TO_ANIMATION_GUIDE.md) §2 and §5.1. Keep it calm, silent, and ≤3–5 MB.

Ready-made animated component sources (copy-paste, then restyle to the design system):

- **21st.dev** ([21st.dev](https://21st.dev)) — large library of animated React/Tailwind components; has an MCP/"magic" generator you can wire into Claude Code to pull components by description.
- **Aceternity UI** ([ui.aceternity.com](https://ui.aceternity.com)) and **Magic UI** ([magicui.design](https://magicui.design)) — premium Framer-Motion-based effects (spotlight, beams, marquees, animated backgrounds).
- **React Bits** ([reactbits.dev](https://reactbits.dev)) — animated text and background effects.

Workflow with these: grab a component from 21st.dev / Aceternity, paste it into Claude Code, then run `/impeccable polish` or Taste-Skill to recolor it to the Clinical Premium palette and strip slop, and `/impeccable audit` to confirm accessibility and performance.

## 7.5 Clinical Premium motion guardrails (non-negotiable)

This is a health product, so "beyond this world" animation applies to the **marketing landing page only** and must still obey:

- **`prefers-reduced-motion`**: every animation has a reduced/disabled fallback (see Step 2.3).
- **60fps, GPU-friendly**: animate `transform`/`opacity`, not layout properties; lazy-load Three.js/Spline; test on mid-range mobile.
- **No flashing/strobe**, no aggressive auto-play, no motion that conveys medical meaning (status must still read via icon + text + color, never via animation alone).
- **Calm patient surfaces**: dashboards, upload, results, consent, and doctor views keep the restrained motion already specified per screen — do not port landing-page theatrics into them.

---

# Step 8 — Iterate, Review & Hand Off

## 8.1 Revision Workflow

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
```
