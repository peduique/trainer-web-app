import { z } from 'zod';

export const exerciseLibraryItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  body_part: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  equipment: z.string().nullable().optional(),
});

export type ExerciseLibraryItem = z.infer<typeof exerciseLibraryItemSchema>;
