One-line: Form-row wrapper that adds a label, required asterisk, hint text, and error message around any control.

```jsx
<Field label="Email" htmlFor="email" required hint="We reply within one business day.">
  <Input id="email" type="email" />
</Field>
<Field label="Amount lost" error="Enter a valid figure."><Input invalid /></Field>
```

`error` overrides `hint`. Set the control's `id` to match `htmlFor`.
