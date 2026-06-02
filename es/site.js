// Trajectory — filter/search/sort
(function () {
  const grid = document.getElementById('grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.card'));
  const search = document.getElementById('search');
  const minEff = document.getElementById('min-eff');
  const minCer = document.getElementById('min-cer');
  const minEffV = document.getElementById('min-eff-v');
  const minCerV = document.getElementById('min-cer-v');
  const sortSel = document.getElementById('sort');
  const tierToggles = Array.from(document.querySelectorAll('.tier-toggle'));

  function apply() {
    const q = (search ? search.value || '' : '').toLowerCase().trim();
    const e = minEff ? parseInt(minEff.value, 10) : 0;
    const c = minCer ? parseInt(minCer.value, 10) : 0;
    if (minEffV) minEffV.textContent = e;
    if (minCerV) minCerV.textContent = c;

    const enabledTiers = new Set(
      tierToggles.filter(t => t.checked).map(t => t.dataset.tier)
    );
    const filterTiers = tierToggles.length > 0;

    const sortBy = sortSel ? sortSel.value : 'combined';

    let visible = cards.filter(card => {
      const name = card.dataset.name || '';
      const eff = parseInt(card.dataset.effectiveness || '0', 10);
      const cer = parseInt(card.dataset.certainty || '0', 10);
      const tier = card.dataset.tier || '';
      if (q && !name.includes(q)) return false;
      if (eff < e) return false;
      if (cer < c) return false;
      if (filterTiers && !enabledTiers.has(tier)) return false;
      return true;
    });

    visible.sort((a, b) => {
      const ae = parseInt(a.dataset.effectiveness || '0', 10);
      const be = parseInt(b.dataset.effectiveness || '0', 10);
      const ac = parseInt(a.dataset.certainty || '0', 10);
      const bc = parseInt(b.dataset.certainty || '0', 10);
      const at = parseInt(a.dataset.tier || '99', 10);
      const bt = parseInt(b.dataset.tier || '99', 10);
      if (sortBy === 'effectiveness') return be - ae;
      if (sortBy === 'certainty') return bc - ac;
      if (sortBy === 'tier') {
        if (at !== bt) return at - bt;
        return (be * bc) - (ae * ac);
      }
      if (sortBy === 'name') return (a.dataset.name || '').localeCompare(b.dataset.name || '');
      // combined
      return (be * bc) - (ae * ac);
    });

    // hide all, then re-append in order
    cards.forEach(c => c.style.display = 'none');
    visible.forEach(c => {
      c.style.display = '';
      grid.appendChild(c);
    });

    // Empty state
    let empty = document.getElementById('grid-empty');
    if (visible.length === 0) {
      if (!empty) {
        empty = document.createElement('div');
        empty.id = 'grid-empty';
        empty.className = 'grid-empty';
        empty.innerHTML = '<p>Ninguna intervención coincide con estos filtros. Pruebe a ampliar la búsqueda o a reactivar un nivel.</p>';
        grid.parentNode.insertBefore(empty, grid.nextSibling);
      }
      empty.style.display = '';
    } else if (empty) {
      empty.style.display = 'none';
    }
  }

  [search, minEff, minCer, sortSel].forEach(el => {
    el && el.addEventListener('input', apply);
    el && el.addEventListener('change', apply);
  });
  tierToggles.forEach(t => t.addEventListener('change', apply));

  apply();
})();

// ============================================================
// Global header search — fuzzy-ish filter against /search-index.json
// ============================================================
(function () {
  var input = document.getElementById('global-search');
  var box   = document.getElementById('global-search-results');
  if (!input || !box) return;

  var index = null;
  var loadingPromise = null;

  function ensureIndex() {
    if (index) return Promise.resolve(index);
    if (loadingPromise) return loadingPromise;
    loadingPromise = fetch('/search-index.json', { cache: 'no-cache' })
      .then(function (r) { return r.json(); })
      .then(function (data) { index = Array.isArray(data) ? data : []; return index; })
      .catch(function () { index = []; return index; });
    return loadingPromise;
  }

  var TYPE_LABELS = { protocol: 'Protocolo', post: 'Notas', concern: 'Inquietud' };

  function score(entry, q) {
    var t = (entry.title || '').toLowerCase();
    var b = (entry.blurb || '').toLowerCase();
    var tags = (entry.tags || []).join(' ').toLowerCase();
    if (t === q) return 100;
    if (t.indexOf(q) === 0) return 80;
    if (t.indexOf(q) !== -1) return 60;
    if (tags.indexOf(q) !== -1) return 40;
    if (b.indexOf(q) !== -1) return 20;
    return 0;
  }

  function render(matches, q) {
    if (!matches.length) {
      box.innerHTML = '<div class="site-search-empty">Sin resultados para «' + escHtml(q) + '»</div>';
      box.hidden = false;
      return;
    }
    box.innerHTML = matches.slice(0, 10).map(function (m, i) {
      return '<a class="site-search-item" href="' + escHtml(m.url) + '" role="option" data-i="' + i + '">' +
        '<span class="site-search-type site-search-type-' + escHtml(m.type) + '">' + escHtml(TYPE_LABELS[m.type] || m.type) + '</span>' +
        '<span class="site-search-body">' +
          '<span class="site-search-title">' + escHtml(m.title) + '</span>' +
          (m.blurb ? '<span class="site-search-blurb">' + escHtml(m.blurb) + '</span>' : '') +
        '</span>' +
      '</a>';
    }).join('');
    box.hidden = false;
  }

  function escHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function run() {
    var q = (input.value || '').trim().toLowerCase();
    if (q.length < 2) { box.hidden = true; box.innerHTML = ''; return; }
    ensureIndex().then(function (data) {
      var scored = data
        .map(function (e) { return { e: e, s: score(e, q) }; })
        .filter(function (x) { return x.s > 0; })
        .sort(function (a, b) { return b.s - a.s; })
        .map(function (x) { return x.e; });
      render(scored, q);
    });
  }

  input.addEventListener('input', run);
  input.addEventListener('focus', function () { if (input.value.trim().length >= 2) run(); });
  document.addEventListener('click', function (ev) {
    if (ev.target === input) return;
    if (box.contains(ev.target)) return;
    box.hidden = true;
  });
  input.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') { box.hidden = true; input.blur(); return; }
    if (ev.key === 'Enter') {
      var first = box.querySelector('.site-search-item');
      if (first) { window.location.href = first.getAttribute('href'); }
    }
  });
})();

// ============================================================
// Personalization stripped per anti-account-creep rule.
// Trajectory does not remember you across visits. No "Welcome back",
// no saved stacks, no localStorage-driven UI swaps. Evidence is the product.
// ============================================================
