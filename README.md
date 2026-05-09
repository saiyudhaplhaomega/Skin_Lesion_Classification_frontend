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

This repo is a clean Next.js scaffold for the web app. It should not contain research notebooks, generated research outputs, Python training scripts, or notebook dependency files. Keep those in `../Skin_Lesion_XAI_research`.

Notebook kernels are not configured from this repo. Use `../Skin_Lesion_XAI_research` and run `make register-kernel` there.

## Local Development

```bash
npm install
npm run dev
```

Create `.env.local` when the backend API exists:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Build And Check

```bash
npm run type-check
npm run build
```

The current `lint` script uses `next lint`, which has been deprecated in newer Next.js releases. Keep it only if the project still supports it, or replace it with an ESLint script during the frontend implementation pass.

## Planned App Surface

- Patient upload/camera flow with image-quality guidance
- Retake/proceed-anyway warning when image quality is poor
- Prediction result view with human-readable confidence and uncertainty
- Original, heatmap, overlay, and side-by-side comparison viewer
- Grad-CAM heatmap viewer with failed/zero-CAM states
- AI explanation panel grounded in prediction, heatmap, and safety policy
- Suggested follow-up question chips plus free-text chat
- Online explanation mode and local/offline fallback UX
- Agentic expert-panel explanation view after the core safe LLM/RAG workflow is stable
- Consent flow for research/training data
- Doctor review dashboard
- Admin approval and model management dashboard
- 2D and 3D body mapping
- Lesion history and change tracking
- Storage mode, retention, and deletion request flows
- Research/model performance dashboard
- Internal Power BI analytics shell for admin/doctor/research/model monitoring only
- Cloud operations/cost-control admin surface after staging/production guides introduce it
- Mobile capture companion flow after web/API contracts are stable

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

## Build Guide

Use [`BUILD_FRONTEND.md`](BUILD_FRONTEND.md) for the frontend walkthrough.

For production sequencing and cross-repo architecture, use:

- `../docs/local-dev/02_LOCAL_FRONTEND_AFTER_BACKEND.md`
- `../docs/local-dev/07_FRONTEND_WORKFLOW_HANDHOLDING.md`
- `../docs/product/01_PROFESSIONAL_FEATURE_SEQUENCE.md`
- `../docs/product/03_LESION_BODY_MAPPING_HANDHOLDING.md`
- `../docs/product/05_DOCTOR_ADMIN_REPORTS_HANDHOLDING.md`
- `../docs/product/06_RESEARCH_FAIRNESS_MONITORING_HANDHOLDING.md`
- `../docs/staging/12_POWERBI_EMBEDDED_ANALYTICS_HANDHOLDING.md`
- `../docs/staging/00_CLOUD_COST_CONTROL_HANDHOLDING.md`

Patient/customer dashboards stay native in Next.js. Power BI is only for internal analytics surfaces.
