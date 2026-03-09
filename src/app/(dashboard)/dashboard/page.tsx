'use client';

import React from 'react';
import Link from 'next/link';
import { usePrograms } from '@/features/programs/hooks/use-programs';
import { useProgram } from '@/features/programs/hooks/use-program';
import { useActiveProgram } from '@/hooks/use-active-program';
import type { Program } from '@/models/programs/programs.schema';
import { PageHeader } from '@/components/layout/page-header';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import { Plus } from 'lucide-react';

/** Same logic as TR[AI]NER Mobile HomeScreen: pick the program to highlight (active by last use, else most recent start_date). */
function useFeaturedProgram(
  programs: Program[],
  activeProgramUuid: string | undefined,
  isDataReady: boolean
): Program | undefined {
  return React.useMemo(() => {
    if (!isDataReady) return undefined;

    const programsList: Program[] = Array.isArray(programs) ? programs : [];
    if (!programsList.length) return undefined;

    const activePrograms = programsList.filter(
      (p) => !p.template && !(p as Program & { deleted_at?: string }).deleted_at
    );
    const candidates = activePrograms.length > 0 ? activePrograms : programsList;

    if (activeProgramUuid) {
      const active = candidates.find((p) => p.uuid === activeProgramUuid);
      if (active) return active;
    }

    return candidates.reduce<Program | undefined>((latest, current) => {
      if (!latest) return current;
      const latestTime = Date.parse(latest.start_date ?? '') || 0;
      const currentTime = Date.parse(current.start_date ?? '') || 0;
      return currentTime >= latestTime ? current : latest;
    }, undefined);
  }, [programs, activeProgramUuid, isDataReady]);
}

export default function DashboardPage() {
  const { programs, isLoading: programsLoading, error } = usePrograms();
  const { activeProgram, isReady: activeProgramReady } = useActiveProgram();

  const isDataReady = activeProgramReady && !programsLoading;
  const featuredProgram = useFeaturedProgram(
    programs,
    activeProgram?.uuid,
    isDataReady
  );

  const { program: featuredProgramDetails, isLoading: detailsLoading } = useProgram(
    featuredProgram?.uuid ?? ''
  );

  const displayProgram = featuredProgramDetails;
  const showFeaturedLoading = Boolean(featuredProgram && detailsLoading);

  const showEmptyState = !programsLoading && !showFeaturedLoading && !displayProgram;

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Dashboard"
        description="Overview of your activity"
        actions={
          <Link
            href="/programs/create-ai"
            className={cn(
              buttonVariants(),
              'inline-flex items-center gap-2 no-underline'
            )}
          >
            <Plus className="size-4" />
            New program
          </Link>
        }
      />

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load dashboard data.
        </div>
      )}

      {programsLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {showFeaturedLoading && (
            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-center py-8">
                <Spinner />
              </div>
            </section>
          )}
          {displayProgram && !showFeaturedLoading && (
            <section>
              <h2 className="mb-4 text-sm font-semibold text-foreground">Today&apos;s workout</h2>
              <Link
                href={`/programs/${displayProgram.uuid}`}
                className="block rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{displayProgram.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {displayProgram.weeks} weeks · {displayProgram.days_per_week} days per week
                    </p>
                  </div>
                  <span className="text-sm font-medium text-primary">Open →</span>
                </div>
              </Link>
            </section>
          )}
          {showEmptyState && (
            <section className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
              <p className="text-sm font-medium text-foreground">Create a program to get started.</p>
              <Link href="/programs" className={cn(buttonVariants(), 'mt-4')}>
                Go to Programs
              </Link>
            </section>
          )}
        </>
      )}
    </div>
  );
}
