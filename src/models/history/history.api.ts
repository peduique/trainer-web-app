import { apiClient } from '@/lib/api/client';
import type { HistoryDate, HistoryWorkout } from './history.schema';

export async function fetchHistoryDates(): Promise<HistoryDate[]> {
  return apiClient.get<HistoryDate[]>('/history');
}

export async function fetchHistoryByDate(date: string): Promise<HistoryWorkout[]> {
  return apiClient.post<HistoryWorkout[]>('/history/workouts', { date });
}
