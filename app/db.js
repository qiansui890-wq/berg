/* ============================================================
   Berg PC Platform — data layer (localStorage)
   One global: window.DB. Plain JS, no build step.
   Roles: admin | lawyer | client. Data persists & survives reload.
   ============================================================ */
(function () {
  const KEY = "berg_platform_v2_en";
  const uid = (p) => p + "_" + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
  const now = () => new Date().toISOString();

  /* ---------- Recovery strategies (incl. cross-border / non-court routes) ---------- */
  const STRATEGIES = [
    { id: "court_freeze", label: "Court injunction (wallet freeze)", icon: "snowflake", group: "Judicial", desc: "Petition the court for an injunction freezing identifiable criminal wallets within the jurisdiction.", domesticOnly: true },
    { id: "vasp_freeze", label: "Exchange / VASP cooperation freeze", icon: "building-2", group: "Judicial", desc: "Coordinate with the exchange where funds landed to flag and freeze tainted deposits." },
    { id: "stablecoin_freeze", label: "Stablecoin issuer freeze (USDT/USDC)", icon: "coins", group: "On-chain", desc: "File a freeze request with Tether / Circle to blacklist the implicated address." },
    { id: "mlat", label: "Mutual Legal Assistance (MLAT)", icon: "globe", group: "Cross-border", desc: "Use treaty channels to request investigation and seizure by foreign authorities." },
    { id: "ic3_fbi", label: "IC3 / FBI report & referral", icon: "shield", group: "Law enforcement", desc: "File with the FBI's IC3 to drive freezes and tracing at the enforcement level." },
    { id: "interpol", label: "Interpol / cross-border enforcement", icon: "siren", group: "Cross-border", desc: "For overseas rings, push for international enforcement cooperation and red notices." },
    { id: "forensic_report", label: "Blockchain forensic report", icon: "file-search", group: "On-chain", desc: "Produce a chain-of-funds forensic report admissible for enforcement and litigation." },
    { id: "osint_id", label: "OSINT identity attribution", icon: "user-search", group: "Investigation", desc: "Use open-source intelligence and on-chain clustering to identify the perpetrators." },
    { id: "foreign_civil", label: "Foreign civil litigation", icon: "scale", group: "Cross-border", desc: "Bring a civil recovery action in the foreign jurisdiction where funds or actors sit." },
    { id: "demand_letter", label: "Demand letter / settlement", icon: "mail", group: "Litigation", desc: "Send a demand letter to identifiable parties to push for return or settlement." },
    { id: "bank_recall", label: "Wire recall / chargeback", icon: "banknote", group: "Banking", desc: "For wire portions, initiate a bank recall or chargeback procedure." },
    { id: "insurance", label: "Insurance / platform liability claim", icon: "umbrella", group: "Other", desc: "Assess cyber-insurance or platform liability and pursue a claim." },
  ];

  const STAGES = ["Intake", "Investigating", "Filed", "Frozen", "Recovered", "Closed"];
  const STAGE_TONE = { "Intake": "neutral", "Investigating": "info", "Filed": "accent", "Frozen": "warning", "Recovered": "success", "Closed": "neutral" };
  const ROLE_LABEL = { admin: "Administrator", lawyer: "Attorney", client: "Client" };

  /* ---------- Seed ---------- */
  function seed() {
    const adminId = "u_admin", l1 = "u_lawyer1", l2 = "u_lawyer2", c1 = "u_client1", c2 = "u_client2", c3 = "u_client3";
    const users = [
      { id: adminId, role: "admin", name: "Admin Console", email: "admin@bergpc.com", password: "admin", title: "Managing Partner", createdAt: now() },
      { id: l1, role: "lawyer", name: "Geoff Berg", email: "geoff@bergpc.com", password: "lawyer", title: "Managing Partner", createdAt: now() },
      { id: l2, role: "lawyer", name: "Dana Whitfield", email: "dana@bergpc.com", password: "lawyer", title: "Associate", createdAt: now() },
      { id: c1, role: "client", name: "Jane Doe", email: "jane@email.com", password: "client", title: "", createdAt: now() },
      { id: c2, role: "client", name: "Robert Okafor", email: "robert@email.com", password: "client", title: "", createdAt: now() },
      { id: c3, role: "client", name: "Apex Holdings", email: "ops@apex.com", password: "client", title: "", createdAt: now() },
    ];

    const wallets1 = [
      { addr: "bc1q9zk2m4f8x3v0rd7t6yqe2h5n8s4p1w0c9j6l3", role: "tainted", label: "Victim wallet", balance: "8.42 BTC", usd: "$544,800" },
      { addr: "bc1qhop1a7c2m4f8x3v0rd7t6yqe2h5n8s4p1w0c9", role: "hop", label: "Hop 1", balance: "5.10 BTC", usd: "$330,100" },
      { addr: "bc1qhop2b3f8m4f8x3v0rd7t6yqe2h5n8s4p1w0c9", role: "hop", label: "Hop 2", balance: "3.32 BTC", usd: "$214,800" },
      { addr: "bc1qmix44adm4f8x3v0rd7t6yqe2h5n8s4p1w0c9", role: "mixer", label: "Mixer", balance: "5.10 BTC", usd: "$330,100" },
      { addr: "0xa3f19c4e7b2049d5f1c8a6037be29d4471e7b204", role: "exchange", label: "Exchange A (off-ramp)", balance: "3.32 BTC", usd: "$214,800" },
    ];

    const clients = [
      {
        id: "cl_1", userId: c1, lawyerId: l1, name: "Jane Doe", email: "jane@email.com", phone: "(281) 555-0199",
        address: "1180 Westheimer Rd, Houston, TX", dob: "1984-03-12", occupation: "Marketing Director", idType: "Driver's License", idNumber: "TX-•••• 4821",
        status: "Investigating", matterType: "Crypto Fraud", amountLost: 182400, currency: "USD", dateOfLoss: "2025-02-14",
        platform: "“CoinVantage Pro” (spoofed platform)", fundsMethod: "crypto", jurisdiction: "Overseas (SE Asia)", overseas: true,
        narrative: "Met the perpetrator on social media, was directed to a spoofed investment app, sent USDT and BTC in several transfers, then was asked to pay 'taxes' to withdraw and lost contact.",
        wallets: wallets1, strategies: ["vasp_freeze", "stablecoin_freeze", "forensic_report", "mlat"],
        documents: [
          { id: uid("doc"), name: "Bank statement - Feb 2025.pdf", size: "240 KB", type: "pdf", status: "verified", uploadedAt: now(), uploadedBy: "Jane Doe" },
          { id: uid("doc"), name: "Wire confirmation.pdf", size: "88 KB", type: "pdf", status: "verified", uploadedAt: now(), uploadedBy: "Jane Doe" },
          { id: uid("doc"), name: "Platform chat screenshots.zip", size: "1.4 MB", type: "zip", status: "review", uploadedAt: now(), uploadedBy: "Jane Doe" },
        ],
        messages: [
          { id: uid("m"), fromId: c1, fromName: "Jane Doe", fromRole: "client", text: "Hi — one more detail I remembered: they first contacted me through an app called CoinVantage.", ts: now(), read: true },
          { id: uid("m"), fromId: l1, fromName: "Geoff Berg", fromRole: "lawyer", text: "Got it, thank you. We've added that platform to the investigation. Please upload any chat screenshots under 'My Documents'.", ts: now(), read: true },
        ],
        notes: [{ id: uid("n"), author: "Geoff Berg", text: "Cooperative client, strong evidence. Prioritize exchange cooperation freeze.", ts: now() }],
        timeline: [
          { id: uid("t"), icon: "check", text: "Intake reviewed", date: "2025-04-17", by: "Geoff Berg" },
          { id: uid("t"), icon: "git-branch", text: "Initial trace complete — 7 hops mapped", date: "2025-04-19", by: "Investigations" },
          { id: uid("t"), icon: "building-2", text: "Cooperation request sent to Exchange A", date: "2025-04-24", by: "Geoff Berg" },
        ],
        createdBy: l1, createdAt: now(), updatedAt: now(), intakeComplete: true,
      },
      {
        id: "cl_2", userId: c2, lawyerId: l1, name: "Robert Okafor", email: "robert@email.com", phone: "(713) 555-0143",
        address: "4500 Memorial Dr, Houston, TX", dob: "1976-09-02", occupation: "Physician", idType: "Passport", idNumber: "P-•••• 7741",
        status: "Filed", matterType: "Coinbase Data Breach", amountLost: 1200000, currency: "USD", dateOfLoss: "2025-01-08",
        platform: "Coinbase (account takeover)", fundsMethod: "crypto", jurisdiction: "Domestic", overseas: false,
        narrative: "Account was taken over following a data breach; funds were moved out to several external addresses.",
        wallets: [wallets1[0], wallets1[4]], strategies: ["court_freeze", "vasp_freeze", "forensic_report"],
        documents: [{ id: uid("doc"), name: "Coinbase transaction history.csv", size: "320 KB", type: "csv", status: "verified", uploadedAt: now(), uploadedBy: "Robert Okafor" }],
        messages: [], notes: [],
        timeline: [{ id: uid("t"), icon: "check", text: "Intake reviewed", date: "2025-03-30", by: "Geoff Berg" }],
        createdBy: l1, createdAt: now(), updatedAt: now(), intakeComplete: true,
      },
      {
        id: "cl_3", userId: c3, lawyerId: l2, name: "Apex Holdings", email: "ops@apex.com", phone: "(346) 555-0177",
        address: "24 Greenway Plaza, Houston, TX", dob: "", occupation: "Investment fund", idType: "Business License", idNumber: "EIN-•••• 0090",
        status: "Frozen", matterType: "Crypto Fraud", amountLost: 54900, currency: "USD", dateOfLoss: "2025-02-28",
        platform: "Unknown 'market-making' platform", fundsMethod: "both", jurisdiction: "Overseas", overseas: true,
        narrative: "Corporate funds were lured into a fake market-making scheme; funds were mixed and routed to an overseas exchange.",
        wallets: [wallets1[4]], strategies: ["stablecoin_freeze", "mlat", "interpol", "foreign_civil"],
        documents: [], messages: [], notes: [],
        timeline: [{ id: uid("t"), icon: "snowflake", text: "Exchange confirmed freeze of $54,900", date: "2025-05-02", by: "Dana Whitfield" }],
        createdBy: l2, createdAt: now(), updatedAt: now(), intakeComplete: true,
      },
    ];

    const activity = [
      { id: uid("a"), ts: now(), actor: "Geoff Berg", action: "moved case stage to “Investigating”", target: "Jane Doe" },
      { id: uid("a"), ts: now(), actor: "Dana Whitfield", action: "confirmed freeze of $54,900", target: "Apex Holdings" },
      { id: uid("a"), ts: now(), actor: "Admin Console", action: "assigned client to Geoff Berg", target: "Robert Okafor" },
    ];

    return { users, clients, activity, session: null, ver: 2 };
  }

  /* ---------- Store ---------- */
  let cache = null;
  function load() {
    if (cache) return cache;
    try { const raw = localStorage.getItem(KEY); cache = raw ? JSON.parse(raw) : seed(); }
    catch (e) { cache = seed(); }
    return cache;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch (e) {} emit(); }
  const subs = new Set();
  function emit() { subs.forEach((f) => { try { f(); } catch (e) {} }); }

  /* ---------- API ---------- */
  const DB = {
    STRATEGIES, STAGES, STAGE_TONE, ROLE_LABEL,
    strategyById: (id) => STRATEGIES.find((s) => s.id === id),
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
    reset() { cache = seed(); save(); },

    currentUser() { const d = load(); return d.users.find((u) => u.id === d.session) || null; },
    login(email, password) {
      const d = load();
      const u = d.users.find((x) => x.email.toLowerCase() === String(email).toLowerCase().trim() && x.password === password);
      if (!u) return { error: "Incorrect email or password" };
      d.session = u.id; save(); return { user: u };
    },
    logout() { const d = load(); d.session = null; save(); },
    register({ name, email, password, role = "client" }) {
      const d = load();
      email = String(email).toLowerCase().trim();
      if (!name || !email || !password) return { error: "Please complete all required fields" };
      if (d.users.some((u) => u.email.toLowerCase() === email)) return { error: "That email is already registered" };
      const u = { id: uid("u"), role, name, email, password, title: "", createdAt: now() };
      d.users.push(u);
      if (role === "client") d.clients.push(blankClient(u));
      d.session = u.id; save(); return { user: u };
    },

    users() { return load().users; },
    lawyers() { return load().users.filter((u) => u.role === "lawyer"); },
    addUser(u) { const d = load(); const nu = { id: uid("u"), createdAt: now(), title: "", ...u }; d.users.push(nu); if (nu.role === "client" && !d.clients.some((c) => c.userId === nu.id)) d.clients.push(blankClient(nu)); log(d, "Admin Console", "created " + ROLE_LABEL[nu.role] + " account", nu.name); save(); return nu; },
    updateUser(id, patch) { const d = load(); const u = d.users.find((x) => x.id === id); if (u) Object.assign(u, patch); save(); return u; },
    deleteUser(id) { const d = load(); d.users = d.users.filter((u) => u.id !== id); d.clients = d.clients.filter((c) => c.userId !== id); save(); },

    clientsFor(user) {
      const d = load();
      if (!user) return [];
      if (user.role === "admin") return d.clients;
      if (user.role === "lawyer") return d.clients.filter((c) => c.lawyerId === user.id);
      return d.clients.filter((c) => c.userId === user.id);
    },
    clientById(id) { return load().clients.find((c) => c.id === id) || null; },
    clientByUser(userId) { return load().clients.find((c) => c.userId === userId) || null; },
    updateClient(id, patch, actorName) {
      const d = load(); const c = d.clients.find((x) => x.id === id);
      if (!c) return null;
      Object.assign(c, patch, { updatedAt: now() });
      if (actorName) log(d, actorName, "updated client profile / case", c.name);
      save(); return c;
    },
    assign(clientId, lawyerId) {
      const d = load(); const c = d.clients.find((x) => x.id === clientId);
      if (c) { c.lawyerId = lawyerId; const l = d.users.find((u) => u.id === lawyerId); log(d, "Admin Console", "assigned to " + (l ? l.name : "—"), c.name); }
      save();
    },
    addClientByLawyer(lawyer, data) {
      const d = load();
      const c = Object.assign(blankClient(null), data, { id: uid("cl"), lawyerId: lawyer.id, createdBy: lawyer.id, createdAt: now(), updatedAt: now(), intakeComplete: true });
      d.clients.push(c); log(d, lawyer.name, "created case", c.name); save(); return c;
    },

    addDoc(clientId, doc, actorName) {
      const d = load(); const c = d.clients.find((x) => x.id === clientId); if (!c) return;
      c.documents.unshift({ id: uid("doc"), status: "review", uploadedAt: now(), uploadedBy: actorName || "—", ...doc });
      log(d, actorName, "uploaded evidence " + doc.name, c.name); save();
    },
    setDocStatus(clientId, docId, status) { const d = load(); const c = d.clients.find((x) => x.id === clientId); if (!c) return; const doc = c.documents.find((x) => x.id === docId); if (doc) doc.status = status; save(); },
    removeDoc(clientId, docId) { const d = load(); const c = d.clients.find((x) => x.id === clientId); if (!c) return; c.documents = c.documents.filter((x) => x.id !== docId); save(); },

    addTimeline(clientId, entry, actorName) { const d = load(); const c = d.clients.find((x) => x.id === clientId); if (!c) return; c.timeline.push({ id: uid("t"), date: now().slice(0, 10), by: actorName || "—", icon: "dot", ...entry }); log(d, actorName, entry.text, c.name); save(); },
    setStrategies(clientId, ids, actorName) { const d = load(); const c = d.clients.find((x) => x.id === clientId); if (!c) return; c.strategies = ids; log(d, actorName, "updated recovery strategy (" + ids.length + " selected)", c.name); save(); },
    setStage(clientId, stage, actorName) { const d = load(); const c = d.clients.find((x) => x.id === clientId); if (!c) return; c.status = stage; c.timeline.push({ id: uid("t"), date: now().slice(0, 10), by: actorName || "—", icon: "flag", text: "Stage changed to “" + stage + "”" }); log(d, actorName, "changed stage to “" + stage + "”", c.name); save(); },

    activity() { return load().activity; },
    log(actor, action, target) { const d = load(); log(d, actor, action, target); save(); },

    sendMessage(clientId, fromUser, text, attachment) {
      const d = load(); const c = d.clients.find((x) => x.id === clientId); if (!c) return;
      const body = (text || "").trim();
      if (!body && !attachment) return;
      c.messages = c.messages || [];
      c.messages.push({ id: uid("m"), fromId: fromUser.id, fromName: fromUser.name, fromRole: fromUser.role, text: body, attachment: attachment || null, recalled: false, ts: now(), read: false });
      log(d, fromUser.name, attachment ? "shared a file in secure chat" : "sent a secure message", c.name); save();
    },
    recallMessage(clientId, msgId, user) {
      const d = load(); const c = d.clients.find((x) => x.id === clientId); if (!c || !c.messages) return;
      const m = c.messages.find((x) => x.id === msgId); if (!m) return;
      if (user && m.fromId !== user.id) return; // only the sender can recall
      m.recalled = true; m.text = ""; m.attachment = null;
      log(d, user ? user.name : "", "recalled a message", c.name); save();
    },
    markMessagesRead(clientId, userId) { const d = load(); const c = d.clients.find((x) => x.id === clientId); if (!c || !c.messages) return; c.messages.forEach((m) => { if (m.fromId !== userId) m.read = true; }); save(); },
    unreadFor(user) { const d = load(); let n = 0; this.clientsFor(user).forEach((c) => (c.messages || []).forEach((m) => { if (m.fromId !== user.id && !m.read) n++; })); return n; },

    addNote(clientId, author, text) { const d = load(); const c = d.clients.find((x) => x.id === clientId); if (!c || !text.trim()) return; c.notes = c.notes || []; c.notes.unshift({ id: uid("n"), author: author.name, text: text.trim(), ts: now() }); log(d, author.name, "added an internal note", c.name); save(); },
    removeNote(clientId, noteId) { const d = load(); const c = d.clients.find((x) => x.id === clientId); if (!c || !c.notes) return; c.notes = c.notes.filter((n) => n.id !== noteId); save(); },

    tasksFor(clientId) { const c = load().clients.find((x) => x.id === clientId); return (c && c.tasks) || []; },
    addTask(clientId, task, actorName) { const d = load(); const c = d.clients.find((x) => x.id === clientId); if (!c || !task.title || !task.title.trim()) return; c.tasks = c.tasks || []; c.tasks.push({ id: uid("tk"), title: task.title.trim(), due: task.due || "", done: false, createdBy: actorName || "" }); log(d, actorName, "added task: " + task.title.trim(), c.name); save(); },
    toggleTask(clientId, taskId) { const d = load(); const c = d.clients.find((x) => x.id === clientId); if (!c || !c.tasks) return; const t = c.tasks.find((x) => x.id === taskId); if (t) t.done = !t.done; save(); },
    removeTask(clientId, taskId) { const d = load(); const c = d.clients.find((x) => x.id === clientId); if (!c || !c.tasks) return; c.tasks = c.tasks.filter((x) => x.id !== taskId); save(); },
  };

  function blankClient(user) {
    return {
      id: uid("cl"), userId: user ? user.id : null, lawyerId: null,
      name: user ? user.name : "", email: user ? user.email : "", phone: "", address: "", dob: "", occupation: "", idType: "Driver's License", idNumber: "",
      status: "Intake", matterType: "Crypto Fraud", amountLost: 0, currency: "USD", dateOfLoss: "", platform: "", fundsMethod: "crypto",
      jurisdiction: "", overseas: false, narrative: "", wallets: [], strategies: [], documents: [], timeline: [], messages: [], notes: [],
      createdBy: user ? user.id : null, createdAt: now(), updatedAt: now(), intakeComplete: false,
    };
  }
  function log(d, actor, action, target) { d.activity.unshift({ id: uid("a"), ts: now(), actor: actor || "System", action, target: target || "" }); d.activity = d.activity.slice(0, 60); }

  DB.blankClient = blankClient;
  DB.fmtMoney = (n) => "$" + Number(n || 0).toLocaleString("en-US");
  window.DB = DB;
})();
