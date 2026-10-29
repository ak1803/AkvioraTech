'use client';

import React, { useId } from 'react';

export interface AkvioraLogoIconProps {
  className?: string;
  ariaLabel?: string;
  color?: 'white' | 'theme';
}

/**
 * Akviora Brand Icon (Official 3D Geometric Emblem)
 * Reconstructed directly from the official Akviora brand mark:
 * - Upward-pointing 3D arrow 'A' apex with central ridge & beveled wings
 * - Grounded left shaft and 3D beveled rectangular right leg
 * - Sweeping 3D S-curve ribbon looping around the crossbar with depth separation
 * - Top-right 4-point sparkling star with 4 diagonal radiant rays
 * Defaults to pure crisp white (`color="white"`).
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
        viewBox="16 12 168 172"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={ariaLabel}
        className={className}
      >
        <defs>
          {/* Subtle soft white ambient aura behind the star */}
          <radialGradient
            id={`${id}-whiteStarGlow`}
            cx="146"
            cy="38"
            r="20"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. TOP-RIGHT 4-POINT STAR & 4 DIAGONAL RADIANT RAYS */}
        <g>
          {/* Soft ambient sparkle aura */}
          <circle cx="146" cy="38" r="18" fill={`url(#${id}-whiteStarGlow)`} />

          {/* 4-Point Concave Diamond Star */}
          <path
            d="M146 22 C146 32.5 150.5 38 162 38 C150.5 38 146 43.5 146 54 C146 43.5 141.5 38 130 38 C141.5 38 146 32.5 146 22 Z"
            fill="#FFFFFF"
          />

          {/* 4 Diagonal Radiant Spark Rays */}
          <line
            x1="133"
            y1="25"
            x2="138"
            y2="30"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <line
            x1="159"
            y1="25"
            x2="154"
            y2="30"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <line
            x1="159"
            y1="51"
            x2="154"
            y2="46"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <line
            x1="133"
            y1="51"
            x2="138"
            y2="46"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </g>

        {/* 2. LOWER-RIGHT LEG OF 'A' (3D BEVELED PILLAR) */}
        <g>
          {/* Shaded Inner Left Facet */}
          <path
            d="M118 68 L114 76 L154 172 L140 172 L108 88 Z"
            fill="#CBD5E1"
          />
          {/* Outer Right Facet */}
          <path
            d="M118 68 L168 172 L154 172 L114 76 Z"
            fill="#E2E8F0"
          />
        </g>

        {/* 3. UPWARD ARROWHEAD & LEFT LEG OF 'A' */}
        <g>
          {/* Lit Left Facet of Arrowhead & Left Shaft */}
          <path
            d="M114 26 L84 46 L93 52 L34 172 L48 172 L106 60 Z"
            fill="#FFFFFF"
          />

          {/* Shaded Right Barb of Arrowhead */}
          <path
            d="M114 26 L106 60 L118 58 L128 48 Z"
            fill="#CBD5E1"
          />

          {/* Shaded Inner Left Shaft */}
          <path
            d="M106 60 L48 172 L62 172 L101 72 Z"
            fill="#CBD5E1"
          />

          {/* Center Ridge Crease Highlight on Arrow */}
          <path
            d="M114 26 L106 60 L48 172"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* 4. INNER UPPER CURL OF RIBBON BEHIND APEX */}
        <path
          d="M98 116 C103 104 108 93 113 83 C120 91.5 122 108 110 120.5 C106 119 102 117.5 98 116 Z"
          fill="#94A3B8"
        />

        {/* 5. UNDERSIDE RIBBON LOOP TUCKING BEHIND RIGHT LEG */}
        <path
          d="M156 96 C168 108 170 126 158 138 C154 134 152 126 156 114 C158 107 157 100 156 96 Z"
          fill="#64748B"
        />

        {/* 6. SWEEPING 3D S-WAVE RIBBON (CROSSBAR OF 'A') */}
        {/* Main Sculpted Front Body with Dark Edge Separation Contour */}
        <path
          d="M36 128 C45 110 58 98 86 112 C106 122 120 126 138 120 C154 114 162 104 166 96 C170 108 168 124 154 136 C136 150 112 152 90 144 C68 136 50 142 36 148 Z"
          fill="#F8FAFC"
          stroke="#060B14"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Top Rim Highlight on S-Ribbon */}
        <path
          d="M36 128 C45 110 58 98 86 112 C106 122 120 126 138 120 C154 114 162 104 166 96 C162 100 152 108 138 114 C120 120 106 116 86 106 C58 92 45 104 36 128 Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // Theme-colored version matching the uploaded art colors (#5CE1E6, #38BDF8, #7A86FF, #4F46E5)
  return (
    <svg
      viewBox="16 12 168 172"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      className={className}
    >
      <defs>
        {/* Soft radial glow behind star */}
        <radialGradient
          id={`${id}-starGlow`}
          cx="146"
          cy="38"
          r="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#5CE1E6" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#38BDF8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#5CE1E6" stopOpacity="0" />
        </radialGradient>

        {/* 4-Point Star fill: white-hot center to radiant cyan tips */}
        <radialGradient
          id={`${id}-starFill`}
          cx="146"
          cy="38"
          r="16"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#E0F7FA" />
          <stop offset="85%" stopColor="#5CE1E6" />
          <stop offset="100%" stopColor="#38BDF8" />
        </radialGradient>

        {/* Arrow Lit Left Facet: vibrant cyan to sky blue */}
        <linearGradient
          id={`${id}-arrowLeft`}
          x1="55"
          y1="160"
          x2="114"
          y2="26"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4338CA" />
          <stop offset="28%" stopColor="#3B82F6" />
          <stop offset="62%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#5CE1E6" />
        </linearGradient>

        {/* Arrow Shaded Right Facet: periwinkle to deep violet */}
        <linearGradient
          id={`${id}-arrowRight`}
          x1="114"
          y1="26"
          x2="90"
          y2="115"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7A86FF" />
          <stop offset="35%" stopColor="#6366F1" />
          <stop offset="75%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>

        {/* Right Leg Inner Facet */}
        <linearGradient
          id={`${id}-rightLegInner`}
          x1="110"
          y1="75"
          x2="145"
          y2="172"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#0369A1" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>

        {/* Right Leg Outer Facet */}
        <linearGradient
          id={`${id}-rightLegOuter`}
          x1="120"
          y1="70"
          x2="165"
          y2="172"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#0369A1" />
          <stop offset="50%" stopColor="#0C4A6E" />
          <stop offset="100%" stopColor="#082F49" />
        </linearGradient>

        {/* Sweeping S-Wave Ribbon Main Body */}
        <linearGradient
          id={`${id}-ribbonBody`}
          x1="36"
          y1="140"
          x2="166"
          y2="105"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="20%" stopColor="#5CE1E6" />
          <stop offset="50%" stopColor="#5CE1E6" />
          <stop offset="78%" stopColor="#7A86FF" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>

        {/* Sweeping S-Wave Ribbon Top Highlight */}
        <linearGradient
          id={`${id}-ribbonHighlight`}
          x1="36"
          y1="128"
          x2="166"
          y2="96"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#A5F3FC" />
          <stop offset="42%" stopColor="#FFFFFF" />
          <stop offset="78%" stopColor="#5CE1E6" />
          <stop offset="100%" stopColor="#C7D2FE" />
        </linearGradient>
      </defs>

      {/* 1. Star & Rays */}
      <g>
        <circle cx="146" cy="38" r="18" fill={`url(#${id}-starGlow)`} />
        <path
          d="M146 22 C146 32.5 150.5 38 162 38 C150.5 38 146 43.5 146 54 C146 43.5 141.5 38 130 38 C141.5 38 146 32.5 146 22 Z"
          fill={`url(#${id}-starFill)`}
        />
        <line x1="133" y1="25" x2="138" y2="30" stroke="#5CE1E6" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="159" y1="25" x2="154" y2="30" stroke="#5CE1E6" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="159" y1="51" x2="154" y2="46" stroke="#5CE1E6" strokeWidth="2.8" strokeLinecap="round" />
        <line x1="133" y1="51" x2="138" y2="46" stroke="#5CE1E6" strokeWidth="2.8" strokeLinecap="round" />
      </g>

      {/* 2. Right Leg */}
      <g>
        <path d="M118 68 L114 76 L154 172 L140 172 L108 88 Z" fill={`url(#${id}-rightLegInner)`} />
        <path d="M118 68 L168 172 L154 172 L114 76 Z" fill={`url(#${id}-rightLegOuter)`} />
      </g>

      {/* 3. Arrow & Left Leg */}
      <g>
        <path d="M114 26 L84 46 L93 52 L34 172 L48 172 L106 60 Z" fill={`url(#${id}-arrowLeft)`} />
        <path d="M114 26 L106 60 L118 58 L128 48 Z" fill={`url(#${id}-arrowRight)`} />
        <path d="M106 60 L48 172 L62 172 L101 72 Z" fill="#312E81" />
        <path d="M114 26 L106 60 L48 172" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.85" />
      </g>

      {/* 4. Ribbon */}
      <path
        d="M36 128 C45 110 58 98 86 112 C106 122 120 126 138 120 C154 114 162 104 166 96 C170 108 168 124 154 136 C136 150 112 152 90 144 C68 136 50 142 36 148 Z"
        fill={`url(#${id}-ribbonBody)`}
        stroke="#060B14"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M36 128 C45 110 58 98 86 112 C106 122 120 126 138 120 C154 114 162 104 166 96 C162 100 152 108 138 114 C120 120 106 116 86 106 C58 92 45 104 36 128 Z"
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
