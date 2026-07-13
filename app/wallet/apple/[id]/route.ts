import { NextRequest, NextResponse } from "next/server";
import { getToken, refreshSession } from "@/lib/auth";

const SSR_API =
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/** Proxy autenticado del pase Apple Wallet (.pkpass). */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let token = await getToken();
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  const target = `${SSR_API}/api/wallet/apple/${id}`;
  const doFetch = (t: string) =>
    fetch(target, { headers: { Authorization: `Bearer ${t}` }, cache: "no-store" });

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

  const buf = await res.arrayBuffer();
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.apple.pkpass",
      "Content-Disposition": res.headers.get("content-disposition") || 'attachment; filename="card.pkpass"',
    },
  });
}
