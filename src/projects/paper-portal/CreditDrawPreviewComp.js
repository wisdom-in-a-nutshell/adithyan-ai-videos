import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const CREDIT_PATHS = [
  'm5.4 33.4c0.2 0.7-0.4 0.6-0.7 0.9-2.3 2.4-2.1 8.7 1.7 12.7 1.6 1.9 5.1 3.5 6.6 0.6l0.5-0.2 0.3 0.3c1 0.9-0.8 1.6-1.4 2-5.5 1.8-9.7-3.7-10.1-8.7-0.3-2.2 0.1-6.6 2.3-7.7l0.8 0.1z',
  'm15.4 41.1c0.5-1 2.1-1.9 3.3-1.8l-0.3 0.5c-3 1.1-0.7 2.2 0.2 4l-0.2 0.8c-1.5 0-2.3-2.8-4.8-3.4 0.3-0.6 1.4-0.1 1.8-0.1z',
  'm22.8 41.3c0.7 0.6 2 0.8 3 0.1l-0.1 0.5c-0.9 1.2-3.1 0.5-4.5-1-0.4-3.6 1.2-3.4 2-3.2 1.6 1.1 2.3 2.6-0.4 3.6zm-0.3-0.8c1.1-0.3 0.6-2.8-0.4-1.9 0 0.6-0.2 1.6 0.4 1.9z',
  'm31.4 36.8-1.3 2.8c-3.9 1.3-3-3.8-2.2-6 1.8-1.8 3.5 1.2 4.2 2.4l2.5 1.1c-1.1 0.9-2.2 0-3.2-0.3zm-2.7-2.8c-0.6 1.3-0.3 3.4 0.1 5.1 0.9-0.4 1.4-1.8 1.8-2.8-0.8-0.6-0.9-2.8-1.9-2.3z',
  'm37.3 25.9c1.3 2 3.1 4.1 4.6 6.5l-0.1 0.9c-1.9-1.7-3.3-4.3-5.3-6.5-1.4 0.8-2.7 2.6-4.2 3.7l-0.9-0.5 0.1-0.3 4.4-3.9c-1.4-1.6-3.2-4.4-3.5-6.6l0.6-0.2c1.4 1.4 1.2 4 3.8 5.9l3-1.4h0.8l-3.3 2.4z',
  'm44.6 27.4c1 1.5 2.8 0.2 4.3-0.9l-1.9 2.5c-1.1 0.7-3-0.4-3.6-1.4-0.2-1.7 0.2-4.6 2.4-4.3 1.7 0.9 0.7 3.6-1.2 4.1zm-0.2-0.8c0.7-0.4 1.2-1.4 0.7-2.4-0.7 0.4-0.8 1.5-0.7 2.4z',
  'm52.3 19c-1-1.9-4.8-4.9-3.9-5.7 0.9-0.7 3.2 4.3 4.8 5.7 1 1.1 2.2 3.5 4.2 2.7-0.6 2.2-3.2 0.2-4-1.3 0.6 2-0.4 6.3-3.2 5.1-1.6-1.6-1.1-6.9 2.1-6.5zm-1.7 6.1c1.2 0.4 2.5-3.5 1.5-4.7-2.3-0.3-2.1 3.6-1.5 4.7z',
  'm67.6 9.2-0.8-0.1c2.1-4.1 5.8-0.5 5.2 2.4-0.6 2.4-3.4 1.8-4.2 0.1 2.1 1.5 3 0.1 2.8-1.7-0.4-2-2.2-3-3-0.7zm-0.1 4.1c-1.9-1.7-6.4-8.9-6.4-10.7l0.4-0.1c1.5 1.9 2.9 6 6.9 10.2l-0.2 0.6h-0.7z',
  'm75.9 10.5c-1.3 3.5 1.2 8.9 5.7 9.3 4.6 0.3 1.3-5.4 0-7.4l-4.7-6.5-0.3 1.5c-1.8 2-4.2-1.4-4.6-2.5 1.5 0.2 3.6 4.2 4.4 0.5l-1.2-1.6 0.9-0.3c3.4 3.4 8.3 9.6 9 15 0.4 3.6-6.2 2.7-8.6-0.9-1.3-2-1.9-5-0.6-7.1z',
  'm153.8 3.1c-3 1.4-6.3 2.8-9.2 5l-0.2 0.4-0.3-0.1c-1 0.7 0 2-0.6 1.7l0.1-0.9c-1.5 1.3-3.7 1.9-5.1 3.2-4.1 3.2-7.4 7-10.7 11.6-4.4 5.6-7.8 13.6-11.4 21.2l-1.8 4.7-0.5 0.7-0.9-0.2v-0.4c2.4-6.4 6.3-13.2 9.6-19.6 3.2-5.9 7.4-10.8 11.7-15.5l0.3-0.3-0.2-1h0.8l2.7-2.2c1.4-0.8 3-2 4.4-2.8h0.3c2.8-1.7 6.7-4 10.8-6.2l0.5 0.2-0.3 0.5z',
  'm61.8 55.6c1.4 1 2.7 3.8 4 5.5l8 10.8-0.2 0.6-0.7-0.1-7.7-9.8-4.1-6c0.9 5 2.4 10 1.3 20.2l-0.8 1.7-1.2-0.6c2.1-6.5 1.7-16.8-0.3-22.3h1.7z',
  'm76.9 60c-1.7-1.4-3.4 0.4-2.5 3.4 1.2 3.1 3.1 0.8 2.8-2.5 1.3 3.2-0.8 5.9-3.2 3.6-1.4-1.9-0.6-6.6 1.9-5.9l1 1.4z',
  'm74 52.6 3.4 5.4 4.4 5.1-0.7 0.3c-2.7-2-6.9-8.4-7.9-10.8h0.8z',
  'm76.4 53.4 0.8-1.3c2.4-0.5 1.3 2.8-0.3 2l-0.5-0.7z',
  'm80.5 45c0.5 2.4 2.1 4.4 3.3 6.4 1.1-1 2.3-2.5 3.7-3.4l0.1 0.1-3.4 4.3 3.4 4.7v0.5c-1.4-0.5-2.7-3-4.1-4.7l-1.4 3-1-0.3 1.9-3.2c-1.4-1.8-3.4-5-4.2-7.3l1.7-0.1z',
  'm84.5 40.5 4 6.1c2-2.7 4.5-0.7 6.3 0.3l-0.2 0.7c-1.7 0.4-3.2-2.7-4.8-1.2l1.1 3-0.9 0.5c-2.5-1.8-5.4-6.5-6.6-9.3l1.1-0.1z',
  'm98 39 1.6 2.9 7 9.2c1 2 4.3 7.5 2 8.3-2.6 1.1-8-0.5-10-2.5-1.2-1.3 0-3.9 1-5.8-0.5 2.3-1.6 4.9 0.8 6.3 2 0.7 7.5 3.2 7.8 0.6-0.3-4.9-6.2-10.4-9.2-15.1l-0.6 1c-2 1.6-4.3-1.4-4.8-3.4h0.6c0.9 0.7 2.3 4 3.7 2.1l-0.9-3.4 1-0.2z',
  'm105.4 35.5 1.8 1.1 1.9-0.6-1.1 1.4-2.5-0.5c0.3 1.1-1 2.7-1.6 3.6-3.3 0.1-2.8-5-2.3-6.9 1.4-0.6 3 0.9 3.8 1.9zm-3-1.5-0.3 0.1c-0.1 1.4 0.1 3.9 1.3 5.3 1.2-1.5 2.1-4.8-1-5.4z',
  'm116.5 25.5 0.1-0.1h0.2c0.7 1.7-1.2 3.6-1.6 5.5-2.2 0.2-3.4-1.3-5.1-1l0.5 2.5-0.6 0.6-2.6-2.9 0.2-0.1 1.5 0.9c-0.2-3.5 2.3-1.9 4.9-1 1.2-0.9 2.4-2.9 2.5-4.4z',
  'm79.2 57.1 1.2 0.3 2.5 2.6-0.3 0.4c-1.2-0.8-2.2-2.3-3.4-3.3z',
  'm16.6 66.4h0.8l-0.4 0.5-0.4-0.5z',
  'm49.8 85.5 0.3-0.1 0.4 0.6-0.7-0.5z',
  'm164.6 97.4 1.6-0.3-0.6 0.5-1-0.2z',
  'm150.1 95h-0.1 0.1z',
  'm150.1 94.6h-0.2 0.2z',
  'm150.4 94.6h-0.5 0.2 0.3z',
  'm62.1 72.4c1.1-2.4 3.3-5 5.5-6.3l-4.6 6.3h-0.9z',
  'm161.6 72.4 0.5-0.8-0.5 0.8z',
  'm150.1 94.6v-0.2 0.2z',
  'm62.6 71.6 0.4-0.7-0.4 0.7z',
];

const CREATED_BY_PATHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 20];
const NAME_PATHS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 26, 29];
const FLOURISH_PATHS = [9, 22, 23, 24, 25, 27, 28];

const clamp01 = (value) => Math.max(0, Math.min(1, value));

const progressBetween = (frame, start, end) =>
  interpolate(frame, [start, end], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const lerp = (a, b, t) => a + (b - a) * t;

const pathGroup = (indexes) =>
  indexes.map((index) => <path key={index} d={CREDIT_PATHS[index]} />);

const guidePoints = [
  {p: 0, x: 6, y: 43, angle: -7},
  {p: 0.24, x: 42, y: 30, angle: -21},
  {p: 0.44, x: 82, y: 18, angle: 17},
  {p: 0.5, x: 62, y: 70, angle: -74},
  {p: 0.72, x: 101, y: 48, angle: -19},
  {p: 0.88, x: 125, y: 41, angle: -58},
  {p: 1, x: 153, y: 6, angle: -18},
];

const getGuidePoint = (progress) => {
  const p = clamp01(progress);
  for (let index = 1; index < guidePoints.length; index += 1) {
    const prev = guidePoints[index - 1];
    const next = guidePoints[index];
    if (p <= next.p) {
      const local = (p - prev.p) / Math.max(0.0001, next.p - prev.p);
      return {
        x: lerp(prev.x, next.x, local),
        y: lerp(prev.y, next.y, local),
        angle: lerp(prev.angle, next.angle, local),
      };
    }
  }
  return guidePoints[guidePoints.length - 1];
};

export const PaperPortalCreditDrawPreviewComp = () => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const createdProgress = progressBetween(frame, 7, 49);
  const nameProgress = progressBetween(frame, 38, 87);
  const flourishProgress = progressBetween(frame, 78, 111);
  const totalProgress = progressBetween(frame, 7, Math.max(80, durationInFrames - 16));
  const settle = progressBetween(frame, 104, 119);
  const guide = getGuidePoint(totalProgress);
  const writing = frame < 112;
  const paperScale = Math.min(width / 1920, height / 1080);
  const svgWidth = Math.round(900 * paperScale);
  const svgHeight = Math.round(svgWidth * (100 / 168));
  const jitter = writing ? Math.sin(frame * 1.7) * 0.22 : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f7f6f2',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 30% 22%, rgba(255,255,255,0.9), transparent 34%), radial-gradient(circle at 62% 72%, rgba(210,210,205,0.22), transparent 38%), linear-gradient(115deg, rgba(255,255,255,0.62), rgba(235,234,229,0.34))',
        }}
      />
      <div
        style={{
          width: svgWidth,
          height: svgHeight,
          transform: `translateY(${-22 * paperScale}px) scale(${0.985 + settle * 0.015})`,
          filter: 'drop-shadow(0 3px 1px rgba(40,40,40,0.035))',
        }}
      >
        <svg
          viewBox="0 0 168 100"
          width="100%"
          height="100%"
          style={{overflow: 'visible'}}
        >
          <defs>
            <filter id="credit-pencil-texture" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.86"
                numOctaves="2"
                seed="9"
                result="noise"
              />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.28" />
            </filter>
            <mask id="created-mask" maskUnits="userSpaceOnUse">
              <rect x="-5" y="-2" width={92 * createdProgress} height="58" fill="white" />
              <ellipse
                cx={-2 + 92 * createdProgress}
                cy="30"
                rx="9"
                ry="18"
                fill="white"
                opacity={createdProgress > 0 && createdProgress < 1 ? 0.85 : 0}
              />
            </mask>
            <mask id="name-mask" maskUnits="userSpaceOnUse">
              <rect x="52" y="24" width={78 * nameProgress} height="65" fill="white" />
              <ellipse
                cx={52 + 78 * nameProgress}
                cy="55"
                rx="10"
                ry="20"
                fill="white"
                opacity={nameProgress > 0 && nameProgress < 1 ? 0.85 : 0}
              />
            </mask>
            <mask id="flourish-mask" maskUnits="userSpaceOnUse">
              <rect x="111" y="-4" width={55 * flourishProgress} height="88" fill="white" />
              <ellipse
                cx={111 + 55 * flourishProgress}
                cy="26"
                rx="10"
                ry="26"
                fill="white"
                opacity={flourishProgress > 0 && flourishProgress < 1 ? 0.9 : 0}
              />
            </mask>
          </defs>
          <g
            fill="#56595c"
            opacity={0.82}
            filter="url(#credit-pencil-texture)"
            transform={`translate(${jitter} ${-jitter * 0.7})`}
          >
            <g mask="url(#created-mask)">{pathGroup(CREATED_BY_PATHS)}</g>
            <g mask="url(#name-mask)">{pathGroup(NAME_PATHS)}</g>
            <g mask="url(#flourish-mask)">{pathGroup(FLOURISH_PATHS)}</g>
          </g>
          <g
            fill="#1f2326"
            opacity={writing ? 0.12 : 0}
            transform={`translate(${guide.x} ${guide.y}) rotate(${guide.angle})`}
          >
            <ellipse cx="0" cy="0" rx="1.15" ry="1.75" />
          </g>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
