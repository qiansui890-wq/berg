import { ReactNode, MouseEventHandler } from "react";
export interface ToastProps {
  tone?: "neutral" | "success" | "danger" | "warning" | "info";
  title?: ReactNode;
  icon?: ReactNode;
  onClose?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
}
/** Presentational notification card; caller controls mounting & dismissal. */
export function Toast(props: ToastProps): JSX.Element;
