import "server-only";
import { getToken, refreshSession } from "./auth";

const SSR_API =
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
  }
}

interface ApiOptions extends RequestInit {
  /** Si true, no añade el header Authorization. */
  anonymous?: boolean;
}

/**
 * Fetch autenticado para Server Components / Server Actions. Adjunta el JWT de
 * la cookie y, ante un 401, intenta renovar con el refresh token una vez.
 */
export async function apiFetch<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const doFetch = async (token: string | null): Promise<Response> => {
    const headers = new Headers(options.headers);
    headers.set("Accept", "application/json");
    // Para FormData no fijamos Content-Type: fetch pone el boundary multipart.
    if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (!options.anonymous && token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return fetch(`${SSR_API}${path.startsWith("/") ? path : `/${path}`}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  };

  let token = options.anonymous ? null : await getToken();
  let res = await doFetch(token);

  // Reintento tras refrescar el JWT.
  if (res.status === 401 && !options.anonymous) {
    const newToken = await refreshSession();
    if (newToken) {
      token = newToken;
      res = await doFetch(token);
    }
  }

  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, `API ${res.status} en ${path}`, body);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}
