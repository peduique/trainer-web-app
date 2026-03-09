import { Spinner } from '@/components/ui/spinner';
import type { HistoryWorkout } from '@/models/history/history.schema';

interface Props {
  workouts: HistoryWorkout[];
  isLoading: boolean;
  date: string | null;
}

export function HistoryDayDetail({ workouts, isLoading, date }: Props) {
  if (!date) {
    return <p className="text-center text-sm text-gray-400">Select a date to see workouts.</p>;
  }

  if (isLoading) return <div className="flex justify-center py-4"><Spinner /></div>;

  if (workouts.length === 0) {
    return <p className="text-sm text-gray-400">No completed workouts on this date.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-gray-900">
        {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </h3>
      {workouts.map((workout) => (
        <div key={workout.id} className="rounded-xl border bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900">{workout.name}</p>
            <span className="text-xs text-gray-400">{workout.exercises_count} exercises</span>
          </div>
        </div>
      ))}
    </div>
  );
}
