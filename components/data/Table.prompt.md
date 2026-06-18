One-line: Config-driven data table (columns + rows) for case lists, wallet ledgers, and document tables.

```jsx
<Table
  columns={[
    { key: "case", label: "Case" },
    { key: "wallet", label: "Wallet", render: (v)=> <AddressChip address={v} role="hop"/> },
    { key: "stage", label: "Stage", render: (v)=> <Badge tone="info">{v}</Badge> },
    { key: "amount", label: "Amount", align: "right" },
  ]}
  rows={cases}
  rowKey="case"
  onRowClick={open}
/>
```
Use `render` to drop in AddressChip / Badge cells. `dense` tightens row height.
