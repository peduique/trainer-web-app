import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchDayDetail } from '@/models/workouts/workouts.api';

export const dayDetailQueryKey = (programUuid: string, dayId: number) =>
  ['programs', programUuid, 'days', dayId] as const;

export function useDayDetail(programUuid: string, dayId: number) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: dayDetailQueryKey(programUuid, dayId),
    queryFn: () => fetchDayDetail(programUuid, dayId),
    enabled: !!programUuid && !!dayId,
  });

  return { day: data ?? null, isLoading, error, refetch };
}
