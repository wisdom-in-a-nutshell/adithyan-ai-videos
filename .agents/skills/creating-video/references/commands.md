# Commands

## Scaffold

```bash
cd <repo-root>
npm run new:project -- --id object-segmentation --title "My Video"
```

Notes:
- This creates both `src/projects/<project-id>/` and `projects/<project-id>/`.
- It updates `src/projects/registry.js`; do not hand-wire new projects directly in `src/Root.js`.
- If the work will span sessions, add `docs/projects/<project-id>/tasks.md` as the resume point.

## Studio

```bash
cd <repo-root>
npm start
```

Notes:
- `npm start` uses a local URL cache by default (downloads remote URLs needed by the active composition set from `src/projects/registry.js` and serves them via `--public-dir`).
- Cache dir defaults to `~/.cache/win-remotion-assets` (override with `WIN_REMOTION_ASSET_CACHE=/tmp/win-remotion-assets`).
- Force re-download for Studio: `npm start -- --refresh`

## Local Render

```bash
cd <repo-root>
npm run render
```

Notes:
- `npm run render` also uses the same cache by default.
- Disable caching: `npm run render -- --no-cache`
- Force re-download: `npm run render -- --refresh`
  - See `references/asset-caching.md` for the details (sha1(url) filenames, assetMap wiring).
- Default render output is repo-local `tmp/<comp>.mp4`.
- If you want a different stable filename, pass `--out`.

## Cloud Render

```bash
cd <repo-root>
npm run render:cloud -- --comp <CompositionId>
```

Notes:
- This uses the deployed production Modal app, not `modal run -d`.
- The command waits internally, prints heartbeat status lines, and returns the final URL when the cloud render finishes.
- Cloud render is by pushed git SHA, so the working tree must be clean and pushed first.
- Keep cloud renders for stable checkpoints. Use local slices first.

## Common Examples

```bash
# Fast local slice on the active narrative project
npm run render -- --comp ObjectSegmentation --from 68 --to 90

# Later beat-stack slice on the active narrative project
npm run render -- --comp ObjectSegmentation --from 150 --to 206

# Shared-block preview surface
npm run render -- --comp EffectsLab --from 0 --to 8

# Full quality local render with a stable filename
npm run render -- --comp ObjectSegmentation --hq --out tmp/ObjectSegmentation-hq.mp4

# Full cloud checkpoint once the local pass is stable
npm run render:cloud -- --comp ObjectSegmentation
```

Notes:
- Pick `--from/--to` by looking at the project timestamps in `src/projects/<project-id>/assets.js`.
- `--scale 0.5` means 50% width and 50% height (fast). `--scale 1` is full resolution.
- Lower `--crf` means higher quality (and slower / larger file). For iteration, `--crf 28` is fine.
- `npm run render` defaults to the first enabled composition in `src/projects/registry.js`, so pass `--comp` whenever you want a specific target.

## Media Operations

For media-processing work in this repo, first check `$media-toolkit`. If it covers the task, use it instead of lower-level backend-specific script paths.

```bash
cd <repo-root>
.agents/skills/media-toolkit/scripts/media_toolkit.sh --help
.agents/skills/media-toolkit/scripts/media_toolkit.sh transcribe --help
```

## Setup Helpers

Derive transcript-based anchors once during setup, then hardcode the result in
`assets.js`:

```bash
node scripts/find_phrase_frames.mjs \
  --words src/projects/<project-id>/transcript_words.json \
  --phrase "totally natural" \
  --fps 30
```

## Still Extraction

For quick visual review, it is usually cheaper to extract stills from a short rendered clip than to run `npx remotion still` directly:

```bash
ffmpeg -y -ss 8.0 -i tmp/<CompositionId>.mp4 -frames:v 1 tmp/<CompositionId>-f080.png
```

This is especially useful when the repo render wrapper already validated the clip and you want exact inspection frames from that same output.
