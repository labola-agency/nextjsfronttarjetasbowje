import type { CardPublic } from "@/lib/types";
import { OscuraClasica } from "./OscuraClasica";
import { OscuraBloque } from "./OscuraBloque";
import { OscuraEditorial } from "./OscuraEditorial";
import { ClaraLimpia } from "./ClaraLimpia";
import { Clara360 } from "./Clara360";
import { ClaraPop } from "./ClaraPop";
import type { CardTemplateProps } from "./shared";

type TemplateComponent = (props: CardTemplateProps) => React.ReactNode;

/**
 * Registro de plantillas por clave de layout. Familia oscura (Bowje) y familia
 * clara (everyoneplus). Las claves antiguas se mapean por compatibilidad.
 */
export const TEMPLATES: Record<string, TemplateComponent> = {
  "oscura-clasica": OscuraClasica,
  "oscura-bloque": OscuraBloque,
  "oscura-editorial": OscuraEditorial,
  "clara-limpia": ClaraLimpia,
  "clara-360": Clara360,
  "clara-pop": ClaraPop,
  // Alias de layouts antiguos.
  corporate: OscuraClasica,
  bold: OscuraEditorial,
  minimal: OscuraClasica,
};

export function resolveTemplate(card: CardPublic): TemplateComponent {
  const layout = card.config?.layout || "";
  const tplKey =
    card.template && typeof card.template === "object" ? card.template.key : undefined;
  return TEMPLATES[layout] || TEMPLATES[tplKey || ""] || OscuraClasica;
}
