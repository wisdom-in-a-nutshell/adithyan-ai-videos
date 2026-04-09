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
npm run render
npm run render -- --comp C0046 --preview --from 0 --to 5
npm run render -- --comp C0046 --hq --out /tmp/C0046-hq.mp4 --no-open
```

`npm run render` defaults to the first enabled composition in `src/projects/registry.js`.

## New Project Scaffold

```bash
npm run new:project -- --id my-next-video --title "My Next Video"
```

Then run:

```bash
npm run doctor
```

## Inputs

- Runtime composition code lives under `src/projects/<project-id>/`.
- Storyboards, transcripts, derived artifacts, and worklogs live under `projects/<project-id>/`.
- Runtime code should not depend directly on `projects/<project-id>/`; keep runtime inputs explicit in `src/projects/<project-id>/assets.js`.

## Environment knobs

- `WIN_OCCLUSION_ALPHA_URL`: override the default alpha matte WebM URL (some demos/scripts may read this).

## Rights / Footage

If you render with third-party footage, you’re responsible for having the rights to use it.
