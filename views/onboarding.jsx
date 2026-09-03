// Seller Snapshot interview (/onboarding) — standalone flow, no app shell.
// Start screen → 13 questions in 5 sections → Coming Soon opt-in → confirmation.
// Answers persist to localStorage so the flow resumes where the seller left off.
(() => {

const SECTIONS = [
  { id: "selling", label: "Selling" },
  { id: "financials", label: "Financials" },
  { id: "team", label: "Team" },
  { id: "facility", label: "Facility" },
  { id: "software", label: "Software & Support" },
];

const NAMED_PIMS = { avimark: "AviMark", cornerstone: "Cornerstone", impromed: "ImproMed", pulse: "Pulse", ezyvet: "ezyVet" };
const NAMED_PAYROLL = { gusto: "Gusto", adp: "ADP", paychex: "Paychex", qbpayroll: "QuickBooks Payroll" };

const QUESTIONS = [
  {
    id: "reasons", section: 0, multi: true,
    title: "Why are you looking to sell your practice?",
    sub: "Tell us the reason(s) you are selling your practice. Select all that apply.",
    options: [
      { id: "retirement", label: "Retirement" },
      { id: "workless", label: "Want to work less, but still be involved" },
      { id: "relocating", label: "Relocating" },
      { id: "personal", label: "Personal or family reasons" },
      { id: "challenge", label: "Ready for a new challenge or opportunity" },
      { id: "partner", label: "Looking for a partner to help grow" },
      { id: "market", label: "It feels like the right time in the market" },
      { id: "else", label: "Something else" },
      { id: "nosay", label: "Prefer not to say", exclusive: true },
    ],
    why: "This is the first question nearly every buyer asks, and it shapes how they approach the deal. An owner retiring in two years and an owner looking for a growth partner are offering very different opportunities, and buyers respond to each differently. Your reason also helps us plan the right transition for you — how long you stay on, what your role looks like, and what happens to your team. You control how much of this appears on your listing, and you can change your answer anytime.",
  },
  {
    id: "timeline", section: 0,
    title: "When do you want your sale to be completed?",
    sub: "Tell us when, or if, you have a general timeline for when you want your sale to be completed.",
    options: [
      { id: "asap", label: "As soon as possible" },
      { id: "6mo", label: "Within the next 6 months" },
      { id: "6to12", label: "6–12 months from now" },
      { id: "1to2", label: "1–2 years out" },
      { id: "exploring", label: "Just exploring" },
    ],
    why: "This sets the pace of everything we do — buyers also filter by timeline, so it helps the right ones find you. Most practice sales take 6–12 months, but we're here to help you get started as soon as you're ready, and will guide you every step of the way.",
  },
  {
    id: "buyerType", section: 0, multi: true,
    title: "What kind of buyer would you want to sell to?",
    sub: "Choose all that interest you — you can change this anytime.",
    options: [
      { id: "team", label: "Someone on my team" },
      { id: "individual", label: "An outside veterinarian or individual buyer" },
      { id: "corporate", label: "A corporate group" },
      { id: "notsure", label: "Not sure yet — open to seeing who's interested", exclusive: true },
    ],
    why: "This lets us know what type of buyers we should recommend to you. It also lets buyers know if they're a good fit or not, so you only focus on potential buyers you're interested in.",
  },
  {
    id: "revenue", section: 1,
    title: "How much revenue does the practice bring in per year?",
    sub: "An average of the last few years is fine — we'll verify the exact numbers later from your accounting system.",
    options: [
      { id: "under750", label: "$0 – $749K" },
      { id: "750to2m", label: "$750K – $2M" },
      { id: "2to5m", label: "$2M – $5M" },
      { id: "over5m", label: "More than $5M" },
      { id: "notsure", label: "Not sure" },
    ],
    why: "This is one of the key metrics that buyers need to know. This range gives buyers a good starting point to determine interest before diving deeper into your financials. We'll help you fill out your practice's full financial overview inside the platform and ensure you have everything that a buyer will need to proceed with a sale.",
  },
  {
    id: "trend", section: 1,
    title: "How has business been trending the last few years?",
    sub: "Select the recent overall direction of your practice, generally speaking:",
    options: [
      { id: "growing", label: "Growing" },
      { id: "steady", label: "Holding steady" },
      { id: "declining", label: "Declining" },
      { id: "upanddown", label: "Up and down" },
    ],
    why: "Trend matters more to buyers than any single year. Your accounting data will confirm the exact numbers later — this just frames the story.",
  },
  {
    id: "vets", section: 2,
    title: "How many veterinarians work at the practice?",
    sub: "Including you, if you practice.",
    options: [
      { id: "justme", label: "Just me" },
      { id: "2to3", label: "2–3" },
      { id: "4to6", label: "4–6" },
      { id: "7plus", label: "7 or more" },
    ],
    why: "Doctor count is one of the top three things buyers look at. Later on, we'll add more details about each DVM, such as their full-time employment status, salary, production, experience, and more. We'll help you connect the tools or upload documents that can autopopulate most of this information.",
  },
  {
    id: "teamSize", section: 2,
    title: "And how big is the whole team?",
    sub: "Everyone — techs, assistants, front desk.",
    options: [
      { id: "under5", label: "Fewer than 5 people" },
      { id: "5to10", label: "5–10" },
      { id: "11to20", label: "11–20" },
      { id: "over20", label: "More than 20" },
      { id: "notsure", label: "Not sure exactly" },
    ],
    why: "Team size tells buyers what kind of operation this is. Later in the process, you can connect your tools or supply the documents that fill in details such as salary, benefits, hours, and more. We won't ask for names or personal details until much later in the process.",
  },
  {
    id: "production", section: 2,
    title: "How much of the production work do you personally handle?",
    sub: "Your share of appointments and production, roughly.",
    options: [
      { id: "most", label: "Most of it — 75% or more" },
      { id: "half", label: "More than half — 50–75%" },
      { id: "some", label: "Some of it — 25–50%" },
      { id: "small", label: "A small share — under 25%" },
      { id: "none", label: "I don't practice clinically" },
      { id: "notsure", label: "Not sure" },
    ],
    why: "Buyers want to know how the practice runs after you step back. A practice less dependent on its owner is often worth more — and if yours depends on you, a longer transition can offset that. We'll help you walk through your options once you're inside.",
  },
  {
    id: "building", section: 3,
    title: "What is your building's ownership status?",
    sub: "Whether you own or rent your space — you can add specifics later.",
    options: [
      { id: "personal", label: "I own it — it's in my name" },
      { id: "business", label: "The business owns it" },
      { id: "rent", label: "We rent or lease it" },
      { id: "notsure", label: "Not sure" },
    ],
    why: "Whether real estate is part of the deal changes which buyers are a fit and how offers get structured. If you rent, buyers also need to know more about the lease they will take over. Later, you can add financial terms, agreements, and other details.",
  },
  {
    id: "examRooms", section: 3,
    title: "How many exam rooms does your practice have?",
    sub: "Just count the rooms where you see patients — no need to include treatment or surgery areas.",
    options: [
      { id: "1to2", label: "1–2" },
      { id: "3to4", label: "3–4" },
      { id: "5to6", label: "5–6" },
      { id: "7plus", label: "7 or more" },
    ],
    why: "Room count gives buyers a quick sense of capacity and room to grow — one of the most common early questions they ask. Later, you can tell us more about your facility and upload photos that show off the space.",
  },
  {
    id: "accounting", section: 4,
    title: "What do you use for your accounting?",
    sub: "Tell us which accounting software or method you use to manage your practice's financials.",
    options: [
      { id: "quickbooks", label: "QuickBooks" },
      { id: "another", label: "Another platform", desc: "Other tools like Sage or Xero" },
      { id: "accountant", label: "My accountant handles it" },
      { id: "else", label: "Something else / not sure" },
    ],
    why: "Verified financials are what make buyers move fast. Once inside the platform, we'll give you the exact export or connection steps to make sure your financials can be synced and verified quickly.",
  },
  {
    id: "pims", section: 4,
    title: "Which system runs your practice?",
    sub: "Your PIMS (practice management software), if you use one.",
    options: [
      { id: "avimark", label: "AviMark" },
      { id: "cornerstone", label: "Cornerstone" },
      { id: "impromed", label: "ImproMed" },
      { id: "pulse", label: "Pulse" },
      { id: "ezyvet", label: "ezyVet" },
      { id: "different", label: "A different platform", desc: "Digitail, Shepherd, Vetspire, Provet, or other" },
      { id: "none", label: "I don't use a PIMS / I'm not sure" },
    ],
    why: "CareOwner connects directly with many PIMS platforms, allowing us to sync your relevant operations data, and share it with buyers when you're ready. Telling us which PIMS you use now allows us to help you connect your account to CareOwner quicker. And if your PIMS doesn't have a direct connection with CareOwner yet, or if you don't currently use a PIMS, we'll guide you through the entire process of getting your data into buyers' hands when they need it.",
  },
  {
    id: "payroll", section: 4,
    title: "Who handles payroll and HR?",
    sub: "What software you, your team, or your accountant uses to manage payroll.",
    options: [
      { id: "gusto", label: "Gusto" },
      { id: "adp", label: "ADP" },
      { id: "paychex", label: "Paychex" },
      { id: "qbpayroll", label: "QuickBooks Payroll" },
      { id: "accountant", label: "My accountant or bookkeeper runs it" },
      { id: "else", label: "Something else / not sure" },
    ],
    why: "Later in the process, buyers need team costs and benefits info. Knowing your payroll system means we can pull totals automatically instead of asking you to type them. If a service provider or team member is the one responsible for this information, you can give them account access once inside the platform so they can handle the details on your behalf.",
  },
];

const TREND_DETAILS = {
  growing: {
    title: "How would you describe the trend?",
    options: [
      { id: "steadily", label: "Steadily – a little each year", desc: "Roughly 1–5% per year" },
      { id: "noticeably", label: "Noticeably", desc: "Roughly 5–15% per year" },
      { id: "rapidly", label: "Rapidly", desc: "More than 15% per year" },
      { id: "busier", label: "Not sure of the numbers, but we're busier than ever" },
    ],
  },
  declining: {
    title: "How would you describe the trend?",
    options: [
      { id: "slightly", label: "Slightly", desc: "A few percent a year" },
      { id: "noticeably", label: "Noticeably", desc: "It's been a tougher couple of years" },
      { id: "notsure", label: "Not sure of the numbers, but it's slowed down" },
    ],
  },
};

const ACCESS_OPTIONS = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
  { id: "unsure", label: "I'm not sure" },
];

const STORE_KEY = "co.onboarding.v1";
const loadSaved = () => {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
};

// ---------- Small pieces ----------

const ObHeader = () => (
  <div className="ob-header">
    <img src={assetUrl("assets/careowner-logo-lightbg.svg")} alt="CareOwner" />
  </div>
);

const ObLater = () => (
  <div className="ob-later">
    <button onClick={() => navigateTo("/practice")}>I'll do this later</button>
  </div>
);

// One answer row. Multi-select rows get a rounded-square checkbox; single-select
// rows are just the answer inside the container.
const ObOption = ({ selected, onClick, label, desc, showBox }) => (
  <button type="button" className={`ob-opt ${selected ? "is-selected" : ""}`} onClick={onClick} aria-pressed={selected}>
    {showBox && <span className="ob-opt__cb">{selected && <Icon name="check" size={13} />}</span>}
    <span>
      <span className="ob-opt__label">{label}</span>
      {desc && <span className="ob-opt__desc">{desc}</span>}
    </span>
  </button>
);

const ObNote = ({ children }) => (
  <div className="ob-note">
    <Icon name="sparkles" size={17} />
    <span>{children}</span>
  </div>
);

const ObSteps = ({ qIndex }) => {
  const currentSection = QUESTIONS[qIndex].section;
  return (
    <div className="ob-steps">
      {SECTIONS.map((s, si) => {
        const qs = QUESTIONS.map((q, i) => ({ q, i })).filter(x => x.q.section === si);
        const done = si < currentSection;
        const active = si === currentSection;
        return (
          <div key={s.id} className={`ob-step ${active ? "is-active" : ""} ${done ? "is-done" : ""}`}>
            <span className="ob-step__dot">{done ? <Icon name="check" size={13} /> : si + 1}</span>
            <span className="ob-step__label">{s.label}</span>
            <span className="ob-step__bars">
              {qs.map(x => (
                <span key={x.i} className={`ob-step__bar ${x.i <= qIndex ? "is-done" : ""}`} />
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ---------- Screens ----------

const StartScreen = ({ onBegin }) => (
  <div className="ob-wrap">
    <div className="ob-banner">
      <span className="ob-banner__check"><Icon name="check" size={12} /></span>
      <div>
        <div className="ob-banner__title">Your account has been created and is being reviewed.</div>
        <div className="ob-banner__body">Our team reviews every new account, usually within a business day. We'll email you the moment it's approved.</div>
      </div>
    </div>
    <div className="ob-card">
      <div className="ob-start">
        <div className="ob-eyebrow">Let's get to know your practice (5 minutes)</div>
        <h1>Start your practice snapshot</h1>
        <p>While your account is being reviewed, help us fill out your practice snapshot by answering a few quick questions about your practice, your team, and your goals. Your answers build the first draft of your practice profile, and at the end you'll see a preview of how your practice could appear to buyers.</p>
        <p>All answers are confidential by default. We'll never share details about your practice to buyers unless you specifically give permission.</p>
      </div>
      <div className="ob-cardfoot">
        <button className="ob-cta" onClick={onBegin}>Let's begin <Icon name="arrowRight" size={16} /></button>
        <div className="ob-cardfoot__note">Your answers save automatically — you can leave and pick up where you left off anytime.</div>
      </div>
    </div>
    <ObLater />
  </div>
);

const QuestionScreen = ({ qIndex, answers, setAnswer, onPrev, onNext }) => {
  const q = QUESTIONS[qIndex];
  const a = answers[q.id] || {};
  const followRef = React.useRef(null);

  // Which follow-up (if any) the current answer surfaces. When it changes, the
  // card grows and we scroll the page down to reveal the new question — the
  // container itself never scrolls internally.
  const followKey = React.useMemo(() => {
    if (q.id === "reasons") return (a.ids || []).includes("else") ? "reasons:else" : null;
    if (q.id === "trend") return TREND_DETAILS[a.id] ? "trend:" + a.id : null;
    if (q.id === "accounting") return a.id ? "accounting:" + a.id : null;
    if (q.id === "pims") return a.id ? "pims:" + a.id : null;
    if (q.id === "payroll") return a.id ? "payroll:" + a.id : null;
    return null;
  }, [q.id, a.ids, a.id]);

  React.useEffect(() => {
    if (followKey && followRef.current) {
      followRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [followKey]);

  const toggleMulti = (opt) => {
    let ids = a.ids || [];
    if (ids.includes(opt.id)) {
      ids = ids.filter(x => x !== opt.id);
    } else if (opt.exclusive) {
      ids = [opt.id];
    } else {
      ids = [...ids.filter(id => !(q.options.find(o => o.id === id) || {}).exclusive), opt.id];
    }
    const next = { ...a, ids };
    if (!ids.includes("else")) delete next.other;
    setAnswer(q.id, next);
  };

  // Picking a new primary answer drops any follow-up state (trend detail,
  // platform name, access answer) so stale sub-answers never linger.
  const pickSingle = (opt) => setAnswer(q.id, { id: opt.id });

  const canContinue = () => {
    if (q.multi) { if (!(a.ids || []).length) return false; }
    else if (!a.id) return false;
    if (q.id === "trend" && TREND_DETAILS[a.id]) return !!a.detail;
    if (q.id === "accounting" && (a.id === "quickbooks" || a.id === "another")) return !!a.access;
    if (q.id === "pims" && NAMED_PIMS[a.id]) return !!a.access;
    return true;
  };

  const accessQuestion = (toolName) => (
    <>
      <h2 className="ob-qtitle" style={{ marginBottom: 16 }}>Do you have access to your practice's {toolName} account?</h2>
      <div className="ob-opts" style={{ marginTop: 0 }}>
        {ACCESS_OPTIONS.map(o => (
          <ObOption key={o.id} label={o.label} selected={a.access === o.id} onClick={() => setAnswer(q.id, { ...a, access: o.id })} />
        ))}
      </div>
    </>
  );

  const renderFollowUp = () => {
    if (!followKey) return null;

    if (q.id === "reasons") {
      return (
        <div className="ob-followup" ref={followRef}>
          <h2 className="ob-qtitle" style={{ marginBottom: 12 }}>Tell us more, if you'd like</h2>
          <div className="ob-freetext">
            <input
              type="text"
              placeholder="What else is behind your decision to sell? (optional)"
              value={a.other || ""}
              onChange={e => setAnswer(q.id, { ...a, other: e.target.value })}
            />
          </div>
        </div>
      );
    }

    if (q.id === "trend") {
      const detail = TREND_DETAILS[a.id];
      return (
        <div className="ob-followup" ref={followRef}>
          <h2 className="ob-qtitle" style={{ marginBottom: 16 }}>{detail.title}</h2>
          <div className="ob-opts" style={{ marginTop: 0 }}>
            {detail.options.map(o => (
              <ObOption key={o.id} label={o.label} desc={o.desc} selected={a.detail === o.id} onClick={() => setAnswer(q.id, { ...a, detail: o.id })} />
            ))}
          </div>
        </div>
      );
    }

    if (q.id === "accounting") {
      if (a.id === "quickbooks") return (
        <div className="ob-followup" ref={followRef}>
          <ObNote>Great! CareOwner connects directly with QuickBooks so once inside, we'll be able to pull your production data, services and client numbers automatically. Don't worry, we never change anything in your system, and buyers will only see your financial data with your permission.</ObNote>
          {accessQuestion("QuickBooks")}
        </div>
      );
      if (a.id === "another") {
        const name = (a.platform || "").trim();
        return (
          <div className="ob-followup" ref={followRef}>
            <h2 className="ob-qtitle" style={{ marginBottom: 12 }}>What accounting software do you use?</h2>
            <div className="ob-freetext" style={{ marginBottom: 26 }}>
              <input
                type="text"
                placeholder="Enter the name of your accounting software"
                value={a.platform || ""}
                onChange={e => setAnswer(q.id, { ...a, platform: e.target.value })}
              />
            </div>
            {accessQuestion(name || "accounting software")}
          </div>
        );
      }
      if (a.id === "accountant") return (
        <div className="ob-followup" ref={followRef}>
          <ObNote>No problem. You'll be able to invite your accountant to CareOwner so they can provide us with everything we need.</ObNote>
        </div>
      );
      return (
        <div className="ob-followup" ref={followRef}>
          <ObNote>No problem. We'll help you gather everything you need inside the platform.</ObNote>
        </div>
      );
    }

    if (q.id === "pims") {
      const named = NAMED_PIMS[a.id];
      if (named) return (
        <div className="ob-followup" ref={followRef}>
          <ObNote>Great! CareOwner connects directly with {named} so once inside, we'll be able to pull your production data, services and client numbers automatically. Don't worry, we never change anything in your system, and client names never reach buyers.</ObNote>
          {accessQuestion(named)}
        </div>
      );
      if (a.id === "different") {
        const name = (a.platform || "").trim();
        return (
          <div className="ob-followup" ref={followRef}>
            <h2 className="ob-qtitle" style={{ marginBottom: 12 }}>What platform runs your practice?</h2>
            <div className="ob-freetext" style={{ marginBottom: 22 }}>
              <input
                type="text"
                placeholder="Enter the name of your PIMS"
                value={a.platform || ""}
                onChange={e => setAnswer(q.id, { ...a, platform: e.target.value })}
              />
            </div>
            <ObNote>CareOwner doesn't have a direct connection with {name || "your platform"} (yet), but we'll walk you through the process of uploading your exported data.</ObNote>
          </div>
        );
      }
      return (
        <div className="ob-followup" ref={followRef}>
          <ObNote>No problem. We'll help you gather everything you need inside the platform.</ObNote>
        </div>
      );
    }

    if (q.id === "payroll") {
      const named = NAMED_PAYROLL[a.id];
      if (named) return (
        <div className="ob-followup" ref={followRef}>
          <ObNote>Great! CareOwner connects directly with {named} so once inside, we'll be able to pull your team member and payroll details automatically. Don't worry, we never change anything in your system, and buyers will only see your payroll details once you grant them access later in the sales process.</ObNote>
        </div>
      );
      if (a.id === "accountant") return (
        <div className="ob-followup" ref={followRef}>
          <ObNote>You'll be able to invite your accountant or bookkeeper to CareOwner so they can provide us with everything we need.</ObNote>
        </div>
      );
      return (
        <div className="ob-followup" ref={followRef}>
          <ObNote>No problem. We'll help you gather everything you need inside the platform.</ObNote>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="ob-wrap ob-wrap--question">
      <div className="ob-card">
        <ObSteps qIndex={qIndex} />
        <div className="ob-qbody">
          <div className="ob-qmain">
            <div className="ob-qcount">Question {qIndex + 1}/{QUESTIONS.length}</div>
            <h2 className="ob-qtitle">{q.title}</h2>
            <p className="ob-qsub">{q.sub}</p>
            <div className="ob-opts">
              {q.options.map(o => (
                <ObOption
                  key={o.id}
                  label={o.label}
                  desc={o.desc}
                  showBox={q.multi}
                  selected={q.multi ? (a.ids || []).includes(o.id) : a.id === o.id}
                  onClick={() => (q.multi ? toggleMulti(o) : pickSingle(o))}
                />
              ))}
            </div>
            {renderFollowUp()}
            <div className="ob-qfoot">
              {qIndex > 0
                ? <button className="ob-btn-prev" onClick={onPrev}><Icon name="arrowLeft" size={16} /> Previous</button>
                : <span />}
              <button className="ob-cta ob-cta--continue" disabled={!canContinue()} onClick={onNext}>
                Continue <Icon name="arrowRight" size={16} />
              </button>
            </div>
          </div>
          <aside className="ob-why">
            <div className="ob-why__title"><Icon name="info" size={16} /> Why we ask</div>
            <p>{q.why}</p>
          </aside>
        </div>
      </div>
      <ObLater />
    </div>
  );
};

const ComingSoonScreen = ({ answers, optIn, setOptIn, onPrev, onComplete }) => {
  const optLabel = (qid, oid) => {
    const q = QUESTIONS.find(x => x.id === qid);
    const o = q && q.options.find(x => x.id === oid);
    return o ? o.label : null;
  };
  const facts = [];
  const rev = answers.revenue && answers.revenue.id !== "notsure" ? optLabel("revenue", answers.revenue.id) : null;
  if (rev) facts.push(rev + " revenue");
  const vets = answers.vets ? optLabel("vets", answers.vets.id) : null;
  if (vets) facts.push(answers.vets.id === "justme" ? "1 veterinarian" : vets + " veterinarians");
  const tl = answers.timeline ? optLabel("timeline", answers.timeline.id) : null;
  if (tl) facts.push(tl);

  return (
    <div className="ob-wrap">
      <div className="ob-card">
        <div className="ob-cs">
          <div className="ob-cs__head">
            <div className="ob-eyebrow">One last thing</div>
            <h1>Let buyers know your practice listing is coming soon</h1>
            <p>Show your practice as "Coming Soon" on the CareOwner listing marketplace while you finish your full profile — completely anonymous, and with zero obligation.</p>
          </div>

          <div className="ob-preview">
            <div className="ob-preview__imgwrap">
              <div className="ob-preview__img" style={{ backgroundImage: `url(${assetUrl("assets/practice-exterior.jpg")})` }} />
              <span className="ob-preview__tag">Coming Soon</span>
            </div>
            <div className="ob-preview__body">
              <div className="ob-preview__name">Established Veterinary Practice</div>
              <div className="ob-preview__loc">General practice · Midwest</div>
              <div className="ob-preview__facts">
                {facts.map(f => <span key={f} className="ob-preview__fact">{f}</span>)}
              </div>
            </div>
          </div>

          <div className="ob-cs__cols">
            <div className="ob-cs__col">
              <h3><Icon name="eye" size={15} /> For buyers</h3>
              <ul>
                <li>They see an anonymized preview of your practice — region, practice type, revenue range, doctor count, and timeline. Just enough to pique their interest.</li>
                <li>They can save your listing or sign up to be alerted the moment it goes live — but they can't contact you yet.</li>
              </ul>
            </div>
            <div className="ob-cs__col">
              <h3><Icon name="heart" size={15} /> For you</h3>
              <ul>
                <li>Your listing starts building interest while you finish setup — so you launch to a waiting audience instead of starting from zero.</li>
                <li>Stay anonymous, with no commitment — take the preview down anytime.</li>
              </ul>
            </div>
          </div>

          <div className="ob-hiw">
            <h3><Icon name="list" size={15} /> How it works</h3>
            <div className="ob-hiw__steps">
              <div className="ob-hiw__step"><span className="ob-hiw__num">1</span> Launch your preview listing.</div>
              <div className="ob-hiw__step"><span className="ob-hiw__num">2</span> Buyers see your anonymized practice details immediately and can subscribe to alerts for the real launch.</div>
              <div className="ob-hiw__step"><span className="ob-hiw__num">3</span> You have up to 90 days to finish your profile and go live — we'll help the whole way.</div>
            </div>
            <p className="ob-hiw__after">When you launch, everyone who saved or signed up gets notified. (If the 90 days pass, your preview just comes off the marketplace — nothing is lost, and finishing puts you back on.)</p>
          </div>

          <div className="ob-opts" style={{ marginTop: 0 }}>
            <ObOption
              showBox
              selected={optIn}
              onClick={() => setOptIn(!optIn)}
              label="Yes, I want to generate early interest by showing buyers a preview of my listing."
            />
          </div>
          <p className="ob-optin-note">You'll be able to review your details and confirm the launch once your account is approved.</p>

          <div className="ob-qfoot">
            <button className="ob-btn-prev" onClick={onPrev}><Icon name="arrowLeft" size={16} /> Previous</button>
            <button className="ob-cta ob-cta--continue" onClick={onComplete}>Complete my practice snapshot <Icon name="arrowRight" size={16} /></button>
          </div>
        </div>
      </div>
      <ObLater />
    </div>
  );
};

const ConfirmScreen = ({ answers, optIn }) => {
  const acct = answers.accounting || {};
  const pims = answers.pims || {};
  const payroll = answers.payroll || {};
  const building = answers.building || {};

  const acctName = acct.id === "quickbooks" ? "QuickBooks" : acct.id === "another" ? (acct.platform || "").trim() : null;
  const pimsName = NAMED_PIMS[pims.id] || (pims.id === "different" ? (pims.platform || "").trim() : null);
  const accountantInvolved = acct.id === "accountant" || payroll.id === "accountant";

  // "What happens next" step 2 — name the tools they told us about, or the
  // person responsible, and fall back to a generic line.
  const tools = [acctName, pimsName].filter(Boolean);
  const connectParts = [];
  if (tools.length) connectParts.push("connect " + tools.join(" and "));
  if (accountantInvolved) connectParts.push("invite the person responsible for providing more details");
  const nextStep2 = connectParts.length
    ? `When you're back, we'll help you ${connectParts.join(", and ")} so your profile can begin taking shape.`
    : "When you're back, we'll help you gather everything you need so your profile can begin taking shape.";

  // "What to gather" is dynamic: skip login items when a provider handles that
  // system, and match the lease/mortgage line to their building answer.
  const gather = [];
  if (acctName && acct.id !== "accountant") gather.push(<><b>Login access to {acctName}</b> — connecting it will just take a few clicks</>);
  if (pimsName) gather.push(<><b>Login access to {pimsName}</b> — this fills in your clients, services, and production automatically</>);
  gather.push(<><b>Your last 2–3 years of financial statements and tax returns</b></>);
  gather.push(
    building.id === "rent"
      ? <><b>Your lease details for the building</b></>
      : (building.id === "personal" || building.id === "business")
        ? <><b>Your mortgage or ownership details for the building</b></>
        : <><b>Your lease or mortgage details for the building</b></>
  );
  gather.push(<><b>The name and email of anyone helping you</b> — your accountant, bookkeeper, or office manager</>);
  gather.push(<><b>A few photos of your practice</b> — buyers look at these first</>);

  return (
    <div className="ob-wrap">
      <div className="ob-card">
        <div className="ob-confirm">
          <div className="ob-confirm__head">
            <span className="ob-confirm__icon"><Icon name="check" size={26} /></span>
            <h1>Nice work — your practice snapshot is saved</h1>
            <p>Every answer you gave has been captured, and your practice profile now has its first draft. Our team has received your account request and will notify you when it's approved. We review every new account, and it usually takes less than a business day.</p>
          </div>

          {optIn && (
            <div className="ob-confirm__optin">
              <ObNote>Your preview listing is ready — you'll confirm the details and launch it as soon as your account is approved.</ObNote>
            </div>
          )}

          <div className="ob-confirm__section">
            <h3>What happens next</h3>
            <div className="ob-hiw__steps">
              <div className="ob-hiw__step"><span className="ob-hiw__num">1</span> We'll email you the moment your account is approved.</div>
              <div className="ob-hiw__step"><span className="ob-hiw__num">2</span> {nextStep2}</div>
            </div>
          </div>

          <div className="ob-confirm__section">
            <h3>What to gather before you come back</h3>
            <p className="ob-confirm__lede">None of this is required to get started, but having it handy makes your next visit much faster.</p>
            <div className="ob-gather">
              {gather.map((g, i) => (
                <div key={i} className="ob-gather__item"><span className="ob-gather__box" /> <span>{g}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="ob-cardfoot">
          <div className="ob-cardfoot__note" style={{ marginTop: 0 }}>Everything you entered is saved to your account. The link in your approval email will take you straight to your dashboard.</div>
        </div>
      </div>
    </div>
  );
};

// ---------- Root ----------

const OnboardingView = () => {
  const saved = React.useMemo(loadSaved, []);
  const [screen, setScreen] = React.useState("start"); // start | q | coming-soon | confirm
  const [qIndex, setQIndex] = React.useState(typeof saved.qIndex === "number" ? saved.qIndex : 0);
  const [answers, setAnswers] = React.useState(saved.answers || {});
  const [optIn, setOptIn] = React.useState(!!saved.optIn);

  React.useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ answers, optIn, qIndex, screen })); } catch (e) {}
  }, [answers, optIn, qIndex, screen]);

  React.useEffect(() => { window.scrollTo(0, 0); }, [screen, qIndex]);

  const setAnswer = (qid, val) => setAnswers(prev => ({ ...prev, [qid]: val }));

  // "Let's begin" resumes a half-finished interview (answers persist locally);
  // a completed run starts over from question 1 with prior answers pre-filled.
  const begin = () => {
    if (saved.screen === "coming-soon") setScreen("coming-soon");
    else {
      if (saved.screen === "confirm") setQIndex(0);
      setScreen("q");
    }
  };

  return (
    <div className="ob-page">
      <ObHeader />
      {screen === "start" && <StartScreen onBegin={begin} />}
      {screen === "q" && (
        <QuestionScreen
          qIndex={qIndex}
          answers={answers}
          setAnswer={setAnswer}
          onPrev={() => setQIndex(i => Math.max(0, i - 1))}
          onNext={() => (qIndex < QUESTIONS.length - 1 ? setQIndex(qIndex + 1) : setScreen("coming-soon"))}
        />
      )}
      {screen === "coming-soon" && (
        <ComingSoonScreen
          answers={answers}
          optIn={optIn}
          setOptIn={setOptIn}
          onPrev={() => { setScreen("q"); setQIndex(QUESTIONS.length - 1); }}
          onComplete={() => setScreen("confirm")}
        />
      )}
      {screen === "confirm" && <ConfirmScreen answers={answers} optIn={optIn} />}
    </div>
  );
};

window.OnboardingView = OnboardingView;

})();
