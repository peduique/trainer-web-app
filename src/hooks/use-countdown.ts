import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCountdownOptions {
  initialSeconds: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

interface UseCountdownReturn {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (newSeconds?: number) => void;
}

export function useCountdown({ initialSeconds, onComplete, autoStart = false }: UseCountdownOptions): UseCountdownReturn {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isRunning) return;
    if (seconds <= 0) {
      setIsRunning(false);
      onCompleteRef.current?.();
      return;
    }
    const interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((newSeconds?: number) => {
    setIsRunning(false);
    setSeconds(newSeconds ?? initialSeconds);
  }, [initialSeconds]);

  return { seconds, isRunning, start, pause, reset };
}
