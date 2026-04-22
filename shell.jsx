// Shell components: TopNav, SubHeader, LeftRail, RightRail, Modal, Toast, Switch

const TopNav = ({ active, onNav, textSize, onTextSize }) => {
  const items = [
    { id: "home", label: "Home", icon: "home" },
    { id: "practice", label: "My Practice", icon: "stethoscope" },
    { id: "buyers", label: "Find Buyers", icon: "switchIcon" },
    { id: "inquiries", label: "Inquiries", icon: "inbox" },
    { id: "offers", label: "Offers", icon: "dollarSign" },
    { id: "messages", label: "Messages", icon: "message" },
    { id: "meetings", label: "Meetings", icon: "calendar" },
  ];
  return (
    <nav className="co-nav">
      <CareOwnerLogo />
      <div className="co-nav__tabs">
        {items.map(it => (
          <button key={it.id} className={`co-nav__tab ${active === it.id ? "is-active" : ""}`} onClick={() => onNav(it.id)}>
            <Icon name={it.icon} size={16} />
            {it.label}
          </button>
        ))}
      </div>
      <div className="co-nav__right">
        <div className="co-text-size" title="Text size">
          {["sm","md","lg"].map(s => (
            <button key={s} className={textSize === s ? "is-active" : ""} onClick={() => onTextSize(s)}>A</button>
          ))}
        </div>
        <button className="co-avatar-chip">
          <span className="co-avatar">DS</span>
          <Icon name="chevronDown" size={14} />
        </button>
      </div>
    </nav>
  );
};

const SubHeader = ({ crumbs, title, actions }) => (
  <div className="co-sub">
    <div className="co-sub__wrap">
      <div>
        <div className="co-crumb">
          <Icon name="home" size={14} />
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              <Icon name="chevronRight" size={12} />
              {i === crumbs.length - 1
                ? <span className="co-crumb__current">{c}</span>
                : <a href="#">{c}</a>}
            </React.Fragment>
          ))}
        </div>
        <h1>{title}</h1>
      </div>
      <div className="co-sub__actions">{actions}</div>
    </div>
  </div>
);

const Switch = ({ on, onChange, label }) => (
  <div className="co-identity__public">
    <span>{label}</span>
    <button className={`co-switch ${on ? "is-on" : ""}`} onClick={() => onChange(!on)} aria-pressed={on} />
  </div>
);

const Modal = ({ title, children, onClose, footer }) => {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="co-modal-backdrop" onClick={onClose}>
      <div className="co-modal" onClick={e => e.stopPropagation()}>
        <div className="co-modal__header">
          <h2>{title}</h2>
          <button className="co-modal__close" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="co-modal__body">{children}</div>
        {footer && <div className="co-modal__footer">{footer}</div>}
      </div>
    </div>
  );
};

const Toast = ({ message }) => (
  <div className="co-toast">
    <Icon name="check" size={16} />
    {message}
  </div>
);

const LeftRail = ({ section, onSection }) => {
  const items = [
    { id: "overview", label: "Overview", icon: "home" },
    { id: "financials", label: "Financials", icon: "dollarSign" },
    { id: "operations", label: "Operations", icon: "activity" },
    { id: "services", label: "Services", icon: "settings" },
    { id: "facilities", label: "Facilities", icon: "building" },
    { id: "team", label: "Team", icon: "users" },
    { id: "documents", label: "Documents", icon: "fileText" },
    { id: "reviews", label: "Reviews", icon: "star" },
    { id: "questions", label: "Questions", icon: "helpCircle" },
    { id: "meetings", label: "Meetings", icon: "calendar" },
  ];
  return (
    <aside className="co-rail">
      <div className="co-rail__card">
        <div className="co-rail__header">
          <div className="co-rail__header-logo" style={{ backgroundImage: "url(assets/practice-hero.jpg)" }} />
          <div className="co-rail__header-text">
            <div className="co-rail__header-name">AnimalCare</div>
            <div className="co-rail__header-sub">Lakeside, IL</div>
          </div>
          <Icon name="chevronsUpDown" size={16} />
        </div>
        {items.map(it => (
          <button key={it.id} className={`co-rail__item ${section === it.id ? "is-active" : ""}`} onClick={() => onSection(it.id)}>
            <Icon name={it.icon} size={16} />
            {it.label}
          </button>
        ))}
      </div>
      <div className="co-help">
        <h3><Icon name="helpCircle" /> Need Help?</h3>
        <div className="co-help__item">
          <div className="co-help__icon"><Icon name="book" /></div>
          <div>
            <div className="co-help__title">Documentation</div>
            <div className="co-help__desc">How-to guides and FAQs</div>
            <a className="co-help__link" href="#">View Docs →</a>
          </div>
        </div>
        <div className="co-help__item">
          <div className="co-help__icon"><Icon name="headphones" /></div>
          <div>
            <div className="co-help__title">Support Team</div>
            <div className="co-help__desc">Get help from our experts</div>
            <a className="co-help__link" href="#">Contact Support →</a>
          </div>
        </div>
        <div className="co-help__item">
          <div className="co-help__icon"><Icon name="video" /></div>
          <div>
            <div className="co-help__title">Video Tutorials</div>
            <div className="co-help__desc">Watch how-to videos</div>
            <a className="co-help__link" href="#">Watch Now →</a>
          </div>
        </div>
      </div>
    </aside>
  );
};

Object.assign(window, { TopNav, SubHeader, Switch, Modal, Toast, LeftRail });
