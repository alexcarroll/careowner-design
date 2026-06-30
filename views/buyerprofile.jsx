// Buyer Profile — full-page marketing view for an individual buyer.
// Replaces the small detail modal on Find Buyers. Renders inside co-shell__main;
// the app shell already provides the top nav + left rail.
//
// The header identity (name, initials, type, location, verified, funds) is
// personalized from the clicked buyer row. The richer body sections (bio,
// experience, references, questions, documents) are illustrative sample
// content shared across buyers — wire to real per-buyer data later.

// ─── Identity helpers ───
const BP_STOP = /^(group|partners|holdings|capital|the|and|veterinary|pet|animal|llc|inc)$/i;
function bpInitials(name) {
  const cleaned = String(name || "").replace(/^Dr\.?\s+/i, "").trim();
  let parts = cleaned.split(/\s+/).filter(w => !BP_STOP.test(w));
  if (parts.length === 0) parts = cleaned.split(/\s+/);
  const a = parts[0] ? parts[0][0] : "";
  const b = parts[1] ? parts[1][0] : "";
  return (a + b).toUpperCase() || "?";
}
// ─── Sample body data (illustrative, shared across buyers) ───
const BP_BIO = [
  "Acquires and operates general and specialty animal hospitals, with a focus on doctor-led practices where the selling owner wants a real partner rather than a quick flip. Has personally sourced and closed multiple practices in the region.",
  "Keeps local brands, retains support teams, and reinvests in equipment and DVM mentorship after close. Deals are funded from committed capital, so timelines are fast and certain with no financing contingency.",
];
const BP_AREAS = ["Practice acquisitions", "Multi-site operations", "DVM recruiting & retention", "Post-close integration", "Financial diligence", "Regional growth strategy"];

const BP_TARGET = {
  geography: "Illinois, Wisconsin, Indiana, Michigan, Ohio",
  practiceTypes: ["Multi-doctor general", "General small-animal", "Specialty / ER"],
  ranges: [
    { label: "Revenue", lo: "$1.5M", hi: "$8M", left: 16, width: 52 },
    { label: "EBITDA", lo: "$300K", hi: "$1.8M", left: 14, width: 44 },
    { label: "Deal size", lo: "$2M", hi: "$12M", left: 18, width: 60 },
  ],
  minDoctors: "3 DVMs",
  ownerStay: "1–3 years preferred",
  dealTypes: ["Full acquisition", "Majority recapitalization"],
  timeline: "Actively acquiring · 0–9 months",
};

const BP_FIELDS = [
  { label: "EBITDA used in LOI calculation", value: "Trailing-12-month, normalized" },
  { label: "Dedicated recruiters on staff", value: "4" },
  { label: "New grads vs. experienced (2+ yrs) recruited, 2025", value: "35% / 65%" },
  { label: "DVMs recruited per hospital, 2025", value: "1.8" },
  { label: "Hospitals in network, 2025", value: "38" },
  { label: "Owner expected to mentor junior DVMs", value: "Optional" },
];

const BP_PDFS = [
  { name: "Network Overview & Track Record", meta: "PDF · 2.1 MB", ext: "PDF" },
  { name: "What We Look For in a Practice", meta: "PDF · 720 KB", ext: "PDF" },
];

// Categories for the Questions tab left-nav. `match` decides membership; counts
// are derived. Categories overlap (a question can be both General and Seller-sent).
const BP_QUESTION_CATEGORIES = [
  { id: "all", label: "All Questions", match: () => true },
  { id: "general", label: "General", match: q => q.topic === "general" },
  { id: "seller", label: "Sent by the Seller", match: q => q.from === "seller" },
  { id: "offer", label: "Offer/Deal", match: q => q.topic === "offer" },
];

const BP_QUESTIONS = [
  { q: "Will you keep our current support staff after closing?", from: "seller", topic: "general", asked: "Asked by you · 6/14/26",
    a: "Yes. Retaining the existing team is core to how we operate — we keep all support staff at current compensation and align benefits to our network plan within the first 90 days." },
  { q: "How long would you want the current owner to stay involved?", from: "seller", topic: "general", asked: "Asked by you · 6/14/26",
    a: "Ideally 1–3 years, structured around what works for you. A 12-month minimum helps with client and team continuity, but we're flexible — several of our sellers have stayed on as medical directors long term." },
  { q: "Do you plan to change the practice name or branding?", from: "seller", topic: "general", asked: "Asked by you · 6/16/26",
    a: "No. We keep local brand equity intact and operate under your existing name. Signage changes only happen with the seller's input, if at all." },
  { q: "What does your typical compensation structure look like for associate DVMs?", from: "seller", topic: "general", asked: "Asked by you · 6/18/26", a: null },
  { q: "What deal structures are you open to?", from: "buyer", topic: "offer", asked: "Published by buyer",
    a: "Full acquisitions and majority recapitalizations. We can structure equity rollover for owners who want to stay invested in the network." },
  { q: "How do you typically handle earn-outs or equity rollover?", from: "seller", topic: "offer", asked: "Asked by you · 6/20/26",
    a: "Earn-outs are optional and tied to clear, mutually agreed targets. Equity rollover is available and is how several of our owners have participated in network-level growth." },
  { q: "What is your typical timeline from a signed LOI to close?", from: "buyer", topic: "offer", asked: "Published by buyer",
    a: "Most deals close within 60–90 days of a signed LOI. Because we fund from committed capital, there's no financing contingency to slow things down." },
];

const BP_DOC_GROUPS = [
  { title: "Marketing", icon: "eye", desc: "Shared with any seller reviewing this profile.",
    docs: [
      { name: "Buyer Introduction", meta: "PDF · 2 pages", ext: "PDF" },
      { name: "Network Case Study", meta: "PDF · 5 pages", ext: "PDF" },
      { name: "Growth Track Record", meta: "PDF · 1 page", ext: "PDF" },
    ] },
  { title: "Contracts & Agreements", icon: "fileText", desc: "Sample terms, released after an inquiry is accepted.",
    docs: [
      { name: "Sample DVM Contract", meta: "PDF · 6 pages", ext: "PDF" },
      { name: "Owner Employment Agreement", meta: "PDF · 8 pages", ext: "PDF" },
      { name: "Team Benefits Overview", meta: "PDF · 3 pages", ext: "PDF" },
    ] },
  { title: "Other", icon: "folder", desc: "",
    docs: [
      { name: "Committed Capital Letter", meta: "PDF · 1 page", ext: "PDF", restricted: true },
      { name: "Fund References", meta: "PDF · 2 pages", ext: "PDF", restricted: true },
    ] },
];

const BP_REFERENCES = [
  { initials: "JR", name: "Dr. Janet Reyes", role: "Former owner, Prairie Vista Veterinary · Sold 2024", when: "2 years ago",
    quote: "They did exactly what they said they would. The team stayed, the transition was calm, and they checked in with me well past closing. I'd sell to them again." },
  { initials: "TO", name: "Dr. Thomas Okonkwo", role: "Former owner, Northgate Animal Clinic · Sold 2022", when: "4 years ago",
    quote: "Fair on price and honest about timeline. They kept our front-desk staff and the same lab partners. Clients barely noticed a change in ownership." },
  { initials: "SW", name: "Dr. Susan Whitfield", role: "Medical Director, Cedar Ridge Animal Hospital", when: "Joined 2021",
    quote: "I stayed on after they acquired us. They invested in mentorship and new equipment, and gave me real say in how the hospital runs. They've been straight with the team the whole way." },
];

const BP_MANAGER = { initials: "DL", name: "Diane Lockhart", role: "Regional Transition Manager · CareOwner Midwest", email: "diane.lockhart@careowner.com", phone: "(312) 555-0188" };

const BP_TABS = [
  { id: "overview", label: "Overview" },
  { id: "buying", label: "Buying" },
  { id: "questions", label: "Questions" },
  { id: "documents", label: "Documents" },
  { id: "references", label: "References" },
];

// ─── Reusable card ───
const BpCard = ({ title, icon, meta, action, children, style }) => (
  <div className="co-card" style={style}>
    {(title || action) && (
      <div className="co-card__head">
        <h3 className="co-card__title">{icon && <Icon name={icon} size={16} />}{title}{meta}</h3>
        {action}
      </div>
    )}
    {children}
  </div>
);

// ═══ OVERVIEW TAB ═══
const BpOverviewTab = ({ buyer }) => (
  <div className="bp-cols">
    <div className="bp-main">
      <BpCard title="Background" icon="user">
        <div className="bp-block">
          <div className="bp-sub" style={{ fontSize: "12px", fontWeight: 500 }}>Bio</div>
          {BP_BIO.map((p, i) => <p key={i} className="bp-prose">{p}</p>)}
        </div>
        <div className="bp-block">
          <div className="bp-sub" style={{ fontSize: "12px", fontWeight: 500 }}>Areas of Experience</div>
          <div className="bp-chips">
            {BP_AREAS.map(a => <span key={a} className="bp-chip">{a}</span>)}
          </div>
        </div>
        <div className="bp-block">
          <div className="bp-defs">
            <div>
              <div className="bp-def__label">Years in Practice M&amp;A</div>
              <div className="bp-def__value">9 years <small>· acquiring &amp; integrating practices</small></div>
            </div>
            <div>
              <div className="bp-def__label">Practices Acquired</div>
              <div className="bp-def__value">11 <small>· for the network</small></div>
            </div>
          </div>
        </div>
        <div className="bp-block">
          <div className="bp-sub">Links</div>
          <div className="bp-links">
            <a className="bp-link" href="#"><Icon name="globe" size={15} />LinkedIn</a>
            <a className="bp-link" href="#"><Icon name="mail" size={15} />{(buyer.name || "buyer").toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "")}@example.com</a>
            <a className="bp-link" href="#"><Icon name="phone" size={15} />(312) 555-0142</a>
          </div>
        </div>
      </BpCard>
    </div>

    <aside className="bp-rail">
      <BpCard title="Practices in Network" icon="building">
        <div className="bp-stat">
          <span className="bp-stat__num" style={{ fontSize: "24px", fontWeight: 600 }}>38</span>
          <span className="bp-stat__unit">practices</span>
        </div>
        <a className="bp-extlink">View portfolio <Icon name="arrowRight" size={14} /></a>
      </BpCard>

      <BpCard title="Looking For" icon="search">
        <div className="bp-ro">
          <div className="bp-ro__row">
            <span className="bp-ro__label" style={{ fontSize: "12px", lineHeight: "1.1", letterSpacing: "0.4px" }}>Geography targeted</span>
            <span className="bp-ro__val" style={{ fontWeight: 400 }}>{BP_TARGET.geography}</span>
          </div>
          <div className="bp-ro__pair">
            <div className="bp-ro__row"><span className="bp-ro__label">Revenue floor</span><span className="bp-ro__val">$1.5M</span></div>
            <div className="bp-ro__row"><span className="bp-ro__label">Revenue ceiling</span><span className="bp-ro__val">$8M</span></div>
          </div>
          <div className="bp-ro__pair">
            <div className="bp-ro__row"><span className="bp-ro__label">EBITDA floor</span><span className="bp-ro__val">$300K</span></div>
            <div className="bp-ro__row"><span className="bp-ro__label">EBITDA ceiling</span><span className="bp-ro__val">$1.8M</span></div>
          </div>
          <div className="bp-ro__pair">
            <div className="bp-ro__row"><span className="bp-ro__label">Deal size floor</span><span className="bp-ro__val">$2M</span></div>
            <div className="bp-ro__row"><span className="bp-ro__label">Deal size ceiling</span><span className="bp-ro__val">$12M</span></div>
          </div>
          <div className="bp-ro__row"><span className="bp-ro__label">Minimum number of doctors</span><span className="bp-ro__val">3</span></div>
        </div>
      </BpCard>
    </aside>
  </div>
);

// ═══ BUYING TAB ═══
const BpBuyingTab = ({ buyer, onOpenDoc }) => (
  <div className="bp-main" style={{ maxWidth: 880 }}>
    <BpCard title="Target Criteria" icon="sliders">
      <div className="bp-block" style={{ marginTop: 0 }}>
        <div className="bp-defs">
          <div><div className="bp-def__label">Geography Targeted</div><div className="bp-def__value">{BP_TARGET.geography}</div></div>
          <div><div className="bp-def__label">Practice Types</div><div className="bp-def__value">{BP_TARGET.practiceTypes.join(", ")}</div></div>
        </div>
      </div>
      <div className="bp-block">
        <div className="bp-sub">Financial Range</div>
        {BP_TARGET.ranges.map(r => (
          <div key={r.label} className="bp-range">
            <div className="bp-range__label">{r.label}</div>
            <div className="bp-range__wrap">
              <div className="bp-range__track">
                <div className="bp-range__fill" style={{ left: r.left + "%", width: r.width + "%" }} />
              </div>
              <div className="bp-range__val">{r.lo} – {r.hi}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bp-block">
        <div className="bp-defs">
          <div><div className="bp-def__label">Minimum Doctors</div><div className="bp-def__value">{BP_TARGET.minDoctors}</div></div>
          <div><div className="bp-def__label">Preferred Owner Stay</div><div className="bp-def__value">{BP_TARGET.ownerStay}</div></div>
          <div><div className="bp-def__label">Deal Types</div><div className="bp-def__value">{BP_TARGET.dealTypes.join(", ")}</div></div>
          <div><div className="bp-def__label">Timeline</div><div className="bp-def__value">{BP_TARGET.timeline}</div></div>
        </div>
      </div>
    </BpCard>

    <BpCard title="Buying Plan" icon="dollarSign">
      <div className="bp-defs bp-defs--single">
        <div>
          <div className="bp-def__label">Funds Available</div>
          <div className="bp-def__value" style={{ fontSize: 20, fontWeight: 700 }}>{buyer.funds} per deal</div>
        </div>
      </div>
      <div className="bp-block">
        <div className="bp-sub">Funding Structure</div>
        <p className="bp-prose">Committed institutional fund capital — no financing contingency. Equity rollover available for owners who want to stay invested in the network.</p>
      </div>
      <div className="bp-block">
        <div className="bp-sub" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          Proof of Funds
          <span className="co-prov co-prov--verified"><Icon name="checkCircle" size={12} />Verified by CareOwner</span>
        </div>
        <p className="bp-prose">A committed-capital confirmation and fund references are on file with CareOwner and released to sellers once an inquiry is mutually accepted.</p>
        <p className="bp-prose" style={{ marginTop: 10 }}><b style={{ color: "var(--stone-900)", fontWeight: 600 }}>Acquisition experience:</b> 11 acquisitions closed since 2021; 38 hospitals in the network today.</p>
      </div>
    </BpCard>

    <BpCard title="Buyer Data" icon="list">
      <div className="bp-metrics">
        {BP_FIELDS.map(f => (
          <div key={f.label}>
            <div className="bp-metric__label">{f.label}</div>
            <div className="bp-metric__value">{f.value}</div>
          </div>
        ))}
      </div>
    </BpCard>

    <BpCard title="Marketing Materials" icon="fileText">
      <div className="bp-files">
        {BP_PDFS.map(d => (
          <button key={d.name} className="bp-file" onClick={() => onOpenDoc(d)}>
            <span className="bp-file__icon"><Icon name="fileText" size={18} /></span>
            <span className="bp-file__body">
              <span className="bp-file__name">{d.name}</span>
              <span className="bp-file__meta">{d.meta}</span>
            </span>
            <span className="bp-file__dl"><Icon name="download" size={16} /></span>
          </button>
        ))}
      </div>
    </BpCard>
  </div>
);

// ═══ QUESTIONS TAB ═══
const BpQuestionsTab = ({ onAsk }) => {
  const [cat, setCat] = React.useState("all");
  const countFor = (c) => BP_QUESTIONS.filter(c.match).length;
  const active = BP_QUESTION_CATEGORIES.find(c => c.id === cat) || BP_QUESTION_CATEGORIES[0];
  const list = BP_QUESTIONS.filter(active.match);

  return (
    <div className="bp-qlayout">
      <aside className="bp-qnav">
        {BP_QUESTION_CATEGORIES.map(c => (
          <button key={c.id} className={`bp-qnav__item ${cat === c.id ? "is-active" : ""}`} onClick={() => setCat(c.id)}>
            <span>{c.label}</span>
            <span className="bp-qnav__count">{countFor(c)}</span>
          </button>
        ))}
      </aside>
      <div className="bp-main" style={{ minWidth: 0 }}>
        <BpCard title={active.label} icon="helpCircle" action={<button className="co-btn-solid" onClick={onAsk}><Icon name="plus" size={15} />Ask Question</button>}>
          {list.length === 0 ? (
            <div className="co-empty">No questions in this category yet.</div>
          ) : (
            <div className="bp-qa">
              {list.map((item, i) => (
                <div key={i} className="bp-qa__item">
                  <div className="bp-qa__q">
                    <span className="bp-qa__qmark">Q</span>
                    <div>
                      <div className="bp-qa__qtext">{item.q}</div>
                      <div className="bp-qa__askmeta">{item.asked}</div>
                    </div>
                  </div>
                  {item.a ? (
                    <div className="bp-qa__a">
                      <div className="bp-qa__abar"><span /></div>
                      <div className="bp-qa__atext">{item.a}</div>
                    </div>
                  ) : (
                    <div className="bp-qa__a">
                      <div className="bp-qa__abar"><span /></div>
                      <div className="bp-qa__pending"><Icon name="clock" size={14} />Awaiting answer from buyer</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </BpCard>
      </div>
    </div>
  );
};

// ═══ DOCUMENTS TAB ═══
const BpDocTile = ({ d, onOpenDoc }) => (
  <button className="bp-doc" onClick={() => onOpenDoc(d)}>
    <span className="bp-doc__icon">
      <Icon name="fileText" size={24} />
      <span className="bp-doc__ext">{d.ext}</span>
    </span>
    <span className="bp-doc__name">{d.name}</span>
    <span className="bp-doc__meta">{d.meta}</span>
  </button>
);

const BpDocumentsTab = ({ onOpenDoc }) => (
  <div className="bp-main" style={{ maxWidth: 880 }}>
    <div className="bp-nda">
      <span className="bp-nda__icon"><Icon name="lock" size={17} /></span>
      <div className="bp-nda__body">
        <div className="bp-nda__title">Buyer prefers to use own NDA</div>
        <div className="bp-nda__desc">Buyer prefers sellers to sign their own NDA instead of using the global CareOwner NDA.</div>
      </div>
      <a className="bp-nda__action"><Icon name="edit" size={14} />View &amp; Sign</a>
    </div>

    {BP_DOC_GROUPS.map(g => (
      <BpCard key={g.title} title={g.title} icon={g.icon} meta={g.desc ? <span className="co-card__meta" style={{ marginLeft: 8 }}>{g.desc}</span> : null}>
        <div className="bp-docgrid">
          {g.docs.map(d => <BpDocTile key={d.name} d={d} onOpenDoc={onOpenDoc} />)}
        </div>
      </BpCard>
    ))}
  </div>
);

// ═══ REFERENCES TAB ═══
const BpReferencesTab = () => (
  <div className="bp-cols">
    <div className="bp-main">
      <BpCard title="Seller References" icon="users" meta={<span className="co-card__meta" style={{ marginLeft: 8 }}>Owners who have sold to this buyer</span>}>
        {BP_REFERENCES.map(r => (
          <div key={r.name} className="bp-ref">
            <div className="bp-ref__avatar">{r.initials}</div>
            <div className="bp-ref__body">
              <div className="bp-ref__top">
                <div>
                  <div className="bp-ref__name">{r.name}</div>
                  <div className="bp-ref__role">{r.role}</div>
                </div>
                <div className="bp-ref__when">{r.when}</div>
              </div>
              <p className="bp-ref__quote">“{r.quote}”</p>
            </div>
          </div>
        ))}
      </BpCard>
    </div>
    <aside className="bp-rail">
      <BpCard title="Your Regional Manager" icon="headphones">
        <div className="bp-mgr">
          <div className="bp-mgr__avatar">{BP_MANAGER.initials}</div>
          <div>
            <div className="bp-mgr__name">{BP_MANAGER.name}</div>
            <div className="bp-mgr__role">{BP_MANAGER.role}</div>
          </div>
        </div>
        <div className="bp-mgr__contact">
          <a href={"mailto:" + BP_MANAGER.email}><Icon name="mail" size={14} />Email</a>
          <a href={"tel:" + BP_MANAGER.phone}><Icon name="phone" size={14} />{BP_MANAGER.phone}</a>
        </div>
      </BpCard>
    </aside>
  </div>
);

// ═══ DOCUMENT VIEWER MODAL ═══
const BpDocViewer = ({ doc, buyer, onClose }) => {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="co-modal-backdrop" onClick={onClose}>
      <div className="co-modal bp-docmodal" onClick={e => e.stopPropagation()}>
        <div className="co-modal__header">
          <h2 className="bp-docmodal__title"><Icon name="fileText" size={16} />{doc.name}</h2>
          <div className="bp-docmodal__hactions">
            <button className="co-btn-outline" style={{ height: 32, padding: "0 12px" }}><Icon name="download" size={14} />Download</button>
            <button className="co-modal__close" onClick={onClose}><Icon name="x" size={18} /></button>
          </div>
        </div>
        <div className="co-modal__body bp-docmodal__body">
          <div className="bp-docview">
            <p className="bp-docview__title">{doc.name}</p>
            <p className="bp-docview__by">Provided by {buyer.name} · {doc.meta}</p>
            <div className="bp-docview__skel" style={{ width: "92%" }} />
            <div className="bp-docview__skel" style={{ width: "100%" }} />
            <div className="bp-docview__skel" style={{ width: "88%" }} />
            <div className="bp-docview__skel" style={{ width: "96%" }} />
            <div className="bp-docview__h">Overview</div>
            <div className="bp-docview__skel" style={{ width: "100%" }} />
            <div className="bp-docview__skel" style={{ width: "94%" }} />
            <div className="bp-docview__skel" style={{ width: "70%" }} />
            <div className="bp-docview__h">Details</div>
            <div className="bp-docview__skel" style={{ width: "97%" }} />
            <div className="bp-docview__skel" style={{ width: "85%" }} />
            <div className="bp-docview__skel" style={{ width: "91%" }} />
            <div className="bp-docview__skel" style={{ width: "60%" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══ ROOT VIEW ═══
const BuyerProfileView = ({ buyer, onBack, onMessage, onAsk }) => {
  const [tab, setTab] = React.useState("overview");
  const [doc, setDoc] = React.useState(null);
  const verified = buyer.status === "verified" || buyer.status === "active";

  return (
    <div className="co-body">
      <div className="co-crumb" style={{ marginBottom: 16 }}>
        <Icon name="home" size={14} />
        <Icon name="chevronRight" size={12} />
        <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>Find Buyers</a>
        <Icon name="chevronRight" size={12} />
        <span className="co-crumb__current">{buyer.name}</span>
      </div>

      <div className="bp-head">
        <div className="bp-head__avatar">{bpInitials(buyer.name)}</div>
        <div className="bp-head__main">
          <div className="bp-head__namerow">
            <h1 className="bp-head__name">{buyer.name}</h1>
            {verified && <span className="bp-verify"><Icon name="checkCircle" size={14} />Verified Buyer</span>}
            <span className="bp-type"><Icon name="user" size={13} />{buyer.type}</span>
          </div>
          <div className="bp-head__meta">
            <span><Icon name="location" size={15} />{buyer.location}</span>
            <span><Icon name="briefcase" size={15} />{buyer.company || "Individual Buyer"}</span>
          </div>
        </div>
        <div className="bp-head__actions">
          <button className="co-btn-outline"><Icon name="star" size={15} />Save</button>
          <button className="co-btn-solid" onClick={() => onMessage && onMessage(buyer)}><Icon name="message" size={15} />Message Buyer</button>
        </div>
      </div>

      <div className="co-tabs">
        {BP_TABS.map(t => (
          <button key={t.id} className={tab === t.id ? "is-active" : ""} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {tab === "overview" && <BpOverviewTab buyer={buyer} />}
      {tab === "buying" && <BpBuyingTab buyer={buyer} onOpenDoc={setDoc} />}
      {tab === "questions" && <BpQuestionsTab onAsk={onAsk} />}
      {tab === "documents" && <BpDocumentsTab onOpenDoc={setDoc} />}
      {tab === "references" && <BpReferencesTab />}

      {doc && <BpDocViewer doc={doc} buyer={buyer} onClose={() => setDoc(null)} />}
    </div>
  );
};

Object.assign(window, { BuyerProfileView });
