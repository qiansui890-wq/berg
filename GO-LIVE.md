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
- Your app is at `https://<name>.netlify.app/app-supabase/index.html`.

**Option 2 — Vercel / Netlify from GitHub (best for updates)**
- Push the project to a GitHub repo → import it in Vercel or Netlify → deploy. Re-deploys automatically when you push changes.

**Option 3 — Cloudflare Pages**
- pages.cloudflare.com → upload the folder → done.

> Set the landing page to `app-supabase/index.html` (the backend build), not the root.

## C. First run

Open your live URL → sign in as the admin you created → **User management** to add attorneys → **Client assignment** to route cases. Clients self-register from the login screen.

---

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
