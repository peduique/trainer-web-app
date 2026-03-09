// Datadog client - configure via environment variables
// NEXT_PUBLIC_DATADOG_APPLICATION_ID, NEXT_PUBLIC_DATADOG_CLIENT_TOKEN, etc.
export function initDatadog(): void {
  if (typeof window === 'undefined') return;
  // Initialize Datadog RUM when env vars are provided
  // import('@datadog/browser-rum').then(({ datadogRum }) => { datadogRum.init({...}) });
}
