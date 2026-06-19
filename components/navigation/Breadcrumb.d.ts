export interface BreadcrumbItem {
  label: string;
  /** Link target; omit on the last (current) item. */
  href?: string;
}
export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}
/** Hierarchy trail; the last item is the current page (non-link). */
export function Breadcrumb(props: BreadcrumbProps): JSX.Element;
