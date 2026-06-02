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
    <section className="atlas-panel" aria-label="Effectiveness by certainty atlas">
      <div className="atlas-panel-head">
        <div>
          <div className="kicker"><span className="bullet" />Fig. 01 · The atlas</div>
          <h2 className="display">One chart. Every serious longevity claim.</h2>
          <div className="atlas-subtitle">All {all.length} interventions, plotted by how strong the effect is (x) and how confident we are it's real in humans (y). Hover any dot.</div>
        </div>
        <div className="atlas-controls">
          <div className="atlas-tier-toggle" role="tablist" aria-label="Filter by tier">
            {[["all","All"],["1","Foundation"],["2","Targeted"],["3","Frontier"]].map(([k,l]) => (
              <button
                key={k}
                role="tab"
                aria-selected={tier === k}
                className={`atlas-tier-btn ${tier === k ? "is-active" : ""}`}
                onClick={() => setTier(k)}
              >{l}</button>
            ))}
          </div>
          <button className="btn secondary" onClick={()=>setRoute("catalogue")}>Open catalogue →</button>
        </div>
      </div>
      <div className="atlas-plot" onMouseLeave={() => { setHover(null); setExpandedKey(null); }}>
        <div className="atlas-quadrant">Act first</div>
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
              title={cluster > 1 ? `${item.name} shares this score bin with ${cluster - 1} other intervention${cluster === 2 ? "" : "s"}` : item.name}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${isExpanded ? 9 : 8 + (item.e + item.c) * 0.75}px`,
                height: `${isExpanded ? 9 : 8 + (item.e + item.c) * 0.75}px`,
              }}
              aria-label={`${item.name}: effect ${item.e} of 10, certainty ${item.c} of 10`}
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
              {hover.item.cat}{hover.item.tier ? ` · tier ${hover.item.tier}` : ""}
            </div>
            <div className="atlas-tt-name">{hover.item.name}</div>
            <div className="atlas-tt-scores">
              <span><strong>Effect</strong> {hover.item.e}/10</span>
              <span><strong>Certainty</strong> {hover.item.c}/10</span>
            </div>
            {hover.item.one && <div className="atlas-tt-one">{hover.item.one}</div>}
            <div className="atlas-tt-cta">Click to open →</div>
          </div>
        )}
      </div>
      <div className="atlas-legend">
        <span>← Effectiveness →</span>
        <span>Certainty rises upward</span>
        <span><i className="legend-dot foundation" /> Foundation</span>
        <span><i className="legend-dot targeted" /> Targeted</span>
        <span><i className="legend-dot frontier" /> Frontier</span>
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
      label: "Act first",
      title: featured ? featured.name : "Foundation habits",
      copy: featured ? featured.one : "Start where certainty and impact are both high.",
      meta: featured ? `Effect ${featured.e}/10 · certainty ${featured.c}/10` : "High-certainty basics",
      onClick: () => featured && onPick(featured.slug),
    },
    {
      label: "Discuss clinically",
      title: topClinical ? topClinical.name : "Medication decisions",
      copy: topClinical ? topClinical.one : "Strong evidence can still be conditional on baseline risk.",
      meta: topClinical ? `Evidence ${topClinical.ev} · tier ${topClinical.tier}` : "For the right person",
      onClick: () => topClinical && onPick(topClinical.slug),
    },
    {
      label: "Watch, do not chase",
      title: topFrontier ? topFrontier.name : "Frontier ideas",
      copy: topFrontier ? topFrontier.one : "Interesting mechanisms need human outcome data before they become plans.",
      meta: topFrontier ? `Effect ${topFrontier.e}/10 · certainty ${topFrontier.c}/10` : "Low human certainty",
      onClick: () => topFrontier && onPick(topFrontier.slug),
    },
  ];

  const concerns = ["cvd","cognitive-decline","metabolic","sarcopenia","cancer","inflammaging"];

  // Today's date — server build will swap this; for live render we just use today's
  const today = new Date();
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
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
          <div className="kicker clay" style={{ marginBottom: 18 }}><span className="bullet" />{dateStr} · Evidence based longevity</div>
          <h1 className="display home-title">
            What actually moves the needle on how long you live well.
          </h1>
          <div className="note" style={{ maxWidth: 560 }}>
            Evidence based longevity means every claim has to survive the same questions: <em>does it work in humans</em>, <em>how large is the effect</em>, and <em>what would make a normal person act differently</em>. The research surface stays free; the first product is a sharper publication, catalogue, and personal review hub.
            <span className="sig">— Trajectory editorial team</span>
          </div>
        </div>
        <aside className="today-editorial-card">
          <div className="kicker"><span className="bullet" />Read today</div>
          <h2 className="display">Start with the question, then choose the evidence.</h2>
          <p>Use Notes for editorial judgment, Catalogue for the database, and Assessment when you want a personal reading path.</p>
          <div className="today-editorial-actions">
            <button className="btn primary" onClick={() => setRoute("news")}>Open Notes</button>
            <button className="btn secondary" onClick={() => setRoute("catalogue")}>Open Catalogue</button>
          </div>
        </aside>
      </section>

      <section className="home-publication-strip" aria-label="Publication paths">
        <button onClick={() => setRoute("news")}>
          <span className="kicker">Latest notes</span>
          <strong>Essays, protocol memos, and evidence updates edited like a serious health desk.</strong>
        </button>
        <button onClick={() => setRoute("assessment")}>
          <span className="kicker">Personal hub</span>
          <strong>Generate a free weekly path, review packet, and watchlist without locking evidence away.</strong>
        </button>
        <button onClick={() => setRoute("catalogue")}>
          <span className="kicker">Evidence library</span>
          <strong>Search interventions, compare grades, and keep the supplement question inside the evidence model.</strong>
        </button>
      </section>

      <section className="decision-strip" aria-label="Evidence triage">
        {actionCards.map(card => (
          <button key={card.label} className="decision-card" onClick={card.onClick}>
            <span className="kicker clay"><span className="bullet" />{card.label}</span>
            <span className="decision-card-title display">{card.title}</span>
            <span className="decision-card-copy">{card.copy}</span>
            <span className="decision-card-meta">{card.meta} →</span>
          </button>
        ))}
      </section>

      <section className="home-cta-grid" style={{ marginBottom: 56 }}>
        {corePost && (
          <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 28, padding: "26px 30px", alignItems: "center", background: "var(--paper)", minWidth: 0 }}>
            <div>
              <div className="kicker clay" style={{ marginBottom: 10 }}><span className="bullet" />Core framework</div>
              <h2 className="display" style={{ fontSize: 34, lineHeight: 1.05, margin: "0 0 10px" }}>{corePost.title}</h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--ink-2)", margin: 0, maxWidth: 740, fontFamily: "var(--news)" }}>{corePost.lede}</p>
            </div>
            <button className="btn primary" onClick={() => setRoute("note", corePost.slug)}>Read the framework →</button>
          </div>
        )}
        <div className="card clickable" style={{ padding: "26px 28px", minWidth: 0, background: "var(--paper-2)" }} onClick={() => setRoute("assessment")}>
          <div className="kicker" style={{ marginBottom: 10 }}><span className="bullet" />Personal reading path</div>
          <h2 className="display" style={{ fontSize: 29, lineHeight: 1.05, margin: "0 0 10px" }}>Six questions. No login.</h2>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)", margin: "0 0 18px", fontFamily: "var(--news)" }}>
            Get a foundation-first shortlist: what to fix first, what to target next, and which frontier ideas to ignore for now.
          </p>
          <button className="btn secondary">Build the path →</button>
        </div>
        <div className="card clickable" style={{ padding: "26px 28px", minWidth: 0, background: "var(--paper)" }} onClick={() => setRoute("catalogue")}>
          <div className="kicker clay" style={{ marginBottom: 10 }}><span className="bullet" />Open catalogue</div>
          <h2 className="display" style={{ fontSize: 29, lineHeight: 1.05, margin: "0 0 10px" }}>Ninety-eight interventions, one standard.</h2>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)", margin: "0 0 18px", fontFamily: "var(--news)" }}>
            Browse the full evidence library with the same grading model across lifestyle, nutrition, medications, and supplements.
          </p>
          <button className="btn secondary">Open catalogue →</button>
        </div>
      </section>

      <section className="home-stats card-pad numeric" style={{ marginBottom: 56 }}>
        <div className="kicker" style={{ marginBottom: 18 }}>The evidence base</div>
        <div className="home-stat-grid">
          <div>
            <div className="display" style={{ fontSize: 44, lineHeight: 1 }}>{items.length}</div>
            <div className="kicker" style={{ marginTop: 6 }}>Interventions graded</div>
          </div>
          <div>
            <div className="display" style={{ fontSize: 44, lineHeight: 1 }}>{studyCount}</div>
            <div className="kicker" style={{ marginTop: 6 }}>Study links indexed</div>
          </div>
          <div>
            <div className="display" style={{ fontSize: 44, lineHeight: 1 }}>{tier2}</div>
            <div className="kicker" style={{ marginTop: 6 }}>Targeted tier</div>
          </div>
          <div>
            <div className="display" style={{ fontSize: 44, lineHeight: 1 }}>{tier3}</div>
            <div className="kicker" style={{ marginTop: 6 }}>Frontier tier</div>
          </div>
        </div>
        <hr className="rule" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
          <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{tier1} foundation items before the frontier</span>
          <button className="btn link" onClick={() => setRoute("methodology")}>How we grade</button>
        </div>
      </section>

      <HomeAtlas items={items} onPick={onPick} setRoute={setRoute} />

      <section style={{ marginBottom: 56 }}>
        <div className="decision-grid">
          <div className="card clickable card-pad" onClick={() => setRoute("playbooks")}>
            <div className="kicker clay" style={{ marginBottom: 10 }}><span className="bullet" />Playbooks</div>
            <h2 className="display" style={{ fontSize: 30, lineHeight: 1.05, margin: "0 0 10px" }}>Start from the problem.</h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-2)", margin: "0 0 18px", fontFamily: "var(--news)" }}>
              ApoB, blood pressure, sleep, menopause, prediabetes, and muscle loss translated into ordered decision paths.
            </p>
            <button className="btn secondary">Open playbooks →</button>
          </div>
          <div className="card clickable card-pad" onClick={() => setRoute("compare")}>
            <div className="kicker clay" style={{ marginBottom: 10 }}><span className="bullet" />Compare</div>
            <h2 className="display" style={{ fontSize: 30, lineHeight: 1.05, margin: "0 0 10px" }}>Choose between two ideas.</h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-2)", margin: "0 0 18px", fontFamily: "var(--news)" }}>
              Put interventions side by side before adding another habit, supplement, test, or medication conversation.
            </p>
            <button className="btn secondary">Compare interventions →</button>
          </div>
          <div className="card clickable card-pad" onClick={() => setRoute("nutrition")}>
            <div className="kicker clay" style={{ marginBottom: 10 }}><span className="bullet" />Nutrition</div>
            <h2 className="display" style={{ fontSize: 30, lineHeight: 1.05, margin: "0 0 10px" }}>Food before capsules.</h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--ink-2)", margin: "0 0 18px", fontFamily: "var(--news)" }}>
              Protein, fiber, Mediterranean diet, ApoB-relevant foods, and the few nutrition supplements worth a second look.
            </p>
            <button className="btn secondary">Open nutrition →</button>
          </div>
        </div>
      </section>

      {/* Featured intervention — editorial highlight, not a personal prescription */}
      {featured && (
        <section style={{ marginBottom: 56 }}>
          <div className="card deep" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 36, padding: "32px 36px", alignItems: "center" }}>
            <div>
              <div className="kicker clay" style={{ marginBottom: 14 }}><span className="bullet" />Highest evidence × effect</div>
              <h2 className="display" style={{ fontSize: 40, lineHeight: 1.05, margin: "0 0 12px", color: "var(--paper)" }}>{featured.name}.</h2>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--ink-4)", margin: "0 0 22px", maxWidth: 580 }}>
                {featured.one}
              </p>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button className="btn clay" onClick={() => onPick(featured.slug)}>Read the protocol →</button>
                <button className="btn ghost" style={{ color: "var(--paper)" }} onClick={() => setRoute("catalogue")}>See all foundation</button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <D_Grade ev={featured.ev} /> <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--paper)", letterSpacing: "0.12em" }}>EVIDENCE {featured.ev}</span>
              </div>
              <div className="numeric" style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-4)", textAlign: "right", lineHeight: 1.7 }}>
                <div>EFFECT <span style={{ color: "var(--paper)", fontSize: 14 }}>{featured.e}</span><span style={{ color: "var(--ink-3)" }}>/10</span></div>
                <div>CERTAIN <span style={{ color: "var(--paper)", fontSize: 14 }}>{featured.c}</span><span style={{ color: "var(--ink-3)" }}>/10</span></div>
                <div>TIER <span style={{ color: "var(--paper)", fontSize: 14 }}>{featured.tier}</span></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* The foundation — ranked, public, no personalization */}
      <section style={{ marginBottom: 56 }}>
        <header style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "baseline", marginBottom: 18, gap: 16 }}>
          <div>
            <div className="kicker" style={{ marginBottom: 6 }}><span className="bullet" />The foundation</div>
            <h2 className="display" style={{ fontSize: 32, margin: 0 }}>Ranked by evidence × effect.</h2>
          </div>
          <button className="btn link" onClick={() => setRoute("catalogue")}>Full catalogue &nbsp;→</button>
        </header>
        <div className="card" style={{ padding: 0 }}>
          <div className="list-row head" style={{ gridTemplateColumns: "26px minmax(0,1.5fr) minmax(0,1fr) 120px 64px 16px" }}>
            <span className="mono">#</span>
            <span className="mono">Intervention</span>
            <span className="mono">Targets</span>
            <span className="mono">Score</span>
            <span className="mono">Evidence</span>
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
            <div className="kicker" style={{ marginBottom: 6 }}><span className="bullet" />By concern</div>
            <h2 className="display" style={{ fontSize: 32, margin: 0 }}>What people worry about.</h2>
          </div>
          <button className="btn link" onClick={() => setRoute("concerns")}>All 12 concerns &nbsp;→</button>
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
                    <div className="kicker" style={{ marginBottom: 6 }}>Strongest evidence</div>
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
          <div className="kicker" style={{ marginBottom: 8 }}><span className="bullet" />How we grade</div>
          <h3 className="display" style={{ fontSize: 24, margin: "0 0 8px" }}>Two numbers, not one.</h3>
          <p style={{ margin: 0, color: "var(--ink-2)", maxWidth: 660, fontSize: 14 }}>
            <strong style={{ color: "var(--ink)" }}>Effectiveness</strong> is how much it helps <em>if</em> it works. <strong style={{ color: "var(--ink)" }}>Certainty</strong> is how sure we are that it does. A high-effect, low-certainty intervention is a bet — useful information, but a different decision than a known-good foundation.
          </p>
        </div>
        <button className="btn secondary" onClick={() => setRoute("methodology")}>Read the methodology &nbsp;→</button>
      </section>
    </div>
  );
}
window.Dashboard = Dashboard;
