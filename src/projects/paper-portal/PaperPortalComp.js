import React from 'react';
import {AbsoluteFill, Easing, Img, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import sketchImage from './media/sketch-crop.jpg';

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
};

const Path = ({cls, d, style}) => <path className={cls} d={d} style={style} />;

const QuiverStyles = () => (
  <style>{`
    .paper-bg { fill: #b9b2aa; }
    .soft-shadow { fill: #938c85; opacity: 0.55; }
    .dark-fill { fill: #3f3d38; }
    .mid-fill { fill: #54524e; }
    .line-a { fill: none; stroke: #3f3d38; stroke-width: 0.7; stroke-miterlimit: 10; }
    .line-b { fill: none; stroke: #3f3d38; stroke-width: 0.7; stroke-linecap: round; stroke-miterlimit: 10; }
    .line-c { fill: none; stroke: #3f3d38; stroke-width: 0.9; stroke-linecap: round; stroke-miterlimit: 10; }
    .line-d { fill: none; stroke: #3f3d38; stroke-width: 0.5; stroke-linecap: round; stroke-miterlimit: 10; }
    .door-line { fill: none; stroke: #5f5a54; stroke-width: 0.8; stroke-miterlimit: 10; }
    .handle-line { fill: none; stroke: #54524e; stroke-width: 0.7; stroke-linecap: round; stroke-miterlimit: 10; }
    .floor-line { fill: none; stroke: #6d6966; stroke-width: 0.7; stroke-linecap: round; stroke-linejoin: round; stroke-miterlimit: 10; }
  `}</style>
);

const Figure = ({dx, bob, opacity}) => {
  return (
    <g transform={`translate(${dx} ${bob})`} opacity={opacity}>
      <Path cls="soft-shadow" d="m69.8 101.1c-4.9 8.9-3.4 19.9 7.8 21.9 9 1.6 16.5-5.2 14.8-13.5-1.5-7.7-16.5-13.4-22.6-8.4z" />
      <Path cls="mid-fill" d="m82 142.7h9.1c-2.9-1-6.3-1.2-9.1 0z" />
      <Path cls="dark-fill" d="m64.1 142.7h1.6c-0.6-0.6-1.1-0.5-1.6 0z" />
      <Path cls="line-a" d="m17.2 34.1c-2.9 1.5-7.4 8.1-7.4 13.9-0.4 5.7 1.5 11.5 7.2 15.4 5.7 4.3 12 4.6 16.3 1.7 3.7-3.1 4.5-4.7 4.3-11.2-0.5-3.7-2.8-8.9-4.9-12.1-3.2-3.9-9.4-8.4-15.5-7.7z" />
      <Path cls="mid-fill" d="m20.3 37c1.9-0.6 4.7-0.4 6.7 0.4 2.1-0.4-1-2.5-6.7-0.4z" />
      <Path cls="mid-fill" d="m22.2 37.8c2.9 0.9 3.8 0.7 5.6-0.1-1.2-0.8-3.6-0.4-5.6 0.1z" />
      <Path cls="line-d" d="m21 55c0.3 4.4 5.3 3 10.4 0.4-4.9 1.7-9.9 3.7-10.4-0.5l0.7 0.2" />
      <Path cls="dark-fill" d="m16.5 47.4-0.8 2.4 0.7 0.5 0.5-0.5 0.3-1.9 3.8-0.2-3.7-0.7 0.1-0.7-0.7 0.3-0.2 0.8z" />
      <Path cls="dark-fill" d="m25.8 49 1.2 0.5 0.9-3.4 4 1.6-4.6-2.7-0.5 0.4z" />
      <Path cls="line-c" d="m11.6 80.8 0.3 13.1 0.6-11.9c1.7-2.3 12-10.9 12.9-11.5l1-1.6 0.3-0.4" />
      <Path cls="line-b" d="m26.6 68.4c1.4 11.7 4 22.2 4.3 32.2l-0.1 7.1 0.4 4.7" />
      <Path cls="line-a" d="m29.9 68c6.2 5.8 18.3 8.9 22 13.2l1.6 1.8" />
      <Path cls="line-c" d="m53.5 83.9c0.8-1.7 4.9-5.4 6.4-7.1" />
      <Path cls="line-d" d="m10.9 83.1c-2.5 2.5-6.8 7.3-7.2 14.5 1-4.9 2.2-6.7 3.5-9.1" />
      <Path cls="line-c" d="m6.1 136.9 9.3-4.6 10.5-6.8 4-9.6" style={{strokeWidth: 1.2}} />
      <Path cls="line-a" d="m31.7 113.1 9.5 8.3-0.4 6 0.5 11.9" />
      <Path cls="dark-fill" d="m31.4 113.8 9 10.3 0.2-2.4-8.7-9-0.6 0.2z" />
      <Path cls="line-b" d="m15.5 132-5 5.4 5.9-5.6" />
      <Path cls="line-d" d="m1.6 138.8c3.4 0.9 8.2-0.6 13.7 0.4 5.7-0.2 8.1-0.8 15.6 0.1l9.1-0.3" />
      <Path cls="dark-fill" d="m29.5 72.9 0.4 0.1-0.2 0.1z" />
    </g>
  );
};

const Door = ({glow}) => (
  <g>
    <g clipPath="url(#portal-mask)" opacity={glow}>
      <rect x="160" y="0" width="78" height="142.7" fill="url(#portal-gradient)" />
      <circle cx="214" cy="28" r="8" fill="#ffe48a" opacity="0.72" />
      <path d="M172 112 C190 102 204 112 226 99" fill="none" stroke="#4fb98a" strokeWidth="2.6" opacity="0.45" strokeLinecap="round" />
      <path d="M170 86 C190 72 202 74 224 57" fill="none" stroke="#48a1ff" strokeWidth="2" opacity="0.44" strokeLinecap="round" />
    </g>
    <Path cls="door-line" d="m166.6 22 0.5 4.2-0.2 1.6 0.6 16.4 2.4 21.8c1.7 12.1 3.3 43.1 6 57.8l1.7 13.4 0.2 0.2" />
    <Path cls="door-line" d="m166.5 21.8c2.4-0.9 14.4-6 24.6-9.6 8.4-2 15.9-5 26.6-7.2 1.5 2.5 1 4.4 1.3 8.8 1.4 13.9 1.7 26.1 4.1 41.3 2.8 14.6 4.6 28 6.8 81.6" />
    <Path cls="handle-line" d="m217.9 64.1c-1.4-0.6-2.8 0.9-4.9 0.7l0.4 11.2 5.2-1.3" />
    <Path cls="handle-line" d="m212.1 65.4 1.4-0.2-1.3 0.7 1.6 3.7-1.6 0.3 0.1 6" />
    <Path cls="dark-fill" d="m205.8 72.7c4-0.6 7.3-2 12.6-2.5l-1-1.1-11.5 2.4-0.1 1.1v0.1z" />
    <Path cls="mid-fill" d="m205.8 72.7 0.3-0.3-0.3-0.9h0.1-0.1-0.1c-0.6 0.1 0 1.1 0.1 1.2z" />
    <Path cls="handle-line" d="m212.8 76 0.5 0.1 5-1.3" />
    <Path cls="dark-fill" d="m212.9 76.5 5-1.2-0.3-0.4-4.8 0.7h-0.4z" />
    <Path cls="mid-fill" d="m212.7 76.5v-0.9l-0.4 0.1h0.1l-0.7 0.2 1 0.6z" />
    <Path cls="handle-line" d="m217.5 64c1.6 3.3 1.9 9.3 2.7 11.9l-0.6-0.1" />
  </g>
);

const PaperPortalScene = ({frame}) => {
  const photoOpacity = interpolate(frame, [0, 24, 46], [1, 0.5, 0], clamp);
  const cleanOpacity = interpolate(frame, [10, 34], [0, 1], clamp);
  const walk = interpolate(frame, [42, 122], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const figureOpacity = interpolate(frame, [24, 42, 126, 150], [0, 1, 1, 0.1], clamp);
  const dx = interpolate(walk, [0, 1], [0, 153]);
  const bob = Math.sin(walk * Math.PI * 7) * 1.15;
  const glow = interpolate(frame, [78, 116, 150], [0, 0.95, 1], clamp);
  const pulse = spring({fps: 30, frame: frame - 78, config: {damping: 120}});

  return (
    <AbsoluteFill style={{backgroundColor: '#b9b2aa'}}>
      <Img
        src={sketchImage}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: photoOpacity,
          filter: 'contrast(1.02) saturate(0.82)',
        }}
      />
      <svg
        viewBox="0 0 236.7 142.7"
        preserveAspectRatio="xMidYMid slice"
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: cleanOpacity}}
      >
        <QuiverStyles />
        <defs>
          <clipPath id="portal-mask">
            <path d="M168 22 L218 5 C220 35 224 82 230 137 L178 137 C174 107 170 62 168 22 Z" />
          </clipPath>
          <linearGradient id="portal-gradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#ffe382" stopOpacity="0" />
            <stop offset="42%" stopColor="#ffe382" stopOpacity="0.7" />
            <stop offset="72%" stopColor="#75c8ff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#79d88e" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <rect className="paper-bg" width="236.7" height="142.7" />
        <Path cls="floor-line" d="m61.6 138.7c8.8-0.3 16.7-0.6 25.3-1l16.9 0.2 6.7-0.3 8.6-0.1 9.9-0.5 11.7-0.2 10.8-0.4h11.1l15.1-0.1 6.7 0.3 14.7-0.4c3.9-0.2 8.9 0 14.7-1.4-8.8 0.5-18.9 0.8-36.2 1.4" />
        <Door glow={glow} />
        <Figure dx={dx} bob={bob} opacity={figureOpacity} />
        <path
          d="M166.5 21.8 C181 17 199 9 217.7 5 C221 36 224 88 229.9 136.7"
          fill="none"
          stroke="#fff0a8"
          strokeWidth={0.6 + pulse * 1.6}
          strokeLinecap="round"
          opacity={pulse * 0.72}
        />
      </svg>
    </AbsoluteFill>
  );
};

export const PaperPortalComp = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: '#b9b2aa'}}>
      <Sequence name="quiver figure portal attempt" from={0}>
        <PaperPortalScene frame={frame} />
      </Sequence>
    </AbsoluteFill>
  );
};
