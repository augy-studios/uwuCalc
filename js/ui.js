// js/ui.js - Shared UI primitives: icon hydration and modal show/hide.
(function () {
    // Safe to call repeatedly; re-renders when data-icon changes.
    function hydrateIcons(root) {
        root = root || document;
        root.querySelectorAll('[data-icon]').forEach(function (el) {
            const name = el.dataset.icon;
            if (el.dataset.iconRendered === name) return;
            el.innerHTML = window.uwuIcons ? uwuIcons.icon(name) : '';
            el.dataset.iconRendered = name;
        });
    }

    function openModal(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('hidden');
        document.body.classList.add('modal-open');
    }

    function closeModal(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.add('hidden');
        if (!document.querySelector('.modal-backdrop:not(.hidden)')) {
            document.body.classList.remove('modal-open');
        }
    }

    window.uwuUI = {
        hydrateIcons: hydrateIcons,
        openModal: openModal,
        closeModal: closeModal
    };
})();
