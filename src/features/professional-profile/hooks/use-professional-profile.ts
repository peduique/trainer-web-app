import { useQuery } from '@tanstack/react-query';
import { fetchProfessionalProfile } from '@/models/professional-profile/professional-profile.api';

export function useProfessionalProfile(uuid: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['professionals', uuid],
    queryFn: () => fetchProfessionalProfile(uuid),
    enabled: !!uuid,
  });
  return { professional: data ?? null, isLoading, error };
}
