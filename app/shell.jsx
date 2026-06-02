// Top-bar shell — publication-first nav with a light account surface.

const { useState, useEffect, useMemo } = React;

const ROUTES = [
  { key: "dashboard", label: "Today" },
  { key: "news", label: "Notes" },
  { key: "catalogue", label: "Catalogue" },
  { key: "assessment", label: "Assessment" },
  { key: "account", label: "Account" },
];

const SECONDARY_ROUTES = [
  { key: "mission", label: "Mission" },
  { key: "playbooks", label: "Playbooks" },
  { key: "compare", label: "Compare" },
  { key: "nutrition", label: "Nutrition" },
  { key: "lifestyle", label: "Lifestyle" },
  { key: "supplements", label: "Supplements" },
  { key: "medications", label: "Medications" },
  { key: "concerns", label: "By concern" },
  { key: "methodology", label: "Methodology" },
  { key: "search", label: "Search" },
];

const LANGUAGES = [];
const APP_VERSION = "20260602c";

function TopNav({ route, detail, note, topic, setRoute, searchTerm, setSearchTerm }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const itemCount = (window.ALL_ITEMS || []).length;
  const isActive = (key) => (
    route === key ||
    (route === "playbook" && key === "playbooks") ||
    (route === "detail" && key === "catalogue") ||
    (route === "note" && key === "news")
  );
  const goRoute = (key) => {
    setMoreOpen(false);
    setRoute(key);
  };
  const runSearch = (event) => {
    event.preventDefault();
    if ((searchTerm || "").trim()) setRoute("search");
  };
  return (
    <header className="top">
      <div className="brand" onClick={() => setRoute("dashboard")} style={{ cursor: "pointer" }}>
        <span className="brand-mark">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 18 L9 12 L13 15 L20 6" /><circle cx="20" cy="6" r="1.5" fill="currentColor" /></svg>
        </span>
        <span className="brand-name">Trajectory<span className="brand-suffix">.quest</span></span>
        <span className="brand-tagline">Evidence Based Longevity</span>
      </div>
      <nav className="nav">
        {ROUTES.map(r => (
          <button type="button" key={r.key} className={`nav-item ${isActive(r.key) ? "active" : ""}`} onClick={() => goRoute(r.key)}>
            {r.label}
          </button>
        ))}
        <div className={`nav-more ${moreOpen ? "open" : ""}`} data-open={moreOpen ? "true" : "false"} onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)} onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setMoreOpen(false);
        }}>
          <button type="button" className={`nav-item nav-more-trigger ${SECONDARY_ROUTES.some(r => isActive(r.key)) ? "active" : ""}`} onClick={() => setMoreOpen(open => !open)} aria-haspopup="menu" aria-expanded={moreOpen}>
            More
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <div className="nav-menu" role="menu" aria-hidden={!moreOpen}>
            {SECONDARY_ROUTES.map(r => (
              <button type="button" key={r.key} className={`nav-menu-item ${isActive(r.key) ? "active" : ""}`} onClick={() => goRoute(r.key)} role="menuitem" tabIndex={moreOpen ? 0 : -1}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div className="right">
        <form className="search" onSubmit={runSearch}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input
            value={searchTerm || ""}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && (searchTerm || "").trim()) {
                e.preventDefault();
                setRoute("search");
              }
            }}
            placeholder={`Search ${itemCount} interventions`}
          />
          <span className="kbd">⌘K</span>
        </form>
      </div>
    </header>
  );
}

function SubBar({ crumbs }) {
  return (
    <div className="subbar">
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="sep">/</span>}
          <span className={i === crumbs.length - 1 ? "current" : ""}>{c}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

window.Shell = { TopNav, SubBar, ROUTES, SECONDARY_ROUTES, LANGUAGES };
