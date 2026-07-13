import "server-only";
import { cookies } from "next/headers";
import type { SessionUser } from "./types";

export const TOKEN_COOKIE = "bw_token";
export const REFRESH_COOKIE = "bw_refresh";
export const USER_COOKIE = "bw_user";

const API = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface LoginResult {
  token: string;
  refresh_token?: string;
  user: SessionUser;
}

/** Persiste la sesión en cookies httpOnly. */
export async function persistSession(result: LoginResult): Promise<void> {
  const jar = await cookies();
  const secure = process.env.NODE_ENV === "production";
  const base = { httpOnly: true, secure, sameSite: "lax" as const, path: "/" };

  // JWT: vida corta (1h).
  jar.set(TOKEN_COOKIE, result.token, { ...base, maxAge: 60 * 60 });
  if (result.refresh_token) {
    // Refresh: vida larga (30 días).
    jar.set(REFRESH_COOKIE, result.refresh_token, { ...base, maxAge: 60 * 60 * 24 * 30 });
  }
  // Datos del usuario: legibles por el server (no httpOnly necesario, pero lo
  // mantenemos httpOnly y los exponemos vía getSessionUser).
  jar.set(USER_COOKIE, JSON.stringify(result.user), { ...base, maxAge: 60 * 60 * 24 * 30 });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(TOKEN_COOKIE);
  jar.delete(REFRESH_COOKIE);
  jar.delete(USER_COOKIE);
}

export async function getToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(TOKEN_COOKIE)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(REFRESH_COOKIE)?.value ?? null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const raw = jar.get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function hasRole(user: SessionUser | null, role: string): boolean {
  return !!user?.roles?.includes(role as SessionUser["roles"][number]);
}

/** Llama a /api/login_check y persiste la sesión. Devuelve el usuario o un error. */
export async function login(
  email: string,
  password: string,
): Promise<{ ok: true; user: SessionUser } | { ok: false; error: string }> {
  let res: Response;
  try {
    res = await fetch(`${API}/api/login_check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return { ok: false, error: "No se pudo conectar con el servidor." };
  }

  if (!res.ok) {
    return { ok: false, error: "Email o contraseña incorrectos." };
  }

  const data = (await res.json()) as LoginResult;
  await persistSession(data);
  return { ok: true, user: data.user };
}

/** Intenta renovar el JWT con el refresh token. Devuelve el nuevo token o null. */
export async function refreshSession(): Promise<string | null> {
  const refresh = await getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(`${API}/api/token/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as LoginResult;
    await persistSession(data);
    return data.token;
  } catch {
    return null;
  }
}
