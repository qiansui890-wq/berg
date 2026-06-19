/* Berg PC — Web Push subscribe helper (shared by client & lawyer PWAs).
   Background push (notify a CLOSED app) needs a VAPID key pair + a server to send.
   Paste your VAPID PUBLIC key below; until then this no-ops safely. See PUSH-AND-DEPLOY.md. */
window.BERG_VAPID_PUBLIC_KEY = ""; // e.g. "BPxX...long-url-base64..."

window.bergEnablePush = async function (user) {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return { ok: false, reason: "unsupported" };
    if (!window.BERG_VAPID_PUBLIC_KEY) return { ok: false, reason: "no-vapid-key" };
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return { ok: false, reason: "denied" };
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(window.BERG_VAPID_PUBLIC_KEY),
      });
    }
    // Persist the subscription so your server (Supabase Edge Function) can push to it.
    try {
      if (window.DB && window.DB.savePushSubscription) await window.DB.savePushSubscription(user, sub.toJSON());
    } catch (_) {}
    return { ok: true, subscription: sub.toJSON() };
  } catch (e) {
    return { ok: false, reason: String(e && e.message || e) };
  }
};

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
