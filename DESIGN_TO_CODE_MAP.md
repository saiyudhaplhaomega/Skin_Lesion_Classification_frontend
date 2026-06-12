# Design-to-Code Map

Use this file when you are ready to implement a designed screen in Next.js. It maps every screen to its route, key components, and API contracts.

**The source of truth is this Next.js repo, not the design files.** Design outputs in `design/claude-design/` are reference only. Do not copy-paste exported HTML directly into `app/` or `components/` without reviewing it, cleaning it up, and fitting it to the existing architecture.

---

## Design Output Directories

| Directory | What goes here |
|---|---|
| `design/claude-design/` | Claude Design HTML prototypes and screenshots (primary) |
| `design/source-art/` | Raw ChatGPT stills and raw AI video before optimization |
| `design/reference/` | Optional reference screenshots saved during exploration |

---

## How To Bring Claude Design Screens Into This Project

Use this workflow every time you finish a screen in Claude Design.

### Step 1: Export From Claude Design

In Claude Design:

1. Open the finished screen.
2. Use **Share / Export / Download ZIP** if available.
3. If ZIP export is not available, export screenshots for desktop and mobile.
4. Do not copy generated HTML directly into the app.

Why: Claude Design output is a design reference. The production app must still use the Next.js routes, components, API contracts, and safety copy in this repo.

### Step 2: Create The Design Folder

Run from:

```powershell
cd C:\Users\saiyu\Desktop\projects\KI_projects\Skin_Lesion_GRADCAM_Classification\Skin_Lesion_Classification_frontend
```

Create the folder for one screen. Example for the landing page:

```powershell
New-Item -ItemType Directory -Force design\claude-design\landing-page
```

Check:

```powershell
Test-Path design\claude-design\landing-page
```

Expected result:

```text
True
```

### Step 3: Put The Exported Files There

Move the exported ZIP contents or screenshots into the matching folder.

Use this naming pattern:

```text
design\claude-design\landing-page\desktop.png
design\claude-design\landing-page\mobile.png
design\claude-design\landing-page\source.html
design\claude-design\landing-page\notes.md
```

Only use files that actually exist. If Claude Design gives you `index.html`, keep it, but treat it as reference only.

Check:

```powershell
Get-ChildItem design\claude-design\landing-page
```

Expected result: you see the design export files for that screen.

### Step 4: Ask Claude Code For A Plan First

Paste this into Claude Code:

```text
Read these design references:

design/claude-design/landing-page
DESIGN_TO_CODE_MAP.md

Create an implementation plan for the landing page only.

Do not implement yet.
Treat exported HTML as visual reference only, not production code.
Map the design to the existing files:
- app/page.tsx
- components/site/Hero.tsx
- components/site/GradcamStory.tsx
- components/site/FeatureGrid.tsx
- components/site/TrustSection.tsx
- components/site/CtaBand.tsx
- app/styles.css

Call out any design details that cannot be implemented safely without new dependencies.
Keep medical language educational and non-diagnostic.
```

Why: this prevents a big copy-paste rewrite and lets you review the implementation path before code changes.

### Step 5: Ask Claude Code To Implement One Screen

After you approve the plan, paste:

```text
Implement the landing page using:

design/claude-design/landing-page
DESIGN_TO_CODE_MAP.md

Preserve the existing Next.js architecture.
Use the existing components/site files unless a new component is clearly needed.
Do not paste exported Claude Design HTML directly into production.
Use generated images from public/art and public/brand only when they match the design.
Keep patient/doctor/admin/research surfaces separate.
Keep copy safe: educational, not diagnosis, no cancer-detection claims, no treatment advice.
Run npm run type-check and npm run build when done.
```

### Step 6: Repeat For The Next Screen

Use one folder per screen:

```text
design\claude-design\patient-dashboard
design\claude-design\upload-analysis
design\claude-design\gradcam-viewer
design\claude-design\body-map
design\claude-design\consent-center
design\claude-design\doctor-dashboard
design\claude-design\admin-dashboard
```

Then use the mapping table below to find the correct route and component files.

---

## Screen-to-Code Mapping

The preferred app organization uses Next.js route groups. Folder names in parentheses do not appear in the URL, but they keep the repo easy to understand:

```text
app/(patient)/dashboard/page.tsx  -> /dashboard
app/(doctor)/dashboard/page.tsx   -> /doctor
app/(admin)/dashboard/page.tsx    -> /admin
app/(research)/dashboard/page.tsx -> /research
app/(ops)/ops/page.tsx            -> /ops
```

| Screen | Preferred Next.js Route | Key Component(s) | API Contract | State Machine |
|---|---|---|---|---|
| Landing page | `app/page.tsx` | `components/site/Hero.tsx`, `components/site/GradcamStory.tsx`, `components/site/FeatureGrid.tsx`, `components/site/TrustSection.tsx`, `components/site/CtaBand.tsx` | none | - |
| Patient dashboard | `app/(patient)/dashboard/page.tsx` | `components/app/ClinicalAppShell.tsx` | `GET /api/v1/patient/cases` | account_status |
| Upload + prediction | `app/(patient)/analyze/page.tsx` | `components/app/MockAnalyzeFlow.tsx`; later split into `components/patient/ImageUploader.tsx` and `components/patient/PredictionResult.tsx` | `POST /api/v1/analysis` | upload -> analyzing -> result |
| Grad-CAM viewer | `app/(patient)/analyze/[case_id]/page.tsx` | later `components/patient/HeatmapViewer.tsx` | `GET /api/v1/analysis/{id}/explanation` | loading -> loaded -> error |
| LLM explanation | `app/(patient)/analyze/[case_id]/explain/page.tsx` | later `components/patient/AiExplanation.tsx` | `POST /api/v1/explain-llm/{id}` | generating -> safe -> blocked |
| 2D body map | `app/(patient)/body-map/page.tsx` | `components/body-map/BodyMap2D.tsx` | `POST /api/v1/lesions/{id}/location` | selecting -> confirming |
| 3D body map | `app/(patient)/body-map/3d/page.tsx` | later `components/body-map/BodyMap3D.tsx` (Three.js only if needed) | same as 2D | loading -> interactive -> fallback |
| Lesion profiles | `app/(patient)/lesions/page.tsx` | `components/app/ClinicalAppShell.tsx` | `GET /api/v1/lesions` | loading -> empty -> loaded -> error |
| Lesion detail | `app/(patient)/lesions/[lesionId]/page.tsx` | route page now; later `components/patient/LesionSummary.tsx` | `GET /api/v1/lesions/{id}` | loading -> loaded -> error |
| Lesion history timeline | `app/(patient)/lesions/[id]/history/page.tsx` | later `components/patient/LesionTimeline.tsx` | `GET /api/v1/lesions/{id}/timeline` | - |
| Consent center | `app/(patient)/privacy/page.tsx` | later `components/patient/ConsentCenter.tsx`, `components/patient/StorageModePicker.tsx` | `GET/PATCH /api/v1/consent` | consented -> withdrawn -> deletion_requested |
| Lab results | `app/(patient)/lab-results/page.tsx` | `components/lab-results/LabResultUpload.tsx`, `components/lab-results/LabResultList.tsx` | `POST /api/v1/lab-results` | uploaded -> reviewed -> rejected |
| Reports | `app/(patient)/reports/page.tsx` | route page now; later `components/patient/ReportBuilder.tsx` | `POST /api/v1/reports` | draft -> ready -> exported |
| Reminders | `app/(patient)/reminders/page.tsx` | route page now; later `components/patient/ReminderList.tsx` | `GET/PATCH /api/v1/reminders` | due -> scheduled -> completed |
| Patient education | `app/(patient)/education/page.tsx` | public education pages now; later `components/agents/PatientEducationChat.tsx` | `POST /api/v1/agents/education/chat` | idle -> streaming -> done |
| Doctor dashboard | `app/(doctor)/dashboard/page.tsx` | `components/doctor/DoctorCaseQueue.tsx` | `GET /api/v1/doctor/cases` | - |
| Doctor case review | `app/(doctor)/cases/[id]/page.tsx` | later `components/doctor/CaseReview.tsx`, `components/doctor/OpinionForm.tsx` | `POST /api/v1/doctor-reviews` | pending -> validated -> corrected |
| Lab OCR review | `app/(doctor)/cases/[id]/lab/page.tsx` | later `components/doctor/LabOcrReview.tsx` | `GET/PATCH /api/v1/lab-results/{id}/ocr` | extracting -> review -> approved |
| Doctor workflow chat | inside `app/(doctor)/cases/[id]/page.tsx` | later `components/agents/DoctorWorkflowChat.tsx` | `POST /api/v1/agents/doctor/chat` | case-scoped |
| Admin dashboard | `app/(admin)/dashboard/page.tsx` | `components/admin/AdminReviewDashboard.tsx` | `GET /api/v1/admin/users` | - |
| Admin market research | `app/(admin)/market-research/page.tsx` | route page now; later `components/admin/MarketResearchRAG.tsx` | `POST /api/v1/agents/admin-market/chat` | admin-only |
| Admin market sources | `app/(admin)/market-research/sources/page.tsx` | route page now; later `components/admin/MarketResearchSources.tsx` | `GET /api/v1/admin/market-research/sources` | pending -> approved -> rejected |
| Admin market brief | `app/(admin)/market-research/briefs/[briefId]/page.tsx` | route page now; later `components/admin/MarketResearchBrief.tsx` | `GET /api/v1/admin/market-research/briefs/{id}` | draft -> approved |
| Agentic XAI roles | `app/(admin)/agents/page.tsx` | route page now; later `components/agents/*` | role-scoped agent APIs | role-scoped |
| Embedded analytics shell | `app/(admin)/analytics/page.tsx` | route page now; later `components/admin/AnalyticsShell.tsx` | internal analytics API | role-aware |
| Research dashboard | `app/(research)/dashboard/page.tsx` | `components/research/ResearchDatasetPanel.tsx`, `components/research/ActiveLearningPanel.tsx` | `GET /api/v1/research/metrics` | loading -> loaded -> error |
| Operator boards | `app/(ops)/ops/page.tsx` | route page now; later `components/ops/*` | ops APIs | operator-only |
| Cloud cost control | `app/(admin)/cloud/page.tsx` | later `components/admin/CloudEnvironmentCard.tsx` | `POST /api/v1/admin/cloud/{env}/{action}` | dev/staging/prod x running/paused/down |
| DLQ inspector | `app/(ops)/cloud/dlq/page.tsx` | later `components/ops/DLQInspector.tsx` | `GET /api/v1/admin/dlq` | operator-only |
| Circuit breaker banner | `components/layout/DegradedModeBanner.tsx` | global layout | `GET /api/v1/health/circuits` | all-clear / degraded / down |

---
## New Screen File Paths

Create these directories and route files when you start building each screen.

```text
app/(patient)/privacy/page.tsx
app/(patient)/lesions/[id]/history/page.tsx
app/(patient)/education/page.tsx
app/(doctor)/cases/[id]/lab/page.tsx
components/agents/PatientEducationChat.tsx
components/agents/DoctorWorkflowChat.tsx
components/patient/ConsentCenter.tsx
components/patient/LesionTimeline.tsx
components/doctor/LabOcrReview.tsx
components/layout/DegradedModeBanner.tsx
```

---

## Telling Claude Code to Implement

If you want a plan first (recommended):

```text
Read the design references in design/claude-design/ and DESIGN_TO_CODE_MAP.md.
Create an implementation plan for [screen name].
Do not implement anything yet.
Treat any exported HTML as visual reference only, not production code.
```

If you are ready to build:

```text
Use the design references in design/claude-design/ and implement [screen name]
using the route and component paths in DESIGN_TO_CODE_MAP.md.
Treat exported HTML as visual reference only.
Preserve the existing Next.js architecture, routing, and component boundaries.
Run npm run type-check and npm run build when done.
```

---

## Implementation Rules

Follow these every time you implement a screen.

- Read the design files and screenshots in `design/claude-design/` first.
- Check `package.json` before adding any new dependency.
- Keep admin market research RAG separate from clinical, doctor, and research/fairness indexes.
- Add `gsap` only when there is a clear animation requirement that the existing patterns cannot handle.
- Add Three.js or React Three Fiber only if real interactive 3D body mapping is required - implement 2D mapping first.
- Use generated HTML/CSS only as visual reference, not production code.
- Preserve existing Next.js architecture, routing, styling conventions, and component boundaries.
- Keep the original image, heatmap, overlay, and comparison UX clear.
- Keep privacy modes, consent, retention, and deletion request flows visible in the UI.
- Keep lab-result upload and doctor-review status separate from any AI diagnosis framing.
- Keep medical copy safe - no diagnosis, no cancer-detection, no treatment claims.
- Keep market research copy admin-only; never show it in patient or doctor workflows.
- Run `npm run type-check` and `npm run build` when done.

---

## What NOT to Do During Implementation

- Do not install animation or 3D libraries unless the design requires them.
- Do not replace `app/page.tsx` until the landing page design is approved.
- Do not treat exported design HTML as production-ready code.
- Do not implement auth, subscriptions, or admin CRUD before the relevant screen design is approved.
- Do not move research notebooks or training files into this frontend repo.
- Do not expose cloud secrets, database URLs, raw image URLs, or lab file URLs in any screen.
- Do not design Power BI as the patient/customer dashboard.

---

## Handoff Checklist

Complete all of these before starting implementation.

## Implemented In The App

These Claude-design references have now been ported into real Next.js route code.

Run commands from:

```powershell
cd C:\Users\saiyu\Desktop\projects\KI_projects\Skin_Lesion_GRADCAM_Classification\Skin_Lesion_Classification_frontend
```

Check command:

```powershell
npm run type-check
npm run build
```

Expected result:

```text
type-check passes
next build compiles and generates all routes
```

Preferred grouped file paths:

- Landing page: `app/page.tsx`
- Patient dashboard: `app/(patient)/dashboard/page.tsx`
- Analyze/upload flow: `app/(patient)/analyze/page.tsx`, `components/app/MockAnalyzeFlow.tsx`
- Shared clinical app shell: `components/app/ClinicalAppShell.tsx`
- 2D body map: `app/(patient)/body-map/page.tsx`, `components/body-map/BodyMap2D.tsx`
- Doctor queue: `app/(doctor)/dashboard/page.tsx`, `components/doctor/DoctorCaseQueue.tsx`
- Admin operations: `app/(admin)/dashboard/page.tsx`, `components/admin/AdminReviewDashboard.tsx`
- Lesion profiles: `app/(patient)/lesions/page.tsx`
- Lesion detail: `app/(patient)/lesions/[lesionId]/page.tsx`
- Reports: `app/(patient)/reports/page.tsx`
- Reminders: `app/(patient)/reminders/page.tsx`
- Lab results: `app/(patient)/lab-results/page.tsx`, `components/lab-results/LabResultUpload.tsx`, `components/lab-results/LabResultList.tsx`
- Research dashboard: `app/(research)/dashboard/page.tsx`, `components/research/ResearchDatasetPanel.tsx`, `components/research/ActiveLearningPanel.tsx`
- Education details: `app/(patient)/education/ai-limitations/page.tsx`, `app/(patient)/education/how-to-take-skin-lesion-photo/page.tsx`, `app/(patient)/education/what-is-gradcam/page.tsx`
- Admin market research: `app/(admin)/market-research/page.tsx`, `app/(admin)/market-research/sources/page.tsx`, `app/(admin)/market-research/briefs/[briefId]/page.tsx`
- Agentic XAI role surfaces: `app/(admin)/agents/page.tsx`
- Embedded analytics and lesion timeline surface: `app/(admin)/analytics/page.tsx`
- Operator reliability surfaces: `app/(ops)/ops/page.tsx`
- Shared styling: `app/styles.css`

Current local implementation note:

Some route files may still exist in flat folders such as `app/dashboard/page.tsx`.
That works in Next.js, but the preferred final organization is the grouped layout above.
Move routes with `git mv` when you are ready to reorganize code folders.

Verified routes:

- `/`
- `/dashboard`
- `/analyze`
- `/body-map`
- `/doctor`
- `/admin`
- `/agents`
- `/analytics`
- `/ops`
- `/lesions`
- `/lesions/demo`
- `/reports`
- `/reminders`
- `/lab-results`
- `/research`
- `/education`
- `/education/ai-limitations`
- `/education/how-to-take-skin-lesion-photo`
- `/education/what-is-gradcam`
- `/admin/market-research`
- `/admin/market-research/sources`
- `/admin/market-research/briefs/demo`

Why this choice was made:

The exported Claude HTML stays preserved in `design/claude-design/` as reference material, while the production app uses normal Next.js routes and reusable React components. This makes the screens easier to maintain, test, and connect to the backend later.

**Core screens**
- [ ] Master Clinical Premium visual direction approved
- [ ] Landing page desktop and mobile designs saved
- [ ] Patient dashboard design saved
- [ ] 2D body map design saved
- [ ] Doctor dashboard design saved
- [ ] Administrator dashboard design saved

**New screens (added 2026-05-13)**
- [ ] Agentic XAI Chat - all 4 role-scoped surfaces (patient, doctor, research, admin)
- [ ] Consent Management Center - full-screen privacy control
- [ ] Lesion History Timeline - per-lesion chronological event stream
- [ ] Lab OCR Result Review - doctor OCR field review
- [ ] Dead-letter queue inspector (operator surface)
- [ ] Circuit breaker degraded-mode banner (patient-facing + operator variants)
- [ ] Model drift dashboard (research + admin)

**State coverage**
- [ ] Loading, empty, error, approval, suspended, expired, success states shown
- [ ] Medical safety states: retake image, not enough information, professional review recommended
- [ ] Privacy states: consent withdrawn, deletion requested, storage mode shown

**Quality gate**
- [ ] No sci-fi medical fantasy, generic AI dashboard, decorative anatomy, or patient-facing Power BI
- [ ] Design files placed under `design/claude-design/`
- [ ] Handoff message clearly states plan-only or implement
- [ ] Design-to-code mapping table above reviewed against approved screens
