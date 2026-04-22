// Meetings view

const MeetingsView = ({ section, onSection, onEdit }) => {
  return (
    <>
      <SubHeader crumbs={["Meetings"]} title="Meetings" actions={<>
        <button className="co-btn-outline"><Icon name="calendar" /> Sync Calendar</button>
        <button className="co-btn-solid" onClick={() => onEdit({ title: "Schedule Meeting", kind: "new-meeting" })}>
          <Icon name="plus" /> Schedule
        </button>
      </>} />
      <div className="co-page">
        <LeftRail section={section} onSection={onSection} />
        <div style={{ gridColumn: "2 / -1" }}>
          <h2 className="co-sec-title">Upcoming</h2>
          <div>
            {MEETINGS.map(m => (
              <div key={m.id} className="co-meeting">
                <div className="co-meeting__date">
                  <div className="co-meeting__day">{m.day}</div>
                  <div className="co-meeting__mon">{m.month}</div>
                </div>
                <div>
                  <div className="co-meeting__title">{m.title}</div>
                  <div className="co-meeting__sub">With {m.with}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="co-meeting__time"><Icon name="clock" size={12} />{m.time} · {m.dur}</div>
                  <div style={{ marginTop: 8 }}>
                    <span className="co-badge co-badge--blue">{m.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { MeetingsView });
