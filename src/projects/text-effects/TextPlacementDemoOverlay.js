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

  // Place this near the subject so the occlusion difference is obvious.
  // Keep it away from the left-side tool stack.
  const baseX = Math.round(width * 0.44);
  const baseY = Math.round(height * 0.36);

  const bigSize = 54 * scale;
  const boxPadX = 18 * scale;
  const boxPadY = 14 * scale;

  const conf =
    variant === 'fancy'
      ? {
          label: 'FANCY (BEHIND)',
          labelBg: 'rgba(17,24,39,0.92)',
          text: 'FANCY TEXT',
          boxBg: 'rgba(255,255,255,0.10)',
          border: '2px solid rgba(59,130,246,0.9)',
          textColor: 'transparent',
          // Gradient fill for the fancy variant.
          textBg: 'linear-gradient(90deg, #22c55e, #3b82f6, #f97316)',
          textShadow: '0 14px 30px rgba(0,0,0,0.35)',
        }
      : variant === 'behind'
        ? {
            label: 'BEHIND SUBJECT',
            labelBg: 'rgba(37,99,235,0.92)',
            text: 'TEXT BEHIND',
            boxBg: 'rgba(255,255,255,0.12)',
            border: '2px dashed rgba(255,255,255,0.75)',
            textColor: '#ffffff',
            textBg: null,
            textShadow: '0 12px 26px rgba(0,0,0,0.4)',
          }
        : {
            label: 'IN FRONT',
            labelBg: 'rgba(0,0,0,0.72)',
            text: 'TEXT IN FRONT',
            boxBg: 'rgba(255,255,255,0.92)',
            border: '2px solid rgba(0,0,0,0.12)',
            textColor: '#111827',
            textBg: null,
            textShadow: '0 10px 24px rgba(0,0,0,0.18)',
          };

  const fancyWiggle =
    variant === 'fancy'
      ? interpolate(frame, [0, dur - 1], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;
  const wiggleX = variant === 'fancy' ? Math.sin(fancyWiggle * Math.PI * 2) * 6 : 0;

  const zIndex = variant === 'front' ? 80 : 10;

  return (
    <div
      style={{
        position: 'absolute',
        left: baseX,
        top: baseY,
        transform: `translate3d(${wiggleX}px, ${slide}px, 0)`,
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
