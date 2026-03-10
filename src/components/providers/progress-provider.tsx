'use client';

import { ProgressProvider as BProgressProvider } from '@bprogress/next';

export function ProgressProvider() {
  return (
    <BProgressProvider
      height="4px"
      color="#3b82f6"
      options={{ showSpinner: false }}
    />
  );
}
