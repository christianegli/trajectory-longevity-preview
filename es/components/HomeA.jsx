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
          <span className="mono" style={{ color: "var(--ink-3)" }}>Vol. 02 — mayo de 2026</span>
        </div>
        <nav style={{ display: "flex", gap: 28, fontSize: 13, color: "var(--ink-2)" }}>
          {["La búsqueda","Por inquietud","Medicamentos","Suplementos","Estilo de vida","Notas","Metodología"].map(l => <a key={l} href="#" style={{ color: "inherit", textDecoration: "none" }}>{l}</a>)}
        </nav>
        <div className="mono" style={{ color: "var(--ink-3)" }}>89 intervenciones</div>
      </header>

      {/* HERO — editorial */}
      <section style={{ padding: "100px 56px 72px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 80, alignItems: "end", borderBottom: "1px solid var(--rule)" }}>
        <div>
          <div className="kicker" style={{ marginBottom: 28 }}>El número decisión · N.º 02</div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 124, lineHeight: 0.9, letterSpacing: "-0.04em", fontWeight: 400, margin: 0 }}>
            ¿Qué debería hacer <em style={{ color: "var(--accent)", fontWeight: 300 }}>realmente</em>?
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.5, color: "var(--ink-2)", maxWidth: 560, marginTop: 36 }}>
            Ochenta y nueve intervenciones para una vida más larga y mejor, cada una evaluada con estudios humanos reales y ordenada según la magnitud del efecto y la certeza de que sea real.
          </p>
        </div>
        <div style={{ borderLeft: "1px solid var(--rule)", paddingLeft: 40, color: "var(--ink-2)", fontSize: 13, lineHeight: 1.7 }}>
          <div className="kicker" style={{ marginBottom: 14 }}>En este número</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { n: "01", t: "Empezar la búsqueda", s: "Un breve cuestionario devuelve una selección personal." },
              { n: "02", t: "Por inquietud", s: "Doce afecciones, vinculadas a la evidencia." },
              { n: "03", t: "Los cimientos", s: "Doce cosas que hacer primero, sea cual sea su perfil." },
              { n: "04", t: "Notas recientes", s: "Formato largo sobre aquello en lo que nos hemos equivocado." },
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
          { n: "I.", t: "Empezar la búsqueda", s: "Responda a unas preguntas sobre su edad, su cuerpo, su estilo de vida y sus afecciones. Recibirá una selección personal, clasificada por nivel de evidencia, de entre 5 y 12 elementos que merecen su atención.", cta: "Empezar el cuestionario", tex: "orbit" },
          { n: "II.", t: "Por inquietud", s: "Enfermedades cardíacas, deterioro cognitivo, sarcopenia, fragilidad: doce afecciones vinculadas a las intervenciones que realmente marcan la diferencia en cada una.", cta: "Explorar por inquietud", tex: "topo" },
          { n: "III.", t: "Los cimientos", s: "Doce cosas que conviene hacer sea cual sea su perfil. Evidencia más sólida, menor riesgo, menor coste: la mayoría son gratuitas o cuestan menos de 20 € al mes.", cta: "Mostrar los cimientos", tex: "wave" },
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
            <div className="kicker" style={{ marginBottom: 16 }}>§ Uno</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 56, fontWeight: 400, lineHeight: 1, letterSpacing: "-0.03em", margin: 0 }}>Los <em style={{ color: "var(--accent)", fontWeight: 300 }}>cimientos</em></h2>
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-2)", margin: 0, alignSelf: "end" }}>
            Doce cosas, ordenadas por eficacia y certeza combinadas. Si no hace nada más a partir de esta web, haga estas. El 80/20 de la longevidad, respaldado por grandes ensayos aleatorizados o décadas de datos de cohortes — habitualmente por ambos.
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
            <div className="kicker" style={{ marginBottom: 16 }}>§ Dos</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 56, fontWeight: 400, lineHeight: 1, letterSpacing: "-0.03em", margin: 0 }}>Por <em style={{ color: "var(--accent)", fontWeight: 300 }}>inquietud</em></h2>
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-2)", margin: 0, alignSelf: "end" }}>
            Doce mecanismos del envejecimiento y afecciones, con las intervenciones que actúan de forma significativa sobre cada uno. Con referencias cruzadas: la mayoría aparece en más de un epígrafe.
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
            <div className="kicker" style={{ marginBottom: 16 }}>§ Tres</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 56, fontWeight: 400, lineHeight: 1, letterSpacing: "-0.03em", margin: 0 }}>Notas <em style={{ color: "var(--accent)", fontWeight: 300 }}>recientes</em></h2>
          </div>
          <a href="#" style={{ color: "var(--accent)", fontSize: 13, fontWeight: 500, borderBottom: "1px solid var(--accent)", paddingBottom: 4 }}>Todas las notas →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 56, borderTop: "1px solid var(--rule)", paddingTop: 40 }}>
          {NOTES.map((n, i) => (
            <article key={i} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="mono" style={{ color: "var(--ink-3)" }}>{n.date} · Ensayo</div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 30, fontWeight: 400, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{n.title}</h3>
              <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>{n.blurb}</p>
              <a href="#" style={{ color: "var(--accent)", fontSize: 13, marginTop: 4 }}>Leer el ensayo →</a>
            </article>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "56px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, color: "var(--ink-2)", fontSize: 13 }}>
        <div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 32, color: "var(--ink)", marginBottom: 12, letterSpacing: "-0.02em" }}>Trajectory</div>
          <p style={{ maxWidth: 360, lineHeight: 1.6, margin: 0 }}>Intervenciones de longevidad basadas en la evidencia. Sin dinero de la industria de los suplementos, sin enlaces de afiliación, sin tono efectista.</p>
        </div>
        <div><div className="kicker" style={{ marginBottom: 12 }}>Catálogo</div><div style={{ display: "flex", flexDirection: "column", gap: 6 }}><a href="#" style={{ color: "inherit" }}>Medicamentos</a><a href="#" style={{ color: "inherit" }}>Suplementos</a><a href="#" style={{ color: "inherit" }}>Estilo de vida</a></div></div>
        <div><div className="kicker" style={{ marginBottom: 12 }}>Método</div><div style={{ display: "flex", flexDirection: "column", gap: 6 }}><a href="#" style={{ color: "inherit" }}>Cómo puntuamos</a><a href="#" style={{ color: "inherit" }}>Conflictos de interés</a><a href="#" style={{ color: "inherit" }}>Actualizaciones</a></div></div>
        <div><div className="kicker" style={{ marginBottom: 12 }}>Contacto</div><div style={{ display: "flex", flexDirection: "column", gap: 6 }}><a href="#" style={{ color: "inherit" }}>Newsletter</a><a href="#" style={{ color: "inherit" }}>Contacto</a></div></div>
      </footer>
    </div>
  );
};

window.HomeA = HomeA;
