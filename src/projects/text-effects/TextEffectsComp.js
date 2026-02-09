import React from 'react';
import {Sequence, Video, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {HeroStamp} from '../../components/HeroStamp.js';
import transcriptWords from './transcript_words.json';
import {
  TEXT_EFFECTS_ALPHA_URL,
  TEXT_EFFECTS_CODEX_LOGO_URL,
  TEXT_EFFECTS_SETUP_CODING_ARTIFACTS_SECONDS,
  TEXT_EFFECTS_SETUP_CODING_TOOLS_SECONDS,
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
  TEXT_EFFECTS_TOOL1_SAM3_START_SECONDS,
  TEXT_EFFECTS_TOOL1_SAM3_END_SECONDS,
  TEXT_EFFECTS_SAM3_MASK_SHOW_SECONDS,
  TEXT_EFFECTS_SAM3_STATIC_MASK_URL,
  TEXT_EFFECTS_TOOL2_GREEN_END_SECONDS,
  TEXT_EFFECTS_TOOL2_GREEN_START_SECONDS,
  TEXT_EFFECTS_TOOL2_END_SECONDS,
  TEXT_EFFECTS_TOOL2_START_SECONDS,
  TEXT_EFFECTS_TOOL3_REMOTION_START_SECONDS,
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
import {Sam3StaticMaskOverlay} from './Sam3StaticMaskOverlay.js';
import {TEXT_EFFECTS_UI_SCALE} from './ui.js';

const resolveAssetSrc = (src) => {
  if (!src || typeof src !== 'string') {
    return src;
  }
  return src;
};

const normalizeWord = (value) => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().toLowerCase().replace(/[^\w%]+/g, '');
};

const findLetMeShowYouHowEndSeconds = (words) => {
  if (!Array.isArray(words)) {
    return null;
  }
  const onlyWords = words.filter((w) => w?.type === 'word' && typeof w?.text === 'string');
  if (onlyWords.length === 0) {
    return null;
  }

  // Find "let me show you how" and return the end time of "how".
  for (let i = 0; i < onlyWords.length - 4; i++) {
    const w0 = normalizeWord(onlyWords[i].text);
    const w1 = normalizeWord(onlyWords[i + 1].text);
    const w2 = normalizeWord(onlyWords[i + 2].text);
    const w3 = normalizeWord(onlyWords[i + 3].text);
    const w4 = normalizeWord(onlyWords[i + 4].text);
    if (w0 === 'let' && w1 === 'me' && w2 === 'show' && w3 === 'you' && w4 === 'how') {
      const end = Number(onlyWords[i + 4].end);
      return Number.isFinite(end) ? end : null;
    }
  }

  return null;
};

const findLetMeShowYouHowStartSeconds = (words) => {
  if (!Array.isArray(words)) {
    return null;
  }
  const onlyWords = words.filter((w) => w?.type === 'word' && typeof w?.text === 'string');
  if (onlyWords.length === 0) {
    return null;
  }

  // Find "let me show you how" and return the start time of "let".
  for (let i = 0; i < onlyWords.length - 4; i++) {
    const w0 = normalizeWord(onlyWords[i].text);
    const w1 = normalizeWord(onlyWords[i + 1].text);
    const w2 = normalizeWord(onlyWords[i + 2].text);
    const w3 = normalizeWord(onlyWords[i + 3].text);
    const w4 = normalizeWord(onlyWords[i + 4].text);
    if (w0 === 'let' && w1 === 'me' && w2 === 'show' && w3 === 'you' && w4 === 'how') {
      const start = Number(onlyWords[i].start);
      return Number.isFinite(start) ? start : null;
    }
  }

  return null;
};

const findFirstWordInRangeSeconds = (words, targets, startSeconds, endSeconds) => {
  if (!Array.isArray(words) || !Array.isArray(targets)) {
    return null;
  }
  const targetSet = new Set(targets.map((t) => normalizeWord(t)));
  for (const w of words) {
    if (w?.type !== 'word' || typeof w?.text !== 'string') {
      continue;
    }
    const start = Number(w.start);
    if (!Number.isFinite(start)) {
      continue;
    }
    if (start < startSeconds || start > endSeconds) {
      continue;
    }
    if (targetSet.has(normalizeWord(w.text))) {
      return start;
    }
  }
  return null;
};

const findFirstWordEndInRangeSeconds = (words, targets, startSeconds, endSeconds) => {
  if (!Array.isArray(words) || !Array.isArray(targets)) {
    return null;
  }
  const targetSet = new Set(targets.map((t) => normalizeWord(t)));
  for (const w of words) {
    if (w?.type !== 'word' || typeof w?.text !== 'string') {
      continue;
    }
    const start = Number(w.start);
    const end = Number(w.end);
    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      continue;
    }
    if (start < startSeconds || start > endSeconds) {
      continue;
    }
    if (targetSet.has(normalizeWord(w.text))) {
      return end;
    }
  }
  return null;
};

// Project-specific composition wrapper for `text-effects`.
// Keep the cut short while iterating; extend later when we implement storyboard-driven beats.
export const TextEffectsComp = (props) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / Math.max(1, fps);
  const holdUntilSeconds = findLetMeShowYouHowEndSeconds(transcriptWords);
  const letMeShowYouStartSeconds = findLetMeShowYouHowStartSeconds(transcriptWords);
  const holdFrames =
    Number.isFinite(holdUntilSeconds) && holdUntilSeconds !== null
      ? Math.min(durationInFrames, Math.max(1, Math.ceil(holdUntilSeconds * fps)))
      : durationInFrames;

  // Subtle camera punch-in during the pause after "... edited by codex",
  // then ease back out right as "let me show you how" starts.
  const codexEndSeconds =
    findFirstWordEndInRangeSeconds(transcriptWords, ['codex', 'codec', 'codecs'], 0, 12) ?? null;

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
            src={resolveAssetSrc(TEXT_EFFECTS_VIDEO_URL)}
            style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </Sequence>

        <Sequence name="[S01] HeroStamp (Behind)" from={0} durationInFrames={holdFrames}>
          <HeroStamp
            layer="behind"
            transcriptWords={transcriptWords}
            holdUntilSeconds={holdUntilSeconds}
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

        <Sequence name="[S01+] Foreground Alpha" from={0} durationInFrames={durationInFrames}>
          <Video
            src={resolveAssetSrc(TEXT_EFFECTS_ALPHA_URL)}
            muted
            style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </Sequence>

        {(() => {
          const from = Math.max(0, Math.floor(TEXT_EFFECTS_SETUP_START_SECONDS * fps));
          const dur = Math.max(
            1,
            Math.min(
              durationInFrames - from,
              Math.ceil((TEXT_EFFECTS_SETUP_END_SECONDS - TEXT_EFFECTS_SETUP_START_SECONDS) * fps)
            )
          );

          const codexSeconds =
            findFirstWordInRangeSeconds(
              transcriptWords,
              ['codex', 'codec', 'codecs'],
              TEXT_EFFECTS_SETUP_START_SECONDS,
              TEXT_EFFECTS_SETUP_END_SECONDS
            ) ?? TEXT_EFFECTS_SETUP_START_SECONDS;
          const codexFrom = Math.max(0, Math.floor(codexSeconds * fps));
          // Keep the Codex pill on-screen from first mention through the rest of the cut.
          const codexDur = Math.max(1, durationInFrames - codexFrom);

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
        const dur = Math.max(1, durationInFrames - from);
        const animDur = Math.max(1, Math.min(dur, tool1From - from));
        const segDur = Math.max(1, Math.min(durationInFrames - tool1From, tool2From - tool1From));
        const mattDur = Math.max(1, Math.min(durationInFrames - tool2From, tool3From - tool2From));
        const compDur = Math.max(1, durationInFrames - tool3From);

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
                durationInFrames - Math.max(0, Math.floor(TEXT_EFFECTS_SETUP_VIDEO_TOOLS_SECONDS * fps))
              )}
            >
              {(() => {
                const specificallySeconds =
                  findFirstWordInRangeSeconds(
                    transcriptWords,
                    ['specifically'],
                    TEXT_EFFECTS_THREE_TOOLS_START_SECONDS,
                    TEXT_EFFECTS_THREE_TOOLS_END_SECONDS
                  ) ?? TEXT_EFFECTS_THREE_TOOLS_START_SECONDS;

                const samSeconds =
                  findFirstWordInRangeSeconds(
                    transcriptWords,
                    ['sam', 'sam3'],
                    specificallySeconds,
                    specificallySeconds + 10
                  ) ?? specificallySeconds + 1.4;

                return (
                  <CodexToolsArtifactsOverlay
                    durationInFrames={dur}
                    startSeconds={TEXT_EFFECTS_SETUP_VIDEO_TOOLS_SECONDS}
                    toolsSeconds={TEXT_EFFECTS_SETUP_VIDEO_TOOLS_SECONDS}
                    artifactsSeconds={TEXT_EFFECTS_SETUP_VIDEO_ARTIFACTS_SECONDS}
                    artifactsHideSeconds={samSeconds}
                    toolsText="Video tools"
                    artifactsText="Video artifacts"
                    toolsEmoji="🛠"
                    artifactsEmoji="🎞️"
                    frameOffset={Math.max(0, Math.floor(TEXT_EFFECTS_SETUP_VIDEO_TOOLS_SECONDS * fps))}
                    scale={TEXT_EFFECTS_UI_SCALE}
                    baseLeft={32 * TEXT_EFFECTS_UI_SCALE}
                    baseTop={132 * TEXT_EFFECTS_UI_SCALE}
                  />
                );
              })()}
            </Sequence>

            <Sequence
              name="[S04] Three Tools: SAM3 -> MatAnyone -> Remotion"
              from={Math.max(0, Math.floor(TEXT_EFFECTS_THREE_TOOLS_START_SECONDS * fps))}
              durationInFrames={Math.max(
                1,
                Math.ceil((TEXT_EFFECTS_THREE_TOOLS_END_SECONDS - TEXT_EFFECTS_THREE_TOOLS_START_SECONDS) * fps)
              )}
            >
              {(() => {
                const specificallySeconds =
                  findFirstWordInRangeSeconds(
                    transcriptWords,
                    ['specifically'],
                    TEXT_EFFECTS_THREE_TOOLS_START_SECONDS,
                    TEXT_EFFECTS_THREE_TOOLS_END_SECONDS
                  ) ?? TEXT_EFFECTS_THREE_TOOLS_START_SECONDS;

                const samSeconds =
                  findFirstWordInRangeSeconds(
                    transcriptWords,
                    ['sam', 'sam3'],
                    specificallySeconds,
                    specificallySeconds + 10
                  ) ?? specificallySeconds + 1.4;

                const matAnyoneSeconds =
                  findFirstWordInRangeSeconds(
                    transcriptWords,
                    ['mat', 'matt', 'map'],
                    samSeconds + 0.01,
                    samSeconds + 10
                  ) ?? samSeconds + 0.8;

                const remotionSeconds =
                  findFirstWordInRangeSeconds(
                    transcriptWords,
                    ['remotion'],
                    matAnyoneSeconds + 0.01,
                    matAnyoneSeconds + 20
                  ) ?? matAnyoneSeconds + 0.8;

                return (
                  <ThreeToolsOverlay
                    startSeconds={specificallySeconds}
                    frameOffset={Math.max(0, Math.floor(TEXT_EFFECTS_THREE_TOOLS_START_SECONDS * fps))}
                    scale={TEXT_EFFECTS_UI_SCALE}
                    baseLeft={32 * TEXT_EFFECTS_UI_SCALE}
                    baseTop={132 * TEXT_EFFECTS_UI_SCALE}
                    anchor="tools"
                    items={[
                      {label: 'SAM3', startSeconds: samSeconds},
                      {label: 'MatAnyone', startSeconds: matAnyoneSeconds},
                      {label: 'Remotion', startSeconds: remotionSeconds},
                    ]}
                  />
                );
              })()}
            </Sequence>

            <Sequence
              name="[S05-07] Tool Stack: 1 SAM3, 2 MatAnyone, 3 Remotion"
              from={tool1From}
              durationInFrames={Math.max(1, durationInFrames - tool1From)}
            >
              <ThreeToolsOverlay
                startSeconds={TEXT_EFFECTS_TOOL1_SAM3_START_SECONDS}
                frameOffset={tool1From}
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
                src={resolveAssetSrc(TEXT_EFFECTS_SAM3_STATIC_MASK_URL)}
                startSeconds={TEXT_EFFECTS_SAM3_MASK_SHOW_SECONDS}
                endSeconds={TEXT_EFFECTS_TOOL1_SAM3_END_SECONDS}
                frameOffset={Math.max(0, Math.floor(TEXT_EFFECTS_SAM3_MASK_SHOW_SECONDS * fps))}
              />
            </Sequence>
          </>
        );
      })()}

        <Sequence name="[S01] HeroStamp (Front)" from={0} durationInFrames={holdFrames}>
          <HeroStamp
            layer="front"
            transcriptWords={transcriptWords}
            holdUntilSeconds={holdUntilSeconds}
          />
        </Sequence>
      </div>
    </div>
  );
};
