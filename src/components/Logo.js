import React from 'react';

/**
 * Farm Pulse logo.
 * Mark: rounded green badge with a white ECG/pulse line inside.
 * The pulse line doubles as a subtle wheat stalk silhouette (peaks = kernels).
 * Wordmark: "Farm Pulse" Playfair Display + "The pulse of your farm" Inter micro.
 */
export default function Logo({ size = 36, showText = true, variant = 'light' }) {
  const badge = size;
  const green = '#1a6b3a';
  const greenDeep = '#0D4A22';
  const textColor = variant === 'dark' ? '#ffffff' : '#111827';
  const subColor = variant === 'dark' ? 'rgba(255,255,255,0.75)' : '#6b7280';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg
        width={badge}
        height={badge}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-label="Farm Pulse"
      >
        <defs>
          <linearGradient id="fpGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={green} />
            <stop offset="100%" stopColor={greenDeep} />
          </linearGradient>
        </defs>
        {/* badge */}
        <rect width="64" height="64" rx="14" fill="url(#fpGrad)" />
        {/* faint ground line */}
        <line x1="8" y1="48" x2="56" y2="48" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1" />
        {/* ECG / pulse stroke */}
        <path
          d="M6 34 L16 34 L20 24 L26 46 L32 18 L38 40 L42 34 L58 34"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* accent dot at the tall peak — the "pulse" */}
        <circle cx="32" cy="18" r="2.2" fill="#ffffff" />
      </svg>
      {showText && (
        <div>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: size > 50 ? 22 : size > 36 ? 18 : 15,
              fontWeight: 700,
              color: textColor,
              lineHeight: 1.1,
              letterSpacing: '-0.3px',
            }}
          >
            Farm Pulse
          </div>
          <div
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 9,
              color: subColor,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: 2,
              opacity: 0.85,
            }}
          >
            The Pulse Of Your Farm
          </div>
        </div>
      )}
    </div>
  );
}
