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
import {
  CREDIT_DRAW_FRAMES,
  END_CARD_FADE_OUT_FRAMES,
  END_CARD_TRANSITION_FRAMES,
  END_CARD_VIDEO_DURATION_FRAMES,
  END_CARD_VIDEO_PLAYBACK_RATE,
  END_CARD_VIDEO_START_FROM_FRAMES,
  MAIN_SEQUENCE_DURATION_FRAMES,
  TRANSITION_FRAMES,
} from './assets.js';
import {PaperPortalCreditDrawPreviewComp} from './CreditDrawPreviewComp.js';
import {CLIP_SEQUENCE} from './transitionClips.js';

const END_CARD_VIDEO_SRC =
  'imports/paper-portal/end-card/01-end-card-normalized-1920x1080.mp4';

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

const rgba = (hex, alpha) => {
  const normalized = hex.replace('#', '');
  const value = Number.parseInt(normalized.length === 3 ? normalized.repeat(2) : normalized, 16);
  if (!Number.isFinite(value)) {
    return `rgba(255, 226, 135, ${alpha})`;
  }
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getFade = (frame, clipIndex, durationFrames) => {
  const intro =
    clipIndex === 0
      ? 1
      : interpolate(frame, [0, TRANSITION_FRAMES * 0.42, TRANSITION_FRAMES], [0, 0, 1], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
  const outro =
    clipIndex === CLIP_SEQUENCE.length - 1
      ? 1
      : interpolate(
          frame,
          [durationFrames - TRANSITION_FRAMES, durationFrames - TRANSITION_FRAMES * 0.58, durationFrames],
          [1, 0, 0],
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

const PortalVeil = ({accent, progress}) => {
  if (progress <= 0) {
    return null;
  }
  const ambientOpacity = interpolate(progress, [0, 0.42, 1], [0, 0.48, 0.68], clamp);
  const coreOpacity = interpolate(progress, [0, 0.32, 1], [0, 0.78, 0.94], clamp);
  const rimOpacity = interpolate(progress, [0.18, 0.68, 1], [0, 0.68, 0.34], clamp);
  const core = rgba(accent, 0.7);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
      }}
    >
      <AbsoluteFill
        style={{
          opacity: ambientOpacity,
          background: `radial-gradient(ellipse at 79% 52%, rgba(255, 238, 174, 0.92) 0%, ${core} 18%, rgba(255, 231, 145, 0.48) 31%, rgba(255, 231, 145, 0.16) 43%, rgba(255, 255, 255, 0) 58%)`,
          filter: 'blur(4px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '72.6%',
          top: '16.5%',
          width: '20.5%',
          height: '70%',
          opacity: coreOpacity,
          borderRadius: '52% 48% 46% 54% / 42% 47% 53% 58%',
          background: `radial-gradient(ellipse at 50% 46%, rgba(255, 255, 247, 0.98) 0%, rgba(255, 239, 177, 0.95) 30%, ${rgba(
            accent,
            0.88
          )} 58%, rgba(255, 223, 122, 0.24) 82%, rgba(255, 255, 255, 0) 100%)`,
          boxShadow: `0 0 34px ${rgba(accent, 0.58)}, inset 0 0 28px rgba(255, 255, 255, 0.74)`,
          filter: 'blur(3px)',
          transform: `scale(${0.96 + progress * 0.08}) skewX(-1.4deg)`,
          transformOrigin: '50% 52%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '70.8%',
          top: '12%',
          width: '23.5%',
          height: '77%',
          opacity: rimOpacity,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 52%, rgba(255, 255, 255, 0) 42%, ${rgba(
            accent,
            0.74
          )} 55%, rgba(255, 248, 206, 0.72) 61%, rgba(255, 255, 255, 0) 73%)`,
          filter: 'blur(4px)',
        }}
      />
    </AbsoluteFill>
  );
};

const ClipLayer = ({assetMap, clip, index}) => {
  const frame = useCurrentFrame();
  const fade = getFade(frame, index, clip.durationFrames);
  const push = getPortalPush(frame, index, clip.durationFrames);
  const veilLeadFrames = clip.veilLeadFrames ?? 38;
  const veilProgress =
    index === 0 || index === CLIP_SEQUENCE.length - 1
      ? 0
      : interpolate(
          frame,
          [
            Math.max(0, clip.durationFrames - TRANSITION_FRAMES - veilLeadFrames),
            clip.durationFrames - TRANSITION_FRAMES * 0.72,
          ],
          [0, 1],
          clamp
        );
  const shake = push > 0.02 ? Math.sin(frame * 1.9 + index) * push : 0;
  const microJolt = push > 0.6 ? Math.sin(frame * 4.2) * (push - 0.6) * 3 : 0;
  const scale = 1 + push * 0.045;
  const x = push * 8 + shake * 1.25;
  const y = shake * 0.7 + microJolt * 0.75;
  const brightness = 1 + push * 0.16;
  const saturation = 1 + push * 0.12;
  const blur = push * 0.75;

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
      <PortalVeil accent={clip.accent} progress={veilProgress} />
    </AbsoluteFill>
  );
};

const TransitionBurst = ({accent, progress}) => {
  const eased = ease(progress);
  const peak = Math.sin(Math.PI * eased);
  const hardFlash = interpolate(peak, [0.82, 1], [0, 0.28], clamp);
  const portalScale = interpolate(peak, [0, 1], [0.2, 1.28], clamp);
  const streakOpacity = interpolate(peak, [0.15, 0.95], [0, 0.85], clamp);
  const chromaOpacity = interpolate(peak, [0.25, 1], [0, 0.38], clamp);
  const ringOpacity = interpolate(peak, [0.12, 0.82, 1], [0, 0.86, 0.25], clamp);
  const tunnelOpacity = interpolate(peak, [0.18, 0.9], [0, 0.28], clamp);
  const curtainOpacity = interpolate(peak, [0.2, 0.84, 1], [0, 0.78, 0.5], clamp);
  const shake = Math.sin(progress * Math.PI * 18) * peak * 3.5;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        transform: `translate3d(${shake}px, ${-shake * 0.35}px, 0)`,
      }}
    >
      <AbsoluteFill
        style={{
          opacity: curtainOpacity,
          background: `radial-gradient(circle at 79% 52%, rgba(255, 238, 176, 0.96) 0%, ${rgba(
            accent,
            0.76
          )} 24%, rgba(255, 245, 198, 0.78) 43%, rgba(255, 255, 255, 0.14) 68%, rgba(255, 255, 255, 0) 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: peak,
          mixBlendMode: 'screen',
          background: `radial-gradient(circle at 79% 52%, rgba(255,255,255,0.96) 0%, rgba(255,244,183,0.86) ${
            9 + portalScale * 7
          }%, ${accent} ${22 + portalScale * 7}%, rgba(255,255,255,0.12) ${
            38 + portalScale * 10
          }%, rgba(255,255,255,0) ${58 + portalScale * 7}%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: ringOpacity,
          mixBlendMode: 'screen',
          background: `radial-gradient(ellipse at 79% 52%, rgba(255,255,255,0) 0%, rgba(255,255,255,0) ${
            13 + portalScale * 5
          }%, ${accent} ${18 + portalScale * 7}%, rgba(255,255,255,0.9) ${
            21 + portalScale * 8
          }%, rgba(255,255,255,0) ${31 + portalScale * 10}%)`,
          filter: 'blur(2px)',
          transformOrigin: '79% 52%',
          transform: `scale(${0.82 + portalScale * 0.36})`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: streakOpacity,
          mixBlendMode: 'screen',
          background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 38%, ${accent} 48%, rgba(255,255,255,0.8) 55%, rgba(255,255,255,0.14) 67%, rgba(255,255,255,0) 100%)`,
          transformOrigin: '79% 52%',
          transform: `scaleX(${0.55 + portalScale * 1.1})`,
          filter: 'blur(8px)',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: tunnelOpacity,
          mixBlendMode: 'screen',
          background: `conic-gradient(from ${progress * 120}deg at 79% 52%, rgba(255,255,255,0), ${accent}, rgba(255,255,255,0.42), rgba(255,255,255,0), ${accent}, rgba(255,255,255,0))`,
          filter: 'blur(10px)',
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

const EndCardVideoLayer = ({assetMap}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [
      0,
      END_CARD_TRANSITION_FRAMES,
      Math.max(
        END_CARD_TRANSITION_FRAMES + 1,
        END_CARD_VIDEO_DURATION_FRAMES - END_CARD_FADE_OUT_FRAMES
      ),
      END_CARD_VIDEO_DURATION_FRAMES,
    ],
    [0, 1, 1, 0],
    clamp
  );

  return (
    <AbsoluteFill style={{backgroundColor: '#f5f1e6', opacity}}>
      <OffthreadVideo
        src={resolveAssetSrc(END_CARD_VIDEO_SRC, assetMap)}
        startFrom={END_CARD_VIDEO_START_FROM_FRAMES}
        playbackRate={END_CARD_VIDEO_PLAYBACK_RATE}
        volume={0}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </AbsoluteFill>
  );
};

export const PaperPortalTransitionComp = ({assetMap}) => {
  const endCardStart = MAIN_SEQUENCE_DURATION_FRAMES + CREDIT_DRAW_FRAMES;

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
      <Sequence
        name="08 Created by Adityan draw-on"
        from={MAIN_SEQUENCE_DURATION_FRAMES}
        durationInFrames={CREDIT_DRAW_FRAMES}
      >
        <PaperPortalCreditDrawPreviewComp />
      </Sequence>
      <Sequence
        name="09 End-card source video"
        from={endCardStart}
        durationInFrames={END_CARD_VIDEO_DURATION_FRAMES}
      >
        <EndCardVideoLayer assetMap={assetMap} />
      </Sequence>
    </AbsoluteFill>
  );
};
