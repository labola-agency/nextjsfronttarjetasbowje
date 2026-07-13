interface Props {
  size?: number;
  className?: string;
  /** Punto verde tras el wordmark (como en la marca). */
  dot?: boolean;
}

/**
 * BOWJE Wordmark — el logotipo escribe la J en minúscula: "BOWjE".
 */
export function Wordmark({ size = 28, className = "", dot = true }: Props) {
  return (
    <span
      className={`inline-flex items-end ${className}`.trim()}
      style={{ fontWeight: 900, fontSize: size, letterSpacing: "-0.01em", lineHeight: 1 }}
    >
      <span>BOW</span>
      <span style={{ textTransform: "lowercase" }}>j</span>
      <span>E</span>
      {dot && (
        <span
          aria-hidden="true"
          style={{
            width: Math.max(4, size * 0.12),
            height: Math.max(4, size * 0.12),
            background: "var(--accent)",
            borderRadius: "50%",
            marginLeft: 3,
            marginBottom: size * 0.12,
          }}
        />
      )}
    </span>
  );
}
