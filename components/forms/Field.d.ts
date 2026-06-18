import { ReactNode } from "react";

export interface FieldProps {
  label?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  /** Helper text shown below when there is no error. */
  hint?: ReactNode;
  /** Error message; overrides hint and turns copy danger-colored. */
  error?: ReactNode;
  children?: ReactNode;
}

/** Form-row wrapper: label, required mark, hint, and error around any control. */
export function Field(props: FieldProps): JSX.Element;
