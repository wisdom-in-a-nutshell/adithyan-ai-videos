const WORD_TYPE = 'word';

export const normalizeTranscriptToken = (value) => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().toLowerCase().replace(/[^\w%]+/g, '');
};

export const getTranscriptWords = (entries) => {
  if (!Array.isArray(entries)) {
    return [];
  }
  return entries.filter((entry) => entry?.type === WORD_TYPE && typeof entry?.text === 'string');
};

const toPhraseTokens = (phrase) => {
  if (Array.isArray(phrase)) {
    return phrase.map((part) => normalizeTranscriptToken(part)).filter(Boolean);
  }
  if (typeof phrase !== 'string') {
    return [];
  }
  return phrase
    .split(/\s+/)
    .map((part) => normalizeTranscriptToken(part))
    .filter(Boolean);
};

const isAfterThreshold = (word, afterSeconds) => {
  if (!Number.isFinite(afterSeconds)) {
    return true;
  }
  const start = Number(word?.start);
  return Number.isFinite(start) && start >= afterSeconds;
};

export const findPhraseMatch = (entries, phrase, {afterSeconds = null} = {}) => {
  const words = getTranscriptWords(entries);
  const tokens = toPhraseTokens(phrase);
  if (words.length === 0 || tokens.length === 0) {
    return null;
  }

  for (let i = 0; i <= words.length - tokens.length; i += 1) {
    if (!isAfterThreshold(words[i], afterSeconds)) {
      continue;
    }

    let matched = true;
    for (let j = 0; j < tokens.length; j += 1) {
      if (normalizeTranscriptToken(words[i + j].text) !== tokens[j]) {
        matched = false;
        break;
      }
    }
    if (!matched) {
      continue;
    }

    const first = words[i];
    const last = words[i + tokens.length - 1];
    const startSeconds = Number(first.start);
    const endSeconds = Number(last.end);
    if (!Number.isFinite(startSeconds) || !Number.isFinite(endSeconds)) {
      continue;
    }

    return {
      phrase: tokens.join(' '),
      startSeconds,
      endSeconds,
      startIndex: i,
      endIndex: i + tokens.length - 1,
      matchedText: words
        .slice(i, i + tokens.length)
        .map((word) => word.text)
        .join(' '),
      words: words.slice(i, i + tokens.length),
    };
  }

  return null;
};

const defaultFrameFloor = (seconds, fps) => Math.floor(seconds * fps);
const defaultFrameCeil = (seconds, fps) => Math.max(0, Math.ceil(seconds * fps) - 1);

export const findPhraseFrames = (entries, phrase, {fps, afterSeconds = null} = {}) => {
  const match = findPhraseMatch(entries, phrase, {afterSeconds});
  if (!match) {
    return null;
  }

  const resolvedFps = Number(fps);
  if (!Number.isFinite(resolvedFps) || resolvedFps <= 0) {
    return {
      ...match,
      fps: null,
      startFrame: null,
      endFrameInclusive: null,
    };
  }

  return {
    ...match,
    fps: resolvedFps,
    startFrame: defaultFrameFloor(match.startSeconds, resolvedFps),
    endFrameInclusive: defaultFrameCeil(match.endSeconds, resolvedFps),
  };
};
