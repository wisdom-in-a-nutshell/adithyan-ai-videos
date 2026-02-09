import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

export const GreenScreenOverlay = ({
  startSeconds,
  endSeconds,
  // `useCurrentFrame()` is relative to the nearest <Sequence>.
  // Pass the sequence `from` frame to compute absolute (composition) time.
  frameOffset = 0,
  // Color is intentionally loud: this is a "green screen preview" moment.
  color = 'rgb(0, 255, 0)',
  fadeSeconds = 0.25,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const absoluteFrame = frame + (Number.isFinite(frameOffset) ? frameOffset : 0);
  const t = absoluteFrame / Math.max(1, fps);

  const s = Number(startSeconds);
  const e = Number(endSeconds);
  if (!Number.isFinite(s) || !Number.isFinite(e) || e <= s) {
    return null;
  }

  const fade = Math.max(0.05, Number(fadeSeconds) || 0.25);
  const inP = clamp01((t - s) / fade);
  const outP = clamp01((e - t) / fade);
  const opacity = interpolate(inP * outP, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: color,
        opacity,
      }}
    />
  );
};

