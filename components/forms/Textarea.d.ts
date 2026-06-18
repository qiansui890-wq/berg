import { TextareaHTMLAttributes } from "react";
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  disabled?: boolean;
  rows?: number;
}
/** Multi-line text field; matches Input's focus treatment. */
export function Textarea(props: TextareaProps): JSX.Element;
