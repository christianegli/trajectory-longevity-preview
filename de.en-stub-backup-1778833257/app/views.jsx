// Catalogue · Detail · Concerns · Stack · Assessment — clinical edition

const { useState: vS, useMemo: vM, useEffect: vE } = React;
const { CatDot: VC, Tier: VT, Grade: VG, Score: VS, Scatter: VSC, InterventionGlyph: VGlyph, CONCERN_LABELS: VCL, TIER_LABELS: VTL, EVIDENCE_DESC: VED } = window.UI;

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

function CatalogueView({ items, viz, onPick, nutritionOnly = false }) {
  const [filters, setFilters] = vS(nutritionOnly ? { nutrition: true } : {});
  const [sort, setSort] = vS("combined");
  const [layout, setLayout] = vS("grid");
  const [query, setQuery] = vS("");
  const isCompact = typeof window !== "undefined" && window.innerWidth < 900;
  const toggle = (k, v) => { const cur = filters[k] || []; setFilters({ ...filters, [k]: cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v] }); };
  vE(() => setFilters(nutritionOnly ? { nutrition: true } : {}), [nutritionOnly]);

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
    setFilters(nutritionOnly ? { nutrition: true } : {});
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
          <div className="kicker" style={{ marginBottom: 8 }}><span className="bullet" />Library</div>
          <h1 className="display" style={{ fontSize: 48, margin: "0 0 8px", lineHeight: 1 }}>Catalogue.</h1>
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
              <div key={item.slug} className="card clickable card-pad catalogue-card" onClick={()=>onPick(item.slug)} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="catalogue-card-art">
                  <VGlyph item={item} size={72} quiet />
                </div>
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
      <ul>{list.map((x, i) => <li key={i}>{x}</li>)}</ul>
    </div>
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
          <div className="detail-visual">
            <VGlyph item={item} size={142} />
          </div>
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
            <DetailFactList label="Side effects" items={sides} fallback="No common side effects recorded at evidence-review time." tone="warn" />
            <DetailFactList label="Contraindications" items={contras} fallback="No formal contraindications recorded. Use clinical judgement." tone="stop" />
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
        <div className="detail-aside-block is-score">
          <div className="kicker"><span className="bullet" />At a glance</div>
          <VS e={item.e} c={item.c} viz="bars" />
        </div>
        <div className="detail-aside-block">
          <div className="detail-metrics">
            <div className="detail-metric"><div className="kicker">Evidence</div><VG ev={item.ev} /></div>
            <div className="detail-metric"><div className="kicker">Tier</div><VT tier={item.tier} /></div>
            <div className="detail-metric"><div className="kicker">Studies</div><strong>{studies.length}</strong></div>
            <div className="detail-metric is-cost"><div className="kicker">Cost</div><span>{item.cost || "Not estimated"}</span></div>
          </div>
        </div>
        <div className="detail-aside-block">
          <div className="kicker"><span className="bullet" />Targets</div>
          <div className="detail-target-list">
          {item.targets.map((t,i)=>(
            <div key={t}>
              <span>{VCL[t]}</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.6"><path d="m9 6 6 6-6 6" /></svg>
            </div>
          ))}
          </div>
        </div>
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

function ConcernsView({ items, onPick, viz }) {
  const keys = Object.keys(VCL);
  const [active, setActive] = vS(keys[0]);
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

const ASSESSMENT_STEPS = [
  { key: "age", eyebrow: "Baseline", q: "Where are you in the lifespan curve?", type: "single", opts: ["Under 35","35-49","50-64","65+"] },
  { key: "sex", eyebrow: "Biology", q: "Which evidence track should we bias toward?", type: "single", opts: ["Female","Male","Other / not saying"] },
  { key: "concerns", eyebrow: "Priority", q: "What should the plan protect first?", type: "multi", max: 3, opts: ["Heart disease","Metabolic health","Cognitive decline","Muscle and bone","Cancer","Sleep and recovery","Menopause transition"] },
  { key: "already", eyebrow: "Current stack", q: "What are you already doing consistently?", type: "multi", opts: ["No smoking","7+ hours sleep","Zone 2 cardio","Vigorous intervals","Resistance training","Protein target","Mediterranean diet","High fiber","Creatine","Vitamin D","Omega-3","Statin","GLP-1","Blood-pressure medication"] },
  { key: "signals", eyebrow: "Measured risk", q: "Which signals are known or suspected?", type: "multi", opts: ["High ApoB / LDL","High blood pressure","Prediabetes / insulin resistance","Low muscle mass","Low bone density","Poor sleep","Frequent alcohol","Family history of early heart disease"] },
  { key: "appetite", eyebrow: "Evidence appetite", q: "How aggressive should Trajectory be?", type: "single", opts: ["Foundation only","Foundation + targeted","Open to frontier"] },
  { key: "account", eyebrow: "Save and send", q: "Want this saved as your Trajectory profile?", type: "account" },
];

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
  try { return JSON.parse(localStorage.getItem(TRAJECTORY_ACCOUNT_KEY) || "{}"); }
  catch (e) { return {}; }
}

function saveTrajectoryAccount(next) {
  try { localStorage.setItem(TRAJECTORY_ACCOUNT_KEY, JSON.stringify(next)); }
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
  return { already, fixFirst, targeted, frontier, frontierAllowed, concerns, signals };
}

function AssessmentResults({ items, ans, account, onPick, setRoute, onSaveAccount }) {
  const { already, fixFirst, targeted, frontier, frontierAllowed, concerns, signals } = buildAssessmentPlan(items, ans);
  const resultText = [
    already.length ? `You already cover ${already.length} high-value move${already.length === 1 ? "" : "s"}, so they are separated from the add-next list.` : "",
    concerns.length ? `Your plan is biased toward ${concerns.slice(0, 2).join(" and ")}.` : "",
    signals.length ? "Known risk signals were moved up the queue." : "",
  ].filter(Boolean).join(" ");

  return (
    <div className="assessment-results">
      <div className="card deep card-pad assessment-result-hero">
        <div className="kicker clay" style={{ marginBottom: 10 }}>Your evidence path</div>
        <h2 className="display">Keep the wins. Add the missing levers.</h2>
        <p style={{ color: "var(--ink-4)", maxWidth: 620, margin: 0, fontFamily: "var(--news)", fontSize: 16, lineHeight: 1.55 }}>
          {resultText || "Your answers point to a foundation-first path: take the high-certainty wins before spending attention on narrow protocols."}
        </p>
        <div className="assessment-result-actions">
          <button className="btn clay" onClick={onSaveAccount}>{account.email ? "Save to account" : "Save local profile"}</button>
          <button className="btn ghost" style={{ color: "var(--paper)" }} onClick={()=>setRoute("account")}>{account.email ? "Newsletter settings" : "Add email + newsletter"}</button>
        </div>
      </div>

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

      <section style={{ marginBottom: 22 }}>
        <div className="kicker" style={{ marginBottom: 10 }}><span className="bullet" />Fix first</div>
        <div style={{ display: "grid", gap: 10 }}>
          {fixFirst.map((item, i) => <AssessmentCard key={item.slug} item={item} label={i === 0 ? "Highest leverage" : "Foundation"} onPick={onPick} />)}
        </div>
      </section>

      <section style={{ marginBottom: 22 }}>
        <div className="kicker" style={{ marginBottom: 10 }}><span className="bullet" />Targeted next</div>
        <div style={{ display: "grid", gap: 10 }}>
          {targeted.map(item => <AssessmentCard key={item.slug} item={item} label="Targeted protocol" onPick={onPick} />)}
        </div>
      </section>

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
  return (
    <div className="page assessment-page">
      <div className="assessment-progress">
        <div className="bar" style={{ background: "var(--paper-3)" }}><span style={{ width: `${(Math.min(step, ASSESSMENT_STEPS.length)/ASSESSMENT_STEPS.length)*100}%`, transition: "width .35s" }} /></div>
        <div className="assessment-progress-label">
          <span>Assessment</span>
          <span>{Math.min(step+1, ASSESSMENT_STEPS.length)} · {ASSESSMENT_STEPS.length}</span>
        </div>
      </div>
      {!done ? (
        <>
          <div className="kicker" style={{ marginBottom: 10 }}><span className="bullet" />{cur.eyebrow}</div>
          <h1 className="display assessment-question">{cur.q}</h1>
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
            <button className="btn primary" onClick={()=>{ if (cur.type === "account") saveAccountFromAssessment(); setStep(step+1); }}>{cur.type === "multi" ? "Continue" : cur.type === "account" ? "See my plan" : "Skip" } →</button>
          </div>
        </>
      ) : <AssessmentResults items={items} ans={ans} account={account} onPick={onPick} setRoute={setRoute} onSaveAccount={saveAccountFromAssessment} />}
    </div>
  );
}

function AccountCapture({ account, setAccount, ans }) {
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
  return (
    <div className="account-capture">
      <div className="card card-pad">
        <div className="kicker" style={{ marginBottom: 10 }}>Local account shell</div>
        <input className="text-input" type="email" value={account.email || ""} onChange={e=>update({ email: e.target.value })} placeholder="you@example.com" />
        <p className="assessment-fineprint">This saves locally in your browser for now. Real magic-link auth and server-side newsletter delivery need a backend provider.</p>
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
  const [account, setAccount] = vS(() => loadTrajectoryAccount());
  const [saved, setSaved] = vS(false);
  const update = (patch) => {
    const next = { ...account, ...patch, updatedAt: new Date().toISOString() };
    setAccount(next);
    saveTrajectoryAccount(next);
    setSaved(true);
    setTimeout(()=>setSaved(false), 1600);
  };
  const newsletters = account.newsletters || [];
  const toggleNewsletter = (value) => update({ newsletters: newsletters.includes(value) ? newsletters.filter(x => x !== value) : [...newsletters, value] });
  return (
    <div className="page account-page">
      <header className="account-hero">
        <div>
          <div className="kicker clay" style={{ marginBottom: 12 }}><span className="bullet" />Account</div>
          <h1 className="display">A useful account before a heavy account.</h1>
          <p>Save your assessment profile, choose newsletter preferences, and keep a portable evidence path. Real authentication can be wired next to Supabase, Clerk, or Auth.js.</p>
        </div>
        <button className="btn primary" onClick={()=>setRoute("assessment")}>Update assessment →</button>
      </header>

      <div className="account-grid">
        <section className="card card-pad">
          <div className="kicker" style={{ marginBottom: 12 }}>Sign in shell</div>
          <label className="form-label">Email</label>
          <input className="text-input" type="email" value={account.email || ""} placeholder="you@example.com" onChange={e=>update({ email: e.target.value })} />
          <label className="form-label">Name</label>
          <input className="text-input" value={account.name || ""} placeholder="Optional" onChange={e=>update({ name: e.target.value })} />
          <p className="assessment-fineprint">Saved locally. No password is created and no email is sent until a backend is connected.</p>
          {saved && <div className="save-toast">Saved</div>}
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
    </div>
  );
}

// ---- Notes (editorial) -----------------------------------------------------
function NotesView({ onPickPost }) {
  const posts = (window.ALL_POSTS || []).slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const tags = Array.from(new Set(posts.map(p => p.tag).filter(Boolean))).sort();
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? posts : posts.filter(p => p.tag === active);

  return (
    <div className="page edt-canvas">
      <header style={{ borderBottom: "1px solid var(--rule)", paddingBottom: 18, marginBottom: 28 }}>
        <div style={{ fontFamily: "var(--news)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-2)" }}>The Notes</div>
        <h1 className="display" style={{ fontSize: 44, margin: "8px 0 6px", lineHeight: 1.05 }}>Field notes on longevity</h1>
        <p style={{ color: "var(--ink-2)", maxWidth: 720, margin: 0, fontFamily: "var(--news)", fontSize: 16 }}>
          Long-form essays from the catalogue. {posts.length} pieces — what the evidence actually says, what we got wrong, and what we're still working out.
        </p>
      </header>

      <nav style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        <button className={"chip" + (active === "all" ? " active" : "")} onClick={() => setActive("all")}>All · {posts.length}</button>
        {tags.map(t => {
          const n = posts.filter(p => p.tag === t).length;
          return <button key={t} className={"chip" + (active === t ? " active" : "")} onClick={() => setActive(t)}>{t} · {n}</button>;
        })}
      </nav>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 0 }}>
        {filtered.map(p => (
          <li key={p.slug} style={{ borderBottom: "1px solid var(--rule)", padding: "22px 0" }}>
            <a href={`#/notes/${p.slug}`} onClick={(e)=>{ e.preventDefault(); onPickPost && onPickPost(p.slug); }} style={{ textDecoration: "none", color: "inherit", display: "grid", gridTemplateColumns: "120px 1fr", gap: 24, alignItems: "baseline" }}>
              <div style={{ fontFamily: "var(--news)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-2)" }}>
                {p.date}{p.tag ? <><br/><span style={{ color: "var(--clay)" }}>{p.tag}</span></> : null}
              </div>
              <div>
                <h2 className="display" style={{ fontSize: 24, margin: "0 0 6px", lineHeight: 1.15 }}>{p.title}</h2>
                <p style={{ margin: 0, color: "var(--ink-2)", fontFamily: "var(--news)", fontSize: 15, lineHeight: 1.55 }}>{p.lede}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NoteArticleView({ slug, onBack, onPickPost }) {
  const posts = (window.ALL_POSTS || []).slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const post = posts.find(p => p.slug === slug) || posts[0];
  const related = posts.filter(p => p.slug !== post.slug && p.tag === post.tag).slice(0, 3);
  return (
    <div className="page" style={{ maxWidth: 980 }}>
      <button className="btn ghost" style={{ marginBottom: 22, padding: "4px 0", fontSize: 12, fontFamily: "var(--mono)", letterSpacing: "0.08em" }} onClick={onBack}>← &nbsp;NOTES</button>
      <article className="article-shell">
        <header style={{ borderBottom: "1px solid var(--rule)", paddingBottom: 24, marginBottom: 30 }}>
          <div className="kicker" style={{ marginBottom: 12 }}><span className="bullet" />{post.date}{post.tag ? ` · ${post.tag}` : ""}</div>
          <h1 className="display" style={{ fontSize: 58, lineHeight: 0.98, margin: "0 0 16px", maxWidth: 780 }}>{post.title}</h1>
          <p style={{ margin: 0, color: "var(--ink-2)", fontFamily: "var(--news)", fontSize: 19, lineHeight: 1.5, maxWidth: 720 }}>{post.lede}</p>
        </header>
        <div className="article-prose" dangerouslySetInnerHTML={{ __html: post.html || "" }} />
      </article>
      {related.length > 0 && (
        <section style={{ marginTop: 44 }}>
          <div className="kicker" style={{ marginBottom: 14 }}><span className="bullet" />Keep reading</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {related.map(p => (
              <div key={p.slug} className="card clickable card-pad" onClick={() => onPickPost && onPickPost(p.slug)}>
                <div className="kicker" style={{ marginBottom: 8 }}>{p.date}</div>
                <div className="display" style={{ fontSize: 22, lineHeight: 1.1, marginBottom: 8 }}>{p.title}</div>
                <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 13, lineHeight: 1.5 }}>{p.lede}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

window.Views = { CatalogueView, DetailView, ConcernsView, NutritionView, PlaybooksView, PlaybookDetailView, CompareView, ResearchView, SearchView, MethodologyView, AssessmentView, AccountView, NotesView, NoteArticleView };
