/**
 * Decimal to Fraction Converter Engine
 * Converts terminating and repeating decimals to exact reduced fractions and mixed numbers.
 */

(function () {
    'use strict';

    // State
    let isRepeatingMode = false;

    // DOM Elements
    const modeTerminatingBtn = document.getElementById('dec-mode-terminating');
    const modeRepeatingBtn = document.getElementById('dec-mode-repeating');

    const terminatingContainer = document.getElementById('dec-terminating-container');
    const repeatingContainer = document.getElementById('dec-repeating-container');

    const inputVal = document.getElementById('dec-input-val');
    const wholeNonRepInput = document.getElementById('dec-whole-nonrep');
    const repetendInput = document.getElementById('dec-repetend');
    const inchPrecisionSelect = document.getElementById('dec-inch-precision');

    const calculateBtn = document.getElementById('dec-calculate-btn');
    const resetBtn = document.getElementById('dec-reset-btn');
    const presetButtons = document.querySelectorAll('.preset-pill-btn');

    // Outputs
    const wholeDisplayEl = document.getElementById('dec-whole-display');
    const heroNumEl = document.getElementById('dec-hero-numerator');
    const heroDenEl = document.getElementById('dec-hero-denominator');
    const mixedValEl = document.getElementById('dec-mixed-val');

    const pctValEl = document.getElementById('dec-pct-val');
    const sciValEl = document.getElementById('dec-sci-val');
    const rulerValEl = document.getElementById('dec-ruler-val');
    const reciprocalValEl = document.getElementById('dec-reciprocal-val');
    const stepSolutionEl = document.getElementById('dec-step-solution-content');

    // Euclidean Greatest Common Divisor (BigInt support for arbitrary precision)
    function gcdBig(a, b) {
        a = a < 0n ? -a : a;
        b = b < 0n ? -b : b;
        while (b > 0n) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    function formatScientific(num) {
        if (num === 0) return '0';
        const expStr = num.toExponential();
        const parts = expStr.split('e');
        const coeff = parseFloat(parts[0]).toFixed(3).replace(/\.?0+$/, '');
        const exp = parseInt(parts[1], 10);

        const superscripts = {
            '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³',
            '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
        };
        const expSuper = String(exp).split('').map(c => superscripts[c] || c).join('');
        return `${coeff} &times; 10${expSuper}`;
    }

    function computeNearestInch(val, precision) {
        const sign = val < 0 ? '-' : '';
        const absVal = Math.abs(val);
        let whole = Math.floor(absVal);
        let frac = absVal - whole;

        let ticks = Math.round(frac * precision);
        if (ticks === precision) {
            whole += 1;
            ticks = 0;
        }

        if (ticks === 0) {
            return `${sign}${whole}"`;
        }

        let g = Number(gcdBig(BigInt(ticks), BigInt(precision)));
        let reducedNum = ticks / g;
        let reducedDen = precision / g;

        if (whole > 0) {
            return `${sign}${whole} ${reducedNum}/${reducedDen}"`;
        } else {
            return `${sign}${reducedNum}/${reducedDen}"`;
        }
    }

    function convertTerminating(rawStr) {
        const cleanStr = rawStr.trim();
        if (!cleanStr || isNaN(cleanStr)) {
            return null;
        }

        const isNegative = cleanStr.startsWith('-');
        const absStr = isNegative ? cleanStr.slice(1) : cleanStr;
        const numVal = parseFloat(cleanStr);

        let wholePart = 0n;
        let fracPartStr = '';

        if (absStr.includes('.')) {
            const parts = absStr.split('.');
            wholePart = BigInt(parts[0] || '0');
            fracPartStr = parts[1] || '';
        } else {
            wholePart = BigInt(absStr);
            fracPartStr = '';
        }

        // If no fractional part
        if (!fracPartStr) {
            const num = isNegative ? -wholePart : wholePart;
            return {
                numVal: numVal,
                numerator: num,
                denominator: 1n,
                isNegative: isNegative,
                mixedWhole: isNegative ? -wholePart : wholePart,
                mixedNum: 0n,
                mixedDen: 1n,
                isMixed: false,
                stepsHtml: `<p>The value <strong>${cleanStr}</strong> is already an integer. Expressed as a rational fraction: <strong>${cleanStr} / 1</strong>.</p>`
            };
        }

        // Fractional digits
        const decimalPlaces = fracPartStr.length;
        const denominatorRaw = 10n ** BigInt(decimalPlaces);
        const fracNumerator = BigInt(fracPartStr);
        const totalNumeratorRaw = (wholePart * denominatorRaw) + fracNumerator;

        const g = gcdBig(totalNumeratorRaw, denominatorRaw);
        const finalNum = totalNumeratorRaw / g;
        const finalDen = denominatorRaw / g;

        // Mixed fraction decomposition
        const mixedWhole = wholePart;
        const mixedNum = (fracNumerator / g);
        const mixedDen = (denominatorRaw / g);

        // Step-by-Step explanation
        const stepsHtml = `
            <ol class="example-steps" style="padding-left: 20px;">
                <li><strong>Write as an unsimplified base-10 fraction:</strong> Since there are <strong>${decimalPlaces}</strong> digits after the decimal point, place the number over $10^{${decimalPlaces}} = ${denominatorRaw.toLocaleString()}$:
                    <div style="margin: 6px 0; font-family: monospace; font-size: 1.05rem;">
                        ${cleanStr} = ${isNegative ? '-' : ''}\\frac{${totalNumeratorRaw.toLocaleString()}}{${denominatorRaw.toLocaleString()}}
                    </div>
                </li>
                <li><strong>Calculate Greatest Common Divisor (GCD):</strong> Using the Euclidean algorithm on ${totalNumeratorRaw.toLocaleString()} and ${denominatorRaw.toLocaleString()}:
                    <div style="margin: 6px 0; font-family: monospace; color: var(--accent-primary);">
                        \\gcd(${totalNumeratorRaw.toLocaleString()}, ${denominatorRaw.toLocaleString()}) = <strong>${g.toLocaleString()}</strong>
                    </div>
                </li>
                <li><strong>Divide Numerator &amp; Denominator by GCD (${g.toLocaleString()}):</strong>
                    <div style="margin: 6px 0; font-family: monospace; font-size: 1.05rem;">
                        \\frac{${totalNumeratorRaw.toLocaleString()} \\div ${g.toLocaleString()}}{${denominatorRaw.toLocaleString()} \\div ${g.toLocaleString()}} = 
                        <strong>${isNegative ? '-' : ''}\\frac{${finalNum.toLocaleString()}}{${finalDen.toLocaleString()}}</strong>
                    </div>
                </li>
                ${mixedWhole > 0n ? `
                <li><strong>Mixed Number Representation:</strong> Dividing the numerator by the denominator yields ${mixedWhole.toLocaleString()} with a remainder of ${(finalNum % finalDen).toLocaleString()}:
                    <div style="margin: 6px 0; font-family: monospace; color: #10b981;">
                        ${isNegative ? '-' : ''}${mixedWhole.toLocaleString()} \\frac{${(finalNum % finalDen).toLocaleString()}}{${finalDen.toLocaleString()}}
                    </div>
                </li>` : ''}
            </ol>
        `;

        return {
            numVal: numVal,
            numerator: isNegative ? -finalNum : finalNum,
            denominator: finalDen,
            isNegative: isNegative,
            mixedWhole: isNegative ? -mixedWhole : mixedWhole,
            mixedNum: mixedNum,
            mixedDen: mixedDen,
            isMixed: mixedWhole > 0n && (finalNum % finalDen) > 0n,
            stepsHtml: stepsHtml
        };
    }

    function convertRepeating(nonRepStr, repetendStr) {
        nonRepStr = nonRepStr.trim();
        repetendStr = repetendStr.trim();

        if (!repetendStr || !/^\d+$/.test(repetendStr)) {
            return null;
        }

        const isNegative = nonRepStr.startsWith('-');
        const absNonRep = isNegative ? nonRepStr.slice(1) : nonRepStr;

        let wholePartStr = '0';
        let nonRepDecStr = '';

        if (absNonRep.includes('.')) {
            const parts = absNonRep.split('.');
            wholePartStr = parts[0] || '0';
            nonRepDecStr = parts[1] || '';
        } else if (/^\d+$/.test(absNonRep)) {
            wholePartStr = absNonRep || '0';
            nonRepDecStr = '';
        }

        const m = BigInt(nonRepDecStr.length);     // non-repeating decimal length
        const k = BigInt(repetendStr.length);      // repetend length

        // Base 10 powers
        const mult1 = 10n ** m;
        const mult2 = 10n ** (m + k);

        // Value shifted by 10^m
        const prefixVal = BigInt(wholePartStr + nonRepDecStr);
        // Value shifted by 10^(m+k)
        const fullVal = BigInt(wholePartStr + nonRepDecStr + repetendStr);

        const numeratorDiff = fullVal - prefixVal;
        const denominatorDiff = mult2 - mult1;

        const g = gcdBig(numeratorDiff, denominatorDiff);
        const finalNum = numeratorDiff / g;
        const finalDen = denominatorDiff / g;

        const numVal = Number(finalNum) / Number(finalDen) * (isNegative ? -1 : 1);
        const mixedWhole = finalNum / finalDen;
        const mixedRem = finalNum % finalDen;

        const originalNotation = `${isNegative ? '-' : ''}${absNonRep}(${repetendStr})\u0305`;

        const stepsHtml = `
            <ol class="example-steps" style="padding-left: 20px;">
                <li><strong>Define the algebraic equation:</strong> Let $x$ represent the repeating decimal:
                    <div style="margin: 6px 0; font-family: monospace;">
                        $x = ${originalNotation} = ${isNegative ? '-' : ''}${wholePartStr}.${nonRepDecStr}${repetendStr}${repetendStr}\\dots$
                    </div>
                </li>
                <li><strong>Multiply to shift past the non-repeating part ($10^{${m}}$):</strong>
                    <div style="margin: 6px 0; font-family: monospace;">
                        $10^{${m}} x = ${mult1.toLocaleString()}x = ${prefixVal}.${repetendStr}${repetendStr}\\dots$ &nbsp;&nbsp;&mdash;&nbsp; (Equation 1)
                    </div>
                </li>
                <li><strong>Multiply to shift past the first repeating period ($10^{${m + k}}$):</strong>
                    <div style="margin: 6px 0; font-family: monospace;">
                        $10^{${m + k}} x = ${mult2.toLocaleString()}x = ${fullVal}.${repetendStr}${repetendStr}\\dots$ &nbsp;&nbsp;&mdash;&nbsp; (Equation 2)
                    </div>
                </li>
                <li><strong>Subtract Equation 1 from Equation 2 to eliminate repeating tail:</strong>
                    <div style="margin: 6px 0; font-family: monospace;">
                        $(${mult2.toLocaleString()}x - ${mult1.toLocaleString()}x) = (${fullVal} - ${prefixVal}) \\implies 
                        ${denominatorDiff.toLocaleString()}x = ${numeratorDiff.toLocaleString()}$
                    </div>
                </li>
                <li><strong>Solve for $x$ and reduce by $\\gcd(${numeratorDiff.toLocaleString()}, ${denominatorDiff.toLocaleString()}) = ${g.toLocaleString()}$:</strong>
                    <div style="margin: 6px 0; font-family: monospace; font-size: 1.05rem; color: var(--accent-primary);">
                        $x = ${isNegative ? '-' : ''}\\frac{${numeratorDiff.toLocaleString()} \\div ${g.toLocaleString()}}{${denominatorDiff.toLocaleString()} \\div ${g.toLocaleString()}} = 
                        <strong>${isNegative ? '-' : ''}\\frac{${finalNum.toLocaleString()}}{${finalDen.toLocaleString()}}</strong>$
                    </div>
                </li>
                ${mixedWhole > 0n ? `
                <li><strong>Mixed Number:</strong>
                    <div style="margin: 6px 0; font-family: monospace; color: #10b981;">
                        ${isNegative ? '-' : ''}${mixedWhole.toLocaleString()} \\frac{${mixedRem.toLocaleString()}}{${finalDen.toLocaleString()}}
                    </div>
                </li>` : ''}
            </ol>
        `;

        return {
            numVal: numVal,
            numerator: isNegative ? -finalNum : finalNum,
            denominator: finalDen,
            isNegative: isNegative,
            mixedWhole: isNegative ? -mixedWhole : mixedWhole,
            mixedNum: mixedRem,
            mixedDen: finalDen,
            isMixed: mixedWhole > 0n && mixedRem > 0n,
            stepsHtml: stepsHtml
        };
    }

    function calculate() {
        let result = null;

        if (!isRepeatingMode) {
            result = convertTerminating(inputVal.value);
        } else {
            result = convertRepeating(wholeNonRepInput.value, repetendInput.value);
        }

        if (!result) {
            heroNumEl.textContent = '—';
            heroDenEl.textContent = '—';
            wholeDisplayEl.style.display = 'none';
            stepSolutionEl.innerHTML = '<p style="color: #ef4444;">Please enter a valid numeric decimal or repetend.</p>';
            return;
        }

        // Display Hero Fraction
        const absNum = result.numerator < 0n ? -result.numerator : result.numerator;
        const signStr = result.isNegative ? '-' : '';

        heroNumEl.textContent = `${signStr}${absNum.toLocaleString()}`;
        heroDenEl.textContent = result.denominator.toLocaleString();

        // Mixed Number subtext
        if (result.isMixed) {
            const mixedSign = result.isNegative ? '-' : '';
            const absMixedWhole = result.mixedWhole < 0n ? -result.mixedWhole : result.mixedWhole;
            mixedValEl.textContent = `${mixedSign}${absMixedWhole.toLocaleString()} ${result.mixedNum.toLocaleString()}/${result.mixedDen.toLocaleString()}`;
        } else if (absNum < result.denominator) {
            mixedValEl.textContent = 'None (Proper Fraction < 1)';
        } else {
            mixedValEl.textContent = 'Exact Integer (No Remainder)';
        }

        // Percentage
        const pct = result.numVal * 100;
        pctValEl.textContent = `${pct.toLocaleString('en-US', { maximumFractionDigits: 5 })}%`;

        // Scientific Notation
        sciValEl.innerHTML = formatScientific(result.numVal);

        // Nearest Ruler Inch
        const precision = parseInt(inchPrecisionSelect.value, 10) || 64;
        rulerValEl.textContent = computeNearestInch(result.numVal, precision);

        // Reciprocal
        if (result.numerator !== 0n) {
            const recipNum = result.denominator;
            const recipDen = absNum;
            const recipVal = 1 / result.numVal;
            reciprocalValEl.textContent = `${signStr}${recipNum.toLocaleString()}/${recipDen.toLocaleString()} ≈ ${recipVal.toFixed(4)}`;
        } else {
            reciprocalValEl.textContent = 'Undefined (Division by 0)';
        }

        // Steps HTML
        stepSolutionEl.innerHTML = result.stepsHtml;

        // Trigger KaTeX render if available
        if (window.renderMathInElement) {
            try {
                window.renderMathInElement(stepSolutionEl, {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '$', right: '$', display: false }
                    ],
                    throwOnError: false
                });
            } catch (e) {
                console.warn('KaTeX rendering error:', e);
            }
        }
    }

    // Mode Toggle Handlers
    function setMode(repeating) {
        isRepeatingMode = repeating;
        if (repeating) {
            modeRepeatingBtn.classList.add('active');
            modeTerminatingBtn.classList.remove('active');
            modeRepeatingBtn.setAttribute('aria-selected', 'true');
            modeTerminatingBtn.setAttribute('aria-selected', 'false');

            terminatingContainer.style.display = 'none';
            repeatingContainer.style.display = 'grid';
        } else {
            modeTerminatingBtn.classList.add('active');
            modeRepeatingBtn.classList.remove('active');
            modeTerminatingBtn.setAttribute('aria-selected', 'true');
            modeRepeatingBtn.setAttribute('aria-selected', 'false');

            repeatingContainer.style.display = 'none';
            terminatingContainer.style.display = 'grid';
        }
        calculate();
    }

    if (modeTerminatingBtn && modeRepeatingBtn) {
        modeTerminatingBtn.addEventListener('click', () => setMode(false));
        modeRepeatingBtn.addEventListener('click', () => setMode(true));
    }

    // Preset Buttons
    presetButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const val = btn.getAttribute('data-val') || '';
            const rep = btn.getAttribute('data-rep') || '';
            const nonrep = btn.getAttribute('data-nonrep');

            if (rep) {
                setMode(true);
                wholeNonRepInput.value = nonrep !== null ? (nonrep.includes('.') ? nonrep : '0.' + nonrep) : (val.split('.')[0] + '.' || '0.');
                repetendInput.value = rep;
            } else {
                setMode(false);
                inputVal.value = val;
            }
            calculate();
        });
    });

    // Event Listeners for Reactive Calculations
    [inputVal, wholeNonRepInput, repetendInput, inchPrecisionSelect].forEach(function (el) {
        if (el) {
            el.addEventListener('input', calculate);
            el.addEventListener('change', calculate);
        }
    });

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculate);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            if (isRepeatingMode) {
                wholeNonRepInput.value = '0.1';
                repetendInput.value = '6';
            } else {
                inputVal.value = '0.625';
            }
            inchPrecisionSelect.value = '64';
            calculate();
        });
    }

    // Initial Execution
    calculate();
})();
