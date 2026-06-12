# Frontend — Start Here

This is the navigation hub for the Skin Lesion XAI frontend. Open this file first whenever you sit down to work. Everything else branches from here.

---

## Which file do I open first? (the short answer)

**For design work:** open `CLAUDE_DESIGN_PROMPTS.md` and follow Steps 1 through 8 in order.

**For coding:** open `DESIGN_TO_CODE_MAP.md` to find the route, component, and API for the screen you are building. Then use `BUILD_FRONTEND.md` for the step-by-step code walkthrough.

---

## The complete file sequence — open them in this order

| # | Open this file | When | What you do inside |
|---|---|---|---|
| 1 | `CLAUDE_DESIGN_PROMPTS.md` | **Start here** | Steps 1–4 only. Sets up foundations, screen map, and the Design System. Stop after Step 4. |
| 2 | `GENERATE_SCREENS.md` | **After Design System is set up** | All 14 screen prompts in order, each ready to copy and paste into Claude Design. Follow top to bottom. |
| 3 | `ADDITIONAL_SCREEN_PROMPTS.md` | After all 14 screens in the above file | Extended prompts for operator surfaces, 3D body map, agent chat UIs, Power BI shell, and more. |
| 4 | `CHATGPT_IMAGE_PROMPTS.md` | After all screens are designed | Generate hero images, icons, and illustrations. |
| 5 | `IMAGE_TO_ANIMATION_GUIDE.md` | After generating images | Turn stills into video loops, Lottie animations, and motion. |
| 6 | `BUILD_FRONTEND.md` | When you start writing code | Step-by-step Next.js build guide from scratch. |
| 7 | `DESIGN_TO_CODE_MAP.md` | Every time you implement a screen | Maps each screen to its Next.js route, component file, and API contract. |

---

## What each file does — one sentence each

- **`CLAUDE_DESIGN_PROMPTS.md`** — the master design playbook: foundations, screen mapping, Design System setup, and all core screen prompts (auth, landing, dashboard, upload, heatmap, body map, consent, doctor, admin, research).
- **`ADDITIONAL_SCREEN_PROMPTS.md`** — extra screen prompts not in the master file: DLQ inspector, circuit breaker banners, model drift dashboard, SLO board, 3D body map, agent chat UIs, Power BI analytics shell, lesion timeline, lab OCR review.
- **`CHATGPT_IMAGE_PROMPTS.md`** — copy-paste prompts for generating all brand imagery in ChatGPT image generation.
- **`IMAGE_TO_ANIMATION_GUIDE.md`** — how to turn ChatGPT stills into hero video loops (Seedance/Higgsfield), Lottie animations, and code-driven motion.
- **`BUILD_FRONTEND.md`** — beginner-friendly Next.js walkthrough, every command explained.
- **`DESIGN_TO_CODE_MAP.md`** — the lookup table: screen name → Next.js route → component files → API contract. Also has the implementation checklist.

---

## What the steps in `CLAUDE_DESIGN_PROMPTS.md` do

All eight steps are in the correct order. Follow them top to bottom — do not skip or reorder.

| Step | What happens | Tool |
|---|---|---|
| Step 1 | Understand which tool does what | Read only |
| Step 2 | Create four foundation docs: brief, grid, accessibility, microcopy | Regular Claude chat |
| Step 3 | Map every screen and user journey | Regular Claude chat |
| Step 4 | Build the Design System (brand kit) — done exactly once | Claude Design canvas |
| Step 5 | Learn the per-screen generation method | Read + regular chat |
| Step 6 | Generate every screen using the Step 5 method | Claude Design canvas |
| Step 7 | Add cinematic animation to the landing page | Bolt.new / Claude Code |
| Step 8 | Review, iterate, and hand off to code | — |

Steps 2 and 3 use only regular Claude chat — no Design sessions spent.
Step 4 is the first time you open the Claude Design canvas.
Steps 5 and 6 are where all the screens get drawn.

---

## Repo boundaries

- Backend API and ML serving: `../Skin_Lesion_Classification_backend`
- Research notebooks and paper outputs: `../Skin_Lesion_XAI_research`
- Architecture and Terraform: the parent repo
- Design reference files (save outputs here): `design/claude-design/`
- Raw imagery before optimization: `design/source-art/`

Do not add notebooks, model checkpoints, or research outputs to this folder.

---

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

---

## Implementation rules (for when you are writing code)

- Preserve the Clinical Premium aesthetic: off-black/charcoal/white surfaces, one restrained accent, semantic status colors
- Keep medical safety language throughout: educational AI support, not diagnosis
- Include all required states for every screen: loading, empty, error, success, and the medical-specific states
- Read `docs/03_DOMAIN_PRIMER.md` for correct clinical framing and terminology
- Read `docs/04_GRADCAM_CLINICAL_INTERPRETATION.md` for heatmap interpretation copy
- Keep role-based surfaces (patient, doctor, admin, research) strictly separated — never mix their data
- Run `npm run type-check` and `npm run build` after every implementation
