
type Glyph = "plus" | "arrow" | "arrowUpRight" | "linkedin" | "phone" | "mail" | "globe";
type Variant = "hairline" | "solid";

interface Props {
  icon?: Glyph;
  variant?: Variant;
  size?: number;
  ariaLabel?: string;
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

function glyphPath(icon: Glyph) {
  switch (icon) {
    case "plus":
      return (
        <g strokeWidth="1.25" strokeLinecap="round">
          <line x1="12" y1="6.5" x2="12" y2="17.5" />
          <line x1="6.5" y1="12" x2="17.5" y2="12" />
        </g>
      );
    case "arrow":
      return (
        <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1="5" y1="12" x2="18" y2="12" />
          <polyline points="12.5,6.5 19,12 12.5,17.5" />
        </g>
      );
    case "arrowUpRight":
      return (
        <g strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="8.5,7 17,7 17,15.5" />
        </g>
      );
    case "linkedin":
      return (
        <g fill="currentColor" stroke="none">
          <path d="M6.94 8.5H4.3V19h2.64V8.5ZM5.62 4a1.53 1.53 0 1 0 0 3.06 1.53 1.53 0 0 0 0-3.06ZM19.7 19v-5.77c0-2.86-1.53-4.19-3.57-4.19a3.08 3.08 0 0 0-2.79 1.53V8.5H10.7c.04.79 0 10.5 0 10.5h2.64v-5.86c0-.32.02-.63.12-.86.25-.63.83-1.28 1.8-1.28 1.27 0 1.78.97 1.78 2.39V19h2.66Z" />
        </g>
      );
    case "phone":
      return (
        <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 4.5 6a2 2 0 0 1 2-2Z" />
        </g>
      );
    case "mail":
      return (
        <g strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <rect x="4" y="6" width="16" height="12" rx="1" />
          <polyline points="4,7 12,13 20,7" />
        </g>
      );
    case "globe":
      return (
        <g strokeWidth="1.4" fill="none">
          <circle cx="12" cy="12" r="8" />
          <path d="M4 12h16M12 4c2.5 2.5 2.5 13 0 16M12 4c-2.5 2.5-2.5 13 0 16" />
        </g>
      );
  }
}

/**
 * BOWJE IconButton — control circular. Hairline (línea fina) o solid (verde).
 */
export function IconButton({
  icon = "plus",
  variant = "hairline",
  size = 40,
  ariaLabel,
  as = "button",
  href,
  target,
  rel,
  className = "",
  onClick,
  type = "button",
}: Props) {
  const cls = `bw-iconbtn bw-iconbtn--${variant} ${className}`.trim();
  const inner = (
    <svg
      width={size * 0.55}
      height={size * 0.55}
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      {glyphPath(icon)}
    </svg>
  );
  const style = { width: size, height: size };

  if (as === "a") {
    return (
      <a className={cls} style={style} href={href} target={target} rel={rel} aria-label={ariaLabel || icon}>
        {inner}
      </a>
    );
  }
  return (
    <button className={cls} style={style} aria-label={ariaLabel || icon} onClick={onClick} type={type}>
      {inner}
    </button>
  );
}
