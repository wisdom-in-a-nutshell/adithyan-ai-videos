import {ACTIVE_SPEAKER_DETECTION_COMPOSITION} from './active-speaker-detection/composition.js';
import {TEXT_EFFECTS_COMPOSITION} from './text-effects/composition.js';
import {C0040_COMPOSITION} from './c0040/composition.js';
// NEW_PROJECT_IMPORTS

export const PROJECT_COMPOSITION_REGISTRY = [
  {composition: ACTIVE_SPEAKER_DETECTION_COMPOSITION, enabled: false},
  {composition: TEXT_EFFECTS_COMPOSITION, enabled: false},
  {composition: C0040_COMPOSITION, enabled: true},
  // NEW_PROJECT_ENTRIES
];

export const PROJECT_COMPOSITIONS = PROJECT_COMPOSITION_REGISTRY.filter((entry) => entry.enabled).map(
  (entry) => entry.composition
);
