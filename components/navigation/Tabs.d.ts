import { ReactNode } from "react";
export interface TabItem { id: string; label: ReactNode; icon?: ReactNode; }
export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange?: (id: string) => void;
}
/** Underlined tab bar with ink active indicator (controlled). */
export function Tabs(props: TabsProps): JSX.Element;
