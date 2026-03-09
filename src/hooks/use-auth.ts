import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '@/models/auth/auth.api';

export const AUTH_QUERY_KEY = ['auth', 'me'] as const;

export interface AuthState {
  user: import('@/models/auth/auth.schema').User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useAuth(): AuthState {
  const { data, isLoading, error } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    user: data ?? null,
    isAuthenticated: data !== null && data !== undefined,
    isLoading,
    error: error instanceof Error ? error : null,
  };
}
