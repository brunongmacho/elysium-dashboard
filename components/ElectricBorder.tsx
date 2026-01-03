"use client";

import { useEffect, useRef, useState } from 'react';

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
  const [borderPath, setBorderPath] = useState('');

  // Intensity settings - controls zigzag amplitude and frequency
  const settings = {
    low: { strokeWidth: 2, blur: 4, jitter: 3, segmentSize: 20, updateInterval: 150 },
    medium: { strokeWidth: 2.5, blur: 5, jitter: 5, segmentSize: 15, updateInterval: 100 },
    high: { strokeWidth: 3, blur: 6, jitter: 7, segmentSize: 12, updateInterval: 80 },
    extreme: { strokeWidth: 3.5, blur: 8, jitter: 10, segmentSize: 10, updateInterval: 50 },
  }[intensity];

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;

    const updateBorder = () => {
      const rect = svg.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const { jitter, segmentSize } = settings;

      // Generate continuous electric border around entire perimeter
      const generateElectricPerimeter = () => {
        const path: string[] = [];
        const cornerRadius = 8; // Match card border radius

        // Start at top-left corner (after radius)
        path.push(`M ${cornerRadius} 0`);

        // TOP EDGE - with electric zigzag
        let x = cornerRadius;
        while (x < width - cornerRadius) {
          x += segmentSize;
          const actualX = Math.min(x, width - cornerRadius);
          const jitterY = (Math.random() - 0.5) * jitter;
          path.push(`L ${actualX} ${jitterY}`);
        }

        // Top-right corner arc
        path.push(`Q ${width} 0 ${width} ${cornerRadius}`);

        // RIGHT EDGE - with electric zigzag
        let y = cornerRadius;
        while (y < height - cornerRadius) {
          y += segmentSize;
          const actualY = Math.min(y, height - cornerRadius);
          const jitterX = width + (Math.random() - 0.5) * jitter;
          path.push(`L ${jitterX} ${actualY}`);
        }

        // Bottom-right corner arc
        path.push(`Q ${width} ${height} ${width - cornerRadius} ${height}`);

        // BOTTOM EDGE - with electric zigzag
        x = width - cornerRadius;
        while (x > cornerRadius) {
          x -= segmentSize;
          const actualX = Math.max(x, cornerRadius);
          const jitterY = height + (Math.random() - 0.5) * jitter;
          path.push(`L ${actualX} ${jitterY}`);
        }

        // Bottom-left corner arc
        path.push(`Q 0 ${height} 0 ${height - cornerRadius}`);

        // LEFT EDGE - with electric zigzag
        y = height - cornerRadius;
        while (y > cornerRadius) {
          y -= segmentSize;
          const actualY = Math.max(y, cornerRadius);
          const jitterX = (Math.random() - 0.5) * jitter;
          path.push(`L ${jitterX} ${actualY}`);
        }

        // Top-left corner arc
        path.push(`Q 0 0 ${cornerRadius} 0`);
        path.push('Z');

        return path.join(' ');
      };

      setBorderPath(generateElectricPerimeter());
    };

    // Initial render
    updateBorder();

    // Animate the electric border
    const interval = setInterval(updateBorder, settings.updateInterval);

    // Handle resize
    const handleResize = () => updateBorder();
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity, settings]);

  return (
    <svg
      ref={svgRef}
      className={`absolute inset-0 pointer-events-none overflow-visible ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <filter id={`electric-glow-${intensity}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={settings.blur} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer glow layer */}
      <path
        d={borderPath}
        fill="none"
        stroke={color}
        strokeWidth={settings.strokeWidth * 3}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.2}
        filter={`url(#electric-glow-${intensity})`}
      />

      {/* Main electric border */}
      <path
        d={borderPath}
        fill="none"
        stroke={color}
        strokeWidth={settings.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.9}
        style={{
          filter: `drop-shadow(0 0 ${settings.blur}px ${color}) drop-shadow(0 0 ${settings.blur * 2}px ${color})`
        }}
      />

      {/* Bright inner core */}
      <path
        d={borderPath}
        fill="none"
        stroke="white"
        strokeWidth={settings.strokeWidth * 0.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.9}
      />
    </svg>
  );
}
