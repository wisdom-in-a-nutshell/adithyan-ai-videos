# Cloud Render (Modal)

## Command

```bash
npm run render:cloud -- --comp TextEffects --hq
```

## Preconditions

- Working tree is clean and pushed (cloud render resolves by git SHA).
- Modal auth and required secrets are configured.
- `r2-secret` exists for upload and public URL return.

## Notes

- Use local preview slices before cloud HQ renders.
- Keep cloud renders for stable checkpoints, not tight iteration.
