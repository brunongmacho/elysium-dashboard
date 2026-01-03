"use client";

import { useRef, useEffect } from "react";

interface GlowBorderProps {
  intensity: 'low' | 'medium' | 'high' | 'extreme';
  color: string;
}

/**
 * GlowBorder - Traditional CSS glow effect
 * Alternative to ElectricBorder for users who prefer classic glow
 * Glow that intensifies based on proximity with consistent pulse frequency
 */
export default function GlowBorder({ intensity, color }: GlowBorderProps) {
  const animationId = useRef(`glow-${Math.random().toString(36).substr(2, 9)}`);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // Map intensity to glow size - all use same animation duration
  const settings = {
    low: { blur: 8, spread: 2, opacity: 0.4, borderWidth: 2 },
    medium: { blur: 16, spread: 4, opacity: 0.6, borderWidth: 2.5 },
    high: { blur: 24, spread: 6, opacity: 0.8, borderWidth: 3 },
    extreme: { blur: 32, spread: 8, opacity: 1, borderWidth: 3.5 },
  }[intensity];

  // Consistent duration across all intensities
  const duration = 3;

  useEffect(() => {
    // Create subtle pulsing animation with the current color
    const keyframes = `
      @keyframes ${animationId.current} {
        0%, 100% {
          box-shadow:
            0 0 ${settings.blur}px ${settings.spread}px ${color}${Math.round(settings.opacity * 0.5 * 255).toString(16).padStart(2, '0')},
            0 0 ${settings.blur * 1.5}px ${settings.spread * 0.5}px ${color}${Math.round(settings.opacity * 0.35 * 255).toString(16).padStart(2, '0')},
            inset 0 0 ${settings.blur * 0.5}px ${color}${Math.round(settings.opacity * 0.15 * 255).toString(16).padStart(2, '0')};
          border-color: ${color}${Math.round(settings.opacity * 0.7 * 255).toString(16).padStart(2, '0')};
        }
        50% {
          box-shadow:
            0 0 ${settings.blur * 1.2}px ${settings.spread * 1.2}px ${color}${Math.round(settings.opacity * 0.7 * 255).toString(16).padStart(2, '0')},
            0 0 ${settings.blur * 1.8}px ${settings.spread * 0.8}px ${color}${Math.round(settings.opacity * 0.5 * 255).toString(16).padStart(2, '0')},
            inset 0 0 ${settings.blur * 0.7}px ${color}${Math.round(settings.opacity * 0.25 * 255).toString(16).padStart(2, '0')};
          border-color: ${color}${Math.round(settings.opacity * 0.9 * 255).toString(16).padStart(2, '0')};
        }
      }
    `;

    // Inject the style into the document
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    styleRef.current = style;

    // Cleanup on unmount or when color changes
    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
      }
    };
  }, [color, intensity, settings.blur, settings.spread, settings.opacity]);

  return (
    <>
      {/* Main glow border - subtle consistent pulse */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          border: `${settings.borderWidth}px solid ${color}`,
          animation: `${animationId.current} ${duration}s ease-in-out infinite`,
          willChange: 'box-shadow, border-color',
          transform: 'translateZ(0)',
        }}
      />

      {/* Background gradient glow */}
      <div
        className="absolute inset-0 rounded-lg -z-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${color}15, transparent 70%)`,
          filter: 'blur(16px)',
          transform: 'scale(1.05) translateZ(0)',
          opacity: settings.opacity * 0.3,
          willChange: 'opacity',
        }}
      />
    </>
  );
}
