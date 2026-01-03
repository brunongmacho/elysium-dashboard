"use client";

import { useEffect, useRef, useState } from 'react';

interface ElectricBorderProps {
  intensity?: 'low' | 'medium' | 'high' | 'extreme';
  color?: string;
  className?: string;
}

interface Arc {
  id: number;
  path: string;
  opacity: number;
  lifespan: number;
}

export default function ElectricBorder({
  intensity = 'medium',
  color = '#3b82f6',
  className = ''
}: ElectricBorderProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [arcs, setArcs] = useState<Arc[]>([]);
  const nextIdRef = useRef(0);

  // Intensity settings
  const settings = {
    low: { strokeWidth: 1.5, blur: 3, maxArcs: 2, arcInterval: 800, segmentSize: 15 },
    medium: { strokeWidth: 2, blur: 4, maxArcs: 3, arcInterval: 500, segmentSize: 12 },
    high: { strokeWidth: 2.5, blur: 5, maxArcs: 4, arcInterval: 300, segmentSize: 10 },
    extreme: { strokeWidth: 3, blur: 6, maxArcs: 6, arcInterval: 150, segmentSize: 8 },
  }[intensity];

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Generate a single electric arc along one edge
    const generateElectricArc = () => {
      const edges = [
        { start: [0, 0], end: [width, 0], axis: 'x' }, // Top
        { start: [width, 0], end: [width, height], axis: 'y' }, // Right
        { start: [width, height], end: [0, height], axis: 'x' }, // Bottom
        { start: [0, height], end: [0, 0], axis: 'y' }, // Left
      ];

      const edge = edges[Math.floor(Math.random() * edges.length)];
      const [startX, startY] = edge.start;
      const [endX, endY] = edge.end;

      // Random segment along the edge
      const edgeLength = edge.axis === 'x' ? Math.abs(endX - startX) : Math.abs(endY - startY);
      const segmentStart = Math.random() * (edgeLength * 0.7); // Don't go all the way to corners
      const segmentLength = Math.random() * edgeLength * 0.4 + edgeLength * 0.1;

      const path: string[] = [];
      let currentPos = segmentStart;

      if (edge.axis === 'x') {
        const y = startY;
        const direction = endX > startX ? 1 : -1;
        path.push(`M ${startX + currentPos * direction} ${y}`);

        while (currentPos < segmentStart + segmentLength) {
          currentPos += settings.segmentSize;
          const x = startX + currentPos * direction;
          const jitterY = y + (Math.random() - 0.5) * 12; // Random zigzag
          const jitterX = x + (Math.random() - 0.5) * 4;

          // Create sharp angles for lightning effect
          path.push(`L ${jitterX} ${jitterY}`);

          // Occasionally add branching
          if (Math.random() > 0.85) {
            const branchLength = Math.random() * 15 + 10;
            const branchY = jitterY + (Math.random() - 0.5) * branchLength;
            const branchX = jitterX + (Math.random() - 0.5) * 8;
            path.push(`L ${branchX} ${branchY} M ${jitterX} ${jitterY}`);
          }
        }
      } else {
        const x = startX;
        const direction = endY > startY ? 1 : -1;
        path.push(`M ${x} ${startY + currentPos * direction}`);

        while (currentPos < segmentStart + segmentLength) {
          currentPos += settings.segmentSize;
          const y = startY + currentPos * direction;
          const jitterX = x + (Math.random() - 0.5) * 12; // Random zigzag
          const jitterY = y + (Math.random() - 0.5) * 4;

          path.push(`L ${jitterX} ${jitterY}`);

          // Occasionally add branching
          if (Math.random() > 0.85) {
            const branchLength = Math.random() * 15 + 10;
            const branchX = jitterX + (Math.random() - 0.5) * branchLength;
            const branchY = jitterY + (Math.random() - 0.5) * 8;
            path.push(`L ${branchX} ${branchY} M ${jitterX} ${jitterY}`);
          }
        }
      }

      return path.join(' ');
    };

    // Create new arcs periodically
    const arcInterval = setInterval(() => {
      setArcs(prev => {
        // Remove expired arcs
        const now = Date.now();
        const active = prev.filter(arc => now - arc.lifespan < 200);

        // Add new arc if under limit
        if (active.length < settings.maxArcs) {
          const newArc: Arc = {
            id: nextIdRef.current++,
            path: generateElectricArc(),
            opacity: Math.random() * 0.5 + 0.5,
            lifespan: now,
          };
          return [...active, newArc];
        }

        return active;
      });
    }, settings.arcInterval);

    return () => {
      clearInterval(arcInterval);
    };
  }, [intensity, settings.maxArcs, settings.arcInterval, settings.segmentSize]);

  return (
    <svg
      ref={svgRef}
      className={`absolute inset-0 pointer-events-none overflow-visible ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <filter id={`electric-glow-${intensity}`} x="-200%" y="-200%" width="400%" height="400%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={settings.blur} />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 0"
          />
          <feBlend in="SourceGraphic" mode="screen" />
        </filter>
      </defs>

      {arcs.map((arc) => (
        <g key={arc.id}>
          {/* Glow layer */}
          <path
            d={arc.path}
            fill="none"
            stroke={color}
            strokeWidth={settings.strokeWidth * 2}
            strokeLinecap="round"
            strokeLinejoin="bevel"
            opacity={arc.opacity * 0.3}
            filter={`url(#electric-glow-${intensity})`}
          />
          {/* Main arc */}
          <path
            d={arc.path}
            fill="none"
            stroke={color}
            strokeWidth={settings.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="bevel"
            opacity={arc.opacity}
            style={{ filter: `drop-shadow(0 0 ${settings.blur}px ${color})` }}
          />
          {/* Bright core */}
          <path
            d={arc.path}
            fill="none"
            stroke="white"
            strokeWidth={settings.strokeWidth * 0.3}
            strokeLinecap="round"
            strokeLinejoin="bevel"
            opacity={arc.opacity * 0.8}
          />
        </g>
      ))}
    </svg>
  );
}
