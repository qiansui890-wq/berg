# AttorneyCard

Profile card for an attorney or team member: headshot, name, role eyebrow, a short bio, and optional credential tags. Used on the Team page, in case-team rosters (portal/dashboard), and anywhere the firm's people appear.

```jsx
const { AttorneyCard } = window.BergPCDesignSystem_eb13e3;

<AttorneyCard
  name="Geoffrey Berg"
  role="Trial Lawyer, Managing Partner"
  photo="https://…/geoffrey-berg.jpg"
  bio="Founded Berg PC in 2001. 30+ years of trial wins in business and cryptocurrency litigation; leads the firm's crypto fraud & recovery practice."
  credentials={["Crypto Recovery", "Business Litigation", "Trials"]}
  href="https://bergpc.com/lawyers/geoffrey-berg/"
/>
```

## Props
- `name`, `role`, `bio` — text.
- `photo` — headshot URL. If it's missing or fails to load, the card shows the person's **serif initials** knocked out of a navy field (brand fallback). Always safe to omit.
- `credentials` — array of short focus/credential strings rendered as stone tags.
- `href` — when set, the whole card becomes a link.
- `orientation` — `"portrait"` (default; photo on top, full bio, stone rule) or `"row"` (compact: circular photo beside name/role — good for case-team lists and sidebars).

## Guidance
- Use **portrait** in a `grid` (3 across on the Team page); use **row** in dense rosters.
- Keep bios to 1–2 sentences in the firm's voice (authoritative, plain-spoken).
- Real Berg PC roster: Geoffrey Berg (Managing Partner), James C. Plummer (Senior Partner), Kathryn E. Nelson (Partner), Gil Melman (Of Counsel — transactions), Tracy Moebes (Business Manager).
