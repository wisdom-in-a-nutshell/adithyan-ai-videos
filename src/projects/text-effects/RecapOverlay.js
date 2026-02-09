import React from 'react';
import {Video, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {SKETCH_FONT_FAMILY} from '../../styles/sketch.js';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const appear01 = ({t, start, fade = 0.25}) => {
  if (!Number.isFinite(t) || !Number.isFinite(start)) {
    return 0;
  }
  return clamp01((t - start) / Math.max(0.001, fade));
};

const Row = ({n, title, subtitle, visible01}) => {
  const opacity = interpolate(visible01, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slideY = interpolate(visible01, [0, 1], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        gap: 18,
        alignItems: 'flex-start',
        opacity,
        transform: `translate3d(0, ${Math.round(slideY)}px, 0)`,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 999,
          backgroundColor: '#111827',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: SKETCH_FONT_FAMILY,
          fontSize: 26,
          WebkitTextStroke: '2px rgba(0,0,0,0.35)',
          boxShadow: '0 10px 24px rgba(0,0,0,0.22)',
          flex: '0 0 auto',
        }}
      >
        {n}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
        <div
          style={{
            fontFamily: SKETCH_FONT_FAMILY,
            fontSize: 44,
            letterSpacing: 1.1,
            textTransform: 'uppercase',
            color: '#0f172a',
            WebkitTextStroke: '4px rgba(255,255,255,0.85)',
            textShadow: '0 12px 30px rgba(0,0,0,0.10)',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
            fontSize: 24,
            color: '#334155',
            lineHeight: 1.25,
            maxWidth: 720,
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export const RecapOverlay = ({
  durationInFrames,
  frameOffset = 0,
  startSeconds,
  endSeconds,
  samSeconds,
  matAnyoneSeconds,
  remotionSeconds,
  alphaSrc,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // `useCurrentFrame()` is composition-global; compute:
  // - `globalSeconds` for transcript-timed triggers.
  // - `localSeconds` for in/out fading of this overlay Sequence.
  const globalSeconds = frame / Math.max(1, fps);
  const localFrame = frame - Math.max(0, Math.floor(Number(frameOffset) || 0));
  const localSeconds = localFrame / Math.max(1, fps);
  const dur = Math.max(1, Number(durationInFrames) || 1);
  const localT = localSeconds;

  const fadeIn = 0.35;
  const fadeOut = 0.35;
  const in01 = clamp01(localT / fadeIn);
  const out01 = clamp01((dur / Math.max(1, fps) - localT) / fadeOut);
  const baseOpacity = in01 * out01;

  const row1 = appear01({t: globalSeconds, start: samSeconds, fade: 0.25});
  const row2 = appear01({t: globalSeconds, start: matAnyoneSeconds, fade: 0.25});
  const row3 = appear01({t: globalSeconds, start: remotionSeconds, fade: 0.25});

  const header01 = appear01({t: globalSeconds, start: startSeconds, fade: 0.25});

  const pipSize = Math.round(width * 0.27);
  const pipMargin = Math.round(width * 0.032);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 5000,
        opacity: baseOpacity,
        pointerEvents: 'none',
      }}
    >
      {/* White canvas takeover */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#fbfbf7',
        }}
      />

      {/* Header */}
      <div
        style={{
          position: 'absolute',
          left: 64,
          top: 44,
          opacity: header01,
          transform: `translate3d(0, ${Math.round(interpolate(header01, [0, 1], [8, 0]))}px, 0)`,
        }}
      >
        <div
          style={{
            fontFamily: SKETCH_FONT_FAMILY,
            fontSize: 62,
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            color: '#0f172a',
            WebkitTextStroke: '4px rgba(255,255,255,0.85)',
            textShadow: '0 14px 34px rgba(0,0,0,0.10)',
            lineHeight: 1,
          }}
        >
          Recap
        </div>
      </div>

      {/* List */}
      <div
        style={{
          position: 'absolute',
          left: 64,
          top: Math.round(height * 0.24),
          display: 'flex',
          flexDirection: 'column',
          gap: 56,
        }}
      >
        <Row
          n="1"
          title="SAM 3"
          subtitle="Create a segmentation mask around the person."
          visible01={row1}
        />
        <Row
          n="2"
          title="MatAnyone"
          subtitle="Track that mask across the full video (a matte for every frame)."
          visible01={row2}
        />
        <Row
          n="3"
          title="Remotion"
          subtitle="Compose layers to create the final effects."
          visible01={row3}
        />
      </div>

      {/* Bottom-right talking head (cutout alpha) */}
      <div
        style={{
          position: 'absolute',
          width: pipSize,
          height: pipSize,
          right: pipMargin,
          bottom: pipMargin,
          borderRadius: 26,
          overflow: 'hidden',
          backgroundColor: '#0b1220',
          boxShadow: '0 18px 44px rgba(0,0,0,0.25)',
          border: '2px solid rgba(15,23,42,0.14)',
        }}
      >
        <Video
          src={alphaSrc}
          muted
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            // Punch in so the subject reads well at small size.
            transform: 'scale(1.55) translate3d(0, 18px, 0)',
            transformOrigin: '50% 50%',
          }}
        />
      </div>
    </div>
  );
};
