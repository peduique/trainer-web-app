import { useQuery } from '@tanstack/react-query';
import { searchExercises } from '@/models/exercises/exercises.api';
import { useDebounce } from '@/hooks/use-debounce';

export function useExerciseSearch(query: string) {
  const debounced = useDebounce(query, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['exercises', 'search', debounced],
    queryFn: () => searchExercises(debounced),
    staleTime: 60_000,
  });

  return { exercises: data ?? [], isLoading };
}
