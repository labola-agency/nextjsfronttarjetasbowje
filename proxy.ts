import { NextResponse, type NextRequest } from "next/server";

const TOKEN_COOKIE = "bw_token";
const USER_COOKIE = "bw_user";

/**
 * Protege /admin y /mi-tarjeta: exige sesión y, para /admin, rol ADMIN.
 * La autorización real la impone Symfony; esto solo evita pantallas vacías.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(TOKEN_COOKIE)?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // /admin requiere ROLE_ADMIN.
  if (pathname.startsWith("/admin")) {
    let isAdmin = false;
    try {
      const raw = req.cookies.get(USER_COOKIE)?.value;
      if (raw) {
        const user = JSON.parse(raw) as { roles?: string[] };
        isAdmin = !!user.roles?.includes("ROLE_ADMIN");
      }
    } catch {
      isAdmin = false;
    }
    if (!isAdmin) {
      const url = req.nextUrl.clone();
      url.pathname = "/mi-tarjeta";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/mi-tarjeta/:path*"],
};
