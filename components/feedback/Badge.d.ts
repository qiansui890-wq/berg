import { ReactNode } from "react";
export interface BadgeProps {
  tone?: "neutral" | "accent" | "success" | "danger" | "warning" | "info";
  variant?: "soft" | "solid";
  size?: "sm" | "md";
  iconLeft?: ReactNode;
  children?: ReactNode;
}
/** Compact status label — case stages, result tags, risk levels. */
export function Badge(props: BadgeProps): JSX.Element;
