// Preview Listing card + the Listing Editor slideout (image / title / description).
// The slideout is shared: opened from the Practice Overview "Listing Preview" card
// and from the Marketplace "Manage My Listing" button. Status is intentionally NOT
// editable here — it reflects the live state of the listing, not something the
// seller sets directly.

// A marketplace-style card showing the seller's own listing. `listing` supplies
// { title, description, image, titlePending, descriptionPending }.
const PreviewListingCard = ({ listing }) => (
  <article className="mk-card mk-card--preview">
    <div className="mk-media" style={{ height: 170 }}>
      <img src={listing.image} alt="Listing preview" />
    </div>
    <div className="mk-body">
      <div className="mk-meta">
        <span>IL</span><span className="mk-meta__sep" />
        <span>Suburban</span><span className="mk-meta__sep" />
        <span>Small Animal</span>
      </div>
      <h3 className="mk-title">{listing.title}</h3>
      {listing.titlePending && (
        <span className="le-pending" style={{ marginBottom: 10 }}><Icon name="clock" size={12} /> Title update in review</span>
      )}
      <p className="mk-desc">{listing.description}</p>
      {listing.descriptionPending && (
        <span className="le-pending" style={{ marginTop: 8, marginBottom: 2 }}><Icon name="clock" size={12} /> Description update in review</span>
      )}
      <div className="mk-divider" />
      <div className="mk-stats">
        <div className="mk-stat">
          <span className="mk-stat__label">FTE DVMs</span>
          <span className="mk-stat__val">{PRACTICE.doctors}<small>· {PRACTICE.team.partTime} PT</small></span>
        </div>
        <div className="mk-stat mk-stat--revenue">
          <span className="mk-stat__label">Revenue</span>
          <span className="mk-stat__val mk-rev">
            <span><span className="mk-rev__k">2025</span> $836K</span>
            <span><span className="mk-rev__k">YTD</span> $541.2K</span>
            <span className="mk-rev__yoy">+10%</span>
          </span>
        </div>
      </div>
    </div>
  </article>
);

// ── Listing photo — gallery card + "Generate with AI" takeover ────────
const ListingPhotoSection = ({ savedImage, savedIsAI, onSave, onToast }) => {
  const [draftImage, setDraftImage] = React.useState(savedImage);
  const [draftIsAI, setDraftIsAI] = React.useState(savedIsAI);
  const [mode, setMode] = React.useState("gallery"); // gallery | ai-idle | ai-loading | ai-review
  const [candidate, setCandidate] = React.useState(null);
  const [aiUses, setAiUses] = React.useState(MY_LISTING.aiUses);
  const genIdx = React.useRef(0);
  const timer = React.useRef(null);
  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const remaining = AI_IMAGE_LIMIT - aiUses;
  const dirty = draftImage !== savedImage || draftIsAI !== savedIsAI;

  const nextCandidate = () => {
    const pool = LISTING_IMAGE_LIBRARY;
    let img;
    for (let i = 0; i < pool.length; i++) {
      img = pool[genIdx.current % pool.length];
      genIdx.current++;
      if (img !== draftImage && img !== candidate) break;
    }
    return img;
  };

  const runGeneration = () => {
    if (aiUses >= AI_IMAGE_LIMIT) return;
    setMode("ai-loading");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const used = aiUses + 1;
      setAiUses(used);
      updateMyListing({ aiUses: used }); // consumed on generation, whether or not it's ultimately used
      setCandidate(nextCandidate());
      setMode("ai-review");
    }, 1400);
  };

  const selectThumb = (img) => { setDraftImage(img); setDraftIsAI(false); };
  const acceptCandidate = () => { setDraftImage(candidate); setDraftIsAI(true); setCandidate(null); setMode("gallery"); };
  const exitAiFlow = () => { setMode("gallery"); setCandidate(null); };

  const cancelGallery = () => { setDraftImage(savedImage); setDraftIsAI(savedIsAI); };
  const saveGallery = () => { onSave({ image: draftImage, imageIsAI: draftIsAI }); onToast("Listing photo updated"); };

  return (
    <div className="le-section">
      <div className="le-label">Listing photo</div>
      <p className="le-help">To maintain privacy, we do not allow custom uploads for the public view of your marketplace listing.</p>

      {mode === "gallery" && (
        <div className="le-gallery-card">
          <div className="le-gallery-card__head">
            <span className="le-gallery-eyebrow">Select from gallery</span>
            <div className="le-gallery-card__head-right">
              or
              <button className="le-ai-link" onClick={() => setMode("ai-idle")}><Icon name="sparkles" size={14} /> Generate with AI</button>
            </div>
          </div>
          <div className="le-gallery-body">
            <div className="le-thumbrail">
              {MY_LISTING_RECOMMENDED_IMAGES.map(img => {
                const active = draftImage === img && !draftIsAI;
                return (
                  <button key={img} className={`le-thumb ${active ? "is-selected" : ""}`} onClick={() => selectThumb(img)}>
                    <img src={img} alt="" loading="lazy" />
                    {active && <span className="le-thumb__check"><Icon name="check" size={12} /></span>}
                  </button>
                );
              })}
            </div>
            <div className="le-hero">
              <img src={draftImage} alt="Selected listing" />
              {draftIsAI && <span className="le-hero__badge"><Icon name="sparkles" size={12} /> AI generated</span>}
            </div>
          </div>
          <div className="le-gallery-foot">
            <button className="co-btn co-btn--ghost" onClick={cancelGallery}>Cancel</button>
            <button className="co-btn co-btn--primary" disabled={!dirty} onClick={saveGallery}>Save image</button>
          </div>
        </div>
      )}

      {mode === "ai-idle" && (
        <div className="le-ai-takeover">
          <div className="le-ai-takeover__heading">
            <h4>Generate custom image with AI</h4>
            <p>AI will create an original illustrated watercolor image that may include nods to your location, practice type, and other subtle elements without revealing your practice’s identity.</p>
          </div>
          <div className="le-ai-takeover__cta">
            <button className="le-ai-gen-btn" disabled={remaining <= 0} onClick={runGeneration}><Icon name="sparkles" size={14} /> Generate AI image</button>
            <span className="le-ai-counter">{remaining} of {AI_IMAGE_LIMIT} generations left</span>
          </div>
          <button className="co-btn co-btn--ghost" onClick={exitAiFlow}>Cancel</button>
        </div>
      )}

      {mode === "ai-loading" && (
        <div className="le-ai-takeover">
          <div className="le-ai-loading">
            <div className="le-spinner" />
            <div className="le-ai-takeover__heading">
              <h4>Generating your custom illustration…</h4>
              <p>Blending your practice type, location, and setting into an original watercolor.</p>
            </div>
          </div>
        </div>
      )}

      {mode === "ai-review" && (
        <div className="le-ai-takeover">
          <div className="le-ai-review">
            <div className="le-hero">
              <img src={candidate} alt="AI generated option" />
              <span className="le-hero__badge"><Icon name="sparkles" size={12} /> AI generated</span>
            </div>
            <p className="le-ai-review__meta">Generated from your practice profile · {remaining} of {AI_IMAGE_LIMIT} generations left</p>
            <div className="le-ai-review__actions">
              <button className="co-btn co-btn--primary" onClick={acceptCandidate}><Icon name="check" size={15} /> Use this image</button>
              <button className="co-btn co-btn--ghost" onClick={runGeneration} disabled={remaining <= 0}><Icon name="refreshCw" size={14} /> Regenerate</button>
              <button className="co-btn co-btn--ghost" onClick={exitAiFlow}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Listing title / Description — shared "must Send for approval" pattern ──
// AI-authored edits publish instantly; manual edits are held as pending until
// CareOwner approves them. Either way, typing alone does nothing — the seller
// must explicitly click Send for approval (or Undo changes to discard).
const EditableField = ({ label, help, maxLength, multiline, aiSuggestions, current, pending, onCommit, onToast }) => {
  const authoritative = pending != null ? pending : current;
  const [draft, setDraft] = React.useState(authoritative);
  const [source, setSource] = React.useState("current"); // current | manual | ai
  const aiIdx = React.useRef(0);

  const dirty = draft.trim() !== authoritative.trim() && draft.trim().length > 0;

  const generate = () => {
    let t = aiSuggestions[aiIdx.current % aiSuggestions.length];
    if (t === draft) { aiIdx.current++; t = aiSuggestions[aiIdx.current % aiSuggestions.length]; }
    aiIdx.current++;
    setDraft(t);
    setSource("ai");
  };

  const undo = () => { setDraft(authoritative); setSource("current"); };
  const send = () => {
    if (!dirty) return;
    if (source === "ai") { onCommit({ value: draft.trim(), isAiPublish: true }); onToast(`${label} updated — live now`); }
    else { onCommit({ value: draft.trim(), isAiPublish: false }); onToast(`${label} sent for approval`); }
    setSource("current");
  };

  const Field = multiline ? "textarea" : "input";

  return (
    <div className="le-section">
      <div className="le-label">
        {label}
        <button className="le-ai-link" onClick={generate}><Icon name="sparkles" size={13} /> Generate with AI</button>
      </div>
      {help && <p className="le-help">{help}</p>}
      <Field className={`le-input ${multiline ? "le-textarea" : ""}`} value={draft} maxLength={maxLength} rows={multiline ? 4 : undefined}
        onChange={e => { setDraft(e.target.value); setSource("manual"); }} />
      <div className="le-field-foot">
        <span className="le-counter">{draft.length}/{maxLength} characters</span>
        <div className="le-field-actions">
          <button className="co-btn co-btn--ghost" disabled={!dirty} onClick={undo}>Undo changes</button>
          <button className="co-btn co-btn--primary" disabled={!dirty} onClick={send}>Send for approval</button>
        </div>
      </div>
      {dirty && (
        source === "manual"
          ? <p className="le-note le-note--warn"><Icon name="clock" size={13} /> Manual edits are reviewed by CareOwner before going live.</p>
          : <p className="le-note le-note--ok"><Icon name="sparkles" size={13} /> AI-written text publishes instantly — no review needed.</p>
      )}
    </div>
  );
};

const ListingEditorSlideout = ({ onClose, onToast, onEditProfile, fromMarketplace }) => {
  const listing = useMyListing();

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className="co-slideout-overlay" onClick={onClose} />
      <div className="co-slideout le-slideout" role="dialog" aria-label="Manage Marketplace Listing Preview">
        <div className="co-slideout__header">
          <h2>Manage Marketplace Listing Preview</h2>
          <button onClick={onClose} aria-label="Close"><Icon name="x" size={18} /></button>
        </div>

        <div className="co-slideout__body">
          <div className="le-body">
            <div className="le-intro">
              <h3>Update Your Practice’s Marketplace Listing Preview</h3>
              <p>Update how your practice appears to buyers on the Marketplace. Updates to your title and description must be approved by CareOwner.</p>
            </div>

            <ListingPhotoSection
              savedImage={listing.image}
              savedIsAI={!!listing.imageIsAI}
              onSave={(patch) => updateMyListing(patch)}
              onToast={onToast}
            />

            <EditableField
              label="Listing title"
              maxLength={90}
              aiSuggestions={AI_TITLE_SUGGESTIONS}
              current={listing.title}
              pending={listing.titlePending ? listing.pendingTitle : null}
              onToast={onToast}
              onCommit={({ value, isAiPublish }) => {
                if (isAiPublish) updateMyListing({ title: value, titlePending: false, pendingTitle: null });
                else updateMyListing({ titlePending: true, pendingTitle: value });
              }}
            />

            <EditableField
              label="Description"
              multiline
              maxLength={250}
              help="Choose an illustrated watercolor image from our collection that best fits your practice. To maintain privacy, we do not allow custom uploads for the public view of your marketplace listing."
              aiSuggestions={AI_DESCRIPTION_SUGGESTIONS}
              current={listing.description}
              pending={listing.descriptionPending ? listing.pendingDescription : null}
              onToast={onToast}
              onCommit={({ value, isAiPublish }) => {
                if (isAiPublish) updateMyListing({ description: value, descriptionPending: false, pendingDescription: null });
                else updateMyListing({ descriptionPending: true, pendingDescription: value });
              }}
            />
          </div>
        </div>

        <div className="co-slideout__footer">
          <div className="le-footer-left">
            {fromMarketplace && (
              <button className="co-btn co-btn--ghost" onClick={onEditProfile}><Icon name="externalLink" size={14} /> Edit full practice profile</button>
            )}
          </div>
          <div className="le-footer-right">
            <button className="co-btn co-btn--ghost" onClick={onClose}>Cancel</button>
            <button className="co-btn co-btn--primary" onClick={onClose}>Done with editing</button>
          </div>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { PreviewListingCard, ListingEditorSlideout });
