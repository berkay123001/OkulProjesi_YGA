import type { GraphData, HealthStatus, HistoryResponse } from '@/types';

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ??
  'http://localhost:3002/api/v1';

const WEB_TOKEN = import.meta.env.VITE_WEB_TOKEN as string | undefined;

function authHeaders(): HeadersInit {
  return WEB_TOKEN ? { Authorization: `Bearer ${WEB_TOKEN}` } : {};
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof data?.error === 'string' ? data.error : `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: authHeaders(),
  });
  return parseResponse<T>(response);
}

export async function apiPost<T>(endpoint: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return parseResponse<T>(response);
}

export function getEventsUrl(): string {
  const url = new URL(`${API_BASE_URL}/events`);
  if (WEB_TOKEN) url.searchParams.set('token', WEB_TOKEN);
  return url.toString();
}

export const osintApi = {
  health: () => apiGet<HealthStatus>('/health'),
  status: () => apiGet<{ processing?: boolean }>('/status'),
  history: () => apiGet<HistoryResponse>('/history'),
  graphSession: () => apiGet<GraphData>('/graph/session'),
  graphStats: () => apiGet<{ nodes?: number; relationships?: number }>('/graph/stats'),
  chat: (message: string) => apiPost<{ ok?: boolean; message?: string }>('/chat', { message }),
};
