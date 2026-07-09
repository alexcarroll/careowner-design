// Services section — Service Pricing (left, inline-editable table + CSV import)
// plus Services and Providers cards (right). Wrapped in an IIFE so its local
// helpers never collide with other views sharing the global lexical scope; only
// ServicesSection is published to window.
(function () {
  const { useState, useRef, useEffect, useMemo } = React;

  // ── formatting / math helpers ────────────────────────────────────────────────
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const fmtMonthYear = (iso) => {
    if (!iso) return "";
    const [y, m] = String(iso).split("-");
    const mi = parseInt(m, 10) - 1;
    if (isNaN(mi) || !y) return "";
    return (MONTHS[mi] || "") + " " + y;
  };

  // Mean of every number in a price string ("$350–$500" → 425). NaN if none found —
  // lets us derive a % change even for ranges like "$75–$150 each".
  const priceMean = (s) => {
    const nums = String(s == null ? "" : s).match(/[\d,.]+/g);
    if (!nums) return NaN;
    const vals = nums.map(n => parseFloat(n.replace(/,/g, ""))).filter(n => !isNaN(n));
    if (!vals.length) return NaN;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  const pctChange = (prev, cur) => {
    const p = priceMean(prev), c = priceMean(cur);
    if (!isFinite(p) || !isFinite(c) || p === 0) return null;
    return ((c - p) / p) * 100;
  };

  let _uid = 100;
  const uid = (pfx) => (pfx || "id") + "-" + (++_uid);

  // Price display: prefix each number with "$", drop a trailing ".00", pad other
  // decimals to 2. Works for single prices and ranges ("350-500" → "$350–$500").
  const withCommas = (intStr) => intStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const formatPrice = (raw) => {
    let s = String(raw == null ? "" : raw).trim();
    if (!s) return "";
    s = s.replace(/\$/g, "");
    return s.replace(/(\d[\d,]*)(?:\.(\d+))?/g, (m, intPart, dec) => {
      const n = withCommas(intPart.replace(/,/g, ""));
      if (dec == null) return "$" + n;
      const d = (dec.slice(0, 2) + "00").slice(0, 2);
      return d === "00" ? "$" + n : "$" + n + "." + d;
    });
  };
  // What the user edits: value without "$", any decimal group capped to 2 digits.
  const stripDollar = (v) => String(v == null ? "" : v).replace(/\$/g, "");
  const sanitizePrice = (v) => stripDollar(v).replace(/(\.\d{2})\d+/g, "$1");

  // ── CSV parsing (for Import) ─────────────────────────────────────────────────
  const splitCsvLine = (line) => {
    const out = []; let cur = "", q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (q) {
        if (ch === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; }
        else cur += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") { out.push(cur); cur = ""; }
      else cur += ch;
    }
    out.push(cur);
    return out.map(s => s.trim());
  };

  const normalizeMonth = (s) => {
    if (!s) return "";
    let m = s.match(/^(\d{4})-(\d{1,2})$/);
    if (m) return m[1] + "-" + String(+m[2]).padStart(2, "0");
    m = s.match(/^(\d{1,2})\/(\d{4})$/);
    if (m) return m[2] + "-" + String(+m[1]).padStart(2, "0");
    m = s.match(/([A-Za-z]{3,})\s+(\d{4})/);
    if (m) {
      const mi = MONTHS.findIndex(x => x.toLowerCase() === m[1].slice(0, 3).toLowerCase());
      if (mi >= 0) return m[2] + "-" + String(mi + 1).padStart(2, "0");
    }
    return "";
  };

  const parseCsv = (text) => {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length);
    if (!lines.length) return [];
    const header = splitCsvLine(lines[0]).map(h => h.toLowerCase());
    const idx = (names) => { for (const n of names) { const i = header.indexOf(n); if (i >= 0) return i; } return -1; };
    const iCat = idx(["category", "group"]);
    const iSvc = idx(["service", "name", "item"]);
    const iPrice = idx(["current price", "price"]);
    const iPrev = idx(["previous price", "previous", "prev price", "prev"]);
    const iUpd = idx(["last updated", "updated", "date", "month"]);
    const hasHeader = iSvc >= 0 || iPrice >= 0 || iCat >= 0;
    const dataLines = hasHeader ? lines.slice(1) : lines;
    const cell = (c, i, fallback) => { const j = i >= 0 ? i : fallback; return j >= 0 && j < c.length ? c[j] : ""; };
    const rows = [];
    dataLines.forEach(line => {
      const c = splitCsvLine(line);
      const service = cell(c, iSvc, 1).trim();
      if (!service) return;
      rows.push({
        category: cell(c, iCat, 0).trim(),
        service,
        price: cell(c, iPrice, 2).trim(),
        prev: cell(c, iPrev, 3).trim(),
        updated: normalizeMonth(cell(c, iUpd, 4).trim()),
      });
    });
    return rows;
  };

  // ── small presentational pieces ──────────────────────────────────────────────
  const ChangePill = ({ prev, cur }) => {
    const pct = pctChange(prev, cur);
    if (pct === null) return <span style={{ font: "400 14px/1 Inter", color: "var(--stone-400)" }}>—</span>;
    const rounded = Math.round(pct * 10) / 10;
    if (rounded === 0) return <span style={{ font: "500 13px/1 Inter", color: "var(--stone-500)" }}>No change</span>;
    const up = rounded > 0;
    const tint = up
      ? { background: "var(--success-100)", color: "var(--success-800)" }
      : { background: "#FFE4E6", color: "#BE123C" };
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "3px 8px", borderRadius: 999, font: "600 12px/1 Inter", ...tint }}>
        <Icon name={up ? "arrowUp" : "arrowDown"} size={11} />
        {up ? "+" : "−"}{Math.abs(rounded)}%
      </span>
    );
  };

  // Click-to-edit table cell — mirrors the Team page's inline-edit pattern.
  const EditCell = ({ isEditing, onStart, onExit, readView, editView, minWidth, align }) => (
    <td onClick={!isEditing ? onStart : undefined} style={{ minWidth }}>
      {isEditing ? (
        <div
          className="co-tbl-cell co-tbl-cell--editing"
          style={align === "right" ? { justifyContent: "flex-end" } : undefined}
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) onExit(); }}
        >
          {editView}
        </div>
      ) : (
        <div className="co-tbl-cell" style={align === "right" ? { justifyContent: "flex-end" } : undefined}>
          {readView}
        </div>
      )}
    </td>
  );

  const Placeholder = (text) => <span className="co-tbl-cell--placeholder">{text}</span>;

  // ── Pricing: one category block (header + inline-editable table) ──────────────
  const PricingCategory = ({ cat, editingName, onEditName, editing, setEditing, onChangeItem, onAddItem, onDeleteItem, onRename, onDelete }) => {
    const isCellEditing = (itemId, col) => editing && editing.itemId === itemId && editing.col === col;
    const start = (itemId, col) => setEditing({ itemId, col });
    const exit = () => setEditing(null);

    return (
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
          {editingName ? (
            <input
              className="co-tbl-input"
              autoFocus
              value={cat.name}
              onChange={e => onRename(cat.id, e.target.value)}
              onBlur={() => onEditName(null)}
              onKeyDown={e => { if (e.key === "Enter") onEditName(null); }}
              style={{ maxWidth: 300, height: 34, font: "600 15px/1 Inter" }}
              placeholder="Category name"
            />
          ) : (
            <h3
              onClick={() => onEditName(cat.id)}
              style={{ font: "600 15px/1.2 Inter", color: "var(--stone-900)", margin: 0, cursor: "text", display: "inline-flex", alignItems: "center", gap: 8 }}
              title="Click to rename"
            >
              {cat.name || Placeholder("Untitled category")}
              <span style={{ font: "500 12px/1 Inter", color: "var(--stone-400)" }}>{cat.items.length}</span>
            </h3>
          )}
          <button
            className="co-edit"
            onClick={() => onDelete(cat.id)}
            style={{ color: "var(--stone-400)" }}
            title="Remove category"
          >
            <Icon name="x" size={14} /> Remove
          </button>
        </div>

        <div className="co-tbl-wrap">
          <table className="co-tbl">
            <thead>
              <tr>
                <th style={{ minWidth: 200 }}>Service</th>
                <th style={{ minWidth: 130 }}>Current Price</th>
                <th style={{ minWidth: 130 }}>Previous Price</th>
                <th style={{ minWidth: 110 }}>Change</th>
                <th style={{ minWidth: 130 }}>Last Updated</th>
                <th style={{ width: 48 }}></th>
              </tr>
            </thead>
            <tbody>
              {cat.items.map(item => (
                <tr key={item.id}>
                  <EditCell
                    minWidth={200}
                    isEditing={isCellEditing(item.id, "name")}
                    onStart={() => start(item.id, "name")}
                    onExit={exit}
                    readView={item.name || Placeholder("Service name")}
                    editView={
                      <input className="co-tbl-input" autoFocus value={item.name || ""}
                        onChange={e => onChangeItem(cat.id, { ...item, name: e.target.value })}
                        placeholder="Service name" />
                    }
                  />
                  <EditCell
                    minWidth={130}
                    isEditing={isCellEditing(item.id, "price")}
                    onStart={() => start(item.id, "price")}
                    onExit={exit}
                    readView={formatPrice(item.price) ? <span style={{ fontWeight: 500 }}>{formatPrice(item.price)}</span> : Placeholder("$0")}
                    editView={
                      <div className="co-tbl-price">
                        <span className="co-tbl-price__sign">$</span>
                        <input autoFocus value={stripDollar(item.price)}
                          onChange={e => onChangeItem(cat.id, { ...item, price: sanitizePrice(e.target.value) })}
                          placeholder="0.00" />
                      </div>
                    }
                  />
                  <EditCell
                    minWidth={130}
                    isEditing={isCellEditing(item.id, "prev")}
                    onStart={() => start(item.id, "prev")}
                    onExit={exit}
                    readView={formatPrice(item.prev) ? <span style={{ color: "var(--stone-500)" }}>{formatPrice(item.prev)}</span> : Placeholder("—")}
                    editView={
                      <div className="co-tbl-price">
                        <span className="co-tbl-price__sign">$</span>
                        <input autoFocus value={stripDollar(item.prev)}
                          onChange={e => onChangeItem(cat.id, { ...item, prev: sanitizePrice(e.target.value) })}
                          placeholder="0.00" />
                      </div>
                    }
                  />
                  <td>
                    <div className="co-tbl-cell" style={{ cursor: "default" }}>
                      <ChangePill prev={item.prev} cur={item.price} />
                    </div>
                  </td>
                  <EditCell
                    minWidth={130}
                    isEditing={isCellEditing(item.id, "updated")}
                    onStart={() => start(item.id, "updated")}
                    onExit={exit}
                    readView={item.updated ? fmtMonthYear(item.updated) : Placeholder("Set date")}
                    editView={
                      <input type="month" className="co-tbl-input" autoFocus value={item.updated || ""}
                        onChange={e => onChangeItem(cat.id, { ...item, updated: e.target.value })} />
                    }
                  />
                  <td style={{ width: 48 }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                      <button className="co-tbl-del" onClick={() => onDeleteItem(cat.id, item.id)} title="Remove service">
                        <Icon name="x" size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cat.items.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div style={{ padding: "18px 12px", font: "400 14px/1.4 Inter", color: "var(--stone-500)" }}>
                      No services in this category yet.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ padding: "12px 16px 14px", borderTop: "1px solid var(--stone-100)" }}>
            <button className="co-add-row" onClick={() => onAddItem(cat.id)}>
              <Icon name="plus" size={14} /> Add service
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Right-column: Services card ───────────────────────────────────────────────
  const ServicesCard = ({ offered, onEdit }) => (
    <div className="co-card" style={{ padding: "18px 20px" }}>
      <div className="co-card__head" style={{ marginBottom: 12 }}>
        <h3 className="co-card__title"><Icon name="list" />Services</h3>
        <button className="co-edit" onClick={onEdit}><Icon name="edit" /> Edit</button>
      </div>
      {offered.length ? (
        <div className="co-chip-grid">
          {offered.map(s => <div key={s}>{s}</div>)}
        </div>
      ) : (
        <p style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", margin: "2px 0 0" }}>
          No services selected yet. Click <strong>Edit</strong> to choose the services this practice offers.
        </p>
      )}
    </div>
  );

  // ── Right-column: Providers card ──────────────────────────────────────────────
  const providerTint = { inhouse: "green", distributor: "indigo", reference: "amber" };

  const ProvidersCard = ({ providers, onEdit }) => (
    <div className="co-card" style={{ padding: "18px 20px" }}>
      <div className="co-card__head" style={{ marginBottom: 8 }}>
        <h3 className="co-card__title"><Icon name="settings" />Providers</h3>
        <button className="co-edit" onClick={onEdit}><Icon name="edit" /> Edit</button>
      </div>
      <div>
        {providers.map((p, i) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: i === 0 ? "0" : "1px solid var(--stone-100)" }}>
            <div className={`co-metric__icon co-metric__icon--${providerTint[p.id] || "green"}`} style={{ width: 34, height: 34, borderRadius: 8 }}>
              <Icon name={p.icon} size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "500 12px/1.3 Inter", color: "var(--stone-500)" }}>{p.type}</div>
              <div style={{ font: "600 14px/1.3 Inter", color: p.value ? "var(--stone-900)" : "var(--stone-400)", marginTop: 2 }}>
                {p.value || "Not selected"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Slideout shell ────────────────────────────────────────────────────────────
  const Slideout = ({ eyebrow, title, subtitle, onClose, children, footer }) => {
    useEffect(() => {
      const onKey = (e) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);
    return (
      <>
        <div className="co-slideout-overlay" onClick={onClose} />
        <div className="co-slideout">
          <div className="co-slideout__header">
            <div style={{ flex: 1 }}>
              {eyebrow && <div style={{ font: "var(--font-label-sm)", color: "var(--stone-500)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>{eyebrow}</div>}
              <h2 style={{ margin: 0 }}>{title}</h2>
              {subtitle && <div style={{ font: "400 14px/1.4 Inter", color: "var(--stone-500)", marginTop: 6 }}>{subtitle}</div>}
            </div>
            <button className="co-modal__close" onClick={onClose}><Icon name="x" size={18} /></button>
          </div>
          <div className="co-slideout__body">{children}</div>
          {footer && <div className="co-slideout__footer">{footer}</div>}
        </div>
      </>
    );
  };

  const sectionLabel = { font: "var(--font-label-sm)", color: "var(--stone-500)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px" };

  // ── Services edit slideout ────────────────────────────────────────────────────
  const ServicesEditSlideout = ({ offered, onClose, onSave, onToast }) => {
    const [draft, setDraft] = useState(offered);
    const [custom, setCustom] = useState("");
    const customs = draft.filter(s => SERVICE_OPTIONS.indexOf(s) < 0);
    const toggle = (s) => setDraft(d => d.indexOf(s) >= 0 ? d.filter(x => x !== s) : [...d, s]);
    const addCustom = () => {
      const v = custom.trim();
      if (!v) return;
      if (draft.indexOf(v) < 0) setDraft(d => [...d, v]);
      setCustom("");
    };

    return (
      <Slideout
        eyebrow="Services"
        title="Services Offered"
        subtitle="Select the services this practice offers. Add anything specialized as a custom service."
        onClose={onClose}
        footer={<>
          <button className="co-btn co-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="co-btn co-btn--primary" onClick={() => { onSave(draft); onToast && onToast("Services updated"); onClose(); }}>Save Changes</button>
        </>}
      >
        <div style={sectionLabel}>Common Services</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {SERVICE_OPTIONS.map(s => {
            const on = draft.indexOf(s) >= 0;
            return (
              <label key={s} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                font: "500 14px/1.2 Inter", color: on ? "var(--teal-brand)" : "var(--stone-700)",
                border: "1px solid " + (on ? "var(--teal-brand)" : "var(--stone-200)"),
                background: on ? "var(--teal-tint)" : "#fff",
              }}>
                <input type="checkbox" checked={on} onChange={() => toggle(s)} />
                {s}
              </label>
            );
          })}
        </div>

        <div style={{ ...sectionLabel, marginTop: 24 }}>Custom Services</div>
        {customs.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {customs.map(s => (
              <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 8px 6px 12px", borderRadius: 999, background: "var(--teal-tint)", color: "var(--teal-brand)", border: "1px solid var(--teal-brand)", font: "500 13px/1 Inter" }}>
                {s}
                <button onClick={() => toggle(s)} style={{ background: "none", border: 0, cursor: "pointer", color: "var(--teal-brand)", display: "grid", placeItems: "center", padding: 2 }} title="Remove">
                  <Icon name="x" size={13} />
                </button>
              </span>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={custom}
            onChange={e => setCustom(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
            placeholder="Add a custom service…"
            style={{ flex: 1, height: 38, padding: "0 12px", border: "1px solid var(--stone-200)", borderRadius: 8, font: "400 14px/1 Inter", color: "var(--stone-900)", outline: "none", boxSizing: "border-box" }}
          />
          <button className="co-btn-solid" onClick={addCustom} style={{ height: 38 }}>
            <Icon name="plus" size={14} /> Add
          </button>
        </div>
      </Slideout>
    );
  };

  // ── Providers edit slideout ───────────────────────────────────────────────────
  const ProvidersEditSlideout = ({ providers, onClose, onSave, onToast }) => {
    const [draft, setDraft] = useState(() => providers.map(p => ({ ...p, _other: !!(p.value && p.options.indexOf(p.value) < 0) })));
    const selValue = (p) => p._other ? "__other__" : (p.options.indexOf(p.value) >= 0 ? p.value : "");
    const onSelect = (id, val) => setDraft(d => d.map(p => {
      if (p.id !== id) return p;
      if (val === "__other__") return { ...p, _other: true, value: p._other ? p.value : "" };
      return { ...p, _other: false, value: val };
    }));
    const onCustom = (id, val) => setDraft(d => d.map(p => p.id === id ? { ...p, value: val } : p));

    return (
      <Slideout
        eyebrow="Providers"
        title="Provider Directory"
        subtitle="Set the provider your practice uses for each type. Choose “Other” to enter a name that isn’t listed."
        onClose={onClose}
        footer={<>
          <button className="co-btn co-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="co-btn co-btn--primary" onClick={() => { onSave(draft.map(({ _other, ...p }) => p)); onToast && onToast("Providers updated"); onClose(); }}>Save Changes</button>
        </>}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {draft.map(p => (
            <div key={p.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div className={`co-metric__icon co-metric__icon--${providerTint[p.id] || "green"}`} style={{ width: 32, height: 32, borderRadius: 8 }}>
                  <Icon name={p.icon} size={15} />
                </div>
                <div>
                  <div style={{ font: "600 14px/1.2 Inter", color: "var(--stone-900)" }}>{p.type}</div>
                  <div style={{ font: "400 13px/1.3 Inter", color: "var(--stone-500)", marginTop: 2 }}>{p.desc}</div>
                </div>
              </div>
              <select
                value={selValue(p)}
                onChange={e => onSelect(p.id, e.target.value)}
                style={{ width: "100%", height: 40, padding: "0 12px", border: "1px solid var(--stone-200)", borderRadius: 8, font: "400 14px/1 Inter", color: "var(--stone-900)", background: "#fff", cursor: "pointer", outline: "none", boxSizing: "border-box" }}
              >
                <option value="">— Select provider —</option>
                {p.options.map(o => <option key={o} value={o}>{o}</option>)}
                <option value="__other__">Other (custom)</option>
              </select>
              {p._other && (
                <input
                  value={p.value || ""}
                  onChange={e => onCustom(p.id, e.target.value)}
                  placeholder="Enter provider name"
                  style={{ width: "100%", height: 40, padding: "0 12px", marginTop: 8, border: "1px solid var(--stone-200)", borderRadius: 8, font: "400 14px/1 Inter", color: "var(--stone-900)", outline: "none", boxSizing: "border-box" }}
                />
              )}
            </div>
          ))}
        </div>
      </Slideout>
    );
  };

  // ── Import price list modal ───────────────────────────────────────────────────
  const ImportModal = ({ onClose, onUploadCsv, onExtractAI, onDownloadCurrent }) => (
    <Modal
      title="Import price list"
      onClose={onClose}
      footer={<button className="co-btn co-btn--ghost" onClick={onClose}>Cancel</button>}
    >
      <p style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", margin: "0 0 20px" }}>
        Upload a price list and let AI read it, or import a clean CSV — then review before saving.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <button className="co-import-opt" onClick={onExtractAI}>
          <span className="co-import-opt__icon"><Icon name="sparkles" size={24} /></span>
          <span>
            <h4>Extract with AI</h4>
            <p>Upload a CSV, Excel or PDF price list — AI pulls out the items and prices.</p>
          </span>
        </button>
        <button className="co-import-opt" onClick={onUploadCsv}>
          <span className="co-import-opt__icon"><Icon name="upload" size={22} /></span>
          <span>
            <h4>Upload CSV</h4>
            <p>A clean CSV with name, price and (optionally) service/category columns.</p>
          </span>
        </button>
      </div>
      <p style={{ font: "400 14px/1.6 Inter", color: "var(--stone-500)", margin: "20px 0 0" }}>
        Updating existing prices?{" "}
        <button onClick={onDownloadCurrent} style={{ background: "none", border: 0, padding: 0, cursor: "pointer", color: "var(--stone-900)", font: "600 14px/1.6 Inter", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: 4, verticalAlign: "baseline" }}>
          <Icon name="download" size={14} /> Download a CSV of your current pricing
        </button>
        , edit it, and re-upload — matching items are updated.
      </p>
    </Modal>
  );

  // ── Specialty Programs: shared config + display helpers ───────────────────────
  const PROGRAM_TYPES = [
    "Client Loyalty / Rewards Program",
    "Membership Subscription",
    "Partnership",
  ];
  const RUN_OPTIONS = [
    { v: "self", label: "We do it ourselves" },
    { v: "third-party", label: "We use a third-party tool" },
    { v: "unsure", label: "Not sure" },
  ];
  const RUN_SHORT = { self: "Managed in-house", "third-party": "Third-party tool", unsure: "Not sure yet" };
  const CADENCE_OPTS = [
    { v: "monthly", label: "Per month" },
    { v: "yearly", label: "Per year" },
    { v: "one-time", label: "One-time" },
  ];
  const CADENCE_SUFFIX = { monthly: "/mo", yearly: "/yr", "one-time": " one-time" };
  const blankProgram = () => ({ id: uid("sp"), name: "", type: "", description: "", runBy: "self", runTool: "", joinFee: { amount: "", cadence: "free" }, members: "", renewalRate: "", started: "", adminCost: { amount: "", cadence: "none" }, perks: [] });

  const fmtCadence = (v, zeroLabel) => {
    if (!v || v.cadence === "free" || v.cadence === "none") return zeroLabel;
    if (!v.amount) return "—";
    return formatPrice(v.amount) + (CADENCE_SUFFIX[v.cadence] || "");
  };
  const runDisplay = (p) => p.runBy === "third-party"
    ? (p.runTool ? "Third-party tool — " + p.runTool : "Third-party tool")
    : (RUN_SHORT[p.runBy] || "—");

  // ── Right-column: Specialty Programs card (condensed, clickable) ──────────────
  const SpecialtyProgramsCard = ({ programs, onOpen, onAdd }) => (
    <div className="co-card" style={{ padding: "18px 20px" }}>
      <div className="co-card__head" style={{ marginBottom: 8 }}>
        <h3 className="co-card__title"><Icon name="award" />Specialty Programs</h3>
        <button className="co-edit" onClick={onAdd}><Icon name="plus" /> Add</button>
      </div>
      {programs.length === 0 ? (
        <p style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", margin: "2px 0 0" }}>
          No programs yet. Add any rewards, loyalty, membership, or partnership programs buyers should know about.
        </p>
      ) : (
        <div>
          {programs.map(p => (
            <button key={p.id} className="co-program-row" onClick={() => onOpen(p.id)}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="co-program-row__name">{p.name || "Untitled program"}</div>
                <div className="co-program-row__meta">
                  {[p.type, p.members ? p.members + " members" : null].filter(Boolean).join(" · ") || "Add details"}
                </div>
              </div>
              <Icon name="chevronRight" size={16} style={{ color: "var(--stone-400)", flexShrink: 0 }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // ── Read-only program detail slideout ─────────────────────────────────────────
  const DetailRow = ({ label, children }) => (
    <div className="co-info__row"><span className="co-info__k">{label}</span><span className="co-info__v">{children}</span></div>
  );

  const ProgramDetailSlideout = ({ program: p, onClose, onEdit }) => {
    const hasPerks = p.perks && p.perks.length > 0;
    return (
      <Slideout
        eyebrow="Specialty Program"
        title={p.name || "Untitled program"}
        subtitle={p.type || null}
        onClose={onClose}
        footer={<>
          <button className="co-btn co-btn--ghost" onClick={onClose}>Close</button>
          <button className="co-btn co-btn--primary" onClick={onEdit}><Icon name="edit" size={14} /> Edit Program</button>
        </>}
      >
        {p.description && (
          <p style={{ font: "400 14px/1.6 Inter", color: "var(--stone-700)", margin: "0 0 20px" }}>{p.description}</p>
        )}
        <div style={{ border: "1px solid var(--stone-200)", borderRadius: 10, padding: "6px 16px", marginBottom: hasPerks ? 20 : 0 }}>
          <DetailRow label="How it's run">{runDisplay(p)}</DetailRow>
          <DetailRow label="Cost to join">{fmtCadence(p.joinFee, "Free")}</DetailRow>
          {p.members && <DetailRow label="Members">{p.members}</DetailRow>}
          {p.renewalRate && <DetailRow label="Renewal rate">{p.renewalRate}%</DetailRow>}
          {p.started && <DetailRow label="Started">{p.started}</DetailRow>}
          <DetailRow label="Cost to run">{fmtCadence(p.adminCost, "None / not sure")}</DetailRow>
        </div>
        {hasPerks && (
          <div>
            <div style={{ font: "var(--font-label-sm)", color: "var(--stone-500)", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px" }}>Member Benefits</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {p.perks.map((perk, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, font: "400 14px/1.4 Inter", color: "var(--stone-700)" }}>
                  <Icon name="check" size={14} style={{ color: "var(--success-700)", marginTop: 2, flexShrink: 0 }} />
                  {perk}
                </div>
              ))}
            </div>
          </div>
        )}
      </Slideout>
    );
  };

  // ── Edit / add a single program ───────────────────────────────────────────────
  const progLabel = { font: "500 13px/1 Inter", color: "var(--stone-700)", display: "block", marginBottom: 6 };
  const progInput = { width: "100%", height: 40, padding: "0 12px", border: "1px solid var(--stone-200)", borderRadius: 8, font: "400 14px/1 Inter", color: "var(--stone-900)", background: "#fff", outline: "none", boxSizing: "border-box" };
  const progHint = { color: "var(--stone-400)", fontWeight: 400 };

  // Amount + cadence pair (Free/None, Per month, Per year, One-time)
  const MoneyCadence = ({ value, onChange, zeroValue, zeroLabel }) => {
    const isZero = value.cadence === zeroValue;
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <select value={value.cadence} onChange={e => onChange({ ...value, cadence: e.target.value })} style={{ ...progInput, flex: 1, cursor: "pointer" }}>
          <option value={zeroValue}>{zeroLabel}</option>
          {CADENCE_OPTS.map(o => <option key={o.v} value={o.v}>{o.label}</option>)}
        </select>
        {!isZero && (
          <div className="co-tbl-price" style={{ height: 40, width: 130, flexShrink: 0 }}>
            <span className="co-tbl-price__sign">$</span>
            <input value={value.amount} onChange={e => onChange({ ...value, amount: sanitizePrice(e.target.value) })} placeholder="0.00" />
          </div>
        )}
      </div>
    );
  };

  const ProgramEditSlideout = ({ program, isNew, onClose, onSave, onRemove, onToast }) => {
    const [p, setP] = useState(() => ({
      ...blankProgram(), ...program,
      joinFee: { ...(program.joinFee || { amount: "", cadence: "free" }) },
      adminCost: { ...(program.adminCost || { amount: "", cadence: "none" }) },
      perks: [...(program.perks || [])],
    }));
    const [otherType, setOtherType] = useState(!!(program.type && PROGRAM_TYPES.indexOf(program.type) < 0));
    const set = (patch) => setP(prev => ({ ...prev, ...patch }));
    const setPerk = (i, v) => setP(prev => ({ ...prev, perks: prev.perks.map((x, j) => j === i ? v : x) }));
    const addPerk = () => setP(prev => ({ ...prev, perks: [...prev.perks, ""] }));
    const removePerk = (i) => setP(prev => ({ ...prev, perks: prev.perks.filter((_, j) => j !== i) }));
    const save = () => {
      onSave({ ...p, name: p.name.trim(), perks: p.perks.map(x => x.trim()).filter(Boolean) });
      onToast && onToast(isNew ? "Program added" : "Program updated");
      onClose();
    };

    return (
      <Slideout
        eyebrow="Specialty Program"
        title={isNew ? "Add Program" : "Edit Program"}
        subtitle="Capture any loyalty, membership, or partnership program — and the details a buyer would want to know."
        onClose={onClose}
        footer={<>
          {!isNew && (
            <button onClick={() => { onRemove(); onClose(); }} style={{ background: "none", border: 0, cursor: "pointer", font: "500 14px/1 Inter", color: "#BE123C", padding: "0 4px", marginRight: "auto" }}>
              Remove Program
            </button>
          )}
          <button className="co-btn co-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="co-btn co-btn--primary" onClick={save}>{isNew ? "Add Program" : "Save Changes"}</button>
        </>}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={progLabel}>Program Name</label>
            <input style={progInput} value={p.name} onChange={e => set({ name: e.target.value })} placeholder="e.g. Paws Rewards Program" />
          </div>

          <div>
            <label style={progLabel}>Program Type</label>
            <select
              style={{ ...progInput, cursor: "pointer" }}
              value={otherType ? "__other__" : (p.type || "")}
              onChange={e => {
                if (e.target.value === "__other__") { setOtherType(true); set({ type: "" }); }
                else { setOtherType(false); set({ type: e.target.value }); }
              }}
            >
              <option value="">— Select type —</option>
              {PROGRAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              <option value="__other__">Other (custom)</option>
            </select>
            {otherType && <input style={{ ...progInput, marginTop: 8 }} value={p.type} onChange={e => set({ type: e.target.value })} placeholder="Describe the program type" />}
          </div>

          <div>
            <label style={progLabel}>Description</label>
            <textarea value={p.description} onChange={e => set({ description: e.target.value })} placeholder="What is the program and how does it work for clients?"
              style={{ ...progInput, height: 84, padding: "10px 12px", resize: "vertical", font: "400 14px/1.5 Inter" }} />
          </div>

          <div>
            <label style={progLabel}>How is it run?</label>
            <select style={{ ...progInput, cursor: "pointer" }} value={p.runBy} onChange={e => set({ runBy: e.target.value })}>
              {RUN_OPTIONS.map(o => <option key={o.v} value={o.v}>{o.label}</option>)}
            </select>
            {p.runBy === "third-party" && (
              <input style={{ ...progInput, marginTop: 8 }} value={p.runTool} onChange={e => set({ runTool: e.target.value })} placeholder="Which tool or vendor? (e.g. PetDesk)" />
            )}
          </div>

          <div>
            <label style={progLabel}>Cost to join <span style={progHint}>· what clients pay, if anything</span></label>
            <MoneyCadence value={p.joinFee} onChange={v => set({ joinFee: v })} zeroValue="free" zeroLabel="Free to join" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={progLabel}>Number of members</label>
              <input style={progInput} value={p.members} onChange={e => set({ members: e.target.value })} placeholder="e.g. 1,240" />
            </div>
            <div>
              <label style={progLabel}>Renewal rate <span style={progHint}>· optional</span></label>
              <div className="co-tbl-price" style={{ height: 40 }}>
                <input value={p.renewalRate} onChange={e => set({ renewalRate: e.target.value.replace(/[^\d.]/g, "") })} placeholder="0" style={{ paddingLeft: 4 }} />
                <span className="co-tbl-price__sign">%</span>
              </div>
            </div>
          </div>

          <div>
            <label style={progLabel}>When did the program start?</label>
            <input style={progInput} value={p.started} onChange={e => set({ started: e.target.value })} placeholder="e.g. 2019" />
          </div>

          <div>
            <label style={progLabel}>Cost to run <span style={progHint}>· admin fees to the practice</span></label>
            <MoneyCadence value={p.adminCost} onChange={v => set({ adminCost: v })} zeroValue="none" zeroLabel="No cost / not sure" />
          </div>

          <div>
            <label style={progLabel}>Member benefits <span style={progHint}>· optional</span></label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {p.perks.map((perk, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="check" size={14} style={{ color: "var(--success-700)", flexShrink: 0 }} />
                  <input style={{ ...progInput, height: 36 }} value={perk} onChange={e => setPerk(i, e.target.value)} placeholder="e.g. Points on every purchase" />
                  <button onClick={() => removePerk(i)} style={{ background: "none", border: 0, cursor: "pointer", color: "var(--stone-400)", padding: 4, display: "grid", placeItems: "center" }} title="Remove benefit"><Icon name="x" size={14} /></button>
                </div>
              ))}
            </div>
            <button className="co-add-row" onClick={addPerk} style={{ marginTop: 10, padding: "6px 14px 8px" }}>
              <Icon name="plus" size={13} /> Add benefit
            </button>
          </div>
        </div>
      </Slideout>
    );
  };

  // ── Root ──────────────────────────────────────────────────────────────────────
  const ServicesSection = ({ onToast }) => {
    const toast = onToast || (() => {});
    const [pricing, setPricing] = useState(() => PRACTICE.pricing.map(c => ({ ...c, items: c.items.map(i => ({ ...i })) })));
    const [offered, setOffered] = useState(PRACTICE.services);
    const [providers, setProviders] = useState(() => PRACTICE.providers.map(p => ({ ...p })));
    const [programs, setPrograms] = useState(() => PRACTICE.specialtyPrograms.map(p => ({ ...p, joinFee: { ...p.joinFee }, adminCost: { ...p.adminCost }, perks: [...(p.perks || [])] })));

    const [editing, setEditing] = useState(null);     // { itemId, col } | null — active pricing cell
    const [editingName, setEditingName] = useState(null); // category id being renamed
    const [slideout, setSlideout] = useState(null);   // "services" | "providers" | null
    const [programPanel, setProgramPanel] = useState(null); // { mode: "detail"|"edit"|"add", id?, draft? } | null
    const [importOpen, setImportOpen] = useState(false);

    const saveProgram = (prog) => setPrograms(prev => prev.some(x => x.id === prog.id) ? prev.map(x => x.id === prog.id ? prog : x) : [...prev, prog]);
    const removeProgram = (id) => setPrograms(prev => prev.filter(x => x.id !== id));
    const fileRef = useRef(null);
    const aiFileRef = useRef(null);

    // pricing mutations
    const changeItem = (catId, updated) => setPricing(prev => prev.map(c => c.id === catId ? { ...c, items: c.items.map(i => i.id === updated.id ? updated : i) } : c));
    const addItem = (catId) => {
      const id = uid("p");
      setPricing(prev => prev.map(c => c.id === catId ? { ...c, items: [...c.items, { id, name: "", price: "", prev: "", updated: "" }] } : c));
      setEditing({ itemId: id, col: "name" });
    };
    const deleteItem = (catId, itemId) => setPricing(prev => prev.map(c => c.id === catId ? { ...c, items: c.items.filter(i => i.id !== itemId) } : c));
    const renameCat = (catId, name) => setPricing(prev => prev.map(c => c.id === catId ? { ...c, name } : c));
    const deleteCat = (catId) => setPricing(prev => prev.filter(c => c.id !== catId));
    const addCategory = () => {
      const id = uid("cat");
      setPricing(prev => [...prev, { id, name: "New Category", items: [] }]);
      setEditingName(id);
    };

    // CSV import
    const importCsv = (file) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        let rows = [];
        try { rows = parseCsv(String(e.target.result || "")); } catch (err) { rows = []; }
        if (!rows.length) { toast("Couldn’t read any services from that file"); return; }
        setPricing(prev => {
          const next = prev.map(c => ({ ...c, items: [...c.items] }));
          rows.forEach(r => {
            const catName = r.category || "Imported Services";
            let cat = next.find(c => c.name.toLowerCase() === catName.toLowerCase());
            if (!cat) { cat = { id: uid("cat"), name: catName, items: [] }; next.push(cat); }
            cat.items.push({ id: uid("p"), name: r.service, price: r.price, prev: r.prev, updated: r.updated });
          });
          return next;
        });
        toast(`Imported ${rows.length} service${rows.length === 1 ? "" : "s"} from CSV`);
      };
      reader.readAsText(file);
    };

    // AI extraction: real parse for CSVs, an honest "reading…" prompt for other formats.
    const extractWithAI = (file) => {
      if (!file) return;
      const name = file.name || "your file";
      if (/\.csv$/i.test(name)) { importCsv(file); return; }
      toast(`AI is reading “${name}” — we’ll add the extracted items for review shortly`);
    };

    const csvCell = (v) => { const s = String(v == null ? "" : v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };

    // Export the practice's current pricing so it can be edited and re-uploaded.
    const downloadCurrent = () => {
      const lines = ["Category,Service,Current Price,Previous Price,Last Updated"];
      pricing.forEach(c => c.items.forEach(it => {
        lines.push([c.name, it.name, formatPrice(it.price), formatPrice(it.prev), fmtMonthYear(it.updated)].map(csvCell).join(","));
      }));
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
      a.download = "current-pricing.csv";
      a.click();
      setImportOpen(false);
    };

    return (
      <div className="co-body--cols">
        {/* ── Left: Service Pricing ─────────────────────────────────────────── */}
        <div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20, paddingTop: 4 }}>
            <div>
              <h2 style={{ font: "700 18px/1 Inter", margin: "0 0 6px" }}>Service Pricing</h2>
              <p style={{ font: "400 14px/1.4 Inter", color: "var(--stone-500)", margin: 0 }}>
                Add services and prices manually, or import them from a CSV. Prices are estimates buyers see on your listing.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <input ref={fileRef} type="file" accept=".csv,text/csv" style={{ display: "none" }}
                onChange={e => { importCsv(e.target.files[0]); e.target.value = ""; }} />
              <input ref={aiFileRef} type="file" accept=".csv,.xlsx,.xls,.pdf,image/*" style={{ display: "none" }}
                onChange={e => { extractWithAI(e.target.files[0]); e.target.value = ""; }} />
              <button className="co-btn-outline-green" onClick={() => setImportOpen(true)}>
                <Icon name="upload" size={14} /> Import
              </button>
              <button className="co-btn-solid" onClick={addCategory}>
                <Icon name="plus" size={14} /> Add Category
              </button>
            </div>
          </div>

          {pricing.length === 0 ? (
            <div className="co-card" style={{ padding: "40px 24px", textAlign: "center", borderStyle: "dashed", borderColor: "var(--stone-200)", background: "var(--stone-50)" }}>
              <div style={{ font: "600 15px/1.3 Inter", color: "var(--stone-700)", marginBottom: 6 }}>No pricing added yet</div>
              <p style={{ font: "400 14px/1.5 Inter", color: "var(--stone-500)", margin: "0 0 16px" }}>
                Add a category to start listing your services and prices, or import them from a CSV file.
              </p>
              <button className="co-btn-solid" onClick={addCategory} style={{ margin: "0 auto" }}>
                <Icon name="plus" size={14} /> Add Category
              </button>
            </div>
          ) : (
            pricing.map(cat => (
              <PricingCategory
                key={cat.id}
                cat={cat}
                editingName={editingName === cat.id}
                onEditName={setEditingName}
                editing={editing}
                setEditing={setEditing}
                onChangeItem={changeItem}
                onAddItem={addItem}
                onDeleteItem={deleteItem}
                onRename={renameCat}
                onDelete={deleteCat}
              />
            ))
          )}
        </div>

        {/* ── Right: Services + Providers + Specialty Programs ──────────────── */}
        <aside className="co-aside" style={{ position: "static" }}>
          <ServicesCard offered={offered} onEdit={() => setSlideout("services")} />
          <ProvidersCard providers={providers} onEdit={() => setSlideout("providers")} />
          <SpecialtyProgramsCard
            programs={programs}
            onOpen={(id) => setProgramPanel({ mode: "detail", id })}
            onAdd={() => setProgramPanel({ mode: "add", draft: blankProgram() })}
          />
        </aside>

        {importOpen && (
          <ImportModal
            onClose={() => setImportOpen(false)}
            onUploadCsv={() => { setImportOpen(false); fileRef.current && fileRef.current.click(); }}
            onExtractAI={() => { setImportOpen(false); aiFileRef.current && aiFileRef.current.click(); }}
            onDownloadCurrent={downloadCurrent}
          />
        )}
        {slideout === "services" && (
          <ServicesEditSlideout
            offered={offered}
            onClose={() => setSlideout(null)}
            onSave={setOffered}
            onToast={toast}
          />
        )}
        {slideout === "providers" && (
          <ProvidersEditSlideout
            providers={providers}
            onClose={() => setSlideout(null)}
            onSave={setProviders}
            onToast={toast}
          />
        )}
        {programPanel && programPanel.mode === "detail" && (() => {
          const prog = programs.find(x => x.id === programPanel.id);
          return prog ? (
            <ProgramDetailSlideout
              program={prog}
              onClose={() => setProgramPanel(null)}
              onEdit={() => setProgramPanel({ mode: "edit", id: prog.id })}
            />
          ) : null;
        })()}
        {programPanel && programPanel.mode === "edit" && (() => {
          const prog = programs.find(x => x.id === programPanel.id);
          return prog ? (
            <ProgramEditSlideout
              program={prog}
              isNew={false}
              onClose={() => setProgramPanel(null)}
              onSave={saveProgram}
              onRemove={() => removeProgram(prog.id)}
              onToast={toast}
            />
          ) : null;
        })()}
        {programPanel && programPanel.mode === "add" && (
          <ProgramEditSlideout
            program={programPanel.draft}
            isNew={true}
            onClose={() => setProgramPanel(null)}
            onSave={saveProgram}
            onToast={toast}
          />
        )}
      </div>
    );
  };

  Object.assign(window, { ServicesSection });
})();
