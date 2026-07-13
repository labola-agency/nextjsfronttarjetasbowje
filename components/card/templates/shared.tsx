import type { CSSProperties } from "react";
import type { CardPublic, CardTheme } from "@/lib/types";
import { IconButton } from "@/components/ds";
import { logoSrc, vcardUrl } from "@/lib/api";

export interface CardTemplateProps {
  card: CardPublic;
}

/** Marca de cabecera: logo subido de la empresa o, si no, su nombre. */
export function brand(card: CardPublic): { logo?: string; name: string } {
  const emp = card.empresa && typeof card.empresa === "object" ? card.empresa : null;
  return { logo: logoSrc(emp?.logoUrl), name: emp?.name || card.company || "Bowje" };
}

/** URL de descarga vCard (botón "Guardar contacto"). */
export function saveHref(card: CardPublic): string {
  return vcardUrl(card.id);
}

/**
 * URL para pintar la foto del contacto: la ruta relativa (/uploads/…) se sirve
 * desde el backend, igual que el logo. Devuelve undefined si no hay foto.
 */
export function photoSrc(card: CardPublic): string | undefined {
  return logoSrc(card.config?.photoUrl);
}

/**
 * Punto focal de la foto para `object-position` (p. ej. "50% 30%"). Permite
 * reencuadrar la foto recortada por object-fit:cover. Defecto: centrado.
 */
export function photoPos(card: CardPublic): string {
  const p = card.config?.photoPosition;
  const x = p?.x ?? 50;
  const y = p?.y ?? 50;
  return `${x}% ${y}%`;
}

/** Encaje de la foto: "cover" recorta (defecto); "contain" la muestra entera. */
export function photoFit(card: CardPublic): "cover" | "contain" {
  return card.config?.photoFit === "contain" ? "contain" : "cover";
}

interface PhotoImgProps {
  card: CardPublic;
  /** Estilos del área de la foto (tamaño, borde, borderRadius…). */
  style?: CSSProperties;
}

/**
 * Imagen de la foto según el modo de encaje elegido en el editor:
 * - "cover": recortada llenando el área, con el punto focal (photoPosition).
 * - "contain": la foto entera centrada; los huecos se rellenan con la misma
 *   foto difuminada de fondo (así nada se corta, p. ej. en el banner Editorial).
 */
export function PhotoImg({ card, style }: PhotoImgProps) {
  const src = photoSrc(card);
  if (!src) return null;

  if (photoFit(card) === "cover") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={card.displayName} style={{ objectFit: "cover", objectPosition: photoPos(card), ...style }} />
    );
  }

  return (
    <div style={{ position: "relative", overflow: "hidden", ...style }}>
      {/* Fondo: la misma foto difuminada rellena los huecos. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px)", transform: "scale(1.15)" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.18)" }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={card.displayName} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
}

const BOWJE = { primary: "#54D222", bg: "#1C1C1E", text: "#FFFFFF" };

export function theme(card: CardPublic): Required<NonNullable<CardTheme["colors"]>> {
  const c = card.config?.colors || {};
  return {
    primary: c.primary || BOWJE.primary,
    bg: c.bg || BOWJE.bg,
    text: c.text || BOWJE.text,
  };
}

// Fuentes (variables CSS definidas en app/layout.tsx).
export const FONT_SANS_DARK = "var(--font-space-grotesk), system-ui, sans-serif";
export const FONT_MONO = "var(--font-ibm-plex-mono), ui-monospace, monospace";
export const FONT_SANS_LIGHT = "var(--font-archivo), system-ui, sans-serif";

export interface Palette {
  family: "dark" | "light";
  primary: string;
  pageBg: string;
  cardBg: string;
  text: string;
  muted: string;
  hairline: string;
  border: string;
  sans: string;
  mono: string;
}

// Paletas de familia. Solo `primary` cambia por empresa; el resto de tonos son
// constantes del diseño (familia oscura Bowje / familia clara everyoneplus).
const DARK_FAMILY = {
  family: "dark" as const,
  pageBg: "#0e0e0e",
  cardBg: "#141414",
  text: "#ffffff",
  muted: "rgba(255,255,255,.4)",
  hairline: "rgba(255,255,255,.08)",
  border: "rgba(255,255,255,.13)",
  sans: FONT_SANS_DARK,
  mono: FONT_MONO,
};
const LIGHT_FAMILY = {
  family: "light" as const,
  pageBg: "#F3EFE7",
  cardBg: "#ffffff",
  text: "#141210",
  muted: "rgba(20,18,16,.45)",
  hairline: "rgba(20,18,16,.08)",
  border: "rgba(20,18,16,.12)",
  sans: FONT_SANS_LIGHT,
  mono: FONT_SANS_LIGHT,
};

/** Familia visual de la tarjeta a partir del layout ("clara-*" = claro). */
export function familyOf(card: CardPublic): "dark" | "light" {
  return (card.config?.layout || "").startsWith("clara") ? "light" : "dark";
}

/** Paleta completa de la tarjeta: constantes de familia + primario de la empresa. */
export function resolvePalette(card: CardPublic): Palette {
  const base = familyOf(card) === "light" ? LIGHT_FAMILY : DARK_FAMILY;
  return { ...base, primary: theme(card).primary };
}

/** Iniciales (máx. 2) del nombre para el avatar de respaldo. */
export function initials(name?: string | null): string {
  return (name || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
}

export interface ContactRow {
  key: string;
  label: string;
  value: string;
  href?: string;
}

/** Datos de contacto visibles y con valor, en orden, ya listos para pintar. */
export function contactRows(card: CardPublic): ContactRow[] {
  const address = [card.addressLine, card.postalCode, card.city, card.country].filter(Boolean).join(", ");
  const rows: ContactRow[] = [
    { key: "company", label: "Empresa", value: card.company || "" },
    { key: "phone", label: "Teléfono", value: card.phone || "", href: card.phone ? `tel:${card.phone}` : undefined },
    { key: "mobile", label: "Móvil", value: card.mobile || "", href: card.mobile ? `tel:${card.mobile}` : undefined },
    { key: "email", label: "Email", value: card.email || "", href: card.email ? `mailto:${card.email}` : undefined },
    { key: "website", label: "Web", value: (card.website || "").replace(/^https?:\/\//, ""), href: card.website || undefined },
    { key: "addressLine", label: "Dirección", value: address },
    { key: "linkedin", label: "LinkedIn", value: (card.linkedin || "").replace(/^https?:\/\/(www\.)?linkedin\.com/, ""), href: card.linkedin || undefined },
  ];
  return rows.filter((r) => r.value && isVisible(card, r.key));
}

export function isVisible(card: CardPublic, field: string): boolean {
  const vf = card.config?.visibleFields;
  // Si no hay lista, todo visible.
  if (!vf || vf.length === 0) return true;
  return vf.includes(field);
}

interface ContactLinksProps {
  card: CardPublic;
  accent: string;
  size?: number;
}

/** Fila de iconos de contacto (tel, móvil, email, web, linkedin). */
export function ContactLinks({ card, accent, size = 44 }: ContactLinksProps) {
  const links: { icon: "phone" | "mail" | "globe" | "linkedin"; href: string; label: string; show: boolean }[] = [
    { icon: "phone", href: `tel:${card.mobile || card.phone}`, label: "Llamar", show: isVisible(card, "mobile") && !!(card.mobile || card.phone) },
    { icon: "mail", href: `mailto:${card.email}`, label: "Email", show: isVisible(card, "email") && !!card.email },
    { icon: "globe", href: card.website || "#", label: "Web", show: isVisible(card, "website") && !!card.website },
    { icon: "linkedin", href: card.linkedin || "#", label: "LinkedIn", show: isVisible(card, "linkedin") && !!card.linkedin },
  ];

  const visible = links.filter((l) => l.show);
  if (visible.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {visible.map((l) => (
        <IconButton
          key={l.icon}
          as="a"
          href={l.href}
          target={l.icon === "globe" || l.icon === "linkedin" ? "_blank" : undefined}
          rel="noopener noreferrer"
          icon={l.icon}
          variant="hairline"
          size={size}
          ariaLabel={l.label}
          className="!text-[color:var(--accent-color)]"
        />
      ))}
    </div>
  );
}

interface PhotoProps {
  card: CardPublic;
  size: number;
  shape?: "circle" | "square";
  borderColor: string;
  /** Color de las iniciales de respaldo. */
  accent: string;
}

/** Foto del contacto (config.photoUrl) o, si no hay, sus iniciales. */
export function Photo({ card, size, shape = "circle", borderColor, accent }: PhotoProps) {
  const photo = photoSrc(card);
  const radius = shape === "circle" ? "50%" : 0;
  if (photo) {
    return <PhotoImg card={card} style={{ width: size, height: size, borderRadius: radius, border: `1.5px solid ${borderColor}` }} />;
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        border: `1.5px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.34,
        fontWeight: 700,
        color: accent,
      }}
    >
      {initials(card.displayName)}
    </div>
  );
}

interface AvatarProps {
  card: CardPublic;
  accent: string;
  size?: number;
  square?: boolean;
}

/** Avatar: foto si existe, si no las iniciales sobre hairline. */
export function Avatar({ card, accent, size = 120, square = false }: AvatarProps) {
  const photo = photoSrc(card);
  const initials = (card.displayName || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  if (photo) {
    return (
      <PhotoImg
        card={card}
        style={{ width: size, height: size, borderRadius: square ? 0 : "50%", border: "0.5px solid rgba(255,255,255,0.2)" }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: square ? 0 : "50%",
        border: `0.5px solid ${accent}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.34,
        fontWeight: 700,
        color: accent,
      }}
    >
      {initials}
    </div>
  );
}
