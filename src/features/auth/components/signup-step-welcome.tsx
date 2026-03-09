import { Button } from '@/components/ui/button';

export function SignupStepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <div className="text-6xl">👋</div>
      <div>
        <h2 className="text-2xl font-bold">Welcome to Trainer Portal</h2>
        <p className="mt-2 text-gray-500">Your fitness journey starts here. Let&apos;s set up your account.</p>
      </div>
      <Button onClick={onNext} className="w-full">
        Get Started
      </Button>
    </div>
  );
}
