import React from 'react';
import {OffthreadVideo} from 'remotion';
import {resolveAssetSrc} from '../lib/resolveAssetSrc.js';

const buildOutlineFilter = (outlineColor, outlinePx) =>
  [
    `drop-shadow(${outlinePx}px 0 0 ${outlineColor})`,
    `drop-shadow(-${outlinePx}px 0 0 ${outlineColor})`,
    `drop-shadow(0 ${outlinePx}px 0 ${outlineColor})`,
    `drop-shadow(0 -${outlinePx}px 0 ${outlineColor})`,
    `drop-shadow(0 0 10px ${outlineColor})`,
  ].join(' ');

export const TransparentVideoOverlay = ({
  src,
  assetMap,
  startFrom = 0,
  endAt,
  muted = true,
  opacity = 1,
  outline = false,
  outlineColor = 'rgba(34, 197, 94, 0.95)',
  outlinePx = 2,
  filter,
  style,
}) => {
  const combinedFilter = [
    outline ? buildOutlineFilter(outlineColor, outlinePx) : null,
    filter,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <OffthreadVideo
      src={resolveAssetSrc(src, assetMap)}
      startFrom={startFrom}
      endAt={endAt}
      muted={muted}
      transparent
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity,
        filter: combinedFilter,
        ...style,
      }}
    />
  );
};
