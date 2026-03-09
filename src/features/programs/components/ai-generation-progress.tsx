import { Spinner } from '@/components/ui/spinner';
import type { GenerationStatus } from '@/models/programs/programs.schema';

const STATUS_LABELS: Record<GenerationStatus['status'], string> = {
  queued: 'Queued — waiting to start...',
  running: 'AI is generating your program...',
  completed: 'Complete! Redirecting...',
  failed: 'Generation failed. Please try again.',
};

interface Props {
  status: GenerationStatus;
}

export function AiGenerationProgress({ status }: Props) {
  const isRunning = status.status === 'queued' || status.status === 'running';

  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      {isRunning && <Spinner size="lg" />}
      {status.status === 'completed' && <span className="text-4xl">✅</span>}
      {status.status === 'failed' && <span className="text-4xl">❌</span>}
      <p className="font-medium text-gray-700">{STATUS_LABELS[status.status]}</p>
      {status.progress !== undefined && isRunning && (
        <div className="w-full max-w-xs">
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all"
              style={{ width: `${status.progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">{status.progress}%</p>
        </div>
      )}
    </div>
  );
}
