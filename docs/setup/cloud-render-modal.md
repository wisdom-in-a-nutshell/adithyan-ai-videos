# Cloud Render (Modal)

## Command

```bash
npm run render:cloud -- --comp TextEffects --hq
```

## Preconditions

- Working tree is clean and pushed (cloud render resolves by git SHA).
- Modal auth and required secrets are configured.
- `r2-secret` exists for upload and public URL return.
- The target composition must not depend on ignored local runtime media.
  Active cloud-safe projects should keep runtime assets in `assets.js` as
  remote URLs.

## Notes

- Use local preview slices before cloud HQ renders.
- Keep cloud renders for stable checkpoints, not tight iteration.
- Current backend tuning is calibrated against `C0046` on a representative
  `72s -> 88s` slice:
  - worker reservation: `64` CPU cores, `65536` MB memory
  - default auto concurrency target: `28`
  - benchmark results:
    - `16x`: about `135.04s`
    - `20x`: about `122.72s`
    - `24x`: about `124.09s`
    - `28x`: about `113.00s`
    - `32x`: about `118.25s`
- The current best observed default is therefore `28x` on the `64 CPU / 64 GiB`
  worker profile, not the maximum possible concurrency.
- A later fair comparison on the same pushed SHA showed that reducing CPU to
  `32` while keeping `64 GiB / 28x` made the same slice slower (`106s`) than
  `64 CPU / 64 GiB / 28x` (`97s`), so keep `64 CPU` if speed is the priority.
