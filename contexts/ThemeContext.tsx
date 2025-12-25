"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeName = 'default' | 'purple' | 'golden' | 'crimson' | 'emerald' | 'cyber';

interface Theme {
  name: ThemeName;
  label: string;
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    accent: string;
    accentDark: string;
    accentLight: string;
  };
  description: string;
  icon: string;
}

const themes: Record<ThemeName, Theme> = {
  default: {
    name: 'default',
    label: 'Default Blue',
    colors: {
      primary: '#3b82f6',
      primaryDark: '#1d4ed8',
      primaryLight: '#93c5fd',
      accent: '#d946ef',
      accentDark: '#a21caf',
      accentLight: '#f0abfc',
    },
    description: 'Classic blue and purple theme',
    icon: '💙',
  },
  purple: {
    name: 'purple',
    label: 'Epic Purple',
    colors: {
      primary: '#8b5cf6',
      primaryDark: '#6d28d9',
      primaryLight: '#c4b5fd',
      accent: '#ec4899',
      accentDark: '#be185d',
      accentLight: '#f9a8d4',
    },
    description: 'Mythic and epic vibe',
    icon: '💜',
  },
  golden: {
    name: 'golden',
    label: 'Royal Gold',
    colors: {
      primary: '#f59e0b',
      primaryDark: '#b45309',
      primaryLight: '#fcd34d',
      accent: '#fbbf24',
      accentDark: '#d97706',
      accentLight: '#fde68a',
    },
    description: 'Prestige and luxury',
    icon: '👑',
  },
  crimson: {
    name: 'crimson',
    label: 'Crimson War',
    colors: {
      primary: '#dc2626',
      primaryDark: '#991b1b',
      primaryLight: '#fca5a5',
      accent: '#f97316',
      accentDark: '#c2410c',
      accentLight: '#fdba74',
    },
    description: 'War and PvP themed',
    icon: '⚔️',
  },
  emerald: {
    name: 'emerald',
    label: 'Emerald Nature',
    colors: {
      primary: '#10b981',
      primaryDark: '#047857',
      primaryLight: '#6ee7b7',
      accent: '#14b8a6',
      accentDark: '#0f766e',
      accentLight: '#5eead4',
    },
    description: 'Growth and community',
    icon: '🌿',
  },
  cyber: {
    name: 'cyber',
    label: 'Cyber Neon',
    colors: {
      primary: '#06b6d4',
      primaryDark: '#0e7490',
      primaryLight: '#67e8f9',
      accent: '#a855f7',
      accentDark: '#7e22ce',
      accentLight: '#d8b4fe',
    },
    description: 'Tech and futuristic',
    icon: '🤖',
  },
};

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themes: Record<ThemeName, Theme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('default');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('guild-theme') as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Update CSS variables when theme changes
  useEffect(() => {
    const theme = themes[currentTheme];
    const root = document.documentElement;

    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-primary-dark', theme.colors.primaryDark);
    root.style.setProperty('--color-primary-light', theme.colors.primaryLight);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-accent-dark', theme.colors.accentDark);
    root.style.setProperty('--color-accent-light', theme.colors.accentLight);
  }, [currentTheme]);

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
    localStorage.setItem('guild-theme', theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
