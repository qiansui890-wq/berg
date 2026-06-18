import { ReactNode } from "react";
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  /** Footer slot for action buttons. */
  footer?: ReactNode;
  width?: number;
  children?: ReactNode;
}
/** Centered modal over a navy scrim; controlled via open/onClose. */
export function Dialog(props: DialogProps): JSX.Element | null;
