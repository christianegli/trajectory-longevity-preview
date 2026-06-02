// Trajectory — compare 2–4 protocols side by side.
// State persisted in URL hash (#compare=slug,slug,slug) so a comparison
// can be linked / shared.

(function () {
  'use strict';
  const board   = document.getElementById('cmp-board');
  const input   = document.getElementById('cmp-search');
  const results = document.getElementById('cmp-search-results');
  const empty   = document.getElementById('cmp-empty');
  const clearBtn= document.getElementById('cmp-clear');
  if (!board || !input || !results) return;

  const MAX = 4;
  const state = { items: null, byslug: {}, selected: [] };

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

  function readHash() {
    const m = (location.hash || '').match(/compare=([^&]+)/);
    if (!m) return [];
    return decodeURIComponent(m[1])
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, MAX);
  }

  function writeHash() {
    if (!state.selected.length) {
      history.replaceState(null, '', location.pathname);
      return;
    }
    history.replaceState(null, '', `${location.pathname}#compare=${state.selected.join(',')}`);
  }

  function add(slug) {
    if (state.selected.includes(slug)) return;
    if (state.selected.length >= MAX) {
      alert(`Comparar más de ${MAX} a la vez resulta ilegible. Quite uno antes.`);
      return;
    }
    if (!state.byslug[slug]) return;
    state.selected.push(slug);
    writeHash();
    render();
  }

  function remove(slug) {
    state.selected = state.selected.filter(s => s !== slug);
    writeHash();
    render();
  }

  function clearAll() {
    state.selected = [];
    writeHash();
    render();
  }

  function shortCost(s) {
    if (!s) return '—';
    const sl = s.toLowerCase();
    if (sl.startsWith('gratis') || sl.startsWith('free') || sl.includes('no cost') || sl.includes('massive savings') || sl.includes('ahorro')) return 'Gratis';
    if (sl.includes('not applicable') || sl.includes('solo receta')) return 'Solo receta';
    const m = s.match(/(?:\$|€)\s*(\d{1,4})\s*(?:[\-–to a]+\s*(?:\$|€)?\s*(\d{1,4}))?\s*(\/\s*(?:mes|mo|month|day|día))?/);
    if (!m) return s.slice(0, 16);
    const lo = m[1], hi = m[2], unit = (m[3] || '').replace(/\s+/g, '').replace('month', 'mes').replace('mo', 'mes').replace('day', 'día');
    return hi ? `${lo}–${hi} €${unit}` : `${lo} €${unit}`;
  }

  function tierLabel(t) {
    return ['—', 'Base', 'Dirigido', 'Frontera'][t] || '—';
  }

  function renderColumn(slug) {
    const it = state.byslug[slug];
    if (!it) {
      return el('div', { class: 'cmp-col cmp-col-missing' },
        el('header', null,
          el('span', { class: 'cmp-name' }, slug),
          el('button', { type: 'button', class: 'cmp-remove', onclick: () => remove(slug), 'aria-label': 'Quitar' }, '✕')
        ),
        el('p', null, 'Protocolo no encontrado.')
      );
    }
    const tier = it.tier || 2;
    return el('div', { class: `cmp-col card-tier-${tier}` },
      el('header', { class: 'cmp-col-head' },
        el('div', { class: 'cmp-col-title' },
          el('a', { class: 'cmp-name', href: `/items/${it.slug}.html` }, it.name),
          el('span', { class: `tier-badge tier-${tier}` },
            el('span', { class: 'tier-num' }, `T${tier}`),
            el('span', { class: 'tier-label' }, tierLabel(tier))
          )
        ),
        el('button', { type: 'button', class: 'cmp-remove', onclick: () => remove(slug), 'aria-label': 'Quitar de la comparación' }, '✕')
      ),
      el('p', { class: 'cmp-oneliner' }, it.one_liner || '')
    );
  }

  function renderRow(label, getter, opts) {
    opts = opts || {};
    const cells = state.selected.map(slug => {
      const it = state.byslug[slug];
      const v = it ? getter(it) : '—';
      return el('td', { class: opts.cellClass || '' }, v);
    });
    return el('tr', null,
      el('th', { scope: 'row' }, label),
      ...cells
    );
  }

  function render() {
    board.innerHTML = '';
    if (!state.selected.length) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    // Top: column headers (one per selected protocol)
    const headerRow = el('div', { class: 'cmp-cols' },
      ...state.selected.map(renderColumn)
    );
    board.appendChild(headerRow);

    // Side-by-side attribute table
    const table = el('table', { class: 'cmp-table' },
      el('thead', null,
        el('tr', null,
          el('th', { scope: 'col' }, 'Atributo'),
          ...state.selected.map(slug => {
            const it = state.byslug[slug];
            return el('th', { scope: 'col' }, it ? it.name : slug);
          })
        )
      ),
      el('tbody', null,
        renderRow('Categoría',        it => it.category || '—'),
        renderRow('Nivel',            it => tierLabel(it.tier || 2), { cellClass: 'cmp-cell-tier' }),
        renderRow('Eficacia',         it => `${it.effectiveness || 0}/10`, { cellClass: 'cmp-cell-num' }),
        renderRow('Certeza',          it => `${it.certainty || 0}/10`, { cellClass: 'cmp-cell-num' }),
        renderRow('Combinada (E×C)',  it => `${(it.effectiveness || 0) * (it.certainty || 0)}`, { cellClass: 'cmp-cell-num' }),
        renderRow('Nivel de evidencia', it => it.evidence_level || '—'),
        renderRow('Coste',            it => shortCost(it.cost_signal)),
        renderRow('Veredicto',        it => it.verdict || '—'),
        renderRow('A considerar si',  it => it.who_should_consider || '—'),
        renderRow('Mejor evitar si',  it => it.who_should_skip || '—'),
        renderRow('Efectos secundarios', it => {
          const arr = it.side_effects || [];
          return arr.length ? arr.slice(0, 5).join(' • ') : '—';
        }),
        renderRow('Contraindicaciones', it => {
          const arr = it.contraindications || [];
          return arr.length ? arr.slice(0, 5).join(' • ') : '—';
        }),
        renderRow('Objetivos', it => {
          const arr = it.targets || [];
          return arr.length ? arr.join(', ') : '—';
        }),
        renderRow('Etiquetas', it => {
          const arr = it.tags || [];
          return arr.length ? arr.join(', ') : '—';
        }),
        renderRow('Abrir', it => {
          const a = el('a', { href: `/items/${it.slug}.html` }, 'Evidencia completa →');
          return a;
        }, { cellClass: 'cmp-cell-link' })
      )
    );
    board.appendChild(table);
  }

  // Search dropdown using the items manifest
  function searchItems(q) {
    if (!state.items) return [];
    q = q.toLowerCase().trim();
    if (q.length < 1) return [];
    const score = (it) => {
      const n = (it.name || '').toLowerCase();
      const o = (it.one_liner || '').toLowerCase();
      const tags = (it.tags || []).join(' ').toLowerCase();
      if (n === q) return 100;
      if (n.indexOf(q) === 0) return 80;
      if (n.indexOf(q) !== -1) return 60;
      if (tags.indexOf(q) !== -1) return 40;
      if (o.indexOf(q) !== -1) return 20;
      return 0;
    };
    return state.items
      .map(it => ({ it, s: score(it) }))
      .filter(x => x.s > 0 && !state.selected.includes(x.it.slug))
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map(x => x.it);
  }

  function renderSearchResults(matches) {
    if (!matches.length) {
      results.innerHTML = '<div class="cmp-search-empty">Sin resultados.</div>';
      results.hidden = false;
      return;
    }
    results.innerHTML = '';
    matches.forEach(it => {
      const tier = it.tier || 2;
      const row = el('button', {
        type: 'button',
        class: 'cmp-search-item',
        onclick: () => { add(it.slug); input.value = ''; results.hidden = true; },
      },
        el('span', { class: 'cmp-search-name' }, it.name),
        el('span', { class: 'cmp-search-meta' },
          el('span', { class: `tier-badge tier-${tier}` },
            el('span', { class: 'tier-num' }, `T${tier}`)
          ),
          el('span', null, `E ${it.effectiveness || 0} · C ${it.certainty || 0}`)
        )
      );
      results.appendChild(row);
    });
    results.hidden = false;
  }

  function runSearch() {
    const q = (input.value || '').trim().toLowerCase();
    if (q.length < 1) { results.hidden = true; results.innerHTML = ''; return; }
    renderSearchResults(searchItems(q));
  }

  input.addEventListener('input', runSearch);
  input.addEventListener('focus', runSearch);
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') { results.hidden = true; }
    if (ev.key === 'Enter') {
      const first = results.querySelector('.cmp-search-item');
      if (first) first.click();
    }
  });
  document.addEventListener('click', (ev) => {
    if (ev.target === input) return;
    if (results.contains(ev.target)) return;
    results.hidden = true;
  });
  if (clearBtn) clearBtn.addEventListener('click', clearAll);
  window.addEventListener('hashchange', () => {
    const requested = readHash();
    state.selected = requested.filter(s => state.byslug[s]);
    render();
  });

  // Boot: load items manifest, hydrate from URL hash, render.
  fetch('/items.json', { cache: 'no-cache' })
    .then(r => r.json())
    .then(data => {
      state.items = data;
      state.byslug = {};
      data.forEach(it => { state.byslug[it.slug] = it; });
      const requested = readHash();
      state.selected = requested.filter(s => state.byslug[s]);
      render();
    })
    .catch(err => {
      board.innerHTML = '<p class="wiz-error">No se pudieron cargar los elementos: ' + err + '</p>';
    });
})();
