import { NextRequest, NextResponse } from "next/server";
import { ssoLogin } from "@/lib/auth";

/**
 * Auto-login (SSO) desde el portal (intranet). El portal manda al usuario a
 * /sso?token=... con un token cifrado; aquí lo canjeamos por una sesión (cookies)
 * llamando a la API y luego redirigimos a su tarjeta. Si el token falla, se manda
 * al login normal con un aviso.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=sso", req.url));
  }

  const result = await ssoLogin(token);
  if (!result.ok) {
    return NextResponse.redirect(new URL("/login?error=sso", req.url));
  }

  return NextResponse.redirect(new URL("/mi-tarjeta", req.url));
}
