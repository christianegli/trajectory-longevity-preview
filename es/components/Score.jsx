// Score visualization — three styles, switchable via prop
// type: "bars" | "scatter" | "dots" | "ring"

const Score = ({ effectiveness = 7, certainty = 7, type = "bars", size = 80, label = true }) => {
  const e = Math.max(0, Math.min(10, effectiveness));
  const c = Math.max(0, Math.min(10, certainty));
  const colorE = e >= 7 ? "var(--score-hi)" : e >= 4 ? "var(--score-mid)" : "var(--score-lo)";
  const colorC = c >= 7 ? "var(--score-hi)" : c >= 4 ? "var(--score-mid)" : "var(--score-lo)";

  if (type === "bars") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 16 }}>E</span>
          <span style={{ flex: 1, height: 4, background: "var(--bg-2)", borderRadius: 2, overflow: "hidden" }}>
            <span style={{ display: "block", height: "100%", width: `${e*10}%`, background: colorE }}/>
          </span>
          <span style={{ width: 18, textAlign: "right" }}>{e}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 16 }}>C</span>
          <span style={{ flex: 1, height: 4, background: "var(--bg-2)", borderRadius: 2, overflow: "hidden" }}>
            <span style={{ display: "block", height: "100%", width: `${c*10}%`, background: colorC }}/>
          </span>
          <span style={{ width: 18, textAlign: "right" }}>{c}</span>
        </div>
      </div>
    );
  }

  if (type === "dots") {
    const Row = ({ label, value, color }) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-2)" }}>
        <span style={{ width: 16 }}>{label}</span>
        <span style={{ display: "flex", gap: 2 }}>
          {[...Array(10)].map((_, i) => (
            <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i < value ? color : "var(--bg-2)" }}/>
          ))}
        </span>
        <span style={{ width: 18, textAlign: "right" }}>{value}</span>
      </div>
    );
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Row label="E" value={e} color={colorE}/>
        <Row label="C" value={c} color={colorC}/>
      </div>
    );
  }

  if (type === "scatter") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
          <rect x="0" y="0" width="100" height="100" fill="var(--bg-2)" rx="2"/>
          {[2,4,6,8].map(g => (
            <g key={g}>
              <line x1={g*10} y1="0" x2={g*10} y2="100" stroke="var(--rule)" strokeWidth="0.5"/>
              <line x1="0" y1={100-g*10} x2="100" y2={100-g*10} stroke="var(--rule)" strokeWidth="0.5"/>
            </g>
          ))}
          <line x1="0" y1="100" x2="100" y2="0" stroke="var(--rule)" strokeWidth="0.5" strokeDasharray="2 2"/>
          <circle cx={c*10} cy={100 - e*10} r="4" fill={colorE} stroke="var(--paper)" strokeWidth="1.5"/>
        </svg>
        {label && (
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-2)", lineHeight: 1.5 }}>
            <div>E·{e}</div>
            <div>C·{c}</div>
          </div>
        )}
      </div>
    );
  }

  if (type === "ring") {
    const combined = (e * c) / 10; // 0..10
    const r = 26;
    const circ = 2 * Math.PI * r;
    const off = circ - (combined / 10) * circ;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <svg width={size} height={size} viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="var(--bg-2)" strokeWidth="4"/>
          <circle cx="32" cy="32" r={r} fill="none" stroke={colorE} strokeWidth="4" strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" transform="rotate(-90 32 32)"/>
          <text x="32" y="36" textAnchor="middle" fontFamily="var(--serif)" fontSize="16" fill="var(--ink)">{combined.toFixed(1)}</text>
        </svg>
        {label && (
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-2)", lineHeight: 1.5 }}>
            <div>E·{e}</div>
            <div>C·{c}</div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

window.Score = Score;
