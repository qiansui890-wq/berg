# Berg PC — Push notifications & deploy

This covers the parts that need YOUR accounts/server. (The apps already do **local** notifications — a banner while the app is open. Below is the **real background push** + go-live.)

---

## 1. Deploy (recap)

Full steps are in `GO-LIVE.md`. Short version:
1. Run `supabase/schema.sql` in your Supabase project.
2. Paste your Project URL + anon key into `app-supabase/config.js`.
3. Drag the whole project folder onto **app.netlify.com/drop** → you get a live https URL.
4. Entry points once live:
   - Marketing site: `/index.html`
   - Web platform: `/app-supabase/index.html`
   - Client app (installable): `/pwa/index.html`
   - Attorney app (installable): `/pwa/lawyer.html`

> PWAs only become **installable / offline** on the live https URL (not from a local file).

---

## 2. Real background push (VAPID / Web Push)

Local notifications (already built) only fire while the app is open. To notify a **closed** app, you need a push service + a server to send. Cheapest path with your existing Supabase:

### a. Generate VAPID keys (once)
```bash
npx web-push generate-vapid-keys
# → prints a public key and a private key
```

### b. Subscribe the device (add to the PWA, after login)
```js
const reg = await navigator.serviceWorker.ready;
const sub = await reg.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: "<YOUR_VAPID_PUBLIC_KEY>"   // url-base64
});
// save `sub` (endpoint + keys) to a Supabase table `push_subscriptions`
await sb.from("push_subscriptions").insert({ user_id: me.id, sub });
```

### c. Handle the push in `pwa/sw.js`
```js
self.addEventListener("push", (e) => {
  const d = e.data ? e.data.json() : {};
  e.waitUntil(self.registration.showNotification(d.title || "Berg PC", {
    body: d.body || "", icon: "icon-192.png", data: d.url || "/pwa/index.html"
  }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data || "/"));
});
```

### d. Send from a Supabase Edge Function (server, holds the private key)
Trigger it whenever a `messages` row is inserted. Use the `web-push` library with your VAPID keys to POST to each saved subscription's endpoint.

```js
// supabase/functions/notify/index.ts  (sketch)
import webpush from "npm:web-push";
webpush.setVapidDetails("mailto:info@bergpclawfirms.com", PUBLIC, PRIVATE);
// for each subscription of the recipient:
await webpush.sendNotification(sub, JSON.stringify({ title, body, url }));
```

### What I can vs can't do
- ✅ I can wire the **client subscribe code** + the **service-worker push handler** into the apps.
- ❌ I can't generate/hold your **VAPID private key**, create the **Edge Function with your service-role key**, or send real pushes — that runs on your Supabase project with your secrets.

**Want me to add the subscribe code + SW push handler now?** It's safe to ship (it just no-ops until you paste your VAPID public key and deploy the function). Say the word and I'll wire it in.

---

## iOS note
Web Push on iOS requires the user to **Add to Home Screen first**, then it works (iOS 16.4+). Android/desktop work once subscribed.
