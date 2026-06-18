import { ReactNode, MouseEventHandler } from "react";
export interface TagProps {
  children?: ReactNode;
  iconLeft?: ReactNode;
  /** When provided, renders a remove (×) button. */
  onRemove?: MouseEventHandler<HTMLButtonElement>;
}
/** Outlined, optionally removable label — filters, selected exchanges/platforms. */
export function Tag(props: TagProps): JSX.Element;
