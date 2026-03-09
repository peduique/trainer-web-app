import { Badge } from '@/components/ui/badge';
import type { WorkoutExercise } from '@/models/workouts/workouts.schema';

interface Props {
  exercise: WorkoutExercise;
  onPress?: (id: number) => void;
}

export function ExerciseRow({ exercise, onPress }: Props) {
  return (
    <button
      onClick={() => onPress?.(exercise.id)}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-gray-50"
    >
      <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${exercise.finished ? 'bg-green-500' : 'bg-gray-300'}`} />
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-gray-900">{exercise.exercise.name}</p>
        {(exercise.sets || exercise.reps) && (
          <p className="text-xs text-gray-400">
            {exercise.sets ? `${exercise.sets} sets` : ''}
            {exercise.sets && exercise.reps ? ' · ' : ''}
            {exercise.reps ?? ''}
          </p>
        )}
      </div>
      {exercise.finished && <Badge variant="success">Done</Badge>}
    </button>
  );
}
