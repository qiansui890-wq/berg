export interface AvatarProps {
  name?: string;
  /** Optional photo URL; falls back to initials. */
  src?: string;
  size?: number;
  tone?: "navy" | "stone" | "ink";
}
/** Circular avatar — initials or photo — for attorneys, investigators, and clients. */
export function Avatar(props: AvatarProps): JSX.Element;
