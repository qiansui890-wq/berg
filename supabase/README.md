# Berg PC Case Platform — Supabase backend

This turns the demo (browser-only, localStorage) into a **real multi-user system**: data lives in Supabase (hosted Postgres), every attorney sees only their own clients, the admin manages everyone, and sessions sync across devices in real time.

The app keeps its existing synchronous read API — the adapter (`db.supabase.js`) hydrates an in-memory cache from Supabase on login and writes through on every change — so the React screens don't need rewriting. Only the **auth bootstrap becomes async** (three small diffs below).

---

## 1. Create the project & schema

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the entire contents of [`schema.sql`](./schema.sql), and **Run**. This creates the tables, row-level security (RLS) policies, the signup trigger, and realtime.
3. **Auth → Providers → Email**: for easy testing turn **"Confirm email" OFF** (so signups can log in immediately). Turn it back on for production.

## 2. Make yourself an admin

Sign up once through the app (or **Auth → Users → Add user**), then in the SQL Editor:

```sql
update public.profiles set role = 'admin' where email = 'you@yourfirm.com';
```

Create attorneys the same way (sign up, then `set role = 'lawyer'`), or from the admin **User management** screen once you're in.

## 3. Configure the app

Edit [`config.js`](./config.js) with your **Project URL** and **anon public key** (Supabase → Project Settings → API). The anon key is safe in the browser — RLS is what protects the data.

## 4. Wire it into `app/index.html`

**(a)** In `<head>`, add the Supabase SDK + config + adapter, and **remove the old `db.js`**:

```html
<!-- add these -->
<script src="https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
<script src="../supabase/config.js"></script>

<!-- and change the data-layer script tag near the bottom: -->
<!-- BEFORE -->  <script type="text/babel" src="db.js" data-presets="env,react"></script>
<!-- AFTER  -->  <script src="../supabase/db.supabase.js"></script>
```

> `db.supabase.js` is plain JS (no JSX) so it loads as a normal `<script>`, not a Babel one.

**(b)** Boot must restore the session *before* first render. Replace the final render line:

```js
// BEFORE
ReactDOM.createRoot(document.getElementById('root')).render(<Root />);

// AFTER
window.DB.init().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
});
```

## 5. Make login/register await (in `app/auth.jsx`)

`login()`/`register()` are now async (they hit the network). Update the two handlers:

```js
// the submit handler
async function submit(e) {
  e.preventDefault();
  const res = mode === "login"
    ? await window.DB.login(form.email, form.password)
    : await window.DB.register(form);
  if (res.error) { setErr(res.error); return; }
  onAuthed(res.user);
}

// the one-click demo buttons
onClick={async () => { const r = await window.DB.login(email, pw); if (r.user) onAuthed(r.user); }}
```

Also relax the topbar **Reset data** button — `DB.reset()` is disabled on the shared backend (it just warns). Hide that button when on Supabase if you like.

That's it. The rest of the app already calls `window.DB.*`; reads are instant from cache, writes persist to Supabase and re-render via the realtime subscription.

---

## What maps to what

| Demo (`db.js`) | Supabase |
|---|---|
| `users` array | `auth.users` + `public.profiles` (role/name/title) |
| `clients[]` | `public.clients` (RLS: admin = all, lawyer = own, client = own) |
| `wallets / documents / timeline / messages / notes` | child tables, RLS-scoped to the parent case |
| internal notes hidden from clients | `notes` policy excludes the client role |
| `activity` log | `public.activity` (admin + lawyer read) |
| visibility / assignment | `clients.lawyer_id` + RLS — changing it changes who can see the case |

## File uploads (optional, for real evidence)

The demo stores file *metadata* only. For real files:
1. Create a **Storage bucket** named `evidence` (private).
2. On upload, `sb.storage.from('evidence').upload(path, file)`, then save `path` into `documents.storage_key`.
3. To view, generate a signed URL: `sb.storage.from('evidence').createSignedUrl(key, 60)`.

## Security notes for a law firm

- Keep **email confirmation ON** in production; consider MFA (Supabase supports it).
- RLS is enforced server-side — the browser cannot bypass it. The internal-notes policy guarantees clients never read attorney notes.
- Admin account creation: for production, create users via a Supabase **Edge Function** using the service-role key (never put the service key in the browser). The current `addUser` uses normal signup as a convenience.
- Enable **Point-in-Time Recovery** / backups and pick your data region for compliance.
