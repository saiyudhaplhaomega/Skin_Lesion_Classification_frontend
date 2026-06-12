# ChatGPT Image Prompts - Skin Lesion XAI

This is the baby-step guide for generating still images in ChatGPT. You should not need to scroll back and forth: every prompt below is complete, includes the brand style, and tells you which image format/aspect ratio to choose.

Use this file first. After all still images are generated, open [`IMAGE_TO_ANIMATION_GUIDE.md`](IMAGE_TO_ANIMATION_GUIDE.md) to place, optimize, animate, and wire the assets into the frontend.

---

## Before You Start

Open PowerShell, then run this `cd` command first:

```powershell
cd C:\Users\saiyu\Desktop\projects\KI_projects\Skin_Lesion_GRADCAM_Classification\Skin_Lesion_Classification_frontend
```

Check that PowerShell is now inside the frontend repo:

```powershell
Get-Location
```

Expected result:

```text
C:\Users\saiyu\Desktop\projects\KI_projects\Skin_Lesion_GRADCAM_Classification\Skin_Lesion_Classification_frontend
```

Why: the folder creation commands below use relative paths like `design\source-art\web`, so PowerShell must be inside the frontend repo before you run them.

Now create these folders if they do not already exist:

```powershell
New-Item -ItemType Directory -Force design\source-art\web
New-Item -ItemType Directory -Force design\source-art\mobile
New-Item -ItemType Directory -Force design\source-art\marketing
New-Item -ItemType Directory -Force public\brand
New-Item -ItemType Directory -Force public\brand\icons
```

Check:

```powershell
Test-Path design\source-art\web
Test-Path design\source-art\mobile
Test-Path design\source-art\marketing
Test-Path public\brand
Test-Path public\brand\icons
```

Expected result: every command prints `True`.

Why: raw AI downloads stay in `design/source-art/...`; optimized images for the app later go in `public/brand/...`.

---

## Medical Safety Rules

Every prompt below already includes these rules. Keep them if you edit anything:

- No realistic lesions, moles, rashes, wounds, or clinical skin close-ups.
- No real patients, no identifiable faces tied to a medical condition.
- No diagnosis, cancer, detection, cure, treatment, or screening claims.
- No scary red-alert visuals.
- No anatomy spectacle, organ imagery, AI brain cliches, purple-blue glow, emoji icons, or cluttered sci-fi dashboards.
- Use abstract attention fields, contour lines, privacy shields, neutral cards, and calm clinical geometry.

---

## The Repeated Workflow

For every asset:

1. Open ChatGPT.
2. Choose the image generator.
3. Select the format/aspect ratio listed for that asset.
4. Copy only that asset's prompt block.
5. Paste it into ChatGPT and generate.
6. Download the image.
7. Rename it immediately using the filename listed.
8. Put the raw download in the listed `design/source-art/...` folder.
9. Check the result against the mini checklist under that asset.
10. Move to the next numbered asset.

Do not add final text inside generated images unless a prompt explicitly asks for it. ChatGPT text often comes out wrong. Add real text later in code, Figma, Canva, or the UI.

---

## Format Cheat Sheet

| Use case | ChatGPT format to select | Aspect ratio |
|---|---:|---:|
| Website hero / wide banner | Widescreen | 16:9 |
| Cards, icons, empty states | Square | 1:1 |
| Feature illustrations | Standard | 4:3 |
| Social poster | Portrait | 4:5 |
| Mobile splash / store frame | Vertical | 9:16 |
| Mobile onboarding art | Portrait | 4:5 |

If ChatGPT only shows simple choices, use this mapping: **Widescreen = 16:9**, **Standard = 4:3**, **Square = 1:1**, **Portrait = 4:5**, and **Vertical = 9:16**. If the exact option is not visible, keep the `Aspect ratio:` line in the prompt and choose the closest option.

---

# Part 1 - Website Assets

## Step 1.1 - Landing Hero Key Visual

Use for: public landing page hero.

Choose in ChatGPT: **Widescreen / 16:9**.

Paste this prompt:

```text
Create a premium 16:9 desktop landing-page hero key visual for "Skin Lesion XAI", an educational, privacy-aware AI explainability platform for skin lesion history. This is NOT a diagnosis tool.

BRAND STYLE:
Clinical Premium. Calm, trustworthy, private, precise, quietly high-end. Medical-grade, not flashy. Use light clinical surfaces: off-white #F7F9FB and soft mist #ECF1F5, with deep charcoal ink #15202B. Use one restrained accent: calm teal-cyan #1FB6B0. Use restrained amber only inside the abstract attention field. Avoid red and avoid purple-blue AI glow.

CORE IDEA:
"See why the AI looked there." Show explainable AI as a calm abstract attention map, not a medical image.

COMPOSITION:
- Wide cinematic layout.
- Leave generous clean negative space on the left for headline text to be added later. Do not render text.
- On the right, show a floating abstract explanation object: a softly rounded matte card or lens shape with a gentle teal-to-amber gradient attention field over subtle topographic contour lines.
- The object must read as data abstraction, not skin, not a body part, not anatomy.
- Add light layered UI-card hints behind it: a timeline strip, a privacy shield glyph, and a small doctor-review check badge. Keep them abstract and minimal.

BACKGROUND:
Off-white clinical gradient from #F7F9FB to #ECF1F5, faint large-scale grid scaffold, subtle contour lines, soft diffused studio light, gentle long shadows, airy negative space.

STRICTLY AVOID:
Realistic skin, lesions, moles, wounds, patient faces, anatomy spectacle, AI brain/circuit cliches, emoji, sci-fi HUD clutter, dark heavy background, neon glow, diagnosis language, cancer language, treatment claims, and any text.

OUTPUT:
Aspect ratio: 16:9. Ultra-clean, crisp, editorial product-marketing quality. No text in the image.
```

After ChatGPT generates the image, download it and rename it to:

```text
design/source-art/web/hero-keyvisual.png
```

Final shipped target later:

```text
public/brand/hero-keyvisual.png
```

Check before moving on:

- [ ] Left side has clean space for real website text.
- [ ] No realistic skin or lesion imagery.
- [ ] Visual feels calm and clinical, not sci-fi.

---

## Step 1.2 - Animated Hero Background Plate

Use for: still source for a looping hero background.

Choose in ChatGPT: **Widescreen / 16:9**.

Paste this prompt:

```text
Create a 16:9 abstract background plate designed to become a subtle looping website hero background for "Skin Lesion XAI", an educational, privacy-aware AI explainability platform. This is NOT a diagnosis tool.

BRAND STYLE:
Clinical Premium. Calm, trustworthy, private, precise, quietly high-end. Use off-white #F7F9FB, soft mist #ECF1F5, deep charcoal #15202B only for faint structure, calm teal-cyan #1FB6B0 as the restrained accent, and a very small amount of warm amber.

CORE IDEA:
A calm "field of understanding": a slow-moving abstract gradient mesh with faint topographic contour lines and drifting light particles.

COMPOSITION:
- Edge-to-edge abstract field.
- No focal object.
- No text.
- Even visual weight so website text can sit on top.
- Keep the center slightly calmer and lighter for text legibility.
- Use faint grid scaffolding, subtle contour lines, and sparse soft particles.

LIGHTING AND FINISH:
Soft diffused glow, fine grain, premium and airy. No neon, no hard spotlight, no dark heavy corners.

STRICTLY AVOID:
Realistic skin, lesions, moles, anatomy, patient imagery, AI brain/circuit cliches, emoji, purple-blue glow, alarmist red, diagnosis/cancer/treatment language, and any text.

OUTPUT:
Aspect ratio: 16:9. Seamless-feeling, evenly lit, clean, no hard focal point, no text.
```

After ChatGPT generates the image, download it and rename it to:

```text
design/source-art/web/hero-bg-plate.png
```

Final shipped target later:

```text
public/brand/hero-bg-plate.png
```

Check before moving on:

- [ ] Works as a background, not a busy illustration.
- [ ] No hard focal point.
- [ ] Center is readable enough for overlay text.

Loop note: in Seedance/Kling later, use this same image as both the start frame and end frame for a cleaner loop.

---

## Step 1.3 - How It Works Icons

Use for: "How it works" section.

Choose in ChatGPT: **Square / 1:1**.

Recommended method: generate the full 2x2 set first. If any icon is weak, ask ChatGPT for that single icon again using the same style.

Paste this prompt:

```text
Create a set of 4 matching square spot illustrations for the "How it works" section of Skin Lesion XAI, an educational, privacy-aware AI explainability platform. This is NOT a diagnosis tool.

BRAND STYLE:
Clinical Premium. Calm, trustworthy, private, precise, quietly high-end. Use light clinical surfaces #F7F9FB and #ECF1F5, charcoal linework #15202B, calm teal-cyan accent #1FB6B0, and restrained amber only for attention fields. Rounded geometric style, soft depth, consistent 2-3px line weight, gentle inner shadows, transparent or very light background.

MAKE 4 ICONS:
1. UPLOAD: a soft rounded image/photo card lifting into a gentle dashed frame with a small camera glyph.
2. AI EXPLANATION: an abstract lens/processing shape with calm concentric rings and a small spark. No brain, no circuits.
3. GRAD-CAM HEATMAP: a soft card with a gentle teal-to-amber attention gradient over faint contour lines. It must look abstract, not like skin.
4. DOCTOR REVIEW: a clean clipboard/check shield with a subtle stethoscope-curve accent.

COMPOSITION:
Show the 4 icons as a neat 2x2 set. Each icon should also be easy to crop into its own square asset. No labels and no text.

STRICTLY AVOID:
Realistic skin, lesions, moles, wounds, patient faces, anatomy spectacle, AI brain/circuit cliches, emoji, sci-fi HUD clutter, diagnosis/cancer/treatment language, and any text.

OUTPUT:
Aspect ratio: 1:1. Transparent or near-transparent background. Clean matching icon set. No text labels.
```

After ChatGPT generates the image, download/crop the icons and rename them to:

```text
design/source-art/web/howitworks-upload.png
design/source-art/web/howitworks-explain.png
design/source-art/web/howitworks-heatmap.png
design/source-art/web/howitworks-review.png
```

Final shipped targets later:

```text
public/brand/howitworks-upload.png
public/brand/howitworks-explain.png
public/brand/howitworks-heatmap.png
public/brand/howitworks-review.png
```

Check before moving on:

- [ ] All four icons look like one family.
- [ ] No text labels.
- [ ] Heatmap icon is abstract, not skin-like.

---

## Step 1.4 - Feature Spot Illustrations

Use for: feature sections/cards.

Choose in ChatGPT: **Standard / 4:3** if available. If ChatGPT does not show Standard, keep the `Aspect ratio: 4:3` line in the prompt and choose the closest non-square option.

Paste this prompt:

```text
Create 4 matching 4:3 feature illustrations for Skin Lesion XAI, an educational, privacy-aware AI explainability platform. This is NOT a diagnosis tool.

BRAND STYLE:
Clinical Premium. Calm, trustworthy, private, precise, quietly high-end. Use light clinical surfaces #F7F9FB and #ECF1F5, charcoal linework #15202B, calm teal-cyan accent #1FB6B0, and restrained amber only for abstract attention fields. Rounded geometric style, soft depth, clean healthcare-product clarity.

MAKE 4 ILLUSTRATIONS:
1. LESION TIMELINE: an abstract horizontal timeline of soft rounded image cards, with a small "tracked over time" arc and date ticks. Cards show neutral gradient swatches only, no real skin.
2. BODY MAP: a calm, gender-neutral abstract human silhouette with no facial detail, no nudity, and a few soft numbered location pins.
3. PRIVACY MODES: a layered shield with a dial or slider showing three calm privacy states, plus a subtle lock glyph.
4. CONSENT CONTROL: clean toggle switches and a document with a checkmark, conveying patient control and transparency.

COMPOSITION:
Deliver as 4 separate-feeling illustrations in one coordinated set, each easy to crop into a 4:3 asset. No final text.

STRICTLY AVOID:
Realistic skin, lesions, moles, wounds, patient faces, anatomy spectacle, AI brain/circuit cliches, emoji, sci-fi HUD clutter, diagnosis/cancer/treatment language, and any text labels.

OUTPUT:
Aspect ratio: 4:3 for each illustration. Transparent or very light background. No text.
```

After ChatGPT generates the image, download/crop the illustrations and rename them to:

```text
design/source-art/web/feature-timeline.png
design/source-art/web/feature-bodymap.png
design/source-art/web/feature-privacy.png
design/source-art/web/feature-consent.png
```

Final shipped targets later:

```text
public/brand/feature-timeline.png
public/brand/feature-bodymap.png
public/brand/feature-privacy.png
public/brand/feature-consent.png
```

Check before moving on:

- [ ] Body map is respectful and abstract.
- [ ] Timeline cards do not look like real skin photos.
- [ ] All four share the same style.

---

## Step 1.5 - Grad-CAM Abstract Explainer

Use for: explainable AI / heatmap education sections.

Choose in ChatGPT: **Widescreen / 16:9**.

Paste this prompt:

```text
Create a 16:9 abstract explainer visual for Skin Lesion XAI showing explainable AI heatmaps. This is educational and NOT a diagnosis tool.

BRAND STYLE:
Clinical Premium. Calm, trustworthy, private, precise, quietly high-end. Use off-white #F7F9FB, mist #ECF1F5, charcoal #15202B, calm teal-cyan #1FB6B0, and restrained amber in the attention overlay.

COMPOSITION:
- A soft rounded card split into two visual states.
- Left side: a neutral abstract textured swatch with soft contour patterns. It must not look like skin.
- Right side: the same abstract swatch with a calm teal-to-amber attention gradient softly highlighting one rounded region.
- Between them: a subtle opacity slider glyph to imply blend/overlay control.
- Leave a small blank caption zone for text to be added later in code.

MOOD:
Honest, educational, calm, trustworthy.

STRICTLY AVOID:
Realistic skin, lesions, moles, wounds, biopsy imagery, patient faces, anatomy spectacle, red-heavy heatmaps, AI brain/circuit cliches, emoji, diagnosis/cancer/treatment language, and final text.

OUTPUT:
Aspect ratio: 16:9. Clean, crisp, no final text, placeholder/caption zone only.
```

After ChatGPT generates the image, download it and rename it to:

```text
design/source-art/web/gradcam-explainer.png
```

Final shipped target later:

```text
public/brand/gradcam-explainer.png
```

Check before moving on:

- [ ] Looks like an abstract UI explainer.
- [ ] Does not resemble tissue or skin.
- [ ] Has room for real text later.

---

## Step 1.6 - Body Map Silhouettes

Use for: interactive body map UI.

Choose in ChatGPT: **Vertical / 9:16**.

Recommended method: generate front view first, then ask for the matching back view in the same chat.

Paste this prompt:

```text
Create a clean pair of gender-neutral human body silhouettes for an interactive medical body-map UI in Skin Lesion XAI. This is for neutral location tracking only and is NOT a diagnosis tool.

BRAND STYLE:
Clinical Premium. Calm, respectful, medical-diagram quality. Use soft mist fill #ECF1F5, thin charcoal contour outline #15202B, subtle inner shadow, and a clean transparent background.

COMPOSITION:
- Two separate vertical figures: front view and back view.
- Simple abstract rounded anatomical silhouette.
- Smooth neutral form only.
- Front-on, centered, generous margin.
- No pins, no labels, no text. Pins will be added in code.

STRICTLY AVOID:
Facial features, nipples, genitalia, realistic skin texture, lesions, wounds, body hair, underwear, patient identity, anatomy spectacle, alarmist medical imagery, diagnosis/cancer/treatment language, and any text.

OUTPUT:
Aspect ratio: 9:16 for each figure. Transparent background. Clean flat fills suitable for later tracing to SVG.
```

After ChatGPT generates the images, download them and rename them to:

```text
design/source-art/web/bodymap-front.png
design/source-art/web/bodymap-back.png
```

Final shipped targets later:

```text
public/brand/bodymap-front.png
public/brand/bodymap-back.png
```

Check before moving on:

- [ ] Front and back figures match.
- [ ] No sensitive anatomical detail.
- [ ] Transparent or easy-to-remove background.

---

## Step 1.7 - Website Empty States

Use for: empty dashboard/card states.

Choose in ChatGPT: **Square / 1:1**.

Paste this prompt:

```text
Create a set of 3 matching square empty-state illustrations for Skin Lesion XAI, an educational, privacy-aware AI explainability platform. This is NOT a diagnosis tool.

BRAND STYLE:
Clinical Premium. Calm, trustworthy, private, precise, quietly high-end. Use off-white #F7F9FB, mist #ECF1F5, charcoal #15202B, calm teal-cyan #1FB6B0, and soft rounded geometry with gentle depth.

MAKE 3 EMPTY STATES:
1. NO LESIONS YET: a soft empty image card with a friendly dashed add frame and a small upward arc; it should suggest "start your history" without showing skin.
2. ALL CAUGHT UP: a calm checkmark inside soft concentric rings with a few light particles.
3. NO NOTIFICATIONS: a soft bell glyph at rest with a quiet dot; peaceful, not sad.

COMPOSITION:
Show them as a matching set, easy to crop into three separate 1:1 assets. Transparent or very light background. No labels and no text.

STRICTLY AVOID:
Realistic skin, lesions, moles, wounds, patient faces, anatomy spectacle, emoji, AI brain/circuit cliches, alarmist red, diagnosis/cancer/treatment language, and any text.

OUTPUT:
Aspect ratio: 1:1. Gentle, encouraging, clean, no text.
```

After ChatGPT generates the image, download/crop the empty states and rename them to:

```text
design/source-art/web/empty-lesions.png
design/source-art/web/empty-caughtup.png
design/source-art/web/empty-notifications.png
```

Final shipped targets later:

```text
public/brand/empty-lesions.png
public/brand/empty-caughtup.png
public/brand/empty-notifications.png
```

Check before moving on:

- [ ] Friendly but not childish.
- [ ] No text.
- [ ] All three match.

---

## Step 1.8 - Trust And Privacy Icon Set

Use for: trust strip, privacy pages, feature callouts.

Choose in ChatGPT: **Square / 1:1**.

Paste this prompt:

```text
Create a cohesive set of 8 trust and privacy icons for Skin Lesion XAI, an educational, privacy-aware AI explainability platform. This is NOT a diagnosis tool.

BRAND STYLE:
Clinical Premium. Calm, trustworthy, private, precise. Use consistent 2px rounded charcoal strokes #15202B, soft light fills #F7F9FB and #ECF1F5, and restrained teal-cyan accent #1FB6B0. Minimal, premium, medical-grade clarity.

MAKE 8 ICONS:
1. Privacy shield
2. Lock
3. Doctor-reviewed badge using checkmark plus subtle stethoscope curve
4. Eye-with-slash for no tracking
5. Data deletion using trash plus clock
6. Consent toggle
7. Encryption key
8. Educational-not-diagnosis using book plus info glyph

COMPOSITION:
Place the 8 icons in a tidy grid. Each must be easy to crop into a separate square icon. No text labels.

STRICTLY AVOID:
Emoji style, cartoon style, AI brain/circuit cliches, clutter, alarmist red, realistic medical imagery, diagnosis/cancer/treatment language, and text.

OUTPUT:
Aspect ratio: 1:1 overall grid. Transparent or very light background. No text.
```

After ChatGPT generates the image, save the full grid and crop individual icons as needed:

```text
design/source-art/web/trust-icons.png
```

Final shipped targets later:

```text
public/brand/icons/trust-privacy-shield.png
public/brand/icons/trust-lock.png
public/brand/icons/trust-doctor-reviewed.png
public/brand/icons/trust-no-tracking.png
public/brand/icons/trust-data-deletion.png
public/brand/icons/trust-consent-toggle.png
public/brand/icons/trust-encryption-key.png
public/brand/icons/trust-educational-info.png
```

Check before moving on:

- [ ] Looks like icons, not illustrations.
- [ ] All strokes are consistent.
- [ ] No labels.

---

## Step 1.9 - Launch / Social Poster

Use for: social launch graphic or campaign poster.

Choose in ChatGPT: **Portrait / 4:5**.

Paste this prompt:

```text
Create a premium 4:5 vertical product campaign poster for "Skin Lesion XAI", an educational, privacy-first explainable AI platform for lesion history. This is NOT a diagnosis tool.

BRAND STYLE:
Clinical Premium. Calm, trustworthy, private, precise, quietly high-end. Use light clinical surfaces #F7F9FB and #ECF1F5, deep charcoal #15202B, calm teal-cyan #1FB6B0, and restrained amber. Marketing-grade but still medically calm.

CORE IDEA:
"Understand the why, not just the what." Show explainable AI and lesion history as abstract product concepts, not as medical imagery.

COMPOSITION:
- Light clinical gradient background with faint topographic contours, soft grid, gentle floating particles, airy depth.
- Main hero object: a floating frosted-glass explanation card showing a calm teal-to-amber attention field over abstract contour lines. It must not look like skin.
- Behind it: a faint lesion-timeline strip and a small doctor-review check shield.
- Leave a clean empty headline band top-left.
- Leave a small empty feature strip near the bottom for text to be added later.
- Leave a tiny empty brand/footer band bottom-center.
- Do not render readable text.

LIGHTING:
Soft diffused studio light with gentle rim light on the card.

STRICTLY AVOID:
Realistic skin, lesions, moles, wounds, patient faces, anatomy spectacle, AI brain/circuit cliches, emoji, purple-blue glow, alarmist red, diagnosis/cancer/treatment language, and final text.

OUTPUT:
Aspect ratio: 4:5. Premium campaign quality, calm but scroll-stopping. No text, only clean placeholder bands.
```

After ChatGPT generates the image, download it and rename it to:

```text
design/source-art/marketing/poster-launch.png
```

Final shipped target later:

```text
public/brand/poster-launch.png
```

Check before moving on:

- [ ] Poster has clean blank text zones.
- [ ] No medical fear visuals.
- [ ] Feels more polished than a normal UI illustration.

---

# Part 2 - Mobile Assets

## Step 2.1 - App Icon

Use for: mobile app icon.

Choose in ChatGPT: **Square / 1:1**.

Paste this prompt:

```text
Create a modern mobile app icon for "Skin Lesion XAI", an educational, privacy-aware AI explainability platform. This is NOT a diagnosis tool.

BRAND STYLE:
Clinical Premium. Calm, trustworthy, private, precise, quietly high-end. Use a light clinical base or deep charcoal base, with one restrained teal-cyan accent #1FB6B0 and soft depth.

CONCEPT:
A simple memorable abstract mark combining a soft rounded lens or eye-of-understanding shape with a subtle attention-gradient dot. It should suggest explainable insight and privacy.

COMPOSITION:
- Centered icon mark.
- Rounded-square app icon base.
- Generous safe margin.
- Must read clearly at 48px.
- No text.
- Provide both light-background and dark-background versions if possible.

STRICTLY AVOID:
Realistic skin, lesions, moles, wounds, anatomy, AI brain/circuit cliches, eye horror, emoji, clutter, diagnosis/cancer/treatment language, and text.

OUTPUT:
Aspect ratio: 1:1. 1024x1024-ready app icon, centered, crisp, no text.
```

After ChatGPT generates the image, download it and rename it to:

```text
design/source-art/mobile/icon.png
```

Final shipped target later:

```text
mobile/assets/icon.png
```

Check before moving on:

- [ ] Recognizable at small size.
- [ ] No letters or words.
- [ ] Not visually confused with a medical diagnosis app.

---

## Step 2.2 - Splash Screen

Use for: mobile launch/splash screen.

Choose in ChatGPT: **Vertical / 9:16**.

Paste this prompt:

```text
Create a 9:16 mobile splash screen background for "Skin Lesion XAI", an educational, privacy-aware AI explainability platform. This is NOT a diagnosis tool.

BRAND STYLE:
Clinical Premium. Calm, trustworthy, private, precise. Use off-white #F7F9FB, soft mist #ECF1F5, deep charcoal #15202B for subtle structure, and calm teal-cyan #1FB6B0 as the restrained accent.

COMPOSITION:
- Full-bleed light clinical gradient.
- Faint contour lines and soft particles.
- Centered abstract app mark: a rounded lens shape with a small attention dot.
- Lower third should stay clean so the app name/tagline can be added in code if needed.
- No final text.

MOOD:
Calm, premium, reassuring, fast-loading.

STRICTLY AVOID:
Realistic skin, lesions, moles, wounds, patient faces, anatomy spectacle, AI brain/circuit cliches, emoji, purple-blue glow, alarmist red, diagnosis/cancer/treatment language, and text.

OUTPUT:
Aspect ratio: 9:16. Mobile splash screen, centered mark, clean lower third, no text.
```

After ChatGPT generates the image, download it and rename it to:

```text
design/source-art/mobile/splash.png
```

Final shipped target later:

```text
mobile/assets/splash.png
```

Check before moving on:

- [ ] App mark is centered.
- [ ] Lower third is clean.
- [ ] No text.

---

## Step 2.3 - Mobile Onboarding Illustrations

Use for: onboarding carousel.

Choose in ChatGPT: **Portrait / 4:5**.

Paste this prompt:

```text
Create a matching set of 4 mobile onboarding illustrations for Skin Lesion XAI, an educational, privacy-aware AI explainability platform. This is NOT a diagnosis tool.

BRAND STYLE:
Clinical Premium. Calm, trustworthy, private, precise, quietly high-end. Use off-white #F7F9FB, mist #ECF1F5, charcoal #15202B, calm teal-cyan #1FB6B0, and restrained amber only for attention fields. Rounded geometry, soft depth, friendly but professional.

MAKE 4 ILLUSTRATIONS:
1. WELCOME: soft abstract app mark with gentle rings; private companion feeling, no text.
2. TRACK OVER TIME: abstract timeline of neutral image cards inside a phone frame. No skin photos.
3. UNDERSTAND THE AI: abstract attention-field card with an opacity slider. Non-diagnostic.
4. PRIVACY FIRST: layered shield plus toggles, calm and empowering.

COMPOSITION:
Each illustration should be vertical-friendly with clear top space for a headline added later. No labels and no text.

STRICTLY AVOID:
Realistic skin, lesions, moles, wounds, patient faces, anatomy spectacle, AI brain/circuit cliches, emoji, alarmist red, diagnosis/cancer/treatment language, and text.

OUTPUT:
Aspect ratio: 4:5 for each illustration. Matching set, clean, no text.
```

After ChatGPT generates the images, download/crop them and rename them to:

```text
design/source-art/mobile/onboarding-1.png
design/source-art/mobile/onboarding-2.png
design/source-art/mobile/onboarding-3.png
design/source-art/mobile/onboarding-4.png
```

Final shipped targets later:

```text
mobile/assets/onboarding-1.png
mobile/assets/onboarding-2.png
mobile/assets/onboarding-3.png
mobile/assets/onboarding-4.png
```

Check before moving on:

- [ ] All four feel like one onboarding set.
- [ ] Top space is available for real app text.
- [ ] No skin imagery.

---

## Step 2.4 - Mobile Empty States

Use for: mobile empty views.

Choose in ChatGPT: **Portrait / 4:5**.

Paste this prompt:

```text
Create a set of 3 matching mobile empty-state illustrations for Skin Lesion XAI, an educational, privacy-aware AI explainability platform. This is NOT a diagnosis tool.

BRAND STYLE:
Clinical Premium. Calm, trustworthy, private, precise. Use off-white #F7F9FB, mist #ECF1F5, charcoal #15202B, calm teal-cyan #1FB6B0, rounded geometry, light detail, and soft depth optimized for small mobile screens.

MAKE 3 MOBILE EMPTY STATES:
1. NO LESIONS YET: an empty image card with a friendly dashed add frame and small upward arc; no skin.
2. ALL CAUGHT UP: calm checkmark inside soft rings with a few light particles.
3. NO NOTIFICATIONS: soft bell glyph at rest with a quiet dot.

COMPOSITION:
Portrait 4:5 framing. Leave top or bottom room for real mobile UI text to be added later. No text in the image.

STRICTLY AVOID:
Realistic skin, lesions, moles, wounds, patient faces, anatomy spectacle, emoji, AI brain/circuit cliches, alarmist red, diagnosis/cancer/treatment language, and text.

OUTPUT:
Aspect ratio: 4:5. Mobile-optimized, gentle, clean, no text.
```

After ChatGPT generates the image, download/crop the empty states and rename them to:

```text
design/source-art/mobile/empty-lesions.png
design/source-art/mobile/empty-caughtup.png
design/source-art/mobile/empty-notifications.png
```

Final shipped targets later:

```text
mobile/assets/empty-lesions.png
mobile/assets/empty-caughtup.png
mobile/assets/empty-notifications.png
```

Check before moving on:

- [ ] Detail is simple enough for mobile.
- [ ] No text.
- [ ] No skin imagery.

---

## Step 2.5 - App Store / Play Store Screenshot Frames

Use for: store listing marketing screenshots.

Choose in ChatGPT: **Vertical / 9:16**.

Paste this prompt:

```text
Create a set of 5 matching app-store screenshot background templates for Skin Lesion XAI, an educational, privacy-aware AI explainability platform. This is NOT a diagnosis tool.

BRAND STYLE:
Clinical Premium. Calm, trustworthy, private, precise, quietly high-end. Use light clinical gradients #F7F9FB and #ECF1F5, charcoal #15202B for structure, calm teal-cyan #1FB6B0, restrained amber, faint contour lines, and soft product-marketing depth.

EACH FRAME:
- 9:16 portrait layout.
- Top band: clean space for a short marketing headline to be added later. Do not render text.
- Center: soft floating phone mockup placeholder area, a rounded rectangle with subtle shadow where a real app screenshot will be composited later.
- Background: light clinical gradient with faint contours, teal accent, soft particles.
- Make each frame slightly different in gradient angle or contour placement so the set feels like a sequence.

STRICTLY AVOID:
Realistic skin, lesions, moles, wounds, patient faces, anatomy spectacle, AI brain/circuit cliches, emoji, alarmist red, diagnosis/cancer/treatment language, exposed PHI, and text.

OUTPUT:
Aspect ratio: 9:16. Five separate-looking templates, no text, phone mockup as empty rounded placeholder.
```

After ChatGPT generates the images, download/crop them and rename them to:

```text
design/source-art/marketing/screenshot-frame-1.png
design/source-art/marketing/screenshot-frame-2.png
design/source-art/marketing/screenshot-frame-3.png
design/source-art/marketing/screenshot-frame-4.png
design/source-art/marketing/screenshot-frame-5.png
```

Final shipped targets later:

```text
marketing/store/screenshot-frame-1.png
marketing/store/screenshot-frame-2.png
marketing/store/screenshot-frame-3.png
marketing/store/screenshot-frame-4.png
marketing/store/screenshot-frame-5.png
```

Check before moving on:

- [ ] Has blank headline space.
- [ ] Phone placeholder is empty.
- [ ] No text or fake screenshots.

---

# Part 3 - Optional Extra Assets

Only do this part if a screen design asks for an asset not covered above.

## Step 3.1 - Custom Asset Template

Choose in ChatGPT: use the format required by the screen.

Paste this prompt and replace the bracketed fields:

```text
Create a [ASPECT RATIO] [ASSET TYPE: hero / background plate / spot illustration / icon set / empty-state / poster / mockup template] for Skin Lesion XAI, an educational, privacy-aware AI explainability platform. This is NOT a diagnosis tool.

BRAND STYLE:
Clinical Premium. Calm, trustworthy, private, precise, quietly high-end. Use light clinical surfaces #F7F9FB and #ECF1F5, deep charcoal #15202B, one restrained teal-cyan accent #1FB6B0, and restrained semantic colors only when needed. Use soft contour lines, abstract attention fields, rounded geometric data shapes, matte surfaces, subtle depth, and airy negative space.

CORE IDEA:
[One calm sentence about the meaning: explainability, privacy, lesion history, doctor review, consent, or education.]

COMPOSITION:
[Describe the focal object, where it sits, what negative space to leave for text, and what abstract elements to include. Keep it non-diagnostic.]

BACKGROUND:
[Light clinical gradient, contour/grid detail level, optional particles.]

LIGHTING AND FINISH:
Soft diffused studio light, gentle shadows, fine grain, premium product quality.

STRICTLY AVOID:
Realistic skin, lesions, moles, wounds, patient faces, anatomy spectacle, AI brain/circuit cliches, emoji, sci-fi HUD clutter, purple-blue glow, alarmist red, diagnosis/cancer/treatment language, and final text unless explicitly requested.

OUTPUT:
Aspect ratio: [X:Y]. [Transparent background if icon/illustration.] No final text unless requested. Crisp product-quality image.
```

---

# Final Checklist

Before opening `IMAGE_TO_ANIMATION_GUIDE.md`, confirm:

- [ ] All raw web images are in `design/source-art/web/`.
- [ ] All raw mobile images are in `design/source-art/mobile/`.
- [ ] All raw marketing images are in `design/source-art/marketing/`.
- [ ] Every filename matches the inventory below.
- [ ] No generated image contains realistic lesions, skin close-ups, patient faces, diagnosis language, or cancer/treatment claims.
- [ ] No generated image contains final UI copy that should be rendered in code.

Check folders from the frontend repo:

```powershell
Get-ChildItem design\source-art\web
Get-ChildItem design\source-art\mobile
Get-ChildItem design\source-art\marketing
```

Expected result: you see the generated PNG files with the names listed below.

---

## Asset Inventory

| Step | Asset | ChatGPT format | Raw save path | Final target later |
|---|---|---:|---|---|
| 1.1 | Landing hero key visual | 16:9 | `design/source-art/web/hero-keyvisual.png` | `public/brand/hero-keyvisual.png` |
| 1.2 | Hero background plate | 16:9 | `design/source-art/web/hero-bg-plate.png` | `public/brand/hero-bg-plate.png` |
| 1.3 | How-it-works upload | 1:1 | `design/source-art/web/howitworks-upload.png` | `public/brand/howitworks-upload.png` |
| 1.3 | How-it-works explain | 1:1 | `design/source-art/web/howitworks-explain.png` | `public/brand/howitworks-explain.png` |
| 1.3 | How-it-works heatmap | 1:1 | `design/source-art/web/howitworks-heatmap.png` | `public/brand/howitworks-heatmap.png` |
| 1.3 | How-it-works review | 1:1 | `design/source-art/web/howitworks-review.png` | `public/brand/howitworks-review.png` |
| 1.4 | Feature timeline | 4:3 | `design/source-art/web/feature-timeline.png` | `public/brand/feature-timeline.png` |
| 1.4 | Feature body map | 4:3 | `design/source-art/web/feature-bodymap.png` | `public/brand/feature-bodymap.png` |
| 1.4 | Feature privacy | 4:3 | `design/source-art/web/feature-privacy.png` | `public/brand/feature-privacy.png` |
| 1.4 | Feature consent | 4:3 | `design/source-art/web/feature-consent.png` | `public/brand/feature-consent.png` |
| 1.5 | Grad-CAM explainer | 16:9 | `design/source-art/web/gradcam-explainer.png` | `public/brand/gradcam-explainer.png` |
| 1.6 | Body map front | 9:16 | `design/source-art/web/bodymap-front.png` | `public/brand/bodymap-front.png` |
| 1.6 | Body map back | 9:16 | `design/source-art/web/bodymap-back.png` | `public/brand/bodymap-back.png` |
| 1.7 | Empty lesions | 1:1 | `design/source-art/web/empty-lesions.png` | `public/brand/empty-lesions.png` |
| 1.7 | Empty caught up | 1:1 | `design/source-art/web/empty-caughtup.png` | `public/brand/empty-caughtup.png` |
| 1.7 | Empty notifications | 1:1 | `design/source-art/web/empty-notifications.png` | `public/brand/empty-notifications.png` |
| 1.8 | Trust icon grid | 1:1 | `design/source-art/web/trust-icons.png` | `public/brand/icons/trust-*.png` |
| 1.9 | Launch poster | 4:5 | `design/source-art/marketing/poster-launch.png` | `public/brand/poster-launch.png` |
| 2.1 | App icon | 1:1 | `design/source-art/mobile/icon.png` | `mobile/assets/icon.png` |
| 2.2 | Splash screen | 9:16 | `design/source-art/mobile/splash.png` | `mobile/assets/splash.png` |
| 2.3 | Onboarding 1 | 4:5 | `design/source-art/mobile/onboarding-1.png` | `mobile/assets/onboarding-1.png` |
| 2.3 | Onboarding 2 | 4:5 | `design/source-art/mobile/onboarding-2.png` | `mobile/assets/onboarding-2.png` |
| 2.3 | Onboarding 3 | 4:5 | `design/source-art/mobile/onboarding-3.png` | `mobile/assets/onboarding-3.png` |
| 2.3 | Onboarding 4 | 4:5 | `design/source-art/mobile/onboarding-4.png` | `mobile/assets/onboarding-4.png` |
| 2.4 | Mobile empty lesions | 4:5 | `design/source-art/mobile/empty-lesions.png` | `mobile/assets/empty-lesions.png` |
| 2.4 | Mobile empty caught up | 4:5 | `design/source-art/mobile/empty-caughtup.png` | `mobile/assets/empty-caughtup.png` |
| 2.4 | Mobile empty notifications | 4:5 | `design/source-art/mobile/empty-notifications.png` | `mobile/assets/empty-notifications.png` |
| 2.5 | Store screenshot frame 1 | 9:16 | `design/source-art/marketing/screenshot-frame-1.png` | `marketing/store/screenshot-frame-1.png` |
| 2.5 | Store screenshot frame 2 | 9:16 | `design/source-art/marketing/screenshot-frame-2.png` | `marketing/store/screenshot-frame-2.png` |
| 2.5 | Store screenshot frame 3 | 9:16 | `design/source-art/marketing/screenshot-frame-3.png` | `marketing/store/screenshot-frame-3.png` |
| 2.5 | Store screenshot frame 4 | 9:16 | `design/source-art/marketing/screenshot-frame-4.png` | `marketing/store/screenshot-frame-4.png` |
| 2.5 | Store screenshot frame 5 | 9:16 | `design/source-art/marketing/screenshot-frame-5.png` | `marketing/store/screenshot-frame-5.png` |

Next guide: [`IMAGE_TO_ANIMATION_GUIDE.md`](IMAGE_TO_ANIMATION_GUIDE.md).
