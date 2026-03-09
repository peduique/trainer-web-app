import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTickets, fetchTicket, fetchTicketComments, createTicket, markTicketAsRead } from '@/models/support/support.api';

export const TICKETS_QUERY_KEY = ['support', 'tickets'] as const;

export function useTickets() {
  const { data, isLoading, error } = useQuery({
    queryKey: TICKETS_QUERY_KEY,
    queryFn: fetchTickets,
  });
  const unreadCount = (data ?? []).filter((t) => !t.read).length;
  return { tickets: data ?? [], isLoading, error, unreadCount };
}

export function useTicket(gid: string) {
  return useQuery({
    queryKey: ['support', 'tickets', gid],
    queryFn: () => fetchTicket(gid),
    enabled: !!gid,
  });
}

export function useTicketComments(gid: string) {
  return useQuery({
    queryKey: ['support', 'tickets', gid, 'comments'],
    queryFn: () => fetchTicketComments(gid),
    enabled: !!gid,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEY }),
  });
}

export function useMarkAsRead(gid: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markTicketAsRead(gid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets', gid] });
    },
  });
}
