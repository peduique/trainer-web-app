'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeWorkout, undoWorkout, removeWorkoutFromDay, addWorkoutToDay, updateProgramDays, buildAddBlockPayload } from '@/models/workouts/workouts.api';
import { saveActiveProgram } from '@/hooks/use-active-program';
import { dayDetailQueryKey } from './use-day-detail';
import { programQueryKey } from '@/features/programs/hooks/use-program';
import type { ProgramDetail } from '@/models/programs/programs.schema';
import type { DayDetail } from '@/models/workouts/workouts.schema';

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
      const updatedProgramDays = buildAddBlockPayload(program, day, dayId);
      await updateProgramDays(programId, updatedProgramDays);
    },
    onSuccess: invalidate,
  });

  return { complete, undo, remove, add, addBlock };
}
