'use client';
import { useState } from 'react';
import type { ProgramDay } from '@/models/programs/programs.schema';
import { ProgramDayCard } from './program-day-card';

interface Props {
  weeks: number;
  days: ProgramDay[];
  programUuid: string;
}

export function ProgramWeekTabs({ weeks, days, programUuid }: Props) {
  const [activeWeek, setActiveWeek] = useState(1);
  const weekDays = days.filter((d) => d.week === activeWeek);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 overflow-x-auto border-b">
        {Array.from({ length: weeks }, (_, i) => i + 1).map((w) => (
          <button
            key={w}
            onClick={() => setActiveWeek(w)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${
              activeWeek === w
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Week {w}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {weekDays.length > 0 ? (
          weekDays.map((day) => <ProgramDayCard key={day.id} day={day} programUuid={programUuid} />)
        ) : (
          <p className="col-span-full text-sm text-gray-400">No days scheduled for this week.</p>
        )}
      </div>
    </div>
  );
}
