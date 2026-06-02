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
          {["Accueil","La quête","Préoccupations","Catalogue","Notes","À propos"].map((l, i) => (
            <a key={l} href="#" style={{ padding: "8px 18px", borderRadius: 999, color: i === 0 ? "var(--paper)" : "var(--ink-2)", background: i === 0 ? "var(--accent)" : "transparent", textDecoration: "none", fontWeight: 500 }}>{l}</a>
          ))}
        </nav>
        <a href="#" style={{ padding: "10px 22px", borderRadius: 999, background: "var(--ink)", color: "var(--paper)", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>Commencer la quête</a>
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
            89 interventions classées par niveau de preuve · dernière mise à jour 7 mai 2026
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 110, lineHeight: 1, letterSpacing: "-0.02em", fontWeight: 400, margin: 0, fontStyle: "italic", maxWidth: 1000 }}>
            Un guide calme et réfléchi<br/>pour une vie plus longue et meilleure.
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--ink-2)", maxWidth: 600, marginTop: 32, fontFamily: "var(--sans)" }}>
            Nous avons lu les études pour vous. 89 médicaments, compléments et habitudes — évalués sur de réelles preuves humaines, classés selon ce qui mérite vraiment votre temps.
          </p>
          <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
            <a href="#" style={{ padding: "16px 32px", borderRadius: 999, background: "var(--ink)", color: "var(--paper)", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>Commencer la quête →</a>
            <a href="#" style={{ padding: "16px 32px", borderRadius: 999, background: "var(--paper)", color: "var(--ink)", textDecoration: "none", fontSize: 15, fontWeight: 500, border: "1px solid var(--rule)" }}>Parcourir le socle</a>
          </div>

          {/* Floating stat panel */}
          <div style={{ marginTop: 80, padding: 32, background: "var(--paper)", borderRadius: 28, border: "1px solid var(--rule)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, position: "relative", zIndex: 2 }}>
            {[
              { n: "89", l: "interventions", s: "Médicaments, compléments, mode de vie" },
              { n: "12", l: "fondamentaux", s: "Universels, peu coûteux, haute preuve" },
              { n: "320+", l: "études citées", s: "Chacune liée à PubMed ou DOI" },
              { n: "12", l: "préoccupations", s: "Pathologies et mécanismes du vieillissement" },
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
            <div className="kicker" style={{ marginBottom: 12 }}>Trois entrées</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 56, fontWeight: 400, fontStyle: "italic", margin: 0, letterSpacing: "-0.02em" }}>Par où commencer ?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { t: "Commencer la quête", s: "Quelques questions sur vous. Recevez une sélection personnelle de 5 à 12 éléments qui méritent votre attention.", time: "4 min", cta: "Démarrer", tex: "orbit", color: "var(--accent)" },
              { t: "Par préoccupation", s: "Douze pathologies — cœur, cerveau, muscles, métabolisme. Reliées aux preuves.", time: "Parcourir", cta: "Explorer les préoccupations", tex: "topo", color: "var(--warm)" },
              { t: "Le socle", s: "Douze choses à faire quoi qu'il en soit. Preuves les plus solides, coûts les plus bas, risque le plus faible.", time: "12 éléments", cta: "Voir le socle", tex: "wave", color: "var(--accent-2)" },
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
              <div className="kicker" style={{ marginBottom: 12 }}>Le socle</div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 64, fontStyle: "italic", fontWeight: 400, lineHeight: 1, margin: 0, letterSpacing: "-0.02em" }}>Les douze choses, d'abord.</h2>
            </div>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-2)", margin: 0 }}>
              Les bases universelles, avec les preuves humaines les plus solides et le risque le plus faible. La plupart sont gratuites ou coûtent moins de 20 € par mois. Faites celles-ci avant de dépenser un centime pour quoi que ce soit de tendance.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {FOUNDATION.map((it, i) => (
              <article key={it.slug} style={{ background: "var(--paper)", borderRadius: 20, padding: 24, display: "flex", flexDirection: "column", gap: 14, minHeight: 240 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--score-hi)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--score-hi)" }}/> Socle
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
            <div className="kicker" style={{ marginBottom: 12 }}>Par préoccupation</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 64, fontStyle: "italic", fontWeight: 400, margin: 0, letterSpacing: "-0.02em" }}>Qu'est-ce qui vous préoccupe le plus ?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {CONCERNS.slice(0, 8).map((c, i) => (
              <a key={c.slug} href="#" style={{ padding: 24, background: "var(--paper)", borderRadius: 20, textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: 10, minHeight: 160 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent)", fontFamily: "var(--serif)", fontSize: 16, fontStyle: "italic", marginBottom: 4 }}>{i+1}</span>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontStyle: "italic", fontWeight: 400, margin: 0, letterSpacing: "-0.01em" }}>{c.name}</h3>
                <p style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55, margin: "auto 0 0" }}>{c.count} interventions</p>
              </a>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <a href="#" style={{ color: "var(--accent)", fontSize: 14, fontWeight: 500 }}>Les douze préoccupations →</a>
          </div>
        </div>
      </section>

      {/* QUOTE / NOTE */}
      <section style={{ padding: "100px 48px", background: "var(--accent-soft)", color: "var(--accent)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <div className="kicker" style={{ marginBottom: 24, color: "var(--accent)" }}>Note de l'éditeur</div>
          <p style={{ fontFamily: "var(--serif)", fontSize: 40, lineHeight: 1.2, fontStyle: "italic", fontWeight: 400, margin: 0, color: "var(--ink)", letterSpacing: "-0.02em" }}>
            « La plupart de ce qui fonctionne n'est pas à la mode. Le sommeil, la musculation, la marche, les amis, le poisson. Les molécules à la mode viennent en dernier, si elles viennent — et presque toujours sous surveillance médicale. »
          </p>
          <div style={{ marginTop: 32, fontSize: 13, color: "var(--ink-2)" }}>Extrait de <em style={{ color: "var(--ink)" }}>Inflammation : le fil conducteur</em> · 7 mai 2026</div>
        </div>
      </section>

      {/* NOTES */}
      <section style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 48 }}>
            <div>
              <div className="kicker" style={{ marginBottom: 12 }}>Notes récentes</div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 56, fontStyle: "italic", fontWeight: 400, margin: 0, letterSpacing: "-0.02em" }}>Long format. Regards lents.</h2>
            </div>
            <a href="#" style={{ color: "var(--accent)", fontSize: 14, fontWeight: 500 }}>Toutes les notes →</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 24 }}>
            <article style={{ background: "var(--paper)", borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: 220, color: "var(--accent)", position: "relative", background: "var(--accent-soft)" }}>
                <Texture kind="wave" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}/>
              </div>
              <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="mono" style={{ color: "var(--ink-3)" }}>{NOTES[0].date} · À la une</div>
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
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(252,248,241,0.7)", maxWidth: 360, margin: 0 }}>Longévité fondée sur les preuves. Aucun financement de l'industrie des compléments, aucun lien d'affiliation, aucun ton emphatique.</p>
          </div>
          {[
            { h: "Catalogue", l: ["Médicaments", "Compléments", "Mode de vie"] },
            { h: "Méthode",    l: ["Notre méthode de notation", "Conflits d'intérêts", "Mises à jour"] },
            { h: "Suivre",   l: ["Newsletter", "Contact", "À propos"] },
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
