import React, {useMemo} from 'react';
import {Video, staticFile, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {SKETCH_FONT_FAMILY} from '../styles/sketch.js';
import {HeroStamp} from './HeroStamp.js';

const resolveAssetSrc = (src, assetMap) => {
  if (!src || typeof src !== 'string') {
    return src;
  }
  let resolved = src;

  // Optional: injected by `npm start` (cached studio) / `npm run render`.
  if (assetMap && typeof assetMap === 'object') {
    const mapped = assetMap[resolved];
    if (typeof mapped === 'string' && mapped.length > 0) {
      resolved = mapped;
    }
  }

  if (/^https?:\/\//i.test(resolved) || resolved.startsWith('data:')) {
    return resolved;
  }
  // If the caller already passed a `staticFile()` result, don't wrap it again.
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

export const ForegroundMatteComposite = ({
  videoUrl,
  alphaUrl,
  transcriptWords,
  assetMap,
  textColor = '#f6f2ee',
  backgroundBlur = 0,
  backgroundDim = 0,
  featherPx = 1,
  shrinkPx = 0,
  heroStamp = true,
  heroStampAccentColor = '#3b82f6',
  heroStampTimingOffsetSeconds = 0,
  heroStampHoldUntilSeconds,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const editedStartSeconds = useMemo(() => {
    if (!Array.isArray(transcriptWords)) {
      return 1.6;
    }
    const word = transcriptWords.find((w) => w?.type === 'word' && typeof w?.text === 'string' && w.text.toLowerCase().startsWith('edited'));
    return Number.isFinite(Number(word?.start)) ? Number(word.start) : 1.6;
  }, [transcriptWords]);

  const t = frame / Math.max(1, fps);
  const zoom = interpolate(
    t,
    [editedStartSeconds + 0.25, editedStartSeconds + 2.2],
    [1, 1.03],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const {width} = useVideoConfig();
  const scale = shrinkPx > 0 ? (width - 2 * shrinkPx) / width : 1;
  const featherOpacity = featherPx > 0 ? 0.55 : 0;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        overflow: 'hidden',
        fontFamily: SKETCH_FONT_FAMILY,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
      <Video
        src={resolveAssetSrc(videoUrl, assetMap)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: backgroundBlur > 0 ? `blur(${backgroundBlur}px)` : undefined,
          transform: backgroundBlur > 0 ? 'scale(1.02)' : undefined,
        }}
      />
      {backgroundDim > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: `rgba(0,0,0,${backgroundDim})`,
          }}
        />
      ) : null}

      {heroStamp ? (
        <HeroStamp
          layer="behind"
          transcriptWords={transcriptWords}
          timingOffsetSeconds={heroStampTimingOffsetSeconds}
          holdUntilSeconds={heroStampHoldUntilSeconds}
          accentColor={heroStampAccentColor}
          textColor={textColor}
        />
      ) : null}

      {alphaUrl ? (
        <>
          {featherPx > 0 ? (
            <Video
              src={resolveAssetSrc(alphaUrl, assetMap)}
              muted
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: `blur(${featherPx}px)`,
                opacity: featherOpacity,
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
              }}
            />
          ) : null}
          <Video
            src={resolveAssetSrc(alphaUrl, assetMap)}
            muted
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          />
        </>
      ) : null}

      {heroStamp ? (
        <HeroStamp
          layer="front"
          transcriptWords={transcriptWords}
          timingOffsetSeconds={heroStampTimingOffsetSeconds}
          holdUntilSeconds={heroStampHoldUntilSeconds}
          accentColor={heroStampAccentColor}
          textColor={textColor}
        />
      ) : null}
      </div>
    </div>
  );
};
