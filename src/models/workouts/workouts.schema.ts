import { z } from 'zod';

export const exerciseSchema = z.object({
  id: z.number(),
  name: z.string(),
  video_id: z.string().nullable().optional(),
  youtube_video_ids: z.array(z.string()).optional(),
  body_part: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
});

export type Exercise = z.infer<typeof exerciseSchema>;

export const scoreSchema = z.object({
  id: z.number(),
  name: z.string().nullable().optional(),
  kind: z.enum(['time', 'rounds', 'reps', 'weight', 'calories', 'distance']),
  unit: z.string().nullable().optional(),
});

export type Score = z.infer<typeof scoreSchema>;

export const workoutExerciseSchema = z.object({
  id: z.number(),
  workout_id: z.number(),
  exercise_id: z.number(),
  finished: z.boolean(),
  sets: z.number().nullable().optional(),
  reps: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  user_notes: z.string().nullable().optional(),
  position: z.number(),
  position_at_workout: z.number().optional(),
  superset_id: z.number().nullable().optional(),
  exercise: exerciseSchema,
});

export type WorkoutExercise = z.infer<typeof workoutExerciseSchema>;

export const supersetSchema = z.object({
  id: z.number(),
  name: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  position: z.number().optional(),
  position_at_workout: z.number().optional(),
});

export type Superset = z.infer<typeof supersetSchema>;

export const workoutSchema = z.object({
  id: z.number(),
  name: z.string(),
  finished: z.boolean(),
  exercises_count: z.number(),
  order_by: z.number().optional(),
  workouts_exercises: z.array(workoutExerciseSchema).optional(),
  supersets: z.array(supersetSchema).optional(),
  description: z.string().nullable().optional(),
});

export type Workout = z.infer<typeof workoutSchema>;

export const dayWorkoutSchema = z.object({
  id: z.number(),
  default: z.boolean(),
  position: z.number(),
  workouts: z.array(workoutSchema).optional(),
});

export type DayWorkout = z.infer<typeof dayWorkoutSchema>;

export const dayDetailSchema = z.object({
  id: z.number(),
  day_number: z.number(),
  week: z.number(),
  position: z.number(),
  title: z.string().optional(),
  day_workouts: z.array(dayWorkoutSchema).optional(),
});

export type DayDetail = z.infer<typeof dayDetailSchema>;
