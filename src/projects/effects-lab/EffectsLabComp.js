import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import ballTrack from '../object-segmentation/ball_track.json';
import {
  CalloutBeat,
  FadeInBackdrop,
  SketchPanel,
  StatusBeat,
  TrackedObjectOverlay,
  TransparentVideoOverlay,
  getTrackPointForFrame,
} from '../../effects/index.js';
import {resolveAssetSrc} from '../../lib/resolveAssetSrc.js';
import {SketchDefs} from '../../styles/sketch.js';
import {
  EFFECTS_LAB_ALPHA_URL,
  EFFECTS_LAB_DURATION_FRAMES,
  EFFECTS_LAB_SKETCH_URL,
  EFFECTS_LAB_VIDEO_URL,
} from './assets.js';

const UI = {
  leftPx: 56,
  statusTopPx: 56,
  calloutTopPx: 132,
  statusScale: 1.56,
  calloutScale: 1.8,
};

const TrackedObjectDemo = () => {
  const frame = useCurrentFrame();
  const trackPoint = getTrackPointForFrame(ballTrack, 480 + frame);

  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 160}}>
      <TrackedObjectOverlay
        trackPoint={trackPoint}
        treatment={{
          color: '#38bdf8',
          opacity: 0.95,
          sizeScale: 1.28,
          coverShiftX: -0.04,
          coverShiftY: -0.03,
          coverScale: 1.02,
        }}
      />
    </AbsoluteFill>
  );
};

export const EffectsLabComp = (props) => {
  const assetMap = props?.assetMap ?? null;
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: '#050816'}}>
      <SketchDefs />

      <OffthreadVideo
        src={resolveAssetSrc(EFFECTS_LAB_VIDEO_URL, assetMap)}
        muted
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.34,
        }}
      />

      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(56,189,248,0.16), transparent 40%), radial-gradient(circle at 80% 15%, rgba(251,191,36,0.18), transparent 28%), linear-gradient(180deg, rgba(4,8,20,0.25), rgba(4,8,20,0.78))',
        }}
      />

      <StatusBeat
        name="[Lab01] Status: SHARED EFFECTS"
        from={0}
        durationInFrames={Math.round(2 * fps)}
        text="SHARED EFFECTS"
        ui={UI}
      />
      <CalloutBeat
        name="[Lab01] Callout: House-style blocks."
        from={0}
        durationInFrames={Math.round(2 * fps)}
        text="House-style blocks."
        ui={UI}
      />

      <StatusBeat
        name="[Lab02] Status: SKETCH PANEL"
        from={Math.round(2 * fps)}
        durationInFrames={Math.round(2 * fps)}
        text="SKETCH PANEL"
        ui={UI}
      />
      <CalloutBeat
        name="[Lab02] Callout: Reused explainer frame."
        from={Math.round(2 * fps)}
        durationInFrames={Math.round(2 * fps)}
        text="Reused explainer frame."
        ui={UI}
      />
      <Sequence
        name="[Lab02] Sketch Panel"
        from={Math.round(2 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <SketchPanel
          src={EFFECTS_LAB_SKETCH_URL}
          assetMap={assetMap}
          durationInFrames={Math.round(2 * fps)}
          leftPx={120}
          topPx={220}
          widthPx={640}
          heightPx={640}
        />
      </Sequence>

      <StatusBeat
        name="[Lab03] Status: TRACK OVERLAY"
        from={Math.round(4 * fps)}
        durationInFrames={Math.round(2 * fps)}
        text="TRACK OVERLAY"
        ui={UI}
      />
      <CalloutBeat
        name="[Lab03] Callout: Driven by track data."
        from={Math.round(4 * fps)}
        durationInFrames={Math.round(2 * fps)}
        text="Driven by track data."
        ui={UI}
      />
      <Sequence
        name="[Lab03] Tracked Object Demo"
        from={Math.round(4 * fps)}
        durationInFrames={Math.round(2 * fps)}
      >
        <TrackedObjectDemo />
      </Sequence>

      <StatusBeat
        name="[Lab04] Status: MATTE + BACKDROP"
        from={Math.round(6 * fps)}
        durationInFrames={EFFECTS_LAB_DURATION_FRAMES - Math.round(6 * fps)}
        text="MATTE + BACKDROP"
        ui={UI}
      />
      <CalloutBeat
        name="[Lab04] Callout: Transparent overlay helper."
        from={Math.round(6 * fps)}
        durationInFrames={EFFECTS_LAB_DURATION_FRAMES - Math.round(6 * fps)}
        text="Transparent overlay helper."
        ui={UI}
      />
      <Sequence
        name="[Lab04] Fade Backdrop"
        from={Math.round(6 * fps)}
        durationInFrames={EFFECTS_LAB_DURATION_FRAMES - Math.round(6 * fps)}
      >
        <FadeInBackdrop color="#f6f3ec" fadeInFrames={10} />
      </Sequence>
      <Sequence
        name="[Lab04] Transparent Video Overlay"
        from={Math.round(6 * fps)}
        durationInFrames={EFFECTS_LAB_DURATION_FRAMES - Math.round(6 * fps)}
      >
        <TransparentVideoOverlay
          assetMap={assetMap}
          src={EFFECTS_LAB_ALPHA_URL}
          startFrom={0}
          style={{zIndex: 170}}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
