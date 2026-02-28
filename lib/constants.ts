/**
 * Application Constants
 * Centralized location for all magic numbers and configuration values
 */

// Time constants (in milliseconds)
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const;

// Timezone constants
export const TIMEZONE = {
  GMT_PLUS_8_OFFSET: 8 * TIME.HOUR,
  GMT_PLUS_8_NAME: 'Asia/Manila',
} as const;

// Boss timer constants
export const BOSS_TIMER = {
  GRACE_PERIOD: 35 * TIME.MINUTE, // 35 minutes after expected spawn
  SOON_THRESHOLD: 30 * TIME.MINUTE, // < 30 minutes = "soon"
  REFRESH_INTERVAL: 30 * TIME.SECOND, // Auto-refresh every 30 seconds
} as const;

// API caching constants
export const CACHE = {
  BOSS_TIMERS: 30, // seconds
  LEADERBOARD: 60, // seconds
  STALE_WHILE_REVALIDATE_MULTIPLIER: 2,
} as const;

// Leaderboard constants
export const LEADERBOARD = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
  DEBOUNCE_DELAY: 300, // milliseconds
} as const;

// Validation constants
export const VALIDATION = {
  DISCORD_SNOWFLAKE_REGEX: /^\d{17,19}$/,
  BOSS_NAME_MAX_LENGTH: 100,
  SEARCH_MIN_LENGTH: 1,
  SEARCH_MAX_LENGTH: 50,
} as const;

// Auth/Session constants
export const AUTH = {
  CACHE_AGE: 5 * TIME.MINUTE, // Refresh Discord data every 5 minutes
  SESSION_MAX_AGE: 30 * TIME.MINUTE, // Session expires after 30 minutes
  REMEMBER_ME_MAX_AGE: 7 * TIME.DAY, // Remember me: session expires after 7 days
} as const;

// UI/UX constants
export const UI = {
  BACK_TO_TOP_THRESHOLD: 300, // pixels scrolled before showing back-to-top button
  ANIMATION_DURATION_MS: 300, // default animation duration
  TRANSITION_DURATION_SLOW: 1000, // slow transitions
  ERROR_RETRY_INTERVAL: 5000, // SWR error retry interval
  ERROR_RETRY_COUNT: 3, // maximum retry attempts
  REFRESH_BUTTON_DELAY: 500, // delay to show loading state on manual refresh
} as const;

// External links
export const LINKS = {
  APK_DOWNLOAD: 'https://github.com/brunongmacho/elysium-guild/releases/download/v2.0.4/app-debug.apk',
  DISCORD_INVITE: 'https://discord.gg/EUWXd5tPa7',
} as const;
