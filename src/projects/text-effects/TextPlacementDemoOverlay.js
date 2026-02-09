import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const LabelPill = ({text, bg}) => {
  return (
    <div
      style={{
        padding: '6px 10px',
        borderRadius: 999,
        backgroundColor: bg,
        color: '#fff',
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: 1.1,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

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
  const anchorY =
    variant === 'front' ? 60 : variant === 'behind' ? 40 : 38; // percent

  // Keep FRONT and BEHIND the same style; occlusion makes the difference.
  const baseCard = {
    boxBg: 'rgba(255,255,255,0.92)',
    border: '2px solid rgba(0,0,0,0.12)',
    textColor: '#111827',
    textShadow: '0 10px 24px rgba(0,0,0,0.18)',
  };

  const conf =
    variant === 'fancy'
      ? {
          label: 'FANCY (BEHIND)',
          labelBg: 'rgba(17,24,39,0.92)',
          text: 'FANCY TEXT',
          boxBg: 'rgba(255,255,255,0.14)',
          border: '2px solid rgba(59,130,246,0.9)',
          textColor: 'transparent',
          textBg: 'linear-gradient(90deg, #22c55e, #3b82f6, #f97316, #ec4899, #22c55e)',
          textShadow: '0 18px 38px rgba(0,0,0,0.42)',
        }
      : variant === 'behind'
        ? {
            label: 'BEHIND SUBJECT',
            labelBg: 'rgba(0,0,0,0.72)',
            text: 'TEXT BEHIND',
            ...baseCard,
          }
        : {
            label: 'IN FRONT',
            labelBg: 'rgba(0,0,0,0.72)',
            text: 'TEXT IN FRONT',
            ...baseCard,
          };

  const fancyT = variant === 'fancy' ? frame / Math.max(1, fps) : 0;
  const wiggleX = variant === 'fancy' ? Math.sin(fancyT * Math.PI * 1.6) * 7 : 0;
  const wiggleY = variant === 'fancy' ? Math.cos(fancyT * Math.PI * 1.2) * 4 : 0;
  const fancyPulse = variant === 'fancy' ? 1 + Math.sin(fancyT * Math.PI * 1.25) * 0.02 : 1;

  const sizeScale = variant === 'fancy' ? 1.22 : 1;
  const bigSize = 54 * scale * sizeScale;
  const boxPadX = 18 * scale * sizeScale;
  const boxPadY = 14 * scale * sizeScale;

  const zIndex = variant === 'front' ? 80 : 10;

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
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          gap: 10 * scale,
        }}
      >
        <LabelPill text={conf.label} bg={conf.labelBg} />
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `${boxPadY}px ${boxPadX}px`,
            borderRadius: 18 * scale,
            backgroundColor: conf.boxBg,
            border: conf.border,
            boxShadow: conf.textShadow,
            backdropFilter: 'blur(6px)',
          }}
        >
          <span
            style={{
              fontSize: bigSize,
              fontWeight: 900,
              letterSpacing: 0.6,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              color: conf.textColor,
              backgroundImage: conf.textBg ?? undefined,
              backgroundClip: conf.textBg ? 'text' : undefined,
              WebkitBackgroundClip: conf.textBg ? 'text' : undefined,
              backgroundSize: conf.textBg ? '220% 100%' : undefined,
              backgroundPosition: conf.textBg
                ? `${Math.floor((fancyT * 120) % 220)}% 50%`
                : undefined,
              textShadow: variant === 'front' ? '0 2px 0 rgba(255,255,255,0.35)' : undefined,
            }}
          >
            {conf.text}
          </span>
        </div>
      </div>
    </div>
  );
};
