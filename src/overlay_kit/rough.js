import rough from 'roughjs/bundled/rough.esm.js';

const roughGenerator = rough.generator();
const ROUGH_STYLE = {
  stroke: 'rgba(255,255,255,0.85)',
  strokeWidth: 4,
  roughness: 2.2,
  bowing: 1.2,
  seed: 2,
  disableMultiStroke: false,
  preserveVertices: true,
  maxRandomnessOffset: 1.6,
};
const ROUGH_BOX_STYLE = {
  ...ROUGH_STYLE,
  strokeWidth: 3,
  roughness: 2.8,
  bowing: 2.2,
  maxRandomnessOffset: 2.4,
  disableMultiStroke: true,
  disableMultiStrokeFill: true,
};
const ROUGH_PILL_STYLE = {
  ...ROUGH_STYLE,
  strokeWidth: 3,
  roughness: 1.4,
  bowing: 0.8,
  maxRandomnessOffset: 0.9,
};

const getRoughPaths = (width, height, style = ROUGH_STYLE) => {
  const drawable = roughGenerator.rectangle(0, 0, width, height, style);
  return roughGenerator.toPaths(drawable);
};

const getRoughRoundedRectPaths = (width, height, radius, style = ROUGH_STYLE) => {
  const r = Math.max(0, Math.min(radius, Math.min(width, height) / 2));
  const path = [
    `M ${r} 0`,
    `H ${width - r}`,
    `Q ${width} 0 ${width} ${r}`,
    `V ${height - r}`,
    `Q ${width} ${height} ${width - r} ${height}`,
    `H ${r}`,
    `Q 0 ${height} 0 ${height - r}`,
    `V ${r}`,
    `Q 0 0 ${r} 0`,
    'Z',
  ].join(' ');
  const drawable = roughGenerator.path(path, style);
  return roughGenerator.toPaths(drawable);
};

export {
  getRoughPaths,
  getRoughRoundedRectPaths,
  ROUGH_STYLE,
  ROUGH_BOX_STYLE,
  ROUGH_PILL_STYLE,
  roughGenerator,
};
