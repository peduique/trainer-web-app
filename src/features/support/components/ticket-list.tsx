'use client';
import Link from 'next/link';
import { useTickets } from '@/features/support/hooks/use-tickets';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

const CATEGORY_LABELS: Record<string, string> = {
  bug: 'Bug',
  feature_request: 'Feature Request',
  question: 'Question',
};

const CATEGORY_VARIANTS: Record<string, 'error' | 'info' | 'warning'> = {
  bug: 'error',
  feature_request: 'info',
  question: 'warning',
};

export function TicketList() {
  const { tickets, isLoading, error, unreadCount: _unreadCount } = useTickets();

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (error) return <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">Failed to load tickets.</div>;

  if (tickets.length === 0) {
    return (
      <EmptyState
        title="No support tickets"
        description="Report a bug or request a feature."
        action={<Link href="/support/new"><Button>Create Ticket</Button></Link>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tickets.map((ticket) => (
        <Link key={ticket.gid} href={`/support/${ticket.gid}`} className="block">
          <div className={`rounded-xl border bg-white p-4 transition-shadow hover:shadow-md ${!ticket.read ? 'border-blue-200 bg-blue-50/30' : ''}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {!ticket.read && <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />}
                  <p className="truncate font-medium text-gray-900">{ticket.name}</p>
                </div>
                <p className="mt-0.5 text-xs text-gray-400">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </p>
              </div>
              {ticket.category && (
                <Badge variant={CATEGORY_VARIANTS[ticket.category] ?? 'default'}>
                  {CATEGORY_LABELS[ticket.category] ?? ticket.category}
                </Badge>
              )}
            </div>
            {ticket.description && (
              <p className="mt-2 line-clamp-2 text-sm text-gray-500">{ticket.description}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
