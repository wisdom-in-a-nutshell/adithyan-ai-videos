## Self-review - Version 1

Prompt used:
- Three high-quality thumbnail background generations anchored on extracted PaperPortal frames: sketch-to-neon, central paper portal, and drawing-came-alive.

Output path:
- Pending generation.

What worked:
- Reference frames show the real desk/paper setup and the strongest neon/storybook worlds.

What feels off:
- Raw video frames are not clicky enough by themselves; they need a composed YouTube packaging treatment.

What should improve next:
- Generate text-free backgrounds first, then add crisp title text deterministically for readability.

## Self-review - Version 2

Prompt used:
- Corrected direction after user clarification: anchor on the opening finished paper sketch/snap frame, not the later end-card paper.

Output path:
- `tmp/imagegen/paper-portal-thumbnail-refs/corrected/opening-sketch-worlds-contact.png`

What worked:
- The corrected reference sheet now clearly contains the real top-down sketch with snap hand, the clean paper sketch, neon arcade world, pixel world, and storybook world.

What feels off:
- The reference sheet is only an input sheet; generated thumbnails must not look like a grid or collage.

What should improve next:
- Generate three text-free thumbnail backgrounds around the opening sketch-to-worlds transformation, then apply crisp YouTube-readable text.

## Self-review - Version 3

Prompt used:
- User rejected deterministic text overlay and asked for model-rendered text directly in the thumbnail.

Output path:
- Pending generation: model-rendered text variants using the corrected opening sketch reference sheet.

What worked:
- The concept should focus on the opening paper sketch, not the final end card.

What feels off:
- Previous deterministic mockups made the paper sketch too small and text felt externally pasted on.

What should improve next:
- Regenerate with text inside the model output, make the paper sketch dominate the frame, and use short thumbnail copy: "OMNI FLASH" plus "MY PAPER SKETCH" or a close variant.

## Self-review - Version 4

Prompt used:
- First Gemini Omni model-text batch: variants 10-13.

Output path:
- `tmp/imagegen/paper-portal-thumbnails/10-gemini-horizontal-clean.png`
- `tmp/imagegen/paper-portal-thumbnails/11-gemini-paper-hero.png`
- `tmp/imagegen/paper-portal-thumbnails/12-gemini-neon-payoff.png`
- `tmp/imagegen/paper-portal-thumbnails/13-gemini-simple-mobile.png`

What worked:
- Text generally rendered with the intended words.
- The before/after concept is coming through.

What feels off:
- Some title text is cropped or too close to the edge.
- In several versions, the AI world and typography overpower the original paper sketch.

What should improve next:
- Iterate with strict safe margins, make the paper sketch larger, simplify the AI world payoff, and reject any output with cropped or misspelled text.

## Self-review - Version 5

Prompt used:
- Native `1536x864`, no post-crop pass. Best user-liked direction is the more energetic neon style.

Output path:
- `projects/paper-portal/thumbnails/gemini-omni-neon-sketch-v01.png`
- `projects/paper-portal/thumbnails/gemini-omni-paper-sketch-v01.png`

What worked:
- Native 16:9 output fixed hidden crop issues.
- The neon style has the right YouTube energy.

What feels off:
- User wants the hand/finger, snap spark, and large portal/door treatment removed.
- The concept should be more minimal: paper sketch on one side, the same sketch animated on the other.

What should improve next:
- Edit from the neon-style candidate into a cleaner before/after thumbnail with no hand, no spark, no large portal arch, and stronger focus on the sketch becoming animated.
