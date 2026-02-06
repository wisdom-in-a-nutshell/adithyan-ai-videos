import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

/**
 * Animated circular progress ring that fills from 0 to a target percentage.
 * Uses SVG stroke-dashoffset for the fill animation.
 */
export const ProgressRing = ({
  progress = 1, // 0-1, how full the ring should be
  size = 200,
  strokeWidth = 8,
  trackColor = 'rgba(0,0,0,0.08)',
  fillColor = 'url(#progressGradient)',
  showGlow = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} style={{transform: 'rotate(-90deg)'}}>
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        {showGlow && (
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      {/* Animated fill */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={fillColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        filter={showGlow ? 'url(#glow)' : undefined}
      />
    </svg>
  );
};

/**
 * Animated progress ring that fills based on time.
 * Wraps ProgressRing with frame-based animation logic.
 */
export const AnimatedProgressRing = ({
  startTime = 0,
  duration = 1,
  targetPercent = 100,
  size = 200,
  strokeWidth = 8,
  children,
}) => {
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
      easing: Easing.out(Easing.cubic),
    }
  );

  const displayPercent = Math.round(progress * targetPercent);

  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <ProgressRing
        progress={progress}
        size={size}
        strokeWidth={strokeWidth}
      />
      {/* Center content (percentage text or children) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'rotate(0deg)', // Counter the SVG rotation
        }}
      >
        {children || (
          <span
            style={{
              fontSize: size * 0.28,
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: -2,
            }}
          >
            {displayPercent}%
          </span>
        )}
      </div>
    </div>
  );
};
