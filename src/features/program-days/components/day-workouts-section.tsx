'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useWorkoutActions } from '@/features/program-days/hooks/use-workout-actions';
import { WorkoutBlock } from './workout-block';
import { ExercisePickerModal } from './exercise-picker-modal';
import { DayActionsMenu } from './day-actions-menu';
import { Button } from '@/components/ui/button';
import { addExercisesToWorkout } from '@/models/exercises/exercises.api';
import { programQueryKey } from '@/features/programs/hooks/use-program';
import type { ProgramDay } from '@/models/programs/programs.schema';
import type { ProgramDetail } from '@/models/programs/programs.schema';

interface Props {
  day: ProgramDay;
  programId: number;
  programUuid: string;
  program: ProgramDetail | null;
}

export function DayWorkoutsSection({ day, programId, programUuid, program }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { complete, undo, add, addBlock } = useWorkoutActions({
    programId,
    programUuid,
    dayId: day.id,
    program,
    day,
  });
  const [pickerForWorkoutId, setPickerForWorkoutId] = useState<number | null>(null);

  const dayWorkouts = (day.day_workouts ?? []).sort((a, b) => a.position - b.position);
  const lastBlockId = dayWorkouts.length > 0 ? dayWorkouts[dayWorkouts.length - 1].id : undefined;

  const handleAddExercises = async (exerciseIds: number[]) => {
    if (!pickerForWorkoutId) return;
    await addExercisesToWorkout(pickerForWorkoutId, exerciseIds);
    queryClient.invalidateQueries({ queryKey: programQueryKey(programUuid) });
    setPickerForWorkoutId(null);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
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
        <DayActionsMenu
          variant="inline"
          onAddBlock={() => addBlock.mutate()}
          onAddWorkout={() => add.mutate(lastBlockId)}
          addBlockDisabled={addBlock.isPending || !program}
          addWorkoutDisabled={add.isPending || dayWorkouts.length === 0}
          addBlockPending={addBlock.isPending}
          addPending={add.isPending}
        />
      </div>

      {dayWorkouts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-10 text-center">
          <p className="text-sm text-muted-foreground">No blocks yet. Add a block, then add workouts to it.</p>
          <Button
            className="mt-3"
            size="sm"
            variant="outline"
            onClick={() => addBlock.mutate()}
            disabled={addBlock.isPending || !program}
          >
            + Add Block
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {dayWorkouts.map((dw, index) => (
            <WorkoutBlock
              key={dw.id}
              dayWorkout={dw}
              blockIndex={index}
              totalBlocks={dayWorkouts.length}
              programUuid={programUuid}
              dayId={day.id}
              onAddWorkout={() => add.mutate(dw.id)}
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
