import type { WorkoutExercise, Superset } from '@/models/workouts/workouts.schema';
import { ExerciseRow } from './exercise-row';

interface Props {
  superset: Superset;
  exercises: WorkoutExercise[];
  onExercisePress?: (id: number) => void;
}

export function CircuitGroup({ superset, exercises, onExercisePress }: Props) {
  return (
    <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
        {superset.name ?? 'Circuit'}
      </p>
      <div className="flex flex-col gap-1">
        {exercises.map((ex) => (
          <ExerciseRow key={ex.id} exercise={ex} onPress={onExercisePress} />
        ))}
      </div>
    </div>
  );
}
