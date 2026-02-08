import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const SubPill = ({text}) => {
  return (
    <div
      style={{
        padding: '10px 14px',
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.92)',
        color: '#111827',
        fontSize: 16,
        fontWeight: 650,
        boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

const HeaderPill = ({text}) => {
  return (
    <div
      style={{
        padding: '10px 14px',
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.92)',
        color: '#ef4444',
        fontSize: 28,
        fontWeight: 900,
        letterSpacing: 0.2,
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
  // Align with the existing Codex callout pill (top: 88px, left: 32px, height: ~44px).
  baseLeft = 32,
  baseTop = 142,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = videoSeconds ?? frame / fps;

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

  const stage =
    t >= resolvedVideoStartSeconds ? 'video' : t >= resolvedCodingStartSeconds ? 'coding' : 'digital';

  const toolsSub = stage === 'video' ? 'Video tools' : stage === 'coding' ? 'Coding tools' : 'Tools';
  const artifactsHeader =
    stage === 'video'
      ? 'Video artifacts'
      : stage === 'coding'
        ? 'Coding artifacts'
        : 'Digital artifacts';

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
  const toolsY = 18;
  const toolsSubY = toolsY + 58;
  const artifactsY = toolsSubY + 86;
  const lineX = 22;

  const lineColor = 'rgba(59,130,246,0.92)';
  const lineW = 2;
  const arrowSize = 7;

  // Animate the line drawing, aligned with the content coming in.
  const lineToTools = interpolate(showTools, [0, 1], [0, 1]);
  const lineToArtifacts = interpolate(showArtifacts, [0, 1], [0, 1]);

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
          <HeaderPill text="Tools" />
        </div>

        <div
          style={{
            position: 'absolute',
            left: lineX,
            top: toolsSubY + 40,
            width: lineW,
            height: Math.max(0, artifactsY - (toolsSubY + 40)),
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
            top: toolsSubY,
            opacity: toolsOpacity,
            transform: `translateY(${toolsSlide}px)`,
          }}
        >
          {/* Crossfade between stages for the "tools" sub-label. */}
          <div style={{position: 'relative'}}>
            <div style={{opacity: 1 - codingSwap}}>
              <SubPill text="Tools" />
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: codingSwap * (1 - videoSwap),
              }}
            >
              <SubPill text="Coding tools" />
            </div>
            <div style={{position: 'absolute', inset: 0, opacity: videoSwap}}>
              <SubPill text="Video tools" />
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: colX,
            top: artifactsY,
            opacity: artifactsOpacity,
            transform: `translateY(${artifactsSlide}px)`,
          }}
        >
          {/* Artifacts header swaps with the narration. */}
          <div style={{position: 'relative'}}>
            <div style={{opacity: 1 - codingSwap}}>
              <HeaderPill text="Digital artifacts" />
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: codingSwap * (1 - videoSwap),
              }}
            >
              <HeaderPill text="Coding artifacts" />
            </div>
            <div style={{position: 'absolute', inset: 0, opacity: videoSwap}}>
              <HeaderPill text="Video artifacts" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
