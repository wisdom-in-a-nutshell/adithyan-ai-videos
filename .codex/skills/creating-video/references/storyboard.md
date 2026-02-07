# Storyboard Format

Keep storyboards as data you can iterate on. Prefer one file per project:

- `~/GitHub/adithyan-ai-videos/projects/<project-id>/storyboard.json`

## Minimal Contract

- `beats[]`: list of beats
- each beat has `start`, `end` (seconds), plus intent + overlay notes

Example:

```json
{
  "beats": [
    {
      "start": 0.0,
      "end": 1.5,
      "intent": "Hook",
      "overlays": [
        {"type": "status_pill", "text": "Active speaker", "pos": "top_left"}
      ]
    },
    {
      "start": 1.5,
      "end": 5.0,
      "intent": "Demo",
      "overlays": [
        {"type": "occlusion_text", "text": "WORDS BEHIND ME", "style": "os_pill"}
      ]
    }
  ]
}
```

## Notes

- The schema can evolve; what matters is: beats + timing + intent.
- Keep “implementation details” (exact props) out of the storyboard unless needed.
- If an effect needs matting, note it on the beat (`occlusion_text` implies `alpha_url`).
