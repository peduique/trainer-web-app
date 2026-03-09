'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeWorkout, undoWorkout, removeWorkoutFromDay, addWorkoutToDay } from '@/models/workouts/workouts.api';
import { dayDetailQueryKey } from './use-day-detail';

interface UseWorkoutActionsParams {
  programId: number;
  programUuid: string;
  dayId: number;
}

export function useWorkoutActions({ programId, programUuid, dayId }: UseWorkoutActionsParams) {
  const queryClient = useQueryClient();
  const key = dayDetailQueryKey(programUuid, dayId);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });

  const complete = useMutation({
    mutationFn: (workoutId: number) => completeWorkout(workoutId, programUuid),
    onSuccess: invalidate,
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

  return { complete, undo, remove, add };
}
