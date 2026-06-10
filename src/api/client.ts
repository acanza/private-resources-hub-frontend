export type ApiError = {
  status: number;
  message: string;
};

export type ApiRequestOptions = {
  headers?: Record<string, string>;
  includeCredentials?: boolean;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function apiRequest<T>(
  method: string,
  path: string,
  options: ApiRequestOptions & { body?: unknown } = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const requestInit: RequestInit = {
    method,
    headers,
  };

  if (options.includeCredentials) {
    requestInit.credentials = 'include';
  }

  if (options.body) {
    requestInit.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, requestInit);

  // Handle 401 Unauthorized
  if (response.status === 401) {
    const message = 'Your session has expired. Please log in again.';
    const error: ApiError = { status: 401, message };
    throw error;
  }

  // Handle 403 Forbidden
  if (response.status === 403) {
    const message = 'You do not have permission to access this resource.';
    const error: ApiError = { status: 403, message };
    throw error;
  }

  // Handle other non-2xx responses
  if (!response.ok) {
    let message = `API error: ${response.status}`;
    try {
      const json = await response.json();
      message = json.message || message;
    } catch {
      // If response is not JSON, use default message
    }
    const error: ApiError = { status: response.status, message };
    throw error;
  }

  // Parse response
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  return response.text() as unknown as Promise<T>;
}

export function addAuthorizationHeader(
  headers: Record<string, string>,
  token: string | null
): Record<string, string> {
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export { apiRequest, API_BASE_URL };
