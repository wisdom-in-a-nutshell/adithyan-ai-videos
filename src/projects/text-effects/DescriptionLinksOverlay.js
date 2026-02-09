import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

export const DescriptionLinksOverlay = ({
  durationInFrames,
  scale = 1,
  text = 'Links + code: check description',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / Math.max(1, fps);
  const durSeconds = durationInFrames / Math.max(1, fps);

  const fadeIn = clamp01(t / 0.25);
  const fadeOut = clamp01((durSeconds - t) / 0.25);
  const opacity = fadeIn * fadeOut;

  const bob = Math.sin((frame / fps) * Math.PI * 2 * 0.9) * 4 * scale;
  const slide = interpolate(fadeIn, [0, 1], [10, 0]) * scale;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 44 * scale,
        zIndex: 120,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity,
        transform: `translateY(${slide}px)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12 * scale,
          padding: `${10 * scale}px ${16 * scale}px`,
          borderRadius: 999,
          backgroundColor: 'rgba(0,0,0,0.78)',
          boxShadow: '0 14px 40px rgba(0,0,0,0.25)',
          color: '#fff',
          fontSize: 20 * scale,
          fontWeight: 650,
          letterSpacing: 0.4,
          maxWidth: '85%',
        }}
      >
        <div
          style={{
            width: 34 * scale,
            height: 34 * scale,
            borderRadius: 999,
            backgroundColor: 'rgba(255,255,255,0.14)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18 * scale,
            transform: `translateY(${bob}px)`,
          }}
        >
          ↓
        </div>
        <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          {text}
        </div>
      </div>
    </div>
  );
};

