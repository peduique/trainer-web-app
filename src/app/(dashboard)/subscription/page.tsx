'use client';
import { useSubscription, useCancelSubscription, useReactivateSubscription } from '@/features/subscriptions/hooks/use-subscription';
import { SubscriptionStatus } from '@/features/subscriptions/components/subscription-status';
import { PlanComparison } from '@/features/subscriptions/components/plan-comparison';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function SubscriptionPage() {
  const { subscription, isLoading } = useSubscription();
  const cancel = useCancelSubscription();
  const reactivate = useReactivateSubscription();

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Subscription" description="Manage your plan and billing" />

      {subscription && <SubscriptionStatus subscription={subscription} />}

      <div>
        <h2 className="mb-4 font-semibold text-gray-900">Available Plans</h2>
        <PlanComparison currentSubscription={subscription} />
      </div>

      {subscription && (
        <div className="flex gap-3">
          {subscription.status === 'active' && (
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => cancel.mutate()}
              disabled={cancel.isPending}
            >
              {cancel.isPending ? 'Canceling...' : 'Cancel Subscription'}
            </Button>
          )}
          {subscription.status === 'canceled' && (
            <Button
              onClick={() => reactivate.mutate()}
              disabled={reactivate.isPending}
            >
              {reactivate.isPending ? 'Reactivating...' : 'Reactivate Subscription'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
