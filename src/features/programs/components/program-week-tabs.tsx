'use client';
import { useState } from 'react';
import type { ProgramDay } from '@/models/programs/programs.schema';
import type { ProgramDetail } from '@/models/programs/programs.schema';
import { DayWorkoutsSection } from '@/features/program-days/components/day-workouts-section';

interface Props {
  weeks: number;
  days: ProgramDay[];
  programId: number;
  programUuid: string;
  program: ProgramDetail | null;
}

export function ProgramWeekTabs({ weeks, days, programId, programUuid, program }: Props) {
  const [activeWeek, setActiveWeek] = useState(1);
  const weekDays = days.filter((d) => d.week === activeWeek);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1 overflow-x-auto border-b border-border pb-px">
        {Array.from({ length: weeks }, (_, i) => i + 1).map((w) => (
          <button
            key={w}
            onClick={() => setActiveWeek(w)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${
              activeWeek === w
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Week {w}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-10">
        {weekDays.length > 0 ? (
          weekDays.map((day) => (
            <div
              key={day.id}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <DayWorkoutsSection
                day={day}
                programId={programId}
                programUuid={programUuid}
                program={program}
              />
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No days scheduled for this week.
          </p>
        )}
      </div>
    </div>
  );
}
