/**
 * Input Validation Schemas using Zod
 */

import { z } from 'zod';
import { VALIDATION, LEADERBOARD } from './constants';

// Boss name validation
export const bossNameSchema = z.string()
  .min(1, 'Boss name is required')
  .max(VALIDATION.BOSS_NAME_MAX_LENGTH, `Boss name too long (max ${VALIDATION.BOSS_NAME_MAX_LENGTH} chars)`);

// Member ID validation (Discord snowflake format)
export const memberIdSchema = z.string()
  .regex(VALIDATION.DISCORD_SNOWFLAKE_REGEX, 'Invalid member ID format');

// Search query validation
export const searchSchema = z.string()
  .max(VALIDATION.SEARCH_MAX_LENGTH)
  .optional()
  .default('');

// Leaderboard query params validation
export const leaderboardQuerySchema = z.object({
  type: z.enum(['attendance', 'points']).nullable().optional().default('attendance'),
  period: z.enum(['all', 'monthly', 'weekly']).nullable().optional().default('all'),
  limit: z.coerce.number()
    .int()
    .min(1)
    .max(LEADERBOARD.MAX_LIMIT)
    .optional()
    .default(LEADERBOARD.DEFAULT_LIMIT),
  search: z.string().nullable().optional().default(''),
  month: z.string().regex(/^\d{4}-\d{2}$/).nullable().optional(), // YYYY-MM format
  week: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(), // YYYY-MM-DD format
});

// Boss kill update validation
export const bossKillSchema = z.object({
  killedBy: z.string().min(1, 'Killer name is required').max(100),
  killTime: z.string().datetime().optional(),
  spawnTime: z.string().datetime().optional(),
});

// Helper function to validate and parse
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      };
    }
    return { success: false, error: 'Validation failed' };
  }
}
