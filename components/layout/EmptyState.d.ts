import { ReactNode } from "react";

export interface EmptyStateProps {
  /** Icon node shown in a stone chip (e.g. a Lucide <i data-lucide>). */
  icon?: ReactNode;
  title?: string;
  description?: ReactNode;
  /** Primary action, e.g. a <Button>. */
  action?: ReactNode;
}
/** Centered placeholder for empty tables, searches, inboxes, and dashboards. */
export function EmptyState(props: EmptyStateProps): JSX.Element;
