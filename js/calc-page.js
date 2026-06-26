// js/calc-page.js - Reads slug from URL, renders calculator page, calls correct engine

(function () {
    const CATEGORY_ICONS = {
        'Financial': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
        'Fitness & Health': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
        'Math': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`,
        'Other': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    };

    function getSlugFromPath() {
        const parts = window.location.pathname.split('/');
        return parts[parts.length - 1] || '';
    }

    function renderNotFound(slug) {
        const page = document.getElementById('calcPage');
        if (!page) return;
        page.innerHTML = `
      <div style="text-align:center;padding:60px 20px;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin:0 auto 16px;display:block;">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h1 style="font-size:1.5rem;margin-bottom:8px;color:var(--text-primary);">Calculator Not Found</h1>
        <p style="color:var(--text-muted);margin-bottom:24px;">We couldn't find a calculator for <strong>${slug}</strong>.</p>
        <a href="/" class="btn-primary" style="text-decoration:none;display:inline-flex;align-items:center;gap:8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          Back to Home
        </a>
      </div>
    `;
    }

    function renderCalcPage(calc) {
        const page = document.getElementById('calcPage');
        if (!page) return;
        document.title = `${calc.name} - uwuCalc`;

        const isFav = window.uwuFavourites ? uwuFavourites.is(calc.id) : false;

        page.innerHTML = `
      <div class="calc-page-header">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <a href="/?cat=${encodeURIComponent(calc.category)}">${calc.category}</a>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span aria-current="page">${calc.name}</span>
        </nav>
        <h1 class="calc-page-title">${calc.name}</h1>
        <p class="calc-page-desc">${calc.description}</p>
        <div class="calc-page-actions">
          <button class="fav-btn${isFav ? ' active' : ''}" id="favBtn" aria-label="Toggle favourite">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span class="fav-btn-text">${isFav ? 'Unfavourite' : 'Favourite'}</span>
          </button>
          <button class="history-btn-header" aria-label="Show history">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="12 8 12 12 14 14"/><circle cx="12" cy="12" r="10"/>
            </svg>
            History
          </button>
        </div>
      </div>

      <div class="history-panel" id="historyPanel">
        <div class="history-panel-header">
          <span class="history-panel-title">Calculation History</span>
          <button class="history-clear-btn">Clear all</button>
        </div>
        <div class="history-list"></div>
      </div>

      <div class="calc-engine-container" id="calcEngineContainer">
        <div style="text-align:center;padding:40px;color:var(--text-muted);">Loading calculator...</div>
      </div>
    `;

        // Fav button
        const favBtn = document.getElementById('favBtn');
        if (favBtn) {
            favBtn.addEventListener('click', () => {
                const now = uwuFavourites.toggle(calc.id);
                const svg = favBtn.querySelector('svg');
                const txt = favBtn.querySelector('.fav-btn-text');
                const isNowFav = uwuFavourites.is(calc.id);
                favBtn.classList.toggle('active', isNowFav);
                if (svg) svg.setAttribute('fill', isNowFav ? 'currentColor' : 'none');
                if (txt) txt.textContent = isNowFav ? 'Unfavourite' : 'Favourite';
            });
        }

        // History
        if (window.uwuHistory) uwuHistory.init(calc.id);

        // Dispatch to engine
        const container = document.getElementById('calcEngineContainer');
        if (container) {
            dispatchEngine(calc, container);
        }
    }

    function dispatchEngine(calc, container) {
        const engineMap = {
            financial: window.uwuEngineFinancial,
            fitness: window.uwuEngineFitness,
            math: window.uwuEngineMath,
            other: window.uwuEngineOther,
            usa: window.uwuEngineUSA,
        };
        const engine = engineMap[calc.engine];
        if (!engine || typeof engine.render !== 'function') {
            container.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:20px;">Engine not yet implemented for this calculator.</p>`;
            return;
        }
        engine.render(calc, container);
    }

    function init() {
        const slug = getSlugFromPath();
        const calc = CALC_BY_SLUG[slug];

        if (typeof buildSidebar === 'function') buildSidebar();

        if (!calc) {
            renderNotFound(slug);
            return;
        }

        renderCalcPage(calc);

        // Mark sidebar active
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `/calc/${slug}`) item.classList.add('active');
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();