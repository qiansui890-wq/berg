import { ReactNode } from "react";
export interface TableColumn {
  key: string;
  label: ReactNode;
  align?: "left" | "center" | "right";
  width?: string | number;
  /** Custom cell renderer: (value, row) => node. */
  render?: (value: any, row: any) => ReactNode;
}
/** Config-driven data table for case lists, wallet ledgers, and documents.
 * @startingPoint section="Data" subtitle="Data table with custom cells" viewport="760x320" */
export interface TableProps {
  columns: TableColumn[];
  rows: any[];
  /** Field used as React key (default "id"). */
  rowKey?: string;
  onRowClick?: (row: any) => void;
  dense?: boolean;
}
/** Config-driven data table for case lists, wallet ledgers, and documents. */
export function Table(props: TableProps): JSX.Element;
