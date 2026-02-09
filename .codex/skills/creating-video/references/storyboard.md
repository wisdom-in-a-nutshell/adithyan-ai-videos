# Storyboard Format

Keep storyboards as data you can iterate on. Prefer one file per project:

- `~/GitHub/adithyan-ai-videos/projects/<project-id>/storyboard.json`

## Scene Numbers (Recommended)

Add a stable `scene` label per beat so you can reference the storyboard and the Remotion timeline with the same IDs.

Convention:

- Beats: `S01`, `S02`, `S03`, ...
- Optional sub-beats: `S03A`, `S03B`, ...
- If you embed sub-beats, use `scene_parts[]` with their own `scene` + `source_start`/`source_end`.

## Minimal Contract

- `beats[]`: list of beats
- each beat has `start`, `end` (seconds), plus intent + overlay notes
- optionally include `sentences[]` to reference `projects/<project-id>/sentences.json`
- optionally include `transcript` to inline the exact transcript for that beat (usually derived from `sentences[]`)

Example:

```json
{
  "beats": [
    {
      "id": "hook",
      "scene": "S01",
      "source_start": 0.0,
      "source_end": 1.5,
      "sentences": [1, 2],
      "transcript": ["Sentence one.", "Sentence two."],
      "intent": "Hook",
      "visual_notes": ["High-contrast hero text"]
    },
    {
      "id": "demo",
      "scene": "S02",
      "source_start": 1.5,
      "source_end": 5.0,
      "sentences": [3],
      "transcript": ["Sentence three."],
      "intent": "Demo",
      "visual_notes": ["Text behind subject (requires matting)"]
    }
  ]
}
```

## Notes

- The schema can evolve; what matters is: beats + timing + intent.
- Keep “implementation details” (exact props) out of the storyboard unless needed.
- Use `source_start`/`source_end` (seconds in the original recording). We’ll map these into an edited timeline later.
- If an effect needs occlusion (text behind subject), note it on the beat (e.g. “text behind subject”) and ensure your composition uses an `alpha.webm` URL (VP9 with alpha) in `src/projects/<project-id>/assets.js`.
