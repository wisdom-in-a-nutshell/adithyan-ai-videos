import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const FadeInBackdrop = ({
  fadeInFrames = 8,
  color = '#ffffff',
  style,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        opacity,
        ...style,
      }}
    />
  );
};
