// Promote Your Practice — seller self-promotion hub (spec v1.3).
//   /practice/promotions            → dashboard Overview (locked until the listing is live):
//                                     results, the Create Promotions cards, updates feed + share rail
//   /practice/promotions#<channel>  → one tab per channel (meta · dvm · featured · local · pr),
//                                     each listing that channel's promotions or an empty state
//   /practice/promotions/ads        → Meta buyer campaign builder
//                                     (Overview → Audience → Exclusions → Ad Creative →
//                                     Pay & Submit; a card is saved but not charged, CareOwner
//                                     reviews the request, then charges the flat rate and launches
//                                     from VetVet's ad account)
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

const audienceMeta = (id) => PROMO_AUDIENCES.find(a => a.id === id) || PROMO_AUDIENCES[0];
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
        : <div className="pr-camp__stats pr-camp__stats--hint"><span className="pr-camp__hint">{hint}</span></div>}
      <span className={`co-badge ${b.cls}`}>{b.label}</span>
      {action}
    </div>
  );
};

// Results dashboard. Without `channel` every channel contributes rows and KPI
// totals; with one (e.g. "meta_ads") it scopes to that channel so it can sit on
// a channel tab and only report that channel's numbers.
const RoiStrip = ({ promo, listing, onToast, channel }) => {
  const rows = [];
  const totals = { imp: 0, clk: 0, inq: 0 };
  const add = (m) => { if (m) { totals.imp += m.impressions || 0; totals.clk += m.clicks || 0; totals.inq += m.inquiries || 0; } };
  const wants = (c) => !channel || channel === c;

  if (wants("meta_ads")) promo.campaigns.forEach(c => {
    const m = c.status === "in_review" || c.status === "awaiting_payment" ? null : c.metrics;
    add(m);
    rows.push(
      <RoiRow key={c.id} icon="facebook" iconCls="pr-camp__icon--fb"
        name={`Meta buyer campaign — ${c.audiences.map(a => audienceMeta(a).label).join(" + ")}`}
        meta={`Submitted ${c.createdAt} · $${fmtInt(c.price)} flat rate · VetVet's ad account`}
        metrics={m}
        hint={c.status === "in_review"
          ? "In CareOwner review — your saved card is charged only after approval"
          : c.status === "awaiting_payment" ? "Approved — pay via the link in your email to launch" : "Metrics appear once your ads launch"}
        status={c.status} />
    );
  });

  const f = wants("featured") ? listing.featured : null;
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

  if (wants("local_pubs")) promo.placements.forEach(p => {
    const m = p.status === "live" || p.status === "completed" ? p.metrics : null;
    add(m);
    rows.push(
      <RoiRow key={p.id} icon="newspaper"
        name={`${p.outletName}`}
        meta={`${p.anonymityMode === "named" ? "Named ad" : "Semi-anonymous ad"} · ${p.fulfillment === "concierge" ? "Concierge placement" : "Self-submitted"} · ${p.format}`}
        metrics={m} hint={p.fulfillment === "concierge" ? "VetVet is placing this ad" : "Awaiting the outlet's run date"} status={p.status} />
    );
  });

  if (wants("pr") && promo.prCampaign) {
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

  // Share-link inquiries aren't attributable to one channel, so they only roll
  // into the unscoped (all-channel) view.
  const shareInquiries = channel ? 0 : promo.leads.length;
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
        <div className="pr-result"><div className="pr-result__num">{rows.length}</div><div className="pr-result__label">{channel ? (rows.length === 1 ? "Campaign" : "Campaigns") : "Channels running"}</div></div>
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
    name: `Meta buyer campaign — ${c.audiences.map(a => audienceMeta(a).label).join(" + ")}`,
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

        {/* Results live on the channel tab they belong to, scoped to that channel. */}
        {activeTab === "meta" && <RoiStrip promo={promo} listing={listing} onToast={onToast} channel="meta_ads" />}

        {/* DVM Buyers is a live directory of every specialist on the platform,
            not a list of past promotions — it renders the shared panel instead. */}
        {activeTab === "dvm" && <TaSpecialistsPanel onToast={onToast} />}
        {activeTab !== "overview" && activeTab !== "dvm" && <ChannelPanel tab={tabDef} rows={rows} onToast={onToast} />}

        {activeTab === "overview" && (
        <section className="pr-section">
          <div className="pr-section__cols">
            <div>
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
// A standalone overview page (no stepper — the flat price is shown up front)
// leads into a 4-step flow: Audience → Exclusions (the team list is excluded
// automatically; owners add other contacts) → Ad Creative (a tabbed one-ad-at-
// a-time editor with a live Meta placement preview) → Pay & Submit (save a
// card, authorize the future charge, submit). Nothing launches or is charged
// in-flow: the request goes to CareOwner's ads desk for manual review; once
// approved and ready, VetVet charges the saved card and launches from its Meta
// ad account. Progress — creative edits, exclusions, payment consents —
// autosaves to localStorage so a half-built campaign survives leaving the flow.
const AD_STEPS = ["Audience", "Exclusions", "Ad Creative", "Pay & Submit"];

// TODO(api): replace with a server-side draft on the campaign request.
const AD_DRAFT_KEY = "co.metaAdDraft";
const loadAdDraft = () => {
  try { return JSON.parse(localStorage.getItem(AD_DRAFT_KEY)) || null; } catch (e) { return null; }
};
// Drafts persisted before a schema addition (or with session-only bits
// stripped) get the newer per-field state filled in.
const normalizeAdVariant = (v) => ({
  included: true, edited: {}, changed: {}, history: [], hIdx: 0, pIdx: 0,
  originalImageUrl: v.imageUrl, ...v,
});

// Overview "How it works" — numbered walkthrough (Figma 275:7694). The 4th step
// restates the confidentiality guarantee so the overview stands on its own.
const AD_HOW_IT_WORKS = [
  { title: "Choose your buyer audiences",
    desc: "Reach veterinarians interested in becoming owners, existing practice owners looking to expand, or both. Each selected audience receives three tailored ad versions, each written to a different message angle." },
  { title: "Review and approve every ad",
    desc: "CareOwner drafts audience-specific copy for you. Edit every word, choose what practice details can be shared, and approve each ad before it is submitted." },
  { title: "We run and optimize your campaign",
    desc: "Ads run from our account with ad spend and management included. Meta optimizes delivery across eligible placements based on expected performance. We monitor the campaign and provide a performance report every 30 days." },
  { title: "Keep your opportunity confidential*",
    desc: "Your practice name and exact address remain hidden from public view. You can add contact exclusions to reduce delivery to employees or other specified contacts, and you decide which buyers receive identifying information." },
];

const LintWarning = ({ hits }) => hits.length === 0 ? null : (
  <div className="pr-lint">
    <Icon name="alertTriangle" size={14} />
    <span>Contains identifying details: {hits.map((h, i) => <b key={h}>{i > 0 && ", "}“{h}”</b>)}. Anonymous ads hide who you are — remove these before launch.</span>
  </div>
);

// ── Step 2 (Ad Creative) — tabbed one-ad-at-a-time editor with live previews ──
// Meta's recommended copy lengths. Soft guidance only: counters turn amber and
// a truncation note appears past these, but nothing blocks typing or submission.
const AD_H_REC = 40;
const AD_P_REC = 125;

const AD_PLACEMENTS = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "stories", label: "Stories/Reels" },
];

// What each "Generate another option" mode replaces — drives the Undo snapshot,
// the per-field "Regenerated" flags, and the confirm shown when a mode would
// overwrite something the seller typed or picked.
const AD_GEN_MODES = {
  headline: { fields: ["headline"], icon: "pencil", label: "New headline" },
  primary: { fields: ["primaryText"], icon: "fileText", label: "New primary text" },
  both: { fields: ["headline", "primaryText"], icon: "sparkles", label: "New headline and primary text" },
  angle: { fields: ["headline", "primaryText", "cta", "image"], icon: "refreshCw", label: "Try different angle" },
};
const AD_FIELD_NAMES = { headline: "headline", primaryText: "primary text", cta: "call-to-action", image: "image" };

const clipText = (s, n) => (s || "").length > n ? (s || "").slice(0, n).trimEnd() + "…" : (s || "");

const CharCount = ({ len, rec }) => (
  <span className={`pr-count ${len > rec ? "is-over" : ""}`}>{len} / {rec} recommended</span>
);

const FieldFlag = ({ v, field }) => (v.edited || {})[field]
  ? <span className="pr-flag pr-flag--edited">Edited</span>
  : (v.changed || {})[field]
    ? <span className="pr-flag pr-flag--gen">Regenerated</span>
    : null;

const TruncNote = ({ children }) => (
  <div className="pr-trunc"><Icon name="alertTriangle" size={12} /> {children}</div>
);

// Live approximation of how the ad renders per placement. Everything reads
// straight off the variant, so copy edits and image swaps show up immediately,
// and over-length copy is visibly clipped the way Meta would clip it. The
// advertiser is always VetVet — ads run from VetVet's Meta ad account.
const MetaAdPreview = ({ v, placement }) => {
  const truncated = (v.primaryText || "").length > AD_P_REC;
  const body = truncated ? clipText(v.primaryText, AD_P_REC) : v.primaryText;
  if (placement === "stories") {
    return (
      <div className="mp-story">
        <img className="mp-story__bg" src={v.imageUrl} alt="" />
        <div className="mp-story__top">
          <span className="mp-avatar">V</span>
          <span className="mp-story__name">VetVet <span>Sponsored</span></span>
        </div>
        <div className="mp-story__bottom">
          <div className="mp-story__headline">{clipText(v.headline, 64)}</div>
          <span className="mp-story__cta"><Icon name="chevronDown" size={13} style={{ transform: "rotate(180deg)" }} /> {v.cta}</span>
        </div>
      </div>
    );
  }
  if (placement === "instagram") {
    return (
      <div className="mp-card">
        <div className="mp-head">
          <span className="mp-avatar">V</span>
          <div className="mp-head__names"><b>vetvet</b><span>Sponsored</span></div>
          <Icon name="moreVertical" size={15} />
        </div>
        <div className="mp-media mp-media--sq"><img src={v.imageUrl} alt="" /></div>
        <span className="mp-igcta">{v.cta} <Icon name="chevronRight" size={13} /></span>
        <div className="mp-igcap"><b>vetvet</b> {body}{truncated && <span className="mp-more"> … more</span>}</div>
      </div>
    );
  }
  return (
    <div className="mp-card">
      <div className="mp-head">
        <span className="mp-avatar">V</span>
        <div className="mp-head__names"><b>VetVet</b><span>Sponsored · <Icon name="globe" size={10} /></span></div>
        <Icon name="moreVertical" size={15} />
      </div>
      <div className="mp-body">{body}{truncated && <span className="mp-more"> See more</span>}</div>
      <div className="mp-media"><img src={v.imageUrl} alt="" /></div>
      <div className="mp-linkbar">
        <div className="mp-linkbar__text">
          <span className="mp-domain">careowner.com</span>
          <span className="mp-headline">{v.headline}</span>
        </div>
        <span className="mp-cta">{v.cta}</span>
      </div>
    </div>
  );
};

// One audience's three-ad editor, one card per audience (Figma 298:14725):
// eyebrow + audience heading, angle tabs, then the selected ad's fields on the
// left and the bordered "Preview ad" panel on the right.
const AudienceAdSet = ({ aud, index, total, list, updateVariant, onToast }) => {
  const a = audienceMeta(aud);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [placement, setPlacement] = React.useState("facebook");
  const [genMenu, setGenMenu] = React.useState(false);
  const [imgMenu, setImgMenu] = React.useState(false);
  const [imgPanel, setImgPanel] = React.useState(null); // "picker" | "crops" | null
  const [pending, setPending] = React.useState(null);   // { mode, fields } — confirm before overwriting manual edits
  const [busy, setBusy] = React.useState(false);
  const [inclNote, setInclNote] = React.useState(false);
  const fileRef = React.useRef(null);

  const idx = Math.min(activeIdx, list.length - 1);
  const v = list[idx];
  if (!v) return null;
  const includedCount = list.filter(x => x.included).length;
  const edited = v.edited || {}, changed = v.changed || {};

  const selectAd = (i) => {
    setActiveIdx(i); setPending(null); setGenMenu(false); setImgMenu(false); setImgPanel(null); setInclNote(false);
  };

  // Manual edits: set the field's value, mark it edited, clear its regen flag.
  const patchField = (p, field) => updateVariant({
    ...v, ...p,
    edited: { ...edited, [field]: true },
    changed: { ...changed, [field]: false },
  });

  const applyGeneration = (mode) => {
    setPending(null); setBusy(true);
    const usedAngles = list.filter(x => x.id !== v.id).map(x => x.angleId);
    generateCreativeOption(v, mode, usedAngles).then(p => {
      const snapshot = {
        headline: v.headline, primaryText: v.primaryText, cta: v.cta,
        imageUrl: v.imageUrl, originalImageUrl: v.originalImageUrl,
        angleId: v.angleId, angleLabel: v.angleLabel, hIdx: v.hIdx, pIdx: v.pIdx,
        edited, changed,
      };
      const nextChanged = { ...changed }, nextEdited = { ...edited };
      AD_GEN_MODES[mode].fields.forEach(f => { nextChanged[f] = true; nextEdited[f] = false; });
      updateVariant({ ...v, ...p, edited: nextEdited, changed: nextChanged, history: [...(v.history || []), snapshot] });
      setBusy(false);
    });
  };

  // Generation never silently overwrites something the seller typed or picked.
  const requestGeneration = (mode) => {
    setGenMenu(false);
    const manual = AD_GEN_MODES[mode].fields.filter(f => edited[f]);
    if (manual.length) { setPending({ mode, fields: manual }); return; }
    applyGeneration(mode);
  };

  const undo = () => {
    const h = (v.history || [])[(v.history || []).length - 1];
    if (!h) return;
    updateVariant({ ...v, ...h, history: v.history.slice(0, -1) });
  };

  const toggleInclude = () => {
    if (v.included && includedCount <= 2) { setInclNote(true); return; }
    setInclNote(false);
    updateVariant({ ...v, included: !v.included });
  };

  const chooseImage = (url) => { patchField({ imageUrl: url }, "image"); setImgPanel(null); };
  const uploadImage = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    patchField({ imageUrl: URL.createObjectURL(f) }, "image");
    onToast("Image uploaded — CareOwner will confirm it meets Meta's ad standards");
    e.target.value = "";
  };
  const restoreImage = () => {
    setImgMenu(false); setImgPanel(null);
    updateVariant({ ...v, imageUrl: v.originalImageUrl, edited: { ...edited, image: false }, changed: { ...changed, image: false } });
  };

  const ctas = PROMO_CTA_OPTIONS.includes(v.cta) ? PROMO_CTA_OPTIONS : [v.cta, ...PROMO_CTA_OPTIONS];
  const hLen = (v.headline || "").length, pLen = (v.primaryText || "").length;

  return (
    <section className="pr-adset">
      <div className="pr-adset__eyebrow">Audience {index + 1} of {total}</div>
      <div className="pr-adset__toprow">
        <h3 className="pr-adset__title">{a.label}</h3>
        <span className="pr-adset__count">{includedCount} of {list.length} ads included</span>
      </div>

      <div className="pr-adtabs">
        <div className="pr-adtabs__tabs" role="tablist">
          {list.map((x, i) => (
            <button key={x.id} type="button" role="tab" aria-selected={i === idx}
              className={`pr-adtab ${i === idx ? "is-active" : ""} ${x.included ? "" : "is-off"}`}
              onClick={() => selectAd(i)}>
              <span className="pr-adtab__num">Ad {i + 1}</span>
              {x.angleLabel}
              {!x.included && <span className="pr-adtab__off">Excluded</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="pr-studio">
        <div className={`pr-studio__edit ${busy ? "is-busy" : ""}`}>
          <div className="pr-studio__head">
            <span className="pr-studio__pos">Ad {idx + 1} of {list.length}</span>
            <label className="pr-incl">
              <button type="button" className={`co-switch ${v.included ? "is-on" : ""}`} onClick={toggleInclude}
                aria-pressed={v.included} aria-label="Include this ad in the campaign" />
              Include
            </label>
          </div>
          {inclNote && (
            <div className="pr-inclnote">
              <Icon name="alertTriangle" size={14} />
              <div>At least two ads must stay included — Meta tests your ad versions against each other to learn which resonates with buyers.</div>
            </div>
          )}
          {!v.included && (
            <div className="pr-offnote">
              <Icon name="eyeOff" size={14} /> This ad is excluded and won't be part of the campaign.
            </div>
          )}

          <div className="co-field">
            <label className="pr-fieldlabel">Headline <FieldFlag v={v} field="headline" /> <CharCount len={hLen} rec={AD_H_REC} /></label>
            <input value={v.headline} onChange={e => patchField({ headline: e.target.value }, "headline")} />
            {hLen > AD_H_REC && <TruncNote>Longer headlines may be truncated in some placements.</TruncNote>}
          </div>
          <div className="co-field">
            <label className="pr-fieldlabel">Primary text <FieldFlag v={v} field="primaryText" /> <CharCount len={pLen} rec={AD_P_REC} /></label>
            <textarea rows={4} value={v.primaryText} onChange={e => patchField({ primaryText: e.target.value }, "primaryText")} />
            {pLen > AD_P_REC && <TruncNote>Text past ~125 characters may be hidden behind “See more” in some placements.</TruncNote>}
          </div>
          <div className="co-field">
            <label className="pr-fieldlabel">Call-to-action button <FieldFlag v={v} field="cta" /></label>
            <select value={v.cta} onChange={e => patchField({ cta: e.target.value }, "cta")}>
              {ctas.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <LintWarning hits={lintAnonymity(v.headline + " " + v.primaryText)} />

          <div className="pr-genrow">
            <div className="mk-menu-anchor">
              <button className="co-btn co-btn--ghost" disabled={busy} onClick={() => setGenMenu(o => !o)}>
                <Icon name="sparkles" size={14} className={busy ? "pr-pulse" : ""} /> {busy ? "Generating…" : "Generate another option"} <Icon name="chevronDown" size={13} />
              </button>
              {genMenu && (
                <>
                  <div className="pr-menu-backdrop" onClick={() => setGenMenu(false)} />
                  <div className="mk-menu pr-genmenu">
                    {Object.entries(AD_GEN_MODES).map(([mode, m]) => (
                      <React.Fragment key={mode}>
                        {mode === "angle" && <div className="mk-menu__sep" />}
                        <button className="mk-menu__item" onClick={() => requestGeneration(mode)}>
                          <Icon name={m.icon} size={14} /> {m.label}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </>
              )}
            </div>
            {(v.history || []).length > 0 && (
              <button className="co-edit" disabled={busy} title="Restore the previous version" onClick={undo}>
                <Icon name="refreshCw" size={13} style={{ transform: "scaleX(-1)" }} /> Undo
              </button>
            )}
          </div>
          {pending && (
            <div className="pr-genconfirm">
              <Icon name="alertTriangle" size={14} />
              <span className="pr-genconfirm__msg">
                Generating will replace your edited {pending.fields.length > 2 ? "content" : pending.fields.map(f => AD_FIELD_NAMES[f]).join(" and ")}. You can undo afterward.
              </span>
              <span className="pr-genconfirm__btns">
                <button className="co-btn co-btn--ghost" onClick={() => setPending(null)}>Keep my edits</button>
                <button className="co-btn co-btn--primary" onClick={() => applyGeneration(pending.mode)}>Replace</button>
              </span>
            </div>
          )}

          <div className="pr-imgblock">
            <div className="pr-imgblock__label">Image <FieldFlag v={v} field="image" /></div>
            <div className="pr-imgrow">
              <div className="pr-imgthumb"><img src={v.imageUrl} alt="Selected ad image" /></div>
              <div className="pr-imgmeta">
                <div className="mk-menu-anchor">
                  <button className="co-btn co-btn--ghost" onClick={() => setImgMenu(o => !o)}>
                    <Icon name="image" size={14} /> Replace <Icon name="chevronDown" size={13} />
                  </button>
                  {imgMenu && (
                    <>
                      <div className="pr-menu-backdrop" onClick={() => setImgMenu(false)} />
                      <div className="mk-menu pr-genmenu">
                        <button className="mk-menu__item" onClick={() => { setImgMenu(false); setImgPanel("picker"); }}>
                          <Icon name="image" size={14} /> Choose another CareOwner image
                        </button>
                        <button className="mk-menu__item" onClick={() => { setImgMenu(false); fileRef.current && fileRef.current.click(); }}>
                          <Icon name="upload" size={14} /> Upload an approved image
                        </button>
                        <button className="mk-menu__item" disabled={v.imageUrl === v.originalImageUrl} onClick={restoreImage}>
                          <Icon name="refreshCw" size={14} style={{ transform: "scaleX(-1)" }} /> Restore the original image
                        </button>
                        <div className="mk-menu__sep" />
                        <button className="mk-menu__item" onClick={() => { setImgMenu(false); setImgPanel(p => p === "crops" ? null : "crops"); }}>
                          <Icon name="eye" size={14} /> Preview placement-specific crops
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <p>Used across every placement — Meta crops it automatically per format.</p>
              </div>
            </div>
            {imgPanel === "picker" && (
              <div className="pr-imgpick">
                {LISTING_IMAGE_LIBRARY.map(url => (
                  <button key={url} type="button" className={url === v.imageUrl ? "is-selected" : ""} title="Use this image" onClick={() => chooseImage(url)}>
                    <img src={url} alt="" />
                  </button>
                ))}
              </div>
            )}
            {imgPanel === "crops" && (
              <div className="pr-crops">
                <div className="pr-crop"><div className="pr-crop__box" style={{ width: 153, height: 80 }}><img src={v.imageUrl} alt="" /></div><span>Feed · 1.91:1</span></div>
                <div className="pr-crop"><div className="pr-crop__box" style={{ width: 96, height: 96 }}><img src={v.imageUrl} alt="" /></div><span>Square · 1:1</span></div>
                <div className="pr-crop"><div className="pr-crop__box" style={{ width: 54, height: 96 }}><img src={v.imageUrl} alt="" /></div><span>Stories · 9:16</span></div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={uploadImage} />
          </div>
        </div>

        <div className="pr-studio__preview">
          <div className="pr-mp__eyebrow">Preview ad</div>
          <div className="pr-mp">
            <div className="pr-mp__tabs">
              {AD_PLACEMENTS.map(p => (
                <button key={p.id} type="button" className={placement === p.id ? "is-active" : ""} onClick={() => setPlacement(p.id)}>{p.label}</button>
              ))}
            </div>
            <MetaAdPreview v={v} placement={placement} />
            <p className="pr-mp__note">Approximate rendering — exact layout varies by device and placement.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Step 2 (Exclusions) — automatic team exclusions + optional extra contacts ──
// The team list is always excluded (no opt-out here; the Team section owns it).
// Owners can add individual contacts or upload a CSV; uploads require an
// explicit authorization consent before the contacts are added.
const exclCounts = (excl) => {
  const teamExcluded = AD_TEAM_EXCLUSIONS.filter(t => t.contact).length;
  const additional = excl.contacts.length + (excl.upload ? excl.upload.ready : 0);
  return {
    teamExcluded,
    teamMissing: AD_TEAM_EXCLUSIONS.length - teamExcluded,
    additional,
    dupesRemoved: excl.upload ? excl.upload.dupes + excl.upload.teamDupes : 0,
    totalUnique: teamExcluded + additional,
  };
};

// One-line label for the Pay & Submit campaign summary (exclusions brief §11).
const exclSummaryLine = (excl) => {
  const c = exclCounts(excl);
  return c.additional === 0
    ? `${c.teamExcluded} team members automatically included · No additional contacts`
    : `Team members: ${c.teamExcluded} automatically included`;
};

const EXCL_CSV_TEMPLATE = "data:text/csv;charset=utf-8," + encodeURIComponent(
  "First name,Last name,Email,Phone,City,State,Postal code,Country,Notes\nJane,Smith,jane@example.com,555-010-0198,Lakeside,IL,60614,US,Former associate\n");

const ExclusionsStep = ({ excl, setExcl, onToast }) => {
  const [teamOpen, setTeamOpen] = React.useState(false);
  const [modal, setModal] = React.useState(null); // null | "contact" | "upload"
  const [contact, setContact] = React.useState({ first: "", last: "", email: "", phone: "" });
  const [contactErr, setContactErr] = React.useState(false);
  const [upStage, setUpStage] = React.useState("pick"); // "pick" | "processing" | "summary"
  const [upResult, setUpResult] = React.useState(null);
  const [upErr, setUpErr] = React.useState(null);
  const [consent, setConsent] = React.useState(false);
  const fileRef = React.useRef(null);
  const c = exclCounts(excl);

  const closeModal = () => {
    setModal(null); setContactErr(false); setUpStage("pick"); setUpResult(null); setUpErr(null); setConsent(false);
    setContact({ first: "", last: "", email: "", phone: "" });
  };

  const addContact = () => {
    if (!contact.email.trim() && !contact.phone.trim()) { setContactErr(true); return; }
    const email = contact.email.trim().toLowerCase();
    const phone = contact.phone.replace(/\D/g, "");
    const dup = excl.contacts.some(x => (email && x.email === email) || (phone && x.phone === phone));
    if (dup) { onToast("That contact is already in your exclusions"); closeModal(); return; }
    setExcl(e => ({ ...e, contacts: [...e.contacts, {
      id: "xc_" + Math.random().toString(36).slice(2, 8),
      name: `${contact.first.trim()} ${contact.last.trim()}`.trim() || "Unnamed contact",
      email, phone, display: email || contact.phone.trim(),
    }] }));
    onToast("Contact added to your exclusion list");
    closeModal();
  };

  const pickFile = (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    if (!/\.csv$/i.test(f.name)) { setUpErr("That file isn't a CSV — export your list as .csv and try again."); return; }
    if (f.size > 10 * 1024 * 1024) { setUpErr("That file is over the 10 MB limit — split the list and upload it in parts."); return; }
    setUpErr(null); setUpStage("processing");
    mockExclusionsService.processCsv(f.name).then(r => { setUpResult(r); setUpStage("summary"); });
  };

  const addUpload = () => {
    // TODO(api): persist the consent record server-side alongside the list.
    setExcl(e => ({ ...e, upload: { ...upResult, consent: {
      userId: "u_maya-hollis", campaignId: "draft", at: Date.now(), version: "2026-08-exclusions-v1",
      filename: upResult.filename,
    } } }));
    onToast(`${fmtInt(upResult.ready)} contacts added to your exclusion list`);
    closeModal();
  };

  const openTeamTab = () => window.open((window.__APP_BASE__ || "") + "/practice/team", "_blank", "noopener");

  return (
    <>
      <div className="pr-excl">
        <div className="pr-excl__main">
          <div className="co-card">
            <div className="co-card__head">
              <h3 className="co-card__title">Your team members
                <span className="co-badge co-badge--blue" style={{ marginLeft: 10 }}>Automatic</span>
                <span className="co-badge co-badge--green" style={{ marginLeft: 6 }}>Recommended</span>
              </h3>
            </div>
            <p className="pr-excl__sub">Everyone listed in your CareOwner team will automatically be added to the campaign's exclusion list. You do not need to upload them again.</p>
            <div className="pr-excl__count"><Icon name="users" size={15} /> <b>{c.teamExcluded}</b>&nbsp;team members will be excluded</div>
            <button className="co-edit" onClick={() => setTeamOpen(o => !o)}>
              {teamOpen ? "Hide team members" : "View team members"}
              <Icon name="chevronDown" size={13} style={teamOpen ? { transform: "rotate(180deg)" } : undefined} />
            </button>
            {teamOpen && (
              <table className="co-table pr-excl__table">
                <thead><tr><th>Name</th><th>Contact information</th><th>Status</th></tr></thead>
                <tbody>
                  {AD_TEAM_EXCLUSIONS.map(t => {
                    const s = AD_TEAM_STATUS[t.status];
                    return (
                      <tr key={t.name}>
                        <td><div className="co-table__name">{t.name}{t.owner ? " (you)" : ""}</div></td>
                        <td style={{ color: "var(--stone-500)" }}>{t.contact || "No email or phone"}</td>
                        <td><span className={`co-badge ${s.cls} pr-badge`}>{s.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {c.teamMissing > 0 && (
              <div className="pr-warn" style={{ marginTop: 14 }}>
                <Icon name="alertTriangle" size={16} />
                <div><b>Some team members may not be excluded.</b> Meta needs an email address or phone number to match a contact. Update the missing information in your Team section to improve exclusion coverage.</div>
              </div>
            )}
            <div className="pr-excl__foot">
              <button className="co-btn co-btn--ghost" onClick={openTeamTab}><Icon name="externalLink" size={13} /> Manage team members</button>
              <span className="pr-excl__note">Team members can't be removed here — the Team section owns this list.</span>
            </div>
          </div>

          <div className="co-card">
            <div className="co-card__head">
              <h3 className="co-card__title">Additional contacts
                <span className="co-badge co-badge--gray" style={{ marginLeft: 10 }}>Optional</span>
              </h3>
            </div>
            <p className="pr-excl__sub">Add other people you do not want receiving your ads, such as specific buyers, advisors, former employees, or other known contacts.</p>
            {excl.contacts.length === 0 && !excl.upload
              ? <p className="pr-excl__empty">No additional contacts added.</p>
              : (
                <div className="pr-excl__list">
                  {excl.upload && (
                    <div className="pr-excl__item">
                      <Icon name="fileText" size={15} />
                      <span className="pr-excl__itemname">{excl.upload.filename}</span>
                      <span className="pr-excl__itemmeta">{fmtInt(excl.upload.ready)} contacts</span>
                      <button className="co-edit" title="Remove this list" onClick={() => { setExcl(e => ({ ...e, upload: null })); onToast("Uploaded list removed"); }}><Icon name="x" size={13} /></button>
                    </div>
                  )}
                  {excl.contacts.map(x => (
                    <div key={x.id} className="pr-excl__item">
                      <Icon name="user" size={15} />
                      <span className="pr-excl__itemname">{x.name}</span>
                      <span className="pr-excl__itemmeta">{x.display}</span>
                      <button className="co-edit" title="Remove this contact" onClick={() => setExcl(e => ({ ...e, contacts: e.contacts.filter(y => y.id !== x.id) }))}><Icon name="x" size={13} /></button>
                    </div>
                  ))}
                </div>
              )}
            <div className="pr-excl__foot">
              <button className="co-btn co-btn--ghost" onClick={() => setModal("upload")}><Icon name="upload" size={14} /> Upload contact list</button>
              <button className="co-btn co-btn--ghost" onClick={() => setModal("contact")}><Icon name="plus" size={14} /> Add a contact</button>
            </div>
          </div>
        </div>

        <aside className="pr-excl__aside">
          <div className="co-card">
            <div className="co-card__head"><h3 className="co-card__title">Campaign exclusions</h3></div>
            <div className="pr-paysum">
              <div className="pr-paysum__row"><span>CareOwner team list</span><span>{c.teamExcluded}</span></div>
              <div className="pr-paysum__row"><span>Additional contacts</span><span>{fmtInt(c.additional)}</span></div>
              {c.dupesRemoved > 0 && <div className="pr-paysum__row"><span>Duplicates removed</span><span>{c.dupesRemoved}</span></div>}
              <div className="pr-paysum__row pr-paysum__row--total"><span>Total unique contacts</span><span>{fmtInt(c.totalUnique)}</span></div>
            </div>
            <p className="pr-paysum__note">VetVet will use these contacts to create an exclusion audience when your campaign is approved and prepared for launch. Meta's eventual match rate may be lower.</p>
          </div>
          <div className="co-card">
            <div className="co-card__head"><h3 className="co-card__title"><Icon name="info" />How exclusions work</h3></div>
            <p className="pr-excl__sub" style={{ margin: 0 }}>VetVet securely provides the approved contact identifiers to Meta so it can attempt to match and exclude those people. Someone may still encounter the ad if Meta cannot match their information, they use different contact details, or the ad is shared with them.</p>
          </div>
        </aside>
      </div>

      {modal === "contact" && (
        <>
          <div className="pr-modal-backdrop" onClick={closeModal} />
          <div className="pr-modal" role="dialog" aria-label="Add a contact">
            <div className="pr-modal__head">
              <h3>Add a contact</h3>
              <button className="co-edit" onClick={closeModal} aria-label="Close"><Icon name="x" size={15} /></button>
            </div>
            <div className="pr-modal__body">
              <div className="pr-payform__row pr-payform__row--2">
                <div className="co-field"><label>First name</label>
                  <input value={contact.first} onChange={e => setContact(x => ({ ...x, first: e.target.value }))} />
                </div>
                <div className="co-field"><label>Last name</label>
                  <input value={contact.last} onChange={e => setContact(x => ({ ...x, last: e.target.value }))} />
                </div>
              </div>
              <div className="co-field"><label>Email address</label>
                <input type="email" value={contact.email} className={contactErr ? "is-invalid" : ""} onChange={e => setContact(x => ({ ...x, email: e.target.value }))} />
              </div>
              <div className="co-field"><label>Phone number</label>
                <input inputMode="tel" value={contact.phone} className={contactErr ? "is-invalid" : ""} onChange={e => setContact(x => ({ ...x, phone: e.target.value }))} />
              </div>
              {contactErr
                ? <p className="pr-payform__err">Provide at least an email address or phone number — Meta needs one to match the contact.</p>
                : <p className="pr-excl__note" style={{ margin: 0 }}>Provide at least an email address or phone number.</p>}
            </div>
            <div className="pr-modal__foot">
              <button className="co-btn co-btn--ghost" onClick={closeModal}>Cancel</button>
              <button className="co-btn co-btn--primary" onClick={addContact}>Add to exclusions</button>
            </div>
          </div>
        </>
      )}

      {modal === "upload" && (
        <>
          <div className="pr-modal-backdrop" onClick={closeModal} />
          <div className="pr-modal pr-modal--wide" role="dialog" aria-label="Upload contact list">
            <div className="pr-modal__head">
              <h3>Upload contact list</h3>
              <button className="co-edit" onClick={closeModal} aria-label="Close"><Icon name="x" size={15} /></button>
            </div>
            <div className="pr-modal__body">
              {upStage === "pick" && (
                <>
                  <p className="pr-excl__sub" style={{ marginTop: 0 }}>Upload a CSV containing the people you want excluded. Each contact must include an email address, phone number, or both.</p>
                  <button type="button" className="pr-dropzone" onClick={() => fileRef.current && fileRef.current.click()}>
                    <Icon name="upload" size={20} />
                    <span><b>Drag and drop your CSV here</b>, or browse files</span>
                    <span className="pr-excl__note">CSV only · up to 10 MB · up to 50,000 records</span>
                  </button>
                  {upErr && <p className="pr-payform__err" style={{ margin: "10px 0 0" }}>{upErr}</p>}
                  <div className="pr-excl__links">
                    <a className="pr-link" href={EXCL_CSV_TEMPLATE} download="careowner-exclusions-template.csv">Download CSV template</a>
                    <span>·</span>
                    <button className="pr-link" onClick={() => onToast("Formatting guide opened (mock) — supported columns: name, email, phone, city, state, postal code, country, notes")}>Formatting instructions</button>
                  </div>
                  <input ref={fileRef} type="file" accept=".csv,text/csv" style={{ display: "none" }} onChange={pickFile} />
                </>
              )}
              {upStage === "processing" && (
                <div className="pr-generating" style={{ padding: "36px 0" }}>
                  <Icon name="sparkles" size={20} className="pr-pulse" />
                  <div className="pr-generating__title">Processing your list…</div>
                  <div className="pr-generating__sub">Normalizing contacts, removing duplicates, and checking for matchable identifiers.</div>
                </div>
              )}
              {upStage === "summary" && upResult && (
                <>
                  <div className="pr-upsum__lead"><Icon name="checkCircle" size={16} /> <b>{fmtInt(upResult.ready)}</b>&nbsp;contacts ready to add</div>
                  <ul className="pr-upsum__list">
                    <li>{upResult.dupes} duplicates removed</li>
                    <li>{upResult.teamDupes} already included in your team list</li>
                    <li>{upResult.invalid} rows missing an email address or phone number</li>
                  </ul>
                  <div className="pr-excl__links">
                    <button className="pr-link" onClick={() => onToast(`Invalid rows opened (mock) — ${upResult.invalid} rows have no matchable contact information`)}>Review invalid rows</button>
                    <span>·</span>
                    <button className="pr-link" onClick={() => onToast("Error report downloaded (mock)")}>Download error report</button>
                    <span>·</span>
                    <button className="pr-link" onClick={() => { setUpStage("pick"); setUpResult(null); setConsent(false); }}>Replace file</button>
                  </div>
                  <label className="pr-ack pr-ack--top" style={{ marginTop: 14 }}>
                    <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
                    <span>I confirm that I am authorized to provide and use this contact information for advertising exclusions.</span>
                  </label>
                  <p className="pr-excl__note" style={{ margin: "6px 0 0 26px" }}>Contact information will be used to help Meta identify people who should not receive this campaign.</p>
                </>
              )}
            </div>
            {upStage === "summary" && (
              <div className="pr-modal__foot">
                <button className="co-btn co-btn--ghost" onClick={closeModal}>Cancel</button>
                <button className="co-btn co-btn--primary" disabled={!consent} onClick={addUpload}>Add valid contacts</button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

const AdWizard = ({ onToast }) => {
  const listing = useMyListing();
  const draft = React.useMemo(loadAdDraft, []);
  const [started, setStarted] = React.useState(false); // false = overview page, true = 4-step flow
  const [step, setStep] = React.useState(draft ? draft.step : 1); // 1 Audience · 2 Exclusions · 3 Ad Creative · 4 Pay & Submit
  const [audiences, setAudiences] = React.useState(draft && draft.audiences.length ? draft.audiences : ["aspiring"]);
  const hasDraftCreative = !!(draft && draft.variants && draft.variants.length && draft.audKey);
  const [variants, setVariants] = React.useState(hasDraftCreative ? draft.variants.map(normalizeAdVariant) : null);
  const [generatedFor, setGeneratedFor] = React.useState(hasDraftCreative ? draft.audKey : "");
  const [generating, setGenerating] = React.useState(false);
  const [saveState, setSaveState] = React.useState("saved"); // autosave indicator: "saving" | "saved"
  const [submitting, setSubmitting] = React.useState(false);
  const plan = META_AD_PLAN;

  // ── Pay & Submit state ──
  // Submitting saves a card without charging it — VetVet charges plan.price
  // only after approval, and renewals only with separate consent. Card form
  // fields are session-only; the draft keeps just the selection + consents.
  const [payMethods, setPayMethods] = React.useState(SAVED_PAYMENT_METHODS);
  const [paySelected, setPaySelected] = React.useState(
    draft && draft.pay ? draft.pay.selected : (SAVED_PAYMENT_METHODS[0] ? SAVED_PAYMENT_METHODS[0].id : null));
  const [renewal, setRenewal] = React.useState(draft && draft.pay ? draft.pay.renewal || "end" : "end"); // "end" | "auto"
  const [authCharge, setAuthCharge] = React.useState(draft && draft.pay ? !!draft.pay.authCharge : false);
  const [authRenew, setAuthRenew] = React.useState(draft && draft.pay ? !!draft.pay.authRenew : false);
  const [payFormOpen, setPayFormOpen] = React.useState(false);
  const [card, setCard] = React.useState({ name: "", number: "", exp: "", cvc: "", zip: "" });
  const [cardError, setCardError] = React.useState(false);
  const [savingCard, setSavingCard] = React.useState(false);

  const audKey = audiences.slice().sort().join(",");
  // At least one audience must stay selected — the campaign can't run without one.
  const toggleAudience = (id) => {
    if (!audiences.includes(id)) { setAudiences(a => [...a, id]); return; }
    if (audiences.length === 1) { onToast("Keep at least one audience selected"); return; }
    setAudiences(a => a.filter(x => x !== id));
  };

  // ── Exclusions state (step 2) — see ExclusionsStep. Team list is implicit. ──
  const [excl, setExcl] = React.useState(draft && draft.excl ? draft.excl : { contacts: [], upload: null });

  // Draft creative whenever the Ad Creative step is entered with a changed audience mix.
  React.useEffect(() => {
    if (!started || step !== 3 || generating || (variants && generatedFor === audKey)) return;
    setGenerating(true);
    generateCreative(listing, audiences).then(vs => {
      setVariants(vs); setGeneratedFor(audKey); setGenerating(false);
    });
  }, [started, step, audKey]);

  const updateVariant = (nv) => setVariants(vs => vs.map(v => v.id === nv.id ? nv : v));

  const lintHits = (variants || []).filter(v => v.included && lintAnonymity(v.headline + " " + v.primaryText).length > 0).length;
  const variantCount = (variants || []).length;

  // Per-audience creative breakdown for the Campaign summary card.
  const audRows = audiences.map(a => {
    const list = (variants || []).filter(v => v.audience === a);
    return {
      aud: a, label: audienceMeta(a).label, total: list.length,
      inc: list.filter(v => v.included).length,
      ed: list.filter(v => v.edited && Object.values(v.edited).some(Boolean)).length,
    };
  });

  const payMethod = payMethods.find(m => m.id === paySelected) || null;
  const saveCard = () => {
    const digits = card.number.replace(/\D/g, "");
    if (!card.name.trim() || digits.length < 12 || !card.exp.trim() || !card.cvc.trim() || !card.zip.trim()) { setCardError(true); return; }
    setCardError(false); setSavingCard(true);
    mockPaymentService.saveMethod(card).then(m => {
      setPayMethods(ms => [...ms, m]);
      setPaySelected(m.id);
      setPayFormOpen(false);
      setCard({ name: "", number: "", exp: "", cvc: "", zip: "" });
      setSavingCard(false);
      onToast("Payment method saved — nothing is charged today");
    });
  };

  // Submission gate: a saved payment method plus explicit authorizations.
  // Listed requirements double as the inline "what's missing" hint.
  const submitReqs = [
    !payMethod && "select or add a payment method",
    !authCharge && `confirm the $${fmtInt(plan.price)} charge authorization`,
    renewal === "auto" && !authRenew && "confirm the renewal authorization",
    !variants && "finish generating your ad creative",
  ].filter(Boolean);
  const canSubmit = submitReqs.length === 0;
  const landingPath = "/l/" + listing.id;
  const openLanding = () => window.open(promoShareUrl(landingPath), "_blank", "noopener");

  const canContinue =
    step === 1 ? audiences.length > 0 :
    step === 3 ? !!variants && !generating : true; // exclusions (step 2) never block — they're optional

  const back = () => step === 1 ? setStarted(false) : setStep(s => s - 1);
  const next = () => setStep(s => Math.min(4, s + 1));

  // Persist progress — including every creative edit — so leaving the flow (or
  // the app) doesn't lose it. Undo history is session-only, and locally
  // uploaded images (blob: URLs) can't survive a reload, so both are stripped.
  const writeDraft = () => {
    try {
      localStorage.setItem(AD_DRAFT_KEY, JSON.stringify({
        step, audiences, audKey: generatedFor, savedAt: Date.now(),
        variants: variants && variants.map(v => ({
          ...v, history: [],
          imageUrl: /^blob:/.test(v.imageUrl) ? v.originalImageUrl : v.imageUrl,
        })),
        // Exclusions: team snapshot is derived from data; contacts, uploads,
        // and their consent records persist here.
        excl,
        // Payment: selection + consents only — raw card fields are never stored.
        pay: { selected: paySelected, renewal, authCharge, authRenew },
      }));
    } catch (e) {}
  };
  // Every edit autosaves (debounced) once the flow has started.
  React.useEffect(() => {
    if (!started) return;
    setSaveState("saving");
    const t = setTimeout(() => { writeDraft(); setSaveState("saved"); }, 600);
    return () => clearTimeout(t);
  }, [started, step, audKey, variants, excl, paySelected, renewal, authCharge, authRenew]);

  const saveDraft = () => { writeDraft(); onToast("Draft saved"); };
  // Header action: stash progress and return to the Promotions dashboard.
  const saveAndExit = () => { saveDraft(); navigateTo("/practice/promotions"); };
  const clearDraft = () => { try { localStorage.removeItem(AD_DRAFT_KEY); } catch (e) {} };

  // Submit the request to CareOwner's ads desk — nothing launches, and the
  // saved card is only charged after the campaign is approved and ready.
  const submitRequest = () => {
    setSubmitting(true);
    mockAdService.submitRequest({}).then(({ campaignId }) => {
      const kept = variants.map(v => ({ ...v, history: [] }));
      const campaign = {
        id: campaignId, listingId: listing.id, audiences: audiences.slice(),
        variants: kept, anonymityMode: "anonymous",
        price: plan.price, durationDays: plan.days,
        renewal,
        paymentMethod: payMethod ? { brand: payMethod.brand, last4: payMethod.last4 } : null,
        status: "in_review",
        landingUrl: landingPath + "?src=meta",
        metrics: null,
        createdAt: todayLabel(),
      };
      kept.filter(v => v.included).forEach(v => saveAsset({ kind: "creative", channel: "meta_ads", label: v.headline, data: v }));
      updatePromo({ campaigns: [campaign, ...PROMO.campaigns] });
      clearDraft();
      navigateTo("/practice/promotions#meta");
      onToast("Campaign submitted for review — your card is only charged after approval");
    });
  };

  const subtitle = "We create and manage confidential ads that promote your opportunity without naming your practice.";

  // ── Overview (pre-flow) — no stepper; the flat price is shown up front ──
  if (!started) {
    const startLabel = draft ? "Resume Draft" : "Get Started";
    const startBtn = (
      <button className="co-btn co-btn--primary" onClick={() => setStarted(true)}>
        {startLabel} <Icon name="chevronRight" size={14} />
      </button>
    );
    return (
      <>
        <SubHeader
          title="Create a Meta buyer campaign"
          subtitle={subtitle}
          backAction={<button className="co-btn-back" onClick={() => navigateTo("/practice/promotions")}><Icon name="chevronRight" style={{ transform: "rotate(180deg)" }} /> Cancel</button>}
        />
        <div className="co-body">
          <div className="pr-start">
            <span className="pr-start__icon"><Icon name="sparkles" size={16} /></span>
            <div className="pr-start__q">{draft ? "Pick up your buyer ad campaign where you left off" : "Start setting up your buyer ad campaign"}</div>
            {startBtn}
          </div>

          <div className="pr-adov">
            <div className="co-card pr-adov__main">
              <div className="pr-adov__intro">
                <div className="pr-adov__introtext">
                  <div className="pr-adov__eyebrow">How it works</div>
                  <h3 className="pr-adov__title">Reach more qualified buyers with a managed Meta campaign</h3>
                  <p className="pr-adov__lede">CareOwner creates, launches, and manages a confidential 30-day campaign that sends interested buyers to your CareOwner teaser page.</p>
                </div>
                <img className="pr-adov__mock" src={assetUrl("assets/careowner-ads-mockup.png")} alt="Example Facebook and Instagram ads for an anonymous practice listing" />
              </div>
              <div className="pr-adov__grid">
                {AD_HOW_IT_WORKS.map((s, i) => (
                  <div key={s.title} className="pr-adov__item">
                    <span className="pr-adov__num">{i + 1}</span>
                    <div>
                      <h4>{s.title}</h4>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="pr-adov__fine">*Contact exclusions depend on Meta's ability to match the information provided and cannot guarantee that specified contacts will never encounter an ad.</p>
            </div>

            <aside className="co-card pr-price">
              <div className="pr-adov__eyebrow">Pricing</div>
              <div className="pr-price__row">
                <span className="pr-price__amt">${fmtInt(plan.price)}</span>
                <span className="pr-price__per">first {plan.days} days</span>
              </div>
              <p className="pr-price__sub">Includes a ${fmtInt(plan.setup)} one-time campaign setup. Continue for ${fmtInt(plan.renew)} per additional {plan.days} days.</p>
              <ul className="pr-tier__list">
                {plan.benefits.map(b => <li key={b}><Icon name="check" size={12} /> {b}</li>)}
              </ul>
              <p className="pr-adov__fine" style={{ marginTop: 12 }}>Delivery varies by audience size, geography, and Meta's advertising auction.</p>
            </aside>
          </div>

          <div className="pr-wizard__footer pr-wizard__footer--end">{startBtn}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <SubHeader
        title="Create a Meta buyer campaign"
        subtitle={subtitle}
        backAction={<button className="co-btn-back" onClick={() => navigateTo("/practice/promotions")}><Icon name="chevronRight" style={{ transform: "rotate(180deg)" }} /> Cancel</button>}
        actions={<button className="co-btn co-btn--ghost" style={{ whiteSpace: "nowrap" }} onClick={saveAndExit} disabled={submitting}>Save & Exit</button>}
      />
      <div className="co-body">
        <Stepper steps={AD_STEPS} step={step} onStepClick={setStep} />

        {step === 1 && (
        <div className="co-card">
          <div className="pr-audsplit">
              <div className="pr-audsplit__info">
                <h3 className="pr-audsplit__title">Buyer audience(s)</h3>
                <p className="pr-audsplit__desc">Your campaign includes up to two buyer audiences at no additional cost. Ad copy will be generated with audience-specific messaging in a later step.</p>
                <p className="pr-audsplit__desc">Don't want your team members or competitors to see your ads? Even though your practice's details will not be revealed, it may be possible for people to deduct your practice name based on other context clues. You can review and add audiences to exclude on the next step.</p>
              </div>
              <div className="pr-auds pr-auds--stack">
                {PROMO_AUDIENCES.map(a => {
                  const on = audiences.includes(a.id);
                  return (
                    <button key={a.id} type="button" className={`pr-aud pr-aud--lead ${on ? "is-selected" : ""}`} onClick={() => toggleAudience(a.id)}>
                      <span className="pr-aud__check"><Icon name="check" size={12} /></span>
                      <span className="pr-aud__text">
                        <span className="pr-aud__label">{a.label}{a.hint && <span className="pr-aud__hint">{a.hint}</span>}</span>
                        <span className="pr-aud__desc">{a.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
          </div>
        </div>
        )}

        {step === 2 && (
          <>
            <div className="pr-stephead">
              <div className="pr-stephead__row">
                <h2 className="pr-stephead__title">Exclude people from your campaign</h2>
                <span className="co-card__meta pr-autosave">
                  {saveState === "saving" ? "Saving…" : <><Icon name="check" size={12} /> All exclusions saved</>}
                </span>
              </div>
              <p className="pr-stephead__sub">We'll automatically use your CareOwner team list to reduce the chance that employees receive your ads. You can also add other contacts you want excluded.</p>
              <p className="pr-stephead__fine">Meta can only exclude contacts it is able to match. Exclusions reduce the likelihood that someone receives an ad, but they cannot guarantee complete confidentiality.</p>
            </div>
            <ExclusionsStep excl={excl} setExcl={setExcl} onToast={onToast} />
          </>
        )}

        {step === 3 && (
          <>
            <div className="pr-stephead">
              <div className="pr-stephead__row">
                <h2 className="pr-stephead__title">Ad Creative</h2>
                {variants && !generating && (
                  <span className="co-card__meta pr-autosave">
                    {saveState === "saving" ? "Saving…" : <><Icon name="check" size={12} /> Autosaved</>}
                  </span>
                )}
              </div>
              <p className="pr-stephead__sub">Review and suggest edits to your ad sets. CareOwner will review your campaign for accuracy, confidentiality, and Meta compliance before launching.</p>
            </div>
            {generating ? (
              <div className="co-card">
                <div className="pr-generating">
                  <Icon name="sparkles" size={22} className="pr-pulse" />
                  <div className="pr-generating__title">Drafting creative for {audiences.length} {audiences.length === 1 ? "audience" : "audiences"}…</div>
                  <div className="pr-generating__sub">Writing anonymized copy from your live listing — no names, no addresses.</div>
                </div>
              </div>
            ) : (
              <div className="pr-adcards">
                {audiences.map((aud, i) => (
                  <div key={aud} className="co-card">
                    <AudienceAdSet aud={aud} index={i} total={audiences.length}
                      list={(variants || []).filter(v => v.audience === aud)}
                      updateVariant={updateVariant} onToast={onToast} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {step === 4 && (
          <>
            <div className="pr-stephead">
              <div className="pr-stephead__row">
                <h2 className="pr-stephead__title">Review and submit your campaign</h2>
                <span className="co-card__meta pr-autosave">
                  {saveState === "saving" ? "Saving…" : <><Icon name="check" size={12} /> Autosaved</>}
                </span>
              </div>
              <p className="pr-stephead__sub">Confirm your campaign details and add a payment method. You will not be charged until CareOwner approves the campaign.</p>
            </div>

            <div className="pr-pay">
              <div className="pr-pay__main">
                <div className="co-card">
                  <div className="co-card__head"><h3 className="co-card__title">Campaign summary</h3></div>
                  <div className="pr-rev">
                    <div className="pr-rev__row pr-rev__row--center">
                      <div className="pr-rev__label">Buyer audiences</div>
                      <div className="pr-rev__val">
                        <span className="pr-audtags">
                          {audiences.map(a => <span key={a} className="pr-audtag">{audienceMeta(a).label}</span>)}
                        </span>
                      </div>
                      <button className="co-edit pr-rev__edit" onClick={() => setStep(1)}>Edit</button>
                    </div>
                    <div className="pr-rev__row">
                      <div className="pr-rev__label">Ad creative</div>
                      <div className="pr-rev__val">
                        <div className="pr-rev__split">
                          <span>{audiences.length} audience-specific ad {audiences.length === 1 ? "set" : "sets"}</span>
                          <span className="pr-rev__meta">{variantCount} total ads · 3 ads per audience</span>
                        </div>
                        <div className="pr-adsum">
                          {audRows.map(r => (
                            <div key={r.aud} className="pr-adsum__row">
                              <span className="pr-adsum__aud">{r.label}</span>
                              <span className="pr-adsum__meta">{r.inc < r.total ? `${r.inc} of ${r.total}` : r.total} ads</span>
                              <button className="pr-link" onClick={() => setStep(3)}>Review ads</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="pr-rev__row">
                      <div className="pr-rev__label">Exclusions</div>
                      <div className="pr-rev__val">{exclSummaryLine(excl)}
                        {exclCounts(excl).additional > 0 && (
                          <span className="pr-rev__sub">Additional contacts: {fmtInt(exclCounts(excl).additional)} · Total unique contacts: {fmtInt(exclCounts(excl).totalUnique)}</span>
                        )}
                      </div>
                      <button className="co-edit pr-rev__edit" onClick={() => setStep(2)}>Edit exclusions</button>
                    </div>
                    <div className="pr-rev__row pr-rev__row--center">
                      <div className="pr-rev__label">Landing page</div>
                      <div className="pr-rev__val">
                        <button className="co-btn co-btn--ghost" onClick={openLanding}><Icon name="externalLink" size={14} /> Preview teaser page</button>
                      </div>
                    </div>
                  </div>
                  {lintHits > 0 && (
                    <div className="pr-warn" style={{ marginTop: 16 }}>
                      <Icon name="alertTriangle" size={16} />
                      <div><b>{lintHits} {lintHits === 1 ? "ad" : "ads"}</b> still {lintHits === 1 ? "contains" : "contain"} identifying details. <button className="pr-link" onClick={() => setStep(3)}>Edit creative</button> to clean {lintHits === 1 ? "it" : "them"} up before submitting.</div>
                    </div>
                  )}
                </div>

                <div className="co-card">
                  <div className="co-card__head">
                    <div>
                      <h3 className="co-card__title">Payment method</h3>
                      <p className="co-card__subtitle">Add a payment method for the campaign. Your card will be saved securely and will not be charged today.</p>
                    </div>
                  </div>
                  <div className="pr-pms">
                    {payMethods.map(m => (
                      <button key={m.id} type="button" className={`pr-pm ${paySelected === m.id ? "is-selected" : ""}`} onClick={() => setPaySelected(m.id)}>
                        <span className="mc-radio-card__radio" />
                        <Icon name="creditCard" size={16} />
                        <span className="pr-pm__label">{m.brand} •••• {m.last4}</span>
                        <span className="pr-pm__exp">Expires {m.exp}</span>
                      </button>
                    ))}
                    <button type="button" className="pr-pm pr-pm--add" onClick={() => setPayFormOpen(o => !o)}>
                      <Icon name="plus" size={14} /> Add a new payment method
                    </button>
                  </div>
                  {payFormOpen && (
                    <div className="pr-payform">
                      {/* TODO(api): swap for the payment provider's hosted fields (Stripe
                          Payment Element + SetupIntent) — raw card data never hits CareOwner. */}
                      <div className="co-field"><label>Name on card</label>
                        <input value={card.name} className={cardError && !card.name.trim() ? "is-invalid" : ""}
                          onChange={e => setCard(c => ({ ...c, name: e.target.value }))} />
                      </div>
                      <div className="co-field"><label>Card number</label>
                        <input inputMode="numeric" autoComplete="off" placeholder="1234 5678 9012 3456" value={card.number}
                          className={cardError && card.number.replace(/\D/g, "").length < 12 ? "is-invalid" : ""}
                          onChange={e => setCard(c => ({ ...c, number: e.target.value }))} />
                      </div>
                      <div className="pr-payform__row">
                        <div className="co-field"><label>Expiration date</label>
                          <input placeholder="MM/YY" value={card.exp} className={cardError && !card.exp.trim() ? "is-invalid" : ""}
                            onChange={e => setCard(c => ({ ...c, exp: e.target.value }))} />
                        </div>
                        <div className="co-field"><label>Security code</label>
                          <input placeholder="CVC" inputMode="numeric" autoComplete="off" value={card.cvc} className={cardError && !card.cvc.trim() ? "is-invalid" : ""}
                            onChange={e => setCard(c => ({ ...c, cvc: e.target.value }))} />
                        </div>
                        <div className="co-field"><label>Billing ZIP code</label>
                          <input inputMode="numeric" value={card.zip} className={cardError && !card.zip.trim() ? "is-invalid" : ""}
                            onChange={e => setCard(c => ({ ...c, zip: e.target.value }))} />
                        </div>
                      </div>
                      {cardError && <p className="pr-payform__err">Complete every card field to save this payment method.</p>}
                      <div className="pr-payform__foot">
                        <span className="pr-payform__secure"><Icon name="lock" size={12} /> Saved securely with our payment provider — never stored on CareOwner.</span>
                        <button className="co-btn co-btn--primary" disabled={savingCard} onClick={saveCard}>{savingCard ? "Saving…" : "Save card"}</button>
                      </div>
                    </div>
                  )}
                  <div className="pr-paysec">
                    <div className="pr-paysec__title">After the first {plan.days} days</div>
                    <p className="pr-paysec__sub">Choose what happens when the first {plan.days}-day cycle ends. Renewals are charged to the payment method above.</p>
                    <div className="mc-radio-cards">
                      <button type="button" className={`mc-radio-card ${renewal === "end" ? "is-selected" : ""}`} onClick={() => setRenewal("end")}>
                        <span className="mc-radio-card__radio" />
                        <span>
                          <span className="mc-radio-card__title">End after {plan.days} days</span>
                          <span className="mc-radio-card__desc">You can choose to continue the campaign later.</span>
                        </span>
                      </button>
                      <button type="button" className={`mc-radio-card ${renewal === "auto" ? "is-selected" : ""}`} onClick={() => setRenewal("auto")}>
                        <span className="mc-radio-card__radio" />
                        <span>
                          <span className="mc-radio-card__title">Continue automatically</span>
                          <span className="mc-radio-card__desc">Charge ${fmtInt(plan.renew)} for each additional {plan.days}-day cycle until the campaign is paused or canceled.</span>
                        </span>
                      </button>
                    </div>
                    {renewal === "auto" && (
                      <p className="pr-renewnote"><Icon name="info" size={13} /> Your first renewal will occur {plan.days} days after the campaign launches.</p>
                    )}
                  </div>
                </div>

                <div className="co-card pr-next-card">
                  <div className="co-card__head"><h3 className="co-card__title">What happens next</h3></div>
                  <ol className="pr-next__list">
                    <li><b>CareOwner reviews your campaign.</b> Review usually takes 1–2 business days.</li>
                    <li><b>You approve any requested changes.</b> If CareOwner makes material changes, the campaign is returned to you before payment.</li>
                    <li><b>Your payment method is charged.</b> Once the campaign is approved and ready to launch, VetVet charges ${fmtInt(plan.price)}.</li>
                    <li><b>VetVet schedules your campaign.</b> You'll be notified when the campaign is scheduled and when the ads go live.</li>
                  </ol>
                </div>
              </div>

              {/* Sidebar (Figma 299:19002): totals, authorizations, and submit in one card. */}
              <aside className="pr-pay__aside">
                <div className="co-card">
                  <div className="co-card__head"><h3 className="co-card__title">Payment summary</h3></div>
                  <div className="pr-paysum">
                    <div className="pr-paysum__row"><span>First {plan.days} days of advertising</span><span>${fmtInt(plan.price - plan.setup)}</span></div>
                    <div className="pr-paysum__row"><span>One-time campaign setup</span><span>${fmtInt(plan.setup)}</span></div>
                    <div className="pr-paysum__row pr-paysum__row--total"><span>Total after approval</span><span>${fmtInt(plan.price)}</span></div>
                    <div className="pr-paysum__due"><span>Due today</span><span>$0</span></div>
                  </div>
                  <label className="pr-ack pr-ack--top" style={{ marginTop: 16 }}>
                    <input type="checkbox" checked={authCharge} onChange={e => setAuthCharge(e.target.checked)} />
                    <span>I authorize VetVet to charge my payment method ${fmtInt(plan.price)} <span className="pr-ack__hl">after my campaign is approved</span> and ready to launch. I understand that I will not be charged today.</span>
                  </label>
                  {renewal === "auto" && (
                    <label className="pr-ack pr-ack--top" style={{ marginTop: 10 }}>
                      <input type="checkbox" checked={authRenew} onChange={e => setAuthRenew(e.target.checked)} />
                      <span>I authorize VetVet to charge ${fmtInt(plan.renew)} for each additional {plan.days}-day campaign cycle until I pause or cancel.</span>
                    </label>
                  )}
                  {!canSubmit && (
                    <div className="pr-reqs">
                      <Icon name="alertTriangle" size={13} />
                      <span>To submit: {submitReqs.join(" · ")}.</span>
                    </div>
                  )}
                  <div className="pr-paysub">
                    <button className="co-btn co-btn--primary" onClick={submitRequest} disabled={submitting || !canSubmit}>
                      <Icon name="send" size={14} className={submitting ? "pr-pulse" : ""} /> {submitting ? "Submitting…" : "Submit for Review"}
                    </button>
                    <span className="pr-paysub__note">You will not be charged today</span>
                  </div>
                </div>
                <div className="pr-legal pr-legal--center">
                  <button className="pr-link" onClick={() => onToast("Campaign terms opened (mock)")}>Campaign terms</button>
                  <span>·</span>
                  <button className="pr-link" onClick={() => onToast("Cancellation policy opened (mock)")}>Cancellation policy</button>
                  <span>·</span>
                  <button className="pr-link" onClick={() => onToast("Privacy policy opened (mock)")}>Privacy policy</button>
                </div>
              </aside>
            </div>
          </>
        )}

        <div className={`pr-wizard__footer ${step === 4 ? "pr-wizard__footer--note" : ""}`}>
          <button className="co-btn co-btn--ghost" onClick={back} disabled={submitting}>Back</button>
          <div className="pr-wizard__footer-group">
            <button className="co-btn co-btn--ghost" onClick={saveDraft} disabled={submitting}>Save Draft</button>
            {step < 4
              ? <button className="co-btn co-btn--primary" onClick={next} disabled={!canContinue}>Continue <Icon name="chevronRight" size={14} /></button>
              : <button className="co-btn co-btn--primary" onClick={submitRequest} disabled={submitting || !canSubmit}>
                  <Icon name="send" size={14} className={submitting ? "pr-pulse" : ""} /> {submitting ? "Submitting…" : "Submit for Review"}
                </button>}
          </div>
          {step === 4 && <span className="pr-footnote pr-footnote--line">You will not be charged today</span>}
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
        backAction={<button className="co-btn-back" onClick={() => navigateTo("/practice/promotions")}><Icon name="chevronRight" style={{ transform: "rotate(180deg)" }} /> Back to Promotions</button>}
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
          backAction={<button className="co-btn-back" onClick={() => navigateTo("/practice/promotions")}><Icon name="chevronRight" style={{ transform: "rotate(180deg)" }} /> Back to Promotions</button>} />
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
        backAction={<button className="co-btn-back" onClick={() => navigateTo("/practice/promotions")}><Icon name="chevronRight" style={{ transform: "rotate(180deg)" }} /> Cancel</button>}
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
        backAction={<button className="co-btn-back" onClick={() => navigateTo("/practice/promotions")}><Icon name="chevronRight" style={{ transform: "rotate(180deg)" }} /> Cancel</button>}
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
        backAction={<button className="co-btn-back" onClick={() => navigateTo("/practice/promotions")}><Icon name="chevronRight" style={{ transform: "rotate(180deg)" }} /> Back to Promotions</button>} />
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
        backAction={<button className="co-btn-back" onClick={() => navigateTo("/practice/promotions")}><Icon name="chevronRight" style={{ transform: "rotate(180deg)" }} /> Cancel</button>}
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
