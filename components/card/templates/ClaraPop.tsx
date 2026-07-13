import { brand, contactRows, initials, isVisible, PhotoImg, photoSrc, resolvePalette, saveHref, type CardTemplateProps } from "./shared";

const ICONS: Record<string, string> = {
  company: "🏢",
  phone: "📞",
  mobile: "📱",
  email: "✉",
  website: "🌐",
  addressLine: "📍",
  linkedin: "💼",
};

/**
 * 1f · everyoneplus "pop" — fondo crema con aros de marca, foto en aro punteado,
 * nombre gigante centrado y contactos en "chips". Familia clara.
 */
export function ClaraPop({ card }: CardTemplateProps) {
  const p = resolvePalette(card);
  const b = brand(card);
  const rows = contactRows(card).filter((r) => r.key !== "company");
  const parts = (card.displayName || "").trim().split(/\s+/);
  const first = parts[0] || card.displayName || "";
  const last = parts.slice(1).join(" ");
  const photo = photoSrc(card);

  return (
    <div style={{ background: p.pageBg, position: "relative", overflow: "hidden", fontFamily: p.sans, color: p.text, padding: "28px 26px 32px" }}>
      <div style={{ position: "absolute", top: -40, left: -40, width: 150, height: 150, border: `22px solid ${p.primary}`, borderRadius: "50%", opacity: 0.9 }} />

      <div style={{ position: "relative" }}>
        {b.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={b.logo} alt={b.name} style={{ height: 22 }} />
        ) : (
          <div style={{ fontWeight: 800, fontSize: 16 }}>
            {b.name}
            <span style={{ color: p.primary }}>+</span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", margin: "26px 0 20px" }}>
          <div style={{ position: "relative", width: 150, height: 150 }}>
            <div style={{ position: "absolute", inset: 0, border: `3px dashed ${p.primary}`, borderRadius: "50%" }} />
            <div style={{ position: "absolute", inset: 12, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: p.cardBg, color: p.primary, fontWeight: 700, fontSize: 44 }}>
              {photo ? (
                <PhotoImg card={card} style={{ width: "100%", height: "100%" }} />
              ) : (
                initials(card.displayName)
              )}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", fontWeight: 900, fontSize: 40, lineHeight: 0.9, textTransform: "uppercase" }}>
          {first}
          {last && (
            <>
              <br />
              <span style={{ color: p.primary }}>{last}</span>
            </>
          )}
        </div>
        {isVisible(card, "jobTitle") && card.jobTitle && (
          <div style={{ textAlign: "center", fontWeight: 600, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: p.muted, marginTop: 12 }}>{card.jobTitle}</div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 22 }}>
          {rows.map((r) => {
            const content = (
              <>
                {ICONS[r.key] || "•"} {r.value}
              </>
            );
            const style: React.CSSProperties = { fontWeight: 500, fontSize: 12, color: p.text, background: p.cardBg, border: `1px solid ${p.border}`, borderRadius: 999, padding: "8px 14px", textDecoration: "none" };
            return r.href ? (
              <a key={r.key} href={r.href} target="_blank" rel="noopener noreferrer" style={style}>
                {content}
              </a>
            ) : (
              <span key={r.key} style={style}>
                {content}
              </span>
            );
          })}
        </div>

        <a
          href={saveHref(card)}
          style={{ display: "block", marginTop: 24, padding: 16, borderRadius: 999, background: p.primary, color: "#fff", fontWeight: 800, fontSize: 15, textAlign: "center", textDecoration: "none" }}
        >
          Guardar contacto
        </a>
      </div>
    </div>
  );
}
