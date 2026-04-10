# Verification Loop

Use deterministic renders and stills for review. Studio playback is useful, but not final truth.

## 1) Studio Check

```bash
npm start
```

In Studio:

- confirm expected composition is selectable
- confirm named sequence blocks appear for major beats
- scrub key timestamps for overlap and readability

## 2) Fast Render Slice

```bash
npm run render -- --comp <CompositionId> --from 0 --to 6
```

Use short slices for each beat during iteration.

## 3) Exact Still From The Same Clip

```bash
ffmpeg -y -ss 8.0 -i tmp/<CompositionId>.mp4 -frames:v 1 tmp/<id>-f080.png
```

Use this when you want a still from the exact rendered clip you just reviewed.

Examples:

```bash
# Active narrative project
npm run render -- --comp ObjectSegmentation --from 68 --to 90

# Shared block preview surface
npm run render -- --comp EffectsLab --from 0 --to 8
```

## 4) Direct Remotion Still (Secondary Path)

```bash
npx remotion still src/index.js <CompositionId> tmp/<id>-f0048.png --frame 48 --overwrite
```

Use this only when you truly need a single exact frame without first rendering a clip.

## 5) Quality Pass

```bash
npm run render -- --comp <CompositionId> --hq --out tmp/<CompositionId>-hq.mp4 --no-open
```

Run only when a section is stable.

## Shared Block Rule

- If you changed code under `src/effects/`, verify two things before trusting the change:
  - render `EffectsLab` once to inspect the shared block in isolation
  - render at least one real narrative slice that uses that block
