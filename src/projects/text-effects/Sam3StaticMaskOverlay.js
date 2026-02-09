import React from 'react';
import {Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

export const Sam3StaticMaskOverlay = ({
  src,
  startSeconds,
  endSeconds,
  // `useCurrentFrame()` is relative to the nearest <Sequence>.
  frameOffset = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const absoluteFrame = frame + (Number.isFinite(frameOffset) ? frameOffset : 0);
  const t = absoluteFrame / fps;

  const inWindow =
    (!Number.isFinite(startSeconds) || t >= startSeconds) &&
    (!Number.isFinite(endSeconds) || t <= endSeconds);
  if (!inWindow) {
    return null;
  }

  const appear = clamp01((t - startSeconds) / 0.25);
  const fadeOut = Number.isFinite(endSeconds) ? clamp01((endSeconds - t) / 0.25) : 1;
  const opacity = interpolate(appear, [0, 1], [0, 1]) * fadeOut;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        // Above video/alpha, below the top-left pills (zIndex 20).
        zIndex: 12,
        opacity,
      }}
    >
      <Img
        src={src}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
};

