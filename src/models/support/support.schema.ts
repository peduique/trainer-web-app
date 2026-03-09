import { z } from 'zod';

export const ticketCategorySchema = z.enum(['bug', 'feature_request', 'question']);
export type TicketCategory = z.infer<typeof ticketCategorySchema>;

export const ticketCommentSchema = z.object({
  gid: z.string(),
  text: z.string(),
  created_at: z.string(),
  created_by: z.object({ name: z.string().nullable() }).optional(),
});

export type TicketComment = z.infer<typeof ticketCommentSchema>;

export const ticketSchema = z.object({
  gid: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  category: ticketCategorySchema.optional(),
  created_at: z.string(),
  read: z.boolean().optional(),
  attachments: z.array(z.object({ url: z.string(), name: z.string() })).optional(),
});

export type Ticket = z.infer<typeof ticketSchema>;

export const createTicketSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: ticketCategorySchema,
  screenshot: z.any().optional(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
