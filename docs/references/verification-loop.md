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

## 3) Deterministic Still

```bash
npx remotion still src/index.js <CompositionId> /tmp/<id>-f0048.png --frame 48 --overwrite
```

Use stills for quick visual A/B checks (edge cleanup, readability, spacing).

## 4) Quality Pass

```bash
npm run render -- --comp <CompositionId> --hq --out /tmp/<CompositionId>-hq.mp4 --no-open
```

Run only when a section is stable.
