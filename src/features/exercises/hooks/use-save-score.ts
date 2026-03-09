'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  saveScore,
  completeExercise,
  setExerciseFinished,
  saveUserNotes,
} from '@/models/scores/scores.api';
import { saveActiveProgram } from '@/hooks/use-active-program';
import { dayDetailQueryKey } from '@/features/program-days/hooks/use-day-detail';
import { programQueryKey } from '@/features/programs/hooks/use-program';
import type { DayDetail } from '@/models/workouts/workouts.schema';
import type { ProgramDetail } from '@/models/programs/programs.schema';

interface UseScoreActionsParams {
  programUuid: string;
  dayId: number;
}

function updateExerciseFinishedInDay(
  day: {
    day_workouts?: Array<{
      workouts?: Array<{ workouts_exercises?: Array<{ id: number; finished: boolean }> }>;
    }>;
  } | null,
  workoutExerciseId: number,
  finished: boolean,
) {
  if (!day?.day_workouts) return day;
  return {
    ...day,
    day_workouts: day.day_workouts.map((dw) => ({
      ...dw,
      workouts: (dw.workouts ?? []).map((w) => ({
        ...w,
        workouts_exercises: (w.workouts_exercises ?? []).map((ex) =>
          ex.id === workoutExerciseId ? { ...ex, finished } : ex,
        ),
      })),
    })),
  };
}

function updateExerciseFinishedInProgram(
  program: ProgramDetail | undefined,
  dayId: number,
  workoutExerciseId: number,
  finished: boolean,
): ProgramDetail | undefined {
  if (!program?.program_days) return program;
  return {
    ...program,
    program_days: program.program_days.map((pd) => {
      if (pd.id !== dayId) return pd;
      return updateExerciseFinishedInDay(pd, workoutExerciseId, finished) as typeof pd;
    }),
  };
}

export function useScoreActions({ programUuid, dayId }: UseScoreActionsParams) {
  const queryClient = useQueryClient();
  const dayKey = dayDetailQueryKey(programUuid, dayId);
  const programKey = programQueryKey(programUuid);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: dayKey });
    queryClient.invalidateQueries({ queryKey: programKey });
  };

  const save = useMutation({
    mutationFn: ({
      workoutExerciseId,
      data,
    }: {
      workoutExerciseId: number;
      data: { kind: string; value: number; unit?: string; set_number?: number };
    }) => saveScore(workoutExerciseId, data),
  });

  const complete = useMutation({
    mutationFn: (workoutExerciseId: number) => completeExercise(workoutExerciseId, programUuid),
    onSuccess: () => {
      saveActiveProgram({ uuid: programUuid });
      invalidate();
    },
  });

  const toggleComplete = useMutation({
    mutationFn: ({
      workoutExerciseId,
      currentlyFinished,
    }: {
      workoutExerciseId: number;
      currentlyFinished: boolean;
    }) =>
      currentlyFinished
        ? setExerciseFinished(workoutExerciseId, false)
        : completeExercise(workoutExerciseId, programUuid),
    onMutate: async ({ workoutExerciseId, currentlyFinished }) => {
      await queryClient.cancelQueries({ queryKey: dayKey });
      await queryClient.cancelQueries({ queryKey: programKey });
      const previousDay = queryClient.getQueryData<DayDetail>(dayKey);
      const previousProgram = queryClient.getQueryData<ProgramDetail>(programKey);
      const newFinished = !currentlyFinished;

      queryClient.setQueryData<DayDetail>(dayKey, (old) =>
        old ? (updateExerciseFinishedInDay(old, workoutExerciseId, newFinished) as DayDetail) : old,
      );
      queryClient.setQueryData<ProgramDetail>(programKey, (old) =>
        old ? updateExerciseFinishedInProgram(old, dayId, workoutExerciseId, newFinished) : old,
      );

      return { previousDay, previousProgram };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousDay != null) queryClient.setQueryData(dayKey, context.previousDay);
      if (context?.previousProgram != null)
        queryClient.setQueryData(programKey, context.previousProgram);
    },
    onSuccess: () => {
      saveActiveProgram({ uuid: programUuid });
    },
  });

  const updateNotes = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes: string }) => saveUserNotes(id, notes),
  });

  return { save, complete, toggleComplete, updateNotes };
}
