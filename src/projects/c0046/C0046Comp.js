import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import ballTrack from './ball_track.json';
import {
  CodexCallout,
  DisclaimerOverlay,
  LabelOverlay,
  StatusLeftOverlay,
} from '../../overlay_kit/overlays.js';
import {SKETCH_FONT_FAMILY, SketchDefs} from '../../styles/sketch.js';
import {TextPlacementDemoOverlay} from '../text-effects/TextPlacementDemoOverlay.js';
import {
  APPLE_IMAGE_URL,
  BALL_RECOLOR,
  DEMO_UI,
  FPS,
  OPENER_UI,
  OVERLAY_VIEW,
  S05_BACKGROUND_BASE_URL,
  S05_BACKGROUND_DEPTH_URL,
  S05_SUBJECT_FRAMES_DIR,
  TIMING,
  VIDEO_URL,
} from './assets.js';

const resolveAssetSrc = (src, assetMap) => {
  if (!src || typeof src !== 'string') {
    return src;
  }

  let resolved = src;

  if (assetMap && typeof assetMap === 'object') {
    const mapped = assetMap[resolved];
    if (typeof mapped === 'string' && mapped.length > 0) {
      resolved = mapped;
    }
  }

  if (/^https?:\/\//i.test(resolved) || resolved.startsWith('data:')) {
    return resolved;
  }
  if (resolved.startsWith('/public/')) {
    return resolved;
  }
  if (resolved.startsWith('public/')) {
    return staticFile(resolved.slice('public/'.length));
  }
  if (resolved.startsWith('/')) {
    return staticFile(resolved.slice(1));
  }
  return staticFile(resolved);
};

const getBallTreatment = (timeInSeconds, timing) => {
  if (timeInSeconds >= timing.recolorYellow && timeInSeconds < timing.appleSwap) {
    return {
      color: BALL_RECOLOR.yellow,
      opacity: 1,
      sizeScale: 1.32,
      coverShiftX: -0.08,
      coverShiftY: -0.05,
      coverScale: 1.02,
    };
  }

  if (timeInSeconds >= timing.recolorRed && timeInSeconds < timing.recolorYellow) {
    return {
      color: BALL_RECOLOR.red,
      opacity: 1,
      sizeScale: 1.28,
      coverShiftX: -0.075,
      coverShiftY: -0.04,
      coverScale: 1.015,
    };
  }

  if (timeInSeconds >= timing.recolorBlue && timeInSeconds < timing.recolorRed) {
    return {
      color: BALL_RECOLOR.blue,
      opacity: 1,
      sizeScale: 1.28,
      coverShiftX: -0.03,
      coverShiftY: -0.02,
      coverScale: 1,
    };
  }

  if (timeInSeconds >= timing.trackStart && timeInSeconds < timing.recolorBlue) {
    return {
      color: '#ffffff',
      opacity: 0.92,
      sizeScale: 1.18,
      mode: 'outline',
    };
  }

  return null;
};

const getTrackPointForFrame = (track, frame) => {
  if (!Array.isArray(track) || track.length === 0) {
    return null;
  }

  let lo = 0;
  let hi = track.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const value = track[mid].frame;
    if (value === frame) {
      return track[mid];
    }
    if (value < frame) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  const prev = hi >= 0 ? track[hi] : null;
  const next = lo < track.length ? track[lo] : null;
  if (!prev) return next;
  if (!next) return prev;
  return Math.abs(prev.frame - frame) <= Math.abs(next.frame - frame) ? prev : next;
};

const TrackedBallOverlay = ({trackPoint, treatment}) => {
  if (!trackPoint || !treatment) {
    return null;
  }

  const size = Math.max(128, Math.round(trackPoint.r * 1.78 * (treatment.sizeScale ?? 1)));
  const leftBias = Math.round(size * 0.062);
  const topBias = Math.round(size * 0.06);
  const left = Math.round(trackPoint.cx - size / 2) - leftBias;
  const top = Math.round(trackPoint.cy - size / 2) - topBias;
  const glow = treatment.color;
  const coverShiftX = Math.round(size * (treatment.coverShiftX ?? 0));
  const coverShiftY = Math.round(size * (treatment.coverShiftY ?? 0));
  const coverScale = treatment.coverScale ?? 1;
  const isOutline = treatment.mode === 'outline';

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        borderRadius: '50%',
        opacity: treatment.opacity,
        pointerEvents: 'none',
      }}
    >
      {isOutline ? (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'visible',
          }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size * 0.425}
            fill="none"
            stroke={treatment.color}
            strokeWidth={4.6}
            filter="url(#pencil-stroke)"
            opacity={0.98}
          />
          <circle
            cx={size / 2 + 2}
            cy={size / 2 - 1}
            r={size * 0.435}
            fill="none"
            stroke={treatment.color}
            strokeWidth={1.8}
            filter="url(#pencil-stroke)"
            opacity={0.45}
          />
        </svg>
      ) : (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translate(${coverShiftX}px, ${coverShiftY}px) scale(${coverScale})`,
              transformOrigin: 'center center',
              borderRadius: '50%',
              backgroundColor: treatment.color,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              backgroundColor: treatment.color,
              boxShadow: `0 0 8px ${glow}, 0 0 18px ${glow}`,
              border: 'none',
            }}
          />
        </>
      )}
    </div>
  );
};

const AppleOverlay = ({trackPoint, assetMap}) => {
  if (!trackPoint) {
    return null;
  }

  const size = Math.max(206, Math.round(trackPoint.r * 2.78));
  const left = Math.round(trackPoint.cx - size / 2) - Math.round(size * 0.05);
  const top = Math.round(trackPoint.cy - size / 2) - Math.round(size * 0.14);

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '58%',
          width: `${size * 0.86}px`,
          height: `${size * 0.86}px`,
          transform: 'translate(-50%, -50%)',
          borderRadius: '46% 46% 52% 52%',
          backgroundColor: '#d93628',
        }}
      />
      <Img
        src={resolveAssetSrc(APPLE_IMAGE_URL, assetMap)}
        style={{
          position: 'absolute',
          inset: 0,
          width: size,
          height: size,
          objectFit: 'contain',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: `${size * 0.03}px`,
          width: `${size * 0.72}px`,
          height: `${size * 0.34}px`,
          transform: 'translateX(-50%)',
          borderRadius: '999px',
          backgroundColor: '#d93628',
        }}
      />
    </div>
  );
};

const getFadeWindowOpacity = (timeInSeconds, start, end, fadeSeconds = 0.32) => {
  if (timeInSeconds < start || timeInSeconds > end) {
    return 0;
  }

  const fadeInEnd = Math.min(end, start + fadeSeconds);
  const fadeOutStart = Math.max(start, end - fadeSeconds);

  return interpolate(
    timeInSeconds,
    [start, fadeInEnd, fadeOutStart, end],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
};

const getS05FrameSrc = (relativeFrame) => {
  if (!Number.isFinite(relativeFrame) || relativeFrame < 0) {
    return null;
  }

  const frameName = `frame-${String(relativeFrame + 1).padStart(4, '0')}.png`;
  return `${S05_SUBJECT_FRAMES_DIR}/${frameName}`;
};

const S05Backdrop = ({assetMap, depth = false}) => (
  <Img
    src={resolveAssetSrc(depth ? S05_BACKGROUND_DEPTH_URL : S05_BACKGROUND_BASE_URL, assetMap)}
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }}
  />
);

const S05SubjectFrame = ({
  assetMap,
  relativeFrame,
  opacity = 1,
  outline = false,
  outlineColor = 'rgba(34, 197, 94, 0.95)',
  filter,
}) => {
  const src = getS05FrameSrc(relativeFrame);
  if (!src) {
    return null;
  }

  const outlineFilter = [
    `drop-shadow(2px 0 0 ${outlineColor})`,
    `drop-shadow(-2px 0 0 ${outlineColor})`,
    `drop-shadow(0 2px 0 ${outlineColor})`,
    `drop-shadow(0 -2px 0 ${outlineColor})`,
    `drop-shadow(0 0 10px ${outlineColor})`,
  ].join(' ');

  return (
    <Img
      src={resolveAssetSrc(src, assetMap)}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity,
        filter: [outline ? outlineFilter : null, filter].filter(Boolean).join(' ') || undefined,
      }}
    />
  );
};

export const C0046Comp = (props) => {
  const assetMap = props?.assetMap ?? null;
  const frame = useCurrentFrame();
  const timeInSeconds = frame / FPS;
  const inBallWindow =
    timeInSeconds >= TIMING.trackStart && timeInSeconds <= TIMING.ballWindowEnd;
  const secondsToFrames = (seconds) => Math.max(0, Math.floor(seconds * FPS));
  const beatDurationInFrames = (startSeconds, endSeconds) =>
    Math.max(1, secondsToFrames(endSeconds) - secondsToFrames(startSeconds));
  const ballTreatment = getBallTreatment(timeInSeconds, TIMING);
  const appleHoldFrame = secondsToFrames(TIMING.ballWindowEnd);
  const trackFrame = timeInSeconds >= TIMING.appleSwap ? Math.min(frame, appleHoldFrame) : frame;
  const ballTrackPoint = getTrackPointForFrame(ballTrack, trackFrame);
  const s05RelativeFrame = frame - secondsToFrames(TIMING.foregroundMatteStart);
  const mattePulseOpacity = getFadeWindowOpacity(
    timeInSeconds,
    TIMING.selfMatteStart,
    TIMING.selfMatteEnd,
    0.24
  );
  const detectOutlineOpacity = getFadeWindowOpacity(
    timeInSeconds,
    TIMING.selfDetectStart,
    TIMING.selfMatteEnd,
    0.3
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        fontFamily: SKETCH_FONT_FAMILY,
      }}
    >
      <SketchDefs />

      <AbsoluteFill
        style={{
          zIndex: 180,
        }}
      >
        <Sequence name="[S01] Source Clip" from={0}>
          <OffthreadVideo
            src={resolveAssetSrc(VIDEO_URL, assetMap)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Sequence>

        <Sequence
          name="[S13] Background Replacement"
          from={secondsToFrames(TIMING.backgroundReplaceStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.backgroundReplaceStart,
            TIMING.depthTextStart
          )}
        >
          <S05Backdrop assetMap={assetMap} />
        </Sequence>

        <Sequence
          name="[S14] Depth Background"
          from={secondsToFrames(TIMING.depthTextStart)}
          durationInFrames={beatDurationInFrames(TIMING.depthTextStart, TIMING.explainStart)}
        >
          <S05Backdrop assetMap={assetMap} depth />
        </Sequence>

        <Sequence
          name="[S14A] Depth Text Behind"
          from={secondsToFrames(TIMING.depthTextStart)}
          durationInFrames={beatDurationInFrames(TIMING.depthTextStart, TIMING.explainStart)}
        >
          <TextPlacementDemoOverlay
            durationInFrames={beatDurationInFrames(TIMING.depthTextStart, TIMING.explainStart)}
            scale={1}
            variant="behind"
          />
        </Sequence>

        <Sequence
          name="[S14B] Foreground Subject"
          from={secondsToFrames(TIMING.backgroundReplaceStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.backgroundReplaceStart,
            TIMING.explainStart
          )}
        >
          <AbsoluteFill
            style={{
              pointerEvents: 'none',
              zIndex: 220,
            }}
          >
            <S05SubjectFrame assetMap={assetMap} relativeFrame={s05RelativeFrame} />
          </AbsoluteFill>
        </Sequence>

        <Sequence
          name="[S02] RAW RECORDING"
          from={Math.max(0, Math.floor(TIMING.introStart * FPS))}
          durationInFrames={Math.max(1, Math.floor((TIMING.introEnd - TIMING.introStart) * FPS))}
        >
          <LabelOverlay
            text="RAW RECORDING"
            durationInFrames={Math.max(1, Math.floor((TIMING.introEnd - TIMING.introStart) * FPS))}
            scale={OPENER_UI.labelScale}
            topPx={OPENER_UI.labelTopPx}
            leftPx={OPENER_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S03] CODEX"
          from={Math.max(0, Math.floor(TIMING.introStart * FPS))}
          durationInFrames={Math.max(1, Math.floor((TIMING.introEnd - TIMING.introStart) * FPS))}
        >
          <CodexCallout
            text="CODEX"
            durationInFrames={Math.max(1, Math.floor((TIMING.introEnd - TIMING.introStart) * FPS))}
            scale={OPENER_UI.codexScale}
            topPx={OPENER_UI.codexTopPx}
            leftPx={OPENER_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S04] Disclaimer"
          from={Math.max(0, Math.floor(TIMING.introStart * FPS))}
          durationInFrames={Math.max(1, Math.floor((TIMING.introEnd - TIMING.introStart) * FPS))}
        >
          <DisclaimerOverlay
            text="Everything that you're seeing in this video is edited by Codex"
            durationInFrames={Math.max(1, Math.floor((TIMING.introEnd - TIMING.introStart) * FPS))}
            scale={OPENER_UI.disclaimerScale}
            bottomPx={OPENER_UI.disclaimerBottomPx}
          />
        </Sequence>

        <Sequence
          name="[S05] Status: TRACKING"
          from={secondsToFrames(TIMING.trackStart)}
          durationInFrames={beatDurationInFrames(TIMING.trackStart, TIMING.recolorBlue)}
        >
          <StatusLeftOverlay
            text="TRACKING"
            durationInFrames={beatDurationInFrames(TIMING.trackStart, TIMING.recolorBlue)}
            scale={DEMO_UI.statusScale}
            topPx={DEMO_UI.statusTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S06] Callout: I'm starting to track the ball."
          from={secondsToFrames(TIMING.trackStart)}
          durationInFrames={beatDurationInFrames(TIMING.trackStart, TIMING.recolorBlue)}
        >
          <CodexCallout
            text="I'm starting to track the ball."
            durationInFrames={beatDurationInFrames(TIMING.trackStart, TIMING.recolorBlue)}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S07] Status: RECOLORING"
          from={secondsToFrames(TIMING.recolorBlue)}
          durationInFrames={beatDurationInFrames(TIMING.recolorBlue, TIMING.appleSwap)}
        >
          <StatusLeftOverlay
            text="RECOLORING"
            durationInFrames={beatDurationInFrames(TIMING.recolorBlue, TIMING.appleSwap)}
            scale={DEMO_UI.statusScale}
            topPx={DEMO_UI.statusTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S08] Callout: I'm changing it to blue."
          from={secondsToFrames(TIMING.recolorBlue)}
          durationInFrames={beatDurationInFrames(TIMING.recolorBlue, TIMING.recolorRed)}
        >
          <CodexCallout
            text="I'm changing it to blue."
            durationInFrames={beatDurationInFrames(TIMING.recolorBlue, TIMING.recolorRed)}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S09] Callout: I'm changing it to red."
          from={secondsToFrames(TIMING.recolorRed)}
          durationInFrames={beatDurationInFrames(TIMING.recolorRed, TIMING.recolorYellow)}
        >
          <CodexCallout
            text="I'm changing it to red."
            durationInFrames={beatDurationInFrames(TIMING.recolorRed, TIMING.recolorYellow)}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S10] Callout: I'm changing it to yellow."
          from={secondsToFrames(TIMING.recolorYellow)}
          durationInFrames={beatDurationInFrames(TIMING.recolorYellow, TIMING.appleSwap)}
        >
          <CodexCallout
            text="I'm changing it to yellow."
            durationInFrames={beatDurationInFrames(TIMING.recolorYellow, TIMING.appleSwap)}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S11] Status: SWAPPING"
          from={secondsToFrames(TIMING.appleSwap)}
          durationInFrames={beatDurationInFrames(TIMING.appleSwap, TIMING.appleReactionEnd)}
        >
          <StatusLeftOverlay
            text="SWAPPING"
            durationInFrames={beatDurationInFrames(TIMING.appleSwap, TIMING.appleReactionEnd)}
            scale={DEMO_UI.statusScale}
            topPx={DEMO_UI.statusTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S12] Callout: I'm replacing it with an apple."
          from={secondsToFrames(TIMING.appleSwap)}
          durationInFrames={beatDurationInFrames(TIMING.appleSwap, TIMING.appleReactionEnd)}
        >
          <CodexCallout
            text="I'm replacing it with an apple."
            durationInFrames={beatDurationInFrames(TIMING.appleSwap, TIMING.appleReactionEnd)}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S15] Status: DETECTING"
          from={secondsToFrames(TIMING.selfDetectStart)}
          durationInFrames={beatDurationInFrames(TIMING.selfDetectStart, TIMING.selfMatteStart)}
        >
          <StatusLeftOverlay
            text="DETECTING"
            durationInFrames={beatDurationInFrames(TIMING.selfDetectStart, TIMING.selfMatteStart)}
            scale={DEMO_UI.statusScale}
            topPx={DEMO_UI.statusTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S16] Callout: Detecting Adi."
          from={secondsToFrames(TIMING.selfDetectStart)}
          durationInFrames={beatDurationInFrames(TIMING.selfDetectStart, TIMING.selfMatteStart)}
        >
          <CodexCallout
            text="Detecting Adi."
            durationInFrames={beatDurationInFrames(TIMING.selfDetectStart, TIMING.selfMatteStart)}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S17] Status: MATTING"
          from={secondsToFrames(TIMING.selfMatteStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.selfMatteStart,
            TIMING.backgroundReplaceStart
          )}
        >
          <StatusLeftOverlay
            text="MATTING"
            durationInFrames={beatDurationInFrames(
              TIMING.selfMatteStart,
              TIMING.backgroundReplaceStart
            )}
            scale={DEMO_UI.statusScale}
            topPx={DEMO_UI.statusTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S18] Callout: Cropping Adi out."
          from={secondsToFrames(TIMING.selfMatteStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.selfMatteStart,
            TIMING.backgroundReplaceStart
          )}
        >
          <CodexCallout
            text="Cropping Adi out."
            durationInFrames={beatDurationInFrames(
              TIMING.selfMatteStart,
              TIMING.backgroundReplaceStart
            )}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S19] Status: COMPOSITING"
          from={secondsToFrames(TIMING.backgroundReplaceStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.backgroundReplaceStart,
            TIMING.depthTextStart
          )}
        >
          <StatusLeftOverlay
            text="COMPOSITING"
            durationInFrames={beatDurationInFrames(
              TIMING.backgroundReplaceStart,
              TIMING.depthTextStart
            )}
            scale={DEMO_UI.statusScale}
            topPx={DEMO_UI.statusTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S20] Status: DEPTH"
          from={secondsToFrames(TIMING.depthTextStart)}
          durationInFrames={beatDurationInFrames(TIMING.depthTextStart, TIMING.explainStart)}
        >
          <StatusLeftOverlay
            text="DEPTH"
            durationInFrames={beatDurationInFrames(TIMING.depthTextStart, TIMING.explainStart)}
            scale={DEMO_UI.statusScale}
            topPx={DEMO_UI.statusTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S21] Callout: Changing the background."
          from={secondsToFrames(TIMING.backgroundReplaceStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.backgroundReplaceStart,
            TIMING.depthTextStart
          )}
        >
          <CodexCallout
            text="Changing the background."
            durationInFrames={beatDurationInFrames(
              TIMING.backgroundReplaceStart,
              TIMING.depthTextStart
            )}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S22] Callout: Placing text behind Adi."
          from={secondsToFrames(TIMING.depthTextStart)}
          durationInFrames={beatDurationInFrames(TIMING.depthTextStart, TIMING.explainStart)}
        >
          <CodexCallout
            text="Placing text behind Adi."
            durationInFrames={beatDurationInFrames(TIMING.depthTextStart, TIMING.explainStart)}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>
      </AbsoluteFill>

      {OVERLAY_VIEW.showBallTrackingMask && ballTreatment ? (
        <Sequence name="[FX01] Ball Tracking Recolor" from={0}>
          <AbsoluteFill
            style={{
              opacity: inBallWindow ? ballTreatment.opacity : 0,
              pointerEvents: 'none',
              zIndex: 240,
            }}
          >
            <TrackedBallOverlay trackPoint={ballTrackPoint} treatment={ballTreatment} />
          </AbsoluteFill>
        </Sequence>
      ) : null}

      {timeInSeconds >= TIMING.appleSwap && timeInSeconds <= TIMING.appleReactionEnd ? (
        <Sequence name="[FX03] Apple Swap" from={secondsToFrames(TIMING.appleSwap)}>
          <AbsoluteFill
            style={{
              pointerEvents: 'none',
              zIndex: 245,
            }}
          >
            <AppleOverlay trackPoint={ballTrackPoint} assetMap={assetMap} />
          </AbsoluteFill>
        </Sequence>
      ) : null}

      {timeInSeconds >= TIMING.selfDetectStart && timeInSeconds <= TIMING.selfMatteEnd ? (
        <Sequence name="[FX04] Subject Outline" from={secondsToFrames(TIMING.selfDetectStart)}>
          <AbsoluteFill
            style={{
              pointerEvents: 'none',
              zIndex: 239,
            }}
          >
            {timeInSeconds >= TIMING.selfMatteStart ? (
              <S05SubjectFrame
                assetMap={assetMap}
                relativeFrame={s05RelativeFrame}
                opacity={Math.min(0.82, mattePulseOpacity * 0.9)}
                filter="brightness(0) invert(1) saturate(0) contrast(1.25)"
              />
            ) : null}
            <S05SubjectFrame
              assetMap={assetMap}
              relativeFrame={s05RelativeFrame}
              outline
              opacity={timeInSeconds >= TIMING.selfMatteStart ? mattePulseOpacity : detectOutlineOpacity}
              outlineColor={
                timeInSeconds >= TIMING.selfMatteStart
                  ? 'rgba(255, 255, 255, 0.98)'
                  : 'rgba(255, 255, 255, 0.98)'
              }
            />
          </AbsoluteFill>
        </Sequence>
      ) : null}

      {timeInSeconds >= TIMING.selfMatteStart && timeInSeconds < TIMING.backgroundReplaceStart ? (
        <Sequence name="[FX02] Matte Outline" from={secondsToFrames(TIMING.selfMatteStart)}>
          <AbsoluteFill
            style={{
              pointerEvents: 'none',
              zIndex: 220,
            }}
          >
            <S05SubjectFrame
              assetMap={assetMap}
              relativeFrame={s05RelativeFrame}
              outline
              opacity={mattePulseOpacity}
            />
          </AbsoluteFill>
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
