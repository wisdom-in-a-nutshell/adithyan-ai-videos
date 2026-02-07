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
venv/bin/python scripts/tools/video/transcribe.py "<video-url>" \
  --channel ADITHYAN \
  --out /Users/adi/GitHub/adithyan-ai-videos/projects/<project-id>/transcript_words.json
```

Notes:
- Default output is a JSON object with `source_id` + `words` (word-level timings).
- Our Remotion scripts accept either:
  - a raw words array, or
  - `{source_id, words}` (preferred).

If the user does not have a storyboard:

- Draft a 3–7 beat storyboard (timestamps, intent, overlay notes).
- Confirm it with the user.
- Then implement in Remotion and verify with short renders.
