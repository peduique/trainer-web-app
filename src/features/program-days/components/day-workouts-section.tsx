'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useWorkoutActions } from '@/features/program-days/hooks/use-workout-actions';
import { WorkoutBlock } from './workout-block';
import { ExercisePickerModal } from './exercise-picker-modal';
import { Button } from '@/components/ui/button';
import { addExercisesToWorkout } from '@/models/exercises/exercises.api';
import { programQueryKey } from '@/features/programs/hooks/use-program';
import type { ProgramDay } from '@/models/programs/programs.schema';

interface Props {
  day: ProgramDay;
  programId: number;
  programUuid: string;
}

export function DayWorkoutsSection({ day, programId, programUuid }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { complete, undo, add } = useWorkoutActions({
    programId,
    programUuid,
    dayId: day.id,
  });
  const [pickerForWorkoutId, setPickerForWorkoutId] = useState<number | null>(null);

  const dayWorkouts = (day.day_workouts ?? []).sort((a, b) => a.position - b.position);

  const handleAddExercises = async (exerciseIds: number[]) => {
    if (!pickerForWorkoutId) return;
    await addExercisesToWorkout(pickerForWorkoutId, exerciseIds);
    queryClient.invalidateQueries({ queryKey: programQueryKey(programUuid) });
    setPickerForWorkoutId(null);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Day {day.day_number}
            {day.title && (
              <span className="ml-2 font-normal text-muted-foreground">
                {day.title}
              </span>
            )}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Week {day.week}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => add.mutate(undefined)}
          disabled={add.isPending}
        >
          + Add Workout
        </Button>
      </div>

      {dayWorkouts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-10 text-center">
          <p className="text-sm text-muted-foreground">No workouts in this day.</p>
          <Button className="mt-3" size="sm" variant="outline" onClick={() => add.mutate(undefined)}>
            Add Workout
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {dayWorkouts.map((dw, index) => (
            <WorkoutBlock
              key={dw.id}
              dayWorkout={dw}
              blockIndex={index}
              programUuid={programUuid}
              dayId={day.id}
              onComplete={(workoutId) => complete.mutate(workoutId)}
              onUndo={(workoutId) => undo.mutate(workoutId)}
              onExercisePress={(exerciseId) =>
                router.push(
                  `/programs/${programUuid}/days/${day.id}/exercises/${exerciseId}`
                )
              }
              onAddExercises={(workoutId) => setPickerForWorkoutId(workoutId)}
            />
          ))}
        </div>
      )}

      {pickerForWorkoutId !== null && (
        <ExercisePickerModal
          open
          onClose={() => setPickerForWorkoutId(null)}
          onAdd={handleAddExercises}
        />
      )}
    </section>
  );
}
