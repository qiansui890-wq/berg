import { ReactNode, ChangeEventHandler } from "react";
export interface RadioProps {
  checked?: boolean;
  name?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  label?: ReactNode;
  id?: string;
}
/** Single radio option; group several with a shared `name`. */
export function Radio(props: RadioProps): JSX.Element;
