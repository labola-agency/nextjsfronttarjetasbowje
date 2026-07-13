import {
  brand,
  contactRows,
  isVisible,
  Photo,
  resolvePalette,
  saveHref,
  type CardTemplateProps,
} from "./shared";

/**
 * 1a · Bowje "clásica" — tarjeta oscura con foto cuadrada de borde primario,
 * filas etiqueta/valor y botón píldora. Familia oscura (primario por empresa).
 */
export function OscuraClasica({ card }: CardTemplateProps) {
  const p = resolvePalette(card);
  const b = brand(card);
  const rows = contactRows(card);

  return (
    <div style={{ background: p.pageBg, padding: "30px 26px 34px", fontFamily: p.sans, color: p.text }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        {b.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={b.logo} alt={b.name} style={{ height: 26 }} />
        ) : (
          <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: ".04em" }}>
            {b.name}
            <span style={{ color: p.primary }}>.</span>
          </span>
        )}
      </div>

      <div style={{ border: `1px solid ${p.border}`, padding: "24px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: "none" }}>
            <Photo card={card} size={84} shape="square" borderColor={p.primary} accent={p.primary} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 25, lineHeight: 1.05 }}>{card.displayName}</div>
            {isVisible(card, "jobTitle") && card.jobTitle && (
              <div style={{ fontWeight: 500, fontSize: 14, color: p.primary, marginTop: 5 }}>{card.jobTitle}</div>
            )}
          </div>
        </div>

        <div style={{ width: 34, height: 2, background: p.primary, margin: "20px 0 6px" }} />

        {rows.map((r) => (
          <div
            key={r.key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 14,
              padding: "10px 0",
              borderTop: `1px solid ${p.hairline}`,
            }}
          >
            <span style={{ fontFamily: p.mono, fontWeight: 500, fontSize: 10.5, letterSpacing: ".09em", color: p.muted, textTransform: "uppercase" }}>
              {r.label}
            </span>
            <span style={{ fontWeight: 400, fontSize: 13.5, textAlign: "right" }}>
              {r.href ? (
                <a href={r.href} style={{ color: p.text }} target="_blank" rel="noopener noreferrer">
                  {r.value}
                </a>
              ) : (
                r.value
              )}
            </span>
          </div>
        ))}
      </div>

      <a
        href={saveHref(card)}
        style={{
          display: "block",
          marginTop: 24,
          padding: 15,
          borderRadius: 999,
          background: p.primary,
          color: "#0e0e0e",
          fontWeight: 700,
          fontSize: 15,
          textAlign: "center",
          textDecoration: "none",
        }}
      >
        Guardar contacto
      </a>
    </div>
  );
}
