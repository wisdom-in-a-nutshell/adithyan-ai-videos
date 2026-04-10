# Effect Library Learnings

## Keep

- Keep `src/overlay_kit/` for low-level primitives and `src/effects/` for
  repeated house-style beats.
- Keep `EffectsLab` as the shared preview surface for isolated block review.
- Keep project-specific timing, copy, and choreography inside
  `src/projects/<id>/` until the abstraction is actually proven.

## Avoid

- Do not extract a shared block when the abstraction is mostly “forward every
  prop through.”
- Do not treat archival projects with stale assets as required validation
  targets for new shared-layer work.
- Do not invent another broad skill or client layer when a small helper plus
  clearer docs is enough.

## What Helped

- A thin effect catalog plus one shared preview composition was enough to make
  the shared layer discoverable for cold agents.
- A small setup-time phrase helper was more useful than adding dynamic
  transcript lookup into runtime code.
- Explicit extraction criteria reduced the risk of over-abstracting one-off
  scenes into `src/effects/`.

## Future Trigger

Reopen this topic only if:
- agents keep hesitating about whether code belongs in `src/effects/` or the
  project folder
- the shared layer grows enough to need grouped exports or subfolders
- another narrative project exposes a real missing shared block
