// engines/financial.js - Financial calculators engine
// Exports: window.uwuEngineFinancial.render(calc, container)

(function () {
    'use strict';

    // ============ HELPERS ============
    function fmt(n, decimals = 2) {
        if (isNaN(n) || !isFinite(n)) return 'N/A';
        return Number(n).toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    function fmtCurrency(n) {
        return '$' + fmt(n);
    }

    function fmtPct(n) {
        return fmt(n, 2) + '%';
    }

    function resultCard(rows) {
        return `<div class="result-card">${rows.map((r, i) =>
      `<div class="result-row${i === 0 ? ' result-primary' : ''}">
        <span class="result-label">${r[0]}</span>
        <span class="result-value">${r[1]}</span>
      </div>`
    ).join('')}</div>`;
    }

    function formGroup(id, label, type = 'number', value = '', placeholder = '', prefix = '', suffix = '') {
        const prefixHtml = prefix ? `<span class="input-prefix">${prefix}</span>` : '';
        const suffixHtml = suffix ? `<span class="input-suffix">${suffix}</span>` : '';
        return `
      <div class="form-group">
        <label class="form-label" for="${id}">${label}</label>
        <div class="input-group">
          ${prefixHtml}
          <input class="form-input" type="${type}" id="${id}" value="${value}" placeholder="${placeholder}" step="any" />
          ${suffixHtml}
        </div>
      </div>`;
    }

    function selectGroup(id, label, options, selected = '') {
        return `
      <div class="form-group">
        <label class="form-label" for="${id}">${label}</label>
        <select class="form-select" id="${id}">
          ${options.map(o => `<option value="${o.v}"${o.v == selected ? ' selected' : ''}>${o.l}</option>`).join('')}
        </select>
      </div>`;
    }

    function renderButtons(calcId, onCalc, onReset) {
        return `<div style="display:flex;gap:12px;flex-wrap:wrap;">
      <button class="btn-primary" id="calcBtn_${calcId}">Calculate</button>
      <button class="btn-secondary" id="resetBtn_${calcId}">Reset</button>
    </div>`;
    }

    // ============ CALCULATOR RENDERERS ============
    const CALCS = {

        // --- MORTGAGE ---
        'mortgage': (el, id) => {
            el.innerHTML = `
        <div class="form-row">
          ${formGroup('homePrice', 'Home Price', 'number', '300000', '', '$')}
          ${formGroup('downPct', 'Down Payment', 'number', '20', '', '', '%')}
        </div>
        <div class="form-row">
          ${formGroup('mortRate', 'Annual Interest Rate', 'number', '7.0', '', '', '%')}
          ${formGroup('mortTerm', 'Loan Term', 'number', '30', '', '', 'years')}
        </div>
        ${renderButtons(id)}
        <div id="result_${id}"></div>`;
            el.querySelector(`#calcBtn_${id}`).onclick = () => {
                const price = +el.querySelector('#homePrice').value;
                const down = (+el.querySelector('#downPct').value) / 100;
                const rate = (+el.querySelector('#mortRate').value) / 100 / 12;
                const n = +el.querySelector('#mortTerm').value * 12;
                const principal = price * (1 - down);
                const monthly = rate === 0 ? principal / n : principal * rate * Math.pow(1 + rate, n) / (Math.pow(1 + rate, n) - 1);
                const total = monthly * n;
                const interest = total - principal;
                const res = resultCard([
                    ['Monthly Payment', fmtCurrency(monthly)],
                    ['Loan Amount', fmtCurrency(principal)],
                    ['Down Payment', fmtCurrency(price * down)],
                    ['Total Interest Paid', fmtCurrency(interest)],
                    ['Total Cost', fmtCurrency(total)],
                ]);
                el.querySelector(`#result_${id}`).innerHTML = res;
                if (window.uwuHistory) uwuHistory.add(id, {
                    'Home Price': fmtCurrency(price),
                    'Down': el.querySelector('#downPct').value + '%',
                    'Rate': el.querySelector('#mortRate').value + '%',
                    'Term': el.querySelector('#mortTerm').value + 'yr'
                }, fmtCurrency(monthly) + '/mo');
            };
            el.querySelector(`#resetBtn_${id}`).onclick = () => {
                el.querySelectorAll('input').forEach(i => i.value = '');
                el.querySelector(`#result_${id}`).innerHTML = '';
            };
        },

        // --- LOAN ---
        'loan': (el, id) => {
            el.innerHTML = `
        <div class="form-row">
          ${formGroup('loanAmt', 'Loan Amount', 'number', '10000', '', '$')}
          ${formGroup('loanRate', 'Annual Interest Rate', 'number', '6.0', '', '', '%')}
        </div>
        ${formGroup('loanTerm', 'Loan Term', 'number', '5', '', '', 'years')}
        ${renderButtons(id)}
        <div id="result_${id}"></div>`;
            el.querySelector(`#calcBtn_${id}`).onclick = () => {
                const p = +el.querySelector('#loanAmt').value;
                const r = +el.querySelector('#loanRate').value / 100 / 12;
                const n = +el.querySelector('#loanTerm').value * 12;
                const monthly = r === 0 ? p / n : p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
                el.querySelector(`#result_${id}`).innerHTML = resultCard([
                    ['Monthly Payment', fmtCurrency(monthly)],
                    ['Total Payment', fmtCurrency(monthly * n)],
                    ['Total Interest', fmtCurrency(monthly * n - p)],
                ]);
                if (window.uwuHistory) uwuHistory.add(id, {
                    Amount: fmtCurrency(p),
                    Rate: el.querySelector('#loanRate').value + '%',
                    Term: el.querySelector('#loanTerm').value + 'yr'
                }, fmtCurrency(monthly) + '/mo');
            };
            el.querySelector(`#resetBtn_${id}`).onclick = () => {
                el.querySelectorAll('input').forEach(i => i.value = '');
                el.querySelector(`#result_${id}`).innerHTML = '';
            };
        },

        // --- COMPOUND INTEREST ---
        'compound-interest': (el, id) => {
            el.innerHTML = `
        <div class="form-row">
          ${formGroup('ciPrincipal', 'Initial Investment', 'number', '1000', '', '$')}
          ${formGroup('ciRate', 'Annual Interest Rate', 'number', '7', '', '', '%')}
        </div>
        <div class="form-row">
          ${formGroup('ciYears', 'Number of Years', 'number', '10', '')}
          ${selectGroup('ciComp', 'Compound Frequency', [
            {v:'12',l:'Monthly'},{v:'4',l:'Quarterly'},{v:'2',l:'Semi-annually'},{v:'1',l:'Annually'}
          ], '12')}
        </div>
        ${formGroup('ciContrib', 'Monthly Contribution', 'number', '0', '0', '$')}
        ${renderButtons(id)}
        <div id="result_${id}"></div>`;
            el.querySelector(`#calcBtn_${id}`).onclick = () => {
                const p = +el.querySelector('#ciPrincipal').value;
                const r = +el.querySelector('#ciRate').value / 100;
                const t = +el.querySelector('#ciYears').value;
                const n = +el.querySelector('#ciComp').value;
                const c = +el.querySelector('#ciContrib').value;
                const fv = p * Math.pow(1 + r / n, n * t) + c * (Math.pow(1 + r / n, n * t) - 1) / (r / n);
                const invested = p + c * 12 * t;
                el.querySelector(`#result_${id}`).innerHTML = resultCard([
                    ['Future Value', fmtCurrency(fv)],
                    ['Total Invested', fmtCurrency(invested)],
                    ['Total Interest Earned', fmtCurrency(fv - invested)],
                ]);
                if (window.uwuHistory) uwuHistory.add(id, {
                    Principal: fmtCurrency(p),
                    Rate: r * 100 + '%',
                    Years: t
                }, fmtCurrency(fv));
            };
            el.querySelector(`#resetBtn_${id}`).onclick = () => {
                el.querySelectorAll('input').forEach(i => i.value = '');
                el.querySelector(`#result_${id}`).innerHTML = '';
            };
        },

        // --- SIMPLE INTEREST ---
        'simple-interest': (el, id) => {
            el.innerHTML = `
        <div class="form-row">
          ${formGroup('siP', 'Principal', 'number', '1000', '', '$')}
          ${formGroup('siR', 'Annual Rate', 'number', '5', '', '', '%')}
        </div>
        ${formGroup('siT', 'Time', 'number', '3', '', '', 'years')}
        ${renderButtons(id)}
        <div id="result_${id}"></div>`;
            el.querySelector(`#calcBtn_${id}`).onclick = () => {
                const p = +el.querySelector('#siP').value,
                    r = +el.querySelector('#siR').value / 100,
                    t = +el.querySelector('#siT').value;
                const interest = p * r * t;
                el.querySelector(`#result_${id}`).innerHTML = resultCard([
                    ['Simple Interest', fmtCurrency(interest)],
                    ['Total Amount', fmtCurrency(p + interest)]
                ]);
                if (window.uwuHistory) uwuHistory.add(id, {
                    P: fmtCurrency(p),
                    R: r * 100 + '%',
                    T: t + 'yr'
                }, fmtCurrency(interest));
            };
            el.querySelector(`#resetBtn_${id}`).onclick = () => {
                el.querySelectorAll('input').forEach(i => i.value = '');
                el.querySelector(`#result_${id}`).innerHTML = '';
            };
        },

        // --- SAVINGS ---
        'savings': (el, id) => {
            el.innerHTML = `
        <div class="form-row">
          ${formGroup('savInit', 'Initial Savings', 'number', '0', '', '$')}
          ${formGroup('savMonthly', 'Monthly Contribution', 'number', '200', '', '$')}
        </div>
        <div class="form-row">
          ${formGroup('savRate', 'Annual Interest Rate', 'number', '4', '', '', '%')}
          ${formGroup('savYears', 'Years to Grow', 'number', '10', '')}
        </div>
        ${renderButtons(id)}
        <div id="result_${id}"></div>`;
            el.querySelector(`#calcBtn_${id}`).onclick = () => {
                const init = +el.querySelector('#savInit').value,
                    m = +el.querySelector('#savMonthly').value;
                const r = +el.querySelector('#savRate').value / 100 / 12,
                    n = +el.querySelector('#savYears').value * 12;
                const fv = init * Math.pow(1 + r, n) + (r === 0 ? m * n : m * (Math.pow(1 + r, n) - 1) / r);
                const invested = init + m * n;
                el.querySelector(`#result_${id}`).innerHTML = resultCard([
                    ['Future Value', fmtCurrency(fv)],
                    ['Total Contributed', fmtCurrency(invested)],
                    ['Interest Earned', fmtCurrency(fv - invested)]
                ]);
                if (window.uwuHistory) uwuHistory.add(id, {
                    Initial: fmtCurrency(init),
                    Monthly: fmtCurrency(m),
                    Rate: el.querySelector('#savRate').value + '%',
                    Years: el.querySelector('#savYears').value
                }, fmtCurrency(fv));
            };
            el.querySelector(`#resetBtn_${id}`).onclick = () => {
                el.querySelectorAll('input').forEach(i => i.value = '');
                el.querySelector(`#result_${id}`).innerHTML = '';
            };
        },

        // --- ROI ---
        'roi': (el, id) => {
            el.innerHTML = `
        <div class="form-row">
          ${formGroup('roiInitial', 'Initial Investment', 'number', '10000', '', '$')}
          ${formGroup('roiFinal', 'Final Value', 'number', '15000', '', '$')}
        </div>
        ${formGroup('roiYears', 'Investment Duration', 'number', '5', '', '', 'years')}
        ${renderButtons(id)}
        <div id="result_${id}"></div>`;
            el.querySelector(`#calcBtn_${id}`).onclick = () => {
                const i = +el.querySelector('#roiInitial').value,
                    f = +el.querySelector('#roiFinal').value,
                    y = +el.querySelector('#roiYears').value;
                const roi = (f - i) / i * 100;
                const annualROI = (Math.pow(f / i, 1 / y) - 1) * 100;
                el.querySelector(`#result_${id}`).innerHTML = resultCard([
                    ['Total ROI', fmtPct(roi)],
                    ['Annual ROI', fmtPct(annualROI)],
                    ['Net Profit', fmtCurrency(f - i)]
                ]);
                if (window.uwuHistory) uwuHistory.add(id, {
                    Initial: fmtCurrency(i),
                    Final: fmtCurrency(f)
                }, fmtPct(roi));
            };
            el.querySelector(`#resetBtn_${id}`).onclick = () => {
                el.querySelectorAll('input').forEach(i => i.value = '');
                el.querySelector(`#result_${id}`).innerHTML = '';
            };
        },

        // --- SALES TAX ---
        'sales-tax': (el, id) => {
            el.innerHTML = `
        <div class="form-row">
          ${formGroup('stPrice', 'Price Before Tax', 'number', '100', '', '$')}
          ${formGroup('stRate', 'Tax Rate', 'number', '8.25', '', '', '%')}
        </div>
        ${renderButtons(id)}
        <div id="result_${id}"></div>`;
            el.querySelector(`#calcBtn_${id}`).onclick = () => {
                const p = +el.querySelector('#stPrice').value,
                    r = +el.querySelector('#stRate').value / 100;
                const tax = p * r;
                el.querySelector(`#result_${id}`).innerHTML = resultCard([
                    ['Tax Amount', fmtCurrency(tax)],
                    ['Total Price', fmtCurrency(p + tax)]
                ]);
                if (window.uwuHistory) uwuHistory.add(id, {
                    Price: fmtCurrency(p),
                    Rate: el.querySelector('#stRate').value + '%'
                }, fmtCurrency(tax));
            };
            el.querySelector(`#resetBtn_${id}`).onclick = () => {
                el.querySelectorAll('input').forEach(i => i.value = '');
                el.querySelector(`#result_${id}`).innerHTML = '';
            };
        },

        // --- VAT ---
        'vat': (el, id) => {
            el.innerHTML = `
        <div class="form-row">
          ${formGroup('vatAmount', 'Amount', 'number', '100', '', '$')}
          ${formGroup('vatRate', 'VAT Rate', 'number', '20', '', '', '%')}
        </div>
        ${selectGroup('vatMode', 'Mode', [{v:'add',l:'Add VAT to price'},{v:'remove',l:'Remove VAT from price'}])}
        ${renderButtons(id)}
        <div id="result_${id}"></div>`;
            el.querySelector(`#calcBtn_${id}`).onclick = () => {
                const a = +el.querySelector('#vatAmount').value,
                    r = +el.querySelector('#vatRate').value / 100;
                const mode = el.querySelector('#vatMode').value;
                let net, vat, gross;
                if (mode === 'add') {
                    net = a;
                    vat = a * r;
                    gross = a + vat;
                } else {
                    gross = a;
                    net = a / (1 + r);
                    vat = gross - net;
                }
                el.querySelector(`#result_${id}`).innerHTML = resultCard([
                    ['Net Price (excl. VAT)', fmtCurrency(net)],
                    ['VAT Amount', fmtCurrency(vat)],
                    ['Gross Price (incl. VAT)', fmtCurrency(gross)]
                ]);
                if (window.uwuHistory) uwuHistory.add(id, {
                    Amount: fmtCurrency(a),
                    Rate: el.querySelector('#vatRate').value + '%',
                    Mode: mode
                }, 'VAT: ' + fmtCurrency(vat));
            };
            el.querySelector(`#resetBtn_${id}`).onclick = () => {
                el.querySelectorAll('input').forEach(i => i.value = '');
                el.querySelector(`#result_${id}`).innerHTML = '';
            };
        },

        // --- DISCOUNT ---
        'discount': (el, id) => {
            el.innerHTML = `
        <div class="form-row">
          ${formGroup('discOriginal', 'Original Price', 'number', '100', '', '$')}
          ${formGroup('discPct', 'Discount', 'number', '20', '', '', '%')}
        </div>
        ${renderButtons(id)}
        <div id="result_${id}"></div>`;
            el.querySelector(`#calcBtn_${id}`).onclick = () => {
                const p = +el.querySelector('#discOriginal').value,
                    d = +el.querySelector('#discPct').value / 100;
                const savings = p * d;
                el.querySelector(`#result_${id}`).innerHTML = resultCard([
                    ['Sale Price', fmtCurrency(p - savings)],
                    ['You Save', fmtCurrency(savings)]
                ]);
                if (window.uwuHistory) uwuHistory.add(id, {
                    Original: fmtCurrency(p),
                    Discount: el.querySelector('#discPct').value + '%'
                }, fmtCurrency(p - savings));
            };
            el.querySelector(`#resetBtn_${id}`).onclick = () => {
                el.querySelectorAll('input').forEach(i => i.value = '');
                el.querySelector(`#result_${id}`).innerHTML = '';
            };
        },

        // --- PERCENT OFF ---
        'percent-off': (el, id) => {
            CALCS['discount'](el, id);
        },

        // --- MARGIN ---
        'margin': (el, id) => {
            el.innerHTML = `
        <div class="form-row">
          ${formGroup('marginCost', 'Cost', 'number', '50', '', '$')}
          ${formGroup('marginSell', 'Selling Price', 'number', '100', '', '$')}
        </div>
        ${renderButtons(id)}
        <div id="result_${id}"></div>`;
            el.querySelector(`#calcBtn_${id}`).onclick = () => {
                const cost = +el.querySelector('#marginCost').value,
                    sell = +el.querySelector('#marginSell').value;
                const profit = sell - cost;
                const margin = profit / sell * 100;
                const markup = profit / cost * 100;
                el.querySelector(`#result_${id}`).innerHTML = resultCard([
                    ['Gross Profit', fmtCurrency(profit)],
                    ['Gross Margin', fmtPct(margin)],
                    ['Markup', fmtPct(markup)]
                ]);
                if (window.uwuHistory) uwuHistory.add(id, {
                    Cost: fmtCurrency(cost),
                    Sell: fmtCurrency(sell)
                }, fmtPct(margin) + ' margin');
            };
            el.querySelector(`#resetBtn_${id}`).onclick = () => {
                el.querySelectorAll('input').forEach(i => i.value = '');
                el.querySelector(`#result_${id}`).innerHTML = '';
            };
        },

        // --- COMMISSION ---
        'commission': (el, id) => {
            el.innerHTML = `
        <div class="form-row">
          ${formGroup('commSales', 'Sales Amount', 'number', '10000', '', '$')}
          ${formGroup('commRate', 'Commission Rate', 'number', '10', '', '', '%')}
        </div>
        ${renderButtons(id)}
        <div id="result_${id}"></div>`;
            el.querySelector(`#calcBtn_${id}`).onclick = () => {
                const s = +el.querySelector('#commSales').value,
                    r = +el.querySelector('#commRate').value / 100;
                el.querySelector(`#result_${id}`).innerHTML = resultCard([
                    ['Commission Earned', fmtCurrency(s * r)]
                ]);
                if (window.uwuHistory) uwuHistory.add(id, {
                    Sales: fmtCurrency(s),
                    Rate: el.querySelector('#commRate').value + '%'
                }, fmtCurrency(s * r));
            };
            el.querySelector(`#resetBtn_${id}`).onclick = () => {
                el.querySelectorAll('input').forEach(i => i.value = '');
                el.querySelector(`#result_${id}`).innerHTML = '';
            };
        },

        // --- SALARY ---
        'salary': (el, id) => {
            el.innerHTML = `
        ${formGroup('salaryAmount', 'Salary Amount', 'number', '60000', '', '$')}
        ${selectGroup('salaryFrom', 'Current Frequency', [{v:'annual',l:'Annual'},{v:'monthly',l:'Monthly'},{v:'weekly',l:'Weekly'},{v:'hourly',l:'Hourly'}])}
        ${renderButtons(id)}
        <div id="result_${id}"></div>`;
            el.querySelector(`#calcBtn_${id}`).onclick = () => {
                const a = +el.querySelector('#salaryAmount').value,
                    f = el.querySelector('#salaryFrom').value;
                let annual;
                if (f === 'annual') annual = a;
                else if (f === 'monthly') annual = a * 12;
                else if (f === 'weekly') annual = a * 52;
                else annual = a * 2080;
                el.querySelector(`#result_${id}`).innerHTML = resultCard([
                    ['Annual', fmtCurrency(annual)],
                    ['Monthly', fmtCurrency(annual / 12)],
                    ['Bi-weekly', fmtCurrency(annual / 26)],
                    ['Weekly', fmtCurrency(annual / 52)],
                    ['Daily (5-day week)', fmtCurrency(annual / 260)],
                    ['Hourly (40hr week)', fmtCurrency(annual / 2080)],
                ]);
                if (window.uwuHistory) uwuHistory.add(id, {
                    Amount: fmtCurrency(a),
                    From: f
                }, 'Annual: ' + fmtCurrency(annual));
            };
            el.querySelector(`#resetBtn_${id}`).onclick = () => {
                el.querySelectorAll('input').forEach(i => i.value = '');
                el.querySelector(`#result_${id}`).innerHTML = '';
            };
        },

        // --- TIP ---
        // (tip is in other engine but some financial pages redirect here)

        // --- FUTURE VALUE ---
        'future-value': (el, id) => {
            el.innerHTML = `
        <div class="form-row">
          ${formGroup('fvPV', 'Present Value', 'number', '1000', '', '$')}
          ${formGroup('fvRate', 'Annual Interest Rate', 'number', '7', '', '', '%')}
        </div>
        <div class="form-row">
          ${formGroup('fvN', 'Number of Years', 'number', '10', '')}
          ${formGroup('fvPMT', 'Annual Payment', 'number', '0', '0', '$')}
        </div>
        ${renderButtons(id)}
        <div id="result_${id}"></div>`;
            el.querySelector(`#calcBtn_${id}`).onclick = () => {
                const pv = +el.querySelector('#fvPV').value,
                    r = +el.querySelector('#fvRate').value / 100;
                const n = +el.querySelector('#fvN').value,
                    pmt = +el.querySelector('#fvPMT').value;
                const fv = pv * Math.pow(1 + r, n) + (r === 0 ? pmt * n : pmt * (Math.pow(1 + r, n) - 1) / r);
                el.querySelector(`#result_${id}`).innerHTML = resultCard([
                    ['Future Value', fmtCurrency(fv)]
                ]);
                if (window.uwuHistory) uwuHistory.add(id, {
                    PV: fmtCurrency(pv),
                    Rate: el.querySelector('#fvRate').value + '%',
                    Years: n
                }, fmtCurrency(fv));
            };
            el.querySelector(`#resetBtn_${id}`).onclick = () => {
                el.querySelectorAll('input').forEach(i => i.value = '');
                el.querySelector(`#result_${id}`).innerHTML = '';
            };
        },

        // --- PRESENT VALUE ---
        'present-value': (el, id) => {
            el.innerHTML = `
        <div class="form-row">
          ${formGroup('pvFV', 'Future Value', 'number', '2000', '', '$')}
          ${formGroup('pvRate', 'Annual Discount Rate', 'number', '7', '', '', '%')}
        </div>
        ${formGroup('pvN', 'Number of Years', 'number', '10', '')}
        ${renderButtons(id)}
        <div id="result_${id}"></div>`;
            el.querySelector(`#calcBtn_${id}`).onclick = () => {
                const fv = +el.querySelector('#pvFV').value,
                    r = +el.querySelector('#pvRate').value / 100,
                    n = +el.querySelector('#pvN').value;
                const pv = fv / Math.pow(1 + r, n);
                el.querySelector(`#result_${id}`).innerHTML = resultCard([
                    ['Present Value', fmtCurrency(pv)]
                ]);
                if (window.uwuHistory) uwuHistory.add(id, {
                    FV: fmtCurrency(fv),
                    Rate: el.querySelector('#pvRate').value + '%',
                    Years: n
                }, fmtCurrency(pv));
            };
            el.querySelector(`#resetBtn_${id}`).onclick = () => {
                el.querySelectorAll('input').forEach(i => i.value = '');
                el.querySelector(`#result_${id}`).innerHTML = '';
            };
        },

        // --- INVESTMENT ---
        'investment': (el, id) => {
            CALCS['future-value'](el, id);
        },

        // --- DEBT TO INCOME ---
        'debt-to-income': (el, id) => {
            el.innerHTML = `
        ${formGroup('dtiMonthlyDebt', 'Total Monthly Debt Payments', 'number', '1500', '', '$')}
        ${formGroup('dtiMonthlyIncome', 'Gross Monthly Income', 'number', '5000', '', '$')}
        ${renderButtons(id)}
        <div id="result_${id}"></div>`;
            el.querySelector(`#calcBtn_${id}`).onclick = () => {
                const debt = +el.querySelector('#dtiMonthlyDebt').value,
                    income = +el.querySelector('#dtiMonthlyIncome').value;
                const dti = debt / income * 100;
                const status = dti < 36 ? 'Good (below 36%)' : dti < 43 ? 'Acceptable (36-43%)' : 'High (above 43%)';
                el.querySelector(`#result_${id}`).innerHTML = resultCard([
                    ['DTI Ratio', fmtPct(dti)],
                    ['Status', status]
                ]);
                if (window.uwuHistory) uwuHistory.add(id, {
                    Debt: fmtCurrency(debt),
                    Income: fmtCurrency(income)
                }, fmtPct(dti));
            };
            el.querySelector(`#resetBtn_${id}`).onclick = () => {
                el.querySelectorAll('input').forEach(i => i.value = '');
                el.querySelector(`#result_${id}`).innerHTML = '';
            };
        },

        // --- AUTO LOAN ---
        'auto-loan': (el, id) => {
            el.innerHTML = `
        <div class="form-row">
          ${formGroup('alPrice', 'Vehicle Price', 'number', '25000', '', '$')}
          ${formGroup('alDown', 'Down Payment', 'number', '5000', '', '$')}
        </div>
        <div class="form-row">
          ${formGroup('alRate', 'Annual Interest Rate', 'number', '5.5', '', '', '%')}
          ${formGroup('alTerm', 'Loan Term', 'number', '60', '', '', 'months')}
        </div>
        ${renderButtons(id)}
        <div id="result_${id}"></div>`;
            el.querySelector(`#calcBtn_${id}`).onclick = () => {
                const price = +el.querySelector('#alPrice').value,
                    down = +el.querySelector('#alDown').value;
                const rate = +el.querySelector('#alRate').value / 100 / 12,
                    n = +el.querySelector('#alTerm').value;
                const principal = price - down;
                const monthly = rate === 0 ? principal / n : principal * rate * Math.pow(1 + rate, n) / (Math.pow(1 + rate, n) - 1);
                el.querySelector(`#result_${id}`).innerHTML = resultCard([
                    ['Monthly Payment', fmtCurrency(monthly)],
                    ['Total Payments', fmtCurrency(monthly * n)],
                    ['Total Interest', fmtCurrency(monthly * n - principal)]
                ]);
                if (window.uwuHistory) uwuHistory.add(id, {
                    Price: fmtCurrency(price),
                    Down: fmtCurrency(down),
                    Rate: el.querySelector('#alRate').value + '%'
                }, fmtCurrency(monthly) + '/mo');
            };
            el.querySelector(`#resetBtn_${id}`).onclick = () => {
                el.querySelectorAll('input').forEach(i => i.value = '');
                el.querySelector(`#result_${id}`).innerHTML = '';
            };
        },

        // --- CD ---
        'cd': (el, id) => {
            el.innerHTML = `
        <div class="form-row">
          ${formGroup('cdAmt', 'Initial Deposit', 'number', '5000', '', '$')}
          ${formGroup('cdRate', 'Annual Interest Rate (APY)', 'number', '5', '', '', '%')}
        </div>
        ${formGroup('cdTerm', 'Term', 'number', '12', '', '', 'months')}
        ${renderButtons(id)}
        <div id="result_${id}"></div>`;
            el.querySelector(`#calcBtn_${id}`).onclick = () => {
                const p = +el.querySelector('#cdAmt').value,
                    r = +el.querySelector('#cdRate').value / 100,
                    t = +el.querySelector('#cdTerm').value / 12;
                const total = p * Math.pow(1 + r, t);
                el.querySelector(`#result_${id}`).innerHTML = resultCard([
                    ['Interest Earned', fmtCurrency(total - p)],
                    ['Total at Maturity', fmtCurrency(total)]
                ]);
                if (window.uwuHistory) uwuHistory.add(id, {
                    Deposit: fmtCurrency(p),
                    Rate: el.querySelector('#cdRate').value + '%',
                    Term: el.querySelector('#cdTerm').value + 'mo'
                }, fmtCurrency(total));
            };
            el.querySelector(`#resetBtn_${id}`).onclick = () => {
                el.querySelectorAll('input').forEach(i => i.value = '');
                el.querySelector(`#result_${id}`).innerHTML = '';
            };
        },

    };

    // FALLBACK for unimplemented financial calcs
    function genericLoanCalc(el, id) {
        el.innerHTML = `
      <div class="form-row">
        ${formGroup('genAmt', 'Principal Amount', 'number', '10000', '', '$')}
        ${formGroup('genRate', 'Annual Interest Rate', 'number', '5', '', '', '%')}
      </div>
      ${formGroup('genYears', 'Term', 'number', '5', '', '', 'years')}
      ${renderButtons(id)}
      <div id="result_${id}"></div>`;
        el.querySelector(`#calcBtn_${id}`).onclick = () => {
            const p = +el.querySelector('#genAmt').value,
                r = +el.querySelector('#genRate').value / 100 / 12,
                n = +el.querySelector('#genYears').value * 12;
            const monthly = r === 0 ? p / n : p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
            el.querySelector(`#result_${id}`).innerHTML = resultCard([
                ['Monthly Payment', fmtCurrency(monthly)],
                ['Total Payment', fmtCurrency(monthly * n)],
                ['Total Interest', fmtCurrency(monthly * n - p)]
            ]);
            if (window.uwuHistory) uwuHistory.add(id, {
                Amount: fmtCurrency(p),
                Rate: el.querySelector('#genRate').value + '%',
                Term: el.querySelector('#genYears').value + 'yr'
            }, fmtCurrency(monthly) + '/mo');
        };
        el.querySelector(`#resetBtn_${id}`).onclick = () => {
            el.querySelectorAll('input').forEach(i => i.value = '');
            el.querySelector(`#result_${id}`).innerHTML = '';
        };
    }

    // Aliases for calcs that share the same logic
    const ALIASES = {
        'payment': 'loan',
        'repayment': 'loan',
        'personal-loan': 'loan',
        'student-loan': 'loan',
        'boat-loan': 'auto-loan',
        'business-loan': 'loan',
        'mortgage-uk': 'mortgage',
        'canadian-mortgage': 'mortgage',
        'mortgage-amortization': 'mortgage',
        'fha-loan': 'mortgage',
        'va-mortgage': 'mortgage',
        'home-equity-loan': 'loan',
        'heloc': 'loan',
        'lease': 'auto-loan',
        'auto-lease': 'auto-loan',
        'refinance': 'mortgage',
        'retirement': 'savings',
        '401k': 'savings',
        'roth-ira': 'savings',
        'ira': 'savings',
        'mutual-fund': 'savings',
        'annuity': 'savings',
        'annuity-payout': 'savings',
        'amortization': 'mortgage',
        'real-estate': 'roi',
        'rental-property': 'roi',
        'house-affordability': 'mortgage',
        'down-payment': 'mortgage',
        'rent-vs-buy': 'mortgage',
        'average-return': 'roi',
        'irr': 'roi',
        'credit-card': 'loan',
        'credit-card-payoff': 'loan',
        'debt-payoff': 'loan',
        'debt-consolidation': 'loan',
        'college-cost': 'savings',
        'income-tax': 'salary',
        'take-home-paycheck': 'salary',
        'interest': 'compound-interest',
        'interest-rate': 'simple-interest',
        'finance': 'future-value',
        'bond': 'savings',
        'rmd': 'savings',
        'payback-period': 'roi',
        'apr': 'loan',
        'mortgage-payoff': 'mortgage',
        'rent': 'salary',
        'marriage-tax': 'salary',
        'estate-tax': 'salary',
        'pension': 'savings',
        'social-security': 'savings',
        'cash-back': 'roi',
        'depreciation': 'savings',
        'budget': 'salary',
        'currency': 'vat',
    };

    window.uwuEngineFinancial = {
        render(calc, container) {
            const id = calc.id;
            let renderer = CALCS[id];
            if (!renderer && ALIASES[id]) renderer = CALCS[ALIASES[id]];
            if (!renderer) renderer = genericLoanCalc;
            renderer(container, id);
        }
    };
})();