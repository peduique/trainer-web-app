import { z } from 'zod';
import { dayWorkoutSchema } from '@/models/workouts/workouts.schema';

export const programProgressSchema = z.object({
  percent: z.number(),
  complete: z.number().optional(),
  total: z.number().optional(),
  workouts_completed: z.number().optional(),
  total_workouts: z.number().optional(),
});

export const programSchema = z.object({
  id: z.number(),
  uuid: z.string(),
  name: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  weeks: z.number(),
  days_per_week: z.number(),
  template: z.boolean(),
  confirmed: z.boolean(),
  start_date: z.string().nullable().optional(),
  created_at: z.string().optional(),
  current_progress: programProgressSchema.optional().default({ percent: 0 }),
});

export type Program = z.infer<typeof programSchema>;

export const programDaySchema = z.object({
  id: z.number(),
  day_number: z.number(),
  week: z.number(),
  position: z.number(),
  title: z.string().nullish(),
  program_week_id: z.number().optional(),
  day_workouts: z.array(dayWorkoutSchema).optional(),
});

export type ProgramDay = z.infer<typeof programDaySchema>;

export const programDetailSchema = programSchema.extend({
  program_days: z.array(programDaySchema).optional(),
});

export type ProgramDetail = z.infer<typeof programDetailSchema>;

export const createProgramAiSchema = z.object({
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  weeks: z.enum(['4', '6', '8']),
  days_per_week: z.enum(['2', '3', '4', '5', '6']),
  duration_minutes: z.enum(['10', '20', '30', '45', '60', '90']),
  goal: z.enum(['build_muscle', 'strength_gain', 'weight_loss', 'metcon_hiit', 'hybrid_athlete']),
  emphasis: z.enum(['balanced', 'upper_body', 'lower_body', 'push_pull']),
  equipment: z.enum(['bodyweight', 'dumbbells', 'home_gym', 'full_gym']),
  injuries: z.array(z.enum(['none', 'low_back', 'knees', 'shoulders', 'wrists_elbows', 'hips', 'neck_cervical'])).default(['none']),
  include_warm_up: z.boolean().default(true),
  include_stretching: z.boolean().default(true),
});

export type CreateProgramAiInput = z.infer<typeof createProgramAiSchema>;

export const createProgramManualSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  weeks: z.number().min(1).max(52),
  days_per_week: z.number().min(1).max(7),
});

export type CreateProgramManualInput = z.infer<typeof createProgramManualSchema>;

export const generationStatusSchema = z.object({
  status: z.enum(['queued', 'running', 'completed', 'failed']),
  progress: z.number().optional(),
  program_uuid: z.string().optional(),
  error: z.string().optional(),
});

export type GenerationStatus = z.infer<typeof generationStatusSchema>;
