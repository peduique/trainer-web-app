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
      <Card className="p-6 transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">{program.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {program.weeks} weeks · {program.days_per_week} days/week
            </p>
          </div>
          {program.template && <Badge variant="info">Template</Badge>}
        </div>

        {progress && (
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress.percent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-primary"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {progress.workouts_completed} / {progress.total_workouts} workouts
            </p>
          </div>
        )}
      </Card>
    </Link>
  );
}
