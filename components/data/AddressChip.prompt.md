One-line: The firm's signature data element — a mono, middle-truncated wallet address or tx hash with one-click copy and an optional trace-role dot.

```jsx
<AddressChip address="bc1q9zk2m4f8x3v0rd7t6yqe2h5n8s4p1w0c9j6l3" role="tainted" />
<AddressChip address="0xa3f19c...e7b204" role="exchange" lead={8} tail={6} />
```
`role` colors the dot from the forensic trace palette (tainted/hop/exchange/mixer/frozen).
