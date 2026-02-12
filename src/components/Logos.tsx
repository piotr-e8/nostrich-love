/**
 * Logo Design Concepts for Nostrich.love
 *
 * CONCEPT 1: The Purple Ostrich (Nostrich)
 * - Stylized ostrich silhouette in purple gradient
 * - Head buried in "sand" (representing being deep in the protocol)
 * - Key symbol incorporated (representing self-sovereignty)
 * - Crown feathers showing it's the "king" of decentralized social
 *
 * CONCEPT 2: Network Relay
 * - Abstract representation of relays as connected nodes
 * - Central hub with radiating connections
 * - Key icon at center
 * - Purple/violet color scheme
 *
 * CONCEPT 3: Speech Bubble + Key
 * - Speech bubble (social) combined with key (sovereignty)
 * - Lightning bolt element (zaps/Lightning Network)
 * - Purple gradient
 *
 * CONCEPT 4: Minimalist Text
 * - Wordmark "nostrich" with ostrich silhouette as the 'o'
 * - Simple, clean, recognizable
 *
 * Recommended: Concept 1 for main logo, Concept 4 for wordmark
 */

import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Main Logo - The Nostrich (Purple Ostrich)
 * Best for: Favicon, app icon, social media avatars
 */
export function LogoNostrich({
  width = 200,
  height = 200,
  className,
}: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Circular background */}
      <circle
        cx="100"
        cy="100"
        r="95"
        fill="url(#purpleGradient)"
        opacity="0.1"
      />

      {/* Ostrich Body */}
      <ellipse
        cx="100"
        cy="130"
        rx="45"
        ry="35"
        fill="url(#purpleGradient)"
        filter="url(#glow)"
      />

      {/* Neck */}
      <rect
        x="85"
        y="60"
        width="30"
        height="70"
        rx="15"
        fill="url(#purpleGradient)"
      />

      {/* Head */}
      <ellipse cx="100" cy="50" rx="25" ry="20" fill="url(#purpleGradient)" />

      {/* Beak */}
      <path d="M 120 50 L 145 55 L 120 60 Z" fill="#F59E0B" />

      {/* Eye */}
      <circle cx="108" cy="48" r="5" fill="white" />
      <circle cx="108" cy="48" r="2" fill="#1F2937" />

      {/* Legs */}
      <rect
        x="80"
        y="160"
        width="8"
        height="30"
        rx="4"
        fill="url(#purpleGradient)"
      />
      <rect
        x="112"
        y="160"
        width="8"
        height="30"
        rx="4"
        fill="url(#purpleGradient)"
      />

      {/* Crown feathers */}
      <path
        d="M 85 35 Q 75 15 85 25"
        stroke="#8B5CF6"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M 100 30 Q 100 10 100 22"
        stroke="#8B5CF6"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M 115 35 Q 125 15 115 25"
        stroke="#8B5CF6"
        strokeWidth="3"
        fill="none"
      />

      {/* Key symbol on body */}
      <g transform="translate(92, 120)">
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke="white"
          strokeWidth="2"
          fill="none"
        />
        <line x1="8" y1="14" x2="8" y2="22" stroke="white" strokeWidth="2" />
        <line x1="8" y1="22" x2="12" y2="22" stroke="white" strokeWidth="2" />
        <line x1="8" y1="18" x2="11" y2="18" stroke="white" strokeWidth="2" />
      </g>
    </svg>
  );
}

/**
 * Wordmark Logo - Text with integrated icon
 * Best for: Website header, business cards, letterheads
 */
export function LogoWordmark({
  width = 400,
  height = 80,
  className,
}: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 80"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>

      {/* The 'o' in nostrich is the ostrich icon */}
      <text
        x="0"
        y="60"
        fontFamily="Inter, sans-serif"
        fontSize="48"
        fontWeight="700"
        fill="url(#textGradient)"
      >
        n
      </text>

      {/* Ostrich icon replacing 'o' */}
      <g transform="translate(30, 15) scale(0.35)">
        <ellipse cx="100" cy="130" rx="45" ry="35" fill="url(#textGradient)" />
        <rect
          x="85"
          y="60"
          width="30"
          height="70"
          rx="15"
          fill="url(#textGradient)"
        />
        <ellipse cx="100" cy="50" rx="25" ry="20" fill="url(#textGradient)" />
        <path d="M 120 50 L 145 55 L 120 60 Z" fill="#F59E0B" />
        <circle cx="108" cy="48" r="5" fill="white" />
        <circle cx="108" cy="48" r="2" fill="#1F2937" />
      </g>

      <text
        x="78"
        y="60"
        fontFamily="Inter, sans-serif"
        fontSize="48"
        fontWeight="700"
        fill="url(#textGradient)"
      >
        strich
      </text>

      <text
        x="220"
        y="60"
        fontFamily="Inter, sans-serif"
        fontSize="48"
        fontWeight="300"
        fill="#6B7280"
      >
        .love
      </text>
    </svg>
  );
}

/**
 * Icon-only Logo (for favicon, small spaces)
 * 32x32 or 16x16 optimized
 */
export function LogoIcon({ width = 32, height = 32, className }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <rect width="32" height="32" rx="8" fill="#8B5CF6" />

      {/* Simplified ostrich head */}
      <ellipse cx="16" cy="12" rx="6" ry="5" fill="white" />
      <path d="M 20 12 L 24 13 L 20 14 Z" fill="#F59E0B" />
      <circle cx="17" cy="11" r="1.5" fill="#1F2937" />

      {/* Neck */}
      <rect x="14" y="16" width="4" height="8" rx="2" fill="white" />

      {/* Key symbol */}
      <circle
        cx="16"
        cy="26"
        r="2"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

/**
 * Dark mode variant
 */
export function LogoDark({ width = 200, height = 200, className }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="darkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      {/* Dark circular background */}
      <circle cx="100" cy="100" r="95" fill="#1F2937" />
      <circle cx="100" cy="100" r="90" fill="#111827" />

      {/* Ostrich - lighter purple for dark mode */}
      <ellipse cx="100" cy="130" rx="45" ry="35" fill="url(#darkGradient)" />
      <rect
        x="85"
        y="60"
        width="30"
        height="70"
        rx="15"
        fill="url(#darkGradient)"
      />
      <ellipse cx="100" cy="50" rx="25" ry="20" fill="url(#darkGradient)" />
      <path d="M 120 50 L 145 55 L 120 60 Z" fill="#FBBF24" />
      <circle cx="108" cy="48" r="5" fill="white" />
      <circle cx="108" cy="48" r="2" fill="#1F2937" />
      <rect
        x="80"
        y="160"
        width="8"
        height="30"
        rx="4"
        fill="url(#darkGradient)"
      />
      <rect
        x="112"
        y="160"
        width="8"
        height="30"
        rx="4"
        fill="url(#darkGradient)"
      />

      {/* Crown feathers */}
      <path
        d="M 85 35 Q 75 15 85 25"
        stroke="#A78BFA"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M 100 30 Q 100 10 100 22"
        stroke="#A78BFA"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M 115 35 Q 125 15 115 25"
        stroke="#A78BFA"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
}

/**
 * Animated Logo for loading states
 */
export function LogoAnimated({
  width = 200,
  height = 200,
  className,
}: LogoProps) {
  // This would be used with Framer Motion for animation
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="animGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6">
            <animate
              attributeName="stop-color"
              values="#8B5CF6;#A78BFA;#8B5CF6"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#7C3AED">
            <animate
              attributeName="stop-color"
              values="#7C3AED;#8B5CF6;#7C3AED"
              dur="3s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>

      {/* Pulsing circle background */}
      <circle cx="100" cy="100" r="95" fill="url(#animGradient)" opacity="0.1">
        <animate
          attributeName="r"
          values="95;100;95"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.1;0.2;0.1"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Static ostrich */}
      <ellipse cx="100" cy="130" rx="45" ry="35" fill="url(#animGradient)" />
      <rect
        x="85"
        y="60"
        width="30"
        height="70"
        rx="15"
        fill="url(#animGradient)"
      />
      <ellipse cx="100" cy="50" rx="25" ry="20" fill="url(#animGradient)" />
      <path d="M 120 50 L 145 55 L 120 60 Z" fill="#F59E0B" />
      <circle cx="108" cy="48" r="5" fill="white" />
      <circle cx="108" cy="48" r="2" fill="#1F2937" />
    </svg>
  );
}
