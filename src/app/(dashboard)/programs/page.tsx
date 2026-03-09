'use client';
import Link from 'next/link';
import { ProgramsList } from '@/features/programs/components/programs-list';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';

export default function ProgramsPage() {
  return (
    <div>
      <PageHeader
        title="Programs"
        description="Your training programs"
        actions={
          <div className="flex gap-2">
            <Link href="/programs/create-ai">
              <Button>Generate with AI</Button>
            </Link>
            <Link href="/programs/create-manual">
              <Button variant="outline">Create Manually</Button>
            </Link>
          </div>
        }
      />
      <ProgramsList />
    </div>
  );
}
