/* Berg PC — Supabase config.
   The publishable/anon key is safe to expose in the browser; row-level security protects data. */
window.BERG_SUPABASE_URL = "https://wfaloikmocgbxtgiwcrk.supabase.co";
window.BERG_SUPABASE_ANON_KEY = "sb_publishable_e5bo2j5ZLq0lgUQYRLZHCw_pmao2kXG";

/* ---- Invite-only registration ----------------------------------------------
   When BERG_INVITE_REQUIRED is true, the public Register form asks for an invite
   code. Only people you've given a current code to can create an account.
   • Share a code with each invited client (e.g. in your intake email).
   • Rotate / add codes here anytime — edit the list and re-deploy.
   • Set BERG_INVITE_REQUIRED = false to allow open self-registration again.
   Note: codes here gate casual signups but are visible in the browser. For
   server-enforced invites, issue per-email codes from an `invite_codes` table. */
window.BERG_INVITE_REQUIRED = true;
window.BERG_INVITE_CODES = [
  "BERGPC-2026",      // general intake code
  "BERGPC-VIP",       // priority / referred clients
  "RECOVERY-2026",    // crypto fraud & recovery intake
  "COINBASE-BREACH",  // Coinbase data-breach matters
  "META-SCAM-ADS",    // Meta scam-ad investigation intake
];
