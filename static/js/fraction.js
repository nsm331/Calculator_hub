/**
 * Fraction Calculator Logic
 * Performs exact arithmetic (+, -, *, /) on fractions and mixed numbers.
 * Calculates lowest terms simplification, LCD, mixed numbers, decimals, and step-by-step proofs.
 */
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('fraction-form');
    if (!form) return;

    // Inputs
    const w1Input = document.getElementById('frac1-whole');
    const n1Input = document.getElementById('frac1-num');
    const d1Input = document.getElementById('frac1-den');

    const w2Input = document.getElementById('frac2-whole');
    const n2Input = document.getElementById('frac2-num');
    const d2Input = document.getElementById('frac2-den');

    const clearBtn = document.getElementById('btn-clear-fraction');

    // Result elements
    const resultPanel = document.getElementById('fraction-result-panel');
    const statusBadge = document.getElementById('frac-status-badge');
    const bigWholeDisplay = document.getElementById('frac-big-whole');
    const bigNumDisplay = document.getElementById('frac-big-num');
    const bigDenDisplay = document.getElementById('frac-big-den');
    const bigFracWrap = document.querySelector('.frac-big-fraction');
    const resDecimalDisplay = document.getElementById('frac-res-decimal');

    const improperDisplay = document.getElementById('frac-improper-val');
    const mixedDisplay = document.getElementById('frac-mixed-val');
    const decimalDisplay = document.getElementById('frac-decimal-val');
    const percentDisplay = document.getElementById('frac-percent-val');
    const stepsList = document.getElementById('frac-steps-list');

    // Greatest Common Divisor (Euclidean algorithm)
    function gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            const t = b;
            b = a % b;
            a = t;
        }
        return a || 1;
    }

    // Least Common Multiple
    function lcm(a, b) {
        if (a === 0 || b === 0) return 0;
        return Math.abs(a * b) / gcd(a, b);
    }

    // Convert whole + num/den to improper fraction
    function toImproper(w, n, d) {
        if (d === 0) return null;
        let num = n;
        if (w !== 0) {
            num = (Math.abs(w) * d) + n;
            if (w < 0) num = -num;
        }
        return { n: num, d: d };
    }

    function calculateFraction() {
        const w1 = parseInt(w1Input.value, 10) || 0;
        const n1 = parseInt(n1Input.value, 10) || 0;
        const d1 = parseInt(d1Input.value, 10) || 1;

        const w2 = parseInt(w2Input.value, 10) || 0;
        const n2 = parseInt(n2Input.value, 10) || 0;
        const d2 = parseInt(d2Input.value, 10) || 1;

        const opElem = document.querySelector('input[name="frac-op"]:checked');
        const op = opElem ? opElem.value : '+';

        if (d1 <= 0 || d2 <= 0) {
            alert('Denominators must be positive non-zero integers.');
            resultPanel.style.display = 'none';
            return;
        }

        const frac1 = toImproper(w1, n1, d1);
        const frac2 = toImproper(w2, n2, d2);

        if (!frac1 || !frac2) {
            resultPanel.style.display = 'none';
            return;
        }

        let resN = 0;
        let resD = 1;
        const steps = [];

        // Step 1: Conversion to improper fractions if whole numbers present
        if (w1 !== 0 || w2 !== 0) {
            const f1Str = w1 !== 0 ? `${w1} ${n1}/${d1} = ${frac1.n}/${frac1.d}` : `${frac1.n}/${frac1.d}`;
            const f2Str = w2 !== 0 ? `${w2} ${n2}/${d2} = ${frac2.n}/${frac2.d}` : `${frac2.n}/${frac2.d}`;
            steps.push(`<strong>Convert mixed numbers to improper fractions:</strong> ${f1Str}, and ${f2Str}`);
        }

        // Operation logic
        if (op === '+' || op === '-') {
            const commonDenom = lcm(frac1.d, frac2.d);
            const scale1 = commonDenom / frac1.d;
            const scale2 = commonDenom / frac2.d;
            const scaledN1 = frac1.n * scale1;
            const scaledN2 = frac2.n * scale2;

            if (op === '+') {
                resN = scaledN1 + scaledN2;
                steps.push(`<strong>Find Common Denominator:</strong> LCD of ${frac1.d} and ${frac2.d} is <strong>${commonDenom}</strong>.`);
                steps.push(`<strong>Convert to common denominator:</strong> (${frac1.n} × ${scale1}) / ${commonDenom} + (${frac2.n} × ${scale2}) / ${commonDenom} = ${scaledN1}/${commonDenom} + ${scaledN2}/${commonDenom}`);
                steps.push(`<strong>Add numerators:</strong> (${scaledN1} + ${scaledN2}) / ${commonDenom} = <strong>${resN}/${commonDenom}</strong>`);
            } else {
                resN = scaledN1 - scaledN2;
                steps.push(`<strong>Find Common Denominator:</strong> LCD of ${frac1.d} and ${frac2.d} is <strong>${commonDenom}</strong>.`);
                steps.push(`<strong>Convert to common denominator:</strong> (${frac1.n} × ${scale1}) / ${commonDenom} - (${frac2.n} × ${scale2}) / ${commonDenom} = ${scaledN1}/${commonDenom} - ${scaledN2}/${commonDenom}`);
                steps.push(`<strong>Subtract numerators:</strong> (${scaledN1} - ${scaledN2}) / ${commonDenom} = <strong>${resN}/${commonDenom}</strong>`);
            }
            resD = commonDenom;
        } else if (op === '*') {
            resN = frac1.n * frac2.n;
            resD = frac1.d * frac2.d;
            steps.push(`<strong>Multiply numerators and denominators:</strong> (${frac1.n} × ${frac2.n}) / (${frac1.d} × ${frac2.d}) = <strong>${resN}/${resD}</strong>`);
        } else if (op === '/') {
            if (frac2.n === 0) {
                alert('Cannot divide by zero fraction.');
                resultPanel.style.display = 'none';
                return;
            }
            resN = frac1.n * frac2.d;
            resD = frac1.d * frac2.n;
            steps.push(`<strong>Multiply by the reciprocal:</strong> (${frac1.n}/${frac1.d}) × (${frac2.d}/${frac2.n}) = <strong>${resN}/${resD}</strong>`);
        }

        // Normalize denominator sign
        if (resD < 0) {
            resN = -resN;
            resD = -resD;
        }

        // Reduce fraction to lowest terms
        const divisor = gcd(resN, resD);
        const simpN = resN / divisor;
        const simpD = resD / divisor;

        if (divisor > 1) {
            steps.push(`<strong>Simplify to lowest terms:</strong> Divide numerator and denominator by GCD (${divisor}) &rarr; <strong>${simpN}/${simpD}</strong>`);
        } else {
            steps.push(`<strong>Lowest terms:</strong> The fraction <strong>${simpN}/${simpD}</strong> is already in simplest form.`);
        }

        // Mixed number derivation
        const wholePart = Math.trunc(simpN / simpD);
        const remPart = Math.abs(simpN % simpD);

        let mixedStr = '';
        if (wholePart !== 0 && remPart !== 0) {
            mixedStr = `${wholePart} ${remPart}/${simpD}`;
        } else if (wholePart !== 0 && remPart === 0) {
            mixedStr = `${wholePart}`;
        } else {
            mixedStr = `${simpN}/${simpD}`;
        }

        const decimalVal = simpN / simpD;
        const percentVal = decimalVal * 100;

        steps.push(`<strong>Decimal equivalence:</strong> ${simpN} ÷ ${simpD} = <strong>${decimalVal.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')}</strong>`);

        // Render Big Primary Display
        if (remPart === 0) {
            // Integer result
            bigWholeDisplay.textContent = wholePart;
            bigWholeDisplay.style.display = 'inline-block';
            if (bigFracWrap) bigFracWrap.style.display = 'none';
        } else if (wholePart !== 0) {
            // Mixed number
            bigWholeDisplay.textContent = wholePart;
            bigWholeDisplay.style.display = 'inline-block';
            if (bigFracWrap) {
                bigFracWrap.style.display = 'inline-flex';
                bigNumDisplay.textContent = remPart;
                bigDenDisplay.textContent = simpD;
            }
        } else {
            // Pure fraction
            bigWholeDisplay.style.display = 'none';
            if (bigFracWrap) {
                bigFracWrap.style.display = 'inline-flex';
                bigNumDisplay.textContent = simpN;
                bigDenDisplay.textContent = simpD;
            }
        }

        resDecimalDisplay.textContent = decimalVal.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');

        // Render Breakdown Grid
        improperDisplay.textContent = `${simpN} / ${simpD}`;
        mixedDisplay.textContent = mixedStr;
        decimalDisplay.textContent = decimalVal.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
        percentDisplay.textContent = `${percentVal.toFixed(2)}%`;

        // Render Steps List
        stepsList.innerHTML = steps.map(s => `<li>${s}</li>`).join('');

        resultPanel.style.display = 'block';
    }

    // Event listeners
    [w1Input, n1Input, d1Input, w2Input, n2Input, d2Input].forEach(inp => {
        if (inp) {
            inp.addEventListener('input', calculateFraction);
            inp.addEventListener('change', calculateFraction);
        }
    });

    document.querySelectorAll('input[name="frac-op"]').forEach(radio => {
        radio.addEventListener('change', calculateFraction);
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateFraction();
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            w1Input.value = '';
            n1Input.value = 2;
            d1Input.value = 3;
            w2Input.value = '';
            n2Input.value = 3;
            d2Input.value = 4;
            const plusRadio = document.querySelector('input[name="frac-op"][value="+"]');
            if (plusRadio) plusRadio.checked = true;
            calculateFraction();
        });
    }

    calculateFraction();
});
