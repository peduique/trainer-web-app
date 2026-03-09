import { env } from '@/config/env';

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

class ApiClientError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor({ message, status, errors }: ApiError) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${env.NEXT_PUBLIC_API_URL}${path}`;
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init.headers },
    ...init,
  });

  if (!res.ok) {
    let body: { message?: string; errors?: Record<string, string[]> } = {};
    try {
      body = await res.json();
    } catch {}
    throw new ApiClientError({
      message: body.message ?? `Request failed: ${res.status}`,
      status: res.status,
      errors: body.errors,
    });
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const apiClient = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: 'GET' }),
  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'PUT', body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: 'DELETE' }),
  upload: <T>(path: string, formData: FormData, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: 'POST',
      body: formData,
      headers: { ...(init?.headers ?? {}) }, // no Content-Type - let browser set multipart boundary
    }),
};
