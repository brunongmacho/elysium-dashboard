"use client";

interface GlowBorderProps {
  intensity: 'low' | 'medium' | 'high' | 'extreme';
  color: string;
}

/**
 * GlowBorder - Traditional CSS glow effect
 * Alternative to ElectricBorder for users who prefer classic glow
 * Steady glow that intensifies based on proximity to spawn time
 */
export default function GlowBorder({ intensity, color }: GlowBorderProps) {
  // Map intensity to glow size - no animation, just steady increasing intensity
  const settings = {
    low: { blur: 8, spread: 2, opacity: 0.4, borderWidth: 2 },
    medium: { blur: 16, spread: 4, opacity: 0.6, borderWidth: 2.5 },
    high: { blur: 24, spread: 6, opacity: 0.8, borderWidth: 3 },
    extreme: { blur: 32, spread: 8, opacity: 1, borderWidth: 3.5 },
  }[intensity];

  return (
    <>
      {/* Main glow border - steady, no pulsing */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          border: `${settings.borderWidth}px solid ${color}`,
          boxShadow: `
            0 0 ${settings.blur}px ${settings.spread}px ${color}${Math.round(settings.opacity * 0.6 * 255).toString(16).padStart(2, '0')},
            0 0 ${settings.blur * 1.5}px ${settings.spread * 0.5}px ${color}${Math.round(settings.opacity * 0.4 * 255).toString(16).padStart(2, '0')},
            inset 0 0 ${settings.blur * 0.5}px ${color}${Math.round(settings.opacity * 0.2 * 255).toString(16).padStart(2, '0')}
          `,
          willChange: 'box-shadow, border-color',
          transform: 'translateZ(0)',
          transition: 'box-shadow 0.5s ease-out, border-color 0.5s ease-out',
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
          transition: 'opacity 0.5s ease-out',
        }}
      />
    </>
  );
}
