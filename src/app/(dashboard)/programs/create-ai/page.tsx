import type { Metadata } from 'next';
import { CreateProgramAiForm } from '@/features/programs/components/create-program-ai-form';
import { PageHeader } from '@/components/layout/page-header';

export const metadata: Metadata = { title: 'Generate Program with AI' };

export default function CreateAiPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Generate with AI"
        breadcrumbs={[{ label: 'Programs', href: '/programs' }, { label: 'Generate with AI' }]}
        description="Tell us your goals and we'll build a custom program."
      />
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <CreateProgramAiForm />
      </div>
    </div>
  );
}
