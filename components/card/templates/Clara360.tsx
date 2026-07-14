import { brand, contactRows, isVisible, Photo, resolvePalette, saveHref, type CardTemplateProps } from "./shared";

/**
 * 1e · everyoneplus "360" — tarjeta oscura con cabecera del color de marca (con
 * "360" de marca de agua), foto circular, campos en rejilla y botón blanco.
 * Pertenece a la familia clara (fondo de página crema) pero con cuerpo oscuro.
 */
export function Clara360({ card, preview }: CardTemplateProps) {
  const p = resolvePalette(card);
  const b = brand(card);
  const rows = contactRows(card);
  const ink = "#141210";
  const body = "#141210";

  return (
    <div style={{ background: body, borderRadius: 20, overflow: "hidden", fontFamily: p.sans }}>
      {/* Cabecera color de marca */}
      <div style={{ background: p.primary, padding: "24px 26px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -30, top: -30, fontWeight: 900, fontSize: 150, lineHeight: 1, color: "rgba(255,255,255,.14)" }}>360</div>
        {b.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={b.logo} alt={b.name} style={{ height: 20, position: "relative" }} />
        ) : (
          <div style={{ fontWeight: 800, fontSize: 15, color: "#fff", position: "relative" }}>
            {b.name}
            <span style={{ color: ink }}>+</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 22, position: "relative" }}>
          <div style={{ flex: "none" }}>
            <Photo card={card} size={78} shape="circle" borderColor="#fff" accent="#fff" />
          </div>
          <div style={{ fontWeight: 900, fontSize: 27, lineHeight: 0.98, color: "#fff" }}>{card.displayName}</div>
        </div>
        {isVisible(card, "jobTitle") && card.jobTitle && (
          <div style={{ fontWeight: 600, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: ink, marginTop: 16, position: "relative" }}>{card.jobTitle}</div>
        )}
      </div>

      {/* Cuerpo oscuro con datos */}
      <div style={{ padding: "24px 26px 30px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 22px" }}>
          {rows.map((r) => (
            <div key={r.key} style={{ gridColumn: r.key === "addressLine" ? "1 / -1" : undefined }}>
              <div style={{ fontWeight: 600, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: p.primary }}>{r.label}</div>
              <div style={{ fontWeight: 500, fontSize: 14, color: "#fff", marginTop: 4 }}>
                {r.href ? (
                  <a href={r.href} style={{ color: "#fff" }} target="_blank" rel="noopener noreferrer">
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
          style={{ display: "block", marginTop: 26, padding: 15, borderRadius: 999, background: "#fff", color: ink, fontWeight: 700, fontSize: 15, textAlign: "center", textDecoration: "none" }}
        >
          Guardar contacto
        </a>
      </div>
    </div>
  );
}
