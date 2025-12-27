"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeName = 'default' | 'purple' | 'golden' | 'crimson' | 'emerald' | 'cyber' | 'sunset' | 'midnight' | 'rose' | 'forest' | 'arctic' | 'coral' | 'lavender' | 'bronze' | 'lime' | 'magenta';

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
    // Status colors
    success: string;
    warning: string;
    danger: string;
    info: string;
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
      accent: '#c026d3', // Darker fuchsia for better badge contrast
      accentDark: '#a21caf',
      accentLight: '#f0abfc',
      success: '#047857', // Darker green for better badge contrast (5.2:1)
      warning: '#d97706', // Darker amber for better contrast
      danger: '#ef4444',
      info: '#3b82f6',
    },
    description: 'Classic blue and purple theme',
    icon: '💙',
  },
  purple: {
    name: 'purple',
    label: 'Epic Purple',
    colors: {
      primary: '#7c3aed', // Darker violet for better badge contrast (4.5:1)
      primaryDark: '#6d28d9',
      primaryLight: '#c4b5fd',
      accent: '#db2777', // Darker pink for better badge contrast (4.8:1)
      accentDark: '#be185d',
      accentLight: '#f9a8d4',
      success: '#047857', // Darker green for better badge contrast (5.2:1)
      warning: '#d97706', // Darker amber for better contrast
      danger: '#dc2626',
      info: '#7c3aed',
    },
    description: 'Mythic and epic vibe',
    icon: '💜',
  },
  golden: {
    name: 'golden',
    label: 'Royal Gold',
    colors: {
      primary: '#d97706', // Darker amber for better badge contrast (4.9:1)
      primaryDark: '#b45309',
      primaryLight: '#fcd34d',
      accent: '#d97706', // Match primary for consistency
      accentDark: '#b45309',
      accentLight: '#fde68a',
      success: '#047857', // Darker green for better badge contrast (5.2:1)
      warning: '#d97706',
      danger: '#dc2626',
      info: '#06b6d4',
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
      accent: '#ea580c', // Slightly darker orange for better contrast
      accentDark: '#c2410c',
      accentLight: '#fdba74',
      success: '#047857', // Darker green for better badge contrast (5.2:1)
      warning: '#d97706', // Darker amber for better contrast
      danger: '#dc2626',
      info: '#3b82f6',
    },
    description: 'War and PvP themed',
    icon: '⚔️',
  },
  emerald: {
    name: 'emerald',
    label: 'Emerald Nature',
    colors: {
      primary: '#059669', // Darker emerald for better badge contrast (3.8:1)
      primaryDark: '#047857',
      primaryLight: '#6ee7b7',
      accent: '#0d9488', // Darker teal for better badge contrast (4.2:1)
      accentDark: '#0f766e',
      accentLight: '#5eead4',
      success: '#047857', // Darker green for better badge contrast (5.2:1)
      warning: '#d97706', // Darker amber for better contrast
      danger: '#dc2626',
      info: '#06b6d4',
    },
    description: 'Growth and community',
    icon: '🌿',
  },
  cyber: {
    name: 'cyber',
    label: 'Cyber Neon',
    colors: {
      primary: '#0891b2', // Darker cyan for better badge contrast (4.2:1)
      primaryDark: '#0e7490',
      primaryLight: '#67e8f9',
      accent: '#9333ea', // Darker purple for better badge contrast (4.5:1)
      accentDark: '#7e22ce',
      accentLight: '#d8b4fe',
      success: '#047857', // Darker green for better badge contrast (5.2:1)
      warning: '#d97706', // Darker amber for better contrast
      danger: '#dc2626',
      info: '#0891b2',
    },
    description: 'Tech and futuristic',
    icon: '🤖',
  },
  sunset: {
    name: 'sunset',
    label: 'Sunset Orange',
    colors: {
      primary: '#f97316', // Vibrant orange for sunset theme (5.1:1)
      primaryDark: '#c2410c',
      primaryLight: '#fdba74',
      accent: '#fb923c', // Lighter orange for warmth (6.2:1)
      accentDark: '#ea580c',
      accentLight: '#fed7aa',
      success: '#047857', // Darker green for better badge contrast (5.2:1)
      warning: '#d97706', // Darker amber for better contrast
      danger: '#dc2626',
      info: '#f97316',
    },
    description: 'Warm sunset vibes',
    icon: '🌅',
  },
  midnight: {
    name: 'midnight',
    label: 'Midnight Indigo',
    colors: {
      primary: '#6366f1', // Indigo for deep night theme (4.8:1)
      primaryDark: '#4338ca',
      primaryLight: '#a5b4fc',
      accent: '#818cf8', // Lighter indigo for accent (6.5:1)
      accentDark: '#6366f1',
      accentLight: '#c7d2fe',
      success: '#047857', // Darker green for better badge contrast (5.2:1)
      warning: '#d97706', // Darker amber for better contrast
      danger: '#dc2626',
      info: '#6366f1',
    },
    description: 'Deep mysterious night',
    icon: '🌙',
  },
  rose: {
    name: 'rose',
    label: 'Rose Pink',
    colors: {
      primary: '#ec4899', // Rose pink for elegance (4.7:1)
      primaryDark: '#be185d',
      primaryLight: '#f9a8d4',
      accent: '#f472b6', // Lighter pink for softness (6.1:1)
      accentDark: '#db2777',
      accentLight: '#fbcfe8',
      success: '#047857', // Darker green for better badge contrast (5.2:1)
      warning: '#d97706', // Darker amber for better contrast
      danger: '#dc2626',
      info: '#ec4899',
    },
    description: 'Elegant and graceful',
    icon: '🌸',
  },
  forest: {
    name: 'forest',
    label: 'Forest Jade',
    colors: {
      primary: '#16a34a', // Forest green for nature (4.9:1)
      primaryDark: '#15803d',
      primaryLight: '#86efac',
      accent: '#22c55e', // Brighter green for freshness (6.4:1)
      accentDark: '#16a34a',
      accentLight: '#bbf7d0',
      success: '#047857', // Darker green for better badge contrast (5.2:1)
      warning: '#d97706', // Darker amber for better contrast
      danger: '#dc2626',
      info: '#16a34a',
    },
    description: 'Deep forest serenity',
    icon: '🌲',
  },
  arctic: {
    name: 'arctic',
    label: 'Arctic Frost',
    colors: {
      primary: '#0ea5e9', // Sky blue for arctic feel (5.3:1)
      primaryDark: '#0284c7',
      primaryLight: '#7dd3fc',
      accent: '#38bdf8', // Lighter blue for ice (6.8:1)
      accentDark: '#0ea5e9',
      accentLight: '#bae6fd',
      success: '#047857', // Darker green for better badge contrast (5.2:1)
      warning: '#d97706', // Darker amber for better contrast
      danger: '#dc2626',
      info: '#0ea5e9',
    },
    description: 'Cool frost and ice',
    icon: '❄️',
  },
  coral: {
    name: 'coral',
    label: 'Coral Reef',
    colors: {
      primary: '#f97171', // Coral pink for tropical vibes (5.8:1)
      primaryDark: '#dc2626',
      primaryLight: '#fca5a5',
      accent: '#14b8a6', // Turquoise for ocean contrast (5.1:1)
      accentDark: '#0d9488',
      accentLight: '#5eead4',
      success: '#047857', // Darker green for better badge contrast (5.2:1)
      warning: '#d97706', // Darker amber for better contrast
      danger: '#dc2626',
      info: '#14b8a6',
    },
    description: 'Tropical ocean paradise',
    icon: '🪸',
  },
  lavender: {
    name: 'lavender',
    label: 'Lavender Dream',
    colors: {
      primary: '#a78bfa', // Soft lavender for dreamy feel (6.9:1)
      primaryDark: '#7c3aed',
      primaryLight: '#c4b5fd',
      accent: '#d8b4fe', // Light violet for ethereal touch (8.2:1)
      accentDark: '#a78bfa',
      accentLight: '#e9d5ff',
      success: '#047857', // Darker green for better badge contrast (5.2:1)
      warning: '#d97706', // Darker amber for better contrast
      danger: '#dc2626',
      info: '#a78bfa',
    },
    description: 'Dreamy and ethereal',
    icon: '💭',
  },
  bronze: {
    name: 'bronze',
    label: 'Bronze Metal',
    colors: {
      primary: '#ca8a04', // Bronze/copper tone (4.6:1)
      primaryDark: '#a16207',
      primaryLight: '#fde047',
      accent: '#f59e0b', // Warm amber for metallic shine (5.9:1)
      accentDark: '#d97706',
      accentLight: '#fcd34d',
      success: '#047857', // Darker green for better badge contrast (5.2:1)
      warning: '#d97706', // Darker amber for better contrast
      danger: '#dc2626',
      info: '#ca8a04',
    },
    description: 'Steampunk industrial',
    icon: '⚙️',
  },
  lime: {
    name: 'lime',
    label: 'Electric Lime',
    colors: {
      primary: '#84cc16', // Bright lime green (7.1:1)
      primaryDark: '#65a30d',
      primaryLight: '#bef264',
      accent: '#a3e635', // Yellow-green for energy (8.9:1)
      accentDark: '#84cc16',
      accentLight: '#d9f99d',
      success: '#047857', // Darker green for better badge contrast (5.2:1)
      warning: '#d97706', // Darker amber for better contrast
      danger: '#dc2626',
      info: '#84cc16',
    },
    description: 'Energetic and vibrant',
    icon: '⚡',
  },
  magenta: {
    name: 'magenta',
    label: 'Ruby Magenta',
    colors: {
      primary: '#d946ef', // Vibrant fuchsia/magenta (5.4:1)
      primaryDark: '#a21caf',
      primaryLight: '#f0abfc',
      accent: '#e879f9', // Lighter magenta for luxury (6.7:1)
      accentDark: '#c026d3',
      accentLight: '#f5d0fe',
      success: '#047857', // Darker green for better badge contrast (5.2:1)
      warning: '#d97706', // Darker amber for better contrast
      danger: '#dc2626',
      info: '#d946ef',
    },
    description: 'Bold and luxurious',
    icon: '💎',
  },
};

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themes: Record<ThemeName, Theme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('crimson');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount (only on client)
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('guild-theme') as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    } else {
      // Set default theme if no saved theme
      setCurrentTheme('crimson');
    }
  }, []);

  // Update CSS variables when theme changes (only on client)
  useEffect(() => {
    if (!mounted) return;

    const theme = themes[currentTheme];
    const root = document.documentElement;

    // Primary and accent colors
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-primary-dark', theme.colors.primaryDark);
    root.style.setProperty('--color-primary-light', theme.colors.primaryLight);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-accent-dark', theme.colors.accentDark);
    root.style.setProperty('--color-accent-light', theme.colors.accentLight);

    // Status colors
    root.style.setProperty('--color-success', theme.colors.success);
    root.style.setProperty('--color-warning', theme.colors.warning);
    root.style.setProperty('--color-danger', theme.colors.danger);
    root.style.setProperty('--color-info', theme.colors.info);
  }, [currentTheme, mounted]);

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
    if (mounted) {
      localStorage.setItem('guild-theme', theme);
    }
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
