import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {HeroStamp} from '../../components/HeroStamp.js';
import transcriptWords from './transcript_words.json';
import {
  CodexCallout,
  LabelOverlay,
} from '../../overlay_kit/overlays.js';
import {SKETCH_FONT_FAMILY, SketchDefs} from '../../styles/sketch.js';
import {
  BALL_SEGMENT_MASK_URL,
  FPS,
  HERO_STAMP_TIMING,
  OVERLAY_VIEW,
  PERSON_MATTE_ALPHA_URL,
  TIMING,
  VIDEO_URL,
} from './assets.js';
import {TEXT_EFFECTS_UI_SCALE} from '../text-effects/ui.js';

const resolveAssetSrc = (src, assetMap) => {
  if (!src || typeof src !== 'string') {
    return src;
  }

  let resolved = src;

  if (assetMap && typeof assetMap === 'object') {
    const mapped = assetMap[resolved];
    if (typeof mapped === 'string' && mapped.length > 0) {
      resolved = mapped;
    }
  }

  if (/^https?:\/\//i.test(resolved) || resolved.startsWith('data:')) {
    return resolved;
  }
  if (resolved.startsWith('/public/')) {
    return resolved;
  }
  if (resolved.startsWith('public/')) {
    return staticFile(resolved.slice('public/'.length));
  }
  if (resolved.startsWith('/')) {
    return staticFile(resolved.slice(1));
  }
  return staticFile(resolved);
};

export const C0046Comp = (props) => {
  const assetMap = props?.assetMap ?? null;
  const frame = useCurrentFrame();
  const timeInSeconds = frame / FPS;
  const inBallWindow =
    timeInSeconds >= TIMING.ballWindowStart && timeInSeconds <= TIMING.ballWindowEnd;
  const introPunchInStart = HERO_STAMP_TIMING.codexEnd + 0.06;
  const introPunchInEnd = introPunchInStart + 0.22;
  const introPunchOutStart = TIMING.heroHoldEnd - 0.18;
  const introPunchOutEnd = introPunchOutStart + 0.2;
  const cameraScale = interpolate(
    timeInSeconds,
    [introPunchInStart, introPunchInEnd, introPunchOutStart, introPunchOutEnd],
    [1, 1.08, 1.08, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const cameraTranslateX = interpolate(
    timeInSeconds,
    [introPunchInStart, introPunchInEnd, introPunchOutStart, introPunchOutEnd],
    [0, -14, -14, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const cameraTranslateY = interpolate(
    timeInSeconds,
    [introPunchInStart, introPunchInEnd, introPunchOutStart, introPunchOutEnd],
    [0, -10, -10, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        fontFamily: SKETCH_FONT_FAMILY,
      }}
    >
      <SketchDefs />

      <AbsoluteFill
        style={{
          transform: `translate3d(${Math.round(cameraTranslateX)}px, ${Math.round(
            cameraTranslateY
          )}px, 0) scale(${cameraScale})`,
          transformOrigin: '50% 50%',
          zIndex: 180,
        }}
      >
        <Sequence name="[S01] Source Clip" from={0}>
          <OffthreadVideo
            src={resolveAssetSrc(VIDEO_URL, assetMap)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Sequence>

        <Sequence
          name="[S02] Hero Stamp"
          from={Math.max(0, Math.floor(TIMING.introStart * FPS))}
          durationInFrames={Math.max(1, Math.floor((TIMING.introEnd - TIMING.introStart) * FPS))}
        >
          <HeroStamp
            layer="behind"
            accentColor="rgb(232, 213, 186)"
            transcriptWords={transcriptWords}
            timing={HERO_STAMP_TIMING}
            holdUntilSeconds={TIMING.heroHoldEnd}
            fadeOutSeconds={0.6}
            percentSweep
            percentSweepDurationSeconds={0.6}
          />
        </Sequence>

        <Sequence
          name="[S03] RAW RECORDING"
          from={Math.max(0, Math.floor(TIMING.introStart * FPS))}
          durationInFrames={Math.max(1, Math.floor((TIMING.introEnd - TIMING.introStart) * FPS))}
        >
          <LabelOverlay
            text="RAW RECORDING"
            durationInFrames={Math.max(1, Math.floor((TIMING.introEnd - TIMING.introStart) * FPS))}
            scale={TEXT_EFFECTS_UI_SCALE}
          />
        </Sequence>

        <Sequence
          name="[S04] CODEX"
          from={Math.max(0, Math.floor(TIMING.introStart * FPS))}
          durationInFrames={Math.max(1, Math.floor((TIMING.introEnd - TIMING.introStart) * FPS))}
        >
          <CodexCallout
            text="CODEX"
            durationInFrames={Math.max(1, Math.floor((TIMING.introEnd - TIMING.introStart) * FPS))}
            scale={TEXT_EFFECTS_UI_SCALE}
          />
        </Sequence>

      </AbsoluteFill>

      {OVERLAY_VIEW.showBallTrackingMask ? (
        <Sequence name="[FX01] Ball Tracking Mask" from={0}>
          <AbsoluteFill
            style={{
              opacity: inBallWindow ? 0.52 : 0,
              pointerEvents: 'none',
            }}
          >
            <OffthreadVideo
              src={resolveAssetSrc(BALL_SEGMENT_MASK_URL, assetMap)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                mixBlendMode: 'screen',
                filter: 'contrast(1.25) brightness(1.15)',
              }}
            />
          </AbsoluteFill>
        </Sequence>
      ) : null}

      {OVERLAY_VIEW.showForegroundMatte ? (
        <Sequence name="[FX02] Foreground Matte" from={0}>
          <AbsoluteFill style={{pointerEvents: 'none'}}>
            <OffthreadVideo
              src={resolveAssetSrc(PERSON_MATTE_ALPHA_URL, assetMap)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </AbsoluteFill>
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
