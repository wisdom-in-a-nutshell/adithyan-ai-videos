import React from 'react';
import {Video, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CodexCallout, StatusLeftOverlay} from '../../overlay_kit/overlays.js';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const ToolPill = ({text, prefix, scale}) => {
  return (
    <div
      style={{
        height: 44 * scale,
        padding: `0 ${16 * scale}px`,
        borderRadius: 16 * scale,
        backgroundColor: 'rgba(255,255,255,0.92)',
        color: '#111827',
        fontSize: 21 * scale,
        fontWeight: 600,
        letterSpacing: 0.4,
        boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 12 * scale,
      }}
    >
      <span
        style={{
          width: 26 * scale,
          height: 26 * scale,
          borderRadius: 999,
          backgroundColor: '#111827',
          color: '#fff',
          fontSize: 14 * scale,
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

const RecapList = ({globalSeconds, items, scale}) => {
  const pillH = 44 * scale;
  const gapY = 44 * 1.2 * scale;
  const rowGap = pillH + gapY;

  const lineX = 22 * scale;
  const lineColor = 'rgba(59,130,246,0.92)';
  const lineW = Math.max(2, Math.round(2 * scale));
  const arrowSize = 7 * scale;

  // Start below the Codex pill block (StatusLeftOverlay + CodexCallout).
  const startY = 44 * 1.7 * scale;

  const rows = items.map((item, idx) => {
    const start = Number(item.startSeconds);
    const p = Number.isFinite(start) ? clamp01((globalSeconds - start) / 0.28) : 0;
    return {
      ...item,
      idx,
      p,
      opacity: interpolate(p, [0, 1], [0, 1]),
      translate: interpolate(p, [0, 1], [10 * scale, 0]),
      y: startY + idx * rowGap,
    };
  });

  const lastVisibleIndex = (() => {
    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i].p > 0.05) return i;
    }
    return 0;
  })();

  const lineStartY = startY + 12 * scale;
  const lineHeight =
    rows.length === 0
      ? 0
      : Math.max(0, rows[lastVisibleIndex].y + pillH * 0.1 - lineStartY);

  const listStart = Number(items?.[0]?.listStartSeconds);
  const lineProgress = Number.isFinite(listStart)
    ? clamp01((globalSeconds - listStart) / 0.6)
    : 1;

  return (
    <div style={{position: 'relative', paddingLeft: 44 * scale}}>
      <div
        style={{
          position: 'absolute',
          left: lineX,
          top: lineStartY,
          width: lineW,
          height: lineHeight,
          backgroundColor: lineColor,
          transformOrigin: 'top',
          transform: `scaleY(${lineProgress})`,
        }}
      />

      {rows.map((row) => {
        const arrowOpacity = row.p > 0.92 ? 1 : 0;
        return (
          <React.Fragment key={`${row.idx}-${row.label}`}>
            <div
              style={{
                position: 'absolute',
                left: lineX - arrowSize + 1,
                top: row.y - 10 * scale,
                width: 0,
                height: 0,
                borderLeft: `${arrowSize}px solid transparent`,
                borderRight: `${arrowSize}px solid transparent`,
                borderTop: `${arrowSize}px solid ${lineColor}`,
                opacity: arrowOpacity,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: row.y,
                opacity: row.opacity,
                transform: `translate3d(0, ${Math.round(row.translate)}px, 0)`,
              }}
            >
              <ToolPill text={row.label} prefix={row.idx + 1} scale={scale} />
              <div
                style={{
                  marginLeft: 44 * scale,
                  marginTop: 10 * scale,
                  color: '#111827',
                  fontSize: 21 * scale,
                  fontWeight: 500,
                  letterSpacing: 0.2,
                  opacity: 0.92,
                  maxWidth: 780 * scale,
                }}
              >
                {row.subtitle}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const RecapOverlay = ({
  durationInFrames,
  frameOffset = 0,
  scale = 1,
  codexLogo,
  startSeconds,
  samSeconds,
  matAnyoneSeconds,
  remotionSeconds,
  alphaSrc,
}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();

  // `useCurrentFrame()` is composition-global.
  const globalSeconds = frame / Math.max(1, fps);

  // Sequence-local time for fade in/out (so it doesn't "snap" when scrubbing).
  const localFrame = frame - Math.max(0, Math.floor(Number(frameOffset) || 0));
  const localSeconds = localFrame / Math.max(1, fps);
  const dur = Math.max(1, Number(durationInFrames) || 1);

  const fadeIn = 0.35;
  const fadeOut = 0.35;
  const in01 = clamp01(localSeconds / fadeIn);
  const out01 = clamp01((dur / Math.max(1, fps) - localSeconds) / fadeOut);
  const baseOpacity = in01 * out01;

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

      {/* Match existing project UI: status pill + Codex callout */}
      <StatusLeftOverlay text="RECAP" durationInFrames={dur} scale={scale} />
      <CodexCallout text="CODEX" logo={codexLogo} durationInFrames={dur} scale={scale} />

      {/* 1/2/3 list (same pill style as the rest of the project) */}
      <div
        style={{
          position: 'absolute',
          left: 32 * scale,
          top: 132 * scale,
          opacity: 1,
        }}
      >
        <RecapList
          globalSeconds={globalSeconds}
          scale={scale}
          items={[
            {
              label: 'SAM 3',
              subtitle: 'Create a segmentation mask around the person.',
              startSeconds: samSeconds,
              listStartSeconds: startSeconds,
            },
            {
              label: 'MatAnyone',
              subtitle: 'Track that mask across the full video (a matte for every frame).',
              startSeconds: matAnyoneSeconds,
              listStartSeconds: startSeconds,
            },
            {
              label: 'Remotion',
              subtitle: 'Compose layers to create the final effects.',
              startSeconds: remotionSeconds,
              listStartSeconds: startSeconds,
            },
          ]}
        />
      </div>

      {/* Bottom-right PiP: keep it *synced* by offsetting the asset with `startFrom` */}
      <div
        style={{
          position: 'absolute',
          width: pipSize,
          height: pipSize,
          right: pipMargin,
          bottom: pipMargin,
          borderRadius: 26,
          overflow: 'hidden',
          // No "dark/blurred" background; keep it clean on the recap canvas.
          backgroundColor: 'transparent',
          boxShadow: '0 18px 44px rgba(0,0,0,0.18)',
          border: '2px solid rgba(15,23,42,0.10)',
        }}
      >
        <Video
          src={alphaSrc}
          // IMPORTANT: align the alpha.webm to the composition timeline.
          startFrom={Math.max(0, Math.floor(Number(frameOffset) || 0))}
          muted
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.55) translate3d(0, 18px, 0)',
            transformOrigin: '50% 50%',
            // Give the cutout a little separation on white.
            filter: 'drop-shadow(0 14px 26px rgba(0,0,0,0.18))',
          }}
        />
      </div>
    </div>
  );
};

