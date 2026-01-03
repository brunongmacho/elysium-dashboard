"use client";

import { useEffect, useRef } from 'react';

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
  const svgRef = useRef<SVGSVGElement>(null);

  // Intensity settings
  const settings = {
    low: { strokeWidth: 1.5, blur: 2, opacity: 0.6, speed: 3000, segments: 20 },
    medium: { strokeWidth: 2, blur: 3, opacity: 0.7, speed: 2000, segments: 30 },
    high: { strokeWidth: 2.5, blur: 4, opacity: 0.8, speed: 1500, segments: 40 },
    extreme: { strokeWidth: 3, blur: 5, opacity: 0.9, speed: 1000, segments: 50 },
  }[intensity];

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Generate electric path with random lightning segments
    const generateElectricPath = () => {
      const path: string[] = [];
      const perimeter = (width + height) * 2;
      const segmentLength = perimeter / settings.segments;

      let x = 0;
      let y = 0;
      let currentLength = 0;
      let side = 0; // 0=top, 1=right, 2=bottom, 3=left

      path.push(`M ${x} ${y}`);

      while (currentLength < perimeter) {
        const jitter = (Math.random() - 0.5) * 8; // Random offset for electric effect

        if (side === 0) { // Top edge
          x += segmentLength;
          if (x >= width) {
            x = width;
            side = 1;
          }
          path.push(`L ${x} ${jitter}`);
        } else if (side === 1) { // Right edge
          y += segmentLength;
          if (y >= height) {
            y = height;
            side = 2;
          }
          path.push(`L ${width + jitter} ${y}`);
        } else if (side === 2) { // Bottom edge
          x -= segmentLength;
          if (x <= 0) {
            x = 0;
            side = 3;
          }
          path.push(`L ${x} ${height + jitter}`);
        } else { // Left edge
          y -= segmentLength;
          if (y <= 0) {
            y = 0;
            side = 0;
          }
          path.push(`L ${jitter} ${y}`);
        }

        currentLength += segmentLength;
      }

      path.push('Z');
      return path.join(' ');
    };

    const pathElement = svg.querySelector('.electric-path') as SVGPathElement;
    if (!pathElement) return;

    // Animate the path
    const animate = () => {
      pathElement.setAttribute('d', generateElectricPath());
    };

    const interval = setInterval(animate, settings.speed / 10);
    animate(); // Initial render

    return () => clearInterval(interval);
  }, [intensity, settings.segments, settings.speed]);

  return (
    <svg
      ref={svgRef}
      className={`absolute inset-0 pointer-events-none overflow-visible ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <filter id={`electric-glow-${intensity}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={settings.blur} />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.5 0"
          />
          <feBlend in="SourceGraphic" mode="screen" />
        </filter>
      </defs>

      {/* Multiple layers for depth */}
      <path
        className="electric-path"
        fill="none"
        stroke={color}
        strokeWidth={settings.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={settings.opacity * 0.5}
        filter={`url(#electric-glow-${intensity})`}
      />
      <path
        className="electric-path"
        fill="none"
        stroke={color}
        strokeWidth={settings.strokeWidth * 0.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={settings.opacity}
        style={{ filter: `drop-shadow(0 0 ${settings.blur * 2}px ${color})` }}
      />
    </svg>
  );
}
