// Direction B — Warm Spa Clinic
// Cream/clay palette, Instrument Serif (more delicate), generous radii, organic gradient blobs

const HomeB = () => {
  return (
    <div data-dir="B" style={{ background: "var(--bg)", color: "var(--ink)", fontFamily: "var(--sans)", minHeight: "100%" }}>
      {/* HEADER */}
      <header style={{ padding: "24px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--accent-soft)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", fontFamily: "var(--serif)", fontSize: 24, fontStyle: "italic" }}>t</span>
          <span style={{ fontFamily: "var(--serif)", fontSize: 26, fontStyle: "italic", letterSpacing: "-0.01em" }}>trajectory</span>
        </div>
        <nav style={{ display: "flex", gap: 4, padding: 4, background: "var(--paper)", borderRadius: 999, fontSize: 13 }}>
          {["Start","Der Check","Anliegen","Katalog","Beiträge","Über uns"].map((l, i) => (
            <a key={l} href="#" style={{ padding: "8px 18px", borderRadius: 999, color: i === 0 ? "var(--paper)" : "var(--ink-2)", background: i === 0 ? "var(--accent)" : "transparent", textDecoration: "none", fontWeight: 500 }}>{l}</a>
          ))}
        </nav>
        <a href="#" style={{ padding: "10px 22px", borderRadius: 999, background: "var(--ink)", color: "var(--paper)", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>Check starten</a>
      </header>

      {/* HERO — soft, organic, with floating panel */}
      <section style={{ padding: "60px 48px 100px", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 600, height: 600, color: "var(--accent-2)", opacity: 0.5, pointerEvents: "none" }}>
          <Texture kind="field" style={{ width: "100%", height: "100%" }}/>
        </div>
        <div style={{ position: "absolute", top: 200, left: -100, width: 500, height: 500, color: "var(--warm)", opacity: 0.4, pointerEvents: "none" }}>
          <Texture kind="field" style={{ width: "100%", height: "100%" }}/>
        </div>
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px", background: "var(--paper)", borderRadius: 999, fontSize: 12, color: "var(--ink-2)", marginBottom: 32, border: "1px solid var(--rule)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--score-hi)" }}/>
            89 evidenzbasierte Interventionen · aktualisiert am 7. Mai 2026
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 110, lineHeight: 1, letterSpacing: "-0.02em", fontWeight: 400, margin: 0, fontStyle: "italic", maxWidth: 1000 }}>
            Eine ruhige, durchdachte Anleitung<br/>für ein längeres, besseres Leben.
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--ink-2)", maxWidth: 600, marginTop: 32, fontFamily: "var(--sans)" }}>
            Wir haben die Studien gelesen, damit Sie es nicht müssen. 89 Medikamente, Supplemente und Gewohnheiten — bewertet anhand echter Humanevidenz und sortiert nach dem, was Ihre Zeit wirklich wert ist.
          </p>
          <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
            <a href="#" style={{ padding: "16px 32px", borderRadius: 999, background: "var(--ink)", color: "var(--paper)", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>Check starten →</a>
            <a href="#" style={{ padding: "16px 32px", borderRadius: 999, background: "var(--paper)", color: "var(--ink)", textDecoration: "none", fontSize: 15, fontWeight: 500, border: "1px solid var(--rule)" }}>Fundament ansehen</a>
          </div>

          {/* Floating stat panel */}
          <div style={{ marginTop: 80, padding: 32, background: "var(--paper)", borderRadius: 28, border: "1px solid var(--rule)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, position: "relative", zIndex: 2 }}>
            {[
              { n: "89", l: "Interventionen", s: "Medikamente, Supplemente, Lebensstil" },
              { n: "12", l: "im Fundament", s: "Universell, günstig, gut belegt" },
              { n: "320+", l: "Studien zitiert", s: "Jede verlinkt auf PubMed oder DOI" },
              { n: "12", l: "Anliegen", s: "Krankheitsbilder und Alterungsmechanismen" },
            ].map((s, i) => (
              <div key={i} style={{ borderLeft: i > 0 ? "1px solid var(--rule)" : "none", paddingLeft: i > 0 ? 24 : 0 }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 56, fontStyle: "italic", color: "var(--accent)", lineHeight: 1, marginBottom: 8 }}>{s.n}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.l}</div>
                <div style={{ fontSize: 12, color: "var(--ink-2)" }}>{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PATHS */}
      <section style={{ padding: "0 48px 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="kicker" style={{ marginBottom: 12 }}>Drei Einstiege</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 56, fontWeight: 400, fontStyle: "italic", margin: 0, letterSpacing: "-0.02em" }}>Wo fangen wir an?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { t: "Check starten", s: "Ein paar Fragen zu Ihnen. Heraus kommt eine persönliche Auswahl von 5 bis 12 Maßnahmen, die sich lohnen.", time: "4 Min", cta: "Beginnen", tex: "orbit", color: "var(--accent)" },
              { t: "Nach Anliegen", s: "Zwölf Themen — Herz, Gehirn, Muskeln, Stoffwechsel. Jeweils mit der passenden Evidenz.", time: "Stöbern", cta: "Anliegen erkunden", tex: "topo", color: "var(--warm)" },
              { t: "Das Fundament", s: "Zwölf Maßnahmen für jeden. Stärkste Evidenz, niedrigste Kosten, geringstes Risiko.", time: "12 Punkte", cta: "Fundament sehen", tex: "wave", color: "var(--accent-2)" },
            ].map((c, i) => (
              <a key={i} href="#" style={{ background: "var(--paper)", borderRadius: 28, padding: 32, textDecoration: "none", color: "inherit", border: "1px solid var(--rule)", display: "flex", flexDirection: "column", gap: 20, position: "relative", overflow: "hidden", minHeight: 380 }}>
                <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, color: c.color, opacity: 0.5 }}>
                  <Texture kind={c.tex} style={{ width: "100%", height: "100%" }}/>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", position: "relative" }}>
                  <span className="mono" style={{ color: "var(--ink-3)" }}>0{i+1}</span>
                  <span className="mono" style={{ color: "var(--ink-3)" }}>{c.time}</span>
                </div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 38, fontStyle: "italic", fontWeight: 400, margin: "auto 0 0", letterSpacing: "-0.01em" }}>{c.t}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, margin: 0 }}>{c.s}</p>
                <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 8, color: "var(--ink)", fontSize: 14, fontWeight: 500 }}>{c.cta} <span aria-hidden>→</span></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDATION — soft cards */}
      <section style={{ padding: "100px 48px", background: "var(--bg-2)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 64, marginBottom: 56, alignItems: "end" }}>
            <div>
              <div className="kicker" style={{ marginBottom: 12 }}>Das Fundament</div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 64, fontStyle: "italic", fontWeight: 400, lineHeight: 1, margin: 0, letterSpacing: "-0.02em" }}>Die zwölf Dinge, zuerst.</h2>
            </div>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-2)", margin: 0 }}>
              Universelle Grundlagen mit der stärksten Humanevidenz und dem geringsten Risiko. Die meisten kostenlos oder unter 20 € im Monat. Erst diese — danach kann man über alles Modische reden.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {FOUNDATION.map((it, i) => (
              <article key={it.slug} style={{ background: "var(--paper)", borderRadius: 20, padding: 24, display: "flex", flexDirection: "column", gap: 14, minHeight: 240 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--score-hi)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--score-hi)" }}/> Fundament
                  </span>
                  <span className="mono" style={{ color: "var(--ink-3)" }}>{it.cost}</span>
                </div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 26, fontStyle: "italic", fontWeight: 400, margin: 0, letterSpacing: "-0.01em" }}>{it.name}</h3>
                <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55, margin: 0, flex: 1 }}>{it.one}</p>
                <div style={{ paddingTop: 12, borderTop: "1px solid var(--rule)" }}>
                  <Score effectiveness={it.e} certainty={it.c} type="dots"/>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONCERNS */}
      <section style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="kicker" style={{ marginBottom: 12 }}>Nach Anliegen</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 64, fontStyle: "italic", fontWeight: 400, margin: 0, letterSpacing: "-0.02em" }}>Was beschäftigt Sie am meisten?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {CONCERNS.slice(0, 8).map((c, i) => (
              <a key={c.slug} href="#" style={{ padding: 24, background: "var(--paper)", borderRadius: 20, textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: 10, minHeight: 160 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent)", fontFamily: "var(--serif)", fontSize: 16, fontStyle: "italic", marginBottom: 4 }}>{i+1}</span>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontStyle: "italic", fontWeight: 400, margin: 0, letterSpacing: "-0.01em" }}>{c.name}</h3>
                <p style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55, margin: "auto 0 0" }}>{c.count} Interventionen</p>
              </a>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <a href="#" style={{ color: "var(--accent)", fontSize: 14, fontWeight: 500 }}>Alle zwölf Anliegen →</a>
          </div>
        </div>
      </section>

      {/* QUOTE / NOTE */}
      <section style={{ padding: "100px 48px", background: "var(--accent-soft)", color: "var(--accent)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <div className="kicker" style={{ marginBottom: 24, color: "var(--accent)" }}>Anmerkung der Redaktion</div>
          <p style={{ fontFamily: "var(--serif)", fontSize: 40, lineHeight: 1.2, fontStyle: "italic", fontWeight: 400, margin: 0, color: "var(--ink)", letterSpacing: "-0.02em" }}>
            „Das meiste, was wirkt, ist nicht hip. Schlaf, Krafttraining, Spazierengehen, Freunde, Fisch. Die hippen Moleküle kommen zum Schluss — wenn überhaupt, und dann fast immer unter ärztlicher Aufsicht."
          </p>
          <div style={{ marginTop: 32, fontSize: 13, color: "var(--ink-2)" }}>Aus <em style={{ color: "var(--ink)" }}>Entzündung — der rote Faden</em> · 7. Mai 2026</div>
        </div>
      </section>

      {/* NOTES */}
      <section style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 48 }}>
            <div>
              <div className="kicker" style={{ marginBottom: 12 }}>Aktuelle Beiträge</div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 56, fontStyle: "italic", fontWeight: 400, margin: 0, letterSpacing: "-0.02em" }}>Lang, ausführlich, in Ruhe.</h2>
            </div>
            <a href="#" style={{ color: "var(--accent)", fontSize: 14, fontWeight: 500 }}>Alle Beiträge →</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 24 }}>
            <article style={{ background: "var(--paper)", borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: 220, color: "var(--accent)", position: "relative", background: "var(--accent-soft)" }}>
                <Texture kind="wave" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}/>
              </div>
              <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="mono" style={{ color: "var(--ink-3)" }}>{NOTES[0].date} · Empfehlung</div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 32, fontStyle: "italic", fontWeight: 400, margin: 0, letterSpacing: "-0.02em" }}>{NOTES[0].title}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, margin: 0 }}>{NOTES[0].blurb}</p>
              </div>
            </article>
            {NOTES.slice(1, 3).map((n, i) => (
              <article key={i} style={{ background: "var(--paper)", borderRadius: 24, padding: 28, display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="mono" style={{ color: "var(--ink-3)" }}>{n.date}</div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontStyle: "italic", fontWeight: 400, margin: 0, letterSpacing: "-0.01em" }}>{n.title}</h3>
                <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55, margin: 0 }}>{n.blurb}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <footer style={{ padding: "80px 48px", background: "var(--ink)", color: "var(--paper)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 48 }}>
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 40, fontStyle: "italic", letterSpacing: "-0.02em", marginBottom: 16 }}>trajectory</div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(252,248,241,0.7)", maxWidth: 360, margin: 0 }}>Evidenzbasierte Longevity. Kein Geld aus der Supplement-Industrie, keine Affiliate-Links, kein aufgeregter Ton.</p>
          </div>
          {[
            { h: "Katalog", l: ["Medikamente", "Supplemente", "Lebensstil"] },
            { h: "Methodik",    l: ["So bewerten wir", "Interessenkonflikte", "Aktualisierungen"] },
            { h: "Kontakt",   l: ["Newsletter", "Kontakt", "Über uns"] },
          ].map((g, i) => (
            <div key={i}>
              <div className="kicker" style={{ color: "rgba(252,248,241,0.5)", marginBottom: 16 }}>{g.h}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{g.l.map(x => <a key={x} href="#" style={{ color: "rgba(252,248,241,0.85)", fontSize: 14, textDecoration: "none" }}>{x}</a>)}</div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

window.HomeB = HomeB;
