import { z } from 'zod';

export const metricKindSchema = z.enum(['time', 'rounds', 'reps', 'weight', 'calories', 'distance']);
export type MetricKind = z.infer<typeof metricKindSchema>;

export const scoreEntrySchema = z.object({
  id: z.number().optional(),
  kind: metricKindSchema,
  value: z.number().nullable(),
  unit: z.string().nullable().optional(),
  set_number: z.number().optional(),
});

export type ScoreEntry = z.infer<typeof scoreEntrySchema>;

export const exerciseHistoryEntrySchema = z.object({
  id: z.number(),
  completed_at: z.string(),
  scores: z.array(scoreEntrySchema),
  workout_name: z.string().optional(),
});

export type ExerciseHistoryEntry = z.infer<typeof exerciseHistoryEntrySchema>;

export const exerciseHistoryResponseSchema = z.object({
  data: z.array(exerciseHistoryEntrySchema),
  meta: z.object({
    current_page: z.number(),
    total_pages: z.number(),
    total_count: z.number(),
  }).optional(),
});

export type ExerciseHistoryResponse = z.infer<typeof exerciseHistoryResponseSchema>;
