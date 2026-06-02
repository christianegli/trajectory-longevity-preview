// Direction C — Deep Forest Clinical
// Off-white paper, deep forest accents, generous whitespace, Spectral serif, sharp lines, near-zero radius

const HomeC = () => {
  return (
    <div data-dir="C" style={{ background: "var(--bg)", color: "var(--ink)", fontFamily: "var(--sans)", minHeight: "100%", fontSize: 14 }}>
      {/* MASTHEAD — minimal, two lines */}
      <header style={{ borderBottom: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 64px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--rule)" }}>
          <span className="mono" style={{ fontSize: 10 }}>Trajectory · Evidence-graded longevity · Updated 7 May 2026</span>
          <span className="mono" style={{ fontSize: 10 }}>89 interventions · 320+ studies · No advertising</span>
        </div>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 32, letterSpacing: "-0.02em" }}>Trajectory</div>
          <nav style={{ display: "flex", gap: 32, fontSize: 13, color: "var(--ink-2)" }}>
            {["The quest","By concern","Medications","Supplements","Lifestyle","Notes","Methodology","About"].map(l => <a key={l} href="#" style={{ color: "inherit", textDecoration: "none" }}>{l}</a>)}
          </nav>
        </div>
      </header>

      {/* HERO — quiet, two-column with side-rail meta */}
      <section style={{ borderBottom: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 64px", display: "grid", gridTemplateColumns: "100px 1fr 320px", gap: 64 }}>
          <div className="mono" style={{ color: "var(--ink-3)", fontSize: 10, lineHeight: 1.8 }}>
            <div>FILE</div>
            <div style={{ color: "var(--ink)", marginTop: 4 }}>00 · INDEX</div>
            <div style={{ marginTop: 24 }}>READING</div>
            <div style={{ color: "var(--ink)", marginTop: 4 }}>14 MIN</div>
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: 96, lineHeight: 0.95, letterSpacing: "-0.025em", fontWeight: 400, margin: 0 }}>
              Eighty-nine ways<br/>to live longer,<br/>graded honestly.
            </h1>
            <p style={{ fontFamily: "var(--serif)", fontSize: 22, lineHeight: 1.4, color: "var(--ink-2)", marginTop: 40, maxWidth: 640, fontStyle: "italic" }}>
              Most of what works is unfashionable: sleep, walking, lifting, fish, friends. The fashionable molecules come last, if at all. We've read the studies so you don't have to.
            </p>
            <div style={{ marginTop: 56, display: "flex", gap: 32, alignItems: "center", paddingTop: 24, borderTop: "1px solid var(--rule)" }}>
              <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 22px", background: "var(--ink)", color: "var(--paper)", fontSize: 13, fontWeight: 500, textDecoration: "none", letterSpacing: "0.02em" }}>Take the quest <span aria-hidden>→</span></a>
              <a href="#" style={{ fontSize: 13, color: "var(--ink)", borderBottom: "1px solid var(--ink)", paddingBottom: 4 }}>Browse the foundation</a>
              <a href="#" style={{ fontSize: 13, color: "var(--ink-2)" }}>How we score →</a>
            </div>
          </div>
          <aside style={{ borderLeft: "1px solid var(--rule)", paddingLeft: 32 }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginBottom: 16 }}>The catalogue, at a glance</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { l: "Foundation, Tier 1", n: "12", s: "Universal basics. Strongest evidence, lowest risk." },
                { l: "Targeted, Tier 2", n: "56", s: "For specific conditions or aging mechanisms." },
                { l: "Frontier, Tier 3", n: "5", s: "Promising, but human evidence still pending." },
              ].map((t, i) => (
                <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid var(--rule)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{t.l}</span>
                    <span style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--accent)" }}>{t.n}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 4 }}>{t.s}</div>
                </div>
              ))}
            </div>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 24, lineHeight: 1.7 }}>
              <div>16 Medications</div>
              <div>32 Supplements</div>
              <div>41 Lifestyle</div>
            </div>
          </aside>
        </div>
      </section>

      {/* PATHS — quiet rows */}
      <section style={{ borderBottom: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 64px" }}>
          <div className="mono" style={{ color: "var(--ink-3)", fontSize: 10, marginBottom: 32 }}>§ I — How to use this site</div>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr 1fr", gap: 0 }}>
            <div></div>
            {[
              { n: "001", t: "Take the quest", s: "Answer a brief questionnaire about your age, body, lifestyle and conditions. Get a personal shortlist of five to twelve interventions worth your time, ranked.", time: "4 min", cta: "Begin" },
              { n: "002", t: "Browse by concern", s: "Twelve conditions and aging mechanisms, each mapped to the interventions that move it. Most things appear under more than one heading.", time: "Browse", cta: "Concerns" },
              { n: "003", t: "Read the foundation", s: "Twelve things to do regardless of who you are. Strongest human evidence, lowest risk, lowest cost. Most are free or under twenty dollars a month.", time: "12 items", cta: "Stack" },
            ].map((c, i) => (
              <a key={i} href="#" style={{ padding: "32px 32px 32px 0", borderRight: i < 2 ? "1px solid var(--rule)" : "none", paddingLeft: i > 0 ? 32 : 0, color: "inherit", textDecoration: "none", display: "flex", flexDirection: "column", gap: 14, minHeight: 280 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="mono" style={{ color: "var(--accent)" }}>{c.n}</span>
                  <span className="mono" style={{ color: "var(--ink-3)" }}>{c.time}</span>
                </div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 400, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.05 }}>{c.t}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>{c.s}</p>
                <span style={{ marginTop: "auto", fontSize: 12, color: "var(--accent)", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>{c.cta} →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SCATTER VIEW + TABLE */}
      <section style={{ borderBottom: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 64px" }}>
          <div className="mono" style={{ color: "var(--ink-3)", fontSize: 10, marginBottom: 32 }}>§ II — The Foundation Stack</div>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 64, marginBottom: 64 }}>
            <div></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "end" }}>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 64, fontWeight: 400, lineHeight: 1, margin: 0, letterSpacing: "-0.025em" }}>The twelve things,<br/>before anything else.</h2>
              <p style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>Universal basics with the strongest human evidence and lowest risk. Plotted by combined score (effectiveness × certainty), then listed below in detail.</p>
            </div>
          </div>

          {/* Scatter chart */}
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 64, marginBottom: 80 }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", lineHeight: 1.7 }}>
              <div>FIG. 01</div>
              <div style={{ color: "var(--ink-2)", marginTop: 4, textTransform: "none", letterSpacing: 0 }}>Effectiveness × Certainty for the foundation stack.</div>
            </div>
            <div style={{ position: "relative", height: 380, padding: "20px 40px 40px 40px", border: "1px solid var(--rule)", background: "var(--paper)" }}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: "20px 40px 40px 40px", width: "calc(100% - 80px)", height: "calc(100% - 60px)" }}>
                {[2,4,6,8].map(g => (
                  <g key={g}>
                    <line x1={g*10} y1="0" x2={g*10} y2="100" stroke="var(--rule)" strokeWidth="0.3"/>
                    <line x1="0" y1={100-g*10} x2="100" y2={100-g*10} stroke="var(--rule)" strokeWidth="0.3"/>
                  </g>
                ))}
                {FOUNDATION.map(it => (
                  <g key={it.slug}>
                    <circle cx={it.c*10} cy={100 - it.e*10} r="1.2" fill="var(--accent)"/>
                  </g>
                ))}
              </svg>
              {FOUNDATION.map(it => (
                <div key={it.slug} style={{ position: "absolute", left: `calc(40px + ${it.c*10}% - ${it.c*4}px)`, top: `calc(20px + ${(100 - it.e*10)}% - ${(100-it.e*10)*0.6/100*380}px)`, transform: "translate(8px, -50%)", fontSize: 10, color: "var(--ink-2)", fontFamily: "var(--mono)", letterSpacing: "0.02em", whiteSpace: "nowrap", pointerEvents: "none" }}>
                  {it.name}
                </div>
              ))}
              <div className="mono" style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", color: "var(--ink-3)", fontSize: 9 }}>CERTAINTY · 0 — 10 →</div>
              <div className="mono" style={{ position: "absolute", left: 12, top: "50%", transform: "translate(-50%, -50%) rotate(-90deg)", color: "var(--ink-3)", fontSize: 9, transformOrigin: "center" }}>EFFECTIVENESS</div>
            </div>
          </div>

          {/* Table-style list */}
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 64 }}>
            <div></div>
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "32px 1.4fr 2fr 100px 100px 80px", gap: 16, padding: "12px 0", borderTop: "1px solid var(--ink)", borderBottom: "1px solid var(--rule)", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-2)" }}>
                <span>№</span><span>Intervention</span><span>One line</span><span>Cost</span><span>Effect / Cert.</span><span>Ev.</span>
              </div>
              {FOUNDATION.map((it, i) => (
                <a key={it.slug} href="#" style={{ display: "grid", gridTemplateColumns: "32px 1.4fr 2fr 100px 100px 80px", gap: 16, padding: "20px 0", borderBottom: "1px solid var(--rule)", color: "inherit", textDecoration: "none", alignItems: "center" }}>
                  <span className="mono" style={{ color: "var(--ink-3)" }}>{String(i+1).padStart(2,"0")}</span>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 20, letterSpacing: "-0.01em" }}>{it.name}</span>
                  <span style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>{it.one}</span>
                  <span className="mono" style={{ color: "var(--ink-3)" }}>{it.cost}</span>
                  <span style={{ display: "flex", gap: 6, fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink)" }}>
                    <span>{it.e}</span><span style={{ color: "var(--ink-3)" }}>·</span><span>{it.c}</span>
                  </span>
                  <span className="mono" style={{ color: "var(--accent)" }}>Ev {it.ev}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONCERNS — typographic list */}
      <section style={{ borderBottom: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 64px" }}>
          <div className="mono" style={{ color: "var(--ink-3)", fontSize: 10, marginBottom: 32 }}>§ III — By concern</div>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: 64 }}>
            <div></div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 64, fontWeight: 400, lineHeight: 1, letterSpacing: "-0.025em", margin: 0 }}>Twelve concerns,<br/>and what touches them.</h2>
            <p style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6, alignSelf: "end", margin: 0 }}>Aging mechanisms and named conditions. Each links to interventions with meaningful, evidence-graded effects on that specific outcome.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 64, marginTop: 64 }}>
            <div></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0 }}>
              {CONCERNS.map((c, i) => (
                <a key={c.slug} href="#" style={{ padding: "28px 32px 28px 0", borderTop: i < 2 ? "1px solid var(--ink)" : "1px solid var(--rule)", borderRight: i % 2 === 0 ? "1px solid var(--rule)" : "none", paddingLeft: i % 2 === 1 ? 32 : 0, color: "inherit", textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 24 }}>
                  <div>
                    <h3 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 400, margin: 0, letterSpacing: "-0.02em", marginBottom: 8 }}>{c.name}</h3>
                    <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55, margin: 0 }}>{c.line}</p>
                  </div>
                  <span className="mono" style={{ color: "var(--accent)", flexShrink: 0 }}>{c.count} ITEMS</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NOTES */}
      <section style={{ borderBottom: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 64px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: 64, alignItems: "end", marginBottom: 56 }}>
            <div className="mono" style={{ color: "var(--ink-3)", fontSize: 10 }}>§ IV — Recent notes</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 64, fontWeight: 400, lineHeight: 1, letterSpacing: "-0.025em", margin: 0 }}>Long-form. <em style={{ color: "var(--accent)" }}>Slowly.</em></h2>
            <a href="#" style={{ alignSelf: "end", color: "var(--accent)", fontSize: 13, fontWeight: 500, borderBottom: "1px solid var(--accent)", paddingBottom: 4, justifySelf: "end" }}>All notes →</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 64 }}>
            <div></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0 }}>
              {NOTES.map((n, i) => (
                <article key={i} style={{ padding: "32px 32px 32px 0", borderTop: i < 2 ? "1px solid var(--ink)" : "1px solid var(--rule)", borderRight: i % 2 === 0 ? "1px solid var(--rule)" : "none", paddingLeft: i % 2 === 1 ? 32 : 0 }}>
                  <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 12 }}>{n.date} · Essay № {String(i+1).padStart(2,"0")}</div>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 400, margin: 0, letterSpacing: "-0.02em", marginBottom: 12, lineHeight: 1.15 }}>{n.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>{n.blurb}</p>
                  <a href="#" style={{ display: "inline-block", marginTop: 16, fontSize: 12, color: "var(--accent)", letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "var(--mono)" }}>Read essay →</a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--accent)", color: "var(--paper)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 64px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", gap: 48 }}>
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 40, letterSpacing: "-0.02em", marginBottom: 16 }}>Trajectory</div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", maxWidth: 320, margin: 0 }}>Evidence-graded longevity interventions. No supplement industry money, no affiliate links, no breathless tone.</p>
          </div>
          {[
            { h: "Catalogue", l: ["Medications", "Supplements", "Lifestyle", "All 89 items"] },
            { h: "By concern", l: ["Heart", "Brain", "Metabolic", "All twelve"] },
            { h: "Method", l: ["How we score", "Conflicts", "Updates", "Sources"] },
            { h: "Connect", l: ["Newsletter", "Contact", "About", "Notes"] },
          ].map((g, i) => (
            <div key={i}>
              <div className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>{g.h}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{g.l.map(x => <a key={x} href="#" style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, textDecoration: "none" }}>{x}</a>)}</div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          <div className="mono" style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 64px", fontSize: 10, color: "rgba(255,255,255,0.5)", display: "flex", justifyContent: "space-between" }}>
            <span>© Origami Ventures GmbH · 2026</span>
            <span>Set in Spectral & Inter</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

window.HomeC = HomeC;
