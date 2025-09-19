type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface FetchConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

export async function apiRequest<T>(
  baseURL: string,
  endpoint: string,
  config: FetchConfig = {}
): Promise<T> {
  const { method = "GET", headers = {}, body } = config;

  const response = await fetch(`${baseURL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: T = await response.json();
  return data;
}
