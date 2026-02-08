import React from 'react';
import {ForegroundMatteComposite} from '../../components/ForegroundMatteComposite.js';

// Project-specific composition wrapper for `text-effects`.
// Keep the cut short while iterating; extend later when we implement storyboard-driven beats.
export const TextEffectsComp = (props) => {
  return <ForegroundMatteComposite {...props} />;
};

