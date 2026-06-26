// engines/fitness.js - Fitness & Health Calculator Engine
// Handles all 31 fitness/health calculators

window.uwuEngineFitness = (() => {

    // ── Helpers ────────────────────────────────────────────────────────────────

    function field(id, label, type = 'number', placeholder = '', value = '') {
        return `<div class="calc-field">
      <label for="${id}">${label}</label>
      <input type="${type}" id="${id}" placeholder="${placeholder}" value="${value}" autocomplete="off">
    </div>`;
    }

    function select(id, label, options) {
        const opts = options.map(o => `<option value="${o.v}">${o.l}</option>`).join('');
        return `<div class="calc-field">
      <label for="${id}">${label}</label>
      <select id="${id}">${opts}</select>
    </div>`;
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
        return `<div class="calc-actions">
      <button class="btn-calc" onclick="window._calcRun()">Calculate</button>
      <button class="btn-reset" onclick="window._calcReset()">Reset</button>
    </div>`;
    }

    function fmt(n, dec = 2) {
        return isNaN(n) ? '-' : Number(n).toFixed(dec);
    }

    // ── BMI ───────────────────────────────────────────────────────────────────

    function renderBMI(container) {
        container.innerHTML = `
      ${select('bmi-unit', 'Unit System', [{v:'metric',l:'Metric (kg, cm)'},{v:'imperial',l:'Imperial (lb, in)'}])}
      <div id="bmi-metric">
        ${field('bmi-weight-kg','Weight (kg)','number','70')}
        ${field('bmi-height-cm','Height (cm)','number','170')}
      </div>
      <div id="bmi-imperial" style="display:none">
        ${field('bmi-weight-lb','Weight (lb)','number','154')}
        ${field('bmi-height-ft','Height (ft)','number','5')}
        ${field('bmi-height-in','Height (in)','number','7')}
      </div>
      <div id="bmi-age-sex">
        ${field('bmi-age','Age','number','25')}
        ${select('bmi-sex','Sex',[{v:'male',l:'Male'},{v:'female',l:'Female'}])}
      </div>
      ${btn()}
      <div id="bmi-result"></div>`;

        document.getElementById('bmi-unit').addEventListener('change', e => {
            document.getElementById('bmi-metric').style.display = e.target.value === 'metric' ? '' : 'none';
            document.getElementById('bmi-imperial').style.display = e.target.value === 'imperial' ? '' : 'none';
        });

        window._calcRun = () => {
            const unit = document.getElementById('bmi-unit').value;
            let weight_kg, height_m;
            if (unit === 'metric') {
                weight_kg = parseFloat(document.getElementById('bmi-weight-kg').value);
                height_m = parseFloat(document.getElementById('bmi-height-cm').value) / 100;
            } else {
                const lb = parseFloat(document.getElementById('bmi-weight-lb').value);
                const ft = parseFloat(document.getElementById('bmi-height-ft').value) || 0;
                const inn = parseFloat(document.getElementById('bmi-height-in').value) || 0;
                weight_kg = lb * 0.453592;
                height_m = (ft * 12 + inn) * 0.0254;
            }
            if (!weight_kg || !height_m) {
                document.getElementById('bmi-result').innerHTML = err('Please enter valid values.');
                return;
            }
            const bmi = weight_kg / (height_m * height_m);
            let cat = '';
            if (bmi < 18.5) cat = 'Underweight';
            else if (bmi < 25) cat = 'Normal weight';
            else if (bmi < 30) cat = 'Overweight';
            else cat = 'Obese';
            const html = result(`${row('BMI', fmt(bmi, 1))}${row('Category', cat)}${row('Healthy BMI range', '18.5 – 24.9')}`);
            document.getElementById('bmi-result').innerHTML = html;
            uwuHistory.add('bmi', {
                bmi: fmt(bmi, 1),
                category: cat
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('bmi-result').innerHTML = '';
        };
    }

    // ── BMR ───────────────────────────────────────────────────────────────────

    function renderBMR(container) {
        container.innerHTML = `
      ${select('bmr-unit','Unit System',[{v:'metric',l:'Metric'},{v:'imperial',l:'Imperial'}])}
      ${field('bmr-age','Age','number','25')}
      ${select('bmr-sex','Sex',[{v:'male',l:'Male'},{v:'female',l:'Female'}])}
      ${field('bmr-weight','Weight (kg)','number','70')}
      ${field('bmr-height','Height (cm)','number','170')}
      ${select('bmr-activity','Activity Level',[
        {v:'1.2',l:'Sedentary (little or no exercise)'},
        {v:'1.375',l:'Lightly active (1–3 days/week)'},
        {v:'1.55',l:'Moderately active (3–5 days/week)'},
        {v:'1.725',l:'Very active (6–7 days/week)'},
        {v:'1.9',l:'Extra active (physical job or 2x/day)'}
      ])}
      ${btn()}
      <div id="bmr-result"></div>`;

        window._calcRun = () => {
            const age = parseFloat(document.getElementById('bmr-age').value);
            const sex = document.getElementById('bmr-sex').value;
            const w = parseFloat(document.getElementById('bmr-weight').value);
            const h = parseFloat(document.getElementById('bmr-height').value);
            const act = parseFloat(document.getElementById('bmr-activity').value);
            if (!age || !w || !h) {
                document.getElementById('bmr-result').innerHTML = err('Please enter valid values.');
                return;
            }
            // Mifflin-St Jeor
            let bmr = sex === 'male' ? 10 * w + 6.25 * h - 5 * age + 5 : 10 * w + 6.25 * h - 5 * age - 161;
            const tdee = bmr * act;
            document.getElementById('bmr-result').innerHTML = result(
                row('BMR (Mifflin-St Jeor)', `${fmt(bmr,0)} kcal/day`) +
                row('Maintenance Calories (TDEE)', `${fmt(tdee,0)} kcal/day`) +
                row('Weight Loss (–500 kcal)', `${fmt(tdee-500,0)} kcal/day`) +
                row('Weight Gain (+500 kcal)', `${fmt(tdee+500,0)} kcal/day`)
            );
            uwuHistory.add('bmr', {
                bmr: fmt(bmr, 0),
                tdee: fmt(tdee, 0)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('bmr-result').innerHTML = '';
        };
    }

    // ── Calorie ───────────────────────────────────────────────────────────────

    function renderCalorie(container) {
        container.innerHTML = `
      ${field('cal-age','Age','number','25')}
      ${select('cal-sex','Sex',[{v:'male',l:'Male'},{v:'female',l:'Female'}])}
      ${field('cal-weight','Weight (kg)','number','70')}
      ${field('cal-height','Height (cm)','number','170')}
      ${select('cal-activity','Activity Level',[
        {v:'1.2',l:'Sedentary'},
        {v:'1.375',l:'Lightly active'},
        {v:'1.55',l:'Moderately active'},
        {v:'1.725',l:'Very active'},
        {v:'1.9',l:'Extra active'}
      ])}
      ${select('cal-goal','Goal',[
        {v:'maintain',l:'Maintain weight'},
        {v:'lose_mild',l:'Mild weight loss (0.25 kg/week)'},
        {v:'lose',l:'Weight loss (0.5 kg/week)'},
        {v:'lose_fast',l:'Fast weight loss (1 kg/week)'},
        {v:'gain_mild',l:'Mild weight gain (0.25 kg/week)'},
        {v:'gain',l:'Weight gain (0.5 kg/week)'}
      ])}
      ${btn()}
      <div id="cal-result"></div>`;

        window._calcRun = () => {
            const age = parseFloat(document.getElementById('cal-age').value);
            const sex = document.getElementById('cal-sex').value;
            const w = parseFloat(document.getElementById('cal-weight').value);
            const h = parseFloat(document.getElementById('cal-height').value);
            const act = parseFloat(document.getElementById('cal-activity').value);
            const goal = document.getElementById('cal-goal').value;
            if (!age || !w || !h) {
                document.getElementById('cal-result').innerHTML = err('Please fill all fields.');
                return;
            }
            let bmr = sex === 'male' ? 10 * w + 6.25 * h - 5 * age + 5 : 10 * w + 6.25 * h - 5 * age - 161;
            let tdee = bmr * act;
            const adj = {
                maintain: 0,
                lose_mild: -275,
                lose: -550,
                lose_fast: -1100,
                gain_mild: 275,
                gain: 550
            };
            const target = tdee + adj[goal];
            document.getElementById('cal-result').innerHTML = result(
                row('Daily Calories (TDEE)', `${fmt(tdee,0)} kcal`) +
                row('Target Calories', `${fmt(target,0)} kcal`) +
                row('Protein (30%)', `${fmt(target*0.3/4,0)} g`) +
                row('Carbs (40%)', `${fmt(target*0.4/4,0)} g`) +
                row('Fat (30%)', `${fmt(target*0.3/9,0)} g`)
            );
            uwuHistory.add('calorie', {
                tdee: fmt(tdee, 0),
                target: fmt(target, 0)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('cal-result').innerHTML = '';
        };
    }

    // ── TDEE ─────────────────────────────────────────────────────────────────

    function renderTDEE(container) {
        container.innerHTML = `
      ${field('tdee-age','Age','number','25')}
      ${select('tdee-sex','Sex',[{v:'male',l:'Male'},{v:'female',l:'Female'}])}
      ${field('tdee-weight','Weight (kg)','number','70')}
      ${field('tdee-height','Height (cm)','number','170')}
      ${select('tdee-activity','Activity Level',[
        {v:'1.2',l:'Sedentary (desk job, no exercise)'},
        {v:'1.375',l:'Light (1–3 days/week exercise)'},
        {v:'1.55',l:'Moderate (3–5 days/week exercise)'},
        {v:'1.725',l:'Active (6–7 days/week exercise)'},
        {v:'1.9',l:'Very Active (athlete/physical job)'}
      ])}
      ${btn()}
      <div id="tdee-result"></div>`;

        window._calcRun = () => {
            const age = parseFloat(document.getElementById('tdee-age').value);
            const sex = document.getElementById('tdee-sex').value;
            const w = parseFloat(document.getElementById('tdee-weight').value);
            const h = parseFloat(document.getElementById('tdee-height').value);
            const act = parseFloat(document.getElementById('tdee-activity').value);
            if (!age || !w || !h) {
                document.getElementById('tdee-result').innerHTML = err('Please fill all fields.');
                return;
            }
            const bmr = sex === 'male' ? 10 * w + 6.25 * h - 5 * age + 5 : 10 * w + 6.25 * h - 5 * age - 161;
            const tdee = bmr * act;
            document.getElementById('tdee-result').innerHTML = result(
                row('BMR', `${fmt(bmr,0)} kcal/day`) +
                row('TDEE (Maintenance)', `${fmt(tdee,0)} kcal/day`) +
                row('Cut (–500 kcal)', `${fmt(tdee-500,0)} kcal/day`) +
                row('Bulk (+500 kcal)', `${fmt(tdee+500,0)} kcal/day`)
            );
            uwuHistory.add('tdee', {
                bmr: fmt(bmr, 0),
                tdee: fmt(tdee, 0)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('tdee-result').innerHTML = '';
        };
    }

    // ── Body Fat ──────────────────────────────────────────────────────────────

    function renderBodyFat(container) {
        container.innerHTML = `
      ${select('bf-method','Method',[{v:'navy',l:'US Navy Method'},{v:'bmi',l:'BMI-based Estimate'}])}
      ${select('bf-sex','Sex',[{v:'male',l:'Male'},{v:'female',l:'Female'}])}
      ${field('bf-height','Height (cm)','number','170')}
      <div id="bf-navy">
        ${field('bf-neck','Neck circumference (cm)','number','38')}
        ${field('bf-waist','Waist circumference (cm)','number','85')}
        <div id="bf-hip-wrap">${field('bf-hip','Hip circumference (cm, women)','number','95')}</div>
      </div>
      <div id="bf-bmi-inputs" style="display:none">
        ${field('bf-weight','Weight (kg)','number','70')}
        ${field('bf-age','Age','number','25')}
      </div>
      ${btn()}
      <div id="bf-result"></div>`;

        document.getElementById('bf-method').addEventListener('change', e => {
            document.getElementById('bf-navy').style.display = e.target.value === 'navy' ? '' : 'none';
            document.getElementById('bf-bmi-inputs').style.display = e.target.value === 'bmi' ? '' : 'none';
        });
        document.getElementById('bf-sex').addEventListener('change', e => {
            document.getElementById('bf-hip-wrap').style.display = e.target.value === 'female' ? '' : 'none';
        });

        window._calcRun = () => {
            const method = document.getElementById('bf-method').value;
            const sex = document.getElementById('bf-sex').value;
            const height = parseFloat(document.getElementById('bf-height').value);
            let bf = NaN;
            if (method === 'navy') {
                const neck = parseFloat(document.getElementById('bf-neck').value);
                const waist = parseFloat(document.getElementById('bf-waist').value);
                if (sex === 'male') {
                    bf = 86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
                } else {
                    const hip = parseFloat(document.getElementById('bf-hip').value);
                    bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
                }
            } else {
                const w = parseFloat(document.getElementById('bf-weight').value);
                const age = parseFloat(document.getElementById('bf-age').value);
                const bmi = w / ((height / 100) ** 2);
                bf = sex === 'male' ? (1.20 * bmi) + (0.23 * age) - 16.2 : (1.20 * bmi) + (0.23 * age) - 5.4;
            }
            if (isNaN(bf)) {
                document.getElementById('bf-result').innerHTML = err('Please enter valid values.');
                return;
            }
            let cat = '';
            if (sex === 'male') {
                cat = bf < 6 ? 'Essential fat' : bf < 14 ? 'Athletic' : bf < 18 ? 'Fitness' : bf < 25 ? 'Average' : 'Obese';
            } else {
                cat = bf < 14 ? 'Essential fat' : bf < 21 ? 'Athletic' : bf < 25 ? 'Fitness' : bf < 32 ? 'Average' : 'Obese';
            }
            document.getElementById('bf-result').innerHTML = result(row('Body Fat %', `${fmt(bf,1)}%`) + row('Category', cat));
            uwuHistory.add('body-fat', {
                bf: fmt(bf, 1),
                category: cat
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('bf-result').innerHTML = '';
        };
    }

    // ── Ideal Weight ──────────────────────────────────────────────────────────

    function renderIdealWeight(container) {
        container.innerHTML = `
      ${select('iw-unit','Unit',[{v:'cm',l:'Metric (cm)'},{v:'in',l:'Imperial (ft/in)'}])}
      <div id="iw-metric">${field('iw-cm','Height (cm)','number','170')}</div>
      <div id="iw-imperial" style="display:none">
        ${field('iw-ft','Height (ft)','number','5')}
        ${field('iw-in','Height (in)','number','7')}
      </div>
      ${select('iw-sex','Sex',[{v:'male',l:'Male'},{v:'female',l:'Female'}])}
      ${btn()}
      <div id="iw-result"></div>`;

        document.getElementById('iw-unit').addEventListener('change', e => {
            document.getElementById('iw-metric').style.display = e.target.value === 'cm' ? '' : 'none';
            document.getElementById('iw-imperial').style.display = e.target.value === 'in' ? '' : 'none';
        });

        window._calcRun = () => {
            const unit = document.getElementById('iw-unit').value;
            let cm;
            if (unit === 'cm') cm = parseFloat(document.getElementById('iw-cm').value);
            else {
                const ft = parseFloat(document.getElementById('iw-ft').value) || 0;
                const inn = parseFloat(document.getElementById('iw-in').value) || 0;
                cm = (ft * 12 + inn) * 2.54;
            }
            const sex = document.getElementById('iw-sex').value;
            if (!cm) {
                document.getElementById('iw-result').innerHTML = err('Enter height.');
                return;
            }
            const inch = cm / 2.54;
            const over60 = inch - 60;
            const hamwi = sex === 'male' ? 48 + 2.7 * over60 : 45.4 + 2.27 * over60;
            const devine = sex === 'male' ? 50 + 2.3 * over60 : 45.5 + 2.3 * over60;
            const miller = sex === 'male' ? 56.2 + 1.41 * over60 : 53.1 + 1.36 * over60;
            const lbs = n => fmt(n * 2.20462, 1) + ' lb (' + fmt(n, 1) + ' kg)';
            document.getElementById('iw-result').innerHTML = result(
                row('Hamwi Formula', lbs(hamwi)) + row('Devine Formula', lbs(devine)) + row('Miller Formula', lbs(miller)) + row('Healthy BMI Range', lbs(18.5 * (cm / 100) ** 2) + ' – ' + lbs(24.9 * (cm / 100) ** 2))
            );
            uwuHistory.add('ideal-weight', {
                hamwi: fmt(hamwi, 1),
                devine: fmt(devine, 1)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('iw-result').innerHTML = '';
        };
    }

    // ── Lean Body Mass ────────────────────────────────────────────────────────

    function renderLBM(container) {
        container.innerHTML = `
      ${select('lbm-sex','Sex',[{v:'male',l:'Male'},{v:'female',l:'Female'}])}
      ${field('lbm-weight','Weight (kg)','number','75')}
      ${field('lbm-height','Height (cm)','number','175')}
      ${btn()}
      <div id="lbm-result"></div>`;

        window._calcRun = () => {
            const sex = document.getElementById('lbm-sex').value;
            const w = parseFloat(document.getElementById('lbm-weight').value);
            const h = parseFloat(document.getElementById('lbm-height').value);
            if (!w || !h) {
                document.getElementById('lbm-result').innerHTML = err('Enter weight and height.');
                return;
            }
            const bmi = w / ((h / 100) ** 2);
            const boer = sex === 'male' ? 0.407 * w + 0.267 * h - 19.2 : 0.252 * w + 0.473 * h - 48.3;
            const james = sex === 'male' ? 1.1 * w - 128 * (w / h) ** 2 : 1.07 * w - 148 * (w / h) ** 2;
            const hume = sex === 'male' ? 0.3281 * w + 0.3393 * h - 29.5336 : 0.2944 * w + 0.3916 * h - 33.0877;
            document.getElementById('lbm-result').innerHTML = result(
                row('Boer Formula', `${fmt(boer,1)} kg`) + row('James Formula', `${fmt(james,1)} kg`) + row('Hume Formula', `${fmt(hume,1)} kg`) + row('Average', `${fmt((boer+james+hume)/3,1)} kg`)
            );
            uwuHistory.add('lean-body-mass', {
                lbm: fmt((boer + james + hume) / 3, 1)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('lbm-result').innerHTML = '';
        };
    }

    // ── Healthy Weight ────────────────────────────────────────────────────────

    function renderHealthyWeight(container) {
        container.innerHTML = `
      ${field('hw-height','Height (cm)','number','170')}
      ${btn()}
      <div id="hw-result"></div>`;

        window._calcRun = () => {
            const h = parseFloat(document.getElementById('hw-height').value) / 100;
            if (!h) {
                document.getElementById('hw-result').innerHTML = err('Enter height.');
                return;
            }
            const lo = 18.5 * h * h,
                hi = 24.9 * h * h;
            document.getElementById('hw-result').innerHTML = result(
                row('Healthy Weight Range', `${fmt(lo,1)} kg – ${fmt(hi,1)} kg`) +
                row('In pounds', `${fmt(lo*2.20462,1)} lb – ${fmt(hi*2.20462,1)} lb`) +
                row('BMI Range Used', '18.5 – 24.9')
            );
            uwuHistory.add('healthy-weight', {
                low: fmt(lo, 1),
                high: fmt(hi, 1)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('hw-result').innerHTML = '';
        };
    }

    // ── Overweight ────────────────────────────────────────────────────────────

    function renderOverweight(container) {
        container.innerHTML = `
      ${field('ow-weight','Weight (kg)','number','80')}
      ${field('ow-height','Height (cm)','number','170')}
      ${btn()}
      <div id="ow-result"></div>`;

        window._calcRun = () => {
            const w = parseFloat(document.getElementById('ow-weight').value);
            const h = parseFloat(document.getElementById('ow-height').value) / 100;
            if (!w || !h) {
                document.getElementById('ow-result').innerHTML = err('Enter weight and height.');
                return;
            }
            const bmi = w / (h * h);
            const isOver = bmi >= 25;
            const excessKg = Math.max(0, w - 24.9 * (h * h));
            document.getElementById('ow-result').innerHTML = result(
                row('Your BMI', fmt(bmi, 1)) +
                row('Status', isOver ? 'Overweight (BMI ≥ 25)' : 'Not overweight (BMI < 25)') +
                (isOver ? row('Excess weight above healthy', `${fmt(excessKg,1)} kg`) : '')
            );
            uwuHistory.add('overweight', {
                bmi: fmt(bmi, 1),
                overweight: isOver
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('ow-result').innerHTML = '';
        };
    }

    // ── Anorexic BMI ──────────────────────────────────────────────────────────

    function renderAnorexicBMI(container) {
        container.innerHTML = `
      ${field('ab-weight','Weight (kg)','number','40')}
      ${field('ab-height','Height (cm)','number','165')}
      ${btn()}
      <div id="ab-result"></div>`;

        window._calcRun = () => {
            const w = parseFloat(document.getElementById('ab-weight').value);
            const h = parseFloat(document.getElementById('ab-height').value) / 100;
            if (!w || !h) {
                document.getElementById('ab-result').innerHTML = err('Enter weight and height.');
                return;
            }
            const bmi = w / (h * h);
            let cat = '';
            if (bmi < 15) cat = 'Severely underweight';
            else if (bmi < 17.5) cat = 'Anorexic range (17.5 is clinical threshold)';
            else if (bmi < 18.5) cat = 'Underweight';
            else cat = 'Normal weight range';
            document.getElementById('ab-result').innerHTML = result(row('BMI', fmt(bmi, 1)) + row('Classification', cat));
            uwuHistory.add('anorexic-bmi', {
                bmi: fmt(bmi, 1),
                category: cat
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('ab-result').innerHTML = '';
        };
    }

    // ── Body Surface Area ─────────────────────────────────────────────────────

    function renderBSA(container) {
        container.innerHTML = `
      ${field('bsa-weight','Weight (kg)','number','70')}
      ${field('bsa-height','Height (cm)','number','170')}
      ${btn()}
      <div id="bsa-result"></div>`;

        window._calcRun = () => {
            const w = parseFloat(document.getElementById('bsa-weight').value);
            const h = parseFloat(document.getElementById('bsa-height').value);
            if (!w || !h) {
                document.getElementById('bsa-result').innerHTML = err('Enter weight and height.');
                return;
            }
            const mosteller = Math.sqrt((h * w) / 3600);
            const dubois = 0.007184 * (h ** 0.725) * (w ** 0.425);
            const haycock = 0.024265 * (h ** 0.3964) * (w ** 0.5378);
            document.getElementById('bsa-result').innerHTML = result(
                row('Mosteller Formula', `${fmt(mosteller,3)} m²`) +
                row("DuBois & DuBois", `${fmt(dubois,3)} m²`) +
                row('Haycock Formula', `${fmt(haycock,3)} m²`)
            );
            uwuHistory.add('body-surface-area', {
                mosteller: fmt(mosteller, 3)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('bsa-result').innerHTML = '';
        };
    }

    // ── Body Type ─────────────────────────────────────────────────────────────

    function renderBodyType(container) {
        container.innerHTML = `
      ${field('bt-shoulder','Shoulder width (cm)','number','45')}
      ${field('bt-waist','Waist circumference (cm)','number','80')}
      ${field('bt-hip','Hip circumference (cm)','number','95')}
      ${btn()}
      <div id="bt-result"></div>`;

        window._calcRun = () => {
            const sh = parseFloat(document.getElementById('bt-shoulder').value);
            const wa = parseFloat(document.getElementById('bt-waist').value);
            const hi = parseFloat(document.getElementById('bt-hip').value);
            if (!sh || !wa || !hi) {
                document.getElementById('bt-result').innerHTML = err('Enter all measurements.');
                return;
            }
            let type = '',
                desc = '';
            const sw = sh / wa,
                hw = hi / wa;
            if (sw > 1.15 && hw < 1.05) {
                type = 'Ectomorph (V-shape)';
                desc = 'Narrow waist, broad shoulders, lean build.';
            } else if (sw > 1.05 && hw > 1.05) {
                type = 'Mesomorph (Athletic)';
                desc = 'Muscular and well-built with a high metabolism.';
            } else {
                type = 'Endomorph (Rounder)';
                desc = 'Wider waist/hips, stores fat more easily.';
            }
            document.getElementById('bt-result').innerHTML = result(row('Body Type', type) + row('Description', desc));
            uwuHistory.add('body-type', {
                type
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('bt-result').innerHTML = '';
        };
    }

    // ── Target Heart Rate ─────────────────────────────────────────────────────

    function renderTargetHeartRate(container) {
        container.innerHTML = `
      ${field('thr-age','Age','number','30')}
      ${field('thr-rhr','Resting Heart Rate (bpm, optional)','number','65')}
      ${btn()}
      <div id="thr-result"></div>`;

        window._calcRun = () => {
            const age = parseFloat(document.getElementById('thr-age').value);
            const rhr = parseFloat(document.getElementById('thr-rhr').value) || 0;
            if (!age) {
                document.getElementById('thr-result').innerHTML = err('Enter age.');
                return;
            }
            const mhr = 220 - age;
            const zones = [50, 60, 70, 80, 90].map(p => {
                if (rhr) {
                    const hrr = mhr - rhr;
                    return `${fmt(rhr+hrr*p/100,0)}–${fmt(rhr+hrr*(p+10)/100,0)} bpm`;
                }
                return `${fmt(mhr*p/100,0)}–${fmt(mhr*(p+10)/100,0)} bpm`;
            });
            document.getElementById('thr-result').innerHTML = result(
                row('Max Heart Rate', `${mhr} bpm`) +
                row('Zone 1 (50–60%) Warm-up', zones[0]) +
                row('Zone 2 (60–70%) Fat Burn', zones[1]) +
                row('Zone 3 (70–80%) Aerobic', zones[2]) +
                row('Zone 4 (80–90%) Anaerobic', zones[3]) +
                row('Zone 5 (90–100%) Max', zones[4])
            );
            uwuHistory.add('target-heart-rate', {
                mhr,
                zone2: zones[1]
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('thr-result').innerHTML = '';
        };
    }

    // ── One Rep Max ───────────────────────────────────────────────────────────

    function renderOneRepMax(container) {
        container.innerHTML = `
      ${field('orm-weight','Weight lifted (kg)','number','100')}
      ${field('orm-reps','Repetitions performed','number','5')}
      ${btn()}
      <div id="orm-result"></div>`;

        window._calcRun = () => {
            const w = parseFloat(document.getElementById('orm-weight').value);
            const r = parseInt(document.getElementById('orm-reps').value);
            if (!w || !r || r < 1) {
                document.getElementById('orm-result').innerHTML = err('Enter weight and reps (≥1).');
                return;
            }
            if (r === 1) {
                document.getElementById('orm-result').innerHTML = result(row('1 Rep Max', `${fmt(w,1)} kg (as entered)`));
                return;
            }
            const epley = w * (1 + r / 30);
            const brzycki = w * (36 / (37 - r));
            const lander = (100 * w) / (101.3 - 2.67123 * r);
            const avg = (epley + brzycki + lander) / 3;
            const pcts = [100, 95, 90, 85, 80, 75, 70].map(p => row(`${p}% of 1RM`, `${fmt(avg*p/100,1)} kg`)).join('');
            document.getElementById('orm-result').innerHTML = result(
                row('Epley Formula', `${fmt(epley,1)} kg`) + row('Brzycki Formula', `${fmt(brzycki,1)} kg`) + row('Lander Formula', `${fmt(lander,1)} kg`) + row('Average Estimate', `${fmt(avg,1)} kg`) + pcts
            );
            uwuHistory.add('one-rep-max', {
                estimate: fmt(avg, 1)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('orm-result').innerHTML = '';
        };
    }

    // ── Calories Burned ───────────────────────────────────────────────────────

    function renderCaloriesBurned(container) {
        container.innerHTML = `
      ${field('cb-weight','Weight (kg)','number','70')}
      ${select('cb-activity','Activity',[
        {v:'8',l:'Running (8 km/h)'},
        {v:'11.5',l:'Running (12 km/h)'},
        {v:'3.5',l:'Walking (5 km/h)'},
        {v:'7',l:'Cycling (moderate)'},
        {v:'6',l:'Swimming (moderate)'},
        {v:'5',l:'Jump rope'},
        {v:'4',l:'Yoga'},
        {v:'4.5',l:'Weightlifting'},
        {v:'3',l:'Stretching'},
        {v:'8',l:'Soccer / Football'},
        {v:'6',l:'Basketball'},
        {v:'5',l:'Volleyball'},
        {v:'7',l:'Tennis'}
      ])}
      ${field('cb-duration','Duration (minutes)','number','30')}
      ${btn()}
      <div id="cb-result"></div>`;

        window._calcRun = () => {
            const w = parseFloat(document.getElementById('cb-weight').value);
            const met = parseFloat(document.getElementById('cb-activity').value);
            const dur = parseFloat(document.getElementById('cb-duration').value);
            if (!w || !dur) {
                document.getElementById('cb-result').innerHTML = err('Enter all fields.');
                return;
            }
            const cal = met * w * (dur / 60);
            document.getElementById('cb-result').innerHTML = result(row('Calories Burned', `${fmt(cal,0)} kcal`) + row('Duration', `${dur} min`));
            uwuHistory.add('calories-burned', {
                calories: fmt(cal, 0)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('cb-result').innerHTML = '';
        };
    }

    // ── Macro ─────────────────────────────────────────────────────────────────

    function renderMacro(container) {
        container.innerHTML = `
      ${field('mac-calories','Daily Calorie Goal (kcal)','number','2000')}
      ${select('mac-goal','Macro Split',[
        {v:'balanced',l:'Balanced (30/40/30 P/C/F)'},
        {v:'low-carb',l:'Low Carb (40/20/40 P/C/F)'},
        {v:'high-carb',l:'High Carb (20/55/25 P/C/F)'},
        {v:'keto',l:'Keto (25/5/70 P/C/F)'},
        {v:'custom',l:'Custom (enter below)'}
      ])}
      <div id="mac-custom" style="display:none">
        ${field('mac-p','Protein %','number','30')}
        ${field('mac-c','Carbs %','number','40')}
        ${field('mac-f','Fat %','number','30')}
      </div>
      ${btn()}
      <div id="mac-result"></div>`;

        document.getElementById('mac-goal').addEventListener('change', e => {
            document.getElementById('mac-custom').style.display = e.target.value === 'custom' ? '' : 'none';
        });

        window._calcRun = () => {
            const cal = parseFloat(document.getElementById('mac-calories').value);
            const goal = document.getElementById('mac-goal').value;
            if (!cal) {
                document.getElementById('mac-result').innerHTML = err('Enter calorie goal.');
                return;
            }
            const splits = {
                balanced: [30, 40, 30],
                'low-carb': [40, 20, 40],
                'high-carb': [20, 55, 25],
                keto: [25, 5, 70]
            };
            let p, c, f;
            if (goal === 'custom') {
                p = parseFloat(document.getElementById('mac-p').value) || 30;
                c = parseFloat(document.getElementById('mac-c').value) || 40;
                f = parseFloat(document.getElementById('mac-f').value) || 30;
            } else {
                [p, c, f] = splits[goal];
            }
            const pg = cal * p / 100 / 4,
                cg = cal * c / 100 / 4,
                fg = cal * f / 100 / 9;
            document.getElementById('mac-result').innerHTML = result(
                row('Protein', `${fmt(pg,0)} g/day (${p}%)`) +
                row('Carbohydrates', `${fmt(cg,0)} g/day (${c}%)`) +
                row('Fat', `${fmt(fg,0)} g/day (${f}%)`)
            );
            uwuHistory.add('macro', {
                protein: fmt(pg, 0),
                carbs: fmt(cg, 0),
                fat: fmt(fg, 0)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('mac-result').innerHTML = '';
        };
    }

    // ── Protein ───────────────────────────────────────────────────────────────

    function renderProtein(container) {
        container.innerHTML = `
      ${field('prot-weight','Body Weight (kg)','number','70')}
      ${select('prot-goal','Activity / Goal',[
        {v:'0.8',l:'Sedentary (0.8 g/kg)'},
        {v:'1.2',l:'Lightly active (1.2 g/kg)'},
        {v:'1.6',l:'Moderately active (1.6 g/kg)'},
        {v:'2.0',l:'Athlete / muscle gain (2.0 g/kg)'},
        {v:'2.4',l:'Bodybuilder / cutting (2.4 g/kg)'}
      ])}
      ${btn()}
      <div id="prot-result"></div>`;

        window._calcRun = () => {
            const w = parseFloat(document.getElementById('prot-weight').value);
            const r = parseFloat(document.getElementById('prot-goal').value);
            if (!w) {
                document.getElementById('prot-result').innerHTML = err('Enter body weight.');
                return;
            }
            const g = w * r;
            document.getElementById('prot-result').innerHTML = result(
                row('Daily Protein', `${fmt(g,0)} g/day`) + row('Rate used', `${r} g per kg of body weight`) + row('Calories from protein', `${fmt(g*4,0)} kcal`)
            );
            uwuHistory.add('protein', {
                protein: fmt(g, 0)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('prot-result').innerHTML = '';
        };
    }

    // ── Carbohydrate ──────────────────────────────────────────────────────────

    function renderCarbohydrate(container) {
        container.innerHTML = `
      ${field('carb-calories','Daily Calorie Intake (kcal)','number','2000')}
      ${select('carb-goal','Goal',[
        {v:'0.5',l:'Low carb (50% of calories)'},
        {v:'0.45',l:'Moderate (45% of calories)'},
        {v:'0.55',l:'High carb (55% of calories)'},
        {v:'0.05',l:'Keto (5% of calories)'}
      ])}
      ${btn()}
      <div id="carb-result"></div>`;

        window._calcRun = () => {
            const cal = parseFloat(document.getElementById('carb-calories').value);
            const pct = parseFloat(document.getElementById('carb-goal').value);
            if (!cal) {
                document.getElementById('carb-result').innerHTML = err('Enter calories.');
                return;
            }
            const g = cal * pct / 4;
            document.getElementById('carb-result').innerHTML = result(row('Daily Carbohydrates', `${fmt(g,0)} g`) + row('Calories from carbs', `${fmt(cal*pct,0)} kcal`));
            uwuHistory.add('carbohydrate', {
                carbs: fmt(g, 0)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('carb-result').innerHTML = '';
        };
    }

    // ── Fat Intake ────────────────────────────────────────────────────────────

    function renderFatIntake(container) {
        container.innerHTML = `
      ${field('fat-calories','Daily Calorie Intake (kcal)','number','2000')}
      ${select('fat-goal','Fat %',[
        {v:'0.25',l:'Low fat (25%)'},
        {v:'0.30',l:'Moderate (30%)'},
        {v:'0.35',l:'Higher fat (35%)'},
        {v:'0.70',l:'Keto (70%)'}
      ])}
      ${btn()}
      <div id="fat-result"></div>`;

        window._calcRun = () => {
            const cal = parseFloat(document.getElementById('fat-calories').value);
            const pct = parseFloat(document.getElementById('fat-goal').value);
            if (!cal) {
                document.getElementById('fat-result').innerHTML = err('Enter calories.');
                return;
            }
            const g = cal * pct / 9;
            document.getElementById('fat-result').innerHTML = result(row('Daily Fat', `${fmt(g,0)} g`) + row('Calories from fat', `${fmt(cal*pct,0)} kcal`));
            uwuHistory.add('fat-intake', {
                fat: fmt(g, 0)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('fat-result').innerHTML = '';
        };
    }

    // ── Pace ──────────────────────────────────────────────────────────────────

    function renderPace(container) {
        container.innerHTML = `
      ${select('pace-solve','Solve for',[
        {v:'pace',l:'Pace (from distance + time)'},
        {v:'time',l:'Time (from distance + pace)'},
        {v:'distance',l:'Distance (from time + pace)'}
      ])}
      <div id="pace-dist">${field('pace-distance','Distance (km)','number','10')}</div>
      <div id="pace-time">
        ${field('pace-h','Hours','number','0')}
        ${field('pace-m','Minutes','number','55')}
        ${field('pace-s','Seconds','number','0')}
      </div>
      <div id="pace-pace">
        ${field('pace-min','Pace (min/km) - Minutes','number','5')}
        ${field('pace-sec','Pace (min/km) - Seconds','number','30')}
      </div>
      ${btn()}
      <div id="pace-result"></div>`;

        window._calcRun = () => {
            const solve = document.getElementById('pace-solve').value;
            if (solve === 'pace') {
                const d = parseFloat(document.getElementById('pace-distance').value);
                const h = parseFloat(document.getElementById('pace-h').value) || 0;
                const m = parseFloat(document.getElementById('pace-m').value) || 0;
                const s = parseFloat(document.getElementById('pace-s').value) || 0;
                const total = h * 60 + m + s / 60;
                if (!d || !total) {
                    document.getElementById('pace-result').innerHTML = err('Enter distance and time.');
                    return;
                }
                const pace = total / d;
                const pm = Math.floor(pace),
                    ps = Math.round((pace - pm) * 60);
                document.getElementById('pace-result').innerHTML = result(row('Pace', `${pm}:${String(ps).padStart(2,'0')} /km`) + row('Speed', `${fmt(d/(total/60),2)} km/h`));
                uwuHistory.add('pace', {
                    pace: `${pm}:${String(ps).padStart(2,'0')}/km`
                });
            } else if (solve === 'time') {
                const d = parseFloat(document.getElementById('pace-distance').value);
                const pm = parseFloat(document.getElementById('pace-min').value) || 0;
                const ps = parseFloat(document.getElementById('pace-sec').value) || 0;
                const pace = pm + ps / 60;
                if (!d || !pace) {
                    document.getElementById('pace-result').innerHTML = err('Enter distance and pace.');
                    return;
                }
                const total = pace * d;
                const th = Math.floor(total / 60),
                    tm = Math.floor(total % 60),
                    ts = Math.round((total % 1) * 60);
                document.getElementById('pace-result').innerHTML = result(row('Total Time', `${th}h ${tm}m ${ts}s`));
                uwuHistory.add('pace', {
                    time: `${th}h ${tm}m ${ts}s`
                });
            } else {
                const h = parseFloat(document.getElementById('pace-h').value) || 0;
                const m = parseFloat(document.getElementById('pace-m').value) || 0;
                const s = parseFloat(document.getElementById('pace-s').value) || 0;
                const pm = parseFloat(document.getElementById('pace-min').value) || 0;
                const ps = parseFloat(document.getElementById('pace-sec').value) || 0;
                const total = h * 60 + m + s / 60,
                    pace = pm + ps / 60;
                if (!total || !pace) {
                    document.getElementById('pace-result').innerHTML = err('Enter time and pace.');
                    return;
                }
                const dist = total / pace;
                document.getElementById('pace-result').innerHTML = result(row('Distance', `${fmt(dist,2)} km`));
                uwuHistory.add('pace', {
                    distance: fmt(dist, 2)
                });
            }
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('pace-result').innerHTML = '';
        };
    }

    // ── Pregnancy ─────────────────────────────────────────────────────────────

    function renderPregnancy(container) {
        container.innerHTML = `
      ${select('preg-method','Known date type',[
        {v:'lmp',l:'Last Menstrual Period (LMP)'},
        {v:'conception',l:'Conception Date'},
        {v:'ivf',l:'IVF Transfer Date'}
      ])}
      ${field('preg-date','Date','date')}
      ${btn()}
      <div id="preg-result"></div>`;

        window._calcRun = () => {
            const method = document.getElementById('preg-method').value;
            const dateVal = document.getElementById('preg-date').value;
            if (!dateVal) {
                document.getElementById('preg-result').innerHTML = err('Enter a date.');
                return;
            }
            let lmp = new Date(dateVal);
            if (method === 'conception') lmp = new Date(lmp.getTime() - 14 * 86400000);
            else if (method === 'ivf') lmp = new Date(lmp.getTime() - 17 * 86400000);
            const due = new Date(lmp.getTime() + 280 * 86400000);
            const today = new Date();
            const daysLeft = Math.ceil((due - today) / 86400000);
            const weeksPreg = Math.floor((today - lmp) / 604800000);
            document.getElementById('preg-result').innerHTML = result(
                row('Estimated Due Date', due.toDateString()) +
                row('Weeks Pregnant (today)', `${weeksPreg} weeks`) +
                row('Days Until Due', daysLeft > 0 ? `${daysLeft} days` : 'Past due date')
            );
            uwuHistory.add('pregnancy', {
                due: due.toDateString()
            });
        };
        window._calcReset = () => {
            document.getElementById('preg-date').value = '';
            document.getElementById('preg-result').innerHTML = '';
        };
    }

    // ── Pregnancy Conception ──────────────────────────────────────────────────

    function renderPregnancyConception(container) {
        container.innerHTML = `
      ${field('pc-due','Estimated Due Date','date')}
      ${btn()}
      <div id="pc-result"></div>`;

        window._calcRun = () => {
            const dueVal = document.getElementById('pc-due').value;
            if (!dueVal) {
                document.getElementById('pc-result').innerHTML = err('Enter due date.');
                return;
            }
            const due = new Date(dueVal);
            const lmp = new Date(due.getTime() - 280 * 86400000);
            const conception = new Date(lmp.getTime() + 14 * 86400000);
            document.getElementById('pc-result').innerHTML = result(
                row('Estimated Conception Date', conception.toDateString()) +
                row('Last Menstrual Period (LMP)', lmp.toDateString())
            );
            uwuHistory.add('pregnancy-conception', {
                conception: conception.toDateString()
            });
        };
        window._calcReset = () => {
            document.getElementById('pc-due').value = '';
            document.getElementById('pc-result').innerHTML = '';
        };
    }

    // ── Pregnancy Weight Gain ─────────────────────────────────────────────────

    function renderPregnancyWeightGain(container) {
        container.innerHTML = `
      ${select('pwg-bmi','Pre-pregnancy BMI Category',[
        {v:'underweight',l:'Underweight (BMI < 18.5)'},
        {v:'normal',l:'Normal weight (BMI 18.5–24.9)'},
        {v:'overweight',l:'Overweight (BMI 25–29.9)'},
        {v:'obese',l:'Obese (BMI ≥ 30)'}
      ])}
      ${select('pwg-twins','Carrying',[{v:'single',l:'Single baby'},{v:'twins',l:'Twins'}])}
      ${btn()}
      <div id="pwg-result"></div>`;

        window._calcRun = () => {
            const bmi = document.getElementById('pwg-bmi').value;
            const twins = document.getElementById('pwg-twins').value === 'twins';
            const ranges = {
                underweight: [12.7, 18.1],
                normal: [11.3, 15.9],
                overweight: [6.8, 11.3],
                obese: [5, 9.1]
            };
            const twinRanges = {
                underweight: [17, 24.5],
                normal: [16.8, 24.5],
                overweight: [14.1, 22.7],
                obese: [11.3, 19.1]
            };
            const [lo, hi] = (twins ? twinRanges : ranges)[bmi];
            document.getElementById('pwg-result').innerHTML = result(
                row('Recommended Weight Gain', `${lo} – ${hi} kg`) +
                row('In pounds', `${fmt(lo*2.20462,0)} – ${fmt(hi*2.20462,0)} lb`)
            );
            uwuHistory.add('pregnancy-weight-gain', {
                range: `${lo}–${hi} kg`
            });
        };
        window._calcReset = () => {
            document.getElementById('pwg-result').innerHTML = '';
        };
    }

    // ── Due Date ──────────────────────────────────────────────────────────────

    function renderDueDate(container) {
        container.innerHTML = `
      ${select('dd-method','Calculation Method',[
        {v:'lmp',l:'Last Menstrual Period'},
        {v:'conception',l:'Conception Date'},
        {v:'ultrasound',l:'Ultrasound Date + Weeks/Days'}
      ])}
      ${field('dd-date','Date','date')}
      <div id="dd-ultra" style="display:none">
        ${field('dd-weeks','Gestational weeks at ultrasound','number','8')}
        ${field('dd-days','Extra days','number','0')}
      </div>
      ${btn()}
      <div id="dd-result"></div>`;

        document.getElementById('dd-method').addEventListener('change', e => {
            document.getElementById('dd-ultra').style.display = e.target.value === 'ultrasound' ? '' : 'none';
        });

        window._calcRun = () => {
            const method = document.getElementById('dd-method').value;
            const dateVal = document.getElementById('dd-date').value;
            if (!dateVal) {
                document.getElementById('dd-result').innerHTML = err('Enter date.');
                return;
            }
            const d = new Date(dateVal);
            let due;
            if (method === 'lmp') due = new Date(d.getTime() + 280 * 86400000);
            else if (method === 'conception') due = new Date(d.getTime() + 266 * 86400000);
            else {
                const w = parseFloat(document.getElementById('dd-weeks').value) || 0;
                const dy = parseFloat(document.getElementById('dd-days').value) || 0;
                const gestDays = w * 7 + dy;
                due = new Date(d.getTime() + (280 - gestDays) * 86400000);
            }
            const today = new Date();
            const daysLeft = Math.ceil((due - today) / 86400000);
            const weeksPr = Math.floor((today - new Date(due.getTime() - 280 * 86400000)) / 604800000);
            document.getElementById('dd-result').innerHTML = result(
                row('Estimated Due Date', due.toDateString()) +
                row('Days remaining', daysLeft > 0 ? `${daysLeft} days` : 'Past due date') +
                row('Weeks pregnant', `${weeksPr} weeks`)
            );
            uwuHistory.add('due-date', {
                due: due.toDateString()
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('dd-result').innerHTML = '';
        };
    }

    // ── Period ────────────────────────────────────────────────────────────────

    function renderPeriod(container) {
        container.innerHTML = `
      ${field('per-last','Last period start date','date')}
      ${field('per-cycle','Cycle length (days)','number','28')}
      ${field('per-duration','Period duration (days)','number','5')}
      ${btn()}
      <div id="per-result"></div>`;

        window._calcRun = () => {
            const lastVal = document.getElementById('per-last').value;
            const cycle = parseInt(document.getElementById('per-cycle').value) || 28;
            const dur = parseInt(document.getElementById('per-duration').value) || 5;
            if (!lastVal) {
                document.getElementById('per-result').innerHTML = err('Enter last period date.');
                return;
            }
            const last = new Date(lastVal);
            const rows = [];
            for (let i = 1; i <= 4; i++) {
                const next = new Date(last.getTime() + cycle * i * 86400000);
                const end = new Date(next.getTime() + (dur - 1) * 86400000);
                rows.push(row(`Period ${i}`, `${next.toDateString()} – ${end.toDateString()}`));
            }
            const ovulation = new Date(last.getTime() + (cycle - 14) * 86400000);
            document.getElementById('per-result').innerHTML = result(rows.join('') + row('Next ovulation (est.)', ovulation.toDateString()));
            uwuHistory.add('period', {
                next: new Date(last.getTime() + cycle * 86400000).toDateString()
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('per-result').innerHTML = '';
        };
    }

    // ── Ovulation ─────────────────────────────────────────────────────────────

    function renderOvulation(container) {
        container.innerHTML = `
      ${field('ov-lmp','Last Menstrual Period','date')}
      ${field('ov-cycle','Cycle Length (days)','number','28')}
      ${btn()}
      <div id="ov-result"></div>`;

        window._calcRun = () => {
            const lmpVal = document.getElementById('ov-lmp').value;
            const cycle = parseInt(document.getElementById('ov-cycle').value) || 28;
            if (!lmpVal) {
                document.getElementById('ov-result').innerHTML = err('Enter LMP date.');
                return;
            }
            const lmp = new Date(lmpVal);
            const ovulation = new Date(lmp.getTime() + (cycle - 14) * 86400000);
            const fertileStart = new Date(ovulation.getTime() - 5 * 86400000);
            const fertileEnd = new Date(ovulation.getTime() + 1 * 86400000);
            document.getElementById('ov-result').innerHTML = result(
                row('Ovulation Date', ovulation.toDateString()) +
                row('Fertile Window', `${fertileStart.toDateString()} – ${fertileEnd.toDateString()}`) +
                row('Next Period (est.)', new Date(lmp.getTime() + cycle * 86400000).toDateString())
            );
            uwuHistory.add('ovulation', {
                ovulation: ovulation.toDateString()
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('ov-result').innerHTML = '';
        };
    }

    // ── Height ────────────────────────────────────────────────────────────────

    function renderHeight(container) {
        container.innerHTML = `
      <p style="margin-bottom:12px;font-size:14px;opacity:0.8">Height prediction based on mid-parental height formula.</p>
      ${select('hgt-sex','Child\'s Sex',[{v:'male',l:'Boy'},{v:'female',l:'Girl'}])}
      ${field('hgt-father','Father\'s Height (cm)','number','175')}
      ${field('hgt-mother','Mother\'s Height (cm)','number','163')}
      ${btn()}
      <div id="hgt-result"></div>`;

        window._calcRun = () => {
            const sex = document.getElementById('hgt-sex').value;
            const fa = parseFloat(document.getElementById('hgt-father').value);
            const mo = parseFloat(document.getElementById('hgt-mother').value);
            if (!fa || !mo) {
                document.getElementById('hgt-result').innerHTML = err('Enter both parents\' heights.');
                return;
            }
            const mid = (fa + mo) / 2;
            const pred = sex === 'male' ? mid + 6.5 : mid - 6.5;
            document.getElementById('hgt-result').innerHTML = result(
                row('Predicted Height', `${fmt(pred,0)} cm (${fmt(pred/2.54/12,0)}'${Math.round((pred/2.54)%12)}")`) +
                row('Range', `${fmt(pred-5,0)} – ${fmt(pred+5,0)} cm`)
            );
            uwuHistory.add('height', {
                prediction: fmt(pred, 0)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('hgt-result').innerHTML = '';
        };
    }

    // ── Sleep ─────────────────────────────────────────────────────────────────

    function renderSleep(container) {
        container.innerHTML = `
      ${select('sl-mode','I want to',[
        {v:'wake',l:'Wake up at a specific time'},
        {v:'sleep',l:'Go to bed now / at a specific time'}
      ])}
      ${field('sl-time','Time','time','07:00')}
      ${btn()}
      <div id="sl-result"></div>`;

        window._calcRun = () => {
            const mode = document.getElementById('sl-mode').value;
            const timeVal = document.getElementById('sl-time').value || '07:00';
            const [hh, mm] = timeVal.split(':').map(Number);
            const base = hh * 60 + mm;
            const cycle = 90; // minutes per sleep cycle
            const rows = [];
            for (let c = 5; c >= 1; c--) {
                let t;
                if (mode === 'wake') t = base - c * cycle - 15; // 15 min to fall asleep
                else t = base + c * cycle + 15;
                t = ((t % 1440) + 1440) % 1440;
                const th = Math.floor(t / 60) % 24,
                    tm = t % 60;
                const label = `${c} cycle${c>1?'s':''} (${c*1.5}h)`;
                rows.push(row(label, `${String(th).padStart(2,'0')}:${String(tm).padStart(2,'0')}`));
            }
            document.getElementById('sl-result').innerHTML = result(
                `<p style="margin-bottom:8px;font-size:13px;opacity:0.8">Recommended: 5–6 cycles (7.5–9 hours). Each cycle = 90 min.</p>` + rows.join('')
            );
            uwuHistory.add('sleep', {
                mode,
                time: timeVal
            });
        };
        window._calcReset = () => {
            document.getElementById('sl-result').innerHTML = '';
        };
    }

    // ── GFR ───────────────────────────────────────────────────────────────────

    function renderGFR(container) {
        container.innerHTML = `
      ${field('gfr-creatinine','Serum Creatinine (mg/dL)','number','1.0')}
      ${field('gfr-age','Age','number','40')}
      ${select('gfr-sex','Sex',[{v:'male',l:'Male'},{v:'female',l:'Female'}])}
      ${select('gfr-race','Race',[{v:'other',l:'Non-Black'},{v:'black',l:'Black/African American'}])}
      ${btn()}
      <div id="gfr-result"></div>`;

        window._calcRun = () => {
            const cr = parseFloat(document.getElementById('gfr-creatinine').value);
            const age = parseFloat(document.getElementById('gfr-age').value);
            const sex = document.getElementById('gfr-sex').value;
            const race = document.getElementById('gfr-race').value;
            if (!cr || !age) {
                document.getElementById('gfr-result').innerHTML = err('Enter creatinine and age.');
                return;
            }
            // CKD-EPI equation
            const k = sex === 'female' ? 0.7 : 0.9,
                alpha = sex === 'female' ? -0.241 : -0.302;
            const s = sex === 'female' ? 1.012 : 1,
                r = race === 'black' ? 1.159 : 1;
            const ratio = cr / k;
            let gfr = 142 * (Math.min(ratio, 1) ** alpha) * (Math.max(ratio, 1) ** -1.200) * (0.9938 ** age) * s * r;
            let stage = '';
            if (gfr >= 90) stage = 'G1 – Normal or high';
            else if (gfr >= 60) stage = 'G2 – Mildly decreased';
            else if (gfr >= 45) stage = 'G3a – Mildly to moderately decreased';
            else if (gfr >= 30) stage = 'G3b – Moderately to severely decreased';
            else if (gfr >= 15) stage = 'G4 – Severely decreased';
            else stage = 'G5 – Kidney failure';
            document.getElementById('gfr-result').innerHTML = result(row('eGFR', `${fmt(gfr,1)} mL/min/1.73m²`) + row('CKD Stage', stage));
            uwuHistory.add('gfr', {
                gfr: fmt(gfr, 1),
                stage
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('gfr-result').innerHTML = '';
        };
    }

    // ── BAC ───────────────────────────────────────────────────────────────────

    function renderBAC(container) {
        container.innerHTML = `
      ${field('bac-weight','Body Weight (kg)','number','70')}
      ${select('bac-sex','Sex',[{v:'0.68',l:'Male'},{v:'0.55',l:'Female'}])}
      ${field('bac-drinks','Number of Drinks (1 standard drink = 14g alcohol)','number','2')}
      ${field('bac-hours','Hours since first drink','number','1')}
      ${btn()}
      <div id="bac-result"></div>`;

        window._calcRun = () => {
            const w = parseFloat(document.getElementById('bac-weight').value);
            const r = parseFloat(document.getElementById('bac-sex').value);
            const drinks = parseFloat(document.getElementById('bac-drinks').value);
            const hrs = parseFloat(document.getElementById('bac-hours').value) || 0;
            if (!w || !drinks) {
                document.getElementById('bac-result').innerHTML = err('Enter weight and drinks.');
                return;
            }
            const totalAlc = drinks * 14; // grams
            const bac = (totalAlc / (w * 1000 * r)) * 100 - 0.015 * hrs;
            const bacFinal = Math.max(0, bac);
            let effect = '';
            if (bacFinal < 0.02) effect = 'Little to no effect';
            else if (bacFinal < 0.05) effect = 'Mild relaxation, slight impairment';
            else if (bacFinal < 0.08) effect = 'Impaired judgement, coordination';
            else if (bacFinal < 0.15) effect = 'Clearly drunk, significant impairment';
            else if (bacFinal < 0.30) effect = 'Very impaired, risk of blackout';
            else effect = 'Potentially life-threatening';
            const soberIn = bacFinal / 0.015;
            document.getElementById('bac-result').innerHTML = result(
                row('Estimated BAC', `${fmt(bacFinal,3)}%`) + row('Effect', effect) + row('Sober in approx.', `${fmt(soberIn,1)} hours`)
            );
            uwuHistory.add('bac', {
                bac: fmt(bacFinal, 3)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('bac-result').innerHTML = '';
        };
    }

    // ── Weight Watcher Points ─────────────────────────────────────────────────

    function renderWeightWatcherPoints(container) {
        container.innerHTML = `
      ${field('wwp-cal','Calories','number','300')}
      ${field('wwp-fat','Total Fat (g)','number','10')}
      ${field('wwp-fiber','Dietary Fiber (g)','number','5')}
      ${field('wwp-protein','Protein (g)','number','15')}
      ${btn()}
      <div id="wwp-result"></div>`;

        window._calcRun = () => {
            const cal = parseFloat(document.getElementById('wwp-cal').value) || 0;
            const fat = parseFloat(document.getElementById('wwp-fat').value) || 0;
            const fiber = Math.min(parseFloat(document.getElementById('wwp-fiber').value) || 0, 4);
            const protein = parseFloat(document.getElementById('wwp-protein').value) || 0;
            const points = (cal / 50) + (fat / 12) - (fiber / 5) - (protein / 10);
            document.getElementById('wwp-result').innerHTML = result(row('Points (classic formula)', `${fmt(Math.max(0,points),1)}`));
            uwuHistory.add('weight-watcher-points', {
                points: fmt(points, 1)
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('wwp-result').innerHTML = '';
        };
    }

    // ── Golf Handicap ─────────────────────────────────────────────────────────

    function renderGolfHandicap(container) {
        container.innerHTML = `
      <p style="margin-bottom:12px;font-size:14px;opacity:0.8">Enter up to 20 score differentials. A score differential = (Adjusted Gross Score − Course Rating) × 113 / Slope Rating.</p>
      ${field('gh-scores','Score differentials (comma-separated)','text','5.2,7.1,4.8,6.3,5.9')}
      ${btn()}
      <div id="gh-result"></div>`;

        window._calcRun = () => {
            const raw = document.getElementById('gh-scores').value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
            if (raw.length < 3) {
                document.getElementById('gh-result').innerHTML = err('Enter at least 3 score differentials.');
                return;
            }
            raw.sort((a, b) => a - b);
            let count;
            const n = raw.length;
            if (n <= 6) count = 1;
            else if (n <= 8) count = 2;
            else if (n <= 11) count = 3;
            else if (n <= 14) count = 4;
            else if (n <= 16) count = 5;
            else if (n <= 18) count = 6;
            else if (n <= 19) count = 7;
            else count = 8;
            const best = raw.slice(0, count);
            const avg = best.reduce((a, b) => a + b, 0) / count;
            const handicap = avg * 0.96;
            document.getElementById('gh-result').innerHTML = result(
                row('Scores entered', n) + row('Best differentials used', count) + row('Average of best', fmt(avg, 1)) + row('Handicap Index', fmt(handicap, 1))
            );
            uwuHistory.add('golf-handicap', {
                handicap: fmt(handicap, 1)
            });
        };
        window._calcReset = () => {
            document.getElementById('gh-scores').value = '';
            document.getElementById('gh-result').innerHTML = '';
        };
    }

    // ── Bra Size ──────────────────────────────────────────────────────────────

    function renderBraSize(container) {
        container.innerHTML = `
      ${select('bra-unit','Unit',[{v:'in',l:'Inches'},{v:'cm',l:'Centimetres'}])}
      ${field('bra-band','Band measurement (under bust)','number','32')}
      ${field('bra-bust','Bust measurement (fullest part)','number','36')}
      ${btn()}
      <div id="bra-result"></div>`;

        window._calcRun = () => {
            let band = parseFloat(document.getElementById('bra-band').value);
            let bust = parseFloat(document.getElementById('bra-bust').value);
            const unit = document.getElementById('bra-unit').value;
            if (!band || !bust) {
                document.getElementById('bra-result').innerHTML = err('Enter measurements.');
                return;
            }
            if (unit === 'cm') {
                band /= 2.54;
                bust /= 2.54;
            }
            const bandSize = band % 2 === 0 ? band + 4 : band + 5;
            const cupDiff = bust - bandSize;
            const cups = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'G', 'H', 'I', 'J'];
            const cup = cups[Math.max(0, Math.min(Math.round(cupDiff), cups.length - 1))] || 'J+';
            document.getElementById('bra-result').innerHTML = result(row('Band Size', `${Math.round(bandSize)}`) + row('Cup Size', cup) + row('US Bra Size', `${Math.round(bandSize)}${cup}`));
            uwuHistory.add('bra-size', {
                size: `${Math.round(bandSize)}${cup}`
            });
        };
        window._calcReset = () => {
            container.querySelectorAll('input').forEach(i => i.value = '');
            document.getElementById('bra-result').innerHTML = '';
        };
    }

    // ── Alias map ─────────────────────────────────────────────────────────────

    const ALIAS = {
        'bmi': renderBMI,
        'bmr': renderBMR,
        'calorie': renderCalorie,
        'tdee': renderTDEE,
        'body-fat': renderBodyFat,
        'ideal-weight': renderIdealWeight,
        'lean-body-mass': renderLBM,
        'healthy-weight': renderHealthyWeight,
        'overweight': renderOverweight,
        'anorexic-bmi': renderAnorexicBMI,
        'body-surface-area': renderBSA,
        'body-type': renderBodyType,
        'target-heart-rate': renderTargetHeartRate,
        'one-rep-max': renderOneRepMax,
        'calories-burned': renderCaloriesBurned,
        'macro': renderMacro,
        'protein': renderProtein,
        'carbohydrate': renderCarbohydrate,
        'fat-intake': renderFatIntake,
        'pace': renderPace,
        'pregnancy': renderPregnancy,
        'pregnancy-conception': renderPregnancyConception,
        'pregnancy-weight-gain': renderPregnancyWeightGain,
        'due-date': renderDueDate,
        'period': renderPeriod,
        'ovulation': renderOvulation,
        'height': renderHeight,
        'sleep': renderSleep,
        'gfr': renderGFR,
        'bac': renderBAC,
        'weight-watcher-points': renderWeightWatcherPoints,
        'golf-handicap': renderGolfHandicap,
        'bra-size': renderBraSize,
    };

    return {
        render(calc, container) {
            const fn = ALIAS[calc.slug];
            if (fn) {
                fn(container);
                return;
            }
            // Fallback
            container.innerHTML = `<div class="calc-error">Calculator <strong>${calc.name}</strong> is not yet implemented in this engine.</div>`;
        }
    };
})();