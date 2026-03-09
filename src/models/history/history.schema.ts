import { z } from 'zod';

export const historyDateSchema = z.object({
  date: z.string(),
  workouts_count: z.number(),
});

export type HistoryDate = z.infer<typeof historyDateSchema>;

export const historyWorkoutSchema = z.object({
  id: z.number(),
  name: z.string(),
  finished: z.boolean(),
  exercises_count: z.number(),
  completed_at: z.string().optional(),
});

export type HistoryWorkout = z.infer<typeof historyWorkoutSchema>;
