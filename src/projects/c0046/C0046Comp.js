import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {
  BALL_SEGMENT_MASK_URL,
  DEBUG_VIEW,
  FPS,
  PERSON_MATTE_ALPHA_URL,
  PERSON_MATTE_MASK_URL,
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

  const badgeStyle = {
    position: 'absolute',
    left: 28,
    top: 28,
    padding: '10px 14px',
    borderRadius: 999,
    background: 'rgba(5, 10, 24, 0.82)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.18)',
    fontFamily: 'SF Pro Display, Helvetica, Arial, sans-serif',
    fontSize: 24,
    fontWeight: 600,
    letterSpacing: 0.2,
  };

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

      {DEBUG_VIEW.showBallMaskOverlay ? (
        <Sequence name="[D01] Ball Segment Overlay" from={0}>
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
            <div style={badgeStyle}>Ball SAM mask overlay</div>
          </AbsoluteFill>
        </Sequence>
      ) : null}

      {DEBUG_VIEW.showPersonAlphaPreview ? (
        <Sequence name="[D02] Person Alpha Preview" from={0}>
          <div
            style={{
              position: 'absolute',
              right: 28,
              bottom: 28,
              width: 420,
              height: 236,
              overflow: 'hidden',
              borderRadius: 26,
              border: '1px solid rgba(255,255,255,0.18)',
              background:
                'linear-gradient(180deg, rgba(10,16,32,0.92) 0%, rgba(6,10,18,0.92) 100%)',
              boxShadow: '0 18px 46px rgba(0, 0, 0, 0.35)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 16,
                top: 14,
                zIndex: 2,
                color: '#fff',
                fontFamily: 'SF Pro Display, Helvetica, Arial, sans-serif',
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: 0.2,
              }}
            >
              Person alpha preview
            </div>
            <AbsoluteFill
              style={{
                background:
                  'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.32), transparent 42%), #08101c',
              }}
            >
              <OffthreadVideo
                src={resolveAssetSrc(PERSON_MATTE_ALPHA_URL, assetMap)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </AbsoluteFill>
          </div>
        </Sequence>
      ) : null}

      {DEBUG_VIEW.showPersonMaskPreview ? (
        <Sequence name="[D03] Person Mask Preview" from={0}>
          <div
            style={{
              position: 'absolute',
              left: 28,
              bottom: 28,
              width: 320,
              height: 180,
              overflow: 'hidden',
              borderRadius: 22,
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            <OffthreadVideo
              src={resolveAssetSrc(PERSON_MATTE_MASK_URL, assetMap)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
