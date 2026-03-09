'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeWorkout, undoWorkout, removeWorkoutFromDay, addWorkoutToDay, updateProgramDays } from '@/models/workouts/workouts.api';
import { saveActiveProgram } from '@/hooks/use-active-program';
import { dayDetailQueryKey } from './use-day-detail';
import { programQueryKey } from '@/features/programs/hooks/use-program';
import type { ProgramDetail } from '@/models/programs/programs.schema';
import type { DayWorkout, DayDetail } from '@/models/workouts/workouts.schema';

interface UseWorkoutActionsParams {
  programId: number;
  programUuid: string;
  dayId: number;
  /** Required for addBlock. Pass from useProgram(programUuid).program */
  program?: ProgramDetail | null;
  /** Current day data (from useDayDetail). Used by addBlock to build payload. */
  day?: DayDetail | null;
}

export function useWorkoutActions({ programId, programUuid, dayId, program, day }: UseWorkoutActionsParams) {
  const queryClient = useQueryClient();
  const key = dayDetailQueryKey(programUuid, dayId);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: key });
    queryClient.invalidateQueries({ queryKey: programQueryKey(programUuid) });
  };

  const complete = useMutation({
    mutationFn: (workoutId: number) => completeWorkout(workoutId, programUuid),
    onSuccess: () => {
      saveActiveProgram({ uuid: programUuid });
      invalidate();
    },
  });

  const undo = useMutation({
    mutationFn: (workoutId: number) => undoWorkout(workoutId),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (workoutId: number) => removeWorkoutFromDay(programId, dayId, workoutId),
    onSuccess: invalidate,
  });

  const add = useMutation({
    mutationFn: (dayWorkoutId?: number) => addWorkoutToDay(programId, dayId, dayWorkoutId),
    onSuccess: invalidate,
  });

  const addBlock = useMutation({
    mutationFn: async () => {
      if (!program?.id) throw new Error('Program missing');
      const currentDayId = Number(dayId);
      // Use current day's day_workouts from page data (useDayDetail) so we're in sync with what's displayed
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
          if (programDay.id !== currentDayId) {
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
          return currentDayPayload ?? { id: programDay.id, week: programDay.week, day_number: programDay.day_number, title: programDay.title ?? null, position: programDay.position, day_workouts: [...existingBlocks, newBlock] };
        });
        if (currentDayPayload && !programDays.some((d) => d.id === currentDayId)) {
          updatedProgramDays = [...updatedProgramDays, currentDayPayload];
        }
      }

      await updateProgramDays(programId, updatedProgramDays);
    },
    onSuccess: invalidate,
  });

  return { complete, undo, remove, add, addBlock };
}
