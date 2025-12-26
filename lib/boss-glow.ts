/**
 * Boss Glow Color Utility
 * Dynamically calculates glow colors and intensity based on time remaining
 * Uses theme colors for consistent styling
 */

interface GlowResult {
  color: string;
  intensity: number;
  borderColor: string;
  tailwindStroke: string;
}

/**
 * Gets CSS variable value from document root
 */
function getCSSVariable(variableName: string): string {
  if (typeof window === 'undefined') {
    // Server-side fallback values
    const fallbacks: Record<string, string> = {
      '--color-success': '#10b981',
      '--color-warning': '#f59e0b',
      '--color-danger': '#ef4444',
      '--color-text-primary': '#f9fafb',
    };
    return fallbacks[variableName] || '#ffffff';
  }
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

/**
 * Converts hex color to rgba with custom opacity
 */
function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.startsWith('#') ? hex : `#${hex}`;
  const r = parseInt(cleanHex.slice(1, 3), 16);
  const g = parseInt(cleanHex.slice(3, 5), 16);
  const b = parseInt(cleanHex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Interpolates between two hex colors
 * @param color1 Starting color (hex)
 * @param color2 Ending color (hex)
 * @param factor Interpolation factor (0-1)
 */
function interpolateColor(color1: string, color2: string, factor: number): string {
  const cleanColor1 = color1.startsWith('#') ? color1 : `#${color1}`;
  const cleanColor2 = color2.startsWith('#') ? color2 : `#${color2}`;

  const r1 = parseInt(cleanColor1.slice(1, 3), 16);
  const g1 = parseInt(cleanColor1.slice(3, 5), 16);
  const b1 = parseInt(cleanColor1.slice(5, 7), 16);

  const r2 = parseInt(cleanColor2.slice(1, 3), 16);
  const g2 = parseInt(cleanColor2.slice(3, 5), 16);
  const b2 = parseInt(cleanColor2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Calculates dynamic glow properties based on time remaining
 * Time brackets become progressively shorter as spawn approaches
 * Reads colors from CSS variables to support dynamic theme changes
 */
export function calculateBossGlow(timeRemaining: number | null): GlowResult {
  // Read theme colors from CSS variables (updates when theme changes)
  const whiteColor = getCSSVariable('--color-text-primary');
  const successColor = getCSSVariable('--color-success');
  const warningColor = getCSSVariable('--color-warning');
  const dangerColor = getCSSVariable('--color-danger');

  // Already spawned - maximum intensity red
  if (!timeRemaining || timeRemaining <= 0) {
    return {
      color: dangerColor,
      intensity: 30,
      borderColor: 'border-red-500',
      tailwindStroke: 'stroke-danger',
    };
  }

  const minutesRemaining = timeRemaining / (1000 * 60);

  // Imminent: 0-5 minutes - Pure danger red, very high intensity
  if (minutesRemaining < 5) {
    return {
      color: dangerColor,
      intensity: 25,
      borderColor: 'border-red-500',
      tailwindStroke: 'stroke-danger',
    };
  }

  // Very soon: 5-10 minutes - Blend danger to orange (90% danger)
  if (minutesRemaining < 10) {
    const factor = (minutesRemaining - 5) / 5; // 0 to 1
    const orangeRed = '#ff6b35'; // Orange-red midpoint
    const blendedColor = interpolateColor(dangerColor, orangeRed, factor);
    return {
      color: blendedColor,
      intensity: 22,
      borderColor: 'border-red-500',
      tailwindStroke: 'stroke-danger',
    };
  }

  // Soon: 10-20 minutes - Blend orange to warning (orange-yellow)
  if (minutesRemaining < 20) {
    const factor = (minutesRemaining - 10) / 10; // 0 to 1
    const orangeRed = '#ff6b35';
    const blendedColor = interpolateColor(orangeRed, warningColor, factor);
    return {
      color: blendedColor,
      intensity: 18,
      borderColor: 'border-orange-500',
      tailwindStroke: 'stroke-warning',
    };
  }

  // Approaching: 20-30 minutes - Warning yellow with high intensity
  if (minutesRemaining < 30) {
    return {
      color: warningColor,
      intensity: 15,
      borderColor: 'border-orange-400',
      tailwindStroke: 'stroke-warning',
    };
  }

  // Medium-close: 30-60 minutes - Blend warning to light yellow
  if (minutesRemaining < 60) {
    const factor = (minutesRemaining - 30) / 30; // 0 to 1
    const lightYellow = '#fbbf24'; // Lighter yellow
    const blendedColor = interpolateColor(warningColor, lightYellow, factor);
    return {
      color: blendedColor,
      intensity: 12,
      borderColor: 'border-yellow-400',
      tailwindStroke: 'stroke-warning',
    };
  }

  // Medium: 1-2 hours - Blend light yellow to success (yellow-green)
  if (minutesRemaining < 120) {
    const factor = (minutesRemaining - 60) / 60; // 0 to 1
    const lightYellow = '#fbbf24';
    const blendedColor = interpolateColor(lightYellow, successColor, factor);
    return {
      color: blendedColor,
      intensity: 10,
      borderColor: 'border-yellow-300',
      tailwindStroke: 'stroke-success',
    };
  }

  // Medium-far: 2-4 hours - Success green with moderate intensity
  if (minutesRemaining < 240) {
    return {
      color: successColor,
      intensity: 8,
      borderColor: 'border-success',
      tailwindStroke: 'stroke-success',
    };
  }

  // Far: 4-8 hours - Blend success to cyan-green
  if (minutesRemaining < 480) {
    const factor = (minutesRemaining - 240) / 240; // 0 to 1
    const cyanGreen = '#14b8a6'; // Teal/cyan
    const blendedColor = interpolateColor(successColor, cyanGreen, factor);
    return {
      color: blendedColor,
      intensity: 6,
      borderColor: 'border-success',
      tailwindStroke: 'stroke-success',
    };
  }

  // Very far: 8-24 hours - Blend cyan to white/light blue
  if (minutesRemaining < 1440) {
    const factor = (minutesRemaining - 480) / 960; // 0 to 1
    const cyanGreen = '#14b8a6';
    const lightBlue = '#93c5fd'; // Light blue (close to white)
    const blendedColor = interpolateColor(cyanGreen, lightBlue, factor);
    return {
      color: blendedColor,
      intensity: 4,
      borderColor: 'border-success',
      tailwindStroke: 'stroke-success',
    };
  }

  // Extremely far: >24 hours - Subtle white/light glow
  return {
    color: whiteColor,
    intensity: 3,
    borderColor: 'border-gray-400',
    tailwindStroke: 'stroke-gray-400',
  };
}

/**
 * Generates box-shadow string with multiple layers for depth
 */
export function generateGlowStyle(color: string, baseIntensity: number): string {
  const layers = [
    `0 0 ${baseIntensity}px ${hexToRgba(color, 0.8)}`,
    `0 0 ${baseIntensity * 2}px ${hexToRgba(color, 0.5)}`,
    `0 0 ${baseIntensity * 3}px ${hexToRgba(color, 0.3)}`,
  ];

  return layers.join(', ');
}

/**
 * Generates drop-shadow filter string for SVG elements
 */
export function generateDropShadow(color: string, intensity: number): string {
  return `drop-shadow(0 0 ${intensity}px ${color}) drop-shadow(0 0 ${intensity * 0.5}px ${color})`;
}
