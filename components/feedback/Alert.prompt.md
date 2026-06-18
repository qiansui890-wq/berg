One-line: Inline banner (left accent rule + tinted field) for guidance, warnings, and confirmations.

```jsx
<Alert tone="warning" title="Beware of recovery scams" icon={<icon.ShieldAlertIcon/>}>
  Berg PC never asks for upfront fees to recover stolen funds.
</Alert>
```
Tones: info / success / warning / danger / neutral. Pass `onClose` for a dismiss button.
