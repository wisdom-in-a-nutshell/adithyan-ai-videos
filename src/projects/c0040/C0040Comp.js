import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {VIDEO_URL} from './assets.js';

export const C0040Comp = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Sequence name="[S01] Source Clip" from={0}>
        <OffthreadVideo
          src={staticFile(VIDEO_URL)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
