'use client';
import Link from 'next/link';
import { ProgramsList } from '@/features/programs/components/programs-list';
import { PageHeader } from '@/components/layout/page-header';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ProgramsPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Programs"
        description="Your training programs"
        actions={
          <div className="flex gap-2">
            <Link
              href="/programs/create-ai"
              className={cn(buttonVariants(), 'inline-flex items-center gap-2 no-underline')}
            >
              Generate with AI
            </Link>
            {/* Create Manually – hidden for now
            <Link
              href="/programs/create-manual"
              className={cn(buttonVariants({ variant: 'outline' }), 'inline-flex items-center gap-2 no-underline')}
            >
              Create Manually
            </Link>
            */}
          </div>
        }
      />
      <ProgramsList />
    </div>
  );
}
