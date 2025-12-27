import type { EventSchedule } from '@/types/eventSchedule';

/**
 * Calculate the next occurrence of an event based on its schedule
 * @param event The event schedule configuration
 * @param currentTime Current timestamp in milliseconds
 * @returns Date object representing the next occurrence
 */
export function calculateNextOccurrence(event: EventSchedule, currentTime: number): Date {
  const now = new Date(currentTime);
  const gmt8Offset = 8 * 60 * 60 * 1000;
  const gmt8Now = new Date(now.getTime() + gmt8Offset);

  const currentHour = gmt8Now.getUTCHours();
  const currentMinute = gmt8Now.getUTCMinutes();
  const currentDay = gmt8Now.getUTCDay();

  if (event.isDaily) {
    // For daily events, check if today's occurrence has passed
    const eventTime = new Date(gmt8Now);
    eventTime.setUTCHours(event.startTime.hour, event.startTime.minute, 0, 0);

    const eventTimeMs = eventTime.getTime();
    const nowMs = gmt8Now.getTime();

    if (eventTimeMs > nowMs) {
      // Event hasn't occurred today yet
      return new Date(eventTimeMs - gmt8Offset);
    } else {
      // Event already passed today, schedule for tomorrow
      eventTime.setUTCDate(eventTime.getUTCDate() + 1);
      return new Date(eventTime.getTime() - gmt8Offset);
    }
  } else {
    // For weekly events, find the next occurrence
    if (!event.days || event.days.length === 0) {
      return new Date(currentTime);
    }

    // Find next day when event occurs
    let daysToAdd = 0;
    let found = false;

    for (let i = 0; i < 7; i++) {
      const checkDay = (currentDay + i) % 7;

      if (event.days.includes(checkDay)) {
        if (i === 0) {
          // Event is today, check if it's already passed
          const timeInMinutes = currentHour * 60 + currentMinute;
          const eventTimeInMinutes = event.startTime.hour * 60 + event.startTime.minute;

          if (eventTimeInMinutes > timeInMinutes) {
            // Event hasn't occurred yet today
            daysToAdd = 0;
            found = true;
            break;
          }
        } else {
          // Event is on a future day
          daysToAdd = i;
          found = true;
          break;
        }
      }
    }

    if (!found) {
      // No valid day found (shouldn't happen), default to next occurrence of first day
      const firstDay = event.days[0];
      daysToAdd = (firstDay - currentDay + 7) % 7;
      if (daysToAdd === 0) daysToAdd = 7;
    }

    const nextOccurrence = new Date(gmt8Now);
    nextOccurrence.setUTCDate(nextOccurrence.getUTCDate() + daysToAdd);
    nextOccurrence.setUTCHours(event.startTime.hour, event.startTime.minute, 0, 0);

    return new Date(nextOccurrence.getTime() - gmt8Offset);
  }
}

/**
 * Check if an event is currently active
 * @param event The event schedule configuration
 * @param currentTime Current timestamp in milliseconds
 * @returns True if the event is currently active
 */
export function isEventActive(event: EventSchedule, currentTime: number): boolean {
  const nextOccurrence = calculateNextOccurrence(event, currentTime);
  const timeUntilStart = nextOccurrence.getTime() - currentTime;
  const eventEndTime = nextOccurrence.getTime() + (event.durationMinutes * 60 * 1000);

  return timeUntilStart < 0 && currentTime < eventEndTime;
}

/**
 * Get time remaining until event starts or ends (if active)
 * @param event The event schedule configuration
 * @param currentTime Current timestamp in milliseconds
 * @returns Time remaining in milliseconds
 */
export function getEventTimeRemaining(event: EventSchedule, currentTime: number): number {
  const nextOccurrence = calculateNextOccurrence(event, currentTime);
  const timeUntilStart = nextOccurrence.getTime() - currentTime;
  const eventEndTime = nextOccurrence.getTime() + (event.durationMinutes * 60 * 1000);

  // If event is active, return time until it ends
  if (timeUntilStart < 0 && currentTime < eventEndTime) {
    return eventEndTime - currentTime;
  }

  // Otherwise return time until it starts
  return timeUntilStart;
}

/**
 * Format days array into readable string
 * @param days Array of day numbers (0=Sunday, 1=Monday, etc.)
 * @param isDaily Whether this is a daily event
 * @returns Formatted string like "Mon, Wed, Fri" or "Daily"
 */
export function formatEventDays(days: number[] | undefined, isDaily?: boolean): string {
  if (isDaily) return 'Daily';
  if (!days || days.length === 0) return '';

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days.map(d => dayNames[d]).join(', ');
}
