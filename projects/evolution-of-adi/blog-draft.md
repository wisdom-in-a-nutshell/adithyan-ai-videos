# Adi, in Drawings — production journey

A long-form draft documenting how a 42.7s memoir time-lapse called *Adi, in Drawings* was built from real photographs through stylized portraits, an animated sketchbook, and a Suno-generated piano score. Written for re-use as a blog post, video script, or talk outline.

All file paths below are real, local, on this machine. They're embedded so any future agent or editor can quote, embed, or further process the artifacts directly.

---

## TL;DR

- **Concept**: a 42.7-second memoir time-lapse where the artist (implicitly the subject — me, Adi) appears to draw himself at five successive ages on the pages of a sketchbook. Real photographs bookend the piece. The middle is hand-drawn pencil + watercolor portraits emerging on cream paper.
- **Final video**: [`projects/evolution-of-adi/review/adi-in-drawings-final.mp4`](projects/evolution-of-adi/review/adi-in-drawings-final.mp4)
- **Architecture**: 10 hand-curated keyframes → 13 image-to-video "beats" rendered on fal.ai Kling O3 → ffmpeg concat with per-beat speed adjustments, end-frame freezes, and a Suno-generated piano score.
- **Total runtime**: 42.77s @ 1440×1440 @ 30fps. ~38 MB H.264 + AAC.
- **Stack**: Gemini 3 Pro Image Preview (keyframes), fal.ai Kling O3 standard + pro (image-to-video), Suno (music), ffmpeg (stitch + speed + audio mux). No Remotion. No DAW. All glue in shell + Python.

---

## The concept

A short, stylized video — *Adi, in Drawings* — framed as a memoir time-lapse. The artist (implicitly the subject) appears to draw himself at successive ages in a single sketchbook. The thesis is simple: *I am the artist of my own life, and looking back I see one person across all these years.*

The visual contract:
- A real childhood photograph taped (with cream-cream masking tape) to the **left page** of an open sketchbook.
- A pencil + watercolor portrait of the same person, at the same age, emerging on the **right page** — strokes building in believable drawing order, watercolor washes blooming over the line work like a sped-up artist time-lapse.
- A second beat zooms in, fills the frame with the standalone illustration, then turns the page to a blank one. A new portrait emerges — older. Five portraits total, ages roughly 9, 19, 23, 30, 34.
- The closing beat dollies out: the spread now has the **real present-day photo** on the left and the present-day illustration on the right. The book closes. End.

Source photographs:
- Child portrait (~9, B&W school photo): [`projects/evolution-of-adi/originals/01_child.jpg`](projects/evolution-of-adi/originals/01_child.jpg)
- Present-day photo (~34, color, curly hair, beard): [`projects/evolution-of-adi/originals/06_present_day.webp`](projects/evolution-of-adi/originals/06_present_day.webp)

---

## The 10 locked keyframes

Image generation was done with Gemini 3 Pro Image Preview, after Azure's `gpt-image-2` repeatedly blocked compositions involving child faces under content moderation. Switching providers was cheaper than fighting moderation.

Path: `projects/evolution-of-adi/staging-frames/keyframes/`

| # | File | Role |
|---|---|---|
| 01 | [`01_closed_book.png`](projects/evolution-of-adi/staging-frames/keyframes/01_closed_book.png) | Closed book, "Adi, in Drawings" smooth cream cover (handwritten title) |
| 02 | [`02_open_photo_blank.png`](projects/evolution-of-adi/staging-frames/keyframes/02_open_photo_blank.png) | Open spread — real child photo taped on left, blank cream page on right |
| 03 | [`03_drawing_emerges_on_spread.png`](projects/evolution-of-adi/staging-frames/keyframes/03_drawing_emerges_on_spread.png) | Same spread + child watercolor portrait on right |
| 04 | [`04_standalone_child_age9.png`](projects/evolution-of-adi/staging-frames/keyframes/04_standalone_child_age9.png) | Just the child illustration, full frame |
| 05 | [`05_standalone_late_teen_age19.png`](projects/evolution-of-adi/staging-frames/keyframes/05_standalone_late_teen_age19.png) | Late-teen illustration |
| 06 | [`06_standalone_mid_20s_age23.png`](projects/evolution-of-adi/staging-frames/keyframes/06_standalone_mid_20s_age23.png) | Mid-20s illustration |
| 07 | [`07_standalone_early_30s_age30.png`](projects/evolution-of-adi/staging-frames/keyframes/07_standalone_early_30s_age30.png) | Early-30s illustration |
| 08 | [`08_standalone_present_day_age34.png`](projects/evolution-of-adi/staging-frames/keyframes/08_standalone_present_day_age34.png) | Present-day illustration |
| 09 | [`09_closing_spread_real_present.png`](projects/evolution-of-adi/staging-frames/keyframes/09_closing_spread_real_present.png) | Closing spread — real present-day photo on left + present-day illustration on right |
| 10 | [`10_closed_book_end.png`](projects/evolution-of-adi/staging-frames/keyframes/10_closed_book_end.png) | Plain back cover (spine flipped) |

A blank-page bridge frame was generated separately to anchor the page-turn-then-emergence beats:
- [`00_blank_page_landing.png`](projects/evolution-of-adi/staging-frames/keyframes/00_blank_page_landing.png)

Identity preservation across the five stylized portraits was the hardest single constraint. Each iteration locked the prompt: *"preserve exact facial features (eye shape, eyebrows, nose, jawline, skin tone, hairline)."* Even with that, identity drifts subtly across ages — which is also true of real people.

---

## The 13 video beats

The video is built from 13 image-to-video clips (called "beats"), stitched in ffmpeg. Each beat takes a start image and an end image and generates 5 seconds of motion in between. Some beats are pure transitions (book opens, page turns, camera moves); some are the thesis sketching beats where pencil strokes and watercolor washes appear on cream paper.

| # | Beat ID | File | Role | Tier |
|---|---|---|---|---|
| 1 | β1 | [`beat-01-book-opens-kling.mp4`](projects/evolution-of-adi/review/kling-renders/beat-01-book-opens-kling.mp4) | Transition: closed book opens, photo revealed | O3 standard |
| 2 | β2 | [`beat-02-drawing-emerges-kling-pro.mp4`](projects/evolution-of-adi/review/kling-renders/beat-02-drawing-emerges-kling-pro.mp4) | **Thesis**: child drawing emerges on right page | **O3 pro** |
| 3 | β3 | [`beat-03-zoom-into-drawing-kling.mp4`](projects/evolution-of-adi/review/kling-renders/beat-03-zoom-into-drawing-kling.mp4) | Transition: dolly into right page, fills frame | O3 standard |
| 4 | β4a | [`beat-04a-page-turn-to-blank-kling.mp4`](projects/evolution-of-adi/review/kling-renders/beat-04a-page-turn-to-blank-kling.mp4) | Transition: page turn (child → blank) | O3 standard |
| 5 | β4b | [`beat-04b-emerges-late-teen-kling-pro.mp4`](projects/evolution-of-adi/review/kling-renders/beat-04b-emerges-late-teen-kling-pro.mp4) | Age beat: late-teen emerges | **O3 pro** |
| 6 | β5a | [`beat-05a-page-turn-late-teen-to-blank-kling.mp4`](projects/evolution-of-adi/review/kling-renders/beat-05a-page-turn-late-teen-to-blank-kling.mp4) | Transition: page turn | O3 standard |
| 7 | β5b | [`beat-05b-emerges-mid-20s-kling-pro.mp4`](projects/evolution-of-adi/review/kling-renders/beat-05b-emerges-mid-20s-kling-pro.mp4) | Age beat: mid-20s emerges | **O3 pro** |
| 8 | β6a | [`beat-06a-page-turn-mid-20s-to-blank-kling.mp4`](projects/evolution-of-adi/review/kling-renders/beat-06a-page-turn-mid-20s-to-blank-kling.mp4) | Transition: page turn | O3 standard |
| 9 | β6b | [`beat-06b-emerges-early-30s-kling-pro.mp4`](projects/evolution-of-adi/review/kling-renders/beat-06b-emerges-early-30s-kling-pro.mp4) | Age beat: early-30s emerges | **O3 pro** |
| 10 | β7a | [`beat-07a-page-turn-early-30s-to-blank-kling.mp4`](projects/evolution-of-adi/review/kling-renders/beat-07a-page-turn-early-30s-to-blank-kling.mp4) | Transition: page turn | O3 standard |
| 11 | β7b | [`beat-07b-emerges-present-day-kling-pro.mp4`](projects/evolution-of-adi/review/kling-renders/beat-07b-emerges-present-day-kling-pro.mp4) | Age beat: present-day emerges | **O3 pro** |
| 12 | β8 | [`beat-08-zoom-out-to-spread-kling.mp4`](projects/evolution-of-adi/review/kling-renders/beat-08-zoom-out-to-spread-kling.mp4) | Transition: dolly out, real present-day photo on left | O3 standard |
| 13 | β9 | [`beat-09-book-closes-kling.mp4`](projects/evolution-of-adi/review/kling-renders/beat-09-book-closes-kling.mp4) | Transition: book closes | O3 standard |

Receipts (full prompts + seeds + URLs) live in `projects/evolution-of-adi/seedance/receipts/`.

---

## The journey: iterations and turning points

This was not a linear build. The interesting parts were the dead ends.

### 1. Style exploration (parked branches)

Before settling on pencil + watercolor sketchbook, I tested:
- **Pixar 3D character portrait** — looked good, but eyes too big; identity drifted toward the cartoon style rather than holding the source likeness.
- **Watercolor + pencil illustrations on textured cream paper** — looked beautiful as static images. Generated a cinematic Seedance opening that was tonally right.
- **"Adi meets Adi" Ghibli scene** — generated keyframes of a Ghibli-style scene with present-day Adi and child Adi together. Identity hold was weak; parked.

Iteration history of stylized portraits is preserved under `projects/evolution-of-adi/stylized/v1_3q_neutral/` through `…/v7_ghibli_two_adis/`. Don't delete — useful as visual archive.

### 2. The Seedance chroma-noise problem

The first production run used **Seedance 2.0** for image-to-video. The output had **multicolor chroma speckle noise** on smooth cream paper backgrounds — not subtle. Same artifact at 720p and 1080p. My initial hypothesis was h.264 yuv420p chroma subsampling — but a head-to-head test on identical keyframes showed:

- Seedance 2.0 i2v 720p: heavy noise. [`projects/evolution-of-adi/seedance/renders/pencil-test-present-day.mp4`](projects/evolution-of-adi/seedance/renders/pencil-test-present-day.mp4)
- Seedance 2.0 i2v 1080p: also noisy. [`projects/evolution-of-adi/seedance/renders/pencil-test-present-day-1080p.mp4`](projects/evolution-of-adi/seedance/renders/pencil-test-present-day-1080p.mp4)
- **Kling O3 standard**: visibly clean. [`projects/evolution-of-adi/seedance/renders/diagnostic-kling-o3-pencil.mp4`](projects/evolution-of-adi/seedance/renders/diagnostic-kling-o3-pencil.mp4)

Both encoders output yuv420p H.264. The noise was Seedance's diffusion process, not the codec. This convinced me to switch the entire production stack to **Kling O3** for all video generation. Lesson: when you suspect an encoding problem, run the same input through a different model before blaming the encoder.

### 3. The "fade-in vs sketching" feedback

The first Kling β2 render (drawing emerges) felt like *a fade-in / reveal* rather than active sketching. The portrait crossfaded into existence; you couldn't *see* the artist working.

The fix was prompt structure, not model choice. Locked phased timing into the prompt:

```
[0.0 – 1.2s]: Pencil OUTLINE strokes appear in clear drawing order. First the head-and-shoulders contour. Then the eyes. Then the nose. Then the mouth. Each stroke appears DISCRETELY, one after another...
[1.2 – 2.5s]: Outline continues — hair shape, eyebrows, ears...
[2.5 – 4.0s]: Watercolor washes BLOOM in over the line work in waves...
[4.0 – 4.8s]: Final shading details...
[4.8 – 5.0s]: Hold on the completed pencil + watercolor portrait, matching the end frame exactly.
```

Plus repeated "NOT a fade. NOT a reveal. NOT all-at-once" reinforcement. After this rewrite, the strokes started appearing in believable order; the watercolor blooming started reading as wet pigment seeping into paper. Lesson: when a video model defaults to crossfade, *time-segment your prompt*. Diffusion models will respect bracketed timestamps if you state them explicitly.

The locked sketching template lives at:
- [`projects/evolution-of-adi/seedance/prompts/template-drawing-emerges-on-blank.txt`](projects/evolution-of-adi/seedance/prompts/template-drawing-emerges-on-blank.txt)

### 4. Splitting the age transitions

Initial design had each age-to-age transition as a single 5s beat (e.g. "child portrait → late-teen portrait"). That looked bad — the model was being asked to morph faces, which violates identity preservation. So I split each transition into two 5s beats:

1. **Page-turn-to-blank**: current portrait visible, page lifts and curls, blank cream page underneath revealed.
2. **Drawing-emerges-on-blank**: pencil strokes build, watercolor blooms, new (older) portrait appears.

Two 5s beats per transition is more predictable than one 10s morph, even though it's more renders. The page-turn template:
- [`projects/evolution-of-adi/seedance/prompts/template-page-turn-to-blank.txt`](projects/evolution-of-adi/seedance/prompts/template-page-turn-to-blank.txt)

This split was the structural unlock for the inner four age beats.

### 5. Validate canary, then batch

A painful lesson early on: I once ran 9 Seedance renders in parallel before validating a single canary. Every one of them had the chroma-noise issue. ~$15 wasted in a few minutes.

After that: every new prompt or beat structure gets a single canary render first. Batches only happen *after* the prompt template is validated. The 7 inner beats were ultimately batched in parallel — but only after β2 v2 (with phased timing) was accepted.

### 6. Standard → Pro re-render

The first complete stitch used Kling O3 **standard** for everything. After review, the sketching beats specifically read as a bit soft — fine for review, not great for publish. Re-rendered the five sketching beats (β2 + β4b–β7b) on Kling O3 **pro**. Same prompts, same keyframes, just higher tier. File sizes 4–5× larger (~2 MB → ~9 MB per beat) — real bitrate uplift, visibly sharper line work and cleaner watercolor texture.

Page-turn transitions stayed on standard. There's no edge-detail benefit to running pro on motion that's mostly paper-curl + cream-page-reveal.

### 7. Pacing iterations

Three pacing attempts:

- **v1 — uniform 5s on all 13 beats** = 65s total. Felt long. Inner sketching beats repeated the same trick four times in a row; the eye disengaged after the second age transition.
- **v2 — transitions sped to 2x (2.5s), thesis beat at 5s, inner sketches at 5s** = 45.4s. Better, but the inner sketches still felt repetitive.
- **v3 — transitions at 2x (2.5s), thesis beat at 5s, inner sketches at 1.67x (3s)** = 37.4s. Tight. But the inner sketches felt rushed; the completed portraits flashed by before registering.
- **v4 — transitions at 2x, thesis at 5s, inner sketches at 1.25x (4s)** = 41.4s. Sweet spot.
- **v5 — same as v4 plus a 0.25s freeze on the last frame of each sketching beat** = 42.77s. **Final.**

The 0.25s end-of-beat freeze was the single best pacing change. It gave the viewer time to actually *see* the completed portrait before the page turned. Implementation: ffmpeg's `tpad=stop_mode=clone:stop_duration=0.25`.

### 8. Audio loudness tuning

Generated the music in **Suno** (custom mode):

```
solo piano, sparse and intimate, nostalgic memoir, 85 BPM, soft sustain pedal,
single melodic line with gentle harmonic underbed, slight warmth, contemplative,
Olafur Arnalds and Joe Hisaishi influence, no drums, no vocals, instrumental only
```

Title: *Velvet Notebook*. File: [`projects/evolution-of-adi/audio/velvet-notebook.mp3`](projects/evolution-of-adi/audio/velvet-notebook.mp3)

Volume tuning was iterative. Reference points:
- Foreground / feature track (Spotify/YouTube target): around **−14 LUFS**
- Background under voiceover: **−25 to −30 LUFS**
- Instrumental video, music carries it (this case): **−16 to −20 LUFS** integrated

Final mix landed at **mean −28.3 dB / peak −11.9 dB** with `volume=0.3` in ffmpeg. That's deliberately on the very-quiet, ambient end — the music sits *under* awareness rather than demanding attention. Fades: 1.0s in, 3.0s out. The fade-out is calibrated to end exactly at the close of β9 (book closes).

---

## The final stitch (ffmpeg recipe)

For reproducibility — this is the actual stitch command that produced the final video. Single ffmpeg pass: 13 inputs, normalize all to 1440×1440 with lanczos, apply per-beat setpts and tpad, concat, encode H.264 CRF 18 yuv420p. Then a second pass adds the audio with volume + fades.

```bash
# Stitch v5: transitions at 2x, thesis at 1x, inner sketches at 1.25x, +0.25s freeze on each sketch end
ffmpeg -y \
  -i β1.mp4 -i β2-pro.mp4 -i β3.mp4 -i β4a.mp4 -i β4b-pro.mp4 \
  -i β5a.mp4 -i β5b-pro.mp4 -i β6a.mp4 -i β6b-pro.mp4 \
  -i β7a.mp4 -i β7b-pro.mp4 -i β8.mp4 -i β9.mp4 \
  -filter_complex "
    [0:v]scale=1440:1440:flags=lanczos,setpts=0.5*PTS,fps=30[v0];
    [1:v]scale=1440:1440:flags=lanczos,fps=30,tpad=stop_mode=clone:stop_duration=0.25[v1];
    [2:v]scale=1440:1440:flags=lanczos,setpts=0.5*PTS,fps=30[v2];
    [3:v]scale=1440:1440:flags=lanczos,setpts=0.5*PTS,fps=30[v3];
    [4:v]scale=1440:1440:flags=lanczos,setpts=0.8*PTS,fps=30,tpad=stop_mode=clone:stop_duration=0.25[v4];
    [5:v]scale=1440:1440:flags=lanczos,setpts=0.5*PTS,fps=30[v5];
    [6:v]scale=1440:1440:flags=lanczos,setpts=0.8*PTS,fps=30,tpad=stop_mode=clone:stop_duration=0.25[v6];
    [7:v]scale=1440:1440:flags=lanczos,setpts=0.5*PTS,fps=30[v7];
    [8:v]scale=1440:1440:flags=lanczos,setpts=0.8*PTS,fps=30,tpad=stop_mode=clone:stop_duration=0.25[v8];
    [9:v]scale=1440:1440:flags=lanczos,setpts=0.5*PTS,fps=30[v9];
    [10:v]scale=1440:1440:flags=lanczos,setpts=0.8*PTS,fps=30,tpad=stop_mode=clone:stop_duration=0.25[v10];
    [11:v]scale=1440:1440:flags=lanczos,setpts=0.5*PTS,fps=30[v11];
    [12:v]scale=1440:1440:flags=lanczos,setpts=0.5*PTS,fps=30[v12];
    [v0][v1][v2][v3][v4][v5][v6][v7][v8][v9][v10][v11][v12]concat=n=13:v=1:a=0[out]
  " \
  -map "[out]" -c:v libx264 -pix_fmt yuv420p -preset medium -crf 18 \
  adi-in-drawings-kling-v5.mp4

# Mux audio with fade-in 1s, fade-out 3s ending at video close
ffmpeg -y \
  -i adi-in-drawings-kling-v5.mp4 \
  -i velvet-notebook.mp3 \
  -map 0:v -map 1:a \
  -af "volume=0.3,afade=t=in:st=0:d=1.0,afade=t=out:st=39.77:d=3" \
  -c:v copy -c:a aac -b:a 192k \
  -shortest \
  adi-in-drawings-final.mp4
```

---

## Tools, costs, and reproducibility

### Image generation
- **Gemini 3 Pro Image Preview** (`gemini-3-pro-image-preview`) — handled compositions involving child faces cleanly. Azure's `gpt-image-2` blocked these on moderation. CLI: `.claude/skills/imagegen/scripts/image_gen.py` extended with `--model` flag.

### Video generation (image-to-video)
- **fal.ai Kling O3 standard** (`fal-ai/kling-video/o3/standard/image-to-video`) for transitions
- **fal.ai Kling O3 pro** (`fal-ai/kling-video/o3/pro/image-to-video`) for sketching beats
- Both via `.claude/skills/fal-seedance/scripts/fal_seedance_ref2v.py i2v`. The CLI was originally Seedance-only and was extended to support the Kling family. Kling endpoints don't accept `resolution` or `generate_audio` — the CLI strips those automatically.
- Each beat: 5s @ 1:1. ~$0.20 standard / ~$0.80 pro per render.
- 13 beats × ~5 iterations average ≈ ~$25–30 total in fal.ai costs across the entire project.

### Music
- **Suno** custom mode, instrumental, ~85 BPM solo piano. One generation, two takes, picked one. ~$0.30 in Suno credits.

### Stitching + post
- **ffmpeg** (Homebrew). No DAW, no Premiere, no Remotion. Everything via `-filter_complex`.

### Reproducibility
Every fal.ai render saves a JSON receipt to `projects/evolution-of-adi/seedance/receipts/` with the full prompt, seeds, fal CDN URLs, source image hashes, and timestamps. The receipts are sufficient to regenerate or A/B compare any beat.

---

## What I'd do differently

1. **Lock the prompt template earlier.** I discovered phased-timing prompts (`[0.0–1.2s]: …`) only after burning through the first batch of fade-in-style β2 renders. Should have started with phased timing from beat one.
2. **Validate one canary per new pattern before batching.** I knew this rule, ignored it once, paid for it. Solid rule: every novel beat structure gets a single render first; only after acceptance does it batch.
3. **Document the diagnostic.** The Seedance-vs-Kling chroma-noise comparison was a real finding worth a standalone note. Future-me (or anyone evaluating diffusion video models) would benefit from a written-up diagnostic of "same yuv420p output, very different noise floors."
4. **Skip the "Pixar canary" branch faster.** I spent more time than I should have testing alternative styles. The pencil + watercolor concept was the right one from the start; I should have committed earlier.
5. **Plan audio in parallel with video, not after.** Adding music at the end is fine, but a small foley layer (paper rustle on page-turns, pencil scratch under sketches) would have been even better and would have shaped the visual pacing if planned together.

---

## Open threads / future work

- **Foley layer**: paper rustle on each page-turn beat + pencil scratch under each sketching beat would lift this from "good draft" to "feels finished". Free foley packs on Freesound.org. Would add maybe 30 minutes of work in Audacity or ffmpeg.
- **Color grade**: a subtle warm grade (lift the warms slightly, soft contrast bump) would unify the film visually. Probably 5 lines of ffmpeg `eq` filter.
- **Versions for different platforms**: the current 1:1 1440×1440 fits Instagram/TikTok square. For YouTube I'd produce a 16:9 version with letterboxed crops or a re-render at 16:9 aspect.
- **A title card and end card**: right now the title only exists on the closed book cover (β1 entry). A standalone title card before β1 and a credits card after β9 would make this feel like a completed short rather than a vignette.
- **Re-render β2 thesis beat with even more sketching detail**: the thesis beat carries the whole concept. Worth one more render at pro tier with slightly more aggressive phased timing, more visible stroke-by-stroke building.

---

## Appendix: file inventory

### Final outputs
- [`projects/evolution-of-adi/review/adi-in-drawings-final.mp4`](projects/evolution-of-adi/review/adi-in-drawings-final.mp4) — final video, 42.77s, 38 MB, with audio
- [`projects/evolution-of-adi/review/adi-in-drawings-kling-v5.mp4`](projects/evolution-of-adi/review/adi-in-drawings-kling-v5.mp4) — same video, video stream only

### Prior versions kept for archive
- `adi-in-drawings-kling-v1.mp4` — uniform 5s, no music
- `adi-in-drawings-kling-v2-pro.mp4` — first pro re-render, transitions at 2x, all sketches at 5s
- `adi-in-drawings-kling-v3.mp4` — inner sketches at 3s, no music
- `adi-in-drawings-kling-v4.mp4` — inner sketches at 4s, no end-frame freeze

### Source photographs
- [`projects/evolution-of-adi/originals/01_child.jpg`](projects/evolution-of-adi/originals/01_child.jpg)
- [`projects/evolution-of-adi/originals/06_present_day.webp`](projects/evolution-of-adi/originals/06_present_day.webp)

### Locked keyframes
`projects/evolution-of-adi/staging-frames/keyframes/` — 11 PNG files (10 numbered + the `00_blank_page_landing.png` bridge frame).

### Locked beat templates
- [`projects/evolution-of-adi/seedance/prompts/template-drawing-emerges-on-blank.txt`](projects/evolution-of-adi/seedance/prompts/template-drawing-emerges-on-blank.txt)
- [`projects/evolution-of-adi/seedance/prompts/template-page-turn-to-blank.txt`](projects/evolution-of-adi/seedance/prompts/template-page-turn-to-blank.txt)

### Per-beat receipts (full prompt + seed + URL per render)
`projects/evolution-of-adi/seedance/receipts/beat-*.json`

### Music
- [`projects/evolution-of-adi/audio/velvet-notebook.mp3`](projects/evolution-of-adi/audio/velvet-notebook.mp3) — Suno-generated, 60s source, trimmed in mux

### CLI scripts (symlinked into `.claude/skills/`)
- `~/.agents/skills-source/owned/fal-seedance/scripts/fal_seedance_ref2v.py` — image-to-video CLI for Seedance + Kling families
- `~/.agents/skills-source/owned/imagegen/scripts/image_gen.py` — image-gen CLI extended with `--model` for Gemini

### Iteration archive (don't delete)
`projects/evolution-of-adi/stylized/v1_3q_neutral/` through `…/v7_ghibli_two_adis/` — full visual history of stylized portrait exploration. Useful as reference for any future age/style iteration.

---

*Written 2026-05-07. The artifacts above are the canonical record of how this video was made.*
