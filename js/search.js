// js/search.js - Search bar functionality
(function () {
    function initSearch() {
        const input = document.getElementById('searchInput');
        const dropdown = document.getElementById('searchDropdown');
        if (!input || !dropdown) return;

        let debounceTimer;

        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const q = input.value.trim();
                if (!q) {
                    dropdown.classList.remove('active');
                    dropdown.innerHTML = '';
                    return;
                }
                const results = searchCalcs(q);
                renderResults(results, q, dropdown);
            }, 200);
        });

        input.addEventListener('focus', () => {
            if (input.value.trim()) dropdown.classList.add('active');
        });

        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdown.classList.remove('active');
                input.blur();
            }
            if (e.key === 'Enter') {
                const first = dropdown.querySelector('.search-result-item');
                if (first) first.click();
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const items = dropdown.querySelectorAll('.search-result-item');
                if (items.length) items[0].focus();
            }
        });
    }

    function renderResults(results, query, container) {
        container.innerHTML = '';
        if (!results.length) {
            container.innerHTML = `<div class="search-no-results">No calculators found for "${escapeHtml(query)}"</div>`;
            container.classList.add('active');
            return;
        }
        results.forEach(calc => {
            const item = document.createElement('a');
            item.className = 'search-result-item';
            item.href = `/${calc.slug}`;
            item.innerHTML = `
        <span class="result-icon">${getCategoryIcon(calc.category)}</span>
        <span>
          <div class="result-name">${highlightMatch(calc.name, query)}</div>
          <div class="result-cat">${calc.category}</div>
        </span>
      `;
            container.appendChild(item);
        });
        container.classList.add('active');
    }

    function highlightMatch(text, query) {
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return text.replace(new RegExp(`(${escaped})`, 'gi'), '<strong>$1</strong>');
    }

    function getCategoryIcon(cat) {
        const icons = {
            'Financial': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
            'Fitness & Health': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
            'Math': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`,
            'Other': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
        };
        return icons[cat] || icons['Other'];
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    window.uwuSearch = {
        init: initSearch
    };
})();