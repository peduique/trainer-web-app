'use client';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  initialNotes?: string | null;
  label?: string;
  onSave: (notes: string) => void;
  readOnly?: boolean;
}

export function ExerciseNotes({ initialNotes, label = 'Notes', onSave, readOnly = false }: Props) {
  const [value, setValue] = useState(initialNotes ?? '');

  return (
    <Textarea
      label={label}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onSave(value)}
      readOnly={readOnly}
      placeholder="Add notes..."
    />
  );
}
