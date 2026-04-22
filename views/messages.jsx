// Messages view — 2-pane thread UI

const MessagesView = ({ section, onSection }) => {
  const [activeId, setActiveId] = React.useState(THREADS[0].id);
  const [draft, setDraft] = React.useState("");
  const [localThreads, setLocalThreads] = React.useState(THREADS);
  const active = localThreads.find(t => t.id === activeId);

  const send = () => {
    if (!draft.trim()) return;
    setLocalThreads(ts => ts.map(t => t.id === activeId
      ? { ...t, last: draft, time: "now", messages: [...t.messages, { from: "me", text: draft, time: "Just now" }] }
      : t));
    setDraft("");
  };

  return (
    <>
      <SubHeader crumbs={["Messages"]} title="Messages" actions={<>
        <button className="co-btn-solid"><Icon name="plus" /> New Message</button>
      </>} />
      <div className="co-page">
        <LeftRail section={section} onSection={onSection} />
        <div style={{ gridColumn: "2 / -1" }}>
          <div className="co-msg-wrap">
            <div className="co-msg-list">
              {localThreads.map(t => (
                <div key={t.id} className={`co-msg-item ${activeId === t.id ? "is-active" : ""}`} onClick={() => setActiveId(t.id)}>
                  <div className="co-msg-item__av">{t.initials}</div>
                  <div className="co-msg-item__body">
                    <div className="co-msg-item__top">
                      <div className="co-msg-item__name">{t.name}</div>
                      <div className="co-msg-item__time">{t.time}</div>
                    </div>
                    <div className="co-msg-item__preview">{t.last}</div>
                    {t.unread > 0 && <span className="co-badge co-badge--blue" style={{ marginTop: 6, alignSelf: "flex-start" }}>{t.unread} new</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="co-msg-thread">
              <div className="co-msg-header">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="co-msg-item__av">{active.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: "600 15px/1.2 Inter", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{active.name}</div>
                    <div style={{ font: "400 12px/1 Inter", color: "var(--stone-500)", marginTop: 4 }}>Re: AnimalCare Listing</div>
                  </div>
                </div>
              </div>
              <div className="co-msg-body">
                {active.messages.map((m, i) => (
                  <div key={i} className={`co-msg-bubble ${m.from}`}>
                    {m.text}
                    <div className="co-msg-bubble__time">{m.time}</div>
                  </div>
                ))}
              </div>
              <div className="co-msg-composer">
                <input
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  placeholder={`Message ${active.name}…`}
                />
                <button className="co-btn co-btn--primary" onClick={send}><Icon name="send" size={14} /> Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { MessagesView });
