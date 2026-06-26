// js/history.js - Calculation history using localStorage
(function () {
    const KEY = 'uwucalc_history';
    const MAX_ENTRIES = 100;

    let _currentCalcId = null;

    function getHistory(calcId) {
        try {
            const all = JSON.parse(localStorage.getItem(KEY) || '{}');
            return all[calcId] || [];
        } catch {
            return [];
        }
    }

    function snapshotFields() {
        const container = document.querySelector('.calc-engine-container');
        if (!container) return {};
        const snapshot = {};
        container.querySelectorAll('input, select, textarea').forEach(el => {
            if (!el.id) return;
            if (el.type === 'checkbox' || el.type === 'radio') {
                snapshot[el.id] = el.checked;
            } else {
                snapshot[el.id] = el.value;
            }
        });
        return snapshot;
    }

    function restoreFields(fieldValues) {
        if (!fieldValues || typeof fieldValues !== 'object') return;
        Object.entries(fieldValues).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (!el) return;
            if (el.type === 'checkbox' || el.type === 'radio') {
                el.checked = !!val;
            } else {
                el.value = val;
            }
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }

    function buildInputDisplay(inputs, fieldValues) {
        const parts = [];
        if (inputs && typeof inputs === 'object' && Object.keys(inputs).length) {
            Object.entries(inputs).forEach(([k, v]) => {
                parts.push(`<span>${k}: <strong>${v}</strong></span>`);
            });
        } else if (typeof inputs === 'string' && inputs) {
            parts.push(`<span>${inputs}</span>`);
        }
        return parts.join(' &nbsp; ');
    }

    function addEntry(calcId, inputs, result) {
        try {
            const fieldValues = snapshotFields();
            const all = JSON.parse(localStorage.getItem(KEY) || '{}');
            if (!all[calcId]) all[calcId] = [];
            all[calcId].unshift({
                inputs,
                result,
                fieldValues,
                time: new Date().toISOString()
            });
            if (all[calcId].length > MAX_ENTRIES) all[calcId] = all[calcId].slice(0, MAX_ENTRIES);
            localStorage.setItem(KEY, JSON.stringify(all));
            // Auto-refresh panel if open
            const panel = document.querySelector('.history-panel');
            if (panel && panel.classList.contains('open')) {
                renderHistoryPanel(_currentCalcId || calcId);
            }
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

    function renderHistoryPanel(calcId) {
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

        listEl.innerHTML = entries.map((e, i) => `
      <div class="history-item${e.fieldValues ? ' clickable' : ''}" data-history-idx="${i}">
        <div class="history-item-inputs">${buildInputDisplay(e.inputs, e.fieldValues)}</div>
        <div>
          ${e.result ? `<div class="history-item-result">${e.result}</div>` : ''}
          <div class="history-item-time">${formatTime(e.time)}</div>
        </div>
      </div>
    `).join('');

        // Attach click-to-restore handlers
        listEl.querySelectorAll('.history-item.clickable').forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.dataset.historyIdx);
                const entry = entries[idx];
                if (entry && entry.fieldValues) {
                    restoreFields(entry.fieldValues);
                    showToast('Fields restored from history');
                }
            });
        });
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
        _currentCalcId = calcId;
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
