One-line: Squared checkbox, ink-black when selected, with optional inline label — used for disclaimers and multi-select.

```jsx
<Checkbox id="agree" checked={ok} onChange={e=>setOk(e.target.checked)} label="I have read and agree with the foregoing." />
```
Controlled (`checked`+`onChange`) or uncontrolled (`defaultChecked`).
