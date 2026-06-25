// js/theme.js - Theme management
(function () {
    const THEMES = [{
            id: 'classic',
            name: 'Classic',
            color: '#ccffcc',
            label: 'Minty Green'
        },
        {
            id: 'ng1',
            name: 'Not green 1',
            color: '#ffcccc',
            label: 'Rosy Pink'
        },
        {
            id: 'ng2',
            name: 'Not green 2',
            color: '#ccccff',
            label: 'Soft Lavender'
        },
        {
            id: 'ng3',
            name: 'Not green 3',
            color: '#ffffcc',
            label: 'Pale Yellow'
        },
        {
            id: 'ng4',
            name: 'Not green 4',
            color: '#ffccff',
            label: 'Lilac Blush'
        },
        {
            id: 'ng5',
            name: 'Not green 5',
            color: '#ccffff',
            label: 'Sky Aqua'
        },
        {
            id: 'white',
            name: 'Really really light green',
            color: '#ffffff',
            label: 'Pure White'
        },
    ];

    const STORAGE_KEY = 'uwucalc_theme';

    function applyTheme(id) {
        const theme = THEMES.find(t => t.id === id) || THEMES[0];
        document.documentElement.setAttribute('data-theme', theme.id === 'classic' ? '' : theme.id);
        localStorage.setItem(STORAGE_KEY, theme.id);
        updateThemeUI(theme.id);
    }

    function updateThemeUI(id) {
        document.querySelectorAll('.theme-option').forEach(el => {
            el.classList.toggle('selected', el.dataset.themeId === id);
        });
    }

    function getSavedTheme() {
        return localStorage.getItem(STORAGE_KEY) || 'classic';
    }

    function buildThemeModal() {
        const overlay = document.getElementById('themeModal');
        if (!overlay) return;
        const grid = overlay.querySelector('.theme-grid');
        if (!grid) return;
        grid.innerHTML = '';
        const current = getSavedTheme();
        THEMES.forEach(theme => {
            const opt = document.createElement('button');
            opt.className = 'theme-option' + (theme.id === current ? ' selected' : '');
            opt.dataset.themeId = theme.id;
            opt.setAttribute('aria-label', `Switch to ${theme.name} theme`);
            opt.innerHTML = `
        <span class="theme-swatch" style="background:${theme.color};"></span>
        <span class="theme-name">${theme.name}</span>
      `;
            opt.addEventListener('click', () => {
                applyTheme(theme.id);
                showToast('Theme updated');
            });
            grid.appendChild(opt);
        });
    }

    function initTheme() {
        applyTheme(getSavedTheme());

        const themeBtn = document.getElementById('themeBtn');
        const themeModal = document.getElementById('themeModal');
        const themeModalClose = document.getElementById('themeModalClose');

        if (themeBtn && themeModal) {
            themeBtn.addEventListener('click', () => {
                buildThemeModal();
                themeModal.classList.add('open');
            });
        }

        if (themeModalClose) {
            themeModalClose.addEventListener('click', () => themeModal.classList.remove('open'));
        }

        if (themeModal) {
            themeModal.addEventListener('click', (e) => {
                if (e.target === themeModal) themeModal.classList.remove('open');
            });
        }
    }

    window.uwuTheme = {
        init: initTheme,
        apply: applyTheme,
        getSaved: getSavedTheme
    };
})();