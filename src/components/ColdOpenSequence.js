import React from 'react';
import {
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import {AnimatedProgressRing} from './ProgressRing.js';
import {UserIcon} from './UserIcon.js';
import {SKETCH_FONT_FAMILY, SKETCH_TEXT_FILTER, SketchLayer} from '../styles/sketch.js';

/**
 * Premium cold-open animation for "This video was 100% edited by Codex and 0% by me"
 *
 * Timeline:
 * 0.08-1.00s: "This video was" typewriter
 * 1.00-2.00s: 100% ring fills + "edited by" appears
 * 2.00-3.00s: Logo + "Codex" entrance
 * 3.00-3.60s: "0% by me" with user icon
 */

const WORD_TIMESTAMPS = {
  this: {start: 0.08, end: 0.32},
  video: {start: 0.32, end: 0.56},
  was: {start: 0.56, end: 1.0},
  hundred: {start: 1.0, end: 1.04},
  edited: {start: 1.04, end: 1.84},
  by1: {start: 1.84, end: 2.0},
  codex: {start: 2.0, end: 3.0},
  and: {start: 3.0, end: 3.12},
  zero: {start: 3.12, end: 3.16},
  by2: {start: 3.16, end: 3.28},
  me: {start: 3.28, end: 3.6},
};

const INTRO_TEXT = 'This video was';
const CHAR_FRAMES = 2;

/**
 * Typewriter text with blinking cursor
 */
const TypewriterText = ({text, startTime, endTime, scale}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const startFrame = Math.round(startTime * fps);
  const endFrame = Math.round(endTime * fps);
  const duration = endFrame - startFrame;

  const localFrame = Math.max(0, frame - startFrame);
  const charsToShow = Math.min(
    text.length,
    Math.floor(localFrame / CHAR_FRAMES)
  );

  const displayText = text.slice(0, charsToShow);
  const isComplete = charsToShow >= text.length;
  const cursorBlink = Math.floor(frame / 8) % 2 === 0;

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 6],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <div
      style={{
        fontSize: 38 * scale,
        fontWeight: 500,
        color: '#475569',
        letterSpacing: 0.5,
        opacity,
        fontFamily: SKETCH_FONT_FAMILY,
        filter: SKETCH_TEXT_FILTER,
      }}
    >
      {displayText}
      {!isComplete && (
        <span
          style={{
            display: 'inline-block',
            width: 3 * scale,
            height: 32 * scale,
            marginLeft: 4 * scale,
            backgroundColor: '#475569',
            opacity: cursorBlink ? 0.8 : 0.2,
            verticalAlign: 'middle',
            filter: SKETCH_TEXT_FILTER,
          }}
        />
      )}
    </div>
  );
};

/**
 * Word with animated highlight sweep background
 */
const HighlightWord = ({word, startTime, endTime, scale, color = 'rgba(34,211,238,0.3)'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const startFrame = Math.round(startTime * fps);
  const durationFrames = Math.round((endTime - startTime) * fps);

  const highlightProgress = spring({
    fps,
    frame,
    config: {damping: 200},
    delay: startFrame,
    durationInFrames: Math.max(12, durationFrames),
  });

  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      <span
        style={{
          position: 'absolute',
          left: -4 * scale,
          right: -4 * scale,
          top: '50%',
          height: '1.1em',
          transform: `translateY(-50%) scaleX(${highlightProgress})`,
          transformOrigin: 'left center',
          backgroundColor: color,
          borderRadius: 6 * scale,
          zIndex: 0,
          filter: SKETCH_TEXT_FILTER,
        }}
      />
      <span
        style={{
          position: 'relative',
          zIndex: 1,
          fontFamily: SKETCH_FONT_FAMILY,
          filter: SKETCH_TEXT_FILTER,
        }}
      >
        {word}
      </span>
    </span>
  );
};

/**
 * Animated counter that counts up from 0 to target
 */
const AnimatedCounter = ({targetValue, startTime, duration, scale, style = {}}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const startFrame = Math.round(startTime * fps);
  const durationFrames = Math.round(duration * fps);

  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp),
    }
  );

  const displayValue = Math.round(progress * targetValue);

  // Scale punch effect
  const scaleProgress = spring({
    fps,
    frame,
    config: {damping: 12, stiffness: 200},
    delay: startFrame,
    durationInFrames: 20,
  });
  const scaleValue = interpolate(scaleProgress, [0, 0.5, 1], [0.8, 1.05, 1]);

  return (
    <span
      style={{
        display: 'inline-block',
        transform: `scale(${scaleValue})`,
        fontFamily: SKETCH_FONT_FAMILY,
        filter: SKETCH_TEXT_FILTER,
        ...style,
      }}
    >
      {displayValue}%
    </span>
  );
};

/**
 * Logo with animated entrance
 */
const AnimatedLogo = ({src, startTime, size, scale}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const startFrame = Math.round(startTime * fps);

  const entrance = spring({
    fps,
    frame,
    config: {damping: 200},
    delay: startFrame,
    durationInFrames: 20,
  });

  const logoScale = interpolate(entrance, [0, 1], [0.5, 1]);
  const logoOpacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <Img
      src={src}
      style={{
        width: size * scale,
        height: size * scale,
        objectFit: 'contain',
        transform: `scale(${logoScale})`,
        opacity: logoOpacity,
        filter: 'drop-shadow(0 0 12px rgba(34,211,238,0.4))',
      }}
    />
  );
};

/**
 * Main cold-open sequence component
 */
export const ColdOpenSequence = ({
  durationInFrames,
  scale = 1,
  logo,
  currentTime,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Phase visibility
  const showTypewriter = currentTime >= WORD_TIMESTAMPS.this.start;
  const showMainContent = currentTime >= WORD_TIMESTAMPS.hundred.start;
  const showZeroSection = currentTime >= WORD_TIMESTAMPS.zero.start;

  // Main content fade in
  const mainContentOpacity = interpolate(
    currentTime,
    [WORD_TIMESTAMPS.hundred.start, WORD_TIMESTAMPS.hundred.start + 0.3],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // Zero section fade in
  const zeroOpacity = interpolate(
    currentTime,
    [WORD_TIMESTAMPS.zero.start, WORD_TIMESTAMPS.zero.start + 0.2],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // Overall exit fade
  const exitOpacity = interpolate(
    currentTime,
    [3.4, 3.6],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <SketchLayer
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: exitOpacity,
      }}
    >
      {/* Typewriter intro - "This video was" */}
      {showTypewriter && (
        <div style={{marginBottom: 40 * scale}}>
          <TypewriterText
            text={INTRO_TEXT}
            startTime={WORD_TIMESTAMPS.this.start}
            endTime={WORD_TIMESTAMPS.was.end}
            scale={scale}
          />
        </div>
      )}

      {/* Main content row - 100% side and 0% side */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 80 * scale,
          opacity: mainContentOpacity,
        }}
      >
        {/* 100% / Codex section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16 * scale,
          }}
        >
          {/* Progress ring with counter */}
          <AnimatedProgressRing
            startTime={WORD_TIMESTAMPS.hundred.start}
            duration={1.0}
            targetPercent={100}
            size={180 * scale}
            strokeWidth={10 * scale}
          >
            <AnimatedCounter
              targetValue={100}
              startTime={WORD_TIMESTAMPS.hundred.start}
              duration={0.8}
              scale={scale}
              style={{
                fontSize: 52 * scale,
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: -2,
              }}
            />
          </AnimatedProgressRing>

          {/* "edited by Codex" with logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10 * scale,
              fontSize: 28 * scale,
              fontWeight: 600,
              color: '#0f172a',
              fontFamily: SKETCH_FONT_FAMILY,
              filter: SKETCH_TEXT_FILTER,
            }}
          >
            <HighlightWord
              word="edited"
              startTime={WORD_TIMESTAMPS.edited.start}
              endTime={WORD_TIMESTAMPS.edited.end}
              scale={scale}
            />
            <HighlightWord
              word="by"
              startTime={WORD_TIMESTAMPS.by1.start}
              endTime={WORD_TIMESTAMPS.by1.end}
              scale={scale}
            />
            {logo && (
              <AnimatedLogo
                src={logo}
                startTime={WORD_TIMESTAMPS.codex.start}
                size={28}
                scale={scale}
              />
            )}
            <HighlightWord
              word="Codex"
              startTime={WORD_TIMESTAMPS.codex.start}
              endTime={WORD_TIMESTAMPS.codex.end}
              scale={scale}
              color="rgba(99,102,241,0.25)"
            />
          </div>

          {/* Accent bar */}
          <div
            style={{
              height: 4 * scale,
              width: 120 * scale,
              borderRadius: 999,
              background: 'linear-gradient(90deg, #22d3ee, #6366f1)',
              boxShadow: '0 0 16px rgba(99,102,241,0.4)',
              opacity: mainContentOpacity,
            }}
          />
        </div>

        {/* Divider */}
        <div
          style={{
            width: 2 * scale,
            height: 120 * scale,
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: 999,
            opacity: zeroOpacity,
          }}
        />

        {/* 0% / me section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12 * scale,
            opacity: zeroOpacity,
          }}
        >
          {/* 0% display - simpler, no ring */}
          <div
            style={{
              fontSize: 72 * scale,
              fontWeight: 700,
              color: '#94a3b8',
              letterSpacing: -2,
              fontFamily: SKETCH_FONT_FAMILY,
              filter: SKETCH_TEXT_FILTER,
            }}
          >
            <AnimatedCounter
              targetValue={0}
              startTime={WORD_TIMESTAMPS.zero.start}
              duration={0.1}
              scale={scale}
              style={{}}
            />
          </div>

          {/* "by me" with user icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8 * scale,
              fontSize: 24 * scale,
              fontWeight: 600,
              color: '#64748b',
              fontFamily: SKETCH_FONT_FAMILY,
              filter: SKETCH_TEXT_FILTER,
            }}
          >
            <UserIcon size={22 * scale} color="#94a3b8" />
            <span>by me</span>
          </div>
        </div>
      </div>
    </SketchLayer>
  );
};
