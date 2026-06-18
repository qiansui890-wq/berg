import { ReactNode } from "react";
export interface TooltipProps {
  label: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  children?: ReactNode;
}
/** Ink tooltip bubble shown on hover/focus of its child. */
export function Tooltip(props: TooltipProps): JSX.Element;
