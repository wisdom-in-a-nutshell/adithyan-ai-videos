# New Project Flow

Use this when a prompt lands in the shape:

- "Here is a video, build this edit"
- "Make this effect-heavy demo"
- "Start a new project from this recording"

## First Response

1. Decide whether this is a new project or an edit to an existing one.
2. If it is new, create a descriptive project id and scaffold it with:

```bash
npm run new:project -- --id <project-id> --title "My Video"
```

3. Check whether the user already has:
   - a storyboard
   - source video
   - timing anchors
   - reference visuals or an old comp to match
4. If the storyboard is missing, draft a short beat list before writing a lot of code.
5. If timing anchors are missing but the transcript is already available, derive
   them once with:

```bash
node scripts/find_phrase_frames.mjs \
  --words src/projects/<project-id>/transcript_words.json \
  --phrase "<phrase>" \
  --fps <fps>
```

Then copy the chosen anchors into `src/projects/<project-id>/assets.js`.

## Default Tool Surfaces

- Use `npm start` for Studio preview.
- Use `npm run render -- --comp <CompositionId> --from ... --to ...` for local slices.
- Use `npm run render:cloud -- --comp <CompositionId>` only for stable checkpoints.
- Use `$media-toolkit` first for media-processing work such as transcription, transforms, or matting.

Do not invent a new client surface for ordinary project work if one of the repo commands already covers it.

## Asset Decision

- Treat `projects/<id>/` and `public/imports/<id>/` as source-material space.
- Treat `src/projects/<id>/assets.js` as the runtime contract.
- If the composition needs an asset at render time and cloud compatibility matters, promote it into a stable remote URL before relying on it.

## Reuse Decision

- Check `src/effects/` and `src/projects/effects-lab/` before copying an old narrative comp.
- Keep bespoke timing, copy, and scene choreography in the project until the abstraction repeats.
- If a pattern repeats, prefer extracting it into `src/effects/` instead of growing another one-off local wrapper.
- If you are unsure whether a pattern should be extracted, read
  `references/effect-extraction.md` first.

## Verification Rule

1. Get the scene working in Studio.
2. Render a short local slice.
3. Extract exact stills from that clip if needed.
4. Only then run cloud or HQ renders.

## When To Create More Structure

- Add `docs/projects/<project-id>/tasks.md` if the work will span sessions.
- Add new repo docs only when the behavior is durable and future agents will need it.
- Add a new skill or client only if the same workflow keeps being rediscovered and cannot be captured cleanly by the current repo docs plus command surfaces.
