import React from 'react';

export const getTrackPointForFrame = (track, frame) => {
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

export const TrackedObjectOverlay = ({
  trackPoint,
  treatment,
  minSize = 128,
  sizeMultiplier = 1.78,
  leftBiasRatio = 0.062,
  topBiasRatio = 0.06,
}) => {
  if (!trackPoint || !treatment) {
    return null;
  }

  const size = Math.max(
    minSize,
    Math.round(trackPoint.r * sizeMultiplier * (treatment.sizeScale ?? 1))
  );
  const leftBias = Math.round(size * leftBiasRatio);
  const topBias = Math.round(size * topBiasRatio);
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
