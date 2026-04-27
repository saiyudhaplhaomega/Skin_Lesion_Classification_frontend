# Skin Lesion Classification Frontend

Next.js web frontend for the Skin Lesion XAI platform.

This repository is intentionally separate from:

- `Skin_Lesion_Classification_backend` - FastAPI and ML serving
- `Skin_Lesion_XAI_research` - HAM10000 notebooks, Grad-CAM experiments, figures, and research training scripts
- `Skin_Lesion_GRADCAM_Classification` - architecture docs and Terraform infrastructure

## Status

This frontend has been reset to a clean app scaffold. The previous notebooks and research outputs were moved to `../Skin_Lesion_XAI_research`.

## Local Development

```bash
npm install
npm run dev
```

Create `.env.local` when the backend API exists:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Planned App Surface

- Patient upload flow
- Prediction result view
- Grad-CAM heatmap viewer
- Consent flow for research/training data
- Doctor review dashboard
- Admin approval and model management dashboard
