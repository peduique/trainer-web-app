import type { Metadata } from 'next';
import { CreateProgramAiForm } from '@/features/programs/components/create-program-ai-form';
import { PageHeader } from '@/components/layout/page-header';

export const metadata: Metadata = { title: 'Generate Program with AI' };

export default function CreateAiPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Custom Program"
        breadcrumbs={[{ label: 'Programs', href: '/programs' }, { label: 'Custom Program' }]}
        description="Generate an AI-powered plan built for your personal goals and target muscles."
      />
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
        <CreateProgramAiForm />
      </div>
    </div>
  );
}
