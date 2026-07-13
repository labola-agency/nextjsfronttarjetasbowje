import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPublicCard, cardPath, qrPath } from "@/lib/api";
import { brand, contactRows, resolvePalette } from "@/components/card/templates/shared";
import { QrCode } from "@/components/card/QrCode";

interface PageProps {
  params: Promise<{ empresa: string; slug: string }>;
}

async function absoluteUrl(path: string): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || "http";
  return `${proto}://${host}${path}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const card = await getPublicCard(slug);
  if (!card) return { title: "QR no encontrado — Bowje" };
  return { title: `QR de ${card.displayName} — Bowje` };
}

export default async function CardQrPage({ params }: PageProps) {
  const { empresa, slug } = await params;
  const card = await getPublicCard(slug);
  if (!card) notFound();

  // Ruta canónica /{slugEmpresa}/qr/{slug}: si el segmento de empresa no coincide, redirige.
  const canonicalQr = qrPath(card.empresa, card.slug);
  if (canonicalQr !== `/${empresa}/qr/${slug}`) redirect(canonicalQr);

  const p = resolvePalette(card);
  const b = brand(card);
  const dark = p.family === "dark";
  const cardUrl = await absoluteUrl(cardPath(card.empresa, card.slug));
  const fields = contactRows(card).filter((r) => ["mobile", "phone", "email", "website"].includes(r.key)).slice(0, 3);

  // Colores del "pase" según la familia.
  const passBg = dark ? "#171717" : "#ffffff";
  const passText = dark ? "#ffffff" : "#141210";
  const passMuted = dark ? "rgba(255,255,255,.45)" : "rgba(20,18,16,.45)";
  const passBorder = dark ? "rgba(255,255,255,.08)" : "rgba(20,18,16,.08)";
  const dashed = dark ? "rgba(255,255,255,.18)" : "rgba(20,18,16,.18)";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: p.pageBg, fontFamily: p.sans, padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: 340, background: passBg, borderRadius: 16, overflow: "hidden", boxShadow: "0 14px 44px rgba(0,0,0,.28)", border: `1px solid ${passBorder}` }}>
        {/* Cabecera */}
        {dark ? (
          <>
            <div style={{ height: 4, background: p.primary }} />
            <div style={{ padding: "20px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {b.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.logo} alt={b.name} style={{ height: 20 }} />
              ) : (
                <span style={{ fontWeight: 700, fontSize: 16, color: passText }}>
                  {b.name}
                  <span style={{ color: p.primary }}>.</span>
                </span>
              )}
              <span style={{ fontFamily: p.mono, fontWeight: 500, fontSize: 9.5, letterSpacing: ".14em", color: passMuted }}>CONTACTO</span>
            </div>
          </>
        ) : (
          <div style={{ background: p.primary, padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {b.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.logo} alt={b.name} style={{ height: 20 }} />
            ) : (
              <span style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>
                {b.name}
                <span style={{ color: "#141210" }}>+</span>
              </span>
            )}
            <span style={{ fontWeight: 600, fontSize: 9.5, letterSpacing: ".14em", color: "rgba(255,255,255,.9)" }}>CONTACTO</span>
          </div>
        )}

        {/* Datos */}
        <div style={{ padding: "20px 22px 22px" }}>
          <div style={{ fontFamily: p.mono, fontWeight: 500, fontSize: 9, letterSpacing: ".12em", color: p.primary, textTransform: "uppercase" }}>Nombre</div>
          <div style={{ fontWeight: dark ? 700 : 800, fontSize: 24, lineHeight: 1.05, color: passText, marginTop: 4 }}>{card.displayName}</div>
          {card.jobTitle && (
            <div style={{ fontSize: 12, color: passMuted, marginTop: 3 }}>
              {card.jobTitle}
              {b.name ? ` · ${b.name}` : ""}
            </div>
          )}

          {fields.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px 24px", marginTop: 18 }}>
              {fields.map((r) => (
                <div key={r.key}>
                  <div style={{ fontFamily: p.mono, fontWeight: 500, fontSize: 9, letterSpacing: ".12em", color: p.primary, textTransform: "uppercase" }}>{r.label}</div>
                  <div style={{ fontSize: 13, color: passText, marginTop: 3 }}>{r.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QR */}
        <div style={{ borderTop: `1px dashed ${dashed}`, padding: "20px 22px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <QrCode value={cardUrl} size={144} />
          <div style={{ fontFamily: p.mono, fontWeight: 500, fontSize: 9, letterSpacing: ".18em", color: passMuted, marginTop: 12 }}>ESCANÉAME</div>
        </div>
      </div>

      <Link href={cardPath(card.empresa, card.slug)} style={{ color: p.family === "dark" ? p.primary : "#141210", fontSize: 14, fontWeight: 600, marginTop: 24 }}>
        Ver tarjeta ↗
      </Link>
    </div>
  );
}
