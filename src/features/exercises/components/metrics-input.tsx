'use client';
import { useState } from 'react';
import type { MetricKind } from '@/models/scores/scores.schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SetEntry {
  setNumber: number;
  value: string;
}

interface Props {
  kind: MetricKind;
  unit?: string | null;
  onSave: (setNumber: number, value: number) => void;
  initialSets?: number;
}

export function MetricsInput({ kind, unit, onSave, initialSets = 1 }: Props) {
  const [sets, setSets] = useState<SetEntry[]>(
    Array.from({ length: initialSets }, (_, i) => ({ setNumber: i + 1, value: '' }))
  );

  const label = {
    reps: 'Reps',
    weight: `Weight${unit ? ` (${unit})` : ''}`,
    time: 'Time (seconds)',
    rounds: 'Rounds',
    calories: 'Calories',
    distance: `Distance${unit ? ` (${unit})` : ''}`,
  }[kind];

  const handleChange = (index: number, value: string) => {
    setSets((prev) => prev.map((s, i) => (i === index ? { ...s, value } : s)));
  };

  const handleBlur = (index: number) => {
    const val = parseFloat(sets[index].value);
    if (!isNaN(val)) onSave(sets[index].setNumber, val);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      {sets.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-12 text-xs text-gray-400">Set {s.setNumber}</span>
          <Input
            type="number"
            value={s.value}
            onChange={(e) => handleChange(i, e.target.value)}
            onBlur={() => handleBlur(i)}
            placeholder="0"
            className="w-24"
          />
        </div>
      ))}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          type="button"
          onClick={() => setSets((prev) => [...prev, { setNumber: prev.length + 1, value: '' }])}
        >
          + Add Set
        </Button>
        {sets.length > 1 && (
          <Button
            size="sm"
            variant="ghost"
            type="button"
            onClick={() => setSets((prev) => prev.slice(0, -1))}
          >
            – Remove Set
          </Button>
        )}
      </div>
    </div>
  );
}
