// engines/other.js - Other Calculators Engine (stub - full build pending)
// Partial implementations for the 54 "Other" calculators

window.uwuEngineOther = (() => {

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

    // ── Age ───────────────────────────────────────────────────────────────────
    function renderAge(container) {
        container.innerHTML = `
      ${field('age-dob','Date of Birth','date')}
      ${field('age-to','As of date','date','',(new Date()).toISOString().slice(0,10))}
      ${btn()}
      <div id="age-result"></div>`;
        window._calcRun = () => {
            const dob = new Date(document.getElementById('age-dob').value);
            const to = new Date(document.getElementById('age-to').value || (new Date()).toISOString().slice(0, 10));
            if (isNaN(dob)) {
                document.getElementById('age-result').innerHTML = err('Enter date of birth.');
                return;
            }
            let y = to.getFullYear() - dob.getFullYear(),
                m = to.getMonth() - dob.getMonth(),
                d = to.getDate() - dob.getDate();
            if (d < 0) {
                m--;
                d += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
            }
            if (m < 0) {
                y--;
                m += 12;
            }
            const totalDays = Math.floor((to - dob) / 86400000);
            const next = new Date(dob);
            next.setFullYear(to.getFullYear());
            if (next < to) next.setFullYear(to.getFullYear() + 1);
            document.getElementById('age-result').innerHTML = result(
                row('Age', `${y} years, ${m} months, ${d} days`) + row('Total days', totalDays.toLocaleString()) +
                row('Next birthday in', `${Math.ceil((next-to)/86400000)} days`)
            );
            uwuHistory.add('age-calculator', {
                age: `${y}y ${m}m ${d}d`
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('age-result').innerHTML = '';
        };
    }

    // ── Date ──────────────────────────────────────────────────────────────────
    function renderDate(container) {
        container.innerHTML = `
      ${select('date-op','Operation',[{v:'diff',l:'Days between two dates'},{v:'add',l:'Add to date'},{v:'sub',l:'Subtract from date'}])}
      ${field('date-from','Start / Base date','date')}
      <div id="date-to-wrap">${field('date-to','End date','date')}</div>
      <div id="date-delta-wrap" style="display:none">
        ${field('date-dy','Years','number','0')}${field('date-dm','Months','number','0')}${field('date-dd2','Days','number','30')}
      </div>
      ${btn()}
      <div id="date-result"></div>`;
        document.getElementById('date-op').addEventListener('change', e => {
            document.getElementById('date-to-wrap').style.display = e.target.value === 'diff' ? '' : 'none';
            document.getElementById('date-delta-wrap').style.display = e.target.value !== 'diff' ? '' : 'none';
        });
        window._calcRun = () => {
            const op = document.getElementById('date-op').value;
            const fromVal = document.getElementById('date-from').value;
            if (!fromVal) {
                document.getElementById('date-result').innerHTML = err('Enter start date.');
                return;
            }
            const from = new Date(fromVal);
            if (op === 'diff') {
                const to = new Date(document.getElementById('date-to').value);
                const diff = Math.round((to - from) / 86400000);
                document.getElementById('date-result').innerHTML = result(
                    row('Days between', diff.toLocaleString()) + row('Weeks', fmt(diff / 7, 1)) + row('Months (approx)', fmt(diff / 30.44, 1)) + row('Years (approx)', fmt(diff / 365.25, 2))
                );
            } else {
                const dy = parseInt(document.getElementById('date-dy').value) || 0;
                const dm = parseInt(document.getElementById('date-dm').value) || 0;
                const dd = parseInt(document.getElementById('date-dd2').value) || 0;
                const r = new Date(from);
                const sign = op === 'add' ? 1 : -1;
                r.setFullYear(r.getFullYear() + sign * dy);
                r.setMonth(r.getMonth() + sign * dm);
                r.setDate(r.getDate() + sign * dd);
                document.getElementById('date-result').innerHTML = result(row('Result Date', r.toDateString()) + row('ISO', r.toISOString().slice(0, 10)));
            }
            uwuHistory.add('date-calculator', {
                op
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('date-result').innerHTML = '';
        };
    }

    // ── Day Counter ───────────────────────────────────────────────────────────
    function renderDayCounter(container) {
        container.innerHTML = `
      ${field('dc-from','Start Date','date')}${field('dc-to','End Date','date')}
      ${select('dc-include','Include end date?',[{v:'no',l:'No'},{v:'yes',l:'Yes'}])}
      ${btn('Count Days')}<div id="dc-result"></div>`;
        window._calcRun = () => {
            const from = new Date(document.getElementById('dc-from').value);
            const to = new Date(document.getElementById('dc-to').value);
            const inc = document.getElementById('dc-include').value === 'yes' ? 1 : 0;
            if (isNaN(from) || isNaN(to)) {
                document.getElementById('dc-result').innerHTML = err('Enter both dates.');
                return;
            }
            const days = Math.round((to - from) / 86400000) + inc;
            let biz = 0;
            const tmp = new Date(from);
            while (tmp <= to) {
                if (tmp.getDay() !== 0 && tmp.getDay() !== 6) biz++;
                tmp.setDate(tmp.getDate() + 1);
            }
            document.getElementById('dc-result').innerHTML = result(row('Total days', days.toLocaleString()) + row('Business days', biz.toLocaleString()) + row('Weekend days', (days - biz).toLocaleString()));
            uwuHistory.add('day-counter', {
                days
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('dc-result').innerHTML = '';
        };
    }

    // ── Day of the Week ───────────────────────────────────────────────────────
    function renderDayOfWeek(container) {
        container.innerHTML = `${field('dow-date','Date','date')}${btn('Find Day')}<div id="dow-result"></div>`;
        window._calcRun = () => {
            const d = new Date(document.getElementById('dow-date').value);
            if (isNaN(d)) {
                document.getElementById('dow-result').innerHTML = err('Enter a valid date.');
                return;
            }
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            document.getElementById('dow-result').innerHTML = result(row('Day', days[d.getDay()]) + row('Date', d.toDateString()) + row('Day of year', Math.ceil((d - new Date(d.getFullYear(), 0, 1)) / 86400000) + 1));
            uwuHistory.add('day-of-the-week-calculator', {
                day: days[d.getDay()]
            });
        };
        window._calcReset = () => {
            document.getElementById('dow-date').value = '';
            document.getElementById('dow-result').innerHTML = '';
        };
    }

    // ── Time ──────────────────────────────────────────────────────────────────
    function renderTime(container) {
        container.innerHTML = `
      ${select('time-op','Operation',[{v:'add',l:'Add times'},{v:'sub',l:'Subtract times'},{v:'conv',l:'Convert to hours/mins/secs'}])}
      ${field('time-h1','Hours 1','number','2')}${field('time-m1','Minutes 1','number','45')}${field('time-s1','Seconds 1','number','30')}
      <div id="time-2nd">${field('time-h2','Hours 2','number','1')}${field('time-m2','Minutes 2','number','20')}${field('time-s2','Seconds 2','number','15')}</div>
      ${btn()}<div id="time-result"></div>`;
        document.getElementById('time-op').addEventListener('change', e => {
            document.getElementById('time-2nd').style.display = e.target.value !== 'conv' ? '' : 'none';
        });
        window._calcRun = () => {
            const op = document.getElementById('time-op').value;
            const h1 = +document.getElementById('time-h1').value || 0,
                m1 = +document.getElementById('time-m1').value || 0,
                s1 = +document.getElementById('time-s1').value || 0;
            const t1 = h1 * 3600 + m1 * 60 + s1;
            if (op === 'conv') {
                document.getElementById('time-result').innerHTML = result(row('Total seconds', t1) + row('Total minutes', fmt(t1 / 60, 4)) + row('Total hours', fmt(t1 / 3600, 4)));
            } else {
                const h2 = +document.getElementById('time-h2').value || 0,
                    m2 = +document.getElementById('time-m2').value || 0,
                    s2 = +document.getElementById('time-s2').value || 0;
                const t2 = h2 * 3600 + m2 * 60 + s2;
                const res = op === 'add' ? t1 + t2 : t1 - t2;
                const abs = Math.abs(res);
                document.getElementById('time-result').innerHTML = result(row('Result', `${res<0?'-':''}${Math.floor(abs/3600)}h ${Math.floor(abs/60)%60}m ${Math.floor(abs%60)}s`));
            }
            uwuHistory.add('time-calculator', {});
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('time-result').innerHTML = '';
        };
    }

    // ── Time Duration ─────────────────────────────────────────────────────────
    function renderTimeDuration(container) {
        container.innerHTML = `
      ${field('td-start','Start time','time','09:00')}${field('td-end','End time','time','17:30')}
      ${select('td-cross','Cross midnight?',[{v:'no',l:'No'},{v:'yes',l:'Yes'}])}
      ${btn()}<div id="td-result"></div>`;
        window._calcRun = () => {
            const [sh, sm] = document.getElementById('td-start').value.split(':').map(Number);
            const [eh, em] = document.getElementById('td-end').value.split(':').map(Number);
            let mins = (eh * 60 + em) - (sh * 60 + sm);
            if (document.getElementById('td-cross').value === 'yes' || mins < 0) mins += 1440;
            document.getElementById('td-result').innerHTML = result(row('Duration', `${Math.floor(mins/60)}h ${mins%60}m`) + row('Total minutes', mins) + row('Total seconds', mins * 60));
            uwuHistory.add('time-duration-calculator', {
                duration: `${Math.floor(mins/60)}h ${mins%60}m`
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('td-result').innerHTML = '';
        };
    }

    // ── Hours Calculator ──────────────────────────────────────────────────────
    function renderHours(container) {
        container.innerHTML = `
      <p style="font-size:14px;opacity:0.8;margin-bottom:12px">Enter up to 5 days of start/end times.</p>
      <div id="hours-entries">${[...Array(5)].map((_,i)=>`<div style="display:flex;gap:8px;margin-bottom:6px">
        <input type="time" id="hours-s${i}" style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text)">
        <span style="line-height:36px">–</span>
        <input type="time" id="hours-e${i}" style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text)">
      </div>`).join('')}</div>
      ${field('hours-rate','Hourly rate (optional, $)','number','')}
      ${btn()}<div id="hours-result"></div>`;
        window._calcRun = () => {
            let totalMins = 0;
            for (let i = 0; i < 5; i++) {
                const s = document.getElementById(`hours-s${i}`).value,
                    e = document.getElementById(`hours-e${i}`).value;
                if (s && e) {
                    const [sh, sm] = s.split(':').map(Number);
                    const [eh, em] = e.split(':').map(Number);
                    totalMins += (eh * 60 + em) - (sh * 60 + sm);
                }
            }
            const h = Math.floor(totalMins / 60),
                m = totalMins % 60;
            const rate = parseFloat(document.getElementById('hours-rate').value) || 0;
            document.getElementById('hours-result').innerHTML = result(row('Total worked', `${h}h ${m}m`) + row('Total minutes', totalMins) + (rate ? row('Pay', `$${fmt(totalMins/60*rate,2)}`) : ''));
            uwuHistory.add('hours-calculator', {
                hours: `${h}h ${m}m`
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('hours-result').innerHTML = '';
        };
    }

    // ── Time Card ─────────────────────────────────────────────────────────────
    function renderTimeCard(container) {
        container.innerHTML = `
      ${field('tc-in','Clock In','time','09:00')}${field('tc-out','Clock Out','time','17:30')}
      ${field('tc-break','Break (minutes)','number','30')}${field('tc-rate','Hourly rate ($)','number','15')}
      ${btn()}<div id="tc-result"></div>`;
        window._calcRun = () => {
            const [sh, sm] = document.getElementById('tc-in').value.split(':').map(Number);
            const [eh, em] = document.getElementById('tc-out').value.split(':').map(Number);
            const brk = +document.getElementById('tc-break').value || 0;
            const rate = +document.getElementById('tc-rate').value || 0;
            const worked = (eh * 60 + em) - (sh * 60 + sm) - brk;
            document.getElementById('tc-result').innerHTML = result(row('Hours worked', `${Math.floor(worked/60)}h ${worked%60}m`) + (rate ? row('Pay', `$${fmt(worked/60*rate,2)}`) : ''));
            uwuHistory.add('time-card-calculator', {});
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('tc-result').innerHTML = '';
        };
    }

    // ── Time Zone ─────────────────────────────────────────────────────────────
    function renderTimeZone(container) {
        const tzs = [{
            v: 'UTC',
            l: 'UTC'
        }, {
            v: 'America/New_York',
            l: 'US Eastern'
        }, {
            v: 'America/Los_Angeles',
            l: 'US Pacific'
        }, {
            v: 'Europe/London',
            l: 'London'
        }, {
            v: 'Europe/Paris',
            l: 'Paris'
        }, {
            v: 'Asia/Singapore',
            l: 'Singapore'
        }, {
            v: 'Asia/Tokyo',
            l: 'Tokyo'
        }, {
            v: 'Asia/Shanghai',
            l: 'Shanghai'
        }, {
            v: 'Asia/Kolkata',
            l: 'India (IST)'
        }, {
            v: 'Australia/Sydney',
            l: 'Sydney'
        }];
        container.innerHTML = `
      ${field('tz-dt','Date and Time','datetime-local')}
      ${select('tz-from','From timezone',tzs)}${select('tz-to','To timezone',tzs)}
      ${btn('Convert')}<div id="tz-result"></div>`;
        document.getElementById('tz-from').value = 'UTC';
        document.getElementById('tz-to').value = 'Asia/Singapore';
        window._calcRun = () => {
            const dtVal = document.getElementById('tz-dt').value;
            const from = document.getElementById('tz-from').value,
                to = document.getElementById('tz-to').value;
            if (!dtVal) {
                document.getElementById('tz-result').innerHTML = err('Enter date and time.');
                return;
            }
            try {
                const d = new Date(dtVal);
                const toStr = d.toLocaleString('en-US', {
                    timeZone: to,
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
                document.getElementById('tz-result').innerHTML = result(row('Converted time', toStr) + row('From timezone', from) + row('To timezone', to));
                uwuHistory.add('time-zone-calculator', {
                    from,
                    to
                });
            } catch (e) {
                document.getElementById('tz-result').innerHTML = err('Conversion error.');
            }
        };
        window._calcReset = () => {
            document.getElementById('tz-dt').value = '';
            document.getElementById('tz-result').innerHTML = '';
        };
    }

    // ── Conversion ────────────────────────────────────────────────────────────
    function renderConversion(container) {
        const categories = {
            Length: {
                m: 1,
                km: 1000,
                cm: 0.01,
                mm: 0.001,
                mi: 1609.344,
                ft: 0.3048,
                in: 0.0254,
                yd: 0.9144
            },
            Weight: {
                kg: 1,
                g: 0.001,
                lb: 0.453592,
                oz: 0.028350,
                st: 6.35029,
                t: 1000
            },
            Area: {
                m2: 1,
                km2: 1e6,
                ha: 10000,
                acre: 4046.856,
                ft2: 0.092903
            },
            Volume: {
                L: 1,
                mL: 0.001,
                m3: 1000,
                gal: 3.78541,
                qt: 0.946353,
                fl_oz: 0.029574
            },
            Speed: {
                ms: 1,
                kmh: 0.277778,
                mph: 0.44704,
                kn: 0.514444
            },
            Data: {
                B: 1,
                KB: 1024,
                MB: 1048576,
                GB: 1073741824,
                TB: 1099511627776
            },
            Energy: {
                J: 1,
                kJ: 1000,
                cal: 4.184,
                kcal: 4184,
                kWh: 3600000,
                BTU: 1055.06
            },
            Pressure: {
                Pa: 1,
                kPa: 1000,
                bar: 100000,
                atm: 101325,
                psi: 6894.76
            }
        };
        const catNames = Object.keys(categories);

        function buildOpts(cat) {
            return Object.keys(categories[cat]).map(v => ({
                v,
                l: v
            }));
        }
        container.innerHTML = `
      ${select('conv-cat','Category',catNames.map(c=>({v:c,l:c})))}
      ${field('conv-val','Value','number','1')}
      <div id="conv-from-wrap"></div><div id="conv-to-wrap"></div>
      ${btn('Convert')}<div id="conv-result"></div>`;

        function updateSelects() {
            const cat = document.getElementById('conv-cat').value,
                opts = buildOpts(cat);
            const mkSel = (id, label) => `<div class="calc-field"><label for="${id}">${label}</label><select id="${id}">${opts.map(o=>`<option value="${o.v}">${o.l}</option>`).join('')}</select></div>`;
            document.getElementById('conv-from-wrap').innerHTML = mkSel('conv-from', 'From');
            document.getElementById('conv-to-wrap').innerHTML = mkSel('conv-to', 'To');
            if (document.getElementById('conv-to') && opts.length > 1) document.getElementById('conv-to').selectedIndex = 1;
        }
        updateSelects();
        document.getElementById('conv-cat').addEventListener('change', updateSelects);
        window._calcRun = () => {
            const cat = document.getElementById('conv-cat').value,
                val = parseFloat(document.getElementById('conv-val').value);
            const from = document.getElementById('conv-from').value,
                to = document.getElementById('conv-to').value;
            if (isNaN(val)) {
                document.getElementById('conv-result').innerHTML = err('Enter a value.');
                return;
            }
            if (cat === 'Temperature') {
                let c;
                if (from === 'C') c = val;
                else if (from === 'F') c = (val - 32) * 5 / 9;
                else c = val - 273.15;
                let res;
                if (to === 'C') res = c;
                else if (to === 'F') res = c * 9 / 5 + 32;
                else res = c + 273.15;
                document.getElementById('conv-result').innerHTML = result(row(`${val} ${from}`, `${Number(res).toPrecision(8)} ${to}`));
            } else {
                const res = val * categories[cat][from] / categories[cat][to];
                document.getElementById('conv-result').innerHTML = result(row(`${val} ${from}`, `${Number(res).toPrecision(8)} ${to}`));
            }
            uwuHistory.add('conversion-calculator', {
                from,
                to
            });
        };
        window._calcReset = () => {
            document.getElementById('conv-val').value = '';
            document.getElementById('conv-result').innerHTML = '';
        };
    }

    // ── Tip ───────────────────────────────────────────────────────────────────
    function renderTip(container) {
        container.innerHTML = `${field('tip-bill','Bill amount ($)','number','50')}${field('tip-pct','Tip %','number','15')}${field('tip-ppl','People','number','2')}${btn()}<div id="tip-result"></div>`;
        window._calcRun = () => {
            const bill = +document.getElementById('tip-bill').value || 0,
                pct = +document.getElementById('tip-pct').value || 15,
                ppl = +document.getElementById('tip-ppl').value || 1;
            const tip = bill * pct / 100,
                total = bill + tip;
            document.getElementById('tip-result').innerHTML = result(row('Tip', `$${fmt(tip,2)}`) + row('Total', `$${fmt(total,2)}`) + row(`Per person (${ppl})`, `$${fmt(total/ppl,2)}`));
            uwuHistory.add('tip-calculator', {
                total: fmt(total, 2)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('tip-result').innerHTML = '';
        };
    }

    // ── GPA ───────────────────────────────────────────────────────────────────
    function renderGPA(container) {
        container.innerHTML = `
      <div id="gpa-rows">${[...Array(5)].map((_,i)=>`<div style="display:flex;gap:8px;margin-bottom:6px">
        <select id="gpa-g${i}" style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text)">
          <option value="4.0">A</option><option value="3.7">A-</option><option value="3.3">B+</option><option value="3.0">B</option><option value="2.7">B-</option><option value="2.3">C+</option><option value="2.0">C</option><option value="1.0">D</option><option value="0.0">F</option>
        </select>
        <input type="number" id="gpa-c${i}" placeholder="Credits" value="${i<3?3:''}" style="flex:1;padding:8px;border-radius:6px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text)">
      </div>`).join('')}</div>
      ${btn('Calculate GPA')}<div id="gpa-result"></div>`;
        window._calcRun = () => {
            let pts = 0,
                creds = 0;
            for (let i = 0; i < 5; i++) {
                const g = +document.getElementById(`gpa-g${i}`).value,
                    c = +document.getElementById(`gpa-c${i}`).value || 0;
                if (c > 0) {
                    pts += g * c;
                    creds += c;
                }
            }
            if (!creds) {
                document.getElementById('gpa-result').innerHTML = err('Enter at least one course.');
                return;
            }
            const gpa = pts / creds;
            const letter = gpa >= 3.7 ? 'A' : gpa >= 3.3 ? 'A-/B+' : gpa >= 3.0 ? 'B' : gpa >= 2.7 ? 'B-' : gpa >= 2.0 ? 'C' : gpa >= 1.0 ? 'D' : 'F';
            document.getElementById('gpa-result').innerHTML = result(row('GPA', fmt(gpa, 3)) + row('Letter', letter) + row('Total credits', creds));
            uwuHistory.add('gpa-calculator', {
                gpa: fmt(gpa, 3)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('gpa-result').innerHTML = '';
        };
    }

    // ── Concrete ──────────────────────────────────────────────────────────────
    function renderConcrete(container) {
        container.innerHTML = `${field('conc-l','Length (ft)','number','10')}${field('conc-w','Width (ft)','number','10')}${field('conc-d','Depth (inches)','number','4')}${btn()}<div id="conc-result"></div>`;
        window._calcRun = () => {
            const l = +document.getElementById('conc-l').value,
                w = +document.getElementById('conc-w').value,
                d = +document.getElementById('conc-d').value / 12;
            const yd3 = (l * w * d) / 27;
            document.getElementById('conc-result').innerHTML = result(row('Volume', `${fmt(yd3,3)} cubic yards`) + row('Volume', `${fmt(yd3*27,2)} cubic feet`) + row('60-lb bags (est.)', Math.ceil(yd3 / 0.017)) + row('80-lb bags (est.)', Math.ceil(yd3 / 0.022)));
            uwuHistory.add('concrete-calculator', {
                volume: fmt(yd3, 3)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('conc-result').innerHTML = '';
        };
    }

    // ── Gravel ────────────────────────────────────────────────────────────────
    function renderGravel(container) {
        container.innerHTML = `${field('grav-l','Length (ft)','number','20')}${field('grav-w','Width (ft)','number','10')}${field('grav-d','Depth (inches)','number','3')}${select('grav-mat','Material',[{v:'1.5',l:'Gravel'},{v:'1.8',l:'Sand'},{v:'2.0',l:'Crushed stone'},{v:'0.7',l:'Mulch'}])}${btn()}<div id="grav-result"></div>`;
        window._calcRun = () => {
            const yd3 = (+document.getElementById('grav-l').value * +document.getElementById('grav-w').value * (+document.getElementById('grav-d').value / 12)) / 27;
            const tons = yd3 * +document.getElementById('grav-mat').value;
            document.getElementById('grav-result').innerHTML = result(row('Volume', `${fmt(yd3,3)} cubic yards`) + row('Weight', `${fmt(tons,2)} tons`));
            uwuHistory.add('gravel-calculator', {
                volume: fmt(yd3, 3)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('grav-result').innerHTML = '';
        };
    }

    // ── Mulch ─────────────────────────────────────────────────────────────────
    function renderMulch(container) {
        container.innerHTML = `${field('mulch-l','Length (ft)','number','15')}${field('mulch-w','Width (ft)','number','10')}${field('mulch-d','Depth (inches)','number','3')}${btn()}<div id="mulch-result"></div>`;
        window._calcRun = () => {
            const ft3 = +document.getElementById('mulch-l').value * +document.getElementById('mulch-w').value * (+document.getElementById('mulch-d').value / 12);
            document.getElementById('mulch-result').innerHTML = result(row('Volume', `${fmt(ft3,2)} cubic feet`) + row('Volume', `${fmt(ft3/27,3)} cubic yards`) + row('2 cu ft bags', Math.ceil(ft3 / 2)));
            uwuHistory.add('mulch-calculator', {
                volume: fmt(ft3, 2)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('mulch-result').innerHTML = '';
        };
    }

    // ── Roofing ───────────────────────────────────────────────────────────────
    function renderRoofing(container) {
        container.innerHTML = `${field('roof-l','Length (ft)','number','40')}${field('roof-w','Width (ft)','number','25')}${select('roof-pitch','Pitch factor',[{v:'1.0',l:'Flat (1/12)'},{v:'1.031',l:'3/12'},{v:'1.083',l:'5/12'},{v:'1.118',l:'6/12'},{v:'1.202',l:'8/12'}])}${field('roof-waste','Waste %','number','10')}${btn()}<div id="roof-result"></div>`;
        window._calcRun = () => {
            const area = +document.getElementById('roof-l').value * +document.getElementById('roof-w').value * +document.getElementById('roof-pitch').value;
            const withWaste = area * (1 + (+document.getElementById('roof-waste').value) / 100);
            document.getElementById('roof-result').innerHTML = result(row('Roof area', `${fmt(area,0)} sq ft`) + row('With waste', `${fmt(withWaste,0)} sq ft`) + row('Roofing squares', fmt(withWaste / 100, 2)));
            uwuHistory.add('roofing-calculator', {
                area: fmt(area, 0)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('roof-result').innerHTML = '';
        };
    }

    // ── Tile ──────────────────────────────────────────────────────────────────
    function renderTile(container) {
        container.innerHTML = `${field('tile-rl','Room length (ft)','number','12')}${field('tile-rw','Room width (ft)','number','10')}${field('tile-tl','Tile length (in)','number','12')}${field('tile-tw','Tile width (in)','number','12')}${field('tile-waste','Waste %','number','10')}${field('tile-price','Price per tile ($)','number','')}${btn()}<div id="tile-result"></div>`;
        window._calcRun = () => {
            const ra = +document.getElementById('tile-rl').value * +document.getElementById('tile-rw').value;
            const ta = (+document.getElementById('tile-tl').value / 12) * (+document.getElementById('tile-tw').value / 12);
            const waste = +document.getElementById('tile-waste').value || 10;
            const price = +document.getElementById('tile-price').value || 0;
            const n = Math.ceil(ra / ta * (1 + waste / 100));
            document.getElementById('tile-result').innerHTML = result(row('Tiles needed', n) + (price ? row('Total cost', `$${fmt(n*price,2)}`) : ''));
            uwuHistory.add('tile-calculator', {
                tiles: n
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('tile-result').innerHTML = '';
        };
    }

    // ── Stair ─────────────────────────────────────────────────────────────────
    function renderStair(container) {
        container.innerHTML = `${field('stair-h','Total rise (inches)','number','96')}${field('stair-riser','Desired riser height (inches)','number','7')}${btn()}<div id="stair-result"></div>`;
        window._calcRun = () => {
            const h = +document.getElementById('stair-h').value,
                riser = +document.getElementById('stair-riser').value || 7;
            const n = Math.round(h / riser),
                actual = h / n,
                tread = 10,
                run = n * tread;
            document.getElementById('stair-result').innerHTML = result(row('Number of risers', n) + row('Actual riser height', `${fmt(actual,3)}"`) + row('Total run', `${run}"`) + row('Stringer length', `${fmt(Math.sqrt(h*h+run*run),1)}"`));
            uwuHistory.add('stair-calculator', {
                risers: n
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('stair-result').innerHTML = '';
        };
    }

    // ── Fuel Cost ─────────────────────────────────────────────────────────────
    function renderFuelCost(container) {
        container.innerHTML = `${field('fuel-d','Distance (km)','number','500')}${field('fuel-eff','Fuel efficiency (L/100km)','number','8')}${field('fuel-price','Price per litre ($)','number','2.00')}${btn()}<div id="fuel-result"></div>`;
        window._calcRun = () => {
            const d = +document.getElementById('fuel-d').value,
                eff = +document.getElementById('fuel-eff').value,
                price = +document.getElementById('fuel-price').value;
            const litres = d * eff / 100,
                cost = litres * price;
            document.getElementById('fuel-result').innerHTML = result(row('Fuel needed', `${fmt(litres,2)} L`) + row('Total cost', `$${fmt(cost,2)}`) + row('Cost per km', `$${fmt(cost/d,4)}`));
            uwuHistory.add('fuel-cost-calculator', {
                cost: fmt(cost, 2)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('fuel-result').innerHTML = '';
        };
    }

    // ── Gas Mileage ───────────────────────────────────────────────────────────
    function renderGasMileage(container) {
        container.innerHTML = `${select('mpg-unit','Unit',[{v:'mpg',l:'MPG (miles/gallons)'},{v:'lp100',l:'L/100km'}])}${field('mpg-dist','Distance','number','300')}${field('mpg-fuel','Fuel used','number','10')}${btn()}<div id="mpg-result"></div>`;
        window._calcRun = () => {
            const unit = document.getElementById('mpg-unit').value,
                d = +document.getElementById('mpg-dist').value,
                f = +document.getElementById('mpg-fuel').value;
            if (!d || !f) {
                document.getElementById('mpg-result').innerHTML = err('Enter distance and fuel.');
                return;
            }
            if (unit === 'mpg') {
                const mpg = d / f;
                document.getElementById('mpg-result').innerHTML = result(row('Fuel efficiency', `${fmt(mpg,2)} MPG`) + row('L/100km', `${fmt(235.215/mpg,2)}`));
            } else {
                const lp = f / d * 100;
                document.getElementById('mpg-result').innerHTML = result(row('Fuel efficiency', `${fmt(lp,2)} L/100km`) + row('MPG', fmt(235.215 / lp, 2)));
            }
            uwuHistory.add('gas-mileage-calculator', {});
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('mpg-result').innerHTML = '';
        };
    }

    // ── Mileage / Speed ───────────────────────────────────────────────────────
    function renderMileage(container) {
        container.innerHTML = `${select('mil-solve','Solve for',[{v:'distance',l:'Distance'},{v:'time',l:'Time'},{v:'speed',l:'Speed'}])}${field('mil-speed','Speed (km/h)','number','100')}${field('mil-time','Time (hours)','number','3')}${field('mil-dist','Distance (km)','number','300')}${btn()}<div id="mil-result"></div>`;
        window._calcRun = () => {
            const s = +document.getElementById('mil-speed').value,
                t = +document.getElementById('mil-time').value,
                d = +document.getElementById('mil-dist').value;
            const solve = document.getElementById('mil-solve').value;
            if (solve === 'distance') document.getElementById('mil-result').innerHTML = result(row('Distance', `${fmt(s*t,2)} km`));
            else if (solve === 'time') document.getElementById('mil-result').innerHTML = result(row('Time', `${fmt(d/s,4)} hours`));
            else document.getElementById('mil-result').innerHTML = result(row('Speed', `${fmt(d/t,2)} km/h`));
            uwuHistory.add('mileage-calculator', {});
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('mil-result').innerHTML = '';
        };
    }

    function renderSpeed(container) {
        renderMileage(container);
    }

    // ── BTU ───────────────────────────────────────────────────────────────────
    function renderBTU(container) {
        container.innerHTML = `${field('btu-area','Room area (sq ft)','number','300')}${select('btu-ins','Insulation',[{v:'0.7',l:'Poor'},{v:'1.0',l:'Average'},{v:'1.3',l:'Good'}])}${btn()}<div id="btu-result"></div>`;
        window._calcRun = () => {
            const btu = Math.round(+document.getElementById('btu-area').value * 20 * +document.getElementById('btu-ins').value);
            document.getElementById('btu-result').innerHTML = result(row('Required BTU/hr', btu.toLocaleString()) + row('Tonnage', fmt(btu / 12000, 2)) + row('kW', fmt(btu * 0.000293071, 2)));
            uwuHistory.add('btu-calculator', {
                btu
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('btu-result').innerHTML = '';
        };
    }

    // ── Electricity ───────────────────────────────────────────────────────────
    function renderElectricity(container) {
        container.innerHTML = `${field('elec-w','Power (Watts)','number','1000')}${field('elec-h','Hours/day','number','8')}${field('elec-rate','Rate ($/kWh)','number','0.12')}${btn()}<div id="elec-result"></div>`;
        window._calcRun = () => {
            const w = +document.getElementById('elec-w').value,
                h = +document.getElementById('elec-h').value,
                rate = +document.getElementById('elec-rate').value;
            const daily = w * h / 1000,
                monthly = daily * 30;
            document.getElementById('elec-result').innerHTML = result(row('Daily', `${fmt(daily,3)} kWh`) + row('Monthly', `${fmt(monthly,2)} kWh`) + (rate ? row('Monthly cost', `$${fmt(monthly*rate,2)}`) : ''));
            uwuHistory.add('electricity-calculator', {
                monthly: fmt(monthly, 2)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('elec-result').innerHTML = '';
        };
    }

    // ── Bandwidth ─────────────────────────────────────────────────────────────
    function renderBandwidth(container) {
        container.innerHTML = `${field('bw-size','File size','number','1')}${select('bw-su','Unit',[{v:'1048576',l:'MB'},{v:'1073741824',l:'GB'},{v:'1',l:'Bytes'},{v:'1024',l:'KB'}])}${field('bw-speed','Speed (Mbps)','number','100')}${btn()}<div id="bw-result"></div>`;
        window._calcRun = () => {
            const bytes = +document.getElementById('bw-size').value * +document.getElementById('bw-su').value;
            const bps = +document.getElementById('bw-speed').value * 125000;
            const secs = bytes / bps;
            document.getElementById('bw-result').innerHTML = result(row('Download time', secs < 60 ? `${fmt(secs,2)}s` : secs < 3600 ? `${fmt(secs/60,2)} min` : `${fmt(secs/3600,2)} hrs`));
            uwuHistory.add('bandwidth-calculator', {});
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('bw-result').innerHTML = '';
        };
    }

    // ── IP Subnet ─────────────────────────────────────────────────────────────
    function renderIPSubnet(container) {
        container.innerHTML = `${field('ip-addr','IP Address','text','192.168.1.0')}${select('ip-cidr','CIDR',[{v:'8',l:'/8'},{v:'16',l:'/16'},{v:'24',l:'/24'},{v:'25',l:'/25'},{v:'26',l:'/26'},{v:'27',l:'/27'},{v:'28',l:'/28'},{v:'29',l:'/29'},{v:'30',l:'/30'}])}${btn('Calculate')}<div id="ip-result"></div>`;
        window._calcRun = () => {
            const parts = document.getElementById('ip-addr').value.trim().split('.').map(Number);
            const cidr = parseInt(document.getElementById('ip-cidr').value);
            if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
                document.getElementById('ip-result').innerHTML = err('Enter a valid IPv4 address.');
                return;
            }
            const ipNum = parts.reduce((a, b) => (a << 8) + b, 0) >>> 0;
            const mask = (cidr === 0 ? 0 : ~((1 << (32 - cidr)) - 1)) >>> 0;
            const network = (ipNum & mask) >>> 0,
                broadcast = (network | (~mask >>> 0)) >>> 0;
            const toIP = n => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
            const toMask = m => toIP(m);
            document.getElementById('ip-result').innerHTML = result(row('Network', toIP(network)) + row('Broadcast', toIP(broadcast)) + row('Subnet mask', toMask(mask)) + row('First host', toIP(network + 1)) + row('Last host', toIP(broadcast - 1)) + row('Usable hosts', (broadcast - network - 1).toLocaleString()));
            uwuHistory.add('ip-subnet-calculator', {
                network: toIP(network)
            });
        };
        window._calcReset = () => {
            document.getElementById('ip-addr').value = '';
            document.getElementById('ip-result').innerHTML = '';
        };
    }

    // ── Ohm's Law ─────────────────────────────────────────────────────────────
    function renderOhmsLaw(container) {
        container.innerHTML = `<p style="font-size:14px;opacity:0.8;margin-bottom:12px">Enter any 2 values; leave the unknown blank.</p>${field('ohm-v','Voltage (V)','number','')}${field('ohm-i','Current (A)','number','')}${field('ohm-r','Resistance (Ω)','number','')}${btn()}<div id="ohm-result"></div>`;
        window._calcRun = () => {
            const v = parseFloat(document.getElementById('ohm-v').value),
                i = parseFloat(document.getElementById('ohm-i').value),
                r = parseFloat(document.getElementById('ohm-r').value);
            let resV = v,
                resI = i,
                resR = r;
            if (isNaN(v) && !isNaN(i) && !isNaN(r)) resV = i * r;
            else if (isNaN(i) && !isNaN(v) && !isNaN(r)) resI = v / r;
            else if (isNaN(r) && !isNaN(v) && !isNaN(i)) resR = v / i;
            else {
                document.getElementById('ohm-result').innerHTML = err('Enter exactly 2 values.');
                return;
            }
            const P = resV * resI;
            document.getElementById('ohm-result').innerHTML = result(row('Voltage', `${fmt(resV,4)} V`) + row('Current', `${fmt(resI,4)} A`) + row('Resistance', `${fmt(resR,4)} Ω`) + row('Power', `${fmt(P,4)} W`));
            uwuHistory.add('ohms-law-calculator', {
                V: fmt(resV, 4),
                I: fmt(resI, 4),
                R: fmt(resR, 4)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('ohm-result').innerHTML = '';
        };
    }

    // ── Voltage Drop ──────────────────────────────────────────────────────────
    function renderVoltageDrop(container) {
        container.innerHTML = `${field('vd-v','Source voltage (V)','number','120')}${field('vd-i','Current (A)','number','15')}${field('vd-len','Wire length (ft, one-way)','number','50')}${select('vd-awg','Wire gauge (AWG)',[{v:'0.000328',l:'10 AWG'},{v:'0.000521',l:'12 AWG'},{v:'0.000829',l:'14 AWG'},{v:'0.001320',l:'16 AWG'},{v:'0.002100',l:'18 AWG'}])}${btn()}<div id="vd-result"></div>`;
        window._calcRun = () => {
            const V = +document.getElementById('vd-v').value,
                I = +document.getElementById('vd-i').value,
                len = +document.getElementById('vd-len').value;
            const ohmsPerFt = +document.getElementById('vd-awg').value;
            const drop = 2 * len * ohmsPerFt * I;
            const pct = drop / V * 100;
            document.getElementById('vd-result').innerHTML = result(row('Voltage drop', `${fmt(drop,3)} V`) + row('Percentage', `${fmt(pct,2)}%`) + row('Receiving end voltage', `${fmt(V-drop,3)} V`) + row(pct > 3 ? 'Warning' : 'Status', pct > 3 ? 'Exceeds 3% recommended limit' : 'Within acceptable range'));
            uwuHistory.add('voltage-drop-calculator', {
                drop: fmt(drop, 3)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('vd-result').innerHTML = '';
        };
    }

    // ── Resistor ──────────────────────────────────────────────────────────────
    function renderResistor(container) {
        const bands = {
            black: 0,
            brown: 1,
            red: 2,
            orange: 3,
            yellow: 4,
            green: 5,
            blue: 6,
            violet: 7,
            grey: 8,
            white: 9
        };
        const mults = {
            black: 1,
            brown: 10,
            red: 100,
            orange: 1000,
            yellow: 10000,
            green: 100000,
            blue: 1000000,
            gold: 0.1,
            silver: 0.01
        };
        const tols = {
            brown: '±1%',
            red: '±2%',
            gold: '±5%',
            silver: '±10%',
            none: '±20%'
        };
        const colorOpts = Object.keys(bands).map(c => ({
            v: c,
            l: c.charAt(0).toUpperCase() + c.slice(1)
        }));
        const multOpts = Object.keys(mults).map(c => ({
            v: c,
            l: c.charAt(0).toUpperCase() + c.slice(1)
        }));
        const tolOpts = Object.keys(tols).map(c => ({
            v: c,
            l: tols[c] + ' (' + c + ')'
        }));
        container.innerHTML = `<p style="font-size:14px;opacity:0.8;margin-bottom:12px">4-band resistor colour code calculator.</p>${select('res-b1','Band 1 (1st digit)',colorOpts)}${select('res-b2','Band 2 (2nd digit)',colorOpts)}${select('res-mult','Band 3 (Multiplier)',multOpts)}${select('res-tol','Band 4 (Tolerance)',tolOpts)}${btn('Decode')}<div id="res-result"></div>`;
        document.getElementById('res-b2').value = 'brown';
        document.getElementById('res-mult').value = 'red';
        document.getElementById('res-tol').value = 'gold';
        window._calcRun = () => {
            const b1 = bands[document.getElementById('res-b1').value];
            const b2 = bands[document.getElementById('res-b2').value];
            const mult = mults[document.getElementById('res-mult').value];
            const tol = tols[document.getElementById('res-tol').value];
            const ohms = (b1 * 10 + b2) * mult;
            const display = ohms >= 1000000 ? `${fmt(ohms/1000000,3)} MΩ` : ohms >= 1000 ? `${fmt(ohms/1000,3)} kΩ` : `${fmt(ohms,3)} Ω`;
            document.getElementById('res-result').innerHTML = result(row('Resistance', display) + row('Tolerance', tol));
            uwuHistory.add('resistor-calculator', {
                resistance: display
            });
        };
        window._calcReset = () => {
            document.getElementById('res-result').innerHTML = '';
        };
    }

    // ── Horsepower ────────────────────────────────────────────────────────────
    function renderHorsepower(container) {
        container.innerHTML = `${select('hp-type','Calculate',[{v:'mech',l:'Mechanical HP (torque × RPM)'},{v:'elec',l:'Electrical HP (V × A × eff)'}])}${field('hp-torque','Torque (lb-ft)','number','200')}${field('hp-rpm','RPM','number','3000')}${field('hp-v','Voltage (V)','number','120')}${field('hp-a','Current (A)','number','10')}${field('hp-eff','Efficiency (0-1)','number','0.85')}${btn()}<div id="hp-result"></div>`;
        window._calcRun = () => {
            const type = document.getElementById('hp-type').value;
            if (type === 'mech') {
                const t = +document.getElementById('hp-torque').value,
                    rpm = +document.getElementById('hp-rpm').value;
                const hp = t * rpm / 5252;
                document.getElementById('hp-result').innerHTML = result(row('Horsepower', `${fmt(hp,2)} HP`) + row('Kilowatts', `${fmt(hp*0.7457,2)} kW`));
            } else {
                const v = +document.getElementById('hp-v').value,
                    a = +document.getElementById('hp-a').value,
                    eff = +document.getElementById('hp-eff').value;
                const hp = (v * a * eff) / 746;
                document.getElementById('hp-result').innerHTML = result(row('Horsepower', `${fmt(hp,3)} HP`) + row('Watts', `${fmt(v*a*eff,1)} W`));
            }
            uwuHistory.add('horsepower-calculator', {});
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('hp-result').innerHTML = '';
        };
    }

    // ── Engine Horsepower ─────────────────────────────────────────────────────
    function renderEngineHorsepower(container) {
        container.innerHTML = `${field('ehp-trap','Trap speed (mph)','number','100')}${field('ehp-weight','Vehicle weight (lb)','number','3000')}${btn()}<div id="ehp-result"></div>`;
        window._calcRun = () => {
            const s = +document.getElementById('ehp-trap').value,
                w = +document.getElementById('ehp-weight').value;
            const hp = Math.pow(s / 234, 3) * w;
            document.getElementById('ehp-result').innerHTML = result(row('Estimated HP (trap speed method)', `${fmt(hp,0)} HP`));
            uwuHistory.add('engine-horsepower-calculator', {
                hp: fmt(hp, 0)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('ehp-result').innerHTML = '';
        };
    }

    // ── Tire Size ─────────────────────────────────────────────────────────────
    function renderTireSize(container) {
        container.innerHTML = `<p style="font-size:14px;opacity:0.8;margin-bottom:12px">Compare stock vs new tire. Format: width/aspect-ratio/rim (e.g. 225/45/17)</p>${field('tire-stock','Stock tire','text','225/45/17')}${field('tire-new','New tire','text','235/40/17')}${btn('Compare')}<div id="tire-result"></div>`;

        function parseTire(s) {
            const [w, a, r] = s.split('/').map(Number);
            const od = r * 25.4 + 2 * (w * a / 100);
            return {
                od,
                w,
                a,
                r
            };
        }
        window._calcRun = () => {
            try {
                const stock = parseTire(document.getElementById('tire-stock').value);
                const n = parseTire(document.getElementById('tire-new').value);
                const pctDiff = (n.od - stock.od) / stock.od * 100;
                const speedoErr = pctDiff; // speedometer reads low by same %
                document.getElementById('tire-result').innerHTML = result(
                    row('Stock diameter', `${fmt(stock.od,1)} mm`) + row('New diameter', `${fmt(n.od,1)} mm`) +
                    row('Difference', `${fmt(n.od-stock.od,1)} mm (${fmt(pctDiff,2)}%)`) +
                    row('Speedometer error', pctDiff > 0 ? `Reads ${fmt(speedoErr,2)}% low` : `Reads ${fmt(-speedoErr,2)}% high`)
                );
                uwuHistory.add('tire-size-calculator', {
                    diff: fmt(pctDiff, 2)
                });
            } catch (e) {
                document.getElementById('tire-result').innerHTML = err('Enter tires in format: 225/45/17');
            }
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('tire-result').innerHTML = '';
        };
    }

    // ── Molecular Weight ──────────────────────────────────────────────────────
    function renderMolecularWeight(container) {
        const elements = {
            H: 1.008,
            He: 4.003,
            Li: 6.941,
            Be: 9.012,
            B: 10.811,
            C: 12.011,
            N: 14.007,
            O: 15.999,
            F: 18.998,
            Ne: 20.180,
            Na: 22.990,
            Mg: 24.305,
            Al: 26.982,
            Si: 28.086,
            P: 30.974,
            S: 32.065,
            Cl: 35.453,
            Ar: 39.948,
            K: 39.098,
            Ca: 40.078,
            Fe: 55.845,
            Cu: 63.546,
            Zn: 65.38,
            Ag: 107.868,
            I: 126.904,
            Au: 196.967
        };
        container.innerHTML = `${field('mw-formula','Chemical formula (e.g. H2O, C6H12O6)','text','H2O')}${btn('Calculate')}<div id="mw-result"></div>`;
        window._calcRun = () => {
            const formula = document.getElementById('mw-formula').value.trim();
            let mw = 0,
                breakdown = '';
            const regex = /([A-Z][a-z]?)(\d*)/g;
            let m;
            while ((m = regex.exec(formula)) !== null) {
                const el = m[1],
                    count = parseInt(m[2]) || 1;
                if (!elements[el]) {
                    document.getElementById('mw-result').innerHTML = err(`Unknown element: ${el}`);
                    return;
                }
                mw += elements[el] * count;
                breakdown += `${el}×${count}(${elements[el]}) `;
            }
            document.getElementById('mw-result').innerHTML = result(row('Molecular weight', `${fmt(mw,4)} g/mol`) + row('Formula', formula) + row('Breakdown', breakdown.trim()));
            uwuHistory.add('molecular-weight-calculator', {
                mw: fmt(mw, 4)
            });
        };
        window._calcReset = () => {
            document.getElementById('mw-formula').value = '';
            document.getElementById('mw-result').innerHTML = '';
        };
    }

    // ── Molarity ──────────────────────────────────────────────────────────────
    function renderMolarity(container) {
        container.innerHTML = `${select('mol-solve','Solve for',[{v:'M',l:'Molarity (M)'},{v:'n',l:'Moles (n)'},{v:'V',l:'Volume (V, L)'}])}${field('mol-n','Moles of solute (mol)','number','0.5')}${field('mol-v','Volume of solution (L)','number','0.25')}${field('mol-m','Molarity (mol/L)','number','2')}${btn()}<div id="mol-result"></div>`;
        window._calcRun = () => {
            const solve = document.getElementById('mol-solve').value;
            const n = +document.getElementById('mol-n').value,
                v = +document.getElementById('mol-v').value,
                M = +document.getElementById('mol-m').value;
            if (solve === 'M') document.getElementById('mol-result').innerHTML = result(row('Molarity', `${fmt(n/v,4)} mol/L`));
            else if (solve === 'n') document.getElementById('mol-result').innerHTML = result(row('Moles', `${fmt(M*v,4)} mol`));
            else document.getElementById('mol-result').innerHTML = result(row('Volume', `${fmt(n/M,4)} L`));
            uwuHistory.add('molarity-calculator', {});
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('mol-result').innerHTML = '';
        };
    }

    // ── Heat Index ────────────────────────────────────────────────────────────
    function renderHeatIndex(container) {
        container.innerHTML = `${field('hi-t','Temperature (°F)','number','95')}${field('hi-rh','Relative Humidity (%)','number','60')}${btn()}<div id="hi-result"></div>`;
        window._calcRun = () => {
            const T = +document.getElementById('hi-t').value,
                RH = +document.getElementById('hi-rh').value;
            if (T < 80) {
                document.getElementById('hi-result').innerHTML = err('Heat index is only applicable above 80°F.');
                return;
            }
            const HI = -42.379 + 2.04901523 * T + 10.14333127 * RH - 0.22475541 * T * RH - 0.00683783 * T * T - 0.05481717 * RH * RH + 0.00122874 * T * T * RH + 0.00085282 * T * RH * RH - 0.00000199 * T * T * RH * RH;
            let cat = HI < 91 ? 'Caution' : HI < 104 ? 'Extreme caution' : HI < 125 ? 'Danger' : 'Extreme danger';
            document.getElementById('hi-result').innerHTML = result(row('Heat Index', `${fmt(HI,1)}°F (${fmt((HI-32)*5/9,1)}°C)`) + row('Category', cat));
            uwuHistory.add('heat-index-calculator', {
                hi: fmt(HI, 1)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('hi-result').innerHTML = '';
        };
    }

    // ── Dew Point ─────────────────────────────────────────────────────────────
    function renderDewPoint(container) {
        container.innerHTML = `${field('dp-t','Temperature (°C)','number','25')}${field('dp-rh','Relative Humidity (%)','number','60')}${btn()}<div id="dp-result"></div>`;
        window._calcRun = () => {
            const T = +document.getElementById('dp-t').value,
                RH = +document.getElementById('dp-rh').value;
            const a = 17.27,
                b = 237.7;
            const alpha = (a * T / (b + T)) + Math.log(RH / 100);
            const dp = (b * alpha) / (a - alpha);
            document.getElementById('dp-result').innerHTML = result(row('Dew Point', `${fmt(dp,1)}°C (${fmt(dp*9/5+32,1)}°F)`));
            uwuHistory.add('dew-point-calculator', {
                dp: fmt(dp, 1)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('dp-result').innerHTML = '';
        };
    }

    // ── Wind Chill ────────────────────────────────────────────────────────────
    function renderWindChill(container) {
        container.innerHTML = `${field('wc-t','Temperature (°F)','number','32')}${field('wc-v','Wind speed (mph)','number','20')}${btn()}<div id="wc-result"></div>`;
        window._calcRun = () => {
            const T = +document.getElementById('wc-t').value,
                V = +document.getElementById('wc-v').value;
            if (V < 3) {
                document.getElementById('wc-result').innerHTML = err('Wind speed must be at least 3 mph for wind chill.');
                return;
            }
            const wc = 35.74 + 0.6215 * T - 35.75 * Math.pow(V, 0.16) + 0.4275 * T * Math.pow(V, 0.16);
            document.getElementById('wc-result').innerHTML = result(row('Wind Chill', `${fmt(wc,1)}°F (${fmt((wc-32)*5/9,1)}°C)`));
            uwuHistory.add('wind-chill-calculator', {
                wc: fmt(wc, 1)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('wc-result').innerHTML = '';
        };
    }

    // ── Mass ──────────────────────────────────────────────────────────────────
    function renderMass(container) {
        container.innerHTML = `${select('mass-solve','Solve for',[{v:'mass',l:'Mass (m = ρ × V)'},{v:'density',l:'Density (ρ = m / V)'},{v:'volume',l:'Volume (V = m / ρ)'}])}${field('mass-m','Mass (kg)','number','500')}${field('mass-rho','Density (kg/m³)','number','1000')}${field('mass-v','Volume (m³)','number','0.5')}${btn()}<div id="mass-result"></div>`;
        window._calcRun = () => {
            const solve = document.getElementById('mass-solve').value;
            const m = +document.getElementById('mass-m').value,
                rho = +document.getElementById('mass-rho').value,
                v = +document.getElementById('mass-v').value;
            let res, label;
            if (solve === 'mass') {
                res = rho * v;
                label = 'Mass (kg)';
            } else if (solve === 'density') {
                res = m / v;
                label = 'Density (kg/m³)';
            } else {
                res = m / rho;
                label = 'Volume (m³)';
            }
            document.getElementById('mass-result').innerHTML = result(row(label, fmt(res, 6)));
            uwuHistory.add('mass-calculator', {
                result: fmt(res, 6)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('mass-result').innerHTML = '';
        };
    }

    // ── Weight ────────────────────────────────────────────────────────────────
    function renderWeight(container) {
        container.innerHTML = `${field('wgt-val','Weight','number','70')}${select('wgt-from','From',[{v:'kg',l:'Kilograms'},{v:'lb',l:'Pounds'},{v:'oz',l:'Ounces'},{v:'g',l:'Grams'},{v:'st',l:'Stones'}])}${btn('Convert')}<div id="wgt-result"></div>`;
        const toKg = {
            kg: 1,
            lb: 0.453592,
            oz: 0.0283495,
            g: 0.001,
            st: 6.35029
        };
        window._calcRun = () => {
            const val = +document.getElementById('wgt-val').value,
                from = document.getElementById('wgt-from').value;
            const kg = val * toKg[from];
            document.getElementById('wgt-result').innerHTML = result(row('Kilograms', fmt(kg, 4)) + row('Pounds', fmt(kg / 0.453592, 4)) + row('Ounces', fmt(kg / 0.0283495, 3)) + row('Grams', fmt(kg * 1000, 1)) + row('Stones', fmt(kg / 6.35029, 4)));
            uwuHistory.add('weight-calculator', {
                kg: fmt(kg, 4)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('wgt-result').innerHTML = '';
        };
    }

    // ── Love (fun) ────────────────────────────────────────────────────────────
    function renderLove(container) {
        container.innerHTML = `${field('love-a','Your name','text','','')}${field('love-b','Their name','text','','')}${btn('Calculate')}<div id="love-result"></div>`;
        window._calcRun = () => {
            const a = document.getElementById('love-a').value.trim(),
                b = document.getElementById('love-b').value.trim();
            if (!a || !b) {
                document.getElementById('love-result').innerHTML = err('Enter both names.');
                return;
            }
            // Fun deterministic hash
            const combined = (a + b).toLowerCase();
            let h = 0;
            for (const c of combined) h = (h * 31 + c.charCodeAt(0)) % 100;
            const pct = Math.max(30, h);
            const msg = pct > 80 ? 'A perfect match!' : pct > 60 ? 'Great compatibility!' : pct > 40 ? 'There is potential!' : 'Keep getting to know each other!';
            document.getElementById('love-result').innerHTML = result(row('Compatibility', `${pct}%`) + row('Verdict', msg));
            uwuHistory.add('love-calculator', {
                pct
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('love-result').innerHTML = '';
        };
    }

    // ── Dice Roller ───────────────────────────────────────────────────────────
    function renderDice(container) {
        container.innerHTML = `${field('dice-n','Number of dice','number','2')}${select('dice-sides','Sides per die',[{v:'4',l:'d4'},{v:'6',l:'d6'},{v:'8',l:'d8'},{v:'10',l:'d10'},{v:'12',l:'d12'},{v:'20',l:'d20'},{v:'100',l:'d100'}])}${field('dice-mod','Modifier (+/-)','number','0')}${btn('Roll!')}<div id="dice-result"></div>`;
        window._calcRun = () => {
            const n = parseInt(document.getElementById('dice-n').value) || 1;
            const sides = parseInt(document.getElementById('dice-sides').value);
            const mod = parseInt(document.getElementById('dice-mod').value) || 0;
            const rolls = Array.from({
                length: n
            }, () => Math.floor(Math.random() * sides) + 1);
            const sum = rolls.reduce((a, b) => a + b, 0) + mod;
            document.getElementById('dice-result').innerHTML = result(row('Rolls', rolls.join(', ')) + row('Sum', rolls.reduce((a, b) => a + b, 0)) + (mod ? row('Modifier', mod > 0 ? `+${mod}` : mod) : '') + row('Total', sum));
            uwuHistory.add('dice-roller', {
                rolls: rolls.join(','),
                total: sum
            });
        };
        window._calcReset = () => {
            document.getElementById('dice-result').innerHTML = '';
        };
    }

    // ── Password Generator ────────────────────────────────────────────────────
    function renderPassword(container) {
        container.innerHTML = `${field('pw-len','Length','number','16')}
      <div class="calc-field" style="display:flex;gap:16px;flex-wrap:wrap">
        <label><input type="checkbox" id="pw-upper" checked> Uppercase</label>
        <label><input type="checkbox" id="pw-lower" checked> Lowercase</label>
        <label><input type="checkbox" id="pw-num" checked> Numbers</label>
        <label><input type="checkbox" id="pw-sym" checked> Symbols</label>
      </div>
      ${btn('Generate')}<div id="pw-result"></div>`;
        window._calcRun = () => {
            const len = parseInt(document.getElementById('pw-len').value) || 16;
            let chars = '';
            if (document.getElementById('pw-upper').checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (document.getElementById('pw-lower').checked) chars += 'abcdefghijklmnopqrstuvwxyz';
            if (document.getElementById('pw-num').checked) chars += '0123456789';
            if (document.getElementById('pw-sym').checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
            if (!chars) {
                document.getElementById('pw-result').innerHTML = err('Select at least one character type.');
                return;
            }
            const arr = new Uint8Array(len);
            crypto.getRandomValues(arr);
            const pw = Array.from(arr).map(b => chars[b % chars.length]).join('');
            const entropy = Math.log2(Math.pow(chars.length, len));
            document.getElementById('pw-result').innerHTML = result(`<div style="font-family:monospace;font-size:16px;word-break:break-all;padding:8px;background:var(--glass-bg);border-radius:6px;margin-bottom:8px">${pw}</div>` + row('Entropy', `${fmt(entropy,1)} bits`) + row('Strength', entropy < 40 ? 'Weak' : entropy < 60 ? 'Good' : entropy < 80 ? 'Strong' : 'Very strong'));
            uwuHistory.add('password-generator', {
                length: len,
                entropy: fmt(entropy, 1)
            });
        };
        window._calcReset = () => {
            document.getElementById('pw-result').innerHTML = '';
        };
    }

    // ── Roman Numeral ─────────────────────────────────────────────────────────
    function renderRomanNumeral(container) {
        container.innerHTML = `${select('rn-dir','Direction',[{v:'to',l:'Number → Roman'},{v:'from',l:'Roman → Number'}])}${field('rn-num','Number (1–3999)','number','2024')}${field('rn-roman','Roman numeral','text','MMXXIV')}${btn('Convert')}<div id="rn-result"></div>`;

        function toRoman(n) {
            const v = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
            const s = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
            let r = '';
            v.forEach((val, i) => {
                while (n >= val) {
                    r += s[i];
                    n -= val;
                }
            });
            return r;
        }

        function fromRoman(s) {
            const m = {
                I: 1,
                V: 5,
                X: 10,
                L: 50,
                C: 100,
                D: 500,
                M: 1000
            };
            let r = 0;
            for (let i = 0; i < s.length; i++) {
                const cur = m[s[i]],
                    next = m[s[i + 1]];
                if (next > cur) r -= cur;
                else r += cur;
            }
            return r;
        }
        window._calcRun = () => {
            const dir = document.getElementById('rn-dir').value;
            if (dir === 'to') {
                const n = parseInt(document.getElementById('rn-num').value);
                if (!n || n < 1 || n > 3999) {
                    document.getElementById('rn-result').innerHTML = err('Enter a number between 1 and 3999.');
                    return;
                }
                document.getElementById('rn-result').innerHTML = result(row('Roman numeral', toRoman(n)));
                uwuHistory.add('roman-numeral-converter', {
                    roman: toRoman(n)
                });
            } else {
                const s = document.getElementById('rn-roman').value.trim().toUpperCase();
                const n = fromRoman(s);
                document.getElementById('rn-result').innerHTML = result(row('Number', n.toLocaleString()));
                uwuHistory.add('roman-numeral-converter', {
                    number: n
                });
            }
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('rn-result').innerHTML = '';
        };
    }

    // ── Shoe Size ─────────────────────────────────────────────────────────────
    function renderShoeSize(container) {
        container.innerHTML = `${field('shoe-foot','Foot length (cm)','number','26')}${select('shoe-sex','Fit',[{v:'mens',l:"Men's"},{v:'womens',l:"Women's"}])}${btn('Find Size')}<div id="shoe-result"></div>`;
        window._calcRun = () => {
            const l = +document.getElementById('shoe-foot').value,
                sex = document.getElementById('shoe-sex').value;
            const us_m = l / 0.8467 - 22.9,
                us_w = us_m + 1.5,
                uk = us_m - 0.5,
                eu = Math.round(l / 0.6667 + 1.5);
            document.getElementById('shoe-result').innerHTML = result(
                row("US Men's", fmt(sex === 'mens' ? us_m : us_m - 1.5, 1)) + row("US Women's", fmt(sex === 'womens' ? us_w : us_w + 1.5, 1)) + row('UK', fmt(uk, 1)) + row('EU', eu)
            );
            uwuHistory.add('shoe-size-conversion', {
                eu
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('shoe-result').innerHTML = '';
        };
    }

    // ── Binary ────────────────────────────────────────────────────────────────
    function renderBinary(container) {
        container.innerHTML = `${select('bin-op','Operation',[{v:'conv',l:'Convert between bases'},{v:'add',l:'Binary addition'},{v:'sub',l:'Binary subtraction'},{v:'mul',l:'Binary multiplication'}])}${field('bin-a','Value A','text','1010')}${select('bin-abase','A is in base',[{v:'2',l:'Binary'},{v:'8',l:'Octal'},{v:'10',l:'Decimal'},{v:'16',l:'Hexadecimal'}])}${field('bin-b','Value B (for operations)','text','0110')}${btn()}<div id="bin-result"></div>`;
        window._calcRun = () => {
            const op = document.getElementById('bin-op').value;
            const a = parseInt(document.getElementById('bin-a').value, +document.getElementById('bin-abase').value);
            if (op === 'conv') {
                document.getElementById('bin-result').innerHTML = result(row('Binary', a.toString(2)) + row('Octal', a.toString(8)) + row('Decimal', a.toString(10)) + row('Hexadecimal', a.toString(16).toUpperCase()));
            } else {
                const b = parseInt(document.getElementById('bin-b').value, 2);
                let res;
                if (op === 'add') res = a + b;
                else if (op === 'sub') res = a - b;
                else res = a * b;
                document.getElementById('bin-result').innerHTML = result(row('Result (decimal)', res) + row('Result (binary)', res.toString(2)) + row('Result (hex)', res.toString(16).toUpperCase()));
            }
            uwuHistory.add('binary-calculator', {});
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('bin-result').innerHTML = '';
        };
    }

    // ── Hex ───────────────────────────────────────────────────────────────────
    function renderHex(container) {
        container.innerHTML = `${field('hex-val','Value','text','FF')}${select('hex-from','From',[{v:'16',l:'Hexadecimal'},{v:'10',l:'Decimal'},{v:'2',l:'Binary'},{v:'8',l:'Octal'}])}${btn('Convert')}<div id="hex-result"></div>`;
        window._calcRun = () => {
            const val = parseInt(document.getElementById('hex-val').value, +document.getElementById('hex-from').value);
            if (isNaN(val)) {
                document.getElementById('hex-result').innerHTML = err('Invalid value for selected base.');
                return;
            }
            document.getElementById('hex-result').innerHTML = result(row('Decimal', val) + row('Binary', val.toString(2)) + row('Octal', val.toString(8)) + row('Hexadecimal', val.toString(16).toUpperCase()));
            uwuHistory.add('hex-calculator', {});
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('hex-result').innerHTML = '';
        };
    }

    // ── Base64 ────────────────────────────────────────────────────────────────
    function renderBase64(container) {
        container.innerHTML = `${select('b64-op','Operation',[{v:'enc',l:'Encode (text → Base64)'},{v:'dec',l:'Decode (Base64 → text)'}])}<div class="calc-field"><label>Input</label><textarea id="b64-input" rows="4" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text);font-family:monospace;resize:vertical"></textarea></div>${btn()}<div id="b64-result"></div>`;
        window._calcRun = () => {
            const op = document.getElementById('b64-op').value,
                input = document.getElementById('b64-input').value;
            if (!input) {
                document.getElementById('b64-result').innerHTML = err('Enter input text.');
                return;
            }
            try {
                const out = op === 'enc' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input)));
                document.getElementById('b64-result').innerHTML = `<div class="calc-result"><div class="result-row"><span class="result-label">Output</span></div><textarea rows="4" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text);font-family:monospace;resize:vertical" readonly>${out}</textarea></div>`;
                uwuHistory.add('base64-encode-decode', {
                    op
                });
            } catch (e) {
                document.getElementById('b64-result').innerHTML = err('Invalid input for operation.');
            }
        };
        window._calcReset = () => {
            document.getElementById('b64-input').value = '';
            document.getElementById('b64-result').innerHTML = '';
        };
    }

    // ── URL Encode/Decode ─────────────────────────────────────────────────────
    function renderURLEncode(container) {
        container.innerHTML = `${select('url-op','Operation',[{v:'enc',l:'Encode URL'},{v:'dec',l:'Decode URL'}])}<div class="calc-field"><label>Input</label><textarea id="url-input" rows="3" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text);font-family:monospace;resize:vertical"></textarea></div>${btn()}<div id="url-result"></div>`;
        window._calcRun = () => {
            const op = document.getElementById('url-op').value,
                input = document.getElementById('url-input').value;
            if (!input) {
                document.getElementById('url-result').innerHTML = err('Enter input.');
                return;
            }
            const out = op === 'enc' ? encodeURIComponent(input) : decodeURIComponent(input);
            document.getElementById('url-result').innerHTML = `<div class="calc-result"><div class="result-row"><span class="result-label">Output</span></div><textarea rows="3" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text);font-family:monospace;resize:vertical" readonly>${out}</textarea></div>`;
            uwuHistory.add('url-encode-decode', {
                op
            });
        };
        window._calcReset = () => {
            document.getElementById('url-input').value = '';
            document.getElementById('url-result').innerHTML = '';
        };
    }

    // ── GDP ───────────────────────────────────────────────────────────────────
    function renderGDP(container) {
        container.innerHTML = `<p style="font-size:14px;opacity:0.8;margin-bottom:12px">Expenditure approach: GDP = C + I + G + (X − M)</p>${field('gdp-c','Consumption (C)','number','1000')}${field('gdp-i','Investment (I)','number','200')}${field('gdp-g','Government spending (G)','number','300')}${field('gdp-x','Exports (X)','number','150')}${field('gdp-m','Imports (M)','number','200')}${btn()}<div id="gdp-result"></div>`;
        window._calcRun = () => {
            const C = +document.getElementById('gdp-c').value,
                I = +document.getElementById('gdp-i').value,
                G = +document.getElementById('gdp-g').value,
                X = +document.getElementById('gdp-x').value,
                M = +document.getElementById('gdp-m').value;
            const GDP = C + I + G + (X - M);
            document.getElementById('gdp-result').innerHTML = result(row('GDP', GDP.toLocaleString()) + row('Net exports (X−M)', (X - M).toLocaleString()) + row('Trade balance', X > M ? 'Surplus' : 'Deficit'));
            uwuHistory.add('gdp-calculator', {
                gdp: GDP
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('gdp-result').innerHTML = '';
        };
    }

    // ── Alias map ─────────────────────────────────────────────────────────────

    const ALIAS = {
        'age-calculator': renderAge,
        'date-calculator': renderDate,
        'day-counter': renderDayCounter,
        'day-of-the-week-calculator': renderDayOfWeek,
        'time-calculator': renderTime,
        'time-duration-calculator': renderTimeDuration,
        'hours-calculator': renderHours,
        'time-card-calculator': renderTimeCard,
        'time-zone-calculator': renderTimeZone,
        'conversion-calculator': renderConversion,
        'tip-calculator': renderTip,
        'gpa-calculator': renderGPA,
        'concrete-calculator': renderConcrete,
        'gravel-calculator': renderGravel,
        'mulch-calculator': renderMulch,
        'roofing-calculator': renderRoofing,
        'tile-calculator': renderTile,
        'stair-calculator': renderStair,
        'fuel-cost-calculator': renderFuelCost,
        'gas-mileage-calculator': renderGasMileage,
        'mileage-calculator': renderMileage,
        'speed-calculator': renderSpeed,
        'btu-calculator': renderBTU,
        'electricity-calculator': renderElectricity,
        'bandwidth-calculator': renderBandwidth,
        'ip-subnet-calculator': renderIPSubnet,
        'ohms-law-calculator': renderOhmsLaw,
        'voltage-drop-calculator': renderVoltageDrop,
        'resistor-calculator': renderResistor,
        'horsepower-calculator': renderHorsepower,
        'engine-horsepower-calculator': renderEngineHorsepower,
        'tire-size-calculator': renderTireSize,
        'molecular-weight-calculator': renderMolecularWeight,
        'molarity-calculator': renderMolarity,
        'heat-index-calculator': renderHeatIndex,
        'dew-point-calculator': renderDewPoint,
        'wind-chill-calculator': renderWindChill,
        'mass-calculator': renderMass,
        'weight-calculator': renderWeight,
        'love-calculator': renderLove,
        'dice-roller': renderDice,
        'password-generator': renderPassword,
        'roman-numeral-converter': renderRomanNumeral,
        'shoe-size-conversion': renderShoeSize,
        'binary-calculator': renderBinary,
        'hex-calculator': renderHex,
        'base64-encode-decode': renderBase64,
        'url-encode-decode': renderURLEncode,
        'gdp-calculator': renderGDP,
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