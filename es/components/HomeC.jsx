// Direction C — Deep Forest Clinical
// Off-white paper, deep forest accents, generous whitespace, Spectral serif, sharp lines, near-zero radius

const HomeC = () => {
  return (
    <div data-dir="C" style={{ background: "var(--bg)", color: "var(--ink)", fontFamily: "var(--sans)", minHeight: "100%", fontSize: 14 }}>
      {/* MASTHEAD — minimal, two lines */}
      <header style={{ borderBottom: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 64px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--rule)" }}>
          <span className="mono" style={{ fontSize: 10 }}>Trajectory · Longevidad basada en la evidencia · Actualizado el 7 de mayo de 2026</span>
          <span className="mono" style={{ fontSize: 10 }}>89 intervenciones · 320+ estudios · Sin publicidad</span>
        </div>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 32, letterSpacing: "-0.02em" }}>Trajectory</div>
          <nav style={{ display: "flex", gap: 32, fontSize: 13, color: "var(--ink-2)" }}>
            {["La búsqueda","Por inquietud","Medicamentos","Suplementos","Estilo de vida","Notas","Metodología","Sobre nosotros"].map(l => <a key={l} href="#" style={{ color: "inherit", textDecoration: "none" }}>{l}</a>)}
          </nav>
        </div>
      </header>

      {/* HERO — quiet, two-column with side-rail meta */}
      <section style={{ borderBottom: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 64px", display: "grid", gridTemplateColumns: "100px 1fr 320px", gap: 64 }}>
          <div className="mono" style={{ color: "var(--ink-3)", fontSize: 10, lineHeight: 1.8 }}>
            <div>ARCHIVO</div>
            <div style={{ color: "var(--ink)", marginTop: 4 }}>00 · ÍNDICE</div>
            <div style={{ marginTop: 24 }}>LECTURA</div>
            <div style={{ color: "var(--ink)", marginTop: 4 }}>14 MIN</div>
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: 96, lineHeight: 0.95, letterSpacing: "-0.025em", fontWeight: 400, margin: 0 }}>
              Ochenta y nueve formas<br/>de vivir más,<br/>evaluadas con honestidad.
            </h1>
            <p style={{ fontFamily: "var(--serif)", fontSize: 22, lineHeight: 1.4, color: "var(--ink-2)", marginTop: 40, maxWidth: 640, fontStyle: "italic" }}>
              La mayor parte de lo que funciona no está de moda: sueño, caminar, levantar pesas, pescado, amistades. Las moléculas de moda llegan al final, si es que llegan. Hemos leído los estudios para que usted no tenga que hacerlo.
            </p>
            <div style={{ marginTop: 56, display: "flex", gap: 32, alignItems: "center", paddingTop: 24, borderTop: "1px solid var(--rule)" }}>
              <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 22px", background: "var(--ink)", color: "var(--paper)", fontSize: 13, fontWeight: 500, textDecoration: "none", letterSpacing: "0.02em" }}>Empezar la búsqueda <span aria-hidden>→</span></a>
              <a href="#" style={{ fontSize: 13, color: "var(--ink)", borderBottom: "1px solid var(--ink)", paddingBottom: 4 }}>Ver los cimientos</a>
              <a href="#" style={{ fontSize: 13, color: "var(--ink-2)" }}>Cómo puntuamos →</a>
            </div>
          </div>
          <aside style={{ borderLeft: "1px solid var(--rule)", paddingLeft: 32 }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginBottom: 16 }}>El catálogo, de un vistazo</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { l: "Cimientos, Nivel 1", n: "12", s: "Bases universales. Evidencia más sólida, menor riesgo." },
                { l: "Dirigido, Nivel 2", n: "56", s: "Para afecciones o mecanismos del envejecimiento específicos." },
                { l: "Frontera, Nivel 3", n: "5", s: "Prometedor, pero la evidencia humana sigue pendiente." },
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
              <div>16 medicamentos</div>
              <div>32 suplementos</div>
              <div>41 estilo de vida</div>
            </div>
          </aside>
        </div>
      </section>

      {/* PATHS — quiet rows */}
      <section style={{ borderBottom: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 64px" }}>
          <div className="mono" style={{ color: "var(--ink-3)", fontSize: 10, marginBottom: 32 }}>§ I — Cómo usar esta web</div>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr 1fr", gap: 0 }}>
            <div></div>
            {[
              { n: "001", t: "Empezar la búsqueda", s: "Responda a un breve cuestionario sobre su edad, su cuerpo, su estilo de vida y sus afecciones. Recibirá una selección personal y ordenada de entre cinco y doce intervenciones que merecen su tiempo.", time: "4 min", cta: "Empezar" },
              { n: "002", t: "Explorar por inquietud", s: "Doce afecciones y mecanismos del envejecimiento, cada uno vinculado a las intervenciones que actúan sobre él. La mayoría de los elementos aparece en más de un epígrafe.", time: "Explorar", cta: "Inquietudes" },
              { n: "003", t: "Leer los cimientos", s: "Doce cosas que conviene hacer sea cual sea su perfil. Evidencia humana más sólida, menor riesgo, menor coste. La mayoría son gratuitas o cuestan menos de 20 € al mes.", time: "12 elementos", cta: "Cimientos" },
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
          <div className="mono" style={{ color: "var(--ink-3)", fontSize: 10, marginBottom: 32 }}>§ II — Los cimientos</div>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 64, marginBottom: 64 }}>
            <div></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "end" }}>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 64, fontWeight: 400, lineHeight: 1, margin: 0, letterSpacing: "-0.025em" }}>Las doce cosas,<br/>antes que nada.</h2>
              <p style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>Bases universales con la evidencia humana más sólida y el menor riesgo. Representadas según puntuación combinada (eficacia × certeza) y detalladas a continuación.</p>
            </div>
          </div>

          {/* Scatter chart */}
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 64, marginBottom: 80 }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", lineHeight: 1.7 }}>
              <div>FIG. 01</div>
              <div style={{ color: "var(--ink-2)", marginTop: 4, textTransform: "none", letterSpacing: 0 }}>Eficacia × certeza para los cimientos.</div>
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
              <div className="mono" style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", color: "var(--ink-3)", fontSize: 9 }}>CERTEZA · 0 — 10 →</div>
              <div className="mono" style={{ position: "absolute", left: 12, top: "50%", transform: "translate(-50%, -50%) rotate(-90deg)", color: "var(--ink-3)", fontSize: 9, transformOrigin: "center" }}>EFICACIA</div>
            </div>
          </div>

          {/* Table-style list */}
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 64 }}>
            <div></div>
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "32px 1.4fr 2fr 100px 100px 80px", gap: 16, padding: "12px 0", borderTop: "1px solid var(--ink)", borderBottom: "1px solid var(--rule)", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-2)" }}>
                <span>N.º</span><span>Intervención</span><span>Resumen</span><span>Coste</span><span>Efic. / Cert.</span><span>Ev.</span>
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
          <div className="mono" style={{ color: "var(--ink-3)", fontSize: 10, marginBottom: 32 }}>§ III — Por inquietud</div>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: 64 }}>
            <div></div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 64, fontWeight: 400, lineHeight: 1, letterSpacing: "-0.025em", margin: 0 }}>Doce inquietudes,<br/>y lo que las afecta.</h2>
            <p style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6, alignSelf: "end", margin: 0 }}>Mecanismos del envejecimiento y afecciones concretas. Cada uno enlaza con las intervenciones que tienen efectos significativos, clasificados por nivel de evidencia, sobre ese desenlace específico.</p>
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
                  <span className="mono" style={{ color: "var(--accent)", flexShrink: 0 }}>{c.count} ELEMENTOS</span>
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
            <div className="mono" style={{ color: "var(--ink-3)", fontSize: 10 }}>§ IV — Notas recientes</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 64, fontWeight: 400, lineHeight: 1, letterSpacing: "-0.025em", margin: 0 }}>Formato largo. <em style={{ color: "var(--accent)" }}>Despacio.</em></h2>
            <a href="#" style={{ alignSelf: "end", color: "var(--accent)", fontSize: 13, fontWeight: 500, borderBottom: "1px solid var(--accent)", paddingBottom: 4, justifySelf: "end" }}>Todas las notas →</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 64 }}>
            <div></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0 }}>
              {NOTES.map((n, i) => (
                <article key={i} style={{ padding: "32px 32px 32px 0", borderTop: i < 2 ? "1px solid var(--ink)" : "1px solid var(--rule)", borderRight: i % 2 === 0 ? "1px solid var(--rule)" : "none", paddingLeft: i % 2 === 1 ? 32 : 0 }}>
                  <div className="mono" style={{ color: "var(--ink-3)", marginBottom: 12 }}>{n.date} · Ensayo N.º {String(i+1).padStart(2,"0")}</div>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 400, margin: 0, letterSpacing: "-0.02em", marginBottom: 12, lineHeight: 1.15 }}>{n.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>{n.blurb}</p>
                  <a href="#" style={{ display: "inline-block", marginTop: 16, fontSize: 12, color: "var(--accent)", letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "var(--mono)" }}>LEER ENSAYO →</a>
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
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.75)", maxWidth: 320, margin: 0 }}>Intervenciones de longevidad basadas en la evidencia. Sin dinero de la industria de los suplementos, sin enlaces de afiliación, sin tono efectista.</p>
          </div>
          {[
            { h: "Catálogo", l: ["Medicamentos", "Suplementos", "Estilo de vida", "Las 89 entradas"] },
            { h: "Por inquietud", l: ["Corazón", "Cerebro", "Metabólico", "Las doce"] },
            { h: "Método", l: ["Cómo puntuamos", "Conflictos de interés", "Actualizaciones", "Fuentes"] },
            { h: "Contacto", l: ["Newsletter", "Contacto", "Sobre nosotros", "Notas"] },
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
            <span>Compuesto en Spectral & Inter</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

window.HomeC = HomeC;
