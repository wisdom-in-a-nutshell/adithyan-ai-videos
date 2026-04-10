import React from 'react';
import {Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {resolveAssetSrc} from '../lib/resolveAssetSrc.js';

const clamp01 = (value) => Math.max(0, Math.min(1, value));

export const SketchPanel = ({
  src,
  assetMap,
  durationInFrames,
  leftPx,
  topPx,
  widthPx,
  heightPx,
  zIndex = 110,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dur = Math.max(1, Number(durationInFrames) || 1);
  const fadeFrames = Math.max(1, Math.floor(0.32 * fps));
  const inProgress = clamp01(frame / fadeFrames);
  const outProgress = clamp01((dur - 1 - frame) / fadeFrames);
  const opacity = interpolate(inProgress * outProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rise = interpolate(inProgress, [0, 1], [22, 0], {
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
        zIndex,
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
