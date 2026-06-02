// Curated content used across all directions

const FOUNDATION = [
  { slug: "no-smoking", name: "Nicht rauchen", cat: "lifestyle", e: 10, c: 10, ev: "A", cost: "Kostenlos", tier: 1,
    one: "Wer raucht, sollte aufhören — keine andere Maßnahme bringt mehr für Ihre Longevity. Mit Abstand." },
  { slug: "sleep-architecture", name: "Schlaf, 7–9 h, regelmäßig", cat: "lifestyle", e: 8, c: 8, ev: "A", cost: "0 €", tier: 1,
    one: "Feste Zeiten, dunkles und kühles Schlafzimmer. Das größte Upgrade, das die meisten Erwachsenen kostenlos haben können." },
  { slug: "vo2max-training", name: "VO₂max-Training", cat: "lifestyle", e: 9, c: 9, ev: "A", cost: "0–45 €/Monat", tier: 1,
    one: "Kurze harte Intervalle — 4×4 Minuten nahe am Maximum. Kein anderer Einzelwert sagt so viel über die Lebenserwartung aus." },
  { slug: "zone2-cardio", name: "Zone-2-Cardio", cat: "lifestyle", e: 8, c: 9, ev: "A", cost: "0 €", tier: 1,
    one: "Ausdauer im Tempo, in dem man noch reden kann. Trainiert die Mitochondrien — den Motor, der alles andere am Laufen hält." },
  { slug: "resistance-training", name: "Krafttraining", cat: "lifestyle", e: 7, c: 9, ev: "A", cost: "30–75 €/Monat", tier: 1,
    one: "Zweimal pro Woche schwer heben — ab 40 keine Geschmacksfrage mehr. Kraft ist einer der stärksten Prädiktoren für die Lebenserwartung." },
  { slug: "mediterranean-diet", name: "Mediterrane Ernährung", cat: "lifestyle", e: 7, c: 9, ev: "A", cost: "Kostenneutral", tier: 1,
    one: "Olivenöl, Fisch, Gemüse, Hülsenfrüchte — die Basis fast jeder Mahlzeit. Das am besten belegte Ernährungsmuster überhaupt." },
  { slug: "protein-intake", name: "Protein, 1,2–1,6 g/kg", cat: "lifestyle", e: 4, c: 8, ev: "A", cost: "20–35 €/Monat", tier: 1,
    one: "Die meisten Erwachsenen essen zu wenig — besonders nach 50. Zusammen mit Krafttraining schützt es die Muskulatur." },
  { slug: "creatine", name: "Kreatin", cat: "supplement", e: 5, c: 9, ev: "A", cost: "10–25 €/Monat", tier: 1,
    one: "Das am besten erforschte Supplement überhaupt. Günstig, sicher, gut für Kraft und wahrscheinlich auch fürs Gehirn." },
  { slug: "omega-3", name: "Omega-3 (EPA/DHA)", cat: "supplement", e: 5, c: 7, ev: "A", cost: "15–35 €/Monat", tier: 1,
    one: "Fetter Fisch zweimal die Woche hilft vermutlich. Die 1-g-Kapsel aus der Apotheke ist meistens Geldverschwendung — in Studien wurden 4- bis 10-mal höhere Dosen geprüft." },
  { slug: "vitamin-d3", name: "Vitamin D3", cat: "supplement", e: 4, c: 8, ev: "A", cost: "3–10 €/Monat", tier: 1,
    one: "Bei niedrigem Wert: ausgleichen. Bei normalem Wert: bringt mehr fast nichts. Erst messen lassen." },
  { slug: "vaccines", name: "Impfungen", cat: "lifestyle", e: 7, c: 9, ev: "A", cost: "Kostenlos", tier: 1,
    one: "Grippe, Gürtelrose, Pneumokokken. Findet sich fast nie in Longevity-Listen — gehört aber weit nach oben." },
  { slug: "oat-beta-glucan", name: "Hafer-β-Glucan", cat: "lifestyle", e: 4, c: 9, ev: "A", cost: "3–8 €/Monat", tier: 1,
    one: "Drei Gramm täglich senken das LDL um rund 7 %. Die FDA erkennt den Herz-Kreislauf-Health-Claim an — das schaffen nur sehr wenige Lebensmittel." },
];

const TARGETED_SAMPLE = [
  { slug: "rapamycin", name: "Rapamycin", cat: "medication", e: 9, c: 4, ev: "D", cost: "30–140 €/Monat", tier: 3,
    one: "Stärkstes Lebensverlängerungs-Signal aller Wirkstoffe im Säugetiermodell. Belastbare Humandaten zur Longevity fehlen bisher." },
  { slug: "metformin", name: "Metformin", cat: "medication", e: 5, c: 6, ev: "B", cost: "5–15 €/Monat", tier: 2,
    one: "Günstig, bei Nichtdiabetikern unbedenklich, leichtes Signal bei der Mortalität. Mehr wird die TAME-Studie zeigen." },
  { slug: "glp1-agonists", name: "GLP-1-Agonisten", cat: "medication", e: 7, c: 8, ev: "A", cost: "€€€", tier: 2,
    one: "Semaglutid und Tirzepatid stellen die Adipositas-Therapie auf den Kopf und senken kardiovaskuläre Ereignisse spürbar." },
  { slug: "statins", name: "Statine", cat: "medication", e: 7, c: 10, ev: "A", cost: "5–15 €/Monat", tier: 2,
    one: "Bei erhöhtem ASCVD-Risiko ist der absolute Nutzen für die Mortalität groß. Keine Wirkstoffklasse auf dieser Seite ist besser in RCTs belegt." },
  { slug: "sauna", name: "Sauna (finnisch)", cat: "lifestyle", e: 5, c: 7, ev: "B", cost: "0–75 €/Monat", tier: 2,
    one: "4 bis 7 Saunagänge pro Woche bei 80 °C trockener Hitze. In finnischen Daten ist das Herz-Kreislauf-Signal so stark wie moderater Sport." },
  { slug: "olive-oil-evoo", name: "Polyphenole aus Olivenöl (EVOO)", cat: "supplement", e: 5, c: 8, ev: "A", cost: "10–28 €/Monat", tier: 2,
    one: "Zwei bis vier Esslöffel polyphenolreiches Olivenöl pro Tag — daran hängt ein Großteil des mediterranen Effekts." },
  { slug: "social-connection", name: "Soziale Beziehungen", cat: "lifestyle", e: 7, c: 8, ev: "A", cost: "Kostenlos", tier: 1,
    one: "Einsamkeit ist nach manchen Schätzungen so schädlich wie 15 Zigaretten am Tag. Gehört ins Fundament." },
  { slug: "low-alcohol", name: "Wenig oder gar kein Alkohol", cat: "lifestyle", e: 6, c: 8, ev: "A", cost: "Spart Geld", tier: 1,
    one: "Die These „ein bisschen ist gesund" hält den Daten der 2020er nicht stand. Weniger ist besser, gar nichts ist völlig in Ordnung." },
];

const CONCERNS = [
  { slug: "cvd",            name: "Herzkrankheiten",        count: 48, line: "Herz-Kreislauf-Ereignisse bleiben jenseits der 40 die häufigste Todesursache." },
  { slug: "metabolic",      name: "Diabetes / Stoffwechsel", count: 39, line: "Insulinresistenz steht am Beginn fast jeder chronischen Erkrankung." },
  { slug: "cognitive-decline", name: "Kognitiver Abbau",    count: 37, line: "Was das Gehirn schützt, ist im Wesentlichen das, was auch das Herz schützt — und Schlaf." },
  { slug: "inflammaging",   name: "Chronische Entzündungen", count: 25, line: "Der rote Faden durch den halben Katalog." },
  { slug: "frailty",        name: "Gebrechlichkeit",        count: 18, line: "Kraft, Gleichgewicht und Muskelmasse — das sind die Hebel." },
  { slug: "immune-decline", name: "Immunalterung",          count: 13, line: "Impfungen, Schlaf und keine chronischen Infektionen — das macht den Großteil aus." },
  { slug: "sarcopenia",     name: "Muskelabbau",            count: 14, line: "Nach 40 verlieren Sie pro Jahr ein Prozent Muskelmasse — wenn Sie nichts dagegen tun." },
  { slug: "cancer",         name: "Krebsrisiko",            count: 11, line: "Krebsprävention ist zum größten Teil Stoffwechselsache, plus ein paar gezielte Screenings." },
  { slug: "bone-density",   name: "Knochenabbau",           count: 9,  line: "Krafttraining, Vitamin D, K2 — und für manche eine Hormonersatztherapie." },
  { slug: "senescence",     name: "Zelluläre Seneszenz",    count: 8,  line: "Die Forschungsfront. Echte Biologie — die Humandaten sind aber noch dünn." },
  { slug: "mitochondrial",  name: "Mitochondrialer Abbau",  count: 12, line: "Zone 2, Urolithin A und die ganze Geschichte rund ums Fasten-Mimicking." },
  { slug: "skin-aging",     name: "Hautalterung",           count: 7,  line: "Sonnenschutz und nicht rauchen. Der Rest fällt in den Rundungsfehler." },
];

const NOTES = [
  { date: "2026-05-07", title: "Krafttraining — was konkret tun?",
    blurb: "Ein konkretes Protokoll für die Longevity-Ziele: Kraft, Muskelmasse, Knochendichte. Mit der LIFTMOR-Studie zur Osteoporose und der Norwegian Senior Strength Trial." },
  { date: "2026-05-07", title: "Menopause und Longevity — was die Daten wirklich zeigen",
    blurb: "Mit der Menopause läuft die weibliche Longevity-Kurve anders als die männliche. Knochen, Herz-Kreislauf, Kognition — alles verändert sich messbar. Ein praktischer Blick darauf, wann eine Hormonersatztherapie sinnvoll ist." },
  { date: "2026-05-07", title: "Bringt X überhaupt etwas? Fünf Fragen vor jedem neuen Supplement",
    blurb: "Ein praktischer Rahmen für alles, was bei uns noch nicht im Katalog steht — anwenden, bevor Sie kaufen." },
  { date: "2026-05-07", title: "Entzündung — der rote Faden durch den halben Katalog",
    blurb: "Warum so viele unserer Top-Interventionen gleichzeitig Entzündungen senken — und wo das Argument anfängt zu wackeln." },
];

window.FOUNDATION = FOUNDATION;
window.TARGETED_SAMPLE = TARGETED_SAMPLE;
window.CONCERNS = CONCERNS;
window.NOTES = NOTES;
