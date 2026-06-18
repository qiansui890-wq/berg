One-line: Icon-only button (ghost / outline / solid) for toolbars, table rows, and dialog close — always give it a `label`.

```jsx
<IconButton label="Download report" variant="outline"><icon.DownloadIcon/></IconButton>
<IconButton label="Close" shape="round"><icon.XIcon/></IconButton>
```
`label` is required (accessible name + tooltip).
