'use client';

import React, { useId } from 'react';

export interface AkvioraLogoIconProps {
  className?: string;
  ariaLabel?: string;
  color?: 'white' | 'theme';
}

/**
 * Akviora Brand Icon
 * Supports pure crisp white (`color="white"`, default) and theme-colored (`color="theme"`).
 * Geometry faithfully models the official brand icon:
 * - Upward-pointing arrow 'A' with sharp center ridge and two-facet bevel
 * - 3D beveled rectangular right leg
 * - Sweeping S-wave ribbon curling across the crossbar
 * - Top-right 4-point diamond star with 4 diagonal radiant rays
 */
export const AkvioraLogoIcon: React.FC<AkvioraLogoIconProps> = ({
  className = 'w-9 h-9',
  ariaLabel = 'Akviora Technologies Logo',
  color = 'white',
}) => {
  const rawId = useId();
  const id = rawId.replace(/[:]/g, '');

  if (color === 'white') {
    return (
      <svg
        viewBox="20 4 146 172"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={ariaLabel}
        className={className}
      >
        {/* 1. Top-Right 4-Point Star & 4 Diagonal Spark Rays in Clean White */}
        <g>
          {/* 4-Point Concave Diamond Star */}
          <path
            d="M126 9C126 23.2 129.8 27 144 27C129.8 27 126 30.8 126 45C126 30.8 122.2 27 108 27C122.2 27 126 23.2 126 9Z"
            fill="#FFFFFF"
          />

          {/* 4 Diagonal Accent Rays around the Star */}
          <line
            x1="113"
            y1="14"
            x2="117.5"
            y2="18.5"
            stroke="#FFFFFF"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <line
            x1="139"
            y1="14"
            x2="134.5"
            y2="18.5"
            stroke="#FFFFFF"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <line
            x1="139"
            y1="40"
            x2="134.5"
            y2="35.5"
            stroke="#FFFFFF"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <line
            x1="113"
            y1="40"
            x2="117.5"
            y2="35.5"
            stroke="#FFFFFF"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </g>

        {/* 2. Lower-Right Leg of 'A' (3D Beveled Pillar) in White */}
        <g>
          {/* Shaded Inner Left Facet */}
          <path
            d="M101 146L117 137L143 172L127 172C120.5 172 115.5 168.5 112 163L101 146Z"
            fill="#FFFFFF"
            fillOpacity="0.72"
          />
          {/* Outer Right Facet */}
          <path
            d="M121.5 109L159 172L141.5 172L114.5 129.5C118 123.5 120.5 116.5 121.5 109Z"
            fill="#FFFFFF"
            fillOpacity="0.88"
          />
        </g>

        {/* 3. Upward-Right Arrow & Left Leg of 'A' (Two-Facet Bevel) in White */}
        <g>
          {/* Lit Left Facet of Arrowhead & Left Shaft */}
          <path
            d="M119 42L83 58L93.5 63.5L49 135C54.5 130.5 61 127.5 68.5 125.5L108.5 60.5L119 42Z"
            fill="#FFFFFF"
          />

          {/* Shaded Right Facet of Arrowhead & Inner Left Shaft */}
          <path
            d="M119 42L119 88L108.5 79L81 123C76.5 123.8 72.5 124.5 68.5 125.5L108.5 60.5L119 42Z"
            fill="#FFFFFF"
            fillOpacity="0.78"
          />

          {/* Center Ridge Highlight on Arrow */}
          <path
            d="M119 42L108.5 60.5L68.5 125.5"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity="0.95"
          />
        </g>

        {/* 4. Inner Upper Curl of the Ribbon Behind the Apex */}
        <path
          d="M96 119C101 107 106 96 111 86C118.5 94.5 120 111 108 123.5C104 122 100 120.5 96 119Z"
          fill="#FFFFFF"
          fillOpacity="0.55"
        />

        {/* 5. Underside Curl of Ribbon Over Right Leg */}
        <path
          d="M112 91C121 102.5 123.5 121.5 111.5 135C108 131 106 123 111 110C113 103 112 95 112 91Z"
          fill="#FFFFFF"
          fillOpacity="0.65"
        />

        {/* 6. Main Sweeping S-Wave Ribbon Across Center in White */}
        {/* Main Body */}
        <path
          d="M28 172C37 151 51 133 83 128.5C105 125.5 116.5 114.5 112 91C121 102.5 123.5 121.5 111.5 135C100.5 147 81 147.5 70 154.5C62.5 159.5 60 172 48.5 172H28Z"
          fill="#FFFFFF"
          fillOpacity="0.92"
        />

        {/* Crisp Top Rim Edge Highlight */}
        <path
          d="M44 144C57 129 77 126 95 124C110 122 118 112 113 91C116.5 101 115 115 102 121C86 128 62 128 44 144Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="20 4 146 172"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      className={className}
    >
      <defs>
        {/* Soft radial glow behind the 4-point star */}
        <radialGradient
          id={`${id}-starGlow`}
          cx="126"
          cy="26"
          r="26"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#5CE1E6" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#38BDF8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#5CE1E6" stopOpacity="0" />
        </radialGradient>

        {/* 4-Point Star fill: white-hot center to radiant cyan tips */}
        <radialGradient
          id={`${id}-starFill`}
          cx="126"
          cy="27"
          r="16"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#E0F7FA" />
          <stop offset="85%" stopColor="#5CE1E6" />
          <stop offset="100%" stopColor="#38BDF8" />
        </radialGradient>

        {/* Left Facet of Arrowhead & Left Leg: luminous cyan to vibrant sky blue */}
        <linearGradient
          id={`${id}-arrowLeft`}
          x1="65"
          y1="135"
          x2="119"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4338CA" />
          <stop offset="28%" stopColor="#3B82F6" />
          <stop offset="62%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#5CE1E6" />
        </linearGradient>

        {/* Right Facet of Arrowhead & Inner Shaft: periwinkle to rich shaded violet */}
        <linearGradient
          id={`${id}-arrowRight`}
          x1="119"
          y1="42"
          x2="95"
          y2="115"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7A86FF" />
          <stop offset="35%" stopColor="#6366F1" />
          <stop offset="75%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>

        {/* Inner curl of ribbon behind arrow apex */}
        <linearGradient
          id={`${id}-ribbonCurl`}
          x1="96"
          y1="119"
          x2="115"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="55%" stopColor="#312E81" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>

        {/* Right Leg of 'A' Inner / Front Facet: metallic cyan to deep slate teal */}
        <linearGradient
          id={`${id}-rightLegInner`}
          x1="105"
          y1="137"
          x2="135"
          y2="172"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="45%" stopColor="#0369A1" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>

        {/* Right Leg of 'A' Outer Right Facet: shaded deep teal-navy */}
        <linearGradient
          id={`${id}-rightLegOuter`}
          x1="120"
          y1="110"
          x2="155"
          y2="172"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#0369A1" />
          <stop offset="45%" stopColor="#0C4A6E" />
          <stop offset="100%" stopColor="#082F49" />
        </linearGradient>

        {/* Sweeping S-Wave Ribbon Main Body: electric cyan across trough to periwinkle/violet */}
        <linearGradient
          id={`${id}-ribbonBody`}
          x1="28"
          y1="150"
          x2="124"
          y2="115"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="18%" stopColor="#5CE1E6" />
          <stop offset="48%" stopColor="#5CE1E6" />
          <stop offset="76%" stopColor="#7A86FF" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>

        {/* Sweeping S-Wave Ribbon Top Edge Highlight: crisp white-cyan glint */}
        <linearGradient
          id={`${id}-ribbonHighlight`}
          x1="44"
          y1="144"
          x2="115"
          y2="105"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#A5F3FC" />
          <stop offset="42%" stopColor="#FFFFFF" />
          <stop offset="78%" stopColor="#5CE1E6" />
          <stop offset="100%" stopColor="#C7D2FE" />
        </linearGradient>

        {/* Underside shadow of the ribbon curling over the right leg */}
        <linearGradient
          id={`${id}-ribbonUnderside`}
          x1="110"
          y1="95"
          x2="125"
          y2="135"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7A86FF" />
          <stop offset="45%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>

        {/* Center ridge highlight line along the arrow */}
        <linearGradient
          id={`${id}-arrowRidge`}
          x1="119"
          y1="42"
          x2="70"
          y2="125"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#A5F3FC" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#5CE1E6" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* 1. Top-Right Radiant Aura, 4-Point Star & Diagonal Accent Rays */}
      <g>
        <circle cx="126" cy="27" r="22" fill={`url(#${id}-starGlow)`} />
        <path
          d="M126 9C126 23.2 129.8 27 144 27C129.8 27 126 30.8 126 45C126 30.8 122.2 27 108 27C122.2 27 126 23.2 126 9Z"
          fill={`url(#${id}-starFill)`}
        />
        <line
          x1="113"
          y1="14"
          x2="117.5"
          y2="18.5"
          stroke="#5CE1E6"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <line
          x1="139"
          y1="14"
          x2="134.5"
          y2="18.5"
          stroke="#5CE1E6"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <line
          x1="139"
          y1="40"
          x2="134.5"
          y2="35.5"
          stroke="#5CE1E6"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <line
          x1="113"
          y1="40"
          x2="117.5"
          y2="35.5"
          stroke="#5CE1E6"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </g>

      {/* 2. Lower-Right Leg of 'A' (3D Beveled Pillar) */}
      <g>
        <path
          d="M101 146L117 137L143 172L127 172C120.5 172 115.5 168.5 112 163L101 146Z"
          fill={`url(#${id}-rightLegInner)`}
        />
        <path
          d="M121.5 109L159 172L141.5 172L114.5 129.5C118 123.5 120.5 116.5 121.5 109Z"
          fill={`url(#${id}-rightLegOuter)`}
        />
      </g>

      {/* 3. Upward-Right Arrow & Left Leg of 'A' */}
      <g>
        <path
          d="M119 42L83 58L93.5 63.5L49 135C54.5 130.5 61 127.5 68.5 125.5L108.5 60.5L119 42Z"
          fill={`url(#${id}-arrowLeft)`}
        />
        <path
          d="M119 42L119 88L108.5 79L81 123C76.5 123.8 72.5 124.5 68.5 125.5L108.5 60.5L119 42Z"
          fill={`url(#${id}-arrowRight)`}
        />
        <path
          d="M119 42L108.5 60.5L68.5 125.5"
          stroke={`url(#${id}-arrowRidge)`}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>

      {/* 4. Inner Upper Curl of the Ribbon Behind the Apex */}
      <path
        d="M96 119C101 107 106 96 111 86C118.5 94.5 120 111 108 123.5C104 122 100 120.5 96 119Z"
        fill={`url(#${id}-ribbonCurl)`}
      />

      {/* 5. Underside Curl of Ribbon Over Right Leg */}
      <path
        d="M112 91C121 102.5 123.5 121.5 111.5 135C108 131 106 123 111 110C113 103 112 95 112 91Z"
        fill={`url(#${id}-ribbonUnderside)`}
      />

      {/* 6. Main Sweeping S-Wave Ribbon Across Center */}
      <path
        d="M28 172C37 151 51 133 83 128.5C105 125.5 116.5 114.5 112 91C121 102.5 123.5 121.5 111.5 135C100.5 147 81 147.5 70 154.5C62.5 159.5 60 172 48.5 172H28Z"
        fill={`url(#${id}-ribbonBody)`}
      />
      <path
        d="M44 144C57 129 77 126 95 124C110 122 118 112 113 91C116.5 101 115 115 102 121C86 128 62 128 44 144Z"
        fill={`url(#${id}-ribbonHighlight)`}
      />
    </svg>
  );
};

export interface AkvioraLogoProps {
  className?: string;
  iconClassName?: string;
  variant?: 'icon' | 'horizontal' | 'badge';
  color?: 'white' | 'theme';
  showSubtitle?: boolean;
  onClick?: () => void;
}

/**
 * Full Akviora Brand Logo Lockup
 */
export const AkvioraLogo: React.FC<AkvioraLogoProps> = ({
  className = '',
  iconClassName = 'w-9 h-9 sm:w-10 sm:h-10 shrink-0',
  variant = 'horizontal',
  color = 'white',
  showSubtitle = false,
  onClick,
}) => {
  if (variant === 'icon') {
    return <AkvioraLogoIcon className={iconClassName} color={color} />;
  }

  if (variant === 'badge') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-center text-center p-4 rounded-2xl bg-[#060B14]/90 border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${className}`}
      >
        <AkvioraLogoIcon className="w-24 h-24 sm:w-32 sm:h-32 mb-3" color={color} />
        <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-[0.16em] text-[#EAF4F8] leading-none pl-1">
          AKVIORA
        </span>
        <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.22em] text-[#5CE1E6] mt-2 uppercase">
          DESIGN • DEVELOP • SCALE
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}
    >
      <AkvioraLogoIcon className={iconClassName} color={color} />
      <div className="flex flex-col justify-center">
        <span className="font-display font-bold text-[19px] sm:text-[21px] leading-none tracking-tight text-[#EAF4F8]">
          Akviora
        </span>
        {showSubtitle && (
          <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.18em] text-[#5CE1E6] mt-1 uppercase">
            DESIGN • DEVELOP • SCALE
          </span>
        )}
      </div>
    </div>
  );
};

export default AkvioraLogoIcon;
