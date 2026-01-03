"use client";

import { useVisualEffects } from "@/contexts/VisualEffectsContext";
import ElectricBorder from "./ElectricBorder";
import GlowBorder from "./GlowBorder";

interface BorderEffectProps {
  intensity: 'low' | 'medium' | 'high' | 'extreme';
  color: string;
}

/**
 * BorderEffect - Wrapper component that renders the appropriate effect based on user preference
 * Switches between ElectricBorder, GlowBorder, or nothing based on context
 * Waits for preferences to load to prevent flickering on navigation
 */
export default function BorderEffect({ intensity, color }: BorderEffectProps) {
  const { effectMode, isLoaded } = useVisualEffects();

  // Don't render until preferences are loaded to prevent flickering
  if (!isLoaded) {
    return null;
  }

  if (effectMode === "off") {
    return null;
  }

  if (effectMode === "glow") {
    return <GlowBorder intensity={intensity} color={color} />;
  }

  // Default to electric
  return <ElectricBorder intensity={intensity} color={color} />;
}
