'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchHistoryDates, fetchHistoryByDate } from '@/models/history/history.api';
import { useState } from 'react';

export const HISTORY_DATES_QUERY_KEY = ['history', 'dates'] as const;

export function useWorkoutHistory() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const datesQuery = useQuery({
    queryKey: HISTORY_DATES_QUERY_KEY,
    queryFn: fetchHistoryDates,
  });

  const workoutsQuery = useQuery({
    queryKey: ['history', 'workouts', selectedDate],
    queryFn: () => fetchHistoryByDate(selectedDate!),
    enabled: !!selectedDate,
  });

  return {
    dates: datesQuery.data ?? [],
    isLoadingDates: datesQuery.isLoading,
    workouts: workoutsQuery.data ?? [],
    isLoadingWorkouts: workoutsQuery.isLoading,
    selectedDate,
    setSelectedDate,
  };
}
