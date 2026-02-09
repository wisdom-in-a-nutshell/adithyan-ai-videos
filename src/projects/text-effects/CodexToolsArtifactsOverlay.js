import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const Pill = ({text, emoji = null}) => {
  return (
    <div
      style={{
        height: 44,
        padding: '0 16px',
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.92)',
        color: '#111827',
        // Match the general scale used by the top-left status pill.
        fontSize: 21,
        fontWeight: 600,
        letterSpacing: 0.4,
        boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
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
  // If set, fade out the artifacts pill + its connector at this absolute video second.
  // Useful when we want to transition from "Tools -> Artifacts" into another overlay stack.
  artifactsHideSeconds = null,
  toolsText = 'Tools',
  artifactsText = 'Digital artifacts',
  toolsEmoji = '🛠',
  artifactsEmoji = '✨',
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

  const tailFade = (() => {
    if (!Number.isFinite(durationInFrames)) {
      return 1;
    }
    // Fade out over the last quarter-second of the Sequence.
    const tailFrames = Math.max(1, Math.round(0.25 * fps));
    return clamp01((durationInFrames - frame) / tailFrames);
  })();

  const appear = clamp01((t - startSeconds) / 0.35);
  const opacity = interpolate(appear, [0, 1], [0, 1]) * tailFade;
  const slide = interpolate(appear, [0, 1], [10, 0]) * (Number.isFinite(scale) ? scale : 1);

  const resolvedToolsSeconds =
    Number.isFinite(toolsSeconds) ? toolsSeconds : startSeconds;
  const resolvedArtifactsSeconds =
    Number.isFinite(artifactsSeconds) ? artifactsSeconds : resolvedToolsSeconds + 0.4;

  const hasArtifacts =
    typeof artifactsText === 'string' && artifactsText.trim().length > 0;

  const showTools = clamp01((t - resolvedToolsSeconds) / 0.35);
  const showArtifacts = clamp01((t - resolvedArtifactsSeconds) / 0.35);

  const toolsOpacity = interpolate(showTools, [0, 1], [0, 1]);
  const toolsSlide = interpolate(showTools, [0, 1], [10, 0]);
  const artifactsOpacityBase = interpolate(showArtifacts, [0, 1], [0, 1]);
  const artifactsSlide = interpolate(showArtifacts, [0, 1], [12, 0]);
  const artifactsHideMul =
    Number.isFinite(artifactsHideSeconds) && artifactsHideSeconds !== null
      ? 1 - clamp01((t - artifactsHideSeconds) / 0.2)
      : 1;
  const artifactsOpacity = artifactsOpacityBase * artifactsHideMul;

  const left = baseLeft;
  const top = baseTop;

  // Layout: fixed stack under the Codex pill.
  const colX = 0;
  const pillH = 44;
  // Increase vertical spacing for readability (20% more than before).
  const gapY = 44 * 1.2;
  const toolsY = gapY;
  const artifactsY = toolsY + pillH + gapY;
  const lineX = 22;

  const lineColor = 'rgba(59,130,246,0.92)';
  const lineW = 2;
  const arrowSize = 7;

  // Animate the line drawing, aligned with the content coming in.
  const lineToTools = interpolate(showTools, [0, 1], [0, 1]);
  const lineToArtifacts = interpolate(showArtifacts, [0, 1], [0, 1]);

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
  const segment2Start = toolsY + pillH + 6;
  const segment2End = artifactsY - 6;

  // Single flow per overlay instance (the caller should mount a new overlay per stage).
  const dot1 = flowAnim(resolvedToolsSeconds, 0.55, 0, segment1End);
  const dot2 = flowAnim(resolvedArtifactsSeconds, 0.55, segment2Start, segment2End);

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
        width: 'auto',
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
          <Pill text={toolsText} emoji={toolsEmoji} />
        </div>

        {hasArtifacts && artifactsOpacity > 0.001 ? (
          <>
            <div
              style={{
                position: 'absolute',
                left: lineX,
                top: toolsY + pillH,
                width: lineW,
                height: Math.max(0, artifactsY - (toolsY + pillH)),
                backgroundColor: lineColor,
                transformOrigin: 'top',
                transform: `scaleY(${lineToArtifacts})`,
                opacity: artifactsHideMul,
              }}
            />
            <FlowDot y={dot2.y} opacity={dot2.o * artifactsHideMul} />
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
                opacity: (lineToArtifacts > 0.9 ? 1 : 0) * artifactsHideMul,
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
              <Pill text={artifactsText} emoji={artifactsEmoji} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
