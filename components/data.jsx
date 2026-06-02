// Curated content used across all directions

const FOUNDATION = [
  { slug: "no-smoking", name: "No Smoking", cat: "lifestyle", e: 10, c: 10, ev: "A", cost: "Free", tier: 1,
    one: "If you smoke, quitting is the single highest-impact thing you can do for longevity. Nothing else comes close." },
  { slug: "sleep-architecture", name: "Sleep, 7–9h, regular", cat: "lifestyle", e: 8, c: 8, ev: "A", cost: "$0", tier: 1,
    one: "Consistent timing in a dark, cool room. The largest free upgrade most adults can make." },
  { slug: "vo2max-training", name: "VO₂max Training", cat: "lifestyle", e: 9, c: 9, ev: "A", cost: "$0–50/mo", tier: 1,
    one: "Short, hard intervals — 4×4 minutes near max. The single most predictive number we have." },
  { slug: "zone2-cardio", name: "Zone 2 Cardio", cat: "lifestyle", e: 8, c: 9, ev: "A", cost: "$0", tier: 1,
    one: "Conversational-pace cardio that builds the mitochondrial engine the rest of the body runs on." },
  { slug: "resistance-training", name: "Resistance Training", cat: "lifestyle", e: 7, c: 9, ev: "A", cost: "$30–80/mo", tier: 1,
    one: "Lifting heavy, twice a week, past 40 isn't optional. Strength predicts how long you live." },
  { slug: "mediterranean-diet", name: "Mediterranean Diet", cat: "lifestyle", e: 7, c: 9, ev: "A", cost: "Net neutral", tier: 1,
    one: "Olive oil, fish, vegetables and legumes as the bulk of meals. The most-replicated dietary pattern." },
  { slug: "protein-intake", name: "Protein, 1.2–1.6 g/kg", cat: "lifestyle", e: 4, c: 8, ev: "A", cost: "$20–40/mo", tier: 1,
    one: "Most adults — especially over 50 — eat too little. Combined with strength training, protects muscle." },
  { slug: "creatine", name: "Creatine", cat: "supplement", e: 5, c: 9, ev: "A", cost: "$10–25/mo", tier: 1,
    one: "The most-studied supplement that exists. Cheap, safe, helps strength and probably the brain." },
  { slug: "omega-3", name: "Omega-3 (EPA/DHA)", cat: "supplement", e: 5, c: 7, ev: "A", cost: "$15–40/mo", tier: 1,
    one: "Fatty fish twice a week probably helps. The pharmacy 1g pill is mostly waste — doses tested are 4–10× higher." },
  { slug: "vitamin-d3", name: "Vitamin D3", cat: "supplement", e: 4, c: 8, ev: "A", cost: "$3–10/mo", tier: 1,
    one: "If your level is low, fix it. If normal, more does almost nothing. Test first." },
  { slug: "vaccines", name: "Vaccines", cat: "lifestyle", e: 7, c: 9, ev: "A", cost: "Free", tier: 1,
    one: "Flu, shingles, pneumococcal. Almost never appears on longevity lists, but ought to be near the top." },
  { slug: "oat-beta-glucan", name: "Oat β-glucan", cat: "lifestyle", e: 4, c: 9, ev: "A", cost: "$3–8/mo", tier: 1,
    one: "Three grams a day lowers LDL by ~7%. The FDA approves the heart-disease claim — one of very few foods that get one." },
];

const TARGETED_SAMPLE = [
  { slug: "rapamycin", name: "Rapamycin", cat: "medication", e: 9, c: 4, ev: "D", cost: "$30–150/mo", tier: 3,
    one: "Strongest mammalian lifespan signal of any drug. Human longevity data still pending." },
  { slug: "metformin", name: "Metformin", cat: "medication", e: 5, c: 6, ev: "B", cost: "$5–15/mo", tier: 2,
    one: "Cheap, safe in non-diabetics, modest mortality signal. The TAME trial will tell us more." },
  { slug: "glp1-agonists", name: "GLP-1 agonists", cat: "medication", e: 7, c: 8, ev: "A", cost: "$$$", tier: 2,
    one: "Semaglutide and tirzepatide reshape obesity treatment and cut cardiovascular events meaningfully." },
  { slug: "statins", name: "Statins", cat: "medication", e: 7, c: 10, ev: "A", cost: "$5–15/mo", tier: 2,
    one: "If your ASCVD risk is elevated, the absolute mortality benefit is large. The most-RCTd drug class on this site." },
  { slug: "sauna", name: "Sauna (Finnish)", cat: "lifestyle", e: 5, c: 7, ev: "B", cost: "$0–80/mo", tier: 2,
    one: "4–7 sessions a week of 80°C dry heat. Cardiovascular signal as strong as moderate exercise in Finnish data." },
  { slug: "olive-oil-evoo", name: "EVOO Polyphenols", cat: "supplement", e: 5, c: 8, ev: "A", cost: "$10–30/mo", tier: 2,
    one: "Two to four tablespoons a day of high-polyphenol olive oil drives most of the Mediterranean signal." },
  { slug: "social-connection", name: "Social Connection", cat: "lifestyle", e: 7, c: 8, ev: "A", cost: "Free", tier: 1,
    one: "Loneliness is as bad as a 15-cigarette-a-day habit, by some estimates. Counts as foundation." },
  { slug: "low-alcohol", name: "Low / No Alcohol", cat: "lifestyle", e: 6, c: 8, ev: "A", cost: "Save $", tier: 1,
    one: "The 'small amount is good for you' story has not survived 2020s data. Less is better, zero is fine." },
];

const CONCERNS = [
  { slug: "cvd",            name: "Heart disease",        count: 48, line: "Cardiovascular events are still the leading cause of death after 40." },
  { slug: "metabolic",      name: "Diabetes / metabolic", count: 39, line: "Insulin resistance is upstream of nearly every chronic disease." },
  { slug: "cognitive-decline", name: "Cognitive decline", count: 37, line: "What protects the brain is mostly what protects the heart, plus sleep." },
  { slug: "inflammaging",   name: "Chronic inflammation", count: 25, line: "The through-line that connects half the catalogue." },
  { slug: "frailty",        name: "Frailty",              count: 18, line: "Strength, balance and lean mass are the levers that matter." },
  { slug: "immune-decline", name: "Immune aging",         count: 13, line: "Vaccines, sleep and avoiding chronic infection do most of the work." },
  { slug: "sarcopenia",     name: "Muscle loss",          count: 14, line: "Past 40, you lose 1% of muscle a year unless you push back." },
  { slug: "cancer",         name: "Cancer risk",          count: 11, line: "Most cancer prevention is metabolic, with a few specific screens." },
  { slug: "bone-density",   name: "Bone loss",            count: 9,  line: "Resistance training, vitamin D, K2 and — for some — HRT." },
  { slug: "senescence",     name: "Cellular senescence",  count: 8,  line: "The frontier. Real biology, weak human evidence so far." },
  { slug: "mitochondrial",  name: "Mitochondrial decline",count: 12, line: "Zone 2, urolithin A, and the long fast-mimicking story." },
  { slug: "skin-aging",     name: "Skin aging",           count: 7,  line: "Sunscreen and not smoking. The rest is rounding error." },
];

const NOTES = [
  { date: "2026-05-07", title: "Resistance training — what to actually do",
    blurb: "A specific protocol for the longevity goals — strength, muscle, bone density. With the LIFTMOR osteoporosis evidence and the Norwegian Senior Strength Trial." },
  { date: "2026-05-07", title: "Menopause and longevity, what the data actually says",
    blurb: "Female longevity diverges from male at menopause. Bone, cardiovascular, cognitive — all change in measurable ways. A practical look at HRT timing." },
  { date: "2026-05-07", title: "Is X worth taking? Five questions before any new supplement",
    blurb: "A practical framework you can apply to anything we haven't catalogued yet — before you buy." },
  { date: "2026-05-07", title: "Inflammation: the through-line that explains half the catalogue",
    blurb: "Why so many of our top-rated interventions also lower inflammation — and where the story breaks." },
];

window.FOUNDATION = FOUNDATION;
window.TARGETED_SAMPLE = TARGETED_SAMPLE;
window.CONCERNS = CONCERNS;
window.NOTES = NOTES;
