import { Avatar, isVisible, theme, type CardTemplateProps } from "./shared";

interface Row {
  label: string;
  value?: string | null;
  href?: string;
  field: string;
}

/**
 * Plantilla Corporate — estructura formal: cabecera con foto + nombre/cargo y
 * un bloque de datos de contacto con etiquetas.
 */
export function Corporate({ card }: CardTemplateProps) {
  const t = theme(card);

  const rows: Row[] = [
    { label: "Empresa", value: card.company, field: "company" },
    { label: "Teléfono", value: card.phone, href: `tel:${card.phone}`, field: "phone" },
    { label: "Móvil", value: card.mobile, href: `tel:${card.mobile}`, field: "mobile" },
    { label: "Email", value: card.email, href: `mailto:${card.email}`, field: "email" },
    { label: "Web", value: card.website, href: card.website || undefined, field: "website" },
    {
      label: "Dirección",
      value: [card.addressLine, card.postalCode, card.city, card.country].filter(Boolean).join(", ") || null,
      field: "addressLine",
    },
    { label: "LinkedIn", value: card.linkedin, href: card.linkedin || undefined, field: "linkedin" },
  ].filter((r) => r.value && isVisible(card, r.field));

  return (
    <div style={{ color: t.text }}>
      <div className="flex items-center gap-5">
        <Avatar card={card} accent={t.primary} size={88} square />
        <div className="flex flex-col gap-1">
          <h1 style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.05 }}>{card.displayName}</h1>
          {isVisible(card, "jobTitle") && card.jobTitle && (
            <p style={{ fontSize: 15, color: t.primary, fontWeight: 600 }}>{card.jobTitle}</p>
          )}
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{ width: 60, height: 2, background: t.primary, borderRadius: 2, margin: "24px 0" }}
      />

      <dl className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-4 items-baseline">
            <dt
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                minWidth: 90,
              }}
            >
              {r.label}
            </dt>
            <dd style={{ textAlign: "right", fontSize: 15, margin: 0, wordBreak: "break-word" }}>
              {r.href ? (
                <a href={r.href} target="_blank" rel="noopener noreferrer" style={{ color: t.text }}>
                  {r.value}
                </a>
              ) : (
                r.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
