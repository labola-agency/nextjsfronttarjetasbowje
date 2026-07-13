import { NextRequest, NextResponse } from "next/server";
import { getToken, refreshSession } from "@/lib/auth";

const SSR_API =
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Proxy autenticado para la exportación CSV de leads. El navegador llama aquí
 * (misma-origin, con cookie de sesión); este handler adjunta el Bearer y
 * reenvía a la API de Symfony, devolviendo el CSV como descarga.
 */
export async function GET(req: NextRequest) {
  let token = await getToken();
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const qs = req.nextUrl.search; // conserva ?status=&from=&to=
  const target = `${SSR_API}/api/export/leads${qs}`;

  const doFetch = (t: string) =>
    fetch(target, { headers: { Authorization: `Bearer ${t}`, Accept: "text/csv" }, cache: "no-store" });

  let res = await doFetch(token);
  if (res.status === 401) {
    const nt = await refreshSession();
    if (nt) {
      token = nt;
      res = await doFetch(nt);
    }
  }

  if (!res.ok) {
    return new NextResponse("No autorizado", { status: res.status });
  }

  const body = await res.arrayBuffer();
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": res.headers.get("content-disposition") || 'attachment; filename="leads.csv"',
    },
  });
}
