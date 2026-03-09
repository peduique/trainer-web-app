'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDayDetail } from '@/features/program-days/hooks/use-day-detail';
import { useWorkoutActions } from '@/features/program-days/hooks/use-workout-actions';
import { useProgram } from '@/features/programs/hooks/use-program';
import { WorkoutBlock } from './workout-block';
import { ExercisePickerModal } from './exercise-picker-modal';
import { DayActionsMenu } from './day-actions-menu';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { addExercisesToWorkout } from '@/models/exercises/exercises.api';

interface Props {
  programUuid: string;
  dayId: number;
}

export function DayDetail({ programUuid, dayId }: Props) {
  const router = useRouter();
  const { program } = useProgram(programUuid);
  const programId = program?.id ?? 0;
  const { day, isLoading, error, refetch } = useDayDetail(programUuid, dayId);
  const { complete, undo, add, addBlock } = useWorkoutActions({
    programId,
    programUuid,
    dayId,
    program,
    day,
  });
  const [pickerForWorkoutId, setPickerForWorkoutId] = useState<number | null>(null);

  if (isLoading) {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  }

  if (error || !day) {
    return <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">Failed to load day details.</div>;
  }

  const dayWorkouts = (day.day_workouts ?? []).sort((a, b) => a.position - b.position);
  const lastBlockId = dayWorkouts.length > 0 ? dayWorkouts[dayWorkouts.length - 1].id : undefined;

  const handleAddExercises = async (exerciseIds: number[]) => {
    if (!pickerForWorkoutId) return;
    await addExercisesToWorkout(pickerForWorkoutId, exerciseIds);
    await refetch();
  };

  const handleAddWorkout = () => {
    add.mutate(lastBlockId);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Day ${day.day_number}`}
        description={day.title ?? `Week ${day.week}`}
        breadcrumbs={[
          { label: 'Programs', href: '/programs' },
          { label: 'Program', href: `/programs/${programUuid}` },
          { label: `Day ${day.day_number}` },
        ]}
      />

      {dayWorkouts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <p className="text-gray-400">No blocks yet. Add a block, then add workouts to it.</p>
          <Button className="mt-4" onClick={() => addBlock.mutate()} disabled={addBlock.isPending || !program}>
            Add Block
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
              dayId={dayId}
              onAddWorkout={() => add.mutate(dw.id)}
              onComplete={(workoutId) => complete.mutate(workoutId)}
              onUndo={(workoutId) => undo.mutate(workoutId)}
              onExercisePress={(exerciseId) =>
                router.push(`/programs/${programUuid}/days/${dayId}/exercises/${exerciseId}`)
              }
              onAddExercises={(workoutId) => setPickerForWorkoutId(workoutId)}
            />
          ))}
        </div>
      )}

      <DayActionsMenu
        variant="fab"
        onAddBlock={() => addBlock.mutate()}
        onAddWorkout={handleAddWorkout}
        addBlockDisabled={addBlock.isPending || !program}
        addWorkoutDisabled={add.isPending || dayWorkouts.length === 0}
        addBlockPending={addBlock.isPending}
        addPending={add.isPending}
      />

      {pickerForWorkoutId !== null && (
        <ExercisePickerModal
          open
          onClose={() => setPickerForWorkoutId(null)}
          onAdd={handleAddExercises}
        />
      )}
    </div>
  );
}
