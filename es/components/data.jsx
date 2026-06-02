// Curated content used across all directions

const FOUNDATION = [
  { slug: "no-smoking", name: "No fumar", cat: "lifestyle", e: 10, c: 10, ev: "A", cost: "Gratis", tier: 1,
    one: "Si fuma, dejarlo es lo más eficaz que puede hacer por su longevidad. Nada más se acerca siquiera." },
  { slug: "sleep-architecture", name: "Sueño, 7–9 h, regular", cat: "lifestyle", e: 8, c: 8, ev: "A", cost: "0 €", tier: 1,
    one: "Horarios constantes, en una habitación oscura y fresca. La mayor mejora gratuita al alcance de la mayoría de los adultos." },
  { slug: "vo2max-training", name: "Entrenamiento VO₂máx", cat: "lifestyle", e: 9, c: 9, ev: "A", cost: "0–45 €/mes", tier: 1,
    one: "Intervalos cortos e intensos — 4×4 minutos cerca del máximo. La cifra individual más predictiva de la que disponemos." },
  { slug: "zone2-cardio", name: "Cardio Zona 2", cat: "lifestyle", e: 8, c: 9, ev: "A", cost: "0 €", tier: 1,
    one: "Cardio a ritmo de conversación que construye el motor mitocondrial del que vive el resto del cuerpo." },
  { slug: "resistance-training", name: "Entrenamiento de fuerza", cat: "lifestyle", e: 7, c: 9, ev: "A", cost: "30–75 €/mes", tier: 1,
    one: "Levantar pesado, dos veces por semana, a partir de los 40 no es opcional. La fuerza predice cuánto vivirá." },
  { slug: "mediterranean-diet", name: "Dieta mediterránea", cat: "lifestyle", e: 7, c: 9, ev: "A", cost: "Coste neutro", tier: 1,
    one: "Aceite de oliva, pescado, verduras y legumbres como base de las comidas. El patrón dietético más replicado en la literatura." },
  { slug: "protein-intake", name: "Proteína, 1,2–1,6 g/kg", cat: "lifestyle", e: 4, c: 8, ev: "A", cost: "20–35 €/mes", tier: 1,
    one: "La mayoría de los adultos — sobre todo a partir de los 50 — consume demasiado poca. Combinada con entrenamiento de fuerza, protege la masa muscular." },
  { slug: "creatine", name: "Creatina", cat: "supplement", e: 5, c: 9, ev: "A", cost: "10–25 €/mes", tier: 1,
    one: "El suplemento más estudiado que existe. Barato, seguro, mejora la fuerza y probablemente también el cerebro." },
  { slug: "omega-3", name: "Omega-3 (EPA/DHA)", cat: "supplement", e: 5, c: 7, ev: "A", cost: "15–35 €/mes", tier: 1,
    one: "Pescado azul dos veces por semana probablemente ayuda. La cápsula de 1 g de farmacia es en su mayoría desperdicio — las dosis estudiadas son entre 4 y 10 veces mayores." },
  { slug: "vitamin-d3", name: "Vitamina D3", cat: "supplement", e: 4, c: 8, ev: "A", cost: "3–10 €/mes", tier: 1,
    one: "Si su nivel es bajo, corríjalo. Si es normal, tomar más no aporta casi nada. Mídalo primero." },
  { slug: "vaccines", name: "Vacunas", cat: "lifestyle", e: 7, c: 9, ev: "A", cost: "Gratis", tier: 1,
    one: "Gripe, herpes zóster, neumococo. Casi nunca aparecen en las listas de longevidad — pero deberían estar entre las primeras." },
  { slug: "oat-beta-glucan", name: "β-glucano de avena", cat: "lifestyle", e: 4, c: 9, ev: "A", cost: "3–8 €/mes", tier: 1,
    one: "Tres gramos al día reducen el LDL alrededor de un 7 %. La FDA aprueba la declaración cardiovascular — uno de los pocos alimentos que la consiguen." },
];

const TARGETED_SAMPLE = [
  { slug: "rapamycin", name: "Rapamicina", cat: "medication", e: 9, c: 4, ev: "D", cost: "30–140 €/mes", tier: 3,
    one: "La señal de extensión de longevidad más fuerte jamás observada en mamíferos. Los datos humanos sobre longevidad siguen pendientes." },
  { slug: "metformin", name: "Metformina", cat: "medication", e: 5, c: 6, ev: "B", cost: "5–15 €/mes", tier: 2,
    one: "Barata, segura en personas no diabéticas, señal modesta sobre mortalidad. El ensayo TAME aportará más claridad." },
  { slug: "glp1-agonists", name: "Agonistas de GLP-1", cat: "medication", e: 7, c: 8, ev: "A", cost: "€€€", tier: 2,
    one: "La semaglutida y la tirzepatida transforman el tratamiento de la obesidad y reducen de forma notable los eventos cardiovasculares." },
  { slug: "statins", name: "Estatinas", cat: "medication", e: 7, c: 10, ev: "A", cost: "5–15 €/mes", tier: 2,
    one: "Si su riesgo ASCVD es elevado, el beneficio absoluto sobre la mortalidad es alto. La clase de fármacos más estudiada en ECA de toda la web." },
  { slug: "sauna", name: "Sauna (finlandesa)", cat: "lifestyle", e: 5, c: 7, ev: "B", cost: "0–75 €/mes", tier: 2,
    one: "De 4 a 7 sesiones semanales a 80 °C de calor seco. Señal cardiovascular tan fuerte como el ejercicio moderado en los datos finlandeses." },
  { slug: "olive-oil-evoo", name: "Polifenoles de AOVE", cat: "supplement", e: 5, c: 8, ev: "A", cost: "10–28 €/mes", tier: 2,
    one: "Entre dos y cuatro cucharadas al día de aceite de oliva virgen extra rico en polifenoles explican la mayor parte de la señal mediterránea." },
  { slug: "social-connection", name: "Conexión social", cat: "lifestyle", e: 7, c: 8, ev: "A", cost: "Gratis", tier: 1,
    one: "La soledad equivale, según algunas estimaciones, a fumar 15 cigarrillos al día. Forma parte de los cimientos." },
  { slug: "low-alcohol", name: "Poco / nada de alcohol", cat: "lifestyle", e: 6, c: 8, ev: "A", cost: "Ahorra dinero", tier: 1,
    one: "El relato de «una cantidad pequeña sienta bien» no ha sobrevivido a los datos de los años 2020. Menos es mejor; cero está perfectamente bien." },
];

const CONCERNS = [
  { slug: "cvd",            name: "Enfermedades cardíacas",   count: 48, line: "Los eventos cardiovasculares siguen siendo la principal causa de muerte a partir de los 40." },
  { slug: "metabolic",      name: "Diabetes / metabólico",    count: 39, line: "La resistencia a la insulina está aguas arriba de casi toda enfermedad crónica." },
  { slug: "cognitive-decline", name: "Deterioro cognitivo",   count: 37, line: "Lo que protege al cerebro es, en gran medida, lo que protege al corazón — más el sueño." },
  { slug: "inflammaging",   name: "Inflamación crónica",      count: 25, line: "El hilo conductor que conecta la mitad del catálogo." },
  { slug: "frailty",        name: "Fragilidad",               count: 18, line: "Fuerza, equilibrio y masa magra son las palancas que importan." },
  { slug: "immune-decline", name: "Envejecimiento inmunitario", count: 13, line: "Vacunas, sueño y evitar infecciones crónicas hacen la mayor parte del trabajo." },
  { slug: "sarcopenia",     name: "Pérdida muscular",         count: 14, line: "A partir de los 40, pierde un 1 % de masa muscular al año si no actúa en contra." },
  { slug: "cancer",         name: "Riesgo de cáncer",         count: 11, line: "La prevención del cáncer es, sobre todo, metabólica, complementada por unos pocos cribados específicos." },
  { slug: "bone-density",   name: "Pérdida ósea",             count: 9,  line: "Entrenamiento de fuerza, vitamina D, K2 y — para algunas — THS." },
  { slug: "senescence",     name: "Senescencia celular",      count: 8,  line: "La frontera. Biología real, evidencia humana aún débil." },
  { slug: "mitochondrial",  name: "Deterioro mitocondrial",   count: 12, line: "Zona 2, urolitina A y la larga historia del fasting-mimicking." },
  { slug: "skin-aging",     name: "Envejecimiento cutáneo",   count: 7,  line: "Protección solar y no fumar. El resto es error de redondeo." },
];

const NOTES = [
  { date: "2026-05-07", title: "Entrenamiento de fuerza — qué hacer realmente",
    blurb: "Un protocolo concreto para los objetivos de longevidad — fuerza, músculo, densidad ósea. Con la evidencia LIFTMOR sobre osteoporosis y el Norwegian Senior Strength Trial." },
  { date: "2026-05-07", title: "Menopausia y longevidad: lo que dicen realmente los datos",
    blurb: "En la menopausia, la longevidad femenina diverge de la masculina. Hueso, cardiovascular, cognición — todo cambia de forma medible. Una mirada práctica al momento adecuado para la THS." },
  { date: "2026-05-07", title: "¿Merece la pena tomar X? Cinco preguntas antes de cualquier suplemento nuevo",
    blurb: "Un marco práctico que puede aplicar a cualquier cosa que aún no hayamos catalogado — antes de comprar." },
  { date: "2026-05-07", title: "Inflamación: el hilo conductor que explica la mitad del catálogo",
    blurb: "Por qué tantas de nuestras intervenciones mejor valoradas también reducen la inflamación — y dónde se rompe la historia." },
];

window.FOUNDATION = FOUNDATION;
window.TARGETED_SAMPLE = TARGETED_SAMPLE;
window.CONCERNS = CONCERNS;
window.NOTES = NOTES;
