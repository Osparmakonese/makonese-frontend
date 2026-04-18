import React from 'react';

/**
 * Pewil Logo - The Kernel
 *
 * Props:
 *   size       number - height of the icon in px (width scales proportionally)
 *   showText   boolean - render the "pewil" wordmark beside the icon
 *   variant    'light' | 'dark' - adjusts text colours for dark backgrounds
 *   tagline    boolean - show "Rooted in the work." under the wordmark
 *
 * The mark is a maize-kernel silhouette in forest green with an amber sprout
 * inside. Typography: Plus Jakarta Sans 700 for the wordmark, Fraunces 500
 * italic for the tagline.
 */
export default function Logo({
  size = 36,
  showText = true,
  variant = 'light',
  tagline = false,
}) {
  const forest = '#1f3d26';
  const amber = '#f4a743';
  const inkPrimary = variant === 'dark' ? '#fff7ec' : forest;
  const inkSubtle = variant === 'dark' ? '#c9b79d' : '#8a6f4a';

  const iconW = Math.round(size * (110 / 120));
  const iconH = size;
  const wordSize = Math.round(size * 0.78);
  const tagSize = Math.max(10, Math.round(size * 0.26));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(size * 0.32) }}>
      <svg
        width={iconW}
        height={iconH}
        viewBox="0 0 110 120"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Pewil"
        style={{ flexShrink: 0 }}
      >
        <path
          d="M 55 4 C 89 4, 105 28, 105 56 C 105 88, 83 108, 55 108 C 27 108, 5 88, 5 56 C 5 28, 21 4, 55 4 Z"
          fill={forest}
        />
        <path d="M 55 34 L 55 86" stroke={amber} strokeWidth="5" strokeLinecap="round" />
        <path
          d="M 55 48 C 45 48, 39 40, 39 32"
          stroke={amber}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 55 60 C 67 60, 75 52, 75 44"
          stroke={amber}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: wordSize,
              fontWeight: 700,
              color: inkPrimary,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            pewil
          </div>
          {tagline && (
            <div
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: tagSize,
                fontStyle: 'italic',
                fontWeight: 500,
                color: inkSubtle,
                marginTop: Math.round(size * 0.08),
                letterSpacing: '0.01em',
              }}
            >
              Rooted in the work.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
