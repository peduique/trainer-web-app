import type { Metadata } from 'next';
import { CreateTicketForm } from '@/features/support/components/create-ticket-form';
import { PageHeader } from '@/components/layout/page-header';

export const metadata: Metadata = { title: 'New Support Ticket' };

export default function NewTicketPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="New Ticket"
        breadcrumbs={[{ label: 'Support', href: '/support' }, { label: 'New Ticket' }]}
      />
      <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm">
        <CreateTicketForm />
      </div>
    </div>
  );
}
