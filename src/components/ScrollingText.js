import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SKETCH_FONT_FAMILY} from '../styles/sketch.js';

export const ScrollingText = ({
  text,
  textColor = '#f6f2ee',
  textSize = 140,
  textWeight = 700,
  textY = 0.58,
  textSpeedPxPerSecond = 120,
  textShadow = '0 20px 40px rgba(0,0,0,0.35)',
  textBackdrop = false,
  textBackdropColor = 'rgba(0,0,0,0.65)',
  textBackdropPaddingX = 20,
  textBackdropPaddingY = 12,
  textBackdropRadius = 999,
  textBackdropBorder = '1px solid rgba(255,255,255,0.12)',
  textBackdropShadow = '0 20px 40px rgba(0,0,0,0.35)',
  textBackdropDots = 3,
  textBackdropDotColor = '#3b82f6',
  textBackdropDotSize = 6,
  textBackdropDotGap = 4,
  textBackdropDotShadow = '0 0 6px rgba(59,130,246,0.7)',
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  if (!text) {
    return null;
  }

  const startX = width + Math.round(width * 0.1);
  const pxPerFrame = textSpeedPxPerSecond / Math.max(1, fps);
  const rawX = startX - frame * pxPerFrame;
  const textX = Math.round(rawX);
  const textYpx = Math.round(height * textY);
  const activeDot =
    textBackdrop && textBackdropDots > 0
      ? Math.floor(frame / (fps * 0.25)) % textBackdropDots
      : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: textX,
        top: textYpx,
        maxWidth: Math.max(1, width - 40),
        transform: 'translate3d(0, -50%, 0)',
        fontSize: textSize,
        fontWeight: textWeight,
        color: textColor,
        textShadow,
        display: textBackdrop ? 'inline-flex' : 'inline-block',
        alignItems: textBackdrop ? 'center' : undefined,
        gap: textBackdrop ? 10 : undefined,
        padding: textBackdrop ? `${textBackdropPaddingY}px ${textBackdropPaddingX}px` : 0,
        backgroundColor: textBackdrop ? textBackdropColor : 'transparent',
        borderRadius: textBackdrop ? textBackdropRadius : 0,
        border: textBackdrop ? textBackdropBorder : 'none',
        boxShadow: textBackdrop ? textBackdropShadow : 'none',
        whiteSpace: 'nowrap',
        letterSpacing: textBackdrop ? 0.6 : '-0.03em',
        textTransform: textBackdrop ? 'uppercase' : undefined,
        textRendering: 'geometricPrecision',
        WebkitFontSmoothing: 'antialiased',
        fontFamily: SKETCH_FONT_FAMILY,
        pointerEvents: 'none',
      }}
    >
      <span style={{display: 'inline-block'}}>{text}</span>
      {textBackdrop && textBackdropDots > 0 ? (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: textBackdropDotGap,
            marginLeft: 6,
          }}
        >
          {Array.from({length: textBackdropDots}).map((_, index) => (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              style={{
                width: textBackdropDotSize,
                height: textBackdropDotSize,
                borderRadius: 999,
                backgroundColor: textBackdropDotColor,
                boxShadow: textBackdropDotShadow,
                opacity: index === activeDot ? 1 : 0.25,
              }}
            />
          ))}
        </span>
      ) : null}
    </div>
  );
};
