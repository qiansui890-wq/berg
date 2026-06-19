# Stepper

Horizontal progress through case stages. Pass `steps` (strings or `{label, sub}`) and a 0-based `current`; earlier steps render completed (ink + check), the current step gets a stone focus ring, later steps are muted.

```jsx
const { Stepper } = window.BergPCDesignSystem_eb13e3;
<Stepper current={2} steps={["Intake","Investigating","Filed","Frozen","Recovered"]} />
// or the recovery method flow:
<Stepper current={1} steps={[{label:"Trace",sub:"on-chain"},{label:"Identify"},{label:"Freeze"},{label:"Recover"}]} />
```

Use for case-progress headers in the portal/dashboard and the recovery-strategy flow. Keep to 3–6 steps.
