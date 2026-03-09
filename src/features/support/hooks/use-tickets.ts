import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTickets,
  fetchTicket,
  fetchTicketComments,
  createTicket,
  markTicketAsRead,
  deleteTicket,
} from '@/models/support/support.api';
import type { CreateTicketParams } from '@/models/support/support.api';
import { useAuth } from '@/hooks/use-auth';
import type { Ticket } from '@/models/support/support.schema';

export const TICKETS_QUERY_KEY = ['support', 'tickets'] as const;

function ticketsQueryKey(userId: string) {
  return [...TICKETS_QUERY_KEY, userId] as const;
}

export function useTickets() {
  const { user } = useAuth();
  const userId = user?.id != null ? String(user.id) : '';

  const { data, isLoading, error } = useQuery({
    queryKey: ticketsQueryKey(userId),
    queryFn: () => fetchTickets(userId),
    enabled: !!userId,
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
  const { user } = useAuth();

  return useMutation({
    mutationFn: (params: Omit<CreateTicketParams, 'user'>) => {
      if (!user) throw new Error('Must be logged in to create a ticket');
      return createTicket({
        ...params,
        user: {
          id: String(user.id),
          email: user.email,
          name: user.name ?? undefined,
        },
      });
    },
    onSuccess: (newTicket, _params, _context) => {
      if (!user) return;
      const key = ticketsQueryKey(String(user.id));
      queryClient.setQueryData(key, (old: Ticket[] | undefined) => [...(old ?? []), newTicket]);
    },
  });
}

export function useMarkAsRead(gid: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: () => markTicketAsRead(gid),
    onMutate: async () => {
      if (!user) return undefined;
      const key = ticketsQueryKey(String(user.id));
      const ticketKey = ['support', 'tickets', gid] as const;
      await queryClient.cancelQueries({ queryKey: key });
      await queryClient.cancelQueries({ queryKey: ticketKey });
      const prevList = queryClient.getQueryData<Ticket[]>(key);
      const prevTicket = queryClient.getQueryData<Ticket>(ticketKey);
      queryClient.setQueryData(key, (old: Ticket[] | undefined) =>
        (old ?? []).map((t) => (t.gid === gid ? { ...t, read: true } : t))
      );
      queryClient.setQueryData(ticketKey, (old: Ticket | undefined) =>
        old ? { ...old, read: true } : old
      );
      return { prevList, prevTicket };
    },
    onError: (_err, _gid, context) => {
      if (!context) return;
      const key = ticketsQueryKey(String(user!.id));
      queryClient.setQueryData(key, context.prevList);
      queryClient.setQueryData(['support', 'tickets', gid], context.prevTicket);
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ticketsQueryKey(String(user.id)) });
        queryClient.invalidateQueries({ queryKey: ['support', 'tickets', gid] });
      }
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (gid: string) => deleteTicket(gid),
    onMutate: async (gid) => {
      if (!user) return undefined;
      const key = ticketsQueryKey(String(user.id));
      const ticketKey = ['support', 'tickets', gid] as const;
      await queryClient.cancelQueries({ queryKey: key });
      await queryClient.cancelQueries({ queryKey: ticketKey });
      const prevList = queryClient.getQueryData<Ticket[]>(key);
      const prevTicket = queryClient.getQueryData<Ticket>(ticketKey);
      queryClient.setQueryData(key, (old: Ticket[] | undefined) =>
        (old ?? []).filter((t) => t.gid !== gid)
      );
      queryClient.removeQueries({ queryKey: ticketKey });
      return { prevList, prevTicket };
    },
    onError: (_err, gid, context) => {
      if (!context) return;
      const key = ticketsQueryKey(String(user!.id));
      queryClient.setQueryData(key, context.prevList);
      queryClient.setQueryData(['support', 'tickets', gid], context.prevTicket);
    },
    onSettled: (_data, _error, gid) => {
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets', gid] });
      if (user) queryClient.invalidateQueries({ queryKey: ticketsQueryKey(String(user.id)) });
    },
  });
}
