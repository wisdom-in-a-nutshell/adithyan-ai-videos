# Stadia macOS Controller Demo Storyboard

Audience: Builders, AI developers, curious makers  
Format: On-camera intro + screen share + joystick cut-ins  
Aspect ratio: 16:9  
Duration: 60 seconds  
CTA: Check the repo  
Repo: https://github.com/wisdom-in-a-nutshell/stadia-macos-controller

## S01 | 0:00-0:06 | Hook

- **Intent:** Open with a high-claim promise and immediate novelty.
- **Audio:** "In this video, I'm going to show you how I use my Stadia controller to control Codex, code with it, and even talk to it. And this bridge app itself was 100% written by Codex."
- **Visual:** On-camera shot with controller in hand.
- **Transition:** "Let me show you how" -> hard cut to screen share.

## S02 | 0:06-0:12 | One-Line Setup

- **Intent:** Add personal context and why you built it.
- **Audio:** "This controller was collecting dust. It's been a while since I built something just for fun, so I built this with Codex."
- **Visual:** Screen share (terminal + Ghostty), brief mapping/log flash.
- **Transition:** "I just prompted Codex and shipped it" into live demo actions.

## S03 | 0:12-0:30 | Live Demo Core

- **Intent:** Prove utility with visible, repeatable actions.
- **Audio:** "Watch this. I can split tabs, switch tabs, move across splits, open the model picker, and run my normal terminal flow from the controller."
- **Visual:** Screen share primary, joystick cut-ins exactly on button presses.
- **Visual:** Show 3-4 clean actions that land immediately.
- **Transition:** Short pause after last successful action.

## S04 | 0:30-0:42 | Ergonomic Payoff

- **Intent:** Explain why this matters in deep-work sessions.
- **Audio:** "I wrote it for fun, but after using it for one day, I think I might use this for 70 to 80% of my workflow. It's just ergonomically nicer in deep coding sessions."
- **Visual:** Fast montage: button press -> terminal response -> next press.
- **Transition:** Slow pace before architecture beat.

## S05 | 0:42-0:53 | How It Works (Simple)

- **Intent:** Explain implementation and open-source angle.
- **Audio:** "Super simple flow: controller input goes to a local macOS bridge, it checks the active app profile, and triggers mapped actions. Codex wrote this app, so I'll show you the codebase too."
- **Visual:** Minimal 3-step overlay over screen share.
- **Visual:** `Stadia Controller -> Bridge Service -> Ghostty/Codex Actions`.
- **Transition:** Fade overlay out before close.

## S06 | 0:53-1:00 | Humble Close + CTA

- **Intent:** End with credibility and low-pressure CTA.
- **Audio:** "I'll link the open-source repo. If you want to boot it up, fork it, or use parts of it, check it out."
- **Visual:** Return to on-camera shot, repo URL as lower-third.
- **Transition:** Hold final frame for 0.8s.

## Capture Checklist

- Keep cuts behavior-first (show result right after each button press).
- Avoid too many mappings in one cut; pick the clearest 3-4.
- Keep architecture overlay minimal and readable at a glance.
- Keep tone humble ("early but useful").
