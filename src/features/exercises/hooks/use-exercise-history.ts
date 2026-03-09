'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchExerciseHistory } from '@/models/scores/scores.api';
import { useState } from 'react';

export function useExerciseHistory(exerciseId: number) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['exercise-history', exerciseId, page],
    queryFn: () => fetchExerciseHistory(exerciseId, page),
    enabled: !!exerciseId,
  });

  return {
    entries: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    page,
    setPage,
  };
}
