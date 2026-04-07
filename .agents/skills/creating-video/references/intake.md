# Intake (Ask First)

Before writing code, get the video URL, transcribe it, then clarify: goal, beats, constraints.

Use these questions (keep it short; don’t interrogate):

1. Goal: What should a viewer think/do at the end?
2. Storyboard: Do you already have one? If yes, paste it. If no, do you want me to draft one?
3. Source: What’s the source video (URL or `source_id`), and what section(s) of it do we use?
4. Overlays/FX: Which overlays do you want (text-behind-subject, callouts, lower-third, sketch style, etc.)?
5. Style reference: Which existing video/project should it match?
6. Output constraints: Aspect ratio, resolution, fps, and target platform (X/LinkedIn/YouTube/Shorts).

## Transcription (Default)

First check `$media-toolkit` for media-processing work in this repo. It should usually be the default surface for transcription and other media jobs when it supports what you need.

Command:

```bash
cd <repo-root>
.agents/skills/media-toolkit/scripts/media_toolkit.sh transcribe --url "<video-url>" \
  --out projects/<project-id>/transcript.json
```

Notes:
- By default this emits a full JSON payload:
  - `source_id`
  - `text`
  - `words` (normalized word timings)
  - `sentences`
- For local source media, first check whether `$media-toolkit` supports the direct file path you have.
- For code-first Remotion projects, prefer committing a thin words-only artifact inside the project:
  - `src/projects/<project-id>/transcript_words.json` (usually copied from `transcript.json.words`)

Optional (convenience), generate thin derived artifacts:

```bash
cd <repo-root>
node scripts/extract_transcript_artifacts.mjs projects/<project-id>
```

Outputs:
- `projects/<project-id>/words.json`
- `projects/<project-id>/sentences.json`

If the user does not have a storyboard:

- Draft a 3–7 beat storyboard (timestamps, intent, overlay notes).
- Confirm it with the user.
- Then implement in Remotion and verify with short renders.

## Proxies / Scaling (Optional)

If iteration is slow (matting, Studio playback, remote fetch), it’s ok to work off a smaller proxy video.

- First check `$media-toolkit` for transform support before reaching for lower-level WIN internals.
- Persist the transform output JSON under the project folder (e.g. `projects/<project-id>/transform_720p.json`).
- While iterating, point your composition’s `VIDEO_URL` (usually in `src/projects/<project-id>/assets.js`) to the transform `output_url`.
- Keep the original source URL referenced in the transform JSON (`input_url`) for later “final” exports.

## Foreground Matting / Alpha (Optional)

If/when occlusion is needed, you want a **real alpha asset** (typically `alpha.webm` = VP9 + alpha).

Workflow:

- First check `$media-toolkit` for a matting path. If it does not cover the case, then drop lower into the backend-specific workflow.
- Paste the resulting `alpha.webm` URL into `src/projects/<project-id>/assets.js` (code-first).

Notes:

- We are intentionally not standardizing on `projects/<project-id>/matting.json` as a required artifact.
- If you keep any generated matte metadata, treat it as a scratch artifact, not a contract.

## Other Tools

Use `$media-toolkit` as the first place to look for media operations from this repo. Only reach for lower-level WIN paths when the toolkit does not cover the task.
