import { ReactNode, ButtonHTMLAttributes } from "react";
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "outline" | "solid";
  size?: "sm" | "md" | "lg";
  shape?: "square" | "round";
  disabled?: boolean;
  /** Accessible label (also the tooltip title) — required for icon-only buttons. */
  label: string;
  children?: ReactNode;
}
/** Icon-only button for toolbars, table rows, and dialog close. */
export function IconButton(props: IconButtonProps): JSX.Element;
