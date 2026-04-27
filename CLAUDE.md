# CLAUDE.md

This repository contains the Next.js frontend for the Skin Lesion XAI platform.

## Repo Boundaries

- Backend API and ML serving live in `../Skin_Lesion_Classification_backend`.
- Research notebooks and paper outputs live in `../Skin_Lesion_XAI_research`.
- Architecture and Terraform live in the parent repo.

Do not add notebooks, model checkpoints, or research outputs here.

## Planned Frontend

- Patient upload and prediction flow
- Grad-CAM heatmap viewer
- Explicit consent flow
- Doctor review dashboard
- Admin approval and model management dashboard

## Commands

```bash
npm install
npm run dev
npm run build
npm run type-check
```

## Environment

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```
