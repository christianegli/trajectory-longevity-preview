// Trajectory — assessment wizard v2 (multi-step, coach voice)
//
// Architecture:
//   - Multi-step state machine, each step renders a custom view
//   - State persisted in URL hash for back-button + shareability
//   - Final output is a tightly curated 5-12 item action plan,
//     not a filter dump.
//
// Tone: coach with doctor undertones. Direct, specific, warm.

(function () {
  'use strict';
  const mount = document.getElementById('wizard-mount');
  if (!mount) return;

  // ============================================================
  // State
  // ============================================================
  const state = {
    step: 0,
    answers: {
      age: null,
      sex: null,
      pregnant: null,
      goals: [],          // up to 2 from list
      exercise: null,     // sedentary | cardio_only | strength_only | both | athlete
      exercise_freq: null,// 0-7 sessions/week
      sleep: null,        // under_6 | 6_7 | 7_9 | over_9 | irregular
      diet: null,         // western | mediterranean | vegetarian | vegan | keto | mixed
      diet_quality_self: null, // poor | ok | good
      worry: [],          // primary concerns: heart, brain, weight, energy, frailty, longevity
      family: [],         // cv_early | dementia | cancer | t2d
      bmi: null,          // under | normal | over | obese | skip
      bp_status: null,    // normal | borderline | high | dontknow
      ldl_status: null,   // normal | borderline | high | dontknow
      glucose_status: null, // normal | prediabetes | t2d | dontknow
      meds: [],           // statin, bp, glp1, anticoag, immuno, ssri, metformin
      conditions: [],     // kidney, depression, ibs, osteoporosis, mci, nafld, cad, cancer_hist
      already_doing: [],  // omega3, vitd, creatine, mediterranean, fiber, etc.
      smoking: null,      // never | former | current
      alcohol: null,      // none | light | moderate | heavy
      appetite: null,     // minimum (3-5) | moderate (6-8) | allin (8-12)
      budget: null,       // tight | moderate | unlimited
    },
    items: null,
    flow: [],   // computed list of step ids in order, depending on answers
    history: [], // saved stacks (loaded from localStorage)
    previousStack: null, // when re-doing, holds the prior stack for diff
  };

  // ============================================================
  // Persistence (localStorage) + sharing (URL hash)
  // ============================================================
  const STORAGE_KEY = 'trajectory-stack-history';
  const STORAGE_MAX = 5;

  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function persistStack(answers, ranked) {
    try {
      const entry = {
        version: 1,
        timestamp: Date.now(),
        answers: deepClone(answers),
        stack: ranked.map(r => ({ slug: r.slug, leverage: !!r.leverage, priority: r.priority })),
      };
      const next = [entry, ...state.history].slice(0, STORAGE_MAX);
      state.history = next;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) { /* quota or disabled storage — best effort */ }
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function encodeAnswers(answers) {
    try {
      const json = JSON.stringify(answers);
      // base64url encoding (no padding, +/ → -_)
      return btoa(unescape(encodeURIComponent(json)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (e) { return ''; }
  }

  function decodeAnswers(encoded) {
    try {
      const padded = encoded.replace(/-/g, '+').replace(/_/g, '/') +
        '==='.slice((encoded.length + 3) % 4);
      const json = decodeURIComponent(escape(atob(padded)));
      return JSON.parse(json);
    } catch (e) { return null; }
  }

  function buildShareUrl(answers) {
    const enc = encodeAnswers(answers);
    return `${location.origin}${location.pathname}#share=${enc}`;
  }

  function readShareFromHash() {
    if (!location.hash || !location.hash.startsWith('#share=')) return null;
    return decodeAnswers(location.hash.slice('#share='.length));
  }

  function formatRelativeDate(ts) {
    if (!ts) return '';
    const diffMs = Date.now() - ts;
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.round(days / 7)} weeks ago`;
    if (days < 365) return `${Math.round(days / 30)} months ago`;
    return new Date(ts).toLocaleDateString();
  }

  function diffStacks(prev, current) {
    // prev/current: arrays of {slug, leverage, priority}
    const prevSlugs = new Set(prev.map(r => r.slug));
    const currentSlugs = new Set(current.map(r => r.slug));
    const added = current.filter(r => !prevSlugs.has(r.slug));
    const removed = prev.filter(r => !currentSlugs.has(r.slug));
    const same = current.filter(r => prevSlugs.has(r.slug));
    return { added, removed, same };
  }

  // ============================================================
  // Step definitions
  // ============================================================
  // Each step has: id, title, lede, render(), validate() (returns null or error msg)
  const STEPS = {
    intro: {
      title: "Build your stack",
      lede: "Eight short steps. About three minutes. We'll build a personalised, realistic plan — not a 30-supplement shopping list.",
      render: renderIntro,
      hideProgress: true,
    },
    basics: {
      title: "The basics",
      lede: "Two questions. Almost everything below depends on these.",
      render: renderBasics,
      validate: () => state.answers.age && state.answers.sex ? null : "Need age and sex to continue.",
    },
    pregnancy: {
      title: "Pregnancy",
      lede: "Many longevity interventions are contraindicated in pregnancy. Folate becomes essential.",
      render: renderPregnancy,
      showIf: () => state.answers.sex === 'female' && state.answers.age >= 18 && state.answers.age <= 50,
      validate: () => state.answers.pregnant ? null : "Pick one option.",
    },
    why: {
      title: "Why are you here?",
      lede: "Pick the one or two things that matter most to you. Not everything.",
      render: renderWhy,
      validate: () => state.answers.goals.length >= 1 ? null : "Pick at least one.",
    },
    movement: {
      title: "How you move",
      lede: "Be honest — this is the single biggest input.",
      render: renderMovement,
      validate: () => state.answers.exercise ? null : "Pick one.",
    },
    sleep: {
      title: "How you sleep",
      lede: null,
      render: renderSleep,
      validate: () => state.answers.sleep ? null : "Pick one.",
    },
    food: {
      title: "How you eat",
      lede: "Roughly. We're not counting macros.",
      render: renderFood,
      validate: () => state.answers.diet && state.answers.diet_quality_self ? null : "Pick both.",
    },
    habits: {
      title: "Smoking and alcohol",
      lede: "Be honest. These two answers can change your stack more than any supplement on the next page.",
      render: renderHabits,
      validate: () => state.answers.smoking ? null : "Pick a smoking option.",
    },
    body: {
      title: "Your body",
      lede: "All optional — pick \"don't know\" freely. We'll tailor what we can.",
      render: renderBody,
    },
    family: {
      title: "Family history",
      lede: "Things that ran in your immediate family before age 65. Drives priority on screening + prevention.",
      render: renderFamily,
    },
    meds_conds: {
      title: "What you're on, what you've got",
      lede: "Important for safety: we'll filter out things that conflict.",
      render: renderMedsConditions,
    },
    appetite: {
      title: "How much do you want to do?",
      lede: "Be realistic. A 4-item stack you actually do beats a 14-item one you abandon in two weeks.",
      render: renderAppetite,
      validate: () => state.answers.appetite ? null : "Pick one.",
    },
    review: {
      title: "Quick review",
      lede: "Anything you want to fix before we generate?",
      render: renderReview,
    },
  };

  // The flow always includes these in this order, with optional steps shown when relevant
  const BASE_FLOW = [
    'intro', 'basics', 'pregnancy', 'why',
    'movement', 'sleep', 'food', 'habits', 'body',
    'family', 'meds_conds', 'appetite', 'review'
  ];

  function computeFlow() {
    state.flow = BASE_FLOW.filter(id => {
      const s = STEPS[id];
      return !s.showIf || s.showIf();
    });
  }

  // ============================================================
  // DOM helpers
  // ============================================================
  function el(tag, props, ...children) {
    const e = document.createElement(tag);
    if (props) {
      for (const k in props) {
        if (props[k] == null) continue;
        if (k === 'class') e.className = props[k];
        else if (k === 'html') e.innerHTML = props[k];
        else if (k.startsWith('on') && typeof props[k] === 'function') e.addEventListener(k.slice(2), props[k]);
        else e.setAttribute(k, props[k]);
      }
    }
    children.flat().forEach(c => {
      if (c == null) return;
      if (typeof c === 'string' || typeof c === 'number') e.appendChild(document.createTextNode(String(c)));
      else e.appendChild(c);
    });
    return e;
  }

  // Bag of options for the current step that respond to 1-9 hotkeys.
  // Refreshed at the top of every renderShell pass.
  let currentHotkeyOptions = [];
  // Whether the current step's only field is a radio group (auto-advance candidate).
  let currentAutoAdvance = null; // function or null

  function radioGroup(name, options, current, onChange, opts) {
    opts = opts || {};
    // Register for 1-9 hotkeys (caps at 9 to fit single-key range).
    options.slice(0, 9).forEach((opt, i) => {
      currentHotkeyOptions.push({ key: String(i + 1), action: () => onChange(opt[0]) });
    });
    if (opts.autoAdvance) {
      currentAutoAdvance = opts.autoAdvance;
    }
    return el('div', { class: 'wiz-radio-group' },
      options.map(([val, label, sublabel], i) => {
        const id = `r_${name}_${val}`;
        const checked = current === val;
        const hotkey = i < 9 ? String(i + 1) : '';
        const wrap = el('label', {
            class: 'wiz-radio' + (checked ? ' wiz-radio-checked' : ''),
            for: id,
            'data-val': val,
          },
          el('input', {
            type: 'radio', name: name, id: id, value: val,
            checked: checked ? 'checked' : null,
            onchange: () => onChange(val),
          }),
          hotkey ? el('span', { class: 'wiz-hotkey', 'aria-hidden': 'true' }, hotkey) : null,
          el('span', { class: 'wiz-radio-body' },
            el('span', { class: 'wiz-radio-label' }, label),
            sublabel ? el('span', { class: 'wiz-radio-sub' }, sublabel) : null
          ),
          el('span', { class: 'wiz-radio-mark', 'aria-hidden': 'true' })
        );
        return wrap;
      })
    );
  }

  function checkGroup(name, options, currentSet, onChange, max) {
    options.slice(0, 9).forEach((opt, i) => {
      const val = opt[0];
      currentHotkeyOptions.push({
        key: String(i + 1),
        action: () => {
          if (currentSet.includes(val)) {
            onChange(currentSet.filter(v => v !== val));
          } else {
            if (max && currentSet.length >= max) return;
            onChange([...currentSet, val]);
          }
        },
      });
    });
    return el('div', { class: 'wiz-check-group' },
      options.map(([val, label, sublabel], i) => {
        const id = `c_${name}_${val}`;
        const checked = currentSet.includes(val);
        const hotkey = i < 9 ? String(i + 1) : '';
        const wrap = el('label', { class: 'wiz-check' + (checked ? ' wiz-check-checked' : ''), for: id },
          el('input', {
            type: 'checkbox', name: name, id: id, value: val,
            checked: checked ? 'checked' : null,
            onchange: (ev) => {
              if (ev.target.checked) {
                if (max && currentSet.length >= max) {
                  ev.target.checked = false;
                  return;
                }
                onChange([...currentSet, val]);
              } else {
                onChange(currentSet.filter(v => v !== val));
              }
            },
          }),
          hotkey ? el('span', { class: 'wiz-hotkey', 'aria-hidden': 'true' }, hotkey) : null,
          el('span', { class: 'wiz-check-body' },
            el('span', { class: 'wiz-check-label' }, label),
            sublabel ? el('span', { class: 'wiz-check-sub' }, sublabel) : null
          ),
          el('span', { class: 'wiz-check-mark', 'aria-hidden': 'true' })
        );
        return wrap;
      })
    );
  }

  // ============================================================
  // Step renderers
  // ============================================================

  function renderIntro() {
    // Personalization stripped per anti-account-creep rule.
    // Assessment is anonymous; no "Welcome back" / saved-stack history.
    return el('div', { class: 'wiz-intro-v2' },
      el('div', { class: 'wiz-intro-promise' },
        el('span', { class: 'wiz-intro-icon-pill' }, '🔒'),
        el('span', null, 'Runs entirely on your device — nothing is sent or stored.')
      ),
      el('div', { class: 'wiz-intro-promise' },
        el('span', { class: 'wiz-intro-icon-pill' }, '🧬'),
        el('span', null,
          el('strong', null, 'Honest in, honest out. '),
          'Saying "sedentary" gets you a better plan than pretending.'
        )
      ),
      el('p', { class: 'wiz-intro-foot' },
        'Not medical advice. Talk to your physician before starting medications or stopping anything you\'re on.')
    );
  }

  function renderBasics() {
    return el('div', { class: 'wiz-basics' },
      el('div', { class: 'wiz-field' },
        el('label', { class: 'wiz-field-label' }, 'Your age'),
        el('input', {
          type: 'number', min: 18, max: 110,
          class: 'wiz-input wiz-input-age',
          value: state.answers.age || '',
          oninput: (ev) => state.answers.age = parseInt(ev.target.value, 10) || null,
        })
      ),
      el('div', { class: 'wiz-field' },
        el('label', { class: 'wiz-field-label' }, 'Sex assigned at birth'),
        radioGroup('sex',
          [['female', 'Female'], ['male', 'Male'], ['skip', 'Prefer not to say']],
          state.answers.sex,
          (v) => { state.answers.sex = v; rerender(); }),
      )
    );
  }

  function renderPregnancy() {
    return radioGroup('pregnant', [
      ['yes', 'Yes — pregnant, breastfeeding, or actively trying',
        'We\'ll prioritise folate and remove anything contraindicated in pregnancy.'],
      ['no', 'No', 'Standard recommendations.'],
    ], state.answers.pregnant, (v) => { state.answers.pregnant = v; rerender(); }, { autoAdvance: true });
  }

  function renderWhy() {
    return el('div', null,
      el('p', { class: 'wiz-q-help' }, 'Pick 1–2. The plan will weight everything toward these.'),
      checkGroup('goals', [
        ['longevity', 'Live longer (general healthspan)', 'Broad foundation, no specific concern.'],
        ['cardiovascular', 'Heart health', 'Most evidence-rich category.'],
        ['cognitive', 'Brain & memory', 'Sleep, cardio, omega-3, social connection are the levers.'],
        ['metabolic', 'Metabolic / weight', 'Glucose control, body composition, fatty liver.'],
        ['frailty', 'Stay strong as I age', 'Muscle, bone, balance — sarcopenia prevention.'],
        ['energy', 'Energy & vitality', 'Sleep, iron, thyroid, mitochondrial.'],
        ['performance', 'Physical performance', 'Athletic-grade interventions.'],
      ], state.answers.goals, (v) => { state.answers.goals = v; rerender(); }, 2)
    );
  }

  function renderMovement() {
    return el('div', null,
      el('p', { class: 'wiz-q-help' }, 'Honest assessment of an average week.'),
      radioGroup('exercise', [
        ['sedentary', 'Sedentary', 'Less than one structured session a week.'],
        ['cardio_only', 'Cardio only', 'Walking, running, cycling. No lifting.'],
        ['strength_only', 'Strength only', 'I lift but I don\'t do cardio.'],
        ['both', 'Both', 'Mix of cardio and strength most weeks.'],
        ['athlete', 'High volume', 'Training 5+ hours a week, competitive or close.'],
      ], state.answers.exercise, (v) => { state.answers.exercise = v; rerender(); }, { autoAdvance: true })
    );
  }

  function renderSleep() {
    return radioGroup('sleep', [
      ['under_6', 'Under 6 hours most nights', 'The single biggest health upgrade for most people.'],
      ['6_7', '6–7 hours', 'A bit short. Worth fixing.'],
      ['7_9', '7–9 hours, fairly consistent', 'Where you want to be.'],
      ['over_9', 'Over 9 hours', 'Sometimes a marker of underlying issues.'],
      ['irregular', 'Wildly irregular', 'Shift work, jet lag, kids — variability matters more than total.'],
    ], state.answers.sleep, (v) => { state.answers.sleep = v; rerender(); }, { autoAdvance: true });
  }

  function renderFood() {
    return el('div', null,
      el('div', { class: 'wiz-field' },
        el('label', { class: 'wiz-field-label' }, 'Closest pattern to your usual diet'),
        radioGroup('diet', [
          ['western', 'Standard Western', 'Lots of processed, low fish/vegetables.'],
          ['mediterranean', 'Mediterranean-leaning', 'Olive oil, fish, vegetables, legumes.'],
          ['vegetarian', 'Vegetarian'],
          ['vegan', 'Vegan'],
          ['keto', 'Keto / low-carb'],
          ['mixed', 'Mixed / hard to label'],
        ], state.answers.diet, (v) => { state.answers.diet = v; rerender(); })
      ),
      el('div', { class: 'wiz-field' },
        el('label', { class: 'wiz-field-label' }, 'Your honest assessment of how well you eat'),
        radioGroup('diet_quality_self', [
          ['poor', 'Poor', 'I know it\'s not great.'],
          ['ok', 'OK', 'Some good, some bad.'],
          ['good', 'Good', 'Mostly whole foods, vegetables, fish, etc.'],
        ], state.answers.diet_quality_self, (v) => { state.answers.diet_quality_self = v; rerender(); })
      )
    );
  }

  function renderHabits() {
    return el('div', null,
      el('div', { class: 'wiz-field' },
        el('label', { class: 'wiz-field-label' }, 'Smoking status'),
        radioGroup('smoking', [
          ['never', 'Never smoked', 'Or under 100 cigarettes lifetime.'],
          ['former', 'Former smoker, quit', 'Risk drops fast — most CV benefit returns within 1–5 years.'],
          ['current', 'Currently smoke', 'Quitting is the single highest-impact thing on this site, period.'],
        ], state.answers.smoking, (v) => { state.answers.smoking = v; rerender(); })
      ),
      el('div', { class: 'wiz-field' },
        el('label', { class: 'wiz-field-label' }, 'Alcohol — typical week'),
        radioGroup('alcohol', [
          ['none', 'None', 'Lowest-risk option.'],
          ['light', 'Up to 3 drinks / week', 'Roughly background-equivalent risk.'],
          ['moderate', '4–10 drinks / week', 'Modest cardiovascular and cancer signal.'],
          ['heavy', '10+ drinks / week', 'Material risk — sleep, BP, liver, cancer all hit.'],
        ], state.answers.alcohol, (v) => { state.answers.alcohol = v; rerender(); })
      )
    );
  }

  function renderBody() {
    return el('div', null,
      el('div', { class: 'wiz-field' },
        el('label', { class: 'wiz-field-label' }, 'Body weight'),
        radioGroup('bmi', [
          ['under', 'Underweight'],
          ['normal', 'Normal'],
          ['over', 'Overweight'],
          ['obese', 'Significantly overweight (BMI 30+)'],
          ['skip', 'Skip'],
        ], state.answers.bmi, (v) => { state.answers.bmi = v; rerender(); })
      ),
      el('div', { class: 'wiz-field' },
        el('label', { class: 'wiz-field-label' }, 'Blood pressure (best you know)'),
        radioGroup('bp_status', [
          ['normal', 'Normal'],
          ['borderline', 'Borderline / pre-hypertension'],
          ['high', 'High (diagnosed or 140+ regularly)'],
          ['dontknow', "Don't know"],
        ], state.answers.bp_status, (v) => { state.answers.bp_status = v; rerender(); })
      ),
      el('div', { class: 'wiz-field' },
        el('label', { class: 'wiz-field-label' }, 'Cholesterol (LDL or ApoB)'),
        radioGroup('ldl_status', [
          ['normal', 'Normal'],
          ['borderline', 'Borderline'],
          ['high', 'High / on a statin'],
          ['dontknow', "Don't know"],
        ], state.answers.ldl_status, (v) => { state.answers.ldl_status = v; rerender(); })
      ),
      el('div', { class: 'wiz-field' },
        el('label', { class: 'wiz-field-label' }, 'Blood sugar / metabolic'),
        radioGroup('glucose_status', [
          ['normal', 'Normal'],
          ['prediabetes', 'Pre-diabetes / insulin resistance'],
          ['t2d', 'Type 2 diabetes'],
          ['dontknow', "Don't know"],
        ], state.answers.glucose_status, (v) => { state.answers.glucose_status = v; rerender(); })
      )
    );
  }

  function renderFamily() {
    return checkGroup('family', [
      ['cv_early', 'Heart attack or stroke (parent/sibling before 65)'],
      ['dementia', 'Dementia or Alzheimer\'s'],
      ['cancer', 'Cancer'],
      ['t2d_fam', 'Type 2 diabetes'],
    ], state.answers.family, (v) => { state.answers.family = v; rerender(); });
  }

  function renderMedsConditions() {
    return el('div', null,
      el('div', { class: 'wiz-field' },
        el('label', { class: 'wiz-field-label' }, 'Currently on (check all that apply)'),
        checkGroup('meds', [
          ['statin', 'Statin (atorvastatin, rosuvastatin, etc.)'],
          ['bp_med', 'Blood pressure medication'],
          ['glp1', 'GLP-1 (Ozempic, Wegovy, Mounjaro)'],
          ['metformin', 'Metformin'],
          ['anticoagulant', 'Anticoagulant or daily aspirin'],
          ['immunosuppressant', 'Immunosuppressant or chemotherapy'],
          ['ssri', 'Antidepressant (SSRI/SNRI)'],
        ], state.answers.meds, (v) => { state.answers.meds = v; rerender(); })
      ),
      el('div', { class: 'wiz-field' },
        el('label', { class: 'wiz-field-label' }, 'Diagnosed conditions (check all that apply)'),
        checkGroup('conditions', [
          ['cad', 'Coronary artery disease / prior heart attack'],
          ['kidney', 'Chronic kidney disease'],
          ['nafld', 'Fatty liver (NAFLD/MASLD)'],
          ['osteoporosis', 'Osteoporosis or osteopenia'],
          ['mci', 'Mild cognitive impairment'],
          ['depression', 'Depression / anxiety (current)'],
          ['ibs', 'IBS or chronic constipation'],
          ['cancer_hist', 'Cancer history'],
        ], state.answers.conditions, (v) => { state.answers.conditions = v; rerender(); })
      )
    );
  }

  function renderAppetite() {
    return el('div', null,
      el('div', { class: 'wiz-field' },
        el('label', { class: 'wiz-field-label' }, 'How big a stack do you actually want?'),
        radioGroup('appetite', [
          ['minimum', 'Just the essentials',
            'The 3–5 highest-leverage things for me. Don\'t overwhelm.'],
          ['moderate', 'A real stack',
            '6–8 items. Enough to make a difference, not so many I quit.'],
          ['allin', 'Show me the full plan',
            '8–12 items. I\'m committed and will work my way through them.'],
        ], state.answers.appetite, (v) => { state.answers.appetite = v; rerender(); })
      ),
      el('div', { class: 'wiz-field' },
        el('label', { class: 'wiz-field-label' }, 'Monthly budget for supplements / interventions'),
        radioGroup('budget', [
          ['tight', 'Tight — under $30/mo',
            'Stick to free habits + cheap basics like vitamin D, fish oil, oats.'],
          ['moderate', '$30–$100/mo',
            'Standard. Most evidence-based supplements are in this range.'],
          ['unlimited', 'No real limit',
            'Frontier interventions (rapamycin, GLP-1) become an option to discuss.'],
        ], state.answers.budget, (v) => { state.answers.budget = v; rerender(); })
      )
    );
  }

  function renderReview() {
    const a = state.answers;
    function row(label, value) {
      return el('div', { class: 'wiz-review-row' },
        el('span', { class: 'wiz-review-label' }, label),
        el('span', { class: 'wiz-review-value' }, value || '—'));
    }
    function joinList(arr, fallback) {
      return arr && arr.length ? arr.join(', ') : (fallback || 'none');
    }
    return el('div', { class: 'wiz-review' },
      row('Age', a.age),
      row('Sex', a.sex),
      a.pregnant === 'yes' ? row('Pregnant/trying', 'Yes') : null,
      row('Goals', joinList(a.goals)),
      row('Exercise', a.exercise),
      row('Sleep', a.sleep),
      row('Diet', a.diet + (a.diet_quality_self ? ` (${a.diet_quality_self})` : '')),
      row('Smoking', a.smoking),
      row('Alcohol', a.alcohol),
      row('BMI', a.bmi),
      row('BP', a.bp_status),
      row('LDL', a.ldl_status),
      row('Glucose', a.glucose_status),
      row('Family hx', joinList(a.family)),
      row('Meds', joinList(a.meds)),
      row('Conditions', joinList(a.conditions)),
      row('Appetite', a.appetite),
      row('Budget', a.budget),
      el('p', { class: 'wiz-review-edit' },
        'To change anything, use Back. Then Generate.')
    );
  }

  // ============================================================
  // Main render with progress + nav
  // ============================================================
  let keyHandler = null;
  let errorEl = null;

  function renderShell(stepId) {
    mount.innerHTML = '';
    const step = STEPS[stepId];
    const idx = state.flow.indexOf(stepId);
    const total = state.flow.filter(id => !STEPS[id].hideProgress).length;
    const stepNum = state.flow.slice(0, idx).filter(id => !STEPS[id].hideProgress).length + 1;
    const isFirst = idx === 0;
    const isLast = stepId === 'review';

    // Reset hotkey + autoAdvance bag for this step. radioGroup/checkGroup
    // calls below populate them as the body is rendered.
    currentHotkeyOptions = [];
    currentAutoAdvance = null;

    // Progress
    if (!step.hideProgress) {
      const pct = Math.round((stepNum / total) * 100);
      mount.appendChild(el('div', { class: 'wiz-progress wiz-progress-v2' },
        el('div', { class: 'wiz-progress-bar' },
          el('div', { class: 'wiz-progress-fill', style: `width:${pct}%` })),
        el('div', { class: 'wiz-progress-meta' },
          el('span', { class: 'wiz-progress-step' }, `Step ${stepNum} of ${total}`),
          el('span', { class: 'wiz-progress-pct' }, `${pct}%`)
        )
      ));
    }

    // Header
    mount.appendChild(el('header', { class: 'wiz-step-head wiz-step-head-v2' },
      el('h2', { class: 'wiz-step-title' }, step.title),
      step.lede ? el('p', { class: 'wiz-step-lede' }, step.lede) : null
    ));

    // Body — wrap so we can apply a slide-in transition
    const body = el('div', { class: 'wiz-step-body wiz-step-body-v2' });
    body.appendChild(step.render());
    mount.appendChild(body);

    // Inline error placeholder (hidden until validation fails)
    errorEl = el('div', { class: 'wiz-error-msg', role: 'alert', 'aria-live': 'polite', hidden: 'hidden' });
    mount.appendChild(errorEl);

    // Nav
    const nav = el('div', { class: 'wiz-nav wiz-nav-v2' });
    if (!isFirst) {
      nav.appendChild(el('button', {
        type: 'button', class: 'wiz-btn wiz-btn-secondary',
        onclick: () => { goPrev(); },
      }, '← Back'));
    } else {
      nav.appendChild(el('span', null));
    }
    const ctaLabel = isLast ? 'Show my plan →' : (idx === 0 ? 'Start →' : 'Continue →');
    nav.appendChild(el('button', {
      type: 'button', class: 'wiz-btn wiz-btn-primary',
      onclick: () => { goNext(); },
    }, ctaLabel));
    mount.appendChild(nav);

    // Footer hint about keyboard shortcuts
    if (!step.hideProgress) {
      mount.appendChild(el('div', { class: 'wiz-shortcuts' },
        el('span', null, 'Tip: '),
        el('kbd', null, '1'), el('span', { class: 'wiz-shortcuts-sep' }, '–'),
        el('kbd', null, '9'), el('span', null, ' to choose · '),
        el('kbd', null, 'Enter'), el('span', null, ' to continue · '),
        el('kbd', null, 'Esc'), el('span', null, ' to go back')
      ));
    }

    // Wire keyboard shortcuts at the document level (replace any prior).
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    keyHandler = function (ev) {
      // Don't intercept while user is typing in a text/number/search input.
      const tag = (ev.target && ev.target.tagName) || '';
      const type = (ev.target && ev.target.type) || '';
      if (tag === 'INPUT' && (type === 'number' || type === 'text' || type === 'search' || type === 'email')) {
        if (ev.key === 'Enter') { ev.preventDefault(); goNext(); }
        return;
      }
      if (tag === 'TEXTAREA') return;
      if (ev.key === 'Enter')      { ev.preventDefault(); goNext(); return; }
      if (ev.key === 'Escape')     { ev.preventDefault(); goPrev(); return; }
      if (ev.key === 'Backspace' && !isFirst) { ev.preventDefault(); goPrev(); return; }
      if (/^[1-9]$/.test(ev.key)) {
        const opt = currentHotkeyOptions.find(o => o.key === ev.key);
        if (opt) { ev.preventDefault(); opt.action(); }
      }
    };
    document.addEventListener('keydown', keyHandler);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showInlineError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.hidden = false;
    // Remove the error after 4s or on next interaction
    setTimeout(() => { if (errorEl) errorEl.hidden = true; }, 4000);
  }

  function rerender() {
    // Recompute flow in case answers changed visibility (pregnancy)
    computeFlow();
    renderShell(state.flow[state.step]);
    // If this step is auto-advance and a valid radio was just selected,
    // glide forward after a short confirmation pause.
    if (currentAutoAdvance) {
      const id = state.flow[state.step];
      const step = STEPS[id];
      const ok = step.validate ? !step.validate() : true;
      if (ok) {
        setTimeout(() => {
          // Sanity-check: only auto-advance if the user is still on this step
          // and hasn't navigated away.
          if (state.flow[state.step] === id) goNext();
        }, 280);
      }
    }
  }

  function goNext() {
    const id = state.flow[state.step];
    const step = STEPS[id];
    if (step.validate) {
      const err = step.validate();
      if (err) { showInlineError(err); return; }
    }
    if (id === 'review') {
      generate();
      return;
    }
    state.step += 1;
    rerender();
  }

  function goPrev() {
    if (state.step > 0) {
      state.step -= 1;
      rerender();
    }
  }

  // ============================================================
  // RECOMMENDATION ENGINE
  // ============================================================
  // Output is a curated 5-12 item plan, NOT a filter.
  //
  // Algorithm:
  //   1. Find the user's "leverage points" — the 1-3 biggest gaps
  //      between their situation and optimal.
  //   2. Each leverage point produces a primary action (1 item).
  //   3. Add 2-3 quick wins (high-evidence, low-effort, not already doing).
  //   4. Add 1-3 "discuss with doctor" items if conditions warrant.
  //   5. Cap by appetite.
  //
  // Each recommendation is wrapped with coach-voice text explaining
  // why it's #1 vs #5 for this person.

  function findItem(slug) {
    return state.items.find(it => it.slug === slug);
  }

  function isContraindicated(slug) {
    const a = state.answers;
    // Pregnancy hard contraindications
    const pregBad = ['rapamycin', 'metformin', 'statins', 'low-dose-aspirin', 'curcumin',
      'ashwagandha', 'fisetin', 'dasatinib-quercetin', 'pterostilbene', 'low-alcohol',
      'sauna', 'finasteride', '17a-estradiol', 'sglt2-inhibitors', 'sulforaphane',
      'berberine', 'nmn', 'nr', 'spermidine', 'urolithin-a'];
    if (a.pregnant === 'yes' && pregBad.includes(slug)) return 'Contraindicated in pregnancy.';

    // Anticoagulants — bleeding risk
    const anticoagBad = ['low-dose-aspirin', 'curcumin', 'dasatinib-quercetin', 'fisetin'];
    if (a.meds.includes('anticoagulant') && anticoagBad.includes(slug)) {
      return 'Bleeding risk on top of your anticoagulant — don\'t add without prescriber sign-off.';
    }

    // Already on it
    if (a.meds.includes('statin') && slug === 'statins') return 'You\'re already on a statin.';
    if (a.meds.includes('glp1') && slug === 'glp1-agonists') return 'You\'re already on a GLP-1.';
    if (a.meds.includes('metformin') && (slug === 'metformin' || slug === 'berberine'))
      return 'You\'re already on metformin (or duplicate pathway).';
    if (a.meds.includes('bp_med') && slug === 'ace-inhibitors') return 'You\'re already on a BP medication — talk to your prescriber before changing.';

    // CKD
    if (a.conditions.includes('kidney') && (slug === 'creatine' || slug === 'sglt2-inhibitors' || slug === 'protein-intake')) {
      return 'CKD: needs nephrologist input — don\'t self-start.';
    }

    // Cancer history + immunomodulators
    if (a.conditions.includes('cancer_hist') && (slug === 'rapamycin' || slug === 'low-alcohol')) {
      return 'Cancer history: discuss with oncology first.';
    }

    return null;
  }

  function findLeveragePoints() {
    const a = state.answers;
    const points = [];

    // Smoking is the single highest-impact lever — outranks everything.
    if (a.smoking === 'current') {
      points.push({
        slug: 'no-smoking',
        priority: 200,
        leverage: true,
        triggers: ['Currently smoking'],
        coach: "Nothing else on this site comes close. Quitting at any age extends life expectancy by 3–10 years and starts paying off within weeks. Every other recommendation here is a rounding error compared to this one.",
        action: "See your physician this week. Combination therapy works best: nicotine replacement (patch + gum) plus varenicline or bupropion, plus behavioural support (Quitline 1-800-QUIT-NOW in the US). Set a quit date 1–2 weeks out and pre-commit. Most successful quitters need 6–8 attempts — relapse is part of the data, not failure.",
        whatToMonitor: 'Days smoke-free. Resting heart rate (drops within weeks). Blood pressure. Subjective breathing during exercise.',
      });
    } else if (a.smoking === 'former') {
      // Former smokers: keep the pressure off but acknowledge the win.
      points.push({
        slug: 'no-smoking',
        priority: 30,
        leverage: false,
        triggers: ['Former smoker — risk continues to drop'],
        coach: "Already done. Most cardiovascular risk returns to never-smoked baseline within 5–15 years. Don't relapse — that's the entire protocol.",
        action: 'No active intervention. Be alert to relapse triggers (alcohol, stress, social settings).',
        whatToMonitor: 'Years smoke-free. Lung function on routine physicals.',
      });
    }

    // Heavy alcohol is its own meaningful lever — separate from smoking.
    if (a.alcohol === 'heavy') {
      points.push({
        slug: 'low-alcohol',
        priority: 75,
        leverage: true,
        triggers: ['10+ drinks per week'],
        coach: "Heavy alcohol hits sleep, blood pressure, liver, breast cancer, AFib, and cognitive aging — often before any single one of those crosses a clinical threshold. The 2018 Lancet GBD analysis put the lowest-risk level at zero; modern reanalyses agree the J-curve in older studies was confounded.",
        action: "Cut to ≤3 drinks/week as a 30-day target, ideally none on weeknights. Track in any drinks-tracker app. Replace the social ritual, not the alcohol — non-alcoholic beer or sparkling water with bitters works.",
        whatToMonitor: 'Sleep quality (wearable readiness scores), morning resting heart rate, BP. Most see a measurable improvement in 2–3 weeks.',
      });
    } else if (a.alcohol === 'moderate' && (a.bp_status === 'high' || a.ldl_status === 'high' || a.sleep === 'under_6')) {
      points.push({
        slug: 'low-alcohol',
        priority: 50,
        leverage: false,
        triggers: ['4–10 drinks per week', a.bp_status === 'high' ? 'High BP' : a.ldl_status === 'high' ? 'High LDL' : 'Sleep <6h'],
        coach: "Moderate intake plus BP/LDL/sleep issues compounds — alcohol is one of the few interventions where cutting back fixes multiple things at once.",
        action: 'Drop to ≤3/week for 4 weeks and re-measure BP and sleep. Easiest single behavioural change for cardiometabolic markers.',
        whatToMonitor: 'Home BP, sleep regularity, morning resting heart rate.',
      });
    }

    // Sleep < 6h is typically the biggest single lever for tired adults
    if (a.sleep === 'under_6') {
      points.push({
        slug: 'sleep-architecture',
        priority: 100,
        leverage: true,
        triggers: ['You sleep <6 hours most nights'],
        coach: 'You\'re running on under 6 hours. This is your single biggest lever — bigger than any pill on this site. Fix this first; everything else compounds.',
        action: 'Pick a fixed wake time for the next 14 days. Same time, every day, weekends included. Then back-calculate bedtime for 7.5 hours. No screens 60 min before. Cool dark room.',
        whatToMonitor: 'Track total sleep with any wearable (Oura, Garmin, Apple Watch, Whoop) or just a sleep diary. Aim for 7.5+ hours. Re-check in 2 weeks.',
      });
    } else if (a.sleep === '6_7' && (a.worry?.includes('cognitive') || a.goals.includes('cognitive') || a.goals.includes('energy'))) {
      points.push({
        slug: 'sleep-architecture',
        priority: 70,
        leverage: true,
        triggers: ['You sleep 6–7 hours', a.goals.includes('cognitive') ? 'Goal: brain & memory' : 'Goal: energy & vitality'],
        coach: '6–7 hours is short of optimal, especially given your cognitive/energy goal. Pushing to 7.5+ is one of the highest-leverage moves available to you.',
        action: 'Bedtime 30 min earlier for the next 4 weeks. Test the difference.',
        whatToMonitor: 'Daytime energy, focus, mood at 4 weeks.',
      });
    }

    // Sedentary + cardiovascular goal/concern → cardio is #1
    if (a.exercise === 'sedentary') {
      const goalsCardio = a.goals.includes('cardiovascular') || a.worry?.includes('heart') || a.family.includes('cv_early') || a.bp_status === 'high' || a.ldl_status === 'high';
      const goalsCognitive = a.goals.includes('cognitive') || a.family.includes('dementia');
      const goalsFrailty = a.goals.includes('frailty') || a.age >= 60;

      if (goalsFrailty) {
        points.push({
          slug: 'resistance-training',
          priority: 90,
          leverage: true,
          triggers: ['Currently sedentary', a.goals.includes('frailty') ? 'Goal: stay strong as you age' : `Age ${a.age}`],
          coach: `At ${a.age}, sedentary is the biggest single risk for losing your independence in your 70s and 80s. Strength is the most modifiable mortality predictor we have.`,
          action: '2× per week, 45 min. 4 compound movements: squat, hinge (deadlift/RDL), push (DB press), pull (row). 3 sets of 6–10 reps. Start with body weight or light dumbbells. Hire a trainer for the first 4 sessions if you\'ve never lifted.',
          whatToMonitor: 'Grip strength (any cheap dynamometer, $20). 30-second chair stand test. Re-test every 8 weeks.',
        });
      }
      points.push({
        slug: 'zone2-cardio',
        priority: goalsCardio ? 95 : 80,
        leverage: true,
        triggers: [
          'Currently sedentary',
          goalsCardio
            ? (a.bp_status === 'high' ? 'High BP'
              : a.ldl_status === 'high' ? 'High cholesterol'
              : a.family.includes('cv_early') ? 'Family hx: early heart disease'
              : 'Goal: heart health')
            : 'Aerobic baseline = highest mortality leverage available',
        ],
        coach: goalsCardio
          ? 'Sedentary + cardiovascular focus. Easy aerobic work is the biggest intervention at your fingertips — bigger than any single supplement, comparable to a moderate-dose statin in long-term mortality terms.'
          : 'Going from zero to even 2 sessions a week of easy cardio captures most of the lifespan benefit. Don\'t make it complicated.',
        action: '3× 30 min per week of "talkable pace" — fast walking, easy jogging, cycling. The conversational test: you should be able to hold a sentence but not sing. That\'s zone 2.',
        whatToMonitor: 'Heart rate at conversational pace (lower over weeks = adaptation). Resting heart rate should drop 5–10 bpm in 8 weeks.',
      });
      if (goalsCognitive || goalsCardio) {
        points.push({
          slug: 'vo2max-training',
          priority: 65,
          leverage: false,
          triggers: ['Currently sedentary', goalsCognitive ? (a.family.includes('dementia') ? 'Family hx: dementia' : 'Goal: brain & memory') : 'Goal: heart health'],
          coach: 'Once you have a base (4–6 weeks of zone 2), add 1 session a week of hard intervals. VO2max is the strongest single fitness-mortality predictor — and it\'s trainable at any age.',
          action: 'Once a week: 4× 4 min at hard effort (8/10 RPE, can barely speak), 3 min easy between. After warm-up of 10 min easy.',
          whatToMonitor: '12-min run/walk distance. Should improve 5–10% in 8 weeks.',
        });
      }
    } else if (a.exercise === 'cardio_only' && (a.age >= 50 || a.goals.includes('frailty'))) {
      points.push({
        slug: 'resistance-training',
        priority: 80,
        leverage: true,
        triggers: ['Cardio only — no lifting', a.age >= 50 ? `Age ${a.age}` : 'Goal: stay strong as you age'],
        coach: `Cardio is great. But at ${a.age}, cardio without lifting still loses muscle every year. The gap between "doing some cardio" and "also lifting twice a week" is the gap between independent at 80 and not.`,
        action: '2× per week, 45 min. Squat, hinge, push, pull. 3 sets of 6–10 reps. Progressive overload — add weight or reps every couple of weeks.',
        whatToMonitor: 'Strength on key lifts (track in a notebook). Grip strength.',
      });
    } else if (a.exercise === 'strength_only') {
      points.push({
        slug: 'zone2-cardio',
        priority: 70,
        leverage: true,
        triggers: ['Strength only — no cardio'],
        coach: 'Lifting is great but you\'re leaving the biggest cardiovascular and brain benefits on the table without aerobic work.',
        action: '2–3× per week of 30 min "talkable pace" cardio. Walk, easy bike, easy jog.',
        whatToMonitor: 'Resting heart rate (drops with adaptation).',
      });
    }

    // Diet leverage point: Western + poor self-rating + cardiovascular goal/risk
    if ((a.diet === 'western' || a.diet === 'mixed') && a.diet_quality_self === 'poor') {
      points.push({
        slug: 'mediterranean-diet',
        priority: 75,
        leverage: true,
        triggers: [a.diet === 'western' ? 'Standard Western diet' : 'Mixed/hard-to-label diet', 'Self-rated diet quality: poor'],
        coach: 'Diet quality is the lever you\'re honest about. The Mediterranean pattern has the best RCT evidence in cardiovascular medicine — PREDIMED showed 28% reduction in heart events in 5 years.',
        action: 'One change a week for 8 weeks. Week 1: olive oil for cooking + dressing. Week 2: fish 2× a week. Week 3: vegetables at every meal. Week 4: nuts daily. Week 5: legumes 3×/week. Week 6: cut processed meat. Week 7: less added sugar. Week 8: red wine only with dinner if at all.',
        whatToMonitor: 'Energy, weight, lipids if testing. Most see noticeable energy improvement in 3–4 weeks.',
      });
    }

    // Cardiovascular leverage: high LDL or family hx
    if (a.ldl_status === 'high' && !a.meds.includes('statin')) {
      points.push({
        slug: 'statins',
        priority: 90,
        leverage: true,
        discussWithDoctor: true,
        triggers: ['High LDL/cholesterol', 'Not currently on a statin'],
        coach: 'You said your LDL/cholesterol is high and you\'re not on a statin. This is the conversation to have with your physician this month — statins are the single best-validated longevity drug we have.',
        action: 'Book an appointment. Ask specifically about ApoB testing (better than standard LDL) and a coronary calcium score (CAC) if you\'re 40+. With those numbers, you and your doctor can decide whether to start a statin and which one.',
        whatToMonitor: 'ApoB, LDL, ALT, CK at 6–12 weeks after starting (if you do).',
      });
      points.push({
        slug: 'psyllium',
        priority: 50,
        leverage: false,
        triggers: ['High LDL/cholesterol', 'Cheap fiber bridge while statin decision is made'],
        coach: 'While you\'re sorting out the statin question, fiber lowers LDL ~9% — almost as much as a low-dose statin. Cheapest evidence-based supplement on this list.',
        action: 'Start with 5g (1 tsp) Metamucil sugar-free in 250 mL water once a day. Build to 7–15g/day over 2 weeks. Take medications 2 hours apart from psyllium.',
        whatToMonitor: 'LDL at next test (8–12 weeks). Expected: 5–10% drop.',
      });
    }

    // Hypertension
    if (a.bp_status === 'high' && !a.meds.includes('bp_med')) {
      points.push({
        slug: 'ace-inhibitors',
        priority: 85,
        leverage: true,
        discussWithDoctor: true,
        triggers: ['High blood pressure', 'Not currently on BP medication'],
        coach: 'High BP and not on medication. This is the doctor conversation — uncontrolled hypertension is the single biggest stroke and dementia risk factor that\'s easily fixable.',
        action: 'Book an appointment. ACE inhibitors / ARBs are first-line and have direct mortality evidence. Also: home BP cuff (Omron, $40), measure morning and evening for 2 weeks before the appointment.',
        whatToMonitor: 'Home BP (target <130/80). Re-check at 4 weeks after starting any med.',
      });
    }

    // Pre-diabetes / T2D
    if (a.glucose_status === 'prediabetes' || a.glucose_status === 't2d') {
      const isT2d = a.glucose_status === 't2d';
      if (isT2d && !a.meds.includes('metformin')) {
        points.push({
          slug: 'metformin',
          priority: 90,
          leverage: true,
          discussWithDoctor: true,
          triggers: ['Type 2 diabetes', 'Not currently on metformin'],
          coach: 'T2D and not on metformin. This is doctor conversation #1.',
          action: 'Book your endocrinologist or PCP. Discuss metformin (first-line) and possibly an SGLT2 inhibitor or GLP-1 depending on cardiovascular risk and weight.',
          whatToMonitor: 'HbA1c every 3 months. Target depends on age and comorbidities.',
        });
      }
      if ((a.bmi === 'obese' || (isT2d && a.bmi === 'over')) && !a.meds.includes('glp1')) {
        points.push({
          slug: 'glp1-agonists',
          priority: 85,
          leverage: true,
          discussWithDoctor: true,
          triggers: [
            isT2d ? 'Type 2 diabetes' : 'Pre-diabetes',
            a.bmi === 'obese' ? 'Significantly overweight (BMI 30+)' : 'Overweight',
            'Not currently on a GLP-1',
          ],
          coach: a.bmi === 'obese'
            ? 'Significantly overweight + ' + (isT2d ? 'T2D' : 'pre-diabetes') + '. GLP-1s now have proven cardiovascular mortality reduction (SELECT trial). Worth the conversation.'
            : 'T2D + overweight. GLP-1s have CV mortality benefit beyond glucose control.',
          action: 'Specific ask of your doctor: "Given my BMI and metabolic status, am I a candidate for semaglutide or tirzepatide?" Insurance coverage varies; cash price is dropping.',
          whatToMonitor: 'Weight, HbA1c, BP at 3 months.',
        });
      }
      points.push({
        slug: 'time-restricted-eating',
        priority: 50,
        leverage: false,
        triggers: [isT2d ? 'Type 2 diabetes' : 'Pre-diabetes', 'Behavioral lever for glucose control'],
        coach: 'Metabolic context: a daily eating window of 8–10 hours is the simplest behavioral intervention with measurable insulin/glucose effects.',
        action: 'Start with 12-hour overnight fast (e.g., 8pm–8am). After 2 weeks, try 10 hours (e.g., 9am–7pm). Don\'t skip protein.',
        whatToMonitor: 'Fasting glucose if you have a meter; otherwise, 3-month HbA1c.',
      });
    }

    // Obesity without T2D
    if (a.bmi === 'obese' && a.glucose_status !== 't2d' && a.glucose_status !== 'prediabetes' && !a.meds.includes('glp1')) {
      points.push({
        slug: 'glp1-agonists',
        priority: 70,
        leverage: false,
        discussWithDoctor: true,
        triggers: ['Significantly overweight (BMI 30+)', 'No diabetes diagnosis', 'Not currently on a GLP-1'],
        coach: 'Significant excess weight without diabetes. SELECT trial showed CV mortality benefit even without T2D. Worth a doctor conversation.',
        action: 'Discuss with your physician: candidacy for semaglutide or tirzepatide for weight management with CV protection.',
        whatToMonitor: 'Weight, waist circumference, BP, lipids at 3 months.',
      });
    }

    // Family history of dementia + cognitive goal — cluster of brain-aging
    if ((a.family.includes('dementia') || a.goals.includes('cognitive')) && a.exercise !== 'sedentary') {
      points.push({
        slug: 'mediterranean-diet',
        priority: 60,
        leverage: false,
        triggers: [a.family.includes('dementia') ? 'Family hx: dementia' : 'Goal: brain & memory', 'MIND diet has cohort evidence for slower cognitive decline'],
        coach: a.family.includes('dementia')
          ? 'Family history of dementia is the biggest known risk factor outside of age. The MIND diet (Mediterranean variant focused on brain) has cohort evidence for slower cognitive decline. The food alone changes risk.'
          : 'Cognitive focus: the MIND diet has the best dietary evidence for cognitive aging.',
        action: 'Daily: leafy greens (1+ cups), berries (1 cup), olive oil (3+ tbsp), nuts (small handful). Weekly: fish 2×, beans 4×. Limit: red meat <4×/week, butter <1 tbsp/day, sweets <5×/week.',
        whatToMonitor: 'Cognitive self-tracking (apps like Cambridge Brain Sciences) every 6 months.',
      });
    }

    return points;
  }

  function findQuickWins() {
    const a = state.answers;
    const wins = [];

    // Vitamin D — almost always relevant
    if (!a.already_doing.includes('vitd') && !isContraindicated('vitamin-d3')) {
      wins.push({
        slug: 'vitamin-d3',
        priority: 40,
        triggers: ['Almost universally low in adults', 'Cheap, well-tolerated baseline'],
        coach: 'Cheap, almost universally low in adults, especially in northern latitudes or limited sun exposure.',
        action: '2,000 IU daily with a fatty meal. Re-test at 8 weeks if you can; aim for blood level 30–50 ng/mL.',
        whatToMonitor: '25-OH vitamin D blood test.',
      });
    }

    // Omega-3 if Western or low-fish diet
    if ((a.diet === 'western' || a.diet === 'vegan' || a.diet === 'vegetarian' || a.diet_quality_self !== 'good')
        && !a.already_doing.includes('omega3') && !isContraindicated('omega-3')) {
      wins.push({
        slug: 'omega-3',
        priority: 35,
        triggers: [
          a.diet === 'vegan' ? 'Vegan diet — no marine omega-3 sources'
            : a.diet === 'vegetarian' ? 'Vegetarian diet — limited marine omega-3'
            : a.diet === 'western' ? 'Standard Western diet'
            : 'Diet quality below "good"',
        ],
        coach: 'You\'re probably not eating fatty fish 2×/week. Modest cardiovascular and possible cognitive benefit.',
        action: '1–2 g EPA+DHA daily. Look for at least 500 mg EPA per capsule. Take with food.',
        whatToMonitor: 'Omega-3 index blood test if you want precision; otherwise, just consistency.',
      });
    }

    // Fiber if Western diet, no IBS-type issue, not already on psyllium
    if ((a.diet === 'western' || a.diet_quality_self === 'poor')
        && !a.already_doing.includes('fiber')
        && !state.recommendedSlugs?.has('psyllium')) {
      wins.push({
        slug: 'oat-beta-glucan',
        priority: 30,
        triggers: [a.diet === 'western' ? 'Standard Western diet' : 'Self-rated diet quality: poor', 'Likely fiber gap'],
        coach: 'If you\'re not already eating 25+ grams of fiber daily, oatmeal is the easiest evidence-based food upgrade. FDA-approved heart-disease claim.',
        action: '1 cup cooked oatmeal (or 1/2 cup raw rolled oats) most mornings. Steel-cut > rolled > instant for slower glucose response. Add berries, walnuts, cinnamon.',
        whatToMonitor: 'LDL at next test.',
      });
    }

    // Walnuts/nuts for cardiovascular + cognitive concerns
    if ((a.goals.includes('cardiovascular') || a.goals.includes('cognitive') || a.family.includes('cv_early') || a.family.includes('dementia'))
        && a.diet !== 'mediterranean' && !a.already_doing.includes('nuts')) {
      wins.push({
        slug: 'walnuts',
        priority: 28,
        triggers: [
          a.family.includes('cv_early') ? 'Family hx: early heart disease'
            : a.family.includes('dementia') ? 'Family hx: dementia'
            : a.goals.includes('cardiovascular') ? 'Goal: heart health'
            : 'Goal: brain & memory',
          'Diet not Mediterranean-leaning',
        ],
        coach: 'Daily handful of nuts is one of the most consistent mortality signals in nutrition. PREDIMED used mixed nuts (28g/day) and saw 28% reduction in heart events.',
        action: 'A small handful (28g) of mixed nuts most days. Walnuts specifically for cognitive evidence (WAHA trial). Raw or dry-roasted, no salt.',
        whatToMonitor: 'Just consistency. Weight if you\'re sensitive (calorie-dense).',
      });
    }

    // Protein for 50+ unless already addressed
    if (a.age >= 50 && !a.already_doing.includes('protein')
        && !isContraindicated('protein-intake')) {
      wins.push({
        slug: 'protein-intake',
        priority: 45,
        triggers: [`Age ${a.age} (anabolic resistance after 50)`],
        coach: `At ${a.age}, most adults underestimate protein needs. Anabolic resistance means you need more, not less. The RDA is set for sedentary 30-year-olds.`,
        action: `${a.age >= 50 ? '1.2–1.6 g/kg/day' : '1.2 g/kg/day'} (so ~90–120 g/day for a 75 kg person). Spread across 3 meals at 25–40 g each. Whey protein 30g once daily if your appetite is reduced.`,
        whatToMonitor: 'Strength on key lifts. Lean body mass (DEXA scan if accessible).',
      });
    }

    // Creatine for older + frailty/performance goal
    if (a.age >= 50 && (a.goals.includes('frailty') || a.goals.includes('performance') || a.exercise === 'both' || a.exercise === 'strength_only')
        && !a.already_doing.includes('creatine') && !isContraindicated('creatine')) {
      wins.push({
        slug: 'creatine',
        priority: 32,
        triggers: [
          `Age ${a.age}`,
          a.goals.includes('frailty') ? 'Goal: stay strong as you age'
            : a.goals.includes('performance') ? 'Goal: physical performance'
            : 'Already lifting',
        ],
        coach: 'Creatine is the most evidence-backed supplement for muscle and (probably) cognition in older adults. Cheap, well-tolerated, ~30 years of safety data.',
        action: '5 g monohydrate daily. Take any time, with or without food. Skip the loading phase — saturation in 3–4 weeks at 5g.',
        whatToMonitor: 'Strength on key lifts. Most people gain 1–2 kg of water-weight in muscle the first month — that\'s expected.',
      });
    }

    // Folate if pregnant/trying — already a leverage point
    if (a.pregnant === 'yes') {
      wins.push({
        slug: 'folate',
        priority: 100,
        triggers: ['Pregnant, breastfeeding, or trying'],
        coach: 'This is non-negotiable in pregnancy. Folate prevents about 70% of neural tube birth defects.',
        action: '0.4–0.8 mg folic acid (or methylfolate) daily, starting now and continuing through 12 weeks. Higher dose (4 mg) if prior NTD pregnancy — discuss with OB.',
        whatToMonitor: 'Standard prenatal labs.',
      });
    }

    // Sauna if available + cardiovascular/cognitive
    if ((a.goals.includes('cardiovascular') || a.goals.includes('cognitive') || a.family.includes('cv_early') || a.family.includes('dementia'))
        && a.exercise !== 'sedentary' && a.budget !== 'tight'
        && !isContraindicated('sauna')) {
      wins.push({
        slug: 'sauna',
        priority: 22,
        triggers: [
          a.goals.includes('cardiovascular') ? 'Goal: heart health'
            : a.goals.includes('cognitive') ? 'Goal: brain & memory'
            : a.family.includes('cv_early') ? 'Family hx: early heart disease'
            : 'Family hx: dementia',
          'Already exercising', 'Budget allows',
        ],
        coach: 'If you have access (gym, home): regular sauna has surprisingly strong cohort evidence for cardiovascular and cognitive endpoints. Finnish KIHD study: 4–7 sessions/week, 50% lower CV mortality.',
        action: '20–30 min at 80–90°C, 2–4× per week. Hydrate before and after. Build up gradually if new to it.',
        whatToMonitor: 'Resting heart rate, BP. Subjective recovery.',
      });
    }

    // Mood disorders — exercise, omega-3, sun
    if (a.conditions.includes('depression')) {
      // Bump omega-3 priority specifically for depression (EPA evidence)
      const existingOmega = wins.find(w => w.slug === 'omega-3');
      if (existingOmega) {
        existingOmega.priority = 55;
        existingOmega.triggers = ['Depression / anxiety (current)', 'EPA-rich omega-3 has meta-analytic evidence'];
        existingOmega.coach = 'For depression, EPA-rich omega-3 has small-to-moderate effect sizes in meta-analyses, with best results when combined with antidepressants.';
        existingOmega.action = '2 g EPA-rich omega-3 daily (look for >2:1 EPA:DHA ratio). With food.';
        existingOmega.whatToMonitor = 'Mood (PHQ-9 monthly).';
      } else if (!state.recommendedSlugs?.has('omega-3')) {
        wins.push({
          slug: 'omega-3',
          priority: 55,
          triggers: ['Depression / anxiety (current)', 'EPA-rich omega-3 has meta-analytic evidence'],
          coach: 'For depression, EPA-rich omega-3 has small-to-moderate effect sizes in meta-analyses, with best results when combined with antidepressants.',
          action: '2 g EPA-rich omega-3 daily (look for >2:1 EPA:DHA ratio). With food.',
          whatToMonitor: 'Mood (PHQ-9 monthly).',
        });
      }
      wins.push({
        slug: 'sun-exposure-circadian',
        priority: 55,
        triggers: ['Depression / anxiety (current)', 'Free, robust mood/circadian intervention'],
        coach: 'Bright light exposure within 1 hour of waking is one of the most robust mood/circadian interventions — and free.',
        action: '10–30 minutes of outdoor light (no sunglasses) within 1 hour of waking. Rain or shine — 1000+ lux even on cloudy days.',
        whatToMonitor: 'Mood, sleep timing, energy. PHQ-9 monthly if tracking depression.',
      });
    }

    // Sleep <6h — add bright morning light as a quick win circadian anchor
    if (a.sleep === 'under_6' && !wins.find(w => w.slug === 'sun-exposure-circadian')) {
      wins.push({
        slug: 'sun-exposure-circadian',
        priority: 60,
        triggers: ['You sleep <6 hours most nights', 'Anchors the circadian wake signal'],
        coach: 'Bright morning light is the most reliable signal to set your circadian clock. With short sleep, this anchors the wake side of the cycle while the bedtime side is in flux.',
        action: '10–30 minutes of outdoor light within 1 hour of waking. No sunglasses. Even on cloudy days, outdoor light is 1000+ lux.',
        whatToMonitor: 'How tired you feel mid-morning at 2 weeks.',
      });
    }

    // Bone health
    if (a.conditions.includes('osteoporosis')) {
      wins.push({
        slug: 'vitamin-k2',
        priority: 30,
        triggers: ['Osteoporosis or osteopenia', 'MK-7 has fracture-reduction evidence'],
        coach: 'Bone health context: K2 (specifically MK-7) has trial evidence for fracture reduction and arterial calcification. Synergistic with vitamin D.',
        action: '90–180 mcg MK-7 daily with a fatty meal.',
        whatToMonitor: 'Bone density scan (DEXA) at next routine interval.',
      });
    }

    // IBS / constipation
    if (a.conditions.includes('ibs')) {
      wins.push({
        slug: 'psyllium',
        priority: 50,
        triggers: ['IBS or chronic constipation', 'RCT evidence for IBS-C and IBS-D'],
        coach: 'Psyllium is one of the few interventions with RCT evidence for both IBS-C and IBS-D. Soluble fiber gel normalises stool from both directions.',
        action: '5g (1 tsp) once daily in 250 mL water, build to 7–15 g/day over 2 weeks. Take medications 2 hours separated.',
        whatToMonitor: 'Symptom diary 4–6 weeks.',
      });
    }

    return wins;
  }

  // ============================================================
  // Refinement: a mutable post-generation layer that lets the user
  // remove / pin / mark-as-already-doing items and toggle appetite/budget
  // without re-answering the wizard.
  // ============================================================

  // ============================================================
  // Schedule registry: slug → when to take/do this thing.
  // Slots: morning | midday | evening | bedtime | anytime | spread | window
  //   spread = "throughout the day" (eating patterns, protein at every meal)
  //   window = an eating window with start/end times
  // Kinds:  daily | weekly
  // ============================================================
  const SCHEDULE = {
    // Supplements — daily
    'vitamin-d3':       { kind: 'daily', slot: 'morning', label: 'Vitamin D3 2,000 IU', note: 'with fatty meal' },
    'omega-3':          { kind: 'daily', slot: 'morning', label: 'Omega-3 1–2g', note: 'with food' },
    'vitamin-k2':       { kind: 'daily', slot: 'morning', label: 'Vitamin K2 MK-7', note: 'with fatty meal' },
    'vitamin-b12':      { kind: 'daily', slot: 'morning', label: 'Vitamin B12' },
    'folate':           { kind: 'daily', slot: 'morning', label: 'Folate' },
    'creatine':         { kind: 'daily', slot: 'morning', label: 'Creatine 5g' },
    'magnesium':        { kind: 'daily', slot: 'bedtime', label: 'Magnesium glycinate' },
    'l-theanine':       { kind: 'daily', slot: 'morning', label: 'L-theanine 200mg' },
    'glycine':          { kind: 'daily', slot: 'bedtime', label: 'Glycine 3g' },
    'melatonin':        { kind: 'daily', slot: 'bedtime', label: 'Melatonin 0.3–0.5mg' },
    'psyllium':         { kind: 'daily', slot: 'morning', label: 'Psyllium 5–15g', note: 'separate from meds by 2h' },
    'oat-beta-glucan':  { kind: 'daily', slot: 'morning', label: 'Oatmeal' },
    'walnuts':          { kind: 'daily', slot: 'midday', label: 'Mixed nuts 28g' },
    'olive-oil-evoo':   { kind: 'daily', slot: 'spread', label: 'EVOO at meals' },
    'protein-intake':   { kind: 'daily', slot: 'spread', label: 'Protein 25–40g per meal' },
    'mediterranean-diet':{ kind: 'daily', slot: 'spread', label: 'Mediterranean pattern' },
    'time-restricted-eating': { kind: 'daily', slot: 'window', label: 'Eating window 10–12h' },
    // Lifestyle / circadian
    'sleep-architecture':    { kind: 'daily', slot: 'bedtime', label: 'Fixed bedtime, 7.5+ hours' },
    'sun-exposure-circadian':{ kind: 'daily', slot: 'morning', label: '10–30 min outdoor light' },
    'meditation':            { kind: 'daily', slot: 'morning', label: 'Meditation 10 min' },
    'oral-health':           { kind: 'daily', slot: 'bedtime', label: 'Floss + brush' },
    // Movement — weekly
    'resistance-training':   { kind: 'weekly', days: [1, 4],       slot: 'evening', label: 'Strength: squat/hinge/push/pull' },
    'zone2-cardio':          { kind: 'weekly', days: [2, 5, 0],    slot: 'morning', label: 'Zone 2 cardio 30 min' },
    'vo2max-training':       { kind: 'weekly', days: [3],          slot: 'evening', label: 'VO2max 4×4 intervals' },
    'sauna':                 { kind: 'weekly', days: [1, 4],       slot: 'evening', label: 'Sauna 20–30 min' },
    'cold-exposure':         { kind: 'weekly', days: [2, 5],       slot: 'morning', label: 'Cold exposure' },
    'social-connection':     { kind: 'weekly', days: [6],          slot: 'evening', label: 'Social block' },
    // Medications — daily/weekly as relevant
    'metformin':         { kind: 'daily', slot: 'morning', label: 'Metformin', note: 'with meals' },
    'statins':           { kind: 'daily', slot: 'evening', label: 'Statin' },
    'low-dose-aspirin':  { kind: 'daily', slot: 'morning', label: 'Low-dose aspirin' },
    'ace-inhibitors':    { kind: 'daily', slot: 'morning', label: 'BP medication' },
    'sglt2-inhibitors':  { kind: 'daily', slot: 'morning', label: 'SGLT2 inhibitor' },
    'berberine':         { kind: 'daily', slot: 'morning', label: 'Berberine 500mg', note: 'with meals' },
    'rapamycin':         { kind: 'weekly', days: [0],     slot: 'morning', label: 'Rapamycin (weekly)' },
    'glp1-agonists':     { kind: 'weekly', days: [1],     slot: 'morning', label: 'GLP-1 injection' },
    'finasteride':       { kind: 'daily', slot: 'morning', label: 'Finasteride' },
    'acarbose':          { kind: 'daily', slot: 'morning', label: 'Acarbose', note: 'with first bite' },
    '17a-estradiol':     { kind: 'daily', slot: 'morning', label: '17α-estradiol' },
    'spermidine':        { kind: 'daily', slot: 'morning', label: 'Spermidine' },
    'urolithin-a':       { kind: 'daily', slot: 'morning', label: 'Urolithin A' },
    'nmn':               { kind: 'daily', slot: 'morning', label: 'NMN' },
    'nr':                { kind: 'daily', slot: 'morning', label: 'NR' },
  };

  const DAYS = [
    { k: 1, short: 'Mon' }, { k: 2, short: 'Tue' }, { k: 3, short: 'Wed' },
    { k: 4, short: 'Thu' }, { k: 5, short: 'Fri' }, { k: 6, short: 'Sat' },
    { k: 0, short: 'Sun' },
  ];
  const SLOTS = [
    { k: 'morning', label: 'Morning' },
    { k: 'midday',  label: 'Midday'  },
    { k: 'evening', label: 'Evening' },
    { k: 'bedtime', label: 'Bedtime' },
  ];

  function buildSchedule(stack) {
    // Returns: { grid: {dayK: {slotK: [items]}}, spread: [...], unscheduled: [...] }
    const grid = {};
    DAYS.forEach(d => {
      grid[d.k] = {};
      SLOTS.forEach(s => { grid[d.k][s.k] = []; });
    });
    const spread = [];
    const unscheduled = [];
    stack.forEach(rec => {
      const sch = SCHEDULE[rec.slug];
      if (!sch) {
        unscheduled.push(rec);
        return;
      }
      if (sch.slot === 'spread' || sch.slot === 'window') {
        spread.push({ rec, schedule: sch });
        return;
      }
      const slotKeys = String(sch.slot).split(',').map(s => s.trim());
      const dayKeys = sch.kind === 'weekly' ? sch.days : DAYS.map(d => d.k);
      dayKeys.forEach(dk => {
        slotKeys.forEach(sk => {
          if (grid[dk] && grid[dk][sk]) {
            grid[dk][sk].push({ rec, schedule: sch });
          }
        });
      });
    });
    return { grid, spread, unscheduled };
  }

  function renderSchedule(stack) {
    if (!stack || !stack.length) return null;
    const { grid, spread, unscheduled } = buildSchedule(stack);
    const hasGridContent = DAYS.some(d => SLOTS.some(s => grid[d.k][s.k].length));
    if (!hasGridContent && !spread.length) return null;

    const headerRow = el('tr', null,
      el('th', { class: 'wiz-sched-corner' }, ''),
      ...DAYS.map(d => el('th', { class: 'wiz-sched-day-head' }, d.short))
    );
    const bodyRows = SLOTS.map(slot =>
      el('tr', null,
        el('th', { class: 'wiz-sched-slot-head' }, slot.label),
        ...DAYS.map(d => {
          const cell = grid[d.k][slot.k];
          if (!cell.length) return el('td', { class: 'wiz-sched-cell wiz-sched-cell-empty' }, '');
          return el('td', { class: 'wiz-sched-cell' },
            cell.map(c => el('div', { class: 'wiz-sched-item', title: c.schedule.note || '' },
              el('span', { class: 'wiz-sched-item-label' }, c.schedule.label)
            ))
          );
        })
      )
    );

    const spreadStrip = spread.length
      ? el('div', { class: 'wiz-sched-spread' },
          el('h4', null, 'Throughout the day'),
          el('ul', null,
            spread.map(s => el('li', null,
              el('strong', null, s.schedule.label),
              s.schedule.note ? ` — ${s.schedule.note}` : ''
            ))
          )
        )
      : null;

    const unscheduledStrip = unscheduled.length
      ? el('div', { class: 'wiz-sched-unscheduled' },
          el('h4', null, 'No fixed timing — situational'),
          el('ul', null,
            unscheduled.map(u => {
              const item = findItem(u.slug);
              return el('li', null, item ? item.name : u.slug);
            })
          )
        )
      : null;

    return el('section', { class: 'wiz-result-section wiz-result-schedule' },
      el('h3', null, 'Your weekly schedule'),
      el('p', { class: 'wiz-section-sub' },
        'A starting blueprint. Adjust days to fit your life — the science is in the dose, frequency, and consistency, not which weekday.'),
      el('div', { class: 'wiz-sched-table-wrap' },
        el('table', { class: 'wiz-sched-table' },
          el('thead', null, headerRow),
          el('tbody', null, ...bodyRows)
        )
      ),
      spreadStrip,
      unscheduledStrip
    );
  }

  // Alternatives surfaced by the per-card "Find swap" control.
  // Each entry: same leverage target, comparable evidence, ranked.
  const SWAPS = {
    'oat-beta-glucan': ['psyllium', 'mediterranean-diet'],
    'psyllium': ['oat-beta-glucan', 'mediterranean-diet'],
    'walnuts': ['olive-oil-evoo', 'mediterranean-diet'],
    'omega-3': ['walnuts', 'mediterranean-diet'],
    'creatine': ['protein-intake'],
    'protein-intake': ['creatine', 'walnuts'],
    'vitamin-d3': ['sun-exposure-circadian'],
    'sun-exposure-circadian': ['vitamin-d3'],
    'sauna': ['zone2-cardio', 'vo2max-training'],
    'zone2-cardio': ['vo2max-training', 'resistance-training'],
    'vo2max-training': ['zone2-cardio', 'resistance-training'],
    'resistance-training': ['protein-intake', 'creatine'],
    'mediterranean-diet': ['walnuts', 'oat-beta-glucan', 'olive-oil-evoo'],
    'time-restricted-eating': ['mediterranean-diet'],
    'statins': ['psyllium', 'oat-beta-glucan'],
    'metformin': ['berberine', 'time-restricted-eating'],
    'berberine': ['oat-beta-glucan', 'time-restricted-eating'],
    'glp1-agonists': ['time-restricted-eating', 'mediterranean-diet'],
    'ace-inhibitors': ['mediterranean-diet', 'sauna'],
  };

  // The *deterministic* recommend pass. Independent of refinement state.
  function recommend(answers) {
    // Reset the cross-rule scratchpad before re-running.
    const prev = state.recommendedSlugs;
    state.recommendedSlugs = new Set();
    const leverage = findLeveragePoints();
    state.recommendedSlugs = new Set(leverage.map(p => p.slug));
    const wins = findQuickWins();
    state.recommendedSlugs = prev; // not strictly needed but tidy
    return { leverage, wins };
  }

  // Combines + dedupes leverage and wins into a unified pool keyed by slug.
  function unifyPool(leverage, wins) {
    const bySlug = {};
    [...leverage, ...wins].forEach(rec => {
      if (!bySlug[rec.slug] || rec.priority > bySlug[rec.slug].priority) {
        bySlug[rec.slug] = rec;
      }
    });
    return Object.values(bySlug).filter(rec => !isContraindicated(rec.slug));
  }

  function applyRefinement(pool, refinement) {
    // Pinned items always included; removed always excluded; alreadyDoing
    // moved to a separate side-list and don't count toward the cap.
    const usable = pool.filter(r => !refinement.removed.has(r.slug));
    const alreadyDoing = usable.filter(r => refinement.alreadyDoing.has(r.slug));
    const candidates = usable
      .filter(r => !refinement.alreadyDoing.has(r.slug))
      .sort((a, b) => b.priority - a.priority);

    const caps = { minimum: 5, moderate: 8, allin: 12 };
    const cap = caps[refinement.appetite] || 8;

    const pinned = candidates.filter(r => refinement.pinned.has(r.slug));
    const rest = candidates.filter(r => !refinement.pinned.has(r.slug));
    const slots = Math.max(0, cap - pinned.length);
    // Pinned first (preserves their priority order), then top of rest.
    const ranked = [...pinned, ...rest.slice(0, slots)];
    return { ranked, alreadyDoing };
  }

  function buildFlaggedList() {
    const flagged = [];
    const flaggedSlugs = ['rapamycin', 'curcumin', 'low-dose-aspirin', 'fisetin', 'dasatinib-quercetin'];
    flaggedSlugs.forEach(slug => {
      const reason = isContraindicated(slug);
      if (reason) {
        const item = findItem(slug);
        if (item) flagged.push({ item, reason });
      }
    });
    return flagged;
  }

  function generate() {
    const a = state.answers;
    state.refinement = {
      pinned: new Set(),
      removed: new Set(),
      alreadyDoing: new Set(),
      appetite: a.appetite,
      budget: a.budget,
      swapPanelFor: null, // slug currently showing alternatives
    };
    state.recommendCache = recommend(a);
    state._scrolledToResults = false;
    // Capture the previous stack for diff (if user is re-doing).
    if (state.history.length > 0 && !state.previousStack) {
      state.previousStack = state.history[0];
    }
    // Compute initial ranking once to persist.
    const pool = unifyPool(state.recommendCache.leverage, state.recommendCache.wins);
    const { ranked: initialRanked } = applyRefinement(pool, state.refinement);
    persistStack(a, initialRanked);
    rerenderResults();
  }

  function rerenderResults() {
    const { leverage, wins } = state.recommendCache;
    const pool = unifyPool(leverage, wins);
    const { ranked, alreadyDoing } = applyRefinement(pool, state.refinement);
    const flagged = buildFlaggedList();
    renderResults(ranked, alreadyDoing, flagged, pool);
  }

  function renderResults(ranked, alreadyDoing, flagged, pool) {
    mount.innerHTML = '';

    // Personalised opening line + adaptive headline for low-output cases
    const summary = buildSummaryLine();
    const isShortStack = ranked.length <= 3;
    const headline = isShortStack ? "You're already doing the big stuff" : 'Your stack';
    const summaryAddon = isShortStack
      ? " Most of the high-leverage moves we'd suggest, you're already on. Here's what's left worth your time \u2014 and a reminder that the work is in keeping the basics consistent, not adding more."
      : '';

    mount.appendChild(el('section', { class: 'wiz-result-hero' },
      el('div', { class: 'wiz-result-meta' }, `Built ${new Date().toLocaleDateString()} • ${ranked.length} action${ranked.length === 1 ? '' : 's'}`),
      el('h2', null, headline),
      el('p', { class: 'wiz-result-summary' }, summary + summaryAddon),
      el('div', { class: 'wiz-result-actions' },
        el('button', {
          type: 'button', class: 'wiz-btn wiz-btn-secondary',
          onclick: () => { state.step = 1; rerender(); }
        }, '← Edit answers'),
        el('button', {
          type: 'button', class: 'wiz-btn wiz-btn-secondary',
          onclick: () => { window.print(); }
        }, '🖨 Print / save PDF'),
        el('button', {
          type: 'button', class: 'wiz-btn wiz-btn-secondary',
          onclick: (ev) => copyShareUrl(ev.currentTarget),
        }, '🔗 Share'),
        el('button', {
          type: 'button', class: 'wiz-btn wiz-btn-secondary',
          onclick: () => downloadStackJson(ranked, alreadyDoing),
        }, '⬇ Download JSON'),
      )
    ));

    // Stack scoreboard (KPI strip)
    const scoreboard = renderScoreboard(ranked);
    if (scoreboard) mount.appendChild(scoreboard);

    // Diff panel — only on a re-do.
    if (state.previousStack && state.previousStack.stack) {
      const currentMini = ranked.map(r => ({ slug: r.slug, leverage: !!r.leverage, priority: r.priority }));
      const { added, removed, same } = diffStacks(state.previousStack.stack, currentMini);
      if (added.length || removed.length) {
        mount.appendChild(renderDiffPanel(state.previousStack, added, removed, same));
      }
    }

    // Refinement control bar (live updates state.refinement)
    mount.appendChild(renderControlBar());

    // Group recommendations
    const leverage = ranked.filter(r => r.leverage);
    const quickwins = ranked.filter(r => !r.leverage && !r.discussWithDoctor);
    const doctorTalks = ranked.filter(r => r.discussWithDoctor);

    if (leverage.length > 0) {
      mount.appendChild(renderRecBlock(
        'Your biggest levers — start here',
        'Where your situation most diverges from optimal. Highest impact per unit of effort.',
        leverage,
        'lever'
      ));
    }
    if (quickwins.length > 0) {
      mount.appendChild(renderRecBlock(
        'Quick wins — easy adds',
        'Strong evidence, low effort, low cost. Layer these in once the big levers are moving.',
        quickwins,
        'quickwin'
      ));
    }
    if (doctorTalks.length > 0) {
      mount.appendChild(renderRecBlock(
        'Discuss with your doctor',
        'Prescription-strength interventions where the evidence supports a real conversation. Take this list to your physician.',
        doctorTalks,
        'doctor'
      ));
    }

    // Weekly schedule (built from active stack only — pinned + ranked)
    const scheduleSection = renderSchedule(ranked);
    if (scheduleSection) mount.appendChild(scheduleSection);

    // What you're already doing — separate section, doesn't count toward cap
    if (alreadyDoing && alreadyDoing.length > 0) {
      const grid = el('div', { class: 'wiz-already-grid' });
      alreadyDoing.forEach(rec => {
        const item = findItem(rec.slug);
        if (!item) return;
        grid.appendChild(el('div', { class: 'wiz-already-card' },
          el('div', { class: 'wiz-already-info' },
            el('a', { href: `/items/${item.slug}.html`, class: 'wiz-already-name' }, item.name),
            el('span', { class: 'wiz-already-tag' }, '✓ Already doing')),
          el('button', {
            type: 'button', class: 'wiz-mini-btn',
            onclick: () => {
              state.refinement.alreadyDoing.delete(rec.slug);
              rerenderResults();
            },
          }, 'Undo')
        ));
      });
      mount.appendChild(el('section', { class: 'wiz-result-section wiz-result-already' },
        el('h3', null, "What you're already doing well"),
        el('p', { class: 'wiz-section-sub' }, "These freed up slots so the stack stays focused on what's missing."),
        grid));
    }

    // Flagged contraindications
    if (flagged.length > 0) {
      const grid = el('div', { class: 'wiz-flagged-grid' });
      flagged.forEach(f => {
        grid.appendChild(el('div', { class: 'wiz-flagged-card' },
          el('a', { href: `/items/${f.item.slug}.html`, class: 'wiz-flagged-name' }, f.item.name),
          el('p', { class: 'wiz-flagged-reason' }, '⚠️ ' + f.reason)));
      });
      mount.appendChild(el('section', { class: 'wiz-result-section' },
        el('h3', null, 'Skip these for you'),
        el('p', { class: 'wiz-section-sub' }, 'Items on the site that are contraindicated based on your situation.'),
        grid));
    }

    // Footer
    mount.appendChild(el('section', { class: 'wiz-result-footer' },
      el('p', null,
        el('strong', null, 'A note. '),
        'This stack is generated from rules, not a doctor. The reasoning behind each recommendation is explicit — click any item for the full evidence summary, primary studies, and dose details. ',
        "Talk to your physician before starting any medication or stopping anything you're currently on. ",
        'Re-do this assessment in 6 months as things change.')
    ));

    if (!state._scrolledToResults) {
      state._scrolledToResults = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function parseCostMonthly(costSignal) {
    if (!costSignal) return [0, 0];
    const cl = String(costSignal).toLowerCase();
    if (cl.includes('free') || cl.includes('no cost') || cl.includes('massive savings')) return [0, 0];
    if (cl.includes('not applicable')) return [0, 0];
    const m = String(costSignal).match(/\$\s*(\d+)(?:\s*[\-–]\s*\$?\s*(\d+))?/);
    if (!m) return [0, 0];
    const lo = parseInt(m[1], 10);
    const hi = m[2] ? parseInt(m[2], 10) : lo;
    if (/\/\s*day/.test(costSignal)) return [lo * 30, hi * 30];
    return [lo, hi];
  }

  function buildScoreboard(stack) {
    let costLo = 0, costHi = 0;
    const tiers = { 1: 0, 2: 0, 3: 0 };
    let dailyCount = 0, weeklyCount = 0;
    let unscheduled = 0;
    const doctorCount = stack.filter(r => r.discussWithDoctor).length;
    stack.forEach(rec => {
      const item = findItem(rec.slug);
      if (item) {
        const tier = item.tier || 2;
        tiers[tier] = (tiers[tier] || 0) + 1;
        const [lo, hi] = parseCostMonthly(item.cost_signal);
        costLo += lo;
        costHi += hi;
      }
      const sch = SCHEDULE[rec.slug];
      if (!sch) unscheduled += 1;
      else if (sch.kind === 'weekly') weeklyCount += 1;
      else dailyCount += 1;
    });
    return { costLo, costHi, tiers, dailyCount, weeklyCount, unscheduled, doctorCount };
  }

  function renderScoreboard(stack) {
    if (!stack || !stack.length) return null;
    const s = buildScoreboard(stack);
    const costRange = s.costHi === 0
      ? 'Free or near-free'
      : (s.costLo === s.costHi ? `~$${s.costHi}` : `$${s.costLo}–${s.costHi}`);
    const tierMix = [
      s.tiers[1] ? el('span', { class: 'wiz-kpi-tier wiz-kpi-tier-1' }, `${s.tiers[1]} foundation`) : null,
      s.tiers[2] ? el('span', { class: 'wiz-kpi-tier wiz-kpi-tier-2' }, `${s.tiers[2]} targeted`) : null,
      s.tiers[3] ? el('span', { class: 'wiz-kpi-tier wiz-kpi-tier-3' }, `${s.tiers[3]} frontier`) : null,
    ].filter(Boolean);
    return el('section', { class: 'wiz-kpi-strip' },
      el('div', { class: 'wiz-kpi' },
        el('div', { class: 'wiz-kpi-label' }, 'Total actions'),
        el('div', { class: 'wiz-kpi-value' }, String(stack.length))
      ),
      el('div', { class: 'wiz-kpi' },
        el('div', { class: 'wiz-kpi-label' }, 'Daily / weekly'),
        el('div', { class: 'wiz-kpi-value' },
          el('span', { class: 'wiz-kpi-num' }, String(s.dailyCount)),
          el('span', { class: 'wiz-kpi-sep' }, ' · '),
          el('span', { class: 'wiz-kpi-num' }, String(s.weeklyCount))
        )
      ),
      el('div', { class: 'wiz-kpi' },
        el('div', { class: 'wiz-kpi-label' }, 'Est. monthly cost'),
        el('div', { class: 'wiz-kpi-value' },
          el('span', { class: 'wiz-kpi-cost' }, costRange),
          el('span', { class: 'wiz-kpi-sub' }, '/mo')
        )
      ),
      s.doctorCount > 0
        ? el('div', { class: 'wiz-kpi' },
            el('div', { class: 'wiz-kpi-label' }, 'Doctor conversations'),
            el('div', { class: 'wiz-kpi-value' }, String(s.doctorCount))
          )
        : null,
      tierMix.length
        ? el('div', { class: 'wiz-kpi wiz-kpi-tier-block' },
            el('div', { class: 'wiz-kpi-label' }, 'Tier mix'),
            el('div', { class: 'wiz-kpi-value wiz-kpi-tier-row' }, tierMix)
          )
        : null
    );
  }

  function copyShareUrl(btn) {
    const url = buildShareUrl(state.answers);
    const restoreLabel = btn.textContent;
    const finish = (text) => {
      btn.textContent = text;
      setTimeout(() => { btn.textContent = restoreLabel; }, 1800);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(
        () => finish('✓ Copied'),
        () => finish('Copy failed')
      );
    } else {
      // Fallback: temporarily insert input and execCommand
      const inp = document.createElement('input');
      inp.value = url; document.body.appendChild(inp); inp.select();
      try { document.execCommand('copy'); finish('✓ Copied'); }
      catch (e) { finish('Copy failed'); }
      document.body.removeChild(inp);
    }
  }

  function downloadStackJson(ranked, alreadyDoing) {
    const payload = {
      generated_at: new Date().toISOString(),
      answers: deepClone(state.answers),
      stack: ranked.map(r => {
        const item = findItem(r.slug);
        return {
          slug: r.slug,
          name: item ? item.name : r.slug,
          tier: item ? item.tier : null,
          leverage: !!r.leverage,
          priority: r.priority,
          discuss_with_doctor: !!r.discussWithDoctor,
          coach: r.coach,
          action: r.action,
          monitor: r.whatToMonitor,
          triggers: r.triggers || [],
        };
      }),
      already_doing: (alreadyDoing || []).map(r => ({
        slug: r.slug,
        name: (findItem(r.slug) || {}).name || r.slug,
      })),
      disclaimer: 'Generated from rules, not a doctor. Talk to your physician.',
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trajectory-stack-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function renderDiffPanel(prevEntry, added, removed, same) {
    const date = formatRelativeDate(prevEntry.timestamp);
    const list = (recs, kind) => recs.length
      ? el('ul', { class: `wiz-diff-list wiz-diff-${kind}` },
          recs.map(r => {
            const item = findItem(r.slug);
            return el('li', null,
              el('a', { href: `/items/${r.slug}.html` }, item ? item.name : r.slug)
            );
          })
        )
      : el('p', { class: 'wiz-diff-empty' }, '— None');
    return el('section', { class: 'wiz-result-section wiz-diff' },
      el('h3', null, `What changed since ${date}`),
      el('p', { class: 'wiz-section-sub' },
        'Diffed against your previous stack. Useful for tracking how recommendations evolve as your situation changes.'),
      el('div', { class: 'wiz-diff-grid' },
        el('div', { class: 'wiz-diff-col' },
          el('h4', null, '+ New in your stack'),
          list(added, 'added')),
        el('div', { class: 'wiz-diff-col' },
          el('h4', null, '− Removed from your stack'),
          list(removed, 'removed')),
        el('div', { class: 'wiz-diff-col' },
          el('h4', null, '= Still recommended'),
          list(same, 'same'))
      )
    );
  }

  // Control bar: appetite + budget. Live-updates state.refinement.
  function renderControlBar() {
    const ref = state.refinement;
    const appetiteOpts = [
      ['minimum', 'Essentials', '3–5'],
      ['moderate', 'Real stack', '6–8'],
      ['allin', 'Full plan', '8–12'],
    ];
    const budgetOpts = [
      ['tight', 'Tight'],
      ['moderate', 'Moderate'],
      ['unlimited', 'No limit'],
    ];
    return el('section', { class: 'wiz-control-bar' },
      el('div', { class: 'wiz-control-group' },
        el('span', { class: 'wiz-control-label' }, 'Appetite'),
        el('div', { class: 'wiz-segmented' },
          appetiteOpts.map(([val, label, sub]) =>
            el('button', {
              type: 'button',
              class: 'wiz-seg' + (ref.appetite === val ? ' is-active' : ''),
              onclick: () => { state.refinement.appetite = val; rerenderResults(); },
            },
              el('span', { class: 'wiz-seg-label' }, label),
              el('span', { class: 'wiz-seg-sub' }, sub)
            )
          )
        )
      ),
      el('div', { class: 'wiz-control-group' },
        el('span', { class: 'wiz-control-label' }, 'Budget'),
        el('div', { class: 'wiz-segmented' },
          budgetOpts.map(([val, label]) =>
            el('button', {
              type: 'button',
              class: 'wiz-seg' + (ref.budget === val ? ' is-active' : ''),
              onclick: () => { state.refinement.budget = val; rerenderResults(); },
            }, el('span', { class: 'wiz-seg-label' }, label))
          )
        )
      )
    );
  }

  function buildSummaryLine() {
    const a = state.answers;
    const facts = [];
    facts.push(`${a.age}, ${a.sex === 'female' ? 'female' : a.sex === 'male' ? 'male' : ''}`.trim());
    if (a.exercise === 'sedentary') facts.push('sedentary');
    else if (a.exercise === 'cardio_only') facts.push('cardio only');
    else if (a.exercise === 'strength_only') facts.push('lift only');
    else if (a.exercise === 'both') facts.push('cardio + strength');
    else if (a.exercise === 'athlete') facts.push('high training volume');

    if (a.sleep === 'under_6') facts.push('sleeping <6h');
    else if (a.sleep === '6_7') facts.push('sleeping 6–7h');

    if (a.diet === 'western' && a.diet_quality_self !== 'good') facts.push('Western diet');
    if (a.diet === 'mediterranean') facts.push('Mediterranean-leaning');

    if (a.smoking === 'current') facts.push('currently smoking');
    else if (a.smoking === 'former') facts.push('former smoker');
    if (a.alcohol === 'heavy') facts.push('heavy drinker');
    else if (a.alcohol === 'moderate') facts.push('moderate drinker');

    if (a.bmi === 'obese') facts.push('significantly overweight');
    else if (a.bmi === 'over') facts.push('overweight');

    if (a.bp_status === 'high') facts.push('high BP');
    if (a.ldl_status === 'high') facts.push('high cholesterol');
    if (a.glucose_status === 't2d') facts.push('type 2 diabetes');
    else if (a.glucose_status === 'prediabetes') facts.push('pre-diabetic');

    if (a.family.includes('cv_early')) facts.push('family history of early heart disease');
    if (a.family.includes('dementia')) facts.push('family history of dementia');

    const goals = a.goals.map(g => ({
      longevity: 'longevity', cardiovascular: 'heart health', cognitive: 'cognitive function',
      metabolic: 'metabolic health', frailty: 'staying strong', energy: 'energy', performance: 'performance',
    }[g])).filter(Boolean);

    let sentence = `You're ${facts.slice(0, 5).join(', ')}.`;
    if (goals.length) sentence += ` Goals: ${goals.join(' + ')}.`;
    sentence += ` Here's what the evidence says is most worth your time.`;
    return sentence;
  }

  function renderRecBlock(title, lede, recs, kind) {
    const list = el('div', { class: 'wiz-rec-list' });
    recs.forEach((rec, i) => list.appendChild(renderRecCard(rec, i + 1, kind)));
    return el('section', { class: `wiz-result-section wiz-result-${kind}` },
      el('h3', null, title),
      lede ? el('p', { class: 'wiz-section-sub' }, lede) : null,
      list
    );
  }

  function renderRecCard(rec, num, kind) {
    const item = findItem(rec.slug);
    if (!item) return el('div', null);
    const tier = item.tier || 2;
    const triggers = rec.triggers || [];
    const triggerChips = triggers.slice(0, 2).map(t =>
      el('span', { class: 'wiz-trigger-chip', title: t }, t.length > 32 ? t.slice(0, 31) + '…' : t)
    );

    // Build the "Why this rank?" disclosure body
    const whyTriggerList = el('ul', { class: 'wiz-why-list' },
      triggers.map(t => el('li', null, t))
    );
    const whyBody = el('div', { class: 'wiz-why-body' },
      triggers.length
        ? el('div', null,
            el('div', { class: 'wiz-why-label' }, 'Why this fired'),
            whyTriggerList)
        : el('p', { class: 'wiz-why-empty' }, 'General foundation recommendation — applies broadly.'),
      el('div', { class: 'wiz-why-priority' },
        el('span', { class: 'wiz-why-label' }, 'Priority score '),
        el('span', { class: 'wiz-why-priority-num' }, String(rec.priority)),
        el('span', { class: 'wiz-why-priority-help' },
          ' — derived from how directly your inputs match this rule. Higher = stronger fit.')),
      el('a', { class: 'wiz-why-evidence', href: `/items/${item.slug}.html` }, 'Read the full evidence →')
    );

    const whyDisclosure = el('details', { class: 'wiz-why' },
      el('summary', { class: 'wiz-why-summary' }, `Why is this #${num}?`),
      whyBody
    );

    const ref = state.refinement || {};
    const isPinned = ref.pinned && ref.pinned.has(rec.slug);
    const showSwapFor = ref.swapPanelFor === rec.slug;

    const controls = el('div', { class: 'wiz-rec-controls' },
      el('button', {
        type: 'button',
        class: 'wiz-rec-ctrl wiz-rec-ctrl-remove',
        title: 'Remove from your stack',
        onclick: () => {
          state.refinement.removed.add(rec.slug);
          state.refinement.pinned.delete(rec.slug);
          state.refinement.swapPanelFor = null;
          rerenderResults();
        },
      }, '✕ Remove'),
      el('button', {
        type: 'button',
        class: 'wiz-rec-ctrl wiz-rec-ctrl-pin' + (isPinned ? ' is-active' : ''),
        title: isPinned ? 'Unpin' : 'Pin: keep in stack regardless of cap',
        onclick: () => {
          if (isPinned) state.refinement.pinned.delete(rec.slug);
          else state.refinement.pinned.add(rec.slug);
          rerenderResults();
        },
      }, isPinned ? '📌 Pinned' : '📌 Pin'),
      el('button', {
        type: 'button',
        class: 'wiz-rec-ctrl wiz-rec-ctrl-doing',
        title: "Already doing this — move out of the active stack",
        onclick: () => {
          state.refinement.alreadyDoing.add(rec.slug);
          state.refinement.pinned.delete(rec.slug);
          rerenderResults();
        },
      }, "✓ Already doing"),
      SWAPS[rec.slug] && SWAPS[rec.slug].length
        ? el('button', {
            type: 'button',
            class: 'wiz-rec-ctrl wiz-rec-ctrl-swap' + (showSwapFor ? ' is-active' : ''),
            title: 'See alternatives that target the same thing',
            onclick: () => {
              state.refinement.swapPanelFor = showSwapFor ? null : rec.slug;
              rerenderResults();
            },
          }, '🔀 Swap')
        : null
    );

    let swapPanel = null;
    if (showSwapFor && SWAPS[rec.slug]) {
      const altCards = SWAPS[rec.slug]
        .map(slug => findItem(slug))
        .filter(Boolean)
        .filter(alt => !ref.removed.has(alt.slug))
        .map(alt => el('button', {
          type: 'button',
          class: 'wiz-swap-alt',
          onclick: () => {
            // Remove the original; pin the alternative; close panel.
            state.refinement.removed.add(rec.slug);
            state.refinement.pinned.add(alt.slug);
            state.refinement.swapPanelFor = null;
            rerenderResults();
          },
        },
          el('span', { class: 'wiz-swap-alt-name' }, alt.name),
          el('span', { class: 'wiz-swap-alt-meta' },
            el('span', { class: `tier-badge tier-${alt.tier || 2}` },
              el('span', { class: 'tier-num' }, `T${alt.tier || 2}`)),
            el('span', { class: 'wiz-swap-alt-score' },
              `E ${alt.effectiveness_score || 0} · C ${alt.certainty_score || 0}`)
          )
        ));
      swapPanel = el('div', { class: 'wiz-swap-panel' },
        el('div', { class: 'wiz-swap-head' },
          el('span', { class: 'wiz-swap-label' }, `Alternatives for ${item.name}`),
          el('button', {
            type: 'button', class: 'wiz-swap-close',
            onclick: () => { state.refinement.swapPanelFor = null; rerenderResults(); },
          }, '✕ Cancel')
        ),
        altCards.length ? el('div', { class: 'wiz-swap-grid' }, altCards)
          : el('p', { class: 'wiz-swap-empty' }, 'No alternatives available.')
      );
    }

    return el('article', { class: `wiz-rec-card wiz-rec-${kind} card-tier-${tier}` + (isPinned ? ' wiz-rec-pinned' : '') },
      el('header', { class: 'wiz-rec-head' },
        el('div', { class: 'wiz-rec-num' }, String(num)),
        el('div', { class: 'wiz-rec-titlewrap' },
          el('h4', { class: 'wiz-rec-name' }, item.name),
          el('div', { class: 'wiz-rec-meta' },
            el('span', { class: `tier-badge tier-${tier}` },
              el('span', { class: 'tier-num' }, `T${tier}`),
              el('span', { class: 'tier-label' }, ['Foundation','Targeted','Frontier'][tier-1])),
            item.cost_signal ? el('span', { class: 'cost-pill' }, shortCost(item.cost_signal)) : null,
            el('span', { class: 'card-evidence' }, `Ev ${item.evidence_level || '—'}`),
            el('a', { class: 'wiz-rec-link', href: `/items/${item.slug}.html` }, 'Full evidence →')
          ),
          triggers.length ? el('div', { class: 'wiz-trigger-row' }, triggerChips) : null
        )
      ),
      el('p', { class: 'wiz-rec-coach' }, rec.coach),
      el('div', { class: 'wiz-rec-protocol' },
        el('h5', null, 'How to actually do this'),
        el('p', null, rec.action),
        rec.whatToMonitor ? el('div', { class: 'wiz-rec-monitor' },
          el('strong', null, "How to know it's working: "),
          el('span', null, rec.whatToMonitor)) : null
      ),
      whyDisclosure,
      controls,
      swapPanel
    );
  }

  function shortCost(s) {
    const sl = s.toLowerCase();
    if (sl.startsWith('free') || sl.includes('no cost')) return 'Free';
    if (sl.includes('not applicable')) return 'Rx only';
    const m = s.match(/\$\s*(\d{1,4})\s*(?:[\-–to]+\s*\$?\s*(\d{1,4}))?\s*(\/\s*(?:mo|month|day))?/);
    if (!m) return s.slice(0, 12);
    const lo = m[1], hi = m[2], unit = (m[3] || '').replace(/\s+/g, '').replace('month', 'mo');
    return hi ? `$${lo}–${hi}${unit}` : `$${lo}${unit}`;
  }

  // ============================================================
  // Boot
  // ============================================================
  function init() {
    mount.innerHTML = '<p class="wiz-loading">Loading…</p>';
    state.history = loadHistory();
    fetch('/items.json', { cache: 'no-cache' })
      .then(r => r.json())
      .then(data => {
        state.items = data;
        // If a share-link is present, hydrate answers and jump to results.
        const shared = readShareFromHash();
        if (shared && typeof shared === 'object') {
          Object.assign(state.answers, shared);
          state.fromShare = true;
          computeFlow();
          generate();
          return;
        }
        computeFlow();
        rerender();
      })
      .catch(err => {
        mount.innerHTML = '<p class="wiz-error">Failed to load: ' + err + '</p>';
      });
  }

  init();
})();
