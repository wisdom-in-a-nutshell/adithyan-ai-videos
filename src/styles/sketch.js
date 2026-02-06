import React from 'react';
import {loadFont} from '@remotion/google-fonts/ArchitectsDaughter';

const {fontFamily} = loadFont();

export const SKETCH_FONT_FAMILY = fontFamily;
export const SKETCH_TEXT_FILTER = 'url(#pencil-texture)';
export const SKETCH_STROKE_FILTER = 'url(#pencil-stroke)';
export const SKETCH_TEXT_STYLE = {
  fontFamily,
  fontWeight: 400,
  letterSpacing: 0.4,
  filter: SKETCH_TEXT_FILTER,
};

export const SketchLayer = ({children, style = {}}) => {
  return (
    <div
      style={{
        fontFamily,
        filter: SKETCH_TEXT_FILTER,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const SketchText = ({children, style = {}}) => {
  return <span style={{...SKETCH_TEXT_STYLE, ...style}}>{children}</span>;
};

export const SketchDefs = () => {
  return (
    <svg
      width="0"
      height="0"
      style={{position: 'absolute', width: 0, height: 0}}
      aria-hidden
    >
      <defs>
        <filter
          id="pencil-texture"
          x="-8%"
          y="-8%"
          width="116%"
          height="116%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="1"
            seed="2"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.7" />
        </filter>
        <filter id="pencil-stroke" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="2"
            seed="3"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" />
        </filter>
      </defs>
    </svg>
  );
};
