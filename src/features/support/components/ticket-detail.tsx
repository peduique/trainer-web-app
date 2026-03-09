'use client';
import { useEffect, useRef } from 'react';
import { useTicket, useTicketComments, useMarkAsRead } from '@/features/support/hooks/use-tickets';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { PageHeader } from '@/components/layout/page-header';

const CATEGORY_LABELS: Record<string, string> = {
  bug: 'Bug',
  feature_request: 'Feature Request',
  question: 'Question',
};

interface Props {
  gid: string;
}

export function TicketDetail({ gid }: Props) {
  const { data: ticket, isLoading } = useTicket(gid);
  const { data: comments = [] } = useTicketComments(gid);
  const markAsRead = useMarkAsRead(gid);
  const mutateRef = useRef(markAsRead.mutate);
  mutateRef.current = markAsRead.mutate;

  useEffect(() => {
    if (ticket && !ticket.read) mutateRef.current();
  }, [ticket?.gid]);

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (!ticket) return <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">Ticket not found.</div>;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={ticket.name}
        breadcrumbs={[{ label: 'Support', href: '/support' }, { label: ticket.name }]}
        actions={
          ticket.category ? (
            <Badge variant={ticket.category === 'bug' ? 'error' : ticket.category === 'feature_request' ? 'info' : 'warning'}>
              {CATEGORY_LABELS[ticket.category]}
            </Badge>
          ) : undefined
        }
      />

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-xs text-gray-400">{new Date(ticket.created_at).toLocaleDateString()}</p>
        {ticket.description && <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{ticket.description}</p>}
        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {ticket.attachments.map((att, i) => (
              <a key={i} href={att.url} target="_blank" rel="noopener noreferrer" className="rounded border px-3 py-1 text-xs text-blue-600 hover:underline">
                {att.name}
              </a>
            ))}
          </div>
        )}
      </div>

      {comments.length > 0 && (
        <div>
          <h3 className="mb-3 font-semibold text-gray-900">Activity</h3>
          <div className="flex flex-col gap-3">
            {comments.map((comment) => (
              <div key={comment.gid} className="rounded-xl border bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-600">{comment.created_by?.name ?? 'Team'}</p>
                  <p className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</p>
                </div>
                <p className="mt-2 text-sm text-gray-700">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
