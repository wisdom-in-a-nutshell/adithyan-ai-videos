# Evolution of Adi — Project Brief

## Where it sits

- **Wedge (locked 2026-04-03):** AI-assisted content/media creation tools, built for self, shipped for others. See `~/GitHub/adi/memory/areas/builder/builder.md`.
- **Motion:** Daily video practice → notice pain → build small tools → ship publicly. One motion, three outcomes (builder output, freelance inbound, rare-fit job).
- **What this video does:** A personal, low-stakes ship that restarts the daily-shipping muscle and puts Adi in direct contact with current image/video model pain (Nano Banana Pro for stylization, Seedance for motion, Remotion for stitching). The pain noticed during production becomes the next tool seed.

## The two-video plan

1. **Result video (today, by 9pm CEST):** the polished 15–20s evolution time-lapse itself. This is the artifact that ships.
2. **Making-of video (follow-up, soon):** narrated walkthrough of the workflow — pain points hit, prompt iteration, what worked, what failed, where the agent was editing blind. This is the *builder* video; the result video is the bait that earns attention for it.

Both matter. The result alone is charming personal content. The making-of alone has no artifact to anchor it. Together they're a complete builder beat: visible work + visible process.

## What we're making (result video)

A short stylized time-lapse of Adi from childhood to present day. Five to seven existing personal photos, all stylized to one consistent look, optionally animated with Seedance, stitched in Remotion. ~15–20 seconds, 1:1 square.

## Style — locked

**Pixar 3D portrait.** Decided after weighing Pixar vs anime.

- Anime risks flattening 5 different photos into "same generic anime character with different hair." The whole emotional payoff depends on viewers seeing it's the *same person* aging. Anime fights that.
- Pixar 3D holds specific facial features (eye shape, brow, nose, jawline) reliably across ages.
- Anime time-lapses of "me through the years" are saturated right now. Pixar still feels intentional.
- Pixar reads better at thumbnail scale.

If the first generated photo doesn't hold likeness, adjust the prompt — don't re-open the style choice.

### Locked prompt (use for every photo, unchanged)

> Pixar-style 3D character portrait of the person in this photo, soft cinematic studio lighting, expressive eyes, preserve exact facial features (eye shape, eyebrows, nose, jawline, skin tone, hairline), warm color palette, neutral background, head-and-shoulders, square composition, high detail, photorealistic 3D rendering, consistent style.

Same prompt for every photo. That sameness is what locks the visual continuity across the time-lapse.

## Inputs

- 5–7 photos pulled from Adi's personal archive. Cover the range: child → teen → early 20s → late 20s → present.
- Drop originals into `originals/` with consistent square crop, face-centered, sorted by approximate age.
- For the final present-day frame: generate a Pixar portrait using a recent photo as reference, same prompt.

## Pipeline

1. **Hit screen record now.** QuickTime or Screen Studio. Free insurance for the making-of video. If you don't capture this session, the follow-up becomes a from-memory reconstruction and probably won't ship.
2. **Pick 5–7 photos.** Strongest range over completeness. Don't agonize.
3. **Drop into `originals/`.** Square crop, face-centered.
4. **Stylize one photo first, end-to-end, before batching the rest.** Save to `stylized/`. Confirm likeness held. If not, adjust prompt — small iteration, not a style re-decision.
5. **Batch the remaining photos** through the same locked prompt. Save to `stylized/`.
6. **Generate the present-day frame** with the same prompt + recent reference photo. Save to `stylized/`.
7. **Animate each stylized portrait with Seedance** — subtle motion (slight head turn, breathing, eye blink). Short clips, ~1.5–2s each. Save to `seedance_clips/`.
8. **Stitch in Remotion** under `src/projects/evolution-of-adi/`. Chronological order. Smooth transitions. Total ~15–20s.
9. **Ship.** YouTube Shorts + X. Caption: short, human, names the tools used.

## Folder contract

Follows the repo's project contract (`docs/references/project-contract.md`). Source artifacts under `projects/`, runtime composition code under `src/projects/`.

```
projects/evolution-of-adi/
  brief.md             # this file
  originals/           # raw source photos
  stylized/            # Pixar-rendered portraits (output of Nano Banana Pro)
  seedance_clips/      # animated portrait clips
src/projects/evolution-of-adi/
  composition.js       # Remotion composition config (registered in registry.js)
  EvolutionComp.js     # composition component
  assets.js            # asset URLs/paths and timing anchors
```

Register the composition in `src/projects/registry.js` per repo contract once the runtime files exist.

## Ship target

- **Aspect ratio:** 1:1 square. Crops cleanly to YouTube Shorts (9:16 with letterboxing) and lands on X / LinkedIn without re-render.
- **Duration:** 15–20 seconds.
- **Music:** optional. Skip if it slows shipping.
- **Hard deadline:** 9pm CEST tonight, 2026-05-07. Whatever isn't done ships rough or is cut. No extension.
- **Posting surfaces:** YouTube Shorts + X. LinkedIn optional.

## Discipline & watchouts

These are the failure modes most likely to derail today. Re-read if stuck.

- **Decision-loop trap.** Style is locked. Prompt is locked. Don't re-open either. If a photo result is bad, iterate inside the prompt; don't re-decide the style.
- **Overthinking before doing.** Builder canon: *"the whole point of this approach is daily action, not strategy."* Don't research more tools. Don't compare options. Generate.
- **Polish drift.** This is a v1 ship. Eight rough photos > five perfect ones if it's 8:30pm.
- **Screen recording.** Capture from the start. Forgetting this is the #1 reason the making-of follow-up won't ship.
- **AIP creep.** Maintenance mode. AIP work doesn't displace today's ship.

## What this seeds

Likely pain points to log during production (these become candidates for the next tool):

- Prompt drift across photos despite using the same prompt.
- Likeness loss in specific age ranges (very young child, teen).
- Seedance producing motion that breaks the still-portrait feel.
- Manual screenshot-and-describe loop with the agent generating the Pixar portraits — the **agent visual feedback loop** pain almost certainly resurfaces here. That's the one already identified as the first real tool to build (`~/GitHub/adi/memory/areas/builder/builder.md` "Emerging core problem").

If the agent-visual-feedback pain is concrete enough by end of day, the next builder beat is: prototype the render → screenshot → feed-to-agent loop using this exact project as the testbed.

## Out of scope today

- Making-of voiceover video.
- Per-platform aspect-ratio variants beyond 1:1.
- Multiple style attempts.
- Polish beyond v1.
- Refactoring shared overlay/effect kit code.
- Building the visual-feedback-loop tool (logged for next beat, not today).
