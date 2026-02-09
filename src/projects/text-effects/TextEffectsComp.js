import React from 'react';
import {Sequence, Video, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {HeroStamp} from '../../components/HeroStamp.js';
import transcriptWords from './transcript_words.json';
import {
  TEXT_EFFECTS_ALPHA_URL,
  TEXT_EFFECTS_CODEX_LOGO_URL,
  TEXT_EFFECTS_HERO_STAMP_TIMING,
  TEXT_EFFECTS_LET_ME_SHOW_YOU_HOW_END_SECONDS,
  TEXT_EFFECTS_LET_ME_SHOW_YOU_HOW_START_SECONDS,
  TEXT_EFFECTS_SETUP_CODING_ARTIFACTS_SECONDS,
  TEXT_EFFECTS_SETUP_CODING_TOOLS_SECONDS,
  TEXT_EFFECTS_SETUP_CODEX_MENTION_SECONDS,
  TEXT_EFFECTS_SETUP_DIGITAL_ARTIFACTS_SECONDS,
  TEXT_EFFECTS_SETUP_TOOLS_SECONDS,
  TEXT_EFFECTS_SETUP_VIDEO_ARTIFACTS_SECONDS,
  TEXT_EFFECTS_SETUP_VIDEO_TOOLS_SECONDS,
  TEXT_EFFECTS_SETUP_END_SECONDS,
  TEXT_EFFECTS_SETUP_CODEX_END_SECONDS,
  TEXT_EFFECTS_SETUP_CODEX_START_SECONDS,
  TEXT_EFFECTS_SETUP_START_SECONDS,
  TEXT_EFFECTS_THREE_TOOLS_END_SECONDS,
  TEXT_EFFECTS_THREE_TOOLS_START_SECONDS,
  TEXT_EFFECTS_THREE_TOOLS_MATANYONE_SECONDS,
  TEXT_EFFECTS_THREE_TOOLS_REMOTION_SECONDS,
  TEXT_EFFECTS_THREE_TOOLS_SAM3_SECONDS,
  TEXT_EFFECTS_THREE_TOOLS_SPECIFICALLY_SECONDS,
  TEXT_EFFECTS_TOOL1_SAM3_START_SECONDS,
  TEXT_EFFECTS_TOOL1_SAM3_END_SECONDS,
  TEXT_EFFECTS_SAM3_MASK_SHOW_SECONDS,
  TEXT_EFFECTS_SAM3_STATIC_MASK_URL,
  TEXT_EFFECTS_TOOL2_GREEN_END_SECONDS,
  TEXT_EFFECTS_TOOL2_GREEN_START_SECONDS,
  TEXT_EFFECTS_TOOL2_END_SECONDS,
  TEXT_EFFECTS_TOOL2_START_SECONDS,
  TEXT_EFFECTS_TOOL3_BLUR_BG_END_SECONDS,
  TEXT_EFFECTS_TOOL3_BLUR_BG_PX,
  TEXT_EFFECTS_TOOL3_BLUR_BG_START_SECONDS,
  TEXT_EFFECTS_TOOL3_REMOTION_END_SECONDS,
  TEXT_EFFECTS_TOOL3_REMOTION_START_SECONDS,
  TEXT_EFFECTS_TOOL3_TEXT_BEHIND_END_SECONDS,
  TEXT_EFFECTS_TOOL3_TEXT_BEHIND_START_SECONDS,
  TEXT_EFFECTS_TOOL3_TEXT_FANCY_END_SECONDS,
  TEXT_EFFECTS_TOOL3_TEXT_FANCY_START_SECONDS,
  TEXT_EFFECTS_TOOL3_TEXT_FRONT_END_SECONDS,
  TEXT_EFFECTS_TOOL3_TEXT_FRONT_START_SECONDS,
  TEXT_EFFECTS_RECAP_END_SECONDS,
  TEXT_EFFECTS_RECAP_MATANYONE_SECONDS,
  TEXT_EFFECTS_RECAP_REMOTION_SECONDS,
  TEXT_EFFECTS_RECAP_SAM3_SECONDS,
  TEXT_EFFECTS_RECAP_START_SECONDS,
  TEXT_EFFECTS_LINKS_END_SECONDS,
  TEXT_EFFECTS_LINKS_START_SECONDS,
  TEXT_EFFECTS_VIDEO_URL,
} from './assets.js';
import {SKETCH_FONT_FAMILY} from '../../styles/sketch.js';
import {
  CodexCallout,
  DisclaimerOverlay,
  LabelOverlay,
  StatusLeftOverlay,
} from '../../overlay_kit/overlays.js';
import {CodexToolsArtifactsOverlay} from './CodexToolsArtifactsOverlay.js';
import {ThreeToolsOverlay} from './ThreeToolsOverlay.js';
import {GreenScreenOverlay} from './GreenScreenOverlay.js';
import {BackgroundBlurOverlay} from './BackgroundBlurOverlay.js';
import {Sam3StaticMaskOverlay} from './Sam3StaticMaskOverlay.js';
import {LayersLegendOverlay} from './LayersLegendOverlay.js';
import {TextPlacementDemoOverlay} from './TextPlacementDemoOverlay.js';
import {RecapOverlay} from './RecapOverlay.js';
import {DescriptionLinksOverlay} from './DescriptionLinksOverlay.js';
import {TEXT_EFFECTS_UI_SCALE} from './ui.js';

const resolveAssetSrc = (src, assetMap) => {
  if (!src || typeof src !== 'string') {
    return src;
  }
  // `studio:cached` and `render -- --cached` inject an `assetMap` prop that rewrites
  // remote URLs to `--public-dir` files (e.g. "https://.../video.mp4" -> "/<hash>.mp4").
  if (assetMap && typeof assetMap === 'object') {
    const mapped = assetMap[src];
    if (typeof mapped === 'string' && mapped.length > 0) {
      return mapped;
    }
  }
  return src;
};

// Project-specific composition wrapper for `text-effects`.
// Keep the cut short while iterating; extend later when we implement storyboard-driven beats.
export const TextEffectsComp = (props) => {
  const assetMap = props?.assetMap ?? null;
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / Math.max(1, fps);
  const holdUntilSeconds = TEXT_EFFECTS_LET_ME_SHOW_YOU_HOW_END_SECONDS;
  const letMeShowYouStartSeconds = TEXT_EFFECTS_LET_ME_SHOW_YOU_HOW_START_SECONDS;
  const heroFadeOutSeconds = 0.6;
  const holdFrames = Math.min(
    durationInFrames,
    Math.max(1, Math.ceil((holdUntilSeconds + heroFadeOutSeconds) * fps))
  );

  // Subtle camera punch-in during the pause after "... edited by codex",
  // then ease back out right as "let me show you how" starts.
  const codexEndSeconds = TEXT_EFFECTS_HERO_STAMP_TIMING.codexEnd;

  const cameraScale = (() => {
    if (!Number.isFinite(codexEndSeconds) || !Number.isFinite(letMeShowYouStartSeconds)) {
      return 1;
    }

    const punchInStart = Math.max(0, codexEndSeconds + 0.06);
    const punchInEnd = punchInStart + 0.22;
    const punchOutStart = Math.max(punchInEnd + 0.12, letMeShowYouStartSeconds - 0.06);
    const punchOutEnd = punchOutStart + 0.2;

    return interpolate(
      t,
      [punchInStart, punchInEnd, punchOutStart, punchOutEnd],
      [1, 1.08, 1.08, 1],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
    );
  })();

  const cameraTranslate = (() => {
    if (!Number.isFinite(codexEndSeconds) || !Number.isFinite(letMeShowYouStartSeconds)) {
      return {x: 0, y: 0};
    }

    const punchInStart = Math.max(0, codexEndSeconds + 0.06);
    const punchInEnd = punchInStart + 0.22;
    const punchOutStart = Math.max(punchInEnd + 0.12, letMeShowYouStartSeconds - 0.06);
    const punchOutEnd = punchOutStart + 0.2;

    // Nudge up/left during the punch so it feels like it "locks" on the face.
    const x = interpolate(t, [punchInStart, punchInEnd, punchOutStart, punchOutEnd], [0, -14, -14, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const y = interpolate(t, [punchInStart, punchInEnd, punchOutStart, punchOutEnd], [0, -10, -10, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return {x, y};
  })();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        fontFamily: SKETCH_FONT_FAMILY,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate3d(${Math.round(cameraTranslate.x)}px, ${Math.round(
            cameraTranslate.y
          )}px, 0) scale(${cameraScale})`,
          transformOrigin: '50% 50%',
        }}
      >
	        <Sequence name="[S01+] Background" from={0} durationInFrames={durationInFrames}>
	          <Video
	            src={resolveAssetSrc(TEXT_EFFECTS_VIDEO_URL, assetMap)}
	            style={{
	              position: 'absolute',
	              inset: 0,
	              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
        </Sequence>

        {(() => {
          const from = Math.max(0, Math.floor(TEXT_EFFECTS_TOOL3_BLUR_BG_START_SECONDS * fps));
          const dur = Math.max(
            1,
            Math.min(
              durationInFrames - from,
              Math.ceil((TEXT_EFFECTS_TOOL3_BLUR_BG_END_SECONDS - TEXT_EFFECTS_TOOL3_BLUR_BG_START_SECONDS) * fps)
            )
          );

          return (
	            <Sequence name="[S07] Background Blur" from={from} durationInFrames={dur}>
	              <BackgroundBlurOverlay
	                src={resolveAssetSrc(TEXT_EFFECTS_VIDEO_URL, assetMap)}
	                startFromFrame={from}
	                durationInFrames={dur}
	                blurPx={TEXT_EFFECTS_TOOL3_BLUR_BG_PX}
	              />
	            </Sequence>
          );
        })()}

		        <Sequence name="[S01] HeroStamp (Behind)" from={0} durationInFrames={holdFrames}>
		          <HeroStamp
		            layer="behind"
		            accentColor="rgb(232, 213, 186)"
		            transcriptWords={transcriptWords}
		            timing={TEXT_EFFECTS_HERO_STAMP_TIMING}
		            holdUntilSeconds={holdUntilSeconds}
		            fadeOutSeconds={heroFadeOutSeconds}
		            percentSweep
		            percentSweepDurationSeconds={0.6}
		          />
		        </Sequence>

        {(() => {
          const from = Math.max(0, Math.floor(TEXT_EFFECTS_TOOL2_START_SECONDS * fps));
          const dur = Math.max(
            1,
            Math.min(
              durationInFrames - from,
              Math.ceil((TEXT_EFFECTS_TOOL2_END_SECONDS - TEXT_EFFECTS_TOOL2_START_SECONDS) * fps)
            )
          );

          // MatAnyone (scene 6): show a "green screen preview" by replacing the background with solid green.
          // Timing is hardcoded for this recording (transcript is stable).
          const greenStartSeconds = TEXT_EFFECTS_TOOL2_GREEN_START_SECONDS;
          const greenEndSeconds = TEXT_EFFECTS_TOOL2_GREEN_END_SECONDS;

          return (
            <Sequence name="[T2] Green Screen Preview" from={from} durationInFrames={dur}>
              <GreenScreenOverlay
                startSeconds={greenStartSeconds}
                endSeconds={greenEndSeconds}
                frameOffset={from}
              />
            </Sequence>
          );
        })()}

        {(() => {
          // After the green screen preview ends, outline the foreground matte to explain "two layers".
          const startSeconds = TEXT_EFFECTS_TOOL2_GREEN_END_SECONDS;
          const endSeconds = TEXT_EFFECTS_TOOL3_BLUR_BG_START_SECONDS;
          const from = Math.max(0, Math.floor(startSeconds * fps));
          const dur = Math.max(
            1,
            Math.min(durationInFrames - from, Math.ceil((endSeconds - startSeconds) * fps))
          );

          const outlineColor = 'rgba(34, 197, 94, 0.95)'; // green-500
          const px = 2;
          const outlineFilter = [
            `drop-shadow(${px}px 0 0 ${outlineColor})`,
            `drop-shadow(-${px}px 0 0 ${outlineColor})`,
            `drop-shadow(0 ${px}px 0 ${outlineColor})`,
            `drop-shadow(0 -${px}px 0 ${outlineColor})`,
            `drop-shadow(0 0 6px rgba(34, 197, 94, 0.55))`,
          ].join(' ');

          return (
	            <Sequence name="[T2] Matte Outline (Between Layers)" from={from} durationInFrames={dur}>
	              <Video
	                src={resolveAssetSrc(TEXT_EFFECTS_ALPHA_URL, assetMap)}
	                muted
	                style={{
	                  position: 'absolute',
	                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: outlineFilter,
                }}
              />
            </Sequence>
          );
        })()}

        {(() => {
          const startSeconds = TEXT_EFFECTS_TOOL2_GREEN_END_SECONDS;
          const endSeconds = TEXT_EFFECTS_TOOL3_BLUR_BG_START_SECONDS;
          const from = Math.max(0, Math.floor(startSeconds * fps));
          const dur = Math.max(
            1,
            Math.min(durationInFrames - from, Math.ceil((endSeconds - startSeconds) * fps))
          );

          const borderColor = 'rgba(59, 130, 246, 0.92)'; // blue-500
          return (
            <Sequence name="[T2] Background Border (Layer 2)" from={from} durationInFrames={dur}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  boxShadow: `inset 0 0 0 4px ${borderColor}, inset 0 0 0 10px rgba(59, 130, 246, 0.2)`,
                  zIndex: 8,
                  pointerEvents: 'none',
                }}
              />
            </Sequence>
          );
        })()}

        {(() => {
          const startSeconds = TEXT_EFFECTS_TOOL2_GREEN_END_SECONDS;
          const endSeconds = TEXT_EFFECTS_TOOL3_BLUR_BG_START_SECONDS;
          const from = Math.max(0, Math.floor(startSeconds * fps));
          const dur = Math.max(
            1,
            Math.min(durationInFrames - from, Math.ceil((endSeconds - startSeconds) * fps))
          );
          return (
            <Sequence name="[T2-7] Layers Legend" from={from} durationInFrames={dur}>
              <LayersLegendOverlay
                durationInFrames={dur}
                scale={TEXT_EFFECTS_UI_SCALE}
                // Keep it solid until we hit "blur the background".
                fadeOutSeconds={0}
              />
            </Sequence>
          );
        })()}

        {(() => {
          const from = Math.max(0, Math.floor(TEXT_EFFECTS_TOOL3_TEXT_BEHIND_START_SECONDS * fps));
          const dur = Math.max(
            1,
            Math.min(
              durationInFrames - from,
              Math.ceil((TEXT_EFFECTS_TOOL3_TEXT_BEHIND_END_SECONDS - TEXT_EFFECTS_TOOL3_TEXT_BEHIND_START_SECONDS) * fps)
            )
          );
          return (
            <Sequence name="[S07] Text Behind Demo" from={from} durationInFrames={dur}>
              <TextPlacementDemoOverlay durationInFrames={dur} scale={1} variant="behind" />
            </Sequence>
          );
        })()}

        {(() => {
          const from = Math.max(0, Math.floor(TEXT_EFFECTS_TOOL3_TEXT_FANCY_START_SECONDS * fps));
          const dur = Math.max(
            1,
            Math.min(
              durationInFrames - from,
              Math.ceil((TEXT_EFFECTS_TOOL3_TEXT_FANCY_END_SECONDS - TEXT_EFFECTS_TOOL3_TEXT_FANCY_START_SECONDS) * fps)
            )
          );
          return (
            <Sequence name="[S07] Fancy Behind Demo" from={from} durationInFrames={dur}>
              <TextPlacementDemoOverlay durationInFrames={dur} scale={1} variant="fancy" />
            </Sequence>
          );
        })()}

	        <Sequence name="[S01+] Foreground Alpha" from={0} durationInFrames={durationInFrames}>
	          <Video
	            src={resolveAssetSrc(TEXT_EFFECTS_ALPHA_URL, assetMap)}
	            muted
	            style={{
	              position: 'absolute',
	              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 50,
            }}
          />
        </Sequence>

        {(() => {
          const from = Math.max(0, Math.floor(TEXT_EFFECTS_TOOL3_TEXT_FRONT_START_SECONDS * fps));
          const dur = Math.max(
            1,
            Math.min(
              durationInFrames - from,
              Math.ceil((TEXT_EFFECTS_TOOL3_TEXT_FRONT_END_SECONDS - TEXT_EFFECTS_TOOL3_TEXT_FRONT_START_SECONDS) * fps)
            )
          );
          return (
            <Sequence name="[S07] Text Front Demo" from={from} durationInFrames={dur}>
              <TextPlacementDemoOverlay durationInFrames={dur} scale={1} variant="front" />
            </Sequence>
          );
        })()}

        {(() => {
          const from = Math.max(0, Math.floor(TEXT_EFFECTS_SETUP_START_SECONDS * fps));
          const dur = Math.max(
            1,
            Math.min(
              durationInFrames - from,
              Math.ceil((TEXT_EFFECTS_SETUP_END_SECONDS - TEXT_EFFECTS_SETUP_START_SECONDS) * fps)
            )
          );

	          // We fade out the "CODEX" callout (and tool stack) when we reach the "blur the background" demo.
	          const blurFrom = Math.max(0, Math.floor(TEXT_EFFECTS_TOOL3_BLUR_BG_START_SECONDS * fps));

	          const codexSeconds = TEXT_EFFECTS_SETUP_CODEX_MENTION_SECONDS;
	          const codexFrom = Math.max(0, Math.floor(codexSeconds * fps));
	          // Keep the Codex pill on-screen from first mention until we hit the blur demo.
	          const codexDur = Math.max(1, Math.min(durationInFrames - codexFrom, blurFrom - codexFrom));

	          return (
	            <>
	              <Sequence name="[S02] Setup: RAW RECORDING (Front)" from={from} durationInFrames={dur}>
	                <LabelOverlay text="RAW RECORDING" durationInFrames={dur} scale={TEXT_EFFECTS_UI_SCALE} />
	              </Sequence>

	              <Sequence name="[S02] Setup: CODEX (Front)" from={codexFrom} durationInFrames={codexDur}>
	                <CodexCallout
	                  text="CODEX"
	                  logo={TEXT_EFFECTS_CODEX_LOGO_URL}
	                  durationInFrames={codexDur}
	                  scale={TEXT_EFFECTS_UI_SCALE}
	                />
	              </Sequence>

	              <Sequence name="[S02] Setup: Disclaimer (Front)" from={from} durationInFrames={dur}>
	                <DisclaimerOverlay
	                  text="Everything on-screen, including motion overlays, is rendered by Codex"
	                  durationInFrames={dur}
	                  scale={TEXT_EFFECTS_UI_SCALE}
	                />
	              </Sequence>
	            </>
	          );
	        })()}

        {(() => {
        const from = Math.max(0, Math.floor(TEXT_EFFECTS_SETUP_CODEX_START_SECONDS * fps));
        // We'll override this with tool-specific verbs later, so keep it only until tool-1 starts.
        const tool1From = Math.max(0, Math.floor(TEXT_EFFECTS_TOOL1_SAM3_START_SECONDS * fps));
        const tool2From = Math.max(0, Math.floor(TEXT_EFFECTS_TOOL2_START_SECONDS * fps));
        const tool3From = Math.max(0, Math.floor(TEXT_EFFECTS_TOOL3_REMOTION_START_SECONDS * fps));
        const blurFrom = Math.max(0, Math.floor(TEXT_EFFECTS_TOOL3_BLUR_BG_START_SECONDS * fps));
        const dur = Math.max(1, durationInFrames - from);
        const animDur = Math.max(1, Math.min(dur, tool1From - from));
        const segDur = Math.max(1, Math.min(durationInFrames - tool1From, tool2From - tool1From));
        const mattDur = Math.max(1, Math.min(durationInFrames - tool2From, tool3From - tool2From));
        const compDur = Math.max(1, Math.min(durationInFrames - tool3From, blurFrom - tool3From));

        return (
          <>
            <Sequence name="[S03] Setup: ANIMATING (Front)" from={from} durationInFrames={animDur}>
              <StatusLeftOverlay text="ANIMATING" durationInFrames={animDur} scale={TEXT_EFFECTS_UI_SCALE} />
            </Sequence>

            <Sequence
              name="[S05] Status: SEGMENTING PERSON"
              from={tool1From}
              durationInFrames={segDur}
            >
              <StatusLeftOverlay
                text="SEGMENTING PERSON"
                durationInFrames={segDur}
                scale={TEXT_EFFECTS_UI_SCALE}
              />
            </Sequence>

            <Sequence
              name="[S06] Status: MATTING"
              from={tool2From}
              durationInFrames={mattDur}
            >
              <StatusLeftOverlay text="MATTING" durationInFrames={mattDur} scale={TEXT_EFFECTS_UI_SCALE} />
            </Sequence>

            <Sequence
              name="[S07] Status: COMPOSING"
              from={tool3From}
              durationInFrames={compDur}
            >
              <StatusLeftOverlay text="COMPOSING" durationInFrames={compDur} scale={TEXT_EFFECTS_UI_SCALE} />
            </Sequence>

            <Sequence
              name="[S03A] Setup: Tools -> Digital Artifacts"
              from={Math.max(0, Math.floor(TEXT_EFFECTS_SETUP_TOOLS_SECONDS * fps))}
              durationInFrames={Math.max(
                1,
                Math.ceil((TEXT_EFFECTS_SETUP_CODING_TOOLS_SECONDS - TEXT_EFFECTS_SETUP_TOOLS_SECONDS) * fps)
              )}
            >
              <CodexToolsArtifactsOverlay
                durationInFrames={dur}
                startSeconds={TEXT_EFFECTS_SETUP_TOOLS_SECONDS}
                toolsSeconds={TEXT_EFFECTS_SETUP_TOOLS_SECONDS}
                artifactsSeconds={TEXT_EFFECTS_SETUP_DIGITAL_ARTIFACTS_SECONDS}
                toolsText="Tools"
                artifactsText="Digital artifacts"
                toolsEmoji="🛠"
                artifactsEmoji="🗂️"
                frameOffset={Math.max(0, Math.floor(TEXT_EFFECTS_SETUP_TOOLS_SECONDS * fps))}
                scale={TEXT_EFFECTS_UI_SCALE}
                // Align to the bottom of the CODEX pill (CodexCallout: top 88, height 44).
                // NOTE: The overlay is scaled via CSS transform, so `baseTop/baseLeft` must be in
                // final (scaled) pixel space to avoid overlapping the CODEX pill.
                baseLeft={32 * TEXT_EFFECTS_UI_SCALE}
                baseTop={132 * TEXT_EFFECTS_UI_SCALE}
              />
            </Sequence>

            <Sequence
              name="[S03B] Setup: Coding Tools -> Coding Artifacts"
              from={Math.max(0, Math.floor(TEXT_EFFECTS_SETUP_CODING_TOOLS_SECONDS * fps))}
              durationInFrames={Math.max(
                1,
                Math.ceil((TEXT_EFFECTS_SETUP_VIDEO_TOOLS_SECONDS - TEXT_EFFECTS_SETUP_CODING_TOOLS_SECONDS) * fps)
              )}
            >
              <CodexToolsArtifactsOverlay
                durationInFrames={dur}
                startSeconds={TEXT_EFFECTS_SETUP_CODING_TOOLS_SECONDS}
                toolsSeconds={TEXT_EFFECTS_SETUP_CODING_TOOLS_SECONDS}
                artifactsSeconds={TEXT_EFFECTS_SETUP_CODING_ARTIFACTS_SECONDS}
                toolsText="Coding tools"
                artifactsText="Coding artifacts"
                toolsEmoji="🛠"
                artifactsEmoji="💾"
                frameOffset={Math.max(0, Math.floor(TEXT_EFFECTS_SETUP_CODING_TOOLS_SECONDS * fps))}
                scale={TEXT_EFFECTS_UI_SCALE}
                baseLeft={32 * TEXT_EFFECTS_UI_SCALE}
                baseTop={132 * TEXT_EFFECTS_UI_SCALE}
              />
            </Sequence>

	            <Sequence
	              name="[S03C] Setup: Video Tools -> Video Artifacts"
	              from={Math.max(0, Math.floor(TEXT_EFFECTS_SETUP_VIDEO_TOOLS_SECONDS * fps))}
	              durationInFrames={Math.max(
	                1,
	                blurFrom - Math.max(0, Math.floor(TEXT_EFFECTS_SETUP_VIDEO_TOOLS_SECONDS * fps))
	              )}
	            >
	              <CodexToolsArtifactsOverlay
	                durationInFrames={Math.max(
	                  1,
	                  blurFrom - Math.max(0, Math.floor(TEXT_EFFECTS_SETUP_VIDEO_TOOLS_SECONDS * fps))
	                )}
	                startSeconds={TEXT_EFFECTS_SETUP_VIDEO_TOOLS_SECONDS}
	                toolsSeconds={TEXT_EFFECTS_SETUP_VIDEO_TOOLS_SECONDS}
	                artifactsSeconds={TEXT_EFFECTS_SETUP_VIDEO_ARTIFACTS_SECONDS}
	                artifactsHideSeconds={TEXT_EFFECTS_THREE_TOOLS_SAM3_SECONDS}
	                toolsText="Video tools"
	                artifactsText="Video artifacts"
	                toolsEmoji="🛠"
	                artifactsEmoji="🎞️"
	                frameOffset={Math.max(0, Math.floor(TEXT_EFFECTS_SETUP_VIDEO_TOOLS_SECONDS * fps))}
	                scale={TEXT_EFFECTS_UI_SCALE}
	                baseLeft={32 * TEXT_EFFECTS_UI_SCALE}
	                baseTop={132 * TEXT_EFFECTS_UI_SCALE}
	              />
	            </Sequence>

	            <Sequence
	              name="[S04] Three Tools: SAM3 -> MatAnyone -> Remotion"
	              from={Math.max(0, Math.floor(TEXT_EFFECTS_THREE_TOOLS_START_SECONDS * fps))}
	              durationInFrames={Math.max(
	                1,
	                Math.ceil((TEXT_EFFECTS_THREE_TOOLS_END_SECONDS - TEXT_EFFECTS_THREE_TOOLS_START_SECONDS) * fps)
	              )}
	            >
	              <ThreeToolsOverlay
	                startSeconds={TEXT_EFFECTS_THREE_TOOLS_SPECIFICALLY_SECONDS}
	                frameOffset={Math.max(0, Math.floor(TEXT_EFFECTS_THREE_TOOLS_START_SECONDS * fps))}
	                scale={TEXT_EFFECTS_UI_SCALE}
	                baseLeft={32 * TEXT_EFFECTS_UI_SCALE}
	                baseTop={132 * TEXT_EFFECTS_UI_SCALE}
	                anchor="tools"
	                items={[
	                  {label: 'SAM3', startSeconds: TEXT_EFFECTS_THREE_TOOLS_SAM3_SECONDS},
	                  {label: 'MatAnyone', startSeconds: TEXT_EFFECTS_THREE_TOOLS_MATANYONE_SECONDS},
	                  {label: 'Remotion', startSeconds: TEXT_EFFECTS_THREE_TOOLS_REMOTION_SECONDS},
	                ]}
	              />
	            </Sequence>

            <Sequence
              name="[S05-07] Tool Stack: 1 SAM3, 2 MatAnyone, 3 Remotion"
              from={tool1From}
              durationInFrames={Math.max(1, blurFrom - tool1From)}
            >
              <ThreeToolsOverlay
                startSeconds={TEXT_EFFECTS_TOOL1_SAM3_START_SECONDS}
                frameOffset={tool1From}
                durationInFrames={Math.max(1, blurFrom - tool1From)}
                scale={TEXT_EFFECTS_UI_SCALE}
                baseLeft={32 * TEXT_EFFECTS_UI_SCALE}
                baseTop={132 * TEXT_EFFECTS_UI_SCALE}
                anchor="tools"
                items={[
                  {label: 'SAM3', startSeconds: TEXT_EFFECTS_TOOL1_SAM3_START_SECONDS},
                  {label: 'MatAnyone', startSeconds: TEXT_EFFECTS_TOOL2_START_SECONDS},
                  {label: 'Remotion', startSeconds: TEXT_EFFECTS_TOOL3_REMOTION_START_SECONDS},
                ]}
              />
            </Sequence>

            <Sequence
              name="[S05] SAM3: Static Mask (Full Screen)"
              from={Math.max(0, Math.floor(TEXT_EFFECTS_SAM3_MASK_SHOW_SECONDS * fps))}
              durationInFrames={Math.max(
                1,
                Math.ceil((TEXT_EFFECTS_TOOL1_SAM3_END_SECONDS - TEXT_EFFECTS_SAM3_MASK_SHOW_SECONDS) * fps)
              )}
            >
	              <Sam3StaticMaskOverlay
	                src={resolveAssetSrc(TEXT_EFFECTS_SAM3_STATIC_MASK_URL, assetMap)}
	                startSeconds={TEXT_EFFECTS_SAM3_MASK_SHOW_SECONDS}
	                endSeconds={TEXT_EFFECTS_TOOL1_SAM3_END_SECONDS}
	                frameOffset={Math.max(0, Math.floor(TEXT_EFFECTS_SAM3_MASK_SHOW_SECONDS * fps))}
	              />
            </Sequence>
          </>
        );
      })()}

      {(() => {
        const from = Math.max(0, Math.floor(TEXT_EFFECTS_RECAP_START_SECONDS * fps));
        const dur = Math.max(
          1,
          Math.min(
            durationInFrames - from,
            Math.ceil((TEXT_EFFECTS_RECAP_END_SECONDS - TEXT_EFFECTS_RECAP_START_SECONDS) * fps)
          )
        );

        return (
	          <Sequence name="[OUTRO] Recap Canvas" from={from} durationInFrames={dur}>
	            <RecapOverlay
              durationInFrames={dur}
              frameOffset={from}
              startSeconds={TEXT_EFFECTS_RECAP_START_SECONDS}
              samSeconds={TEXT_EFFECTS_RECAP_SAM3_SECONDS}
              matAnyoneSeconds={TEXT_EFFECTS_RECAP_MATANYONE_SECONDS}
	              remotionSeconds={TEXT_EFFECTS_RECAP_REMOTION_SECONDS}
	              scale={TEXT_EFFECTS_UI_SCALE}
	              codexLogo={resolveAssetSrc(TEXT_EFFECTS_CODEX_LOGO_URL, assetMap)}
	              sam3Url="https://github.com/facebookresearch/sam3"
	              matAnyoneUrl="https://github.com/pq-yang/MatAnyone"
	              remotionUrl="https://www.remotion.dev/"
	            />
	          </Sequence>
        );
      })()}

      {(() => {
        const from = Math.max(0, Math.floor(TEXT_EFFECTS_LINKS_START_SECONDS * fps));
        const dur = Math.max(
          1,
          Math.min(
            durationInFrames - from,
            Math.ceil((TEXT_EFFECTS_LINKS_END_SECONDS - TEXT_EFFECTS_LINKS_START_SECONDS) * fps)
          )
        );

        return (
          <Sequence name="[OUTRO] Links: Check Description" from={from} durationInFrames={dur}>
            <DescriptionLinksOverlay durationInFrames={dur} scale={TEXT_EFFECTS_UI_SCALE * 1.18} />
          </Sequence>
        );
      })()}

		        <Sequence name="[S01] HeroStamp (Front)" from={0} durationInFrames={holdFrames}>
		          <HeroStamp
		            layer="front"
		            accentColor="rgb(232, 213, 186)"
		            transcriptWords={transcriptWords}
		            timing={TEXT_EFFECTS_HERO_STAMP_TIMING}
			            holdUntilSeconds={holdUntilSeconds}
			            fadeOutSeconds={heroFadeOutSeconds}
			            bottomLogoVariant="openai"
			            bottomLogoSpin
			            bottomLogoCue="codexEnd"
			            bottomLogoSpinTurns={4}
			            bottomLogoSpinDurationSeconds={1.0}
			            bottomLogoDropDurationSeconds={0.65}
			            bottomLogoDropPx={22}
			            // Start after the word "codex" completes (no early spin).
			            bottomLogoSpinStartOffsetSeconds={0.06}
			          />
			        </Sequence>
      </div>
    </div>
  );
};
