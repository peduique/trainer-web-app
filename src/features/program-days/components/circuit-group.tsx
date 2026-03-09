import type { WorkoutExercise, Superset } from '@/models/workouts/workouts.schema';
import { ExerciseRow } from './exercise-row';

interface Props {
  superset: Superset;
  exercises: WorkoutExercise[];
  programUuid?: string;
  dayId?: number;
  onExercisePress?: (id: number) => void;
}

export function CircuitGroup({ superset, exercises, programUuid, dayId, onExercisePress }: Props) {
  return (
    <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/30 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {superset.name ?? 'Circuit'}
      </p>
      <div className="flex flex-col gap-1">
        {exercises.map((ex) => (
          <ExerciseRow
            key={ex.id}
            exercise={ex}
            programUuid={programUuid}
            dayId={dayId}
            onPress={onExercisePress}
          />
        ))}
      </div>
    </div>
  );
}
