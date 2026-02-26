# Adithyan AI Videos

Remotion playground for producing short marketing-style videos (occlusion demos, overlays, motion experiments).

## Quickstart

```bash
npm ci
npm start
```

Then open the Studio URL (shown in the terminal) and pick a composition.

## Render

```bash
npm run render -- --comp TextEffects --preview --from 0 --to 5
npm run render -- --comp TextEffects --hq --out /tmp/TextEffects-hq.mp4 --no-open
```

## New Project Scaffold

```bash
npm run new:project -- --id my-next-video --title "My Next Video"
```

Then run:

```bash
npm run doctor
```

## Inputs

- Word-level timings / storyboard notes (when present) live under `projects/<project-id>/`.

## Environment knobs

- `WIN_OCCLUSION_ALPHA_URL`: override the default alpha matte WebM URL (some demos/scripts may read this).

## Rights / Footage

If you render with third-party footage, you’re responsible for having the rights to use it.
