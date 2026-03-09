import { useQuery } from '@tanstack/react-query';
import { fetchProgram } from '@/models/programs/programs.api';

export const programQueryKey = (uuid: string) => ['programs', uuid] as const;

export function useProgram(uuid: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: programQueryKey(uuid),
    queryFn: () => fetchProgram(uuid),
    enabled: !!uuid,
  });

  return { program: data ?? null, isLoading, error };
}
