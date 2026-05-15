import React from 'react';
import {AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {PROJECT_TITLE} from './assets.js';

export const PaperPortalComp = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = spring({fps, frame, config: {damping: 200}});

  return (
    <AbsoluteFill style={{backgroundColor: '#efe9dc', color: '#27241f'}}>
      <Sequence name="concept placeholder" from={0}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 64,
            fontWeight: 700,
            opacity,
            letterSpacing: 1,
          }}
        >
          {PROJECT_TITLE}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
