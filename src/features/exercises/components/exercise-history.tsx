'use client';
import { useExerciseHistory } from '@/features/exercises/hooks/use-exercise-history';
import { Spinner } from '@/components/ui/spinner';
import { Pagination } from '@/components/ui/pagination';

interface Props {
  exerciseId: number;
}

export function ExerciseHistory({ exerciseId }: Props) {
  const { entries, meta, isLoading, page, setPage } = useExerciseHistory(exerciseId);

  if (isLoading) return <div className="flex justify-center py-4"><Spinner /></div>;

  if (entries.length === 0) {
    return <p className="text-sm text-gray-400 italic">No history yet for this exercise.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => (
        <div key={entry.id} className="rounded-lg border p-3">
          <p className="text-xs text-gray-400">
            {new Date(entry.completed_at).toLocaleDateString()}
            {entry.workout_name ? ` · ${entry.workout_name}` : ''}
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            {entry.scores.map((score, i) => (
              <span key={i} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                {score.kind}: {score.value}{score.unit ? ` ${score.unit}` : ''}
              </span>
            ))}
          </div>
        </div>
      ))}
      {meta && (
        <Pagination
          currentPage={page}
          totalPages={meta.total_pages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
