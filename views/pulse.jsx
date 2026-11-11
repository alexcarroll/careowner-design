// CareOwner — Owner (non-seller) version, internal codename "Pulse".
// A separate prototype mounted at /pulse that reuses the seller app's shell classes
// and design system. One global switch, "Future Seller", reframes every page from
// "dollars of annual profit" (off, the default) to "dollars of practice value" (on).
//
// View scripts share one global scope under in-browser Babel, so everything lives in
// an IIFE and only PulseApp is exposed.
(function () {
  const { useState, useEffect } = React;

  /* ------------------------------------------------------------------ data */

  const OWNER = { name: "Dr. Nate Ramirez", first: "Nate", initials: "NR" };
  const CLINIC = { name: "Cedar Hollow Veterinary Clinic", location: "Beaverton, OR" };
  const PEER_GROUP = "212 single-DVM companion animal practices in the West";
  const PERIOD = "October 2026";

  // lo/hi = the middle half of the peer group. hb = higher is better.
  const METRICS = {
    revenue: { label: "Revenue", value: "$104.2K", delta: "+3.1% vs. September", dir: "up", good: true, peer: "$1.21M a year · peers $680K–$1.05M", you: 1210, lo: 680, hi: 1050, min: 400, max: 1400, hb: true, spark: [96, 101, 94, 92, 99, 102, 104, 106, 103, 108, 101, 104], page: "financials" },
    margin: { label: "True profit margin", value: "10.8%", delta: "+0.4 pts vs. September", dir: "up", good: true, peer: "Peers 11.5%–15.5%", you: 10.8, lo: 11.5, hi: 15.5, min: 4, max: 20, hb: true, spark: [9.6, 9.9, 9.4, 9.8, 10.1, 10.3, 10.2, 10.6, 10.5, 10.9, 10.4, 10.8], page: "financials" },
    visits: { label: "Visits", value: "512", delta: "−2.4% vs. September", dir: "down", good: false, peer: "Peers 470–560 a month", you: 512, lo: 470, hi: 560, min: 380, max: 640, hb: true, spark: [498, 520, 489, 476, 510, 522, 531, 540, 518, 536, 525, 512], page: "operations" },
    act: { label: "Average transaction", value: "$203", delta: "+1.5% vs. September", dir: "up", good: true, peer: "Peers $205–$228", you: 203, lo: 205, hi: 228, min: 170, max: 250, hb: true, spark: [193, 194, 192, 193, 194, 195, 196, 196, 199, 201, 200, 203], page: "operations" },
    staff: { label: "Staff cost", value: "24.8%", delta: "No change vs. September", dir: "flat", good: null, peer: "Share of revenue · peers 20.5%–23.5%", you: 24.8, lo: 20.5, hi: 23.5, min: 16, max: 30, hb: false, spark: [24.1, 24.3, 25.2, 25.4, 24.9, 24.6, 24.5, 24.4, 24.9, 24.3, 24.8, 24.8], page: "financials" },
    newClients: { label: "New clients", value: "38", delta: "−3 vs. September", dir: "down", good: false, peer: "Peers 36–52 a month", you: 38, lo: 36, hi: 52, min: 20, max: 66, hb: true, spark: [41, 44, 39, 36, 40, 43, 45, 47, 42, 44, 41, 38], page: "operations" },
  };
  const DASH_KPIS = ["revenue", "margin", "visits", "act", "staff", "newClients"];

  const OPS_ROWS = [
    { id: "visits", name: "Visits", sub: "Per month", value: "512", trend: "−2.4%", you: 512, lo: 470, hi: 560, min: 380, max: 640, hb: true },
    { id: "active", name: "Active clients", sub: "Seen in the last 18 months", value: "2,140", trend: "+1.1%", you: 2140, lo: 1500, hi: 2100, min: 1000, max: 2600, hb: true },
    { id: "new", name: "New clients", sub: "Per month", value: "38", trend: "−3", you: 38, lo: 36, hi: 52, min: 20, max: 66, hb: true },
    { id: "act", name: "Average transaction", sub: "Revenue per invoice", value: "$203", trend: "+1.5%", you: 203, lo: 205, hi: 228, min: 170, max: 250, hb: true },
    { id: "rebook", name: "Rebooking rate", sub: "Visits that leave with the next one booked", value: "54%", trend: "−7 pts this year", you: 54, lo: 57, hi: 68, min: 40, max: 80, hb: true },
    { id: "retention", name: "Client retention", sub: "Clients who came back within 12 months", value: "78%", trend: "+1 pt", you: 78, lo: 70, hi: 79, min: 55, max: 90, hb: true, driver: true },
    { id: "tech", name: "Technician-led appointments", sub: "Share of all appointments", value: "6%", trend: "No change", you: 6, lo: 11, hi: 19, min: 0, max: 26, hb: true },
    { id: "fill", name: "Schedule fill", sub: "Your booked hours ÷ available hours", value: "93%", trend: "+2 pts", you: 93, lo: 78, hi: 90, min: 60, max: 100, hb: true, note: "Full. Little room to grow without more doctor hours." },
    { id: "recurring", name: "Recurring revenue", sub: "Wellness plans and subscriptions", value: "4%", trend: "No change", you: 4, lo: 6, hi: 14, min: 0, max: 20, hb: true, driver: true },
  ];

  const CHANGES = [
    { tone: "good", icon: "trendUp", title: "Revenue up $3.1K", why: "Dental month promotion: 14 more dental procedures than September, at an average of $410 each.", page: "financials" },
    { tone: "bad", icon: "alertTriangle", title: "Cost of goods up 1.2 points, to 27.4% of revenue", why: "Your distributor raised prices on Sept 15. 23 items in ezyVet still carry the old price.", page: "opportunities" },
    { tone: "bad", icon: "trendDown", title: "Visits down 2.4%", why: "You were closed two Saturdays, and fewer clients left with their next visit booked (54%, from 61% in January).", page: "operations" },
    { tone: "neutral", icon: "minus", title: "Payroll unchanged at $25.8K", why: "No overtime this month. Staff cost stays above similar practices at 24.8% of revenue.", page: "financials" },
  ];

  const OPPS = [
    { id: "fees", title: "Bring 23 fees up to regional levels", profit: 31000, value: 160000, effort: "Low effort", time: "About 2 hours", driver: "Profit margin",
      evidence: "23 of your 50 most-used services are priced 8–15% below similar practices within 25 miles. Your exam fee is $68; the regional median is $76.",
      step: "Review the suggested fee list and apply it in ezyVet.", status: "todo", owner: "Nate" },
    { id: "recall", title: "Bring back 214 overdue patients", profit: 24000, value: 125000, effort: "Low effort", time: "Front desk, 3 weeks", driver: "Client retention",
      evidence: "214 active patients are three or more months past due for a wellness visit. Your rebooking rate fell from 61% to 54% this year.",
      step: "Send the prepared reminder list by text and email, then call the top 40.", status: "progress", owner: "Maria", progress: { pct: 29, text: "62 of 214 booked · $7.1K so far" } },
    { id: "tech", title: "Move routine visits to technician appointments", profit: 19000, value: 100000, effort: "Medium effort", time: "Schedule change", driver: "Owner dependence",
      evidence: "6% of your appointments are technician-led, against 15% at similar practices. Boosters, nail trims and suture removals take about 5 of your hours a week.",
      step: "Open 6 technician slots a week and route booster visits to them.", status: "todo", owner: "Unassigned" },
    { id: "associate", title: "Hire a part-time associate, 2 days a week", profit: 14000, value: 280000, effort: "High effort", time: "3–6 months", driver: "Owner dependence",
      evidence: "You produce 100% of doctor revenue and your schedule is 93% full. A second doctor adds capacity now. Buyers pay 6–7.5× profit for two-doctor practices, against 3.5–6× for solo ones.",
      step: "Model the hire: pay, break-even month and schedule.", status: "todo", owner: "Nate", profitNote: "in year one, after ramp-up" },
    { id: "vendor", title: "Renegotiate your lab and distributor contracts", profit: 11000, value: 57000, effort: "Low effort", time: "Before Dec 15", driver: "Profit margin",
      evidence: "Cost of goods is 27.4% of revenue, against 25% for similar practices. Your reference lab contract renews Jan 15, with notice due Dec 15.",
      step: "Request quotes from two other labs before the notice date.", status: "todo", owner: "Dana" },
    { id: "wellness", title: "Launch wellness plans", profit: 9000, value: 70000, effort: "Medium effort", time: "1–2 months", driver: "Recurring revenue",
      evidence: "4% of your revenue is recurring. Similar practices with wellness plans average 12%, and buyers look for 15% or more.",
      step: "Pick a plan template and price it from your top 10 preventive services.", status: "todo", owner: "Unassigned" },
    { id: "dental", title: "Dental recall campaign", profit: 18000, value: 94000, status: "done", owner: "Maria", result: "Recovered $18.0K since March", evidence: "Reminders to 160 patients with overdue dental cleanings.", effort: "Low effort" },
    { id: "cards", title: "Switch card processor", profit: 9600, value: 50000, status: "done", owner: "Dana", result: "Saved $6.4K since March", evidence: "Moved from 2.9% to 2.3% average processing fees.", effort: "Low effort" },
  ];
  const ASSIGNEES = ["Nate", "Maria", "Dana", "Unassigned"];
  const ASSIGNEE_ROLE = { Nate: "Nate (you)", Maria: "Maria, front desk lead", Dana: "Dana, bookkeeper", Unassigned: "Unassigned" };

  const VALUE = {
    lo: 860000, hi: 950000, prevLo: 775000, prevHi: 855000, change: "+11%", ebitda: 165000,
    potential: "$1.35M–$1.5M",
    months: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    mid: [742, 748, 755, 760, 772, 781, 790, 802, 815, 838, 871, 905],
  };
  const VALUE_DRIVERS = [
    { dir: "up", label: "Revenue growth", text: "Up 6.2% over 12 months, ahead of similar practices." },
    { dir: "up", label: "Cloud systems", text: "ezyVet and QuickBooks Online make your numbers easy to verify." },
    { dir: "up", label: "Client retention", text: "78% of clients return within a year." },
    { dir: "down", label: "Owner dependence", text: "You produce 100% of doctor revenue. This is the biggest limit on the multiple." },
    { dir: "down", label: "Profit margin", text: "10.8%, below the 13–15% buyers treat as healthy." },
    { dir: "down", label: "Recurring revenue", text: "4% of revenue. Buyers look for 15% or more." },
  ];
  const READINESS = [
    { s: "done", t: "Books and practice system connected", d: "QuickBooks Online and ezyVet, synced monthly." },
    { s: "done", t: "Three years of financial history", d: "2023–2025 profit and loss statements on file." },
    { s: "part", t: "Owner pay adjustments documented", d: "2 of 3 confirmed. Building rent still needs review." },
    { s: "todo", t: "Practice can run without you", d: "You produce 100% of doctor revenue." },
    { s: "todo", t: "Lease can transfer to a new owner", d: "Upload the lease to the Data Room to check." },
    { s: "done", t: "No client concentration", d: "No single client is more than 1% of revenue." },
    { s: "todo", t: "Key staff agreements in place", d: "No written agreements for your two technicians." },
  ];

  const PNL = [
    { name: "Revenue", amt: 1210000, pct: null, strong: true },
    { name: "Cost of goods", sub: "Drugs, lab, supplies", amt: 332000, pct: 27.4, lo: 23.5, hi: 26.5, min: 18, max: 32, hb: false, gap: 29000 },
    { name: "Staff pay", sub: "Everyone except you", amt: 300000, pct: 24.8, lo: 20.5, hi: 23.5, min: 16, max: 30, hb: false, gap: 16000 },
    { name: "Your pay as a doctor", sub: "Market rate: 25% of your production", amt: 245000, pct: 20.2, lo: 19, hi: 22, min: 14, max: 26, hb: false },
    { name: "Building", sub: "Market rent on the building you own", amt: 72000, pct: 6.0, lo: 5.5, hi: 7.5, min: 3, max: 10, hb: false },
    { name: "Admin and other", sub: "Includes a 2% management fee", amt: 130000, pct: 10.7, lo: 10, hi: 12.5, min: 6, max: 16, hb: false },
    { name: "True practice profit", amt: 131000, pct: 10.8, lo: 11.5, hi: 15.5, min: 4, max: 20, hb: true, total: true, gap: 33000 },
  ];
  const WATERFALL = [
    { label: "What you took home", amt: 408, kind: "start", from: 0, to: 408 },
    { label: "Personal costs paid by the practice", amt: 16, kind: "plus", from: 408, to: 424 },
    { rule: true },
    { label: "Your pay as a doctor, at market rate", amt: -245, kind: "minus", from: 179, to: 424 },
    { label: "Management fee, 2% of revenue", amt: -24, kind: "minus", from: 155, to: 179 },
    { label: "Rent to market on your building", amt: -24, kind: "minus", from: 131, to: 155 },
    { rule: true },
    { label: "True practice profit", amt: 131, kind: "total", from: 0, to: 131 },
  ];
  const ADDBACKS = [
    { t: "Vehicle lease", d: "$9,200 a year, coded to Auto expense", s: "Confirmed" },
    { t: "Family phone plan and home internet", d: "$3,100 a year, coded to Utilities", s: "Confirmed" },
    { t: "Building rent", d: "You pay your own LLC $48K a year. Market rent is about $72K.", s: "Review" },
  ];

  /* --------------------------------------------------------------- helpers */

  const money = (n) => {
    const a = Math.abs(n);
    if (a >= 1e6) return "$" + (a / 1e6).toFixed(2).replace(/0$/, "") + "M";
    if (a >= 1000) return "$" + Math.round(a / 1000) + "K";
    return "$" + a;
  };
  const range = (lo, hi) => money(lo) + "–" + money(hi);

  const peerTone = (m) => {
    if (m.you >= m.lo && m.you <= m.hi) return { tone: "neutral", text: "In line with peers" };
    const ahead = (m.you > m.hi) === m.hb;
    return ahead ? { tone: "good", text: "Ahead of peers" } : { tone: "warn", text: "Behind peers" };
  };
  const PeerChip = ({ m }) => { const p = peerTone(m); return <span className={"ow-chip ow-chip--" + p.tone}>{p.text}</span>; };

  const PeerBar = ({ m, legend }) => {
    const pct = (v) => Math.max(2, Math.min(98, ((v - m.min) / (m.max - m.min)) * 100));
    return (
      <div>
        <div className="ow-peer" role="img" aria-label={peerTone(m).text}>
          <div className="ow-peer__band" style={{ left: pct(m.lo) + "%", width: (pct(m.hi) - pct(m.lo)) + "%" }} />
          <div className={"ow-peer__dot ow-peer__dot--" + peerTone(m).tone} style={{ left: pct(m.you) + "%" }} />
        </div>
        {legend && <div className="ow-peer__legend"><span>{legend[0]}</span><span>{legend[1]}</span></div>}
      </div>
    );
  };

  const Spark = ({ data }) => {
    const w = 96, h = 36, p = 3;
    const mn = Math.min(...data), mx = Math.max(...data);
    const pts = data.map((d, i) => [p + (i * (w - p * 2)) / (data.length - 1), h - p - ((d - mn) / (mx - mn || 1)) * (h - p * 2)]);
    const last = pts[pts.length - 1];
    return (
      <svg className="ow-spark" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
        <polyline points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke="var(--color-brand-400)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={last[0]} cy={last[1]} r="2.5" fill="var(--teal-brand)" />
      </svg>
    );
  };

  // Impact of an opportunity in the current mode.
  const impact = (o, future) => future
    ? { amt: "+" + money(o.value), unit: "practice value", alt: "+" + money(o.profit) + " profit a year" }
    : { amt: "+" + money(o.profit), unit: "profit a year", alt: o.profitNote || null };
  const ranked = (opps, future) => opps.filter((o) => o.status !== "done").slice().sort((a, b) => future ? b.value - a.value : b.profit - a.profit);

  const go = (page) => navigateTo("/pulse" + (page ? "/" + page : ""));

  const PageHead = ({ title, subtitle, actions }) => (
    <div className="co-sub">
      <div className="co-sub__wrap">
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="co-sub__subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="co-sub__actions">{actions}</div>}
      </div>
    </div>
  );

  const PeerNote = () => (
    <p className="ow-body ow-muted" style={{ marginTop: 16 }}>
      Compared with {PEER_GROUP}. The shaded band is the middle half of that group.
    </p>
  );

  /* ---------------------------------------------------------------- nudges */

  const NudgePaused = ({ onUndo }) => (
    <div className="ow-nudge ow-nudge--paused">
      <Icon name="check" size={16} />
      <p className="ow-body">Got it. We won't bring up selling again until May 2027. Your estimate keeps updating quietly on the Valuation page.</p>
      <button className="ow-link" style={{ marginLeft: "auto", flexShrink: 0 }} onClick={onUndo}>Undo</button>
    </div>
  );

  // Nudge 1 — quarterly valuation recap, shown as a dashboard banner.
  const NudgeRecap = ({ ctx }) => {
    if (ctx.nudges.paused) return <NudgePaused onUndo={() => ctx.setNudges({ ...ctx.nudges, paused: false })} />;
    return (
      <div className="ow-nudge">
        <div className="ow-nudge__icon"><Icon name="trendUp" size={18} /></div>
        <div>
          <div className="ow-eyebrow">Quarterly value update · Q3 2026</div>
          <h3 className="ow-nudge__title">Your practice's estimated value rose 11% this quarter, to {range(VALUE.lo, VALUE.hi)}</h3>
          <p className="ow-body">
            Most of the gain came from higher profit after the dental recall campaign. You're not selling, and nothing here changes that.
            If you're ever curious what buyers would actually pay, a Market Check asks verified buyers privately. Nothing is listed and your name stays hidden.
          </p>
          <div className="ow-nudge__actions">
            <button className="co-btn co-btn--primary" onClick={() => go("market-check")}>Run a private Market Check</button>
            <button className="ow-link" onClick={() => go("valuation")}>See what changed</button>
            <button className="ow-link ow-muted" style={{ color: "var(--stone-500)" }} onClick={() => ctx.setNudges({ ...ctx.nudges, paused: true })}>Not for me right now</button>
          </div>
          <div className="ow-nudge__fine">You'll see an update like this once a quarter. "Not for me right now" pauses them for 6 months.</div>
        </div>
      </div>
    );
  };

  // Nudge 2 — buyer demand, shown inline next to the updated valuation number.
  const STAY_OPTIONS = ["Leave at closing", "6–12 months", "1–3 years", "Not sure yet"];
  const NudgeDemand = ({ ctx }) => {
    if (ctx.nudges.paused) return <NudgePaused onUndo={() => ctx.setNudges({ ...ctx.nudges, paused: false })} />;
    const stay = ctx.nudges.stay;
    return (
      <div className="ow-nudge">
        <div className="ow-nudge__icon"><Icon name="users" size={18} /></div>
        <div>
          <div className="ow-eyebrow">Buyer demand near you · Q3 2026</div>
          <h3 className="ow-nudge__title">7 verified buyers are looking for single-doctor practices around Portland</h3>
          <p className="ow-body">
            If you did want to sell today, a realistic price is {range(VALUE.lo, VALUE.hi)}, most likely to another veterinarian using an SBA loan.
            A 15-minute call with an advisor can walk you through how that number would hold up. There's no listing and no commitment.
          </p>
          <div className="ow-nudge__actions">
            <button className="co-btn co-btn--primary" onClick={() => ctx.toast("Advisor call requested. We'll email you times.")}><Icon name="phone" size={14} /> Book a 15-minute call</button>
            <button className="ow-link" onClick={() => go("market-check")}>Run a private Market Check</button>
            <button className="ow-link" style={{ color: "var(--stone-500)" }} onClick={() => ctx.setNudges({ ...ctx.nudges, paused: true })}>Not for me right now</button>
          </div>
          <div className="ow-nudge__q">
            <div className="ow-body" style={{ fontWeight: 500, color: "var(--stone-900)" }}>One quick question, saved privately in case you ever list:</div>
            <div className="ow-body">If you sold one day, how long would you want to stay on?</div>
            <div className="ow-nudge__chips">
              {STAY_OPTIONS.map((o) => (
                <button key={o} className={"co-chip" + (stay === o ? " is-active" : "")} onClick={() => { ctx.setNudges({ ...ctx.nudges, stay: o }); ctx.toast("Saved privately to your profile"); }}>
                  {stay === o && <Icon name="check" size={12} />}{o}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ------------------------------------------------------------- dashboard */

  const KpiTile = ({ id }) => {
    const m = METRICS[id];
    const cls = m.good === true ? " is-good" : m.good === false ? " is-bad" : "";
    return (
      <button className="ow-kpi" onClick={() => go(m.page)}>
        <div className="ow-kpi__top">
          <span className="ow-eyebrow">{m.label}</span>
          <PeerChip m={m} />
        </div>
        <div className="ow-kpi__mid">
          <div>
            <div className="ow-kpi__value ow-num">{m.value}</div>
            <div className={"ow-kpi__delta" + cls}>
              {m.dir !== "flat" && <Icon name={m.dir === "up" ? "arrowUp" : "arrowDown"} size={12} />}{m.delta}
            </div>
          </div>
          <Spark data={m.spark} />
        </div>
        <PeerBar m={m} />
        <div className="ow-kpi__peer">{m.peer}</div>
      </button>
    );
  };

  const TopOpps = ({ ctx }) => {
    const top = ranked(ctx.opps, ctx.future).slice(0, 3);
    const total = top.reduce((s, o) => s + (ctx.future ? o.value : o.profit), 0);
    return (
      <div className="co-card">
        <div className="co-card__head">
          <h3 className="co-card__title">Top 3 opportunities</h3>
          <span className="ow-chip ow-chip--good">+{money(total)} {ctx.future ? "in value" : "a year"}</span>
        </div>
        {top.map((o, i) => {
          const im = impact(o, ctx.future);
          return (
            <button key={o.id} className="ow-topopp" onClick={() => go("opportunities")}>
              <span className="ow-topopp__rank">{i + 1}</span>
              <span>
                <span className="ow-topopp__title">{o.title}</span>
                <span className="ow-body ow-muted" style={{ display: "block" }}>{o.effort} · {o.time}</span>
              </span>
              <span className="ow-topopp__amt ow-num">{im.amt}<span className="ow-topopp__unit">{im.unit}</span></span>
            </button>
          );
        })}
        <button className="ow-link" style={{ marginTop: 16 }} onClick={() => go("opportunities")}>See all opportunities and your action plan <Icon name="arrowRight" size={14} /></button>
      </div>
    );
  };

  const WhatChanged = () => (
    <div className="co-card">
      <div className="co-card__head">
        <h3 className="co-card__title">What changed this month</h3>
        <span className="co-card__meta">{PERIOD} vs. September</span>
      </div>
      {CHANGES.map((c) => (
        <div key={c.title} className="ow-change">
          <div className={"ow-change__icon" + (c.tone === "good" ? " is-good" : c.tone === "bad" ? " is-bad" : "")}><Icon name={c.icon} size={16} /></div>
          <div>
            <div className="ow-change__title">{c.title}</div>
            <div className="ow-change__why">{c.why}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const ScoreRing = ({ score }) => {
    const r = 30, c = 2 * Math.PI * r;
    return (
      <svg className="ow-score__ring" viewBox="0 0 72 72" role="img" aria-label={"Readiness score " + score + " out of 100"}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--stone-200)" strokeWidth="7" />
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--teal-button)" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${(score / 100) * c} ${c}`} transform="rotate(-90 36 36)" />
        <text x="36" y="43" textAnchor="middle" className="ow-score__num">{score}</text>
      </svg>
    );
  };

  const ValueHero = () => (
    <div className="co-card">
      <div className="ow-hero">
        <div>
          <div className="ow-eyebrow">Estimated practice value · private</div>
          <div className="ow-range ow-num" style={{ marginTop: 8 }}>{range(VALUE.lo, VALUE.hi)}</div>
          <div className="ow-kpi__delta is-good"><Icon name="arrowUp" size={12} />{VALUE.change} this quarter · updated Nov 1</div>
          <p className="ow-body" style={{ marginTop: 16 }}>
            Completing your top 3 opportunities could raise this to about <b style={{ fontWeight: 600, color: "var(--stone-900)" }}>{VALUE.potential}</b>.
            Only you can see this estimate. It is not an appraisal.
          </p>
          <div className="ow-score" style={{ marginTop: 20 }}>
            <ScoreRing score={58} />
            <div>
              <div className="ow-body" style={{ fontWeight: 500, color: "var(--stone-900)" }}>Ready-to-transfer score: 58 of 100</div>
              <div className="ow-body ow-muted">3 of 7 items still open. Owner dependence is the largest.</div>
              <button className="ow-link" style={{ marginTop: 4 }} onClick={() => go("valuation")}>Open valuation and readiness <Icon name="arrowRight" size={14} /></button>
            </div>
          </div>
        </div>
        <div>
          <div className="ow-eyebrow" style={{ marginBottom: 8 }}>What moves your value most</div>
          {VALUE_DRIVERS.filter((d) => d.dir === "down").map((d) => (
            <div key={d.label} className="ow-driver is-down"><Icon name="arrowDown" size={14} /><span><b>{d.label}.</b> {d.text}</span></div>
          ))}
          <div className="ow-driver is-up"><Icon name="arrowUp" size={14} /><span><b>Revenue growth.</b> Up 6.2% over 12 months.</span></div>
        </div>
      </div>
    </div>
  );

  const ValueTile = () => (
    <div className="co-card ow-quiet">
      <div className="co-card__head" style={{ marginBottom: 8 }}>
        <h3 className="co-card__title">Practice value estimate</h3>
        <span className="co-card__meta"><Icon name="lock" size={12} /> Private</span>
      </div>
      <div className="ow-range ow-range--sm ow-num">{range(VALUE.lo, VALUE.hi)}</div>
      <div className="ow-body ow-muted">Updated Nov 1 · {VALUE.change} this quarter</div>
      <button className="ow-link" style={{ marginTop: 12 }} onClick={() => go("valuation")}>How this is estimated <Icon name="arrowRight" size={14} /></button>
    </div>
  );

  const Dashboard = ({ ctx }) => {
    const kpis = <div className="ow-grid3">{DASH_KPIS.map((id) => <KpiTile key={id} id={id} />)}</div>;
    return (
      <>
        <PageHead
          title={"Good morning, " + OWNER.first}
          subtitle={ctx.future
            ? PERIOD + " · what your practice is worth and what would raise it"
            : PERIOD + " · how the practice is doing and what to fix first"}
          actions={<button className="co-btn-outline" onClick={() => ctx.toast("October report sent to your email")}><Icon name="mail" /> Email me this report</button>}
        />
        <div className="ow-stack">
          {ctx.future ? (
            <>
              <ValueHero />
              <div className="ow-cols ow-cols--even"><TopOpps ctx={ctx} /><WhatChanged /></div>
              {kpis}
            </>
          ) : (
            <>
              <NudgeRecap ctx={ctx} />
              {kpis}
              <div className="ow-cols">
                <WhatChanged />
                <div className="ow-stack" style={{ marginTop: 0 }}><TopOpps ctx={ctx} /><ValueTile /></div>
              </div>
            </>
          )}
        </div>
        <PeerNote />
      </>
    );
  };

  /* ------------------------------------------------------------ financials */

  const TrueProfit = ({ ctx }) => (
    <div className="co-card">
      <div className="co-card__head">
        <div>
          <h3 className="co-card__title">True profit</h3>
          <p className="co-card__subtitle" style={{ font: "var(--font-caption)" }}>Your pay as the owner, separated from what the practice itself earns. Last 12 months.</p>
        </div>
        <PeerChip m={METRICS.margin} />
      </div>
      <div className="ow-bigpair">
        <div><div className="ow-bigpair__n ow-num">$408K</div><div className="ow-bigpair__l">You took home · 34% of revenue</div></div>
        <div><div className="ow-bigpair__n is-brand ow-num">$131K</div><div className="ow-bigpair__l">The practice earned · 10.8% of revenue</div></div>
      </div>
      <div className="ow-cols ow-cols--wide">
        <div className="ow-wf">
          {WATERFALL.map((r, i) => r.rule ? <div key={i} className="ow-wf__rule" /> : (
            <React.Fragment key={i}>
              <div className={"ow-wf__label" + (r.kind === "total" ? " is-total" : "")}>{r.label}</div>
              <div className="ow-wf__track"><div className={"ow-wf__bar ow-wf__bar--" + r.kind} style={{ left: (r.from / 424) * 100 + "%", width: ((r.to - r.from) / 424) * 100 + "%" }} /></div>
              <div className="ow-wf__amt ow-num">{r.amt < 0 ? "−" : r.kind === "plus" ? "+" : ""}${Math.abs(r.amt)}K</div>
            </React.Fragment>
          ))}
        </div>
        <div>
          <div className="ow-eyebrow">Profit margin vs. similar practices</div>
          <PeerBar m={METRICS.margin} legend={["4%", "20%"]} />
          <p className="ow-body" style={{ marginTop: 12 }}>
            Most of what you take home is fair pay for the doctor work you do. After that, the practice earns 10.8%. Similar practices earn 11.5%–15.5%.
            Reaching their midpoint would add <b style={{ fontWeight: 600, color: "var(--stone-900)" }}>{ctx.future ? "about $170K to your practice value" : "about $33K a year"}</b>.
          </p>
          <button className="ow-link" style={{ marginTop: 8 }} onClick={() => go("opportunities")}>See where the gap is <Icon name="arrowRight" size={14} /></button>
        </div>
      </div>
    </div>
  );

  const AddBacks = ({ ctx }) => (
    <div className="co-card">
      <div className="co-card__head">
        <div>
          <h3 className="co-card__title">Owner adjustments</h3>
          <p className="co-card__subtitle" style={{ font: "var(--font-caption)" }}>Costs we found in QuickBooks that belong to you, not the practice. Confirm each one so true profit stays accurate.</p>
        </div>
        <span className="co-card__meta" style={{ whiteSpace: "nowrap" }}>2 of 3 confirmed</span>
      </div>
      {ADDBACKS.map((a) => (
        <div key={a.t} className="ow-addback">
          <div><div className="ow-addback__t">{a.t}</div><div className="ow-addback__d">{a.d}</div></div>
          <div className="ow-addback__r">
            {a.s === "Confirmed"
              ? <span className="ow-chip ow-chip--good"><Icon name="check" size={12} /> Confirmed</span>
              : <button className="co-btn co-btn--ghost" onClick={() => ctx.toast("Rent adjustment confirmed")}>Review</button>}
          </div>
        </div>
      ))}
    </div>
  );

  const BuyerProfit = () => (
    <div className="co-card">
      <div className="co-card__head">
        <h3 className="co-card__title">How a buyer reads your profit</h3>
        <span className="ow-chip ow-chip--brand">Future Seller</span>
      </div>
      <div className="ow-bigpair" style={{ marginBottom: 12 }}>
        <div><div className="ow-bigpair__n ow-num">$165K</div><div className="ow-bigpair__l">Adjusted EBITDA · 13.6% of revenue</div></div>
        <div><div className="ow-bigpair__n ow-num">5.2–5.8×</div><div className="ow-bigpair__l">Multiple for a solo practice like yours</div></div>
        <div><div className="ow-bigpair__n is-brand ow-num">{range(VALUE.lo, VALUE.hi)}</div><div className="ow-bigpair__l">Estimated practice value</div></div>
      </div>
      <p className="ow-body">
        Buyers price a practice on adjusted EBITDA: true profit of $131K, plus $22K depreciation and $12K loan interest.
        At your multiple, every $1 of yearly profit you add is worth about $5.50 of practice value.
      </p>
    </div>
  );

  const PnlTable = ({ ctx }) => (
    <div className="co-card">
      <div className="co-card__head">
        <h3 className="co-card__title">Where the money goes</h3>
        <span className="co-card__meta">Nov 2025 – Oct 2026 · from QuickBooks Online</span>
      </div>
      <div className="ow-tablewrap">
        <table className="ow-table">
          <thead>
            <tr>
              <th>Line</th><th className="is-num">Amount</th><th className="is-num">Share of revenue</th><th>Vs. similar practices</th><th></th>
              <th className="is-num">{ctx.future ? "Value if you close the gap" : "Profit if you close the gap"}</th>
            </tr>
          </thead>
          <tbody>
            {PNL.map((r) => {
              const m = r.lo != null ? { you: r.pct, lo: r.lo, hi: r.hi, min: r.min, max: r.max, hb: r.hb } : null;
              return (
                <tr key={r.name} className={r.total ? "is-total" : ""}>
                  <td><div className="ow-table__name">{r.name}</div>{r.sub && <div className="ow-table__sub">{r.sub}</div>}</td>
                  <td className={"is-num" + (r.strong ? " is-strong" : "")}>{money(r.amt)}</td>
                  <td className="is-num">{r.pct != null ? r.pct.toFixed(1) + "%" : ""}</td>
                  <td className="ow-table__peer">{m && <PeerBar m={m} legend={[r.lo + "%", r.hi + "%"]} />}</td>
                  <td>{m && <PeerChip m={m} />}</td>
                  <td className="is-num">{r.gap ? <span style={{ color: "var(--success-700)", fontWeight: 600 }}>+{money(ctx.future ? Math.round((r.gap * 5.2) / 10000) * 10000 : r.gap)}{ctx.future ? "" : " a year"}</span> : <span className="ow-muted">—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const RevenueChart = () => {
    const data = METRICS.revenue.spark, mx = Math.max(...data);
    return (
      <div className="co-card">
        <div className="co-card__head">
          <h3 className="co-card__title">Monthly revenue</h3>
          <span className="co-card__meta">$1.21M over 12 months · up 6.2% on the year before</span>
        </div>
        <div className="ow-bars">
          {data.map((d, i) => (
            <div key={i} className={"ow-bars__col" + (i === data.length - 1 ? " is-now" : "")}>
              <span className="ow-bars__v ow-num">{d}</span>
              <div className="ow-bars__bar" style={{ height: (d / mx) * 100 + "%" }} />
              <span className="ow-bars__x">{VALUE.months[i]}</span>
            </div>
          ))}
        </div>
        <p className="ow-body ow-muted" style={{ marginTop: 8 }}>Revenue in $ thousands.</p>
      </div>
    );
  };

  const Financials = ({ ctx }) => (
    <>
      <PageHead title="Financials" subtitle="Last 12 months through October 2026 · synced Nov 1 from QuickBooks Online" />
      <div className="ow-stack">
        <TrueProfit ctx={ctx} />
        {ctx.future && <BuyerProfit />}
        <PnlTable ctx={ctx} />
        <div className="ow-cols ow-cols--even"><RevenueChart /><AddBacks ctx={ctx} /></div>
      </div>
      <PeerNote />
    </>
  );

  /* ------------------------------------------------------------ operations */

  const OwnerDependence = ({ ctx }) => (
    <div className="co-card">
      <div className="co-card__head">
        <div>
          <h3 className="co-card__title">Owner dependence</h3>
          <p className="co-card__subtitle" style={{ font: "var(--font-caption)" }}>How much of the practice's revenue depends on you being in the building.</p>
        </div>
        {ctx.future ? <span className="ow-chip ow-chip--brand">Biggest value driver</span> : <span className="ow-chip ow-chip--warn">Limits growth</span>}
      </div>
      <div className="ow-cols ow-cols--even" style={{ gap: 32 }}>
        <div>
          <div className="ow-bigpair" style={{ marginBottom: 0 }}>
            <div><div className="ow-bigpair__n ow-num">100%</div><div className="ow-bigpair__l">of doctor revenue is yours</div></div>
            <div><div className="ow-bigpair__n ow-num">46 hrs</div><div className="ow-bigpair__l">with patients each week</div></div>
          </div>
          <div className="ow-split"><div className="ow-split__a" style={{ width: "91%" }}>You · 91% of all revenue</div><div className="ow-split__b" /></div>
          <div className="ow-body ow-muted">The other 9% is retail, food and technician services.</div>
        </div>
        <div>
          {ctx.future ? (
            <>
              <p className="ow-body">Buyers pay less for a practice that stops earning when its owner leaves. Adding a second doctor changes which group you're priced in.</p>
              <div className="ow-multi">
                <div className="ow-multi__c is-you"><div className="ow-eyebrow">Solo · you today</div><div className="ow-multi__x ow-num">3.5–6×</div><div className="ow-body ow-muted">profit</div></div>
                <div className="ow-multi__c"><div className="ow-eyebrow">2 doctors</div><div className="ow-multi__x ow-num">6–7.5×</div><div className="ow-body ow-muted">profit</div></div>
                <div className="ow-multi__c"><div className="ow-eyebrow">3+ doctors</div><div className="ow-multi__x ow-num">8–12×</div><div className="ow-body ow-muted">profit</div></div>
              </div>
            </>
          ) : (
            <p className="ow-body">
              Your schedule is 93% full, so revenue can only grow through higher fees or more hours from you.
              Two changes would free up capacity: technician appointments for routine visits (about 5 of your hours a week), and a part-time associate.
            </p>
          )}
          <button className="ow-link" style={{ marginTop: 12 }} onClick={() => go("opportunities")}>
            {ctx.future ? "Hiring an associate could add about $280K in value" : "See both in your opportunities"} <Icon name="arrowRight" size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const Operations = ({ ctx }) => (
    <>
      <PageHead title="Operations" subtitle="October 2026 · synced Nov 1 from ezyVet" />
      <div className="ow-stack">
        <OwnerDependence ctx={ctx} />
        <div className="co-card">
          <div className="co-card__head">
            <h3 className="co-card__title">Clients, visits and capacity</h3>
            <span className="co-card__meta">Change is vs. September unless noted</span>
          </div>
          <div className="ow-tablewrap">
            <table className="ow-table">
              <thead><tr><th>Measure</th><th className="is-num">You</th><th className="is-num">Change</th><th>Vs. similar practices</th><th></th></tr></thead>
              <tbody>
                {OPS_ROWS.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="ow-table__name">{r.name} {ctx.future && r.driver && <span className="ow-chip ow-chip--brand" style={{ marginLeft: 4 }}>Value driver</span>}</div>
                      <div className="ow-table__sub">{r.note || r.sub}</div>
                    </td>
                    <td className="is-num is-strong">{r.value}</td>
                    <td className="is-num">{r.trend}</td>
                    <td className="ow-table__peer"><PeerBar m={r} /></td>
                    <td><PeerChip m={r} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <PeerNote />
    </>
  );

  /* --------------------------------------------------------- opportunities */

  const OppCard = ({ o, rank, ctx }) => {
    const im = impact(o, ctx.future);
    const done = o.status === "done";
    return (
      <div className="co-card">
        <div className="ow-opp">
          <div className={"ow-opp__rank" + (done ? " is-done" : "")}>{done ? <Icon name="check" size={16} /> : rank}</div>
          <div>
            <h3 className="ow-opp__title">{o.title}</h3>
            <p className="ow-body">{o.evidence}</p>
            {!done && <div className="ow-opp__step"><b>Next step:</b> {o.step}</div>}
            {o.status === "progress" && o.progress && (
              <div style={{ marginTop: 12 }}>
                <div className="ow-body" style={{ fontWeight: 500, color: "var(--stone-900)" }}>{o.progress.text}</div>
                <div className="ow-progress"><i style={{ width: o.progress.pct + "%" }} /></div>
              </div>
            )}
            <div className="ow-opp__meta">
              {done
                ? <span className="ow-chip ow-chip--good">{o.result}</span>
                : <>
                    <span className={"ow-chip " + (o.status === "progress" ? "ow-chip--brand" : "ow-chip--neutral")}>{o.status === "progress" ? "In progress" : "To do"}</span>
                    <span className="ow-chip ow-chip--neutral">{o.effort} · {o.time}</span>
                    {ctx.future && <span className="ow-chip ow-chip--brand">{o.driver}</span>}
                  </>}
              <label className="ow-body ow-muted" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                Owner
                <select className="ow-select" value={o.owner} disabled={done} onChange={(e) => ctx.updateOpp(o.id, { owner: e.target.value })}>
                  {ASSIGNEES.map((a) => <option key={a} value={a}>{ASSIGNEE_ROLE[a]}</option>)}
                </select>
              </label>
            </div>
          </div>
          <div className="ow-opp__side">
            <div className="ow-opp__amt ow-num">{im.amt}</div>
            <div className="ow-body ow-muted">{im.unit}</div>
            {im.alt && <div className="ow-opp__alt">{im.alt}</div>}
            {o.status === "todo" && <button className="co-btn co-btn--primary" onClick={() => { ctx.updateOpp(o.id, { status: "progress" }); ctx.toast("Added to your action plan"); }}>Start</button>}
            {o.status === "progress" && <button className="co-btn co-btn--ghost" onClick={() => { ctx.updateOpp(o.id, { status: "done", result: "Completed Nov 2026 · tracking results" }); ctx.toast("Marked done. We'll track the results."); }}>Mark done</button>}
          </div>
        </div>
      </div>
    );
  };

  const Opportunities = ({ ctx }) => {
    const [filter, setFilter] = useState("open");
    const open = ranked(ctx.opps, ctx.future);
    const done = ctx.opps.filter((o) => o.status === "done");
    const inProgress = open.filter((o) => o.status === "progress");
    const total = open.reduce((s, o) => s + (ctx.future ? o.value : o.profit), 0);
    const lists = { open, progress: inProgress, done };
    const filters = [["open", "Open", open.length], ["progress", "In progress", inProgress.length], ["done", "Done", done.length]];
    return (
      <>
        <PageHead
          title="Opportunities & Action Plan"
          subtitle={ctx.future ? "Ranked by how much each one adds to your practice value" : "Ranked by how much each one adds to yearly profit"}
        />
        <div className="ow-stack">
          <div className="ow-grid3">
            <div className="co-card"><div className="ow-stat__n ow-num" style={{ color: "var(--success-700)" }}>+{money(total)}</div><div className="ow-stat__l">{ctx.future ? "Practice value across " : "Profit a year across "}{open.length} open opportunities</div></div>
            <div className="co-card"><div className="ow-stat__n ow-num">{inProgress.length}</div><div className="ow-stat__l">In progress on your action plan</div></div>
            <div className="co-card"><div className="ow-stat__n ow-num">$31.5K</div><div className="ow-stat__l">Measured results since March</div></div>
          </div>
          <div className="ow-filters">
            {filters.map(([id, label, n]) => (
              <button key={id} className={"co-chip" + (filter === id ? " is-active" : "")} onClick={() => setFilter(id)}>{label} · {n}</button>
            ))}
          </div>
          {lists[filter].length === 0 && <div className="co-card"><p className="ow-body ow-muted">Nothing here yet. Start an opportunity to add it to your plan.</p></div>}
          {lists[filter].map((o) => <OppCard key={o.id} o={o} rank={open.indexOf(o) + 1} ctx={ctx} />)}
        </div>
        <p className="ow-body ow-muted" style={{ marginTop: 16 }}>
          Dollar figures are estimates from your QuickBooks and ezyVet data and {PEER_GROUP}. Results are measured from your own data after you mark an item started.
        </p>
      </>
    );
  };

  /* ------------------------------------------------------------- valuation */

  const ValueChart = () => {
    const w = 720, h = 180, mn = 680, mx = 980;
    const x = (i) => (i / (VALUE.mid.length - 1)) * w;
    const y = (v) => h - ((v - mn) / (mx - mn)) * h;
    const hi = VALUE.mid.map((m, i) => [x(i), y(m * 1.05)]);
    const lo = VALUE.mid.map((m, i) => [x(i), y(m * 0.95)]);
    const mid = VALUE.mid.map((m, i) => [x(i), y(m)]);
    const path = (pts) => pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
    return (
      <div className="ow-vchart">
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label="Estimated value range over the last 12 months, rising from about $740K to $905K">
          {[700, 800, 900].map((g) => <line key={g} x1="0" x2={w} y1={y(g)} y2={y(g)} stroke="var(--stone-200)" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
          <path d={path(hi) + " " + path(lo.slice().reverse()).replace("M", "L") + " Z"} fill="var(--teal-tint)" />
          <path d={path(mid)} fill="none" stroke="var(--teal-brand)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        {[700, 800, 900].map((g) => <span key={g} className="ow-vchart__y" style={{ top: (y(g) / h) * 180 }}>${g}K</span>)}
        <div className="ow-vchart__x">{VALUE.months.map((m, i) => <span key={i}>{m}</span>)}</div>
      </div>
    );
  };

  const Valuation = ({ ctx }) => {
    const top = ranked(ctx.opps, true).slice(0, 3);
    return (
      <>
        <PageHead
          title="Valuation Estimate"
          subtitle="A private estimate of what your practice is worth, refreshed every month"
          actions={<span className="ow-chip ow-chip--neutral" style={{ padding: "6px 12px" }}><Icon name="lock" size={12} /> Only you can see this</span>}
        />
        <div className="ow-stack">
          <div className="co-card">
            <div className="ow-hero">
              <div>
                <div className="ow-eyebrow">Estimated practice value</div>
                <div className="ow-range ow-num" style={{ marginTop: 8 }}>{range(VALUE.lo, VALUE.hi)}</div>
                <div className="ow-kpi__delta is-good"><Icon name="arrowUp" size={12} />{VALUE.change} this quarter, from {range(VALUE.prevLo, VALUE.prevHi)}</div>
                <p className="ow-body" style={{ marginTop: 16 }}>
                  Based on adjusted EBITDA of {money(VALUE.ebitda)} and a multiple of 5.2–5.8× for a single-doctor practice with your margins.
                  That is 71%–79% of yearly revenue, in line with recent sales of similar practices.
                </p>
                <p className="ow-body ow-muted" style={{ marginTop: 8 }}>Updated Nov 1 from QuickBooks Online and ezyVet. This is an estimate, not an appraisal.</p>
              </div>
              <div>
                <div className="ow-eyebrow" style={{ marginBottom: 12 }}>Last 12 months</div>
                <ValueChart />
              </div>
            </div>
          </div>

          {!ctx.future && <NudgeDemand ctx={ctx} />}

          <div className="ow-cols ow-cols--even">
            <div className="co-card">
              <div className="co-card__head"><h3 className="co-card__title">What's driving the estimate</h3></div>
              {VALUE_DRIVERS.map((d) => (
                <div key={d.label} className={"ow-driver is-" + d.dir}><Icon name={d.dir === "up" ? "arrowUp" : "arrowDown"} size={14} /><span><b>{d.label}.</b> {d.text}</span></div>
              ))}
            </div>
            <div className="co-card">
              <div className="co-card__head">
                <h3 className="co-card__title">Valuation potential</h3>
                <span className="ow-chip ow-chip--good">{VALUE.potential}</span>
              </div>
              <p className="ow-body" style={{ marginBottom: 8 }}>What the estimate could reach if you complete the three changes that add the most value.</p>
              {top.map((o) => (
                <div key={o.id} className="ow-driver is-up"><Icon name="plus" size={14} /><span><b>{o.title}</b></span><span className="ow-driver__amt ow-num" style={{ color: "var(--success-700)" }}>+{money(o.value)}</span></div>
              ))}
              <button className="ow-link" style={{ marginTop: 12 }} onClick={() => go("opportunities")}>Open your action plan <Icon name="arrowRight" size={14} /></button>
            </div>
          </div>

          {ctx.future ? (
            <>
              <div className="ow-cols ow-cols--even">
                <div className="co-card">
                  <div className="co-card__head">
                    <h3 className="co-card__title">Ready-to-transfer score</h3>
                    <span className="ow-chip ow-chip--brand">Future Seller</span>
                  </div>
                  <div className="ow-score" style={{ marginBottom: 12 }}>
                    <ScoreRing score={58} />
                    <p className="ow-body">How easily the practice could pass to a new owner. It also measures how well the practice runs without you, which matters whether or not you sell.</p>
                  </div>
                  {READINESS.map((r) => (
                    <div key={r.t} className={"ow-check" + (r.s === "done" ? " is-done" : r.s === "part" ? " is-part" : "")}>
                      <span className="ow-check__i"><Icon name={r.s === "part" ? "minus" : "check"} size={12} /></span>
                      <span><b>{r.t}.</b> {r.d}</span>
                    </div>
                  ))}
                </div>
                <div className="ow-stack" style={{ marginTop: 0 }}>
                  <div className="co-card">
                    <div className="co-card__head"><h3 className="co-card__title">Why a second doctor changes the price</h3></div>
                    <p className="ow-body">Buyers pay a higher multiple of profit as owner dependence falls.</p>
                    <div className="ow-multi">
                      <div className="ow-multi__c is-you"><div className="ow-eyebrow">Solo · you today</div><div className="ow-multi__x ow-num">3.5–6×</div><div className="ow-body ow-muted">Individual vets, SBA loans</div></div>
                      <div className="ow-multi__c"><div className="ow-eyebrow">2 doctors</div><div className="ow-multi__x ow-num">6–7.5×</div><div className="ow-body ow-muted">Regional groups</div></div>
                      <div className="ow-multi__c"><div className="ow-eyebrow">3+ doctors</div><div className="ow-multi__x ow-num">8–12×</div><div className="ow-body ow-muted">Larger groups</div></div>
                    </div>
                  </div>
                  <div className="co-card">
                    <div className="co-card__head"><h3 className="co-card__title">Test the market privately</h3></div>
                    <p className="ow-body">A Market Check shares an anonymous summary with verified buyers and brings their interest back to you. Nothing is listed and replies stay private.</p>
                    <button className="co-btn co-btn--ghost" style={{ marginTop: 12 }} onClick={() => go("market-check")}><Icon name="searchCheck" size={14} /> Run a Market Check</button>
                  </div>
                </div>
              </div>
              <div className="co-card" style={{ borderColor: "var(--color-brand-200)", background: "var(--teal-tint)" }}>
                <div className="co-card__head" style={{ marginBottom: 8 }}>
                  <h3 className="co-card__title">When you're ready to sell</h3>
                </div>
                <p className="ow-body">Your profile, financials, documents and readiness work carry over to the selling version of CareOwner. Your listing starts filled in, and nothing goes public until you publish it.</p>
                <button className="co-btn co-btn--primary" style={{ marginTop: 12 }} onClick={() => navigateTo("/practice")}>I'm ready to sell <Icon name="arrowRight" size={14} /></button>
              </div>
            </>
          ) : (
            <div className="co-card ow-quiet">
              <div className="co-card__head" style={{ marginBottom: 8 }}><h3 className="co-card__title"><Icon name="lock" size={16} /> Private by default</h3></div>
              <p className="ow-body">No buyer, broker or advisor sees your estimate or your data unless you choose to share it. Planning to sell in the next few years? Turn on Future Seller in the left menu to see your readiness score and what buyers look for.</p>
            </div>
          )}
        </div>
      </>
    );
  };

  /* ----------------------------------------------------------------- stubs */

  const STUBS = {
    profile: ["Practice Profile", "building", "Facilities, services and hours, pre-filled from your onboarding interview. Sale preferences stay hidden until Future Seller is on."],
    team: ["Team", "users", "Your staff, roles and hours, plus invites for a manager, bookkeeper or CPA with limited access."],
    "data-room": ["Data Room", "folder", "Your documents, stored the same way as a seller's data room so they carry over if you ever list."],
    benchmarks: ["Benchmarks", "barChart", "Every KPI compared with similar practices on a common chart of accounts."],
    readiness: ["Sale Readiness", "award", "The full ready-to-transfer checklist. A summary is on the Valuation Estimate page when Future Seller is on."],
    "market-check": ["Market Check", "searchCheck", "Anonymous interest from verified buyers. Nothing is listed and replies stay private. This reuses the Market Check flow from the seller version."],
  };
  const Stub = ({ id }) => {
    const [title, icon, text] = STUBS[id] || ["Not found", "info", "This page doesn't exist in the prototype."];
    return (
      <>
        <PageHead title={title} />
        <div className="co-card ow-stub">
          <div className="ow-stub__icon"><Icon name={icon} size={20} /></div>
          <h3 className="co-card__title" style={{ justifyContent: "center", marginBottom: 8 }}>Not built in this prototype yet</h3>
          <p className="ow-body" style={{ maxWidth: 480, margin: "0 auto" }}>{text}</p>
          <button className="co-btn co-btn--ghost" style={{ marginTop: 16 }} onClick={() => go("")}>Back to Dashboard</button>
        </div>
      </>
    );
  };

  /* ----------------------------------------------------------------- shell */

  const PulseRail = ({ section, ctx }) => {
    const openCount = ctx.opps.filter((o) => o.status !== "done").length;
    const practice = { title: "My Practice", items: [
      { id: "profile", label: "Practice Profile", icon: "building" },
      { id: "financials", label: "Financials", icon: "dollarSign" },
      { id: "operations", label: "Operations", icon: "activity" },
      { id: "team", label: "Team", icon: "users" },
      { id: "data-room", label: "Data Room", icon: "folder" },
    ] };
    const grow = { title: "Grow", items: [
      { id: "opportunities", label: "Opportunities & Plan", icon: "sparkles", badge: openCount },
      { id: "benchmarks", label: "Benchmarks", icon: "barChart" },
    ] };
    const tools = { title: ctx.future ? "Plan your sale" : "Tools", items: [
      { id: "valuation", label: "Valuation Estimate", icon: "trendUp" },
      { id: "readiness", label: "Sale Readiness", icon: "award" },
      { id: "market-check", label: "Market Check", icon: "searchCheck" },
    ] };
    // Future Seller promotes the sale-planning tools above the day-to-day groups.
    const groups = ctx.future ? [tools, practice, grow] : [practice, grow, tools];
    const item = (it) => (
      <button key={it.id} className={"co-rail__item" + (section === it.id ? " is-active" : "")} onClick={() => go(it.id === "dashboard" ? "" : it.id)}>
        <Icon name={it.icon} size={16} />
        <span className="co-rail__label" style={{ flex: 1 }}>{it.label}</span>
        {it.badge != null && <span className="co-rail__badge">{it.badge}</span>}
      </button>
    );
    return (
      <aside className="co-shell__nav">
        <div className="co-rail__brand">
          <div className="co-rail__brand-name">{CLINIC.name}</div>
          <div className="co-rail__brand-loc" style={{ font: "var(--font-micro)", color: "var(--stone-500)" }}>{CLINIC.location}</div>
        </div>
        <div className={"ow-mode" + (ctx.future ? " is-on" : "")}>
          <div>
            <div className="ow-mode__label">Future Seller</div>
            <div className="ow-mode__hint">{ctx.future ? "On · building value to sell in 3+ years" : "Off · focused on running the practice"}</div>
          </div>
          <button className={"co-switch" + (ctx.future ? " is-on" : "")} role="switch" aria-checked={ctx.future} aria-label="Future Seller" onClick={() => ctx.setFuture(!ctx.future)} />
        </div>
        <div className="ow-rail__items">
          <div className="co-rail__group-items">{item({ id: "dashboard", label: "Dashboard", icon: "home" })}</div>
          {groups.map((g) => (
            <React.Fragment key={g.title}>
              <div className="co-rail__group">{g.title}</div>
              <div className="co-rail__group-items">{g.items.map(item)}</div>
            </React.Fragment>
          ))}
        </div>
      </aside>
    );
  };

  const PulseApp = ({ section, onToast }) => {
    const [future, setFutureState] = useState(() => { try { return localStorage.getItem("co.pulse.future") === "1"; } catch (e) { return false; } });
    const [opps, setOpps] = useState(OPPS);
    const [nudges, setNudges] = useState({ paused: false, stay: null });
    const setFuture = (v) => {
      setFutureState(v);
      try { localStorage.setItem("co.pulse.future", v ? "1" : "0"); } catch (e) {}
      onToast(v ? "Future Seller on. Pages now lead with practice value." : "Future Seller off. Pages now lead with profit.");
    };
    useEffect(() => { document.title = "CareOwner · Owner Dashboard"; }, []);
    const updateOpp = (id, patch) => setOpps((list) => list.map((o) => (o.id === id ? { ...o, ...patch } : o)));
    const ctx = { future, setFuture, opps, updateOpp, nudges, setNudges, toast: onToast };
    const page = section || "dashboard";
    const pages = { dashboard: Dashboard, financials: Financials, operations: Operations, opportunities: Opportunities, valuation: Valuation };
    const Page = pages[page];
    return (
      <>
        <nav className="co-nav">
          <CareOwnerLogo />
          <span className="ow-nav__tag">Owner version · prototype</span>
          <div className="co-nav__right">
            <span className="ow-nav__sync"><i /> QuickBooks Online and ezyVet synced Nov 1</span>
            <button className="co-avatar-chip" title="Open the seller version" onClick={() => navigateTo("/practice")}>
              <span className="co-avatar">{OWNER.initials}</span>
            </button>
          </div>
        </nav>
        <div className="co-shell ow-shell">
          <PulseRail section={page} ctx={ctx} />
          <div className="co-shell__main">
            <div className="ow-main">{Page ? <Page ctx={ctx} /> : <Stub id={page} />}</div>
          </div>
        </div>
      </>
    );
  };

  window.PulseApp = PulseApp;
})();
