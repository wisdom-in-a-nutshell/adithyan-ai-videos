import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const Pill = ({text, emoji = null, minWidthCh = null}) => {
  return (
    <div
      style={{
        padding: '10px 14px',
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.92)',
        color: '#111827',
        // Match the general scale used by the top-left status pill.
        fontSize: 22,
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
      {emoji ? (
        <span style={{display: 'flex', alignItems: 'center', fontSize: 18}}>
          {emoji}
        </span>
      ) : null}
      <span>{text}</span>
    </div>
  );
};

const TOOLS_EMOJI = '🛠';
const ARTIFACTS_EMOJI = '✨';

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

  const FlowDot = ({y, opacity: dotOpacity}) => {
    if (!Number.isFinite(y) || dotOpacity <= 0) {
      return null;
    }
    return (
      <div
        style={{
          position: 'absolute',
          left: lineX - 5,
          top: y - 5,
          width: 10,
          height: 10,
          borderRadius: 999,
          backgroundColor: '#3b82f6',
          boxShadow: '0 0 10px rgba(59,130,246,0.7)',
          opacity: dotOpacity,
        }}
      />
    );
  };

  const flowAnim = (start, length, fromY, toY) => {
    const p = clamp01((t - start) / length);
    const y = interpolate(p, [0, 1], [fromY, toY]);
    const o = interpolate(p, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
    return {y, o};
  };

  const segment1End = toolsY - 6;
  const segment2Start = toolsY + 44 + 6;
  const segment2End = artifactsY - 6;

  // Re-run the "flow" on each narration-driven state transition.
  const f1a = flowAnim(resolvedToolsSeconds, 0.55, 0, segment1End);
  const f1b = flowAnim(resolvedCodingStartSeconds, 0.55, 0, segment1End);
  const f1c = flowAnim(resolvedVideoStartSeconds, 0.55, 0, segment1End);

  const f2a = flowAnim(resolvedArtifactsSeconds, 0.55, segment2Start, segment2End);
  const f2b = flowAnim(resolvedCodingStartSeconds + 0.18, 0.55, segment2Start, segment2End);
  const f2c = flowAnim(resolvedVideoStartSeconds + 0.18, 0.55, segment2Start, segment2End);

  const dot1 = [f1a, f1b, f1c].reduce(
    (acc, cur) => (cur.o > acc.o ? cur : acc),
    {y: 0, o: 0}
  );
  const dot2 = [f2a, f2b, f2c].reduce(
    (acc, cur) => (cur.o > acc.o ? cur : acc),
    {y: 0, o: 0}
  );

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
        <FlowDot y={dot1.y} opacity={dot1.o} />
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
              <Pill text={toolsTextDigital} emoji={TOOLS_EMOJI} minWidthCh={toolsMinWidthCh} />
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
              <Pill text={toolsTextCoding} emoji={TOOLS_EMOJI} minWidthCh={toolsMinWidthCh} />
            </div>
            <div style={{position: 'absolute', top: 0, left: 0, width: '100%', opacity: videoSwap}}>
              <Pill text={toolsTextVideo} emoji={TOOLS_EMOJI} minWidthCh={toolsMinWidthCh} />
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
        <FlowDot y={dot2.y} opacity={dot2.o} />
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
              <Pill text={artifactsTextDigital} emoji={ARTIFACTS_EMOJI} minWidthCh={artifactsMinWidthCh} />
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
              <Pill text={artifactsTextCoding} emoji={ARTIFACTS_EMOJI} minWidthCh={artifactsMinWidthCh} />
            </div>
            <div style={{position: 'absolute', top: 0, left: 0, width: '100%', opacity: videoSwap}}>
              <Pill text={artifactsTextVideo} emoji={ARTIFACTS_EMOJI} minWidthCh={artifactsMinWidthCh} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
