import { ReactNode, ButtonHTMLAttributes } from "react";

/**
 * Primary call-to-action and form button for Berg PC.
 * @startingPoint section="Forms" subtitle="Button variants & sizes" viewport="700x180"
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Primary = ink-black; accent = stone; secondary = outlined; ghost = quiet. */
  variant?: "primary" | "accent" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  fullWidth?: boolean;
  /** Node rendered before the label (e.g. a Lucide icon). */
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
}

/**
 * Primary call-to-action and form button for Berg PC.
 */
export function Button(props: ButtonProps): JSX.Element;
