import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  CodexCallout,
  DisclaimerOverlay,
  LabelOverlay,
} from '../../overlay_kit/overlays.js';
import {SKETCH_FONT_FAMILY, SketchDefs} from '../../styles/sketch.js';
import {
  BALL_SEGMENT_MASK_URL,
  FPS,
  OPENER_UI,
  OVERLAY_VIEW,
  PERSON_MATTE_ALPHA_URL,
  TIMING,
  VIDEO_URL,
} from './assets.js';

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
          name="[S02] RAW RECORDING"
          from={Math.max(0, Math.floor(TIMING.introStart * FPS))}
          durationInFrames={Math.max(1, Math.floor((TIMING.introEnd - TIMING.introStart) * FPS))}
        >
          <LabelOverlay
            text="RAW RECORDING"
            durationInFrames={Math.max(1, Math.floor((TIMING.introEnd - TIMING.introStart) * FPS))}
            scale={OPENER_UI.labelScale}
          />
        </Sequence>

        <Sequence
          name="[S03] CODEX"
          from={Math.max(0, Math.floor(TIMING.introStart * FPS))}
          durationInFrames={Math.max(1, Math.floor((TIMING.introEnd - TIMING.introStart) * FPS))}
        >
          <CodexCallout
            text="CODEX"
            durationInFrames={Math.max(1, Math.floor((TIMING.introEnd - TIMING.introStart) * FPS))}
            scale={OPENER_UI.codexScale}
          />
        </Sequence>

        <Sequence
          name="[S04] Disclaimer"
          from={Math.max(0, Math.floor(TIMING.introStart * FPS))}
          durationInFrames={Math.max(1, Math.floor((TIMING.introEnd - TIMING.introStart) * FPS))}
        >
          <DisclaimerOverlay
            text="Everything that you're seeing in this video is rendered by Codex"
            durationInFrames={Math.max(1, Math.floor((TIMING.introEnd - TIMING.introStart) * FPS))}
            scale={OPENER_UI.disclaimerScale}
            bottomPx={OPENER_UI.disclaimerBottomPx}
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
