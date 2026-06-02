# ChatGPT Image Prompts — Skin Lesion XAI (Web + Mobile Visual Assets)

> ## 📍 START HERE — this file is **Step 1 of 2** (do this one first)
> This is the **visuals doc set**. Read and use the two files in this order:
> 1. **`CHATGPT_IMAGE_PROMPTS.md`** ← *you are here* — **generate the still images first.** You can't animate or place an asset that doesn't exist yet.
> 2. **[`IMAGE_TO_ANIMATION_GUIDE.md`](IMAGE_TO_ANIMATION_GUIDE.md)** ← **do this second** — file placement (where each image goes), turning stills into animation, and wiring everything into the web + mobile UI.
>
> Both inherit the Clinical Premium design tone and screen specs from **[`CLAUDE_DESIGN_PROMPTS.md`](CLAUDE_DESIGN_PROMPTS.md)** (the overall website build playbook — read that first if you haven't, to know *which* screens need *which* assets).
>
> **Per-asset flow:** generate here → then jump to the animation guide's **§1 (place & prep)** → **§2–§5 (animate + integrate)**.

A copy-paste library of richly structured image-generation prompts for **ChatGPT image generation** (the "Create image" tool in ChatGPT, GPT-4o / Images). These produce the hero art, backgrounds, illustrations, icons, empty-states, app-store visuals, and marketing posters for the Skin Lesion XAI website and mobile app.

---

## ⚠️ Read first — medical-safety rules for every image

This is a regulated, educational, **non-diagnostic** health product. Every prompt below already follows these, and you must keep them when editing:

- **No realistic lesions, moles, rashes, wounds, or clinical skin close-ups.** Use abstract shapes, soft gradient "heat" motifs, and stylized geometry instead. Never generate anything that could be mistaken for a real diagnostic image.
- **No real patients, no recognizable faces tied to a condition, no "before/after" skin claims.** Models (if any) are healthy, neutral, lifestyle-only, never presented as patients.
- **No diagnosis / cancer / detection language baked into the art.** Allowed words on-image: *educational, explainable, privacy, monitoring, lesion history, doctor-reviewed.* Forbidden: *diagnose, melanoma, cancer, detection, cure, screening.*
- **Calm, not alarmist.** No red-alert aesthetics, no scary medical drama. Status red is reserved and minimal.
- **No decorative anatomy / organ spectacle, no purple→blue AI-gradient glow, no emoji icons, no generic "AI brain" clichés.**
- Keep a **gender-neutral, inclusive, accessible** feel. Represent a range of skin tones respectfully when people appear.

---

## How to use this file (with your ChatGPT subscription)

1. Open **ChatGPT**, start a chat, and make sure image generation is on (type "create an image" or use the image tool).
2. **Copy one prompt block** below (everything inside the triple backticks) and paste it in. Send.
3. **Set the aspect ratio** either by keeping the `Aspect ratio:` line in the prompt or by telling ChatGPT the ratio you want. Common ones here: `16:9` (desktop hero), `1:1` (icons/cards), `9:16` (mobile/splash), `4:5` (social poster).
4. **Iterate in the same chat** so it keeps context: *"same style, but remove the text and make the background lighter,"* *"give me a transparent-background version of just the icon,"* *"now make a matching set of 4."*
5. **Ask for variations** to build a coherent set: *"keep this exact style and color system, now design the empty-state illustration."* Consistency across assets comes from reusing the **Brand Visual DNA** block below in every prompt.
6. **Download** the result (hover → download) and **rename it immediately** to the filename suggested under each asset. Place the raw download in the **source tier** first: `frontend/design/source-art/web/` (or `/mobile/`). You only copy an *optimized* version into `public/brand/` or `mobile/assets/` later. The "Save as" path under each asset is the **final shipped** location — see [`IMAGE_TO_ANIMATION_GUIDE.md`](IMAGE_TO_ANIMATION_GUIDE.md) §1 for the full placement & handling rules (source vs shipped tiers, layer separation, optimization).
7. To animate it, go to [`IMAGE_TO_ANIMATION_GUIDE.md`](IMAGE_TO_ANIMATION_GUIDE.md) — §1 (placement/prep) then §2–§5 (animate + integrate).

> Tip: ChatGPT image generation renders text imperfectly. For anything where exact wording matters (headlines, feature labels), generate the art with **placeholder or no text** and add real text later in code/Figma. Prompts below mark where to do this.

---

## Brand Visual DNA (paste this into the top of any prompt for consistency)

Reusing this block is what makes 20 separate generations look like one product. Keep it identical every time.

```text
BRAND VISUAL DNA — Skin Lesion XAI (use consistently across all assets):
- Tone: Clinical Premium. Calm, trustworthy, private, precise, quietly high-end. Medical-grade, not flashy.
- Palette: light clinical surfaces (off-white #F7F9FB, soft mist #ECF1F5) and deep charcoal ink (#15202B) as the base. ONE restrained product accent: a calm teal-cyan (#1FB6B0). Semantic status colors used sparingly: calm green (#3FB66B), amber (#E0A23B), reserved blue (#3B82C4), minimal warning red (#D9534F) only for true warnings, neutral gray (#9AA7B2).
- Materials & light: soft diffused studio light, gentle long shadows, subtle frosted-glass and matte surfaces, fine grain, airy negative space. No harsh neon, no dark heavy backgrounds, no glossy plastic.
- Motif language: soft contour "topographic" lines, gentle gradient "attention/heat" fields (teal→amber, NEVER red-heavy), rounded geometric data shapes, abstract layered cards, light grid scaffolds.
- Strictly avoid: realistic skin/lesions, anatomy spectacle, purple-blue AI glow, emoji, glassmorphism overload, sci-fi HUD clutter, brain/circuit AI clichés, alarmist medical drama.
- Finish: ultra-clean, 8K crisp, editorial, accessible high contrast, premium product-marketing quality.
```

---

# Part 1 — Website (desktop) assets

## 1.1 Landing hero — key visual

```text
[Paste BRAND VISUAL DNA here]

Create a premium 16:9 desktop landing-page hero key visual for "Skin Lesion XAI", an educational, privacy-aware AI explainability platform for skin lesion history (NOT a diagnosis tool).

CORE IDEA:
"See why the AI looked there." A calm, trustworthy visualization of explainable AI — turning an abstract scan into a soft, readable map of attention.

COMPOSITION:
- Wide cinematic layout with generous negative space on the left for headline text to be added later (LEAVE THIS AREA CLEAN / NO TEXT).
- On the right, a floating abstract "explanation" object: a softly rounded, matte card or lens shape showing a gentle teal-to-amber gradient "attention field" (like a calm, stylized heatmap) overlaid on soft topographic contour lines. It must read as data/abstraction, NOT as skin or a body part.
- Light layered UI cards drifting behind it (a timeline strip, a soft privacy shield glyph, a small doctor-review checkmark badge) to hint at the product, kept abstract and minimal.

BACKGROUND:
Off-white clinical gradient (#F7F9FB to #ECF1F5), faint large-scale grid scaffold, a few soft floating particles, very subtle depth blur.

LIGHTING:
Soft diffused studio light from top-left, gentle long shadows, airy and clean.

COLOR SYSTEM:
Dominant light surfaces + charcoal accents, teal-cyan #1FB6B0 as the single accent, a whisper of amber in the attention field. No red. No purple glow.

MOOD:
Calm. Trustworthy. Precise. Premium. Reassuring.

OUTPUT:
Aspect ratio: 16:9. Ultra-clean, 8K, editorial product-marketing quality. NO text in the image.
```
- **Save as:** `public/brand/hero-keyvisual.png`
- **Animate:** subtle parallax + the attention field breathing/shifting (see animation guide §2).

## 1.2 Animated hero background (still frame for looping motion)

```text
[Paste BRAND VISUAL DNA here]

Create a 16:9 abstract background plate designed to be subtly animated as a looping website hero background for Skin Lesion XAI.

CORE IDEA:
A calm "field of understanding" — slow-moving soft gradient mesh with faint topographic contour lines and drifting light particles.

COMPOSITION:
- Edge-to-edge abstract field, NO focal object, NO text, even visual weight so text can sit on top.
- Soft gradient mesh blending off-white, mist, and gentle teal, with a faint amber warmth in one corner.
- Overlay very subtle topographic contour lines and a faint grid, plus sparse slow-floating particles.
- Keep the center slightly calmer/lighter for text legibility.

LIGHTING & FINISH:
Diffused, glowy but soft (no neon), fine grain, premium and airy.

COLOR SYSTEM:
Light clinical base + teal #1FB6B0 accent, minimal amber. No red, no purple.

MOOD:
Meditative, clean, high-end, non-distracting.

OUTPUT:
Aspect ratio: 16:9. Seamless, evenly-lit, made to loop. No text, no hard focal point.
```
- **Save as:** `public/brand/hero-bg-plate.png`
- **Animate:** ideal source for an image-to-video loop or animated gradient mesh (animation guide §2 & §3).
- **🔁 Loop tip (for Seedance / Kling):** this plate becomes a seamless hero loop if you feed the *same* image into both the **start frame and end frame** of the video tool. So generate it **clean, edge-to-edge, high-res (≥1920px wide), evenly lit, with no hard focal point** — exactly as the prompt asks — and you'll get a calm loop with almost no editing. Walkthrough: animation guide **§2.5 (Higgsfield → Seedance)**.

## 1.3 "How it works" — 4-step illustration set

Generate as one consistent set so the four icons match.

```text
[Paste BRAND VISUAL DNA here]

Create a set of 4 matching spot illustrations on a transparent background for a "How it works" section. Consistent line weight, same rounded geometric style, same palette. Each is a self-contained square tile.

THE 4 STEPS (abstract, non-diagnostic):
1. UPLOAD — a soft rounded image/photo card lifting upward into a gentle dashed frame, small camera glyph; conveys "add an image".
2. AI EXPLANATION — an abstract lens/processing shape with calm concentric rings and a small spark, conveys "the model considers the image". No brain, no circuits.
3. GRAD-CAM HEATMAP — a soft card with a gentle teal-to-amber attention gradient over faint contour lines (NOT skin), conveys "see where it looked".
4. DOCTOR REVIEW — a clean clipboard/check shield with a subtle stethoscope-curve accent, conveys "a professional reviews it".

STYLE:
Modern flat-with-soft-depth, rounded corners, 2–3px consistent strokes, gentle inner shadows, teal accent, charcoal linework, light fills. Friendly, premium, medical-grade clarity.

OUTPUT:
4 separate square (1:1) icons, transparent background, no text labels (added in code). Deliver as a neat 2x2 set in one image AND describe each so I can request them individually.
```
- **Save as:** `public/brand/howitworks-{upload,explain,heatmap,review}.png`
- **Animate:** Lottie micro-animations on scroll (animation guide §4).

## 1.4 Feature spot illustrations (timeline / body map / privacy / consent)

```text
[Paste BRAND VISUAL DNA here]

Create 4 matching feature illustrations, transparent background, same style and palette, each ~4:3.

1. LESION TIMELINE — an abstract horizontal timeline of soft rounded image-cards getting a small "tracked over time" arc and date ticks. No real skin; cards show neutral gradient swatches.
2. BODY MAP — a calm, gender-neutral, abstract human silhouette (simple rounded form, NON-graphic, no facial detail, no nudity) with a few soft numbered location pins. Clinical and respectful.
3. PRIVACY MODES — a soft layered shield with a dial/slider showing three calm states (full / balanced / maximum), a subtle lock glyph.
4. CONSENT CONTROL — clean toggle switches and a document with a check, conveying patient control and transparency.

STYLE:
Rounded geometric, soft depth, teal accent, charcoal lines, light fills, premium clarity. No alarmist tones.

OUTPUT:
4 separate illustrations, transparent background, no body-text. 4:3 each.
```
- **Save as:** `public/brand/feature-{timeline,bodymap,privacy,consent}.png`

## 1.5 Grad-CAM abstract explainer visual (non-diagnostic)

```text
[Paste BRAND VISUAL DNA here]

Create a 16:9 abstract explainer visual for "explainable AI heatmaps" — strictly abstract, NOT a medical/skin image.

COMPOSITION:
- A soft rounded card split into two gentle states: left = a neutral abstract textured swatch (soft contour pattern, NOT skin); right = the same swatch with a calm teal-to-amber attention gradient softly highlighting one rounded region.
- A subtle slider/opacity control glyph between them to imply "blend the overlay".
- A small honesty caption ZONE left blank for text added later (e.g. "if attention falls outside the region, the result may be unreliable").

STYLE & COLOR:
Clinical Premium, soft studio light, teal accent, restrained amber, charcoal type zones, NO red dominance, NO realistic tissue.

MOOD:
Honest, educational, calm, trustworthy.

OUTPUT:
Aspect ratio 16:9, clean, no final text (placeholder zones only).
```
- **Save as:** `public/brand/gradcam-explainer.png`

## 1.6 Neutral body-map silhouettes (front / back) — UI asset

```text
[Paste BRAND VISUAL DNA here]

Create a clean pair of gender-neutral human body silhouettes (front view and back view) for an interactive medical body-map UI.

REQUIREMENTS:
- Simple, abstract, rounded anatomical silhouette. NON-graphic, NO facial features, NO nipples/genitalia, NO realistic skin texture — a smooth neutral form only.
- Soft mist fill (#ECF1F5) with a thin charcoal contour outline and a subtle inner shadow.
- Calm, respectful, inclusive, medical-diagram quality.
- Even flat lighting, front-on, centered, generous margin, transparent background.

OUTPUT:
Two separate vertical (9:16-ish) figures, front and back, transparent background, no text, no pins (pins added in code).
```
- **Save as:** `public/brand/bodymap-front.svg`-style PNG + `bodymap-back.png` (ask ChatGPT for clean flat fills so it can be traced to SVG later).

## 1.7 Empty-state illustrations

```text
[Paste BRAND VISUAL DNA here]

Create a set of 3 matching empty-state illustrations, transparent background, gentle and encouraging (never sad), same style/palette, ~1:1.

1. NO LESIONS YET — a soft empty image-card with a friendly dashed "add" frame and a small upward arc; conveys "start your history".
2. ALL CAUGHT UP — a calm checkmark inside soft concentric rings with a couple of light particles; reassuring.
3. NO NOTIFICATIONS — a soft bell glyph at rest with a tiny "z" or quiet dot; peaceful, not dead.

STYLE:
Rounded geometric, soft depth, teal accent, light fills, premium. Warm and reassuring tone.

OUTPUT:
3 separate 1:1 illustrations, transparent background, no text.
```
- **Save as:** `public/brand/empty-{lesions,caughtup,notifications}.png`

## 1.8 Trust / privacy iconography set

```text
[Paste BRAND VISUAL DNA here]

Create a cohesive set of 8 line+soft-fill icons on transparent background, consistent 2px stroke, rounded, teal accent, for trust signals:
1) privacy shield, 2) lock, 3) doctor-reviewed badge (check + stethoscope curve), 4) eye-with-slash (no tracking), 5) data deletion (trash + clock), 6) consent toggle, 7) encryption key, 8) "educational, not diagnosis" book+info glyph.

STYLE: medical-grade clarity, minimal, premium, no emoji, no color noise.
OUTPUT: one tidy grid AND individually describable; 1:1 each, transparent, no text.
```
- **Save as:** `public/brand/icons/trust-*.png`

## 1.9 Launch / social marketing poster (campaign style)

This one is allowed to be bolder (it's marketing) but still calm and non-diagnostic — closest to the PDF's poster energy.

```text
[Paste BRAND VISUAL DNA here]

Create a premium 4:5 vertical product campaign poster (8K, social + billboard ready) for "Skin Lesion XAI".

CORE IDEA:
"Understand the why, not just the what." A high-end, calm tech-health campaign about EXPLAINABLE AI and lesion history — educational, privacy-first, doctor-reviewed. NOT a diagnosis product.

MASTER COMPOSITION:
- BACKGROUND: light clinical gradient with faint topographic contours, soft grid, gentle floating particles, airy depth.
- HERO OBJECT: a floating, premium frosted-glass "explanation card" showing a calm teal-to-amber attention field over abstract contour lines (NOT skin), with a soft opacity-slider detail. Layered behind it: a faint lesion-timeline strip and a small doctor-review check shield.
- Strong negative space top-left for a headline (LEAVE BLANK / no text, I will add typography later).

TYPOGRAPHY ZONES (leave as clean empty bands, do NOT render text):
- Big headline band top-left.
- Small feature strip bottom: four placeholder slots (Explainable · Private · Doctor-reviewed · Educational).
- Tiny brand/footer band bottom-center.

LIGHTING: soft diffused studio + gentle rim light on the glass card.
COLOR SYSTEM: light base, charcoal ink, teal #1FB6B0 accent, restrained amber, minimal. No red, no purple glow.
MOOD: trustworthy, premium, calm-confident, modern healthcare-tech.

OUTPUT: Aspect ratio 4:5, ultra-clean, scroll-stopping but calm, NO text (placeholder bands only).
```
- **Save as:** `public/brand/poster-launch.png`
- **Note:** generate with empty text bands, then add real headlines in Figma/Canva/code for crisp type.

---

# Part 2 — Mobile app assets

## 2.1 App icon

```text
[Paste BRAND VISUAL DNA here]

Create a modern mobile app icon for "Skin Lesion XAI", 1:1, centered, works at small sizes.

CONCEPT:
A simple, memorable mark combining a soft rounded "lens/eye of understanding" with a subtle attention-gradient dot — abstract, suggesting "explainable insight". NOT a skin/lesion, NOT a brain.

STYLE:
Flat-with-soft-depth, single teal #1FB6B0 to deep teal gradient on a light or charcoal rounded-square base, gentle inner light. Clean, premium, instantly readable at 48px.

OUTPUT:
1:1, centered, generous safe margin, no text, deliver on both a light and a dark background version.
```
- **Save as:** `mobile/assets/icon.png` (1024×1024).

## 2.2 Splash screen

```text
[Paste BRAND VISUAL DNA here]

Create a 9:16 mobile splash screen for Skin Lesion XAI.

COMPOSITION:
- Calm full-bleed light clinical gradient with faint contour lines and soft particles.
- Centered app mark (the lens + attention dot) with a soft glow.
- Lower third left clean for an app name + tiny tagline added in code.

MOOD: calm, premium, reassuring, fast-loading feel.
OUTPUT: 9:16, no text, centered mark, transparent-safe center.
```
- **Save as:** `mobile/assets/splash.png`
- **Animate:** mark fades/scales in on launch (Lottie or Reanimated — animation guide §4 & §5).

## 2.3 Onboarding illustration set (3–4 screens)

```text
[Paste BRAND VISUAL DNA here]

Create a matching set of 4 mobile onboarding illustrations, 4:5 each, transparent or light background, consistent style/palette.

1. WELCOME — soft hero mark with gentle rings; "your private skin-health companion" vibe (no text).
2. TRACK OVER TIME — abstract timeline of neutral image-cards on a phone frame.
3. UNDERSTAND THE AI — the abstract attention-field card with an opacity slider (non-diagnostic).
4. PRIVACY FIRST — layered shield + toggles, calm and empowering.

STYLE: rounded geometric, soft depth, teal accent, premium, friendly. Vertical-friendly composition with clear top area for a headline added later.
OUTPUT: 4 separate 4:5 illustrations, no text.
```
- **Save as:** `mobile/assets/onboarding-{1,2,3,4}.png`

## 2.4 Mobile empty-states & micro-illustrations

Reuse the §1.7 empty-state prompt but add: `OUTPUT: vertical 4:5 framing optimized for mobile, lighter detail for small screens.`
- **Save as:** `mobile/assets/empty-*.png`

## 2.5 App Store / Play Store screenshot frames

```text
[Paste BRAND VISUAL DNA here]

Create a set of 5 matching app-store screenshot background templates, 9:16 (1242x2688 safe), premium and consistent.

EACH FRAME:
- Top band: clean space for a short marketing headline (LEAVE BLANK — no text).
- Center: a soft floating phone mockup placeholder area (a rounded rectangle with subtle shadow) where I will composite a real app screenshot later.
- Background: light clinical gradient with faint contours, teal accent, soft particles; each frame a slightly different gradient angle so the set feels like a sequence.

OUTPUT: 5 separate 9:16 templates, no text, phone mockup as an empty rounded placeholder.
```
- **Save as:** `marketing/store/screenshot-frame-{1..5}.png`
- **Note:** composite real screenshots + crisp headlines after, in Figma/Canva.

---

# Part 3 — Reusable prompt patterns (build your own)

When you need an asset not listed here, assemble a prompt from these slots. This mirrors the structured style of the source poster prompts but tuned to Clinical Premium UI.

```text
[Paste BRAND VISUAL DNA here]

Create a [ASPECT RATIO] [ASSET TYPE: hero / background plate / spot illustration / icon set / empty-state / poster / mockup template] for Skin Lesion XAI.

CORE IDEA:
[one calm sentence about the meaning — explainability / privacy / history / doctor-review]

COMPOSITION:
[where the focal object sits, what negative space to leave for text, what abstract elements to include — keep NON-diagnostic]

BACKGROUND:
[light clinical gradient + contour/grid/particle detail level]

LIGHTING & FINISH:
[soft diffused studio, gentle shadows, fine grain, premium]

COLOR SYSTEM:
light base + charcoal + teal #1FB6B0 accent + restrained semantic colors; NO red dominance, NO purple glow.

MOOD:
[calm / trustworthy / premium / reassuring]

CONSTRAINTS:
No realistic skin/lesions, no anatomy spectacle, no emoji, no AI clichés, no alarmist tones.

OUTPUT:
Aspect ratio [X:Y], transparent background if icon/illustration, NO text (leave placeholder zones), 8K crisp.
```

### Quick consistency checklist before you generate
- [ ] Brand Visual DNA block pasted at the top.
- [ ] Aspect ratio stated and correct for the surface (16:9 web hero, 1:1 icon, 9:16 mobile, 4:5 social).
- [ ] "No text" (or placeholder zones) specified if exact wording matters.
- [ ] Non-diagnostic / no-realistic-skin constraint present.
- [ ] Transparent background requested for icons/illustrations.
- [ ] Same palette + motif language as the rest of the set.

---

## Asset inventory & filenames (so the whole set stays organized)

| Asset | Prompt | Aspect | Save to |
| --- | --- | --- | --- |
| Landing hero key visual | 1.1 | 16:9 | `public/brand/hero-keyvisual.png` |
| Hero background plate | 1.2 | 16:9 | `public/brand/hero-bg-plate.png` |
| How-it-works set (4) | 1.3 | 1:1 ×4 | `public/brand/howitworks-*.png` |
| Feature illustrations (4) | 1.4 | 4:3 ×4 | `public/brand/feature-*.png` |
| Grad-CAM explainer | 1.5 | 16:9 | `public/brand/gradcam-explainer.png` |
| Body-map silhouettes | 1.6 | 9:16 ×2 | `public/brand/bodymap-{front,back}.png` |
| Empty-states (3) | 1.7 | 1:1 ×3 | `public/brand/empty-*.png` |
| Trust icons (8) | 1.8 | 1:1 ×8 | `public/brand/icons/trust-*.png` |
| Launch poster | 1.9 | 4:5 | `public/brand/poster-launch.png` |
| App icon | 2.1 | 1:1 | `mobile/assets/icon.png` |
| Splash | 2.2 | 9:16 | `mobile/assets/splash.png` |
| Onboarding (4) | 2.3 | 4:5 ×4 | `mobile/assets/onboarding-*.png` |
| Mobile empty-states | 2.4 | 4:5 | `mobile/assets/empty-*.png` |
| Store screenshot frames (5) | 2.5 | 9:16 ×5 | `marketing/store/screenshot-frame-*.png` |

Next: animate the ones that should move → [`IMAGE_TO_ANIMATION_GUIDE.md`](IMAGE_TO_ANIMATION_GUIDE.md).
