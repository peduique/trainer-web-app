'use client';
import { useCountdown } from '@/hooks/use-countdown';
import { Button } from '@/components/ui/button';

interface Props {
  seconds: number;
  onDismiss: () => void;
}

export function RestTimer({ seconds, onDismiss }: Props) {
  const { seconds: remaining, isRunning, start, pause, reset } = useCountdown({
    initialSeconds: seconds,
    autoStart: true,
    onComplete: onDismiss,
  });

  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="text-lg font-semibold text-gray-900">Rest Timer</h2>
        <div className="text-6xl font-bold tabular-nums text-blue-600">
          {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => (isRunning ? pause() : start())}>
            {isRunning ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="outline" onClick={() => reset()}>
            Reset
          </Button>
          <Button onClick={onDismiss}>Skip</Button>
        </div>
      </div>
    </div>
  );
}
