One-line: Berg PC's primary action button — ink-black by default, with accent / secondary / ghost / danger variants in three sizes.

```jsx
import { Button } from "./Button";

<Button variant="primary" size="md">Tell Us About Your Case</Button>
<Button variant="secondary" iconLeft={<icon.PhoneIcon/>}>Call the firm</Button>
<Button variant="accent">Start recovery intake</Button>
<Button variant="ghost" size="sm">Cancel</Button>
```

Variants: `primary` (ink-black, the default CTA), `accent` (warm stone), `secondary` (outlined), `ghost` (text-only), `danger`. Sizes: `sm | md | lg`. Pass `fullWidth` for form footers, `iconLeft` / `iconRight` for icons. Use ONE primary per view; pair with a secondary, never two primaries side by side.
