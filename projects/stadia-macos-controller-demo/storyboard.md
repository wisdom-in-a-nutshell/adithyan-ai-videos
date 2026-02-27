# Stadia macOS Controller Demo Storyboard

Audience: Builders, AI developers, curious makers  
Format: On-camera intro + screen share + joystick cut-ins  
Aspect ratio: 16:9  
Duration: 60 seconds  
CTA: Check the repo  
Repo: https://github.com/wisdom-in-a-nutshell/stadia-macos-controller

## S01 | 0:00-0:06 | Hook

- **Intent:** Open with a high-claim promise and immediate novelty.
- **Audio:** "In this video, I'll show you how I use a Stadia controller to control Codex, code with it, and even talk to it. Codex wrote this app."
- **Visual:** On-camera shot with controller in hand.
- **Transition:** "Let me show you how" -> hard cut to screen share.

## S02 | 0:06-0:12 | One-Line Setup

- **Intent:** Add personal context and why you built it.
- **Audio:** "Quick context: Google discontinued Stadia, so this controller was collecting dust. I wanted to build something fun, so I prompted Codex back and forth for a few hours."
- **Visual:** Screen share (terminal + Ghostty), brief mapping/log flash.
- **Transition:** "I just prompted Codex and shipped it" into live demo actions.

## S03 | 0:12-0:30 | Live Demo Core

- **Intent:** Prove utility with visible, repeatable actions.
- **Audio:** "Let me show you a quick demo. I split tabs, switch tabs, move across splits, open model picker, and keep my terminal flow from the controller."
- **Visual:** Screen share primary, joystick cut-ins exactly on button presses.
- **Visual:** Show 3-4 clean actions that land immediately.
- **Transition:** Short pause after last successful action.

## S04 | 0:30-0:42 | Ergonomic Payoff

- **Intent:** Explain why this matters in deep-work sessions.
- **Audio:** "To my surprise, it actually worked, and it's more useful than I expected. After one day, I think this could replace 70 to 80% of repeated workflow patterns."
- **Visual:** Fast montage: button press -> terminal response -> next press.
- **Transition:** Slow pace before architecture beat.

## S05 | 0:42-0:53 | How It Works (Simple)

- **Intent:** Explain implementation and open-source angle.
- **Audio:** "Flow is simple: controller input goes to a local macOS bridge, it checks the active app profile, then triggers mapped actions. I'll show the code so you can fork and run it."
- **Visual:** Minimal 3-step overlay over screen share.
- **Visual:** `Stadia Controller -> Bridge Service -> Ghostty/Codex Actions`.
- **Transition:** Fade overlay out before close.

## S06 | 0:53-1:00 | Humble Close + CTA

- **Intent:** End with credibility and low-pressure CTA.
- **Audio:** "Repo is open source. If you want to try it, fork it, or reuse parts of it, check it out."
- **Visual:** Return to on-camera shot, repo URL as lower-third.
- **Transition:** Hold final frame for 0.8s.

## Capture Checklist

- Keep cuts behavior-first (show result right after each button press).
- Avoid too many mappings in one cut; pick the clearest 3-4.
- Keep architecture overlay minimal and readable at a glance.
- Keep tone humble ("early but useful").
