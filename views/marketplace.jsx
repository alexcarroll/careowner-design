// Marketplace — browse all practice listings on the CareOwner platform.
// Grid (vertical cards) + list (horizontal cards) layouts, four tabs, and a
// left filter sidebar. Only the "Discover" tab is built out for now.

// status → badge modifier + dot color (see .mk-status--* in index.html)
const STATUS_META = {
  "Active":         { cls: "active",   label: "Active" },
  "Coming Soon":    { cls: "soon",     label: "Coming Soon" },
  "Offer Pending":  { cls: "offer",    label: "Offer Pending" },
  "Under Contract": { cls: "contract", label: "Under Contract" },
};

// US states — value = postal abbr, label = full name. Powers the State dropdown.
const MK_STATES = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],
  ["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],
  ["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],
  ["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],
  ["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],
  ["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],
  ["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],
  ["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],
  ["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
];

// Revenue-range brackets (last-year revenue). test() runs against the dollar value.
const MK_REVENUE_BRACKETS = [
  { id: "u1",   label: "Under $1M",  test: (r) => r < 1000000 },
  { id: "1-2",  label: "$1M – $2M",  test: (r) => r >= 1000000 && r < 2000000 },
  { id: "2-5",  label: "$2M – $5M",  test: (r) => r >= 2000000 && r < 5000000 },
  { id: "5p",   label: "$5M+",       test: (r) => r >= 5000000 },
];

// # of DVMs brackets (FTE doctor count).
const MK_DVM_BRACKETS = [
  { id: "1-2",  label: "1 – 2",   test: (d) => d <= 2 },
  { id: "3-5",  label: "3 – 5",   test: (d) => d >= 3 && d <= 5 },
  { id: "6-10", label: "6 – 10",  test: (d) => d >= 6 && d <= 10 },
  { id: "11p",  label: "11+",     test: (d) => d >= 11 },
];

const yoyNum = (s) => parseFloat(String(s).replace(/[^0-9.\-]/g, "")) || 0;

// Toggle helper for Set-valued filter state.
const toggleInSet = (setter) => (val) => setter(prev => {
  const next = new Set(prev);
  next.has(val) ? next.delete(val) : next.add(val);
  return next;
});

// ── ··· action menu ───────────────────────────────────────────────────
const ListingMenu = ({ open, onOpen, onClose, saved, onSave, onHide, onToast }) => (
  <div className="mk-menu-anchor">
    <button className="mk-iconbtn" aria-label="More actions" onClick={(e) => { e.stopPropagation(); open ? onClose() : onOpen(); }}>
      <Icon name="moreVertical" size={18} />
    </button>
    {open && (
      <>
        <div className="bf-backdrop" onClick={(e) => { e.stopPropagation(); onClose(); }} />
        <div className="mk-menu" onClick={(e) => e.stopPropagation()}>
          <button className="mk-menu__item" onClick={() => { onSave(); onClose(); }}>
            <Icon name="heart" size={16} /> {saved ? "Remove from Saved" : "Save listing"}
          </button>
          <button className="mk-menu__item" onClick={() => { onToast("Sharing options opened"); onClose(); }}>
            <Icon name="share" size={16} /> Share
          </button>
          <button className="mk-menu__item" onClick={() => { onToast("Link copied to clipboard"); onClose(); }}>
            <Icon name="link" size={16} /> Copy link
          </button>
          <div className="mk-menu__sep" />
          <button className="mk-menu__item mk-menu__item--danger" onClick={() => { onHide(); onClose(); }}>
            <Icon name="eyeOff" size={16} /> Hide listing
          </button>
          <button className="mk-menu__item mk-menu__item--danger" onClick={() => { onToast("Listing reported — thank you"); onClose(); }}>
            <Icon name="flag" size={16} /> Report
          </button>
        </div>
      </>
    )}
  </div>
);

// Shared inner content: meta line, title, description, divider, stats.
const ListingContent = ({ l }) => (
  <>
    <div className="mk-meta">
      <span>{l.state}</span><span className="mk-meta__sep" />
      <span>{l.locationType}</span><span className="mk-meta__sep" />
      <span>{l.practiceType}</span>
    </div>
    <h3 className="mk-title">{l.title}</h3>
    <p className="mk-desc">{l.description}</p>
    <div className="mk-divider" />
    <div className="mk-stats">
      <div className="mk-stat">
        <span className="mk-stat__label">FTE DVMs</span>
        <span className="mk-stat__val">{l.dvms}{l.pt > 0 && <small>· {l.pt} PT</small>}</span>
      </div>
      <div className="mk-stat">
        <span className="mk-stat__label">Revenue</span>
        <span className="mk-stat__val mk-rev">
          <span><span className="mk-rev__k">2025</span> {l.lastYear}</span>
          <span><span className="mk-rev__k">YTD</span> {l.ytd}</span>
          <span className="mk-rev__yoy">{l.yoy}</span>
        </span>
      </div>
    </div>
  </>
);

const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META["Active"];
  return (
    <span className={`mk-status mk-status--${m.cls}`}>
      <span className="mk-status__dot" />{m.label}
    </span>
  );
};

// Top-left overlay: a Featured tag (when promoted) followed by the status pill.
const MediaBadges = ({ l }) => (
  <div className="mk-media__badges">
    {l.featured && <span className="mk-featured-tag"><Icon name="star" size={13} /> Featured</span>}
    <StatusBadge status={l.status} />
  </div>
);

const ListingCard = ({ l, layout, saved, menuOpen, onMenu, onCloseMenu, onSave, onHide, onToast }) => {
  const heart = (
    <button className={`mk-iconbtn ${saved ? "is-saved" : ""}`} aria-label={saved ? "Unsave" : "Save"} onClick={(e) => { e.stopPropagation(); onSave(); }}>
      <Icon name="heart" size={18} />
    </button>
  );
  const menu = (
    <ListingMenu open={menuOpen} onOpen={onMenu} onClose={onCloseMenu} saved={saved}
      onSave={onSave} onHide={onHide} onToast={onToast} />
  );
  const foot = (
    <div className="mk-foot">
      {layout === "grid" && heart}
      <button className="mk-btn mk-btn--soft" onClick={() => onToast("Message composer opened")}>Message</button>
      <button className="mk-btn mk-btn--solid" onClick={() => onToast("Access request sent")}>Request Access</button>
    </div>
  );

  if (layout === "list") {
    return (
      <article className={`mk-card mk-card--row ${l.featured ? "mk-card--featured" : ""}`}>
        <div className="mk-media">
          <img src={l.image} alt={l.title} loading="lazy" />
          <MediaBadges l={l} />
        </div>
        <div className="mk-main">
          <div className="mk-body">
            <div className="mk-rowhead">
              <div className="mk-meta">
                <span>{l.state}</span><span className="mk-meta__sep" />
                <span>{l.locationType}</span><span className="mk-meta__sep" />
                <span>{l.practiceType}</span>
              </div>
              <div className="mk-rowhead__actions">{heart}{menu}</div>
            </div>
            <h3 className="mk-title">{l.title}</h3>
            <p className="mk-desc">{l.description}</p>
            <div className="mk-divider" />
            <div className="mk-stats">
              <div className="mk-stat">
                <span className="mk-stat__label">FTE DVMs</span>
                <span className="mk-stat__val">{l.dvms}{l.pt > 0 && <small>· {l.pt} PT</small>}</span>
              </div>
              <div className="mk-stat">
                <span className="mk-stat__label">Revenue</span>
                <span className="mk-stat__val mk-rev">
                  <span><span className="mk-rev__k">2025</span> {l.lastYear}</span>
                  <span><span className="mk-rev__k">YTD</span> {l.ytd}</span>
                  <span className="mk-rev__yoy">{l.yoy}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="mk-foot">
            <button className="mk-btn mk-btn--soft" onClick={() => onToast("Message composer opened")}>Message</button>
            <button className="mk-btn mk-btn--solid" onClick={() => onToast("Access request sent")}>Request Access</button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`mk-card ${l.featured ? "mk-card--featured" : ""}`}>
      <div className="mk-media" style={{ height: 200 }}>
        <img src={l.image} alt={l.title} loading="lazy" />
        <MediaBadges l={l} />
      </div>
      <div className="mk-media__actions">{menu}</div>
      <div className="mk-body"><ListingContent l={l} /></div>
      {foot}
    </article>
  );
};

// ── filter section helpers ────────────────────────────────────────────
const FilterGroup = ({ title, children }) => (
  <div className="mk-fgroup">
    <div className="mk-fgroup__title">{title}</div>
    {children}
  </div>
);

const CheckRow = ({ checked, onChange, label, count, dot }) => (
  <label className="mk-check">
    <input type="checkbox" checked={checked} onChange={onChange} />
    {dot && <span className="mk-check__dot" style={{ background: dot }} />}
    <span>{label}</span>
    {count != null && <span className="mk-check__count">{count}</span>}
  </label>
);

const STATUS_DOT = { "Active": "#12B76A", "Coming Soon": "#F59E0B", "Offer Pending": "#2E6BE6", "Under Contract": "#7C4DDB" };

const MarketplaceView = ({ onToast, onManageListing }) => {
  const notify = onToast || (() => {});
  const [tab, setTab] = React.useState("discover");
  const [layout, setLayout] = React.useState("grid");
  const [sort, setSort] = React.useState("featured");

  const [q, setQ] = React.useState("");
  const [stateVal, setStateVal] = React.useState("");
  const [practiceTypes, setPracticeTypes] = React.useState(new Set());
  const [locationTypes, setLocationTypes] = React.useState(new Set());
  const [revBrackets, setRevBrackets] = React.useState(new Set());
  const [dvmBrackets, setDvmBrackets] = React.useState(new Set());
  const [statuses, setStatuses] = React.useState(new Set());

  const [saved, setSaved] = React.useState(new Set());
  const [hidden, setHidden] = React.useState(new Set());
  const [openMenu, setOpenMenu] = React.useState(null);

  const visible = React.useMemo(() => LISTINGS.filter(l => !hidden.has(l.id)), [hidden]);
  const countBy = (pred) => visible.filter(pred).length;

  const filtered = React.useMemo(() => {
    let list = visible.slice();
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(l => (l.title + l.description + l.state + l.practiceType + l.locationType).toLowerCase().includes(s));
    }
    if (stateVal) list = list.filter(l => l.state === stateVal);
    if (practiceTypes.size) list = list.filter(l => practiceTypes.has(l.practiceType));
    if (locationTypes.size) list = list.filter(l => locationTypes.has(l.locationType));
    if (statuses.size) list = list.filter(l => statuses.has(l.status));
    if (revBrackets.size) list = list.filter(l => MK_REVENUE_BRACKETS.some(b => revBrackets.has(b.id) && b.test(l.revenue)));
    if (dvmBrackets.size) list = list.filter(l => MK_DVM_BRACKETS.some(b => dvmBrackets.has(b.id) && b.test(l.dvms)));

    if (sort === "rev-desc") list.sort((a, b) => b.revenue - a.revenue);
    else if (sort === "rev-asc") list.sort((a, b) => a.revenue - b.revenue);
    else if (sort === "growth") list.sort((a, b) => yoyNum(b.yoy) - yoyNum(a.yoy));
    else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); // Featured: promoted listings first
    return list;
  }, [visible, q, stateVal, practiceTypes, locationTypes, statuses, revBrackets, dvmBrackets, sort]);

  const activeFilters = q || stateVal || practiceTypes.size || locationTypes.size || revBrackets.size || dvmBrackets.size || statuses.size;
  const clearAll = () => {
    setQ(""); setStateVal(""); setPracticeTypes(new Set()); setLocationTypes(new Set());
    setRevBrackets(new Set()); setDvmBrackets(new Set()); setStatuses(new Set());
  };

  const toggleSaved = (id) => { toggleInSet(setSaved)(id); notify(saved.has(id) ? "Removed from Saved" : "Saved to your list"); };
  const hideListing = (id) => { toggleInSet(setHidden)(id); notify("Listing hidden"); };

  const tabs = [
    { id: "discover", label: "Discover", count: visible.length },
    { id: "connected", label: "Connected", count: 0 },
    { id: "active", label: "Active", count: 0 },
    { id: "saved", label: "Saved", count: saved.size },
  ];

  const sidebar = (
    <aside className="mk-sidebar">
      <div className="mk-search">
        <Icon name="search" />
        <input placeholder="Search listings…" value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="mk-sidebar__head">
        <span className="mk-sidebar__title"><Icon name="slidersH" size={15} /> Filters</span>
        <button className="mk-clear" disabled={!activeFilters} onClick={clearAll}>Clear all</button>
      </div>

      <FilterGroup title="State">
        <div className="mk-select">
          <select value={stateVal} onChange={e => setStateVal(e.target.value)}>
            <option value="">All states</option>
            {MK_STATES.map(([ab, nm]) => <option key={ab} value={ab}>{nm}</option>)}
          </select>
          <Icon name="chevronDown" size={14} />
        </div>
      </FilterGroup>

      <FilterGroup title="Practice Type">
        {LISTING_PRACTICE_TYPES.map(t => (
          <CheckRow key={t} label={t} checked={practiceTypes.has(t)} count={countBy(l => l.practiceType === t)}
            onChange={() => toggleInSet(setPracticeTypes)(t)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Location Type">
        {LISTING_LOCATION_TYPES.map(t => (
          <CheckRow key={t} label={t} checked={locationTypes.has(t)} count={countBy(l => l.locationType === t)}
            onChange={() => toggleInSet(setLocationTypes)(t)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Revenue Range">
        {MK_REVENUE_BRACKETS.map(b => (
          <CheckRow key={b.id} label={b.label} checked={revBrackets.has(b.id)} count={countBy(l => b.test(l.revenue))}
            onChange={() => toggleInSet(setRevBrackets)(b.id)} />
        ))}
      </FilterGroup>

      <FilterGroup title="# of DVMs">
        {MK_DVM_BRACKETS.map(b => (
          <CheckRow key={b.id} label={b.label} checked={dvmBrackets.has(b.id)} count={countBy(l => b.test(l.dvms))}
            onChange={() => toggleInSet(setDvmBrackets)(b.id)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Status">
        {LISTING_STATUSES.map(s => (
          <CheckRow key={s} label={s} dot={STATUS_DOT[s]} checked={statuses.has(s)} count={countBy(l => l.status === s)}
            onChange={() => toggleInSet(setStatuses)(s)} />
        ))}
      </FilterGroup>
    </aside>
  );

  const emptyState = (icon, title, body) => (
    <div className="mk-empty">
      <div className="mk-empty__icon"><Icon name={icon} size={26} /></div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );

  const results = () => {
    if (tab === "connected") return emptyState("switchIcon", "No connections yet", "Practices you connect with will appear here once a seller accepts your request to access their listing.");
    if (tab === "active") return emptyState("activity", "No active deals", "Listings you're actively pursuing — with an inquiry, offer, or meeting in progress — will show up here.");
    if (tab === "saved") {
      const savedList = filtered.filter(l => saved.has(l.id));
      if (savedList.length === 0) return emptyState("heart", "Nothing saved yet", "Tap the heart on any listing to save it here for later.");
      return (
        <div className={layout === "grid" ? "mk-grid" : "mk-rows"}>
          {savedList.map(l => (
            <ListingCard key={l.id} l={l} layout={layout} saved onToast={notify}
              menuOpen={openMenu === l.id} onMenu={() => setOpenMenu(l.id)} onCloseMenu={() => setOpenMenu(null)}
              onSave={() => toggleSaved(l.id)} onHide={() => hideListing(l.id)} />
          ))}
        </div>
      );
    }
    if (filtered.length === 0) return emptyState("search", "No matching listings", "Try widening your filters or clearing the search to see more practices.");
    return (
      <div className={layout === "grid" ? "mk-grid" : "mk-rows"}>
        {filtered.map(l => (
          <ListingCard key={l.id} l={l} layout={layout} saved={saved.has(l.id)} onToast={notify}
            menuOpen={openMenu === l.id} onMenu={() => setOpenMenu(l.id)} onCloseMenu={() => setOpenMenu(null)}
            onSave={() => toggleSaved(l.id)} onHide={() => hideListing(l.id)} />
        ))}
      </div>
    );
  };

  const showResultsBar = tab === "discover" || (tab === "saved" && saved.size > 0);

  return (
    <div className="mk">
      <SubHeader crumbs={["Marketplace"]} title="Marketplace"
        subtitle="Browse veterinary practices for sale across the CareOwner platform."
        actions={<button className="co-btn-manage" onClick={onManageListing}><Icon name="store" size={14} /> Manage My Listing</button>} />

      <div className="mk-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`mk-tab ${tab === t.id ? "is-active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}{t.count > 0 && <span className="mk-tab__count">{t.count}</span>}
          </button>
        ))}
      </div>

      <div className="mk-layout">
        {sidebar}
        <div>
          {showResultsBar && (
            <div className="mk-toolbar">
              <div className="mk-count"><b>{tab === "saved" ? filtered.filter(l => saved.has(l.id)).length : filtered.length}</b> {(tab === "saved" ? "saved" : "")} {filtered.length === 1 ? "practice" : "practices"}</div>
              <div className="mk-toolbar__right">
                <div className="mk-sort">
                  <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="featured">Featured</option>
                    <option value="rev-desc">Revenue: High to Low</option>
                    <option value="rev-asc">Revenue: Low to High</option>
                    <option value="growth">Growth: YoY</option>
                  </select>
                  <Icon name="chevronDown" size={14} />
                </div>
                <div className="mk-view">
                  <button className={layout === "grid" ? "is-active" : ""} aria-label="Grid view" onClick={() => setLayout("grid")}><Icon name="grid" /></button>
                  <button className={layout === "list" ? "is-active" : ""} aria-label="List view" onClick={() => setLayout("list")}><Icon name="rows" /></button>
                </div>
              </div>
            </div>
          )}
          {results()}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { MarketplaceView });
