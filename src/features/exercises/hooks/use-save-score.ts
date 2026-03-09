'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveScore, completeExercise, saveUserNotes } from '@/models/scores/scores.api';

interface UseScoreActionsParams {
  programUuid: string;
  dayId: number;
}

export function useScoreActions({ programUuid, dayId }: UseScoreActionsParams) {
  const queryClient = useQueryClient();
  const key = ['programs', programUuid, 'days', dayId];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });

  const save = useMutation({
    mutationFn: ({ workoutExerciseId, data }: {
      workoutExerciseId: number;
      data: { kind: string; value: number; unit?: string; set_number?: number };
    }) => saveScore(workoutExerciseId, data),
  });

  const complete = useMutation({
    mutationFn: (workoutExerciseId: number) => completeExercise(workoutExerciseId, programUuid),
    onSuccess: invalidate,
  });

  const updateNotes = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes: string }) => saveUserNotes(id, notes),
  });

  return { save, complete, updateNotes };
}
