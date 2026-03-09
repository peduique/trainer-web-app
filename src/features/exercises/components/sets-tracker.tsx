'use client';
import { MetricsInput } from './metrics-input';
import type { WorkoutExercise } from '@/models/workouts/workouts.schema';

interface Props {
  exercise: WorkoutExercise;
  onSave: (setNumber: number, value: number, kind: string) => void;
}

export function SetsTracker({ exercise, onSave }: Props) {
  const kinds: Array<{ kind: 'reps' | 'weight' | 'time' | 'rounds' | 'calories' | 'distance'; unit?: string }> = [
    { kind: 'weight', unit: 'kg' },
    { kind: 'reps' },
  ];

  return (
    <div className="flex flex-col gap-6 rounded-xl border bg-white p-4">
      <h3 className="font-semibold text-gray-900">Track Sets</h3>
      {kinds.map(({ kind, unit }) => (
        <MetricsInput
          key={kind}
          kind={kind}
          unit={unit}
          initialSets={exercise.sets ?? 3}
          onSave={(setNumber, value) => onSave(setNumber, value, kind)}
        />
      ))}
    </div>
  );
}
