import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const Pill = ({text}) => {
  return (
    <div
      style={{
        padding: '10px 14px',
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.92)',
        color: '#111827',
        fontSize: 18,
        fontWeight: 700,
        boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

// Simple, readable "Codex -> Tools -> Artifacts" flow.
// Keep this project-scoped for now; we can generalize later if we reuse it.
export const CodexToolsArtifactsOverlay = ({
  durationInFrames,
  startSeconds = 0,
  videoSeconds = null,
  codingSeconds = null,
  videoToolsSeconds = null,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = videoSeconds ?? frame / fps;

  const appear = clamp01((t - startSeconds) / 0.35);
  const opacity = interpolate(appear, [0, 1], [0, 1]);
  const slide = interpolate(appear, [0, 1], [10, 0]);

  const isVideoMode =
    Number.isFinite(videoToolsSeconds) && t >= videoToolsSeconds ? true : false;

  const toolsText = isVideoMode ? 'Video tools' : 'Coding tools';
  const artifactsText = isVideoMode ? 'Video artifacts' : 'Coding artifacts';

  const left = 48;
  const top = 160;
  const x = 0;
  const codexY = 0;
  const toolsY = 92;
  const artifactsY = 184;
  const lineX = 22;

  const lineColor = 'rgba(59,130,246,0.95)'; // blue-500-ish
  const lineW = 2;
  const arrowSize = 7;

  // Animate the "line from the top" first, then the nodes.
  const line1 = clamp01((t - startSeconds) / 0.55);
  const line2 = clamp01((t - (startSeconds + 0.25)) / 0.55);

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        transform: `translateY(${slide}px)`,
        opacity,
        zIndex: 30,
        width: 520,
        pointerEvents: 'none',
      }}
    >
      <div style={{position: 'relative', paddingLeft: 44}}>
        <div style={{position: 'absolute', left: x, top: codexY}}>
          <Pill text="Codex" />
        </div>

        <div
          style={{
            position: 'absolute',
            left: lineX,
            top: 46,
            width: lineW,
            height: Math.max(0, toolsY - 46),
            backgroundColor: lineColor,
            transformOrigin: 'top',
            transform: `scaleY(${line1})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: lineX - arrowSize + 1,
            top: toolsY - 10,
            width: 0,
            height: 0,
            borderLeft: `${arrowSize}px solid transparent`,
            borderRight: `${arrowSize}px solid transparent`,
            borderTop: `${arrowSize}px solid ${lineColor}`,
            opacity: line1 > 0.9 ? 1 : 0,
          }}
        />

        <div style={{position: 'absolute', left: x, top: toolsY}}>
          <Pill text={toolsText} />
        </div>

        <div
          style={{
            position: 'absolute',
            left: lineX,
            top: toolsY + 46,
            width: lineW,
            height: Math.max(0, artifactsY - (toolsY + 46)),
            backgroundColor: lineColor,
            transformOrigin: 'top',
            transform: `scaleY(${line2})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: lineX - arrowSize + 1,
            top: artifactsY - 10,
            width: 0,
            height: 0,
            borderLeft: `${arrowSize}px solid transparent`,
            borderRight: `${arrowSize}px solid transparent`,
            borderTop: `${arrowSize}px solid ${lineColor}`,
            opacity: line2 > 0.9 ? 1 : 0,
          }}
        />

        <div style={{position: 'absolute', left: x, top: artifactsY}}>
          <Pill text={artifactsText} />
        </div>
      </div>
    </div>
  );
};

