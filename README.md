# Skin Lesion Classification Frontend

Next.js web frontend for the Skin Lesion Classification platform.

This repo owns browser-facing UI only: image upload/capture guidance, prediction display, original-vs-heatmap comparison, AI explanation/chat, consent, doctor review, and admin workflows. Research notebooks and training outputs belong in `../Skin_Lesion_XAI_research`.

## Repo Boundaries

| Repo | Responsibility |
| --- | --- |
| `Skin_Lesion_Classification_frontend` | Next.js app, UI components, API client, frontend tests, Vercel deployment |
| `Skin_Lesion_Classification_backend` | FastAPI inference and explainability API |
| `Skin_Lesion_XAI_research` | HAM10000 notebooks, RQ1-RQ6 experiments, metrics, figures, and training helpers |
| `Skin_Lesion_GRADCAM_Classification` | Workspace-level docs, Terraform, and build roadmap |

## Current State

This repo is now an implemented Next.js frontend with the public landing page, patient-facing screens, doctor/admin/research surfaces, generated design assets, and Claude Design handoff material. It should still not contain research notebooks, generated research outputs, Python training scripts, or notebook dependency files. Keep those in `../Skin_Lesion_XAI_research`.

Notebook kernels are not configured from this repo. Use `../Skin_Lesion_XAI_research` and run `make register-kernel` there.

## Local Development

```bash
npm install
npm run dev
```

Create `.env.local` when the backend API exists:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Build And Check

```bash
npm run type-check
npm run build
```

The current `lint` script uses `next lint` and is not configured yet; it may open an interactive ESLint setup prompt. Use `npm run type-check` and `npm run build` as the reliable checks until ESLint is configured.

## Implemented And Planned App Surface

- Implemented locally: landing page, patient dashboard, analyze flow, 2D body map, lesion list/detail, lab results, reports, reminders, education pages, doctor queue, admin dashboard, market research, research dashboard, agent overview, analytics shell, and operator boards.
- Planned backend integration: real prediction, Grad-CAM explanation, LLM explanation, doctor review, consent persistence, reminders, market research RAG, and operator APIs.
- Planned deeper UI work: 3D body mapping, full case review detail, lab OCR review, patient/doctor chat, degraded-mode banners, cloud cost controls, and mobile capture companion flow.
- Internal analytics stays admin/doctor/research/operator-only. Patient/customer dashboards stay native in Next.js.

## Core Analysis UX

The first real product screen should support:

```text
[Original] [Heatmap] [Overlay] [Compare]

Prediction summary
Image quality checklist
AI explanation panel

Suggested questions:
- What does the heatmap mean?
- Why is the model uncertain?
- Should I see a doctor?
```

The frontend should always keep the original image visible or one click away. Heatmaps and LLM explanations are supporting evidence, not replacements for the original image.

## Image Quality UX

When the backend flags image-quality issues, show specific guidance:

- take the photo in brighter indirect light
- hold the camera steady
- tap to focus on the lesion
- center the lesion with surrounding skin visible
- avoid flash glare
- use a higher-quality camera or original upload if available

For poor images, show:

```text
[Retake Photo] [Proceed Anyway]
```

If the user proceeds anyway, clearly mark the prediction and heatmap as less reliable.

## LLM Explanation UX

The LLM panel should offer simple explanation, technical explanation, doctor-style summary, suggested questions, and free-text follow-up.

The UI should never present the LLM as a doctor. Use language such as "AI explanation" or "model explanation", not "diagnosis".

Agentic XAI can be exposed later in the sequence as an expert-panel mode, but it must still be framed as AI model explanation. The UI should show agent disagreement and limitations without implying a clinical verdict.

## Scale-Friendly UI Rules

- Use cursor pagination for doctor/admin queues.
- Do not load hundreds of images or heatmaps at once.
- Show async pending, completed, failed, and retry states for prediction, heatmap, LLM, and CrewAI jobs.
- Keep the original image available when showing heatmaps or explanations.

## Design, Visuals & Motion Workflow

Before writing component code, design the screens. The design guides are one ordered pipeline, not separate options — **Claude Design is the primary tool** and the other guides feed it or build on its output. Follow them in this order:

1. **[`CLAUDE_DESIGN_PROMPTS.md`](CLAUDE_DESIGN_PROMPTS.md)** — the master playbook. Start here. Locks the brand brief, grid, accessibility, and microcopy; builds the Design System; gives the full prompt library for every core screen in Claude Design.
2. **[`ADDITIONAL_SCREEN_PROMPTS.md`](ADDITIONAL_SCREEN_PROMPTS.md)** — extended screen prompts for screens not in the master playbook: operator surfaces (DLQ, circuit breakers, model drift, SLO board), agent chat UIs, 3D body map, Power BI analytics shell, and more.
3. **[`CHATGPT_IMAGE_PROMPTS.md`](CHATGPT_IMAGE_PROMPTS.md)** — generate the still brand imagery (hero, icons, illustrations, posters) your screens reference.
4. **[`IMAGE_TO_ANIMATION_GUIDE.md`](IMAGE_TO_ANIMATION_GUIDE.md)** — turn stills into motion: hero video loops via Seedance, Lottie micro-animations, and code-driven motion.
5. **[`DESIGN_TO_CODE_MAP.md`](DESIGN_TO_CODE_MAP.md)** — maps every designed screen to its Next.js route, key components, and API contracts. Use at implementation time.

Memory aid: **foundations → plan → Design System → screens (Claude Design) → imagery → motion → code.**

## Build Guide

Use [`BUILD_FRONTEND.md`](BUILD_FRONTEND.md) for the frontend walkthrough.

For production sequencing and cross-repo architecture, use:

- `../docs/local-dev/02_LOCAL_FRONTEND_AFTER_BACKEND.md`
- `../docs/local-dev/07_FRONTEND_WORKFLOW_HANDHOLDING.md`
- `../docs/product/03_PROFESSIONAL_FEATURE_SEQUENCE.md`
- `../docs/product/05_LESION_BODY_MAPPING_HANDHOLDING.md`
- `../docs/product/10_DOCTOR_ADMIN_REPORTS_HANDHOLDING.md`
- `../docs/product/12_RESEARCH_FAIRNESS_MONITORING_HANDHOLDING.md`
- `../docs/staging/19_POWERBI_EMBEDDED_ANALYTICS_HANDHOLDING.md`
- `../docs/staging/00_CLOUD_COST_CONTROL_HANDHOLDING.md`

Patient/customer dashboards stay native in Next.js. Power BI is only for internal analytics surfaces.
