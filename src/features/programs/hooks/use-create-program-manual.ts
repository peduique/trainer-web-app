'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createProgramManual } from '@/models/programs/programs.api';
import { PROGRAMS_QUERY_KEY } from './use-programs';
import type { CreateProgramManualInput } from '@/models/programs/programs.schema';

export function useCreateProgramManual() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateProgramManualInput) => createProgramManual(data),
    onSuccess: (program) => {
      queryClient.invalidateQueries({ queryKey: PROGRAMS_QUERY_KEY });
      router.push(`/programs/${program.uuid}`);
    },
  });
}
