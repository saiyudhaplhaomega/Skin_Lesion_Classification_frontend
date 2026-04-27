# Skin Lesion Classification Frontend

Next.js web frontend for the Skin Lesion Classification platform.

This repo owns browser-facing UI only: patient upload, prediction display, heatmap viewing, consent, doctor review, and admin workflows. Research notebooks and training outputs belong in `../Skin_Lesion_XAI_research`.

## Repo Boundaries

| Repo | Responsibility |
| --- | --- |
| `Skin_Lesion_Classification_frontend` | Next.js app, UI components, API client, frontend tests, Vercel deployment |
| `Skin_Lesion_Classification_backend` | FastAPI inference and explainability API |
| `Skin_Lesion_XAI_research` | HAM10000 notebooks, RQ1-RQ6 experiments, metrics, figures, and training helpers |
| `Skin_Lesion_GRADCAM_Classification` | Workspace-level docs, Terraform, and build roadmap |

## Current State

This repo is a clean Next.js scaffold for the web app. If old `notebooks/`, `train_backbones.py`, or `train_epoch_checkpoints.py` files appear in a local checkout, treat them as migration leftovers from before the research repo split. Do not use the frontend as the source of truth for research work.

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

- Patient upload flow
- Prediction result view with human-readable confidence
- Grad-CAM heatmap viewer
- Consent flow for research/training data
- Doctor review dashboard
- Admin approval and model management dashboard

## Build Guide

Use [`BUILD_FRONTEND.md`](BUILD_FRONTEND.md) for the frontend walkthrough.

For production sequencing and cross-repo architecture, use:

- `../docs/BUILD_PHASE_3_FRONTEND.md`
- `../docs/PRODUCTION_BUILD_REVIEW.md`
- `../docs/HOW_TO_BUILD.md`
