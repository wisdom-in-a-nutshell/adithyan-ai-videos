# Local Preview Commands (Repo)

```bash
cd ~/GitHub/adithyan-ai-videos
npm run start  # or: npm run studio:project -- projects/<project-id>/project.json
```

## Recommended: Studio With Local Asset Cache

Iterate quickly by caching remote `project.json` assets locally:

```bash
cd ~/GitHub/adithyan-ai-videos
npm run studio:project -- projects/<project-id>/project.json --comp OcclusionDemo
```

Force re-download:

```bash
npm run studio:project -- projects/<project-id>/project.json --comp OcclusionDemo --refresh
```

Example render:

```bash
node scripts/render_project.mjs projects/<project-id>/project.json --comp OcclusionDemo --out /tmp/<project-id>.mp4 --seconds 5 --fps 24
```
