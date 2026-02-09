import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const Pill = ({text, prefix}) => {
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
      }}
    >
      {prefix ? (
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: 999,
            backgroundColor: '#111827',
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
      ) : null}
      <span>{text}</span>
    </div>
  );
};

// Project-scoped overlay for the "three-tools" beat:
// CODEX -> (1) SAM3 -> (2) MatAnyone -> (3) Remotion
export const ThreeToolsOverlay = ({
  startSeconds = 0,
  videoSeconds = null,
  frameOffset = 0,
  scale = 1,
  baseLeft = 32,
  baseTop = 142,
  items = [
    {label: 'SAM3'},
    {label: 'MatAnyone'},
    {label: 'Remotion'},
  ],
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const absoluteFrame = frame + (Number.isFinite(frameOffset) ? frameOffset : 0);
  const t = videoSeconds ?? absoluteFrame / fps;

  const appear = clamp01((t - startSeconds) / 0.35);
  const opacity = interpolate(appear, [0, 1], [0, 1]);
  const slide = interpolate(appear, [0, 1], [10, 0]) * (Number.isFinite(scale) ? scale : 1);

  const left = baseLeft;
  const top = baseTop;

  const pillH = 44;
  const gapY = 44 * 1.2;
  const rowGap = pillH + gapY;
  // This overlay is meant to *continue* below an existing "Video tools" pill.
  // That pill sits at `toolsY`, so we start our numbered list where the next
  // block would normally appear.
  const toolsY = gapY;
  const lineStartY = toolsY + pillH;
  const firstY = toolsY + pillH + gapY;

  const lineX = 22;
  const lineColor = 'rgba(59,130,246,0.92)';
  const lineW = 2;
  const arrowSize = 7;

  const rowAppearStep = 0.38;
  const rows = items.map((item, idx) => {
    const rowStart = startSeconds + idx * rowAppearStep;
    const p = clamp01((t - rowStart) / 0.28);
    return {
      ...item,
      idx,
      p,
      opacity: interpolate(p, [0, 1], [0, 1]),
      translate: interpolate(p, [0, 1], [10, 0]),
      y: firstY + idx * rowGap,
    };
  });

  const lastVisibleIndex = (() => {
    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i].p > 0.05) return i;
    }
    return 0;
  })();

  const lineHeight =
    rows.length === 0
      ? 0
      : Math.max(0, rows[lastVisibleIndex].y + pillH * 0.1 - lineStartY);
  const lineProgress = clamp01((t - startSeconds) / 0.6);

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        transform: `translateY(${slide}px) scale(${Number.isFinite(scale) ? scale : 1})`,
        transformOrigin: 'top left',
        opacity,
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      <div style={{position: 'relative', paddingLeft: 44}}>
        {/* Line continues below the existing "Video tools" pill. */}
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
                  top: row.y - 10,
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
                  transform: `translateY(${row.translate}px)`,
                }}
              >
                <Pill text={row.label} prefix={row.idx + 1} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
