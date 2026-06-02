// Top-bar shell — publication-first nav with a light account surface.
// Account state is local-only until a backend auth provider is connected.

const { useState, useEffect, useMemo } = React;

const ROUTES = [
  { key: "dashboard", label: "Heute" },
  { key: "catalogue", label: "Katalog" },
  { key: "playbooks", label: "Leitfäden" },
  { key: "compare", label: "Vergleichen" },
  { key: "nutrition", label: "Ernährung" },
  { key: "concerns", label: "Nach Anliegen" },
  { key: "news", label: "Notizen" },
  { key: "methodology", label: "Methodik" },
  { key: "assessment", label: "Bewertung" },
  { key: "account", label: "Konto" },
];

const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "es", label: "ES", name: "Español" },
];
const APP_VERSION = "20260518k";

function currentLanguage() {
  const first = (window.location.pathname || "/").split("/").filter(Boolean)[0];
  return LANGUAGES.some(lang => lang.code === first) ? first : "en";
}

function languageHref(lang, route, detail, note, topic) {
  const hash = window.location.hash || "#/today";
  return lang === "en" ? `/?v=${APP_VERSION}${hash}` : `/${lang}/?v=${APP_VERSION}${hash}`;
}

function TopNav({ route, detail, note, topic, setRoute, searchTerm, setSearchTerm }) {
  const [languageOpen, setLanguageOpen] = useState(false);
  const activeLanguage = currentLanguage();
  const activeLanguageLabel = (LANGUAGES.find(lang => lang.code === activeLanguage) || LANGUAGES[0]).label;
  const itemCount = (window.ALL_ITEMS || []).length;
  const isActive = (key) => (
    route === key ||
    (route === "playbook" && key === "playbooks") ||
    (route === "detail" && key === "catalogue") ||
    (route === "note" && key === "news")
  );
  const goRoute = (key) => {
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
        <span className="brand-tagline">Evidenzbasierte Longevity</span>
      </div>
      <nav className="nav">
        {ROUTES.map(r => (
          <button type="button" key={r.key} className={`nav-item ${isActive(r.key) ? "active" : ""}`} onClick={() => goRoute(r.key)}>
            {r.label}
          </button>
        ))}
      </nav>
      <div className="right">
        <div className="language-switcher" onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setLanguageOpen(false);
        }}>
          <button type="button" className="language-trigger" onClick={() => setLanguageOpen(open => !open)} aria-haspopup="menu" aria-expanded={languageOpen} title="Sprache wechseln">
            {activeLanguageLabel}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          {languageOpen && (
            <div className="language-menu" role="menu">
              {LANGUAGES.map(lang => (
                <a key={lang.code} className={`language-option ${lang.code === activeLanguage ? "active" : ""}`} href={languageHref(lang.code, route, detail, note, topic)} role="menuitem">
                  <span>{lang.label}</span>
                  <small>{lang.name}</small>
                </a>
              ))}
            </div>
          )}
        </div>
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
            placeholder={`${itemCount} Interventionen durchsuchen`}
          />
          <span className="kbd">⌘K</span>
        </form>
        <button className="icon-btn" title="Notizen" onClick={() => setRoute("news")} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
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

window.Shell = { TopNav, SubBar, ROUTES, LANGUAGES };
