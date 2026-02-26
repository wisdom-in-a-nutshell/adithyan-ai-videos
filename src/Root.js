import React from 'react';
import {Composition} from 'remotion';
import {PROJECT_COMPOSITIONS} from './projects/registry.js';

export const RemotionRoot = () => {
  return (
    <>
      {PROJECT_COMPOSITIONS.map((composition) => (
        <Composition key={composition.id} {...composition} />
      ))}
    </>
  );
};
