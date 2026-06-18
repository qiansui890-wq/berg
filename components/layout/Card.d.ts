import { ReactNode, ElementType } from "react";
/** Base surface — white, hairline border, restrained shadow.
 * @startingPoint section="Layout" subtitle="Card surface + header" viewport="700x260" */
export interface CardProps {
  padding?: "none" | "sm" | "md" | "lg";
  /** Adds hover lift + shadow; use for clickable cards. */
  interactive?: boolean;
  as?: ElementType;
  children?: ReactNode;
  [key: string]: any;
}
export interface CardHeaderProps {
  eyebrow?: ReactNode;
  title?: ReactNode;
  /** Trailing slot (badge, menu button). */
  trailing?: ReactNode;
}
/** Base surface — white, hairline border, restrained shadow. */
export function Card(props: CardProps): JSX.Element;
export function CardHeader(props: CardHeaderProps): JSX.Element;
