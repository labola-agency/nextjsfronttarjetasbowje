import { ContactLinks, isVisible, theme, type CardTemplateProps } from "./shared";
import { GlowBackdrop } from "@/components/ds";

/**
 * Plantilla Bold — tipografía enorme y glow verde: declaración de marca
 * contundente. El nombre domina el viewport.
 */
export function Bold({ card }: CardTemplateProps) {
  const t = theme(card);
  return (
    <div className="relative flex flex-col items-center text-center gap-6 py-6" style={{ color: t.text }}>
      <GlowBackdrop size={420} top="-8%" opacity={0.45} />
      <div className="relative z-10 flex flex-col items-center gap-4">
        {isVisible(card, "company") && card.company && (
          <p style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: t.primary }}>
            {card.company}
          </p>
        )}
        <h1
          style={{
            fontSize: "clamp(40px, 12vw, 72px)",
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
          }}
        >
          {card.displayName}
        </h1>
        {isVisible(card, "jobTitle") && card.jobTitle && (
          <p style={{ fontSize: 18, fontWeight: 500, color: "var(--text-muted)" }}>{card.jobTitle}</p>
        )}
        <div className="mt-2">
          <ContactLinks card={card} accent={t.primary} size={48} />
        </div>
      </div>
    </div>
  );
}
