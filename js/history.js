// js/history.js - Calculation history using localStorage
(function () {
    const KEY = 'uwucalc_history';
    const MAX_ENTRIES = 100;

    function getHistory(calcId) {
        try {
            const all = JSON.parse(localStorage.getItem(KEY) || '{}');
            return all[calcId] || [];
        } catch {
            return [];
        }
    }

    function addEntry(calcId, inputs, result) {
        try {
            const all = JSON.parse(localStorage.getItem(KEY) || '{}');
            if (!all[calcId]) all[calcId] = [];
            all[calcId].unshift({
                inputs,
                result,
                time: new Date().toISOString()
            });
            if (all[calcId].length > MAX_ENTRIES) all[calcId] = all[calcId].slice(0, MAX_ENTRIES);
            localStorage.setItem(KEY, JSON.stringify(all));
        } catch (e) {
            console.warn('History save failed', e);
        }
    }

    function clearHistory(calcId) {
        try {
            const all = JSON.parse(localStorage.getItem(KEY) || '{}');
            if (calcId) {
                delete all[calcId];
            } else {
                Object.keys(all).forEach(k => delete all[k]);
            }
            localStorage.setItem(KEY, JSON.stringify(all));
        } catch (e) {
            console.warn('History clear failed', e);
        }
    }

    function renderHistoryPanel(calcId, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const entries = getHistory(calcId);
        const panel = document.querySelector('.history-panel');
        if (!panel) return;

        const listEl = panel.querySelector('.history-list') || (() => {
            const el = document.createElement('div');
            el.className = 'history-list';
            panel.appendChild(el);
            return el;
        })();

        if (!entries.length) {
            listEl.innerHTML = '<div class="history-empty">No calculations yet.</div>';
            return;
        }

        listEl.innerHTML = entries.map(e => `
      <div class="history-item">
        <div class="history-item-inputs">${formatInputs(e.inputs)}</div>
        <div>
          <div class="history-item-result">${e.result}</div>
          <div class="history-item-time">${formatTime(e.time)}</div>
        </div>
      </div>
    `).join('');
    }

    function formatInputs(inputs) {
        if (typeof inputs === 'string') return inputs;
        return Object.entries(inputs)
            .map(([k, v]) => `<span>${k}: <strong>${v}</strong></span>`)
            .join(' &nbsp; ');
    }

    function formatTime(iso) {
        const d = new Date(iso);
        return d.toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function initHistoryPanel(calcId) {
        const toggleBtn = document.querySelector('.history-btn-header');
        const panel = document.querySelector('.history-panel');
        const clearBtn = panel?.querySelector('.history-clear-btn');

        if (toggleBtn && panel) {
            toggleBtn.addEventListener('click', () => {
                panel.classList.toggle('open');
                if (panel.classList.contains('open')) {
                    renderHistoryPanel(calcId);
                }
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                clearHistory(calcId);
                renderHistoryPanel(calcId);
                showToast('History cleared');
            });
        }
    }

    window.uwuHistory = {
        get: getHistory,
        add: addEntry,
        clear: clearHistory,
        render: renderHistoryPanel,
        init: initHistoryPanel
    };
})();