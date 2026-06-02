// Curated content used across all directions

const FOUNDATION = [
  { slug: "no-smoking", name: "Ne pas fumer", cat: "lifestyle", e: 10, c: 10, ev: "A", cost: "Gratuit", tier: 1,
    one: "Si vous fumez, arrêter est la chose la plus efficace que vous puissiez faire pour votre longévité. Rien d'autre ne s'en approche." },
  { slug: "sleep-architecture", name: "Sommeil, 7–9 h, régulier", cat: "lifestyle", e: 8, c: 8, ev: "A", cost: "0 €", tier: 1,
    one: "Des horaires constants, dans une chambre sombre et fraîche. Le meilleur gain gratuit que la plupart des adultes peuvent obtenir." },
  { slug: "vo2max-training", name: "Entraînement VO₂max", cat: "lifestyle", e: 9, c: 9, ev: "A", cost: "0–45 €/mois", tier: 1,
    one: "Intervalles courts et intenses — 4×4 minutes près du maximum. La donnée la plus prédictive dont nous disposions." },
  { slug: "zone2-cardio", name: "Cardio Zone 2", cat: "lifestyle", e: 8, c: 9, ev: "A", cost: "0 €", tier: 1,
    one: "Endurance à un rythme de conversation, qui construit le moteur mitochondrial sur lequel tourne le reste du corps." },
  { slug: "resistance-training", name: "Musculation", cat: "lifestyle", e: 7, c: 9, ev: "A", cost: "30–75 €/mois", tier: 1,
    one: "Soulever lourd, deux fois par semaine, après 40 ans, n'est pas optionnel. La force prédit votre espérance de vie." },
  { slug: "mediterranean-diet", name: "Régime méditerranéen", cat: "lifestyle", e: 7, c: 9, ev: "A", cost: "Coût neutre", tier: 1,
    one: "Huile d'olive, poisson, légumes et légumineuses comme base des repas. Le schéma alimentaire le plus reproduit dans les études." },
  { slug: "protein-intake", name: "Protéines, 1,2–1,6 g/kg", cat: "lifestyle", e: 4, c: 8, ev: "A", cost: "20–35 €/mois", tier: 1,
    one: "La plupart des adultes — surtout après 50 ans — n'en consomment pas assez. Associées à la musculation, elles protègent la masse musculaire." },
  { slug: "creatine", name: "Créatine", cat: "supplement", e: 5, c: 9, ev: "A", cost: "10–25 €/mois", tier: 1,
    one: "Le complément le plus étudié qui existe. Bon marché, sûr, améliore la force et probablement le cerveau." },
  { slug: "omega-3", name: "Oméga-3 (EPA/DHA)", cat: "supplement", e: 5, c: 7, ev: "A", cost: "15–35 €/mois", tier: 1,
    one: "Du poisson gras deux fois par semaine aide probablement. La capsule de 1 g vendue en pharmacie est surtout du gaspillage — les doses testées sont 4 à 10 fois plus élevées." },
  { slug: "vitamin-d3", name: "Vitamine D3", cat: "supplement", e: 4, c: 8, ev: "A", cost: "3–10 €/mois", tier: 1,
    one: "Si votre taux est bas, corrigez-le. S'il est normal, en prendre plus ne fait presque rien. Faites d'abord le test." },
  { slug: "vaccines", name: "Vaccins", cat: "lifestyle", e: 7, c: 9, ev: "A", cost: "Gratuit", tier: 1,
    one: "Grippe, zona, pneumocoque. N'apparaissent presque jamais sur les listes de longévité — ils devraient pourtant figurer en tête." },
  { slug: "oat-beta-glucan", name: "β-glucane d'avoine", cat: "lifestyle", e: 4, c: 9, ev: "A", cost: "3–8 €/mois", tier: 1,
    one: "Trois grammes par jour abaissent le LDL d'environ 7 %. La FDA approuve l'allégation cardiovasculaire — l'un des très rares aliments à en bénéficier." },
];

const TARGETED_SAMPLE = [
  { slug: "rapamycin", name: "Rapamycine", cat: "medication", e: 9, c: 4, ev: "D", cost: "30–140 €/mois", tier: 3,
    one: "Le signal d'extension de longévité le plus fort jamais observé chez les mammifères. Les données humaines de longévité sont encore attendues." },
  { slug: "metformin", name: "Metformine", cat: "medication", e: 5, c: 6, ev: "B", cost: "5–15 €/mois", tier: 2,
    one: "Bon marché, sûre chez les non-diabétiques, signal modeste de mortalité. L'essai TAME nous en dira plus." },
  { slug: "glp1-agonists", name: "Agonistes du GLP-1", cat: "medication", e: 7, c: 8, ev: "A", cost: "€€€", tier: 2,
    one: "Le sémaglutide et le tirzépatide refondent le traitement de l'obésité et réduisent nettement les événements cardiovasculaires." },
  { slug: "statins", name: "Statines", cat: "medication", e: 7, c: 10, ev: "A", cost: "5–15 €/mois", tier: 2,
    one: "Si votre risque ASCVD est élevé, le bénéfice absolu sur la mortalité est important. La classe de médicaments la plus testée en RCT sur ce site." },
  { slug: "sauna", name: "Sauna (finlandais)", cat: "lifestyle", e: 5, c: 7, ev: "B", cost: "0–75 €/mois", tier: 2,
    one: "4 à 7 séances par semaine à 80 °C de chaleur sèche. Signal cardiovasculaire aussi fort qu'un exercice modéré dans les données finlandaises." },
  { slug: "olive-oil-evoo", name: "Polyphénols d'huile d'olive (EVOO)", cat: "supplement", e: 5, c: 8, ev: "A", cost: "10–28 €/mois", tier: 2,
    one: "Deux à quatre cuillères à soupe par jour d'huile d'olive riche en polyphénols expliquent l'essentiel du signal méditerranéen." },
  { slug: "social-connection", name: "Lien social", cat: "lifestyle", e: 7, c: 8, ev: "A", cost: "Gratuit", tier: 1,
    one: "Selon certaines estimations, la solitude équivaut à fumer 15 cigarettes par jour. Compte parmi les fondamentaux." },
  { slug: "low-alcohol", name: "Peu / pas d'alcool", cat: "lifestyle", e: 6, c: 8, ev: "A", cost: "Économies", tier: 1,
    one: "Le récit du « un peu d'alcool est bon pour vous » n'a pas survécu aux données des années 2020. Moins, c'est mieux ; zéro, c'est très bien." },
];

const CONCERNS = [
  { slug: "cvd",            name: "Maladies cardiaques",     count: 48, line: "Les événements cardiovasculaires restent la première cause de mortalité après 40 ans." },
  { slug: "metabolic",      name: "Diabète / métabolique",   count: 39, line: "L'insulino-résistance est en amont de presque toutes les maladies chroniques." },
  { slug: "cognitive-decline", name: "Déclin cognitif",      count: 37, line: "Ce qui protège le cerveau est en grande partie ce qui protège le cœur — plus le sommeil." },
  { slug: "inflammaging",   name: "Inflammation chronique",  count: 25, line: "Le fil conducteur qui relie la moitié du catalogue." },
  { slug: "frailty",        name: "Fragilité",               count: 18, line: "Force, équilibre et masse maigre sont les leviers qui comptent." },
  { slug: "immune-decline", name: "Vieillissement immunitaire", count: 13, line: "Vaccins, sommeil et prévention des infections chroniques font l'essentiel du travail." },
  { slug: "sarcopenia",     name: "Perte musculaire",        count: 14, line: "Après 40 ans, vous perdez 1 % de muscle par an si vous ne réagissez pas." },
  { slug: "cancer",         name: "Risque de cancer",        count: 11, line: "La prévention du cancer est avant tout métabolique, complétée par quelques dépistages ciblés." },
  { slug: "bone-density",   name: "Perte osseuse",           count: 9,  line: "Musculation, vitamine D, K2 et — pour certaines — THM." },
  { slug: "senescence",     name: "Sénescence cellulaire",   count: 8,  line: "La frontière. Une vraie biologie, mais des preuves humaines encore faibles." },
  { slug: "mitochondrial",  name: "Déclin mitochondrial",    count: 12, line: "Zone 2, urolithine A et toute la longue histoire du fasting-mimicking." },
  { slug: "skin-aging",     name: "Vieillissement cutané",   count: 7,  line: "Crème solaire et non-tabagisme. Le reste relève de l'erreur d'arrondi." },
];

const NOTES = [
  { date: "2026-05-07", title: "Musculation — ce qu'il faut réellement faire",
    blurb: "Un protocole précis pour les objectifs de longévité — force, masse musculaire, densité osseuse. Avec les preuves LIFTMOR sur l'ostéoporose et la Norwegian Senior Strength Trial." },
  { date: "2026-05-07", title: "Ménopause et longévité, ce que disent vraiment les données",
    blurb: "À la ménopause, la longévité féminine diverge de la longévité masculine. Os, cardiovasculaire, cognitif — tout change de manière mesurable. Un regard pratique sur le moment opportun pour la THM." },
  { date: "2026-05-07", title: "Vaut-il la peine de prendre X ? Cinq questions avant tout nouveau complément",
    blurb: "Un cadre pratique applicable à tout ce que nous n'avons pas encore catalogué — avant que vous n'achetiez." },
  { date: "2026-05-07", title: "Inflammation : le fil conducteur qui explique la moitié du catalogue",
    blurb: "Pourquoi tant de nos interventions les mieux notées font aussi baisser l'inflammation — et où le récit s'effondre." },
];

window.FOUNDATION = FOUNDATION;
window.TARGETED_SAMPLE = TARGETED_SAMPLE;
window.CONCERNS = CONCERNS;
window.NOTES = NOTES;
