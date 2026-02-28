"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { THEME_COLORS, type ThemeColors } from '@/lib/theme-constants';

export type ThemeName = 'crimson' | 'wine' | 'magenta' | 'peach' | 'sunset' | 'golden' | 'lime' | 'olive' | 'emerald' | 'forest' | 'mint' | 'default' | 'navy' | 'arctic' | 'cyber' | 'purple';

interface Theme {
  name: ThemeName;
  label: string;
  colors: ThemeColors;
  description: string;
  icon: string;
}

const themes: Record<ThemeName, Theme> = {
  // REDS
  crimson: {
    name: 'crimson',
    label: 'Crimson War',
    colors: THEME_COLORS.crimson,
    description: 'War and PvP themed',
    icon: '⚔️',
  },
  wine: {
    name: 'wine',
    label: 'Wine Burgundy',
    colors: THEME_COLORS.wine,
    description: 'Rich and sophisticated',
    icon: '🍷',
  },

  // PINKS
  magenta: {
    name: 'magenta',
    label: 'Ruby Magenta',
    colors: THEME_COLORS.magenta,
    description: 'Bold and luxurious',
    icon: '💎',
  },
  peach: {
    name: 'peach',
    label: 'Peach Blossom',
    colors: THEME_COLORS.peach,
    description: 'Soft and welcoming',
    icon: '🍑',
  },

  // ORANGES/YELLOWS
  sunset: {
    name: 'sunset',
    label: 'Sunset Orange',
    colors: THEME_COLORS.sunset,
    description: 'Warm sunset vibes',
    icon: '🌅',
  },
  golden: {
    name: 'golden',
    label: 'Royal Gold',
    colors: THEME_COLORS.golden,
    description: 'Prestige and luxury',
    icon: '👑',
  },

  // GREENS
  lime: {
    name: 'lime',
    label: 'Electric Lime',
    colors: THEME_COLORS.lime,
    description: 'Energetic and vibrant',
    icon: '⚡',
  },
  olive: {
    name: 'olive',
    label: 'Olive Military',
    colors: THEME_COLORS.olive,
    description: 'Military tactical theme',
    icon: '🎖️',
  },
  emerald: {
    name: 'emerald',
    label: 'Emerald Nature',
    colors: THEME_COLORS.emerald,
    description: 'Growth and community',
    icon: '💚',
  },
  forest: {
    name: 'forest',
    label: 'Forest Jade',
    colors: THEME_COLORS.forest,
    description: 'Deep forest serenity',
    icon: '🌲',
  },
  mint: {
    name: 'mint',
    label: 'Mint Fresh',
    colors: THEME_COLORS.mint,
    description: 'Fresh and cooling',
    icon: '🍃',
  },

  // BLUES
  default: {
    name: 'default',
    label: 'Default Blue',
    colors: THEME_COLORS.default,
    description: 'Classic blue and purple theme',
    icon: '💙',
  },
  navy: {
    name: 'navy',
    label: 'Navy Admiral',
    colors: THEME_COLORS.navy,
    description: 'Naval military elegance',
    icon: '⚓',
  },
  arctic: {
    name: 'arctic',
    label: 'Arctic Frost',
    colors: THEME_COLORS.arctic,
    description: 'Cool frost and ice',
    icon: '❄️',
  },
  cyber: {
    name: 'cyber',
    label: 'Cyber Neon',
    colors: THEME_COLORS.cyber,
    description: 'Tech and futuristic',
    icon: '🤖',
  },

  // PURPLES
  purple: {
    name: 'purple',
    label: 'Epic Purple',
    colors: THEME_COLORS.purple,
    description: 'Mythic and epic vibe',
    icon: '💜',
  },
};

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themes: Record<ThemeName, Theme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always default to 'crimson' on server to avoid hydration mismatch
  // Client will update after mounting if user has a saved preference
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('crimson');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage after mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('guild-theme') as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
    setMounted(true);
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
