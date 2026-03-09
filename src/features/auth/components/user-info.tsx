import { useAuth } from '@/hooks/use-auth';

export function UserInfo() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <span className="text-sm text-gray-500">Loading...</span>;
  if (!user) return null;
  return <span className="text-sm font-medium">{user.name ?? user.email}</span>;
}
