import { useAuth } from './use-auth';

// Placeholder: extend with actual feature flag API
export function useFeatureFlag(flag: string): boolean {
  void flag;
  const { user } = useAuth();
  if (!user) return false;
  return false;
}
