import { apiClient } from '@/lib/api/client';
import type { DayDetail, DayWorkout } from './workouts.schema';
import type { ProgramDetail } from '@/models/programs/programs.schema';

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

/**
 * Build the payload for adding a new block to a day.
 * Extracts business logic for constructing the complete program days structure.
 */
export function buildAddBlockPayload(
  program: ProgramDetail | null | undefined,
  day: DayDetail | null | undefined,
  dayId: number
): unknown[] {
  if (!program?.id) throw new Error('Program missing');

  // Use current day's day_workouts from page data so we're in sync with what's displayed
  const currentDayBlocks = day?.day_workouts ?? [];
  const existingBlocks = currentDayBlocks.map((dw, idx) => ({
    id: dw.id,
    position: dw.position ?? idx + 1,
    default: dw.default ?? false,
    workouts: (dw.workouts ?? []).map((w, wi) => ({
      id: w.id,
      name: w.name,
      order_by: w.order_by ?? wi + 1,
      finished: w.finished ?? false,
      workouts_exercises: w.workouts_exercises ?? [],
    })),
  })) as DayWorkout[];

  const newBlock = {
    position: existingBlocks.length + 1,
    default: false,
    workouts: [],
  };

  const currentDayPayload = day
    ? {
        id: day.id,
        week: day.week,
        day_number: day.day_number,
        title: day.title ?? null,
        position: day.position,
        day_workouts: [...existingBlocks, newBlock],
      }
    : null;

  const programDays = program.program_days ?? [];
  let updatedProgramDays: unknown[];

  if (programDays.length === 0 && currentDayPayload) {
    updatedProgramDays = [currentDayPayload];
  } else {
    updatedProgramDays = programDays.map((programDay) => {
      if (programDay.id !== dayId) {
        return {
          id: programDay.id,
          week: programDay.week,
          day_number: programDay.day_number,
          title: programDay.title ?? null,
          position: programDay.position,
          day_workouts: (programDay.day_workouts ?? []).map((dw, idx) => ({
            id: dw.id,
            position: dw.position ?? idx + 1,
            default: dw.default ?? false,
            workouts: (dw.workouts ?? []).map((w, wi) => ({
              id: w.id,
              name: w.name,
              order_by: w.order_by ?? wi + 1,
              finished: w.finished ?? false,
              workouts_exercises: w.workouts_exercises ?? [],
            })),
          })),
        };
      }
      return currentDayPayload ?? {
        id: programDay.id,
        week: programDay.week,
        day_number: programDay.day_number,
        title: programDay.title ?? null,
        position: programDay.position,
        day_workouts: [...existingBlocks, newBlock],
      };
    });
    if (currentDayPayload && !programDays.some((d) => d.id === dayId)) {
      updatedProgramDays = [...updatedProgramDays, currentDayPayload];
    }
  }

  return updatedProgramDays;
}
