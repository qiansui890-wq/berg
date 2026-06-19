# Pagination

Controlled prev / numbered / next pager with ellipsis collapsing. The active page is an ink chip.

```jsx
const { Pagination } = window.BergPCDesignSystem_eb13e3;
const [page, setPage] = React.useState(1);
<Pagination page={page} pageCount={12} onChange={setPage} />
```

Use under long case tables, document lists, and activity logs. `siblingCount` controls how many pages flank the current one before collapsing to “…”.
