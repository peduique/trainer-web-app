import { apiClient } from '@/lib/api/client';
import type { HistoryDate, HistoryWorkout } from './history.schema';

export async function fetchHistoryDates(): Promise<HistoryDate[]> {
  return apiClient.get<HistoryDate[]>('/api/history');
}

export async function fetchHistoryByDate(date: string): Promise<HistoryWorkout[]> {
  return apiClient.get<HistoryWorkout[]>(`/api/history/workouts?date=${date}`);
}
