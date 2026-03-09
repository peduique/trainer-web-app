import type { Metadata } from 'next';
import { CreateProgramManualForm } from '@/features/programs/components/create-program-manual-form';
import { PageHeader } from '@/components/layout/page-header';

export const metadata: Metadata = { title: 'Create Program' };

export default function CreateManualPage() {
  return (
    <div className="mx-auto max-w-md">
      <PageHeader
        title="Create Program"
        breadcrumbs={[{ label: 'Programs', href: '/programs' }, { label: 'Create Manually' }]}
      />
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <CreateProgramManualForm />
      </div>
    </div>
  );
}
