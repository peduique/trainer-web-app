import { apiClient } from '@/lib/api/client';
import type { ExerciseHistoryResponse } from './scores.schema';

export async function fetchExerciseHistory(
  exerciseId: number,
  page = 1,
  perPage = 10
): Promise<ExerciseHistoryResponse> {
  return apiClient.get<ExerciseHistoryResponse>(
    `/history/exercises/${exerciseId}/executions?page=${page}&per_page=${perPage}`
  );
}

export async function saveScore(workoutExerciseId: number, data: {
  kind: string;
  value: number;
  unit?: string;
  set_number?: number;
}): Promise<void> {
  return apiClient.post<void>(`/api/workouts_exercises/${workoutExerciseId}/scores`, data);
}

export async function completeExercise(workoutExerciseId: number, programUuid?: string): Promise<void> {
  return apiClient.post<void>(`/api/workouts_exercises/${workoutExerciseId}/finish_async`, {
    program_uuid: programUuid,
  });
}

export async function saveUserNotes(workoutExerciseId: number, notes: string): Promise<void> {
  return apiClient.patch<void>(`/api/workouts_exercises/${workoutExerciseId}`, { user_notes: notes });
}
