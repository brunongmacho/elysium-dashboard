/**
 * Theme color constants
 * Shared between ThemeContext and layout.tsx to avoid duplication
 */

export type ThemeColors = {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  accentDark: string;
  accentLight: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
};

/**
 * All theme colors - used by both client and server side code
 */
export const THEME_COLORS: Record<string, ThemeColors> = {
  crimson: {
    primary: '#dc2626',
    primaryDark: '#991b1b',
    primaryLight: '#fca5a5',
    accent: '#ea580c',
    accentDark: '#c2410c',
    accentLight: '#fdba74',
    success: '#047857',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#3b82f6',
  },
  wine: {
    primary: '#9f1239',
    primaryDark: '#881337',
    primaryLight: '#fda4af',
    accent: '#be123c',
    accentDark: '#9f1239',
    accentLight: '#fecdd3',
    success: '#047857',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#9f1239',
  },
  magenta: {
    primary: '#d946ef',
    primaryDark: '#a21caf',
    primaryLight: '#f0abfc',
    accent: '#e879f9',
    accentDark: '#c026d3',
    accentLight: '#f5d0fe',
    success: '#047857',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#d946ef',
  },
  peach: {
    primary: '#fb923c',
    primaryDark: '#f97316',
    primaryLight: '#fed7aa',
    accent: '#fbbf24',
    accentDark: '#f59e0b',
    accentLight: '#fef3c7',
    success: '#047857',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#fb923c',
  },
  sunset: {
    primary: '#f97316',
    primaryDark: '#c2410c',
    primaryLight: '#fdba74',
    accent: '#fb923c',
    accentDark: '#ea580c',
    accentLight: '#fed7aa',
    success: '#047857',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#f97316',
  },
  golden: {
    primary: '#d97706',
    primaryDark: '#b45309',
    primaryLight: '#fcd34d',
    accent: '#d97706',
    accentDark: '#b45309',
    accentLight: '#fde68a',
    success: '#047857',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#06b6d4',
  },
  lime: {
    primary: '#84cc16',
    primaryDark: '#65a30d',
    primaryLight: '#bef264',
    accent: '#a3e635',
    accentDark: '#84cc16',
    accentLight: '#d9f99d',
    success: '#047857',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#84cc16',
  },
  olive: {
    primary: '#a3a300',
    primaryDark: '#808000',
    primaryLight: '#d4d466',
    accent: '#ca8a04',
    accentDark: '#a16207',
    accentLight: '#fde047',
    success: '#047857',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#a3a300',
  },
  emerald: {
    primary: '#059669',
    primaryDark: '#047857',
    primaryLight: '#6ee7b7',
    accent: '#0d9488',
    accentDark: '#0f766e',
    accentLight: '#5eead4',
    success: '#047857',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#06b6d4',
  },
  forest: {
    primary: '#16a34a',
    primaryDark: '#15803d',
    primaryLight: '#86efac',
    accent: '#22c55e',
    accentDark: '#16a34a',
    accentLight: '#bbf7d0',
    success: '#047857',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#16a34a',
  },
  mint: {
    primary: '#2dd4bf',
    primaryDark: '#14b8a6',
    primaryLight: '#99f6e4',
    accent: '#6ee7b7',
    accentDark: '#34d399',
    accentLight: '#d1fae5',
    success: '#047857',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#2dd4bf',
  },
  default: {
    primary: '#3b82f6',
    primaryDark: '#1d4ed8',
    primaryLight: '#93c5fd',
    accent: '#c026d3',
    accentDark: '#a21caf',
    accentLight: '#f0abfc',
    success: '#047857',
    warning: '#d97706',
    danger: '#ef4444',
    info: '#3b82f6',
  },
  navy: {
    primary: '#1e40af',
    primaryDark: '#1e3a8a',
    primaryLight: '#60a5fa',
    accent: '#fbbf24',
    accentDark: '#f59e0b',
    accentLight: '#fde68a',
    success: '#047857',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#1e40af',
  },
  arctic: {
    primary: '#0ea5e9',
    primaryDark: '#0284c7',
    primaryLight: '#7dd3fc',
    accent: '#38bdf8',
    accentDark: '#0ea5e9',
    accentLight: '#bae6fd',
    success: '#047857',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#0ea5e9',
  },
  cyber: {
    primary: '#0891b2',
    primaryDark: '#0e7490',
    primaryLight: '#67e8f9',
    accent: '#9333ea',
    accentDark: '#7e22ce',
    accentLight: '#d8b4fe',
    success: '#047857',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#0891b2',
  },
  purple: {
    primary: '#7c3aed',
    primaryDark: '#6d28d9',
    primaryLight: '#c4b5fd',
    accent: '#db2777',
    accentDark: '#be185d',
    accentLight: '#f9a8d4',
    success: '#047857',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#7c3aed',
  },

  // Special themes for users
  quantum: {
    primary: '#06b6d4',      // Cyan
    primaryDark: '#0891b2',
    primaryLight: '#67e8f9',
    accent: '#a855f7',        // Purple
    accentDark: '#9333ea',
    accentLight: '#d8b4fe',
    success: '#10b981',       // Emerald
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
  },

  // Starlight theme for AlterFrieren
  starlight: {
    primary: '#a855f7',      // Purple
    primaryDark: '#7c3aed',
    primaryLight: '#c4b5fd',
    accent: '#e2e8f0',        // Silver/Starlight
    accentDark: '#cbd5e1',
    accentLight: '#f1f5f9',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#a855f7',
  },

  // Chaos theme for Goblok
  chaos: {
    primary: '#f97316',      // Orange
    primaryDark: '#ea580c',
    primaryLight: '#fdba74',
    accent: '#eab308',        // Yellow
    accentDark: '#ca8a04',
    accentLight: '#fde047',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#f97316',
  },

  // Unstable theme for xAustinx
  unstable: {
    primary: '#14b8a6',      // Teal
    primaryDark: '#0d9488',
    primaryLight: '#5eead4',
    accent: '#2dd4bf',        // Light Teal
    accentDark: '#0f766e',
    accentLight: '#99f6e4',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#14b8a6',
  },

  // Portal theme for Iguro
  portal: {
    primary: '#6366f1',      // Indigo
    primaryDark: '#4f46e5',
    primaryLight: '#818cf8',
    accent: '#8b5cf6',        // Violet
    accentDark: '#7c3aed',
    accentLight: '#a78bfa',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#6366f1',
  },

  // Grill theme for Inihaw
  grill: {
    primary: '#84cc16',      // Lime Green
    primaryDark: '#65a30d',
    primaryLight: '#bef264',
    accent: '#a3e635',        // Light Lime
    accentDark: '#65a30d',
    accentLight: '#d9f99d',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#84cc16',
  },

  // Wrong theme for Jalo
  wrong: {
    primary: '#eab308',      // Yellow
    primaryDark: '#ca8a04',
    primaryLight: '#fde047',
    accent: '#f97316',        // Orange
    accentDark: '#ea580c',
    accentLight: '#fdba74',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#eab308',
  },

  // Chrono theme for Carrera
  chrono: {
    primary: '#3b82f6',      // Blue
    primaryDark: '#1d4ed8',
    primaryLight: '#93c5fd',
    accent: '#6366f1',        // Indigo
    accentDark: '#4f46e5',
    accentLight: '#818cf8',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  },

  // Nightlight theme for Azryth
  nightlight: {
    primary: '#f472b6',      // Pink
    primaryDark: '#db2777',
    primaryLight: '#f9a8d4',
    accent: '#fde047',        // Yellow
    accentDark: '#eab308',
    accentLight: '#fef08a',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#f472b6',
  },

  // Ocean theme for Adriana
  ocean: {
    primary: '#0ea5e9',      // Sky Blue
    primaryDark: '#0284c7',
    primaryLight: '#7dd3fc',
    accent: '#06b6d4',        // Cyan
    accentDark: '#0891b2',
    accentLight: '#67e8f9',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#0ea5e9',
  },

  // Snack theme for AmielJohn
  snack: {
    primary: '#b45309',      // Brown/Amber
    primaryDark: '#92400e',
    primaryLight: '#d97706',
    accent: '#f59e0b',        // Gold
    accentDark: '#d97706',
    accentLight: '#fbbf24',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#b45309',
  },

  // Royal theme for AndyVI
  royal: {
    primary: '#7c3aed',      // Purple
    primaryDark: '#6d28d9',
    primaryLight: '#a78bfa',
    accent: '#fbbf24',        // Gold
    accentDark: '#f59e0b',
    accentLight: '#fcd34d',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#7c3aed',
  },

  // Blade theme for Ayane69
  blade: {
    primary: '#be123c',      // Rose Red
    primaryDark: '#9f1239',
    primaryLight: '#f43f5e',
    accent: '#fb7185',        // Pink Rose
    accentDark: '#e11d48',
    accentLight: '#fda4af',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#be123c',
  },

  // Tiger theme for Byakko
  tiger: {
    primary: '#ea580c',      // Orange
    primaryDark: '#c2410c',
    primaryLight: '#fb923c',
    accent: '#fbbf24',        // Gold
    accentDark: '#f59e0b',
    accentLight: '#fde047',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#ea580c',
  },

  // Boss theme for bozzkie
  boss: {
    primary: '#dc2626',      // Red
    primaryDark: '#991b1b',
    primaryLight: '#fca5a5',
    accent: '#fbbf24',        // Gold
    accentDark: '#f59e0b',
    accentLight: '#fcd34d',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#dc2626',
  },

  // Void theme for Channy
  void: {
    primary: '#4c1d95',      // Deep Purple
    primaryDark: '#3b0764',
    primaryLight: '#8b5cf6',
    accent: '#a855f7',        // Purple
    accentDark: '#9333ea',
    accentLight: '#c4b5fd',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#4c1d95',
  },

  // Meme theme for Chunchunmaru
  meme: {
    primary: '#06b6d4',      // Cyan
    primaryDark: '#0891b2',
    primaryLight: '#67e8f9',
    accent: '#f472b6',        // Pink
    accentDark: '#db2777',
    accentLight: '#f9a8d4',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
  },

  // Shadow theme for DarKOwLZ
  shadow: {
    primary: '#1e293b',      // Slate Dark
    primaryDark: '#0f172a',
    primaryLight: '#334155',
    accent: '#6366f1',        // Indigo
    accentDark: '#4f46e5',
    accentLight: '#818cf8',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#1e293b',
  },

  // Neon theme for Deeyon
  neon: {
    primary: '#22c55e',      // Green
    primaryDark: '#16a34a',
    primaryLight: '#4ade80',
    accent: '#14b8a6',        // Teal
    accentDark: '#0d9488',
    accentLight: '#2dd4bf',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#22c55e',
  },

  // Chaoscoin theme for Enaira
  chaoscoin: {
    primary: '#f59e0b',      // Amber
    primaryDark: '#d97706',
    primaryLight: '#fbbf24',
    accent: '#84cc16',        // Lime
    accentDark: '#65a30d',
    accentLight: '#bef264',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#f59e0b',
  },

  // Spoon theme for Evand3r
  spoon: {
    primary: '#94a3b8',      // Silver
    primaryDark: '#64748b',
    primaryLight: '#cbd5e1',
    accent: '#f8fafc',        // White
    accentDark: '#e2e8f0',
    accentLight: '#ffffff',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#94a3b8',
  },

  // Bureaucracy theme for Fever
  bureaucracy: {
    primary: '#475569',      // Slate
    primaryDark: '#334155',
    primaryLight: '#64748b',
    accent: '#fb923c',        // Orange
    accentDark: '#f97316',
    accentLight: '#fdba74',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#475569',
  },

  // Stats theme for Gnohaij03
  stats: {
    primary: '#3b82f6',      // Blue
    primaryDark: '#1d4ed8',
    primaryLight: '#93c5fd',
    accent: '#8b5cf6',        // Violet
    accentDark: '#7c3aed',
    accentLight: '#c4b5fd',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  },

  // Olympus theme for Hercules
  olympus: {
    primary: '#eab308',      // Gold
    primaryDark: '#ca8a04',
    primaryLight: '#fde047',
    accent: '#fbbf24',        // Yellow
    accentDark: '#f59e0b',
    accentLight: '#fcd34d',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#eab308',
  },

  // Weather theme for HODAKA
  weather: {
    primary: '#38bdf8',      // Sky Blue
    primaryDark: '#0ea5e9',
    primaryLight: '#7dd3fc',
    accent: '#a855f7',        // Purple
    accentDark: '#9333ea',
    accentLight: '#d8b4fe',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#38bdf8',
  },

  // Speed theme for Hytrz
  speed: {
    primary: '#facc15',      // Yellow
    primaryDark: '#eab308',
    primaryLight: '#fde047',
    accent: '#ef4444',        // Red
    accentDark: '#dc2626',
    accentLight: '#fca5a5',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#facc15',
  },

  // Morale theme for JudeMaximus
  morale: {
    primary: '#f97316',      // Orange
    primaryDark: '#ea580c',
    primaryLight: '#fb923c',
    accent: '#fbbf24',        // Gold
    accentDark: '#f59e0b',
    accentLight: '#fcd34d',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#f97316',
  },

  // Recycle theme for KingPagpag
  recycle: {
    primary: '#65a30d',      // Olive Green
    primaryDark: '#4d7c0f',
    primaryLight: '#a3e635',
    accent: '#84cc16',        // Lime
    accentDark: '#65a30d',
    accentLight: '#bef264',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#65a30d',
  },

  // Abyss theme for ladyhoho
  abyss: {
    primary: '#7c3aed',      // Purple
    primaryDark: '#6d28d9',
    primaryLight: '#a78bfa',
    accent: '#ec4899',        // Pink
    accentDark: '#db2777',
    accentLight: '#f9a8d4',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#7c3aed',
  },

  // Chaosgun theme for lanZ6
  chaosgun: {
    primary: '#ef4444',      // Red
    primaryDark: '#dc2626',
    primaryLight: '#fca5a5',
    accent: '#f97316',        // Orange
    accentDark: '#ea580c',
    accentLight: '#fdba74',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#ef4444',
  },

  // Lightning theme for LaxusLawliet
  lightning: {
    primary: '#fbbf24',      // Yellow
    primaryDark: '#f59e0b',
    primaryLight: '#fcd34d',
    accent: '#38bdf8',        // Sky Blue
    accentDark: '#0ea5e9',
    accentLight: '#7dd3fc',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#fbbf24',
  },

  // Sonic theme for Maria
  sonic: {
    primary: '#f43f5e',      // Rose
    primaryDark: '#e11d48',
    primaryLight: '#fb7185',
    accent: '#fb923c',        // Orange
    accentDark: '#f97316',
    accentLight: '#fdba74',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#f43f5e',
  },

  // Archive theme for Marsha11
  archive: {
    primary: '#78716c',      // Stone
    primaryDark: '#57534e',
    primaryLight: '#a8a29e',
    accent: '#0ea5e9',        // Sky Blue
    accentDark: '#0284c7',
    accentLight: '#7dd3fc',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#78716c',
  },

  // Vintage theme for Mielle1968
  vintage: {
    primary: '#b45309',      // Brown
    primaryDark: '#92400e',
    primaryLight: '#d97706',
    accent: '#a16207',        // Bronze
    accentDark: '#854d0e',
    accentLight: '#ca8a04',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#b45309',
  },

  // Art theme for Munchyy
  art: {
    primary: '#ec4899',      // Pink
    primaryDark: '#db2777',
    primaryLight: '#f472b6',
    accent: '#8b5cf6',        // Purple
    accentDark: '#7c3aed',
    accentLight: '#a78bfa',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#ec4899',
  },

  // Pancake theme for PanCoco
  pancake: {
    primary: '#d97706',      // Amber
    primaryDark: '#b45309',
    primaryLight: '#fbbf24',
    accent: '#f97316',        // Orange
    accentDark: '#ea580c',
    accentLight: '#fdba74',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#d97706',
  },

  // Pharmacy theme for Pedsrow
  pharmacy: {
    primary: '#06b6d4',      // Cyan
    primaryDark: '#0891b2',
    primaryLight: '#67e8f9',
    accent: '#10b981',        // Emerald
    accentDark: '#059669',
    accentLight: '#6ee7b7',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
  },

  // Horn theme for PHorns
  horn: {
    primary: '#eab308',      // Yellow
    primaryDark: '#ca8a04',
    primaryLight: '#fde047',
    accent: '#f97316',        // Orange
    accentDark: '#ea580c',
    accentLight: '#fdba74',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#eab308',
  },

  // Book theme for Rileyread
  book: {
    primary: '#78350f',      // Brown
    primaryDark: '#451a03',
    primaryLight: '#92400e',
    accent: '#d97706',        // Amber
    accentDark: '#b45309',
    accentLight: '#fbbf24',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#78350f',
  },

  // Shadowdance theme for Skadushy
  shadowdance: {
    primary: '#1e293b',      // Slate Dark
    primaryDark: '#0f172a',
    primaryLight: '#334155',
    accent: '#a855f7',        // Purple
    accentDark: '#9333ea',
    accentLight: '#c4b5fd',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#1e293b',
  },

  // Tidal theme for Tinitira
  tidal: {
    primary: '#0ea5e9',      // Sky Blue
    primaryDark: '#0284c7',
    primaryLight: '#7dd3fc',
    accent: '#06b6d4',        // Cyan
    accentDark: '#0891b2',
    accentLight: '#67e8f9',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#0ea5e9',
  },

  // Rhythm theme for UmpaUmpa
  rhythm: {
    primary: '#d946ef',      // Fuchsia
    primaryDark: '#c026d3',
    primaryLight: '#e879f9',
    accent: '#8b5cf6',        // Purple
    accentDark: '#7c3aed',
    accentLight: '#a78bfa',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#d946ef',
  },

  // Vanish theme for Vanbis
  vanish: {
    primary: '#94a3b8',      // Slate Gray
    primaryDark: '#64748b',
    primaryLight: '#cbd5e1',
    accent: '#6366f1',        // Indigo
    accentDark: '#4f46e5',
    accentLight: '#818cf8',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#94a3b8',
  },

  // Wisdom theme for xAthena
  wisdom: {
    primary: '#6366f1',      // Indigo
    primaryDark: '#4f46e5',
    primaryLight: '#818cf8',
    accent: '#8b5cf6',        // Violet
    accentDark: '#7c3aed',
    accentLight: '#a78bfa',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#6366f1',
  },

  // Reverse theme for yakob
  reverse: {
    primary: '#22c55e',      // Green
    primaryDark: '#16a34a',
    primaryLight: '#4ade80',
    accent: '#ef4444',        // Red
    accentDark: '#dc2626',
    accentLight: '#fca5a5',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#22c55e',
  },

  // Dragon theme for zog
  dragon: {
    primary: '#dc2626',      // Red
    primaryDark: '#991b1b',
    primaryLight: '#fca5a5',
    accent: '#f97316',        // Orange
    accentDark: '#ea580c',
    accentLight: '#fdba74',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#dc2626',
  },

  // Blur theme for Ztig
  blur: {
    primary: '#fbbf24',      // Yellow
    primaryDark: '#f59e0b',
    primaryLight: '#fcd34d',
    accent: '#facc15',        // Lime Yellow
    accentDark: '#eab308',
    accentLight: '#fde047',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#fbbf24',
  },

  // Elegance theme for 路易丝
  elegance: {
    primary: '#f9a8d4',      // Pink Light
    primaryDark: '#ec4899',
    primaryLight: '#fbcfe8',
    accent: '#c4b5fd',        // Lavender
    accentDark: '#a78bfa',
    accentLight: '#ddd6fe',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#f9a8d4',
  },

  // Sky theme for Wren空
  sky: {
    primary: '#38bdf8',      // Sky Blue
    primaryDark: '#0ea5e9',
    primaryLight: '#7dd3fc',
    accent: '#818cf8',        // Indigo Light
    accentDark: '#6366f1',
    accentLight: '#a5b4fc',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#38bdf8',
  },
};
