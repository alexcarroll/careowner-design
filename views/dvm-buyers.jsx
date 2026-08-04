// Talent Acquisition Specialist directory — two entry points, one implementation:
//   /practice/promotions/dvm-buyers → "Find DVM Buyers" promotion channel
//   /buyers#specialists             → Find Buyers' "Talent Specialists" tab
// Recruiters who place DVMs in practices every day — and therefore know which
// veterinarians in their networks are quietly exploring ownership. CareOwner
// pays the specialist a referral fee when their intro leads to a sale; the
// seller pays nothing extra. Contact happens ONLY through CareOwner Messages
// (the compose below writes into THREADS) so every conversation — and any
// eventual referral credit — is tracked on-platform end to end.
(() => {

const TA_AVATAR_COLORS = {
  teal:   "#1B6970",
  amber:  "#B45309",
  indigo: "#4F46E5",
  violet: "#6D28D9",
  green:  "#15803D",
  rose:   "#BE185D",
};

const TaAvatar = ({ t, size = 34, font = 13 }) => (
  <span className="ta-avatar" style={{ width: size, height: size, fontSize: font, background: TA_AVATAR_COLORS[t.color] || "#57534E" }}>
    {t.initials}
  </span>
);

const taFirstName = (t) => t.name.split(" ")[0];

// Connection state drives the status filters, the badge, and the row dot:
//   open      → discoverable on the platform, not contacted yet
//   sent      → messaged, still waiting on their first reply
//   connected → they replied; the specialist can now see the practice profile
// Messaging someone this session flips them open → sent immediately (the
// outbound thread is the source of truth, ahead of any seeded state).
const taConnection = (t) => {
  if (t.connection === "connected") return "connected";
  const messaged = typeof THREADS !== "undefined" && THREADS.some(th => th.id === "ta-thread-" + t.id);
  return messaged ? "sent" : (t.connection || "open");
};
const taUnread = (t) => t.unread || 0;

const TA_STATUS = {
  open:      { label: "Open",      cls: "co-badge--blue",  dot: null },
  sent:      { label: "Sent",      cls: "co-badge--amber", dot: "pending" },
  connected: { label: "Connected", cls: "co-badge--green", dot: "live" },
};

// Pre-filled note — anonymized on purpose: it describes the practice the way the
// public teaser does, never by name, so the seller stays in control of identity.
const defaultIntro = (t) =>
  `Hi ${taFirstName(t)} — I own a ${PRACTICE.type.toLowerCase()} in the suburban Midwest, listed anonymously on CareOwner ` +
  `(“${MY_LISTING.title}”). I'm looking for a DVM buyer and thought of your network. ` +
  `Do you know any veterinarians who are exploring ownership right now? Happy to share more here on CareOwner.`;

// ─── Profile slideout ─────────────────────────────────────────────────────────
const TaProfileSlideout = ({ t, onClose, onToast }) => {
  const [composing, setComposing] = React.useState(false);
  const [msg, setMsg] = React.useState(() => defaultIntro(t));
  const [sent, setSent] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // TODO(api): create a real thread; for now write into the in-memory THREADS
  // store so the conversation shows up in Messages like any buyer thread.
  // Re-messaging the same specialist appends to their existing thread.
  const send = () => {
    if (!msg.trim()) return;
    const existing = THREADS.find(th => th.id === "ta-thread-" + t.id);
    if (existing) {
      existing.messages.push({ from: "me", text: msg.trim(), time: "Just now" });
      Object.assign(existing, { last: msg.trim(), time: "now" });
    } else {
      THREADS.unshift({
        id: "ta-thread-" + t.id, name: t.name, initials: t.initials,
        last: msg.trim(), time: "now", unread: 0,
        messages: [{ from: "me", text: msg.trim(), time: "Just now" }],
      });
    }
    setSent(true);
    onToast(`Message sent to ${t.name}`);
  };

  const stats = [
    { num: t.dvmNetwork, label: "DVMs in network" },
    { num: t.buyerReady, label: "Exploring ownership" },
    { num: t.placements, label: "Placements made" },
    { num: t.avgResponse, label: "Avg response" },
  ];

  return (
    <>
      <div className="co-slideout-overlay" onClick={onClose} />
      <div className="co-slideout ta-slideout">
        <div className="co-slideout__header">
          <h2>Talent Acquisition Specialist</h2>
          <button onClick={onClose} aria-label="Close"><Icon name="x" size={18} /></button>
        </div>

        <div className="co-slideout__body">
          <div className="ta-prof">
            <TaAvatar t={t} size={52} font={17} />
            <div>
              <h3>{t.name} {t.verified && <span className="co-badge co-badge--blue">Vetted partner</span>}</h3>
              <div className="ta-prof__sub">{t.title} · {t.agency}</div>
              <div className="ta-prof__loc"><Icon name="mapPin" size={13} /> {t.location}</div>
            </div>
          </div>

          <div className="ta-stats">
            {stats.map(s => (
              <div key={s.label} className="ta-stat">
                <div className="ta-stat__num">{s.num}</div>
                <div className="ta-stat__label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="ta-section">
            <div className="mc-group-title">About</div>
            <p>{t.about}</p>
          </div>

          <div className="ta-section">
            <div className="mc-group-title">Typically works with</div>
            <div className="pl-chiprow">
              {t.worksWith.map(w => <span key={w} className="pl-chip"><Icon name="check" size={12} /> {w}</span>)}
            </div>
          </div>

          <div className="ta-section">
            <div className="mc-group-title">Coverage</div>
            <div className="pl-chiprow">
              {t.regions.map(r => <span key={r} className="pl-chip"><Icon name="mapPin" size={12} /> {r}</span>)}
            </div>
          </div>

          <div className="ta-refnote">
            <Icon name="info" size={15} />
            <div>
              <b>How referrals work.</b> If {taFirstName(t)} connects you with a DVM who ends up buying your practice,
              CareOwner pays {taFirstName(t)}'s referral fee — you pay nothing extra. Keep every conversation here in
              CareOwner Messages so the referral (and your anonymity) stays protected and tracked.
            </div>
          </div>

          {composing && !sent && (
            <div className="ta-section">
              <div className="co-field">
                <label>Your message to {taFirstName(t)}</label>
                <textarea rows={6} value={msg} onChange={e => setMsg(e.target.value)} />
              </div>
              <div className="pr-tip" style={{ marginTop: 8 }}>
                <Icon name="lock" size={13} /> Sent through CareOwner Messages — your name stays hidden until you choose to share it.
              </div>
            </div>
          )}

          {sent && (
            <div className="ta-sent">
              <span className="ta-sent__icon"><Icon name="checkCircle" size={26} /></span>
              <h3>Message sent</h3>
              <p>Your note is on its way to {taFirstName(t)}. Replies land in Messages — typical response time is {t.avgResponse.replace("~", "about ")}.</p>
            </div>
          )}
        </div>

        <div className="co-slideout__footer">
          {!composing && !sent && (
            <>
              <button className="co-btn co-btn--ghost" onClick={onClose}>Close</button>
              <button className="co-btn co-btn--primary" onClick={() => setComposing(true)}>
                <Icon name="message" size={14} /> Message {taFirstName(t)}
              </button>
            </>
          )}
          {composing && !sent && (
            <>
              <button className="co-btn co-btn--ghost" onClick={() => setComposing(false)}>Back</button>
              <button className="co-btn co-btn--primary" onClick={send} disabled={!msg.trim()}>
                <Icon name="send" size={14} /> Send message
              </button>
            </>
          )}
          {sent && (
            <>
              <button className="co-btn co-btn--ghost" onClick={onClose}>Done</button>
              <button className="co-btn co-btn--primary" onClick={() => navigateTo("/messages")}>
                <Icon name="message" size={14} /> Open Messages
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// ─── Directory table ──────────────────────────────────────────────────────────
// Reusable panel (header-less) so the specialist directory is one implementation
// shared by two entry points: Promotions › Find DVM Buyers (a promotion channel)
// and Find Buyers › Talent Specialists (a buyer-sourcing channel).
const TaSpecialistsPanel = ({ onToast, showHeader = true }) => {
  const [q, setQ] = React.useState("");
  const [focus, setFocus] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [detail, setDetail] = React.useState(null);

  const focusOptions = ["all", ...Array.from(new Set(TA_SPECIALISTS.map(t => t.focus)))];
  const countBy = (s) => TA_SPECIALISTS.filter(t => taConnection(t) === s).length;
  const statusTabs = [
    { id: "all", label: "All", n: TA_SPECIALISTS.length },
    { id: "open", label: "Open", n: countBy("open") },
    { id: "sent", label: "Sent", n: countBy("sent") },
    { id: "connected", label: "Connected", n: countBy("connected") },
  ];

  const filtered = TA_SPECIALISTS.filter(t => {
    if (status !== "all" && taConnection(t) !== status) return false;
    if (focus !== "all" && t.focus !== focus) return false;
    if (q) {
      const hay = (t.name + " " + t.agency + " " + t.location + " " + t.regions.join(" ") + " " + t.focus).toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });
  // Active relationships first, then the rest of the platform.
  const order = { connected: 0, sent: 1, open: 2 };
  const rows = filtered.slice().sort((a, b) => order[taConnection(a)] - order[taConnection(b)]);

  return (
    <>
        {showHeader && (
          <div className="ta-head">
            <h2 className="ta-head__title">Find DVM Buyers</h2>
            <p className="ta-head__sub">Connect with talent acquisition and recruiting specialists to leverage their networks of DVMs who may be interested in buying a practice</p>
          </div>
        )}

        <div className="ta-intro">
          <span className="ta-intro__icon"><Icon name="users" size={18} /></span>
          <div>
            <b>How it works:</b> these recruiters place DVMs in practices for a living — and many know associates
            quietly exploring ownership. Message one through CareOwner; if their intro leads to your sale, CareOwner
            pays their referral fee. <b>You pay nothing extra</b>, and every conversation stays in Messages so it's
            tracked end to end.
          </div>
        </div>

        <div className="co-card ta-tablecard" style={{ padding: 0, overflow: "hidden" }}>
          <div className="ta-toolbar">
            <div className="co-filters" style={{ margin: 0 }}>
              {statusTabs.map(s => (
                <button key={s.id} className={`co-chip ${status === s.id ? "is-active" : ""}`} onClick={() => setStatus(s.id)}>
                  {s.label} <span style={{ opacity: 0.6 }}>· {s.n}</span>
                </button>
              ))}
            </div>
            <div className="ta-toolbar__right">
              <div className="bf-field">
                <span className="bf-label">Focus</span>
                <select className="ta-select" value={focus} onChange={e => setFocus(e.target.value)}>
                  {focusOptions.map(o => <option key={o} value={o}>{o === "all" ? "All specialties" : o}</option>)}
                </select>
              </div>
              <div className="co-search ta-search">
                <Icon name="search" />
                <input placeholder="Search specialists…" value={q} onChange={e => setQ(e.target.value)} />
              </div>
            </div>
          </div>

          <table className="co-table ta-table">
            <thead>
              <tr>
                <th style={{ width: 28 }}></th>
                <th>Specialist</th>
                <th>Location</th>
                <th>Focus</th>
                <th>Status</th>
                <th>Interest</th>
                <th>Avg response</th>
                <th style={{ width: 76 }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(t => {
                const conn = taConnection(t);
                const meta = TA_STATUS[conn];
                return (
                  <tr key={t.id} onClick={() => setDetail(t)} style={{ cursor: "pointer" }}>
                    <td className="pr-table__dotcell">
                      {meta.dot && <span className={`pr-dot pr-dot--${meta.dot}`} title={meta.label} />}
                    </td>
                    <td>
                      <div className="ta-cell">
                        <TaAvatar t={t} />
                        <div style={{ minWidth: 0 }}>
                          <div className="co-table__name">{t.name}{t.verified && <Icon name="checkCircle" size={13} style={{ color: "var(--teal-brand)", marginLeft: 6, marginBottom: -2 }} />}</div>
                          <div className="co-table__sub">{t.agency}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{t.location}</td>
                    <td>{t.focus}</td>
                    <td><span className={`co-badge ${meta.cls} pr-badge`}>{meta.label}</span></td>
                    <td>{t.buyerReady > 0
                      ? <span className="ta-interest">{t.buyerReady} {t.buyerReady === 1 ? "DVM" : "DVMs"}</span>
                      : <span style={{ color: "var(--stone-400)" }}>—</span>}</td>
                    <td style={{ color: "var(--stone-500)", whiteSpace: "nowrap" }}>{t.avgResponse}</td>
                    <td className="ta-table__end">
                      {taUnread(t) > 0 && (
                        <span className="ta-unread" title={`${taUnread(t)} unread`}><Icon name="inbox" size={12} /> {taUnread(t)}</span>
                      )}
                      <Icon name="chevronRight" size={14} style={{ color: "var(--stone-400)" }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && <div className="co-empty">No specialists match your filters.</div>}
        </div>

        <p className="ta-foot">
          <Icon name="lock" size={12} /> Specialists are vetted CareOwner partners. They see your anonymous listing —
          never your practice name — until you choose to share it.
        </p>

      {detail && <TaProfileSlideout t={detail} onClose={() => setDetail(null)} onToast={onToast} />}
    </>
  );
};

// Promotions channel page — the same directory under its own header.
// (Find Buyers renders TaSpecialistsPanel directly in its Specialists tab.)
const DvmBuyersView = ({ onToast }) => (
  <>
    <SubHeader
      title="Find DVM Buyers"
      subtitle="Message a Talent Acquisition Specialist to see if a DVM in their network wants to buy your practice."
      backAction={<button className="co-btn-outline" onClick={() => navigateTo("/practice/promotions")}><Icon name="chevronRight" style={{ transform: "rotate(180deg)" }} /> Back to Promotions</button>}
    />
    <div className="co-body">
      <TaSpecialistsPanel onToast={onToast} showHeader={false} />
    </div>
  </>
);

Object.assign(window, { DvmBuyersView, TaSpecialistsPanel });

})();
