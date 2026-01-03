"use client";

interface GlowBorderProps {
  intensity: 'low' | 'medium' | 'high' | 'extreme';
  color: string;
}

/**
 * GlowBorder - Traditional CSS glow effect
 * Alternative to ElectricBorder for users who prefer classic glow
 */
export default function GlowBorder({ intensity, color }: GlowBorderProps) {
  // Map intensity to glow size
  const glowSettings = {
    low: { blur: 8, spread: 2, opacity: 0.3 },
    medium: { blur: 16, spread: 4, opacity: 0.5 },
    high: { blur: 24, spread: 6, opacity: 0.7 },
    extreme: { blur: 32, spread: 8, opacity: 0.9 },
  }[intensity];

  const boxShadow = `
    0 0 ${glowSettings.blur}px ${glowSettings.spread}px ${color}${Math.round(glowSettings.opacity * 255).toString(16).padStart(2, '0')},
    0 0 ${glowSettings.blur * 1.5}px ${glowSettings.spread * 0.5}px ${color}${Math.round(glowSettings.opacity * 0.6 * 255).toString(16).padStart(2, '0')},
    inset 0 0 ${glowSettings.blur * 0.5}px ${color}${Math.round(glowSettings.opacity * 0.3 * 255).toString(16).padStart(2, '0')}
  `;

  return (
    <div
      className="absolute inset-0 rounded-lg pointer-events-none"
      style={{
        boxShadow,
        animation: `pulse-glow ${4 - (intensity === 'low' ? 0 : intensity === 'medium' ? 1 : intensity === 'high' ? 2 : 3)}s ease-in-out infinite`,
      }}
    />
  );
}
