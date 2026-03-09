import { apiClient } from '@/lib/api/client';
import type { Ticket, TicketComment } from './support.schema';

export async function fetchTickets(): Promise<Ticket[]> {
  return apiClient.get<Ticket[]>('/api/support/reports');
}

export async function fetchTicket(gid: string): Promise<Ticket> {
  return apiClient.get<Ticket>(`/api/support/reports/${gid}`);
}

export async function fetchTicketComments(gid: string): Promise<TicketComment[]> {
  return apiClient.get<TicketComment[]>(`/api/support/reports/${gid}/comments`);
}

export async function createTicket(data: {
  title: string;
  description: string;
  category: string;
  screenshot?: File;
}): Promise<Ticket> {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('category', data.category);
  if (data.screenshot) formData.append('screenshot', data.screenshot);
  return apiClient.upload<Ticket>('/api/support/reports', formData);
}

export async function markTicketAsRead(gid: string): Promise<void> {
  return apiClient.put<void>(`/api/support/reports/${gid}/read`);
}
