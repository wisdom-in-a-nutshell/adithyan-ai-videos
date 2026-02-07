import React from 'react';
import {
  Img,
  Video,
  staticFile,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';
import {
  SKETCH_FONT_FAMILY,
  SketchDefs,
  SketchLayer,
} from './styles/sketch.js';
import {CanvasSketchFrame, OverlayRenderer} from './overlay_kit/index.js';
import timeline from './data/timeline.json';
import activeSpeakerFrames from './data/active_speaker_frames.json';
import defaultTranscriptWords from './data/transcript.json';

const DEFAULT_RESOLUTION = {width: 1920, height: 1080};
const TRANSITION_SECONDS = 0.35;
const SMOOTHING_WINDOW_SECONDS = 0.4;
const SMOOTHING_ALPHA = 0.35;
const CANVAS_IN_START = 57.0;
const CANVAS_IN_END = 57.7;
const LEAD_OUT_START = 50.6;
const LEAD_OUT_END = 51.4;
const lerp = (a, b, t) => a + (b - a) * t;

const resolveAssetSrc = (src) => {
  if (!src || typeof src !== 'string') {
    return src;
  }
  if (/^https?:\/\//i.test(src) || src.startsWith('data:')) {
    return src;
  }
  if (src.startsWith('/')) {
    return staticFile(src.slice(1));
  }
  return staticFile(src);
};

const getCropAtTime = (timeSeconds, scenes) => {
  if (!scenes || scenes.length === 0) {
    return null;
  }

  let currentIndex = scenes.findIndex(
    (scene) => timeSeconds >= scene.start_seconds && timeSeconds < scene.end_seconds
  );
  if (currentIndex === -1) {
    currentIndex = scenes.length - 1;
  }

  const current = scenes[currentIndex];
  const next = scenes[currentIndex + 1];
  if (!next) {
    return current.crop;
  }

  const transitionStart = current.end_seconds - TRANSITION_SECONDS;
  if (timeSeconds < transitionStart) {
    return current.crop;
  }

  const progress = Math.min(
    1,
    Math.max(0, (timeSeconds - transitionStart) / TRANSITION_SECONDS)
  );

  return {
    ...current.crop,
    x: lerp(current.crop.x, next.crop.x, progress),
    y: lerp(current.crop.y, next.crop.y, progress),
    width: lerp(current.crop.width, next.crop.width, progress),
    height: lerp(current.crop.height, next.crop.height, progress),
  };
};

const getActiveRectAtTime = (timeSeconds, frames) => {
  if (!frames || frames.length === 0) {
    return null;
  }

  let prev = frames[0];
  for (const frame of frames) {
    if (frame.timestamp_s >= timeSeconds) {
      const prevDiff = Math.abs(prev.timestamp_s - timeSeconds);
      const currDiff = Math.abs(frame.timestamp_s - timeSeconds);
      const nearest = currDiff < prevDiff ? frame : prev;
      const faces = nearest.faces || [];
      if (!faces.length) {
        return null;
      }
      const active = faces.filter((face) => face.is_active);
      const pick = (list) =>
        list.reduce((best, face) =>
          face.speaking_score > best.speaking_score ? face : best
        );
      const face = active.length ? pick(active) : pick(faces);
      return {
        x: face.x1,
        y: face.y1,
        width: face.x2 - face.x1,
        height: face.y2 - face.y1,
      };
    }
    prev = frame;
  }

  const last = frames[frames.length - 1];
  const faces = last.faces || [];
  if (!faces.length) {
    return null;
  }
  const active = faces.filter((face) => face.is_active);
  const pick = (list) =>
    list.reduce((best, face) =>
      face.speaking_score > best.speaking_score ? face : best
    );
  const face = active.length ? pick(active) : pick(faces);
  return {
    x: face.x1,
    y: face.y1,
    width: face.x2 - face.x1,
    height: face.y2 - face.y1,
  };
};

const smoothRect = (current, next, alpha) => ({
  x: lerp(current.x, next.x, alpha),
  y: lerp(current.y, next.y, alpha),
  width: lerp(current.width, next.width, alpha),
  height: lerp(current.height, next.height, alpha),
});

const getSmoothedRectAtTime = (timeSeconds, frames) => {
  if (!frames || frames.length === 0) {
    return null;
  }
  const windowStart = timeSeconds - SMOOTHING_WINDOW_SECONDS;
  const window = frames.filter(
    (frame) => frame.timestamp_s >= windowStart && frame.timestamp_s <= timeSeconds
  );
  if (!window.length) {
    return getActiveRectAtTime(timeSeconds, frames);
  }
  let smoothed = null;
  for (const frame of window) {
    const rect = getActiveRectAtTime(frame.timestamp_s, frames);
    if (!rect) {
      continue;
    }
    smoothed = smoothed ? smoothRect(smoothed, rect, SMOOTHING_ALPHA) : rect;
  }
  return smoothed ?? getActiveRectAtTime(timeSeconds, frames);
};

const getLayoutMode = (timeSeconds, sections) => {
  if (!sections) {
    return 'full';
  }
  const layoutForSection = (sectionName) => {
    if (sectionName === 'hook_polished' || sectionName === 'canvas_and_tools') {
      return 'canvas';
    }
    return 'full';
  };
  if (sections.length > 0 && timeSeconds < sections[0].start) {
    return layoutForSection(sections[0].name);
  }
  const section = sections.find(
    (item) => timeSeconds >= item.start && timeSeconds < item.end
  );
  if (!section) {
    return 'full';
  }
  return layoutForSection(section.name);
};

const TalkingHeadOverlay = ({videoUrl, crop, resolution, muted, style}) => {
  const {width: outputW, height: outputH} = useVideoConfig();
  const boxSize = Math.round(outputW * 0.28);
  const margin = 24;
  const x = outputW - boxSize - margin;
  const y = outputH - boxSize - margin;

  if (!crop) {
    return null;
  }

  const scale = boxSize / crop.width;
  const translateX = -crop.x * scale;
  const translateY = -crop.y * scale;

  return (
    <div
      style={{
        position: 'absolute',
        width: boxSize,
        height: boxSize,
        left: x,
        top: y,
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
        border: '2px solid rgba(255,255,255,0.5)',
        backgroundColor: '#000',
        ...style,
      }}
    >
      <Video
        src={resolveAssetSrc(videoUrl)}
        muted={muted}
        style={{
          width: resolution.width,
          height: resolution.height,
          position: 'absolute',
          transformOrigin: 'top left',
          transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        }}
      />
    </div>
  );
};

export const MainVideo = ({
  videoUrl,
  storyboard,
  cropTimeline,
  transcriptWords = defaultTranscriptWords,
}) => {
  const frame = useCurrentFrame();
  const {fps, width: outputW, height: outputH} = useVideoConfig();
  const timeSeconds = frame / fps;

  const CODEX_WORD = (() =>
    transcriptWords.find(
      (entry) =>
        entry.type === 'word' &&
        typeof entry.text === 'string' &&
        entry.text.toLowerCase().startsWith('codec')
    ))();
  const CODEX_WORD_TIME = CODEX_WORD?.start ?? 2.0;
  const CODEX_WORD_END = CODEX_WORD?.end ?? 3.0;

  const scenes = cropTimeline?.scenes ?? [];
  const crop = getCropAtTime(timeSeconds, scenes);
  const activeRectRaw = getSmoothedRectAtTime(timeSeconds, activeSpeakerFrames.frames);
  const resolution = storyboard?.video_resolution ?? DEFAULT_RESOLUTION;
  const scale = outputW / 1080;
  const sourceW = activeSpeakerFrames.video_width || resolution.width;
  const sourceH = activeSpeakerFrames.video_height || resolution.height;
  const scaleX = outputW / sourceW;
  const scaleY = outputH / sourceH;
  const activeRect = activeRectRaw
    ? {
        x: activeRectRaw.x * scaleX,
        y: activeRectRaw.y * scaleY,
        width: activeRectRaw.width * scaleX,
        height: activeRectRaw.height * scaleY,
      }
    : null;

  const layoutMode = getLayoutMode(timeSeconds, storyboard?.sections);
  const transitions = [{start: 5.16, end: 5.76, from: 'canvas', to: 'full'}];
  const activeTransition = transitions.find(
    (transition) => timeSeconds >= transition.start && timeSeconds < transition.end
  );
  const transitionProgress = activeTransition
    ? interpolate(
        timeSeconds,
        [activeTransition.start, activeTransition.end],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        }
      )
    : null;
  const inCanvasLeadIn = timeSeconds >= LEAD_OUT_START && timeSeconds < CANVAS_IN_START;
  const leadOutProgress =
    timeSeconds < LEAD_OUT_START
      ? 0
      : timeSeconds < LEAD_OUT_END
      ? interpolate(timeSeconds, [LEAD_OUT_START, LEAD_OUT_END], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        })
      : 1;
  const showCanvas = layoutMode === 'canvas' || inCanvasLeadIn;
  const canvasEntrance =
    timeSeconds < CANVAS_IN_START
      ? 0
      : timeSeconds < CANVAS_IN_END
      ? interpolate(timeSeconds, [CANVAS_IN_START, CANVAS_IN_END], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        })
      : 1;
  const baseCanvasOpacity = showCanvas
    ? layoutMode === 'canvas' && timeSeconds < CANVAS_IN_START
      ? 1
      : canvasEntrance
    : 0;
  const canvasOpacity = activeTransition
    ? activeTransition.from === 'canvas'
      ? 1 - transitionProgress
      : transitionProgress
    : baseCanvasOpacity;
  // Full video stays visible; we mask it with overlays instead of fading audio.
  const talkingHeadOpacity = showCanvas ? (inCanvasLeadIn ? leadOutProgress : 1) : 0;
  const talkingHeadScale = showCanvas
    ? inCanvasLeadIn
      ? lerp(1.12, 1, leadOutProgress)
      : 1
    : 1;
  const fullOpacity = 1;
  const blackOpacity =
    timeSeconds < LEAD_OUT_START
      ? 0
      : timeSeconds < LEAD_OUT_END
      ? leadOutProgress
      : timeSeconds < CANVAS_IN_START
      ? 1
      : timeSeconds < CANVAS_IN_END
      ? 1 - canvasEntrance
      : 0;
  const introStart = storyboard?.sections?.[0]?.start ?? 0;
  const suppressFullVideo = timeSeconds < introStart || showCanvas;
  const useTalkingHeadAudio = showCanvas;
  const fullVideoMuted = useTalkingHeadAudio;
  const talkingHeadMuted = !useTalkingHeadAudio;
  const fullVideoOpacity = suppressFullVideo
    ? 0
    : timeSeconds < LEAD_OUT_START
    ? 1
    : timeSeconds < LEAD_OUT_END
    ? 1 - leadOutProgress
    : 1;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#000',
        fontFamily: SKETCH_FONT_FAMILY,
      }}
    >
      <SketchDefs />
      <div style={{position: 'absolute', inset: 0, opacity: fullVideoOpacity}}>
        <Video
          src={resolveAssetSrc(videoUrl)}
          muted={fullVideoMuted}
          style={{
            width: resolution.width,
            height: resolution.height,
            objectFit: 'cover',
          }}
        />
      </div>

      {blackOpacity > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: blackOpacity,
            backgroundColor: '#000',
            zIndex: 5,
          }}
        />
      ) : null}

      {showCanvas ? (
        <div style={{position: 'absolute', inset: 0}}>
          {canvasOpacity > 0 ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: canvasOpacity,
                backgroundColor: '#ffffff',
              }}
            />
          ) : null}
          {canvasOpacity > 0 ? <CanvasSketchFrame opacity={canvasOpacity} /> : null}
          <TalkingHeadOverlay
            videoUrl={videoUrl}
            crop={crop}
            resolution={resolution}
            muted={talkingHeadMuted}
            style={{
              opacity: talkingHeadOpacity,
              transform: `scale(${talkingHeadScale})`,
              transformOrigin: 'center center',
              zIndex: 10,
            }}
          />
        </div>
      ) : null}

      {timeline.overlays.map((overlay, index) => {
        const from = Math.round(overlay.start * fps);
        const duration = Math.max(1, Math.round((overlay.end - overlay.start) * fps));
        return (
          <Sequence
            key={`${overlay.type}-${index}`}
            from={from}
            durationInFrames={duration}
            premountFor={Math.min(30, from)}
          >
            <SketchLayer style={{width: '100%', height: '100%'}}>
              <OverlayRenderer
                overlay={overlay}
                durationInFrames={duration}
                scale={scale}
                activeRect={activeRect}
                output={{width: outputW, height: outputH}}
                currentTime={timeSeconds}
              />
            </SketchLayer>
          </Sequence>
        );
      })}
    </div>
  );
};
