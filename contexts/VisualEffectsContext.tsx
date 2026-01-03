"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type EffectMode = "electric" | "glow" | "off";

interface VisualEffectsContextType {
  effectMode: EffectMode;
  setEffectMode: (mode: EffectMode) => void;
}

const VisualEffectsContext = createContext<VisualEffectsContextType | undefined>(undefined);

const STORAGE_KEY = "elysium-visual-effects";

export function VisualEffectsProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage to prevent flickering
  const [effectMode, setEffectModeState] = useState<EffectMode>(() => {
    if (typeof window === "undefined") return "electric";
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved as EffectMode) || "electric";
  });

  const setEffectMode = (mode: EffectMode) => {
    setEffectModeState(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  };

  return (
    <VisualEffectsContext.Provider value={{ effectMode, setEffectMode }}>
      {children}
    </VisualEffectsContext.Provider>
  );
}

export function useVisualEffects() {
  const context = useContext(VisualEffectsContext);
  if (!context) {
    throw new Error("useVisualEffects must be used within VisualEffectsProvider");
  }
  return context;
}
