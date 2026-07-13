import { NextRequest, NextResponse } from "next/server";
import { getToken, refreshSession } from "@/lib/auth";

const SSR_API =
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/** Proxy autenticado de Google Wallet: obtiene el saveUrl y redirige a Google. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let token = await getToken();
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  const target = `${SSR_API}/api/wallet/google/${id}?format=json`;
  const doFetch = (t: string) =>
    fetch(target, { headers: { Authorization: `Bearer ${t}`, Accept: "application/json" }, cache: "no-store" });

  let res = await doFetch(token);
  if (res.status === 401) {
    const nt = await refreshSession();
    if (nt) {
      token = nt;
      res = await doFetch(nt);
    }
  }

  if (!res.ok) {
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
    });
  }

  const data = (await res.json()) as { saveUrl?: string };
  if (!data.saveUrl) {
    return new NextResponse(JSON.stringify({ error: "Sin enlace de Google Wallet." }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
  // Devuelve el enlace en JSON; el cliente redirige el navegador a Google.
  return NextResponse.json({ saveUrl: data.saveUrl });
}
