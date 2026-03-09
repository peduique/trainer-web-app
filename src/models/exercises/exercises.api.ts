import { apiClient } from '@/lib/api/client';
import type { ExerciseLibraryItem } from './exercises.schema';

export async function searchExercises(query: string): Promise<ExerciseLibraryItem[]> {
  const params = query ? `?q=${encodeURIComponent(query)}` : '';
  return apiClient.get<ExerciseLibraryItem[]>(`/api/exercises${params}`);
}

export async function addExercisesToWorkout(workoutId: number, exerciseIds: number[]): Promise<void> {
  return apiClient.post<void>(`/api/workouts/${workoutId}/add_exercises`, { exercise_ids: exerciseIds });
}

export async function removeExerciseFromWorkout(workoutId: number, exerciseId: number): Promise<void> {
  return apiClient.delete<void>(`/api/workouts/${workoutId}/exercises/${exerciseId}`);
}
