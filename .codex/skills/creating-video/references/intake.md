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

Default ingestion/transcription channel for this workflow: `ADITHYAN`.

Command:

```bash
cd /Users/adi/GitHub/win
venv/bin/python scripts/tools/media/transcribe.py "<video-url>" \
  --channel ADITHYAN \
  --out /Users/adi/GitHub/adithyan-ai-videos/projects/<project-id>/transcript.json
```

Notes:
- By default this emits a full JSON payload:
  - `source_id`
  - `text`
  - `words` (normalized word timings)
  - `sentences`
- Channel should always be `ADITHYAN` for this workflow.
- After transcription, generate thin derived artifacts for convenience:

```bash
cd /Users/adi/GitHub/adithyan-ai-videos
node scripts/extract_transcript_artifacts.mjs projects/<project-id>
```

Outputs:
- `projects/<project-id>/words.json`
- `projects/<project-id>/sentences.json`

If the user does not have a storyboard:

- Draft a 3–7 beat storyboard (timestamps, intent, overlay notes).
- Confirm it with the user.
- Then implement in Remotion and verify with short renders.

## Foreground Matting / Alpha (Optional)

Don’t put `alpha_url` in `project.json`.

If/when occlusion is needed, generate a matte in WIN and write it to:

- `projects/<project-id>/matting.json`

Command:

```bash
cd /Users/adi/GitHub/win
venv/bin/python scripts/tools/media/matting.py "<video-url>" \
  --model-version v2 \
  --out /Users/adi/GitHub/adithyan-ai-videos/projects/<project-id>/matting.json
```

Notes:
- `matting.json` should contain `alpha_url`.
- Our Remotion launch/render scripts auto-load `matting.json` (if present) and pass `alphaUrl` as a prop.

## Other Tools

See `references/tools.md` for the inventory of available WIN scripts (and use `--help` to discover flags).
