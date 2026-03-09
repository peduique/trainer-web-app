import { useQuery } from '@tanstack/react-query';
import { fetchDayDetail } from '@/models/workouts/workouts.api';
import type { WorkoutExercise } from '@/models/workouts/workouts.schema';

export function useExerciseDetail(programUuid: string, dayId: number, exerciseId: number) {
  const { data: day, isLoading, error, refetch } = useQuery({
    queryKey: ['programs', programUuid, 'days', dayId],
    queryFn: () => fetchDayDetail(programUuid, dayId),
    enabled: !!programUuid && !!dayId,
  });

  const exercise: WorkoutExercise | null = day?.day_workouts
    ?.flatMap((dw) => dw.workouts ?? [])
    ?.flatMap((w) => w.workouts_exercises ?? [])
    ?.find((we) => we.id === exerciseId) ?? null;

  return { exercise, isLoading, error, refetch };
}
