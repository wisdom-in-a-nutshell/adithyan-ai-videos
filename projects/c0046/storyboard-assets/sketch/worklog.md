# C0046 S06 storyboard sketches — worklog

Style canon: `.claude/skills/imagegen/styles/minimal-monochrome-webcomic-agent.md`
Mascot reference: `.claude/skills/imagegen/styles/assets/agent-mascot-reference.png`

Visual family:
- black-and-white only
- hand-drawn webcomic, thin imperfect linework
- xkcd-inspired diagram-comic hybrid
- generous white space
- the digital-agent mascot represents "the model" inside the harness
- text-light: only label what the viewer needs

Panels:
- P2a — empty CODEX HARNESS box (mascot inside) — locked
- P2b — same + Coding Artifacts dropping out the bottom — locked
- P2c — same + Coding Tools row inside box + PROMPT in from top — locked (full coding state)
- P2d — same harness, SWAPPED: Video Tools inside, Video Artifacts out — locked
- P5  — SAM 3.1: ball with detection mask — locked
- P6  — MatAnyone: person silhouette + scissors cutout — locked
- P7  — Remotion + FFmpeg: stacked composited layers — locked

All canonicals live next to this worklog at `sketch/p*.png`.
Versioned drafts live in `sketch/worklog/p*-v*.png`.

## Self-review — P2b v1

Prompt: harness + 3 coding artifacts below the mascot, dashed arrow down

Output: worklog/p2b-harness-coding-artifacts-v1.png

What worked:
- mascot, box, label preserved cleanly
- 3 artifacts read clearly: code file, diff, git branch
- linework matches v1 of empty harness

What feels off:
- artifacts ended up INSIDE the harness box, not below/outside it
- visually OK but story-wise wrong: artifacts are outputs, they should sit OUTSIDE the harness
- arrow from mascot to artifacts is correct direction but contained

Next pass:
- v2: explicitly place artifacts outside and below the box, with the arrow crossing the box's bottom edge
