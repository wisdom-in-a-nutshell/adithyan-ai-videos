import React from 'react';
import {Sequence, Video, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {HeroStamp} from '../../components/HeroStamp.js';
import transcriptWords from './transcript_words.json';
import {
  TEXT_EFFECTS_ALPHA_URL,
  TEXT_EFFECTS_CODEX_LOGO_URL,
  TEXT_EFFECTS_SETUP_ARTIFACTS_SECONDS,
  TEXT_EFFECTS_SETUP_CODING_START_SECONDS,
  TEXT_EFFECTS_SETUP_TOOLS_SECONDS,
  TEXT_EFFECTS_SETUP_VIDEO_START_SECONDS,
  TEXT_EFFECTS_SETUP_END_SECONDS,
  TEXT_EFFECTS_SETUP_CODEX_END_SECONDS,
  TEXT_EFFECTS_SETUP_CODEX_START_SECONDS,
  TEXT_EFFECTS_SETUP_START_SECONDS,
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
          transform: `scale(${cameraScale})`,
          transformOrigin: '50% 50%',
        }}
      >
        <Sequence name="Background" from={0} durationInFrames={durationInFrames}>
          <Video
            src={resolveAssetSrc(TEXT_EFFECTS_VIDEO_URL)}
            style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </Sequence>

        <Sequence name="HeroStamp (Behind)" from={0} durationInFrames={holdFrames}>
          <HeroStamp layer="behind" transcriptWords={transcriptWords} holdUntilSeconds={holdUntilSeconds} />
        </Sequence>

        <Sequence name="Foreground Alpha" from={0} durationInFrames={durationInFrames}>
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
              <Sequence name="Setup: RAW RECORDING (Front)" from={from} durationInFrames={dur}>
                <LabelOverlay text="RAW RECORDING" durationInFrames={dur} scale={1} />
              </Sequence>

              <Sequence name="Setup: CODEX (Front)" from={codexFrom} durationInFrames={codexDur}>
                <CodexCallout
                  text="CODEX"
                  logo={TEXT_EFFECTS_CODEX_LOGO_URL}
                  durationInFrames={codexDur}
                  scale={1}
                />
              </Sequence>

              <Sequence name="Setup: Disclaimer (Front)" from={from} durationInFrames={dur}>
                <DisclaimerOverlay
                  text="Everything on-screen, including motion overlays, is rendered by Codex"
                  durationInFrames={dur}
                  scale={1}
                />
              </Sequence>
            </>
          );
        })()}

        {(() => {
          const from = Math.max(0, Math.floor(TEXT_EFFECTS_SETUP_CODEX_START_SECONDS * fps));
          const dur = Math.max(
            1,
            Math.min(
              durationInFrames - from,
              Math.ceil((TEXT_EFFECTS_SETUP_CODEX_END_SECONDS - TEXT_EFFECTS_SETUP_CODEX_START_SECONDS) * fps)
            )
          );

          return (
            <>
              <Sequence name="Setup: ANIMATING (Front)" from={from} durationInFrames={dur}>
                <StatusLeftOverlay text="ANIMATING" durationInFrames={dur} scale={1} />
              </Sequence>

              <Sequence name="Setup: Codex -> Tools -> Artifacts (Front)" from={from} durationInFrames={dur}>
                <CodexToolsArtifactsOverlay
                  durationInFrames={dur}
                  startSeconds={TEXT_EFFECTS_SETUP_CODEX_START_SECONDS}
                  toolsSeconds={TEXT_EFFECTS_SETUP_TOOLS_SECONDS}
                  artifactsSeconds={TEXT_EFFECTS_SETUP_ARTIFACTS_SECONDS}
                  codingStartSeconds={TEXT_EFFECTS_SETUP_CODING_START_SECONDS}
                  videoStartSeconds={TEXT_EFFECTS_SETUP_VIDEO_START_SECONDS}
                  frameOffset={from}
                  // Align under the CODEX pill.
                  baseLeft={32}
                  baseTop={142}
                />
              </Sequence>
            </>
          );
        })()}

        <Sequence name="HeroStamp (Front)" from={0} durationInFrames={holdFrames}>
          <HeroStamp layer="front" transcriptWords={transcriptWords} holdUntilSeconds={holdUntilSeconds} />
        </Sequence>
      </div>
    </div>
  );
};
