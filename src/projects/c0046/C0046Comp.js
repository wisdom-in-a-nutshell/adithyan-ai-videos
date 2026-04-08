import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {
  BALL_SEGMENT_MASK_URL,
  FPS,
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
    <AbsoluteFill style={{backgroundColor: '#000'}}>
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
