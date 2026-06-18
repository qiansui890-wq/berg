import { ReactNode, ChangeEventHandler } from "react";
export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  label?: ReactNode;
  id?: string;
}
/** Squared checkbox with ink-black selected state; optional inline label. */
export function Checkbox(props: CheckboxProps): JSX.Element;
