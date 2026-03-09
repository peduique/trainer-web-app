'use client';
import type { DayWorkout } from '@/models/workouts/workouts.schema';
import { ExerciseRow } from './exercise-row';
import { CircuitGroup } from './circuit-group';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Props {
  dayWorkout: DayWorkout;
  blockIndex: number;
  totalBlocks: number;
  programUuid: string;
  dayId: number;
  onAddWorkout: () => void;
  onComplete: (workoutId: number) => void;
  onUndo: (workoutId: number) => void;
  onExercisePress?: (exerciseId: number) => void;
  onAddExercises?: (workoutId: number) => void;
}

export function WorkoutBlock({
  dayWorkout,
  blockIndex,
  totalBlocks,
  programUuid,
  dayId,
  onAddWorkout,
  onComplete,
  onUndo,
  onExercisePress,
  onAddExercises,
}: Props) {
  const workouts = dayWorkout.workouts ?? [];
  const showBlockHeader = totalBlocks > 1;

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      {showBlockHeader && (
        <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Block {blockIndex + 1}
          </p>
        </div>
      )}
      {workouts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center">
          <p className="text-sm text-muted-foreground">No workouts in this block.</p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            onClick={onAddWorkout}
          >
            + Add Workout
          </Button>
        </div>
      ) : (
        <>
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
                    <ExerciseRow
                      key={ex.id}
                      exercise={ex}
                      programUuid={programUuid}
                      dayId={dayId}
                      onPress={onExercisePress}
                    />
                  ))}
                  {supersets.map((superset) => {
                    const sExercises = circuitExercises.filter((e) => e.superset_id === superset.id);
                    return (
                      <CircuitGroup
                        key={superset.id}
                        superset={superset}
                        exercises={sExercises}
                        programUuid={programUuid}
                        dayId={dayId}
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
          <Button
            size="sm"
            variant="ghost"
            className="mt-2 text-muted-foreground"
            onClick={onAddWorkout}
          >
            + Add Workout to block
          </Button>
        </>
      )}
    </div>
  );
}
