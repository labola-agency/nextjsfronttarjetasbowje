import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children?: ReactNode;
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & { as?: "button" };
type LinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & { as: "a"; href: string };

type Props = ButtonProps | LinkProps;

/**
 * BOWJE Button — píldora. La marca solo usa botones totalmente redondeados.
 */
export function Button(props: Props) {
  const {
    variant = "primary",
    size = "md",
    iconLeft,
    iconRight,
    className = "",
    children,
    ...rest
  } = props;
  const cls = `bw-btn bw-btn--${size} bw-btn--${variant} ${className}`.trim();

  if (props.as === "a") {
    const { as: _as, ...anchorRest } = rest as LinkProps;
    void _as;
    return (
      <a className={cls} {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {iconLeft}
        {children}
        {iconRight}
      </a>
    );
  }

  const { as: _as, ...buttonRest } = rest as ButtonProps;
  void _as;
  return (
    <button className={cls} {...(buttonRest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
