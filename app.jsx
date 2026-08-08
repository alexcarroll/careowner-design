// Root app: routing, state, edit modal

const App = () => {
  const route = useRoute(); // { area, section, sub, tab }
  const [textSize, setTextSize] = React.useState(() => localStorage.getItem("co.ts") || "md");
  const [pub, setPub] = React.useState(true);
  const [modal, setModal] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [listingEditor, setListingEditor] = React.useState(null); // null | "practice" | "marketplace" — tracks which page opened it

  // Send the bare root to the default workspace.
  React.useEffect(() => {
    const base = window.__APP_BASE__ || "";
    const p = window.location.pathname.replace(/\/index\.html$/, "");
    if (p === "/" || p === "" || p === base || p === base + "/") navigateTo("/practice", { replace: true });
  }, []);

  React.useEffect(() => {
    localStorage.setItem("co.ts", textSize);
    document.documentElement.style.fontSize = textSize === "sm" ? "14px" : textSize === "lg" ? "17px" : "16px";
  }, [textSize]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const onEdit = (m) => setModal(m);

  const onSubmit = () => {
    setModal(null);
    showToast("Changes saved");
  };

  const onTogglePub = (v) => { setPub(v); showToast(v ? "Listing is now Public" : "Listing is now Private"); };

  // Back-compat nav helpers so existing views keep their onNav(area)/onSection(section) calls.
  const onNav = (area) => navigateTo("/" + area);
  const onSection = (section) => navigateTo("/practice/" + section);

  const { area, section, sub, tab } = route;
  const onManageListing = () => setListingEditor(area);
  const props = { section, sub, tab, onSection, onEdit, onNav, onToast: showToast, onManageListing };
  const isMarketCheck = area === "practice" && section === "market-check";
  const isPromotions = area === "practice" && section === "promotions";
  // The practice-specific left rail only belongs to the practice workspace.
  // Marketplace and these top-nav areas render without it: Marketplace goes
  // full-width (its own filter sidebar), while the rest keep their content width
  // but centered on the page (co-shell__main--centered).
  const railless = ["marketplace", "buyers", "providers", "requests", "inquiries", "messages", "meetings"];
  const showRail = !railless.includes(area);
  const centeredMain = !showRail && area !== "marketplace";

  // Public promo landing pages (/l/:listingId and /l/s/:token) render standalone —
  // buyers see a VetVet-style marketing page, never the seller app shell.
  if (area === "l") {
    return (
      <>
        <LandingView slug={section} token={sub} onToast={showToast} />
        {toast && <Toast message={toast} />}
      </>
    );
  }

  return (
    <>
      <TopNav active={area} onNav={onNav} textSize={textSize} onTextSize={setTextSize} />
      <div className="co-shell">
        {showRail && <LeftRail />}
        <div className={"co-shell__main" + (centeredMain ? " co-shell__main--centered" : "")}>
          {area === "home" && <HomeView {...props} />}
          {area === "marketplace" && <MarketplaceView {...props} />}
          {area === "practice" && !isMarketCheck && !isPromotions && <PracticeView pub={pub} onTogglePub={onTogglePub} {...props} />}
          {isMarketCheck && <MarketCheckView pub={pub} onTogglePub={onTogglePub} {...props} />}
          {isPromotions && <PromoteView {...props} />}
          {area === "buyers" && <BuyersView {...props} />}
          {area === "providers" && <ProvidersView {...props} />}
          {(area === "requests" || area === "inquiries") && <RequestsView {...props} />}
          {area === "offers" && <OffersView {...props} />}
          {area === "messages" && <MessagesView {...props} />}
          {area === "meetings" && <MeetingsView {...props} />}
        </div>
      </div>
      {modal && <EditModal modal={modal} onClose={() => setModal(null)} onSubmit={onSubmit} />}
      {listingEditor && (
        <ListingEditorSlideout
          fromMarketplace={listingEditor === "marketplace"}
          onClose={() => setListingEditor(null)}
          onToast={showToast}
          onEditProfile={() => { setListingEditor(null); navigateTo("/practice"); }}
        />
      )}
      {toast && <Toast message={toast} />}
    </>
  );
};

const DEAL_TYPES = ["Joint Venture", "Partnership"];

const DealEditForm = () => {
  const [types, setTypes] = React.useState(PRACTICE.deal.types || [PRACTICE.deal.type]);
  const [buyer, setBuyer] = React.useState(PRACTICE.deal.buyer);
  const [timeline, setTimeline] = React.useState(PRACTICE.deal.timeline);
  const [stay, setStay] = React.useState(PRACTICE.deal.stay);
  const [earnOut, setEarnOut] = React.useState(PRACTICE.deal.earnOut);
  const [anonymous, setAnonymous] = React.useState(PRACTICE.deal.anonymous);
  const toggleType = (t) => setTypes(types.includes(t) ? types.filter(x => x !== t) : [...types, t]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="co-field">
          <label>Sale Timeline</label>
          <select value={timeline} onChange={e => setTimeline(e.target.value)}>
            <option>Immediate</option><option>3–6 months</option><option>6–9 months</option><option>9–12 months</option><option>1–2 years</option>
          </select>
        </div>
        <div className="co-field">
          <label>Stay Post-Deal</label>
          <select value={stay} onChange={e => setStay(e.target.value)}>
            <option>Exit at closing</option><option>6 months</option><option>1 year</option><option>2–3 years</option><option>5+ years</option>
          </select>
        </div>
      </div>
      <div className="co-field">
        <label>Deal Type <span style={{ color: "var(--stone-500)", fontWeight: 400 }}>· select all that apply</span></label>
        <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
          {DEAL_TYPES.map(t => (
            <button key={t} type="button" className={`co-chip ${types.includes(t) ? "is-active" : ""}`} onClick={() => toggleType(t)}>
              {types.includes(t) && <Icon name="check" size={12} />}{t}
            </button>
          ))}
        </div>
      </div>
      <div className="co-field">
        <label>Preferred Buyer Type</label>
        <select value={buyer} onChange={e => setBuyer(e.target.value)}>
          <option>Private / DVM</option><option>Corporate</option><option>Open to Both</option>
        </select>
      </div>
      <div className="co-field">
        <label>Additional Notes for Buyers</label>
        <textarea defaultValue={PRACTICE.deal.notes} placeholder="Any specific considerations about the sale…" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, font: "500 14px/1 Inter", cursor: "pointer" }}>
          <input type="checkbox" checked={earnOut} onChange={e => setEarnOut(e.target.checked)} />
          Open to earn-out structures
        </label>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} style={{ marginTop: 2 }} />
          <span>
            <span style={{ font: "500 14px/1.4 Inter" }}>Hide practice name from public listing</span>
            <span style={{ display: "block", marginTop: 4, font: "var(--font-caption)", color: "var(--stone-500)" }}>
              Buyers browsing the marketplace will see your practice details and metrics, but not its name or exact location, until you accept their request to connect. Recommended to protect confidentiality while your practice is listed.
            </span>
          </span>
        </label>
      </div>
    </div>
  );
};

const EditModal = ({ modal, onClose, onSubmit }) => {
  const renderBody = () => {
    if (modal.kind === "financials") return (
      <>
        <div className="co-field"><label>TTM Revenue</label><input defaultValue="$2.45M" /></div>
        <div className="co-field"><label>EBITDA</label><input defaultValue="$612K" /></div>
        <div className="co-field"><label>Bank Balance</label><input defaultValue="$184K" /></div>
      </>
    );
    if (modal.kind === "operations") return (
      <>
        <div className="co-field"><label>Active Clients</label><input defaultValue="1,240" /></div>
        <div className="co-field"><label>Revenue per Visit</label><input defaultValue="$456" /></div>
        <div className="co-field"><label>Revenue per Doctor</label><input defaultValue="$612K" /></div>
      </>
    );
    if (modal.kind === "team") return (
      <>
        <div className="co-field"><label>Doctors</label><input defaultValue="3" /></div>
        <div className="co-field"><label>Support Staff</label><input defaultValue="13" /></div>
        <div className="co-field"><label>Avg Experience</label><input defaultValue="13 years" /></div>
      </>
    );
    if (modal.kind === "ask-question") return (
      <>
        <div className="co-field"><label>Category</label><select defaultValue="General"><option>General</option><option>Offer/Deal</option><option>Operations</option></select></div>
        <div className="co-field"><label>Your Question</label><textarea placeholder="Type your question for this buyer…" /></div>
      </>
    );
    if (modal.kind === "reply" || modal.kind === "message-buyer") return (
      <>
        <div className="co-field"><label>Subject</label><input defaultValue={modal.title} /></div>
        <div className="co-field"><label>Message</label><textarea defaultValue="Thanks for reaching out — happy to arrange next steps. What works best on your end?" /></div>
      </>
    );
    if (modal.kind === "counter") return (
      <>
        <div className="co-field"><label>Counter Amount</label><input defaultValue="$875,000" /></div>
        <div className="co-field"><label>Rationale</label><textarea defaultValue="Based on verified TTM EBITDA and current Midwest multiples." /></div>
      </>
    );
    if (modal.kind === "accept") return (
      <>
        <p style={{ font: "400 14px/1.6 Inter", color: "var(--stone-700)" }}>
          You're about to preliminarily accept an offer of <b>{modal.amt}</b> from <b>{modal.from}</b>. This starts the 60-day diligence window; final acceptance requires countersignature from your attorney.
        </p>
        <div className="co-field" style={{ marginTop: 16 }}><label>Note to Buyer (optional)</label><textarea placeholder="Looking forward to working together…" /></div>
      </>
    );
    if (modal.kind === "new-meeting") return (
      <>
        <div className="co-field"><label>Title</label><input placeholder="e.g. Financial verification" /></div>
        <div className="co-field"><label>With</label><input placeholder="Buyer contact(s)" /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="co-field"><label>Date</label><input type="date" defaultValue="2026-04-24" /></div>
          <div className="co-field"><label>Time</label><input type="time" defaultValue="09:00" /></div>
        </div>
        <div className="co-field"><label>Type</label><select><option>Zoom</option><option>Phone</option><option>On-site</option></select></div>
      </>
    );
    if (modal.kind === "deal") return <DealEditForm />;
    if (modal.kind === "services") return (
      <>
        <p style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", marginTop: 0 }}>Toggle which services are offered.</p>
        {["Wellness Exams","Laboratory Services","Vaccinations","Radiology","Surgery","Emergency Care","Dental Care","Rehabilitation","Boarding","Grooming"].map(s => (
          <label key={s} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 0", font:"500 14px/1 Inter", borderBottom: "1px solid var(--stone-100)" }}>
            <input type="checkbox" defaultChecked={PRACTICE.services.includes(s)} /> {s}
          </label>
        ))}
      </>
    );
    return (
      <>
        <div className="co-field"><label>Name</label><input defaultValue="AnimalCare" /></div>
        <div className="co-field"><label>Location</label><input defaultValue="Lakeside, IL" /></div>
        <div className="co-field"><label>Notes</label><textarea placeholder="Any additional notes…" /></div>
      </>
    );
  };

  return (
    <Modal title={modal.title} onClose={onClose} footer={<>
      <button className="co-btn co-btn--ghost" onClick={onClose}>Cancel</button>
      <button className="co-btn co-btn--primary" onClick={onSubmit}>Save Changes</button>
    </>}>
      {renderBody()}
    </Modal>
  );
};

// Apply the deep-link path stashed by index.html now that every relative <script src>
// has been resolved/fetched (see the routing notes in index.html and server.js).
if (window.__RESTORE_PATH__) {
  try { window.history.replaceState(null, "", window.__RESTORE_PATH__); } catch (e) {}
  window.__RESTORE_PATH__ = null;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
