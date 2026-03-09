'use client';
import { useProgram } from '@/features/programs/hooks/use-program';
import { ProgramWeekTabs } from './program-week-tabs';
import { Spinner } from '@/components/ui/spinner';
import { PageHeader } from '@/components/layout/page-header';

interface Props {
  uuid: string;
}

export function ProgramDetail({ uuid }: Props) {
  const { program, isLoading, error } = useProgram(uuid);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        Failed to load program.
      </div>
    );
  }

  const progress = program.current_progress;
  const days = program.program_days ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={program.name}
        breadcrumbs={[{ label: 'Programs', href: '/programs' }, { label: program.name }]}
        description={`${program.weeks} weeks · ${program.days_per_week} days/week`}
      />

      {progress && (
        <div className="rounded-xl border bg-white p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span className="text-gray-500">{progress.percent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            {progress.workouts_completed} / {progress.total_workouts} workouts completed
          </p>
        </div>
      )}

      <ProgramWeekTabs weeks={program.weeks} days={days} programUuid={uuid} />
    </div>
  );
}
