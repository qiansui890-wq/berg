export interface PaginationProps {
  /** 1-based current page. */
  page?: number;
  /** Total number of pages. */
  pageCount?: number;
  /** Called with the next 1-based page number. */
  onChange?: (page: number) => void;
  /** Pages shown on each side of the current page before collapsing to “…”. */
  siblingCount?: number;
}
/** Prev / numbered pages with ellipsis / Next. Controlled. */
export function Pagination(props: PaginationProps): JSX.Element;
