# Breadcrumb

Hierarchy trail above a page title. The last item is the current page (ink, non-link); earlier items link via `href`. Stone chevron separators.

```jsx
const { Breadcrumb } = window.BergPCDesignSystem_eb13e3;
<Breadcrumb items={[
  { label: "Cases", href: "#/cases" },
  { label: "BPC-2025-0417", href: "#/cases/417" },
  { label: "Asset trace" },
]} />
```
