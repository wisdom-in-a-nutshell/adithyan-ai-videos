# Evolution of Adi — Storyboard

## Concept (one line)

A child's real photo dissolves into Pixar-stylized magic, journeys through every age of Adi, and returns to a real present-day photo. *That kid is me, now, here.*

## Why this concept (vs. the "scanning into a book" alternative)

The book-frame idea — camera diving into a book, finding him as a Pixar character, then unfolding the story — is genuinely stronger as a narrative shape. **It gets its own video.** Not today. It needs a book asset, page-flip animation, a zoom-in sequence; realistically a 2-day build.

The real-bookends + Pixar-middle structure delivers ~80% of the same emotional payoff at ~25% of the production cost. The two real photos are the truth; the Pixar middle is the dream of looking back at your own life. The two magic transitions are the entry and exit from that dream. Symmetry is built in.

**Save the book idea for the next video. Ship this one today.**

## The arc — direction

Reversed chronological: **child → present**. Ending on real present-day Adi lands the emotional punch ("that kid is me, now"). Opening on the youngest real photo gives the audience a person to attach to immediately.

## Shot list

Total runtime target: **18–20s, 1:1 square**.

| # | Shot | Source | Duration | Notes |
|---|------|--------|----------|-------|
| 1 | Real child photo (youngest available) | `originals/01_child_real.jpg` | 2.0s | Hold still, slight Ken Burns (3% zoom in) |
| 2 | **Magic transition** — entering the dream | overlay effect | 0.6s | White-bloom flash + particle/stardust dissolve |
| 3 | Pixar child portrait | `seedance_clips/02_child_pixar.mp4` | 2.0s | Subtle blink / breath via Seedance |
| 4 | Crossfade morph | — | 0.4s | Smooth dissolve between Pixar frames |
| 5 | Pixar teen | `seedance_clips/03_teen_pixar.mp4` | 1.8s | Subtle motion |
| 6 | Crossfade morph | — | 0.4s | |
| 7 | Pixar early-20s | `seedance_clips/04_early20s_pixar.mp4` | 1.8s | Subtle motion |
| 8 | Crossfade morph | — | 0.4s | |
| 9 | Pixar late-20s | `seedance_clips/05_late20s_pixar.mp4` | 1.8s | Subtle motion |
| 10 | Crossfade morph | — | 0.4s | |
| 11 | Pixar present-day | `seedance_clips/06_present_pixar.mp4` | 2.0s | Subtle motion, hold slightly longer |
| 12 | **Magic transition** — exiting the dream | overlay effect | 0.6s | Mirror of shot 2: bloom flash + dissolve |
| 13 | Real present-day photo | `originals/07_present_real.jpg` | 2.5s | Hold longest. This is the punchline. Slight Ken Burns out (start at 3% zoom, settle to 0) |

**Total: ~18.7s** (within target).

If pushed for time: drop one of the middle Pixar ages (early-20s OR late-20s) to compress to ~15s. Don't drop the bookends or the magic transitions — they carry the concept.

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

> Pixar-style time-lapse of me through the years. Real → dream → real. Built today with Nano Banana Pro + Seedance + Remotion.

## Composition shape (Remotion)

`src/projects/evolution-of-adi/`:

- `composition.js` — registers config: `id: "evolution-of-adi"`, `fps: 30`, `width: 1080`, `height: 1080`, `durationInFrames: 561` (~18.7s @ 30fps)
- `EvolutionComp.js` — sequences shots 1–13 using Remotion's `<Sequence>` and `<Series>`, with `<AbsoluteFill>` for the magic-bloom overlay
- `assets.js` — exports paths for all 7 source files (5 Pixar clips + 2 real photos), plus timing anchors

Register in `src/projects/registry.js`.

## Production order (what to do, in what sequence)

1. **Pick the youngest real photo** that has a clear face. Crop square, save as `originals/01_child_real.jpg`.
2. **Pick the most recent real photo** (selfie or portrait). Crop square, save as `originals/07_present_real.jpg`.
3. **Pick 5 photos for the Pixar middle**: one per stop (child, teen, early-20s, late-20s, present). Square crop each. Save as `originals/02_*` through `originals/06_*`.
4. **Stylize all 5 with the locked Pixar prompt** (in `brief.md`). Save outputs to `stylized/`.
5. **Animate each Pixar stylized portrait through Seedance** with subtle motion. Save to `seedance_clips/`.
6. **Build the Remotion composition** to the shot list above.
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
