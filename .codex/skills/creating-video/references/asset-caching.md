# Asset Caching (Default-On)

Remote MP4/WebM URLs are convenient, but you don't want to re-download them on every Studio restart or render.

This repo uses a **code-first cache**:

- URLs live in code: `src/projects/<id>/assets.js` exports (e.g. `*_VIDEO_URL`, `*_ALPHA_URL`).
- `npm start` and `npm run render` automatically:
  - scan `src/projects/*/assets.js` for exported `http(s)` URLs
  - download them into a local cache dir (stable filename = `sha1(url)` + extension)
  - serve the cache dir via Remotion `--public-dir`
  - pass `assetMap` via `--props` so compositions can rewrite URLs:
    - `"https://.../video.mp4" -> "/<sha1>.mp4"`

## Where The Cache Lives

- Default: `~/.cache/win-remotion-assets`
- Override: `WIN_REMOTION_ASSET_CACHE=/tmp/win-remotion-assets`

## Operational Rules

- No manual “refresh” needed when the URL changes: the hash changes, so the new URL auto-downloads.
- Force re-download (even if already cached): `--refresh`
- Disable caching for a one-off run: `--no-cache` (render only)

## Composition Wiring (What Code Must Do)

If a composition uses remote assets, it should support `assetMap`:

- Add a small resolver like:
  - `resolveAssetSrc(url, assetMap)` that returns `assetMap[url] ?? url`
- Thread `assetMap` into `Video`/`Img` sources.

This keeps the product code clean: callers don't pass flags; caching “just happens”.

