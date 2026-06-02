// UI primitives — clinical edition

const CONCERN_LABELS = {
  "cvd": "Cardiovascular",
  "cancer": "Cancer",
  "cognitive-decline": "Cognition",
  "metabolic": "Metabolic",
  "sarcopenia": "Muscle loss",
  "frailty": "Frailty",
  "bone-density": "Bone",
  "immune-decline": "Immunity",
  "inflammaging": "Inflammation",
  "mitochondrial": "Mitochondria",
  "senescence": "Senescence",
  "cardiac": "Cardiac rhythm",
};
const TIER_LABELS = { 1: "Foundation", 2: "Targeted", 3: "Frontier" };
const EVIDENCE_DESC = {
  A: "Multiple human RCTs",
  B: "Some human RCTs",
  C: "Observational + mechanistic",
  D: "Animal / mechanistic",
  E: "In vitro / theoretical",
};

function CatDot({ cat }) { return <span className={`cat-dot ${cat}`} />; }
function Tier({ tier }) {
  const cls = tier === 1 ? "t1" : tier === 2 ? "t2" : "t3";
  return <span className={`tier ${cls}`}><span className="num">{tier === 1 ? "I" : tier === 2 ? "II" : "III"}</span>{TIER_LABELS[tier]}</span>;
}
function Grade({ ev }) { return <span className={`grade ${ev.toLowerCase()}`}>{ev}</span>; }

function glyphKind(item = {}) {
  const slug = item.slug || "";
  const text = [item.name, item.cat, item.one, ...(item.tags || [])].join(" ").toLowerCase();
  const direct = {
    "creatine": "molecule",
    "omega-3": "fish",
    "olive-oil-evoo": "olive",
    "coffee": "coffee",
    "walnuts": "nut",
    "blueberries-anthocyanins": "berries",
    "green-tea": "tea",
    "fiber": "grain",
    "protein": "bowl",
    "resistance-training": "dumbbell",
    "zone2-cardio": "pulse",
    "vo2max-training": "mountain",
    "sleep-architecture": "moon",
    "sun-exposure-circadian": "sun",
    "sauna": "heat",
    "meditation": "breath",
    "no-smoking": "slash",
    "statins": "pill",
    "metformin": "molecule",
    "rapamycin": "molecule",
    "glp1-agonists": "syringe",
    "vitamin-d3": "sun",
    "magnesium": "mineral",
    "zinc": "mineral",
  };
  if (direct[slug]) return direct[slug];
  if (/sleep|melatonin|circadian/.test(text)) return "moon";
  if (/run|cardio|vo2|aerobic|heart|blood pressure/.test(text)) return "pulse";
  if (/strength|muscle|protein|resistance/.test(text)) return "dumbbell";
  if (/tea/.test(text)) return "tea";
  if (/coffee|caffeine/.test(text)) return "coffee";
  if (/olive|oil/.test(text)) return "olive";
  if (/berry|berries|anthocyanin/.test(text)) return "berries";
  if (/fish|omega/.test(text)) return "fish";
  if (/vitamin d|sun|light/.test(text)) return "sun";
  if (/sauna|heat/.test(text)) return "heat";
  if (/meditat|breath|stress/.test(text)) return "breath";
  if (/smok|nicotine/.test(text)) return "slash";
  if (/drug|statin|pill|medication/.test(text)) return item.cat === "medication" ? "pill" : "molecule";
  if (/mineral|magnesium|zinc/.test(text)) return "mineral";
  if (item.cat === "lifestyle") return "leaf";
  if (item.cat === "supplement") return "molecule";
  return "bowl";
}

function InterventionGlyph({ item, size = 96, quiet = false }) {
  const kind = glyphKind(item);
  const cls = `intervention-glyph kind-${kind}${quiet ? " quiet" : ""}`;
  const common = {
    className: cls,
    width: size,
    height: size,
    viewBox: "0 0 96 96",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    focusable: "false",
  };
  if (kind === "molecule") return (
    <svg {...common}>
      <path d="M35 30 49 22l14 8v16l-14 8-14-8V30Z" />
      <path d="M63 46 76 54M35 46 22 54M49 22V10M49 54v16" />
      <circle cx="49" cy="10" r="4" />
      <circle cx="76" cy="54" r="4" />
      <circle cx="22" cy="54" r="4" />
      <circle cx="49" cy="70" r="4" />
    </svg>
  );
  if (kind === "fish") return (
    <svg {...common}>
      <path d="M16 49c11-15 30-22 48-8 7-5 13-8 18-8-2 8-2 16 0 24-5 0-11-3-18-8-18 14-37 7-48-8Z" />
      <path d="M55 41c-2 6-2 12 0 18M28 49h.1" />
    </svg>
  );
  if (kind === "olive") return (
    <svg {...common}>
      <path d="M48 16c13 17 15 32 5 46-9 13-24 18-30 10-6-9 1-24 15-32 8-5 11-13 10-24Z" />
      <path d="M49 16c10 15 22 21 34 18-6-9-17-16-34-18ZM42 42c7 7 10 17 9 29" />
    </svg>
  );
  if (kind === "coffee") return (
    <svg {...common}>
      <path d="M25 38h43v16c0 12-8 21-21 21S25 66 25 54V38Z" />
      <path d="M68 43h6c7 0 10 5 8 11-2 6-7 9-14 8M31 25c-3-5 3-8 0-13M47 25c-3-5 3-8 0-13M63 25c-3-5 3-8 0-13" />
    </svg>
  );
  if (kind === "nut") return (
    <svg {...common}>
      <path d="M48 14c14 10 24 23 24 40 0 17-10 28-24 28S24 71 24 54c0-17 10-30 24-40Z" />
      <path d="M38 30c11 5 22 17 22 31M34 58c7-4 17-4 26 0" />
    </svg>
  );
  if (kind === "berries") return (
    <svg {...common}>
      <circle cx="35" cy="55" r="16" />
      <circle cx="57" cy="58" r="18" />
      <circle cx="50" cy="35" r="14" />
      <path d="M49 21c-2-7 2-10 7-12M40 24l-9-8M58 27l10-7" />
    </svg>
  );
  if (kind === "tea") return (
    <svg {...common}>
      <path d="M21 43h46v12c0 12-9 20-23 20S21 67 21 55V43Z" />
      <path d="M67 47h6c7 0 10 4 9 9-1 6-7 9-15 8M31 30c10-8 20-8 30 0M47 30V17" />
    </svg>
  );
  if (kind === "grain" || kind === "bowl") return (
    <svg {...common}>
      <path d="M18 52h60c-2 17-13 28-30 28S20 69 18 52Z" />
      <path d="M31 42c-2-13 3-22 14-28 3 11 0 20-9 27M50 42c1-14 8-23 21-26 0 13-6 21-17 26" />
    </svg>
  );
  if (kind === "dumbbell") return (
    <svg {...common}>
      <path d="M16 38v20M24 32v32M32 39v18M64 39v18M72 32v32M80 38v20M32 48h32" />
    </svg>
  );
  if (kind === "pulse") return (
    <svg {...common}>
      <path d="M14 51h14l8-18 13 36 9-26h24" />
      <path d="M24 31c8-12 20-10 24-1 4-9 16-11 24 1" />
    </svg>
  );
  if (kind === "mountain") return (
    <svg {...common}>
      <path d="M12 74 36 28l15 25 9-15 24 36H12Z" />
      <path d="M36 28l6 16 9 9M60 38l4 14" />
    </svg>
  );
  if (kind === "moon") return (
    <svg {...common}>
      <path d="M62 77c-24 0-43-19-43-43 0-7 2-14 5-20 4 19 21 33 41 33 6 0 11-1 16-3-5 19-22 33-19 33Z" />
      <path d="M65 17h.1M78 27h.1M56 29h.1" />
    </svg>
  );
  if (kind === "sun") return (
    <svg {...common}>
      <circle cx="48" cy="48" r="17" />
      <path d="M48 10v12M48 74v12M10 48h12M74 48h12M21 21l8 8M67 67l8 8M75 21l-8 8M29 67l-8 8" />
    </svg>
  );
  if (kind === "heat") return (
    <svg {...common}>
      <path d="M31 75c-8-10-7-21 4-31 6-6 9-13 7-24 15 11 20 25 14 40 8-4 12-10 12-18 10 15 7 28-6 36" />
      <path d="M28 82h40" />
    </svg>
  );
  if (kind === "breath") return (
    <svg {...common}>
      <path d="M14 39c10-9 20-9 30 0s20 9 30 0M22 55c8-6 16-6 24 0s16 6 24 0M34 26c5-5 10-5 15 0s10 5 15 0" />
      <path d="M48 70v10M38 80h20" />
    </svg>
  );
  if (kind === "slash") return (
    <svg {...common}>
      <circle cx="48" cy="48" r="33" />
      <path d="M25 25 71 71M36 44c7-5 16-5 25 1M34 56h25" />
    </svg>
  );
  if (kind === "pill") return (
    <svg {...common}>
      <path d="M28 68c-9-9-9-23 0-32l8-8c9-9 23-9 32 0s9 23 0 32l-8 8c-9 9-23 9-32 0Z" />
      <path d="M39 57 57 39" />
    </svg>
  );
  if (kind === "syringe") return (
    <svg {...common}>
      <path d="M30 66 65 31M55 21l20 20M63 13l20 20M24 72l-10 10M35 61l-9 9M45 52l-9 9" />
      <path d="M28 36 60 68" />
    </svg>
  );
  if (kind === "mineral") return (
    <svg {...common}>
      <path d="M29 26h38l14 22-33 34-33-34 14-22Z" />
      <path d="M29 26 48 82M67 26 48 82M15 48h66" />
    </svg>
  );
  return (
    <svg {...common}>
      <path d="M48 18c18 8 28 21 28 38 0 14-11 25-28 25S20 70 20 56c0-17 10-30 28-38Z" />
      <path d="M48 18c-3 18-1 35 8 51M41 38c-8 4-14 9-19 17" />
    </svg>
  );
}

// Scores as clinical numeric cells — replaces bars/dots
function Score({ e, c, viz = "cell" }) {
  if (viz === "ring") return <ScoreRing e={e} c={c} />;
  if (viz === "bars") return <ScoreBars e={e} c={c} />;
  return (
    <div className="score-cell numeric">
      <span className="lbl">EFFECT</span>
      <span className="val">{e}<span className="max">/10</span></span>
      <span className="lbl">CERTAIN</span>
      <span className="val">{c}<span className="max">/10</span></span>
    </div>
  );
}
function ScoreBars({ e, c }) {
  return (
    <div className="score-bars">
      <span>EFF</span>
      <div><div style={{ width: `${e*10}%`, background: "var(--deep)" }} /></div>
      <strong>{e}</strong>
      <span>CRT</span>
      <div><div style={{ width: `${c*10}%`, background: "var(--clay)" }} /></div>
      <strong>{c}</strong>
    </div>
  );
}
function ScoreRing({ e, c, size = 44 }) {
  const r = (size - 6) / 2, C = 2*Math.PI*r;
  const r2 = r - 5, C2 = 2*Math.PI*r2;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--paper-3)" strokeWidth="2" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--deep)" strokeWidth="2" strokeLinecap="butt" strokeDasharray={`${C*e/10} ${C}`} transform={`rotate(-90 ${size/2} ${size/2})`} />
        <circle cx={size/2} cy={size/2} r={r2} fill="none" stroke="var(--paper-3)" strokeWidth="2" />
        <circle cx={size/2} cy={size/2} r={r2} fill="none" stroke="var(--clay)" strokeWidth="2" strokeLinecap="butt" strokeDasharray={`${C2*c/10} ${C2}`} transform={`rotate(-90 ${size/2} ${size/2})`} />
      </svg>
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, lineHeight: 1.35 }}>
        <div>EFF <strong style={{ color: "var(--ink)", fontSize: 12 }}>{e}</strong><span style={{ color: "var(--ink-4)" }}>/10</span></div>
        <div>CRT <strong style={{ color: "var(--ink)", fontSize: 12 }}>{c}</strong><span style={{ color: "var(--ink-4)" }}>/10</span></div>
      </div>
    </div>
  );
}

// 2-axis scatter (effectiveness × certainty)
function Scatter({ items, highlight, onPick, w = 380, h = 280 }) {
  const pad = 32;
  const x = v => pad + (v/10)*(w-pad*2);
  const y = v => h-pad - (v/10)*(h-pad*2);
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      {[2,4,6,8].map(v => (
        <g key={v}>
          <line x1={x(v)} y1={pad} x2={x(v)} y2={h-pad} stroke="var(--rule)" strokeDasharray="1 4" />
          <line x1={pad} y1={y(v)} x2={w-pad} y2={y(v)} stroke="var(--rule)" strokeDasharray="1 4" />
        </g>
      ))}
      <line x1={pad} y1={h-pad} x2={w-pad} y2={h-pad} stroke="var(--rule-2)" />
      <line x1={pad} y1={pad} x2={pad} y2={h-pad} stroke="var(--rule-2)" />
      <text x={w-pad} y={h-10} textAnchor="end" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-3)" letterSpacing="1">EFFECT →</text>
      <text x={pad-6} y={pad-6} textAnchor="start" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-3)" letterSpacing="1">↑ CERTAINTY</text>
      {items.map(it => {
        const fill = it.cat === "medication" ? "var(--grade-d)" : it.cat === "supplement" ? "var(--clay)" : "var(--deep)";
        const isH = highlight === it.slug;
        return (
          <g key={it.slug} style={{ cursor: "pointer" }} onClick={() => onPick && onPick(it)}>
            <circle cx={x(it.e)} cy={y(it.c)} r={isH ? 5 : 3} fill={fill} opacity={isH ? 1 : 0.55} />
            {isH && <text x={x(it.e)+8} y={y(it.c)+4} fontFamily="Inter" fontSize="11" fill="var(--ink)" fontWeight="500">{it.name}</text>}
          </g>
        );
      })}
    </svg>
  );
}

window.UI = { CatDot, Tier, Grade, Score, ScoreRing, ScoreBars, Scatter, InterventionGlyph, CONCERN_LABELS, TIER_LABELS, EVIDENCE_DESC };
