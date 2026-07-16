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
 * 1b · Bowje "bloque" — cabecera con el color de marca (foto circular + nombre
 * en tinta) sobre un cuerpo oscuro con los datos. Botón de contorno.
 */
export function OscuraBloque({ card, preview }: CardTemplateProps) {
  const p = resolvePalette(card);
  const b = brand(card);
  const rows = contactRows(card);
  const ink = "#0e0e0e";

  return (
    <div style={{ borderRadius: 20, overflow: "hidden", fontFamily: p.sans }}>
      {/* Cabecera color de marca */}
      <div style={{ background: p.primary, padding: "26px 26px 30px", color: ink }}>
        {b.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={b.logo} alt={b.name} style={{ height: 22, marginBottom: 22 }} />
        ) : (
          <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: ".03em", marginBottom: 22 }}>
            {b.name}
            <span style={{ opacity: 0.55 }}>.</span>
          </div>
        )}
        <Photo card={card} size={80} shape="circle" borderColor={ink} accent={ink} />
        <div style={{ fontWeight: 700, fontSize: 30, lineHeight: 1, marginTop: 16 }}>{card.displayName}</div>
        {isVisible(card, "jobTitle") && card.jobTitle && (
          <div style={{ fontFamily: p.mono, fontWeight: 500, fontSize: 12, letterSpacing: ".06em", color: "rgba(14,14,14,.65)", marginTop: 7, textTransform: "uppercase" }}>
            {card.jobTitle}
          </div>
        )}
      </div>

      {/* Cuerpo oscuro con datos */}
      <div style={{ background: p.cardBg, padding: "24px 26px 30px", color: p.text }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {rows.map((r) => (
            <div key={r.key}>
              <div style={{ fontFamily: p.mono, fontWeight: 500, fontSize: 10, letterSpacing: ".1em", color: p.primary, textTransform: "uppercase" }}>{r.label}</div>
              <div style={{ fontWeight: 400, fontSize: 15, marginTop: 3, overflowWrap: "anywhere" }}>
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
          style={{
            display: "block",
            marginTop: 26,
            padding: 14,
            borderRadius: 999,
            border: `1.5px solid ${p.primary}`,
            color: p.primary,
            fontWeight: 700,
            fontSize: 15,
            textAlign: "center",
            textDecoration: "none",
          }}
        >
          Guardar contacto
        </a>
      </div>
    </div>
  );
}
