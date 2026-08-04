// Promote Your Practice — seller self-promotion hub (spec v1.3).
//   /practice/promotions            → dashboard Overview (locked until the listing is live):
//                                     results, the Create Promotions cards, updates feed + share rail
//   /practice/promotions#<channel>  → one tab per channel (meta · dvm · featured · local · pr),
//                                     each listing that channel's promotions or an empty state
//   /practice/promotions/ads        → Facebook & Instagram ad builder
//                                     (Overview → Audience → Creative → Select Plan → Review;
//                                     requests go to CareOwner for review → emailed payment
//                                     link → the team launches manually from VetVet's ad account)
//   /practice/promotions/share      → share-links screen (anonymous + trusted)
//   /practice/promotions/featured   → Featured Listing (tiers → preview → pay)
//   /practice/promotions/local-ads  → Local Advertising (placement finder)
//   /practice/promotions/pr         → Press & PR (interview → angles → kit → pitches)
//   /practice/promotions/dvm-buyers → Find DVM Buyers (recruiter directory, views/dvm-buyers.jsx)
// The public landing pages the links point at live in views/promo-landing.jsx.
// All external actions resolve against mock services in data.jsx (TODO(api) seams).
(() => {

const fmtInt = (n) => (n || 0).toLocaleString("en-US");
const todayLabel = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// Clipboard with an execCommand fallback for non-secure contexts.
const copyText = (text, onToast, msg) => {
  const done = () => onToast(msg || "Copied to clipboard");
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, done);
  } else {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta); done();
  }
};

const audienceMeta = (id) => PROMO_AUDIENCES.find(a => a.id === id) || PROMO_AUDIENCES[3];
const featuredDaysLeft = (f) => f && f.endTs ? Math.max(0, Math.ceil((f.endTs - Date.now()) / 86400000)) : 0;
const saveAsset = (asset) => updatePromo({ assets: [{ id: "as_" + Math.random().toString(36).slice(2, 8), ...asset }, ...PROMO.assets] });

// Decorative QR placeholder — deterministic pattern from the URL so it looks
// stable per link. Swap for a real QR lib when one is approved as a dependency.
const MockQR = ({ seed, size = 108 }) => {
  const N = 21, cell = size / N;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h = (h ^ seed.charCodeAt(i)) * 16777619 >>> 0; }
  const inFinder = (x, y) => (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
  const cells = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (inFinder(x, y)) continue;
    if (((h ^ (x * 73856093) ^ (y * 19349663)) >>> 0) % 5 < 2) cells.push([x, y]);
  }
  const finder = (fx, fy) => (
    <g key={fx + "-" + fy}>
      <rect x={fx * cell} y={fy * cell} width={7 * cell} height={7 * cell} fill="none" stroke="currentColor" strokeWidth={cell} />
      <rect x={(fx + 2) * cell} y={(fy + 2) * cell} width={3 * cell} height={3 * cell} fill="currentColor" />
    </g>
  );
  return (
    <svg className="pr-qr" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="QR code (placeholder)">
      {finder(0, 0)}{finder(N - 7, 0)}{finder(0, N - 7)}
      {cells.map(([x, y]) => <rect key={x + "." + y} x={x * cell + 0.5} y={y * cell + 0.5} width={cell - 1} height={cell - 1} fill="currentColor" />)}
    </svg>
  );
};

// ─── Shared: Named-Promotion acknowledgment gate ──────────────────────────────
// Reused wherever a channel publishes the practice's real identity (PR always;
// Local Advertising when "named" is chosen; the Meta own-account branch has its
// own inline variant tied to the Facebook connection).
const NamedPromoAck = ({ checked, onChange, context }) => (
  <div className="pr-ack-gate">
    <div className="pr-warn" style={{ marginBottom: 0 }}>
      <Icon name="alertTriangle" size={16} />
      <div><b>This is a named promotion.</b> {context}</div>
    </div>
    <label className="pr-ack">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      I understand my practice will be publicly named
    </label>
  </div>
);

// ─── Shared: share-link card (used on /share and inside the landing preview) ──
const SHARE_CHANNELS = [
  { id: "email", icon: "mail", label: "Email" },
  { id: "sms", icon: "smartphone", label: "SMS" },
  { id: "linkedin", icon: "linkedin", label: "LinkedIn" },
  { id: "facebook", icon: "facebook", label: "Facebook" },
];

const ShareCardShell = ({ tone, icon, title, blurb, path, onToast, children }) => {
  const url = promoShareUrl(path);
  return (
    <div className={`pr-share-card pr-share-card--${tone}`}>
      <div className="pr-share-card__head">
        <span className="pr-share-card__icon"><Icon name={icon} size={16} /></span>
        <div>
          <h3>{title}</h3>
          <p>{blurb}</p>
        </div>
      </div>
      <div className="pr-url">
        <span className="pr-url__text">{url}</span>
        <button className="co-btn co-btn--ghost" onClick={() => copyText(url, onToast, "Link copied")}><Icon name="copy" size={13} /> Copy</button>
      </div>
      <div className="pr-share-row">
        <div className="pr-share-btns">
          {SHARE_CHANNELS.map(c => (
            <button key={c.id} className="pr-share-btn" title={`Share via ${c.label}`}
              onClick={() => { copyText(url + "?src=" + c.id, () => {}, ""); onToast(`${c.label} share composer opened (mock) — tagged link copied`); }}>
              <Icon name={c.icon} size={15} /> {c.label}
            </button>
          ))}
          <button className="pr-share-btn" title="Open the page" onClick={() => navigateTo(path)}>
            <Icon name="externalLink" size={14} /> Open
          </button>
        </div>
        <div className="pr-qr-wrap">
          <MockQR seed={url} />
          <span>Scan to open</span>
        </div>
      </div>
      {children}
    </div>
  );
};

// Full card content for one share mode. `mode` is "anonymous" | "trusted".
// Rendered on the Share Links screen and inside the landing pages' Share modal.
const PromoShareCard = ({ mode, onToast }) => {
  const promo = usePromo();
  const listing = useMyListing();

  if (mode === "anonymous") {
    return (
      <ShareCardShell tone="safe" icon="eye" title="Anonymous link" path={"/l/" + listing.id} onToast={onToast}
        blurb="Safe to post publicly. No name or address shown — buyers see the anonymized teaser and inquire through CareOwner.">
        <div className="pr-share-foot"><Icon name="check" size={13} /> Use this one anywhere: social posts, forums, email blasts, your ads.</div>
      </ShareCardShell>
    );
  }

  if (!promo.namedToken) {
    return (
      <div className="pr-share-card pr-share-card--trust">
        <div className="pr-share-card__head">
          <span className="pr-share-card__icon"><Icon name="lock" size={16} /></span>
          <div>
            <h3>Trusted Share link</h3>
            <p>Reveals your real practice details — name, photos, your story. Only send it to people you trust.</p>
          </div>
        </div>
        <div className="pr-token-empty">
          <p>Create an unlisted, tokenized link. It's never listed publicly or indexed — it only exists for the
          people you hand it to, and you can see which inquiries it brings in.</p>
          <button className="co-btn co-btn--primary" onClick={() => { ensureNamedToken(); onToast("Trusted Share link created"); }}>
            <Icon name="link" size={14} /> Generate trusted link
          </button>
        </div>
      </div>
    );
  }

  return (
    <ShareCardShell tone="trust" icon="lock" title="Trusted Share link" path={"/l/s/" + promo.namedToken} onToast={onToast}
      blurb="Reveals your real practice details — name, photos, your story. Only send it to people you trust.">
      <div className="pr-captions">
        <div className="pr-captions__title"><Icon name="sparkles" size={13} /> Pre-written notes <span>AI-drafted per audience · tagged so you can see where inquiries come from</span></div>
        {PROMO_SHARE_CAPTIONS.map(c => {
          const text = c.text.replace("{url}", promoShareUrl("/l/s/" + promo.namedToken) + "?src=" + c.src);
          return (
            <div key={c.audience} className="pr-caption">
              <div className="pr-caption__body">
                <div className="pr-caption__label">{c.label}</div>
                <div className="pr-caption__text">{text}</div>
              </div>
              <button className="co-edit" onClick={() => copyText(text, onToast, "Note copied — paste it anywhere")}><Icon name="copy" size={13} /> Copy</button>
            </div>
          );
        })}
      </div>
    </ShareCardShell>
  );
};

// ─── Locked state — listing not live yet ──────────────────────────────────────
const PromoteLocked = ({ onManageListing }) => (
  <div className="co-card">
    <div className="co-coming-soon">
      <div className="co-coming-soon__icon"><Icon name="lock" size={22} /></div>
      <h3>Promotion unlocks when your listing is live</h3>
      <p style={{ maxWidth: 460, margin: "0 auto" }}>
        Finish your listing and launch it on the Marketplace first. Once it's live you can
        promote it to buyers with anonymous ads, share links, and more.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
        <button className="co-btn-outline" onClick={() => navigateTo("/practice")}>Review my profile</button>
        <button className="co-btn-solid" onClick={onManageListing}>Finish my listing</button>
      </div>
    </div>
  </div>
);

// ─── Hub ──────────────────────────────────────────────────────────────────────
// `short` is the table-safe label — badges in a table cell must stay on one line,
// so anything long ("Awaiting payment") gets a compact form. `dot` drives the
// row's leading status dot: attention = needs the owner to act.
const STATUS_BADGE = {
  active:    { cls: "co-badge--green", label: "Active",    dot: "live" },
  in_review: { cls: "co-badge--amber", label: "In review", dot: "pending" },
  awaiting_payment: { cls: "co-badge--blue", label: "Awaiting payment", short: "Payment due", dot: "attention" },
  submitted: { cls: "co-badge--amber", label: "Submitted", dot: "pending" },
  live:      { cls: "co-badge--green", label: "Live",      dot: "live" },
  paused:    { cls: "co-badge--gray",  label: "Paused",    dot: "muted" },
  completed: { cls: "co-badge--gray",  label: "Completed", dot: "muted" },
  cancelled: { cls: "co-badge--gray",  label: "Cancelled", dot: "muted" },
  expired:   { cls: "co-badge--gray",  label: "Expired",   dot: "muted" },
  draft:     { cls: "co-badge--gray",  label: "Draft",     dot: "muted" },
};

const RoiRow = ({ icon, iconCls, name, meta, metrics, hint, status, action }) => {
  const b = STATUS_BADGE[status] || STATUS_BADGE.draft;
  return (
    <div className="pr-camp">
      <div className={`pr-camp__icon ${iconCls || ""}`}><Icon name={icon} size={16} /></div>
      <div className="pr-camp__main">
        <div className="pr-camp__name">{name}</div>
        <div className="pr-camp__meta">{meta}</div>
      </div>
      {metrics
        ? (
          <div className="pr-camp__stats">
            <span><b>{fmtInt(metrics.impressions)}</b> impressions</span>
            <span><b>{fmtInt(metrics.clicks)}</b> clicks</span>
            <span><b>{fmtInt(metrics.inquiries)}</b> inquiries</span>
          </div>
        )
        : <div className="pr-camp__stats"><span className="pr-camp__hint">{hint}</span></div>}
      <span className={`co-badge ${b.cls}`}>{b.label}</span>
      {action}
    </div>
  );
};

// One unified ROI dashboard: every channel contributes rows + the KPI totals.
const RoiStrip = ({ promo, listing, onToast }) => {
  const rows = [];
  const totals = { imp: 0, clk: 0, inq: 0 };
  const add = (m) => { if (m) { totals.imp += m.impressions || 0; totals.clk += m.clicks || 0; totals.inq += m.inquiries || 0; } };

  promo.campaigns.forEach(c => {
    const m = c.status === "in_review" || c.status === "awaiting_payment" ? null : c.metrics;
    add(m);
    rows.push(
      <RoiRow key={c.id} icon="facebook" iconCls="pr-camp__icon--fb"
        name={`Facebook & Instagram — ${c.audiences.map(a => audienceMeta(a).label).join(" + ")}`}
        meta={`Submitted ${c.createdAt} · $${fmtInt(c.price)} flat rate · VetVet's ad account`}
        metrics={m}
        hint={c.status === "in_review"
          ? "In CareOwner review — we'll email you a payment link once approved"
          : c.status === "awaiting_payment" ? "Approved — pay via the link in your email to launch" : "Metrics appear once your ads launch"}
        status={c.status} />
    );
  });

  const f = listing.featured;
  if (f) {
    const tier = FEATURED_TIERS.find(t => t.id === f.tier) || {};
    const m = f.status === "active" ? f.metrics : null;
    add(m);
    rows.push(
      <RoiRow key={f.id} icon="star" iconCls="pr-camp__icon--star"
        name={`Featured Listing — ${tier.label || f.tier}`}
        meta={`${f.startAt} → ${f.endAt} · ${f.autoRenew ? "auto-renews" : "won't renew"}${f.status === "active" ? ` · ${featuredDaysLeft(f)} days left` : ""}`}
        metrics={m} hint="Boost ended" status={f.status}
        action={f.status === "active" && (
          <button className="co-edit" onClick={() => {
            mockFeaturedService.cancel(f.id).then(() => {
              updateMyListing({ featured: { ...f, status: "cancelled" } });
              onToast("Featured boost cancelled");
            });
          }}>Cancel</button>
        )} />
    );
  }

  promo.placements.forEach(p => {
    const m = p.status === "live" || p.status === "completed" ? p.metrics : null;
    add(m);
    rows.push(
      <RoiRow key={p.id} icon="newspaper"
        name={`${p.outletName}`}
        meta={`${p.anonymityMode === "named" ? "Named ad" : "Semi-anonymous ad"} · ${p.fulfillment === "concierge" ? "Concierge placement" : "Self-submitted"} · ${p.format}`}
        metrics={m} hint={p.fulfillment === "concierge" ? "VetVet is placing this ad" : "Awaiting the outlet's run date"} status={p.status} />
    );
  });

  if (promo.prCampaign) {
    const pr = promo.prCampaign;
    const published = pr.targets.filter(t => t.status === "published");
    const m = published.length ? published.reduce((acc, t) => ({
      impressions: acc.impressions + (t.metrics ? t.metrics.impressions : 0),
      clicks: acc.clicks + (t.metrics ? t.metrics.clicks : 0),
      inquiries: acc.inquiries + (t.metrics ? t.metrics.inquiries : 0),
    }), { impressions: 0, clicks: 0, inquiries: 0 }) : null;
    add(m);
    const pitched = pr.targets.filter(t => t.status !== "suggested").length;
    const replied = pr.targets.filter(t => t.status === "replied" || t.status === "published").length;
    rows.push(
      <RoiRow key={pr.id} icon="megaphone"
        name={`Press & PR — “${pr.angle.title}”`}
        meta={`${pitched} pitched · ${replied} replied · ${published.length} published`}
        metrics={m} hint="Coverage metrics appear when a story publishes"
        status={published.length ? "live" : "in_review"}
        action={<button className="co-edit" onClick={() => navigateTo("/practice/promotions/pr")}>Pipeline</button>} />
    );
  }

  const shareInquiries = promo.leads.length;
  if (rows.length === 0) return null;

  return (
    <div className="co-card" style={{ marginBottom: 16 }}>
      <div className="co-card__head">
        <h3 className="co-card__title"><Icon name="trendUp" />Results so far</h3>
        <span className="co-card__meta">
          {rows.length} {rows.length === 1 ? "promotion" : "promotions"}
          {shareInquiries ? ` · ${shareInquiries} link ${shareInquiries === 1 ? "inquiry" : "inquiries"}` : ""}
          {promo.assets.length ? ` · ${promo.assets.length} saved ${promo.assets.length === 1 ? "asset" : "assets"}` : ""}
        </span>
      </div>
      <div className="pr-results">
        <div className="pr-result"><div className="pr-result__num">{fmtInt(totals.imp)}</div><div className="pr-result__label">Impressions</div></div>
        <div className="pr-result"><div className="pr-result__num">{fmtInt(totals.clk)}</div><div className="pr-result__label">Clicks</div></div>
        <div className="pr-result"><div className="pr-result__num">{fmtInt(totals.inq + shareInquiries)}</div><div className="pr-result__label">Buyer inquiries</div></div>
        <div className="pr-result"><div className="pr-result__num">{rows.length}</div><div className="pr-result__label">Channels running</div></div>
      </div>
      <div className="pr-camps">{rows}</div>
    </div>
  );
};

// ── Promotion rows — the shared model behind every dashboard tab's table ──
// Live items from the channel stores render first (newest work on top), then the
// PROMO_HISTORY seeds. Row shape: { id, channel, icon, name, type, plan?, status,
// created, window, amount, path }. `channel` is what each tab filters on.
const createdRows = (promo, listing) => {
  const rows = [];
  promo.campaigns.forEach(c => rows.push({
    id: c.id, channel: "meta_ads", icon: "facebook",
    name: `Facebook & Instagram — ${c.audiences.map(a => audienceMeta(a).label).join(" + ")}`,
    type: "Meta Ads", status: c.status, created: c.createdAt,
    window: c.status === "in_review" || c.status === "awaiting_payment"
      ? "Starts after payment" : `${c.durationDays} days`,
    amount: `$${fmtInt(c.price)}`,
    path: "/practice/promotions/ads",
  }));
  const f = listing.featured;
  if (f) {
    const tier = FEATURED_TIERS.find(t => t.id === f.tier) || {};
    rows.push({
      id: f.id, channel: "featured", icon: "star", name: `Featured Listing — ${tier.label || f.tier}`,
      type: "Featured Listing", status: f.status, created: f.startAt,
      window: `${f.startAt} → ${f.endAt}`, amount: tier.price != null ? `$${tier.price}` : "—",
      path: "/practice/promotions/featured",
    });
  }
  promo.placements.forEach(p => {
    const cand = PLACEMENT_CANDIDATES.find(c => c.id === p.candidateId);
    const cost = cand ? cand.estCost + (p.fulfillment === "concierge" ? 99 : 0) : null;
    rows.push({
      id: p.id, channel: "local_pubs", icon: "newspaper", name: p.outletName,
      type: "Local ad", plan: p.fulfillment === "concierge" ? "Concierge placement" : "Self-submitted",
      status: p.status, created: p.createdAt, window: p.format,
      amount: cost != null ? `$${fmtInt(cost)}` : "—", path: "/practice/promotions/local-ads",
    });
  });
  if (promo.prCampaign) {
    const pr = promo.prCampaign;
    const published = pr.targets.filter(t => t.status === "published").length;
    rows.push({
      id: pr.id, channel: "pr", icon: "megaphone", name: `Press & PR — “${pr.angle.title}”`,
      type: "Press & PR", status: published ? "live" : "in_review", created: todayLabel(),
      window: `${pr.targets.length} pitched · ${published} published`, amount: "Included",
      path: "/practice/promotions/pr",
    });
  }
  // Specialist outreach started this session — each messaged specialist is an
  // in-flight DVM referral (threads are created by views/dvm-buyers.jsx).
  (typeof THREADS !== "undefined" ? THREADS : []).forEach(t => {
    if (!t.id || String(t.id).indexOf("ta-thread-") !== 0) return;
    const spec = TA_SPECIALISTS.find(s => "ta-thread-" + s.id === t.id);
    rows.push({
      id: t.id, channel: "dvm", icon: "users",
      name: spec ? `${spec.name} — ${spec.agency}` : t.name,
      type: "DVM referral", plan: "Talent Acquisition Specialist",
      status: "in_review", created: todayLabel(),
      window: "Awaiting reply", amount: "No cost",
      path: "/practice/promotions/dvm-buyers",
    });
  });
  return rows.concat(PROMO_HISTORY);
};

// One table shared by every dashboard tab. Each row leads with a status dot
// (same language as the left rail) so anything needing action is scannable.
const PromotionsTable = ({ rows, onToast }) => (
  <div className="co-card" style={{ padding: 0, overflow: "hidden" }}>
    <table className="co-table pr-table">
      <thead>
        <tr>
          <th style={{ width: 28 }}></th>
          <th>Promotion</th><th>Type</th><th>Status</th><th>Created</th><th>Schedule</th><th>Total</th>
          <th style={{ width: 96 }}></th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => {
          const b = STATUS_BADGE[r.status] || STATUS_BADGE.draft;
          return (
            <tr key={r.id} onClick={() => navigateTo(r.path)} style={{ cursor: "pointer" }}>
              <td className="pr-table__dotcell">
                <span className={`pr-dot pr-dot--${b.dot}`} title={b.label} />
              </td>
              <td>
                <div className="pr-created">
                  <span className={`pr-camp__icon ${r.icon === "facebook" ? "pr-camp__icon--fb" : r.icon === "star" ? "pr-camp__icon--star" : ""}`}><Icon name={r.icon} size={15} /></span>
                  <div style={{ minWidth: 0 }}>
                    <div className="co-table__name">{r.name}</div>
                    {r.plan && <div className="co-table__sub">{r.plan}</div>}
                  </div>
                </div>
              </td>
              <td style={{ whiteSpace: "nowrap" }}>{r.type}</td>
              <td><span className={`co-badge ${b.cls} pr-badge`}>{b.short || b.label}</span></td>
              <td style={{ color: "var(--stone-500)", whiteSpace: "nowrap" }}>{r.created}</td>
              <td style={{ color: "var(--stone-500)", whiteSpace: "nowrap" }}>{r.window}</td>
              <td style={{ whiteSpace: "nowrap" }}>{r.amount}</td>
              <td className="pr-table__cta" onClick={e => e.stopPropagation()}>
                {r.status === "awaiting_payment"
                  ? <button className="pr-cta" onClick={() => onToast("Secure checkout opened (mock) — same link as the one in your email")}>Pay now</button>
                  : <Icon name="chevronRight" size={14} style={{ color: "var(--stone-400)" }} />}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// Per-channel tab body: this channel's promotions, or an empty state that
// routes into its creation flow.
const ChannelPanel = ({ tab, rows, onToast }) => {
  const mine = rows.filter(r => r.channel === tab.channel);
  if (mine.length === 0) {
    return (
      <div className="co-card">
        <div className="co-coming-soon">
          <div className="co-coming-soon__icon"><Icon name={tab.icon} size={22} /></div>
          <h3>{tab.emptyTitle}</h3>
          <p style={{ maxWidth: 460, margin: "0 auto" }}>{tab.emptyDesc}</p>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <button className="co-btn-solid" onClick={() => navigateTo(tab.path)}>{tab.cta}</button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="pr-panelbar">
        <span className="pr-panelbar__count">{mine.length} {mine.length === 1 ? "promotion" : "promotions"}</span>
        <button className="co-btn-solid" onClick={() => navigateTo(tab.path)}><Icon name="plus" size={14} /> {tab.cta}</button>
      </div>
      <PromotionsTable rows={mine} onToast={onToast} />
    </>
  );
};

// Dashboard tabs: an Overview that launches new work, then one tab per channel
// listing that channel's promotions (or an empty state into its flow).
const PROMO_TABS = [
  { id: "overview", label: "Overview", hash: "" },
  { id: "meta", label: "Meta Ads", hash: "meta", channel: "meta_ads", icon: "facebook",
    path: "/practice/promotions/ads", cta: "Create campaign",
    emptyTitle: "No ad campaigns yet",
    emptyDesc: "Run anonymous Facebook & Instagram ads for one flat rate — we build them, run them from VetVet's ad account, and manage delivery." },
  { id: "dvm", label: "DVM Buyers", hash: "dvm", channel: "dvm", icon: "users",
    path: "/practice/promotions/dvm-buyers", cta: "Browse specialists",
    emptyTitle: "No specialist outreach yet",
    emptyDesc: "Message a Talent Acquisition Specialist to see if a veterinarian in their network is ready to buy a practice." },
  { id: "featured", label: "Featured Listing", hash: "featured", channel: "featured", icon: "star",
    path: "/practice/promotions/featured", cta: "Feature my listing",
    emptyTitle: "No featured boosts yet",
    emptyDesc: "Boost your anonymous listing to the top of the Marketplace and across CareOwner's owned channels." },
  { id: "local", label: "Local Advertising", hash: "local", channel: "local_pubs", icon: "newspaper",
    path: "/practice/promotions/local-ads", cta: "Find placements",
    emptyTitle: "No local placements yet",
    emptyDesc: "Place ads in the local and trade publications buyers actually read — VMA newsletters, business journals, community papers." },
  { id: "pr", label: "Press & PR", hash: "pr", channel: "pr", icon: "megaphone",
    path: "/practice/promotions/pr", cta: "Pitch your story",
    emptyTitle: "No press outreach yet",
    emptyDesc: "Turn your sale into a story — AI-drafted angles, a ready-to-send press kit, and pitches to reporters who cover your town." },
];

const PromoteHub = ({ tab, onToast }) => {
  const promo = usePromo();
  const listing = useMyListing();
  const f = listing.featured;
  const featuredActive = f && f.status === "active";
  const activeTab = (PROMO_TABS.find(t => t.hash && t.hash === tab) || PROMO_TABS[0]).id;

  const channels = [
    {
      id: "meta_ads", flag: PROMO_META_ENABLED, icon: "facebook", title: "Facebook & Instagram Ads",
      desc: "Audience-targeted ads that never reveal your practice. We build and run them for you for one flat rate — no Facebook account needed.",
      meta: "Always anonymous · AI-drafted creative", cta: "Build an ad campaign", path: "/practice/promotions/ads",
    },
    {
      id: "dvm_buyers", flag: PROMO_DVM_ENABLED, icon: "users", title: "Find DVM Buyers",
      desc: "Tap into our network of Talent Acquisition Specialists — recruiters who work with DVMs every day — to see if a veterinarian in their network is interested in buying a practice.",
      meta: "Recruiter referrals · In-platform messaging", cta: "Browse specialists", path: "/practice/promotions#dvm",
    },
    {
      id: "featured", flag: PROMO_FEATURED_ENABLED, icon: "star", title: "Featured Listing",
      desc: "Boost your anonymous listing across CareOwner's own channels — top of the Marketplace, the home carousel, email blasts, and social posts.",
      meta: "Always anonymous · Owned channels",
      cta: featuredActive ? "Manage boost" : "Feature my listing", path: "/practice/promotions/featured",
      pill: featuredActive ? `Featured — ${featuredDaysLeft(f)} days left` : null,
    },
    {
      id: "local_pubs", flag: PROMO_LOCALPUBS_ENABLED, icon: "newspaper", title: "Local Advertising",
      desc: "Place ads in the local and trade publications buyers actually read — VMA newsletters, business journals, community papers.",
      meta: "Named or semi-anonymous · Concierge placement", cta: "Find placements", path: "/practice/promotions/local-ads",
    },
    {
      id: "pr", flag: PROMO_PR_ENABLED, icon: "megaphone", title: "Press & PR",
      desc: "Turn your sale into a story — AI-drafted angles, a ready-to-send press kit, and pitches to the reporters who cover your town.",
      meta: "Always named · Earned media",
      cta: promo.prCampaign ? "View outreach pipeline" : "Pitch your story", path: "/practice/promotions/pr",
    },
  ];

  const rows = createdRows(promo, listing);
  const tabDef = PROMO_TABS.find(t => t.id === activeTab) || PROMO_TABS[0];

  const shareAside = (
    <aside className="co-aside">
      <div>
        <div className="co-card__head" style={{ margin: 0, marginBottom: 12 }}>
          <h3 className="co-card__title"><Icon name="activity" />Latest updates</h3>
        </div>
        <div className="pr-feed">
          {PROMO_UPDATES.map(u => (
            <button key={u.id} className={`pr-feed__item ${u.attention ? "is-attention" : ""}`} onClick={() => navigateTo(u.path)}>
              <span className={`pr-feed__icon pr-feed__icon--${u.tint}`}><Icon name={u.icon} size={14} /></span>
              <span className="pr-feed__body">
                <span className="pr-feed__text" dangerouslySetInnerHTML={{ __html: u.text }} />
                <span className="pr-feed__time">{u.time}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="co-card__head" style={{ margin: 0, marginBottom: 12 }}>
          <h3 className="co-card__title"><Icon name="eye" />Share Listing</h3>
          <button className="co-btn-manage" style={{ height: 32, padding: "0 12px" }} onClick={() => window.open(promoShareUrl("/l/" + listing.id), "_blank", "noopener")}>
            <Icon name="externalLink" size={13} /> Preview
          </button>
        </div>
        <div className="pr-sharecard">
          <div className="pr-sharecard__top">
            <div className="pr-sharecard__text">
              <h4 className="pr-sharecard__title">{listing.title}</h4>
              <div className="pr-sharecard__bars"><span /><span /><span /></div>
            </div>
            <div className="pr-sharecard__media"><img src={listing.image} alt="Landing page preview" /></div>
          </div>
          <button className="co-btn co-btn--primary" onClick={() => navigateTo("/practice/promotions/share")}>
            Get share links <Icon name="chevronRight" size={14} />
          </button>
        </div>
      </div>
      {!featuredActive && (
        <button className="pr-upsell" onClick={() => navigateTo("/practice/promotions/featured")}>
          <span className="pr-upsell__icon"><Icon name="star" size={16} /></span>
          <span>
            <span className="pr-upsell__title">Get seen first <Icon name="chevronRight" size={18} /></span>
            <span className="pr-upsell__desc">Feature your listing at the top of the Marketplace.</span>
          </span>
        </button>
      )}
    </aside>
  );

  return (
    <>
      <SubHeader
        crumbs={[PRACTICE.name, "Promotions"]}
        title="Promote Your Practice"
        subtitle="Set up promotions to attract buyers, team members, and more."
      />
      <div className="co-body">
        <div className="co-tabs pr-dashtabs" style={{ marginBottom: 20 }}>
          {PROMO_TABS.map(t => {
            const attention = t.channel
              ? rows.some(r => r.channel === t.channel && (STATUS_BADGE[r.status] || {}).dot === "attention")
              : false;
            return (
              <button key={t.id} className={activeTab === t.id ? "is-active" : ""}
                onClick={() => navigateTo("/practice/promotions" + (t.hash ? "#" + t.hash : ""))}>
                {t.label}
                {attention && <span className="pr-dot pr-dot--attention pr-tabdot" />}
              </button>
            );
          })}
        </div>

        {/* DVM Buyers is a live directory of every specialist on the platform,
            not a list of past promotions — it renders the shared panel instead. */}
        {activeTab === "dvm" && <TaSpecialistsPanel onToast={onToast} />}
        {activeTab !== "overview" && activeTab !== "dvm" && <ChannelPanel tab={tabDef} rows={rows} onToast={onToast} />}

        {activeTab === "overview" && (
        <section className="pr-section">
          <div className="pr-section__cols">
            <div>
              <RoiStrip promo={promo} listing={listing} onToast={onToast} />

              <div className="pr-section__head">
                <h2 className="pr-section__title">Create Promotions</h2>
                <p className="pr-section__sub">Create paid campaigns, share a landing page with your network, or generate press coverage.</p>
              </div>

              <div className="pr-channels">
                {channels.map(ch => {
                  const soon = !ch.flag;
                  return (
                    <div key={ch.id} className={`pr-channel ${soon ? "pr-channel--soon" : ""}`}>
                      <div className="pr-channel__top">
                        <div className="pr-channel__icon"><Icon name={ch.icon} size={20} /></div>
                        {soon && <span className="pr-channel__soon">Coming soon</span>}
                        {!soon && ch.pill && <span className="pr-channel__pill"><Icon name="star" size={11} /> {ch.pill}</span>}
                      </div>
                      <h3 className="pr-channel__title">{ch.title}</h3>
                      <p className="pr-channel__desc">{ch.desc}</p>
                      {!soon && (
                        <div className="pr-channel__foot">
                          <button className="co-btn co-btn--primary" onClick={() => navigateTo(ch.path)}>
                            {ch.cta} <Icon name="chevronRight" size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {shareAside}
          </div>
        </section>
        )}
      </div>
    </>
  );
};

// ─── Wizard scaffolding shared by the flows ───────────────────────────────────
// Completed steps are clickable when `onStepClick` is provided — every flow
// passes its setStep so users can hop back to any step they've already passed.
const Stepper = ({ steps, step, onStepClick }) => (
  <div className="mc-steps">
    {steps.map((label, i) => {
      const n = i + 1;
      const done = n < step;
      const clickable = done && !!onStepClick;
      const cls = `mc-step ${n === step ? "is-active" : done ? "is-done" : ""} ${clickable ? "mc-step--link" : ""}`;
      const inner = (
        <>
          <span className="mc-step__num">{done ? <Icon name="check" /> : n}</span>
          <span className="mc-step__label">{label}</span>
        </>
      );
      return (
        <React.Fragment key={label}>
          {clickable
            ? <button type="button" className={cls} title={`Go back to ${label}`} onClick={() => onStepClick(n)}>{inner}</button>
            : <div className={cls}>{inner}</div>}
          {n < steps.length && <div className="mc-step__line" />}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Meta ad builder wizard ───────────────────────────────────────────────────
// A standalone overview page (no stepper — the price is flat and shown up front)
// leads into a 3-step flow: Audience → Creative (with a live landing-page preview
// rail) → Review. The request goes to CareOwner's ads desk: manual review, an
// approval email with a payment link, then a hand-managed launch from VetVet's
// Meta ad account.
const AD_STEPS = ["Audience", "Creative", "Review"];

// Overview "How it works" grid (Figma 253:4722). The 4th tile restates the
// anonymity guarantee so the overview stands on its own without the full
// hidden/shown table.
const AD_HOW_IT_WORKS = [
  { icon: "sparkles", title: "Build inside CareOwner",
    desc: "AI drafts your ad set based on your desired audience. You can review and edit every word before any ads are submitted." },
  { icon: "facebook", title: "We run them for you",
    desc: "Your ads run from VetVet's Meta ad account, managed hands-on by the CareOwner team — no Facebook account, budgets, or Meta invoices on your side." },
  { icon: "inbox", title: "Buyers come to you",
    desc: "Every ad links to your landing page. Interested buyers request info through CareOwner, and you approve who learns your name." },
  { icon: "eyeOff", title: "Ads are always anonymous",
    desc: "Your practice name and location stay hidden until a buyer requests information and you approve them." },
];

const LintWarning = ({ hits }) => hits.length === 0 ? null : (
  <div className="pr-lint">
    <Icon name="alertTriangle" size={14} />
    <span>Contains identifying details: {hits.map((h, i) => <b key={h}>{i > 0 && ", "}“{h}”</b>)}. Anonymous ads hide who you are — remove these before launch.</span>
  </div>
);

const VariantCard = ({ v, onChange, onRegen, regenBusy }) => {
  const hits = lintAnonymity(v.headline + " " + v.primaryText);
  const patch = (p) => onChange({ ...v, ...p, edited: true });
  const swapImage = () => {
    const idx = LISTING_IMAGE_LIBRARY.indexOf(v.imageUrl);
    patch({ imageUrl: LISTING_IMAGE_LIBRARY[(idx + 1) % LISTING_IMAGE_LIBRARY.length] });
  };
  const ctas = PROMO_CTA_OPTIONS.includes(v.cta) ? PROMO_CTA_OPTIONS : [v.cta, ...PROMO_CTA_OPTIONS];
  return (
    <div className={`pr-var ${regenBusy ? "is-busy" : ""}`}>
      <div className="pr-var__media">
        <img src={v.imageUrl} alt="" />
        <button className="pr-var__swap" title="Swap image" onClick={swapImage}><Icon name="image" size={13} /> Swap</button>
      </div>
      <div className="pr-var__body">
        <div className="co-field"><label>Headline</label>
          <input value={v.headline} onChange={e => patch({ headline: e.target.value })} />
        </div>
        <div className="co-field"><label>Primary text</label>
          <textarea rows={4} value={v.primaryText} onChange={e => patch({ primaryText: e.target.value })} />
        </div>
        <div className="co-field"><label>Call to action</label>
          <select value={v.cta} onChange={e => patch({ cta: e.target.value })}>
            {ctas.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <LintWarning hits={hits} />
        <div className="pr-var__foot">
          <button className="co-edit" disabled={regenBusy} onClick={onRegen}>
            <Icon name="refreshCw" size={13} className={regenBusy ? "pr-spin" : ""} /> {regenBusy ? "Regenerating…" : "Regenerate"}
          </button>
          {v.edited && <span className="co-badge co-badge--blue">Edited</span>}
        </div>
      </div>
    </div>
  );
};

const AdWizard = ({ onToast }) => {
  const listing = useMyListing();
  const [started, setStarted] = React.useState(false); // false = overview page, true = 3-step flow
  const [step, setStep] = React.useState(1);            // 1 Audience · 2 Creative · 3 Review
  const [audiences, setAudiences] = React.useState(["individual_dvm"]);
  const [otherNote, setOtherNote] = React.useState("");
  const [variants, setVariants] = React.useState(null);
  const [generatedFor, setGeneratedFor] = React.useState("");
  const [generating, setGenerating] = React.useState(false);
  const [regenId, setRegenId] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const plan = META_AD_PLAN;

  const audKey = audiences.slice().sort().join(",");
  const toggleAudience = (id) => setAudiences(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);

  // Draft creative whenever the Creative step is entered with a changed audience mix.
  React.useEffect(() => {
    if (!started || step !== 2 || generating || (variants && generatedFor === audKey)) return;
    setGenerating(true);
    generateCreative(listing, audiences).then(vs => {
      setVariants(vs); setGeneratedFor(audKey); setGenerating(false);
    });
  }, [started, step, audKey]);

  const updateVariant = (nv) => setVariants(vs => vs.map(v => v.id === nv.id ? nv : v));
  const regen = (v) => {
    setRegenId(v.id);
    regenerateCreative(v).then(nv => { updateVariant(nv); setRegenId(null); });
  };

  const lintHits = (variants || []).filter(v => lintAnonymity(v.headline + " " + v.primaryText).length > 0).length;
  const editedCount = (variants || []).filter(v => v.edited).length;
  const variantCount = (variants || []).length;
  const landingPath = "/l/" + listing.id;
  const openLanding = () => window.open(promoShareUrl(landingPath), "_blank", "noopener");

  const canContinue =
    step === 1 ? audiences.length > 0 :
    step === 2 ? !!variants && !generating : true;

  const back = () => step === 1 ? setStarted(false) : setStep(s => s - 1);
  const next = () => setStep(s => Math.min(3, s + 1));

  // Submit the request to CareOwner's ads desk — nothing launches (and nothing
  // is charged) until the team approves it and the emailed payment link is paid.
  const submitRequest = () => {
    setSubmitting(true);
    mockAdService.submitRequest({}).then(({ campaignId }) => {
      const campaign = {
        id: campaignId, listingId: listing.id, audiences: audiences.slice(),
        variants, anonymityMode: "anonymous",
        price: plan.price, durationDays: plan.days,
        status: "in_review",
        landingUrl: landingPath + "?src=meta",
        metrics: null,
        createdAt: todayLabel(),
      };
      variants.forEach(v => saveAsset({ kind: "creative", channel: "meta_ads", label: v.headline, data: v }));
      updatePromo({ campaigns: [campaign, ...PROMO.campaigns] });
      navigateTo("/practice/promotions#meta");
      onToast("Request submitted — we'll email you when your ads are approved");
    });
  };

  const subtitle = "We build, run, and manage anonymous ads for one flat rate.";

  // ── Overview (pre-flow) — no stepper; the flat price is shown up front ──
  if (!started) {
    return (
      <>
        <SubHeader
          title="Create Meta ad campaign"
          subtitle={subtitle}
          backAction={<button className="co-btn-outline" onClick={() => navigateTo("/practice/promotions")}><Icon name="x" /> Cancel</button>}
        />
        <div className="co-body">
          <div className="pr-adov">
            <div className="co-card pr-adov__how">
              <div className="pr-adov__eyebrow">How it works</div>
              <h3 className="pr-adov__title">Run Facebook and Instagram ads to expand your reach</h3>
              <p className="pr-adov__lede">Anonymity is locked for ads — your practice name and location stay hidden until a
              buyer requests info and you approve them. Here's exactly what buyers will and won't see:</p>
              <div className="pr-adov__grid">
                {AD_HOW_IT_WORKS.map(s => (
                  <div key={s.title} className="pr-adov__item">
                    <span className="pr-adov__icon"><Icon name={s.icon} size={18} /></span>
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="co-card pr-adov__price">
              <div className="pr-adov__eyebrow">Monthly pricing</div>
              <div className="pr-adov__amount">${fmtInt(plan.price)}</div>
              <ul className="pr-tier__list pr-adov__list">
                {plan.benefits.map(b => <li key={b}><Icon name="check" size={12} /> {b}</li>)}
              </ul>
              <div className="pr-adov__cta">
                <div className="pr-adov__cta-q">Ready to build your ad campaign?</div>
                <button className="co-btn co-btn--primary" onClick={() => setStarted(true)}>
                  Get Started <Icon name="chevronRight" size={14} />
                </button>
              </div>
            </aside>
          </div>
        </div>

        <div className="pr-wizard__footer">
          <span />
          <button className="co-btn co-btn--primary" onClick={() => setStarted(true)}>Get Started <Icon name="chevronRight" size={14} /></button>
        </div>
      </>
    );
  }

  // Creative step's sticky right rail — the landing page the ads click through
  // to, in the same miniature used by the hub's Share Listing card.
  const previewRail = (
    <aside className="co-aside">
      <div>
        <div className="co-card__head" style={{ margin: 0, marginBottom: 12 }}>
          <h3 className="co-card__title"><Icon name="eye" />Where your ads lead</h3>
          <button className="co-btn-manage" style={{ height: 32, padding: "0 12px" }} onClick={openLanding}>
            <Icon name="externalLink" size={13} /> Preview
          </button>
        </div>
        <div className="pr-sharecard">
          <div className="pr-sharecard__top">
            <div className="pr-sharecard__text">
              <h4 className="pr-sharecard__title">{listing.title}</h4>
              <div className="pr-sharecard__bars"><span /><span /><span /></div>
            </div>
            <div className="pr-sharecard__media"><img src={listing.image} alt="Landing page preview" /></div>
          </div>
          <p className="pr-sharecard__note">Buyers who click any of your ads land on this anonymous page — generalized location, banded financials, illustrative artwork. Never your practice name.</p>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <SubHeader
        title="Create Meta ad campaign"
        subtitle={subtitle}
        backAction={<button className="co-btn-outline" onClick={() => navigateTo("/practice/promotions")}><Icon name="x" /> Cancel</button>}
      />
      <div className="co-body">
        <Stepper steps={AD_STEPS} step={step} onStepClick={setStep} />

        <div className={step === 2 ? "pr-step-cols" : step === 3 ? "pr-review-cols" : undefined}>
        <div className="co-card">
          {step === 1 && (
            <>
              <div className="co-card__head">
                <div>
                  <h3 className="co-card__title">Who should see your ads?</h3>
                  <p className="co-card__subtitle">We'll draft ads with a different angle per audience.</p>
                </div>
                <span className="co-card__meta">{audiences.length} selected · select all that apply</span>
              </div>
              <div className="pr-auds">
                {PROMO_AUDIENCES.map(a => {
                  const on = audiences.includes(a.id);
                  return (
                    <button key={a.id} type="button" className={`pr-aud ${on ? "is-selected" : ""}`} onClick={() => toggleAudience(a.id)}>
                      <span className="pr-aud__check"><Icon name="check" size={12} /></span>
                      <span className="pr-aud__icon"><Icon name={a.icon} size={18} /></span>
                      <span className="pr-aud__text">
                        <span className="pr-aud__label">{a.label}{a.hint && <span className="pr-aud__hint">{a.hint}</span>}</span>
                        <span className="pr-aud__desc">{a.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              {audiences.includes("other") && (
                <div className="co-field" style={{ marginTop: 16 }}>
                  <label>Who else do you want to reach?</label>
                  <textarea rows={2} value={otherNote} onChange={e => setOtherNote(e.target.value)} placeholder="e.g. Practice managers in the Chicago area who may know a buyer…" />
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div className="co-card__head">
                <h3 className="co-card__title">Review your ad creative</h3>
                {variants && !generating && <span className="co-card__meta">{variants.length} drafts · {editedCount} edited</span>}
              </div>
              {generating ? (
                <div className="pr-generating">
                  <Icon name="sparkles" size={22} className="pr-pulse" />
                  <div className="pr-generating__title">Drafting creative for {audiences.length} {audiences.length === 1 ? "audience" : "audiences"}…</div>
                  <div className="pr-generating__sub">Writing anonymized copy from your live listing — no names, no addresses.</div>
                </div>
              ) : (
                audiences.map(aud => {
                  const a = audienceMeta(aud);
                  const list = (variants || []).filter(v => v.audience === aud);
                  return (
                    <div key={aud} className="pr-var-group">
                      <div className="mc-group-title"><Icon name={a.icon} size={13} style={{ marginRight: 6, marginBottom: -2 }} />{a.label}</div>
                      <div className="pr-var-grid">
                        {list.map(v => (
                          <VariantCard key={v.id} v={v} onChange={updateVariant} onRegen={() => regen(v)} regenBusy={regenId === v.id} />
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {step === 3 && (
            <>
              <div className="co-card__head"><h3 className="co-card__title">Review your ad</h3></div>
              <div className="pr-rev">
                <div className="pr-rev__row">
                  <div className="pr-rev__label">Audience</div>
                  <div className="pr-rev__val">{audiences.map(a => audienceMeta(a).label).join(", ")}</div>
                  <button className="co-edit pr-rev__edit" onClick={() => setStep(1)}>Edit</button>
                </div>
                <div className="pr-rev__row">
                  <div className="pr-rev__label">Ad creative</div>
                  <div className="pr-rev__val">{variantCount} {variantCount === 1 ? "variant" : "variants"}
                    <span className="pr-rev__sub">{editedCount} edited · {variantCount - editedCount} AI {variantCount - editedCount === 1 ? "draft" : "drafts"}</span></div>
                  <button className="co-edit pr-rev__edit" onClick={() => setStep(2)}>Edit</button>
                </div>
                <div className="pr-rev__row">
                  <div className="pr-rev__label">Landing page</div>
                  <div className="pr-rev__val"><button className="pr-link" onClick={openLanding}><Icon name="externalLink" size={13} /> Preview</button></div>
                </div>
                <div className="pr-rev__row">
                  <div className="pr-rev__label">Price</div>
                  <div className="pr-rev__val">${fmtInt(plan.price)}
                    <span className="pr-rev__sub">One-time · {plan.days}-day campaign</span></div>
                </div>
              </div>
              {lintHits > 0 && (
                <div className="pr-warn" style={{ marginTop: 16 }}>
                  <Icon name="alertTriangle" size={16} />
                  <div><b>{lintHits} {lintHits === 1 ? "variant" : "variants"}</b> still {lintHits === 1 ? "contains" : "contain"} identifying details. <button className="pr-link" onClick={() => setStep(2)}>Edit creative</button> to clean {lintHits === 1 ? "it" : "them"} up before submitting.</div>
                </div>
              )}
            </>
          )}
        </div>
        {step === 2 && previewRail}
        {step === 3 && (
          <aside className="co-card pr-next-card">
            <div className="co-card__head"><h3 className="co-card__title">What happens next</h3></div>
            <ol className="pr-next__list">
              <li><b>Submit your request to CareOwner.</b> Our ads team reviews your campaign and creative — usually within 1–2 business days.</li>
              <li><b>Get approved by email.</b> Once your ads are approved, we'll email you a secure link to pay the one-time ${fmtInt(plan.price)}. Nothing is charged before then.</li>
              <li><b>We launch and manage your ads.</b> After payment, the team launches your campaign from VetVet's ad account and manages it by hand for the full {plan.days} days. Results land on your Promotions page.</li>
            </ol>
          </aside>
        )}
        </div>

        <div className="pr-wizard__footer">
          <button className="co-btn co-btn--ghost" onClick={back} disabled={submitting}>Back</button>
          {step < 3
            ? <button className="co-btn co-btn--primary" onClick={next} disabled={!canContinue}>Continue <Icon name="chevronRight" size={14} /></button>
            : <button className="co-btn co-btn--primary" onClick={submitRequest} disabled={submitting}>
                <Icon name="send" size={14} className={submitting ? "pr-pulse" : ""} /> {submitting ? "Submitting…" : "Submit for review"}
              </button>}
        </div>
      </div>
    </>
  );
};

// ─── Share Links screen ───────────────────────────────────────────────────────
const SRC_LABELS = { meta: "Facebook / Instagram ads", featured: "Featured boost", email: "Email", sms: "SMS", linkedin: "LinkedIn", facebook: "Facebook", qr: "QR code", dvm: "Note to a DVM", neighbor: "Note to a neighbor", corp: "Note to a corporate buyer", direct: "Direct note", press: "Press coverage", link: "Direct link" };

const ShareLinks = ({ onToast }) => {
  const promo = usePromo();

  // Mock per-channel attribution — landing-page inquiries carry their ?src= tag.
  const bySrc = promo.leads.reduce((m, l) => { const k = l.src || "link"; m[k] = (m[k] || 0) + 1; return m; }, {});

  return (
    <>
      <SubHeader
        title="Share Links"
        subtitle="Two landing pages, two levels of disclosure — pick the right one for whoever's asking."
        backAction={<button className="co-btn-outline" onClick={() => navigateTo("/practice/promotions")}><Icon name="chevronRight" style={{ transform: "rotate(180deg)" }} /> Back to Promotions</button>}
      />
      <div className="co-body">
        <div className="pr-share-grid">
          <PromoShareCard mode="anonymous" onToast={onToast} />
          <PromoShareCard mode="trusted" onToast={onToast} />
        </div>

        <div className="co-card" style={{ marginTop: 16 }}>
          <div className="co-card__head">
            <h3 className="co-card__title"><Icon name="activity" />Link activity</h3>
            <span className="co-card__meta">{promo.leads.length} {promo.leads.length === 1 ? "inquiry" : "inquiries"} from shared links</span>
          </div>
          {promo.leads.length === 0 ? (
            <p style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", margin: 0 }}>
              No inquiries from your links yet. Each link carries a source tag (<span style={{ font: "var(--font-monospace, 400 12px/16px monospace)" }}>?src=…</span>),
              so once you share them you'll see exactly which channel each inquiry came from.
            </p>
          ) : (
            <table className="co-table">
              <thead><tr><th>Source</th><th>Inquiries</th><th>Latest</th></tr></thead>
              <tbody>
                {Object.entries(bySrc).map(([src, count]) => {
                  const latest = promo.leads.find(l => (l.src || "link") === src);
                  return (
                    <tr key={src}>
                      <td><div className="co-table__name">{SRC_LABELS[src] || src}</div></td>
                      <td><span className="co-badge co-badge--gray">{count}</span></td>
                      <td>{latest ? `${latest.name} · ${latest.at}` : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

// ─── Featured Listing flow ────────────────────────────────────────────────────
const FEATURED_STEPS = ["Pick a tier", "Preview", "Anonymity", "Pay & activate"];

const tierBenefits = (t) => [
  "Top of the Marketplace + “Featured” badge",
  "CareOwner home carousel",
  `${t.placements.emailBlasts} buyer email ${t.placements.emailBlasts === 1 ? "blast" : "blasts"}`,
  `${t.placements.socialPosts} CareOwner social ${t.placements.socialPosts === 1 ? "post" : "posts"}`,
  ...(t.placements.matchingBoost ? ["Buyer-matching boost"] : []),
  ...t.extras,
];

const FeaturedFlow = ({ onToast }) => {
  const listing = useMyListing();
  const [step, setStep] = React.useState(1);
  const [tierId, setTierId] = React.useState("featured_30");
  const [autoRenew, setAutoRenew] = React.useState(false);
  const [paying, setPaying] = React.useState(false);
  const tier = FEATURED_TIERS.find(t => t.id === tierId);
  const active = listing.featured && listing.featured.status === "active";

  const back = () => step === 1 ? navigateTo("/practice/promotions") : setStep(s => s - 1);

  const activate = () => {
    setPaying(true);
    // TODO(api): real payment capture happens here before activation.
    mockFeaturedService.activate(listing.id, tierId, autoRenew).then(featured => {
      updateMyListing({ featured });
      navigateTo("/practice/promotions");
      onToast(`Featured boost active — your listing is at the top of the Marketplace for ${tier.days} days`);
    });
  };

  if (active) {
    const f = listing.featured;
    const t = FEATURED_TIERS.find(x => x.id === f.tier) || {};
    return (
      <>
        <SubHeader title="Featured Listing"
          subtitle="Your listing is currently boosted across CareOwner's owned channels."
          backAction={<button className="co-btn-outline" onClick={() => navigateTo("/practice/promotions")}><Icon name="chevronRight" style={{ transform: "rotate(180deg)" }} /> Back to Promotions</button>} />
        <div className="co-body">
          <div className="co-card">
            <div className="co-card__head">
              <h3 className="co-card__title"><Icon name="star" />Featured — {featuredDaysLeft(f)} days left</h3>
              <span className={`co-badge ${STATUS_BADGE.active.cls}`}>Active</span>
            </div>
            <div className="co-deals" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
              <div><div className="co-deal__label">Tier</div><div className="co-deal__value">{t.label} · ${t.price}</div></div>
              <div><div className="co-deal__label">Runs</div><div className="co-deal__value">{f.startAt} → {f.endAt}</div></div>
              <div><div className="co-deal__label">Auto-renew</div><div className="co-deal__value">{f.autoRenew ? "On" : "Off"}</div></div>
            </div>
            <div style={{ borderTop: "1px solid var(--stone-100)", margin: "16px 0" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button className="co-btn co-btn--ghost" onClick={() => {
                updateMyListing({ featured: { ...f, autoRenew: !f.autoRenew } });
                onToast(f.autoRenew ? "Auto-renew turned off" : "Auto-renew turned on");
              }}>{f.autoRenew ? "Turn off auto-renew" : "Turn on auto-renew"}</button>
              <button className="co-btn co-btn--ghost" style={{ color: "#B42318" }} onClick={() => {
                mockFeaturedService.cancel(f.id).then(() => {
                  updateMyListing({ featured: { ...f, status: "cancelled" } });
                  onToast("Featured boost cancelled");
                });
              }}>Cancel boost early</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SubHeader
        title="Featured Listing"
        subtitle="Boost your anonymous listing across CareOwner's owned channels — no ad accounts, no copy to write."
        backAction={<button className="co-btn-outline" onClick={() => navigateTo("/practice/promotions")}><Icon name="x" /> Cancel</button>}
      />
      <div className="co-body">
        <Stepper steps={FEATURED_STEPS} step={step} onStepClick={setStep} />

        <div className="co-card">
          {step === 1 && (
            <>
              <div className="co-card__head"><h3 className="co-card__title">How long should the boost run?</h3></div>
              <div className="pr-tiers">
                {FEATURED_TIERS.map(t => {
                  const on = tierId === t.id;
                  return (
                    <button key={t.id} type="button" className={`pr-tier ${on ? "is-selected" : ""}`} onClick={() => setTierId(t.id)}>
                      {t.recommended && <span className="pr-tier__flag">Recommended</span>}
                      <span className="pr-tier__days">{t.label}</span>
                      <span className="pr-tier__price">${t.price}</span>
                      <span className="pr-tier__per">≈ ${(t.price / t.days).toFixed(2)}/day</span>
                      <ul className="pr-tier__list">
                        {tierBenefits(t).map(b => <li key={b}><Icon name="check" size={12} /> {b}</li>)}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="co-card__head"><h3 className="co-card__title">Where your listing will appear</h3><span className="co-card__meta">Rotated fairly with other featured practices</span></div>
              <div className="pr-featprev">
                <div>
                  <div className="mc-group-title" style={{ marginTop: 0 }}>Top of the Marketplace</div>
                  <div className="pr-featprev__card">
                    <span className="mk-featured-tag" style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}><Icon name="star" size={13} /> Featured</span>
                    <PreviewListingCard listing={listing} />
                  </div>
                </div>
                <div>
                  <div className="mc-group-title" style={{ marginTop: 0 }}>CareOwner home — Featured Practices carousel</div>
                  <div className="pr-featprev__carousel">
                    <div className="pr-featprev__slide is-mine">
                      <img src={listing.image} alt="" />
                      <span>{listing.title}</span>
                    </div>
                    <div className="pr-featprev__slide" /><div className="pr-featprev__slide" />
                  </div>
                  <ul className="pr-tier__list" style={{ marginTop: 14 }}>
                    <li><Icon name="check" size={12} /> {tier.placements.emailBlasts} inclusion{tier.placements.emailBlasts === 1 ? "" : "s"} in the buyer email blast</li>
                    <li><Icon name="check" size={12} /> {tier.placements.socialPosts} CareOwner social post{tier.placements.socialPosts === 1 ? "" : "s"}</li>
                    {tier.placements.matchingBoost && <li><Icon name="check" size={12} /> Priority weighting in buyer matching</li>}
                  </ul>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="co-card__head"><h3 className="co-card__title">Anonymity</h3></div>
              <div className="pr-anon-state">
                <div className="pr-anon-state__icon"><Icon name="lock" size={20} /></div>
                <div>
                  <div className="pr-anon-state__title">Runs anonymously <span className="co-badge co-badge--gray" style={{ marginLeft: 8 }}>Read-only</span></div>
                  <p>The Featured boost promotes your existing anonymous listing to CareOwner's general buyer pool —
                  same card, same teaser page, just seen by far more buyers. Your name and location stay hidden
                  until you approve an inquiry.</p>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="co-card__head"><h3 className="co-card__title">Review & pay</h3></div>
              <div className="co-deals" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                <div><div className="co-deal__label">Tier</div><div className="co-deal__value">{tier.label}</div>
                  <div style={{ font: "400 13px/1.4 Inter", color: "var(--stone-500)", marginTop: 4 }}>{tierBenefits(tier).length} placements included</div></div>
                <div><div className="co-deal__label">Price</div><div className="co-deal__value">${tier.price}</div>
                  <div style={{ font: "400 13px/1.4 Inter", color: "var(--stone-500)", marginTop: 4 }}>One-time · billed by VetVet</div></div>
                <div><div className="co-deal__label">Starts</div><div className="co-deal__value">Immediately</div></div>
              </div>
              <div style={{ borderTop: "1px solid var(--stone-100)", margin: "16px 0" }} />
              <label className="pr-ack" style={{ marginBottom: 4 }}>
                <input type="checkbox" checked={autoRenew} onChange={e => setAutoRenew(e.target.checked)} />
                Auto-renew at the end of the term (cancel any time)
              </label>
            </>
          )}
        </div>

        <div className="pr-wizard__footer">
          <button className="co-btn co-btn--ghost" onClick={back} disabled={paying}>{step === 1 ? "Cancel" : "Back"}</button>
          {step < 4
            ? <button className="co-btn co-btn--primary" onClick={() => setStep(s => s + 1)}>Continue <Icon name="chevronRight" size={14} /></button>
            : <button className="co-btn co-btn--primary" onClick={activate} disabled={paying}>
                <Icon name="star" size={14} className={paying ? "pr-pulse" : ""} /> {paying ? "Processing payment…" : `Pay $${tier.price} & activate`}
              </button>}
        </div>
      </div>
    </>
  );
};

// ─── Local Advertising flow ───────────────────────────────────────────────────
const LOCAL_STEPS = ["Anonymity", "Find placements", "Creative", "Fulfillment & submit"];

const LocalAdsFlow = ({ onToast }) => {
  const listing = useMyListing();
  const promo = usePromo();
  const [step, setStep] = React.useState(1);
  const [mode, setMode] = React.useState("named");           // "named" | "semi_anonymous"
  const [ack, setAck] = React.useState(false);
  const [region, setRegion] = React.useState("Chicago metro / Northern IL");
  const [pubType, setPubType] = React.useState("all");
  const [budget, setBudget] = React.useState(600);
  const [searching, setSearching] = React.useState(false);
  const [candidates, setCandidates] = React.useState(null);
  const [selectedId, setSelectedId] = React.useState(null);
  const [creative, setCreative] = React.useState(null);
  const [fulfillment, setFulfillment] = React.useState("concierge");
  const [submitting, setSubmitting] = React.useState(false);

  const selected = (candidates || []).find(c => c.id === selectedId) || null;
  const savedCreatives = promo.assets.filter(a => a.kind === "creative");

  const search = () => {
    setSearching(true); setCandidates(null); setSelectedId(null);
    mockLocalPubsService.findPlacements(region, pubType, budget).then(cs => { setCandidates(cs); setSearching(false); });
  };

  // Draft outlet-sized creative when entering step 3 (or when outlet/mode changed).
  React.useEffect(() => {
    if (step !== 3 || !selected) return;
    if (creative && creative.forOutlet === selected.id && creative.forMode === mode) return;
    setCreative(null);
    const t = setTimeout(() => {
      setCreative({ ...localAdCreative(selected, mode), forOutlet: selected.id, forMode: mode });
    }, 900);
    return () => clearTimeout(t);
  }, [step, selectedId, mode]);

  const patchCreative = (p) => setCreative(c => ({ ...c, ...p, edited: true }));
  const lintHits = mode === "semi_anonymous" && creative ? lintAnonymity(creative.headline + " " + creative.primaryText) : [];

  const destPath = mode === "named" ? "/l/s/" + ensureTokenLazy() : "/l/" + listing.id;
  function ensureTokenLazy() { return PROMO.namedToken || "…"; }

  const canContinue =
    step === 1 ? (mode === "semi_anonymous" || ack) :
    step === 2 ? !!selected :
    step === 3 ? !!creative : true;

  const back = () => step === 1 ? navigateTo("/practice/promotions") : setStep(s => s - 1);

  const submit = () => {
    setSubmitting(true);
    const token = mode === "named" ? ensureNamedToken() : null;
    const landingUrl = (mode === "named" ? "/l/s/" + token : "/l/" + listing.id) + "?src=pub-" + selected.id;
    const order = {
      id: null, listingId: listing.id, candidateId: selected.id,
      outletName: selected.outletName, format: selected.format,
      anonymityMode: mode, creative, fulfillment,
      status: "submitted", landingUrl, metrics: null, createdAt: todayLabel(),
    };
    mockLocalPubsService.submit(order).then(({ orderId }) => {
      order.id = orderId;
      saveAsset({ kind: "creative", channel: "local_pubs", label: creative.headline, data: creative });
      updatePromo({ placements: [order, ...PROMO.placements] });
      if (fulfillment === "concierge") {
        // Concierge mock: VetVet places the ad; it goes live shortly with metrics.
        setTimeout(() => {
          updatePromo({ placements: PROMO.placements.map(p => p.id === orderId ? { ...p, status: "live", metrics: mockSmallMetrics() } : p) });
        }, 4000);
      }
      navigateTo("/practice/promotions");
      onToast(fulfillment === "concierge"
        ? `Order sent — VetVet will place your ad in ${selected.outletName}`
        : "Copy-ready asset + submission instructions exported (mock download)");
    });
  };

  return (
    <>
      <SubHeader
        title="Local Advertising"
        subtitle="Place your listing in the local and trade publications buyers actually read."
        backAction={<button className="co-btn-outline" onClick={() => navigateTo("/practice/promotions")}><Icon name="x" /> Cancel</button>}
      />
      <div className="co-body">
        <Stepper steps={LOCAL_STEPS} step={step} onStepClick={setStep} />

        <div className="co-card">
          {step === 1 && (
            <>
              <div className="co-card__head"><h3 className="co-card__title">How should the ad identify you?</h3><span className="co-card__meta">Decided per placement</span></div>
              <div className="pr-accts">
                <button type="button" className={`mc-radio-card pr-acct ${mode === "named" ? "is-selected" : ""}`} onClick={() => setMode("named")}>
                  <span className="mc-radio-card__radio" />
                  <span style={{ flex: 1 }}>
                    <span className="mc-radio-card__title">Named ad <span className="co-badge co-badge--gray" style={{ marginLeft: 6 }}>Default</span></span>
                    <span className="mc-radio-card__desc">“AnimalCare is for sale.” Strongest response — readers know and trust the practice — but everyone learns it's for sale. Links to your Trusted Share page.</span>
                  </span>
                </button>
                <button type="button" className={`mc-radio-card pr-acct ${mode === "semi_anonymous" ? "is-selected" : ""}`} onClick={() => setMode("semi_anonymous")}>
                  <span className="mc-radio-card__radio" />
                  <span style={{ flex: 1 }}>
                    <span className="mc-radio-card__title">Semi-anonymous ad</span>
                    <span className="mc-radio-card__desc">Region + practice type only — “Established small-animal practice, suburban Chicago area.” Softer response, identity protected. Links to your anonymous teaser.</span>
                  </span>
                </button>
              </div>
              {mode === "named" && (
                <NamedPromoAck checked={ack} onChange={setAck}
                  context="Your practice name will appear in print and online wherever this ad runs — staff, clients, and competitors may see it." />
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div className="co-card__head"><h3 className="co-card__title">Find placements</h3>{candidates && <span className="co-card__meta">{candidates.length} outlets ranked by relevance</span>}</div>
              <div className="pr-findbar">
                <div className="co-field"><label>Region</label>
                  <select value={region} onChange={e => setRegion(e.target.value)}>
                    <option>Chicago metro / Northern IL</option><option>Illinois statewide</option><option>Midwest region</option>
                  </select>
                </div>
                <div className="co-field"><label>Publication type</label>
                  <select value={pubType} onChange={e => setPubType(e.target.value)}>
                    <option value="all">All types</option>
                    {Object.entries(PLACEMENT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div className="co-field"><label>Budget</label>
                  <div className="pr-money"><span>$</span>
                    <input type="number" min="100" step="50" value={budget} onChange={e => setBudget(Math.max(0, parseInt(e.target.value, 10) || 0))} />
                  </div>
                </div>
                <button className="co-btn co-btn--primary" style={{ alignSelf: "flex-end" }} disabled={searching} onClick={search}>
                  <Icon name="search" size={14} className={searching ? "pr-pulse" : ""} /> {searching ? "Searching…" : "Find placements"}
                </button>
              </div>

              {searching && (
                <div className="pr-generating">
                  <Icon name="sparkles" size={22} className="pr-pulse" />
                  <div className="pr-generating__title">Scanning publications in {region}…</div>
                  <div className="pr-generating__sub">Ranking VMA newsletters, business journals, and community papers by buyer relevance.</div>
                </div>
              )}
              {candidates && candidates.map(c => {
                const on = selectedId === c.id;
                const over = c.estCost > budget;
                return (
                  <button key={c.id} type="button" className={`pr-place ${on ? "is-selected" : ""}`} onClick={() => setSelectedId(c.id)}>
                    <span className="pr-place__check"><Icon name="check" size={12} /></span>
                    <span className="pr-place__main">
                      <span className="pr-place__name">{c.outletName} <span className="pr-place__type">{PLACEMENT_TYPE_LABELS[c.type]}</span></span>
                      <span className="pr-place__reason">{c.relevanceReason}</span>
                      <span className="pr-place__meta">{c.reachEstimate} · {c.format} · runs in ~{c.leadTimeDays} days · {c.submissionPath === "self" ? "self-submit" : c.submissionPath === "portal" ? "online portal" : "concierge available"}</span>
                    </span>
                    <span className="pr-place__side">
                      <span className="pr-place__score"><b>{c.relevanceScore}</b> relevance</span>
                      <span className={`pr-place__cost ${over ? "is-over" : ""}`}>${c.estCost}{over ? " · over budget" : ""}</span>
                    </span>
                  </button>
                );
              })}
              {!candidates && !searching && (
                <p style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", margin: "8px 0 0" }}>
                  Set your region, type, and budget, then search. We rank each outlet by how likely its readers are to buy a practice like yours.
                </p>
              )}
            </>
          )}

          {step === 3 && selected && (
            <>
              <div className="co-card__head">
                <h3 className="co-card__title">Creative for {selected.outletName}</h3>
                <span className="co-card__meta">Sized to: {selected.format}</span>
              </div>
              {!creative ? (
                <div className="pr-generating">
                  <Icon name="sparkles" size={22} className="pr-pulse" />
                  <div className="pr-generating__title">Writing {mode === "named" ? "named" : "semi-anonymous"} copy for this outlet…</div>
                  <div className="pr-generating__sub">Matched to the outlet's format and audience.</div>
                </div>
              ) : (
                <div className="pr-var" style={{ maxWidth: 560 }}>
                  <div className="pr-var__media">
                    <img src={creative.imageUrl} alt="" />
                  </div>
                  <div className="pr-var__body">
                    <div className="co-field"><label>Headline</label>
                      <input value={creative.headline} onChange={e => patchCreative({ headline: e.target.value })} />
                    </div>
                    <div className="co-field"><label>Body copy</label>
                      <textarea rows={4} value={creative.primaryText} onChange={e => patchCreative({ primaryText: e.target.value })} />
                    </div>
                    <div className="co-field"><label>Call to action</label>
                      <input value={creative.cta} onChange={e => patchCreative({ cta: e.target.value })} />
                    </div>
                    <LintWarning hits={lintHits} />
                    <div className="pr-var__foot">
                      <span className="pr-tip" style={{ margin: 0 }}><Icon name="sparkles" size={13} /> Saved to your asset library on submit — reusable across channels.</span>
                      {creative.edited && <span className="co-badge co-badge--blue">Edited</span>}
                    </div>
                  </div>
                </div>
              )}
              {savedCreatives.length > 0 && creative && (
                <div className="pr-tip" style={{ marginTop: 14 }}>
                  <Icon name="refreshCw" size={13} /> Or reuse a saved asset:&nbsp;
                  {savedCreatives.slice(0, 3).map(a => (
                    <button key={a.id} className="co-edit" style={{ padding: "2px 6px" }}
                      onClick={() => setCreative(c => ({ ...c, headline: a.data.headline, primaryText: a.data.primaryText, edited: true }))}>
                      “{a.label.length > 34 ? a.label.slice(0, 34) + "…" : a.label}”
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 4 && selected && (
            <>
              <div className="co-card__head"><h3 className="co-card__title">Fulfillment & submit</h3></div>
              <div className="pr-accts">
                <button type="button" className={`mc-radio-card pr-acct ${fulfillment === "concierge" ? "is-selected" : ""}`} onClick={() => setFulfillment("concierge")}>
                  <span className="mc-radio-card__radio" />
                  <span style={{ flex: 1 }}>
                    <span className="mc-radio-card__title">Concierge placement <span className="co-badge co-badge--green" style={{ marginLeft: 6 }}>Recommended</span></span>
                    <span className="mc-radio-card__desc">VetVet books the insertion, handles the outlet's specs and billing, and confirms the run date. Flat $99 service fee + the outlet's ${selected.estCost} rate.</span>
                  </span>
                </button>
                <button type="button" className={`mc-radio-card pr-acct ${fulfillment === "self" ? "is-selected" : ""}`} onClick={() => setFulfillment("self")}>
                  <span className="mc-radio-card__radio" />
                  <span style={{ flex: 1 }}>
                    <span className="mc-radio-card__title">I'll submit it myself</span>
                    <span className="mc-radio-card__desc">Export a copy-ready asset plus step-by-step submission instructions for {selected.outletName}. You pay the outlet directly.</span>
                  </span>
                </button>
              </div>
              <div className="co-deals" style={{ gridTemplateColumns: "repeat(3,1fr)", marginTop: 16 }}>
                <div><div className="co-deal__label">Outlet</div><div className="co-deal__value">{selected.outletName}</div>
                  <div style={{ font: "400 13px/1.4 Inter", color: "var(--stone-500)", marginTop: 4 }}>{selected.format}</div></div>
                <div><div className="co-deal__label">Identity</div>
                  <div className="co-deal__value" style={mode === "named" ? { color: "#B45309", display: "flex", alignItems: "center", gap: 6 } : { display: "flex", alignItems: "center", gap: 6 }}>
                    {mode === "named" ? <><Icon name="alertTriangle" size={15} /> Named — {PRACTICE.name}</> : <><Icon name="eyeOff" size={14} /> Semi-anonymous</>}
                  </div></div>
                <div><div className="co-deal__label">Ad links to</div>
                  <div className="co-deal__value" style={{ fontSize: 14 }}>{promoShareUrl(destPath)}</div>
                  <div style={{ font: "400 13px/1.4 Inter", color: "var(--stone-500)", marginTop: 4 }}>Source-tagged ?src=pub-{selected.id}</div></div>
              </div>
              <div className="pr-est" style={{ marginTop: 16 }}>
                <span>Estimated cost <b>${fulfillment === "concierge" ? selected.estCost + 99 : selected.estCost}</b></span>
                <span className="pr-est__note">{fulfillment === "concierge" ? `$${selected.estCost} outlet rate + $99 concierge fee, billed by VetVet.` : `Paid by you directly to ${selected.outletName}.`}</span>
              </div>
            </>
          )}
        </div>

        <div className="pr-wizard__footer">
          <button className="co-btn co-btn--ghost" onClick={back} disabled={submitting}>{step === 1 ? "Cancel" : "Back"}</button>
          {step < 4
            ? <button className="co-btn co-btn--primary" onClick={() => setStep(s => s + 1)} disabled={!canContinue}>Continue <Icon name="chevronRight" size={14} /></button>
            : <button className="co-btn co-btn--primary" onClick={submit} disabled={submitting}>
                <Icon name="send" size={14} className={submitting ? "pr-pulse" : ""} /> {submitting ? "Submitting…" : fulfillment === "concierge" ? "Submit to VetVet concierge" : "Export & mark submitted"}
              </button>}
        </div>
      </div>
    </>
  );
};

// ─── Press & PR flow ──────────────────────────────────────────────────────────
const PR_STEPS = ["Named reveal", "Story angle", "Press kit", "Reporters", "Review & send"];
const PR_STATUS_META = {
  suggested: { cls: "co-badge--gray",  label: "Suggested" },
  pitched:   { cls: "co-badge--blue",  label: "Pitched" },
  opened:    { cls: "co-badge--amber", label: "Opened" },
  replied:   { cls: "co-badge--green", label: "Replied" },
  published: { cls: "co-badge--green", label: "Published" },
};
const PR_KIT_SECTIONS = [
  { id: "bio", label: "Owner bio", multiline: true },
  { id: "history", label: "Practice history", multiline: true },
  { id: "boilerplate", label: "Boilerplate", multiline: true },
];

// Status board shown once pitches have gone out.
const PrPipeline = ({ onToast }) => {
  const promo = usePromo();
  const pr = promo.prCampaign;
  const setTargetStatus = (id, status, extra) => {
    updatePromo({ prCampaign: { ...PROMO.prCampaign, targets: PROMO.prCampaign.targets.map(t => t.id === id ? { ...t, status, ...extra } : t) } });
  };
  return (
    <>
      <SubHeader title="Press & PR — outreach pipeline"
        subtitle={`“${pr.angle.title}”`}
        backAction={<button className="co-btn-outline" onClick={() => navigateTo("/practice/promotions")}><Icon name="chevronRight" style={{ transform: "rotate(180deg)" }} /> Back to Promotions</button>} />
      <div className="co-body">
        <div className="co-card">
          <div className="co-card__head">
            <h3 className="co-card__title"><Icon name="megaphone" />Pitches</h3>
            <span className="co-card__meta">suggested → pitched → opened → replied → published</span>
          </div>
          {pr.targets.map(t => {
            const m = PR_STATUS_META[t.status] || PR_STATUS_META.suggested;
            return (
              <div key={t.id} className="pr-pipe">
                <div className="pr-pipe__main">
                  <div className="pr-camp__name">{t.name} · <span style={{ fontWeight: 400 }}>{t.outlet}</span></div>
                  <div className="pr-camp__meta">{t.beat}{t.status === "pitched" ? " · follow up in 3 days if no reply" : ""}{t.status === "published" && t.metrics ? ` · ${fmtInt(t.metrics.impressions)} readers reached` : ""}</div>
                </div>
                <span className={`co-badge ${m.cls}`}>{m.label}</span>
                {t.status === "pitched" && <button className="co-edit" onClick={() => onToast(`Follow-up nudge drafted for ${t.name} (mock)`)}>Follow up</button>}
                {t.status === "replied" && (
                  <button className="co-edit" onClick={() => {
                    setTargetStatus(t.id, "published", { metrics: mockSmallMetrics() });
                    onToast(`Marked published — ${t.outlet} story links to your Trusted Share page`);
                  }}>Mark published</button>
                )}
                {t.status === "published" && (
                  <button className="co-edit" onClick={() => navigateTo("/l/s/" + (PROMO.namedToken || ""))}>View page</button>
                )}
              </div>
            );
          })}
          <p style={{ font: "400 13px/1.5 Inter", color: "var(--stone-500)", margin: "14px 0 0" }}>
            Published stories link to your Trusted Share page (source-tagged <span style={{ fontFamily: "monospace" }}>?src=press</span>) so coverage shows up in your results.
          </p>
        </div>
      </div>
    </>
  );
};

// Branches between the wizard and the pipeline OUTSIDE PrFlow — an early return
// inside PrFlow would skip its effects and break the rules of hooks.
const PrView = ({ onToast }) => {
  const promo = usePromo();
  return promo.prCampaign ? <PrPipeline onToast={onToast} /> : <PrFlow onToast={onToast} />;
};

const PrFlow = ({ onToast }) => {
  const listing = useMyListing();
  const [step, setStep] = React.useState(1);
  const [ack, setAck] = React.useState(false);
  const [interview, setInterview] = React.useState({});
  const [angles, setAngles] = React.useState(null);
  const [genAngles, setGenAngles] = React.useState(false);
  const [angleId, setAngleId] = React.useState(null);
  const [kit, setKit] = React.useState(null);
  const [kitApproved, setKitApproved] = React.useState({});
  const [reporters, setReporters] = React.useState(null);
  const [pickedReporters, setPickedReporters] = React.useState([]);
  const [openPitch, setOpenPitch] = React.useState(null);
  const [sendMode, setSendMode] = React.useState("concierge");
  const [sending, setSending] = React.useState(false);

  const angle = (angles || []).find(a => a.id === angleId) || null;

  const generateAngleList = () => {
    setGenAngles(true);
    mockPrService.generateAngles(listing, interview).then(as => { setAngles(as); setGenAngles(false); });
  };

  // Build the press kit when the step is first entered.
  React.useEffect(() => {
    if (step !== 3 || kit) return;
    mockPrService.buildKit(listing, interview).then(k => setKit(k));
  }, [step]);

  // Fetch reporter targets when the step is first entered.
  React.useEffect(() => {
    if (step !== 4 || reporters) return;
    mockPrService.findReporters("Chicago metro / Northern IL").then(rs => {
      setReporters(rs);
      setPickedReporters(rs.map(r => r.id));
    });
  }, [step]);

  const kitAllApproved = kit && PR_KIT_SECTIONS.every(s => kitApproved[s.id]) && kitApproved.stats && kitApproved.photos;
  const togglePicked = (id) => setPickedReporters(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const patchPitch = (id, text) => setReporters(rs => rs.map(r => r.id === id ? { ...r, pitchDraft: text } : r));

  const canContinue =
    step === 1 ? ack :
    step === 2 ? !!angle :
    step === 3 ? !!kitAllApproved :
    step === 4 ? pickedReporters.length > 0 : true;

  const back = () => step === 1 ? navigateTo("/practice/promotions") : setStep(s => s - 1);

  const send = () => {
    setSending(true);
    const token = ensureNamedToken();
    const targets = reporters.filter(r => pickedReporters.includes(r.id)).map(r => ({ ...r, status: "pitched" }));
    // TODO(api): concierge send = VetVet's outreach desk; self = export .eml drafts.
    Promise.all(targets.map(t => mockPrService.sendPitch(t))).then(() => {
      const campaign = {
        id: "pr_" + Math.random().toString(36).slice(2, 8), listingId: listing.id,
        angle, kit, targets, landingUrl: "/l/s/" + token + "?src=press", metrics: null,
      };
      saveAsset({ kind: "press-kit", channel: "pr", label: "Press kit — " + angle.title, data: kit });
      updatePromo({ prCampaign: campaign });
      // Mock pipeline movement so the board comes alive during a demo.
      setTimeout(() => {
        if (!PROMO.prCampaign) return;
        updatePromo({ prCampaign: { ...PROMO.prCampaign, targets: PROMO.prCampaign.targets.map((t, i) => i === 0 ? { ...t, status: "opened" } : t) } });
      }, 5000);
      setTimeout(() => {
        if (!PROMO.prCampaign) return;
        updatePromo({ prCampaign: { ...PROMO.prCampaign, targets: PROMO.prCampaign.targets.map((t, i) => i === 0 ? { ...t, status: "replied" } : t) } });
      }, 10000);
      onToast(sendMode === "concierge" ? `${targets.length} pitches sent by VetVet's outreach desk` : `${targets.length} pitch drafts exported to send from your email`);
      setSending(false);
    });
  };

  return (
    <>
      <SubHeader
        title="Press & PR"
        subtitle="Turn your sale into a story the local press wants to tell."
        backAction={<button className="co-btn-outline" onClick={() => navigateTo("/practice/promotions")}><Icon name="x" /> Cancel</button>}
      />
      <div className="co-body">
        <Stepper steps={PR_STEPS} step={step} onStepClick={setStep} />

        <div className="co-card">
          {step === 1 && (
            <>
              <div className="co-card__head"><h3 className="co-card__title">Press coverage names your practice</h3></div>
              <div className="pr-anon-state pr-anon-state--warn" style={{ marginBottom: 16 }}>
                <div className="pr-anon-state__icon"><Icon name="megaphone" size={20} /></div>
                <div>
                  <div className="pr-anon-state__title">PR is always named</div>
                  <p>A press story is a real story about a real practice — {PRACTICE.name}, Dr. Thompson, and the sale
                  will all be public. It's the most powerful channel for finding a community-minded buyer, and the
                  least anonymous.</p>
                </div>
              </div>
              <NamedPromoAck checked={ack} onChange={setAck}
                context="Reporters, readers, staff, and clients will all learn the practice is for sale." />
            </>
          )}

          {step === 2 && (
            <>
              <div className="co-card__head"><h3 className="co-card__title">Find your story angle</h3><span className="co-card__meta">2-minute owner interview</span></div>
              {!angles && !genAngles && (
                <>
                  <div className="pr-interview">
                    {PR_INTERVIEW_QUESTIONS.map(q => (
                      <div className="co-field" key={q.id}>
                        <label>{q.label}</label>
                        <textarea rows={2} placeholder={q.placeholder} value={interview[q.id] || ""}
                          onChange={e => setInterview(iv => ({ ...iv, [q.id]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                  <button className="co-btn co-btn--primary" onClick={generateAngleList}>
                    <Icon name="sparkles" size={14} /> Generate story angles
                  </button>
                </>
              )}
              {genAngles && (
                <div className="pr-generating">
                  <Icon name="sparkles" size={22} className="pr-pulse" />
                  <div className="pr-generating__title">Finding the story in your answers…</div>
                  <div className="pr-generating__sub">Drafting human-interest angles a local editor would actually run.</div>
                </div>
              )}
              {angles && !genAngles && (
                <>
                  <div className="mc-group-title" style={{ marginTop: 0 }}>Pick the angle that feels like you</div>
                  {angles.map(a => {
                    const on = angleId === a.id;
                    return (
                      <button key={a.id} type="button" className={`pr-place ${on ? "is-selected" : ""}`} onClick={() => setAngleId(a.id)}>
                        <span className="pr-place__check"><Icon name="check" size={12} /></span>
                        <span className="pr-place__main">
                          <span className="pr-place__name">{a.title}</span>
                          <span className="pr-place__reason">{a.summary}</span>
                        </span>
                      </button>
                    );
                  })}
                  <button className="co-edit" style={{ marginTop: 10 }} onClick={generateAngleList}><Icon name="refreshCw" size={13} /> Regenerate angles</button>
                </>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <div className="co-card__head">
                <h3 className="co-card__title">Your press kit</h3>
                <span className="co-card__meta">Approve every section before it can be used — nothing goes out unapproved</span>
              </div>
              {!kit ? (
                <div className="pr-generating">
                  <Icon name="sparkles" size={22} className="pr-pulse" />
                  <div className="pr-generating__title">Assembling your press kit…</div>
                  <div className="pr-generating__sub">Bio, history, quotable stats, and boilerplate — drafted from your profile.</div>
                </div>
              ) : (
                <>
                  {PR_KIT_SECTIONS.map(s => (
                    <div key={s.id} className="pr-kit">
                      <div className="pr-kit__head">
                        <span className="pr-kit__label">{s.label}</span>
                        <label className="pr-ack" style={{ font: "500 13px/1 Inter" }}>
                          <input type="checkbox" checked={!!kitApproved[s.id]} onChange={e => setKitApproved(k => ({ ...k, [s.id]: e.target.checked }))} />
                          Approved
                        </label>
                      </div>
                      <textarea rows={2} value={kit[s.id]} onChange={e => { setKit(k => ({ ...k, [s.id]: e.target.value })); setKitApproved(k => ({ ...k, [s.id]: false })); }} />
                    </div>
                  ))}
                  <div className="pr-kit">
                    <div className="pr-kit__head">
                      <span className="pr-kit__label">Quotable stats</span>
                      <label className="pr-ack" style={{ font: "500 13px/1 Inter" }}>
                        <input type="checkbox" checked={!!kitApproved.stats} onChange={e => setKitApproved(k => ({ ...k, stats: e.target.checked }))} />
                        Approved
                      </label>
                    </div>
                    <div className="pl-chiprow" style={{ marginTop: 4 }}>
                      {kit.quotableStats.map(s => <span key={s} className="pl-chip">{s}</span>)}
                    </div>
                  </div>
                  <div className="pr-kit">
                    <div className="pr-kit__head">
                      <span className="pr-kit__label">Approved photos</span>
                      <label className="pr-ack" style={{ font: "500 13px/1 Inter" }}>
                        <input type="checkbox" checked={!!kitApproved.photos} onChange={e => setKitApproved(k => ({ ...k, photos: e.target.checked }))} />
                        Approved
                      </label>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      {kit.photos.map(p => <img key={p} src={p} alt="" style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid var(--stone-200)" }} />)}
                    </div>
                  </div>
                  {!kitAllApproved && (
                    <div className="pr-tip"><Icon name="info" size={13} /> Approve every section to continue — reporters only ever see owner-approved material.</div>
                  )}
                </>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <div className="co-card__head">
                <h3 className="co-card__title">Reporters who'd cover this</h3>
                {reporters && <span className="co-card__meta">{pickedReporters.length} of {reporters.length} selected</span>}
              </div>
              {!reporters ? (
                <div className="pr-generating">
                  <Icon name="sparkles" size={22} className="pr-pulse" />
                  <div className="pr-generating__title">Scanning local and trade media…</div>
                  <div className="pr-generating__sub">Matching your angle to community, business, and profession beats.</div>
                </div>
              ) : reporters.map(r => {
                const on = pickedReporters.includes(r.id);
                return (
                  <div key={r.id} className={`pr-place pr-place--static ${on ? "is-selected" : ""}`}>
                    <button className="pr-place__check" style={{ cursor: "pointer" }} onClick={() => togglePicked(r.id)} aria-label="Select reporter"><Icon name="check" size={12} /></button>
                    <span className="pr-place__main">
                      <span className="pr-place__name">{r.name} <span className="pr-place__type">{r.outlet}</span></span>
                      <span className="pr-place__reason">{r.beat} — {r.relevanceReason}</span>
                      {openPitch === r.id ? (
                        <span style={{ display: "block", marginTop: 10 }}>
                          <textarea rows={4} style={{ width: "100%" }} value={r.pitchDraft} onChange={e => patchPitch(r.id, e.target.value)} />
                        </span>
                      ) : (
                        <span className="pr-place__meta" style={{ fontStyle: "italic" }}>“{r.pitchDraft.slice(0, 110)}…”</span>
                      )}
                    </span>
                    <span className="pr-place__side">
                      <button className="co-edit" onClick={() => setOpenPitch(openPitch === r.id ? null : r.id)}>
                        <Icon name="edit" size={13} /> {openPitch === r.id ? "Done" : "Edit pitch"}
                      </button>
                    </span>
                  </div>
                );
              })}
            </>
          )}

          {step === 5 && (
            <>
              <div className="co-card__head"><h3 className="co-card__title">Review & send</h3></div>
              <div className="co-deals" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                <div><div className="co-deal__label">Angle</div><div className="co-deal__value" style={{ fontSize: 14 }}>{angle ? angle.title : "—"}</div></div>
                <div><div className="co-deal__label">Press kit</div><div className="co-deal__value" style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="checkCircle" size={15} style={{ color: "var(--success-700)" }} /> Owner-approved</div></div>
                <div><div className="co-deal__label">Pitches</div><div className="co-deal__value">{pickedReporters.length} reporters</div></div>
              </div>
              <div style={{ borderTop: "1px solid var(--stone-100)", margin: "16px 0" }} />
              <div className="pr-accts">
                <button type="button" className={`mc-radio-card pr-acct ${sendMode === "concierge" ? "is-selected" : ""}`} onClick={() => setSendMode("concierge")}>
                  <span className="mc-radio-card__radio" />
                  <span style={{ flex: 1 }}>
                    <span className="mc-radio-card__title">VetVet sends the pitches <span className="co-badge co-badge--green" style={{ marginLeft: 6 }}>Recommended</span></span>
                    <span className="mc-radio-card__desc">Our outreach desk sends from a media-relations address, tracks opens, and nudges non-responders.</span>
                  </span>
                </button>
                <button type="button" className={`mc-radio-card pr-acct ${sendMode === "self" ? "is-selected" : ""}`} onClick={() => setSendMode("self")}>
                  <span className="mc-radio-card__radio" />
                  <span style={{ flex: 1 }}>
                    <span className="mc-radio-card__title">I'll send them myself</span>
                    <span className="mc-radio-card__desc">Export each personalized pitch to copy into your own email. You track replies in the same pipeline.</span>
                  </span>
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, font: "400 14px/1.5 Inter", color: "var(--stone-700)", marginTop: 16 }}>
                <Icon name="info" size={16} style={{ color: "var(--teal-brand)", flexShrink: 0, marginTop: 2 }} />
                Published stories link to your Trusted Share page, and every reply lands in the outreach pipeline with follow-up reminders.
              </div>
            </>
          )}
        </div>

        <div className="pr-wizard__footer">
          <button className="co-btn co-btn--ghost" onClick={back} disabled={sending}>{step === 1 ? "Cancel" : "Back"}</button>
          {step < 5
            ? <button className="co-btn co-btn--primary" onClick={() => setStep(s => s + 1)} disabled={!canContinue}>Continue <Icon name="chevronRight" size={14} /></button>
            : <button className="co-btn co-btn--primary" onClick={send} disabled={sending || pickedReporters.length === 0}>
                <Icon name="send" size={14} className={sending ? "pr-pulse" : ""} /> {sending ? "Sending…" : `Send ${pickedReporters.length} ${pickedReporters.length === 1 ? "pitch" : "pitches"}`}
              </button>}
        </div>
      </div>
    </>
  );
};

// ─── Section router ───────────────────────────────────────────────────────────
const PromoteView = ({ sub, tab, onToast, onManageListing }) => {
  const listing = useMyListing();
  if (listing.status !== "live") {
    return (
      <>
        <SubHeader crumbs={[PRACTICE.name, "Promotions"]} title="Promote Your Practice"
          subtitle="Put your listing in front of the right buyers — without revealing who you are until you choose to." />
        <div className="co-body"><PromoteLocked onManageListing={onManageListing} /></div>
      </>
    );
  }
  if (sub === "ads" && PROMO_META_ENABLED) return <AdWizard onToast={onToast} />;
  if (sub === "share" && PROMO_SHARE_ENABLED) return <ShareLinks onToast={onToast} />;
  if (sub === "featured" && PROMO_FEATURED_ENABLED) return <FeaturedFlow onToast={onToast} />;
  if (sub === "local-ads" && PROMO_LOCALPUBS_ENABLED) return <LocalAdsFlow onToast={onToast} />;
  if (sub === "pr" && PROMO_PR_ENABLED) return <PrView onToast={onToast} />;
  if (sub === "dvm-buyers" && PROMO_DVM_ENABLED) return <DvmBuyersView onToast={onToast} />;
  return <PromoteHub tab={tab} onToast={onToast} />;
};

Object.assign(window, { PromoteView, PromoShareCard });

})();
