import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
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
  APPLE_IMAGE_URL,
  BALL_RECOLOR,
  DEMO_UI,
  DURATION_FRAMES,
  FPS,
  OPENER_UI,
  OVERLAY_VIEW,
  PERSON_MATTE_ALPHA_URL,
  S05_BACKGROUND_BASE_URL,
  S05_BACKGROUND_DEPTH_URL,
  S05_SUBJECT_FRAMES_DIR,
  SKETCH_P2A_HARNESS_EMPTY_URL,
  SKETCH_P2B_HARNESS_TOOLS_PROMPT_URL,
  SKETCH_P2C_HARNESS_CODING_URL,
  SKETCH_P2D_HARNESS_VIDEO_URL,
  SKETCH_P5_SAM_URL,
  SKETCH_P6_MATANYONE_URL,
  SKETCH_P7_REMOTION_URL,
  SKETCH_P8_TRANSCRIPTION_URL,
  SKETCH_P9_TERMINAL_URL,
  SKETCH_PANEL_UI,
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

const clamp01 = (value) => Math.max(0, Math.min(1, value));

const S05DepthText = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fadeFrames = Math.max(1, Math.floor(0.18 * fps));
  const dur = Math.max(1, Number(durationInFrames) || 1);
  const inP = clamp01(frame / fadeFrames);
  const outP = clamp01((dur - 1 - frame) / fadeFrames);
  const opacity = interpolate(inP * outP, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rise = interpolate(inP, [0, 1], [18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulse = 1 + Math.sin((frame / Math.max(1, fps)) * Math.PI * 1.1) * 0.008;
  const drift = interpolate(inP, [0, 1], [0, 16], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const driftRight = interpolate(inP, [0, 1], [0, 10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const elegantFont = '"Baskerville", "Palatino Linotype", "Times New Roman", serif';
  const sharedWordStyle = {
    fontFamily: elegantFont,
    fontWeight: 700,
    fontStyle: 'italic',
    lineHeight: 0.92,
    textTransform: 'uppercase',
    color: 'rgba(10, 5, 2, 0.88)',
    WebkitTextStroke: '4px rgba(248, 222, 155, 0.80)',
    textShadow: [
      '0 0 18px rgba(250,210,120,0.55)',
      '0 8px 36px rgba(0,0,0,0.35)',
    ].join(', '),
    whiteSpace: 'nowrap',
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translate3d(0, ${rise}px, 0) scale(${pulse})`,
        opacity,
        zIndex: 12,
        pointerEvents: 'none',
      }}
    >
      {/* TOTALLY — left side, "Y" tucks behind shoulder */}
      <span
        style={{
          position: 'absolute',
          left: '5%',
          top: '42%',
          fontSize: 128,
          letterSpacing: 10,
          transform: `translateX(${-drift}px) rotate(-2deg)`,
          ...sharedWordStyle,
        }}
      >
        TOTALLY
      </span>
      {/* NATURAL — right side, "N" tucks behind shoulder */}
      <span
        style={{
          position: 'absolute',
          right: '5%',
          top: '42%',
          fontSize: 128,
          letterSpacing: 10,
          transform: `translateX(${driftRight}px) rotate(1.5deg)`,
          ...sharedWordStyle,
        }}
      >
        NATURAL
      </span>
    </div>
  );
};

// Hand-drawn storyboard sketch panel for the S06 "How it works" explainer.
// Sits on the left third of the frame, fades in/out at the beat boundaries,
// rises slightly from below on entry. Image src is resolved through assetMap
// so cloud-render asset rewrites still work.
const SketchPanel = ({src, assetMap, durationInFrames, leftPx, topPx, widthPx, heightPx}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dur = Math.max(1, Number(durationInFrames) || 1);
  const fadeFrames = Math.max(1, Math.floor(0.32 * fps));
  const inP = clamp01(frame / fadeFrames);
  const outP = clamp01((dur - 1 - frame) / fadeFrames);
  const opacity = interpolate(inP * outP, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rise = interpolate(inP, [0, 1], [22, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: leftPx,
        top: topPx,
        width: widthPx,
        height: heightPx,
        opacity,
        transform: `translateY(${rise}px)`,
        pointerEvents: 'none',
        zIndex: 110,
      }}
    >
      <Img
        src={resolveAssetSrc(src, assetMap)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
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
            TIMING.explainStart
          )}
        >
          <S05Backdrop assetMap={assetMap} />
        </Sequence>

        <Sequence
          name="[S12B] Matte White Backdrop"
          from={secondsToFrames(TIMING.selfMatteStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.selfMatteStart,
            TIMING.backgroundReplaceStart
          )}
        >
          <AbsoluteFill
            style={{
              backgroundColor: '#ffffff',
            }}
          />
        </Sequence>

        <Sequence
          name="[S12C] Matte Subject Cutout"
          from={secondsToFrames(TIMING.selfMatteStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.selfMatteStart,
            TIMING.backgroundReplaceStart
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
          name="[S14A] Depth Text Behind"
          from={secondsToFrames(TIMING.depthTextStart)}
          durationInFrames={beatDurationInFrames(TIMING.depthTextStart, TIMING.explainStart)}
        >
          <S05DepthText durationInFrames={beatDurationInFrames(TIMING.depthTextStart, TIMING.explainStart)} />
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

        {/* ─── S06+S07+S08+S09: white backdrop + person matte through end of video ─── */}
        <Sequence
          name="[S29A] Explainer White Backdrop (through end)"
          from={secondsToFrames(TIMING.explainStart)}
          durationInFrames={Math.max(
            1,
            DURATION_FRAMES - secondsToFrames(TIMING.explainStart)
          )}
        >
          <AbsoluteFill
            style={{
              backgroundColor: '#ffffff',
            }}
          />
        </Sequence>

        <Sequence
          name="[S29B] Explainer Person Matte (Adi on white, through end)"
          from={secondsToFrames(TIMING.explainStart)}
          durationInFrames={Math.max(
            1,
            DURATION_FRAMES - secondsToFrames(TIMING.explainStart)
          )}
        >
          <AbsoluteFill
            style={{
              pointerEvents: 'none',
              zIndex: 220,
            }}
          >
            <OffthreadVideo
              src={resolveAssetSrc(PERSON_MATTE_ALPHA_URL, assetMap)}
              startFrom={secondsToFrames(TIMING.explainStart)}
              endAt={Math.max(1, DURATION_FRAMES - 2)}
              muted
              transparent
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </AbsoluteFill>
        </Sequence>


        <Sequence
          name="[S32] Sketch: P2a empty harness"
          from={secondsToFrames(TIMING.s06HarnessEmptyStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s06HarnessEmptyStart,
            TIMING.s06HarnessToolsStart
          )}
        >
          <AbsoluteFill style={{zIndex: 190, pointerEvents: 'none'}}>
            <SketchPanel
              src={SKETCH_P2A_HARNESS_EMPTY_URL}
              assetMap={assetMap}
              durationInFrames={beatDurationInFrames(
                TIMING.s06HarnessEmptyStart,
                TIMING.s06HarnessToolsStart
              )}
              leftPx={SKETCH_PANEL_UI.leftPx}
              topPx={SKETCH_PANEL_UI.topPx}
              widthPx={SKETCH_PANEL_UI.widthPx}
              heightPx={SKETCH_PANEL_UI.heightPx}
            />
          </AbsoluteFill>
        </Sequence>

        <Sequence
          name="[S32SK] Sketch: P2b harness + tools + prompt"
          from={secondsToFrames(TIMING.s06HarnessToolsStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s06HarnessToolsStart,
            TIMING.s06HarnessCodingStart
          )}
        >
          <AbsoluteFill style={{zIndex: 190, pointerEvents: 'none'}}>
            <SketchPanel
              src={SKETCH_P2B_HARNESS_TOOLS_PROMPT_URL}
              assetMap={assetMap}
              durationInFrames={beatDurationInFrames(
                TIMING.s06HarnessToolsStart,
                TIMING.s06HarnessCodingStart
              )}
              leftPx={SKETCH_PANEL_UI.leftPx}
              topPx={SKETCH_PANEL_UI.topPx}
              widthPx={SKETCH_PANEL_UI.widthPx}
              heightPx={SKETCH_PANEL_UI.heightPx}
            />
          </AbsoluteFill>
        </Sequence>

        <Sequence
          name="[S33] Sketch: P2c harness + coding tools"
          from={secondsToFrames(TIMING.s06HarnessCodingStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s06HarnessCodingStart,
            TIMING.s06HarnessVideoStart
          )}
        >
          <AbsoluteFill style={{zIndex: 190, pointerEvents: 'none'}}>
            <SketchPanel
              src={SKETCH_P2C_HARNESS_CODING_URL}
              assetMap={assetMap}
              durationInFrames={beatDurationInFrames(
                TIMING.s06HarnessCodingStart,
                TIMING.s06HarnessVideoStart
              )}
              leftPx={SKETCH_PANEL_UI.leftPx}
              topPx={SKETCH_PANEL_UI.topPx}
              widthPx={SKETCH_PANEL_UI.widthPx}
              heightPx={SKETCH_PANEL_UI.heightPx}
            />
          </AbsoluteFill>
        </Sequence>

        <Sequence
          name="[S34] Sketch: P2d harness + video tools (swap)"
          from={secondsToFrames(TIMING.s06HarnessVideoStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s06HarnessVideoStart,
            TIMING.s07SamStart
          )}
        >
          <AbsoluteFill style={{zIndex: 190, pointerEvents: 'none'}}>
            <SketchPanel
              src={SKETCH_P2D_HARNESS_VIDEO_URL}
              assetMap={assetMap}
              durationInFrames={beatDurationInFrames(
                TIMING.s06HarnessVideoStart,
                TIMING.s07SamStart
              )}
              leftPx={SKETCH_PANEL_UI.leftPx}
              topPx={SKETCH_PANEL_UI.topPx}
              widthPx={SKETCH_PANEL_UI.widthPx}
              heightPx={SKETCH_PANEL_UI.heightPx}
            />
          </AbsoluteFill>
        </Sequence>

        <Sequence
          name="[S35] Sketch: P5 SAM 3.1"
          from={secondsToFrames(TIMING.s07SamStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s07SamStart,
            TIMING.s07MatAnyoneStart
          )}
        >
          <AbsoluteFill style={{zIndex: 190, pointerEvents: 'none'}}>
            <SketchPanel
              src={SKETCH_P5_SAM_URL}
              assetMap={assetMap}
              durationInFrames={beatDurationInFrames(
                TIMING.s07SamStart,
                TIMING.s07MatAnyoneStart
              )}
              leftPx={SKETCH_PANEL_UI.leftPx}
              topPx={SKETCH_PANEL_UI.topPx}
              widthPx={SKETCH_PANEL_UI.widthPx}
              heightPx={SKETCH_PANEL_UI.heightPx}
            />
          </AbsoluteFill>
        </Sequence>

        <Sequence
          name="[S36] Sketch: P6 MatAnyone"
          from={secondsToFrames(TIMING.s07MatAnyoneStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s07MatAnyoneStart,
            TIMING.s07RemotionStart
          )}
        >
          <AbsoluteFill style={{zIndex: 190, pointerEvents: 'none'}}>
            <SketchPanel
              src={SKETCH_P6_MATANYONE_URL}
              assetMap={assetMap}
              durationInFrames={beatDurationInFrames(
                TIMING.s07MatAnyoneStart,
                TIMING.s07RemotionStart
              )}
              leftPx={SKETCH_PANEL_UI.leftPx}
              topPx={SKETCH_PANEL_UI.topPx}
              widthPx={SKETCH_PANEL_UI.widthPx}
              heightPx={SKETCH_PANEL_UI.heightPx}
            />
          </AbsoluteFill>
        </Sequence>

        <Sequence
          name="[S37] Sketch: P7 Remotion + FFmpeg"
          from={secondsToFrames(TIMING.s07RemotionStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s07RemotionStart,
            TIMING.s07TranscribeStart
          )}
        >
          <AbsoluteFill style={{zIndex: 190, pointerEvents: 'none'}}>
            <SketchPanel
              src={SKETCH_P7_REMOTION_URL}
              assetMap={assetMap}
              durationInFrames={beatDurationInFrames(
                TIMING.s07RemotionStart,
                TIMING.s07TranscribeStart
              )}
              leftPx={SKETCH_PANEL_UI.leftPx}
              topPx={SKETCH_PANEL_UI.topPx}
              widthPx={SKETCH_PANEL_UI.widthPx}
              heightPx={SKETCH_PANEL_UI.heightPx}
            />
          </AbsoluteFill>
        </Sequence>

        <Sequence
          name="[S38] Sketch: P8 Transcription (4th tool in stack)"
          from={secondsToFrames(TIMING.s07TranscribeStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s07TranscribeStart,
            TIMING.s07End
          )}
        >
          <AbsoluteFill style={{zIndex: 190, pointerEvents: 'none'}}>
            <SketchPanel
              src={SKETCH_P8_TRANSCRIPTION_URL}
              assetMap={assetMap}
              durationInFrames={beatDurationInFrames(
                TIMING.s07TranscribeStart,
                TIMING.s07End
              )}
              leftPx={SKETCH_PANEL_UI.leftPx}
              topPx={SKETCH_PANEL_UI.topPx}
              widthPx={SKETCH_PANEL_UI.widthPx}
              heightPx={SKETCH_PANEL_UI.heightPx}
            />
          </AbsoluteFill>
        </Sequence>

        <Sequence
          name="[S39] Sketch: P9 Terminal (during PROMPTING)"
          from={secondsToFrames(TIMING.s08PromptingStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s08PromptingStart,
            TIMING.s08IteratingStart
          )}
        >
          <AbsoluteFill style={{zIndex: 190, pointerEvents: 'none'}}>
            <SketchPanel
              src={SKETCH_P9_TERMINAL_URL}
              assetMap={assetMap}
              durationInFrames={beatDurationInFrames(
                TIMING.s08PromptingStart,
                TIMING.s08IteratingStart
              )}
              leftPx={SKETCH_PANEL_UI.leftPx}
              topPx={SKETCH_PANEL_UI.topPx}
              widthPx={SKETCH_PANEL_UI.widthPx}
              heightPx={SKETCH_PANEL_UI.heightPx}
            />
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

        {/* ─── S06 — How it works (harness explainer) ─── */}

        {/* Bridge: "Booting Codex" between S05 end and the harness reveal */}
        <Sequence
          name="[S29C] Status: BOOTING CODEX"
          from={secondsToFrames(TIMING.s06BridgeStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s06BridgeStart,
            TIMING.s06HarnessEmptyStart
          )}
        >
          <StatusLeftOverlay
            text="BOOTING CODEX"
            durationInFrames={beatDurationInFrames(
              TIMING.s06BridgeStart,
              TIMING.s06HarnessEmptyStart
            )}
            scale={DEMO_UI.statusScale}
            topPx={DEMO_UI.statusTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S29D] Callout: Codex is animating this too."
          from={secondsToFrames(TIMING.s06BridgeStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s06BridgeStart,
            TIMING.s06HarnessEmptyStart
          )}
        >
          <CodexCallout
            text="Codex is animating this too."
            durationInFrames={beatDurationInFrames(
              TIMING.s06BridgeStart,
              TIMING.s06HarnessEmptyStart
            )}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        {/* HOW IT WORKS pill spans the whole P2a→P2b→P2c→P2d window so it
            doesn't fade out and back in between sub-beats. Callouts still
            change per beat below. */}
        <Sequence
          name="[S30+] Status: HOW IT WORKS (continuous)"
          from={secondsToFrames(TIMING.s06HarnessEmptyStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s06HarnessEmptyStart,
            TIMING.s07SamStart
          )}
        >
          <StatusLeftOverlay
            text="HOW IT WORKS"
            durationInFrames={beatDurationInFrames(
              TIMING.s06HarnessEmptyStart,
              TIMING.s07SamStart
            )}
            scale={DEMO_UI.statusScale}
            topPx={DEMO_UI.statusTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        {/* Callouts swap per beat (text changes) */}
        <Sequence
          name="[S31] Callout: It's actually a harness."
          from={secondsToFrames(TIMING.s06HarnessEmptyStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s06HarnessEmptyStart,
            TIMING.s06HarnessToolsStart
          )}
        >
          <CodexCallout
            text="It's actually a harness."
            durationInFrames={beatDurationInFrames(
              TIMING.s06HarnessEmptyStart,
              TIMING.s06HarnessToolsStart
            )}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S32B] Callout: Tools + prompt + a loop."
          from={secondsToFrames(TIMING.s06HarnessToolsStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s06HarnessToolsStart,
            TIMING.s06HarnessCodingStart
          )}
        >
          <CodexCallout
            text="Tools + prompt + a loop."
            durationInFrames={beatDurationInFrames(
              TIMING.s06HarnessToolsStart,
              TIMING.s06HarnessCodingStart
            )}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S33B] Callout: By default, coding tools."
          from={secondsToFrames(TIMING.s06HarnessCodingStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s06HarnessCodingStart,
            TIMING.s06HarnessVideoStart
          )}
        >
          <CodexCallout
            text="By default, coding tools."
            durationInFrames={beatDurationInFrames(
              TIMING.s06HarnessCodingStart,
              TIMING.s06HarnessVideoStart
            )}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S34B] Callout: Swapped with video tools."
          from={secondsToFrames(TIMING.s06HarnessVideoStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s06HarnessVideoStart,
            TIMING.s07SamStart
          )}
        >
          <CodexCallout
            text="Swapped with video tools."
            durationInFrames={beatDurationInFrames(
              TIMING.s06HarnessVideoStart,
              TIMING.s07SamStart
            )}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        {/* ─── S07 — The stack: SAM 3.1, MatAnyone, Remotion ─── */}
        {/* THE STACK pill spans P5+P6+P7 so it doesn't fade between sub-beats. */}
        <Sequence
          name="[S35+] Status: THE STACK (continuous)"
          from={secondsToFrames(TIMING.s07SamStart)}
          durationInFrames={beatDurationInFrames(TIMING.s07SamStart, TIMING.s07End)}
        >
          <StatusLeftOverlay
            text="THE STACK"
            durationInFrames={beatDurationInFrames(TIMING.s07SamStart, TIMING.s07End)}
            scale={DEMO_UI.statusScale}
            topPx={DEMO_UI.statusTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        {/* Callouts swap per tool reveal */}
        <Sequence
          name="[S35B] Callout: SAM 3.1 — tracks objects."
          from={secondsToFrames(TIMING.s07SamStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s07SamStart,
            TIMING.s07MatAnyoneStart
          )}
        >
          <CodexCallout
            text="SAM 3.1 — tracks objects."
            durationInFrames={beatDurationInFrames(
              TIMING.s07SamStart,
              TIMING.s07MatAnyoneStart
            )}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S36B] Callout: MatAnyone — cuts a clean matte."
          from={secondsToFrames(TIMING.s07MatAnyoneStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s07MatAnyoneStart,
            TIMING.s07RemotionStart
          )}
        >
          <CodexCallout
            text="MatAnyone — cuts a clean matte."
            durationInFrames={beatDurationInFrames(
              TIMING.s07MatAnyoneStart,
              TIMING.s07RemotionStart
            )}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S37B] Callout: Remotion + FFmpeg composites it."
          from={secondsToFrames(TIMING.s07RemotionStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s07RemotionStart,
            TIMING.s07TranscribeStart
          )}
        >
          <CodexCallout
            text="Remotion + FFmpeg composites it."
            durationInFrames={beatDurationInFrames(
              TIMING.s07RemotionStart,
              TIMING.s07TranscribeStart
            )}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S38B] Callout: Transcribes everything I say."
          from={secondsToFrames(TIMING.s07TranscribeStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s07TranscribeStart,
            TIMING.s07End
          )}
        >
          <CodexCallout
            text="Transcribes everything I say."
            durationInFrames={beatDurationInFrames(
              TIMING.s07TranscribeStart,
              TIMING.s07End
            )}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        {/* ─── S08 — Workflow reality (192.32 → 247.68) ─── */}

        {/* NOT REAL-TIME */}
        <Sequence
          name="[S40A] Status: NOT REAL-TIME"
          from={secondsToFrames(TIMING.s08RealtimeStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s08RealtimeStart,
            TIMING.s08RecordingStart
          )}
        >
          <StatusLeftOverlay
            text="NOT REAL-TIME"
            durationInFrames={beatDurationInFrames(
              TIMING.s08RealtimeStart,
              TIMING.s08RecordingStart
            )}
            scale={DEMO_UI.statusScale}
            topPx={DEMO_UI.statusTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S40B] Callout: Record first, post-process later."
          from={secondsToFrames(TIMING.s08RealtimeStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s08RealtimeStart,
            TIMING.s08RecordingStart
          )}
        >
          <CodexCallout
            text="Record first, post-process later."
            durationInFrames={beatDurationInFrames(
              TIMING.s08RealtimeStart,
              TIMING.s08RecordingStart
            )}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        {/* RECORDING */}
        <Sequence
          name="[S41A] Status: RECORDING"
          from={secondsToFrames(TIMING.s08RecordingStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s08RecordingStart,
            TIMING.s08PromptingStart
          )}
        >
          <StatusLeftOverlay
            text="RECORDING"
            durationInFrames={beatDurationInFrames(
              TIMING.s08RecordingStart,
              TIMING.s08PromptingStart
            )}
            scale={DEMO_UI.statusScale}
            topPx={DEMO_UI.statusTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S41B] Callout: Record on a green screen."
          from={secondsToFrames(TIMING.s08RecordingStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s08RecordingStart,
            TIMING.s08PromptingStart
          )}
        >
          <CodexCallout
            text="Record on a green screen."
            durationInFrames={beatDurationInFrames(
              TIMING.s08RecordingStart,
              TIMING.s08PromptingStart
            )}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        {/* PROMPTING */}
        <Sequence
          name="[S42A] Status: PROMPTING"
          from={secondsToFrames(TIMING.s08PromptingStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s08PromptingStart,
            TIMING.s08IteratingStart
          )}
        >
          <StatusLeftOverlay
            text="PROMPTING"
            durationInFrames={beatDurationInFrames(
              TIMING.s08PromptingStart,
              TIMING.s08IteratingStart
            )}
            scale={DEMO_UI.statusScale}
            topPx={DEMO_UI.statusTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S42B] Callout: Tell Codex what you want."
          from={secondsToFrames(TIMING.s08PromptingStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s08PromptingStart,
            TIMING.s08IteratingStart
          )}
        >
          <CodexCallout
            text="Tell Codex what you want."
            durationInFrames={beatDurationInFrames(
              TIMING.s08PromptingStart,
              TIMING.s08IteratingStart
            )}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        {/* ITERATING */}
        <Sequence
          name="[S43A] Status: ITERATING"
          from={secondsToFrames(TIMING.s08IteratingStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s08IteratingStart,
            TIMING.s09ExperimentsStart
          )}
        >
          <StatusLeftOverlay
            text="ITERATING"
            durationInFrames={beatDurationInFrames(
              TIMING.s08IteratingStart,
              TIMING.s09ExperimentsStart
            )}
            scale={DEMO_UI.statusScale}
            topPx={DEMO_UI.statusTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S43B] Callout: Used to take hours. Now ~45 min."
          from={secondsToFrames(TIMING.s08IteratingStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s08IteratingStart,
            TIMING.s09ExperimentsStart
          )}
        >
          <CodexCallout
            text="Used to take hours. Now ~45 min."
            durationInFrames={beatDurationInFrames(
              TIMING.s08IteratingStart,
              TIMING.s09ExperimentsStart
            )}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        {/* ─── S09 — Close (247.68 → end) ─── */}

        {/* EXPERIMENTS */}
        <Sequence
          name="[S44A] Status: EXPERIMENTS"
          from={secondsToFrames(TIMING.s09ExperimentsStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s09ExperimentsStart,
            TIMING.s09OutroStart
          )}
        >
          <StatusLeftOverlay
            text="EXPERIMENTS"
            durationInFrames={beatDurationInFrames(
              TIMING.s09ExperimentsStart,
              TIMING.s09OutroStart
            )}
            scale={DEMO_UI.statusScale}
            topPx={DEMO_UI.statusTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S44B] Callout: Many don't work. Some do."
          from={secondsToFrames(TIMING.s09ExperimentsStart)}
          durationInFrames={beatDurationInFrames(
            TIMING.s09ExperimentsStart,
            TIMING.s09OutroStart
          )}
        >
          <CodexCallout
            text="Many don't work. Some do."
            durationInFrames={beatDurationInFrames(
              TIMING.s09ExperimentsStart,
              TIMING.s09OutroStart
            )}
            scale={DEMO_UI.calloutScale}
            topPx={DEMO_UI.calloutTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        {/* OUTRO — final stamp */}
        <Sequence
          name="[S45A] Status: WRAP UP"
          from={secondsToFrames(TIMING.s09OutroStart)}
          durationInFrames={Math.max(
            1,
            DURATION_FRAMES - secondsToFrames(TIMING.s09OutroStart)
          )}
        >
          <StatusLeftOverlay
            text="100% EDITED BY CODEX"
            durationInFrames={Math.max(
              1,
              DURATION_FRAMES - secondsToFrames(TIMING.s09OutroStart)
            )}
            scale={DEMO_UI.statusScale}
            topPx={DEMO_UI.statusTopPx}
            leftPx={DEMO_UI.leftPx}
          />
        </Sequence>

        <Sequence
          name="[S45B] Callout: Hope this was useful."
          from={secondsToFrames(TIMING.s09OutroStart)}
          durationInFrames={Math.max(
            1,
            DURATION_FRAMES - secondsToFrames(TIMING.s09OutroStart)
          )}
        >
          <CodexCallout
            text="Hope this was useful."
            durationInFrames={Math.max(
              1,
              DURATION_FRAMES - secondsToFrames(TIMING.s09OutroStart)
            )}
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
            <S05SubjectFrame
              assetMap={assetMap}
              relativeFrame={s05RelativeFrame}
              outline
              opacity={timeInSeconds >= TIMING.selfMatteStart ? mattePulseOpacity : detectOutlineOpacity}
              outlineColor={
                timeInSeconds >= TIMING.selfMatteStart
                  ? 'rgba(125, 211, 252, 0.95)'
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
