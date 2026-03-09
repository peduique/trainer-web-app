import { apiClient } from '@/lib/api/client';
import type { Subscription, Plan } from './subscriptions.schema';

export async function fetchSubscription(): Promise<Subscription> {
  return apiClient.get<Subscription>('/subscriptions/current');
}

export async function fetchPlans(): Promise<Plan[]> {
  return apiClient.get<Plan[]>('/subscriptions/plans');
}

export async function createCheckoutSession(planName: string): Promise<{ url: string }> {
  return apiClient.post<{ url: string }>('/subscriptions/checkout', { plan_name: planName });
}

export async function cancelSubscription(): Promise<Subscription> {
  return apiClient.post<Subscription>('/subscriptions/cancel');
}

export async function reactivateSubscription(): Promise<Subscription> {
  return apiClient.post<Subscription>('/subscriptions/reactivate');
}
