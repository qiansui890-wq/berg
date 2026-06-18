One-line: Toggle switch for binary settings (e.g. case notifications), ink-black when on.

```jsx
<Switch id="notify" checked={on} onChange={e=>setOn(e.target.checked)} label="Email me on case updates" />
```
Use for instant-apply settings, not form submission choices (use Checkbox/Radio there).
