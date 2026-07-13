interface Props {
  variant?: "line" | "tick";
  width?: number | string;
  className?: string;
}

/** BOWJE Divider — regla fina (#4F4F4F) o tick verde corto. */
export function Divider({ variant = "line", width, className = "" }: Props) {
  if (variant === "tick") {
    return (
      <span
        aria-hidden="true"
        className={className}
        style={{ display: "block", width: width || 60, height: 2, background: "var(--accent)", borderRadius: 2 }}
      />
    );
  }
  return (
    <hr
      className={className}
      style={{ border: "none", height: 1, width: width || "100%", background: "var(--border-divider)", margin: 0 }}
    />
  );
}
