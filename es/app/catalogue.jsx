// Catalogue view — filter sidebar + grid/list/scatter

const { Icon: CatIcon } = window.Shell;
const { ScoreCombo: ScoreView, EvidencePill: EvPill, CatDot: CDot, TierBadge: TBadge, MiniScatter, CONCERN_LABELS: CL, TIER_LABELS: TL, EVIDENCE_DESC: ED } = window.UI;

function FilterSidebar({ filters, setFilters, items }) {
  const Tags = ["Cimientos","Cardio","Fuerza","Dieta","Cerebro","Mente","Calor","Frontera","Senolítico","Con receta","Sin receta","NAD+","Mitofagia","Autofagia"];
  const toggle = (k, v) => {
    const cur = filters[k] || [];
    setFilters({ ...filters, [k]: cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v] });
  };
  const ev = filters.ev || [];
  const tier = filters.tier || [];
  const cat = filters.cat || [];
  const tags = filters.tags || [];

  return (
    <aside style={{ width: 240, padding: "8px 16px 24px", borderRight: "1px solid var(--rule)", background: "var(--paper)", position: "sticky", top: 60, height: "calc(100vh - 60px)", overflowY: "auto", flexShrink: 0 }}>
      <div className="filter-block" style={{ borderBottom: 0, paddingBottom: 0 }}>
        <div className="filter-h"><span>Filtros</span><button className="btn ghost" style={{ padding: "0 4px", fontSize: 10 }} onClick={() => setFilters({})}>Restablecer</button></div>
      </div>
      <div className="filter-block">
        <div className="filter-h">Nivel</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[1,2,3].map(t => (
            <label key={t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
              <input type="checkbox" checked={tier.includes(t)} onChange={() => toggle("tier", t)} style={{ accentColor: "var(--accent)" }} />
              <TBadge tier={t} />
              <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--mono)" }}>{items.filter(i => i.tier === t).length}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="filter-block">
        <div className="filter-h">Categoría</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[["lifestyle","Estilo de vida"],["supplement","Suplemento"],["medication","Medicamento"]].map(([k,l]) => (
            <label key={k} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
              <input type="checkbox" checked={cat.includes(k)} onChange={() => toggle("cat", k)} style={{ accentColor: "var(--accent)" }} />
              <CDot cat={k} /> {l}
              <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--mono)" }}>{items.filter(i => i.cat === k).length}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="filter-block">
        <div className="filter-h">Nivel de evidencia</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {["A","B","C","D"].map(g => (
            <label key={g} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
              <input type="checkbox" checked={ev.includes(g)} onChange={() => toggle("ev", g)} style={{ accentColor: "var(--accent)" }} />
              <strong style={{ color: "var(--accent)" }}>{g}</strong>
              <span style={{ color: "var(--ink-3)", fontSize: 12 }}>{ED[g]}</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--mono)" }}>{items.filter(i => i.ev === g).length}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="filter-block">
        <div className="filter-h">Inquietudes</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {Object.entries(CL).slice(0, 8).map(([k,l]) => (
            <label key={k} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
              <input type="checkbox" checked={(filters.concerns || []).includes(k)} onChange={() => toggle("concerns", k)} style={{ accentColor: "var(--accent)" }} />
              {l}
              <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--mono)" }}>{items.filter(i => i.targets.includes(k)).length}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="filter-block">
        <div className="filter-h">Etiquetas</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {Tags.map(tg => (
            <span key={tg} className={`chip ${tags.includes(tg) ? "on accent" : ""}`} onClick={() => toggle("tags", tg)} style={{ fontSize: 11, padding: "3px 8px" }}>{tg}</span>
          ))}
        </div>
      </div>
    </aside>
  );
}

function ItemGridCard({ item, viz, onPick, density }) {
  const compact = density === "dense";
  return (
    <div className="card clickable" style={{ padding: compact ? 14 : 18, display: "flex", flexDirection: "column", gap: compact ? 8 : 12 }} onClick={() => onPick(item.slug)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CDot cat={item.cat} />
          <span className="kicker">{item.cat}</span>
        </div>
        <TBadge tier={item.tier} />
      </div>
      <div>
        <div style={{ fontFamily: "var(--display)", fontStyle: "var(--display-italic)", fontWeight: "var(--display-w)", fontSize: compact ? 18 : 22, lineHeight: 1.15, letterSpacing: "-0.01em" }}>{item.name}</div>
        {!compact && <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5, marginTop: 6 }}>{item.one}</div>}
      </div>
      <ScoreView e={item.e} c={item.c} viz={viz} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 8, borderTop: "1px solid var(--rule)" }}>
        <EvPill ev={item.ev} />
        <span style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--mono)" }}>{item.cost}</span>
      </div>
    </div>
  );
}

function CatalogueView({ items, viz, onPick }) {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("effect");
  const [layout, setLayout] = useState("grid");
  const [density, setDensity] = useState("comfy");
  const [scatterHi, setScatterHi] = useState(null);

  const filtered = useMemo(() => {
    let r = items.slice();
    if (filters.tier?.length) r = r.filter(i => filters.tier.includes(i.tier));
    if (filters.cat?.length) r = r.filter(i => filters.cat.includes(i.cat));
    if (filters.ev?.length) r = r.filter(i => filters.ev.includes(i.ev));
    if (filters.concerns?.length) r = r.filter(i => filters.concerns.some(c => i.targets.includes(c)));
    if (filters.tags?.length) r = r.filter(i => filters.tags.some(t => i.tags.includes(t)));
    if (sort === "effect") r.sort((a, b) => b.e - a.e);
    if (sort === "certainty") r.sort((a, b) => b.c - a.c);
    if (sort === "combined") r.sort((a, b) => (b.e + b.c) - (a.e + a.c));
    if (sort === "alpha") r.sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [items, filters, sort]);

  const activeChips = [
    ...(filters.tier || []).map(t => ({ k: "tier", v: t, l: TL[t] })),
    ...(filters.cat || []).map(t => ({ k: "cat", v: t, l: t })),
    ...(filters.ev || []).map(t => ({ k: "ev", v: t, l: `Evidencia ${t}` })),
    ...(filters.concerns || []).map(t => ({ k: "concerns", v: t, l: CL[t] })),
    ...(filters.tags || []).map(t => ({ k: "tags", v: t, l: t })),
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100%" }}>
      <FilterSidebar filters={filters} setFilters={setFilters} items={items} />
      <div style={{ padding: "24px 32px 80px", minWidth: 0 }}>
        <header style={{ marginBottom: 20 }}>
          <div className="kicker" style={{ marginBottom: 6 }}>Biblioteca</div>
          <h1 style={{ fontFamily: "var(--display)", fontStyle: "var(--display-italic)", fontWeight: "var(--display-w)", fontSize: 32, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Catálogo</h1>
          <div style={{ fontSize: 13.5, color: "var(--ink-2)" }}>{filtered.length} de {items.length} intervenciones · evaluadas frente a 412 estudios humanos</div>
        </header>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", border: "1px solid var(--rule)", borderRadius: 8, overflow: "hidden", background: "var(--paper)" }}>
            {["grid","list","scatter"].map(l => (
              <button key={l} className="btn ghost" style={{ borderRadius: 0, padding: "7px 12px", fontSize: 12, background: layout === l ? "var(--bg-2)" : "transparent" }} onClick={() => setLayout(l)}>
                {{grid:"Cuadrícula",list:"Lista",scatter:"Dispersión"}[l]}
              </button>
            ))}
          </div>
          {layout === "grid" && (
            <div style={{ display: "inline-flex", border: "1px solid var(--rule)", borderRadius: 8, overflow: "hidden", background: "var(--paper)" }}>
              {["comfy","dense"].map(d => (
                <button key={d} className="btn ghost" style={{ borderRadius: 0, padding: "7px 12px", fontSize: 12, background: density === d ? "var(--bg-2)" : "transparent" }} onClick={() => setDensity(d)}>{{comfy:"Cómodo",dense:"Denso"}[d]}</button>
              ))}
            </div>
          )}
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "7px 10px", border: "1px solid var(--rule)", borderRadius: 8, background: "var(--paper)", fontSize: 12 }}>
            <option value="effect">Ordenar: Eficacia ↓</option>
            <option value="certainty">Ordenar: Certeza ↓</option>
            <option value="combined">Ordenar: Combinado ↓</option>
            <option value="alpha">Ordenar: A–Z</option>
          </select>
          {activeChips.length > 0 && (
            <div style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
              {activeChips.map(c => (
                <span key={c.k + c.v} className="chip on accent" onClick={() => setFilters({ ...filters, [c.k]: filters[c.k].filter(x => x !== c.v) })}>
                  {c.l} ✕
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Layouts */}
        {layout === "grid" && (
          <div style={{ display: "grid", gridTemplateColumns: density === "dense" ? "repeat(auto-fill, minmax(220px, 1fr))" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {filtered.map(item => <ItemGridCard key={item.slug} item={item} viz={viz} onPick={onPick} density={density} />)}
          </div>
        )}
        {layout === "list" && (
          <div className="card" style={{ padding: 0 }}>
            <div className="list-row" style={{ gridTemplateColumns: "auto 1.6fr 1fr 110px 90px 70px 24px", padding: "10px 18px", background: "var(--paper-2)", borderRadius: "14px 14px 0 0", cursor: "default" }}>
              <span></span>
              <span className="mono" style={{ color: "var(--ink-3)" }}>Intervención</span>
              <span className="mono" style={{ color: "var(--ink-3)" }}>Objetivos</span>
              <span className="mono" style={{ color: "var(--ink-3)" }}>Score</span>
              <span className="mono" style={{ color: "var(--ink-3)" }}>Evidencia</span>
              <span className="mono" style={{ color: "var(--ink-3)" }}>Coste</span>
              <span></span>
            </div>
            {filtered.map(item => (
              <div key={item.slug} className="list-row" style={{ gridTemplateColumns: "auto 1.6fr 1fr 110px 90px 70px 24px" }} onClick={() => onPick(item.slug)}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><CDot cat={item.cat} /><TBadge tier={item.tier} /></span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.4 }}>{item.one}</div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {item.targets.slice(0, 2).map(t => <span key={t} className="pill" style={{ fontSize: 10, padding: "2px 7px" }}>{CL[t] || t}</span>)}
                </div>
                <ScoreView e={item.e} c={item.c} viz={viz} />
                <EvPill ev={item.ev} />
                <span style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--mono)" }}>{item.cost}</span>
                <span style={{ color: "var(--ink-3)" }}><CatIcon name="arrow" size={14} /></span>
              </div>
            ))}
          </div>
        )}
        {layout === "scatter" && (
          <div className="card card-pad" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <MiniScatter items={filtered} highlight={scatterHi} onPick={(it) => onPick(it.slug)} w={640} h={460} />
            </div>
            <div>
              <div className="kicker" style={{ marginBottom: 8 }}>Cómo leer el gráfico</div>
              <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.55, marginTop: 0 }}>
                Cada punto es una intervención. Arriba a la derecha significa «gran efecto, alta certeza»: ahí están el sueño, el ejercicio, las estatinas. Abajo a la derecha está la frontera de la longevidad: quizá enorme, quizá nada.
              </p>
              <hr className="rule" style={{ margin: "12px 0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><CDot cat="lifestyle" /> Estilo de vida</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><CDot cat="supplement" /> Suplemento</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><CDot cat="medication" /> Medicamento</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.CatalogueView = CatalogueView;
