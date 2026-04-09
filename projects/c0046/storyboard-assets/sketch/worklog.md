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
- P2b (storyboard) — coding artifacts only, keeps as design ref but not used in video
- P2b (in video) — `p2b-harness-tools-prompt.png` — mascot + tools row + PROMPT arrow, no artifacts. Bridges P2a → P2c
- P2c — same + Coding Tools / Coding Artifacts labels (full coding state) — locked
- P2d — same harness, SWAPPED: Video Tools inside, Video Artifacts out — locked
- P5  — SAM 3.1: ball with detection mask — locked
- P6  — MatAnyone: person silhouette + scissors cutout — locked
- P7  — Remotion + FFmpeg: stacked composited layers — locked
- P8  — TRANSCRIPTION: mic + sound waves + speech bubble — locked (4th tool in stack)
- P9  — TERMINAL: hand-drawn cmd window with `> codex, track the ball.` — locked (PROMPTING beat)

All canonicals live next to this worklog at `sketch/p*.png`.
Cropped versions used in the video at `sketch/cropped/p*.png` and copied
into `public/imports/c0046/sketch/p*.png`.
Versioned drafts live in `sketch/worklog/p*-v*.png`.

## In-video timing (word-locked, see TIMING in src/projects/c0046/assets.js)

S06 — How it works (harness explainer):
- 89.84s  (s06BridgeStart)        — "BOOTING CODEX" pill bridge (no sketch)
- 111.44s (s06HarnessEmptyStart)  — P2a empty harness reveal ("it's a harness")
- 121.32s (s06HarnessToolsStart)  — P2b tools+prompt added ("tools that are available")
- 133.60s (s06HarnessCodingStart) — P2c full coding state ("coding tools")
- 137.04s (s06HarnessVideoStart)  — P2d swap to video tools ("swap")
  → HOW IT WORKS pill is ONE long sequence here (no fading between sub-beats)

S07 — The stack (4 tool reveals):
- 150.08s (s07SamStart)           — P5 SAM 3.1 ("SAM")
- 164.24s (s07MatAnyoneStart)     — P6 MatAnyone ("math anyone")
- 178.00s (s07RemotionStart)      — P7 Remotion + FFmpeg ("FFM")
- 183.52s (s07TranscribeStart)    — P8 Transcription ("also transcribe")
- 192.32s (s07End / s08RealtimeStart)
  → THE STACK pill is ONE long sequence here

S08 — Workflow reality (pills + callouts only, plus terminal sketch):
- 192.32s (s08RealtimeStart)      — NOT REAL-TIME pill
- 208.08s (s08RecordingStart)     — RECORDING pill
- 220.48s (s08PromptingStart)     — PROMPTING pill + P9 Terminal sketch
- 229.44s (s08IteratingStart)     — ITERATING pill

S09 — Close (pills + callouts):
- 247.68s (s09ExperimentsStart)   — EXPERIMENTS pill
- 264.24s (s09OutroStart)         — "100% EDITED BY CODEX" pill + "Hope this was useful." callout

White backdrop + Adi matte run continuously from explainStart (89.84s)
through the end of the video.

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
