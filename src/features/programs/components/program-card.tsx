import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Program } from '@/models/programs/programs.schema';

interface Props {
  program: Program;
}

export function ProgramCard({ program }: Props) {
  const progress = program.current_progress;

  return (
    <Link href={`/programs/${program.uuid}`} className="block">
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="truncate font-semibold text-gray-900">{program.name}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {program.weeks} weeks · {program.days_per_week} days/week
            </p>
          </div>
          {program.template && <Badge variant="info">Template</Badge>}
        </div>

        {progress && (
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{progress.percent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200">
              <div
                className="h-1.5 rounded-full bg-blue-600"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              {progress.workouts_completed} / {progress.total_workouts} workouts
            </p>
          </div>
        )}
      </Card>
    </Link>
  );
}
