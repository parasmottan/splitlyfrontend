import React from 'react';

/**
 * Official Splitly brand assets as SVG components.
 * ⚠️  Do NOT modify colors, proportions, or gradients.
 */

// ── Symbol only (the interlocking X mark) ────────────────────────────────────
// Use for: small placements, splash, top-bar brand mark
export function SplitlySymbol({ size = 32, color = 'url(#splitly-grad)' }) {
  const id = `sg-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Splitly"
      role="img"
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
      </defs>
      {/* Top-left loop */}
      <path
        d="M50 50 C50 50 28 42 22 28 C16 14 28 6 38 12 C48 18 50 50 50 50Z"
        fill={color === 'url(#splitly-grad)' ? `url(#${id})` : color}
      />
      {/* Top-right loop */}
      <path
        d="M50 50 C50 50 58 28 72 22 C86 16 94 28 88 38 C82 48 50 50 50 50Z"
        fill={color === 'url(#splitly-grad)' ? `url(#${id})` : color}
      />
      {/* Bottom-right loop */}
      <path
        d="M50 50 C50 50 72 58 78 72 C84 86 72 94 62 88 C52 82 50 50 50 50Z"
        fill={color === 'url(#splitly-grad)' ? `url(#${id})` : color}
      />
      {/* Bottom-left loop */}
      <path
        d="M50 50 C50 50 42 72 28 78 C14 84 6 72 12 62 C18 52 50 50 50 50Z"
        fill={color === 'url(#splitly-grad)' ? `url(#${id})` : color}
      />
    </svg>
  );
}

// ── Horizontal logo (symbol + "SPLITLY" wordmark) ────────────────────────────
// Use for: desktop warning, auth headers where brand name is shown full-width
export function SplitlyLogoHorizontal({ height = 36, dark = false }) {
  const textColor = dark ? '#FFFFFF' : '#1C1C1E';
  const gradId = `slh-${height}`;
  return (
    <svg
      height={height}
      viewBox="0 0 220 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Splitly"
      role="img"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
      </defs>
      {/* Symbol */}
      <g transform="translate(0, 0) scale(0.6)">
        <path d="M50 50 C50 50 28 42 22 28 C16 14 28 6 38 12 C48 18 50 50 50 50Z" fill={`url(#${gradId})`} />
        <path d="M50 50 C50 50 58 28 72 22 C86 16 94 28 88 38 C82 48 50 50 50 50Z" fill={`url(#${gradId})`} />
        <path d="M50 50 C50 50 72 58 78 72 C84 86 72 94 62 88 C52 82 50 50 50 50Z" fill={`url(#${gradId})`} />
        <path d="M50 50 C50 50 42 72 28 78 C14 84 6 72 12 62 C18 52 50 50 50 50Z" fill={`url(#${gradId})`} />
      </g>
      {/* Wordmark */}
      <text
        x="68"
        y="42"
        fontFamily="-apple-system, 'SF Pro Display', BlinkMacSystemFont, 'Inter', sans-serif"
        fontSize="30"
        fontWeight="800"
        letterSpacing="-0.5"
        fill={textColor}
      >
        SPLITLY
      </text>
    </svg>
  );
}

// ── App Icon (rounded square, for favicon/PWA context) ───────────────────────
// Use for: PWA icons, OG images context
export function SplitlyAppIcon({ size = 48 }) {
  const gradId = `sai-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Splitly"
      role="img"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
      </defs>
      {/* Rounded square background */}
      <rect width="100" height="100" rx="22" fill={`url(#${gradId})`} />
      {/* White symbol centered */}
      <g transform="translate(0, 0)">
        <path d="M50 50 C50 50 28 42 22 28 C16 14 28 6 38 12 C48 18 50 50 50 50Z" fill="white" />
        <path d="M50 50 C50 50 58 28 72 22 C86 16 94 28 88 38 C82 48 50 50 50 50Z" fill="white" />
        <path d="M50 50 C50 50 72 58 78 72 C84 86 72 94 62 88 C52 82 50 50 50 50Z" fill="white" />
        <path d="M50 50 C50 50 42 72 28 78 C14 84 6 72 12 62 C18 52 50 50 50 50Z" fill="white" />
      </g>
    </svg>
  );
}
