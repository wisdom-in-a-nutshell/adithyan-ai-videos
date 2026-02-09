import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const Pill = ({prefix, text, color}) => {
  return (
    <div
      style={{
        height: 44,
        padding: '0 16px',
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.92)',
        color: '#111827',
        fontSize: 21,
        fontWeight: 600,
        letterSpacing: 0.4,
        boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderLeft: color ? `6px solid ${color}` : undefined,
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: 999,
          backgroundColor: color ?? '#111827',
          color: '#fff',
          fontSize: 14,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '0 0 auto',
        }}
      >
        {prefix}
      </span>
      <span>{text}</span>
    </div>
  );
};

export const LayersLegendOverlay = ({durationInFrames, scale = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / Math.max(1, fps);
  const durSeconds = durationInFrames / Math.max(1, fps);

  const fadeIn = clamp01(t / 0.25);
  const fadeOut = clamp01((durSeconds - t) / 0.25);
  const opacity = fadeIn * fadeOut;
  const slide = interpolate(fadeIn, [0, 1], [10, 0]) * scale;

  const matteColor = 'rgba(34, 197, 94, 0.95)'; // green-500
  const bgColor = 'rgba(59, 130, 246, 0.92)'; // blue-500

  return (
    <div
      style={{
        position: 'absolute',
        right: 32 * scale,
        top: 32 * scale,
        zIndex: 120,
        opacity,
        transform: `translateY(${slide}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 12 * scale,
        pointerEvents: 'none',
      }}
    >
      <Pill prefix="1" text="Layer 1: Matte (alpha)" color={matteColor} />
      <Pill prefix="2" text="Layer 2: Original video" color={bgColor} />
    </div>
  );
};
