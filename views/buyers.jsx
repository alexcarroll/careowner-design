// Find Buyers view — sortable, selectable table with dropdown filters.

// US states for the Location → State filter. value = postal abbr (matches the
// trailing ", XX" in each buyer's location string), label = full name.
const BF_STATES = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"],
  ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["FL", "Florida"], ["GA", "Georgia"],
  ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"],
  ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"],
  ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"], ["MO", "Missouri"],
  ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"],
  ["NM", "New Mexico"], ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"],
  ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"],
  ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"],
  ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
];
const bfStateName = (ab) => { const s = BF_STATES.find(x => x[0] === ab); return s ? s[1] : ab; };

// Generic single-select dropdown (Type, Interest).
const BfSelect = ({ label, value, display, options, onSelect }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="bf-field">
      <span className="bf-label">{label}</span>
      <div className="bf-wrap">
        <button className={`bf-dd ${open ? "is-open" : ""}`} onClick={() => setOpen(o => !o)}>
          <span className="bf-dd__val">{display}</span>
          <Icon name="chevronDown" size={14} className="bf-dd__chev" />
        </button>
        {open && (
          <>
            <div className="bf-backdrop" onClick={() => setOpen(false)} />
            <div className="bf-pop">
              {options.map(o => (
                <button key={o.value} className={`bf-pop__item ${o.value === value ? "is-active" : ""}`} onClick={() => { onSelect(o.value); setOpen(false); }}>
                  <span>{o.label}</span>
                  {o.value === value && <Icon name="check" size={14} />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Location dropdown — larger card with State / Proximity radios.
const BfLocation = ({ value, onApply, onReset }) => {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState(null);   // null | "state" | "proximity"
  const [stateVal, setStateVal] = React.useState("");
  const [miles, setMiles] = React.useState("");
  const [place, setPlace] = React.useState("");

  // Per spec: each time the card opens, no radio is selected and both field
  // groups are visible but disabled until a radio is chosen.
  const openPop = () => { setMode(null); setStateVal(""); setMiles(""); setPlace(""); setOpen(true); };

  const display = !value ? "All locations"
    : value.mode === "state" ? bfStateName(value.state)
    : `Within ${value.miles || "?"} mi of ${value.place || "?"}`;

  const save = () => {
    if (mode === "state" && stateVal) onApply({ mode: "state", state: stateVal });
    else if (mode === "proximity" && place) onApply({ mode: "proximity", miles, place });
    else onApply(null);
    setOpen(false);
  };
  const reset = () => { onReset(); setOpen(false); };

  return (
    <div className="bf-field">
      <span className="bf-label">Location</span>
      <div className="bf-wrap">
        <button className={`bf-dd ${open ? "is-open" : ""} ${value ? "is-set" : ""}`} onClick={() => (open ? setOpen(false) : openPop())}>
          <span className="bf-dd__val">{display}</span>
          <Icon name="chevronDown" size={14} className="bf-dd__chev" />
        </button>
        {open && (
          <>
            <div className="bf-backdrop" onClick={() => setOpen(false)} />
            <div className="bf-pop bf-locpop">
              <label className={`bf-radio ${mode === "state" ? "is-on" : ""}`}>
                <input type="radio" name="bf-loc-mode" checked={mode === "state"} onChange={() => setMode("state")} />
                <span className="bf-radio__title">State</span>
              </label>
              <div className={`bf-locrow ${mode === "state" ? "" : "is-disabled"}`}>
                <select className="bf-input" value={stateVal} disabled={mode !== "state"} onChange={e => setStateVal(e.target.value)}>
                  <option value="">Select a state…</option>
                  {BF_STATES.map(([ab, nm]) => <option key={ab} value={ab}>{nm}</option>)}
                </select>
              </div>

              <label className={`bf-radio ${mode === "proximity" ? "is-on" : ""}`}>
                <input type="radio" name="bf-loc-mode" checked={mode === "proximity"} onChange={() => setMode("proximity")} />
                <span className="bf-radio__title">Proximity</span>
              </label>
              <div className={`bf-locrow bf-locrow--prox ${mode === "proximity" ? "" : "is-disabled"}`}>
                <span className="bf-prox__lead">Within</span>
                <input className="bf-input bf-input--mi" type="number" min="1" placeholder="25" value={miles} disabled={mode !== "proximity"} onChange={e => setMiles(e.target.value)} />
                <span className="bf-prox__lead">miles of</span>
                <input className="bf-input" placeholder="City or ZIP code" value={place} disabled={mode !== "proximity"} onChange={e => setPlace(e.target.value)} />
              </div>

              <div className="bf-locfoot">
                <button className="bf-btn-reset" onClick={reset}>Reset</button>
                <button className="co-btn-solid bf-btn-save" onClick={save}>Save</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const InterestBadge = ({ level }) => {
  if (!level) return <span style={{ color: "var(--stone-400)" }}>—</span>;
  const cls = level === "High" ? "co-badge--green" : level === "Medium" ? "co-badge--amber" : "co-badge--gray";
  return <span className={`co-badge ${cls}`}>{level}</span>;
};

const BuyersView = ({ section, onSection, onEdit }) => {
  const [q, setQ] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [interestFilter, setInterestFilter] = React.useState("all");
  const [loc, setLoc] = React.useState(null); // null | {mode:"state",state} | {mode:"proximity",miles,place}
  const [sort, setSort] = React.useState({ key: "lastActive", dir: "asc" });
  const [selected, setSelected] = React.useState(new Set());
  const [detail, setDetail] = React.useState(null);

  const filtered = React.useMemo(() => {
    let list = BUYERS.slice();
    if (typeFilter !== "all") list = list.filter(b => b.type === typeFilter);
    if (interestFilter !== "all") list = list.filter(b => b.interest === interestFilter);
    if (loc) {
      if (loc.mode === "state" && loc.state) list = list.filter(b => b.location.endsWith(", " + loc.state));
      else if (loc.mode === "proximity" && loc.place) {
        const p = loc.place.trim().toLowerCase();
        list = list.filter(b => b.location.toLowerCase().includes(p));
      }
    }
    if (q) list = list.filter(b => (b.name + (b.company || "") + b.type + b.location).toLowerCase().includes(q.toLowerCase()));
    list.sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key];
      const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [typeFilter, interestFilter, loc, q, sort]);

  const toggleSort = (key) => setSort(s => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  const toggleRow = (id) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const SortHead = ({ k, children, style }) => (
    <th style={style} className={sort.key === k ? "is-sorted" : ""} onClick={() => toggleSort(k)}>
      <span className="co-sort">{children}{sort.key === k && <Icon name={sort.dir === "asc" ? "arrowUp" : "arrowDown"} size={11} />}</span>
    </th>
  );

  const BadgeStatus = ({ s }) => ({
    active: <span className="co-badge co-badge--green">Active</span>,
    verified: <span className="co-badge co-badge--blue">Verified</span>,
    paused: <span className="co-badge co-badge--gray">Paused</span>,
  }[s]);

  const typeOptions = [{ value: "all", label: "All types" }].concat(BUYER_TYPES.map(t => ({ value: t, label: t })));
  const interestOptions = [
    { value: "all", label: "All levels" },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  // Clicking a buyer row opens the full-page Buyer Profile (replaces the old detail modal).
  if (detail) {
    return (
      <BuyerProfileView
        buyer={detail}
        onBack={() => setDetail(null)}
        onMessage={() => onEdit({ title: `Message ${detail.name}`, kind: "message-buyer" })}
        onAsk={() => onEdit({ title: `Ask ${detail.name} a Question`, kind: "ask-question" })}
      />
    );
  }

  return (
    <>
      <SubHeader crumbs={["Find Buyers"]} title="Find Buyers" actions={<>
        <button className="co-btn-outline"><Icon name="filter" /> Saved Searches</button>
        <button className="co-btn-solid"><Icon name="plus" /> Invite Buyer</button>
      </>} />
      <div className="co-body">
        <div style={{ gridColumn: "2 / -1" }}>
          <div className="bf-filters">
            <div className="co-search bf-search">
              <Icon name="search" />
              <input placeholder="Search buyers…" value={q} onChange={e => setQ(e.target.value)} />
            </div>
            <BfSelect label="Type" value={typeFilter} display={typeFilter === "all" ? "All types" : typeFilter} options={typeOptions} onSelect={setTypeFilter} />
            <BfSelect label="Interest" value={interestFilter} display={interestFilter === "all" ? "All levels" : interestFilter} options={interestOptions} onSelect={setInterestFilter} />
            <BfLocation value={loc} onApply={setLoc} onReset={() => setLoc(null)} />
            {selected.size > 0 && (
              <div className="bf-bulk">
                <span className="bf-bulk__count">{selected.size} selected</span>
                <button className="co-btn co-btn--ghost"><Icon name="message" size={14} /> Message</button>
                <button className="co-btn co-btn--primary"><Icon name="send" size={14} /> Invite to Review</button>
              </div>
            )}
          </div>

          <div className="co-card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="co-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <SortHead k="name">Buyer</SortHead>
                  <SortHead k="type">Type</SortHead>
                  <SortHead k="location">Location</SortHead>
                  <SortHead k="practices">Practices</SortHead>
                  <SortHead k="interest">Interest</SortHead>
                  <SortHead k="status">Status</SortHead>
                  <SortHead k="lastActive">Last Active</SortHead>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} className={selected.has(b.id) ? "is-selected" : ""} onClick={() => setDetail(b)} style={{ cursor: "pointer" }}>
                    <td onClick={e => e.stopPropagation()}><input type="checkbox" className="co-table__cb" checked={selected.has(b.id)} onChange={() => toggleRow(b.id)} /></td>
                    <td>
                      <div className="co-table__name">{b.name}</div>
                      <div className="co-table__sub">{b.company || "Individual Buyer"}</div>
                    </td>
                    <td>{b.type}</td>
                    <td>{b.location}</td>
                    <td>{b.practices}</td>
                    <td><InterestBadge level={b.interest} /></td>
                    <td><BadgeStatus s={b.status} /></td>
                    <td style={{ color: "var(--stone-500)" }}>{b.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="co-empty">No buyers match your filters.</div>}
          </div>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { BuyersView });
