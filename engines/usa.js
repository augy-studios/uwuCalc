// engines/usa.js - US-Centric Calculators Engine
// Calculators specific to US tax law, government programs, and military standards

window.uwuEngineUSA = (() => {

    function field(id, label, type = 'number', placeholder = '', value = '') {
        return `<div class="calc-field"><label for="${id}">${label}</label><input type="${type}" id="${id}" placeholder="${placeholder}" value="${value}" autocomplete="off"></div>`;
    }

    function select(id, label, options) {
        return `<div class="calc-field"><label for="${id}">${label}</label><select id="${id}">${options.map(o=>`<option value="${o.v}">${o.l}</option>`).join('')}</select></div>`;
    }

    function result(html) {
        return `<div class="calc-result">${html}</div>`;
    }

    function row(label, value) {
        return `<div class="result-row"><span class="result-label">${label}</span><span class="result-value">${value}</span></div>`;
    }

    function err(msg) {
        return `<div class="calc-error">${msg}</div>`;
    }

    function btn(label = 'Calculate') {
        return `<div class="calc-actions"><button class="btn-calc" onclick="window._calcRun()">${label}</button><button class="btn-reset" onclick="window._calcReset()">Reset</button></div>`;
    }

    function fmt(n, dec = 2) {
        return isNaN(n) ? '-' : Number(n).toFixed(dec).replace(/\.?0+$/, '');
    }

    function fmtUSD(n) {
        return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // ── Income Tax ───────────────────────────────────────────────────────────
    function renderIncomeTax(container) {
        const brackets2024 = {
            single: [
                [11600, 0.10], [47150, 0.12], [100525, 0.22], [191950, 0.24],
                [243725, 0.32], [609350, 0.35], [Infinity, 0.37]
            ],
            married: [
                [23200, 0.10], [94300, 0.12], [201050, 0.22], [383900, 0.24],
                [487450, 0.32], [731200, 0.35], [Infinity, 0.37]
            ]
        };
        container.innerHTML = `
      ${field('itax-income','Annual Gross Income ($)','number','75000')}
      ${select('itax-status','Filing Status',[{v:'single',l:'Single'},{v:'married',l:'Married Filing Jointly'}])}
      ${field('itax-deduction','Deduction ($)','number','14600')}
      ${btn()}<div id="itax-result"></div>`;
        window._calcRun = () => {
            const gross = +document.getElementById('itax-income').value;
            const status = document.getElementById('itax-status').value;
            const deduction = +document.getElementById('itax-deduction').value;
            const taxable = Math.max(0, gross - deduction);
            const schedule = brackets2024[status];
            let tax = 0, prev = 0;
            for (const [cap, rate] of schedule) {
                if (taxable <= cap) { tax += (taxable - prev) * rate; break; }
                tax += (cap - prev) * rate;
                prev = cap;
            }
            const fica = gross * 0.0765;
            const effective = gross > 0 ? (tax / gross) * 100 : 0;
            const marginal = schedule.find(([cap]) => taxable <= cap)?.[1] * 100 || 37;
            document.getElementById('itax-result').innerHTML = result(
                row('Taxable income', fmtUSD(taxable)) +
                row('Federal income tax', fmtUSD(tax)) +
                row('FICA (Social Security + Medicare)', fmtUSD(fica)) +
                row('Total federal burden', fmtUSD(tax + fica)) +
                row('Effective tax rate', fmt(effective, 2) + '%') +
                row('Marginal tax rate', fmt(marginal) + '%') +
                row('After-tax income', fmtUSD(gross - tax - fica))
            );
            uwuHistory.add('income-tax-calculator', { tax: fmtUSD(tax) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('itax-result').innerHTML = ''; };
    }

    // ── 401K ──────────────────────────────────────────────────────────────────
    function render401K(container) {
        container.innerHTML = `
      ${field('k401-salary','Annual Salary ($)','number','75000')}
      ${field('k401-contrib','Your Contribution (%)','number','10')}
      ${field('k401-match','Employer Match (%)','number','50')}
      ${field('k401-matchcap','Employer Match Cap (% of salary)','number','6')}
      ${field('k401-balance','Current Balance ($)','number','25000')}
      ${field('k401-years','Years to Retirement','number','30')}
      ${field('k401-return','Expected Annual Return (%)','number','7')}
      ${btn()}<div id="k401-result"></div>`;
        window._calcRun = () => {
            const salary = +document.getElementById('k401-salary').value;
            const contribPct = +document.getElementById('k401-contrib').value / 100;
            const matchPct = +document.getElementById('k401-match').value / 100;
            const matchCap = +document.getElementById('k401-matchcap').value / 100;
            const balance = +document.getElementById('k401-balance').value;
            const years = +document.getElementById('k401-years').value;
            const rate = +document.getElementById('k401-return').value / 100;
            const annualContrib = salary * contribPct;
            const matchableAmt = Math.min(salary * contribPct, salary * matchCap);
            const annualMatch = matchableAmt * matchPct;
            const annualLimit = 23000;
            const actualContrib = Math.min(annualContrib, annualLimit);
            const totalAnnual = actualContrib + annualMatch;
            let fv = balance;
            for (let i = 0; i < years; i++) fv = fv * (1 + rate) + totalAnnual;
            const totalContribs = actualContrib * years + balance;
            const totalMatchContribs = annualMatch * years;
            document.getElementById('k401-result').innerHTML = result(
                row('Your annual contribution', fmtUSD(actualContrib)) +
                row('Annual employer match', fmtUSD(annualMatch)) +
                row('Total annual additions', fmtUSD(totalAnnual)) +
                row('Projected balance at retirement', fmtUSD(fv)) +
                row('Your total contributions', fmtUSD(totalContribs)) +
                row('Total employer contributions', fmtUSD(totalMatchContribs)) +
                row('Total investment growth', fmtUSD(fv - totalContribs - totalMatchContribs)) +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">2024 contribution limit: $23,000 ($30,500 if age 50+)</p>`
            );
            uwuHistory.add('401k-calculator', { balance: fmtUSD(fv) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('k401-result').innerHTML = ''; };
    }

    // ── Roth IRA ──────────────────────────────────────────────────────────────
    function renderRothIRA(container) {
        container.innerHTML = `
      ${field('roth-balance','Current Balance ($)','number','10000')}
      ${field('roth-annual','Annual Contribution ($)','number','7000')}
      ${field('roth-years','Years to Retirement','number','30')}
      ${field('roth-return','Expected Annual Return (%)','number','7')}
      ${btn()}<div id="roth-result"></div>`;
        window._calcRun = () => {
            const balance = +document.getElementById('roth-balance').value;
            const annual = +document.getElementById('roth-annual').value;
            const years = +document.getElementById('roth-years').value;
            const rate = +document.getElementById('roth-return').value / 100;
            const limit = 7000;
            const actualContrib = Math.min(annual, limit);
            let fv = balance;
            for (let i = 0; i < years; i++) fv = fv * (1 + rate) + actualContrib;
            const totalContrib = actualContrib * years + balance;
            document.getElementById('roth-result').innerHTML = result(
                row('Annual contribution', fmtUSD(actualContrib)) +
                row('Projected balance', fmtUSD(fv)) +
                row('Total contributions', fmtUSD(totalContrib)) +
                row('Tax-free growth', fmtUSD(fv - totalContrib)) +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">2024 limit: $7,000 ($8,000 if age 50+). Withdrawals in retirement are tax-free.</p>`
            );
            uwuHistory.add('roth-ira-calculator', { balance: fmtUSD(fv) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('roth-result').innerHTML = ''; };
    }

    // ── Traditional IRA ───────────────────────────────────────────────────────
    function renderIRA(container) {
        container.innerHTML = `
      ${field('ira-balance','Current Balance ($)','number','15000')}
      ${field('ira-annual','Annual Contribution ($)','number','7000')}
      ${field('ira-years','Years to Retirement','number','25')}
      ${field('ira-return','Expected Annual Return (%)','number','7')}
      ${field('ira-taxnow','Current Marginal Tax Rate (%)','number','22')}
      ${field('ira-taxret','Expected Retirement Tax Rate (%)','number','15')}
      ${btn()}<div id="ira-result"></div>`;
        window._calcRun = () => {
            const balance = +document.getElementById('ira-balance').value;
            const annual = Math.min(+document.getElementById('ira-annual').value, 7000);
            const years = +document.getElementById('ira-years').value;
            const rate = +document.getElementById('ira-return').value / 100;
            const taxNow = +document.getElementById('ira-taxnow').value / 100;
            const taxRet = +document.getElementById('ira-taxret').value / 100;
            let fv = balance;
            for (let i = 0; i < years; i++) fv = fv * (1 + rate) + annual;
            const totalContrib = annual * years + balance;
            const taxSavingsNow = annual * taxNow * years;
            const afterTaxValue = fv * (1 - taxRet);
            document.getElementById('ira-result').innerHTML = result(
                row('Projected pre-tax balance', fmtUSD(fv)) +
                row('After-tax value at retirement', fmtUSD(afterTaxValue)) +
                row('Total contributions', fmtUSD(totalContrib)) +
                row('Tax-deferred growth', fmtUSD(fv - totalContrib)) +
                row('Tax savings from deductions', fmtUSD(taxSavingsNow)) +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">2024 limit: $7,000 ($8,000 if age 50+). Contributions may be tax-deductible; withdrawals taxed as income.</p>`
            );
            uwuHistory.add('ira-calculator', { balance: fmtUSD(fv) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('ira-result').innerHTML = ''; };
    }

    // ── RMD ───────────────────────────────────────────────────────────────────
    function renderRMD(container) {
        const lifetimeTable = {
            72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0,
            79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0,
            86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8,
            93: 10.1, 94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8,
            100: 6.4, 101: 6.0, 102: 5.6, 103: 5.2, 104: 4.9, 105: 4.6
        };
        container.innerHTML = `
      ${field('rmd-balance','Account Balance ($)','number','500000')}
      ${field('rmd-age','Your Age','number','73')}
      ${btn()}<div id="rmd-result"></div>`;
        window._calcRun = () => {
            const balance = +document.getElementById('rmd-balance').value;
            const age = Math.round(+document.getElementById('rmd-age').value);
            if (age < 72) {
                document.getElementById('rmd-result').innerHTML = err('RMDs generally begin at age 73 (72 if you turned 72 before 2023). No RMD required yet.');
                return;
            }
            const divisor = lifetimeTable[Math.min(age, 105)] || 4.6;
            const rmd = balance / divisor;
            const monthly = rmd / 12;
            document.getElementById('rmd-result').innerHTML = result(
                row('Annual RMD', fmtUSD(rmd)) +
                row('Monthly equivalent', fmtUSD(monthly)) +
                row('Distribution period (divisor)', fmt(divisor, 1)) +
                row('Account balance', fmtUSD(balance)) +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">Based on IRS Uniform Lifetime Table. Penalty for missing RMD: 25% of amount not withdrawn.</p>`
            );
            uwuHistory.add('rmd-calculator', { rmd: fmtUSD(rmd) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('rmd-result').innerHTML = ''; };
    }

    // ── Sales Tax ─────────────────────────────────────────────────────────────
    function renderSalesTax(container) {
        container.innerHTML = `
      ${field('stax-price','Price Before Tax ($)','number','100')}
      ${field('stax-rate','Tax Rate (%)','number','8.25')}
      ${select('stax-mode','Mode',[{v:'add',l:'Add tax to price'},{v:'reverse',l:'Extract tax from total'}])}
      ${btn()}<div id="stax-result"></div>`;
        window._calcRun = () => {
            const price = +document.getElementById('stax-price').value;
            const rate = +document.getElementById('stax-rate').value / 100;
            const mode = document.getElementById('stax-mode').value;
            if (mode === 'add') {
                const tax = price * rate;
                document.getElementById('stax-result').innerHTML = result(
                    row('Tax amount', fmtUSD(tax)) +
                    row('Total price', fmtUSD(price + tax)) +
                    row('Tax rate', fmt(rate * 100, 2) + '%')
                );
            } else {
                const net = price / (1 + rate);
                const tax = price - net;
                document.getElementById('stax-result').innerHTML = result(
                    row('Pre-tax price', fmtUSD(net)) +
                    row('Tax amount', fmtUSD(tax)) +
                    row('Total (entered)', fmtUSD(price))
                );
            }
            uwuHistory.add('sales-tax-calculator', { rate: fmt(rate * 100, 2) + '%' });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('stax-result').innerHTML = ''; };
    }

    // ── Marriage Tax ──────────────────────────────────────────────────────────
    function renderMarriageTax(container) {
        const brackets = {
            single: [
                [11600, 0.10], [47150, 0.12], [100525, 0.22], [191950, 0.24],
                [243725, 0.32], [609350, 0.35], [Infinity, 0.37]
            ],
            married: [
                [23200, 0.10], [94300, 0.12], [201050, 0.22], [383900, 0.24],
                [487450, 0.32], [731200, 0.35], [Infinity, 0.37]
            ]
        };
        function calcTax(income, schedule) {
            let tax = 0, prev = 0;
            for (const [cap, rate] of schedule) {
                if (income <= cap) { tax += (income - prev) * rate; break; }
                tax += (cap - prev) * rate;
                prev = cap;
            }
            return tax;
        }
        container.innerHTML = `
      ${field('mtax-inc1','Spouse 1 Income ($)','number','75000')}
      ${field('mtax-inc2','Spouse 2 Income ($)','number','65000')}
      ${btn('Compare')}<div id="mtax-result"></div>`;
        window._calcRun = () => {
            const inc1 = +document.getElementById('mtax-inc1').value;
            const inc2 = +document.getElementById('mtax-inc2').value;
            const ded_single = 14600, ded_married = 29200;
            const taxSingle1 = calcTax(Math.max(0, inc1 - ded_single), brackets.single);
            const taxSingle2 = calcTax(Math.max(0, inc2 - ded_single), brackets.single);
            const totalSingle = taxSingle1 + taxSingle2;
            const taxMarried = calcTax(Math.max(0, inc1 + inc2 - ded_married), brackets.married);
            const diff = taxMarried - totalSingle;
            document.getElementById('mtax-result').innerHTML = result(
                row('Filing separately (as singles)', fmtUSD(totalSingle)) +
                row('Filing jointly (married)', fmtUSD(taxMarried)) +
                row(diff > 0 ? 'Marriage penalty' : 'Marriage bonus', fmtUSD(Math.abs(diff))) +
                row('Impact', diff > 0 ? 'You pay MORE married' : 'You pay LESS married') +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">Based on 2024 federal tax brackets and standard deductions.</p>`
            );
            uwuHistory.add('marriage-tax-calculator', { diff: fmtUSD(diff) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('mtax-result').innerHTML = ''; };
    }

    // ── Estate Tax ────────────────────────────────────────────────────────────
    function renderEstateTax(container) {
        container.innerHTML = `
      ${field('etax-estate','Total Estate Value ($)','number','15000000')}
      ${field('etax-exempt','Exemption Amount ($)','number','13610000')}
      ${select('etax-married','Portability (deceased spouse unused exemption)?',[{v:'no',l:'No / Not married'},{v:'yes',l:'Yes – use deceased spouse\'s exemption'}])}
      ${btn()}<div id="etax-result"></div>`;
        window._calcRun = () => {
            const estate = +document.getElementById('etax-estate').value;
            let exemption = +document.getElementById('etax-exempt').value;
            if (document.getElementById('etax-married').value === 'yes') exemption *= 2;
            const taxable = Math.max(0, estate - exemption);
            const tax = taxable * 0.40;
            document.getElementById('etax-result').innerHTML = result(
                row('Gross estate', fmtUSD(estate)) +
                row('Exemption applied', fmtUSD(exemption)) +
                row('Taxable estate', fmtUSD(taxable)) +
                row('Estimated estate tax (40%)', fmtUSD(tax)) +
                row('Net to heirs', fmtUSD(estate - tax)) +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">2024 federal exemption: $13.61M per person. Top rate: 40%.</p>`
            );
            uwuHistory.add('estate-tax-calculator', { tax: fmtUSD(tax) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('etax-result').innerHTML = ''; };
    }

    // ── Social Security ───────────────────────────────────────────────────────
    function renderSocialSecurity(container) {
        container.innerHTML = `
      ${field('ss-earnings','Average Annual Earnings (top 35 years, $)','number','60000')}
      ${select('ss-age','Claiming Age',[{v:'62',l:'62 (early – reduced)'},{v:'67',l:'67 (full retirement age)'},{v:'70',l:'70 (delayed – maximum)'}])}
      ${btn('Estimate')}<div id="ss-result"></div>`;
        window._calcRun = () => {
            const earnings = +document.getElementById('ss-earnings').value;
            const claimAge = +document.getElementById('ss-age').value;
            const aime = earnings / 12;
            // 2024 PIA bend points
            let pia = 0;
            if (aime <= 1174) pia = aime * 0.9;
            else if (aime <= 7078) pia = 1174 * 0.9 + (aime - 1174) * 0.32;
            else pia = 1174 * 0.9 + (7078 - 1174) * 0.32 + (aime - 7078) * 0.15;
            let factor = 1.0;
            if (claimAge === 62) factor = 0.70;
            else if (claimAge === 70) factor = 1.24;
            const monthly = pia * factor;
            const annual = monthly * 12;
            document.getElementById('ss-result').innerHTML = result(
                row('Average Indexed Monthly Earnings', fmtUSD(aime)) +
                row('Primary Insurance Amount (PIA)', fmtUSD(pia) + '/mo') +
                row('Adjustment factor (age ' + claimAge + ')', fmt(factor * 100) + '%') +
                row('Estimated monthly benefit', fmtUSD(monthly)) +
                row('Estimated annual benefit', fmtUSD(annual)) +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">Estimate only. Actual benefits depend on your complete earnings history. Based on 2024 bend points.</p>`
            );
            uwuHistory.add('social-security-calculator', { monthly: fmtUSD(monthly) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('ss-result').innerHTML = ''; };
    }

    // ── Take-Home Paycheck ────────────────────────────────────────────────────
    function renderTakeHomePaycheck(container) {
        container.innerHTML = `
      ${field('thp-gross','Annual Gross Salary ($)','number','75000')}
      ${select('thp-freq','Pay Frequency',[{v:'26',l:'Bi-weekly (26)'},{v:'24',l:'Semi-monthly (24)'},{v:'12',l:'Monthly (12)'},{v:'52',l:'Weekly (52)'}])}
      ${select('thp-status','Filing Status',[{v:'single',l:'Single'},{v:'married',l:'Married Filing Jointly'}])}
      ${field('thp-state','State Tax Rate (%)','number','5')}
      ${field('thp-pre401k','Pre-tax 401(k) Contribution (%)','number','6')}
      ${btn()}<div id="thp-result"></div>`;
        const brackets = {
            single: [[11600,0.10],[47150,0.12],[100525,0.22],[191950,0.24],[243725,0.32],[609350,0.35],[Infinity,0.37]],
            married: [[23200,0.10],[94300,0.12],[201050,0.22],[383900,0.24],[487450,0.32],[731200,0.35],[Infinity,0.37]]
        };
        window._calcRun = () => {
            const gross = +document.getElementById('thp-gross').value;
            const freq = +document.getElementById('thp-freq').value;
            const status = document.getElementById('thp-status').value;
            const stateRate = +document.getElementById('thp-state').value / 100;
            const k401 = +document.getElementById('thp-pre401k').value / 100;
            const k401Amount = gross * k401;
            const deduction = status === 'single' ? 14600 : 29200;
            const taxableIncome = Math.max(0, gross - k401Amount - deduction);
            let fedTax = 0, prev = 0;
            for (const [cap, rate] of brackets[status]) {
                if (taxableIncome <= cap) { fedTax += (taxableIncome - prev) * rate; break; }
                fedTax += (cap - prev) * rate;
                prev = cap;
            }
            const ss = Math.min(gross, 168600) * 0.062;
            const medicare = gross * 0.0145 + (gross > 200000 ? (gross - 200000) * 0.009 : 0);
            const stateTax = gross * stateRate;
            const totalDeductions = fedTax + ss + medicare + stateTax + k401Amount;
            const netAnnual = gross - totalDeductions;
            const netPer = netAnnual / freq;
            document.getElementById('thp-result').innerHTML = result(
                row('Gross per paycheck', fmtUSD(gross / freq)) +
                row('Federal income tax', fmtUSD(fedTax / freq)) +
                row('Social Security (6.2%)', fmtUSD(ss / freq)) +
                row('Medicare (1.45%)', fmtUSD(medicare / freq)) +
                row('State tax', fmtUSD(stateTax / freq)) +
                row('401(k) contribution', fmtUSD(k401Amount / freq)) +
                row('Net take-home per paycheck', fmtUSD(netPer)) +
                row('Annual take-home', fmtUSD(netAnnual)) +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">2024 SS wage base: $168,600. Does not include local taxes or other deductions.</p>`
            );
            uwuHistory.add('take-home-paycheck-calculator', { net: fmtUSD(netPer) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('thp-result').innerHTML = ''; };
    }

    // ── FHA Loan ──────────────────────────────────────────────────────────────
    function renderFHALoan(container) {
        container.innerHTML = `
      ${field('fha-price','Home Price ($)','number','300000')}
      ${field('fha-down','Down Payment (%)','number','3.5')}
      ${field('fha-rate','Interest Rate (%)','number','6.5')}
      ${field('fha-term','Loan Term (years)','number','30')}
      ${btn()}<div id="fha-result"></div>`;
        window._calcRun = () => {
            const price = +document.getElementById('fha-price').value;
            const downPct = +document.getElementById('fha-down').value / 100;
            const rate = +document.getElementById('fha-rate').value / 100 / 12;
            const term = +document.getElementById('fha-term').value * 12;
            const downAmt = price * downPct;
            const baseLoan = price - downAmt;
            const upfrontMIP = baseLoan * 0.0175;
            const loanWithMIP = baseLoan + upfrontMIP;
            const annualMIP = downPct < 0.10 ? 0.55 : 0.50;
            const monthlyMIP = baseLoan * (annualMIP / 100) / 12;
            const monthlyPI = loanWithMIP * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
            const totalMonthly = monthlyPI + monthlyMIP;
            document.getElementById('fha-result').innerHTML = result(
                row('Down payment', fmtUSD(downAmt)) +
                row('Base loan amount', fmtUSD(baseLoan)) +
                row('Upfront MIP (1.75%)', fmtUSD(upfrontMIP)) +
                row('Total loan (with UFMIP)', fmtUSD(loanWithMIP)) +
                row('Monthly P&I', fmtUSD(monthlyPI)) +
                row('Monthly MIP', fmtUSD(monthlyMIP)) +
                row('Total monthly payment', fmtUSD(totalMonthly)) +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">FHA minimum down: 3.5%. MIP required for loan life if down < 10%.</p>`
            );
            uwuHistory.add('fha-loan-calculator', { monthly: fmtUSD(totalMonthly) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('fha-result').innerHTML = ''; };
    }

    // ── VA Mortgage ───────────────────────────────────────────────────────────
    function renderVAMortgage(container) {
        container.innerHTML = `
      ${field('va-price','Home Price ($)','number','350000')}
      ${field('va-down','Down Payment ($)','number','0')}
      ${field('va-rate','Interest Rate (%)','number','6.25')}
      ${field('va-term','Loan Term (years)','number','30')}
      ${select('va-usage','Loan Usage',[{v:'first',l:'First use'},{v:'subsequent',l:'Subsequent use'}])}
      ${select('va-type','Service Type',[{v:'regular',l:'Regular military'},{v:'reserves',l:'Reserves/National Guard'}])}
      ${btn()}<div id="va-result"></div>`;
        window._calcRun = () => {
            const price = +document.getElementById('va-price').value;
            const down = +document.getElementById('va-down').value;
            const rate = +document.getElementById('va-rate').value / 100 / 12;
            const term = +document.getElementById('va-term').value * 12;
            const usage = document.getElementById('va-usage').value;
            const baseLoan = price - down;
            const downPct = down / price;
            let fundingFee;
            if (downPct >= 0.10) fundingFee = 0.0125;
            else if (downPct >= 0.05) fundingFee = 0.015;
            else fundingFee = usage === 'first' ? 0.0215 : 0.033;
            const fundingAmt = baseLoan * fundingFee;
            const totalLoan = baseLoan + fundingAmt;
            const monthly = totalLoan * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
            document.getElementById('va-result').innerHTML = result(
                row('Base loan amount', fmtUSD(baseLoan)) +
                row('VA Funding Fee (' + fmt(fundingFee * 100, 2) + '%)', fmtUSD(fundingAmt)) +
                row('Total loan amount', fmtUSD(totalLoan)) +
                row('Monthly payment', fmtUSD(monthly)) +
                row('Total over loan life', fmtUSD(monthly * term)) +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">VA loans: no PMI, no down payment required. Funding fee may be waived for disabled veterans.</p>`
            );
            uwuHistory.add('va-mortgage-calculator', { monthly: fmtUSD(monthly) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('va-result').innerHTML = ''; };
    }

    // ── Army Body Fat ─────────────────────────────────────────────────────────
    function renderArmyBodyFat(container) {
        container.innerHTML = `
      ${select('abf-sex','Sex',[{v:'male',l:'Male'},{v:'female',l:'Female'}])}
      ${field('abf-height','Height (cm)','number','175')}
      ${field('abf-neck','Neck (cm)','number','38')}
      ${field('abf-waist','Waist (cm)','number','85')}
      <div id="abf-hip-wrap">${field('abf-hip','Hip (cm, females only)','number','95')}</div>
      ${btn()}
      <div id="abf-result"></div>`;
        document.getElementById('abf-sex').addEventListener('change', e => {
            document.getElementById('abf-hip-wrap').style.display = e.target.value === 'female' ? '' : 'none';
        });
        document.getElementById('abf-hip-wrap').style.display = 'none';
        window._calcRun = () => {
            const sex = document.getElementById('abf-sex').value;
            const h = parseFloat(document.getElementById('abf-height').value);
            const neck = parseFloat(document.getElementById('abf-neck').value);
            const waist = parseFloat(document.getElementById('abf-waist').value);
            if (!h || !neck || !waist) {
                document.getElementById('abf-result').innerHTML = err('Enter all measurements.');
                return;
            }
            let bf;
            if (sex === 'male') {
                bf = 86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(h) + 36.76;
            } else {
                const hip = parseFloat(document.getElementById('abf-hip').value);
                bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(h) - 78.387;
            }
            const limit = sex === 'male' ? 22 : 32;
            document.getElementById('abf-result').innerHTML = result(
                row('Body Fat %', `${fmt(bf, 1)}%`) +
                row('Army Standard', `${limit}% max`) +
                row('Status', bf <= limit ? 'Passes Army standard' : 'Fails Army standard')
            );
            uwuHistory.add('army-body-fat-calculator', { bf: fmt(bf, 1) });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('abf-result').innerHTML = '';
        };
    }

    // ── Alias map ─────────────────────────────────────────────────────────────

    const ALIAS = {
        'income-tax-calculator': renderIncomeTax,
        '401k-calculator': render401K,
        'roth-ira-calculator': renderRothIRA,
        'ira-calculator': renderIRA,
        'rmd-calculator': renderRMD,
        'sales-tax-calculator': renderSalesTax,
        'marriage-tax-calculator': renderMarriageTax,
        'estate-tax-calculator': renderEstateTax,
        'social-security-calculator': renderSocialSecurity,
        'take-home-paycheck-calculator': renderTakeHomePaycheck,
        'fha-loan-calculator': renderFHALoan,
        'va-mortgage-calculator': renderVAMortgage,
        'army-body-fat-calculator': renderArmyBodyFat,
    };

    return {
        render(calc, container) {
            const fn = ALIAS[calc.slug];
            if (fn) {
                fn(container);
                return;
            }
            container.innerHTML = `<div class="calc-error">Calculator <strong>${calc.name}</strong> is not yet implemented in this engine.</div>`;
        }
    };
})();
