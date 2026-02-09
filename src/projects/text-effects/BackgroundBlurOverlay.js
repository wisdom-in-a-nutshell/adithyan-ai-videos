import React from 'react';
import {OffthreadVideo, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

// Project-scoped overlay: a blurred duplicate of the background layer.
// Mount inside a <Sequence> that spans the blur interval.
export const BackgroundBlurOverlay = ({
  src,
  // Align the blurred duplicate to the composition timeline so it doesn't "restart" visually.
  // Pass the parent <Sequence from> frame here.
  startFromFrame = 0,
  durationInFrames,
  blurPx = 8,
  fadeSeconds = 0.25,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const fadeFrames = Math.max(1, Math.floor((Number(fadeSeconds) || 0.25) * fps));
  const dur = Math.max(1, Number(durationInFrames) || 1);

  const inP = clamp01(frame / fadeFrames);
  const outP = clamp01((dur - 1 - frame) / fadeFrames);
  const opacity = interpolate(inP * outP, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const px = Math.max(0, Number(blurPx) || 0);

  return (
    <OffthreadVideo
      src={src}
      startFrom={Math.max(0, Math.floor(Number(startFromFrame) || 0))}
      muted
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 1,
        filter: px > 0 ? `blur(${px}px)` : undefined,
        // Blur makes edge pixels transparent-ish; scale slightly to avoid dark borders.
        transform: px > 0 ? 'scale(1.03)' : undefined,
        transformOrigin: 'center center',
        opacity,
      }}
    />
  );
};
