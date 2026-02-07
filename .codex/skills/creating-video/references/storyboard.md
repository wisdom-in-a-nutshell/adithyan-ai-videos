# Storyboard Format

Keep storyboards as data you can iterate on. Prefer one file per project:

- `~/GitHub/adithyan-ai-videos/projects/<project-id>/storyboard.json`

## Minimal Contract

- `beats[]`: list of beats
- each beat has `start`, `end` (seconds), plus intent + overlay notes
- optionally include `sentences[]` to reference `projects/<project-id>/sentences.json`
- optionally include `sentence_text[]` (or a single `transcript` string) to inline the exact transcript for that beat (usually derived from `sentences[]`)

Example:

```json
{
  "beats": [
    {
      "source_start": 0.0,
      "source_end": 1.5,
      "sentences": [1, 2],
      "sentence_text": ["Sentence one.", "Sentence two."],
      "intent": "Hook",
      "visual_notes": ["High-contrast hero text"]
    },
    {
      "source_start": 1.5,
      "source_end": 5.0,
      "sentences": [3],
      "sentence_text": ["Sentence three."],
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
- If an effect needs matting, note it on the beat (e.g. “text behind subject”) and generate `projects/<project-id>/matting.json` when needed.
