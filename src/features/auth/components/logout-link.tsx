'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '@/models/auth/auth.api';
import { AUTH_QUERY_KEY } from '@/hooks/use-auth';

export function LogoutLink() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
      window.location.href = '/login';
    },
  });

  return (
    <button onClick={() => mutate()} className="text-sm text-gray-500 hover:text-gray-900">
      Sign out
    </button>
  );
}
