# Local Preview Commands (Repo)

```bash
cd ~/GitHub/adithyan-ai-videos
npm start
```

Notes:
- `npm start` uses a local URL cache by default (downloads remote URLs from `src/projects/*/assets.js` once and serves them via `--public-dir`).
- Cache dir defaults to `~/.cache/win-remotion-assets` (override with `WIN_REMOTION_ASSET_CACHE=/tmp/win-remotion-assets`).
- Force re-download for Studio: `npm start -- --refresh`

## Render (Code-First)

```bash
cd ~/GitHub/adithyan-ai-videos
npm run render
```

Notes:
- `npm run render` also uses the same cache by default.
- Disable caching: `npm run render -- --no-cache`
- Force re-download: `npm run render -- --refresh`
  - See `references/asset-caching.md` for the details (sha1(url) filenames, assetMap wiring).

### Fast Iteration (Recommended)

```bash
# Render just a slice (timestamps in seconds)
npm run render -- --from 0 --to 6

# Full quality (disable preview defaults)
npm run render -- --hq

# Pick a different composition
npm run render -- --comp OcclusionDemo --from 0 --to 3
```
