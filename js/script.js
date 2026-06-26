// js/script.js - Shared utilities: toast, sidebar, SW registration

// ============ TOAST ============
function showToast(message, duration = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    ${message}
  `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 250);
    }, duration);
}

// ============ SIDEBAR ============
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburgerBtn');
    const overlay = document.getElementById('sidebarOverlay');
    if (!sidebar || !hamburger) return;

    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
    });

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }

    // Collapsible sections
    document.querySelectorAll('.sidebar-section-header').forEach(header => {
        header.addEventListener('click', () => {
            header.closest('.sidebar-section').classList.toggle('collapsed');
        });
    });

    // Mark active item
    const path = window.location.pathname;
    document.querySelectorAll('.sidebar-item').forEach(item => {
        if (item.getAttribute('href') === path) {
            item.classList.add('active');
        }
    });
}

// ============ SERVICE WORKER ============
function registerSW() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
        });
    }
}

// ============ ENTER KEY → CALCULATE ============
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('.calc-field input, .calc-field select, .calc-engine-container input, .calc-engine-container select, .form-input, .form-select')) {
        e.preventDefault();
        if (typeof window._calcRun === 'function') {
            window._calcRun();
        } else {
            const calcBtn = document.querySelector('.calc-engine-container .btn-primary, .calc-engine-container .btn-calc');
            if (calcBtn) calcBtn.click();
        }
    }
    // Ctrl+K to focus search bar
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
    }
});

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
    registerSW();
    if (window.uwuTheme) uwuTheme.init();
    if (window.uwuSearch) uwuSearch.init();
    initSidebar();

    // ?q= URL parameter search activation
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = q;
            searchInput.dispatchEvent(new Event('input'));
            searchInput.focus();
        }
    }
});