import { SelectHTMLAttributes } from "react";
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
}
/** Native select styled to match Input, with a chevron affordance. */
export function Select(props: SelectProps): JSX.Element;
