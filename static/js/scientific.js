/**
 * Scientific Calculator Logic
 * Supports trigonometric (DEG/RAD), transcendental, logarithmic, powers, roots,
 * factorials, memory registers (MC, MR, M+, M-), and keyboard navigation.
 */
document.addEventListener('DOMContentLoaded', function () {
    const screen = document.getElementById('sci-screen');
    if (!screen) return;

    const formulaDisplay = document.getElementById('sci-formula');
    const outputDisplay = document.getElementById('sci-output');
    const degRadBtn = document.getElementById('btn-deg-rad');
    const modeDeg = document.getElementById('mode-deg');
    const modeRad = document.getElementById('mode-rad');
    const memIndicator = document.getElementById('sci-mem-indicator');

    let currentInput = '0';
    let formula = '';
    let isDeg = true; // true = DEG, false = RAD
    let memory = 0;
    let shouldResetInput = false;

    // Helper: format number cleanly
    function formatOutput(num) {
        if (isNaN(num)) return 'Error';
        if (!isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';

        // Fix IEEE floating point representation issues like 0.1 + 0.2 or sin(180)
        let rounded = Number(num.toPrecision(12));
        if (Math.abs(rounded) < 1e-12) rounded = 0;

        const str = rounded.toString();
        // Exponential notation if too long
        if (str.length > 14 && !str.includes('e')) {
            return rounded.toExponential(7);
        }
        return str;
    }

    function updateDisplay() {
        outputDisplay.textContent = currentInput;
        formulaDisplay.textContent = formula || '0';
    }

    function updateMemoryIndicator() {
        if (memory !== 0) {
            memIndicator.style.display = 'inline-block';
        } else {
            memIndicator.style.display = 'none';
        }
    }

    // Toggle DEG / RAD
    if (degRadBtn) {
        degRadBtn.addEventListener('click', function () {
            isDeg = !isDeg;
            if (isDeg) {
                modeDeg.classList.add('mode-active');
                modeRad.classList.remove('mode-active');
            } else {
                modeRad.classList.add('mode-active');
                modeDeg.classList.remove('mode-active');
            }
        });
    }

    // Factorial calculation
    function factorial(n) {
        if (n < 0 || Math.floor(n) !== n) return NaN;
        if (n > 170) return Infinity;
        let res = 1;
        for (let i = 2; i <= n; i++) res *= i;
        return res;
    }

    // Append digit
    function inputDigit(digit) {
        if (shouldResetInput) {
            currentInput = digit;
            shouldResetInput = false;
        } else {
            if (currentInput === '0') {
                currentInput = digit;
            } else {
                currentInput += digit;
            }
        }
        updateDisplay();
    }

    // Decimal point
    function inputDot() {
        if (shouldResetInput) {
            currentInput = '0.';
            shouldResetInput = false;
        } else if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay();
    }

    // Backspace
    function backspace() {
        if (shouldResetInput) return;
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }

    // Clear and All Clear
    function clear() {
        currentInput = '0';
        updateDisplay();
    }

    function allClear() {
        currentInput = '0';
        formula = '';
        shouldResetInput = false;
        updateDisplay();
    }

    // Single operand instant functions (sin, cos, log, sqrt, etc.)
    function executeUnary(action) {
        const val = parseFloat(currentInput);
        if (isNaN(val)) return;

        let res;
        switch (action) {
            case 'sin': {
                const rad = isDeg ? (val * Math.PI) / 180 : val;
                res = Math.sin(rad);
                break;
            }
            case 'cos': {
                const rad = isDeg ? (val * Math.PI) / 180 : val;
                res = Math.cos(rad);
                break;
            }
            case 'tan': {
                const rad = isDeg ? (val * Math.PI) / 180 : val;
                // Tan of 90 deg or odd multiples is undefined
                if (isDeg && Math.abs(val % 180) === 90) {
                    res = NaN;
                } else {
                    res = Math.tan(rad);
                }
                break;
            }
            case 'asin': {
                if (val < -1 || val > 1) {
                    res = NaN;
                } else {
                    const rad = Math.asin(val);
                    res = isDeg ? (rad * 180) / Math.PI : rad;
                }
                break;
            }
            case 'acos': {
                if (val < -1 || val > 1) {
                    res = NaN;
                } else {
                    const rad = Math.acos(val);
                    res = isDeg ? (rad * 180) / Math.PI : rad;
                }
                break;
            }
            case 'atan': {
                const rad = Math.atan(val);
                res = isDeg ? (rad * 180) / Math.PI : rad;
                break;
            }
            case 'sqrt':
                res = val >= 0 ? Math.sqrt(val) : NaN;
                break;
            case 'cbrt':
                res = Math.cbrt(val);
                break;
            case 'square':
                res = val * val;
                break;
            case 'log':
                res = val > 0 ? Math.log10(val) : NaN;
                break;
            case 'ln':
                res = val > 0 ? Math.log(val) : NaN;
                break;
            case 'exp':
                res = Math.pow(10, val);
                break;
            case 'e-pow':
                res = Math.exp(val);
                break;
            case 'fact':
                res = factorial(val);
                break;
            case 'reciprocal':
                res = val !== 0 ? 1 / val : NaN;
                break;
            case 'abs':
                res = Math.abs(val);
                break;
            case 'neg':
                res = -val;
                break;
            case 'rand':
                res = Math.random();
                break;
            default:
                return;
        }

        formula = `${action}(${currentInput})`;
        currentInput = formatOutput(res);
        shouldResetInput = true;
        updateDisplay();
    }

    // Constants
    function inputConstant(type) {
        if (type === 'pi') {
            currentInput = formatOutput(Math.PI);
        } else if (type === 'e') {
            currentInput = formatOutput(Math.E);
        }
        shouldResetInput = true;
        updateDisplay();
    }

    // Operators
    function inputOperator(op) {
        let symbol = op;
        if (op === 'add') symbol = '+';
        else if (op === 'sub') symbol = '-';
        else if (op === 'mul') symbol = '×';
        else if (op === 'div') symbol = '÷';
        else if (op === 'mod') symbol = '%';
        else if (op === 'power') symbol = '^';

        if (formula && !shouldResetInput) {
            formula += ` ${currentInput} ${symbol}`;
        } else if (formula && shouldResetInput) {
            // Replace trailing operator
            formula = formula.trim().replace(/[+\-×÷%^]$/, symbol);
        } else {
            formula = `${currentInput} ${symbol}`;
        }

        shouldResetInput = true;
        updateDisplay();
    }

    // Parentheses
    function inputParen(paren) {
        if (paren === 'paren-open') {
            if (formula && !formula.endsWith(' ') && !formula.endsWith('(')) {
                formula += ' × (';
            } else {
                formula += '(';
            }
        } else {
            formula += ` ${currentInput})`;
            shouldResetInput = true;
        }
        updateDisplay();
    }

    // Evaluate whole formula expression safely
    function evaluateExpression() {
        let expr = formula;
        if (!expr && !shouldResetInput) {
            return;
        }

        if (!shouldResetInput) {
            expr += ` ${currentInput}`;
        }

        // Close unclosed parentheses
        const openCount = (expr.match(/\(/g) || []).length;
        const closeCount = (expr.match(/\)/g) || []).length;
        for (let i = 0; i < (openCount - closeCount); i++) {
            expr += ')';
        }

        // Sanitize symbols to JS operators
        let sanitized = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/\^/g, '**');

        try {
            // Safe mathematical evaluation via Function with restricted context
            // Only allow numbers, math operators, spaces and parentheses
            if (!/^[0-9+\-*/().\s*%eE]+$/.test(sanitized)) {
                throw new Error('Invalid characters');
            }

            const evalFn = new Function(`"use strict"; return (${sanitized});`);
            const res = evalFn();

            formula = expr + ' =';
            currentInput = formatOutput(res);
            shouldResetInput = true;
            updateDisplay();
        } catch (err) {
            currentInput = 'Error';
            shouldResetInput = true;
            updateDisplay();
        }
    }

    // Memory operations
    function handleMemory(action) {
        const val = parseFloat(currentInput) || 0;
        switch (action) {
            case 'mc':
                memory = 0;
                break;
            case 'mr':
                currentInput = formatOutput(memory);
                shouldResetInput = true;
                break;
            case 'm-plus':
                memory += val;
                shouldResetInput = true;
                break;
            case 'm-minus':
                memory -= val;
                shouldResetInput = true;
                break;
        }
        updateMemoryIndicator();
        updateDisplay();
    }

    // Event delegation on keypad
    const keypad = document.querySelector('.sci-keypad');
    if (keypad) {
        keypad.addEventListener('click', function (e) {
            const btn = e.target.closest('button');
            if (!btn) return;

            const num = btn.getAttribute('data-num');
            const action = btn.getAttribute('data-action');

            if (num !== null) {
                inputDigit(num);
                return;
            }

            if (action) {
                switch (action) {
                    case 'dot':
                        inputDot();
                        break;
                    case 'backspace':
                        backspace();
                        break;
                    case 'clear':
                        clear();
                        break;
                    case 'all-clear':
                        allClear();
                        break;
                    case 'equals':
                        evaluateExpression();
                        break;
                    case 'pi':
                    case 'e':
                        inputConstant(action);
                        break;
                    case 'add':
                    case 'sub':
                    case 'mul':
                    case 'div':
                    case 'mod':
                    case 'power':
                        inputOperator(action);
                        break;
                    case 'paren-open':
                    case 'paren-close':
                        inputParen(action);
                        break;
                    case 'mc':
                    case 'mr':
                    case 'm-plus':
                    case 'm-minus':
                        handleMemory(action);
                        break;
                    default:
                        // Unary functions (sin, cos, tan, sqrt, log, etc.)
                        executeUnary(action);
                        break;
                }
            }
        });
    }

    // Keyboard support
    window.addEventListener('keydown', function (e) {
        // Prevent interfering when user is typing in form inputs elsewhere
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            inputDigit(e.key);
        } else if (e.key === '.') {
            e.preventDefault();
            inputDot();
        } else if (e.key === '+') {
            e.preventDefault();
            inputOperator('add');
        } else if (e.key === '-') {
            e.preventDefault();
            inputOperator('sub');
        } else if (e.key === '*') {
            e.preventDefault();
            inputOperator('mul');
        } else if (e.key === '/') {
            e.preventDefault();
            inputOperator('div');
        } else if (e.key === '%') {
            e.preventDefault();
            inputOperator('mod');
        } else if (e.key === '^') {
            e.preventDefault();
            inputOperator('power');
        } else if (e.key === '(') {
            e.preventDefault();
            inputParen('paren-open');
        } else if (e.key === ')') {
            e.preventDefault();
            inputParen('paren-close');
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            evaluateExpression();
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            backspace();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            allClear();
        }
    });

    updateDisplay();
});
