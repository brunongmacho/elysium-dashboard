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
    low: { strokeWidth: 2.5, blur: 8, jitter: 4, segmentSize: 25, updateInterval: 150 },
    medium: { strokeWidth: 3, blur: 10, jitter: 6, segmentSize: 20, updateInterval: 100 },
    high: { strokeWidth: 3.5, blur: 12, jitter: 8, segmentSize: 15, updateInterval: 80 },
    extreme: { strokeWidth: 4, blur: 15, jitter: 12, segmentSize: 12, updateInterval: 50 },
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

        // TOP EDGE - with smooth electric curves
        let x = cornerRadius;
        let prevJitterY = 0;
        while (x < width - cornerRadius) {
          x += segmentSize;
          const actualX = Math.min(x, width - cornerRadius);
          const jitterY = (Math.random() - 0.5) * jitter;

          // Use quadratic curves for smoother, more rounded electric effect
          const controlX = actualX - segmentSize / 2;
          const controlY = (prevJitterY + jitterY) / 2;
          path.push(`Q ${controlX} ${controlY} ${actualX} ${jitterY}`);
          prevJitterY = jitterY;
        }

        // Top-right corner - smooth curve
        path.push(`Q ${width} 0 ${width} ${cornerRadius}`);

        // RIGHT EDGE - with smooth electric curves
        let y = cornerRadius;
        let prevJitterX = width;
        while (y < height - cornerRadius) {
          y += segmentSize;
          const actualY = Math.min(y, height - cornerRadius);
          const jitterX = width + (Math.random() - 0.5) * jitter;

          const controlY = actualY - segmentSize / 2;
          const controlX = (prevJitterX + jitterX) / 2;
          path.push(`Q ${controlX} ${controlY} ${jitterX} ${actualY}`);
          prevJitterX = jitterX;
        }

        // Bottom-right corner - smooth curve
        path.push(`Q ${width} ${height} ${width - cornerRadius} ${height}`);

        // BOTTOM EDGE - with smooth electric curves
        x = width - cornerRadius;
        prevJitterY = height;
        while (x > cornerRadius) {
          x -= segmentSize;
          const actualX = Math.max(x, cornerRadius);
          const jitterY = height + (Math.random() - 0.5) * jitter;

          const controlX = actualX + segmentSize / 2;
          const controlY = (prevJitterY + jitterY) / 2;
          path.push(`Q ${controlX} ${controlY} ${actualX} ${jitterY}`);
          prevJitterY = jitterY;
        }

        // Bottom-left corner - smooth curve
        path.push(`Q 0 ${height} 0 ${height - cornerRadius}`);

        // LEFT EDGE - with smooth electric curves
        y = height - cornerRadius;
        prevJitterX = 0;
        while (y > cornerRadius) {
          y -= segmentSize;
          const actualY = Math.max(y, cornerRadius);
          const jitterX = (Math.random() - 0.5) * jitter;

          const controlY = actualY + segmentSize / 2;
          const controlX = (prevJitterX + jitterX) / 2;
          path.push(`Q ${controlX} ${controlY} ${jitterX} ${actualY}`);
          prevJitterX = jitterX;
        }

        // Top-left corner - smooth curve
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
        <filter id={`electric-glow-${intensity}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={settings.blur} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 4 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Strong outer glow layer */}
      <path
        d={borderPath}
        fill="none"
        stroke={color}
        strokeWidth={settings.strokeWidth * 4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.4}
        filter={`url(#electric-glow-${intensity})`}
      />

      {/* Medium glow layer */}
      <path
        d={borderPath}
        fill="none"
        stroke={color}
        strokeWidth={settings.strokeWidth * 2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
        style={{
          filter: `blur(${settings.blur / 2}px)`
        }}
      />

      {/* Main electric border */}
      <path
        d={borderPath}
        fill="none"
        stroke={color}
        strokeWidth={settings.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={1}
        style={{
          filter: `drop-shadow(0 0 ${settings.blur / 2}px ${color}) drop-shadow(0 0 ${settings.blur}px ${color})`
        }}
      />

      {/* Bright inner core */}
      <path
        d={borderPath}
        fill="none"
        stroke="white"
        strokeWidth={settings.strokeWidth * 0.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.95}
      />
    </svg>
  );
}
