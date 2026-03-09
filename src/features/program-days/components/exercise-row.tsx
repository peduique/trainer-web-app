'use client';
import { Badge } from '@/components/ui/badge';
import type { WorkoutExercise } from '@/models/workouts/workouts.schema';
import { useScoreActions } from '@/features/exercises/hooks/use-save-score';
import { cn } from '@/lib/utils';

interface Props {
  exercise: WorkoutExercise;
  programUuid?: string;
  dayId?: number;
  onPress?: (id: number) => void;
}

export function ExerciseRow({ exercise, programUuid, dayId, onPress }: Props) {
  const canToggle = programUuid != null && dayId != null;
  const { toggleComplete } = useScoreActions({ programUuid: programUuid ?? '', dayId: dayId ?? 0 });

  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canToggle) return;
    toggleComplete.mutate({
      workoutExerciseId: exercise.id,
      currentlyFinished: exercise.finished,
    });
  };

  const handleRowClick = () => onPress?.(exercise.id);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRowClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={handleKeyDown}
      className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-muted/50"
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={exercise.finished}
        aria-label={exercise.finished ? 'Mark as incomplete' : 'Mark as complete'}
        onClick={handleToggleClick}
        disabled={!canToggle || toggleComplete.isPending}
        className={cn(
          'h-3 w-3 flex-shrink-0 rounded-full border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          exercise.finished
            ? 'border-green-500 bg-green-500'
            : 'border-muted-foreground/40 bg-muted/50 hover:border-primary',
        )}
      />
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{exercise.exercise.name}</p>
        {(exercise.sets || exercise.reps) && (
          <p className="text-xs text-muted-foreground">
            {exercise.sets ? `${exercise.sets} sets` : ''}
            {exercise.sets && exercise.reps ? ' · ' : ''}
            {exercise.reps ?? ''}
          </p>
        )}
      </div>
    </div>
  );
}
