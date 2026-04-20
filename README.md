# Skin Lesion XAI — Frontend

Next.js 14 frontend for an Explainable AI skin lesion analysis platform. Upload a dermoscopy image, get a malignant/benign prediction, and view Grad-CAM heatmaps showing which regions the model used to decide.

Part of a dual-purpose project: production web app + published research paper comparing XAI methods on HAM10000.

---

## What It Does

- Upload a skin lesion image (JPG/PNG/WEBP)
- Get AI classification: **Benign** or **Malignant** with confidence score
- View triple-panel XAI visualization: Original | Heatmap | Overlay
- Switch between CAM methods: Grad-CAM, Grad-CAM++, EigenCAM, LayerCAM
- Optionally contribute your image to the training pool (with explicit consent)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Deploy | Vercel |
| Backend | FastAPI (separate repo: `skin-lesion-backend`) |

---

## Repositories

| Repo | Purpose | Deploy |
|---|---|---|
| `skin-lesion-frontend` (this) | Next.js UI | Vercel |
| `skin-lesion-backend` | FastAPI + PyTorch ML + Terraform | Docker → AWS ECS Fargate |

---

## Quick Start

```bash
# Install
npm install

# Set backend URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run dev server
npm run dev
# → http://localhost:3000
```

Backend must be running at `localhost:8000`. See `skin-lesion-backend` repo to start it.

---

## Full Stack (Docker)

```bash
# From parent directory containing both repos
docker-compose up --build
# Frontend → localhost:3000
# Backend  → localhost:8000
```

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL | `http://localhost:8000` |

---

## API Contract

This frontend talks to three backend endpoints:

**POST /api/v1/predict** — upload image, returns diagnosis + confidence

**POST /api/v1/explain** — returns base64 heatmap images (original / heatmap / overlay)

**POST /api/v1/feedback** — submit consented image to retraining pool

Full API types in `lib/types.ts`.

---

## Model Update Pipeline

Users who consent have their images saved to an S3 feedback pool. A weekly automated job fine-tunes the model when enough new images accumulate. A human reviews the new model in MLflow before it goes live — nothing is promoted automatically.

```
User consents → S3 pool → weekly retrain → MLflow review → ECS deploy
```

---

## Research

This project investigates six research questions on HAM10000:

| RQ | Question |
|---|---|
| RQ1 | Which CAM variant (Grad-CAM vs Grad-CAM++ vs EigenCAM vs LayerCAM) best localizes lesion regions? |
| RQ2 | Do faithfulness metrics (insertion/deletion AUC) correlate with clinical trust? |
| RQ3 | Does backbone architecture (ResNet50 vs EfficientNet-B2 vs MobileNetV2) affect XAI quality independent of accuracy? |
| RQ4 | Does inter-method disagreement predict model misclassification? |
| RQ5 | How does Grad-CAM attention evolve during training epochs? |
| RQ6 | How do models trained on standard archives perform on geographically/demographically diverse populations? |

Research notebooks in `notebooks/`. All experiments tracked in MLflow. Paper figures generated from `ml/notebooks/`.

---

## Commands

```bash
npm run dev          # development server
npm run build        # production build
npm run type-check   # TypeScript check
npm run lint         # ESLint
npm test             # Jest tests
```

---

## Project Status

Work in progress — 2-week build timeline starting 2026-04-19.
