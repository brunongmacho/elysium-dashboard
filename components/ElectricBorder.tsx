"use client";

import { useRef } from 'react';

interface ElectricBorderProps {
  intensity?: 'low' | 'medium' | 'high' | 'extreme';
  color?: string;
  className?: string;
}

export default function ElectricBorder({
  intensity = 'medium',
  color = '#3b82f6',
  className = ''
}: ElectricBorderProps) {
  const filterId = useRef(`electric-filter-${Math.random().toString(36).substr(2, 9)}`);

  // Intensity settings for turbulence animation
  const settings = {
    low: { baseFrequency: 0.015, numOctaves: 8, scale: 8, duration: 10, blur1: 1, blur2: 4, blur3: 8 },
    medium: { baseFrequency: 0.02, numOctaves: 10, scale: 12, duration: 8, blur1: 2, blur2: 6, blur3: 12 },
    high: { baseFrequency: 0.025, numOctaves: 12, scale: 16, duration: 6, blur1: 3, blur2: 8, blur3: 16 },
    extreme: { baseFrequency: 0.03, numOctaves: 14, scale: 20, duration: 4, blur1: 4, blur2: 10, blur3: 20 },
  }[intensity];

  const gradientColor = `${color}20`; // 12% opacity - much more subtle

  return (
    <>
      {/* SVG Filters with animated turbulence */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter
            id={filterId.current}
            colorInterpolationFilters="sRGB"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            {/* First turbulence - circular motion (top-right quadrant) */}
            <feTurbulence
              type="turbulence"
              baseFrequency={settings.baseFrequency}
              numOctaves={settings.numOctaves}
              result="noise1"
              seed="1"
            />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate
                attributeName="dx"
                values={`0; 350; 0; -350; 0`}
                dur={`${settings.duration}s`}
                repeatCount="indefinite"
                calcMode="ease-in-out"
              />
              <animate
                attributeName="dy"
                values={`0; -350; 0; 350; 0`}
                dur={`${settings.duration}s`}
                repeatCount="indefinite"
                calcMode="ease-in-out"
              />
            </feOffset>

            {/* Second turbulence - opposite circular motion */}
            <feTurbulence
              type="turbulence"
              baseFrequency={settings.baseFrequency}
              numOctaves={settings.numOctaves}
              result="noise2"
              seed="3"
            />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate
                attributeName="dx"
                values={`0; -350; 0; 350; 0`}
                dur={`${settings.duration}s`}
                repeatCount="indefinite"
                calcMode="ease-in-out"
              />
              <animate
                attributeName="dy"
                values={`0; 350; 0; -350; 0`}
                dur={`${settings.duration}s`}
                repeatCount="indefinite"
                calcMode="ease-in-out"
              />
            </feOffset>

            {/* Third turbulence - diagonal swirl */}
            <feTurbulence
              type="turbulence"
              baseFrequency={settings.baseFrequency}
              numOctaves={settings.numOctaves}
              result="noise3"
              seed="5"
            />
            <feOffset in="noise3" dx="0" dy="0" result="offsetNoise3">
              <animate
                attributeName="dx"
                values={`0; 250; 0; -250; 0`}
                dur={`${settings.duration * 1.3}s`}
                repeatCount="indefinite"
                calcMode="ease-in-out"
              />
              <animate
                attributeName="dy"
                values={`0; 250; 0; -250; 0`}
                dur={`${settings.duration * 1.3}s`}
                repeatCount="indefinite"
                calcMode="ease-in-out"
              />
            </feOffset>

            {/* Fourth turbulence - chaotic swirl with different timing */}
            <feTurbulence
              type="turbulence"
              baseFrequency={settings.baseFrequency}
              numOctaves={settings.numOctaves}
              result="noise4"
              seed="7"
            />
            <feOffset in="noise4" dx="0" dy="0" result="offsetNoise4">
              <animate
                attributeName="dx"
                values={`0; -200; 0; 200; 0`}
                dur={`${settings.duration * 0.7}s`}
                repeatCount="indefinite"
                calcMode="ease-in-out"
              />
              <animate
                attributeName="dy"
                values={`0; -200; 0; 200; 0`}
                dur={`${settings.duration * 0.7}s`}
                repeatCount="indefinite"
                calcMode="ease-in-out"
              />
            </feOffset>

            {/* Combine vertical movements */}
            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />

            {/* Combine horizontal movements */}
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />

            {/* Blend both directions with color-dodge for electric effect */}
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

            {/* Apply displacement to create wavy border */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="combinedNoise"
              scale={settings.scale}
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      {/* Layer 4 - Outermost glow with strongest blur */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          border: `3px solid ${color}`,
          filter: `blur(${settings.blur3}px)`,
          opacity: 0.3,
        }}
      />

      {/* Layer 3 - Medium glow */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          border: `2.5px solid ${color}`,
          filter: `blur(${settings.blur2}px)`,
          opacity: 0.4,
        }}
      />

      {/* Layer 2 - Subtle glow close to main border */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          border: `2px solid ${color}`,
          filter: `blur(${settings.blur1}px)`,
          opacity: 0.5,
        }}
      />

      {/* Layer 1 - Main electric border with turbulence filter */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          border: `2px solid ${color}`,
          filter: `url(#${filterId.current})`,
        }}
      />

      {/* Overlay effects for shimmer */}
      <div
        className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
        style={{
          background: 'linear-gradient(-30deg, white, transparent 30%, transparent 70%, white)',
          mixBlendMode: 'overlay',
          transform: 'scale(1.02)',
          filter: 'blur(12px)',
          opacity: 0.1,
        }}
      />

      {/* Background gradient glow */}
      <div
        className="absolute inset-0 rounded-lg -z-10 pointer-events-none"
        style={{
          background: `linear-gradient(-30deg, ${gradientColor}, transparent, ${gradientColor})`,
          filter: 'blur(24px)',
          transform: 'scale(1.08)',
          opacity: 0.2,
        }}
      />
    </>
  );
}
