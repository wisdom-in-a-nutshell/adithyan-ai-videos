import {ACTIVE_SPEAKER_DETECTION_COMPOSITION} from './active-speaker-detection/composition.js';
import {TEXT_EFFECTS_COMPOSITION} from './text-effects/composition.js';
import {C0040_COMPOSITION} from './c0040/composition.js';
import {EFFECTS_LAB_COMPOSITION} from './effects-lab/composition.js';
import {OBJECT_SEGMENTATION_COMPOSITION} from './object-segmentation/composition.js';
import {PAPER_PORTAL_COMPOSITION} from './paper-portal/composition.js';
// NEW_PROJECT_IMPORTS

export const PROJECT_COMPOSITION_REGISTRY = [
  {composition: ACTIVE_SPEAKER_DETECTION_COMPOSITION, enabled: false},
  {composition: TEXT_EFFECTS_COMPOSITION, enabled: false},
  {composition: C0040_COMPOSITION, enabled: false},
  {composition: OBJECT_SEGMENTATION_COMPOSITION, enabled: true},
  {composition: EFFECTS_LAB_COMPOSITION, enabled: true},
    {composition: PAPER_PORTAL_COMPOSITION, enabled: true},
  // NEW_PROJECT_ENTRIES
];

export const PROJECT_COMPOSITIONS = PROJECT_COMPOSITION_REGISTRY.filter((entry) => entry.enabled).map(
  (entry) => entry.composition
);
