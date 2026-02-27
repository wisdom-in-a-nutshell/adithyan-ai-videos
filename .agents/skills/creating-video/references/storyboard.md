# Storyboard Format

Keep storyboards as data you can iterate on. Prefer one editable file per project:

- `~/GitHub/adithyan-ai-videos/projects/<project-id>/storyboard.md`

Optional:

- `~/GitHub/adithyan-ai-videos/projects/<project-id>/storyboard.json` (only when a downstream script needs machine parsing)

## Scene Numbers (Recommended)

Add a stable `scene` label per beat so you can reference the storyboard and the Remotion timeline with the same IDs.

Convention:

- Beats: `S01`, `S02`, `S03`, ...
- Optional sub-beats: `S03A`, `S03B`, ...
- If you embed sub-beats in Markdown, use subheadings (`### S03A`) with their own time ranges.

## Markdown Contract (Default)

Use one `##` section per beat:

- heading pattern: `## S01 | 0.00-6.00 | Hook`
- required lines in each beat:
  - `Intent: ...`
  - `Audio: ...`
  - `Visual: ...`
  - `Edit cue: ...`
- optional lines:
  - `Sentences: 1, 2` (for `sentences.json` cross-reference)
  - `Transcript: ...` (exact spoken line)

Recommended frontmatter:

- `project_id`
- `aspect`
- `target_duration_sec`
- `audience`
- `cta`

Example:

```md
---
project_id: stadia-macos-controller-demo
aspect: 16:9
target_duration_sec: 60
audience: builders, ai-devs
cta: check-repo
---

## S01 | 0.00-6.00 | Hook
Intent: Dusty controller -> useful coding tool.
Audio: "This old Stadia controller was collecting dust..."
Visual: On camera with controller, then cut to screen share.
Edit cue: Cut on "Let me show you."
```

## JSON Contract (Optional)

If a script needs it, mirror the same beats into `storyboard.json`.

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

- The schema/format can evolve; what matters is: beats + timing + intent.
- Keep implementation details (exact props) out of the storyboard unless needed.
- Use explicit seconds in beat headers (Markdown) or `source_start`/`source_end` (JSON). We map these into the edited timeline later.
- If an effect needs occlusion (text behind subject), note it on the beat (e.g. “text behind subject”) and ensure your composition uses an `alpha.webm` URL (VP9 with alpha) in `src/projects/<project-id>/assets.js`.
