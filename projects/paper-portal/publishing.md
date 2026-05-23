# Paper Portal Publishing

## Final Video URL

- `https://storage.aipodcast.ing/cache/11-full-six-worlds-credit-endcard-draft-v06-2-20260522T153134568Z.mp4`

## Published Links

- YouTube: `https://www.youtube.com/watch?v=TAbqNdE-Atg`
- LinkedIn: `https://www.linkedin.com/feed/update/urn:li:ugcPost:7463854813076729856/`
- X: `https://x.com/adithyan_ai/status/2058083718531514502`

## Platform Notes

- YouTube upload used the selected custom thumbnail.
- LinkedIn upload used the native video flow with custom thumbnail upload via `initializeUploadRequest.uploadThumbnail: true`.
- LinkedIn video uploads should pass an explicit media title. For this project, use `I Animated My Paper Sketch with Gemini Omni`.
- LinkedIn media titles are set at post creation time through `content.media.title`; do not rely on remote-download staging filenames such as `source.mp4`.
- Deleted old LinkedIn post manually before retrying with thumbnail. Old post was `urn:li:ugcPost:7463849540974964736`.
- X upload used the native video flow. Current standard X post/media-upload docs expose video upload and media attachment, but not custom organic video thumbnail selection.
- X API response text was truncated after `Continuity Supervisor:...`; use shorter X copy or a follow-up reply for long credits in future posts.

## Current YouTube Packaging Direction

- Title candidate to beat: `I Animated My Paper Sketch with Gemini Omni`
- Thumbnail text direction: `GEMINI OMNI` / `ANIMATING MY PAPER SKETCH`
- Current preferred thumbnail family: simplified neon before/after, paper sketch on the left and animated version on the right.

## LinkedIn Publish Command

```bash
python3 /Users/dobby/.agents/skills-source/owned/social-media-publishing/scripts/linkedin/cli.py --progress plain post-video \
  --text-file /Users/dobby/GitHub/adithyan-ai-videos/tmp/social/paper-portal/linkedin-body.txt \
  --video-url 'https://storage.aipodcast.ing/cache/11-full-six-worlds-credit-endcard-draft-v06-2-20260522T153134568Z.mp4' \
  --thumbnail /Users/dobby/GitHub/adithyan-ai-videos/projects/paper-portal/thumbnails/gemini-omni-simplified-sketch-v02.png \
  --title 'I Animated My Paper Sketch with Gemini Omni'
```

## Draft Description

```text
I drew a tiny stick figure and a door on paper, then used Gemini Omni to turn it into a little animated portal journey.

This is a small experiment in sketch-to-video workflows: paper, pencil, one simple character, and a lot of models helping it travel through different worlds.

Credits, approximately:

Directed by: Adithyan
Director of Photography: Gemini Omni
Production Design: Nano Banana Pro
Music Director: Lyria
Editor: Remotion
Assistant Editor Who Kept Renaming Files: Codex
Continuity Supervisor: GPT-5.5
Special Thanks: four espressos, one ruler, and a very patient paper sketch

Made by Adithyan.

#GeminiOmni #AIVideo #Animation
```
