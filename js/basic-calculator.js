// js/basic-calculator.js - Basic and Scientific calculator engine

let calcState = {
    current: '0',
    previous: '',
    operator: null,
    waitingForOperand: false,
    expression: '',
    sciFuncPending: null,
};

function updateDisplay() {
    const result = document.getElementById('calcResult');
    const expr = document.getElementById('calcExpression');
    if (result) result.textContent = calcState.current;
    if (expr) expr.textContent = calcState.expression;
}

function calcNum(digit) {
    if (calcState.waitingForOperand) {
        calcState.current = digit;
        calcState.waitingForOperand = false;
    } else {
        calcState.current = calcState.current === '0' ? digit : calcState.current + digit;
    }
    // Limit display length
    if (calcState.current.replace('.', '').replace('-', '').length > 14) return;
    updateDisplay();
}

function calcDecimal() {
    if (calcState.waitingForOperand) {
        calcState.current = '0.';
        calcState.waitingForOperand = false;
        updateDisplay();
        return;
    }
    if (!calcState.current.includes('.')) {
        calcState.current += '.';
        updateDisplay();
    }
}

function calcOp(op) {
    const cur = parseFloat(calcState.current);
    if (calcState.operator && !calcState.waitingForOperand) {
        const prev = parseFloat(calcState.previous);
        const result = operate(prev, cur, calcState.operator);
        calcState.current = formatResult(result);
        calcState.expression = `${formatResult(result)} ${opSymbol(op)}`;
        calcState.previous = calcState.current;
    } else {
        calcState.previous = calcState.current;
        calcState.expression = `${calcState.current} ${opSymbol(op)}`;
    }
    calcState.operator = op;
    calcState.waitingForOperand = true;
    updateDisplay();
}

function calcEquals() {
    if (!calcState.operator || calcState.waitingForOperand) return;
    const prev = parseFloat(calcState.previous);
    const cur = parseFloat(calcState.current);
    const result = operate(prev, cur, calcState.operator);
    calcState.expression = `${calcState.previous} ${opSymbol(calcState.operator)} ${calcState.current} =`;
    calcState.current = formatResult(result);
    calcState.operator = null;
    calcState.waitingForOperand = true;
    updateDisplay();
}

function operate(a, b, op) {
    switch (op) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return b === 0 ? NaN : a / b;
        case 'pow':
            return Math.pow(a, b);
        default:
            return b;
    }
}

function opSymbol(op) {
    const map = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷',
        'pow': '^'
    };
    return map[op] || op;
}

function formatResult(n) {
    if (isNaN(n)) return 'Error';
    if (!isFinite(n)) return n > 0 ? 'Infinity' : '-Infinity';
    if (Math.abs(n) >= 1e15 || (Math.abs(n) < 1e-10 && n !== 0)) {
        return n.toExponential(6).replace(/\.?0+e/, 'e');
    }
    const str = parseFloat(n.toPrecision(12)).toString();
    return str;
}

function calcClear() {
    calcState = {
        current: '0',
        previous: '',
        operator: null,
        waitingForOperand: false,
        expression: '',
        sciFuncPending: null
    };
    updateDisplay();
}

function calcSign() {
    if (calcState.current === '0') return;
    calcState.current = calcState.current.startsWith('-') ?
        calcState.current.slice(1) :
        '-' + calcState.current;
    updateDisplay();
}

function calcPercent() {
    const n = parseFloat(calcState.current);
    calcState.current = formatResult(n / 100);
    calcState.waitingForOperand = true;
    updateDisplay();
}

function calcBackspace() {
    if (calcState.waitingForOperand) return;
    calcState.current = calcState.current.length > 1 ? calcState.current.slice(0, -1) : '0';
    updateDisplay();
}

function calcSci(fn) {
    const n = parseFloat(calcState.current);
    let result;
    switch (fn) {
        case 'sin':
            result = Math.sin(degToRad(n));
            break;
        case 'cos':
            result = Math.cos(degToRad(n));
            break;
        case 'tan':
            result = Math.tan(degToRad(n));
            break;
        case 'log':
            result = n <= 0 ? NaN : Math.log10(n);
            break;
        case 'ln':
            result = n <= 0 ? NaN : Math.log(n);
            break;
        case 'sqrt':
            result = n < 0 ? NaN : Math.sqrt(n);
            break;
        case 'sq':
            result = Math.pow(n, 2);
            break;
        case 'inv':
            result = n === 0 ? NaN : 1 / n;
            break;
        case 'pi':
            calcState.current = Math.PI.toString();
            calcState.expression = 'π';
            updateDisplay();
            return;
        case 'e':
            calcState.current = Math.E.toString();
            calcState.expression = 'e';
            updateDisplay();
            return;
        case 'abs':
            result = Math.abs(n);
            break;
        case 'fact':
            result = factorial(Math.round(Math.abs(n)));
            break;
        case 'exp':
            calcOp('*');
            calcNum('1');
            calcSci_exp();
            return;
        case 'pow':
            calcOp('pow');
            return;
        default:
            return;
    }
    calcState.expression = `${fn}(${calcState.current})`;
    calcState.current = formatResult(result);
    calcState.waitingForOperand = true;
    updateDisplay();
}

function calcSci_exp() {
    // EXP key = × 10^...
    calcState.current = '10';
    updateDisplay();
}

function degToRad(d) {
    return d * Math.PI / 180;
}

function factorial(n) {
    if (n > 170) return Infinity;
    if (n <= 1) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

function switchCalcMode(mode) {
    const basicPanel = document.getElementById('basicPanel');
    const sciPanel = document.getElementById('sciPanel');
    const tabBasic = document.getElementById('tabBasic');
    const tabSci = document.getElementById('tabSci');
    if (mode === 'basic') {
        basicPanel.style.display = '';
        sciPanel.style.display = 'none';
        tabBasic.classList.add('active');
        tabBasic.setAttribute('aria-selected', 'true');
        tabSci.classList.remove('active');
        tabSci.setAttribute('aria-selected', 'false');
    } else {
        basicPanel.style.display = 'none';
        sciPanel.style.display = '';
        tabBasic.classList.remove('active');
        tabBasic.setAttribute('aria-selected', 'false');
        tabSci.classList.add('active');
        tabSci.setAttribute('aria-selected', 'true');
    }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) calcNum(e.key);
    else if (e.key === '.') calcDecimal();
    else if (e.key === '+') calcOp('+');
    else if (e.key === '-') calcOp('-');
    else if (e.key === '*') calcOp('*');
    else if (e.key === '/') {
        e.preventDefault();
        calcOp('/');
    } else if (e.key === 'Enter' || e.key === '=') calcEquals();
    else if (e.key === 'Escape') calcClear();
    else if (e.key === 'Backspace') calcBackspace();
    else if (e.key === '%') calcPercent();
});