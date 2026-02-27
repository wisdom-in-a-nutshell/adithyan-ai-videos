---
project_id: stadia-macos-controller-demo
status: draft-v1
aspect: 16:9
target_duration_sec: 60
audience: builders, ai-devs, curious makers
format: camera-intro-plus-screen-share
cta: check-repo
repo: https://github.com/wisdom-in-a-nutshell/stadia-macos-controller
---

# Stadia macOS Controller Demo Storyboard

## S01 | 0.00-6.00 | Hook
Intent: Open with a concrete transformation (dusty gamepad -> useful coding controller).
Audio: "This old Stadia controller was collecting dust, so I turned it into a Codex controller."
Visual: On-camera shot with the Stadia controller in hand.
Edit cue: Hard cut to screen share on "Codex controller".

## S02 | 6.00-12.00 | One-Line Setup
Intent: Explain what you built without overexplaining.
Audio: "I built a small macOS bridge that maps button presses to actions in my coding workflow."
Visual: Screen share (terminal + Ghostty). Brief flash of mappings config or logs.
Edit cue: "Let me show you" line into live demo.

## S03 | 12.00-30.00 | Live Demo Core
Intent: Prove utility with visible, repeatable actions.
Audio: "I can open the model picker, switch tabs, move across splits, and stay in flow."
Visual: Screen share is primary. Quick joystick camera cut-ins exactly when buttons are pressed.
Visual: Show 3-4 clean actions that land immediately (tab, split, model picker, confirm action).
Edit cue: Pause after final successful action.

## S04 | 30.00-42.00 | Ergonomic Payoff
Intent: Explain why this matters in real deep-work sessions.
Audio: "In deep coding sessions, this is just more ergonomic than constant keyboard context switching."
Visual: Fast rhythm montage: button press -> terminal response -> next press.
Edit cue: Slow down pacing before architecture beat.

## S05 | 42.00-53.00 | How It Works (Simple)
Intent: Keep architecture legible in one pass.
Audio: "Controller input goes to a local macOS bridge, it resolves the active app profile, then triggers mapped actions."
Visual: Minimal 3-step overlay over screen share:
Visual: 1) Stadia Controller -> 2) Bridge Service -> 3) Ghostty/Codex Actions.
Edit cue: Overlay fades out before close.

## S06 | 53.00-60.00 | Humble Close + CTA
Intent: End with credibility and a low-pressure call to action.
Audio: "Still early, but already useful. If you want to try or fork it, check the repo."
Visual: Return to on-camera shot, repo URL as lower-third.
Edit cue: Hold final frame for 0.8s.

## Capture Checklist
- Keep cuts behavior-first (show result right after each button press).
- Avoid too many mappings in one cut; pick the clearest 3-4.
- Keep architecture overlay minimal and readable at a glance.
- Keep tone humble: "early but useful".
