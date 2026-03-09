import { TicketDetail } from '@/features/support/components/ticket-detail';

interface Props {
  params: Promise<{ ticketId: string }>;
}

export default async function TicketDetailPage({ params }: Props) {
  const { ticketId } = await params;
  return <TicketDetail gid={ticketId} />;
}
