import { Avatar, ContactLinks, isVisible, theme, type CardTemplateProps } from "./shared";

/**
 * Plantilla Minimal — centrada, limpia, mucho aire. Foto/iniciales, nombre,
 * cargo y empresa discretos, y la fila de contacto.
 */
export function Minimal({ card }: CardTemplateProps) {
  const t = theme(card);
  return (
    <div
      className="flex flex-col items-center text-center gap-5"
      style={{ color: t.text }}
    >
      <Avatar card={card} accent={t.primary} size={128} />
      <div className="flex flex-col gap-1">
        <h1 style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
          {card.displayName}
        </h1>
        {isVisible(card, "jobTitle") && card.jobTitle && (
          <p style={{ fontSize: 16, color: t.primary, fontWeight: 600 }}>{card.jobTitle}</p>
        )}
        {isVisible(card, "company") && card.company && (
          <p style={{ fontSize: 15, color: "var(--text-muted)" }}>{card.company}</p>
        )}
      </div>
      <ContactLinks card={card} accent={t.primary} />
      {card.config?.tagline && (
        <p
          style={{
            marginTop: 8,
            fontSize: 11,
            letterSpacing: "0.18em",
            color: "var(--text-muted)",
            textTransform: "uppercase",
          }}
        >
          {card.config.tagline}
        </p>
      )}
    </div>
  );
}
