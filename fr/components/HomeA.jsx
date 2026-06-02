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
          <span className="mono" style={{ color: "var(--ink-3)" }}>Vol. 02 — mai 2026</span>
        </div>
        <nav style={{ display: "flex", gap: 28, fontSize: 13, color: "var(--ink-2)" }}>
          {["La quête","Par préoccupation","Médicaments","Compléments","Mode de vie","Notes","Méthodologie"].map(l => <a key={l} href="#" style={{ color: "inherit", textDecoration: "none" }}>{l}</a>)}
        </nav>
        <div className="mono" style={{ color: "var(--ink-3)" }}>89 interventions</div>
      </header>

      {/* HERO — editorial */}
      <section style={{ padding: "100px 56px 72px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 80, alignItems: "end", borderBottom: "1px solid var(--rule)" }}>
        <div>
          <div className="kicker" style={{ marginBottom: 28 }}>Le numéro décision · N° 02</div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 124, lineHeight: 0.9, letterSpacing: "-0.04em", fontWeight: 400, margin: 0 }}>
            Que devrais-je <em style={{ color: "var(--accent)", fontWeight: 300 }}>vraiment</em> faire ?
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.5, color: "var(--ink-2)", maxWidth: 560, marginTop: 36 }}>
            Quatre-vingt-neuf interventions pour une vie plus longue et meilleure — chacune évaluée à partir de véritables études humaines, puis classée selon l'ampleur de l'effet et notre certitude qu'il soit réel.
          </p>
        </div>
        <div style={{ borderLeft: "1px solid var(--rule)", paddingLeft: 40, color: "var(--ink-2)", fontSize: 13, lineHeight: 1.7 }}>
          <div className="kicker" style={{ marginBottom: 14 }}>Dans ce numéro</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { n: "01", t: "Commencer la quête", s: "Un bref questionnaire renvoie une sélection personnelle." },
              { n: "02", t: "Par préoccupation", s: "Douze pathologies, reliées aux preuves." },
              { n: "03", t: "Le socle", s: "Douze choses à faire d'abord, quel que soit votre profil." },
              { n: "04", t: "Notes récentes", s: "Long format sur ce que nous avons mal compris." },
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
          { n: "I.", t: "Commencer la quête", s: "Répondez à quelques questions sur votre âge, votre corps, votre mode de vie et vos pathologies. Recevez une sélection personnelle, classée par niveau de preuve, de 5 à 12 éléments qui méritent votre attention.", cta: "Démarrer le questionnaire", tex: "orbit" },
          { n: "II.", t: "Par préoccupation", s: "Maladies cardiaques, déclin cognitif, sarcopénie, fragilité — douze conditions reliées aux interventions qui font réellement la différence sur chacune.", cta: "Parcourir par préoccupation", tex: "topo" },
          { n: "III.", t: "Le socle", s: "Douze choses à faire quel que soit votre profil. Preuves les plus solides, risque le plus faible, coût le plus bas — la plupart sont gratuites ou coûtent moins de 20 € par mois.", cta: "Afficher le socle", tex: "wave" },
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
            <div className="kicker" style={{ marginBottom: 16 }}>§ Un</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 56, fontWeight: 400, lineHeight: 1, letterSpacing: "-0.03em", margin: 0 }}>Le <em style={{ color: "var(--accent)", fontWeight: 300 }}>socle</em></h2>
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-2)", margin: 0, alignSelf: "end" }}>
            Douze choses, classées selon l'efficacité combinée à la certitude. Si vous ne devez rien faire d'autre à partir de ce site, faites celles-ci. Le 80/20 de la longévité, étayé soit par de grands essais randomisés, soit par des décennies de données de cohorte — le plus souvent les deux.
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
            <div className="kicker" style={{ marginBottom: 16 }}>§ Deux</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 56, fontWeight: 400, lineHeight: 1, letterSpacing: "-0.03em", margin: 0 }}>Par <em style={{ color: "var(--accent)", fontWeight: 300 }}>préoccupation</em></h2>
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-2)", margin: 0, alignSelf: "end" }}>
            Douze mécanismes du vieillissement et pathologies, accompagnés des interventions qui agissent réellement sur chacun. Avec renvois croisés — la plupart des éléments apparaissent sous plus d'une rubrique.
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
            <div className="kicker" style={{ marginBottom: 16 }}>§ Trois</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 56, fontWeight: 400, lineHeight: 1, letterSpacing: "-0.03em", margin: 0 }}>Notes <em style={{ color: "var(--accent)", fontWeight: 300 }}>récentes</em></h2>
          </div>
          <a href="#" style={{ color: "var(--accent)", fontSize: 13, fontWeight: 500, borderBottom: "1px solid var(--accent)", paddingBottom: 4 }}>Toutes les notes →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 56, borderTop: "1px solid var(--rule)", paddingTop: 40 }}>
          {NOTES.map((n, i) => (
            <article key={i} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="mono" style={{ color: "var(--ink-3)" }}>{n.date} · Essai</div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 400, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{n.title}</h3>
              <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>{n.blurb}</p>
              <a href="#" style={{ color: "var(--accent)", fontSize: 13, marginTop: 4 }}>Lire l'essai →</a>
            </article>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "56px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, color: "var(--ink-2)", fontSize: 13 }}>
        <div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 32, color: "var(--ink)", marginBottom: 12, letterSpacing: "-0.02em" }}>Trajectory</div>
          <p style={{ maxWidth: 360, lineHeight: 1.6, margin: 0 }}>Interventions de longévité fondées sur les preuves. Aucun financement de l'industrie des compléments, aucun lien d'affiliation, aucun ton emphatique.</p>
        </div>
        <div><div className="kicker" style={{ marginBottom: 12 }}>Catalogue</div><div style={{ display: "flex", flexDirection: "column", gap: 6 }}><a href="#" style={{ color: "inherit" }}>Médicaments</a><a href="#" style={{ color: "inherit" }}>Compléments</a><a href="#" style={{ color: "inherit" }}>Mode de vie</a></div></div>
        <div><div className="kicker" style={{ marginBottom: 12 }}>Méthode</div><div style={{ display: "flex", flexDirection: "column", gap: 6 }}><a href="#" style={{ color: "inherit" }}>Notre méthode de notation</a><a href="#" style={{ color: "inherit" }}>Conflits d'intérêts</a><a href="#" style={{ color: "inherit" }}>Mises à jour</a></div></div>
        <div><div className="kicker" style={{ marginBottom: 12 }}>Suivre</div><div style={{ display: "flex", flexDirection: "column", gap: 6 }}><a href="#" style={{ color: "inherit" }}>Newsletter</a><a href="#" style={{ color: "inherit" }}>Contact</a></div></div>
      </footer>
    </div>
  );
};

window.HomeA = HomeA;
