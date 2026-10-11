'use client';

import React from 'react';

interface AkvioraLogoIconProps {
  className?: string;
}

/**
 * Akviora Brand Icon (Icon-only mark in white with subtle layered bevels
 * matching the upward arrow 'A', S-wave ribbon, and 4-point star emblem).
 */
export const AkvioraLogoIcon: React.FC<AkvioraLogoIconProps> = ({
  className = 'w-9 h-9',
}) => {
  return (
    <svg
      viewBox="26 8 135 166"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* 1. Top-Right 4-Point Star & 4 Diagonal Spark Rays */}
      <g>
        {/* 4-Point Concave Star */}
        <path
          d="M126 10C126 23.5 129.5 27 143 27C129.5 27 126 30.5 126 44C126 30.5 122.5 27 109 27C122.5 27 126 23.5 126 10Z"
          fill="#FFFFFF"
        />
        {/* 4 Diagonal Rays around the Star */}
        <line
          x1="114"
          y1="15"
          x2="117.5"
          y2="18.5"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <line
          x1="138"
          y1="15"
          x2="134.5"
          y2="18.5"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <line
          x1="138"
          y1="39"
          x2="134.5"
          y2="35.5"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <line
          x1="114"
          y1="39"
          x2="117.5"
          y2="35.5"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>

      {/* 2. Upward-Right Arrow & Left Leg of 'A' (Two-Facet Bevel) */}
      {/* Bright Left Facet of Arrowhead & Left Shaft */}
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

      {/* 3. Inner Upper Curl of the Ribbon Inside the 'A' Apex */}
      <path
        d="M96 119C101 107 106 96 111 86C118.5 94.5 120 111 108 123.5C104 122 100 120.5 96 119Z"
        fill="#FFFFFF"
        fillOpacity="0.92"
      />

      {/* 4. Lower-Right Leg of 'A' (Two-Facet Bevel) */}
      {/* Shaded Inner Left Facet of Right Leg */}
      <path
        d="M101 146L117 137L143 172L127 172C120.5 172 115.5 168.5 112 163L101 146Z"
        fill="#FFFFFF"
        fillOpacity="0.72"
      />
      {/* Bright Outer Right Facet of Right Leg */}
      <path
        d="M121.5 109L159 172L141.5 172L114.5 129.5C118 123.5 120.5 116.5 121.5 109Z"
        fill="#FFFFFF"
      />

      {/* 5. Sweeping S-Wave Ribbon from Bottom-Left Base Across Center */}
      {/* Top Crisp Edge Highlight of the S-Wave */}
      <path
        d="M44 144C57 129 77 126 95 124C110 122 118 112 113 91C116.5 101 115 115 102 121C86 128 62 128 44 144Z"
        fill="#FFFFFF"
      />
      {/* Main Sculpted Body of the S-Wave Ribbon */}
      <path
        d="M28 172C37 151 51 133 83 128.5C105 125.5 116.5 114.5 112 91C121 102.5 123.5 121.5 111.5 135C100.5 147 81 147.5 70 154.5C62.5 159.5 60 172 48.5 172H28Z"
        fill="#FFFFFF"
        fillOpacity="0.9"
      />
    </svg>
  );
};

export default AkvioraLogoIcon;
