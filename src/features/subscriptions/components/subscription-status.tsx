import { Badge } from '@/components/ui/badge';
import type { Subscription } from '@/models/subscriptions/subscriptions.schema';

const STATUS_BADGE: Record<string, { variant: 'success' | 'warning' | 'error' | 'default' | 'info'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  trialing: { variant: 'info', label: 'Trial' },
  canceled: { variant: 'warning', label: 'Canceled' },
  past_due: { variant: 'error', label: 'Past Due' },
  unpaid: { variant: 'error', label: 'Unpaid' },
};

interface Props {
  subscription: Subscription;
}

export function SubscriptionStatus({ subscription }: Props) {
  const statusInfo = STATUS_BADGE[subscription.status] ?? { variant: 'default' as const, label: subscription.status };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
        <p className="text-sm text-muted-foreground">Current Plan</p>
        <p className="mt-1 font-heading text-xl font-bold capitalize text-foreground">{subscription.plan_name}</p>
        </div>
        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
      </div>

      {subscription.current_period_end && (
        <p className="mt-3 text-sm text-muted-foreground">
          {subscription.status === 'canceled' ? 'Access until' : 'Renews on'}{' '}
          <strong>{new Date(subscription.current_period_end).toLocaleDateString()}</strong>
        </p>
      )}
    </div>
  );
}
