'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signup } from '@/models/auth/auth.api';
import { AUTH_QUERY_KEY } from '@/hooks/use-auth';
import type { SignupInput } from '@/models/auth/auth.schema';

export function useSignup() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignupInput) => signup(data),
    onSuccess: (res) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, res.user);
      router.push('/dashboard');
    },
  });
}
