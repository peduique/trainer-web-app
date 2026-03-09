'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createProgramAi, pollProgramGeneration } from '@/models/programs/programs.api';
import { PROGRAMS_QUERY_KEY } from './use-programs';
import type { CreateProgramAiInput, GenerationStatus } from '@/models/programs/programs.schema';

export function useCreateProgramAi() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus | null>(null);

  const poll = useCallback(async (generationUuid: string) => {
    const interval = setInterval(async () => {
      try {
        const status = await pollProgramGeneration(generationUuid);
        setGenerationStatus(status);
        if (status.status === 'completed' && status.program_uuid) {
          clearInterval(interval);
          queryClient.invalidateQueries({ queryKey: PROGRAMS_QUERY_KEY });
          router.push(`/programs/${status.program_uuid}`);
        } else if (status.status === 'failed') {
          clearInterval(interval);
        }
      } catch {
        clearInterval(interval);
      }
    }, 2000);
    return interval;
  }, [queryClient, router]);

  const mutation = useMutation({
    mutationFn: (data: CreateProgramAiInput) => createProgramAi(data),
    onSuccess: ({ uuid }) => {
      setGenerationStatus({ status: 'queued' });
      poll(uuid);
    },
  });

  return { ...mutation, generationStatus };
}
