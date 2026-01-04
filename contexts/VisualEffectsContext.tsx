"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type EffectMode = "electric" | "glow" | "off";

interface VisualEffectsContextType {
  effectMode: EffectMode;
  setEffectMode: (mode: EffectMode) => void;
  isLoaded: boolean;
}

const VisualEffectsContext = createContext<VisualEffectsContextType | undefined>(undefined);

const STORAGE_KEY = "elysium-visual-effects";

export function VisualEffectsProvider({ children }: { children: ReactNode }) {
  const [effectMode, setEffectModeState] = useState<EffectMode>("electric");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage after mount (client-side only)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (saved === "electric" || saved === "glow" || saved === "off")) {
      setEffectModeState(saved as EffectMode);
    }
    setIsLoaded(true);
  }, []);

  const setEffectMode = (mode: EffectMode) => {
    setEffectModeState(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  };

  return (
    <VisualEffectsContext.Provider value={{ effectMode, setEffectMode, isLoaded }}>
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
