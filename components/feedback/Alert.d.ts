import { ReactNode, MouseEventHandler } from "react";
export interface AlertProps {
  tone?: "info" | "success" | "warning" | "danger" | "neutral";
  title?: ReactNode;
  /** Leading icon node (Lucide recommended). */
  icon?: ReactNode;
  onClose?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
}
/** Inline banner for guidance, warnings, and confirmations. */
export function Alert(props: AlertProps): JSX.Element;
