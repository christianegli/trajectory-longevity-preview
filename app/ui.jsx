// UI primitives — clinical edition

const UI_LANG = (window.location.pathname || "/").split("/").filter(Boolean)[0];
const CONCERN_LABEL_SETS = {
  en: {
  "cvd": "Cardiovascular",
  "cancer": "Cancer",
  "cognitive-decline": "Cognition",
  "metabolic": "Metabolic",
  "sarcopenia": "Muscle loss",
  "frailty": "Frailty",
  "bone-loss": "Bone",
  "immune-decline": "Immunity",
  "inflammaging": "Inflammation",
  "mitochondrial": "Mitochondria",
  "senescence": "Senescence",
  "neurodegenerative-other": "Neurodegeneration",
  },
  de: {
    "cvd": "Herz-Kreislauf",
    "cancer": "Krebs",
    "cognitive-decline": "Kognition",
    "metabolic": "Stoffwechsel",
    "sarcopenia": "Muskelverlust",
    "frailty": "Gebrechlichkeit",
    "bone-loss": "Knochen",
    "immune-decline": "Immunsystem",
    "inflammaging": "Entzündung",
    "mitochondrial": "Mitochondrien",
    "senescence": "Seneszenz",
    "neurodegenerative-other": "Neurodegeneration",
  },
  fr: {
    "cvd": "Cardiovasculaire",
    "cancer": "Cancer",
    "cognitive-decline": "Cognition",
    "metabolic": "Métabolique",
    "sarcopenia": "Perte musculaire",
    "frailty": "Fragilité",
    "bone-loss": "Os",
    "immune-decline": "Immunité",
    "inflammaging": "Inflammation",
    "mitochondrial": "Mitochondries",
    "senescence": "Sénescence",
    "neurodegenerative-other": "Neurodégénérescence",
  },
  es: {
    "cvd": "Cardiovascular",
    "cancer": "Cáncer",
    "cognitive-decline": "Cognición",
    "metabolic": "Metabólico",
    "sarcopenia": "Pérdida muscular",
    "frailty": "Fragilidad",
    "bone-loss": "Hueso",
    "immune-decline": "Inmunidad",
    "inflammaging": "Inflamación",
    "mitochondrial": "Mitocondrias",
    "senescence": "Senescencia",
    "neurodegenerative-other": "Neurodegeneración",
  },
};
const TIER_LABEL_SETS = {
  en: { 1: "Foundation", 2: "Targeted", 3: "Frontier" },
  de: { 1: "Grundlage", 2: "Gezielt", 3: "Frontier" },
  fr: { 1: "Fondation", 2: "Ciblé", 3: "Frontière" },
  es: { 1: "Base", 2: "Dirigido", 3: "Frontera" },
};
const EVIDENCE_DESC_SETS = {
  en: { A: "Multiple human RCTs", B: "Some human RCTs", C: "Observational + mechanistic", D: "Animal / mechanistic", E: "In vitro / theoretical" },
  de: { A: "Mehrere Human-RCTs", B: "Einige Human-RCTs", C: "Beobachtend + mechanistisch", D: "Tierdaten / mechanistisch", E: "In vitro / theoretisch" },
  fr: { A: "Plusieurs ECR humains", B: "Quelques ECR humains", C: "Observationnel + mécanistique", D: "Animal / mécanistique", E: "In vitro / théorique" },
  es: { A: "Varios ECA en humanos", B: "Algunos ECA en humanos", C: "Observacional + mecanicista", D: "Animal / mecanicista", E: "In vitro / teórico" },
};
const SCORE_LABELS = {
  en: { effect: "EFFECT", certain: "CERTAIN", eff: "EFF", crt: "CRT", axisEffect: "EFFECT →", axisCertainty: "↑ CERTAINTY" },
  de: { effect: "WIRKUNG", certain: "SICHERHEIT", eff: "WRK", crt: "SIC", axisEffect: "WIRKUNG →", axisCertainty: "↑ SICHERHEIT" },
  fr: { effect: "EFFET", certain: "CERTITUDE", eff: "EFF", crt: "CERT", axisEffect: "EFFET →", axisCertainty: "↑ CERTITUDE" },
  es: { effect: "EFECTO", certain: "CERTEZA", eff: "EFE", crt: "CER", axisEffect: "EFECTO →", axisCertainty: "↑ CERTEZA" },
}[UI_LANG] || { effect: "EFFECT", certain: "CERTAIN", eff: "EFF", crt: "CRT", axisEffect: "EFFECT →", axisCertainty: "↑ CERTAINTY" };
const CONCERN_LABELS = CONCERN_LABEL_SETS[UI_LANG] || CONCERN_LABEL_SETS.en;
const TIER_LABELS = TIER_LABEL_SETS[UI_LANG] || TIER_LABEL_SETS.en;
const EVIDENCE_DESC = EVIDENCE_DESC_SETS[UI_LANG] || EVIDENCE_DESC_SETS.en;

function CatDot({ cat }) { return <span className={`cat-dot ${cat}`} />; }
function Tier({ tier }) {
  const cls = tier === 1 ? "t1" : tier === 2 ? "t2" : "t3";
  return <span className={`tier ${cls}`}><span className="num">{tier === 1 ? "I" : tier === 2 ? "II" : "III"}</span>{TIER_LABELS[tier]}</span>;
}
function Grade({ ev }) { return <span className={`grade ${ev.toLowerCase()}`}>{ev}</span>; }

// Scores as clinical numeric cells — replaces bars/dots
function Score({ e, c, viz = "cell" }) {
  if (viz === "ring") return <ScoreRing e={e} c={c} />;
  if (viz === "bars") return <ScoreBars e={e} c={c} />;
  return (
    <div className="score-cell numeric">
      <span className="lbl">{SCORE_LABELS.effect}</span>
      <span className="val">{e}<span className="max">/10</span></span>
      <span className="lbl">{SCORE_LABELS.certain}</span>
      <span className="val">{c}<span className="max">/10</span></span>
    </div>
  );
}
function ScoreBars({ e, c }) {
  return (
    <div className="score-bars">
      <span>{SCORE_LABELS.eff}</span>
      <div><div style={{ width: `${e*10}%`, background: "var(--deep)" }} /></div>
      <strong>{e}</strong>
      <span>{SCORE_LABELS.crt}</span>
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
        <div>{SCORE_LABELS.eff} <strong style={{ color: "var(--ink)", fontSize: 12 }}>{e}</strong><span style={{ color: "var(--ink-4)" }}>/10</span></div>
        <div>{SCORE_LABELS.crt} <strong style={{ color: "var(--ink)", fontSize: 12 }}>{c}</strong><span style={{ color: "var(--ink-4)" }}>/10</span></div>
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
      <text x={w-pad} y={h-10} textAnchor="end" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-3)" letterSpacing="1">{SCORE_LABELS.axisEffect}</text>
      <text x={pad-6} y={pad-6} textAnchor="start" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-3)" letterSpacing="1">{SCORE_LABELS.axisCertainty}</text>
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

window.UI = { CatDot, Tier, Grade, Score, ScoreRing, ScoreBars, Scatter, CONCERN_LABELS, TIER_LABELS, EVIDENCE_DESC };
