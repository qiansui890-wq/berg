import { InputHTMLAttributes, ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  /** Leading adornment (icon). */
  iconLeft?: ReactNode;
  /** Trailing adornment (icon, unit, clear button). */
  trailing?: ReactNode;
}

/** Single-line text field. Pair with Field for label, hint, and error. */
export function Input(props: InputProps): JSX.Element;
