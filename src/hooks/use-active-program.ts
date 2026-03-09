'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'active_program';

export interface ActiveProgram {
  uuid: string;
  currentWorkoutId?: number;
  nextWorkoutId?: number;
}

/** Persist active program (call when user completes a workout/exercise) */
export function saveActiveProgram(data: ActiveProgram): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Read + reactive state. Same contract as TR[AI]NER Mobile useActiveProgram. */
export function useActiveProgram() {
  const [activeProgram, setActiveProgram] = useState<ActiveProgram | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsReady(true);
      return;
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setActiveProgram(JSON.parse(raw) as ActiveProgram);
      } catch {
        setActiveProgram(null);
      }
    }
    setIsReady(true);
  }, []);

  const save = useCallback((data: ActiveProgram) => {
    setActiveProgram(data);
    saveActiveProgram(data);
  }, []);

  return { activeProgram, isReady, save };
}
