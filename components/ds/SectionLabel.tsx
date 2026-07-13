import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  tickWidth?: number;
  className?: string;
}

/**
 * BOWJE SectionLabel — etiqueta en sentence-case con un tick verde debajo.
 * Marca el inicio de cada sección.
 */
export function SectionLabel({ children, tickWidth = 60, className = "" }: Props) {
  return (
    <div className={`inline-flex flex-col gap-3 ${className}`.trim()}>
      <span style={{ fontSize: 24, fontWeight: 400, lineHeight: 1 }}>{children}</span>
      <span
        aria-hidden="true"
        style={{ width: tickWidth, height: 2, background: "var(--accent)", borderRadius: 2 }}
      />
    </div>
  );
}
