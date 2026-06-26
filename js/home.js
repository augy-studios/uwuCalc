// js/home.js - Home page: sidebar builder + discover grid

const CATEGORY_ICONS = {
    'Financial': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    'Fitness & Health': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    'Math': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`,
    'Other': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    'US-Centric': `<span style="font-size:14px;line-height:1;display:inline-block;width:14px;text-align:center">\u{1F1FA}\u{1F1F8}</span>`,
    'Singapore': `<span style="font-size:14px;line-height:1;display:inline-block;width:14px;text-align:center">\u{1F1F8}\u{1F1EC}</span>`,
};

// ============ SIDEBAR BUILDER ============
function buildSidebar() {
    const container = document.getElementById('sidebarContent');
    if (!container) return;
    const currentPath = window.location.pathname;
    const isHome = currentPath === '/' || currentPath === '';
    let html = `
    <div class="sidebar-section${isHome ? '' : ' collapsed'}">
      <div class="sidebar-section-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        Home
        <svg class="section-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="sidebar-section-items">
        <a href="/" class="sidebar-item${isHome ? ' active' : ''}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
          Basic / Scientific
        </a>
      </div>
    </div>
  `;
    // Favourites section
    const favIds = window.uwuFavourites ? uwuFavourites.get() : [];
    const favCalcs = CALC_REGISTRY.filter(c => favIds.includes(c.id)).sort((a,b) => a.name.localeCompare(b.name));
    if (favCalcs.length) {
        html += `
      <div class="sidebar-section${favCalcs.some(c => currentPath === '/' + c.slug) ? '' : ' collapsed'}">
        <div class="sidebar-section-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="color:#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Favourites
          <svg class="section-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="sidebar-section-items">
          ${favCalcs.map(c => `
            <a href="/${c.slug}" class="sidebar-item${currentPath === '/' + c.slug ? ' active' : ''}">
              <span style="width:14px;height:14px;display:inline-block;"></span>
              ${c.name}
              <button class="sidebar-fav-star starred" data-calc-id="${c.id}" aria-label="Toggle favourite">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </button>
            </a>
          `).join('')}
        </div>
      </div>
    `;
    }

    CATEGORIES.forEach(cat => {
        const calcs = getCalcsByCategory(cat);
        const hasActive = calcs.some(c => currentPath === `/${c.slug}`);
        html += `
      <div class="sidebar-section${hasActive ? '' : ' collapsed'}">
        <div class="sidebar-section-header">
          ${CATEGORY_ICONS[cat] || ''}
          ${cat}
          <svg class="section-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="sidebar-section-items">
          ${calcs.sort((a,b) => a.name.localeCompare(b.name)).map(c => {
            const starred = window.uwuFavourites && uwuFavourites.is(c.id);
            return `
            <a href="/${c.slug}" class="sidebar-item${currentPath === '/' + c.slug ? ' active' : ''}">
              <span style="width:14px;height:14px;display:inline-block;"></span>
              ${c.name}
              <button class="sidebar-fav-star${starred ? ' starred' : ''}" data-calc-id="${c.id}" aria-label="Toggle favourite">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="${starred ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </button>
            </a>
          `}).join('')}
        </div>
      </div>
    `;
    });
    container.innerHTML = html;
}

// ============ DISCOVER GRID ============
let currentCat = 'all';

function buildCalcGrid(cat) {
    const grid = document.getElementById('calcGrid');
    if (!grid) return;
    currentCat = cat;

    let calcs;
    if (cat === 'all') {
        calcs = [...CALC_REGISTRY].sort((a, b) => a.name.localeCompare(b.name));
    } else if (cat === 'favourites') {
        const favs = uwuFavourites.get();
        calcs = CALC_REGISTRY.filter(c => favs.includes(c.id)).sort((a, b) => a.name.localeCompare(b.name));
    } else {
        calcs = getCalcsByCategory(cat).sort((a, b) => a.name.localeCompare(b.name));
    }

    if (!calcs.length) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);font-size:0.9rem;">No calculators found.</div>`;
        return;
    }

    grid.innerHTML = calcs.map(c => `
    <a href="/${c.slug}" class="calc-card">
      <div class="calc-card-icon">${CATEGORY_ICONS[c.category] || CATEGORY_ICONS['Other']}</div>
      <div class="calc-card-name">${c.name}</div>
      <div class="calc-card-cat">${c.category}</div>
      <button class="calc-card-fav${uwuFavourites.is(c.id) ? ' starred' : ''}" data-calc-id="${c.id}" aria-label="Toggle favourite">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </button>
    </a>
  `).join('');

    // Attach fav handlers
    grid.querySelectorAll('.calc-card-fav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.dataset.calcId;
            uwuFavourites.toggle(id);
            btn.classList.toggle('starred', uwuFavourites.is(id));
            uwuFavourites.update(id);
            if (currentCat === 'favourites') buildCalcGrid('favourites');
        });
    });
    // Mark as already wired so initFavButtons doesn't double-bind
    grid.querySelectorAll('.calc-card-fav').forEach(btn => btn.dataset.bound = '1');
}

function initCategoryTabs() {
    const tabs = document.querySelectorAll('#categoryTabs .cat-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            buildCalcGrid(tab.dataset.cat);
        });
    });
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
    buildSidebar();

    // Handle /?cat= parameter
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    const initialCat = catParam && [...CATEGORIES, 'favourites'].includes(catParam) ? catParam : 'all';

    buildCalcGrid(initialCat);
    initCategoryTabs();

    // Activate the correct tab if cat param present
    if (catParam) {
        const tabs = document.querySelectorAll('#categoryTabs .cat-tab');
        tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
            if (t.dataset.cat === initialCat) {
                t.classList.add('active');
                t.setAttribute('aria-selected', 'true');
            }
        });
    }

    if (window.uwuFavourites) uwuFavourites.init(null);

    // Count
    const countEl = document.getElementById('calcCount');
    if (countEl) countEl.textContent = CALC_REGISTRY.length + ' calculators';

    // Init sidebar collapse & active
    document.querySelectorAll('.sidebar-section-header').forEach(header => {
        header.addEventListener('click', () => {
            header.closest('.sidebar-section').classList.toggle('collapsed');
        });
    });
});