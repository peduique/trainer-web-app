import { z } from 'zod';

export const subscriptionStatusSchema = z.enum(['active', 'canceled', 'past_due', 'unpaid', 'trialing']);
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

export const subscriptionSchema = z.object({
  id: z.string(),
  plan_name: z.enum(['basic', 'pro', 'premium']),
  status: subscriptionStatusSchema,
  provider: z.enum(['stripe', 'apple']).optional(),
  current_period_start: z.string().nullable().optional(),
  current_period_end: z.string().nullable().optional(),
  canceled_at: z.string().nullable().optional(),
});

export type Subscription = z.infer<typeof subscriptionSchema>;

export const planSchema = z.object({
  name: z.enum(['basic', 'pro', 'premium']),
  price: z.number(),
  currency: z.string(),
  interval: z.string(),
  features: z.array(z.string()),
});

export type Plan = z.infer<typeof planSchema>;
