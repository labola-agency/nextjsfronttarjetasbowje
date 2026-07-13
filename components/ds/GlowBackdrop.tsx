interface Props {
  size?: number;
  top?: number | string;
  left?: number | string;
  opacity?: number;
}

/**
 * BOWJE GlowBackdrop — el orbe verde de fondo. Úsalo con moderación: uno por
 * viewport, tras una afirmación clave.
 */
export function GlowBackdrop({ size = 560, top = "10%", left = "50%", opacity = 0.5 }: Props) {
  return (
    <span
      aria-hidden="true"
      className="bw-glow"
      style={{
        width: size,
        height: size,
        top,
        left,
        transform: "translateX(-50%)",
        opacity,
      }}
    />
  );
}
