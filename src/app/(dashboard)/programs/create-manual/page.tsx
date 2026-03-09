import type { Metadata } from 'next';
import { CreateProgramManualForm } from '@/features/programs/components/create-program-manual-form';
import { PageHeader } from '@/components/layout/page-header';

export const metadata: Metadata = { title: 'Create Program' };

export default function CreateManualPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Create Program"
        breadcrumbs={[{ label: 'Programs', href: '/programs' }, { label: 'Create Manually' }]}
      />
      <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm">
        <CreateProgramManualForm />
      </div>
    </div>
  );
}
