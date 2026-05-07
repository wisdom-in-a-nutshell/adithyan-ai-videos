# Evolution of Adi — Session Handoff

Self-document for picking up after context compaction. Written 2026-05-07.

## Project goal

A short stylized video — "Adi, in Drawings" — a memoir time-lapse where the
artist (implicitly Adi) appears to draw himself at successive ages in a
sketchbook. Concept doc: `projects/evolution-of-adi/storyboard.md` and `brief.md`.

## Current locked decisions

- **Title on the cover**: "Adi, in Drawings" (handwritten).
- **Style on the page**: pencil + watercolor portrait illustrations on cream
  sketchbook paper, with the user's **real childhood photograph** taped to the
  left page (B&W, on cream-cream tape) and the **drawn portrait emerging on
  the right page**. Real present-day photo replaces the child photo on the
  left for the closing beat.
- **Architecture**: 10 keyframes → 9 i2v video beats → ffmpeg concat. Each
  beat generated as a separate clip, no Remotion post.
- **Video model**: switched from Seedance 2.0 to **Kling O3 standard** after
  diagnostic confirmed Seedance was producing chroma noise on smooth
  surfaces (Kling outputs clean on identical keyframes; same yuv420p; the
  problem was Seedance's diffusion process, not h.264 encoding).
- **Audio**: skip generated audio for now. Add foley in post if needed.
- **Pacing**: each beat 5s, locked overhead camera, no Remotion speed-ups.

## The 10 keyframes (locked)

In `projects/evolution-of-adi/staging-frames/keyframes/`:

| # | File | What it is |
|---|---|---|
| 01 | 01_closed_book.png | Closed book, "Adi, in Drawings" smooth cream cover |
| 02 | 02_open_photo_blank.png | Open spread — photo taped left, blank right |
| 03 | 03_drawing_emerges_on_spread.png | Same spread + child watercolor portrait on right |
| 04 | 04_standalone_child_age9.png | Just the child illustration, full frame |
| 05 | 05_standalone_late_teen_age19.png | Late-teen illustration |
| 06 | 06_standalone_mid_20s_age23.png | Mid-20s illustration |
| 07 | 07_standalone_early_30s_age30.png | Early-30s illustration |
| 08 | 08_standalone_present_day_age34.png | Present-day illustration |
| 09 | 09_closing_spread_real_present.png | Spread with real present-day photo on left + present-day illustration right |
| 10 | 10_closed_book_end.png | Plain back cover (spine flipped to right) |

All 10 generated via Gemini (`gemini-3-pro-image-preview`) — the imagegen
script was extended to support Gemini specifically because Azure's gpt-image-2
moderation kept blocking child-face composites.

## The 9 beats (i2v, all on Kling O3 standard)

| Beat | Start → End | What happens |
|---|---|---|
| β1 | 01 → 02 | Closed book opens, photo revealed on inside left |
| β2 | 02 → 03 | Drawing emerges on right page (THE thesis beat) |
| β3 | 03 → 04 | Camera dolly-in into the right page; standalone illustration fills frame |
| β4 | 04 → 05 | Child → late teen morph (or redraw — see open issue) |
| β5 | 05 → 06 | Late teen → mid-20s |
| β6 | 06 → 07 | Mid-20s → early-30s |
| β7 | 07 → 08 | Early-30s → present-day |
| β8 | 08 → 09 | Camera dolly-out; closing spread with real present-day photo |
| β9 | 09 → 10 | Book closes (back cover) |

### Beat status

- **β1 (book opens, Kling)**: rendered. File:
  `projects/evolution-of-adi/review/kling-renders/beat-01-book-opens-kling.mp4`.
  User reviewed, looked OK. Not yet locked.
- **β2 (drawing emerges, Kling)**: rendered. File:
  `projects/evolution-of-adi/review/kling-renders/beat-02-drawing-emerges-kling.mp4`.
  **User feedback**: emergence reads as a fade-in / reveal, NOT as actual
  sketching. They want it to look like an artist actively drawing — outline
  strokes first in drawing order, then watercolor washes over the lines, like
  a sped-up real time-lapse.
- **β3–β9**: not yet rendered on Kling.

## OPEN ISSUE — the sketching feel (priority next)

User's exact ask:
- "First kind of outline should come and then the colors should come maybe
  something like that"
- "Like an artist working — like watching a time-lapse get sped up"
- The current Kling β2 looks like a fade-in / reveal, not active sketching

What I should try next:
1. **Tighten the β2 prompt** to push harder for visible stroke-by-stroke
   building. Specifically: phase the action — `[0–1s]` outline strokes only,
   `[1–3s]` outline completes (still no color), `[3–4.5s]` watercolor washes
   bloom in waves, `[4.5–5s]` settle to end frame.
2. Possibly include a reference video of "real artist time-lapse drawing on
   paper" as an additional reference if Kling supports it. (Kling endpoints
   we're using only support image_url + end_image_url; multi-reference
   videos may need a different Kling tier — check
   `fal-ai/kling-video/o3/standard/reference-to-video` or similar.)
3. Re-run β2 first with the tightened prompt. If sketching motion lands,
   apply same prompt pattern to subsequent drawing beats.

## CLI status

`/.claude/skills/fal-seedance/scripts/fal_seedance_ref2v.py` — Python,
self-contained skill. Now supports both Seedance and Kling endpoints:

- `i2v` subcommand with `--start-image`, `--end-image`, `--prompt`, `--endpoint`
- VALID_I2V_ENDPOINTS includes both Seedance + Kling families
- Payload construction branches by endpoint family — Kling endpoints get
  payload without `resolution` and `generate_audio` (Kling's API doesn't
  accept those)
- Default endpoint when calling `i2v` without `--endpoint`:
  `bytedance/seedance-2.0/image-to-video` (Seedance). For Kling, must pass
  explicit `--endpoint fal-ai/kling-video/o3/standard/image-to-video`.

To call β2 again on Kling with a new prompt:

```bash
python3 .claude/skills/fal-seedance/scripts/fal_seedance_ref2v.py i2v \
  --project evolution-of-adi --name beat-02-drawing-emerges-kling-v2 \
  --start-image projects/evolution-of-adi/staging-frames/keyframes/02_open_photo_blank.png \
  --end-image projects/evolution-of-adi/staging-frames/keyframes/03_drawing_emerges_on_spread.png \
  --endpoint fal-ai/kling-video/o3/standard/image-to-video \
  --duration 5 --aspect-ratio 1:1 \
  --prompt "<the new sketching-tightened prompt>"
```

## Folders to know

- `projects/evolution-of-adi/staging-frames/keyframes/` — the 10 locked keyframes
- `projects/evolution-of-adi/review/keyframes/` — copies of same, for review
- `projects/evolution-of-adi/review/seedance-renders/` — old Seedance beats
  (kept for comparison; have the chroma-noise issue)
- `projects/evolution-of-adi/review/kling-renders/` — new Kling beats (clean)
- `projects/evolution-of-adi/seedance/renders/` — all rendered MP4s (canonical)
- `projects/evolution-of-adi/seedance/receipts/` — JSON receipts per render
- `projects/evolution-of-adi/originals/` — source photos (real photos)
- `projects/evolution-of-adi/stylized/v1_3q_neutral/` … `v7_ghibli_two_adis/` —
  iteration history of stylized portraits (don't delete, kept for archive)

## Originals (real source photos)

In `originals/`:
- `01_child.jpg` — B&W school portrait, ~9, gentle smile (used for keyframes 02 + 03)
- `06_present_day.webp` — color, ~34, curly hair, beard, warm smile (used for keyframe 09 closer)

## Diagnostic data — Seedance vs Kling

Same exact keyframes (`stylized/v5_pencil/00_blank_cream_paper.png` →
`06_present_day_pencil_gpt.png`) tested on both:

- Seedance 2.0 i2v 720p: `seedance/renders/pencil-test-present-day.mp4` —
  HEAVY multicolor chroma noise on cream paper.
- Seedance 2.0 i2v 1080p: `seedance/renders/pencil-test-present-day-1080p.mp4` —
  also noisy, possibly worse than 720p.
- Kling O3 standard: `seedance/renders/diagnostic-kling-o3-pencil.mp4` —
  visibly cleaner.

Both output yuv420p h.264 — so the noise was Seedance's diffusion output, not
the encoder. This is what convinced us to switch to Kling.

## Engineer brief (in case noise question comes back)

Earlier in the session I wrote a self-contained engineer brief documenting
the chroma noise issue. Search the chat history if needed; key files
referenced are above. The conclusion was: switch to Kling, problem solved
for production purposes.

## Iteration history (compressed)

Tried this session, in order:
1. Pixar-naturalistic style canary — looked good, eyes too big per user
2. Watercolor + pencil illustrations on textured paper — looked beautiful
   static, generated cinematic Seedance opening, but had chroma noise
3. Smoothed the textured covers (F0/F8 smooth versions) — helped covers
4. Pure pencil sketches — confirmed noise wasn't watercolor-specific, was
   Seedance-process noise on smooth surfaces
5. "Adi meets Adi" Ghibli scene exploration — generated keyframe but identity
   weak, parked
6. Diagnostic on Kling — confirmed Kling produces clean output → switched
7. Re-running beats on Kling, fresh start with original watercolor concept

User's decision arc: stay with the original watercolor sketchbook concept,
Kling for clean rendering, push harder for visible-sketching motion.

## Immediate next action when context restored

1. Re-run **β2 on Kling** with a tightened prompt that phases the action
   (`[0–1s]` outline strokes building, `[1–3s]` outline completes, `[3–4.5s]`
   watercolor washes in, `[4.5–5s]` settle). One render. ~$2.
2. Show user. If sketching motion now reads, lock that prompt template and
   apply same phasing to the inner morph/redraw beats (β4–β7).
3. Continue beat-by-beat, user reviewing each, no batching.
4. Once all 9 land, ffmpeg concat to final stitched video.

The ffmpeg concat command is just:

```bash
cd projects/evolution-of-adi/review/kling-renders
cat > clips.txt <<'EOF'
file 'beat-01-book-opens-kling.mp4'
file 'beat-02-drawing-emerges-kling.mp4'
... etc
EOF
ffmpeg -y -f concat -safe 0 -i clips.txt -c copy ../../seedance/renders/adi-in-drawings-final.mp4
```
