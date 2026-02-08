# Local Preview Commands (Repo)

```bash
cd ~/GitHub/adithyan-ai-videos
npm start
```

## Render (Code-First)

```bash
cd ~/GitHub/adithyan-ai-videos
npm run render
```

### Fast Iteration (Recommended)

```bash
# Render just a slice (timestamps in seconds)
npm run render -- --from 0 --to 6

# Full quality (disable preview defaults)
npm run render -- --hq

# Pick a different composition
npm run render -- --comp OcclusionDemo --from 0 --to 3
```
