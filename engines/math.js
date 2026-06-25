// engines/math.js - Math Calculator Engine
// Handles all 44 math calculators

window.uwuEngineMath = (() => {

    // ── Helpers ────────────────────────────────────────────────────────────────

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

    function btn() {
        return `<div class="calc-actions"><button class="btn-calc" onclick="window._calcRun()">Calculate</button><button class="btn-reset" onclick="window._calcReset()">Reset</button></div>`;
    }

    function fmt(n, dec = 4) {
        return isNaN(n) ? '-' : Number(n).toFixed(dec).replace(/\.?0+$/, '');
    }

    function gcd(a, b) {
        a = Math.abs(Math.round(a));
        b = Math.abs(Math.round(b));
        while (b) {
            [a, b] = [b, a % b];
        }
        return a;
    }

    function lcm(a, b) {
        return Math.abs(a * b) / gcd(a, b);
    }

    function factorial(n) {
        if (n <= 1) return 1;
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
    }

    // ── Scientific / Basic ────────────────────────────────────────────────────
    // (These are rendered on the home page; calc page shows a simplified version)

    function renderScientific(container) {
        container.innerHTML = `<p style="margin-bottom:12px;font-size:14px;opacity:0.8">Use the full Scientific Calculator on the <a href="/" style="color:var(--brand)">home page</a> for the best experience. Quick evaluator below:</p>
      ${field('sci-expr','Expression (e.g. sin(30)*2+log(100))','text','sqrt(144)+sin(45)*2')}
      ${btn()}
      <div id="sci-result"></div>`;

        window._calcRun = () => {
            let expr = document.getElementById('sci-expr').value.trim();
            if (!expr) {
                document.getElementById('sci-result').innerHTML = err('Enter an expression.');
                return;
            }
            try {
                expr = expr.replace(/sin\(/g, 'Math.sin(Math.PI/180*').replace(/cos\(/g, 'Math.cos(Math.PI/180*').replace(/tan\(/g, 'Math.tan(Math.PI/180*')
                    .replace(/sqrt\(/g, 'Math.sqrt(').replace(/log\(/g, 'Math.log10(').replace(/ln\(/g, 'Math.log(').replace(/abs\(/g, 'Math.abs(')
                    .replace(/pi/gi, 'Math.PI').replace(/e(?!\d)/g, 'Math.E').replace(/\^/g, '**');
                // eslint-disable-next-line no-new-func
                const res = Function('"use strict";return(' + expr + ')')();
                document.getElementById('sci-result').innerHTML = result(row('Result', fmt(res, 8)));
                uwuHistory.add('scientific-calculator', {
                    expression: document.getElementById('sci-expr').value,
                    result: fmt(res, 8)
                });
            } catch (e) {
                document.getElementById('sci-result').innerHTML = err('Invalid expression.');
            }
        };
        window._calcReset = () => {
            document.getElementById('sci-expr').value = '';
            document.getElementById('sci-result').innerHTML = '';
        };
    }

    // ── Percentage ────────────────────────────────────────────────────────────

    function renderPercentage(container) {
        container.innerHTML = `
      ${select('pct-type','Problem Type',[
        {v:'whatpct',l:'What % of X is Y?'},
        {v:'xofpct',l:'What is X% of Y?'},
        {v:'pctchange',l:'% change from X to Y'},
        {v:'addpct',l:'Add X% to Y'},
        {v:'subpct',l:'Subtract X% from Y'}
      ])}
      ${field('pct-a','Value A','number','25')}
      ${field('pct-b','Value B','number','200')}
      ${btn()}
      <div id="pct-result"></div>`;

        window._calcRun = () => {
            const type = document.getElementById('pct-type').value;
            const a = parseFloat(document.getElementById('pct-a').value);
            const b = parseFloat(document.getElementById('pct-b').value);
            if (isNaN(a) || isNaN(b)) {
                document.getElementById('pct-result').innerHTML = err('Enter both values.');
                return;
            }
            let res = '',
                label = '';
            if (type === 'whatpct') {
                res = fmt(a / b * 100, 4) + '%';
                label = `${a} is ${res} of ${b}`;
            } else if (type === 'xofpct') {
                res = fmt(a / 100 * b, 6);
                label = `${a}% of ${b} = ${res}`;
            } else if (type === 'pctchange') {
                res = fmt((b - a) / a * 100, 4) + '%';
                label = `Change from ${a} to ${b} = ${res}`;
            } else if (type === 'addpct') {
                res = fmt(b * (1 + a / 100), 6);
                label = `${b} + ${a}% = ${res}`;
            } else {
                res = fmt(b * (1 - a / 100), 6);
                label = `${b} − ${a}% = ${res}`;
            }
            document.getElementById('pct-result').innerHTML = result(row('Result', res) + row('', label));
            uwuHistory.add('percentage-calculator', {
                result: res
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('pct-result').innerHTML = '';
        };
    }

    // ── Fraction ──────────────────────────────────────────────────────────────

    function renderFraction(container) {
        container.innerHTML = `
      ${select('frac-op','Operation',[{v:'+',l:'Add'},{v:'-',l:'Subtract'},{v:'*',l:'Multiply'},{v:'/',l:'Divide'}])}
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
        <div class="calc-field" style="flex:1"><label>Numerator 1</label><input type="number" id="frac-n1" value="1"></div>
        <span style="margin-top:24px;font-size:20px">/</span>
        <div class="calc-field" style="flex:1"><label>Denominator 1</label><input type="number" id="frac-d1" value="2"></div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
        <div class="calc-field" style="flex:1"><label>Numerator 2</label><input type="number" id="frac-n2" value="1"></div>
        <span style="margin-top:24px;font-size:20px">/</span>
        <div class="calc-field" style="flex:1"><label>Denominator 2</label><input type="number" id="frac-d2" value="3"></div>
      </div>
      ${btn()}
      <div id="frac-result"></div>`;

        window._calcRun = () => {
            const n1 = parseInt(document.getElementById('frac-n1').value);
            const d1 = parseInt(document.getElementById('frac-d1').value);
            const n2 = parseInt(document.getElementById('frac-n2').value);
            const d2 = parseInt(document.getElementById('frac-d2').value);
            const op = document.getElementById('frac-op').value;
            if (!d1 || !d2) {
                document.getElementById('frac-result').innerHTML = err('Denominator cannot be zero.');
                return;
            }
            let rn, rd;
            if (op === '+') {
                rn = n1 * d2 + n2 * d1;
                rd = d1 * d2;
            } else if (op === '-') {
                rn = n1 * d2 - n2 * d1;
                rd = d1 * d2;
            } else if (op === '*') {
                rn = n1 * n2;
                rd = d1 * d2;
            } else {
                if (!n2) {
                    document.getElementById('frac-result').innerHTML = err('Cannot divide by zero fraction.');
                    return;
                }
                rn = n1 * d2;
                rd = d1 * n2;
            }
            const g = gcd(Math.abs(rn), Math.abs(rd));
            const sn = rn / g,
                sd = rd / g;
            const dec = sn / sd;
            document.getElementById('frac-result').innerHTML = result(
                row('Result', `${sn}/${sd}`) + row('Decimal', fmt(dec, 8)) + row('Percentage', fmt(dec * 100, 4) + '%')
            );
            uwuHistory.add('fraction-calculator', {
                result: `${sn}/${sd}`
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('frac-result').innerHTML = '';
        };
    }

    // ── Average ───────────────────────────────────────────────────────────────

    function renderAverage(container) {
        container.innerHTML = `
      ${field('avg-nums','Numbers (comma-separated)','text','5,10,15,20,25')}
      ${btn()}
      <div id="avg-result"></div>`;

        window._calcRun = () => {
            const nums = document.getElementById('avg-nums').value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
            if (!nums.length) {
                document.getElementById('avg-result').innerHTML = err('Enter numbers.');
                return;
            }
            const sum = nums.reduce((a, b) => a + b, 0);
            const mean = sum / nums.length;
            const sorted = [...nums].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
            document.getElementById('avg-result').innerHTML = result(
                row('Count', nums.length) + row('Sum', fmt(sum, 4)) + row('Mean (Average)', fmt(mean, 6)) + row('Median', fmt(median, 6)) + row('Min', sorted[0]) + row('Max', sorted[sorted.length - 1])
            );
            uwuHistory.add('average-calculator', {
                mean: fmt(mean, 4)
            });
        };
        window._calcReset = () => {
            document.getElementById('avg-nums').value = '';
            document.getElementById('avg-result').innerHTML = '';
        };
    }

    // ── Statistics ────────────────────────────────────────────────────────────

    function renderStatistics(container) {
        container.innerHTML = `
      ${field('stat-nums','Data set (comma-separated)','text','2,4,4,4,5,5,7,9')}
      ${btn()}
      <div id="stat-result"></div>`;

        window._calcRun = () => {
            const nums = document.getElementById('stat-nums').value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
            if (nums.length < 2) {
                document.getElementById('stat-result').innerHTML = err('Enter at least 2 numbers.');
                return;
            }
            const n = nums.length;
            const sum = nums.reduce((a, b) => a + b, 0);
            const mean = sum / n;
            const sorted = [...nums].sort((a, b) => a - b);
            const mid = Math.floor(n / 2);
            const median = n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
            const freq = {};
            nums.forEach(v => {
                freq[v] = (freq[v] || 0) + 1;
            });
            const maxFreq = Math.max(...Object.values(freq));
            const mode = Object.keys(freq).filter(k => freq[k] === maxFreq).join(', ');
            const variance = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1);
            const sd = Math.sqrt(variance);
            const range = sorted[n - 1] - sorted[0];
            document.getElementById('stat-result').innerHTML = result(
                row('Count', n) + row('Sum', fmt(sum, 4)) + row('Mean', fmt(mean, 6)) + row('Median', fmt(median, 6)) +
                row('Mode', mode) + row('Std Deviation (sample)', fmt(sd, 6)) + row('Variance (sample)', fmt(variance, 6)) +
                row('Range', fmt(range, 4)) + row('Min', sorted[0]) + row('Max', sorted[n - 1])
            );
            uwuHistory.add('statistics-calculator', {
                mean: fmt(mean, 4),
                sd: fmt(sd, 4)
            });
        };
        window._calcReset = () => {
            document.getElementById('stat-nums').value = '';
            document.getElementById('stat-result').innerHTML = '';
        };
    }

    // ── Standard Deviation ────────────────────────────────────────────────────

    function renderStdDev(container) {
        container.innerHTML = `
      ${field('sd-nums','Numbers (comma-separated)','text','2,4,4,4,5,5,7,9')}
      ${select('sd-type','Population type',[{v:'sample',l:'Sample (n−1)'},{v:'population',l:'Population (n)'}])}
      ${btn()}
      <div id="sd-result"></div>`;

        window._calcRun = () => {
            const nums = document.getElementById('sd-nums').value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
            const type = document.getElementById('sd-type').value;
            if (nums.length < 2) {
                document.getElementById('sd-result').innerHTML = err('Enter at least 2 numbers.');
                return;
            }
            const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
            const variance = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / (type === 'sample' ? nums.length - 1 : nums.length);
            const sd = Math.sqrt(variance);
            document.getElementById('sd-result').innerHTML = result(
                row('Mean', fmt(mean, 6)) + row('Variance', fmt(variance, 6)) + row('Standard Deviation', fmt(sd, 6))
            );
            uwuHistory.add('standard-deviation-calculator', {
                sd: fmt(sd, 6)
            });
        };
        window._calcReset = () => {
            document.getElementById('sd-nums').value = '';
            document.getElementById('sd-result').innerHTML = '';
        };
    }

    // ── Mean Median Mode Range ────────────────────────────────────────────────

    function renderMeanMedianMode(container) {
        container.innerHTML = `
      ${field('mmm-nums','Numbers (comma-separated)','text','3,7,7,2,9,1,5')}
      ${btn()}
      <div id="mmm-result"></div>`;

        window._calcRun = () => {
            const nums = document.getElementById('mmm-nums').value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
            if (!nums.length) {
                document.getElementById('mmm-result').innerHTML = err('Enter numbers.');
                return;
            }
            const sorted = [...nums].sort((a, b) => a - b);
            const n = nums.length;
            const mean = nums.reduce((a, b) => a + b, 0) / n;
            const mid = Math.floor(n / 2);
            const median = n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
            const freq = {};
            nums.forEach(v => {
                freq[v] = (freq[v] || 0) + 1;
            });
            const maxF = Math.max(...Object.values(freq));
            const mode = Object.keys(freq).filter(k => freq[k] === maxF).join(', ');
            const range = sorted[n - 1] - sorted[0];
            document.getElementById('mmm-result').innerHTML = result(
                row('Mean', fmt(mean, 4)) + row('Median', fmt(median, 4)) + row('Mode', mode) + row('Range', fmt(range, 4))
            );
            uwuHistory.add('mean-median-mode-range-calculator', {
                mean: fmt(mean, 4)
            });
        };
        window._calcReset = () => {
            document.getElementById('mmm-nums').value = '';
            document.getElementById('mmm-result').innerHTML = '';
        };
    }

    // ── Probability ───────────────────────────────────────────────────────────

    function renderProbability(container) {
        container.innerHTML = `
      ${select('prob-type','Problem Type',[
        {v:'single',l:'P(A) - single event'},
        {v:'and',l:'P(A and B) - independent events'},
        {v:'or',l:'P(A or B) - mutually exclusive'},
        {v:'complement',l:'P(not A) - complement'}
      ])}
      ${field('prob-a','P(A) - probability of event A (0 to 1)','number','0.3')}
      <div id="prob-b-wrap">${field('prob-b','P(B) - probability of event B (0 to 1)','number','0.5')}</div>
      ${btn()}
      <div id="prob-result"></div>`;

        document.getElementById('prob-type').addEventListener('change', e => {
            document.getElementById('prob-b-wrap').style.display = ['and', 'or'].includes(e.target.value) ? '' : 'none';
        });
        document.getElementById('prob-b-wrap').style.display = 'none';

        window._calcRun = () => {
            const type = document.getElementById('prob-type').value;
            const a = parseFloat(document.getElementById('prob-a').value);
            const b = parseFloat(document.getElementById('prob-b').value) || 0;
            if (isNaN(a) || a < 0 || a > 1) {
                document.getElementById('prob-result').innerHTML = err('P(A) must be between 0 and 1.');
                return;
            }
            let res;
            if (type === 'single') res = a;
            else if (type === 'and') res = a * b;
            else if (type === 'or') res = a + b - a * b;
            else res = 1 - a;
            document.getElementById('prob-result').innerHTML = result(
                row('Probability', fmt(res, 6)) + row('As percentage', fmt(res * 100, 4) + '%') + row('Odds (for:against)', `${fmt(res,4)} : ${fmt(1-res,4)}`)
            );
            uwuHistory.add('probability-calculator', {
                probability: fmt(res, 6)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('prob-result').innerHTML = '';
        };
    }

    // ── Permutation and Combination ───────────────────────────────────────────

    function renderPermComb(container) {
        container.innerHTML = `
      ${field('pc-n','Total items (n)','number','10')}
      ${field('pc-r','Items chosen (r)','number','3')}
      ${btn()}
      <div id="pc-result"></div>`;

        window._calcRun = () => {
            const n = parseInt(document.getElementById('pc-n').value);
            const r = parseInt(document.getElementById('pc-r').value);
            if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n) {
                document.getElementById('pc-result').innerHTML = err('Enter valid n and r (0 ≤ r ≤ n).');
                return;
            }
            const perm = factorial(n) / factorial(n - r);
            const comb = perm / factorial(r);
            document.getElementById('pc-result').innerHTML = result(
                row('Permutations P(n,r)', perm.toLocaleString()) + row('Combinations C(n,r)', comb.toLocaleString())
            );
            uwuHistory.add('permutation-and-combination-calculator', {
                permutations: perm,
                combinations: comb
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('pc-result').innerHTML = '';
        };
    }

    // ── GCF ───────────────────────────────────────────────────────────────────

    function renderGCF(container) {
        container.innerHTML = `
      ${field('gcf-nums','Numbers (comma-separated)','text','48,36,24')}
      ${btn()}
      <div id="gcf-result"></div>`;

        window._calcRun = () => {
            const nums = document.getElementById('gcf-nums').value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v) && v > 0);
            if (nums.length < 2) {
                document.getElementById('gcf-result').innerHTML = err('Enter at least 2 positive integers.');
                return;
            }
            const g = nums.reduce(gcd);
            document.getElementById('gcf-result').innerHTML = result(row('Greatest Common Factor', g));
            uwuHistory.add('greatest-common-factor-calculator', {
                gcf: g
            });
        };
        window._calcReset = () => {
            document.getElementById('gcf-nums').value = '';
            document.getElementById('gcf-result').innerHTML = '';
        };
    }

    // ── LCM ───────────────────────────────────────────────────────────────────

    function renderLCM(container) {
        container.innerHTML = `
      ${field('lcm-nums','Numbers (comma-separated)','text','4,6,8')}
      ${btn()}
      <div id="lcm-result"></div>`;

        window._calcRun = () => {
            const nums = document.getElementById('lcm-nums').value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v) && v > 0);
            if (nums.length < 2) {
                document.getElementById('lcm-result').innerHTML = err('Enter at least 2 positive integers.');
                return;
            }
            const l = nums.reduce(lcm);
            document.getElementById('lcm-result').innerHTML = result(row('Least Common Multiple', l.toLocaleString()));
            uwuHistory.add('least-common-multiple-calculator', {
                lcm: l
            });
        };
        window._calcReset = () => {
            document.getElementById('lcm-nums').value = '';
            document.getElementById('lcm-result').innerHTML = '';
        };
    }

    // ── Common Factor ─────────────────────────────────────────────────────────

    function renderCommonFactor(container) {
        container.innerHTML = `
      ${field('cf-nums','Numbers (comma-separated)','text','12,18,24')}
      ${btn()}
      <div id="cf-result"></div>`;

        window._calcRun = () => {
            const nums = document.getElementById('cf-nums').value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v) && v > 0);
            if (nums.length < 2) {
                document.getElementById('cf-result').innerHTML = err('Enter at least 2 positive integers.');
                return;
            }
            const g = nums.reduce(gcd);
            const factors = [];
            for (let i = 1; i <= g; i++) {
                if (g % i === 0) factors.push(i);
            }
            document.getElementById('cf-result').innerHTML = result(row('GCF', g) + row('All Common Factors', factors.join(', ')));
            uwuHistory.add('common-factor-calculator', {
                gcf: g
            });
        };
        window._calcReset = () => {
            document.getElementById('cf-nums').value = '';
            document.getElementById('cf-result').innerHTML = '';
        };
    }

    // ── Factor ────────────────────────────────────────────────────────────────

    function renderFactor(container) {
        container.innerHTML = `
      ${field('fac-n','Number','number','360')}
      ${btn()}
      <div id="fac-result"></div>`;

        window._calcRun = () => {
            const n = parseInt(document.getElementById('fac-n').value);
            if (!n || n < 1 || n > 1e9) {
                document.getElementById('fac-result').innerHTML = err('Enter a positive integer (≤ 1,000,000,000).');
                return;
            }
            const factors = [];
            for (let i = 1; i <= Math.sqrt(n); i++) {
                if (n % i === 0) {
                    factors.push(i);
                    if (i !== n / i) factors.push(n / i);
                }
            }
            factors.sort((a, b) => a - b);
            document.getElementById('fac-result').innerHTML = result(row('Factors of ' + n, factors.join(', ')) + row('Number of factors', factors.length));
            uwuHistory.add('factor-calculator', {
                number: n,
                factors: factors.length
            });
        };
        window._calcReset = () => {
            document.getElementById('fac-n').value = '';
            document.getElementById('fac-result').innerHTML = '';
        };
    }

    // ── Prime Factorization ───────────────────────────────────────────────────

    function renderPrimeFactorization(container) {
        container.innerHTML = `
      ${field('pf-n','Number','number','360')}
      ${btn()}
      <div id="pf-result"></div>`;

        window._calcRun = () => {
            let n = parseInt(document.getElementById('pf-n').value);
            if (!n || n < 2) {
                document.getElementById('pf-result').innerHTML = err('Enter an integer ≥ 2.');
                return;
            }
            const orig = n;
            const factors = [];
            for (let d = 2; d * d <= n; d++) {
                while (n % d === 0) {
                    factors.push(d);
                    n /= d;
                }
            }
            if (n > 1) factors.push(n);
            const counts = {};
            factors.forEach(f => {
                counts[f] = (counts[f] || 0) + 1;
            });
            const expr = Object.entries(counts).map(([f, c]) => c > 1 ? `${f}^${c}` : f).join(' × ');
            document.getElementById('pf-result').innerHTML = result(row('Prime Factorization of ' + orig, expr) + row('Prime factors', Object.keys(counts).join(', ')));
            uwuHistory.add('prime-factorization-calculator', {
                number: orig,
                factorization: expr
            });
        };
        window._calcReset = () => {
            document.getElementById('pf-n').value = '';
            document.getElementById('pf-result').innerHTML = '';
        };
    }

    // ── Exponent ──────────────────────────────────────────────────────────────

    function renderExponent(container) {
        container.innerHTML = `
      ${field('exp-base','Base','number','2')}
      ${field('exp-power','Exponent','number','10')}
      ${btn()}
      <div id="exp-result"></div>`;

        window._calcRun = () => {
            const base = parseFloat(document.getElementById('exp-base').value);
            const power = parseFloat(document.getElementById('exp-power').value);
            if (isNaN(base) || isNaN(power)) {
                document.getElementById('exp-result').innerHTML = err('Enter base and exponent.');
                return;
            }
            const res = Math.pow(base, power);
            document.getElementById('exp-result').innerHTML = result(row(`${base} ^ ${power}`, res.toLocaleString()));
            uwuHistory.add('exponent-calculator', {
                result: res
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('exp-result').innerHTML = '';
        };
    }

    // ── Root ──────────────────────────────────────────────────────────────────

    function renderRoot(container) {
        container.innerHTML = `
      ${field('root-n','Number','number','27')}
      ${field('root-degree','Root degree (e.g. 2 = square, 3 = cube)','number','3')}
      ${btn()}
      <div id="root-result"></div>`;

        window._calcRun = () => {
            const n = parseFloat(document.getElementById('root-n').value);
            const deg = parseFloat(document.getElementById('root-degree').value) || 2;
            if (isNaN(n)) {
                document.getElementById('root-result').innerHTML = err('Enter a number.');
                return;
            }
            const res = Math.pow(n, 1 / deg);
            document.getElementById('root-result').innerHTML = result(row(`${deg}th root of ${n}`, fmt(res, 8)));
            uwuHistory.add('root-calculator', {
                result: fmt(res, 8)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('root-result').innerHTML = '';
        };
    }

    // ── Log ───────────────────────────────────────────────────────────────────

    function renderLog(container) {
        container.innerHTML = `
      ${field('log-n','Number','number','100')}
      ${select('log-base','Base',[{v:'10',l:'Base 10 (log)'},{v:'e',l:'Natural log (ln)'},{v:'2',l:'Base 2 (log₂)'},{v:'custom',l:'Custom base'}])}
      <div id="log-custom" style="display:none">${field('log-custombase','Custom base','number','5')}</div>
      ${btn()}
      <div id="log-result"></div>`;

        document.getElementById('log-base').addEventListener('change', e => {
            document.getElementById('log-custom').style.display = e.target.value === 'custom' ? '' : 'none';
        });

        window._calcRun = () => {
            const n = parseFloat(document.getElementById('log-n').value);
            const baseType = document.getElementById('log-base').value;
            if (!n || n <= 0) {
                document.getElementById('log-result').innerHTML = err('Enter a positive number.');
                return;
            }
            let res, label;
            if (baseType === '10') {
                res = Math.log10(n);
                label = 'log₁₀';
            } else if (baseType === 'e') {
                res = Math.log(n);
                label = 'ln';
            } else if (baseType === '2') {
                res = Math.log2(n);
                label = 'log₂';
            } else {
                const cb = parseFloat(document.getElementById('log-custombase').value);
                res = Math.log(n) / Math.log(cb);
                label = `log₍${cb}₎`;
            }
            document.getElementById('log-result').innerHTML = result(row(`${label}(${n})`, fmt(res, 8)));
            uwuHistory.add('log-calculator', {
                result: fmt(res, 8)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('log-result').innerHTML = '';
        };
    }

    // ── Triangle ──────────────────────────────────────────────────────────────

    function renderTriangle(container) {
        container.innerHTML = `
      <p style="font-size:14px;opacity:0.8;margin-bottom:12px">Enter 3 known values. For angles, use degrees. At least one must be a side.</p>
      ${field('tri-a','Side a','number','')}
      ${field('tri-b','Side b','number','')}
      ${field('tri-c','Side c','number','')}
      ${field('tri-A','Angle A (degrees, opposite side a)','number','')}
      ${field('tri-B','Angle B (degrees, opposite side b)','number','')}
      ${field('tri-C','Angle C (degrees, opposite side c)','number','')}
      ${btn()}
      <div id="tri-result"></div>`;

        window._calcRun = () => {
            let a = parseFloat(document.getElementById('tri-a').value) || null;
            let b = parseFloat(document.getElementById('tri-b').value) || null;
            let c = parseFloat(document.getElementById('tri-c').value) || null;
            let A = parseFloat(document.getElementById('tri-A').value) || null;
            let B = parseFloat(document.getElementById('tri-B').value) || null;
            let C = parseFloat(document.getElementById('tri-C').value) || null;
            const deg = x => x * Math.PI / 180,
                rad = x => x * 180 / Math.PI;
            // Try to solve
            if (A && B && !C) C = 180 - A - B;
            if (A && C && !B) B = 180 - A - C;
            if (B && C && !A) A = 180 - B - C;
            if (a && b && A && !B) B = rad(Math.asin(b * Math.sin(deg(A)) / a));
            if (a && b && B && !A) A = rad(Math.asin(a * Math.sin(deg(B)) / b));
            if (A && B && C && a && !b) b = a * Math.sin(deg(B)) / Math.sin(deg(A));
            if (A && B && C && a && !c) c = a * Math.sin(deg(C)) / Math.sin(deg(A));
            if (a && b && C && !c) c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(deg(C)));
            if (!A && B && C) A = 180 - B - C;
            if (!B && A && C) B = 180 - A - C;
            if (!a && b && c && A) a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(deg(A)));
            const allSides = a && b && c;
            const allAngles = A && B && C;
            if (!allSides || !allAngles) {
                document.getElementById('tri-result').innerHTML = err('Could not solve with given values. Try different combination.');
                return;
            }
            const perimeter = a + b + c,
                s = perimeter / 2;
            const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
            document.getElementById('tri-result').innerHTML = result(
                row('Side a', fmt(a, 4)) + row('Side b', fmt(b, 4)) + row('Side c', fmt(c, 4)) +
                row('Angle A', fmt(A, 4) + '°') + row('Angle B', fmt(B, 4) + '°') + row('Angle C', fmt(C, 4) + '°') +
                row('Perimeter', fmt(perimeter, 4)) + row('Area', fmt(area, 4))
            );
            uwuHistory.add('triangle-calculator', {
                area: fmt(area, 4)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('tri-result').innerHTML = '';
        };
    }

    // ── Right Triangle ────────────────────────────────────────────────────────

    function renderRightTriangle(container) {
        container.innerHTML = `
      <p style="font-size:14px;opacity:0.8;margin-bottom:12px">Enter any 2 known values of a right triangle (C = 90°).</p>
      ${field('rt-a','Side a (leg)','number','')}
      ${field('rt-b','Side b (leg)','number','')}
      ${field('rt-c','Side c (hypotenuse)','number','')}
      ${field('rt-A','Angle A (degrees)','number','')}
      ${field('rt-B','Angle B (degrees)','number','')}
      ${btn()}
      <div id="rt-result"></div>`;

        window._calcRun = () => {
            let a = parseFloat(document.getElementById('rt-a').value) || null;
            let b = parseFloat(document.getElementById('rt-b').value) || null;
            let c = parseFloat(document.getElementById('rt-c').value) || null;
            let A = parseFloat(document.getElementById('rt-A').value) || null;
            let B = parseFloat(document.getElementById('rt-B').value) || null;
            const deg = x => x * Math.PI / 180,
                rad = x => x * 180 / Math.PI;
            if (a && b && !c) c = Math.sqrt(a * a + b * b);
            else if (a && c && !b) b = Math.sqrt(c * c - a * a);
            else if (b && c && !a) a = Math.sqrt(c * c - b * b);
            if (a && c && !A) A = rad(Math.asin(a / c));
            if (b && c && !B) B = rad(Math.asin(b / c));
            if (A && !B) B = 90 - A;
            if (B && !A) A = 90 - B;
            if (A && c && !a) a = c * Math.sin(deg(A));
            if (A && c && !b) b = c * Math.cos(deg(A));
            if (!c && a && b) c = Math.sqrt(a * a + b * b);
            const area = a && b ? 0.5 * a * b : null;
            const perimeter = a && b && c ? a + b + c : null;
            document.getElementById('rt-result').innerHTML = result(
                row('Side a', a ? fmt(a, 4) : '-') + row('Side b', b ? fmt(b, 4) : '-') + row('Hypotenuse c', c ? fmt(c, 4) : '-') +
                row('Angle A', A ? fmt(A, 4) + '°' : '-') + row('Angle B', B ? fmt(B, 4) + '°' : '-') + row('Angle C', '90°') +
                (area ? row('Area', fmt(area, 4)) : '') +
                (perimeter ? row('Perimeter', fmt(perimeter, 4)) : '')
            );
            uwuHistory.add('right-triangle-calculator', {
                hypotenuse: c ? fmt(c, 4) : '-'
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('rt-result').innerHTML = '';
        };
    }

    // ── Pythagorean Theorem ───────────────────────────────────────────────────

    function renderPythagorean(container) {
        container.innerHTML = `
      ${select('pyth-solve','Solve for',[{v:'c',l:'Hypotenuse (c)'},{v:'a',l:'Leg a'},{v:'b',l:'Leg b'}])}
      ${field('pyth-a','Leg a','number','')}
      ${field('pyth-b','Leg b','number','')}
      ${field('pyth-c','Hypotenuse c','number','')}
      ${btn()}
      <div id="pyth-result"></div>`;

        window._calcRun = () => {
            const solve = document.getElementById('pyth-solve').value;
            const a = parseFloat(document.getElementById('pyth-a').value);
            const b = parseFloat(document.getElementById('pyth-b').value);
            const c = parseFloat(document.getElementById('pyth-c').value);
            let res;
            if (solve === 'c' && a && b) res = Math.sqrt(a * a + b * b);
            else if (solve === 'a' && b && c) res = Math.sqrt(c * c - b * b);
            else if (solve === 'b' && a && c) res = Math.sqrt(c * c - a * a);
            else {
                document.getElementById('pyth-result').innerHTML = err('Enter the two known values.');
                return;
            }
            document.getElementById('pyth-result').innerHTML = result(row(`${solve} =`, fmt(res, 6)));
            uwuHistory.add('pythagorean-theorem-calculator', {
                result: fmt(res, 6)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('pyth-result').innerHTML = '';
        };
    }

    // ── Quadratic ─────────────────────────────────────────────────────────────

    function renderQuadratic(container) {
        container.innerHTML = `
      <p style="font-size:14px;opacity:0.8;margin-bottom:12px">Solves ax² + bx + c = 0</p>
      ${field('quad-a','a (coefficient of x²)','number','1')}
      ${field('quad-b','b (coefficient of x)','number','-5')}
      ${field('quad-c','c (constant)','number','6')}
      ${btn()}
      <div id="quad-result"></div>`;

        window._calcRun = () => {
            const a = parseFloat(document.getElementById('quad-a').value);
            const b = parseFloat(document.getElementById('quad-b').value);
            const c = parseFloat(document.getElementById('quad-c').value);
            if (!a) {
                document.getElementById('quad-result').innerHTML = err("Coefficient 'a' cannot be zero.");
                return;
            }
            const disc = b * b - 4 * a * c;
            if (disc < 0) {
                const realPart = -b / (2 * a),
                    imagPart = Math.sqrt(-disc) / (2 * a);
                document.getElementById('quad-result').innerHTML = result(row('Discriminant', fmt(disc, 4)) + row('x₁', `${fmt(realPart,4)} + ${fmt(imagPart,4)}i`) + row('x₂', `${fmt(realPart,4)} − ${fmt(imagPart,4)}i`));
            } else if (disc === 0) {
                const x = -b / (2 * a);
                document.getElementById('quad-result').innerHTML = result(row('Discriminant', '0 (one real root)') + row('x', fmt(x, 6)));
            } else {
                const x1 = (-b + Math.sqrt(disc)) / (2 * a),
                    x2 = (-b - Math.sqrt(disc)) / (2 * a);
                document.getElementById('quad-result').innerHTML = result(row('Discriminant', fmt(disc, 4)) + row('x₁', fmt(x1, 6)) + row('x₂', fmt(x2, 6)));
            }
            uwuHistory.add('quadratic-formula-calculator', {
                a,
                b,
                c
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('quad-result').innerHTML = '';
        };
    }

    // ── Area ──────────────────────────────────────────────────────────────────

    function renderArea(container) {
        container.innerHTML = `
      ${select('area-shape','Shape',[
        {v:'rect',l:'Rectangle / Square'},
        {v:'circle',l:'Circle'},
        {v:'triangle',l:'Triangle'},
        {v:'trapezoid',l:'Trapezoid'},
        {v:'ellipse',l:'Ellipse'},
        {v:'parallelogram',l:'Parallelogram'},
        {v:'sector',l:'Sector'}
      ])}
      <div id="area-inputs"></div>
      ${btn()}
      <div id="area-result"></div>`;

        const shapes = {
            rect: `${field('area-w','Width','number','5')}${field('area-h','Height','number','3')}`,
            circle: field('area-r', 'Radius', 'number', '5'),
            triangle: `${field('area-tb','Base','number','6')}${field('area-th','Height','number','4')}`,
            trapezoid: `${field('area-ta','Parallel side a','number','6')}${field('area-tb2','Parallel side b','number','4')}${field('area-th2','Height','number','3')}`,
            ellipse: `${field('area-ea','Semi-major axis a','number','6')}${field('area-eb','Semi-minor axis b','number','4')}`,
            parallelogram: `${field('area-pb','Base','number','8')}${field('area-ph','Height','number','5')}`,
            sector: `${field('area-sr','Radius','number','5')}${field('area-sa','Angle (degrees)','number','90')}`
        };
        document.getElementById('area-shape').addEventListener('change', e => {
            document.getElementById('area-inputs').innerHTML = shapes[e.target.value];
        });
        document.getElementById('area-inputs').innerHTML = shapes.rect;

        window._calcRun = () => {
            const shape = document.getElementById('area-shape').value;
            let area, perimeter = '-';
            try {
                if (shape === 'rect') {
                    const w = +document.getElementById('area-w').value,
                        h = +document.getElementById('area-h').value;
                    area = w * h;
                    perimeter = 2 * (w + h);
                } else if (shape === 'circle') {
                    const r = +document.getElementById('area-r').value;
                    area = Math.PI * r * r;
                    perimeter = fmt(2 * Math.PI * r, 4) + ' (circumference)';
                } else if (shape === 'triangle') {
                    const b = +document.getElementById('area-tb').value,
                        h = +document.getElementById('area-th').value;
                    area = 0.5 * b * h;
                } else if (shape === 'trapezoid') {
                    const a = +document.getElementById('area-ta').value,
                        b = +document.getElementById('area-tb2').value,
                        h = +document.getElementById('area-th2').value;
                    area = 0.5 * (a + b) * h;
                } else if (shape === 'ellipse') {
                    const a = +document.getElementById('area-ea').value,
                        b = +document.getElementById('area-eb').value;
                    area = Math.PI * a * b;
                } else if (shape === 'parallelogram') {
                    const b = +document.getElementById('area-pb').value,
                        h = +document.getElementById('area-ph').value;
                    area = b * h;
                } else if (shape === 'sector') {
                    const r = +document.getElementById('area-sr').value,
                        deg = +document.getElementById('area-sa').value;
                    area = 0.5 * r * r * (deg * Math.PI / 180);
                }
            } catch (e) {
                area = NaN;
            }
            if (isNaN(area)) {
                document.getElementById('area-result').innerHTML = err('Enter valid values.');
                return;
            }
            document.getElementById('area-result').innerHTML = result(row('Area', fmt(area, 6)) + (perimeter !== '-' ? row('Perimeter/Circumference', perimeter) : ''));
            uwuHistory.add('area-calculator', {
                area: fmt(area, 4)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('area-result').innerHTML = '';
        };
    }

    // ── Volume ────────────────────────────────────────────────────────────────

    function renderVolume(container) {
        container.innerHTML = `
      ${select('vol-shape','Shape',[
        {v:'cube',l:'Cube'},
        {v:'rect',l:'Rectangular Prism'},
        {v:'sphere',l:'Sphere'},
        {v:'cylinder',l:'Cylinder'},
        {v:'cone',l:'Cone'},
        {v:'pyramid',l:'Square Pyramid'}
      ])}
      <div id="vol-inputs"></div>
      ${btn()}
      <div id="vol-result"></div>`;

        const shapes = {
            cube: field('vol-a', 'Side length', 'number', '5'),
            rect: `${field('vol-l','Length','number','5')}${field('vol-w','Width','number','4')}${field('vol-h','Height','number','3')}`,
            sphere: field('vol-r', 'Radius', 'number', '5'),
            cylinder: `${field('vol-cr','Radius','number','3')}${field('vol-ch','Height','number','8')}`,
            cone: `${field('vol-cnr','Radius','number','3')}${field('vol-cnh','Height','number','8')}`,
            pyramid: `${field('vol-pb','Base side','number','4')}${field('vol-ph','Height','number','6')}`
        };
        document.getElementById('vol-shape').addEventListener('change', e => {
            document.getElementById('vol-inputs').innerHTML = shapes[e.target.value];
        });
        document.getElementById('vol-inputs').innerHTML = shapes.cube;

        window._calcRun = () => {
            const shape = document.getElementById('vol-shape').value;
            let vol;
            try {
                if (shape === 'cube') {
                    const a = +document.getElementById('vol-a').value;
                    vol = a ** 3;
                } else if (shape === 'rect') {
                    const l = +document.getElementById('vol-l').value,
                        w = +document.getElementById('vol-w').value,
                        h = +document.getElementById('vol-h').value;
                    vol = l * w * h;
                } else if (shape === 'sphere') {
                    const r = +document.getElementById('vol-r').value;
                    vol = (4 / 3) * Math.PI * r ** 3;
                } else if (shape === 'cylinder') {
                    const r = +document.getElementById('vol-cr').value,
                        h = +document.getElementById('vol-ch').value;
                    vol = Math.PI * r * r * h;
                } else if (shape === 'cone') {
                    const r = +document.getElementById('vol-cnr').value,
                        h = +document.getElementById('vol-cnh').value;
                    vol = (1 / 3) * Math.PI * r * r * h;
                } else if (shape === 'pyramid') {
                    const b = +document.getElementById('vol-pb').value,
                        h = +document.getElementById('vol-ph').value;
                    vol = (1 / 3) * b * b * h;
                }
            } catch (e) {
                vol = NaN;
            }
            if (isNaN(vol)) {
                document.getElementById('vol-result').innerHTML = err('Enter valid values.');
                return;
            }
            document.getElementById('vol-result').innerHTML = result(row('Volume', fmt(vol, 6) + ' cubic units'));
            uwuHistory.add('volume-calculator', {
                volume: fmt(vol, 4)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('vol-result').innerHTML = '';
        };
    }

    // ── Surface Area ──────────────────────────────────────────────────────────

    function renderSurfaceArea(container) {
        container.innerHTML = `
      ${select('sa-shape','Shape',[
        {v:'cube',l:'Cube'},
        {v:'rect',l:'Rectangular Prism'},
        {v:'sphere',l:'Sphere'},
        {v:'cylinder',l:'Cylinder'},
        {v:'cone',l:'Cone'}
      ])}
      <div id="sa-inputs"></div>
      ${btn()}
      <div id="sa-result"></div>`;

        const shapes = {
            cube: field('sa-a', 'Side length', 'number', '5'),
            rect: `${field('sa-l','Length','number','5')}${field('sa-w','Width','number','4')}${field('sa-h','Height','number','3')}`,
            sphere: field('sa-r', 'Radius', 'number', '5'),
            cylinder: `${field('sa-cr','Radius','number','3')}${field('sa-ch','Height','number','8')}`,
            cone: `${field('sa-cnr','Radius','number','3')}${field('sa-cnl','Slant height','number','5')}`
        };
        document.getElementById('sa-shape').addEventListener('change', e => {
            document.getElementById('sa-inputs').innerHTML = shapes[e.target.value];
        });
        document.getElementById('sa-inputs').innerHTML = shapes.cube;

        window._calcRun = () => {
            const shape = document.getElementById('sa-shape').value;
            let sa;
            try {
                if (shape === 'cube') {
                    const a = +document.getElementById('sa-a').value;
                    sa = 6 * a * a;
                } else if (shape === 'rect') {
                    const l = +document.getElementById('sa-l').value,
                        w = +document.getElementById('sa-w').value,
                        h = +document.getElementById('sa-h').value;
                    sa = 2 * (l * w + l * h + w * h);
                } else if (shape === 'sphere') {
                    const r = +document.getElementById('sa-r').value;
                    sa = 4 * Math.PI * r * r;
                } else if (shape === 'cylinder') {
                    const r = +document.getElementById('sa-cr').value,
                        h = +document.getElementById('sa-ch').value;
                    sa = 2 * Math.PI * r * (r + h);
                } else if (shape === 'cone') {
                    const r = +document.getElementById('sa-cnr').value,
                        l = +document.getElementById('sa-cnl').value;
                    sa = Math.PI * r * (r + l);
                }
            } catch (e) {
                sa = NaN;
            }
            if (isNaN(sa)) {
                document.getElementById('sa-result').innerHTML = err('Enter valid values.');
                return;
            }
            document.getElementById('sa-result').innerHTML = result(row('Surface Area', fmt(sa, 6) + ' sq units'));
            uwuHistory.add('surface-area-calculator', {
                sa: fmt(sa, 4)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('sa-result').innerHTML = '';
        };
    }

    // ── Circle ────────────────────────────────────────────────────────────────

    function renderCircle(container) {
        container.innerHTML = `
      ${select('circ-from','Known value',[{v:'r',l:'Radius'},{v:'d',l:'Diameter'},{v:'c',l:'Circumference'},{v:'a',l:'Area'}])}
      ${field('circ-val','Value','number','5')}
      ${btn()}
      <div id="circ-result"></div>`;

        window._calcRun = () => {
            const from = document.getElementById('circ-from').value;
            const val = parseFloat(document.getElementById('circ-val').value);
            if (!val || val <= 0) {
                document.getElementById('circ-result').innerHTML = err('Enter a positive value.');
                return;
            }
            let r;
            if (from === 'r') r = val;
            else if (from === 'd') r = val / 2;
            else if (from === 'c') r = val / (2 * Math.PI);
            else r = Math.sqrt(val / Math.PI);
            document.getElementById('circ-result').innerHTML = result(
                row('Radius', fmt(r, 6)) + row('Diameter', fmt(2 * r, 6)) + row('Circumference', fmt(2 * Math.PI * r, 6)) + row('Area', fmt(Math.PI * r * r, 6))
            );
            uwuHistory.add('circle-calculator', {
                radius: fmt(r, 4)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('circ-result').innerHTML = '';
        };
    }

    // ── Square Footage ────────────────────────────────────────────────────────

    function renderSquareFootage(container) {
        container.innerHTML = `
      ${select('sqft-shape','Shape',[{v:'rect',l:'Rectangle'},{v:'circle',l:'Circle'},{v:'triangle',l:'Triangle'},{v:'lshape',l:'L-Shape'}])}
      <div id="sqft-inputs">
        ${field('sqft-l','Length (ft)','number','20')}
        ${field('sqft-w','Width (ft)','number','15')}
      </div>
      ${field('sqft-price','Price per sq ft ($, optional)','number','')}
      ${btn()}
      <div id="sqft-result"></div>`;

        const shapes = {
            rect: `${field('sqft-l','Length (ft)','number','20')}${field('sqft-w','Width (ft)','number','15')}`,
            circle: field('sqft-r', 'Radius (ft)', 'number', '8'),
            triangle: `${field('sqft-tb','Base (ft)','number','10')}${field('sqft-th','Height (ft)','number','12')}`,
            lshape: `${field('sqft-l1','Total length A','number','20')}${field('sqft-w1','Total width A','number','15')}${field('sqft-l2','Cut-out length B','number','8')}${field('sqft-w2','Cut-out width B','number','6')}`
        };
        document.getElementById('sqft-shape').addEventListener('change', e => {
            document.getElementById('sqft-inputs').innerHTML = shapes[e.target.value];
        });

        window._calcRun = () => {
            const shape = document.getElementById('sqft-shape').value;
            const price = parseFloat(document.getElementById('sqft-price').value) || 0;
            let area;
            try {
                if (shape === 'rect') {
                    area = +document.getElementById('sqft-l').value * +document.getElementById('sqft-w').value;
                } else if (shape === 'circle') {
                    const r = +document.getElementById('sqft-r').value;
                    area = Math.PI * r * r;
                } else if (shape === 'triangle') {
                    area = 0.5 * (+document.getElementById('sqft-tb').value) * (+document.getElementById('sqft-th').value);
                } else {
                    const a1 = +document.getElementById('sqft-l1').value * +document.getElementById('sqft-w1').value;
                    const a2 = +document.getElementById('sqft-l2').value * +document.getElementById('sqft-w2').value;
                    area = a1 - a2;
                }
            } catch (e) {
                area = NaN;
            }
            if (isNaN(area)) {
                document.getElementById('sqft-result').innerHTML = err('Enter valid values.');
                return;
            }
            document.getElementById('sqft-result').innerHTML = result(
                row('Square Footage', fmt(area, 2) + ' sq ft') +
                row('Square Metres', fmt(area * 0.092903, 2) + ' m²') +
                (price ? row('Total Cost', `$${fmt(area*price,2)}`) : '') +
                (price ? row('Price per sq ft', `$${fmt(price,2)}`) : '')
            );
            uwuHistory.add('square-footage-calculator', {
                area: fmt(area, 2)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('sqft-result').innerHTML = '';
        };
    }

    // ── Slope ─────────────────────────────────────────────────────────────────

    function renderSlope(container) {
        container.innerHTML = `
      <p style="font-size:14px;opacity:0.8;margin-bottom:12px">Enter two points (x₁,y₁) and (x₂,y₂).</p>
      ${field('sl-x1','x₁','number','1')}
      ${field('sl-y1','y₁','number','2')}
      ${field('sl-x2','x₂','number','4')}
      ${field('sl-y2','y₂','number','8')}
      ${btn()}
      <div id="sl2-result"></div>`;

        window._calcRun = () => {
            const x1 = parseFloat(document.getElementById('sl-x1').value);
            const y1 = parseFloat(document.getElementById('sl-y1').value);
            const x2 = parseFloat(document.getElementById('sl-x2').value);
            const y2 = parseFloat(document.getElementById('sl-y2').value);
            if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
                document.getElementById('sl2-result').innerHTML = err('Enter all four values.');
                return;
            }
            if (x1 === x2) {
                document.getElementById('sl2-result').innerHTML = result(row('Slope', 'Undefined (vertical line)') + row('x = ', fmt(x1, 4)));
                return;
            }
            const m = (y2 - y1) / (x2 - x1);
            const b = y1 - m * x1;
            const angle = Math.atan(m) * 180 / Math.PI;
            const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            document.getElementById('sl2-result').innerHTML = result(
                row('Slope (m)', fmt(m, 6)) + row('y-intercept (b)', fmt(b, 6)) + row('Equation', `y = ${fmt(m,4)}x + ${fmt(b,4)}`) + row('Angle', fmt(angle, 4) + '°') + row('Distance', fmt(dist, 6))
            );
            uwuHistory.add('slope-calculator', {
                slope: fmt(m, 4)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('sl2-result').innerHTML = '';
        };
    }

    // ── Ratio ─────────────────────────────────────────────────────────────────

    function renderRatio(container) {
        container.innerHTML = `
      ${select('ratio-type','Solve for',[
        {v:'simplify',l:'Simplify a ratio'},
        {v:'scale',l:'Scale a ratio'},
        {v:'compare',l:'Compare two ratios'}
      ])}
      ${field('ratio-a','A','number','4')}
      ${field('ratio-b','B','number','6')}
      <div id="ratio-extra" style="display:none">
        ${field('ratio-c','C (scale factor, or 3rd value)','number','2')}
        ${field('ratio-d','D (4th value for compare)','number','3')}
      </div>
      ${btn()}
      <div id="ratio-result"></div>`;

        document.getElementById('ratio-type').addEventListener('change', e => {
            document.getElementById('ratio-extra').style.display = e.target.value !== 'simplify' ? '' : 'none';
        });

        window._calcRun = () => {
            const type = document.getElementById('ratio-type').value;
            const a = parseFloat(document.getElementById('ratio-a').value);
            const b = parseFloat(document.getElementById('ratio-b').value);
            if (!b) {
                document.getElementById('ratio-result').innerHTML = err('B cannot be zero.');
                return;
            }
            const g = gcd(a, b);
            if (type === 'simplify') {
                document.getElementById('ratio-result').innerHTML = result(row('Simplified', `${a/g} : ${b/g}`) + row('As fraction', `${a/g}/${b/g}`) + row('Decimal', fmt(a / b, 6)));
            } else if (type === 'scale') {
                const c = parseFloat(document.getElementById('ratio-c').value);
                document.getElementById('ratio-result').innerHTML = result(row('Scaled ratio', `${fmt(a*c,4)} : ${fmt(b*c,4)}`));
            } else {
                const c = parseFloat(document.getElementById('ratio-c').value);
                const d = parseFloat(document.getElementById('ratio-d').value);
                const eq = (a * d).toFixed(6) === (b * c).toFixed(6);
                document.getElementById('ratio-result').innerHTML = result(
                    row(`${a}/${b} = ${fmt(a/b,6)}`, 'first ratio') + row(`${c}/${d} = ${fmt(c/d,6)}`, 'second ratio') + row('Equivalent?', eq ? 'Yes' : 'No')
                );
            }
            uwuHistory.add('ratio-calculator', {
                simplified: `${a/g}:${b/g}`
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('ratio-result').innerHTML = '';
        };
    }

    // ── Rounding ──────────────────────────────────────────────────────────────

    function renderRounding(container) {
        container.innerHTML = `
      ${field('rnd-n','Number','number','3.14159')}
      ${field('rnd-dec','Decimal places','number','2')}
      ${btn()}
      <div id="rnd-result"></div>`;

        window._calcRun = () => {
            const n = parseFloat(document.getElementById('rnd-n').value);
            const dec = parseInt(document.getElementById('rnd-dec').value) || 0;
            if (isNaN(n)) {
                document.getElementById('rnd-result').innerHTML = err('Enter a number.');
                return;
            }
            const rounded = Number(n.toFixed(dec));
            const floor = Math.floor(n * 10 ** dec) / 10 ** dec;
            const ceil = Math.ceil(n * 10 ** dec) / 10 ** dec;
            document.getElementById('rnd-result').innerHTML = result(
                row('Rounded', rounded) + row('Floor', floor) + row('Ceiling', ceil)
            );
            uwuHistory.add('rounding-calculator', {
                rounded
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('rnd-result').innerHTML = '';
        };
    }

    // ── Scientific Notation ───────────────────────────────────────────────────

    function renderScientificNotation(container) {
        container.innerHTML = `
      ${select('sn-mode','Convert',[{v:'to',l:'Standard → Scientific Notation'},{v:'from',l:'Scientific Notation → Standard'}])}
      <div id="sn-to">${field('sn-standard','Standard number','text','123456789')}</div>
      <div id="sn-from" style="display:none">
        ${field('sn-coef','Coefficient (e.g. 1.23)','number','1.23')}
        ${field('sn-exp','Exponent (e.g. 8)','number','8')}
      </div>
      ${btn()}
      <div id="sn-result"></div>`;

        document.getElementById('sn-mode').addEventListener('change', e => {
            document.getElementById('sn-to').style.display = e.target.value === 'to' ? '' : 'none';
            document.getElementById('sn-from').style.display = e.target.value === 'from' ? '' : 'none';
        });

        window._calcRun = () => {
            const mode = document.getElementById('sn-mode').value;
            if (mode === 'to') {
                const n = parseFloat(document.getElementById('sn-standard').value);
                if (isNaN(n)) {
                    document.getElementById('sn-result').innerHTML = err('Enter a number.');
                    return;
                }
                const exp = Math.floor(Math.log10(Math.abs(n)));
                const coef = n / 10 ** exp;
                document.getElementById('sn-result').innerHTML = result(row('Scientific Notation', `${fmt(coef,6)} × 10^${exp}`) + row('E-notation', `${fmt(coef,6)}E${exp}`));
            } else {
                const coef = parseFloat(document.getElementById('sn-coef').value);
                const exp = parseFloat(document.getElementById('sn-exp').value);
                const n = coef * 10 ** exp;
                document.getElementById('sn-result').innerHTML = result(row('Standard Form', n.toLocaleString('fullwide')));
            }
            uwuHistory.add('scientific-notation-calculator', {});
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('sn-result').innerHTML = '';
        };
    }

    // ── Long Division ─────────────────────────────────────────────────────────

    function renderLongDivision(container) {
        container.innerHTML = `
      ${field('ld-dividend','Dividend','number','1234')}
      ${field('ld-divisor','Divisor','number','7')}
      ${btn()}
      <div id="ld-result"></div>`;

        window._calcRun = () => {
            const dividend = parseInt(document.getElementById('ld-dividend').value);
            const divisor = parseInt(document.getElementById('ld-divisor').value);
            if (!divisor) {
                document.getElementById('ld-result').innerHTML = err('Divisor cannot be zero.');
                return;
            }
            const quotient = Math.floor(dividend / divisor);
            const remainder = dividend % divisor;
            const decimal = dividend / divisor;
            let steps = '';
            let partial = 0;
            const digits = String(Math.abs(dividend)).split('');
            digits.forEach((d, i) => {
                partial = partial * 10 + parseInt(d);
                const q = Math.floor(partial / Math.abs(divisor));
                const r = partial % Math.abs(divisor);
                steps += `<div style="font-family:monospace;font-size:13px;opacity:0.9;margin:2px 0">${partial} ÷ ${Math.abs(divisor)} = ${q} remainder ${r}</div>`;
                partial = r;
            });
            document.getElementById('ld-result').innerHTML = result(
                row('Quotient', quotient) + row('Remainder', remainder) + row('Decimal', fmt(decimal, 8)) +
                `<details style="margin-top:8px"><summary style="cursor:pointer;font-size:13px">Step-by-step</summary><div style="margin-top:6px">${steps}</div></details>`
            );
            uwuHistory.add('long-division-calculator', {
                quotient,
                remainder
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('ld-result').innerHTML = '';
        };
    }

    // ── Big Number ────────────────────────────────────────────────────────────

    function renderBigNumber(container) {
        container.innerHTML = `
      <p style="font-size:14px;opacity:0.8;margin-bottom:12px">Performs exact arithmetic on very large integers using BigInt.</p>
      ${field('bn-a','Number A','text','99999999999999999999')}
      ${select('bn-op','Operation',[{v:'+',l:'Add'},{v:'-',l:'Subtract'},{v:'*',l:'Multiply'},{v:'/',l:'Divide (integer)'},{v:'%',l:'Modulo'}])}
      ${field('bn-b','Number B','text','88888888888888888888')}
      ${btn()}
      <div id="bn-result"></div>`;

        window._calcRun = () => {
            try {
                const a = BigInt(document.getElementById('bn-a').value.trim());
                const b = BigInt(document.getElementById('bn-b').value.trim());
                const op = document.getElementById('bn-op').value;
                let res;
                if (op === '+') res = a + b;
                else if (op === '-') res = a - b;
                else if (op === '*') res = a * b;
                else if (op === '/') res = b === 0n ? null : a / b;
                else res = b === 0n ? null : a % b;
                if (res === null) {
                    document.getElementById('bn-result').innerHTML = err('Division by zero.');
                    return;
                }
                document.getElementById('bn-result').innerHTML = result(row('Result', res.toString()));
                uwuHistory.add('big-number-calculator', {
                    digits: res.toString().length
                });
            } catch (e) {
                document.getElementById('bn-result').innerHTML = err('Enter valid integers.');
            }
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('bn-result').innerHTML = '';
        };
    }

    // ── Percent Error ─────────────────────────────────────────────────────────

    function renderPercentError(container) {
        container.innerHTML = `
      ${field('pe-exp','Expected / Theoretical value','number','9.8')}
      ${field('pe-obs','Observed / Experimental value','number','9.6')}
      ${btn()}
      <div id="pe-result"></div>`;

        window._calcRun = () => {
            const exp = parseFloat(document.getElementById('pe-exp').value);
            const obs = parseFloat(document.getElementById('pe-obs').value);
            if (!exp) {
                document.getElementById('pe-result').innerHTML = err('Expected value cannot be zero.');
                return;
            }
            const pe = Math.abs((obs - exp) / exp) * 100;
            document.getElementById('pe-result').innerHTML = result(
                row('Percent Error', fmt(pe, 4) + '%') + row('Absolute Error', fmt(Math.abs(obs - exp), 6)) + row('Relative Error', fmt(Math.abs(obs - exp) / Math.abs(exp), 6))
            );
            uwuHistory.add('percent-error-calculator', {
                error: fmt(pe, 4)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('pe-result').innerHTML = '';
        };
    }

    // ── Sample Size ───────────────────────────────────────────────────────────

    function renderSampleSize(container) {
        container.innerHTML = `
      ${select('ss-ci','Confidence Level',[{v:'1.645',l:'90%'},{v:'1.96',l:'95%'},{v:'2.326',l:'98%'},{v:'2.576',l:'99%'}])}
      ${field('ss-margin','Margin of Error (e.g. 0.05 for 5%)','number','0.05')}
      ${field('ss-p','Population Proportion (0.5 if unknown)','number','0.5')}
      ${field('ss-pop','Population Size (leave blank for infinite)','number','')}
      ${btn()}
      <div id="ss-result"></div>`;

        window._calcRun = () => {
            const z = parseFloat(document.getElementById('ss-ci').value);
            const e = parseFloat(document.getElementById('ss-margin').value);
            const p = parseFloat(document.getElementById('ss-p').value) || 0.5;
            const pop = parseFloat(document.getElementById('ss-pop').value) || Infinity;
            if (!e) {
                document.getElementById('ss-result').innerHTML = err('Enter margin of error.');
                return;
            }
            let n = Math.ceil((z * z * p * (1 - p)) / (e * e));
            if (isFinite(pop)) n = Math.ceil(n * pop / (n + pop - 1));
            document.getElementById('ss-result').innerHTML = result(row('Required Sample Size', n.toLocaleString()));
            uwuHistory.add('sample-size-calculator', {
                size: n
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('ss-result').innerHTML = '';
        };
    }

    // ── Confidence Interval ───────────────────────────────────────────────────

    function renderConfidenceInterval(container) {
        container.innerHTML = `
      ${field('ci-mean','Sample Mean','number','50')}
      ${field('ci-sd','Standard Deviation','number','10')}
      ${field('ci-n','Sample Size','number','100')}
      ${select('ci-cl','Confidence Level',[{v:'1.645',l:'90%'},{v:'1.96',l:'95%'},{v:'2.326',l:'98%'},{v:'2.576',l:'99%'}])}
      ${btn()}
      <div id="ci-result"></div>`;

        window._calcRun = () => {
            const mean = parseFloat(document.getElementById('ci-mean').value);
            const sd = parseFloat(document.getElementById('ci-sd').value);
            const n = parseFloat(document.getElementById('ci-n').value);
            const z = parseFloat(document.getElementById('ci-cl').value);
            if (!sd || !n) {
                document.getElementById('ci-result').innerHTML = err('Enter all values.');
                return;
            }
            const se = sd / Math.sqrt(n);
            const margin = z * se;
            document.getElementById('ci-result').innerHTML = result(
                row('Confidence Interval', `${fmt(mean-margin,4)} to ${fmt(mean+margin,4)}`) +
                row('Margin of Error', `± ${fmt(margin,4)}`) +
                row('Standard Error', fmt(se, 6))
            );
            uwuHistory.add('confidence-interval-calculator', {
                lower: fmt(mean - margin, 4),
                upper: fmt(mean + margin, 4)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('ci-result').innerHTML = '';
        };
    }

    // ── P-value ───────────────────────────────────────────────────────────────

    function renderPValue(container) {
        container.innerHTML = `
      ${select('pv-test','Test Type',[{v:'z',l:'Z-test (large sample)'},{v:'one',l:'One-sided Z-test'}])}
      ${field('pv-z','Z-score (or test statistic)','number','1.96')}
      ${btn()}
      <div id="pv-result"></div>`;

        // Approximate standard normal CDF (Abramowitz & Stegun)
        function normCDF(z) {
            const t = 1 / (1 + 0.2316419 * Math.abs(z));
            const poly = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
            const p = 1 - 0.3989422804 * Math.exp(-0.5 * z * z) * poly;
            return z >= 0 ? p : 1 - p;
        }

        window._calcRun = () => {
            const z = parseFloat(document.getElementById('pv-z').value);
            const test = document.getElementById('pv-test').value;
            if (isNaN(z)) {
                document.getElementById('pv-result').innerHTML = err('Enter z-score.');
                return;
            }
            const p_two = 2 * (1 - normCDF(Math.abs(z)));
            const p_one = 1 - normCDF(Math.abs(z));
            document.getElementById('pv-result').innerHTML = result(
                row('Z-score', fmt(z, 4)) +
                row('Two-tailed p-value', fmt(p_two, 6)) +
                row('One-tailed p-value', fmt(p_one, 6)) +
                row('Significant at α=0.05?', p_two < 0.05 ? 'Yes (two-tailed)' : 'No') +
                row('Significant at α=0.01?', p_two < 0.01 ? 'Yes (two-tailed)' : 'No')
            );
            uwuHistory.add('p-value-calculator', {
                pValue: fmt(p_two, 6)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('pv-result').innerHTML = '';
        };
    }

    // ── Z-score ───────────────────────────────────────────────────────────────

    function renderZScore(container) {
        container.innerHTML = `
      ${field('zs-x','Value (X)','number','75')}
      ${field('zs-mean','Population Mean (μ)','number','70')}
      ${field('zs-sd','Standard Deviation (σ)','number','10')}
      ${btn()}
      <div id="zs-result"></div>`;

        function normCDF(z) {
            const t = 1 / (1 + 0.2316419 * Math.abs(z));
            const poly = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
            const p = 1 - 0.3989422804 * Math.exp(-0.5 * z * z) * poly;
            return z >= 0 ? p : 1 - p;
        }

        window._calcRun = () => {
            const x = parseFloat(document.getElementById('zs-x').value);
            const mean = parseFloat(document.getElementById('zs-mean').value);
            const sd = parseFloat(document.getElementById('zs-sd').value);
            if (!sd) {
                document.getElementById('zs-result').innerHTML = err('SD cannot be zero.');
                return;
            }
            const z = (x - mean) / sd;
            const percentile = normCDF(z) * 100;
            document.getElementById('zs-result').innerHTML = result(
                row('Z-score', fmt(z, 4)) + row('Percentile', fmt(percentile, 2) + '%') + row('Values below', fmt(percentile, 2) + '% of population')
            );
            uwuHistory.add('z-score-calculator', {
                z: fmt(z, 4),
                percentile: fmt(percentile, 2)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('zs-result').innerHTML = '';
        };
    }

    // ── Number Sequence ───────────────────────────────────────────────────────

    function renderNumberSequence(container) {
        container.innerHTML = `
      ${select('ns-type','Sequence Type',[{v:'arith',l:'Arithmetic'},{v:'geo',l:'Geometric'}])}
      ${field('ns-first','First term','number','2')}
      ${field('ns-diff','Common difference / ratio','number','3')}
      ${field('ns-n','Number of terms to show','number','10')}
      ${btn()}
      <div id="ns-result"></div>`;

        window._calcRun = () => {
            const type = document.getElementById('ns-type').value;
            const a = parseFloat(document.getElementById('ns-first').value);
            const d = parseFloat(document.getElementById('ns-diff').value);
            const n = parseInt(document.getElementById('ns-n').value) || 10;
            const terms = [];
            for (let i = 0; i < Math.min(n, 50); i++) {
                terms.push(type === 'arith' ? a + d * i : a * Math.pow(d, i));
            }
            const sum = terms.reduce((a, b) => a + b, 0);
            document.getElementById('ns-result').innerHTML = result(
                row('Terms', terms.map(t => fmt(t, 4)).join(', ')) + row('Sum', fmt(sum, 4)) + row('nth term formula', type === 'arith' ? `a(n) = ${a} + (n−1) × ${d}` : `a(n) = ${a} × ${d}^(n−1)`)
            );
            uwuHistory.add('number-sequence-calculator', {
                sequence: terms.slice(0, 5).join(',')
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('ns-result').innerHTML = '';
        };
    }

    // ── Matrix ────────────────────────────────────────────────────────────────

    function renderMatrix(container) {
        container.innerHTML = `
      ${select('mat-op','Operation',[{v:'add',l:'A + B'},{v:'sub',l:'A − B'},{v:'mul',l:'A × B'},{v:'det',l:'det(A) - 2×2 or 3×3'},{v:'trans',l:'Transpose A'}])}
      <p style="font-size:13px;opacity:0.8;margin-bottom:6px">Matrix A (rows separated by semicolons, values by commas):</p>
      ${field('mat-a','Matrix A','text','1,2;3,4')}
      <div id="mat-b-wrap">
        <p style="font-size:13px;opacity:0.8;margin-bottom:6px">Matrix B:</p>
        ${field('mat-b','Matrix B','text','5,6;7,8')}
      </div>
      ${btn()}
      <div id="mat-result"></div>`;

        document.getElementById('mat-op').addEventListener('change', e => {
            document.getElementById('mat-b-wrap').style.display = ['det', 'trans'].includes(e.target.value) ? 'none' : '';
        });

        function parseMatrix(str) {
            return str.trim().split(';').map(r => r.split(',').map(Number));
        }

        function matToStr(m) {
            return m.map(r => r.map(v => fmt(v, 4)).join('\t')).join('\n');
        }

        window._calcRun = () => {
            const op = document.getElementById('mat-op').value;
            try {
                const A = parseMatrix(document.getElementById('mat-a').value);
                const rows = A.length,
                    cols = A[0].length;
                let res;
                if (op === 'trans') {
                    res = A[0].map((_, i) => A.map(r => r[i]));
                } else if (op === 'det') {
                    if (rows === 2 && cols === 2) {
                        res = [
                            [A[0][0] * A[1][1] - A[0][1] * A[1][0]]
                        ];
                    } else if (rows === 3 && cols === 3) {
                        const d = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
                        res = [
                            [d]
                        ];
                    } else {
                        throw new Error('Det only for 2×2 or 3×3');
                    }
                } else {
                    const B = parseMatrix(document.getElementById('mat-b').value);
                    if (op === 'add') {
                        res = A.map((r, i) => r.map((v, j) => v + B[i][j]));
                    } else if (op === 'sub') {
                        res = A.map((r, i) => r.map((v, j) => v - B[i][j]));
                    } else {
                        res = A.map((r, i) => B[0].map((_, j) => r.reduce((s, _, k) => s + A[i][k] * B[k][j], 0)));
                    }
                }
                document.getElementById('mat-result').innerHTML = result(`<pre style="font-family:monospace;font-size:13px;white-space:pre-wrap">${matToStr(res)}</pre>`);
                uwuHistory.add('matrix-calculator', {
                    op
                });
            } catch (e) {
                document.getElementById('mat-result').innerHTML = err('Check matrix format. Use rows separated by semicolons, values by commas.');
            }
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('mat-result').innerHTML = '';
        };
    }

    // ── Random Number ─────────────────────────────────────────────────────────

    function renderRandomNumber(container) {
        container.innerHTML = `
      ${field('rng-min','Minimum','number','1')}
      ${field('rng-max','Maximum','number','100')}
      ${field('rng-count','How many numbers','number','1')}
      ${select('rng-dup','Allow duplicates',[{v:'yes',l:'Yes'},{v:'no',l:'No (unique)'}])}
      ${btn()}
      <div id="rng-result"></div>`;

        window._calcRun = () => {
            const min = parseInt(document.getElementById('rng-min').value);
            const max = parseInt(document.getElementById('rng-max').value);
            const count = parseInt(document.getElementById('rng-count').value) || 1;
            const dup = document.getElementById('rng-dup').value;
            if (min >= max) {
                document.getElementById('rng-result').innerHTML = err('Min must be less than max.');
                return;
            }
            const range = Array.from({
                length: max - min + 1
            }, (_, i) => min + i);
            let nums;
            if (dup === 'yes') {
                nums = Array.from({
                    length: count
                }, () => Math.floor(Math.random() * (max - min + 1)) + min);
            } else {
                if (count > range.length) {
                    document.getElementById('rng-result').innerHTML = err(`Cannot generate ${count} unique numbers in range ${min}–${max}.`);
                    return;
                }
                const shuffled = [...range].sort(() => Math.random() - 0.5);
                nums = shuffled.slice(0, count);
            }
            document.getElementById('rng-result').innerHTML = result(row('Generated Numbers', nums.join(', ')));
            uwuHistory.add('random-number-generator', {
                numbers: nums.join(',')
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('rng-result').innerHTML = '';
        };
    }

    // ── Half-Life ─────────────────────────────────────────────────────────────

    function renderHalfLife(container) {
        container.innerHTML = `
      ${select('hl-solve','Solve for',[
        {v:'remaining',l:'Remaining quantity'},
        {v:'time',l:'Time elapsed'},
        {v:'halflife',l:'Half-life'}
      ])}
      ${field('hl-initial','Initial quantity','number','1000')}
      <div id="hl-remaining-wrap" style="display:none">${field('hl-remaining','Remaining quantity','number','125')}</div>
      ${field('hl-halflife','Half-life','number','10')}
      ${field('hl-time','Time elapsed','number','30')}
      <div id="hl-unit">
        ${select('hl-unit-sel','Time unit',[{v:'1',l:'Seconds'},{v:'60',l:'Minutes'},{v:'3600',l:'Hours'},{v:'86400',l:'Days'},{v:'31536000',l:'Years'}])}
      </div>
      ${btn()}
      <div id="hl-result"></div>`;

        document.getElementById('hl-solve').addEventListener('change', e => {
            document.getElementById('hl-remaining-wrap').style.display = e.target.value === 'halflife' || e.target.value === 'time' ? '' : 'none';
        });

        window._calcRun = () => {
            const solve = document.getElementById('hl-solve').value;
            const n0 = parseFloat(document.getElementById('hl-initial').value);
            const hl = parseFloat(document.getElementById('hl-halflife').value);
            const t = parseFloat(document.getElementById('hl-time').value);
            const nr = parseFloat(document.getElementById('hl-remaining').value) || 0;
            if (solve === 'remaining') {
                const rem = n0 * Math.pow(0.5, t / hl);
                const decayed = n0 - rem;
                document.getElementById('hl-result').innerHTML = result(row('Remaining', fmt(rem, 4)) + row('Decayed', fmt(decayed, 4)) + row('Fraction remaining', fmt(rem / n0, 6)) + row('Number of half-lives', fmt(t / hl, 4)));
                uwuHistory.add('half-life-calculator', {
                    remaining: fmt(rem, 4)
                });
            } else if (solve === 'time') {
                const time = hl * Math.log2(n0 / nr);
                document.getElementById('hl-result').innerHTML = result(row('Time elapsed', fmt(time, 4)));
                uwuHistory.add('half-life-calculator', {
                    time: fmt(time, 4)
                });
            } else {
                const halflife = -t / Math.log2(nr / n0);
                document.getElementById('hl-result').innerHTML = result(row('Half-life', fmt(halflife, 4)));
                uwuHistory.add('half-life-calculator', {
                    halflife: fmt(halflife, 4)
                });
            }
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('hl-result').innerHTML = '';
        };
    }

    // ── Density ───────────────────────────────────────────────────────────────

    function renderDensity(container) {
        container.innerHTML = `
      ${select('dens-solve','Solve for',[{v:'density',l:'Density (ρ = m/V)'},{v:'mass',l:'Mass (m = ρ × V)'},{v:'volume',l:'Volume (V = m/ρ)'}])}
      ${field('dens-m','Mass (g or kg)','number','500')}
      ${field('dens-v','Volume (cm³ or L)','number','250')}
      ${field('dens-d','Density (g/cm³)','number','2')}
      ${btn()}
      <div id="dens-result"></div>`;

        window._calcRun = () => {
            const solve = document.getElementById('dens-solve').value;
            const m = parseFloat(document.getElementById('dens-m').value);
            const v = parseFloat(document.getElementById('dens-v').value);
            const d = parseFloat(document.getElementById('dens-d').value);
            let res;
            if (solve === 'density') {
                if (!m || !v) {
                    document.getElementById('dens-result').innerHTML = err('Enter mass and volume.');
                    return;
                }
                res = m / v;
                document.getElementById('dens-result').innerHTML = result(row('Density', fmt(res, 6)));
            } else if (solve === 'mass') {
                if (!d || !v) {
                    document.getElementById('dens-result').innerHTML = err('Enter density and volume.');
                    return;
                }
                res = d * v;
                document.getElementById('dens-result').innerHTML = result(row('Mass', fmt(res, 6)));
            } else {
                if (!m || !d) {
                    document.getElementById('dens-result').innerHTML = err('Enter mass and density.');
                    return;
                }
                res = m / d;
                document.getElementById('dens-result').innerHTML = result(row('Volume', fmt(res, 6)));
            }
            uwuHistory.add('density-calculator', {
                result: fmt(res, 6)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('dens-result').innerHTML = '';
        };
    }

    // ── Distance ──────────────────────────────────────────────────────────────

    function renderDistance(container) {
        container.innerHTML = `
      <p style="font-size:14px;opacity:0.8;margin-bottom:12px">Distance between two points in 2D or 3D space.</p>
      ${field('dist-x1','x₁','number','0')}
      ${field('dist-y1','y₁','number','0')}
      ${field('dist-x2','x₂','number','3')}
      ${field('dist-y2','y₂','number','4')}
      ${field('dist-z1','z₁ (optional, 3D)','number','')}
      ${field('dist-z2','z₂ (optional, 3D)','number','')}
      ${btn()}
      <div id="dist-result"></div>`;

        window._calcRun = () => {
            const x1 = parseFloat(document.getElementById('dist-x1').value) || 0;
            const y1 = parseFloat(document.getElementById('dist-y1').value) || 0;
            const x2 = parseFloat(document.getElementById('dist-x2').value) || 0;
            const y2 = parseFloat(document.getElementById('dist-y2').value) || 0;
            const z1 = parseFloat(document.getElementById('dist-z1').value);
            const z2 = parseFloat(document.getElementById('dist-z2').value);
            const is3D = !isNaN(z1) && !isNaN(z2);
            const dist = is3D ? Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2) : Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            const midX = (x1 + x2) / 2,
                midY = (y1 + y2) / 2;
            document.getElementById('dist-result').innerHTML = result(
                row('Distance', fmt(dist, 6)) + row('Midpoint X', fmt(midX, 4)) + row('Midpoint Y', fmt(midY, 4)) + (is3D ? row('Midpoint Z', fmt((z1 + z2) / 2, 4)) : '')
            );
            uwuHistory.add('distance-calculator', {
                distance: fmt(dist, 6)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('dist-result').innerHTML = '';
        };
    }

    // ── Grade ─────────────────────────────────────────────────────────────────

    function renderGrade(container) {
        container.innerHTML = `
      <p style="font-size:14px;opacity:0.8;margin-bottom:12px">Enter scores and weights (leave weight blank for equal weighting).</p>
      ${field('grade-scores','Scores (comma-separated)','text','85,92,78,95')}
      ${field('grade-weights','Weights (comma-separated, optional)','text','')}
      ${btn()}
      <div id="grade-result"></div>`;

        window._calcRun = () => {
            const scores = document.getElementById('grade-scores').value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
            const weightsRaw = document.getElementById('grade-weights').value.trim();
            if (!scores.length) {
                document.getElementById('grade-result').innerHTML = err('Enter scores.');
                return;
            }
            let avg;
            if (weightsRaw) {
                const weights = weightsRaw.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
                const totalW = weights.reduce((a, b) => a + b, 0);
                avg = scores.reduce((a, v, i) => a + v * (weights[i] || 0), 0) / totalW;
            } else {
                avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            }
            let letter = '';
            if (avg >= 90) letter = 'A';
            else if (avg >= 80) letter = 'B';
            else if (avg >= 70) letter = 'C';
            else if (avg >= 60) letter = 'D';
            else letter = 'F';
            document.getElementById('grade-result').innerHTML = result(
                row('Final Grade', fmt(avg, 2) + '%') + row('Letter Grade', letter) + row('Number of scores', scores.length)
            );
            uwuHistory.add('grade-calculator', {
                grade: fmt(avg, 2),
                letter
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('grade-result').innerHTML = '';
        };
    }

    // ── Alias map ─────────────────────────────────────────────────────────────

    const ALIAS = {
        'scientific-calculator': renderScientific,
        'percentage-calculator': renderPercentage,
        'fraction-calculator': renderFraction,
        'average-calculator': renderAverage,
        'statistics-calculator': renderStatistics,
        'standard-deviation-calculator': renderStdDev,
        'mean-median-mode-range-calculator': renderMeanMedianMode,
        'probability-calculator': renderProbability,
        'permutation-and-combination-calculator': renderPermComb,
        'greatest-common-factor-calculator': renderGCF,
        'least-common-multiple-calculator': renderLCM,
        'common-factor-calculator': renderCommonFactor,
        'factor-calculator': renderFactor,
        'prime-factorization-calculator': renderPrimeFactorization,
        'exponent-calculator': renderExponent,
        'root-calculator': renderRoot,
        'log-calculator': renderLog,
        'triangle-calculator': renderTriangle,
        'right-triangle-calculator': renderRightTriangle,
        'pythagorean-theorem-calculator': renderPythagorean,
        'quadratic-formula-calculator': renderQuadratic,
        'area-calculator': renderArea,
        'volume-calculator': renderVolume,
        'surface-area-calculator': renderSurfaceArea,
        'circle-calculator': renderCircle,
        'square-footage-calculator': renderSquareFootage,
        'slope-calculator': renderSlope,
        'ratio-calculator': renderRatio,
        'rounding-calculator': renderRounding,
        'scientific-notation-calculator': renderScientificNotation,
        'long-division-calculator': renderLongDivision,
        'big-number-calculator': renderBigNumber,
        'percent-error-calculator': renderPercentError,
        'sample-size-calculator': renderSampleSize,
        'confidence-interval-calculator': renderConfidenceInterval,
        'p-value-calculator': renderPValue,
        'z-score-calculator': renderZScore,
        'number-sequence-calculator': renderNumberSequence,
        'matrix-calculator': renderMatrix,
        'random-number-generator': renderRandomNumber,
        'half-life-calculator': renderHalfLife,
        'density-calculator': renderDensity,
        'distance-calculator': renderDistance,
        'grade-calculator': renderGrade,
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