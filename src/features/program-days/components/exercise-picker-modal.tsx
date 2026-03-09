'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useExerciseSearch } from '@/features/program-days/hooks/use-exercise-search';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (exerciseIds: number[]) => Promise<void>;
}

export function ExercisePickerModal({ open, onClose, onAdd }: Props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const { exercises, isLoading } = useExerciseSearch(query);

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = async () => {
    if (selected.size === 0) return;
    setIsAdding(true);
    try {
      await onAdd(Array.from(selected));
      setSelected(new Set());
      setQuery('');
      onClose();
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Exercises">
      <div className="flex flex-col gap-3">
        <Input
          placeholder="Search exercises..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="max-h-64 overflow-y-auto rounded-lg border">
          {isLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : exercises.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              {query ? 'No exercises found.' : 'Search for exercises to add.'}
            </p>
          ) : (
            <div className="divide-y">
              {exercises.map((ex) => {
                const bodyPartLabel = typeof ex.body_part === 'string'
                  ? ex.body_part
                  : (ex.body_part && typeof ex.body_part === 'object' && 'name' in ex.body_part
                    ? (ex.body_part as { name: string }).name
                    : null);
                return (
                  <button
                    key={ex.id}
                    onClick={() => toggle(ex.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${selected.has(ex.id) ? 'bg-blue-50' : ''}`}
                  >
                    <div className={`h-4 w-4 rounded border flex items-center justify-center ${selected.has(ex.id) ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                      {selected.has(ex.id) && '✓'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{ex.name}</p>
                      {bodyPartLabel && <p className="text-xs text-muted-foreground">{bodyPartLabel}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{selected.size} selected</span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleAdd} disabled={selected.size === 0 || isAdding}>
              {isAdding ? 'Adding...' : `Add ${selected.size > 0 ? selected.size : ''}`}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
