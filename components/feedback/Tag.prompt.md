One-line: Outlined, optionally removable label for filters and selected items (exchanges, jurisdictions, platforms).

```jsx
<Tag>Coinbase</Tag>
<Tag onRemove={()=>drop('Binance')}>Binance</Tag>
```
Pass `onRemove` to show the × button. For status, use Badge instead.
