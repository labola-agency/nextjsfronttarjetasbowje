import { brand, contactRows, initials, PhotoImg, photoSrc, resolvePalette, saveHref, type CardTemplateProps } from "./shared";

/**
 * 1c · Bowje "editorial" — foto a sangre con degradado, nombre gigante con
 * trazo, campos en rejilla de 2 columnas y botón cuadrado. Familia oscura.
 */
export function OscuraEditorial({ card, preview }: CardTemplateProps) {
  const p = resolvePalette(card);
  const b = brand(card);
  const rows = contactRows(card);
  const parts = (card.displayName || "").trim().split(/\s+/);
  const first = parts[0] || card.displayName || "";
  const last = parts.slice(1).join(" ");
  const photo = photoSrc(card);
  const roleLine = [card.jobTitle, b.name].filter(Boolean).join(" · ");

  return (
    <div style={{ background: p.pageBg, position: "relative", overflow: "hidden", fontFamily: p.sans, color: p.text }}>
      <div style={{ position: "absolute", top: 0, right: 9, writingMode: "vertical-rl", fontFamily: p.mono, fontWeight: 500, fontSize: 10, letterSpacing: ".34em", color: p.primary, opacity: 0.6, paddingTop: 18, zIndex: 3 }}>
        {b.name} — CONTACTO
      </div>
      <div style={{ position: "absolute", top: 18, left: 22, fontFamily: p.mono, fontWeight: 500, fontSize: 11, letterSpacing: ".1em", color: p.primary, zIndex: 3 }}>
        01 / CARD
      </div>

      <div style={{ position: "relative", height: 288 }}>
        {photo ? (
          <PhotoImg card={card} style={{ width: "100%", height: "100%" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: p.cardBg, color: p.primary, fontSize: 96, fontWeight: 700 }}>
            {initials(card.displayName)}
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg,rgba(14,14,14,.35) 0%,rgba(14,14,14,0) 30%,rgba(14,14,14,.85) 82%,${p.pageBg} 100%)`, pointerEvents: "none" }} />
      </div>

      <div style={{ padding: "0 24px 30px", marginTop: -58, position: "relative", zIndex: 2 }}>
        <div style={{ fontWeight: 700, fontSize: 46, lineHeight: 0.92, textTransform: "uppercase" }}>
          {first}
          {last && (
            <>
              <br />
              <span style={{ color: "transparent", WebkitTextStroke: `1.4px ${p.primary}` }}>{last}</span>
            </>
          )}
        </div>
        {roleLine && (
          <div style={{ fontFamily: p.mono, fontWeight: 500, fontSize: 11, letterSpacing: ".12em", color: p.primary, marginTop: 12, textTransform: "uppercase" }}>{roleLine}</div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", marginTop: 26 }}>
          {rows.map((r) => (
            <div key={r.key} style={{ minWidth: 0, borderTop: `1px solid ${p.primary}59`, paddingTop: 9, gridColumn: r.key === "addressLine" ? "1 / -1" : undefined }}>
              <div style={{ fontFamily: p.mono, fontWeight: 500, fontSize: 9, letterSpacing: ".1em", color: p.muted, textTransform: "uppercase" }}>{r.label}</div>
              <div style={{ fontWeight: 400, fontSize: 13, marginTop: 4, overflowWrap: "anywhere" }}>
                {r.href ? (
                  <a href={r.href} style={{ color: p.text }} target="_blank" rel="noopener noreferrer">
                    {r.value}
                  </a>
                ) : (
                  r.value
                )}
              </div>
            </div>
          ))}
        </div>

        <a
          href={preview ? undefined : saveHref(card)}
          style={{ display: "block", marginTop: 26, padding: 15, borderRadius: 2, background: p.primary, color: "#0e0e0e", fontWeight: 700, fontSize: 14, letterSpacing: ".02em", textAlign: "center", textTransform: "uppercase", textDecoration: "none" }}
        >
          Guardar contacto ↓
        </a>
      </div>
    </div>
  );
}
