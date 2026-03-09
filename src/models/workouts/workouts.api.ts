import { apiClient } from '@/lib/api/client';
import type { DayDetail } from './workouts.schema';

export async function fetchDayDetail(programUuid: string, dayId: number): Promise<DayDetail> {
  return apiClient.get<DayDetail>(`/programs/by_uuid/${programUuid}/days/${dayId}`);
}

export async function addWorkoutToDay(programId: number, dayId: number, dayWorkoutId?: number): Promise<void> {
  return apiClient.post<void>(`/programs/${programId}/add_workout_to_day`, {
    day_id: dayId,
    day_workout_id: dayWorkoutId,
  });
}

export async function removeWorkoutFromDay(programId: number, dayId: number, workoutId: number): Promise<void> {
  return apiClient.delete<void>(`/programs/${programId}/remove_workout_from_day`, {
    day_id: dayId,
    workout_id: workoutId,
  });
}

export async function updateProgramDays(programId: number, programDays: unknown[]): Promise<void> {
  return apiClient.put<void>(`/programs/${programId}/update_days`, { program_days: programDays });
}

export async function completeWorkout(workoutId: number, programUuid?: string): Promise<void> {
  return apiClient.post<void>(`/workouts/${workoutId}/finish_async`, { program_uuid: programUuid });
}

export async function undoWorkout(workoutId: number): Promise<void> {
  return apiClient.put<void>(`/workouts/${workoutId}/undo`);
}

export async function updateWorkoutName(workoutId: number, name: string): Promise<void> {
  return apiClient.patch<void>(`/workouts/${workoutId}`, { name });
}
