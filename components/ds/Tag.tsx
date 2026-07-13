import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  variant?: "outline" | "accent" | "solid";
  className?: string;
}

/** BOWJE Tag — chip en mayúsculas con tracking ancho. */
export function Tag({ children, variant = "outline", className = "" }: Props) {
  return <span className={`bw-tag bw-tag--${variant} ${className}`.trim()}>{children}</span>;
}
