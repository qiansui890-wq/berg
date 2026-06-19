# Berg PC Case Platform — Go Live

Two parts: **(A) the database** (Supabase, so everyone shares data) and **(B) hosting** (a public web address). Both have free tiers. ~20 minutes.

---

## A. Database (Supabase)

1. Go to **supabase.com** → sign up → **New project**. Pick a region near Houston (e.g. `us-east-1`). Save the database password.
2. Open **SQL Editor** → **New query** → paste ALL of `supabase/schema.sql` → **Run**. (Creates tables, security, triggers.)
3. **Authentication → Providers → Email** → turn **"Confirm email" OFF** for now (lets accounts log in immediately). Turn back on later for production.
4. **Project Settings → API** → copy your **Project URL** and **anon public key**.
5. Open `app-supabase/config.js`, paste both values, save.
6. Create your admin: in **Authentication → Users → Add user** (email + password), then **SQL Editor**:
   ```sql
   update public.profiles set role='admin' where email='you@bergpc.com';
   ```

## B. Hosting (pick one — all free)

The whole **project folder** is a static site. Easiest options:

**Option 1 — Netlify Drop (no account math, fastest)**
- Go to **app.netlify.com/drop** → drag the entire project folder onto the page → it gives you a live URL in seconds.
- **Public site (the one link you share):** `https://<name>.netlify.app/` — the firm landing page.
- **App / login** is one click in, at `https://<name>.netlify.app/app-supabase/index.html` (the landing's "Client login" button already points here).

**Option 2 — Vercel / Netlify from GitHub (best for updates)**
- Push the project to a GitHub repo → import it in Vercel or Netlify → deploy. Re-deploys automatically when you push changes.

**Option 3 — Cloudflare Pages**
- pages.cloudflare.com → upload the folder → done.

> The **root `index.html`** is the public firm site — share that one link. Its "Client login" / "Tell us about your case" buttons open the app at `app-supabase/index.html`. (Prefer landing people straight on the login screen? Share the `app-supabase/index.html` URL instead.)

## C. First run

1. Open your live URL → click **Client login** → sign in as the admin you created.
2. **Create all attorney accounts in one click:**
   - The real roster + emails live in `app-supabase/attorneys.js` (Geoffrey Berg, Kathryn E. Nelson, Tomas Tijerina, Lisa Clark, Denise Pack, Frank Feltes).
   - Go to **User management → “Create attorney accounts”**. All are registered at once (role: attorney, initial password `BergPC-Welcome-2026`). Their headshots appear automatically in the user list and assignment screens.
   - Each attorney then signs in and resets their password via **“Forgot your password?”** (works once Site URL is set — see Fix B below). Change the shared initial password by editing `BERG_ATTORNEY_PW` in `attorneys.js`.
3. **Client assignment** → route each case to an attorney (only that attorney can see it).
4. **Clients** self-register from the login screen using an **invite code** (below).

### Invite-only client registration
- Codes live in `app-supabase/config.js` → `BERG_INVITE_CODES` (currently `BERGPC-2026`, `BERGPC-VIP`, `RECOVERY-2026`, `COINBASE-BREACH`, `META-SCAM-ADS`). Give a code to each invited client; add/rotate by editing the list and re-deploying.
- A lawyer can also pre-create a client login: **lawyer workspace → “New client login”**.
- To allow open self-registration, set `BERG_INVITE_REQUIRED = false` in `config.js`.

---

## Troubleshooting: "This site can't be reached" after clicking the confirmation email

This happens when **email confirmation is ON** but Supabase doesn't know your real web address, so the link in the email points to the default `http://localhost:3000` — which only works on the developer's own machine.

**Pick ONE fix:**

**Fix A — turn confirmation OFF (fastest, fine for launch/testing)**
Supabase → **Authentication → Providers → Email** → turn **"Confirm email" OFF** → Save.
New accounts then sign in immediately, no email step. (The app already handles this — registration logs you straight in.)

**Fix B — keep confirmation ON and point the link at your live site (do this before real clients)**
Supabase → **Authentication → URL Configuration**:
- **Site URL:** your deployed app, e.g. `https://your-site.netlify.app/app-supabase/index.html`
- **Redirect URLs:** add the same URL (and your custom domain if you have one).
Save. Now the confirmation link lands on the real app instead of localhost.

> With confirmation ON, the app no longer errors after sign-up — it shows *"Check your inbox — we sent a confirmation link…"* and switches to the sign-in screen. The user confirms, then signs in. If they try to sign in before confirming, they get a clear "please confirm your email first" message.

## Custom domain (optional)
All three hosts let you attach a domain like `app.bergppc.com` in their dashboard (add a DNS record they show you).

## Before real client data — checklist
- [ ] Turn **email confirmation ON** (Supabase → Auth).
- [ ] Enable **MFA** for attorney/admin accounts (Supabase supports it).
- [ ] Turn on **Point-in-Time Recovery / backups** (Supabase → Database).
- [ ] Create a private **Storage bucket** `evidence` if you want real file uploads (see `supabase/README.md`).
- [ ] Confirm your data region meets your compliance needs.

## Costs
- Supabase free tier: plenty for a small firm. Paid (~$25/mo) adds more storage, backups, no project pausing.
- Netlify/Vercel/Cloudflare: free tier is enough for this app.

---
**Stuck on any step?** Tell me which one and I'll walk you through it. I can also adjust the code (e.g. lock registration to invite-only, change the landing page, add file uploads) before you deploy.
