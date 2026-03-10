'use client';
import { usePrograms } from '@/features/programs/hooks/use-programs';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Dumbbell } from 'lucide-react';
import type { Program } from '@/models/programs/programs.schema';

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Extract progress numbers from program, handling both new and legacy fields.
 * Returns { completed, total } or null if progress is unavailable.
 */
function getProgressNumbers(program: Program): { completed: number; total: number } | null {
  const progress = program.current_progress;
  if (!progress) return null;

  const completed = progress.complete !== undefined ? progress.complete : progress.workouts_completed ?? 0;
  const total = progress.total !== undefined ? progress.total : progress.total_workouts ?? 0;

  return { completed, total };
}

export function ProgramsList() {
  const { programs, isLoading, error } = usePrograms();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load programs. Please try again.
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <EmptyState
        title="No programs yet"
        description="Create your first training program to get started."
        action={
          <div className="flex gap-3">
            <Link href="/programs/create-ai">
              <Button>Generate with AI</Button>
            </Link>
            <Link href="/programs/create-manual">
              <Button variant="outline">Create Manually</Button>
            </Link>
          </div>
        }
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Program</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Duration
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Created</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Progress
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-border">
            {programs.map((program) => {
              const progress = program.current_progress;
              const progressPercent = progress?.percent ?? 0;
              const progressNumbers = getProgressNumbers(program);

              return (
                <tr key={program.id} className="transition-colors hover:bg-muted/50">
                  {/* Program Name */}
                  <td className="px-6 py-4">
                    <Link
                      href={`/programs/${program.uuid}`}
                      className="group flex items-start gap-3"
                    >
                      <div className="mt-1 rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                        <Dumbbell className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {program.name}
                        </p>
                        {program.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {program.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </td>

                  {/* Duration */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{program.weeks}w</span>
                      <span>·</span>
                      <span>{program.days_per_week}d/w</span>
                    </div>
                  </td>

                  {/* Created At */}
                  <td className="px-6 py-4">
                    {program.start_date ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(program.start_date)}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>

                  {/* Progress */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{progressPercent}%</span>
                        </div>
                      </div>
                      <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      {progressNumbers && (
                        <p className="text-xs text-muted-foreground">
                          {progressNumbers.completed}/{progressNumbers.total}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
