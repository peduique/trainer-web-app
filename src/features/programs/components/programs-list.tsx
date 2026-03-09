'use client';
import { usePrograms } from '@/features/programs/hooks/use-programs';
import { ProgramCard } from './program-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </div>
  );
}
