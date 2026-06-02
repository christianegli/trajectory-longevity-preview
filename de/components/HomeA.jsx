// Direction A — Editorial Sage
// Magazine-cadence, Fraunces hero, narrow rules, classic gridded foundation list

const HomeA = () => {
  const [scoreType, setScoreType] = React.useState("bars");
  return (
    <div data-dir="A" style={{ background: "var(--bg)", color: "var(--ink)", fontFamily: "var(--sans)", minHeight: "100%" }}>
      {/* MASTHEAD */}
      <header style={{ borderBottom: "1px solid var(--rule)", padding: "20px 56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 26, letterSpacing: "-0.03em" }}>Trajectory</span>
          <span className="mono" style={{ color: "var(--ink-3)" }}>Ausgabe 02 — Mai 2026</span>
        </div>
        <nav style={{ display: "flex", gap: 28, fontSize: 13, color: "var(--ink-2)" }}>
          {["Der Check","Nach Anliegen","Medikamente","Supplemente","Lebensstil","Beiträge","Methodik"].map(l => <a key={l} href="#" style={{ color: "inherit", textDecoration: "none" }}>{l}</a>)}
        </nav>
        <div className="mono" style={{ color: "var(--ink-3)" }}>89 Interventionen</div>
      </header>

      {/* HERO — editorial */}
      <section style={{ padding: "100px 56px 72px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 80, alignItems: "end", borderBottom: "1px solid var(--rule)" }}>
        <div>
          <div className="kicker" style={{ marginBottom: 28 }}>Die Entscheidungs-Ausgabe · Nr. 02</div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 124, lineHeight: 0.9, letterSpacing: "-0.04em", fontWeight: 400, margin: 0 }}>
            Was sollte ich <em style={{ color: "var(--accent)", fontWeight: 300 }}>wirklich</em> tun?
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.5, color: "var(--ink-2)", maxWidth: 560, marginTop: 36 }}>
            89 Interventionen für ein längeres, besseres Leben — jede anhand echter Humanstudien bewertet und sortiert nach Wirkstärke und Belegdichte.
          </p>
        </div>
        <div style={{ borderLeft: "1px solid var(--rule)", paddingLeft: 40, color: "var(--ink-2)", fontSize: 13, lineHeight: 1.7 }}>
          <div className="kicker" style={{ marginBottom: 14 }}>In dieser Ausgabe</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { n: "01", t: "Check starten", s: "Ein kurzer Fragebogen, am Ende Ihre persönliche Auswahl." },
              { n: "02", t: "Nach Anliegen", s: "Zwölf Krankheitsbilder, je mit der passenden Evidenz." },
              { n: "03", t: "Das Fundament", s: "Zwölf Dinge, die für jeden zuerst kommen." },
              { n: "04", t: "Aktuelle Beiträge", s: "Ausführlich: was wir falsch gemacht haben." },
            ].map(i => (
              <div key={i.n} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 12, padding: "10px 0", borderTop: "1px solid var(--rule)" }}>
                <span className="mono" style={{ color: "var(--ink-3)" }}>{i.n}</span>
                <div><div style={{ color: "var(--ink)", fontWeight: 500, marginBottom: 2 }}>{i.t}</div><div style={{ color: "var(--ink-3)" }}>{i.s}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DECISION ROW */}
      <section style={{ padding: "72px 56px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, borderBottom: "1px solid var(--rule)" }}>
        {[
          { n: "I.", t: "Check starten", s: "Ein paar Fragen zu Alter, Körper, Lebensstil und Vorerkrankungen — heraus kommt eine persönliche, evidenzbasierte Auswahl von 5 bis 12 Maßnahmen, die sich lohnen.", cta: "Zum Fragebogen", tex: "orbit" },
          { n: "II.", t: "Nach Anliegen", s: "Herzkrankheiten, kognitiver Abbau, Sarkopenie, Gebrechlichkeit — zwölf Themen, jeweils mit den Interventionen, die wirklich etwas bringen.", cta: "Anliegen durchstöbern", tex: "topo" },
          { n: "III.", t: "Das Fundament", s: "Zwölf Maßnahmen, die für jeden gelten. Stärkste Evidenz, geringstes Risiko, niedrigste Kosten — die meisten gratis oder unter 20 € im Monat.", cta: "Fundament ansehen", tex: "wave" },
        ].map((c, i) => (
          <div key={i} style={{ padding: "0 32px", borderRight: i < 2 ? "1px solid var(--rule)" : "none", display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ position: "relative", height: 140, color: "var(--accent)", marginBottom: 4 }}>
              <Texture kind={c.tex} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}/>
            </div>
            <div className="mono" style={{ color: "var(--accent)" }}>{c.n}</div>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 400, margin: 0, letterSpacing: "-0.02em" }}>{c.t}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-2)", margin: 0 }}>{c.s}</p>
            <a href="#" style={{ marginTop: "auto", color: "var(--accent)", fontSize: 13, fontWeight: 500, borderBottom: "1px solid var(--accent)", paddingBottom: 4, alignSelf: "flex-start" }}>{c.cta} →</a>
          </div>
        ))}
      </section>

      {/* FOUNDATION STACK */}
      <section style={{ padding: "96px 56px", borderBottom: "1px solid var(--rule)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, marginBottom: 56 }}>
          <div>
            <div className="kicker" style={{ marginBottom: 16 }}>§ Eins</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 56, fontWeight: 400, lineHeight: 1, letterSpacing: "-0.03em", margin: 0 }}>Das <em style={{ color: "var(--accent)", fontWeight: 300 }}>Fundament</em></h2>
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-2)", margin: 0, alignSelf: "end" }}>
            Zwölf Maßnahmen, sortiert nach Wirkung und Gewissheit kombiniert. Wenn Sie sonst nichts von dieser Seite umsetzen — dann zumindest diese. Das 80/20 der Longevity, gestützt auf große randomisierte Studien oder jahrzehntelange Kohortendaten. Meistens beides.
          </p>
        </div>
        <div style={{ borderTop: "1px solid var(--rule)" }}>
          {FOUNDATION.map((it, i) => (
            <article key={it.slug} style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 100px 140px", gap: 24, padding: "22px 0", borderBottom: "1px solid var(--rule)", alignItems: "center" }}>
              <span className="mono" style={{ color: "var(--ink-3)" }}>{String(i+1).padStart(2,"0")}</span>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 24, fontWeight: 400, margin: 0, letterSpacing: "-0.01em" }}>{it.name}</h3>
              <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5, margin: 0 }}>{it.one}</p>
              <span className="mono" style={{ color: "var(--ink-3)" }}>{it.cost}</span>
              <Score effectiveness={it.e} certainty={it.c} type={scoreType}/>
            </article>
          ))}
        </div>
      </section>

      {/* BY CONCERN */}
      <section style={{ padding: "96px 56px", background: "var(--paper)", borderBottom: "1px solid var(--rule)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, marginBottom: 56 }}>
          <div>
            <div className="kicker" style={{ marginBottom: 16 }}>§ Zwei</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 56, fontWeight: 400, lineHeight: 1, letterSpacing: "-0.03em", margin: 0 }}>Nach <em style={{ color: "var(--accent)", fontWeight: 300 }}>Anliegen</em></h2>
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-2)", margin: 0, alignSelf: "end" }}>
            Zwölf Alterungsmechanismen und Krankheitsbilder, jeweils mit den Interventionen, die wirklich daran etwas ändern. Querverlinkt — die meisten Punkte tauchen in mehr als einer Rubrik auf.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, borderTop: "1px solid var(--rule)", borderLeft: "1px solid var(--rule)" }}>
          {CONCERNS.map((c, i) => (
            <a key={c.slug} href="#" style={{ padding: "28px 24px", borderRight: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", display: "flex", flexDirection: "column", gap: 10, color: "inherit", textDecoration: "none", minHeight: 160, position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 400, margin: 0, letterSpacing: "-0.01em" }}>{c.name}</h3>
                <span className="mono" style={{ color: "var(--ink-3)" }}>{c.count}</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55, margin: 0 }}>{c.line}</p>
            </a>
          ))}
        </div>
      </section>

      {/* NOTES */}
      <section style={{ padding: "96px 56px", borderBottom: "1px solid var(--rule)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 56 }}>
          <div>
            <div className="kicker" style={{ marginBottom: 16 }}>§ Drei</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 56, fontWeight: 400, lineHeight: 1, letterSpacing: "-0.03em", margin: 0 }}>Aktuelle <em style={{ color: "var(--accent)", fontWeight: 300 }}>Beiträge</em></h2>
          </div>
          <a href="#" style={{ color: "var(--accent)", fontSize: 13, fontWeight: 500, borderBottom: "1px solid var(--accent)", paddingBottom: 4 }}>Alle Beiträge →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 56, borderTop: "1px solid var(--rule)", paddingTop: 40 }}>
          {NOTES.map((n, i) => (
            <article key={i} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="mono" style={{ color: "var(--ink-3)" }}>{n.date} · Essay</div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 400, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{n.title}</h3>
              <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>{n.blurb}</p>
              <a href="#" style={{ color: "var(--accent)", fontSize: 13, marginTop: 4 }}>Weiterlesen →</a>
            </article>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "56px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, color: "var(--ink-2)", fontSize: 13 }}>
        <div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 32, color: "var(--ink)", marginBottom: 12, letterSpacing: "-0.02em" }}>Trajectory</div>
          <p style={{ maxWidth: 360, lineHeight: 1.6, margin: 0 }}>Evidenzbasierte Longevity-Interventionen. Kein Geld aus der Supplement-Industrie, keine Affiliate-Links, kein aufgeregter Ton.</p>
        </div>
        <div><div className="kicker" style={{ marginBottom: 12 }}>Katalog</div><div style={{ display: "flex", flexDirection: "column", gap: 6 }}><a href="#" style={{ color: "inherit" }}>Medikamente</a><a href="#" style={{ color: "inherit" }}>Supplemente</a><a href="#" style={{ color: "inherit" }}>Lebensstil</a></div></div>
        <div><div className="kicker" style={{ marginBottom: 12 }}>Methodik</div><div style={{ display: "flex", flexDirection: "column", gap: 6 }}><a href="#" style={{ color: "inherit" }}>So bewerten wir</a><a href="#" style={{ color: "inherit" }}>Interessenkonflikte</a><a href="#" style={{ color: "inherit" }}>Aktualisierungen</a></div></div>
        <div><div className="kicker" style={{ marginBottom: 12 }}>Kontakt</div><div style={{ display: "flex", flexDirection: "column", gap: 6 }}><a href="#" style={{ color: "inherit" }}>Newsletter</a><a href="#" style={{ color: "inherit" }}>Kontakt</a></div></div>
      </footer>
    </div>
  );
};

window.HomeA = HomeA;
