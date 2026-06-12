# Image To Animation Guide - Skin Lesion XAI

This guide starts after [`CHATGPT_IMAGE_PROMPTS.md`](CHATGPT_IMAGE_PROMPTS.md). It teaches you how to use your generated still images and the Higgsfield skills installed in this repo to create calm website motion - entirely from Claude Code desktop, no browser required.

The Higgsfield skills (`higgsfield-generate`, `higgsfield-product-photoshoot`) are installed under `.agents/skills/` and symlinked for Claude Code. You can invoke them by typing `/higgsfield-generate` or `/higgsfield-product-photoshoot` in Claude Code. All video generation runs through the `higgsfield` CLI, which Claude Code controls for you.

---

## What You Are Building

Three levels of motion:

1. **Hero video loop** - the main cinematic landing-page background or hero accent.
2. **Subtle UI motion** - scroll reveal, parallax, hover, fade, and reduced-motion fallbacks in Next.js.
3. **Static optimized assets** - most images stay still and are just resized/compressed for the website.

Do not animate everything. This is a clinical education product. Heavy motion belongs only on the public marketing landing page. Patient, doctor, admin, and research screens should stay calm.

---

## Safety Rules

Never upload these to Higgsfield:

- Real patient photos
- Skin lesion photos
- Faces tied to a medical condition
- PHI or private user data
- Anything that looks diagnostic

Only upload abstract brand assets from `design/source-art/`.

Every animation must avoid:

- Diagnosis claims
- Cancer detection language
- Treatment claims
- Flashing or strobing
- Fast zooms into medical imagery
- Alarmist red motion
- Purple-blue AI glow
- Anatomy spectacle

Why: the app is educational and privacy-aware. Motion should create trust, not medical drama.

---

# Step 0 - Bootstrap The Higgsfield CLI

You only do this once per machine.

## 0.1 Open Claude Code In The Frontend Repo

Make sure Claude Code is open at:

```text
C:\Users\saiyu\Desktop\projects\KI_projects\Skin_Lesion_GRADCAM_Classification\Skin_Lesion_Classification_frontend
```

## 0.2 Install The Higgsfield CLI

Paste this into Claude Code:

```text
Check whether the higgsfield CLI is installed by running: higgsfield --version

If it is not installed, install it by running:
curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh

Then verify it is on PATH with: higgsfield --version
```

What success looks like:

```text
higgsfield x.y.z
```

## 0.3 Authenticate

In your terminal (not Claude Code - this is interactive):

```bash
higgsfield auth login
```

Follow the browser prompt. When it finishes, confirm back in Claude Code:

```text
higgsfield account status
```

Expected result: your account email and plan tier. If you see `Session expired`, run `higgsfield auth login` again in terminal.

Why: authentication is interactive and cannot run inside Claude Code. Everything after login can.

---

# Step 1 - Check Where Your Images Are Now

Ask Claude Code:

```text
List all files under design/source-art/ and public/brand/ that are PNG, JPG, JPEG, WebP, MP4, or WebM. Show relative paths from the repo root.
```

Your abstract brand assets for animation should be here:

```text
design/source-art/web/hero-bg-plate.png      <- primary hero target
design/source-art/web/hero-keyvisual.png
design/source-art/web/poster-launch.png
design/source-art/mobile/splash.png          <- mobile, do later
```

---

# Step 2 - Create The Animation Folders

Paste this into Claude Code:

```text
Create these directories if they do not exist:
- design/source-art/video-raw
- design/source-art/video-final
- public/brand
- public/brand/video

Then verify each path exists.
```

What success looks like: Claude Code confirms all four directories exist.

Why:

- `design/source-art/video-raw` holds raw Higgsfield downloads.
- `design/source-art/video-final` holds compressed video before shipping.
- `public/brand/video` is where the Next.js website loads final videos from.

---

# Step 3 - Decide What To Animate

| Asset | File | Animate? | Why |
|---|---|---|---|
| Hero background | `design/source-art/web/hero-bg-plate.png` | Yes | Best source for calm looping background motion |
| Hero key visual | `design/source-art/web/hero-keyvisual.png` | Maybe | Subtle parallax candidate; code motion may be better |
| Launch poster | `design/source-art/web/poster-launch.png` | Optional | Good for a short marketing teaser |
| Grad-CAM explainer | `design/source-art/web/gradcam-explainer.png` | No | Keep static |
| How-it-works icons | `design/source-art/web/howitworks-*.png` | No | Code hover is enough |
| Feature images | `design/source-art/web/feature-*.png` | No | Static is clearer |
| Body map | `design/source-art/web/bodymap-*.png` | No | Must be code-driven |
| Trust icons | `design/source-art/web/trust-*.png` | No | Static icons |
| Mobile splash | `design/source-art/mobile/splash.png` | Later | Do web hero first |

Recommended first target: `design/source-art/web/hero-bg-plate.png`

---

# Step 4 - Generate The Hero Video Loop With Higgsfield

This entire step runs inside Claude Code. No browser needed.

## 4.1 Invoke The Skill

In Claude Code, type:

```
/higgsfield-generate
```

This loads the Higgsfield generation skill.

## 4.2 Paste This Request

After the skill loads, paste:

```text
Use Higgsfield to create a calm 5-second looping hero background video for a Clinical Premium healthcare website.

Source image: design/source-art/web/hero-bg-plate.png

Model: Seedance 2.0 (seedance_2_0)
Settings:
- start-image: design/source-art/web/hero-bg-plate.png
- duration: 5
- aspect_ratio: 16:9
- wait: true

Motion prompt:
Create a calm seamless 5 second looping hero background from this image.

Motion should be very subtle:
- slow drifting gradient mesh
- faint contour lines moving with gentle parallax
- tiny soft particles drifting slowly upward
- a restrained teal glow that breathes gently

The image should remain abstract and clinical. Keep the composition stable.

Do not add people, faces, skin, lesions, anatomy, organs, text, logos, medical diagnosis symbols, cancer language, fast zooms, camera shake, red alert effects, or purple/blue AI glow.

Style: calm Clinical Premium healthcare product. Quiet, trustworthy, precise, privacy-aware.

Output: 16:9, 5 seconds, silent, loopable, first and last frame should feel nearly identical.

When generation completes, save the output URL and download the video to:
design/source-art/video-raw/hero-bg-plate-higgsfield-raw.mp4
```

The CLI command Claude Code will run looks like this (for reference):

```bash
higgsfield generate create seedance_2_0 \
  --prompt "Create a calm seamless 5 second looping hero background from this image..." \
  --start-image design/source-art/web/hero-bg-plate.png \
  --duration 5 \
  --aspect_ratio 16:9 \
  --wait
```

## 4.3 Review The Draft

Accept the result only if:

- [ ] It stays abstract.
- [ ] It has no skin, lesions, people, or text.
- [ ] Motion is slow enough to read website text over it.
- [ ] It does not flash.
- [ ] It does not introduce red warning energy.
- [ ] It feels calm and premium.

If it is too busy, run a second generation with this prompt adjustment added to the end:

```text
Make the motion 70 percent slower and calmer. Keep the original composition more stable. Remove any dramatic camera movement.
```

Save the raw result as:

```text
design/source-art/video-raw/hero-bg-plate-higgsfield-raw.mp4
```

---

# Step 5 - Generate A Second Option

Two options before you commit to one. Same skill, different prompt emphasis.

In Claude Code, invoke `/higgsfield-generate` again and paste:

```text
Use Higgsfield to create a second calm hero loop for comparison.

Source image: design/source-art/web/hero-bg-plate.png

Model: Seedance 2.0 (seedance_2_0)
Settings: same as before - start-image, duration 5, aspect_ratio 16:9, wait true

Prompt:
Create a calm 5 second loopable website hero background from this abstract clinical image.

Motion:
- almost still camera
- extremely slow light sweep from left to right
- soft contour lines drifting by only a few pixels
- gentle depth in background layers
- no large object movement

Keep it clean enough for website hero text to sit above it.

Do not add people, faces, skin, lesions, anatomy, organs, text, logos, diagnosis language, cancer language, fast movement, flashing, camera shake, or red warning effects.

Style: Clinical Premium. Calm, private, precise, trustworthy, modern healthcare website.

Output: 16:9, 5 seconds, silent, loopable.

Save to: design/source-art/video-raw/hero-bg-plate-higgsfield-alt-raw.mp4
```

Pick the calmer of the two raw MP4s before continuing.

---

# Step 6 - Score The Videos With Virality Predictor (Optional)

The Higgsfield skill includes a Virality Predictor that scores attention, hook strength, and distraction risk. For a healthcare hero loop you want a low distraction score and low Default Mode score (means no mind-wandering). This step is optional but useful.

In Claude Code, invoke `/higgsfield-generate` and paste:

```text
Use Higgsfield Virality Predictor to score both hero loops.

Run brain_activity on each:
- design/source-art/video-raw/hero-bg-plate-higgsfield-raw.mp4
- design/source-art/video-raw/hero-bg-plate-higgsfield-alt-raw.mp4

The CLI commands are:
higgsfield generate create brain_activity --video <path> --wait

For each video report:
- Overall score
- Default Mode score (lower is better for a calm background)
- Distraction risk
- Which one you recommend for a clinical Premium healthcare website hero

Recommendation: pick the one with lower distraction risk and lower Default Mode score.
```

---

# Step 7 - Compress The Video For The Website

Still in Claude Code. Replace `hero-bg-plate-higgsfield-raw.mp4` below with whichever file you chose.

Paste this into Claude Code:

```text
Use ffmpeg to compress the chosen Higgsfield video for web delivery. If ffmpeg is not installed, tell me before running any commands.

Source: design/source-art/video-raw/hero-bg-plate-higgsfield-raw.mp4

Step 1 - Create a compressed MP4:
ffmpeg -i design/source-art/video-raw/hero-bg-plate-higgsfield-raw.mp4 \
  -t 5 -an -vcodec libx264 -crf 28 -preset slow -pix_fmt yuv420p \
  -movflags +faststart design/source-art/video-final/hero-loop.mp4

Step 2 - Create a WebM fallback:
ffmpeg -i design/source-art/video-final/hero-loop.mp4 \
  -an -c:v libvpx-vp9 -b:v 0 -crf 34 \
  design/source-art/video-final/hero-loop.webm

Step 3 - Extract a poster image:
ffmpeg -i design/source-art/video-final/hero-loop.mp4 \
  -vframes 1 design/source-art/video-final/hero-loop-poster.jpg

Step 4 - Copy all three to the website public folder:
- design/source-art/video-final/hero-loop.mp4 -> public/brand/video/hero-loop.mp4
- design/source-art/video-final/hero-loop.webm -> public/brand/video/hero-loop.webm
- design/source-art/video-final/hero-loop-poster.jpg -> public/brand/video/hero-loop-poster.jpg

Verify all three files exist in public/brand/video/ after copying.
```

Why:
- `-t 5` keeps it to 5 seconds.
- `-an` strips audio.
- `-crf 28` compresses for web without visible quality loss.
- `-movflags +faststart` makes the browser start playing before the full file downloads.
- WebM is served first by browsers that support it (usually smaller), MP4 is the fallback.

---

# Step 8 - Integrate The Hero Video Into Next.js

Paste this into Claude Code:

```text
Use the existing Next.js frontend patterns and integrate the hero loop into the public landing page.

Files available:
- public/brand/video/hero-loop.mp4
- public/brand/video/hero-loop.webm
- public/brand/video/hero-loop-poster.jpg

Requirements:
- Add the video only to the marketing landing page, not patient/doctor/admin screens.
- Use a poster image so there is no blank flash before the video loads.
- Autoplay muted loop playsInline.
- Add a prefers-reduced-motion fallback that shows only the poster image - no video autoplay.
- Keep text readable over the video.
- Do not add diagnosis, cancer detection, or treatment language.
- Do not install new dependencies unless you explain why plain CSS cannot work.
- Preserve existing Next.js app structure.
- Run npm run type-check and npm run build when done.

Before editing, inspect app/page.tsx, any existing styles, and package.json.
```

What success looks like:

- Landing page uses `/brand/video/hero-loop.webm` and `/brand/video/hero-loop.mp4`.
- Reduced-motion users see only the poster image.
- Website copy stays medically safe.
- `npm run type-check` passes.
- `npm run build` passes.

---

# Step 9 - Generate Additional Brand Assets With Higgsfield

Now that the hero loop works, you can use Higgsfield to generate better landing page images. Invoke `/higgsfield-product-photoshoot` for product-style brand visuals, or `/higgsfield-generate` for conceptual graphics.

## 9.1 Upgrade The Hero Keyvisual

In Claude Code, invoke `/higgsfield-generate` and paste:

```text
Use Higgsfield GPT Image 2 to generate a new hero keyvisual for a Clinical Premium healthcare web app.

The existing source is: design/source-art/web/hero-keyvisual.png

Generate a replacement hero keyvisual with:
- gpt_image_2 model
- aspect_ratio: 16:9
- resolution: 2k
- Prompt: Abstract clinical precision graphic. Clean off-black background. Soft teal and white gradient mesh suggesting data visualization or heat mapping. No people, no faces, no skin, no anatomy, no lesions. No text or labels. No AI cliche purple glow. Quiet, trustworthy, modern healthcare aesthetic. Clinical Premium. Think scientific instrument, not consumer tech.

Save the result URL and download to: design/source-art/web/hero-keyvisual-v2.png
```

## 9.2 Upgrade The How-It-Works Illustrations

For each how-it-works image, invoke `/higgsfield-generate` with GPT Image 2:

```text
Use Higgsfield GPT Image 2 to upgrade the how-it-works illustrations.

For each of the following, generate a replacement:

1. design/source-art/web/howitworks-upload.png
   Prompt: Minimal flat illustration of a document or file being submitted to a secure system. Off-black background, white and teal palette, no people, no faces, no skin, no medical imagery, clean icon style.
   Save to: design/source-art/web/howitworks-upload-v2.png

2. design/source-art/web/howitworks-heatmap.png
   Prompt: Abstract visualization of a gradient heatmap overlay - soft warm tones on a dark background, no anatomy, no skin, no faces, looks like a scientific visualization tool, not medical imagery.
   Save to: design/source-art/web/howitworks-heatmap-v2.png

3. design/source-art/web/howitworks-review.png
   Prompt: Minimal illustration of a checklist or review interface. Clinical, precise, white/teal on dark background, no people, no faces.
   Save to: design/source-art/web/howitworks-review-v2.png

4. design/source-art/web/howitworks-explain.png
   Prompt: Abstract AI explainability graphic - nodes and edges forming a transparent network, teal accent, dark background, no people, no anatomy.
   Save to: design/source-art/web/howitworks-explain-v2.png

Use gpt_image_2, resolution 2k, aspect_ratio 1:1 for all.
```

---

# Step 10 - Improve Website Motion Design

After the hero video is integrated, use this to add UI motion throughout the landing page.

Paste into Claude Code:

```text
Improve the public landing page motion design for Skin Lesion XAI.

Design direction:
- Clinical Premium
- calm, trustworthy, private, precise
- no flashy AI gradients
- no purple glow
- no diagnosis/cancer/treatment claims
- heavy motion only on the marketing landing page
- patient and doctor product surfaces should stay restrained

Motion requirements:
- subtle hero parallax only if it does not hurt readability
- scroll reveal for feature sections using CSS or existing React patterns
- hover states for cards and buttons
- all motion must respect prefers-reduced-motion
- animate transform and opacity only - never layout properties
- no strobe, no fast zoom, no dramatic camera energy

Do not install Framer Motion, GSAP, Three.js, or other animation libraries unless you explain why plain CSS cannot meet the requirement. Prefer CSS first.

Run npm run type-check and npm run build when done.
```

---

# Step 11 - Mobile Animation (Do Later)

Do not do mobile animation until the web hero works end to end.

When ready, invoke `/higgsfield-generate` and paste:

```text
Use Higgsfield to create a calm 3-second mobile splash animation.

Source image: design/source-art/mobile/splash.png

Model: Seedance 2.0
Settings:
- start-image: design/source-art/mobile/splash.png
- duration: 3
- aspect_ratio: 9:16
- wait: true

Prompt:
Create a calm 3 second mobile splash animation from this image.

Motion:
- centered mark gently fades in
- background gradient breathes very slightly
- contour lines drift almost imperceptibly

Do not add people, faces, skin, lesions, anatomy, text, diagnosis language, cancer language, treatment language, flashing, fast zoom, or alarmist red.

Output: 9:16, 3 seconds, silent, calm, suitable for a healthcare education app.

Save to: design/source-art/video-raw/mobile-splash-higgsfield-raw.mp4
```

Do not wire this into the app until the mobile app is the current build target.

---

# Step 12 - Verification Checklist

Before saying the animation is ready:

Paste into Claude Code:

```text
Verify the animation integration is complete:

1. Check these files exist:
   - public/brand/video/hero-loop.mp4
   - public/brand/video/hero-loop.webm
   - public/brand/video/hero-loop-poster.jpg

2. Run: npm run type-check
3. Run: npm run build

Report all results. If any check fails, fix it before reporting done.
```

Also manually check in your browser:

- [ ] Hero text is readable over the video.
- [ ] Video is silent.
- [ ] Video loops without a visible cut.
- [ ] Reduced-motion fallback shows only the poster (test with browser devtools or OS setting).
- [ ] No medical diagnosis or cancer-detection language was added.
- [ ] No patient, lesion, or skin imagery was uploaded or animated.

---

# Quick Recovery

If the Higgsfield video looks bad:

1. Do not delete the raw file.
2. Generate a second version with slower motion (adjust the prompt).
3. Use the calmer one.
4. If both are too busy, fall back to CSS-only motion.

CSS-only fallback prompt for Claude Code:

```text
Skip video integration for now. Use the poster image and CSS-only motion for the landing page hero.

Reference art direction: design/source-art/web/hero-bg-plate.png
Poster to display: public/brand/video/hero-loop-poster.jpg (if it exists) or the source PNG directly.

Create a calm Clinical Premium animated background using CSS gradients, opacity, and transform only.

Requirements:
- no new dependencies
- respects prefers-reduced-motion
- subtle enough for readable text
- no flashy AI look
- no diagnosis/cancer/treatment language
- run npm run type-check and npm run build
```

---

# Higgsfield Skills Reference

| Skill | Invoke | Best For |
|---|---|---|
| `higgsfield-generate` | `/higgsfield-generate` | Image-to-video loops (Seedance 2.0), abstract graphics (GPT Image 2), virality scoring |
| `higgsfield-product-photoshoot` | `/higgsfield-product-photoshoot` | Landing page lifestyle and hero brand images |
| `higgsfield-marketplace-cards` | `/higgsfield-marketplace-cards` | App store and marketplace listing cards |
| `higgsfield-soul-id` | `/higgsfield-soul-id` | Character consistency across images (not needed for this project's first pass) |

Key models for this project:

| Task | Model |
|---|---|
| Image-to-video hero loop | `seedance_2_0` |
| Abstract brand graphics | `gpt_image_2` |
| Score a finished video | `brain_activity` (Virality Predictor) |

---

# Summary

Recommended path from zero to live hero loop:

```text
Step 0: Install higgsfield CLI + auth login (one time)
        ↓
Step 1-3: Confirm assets exist, create folders, decide what to animate
        ↓
Step 4: /higgsfield-generate → seedance_2_0 → hero-bg-plate.png → 5s 16:9 loop
        ↓
Step 5: Generate a second option for comparison
        ↓
Step 6 (optional): Score both with Virality Predictor, pick the calmer one
        ↓
Step 7: Claude Code runs ffmpeg → hero-loop.mp4 + .webm + poster.jpg
        ↓
Step 8: Claude Code integrates into app/page.tsx with reduced-motion fallback
        ↓
Step 9: Upgrade other brand assets with /higgsfield-generate GPT Image 2
        ↓
Step 10: Claude Code adds scroll reveal and hover motion in CSS
        ↓
Step 12: Verify npm run type-check and npm run build pass
```

Keep it calm. The goal is trust, not spectacle.
