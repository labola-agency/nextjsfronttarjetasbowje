import type { CardPublic, Empresa, Template } from "./types";

// Base pública (navegador) y base interna (SSR). En local coinciden.
export const PUBLIC_API =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const SSR_API =
  process.env.API_INTERNAL_URL || PUBLIC_API;

export function apiUrl(path: string, fromBrowser = false): string {
  const base = fromBrowser ? PUBLIC_API : SSR_API;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** URL pública del endpoint vCard (.vcf) de una tarjeta. */
export function vcardUrl(cardId: number): string {
  return `${PUBLIC_API}/api/vcard/${cardId}`;
}

/** slug de una empresa, venga como objeto embebido, IRI string o null. */
export function empresaSlugOf(empresa?: Empresa | string | null): string | null {
  return empresa && typeof empresa === "object" ? empresa.slug ?? null : null;
}

/** Ruta pública de la tarjeta: /{slugEmpresa}/tarjeta/{slugTarjeta}. */
export function cardPath(empresa: Empresa | string | null | undefined, slug: string): string {
  return `/${empresaSlugOf(empresa) || "tarjeta"}/tarjeta/${slug}`;
}

/** Ruta de la página con el QR (respaldo del wallet): /{slugEmpresa}/qr/{slugTarjeta}. */
export function qrPath(empresa: Empresa | string | null | undefined, slug: string): string {
  return `/${empresaSlugOf(empresa) || "tarjeta"}/qr/${slug}`;
}

/**
 * URL para pintar un logo/foto: una URL absoluta (http, blob de preview local o
 * data) se usa tal cual; una ruta relativa (/uploads/…) se sirve desde el
 * backend (NEXT_PUBLIC_API_URL).
 */
export function logoSrc(logoUrl?: string | null): string | undefined {
  if (!logoUrl) return undefined;
  if (/^(https?:|blob:|data:)/i.test(logoUrl)) return logoUrl;
  return `${PUBLIC_API}${logoUrl.startsWith("/") ? "" : "/"}${logoUrl}`;
}

/** Tarjeta pública por slug (solo publicadas). Devuelve null si no existe. */
export async function getPublicCard(slug: string): Promise<CardPublic | null> {
  try {
    const res = await fetch(apiUrl(`/api/public/cards/${encodeURIComponent(slug)}`), {
      headers: { Accept: "application/json" },
      // Revalida cada 60s: SEO/OpenGraph al compartir sin servir datos muy viejos.
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as CardPublic;
  } catch {
    return null;
  }
}

/** Plantillas activas (públicas). */
export async function getActiveTemplates(): Promise<Template[]> {
  try {
    const res = await fetch(apiUrl(`/api/templates?isActive=true`), {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return (await res.json()) as Template[];
  } catch {
    return [];
  }
}
