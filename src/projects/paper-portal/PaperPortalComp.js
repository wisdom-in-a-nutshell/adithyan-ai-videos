import React from 'react';
import {AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {PROJECT_TITLE} from './assets.js';

const line = {
  stroke: '#27241f',
  strokeWidth: 9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
};

export const PaperPortalComp = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = spring({fps, frame: frame - 24, config: {damping: 180}});
  const walk = Math.min(1, Math.max(0, (frame - 70) / 150));
  const x = 320 + walk * 760;
  const step = Math.sin(walk * Math.PI * 8);
  const color = Math.min(1, Math.max(0, (x - 945) / 170));

  return (
    <AbsoluteFill style={{backgroundColor: '#efe9dc'}}>
      <Sequence name="early concept card" from={0}>
        <AbsoluteFill>
          <svg viewBox="0 0 1920 1080" style={{width: '100%', height: '100%'}}>
            <rect width="1920" height="1080" fill="#efe9dc" />
            <rect x="0" y="0" width="1920" height="1080" fill="#ffd45a" opacity={color * 0.35} />

            <text x="110" y="120" fill="#27241f" fontSize="54" fontWeight="800">
              {PROJECT_TITLE}
            </text>
            <text x="112" y="172" fill="#6b6256" fontSize="28">
              rough paper sketch → animated SVG → color world
            </text>

            <path d="M110 880 C410 850 760 875 1060 855 C1300 840 1580 870 1810 850" {...line} opacity="0.28" />

            <g transform={`translate(${x} ${-Math.abs(step) * 10})`} opacity={0.45 + reveal * 0.55}>
              <g {...line}>
                <circle cx="0" cy="440" r="64" fill="#efe9dc" />
                <path d="M-24 425 L-8 435" />
                <path d="M27 435 L45 414" />
                <path d="M-16 475 C4 493 38 489 55 468" />
                <path d="M0 505 L0 700" />
                <path d={`M0 535 L${-90 - step * 20} ${635 + step * 18}`} />
                <path d={`M0 535 L${96 + step * 20} ${620 - step * 12}`} />
                <path d={`M0 700 L${-78 + step * 35} 850`} />
                <path d={`M0 700 L${86 - step * 35} 850`} />
              </g>
              <g opacity={color} stroke="#1769ff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <circle cx="0" cy="440" r="64" fill="#ffe05c" />
                <path d="M0 505 L0 700" />
                <path d={`M0 535 L${-90 - step * 20} ${635 + step * 18}`} />
                <path d={`M0 535 L${96 + step * 20} ${620 - step * 12}`} />
                <path d={`M0 700 L${-78 + step * 35} 850`} />
                <path d={`M0 700 L${86 - step * 35} 850`} />
              </g>
            </g>

            <g transform="translate(1130 275)">
              <path d="M0 600 L0 120 L300 20 L370 600" {...line} />
              <path d="M300 20 L370 80" {...line} opacity="0.55" />
              <rect x="245" y="310" width="54" height="62" {...line} />
              <path d="M272 313 L272 370 M244 342 L300 335" {...line} />
            </g>
          </svg>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
