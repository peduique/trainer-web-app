'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { logout } from '@/models/auth/auth.api';

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      // Clear all queries and redirect to login
      await queryClient.clear();
      router.push('/login');
    },
    onError: async () => {
      // Even if logout fails, clear local state and redirect
      await queryClient.clear();
      router.push('/login');
    },
  });
}
