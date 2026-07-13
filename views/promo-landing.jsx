// Public promo landing pages — marketing-styled, not the app UI.
//   /l/:listingId → anonymous teaser (generalized location, illustrative art, bands)
//   /l/s/:token   → "Trusted Share" one-pager (real name, photo, owner's story)
// The header carries prototype preview controls: an anonymous/trusted version
// switcher and a Share-link modal (same content as the Share Links screen).
// Both pages end in a mock Request-info form that pushes to the promo leads store.
// TODO(api): push captured leads to HubSpot/CRM (see addPromoLead in data.jsx).
(() => {

const readSrc = () => {
  const m = (window.location.search || "").match(/[?&]src=([^&]+)/);
  return m ? decodeURIComponent(m[1]) : "link";
};

// Share modal — reuses the exact share-card content from the Share Links screen.
const PLShareModal = ({ mode, onClose, onToast }) => (
  <div className="co-modal-backdrop" onClick={onClose}>
    <div className="co-modal pl-modal pl-modal--share" onClick={e => e.stopPropagation()}>
      <div className="co-modal__header">
        <h2>Share this page</h2>
        <button className="co-modal__close" onClick={onClose}><Icon name="x" size={18} /></button>
      </div>
      <div className="co-modal__body pl-sharebody">
        <PromoShareCard mode={mode} onToast={onToast} />
      </div>
    </div>
  </div>
);

const PLHeader = ({ mode, onToast }) => {
  const [share, setShare] = React.useState(false);
  const switchMode = (m) => {
    if (m === mode) return;
    if (m === "trusted") navigateTo("/l/s/" + ensureNamedToken());
    else navigateTo("/l/" + MY_LISTING.id);
  };
  return (
    <>
      <header className="pl-topbar">
        <div className="pl-topbar__inner">
          <div className="pl-topbar__brand">
            <img className="pl-topbar__logo" src={assetUrl("assets/careowner-logo-lightbg.svg")} alt="CareOwner" />
            <span className="pl-topbar__tag">The platform for buying and selling veterinary practices.</span>
          </div>
          <div className="pl-topbar__controls">
            <button className="pl-sharelink" onClick={() => setShare(true)}><Icon name="share" size={14} /> Share link</button>
            <label className="pl-verselect">
              <Icon name={mode === "trusted" ? "lock" : "eyeOff"} size={13} />
              <select value={mode} onChange={e => switchMode(e.target.value)} aria-label="Listing version">
                <option value="anonymous">Anonymous version</option>
                <option value="trusted">Trusted version</option>
              </select>
              <Icon name="chevronDown" size={13} />
            </label>
          </div>
        </div>
      </header>
      {share && <PLShareModal mode={mode} onClose={() => setShare(false)} onToast={onToast} />}
    </>
  );
};

const PLFooter = ({ note }) => (
  <footer className="pl-footer">
    <div className="pl-footer__inner">
      <img className="pl-footer__logo" src={assetUrl("assets/careowner-logo-darkbg.svg")} alt="CareOwner" />
      <p>{note}</p>
      <p className="pl-footer__fine">Practice sales, handled with care · The CareOwner marketplace</p>
    </div>
  </footer>
);

// Mock lead capture — swaps to a success state after "sending".
const InquiryModal = ({ mode, cta, onClose, onToast }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [note, setNote] = React.useState("");
  const [updates, setUpdates] = React.useState(true);
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const src = readSrc();

  const submit = () => {
    if (!name.trim() || !email.trim()) { onToast("Add your name and email so the owner can respond"); return; }
    setSending(true);
    // TODO(api): push to HubSpot/CRM — mock latency then store in-memory.
    setTimeout(() => {
      addPromoLead({ name: name.trim(), email: email.trim(), note: note.trim(), updates, mode, src });
      setSending(false); setSent(true);
    }, 900);
  };

  return (
    <div className="co-modal-backdrop" onClick={onClose}>
      <div className="co-modal pl-modal" onClick={e => e.stopPropagation()}>
        <div className="co-modal__header">
          <h2>{sent ? "Request received" : cta}</h2>
          <button className="co-modal__close" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="co-modal__body">
          {sent ? (
            <div className="pl-sent">
              <span className="pl-sent__icon"><Icon name="checkCircle" size={26} /></span>
              <h3>Thanks, {name.replace(/^(dr|mr|mrs|ms)\.?\s+/i, "").split(" ")[0]} — you're in the queue.</h3>
              <p>{mode === "anonymous"
                ? "The owner reviews every request through CareOwner. If it's a fit, they'll share more detail — including who and where they are."
                : "Your note went straight to the owner. They'll reach out to you directly."}</p>
              <button className="pl-btn" onClick={onClose}>Done</button>
            </div>
          ) : (
            <>
              <p className="pl-modal__lede">{mode === "anonymous"
                ? "Introduce yourself. The owner stays anonymous until they accept your request."
                : "Send the owner a note — they shared this page with you, so they're expecting to hear from you."}</p>
              <div className="co-field"><label>Your name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="Dr. Jordan Ellis" /></div>
              <div className="co-field"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
              <div className="co-field"><label>Anything you'd like to say? <span style={{ color: "var(--stone-400)", fontWeight: 400 }}>(optional)</span></label>
                <textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder={mode === "anonymous" ? "I'm an associate DVM looking for my first practice…" : "Thanks for sharing this with me…"} />
              </div>
              <button className="pl-btn" style={{ width: "100%", marginTop: 4, justifyContent: "center" }} disabled={sending} onClick={submit}>
                {sending ? "Sending…" : mode === "anonymous" ? "Request more info" : "Send inquiry"}
              </button>
              <label className="pl-optin">
                <input type="checkbox" checked={updates} onChange={e => setUpdates(e.target.checked)} />
                Sign up for updates from CareOwner.
              </label>
              <p className="pl-modal__fine"><Icon name="lock" size={11} /> Handled confidentially through CareOwner. No spam, ever.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Anonymous teaser — /l/:listingId ─────────────────────────────────────────
const AnonLanding = ({ onToast }) => {
  const listing = useMyListing();
  const [modal, setModal] = React.useState(false);
  // Buyer-view Market Profile — the same anonymized snapshot buyers score in
  // Market Check, grouped by category with provenance.
  const profile = MC_INCOMING_REQUESTS[0];

  return (
    <div className="pl-page">
      <PLHeader mode="anonymous" onToast={onToast} />

      <section className="pl-hero">
        <div className="pl-hero__text">
          <div className="pl-eyebrow">Veterinary practice for sale</div>
          <h1 className="pl-title">{listing.title}</h1>
          <p className="pl-lede">{listing.description}</p>
          <div className="pl-hero__actions">
            <button className="pl-btn" onClick={() => setModal(true)}>Request more info</button>
            <span className="pl-hero__hint"><Icon name="lock" size={13} /> The owner stays anonymous until they accept your request</span>
          </div>
        </div>
        <figure className="pl-hero__media">
          <img src={listing.image} alt="Illustration of a veterinary practice" />
          <figcaption><Icon name="image" size={12} /> Illustrative artwork — the real practice is revealed after a verified request</figcaption>
        </figure>
      </section>

      <section className="pl-statband">
        <div className="pl-stat"><div className="pl-stat__k">Annual revenue</div><div className="pl-stat__v">$2M – $3M</div><div className="pl-stat__s">+8% year over year</div></div>
        <div className="pl-stat"><div className="pl-stat__k">Adjusted EBITDA</div><div className="pl-stat__v">~$610K</div><div className="pl-stat__s">≈25% margin · verified</div></div>
        <div className="pl-stat"><div className="pl-stat__k">Owner's price expectation</div><div className="pl-stat__v">{PRACTICE.askingPrice.replace(/\s*\(.*\)/, "")}</div><div className="pl-stat__s">Open to deal structures</div></div>
        <div className="pl-stat"><div className="pl-stat__k">Team</div><div className="pl-stat__v">5 DVMs</div><div className="pl-stat__s">13 support staff · low turnover</div></div>
      </section>

      <section className="pl-section">
        <h2 className="pl-h2">About this practice</h2>
        <div className="pl-cols">
          <ul className="pl-bullets">
            <li><Icon name="check" size={14} /> Established small-animal general practice, 10+ years in the same community</li>
            <li><Icon name="check" size={14} /> 1,200+ active clients with strong recurring wellness revenue</li>
            <li><Icon name="check" size={14} /> 5 exam rooms across ~2,300 sq ft with a secure long-term lease</li>
            <li><Icon name="check" size={14} /> Tenured team that intends to stay through a transition</li>
            <li><Icon name="check" size={14} /> Retiring owner offering a hands-on, 2–3 year handoff</li>
          </ul>
          <div className="pl-verify">
            <div className="pl-verify__title"><Icon name="checkCircle" size={15} /> Verified by CareOwner</div>
            <p>Financials and operations are verified against the practice's connected accounting and PIMS data — you're not taking a stranger's word for it.</p>
            <div className="pl-chiprow">
              <span className="pl-chip"><Icon name="check" size={12} /> Financials verified</span>
              <span className="pl-chip"><Icon name="check" size={12} /> Operations verified</span>
              <span className="pl-chip"><Icon name="mapPin" size={12} /> Suburban Midwest</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pl-section pl-section--tint">
        <h2 className="pl-h2">Practice Profile</h2>
        <p className="pl-profile__lede">Verified metrics from connected accounting and practice-management systems.</p>
        <div className="pl-profile">
          {profile.groups.map(g => (
            <div key={g.group} className="pl-profile__group">
              <div className="pl-minihead">{g.group}</div>
              {g.items.map(it => (
                <div key={it.label} className="pl-profile__row">
                  <span className="pl-profile__k">{it.label}</span>
                  <span className="pl-profile__v">{it.value}</span>
                  <span className={`pl-prov ${it.provenance === "verified" ? "is-v" : ""}`}>
                    {it.provenance === "verified" ? <><Icon name="check" size={10} /> Verified</> : "Self-reported"}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="pl-ctaband">
        <div className="pl-ctaband__inner">
          <h2>Think this could be yours?</h2>
          <p>Request more info and the owner will review your inquiry — identity protected on both sides until there's a fit.</p>
          <button className="pl-btn pl-btn--light" onClick={() => setModal(true)}>Request more info</button>
        </div>
      </section>

      <PLFooter note={`Listing ${listing.id} · The practice's name, address, and photos are withheld at the owner's request.`} />
      {modal && <InquiryModal mode="anonymous" cta="Request more info" onClose={() => setModal(false)} onToast={onToast} />}
    </div>
  );
};

// ─── Trusted Share one-pager — /l/s/:token ────────────────────────────────────
const TrustedLanding = ({ token, onToast }) => {
  const promo = usePromo();
  const [modal, setModal] = React.useState(false);
  // Same Market Profile the buyer view shows — but de-anonymized: exact revenue
  // and the real location, since a Trusted Share already reveals who this is.
  const profile = MC_INCOMING_REQUESTS[0];
  const trustedGroups = profile.groups.map(g => ({
    ...g,
    items: g.items.map(it => {
      if (it.label === "High-Level Revenue") return { ...it, label: "TTM Revenue", value: PRACTICE.financials.ttmRevenue };
      if (it.label === "Adjusted EBITDA") return { ...it, value: `${PRACTICE.financials.ebitda} · 25% margin` };
      if (it.label === "Location") return { ...it, value: `${PRACTICE.type} · ${PRACTICE.address}` };
      return it;
    }),
  }));
  // Prototype token check: the stored token wins; with no stored token (fresh
  // browser) the page still renders so shared demo links don't dead-end.
  const valid = !promo.namedToken || promo.namedToken === token;

  if (!valid) {
    return (
      <div className="pl-page">
        <PLHeader mode="trusted" onToast={onToast} />
        <div className="pl-expired">
          <span className="pl-expired__icon"><Icon name="lock" size={22} /></span>
          <h1>This private link is no longer active</h1>
          <p>The owner may have rotated it. Ask them for a fresh link — or browse anonymized listings on the marketplace.</p>
        </div>
        <PLFooter note="Trusted Share pages are unlisted and owner-controlled." />
      </div>
    );
  }

  return (
    <div className="pl-page">
      <PLHeader mode="trusted" onToast={onToast} />

      <section className="pl-hero pl-hero--trusted">
        <div className="pl-hero__text">
          <div className="pl-eyebrow">For sale · Shared in confidence</div>
          <h1 className="pl-title">{PRACTICE.name}</h1>
          <p className="pl-hero__where"><Icon name="mapPin" size={15} /> {PRACTICE.address}</p>
          <p className="pl-lede">{PRACTICE.type} · Founded {PRACTICE.founded} · {PRACTICE.rating}★ ({PRACTICE.reviewCount} reviews) · {PRACTICE.cert[0]}</p>
          <div className="pl-hero__actions">
            <button className="pl-btn" onClick={() => setModal(true)}>For sale — inquire</button>
            <span className="pl-hero__hint"><Icon name="lock" size={13} /> Please keep this page between us</span>
          </div>
        </div>
        <figure className="pl-hero__media">
          <img src={assetUrl("assets/practice-exterior.jpg")} alt={PRACTICE.name} />
          <figcaption><Icon name="checkCircle" size={12} /> The real {PRACTICE.name} — no stock photos here</figcaption>
        </figure>
      </section>

      <section className="pl-statband">
        <div className="pl-stat"><div className="pl-stat__k">TTM revenue</div><div className="pl-stat__v">{PRACTICE.financials.ttmRevenue}</div><div className="pl-stat__s">Verified {PRACTICE.financials.verifiedDate}</div></div>
        <div className="pl-stat"><div className="pl-stat__k">Adjusted EBITDA</div><div className="pl-stat__v">{PRACTICE.financials.ebitda}</div><div className="pl-stat__s">≈25% margin</div></div>
        <div className="pl-stat"><div className="pl-stat__k">Asking</div><div className="pl-stat__v">{PRACTICE.askingPrice.replace(/\s*\(.*\)/, "")}</div><div className="pl-stat__s">{PRACTICE.deal.types.join(" / ")} welcome</div></div>
        <div className="pl-stat"><div className="pl-stat__k">Active clients</div><div className="pl-stat__v">{PRACTICE.operations.activeClients}</div><div className="pl-stat__s">{PRACTICE.operations.revenuePerVisit} revenue / visit</div></div>
      </section>

      <section className="pl-section">
        <h2 className="pl-h2">From the owner</h2>
        <div className="pl-owner">
          <div className="pl-owner__avatar">{PRACTICE.owners[0].initials}</div>
          <div>
            <blockquote className="pl-owner__quote">
              “I opened {PRACTICE.name} in {PRACTICE.founded} to give this town the kind of veterinary care I'd want for
              my own animals. Twelve years later we're a {PRACTICE.team.doctors}-doctor practice with clients who've been
              with us from day one. I'm not looking for the highest bidder — I'm looking for the right hands.”
            </blockquote>
            <div className="pl-owner__name">{PRACTICE.owners[0].name} · {PRACTICE.owners[0].role}</div>
            <p className="pl-owner__bio">{PRACTICE.bio}</p>
          </div>
        </div>
      </section>

      <section className="pl-section pl-section--tint">
        <h2 className="pl-h2">The team & culture</h2>
        <div className="pl-cols">
          <ul className="pl-bullets">
            <li><Icon name="users" size={14} /> {PRACTICE.team.doctors} doctors ({PRACTICE.team.partTime} part-time) with {PRACTICE.team.avgExperience} average experience</li>
            <li><Icon name="heart" size={14} /> {PRACTICE.team.supportStaff} support staff · {PRACTICE.team.avgTenure} average tenure</li>
            <li><Icon name="award" size={14} /> {PRACTICE.cert[0]} · community fixture — vaccine clinics, school visits</li>
            <li><Icon name="clock" size={14} /> Owner will stay {PRACTICE.deal.stay} post-close to transfer relationships</li>
          </ul>
          <div>
            <div className="pl-minihead">Services</div>
            <div className="pl-chiprow">
              {PRACTICE.services.map(s => <span key={s} className="pl-chip">{s}</span>)}
            </div>
            <div className="pl-minihead" style={{ marginTop: 20 }}>Facility</div>
            <p className="pl-plain">{PRACTICE.facilities.examRooms} exam rooms · {PRACTICE.facilities.buildingSize} · lease through {PRACTICE.facilities.leaseExpires} with {PRACTICE.facilities.renewalOptions.toLowerCase()}</p>
          </div>
        </div>
      </section>

      <section className="pl-section pl-section--tint">
        <h2 className="pl-h2">Practice Profile</h2>
        <p className="pl-profile__lede">Verified metrics from connected accounting and practice-management systems.</p>
        <div className="pl-profile">
          {trustedGroups.map(g => (
            <div key={g.group} className="pl-profile__group">
              <div className="pl-minihead">{g.group}</div>
              {g.items.map(it => (
                <div key={it.label} className="pl-profile__row">
                  <span className="pl-profile__k">{it.label}</span>
                  <span className="pl-profile__v">{it.value}</span>
                  <span className={`pl-prov ${it.provenance === "verified" ? "is-v" : ""}`}>
                    {it.provenance === "verified" ? <><Icon name="check" size={10} /> Verified</> : "Self-reported"}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="pl-ctaband">
        <div className="pl-ctaband__inner">
          <h2>Interested? Say hello.</h2>
          <p>You're seeing this page because the owner trusts you. Reach out directly — no brokers, no runaround.</p>
          <button className="pl-btn pl-btn--light" onClick={() => setModal(true)}>For sale — inquire</button>
        </div>
      </section>

      <PLFooter note={`Shared privately by ${PRACTICE.owners[0].name}. Please don't repost or forward this link.`} />
      {modal && <InquiryModal mode="named" cta="Inquire about this practice" onClose={() => setModal(false)} onToast={onToast} />}
    </div>
  );
};

// ─── Entry — resolves /l/:listingId vs /l/s/:token ───────────────────────────
const LandingView = ({ slug, token, onToast = () => {} }) => {
  React.useEffect(() => { window.scrollTo(0, 0); }, [slug, token]);
  if (slug === "s" && token) return <TrustedLanding token={token} onToast={onToast} />;
  return <AnonLanding onToast={onToast} />;
};

Object.assign(window, { LandingView });

})();
