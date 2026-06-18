import { ReactNode, ChangeEventHandler } from "react";
export interface SwitchProps {
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  label?: ReactNode;
  id?: string;
}
/** Toggle switch for settings; ink-black track when on. */
export function Switch(props: SwitchProps): JSX.Element;
