export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const API_BASE_URL = '/api';

type Json = Record<string, unknown> | Array<unknown> | string | number | boolean | null;

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  options: { method?: HttpMethod; body?: Json; headers?: Record<string, string> } = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const { method = 'GET', body, headers = {} } = options;
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}: ${text}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }
  // @ts-expect-error allow non-json for void endpoints
  return undefined as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: Json) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: Json) => request<T>(path, { method: 'PUT', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};


