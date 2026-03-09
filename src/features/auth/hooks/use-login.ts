'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login } from '@/models/auth/auth.api';
import { AUTH_QUERY_KEY } from '@/hooks/use-auth';
import type { LoginInput } from '@/models/auth/auth.schema';

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginInput) => login(data),
    onSuccess: (res) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, res.user);
      router.push('/dashboard');
    },
  });
}
