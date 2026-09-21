/**
 * CalculatorHub - Logarithm & Antilogarithm Engine
 * Multi-base logarithm evaluation, change-of-base step-by-step breakdown, and antilog computation.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mode Buttons
    const modeBtns = document.querySelectorAll('.log-mode-btn');
    const presetBtns = document.querySelectorAll('.log-preset-btn');

    // Form inputs
    const baseGroup = document.getElementById('log-base-group');
    const baseInput = document.getElementById('log-base');
    const baseLabel = document.getElementById('log-base-label');
    const baseHint = document.getElementById('log-base-hint');

    const argGroup = document.getElementById('log-arg-group');
    const argInput = document.getElementById('log-arg');
    const argLabel = document.getElementById('log-arg-label');
    const argHint = document.getElementById('log-arg-hint');

    const precisionSelect = document.getElementById('log-precision');
    const calculateBtn = document.getElementById('log-calculate-btn');

    // Results DOM
    const mathExpression = document.getElementById('log-math-expression');
    const statusBadge = document.getElementById('log-status-badge');
    const mainValue = document.getElementById('log-main-value');
    const exponentialEq = document.getElementById('log-exponential-eq');
    const stepFormula = document.getElementById('log-step-formula');
    const stepSubstitution = document.getElementById('log-step-substitution');
    const charVal = document.getElementById('log-char-val');
    const mantVal = document.getElementById('log-mant-val');

    let currentMode = 'log10';

    // Mode Switching
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.dataset.mode;
            setMode(mode);
            calculateLog();
        });
    });

    function setMode(mode) {
        currentMode = mode;
        modeBtns.forEach(b => b.classList.remove('active'));
        const activeBtn = document.querySelector(`.log-mode-btn[data-mode="${mode}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        if (mode === 'log10') {
            baseGroup.style.display = 'none';
            argLabel.innerHTML = 'Argument ($x$)';
            argHint.innerHTML = 'Requirement: Argument must be strictly positive ($x > 0$).';
            if (argInput.value <= 0) argInput.value = '100';
        } else if (mode === 'ln') {
            baseGroup.style.display = 'none';
            argLabel.innerHTML = 'Argument ($x$)';
            argHint.innerHTML = 'Requirement: Argument must be strictly positive ($x > 0$).';
            if (argInput.value <= 0) argInput.value = '2.718281828';
        } else if (mode === 'log2') {
            baseGroup.style.display = 'none';
            argLabel.innerHTML = 'Argument ($x$)';
            argHint.innerHTML = 'Requirement: Argument must be strictly positive ($x > 0$).';
            if (argInput.value <= 0) argInput.value = '64';
        } else if (mode === 'custom') {
            baseGroup.style.display = '';
            baseLabel.innerHTML = 'Logarithm Base ($b$)';
            baseHint.innerHTML = 'Requirement: $b > 0$ and $b \\neq 1$.';
            argLabel.innerHTML = 'Argument ($x$)';
            argHint.innerHTML = 'Requirement: Argument must be strictly positive ($x > 0$).';
            if (!baseInput.value || parseFloat(baseInput.value) <= 0 || parseFloat(baseInput.value) === 1) {
                baseInput.value = '2';
            }
        } else if (mode === 'antilog') {
            baseGroup.style.display = '';
            baseLabel.innerHTML = 'Base ($b$)';
            baseHint.innerHTML = 'Positive base $b > 0$.';
            argLabel.innerHTML = 'Exponent ($y$)';
            argHint.innerHTML = 'Arbitrary real exponent (positive, negative, or zero).';
            if (!baseInput.value || parseFloat(baseInput.value) <= 0) {
                baseInput.value = '10';
            }
        }
    }

    // Quick presets
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.dataset.mode;
            setMode(mode);
            if (this.dataset.b) {
                baseInput.value = this.dataset.b;
            }
            if (this.dataset.x) {
                argInput.value = this.dataset.x;
            }
            calculateLog();
        });
    });

    // Precision change & calculate button
    precisionSelect.addEventListener('change', calculateLog);
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateLog);
    }
    argInput.addEventListener('input', calculateLog);
    baseInput.addEventListener('input', calculateLog);

    // Calculation Routine
    function calculateLog() {
        const precision = parseInt(precisionSelect.value, 10) || 6;
        const argVal = parseFloat(argInput.value);
        let baseVal = 10;

        if (currentMode === 'log10') {
            baseVal = 10;
        } else if (currentMode === 'ln') {
            baseVal = Math.E;
        } else if (currentMode === 'log2') {
            baseVal = 2;
        } else {
            baseVal = parseFloat(baseInput.value);
        }

        // Validation
        if (currentMode !== 'antilog') {
            if (isNaN(argVal) || argVal <= 0) {
                showError('Argument (x) must be a real number strictly greater than 0.');
                return;
            }
            if (isNaN(baseVal) || baseVal <= 0 || Math.abs(baseVal - 1) < 1e-9) {
                showError('Base (b) must be strictly greater than 0 and cannot equal 1.');
                return;
            }
        } else {
            if (isNaN(baseVal) || baseVal <= 0) {
                showError('Base (b) must be strictly greater than 0.');
                return;
            }
            if (isNaN(argVal)) {
                showError('Exponent (y) must be a valid number.');
                return;
            }
        }

        statusBadge.style.background = 'rgba(59, 130, 246, 0.15)';
        statusBadge.style.color = 'var(--color-accent-blue, #3b82f6)';
        statusBadge.textContent = 'Computed Successfully';

        if (currentMode === 'antilog') {
            // b^argVal = result
            const res = Math.pow(baseVal, argVal);
            const baseFmt = formatNumber(baseVal, 4);
            const expFmt = formatNumber(argVal, 4);
            const resFmt = isFinite(res) ? formatNumber(res, precision) : 'Infinity (Overflow)';

            mathExpression.innerHTML = `${baseFmt}<sup>${expFmt}</sup>`;
            mainValue.textContent = resFmt;
            exponentialEq.innerHTML = `Logarithmic Inversion: <strong>log<sub>${baseFmt}</sub>(${resFmt}) = ${expFmt}</strong>`;

            stepFormula.textContent = `x = b^y`;
            stepSubstitution.innerHTML = `${baseFmt}<sup>${expFmt}</sup> = ${resFmt}`;

            if (isFinite(res) && res > 0) {
                const characteristic = Math.floor(res);
                const mantissa = res - characteristic;
                charVal.textContent = characteristic.toString();
                mantVal.textContent = mantissa.toFixed(precision);
            } else {
                charVal.textContent = 'N/A';
                mantVal.textContent = 'N/A';
            }
            return;
        }

        // Standard Logarithms: y = log_b(x)
        const lnArg = Math.log(argVal);
        const lnBase = Math.log(baseVal);
        const logResult = lnArg / lnBase;

        let modeSymbol = `\\log_{10}(${formatNumber(argVal, 4)})`;
        let displayExpr = `log<sub>10</sub>(${formatNumber(argVal, 4)})`;

        if (currentMode === 'ln') {
            modeSymbol = `\\ln(${formatNumber(argVal, 4)})`;
            displayExpr = `ln(${formatNumber(argVal, 4)})`;
        } else if (currentMode === 'log2') {
            modeSymbol = `\\log_{2}(${formatNumber(argVal, 4)})`;
            displayExpr = `log<sub>2</sub>(${formatNumber(argVal, 4)})`;
        } else if (currentMode === 'custom') {
            const bFmt = formatNumber(baseVal, 4);
            modeSymbol = `\\log_{${bFmt}}(${formatNumber(argVal, 4)})`;
            displayExpr = `log<sub>${bFmt}</sub>(${formatNumber(argVal, 4)})`;
        }

        mathExpression.innerHTML = displayExpr;

        // Is exact integer or near integer?
        const isNearInt = Math.abs(logResult - Math.round(logResult)) < 1e-9;
        const resultFormatted = isNearInt ? Math.round(logResult).toString() : logResult.toFixed(precision);
        mainValue.textContent = resultFormatted;

        // Exponential verification: b^y = x
        const bDisplay = currentMode === 'ln' ? 'e' : formatNumber(baseVal, 4);
        exponentialEq.innerHTML = `Exponential Verification: <strong>${bDisplay}<sup>${resultFormatted}</sup> &approx; ${formatNumber(argVal, 4)}</strong>`;

        // Change of base step
        stepFormula.innerHTML = `\\log_b(x) = \\frac{\\ln(x)}{\\ln(b)}`;
        stepSubstitution.innerHTML = `
            <span>&bull; &ln;(${formatNumber(argVal, 4)}) = ${lnArg.toFixed(6)}</span><br>
            <span>&bull; &ln;(${bDisplay}) = ${lnBase.toFixed(6)}</span><br>
            <strong>Ratio: ${lnArg.toFixed(6)} &divide; ${lnBase.toFixed(6)} = ${resultFormatted}</strong>
        `;

        // Characteristic & Mantissa
        // In mathematics: y = c + m where c is integer floor and 0 <= m < 1
        const charPart = Math.floor(logResult);
        const mantPart = logResult - charPart;

        charVal.textContent = charPart.toString();
        mantVal.textContent = mantPart.toFixed(precision);

        // Re-render KaTeX if available
        if (typeof renderMathInElement === 'function') {
            renderMathInElement(document.getElementById('log-results'), {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ]
            });
        }
    }

    function showError(msg) {
        statusBadge.style.background = 'rgba(239, 68, 68, 0.15)';
        statusBadge.style.color = 'var(--color-accent-rose, #ef4444)';
        statusBadge.textContent = 'Invalid Domain Input';
        mainValue.textContent = 'Undefined';
        mathExpression.textContent = 'Math Domain Error';
        exponentialEq.textContent = msg;
        charVal.textContent = '--';
        mantVal.textContent = '--';
        stepSubstitution.textContent = msg;
    }

    function formatNumber(num, maxDec) {
        if (Math.abs(num - Math.round(num)) < 1e-9) {
            return Math.round(num).toString();
        }
        return parseFloat(num.toFixed(maxDec)).toString();
    }

    // Initial Execution
    setMode('log10');
    calculateLog();
});
