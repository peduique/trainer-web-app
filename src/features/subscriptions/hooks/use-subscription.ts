import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSubscription, fetchPlans, cancelSubscription, reactivateSubscription, createCheckoutSession } from '@/models/subscriptions/subscriptions.api';

export const SUBSCRIPTION_QUERY_KEY = ['subscription'] as const;

export function useSubscription() {
  const { data, isLoading, error } = useQuery({
    queryKey: SUBSCRIPTION_QUERY_KEY,
    queryFn: fetchSubscription,
  });
  return { subscription: data ?? null, isLoading, error };
}

export function usePlans() {
  const { data, isLoading } = useQuery({
    queryKey: ['subscription', 'plans'],
    queryFn: fetchPlans,
  });
  return { plans: data ?? [], isLoading };
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: (updated) => queryClient.setQueryData(SUBSCRIPTION_QUERY_KEY, updated),
  });
}

export function useReactivateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reactivateSubscription,
    onSuccess: (updated) => queryClient.setQueryData(SUBSCRIPTION_QUERY_KEY, updated),
  });
}

export function useCheckout() {
  return useMutation({
    mutationFn: (planName: string) => createCheckoutSession(planName),
    onSuccess: ({ url }) => { window.location.href = url; },
  });
}
