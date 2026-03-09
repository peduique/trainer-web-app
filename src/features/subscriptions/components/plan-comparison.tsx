'use client';
import { usePlans, useCheckout } from '@/features/subscriptions/hooks/use-subscription';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { Subscription } from '@/models/subscriptions/subscriptions.schema';

interface Props {
  currentSubscription: Subscription | null;
}

export function PlanComparison({ currentSubscription }: Props) {
  const { plans, isLoading } = usePlans();
  const checkout = useCheckout();

  if (isLoading) return <div className="flex justify-center py-8"><Spinner /></div>;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {plans.map((plan) => {
        const isCurrent = currentSubscription?.plan_name === plan.name;
        return (
          <div
            key={plan.name}
            className={`rounded-xl border p-6 ${isCurrent ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}
          >
            <p className="font-semibold capitalize text-gray-900">{plan.name}</p>
            <p className="mt-1 text-2xl font-bold">
              {plan.price === 0 ? 'Free' : `$${plan.price}`}
              {plan.price > 0 && <span className="text-sm font-normal text-gray-500">/{plan.interval}</span>}
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
            {!isCurrent && plan.price > 0 && (
              <Button
                className="mt-6 w-full"
                onClick={() => checkout.mutate(plan.name)}
                disabled={checkout.isPending}
                size="sm"
              >
                {checkout.isPending ? 'Redirecting...' : 'Upgrade'}
              </Button>
            )}
            {isCurrent && (
              <p className="mt-6 text-center text-sm font-medium text-blue-600">Current Plan</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
