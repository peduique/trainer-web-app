import type { Metadata } from 'next';
import { CreateTicketForm } from '@/features/support/components/create-ticket-form';
import { PageHeader } from '@/components/layout/page-header';

export const metadata: Metadata = { title: 'New Support Ticket' };

export default function NewTicketPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="New Ticket"
        breadcrumbs={[{ label: 'Support', href: '/support' }, { label: 'New Ticket' }]}
      />
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <CreateTicketForm />
      </div>
    </div>
  );
}
