// js/copy.js - Copy result to clipboard.
// Text is unselectable app-wide, so every result surface gets an explicit
// copy button instead: the home calculator display, and each result card
// rendered by a calculator engine.
(function () {
    const READY = 'copyReady';

    // execCommand fallback: covers insecure contexts, denied permission, and
    // an unfocused document, all of which reject the async clipboard API.
    function legacyWrite(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '0';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, ta.value.length);
        let ok = false;
        try {
            ok = document.execCommand('copy');
        } catch (e) {
            ok = false;
        }
        document.body.removeChild(ta);
        return ok ? Promise.resolve() : Promise.reject(new Error('copy failed'));
    }

    function writeText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text).catch(() => legacyWrite(text));
        }
        return legacyWrite(text);
    }

    // Prefer the primary value, then any value, then the whole surface.
    function resultTextOf(card) {
        const primary = card.querySelector('.result-primary .result-value') ||
            card.querySelector('.result-value');
        const src = primary || card;
        return (src.textContent || '').trim();
    }

    function flash(btn) {
        const span = btn.querySelector('[data-icon]');
        if (!span || span.dataset.icon === 'check') return;
        span.setAttribute('data-icon', 'check');
        if (window.uwuUI) uwuUI.hydrateIcons(btn);
        setTimeout(() => {
            span.setAttribute('data-icon', 'copy');
            if (window.uwuUI) uwuUI.hydrateIcons(btn);
        }, 1200);
    }

    function copyFrom(btn) {
        let text = '';
        const targetSel = btn.dataset.copyTarget;
        if (targetSel) {
            const el = document.querySelector(targetSel);
            text = el ? (el.textContent || '').trim() : '';
        } else {
            const card = btn.closest('.calc-result, .result-card');
            if (card) text = resultTextOf(card);
        }
        if (!text) return;
        writeText(text).then(() => {
            flash(btn);
            if (typeof showToast === 'function') showToast('Result copied');
        }).catch(() => {
            if (typeof showToast === 'function') showToast('Could not copy');
        });
    }

    function makeButton() {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-btn';
        btn.setAttribute('aria-label', 'Copy result');
        btn.innerHTML = '<span data-icon="copy"></span>Copy result';
        return btn;
    }

    // Engines replace innerHTML when they render, so decorate on mutation.
    function decorate(root) {
        (root || document).querySelectorAll('.calc-result, .result-card').forEach((card) => {
            // .calc-result is also the home display's own value element.
            if (card.dataset[READY] || card.closest('.calc-display')) return;
            card.dataset[READY] = '1';
            card.appendChild(makeButton());
            if (window.uwuUI) uwuUI.hydrateIcons(card);
        });
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.copy-btn, [data-copy-target]');
        if (btn) copyFrom(btn);
    });

    document.addEventListener('DOMContentLoaded', () => {
        decorate();
        if (window.uwuUI) uwuUI.hydrateIcons();
        const host = document.querySelector('.main-content') || document.body;
        new MutationObserver(() => decorate(host)).observe(host, {
            childList: true,
            subtree: true
        });
    });
})();
