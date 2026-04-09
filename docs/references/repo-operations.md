# Repo Operations

## Primary Commands

- `npm start`: start Remotion Studio through `scripts/studio_cached.mjs`.
- `npm run render -- --comp <CompositionId> --from 0 --to 6`: render a short
  preview slice for iteration.
- `npm run render -- --comp <CompositionId> --hq --out tmp/<CompositionId>-hq.mp4 --no-open`:
  render a local high-quality checkpoint.
- `npm run render:cloud -- --comp <CompositionId>`: submit a production cloud
  render through the deployed Modal app and wait for the final URL.
- `npm run new:project -- --id <project-id> --title "My Video"`: scaffold both
  project folders and register the new composition.
- `npm run doctor`: verify repo shape and composition registration.
- `npm run check:fast`: run the staged-file guardrail used by pre-commit.

## Validation Contract

- Husky pre-commit runs `npm run check:fast`.
- `check:fast` must stay fast and non-rendering.
- Current blocking checks:
  - merge conflict markers in staged files
  - invalid staged JSON
  - `npm run doctor`
  - `npx remotion compositions src/index.js`

## Execution Notes

- `npm start` and `npm run render -- ...` scan `src/projects/*/assets.js`,
  build a local asset cache, and pass cached props plus a merged public dir into
  Remotion.
- For an active project that should render in cloud, keep runtime media in
  `src/projects/<id>/assets.js` as remote URLs. Local review still works because
  the cache downloads those assets once and reuses them.
- Treat local frame directories and scratch media as source material, not as
  long-term runtime dependencies. If a cutout/effect needs them for quality,
  prefer converting them into one uploaded transparent video and then pointing
  `assets.js` at that remote asset.
- `npm run render:cloud` owns the cloud wait loop. It prints the Modal call id,
  dashboard URL, heartbeat status lines, and the final output URL. Do not do
  separate manual polling unless you are debugging the backend itself.
- Use short local preview slices during iteration and reserve cloud or HQ
  renders for stable checkpoints.

## CI Policy

- This repo is local-first and currently relies on local guardrails instead of
  CI.
- Add minimal CI only if cross-machine drift, repeated local-only breakage, or
  a remote release gate becomes a real requirement.

## Related References

- `docs/references/verification-loop.md`
- `docs/setup/cloud-render-modal.md`
