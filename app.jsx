// Root app: routing, state, edit modal

const App = () => {
  const [route, setRoute] = React.useState(() => localStorage.getItem("co.route") || "practice");
  const [section, setSection] = React.useState(() => localStorage.getItem("co.section") || "overview");
  const [textSize, setTextSize] = React.useState(() => localStorage.getItem("co.ts") || "md");
  const [pub, setPub] = React.useState(true);
  const [modal, setModal] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => { localStorage.setItem("co.route", route); }, [route]);
  React.useEffect(() => { localStorage.setItem("co.section", section); }, [section]);
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

  const props = { section, onSection: setSection, onEdit, onNav: setRoute };

  return (
    <>
      <TopNav active={route} onNav={setRoute} textSize={textSize} onTextSize={setTextSize} />
      {route === "home" && <HomeView {...props} />}
      {route === "practice" && <PracticeView pub={pub} onTogglePub={onTogglePub} {...props} />}
      {route === "buyers" && <BuyersView {...props} />}
      {route === "inquiries" && <InquiriesView {...props} />}
      {route === "offers" && <OffersView {...props} />}
      {route === "messages" && <MessagesView {...props} />}
      {route === "meetings" && <MeetingsView {...props} />}
      {modal && <EditModal modal={modal} onClose={() => setModal(null)} onSubmit={onSubmit} />}
      {toast && <Toast message={toast} />}
    </>
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

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
