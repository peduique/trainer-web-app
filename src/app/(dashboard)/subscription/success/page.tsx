import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SubscriptionSuccessPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="text-5xl">🎉</span>
      <h1 className="text-2xl font-bold">Subscription activated!</h1>
      <p className="text-gray-500">You now have access to all your plan features.</p>
      <Link href="/dashboard"><Button>Go to Dashboard</Button></Link>
    </div>
  );
}
