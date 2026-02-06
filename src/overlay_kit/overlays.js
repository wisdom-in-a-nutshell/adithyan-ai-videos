import React, {useMemo} from 'react';
import {Img, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {SKETCH_STROKE_FILTER} from '../styles/sketch.js';
import {getRoughPaths, ROUGH_STYLE, ROUGH_BOX_STYLE, roughGenerator} from './rough.js';

const lerp = (a, b, t) => a + (b - a) * t;

const getBottomRightRect = (rect, outputW, outputH, margin = 80) => {
  if (!rect) {
    return null;
  }
  return {
    x: outputW - rect.width - margin,
    y: outputH - rect.height - margin,
    width: rect.width,
    height: rect.height,
  };
};

const useFadeOpacity = (durationInFrames) => {
  const frame = useCurrentFrame();
  const fade = Math.max(1, Math.min(12, Math.floor(durationInFrames / 4)));
  return interpolate(
    frame,
    [0, fade, durationInFrames - fade, durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
};

const TitleOverlay = ({text, subtext, logo, durationInFrames, scale}) => {
  const opacity = 1;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(12, Math.round(fps * 0.6))], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const lift = -32 * scale;
  const cardY = interpolate(progress, [0, 1], [18 * scale, 0]) + lift;
  const cardScale = interpolate(progress, [0, 1], [0.98, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div
        style={{
          transform: `translateY(${cardY}px) scale(${cardScale})`,
          padding: `${28 * scale}px ${36 * scale}px`,
          borderRadius: 24 * scale,
          background:
            'linear-gradient(135deg, rgba(15,23,42,0.88), rgba(2,6,23,0.88))',
          color: '#fff',
          textAlign: 'left',
          boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
          backdropFilter: 'blur(12px)',
          minWidth: 520 * scale,
          maxWidth: 860 * scale,
        }}
      >
        <div
          style={{
            height: 6 * scale,
            width: 120 * scale,
            borderRadius: 999,
            background: 'linear-gradient(90deg, #22d3ee, #6366f1)',
            marginBottom: 18 * scale,
            boxShadow: '0 0 16px rgba(99,102,241,0.55)',
          }}
        />
        <div style={{display: 'flex', alignItems: 'center', gap: 14 * scale}}>
          {logo ? (
            <Img
              src={logo}
              style={{
                width: 32 * scale,
                height: 32 * scale,
                objectFit: 'contain',
              }}
            />
          ) : null}
          <div
            style={{
              fontSize: 54 * scale,
              fontWeight: 700,
              letterSpacing: -0.5,
            }}
          >
            {text}
          </div>
        </div>
        {subtext ? (
          <div
            style={{
              fontSize: 26 * scale,
              marginTop: 12 * scale,
              opacity: 0.86,
              fontWeight: 500,
            }}
          >
            {subtext}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const IntroTitleOverlay = ({
  text,
  subtext,
  logo,
  durationInFrames,
  scale,
  currentTime,
}) => {
  const opacity = useFadeOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const {fps, width: outputW, height: outputH} = useVideoConfig();
  const boxSize = Math.round(outputW * 0.28);
  const margin = 24 * scale;
  const leftAreaWidth = outputW - (boxSize + margin * 2);
  const counterProgress = interpolate(
    frame,
    [0, Math.round(0.6 * fps)],
    [0, 1],
    {extrapolateRight: 'clamp'}
  );
  const count = Math.round(counterProgress * 100);
  const stampScale = interpolate(
    frame,
    [Math.round(0.3 * fps), Math.round(0.6 * fps)],
    [0.6, 1],
    {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}
  );
  const underlineProgress = interpolate(
    frame,
    [Math.round(0.2 * fps), Math.round(0.7 * fps)],
    [0, 1],
    {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}
  );
  const includeStart = 2.5;
  const includeOpacity = interpolate(
    currentTime ?? 0,
    [includeStart - 0.1, includeStart + 0.25],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const includeProgress = interpolate(
    currentTime ?? 0,
    [includeStart, includeStart + 0.5],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const arrowStartX = margin + leftAreaWidth / 2;
  const arrowStartY = 110 * scale;
  const arrowColor = '#6366f1';
  const arrowEndX = outputW - margin - boxSize / 2;
  const arrowEndY = outputH - margin - boxSize - 18 * scale;
  const arrowC2X = arrowEndX - 120 * scale;
  const arrowC2Y = arrowEndY - 120 * scale;
  const textEndX = arrowStartX;
  const textEndY = outputH / 2 - 130 * scale;
  const arrowAngle = Math.atan2(arrowEndY - arrowC2Y, arrowEndX - arrowC2X);
  const textAngle = Math.atan2(textEndY - arrowStartY, textEndX - arrowStartX);
  const arrowHeadSize = 8 * scale;
  const roughArrowPath = useMemo(() => {
    const c1x = arrowStartX + 140 * scale;
    const c1y = arrowStartY + 20 * scale;
    const path = `M ${arrowStartX} ${arrowStartY} C ${c1x} ${c1y}, ${arrowC2X} ${arrowC2Y}, ${arrowEndX} ${arrowEndY}`;
    return roughGenerator.toPaths(roughGenerator.path(path, ROUGH_BOX_STYLE))[0];
  }, [arrowStartX, arrowStartY, arrowEndX, arrowEndY, arrowC2X, arrowC2Y, scale]);
  const roughTextArrowPath = useMemo(() => {
    const path = `M ${arrowStartX} ${arrowStartY} L ${textEndX} ${textEndY}`;
    return roughGenerator.toPaths(roughGenerator.path(path, ROUGH_BOX_STYLE))[0];
  }, [arrowStartX, arrowStartY, textEndX, textEndY]);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <div
        style={{
          color: '#111111',
          textAlign: 'center',
          opacity,
          width: '100%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: margin,
            width: leftAreaWidth,
            top: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10 * scale,
            }}
          >
            <div style={{fontSize: 72 * scale, fontWeight: 700, lineHeight: 1}}>
              {count}% edited by
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12 * scale,
                position: 'relative',
              }}
            >
              {logo ? (
                <Img
                  src={logo}
                  style={{
                    width: 44 * scale,
                    height: 44 * scale,
                    objectFit: 'contain',
                    transform: `scale(${stampScale})`,
                    transformOrigin: 'center center',
                  }}
                />
              ) : null}
              <span
                style={{
                  fontSize: 80 * scale,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                Codex
              </span>
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: -10 * scale,
                  height: 6 * scale,
                  background: 'linear-gradient(90deg, #22d3ee, #6366f1)',
                  borderRadius: 999,
                  transformOrigin: 'left center',
                  transform: `scaleX(${underlineProgress})`,
                }}
              />
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              top: 70 * scale,
              left: margin,
              width: leftAreaWidth,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8 * scale,
              opacity: includeOpacity,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
              fontSize: 21.6 * scale,
                fontWeight: 700,
              color: arrowColor,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Including this
          </div>
          </div>
        </div>
      </div>
      <svg
        width={outputW}
        height={outputH}
        viewBox={`0 0 ${outputW} ${outputH}`}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: includeOpacity,
          pointerEvents: 'none',
        }}
      >
        <path
          d={roughArrowPath?.d}
          fill="none"
          stroke={arrowColor}
          strokeWidth={ROUGH_BOX_STYLE.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - includeProgress}
          filter={SKETCH_STROKE_FILTER}
        />
        <path
          d={`M ${arrowEndX} ${arrowEndY} L ${arrowEndX - Math.cos(arrowAngle - Math.PI / 6) * arrowHeadSize} ${arrowEndY - Math.sin(arrowAngle - Math.PI / 6) * arrowHeadSize} L ${arrowEndX - Math.cos(arrowAngle + Math.PI / 6) * arrowHeadSize} ${arrowEndY - Math.sin(arrowAngle + Math.PI / 6) * arrowHeadSize} Z`}
          fill={arrowColor}
          opacity={includeProgress > 0.9 ? 1 : 0}
          filter={SKETCH_STROKE_FILTER}
        />
        <path
          d={roughTextArrowPath?.d}
          fill="none"
          stroke={arrowColor}
          strokeWidth={ROUGH_BOX_STYLE.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - includeProgress}
          filter={SKETCH_STROKE_FILTER}
        />
        <path
          d={`M ${textEndX} ${textEndY} L ${textEndX - Math.cos(textAngle - Math.PI / 6) * arrowHeadSize} ${textEndY - Math.sin(textAngle - Math.PI / 6) * arrowHeadSize} L ${textEndX - Math.cos(textAngle + Math.PI / 6) * arrowHeadSize} ${textEndY - Math.sin(textAngle + Math.PI / 6) * arrowHeadSize} Z`}
          fill={arrowColor}
          opacity={includeProgress > 0.9 ? 1 : 0}
          filter={SKETCH_STROKE_FILTER}
        />
      </svg>
    </div>
  );
};

const SubtitleOverlay = ({text, durationInFrames, scale}) => {
  const opacity = useFadeOpacity(durationInFrames);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 32 * scale,
        fontWeight: 600,
        textAlign: 'center',
        opacity,
      }}
    >
      {text}
    </div>
  );
};

const LabelOverlay = ({text, durationInFrames, scale}) => {
  const opacity = useFadeOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const blink = Math.floor(frame / (fps * 0.5)) % 2 === 0;
  const pillHeight = 44 * scale;
  const labelFontSize = 23 * scale;
  return (
    <div
      style={{
        position: 'absolute',
        top: 32 * scale,
        left: 32 * scale,
        height: pillHeight,
        padding: `${10 * scale}px ${16 * scale}px`,
        borderRadius: 999,
        backgroundColor: 'rgba(0,0,0,0.65)',
        color: '#fff',
        fontSize: labelFontSize,
        fontWeight: 600,
        letterSpacing: 1,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 10 * scale,
        position: 'absolute',
      }}
    >
      <span
        style={{
          width: 10 * scale,
          height: 10 * scale,
          borderRadius: 999,
          backgroundColor: '#ff4d4f',
          boxShadow: '0 0 8px rgba(255,77,79,0.85)',
          opacity: blink ? 1 : 0.2,
        }}
      />
      {text}
    </div>
  );
};

const CodexCallout = ({text, logo, durationInFrames, scale}) => {
  const opacity = useFadeOpacity(durationInFrames);
  const pillHeight = 44 * scale;
  const labelFontSize = 21 * scale;
  return (
    <div
      style={{
        position: 'absolute',
        top: 88 * scale,
        left: 32 * scale,
        height: pillHeight,
        padding: `${10 * scale}px ${16 * scale}px`,
        borderRadius: 16 * scale,
        backgroundColor: 'rgba(255,255,255,0.92)',
        color: '#1a1a1a',
        fontSize: labelFontSize,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 10 * scale,
        boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
        opacity,
        zIndex: 20,
      }}
    >
      {logo ? (
        <Img
          src={logo}
          style={{
            width: 22 * scale,
            height: 22 * scale,
            objectFit: 'contain',
          }}
        />
      ) : null}
      {text}
    </div>
  );
};

const CoordsOverlay = ({text, rect, durationInFrames, scale}) => {
  const opacity = useFadeOpacity(durationInFrames);
  const coordsText =
    rect && !text
      ? `bbox: (${Math.round(rect.x)}, ${Math.round(rect.y)}) → (${Math.round(
          rect.x + rect.width
        )}, ${Math.round(rect.y + rect.height)})`
      : text;
  return (
    <div
      style={{
        position: 'absolute',
        top: 48 * scale,
        right: 32 * scale,
        padding: `${10 * scale}px ${16 * scale}px`,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.65)',
        color: '#fff',
        fontSize: 16 * scale,
        opacity,
      }}
    >
      {coordsText}
    </div>
  );
};

const EndpointsOverlay = ({rect, durationInFrames, scale}) => {
  if (!rect) {
    return null;
  }
  const points = [
    {x: rect.x, y: rect.y},
    {x: rect.x + rect.width, y: rect.y},
    {x: rect.x, y: rect.y + rect.height},
    {x: rect.x + rect.width, y: rect.y + rect.height},
  ];
  const labels = ['TL', 'TR', 'BL', 'BR'];
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {points.map((point, index) => (
        <div key={index}>
          <div
            style={{
              position: 'absolute',
              width: 16 * scale,
              height: 16 * scale,
              borderRadius: 999,
              backgroundColor: 'rgba(0,0,0,0.0)',
              border: `${2 * scale}px solid rgba(255,255,255,0.85)`,
              left: point.x - 8 * scale,
              top: point.y - 8 * scale,
              boxShadow: '0 0 8px rgba(255,255,255,0.35)',
              filter: SKETCH_STROKE_FILTER,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: point.x + 12 * scale,
              top: point.y + 8 * scale,
              fontSize: 14 * scale,
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 700,
              textShadow: '0 0 10px rgba(0,0,0,0.5)',
            }}
          >
            {labels[index]}
          </div>
        </div>
      ))}
    </div>
  );
};

const BoxOverlay = ({rect, target, durationInFrames}) => {
  const frame = useCurrentFrame();
  if (!rect) {
    return null;
  }
  const progress = target
    ? interpolate(frame, [0, durationInFrames], [0, 1], {
        extrapolateRight: 'clamp',
      })
    : 0;

  const current = target
    ? {
        x: lerp(rect.x, target.x, progress),
        y: lerp(rect.y, target.y, progress),
        width: lerp(rect.width, target.width, progress),
        height: lerp(rect.height, target.height, progress),
      }
    : rect;

  const paths = useMemo(
    () => getRoughPaths(current.width, current.height, ROUGH_BOX_STYLE),
    [current.width, current.height]
  );

  return (
    <svg
      width={current.width}
      height={current.height}
      style={{
        position: 'absolute',
        left: current.x,
        top: current.y,
        overflow: 'visible',
      }}
    >
      {paths.map((path, index) => (
        <path
          key={index}
          d={path.d}
          fill="none"
          stroke={ROUGH_BOX_STYLE.stroke}
          strokeWidth={ROUGH_BOX_STYLE.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={SKETCH_STROKE_FILTER}
        />
      ))}
    </svg>
  );
};

const DrawBoxOverlay = ({rect, durationInFrames}) => {
  const frame = useCurrentFrame();
  if (!rect) {
    return null;
  }
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const segments = useMemo(() => {
    const x0 = 0;
    const y0 = rect.height;
    const x1 = 0;
    const y1 = 0;
    const x2 = rect.width;
    const y2 = 0;
    const x3 = rect.width;
    const y3 = rect.height;

    return [
      {from: {x: x0, y: y0}, to: {x: x1, y: y1}}, // BL -> TL
      {from: {x: x1, y: y1}, to: {x: x2, y: y2}}, // TL -> TR
      {from: {x: x2, y: y2}, to: {x: x3, y: y3}}, // TR -> BR
      {from: {x: x3, y: y3}, to: {x: x0, y: y0}}, // BR -> BL
    ];
  }, [rect.x, rect.y, rect.width, rect.height]);

  const roughLines = useMemo(
    () =>
      segments.map((segment) =>
        roughGenerator.toPaths(
          roughGenerator.line(
            segment.from.x,
            segment.from.y,
            segment.to.x,
            segment.to.y,
            ROUGH_BOX_STYLE
          )
        )[0]
      ),
    [segments]
  );

  return (
    <svg
      width={rect.width}
      height={rect.height}
      style={{
        position: 'absolute',
        left: rect.x,
        top: rect.y,
        overflow: 'visible',
      }}
    >
      {segments.map((segment, index) => {
        const segmentLength = Math.hypot(
          segment.to.x - segment.from.x,
          segment.to.y - segment.from.y
        );
        const segmentProgress = Math.min(1, Math.max(0, progress * 4 - index));
        const dashOffset = segmentLength * (1 - segmentProgress);
        const path = roughLines[index];
        return (
          <path
            key={index}
            d={path?.d}
            fill="none"
            stroke={ROUGH_BOX_STYLE.stroke}
            strokeWidth={ROUGH_BOX_STYLE.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={segmentLength}
            strokeDasharray={segmentLength}
            strokeDashoffset={dashOffset}
            filter={SKETCH_STROKE_FILTER}
          />
        );
      })}
    </svg>
  );
};

const ToolListOverlay = ({items, durationInFrames, scale}) => {
  const opacity = useFadeOpacity(durationInFrames);
  return (
    <div
      style={{
        position: 'absolute',
        left: 80 * scale,
        bottom: 140 * scale,
        padding: `${24 * scale}px ${32 * scale}px`,
        borderRadius: 18 * scale,
        backgroundColor: 'rgba(0,0,0,0.65)',
        color: '#fff',
        fontSize: 22 * scale,
        lineHeight: 1.4,
        opacity,
      }}
    >
      <div style={{fontWeight: 700, marginBottom: 12 * scale}}>Tools</div>
      {items.map((item) => (
        <div key={item}>• {item}</div>
      ))}
    </div>
  );
};

const ArrowDown = ({progress, scale}) => {
  const stroke = '#3b82f6';
  const length = 22 * scale;
  const headSize = 6 * scale;
  const dashOffset = length * (1 - progress);
  return (
    <svg
      width={24 * scale}
      height={28 * scale}
      viewBox="0 0 24 28"
      style={{display: 'block'}}
    >
      <line
        x1="12"
        y1="2"
        x2="12"
        y2={2 + length}
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={dashOffset}
      />
      <polyline
        points={`6,${2 + length - headSize} 12,${2 + length} 18,${
          2 + length - headSize
        }`}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={progress > 0.85 ? 1 : 0}
      />
    </svg>
  );
};

const ArrowRight = ({progress, scale}) => {
  const stroke = '#3b82f6';
  const length = 28 * scale;
  const headSize = 6 * scale;
  const dashOffset = length * (1 - progress);
  return (
    <svg
      width={32 * scale}
      height={16 * scale}
      viewBox="0 0 32 16"
      style={{display: 'block'}}
    >
      <line
        x1="2"
        y1="8"
        x2={2 + length}
        y2="8"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={dashOffset}
      />
      <polyline
        points={`${2 + length - headSize},4 ${2 + length},8 ${2 + length - headSize},12`}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={progress > 0.85 ? 1 : 0}
      />
    </svg>
  );
};

const TranscriptionIcon = ({size, stroke}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="16" rx="3" stroke={stroke} />
    <path d="M7 9h10" stroke={stroke} strokeLinecap="round" />
    <path d="M7 13h6" stroke={stroke} strokeLinecap="round" />
  </svg>
);

const SpeakerIcon = ({size, stroke}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="10" r="3" stroke={stroke} />
    <path d="M4 19c0-2.5 2.2-4 5-4s5 1.5 5 4" stroke={stroke} />
    <path d="M17 9c1 .8 1.6 2 1.6 3.4" stroke={stroke} strokeLinecap="round" />
    <path d="M19.5 7.5c1.5 1.3 2.5 3.1 2.5 5.4" stroke={stroke} strokeLinecap="round" />
  </svg>
);

const RemotionIcon = ({size, stroke}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" stroke={stroke} />
    <path d="M10 9l6 3-6 3V9z" stroke={stroke} strokeLinejoin="round" />
  </svg>
);

const ClockIcon = ({size, stroke}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" stroke={stroke} />
    <path d="M12 7v5l3 2" stroke={stroke} strokeLinecap="round" />
  </svg>
);

const CloudIcon = ({size, stroke}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M7 16h9a3 3 0 0 0 0-6 4.5 4.5 0 0 0-8.7 1.4A2.5 2.5 0 0 0 7 16z"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChatIcon = ({size, stroke}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 6h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
      stroke={stroke}
      strokeLinejoin="round"
    />
  </svg>
);

const TOOL_ICON_MAP = {
  transcription: TranscriptionIcon,
  speaker: SpeakerIcon,
  remotion: RemotionIcon,
  clock: ClockIcon,
  cloud: CloudIcon,
  chat: ChatIcon,
};

const ToolFlowOverlay = ({items, durationInFrames, scale, currentTime}) => {
  const {height: outputH} = useVideoConfig();
  const blockGap = 26 * scale;
  const arrowGap = 12 * scale;
  const iconSize = 24 * scale;
  const numberSize = 28 * scale;
  const baseX = 48 * scale;
  const textColor = '#111827';
  const rowDuration = 0.35;
  const arrowDuration = 0.5;
  const opacity = 1;
  const arrowHeight = 28 * scale;
  const rowHeight = 40 * scale;
  const blockHeight = arrowHeight + arrowGap + rowHeight;
  const totalStackHeight =
    items.length * blockHeight + Math.max(0, items.length - 1) * blockGap;
  const minY = 160 * scale;
  const maxY = outputH - totalStackHeight - 120 * scale;
  const centeredY = (outputH - totalStackHeight) * 0.38;
  const baseY = Math.max(minY, Math.min(maxY, centeredY));

  return (
    <div
      style={{
        position: 'absolute',
        left: baseX,
        top: baseY,
        zIndex: 20,
        opacity,
        width: 560 * scale,
        display: 'flex',
        flexDirection: 'column',
        gap: blockGap,
      }}
    >
      {items.map((item, index) => {
        const start = item.start ?? 0;
        const arrowProgress = Math.min(
          1,
          Math.max(0, (currentTime - start) / arrowDuration)
        );
        const rowProgress = Math.min(
          1,
          Math.max(0, (currentTime - (start + arrowDuration * 0.6)) / rowDuration)
        );
        const rowOpacity = rowProgress;
        const rowTranslate = interpolate(rowProgress, [0, 1], [8 * scale, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const Icon = TOOL_ICON_MAP[item.icon] || TranscriptionIcon;

        return (
          <div key={item.label} style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{marginLeft: 6 * scale, height: arrowHeight}}>
              <ArrowDown progress={arrowProgress} scale={scale} />
            </div>
            <div
              style={{
                marginTop: arrowGap,
                display: 'flex',
                alignItems: 'center',
                gap: 12 * scale,
                transform: `translateY(${rowTranslate}px)`,
                opacity: rowOpacity,
                minHeight: rowHeight,
              }}
            >
              <div
                style={{
                  width: numberSize,
                  height: numberSize,
                  borderRadius: 999,
                  backgroundColor: '#111827',
                  color: '#fff',
                  fontSize: 15 * scale,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {index + 1}
              </div>
              <div
                style={{
                  width: iconSize,
                  height: iconSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={iconSize} stroke={textColor} />
              </div>
              <div
                style={{
                  fontSize: 23 * scale,
                  fontWeight: 600,
                  color: textColor,
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
                {item.detail ? (
                  <span
                    style={{
                      marginLeft: 6 * scale,
                      fontSize: 19 * scale,
                      fontStyle: 'italic',
                      fontWeight: 500,
                      color: '#475569',
                    }}
                  >
                    ({item.detail})
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DisclaimerOverlay = ({text, durationInFrames, scale}) => {
  const opacity = useFadeOpacity(durationInFrames);
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 48 * scale,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 26 * scale,
        color: '#fff',
        opacity,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          padding: `${8 * scale}px ${16 * scale}px`,
          borderRadius: 999,
          backgroundColor: '#000',
          boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
          maxWidth: '85%',
          whiteSpace: 'normal',
          lineHeight: 1.35,
        }}
      >
        {text}
      </span>
    </div>
  );
};

const BlackoutOverlay = () => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#000',
        zIndex: 1,
      }}
    />
  );
};

const CanvasSketchFrame = ({opacity = 1}) => {
  const {width: outputW, height: outputH} = useVideoConfig();
  const margin = 36;
  const frameWidth = outputW - margin * 2;
  const frameHeight = outputH - margin * 2;
  const paths = useMemo(() => getRoughPaths(frameWidth, frameHeight), [
    frameWidth,
    frameHeight,
  ]);

  return (
    <svg
      width={frameWidth}
      height={frameHeight}
      style={{
        position: 'absolute',
        left: margin,
        top: margin,
        opacity,
        pointerEvents: 'none',
        zIndex: 6,
      }}
    >
      {paths.map((path, index) => (
        <path
          key={index}
          d={path.d}
          fill="none"
          stroke={ROUGH_STYLE.stroke}
          strokeWidth={ROUGH_STYLE.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={SKETCH_STROKE_FILTER}
        />
      ))}
    </svg>
  );
};

const ProcessingOverlay = ({text, durationInFrames, scale}) => {
  const opacity = useFadeOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const blink = Math.floor(frame / (fps * 0.45)) % 2 === 0;
  return (
    <div
      style={{
        position: 'absolute',
        top: 24 * scale,
        right: 32 * scale,
        padding: `${8 * scale}px ${14 * scale}px`,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.85)',
        color: '#1a1a1a',
        fontSize: 16 * scale,
        fontWeight: 600,
        letterSpacing: 0.4,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 8 * scale,
      }}
    >
      <span
        style={{
          width: 8 * scale,
          height: 8 * scale,
          borderRadius: 999,
          backgroundColor: '#3b82f6',
          boxShadow: '0 0 8px rgba(59,130,246,0.7)',
          opacity: blink ? 1 : 0.25,
        }}
      />
      {text}
    </div>
  );
};

const StatusLeftOverlay = ({text, durationInFrames, scale}) => {
  const opacity = useFadeOpacity(durationInFrames);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const activeDot = Math.floor(frame / (fps * 0.25)) % 3;
  return (
    <div
      style={{
        position: 'absolute',
        top: 32 * scale,
        left: 32 * scale,
        padding: `${10 * scale}px ${16 * scale}px`,
        borderRadius: 999,
        backgroundColor: 'rgba(0,0,0,0.65)',
        color: '#fff',
        fontSize: 20 * scale,
        fontWeight: 600,
        letterSpacing: 0.6,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 10 * scale,
        textTransform: 'uppercase',
        zIndex: 20,
      }}
    >
      <span>{text}</span>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4 * scale,
        }}
      >
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            style={{
              width: 6 * scale,
              height: 6 * scale,
              borderRadius: 999,
              backgroundColor: '#3b82f6',
              boxShadow: '0 0 6px rgba(59,130,246,0.7)',
              opacity: index === activeDot ? 1 : 0.25,
            }}
          />
        ))}
      </span>
    </div>
  );
};

const PixelPulseOverlay = ({durationInFrames, scale}) => {
  const frame = useCurrentFrame();
  const {width: outputW, height: outputH} = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const driftProgress = Math.min(1, progress / 0.5);
  const snapProgress =
    progress < 0.5
      ? 0
      : interpolate(progress, [0.5, 0.8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        });
  const pulseProgress =
    progress < 0.8
      ? 0
      : interpolate(progress, [0.8, 1], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  const area = {
    x: 120 * scale,
    y: 260 * scale,
    width: Math.min(540 * scale, outputW * 0.5),
    height: Math.min(320 * scale, outputH * 0.34),
  };
  const driftAmp = 10 * scale;
  const dotSize = 8 * scale;
  const dotCount = 20;
  const seeded = (index, offset) => {
    const value = Math.sin(index * 12.9898 + offset) * 43758.5453;
    return value - Math.floor(value);
  };
  const boxStroke = '#111827';
  const boxOpacity = snapProgress;

  return (
    <div style={{position: 'absolute', inset: 0, zIndex: 8}}>
      <div style={{position: 'absolute', inset: 0, zIndex: 5}}>
        {Array.from({length: dotCount}).map((_, index) => {
          const seedX = seeded(index, 1);
          const seedY = seeded(index, 7);
        const cols = 5;
        const rows = Math.ceil(dotCount / cols);
        const col = index % cols;
        const row = Math.floor(index / cols);
        const padX = 28 * scale;
        const padY = 24 * scale;
        const cellW = (area.width - padX * 2) / Math.max(1, cols - 1);
        const cellH = (area.height - padY * 2) / Math.max(1, rows - 1);
        const baseX = area.x + seedX * area.width;
        const baseY = area.y + seedY * area.height;
        const driftX =
          baseX +
          Math.sin(frame / 9 + index) * driftAmp * (1 - snapProgress);
        const driftY =
          baseY +
          Math.cos(frame / 10 + index) * driftAmp * (1 - snapProgress);
        const targetX = area.x + padX + col * cellW;
        const targetY = area.y + padY + row * cellH;
        const x = lerp(driftX, targetX, snapProgress);
        const y = lerp(driftY, targetY, snapProgress);
        const pulse = 1 + pulseProgress * 0.35;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: x - (dotSize / 2) * pulse,
                top: y - (dotSize / 2) * pulse,
                width: dotSize * pulse,
                height: dotSize * pulse,
                borderRadius: 999,
                backgroundColor: '#3b82f6',
                boxShadow: `0 0 ${8 * scale}px rgba(59,130,246,0.45)`,
                opacity: 0.9,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: area.x,
          top: area.y,
          width: area.width,
          height: area.height,
          borderRadius: 22 * scale,
          border: `${4 * scale}px solid ${boxStroke}`,
          boxSizing: 'border-box',
          opacity: boxOpacity,
          pointerEvents: 'none',
          zIndex: 6,
        }}
      />
    </div>
  );
};

const OutroOverlay = ({text, durationInFrames, scale}) => {
  const opacity = useFadeOpacity(durationInFrames);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 42 * scale,
        fontWeight: 600,
        color: '#fff',
        opacity,
      }}
    >
      {text}
    </div>
  );
};

const OverlayRenderer = ({overlay, durationInFrames, scale, activeRect, output, currentTime}) => {
  switch (overlay.type) {
    case 'title':
      return (
        <TitleOverlay
          text={overlay.text}
          subtext={overlay.subtext}
          logo={overlay.logo}
          durationInFrames={durationInFrames}
          scale={scale}
        />
      );
    case 'intro_title':
      return (
        <IntroTitleOverlay
          text={overlay.text}
          subtext={overlay.subtext}
          logo={overlay.logo}
          durationInFrames={durationInFrames}
          scale={scale}
          currentTime={currentTime}
        />
      );
    case 'subtitle':
      return (
        <SubtitleOverlay
          text={overlay.text}
          durationInFrames={durationInFrames}
          scale={scale}
        />
      );
    case 'label':
      return (
        <LabelOverlay text={overlay.text} durationInFrames={durationInFrames} scale={scale} />
      );
    case 'codex_callout':
      return (
        <CodexCallout
          text={overlay.text}
          logo={overlay.logo}
          durationInFrames={durationInFrames}
          scale={scale}
        />
      );
    case 'coords':
      return (
        <CoordsOverlay rect={activeRect} durationInFrames={durationInFrames} scale={scale} />
      );
    case 'endpoints':
      return (
        <EndpointsOverlay rect={activeRect} durationInFrames={durationInFrames} scale={scale} />
      );
    case 'box':
      return <DrawBoxOverlay rect={activeRect} durationInFrames={durationInFrames} />;
    case 'box_track':
      return (
        <>
          <EndpointsOverlay rect={activeRect} durationInFrames={durationInFrames} scale={scale} />
          <BoxOverlay rect={activeRect} durationInFrames={durationInFrames} />
        </>
      );
    case 'box_move':
      return (
        <BoxOverlay
          rect={getBottomRightRect(activeRect, output.width, output.height)}
          durationInFrames={durationInFrames}
        />
      );
    case 'canvas':
      return null;
    case 'blackout':
      return <BlackoutOverlay durationInFrames={durationInFrames} />;
    case 'tool_flow':
      return (
        <ToolFlowOverlay
          items={overlay.items}
          durationInFrames={durationInFrames}
          scale={scale}
          currentTime={currentTime}
        />
      );
    case 'disclaimer':
      return (
        <DisclaimerOverlay text={overlay.text} durationInFrames={durationInFrames} scale={scale} />
      );
    case 'processing':
      return (
        <ProcessingOverlay text={overlay.text} durationInFrames={durationInFrames} scale={scale} />
      );
    case 'status_left':
      return (
        <StatusLeftOverlay text={overlay.text} durationInFrames={durationInFrames} scale={scale} />
      );
    case 'offline_notice':
      return (
        <ToolFlowOverlay
          items={overlay.items || []}
          durationInFrames={durationInFrames}
          scale={scale}
          currentTime={currentTime}
        />
      );
    case 'pixel_pulse':
      return <PixelPulseOverlay durationInFrames={durationInFrames} scale={scale} />;
    case 'outro':
      return <OutroOverlay text={overlay.text} durationInFrames={durationInFrames} scale={scale} />;
    default:
      return null;
  }
};


export {
  TitleOverlay,
  IntroTitleOverlay,
  SubtitleOverlay,
  LabelOverlay,
  CodexCallout,
  CoordsOverlay,
  EndpointsOverlay,
  BoxOverlay,
  DrawBoxOverlay,
  ToolListOverlay,
  ToolFlowOverlay,
  DisclaimerOverlay,
  BlackoutOverlay,
  CanvasSketchFrame,
  ProcessingOverlay,
  StatusLeftOverlay,
  PixelPulseOverlay,
  OutroOverlay,
  OverlayRenderer,
};
