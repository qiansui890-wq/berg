One-line: Underlined, controlled tab bar with an ink active indicator — case detail sections, dashboard views.

```jsx
const [tab,setTab] = React.useState("overview");
<Tabs value={tab} onChange={setTab} items={[
  { id:"overview", label:"Overview" },
  { id:"trace", label:"Asset trace" },
  { id:"docs", label:"Documents" },
]} />
```
Render the active panel yourself based on `value`.
