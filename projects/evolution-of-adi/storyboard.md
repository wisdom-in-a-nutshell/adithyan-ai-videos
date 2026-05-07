# Evolution of Adi — Storyboard

## Concept (one line)

A child's real photo dissolves into Pixar-stylized magic, journeys through every age of Adi, and returns to a real present-day photo. *That kid is me, now, here.*

## Why this concept (vs. the "scanning into a book" alternative)

The book-frame idea — camera diving into a book, finding him as a Pixar character, then unfolding the story — is genuinely stronger as a narrative shape. **It gets its own video.** Not today. It needs a book asset, page-flip animation, a zoom-in sequence; realistically a 2-day build.

The real-bookends + Pixar-middle structure delivers ~80% of the same emotional payoff at ~25% of the production cost. The two real photos are the truth; the Pixar middle is the dream of looking back at your own life. The two magic transitions are the entry and exit from that dream. Symmetry is built in.

**Save the book idea for the next video. Ship this one today.**

## The arc — direction

Reversed chronological: **child → present**. Ending on real present-day Adi lands the emotional punch ("that kid is me, now"). Opening on the youngest real photo gives the audience a person to attach to immediately.

## Source photos — locked

Locked final stylized portraits in `stylized/final/`. Original sources in `originals/`; iterations in `stylized/v1_3q_neutral/`, `stylized/v2_deadon_expressive/`, `stylized/v3_iterated/`. `_unused/` holds dropped sources.

| # | File | Approx. age | Source used | Vibe |
|---|------|-------------|-------------|------|
| 1 | `01_child.png` | ~9 | `01_child.jpg` (B&W school portrait) | Gentle source-smile, childlike proportions |
| 2 | `02_teen_early.png` | ~13 | `02_teen_early.jpg` (maroon passport) | Stoic awkward teen — **NOT used in video, kept in final/ for archive** |
| 3 | `03_late_teen.png` | ~19 | `03_late_teen_alt.jpg` (blue checkered shirt, smiling) | Big genuine open smile, the joy beat |
| 4 | `04_mid_20s.png` | ~23 | `04_mid_20s.png` (B&W Reebok candid) | Introspective, curly hair, calm depth |
| 5 | `05_early_30s.png` | ~30 | `05_early_30s.jpg` (mirror selfie) | Calm composed, full beard, settled |
| 6 | `06_present_day.png` | ~34 | `06_present_day.webp` (profile portrait) | Warm open smile, voluminous curls — the closing punch |

**Style:** hand-drawn sketchbook portraits — pencil + watercolor on visible cream/aged paper texture, dead-on framing, plain dark crewneck, source-expression preserved per photo.

**Video sequence: 5 ages.** 02 is dropped from the video — visually too close to 03's source structure and adds passport-monotony without enough age separation. Kept in `final/` as archive only.

**Decisions logged:**
- Baby photo dropped — features too undefined for likeness to "lock"; opens the time-lapse on a face viewers can already track.
- Three near-identical teen passport photos (~13/16/19) reduced to two (~13 and ~19) to avoid visual monotony in the Pixar middle.
- Family candid (~10–12) and prize photo (~9–10) considered as alternates for the child slot but kept the B&W school portrait per Adi's preference. Both stashed in `_unused/`.
- 06_present_day.webp is the bookend punchline — pick the right closer matters more than any other choice.

## Shot list — Sketchbook of Me (5 ages)

The locked creative concept is **"Sketchbook of Me"** (Version B): a single page of paper, fixed frame. Pencil strokes appear, watercolor settles, an illustrated portrait emerges. The page fades, the next age is drawn over it on the same paper. Closing beat: pencil draws present-day Adi, last stroke lands, illustration dissolves into the real present-day photo.

**Sequence:** 1 → 3 → 4 → 5 → 6 (02 is skipped).

Total runtime target: **~18s, 1:1 square**.

| # | Beat | Source | Duration | Notes |
|---|------|--------|----------|-------|
| 1 | Real child photo appears on paper background. Hand enters with pencil. | `originals/01_child.jpg` | 2.5s | Anchors viewer to "this is a real person" |
| 2 | Pencil draws over the real photo. Strokes accumulate. Watercolor washes settle. Photo transforms into the illustrated child portrait. | Seedance from `stylized/final/01_child.png` | 2.5s | The first "magic" moment |
| 3 | Hold on illustrated child. Subtle Seedance breath/eye motion. | `stylized/final/01_child.png` (animated) | 1.0s | Let it land |
| 4 | Page fades → blank → pencil redraws → settles → hold. **Late teen (~19)** with the genuine smile. | Seedance from `stylized/final/03_late_teen.png` | 2.0s | First joy beat |
| 5 | Page fades → redraws → settles → hold. **Mid-20s (~23)** introspective, curls. | Seedance from `stylized/final/04_mid_20s.png` | 2.0s | |
| 6 | Page fades → redraws → settles → hold. **Early-30s (~30)** calm, beard. | Seedance from `stylized/final/05_early_30s.png` | 2.0s | |
| 7 | Hand draws **present-day (~34)**. Last stroke lands. Hold for a beat. | Seedance from `stylized/final/06_present_day.png` | 2.5s | The reveal beat — warm open smile lands |
| 8 | Illustrated present-day morphs/dissolves into real present-day photo. Hold. | `originals/06_present_day.webp` | 2.5s | Closing punch — "the drawing was a memory; the real face is now" |

**Total: ~17.0s.**

**Reality check on the production work:** each "drawing" beat is a Seedance image-to-video animation ("pencil strokes appearing one by one revealing this portrait, watercolor wash arriving last, ~2.5s"). Page fades + the final morph-to-real are Remotion sequences/crossfades over the Seedance clips.

If pushed for time: drop one of the middle ages (mid-20s or early-30s feel most cuttable in a pinch). Don't drop the opener, the closer, or the present-day reveal.

## Transitions

**Magic moments (shots 2 and 12)** — the only "designed" effect. Mirror each other for symmetry. Two stacked layers in Remotion:

1. White radial bloom (full-frame brightness ramp, 0 → 100% → 60% over 0.4s)
2. Particle / stardust overlay drifting outward (use a pre-made particle PNG sequence or Remotion's `random` + tiny circles)

If a polished particle effect eats more than 30 minutes — drop the particles, keep the white bloom. The bloom alone reads as "magic." Don't gold-plate.

**Between Pixar frames (shots 4, 6, 8, 10)** — plain crossfade. 0.4s. The visual continuity already comes from the locked Pixar style + Seedance subtle motion. Don't add morph effects; they'll fight the style.

## Music decision

**Skip music for v1.** Reasoning:
- Music selection is a known time-sink that produces small marginal value for a 18-second video.
- The visual concept is strong enough to read silent.
- Music can be added in v2 (after first ship).
- If shipping ahead of schedule, allow exactly 20 minutes to find one track. Hard cap. Otherwise no music.

## Caption / on-screen text

**No on-screen text.** Let the visual do the work. The X / YouTube caption alone tells viewers what they're watching.

Posting caption (draft):

> Pixar-style time-lapse of me through the years. Real → dream → real. Built today with the imagegen skill + Seedance + Remotion.

(Update the tool list before posting based on whichever model actually produced the stylized portraits — see the Stylization status section below.)

## Stylization status (live as of 2026-05-07)

The plan is to stylize all 6 photos to a consistent Pixar 3D look using the locked prompt in `brief.md`, write outputs to `stylized/`, then animate each via Seedance into `seedance_clips/`.

**Current blocker:** the canary stylization on `01_child.jpg` did not complete.

What was tried:
1. `gpt-image-2` via the imagegen skill, `--quality high`, identity-preserve + style-transfer edit. **Failed:** 499 from the litellm proxy (Azure App Service ~230s frontend cap; high-quality edits exceed it).
2. Same model, `--quality medium`. **Failed:** Azure content-safety `moderation_blocked` on the child photo (Azure's `gpt-image-2` is strict about real-person face edits, especially children).

**Next options for the next agent:**
- **Switch to `gemini-3-pro-image-preview` (Nano Banana Pro)** via the same litellm proxy. It's already configured in `~/GitHub/litellm/config.yaml`. It's the headline use case for this model and Azure's `gpt-image-2` moderation does not apply.
- Try `gpt-image-1.5` (different Azure safety thresholds — lower confidence it'll work).
- Reframe the prompt to avoid moderation triggers (weaker instruction; gamble).

**Recommendation:** go with `gemini-3-pro-image-preview`. Run the canary on `01_child.jpg` first; only batch the remaining 5 once likeness is confirmed. Use `--quality medium` to stay under the App Service timeout regardless of model.

If the canary still fails or likeness drops, the next move is to try the prompt reframe before switching infra.

## Composition shape (Remotion)

`src/projects/evolution-of-adi/`:

- `composition.js` — registers config: `id: "evolution-of-adi"`, `fps: 30`, `width: 1080`, `height: 1080`, `durationInFrames: 528` (~17.6s @ 30fps)
- `EvolutionComp.js` — sequences shots 1–13 using Remotion's `<Sequence>` and `<Series>`, with `<AbsoluteFill>` for the magic-bloom overlay
- `assets.js` — exports paths for the 7 source files used in the comp (5 Pixar clips + 2 real photo bookends), plus timing anchors

Register in `src/projects/registry.js`.

## Production order (what to do, in what sequence)

Photos are already locked in `originals/` — skip to step 3.

1. ~~Pick photos~~ (done)
2. ~~Confirm chronological order~~ (done — see "Source photos — locked" above)
3. **Stylize the canary first** — `originals/01_child.jpg` only. Confirm likeness holds before batching. See "Stylization status" for the current blocker and next-model options.
4. **Stylize the remaining 5** with the locked Pixar prompt. Save outputs to `stylized/01_child.png` through `stylized/06_present_day.png`. (Note: `06_present_day` is also the real bookend closer — only the *Pixar* version goes through stylization+Seedance; the *real* photo is used directly in shot 13.)
5. **Animate each Pixar portrait through Seedance** with subtle motion (slight head turn, breathing, blink). Save to `seedance_clips/01_child_pixar.mp4` etc.
6. **Build the Remotion composition** under `src/projects/evolution-of-adi/` per the shot list above. Register in `src/projects/registry.js`.
7. **Render. Watch once. Ship.**

## Discipline reminders

- **Magic effect** is the only place where polish creep can hide. If white bloom alone works, ship it. Particles are optional.
- **Don't add a third bookend** ("what if real → Pixar → real → Pixar → real?"). Two bookends. Symmetry. Done.
- **The real present-day photo is the closing punch.** Don't let it be a casual selfie. Pick one with eye contact and a calm expression.

## Out of scope (storyboard-level)

- Book / scanning concept (next video).
- Voiceover narration.
- Multiple style variants.
- More than 2 real bookends.
- On-screen text / titles / dates per age.
- Anything beyond crossfade + bloom for transitions.
