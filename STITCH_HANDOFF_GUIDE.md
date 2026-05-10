# Google Stitch Handoff Guide

This guide explains how to use Google Stitch for design planning only, then bring the finished design direction back into this frontend repo for later implementation.

The implementation source of truth remains this Next.js repo. Stitch output is reference only. Do not paste Stitch-generated code directly into `app/` or `components/` without a review, cleanup, dependency check, and architecture pass.

## 1. Open The Prompt Pack

Use [`GOOGLE_STITCH_PROMPTS.md`](GOOGLE_STITCH_PROMPTS.md) as the prompt source.

Start with the **Shared Clinical Premium Design Brief** and the **Master Design Prompt** first. These establish the revised direction:

- Clinical Premium, not sci-fi medical fantasy
- calm, trustworthy, privacy-aware healthcare UI
- workflow-first patient, doctor, administrator, and research surfaces
- safe medical language that frames the app as educational AI support, not diagnosis
- 2D and 3D body-location mapping as functional workflows
- lesion timeline and change tracking
- privacy modes, consent, retention, and report export
- lab-result upload and doctor-review status
- customer dashboard overview, lesion list, reminders, notifications, privacy center, and education
- research/model performance dashboards
- admin market research RAG, Golden Docs, source approval, and strategy decision briefs
- role-scoped agent surfaces for clinical/XAI, doctor workflow, customer education, research/fairness, and admin market research
- embedded Power BI analytics for internal admin/doctor/research/model monitoring, not patient dashboards
- cloud operations/cost-control screens for dev, staging, and production-style environments
- EKS main runtime path, Aurora DSQL planned cloud database target, and Aurora PostgreSQL fallback only

After the master direction looks right, generate each screen separately:

1. Landing page
2. Patient dashboard
3. Customer dashboard
4. Lab results
5. Doctor dashboard
6. Administrator dashboard
7. 2D body map and lesion timeline
8. 3D body map concept
9. React Native mobile 3D body map
10. Research/model performance dashboard
11. Admin market research RAG and strategy brief screen
12. Embedded Power BI analytics shell
13. Cloud operations and cost-control dashboard
14. Mobile capture concept
15. Role-based agent surfaces

## 2. Generate Screens In Google Stitch

For each screen, paste the matching prompt from `GOOGLE_STITCH_PROMPTS.md`.

Ask Stitch for both desktop and mobile versions. The final design should include:

- landing page with product-led workflow visuals, not organ spectacle
- patient dashboard with upload, analysis, Grad-CAM, timeline, reports, consent, and account status
- patient workflow with symptom questionnaire, image-quality retake assistant, safety triage, storage mode, and retention choices
- customer dashboard with lesions, body map, analyze flow, lab results, reminders, reports, privacy, notifications, and education
- lab result upload flow with PDF/image upload, test date, lab name, patient note, consent, and doctor review status
- 2D body map and 3D body map states for lesion pins
- React Native mobile 3D body map with 2D fallback, unsupported-device state, and patient-submitted location status
- doctor dashboard with case queue, heatmap review, expert opinion form, and review history
- administrator dashboard with full user, approval, subscription, case, form, settings, and audit controls
- admin market research RAG screen with Golden Docs, source review, multi-agent progress, evidence, citations, and decision briefs
- research dashboard with dataset quality, active learning, model performance, calibration, and fairness views
- role-based agent overview showing separated RAG indexes and permissions for clinical, doctor, customer, research, and admin market agents
- embedded Power BI analytics shell with role-aware report pages and privacy-safe data messaging
- cloud operations/cost-control dashboard with start, pause, resume, shutdown, Terraform plan, and prod confirmation states
- loading, empty, error, pending approval, suspended, expired, privacy, deletion, review, and success states where relevant

Iterate inside Stitch until the visual direction is stable. Focus on layout, spacing, colors, hierarchy, dashboard density, accessibility, and the overall product feel.

## 3. Export Or Save The Design

Preferred handoff files:

- `DESIGN.md` if Stitch offers a design-spec export
- screenshots for each screen
- Figma link if you export or copy the design into Figma
- HTML/CSS export only as a reference, not as production code

If Stitch gives multiple variants, save only the strongest version for each screen unless you want to compare options later.

Before saving the final handoff package, run this design review:

- [ ] No organ spectacle imagery.
- [ ] No decorative brain, spine, lungs, or heart visuals.
- [ ] Clinical Premium aesthetic is confirmed.
- [ ] Semantic status colors are used appropriately.
- [ ] Loading, empty, error, pending, suspended, expired, consent withdrawn, deletion requested, retake, and doctor-review states are represented.
- [ ] Safety language is visible in patient-facing medical copy.
- [ ] No unsafe medical or SEO claims appear as product claims.
- [ ] 2D body map is designed before interactive 3D.
- [ ] Power BI appears only as internal analytics, not as the patient/customer dashboard.

Reject or revise Stitch output if it looks like:

- sci-fi medical fantasy
- generic AI dashboard
- purple/blue gradient startup UI
- diagnosis or cancer-detection product
- decorative anatomy spectacle
- cluttered glass-card interface
- patient-facing Power BI dashboard

## 4. Put Files Into This Project

When you are ready to hand off the design, create this local folder:

```text
Skin_Lesion_Classification_frontend/design/stitch/
```

Recommended file names:

```text
design/stitch/DESIGN.md
design/stitch/landing-desktop.png
design/stitch/landing-mobile.png
design/stitch/patient-dashboard.png
design/stitch/body-map-2d.png
design/stitch/body-map-3d.png
design/stitch/doctor-dashboard.png
design/stitch/admin-dashboard.png
design/stitch/research-dashboard.png
design/stitch/admin-market-research.png
design/stitch/role-based-agents.png
design/stitch/mobile-capture.png
design/stitch/mobile-body-map-3d.png
design/stitch/lab-results.png
design/stitch/customer-dashboard.png
design/stitch/powerbi-analytics.png
design/stitch/cloud-cost-control.png
design/stitch/stitch-export.html
design/stitch/stitch-export.css
design/stitch/figma-link.txt
```

You do not need every file. At minimum, provide screenshots and either a design spec, Figma link, or exported HTML/CSS reference.

## 5. Handoff Message To Codex

If you want an implementation plan first, say:

```text
I added the Google Stitch reference files under Skin_Lesion_Classification_frontend/design/stitch. Read them and create an implementation plan first. Do not implement yet. Treat Stitch output as design reference only, not production-ready code.
```

If you are ready to build, say:

```text
Use the Google Stitch reference files under Skin_Lesion_Classification_frontend/design/stitch and implement the frontend in Next.js. Review any Stitch-generated code before using it, preserve the existing Next.js architecture, verify dependencies before adding animation or 3D libraries, implement 2D body mapping before interactive 3D, and run browser verification after implementation.
```

If you only have screenshots or a Figma link, attach or paste them and say:

```text
Use these Google Stitch references to plan the Next.js frontend. Do not implement yet. Treat the screenshots/Figma link as visual direction only and keep the implementation source of truth in this repo.
```

## 6. What Codex Should Do Later

When implementation starts, Codex should:

- read the Stitch files and screenshots
- review the design package against the Clinical Premium quality bar
- convert the approved design into real React and Next.js components
- check `package.json` before importing any third-party dependency
- keep admin market research RAG separate from clinical, doctor, customer, and research/fairness RAG indexes
- implement Golden Docs and source approval before using new market research sources in generated strategy briefs
- keep role-based agent surfaces explicit about allowed sources, blocked sources, approval state, and trace status
- add `gsap` only when there is a clear animation requirement that cannot be handled with existing project patterns
- add Three.js or React Three Fiber only if real interactive 3D body mapping is required
- use generated HTML/CSS only as a visual reference
- preserve existing Next.js architecture, routing, styling conventions, and component boundaries
- keep the original image, heatmap, overlay, and comparison UX clear
- implement 2D body mapping before wiring 3D interactions, while keeping both designs in the handoff
- keep mobile 3D body mapping aligned with the same backend body-location API as web 2D/3D maps
- include 2D fallback and unsupported-device states for mobile 3D body mapping
- keep privacy modes, consent, retention, and deletion request flows visible
- keep lab-result upload and doctor-review status separate from AI diagnosis claims
- include customer dashboard modules for tracked lesions, follow-ups, recent analysis, doctor review, next reminder, and lab status
- include image-quality retake states and "not enough information" states
- include doctor-facing summary, PDF report, admin audit, and research dashboard surfaces
- include a native shell for embedded Power BI internal analytics while keeping patient/customer dashboards native
- include a cloud operations/cost-control admin surface if the design package covers platform operations
- keep EKS, Aurora DSQL, Power BI secrets, and Terraform cost controls as operator/admin concepts, not patient-facing UI
- keep medical copy safe and avoid diagnosis, cancer-detection, treatment, guaranteed-detection, or clinician-replacement claims
- keep market research copy admin-only and avoid using market strategy docs in patient or doctor workflows
- build patient, doctor, and administrator screens as real app workflows
- build research/model dashboard screens when that build guide is reached
- run `npm run type-check` and `npm run build`
- use Playwright or available browser tooling where practical to verify desktop and mobile rendering, primary navigation, important interactions, empty/error/loading states, and absence of visual overlap

## 7. Do Not Do Yet

Do not do these during the design-only phase:

- do not install animation or 3D libraries
- do not replace `app/page.tsx`
- do not modify production frontend components
- do not commit raw Stitch code as production UI
- do not treat Stitch output as production-ready code
- do not implement authentication, subscriptions, CRUD, or admin workflows before the design is approved
- do not move research notebooks or training files into this frontend repo
- do not design Power BI as the patient/customer dashboard
- do not expose cloud secrets, database URLs, Power BI secrets, raw image URLs, lab file URLs, or free-text medical notes in analytics screens
- do not assume old Terraform module or Lambda folders exist; infrastructure is now taught through handholding guides
- do not treat 3D body mapping or mobile as omitted; keep them designed and sequenced even when implementation comes later

## Handoff Checklist

Before asking for implementation, confirm:

- [ ] The master Clinical Premium visual direction is approved.
- [ ] Landing page desktop and mobile designs are saved.
- [ ] Patient dashboard design is saved.
- [ ] Customer dashboard design is saved.
- [ ] Lab results upload/review design is saved.
- [ ] 2D body map design is saved.
- [ ] 3D body map design is saved.
- [ ] React Native mobile 3D body map design is saved.
- [ ] Doctor dashboard design is saved.
- [ ] Administrator dashboard design is saved.
- [ ] Research/model performance dashboard design is saved.
- [ ] Admin market research RAG design is saved.
- [ ] Role-based agent overview design is saved.
- [ ] Mobile capture concept is saved.
- [ ] Embedded Power BI analytics design is saved if internal analytics is in scope.
- [ ] Cloud cost-control/admin operations design is saved if platform operations is in scope.
- [ ] Important states are represented: loading, empty, error, approval, suspended, expired, success.
- [ ] Medical safety states are represented: retake image, not enough information, professional review recommended, urgent review recommended.
- [ ] Privacy states are represented: full clinical history, privacy balanced, maximum privacy, consent withdrawn, deletion requested.
- [ ] Design review rejects sci-fi medical fantasy, generic AI dashboard, purple/blue startup UI, decorative anatomy spectacle, and patient-facing Power BI.
- [ ] Design files are placed under `design/stitch/`.
- [ ] The handoff message clearly says whether to plan only or implement.
