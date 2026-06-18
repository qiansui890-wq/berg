One-line: Single-line text input with focus ring, optional leading icon and trailing adornment; pair with `Field` for label/hint/error.

```jsx
import { Input } from "./Input";
<Input placeholder="you@email.com" />
<Input iconLeft={<icon.WalletIcon/>} placeholder="bc1q…" invalid />
```

Props: `size` (sm/md/lg), `invalid`, `disabled`, `iconLeft`, `trailing`. Always wrap in `Field` to provide an accessible label and validation copy.
