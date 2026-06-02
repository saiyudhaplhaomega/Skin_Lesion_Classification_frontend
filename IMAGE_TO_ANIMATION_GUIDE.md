# Image → Animation Guide — Skin Lesion XAI (Web + Mobile)

> ## 📍 This file is **Step 2 of 2** (do the image file first)
> This is the **visuals doc set**. Correct order:
> 1. **[`CHATGPT_IMAGE_PROMPTS.md`](CHATGPT_IMAGE_PROMPTS.md)** ← **do this first** — generate the still images. Nothing here works until those exist.
> 2. **`IMAGE_TO_ANIMATION_GUIDE.md`** ← *you are here* — place each image, animate the ones that should move, and wire it all into the web + mobile UI.
>
> Inside this file, go in order: **§1 place & prep → §2–§4 animate → §5 integrate → §6 worked example.** Code-side motion libraries (Framer Motion / GSAP / Reanimated) are covered in **[`CLAUDE_DESIGN_PROMPTS.md`](CLAUDE_DESIGN_PROMPTS.md) Step 7**; this file is the **content pipeline** (making the moving assets themselves).

How to turn the still images from [`CHATGPT_IMAGE_PROMPTS.md`](CHATGPT_IMAGE_PROMPTS.md) into the animations and motion that bring the website and mobile app to life — and how to wire them into the actual UI/UX (Next.js web + React Native mobile) without hurting performance or breaking the medical-safety tone.

---

## ⚠️ Animation safety rules (same spirit as the image rules)

- **Heavy/cinematic motion is for the marketing landing page only.** Patient and clinical screens stay calm: gentle fades, soft slides, subtle skeletons.
- **Respect `prefers-reduced-motion`** everywhere — every animation needs a still fallback.
- **No flashing/strobe, no fast zooms on medical content, no alarmist motion.** Status meaning must never depend on animation alone (always icon + text + color).
- **Nothing animated should depict real skin/lesions or imply diagnosis.** Animate the abstract brand motifs only (attention fields, contour drift, particles, UI micro-interactions).
- **Performance is a feature in healthcare UX:** target 60fps, keep hero video small, lazy-load, and never block first paint.

---

## The big picture — 4 ways to animate, pick per asset

| Method | Best for | Output | Where it runs |
| --- | --- | --- | --- |
| **A. Image → Video (AI)** | Hero background loop, launch teaser, cinematic moments | MP4 / WebM (looping) | `<video>` on web, `react-native-video` on mobile |
| **B. Lottie (vector)** | Icons, micro-interactions, empty-states, onboarding, splash mark | `.json` (tiny, crisp, scalable) | `lottie-web` / `lottie-react`, `lottie-react-native` |
| **C. Code motion** | Hover, scroll reveals, layout transitions, parallax | No asset — pure code | Framer Motion / GSAP (web), Reanimated (mobile) |
| **D. Rive (interactive)** | State-driven interactive graphics (toggle, slider, progress) | `.riv` | `@rive-app/react-canvas`, `rive-react-native` |

Rule of thumb: **A** for the big atmospheric hero, **B** for everything small and crisp, **C** for the in-page interactions you already build in React, **D** when a graphic must react to user state.

---

# §1 — File placement & handling (where every image goes + how to prep it for animation)

This is the part that keeps the project sane. There are **two tiers of files** and you must not mix them:

- **Source tier — `frontend/design/source-art/`** — the raw, full-resolution ChatGPT downloads and raw AI video. **Never shipped to users.** This is your "negatives". You always animate/optimize *from* here.
- **Shipped tier — `frontend/public/brand/` (web) and `mobile/assets/` (mobile)** — the optimized, final files the app actually loads. Smaller, web-ready, correctly named.

Golden rule: **download → source tier → prep/animate → export optimized copy → shipped tier.** Never animate or optimize your only copy; never ship a 12 MB raw PNG.

## 1.1 Step 1 — Download from ChatGPT and place it

1. In ChatGPT, hover the generated image → **download** (you get a `.png`, usually 1024–2048px).
2. **Rename it immediately** using the kebab-case name from the inventory table in `CHATGPT_IMAGE_PROMPTS.md` (e.g. `hero-bg-plate.png`, not `ChatGPT-Image-Jun-3.png`). Future-you and the code imports depend on exact names.
3. **Move it into the source tier**, mirroring where it will ship:
   - web art → `frontend/design/source-art/web/`
   - mobile art → `frontend/design/source-art/mobile/`
4. Only later do you export the optimized version into `public/brand/` or `mobile/assets/`. Keep the source.

> On Windows, the workspace path for `frontend/` maps into the Linux sandbox — you can run the ffmpeg/optimize commands there. Do file moves in your normal file explorer or VS Code; keep the folder names exactly as above so imports resolve.

## 1.2 Step 2 — Decide: does this asset move? which method?

Use this decision table before touching any animation tool. It also tells you the format you're aiming for.

| If the asset is… | Animate it? | Method | Final format → shipped path |
| --- | --- | --- | --- |
| Hero background plate (§1.2) | Yes (atmospheric) | A (AI video) **or** code gradient (§3) | `hero.mp4`+`hero.webm`+`hero-poster.jpg` → `public/brand/` |
| Hero key visual / focal card (§1.1) | Light | C (Framer Motion breathing/parallax) | keep PNG, animate in code → `public/brand/` |
| How-it-works icons (§1.3) | Yes (micro) | B (Lottie) | `*.json` → `public/brand/lottie/` |
| Empty-states / onboarding (§1.7, §2.3) | Subtle | B (Lottie) or static | `*.json` or PNG → `public/brand/` / `mobile/assets/` |
| Splash mark (§2.2) | Yes (entrance) | B (Lottie) or D (Reanimated) | `*.json` → `mobile/assets/lottie/` |
| Feature illustrations, posters, body-map, icons, store frames | No (static) | — | optimized PNG/SVG → shipped tier |
| Toggle/slider/progress that reacts to state | Yes (interactive) | D (Rive) | `*.riv` → shipped tier |

If a row says "static," skip §2–§4 and jump to §1.5 (optimize) then place it.

## 1.3 Step 3 — Prep the still so it animates cleanly

Animation tools reward clean, correctly-shaped, layered inputs. Do these in the source tier:

1. **Hit the target aspect ratio first.** Video tools letterbox or crop badly if the input ratio ≠ output ratio. Re-ask ChatGPT *"regenerate at exactly 16:9"* (web hero) or `9:16` (mobile), or crop in any editor. Common: 16:9 web, 9:16 mobile, 1:1 icon, 4:5 social.
2. **Get enough resolution.** Most image-to-video tools want a reasonably large input (roughly **≥ 1280px on the long edge**, ideally 1920×1080 for a 16:9 hero). If the ChatGPT output is small, ask *"make a cleaner, higher-resolution version, same exact composition"* or upscale.
3. **Separate layers when you want depth/parallax.** This is the single biggest quality upgrade for Method A and C. Ask ChatGPT for the same scene in pieces:
   - *"give me ONLY the focal object on a transparent background, same composition"* → `hero-keyvisual_focal.png`
   - *"give me ONLY the background plate, no focal object"* → `hero-keyvisual_bg.png`
   Then you can move foreground and background independently (parallax in code) or feed just the layer that should move into the video tool.
4. **Decide transparency vs opaque per use:**
   - **Icons / illustrations / focal cards** → keep a **transparent background (alpha PNG)** so they sit over any UI.
   - **Hero/video backgrounds** → **opaque, edge-to-edge**, evenly lit (no transparency — video has no alpha in MP4 anyway).
   - For true transparent *video* (rare, e.g. a floating animated mark over UI) you need WebM with alpha or a Lottie/Rive instead — MP4 cannot hold transparency.
5. **Flatten text out.** If the still has placeholder text bands, leave them empty — real text is added in code so it stays crisp and translatable. Don't animate baked-in text.

## 1.4 Step 4 — Naming convention (so code imports never break)

- All lowercase, kebab-case: `feature-timeline.png`, `howitworks-upload.json`.
- Layer suffixes: `_bg`, `_focal`, `_fg` (e.g. `hero-keyvisual_focal.png`).
- Variants: `-dark` / `-light`, `-mobile` / `-9x16`, `@2x` for retina if you export sizes.
- Sequenced sets: `onboarding-1.png … onboarding-4.png`.
- Outputs of one source share its stem: `hero.png` → `hero.mp4`, `hero.webm`, `hero-poster.jpg`.

## 1.5 Step 5 — Optimize before it ships (static assets)

Even static images must be shrunk before landing in the shipped tier:

```bash
# PNG/JPG: resize + compress with sharp (or use squoosh.app in the browser)
npx sharp-cli -i source-art/web/feature-timeline.png -o public/brand/feature-timeline.png resize 800

# Make a modern, smaller WebP/AVIF copy for the web (Next/Image can serve these)
npx sharp-cli -i public/brand/feature-timeline.png -o public/brand/feature-timeline.webp

# SVG (body-map silhouettes, icons traced to vector): minify
npx svgo public/brand/bodymap-front.svg
```
Then the file is ready to import in code. Animated outputs (video/Lottie) are optimized in their own sections (§2.3, §4.2).

---

# §2 — Method A: Image → Video with AI (hero loops & teasers)

You only need a few short, calm clips (a hero background loop, maybe a launch teaser), so pick a tool with strong quality-per-dollar. Two tools are worth knowing well, and this guide gives you **baby-step instructions for both**:

- **[Seedance](https://seed.bytedance.com/en/seedance) (ByteDance)** — *recommended primary for quality.* Excellent image-to-video, very strong motion stability, 1080p, and the **best price-per-clip** of the frontier models. You can reach it two ways, both covered below: through **[Higgsfield](https://higgsfield.ai)** (easiest, one dashboard — see §2.5) or **directly** through ByteDance's own **Dreamina** app / BytePlus API (see §2.6).
- **[Kling](https://klingai.com)** — *recommended primary for "free".* Generous free daily credits (enough for several short gens/day) and great quality. Use it when you want a $0 path and don't need Seedance's extra polish.

Either one produces the calm hero loop you need. If you're not sure, start with **Higgsfield → Seedance** (§2.5): it's the gentlest on-ramp and you can A/B other models from the same screen.

**Tool options (verify current pricing in-app — it changes monthly):**

| Tool | How you reach it | Why / cost (2026) | Use when |
| --- | --- | --- | --- |
| **Seedance** *(primary, quality)* | Via **Higgsfield** (§2.5) **or** direct **Dreamina** / **BytePlus API** (§2.6) | ByteDance's flagship video model (Seedance 2.0: multi-shot, native audio, character consistency, up to 1080p / ~15s). Cheapest per-clip of the frontier models; Fast mode roughly halves the credit cost. | Default for the hero loop and the launch teaser when you want the cleanest result. |
| **Kling** ([klingai.com](https://klingai.com)) *(primary, free)* | Direct on klingai.com | Free daily credits (~6 short gens/day), cheap top-ups, low per-second cost. | When you want a likely-$0 path or a quick alternate take. |
| **Higgsfield** ([higgsfield.ai](https://higgsfield.ai)) *(aggregator)* | Direct on higgsfield.ai | One dashboard for **Seedance + Kling + Veo + Sora** plus camera/Cinema presets, start/end-frame control, and character consistency. From ~$15/mo; frontier models and audio burn credits faster. | The easiest way to *use* Seedance, and to A/B several models side by side. Keep camera moves minimal for this clinical product. |
| **Hailuo / MiniMax** ([hailuoai.video](https://hailuoai.video)) | Direct | Cheapest flat subscription (~$8/mo annual), solid quality. | If you prefer a tiny predictable monthly fee over credits. |
| **Runway / Pika / Luma** | Direct | Mature, polished, paid. | Fine alternates if you already use them. |

> ⚠️ **Privacy (read this before uploading anything):** these are third-party services and several (Seedance/ByteDance, Kling, Hailuo) are China-based. Only ever upload the **abstract brand/marketing stills** from `CHATGPT_IMAGE_PROMPTS.md`. **Never upload real patient images, lesion photos, faces, or any PHI** to any of them. Because everything you animate here is abstract gradient/contour art with no people, none of these tools' face/character features apply to you — which also means you never trip their face content-filters.

### 2.1 Step-by-step (the shape of every image-to-video tool)

Every tool — Seedance via Higgsfield, Seedance direct, Kling, Hailuo, Runway — follows the same five beats. Learn them once here; §2.5 (Higgsfield Seedance) and §2.6 (direct Seedance) give you the exact click-by-click for the two you'll actually use.

1. Open the tool, sign in, and find the **Image to Video** mode (sometimes a tab, sometimes a toggle next to "Text to Video").
2. **Upload your still** (e.g. `hero-bg-plate.png` from image prompt §1.2). This image is the visual anchor for the whole clip, so feed it the cleanest, highest-res version (§1.3).
3. Paste a **motion prompt** (templates in §2.2). Set duration short: **4–6 seconds** is plenty for a loop, and shorter = fewer credits.
4. Generate, review, regenerate with tweaks. **Pick the calmest take** — for this product, less motion is better. Use the cheaper **Standard/Fast** quality mode to save credits; only reach for Pro/HQ if a clip really needs it.
5. Download the MP4. Then make it loop-friendly and small (see §2.3).

> 🔁 **The single best loop trick:** if your tool has a **start frame + end frame** input (Seedance on Higgsfield does, so do Kling and Runway), set **both the start and end frame to the *same* still**. The model then animates *away from* the image and *back to* it, giving you a near-perfect seamless loop with almost no ffmpeg surgery later. This is the easiest way to get a clean hero loop. See §2.5 step 5.

### 2.2 Motion prompt templates (copy-paste, keep them calm)

These are written to work in **any** tool. For **Seedance specifically**, prepend the shot-structure line it expects (`Shot structure: 1 continuous shot, N seconds, 16:9, looping.`) — §2.7 has Seedance-tuned versions with that line already baked in, plus the loop-frame settings. The wording below is deliberately restrained: for a clinical product, under-animate.

**Hero background loop (from `hero-bg-plate.png`):**
```text
Animate this abstract clinical background as a slow, seamless, loopable motion.
Motion: gentle drifting gradient mesh, very slow parallax on the soft contour lines,
faint particles floating upward slowly, a subtle breathing glow in the teal areas.
No camera shake, no fast zoom, no new objects, no text, no people, no logos.
Calm, premium, meditative. Loopable so the first and last frame match. Duration 6 seconds.
```

**Hero key-visual subtle motion (from `hero-keyvisual.png`):**
```text
Add subtle life to this product key visual. The floating "attention field" card gently
breathes and its teal-to-amber gradient slowly shifts within the card. The background
cards drift a few pixels with soft parallax. Everything else stays still.
No skin, no morphing into anatomy, no text changes, no fast motion. Elegant and minimal.
Loopable, 6 seconds.
```

**Launch teaser (from `poster-launch.png`) — bolder, marketing only:**
```text
Create a cinematic but calm 8-second product teaser from this poster. Slow push-in on the
frosted-glass explanation card, the attention gradient softly animating, light particles
drifting, gentle rim-light sweep. Keep the headline area clean (no text). Premium healthcare-tech
mood, no alarmist energy, no realistic skin. Smooth, elegant, loop-friendly.
```

> ✍️ **Prompt-writing rules that hold across every tool:** (1) name the *one* thing that should move and say everything else stays still — vague "make it dynamic" prompts produce slop; (2) always include the negatives (`no camera shake, no text, no people, no fast zoom`); (3) say "loopable / first and last frame match" so the model aims for a clean cut; (4) keep duration at 4–6s for loops. If a tool offers an **"Enhance"** button (Higgsfield does), it rewrites your prompt into something more cinematic — **read the rewritten version before generating** and delete anything that adds drama, faces, or motion you didn't ask for.

### 2.3 Make it loop seamlessly + small (ffmpeg)

AI clips often aren't perfectly loopable and are too heavy. Fix both in the sandbox/terminal with **ffmpeg**:

```bash
# 1) Trim to the cleanest seconds (example: 0.5s to 6.5s)
ffmpeg -i raw.mp4 -ss 00:00:00.5 -t 6 -an trimmed.mp4

# 2) Make a seamless loop by crossfading the end back into the start (boomerang-free)
#    Simple reliable approach: forward + reversed = perfect loop ("boomerang")
ffmpeg -i trimmed.mp4 -filter_complex "[0]reverse[r];[0][r]concat=n=2:v=1:a=0" loop.mp4

# 3) Export web-optimized MP4 (H.264) AND WebM (VP9) for smaller size
ffmpeg -i loop.mp4 -an -vcodec libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart hero.mp4
ffmpeg -i loop.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 34 hero.webm

# 4) Make a poster image (first frame) shown before the video loads
ffmpeg -i hero.mp4 -vframes 1 hero-poster.jpg
```

**Targets:** hero loop **≤ 3–5 MB** if possible (the 30–40 MB ceiling some guides mention is a maximum, not a goal — smaller is better for healthcare UX). Strip audio (`-an`). Always ship a `poster` frame.

- **Save as:** `public/brand/hero.mp4`, `public/brand/hero.webm`, `public/brand/hero-poster.jpg`

### 2.4 Mobile note
For mobile, regenerate the loop at **9:16** (or crop), and keep it even shorter/lighter. Mobile uses `react-native-video` (see §5).

---

### 2.5 Seedance route A — via Higgsfield (the easy on-ramp, recommended first try)

[Higgsfield](https://higgsfield.ai) is a video studio that wraps Seedance (and Kling, Veo, Sora) behind one simple dashboard, with extras you actually want here: a **start/end-frame** input (for clean loops), an **Enhance** button, and **Fast/Standard** quality toggles. This is the gentlest way to use Seedance, so start here. **No coding, no API keys.**

**Click-by-click — do this once to make your first hero loop:**

1. **Create your account.** Go to **[higgsfield.ai](https://higgsfield.ai)** → **Sign up** (Google or email). You land on the dashboard.
2. **Pick a plan (or start on the lowest paid tier).** Seedance is available on **all** Higgsfield plans, so the cheapest one is enough for the handful of short clips this project needs. Good-to-know billing facts so you don't burn credits:
   - **Fast mode ≈ half the credits** of Standard. Draft in Fast, then re-render only your favourite in Standard.
   - A ~5s clip costs roughly **25 credits**; a 15s 720p clip ~90. You only need 4–6s loops, so each draft is cheap.
   - **Monthly credits don't roll over**, and **top-up packs expire after ~90 days** — don't buy a big pack you won't use this month.
3. **Open the video generator.** Click **Create → AI Video** (or the **Video** tool). In the **model picker**, choose **Seedance** (pick the newest version offered, e.g. **Seedance 2.0**).
4. **Switch to Image-to-Video and set the frame shape.** Find the **Image to Video** mode (a tab or toggle, next to "Text to Video"). Set the **aspect ratio**: `16:9` for the web hero, `9:16` for the mobile hero. Then **upload your still** — `hero-bg-plate.png` from the source tier (§1.1). Use the clean, high-res version (§1.3); Seedance treats the upload as the anchor for the entire clip, so a crisp input = a crisp video.
5. **🔁 Set up the seamless loop (the important bit).** If Higgsfield shows a **Start frame** and **End frame** slot, put the **same `hero-bg-plate.png` in both**. Seedance will drift away from the image and settle back onto it, so the clip ends where it began — a near-perfect loop with little ffmpeg work later. If only a start frame exists, that's fine; you'll fix the loop in §2.3.
6. **Paste the motion prompt.** Copy the **Seedance hero-loop prompt from §2.7** (it already includes the `Shot structure:` line Seedance likes and the calm negatives). Set **duration = 5s** (shorter = cheaper and easier to loop).
7. **Handle the Enhance button and audio.**
   - **Enhance** (optional): toggling it rewrites your prompt into something more cinematic. If you use it, **read the rewritten prompt and delete any added drama, camera moves, people, or text** before generating. For a calm clinical loop you usually don't need it.
   - **Audio:** Seedance 2.0 can generate **native sound**. You don't want it — a background hero loop is silent and you strip audio in §2.3 anyway. **Turn audio off** if there's a toggle; otherwise just ignore it (ffmpeg's `-an` removes it).
8. **Generate in Fast mode, review, iterate.** Render once in **Fast**. Watch it: is it calm, slow, loop-friendly, no skin/anatomy/text? If a take is too busy, lower the motion or tighten the prompt and regenerate. **Pick the calmest take**, then optionally re-render that one in **Standard** for the final.
9. **Download the MP4** and drop it in `frontend/design/source-art/video-raw/`. Now go to **§2.3** to trim, loop-clean, compress, and export `hero.mp4` / `hero.webm` / `hero-poster.jpg` into `public/brand/`.

> Bonus of staying in Higgsfield: you can re-run the **same still + same prompt on Kling or Veo** from the model picker and compare takes side by side, then keep the best one. Great for A/B-ing the hero without learning three separate apps.

### 2.6 Seedance route B — direct from ByteDance (Dreamina app, or the API for scale)

If you'd rather use Seedance straight from its maker (sometimes the earliest access to the newest version, and the cheapest at volume), there are two direct routes. **For a few hero clips, the Dreamina app is plenty — only use the API if you're scripting many generations.**

**Route B1 — Dreamina web app (no code, consumer credits):**

1. **Open the app.** Go to **[dreamina.capcut.com](https://dreamina.capcut.com)** (Dreamina is ByteDance's international creative app; the China version is **Jimeng / 即梦** at jimeng.jianying.com). **Sign in** with a CapCut / TikTok / Google / email account.
2. **Know the credits.** Dreamina runs on **credits shared across all its tools** (image, video, avatar), so your video budget depends on how you spend them. International plans run roughly **$18–$84/month**; Jimeng is ~**69 RMB/month** (~$9.60). There's usually a small **free daily credit** to test with before you pay.
3. **Start a video.** Click **Video generation** → choose the **Seedance** model (it defaults to the newest version) → select **Image to Video**.
4. **Upload + configure.** Upload `hero-bg-plate.png`, set **aspect ratio** (16:9 web / 9:16 mobile) and **duration** (5s), and paste the **§2.7 Seedance hero-loop prompt**. If Dreamina exposes a frame-control or "last frame" option, use the same-still loop trick from §2.5 step 5.
5. **Generate, review, download** the MP4 → `source-art/video-raw/` → then **§2.3** for loop-clean + compress.

**Route B2 — BytePlus ModelArk API (for developers who want to batch/script it):**

Use this only if you need to generate many clips programmatically (e.g. regenerate web + mobile + several gradient-angle variants in one run). It's the cheapest per clip and scriptable, but it's overkill for a handful of hero loops.

1. **Sign up** at **[byteplus.com](https://www.byteplus.com/en/product/seedance)** and open the **ModelArk** console. Create an **API key**.
2. **Pick the model.** Default to the newest, **Seedance 2.0** — it's now fully available on the BytePlus ModelArk API (it rolled out on the first-party API after a stretch where 1.5 Pro was the newest API version, so if you're on a third-party aggregator and don't see 2.0 yet, that's why). For these calm hero loops you don't need 2.0's headline features (multi-shot, native audio, character consistency), so the cheaper/faster tiers are fine too: **`Seedance 1.5 Pro`** or **`Seedance 1.0 Pro Fast`** (480p / 720p / 1080p, 24 fps, 2–12 s, mp4 out). On all of them, **image-to-video is priced the same as text-to-video**. Check the live model list for exact specs and per-second cost before you commit.
3. **Host the input still where the API can fetch it.** The API takes your image as a URL. Put the **abstract `hero-bg-plate.png`** on a temporary signed URL or any reachable static host. ⚠️ This must be **brand art only** — never a patient image, face, or any PHI on a public/temporary URL.
4. **Call the video endpoint** with `{ image_url, prompt, resolution, duration, ratio }` using the §2.7 prompt. Poll for the job, then download the returned MP4.
5. Pipe the output through **§2.3** (ffmpeg) exactly like the other routes.

> **Which direct route?** Dreamina = simplest, consumer-friendly, no code. BytePlus API = automation and lowest unit cost, but you write a little code and manage keys. **Higgsfield (§2.5) still wins for ease + model A/B**, so most people building this site should use §2.5 and treat §2.6 as the "I want it straight from ByteDance" or "I'm scripting it" option.

### 2.7 Seedance-tuned motion prompts (copy-paste, loop-ready)

Same calm intent as §2.2, but formatted the way Seedance follows best: a **shot-structure line first**, then the motion, then the negatives. Paste these into the Seedance prompt box (Higgsfield or Dreamina). Pair with the **start = end frame** loop setting from §2.5 step 5.

**Hero background loop (from `hero-bg-plate.png`) — web 16:9:**
```text
Shot structure: 1 continuous shot, 5 seconds, 16:9, seamless loop (first and last frame identical).
Motion: a slow drifting gradient mesh in off-white, mist and calm teal; very slow parallax on the
soft topographic contour lines; faint particles floating upward slowly; a gentle breathing glow in
the teal areas. Camera is locked and static.
Mood: calm, premium, clinical, meditative.
Do NOT: no camera shake, no zoom, no new objects, no text, no logos, no people, no skin, no anatomy,
no fast motion, no audio.
```

**Hero key-visual subtle motion (from `hero-keyvisual.png`) — web 16:9:**
```text
Shot structure: 1 continuous shot, 5 seconds, 16:9, seamless loop (first and last frame identical).
Motion: the floating "attention field" card gently breathes (scale within 2%) and its teal-to-amber
gradient slowly shifts inside the card; the background cards drift a few pixels with soft parallax;
everything else stays perfectly still. Camera is locked.
Mood: elegant, minimal, trustworthy.
Do NOT: no morphing into anatomy or skin, no text changes, no fast motion, no camera move, no audio.
```

**Mobile hero loop (from a 9:16 regenerated `hero-bg-plate`):**
```text
Shot structure: 1 continuous shot, 4 seconds, 9:16, seamless loop (first and last frame identical).
Motion: slow vertical drift of the gradient mesh and faint particles; very subtle teal breathing glow;
locked camera. Keep the center calm and clean for text on top.
Mood: calm, premium, fast-loading feel.
Do NOT: no camera shake, no zoom, no text, no people, no skin, no anatomy, no audio.
```

**Launch teaser (from `poster-launch.png`) — marketing only, allowed to be a touch bolder:**
```text
Shot structure: 1 continuous shot, 8 seconds, 16:9 (or 9:16 for social), loop-friendly.
Motion: a slow, gentle push-in on the frosted-glass explanation card; the teal-to-amber attention
gradient softly animates inside it; light particles drift; a soft rim-light sweep crosses the glass once.
Keep the headline area clean and empty.
Mood: premium healthcare-tech, calm-confident, never alarmist.
Do NOT: no realistic skin, no anatomy, no red-alert energy, no text rendering, no people, no audio.
```

> If a render still looks too "smooth/CGI" or adds detail you didn't want, add `flat, graphic, abstract, no 3D render, no glossy plastic` to the motion line. If it sneaks in motion you didn't ask for, make the negatives more explicit (e.g. `the contour lines do not change shape`). Re-render in Fast until calm, then finalize in Standard.

---

# §3 — Method B-alt: animated gradient without video (lightest option)

For the hero background you often don't need a video at all — a CSS/Canvas animated gradient mesh built from your palette is far lighter and crisper. Use the still (`hero-bg-plate.png`) as the *art direction reference*, then have Claude Code build the motion in the frontend (Framer Motion / a shader / CSS keyframes). This is the recommended default for production; reserve Method A video for the launch teaser. See `CLAUDE_DESIGN_PROMPTS.md` Step 7.4 for the libraries.

---

# §4 — Method B: Lottie (icons, micro-interactions, empty-states, splash)

Lottie is the workhorse for crisp, tiny, scalable motion. Three ways to get a `.json`:

1. **LottieFiles** ([lottiefiles.com](https://lottiefiles.com)) — huge free/library + a built-in editor; many are editable to your palette. Fastest path.
2. **AI text-to-Lottie** — LottieFiles has an AI generator; describe the motion and recolor to teal #1FB6B0.
3. **After Effects + Bodymovin** — design your ChatGPT illustration in AE and export Lottie (most control; needs AE).

### 4.1 Which assets become Lottie
- How-it-works 4 icons (§1.3) → looping/scroll-triggered micro-animations.
- Empty-states (§1.7 / §2.4) → gentle one-shot or subtle loop.
- Splash mark (§2.2) → fade+scale in on launch.
- Loading/processing → a calm spinner/progress (replaces a heavy GIF).
- Trust icons (§1.8) → tiny hover/enter motions (optional).

### 4.2 Recolor & optimize
- In the LottieFiles editor, set all strokes/fills to the brand palette (teal accent, charcoal lines).
- Keep them short and looping where appropriate; disable for reduced-motion.
- Optimize JSON with `lottie` tooling or LottieFiles' optimizer; aim for **< 50–100 KB** each.
- **Save as:** `public/brand/lottie/*.json` (web) and `mobile/assets/lottie/*.json` (mobile).

---

# §5 — Wiring it into the UI

## 5.1 Web (Next.js) — video hero

```tsx
// components/HeroVideo.tsx
export function HeroVideo() {
  return (
    <video
      className="hero-bg"
      autoPlay
      muted
      loop
      playsInline
      poster="/brand/hero-poster.jpg"
      preload="none"            // don't block first paint; load after
      aria-hidden="true"        // decorative
    >
      <source src="/brand/hero.webm" type="video/webm" />
      <source src="/brand/hero.mp4" type="video/mp4" />
    </video>
  );
}
```
```css
/* Respect reduced motion: hide video, show poster */
@media (prefers-reduced-motion: reduce) {
  .hero-bg { display: none; }
  .hero { background-image: url('/brand/hero-poster.jpg'); background-size: cover; }
}
.hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
```

## 5.2 Web (Next.js) — Lottie

```bash
npm i lottie-react
```
```tsx
// components/LottieIcon.tsx
import Lottie from "lottie-react";
import animationData from "@/public/brand/lottie/howitworks-upload.json";

export function LottieIcon() {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <Lottie
      animationData={animationData}
      loop={!prefersReduced}
      autoplay={!prefersReduced}
      style={{ width: 96, height: 96 }}
    />
  );
}
```
For scroll-triggered play, gate `autoplay` behind an IntersectionObserver / Framer Motion `whileInView`.

## 5.3 Mobile (React Native) — video & Lottie

```bash
# Lottie
npm i lottie-react-native
# Video (Expo: expo-av; bare RN: react-native-video)
npx expo install expo-av        # or: npm i react-native-video
```
```tsx
// Lottie splash mark
import LottieView from "lottie-react-native";
<LottieView source={require("../assets/lottie/splash-mark.json")} autoPlay loop={false} />

// Video background (expo-av)
import { Video, ResizeMode } from "expo-av";
<Video
  source={require("../assets/hero-9x16.mp4")}
  isMuted shouldPlay isLooping
  resizeMode={ResizeMode.COVER}
  style={StyleSheet.absoluteFill}
/>
```
Mobile reduced-motion: check `AccessibilityInfo.isReduceMotionEnabled()` and skip autoplay/loop.

## 5.4 In-page motion (no asset)
Hover, scroll reveals, parallax, page transitions → build with **Framer Motion / GSAP** (web) and **Reanimated** (mobile). Covered in `CLAUDE_DESIGN_PROMPTS.md` Step 7.4. Animate `transform`/`opacity` only for 60fps.

---

# §6 — End-to-end worked example (the landing hero)

1. **Image:** generate `hero-bg-plate.png` with prompt §1.2 in ChatGPT. Ask for a transparent "focal card" layer too.
2. **Animate:** upload the plate to **Higgsfield → Seedance** (Image to Video), put the same plate in the **start and end frame** for a clean loop, paste the §2.7 "Hero background loop" prompt, render 5s in Fast → download MP4. (Or use Kling if you want the free path.)
3. **Process:** run the §2.3 ffmpeg block → `hero.mp4`, `hero.webm`, `hero-poster.jpg` (≤ ~4 MB).
4. **Integrate:** drop the §5.1 `HeroVideo` component behind your headline; headline text stays as real HTML on top.
5. **Foreground life:** add the §1.1 focal card as a separate image and give it a gentle Framer Motion breathing animation (scale 1 → 1.02 loop, disabled on reduced-motion).
6. **Verify:** reduced-motion shows the poster still; Lighthouse/devtools confirm it doesn't block first paint; test on a mid-range phone.

---

# §7 — Tooling cheat-sheet & limits to verify

- **Stills:** ChatGPT image generation (your subscription). Text rendering is unreliable — add real text in code/Figma.
- **AI video (image-to-video):** **Seedance** (primary for quality — via Higgsfield §2.5 or direct Dreamina/BytePlus §2.6), **Kling** (primary for free daily credits), Hailuo/MiniMax (cheap sub), Higgsfield (aggregator + start/end-frame + camera control), Runway/Pika/Luma. **Check current per-plan clip length/credits/resolution — these change often.** Never upload patient images.
- **Lottie:** LottieFiles (+AI), After Effects + Bodymovin.
- **Interactive vector:** Rive.
- **Processing:** ffmpeg (loop, compress, poster), squoosh/sharp for images, svgo for SVG.
- **Code motion:** Framer Motion, GSAP (web), Reanimated (mobile).

### Output format quick reference
| Asset type | Format | Budget |
| --- | --- | --- |
| Hero loop (web) | MP4 + WebM + poster JPG | ≤ 3–5 MB |
| Hero loop (mobile) | MP4 9:16 | ≤ 2–3 MB |
| Icon / micro-motion | Lottie JSON | ≤ 50–100 KB |
| Empty-state / onboarding | Lottie JSON or PNG | ≤ 150 KB |
| Static illustration | PNG (transparent) / SVG | optimize via svgo/sharp |
| Social/launch video | MP4 | per platform |

---

# §8 — Folder structure (keep assets tidy)

Two tiers again: `design/source-art/` is the un-shipped archive; `public/brand/` and `mobile/assets/` are what the app loads.

```
frontend/
  design/
    source-art/                 # TIER 1 — raw, full-res, NOT shipped, never deleted
      web/                      #   raw ChatGPT PNGs for web (incl. _bg/_focal layers)
      mobile/                   #   raw ChatGPT PNGs for mobile
      video-raw/                #   raw AI clips straight from Seedance/Kling/Higgsfield before ffmpeg
  public/
    brand/                      # TIER 2 — optimized, shipped, imported by web code
      hero.mp4  hero.webm  hero-poster.jpg     # animated hero (from §2.3)
      hero-keyvisual.png  hero-keyvisual_focal.png  hero-keyvisual_bg.png
      hero-bg-plate.png
      gradcam-explainer.png  poster-launch.png
      howitworks-*.png  feature-*.png  empty-*.png  bodymap-*.{png,svg}
      icons/trust-*.png
      lottie/*.json             # crisp vector motion (from §4)
mobile/
  assets/                       # TIER 2 — shipped, imported by React Native (require())
    icon.png                    # 1024x1024, referenced in app.json
    splash.png                  # referenced in app.json
    onboarding-*.png  empty-*.png
    hero-9x16.mp4
    lottie/*.json
marketing/                      # not shipped in the app; for stores/social
  store/screenshot-frame-*.png
```

**Web (Next.js) placement rules:**
- Anything in `public/` is served at the root URL, so `public/brand/hero.mp4` → `/brand/hero.mp4` in JSX (`<source src="/brand/hero.mp4">`). No import needed for `public/`.
- For `next/image` optimization of static art, you can instead import from `app/`/`components/` assets — but `public/brand/` + a plain `<img>`/`<video>` is simplest and matches the code in §5.

**Mobile (Expo/React Native) placement rules:**
- RN bundles assets via `require('../assets/...')`, so the file must exist at build time in `mobile/assets/`.
- **App icon & splash are configured in `app.json`**, not just dropped in:
  ```json
  {
    "expo": {
      "icon": "./assets/icon.png",
      "splash": {
        "image": "./assets/splash.png",
        "resizeMode": "cover",
        "backgroundColor": "#F7F9FB"
      }
    }
  }
  ```
  (`backgroundColor` uses the brand off-white so there's no flash of white/black on launch.)
- Video on mobile must be a real bundled file or remote URL — `require('../assets/hero-9x16.mp4')` for bundled.

**Git tip:** commit Tier 2 (shipped assets) normally. For Tier 1 raw art and large raw video, consider **Git LFS** or keep `source-art/video-raw/` out of git (add to `.gitignore`) and back it up separately, so the repo stays light.

---

## TL;DR pipeline
**ChatGPT still → (layer split) → animate [Seedance via Higgsfield/Dreamina, or Kling = video • LottieFiles = vector • code = interactions] → ffmpeg/optimize → integrate (`<video>` / `lottie-react` / Framer Motion on web; `expo-av` / `lottie-react-native` / Reanimated on mobile) → verify reduced-motion + 60fps + small file size.** For the hero loop, the fastest clean path is **Higgsfield → Seedance, same still in start + end frame, 5s, Fast mode** (§2.5). Keep it calm, abstract, non-diagnostic.
