import React from 'react';
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import {resolveAssetSrc} from '../../lib/resolveAssetSrc.js';
import {TRANSITION_FRAMES} from './assets.js';
import {CLIP_SEQUENCE} from './transitionClips.js';

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
};

const clipStarts = CLIP_SEQUENCE.reduce((starts, clip, index) => {
  if (index === 0) {
    starts.push(0);
    return starts;
  }
  const prevStart = starts[index - 1];
  const prevDuration = CLIP_SEQUENCE[index - 1].durationFrames;
  starts.push(prevStart + prevDuration - TRANSITION_FRAMES);
  return starts;
}, []);

const transitionWindows = clipStarts.slice(1).map((start, index) => ({
  start,
  accent: CLIP_SEQUENCE[index + 1].accent,
}));

const ease = (value) =>
  Easing.bezier(0.16, 1, 0.3, 1)(Math.max(0, Math.min(1, value)));

const getFade = (frame, clipIndex, durationFrames) => {
  const intro =
    clipIndex === 0
      ? 1
      : interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
  const outro =
    clipIndex === CLIP_SEQUENCE.length - 1
      ? 1
      : interpolate(
          frame,
          [durationFrames - TRANSITION_FRAMES, durationFrames],
          [1, 0],
          {
            ...clamp,
            easing: Easing.bezier(0.7, 0, 0.84, 0),
          }
        );
  return Math.min(intro, outro);
};

const getPortalPush = (frame, clipIndex, durationFrames) => {
  const intro =
    clipIndex === 0
      ? 0
      : interpolate(frame, [0, TRANSITION_FRAMES], [1, 0], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
  const outro =
    clipIndex === CLIP_SEQUENCE.length - 1
      ? 0
      : interpolate(
          frame,
          [durationFrames - TRANSITION_FRAMES, durationFrames],
          [0, 1],
          {
            ...clamp,
            easing: Easing.bezier(0.7, 0, 0.84, 0),
          }
        );
  return Math.max(intro, outro);
};

const ClipLayer = ({assetMap, clip, index}) => {
  const frame = useCurrentFrame();
  const fade = getFade(frame, index, clip.durationFrames);
  const push = getPortalPush(frame, index, clip.durationFrames);
  const shake = push > 0.02 ? Math.sin(frame * 1.9 + index) * push : 0;
  const microJolt = push > 0.6 ? Math.sin(frame * 4.2) * (push - 0.6) * 3 : 0;
  const scale = 1 + push * 0.055;
  const x = push * 10 + shake * 1.6;
  const y = shake * 0.9 + microJolt;
  const brightness = 1 + push * 0.22;
  const saturation = 1 + push * 0.14;
  const blur = push * 1.2;

  return (
    <AbsoluteFill
      style={{
        opacity: fade,
        overflow: 'hidden',
        backgroundColor: '#f5f1e6',
        transformOrigin: '79% 52%',
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        filter: `brightness(${brightness}) saturate(${saturation}) blur(${blur}px)`,
      }}
    >
      <OffthreadVideo
        src={resolveAssetSrc(clip.src, assetMap)}
        volume={Math.max(0, Math.min(clip.baseVolume, fade * clip.baseVolume))}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </AbsoluteFill>
  );
};

const TransitionBurst = ({accent, progress}) => {
  const eased = ease(progress);
  const peak = Math.sin(Math.PI * eased);
  const hardFlash = interpolate(peak, [0.72, 1], [0, 0.62], clamp);
  const portalScale = interpolate(peak, [0, 1], [0.22, 1.35], clamp);
  const streakOpacity = interpolate(peak, [0.15, 0.95], [0, 0.85], clamp);
  const chromaOpacity = interpolate(peak, [0.25, 1], [0, 0.38], clamp);
  const shake = Math.sin(progress * Math.PI * 18) * peak * 5;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        transform: `translate3d(${shake}px, ${-shake * 0.35}px, 0)`,
      }}
    >
      <AbsoluteFill
        style={{
          opacity: peak,
          mixBlendMode: 'screen',
          background: `radial-gradient(circle at 79% 52%, rgba(255,255,255,0.98) 0%, rgba(255,244,183,0.92) ${
            10 + portalScale * 8
          }%, ${accent} ${24 + portalScale * 8}%, rgba(255,255,255,0.18) ${
            42 + portalScale * 12
          }%, rgba(255,255,255,0) ${66 + portalScale * 8}%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: streakOpacity,
          mixBlendMode: 'screen',
          background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 38%, ${accent} 48%, rgba(255,255,255,0.95) 55%, rgba(255,255,255,0.16) 67%, rgba(255,255,255,0) 100%)`,
          transformOrigin: '79% 52%',
          transform: `scaleX(${0.55 + portalScale * 1.1})`,
          filter: 'blur(8px)',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: chromaOpacity,
          mixBlendMode: 'screen',
          background:
            'linear-gradient(115deg, rgba(41,231,255,0.32), rgba(255,68,199,0.2), rgba(255,232,125,0.28))',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: hardFlash,
          backgroundColor: '#fffdf4',
        }}
      />
    </AbsoluteFill>
  );
};

const PortalTransitionOverlay = () => {
  const frame = useCurrentFrame();

  return (
    <>
      {transitionWindows.map((transition, index) => {
        const progress = interpolate(
          frame,
          [transition.start, transition.start + TRANSITION_FRAMES],
          [0, 1],
          clamp
        );
        if (progress <= 0 || progress >= 1) {
          return null;
        }
        return (
          <TransitionBurst
            key={`${transition.start}-${index}`}
            accent={transition.accent}
            progress={progress}
          />
        );
      })}
    </>
  );
};

export const PaperPortalTransitionComp = ({assetMap}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#f5f1e6'}}>
      {CLIP_SEQUENCE.map((clip, index) => (
        <Sequence
          key={clip.id}
          name={`${String(index + 1).padStart(2, '0')} ${clip.label}`}
          from={clipStarts[index]}
          durationInFrames={clip.durationFrames}
        >
          <ClipLayer assetMap={assetMap} clip={clip} index={index} />
        </Sequence>
      ))}
      <PortalTransitionOverlay />
    </AbsoluteFill>
  );
};
