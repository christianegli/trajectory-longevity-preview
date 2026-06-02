// Dashboard — publication-first IA
// Per anti-account-creep rule: no "Good morning Elena", no "My Stack",
// no fake adherence %, no avatar. This is an evidence resource, not a SaaS.

const { useState: dUseState } = React;
const { CatDot: D_Cat, Tier: D_Tier, Grade: D_Grade, Score: D_Score, Scatter: D_Scatter, CONCERN_LABELS: D_CL } = window.UI;

function HomeAtlas({ items, onPick, setRoute }) {
  // Render every item, sorted by combined E+C so the highest-leverage dots
  // are painted last and sit on top when they overlap.
  const all = items
    .filter(it => typeof it.e === "number" && typeof it.c === "number")
    .slice()
    .sort((a, b) => (a.e + a.c) - (b.e + b.c));
  const xFor = (e) => 8 + ((e - 1) / 9) * 84;
  const yFor = (c) => 8 + ((10 - c) / 9) * 72;
  const coordCounts = all.reduce((acc, item) => {
    const key = `${item.e}-${item.c}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const coordSeen = {};
  const plotted = all.map(item => {
    const key = `${item.e}-${item.c}`;
    const count = coordCounts[key] || 1;
    const index = coordSeen[key] || 0;
    coordSeen[key] = index + 1;
    const baseX = xFor(item.e);
    const baseY = yFor(item.c);
    if (count === 1) return { item, key, baseX, baseY, spreadX: baseX, spreadY: baseY, cluster: count };

    // Scores are intentionally coarse integers. Spread equal-score items
    // into a compact grid only while that score bin is explored. At rest,
    // the chart preserves the clean integer-score atlas.
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const col = index % cols;
    const row = Math.floor(index / cols);
    const xStep = count > 9 ? 1.75 : 2.15;
    const yStep = count > 9 ? 3.05 : 3.35;
    const spreadX = Math.max(5, Math.min(95, baseX + (col - (cols - 1) / 2) * xStep));
    const spreadY = Math.max(5, Math.min(91, baseY + (row - (rows - 1) / 2) * yStep));
    return { item, key, baseX, baseY, spreadX, spreadY, cluster: count };
  });

  const [hover, setHover] = dUseState(null); // { item, x, y }
  const [expandedKey, setExpandedKey] = dUseState(null);
  const [tier, setTier] = dUseState("all"); // all | 1 | 2 | 3

  const filtered = tier === "all" ? plotted : plotted.filter(p => p.item.tier === Number(tier));

  return (
    <section className="atlas-panel" aria-label="Cartographie effet × certitude">
      <div className="atlas-panel-head">
        <div>
          <div className="kicker"><span className="bullet" />Fig. 01 · La carte</div>
          <h2 className="display">Un seul graphique. Toutes les promesses sérieuses de la longévité.</h2>
          <div className="atlas-subtitle">Les {all.length} interventions, positionnées selon l'ampleur de l'effet (x) et la solidité des preuves chez l'humain (y). Survolez un point.</div>
        </div>
        <div className="atlas-controls">
          <div className="atlas-tier-toggle" role="tablist" aria-label="Filtrer par niveau">
            {[["all","Tous"],["1","Socle"],["2","Ciblé"],["3","Frontière"]].map(([k,l]) => (
              <button
                key={k}
                role="tab"
                aria-selected={tier === k}
                className={`atlas-tier-btn ${tier === k ? "is-active" : ""}`}
                onClick={() => setTier(k)}
              >{l}</button>
            ))}
          </div>
          <button className="btn secondary" onClick={()=>setRoute("catalogue")}>Ouvrir le catalogue →</button>
        </div>
      </div>
      <div className="atlas-plot" onMouseLeave={() => { setHover(null); setExpandedKey(null); }}>
        <div className="atlas-quadrant">À faire en premier</div>
        {[1,3,5,7,10].map(v => <span key={`x${v}`} className="atlas-x" style={{ left: `${xFor(v)}%` }}>{v}</span>)}
        {[1,3,5,7,10].map(v => <span key={`y${v}`} className="atlas-y" style={{ top: `${yFor(v)}%` }}>{v}</span>)}
        {filtered.map(({ item, key, baseX, baseY, spreadX, spreadY, cluster }) => {
          const isExpanded = expandedKey === key;
          const x = isExpanded ? spreadX : baseX;
          const y = isExpanded ? spreadY : baseY;
          const isHover = hover && hover.item.slug === item.slug;
          return (
            <button
              key={item.slug}
              className={`atlas-dot tier-${item.tier} ${isExpanded ? "is-expanded" : ""} ${isHover ? "is-hover" : ""}`}
              title={cluster > 1 ? `${item.name} partage cette case avec ${cluster - 1} autre${cluster === 2 ? "" : "s"} intervention${cluster === 2 ? "" : "s"}` : item.name}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${isExpanded ? 9 : 8 + (item.e + item.c) * 0.75}px`,
                height: `${isExpanded ? 9 : 8 + (item.e + item.c) * 0.75}px`,
              }}
              aria-label={`${item.name} : effet ${item.e} sur 10, certitude ${item.c} sur 10`}
              onMouseEnter={() => { setExpandedKey(key); setHover({ item, x, y }); }}
              onFocus={() => { setExpandedKey(key); setHover({ item, x, y }); }}
              onBlur={() => setHover(null)}
              onClick={()=>onPick(item.slug)}
            />
          );
        })}
        {hover && (
          <div
            className="atlas-tooltip"
            style={{
              left: `${hover.x}%`,
              top: `${hover.y}%`,
              transform: hover.x > 70 ? "translate(-100%, -50%) translateX(-14px)" : "translate(14px, -50%)",
            }}
            role="tooltip"
          >
            <div className="atlas-tt-cat">
              <i className={`legend-dot ${hover.item.tier === 1 ? "foundation" : hover.item.tier === 2 ? "targeted" : "frontier"}`} />
              {hover.item.cat}{hover.item.tier ? ` · niveau ${hover.item.tier}` : ""}
            </div>
            <div className="atlas-tt-name">{hover.item.name}</div>
            <div className="atlas-tt-scores">
              <span><strong>Effet</strong> {hover.item.e}/10</span>
              <span><strong>Certitude</strong> {hover.item.c}/10</span>
            </div>
            {hover.item.one && <div className="atlas-tt-one">{hover.item.one}</div>}
            <div className="atlas-tt-cta">Cliquer pour ouvrir →</div>
          </div>
        )}
      </div>
      <div className="atlas-legend">
        <span>← Efficacité →</span>
        <span>La certitude monte vers le haut</span>
        <span><i className="legend-dot foundation" /> Socle</span>
        <span><i className="legend-dot targeted" /> Ciblé</span>
        <span><i className="legend-dot frontier" /> Frontière</span>
      </div>
    </section>
  );
}

function Dashboard({ items, viz, onPick, setRoute }) {
  // Foundation = tier 1, ranked by composite Evidence × Effectiveness
  const foundation = items
    .filter(i => i.tier === 1)
    .sort((a, b) => (b.e + b.c) - (a.e + a.c));

  // Featured = the single highest-leverage foundation move (E×C)
  const featured = foundation[0];
  const corePost = (window.ALL_POSTS || []).find(p => p.slug === "is-x-worth-taking");
  const studyCount = items.reduce((sum, item) => sum + ((item.studies || []).length), 0);
  const topClinical = items
    .filter(i => i.cat === "medication" && ["A", "B"].includes(i.ev))
    .sort((a, b) => (b.e + b.c) - (a.e + a.c))[0];
  const topFrontier = items
    .filter(i => i.tier === 3)
    .sort((a, b) => (b.e - b.c) - (a.e - a.c))[0];
  const actionCards = [
    {
      label: "À faire en premier",
      title: featured ? featured.name : "Les fondamentaux",
      copy: featured ? featured.one : "Commencer là où la certitude et l'effet sont tous deux élevés.",
      meta: featured ? `Effet ${featured.e}/10 · certitude ${featured.c}/10` : "Bases solides",
      onClick: () => featured && onPick(featured.slug),
    },
    {
      label: "À discuter en consultation",
      title: topClinical ? topClinical.name : "Décisions médicamenteuses",
      copy: topClinical ? topClinical.one : "Une preuve solide peut rester conditionnelle au risque de base.",
      meta: topClinical ? `Preuves ${topClinical.ev} · niveau ${topClinical.tier}` : "Pour la bonne personne",
      onClick: () => topClinical && onPick(topClinical.slug),
    },
    {
      label: "À surveiller, sans s'y précipiter",
      title: topFrontier ? topFrontier.name : "Idées de frontière",
      copy: topFrontier ? topFrontier.one : "Des mécanismes intéressants ont besoin de données cliniques humaines avant de devenir un plan.",
      meta: topFrontier ? `Effet ${topFrontier.e}/10 · certitude ${topFrontier.c}/10` : "Faible certitude chez l'humain",
      onClick: () => topFrontier && onPick(topFrontier.slug),
    },
  ];

  const concerns = ["cvd","cognitive-decline","metabolic","sarcopenia","cancer","inflammaging"];

  // Today's date — server build will swap this; for live render we just use today's
  const today = new Date();
  const monthNames = ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
  const dayNames = ["dim.","lun.","mar.","mer.","jeu.","ven.","sam."];
  const dateStr = `${dayNames[today.getDay()]} · ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

  // Counts by tier
  const tier1 = items.filter(i => i.tier === 1).length;
  const tier2 = items.filter(i => i.tier === 2).length;
  const tier3 = items.filter(i => i.tier === 3).length;

  return (
    <div className="page">
      {/* Masthead — publication, not a greeting */}
      <section className="home-hero">
        <div>
          <div className="kicker clay" style={{ marginBottom: 18 }}><span className="bullet" />{dateStr} · Longévité fondée sur les preuves</div>
          <h1 className="display home-title">
            Ce qui fait vraiment la différence sur le temps que vous vivrez bien.
          </h1>
          <div className="note" style={{ maxWidth: 560 }}>
            Une longévité fondée sur les preuves signifie que chaque affirmation doit survivre aux mêmes questions : <em>est-ce que cela fonctionne chez l'humain</em>, <em>quelle est l'ampleur de l'effet</em>, et <em>qu'est-ce qui ferait agir différemment une personne ordinaire</em>. Aucun complément à vendre, pas de télémédecine, pas d'abonnement Pro — uniquement les preuves, tenues à jour, en langage clair.
            <span className="sig">— L'équipe éditoriale de Trajectory</span>
          </div>
        </div>
        <div className="home-stats card-pad numeric">
          <div className="kicker" style={{ marginBottom: 18 }}>Le catalogue</div>
          <div className="home-stat-grid">
            <div>
              <div className="display" style={{ fontSize: 44, lineHeight: 1 }}>{items.length}</div>
              <div className="kicker" style={{ marginTop: 6 }}>Interventions notées</div>
            </div>
            <div>
              <div className="display" style={{ fontSize: 44, lineHeight: 1 }}>{studyCount}</div>
              <div className="kicker" style={{ marginTop: 6 }}>Études référencées</div>
            </div>
            <div>
              <div className="display" style={{ fontSize: 44, lineHeight: 1 }}>{tier2}</div>
              <div className="kicker" style={{ marginTop: 6 }}>Niveau Ciblé</div>
            </div>
            <div>
              <div className="display" style={{ fontSize: 44, lineHeight: 1 }}>{tier3}</div>
              <div className="kicker" style={{ marginTop: 6 }}>Niveau Frontière</div>
            </div>
          </div>
          <hr className="rule" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{tier1} éléments du socle, avant la frontière</span>
            <button className="btn link" onClick={() => setRoute("methodology")}>Notre méthode de notation</button>
          </div>
        </div>
      </section>

      <section className="decision-strip" aria-label="Triage des preuves">
        {actionCards.map(card => (
          <button key={card.label} className="decision-card" onClick={card.onClick}>
            <span className="kicker clay"><span className="bullet" />{card.label}</span>
            <span className="decision-card-title display">{card.title}</span>
            <span className="decision-card-copy">{card.copy}</span>
            <span className="decision-card-meta">{card.meta} →</span>
          </button>
        ))}
      </section>

      <HomeAtlas items={items} onPick={onPick} setRoute={setRoute} />

      <section className="home-cta-grid" style={{ marginBottom: 56 }}>
        {corePost && (
          <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 28, padding: "26px 30px", alignItems: "center", background: "var(--paper)", minWidth: 0 }}>
            <div>
              <div className="kicker clay" style={{ marginBottom: 10 }}><span className="bullet" />Cadre de référence</div>
              <h2 className="display" style={{ fontSize: 34, lineHeight: 1.05, margin: "0 0 10px" }}>{corePost.title}</h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--ink-2)", margin: 0, maxWidth: 740, fontFamily: "var(--news)" }}>{corePost.lede}</p>
            </div>
            <button className="btn primary" onClick={() => setRoute("note", corePost.slug)}>Lire le cadre →</button>
          </div>
        )}
        <div className="card clickable" style={{ padding: "26px 28px", minWidth: 0, background: "var(--paper-2)" }} onClick={() => setRoute("assessment")}>
          <div className="kicker" style={{ marginBottom: 10 }}><span className="bullet" />Parcours de lecture personnalisé</div>
          <h2 className="display" style={{ fontSize: 29, lineHeight: 1.05, margin: "0 0 10px" }}>Six questions. Pas d'inscription.</h2>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)", margin: "0 0 18px", fontFamily: "var(--news)" }}>
            Obtenez une sélection privilégiant le socle : par où commencer, quoi cibler ensuite, et quelles idées de frontière laisser de côté pour l'instant.
          </p>
          <button className="btn secondary">Construire le parcours →</button>
        </div>
      </section>

      <section style={{ marginBottom: 56 }}>
        <div className="decision-grid">
          <div className="card clickable card-pad" onClick={() => setRoute("playbooks")}>
            <div className="kicker clay" style={{ marginBottom: 10 }}><span className="bullet" />Protocoles</div>
            <h2 className="display" style={{ fontSize: 30, lineHeight: 1.05, margin: "0 0 10px" }}>Partir du problème.</h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-2)", margin: "0 0 18px", fontFamily: "var(--news)" }}>
              ApoB, tension artérielle, sommeil, ménopause, prédiabète et perte musculaire, traduits en parcours de décision ordonnés.
            </p>
            <button className="btn secondary">Ouvrir les protocoles →</button>
          </div>
          <div className="card clickable card-pad" onClick={() => setRoute("compare")}>
            <div className="kicker clay" style={{ marginBottom: 10 }}><span className="bullet" />Comparer</div>
            <h2 className="display" style={{ fontSize: 30, lineHeight: 1.05, margin: "0 0 10px" }}>Trancher entre deux idées.</h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-2)", margin: "0 0 18px", fontFamily: "var(--news)" }}>
              Placez les interventions côte à côte avant d'ajouter une habitude, un complément, un test ou une discussion médicamenteuse de plus.
            </p>
            <button className="btn secondary">Comparer les interventions →</button>
          </div>
          <div className="card clickable card-pad" onClick={() => setRoute("nutrition")}>
            <div className="kicker clay" style={{ marginBottom: 10 }}><span className="bullet" />Nutrition</div>
            <h2 className="display" style={{ fontSize: 30, lineHeight: 1.05, margin: "0 0 10px" }}>L'alimentation avant les piluliers.</h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-2)", margin: "0 0 18px", fontFamily: "var(--news)" }}>
              Protéines, fibres, régime méditerranéen, aliments pertinents pour l'ApoB, et les rares compléments nutritionnels qui méritent un second regard.
            </p>
            <button className="btn secondary">Ouvrir la nutrition →</button>
          </div>
        </div>
      </section>

      {/* Featured intervention — editorial highlight, not a personal prescription */}
      {featured && (
        <section style={{ marginBottom: 56 }}>
          <div className="card deep" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 36, padding: "32px 36px", alignItems: "center" }}>
            <div>
              <div className="kicker clay" style={{ marginBottom: 14 }}><span className="bullet" />Preuves × effet les plus élevés</div>
              <h2 className="display" style={{ fontSize: 40, lineHeight: 1.05, margin: "0 0 12px", color: "var(--paper)" }}>{featured.name}.</h2>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--ink-4)", margin: "0 0 22px", maxWidth: 580 }}>
                {featured.one}
              </p>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button className="btn clay" onClick={() => onPick(featured.slug)}>Lire le protocole →</button>
                <button className="btn ghost" style={{ color: "var(--paper)" }} onClick={() => setRoute("catalogue")}>Voir tout le socle</button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <D_Grade ev={featured.ev} /> <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--paper)", letterSpacing: "0.12em" }}>PREUVES {featured.ev}</span>
              </div>
              <div className="numeric" style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-4)", textAlign: "right", lineHeight: 1.7 }}>
                <div>EFFET <span style={{ color: "var(--paper)", fontSize: 14 }}>{featured.e}</span><span style={{ color: "var(--ink-3)" }}>/10</span></div>
                <div>CERT <span style={{ color: "var(--paper)", fontSize: 14 }}>{featured.c}</span><span style={{ color: "var(--ink-3)" }}>/10</span></div>
                <div>NIVEAU <span style={{ color: "var(--paper)", fontSize: 14 }}>{featured.tier}</span></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* The foundation — ranked, public, no personalization */}
      <section style={{ marginBottom: 56 }}>
        <header style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "baseline", marginBottom: 18, gap: 16 }}>
          <div>
            <div className="kicker" style={{ marginBottom: 6 }}><span className="bullet" />Le socle</div>
            <h2 className="display" style={{ fontSize: 32, margin: 0 }}>Classement par preuves × effet.</h2>
          </div>
          <button className="btn link" onClick={() => setRoute("catalogue")}>Catalogue complet &nbsp;→</button>
        </header>
        <div className="card" style={{ padding: 0 }}>
          <div className="list-row head" style={{ gridTemplateColumns: "26px minmax(0,1.5fr) minmax(0,1fr) 120px 64px 16px" }}>
            <span className="mono">#</span>
            <span className="mono">Intervention</span>
            <span className="mono">Cibles</span>
            <span className="mono">Score</span>
            <span className="mono">Preuves</span>
            <span></span>
          </div>
          {foundation.slice(0, 10).map((item, idx) => (
            <div key={item.slug} className="list-row" style={{ gridTemplateColumns: "26px minmax(0,1.5fr) minmax(0,1fr) 120px 64px 16px" }} onClick={() => onPick(item.slug)}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)" }}>{String(idx + 1).padStart(2, "0")}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                  <D_Cat cat={item.cat} />
                  <span className="display" style={{ fontSize: 17, lineHeight: 1.1 }}>{item.name}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.45 }}>{item.one}</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, minWidth: 0 }}>
                {item.targets.slice(0, 2).map(t => <span key={t} className="pill">{D_CL[t]}</span>)}
                {item.targets.length > 2 && <span style={{ fontSize: 11, color: "var(--ink-3)" }}>+{item.targets.length - 2}</span>}
              </div>
              <D_Score e={item.e} c={item.c} viz={viz} />
              <D_Grade ev={item.ev} />
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.6"><path d="m9 6 6 6-6 6" /></svg>
            </div>
          ))}
        </div>
      </section>

      {/* By concern */}
      <section style={{ marginBottom: 56 }}>
        <header style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "baseline", marginBottom: 18, gap: 16 }}>
          <div>
            <div className="kicker" style={{ marginBottom: 6 }}><span className="bullet" />Par sujet</div>
            <h2 className="display" style={{ fontSize: 32, margin: 0 }}>Ce qui inquiète vraiment.</h2>
          </div>
          <button className="btn link" onClick={() => setRoute("concerns")}>Les 12 sujets &nbsp;→</button>
        </header>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {concerns.map(key => {
            const matches = items.filter(i => i.targets.includes(key));
            const top = [...matches].sort((a,b) => (b.e+b.c) - (a.e+a.c))[0];
            return (
              <div key={key} className="card clickable card-pad" onClick={() => setRoute("concerns", key)}>
                <div className="kicker" style={{ marginBottom: 12 }}>{matches.length} interventions</div>
                <div className="display" style={{ fontSize: 22, lineHeight: 1.1, marginBottom: 16 }}>{D_CL[key]}</div>
                {top && (
                  <div style={{ paddingTop: 12, borderTop: "1px solid var(--rule)", fontSize: 12.5 }}>
                    <div className="kicker" style={{ marginBottom: 6 }}>Preuves les plus solides</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <D_Cat cat={top.cat} />
                      <span style={{ fontWeight: 500, color: "var(--ink)" }}>{top.name}</span>
                      <D_Grade ev={top.ev} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Methodology footer */}
      <section className="card" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 36, padding: "28px 32px", alignItems: "center" }}>
        <div>
          <div className="kicker" style={{ marginBottom: 8 }}><span className="bullet" />Notre méthode de notation</div>
          <h3 className="display" style={{ fontSize: 24, margin: "0 0 8px" }}>Deux chiffres, pas un.</h3>
          <p style={{ margin: 0, color: "var(--ink-2)", maxWidth: 660, fontSize: 14 }}>
            L'<strong style={{ color: "var(--ink)" }}>efficacité</strong> mesure l'ampleur du bénéfice <em>si</em> l'intervention fonctionne. La <strong style={{ color: "var(--ink)" }}>certitude</strong>, la solidité de cette conviction. Une intervention à fort effet mais faible certitude est un pari — information utile, mais une décision différente d'un fondamental bien établi.
          </p>
        </div>
        <button className="btn secondary" onClick={() => setRoute("methodology")}>Lire la méthodologie &nbsp;→</button>
      </section>
    </div>
  );
}
window.Dashboard = Dashboard;
