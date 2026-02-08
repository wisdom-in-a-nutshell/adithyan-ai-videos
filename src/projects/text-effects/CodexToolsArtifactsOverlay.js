import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const Pill = ({text, icon = null, minWidthCh = null}) => {
  return (
    <div
      style={{
        padding: '10px 14px',
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.92)',
        color: '#111827',
        // Match the general scale used by the top-left status pill.
        fontSize: 20,
        fontWeight: 600,
        letterSpacing: 0.6,
        boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minWidth: minWidthCh ? `${minWidthCh}ch` : undefined,
      }}
    >
      {icon ? <span style={{display: 'flex', alignItems: 'center'}}>{icon}</span> : null}
      <span>{text}</span>
    </div>
  );
};

const ToolsIcon = ({size = 18, color = '#111827'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M14.5 6.5a4.5 4.5 0 0 0 6 6L14 19l-3 0 0-3L17.5 9.5a4.5 4.5 0 0 1-3-3z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <path
      d="M10 20l-2 2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ArtifactsIcon = ({size = 18, color = '#111827'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2l1.2 4.2L17 7.4l-3.8 1.2L12 13l-1.2-4.4L7 7.4l3.8-1.2L12 2z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M6 14l.7 2.3L9 17l-2.3.7L6 20l-.7-2.3L3 17l2.3-.7L6 14z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

// Project-scoped overlay:
// A clean line coming "from Codex" and staging:
// 1) Tools -> Digital artifacts
// 2) Coding tools -> Coding artifacts
// 3) Video tools -> Video artifacts
export const CodexToolsArtifactsOverlay = ({
  durationInFrames,
  startSeconds = 0,
  toolsSeconds = null,
  artifactsSeconds = null,
  codingStartSeconds = null,
  videoStartSeconds = null,
  videoSeconds = null,
  // `useCurrentFrame()` is relative to the nearest <Sequence>.
  // Pass the sequence `from` frame to compute absolute (composition) time.
  frameOffset = 0,
  scale = 1,
  // Align with the existing Codex callout pill (top: 88px, left: 32px, height: ~44px).
  baseLeft = 32,
  baseTop = 142,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const absoluteFrame = frame + (Number.isFinite(frameOffset) ? frameOffset : 0);
  const t = videoSeconds ?? absoluteFrame / fps;

  const appear = clamp01((t - startSeconds) / 0.35);
  const opacity = interpolate(appear, [0, 1], [0, 1]);
  const slide = interpolate(appear, [0, 1], [10, 0]) * (Number.isFinite(scale) ? scale : 1);

  const resolvedToolsSeconds =
    Number.isFinite(toolsSeconds) ? toolsSeconds : startSeconds;
  const resolvedArtifactsSeconds =
    Number.isFinite(artifactsSeconds) ? artifactsSeconds : resolvedToolsSeconds + 0.4;
  const resolvedCodingStartSeconds =
    Number.isFinite(codingStartSeconds) ? codingStartSeconds : startSeconds + 2.0;
  const resolvedVideoStartSeconds =
    Number.isFinite(videoStartSeconds) ? videoStartSeconds : resolvedCodingStartSeconds + 4.0;

  // Smooth text swap on stage boundaries.
  const swapDur = 0.35;
  const codingSwap = clamp01((t - resolvedCodingStartSeconds) / swapDur);
  const videoSwap = clamp01((t - resolvedVideoStartSeconds) / swapDur);

  const showTools = clamp01((t - resolvedToolsSeconds) / 0.35);
  const showArtifacts = clamp01((t - resolvedArtifactsSeconds) / 0.35);

  const toolsOpacity = interpolate(showTools, [0, 1], [0, 1]);
  const toolsSlide = interpolate(showTools, [0, 1], [10, 0]);
  const artifactsOpacity = interpolate(showArtifacts, [0, 1], [0, 1]);
  const artifactsSlide = interpolate(showArtifacts, [0, 1], [12, 0]);

  const left = baseLeft;
  const top = baseTop;

  // Layout: fixed stack under the Codex pill.
  const colX = 0;
  // Equal vertical rhythm between Codex -> Tools -> Artifacts.
  const stepY = 104;
  const toolsY = stepY;
  const artifactsY = stepY * 2;
  const lineX = 22;

  const lineColor = 'rgba(59,130,246,0.92)';
  const lineW = 2;
  const arrowSize = 7;

  // Animate the line drawing, aligned with the content coming in.
  const lineToTools = interpolate(showTools, [0, 1], [0, 1]);
  const lineToArtifacts = interpolate(showArtifacts, [0, 1], [0, 1]);

  // Crossfade labels while keeping a single pill per node.
  const toolsTextDigital = 'Tools';
  const toolsTextCoding = 'Coding tools';
  const toolsTextVideo = 'Video tools';

  const artifactsTextDigital = 'Digital artifacts';
  const artifactsTextCoding = 'Coding artifacts';
  const artifactsTextVideo = 'Video artifacts';

  const toolsMinWidthCh = Math.max(toolsTextDigital.length, toolsTextCoding.length, toolsTextVideo.length) + 4;
  const artifactsMinWidthCh =
    Math.max(artifactsTextDigital.length, artifactsTextCoding.length, artifactsTextVideo.length) + 4;

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
        width: 520,
        pointerEvents: 'none',
      }}
    >
      <div style={{position: 'relative', paddingLeft: 44}}>
        {/* Line originates "from Codex" (Codex pill above this overlay). */}
        <div
          style={{
            position: 'absolute',
            left: lineX,
            top: 0,
            width: lineW,
            height: Math.max(0, toolsY),
            backgroundColor: lineColor,
            transformOrigin: 'top',
            transform: `scaleY(${lineToTools})`,
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
            opacity: lineToTools > 0.9 ? 1 : 0,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: colX,
            top: toolsY,
            opacity: toolsOpacity,
            transform: `translateY(${toolsSlide}px)`,
          }}
        >
          <div style={{position: 'relative'}}>
            <div style={{opacity: 1 - codingSwap}}>
              <Pill text={toolsTextDigital} icon={<ToolsIcon />} minWidthCh={toolsMinWidthCh} />
            </div>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                opacity: codingSwap * (1 - videoSwap),
              }}
            >
              <Pill text={toolsTextCoding} icon={<ToolsIcon />} minWidthCh={toolsMinWidthCh} />
            </div>
            <div style={{position: 'absolute', top: 0, left: 0, width: '100%', opacity: videoSwap}}>
              <Pill text={toolsTextVideo} icon={<ToolsIcon />} minWidthCh={toolsMinWidthCh} />
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: lineX,
            top: toolsY + 44,
            width: lineW,
            height: Math.max(0, artifactsY - (toolsY + 44)),
            backgroundColor: lineColor,
            transformOrigin: 'top',
            transform: `scaleY(${lineToArtifacts})`,
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
            opacity: lineToArtifacts > 0.9 ? 1 : 0,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: colX,
            top: artifactsY,
            opacity: artifactsOpacity,
            transform: `translateY(${artifactsSlide}px)`,
          }}
        >
          {/* Artifacts pill swaps with the narration. */}
          <div style={{position: 'relative'}}>
            <div style={{opacity: 1 - codingSwap}}>
              <Pill text={artifactsTextDigital} icon={<ArtifactsIcon />} minWidthCh={artifactsMinWidthCh} />
            </div>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                opacity: codingSwap * (1 - videoSwap),
              }}
            >
              <Pill text={artifactsTextCoding} icon={<ArtifactsIcon />} minWidthCh={artifactsMinWidthCh} />
            </div>
            <div style={{position: 'absolute', top: 0, left: 0, width: '100%', opacity: videoSwap}}>
              <Pill text={artifactsTextVideo} icon={<ArtifactsIcon />} minWidthCh={artifactsMinWidthCh} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
