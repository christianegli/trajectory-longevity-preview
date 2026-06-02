// Catalogue · Detail · Concerns · Stack · Assessment — clinical edition

const { useState: vS, useMemo: vM, useEffect: vE } = React;
const { CatDot: VC, Tier: VT, Grade: VG, Score: VS, Scatter: VSC, CONCERN_LABELS: VCL, TIER_LABELS: VTL, EVIDENCE_DESC: VED } = window.UI;

/* ---------- SHARE BUTTON ---------- */
// Uses Web Share API on mobile (native sheet), falls back to clipboard copy
// with a short "Link copied" confirmation. Final fallback: prompt() with the URL.
function ShareButton({ title, text }) {
  const [state, setState] = vS("idle"); // idle | copied | shared | error
  const onClick = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = { title: title || document.title, text: text || "", url };
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setState("shared");
        setTimeout(() => setState("idle"), 1800);
        return;
      }
    } catch (e) {
      if (e && e.name === "AbortError") return;
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setState("copied");
        setTimeout(() => setState("idle"), 1800);
        return;
      }
    } catch (e) {}
    try {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) {
        setState("copied");
        setTimeout(() => setState("idle"), 1800);
        return;
      }
    } catch (e) {}
    try { window.prompt("Copy this link:", url); } catch (e) {}
    setState("error");
    setTimeout(() => setState("idle"), 1800);
  };
  const label =
    state === "copied" ? "Link copied ✓" :
    state === "shared" ? "Shared ✓" :
    state === "error"  ? "Copy failed — copy from URL bar" :
    "Share this page";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <button
        className="btn clay"
        onClick={onClick}
        aria-live="polite"
        aria-label={state === "idle" ? "Share this page" : label}
      >
        {label}
      </button>
    </div>
  );
}

/* ---------- CATALOGUE ---------- */

function FilterBlock({ title, children, extra }) {
  return (
    <div style={{ padding: "16px 0", borderBottom: "1px solid var(--rule)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span className="mono" style={{ color: "var(--ink-3)" }}>{title}</span>
        {extra}
      </div>
      {children}
    </div>
  );
}

function CatalogueView({ items, viz, onPick, nutritionOnly = false, categoryOnly = null, heading = "Catalogue.", eyebrow = "Library" }) {
  const baseFilters = () => categoryOnly ? { cat: [categoryOnly] } : nutritionOnly ? { nutrition: true } : {};
  const [filters, setFilters] = vS(baseFilters);
  const [sort, setSort] = vS("combined");
  const [layout, setLayout] = vS("grid");
  const [query, setQuery] = vS("");
  const isCompact = typeof window !== "undefined" && window.innerWidth < 900;
  const toggle = (k, v) => { const cur = filters[k] || []; setFilters({ ...filters, [k]: cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v] }); };
  vE(() => setFilters(baseFilters()), [nutritionOnly, categoryOnly]);

  const filtered = vM(() => {
    let r = items.slice();
    const q = query.trim().toLowerCase();
    if (q) {
      r = r.filter(i => [
        i.name,
        i.one,
        i.plain,
        i.verdict,
        i.cost,
        i.ev,
        i.cat,
        ...(i.tags || []),
        ...(i.targets || []).map(t => VCL[t] || t),
      ].join(" ").toLowerCase().includes(q));
    }
    if (filters.nutrition) r = r.filter(isNutritionItem);
    if (filters.tier?.length) r = r.filter(i => filters.tier.includes(i.tier));
    if (filters.cat?.length) r = r.filter(i => filters.cat.includes(i.cat));
    if (filters.ev?.length) r = r.filter(i => filters.ev.includes(i.ev));
    if (filters.concerns?.length) r = r.filter(i => filters.concerns.some(c => i.targets.includes(c)));
    if (sort === "effect") r.sort((a,b)=>b.e-a.e);
    else if (sort === "certainty") r.sort((a,b)=>b.c-a.c);
    else if (sort === "alpha") r.sort((a,b)=>a.name.localeCompare(b.name));
    else r.sort((a,b)=>(b.e+b.c)-(a.e+a.c));
    return r;
  }, [items, filters, sort, query]);
  const hasAnyFilter = query.trim() || Object.values(filters).some(v => Array.isArray(v) ? v.length : !!v);
  const clearAll = () => {
    setQuery("");
    setFilters(baseFilters());
  };

  return (
    <div className="page wide" style={{ display: "grid", gridTemplateColumns: isCompact ? "1fr" : "240px minmax(0, 1fr)", gap: isCompact ? 22 : 40 }}>
      <aside style={{ position: isCompact ? "static" : "sticky", top: 92, alignSelf: "start" }}>
        <div className="kicker" style={{ marginBottom: 6 }}><span className="bullet" />Filters</div>
        <FilterBlock title="Focus" extra={<span className="mono">{items.filter(isNutritionItem).length}</span>}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
            <input type="checkbox" checked={!!filters.nutrition} onChange={()=>setFilters({ ...filters, nutrition: !filters.nutrition })} style={{ accentColor: "var(--clay)" }} />
            <span className="pill clay">Nutrition</span>
            <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>{items.filter(isNutritionItem).length}</span>
          </label>
        </FilterBlock>
        <FilterBlock title="Tier" extra={<button className="btn ghost" style={{ fontSize: 10, padding: 0 }} onClick={clearAll}>Reset</button>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[1,2,3].map(t => (
              <label key={t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                <input type="checkbox" checked={(filters.tier||[]).includes(t)} onChange={()=>toggle("tier",t)} style={{ accentColor: "var(--clay)" }} />
                <VT tier={t} />
                <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>{items.filter(i=>i.tier===t).length}</span>
              </label>
            ))}
          </div>
        </FilterBlock>
        <FilterBlock title="Category">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[["lifestyle","Lifestyle"],["supplement","Supplement"],["medication","Medication"]].map(([k,l])=>(
              <label key={k} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                <input type="checkbox" checked={(filters.cat||[]).includes(k)} onChange={()=>toggle("cat",k)} style={{ accentColor: "var(--clay)" }} />
                <VC cat={k} />{l}
                <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>{items.filter(i=>i.cat===k).length}</span>
              </label>
            ))}
          </div>
        </FilterBlock>
        <FilterBlock title="Evidence">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {["A","B","C","D"].map(g => (
              <label key={g} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                <input type="checkbox" checked={(filters.ev||[]).includes(g)} onChange={()=>toggle("ev",g)} style={{ accentColor: "var(--clay)" }} />
                <VG ev={g} /><span style={{ color: "var(--ink-3)", fontSize: 11.5 }}>{VED[g]}</span>
                <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>{items.filter(i=>i.ev===g).length}</span>
              </label>
            ))}
          </div>
        </FilterBlock>
        <FilterBlock title="Concern">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {Object.entries(VCL).slice(0,8).map(([k,l])=>(
              <label key={k} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                <input type="checkbox" checked={(filters.concerns||[]).includes(k)} onChange={()=>toggle("concerns",k)} style={{ accentColor: "var(--clay)" }} />
                {l}
              </label>
            ))}
          </div>
        </FilterBlock>
      </aside>

      <div style={{ minWidth: 0 }}>
        <header style={{ marginBottom: 22 }}>
          <div className="kicker" style={{ marginBottom: 8 }}><span className="bullet" />{eyebrow}</div>
          <h1 className="display" style={{ fontSize: 48, margin: "0 0 8px", lineHeight: 1 }}>{heading}</h1>
          <p style={{ fontSize: 14, color: "var(--ink-2)", margin: 0 }}>
            <strong style={{ color: "var(--ink)", fontFamily: "var(--mono)", fontSize: 13 }}>{filtered.length}</strong> of {items.length} interventions · searchable by name, target, cost, and verdict
          </p>
        </header>

        <div className="catalogue-toolbar">
          <label className="catalogue-search" aria-label="Search catalogue">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search interventions, targets, verdicts" />
            {query && <button className="btn ghost" onClick={() => setQuery("")} aria-label="Clear catalogue search">Clear</button>}
          </label>
          <div style={{ display: "inline-flex", border: "1px solid var(--rule-2)" }}>
            {["list","grid","scatter"].map(l => (
              <button key={l} className="btn ghost" style={{ padding: "7px 12px", fontSize: 11, fontFamily: "var(--mono)", letterSpacing: "0.08em", textTransform: "uppercase", borderLeft: l !== "list" ? "1px solid var(--rule)" : 0, background: layout === l ? "var(--paper-2)" : "transparent", color: layout === l ? "var(--ink)" : "var(--ink-3)" }} onClick={()=>setLayout(l)}>{l}</button>
            ))}
          </div>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{ padding: "7px 10px", border: "1px solid var(--rule-2)", background: "var(--paper)", fontSize: 12, fontFamily: "var(--mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            <option value="combined">Sort · combined</option>
            <option value="effect">Sort · effect</option>
            <option value="certainty">Sort · certainty</option>
            <option value="alpha">Sort · a–z</option>
          </select>
          {query.trim() && <span className="chip on clay" onClick={() => setQuery("")}>Search: {query.trim()} ✕</span>}
          {[...(filters.nutrition ? [{k:"nutrition",v:true,l:"Nutrition"}] : []), ...(filters.tier||[]).map(t=>({k:"tier",v:t,l:VTL[t]})), ...(filters.cat||[]).map(c=>({k:"cat",v:c,l:c})), ...(filters.ev||[]).map(g=>({k:"ev",v:g,l:"Evidence "+g})), ...(filters.concerns||[]).map(c=>({k:"concerns",v:c,l:VCL[c]}))].map(c => (
            <span key={c.k+c.v} className="chip on clay" onClick={()=>c.k === "nutrition" ? setFilters({ ...filters, nutrition: false }) : toggle(c.k,c.v)}>{c.l} ✕</span>
          ))}
          {hasAnyFilter && <button className="btn link" onClick={clearAll}>Clear filters</button>}
        </div>

        {filtered.length === 0 && (
          <div className="card card-pad catalogue-empty">
            <div className="kicker clay" style={{ marginBottom: 8 }}><span className="bullet" />No match</div>
            <h2 className="display" style={{ fontSize: 28, margin: "0 0 8px" }}>Nothing fits this exact query.</h2>
            <p>Try a broader term like “heart”, “sleep”, “protein”, “ApoB”, or clear one filter.</p>
            <button className="btn secondary" onClick={clearAll}>Reset catalogue</button>
          </div>
        )}

        {filtered.length > 0 && layout === "list" && (
          <div className="card" style={{ padding: 0 }}>
            <div className="list-row head" style={{ gridTemplateColumns: "minmax(0,1.6fr) 100px minmax(0,1fr) 130px 50px 70px 16px" }}>
              <span className="mono">Intervention</span><span className="mono">Tier</span><span className="mono">Targets</span><span className="mono">Score</span><span className="mono">Ev</span><span className="mono">Cost</span><span></span>
            </div>
            {filtered.map(item => (
              <div key={item.slug} className="list-row" style={{ gridTemplateColumns: "minmax(0,1.6fr) 100px minmax(0,1fr) 130px 50px 70px 16px" }} onClick={()=>onPick(item.slug)}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                    <VC cat={item.cat} />
                    <span className="display" style={{ fontSize: 17, lineHeight: 1.1 }}>{item.name}</span>
                    {isNutritionItem(item) && <span className="pill clay" style={{ fontSize: 9, padding: "2px 6px" }}>Nutrition</span>}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.45, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.one}</div>
                </div>
                <VT tier={item.tier} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, minWidth: 0 }}>
                  {item.targets.slice(0,2).map(t => <span key={t} className="pill">{VCL[t]}</span>)}
                  {item.targets.length > 2 && <span style={{ fontSize: 11, color: "var(--ink-3)" }}>+{item.targets.length-2}</span>}
                </div>
                <VS e={item.e} c={item.c} viz={viz} />
                <VG ev={item.ev} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)" }}>{item.cost}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.6"><path d="m9 6 6 6-6 6" /></svg>
              </div>
            ))}
          </div>
        )}

        {filtered.length > 0 && layout === "grid" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {filtered.map(item => (
              <div key={item.slug} className="card clickable card-pad" onClick={()=>onPick(item.slug)} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <VT tier={item.tier} />
                  <VG ev={item.ev} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><VC cat={item.cat} /><span className="kicker">{item.cat}</span>{isNutritionItem(item) && <span className="pill clay" style={{ fontSize: 9, padding: "2px 6px" }}>Nutrition</span>}</div>
                  <div className="display" style={{ fontSize: 24, lineHeight: 1.05 }}>{item.name}</div>
                  <p style={{ fontSize: 13, color: "var(--ink-2)", margin: "8px 0 0", lineHeight: 1.5 }}>{item.one}</p>
                </div>
                <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--rule)", display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 12, alignItems: "start" }}>
                  <VS e={item.e} c={item.c} viz={viz} />
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--ink-3)", lineHeight: 1.45, textAlign: "right", overflowWrap: "anywhere" }}>{item.cost}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length > 0 && layout === "scatter" && (
          <div className="card card-pad" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32 }}>
            <VSC items={filtered} onPick={(it)=>onPick(it.slug)} w={680} h={500} />
            <div>
              <div className="kicker" style={{ marginBottom: 10 }}>Reading the chart</div>
              <p style={{ fontSize: 13, color: "var(--ink-2)", margin: 0, lineHeight: 1.6 }}>Up-and-right is "big effect, very sure" — that's sleep, exercise, statins. Down-and-right is the frontier: maybe huge, maybe nothing.</p>
              <hr className="rule" style={{ margin: "16px 0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><VC cat="lifestyle" />Lifestyle</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><VC cat="supplement" />Supplement</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><VC cat="medication" />Medication</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- DETAIL ---------- */

function asList(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function plainRiskText(value) {
  return String(value || "")
    .replace(/\bGI\b/g, "stomach or gut")
    .replace(/\bGERD\b/g, "severe acid reflux")
    .replace(/\bIBD\b/g, "inflammatory bowel disease")
    .replace(/\bCKD\b/g, "chronic kidney disease")
    .replace(/\beGFR\s*<\s*30\b/g, "severely reduced kidney function")
    .replace(/\bT1DM\b/g, "type 1 diabetes")
    .replace(/\bT2DM\b/g, "type 2 diabetes")
    .replace(/\bUTI\b/g, "urinary tract infection")
    .replace(/\bDKA\b/g, "diabetic ketoacidosis")
    .replace(/\bHTN\b/g, "high blood pressure")
    .replace(/\bBP\b/g, "blood pressure")
    .replace(/\bCV\b/g, "heart or blood-vessel")
    .replace(/\bAF\b/g, "atrial fibrillation")
    .replace(/\bPE\b/g, "blood clot in the lung")
    .replace(/\bVTE\b/g, "blood clots in the veins or lungs")
    .replace(/\bHCT\b/g, "hematocrit")
    .replace(/\bNPO\b/g, "not eating before a procedure")
    .replace(/\bIV contrast\b/g, "contrast dye for a scan")
    .replace(/\bCYP3A4 inhibitors\b/g, "medicines that can raise drug levels")
    .replace(/\bP-glycoprotein\b/g, "a drug-transport system")
    .replace(/\brenal impairment\b/gi, "kidney problems")
    .replace(/\brenal function\b/gi, "kidney function")
    .replace(/\bhepatic\b/gi, "liver")
    .replace(/\bhepatotoxicity\b/gi, "liver injury")
    .replace(/\bhyperkalemia\b/gi, "high potassium")
    .replace(/\bhypoglycemia\b/gi, "low blood sugar")
    .replace(/\bpolycythemia\b/gi, "too many red blood cells")
    .replace(/\bgynecomastia\b/gi, "breast tissue growth in men")
    .replace(/\bspermatogenesis\b/gi, "sperm production")
    .replace(/\bgastroparesis\b/gi, "slow stomach emptying")
    .replace(/\borthostatic hypotension\b/gi, "dizziness or low blood pressure when standing")
    .replace(/\banticoagulants\b/gi, "blood thinners")
    .replace(/\bantiplatelet\b/gi, "blood-thinning")
    .replace(/\bimmunocompromise\b/gi, "weakened immune system")
    .replace(/\bimmunosuppression\b/gi, "weakened immune system")
    .replace(/\bimmunosuppressed\b/gi, "having a weakened immune system")
    .replace(/\bcontraindications?\b/gi, "reasons to avoid it");
}

function EvidenceMeta({ label, children }) {
  if (!children || (Array.isArray(children) && !children.length)) return null;
  return (
    <div>
      <div className="kicker" style={{ marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

function StudyCard({ s, index, total, ev }) {
  const bits = [s.year, s.journal, s.design, s.n ? `n=${s.n}` : ""].filter(Boolean);
  return (
    <div style={{ padding: "20px 22px", borderBottom: index < total - 1 ? "1px solid var(--rule)" : 0, display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto", gap: 20, alignItems: "start" }}>
      <VG ev={ev} />
      <div style={{ minWidth: 0 }}>
        <div className="display" style={{ fontSize: 18, lineHeight: 1.25, marginBottom: 6 }}>{s.title || "Untitled study"}</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.06em", marginBottom: 10 }}>
          {bits.join(" · ")}
        </div>
        {s.authors && <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 8 }}>{s.authors}</div>}
        {s.finding && <div style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55 }}>{s.finding}</div>}
        {s.limitations && <div style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.55, marginTop: 8 }}><strong style={{ color: "var(--ink-2)" }}>Limitations:</strong> {s.limitations}</div>}
      </div>
      {s.url ? <a className="btn secondary" href={s.url} target="_blank" rel="noopener" style={{ fontSize: 11, textDecoration: "none", whiteSpace: "nowrap" }}>Source ↗</a> : <span />}
    </div>
  );
}

function textFrom(value) {
  if (!value) return "";
  return Array.isArray(value) ? value.filter(Boolean).join(" ") : String(value);
}

function sentence(value, fallback = "") {
  const raw = textFrom(value || fallback).trim();
  if (!raw) return "";
  const parts = raw.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [raw];
  return parts[0].trim();
}

function targetNames(item) {
  return (item.targets || []).map(t => VCL[t] || t).filter(Boolean);
}

function DetailFieldGuide({ item, todo, endpoints, sides, contras }) {
  const targets = targetNames(item);
  const primaryTarget = targets[0] || "longevity";
  const action = sentence(todo[0], item.humanDose || item.verdict || item.one);
  const mechanism = sentence(item.mechanism, item.plain || item.one);
  const evidence = sentence(item.evidenceSummary, item.verdict || item.one);
  const risk = sentence(item.notForYou || contras[0] || sides[0], "The main risk is applying it to the wrong person, at the wrong dose, or before higher-certainty basics are handled.");
  const isFrontier = item.tier === 3 || ["D","E"].includes(item.ev);
  const isMedication = item.cat === "medication";
  const isSupplement = item.cat === "supplement";
  const isLifestyle = item.cat === "lifestyle";
  const posture = isFrontier
    ? "Treat this as a watch-list idea, not a default habit."
    : isMedication
      ? "Treat this as a clinical decision, not a wellness experiment."
      : isSupplement
        ? "Treat this as an add-on after food, training, sleep, and risk markers are handled."
        : "Treat this as infrastructure: boring enough to repeat, strong enough to compound.";
  const commonMistake = isFrontier
    ? "The common mistake is letting a striking mechanism outrank weak human outcome data."
    : isMedication
      ? "The common mistake is copying a protocol without the diagnosis, labs, monitoring, or contraindication check that made it appropriate."
      : isSupplement
        ? "The common mistake is buying the bottle before asking whether the dose, form, and population match the studies."
        : "The common mistake is making it too heroic. The winning version is the one you can repeat when life is ordinary.";
  const success = endpoints.length
    ? endpoints.slice(0, 3).join(" · ")
    : targets.length
      ? targets.slice(0, 3).join(" · ")
      : "a measurable change in the marker or behavior this intervention is supposed to improve";

  return (
    <section className="field-guide">
      <div className="field-guide-main">
        <div className="kicker clay" style={{ marginBottom: 10 }}><span className="bullet" />Field guide</div>
        <h2 className="display" style={{ fontSize: 34, lineHeight: 1.05, margin: "0 0 12px" }}>
          The useful version of {item.name}.
        </h2>
        <p>{posture} For {primaryTarget.toLowerCase()}, the question is not whether the story sounds plausible; it is whether the evidence is strong enough, the protocol is repeatable enough, and the downside is small enough to deserve attention.</p>
        {mechanism && <p>{mechanism}</p>}
      </div>
      <div className="field-guide-grid">
        <div>
          <div className="kicker">Best first move</div>
          <p>{action || "Start by reading the protocol and deciding whether you are the population the evidence actually studied."}</p>
        </div>
        <div>
          <div className="kicker">Why it might work</div>
          <p>{mechanism || "The mechanism is plausible enough to track, but the practical decision still rests on human outcomes and tradeoffs."}</p>
        </div>
        <div>
          <div className="kicker">Evidence texture</div>
          <p>{evidence || `Evidence grade ${item.ev}; read this as a ${isFrontier ? "hypothesis" : "decision aid"}, not a slogan.`}</p>
        </div>
        <div>
          <div className="kicker">Common mistake</div>
          <p>{commonMistake}</p>
        </div>
        <div>
          <div className="kicker">What success looks like</div>
          <p>Look for movement in {success}. If nothing measurable or lived changes, the intervention probably does not deserve more attention.</p>
        </div>
        <div>
          <div className="kicker">When to pause</div>
          <p>{risk}</p>
        </div>
      </div>
    </section>
  );
}

function DetailDecisionGrid({ item, todo, studies, sides, contras }) {
  const firstAction = todo[0] || item.humanDose || item.verdict || item.one;
  const needsDoctor = item.cat === "medication" || /doctor|prescription|physician|supervision|contraindicat/i.test([item.forYou, item.notForYou, item.verdict, item.one].join(" "));
  return (
    <div className="detail-brief">
      <div className="detail-brief-row is-primary">
        <div className="kicker">Start here</div>
        <p>{firstAction}</p>
      </div>
      <div className="detail-brief-row">
        <div className="kicker">Best fit</div>
        <p>{item.forYou || "People whose situation matches the target profile below."}</p>
      </div>
      <div className="detail-brief-row">
        <div className="kicker">Use caution</div>
        <p>{item.notForYou || contras[0] || sides[0] || "No major caution recorded, but context still matters."}</p>
      </div>
      <div className={`detail-brief-row is-check ${needsDoctor ? "needs-clinician" : ""}`}>
        <div className="kicker">Evidence check</div>
        <div className="detail-grade-row"><VG ev={item.ev} /><span>{studies.length} source{studies.length === 1 ? "" : "s"}</span></div>
        <p>{needsDoctor ? "Discuss with a clinician before acting." : "Reasonable to evaluate without making it complicated."}</p>
      </div>
    </div>
  );
}

function DetailActionList({ steps, fallback }) {
  if (!steps.length) return <p className="detail-empty">{fallback}</p>;
  return (
    <ol className="detail-steps">
      {steps.map((step, i) => (
        <li key={i}>
          <span>{i + 1}</span>
          <p>{step}</p>
        </li>
      ))}
    </ol>
  );
}

function DetailFactList({ label, items, fallback, tone }) {
  const list = items.length ? items : [fallback];
  return (
    <div className={`detail-fact-list ${tone || ""}`}>
      <div className="kicker">{label}</div>
      <ul>{list.map((x, i) => <li key={i}>{plainRiskText(x)}</li>)}</ul>
    </div>
  );
}

function DetailEvidencePlate({ item, sourceCount }) {
  const tierLabel = item.tier === 1 ? "I" : item.tier === 2 ? "II" : "III";
  return (
    <aside className={`detail-evidence-plate cat-${item.cat}`} aria-label="Evidence summary">
      <div className="detail-plate-head">
        <span>{item.cat}</span>
        <strong>{tierLabel}</strong>
      </div>
      <div className="detail-plate-grade">{item.ev}</div>
      <div className="detail-plate-bars">
        <div>
          <span>Effect</span>
          <strong>{item.e}<small>/10</small></strong>
          <i><b style={{ width: `${item.e * 10}%` }} /></i>
        </div>
        <div>
          <span>Certainty</span>
          <strong>{item.c}<small>/10</small></strong>
          <i><b style={{ width: `${item.c * 10}%` }} /></i>
        </div>
      </div>
      <div className="detail-plate-foot">
        <span>{sourceCount} source{sourceCount === 1 ? "" : "s"}</span>
        <span>{item.cost || "Cost tbd"}</span>
      </div>
    </aside>
  );
}

function DetailView({ slug, items, viz, onBack, onPick }) {
  const item = items.find(i => i.slug === slug) || items[0];
  const [tab, setTab] = vS("protocol");
  const studies = item.studies || [];
  const todo = asList(item.todo);
  const sides = asList(item.sides);
  const contras = asList(item.contras);
  const endpoints = asList(item.endpoints);
  const related = items.filter(i => i.slug !== item.slug && i.targets.some(t => item.targets.includes(t))).slice(0, 4);
  const sidebarRelated = related.slice(0, 3);
  const targetText = item.targets.map(t => VCL[t] || t).join(" · ");
  vE(() => setTab("protocol"), [item.slug]);

  return (
    <div className="page wide detail-page">
      <div className="detail-main">
        <button className="btn ghost detail-back" onClick={onBack}>
          ← &nbsp;CATALOGUE
        </button>
        <header className="detail-hero">
          <div className="detail-hero-copy">
            <div className="detail-meta">
              <span><VC cat={item.cat} />{item.cat}</span>
              <VT tier={item.tier} />
              <span>{item.lastReviewed ? `Reviewed ${item.lastReviewed}` : "Review queued"}</span>
            </div>
            <h1 className="display">{item.name}</h1>
            <p>{item.one}</p>
            <div className="detail-verdict">
              <div className="kicker"><span className="bullet" />Bottom line</div>
              <p>{item.verdict || item.plain || item.one}</p>
            </div>
            <div className="detail-actions">
              <button className="btn secondary" onClick={() => onBack()}>Compare in catalogue</button>
              <ShareButton title={`${item.name} — Trajectory`} text={item.one || item.verdict || ""} />
            </div>
          </div>
          <DetailEvidencePlate item={item} sourceCount={studies.length} />
        </header>

        <DetailDecisionGrid item={item} todo={todo} studies={studies} sides={sides} contras={contras} />

        <div className="tabs detail-tabs">
          {[["protocol","Protocol",todo.length],["evidence",`Evidence`,studies.length],["risks","Risks",sides.length + contras.length],["related","Related",related.length]].map(([k,l,b])=>(
            <div key={k} className={`tab ${tab===k?"on":""}`} onClick={()=>setTab(k)}>{l}{b && <span className="badge">{b}</span>}</div>
          ))}
        </div>

        {tab === "evidence" && (
          <>
            {(item.evidenceSummary || item.mechanism || endpoints.length) && (
              <div className="card card-pad detail-evidence-summary">
                <EvidenceMeta label="Evidence read">{item.evidenceSummary || item.plain}</EvidenceMeta>
                <div style={{ display: "grid", gap: 16 }}>
                  <EvidenceMeta label="Mechanism">{item.mechanism}</EvidenceMeta>
                  <EvidenceMeta label="Endpoints">{endpoints.join(" · ")}</EvidenceMeta>
                </div>
              </div>
            )}
            <div className="card" style={{ padding: 0 }}>
              {studies.length ? studies.map((s, i) => <StudyCard key={i} s={s} index={i} total={studies.length} ev={item.ev} />) : (
                <div style={{ padding: "22px", color: "var(--ink-2)" }}>Study cards are still being reviewed for this entry. The grade and protocol are provisional until citations land here.</div>
              )}
            </div>
          </>
        )}
        {tab === "protocol" && (
          <div className="detail-section-stack">
            <section className="detail-prose-section">
              <div className="kicker"><span className="bullet" />Protocol</div>
              <h2 className="display">Make the first version boring and measurable.</h2>
              <p>Start with fit, then dose, then feedback. If this is not for your situation, a perfect protocol still becomes the wrong move.</p>
              <div className="protocol-lens">
                <div><span className="mono">Fit</span><p>{item.forYou || `Most relevant for readers targeting ${targetNames(item).slice(0, 2).join(" and ") || "this outcome"}.`}</p></div>
                <div><span className="mono">Dose</span><p>{item.humanDose || sentence(todo[0], "Use the studied protocol where possible; avoid improvising dose or timing before checking evidence.")}</p></div>
                <div><span className="mono">Feedback</span><p>{endpoints.length ? `Track ${endpoints.slice(0, 3).join(", ")}.` : `Track the symptom, marker, or behavior this page claims should change.`}</p></div>
              </div>
            </section>
            {item.plain && (
              <section className="detail-readable detail-prose-section">
                <div className="kicker">Plain English</div>
                <p>{item.plain}</p>
              </section>
            )}
            <section className="detail-prose-section">
              <div className="kicker"><span className="bullet" />What to do</div>
              <h2 className="display">Steps</h2>
              <DetailActionList steps={todo} fallback={item.verdict || item.one} />
            </section>
            <section className="detail-reference">
              <div className="detail-reference-row"><span>Who should consider</span><p>{item.forYou || "People whose situation matches the target profile."}</p></div>
              <div className="detail-reference-row"><span>Who should skip</span><p>{item.notForYou || "No specific skip group recorded."}</p></div>
              <div className="detail-reference-row"><span>Studied dose</span><p>{item.humanDose || "No dose summary recorded."}</p></div>
              <div className="detail-reference-row"><span>Cost signal</span><p>{item.cost || "Not estimated."}</p></div>
              <div className="detail-reference-row"><span>Targets</span><p>{targetText || "No targets recorded."}</p></div>
            </section>
          </div>
        )}
        {tab === "risks" && (
          <div className="detail-risk-grid">
            <DetailFactList label="Possible side effects" items={sides} fallback="No common side effects recorded at evidence-review time." tone="warn" />
            <DetailFactList label="Who should avoid this" items={contras} fallback="No formal avoid group recorded. Ask a clinician if you are unsure." tone="stop" />
          </div>
        )}
        {tab === "related" && (
          <div className="detail-related-grid">
            {related.map(r => (
              <div key={r.slug} className="card clickable card-pad" onClick={()=>onPick(r.slug)}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><VT tier={r.tier} /><VG ev={r.ev} /></div>
                <div className="display" style={{ fontSize: 20, lineHeight: 1.1, marginBottom: 6 }}>{r.name}</div>
                <p style={{ fontSize: 12.5, color: "var(--ink-2)", margin: "0 0 12px", lineHeight: 1.5 }}>{r.one}</p>
                <VS e={r.e} c={r.c} viz={viz} />
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="detail-aside">
        <div className="detail-aside-block">
          <div className="kicker"><span className="bullet" />Targets</div>
          <div className="detail-target-list">
          {item.targets.map((t,i)=>(
            <a key={t} href={`#/concerns/${t}`} title={`Open ${VCL[t] || t} concern view`}>
              <span>{VCL[t]}</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.6"><path d="m9 6 6 6-6 6" /></svg>
            </a>
          ))}
          </div>
        </div>
        {!!sidebarRelated.length && (
          <div className="detail-aside-block">
            <div className="kicker"><span className="bullet" />Best next</div>
            <div className="detail-next-list">
              {sidebarRelated.map(r => (
                <button key={r.slug} type="button" onClick={()=>onPick(r.slug)}>
                  <span>
                    <strong>{r.name}</strong>
                    <em>{r.one}</em>
                  </span>
                  <small>{r.e}/{r.c}</small>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="detail-aside-block">
          <div className="kicker"><span className="bullet" />Where it sits</div>
          <VSC items={items} highlight={item.slug} w={272} h={200} />
        </div>
        <div className="detail-aside-note">
          <div className="kicker"><span className="bullet" />Trust note</div>
          <p>
            Protocol first, evidence one tab away. Source links open directly so you can inspect the underlying paper.
          </p>
        </div>
      </aside>
    </div>
  );
}

/* ---------- CONCERNS ---------- */

function ConcernsView({ items, onPick, viz, initialTarget }) {
  const keys = Object.keys(VCL);
  const [active, setActive] = vS(keys.includes(initialTarget) ? initialTarget : keys[0]);
  vE(() => {
    if (keys.includes(initialTarget)) setActive(initialTarget);
  }, [initialTarget]);
  const matches = items.filter(i => i.targets.includes(active)).sort((a,b)=>(b.e+b.c)-(a.e+a.c));
  return (
    <div className="page wide" style={{ display: "grid", gridTemplateColumns: "240px minmax(0, 1fr)", gap: 40 }}>
      <aside style={{ position: "sticky", top: 92, alignSelf: "start" }}>
        <div className="kicker" style={{ marginBottom: 12 }}><span className="bullet" />12 concerns</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {keys.map(k => {
            const n = items.filter(i => i.targets.includes(k)).length;
            return (
              <div key={k} onClick={()=>setActive(k)} style={{ padding: "10px 0", borderBottom: "1px solid var(--rule)", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", color: active === k ? "var(--ink)" : "var(--ink-2)", fontWeight: active === k ? 500 : 400, fontSize: 14 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {active === k && <span style={{ width: 5, height: 5, background: "var(--clay)", borderRadius: 0 }} />}
                  {VCL[k]}
                </span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", flexShrink: 0, paddingLeft: 8 }}>{n}</span>
              </div>
            );
          })}
        </div>
      </aside>
      <div style={{ minWidth: 0 }}>
        <div className="kicker" style={{ marginBottom: 8 }}><span className="bullet" />By concern</div>
        <h1 className="display" style={{ fontSize: 56, margin: "0 0 16px", lineHeight: 1 }}>{VCL[active]}.</h1>
        <p style={{ fontSize: 16, color: "var(--ink-2)", maxWidth: 680, fontFamily: "var(--news)", letterSpacing: "-0.005em", marginBottom: 32 }}>
          {matches.length} interventions in our catalogue target {VCL[active].toLowerCase()}. Foundation tier listed first — exhaust those before reaching for anything fancier.
        </p>
        {[1,2,3].map(tier => {
          const tm = matches.filter(m => m.tier === tier);
          if (!tm.length) return null;
          return (
            <section key={tier} style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <VT tier={tier} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)" }}>· {tm.length} INTERVENTIONS</span>
              </div>
              <div className="card" style={{ padding: 0 }}>
                {tm.map((item, i) => (
                  <div key={item.slug} className="list-row" style={{ gridTemplateColumns: "minmax(0,1fr) 130px 50px 16px", padding: "16px 22px", borderBottom: i < tm.length-1 ? "1px solid var(--rule)" : 0 }} onClick={()=>onPick(item.slug)}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}><VC cat={item.cat} /><span className="display" style={{ fontSize: 18 }}>{item.name}</span></div>
                      <div style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.45 }}>{item.one}</div>
                    </div>
                    <VS e={item.e} c={item.c} viz={viz} />
                    <VG ev={item.ev} />
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.6"><path d="m9 6 6 6-6 6" /></svg>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- NUTRITION ---------- */

const NUTRITION_SLUGS = new Set([
  "mediterranean-diet", "protein-intake", "whey-protein", "collagen-peptides", "creatine",
  "psyllium", "oat-beta-glucan", "legumes", "flaxseed", "walnuts", "brazil-nuts-selenium",
  "olive-oil-evoo", "omega-3", "green-tea", "egcg", "coffee", "dark-chocolate", "cocoa-flavanols",
  "blueberries-anthocyanins", "pomegranate", "garlic", "aged-garlic-extract", "ginger",
  "dietary-nitrate", "fermented-foods", "probiotics", "vitamin-d3", "vitamin-b12",
  "vitamin-k2", "vitamin-c", "folate", "magnesium", "zinc", "berberine", "red-yeast-rice",
  "curcumin", "sulforaphane", "resveratrol", "nr", "nmn", "spermidine", "ergothioneine",
  "urolithin-a", "fasting-mimicking-diet", "time-restricted-eating", "low-alcohol", "acarbose",
  "dash-diet", "sodium-potassium-balance", "ultra-processed-food-reduction",
  "saturated-fat-replacement", "soy-foods", "plant-sterols-stanols", "calcium-food-first",
  "iodine"
]);

const NUTRITION_STARTERS = [
  "mediterranean-diet", "protein-intake", "psyllium", "oat-beta-glucan",
  "legumes", "olive-oil-evoo", "omega-3", "fermented-foods"
];

function isNutritionItem(item) {
  return NUTRITION_SLUGS.has(item.slug);
}

function NutritionItemCard({ item, onPick, label, viz }) {
  if (!item) return null;
  return (
    <div className="card clickable card-pad" onClick={()=>onPick(item.slug)} style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 210 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <span className="kicker">{label || item.cat}</span>
        <VG ev={item.ev} />
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><VC cat={item.cat} /><VT tier={item.tier} /></div>
        <h3 className="display" style={{ fontSize: 25, lineHeight: 1.05, margin: "0 0 8px" }}>{item.name}</h3>
        <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 13.5, lineHeight: 1.55 }}>{item.one}</p>
      </div>
      <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--rule)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
        <VS e={item.e} c={item.c} viz={viz || "cell"} />
        <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--ink-3)", lineHeight: 1.4, textAlign: "right", overflowWrap: "anywhere" }}>{item.cost}</span>
      </div>
    </div>
  );
}

function NutritionView({ items, onPick, setRoute, viz }) {
  const nutrition = items.filter(isNutritionItem).sort((a,b)=>(b.e+b.c)-(a.e+a.c));
  const bySlug = (slug) => items.find(i => i.slug === slug);
  const starters = uniqueItems(NUTRITION_STARTERS.map(bySlug).filter(Boolean));
  const foodFirst = nutrition.filter(i => i.cat === "lifestyle" || (i.tags || []).some(t => /food|diet|beverage|protein|fiber|fermentation/i.test(t)));
  const supplements = nutrition.filter(i => i.cat === "supplement");
  const articles = (window.ALL_POSTS || [])
    .filter(p => {
      const hay = [p.title, p.lede, p.tag, ...(p.tags || [])].join(" ").toLowerCase();
      return ["nutrition", "supplement", "protein", "fiber", "diet", "food", "apob", "cardiovascular"].some(term => hay.includes(term));
    })
    .sort((a,b)=>(b.date || "").localeCompare(a.date || ""))
    .slice(0, 6);
  const schoolsPost = (window.ALL_POSTS || []).find(p => p.slug === "nutrition-schools-longevity");
  const voices = [
    ["NutritionFacts", "Whole-food plant-based", "Best for beans, fiber, greens, berries, low saturated fat.", "Do not turn plant-forward into protein/B12 neglect."],
    ["Blueprint", "Measured consistency", "Best for repeatable meals, low alcohol, biomarker feedback.", "Do not confuse the branded stack with the evidence."],
    ["Sinclair", "Pathway biology", "Best for aging hypotheses and NAD/sirtuin curiosity.", "Do not treat mechanism as a human outcome."],
    ["Huberman", "Behavior stack", "Best for caffeine timing, alcohol caution, sleep-first sequencing.", "Do not let supplement lists outrank food and training."],
    ["Longo", "Fasting/longevity diet", "Best for periodic restriction as a metabolic tool.", "Do not fast through frailty, poor protein intake, or medication risk."],
    ["Attia", "Outputs over diet identity", "Best for protein, muscle, ApoB, insulin resistance.", "Do not let protein crowd out fiber and lipid control."],
  ];
  const rules = [
    ["Pattern first", "Mediterranean-style eating, high fiber, low alcohol, and enough protein beat single-ingredient optimization for most people."],
    ["ApoB is the scoreboard", "Food choices matter most when they move LDL/ApoB, blood pressure, glucose, weight, or muscle retention."],
    ["Supplements are second-order", "Use supplements to fill a real gap: creatine for muscle, vitamin D for deficiency, B12 for vegans, psyllium for LDL/fiber."],
    ["Protein is a longevity nutrient", "After 50, under-eating protein is a frailty risk. Pair 1.2-1.6 g/kg/day with resistance training."],
  ];

  return (
    <div className="page wide">
      <section className="nutrition-hero">
        <div>
          <div className="kicker clay" style={{ marginBottom: 12 }}><span className="bullet" />Nutrition</div>
          <h1 className="display" style={{ fontSize: 64, lineHeight: 0.96, margin: "0 0 18px", maxWidth: 780 }}>Food patterns before supplement stacks.</h1>
          <p style={{ margin: 0, color: "var(--ink-2)", fontFamily: "var(--news)", fontSize: 19, lineHeight: 1.5, maxWidth: 720 }}>
            The nutrition section separates durable human-outcome evidence from diet ideology: what to eat more of, what to eat less of, when a supplement is worth it, and when the cheaper answer is just food.
          </p>
        </div>
        <aside className="card deep card-pad">
          <div className="kicker clay" style={{ marginBottom: 16 }}>The current nutrition map</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div><div className="display" style={{ color: "var(--paper)", fontSize: 40, lineHeight: 1 }}>{nutrition.length}</div><div className="kicker">Nutrition entries</div></div>
            <div><div className="display" style={{ color: "var(--paper)", fontSize: 40, lineHeight: 1 }}>{foodFirst.length}</div><div className="kicker">Food first</div></div>
            <div><div className="display" style={{ color: "var(--paper)", fontSize: 40, lineHeight: 1 }}>{supplements.length}</div><div className="kicker">Supplements</div></div>
            <div><div className="display" style={{ color: "var(--paper)", fontSize: 40, lineHeight: 1 }}>{nutrition.filter(i => ["A","B"].includes(i.ev)).length}</div><div className="kicker">A/B grade</div></div>
          </div>
        </aside>
      </section>

      <section style={{ marginBottom: 44 }}>
        <header style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "end", marginBottom: 16 }}>
          <div>
            <div className="kicker" style={{ marginBottom: 8 }}><span className="bullet" />Start here</div>
            <h2 className="display" style={{ fontSize: 36, lineHeight: 1, margin: 0 }}>Start here: 8 of {nutrition.length} nutrition entries.</h2>
          </div>
          <button className="btn link" onClick={()=>setRoute("catalogueNutrition")}>Open nutrition catalogue →</button>
        </header>
        <div className="nutrition-grid">
          {starters.map((item, i) => <NutritionItemCard key={item.slug} item={item} onPick={onPick} viz={viz} label={i < 2 ? "Foundation" : "Food lever"} />)}
        </div>
      </section>

      <section className="nutrition-rule-grid" style={{ marginBottom: 44 }}>
        {rules.map(([title, body]) => (
          <div className="card card-pad" key={title}>
            <h3 className="display" style={{ fontSize: 24, margin: "0 0 8px", lineHeight: 1.1 }}>{title}</h3>
            <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>{body}</p>
          </div>
        ))}
      </section>

      <section style={{ marginBottom: 44 }}>
        <header style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "end", marginBottom: 16 }}>
          <div>
            <div className="kicker" style={{ marginBottom: 8 }}><span className="bullet" />The landscape</div>
            <h2 className="display" style={{ fontSize: 36, lineHeight: 1, margin: 0 }}>What the big nutrition voices get right.</h2>
          </div>
          {schoolsPost && <button className="btn link" onClick={()=>setRoute("note", schoolsPost.slug)}>Read the full comparison →</button>}
        </header>
        <div className="nutrition-voice-grid">
          {voices.map(([name, frame, take, caution]) => (
            <div key={name} className="card card-pad">
              <div className="kicker" style={{ marginBottom: 9 }}>{frame}</div>
              <h3 className="display" style={{ fontSize: 25, lineHeight: 1.05, margin: "0 0 12px" }}>{name}</h3>
              <p style={{ margin: "0 0 10px", color: "var(--ink-2)", fontSize: 13.5, lineHeight: 1.55 }}><strong style={{ color: "var(--ink)" }}>Take:</strong> {take}</p>
              <p style={{ margin: 0, color: "var(--ink-3)", fontSize: 13, lineHeight: 1.55 }}><strong style={{ color: "var(--ink-2)" }}>Watch:</strong> {caution}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 44 }}>
        <div className="kicker" style={{ marginBottom: 14 }}><span className="bullet" />Nutrition articles</div>
        <div className="card" style={{ padding: 0 }}>
          {articles.map((p, i) => (
            <div key={p.slug} className="list-row" style={{ gridTemplateColumns: "110px minmax(0,1fr) 16px", padding: "18px 22px", borderBottom: i < articles.length - 1 ? "1px solid var(--rule)" : 0 }} onClick={()=>setRoute("note", p.slug)}>
              <div className="kicker">{p.date}<br/><span style={{ color: "var(--clay)" }}>{p.tag || "note"}</span></div>
              <div style={{ minWidth: 0 }}>
                <div className="display" style={{ fontSize: 22, lineHeight: 1.1, marginBottom: 5 }}>{p.title}</div>
                <div style={{ color: "var(--ink-2)", fontFamily: "var(--news)", fontSize: 14.5, lineHeight: 1.5 }}>{p.lede}</div>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.6"><path d="m9 6 6 6-6 6" /></svg>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "end", marginBottom: 14 }}>
          <div>
            <div className="kicker" style={{ marginBottom: 8 }}><span className="bullet" />All nutrition entries</div>
            <h2 className="display" style={{ fontSize: 34, lineHeight: 1, margin: 0 }}>{nutrition.length} interventions in the nutrition map.</h2>
          </div>
          <span className="mono">{foodFirst.length} food-first · {supplements.length} supplements</span>
        </div>
        <div className="nutrition-grid compact">
          {nutrition.map(item => <NutritionItemCard key={item.slug} item={item} onPick={onPick} viz={viz} />)}
        </div>
      </section>
    </div>
  );
}

/* ---------- PLAYBOOKS + COMPARE ---------- */

const PLAYBOOKS = [
  {
    slug: "apob-high",
    title: "ApoB or LDL is high",
    lede: "Lower lifetime atherosclerosis risk without getting lost in supplement theater.",
    target: "cvd",
    must: ["statins", "mediterranean-diet", "saturated-fat-replacement", "psyllium", "oat-beta-glucan"],
    next: ["plant-sterols-stanols", "legumes", "olive-oil-evoo", "red-yeast-rice", "omega-3"],
    skip: "Do not use red yeast rice as a cleaner statin. It is an unregulated low-dose statin-like product.",
    measure: ["ApoB", "LDL-C", "non-HDL-C", "blood pressure", "waist circumference"],
  },
  {
    slug: "blood-pressure",
    title: "Blood pressure is high",
    lede: "The boring combination of home readings, DASH, sodium/potassium, cardio, and medication when needed.",
    target: "cvd",
    must: ["dash-diet", "sodium-potassium-balance", "zone2-cardio", "low-alcohol", "ace-inhibitors"],
    next: ["garlic", "aged-garlic-extract", "dietary-nitrate", "sauna", "meditation"],
    skip: "Do not supplement potassium salts casually if kidney function or blood-pressure medications make potassium risky.",
    measure: ["home BP average", "resting heart rate", "potassium/creatinine if medicated", "sleep", "alcohol/week"],
  },
  {
    slug: "over-50-muscle",
    title: "Over 50 and losing muscle",
    lede: "Preserve strength first. The scale can lie; grip, legs, and protein targets tell the truth.",
    target: "sarcopenia",
    must: ["resistance-training", "protein-intake", "creatine", "whey-protein", "vitamin-d3"],
    next: ["collagen-peptides", "calcium-food-first", "zone2-cardio", "sleep-architecture", "social-connection"],
    skip: "Do not diet aggressively without protein and lifting. That often produces a smaller, weaker body.",
    measure: ["grip strength", "chair stands", "lean mass", "protein grams/day", "training sessions/week"],
  },
  {
    slug: "prediabetes",
    title: "Prediabetes or insulin resistance",
    lede: "Prioritize weight, muscle, fiber, post-meal glucose, and the medications with real outcome logic.",
    target: "metabolic",
    must: ["ultra-processed-food-reduction", "zone2-cardio", "resistance-training", "psyllium", "glp1-agonists"],
    next: ["berberine", "acarbose", "legumes", "time-restricted-eating", "sodium-potassium-balance"],
    skip: "Do not chase glucose hacks while keeping the same food environment that caused the excursions.",
    measure: ["HbA1c", "fasting glucose", "waist", "weight trend", "post-meal glucose if using CGM"],
  },
  {
    slug: "sleep-under-65",
    title: "Sleep under 6.5 hours",
    lede: "Do not optimize NAD, fasting, or supplements before fixing the recovery system.",
    target: "sleep",
    must: ["sleep-architecture", "sun-exposure-circadian", "low-alcohol", "zone2-cardio", "meditation"],
    next: ["magnesium", "melatonin", "l-theanine", "sauna", "ashwagandha"],
    skip: "Do not treat melatonin as the fix if late caffeine, alcohol, light, or schedule chaos is the real cause.",
    measure: ["sleep duration", "wake time consistency", "alcohol timing", "caffeine cutoff", "daytime sleepiness"],
  },
  {
    slug: "menopause-transition",
    title: "Menopause transition",
    lede: "The high-leverage window is muscle, bone, ApoB, symptoms, sleep, and informed HRT decisions.",
    target: "frailty",
    must: ["hrt-menopause", "resistance-training", "protein-intake", "calcium-food-first", "vitamin-d3"],
    next: ["statins", "zone2-cardio", "sleep-architecture", "creatine", "collagen-peptides"],
    skip: "Do not let outdated HRT fear or wellness marketing replace a real menopause-risk conversation.",
    measure: ["ApoB", "DEXA/BMD", "grip strength", "vasomotor symptoms", "sleep quality"],
  },
];

function getItem(items, slug) {
  return items.find(i => i.slug === slug);
}

function PlaybookIntervention({ item, label, onPick, viz }) {
  if (!item) return null;
  return (
    <div className="card clickable playbook-row" onClick={()=>onPick(item.slug)}>
      <div>
        <div className="kicker" style={{ marginBottom: 8 }}>{label}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}><VC cat={item.cat} /><span className="display" style={{ fontSize: 22, lineHeight: 1.05 }}>{item.name}</span><VG ev={item.ev} /></div>
        <p>{item.one}</p>
      </div>
      <VS e={item.e} c={item.c} viz={viz} />
    </div>
  );
}

function PlaybooksView({ items, setRoute }) {
  return (
    <div className="page wide">
      <header className="playbook-hero">
        <div>
          <div className="kicker clay" style={{ marginBottom: 12 }}><span className="bullet" />Playbooks</div>
          <h1 className="display" style={{ fontSize: 62, lineHeight: 0.98, margin: "0 0 16px" }}>Start from the problem, not the supplement.</h1>
          <p>Each playbook turns the catalogue into an ordered decision path: fix first, targeted next, what to measure, and what to ignore.</p>
        </div>
        <button className="btn primary" onClick={()=>setRoute("assessment")}>Build a personal path →</button>
      </header>
      <div className="playbook-grid">
        {PLAYBOOKS.map(pb => {
          const count = uniqueItems([...pb.must, ...pb.next].map(slug => getItem(items, slug))).length;
          return (
            <div key={pb.slug} className="card clickable card-pad" onClick={()=>setRoute("playbook", pb.slug)}>
              <div className="kicker" style={{ marginBottom: 10 }}>{count} interventions</div>
              <h2 className="display" style={{ fontSize: 30, lineHeight: 1.03, margin: "0 0 10px" }}>{pb.title}</h2>
              <p style={{ margin: "0 0 18px", color: "var(--ink-2)", fontFamily: "var(--news)", fontSize: 15.5, lineHeight: 1.5 }}>{pb.lede}</p>
              <button className="btn secondary">Open playbook →</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlaybookDetailView({ slug, items, viz, onPick, setRoute }) {
  const pb = PLAYBOOKS.find(p => p.slug === slug) || PLAYBOOKS[0];
  const must = pb.must.map(s => getItem(items, s)).filter(Boolean);
  const next = pb.next.map(s => getItem(items, s)).filter(Boolean);
  return (
    <div className="page wide playbook-detail">
      <button className="btn ghost" style={{ marginBottom: 18, padding: "4px 0", fontSize: 12, fontFamily: "var(--mono)", letterSpacing: "0.08em" }} onClick={()=>setRoute("playbooks")}>← &nbsp;PLAYBOOKS</button>
      <section className="playbook-hero">
        <div>
          <div className="kicker clay" style={{ marginBottom: 12 }}><span className="bullet" />Playbook</div>
          <h1 className="display" style={{ fontSize: 62, lineHeight: 0.98, margin: "0 0 16px" }}>{pb.title}.</h1>
          <p>{pb.lede}</p>
        </div>
        <div className="card deep card-pad">
          <div className="kicker clay" style={{ marginBottom: 10 }}>Measure this</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--ink-4)", lineHeight: 1.75 }}>
            {pb.measure.map(m => <li key={m}>{m}</li>)}
          </ul>
        </div>
      </section>
      <section style={{ marginBottom: 34 }}>
        <div className="kicker" style={{ marginBottom: 14 }}><span className="bullet" />Fix first</div>
        <div className="playbook-list">{must.map((item, i) => <PlaybookIntervention key={item.slug} item={item} label={`Step ${i+1}`} onPick={onPick} viz={viz} />)}</div>
      </section>
      <section style={{ marginBottom: 34 }}>
        <div className="kicker" style={{ marginBottom: 14 }}><span className="bullet" />Targeted next</div>
        <div className="playbook-list">{next.map(item => <PlaybookIntervention key={item.slug} item={item} label="Optional lever" onPick={onPick} viz={viz} />)}</div>
      </section>
      <section className="card card-pad">
        <div className="kicker" style={{ marginBottom: 10 }}><span className="bullet" />Ignore for now</div>
        <p style={{ margin: 0, color: "var(--ink-2)", fontFamily: "var(--news)", fontSize: 17, lineHeight: 1.55 }}>{pb.skip}</p>
      </section>
    </div>
  );
}

function CompareView({ items, viz, onPick }) {
  const [leftSlug, setLeftSlug] = vS("protein-intake");
  const [rightSlug, setRightSlug] = vS("creatine");
  const left = getItem(items, leftSlug) || items[0];
  const right = getItem(items, rightSlug) || items[1];
  const rows = [
    ["Best use", left.forYou, right.forYou],
    ["Skip / caution", left.notForYou, right.notForYou],
    ["Studied dose", left.humanDose, right.humanDose],
    ["Bottom line", left.verdict, right.verdict],
  ];
  return (
    <div className="page wide">
      <header style={{ marginBottom: 26 }}>
        <div className="kicker clay" style={{ marginBottom: 10 }}><span className="bullet" />Compare</div>
        <h1 className="display" style={{ fontSize: 58, lineHeight: 1, margin: "0 0 12px" }}>Put two interventions on the same page.</h1>
        <p style={{ margin: 0, color: "var(--ink-2)", maxWidth: 720, fontFamily: "var(--news)", fontSize: 18, lineHeight: 1.5 }}>Compare evidence, fit, dose, cost, risk, and the practical bottom line before adding anything to your life.</p>
      </header>
      <div className="compare-selectors">
        {[["left", leftSlug, setLeftSlug], ["right", rightSlug, setRightSlug]].map(([side, val, setter]) => (
          <select key={side} value={val} onChange={e=>setter(e.target.value)}>
            {items.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(i => <option key={i.slug} value={i.slug}>{i.name}</option>)}
          </select>
        ))}
      </div>
      <div className="compare-grid">
        {[left, right].map(item => (
          <div key={item.slug} className="card card-pad">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}><VT tier={item.tier} /><VG ev={item.ev} /></div>
            <h2 className="display" style={{ fontSize: 34, lineHeight: 1.02, margin: "0 0 10px" }}>{item.name}</h2>
            <p style={{ color: "var(--ink-2)", margin: "0 0 18px", fontFamily: "var(--news)", fontSize: 16, lineHeight: 1.5 }}>{item.one}</p>
            <VS e={item.e} c={item.c} viz={viz} />
            <button className="btn secondary" style={{ marginTop: 18 }} onClick={()=>onPick(item.slug)}>Open protocol →</button>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 0, marginTop: 18 }}>
        {rows.map(([label, l, r], i) => (
          <div key={label} className="compare-row" style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--rule)" : 0 }}>
            <div className="kicker">{label}</div>
            <p>{textFrom(l) || "No specific note recorded."}</p>
            <p>{textFrom(r) || "No specific note recorded."}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- RESEARCH (today's evidence sweep) ---------- */

function ResearchView({ findings }) {
  // findings: window.SCOUT_FINDINGS — array from latest scout sweep
  const sweep = (findings || []).slice().sort((a,b)=>(b.weight||0)-(a.weight||0));
  const today = new Date();
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dateStr = `${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;
  // Group by focus
  const byFocus = {};
  sweep.forEach(f => { const k = f.focus || "other"; (byFocus[k] = byFocus[k] || []).push(f); });
  const focusOrder = Object.keys(byFocus).sort((a,b)=>byFocus[b].length - byFocus[a].length);
  return (
    <div className="page">
      <div className="kicker" style={{ marginBottom: 8 }}><span className="bullet" />{dateStr} · daily evidence sweep</div>
      <h1 className="display" style={{ fontSize: 56, margin: "0 0 12px", lineHeight: 1 }}>Today's research.</h1>
      <p style={{ fontSize: 16, color: "var(--ink-2)", maxWidth: 720, fontFamily: "var(--news)", letterSpacing: "-0.005em", marginBottom: 36 }}>
        {sweep.length} primary publications surfaced in our last 24-hour sweep across PubMed, bioRxiv, medRxiv, Cochrane and trial registries. Every entry links to the source. Graded items from this sweep land in the catalogue with citations attached.
      </p>
      {focusOrder.map(focus => (
        <section key={focus} style={{ marginBottom: 36 }}>
          <header style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
            <div className="kicker"><span className="bullet" />{focus}</div>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)" }}>· {byFocus[focus].length} findings</span>
          </header>
          <div className="card" style={{ padding: 0 }}>
            {byFocus[focus].slice(0, 12).map((f, i) => (
              <div key={f.pmid || f.url || i} style={{ padding: "16px 22px", borderBottom: i < Math.min(byFocus[focus].length, 12) - 1 ? "1px solid var(--rule)" : 0, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 18, alignItems: "start" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", paddingTop: 4 }}>{f.source || ""}</span>
                <div style={{ minWidth: 0 }}>
                  <a href={f.url} target="_blank" rel="noopener" style={{ color: "var(--ink)", textDecoration: "none", fontWeight: 500, fontSize: 14.5, lineHeight: 1.4, display: "block", marginBottom: 4 }}>
                    {f.title}
                  </a>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", fontFamily: "var(--mono)" }}>
                    {f.pub_date && <span>{f.pub_date}</span>}
                    {f.abstract_or_snippet && <span> · {f.abstract_or_snippet}</span>}
                    {f.doi && <span> · doi:{f.doi}</span>}
                  </div>
                </div>
                <a href={f.url} target="_blank" rel="noopener" className="btn ghost" style={{ fontSize: 11, textDecoration: "none" }}>↗</a>
              </div>
            ))}
          </div>
        </section>
      ))}
      {sweep.length === 0 && (
        <div className="card card-pad" style={{ maxWidth: 600 }}>
          <p style={{ margin: 0, color: "var(--ink-2)" }}>No fresh findings to show right now. The Scout runs daily — check back tomorrow.</p>
        </div>
      )}
    </div>
  );
}

/* ---------- SEARCH ---------- */

function SearchView({ items, query, onPick, setRoute, viz }) {
  const q = (query || "").trim().toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);
  const scoreItem = (item) => {
    const studyText = (item.studies || []).map(s => [s.title, s.finding, s.journal].join(" ")).join(" ");
    const hay = [item.name, item.one, item.plain, item.verdict, item.evidenceSummary, item.mechanism, item.cat, item.ev, studyText, ...(item.tags || []), ...(item.targets || []).map(t => VCL[t] || t)].join(" ").toLowerCase();
    if (!terms.length) return 0;
    return terms.reduce((sum, term) => sum + (hay.includes(term) ? 1 : 0), 0);
  };
  const results = items
    .map(item => ({ item, score: scoreItem(item) }))
    .filter(x => x.score > 0)
    .sort((a,b)=>(b.score - a.score) || ((b.item.e + b.item.c) - (a.item.e + a.item.c)))
    .map(x => x.item);

  return (
    <div className="page wide">
      <div className="kicker" style={{ marginBottom: 8 }}><span className="bullet" />Search</div>
      <h1 className="display" style={{ fontSize: 52, lineHeight: 1, margin: "0 0 10px" }}>{q ? `Results for "${query}"` : "Search the evidence."}</h1>
      <p style={{ fontSize: 16, color: "var(--ink-2)", maxWidth: 720, fontFamily: "var(--news)", margin: "0 0 28px" }}>
        Search names, targets, categories, plain-language summaries, tags, and verdicts. The highest evidence × effect matches float first.
      </p>
      {!q && <button className="btn secondary" onClick={() => setRoute("catalogue")}>Browse the catalogue →</button>}
      {q && (
        <div className="card" style={{ padding: 0 }}>
          <div className="list-row head" style={{ gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr) 130px 50px 16px" }}>
            <span className="mono">{results.length} matches</span><span className="mono">Targets</span><span className="mono">Score</span><span className="mono">Ev</span><span></span>
          </div>
          {results.map(item => (
            <div key={item.slug} className="list-row" style={{ gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr) 130px 50px 16px" }} onClick={()=>onPick(item.slug)}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                  <VC cat={item.cat} />
                  <span className="display" style={{ fontSize: 18, lineHeight: 1.1 }}>{item.name}</span>
                  <VT tier={item.tier} />
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.45 }}>{item.one}</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, minWidth: 0 }}>
                {item.targets.slice(0,3).map(t => <span key={t} className="pill">{VCL[t]}</span>)}
              </div>
              <VS e={item.e} c={item.c} viz={viz} />
              <VG ev={item.ev} />
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.6"><path d="m9 6 6 6-6 6" /></svg>
            </div>
          ))}
          {!results.length && <div style={{ padding: 24, color: "var(--ink-2)" }}>No matches yet. Try a concern like cardiovascular, cognition, sleep, ApoB, protein, or rapamycin.</div>}
        </div>
      )}
    </div>
  );
}

/* ---------- METHODOLOGY ---------- */

function MissionView({ setRoute }) {
  const principles = [
    ["Make the evidence usable", "Trajectory turns longevity research into readable judgment: what matters, what is uncertain, and what a careful person would actually do next."],
    ["Keep content open", "The publication, catalogue, methodology, and assessment should be available without turning the evidence into a paywall."],
    ["Separate claims from incentives", "Commercial ideas should never outrank the review standard. Editorial pages should remain legible even when a product layer exists later."],
    ["Build a personal hub", "The assessment should become a calm control center: saved reading, weekly actions, watchlist, labs, and review packets that can be revisited."],
  ];
  return (
    <div className="page mission-page">
      <section className="mission-hero">
        <div>
          <div className="kicker"><span className="bullet" />Mission</div>
          <h1 className="display">The longevity resource for people who want judgment, not hype.</h1>
        </div>
        <p>
          Trajectory exists to make longevity evidence easier to read, compare, and act on. The goal is a high-trust publication plus a personal evidence hub: open content first, clear methods always, and practical next steps that respect uncertainty.
        </p>
      </section>

      <section className="mission-grid">
        {principles.map(([title, body], index) => (
          <article key={title} className="mission-card">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <section className="mission-band">
        <div>
          <div className="kicker clay"><span className="bullet" />What this becomes</div>
          <h2 className="display">A weekly path through a noisy field.</h2>
        </div>
        <div className="mission-band-copy">
          <p>The reader should land on Trajectory and know what to read today, what to ignore for now, what is worth discussing with a clinician, and which fundamentals deserve more attention than any shiny frontier idea.</p>
          <div>
            <button className="btn primary" onClick={() => setRoute("news")}>Read Notes</button>
            <button className="btn secondary" onClick={() => setRoute("assessment")}>Build my path</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function MethodologyView({ items }) {
  const counts = {
    A: items.filter(i => i.ev === "A").length,
    B: items.filter(i => i.ev === "B").length,
    C: items.filter(i => i.ev === "C").length,
    D: items.filter(i => i.ev === "D").length,
  };
  const principles = [
    ["Human outcomes beat mechanisms", "Animal lifespan, cell pathways, and biomarker movement can be useful, but they do not outrank human RCTs, cohort outcomes, mortality, events, fractures, cognition, or measured function."],
    ["Effect and certainty are separate", "A frontier drug can have a high theoretical effect and low certainty. A boring lifestyle intervention can have a moderate effect and very high certainty. Those are different decisions."],
    ["Protocol matters", "Dose, form, timing, population, contraindications, and monitoring determine whether a study is actually reproducible for a reader."],
    ["We penalize opportunity cost", "If a claim distracts from sleep, training, ApoB control, smoking cessation, protein, fiber, or blood pressure, it has to clear a high bar."],
  ];
  return (
    <div className="page wide" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 330px", gap: 56 }}>
      <main>
        <div className="kicker" style={{ marginBottom: 10 }}><span className="bullet" />Methodology</div>
        <h1 className="display" style={{ fontSize: 64, lineHeight: 0.98, margin: "0 0 18px" }}>How Trajectory grades longevity claims.</h1>
        <p style={{ fontSize: 18, color: "var(--ink-2)", maxWidth: 780, lineHeight: 1.55, fontFamily: "var(--news)", margin: "0 0 34px" }}>
          Every intervention gets two scores: effectiveness, meaning how much it may help if the signal is real; and certainty, meaning how confident we are that the signal applies to humans.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 14, marginBottom: 36 }}>
          {principles.map(([title, body]) => (
            <div key={title} className="card card-pad">
              <h2 className="display" style={{ fontSize: 24, margin: "0 0 8px" }}>{title}</h2>
              <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
        <section className="card card-pad" style={{ marginBottom: 18 }}>
          <div className="kicker" style={{ marginBottom: 14 }}>Evidence grades</div>
          {Object.entries(VED).map(([grade, desc], i) => (
            <div key={grade} style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", gap: 16, padding: "13px 0", borderTop: i ? "1px solid var(--rule)" : 0, alignItems: "center" }}>
              <VG ev={grade} />
              <span style={{ color: "var(--ink-2)" }}>{desc}</span>
              <span className="mono">{counts[grade] || 0} entries</span>
            </div>
          ))}
        </section>
        <section className="card card-pad">
          <div className="kicker" style={{ marginBottom: 14 }}>Editorial promises</div>
          <ul style={{ margin: 0, paddingLeft: 20, color: "var(--ink-2)", lineHeight: 1.75 }}>
            <li>No affiliate ranking logic.</li>
            <li>No supplement storefront.</li>
            <li>No single composite score hiding weak certainty.</li>
            <li>No recommendation without a contraindication surface.</li>
            <li>No change to grades without a visible review trail.</li>
          </ul>
        </section>
      </main>
      <aside style={{ position: "sticky", top: 92, alignSelf: "start" }}>
        <div className="card deep card-pad">
          <div className="kicker clay" style={{ marginBottom: 14 }}>The current corpus</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div><div className="display" style={{ fontSize: 40, lineHeight: 1, color: "var(--paper)" }}>{items.length}</div><div className="kicker">Interventions</div></div>
            <div><div className="display" style={{ fontSize: 40, lineHeight: 1, color: "var(--paper)" }}>{items.reduce((n,i)=>n+(i.studies||[]).length,0)}</div><div className="kicker">Study cards</div></div>
            <div><div className="display" style={{ fontSize: 40, lineHeight: 1, color: "var(--paper)" }}>{items.filter(i=>i.tier===1).length}</div><div className="kicker">Foundation</div></div>
            <div><div className="display" style={{ fontSize: 40, lineHeight: 1, color: "var(--paper)" }}>{items.filter(i=>i.cat==="medication").length}</div><div className="kicker">Medications</div></div>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ---------- ASSESSMENT ---------- */

const TRAJECTORY_ACCOUNT_KEY = "trajectory.account.v1";
const TRAJECTORY_PACKET_KEY = "trajectory.reviewPacket.v1";

async function trajectoryApi(path, options = {}) {
  const res = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

function trajectoryLanguage() {
  const prefix = (window.location.pathname.split("/").filter(Boolean)[0] || "en").toLowerCase();
  return ["de", "fr", "es"].includes(prefix) ? prefix : "en";
}

window.trackTrajectoryEvent = function(event, payload = {}) {
  try {
    const language = payload.language || trajectoryLanguage();
    fetch("/api/analytics/event", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        path: window.location.pathname + window.location.hash,
        route: window.location.hash || "#/today",
        language,
        payload: { language, ...payload },
      }),
    }).catch(() => {});
  } catch (e) {}
};

const ASSESSMENT_STEPS = [
  { key: "age", eyebrow: "Baseline", q: "Where are you in the lifespan curve?", type: "single", opts: ["Under 35","35-49","50-64","65+"] },
  { key: "sex", eyebrow: "Biology", q: "Which evidence track should we bias toward?", type: "single", opts: ["Female","Male","Other / not saying"] },
  { key: "concerns", eyebrow: "Priority", q: "What should the plan protect first?", type: "multi", max: 3, opts: ["Heart disease","Metabolic health","Cognitive decline","Muscle and bone","Cancer","Sleep and recovery","Menopause transition"] },
  { key: "already", eyebrow: "Current routine", q: "What are you already doing consistently?", type: "multi", opts: ["No smoking","7+ hours sleep","Zone 2 cardio","Vigorous intervals","Resistance training","Protein target","Mediterranean diet","High fiber","Creatine","Vitamin D","Omega-3","Statin","GLP-1","Blood-pressure medication"] },
  { key: "signals", eyebrow: "Measured risk", q: "Which signals are known or suspected?", type: "multi", opts: ["High ApoB / LDL","High blood pressure","Prediabetes / insulin resistance","Low muscle mass","Low bone density","Poor sleep","Frequent alcohol","Family history of early heart disease"] },
  { key: "constraints", eyebrow: "Real life", q: "What will shape the plan in practice?", type: "multi", max: 3, opts: ["Low time","Tight budget","Avoid medications unless essential","Prefer food-first","Travel often","Injury limits training","Clinician involved"] },
  { key: "tracking", eyebrow: "Follow-through", q: "How should Trajectory help you stay on path?", type: "single", opts: ["Weekly checklist","Evidence-change alerts","Monthly review packet","Clinician-ready export"] },
  { key: "appetite", eyebrow: "Evidence appetite", q: "How aggressive should Trajectory be?", type: "single", opts: ["Foundation only","Foundation + targeted","Open to frontier"] },
  { key: "account", eyebrow: "Save and send", q: "Want this saved as your Trajectory profile?", type: "account" },
];

const TRAJECTORY_STACKS = [
  {
    slug: "foundation",
    name: "Foundation Stack",
    shortName: "Foundation",
    positioning: "A conservative baseline stack for people who want intake support without pretending capsules outrank sleep, training, food, and medical risk control.",
    status: "Interest list",
    priceCents: 3900,
    cadence: "Monthly",
    ingredients: [
      { slug: "creatine", name: "Creatine monohydrate", dose: "3-5 g/day", rationale: "Strength, muscle, and function support with unusually strong supplement evidence." },
      { slug: "vitamin-d3", name: "Vitamin D3", dose: "Dose after status and sun context", rationale: "Deficiency repletion and older-adult bone/fall context; not a blanket longevity pill." },
      { slug: "omega-3", name: "Omega-3", dose: "EPA/DHA only when diet or triglyceride context supports it", rationale: "Useful in selected contexts; food-first fatty fish remains the cleaner default." },
    ],
    bestFor: ["People building the basics", "Readers who want a simple optional stack after food and training", "Vegetarian or low-sun users who need a second look at intake gaps"],
    notFor: ["Anyone expecting a longevity shortcut", "People on anticoagulants without clinician review", "People with kidney disease or complex medication context without review"],
    contraindications: ["Review kidney disease, anticoagulants, hypercalcemia risk, pregnancy, and medication interactions before use."],
    evidenceSummary: "Creatine carries the strongest case. Vitamin D and omega-3 are contextual, so this stack is framed as intake support, not disease prevention.",
    qualityStandards: ["Third-party tested batches", "Plain disclosed doses", "No proprietary blends", "No NAD, resveratrol, or mechanism-only glamour ingredients"],
    whyNotIncluded: ["NMN/NR because human outcome evidence is not there", "Resveratrol because the supplement case remains weak", "Mega-dose antioxidants because benefit is unproven and risk can rise"],
    faq: [
      ["Do I need this?", "No. The catalogue, assessment, and hub stay free; this is optional fulfillment for people who already want a clean stack."],
      ["Can I browse without assessment?", "Yes. The assessment adds context, but it is not a gate."],
    ],
  },
  {
    slug: "muscle-bone",
    name: "Muscle + Bone Stack",
    shortName: "Muscle + Bone",
    positioning: "Support for the strength, protein, and bone-density lane, built around training rather than replacing it.",
    status: "Interest list",
    priceCents: 4900,
    cadence: "Monthly",
    ingredients: [
      { slug: "creatine", name: "Creatine monohydrate", dose: "3-5 g/day", rationale: "The supplement anchor for strength and lean-mass support." },
      { slug: "protein-intake", name: "Protein support guidance", dose: "1.2-1.6 g/kg/day target", rationale: "Food-first target with optional fulfillment later; the stack should not hide the target." },
      { slug: "vitamin-d3", name: "Vitamin D3", dose: "Contextual", rationale: "Relevant when deficiency, low sun, older age, or bone risk makes it plausible." },
      { slug: "calcium-food-first", name: "Calcium food-first protocol", dose: "Food target before pills", rationale: "Included as guidance because calcium is often better solved through diet." },
    ],
    bestFor: ["Adults over 40 prioritizing strength and function", "People with low muscle or bone-density concern", "Readers doing resistance training"],
    notFor: ["People avoiding resistance training", "People with kidney disease without review", "Anyone using this instead of protein and progressive overload"],
    contraindications: ["Kidney disease, hypercalcemia history, nephrolithiasis risk, or active bone medication plans need clinical review."],
    evidenceSummary: "The strongest path is resistance training plus adequate protein. Creatine can support that path; D/calcium are contextual and bone-risk dependent.",
    qualityStandards: ["Creatine monohydrate only", "Dose transparency", "No testosterone-boosting herbs", "No vague anabolic blend"],
    whyNotIncluded: ["Collagen as the core because muscle outcomes need stronger protein logic", "Boron and exotic minerals because the incremental case is weak", "Hormone-adjacent products"],
    faq: [
      ["Is this for women too?", "Yes, but menopause and osteoporosis context changes the review notes."],
      ["Is protein a supplement here?", "The product should teach the target first; fulfillment can include protein later only if it remains honest."],
    ],
  },
  {
    slug: "cardiometabolic",
    name: "Cardiometabolic Stack",
    shortName: "Cardiometabolic",
    positioning: "Soluble-fiber and food-pattern support for LDL, ApoB, glucose, and weight-risk conversations without pretending supplements replace medical care.",
    status: "Interest list",
    priceCents: 4500,
    cadence: "Monthly",
    ingredients: [
      { slug: "psyllium", name: "Psyllium husk", dose: "5-10 g/day with water", rationale: "Soluble fiber has a practical LDL and glycemic case when used consistently." },
      { slug: "omega-3", name: "Omega-3", dose: "Contextual EPA/DHA", rationale: "Not an LDL-lowering fantasy; relevant mainly for diet pattern or triglyceride context." },
      { slug: "oat-beta-glucan", name: "Oat beta-glucan protocol", dose: "Food-first target", rationale: "Included as guidance because food can do useful work here." },
    ],
    bestFor: ["Readers focused on LDL/ApoB, glucose, or metabolic risk", "People who prefer food-first changes", "Users who need a repeatable fiber habit"],
    notFor: ["People with high cardiovascular risk avoiding clinician care", "Anyone assuming omega-3 lowers LDL", "People with swallowing difficulty or GI obstruction risk"],
    contraindications: ["Separate psyllium from medications; review anticoagulants, arrhythmia context, triglyceride treatment, and GI disease."],
    evidenceSummary: "Fiber is the anchor. Omega-3 is contextual and should never be presented as a replacement for ApoB-lowering therapy when indicated.",
    qualityStandards: ["Plain psyllium", "No proprietary metabolic blend", "Clear medication-spacing instructions", "No fake LDL claims"],
    whyNotIncluded: ["Red yeast rice because it is unregulated statin-like exposure", "Berberine as a default because interaction and quality issues are real", "Green tea extracts at hepatotoxic doses"],
    faq: [
      ["Will this replace a statin?", "No. It can sit beside food-first work; medication decisions are clinician conversations."],
      ["Why so much fiber language?", "Because the boring intervention has a better practical evidence case than most shiny metabolic supplements."],
    ],
  },
  {
    slug: "sleep-recovery",
    name: "Sleep + Recovery Stack",
    shortName: "Sleep + Recovery",
    positioning: "A deliberately conservative recovery stack that keeps schedule, light, alcohol, caffeine, and sleep apnea ahead of pills.",
    status: "Interest list",
    priceCents: 3500,
    cadence: "Monthly",
    ingredients: [
      { slug: "magnesium", name: "Magnesium", dose: "Low-dose evening option", rationale: "Plausible for selected users, but not a cure for poor sleep architecture." },
      { slug: "l-theanine", name: "L-theanine", dose: "Contextual, occasional use", rationale: "Useful for some subjective calm; longevity evidence is not the claim." },
    ],
    bestFor: ["People improving sleep routines", "Users with stress/recovery friction", "Readers who want a low-drama option after basics"],
    notFor: ["People with untreated sleep apnea symptoms", "People using alcohol as sleep medicine", "Anyone needing insomnia care or sedative medication review"],
    contraindications: ["Review kidney disease, sedatives, pregnancy, bipolar history, and persistent insomnia with a clinician."],
    evidenceSummary: "Sleep duration, regularity, light, alcohol, caffeine timing, and apnea screening matter more. Supplements are modest support at best.",
    qualityStandards: ["Low-dose conservative formulations", "No melatonin mega-doses", "No sedative blends", "No dependency framing"],
    whyNotIncluded: ["High-dose melatonin as a default", "GABA blends with weak bioavailability logic", "Ashwagandha as a default due to safety and evidence concerns"],
    faq: [
      ["Will this fix sleep?", "No. It supports a recovery path; it does not replace sleep hygiene, apnea screening, or care for insomnia."],
      ["Why is it conservative?", "Because sleep is an area where products easily overpromise."],
    ],
  },
];

function stackBySlug(slug) {
  return TRAJECTORY_STACKS.find(stack => stack.slug === slug) || TRAJECTORY_STACKS[0];
}

function stackPrice(stack) {
  return stack.priceCents ? `EUR ${Math.round(stack.priceCents / 100)}` : "Interest list";
}

function stackForAssessment(ans = {}, plan = null, recommendation = null) {
  const rec = recommendation || {};
  if (rec.stack?.id) return stackBySlug(rec.stack.id);
  const concerns = plan?.concerns || answerList(ans, "concerns");
  const signals = plan?.signals || answerList(ans, "signals");
  if (concerns.includes("Muscle and bone") || signals.includes("Low muscle mass") || signals.includes("Low bone density")) return stackBySlug("muscle-bone");
  if (concerns.includes("Heart disease") || concerns.includes("Metabolic health") || signals.includes("High ApoB / LDL") || signals.includes("Prediabetes / insulin resistance")) return stackBySlug("cardiometabolic");
  if (concerns.includes("Sleep and recovery") || signals.includes("Poor sleep")) return stackBySlug("sleep-recovery");
  return stackBySlug("foundation");
}

function buildStackInterestSnapshot(ans = {}, plan = null, recommendation = null, source = "assessment") {
  const selectedStack = stackForAssessment(ans, plan, recommendation);
  const rec = recommendation || {};
  return {
    version: 1,
    source,
    status: rec.stack ? "recommended" : "not_recommended",
    stackSlug: selectedStack.slug,
    stackName: selectedStack.name,
    ingredients: rec.stack?.ingredients || [],
    reason: rec.reason || "",
    commerceState: rec.commerceState || "interest_list",
    assessmentDigest: {
      concerns: plan?.concerns || answerList(ans, "concerns"),
      signals: plan?.signals || answerList(ans, "signals"),
      constraints: plan?.constraints || answerList(ans, "constraints"),
      appetite: ans.appetite || "Foundation only",
    },
    updatedAt: new Date().toISOString(),
  };
}

function stackInterestReason(ans = {}) {
  const concerns = answerList(ans, "concerns");
  const signals = answerList(ans, "signals");
  if (signals.length) return "You have measured risk signals, so Trajectory keeps the core plan free and treats stacks as optional support rather than a replacement for review.";
  if (concerns.length) return `Your plan is focused on ${concerns.slice(0, 2).join(" and ")}. The hub keeps that path current while stacks stay browseable, transparent, and secondary.`;
  return "The free hub remembers the plan, flags evidence changes, and keeps stacks separate from editorial recommendations.";
}

function StackInterestOffer({ ans = {}, account = {}, onAccountPatch, source = "assessment", stack = null }) {
  const selectedStack = stack || stackForAssessment(ans);
  const [email, setEmail] = vS(account.email || "");
  const [status, setStatus] = vS("");
  vE(() => { if (account.email) setEmail(account.email); }, [account.email]);

  const captureInterest = async () => {
    setStatus("Saving interest...");
    try {
      const stackInterest = {
        ...(account.stackInterest || {}),
        status: "registered",
        source,
        stackSlug: selectedStack.slug,
        stackName: selectedStack.name,
        email,
        updatedAt: new Date().toISOString(),
      };
      if (onAccountPatch) onAccountPatch({ email, stackInterest });
      await trajectoryApi("/api/stacks/interest", {
        method: "POST",
        body: JSON.stringify({
          email,
          name: account.name || "",
          source,
          language: trajectoryLanguage(),
          stackSlug: selectedStack.slug,
          consent: true,
          intentScore: 85,
          newsletters: account.newsletters || ["weekly", "product"],
          assessment: ans,
          path: window.location.pathname + window.location.hash,
          route: window.location.hash || "#/stacks",
          tags: ["stack-interest", `stack-${selectedStack.slug}`],
        }),
      });
      window.trackTrajectoryEvent && window.trackTrajectoryEvent("stack_interest", { source, stackSlug: selectedStack.slug });
      setStatus("Saved. You are on the stack list.");
    } catch (e) {
      setStatus(e.message || "Could not save");
    }
  };

  return (
    <section className="plan-offer">
      <div>
        <div className="kicker clay"><span className="bullet" />Stack interest</div>
        <h3 className="display">{selectedStack.name}</h3>
        <p>{stackInterestReason(ans)}</p>
      </div>
      <div className="plan-offer-card">
        <div className="plan-offer-top">
          <span>{selectedStack.status}</span>
          <strong>{stackPrice(selectedStack)}</strong>
        </div>
        <p>{selectedStack.positioning}</p>
        <div className="plan-email-row">
          <input className="text-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          <button className="btn primary" onClick={captureInterest}>Join stack list</button>
        </div>
        <small>No charge today. This records demand; checkout stays off until sourcing, testing, and fulfillment are ready.</small>
        {status && <div className="save-toast">{status}</div>}
      </div>
    </section>
  );
}

function WatchlistPanel({ account, saveProfile, setRoute }) {
  const watchlist = account.watchlist || [];
  const syncFromPacket = () => {
    const packet = account.plan && Object.keys(account.plan).length ? account.plan : null;
    if (!packet) return;
    saveProfile({ watchlist: packetWatchlist(packet) });
  };
  return (
    <section className={`watchlist-panel ${watchlist.length ? "" : "empty"}`}>
      <div className="watchlist-head">
        <div>
          <div className="kicker clay"><span className="bullet" />Evidence watchlist</div>
          <h3 className="display">{watchlist.length ? `${watchlist.length} items being watched` : "No watchlist yet"}</h3>
          <p>The watchlist is free. It follows the protocols in your packet and surfaces meaningful evidence changes without putting core evidence behind a paywall.</p>
        </div>
        <div className="watchlist-actions">
          <button className="btn secondary" onClick={syncFromPacket} disabled={!account.plan || !Object.keys(account.plan).length}>Sync from packet</button>
          <button className="btn primary" onClick={()=>setRoute("assessment")}>Update assessment</button>
        </div>
      </div>
      {watchlist.length > 0 && (
        <div className="watchlist-grid">
          {watchlist.slice(0, 12).map(item => (
            <div key={item.slug} className="watchlist-item">
              <strong>{item.name}</strong>
              <span>{item.reason} · evidence {item.evidence} · E {item.effect}/10 · C {item.certainty}/10</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function hubActions(account = {}) {
  const packet = account.plan && Object.keys(account.plan).length ? account.plan : null;
  const rows = packet?.fixFirst?.length ? packet.fixFirst : buildReviewPacket(window.ALL_ITEMS || [], account.assessment || {}).fixFirst;
  return (rows || []).slice(0, 6);
}

function StackHubCard({ account, setRoute }) {
  const assessment = account.assessment || {};
  const hasAssessment = Object.keys(assessment).length > 0;
  if (!hasAssessment) {
    return (
      <div className="path-panel">
        <div className="kicker">Optional stack support</div>
        <h3 className="display" style={{ fontSize: 28, lineHeight: 1.05, margin: "0 0 10px" }}>No stack recommendation yet.</h3>
        <p>Take the free assessment first. The hub only shows stack support after lifestyle, medical-discussion, and food-first priorities are separated.</p>
        <button className="btn secondary" onClick={()=>setRoute("assessment")}>Build my free path →</button>
      </div>
    );
  }

  const plan = buildAssessmentPlan(window.ALL_ITEMS || [], assessment);
  const classified = classifyAssessmentActions(plan);
  const recommendation = recommendStackForAssessment(assessment, plan, classified);
  const ingredients = recommendation.stack
    ? uniqueItems((recommendation.stack.ingredients || []).map(slug => (window.ALL_ITEMS || []).find(item => item.slug === slug)).filter(Boolean))
    : [];

  return (
    <div className="path-panel">
      <div className="kicker">Optional stack support</div>
      {recommendation.stack ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "start", marginBottom: 10 }}>
            <div>
              <h3 className="display" style={{ fontSize: 28, lineHeight: 1.05, margin: "0 0 8px" }}>{recommendation.stack.name}</h3>
              <p style={{ margin: 0 }}>{recommendation.stack.positioning}</p>
            </div>
            <span className="pill">Evidence-gated</span>
          </div>
          <p style={{ marginTop: 10 }}>{recommendation.reason}</p>
          <div style={{ display: "grid", gap: 8, margin: "14px 0" }}>
            {ingredients.length ? ingredients.map(item => (
              <div key={item.slug} className="path-context-row">
                <span>{item.name}</span>
                <strong>Evidence {item.ev} · E {item.e}/10 · C {item.c}/10</strong>
              </div>
            )) : <div className="path-context-row"><span>Ingredients</span><strong>None selected</strong></div>}
          </div>
          <small>Stacks are optional and browseable. Food, training, sleep, screening, and medications may matter more; review contraindications before any supplement decision.</small>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <button className="btn secondary" onClick={()=>setRoute("assessment")}>Update assessment</button>
            <button className="btn ghost" onClick={()=>setRoute("stack", recommendation.stack.id)}>View this stack →</button>
          </div>
        </>
      ) : (
        <>
          <h3 className="display" style={{ fontSize: 28, lineHeight: 1.05, margin: "0 0 10px" }}>No stack recommended.</h3>
          <p>{recommendation.reason}</p>
          <p>The hub stays useful without a product recommendation: keep following the free action path, watchlist, and review packet.</p>
          <button className="btn secondary" onClick={()=>setRoute("assessment")}>Update assessment</button>
        </>
      )}
    </div>
  );
}

function PathHub({ account, saveProfile, setRoute }) {
  const actions = hubActions(account);
  const progress = account.progress || {};
  const actionProgress = progress.actions || {};
  const completed = actions.filter(item => actionProgress[item.slug]?.done).length;
  const percent = actions.length ? Math.round((completed / actions.length) * 100) : 0;
  const [note, setNote] = vS(progress.note || "");
  const toggleAction = (item) => {
    const current = actionProgress[item.slug] || {};
    const nextProgress = {
      ...progress,
      actions: {
        ...actionProgress,
        [item.slug]: {
          ...current,
          done: !current.done,
          name: item.name,
          updatedAt: new Date().toISOString(),
        },
      },
      updatedAt: new Date().toISOString(),
    };
    saveProfile({ progress: nextProgress });
  };
  const saveNote = () => {
    saveProfile({ progress: { ...progress, note, updatedAt: new Date().toISOString() } });
  };
  const assessment = account.assessment || {};
  const constraints = answerList(assessment, "constraints");
  return (
    <section className="path-hub">
      <div className="path-hub-head">
        <div>
          <div className="kicker clay"><span className="bullet" />Personal hub</div>
          <h2 className="display">Your longevity path this week.</h2>
          <p>Track the few moves Trajectory thinks matter now. The free hub separates actions, context, and optional stack support so products never replace the evidence path.</p>
        </div>
        <div className="path-score">
          <strong>{percent}%</strong>
          <span>{completed} of {actions.length || 0} actions done</span>
        </div>
      </div>
      <div className="path-hub-grid">
        <div className="path-panel">
          <div className="kicker">This week</div>
          {actions.length ? actions.map(item => {
            const done = !!actionProgress[item.slug]?.done;
            return (
              <button key={item.slug} className={`path-action ${done ? "done" : ""}`} onClick={()=>toggleAction(item)}>
                <span className="assessment-option-box">{done && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 12 4 4 10-10"/></svg>}</span>
                <span><strong>{item.name}</strong><small>Evidence {item.evidence} · E {item.effect}/10 · C {item.certainty}/10</small></span>
              </button>
            );
          }) : (
            <div className="path-empty">
              <p>No action path yet. Take the assessment to generate one.</p>
              <button className="btn primary" onClick={()=>setRoute("assessment")}>Start assessment</button>
            </div>
          )}
        </div>
        <div className="path-panel">
          <div className="kicker">Context</div>
          <div className="path-context-row"><span>Focus</span><strong>{answerList(assessment, "concerns").slice(0, 2).join(" + ") || "Not set"}</strong></div>
          <div className="path-context-row"><span>Follow-through</span><strong>{assessment.tracking || "Weekly checklist"}</strong></div>
          <div className="path-context-row"><span>Constraints</span><strong>{constraints.length ? constraints.join(", ") : "None set"}</strong></div>
          <label className="form-label">Private note</label>
          <textarea className="text-input path-note" value={note} onChange={e=>setNote(e.target.value)} placeholder="What made this week easier or harder?" />
          <button className="btn secondary" onClick={saveNote}>Save note</button>
        </div>
        <StackHubCard account={account} setRoute={setRoute} />
      </div>
    </section>
  );
}

function AssessmentCard({ item, label, onPick, viz }) {
  if (!item) return null;
  return (
    <button className="card clickable" style={{ padding: "18px 20px", textAlign: "left", display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 18, alignItems: "start", width: "100%" }} onClick={()=>onPick(item.slug)}>
      <div style={{ minWidth: 0 }}>
        <div className="kicker" style={{ marginBottom: 8 }}>{label}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
          <VC cat={item.cat} />
          <span className="display" style={{ fontSize: 23, lineHeight: 1.05 }}>{item.name}</span>
          <VG ev={item.ev} />
        </div>
        <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 13.5, lineHeight: 1.5 }}>{item.one}</p>
      </div>
      <VS e={item.e} c={item.c} viz={viz || "cell"} />
    </button>
  );
}

function loadTrajectoryAccount() {
  try {
    const parsed = JSON.parse(localStorage.getItem(TRAJECTORY_ACCOUNT_KEY) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  }
  catch (e) { return {}; }
}

function saveTrajectoryAccount(next) {
  try { localStorage.setItem(TRAJECTORY_ACCOUNT_KEY, JSON.stringify(next)); }
  catch (e) {}
}

function saveReviewPacket(packet) {
  try { localStorage.setItem(TRAJECTORY_PACKET_KEY, JSON.stringify(packet)); }
  catch (e) {}
}

function uniqueItems(items) {
  const seen = new Set();
  return items.filter(item => {
    if (!item || seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
}

function answerList(ans, key) {
  const value = ans[key];
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function includesAnswer(ans, key, value) {
  return answerList(ans, key).includes(value);
}

const ASSESSMENT_ACTION_BUCKETS = {
  lifestyle: new Set([
    "no-smoking", "sleep-architecture", "zone2-cardio", "vo2max-training", "resistance-training",
    "low-alcohol", "meditation", "social-connection", "sun-exposure-circadian",
  ]),
  medical: new Set([
    "statins", "glp1-agonists", "ace-inhibitors", "sglt2-inhibitors", "low-dose-aspirin",
    "hrt-menopause", "trt-hypogonadism", "metformin", "rapamycin", "finasteride", "vaccines",
  ]),
  foodFirst: new Set([
    "mediterranean-diet", "protein-intake", "psyllium", "oat-beta-glucan", "saturated-fat-replacement",
    "dash-diet", "sodium-potassium-balance", "calcium-food-first", "ultra-processed-food-reduction",
    "legumes", "olive-oil-evoo", "walnuts", "soy-foods", "flaxseed", "fermented-foods",
  ]),
  optionalSupplement: new Set(["creatine", "vitamin-d3", "omega-3", "magnesium"]),
};

const STACK_RECOMMENDATIONS = {
  foundation: {
    id: "foundation",
    name: "Foundation Stack",
    positioning: "Optional intake support only when assessment gaps point to vitamin D, omega-3, or magnesium context.",
    commerceState: "interest_only",
    ingredients: ["vitamin-d3", "omega-3", "magnesium"],
  },
  muscleBone: {
    id: "muscle-bone",
    name: "Muscle + Bone Stack",
    positioning: "Optional support for strength, protein, and bone-health routines after training and food targets are visible.",
    commerceState: "interest_only",
    ingredients: ["creatine", "vitamin-d3"],
  },
  cardiometabolic: {
    id: "cardiometabolic",
    name: "Cardiometabolic Stack",
    positioning: "Optional soluble-fiber support when food-first cardiometabolic work is relevant and higher-caution flags are absent.",
    commerceState: "interest_only",
    ingredients: ["psyllium", "omega-3"],
  },
  sleepRecovery: {
    id: "sleep-recovery",
    name: "Sleep + Recovery Stack",
    positioning: "Optional intake support after sleep schedule, light, alcohol, and recovery basics are surfaced first.",
    commerceState: "interest_only",
    ingredients: ["magnesium"],
  },
};

function classifyAssessmentActions(plan = {}) {
  const rows = uniqueItems([...(plan.fixFirst || []), ...(plan.targeted || [])]);
  const bucket = (set) => rows.filter(item => set.has(item.slug));
  return {
    lifestyle: bucket(ASSESSMENT_ACTION_BUCKETS.lifestyle),
    medical: bucket(ASSESSMENT_ACTION_BUCKETS.medical),
    foodFirst: bucket(ASSESSMENT_ACTION_BUCKETS.foodFirst),
    optionalSupplement: bucket(ASSESSMENT_ACTION_BUCKETS.optionalSupplement),
  };
}

function recommendStackForAssessment(ans = {}, plan = {}, classified = null) {
  const groups = classified || classifyAssessmentActions(plan);
  const concerns = plan.concerns || answerList(ans, "concerns");
  const signals = plan.signals || answerList(ans, "signals");
  const constraints = plan.constraints || answerList(ans, "constraints");
  const already = answerList(ans, "already");
  const optionalSlugs = new Set((groups.optionalSupplement || []).map(item => item.slug));
  const foodSlugs = new Set((groups.foodFirst || []).map(item => item.slug));
  const suppressReasons = [];
  if (constraints.includes("Clinician involved")) suppressReasons.push("a clinician is already involved");
  if (already.some(x => ["Statin", "GLP-1", "Blood-pressure medication"].includes(x))) suppressReasons.push("medication context is present");
  if (signals.length >= 2) suppressReasons.push("multiple measured risk signals are present");
  if (concerns.includes("Heart disease")) suppressReasons.push("heart-disease risk needs clinician-first framing");
  if (ans.age === "65+") suppressReasons.push("age 65+ is a higher-caution context");

  if (suppressReasons.length) {
    return {
      stack: null,
      reason: `No stack recommended here because ${suppressReasons[0]}. Keep the supplement question in the review/discussion lane rather than treating it as a default purchase.`,
      commerceState: "interest_only",
    };
  }

  const hasMuscleBoneFit = concerns.includes("Muscle and bone") || signals.includes("Low muscle mass") || signals.includes("Low bone density");
  if (hasMuscleBoneFit && (optionalSlugs.has("creatine") || optionalSlugs.has("vitamin-d3"))) {
    const ingredients = STACK_RECOMMENDATIONS.muscleBone.ingredients.filter(slug => optionalSlugs.has(slug));
    return { stack: { ...STACK_RECOMMENDATIONS.muscleBone, ingredients }, reason: "Muscle/bone answers surfaced optional creatine or vitamin D support after resistance training, protein, and calcium-food-first items.", commerceState: "interest_only" };
  }

  const hasCardiometabolicFit = signals.includes("High ApoB / LDL") || signals.includes("Prediabetes / insulin resistance") || concerns.includes("Metabolic health");
  if (hasCardiometabolicFit && (foodSlugs.has("psyllium") || foodSlugs.has("oat-beta-glucan") || foodSlugs.has("ultra-processed-food-reduction") || optionalSlugs.has("omega-3"))) {
    const ingredients = STACK_RECOMMENDATIONS.cardiometabolic.ingredients.filter(slug => optionalSlugs.has(slug) || foodSlugs.has(slug));
    if (ingredients.length) {
      return { stack: { ...STACK_RECOMMENDATIONS.cardiometabolic, ingredients }, reason: "Cardiometabolic answers made soluble fiber and diet-pattern work relevant; this remains optional support after food-first changes.", commerceState: "interest_only" };
    }
  }

  const hasSleepFit = signals.includes("Poor sleep") || concerns.includes("Sleep and recovery");
  if (hasSleepFit && optionalSlugs.has("magnesium")) {
    const ingredients = STACK_RECOMMENDATIONS.sleepRecovery.ingredients.filter(slug => optionalSlugs.has(slug));
    return { stack: { ...STACK_RECOMMENDATIONS.sleepRecovery, ingredients }, reason: "Sleep answers surfaced recovery support only after schedule, light, and alcohol basics are separated first.", commerceState: "interest_only" };
  }

  const foundationGaps = ["vitamin-d3", "omega-3", "magnesium"].filter(slug => optionalSlugs.has(slug));
  if (foundationGaps.length) {
    return { stack: { ...STACK_RECOMMENDATIONS.foundation, ingredients: foundationGaps }, reason: "The only stack fit is a conservative intake-support option based on the optional supplement gaps shown above.", commerceState: "interest_only" };
  }

  return { stack: null, reason: "No stack recommended from these answers. The highest-value next steps are lifestyle, medical discussion where relevant, and food-first changes.", commerceState: "interest_only" };
}

function buildAssessmentPlan(items, ans) {
  const bySlug = (slug) => items.find(i => i.slug === slug);
  const topFoundation = items
    .filter(i => i.tier === 1)
    .sort((a,b)=>(b.e+b.c)-(a.e+a.c));

  const alreadyMap = {
    "No smoking": "no-smoking",
    "7+ hours sleep": "sleep-architecture",
    "Zone 2 cardio": "zone2-cardio",
    "Vigorous intervals": "vo2max-training",
    "Resistance training": "resistance-training",
    "Protein target": "protein-intake",
    "Mediterranean diet": "mediterranean-diet",
    "High fiber": "psyllium",
    "Creatine": "creatine",
    "Vitamin D": "vitamin-d3",
    "Omega-3": "omega-3",
    "Statin": "statins",
    "GLP-1": "glp1-agonists",
    "Blood-pressure medication": "ace-inhibitors",
  };

  const concernMap = {
    "Heart disease": ["cvd", ["statins", "mediterranean-diet", "saturated-fat-replacement", "psyllium", "oat-beta-glucan"]],
    "Metabolic health": ["metabolic", ["ultra-processed-food-reduction", "zone2-cardio", "resistance-training", "psyllium", "glp1-agonists"]],
    "Cognitive decline": ["cognitive-decline", ["sleep-architecture", "vo2max-training", "social-connection", "mediterranean-diet"]],
    "Muscle and bone": ["sarcopenia", ["resistance-training", "protein-intake", "creatine", "calcium-food-first", "vitamin-d3"]],
    "Cancer": ["cancer", ["no-smoking", "vaccines", "low-alcohol", "mediterranean-diet"]],
    "Sleep and recovery": ["sleep", ["sleep-architecture", "sun-exposure-circadian", "low-alcohol", "meditation"]],
    "Menopause transition": ["frailty", ["hrt-menopause", "resistance-training", "protein-intake", "calcium-food-first", "vitamin-d3"]],
  };

  const signalMap = {
    "High ApoB / LDL": ["statins", "saturated-fat-replacement", "oat-beta-glucan", "psyllium"],
    "High blood pressure": ["dash-diet", "sodium-potassium-balance", "zone2-cardio", "ace-inhibitors"],
    "Prediabetes / insulin resistance": ["ultra-processed-food-reduction", "zone2-cardio", "resistance-training", "psyllium"],
    "Low muscle mass": ["resistance-training", "protein-intake", "creatine"],
    "Low bone density": ["resistance-training", "calcium-food-first", "vitamin-d3"],
    "Poor sleep": ["sleep-architecture", "sun-exposure-circadian", "low-alcohol"],
    "Frequent alcohol": ["low-alcohol"],
    "Family history of early heart disease": ["statins", "zone2-cardio", "mediterranean-diet"],
  };

  const concerns = answerList(ans, "concerns");
  const signals = answerList(ans, "signals");
  const constraints = answerList(ans, "constraints");
  const appetite = ans.appetite || "Foundation only";
  const alreadySlugs = new Set(answerList(ans, "already").map(x => alreadyMap[x]).filter(Boolean));
  const fixSlugs = [];
  if (!alreadySlugs.has("no-smoking")) fixSlugs.push("no-smoking");
  if (!alreadySlugs.has("sleep-architecture")) fixSlugs.push("sleep-architecture");
  if (!alreadySlugs.has("zone2-cardio")) fixSlugs.push("zone2-cardio");
  if (!alreadySlugs.has("resistance-training")) fixSlugs.push("resistance-training");
  if ((ans.age === "50-64" || ans.age === "65+" || concerns.includes("Muscle and bone") || concerns.includes("Menopause transition")) && !alreadySlugs.has("protein-intake")) fixSlugs.push("protein-intake");

  signals.forEach(s => (signalMap[s] || []).forEach(slug => fixSlugs.push(slug)));
  concerns.forEach(c => ((concernMap[c] || [null, []])[1] || []).forEach(slug => fixSlugs.push(slug)));

  const already = uniqueItems([...alreadySlugs].map(bySlug));
  const fixFirst = uniqueItems([...fixSlugs.map(bySlug), ...topFoundation])
    .filter(i => !alreadySlugs.has(i.slug))
    .slice(0, 6);
  const targeted = uniqueItems([
    ...concerns.flatMap(c => (concernMap[c] || [null, []])[1].map(bySlug)),
    ...concerns.flatMap(c => items.filter(i => {
      const target = (concernMap[c] || [null])[0];
      return target && i.targets.includes(target);
    }).sort((a,b)=>(b.e+b.c)-(a.e+a.c)))
  ]).filter(i => !alreadySlugs.has(i.slug) && !fixFirst.some(f => f.slug === i.slug)).slice(0, 5);
  const frontierAllowed = appetite === "Open to frontier";
  const frontier = frontierAllowed
    ? items.filter(i => !alreadySlugs.has(i.slug) && (i.tier === 3 || i.ev === "C" || i.ev === "D")).sort((a,b)=>b.e-a.e).slice(0, 3)
    : [];
  return { already, fixFirst, targeted, frontier, frontierAllowed, concerns, signals, constraints };
}

function buildReviewPacket(items, ans = {}) {
  const plan = buildAssessmentPlan(items, ans);
  const selectedStack = stackForAssessment(ans, plan);
  const section = (rows) => rows.map(item => ({
    slug: item.slug,
    name: item.name,
    tier: item.tier,
    evidence: item.ev,
    effect: item.e,
    certainty: item.c,
    summary: item.one,
    action: item.action || item.todo?.[0] || item.what || "",
  }));
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    stackSlug: selectedStack.slug,
    stackName: selectedStack.name,
    answers: ans,
    concerns: plan.concerns,
    signals: plan.signals,
    constraints: plan.constraints,
    tracking: ans.tracking || "Weekly checklist",
    already: section(plan.already),
    fixFirst: section(plan.fixFirst),
    targeted: section(plan.targeted),
    frontier: section(plan.frontier),
  };
}

function packetWatchlist(packet) {
  const rows = [
    ...((packet.fixFirst || []).map(item => ({ ...item, reason: "fix-first" }))),
    ...((packet.targeted || []).map(item => ({ ...item, reason: "targeted" }))),
  ];
  const seen = new Set();
  return rows.filter(item => {
    if (!item.slug || seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  }).slice(0, 12).map(item => ({
    slug: item.slug,
    name: item.name,
    reason: item.reason,
    evidence: item.evidence,
    effect: item.effect,
    certainty: item.certainty,
  }));
}

function packetMarkdown(packet) {
  const lines = [
    `# Trajectory review packet`,
    ``,
    `Generated: ${new Date(packet.generatedAt).toLocaleString()}`,
    `Product recommendation: hidden for content-first launch`,
    ``,
    `## Context`,
    `Concerns: ${(packet.concerns || []).join(", ") || "None selected"}`,
    `Signals: ${(packet.signals || []).join(", ") || "None selected"}`,
    `Constraints: ${(packet.constraints || []).join(", ") || "None selected"}`,
    `Follow-through: ${packet.tracking || "Weekly checklist"}`,
    ``,
  ];
  const addSection = (title, rows) => {
    lines.push(`## ${title}`);
    if (!rows.length) {
      lines.push(`No items in this section.`, ``);
      return;
    }
    rows.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.name} — evidence ${item.evidence}, effect ${item.effect}/10, certainty ${item.certainty}/10`);
      if (item.summary) lines.push(`   ${item.summary}`);
      if (item.action) lines.push(`   Action note: ${item.action}`);
    });
    lines.push(``);
  };
  addSection("Already covered", packet.already || []);
  addSection("Fix first", packet.fixFirst || []);
  addSection("Targeted next", packet.targeted || []);
  addSection("Frontier reading", packet.frontier || []);
  lines.push(`This is an evidence review aid, not medical advice.`);
  return lines.join("\n");
}

function ReviewPacket({ items = [], ans = {}, account = {}, onAccountPatch }) {
  const packet = vM(() => buildReviewPacket(items, ans), [items, JSON.stringify(ans)]);
  const [status, setStatus] = vS("");
  const savePacket = () => {
    const watchlist = packetWatchlist(packet);
    saveReviewPacket(packet);
    if (onAccountPatch) onAccountPatch({ plan: packet, watchlist });
    setStatus("Review packet saved locally.");
  };
  const copyPacket = async () => {
    try {
      await navigator.clipboard.writeText(packetMarkdown(packet));
      setStatus("Review packet copied.");
    } catch (e) {
      setStatus("Copy failed; download still works.");
    }
  };
  const downloadPacket = () => {
    const blob = new Blob([packetMarkdown(packet)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `trajectory-review-packet-${new Date().toISOString().slice(0,10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatus("Review packet downloaded.");
  };
  const rows = [
    ["Fix first", packet.fixFirst || []],
    ["Targeted next", packet.targeted || []],
    ["Frontier reading", packet.frontier || []],
  ];
  return (
    <section className="review-packet">
      <div className="review-packet-head">
        <div>
          <div className="kicker clay"><span className="bullet" />Review packet</div>
          <h3 className="display">A plan someone can actually review.</h3>
          <p>Generated from the assessment, ordered by evidence and context. The packet is free, saveable, copyable, and designed to make the next reading and action path easier to review.</p>
        </div>
        <div className="review-packet-actions">
          <button className="btn secondary" onClick={copyPacket}>Copy</button>
          <button className="btn secondary" onClick={downloadPacket}>Download</button>
          <button className="btn primary" onClick={savePacket}>Save packet</button>
        </div>
      </div>
      <div className="review-packet-grid">
        {rows.map(([label, list]) => (
          <div key={label} className="review-packet-column">
            <div className="kicker">{label}</div>
            {list.length ? list.slice(0, 4).map(item => (
              <div key={item.slug} className="review-packet-item">
                <strong>{item.name}</strong>
                <span>Evidence {item.evidence} · E {item.effect}/10 · C {item.certainty}/10</span>
              </div>
            )) : <p>No items yet.</p>}
          </div>
        ))}
      </div>
      {status && <div className="save-toast">{status}</div>}
    </section>
  );
}

function AssessmentResults({ items, ans, account, onPick, setRoute, onSaveAccount, onAccountPatch }) {
  const plan = buildAssessmentPlan(items, ans);
  const { already, frontier, frontierAllowed, concerns, signals } = plan;
  const classified = classifyAssessmentActions(plan);
  const stackRecommendation = recommendStackForAssessment(ans, plan, classified);
  const bySlug = (slug) => items.find(i => i.slug === slug);
  const stackIngredientItems = stackRecommendation.stack ? uniqueItems((stackRecommendation.stack.ingredients || []).map(bySlug).filter(Boolean)) : [];
  vE(() => {
    if (!onAccountPatch) return;
    const snapshot = buildStackInterestSnapshot(ans, plan, stackRecommendation, "assessment_results");
    const prev = account.stackInterest || {};
    const same = prev.status === snapshot.status && prev.stackSlug === snapshot.stackSlug && prev.reason === snapshot.reason;
    if (!same) onAccountPatch({ stackInterest: snapshot });
  }, [JSON.stringify(ans), stackRecommendation.stack?.id || "none", stackRecommendation.reason]);
  vE(() => {
    if (!onAccountPatch) return;
    const packet = buildReviewPacket(items, ans);
    const watchlist = packetWatchlist(packet);
    const prevPlan = account.plan || {};
    const samePlan = prevPlan.generatedAt && JSON.stringify(prevPlan.answers || {}) === JSON.stringify(ans);
    if (!samePlan) onAccountPatch({ plan: packet, watchlist });
  }, [JSON.stringify(ans)]);
  const sectionCopy = {
    lifestyle: "Behavior and routine levers first: sleep, training, alcohol, smoking, light, stress, and connection before narrower tactics.",
    medical: "Clinician discussion lane: medications, hormones, abnormal risk signals, or higher-caution context stay separate from self-directed supplement support.",
    foodFirst: "Food and dietary-pattern changes before pills: protein, fiber, saturated-fat replacement, DASH/Mediterranean patterns, and mineral intake from food.",
    optionalSupplement: "Supplement questions appear only after lifestyle, medical discussion, and food-first changes are separated. Content and safety context stay primary.",
  };
  const resultText = [
    already.length ? `You already cover ${already.length} high-value move${already.length === 1 ? "" : "s"}, so they are separated from the add-next list.` : "",
    concerns.length ? `Your plan is biased toward ${concerns.slice(0, 2).join(" and ")}.` : "",
    signals.length ? "Known risk signals were moved up the queue so the plan stays grounded in measurable context." : "",
    "This assessment focuses on content, weekly actions, and review context.",
  ].filter(Boolean).join(" ");
  const renderActionSection = (key, label, rows, emptyText) => (
    <section style={{ marginBottom: 22 }}>
      <div className="kicker" style={{ marginBottom: 10 }}><span className="bullet" />{label}</div>
      <p style={{ margin: "0 0 10px", color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>{sectionCopy[key]}</p>
      <div style={{ display: "grid", gap: 10 }}>
        {rows.length ? rows.map((item, i) => <AssessmentCard key={item.slug} item={item} label={i === 0 ? label : "Evidence item"} onPick={onPick} />) : <div className="card card-pad-sm"><p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14 }}>{emptyText}</p></div>}
      </div>
    </section>
  );

  return (
    <div className="assessment-results">
      <div className="card deep card-pad assessment-result-hero">
        <div className="kicker clay" style={{ marginBottom: 10 }}>Your evidence path</div>
        <h2 className="display">Separate the levers before changing the plan.</h2>
        <p style={{ color: "var(--ink-4)", maxWidth: 620, margin: 0, fontFamily: "var(--news)", fontSize: 16, lineHeight: 1.55 }}>
          {resultText || "Your answers point to a foundation-first path: take the high-certainty wins before spending attention on narrow protocols."}
        </p>
        <div className="assessment-result-actions">
          <button className="btn clay" onClick={()=>setRoute("account")}>Open my hub</button>
          <button className="btn assessment-hero-secondary" onClick={onSaveAccount}>{account.email ? "Sync account" : "Save local profile"}</button>
        </div>
      </div>

      <ReviewPacket items={items} ans={ans} account={account} onAccountPatch={onAccountPatch} />

      <section className="assessment-next-panel">
        <div>
          <div className="kicker"><span className="bullet" />This week</div>
          <h3 className="display">Start with the first three moves.</h3>
          <p>The full packet is saved into your hub. This short list is the part meant to be acted on.</p>
        </div>
        <div className="assessment-next-list">
          {plan.fixFirst.slice(0, 3).map((item, index) => (
            <button key={item.slug} onClick={()=>onPick(item.slug)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.name}</strong>
              <small>Evidence {item.ev} · effect {item.e}/10 · certainty {item.c}/10</small>
            </button>
          ))}
        </div>
      </section>

      {renderActionSection("lifestyle", "Lifestyle actions", classified.lifestyle, "No new lifestyle action was pulled from the assessment. Keep the already-covered wins visible in the summary below.")}

      {renderActionSection("medical", "Medical discussion items", classified.medical, "No medication or clinician-led item was added by these answers.")}

      {renderActionSection("foodFirst", "Food-first changes", classified.foodFirst, "No specific food-first change was added beyond the general foundation path.")}

      <section className="card card-pad" style={{ marginBottom: 22 }}>
        <div className="kicker" style={{ marginBottom: 10 }}><span className="bullet" />Supplement context</div>
        <p style={{ margin: "0 0 12px", color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>{sectionCopy.optionalSupplement}</p>
        <div style={{ display: "grid", gap: 10 }}>
          {classified.optionalSupplement.length ? classified.optionalSupplement.map(item => <AssessmentCard key={item.slug} item={item} label="Optional support" onPick={onPick} />) : <div className="card card-pad-sm"><p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14 }}>No supplement support item is needed from these answers.</p></div>}
        </div>
        <div className="card card-pad-sm" style={{ marginTop: 12 }}>
          <div className="kicker">Content-first mode</div>
          <h3 className="display" style={{ fontSize: 24, margin: "8px 0" }}>Keep the review path visible.</h3>
          <p style={{ margin: "0 0 8px", color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>Trajectory is focused on open content, assessment, watchlist, and weekly review tools.</p>
          <small>Use the catalogue and methodology to review evidence before changing anything.</small>
        </div>
      </section>

      {already.length > 0 && (
        <section className="assessment-section">
          <div className="kicker"><span className="bullet" />Already doing well</div>
          <div className="assessment-mini-grid">
            {already.map(item => (
              <div key={item.slug} className="card card-pad-sm assessment-already-card">
                <span className="assessment-check">✓</span>
                <button onClick={()=>onPick(item.slug)}>{item.name}</button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="card card-pad" style={{ marginBottom: 22 }}>
        <div className="kicker" style={{ marginBottom: 10 }}><span className="bullet" />Frontier filter</div>
        {frontierAllowed ? (
          <div style={{ display: "grid", gap: 10 }}>
            <p style={{ margin: "0 0 4px", color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>You said you are open to frontier ideas. These are reading topics, not default actions.</p>
            {frontier.map(item => <AssessmentCard key={item.slug} item={item} label="Optional reading" onPick={onPick} />)}
          </div>
        ) : (
          <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>
            You chose a conservative evidence appetite, so we are hiding frontier bets by default. That is usually the right call until sleep, training, blood pressure, ApoB, protein, fiber, and smoking status are handled.
          </p>
        )}
      </section>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn primary" onClick={()=>setRoute("catalogue")}>Open the full catalogue →</button>
        <button className="btn secondary" onClick={()=>setRoute("methodology")}>How these were graded</button>
      </div>
    </div>
  );
}

function AssessmentView({ items = [], onPick, setRoute }) {
  const [step, setStep] = vS(0);
  const [ans, setAns] = vS(() => (loadTrajectoryAccount().assessment || {}));
  const [account, setAccount] = vS(() => loadTrajectoryAccount());
  const cur = ASSESSMENT_STEPS[step];
  const done = step >= ASSESSMENT_STEPS.length;
  const setAnswer = (key, value) => setAns(prev => ({ ...prev, [key]: value }));
  vE(() => {
    const next = { ...account, assessment: ans, updatedAt: new Date().toISOString() };
    setAccount(next);
    saveTrajectoryAccount(next);
  }, [JSON.stringify(ans)]);
  const toggleAnswer = (key, value, max) => {
    const next = new Set(answerList(ans, key));
    next.has(value) ? next.delete(value) : next.add(value);
    const arr = Array.from(next).slice(0, max || 99);
    setAnswer(key, arr);
  };
  const saveAccountFromAssessment = () => {
    const next = { ...account, assessment: ans, updatedAt: new Date().toISOString() };
    setAccount(next);
    saveTrajectoryAccount(next);
  };
  const patchAccountFromAssessment = (patch) => {
    const next = { ...account, ...patch, assessment: ans, updatedAt: new Date().toISOString() };
    setAccount(next);
    saveTrajectoryAccount(next);
  };
  return (
    <div className="page assessment-page">
      <header className="assessment-shell-head">
        <div>
          <div className="kicker clay"><span className="bullet" />Longevity assessment</div>
          <h1 className="display">Build a personal evidence path.</h1>
          <p>Trajectory turns your context into a small weekly plan, a review packet, and a watchlist you can return to each week.</p>
        </div>
        <div className="assessment-shell-card assessment-status-card">
          <span>{Object.keys(ans).length ? "Profile saved" : "Start here"}</span>
          <strong>{Object.keys(ans).length ? "Ready" : "Private"}</strong>
          <small>{Object.keys(ans).length ? "review path active" : "saved on this device"}</small>
        </div>
      </header>
      <div className="assessment-progress">
        <div className="bar" style={{ background: "var(--paper-3)" }}><span style={{ width: `${(Math.min(step, ASSESSMENT_STEPS.length)/ASSESSMENT_STEPS.length)*100}%`, transition: "width .35s" }} /></div>
        <div className="assessment-progress-label">
          <span>Assessment</span>
          <span>{Math.min(step+1, ASSESSMENT_STEPS.length)} · {ASSESSMENT_STEPS.length}</span>
        </div>
      </div>
      {!done && (
        <div className="assessment-step-rail" aria-label="Assessment sections">
          {ASSESSMENT_STEPS.map((item, index) => (
            <button
              key={item.key || item.eyebrow}
              className={`${index < step ? "done" : ""} ${index === step ? "active" : ""}`}
              onClick={() => setStep(index)}
              type="button"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.eyebrow}</strong>
            </button>
          ))}
        </div>
      )}
      {!done ? (
        <>
          <div className="kicker" style={{ marginBottom: 10 }}><span className="bullet" />{cur.eyebrow}</div>
          <h2 className="display assessment-question">{cur.q}</h2>
          {cur.type === "account" ? (
            <AccountCapture account={account} setAccount={setAccount} ans={ans} />
          ) : (
            <div className={cur.type === "multi" ? "assessment-option-grid multi" : "assessment-option-grid"}>
              {cur.opts.map((opt, i) => {
                const sel = cur.type === "multi" ? includesAnswer(ans, cur.key, opt) : ans[cur.key] === opt;
                return (
                  <button key={i} className={`assessment-option ${sel ? "selected" : ""}`} onClick={()=>{
                    cur.type === "multi" ? toggleAnswer(cur.key, opt, cur.max) : setAnswer(cur.key, opt);
                    if (cur.type === "single") setTimeout(()=>setStep(step+1), 180);
                  }}>
                    <span className="assessment-option-box">{sel && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m5 12 4 4 10-10"/></svg>}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          )}
          <div className="assessment-nav">
            <button className="btn ghost" disabled={step === 0} onClick={()=>setStep(step-1)} style={{ opacity: step === 0 ? 0.4 : 1 }}>← Back</button>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {step > 0 && <button className="btn secondary" onClick={()=>setRoute("account")}>View hub</button>}
              <button className="btn primary" onClick={()=>{ if (cur.type === "account") saveAccountFromAssessment(); setStep(step+1); }}>{cur.type === "multi" ? "Continue" : cur.type === "account" ? "See my plan" : "Skip" } →</button>
            </div>
          </div>
        </>
      ) : <AssessmentResults items={items} ans={ans} account={account} onPick={onPick} setRoute={setRoute} onSaveAccount={saveAccountFromAssessment} onAccountPatch={patchAccountFromAssessment} />}
    </div>
  );
}

function AccountCapture({ account, setAccount, ans }) {
  const [status, setStatus] = vS("");
  const update = (patch) => {
    const next = { ...account, ...patch, assessment: ans };
    setAccount(next);
    saveTrajectoryAccount(next);
  };
  const newsletters = account.newsletters || ["weekly"];
  const toggleNewsletter = (value) => {
    const next = newsletters.includes(value) ? newsletters.filter(x => x !== value) : [...newsletters, value];
    update({ newsletters: next });
  };
  const saveLead = async () => {
    setStatus("Saving…");
    try {
      await trajectoryApi("/api/crm/leads", {
        method: "POST",
        body: JSON.stringify({
          email: account.email,
          name: account.name || "",
          source: "assessment",
          language: trajectoryLanguage(),
          newsletters,
          assessment: ans,
          tags: ["assessment"],
        }),
      });
      window.trackTrajectoryEvent && window.trackTrajectoryEvent("lead_saved", { source: "assessment" });
      setStatus("Saved to CRM");
    } catch (e) {
      setStatus(e.message || "Could not save");
    }
  };
  return (
    <div className="account-capture">
      <div className="card card-pad">
        <div className="kicker" style={{ marginBottom: 10 }}>Save the profile</div>
        <input className="text-input" type="email" value={account.email || ""} onChange={e=>update({ email: e.target.value })} placeholder="you@example.com" />
        <input className="text-input" style={{ marginTop: 10 }} value={account.name || ""} onChange={e=>update({ name: e.target.value })} placeholder="Name, optional" />
        <p className="assessment-fineprint">Saved locally immediately; add an email to also add this profile to the CRM.</p>
        <button className="btn primary" style={{ marginTop: 12 }} onClick={saveLead}>Save profile + preferences</button>
        {status && <div className="save-toast">{status}</div>}
      </div>
      <div className="card card-pad">
        <div className="kicker" style={{ marginBottom: 12 }}>Newsletter</div>
        {[
          ["weekly", "Weekly evidence brief"],
          ["updates", "Grade changes and new protocols"],
          ["deepdives", "Nutrition and protein deep dives"],
        ].map(([key, label]) => (
          <label key={key} className="account-check">
            <input type="checkbox" checked={newsletters.includes(key)} onChange={()=>toggleNewsletter(key)} />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function AccountView({ setRoute }) {
  const local = loadTrajectoryAccount();
  const [account, setAccount] = vS(() => local);
  const [user, setUser] = vS(null);
  const [mode, setMode] = vS("register");
  const [auth, setAuth] = vS({ email: local.email || "", name: local.name || "", password: "" });
  const [saved, setSaved] = vS("");
  const [admin, setAdmin] = vS(null);

  vE(() => {
    trajectoryApi("/api/auth/me")
      .then(data => {
        if (data.user) {
          setUser(data.user);
          const next = {
            ...loadTrajectoryAccount(),
            email: data.user.email,
            name: data.user.name,
            newsletters: data.user.profile.newsletters || [],
            assessment: data.user.profile.assessment || loadTrajectoryAccount().assessment || {},
            plan: data.user.profile.plan || loadTrajectoryAccount().plan || {},
            watchlist: data.user.profile.watchlist || loadTrajectoryAccount().watchlist || [],
            progress: data.user.profile.progress || loadTrajectoryAccount().progress || {},
            stackInterest: data.user.profile.stackInterest || loadTrajectoryAccount().stackInterest || {},
            markers: data.user.profile.markers || loadTrajectoryAccount().markers || {},
            checkInNote: data.user.profile.checkInNote || loadTrajectoryAccount().checkInNote || "",
          };
          setAccount(next);
          saveTrajectoryAccount(next);
        }
      })
      .catch(() => {});
  }, []);

  vE(() => {
    if (user?.role === "admin") refreshAdmin();
  }, [user?.role]);

  const flash = (msg) => {
    setSaved(msg);
    setTimeout(()=>setSaved(""), 2200);
  };
  const refreshAdmin = () => trajectoryApi("/api/admin/overview").then(setAdmin).catch(e => flash(e.message));
  const syncLocal = (patch) => {
    const next = { ...account, ...patch, updatedAt: new Date().toISOString() };
    setAccount(next);
    saveTrajectoryAccount(next);
    return next;
  };
  const newsletters = account.newsletters || [];
  const saveProfile = async (patch = {}) => {
    const next = syncLocal(patch);
    if (!user) {
      flash("Saved locally");
      return;
    }
    const data = await trajectoryApi("/api/account/profile", {
      method: "PUT",
      body: JSON.stringify({
        name: next.name || "",
        newsletters: next.newsletters || [],
        assessment: next.assessment || {},
        plan: next.plan || {},
        watchlist: next.watchlist || [],
        progress: next.progress || {},
        stackInterest: next.stackInterest || {},
        markers: next.markers || {},
        checkInNote: next.checkInNote || "",
      }),
    });
    setUser(data.user);
    window.trackTrajectoryEvent && window.trackTrajectoryEvent("profile_saved");
    flash("Saved to account");
  };
  const toggleNewsletter = (value) => {
    const next = newsletters.includes(value) ? newsletters.filter(x => x !== value) : [...newsletters, value];
    saveProfile({ newsletters: next });
  };
  const submitAuth = async () => {
    setSaved(mode === "register" ? "Creating account…" : "Signing in…");
    const data = await trajectoryApi(mode === "register" ? "/api/auth/register" : "/api/auth/login", {
      method: "POST",
      body: JSON.stringify(auth),
    });
    setUser(data.user);
    const next = {
      ...account,
      email: data.user.email,
      name: data.user.name || auth.name || account.name || "",
      newsletters: data.user.profile.newsletters?.length ? data.user.profile.newsletters : newsletters,
      assessment: data.user.profile.assessment && Object.keys(data.user.profile.assessment).length ? data.user.profile.assessment : account.assessment,
      plan: data.user.profile.plan && Object.keys(data.user.profile.plan).length ? data.user.profile.plan : account.plan,
      watchlist: data.user.profile.watchlist?.length ? data.user.profile.watchlist : account.watchlist,
      progress: data.user.profile.progress && Object.keys(data.user.profile.progress).length ? data.user.profile.progress : account.progress,
      stackInterest: data.user.profile.stackInterest && Object.keys(data.user.profile.stackInterest).length ? data.user.profile.stackInterest : account.stackInterest,
      markers: data.user.profile.markers && Object.keys(data.user.profile.markers).length ? data.user.profile.markers : account.markers,
      checkInNote: data.user.profile.checkInNote || account.checkInNote || "",
    };
    setAccount(next);
    saveTrajectoryAccount(next);
    await trajectoryApi("/api/account/profile", { method: "PUT", body: JSON.stringify({ name: next.name, newsletters: next.newsletters || [], assessment: next.assessment || {}, plan: next.plan || {}, watchlist: next.watchlist || [], progress: next.progress || {}, stackInterest: next.stackInterest || {}, markers: next.markers || {}, checkInNote: next.checkInNote || "" }) });
    window.trackTrajectoryEvent && window.trackTrajectoryEvent(mode === "register" ? "account_registered" : "account_login");
    flash(data.user.role === "admin" ? "Signed in as admin" : "Signed in");
  };
  const logout = async () => {
    await trajectoryApi("/api/auth/logout", { method: "POST", body: "{}" });
    setUser(null);
    setAdmin(null);
    flash("Signed out");
  };
  return (
    <div className="page account-page">
      <header className="account-hero">
        <div>
          <div className="kicker clay" style={{ marginBottom: 12 }}><span className="bullet" />Account</div>
          <h1 className="display">Your personal longevity hub.</h1>
          <p>Track the path, save the packet, watch evidence changes, and keep a small weekly checklist instead of another endless health dashboard.</p>
        </div>
        <button className="btn primary" onClick={()=>setRoute("assessment")}>Update assessment →</button>
      </header>

      <PathHub account={account} saveProfile={saveProfile} setRoute={setRoute} />

      <div className="account-grid">
        <section className="card card-pad">
          <div className="kicker" style={{ marginBottom: 12 }}>{user ? "Signed in" : mode === "register" ? "Create account" : "Sign in"}</div>
          <label className="form-label">Email</label>
          <input className="text-input" type="email" value={user?.email || auth.email || ""} disabled={!!user} placeholder="you@example.com" onChange={e=>setAuth({ ...auth, email: e.target.value })} />
          <label className="form-label">Name</label>
          <input className="text-input" value={account.name || auth.name || ""} placeholder="Optional" onChange={e=> user ? saveProfile({ name: e.target.value }) : setAuth({ ...auth, name: e.target.value })} />
          {!user && (
            <>
              <label className="form-label">Password</label>
              <input className="text-input" type="password" value={auth.password} placeholder="At least 8 characters" onChange={e=>setAuth({ ...auth, password: e.target.value })} />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                <button className="btn primary" onClick={submitAuth}>{mode === "register" ? "Create account" : "Sign in"}</button>
                <button className="btn ghost" onClick={()=>setMode(mode === "register" ? "login" : "register")}>{mode === "register" ? "I already have one" : "Create one instead"}</button>
              </div>
            </>
          )}
          {user && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              <span className="pill clay">{user.role}</span>
              <button className="btn secondary" onClick={()=>saveProfile()}>Sync profile</button>
              <button className="btn ghost" onClick={logout}>Sign out</button>
            </div>
          )}
          <p className="assessment-fineprint">Passwords are PBKDF2-hashed in SQLite. Sessions use HttpOnly cookies. The first registered user becomes admin.</p>
          {saved && <div className="save-toast">{saved}</div>}
        </section>

        <section className="card card-pad">
          <div className="kicker" style={{ marginBottom: 12 }}>Newsletter preferences</div>
          {[
            ["weekly", "Weekly evidence brief"],
            ["updates", "Grade changes and new protocols"],
            ["deepdives", "Nutrition and protein deep dives"],
            ["product", "New tools and account features"],
          ].map(([key, label]) => (
            <label key={key} className="account-check">
              <input type="checkbox" checked={newsletters.includes(key)} onChange={()=>toggleNewsletter(key)} />
              <span>{label}</span>
            </label>
          ))}
        </section>
      </div>

      <section className="plan-offer">
        <div>
          <div className="kicker clay"><span className="bullet" />Stack shelf</div>
          <h3 className="display">Browse stacks without gating the evidence.</h3>
          <p>Your assessment can suggest a best-fit stack, but the store stays public and secondary to the free action path.</p>
        </div>
        <div className="plan-offer-card">
          <div className="plan-offer-top">
            <span>Open catalogue</span>
            <strong>{(account.stackInterest || {}).stackName || "All stacks"}</strong>
          </div>
          <p>{(account.stackInterest || {}).stackName ? `Saved interest: ${(account.stackInterest || {}).stackName}.` : "No stack interest saved yet. You can browse all stacks openly."}</p>
          <button className="btn primary" onClick={() => setRoute("stacks")}>Browse stacks</button>
        </div>
      </section>
      <WatchlistPanel account={account} saveProfile={saveProfile} setRoute={setRoute} />
      {Object.keys(account.assessment || {}).length ? (
        <ReviewPacket items={window.ALL_ITEMS || []} ans={account.assessment || {}} account={account} onAccountPatch={saveProfile} />
      ) : (
        <section className="review-packet empty">
          <div className="review-packet-head">
            <div>
              <div className="kicker clay"><span className="bullet" />Review packet</div>
              <h3 className="display">Start with the assessment.</h3>
              <p>The free review packet is generated from your answers, then saved here for updates and review.</p>
            </div>
            <button className="btn primary" onClick={()=>setRoute("assessment")}>Build packet</button>
          </div>
        </section>
      )}

      {user?.role === "admin" && (
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <div className="kicker clay"><span className="bullet" />CRM + Analytics</div>
              <h2 className="display">Reader operating system.</h2>
            </div>
            <div className="admin-actions">
              <a className="btn secondary" href="/api/admin/leads.csv">Export leads</a>
              <button className="btn secondary" onClick={refreshAdmin}>Refresh</button>
            </div>
          </div>
          {admin ? (
            <>
              <div className="admin-metrics">
                {Object.entries(admin.counts || {}).map(([k, v]) => (
                  <div key={k}><span>{k}</span><strong>{v}</strong></div>
                ))}
              </div>
              <div className="admin-grid">
                <div className="card card-pad">
                  <div className="kicker" style={{ marginBottom: 12 }}>Language demand</div>
                  {(admin.eventsByLanguage || []).map(r => <div key={r.language} className="admin-row"><span>{(r.language || "unknown").toUpperCase()}</span><strong>{r.count}</strong></div>)}
                </div>
                <div className="card card-pad">
                  <div className="kicker" style={{ marginBottom: 12 }}>Event funnel</div>
                  {(admin.eventsByName || []).map(r => <div key={r.event} className="admin-row"><span>{r.event}</span><strong>{r.count}</strong></div>)}
                </div>
                <div className="card card-pad">
                  <div className="kicker" style={{ marginBottom: 12 }}>Lead sources</div>
                  {(admin.leadsBySource || []).map((r, i) => <div key={`${r.source}-${r.language}-${i}`} className="admin-row"><span>{r.source}<small>{(r.language || "en").toUpperCase()}</small></span><strong>{r.count}</strong></div>)}
                </div>
                <div className="card card-pad">
                  <div className="kicker" style={{ marginBottom: 12 }}>Stack interest demand</div>
                  {(admin.planInterest || []).length ? (admin.planInterest || []).map(r => <div key={r.planKey} className="admin-row"><span>{r.planKey}<small>avg intent {r.avgIntent || 0}</small></span><strong>{r.count}</strong></div>) : <p className="assessment-fineprint">No stack interest yet.</p>}
                </div>
                <div className="card card-pad">
                  <div className="kicker" style={{ marginBottom: 12 }}>Subscriptions</div>
                  {(admin.subscriptions || []).length ? (admin.subscriptions || []).map(r => <div key={`${r.planKey}-${r.status}`} className="admin-row"><span>{r.planKey}<small>{r.status}</small></span><strong>{r.count}</strong></div>) : <p className="assessment-fineprint">No subscriptions yet.</p>}
                </div>
                <div className="card card-pad">
                  <div className="kicker" style={{ marginBottom: 12 }}>Watched protocols</div>
                  {(admin.topWatchlist || []).length ? (admin.topWatchlist || []).map(r => <div key={r.slug} className="admin-row"><span>{r.slug}</span><strong>{r.count}</strong></div>) : <p className="assessment-fineprint">No watchlist data yet.</p>}
                </div>
                <div className="card card-pad">
                  <div className="kicker" style={{ marginBottom: 12 }}>Daily activity</div>
                  {(admin.dailyEvents || []).map(r => <div key={r.day} className="admin-row"><span>{r.day}</span><strong>{r.count}</strong></div>)}
                </div>
                <div className="card card-pad">
                  <div className="kicker" style={{ marginBottom: 12 }}>Top routes</div>
                  {(admin.topRoutes || []).map(r => <div key={r.route} className="admin-row"><span>{r.route}</span><strong>{r.count}</strong></div>)}
                </div>
                <div className="card card-pad">
                  <div className="kicker" style={{ marginBottom: 12 }}>Recent leads</div>
                  {(admin.recentLeads || []).map(l => <div key={l.email} className="admin-row"><span>{l.email}<small>{l.source} · {(l.language || "en").toUpperCase()} · {l.status}{l.plan_key ? ` · ${l.plan_key} · intent ${l.intent_score || 0}` : ""}</small></span><strong>{(l.newsletters || []).length}</strong></div>)}
                </div>
                <div className="card card-pad">
                  <div className="kicker" style={{ marginBottom: 12 }}>Recent events</div>
                  {(admin.recentEvents || []).map((e, i) => <div key={i} className="admin-row"><span>{e.event}<small>{(e.language || "en").toUpperCase()} · {e.route || e.path}</small></span><strong>{(e.created_at || "").slice(11,16)}</strong></div>)}
                </div>
                <div className="card card-pad">
                  <div className="kicker" style={{ marginBottom: 12 }}>Recent subscriptions</div>
                  {(admin.recentSubscriptions || []).length ? (admin.recentSubscriptions || []).map(s => <div key={s.email} className="admin-row"><span>{s.email}<small>{s.plan_key} · {s.status}</small></span><strong>{(s.trial_ends_at || "").slice(5,10)}</strong></div>) : <p className="assessment-fineprint">No subscription activity yet.</p>}
                </div>
              </div>
            </>
          ) : <p className="assessment-fineprint">No analytics yet. Browse a few pages and refresh.</p>}
        </section>
      )}
    </div>
  );
}

function AccountViewStable({ setRoute }) {
  const [account, setAccount] = vS(() => loadTrajectoryAccount());
  const [user, setUser] = vS(null);
  const [mode, setMode] = vS("register");
  const [auth, setAuth] = vS({ email: account.email || "", name: account.name || "", password: "" });
  const [saved, setSaved] = vS("");
  const assessment = account.assessment || {};
  const actions = hubActions(account);
  const stackInterest = account.stackInterest || {};
  const watchlist = account.watchlist || [];
  const flash = (message) => {
    setSaved(message);
    setTimeout(() => setSaved(""), 2200);
  };
  const syncLocal = (patch) => {
    const next = { ...account, ...patch, updatedAt: new Date().toISOString() };
    setAccount(next);
    saveTrajectoryAccount(next);
    return next;
  };
  const saveProfile = async (patch = {}) => {
    const next = syncLocal(patch);
    if (!user) {
      flash("Saved locally");
      return;
    }
    const data = await trajectoryApi("/api/account/profile", {
      method: "PUT",
      body: JSON.stringify({
        name: next.name || "",
        newsletters: next.newsletters || [],
        assessment: next.assessment || {},
        plan: next.plan || {},
        watchlist: next.watchlist || [],
        progress: next.progress || {},
        stackInterest: next.stackInterest || {},
        markers: next.markers || {},
        checkInNote: next.checkInNote || "",
      }),
    });
    setUser(data.user);
    flash("Saved to account");
  };
  const submitAuth = async () => {
    setSaved(mode === "register" ? "Creating account..." : "Signing in...");
    const data = await trajectoryApi(mode === "register" ? "/api/auth/register" : "/api/auth/login", {
      method: "POST",
      body: JSON.stringify(auth),
    });
    setUser(data.user);
    const next = {
      ...account,
      email: data.user.email,
      name: data.user.name || auth.name || account.name || "",
      newsletters: data.user.profile?.newsletters || account.newsletters || [],
      assessment: Object.keys(data.user.profile?.assessment || {}).length ? data.user.profile.assessment : account.assessment || {},
      plan: Object.keys(data.user.profile?.plan || {}).length ? data.user.profile.plan : account.plan || {},
      watchlist: (data.user.profile?.watchlist || []).length ? data.user.profile.watchlist : account.watchlist || [],
      progress: Object.keys(data.user.profile?.progress || {}).length ? data.user.profile.progress : account.progress || {},
      stackInterest: Object.keys(data.user.profile?.stackInterest || {}).length ? data.user.profile.stackInterest : account.stackInterest || {},
      markers: Object.keys(data.user.profile?.markers || {}).length ? data.user.profile.markers : account.markers || {},
      checkInNote: data.user.profile?.checkInNote || account.checkInNote || "",
    };
    setAccount(next);
    saveTrajectoryAccount(next);
    flash("Signed in");
  };
  return (
    <div className="page account-page">
      <header className="account-hero">
        <div>
          <div className="kicker clay" style={{ marginBottom: 12 }}><span className="bullet" />Account</div>
          <h1 className="display">Your personal longevity hub.</h1>
          <p>Track your assessment, weekly evidence path, stack interest, watchlist, and review packet while the publication stays free.</p>
        </div>
        <button className="btn primary" onClick={() => setRoute("assessment")}>Update assessment →</button>
      </header>

      <section className="path-hub">
        <div className="path-hub-head">
          <div>
            <div className="kicker clay"><span className="bullet" />Personal hub</div>
            <h2 className="display">Your path, not a paywall.</h2>
            <p>The hub keeps the next useful moves visible and lets stack commerce stay optional, public, and clearly marked.</p>
          </div>
          <button className="btn secondary" onClick={() => setRoute("stacks")}>Browse stacks</button>
        </div>
        <div className="path-hub-grid">
          <div className="path-panel">
            <div className="kicker">This week</div>
            {actions.length ? actions.slice(0, 5).map(item => (
              <button key={item.slug} className="path-action" onClick={() => setRoute("detail", item.slug)}>
                <span className="assessment-option-box" />
                <span><strong>{item.name}</strong><small>Evidence {item.evidence} · E {item.effect}/10 · C {item.certainty}/10</small></span>
              </button>
            )) : (
              <div className="path-empty">
                <p>No action path yet. Take the assessment to generate one.</p>
                <button className="btn primary" onClick={() => setRoute("assessment")}>Start assessment</button>
              </div>
            )}
          </div>
          <div className="path-panel">
            <div className="kicker">Context</div>
            <div className="path-context-row"><span>Focus</span><strong>{answerList(assessment, "concerns").slice(0, 2).join(" + ") || "Not set"}</strong></div>
            <div className="path-context-row"><span>Follow-through</span><strong>{assessment.tracking || "Weekly checklist"}</strong></div>
            <div className="path-context-row"><span>Saved stack</span><strong>{stackInterest.stackName || "None yet"}</strong></div>
            <button className="btn secondary" onClick={() => saveProfile()}>Save profile</button>
          </div>
          <div className="path-panel">
            <div className="kicker">Stack shelf</div>
            <h3 className="display" style={{ fontSize: 28, lineHeight: 1.05, margin: "0 0 10px" }}>{stackInterest.stackName || "Browse all stacks"}</h3>
            <p>{stackInterest.stackName ? "This stack interest is saved locally and can sync to your account." : "Stacks are browseable without assessment gating. Personalization only helps sort fit."}</p>
            <button className="btn secondary" onClick={() => setRoute("stacks")}>Open stacks →</button>
          </div>
        </div>
      </section>

      <div className="account-grid">
        <section className="card card-pad">
          <div className="kicker" style={{ marginBottom: 12 }}>{user ? "Signed in" : mode === "register" ? "Create account" : "Sign in"}</div>
          <label className="form-label">Email</label>
          <input className="text-input" type="email" value={user?.email || auth.email || account.email || ""} disabled={!!user} placeholder="you@example.com" onChange={e => setAuth({ ...auth, email: e.target.value })} />
          <label className="form-label">Name</label>
          <input className="text-input" value={account.name || auth.name || ""} placeholder="Optional" onChange={e => user ? saveProfile({ name: e.target.value }) : setAuth({ ...auth, name: e.target.value })} />
          {!user && (
            <>
              <label className="form-label">Password</label>
              <input className="text-input" type="password" value={auth.password} placeholder="At least 8 characters" onChange={e => setAuth({ ...auth, password: e.target.value })} />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                <button className="btn primary" onClick={submitAuth}>{mode === "register" ? "Create account" : "Sign in"}</button>
                <button className="btn ghost" onClick={() => setMode(mode === "register" ? "login" : "register")}>{mode === "register" ? "I already have one" : "Create one instead"}</button>
              </div>
            </>
          )}
          {saved && <div className="save-toast">{saved}</div>}
        </section>
        <section className="card card-pad">
          <div className="kicker" style={{ marginBottom: 12 }}>Evidence watchlist</div>
          {watchlist.length ? watchlist.slice(0, 6).map(item => (
            <div key={item.slug} className="admin-row"><span>{item.name}<small>{item.reason}</small></span><strong>{item.evidence}</strong></div>
          )) : <p className="assessment-fineprint">No watchlist yet. The assessment can generate one from your packet.</p>}
          <button className="btn secondary" onClick={() => setRoute("assessment")}>Update assessment</button>
        </section>
      </div>

      {Object.keys(assessment).length ? (
        <ReviewPacket items={window.ALL_ITEMS || []} ans={assessment} account={account} onAccountPatch={saveProfile} />
      ) : (
        <section className="review-packet empty">
          <div className="review-packet-head">
            <div>
              <div className="kicker clay"><span className="bullet" />Review packet</div>
              <h3 className="display">Start with the assessment.</h3>
              <p>The free review packet is generated from your answers, then saved here for updates and review.</p>
            </div>
            <button className="btn primary" onClick={() => setRoute("assessment")}>Build packet</button>
          </div>
        </section>
      )}
    </div>
  );
}

AccountView = AccountViewStable;

function StackInterestInline({ stack, account, setAccount, source = "stacks" }) {
  const [email, setEmail] = vS(account.email || "");
  const [status, setStatus] = vS("");
  vE(() => { if (account.email) setEmail(account.email); }, [account.email]);

  const capture = async () => {
    setStatus("Saving interest...");
    try {
      const stackInterest = {
        ...(account.stackInterest || {}),
        stackSlug: stack.slug,
        stackName: stack.name,
        status: "registered",
        source,
        email,
        updatedAt: new Date().toISOString(),
      };
      const next = { ...account, email, stackInterest, updatedAt: new Date().toISOString() };
      setAccount(next);
      saveTrajectoryAccount(next);
      await trajectoryApi("/api/stacks/interest", {
        method: "POST",
        body: JSON.stringify({
          email,
          name: account.name || "",
          source,
          language: trajectoryLanguage(),
          stackSlug: stack.slug,
          consent: true,
          intentScore: 85,
          newsletters: account.newsletters || ["weekly", "product"],
          assessment: account.assessment || {},
          path: window.location.pathname + window.location.hash,
          route: window.location.hash || "#/stacks",
          tags: ["stack-interest", `stack-${stack.slug}`],
        }),
      });
      window.trackTrajectoryEvent && window.trackTrajectoryEvent("stack_interest", { source, stackSlug: stack.slug });
      setStatus("Saved. You are on the stack list.");
    } catch (e) {
      setStatus(e.message || "Could not save");
    }
  };

  return (
    <div className="stack-interest-inline">
      <input className="text-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
      <button className="btn primary" onClick={capture}>Join stack list</button>
      {status && <div className="save-toast">{status}</div>}
      <small>No charge today. We will not collect payment until sourcing, testing, fulfillment, and safety notes are ready.</small>
    </div>
  );
}

function StackCard({ stack, account, setAccount, setRoute, emphasis }) {
  return (
    <section className={`plan-card stack-card ${emphasis ? "emphasis" : ""}`}>
      <div>
        <div className="kicker clay"><span className="bullet" />{stack.status}</div>
        <h2 className="display">{stack.shortName}</h2>
        <strong>{stackPrice(stack)} · {stack.cadence}</strong>
        <p>{stack.positioning}</p>
      </div>
      <ul>
        {stack.ingredients.slice(0, 4).map(ingredient => <li key={ingredient.slug}>{ingredient.name}: {ingredient.dose}</li>)}
      </ul>
      <div className="plan-card-action">
        <button className="btn secondary" onClick={() => setRoute("stack", stack.slug)}>Read stack page</button>
        <StackInterestInline stack={stack} account={account} setAccount={setAccount} source="stack_card" />
      </div>
    </section>
  );
}

function StacksView({ setRoute }) {
  const [account, setAccount] = vS(() => loadTrajectoryAccount());
  return (
    <div className="page plans-page">
      <header className="plans-hero">
        <div>
          <div className="kicker clay"><span className="bullet" />Trajectory-owned stacks</div>
          <h1 className="display">Supplements, without hiding the evidence.</h1>
          <p>Every article, grade, assessment, packet, and watchlist stays free. Stacks are optional fulfillment: browse them openly, read the exclusions, and join the list only if the rationale fits.</p>
        </div>
        <div className="stack-hero-actions">
          <button className="btn primary" onClick={() => setRoute("assessment")}>Personalize in assessment</button>
          <button className="btn secondary" onClick={() => setRoute("methodology")}>Read methodology</button>
        </div>
      </header>
      <div className="plans-grid">
        {TRAJECTORY_STACKS.map(stack => <StackCard key={stack.slug} stack={stack} account={account} setAccount={setAccount} setRoute={setRoute} emphasis={stack.slug === "foundation"} />)}
      </div>
      <section className="plans-note">
        <div className="kicker"><span className="bullet" />Editorial boundary</div>
        <p>The store cannot outrank the evidence. Stack pages must keep “who should avoid this,” “why not included,” and contraindication notes as visible as the ingredient list.</p>
      </section>
    </div>
  );
}

function StackDetailView({ slug, setRoute }) {
  const [account, setAccount] = vS(() => loadTrajectoryAccount());
  const stack = stackBySlug(slug);
  const linkedItems = uniqueItems((stack.ingredients || []).map(ingredient => (window.ALL_ITEMS || []).find(item => item.slug === ingredient.slug)).filter(Boolean));
  return (
    <div className="page stack-detail-page">
      <button className="note-back" onClick={() => setRoute("stacks")}>← &nbsp;STACKS</button>
      <header className="stack-detail-hero">
        <div>
          <div className="kicker clay"><span className="bullet" />{stack.status} · {stack.cadence}</div>
          <h1 className="display">{stack.name}</h1>
          <p>{stack.positioning}</p>
          <div className="stack-hero-meta">
            <span>{stackPrice(stack)}</span>
            <span>No charge today</span>
            <span>Browseable without assessment</span>
          </div>
        </div>
        <aside className="stack-cta-card">
          <div className="kicker">Join list</div>
          <h2 className="display">Reserve interest, not payment.</h2>
          <p>We use this to prioritize sourcing and quality work. The free publication remains free.</p>
          <StackInterestInline stack={stack} account={account} setAccount={setAccount} source="stack_detail" />
        </aside>
      </header>

      <div className="stack-detail-grid">
        <section className="stack-detail-panel">
          <div className="kicker"><span className="bullet" />Ingredients</div>
          <div className="stack-ingredient-list">
            {stack.ingredients.map(ingredient => (
              <div key={ingredient.slug} className="stack-ingredient-row">
                <div>
                  <strong>{ingredient.name}</strong>
                  <span>{ingredient.rationale}</span>
                </div>
                <em>{ingredient.dose}</em>
              </div>
            ))}
          </div>
        </section>

        <section className="stack-detail-panel">
          <div className="kicker"><span className="bullet" />Best fit</div>
          <ul className="stack-bullet-list">{stack.bestFor.map(item => <li key={item}>{item}</li>)}</ul>
        </section>

        <section className="stack-detail-panel stop">
          <div className="kicker"><span className="bullet" />Who should avoid it</div>
          <ul className="stack-bullet-list">{stack.notFor.map(item => <li key={item}>{item}</li>)}</ul>
        </section>

        <section className="stack-detail-panel">
          <div className="kicker"><span className="bullet" />Evidence rationale</div>
          <p>{stack.evidenceSummary}</p>
          {linkedItems.length > 0 && (
            <div className="stack-linked-items">
              {linkedItems.map(item => (
                <button key={item.slug} onClick={() => setRoute("detail", item.slug)}>
                  <span>{item.name}</span>
                  <small>Evidence {item.ev} · E {item.e}/10 · C {item.c}/10</small>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="stack-detail-panel stop">
          <div className="kicker"><span className="bullet" />Safety and interactions</div>
          <ul className="stack-bullet-list">{stack.contraindications.map(item => <li key={item}>{item}</li>)}</ul>
        </section>

        <section className="stack-detail-panel">
          <div className="kicker"><span className="bullet" />Why not included</div>
          <ul className="stack-bullet-list">{stack.whyNotIncluded.map(item => <li key={item}>{item}</li>)}</ul>
        </section>

        <section className="stack-detail-panel">
          <div className="kicker"><span className="bullet" />Quality standards</div>
          <ul className="stack-bullet-list">{stack.qualityStandards.map(item => <li key={item}>{item}</li>)}</ul>
        </section>

        <section className="stack-detail-panel">
          <div className="kicker"><span className="bullet" />FAQ</div>
          <div className="stack-faq-list">
            {stack.faq.map(([q, a]) => (
              <div key={q}>
                <strong>{q}</strong>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const PlansView = StacksView;

// ---- Notes (editorial) -----------------------------------------------------
function noteTextFromHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  return div.textContent || "";
}

function noteSlugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "section";
}

function noteSections(html) {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  return Array.from(div.querySelectorAll("h2")).slice(0, 8).map((h, index) => ({
    id: noteSlugify(h.textContent) + (index ? `-${index + 1}` : ""),
    title: h.textContent || `Section ${index + 1}`,
  }));
}

function noteHtmlWithIds(html, sections) {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  Array.from(div.querySelectorAll("h2")).slice(0, sections.length).forEach((h, index) => {
    h.id = sections[index].id;
  });
  return div.innerHTML;
}

function noteLinkedItems(html) {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  const slugs = Array.from(div.querySelectorAll('a[href*="/items/"]'))
    .map(a => (a.getAttribute("href") || "").match(/\/items\/([^/.#?]+)/)?.[1])
    .filter(Boolean);
  const unique = Array.from(new Set(slugs));
  return unique
    .map(slug => (window.ALL_ITEMS || []).find(i => i.slug === slug))
    .filter(Boolean)
    .slice(0, 5);
}

function noteReadingMinutes(html) {
  const words = noteTextFromHtml(html).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function noteVisual(post = {}, index = 0) {
  const palettes = {
    nutrition: ["#8f5f36", "#ead8b8"],
    exercise: ["#2f5c4f", "#c7ded2"],
    cardiovascular: ["#7a2f2f", "#ebc8bf"],
    sleep: ["#2d3d62", "#cbd6ea"],
    methodology: ["#4b4037", "#e1d5c6"],
    supplements: ["#6b5530", "#eadfbf"],
  };
  const [ink, paper] = palettes[post.tag] || palettes[post.tags?.[0]] || ["#3f4f46", "#d9dfd0"];
  return { ink, paper, n: String(index + 1).padStart(2, "0") };
}

function NotesView({ onPickPost }) {
  const posts = (window.ALL_POSTS || []).slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const tags = Array.from(new Set(posts.map(p => p.tag).filter(Boolean))).sort();
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? posts : posts.filter(p => p.tag === active);
  const featured = filtered[0];
  const editorsPicks = filtered.slice(1, 4);
  const rest = filtered.slice(4);
  const formatDate = (date) => date ? new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "";

  return (
    <div className="page notes-index publication-page">
      <header className="notes-publication-masthead">
        <div>
          <div className="kicker"><span className="bullet" />The Trajectory Review</div>
          <h1 className="display">Longevity reporting for people who read the footnotes.</h1>
        </div>
        <p>
          Essays, protocol memos, and evidence updates with the same discipline as the catalogue: human data first, mechanisms in context, claims kept separate from editorial judgment.
        </p>
      </header>

      {featured && (
        <section className="publication-front">
          <a className="publication-lead-story" href={`#/notes/${featured.slug}`} onClick={(e)=>{ e.preventDefault(); onPickPost && onPickPost(featured.slug); }}>
            <div className="publication-lead-copy">
              <div className="note-card-meta">Lead story · {formatDate(featured.date)}{featured.tag ? <><span>·</span>{featured.tag}</> : null}</div>
              <h2 className="display">{featured.title}</h2>
              <p>{featured.lede}</p>
              <strong>Read the lead</strong>
            </div>
          </a>
          <aside className="publication-editorial-rail">
            <div className="publication-issue-note">
              <span>Today in Trajectory</span>
              <strong>{new Date().toLocaleDateString(undefined, { month: "long", day: "numeric" })}</strong>
              <p>{active === "all" ? `${posts.length} field notes in the archive.` : `${filtered.length} notes filed under ${active}.`}</p>
            </div>
            <div className="publication-picks">
              <div className="kicker"><span className="bullet" />Editor's picks</div>
              {editorsPicks.map((p, index) => (
                <a key={p.slug} href={`#/notes/${p.slug}`} onClick={(e)=>{ e.preventDefault(); onPickPost && onPickPost(p.slug); }}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{p.title}</strong>
                  <small>{p.tag || "note"} · {formatDate(p.date)}</small>
                </a>
              ))}
            </div>
          </aside>
        </section>
      )}

      <nav className="notes-filter publication-filter" aria-label="Publication topics">
        <button className={"chip" + (active === "all" ? " active" : "")} onClick={() => setActive("all")}>All · {posts.length}</button>
        {tags.map(t => {
          const n = posts.filter(p => p.tag === t).length;
          return <button key={t} className={"chip" + (active === t ? " active" : "")} onClick={() => setActive(t)}>{t} · {n}</button>;
        })}
      </nav>

      <div className="notes-grid">
        {rest.map((p, index) => (
          <a key={p.slug} className="note-card publication-card" href={`#/notes/${p.slug}`} onClick={(e)=>{ e.preventDefault(); onPickPost && onPickPost(p.slug); }}>
            <div className="note-card-meta">{formatDate(p.date)}{p.tag ? <><span>·</span>{p.tag}</> : null}</div>
            <h2>{p.title}</h2>
            <p>{p.lede}</p>
            <strong>Read note</strong>
          </a>
        ))}
      </div>
    </div>
  );
}

function NoteArticleView({ slug, onBack, onPickPost }) {
  const posts = (window.ALL_POSTS || []).slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const post = posts.find(p => p.slug === slug) || posts[0];
  const related = posts.filter(p => p.slug !== post.slug && p.tag === post.tag).slice(0, 3);
  const sections = noteSections(post.html);
  const articleHtml = noteHtmlWithIds(post.html, sections);
  const linkedItems = noteLinkedItems(post.html);
  const minutes = noteReadingMinutes(post.html);
  return (
    <div className="page note-page">
      <button className="note-back" onClick={onBack}>← &nbsp;NOTES</button>
      <div className="note-reading-layout">
        <main className="note-main">
          <article className="article-shell note-article publication-article">
            <header className="note-hero publication-article-hero">
              <div>
                <div className="kicker"><span className="bullet" />{post.date}{post.tag ? ` · ${post.tag}` : ""}</div>
                <h1 className="display">{post.title}</h1>
                <p>{post.lede}</p>
              </div>
              <div className="note-facts">
                <div><span>Read</span><strong>{minutes} min</strong></div>
                <div><span>Topic</span><strong>{post.tag || "note"}</strong></div>
                <div><span>Sections</span><strong>{sections.length || 1}</strong></div>
              </div>
            </header>
            <div className="article-prose note-prose" dangerouslySetInnerHTML={{ __html: articleHtml || "" }} />
          </article>
        </main>

        <aside className="note-rail">
          {sections.length > 0 && (
            <section className="note-rail-card">
              <div className="kicker"><span className="bullet" />In this note</div>
              <nav className="note-section-nav">
                {sections.map(s => <a key={s.id} href={`#${s.id}`}>{s.title}</a>)}
              </nav>
            </section>
          )}

          {linkedItems.length > 0 && (
            <section className="note-rail-card">
              <div className="kicker"><span className="bullet" />Interventions mentioned</div>
              <div className="note-item-list">
                {linkedItems.map(item => (
                  <a key={item.slug} href={`#/items/${item.slug}`}>
                    <span>{item.name}</span>
                    <small>Tier {item.tier} · E {item.e}/10 · C {item.c}/10</small>
                  </a>
                ))}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="note-rail-card">
              <div className="kicker"><span className="bullet" />Keep reading</div>
              <div className="note-related-list">
            {related.map(p => (
              <button key={p.slug} onClick={() => onPickPost && onPickPost(p.slug)}>
                <span>{p.date}</span>
                <strong>{p.title}</strong>
              </button>
            ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

window.Views = { CatalogueView, DetailView, ConcernsView, NutritionView, PlaybooksView, PlaybookDetailView, CompareView, ResearchView, SearchView, MissionView, MethodologyView, AssessmentView, AccountView, StacksView, StackDetailView, PlansView, NotesView, NoteArticleView };
