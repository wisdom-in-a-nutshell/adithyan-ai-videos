# Local Preview Commands (Repo)

```bash
cd ~/GitHub/adithyan-ai-videos
npm run start
```

## Recommended: Studio With Local Asset Cache

Iterate quickly by caching remote `project.json` assets locally:

```bash
cd ~/GitHub/adithyan-ai-videos
npm run studio:project -- projects/<project-id>/project.json --comp OcclusionDemo
```

Notes:
- Default cache dir: `~/.cache/win-remotion-assets` (override with `WIN_REMOTION_ASSET_CACHE=/tmp/win-remotion-assets`)
- Cache is outside the repo, so it’s automatically excluded from git.
- Use `--no-cache` if you want to force remote URLs (slower).

Force re-download:

```bash
npm run studio:project -- projects/<project-id>/project.json --comp OcclusionDemo --refresh
```

Example render:

```bash
node scripts/render_project.mjs projects/<project-id>/project.json --comp OcclusionDemo --out /tmp/<project-id>.mp4 --seconds 5 --fps 24
```
