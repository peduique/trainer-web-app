/**
 * Asana configuration helper - centralizes browser check and env access
 * Replaces 7 duplicate `typeof window !== 'undefined'` checks across the module
 */

export function getAsanaConfig() {
  // Only access process.env on the server or during build
  if (typeof window !== 'undefined') {
    return {
      pat: '',
      projectGid: '',
      isConfigured: false,
    };
  }

  return {
    pat: process.env.NEXT_PUBLIC_ASANA_PAT ?? '',
    projectGid: process.env.NEXT_PUBLIC_ASANA_PROJECT_GID ?? '',
    isConfigured: !!(process.env.NEXT_PUBLIC_ASANA_PAT && process.env.NEXT_PUBLIC_ASANA_PROJECT_GID),
  };
}
