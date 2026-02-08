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
  const slide = interpolate(appear, [0, 1], [10, 0]);

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
  // Nudge Tools down a bit so it reads as a distinct "step" below the CODEX pill.
  const toolsY = 38;
  const artifactsY = toolsY + 92;
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
              <Pill text={toolsTextDigital} />
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: codingSwap * (1 - videoSwap),
              }}
            >
              <Pill text={toolsTextCoding} />
            </div>
            <div style={{position: 'absolute', inset: 0, opacity: videoSwap}}>
              <Pill text={toolsTextVideo} />
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
              <Pill text={artifactsTextDigital} />
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: codingSwap * (1 - videoSwap),
              }}
            >
              <Pill text={artifactsTextCoding} />
            </div>
            <div style={{position: 'absolute', inset: 0, opacity: videoSwap}}>
              <Pill text={artifactsTextVideo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
