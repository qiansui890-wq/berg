import { ReactNode } from "react";
export interface StatProps {
  label?: ReactNode;
  value: ReactNode;
  caption?: ReactNode;
  delta?: ReactNode;
  deltaTone?: "success" | "danger" | "neutral";
  align?: "left" | "center";
}
/** Headline metric (serif value) for results blocks and dashboards. */
export function Stat(props: StatProps): JSX.Element;
