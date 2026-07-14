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
 * 1d · everyoneplus "limpia" — fondo crema, tarjeta blanca redondeada, foto
 * circular, filas de datos y botón píldora. Familia clara (primario por empresa).
 */
export function ClaraLimpia({ card, preview }: CardTemplateProps) {
  const p = resolvePalette(card);
  const b = brand(card);
  const rows = contactRows(card);

  return (
    <div style={{ background: p.pageBg, padding: "30px 26px 34px", fontFamily: p.sans, color: p.text }}>
      <div style={{ marginBottom: 24 }}>
        {b.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={b.logo} alt={b.name} style={{ height: 24 }} />
        ) : (
          <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-.01em" }}>
            {b.name}
            <span style={{ color: p.primary }}>+</span>
          </span>
        )}
      </div>

      <div style={{ background: p.cardBg, borderRadius: 22, padding: "26px 24px", boxShadow: "0 4px 22px rgba(20,18,16,.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: "none" }}>
            <Photo card={card} size={82} shape="circle" borderColor={p.border} accent={p.primary} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 25, lineHeight: 1.02 }}>{card.displayName}</div>
            {isVisible(card, "jobTitle") && card.jobTitle && (
              <div style={{ fontWeight: 600, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: p.primary, marginTop: 6 }}>{card.jobTitle}</div>
            )}
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(20,18,16,.1)", margin: "22px 0 4px" }} />

        {rows.map((r) => (
          <div key={r.key} style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "10px 0", borderTop: `1px solid ${p.hairline}` }}>
            <span style={{ fontWeight: 600, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: p.muted }}>{r.label}</span>
            <span style={{ fontWeight: 500, fontSize: 14, textAlign: "right" }}>
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
        href={preview ? undefined : saveHref(card)}
        style={{ display: "block", marginTop: 22, padding: 15, borderRadius: 999, background: p.primary, color: "#fff", fontWeight: 700, fontSize: 15, textAlign: "center", textDecoration: "none" }}
      >
        Guardar contacto
      </a>
    </div>
  );
}
