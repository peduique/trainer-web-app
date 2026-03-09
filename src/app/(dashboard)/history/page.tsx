'use client';
import { useWorkoutHistory } from '@/features/history/hooks/use-workout-history';
import { HistoryCalendar } from '@/features/history/components/history-calendar';
import { HistoryDayDetail } from '@/features/history/components/history-day-detail';
import { PageHeader } from '@/components/layout/page-header';

export default function HistoryPage() {
  const { dates, isLoadingDates: _isLoadingDates, workouts, isLoadingWorkouts, selectedDate, setSelectedDate } = useWorkoutHistory();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Workout History" description="Review your past training sessions" />
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <HistoryCalendar
          dates={dates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
        <HistoryDayDetail
          workouts={workouts}
          isLoading={isLoadingWorkouts}
          date={selectedDate}
        />
      </div>
    </div>
  );
}
