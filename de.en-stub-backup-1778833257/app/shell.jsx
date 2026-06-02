// Top-bar shell — publication-first nav with a light account surface.
// Account state is local-only until a backend auth provider is connected.

const { useState, useEffect, useMemo } = React;

const ROUTES = [
  { key: "dashboard", label: "Today" },
  { key: "catalogue", label: "Catalogue" },
  { key: "playbooks", label: "Playbooks" },
  { key: "compare", label: "Compare" },
  { key: "nutrition", label: "Nutrition" },
  { key: "concerns", label: "By concern" },
  { key: "news", label: "Notes" },
  { key: "methodology", label: "Methodology" },
  { key: "assessment", label: "Assessment" },
  { key: "account", label: "Account" },
];

function TopNav({ route, setRoute, searchTerm, setSearchTerm }) {
  const itemCount = (window.ALL_ITEMS || []).length;
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
        <span className="brand-name">Trajectory</span>
      </div>
      <nav className="nav">
        {ROUTES.map(r => (
          <div key={r.key} className={`nav-item ${route === r.key || (route === "playbook" && r.key === "playbooks") || (route === "detail" && r.key === "catalogue") || (route === "note" && r.key === "news") ? "active" : ""}`} onClick={() => setRoute(r.key)}>
            {r.label}
          </div>
        ))}
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
        <button className="icon-btn" title="Notes" onClick={() => setRoute("news")} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h12l4 4v12H4z" /><path d="M16 4v4h4" /></svg>
        </button>
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

window.Shell = { TopNav, SubBar, ROUTES };
