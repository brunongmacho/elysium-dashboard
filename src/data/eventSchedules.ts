import { EventSchedule } from '../types/eventSchedule';

// All times are in GMT+8 (Asia/Manila timezone)
export const GAME_EVENTS: EventSchedule[] = [
  {
    id: 'individual-arena',
    name: 'Individual Arena',
    icon: '⚔️',
    days: [1, 3, 5], // Monday, Wednesday, Friday
    startTime: { hour: 20, minute: 30 },
    durationMinutes: 60,
    color: '#ff6b6b',
    reminderOffsetMinutes: 10,
  },
  {
    id: 'coop-arena',
    name: 'Coop Round Arena',
    icon: '🤝',
    days: [2, 4, 6], // Tuesday, Thursday, Saturday
    startTime: { hour: 20, minute: 30 },
    durationMinutes: 60,
    color: '#4ecdc4',
    reminderOffsetMinutes: 10,
  },
  {
    id: 'gvg',
    name: 'GvG / Guild War',
    icon: '⚔️',
    days: [5, 6, 0], // Friday, Saturday, Sunday
    startTime: { hour: 20, minute: 25 },
    durationMinutes: 3,
    color: '#f39c12',
    reminderOffsetMinutes: 20,
  },
  {
    id: 'guild-boss',
    name: 'Guild Boss',
    icon: '👹',
    days: [1], // Monday only
    startTime: { hour: 21, minute: 0 },
    durationMinutes: 5,
    color: '#e74c3c',
    reminderOffsetMinutes: 20,
  },
  {
    id: 'guild-war-queue',
    name: 'Guild War Queue Reminder',
    icon: '🎯',
    days: [4, 5, 6], // Thursday, Friday, Saturday
    startTime: { hour: 23, minute: 0 },
    durationMinutes: 120,
    color: '#9b59b6',
    reminderOffsetMinutes: 0,
  },
];

export const DAILY_EVENTS: EventSchedule[] = [
  {
    id: 'world-boss-morning',
    name: 'World Boss Event (Morning)',
    icon: '🐉',
    startTime: { hour: 11, minute: 0 },
    durationMinutes: 30,
    color: '#9b59b6',
    isDaily: true,
    reminderOffsetMinutes: 10,
  },
  {
    id: 'world-boss-evening',
    name: 'World Boss Event (Evening)',
    icon: '🐉',
    startTime: { hour: 20, minute: 0 },
    durationMinutes: 30,
    color: '#9b59b6',
    isDaily: true,
    reminderOffsetMinutes: 10,
  },
];

export const ALL_EVENTS: EventSchedule[] = [...GAME_EVENTS, ...DAILY_EVENTS];
