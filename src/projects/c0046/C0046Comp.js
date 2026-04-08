import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
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
import {
  BALL_RECOLOR,
  DEMO_UI,
  FPS,
  OPENER_UI,
  OVERLAY_VIEW,
  PERSON_MATTE_ALPHA_URL,
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
    };
  }

  if (timeInSeconds >= timing.recolorRed && timeInSeconds < timing.recolorYellow) {
    return {
      color: BALL_RECOLOR.red,
      opacity: 1,
    };
  }

  if (timeInSeconds >= timing.recolorBlue && timeInSeconds < timing.recolorRed) {
    return {
      color: BALL_RECOLOR.blue,
      opacity: 1,
    };
  }

  if (timeInSeconds >= timing.trackStart && timeInSeconds < timing.recolorBlue) {
    return {
      color: '#ffffff',
      opacity: 0.72,
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

  const size = Math.max(102, Math.round(trackPoint.r * 1.5));
  const leftBias = Math.round(size * 0.028);
  const topBias = Math.round(size * 0.032);
  const left = Math.round(trackPoint.cx - size / 2) - leftBias;
  const top = Math.round(trackPoint.cy - size / 2) - topBias;
  const glow = treatment.color;

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
        background: `radial-gradient(circle at 34% 30%, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.7) 12%, ${treatment.color} 28%, ${treatment.color} 82%, rgba(255,255,255,0.22) 100%)`,
        boxShadow: `0 0 14px ${glow}, 0 0 30px ${glow}`,
        border: `1.5px solid rgba(255,255,255,0.18)`,
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
  const ballTrackPoint = getTrackPointForFrame(ballTrack, frame);

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
            text="Everything that you're seeing in this video is rendered by Codex"
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
          name="[S06] Callout: Black ball tracked"
          from={secondsToFrames(TIMING.trackStart)}
          durationInFrames={beatDurationInFrames(TIMING.trackStart, TIMING.recolorBlue)}
        >
          <CodexCallout
            text="Black ball tracked"
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
          name="[S08] Callout: Only the ball changes"
          from={secondsToFrames(TIMING.recolorBlue)}
          durationInFrames={beatDurationInFrames(TIMING.recolorBlue, TIMING.recolorRed)}
        >
          <CodexCallout
            text="Only the ball changes"
            durationInFrames={beatDurationInFrames(TIMING.recolorBlue, TIMING.recolorRed)}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S09] Callout: Tracked region updated"
          from={secondsToFrames(TIMING.recolorRed)}
          durationInFrames={beatDurationInFrames(TIMING.recolorRed, TIMING.recolorYellow)}
        >
          <CodexCallout
            text="Tracked region updated"
            durationInFrames={beatDurationInFrames(TIMING.recolorRed, TIMING.recolorYellow)}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S10] Callout: Mask stays stable"
          from={secondsToFrames(TIMING.recolorYellow)}
          durationInFrames={beatDurationInFrames(TIMING.recolorYellow, TIMING.appleSwap)}
        >
          <CodexCallout
            text="Mask stays stable"
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
          name="[S12] Callout: Object replaced"
          from={secondsToFrames(TIMING.appleSwap)}
          durationInFrames={beatDurationInFrames(TIMING.appleSwap, TIMING.appleReactionEnd)}
        >
          <CodexCallout
            text="Object replaced"
            durationInFrames={beatDurationInFrames(TIMING.appleSwap, TIMING.appleReactionEnd)}
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

      {OVERLAY_VIEW.showForegroundMatte ? (
        <Sequence name="[FX02] Foreground Matte" from={0}>
          <AbsoluteFill
            style={{
              pointerEvents: 'none',
              opacity: timeInSeconds >= TIMING.foregroundMatteStart ? 1 : 0,
              zIndex: 220,
            }}
          >
            <OffthreadVideo
              src={resolveAssetSrc(PERSON_MATTE_ALPHA_URL, assetMap)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </AbsoluteFill>
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
