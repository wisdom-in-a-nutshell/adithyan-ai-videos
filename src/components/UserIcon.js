import React from 'react';

/**
 * Simple user silhouette icon for "by me" section.
 * Provides visual contrast with the Codex logo.
 */
export const UserIcon = ({
  size = 32,
  color = '#64748b',
  style = {},
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={style}
    >
      {/* Head */}
      <circle cx="12" cy="8" r="4" />
      {/* Shoulders/body */}
      <path d="M12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z" />
    </svg>
  );
};

/**
 * Animated user icon with fade-in.
 */
export const AnimatedUserIcon = ({
  size = 32,
  color = '#64748b',
  opacity = 1,
}) => {
  return (
    <div
      style={{
        opacity,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <UserIcon size={size} color={color} />
    </div>
  );
};
