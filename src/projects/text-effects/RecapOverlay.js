import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CodexCallout, StatusLeftOverlay} from '../../overlay_kit/overlays.js';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const ToolPill = ({text, scale, maxWidth}) => {
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
        // Avoid stretching to the full width of any parent container.
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10 * scale,
        maxWidth,
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {text}
      </span>
    </div>
  );
};

const SingleToolCallout = ({
  globalSeconds,
  scale,
  maxWidth,
  yOffset = 0,
  startSeconds,
  endSeconds,
  label,
  description,
}) => {
  const appear = clamp01((globalSeconds - startSeconds) / 0.28);
  const disappear =
    Number.isFinite(endSeconds) && endSeconds !== null
      ? 1 - clamp01((globalSeconds - endSeconds) / 0.22)
      : 1;

  const opacity = interpolate(appear, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }) * disappear;
  const slide = interpolate(appear, [0, 1], [10 * scale, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const baseLeft = 32 * scale;
  const baseTop = 132 * scale + (Number.isFinite(yOffset) ? yOffset : 0);
  const lineX = baseLeft + 22 * scale;
  const lineColor = 'rgba(59,130,246,0.92)';
  const lineW = Math.max(2, Math.round(2 * scale));
  const arrowSize = 7 * scale;

  const pillH = 44 * scale;
  const gapY = 44 * 1.2 * scale;
  const codexBottomY = 88 * scale + 44 * scale; // CodexCallout top + height
  const lineStartY = codexBottomY + 10 * scale;
  const pillY = baseTop + gapY;
  const lineEndY = pillY - 10 * scale;

  const lineProgress = clamp01((globalSeconds - startSeconds) / 0.45);
  const lineHeight = Math.max(0, lineEndY - lineStartY);

  if (opacity <= 0.001) {
    return null;
  }

  return (
    <div style={{position: 'absolute', inset: 0, opacity, pointerEvents: 'none'}}>
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
      <div
        style={{
          position: 'absolute',
          left: lineX - arrowSize + 1,
          top: pillY - 10 * scale,
          width: 0,
          height: 0,
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderTop: `${arrowSize}px solid ${lineColor}`,
          opacity: lineProgress > 0.9 ? 1 : 0,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: baseLeft,
          top: pillY,
          transform: `translate3d(0, ${Math.round(slide)}px, 0)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <ToolPill text={label} scale={scale} maxWidth={maxWidth} />
        <div
          style={{
            marginLeft: 8 * scale,
            marginTop: 12 * scale,
            color: '#111827',
            fontSize: 21 * scale,
            fontWeight: 500,
            letterSpacing: 0.2,
            opacity: 0.92,
            maxWidth,
          }}
        >
          {description}
        </div>
      </div>
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
  sam3Url,
  matAnyoneUrl,
  remotionUrl,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // Inside a <Sequence from={...}>, `useCurrentFrame()` is already sequence-local.
  // We compute global seconds by adding the Sequence's `from` frame.
  const globalSeconds = (frame + Math.max(0, Math.floor(Number(frameOffset) || 0))) / Math.max(1, fps);
  const localSeconds = frame / Math.max(1, fps);
  const dur = Math.max(1, Number(durationInFrames) || 1);

  const fadeIn = 0.35;
  const fadeOut = 0.35;
  const in01 = clamp01(localSeconds / fadeIn);
  const out01 = clamp01((dur / Math.max(1, fps) - localSeconds) / fadeOut);
  const baseOpacity = in01 * out01;

  const activeLink = (() => {
    if (Number.isFinite(remotionSeconds) && globalSeconds >= remotionSeconds) {
      return remotionUrl;
    }
    if (Number.isFinite(matAnyoneSeconds) && globalSeconds >= matAnyoneSeconds) {
      return matAnyoneUrl;
    }
    return sam3Url;
  })();

  // A simple bottom pill reused across all 3 tools.
  const linksText = activeLink ? activeLink : 'Links + code: check description';
  const linksPillH = Math.round(46 * scale);
  const linksBottom = Math.round(height * 0.055);
  // Keep the title pill reasonably narrow so it doesn't dominate the frame.
  const contentMaxW = Math.round(width * 0.3);
  const linksMaxW = Math.round(width * 0.86);
  // Extra breathing room for the recap section so the description doesn't collide with the background.
  const calloutYOffset = 22 * scale;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 200,
        opacity: baseOpacity,
        pointerEvents: 'none',
      }}
    >
      {/* Match existing project UI: status pill + Codex callout */}
      <StatusLeftOverlay text="ANIMATING" durationInFrames={dur} scale={scale} />
      <CodexCallout text="CODEX" logo={codexLogo} durationInFrames={dur} scale={scale} />

      {/* Simple recap: one tool at a time. For now: SAM3 only. */}
      <SingleToolCallout
        globalSeconds={globalSeconds}
        scale={scale}
        maxWidth={contentMaxW}
        yOffset={calloutYOffset}
        startSeconds={samSeconds}
        endSeconds={matAnyoneSeconds - 0.08}
        label="SAM 3"
        description="Create a static mask around the person."
      />

      <SingleToolCallout
        globalSeconds={globalSeconds}
        scale={scale}
        maxWidth={contentMaxW}
        yOffset={calloutYOffset}
        startSeconds={matAnyoneSeconds}
        endSeconds={remotionSeconds - 0.08}
        label="MatAnyone"
        description="Stable matting with consistent video propagation."
      />

      <SingleToolCallout
        globalSeconds={globalSeconds}
        scale={scale}
        maxWidth={contentMaxW}
        yOffset={calloutYOffset}
        startSeconds={remotionSeconds}
        endSeconds={null}
        label="Remotion"
        description="Make videos programmatically. Create real MP4 videos with React."
      />

      {/* Bottom hint pill */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: linksBottom,
          transform: 'translate3d(-50%, 0, 0)',
          height: linksPillH,
          width: 'fit-content',
          maxWidth: linksMaxW,
          padding: `0 ${16 * scale}px`,
          borderRadius: 999,
          backgroundColor: 'rgba(0,0,0,0.65)',
          color: '#fff',
          fontSize: 20 * scale,
          fontWeight: 600,
          letterSpacing: 0.6,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
          zIndex: 220,
        }}
      >
        <span
          style={{
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textDecorationLine: 'underline',
            textDecorationThickness: Math.max(2, Math.round(2 * scale)),
            textUnderlineOffset: 6 * scale,
            textDecorationColor: 'rgba(59,130,246,0.85)',
          }}
        >
          {linksText}
        </span>
      </div>
    </div>
  );
};
