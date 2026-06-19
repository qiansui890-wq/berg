# EmptyState

Centered placeholder for empty tables, searches, inboxes, and dashboards. Icon sits in a stone chip; optional `action` for the next step.

```jsx
const { EmptyState, Button } = window.BergPCDesignSystem_eb13e3;
<EmptyState
  icon={<i data-lucide="folder-search"></i>}
  title="No cases yet"
  description="New client intakes will appear here once they're filed."
  action={<Button variant="primary">New case</Button>}
/>
```
