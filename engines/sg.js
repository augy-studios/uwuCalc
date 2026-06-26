// engines/sg.js - Singapore-Centric Calculators Engine
// Calculators specific to Singapore tax, CPF, HDB, NS, and government schemes

window.uwuEngineSG = (() => {

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

    function fmtSGD(n) {
        return 'S$' + Number(n).toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // ── SG Income Tax (IRAS YA2024) ──────────────────────────────────────────
    function renderSGIncomeTax(container) {
        const brackets = [
            [20000, 0], [30000, 0.02], [40000, 0.035], [80000, 0.07],
            [120000, 0.115], [160000, 0.15], [200000, 0.18],
            [240000, 0.19], [280000, 0.195], [320000, 0.20],
            [500000, 0.22], [1000000, 0.23], [Infinity, 0.24]
        ];
        container.innerHTML = `
      ${field('sgit-income','Annual Chargeable Income (S$)','number','80000')}
      ${select('sgit-status','Tax Residency',[{v:'resident',l:'Tax Resident'},{v:'non-resident',l:'Non-Resident (flat 15% or progressive)'}])}
      ${field('sgit-relief','Total Tax Reliefs (S$)','number','0')}
      ${btn()}<div id="sgit-result"></div>`;
        window._calcRun = () => {
            const gross = +document.getElementById('sgit-income').value;
            const status = document.getElementById('sgit-status').value;
            const relief = +document.getElementById('sgit-relief').value;
            const chargeable = Math.max(0, gross - relief);
            if (status === 'non-resident') {
                const flat = chargeable * 0.15;
                let progressive = 0, prev = 0;
                for (const [cap, rate] of brackets) {
                    if (chargeable <= cap) { progressive += (chargeable - prev) * rate; break; }
                    progressive += (cap - prev) * rate;
                    prev = cap;
                }
                const tax = Math.max(flat, progressive);
                document.getElementById('sgit-result').innerHTML = result(
                    row('Chargeable income', fmtSGD(chargeable)) +
                    row('Flat 15% method', fmtSGD(flat)) +
                    row('Progressive method', fmtSGD(progressive)) +
                    row('Tax payable (higher of two)', fmtSGD(tax)) +
                    row('Effective rate', fmt(gross > 0 ? tax / gross * 100 : 0, 2) + '%')
                );
                uwuHistory.add('sg-income-tax-calculator', { tax: fmtSGD(tax) });
                return;
            }
            let tax = 0, prev = 0;
            for (const [cap, rate] of brackets) {
                if (chargeable <= cap) { tax += (chargeable - prev) * rate; break; }
                tax += (cap - prev) * rate;
                prev = cap;
            }
            const effective = gross > 0 ? (tax / gross) * 100 : 0;
            document.getElementById('sgit-result').innerHTML = result(
                row('Chargeable income', fmtSGD(chargeable)) +
                row('Income tax payable', fmtSGD(tax)) +
                row('Effective tax rate', fmt(effective, 2) + '%') +
                row('After-tax income', fmtSGD(gross - tax)) +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">Based on IRAS YA2024 resident tax rates. No capital gains tax in Singapore.</p>`
            );
            uwuHistory.add('sg-income-tax-calculator', { tax: fmtSGD(tax) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('sgit-result').innerHTML = ''; };
    }

    // ── CPF Calculator ───────────────────────────────────────────────────────
    function renderCPF(container) {
        const rates = [
            { age: '55 and below', employee: 0.20, employer: 0.17, oa: 0.6217, sa: 0.1621, ma: 0.2162 },
            { age: '55 to 60',     employee: 0.15, employer: 0.15, oa: 0.3694, sa: 0.2716, ma: 0.3590 },
            { age: '60 to 65',     employee: 0.095, employer: 0.115, oa: 0.1492, sa: 0.3003, ma: 0.5505 },
            { age: '65 to 70',     employee: 0.075, employer: 0.09, oa: 0.0607, sa: 0.3636, ma: 0.5757 },
            { age: 'Above 70',    employee: 0.05, employer: 0.075, oa: 0.08, sa: 0.08, ma: 0.84 }
        ];
        container.innerHTML = `
      ${field('cpf-salary','Monthly Gross Salary (S$)','number','5000')}
      ${select('cpf-age','Age Group',rates.map((r,i)=>({v:String(i),l:r.age})))}
      ${field('cpf-bonus','Annual Bonus (S$)','number','0')}
      ${btn()}<div id="cpf-result"></div>`;
        window._calcRun = () => {
            const salary = +document.getElementById('cpf-salary').value;
            const ageIdx = +document.getElementById('cpf-age').value;
            const bonus = +document.getElementById('cpf-bonus').value;
            const r = rates[ageIdx];
            const owCap = 6800;
            const cappedSalary = Math.min(salary, owCap);
            const empContrib = cappedSalary * r.employee;
            const erContrib = cappedSalary * r.employer;
            const totalMonthly = empContrib + erContrib;
            const oa = totalMonthly * r.oa;
            const sa = totalMonthly * r.sa;
            const ma = totalMonthly * r.ma;
            const annualTotal = totalMonthly * 12;
            const takeHome = salary - empContrib;
            document.getElementById('cpf-result').innerHTML = result(
                row('Employee contribution (' + fmt(r.employee * 100) + '%)', fmtSGD(empContrib)) +
                row('Employer contribution (' + fmt(r.employer * 100) + '%)', fmtSGD(erContrib)) +
                row('Total monthly CPF', fmtSGD(totalMonthly)) +
                row('Ordinary Account (OA)', fmtSGD(oa)) +
                row('Special Account (SA)', fmtSGD(sa)) +
                row('MediSave Account (MA)', fmtSGD(ma)) +
                row('Annual CPF total', fmtSGD(annualTotal)) +
                row('Monthly take-home pay', fmtSGD(takeHome)) +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">2024 OW ceiling: S$6,800/month. AW ceiling: S$102,000 - total OW subject to CPF.</p>`
            );
            uwuHistory.add('cpf-calculator', { total: fmtSGD(totalMonthly) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('cpf-result').innerHTML = ''; };
    }

    // ── SRS Calculator ───────────────────────────────────────────────────────
    function renderSRS(container) {
        container.innerHTML = `
      ${field('srs-income','Annual Taxable Income (S$)','number','100000')}
      ${field('srs-contrib','Annual SRS Contribution (S$)','number','15300')}
      ${select('srs-citizen','Residency Status',[{v:'citizen',l:'SG Citizen / PR (cap S$15,300)'},{v:'foreigner',l:'Foreigner (cap S$35,700)'}])}
      ${field('srs-years','Years to Retirement (age 62)','number','20')}
      ${field('srs-return','Expected Annual Return (%)','number','4')}
      ${btn()}<div id="srs-result"></div>`;
        window._calcRun = () => {
            const income = +document.getElementById('srs-income').value;
            const citizen = document.getElementById('srs-citizen').value;
            const cap = citizen === 'citizen' ? 15300 : 35700;
            const contrib = Math.min(+document.getElementById('srs-contrib').value, cap);
            const years = +document.getElementById('srs-years').value;
            const rate = +document.getElementById('srs-return').value / 100;
            const brackets = [
                [20000, 0], [30000, 0.02], [40000, 0.035], [80000, 0.07],
                [120000, 0.115], [160000, 0.15], [200000, 0.18],
                [240000, 0.19], [280000, 0.195], [320000, 0.20],
                [500000, 0.22], [1000000, 0.23], [Infinity, 0.24]
            ];
            function calcTax(inc) {
                let tax = 0, prev = 0;
                for (const [c, r] of brackets) {
                    if (inc <= c) { tax += (inc - prev) * r; break; }
                    tax += (c - prev) * r;
                    prev = c;
                }
                return tax;
            }
            const taxWithout = calcTax(income);
            const taxWith = calcTax(Math.max(0, income - contrib));
            const taxSavings = taxWithout - taxWith;
            let fv = 0;
            for (let i = 0; i < years; i++) fv = (fv + contrib) * (1 + rate);
            const withdrawalTax = fv * 0.5 * 0.22 * 0.05;
            document.getElementById('srs-result').innerHTML = result(
                row('Annual SRS contribution', fmtSGD(contrib)) +
                row('Annual tax savings', fmtSGD(taxSavings)) +
                row('Projected SRS balance', fmtSGD(fv)) +
                row('Total contributions', fmtSGD(contrib * years)) +
                row('Investment growth', fmtSGD(fv - contrib * years)) +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">SRS withdrawals at retirement: only 50% is taxable. Penalty for early withdrawal: 5% + full tax on 100%.</p>`
            );
            uwuHistory.add('srs-calculator', { savings: fmtSGD(taxSavings) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('srs-result').innerHTML = ''; };
    }

    // ── GST Calculator ───────────────────────────────────────────────────────
    function renderGST(container) {
        container.innerHTML = `
      ${field('gst-amount','Amount (S$)','number','100')}
      ${field('gst-rate','GST Rate (%)','number','9')}
      ${select('gst-mode','Mode',[{v:'add',l:'Add GST to price (exclusive → inclusive)'},{v:'remove',l:'Extract GST from price (inclusive → exclusive)'}])}
      ${btn()}<div id="gst-result"></div>`;
        window._calcRun = () => {
            const amount = +document.getElementById('gst-amount').value;
            const rate = +document.getElementById('gst-rate').value / 100;
            const mode = document.getElementById('gst-mode').value;
            if (mode === 'add') {
                const gst = amount * rate;
                document.getElementById('gst-result').innerHTML = result(
                    row('Price before GST', fmtSGD(amount)) +
                    row('GST (' + fmt(rate * 100) + '%)', fmtSGD(gst)) +
                    row('Total price (GST-inclusive)', fmtSGD(amount + gst))
                );
            } else {
                const net = amount / (1 + rate);
                const gst = amount - net;
                document.getElementById('gst-result').innerHTML = result(
                    row('Price before GST', fmtSGD(net)) +
                    row('GST (' + fmt(rate * 100) + '%)', fmtSGD(gst)) +
                    row('Total (entered)', fmtSGD(amount))
                );
            }
            uwuHistory.add('gst-calculator', { rate: fmt(rate * 100) + '%' });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('gst-result').innerHTML = ''; };
    }

    // ── SG Take-Home Pay ─────────────────────────────────────────────────────
    function renderSGTakeHome(container) {
        const ageRates = [
            { v: '0', l: '55 and below (20% + 17%)' },
            { v: '1', l: '55 to 60 (15% + 15%)' },
            { v: '2', l: '60 to 65 (9.5% + 11.5%)' },
            { v: '3', l: '65 to 70 (7.5% + 9%)' },
            { v: '4', l: 'Above 70 (5% + 7.5%)' }
        ];
        const empRates = [0.20, 0.15, 0.095, 0.075, 0.05];
        const erRates = [0.17, 0.15, 0.115, 0.09, 0.075];
        container.innerHTML = `
      ${field('sgth-salary','Monthly Gross Salary (S$)','number','6000')}
      ${select('sgth-age','Age Group',ageRates)}
      ${field('sgth-bonus','Annual Bonus / AWS (months)','number','1')}
      ${field('sgth-srs','Monthly SRS Contribution (S$)','number','0')}
      ${btn()}<div id="sgth-result"></div>`;
        window._calcRun = () => {
            const salary = +document.getElementById('sgth-salary').value;
            const ageIdx = +document.getElementById('sgth-age').value;
            const bonusMonths = +document.getElementById('sgth-bonus').value;
            const srs = +document.getElementById('sgth-srs').value;
            const owCap = 6800;
            const cappedSalary = Math.min(salary, owCap);
            const empCPF = cappedSalary * empRates[ageIdx];
            const erCPF = cappedSalary * erRates[ageIdx];
            const monthlyTakeHome = salary - empCPF - srs;
            const annualGross = salary * 12 + salary * bonusMonths;
            const annualCPFEmp = empCPF * 12;
            const annualSRS = srs * 12;
            const annualTaxable = annualGross - annualCPFEmp - annualSRS;
            const brackets = [
                [20000, 0], [30000, 0.02], [40000, 0.035], [80000, 0.07],
                [120000, 0.115], [160000, 0.15], [200000, 0.18],
                [240000, 0.19], [280000, 0.195], [320000, 0.20],
                [500000, 0.22], [1000000, 0.23], [Infinity, 0.24]
            ];
            let tax = 0, prev = 0;
            for (const [cap, rate] of brackets) {
                if (annualTaxable <= cap) { tax += (annualTaxable - prev) * rate; break; }
                tax += (cap - prev) * rate;
                prev = cap;
            }
            const monthlyTax = tax / 12;
            const netTakeHome = monthlyTakeHome - monthlyTax;
            document.getElementById('sgth-result').innerHTML = result(
                row('Monthly gross', fmtSGD(salary)) +
                row('CPF employee (' + fmt(empRates[ageIdx] * 100) + '%)', '−' + fmtSGD(empCPF)) +
                row('CPF employer (' + fmt(erRates[ageIdx] * 100) + '%)', fmtSGD(erCPF) + ' (to CPF)') +
                (srs > 0 ? row('SRS contribution', '−' + fmtSGD(srs)) : '') +
                row('Est. monthly income tax', '−' + fmtSGD(monthlyTax)) +
                row('Monthly take-home', fmtSGD(netTakeHome)) +
                row('Annual take-home', fmtSGD(netTakeHome * 12)) +
                row('Total annual CPF (emp+er)', fmtSGD((empCPF + erCPF) * 12)) +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">2024 CPF OW ceiling: S$6,800/month. Tax estimated using IRAS YA2024 rates.</p>`
            );
            uwuHistory.add('sg-take-home-pay-calculator', { net: fmtSGD(netTakeHome) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('sgth-result').innerHTML = ''; };
    }

    // ── HDB Loan Calculator ──────────────────────────────────────────────────
    function renderHDBLoan(container) {
        container.innerHTML = `
      ${field('hdb-price','Flat Purchase Price (S$)','number','500000')}
      ${field('hdb-grant','CPF Housing Grant (S$)','number','80000')}
      ${field('hdb-cpfoa','CPF OA Used for Down Payment (S$)','number','50000')}
      ${field('hdb-cash','Cash Down Payment (S$)','number','25000')}
      ${select('hdb-type','Loan Type',[{v:'hdb',l:'HDB Concessionary Loan (2.6%)'},{v:'bank',l:'Bank Loan (est. rate)'}])}
      ${field('hdb-rate','Interest Rate (%) – for bank loan','number','3.5')}
      ${field('hdb-term','Loan Term (years)','number','25')}
      ${btn()}<div id="hdb-result"></div>`;
        window._calcRun = () => {
            const price = +document.getElementById('hdb-price').value;
            const grant = +document.getElementById('hdb-grant').value;
            const cpfOA = +document.getElementById('hdb-cpfoa').value;
            const cash = +document.getElementById('hdb-cash').value;
            const type = document.getElementById('hdb-type').value;
            const rate = type === 'hdb' ? 2.6 : +document.getElementById('hdb-rate').value;
            const term = +document.getElementById('hdb-term').value;
            const loanAmt = price - grant - cpfOA - cash;
            if (loanAmt <= 0) {
                document.getElementById('hdb-result').innerHTML = result(row('No loan needed', 'Your down payment and grants cover the full price.'));
                return;
            }
            const r = rate / 100 / 12;
            const n = term * 12;
            const monthly = loanAmt * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalPaid = monthly * n;
            const totalInterest = totalPaid - loanAmt;
            const maxLTV = type === 'hdb' ? 0.80 : 0.75;
            const ltvRatio = loanAmt / price;
            document.getElementById('hdb-result').innerHTML = result(
                row('Purchase price', fmtSGD(price)) +
                row('CPF Housing Grant', '−' + fmtSGD(grant)) +
                row('CPF OA used', '−' + fmtSGD(cpfOA)) +
                row('Cash down payment', '−' + fmtSGD(cash)) +
                row('Loan amount', fmtSGD(loanAmt)) +
                row('Interest rate', fmt(rate, 2) + '%') +
                row('Monthly repayment', fmtSGD(monthly)) +
                row('Total interest', fmtSGD(totalInterest)) +
                row('Total amount paid', fmtSGD(totalPaid)) +
                row('LTV ratio', fmt(ltvRatio * 100, 1) + '% (max ' + fmt(maxLTV * 100) + '%)') +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">HDB loan rate: CPF OA rate + 0.1% = 2.6%. Max LTV: 80% (HDB) / 75% (bank). Monthly repayment can be paid from CPF OA.</p>`
            );
            uwuHistory.add('hdb-loan-calculator', { monthly: fmtSGD(monthly) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('hdb-result').innerHTML = ''; };
    }

    // ── CPF Life Estimator ───────────────────────────────────────────────────
    function renderCPFLife(container) {
        container.innerHTML = `
      ${field('cpfl-ra','Retirement Account Balance at 55 (S$)','number','200000')}
      ${select('cpfl-plan','CPF Life Plan',[{v:'standard',l:'Standard Plan (higher monthly, lower bequest)'},{v:'basic',l:'Basic Plan (lower monthly, higher bequest)'},{v:'escalating',l:'Escalating Plan (starts lower, increases 2%/year)'}])}
      ${select('cpfl-start','Payout Start Age',[{v:'65',l:'65'},{v:'70',l:'70 (higher payout)'}])}
      ${btn('Estimate')}<div id="cpfl-result"></div>`;
        window._calcRun = () => {
            const ra = +document.getElementById('cpfl-ra').value;
            const plan = document.getElementById('cpfl-plan').value;
            const startAge = +document.getElementById('cpfl-start').value;
            const frs2024 = 205800;
            const brs2024 = 102900;
            const interestYears = startAge - 55;
            const projected = ra * Math.pow(1.04, interestYears);
            let factor;
            if (plan === 'standard') factor = startAge === 65 ? 0.0055 : 0.0072;
            else if (plan === 'basic') factor = startAge === 65 ? 0.0045 : 0.006;
            else factor = startAge === 65 ? 0.0038 : 0.005;
            const monthlyPayout = projected * factor;
            const annualPayout = monthlyPayout * 12;
            document.getElementById('cpfl-result').innerHTML = result(
                row('RA balance at 55', fmtSGD(ra)) +
                row('Projected balance at ' + startAge, fmtSGD(projected)) +
                row('Est. monthly payout (' + plan + ')', fmtSGD(monthlyPayout)) +
                row('Est. annual payout', fmtSGD(annualPayout)) +
                row('2024 Full Retirement Sum', fmtSGD(frs2024)) +
                row('2024 Basic Retirement Sum', fmtSGD(brs2024)) +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">Estimates based on ~4% RA interest. Actual payouts depend on CPF Life pool and cohort rates. Payouts are for life.</p>`
            );
            uwuHistory.add('cpf-life-calculator', { payout: fmtSGD(monthlyPayout) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('cpfl-result').innerHTML = ''; };
    }

    // ── BSD / ABSD Calculator ────────────────────────────────────────────────
    function renderBSD(container) {
        container.innerHTML = `
      ${field('bsd-price','Property Purchase Price (S$)','number','1500000')}
      ${select('bsd-buyer','Buyer Profile',[
            {v:'sc1',l:'SG Citizen – 1st property'},
            {v:'sc2',l:'SG Citizen – 2nd property'},
            {v:'sc3',l:'SG Citizen – 3rd+ property'},
            {v:'pr1',l:'SG PR – 1st property'},
            {v:'pr2',l:'SG PR – 2nd+ property'},
            {v:'foreigner',l:'Foreigner'}
        ])}
      ${btn()}<div id="bsd-result"></div>`;
        window._calcRun = () => {
            const price = +document.getElementById('bsd-price').value;
            const buyer = document.getElementById('bsd-buyer').value;
            // BSD (2023 rates)
            let bsd = 0;
            if (price <= 180000) bsd = price * 0.01;
            else if (price <= 360000) bsd = 180000 * 0.01 + (price - 180000) * 0.02;
            else if (price <= 1000000) bsd = 180000 * 0.01 + 180000 * 0.02 + (price - 360000) * 0.03;
            else if (price <= 1500000) bsd = 180000 * 0.01 + 180000 * 0.02 + 640000 * 0.03 + (price - 1000000) * 0.04;
            else if (price <= 3000000) bsd = 180000 * 0.01 + 180000 * 0.02 + 640000 * 0.03 + 500000 * 0.04 + (price - 1500000) * 0.05;
            else bsd = 180000 * 0.01 + 180000 * 0.02 + 640000 * 0.03 + 500000 * 0.04 + 1500000 * 0.05 + (price - 3000000) * 0.06;
            // ABSD rates (Apr 2023)
            const absdRates = {
                sc1: 0, sc2: 0.20, sc3: 0.30,
                pr1: 0.05, pr2: 0.30,
                foreigner: 0.60
            };
            const absd = price * (absdRates[buyer] || 0);
            const totalSD = bsd + absd;
            document.getElementById('bsd-result').innerHTML = result(
                row('Purchase price', fmtSGD(price)) +
                row('Buyer\'s Stamp Duty (BSD)', fmtSGD(bsd)) +
                row('Additional BSD (ABSD)', fmtSGD(absd) + ' (' + fmt((absdRates[buyer] || 0) * 100) + '%)') +
                row('Total stamp duty', fmtSGD(totalSD)) +
                row('% of purchase price', fmt(totalSD / price * 100, 2) + '%') +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">ABSD rates effective 27 Apr 2023. SC 1st property: no ABSD. Foreigners: 60% ABSD.</p>`
            );
            uwuHistory.add('bsd-calculator', { total: fmtSGD(totalSD) });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('bsd-result').innerHTML = ''; };
    }

    // ── IPPT Calculator ──────────────────────────────────────────────────────
    function renderIPPT(container) {
        container.innerHTML = `
      ${select('ippt-age','Age Group',[
            {v:'24',l:'≤24'},{v:'27',l:'25–27'},{v:'30',l:'28–30'},{v:'33',l:'31–33'},
            {v:'36',l:'34–36'},{v:'39',l:'37–39'},{v:'42',l:'40–42'},{v:'45',l:'43–45'},
            {v:'48',l:'46–48'},{v:'51',l:'49–51'},{v:'54',l:'52–54'},{v:'57',l:'55–57'},
            {v:'60',l:'58–60'}
        ])}
      ${field('ippt-pushup','Push-ups (reps)','number','30')}
      ${field('ippt-situp','Sit-ups (reps)','number','30')}
      ${field('ippt-run','2.4km Run (mm:ss)','text','12:00')}
      ${btn('Score')}<div id="ippt-result"></div>`;
        window._calcRun = () => {
            const pushups = +document.getElementById('ippt-pushup').value;
            const situps = +document.getElementById('ippt-situp').value;
            const runParts = document.getElementById('ippt-run').value.split(':');
            if (runParts.length !== 2) {
                document.getElementById('ippt-result').innerHTML = err('Enter run time as mm:ss (e.g. 12:30).');
                return;
            }
            const runSecs = (+runParts[0]) * 60 + (+runParts[1]);
            // Simplified scoring: each station max 25 points
            function pushupScore(reps) {
                if (reps >= 60) return 25;
                if (reps < 1) return 0;
                return Math.min(25, Math.floor(reps / 60 * 25));
            }
            function situpScore(reps) {
                if (reps >= 60) return 25;
                if (reps < 1) return 0;
                return Math.min(25, Math.floor(reps / 60 * 25));
            }
            function runScore(secs) {
                if (secs <= 510) return 50; // 8:30 or faster
                if (secs >= 1020) return 0; // 17:00 or slower
                return Math.max(0, Math.round(50 * (1 - (secs - 510) / (1020 - 510))));
            }
            const pScore = pushupScore(pushups);
            const sScore = situpScore(situps);
            const rScore = runScore(runSecs);
            const total = pScore + sScore + rScore;
            let award, incentive;
            if (total >= 85) { award = 'Gold'; incentive = '$500'; }
            else if (total >= 75) { award = 'Gold (NSman)'; incentive = '$500'; }
            else if (total >= 61) { award = 'Silver'; incentive = '$300'; }
            else if (total >= 51) { award = 'Pass with Incentive'; incentive = '$200'; }
            else if (total >= 41) { award = 'Pass'; incentive = '$0'; }
            else { award = 'Fail'; incentive = '$0'; }
            document.getElementById('ippt-result').innerHTML = result(
                row('Push-ups score', pScore + ' / 25') +
                row('Sit-ups score', sScore + ' / 25') +
                row('2.4km run score', rScore + ' / 50') +
                row('Total score', total + ' / 100') +
                row('Award', award) +
                row('NSman incentive', incentive) +
                `<p style="margin-top:8px;font-size:13px;opacity:0.7">Simplified scoring model. Actual IPPT scoring varies by age group with specific rep/timing tables from MINDEF.</p>`
            );
            uwuHistory.add('ippt-calculator', { score: total, award });
        };
        window._calcReset = () => { container.querySelectorAll('input').forEach(i => i.value = ''); document.getElementById('ippt-result').innerHTML = ''; };
    }

    // ── Alias map ─────────────────────────────────────────────────────────────

    const ALIAS = {
        'sg-income-tax-calculator': renderSGIncomeTax,
        'cpf-calculator': renderCPF,
        'srs-calculator': renderSRS,
        'gst-calculator': renderGST,
        'sg-take-home-pay-calculator': renderSGTakeHome,
        'hdb-loan-calculator': renderHDBLoan,
        'cpf-life-calculator': renderCPFLife,
        'bsd-calculator': renderBSD,
        'ippt-calculator': renderIPPT,
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
