// Simple API client for backend communication
// Uses VITE_API_BASE_URL when available; falls back to "/api" (can be proxied by Vite)

let accessToken: string | null = null;
let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

try {
  accessToken = localStorage.getItem('accessToken');
} catch {
  accessToken = null;
}

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  try {
    if (token) localStorage.setItem('accessToken', token);
    else localStorage.removeItem('accessToken');
  } catch {
    // ignore storage errors in non-browser contexts
  }
};

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';
const AUTH_REFRESH_PATH = '/auth/refresh';
const AUTH_LOGIN_PATH = '/auth/login';
const AUTH_LOGOUT_PATH = '/auth/logout';

type Json = Record<string, any> | Array<any> | string | number | boolean | null;

async function refreshAccessTokenIfNeeded(): Promise<void> {
  if (isRefreshing) {
    await new Promise<void>((resolve) => pendingQueue.push(resolve));
    return;
  }
  try {
    isRefreshing = true;
    const rt = localStorage.getItem('refreshToken');
    if (!rt) return;
    const res = await fetch(`${BASE_URL}${AUTH_REFRESH_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) throw new Error('refresh failed');
    const data = await res.json();
    setAccessToken(data.accessToken);
    try { localStorage.setItem('accessToken', data.accessToken); } catch {}
    try { localStorage.setItem('refreshToken', data.refreshToken); } catch {}
  } finally {
    isRefreshing = false;
    pendingQueue.forEach((fn) => fn());
    pendingQueue = [];
  }
}

export async function ensureAccessToken(): Promise<void> {
  if (accessToken) return;
  const rt = localStorage.getItem('refreshToken');
  if (!rt) return;
  await refreshAccessTokenIfNeeded();
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const headers: HeadersInit = {
    ...(options.headers || {}),
  };
  if (!isFormData && !(headers as any)['Content-Type']) {
    (headers as any)['Content-Type'] = 'application/json';
  }

  if (accessToken) {
    (headers as any)['Authorization'] = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  let data = isJson ? await res.json() : (await res.text());

  if (res.status === 401 && path !== AUTH_REFRESH_PATH && path !== AUTH_LOGIN_PATH && path !== AUTH_LOGOUT_PATH) {
    await refreshAccessTokenIfNeeded();
    const retryHeaders = { ...headers } as any;
    if (accessToken) retryHeaders['Authorization'] = `Bearer ${accessToken}`;
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers: retryHeaders });
    const isJsonRetry = (res.headers.get('content-type') || '').includes('application/json');
    data = isJsonRetry ? await res.json() : (await res.text());
  }

  if (!res.ok) {
    const msg = (data as any)?.message || (typeof data === 'string' ? data : 'Request failed');
    throw new Error(msg);
  }

  return data as T;
}

export const api = {
  get: <T = any>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T = any>(path: string, body?: Json) =>
    request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  put: <T = any>(path: string, body?: Json) =>
    request<T>(path, { method: 'PUT', body: body !== undefined ? JSON.stringify(body) : undefined }),
  del: <T = any>(path: string) => request<T>(path, { method: 'DELETE' }),
  upload: <T = any>(path: string, formData: FormData, method: 'POST' | 'PUT' = 'POST') =>
    request<T>(path, { method, body: formData }),
};
