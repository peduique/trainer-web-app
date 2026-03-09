import Link from 'next/link';
import { TicketList } from '@/features/support/components/ticket-list';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';

export default function SupportPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Support"
        description="Your bug reports and feature requests"
        actions={
          <Link href="/support/new">
            <Button>New Ticket</Button>
          </Link>
        }
      />
      <TicketList />
    </div>
  );
}
