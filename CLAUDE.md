# CLAUDE.md

This repository contains the Next.js frontend for the Skin Lesion XAI platform.

## Repo Boundaries

- Backend API and ML serving live in `../Skin_Lesion_Classification_backend`.
- Research notebooks and paper outputs live in `../Skin_Lesion_XAI_research`.
- Architecture and Terraform live in the parent repo.
- Design reference files live in `design/stitch/` and `design/claude-design/`.

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
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Design

This project uses two design tools:

### Google Stitch (Visual Layout Exploration)

Use [`GOOGLE_STITCH_PROMPTS.md`](GOOGLE_STITCH_PROMPTS.md) for visual layout exploration in Google Stitch. Start with the **Shared Clinical Premium Design Brief** and **Master Design Prompt**, then generate screens individually.

See [`STITCH_HANDOFF_GUIDE.md`](STITCH_HANDOFF_GUIDE.md) for the full workflow: how to generate, review, export, and hand off from Stitch to implementation.

### Claude Design (HTML Prototypes)

Use [`CLAUDE_DESIGN_PROMPTS.md`](CLAUDE_DESIGN_PROMPTS.md) for generating HTML prototype designs via Claude Design (claude.design or claude.ai/code). Each prompt includes:
- Clinical Premium design brief
- Screen-specific requirements
- Required states (loading, empty, error, success)
- Explicit DO NOT exclusions

**Design workflow:**
1. Read `docs/03_DOMAIN_PRIMER.md` and `docs/04_GRADCAM_CLINICAL_INTERPRETATION.md` for clinical framing
2. Pick the relevant prompt from `CLAUDE_DESIGN_PROMPTS.md`
3. Generate in Claude Design
4. Save outputs under `design/claude-design/`
5. Cross-reference with Stitch prompts for additional layout variants
6. Implement via the design-to-code mapping in `STITCH_HANDOFF_GUIDE.md`

**Design output directories:**
- `design/stitch/` -- Google Stitch screenshots, Figma links, exported HTML/CSS references
- `design/claude-design/` -- Claude Design HTML prototypes and screenshots

## Design Authority

When implementing from design files:
- Preserve the Clinical Premium aesthetic: off-black/charcoal/white surfaces, one restrained accent, semantic status colors
- Keep medical safety language: educational AI support, not diagnosis
- Include all required states for each screen
- Reference `docs/03_DOMAIN_PRIMER.md` for the correct clinical framing and terminology
- Reference `docs/04_GRADCAM_CLINICAL_INTERPRETATION.md` for heatmap interpretation copy
- Keep role-based surfaces (patient, doctor, admin, research) strictly separated
- Run `npm run type-check` and `npm run build` after implementation
