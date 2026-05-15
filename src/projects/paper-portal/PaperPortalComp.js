import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import sketchImage from './media/sketch-crop.jpg';
import quiverSvg from './media/quiver-vector.svg';

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
};

const line = {
  fill: 'none',
  stroke: '#34312d',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const SketchPlate = ({frame}) => {
  const settle = spring({fps: 30, frame, config: {damping: 180}});
  const photoOpacity = interpolate(frame, [0, 34, 62], [1, 0.72, 0.28], clamp);
  const vectorOpacity = interpolate(frame, [14, 40, 72], [0, 0.62, 0.96], clamp);
  const vectorLift = interpolate(frame, [28, 64], [6, 0], clamp);

  return (
    <AbsoluteFill style={{backgroundColor: '#a8a29d'}}>
      <Img
        src={sketchImage}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: photoOpacity,
          filter: `contrast(${1.02 - settle * 0.06}) saturate(${0.95 - settle * 0.2})`,
        }}
      />
      <Img
        src={quiverSvg}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: vectorOpacity,
          transform: `translateY(${vectorLift}px) scale(${1 + (1 - settle) * 0.012})`,
          mixBlendMode: 'multiply',
        }}
      />
    </AbsoluteFill>
  );
};

const ColorWorld = ({frame}) => {
  const reveal = interpolate(frame, [88, 132], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const wash = interpolate(frame, [98, 148], [0, 1], clamp);

  return (
    <AbsoluteFill style={{opacity: wash}}>
      <div
        style={{
          position: 'absolute',
          left: 1180,
          top: 0,
          bottom: 0,
          width: 760 * reveal,
          background:
            'linear-gradient(90deg, rgba(255,210,73,0.0) 0%, rgba(255,210,73,0.34) 22%, rgba(72,181,255,0.32) 62%, rgba(91,220,130,0.28) 100%)',
          boxShadow: `0 0 ${80 * reveal}px rgba(255, 209, 67, 0.38)`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 110,
            top: 190,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,244,173,0.65), rgba(255,244,173,0))',
          }}
        />
        <svg viewBox="0 0 760 1080" style={{width: '760px', height: '1080px'}}>
          <path d="M80 840 C210 790 340 850 505 790 C610 755 690 790 750 760" stroke="#36a269" strokeWidth="18" fill="none" opacity="0.42" strokeLinecap="round" />
          <path d="M120 760 C230 700 310 730 390 650 C470 570 575 600 695 520" stroke="#2689ff" strokeWidth="12" fill="none" opacity="0.38" strokeLinecap="round" />
          <circle cx="560" cy="245" r="54" fill="#ffd24a" opacity="0.68" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const WalkingFigure = ({frame}) => {
  const walk = interpolate(frame, [42, 118], [0, 1], clamp);
  const fade = interpolate(frame, [30, 48, 124, 150], [0, 1, 1, 0.2], clamp);
  const x = interpolate(walk, [0, 1], [450, 1265]);
  const y = interpolate(walk, [0, 0.7, 1], [632, 690, 728]);
  const step = Math.sin(walk * Math.PI * 8);
  const color = interpolate(frame, [94, 136], [0, 1], clamp);

  return (
    <AbsoluteFill style={{opacity: fade}}>
      <svg viewBox="0 0 1920 1080" style={{width: '100%', height: '100%'}}>
        <g transform={`translate(${x} ${y - Math.abs(step) * 10}) rotate(${walk * 3})`}>
          <g opacity={1 - color} strokeWidth="8" {...line}>
            <ellipse cx="0" cy="-228" rx="52" ry="64" fill="#a8a29d" />
            <path d="M-22 -236 L-10 -229" />
            <path d="M20 -230 L36 -244" />
            <path d="M-16 -204 C4 -188 30 -190 48 -208" />
            <path d="M0 -162 L0 20" />
            <path d={`M0 -128 L${-82 - step * 18} ${-36 + step * 18}`} />
            <path d={`M0 -128 L${96 + step * 20} ${-48 - step * 16}`} />
            <path d={`M0 20 L${-78 + step * 42} 190`} />
            <path d={`M0 20 L${88 - step * 42} 190`} />
          </g>
          <g opacity={color} stroke="#1769ff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <ellipse cx="0" cy="-228" rx="52" ry="64" fill="#ffe16a" />
            <path d="M0 -162 L0 20" />
            <path d={`M0 -128 L${-82 - step * 18} ${-36 + step * 18}`} />
            <path d={`M0 -128 L${96 + step * 20} ${-48 - step * 16}`} />
            <path d={`M0 20 L${-78 + step * 42} 190`} />
            <path d={`M0 20 L${88 - step * 42} 190`} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const PaperPortalComp = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const portalPulse = spring({fps, frame: frame - 82, config: {damping: 120}});

  return (
    <AbsoluteFill style={{backgroundColor: '#a8a29d'}}>
      <Sequence name="paper sketch source" from={0}>
        <SketchPlate frame={frame} />
      </Sequence>
      <Sequence name="door color reveal" from={0}>
        <ColorWorld frame={frame} />
      </Sequence>
      <Sequence name="svg figure walks through portal" from={0}>
        <WalkingFigure frame={frame} />
      </Sequence>
      <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        <path
          d="M1335 178 C1400 170 1506 146 1608 112 C1632 312 1646 620 1656 1018"
          stroke="#fff1a7"
          strokeWidth={12 + portalPulse * 18}
          fill="none"
          opacity={portalPulse * 0.44}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </AbsoluteFill>
  );
};
