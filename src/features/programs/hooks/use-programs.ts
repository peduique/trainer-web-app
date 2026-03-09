import { useQuery } from '@tanstack/react-query';
import { fetchPrograms } from '@/models/programs/programs.api';

export const PROGRAMS_QUERY_KEY = ['programs'] as const;

export function usePrograms() {
  const { data, isLoading, error } = useQuery({
    queryKey: PROGRAMS_QUERY_KEY,
    queryFn: fetchPrograms,
  });

  return { programs: data ?? [], isLoading, error };
}
