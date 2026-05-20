# Official Research

## Primary Sources

- Gemini Omni: <https://deepmind.google/models/gemini-omni/>
- Gemini Omni prompt guide:
  <https://deepmind.google/models/gemini-omni/prompt-guide/>
- Gemini Omni Flash model card:
  <https://deepmind.google/models/model-cards/gemini-omni-flash/>
- Google Flow:
  <https://labs.google/fx/tools/flow>
- Flow models and supported features:
  <https://support.google.com/flow/answer/16352836>
- Create videos in Flow:
  <https://support.google.com/flow/answer/16353334>
- Edit videos and build scenes in Flow:
  <https://support.google.com/flow/answer/16935718>
- Flow credits:
  <https://support.google.com/flow/answer/16526234>
- Flow availability:
  <https://support.google.com/flow/answer/16353544>

## What Omni Flash Is

Gemini Omni is Google's multimodal video creation/editing family. Gemini Omni
Flash is the practical model currently exposed through Google products. Google
positions it as a video-first model that can create and edit from text, image,
video, and audio references.

As of 2026-05-20, official access is product-first:

- Gemini app
- Google Flow
- YouTube Shorts

The model card indicates developer/enterprise API rollout is future-facing. Do
not assume a public Gemini API endpoint for Omni Flash is available until this
is re-verified.

## Flow Capability Notes

Google Flow supports multiple video workflows. Relevant Omni Flash notes from
official Flow help:

- Gemini Omni Flash requires Google AI Plus, Pro, or Ultra.
- Text-to-video supports both aspect ratios and 4s, 6s, 8s, and 10s lengths.
- Ingredients/references-to-video supports both aspect ratios and 4s, 6s, 8s,
  and 10s lengths, including advanced character/avatar and audio references.
- Video-to-video editing supports both aspect ratios and up to 10s segments.
- Uploaded video may be up to 60s / 1GB in `.mov`, `.mp4`, `.avi`, or `.wmv`,
  but editing selects up to a 10s segment.
- Some video editing features are restricted by country/region.

## Prompt Guidance From Google

Google recommends describing:

- subject
- action
- environment/location
- lighting
- style
- shot framing and camera motion

For frames-to-video, provide a start frame and optionally an end frame, then
describe the action or transition between them.

For references/ingredients, explicitly describe how each ingredient should be
used. Clean references work better: plain/segmented backgrounds for subject or
product references, no accidental extra subjects in location/style references,
and text prompts that complement rather than contradict the visuals.

## Limitations

The model card calls out recurring weak spots:

- complete consistency through edits
- complex motion
- perfectly accurate text

For production planning, keep segments short, use clean seed frames, keep the
subject simple, and use door/portal transitions as reset points.

## Programmatic Fallback

If a workflow needs API automation before Omni Flash has public API access,
consider Veo through the Gemini API for generation. Treat it as a fallback, not
the same model.

