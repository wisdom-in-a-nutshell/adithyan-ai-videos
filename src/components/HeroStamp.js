import React, {useMemo} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const normalizeWord = (value) => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().toLowerCase().replace(/[^\w%]+/g, '');
};

const findPhraseTiming = (words) => {
  const fallback = {
    thisStart: 0.16,
    thisEnd: 0.32,
    videoStart: 0.32,
    videoEnd: 0.64,
    percentStart: 0.8,
    percentEnd: 1.28,
    editedStart: 1.6,
    codexEnd: 2.48,
  };

  if (!Array.isArray(words) || words.length === 0) {
    return fallback;
  }

  const onlyWords = words.filter((w) => w?.type === 'word' && typeof w?.text === 'string');
  if (onlyWords.length === 0) {
    return fallback;
  }

  for (let i = 0; i < onlyWords.length - 2; i++) {
    const w0 = normalizeWord(onlyWords[i].text);
    const w1 = normalizeWord(onlyWords[i + 1].text);
    const w2 = normalizeWord(onlyWords[i + 2].text);
    if (w0 !== 'this' || w1 !== 'video' || (w2 !== 'is' && w2 !== 'was')) {
      continue;
    }

    const percentIdx = onlyWords.findIndex(
      (w, idx) => idx > i && normalizeWord(w.text) === '100%'
    );
    if (percentIdx === -1) {
      continue;
    }

    const codexIdx = onlyWords.findIndex(
      (w, idx) => idx > percentIdx && normalizeWord(w.text).startsWith('codex')
    );
    if (codexIdx === -1) {
      continue;
    }

    const editedIdx = onlyWords.findIndex(
      (w, idx) => idx > percentIdx && normalizeWord(w.text) === 'edited'
    );

    const thisStart = Number(onlyWords[i].start);
    const thisEnd = Number(onlyWords[i].end);
    const videoStart = Number(onlyWords[i + 1].start);
    const videoEnd = Number(onlyWords[i + 1].end);
    const percentStart = Number(onlyWords[percentIdx].start);
    const percentEnd = Number(onlyWords[percentIdx].end);
    const editedStart =
      editedIdx === -1 ? Number(onlyWords[percentIdx].end) : Number(onlyWords[editedIdx].start);
    const codexEnd = Number(onlyWords[codexIdx].end);

    if (
      !Number.isFinite(thisStart) ||
      !Number.isFinite(videoStart) ||
      !Number.isFinite(percentStart) ||
      !Number.isFinite(codexEnd)
    ) {
      continue;
    }

    return {
      thisStart,
      thisEnd: Number.isFinite(thisEnd) ? thisEnd : fallback.thisEnd,
      videoStart,
      videoEnd: Number.isFinite(videoEnd) ? videoEnd : fallback.videoEnd,
      percentStart,
      percentEnd: Number.isFinite(percentEnd) ? percentEnd : fallback.percentEnd,
      editedStart: Number.isFinite(editedStart) ? editedStart : fallback.editedStart,
      codexEnd,
    };
  }

  const percentWord = onlyWords.find((w) => normalizeWord(w.text) === '100%');
  const codexWord = onlyWords.find((w) => normalizeWord(w.text).startsWith('codex'));
  if (percentWord && codexWord) {
    return {
      thisStart: Number(onlyWords[0].start ?? fallback.thisStart),
      thisEnd: Number(onlyWords[0].end ?? fallback.thisEnd),
      videoStart: Number(onlyWords[1]?.start ?? fallback.videoStart),
      videoEnd: Number(onlyWords[1]?.end ?? fallback.videoEnd),
      percentStart: Number(percentWord.start ?? fallback.percentStart),
      percentEnd: Number(percentWord.end ?? fallback.percentEnd),
      editedStart: Number(percentWord.end ?? fallback.editedStart),
      codexEnd: Number(codexWord.end ?? fallback.codexEnd),
    };
  }

  return fallback;
};

const appearOpacity = ({t, startSeconds, fadeInSeconds = 0.12}) => {
  if (!Number.isFinite(startSeconds)) {
    return 0;
  }
  // Avoid "early" appearance before the word actually starts.
  return interpolate(t, [startSeconds, startSeconds + fadeInSeconds], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

export const HeroStamp = ({
  layer = 'behind',
  transcriptWords,
  /**
   * Optional override to reuse this component for other phrases without
   * introducing project.json config. If omitted, we infer from transcriptWords.
   *
   * Shape:
   * {
   *   thisStart, thisEnd, videoStart, videoEnd,
   *   percentStart, percentEnd, editedStart, codexEnd
   * }
   */
  timing: timingOverride,
  topLeftText = 'THIS',
  topRightText = 'VIDEO',
  centerText = '100%',
  bottomPrefixText = 'EDITED BY',
  bottomAccentText = 'CODEX',
  accentColor = '#3b82f6',
  textColor = '#f6f2ee',
  timingOffsetSeconds = 0,
  holdUntilSeconds,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();

  const inferredTiming = useMemo(() => findPhraseTiming(transcriptWords), [transcriptWords]);
  const timing = useMemo(() => {
    const base = timingOverride ?? inferredTiming;
    const offset = Number(timingOffsetSeconds);
    if (!Number.isFinite(offset) || offset === 0) {
      return base;
    }
    return {
      ...base,
      thisStart: base.thisStart + offset,
      thisEnd: base.thisEnd + offset,
      videoStart: base.videoStart + offset,
      videoEnd: base.videoEnd + offset,
      percentStart: base.percentStart + offset,
      percentEnd: base.percentEnd + offset,
      editedStart: base.editedStart + offset,
      codexEnd: base.codexEnd + offset,
    };
  }, [inferredTiming, timingOverride, timingOffsetSeconds]);
  const t = frame / Math.max(1, fps);

  const phraseStart = timing.thisStart;
  const compEndSeconds = durationInFrames / Math.max(1, fps);
  const holdUntil = Number(holdUntilSeconds);
  const holdEnd = Number.isFinite(holdUntil)
    ? holdUntil
    : Math.max(timing.codexEnd + 0.25, compEndSeconds - 0.35);

  const baseIn = interpolate(t, [phraseStart - 0.12, phraseStart + 0.12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const baseOut = interpolate(t, [holdEnd, holdEnd + 0.25], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const baseOpacity = baseIn * baseOut;

  // Important: each element appears at its timestamp and then stays.
  const thisOpacity = appearOpacity({t, startSeconds: timing.thisStart});
  const videoOpacity = appearOpacity({t, startSeconds: timing.videoStart});
  const percentOpacity = appearOpacity({t, startSeconds: timing.percentStart});
  const editedOpacity = appearOpacity({t, startSeconds: timing.editedStart});

  // Use ceil so the pop never starts earlier than the word timing (at most 1 frame late).
  const percentFrame = Math.ceil(timing.percentStart * fps);
  const pop = spring({
    fps,
    frame: frame - percentFrame,
    config: {damping: 14, stiffness: 220, mass: 0.8},
    durationInFrames: Math.round(0.9 * fps),
  });
  const percentScale = interpolate(pop, [0, 1], [0.88, 1.06], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const settle = interpolate(pop, [0.65, 1], [1.06, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const percentRotate = interpolate(pop, [0, 0.4, 1], [-1.6, 1.2, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const lift = interpolate(t, [timing.thisStart, timing.thisStart + 0.35], [18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const topInset = Math.round(height * 0.09);
  const sideInset = Math.round(width * 0.075);

  const percentFontSize = Math.round(Math.min(width, height) * 0.52);
  const cornerFontSize = Math.round(Math.min(width, height) * 0.12);
  const bottomFontSize = Math.round(Math.min(width, height) * 0.095);

  const cornerSlide = interpolate(t, [timing.thisStart, timing.thisStart + 0.35], [22, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const thisSlideX = interpolate(t, [timing.thisStart, timing.thisStart + 0.22], [-22, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const videoSlideX = interpolate(t, [timing.videoStart, timing.videoStart + 0.22], [22, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const percentZoom = interpolate(t, [timing.percentStart - 0.2, timing.percentStart + 0.75], [0.94, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const editedLift = interpolate(t, [timing.editedStart, timing.editedStart + 0.35], [22, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // One shared style for all text in this stamp: same weight, same shadow, no stroke.
  const sharedTextStyle = {
    fontWeight: 400,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    textShadow: '0 10px 28px rgba(0,0,0,0.55)',
  };

  if (baseOpacity <= 0) {
    return null;
  }

  if (layer === 'front') {
    if (editedOpacity <= 0 || baseOpacity <= 0) {
      return null;
    }

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: baseOpacity * editedOpacity,
          pointerEvents: 'none',
        }}
      >
		        <div
		          style={{
		            position: 'absolute',
		            left: '50%',
		            bottom: Math.round(height * 0.11),
		            transform: `translate3d(-50%, ${Math.round(editedLift)}px, 0)`,
		            color: textColor,
		            ...sharedTextStyle,
		            fontSize: bottomFontSize,
		            whiteSpace: 'nowrap',
		          }}
		        >
	          {bottomPrefixText}{' '}
	          <span
	            style={{
	              color: accentColor,
	            }}
	          >
	            {bottomAccentText}
	          </span>
        </div>
      </div>
    );
  }

  const washOpacity = baseOpacity * interpolate(percentOpacity, [0, 1], [0.0, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const spark = spring({
    fps,
    frame: frame - percentFrame,
    config: {damping: 18, stiffness: 240, mass: 0.45},
    durationInFrames: Math.round(0.7 * fps),
  });
  const sparkOpacity = percentOpacity * interpolate(spark, [0, 0.15, 0.45, 1], [0, 0.9, 0.55, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sparkScale = interpolate(spark, [0, 1], [0.6, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: baseOpacity,
        pointerEvents: 'none',
        transform: `translate3d(0, ${Math.round(lift)}px, 0)`,
      }}
    >
      {/* Readability wash + vignette (behind subject) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: washOpacity,
          backgroundImage: [
            'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 44%, rgba(0,0,0,0) 72%)',
            'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.38) 100%)',
          ].join(','),
          mixBlendMode: 'multiply',
        }}
      />

	      <div
	        style={{
	          position: 'absolute',
	          left: sideInset,
	          top: topInset,
	          transform: `translate3d(${Math.round(thisSlideX)}px, ${Math.round(cornerSlide)}px, 0)`,
	          fontSize: cornerFontSize,
	          ...sharedTextStyle,
	          letterSpacing: 1,
	          textTransform: 'uppercase',
	          color: textColor,
	          opacity: 0.92,
	        }}
	      >
        <span style={{opacity: thisOpacity}}>{topLeftText}</span>
      </div>

	      <div
	        style={{
	          position: 'absolute',
	          right: sideInset,
	          top: topInset,
	          transform: `translate3d(${Math.round(videoSlideX)}px, ${Math.round(cornerSlide)}px, 0)`,
	          fontSize: cornerFontSize,
	          ...sharedTextStyle,
	          letterSpacing: 1,
	          textTransform: 'uppercase',
	          color: textColor,
	          opacity: 0.92,
	        }}
	      >
        <span style={{opacity: videoOpacity}}>{topRightText}</span>
      </div>

		      <div
		        style={{
		          position: 'absolute',
		          left: '50%',
		          top: '50%',
		          transform: `translate3d(-50%, -52%, 0) rotate(${percentRotate}deg) scale(${settle * percentZoom})`,
		          fontSize: percentFontSize,
		          ...sharedTextStyle,
		          letterSpacing: -4,
		          lineHeight: 1,
		          color: accentColor,
		          opacity: 0.98,
		          whiteSpace: 'nowrap',
		          filter: 'none',
		        }}
		      >
        {/* Spark / burst (behind subject) */}
        <svg
          viewBox="0 0 200 200"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: Math.round(percentFontSize * 1.2),
            height: Math.round(percentFontSize * 1.2),
            transform: `translate3d(-50%, -50%, 0) scale(${sparkScale})`,
            opacity: sparkOpacity,
            filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.35))',
          }}
        >
          {Array.from({length: 12}).map((_, idx) => {
            const angle = (idx / 12) * Math.PI * 2;
            const x1 = 100 + Math.cos(angle) * 56;
            const y1 = 100 + Math.sin(angle) * 56;
            const x2 = 100 + Math.cos(angle) * 86;
            const y2 = 100 + Math.sin(angle) * 86;
            return (
              <line
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={accentColor}
                strokeWidth="8"
                strokeLinecap="round"
                opacity={0.9}
              />
            );
          })}
          <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="2" />
        </svg>

        <span style={{opacity: percentOpacity}}>
          <span
            style={{
              display: 'inline-block',
              transform: `translate3d(0, 0, 0) scale(${percentScale})`,
            }}
          >
            {centerText}
          </span>
        </span>
      </div>
    </div>
  );
};
