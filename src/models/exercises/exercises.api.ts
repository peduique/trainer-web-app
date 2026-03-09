import { apiClient } from '@/lib/api/client';
import type { ExerciseLibraryItem } from './exercises.schema';

export async function searchExercises(query: string): Promise<ExerciseLibraryItem[]> {
  const params = query ? `?q=${encodeURIComponent(query)}` : '';
  return apiClient.get<ExerciseLibraryItem[]>(`/exercises${params}`);
}

/** Add exercises to a workout. API expects one exercise per POST (same as mobile). */
export async function addExercisesToWorkout(
  workoutId: number,
  exerciseIds: number[],
  options?: { sets?: number; reps?: string; notes?: string }
): Promise<void> {
  const { sets = 3, reps = '12', notes = '' } = options ?? {};
  await Promise.all(
    exerciseIds.map((exerciseId) =>
      apiClient.post<void>(`/workouts/${workoutId}/add_workout_exercise`, {
        exercise: { id: exerciseId },
        sets,
        reps,
        notes,
      })
    )
  );
}

export async function removeExerciseFromWorkout(workoutId: number, exerciseId: number): Promise<void> {
  return apiClient.delete<void>(`/workouts/${workoutId}/exercises/${exerciseId}`);
}
