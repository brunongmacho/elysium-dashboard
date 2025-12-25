/**
 * Timezone Utilities
 * Handle all date/time formatting in GMT+8 (Asia/Manila)
 */

import { format as dateFnsFormat } from "date-fns";
import { toZonedTime } from "date-fns-tz";

// Default timezone for the application
export const DEFAULT_TIMEZONE = process.env.NEXT_PUBLIC_TIMEZONE || "Asia/Manila";

/**
 * Format a date in GMT+8 timezone
 * @param date - Date to format (Date object, ISO string, or timestamp)
 * @param formatString - date-fns format string (e.g., "MMM dd, yyyy hh:mm a")
 * @returns Formatted date string in GMT+8
 */
export function formatInGMT8(date: Date | string | number, formatString: string): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const zonedDate = toZonedTime(dateObj, DEFAULT_TIMEZONE);
  return dateFnsFormat(zonedDate, formatString);
}

/**
 * Convert a date to GMT+8 timezone
 * @param date - Date to convert
 * @returns Date object in GMT+8 timezone
 */
export function toGMT8(date: Date | string | number): Date {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return toZonedTime(dateObj, DEFAULT_TIMEZONE);
}

/**
 * Format date with locale string in GMT+8
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function toLocaleStringGMT8(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', {
    ...options,
    timeZone: DEFAULT_TIMEZONE,
  });
}
