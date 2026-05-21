# Flow Storyboard Frames

Use these as the current upload set for Google Flow.

- `1.png` - clean start frame / seed
- `2.png` - Option A, safest first end frame: figure approaches and reaches with a clear gap
- `2A.png` - Option B, more committed: figure crosses in front of the door toward the handle
- `2B.png` - Option C, simpler near-door endpoint
- `2C.png` - Generated hand-on-handle target, rejected because the arm is too stretched
- `3.png` - Actual clean final frame extracted from the accepted 5s Flow clip
- `4.png` - Draft scene 2 end frame: door cracked open with a thin white glow
- `4A.png` - Sequential scene 2 still: tiny door crack
- `4B.png` - Sequential scene 2 still: small door opening
- `4C.png` - Sequential scene 2 still: wider blank-white doorway with restrained glow

Accepted first test:

- Start: `1.png`
- Flow output: `../drafts/flow-stick-figure-walks-to-door-trim-5s-v01.mp4`
- Clean endpoint for next scene: `3.png`

Recommended next test:

- Start: `3.png`
- End: `4.png`
- Action: turn handle, open the door slightly, reveal a bright blank paper portal
- Do not enter the new world yet

Storyboard-only transition stills:

- `3.png -> 4A.png -> 4B.png -> 4C.png`
- These are now the preferred still sequence for the controlled door-opening
  transition if Veo keeps over-dramatizing the door.
- Kling / Seedance via fal can use start/end frame pairs, but the current local
  CLI supports integer durations from 4 to 15 seconds, not sub-second clips.
  Generate a controlled 4s canary and trim/speed-ramp locally if needed.
