import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {SKETCH_FONT_FAMILY} from '../../styles/sketch.js';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

// Project-scoped demo overlay to make "front vs behind vs fancy" obvious.
export const TextPlacementDemoOverlay = ({
  durationInFrames,
  scale = 1,
  variant = 'front', // 'front' | 'behind' | 'fancy'
}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();

  const dur = Math.max(1, Number(durationInFrames) || 1);
  const fadeFrames = Math.max(1, Math.floor(0.22 * fps));

  const inP = clamp01(frame / fadeFrames);
  const outP = clamp01((dur - 1 - frame) / fadeFrames);
  const opacity = interpolate(inP * outP, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slide = interpolate(inP, [0, 1], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Place these near the subject (centered), away from the left-side tool stack.
  // - FRONT: centered on chest
  // - BEHIND: behind head/neck
  // - FANCY: bigger, behind head/neck
  // Horizontally center by video dimensions (not "avoid the left stack").
  // We'll art-direct vertical placement per variant.
  const anchorX = 50; // percent
  // Keep consistent vertical gaps between the 3 stacked labels once they persist.
  const anchorY = variant === 'front' ? 78 : variant === 'behind' ? 55 : 32; // percent

  const fancyT = variant === 'fancy' ? frame / Math.max(1, fps) : 0;
  const wiggleX = variant === 'fancy' ? Math.sin(fancyT * Math.PI * 1.6) * 7 : 0;
  const wiggleY = variant === 'fancy' ? Math.cos(fancyT * Math.PI * 1.2) * 4 : 0;
  const fancyPulse = variant === 'fancy' ? 1 + Math.sin(fancyT * Math.PI * 1.25) * 0.02 : 1;

  // User feedback: remove big background "highlight cards" and keep only readable text.
  const sizeScale = variant === 'front' ? 1.28 : variant === 'behind' ? 1.34 : 1.72;
  const bigSize = 72 * scale * sizeScale;

  const zIndex = variant === 'front' ? 80 : 10;

  const text =
    variant === 'front' ? 'TEXT IN FRONT' : variant === 'behind' ? 'TEXT BEHIND' : 'FANCY TEXT BEHIND';

  // Keep stroke thin enough that the inner fill stays visible, but thick enough to read on bright backgrounds.
  const strokePx = Math.max(3, Math.min(6, Math.round(bigSize * 0.045)));
  const textStroke =
    variant === 'fancy'
      ? `${strokePx}px rgba(0,0,0,0.62)`
      : `${strokePx}px rgba(0,0,0,0.58)`;
  const textShadow =
    variant === 'fancy'
      ? [
          '0 10px 24px rgba(0,0,0,0.55)',
          '0 0 22px rgba(59,130,246,0.55)',
          '0 0 36px rgba(236,72,153,0.42)',
        ].join(', ')
      : '0 12px 28px rgba(0,0,0,0.48)';

  const color =
    variant === 'fancy'
      ? 'transparent'
      : variant === 'front'
        ? 'rgba(255,255,255,1)'
        : 'rgba(245,245,245,0.98)';
  const backgroundImage =
    variant === 'fancy'
      ? 'linear-gradient(90deg, #22c55e, #3b82f6, #f97316, #ec4899, #22c55e)'
      : undefined;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${anchorX}%`,
        top: `${anchorY}%`,
        transform: `translate3d(calc(-50% + ${wiggleX}px), calc(-50% + ${wiggleY}px + ${slide}px), 0) scale(${fancyPulse})`,
        opacity,
        zIndex,
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontFamily: SKETCH_FONT_FAMILY,
          fontSize: bigSize,
          fontWeight: 400,
          letterSpacing: 1.1,
          lineHeight: 1,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          color,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          WebkitTextStroke: textStroke,
          textShadow,
          backgroundImage,
          backgroundClip: backgroundImage ? 'text' : undefined,
          WebkitBackgroundClip: backgroundImage ? 'text' : undefined,
          backgroundSize: backgroundImage ? '220% 100%' : undefined,
          backgroundPosition: backgroundImage
            ? `${Math.floor((fancyT * 120) % 220)}% 50%`
            : undefined,
          display: 'inline-block',
        }}
      >
        {text}
      </span>
    </div>
  );
};
