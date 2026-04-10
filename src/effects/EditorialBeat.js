import React from 'react';
import {Sequence} from 'remotion';
import {CodexCallout, StatusLeftOverlay} from '../overlay_kit/overlays.js';

export const DEFAULT_BEAT_UI = {
  leftPx: 56,
  statusTopPx: 56,
  calloutTopPx: 132,
  statusScale: 1.56,
  calloutScale: 1.8,
};

const normalizeFrom = (from) => Math.max(0, Math.floor(Number(from) || 0));
const normalizeDuration = (durationInFrames) =>
  Math.max(1, Math.floor(Number(durationInFrames) || 0));

export const StatusBeat = ({
  name,
  from = 0,
  durationInFrames,
  text,
  ui,
}) => {
  if (!text) {
    return null;
  }

  const beatUi = {...DEFAULT_BEAT_UI, ...(ui ?? {})};
  const normalizedFrom = normalizeFrom(from);
  const normalizedDuration = normalizeDuration(durationInFrames);

  return (
    <Sequence
      name={name ?? `[Beat] Status: ${text}`}
      from={normalizedFrom}
      durationInFrames={normalizedDuration}
    >
      <StatusLeftOverlay
        text={text}
        durationInFrames={normalizedDuration}
        scale={beatUi.statusScale}
        topPx={beatUi.statusTopPx}
        leftPx={beatUi.leftPx}
      />
    </Sequence>
  );
};

export const CalloutBeat = ({
  name,
  from = 0,
  durationInFrames,
  text,
  ui,
}) => {
  if (!text) {
    return null;
  }

  const beatUi = {...DEFAULT_BEAT_UI, ...(ui ?? {})};
  const normalizedFrom = normalizeFrom(from);
  const normalizedDuration = normalizeDuration(durationInFrames);

  return (
    <Sequence
      name={name ?? `[Beat] Callout: ${text}`}
      from={normalizedFrom}
      durationInFrames={normalizedDuration}
    >
      <CodexCallout
        text={text}
        durationInFrames={normalizedDuration}
        scale={beatUi.calloutScale}
        topPx={beatUi.calloutTopPx}
        leftPx={beatUi.leftPx}
      />
    </Sequence>
  );
};

export const StatusCalloutBeat = ({
  statusName,
  statusText,
  calloutName,
  calloutText,
  from = 0,
  durationInFrames,
  ui,
}) => (
  <>
    <StatusBeat
      name={statusName}
      from={from}
      durationInFrames={durationInFrames}
      text={statusText}
      ui={ui}
    />
    <CalloutBeat
      name={calloutName}
      from={from}
      durationInFrames={durationInFrames}
      text={calloutText}
      ui={ui}
    />
  </>
);
