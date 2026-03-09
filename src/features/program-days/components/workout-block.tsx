'use client';
import type { DayWorkout } from '@/models/workouts/workouts.schema';
import { ExerciseRow } from './exercise-row';
import { CircuitGroup } from './circuit-group';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Props {
  dayWorkout: DayWorkout;
  blockIndex: number;
  programUuid: string;
  dayId: number;
  onComplete: (workoutId: number) => void;
  onUndo: (workoutId: number) => void;
  onExercisePress?: (exerciseId: number) => void;
  onAddExercises?: (workoutId: number) => void;
}

export function WorkoutBlock({ dayWorkout, blockIndex, onComplete, onUndo, onExercisePress, onAddExercises }: Props) {
  const workouts = dayWorkout.workouts ?? [];
  const showBlockHeader = blockIndex > 0;

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      {showBlockHeader && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Block {blockIndex + 1}
        </p>
      )}
      {workouts.map((workout) => {
        const exercises = workout.workouts_exercises ?? [];
        const supersets = workout.supersets ?? [];
        const circuitExercises = exercises.filter((e) => e.superset_id != null);
        const regularExercises = exercises.filter((e) => e.superset_id == null);
        const isFinished = workout.finished;

        return (
          <div key={workout.id} className="mb-4 last:mb-0">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{workout.name}</h3>
                {isFinished && <Badge variant="success">Completed</Badge>}
              </div>
              <div className="flex items-center gap-1">
                {onAddExercises && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAddExercises(workout.id)}
                    className="text-muted-foreground"
                  >
                    + Exercises
                  </Button>
                )}
                <Button
                size="sm"
                variant={isFinished ? 'outline' : 'primary'}
                onClick={() => isFinished ? onUndo(workout.id) : onComplete(workout.id)}
                >
                  {isFinished ? 'Undo' : 'Complete'}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              {regularExercises.map((ex) => (
                <ExerciseRow key={ex.id} exercise={ex} onPress={onExercisePress} />
              ))}
              {supersets.map((superset) => {
                const sExercises = circuitExercises.filter((e) => e.superset_id === superset.id);
                return (
                  <CircuitGroup
                    key={superset.id}
                    superset={superset}
                    exercises={sExercises}
                    onExercisePress={onExercisePress}
                  />
                );
              })}
            </div>

            {exercises.length === 0 && (
              <p className="text-sm text-gray-400 italic">No exercises added yet.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
