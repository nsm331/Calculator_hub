/**
 * Algebraic Exponentiation & Power Function Engine
 * CalculatorHub - Client-Side Vanilla JS
 */

document.addEventListener('DOMContentLoaded', function () {
    // Mode State
    let currentMode = 'standard'; // 'standard', 'fractional', 'scinot', 'binary'

    // Form inputs
    const baseInput = document.getElementById('exp-base');
    const baseHint = document.getElementById('exp-base-hint');
    const exponentInput = document.getElementById('exp-exponent');
    const fracGroup = document.getElementById('exp-fractional-group');
    const standardGroup = document.getElementById('exp-standard-group');
    const fracPInput = document.getElementById('exp-frac-p');
    const fracQInput = document.getElementById('exp-frac-q');
    const precisionSelect = document.getElementById('exp-precision');

    // Controls
    const modeButtons = document.querySelectorAll('.exp-mode-btn');
    const presetButtons = document.querySelectorAll('.exp-preset-btn');
    const calculateBtn = document.getElementById('exp-calculate-btn');
    const resetBtn = document.getElementById('exp-reset-btn');

    // Outputs
    const resExpPrimary = document.getElementById('res-exp-primary');
    const resExpEquation = document.getElementById('res-exp-equation');
    const resExpScinot = document.getElementById('res-exp-scinot');
    const resExpLog10 = document.getElementById('res-exp-log10');
    const resExpLn = document.getElementById('res-exp-ln');
    const stepBox = document.getElementById('exp-step-box');
    const refTableBody = document.getElementById('exp-reference-body');
    const tableTitle = document.getElementById('exp-table-title');
    const tableDesc = document.getElementById('exp-table-desc');
    const thPower = document.getElementById('th-exp-power');
    const thContext = document.getElementById('th-exp-context');

    function setMode(mode) {
        currentMode = mode;
        if (mode === 'fractional') {
            standardGroup.style.display = 'none';
            fracGroup.style.display = 'block';
            baseHint.textContent = 'Radicand base number';
        } else if (mode === 'scinot') {
            standardGroup.style.display = 'block';
            fracGroup.style.display = 'none';
            baseInput.value = '10';
            baseHint.textContent = 'Decimal order-of-magnitude base 10';
        } else if (mode === 'binary') {
            standardGroup.style.display = 'block';
            fracGroup.style.display = 'none';
            baseInput.value = '2';
            baseHint.textContent = 'Binary radix 2 (Bit architecture)';
        } else {
            standardGroup.style.display = 'block';
            fracGroup.style.display = 'none';
            baseHint.textContent = 'The number being multiplied';
        }
        calculatePower();
    }

    modeButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            modeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            setMode(this.dataset.mode);
        });
    });

    presetButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            presetButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const mode = this.dataset.mode;
            currentMode = mode;
            modeButtons.forEach(b => b.classList.toggle('active', b.dataset.mode === mode));

            baseInput.value = this.dataset.base;

            if (mode === 'fractional') {
                fracPInput.value = this.dataset.p;
                fracQInput.value = this.dataset.q;
            } else {
                exponentInput.value = this.dataset.exp;
            }

            setMode(mode);
        });
    });

    function formatNumber(num, prec) {
        if (!isFinite(num)) return num.toString();
        if (prec === 'auto') {
            if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-6 && num !== 0)) {
                return num.toExponential(6);
            }
            return num.toLocaleString('en-US', { maximumFractionDigits: 8 });
        }
        const p = parseInt(prec, 10);
        return num.toLocaleString('en-US', { minimumFractionDigits: p, maximumFractionDigits: p });
    }

    function toScientific(num) {
        if (!isFinite(num) || num === 0) return '0';
        const expStr = num.toExponential(4);
        const [mantissa, exponent] = expStr.split('e');
        const expVal = parseInt(exponent, 10);
        return `${mantissa} × 10${toSuperscript(expVal)}`;
    }

    function toSuperscript(n) {
        const map = {
            '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
            '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
            '-': '⁻', '+': '⁺'
        };
        return n.toString().split('').map(ch => map[ch] || ch).join('');
    }

    function calculatePower() {
        const b = parseFloat(baseInput.value);
        const prec = precisionSelect.value;

        if (isNaN(b)) return;

        let n = 0;
        let isFractional = (currentMode === 'fractional');
        let p = 1, q = 1;

        if (isFractional) {
            p = parseFloat(fracPInput.value) || 1;
            q = parseFloat(fracQInput.value) || 1;
            if (q === 0) {
                alert('Denominator (root index q) cannot be zero.');
                return;
            }
            n = p / q;
        } else {
            n = parseFloat(exponentInput.value);
            if (isNaN(n)) return;
        }

        let result = 0;
        let stepText = '';
        let isComplex = false;

        // Mathematical Evaluation
        if (b === 0 && n === 0) {
            result = 1; // standard algebraic convention 0^0 = 1
            stepText = '0⁰ is conventionally defined as 1 in discrete algebra, combinatorics, and power series.';
        } else if (b < 0 && !Number.isInteger(n)) {
            // Check if rational with odd denominator
            if (isFractional && q % 2 !== 0) {
                const inner = Math.pow(Math.abs(b), p);
                const root = Math.pow(inner, 1 / q);
                result = (p % 2 !== 0) ? -root : root;
                stepText = `Evaluating real odd root: (${b})^(${p}/${q}) = ${p % 2 !== 0 ? '-' : ''} (${Math.abs(b)})^(${p}/${q}) = ${result}`;
            } else {
                isComplex = true;
                result = NaN;
                stepText = `Negative base with even root index (${b})^(${n}) yields a complex imaginary result (outside real domain ℝ).`;
            }
        } else {
            // Check if BigInt can provide exact integer precision
            if (Number.isInteger(b) && Number.isInteger(n) && n >= 0 && n <= 64 && Math.abs(b) <= 100) {
                try {
                    const bigB = BigInt(b);
                    const bigN = BigInt(n);
                    const bigRes = bigB ** bigN;
                    result = Number(bigRes);
                    // Detailed expansion steps for integers
                    if (n === 0) {
                        stepText = `By quotient law: ${b}ᵏ / ${b}ᵏ = ${b}ᵏ⁻ᵏ = ${b}⁰ = 1 (for any base b ≠ 0).`;
                    } else if (n <= 12) {
                        const terms = Array(Number(bigN)).fill(`(${b})`).join(' × ');
                        stepText = `${b}${toSuperscript(n)} = ${terms} = ${bigRes.toLocaleString('en-US')}`;
                    } else {
                        stepText = `Repeated multiplication: ${b} multiplied by itself ${n} times = ${bigRes.toLocaleString('en-US')}`;
                    }
                } catch (e) {
                    result = Math.pow(b, n);
                }
            } else if (Number.isInteger(b) && Number.isInteger(n) && n < 0 && Math.abs(n) <= 64) {
                const posN = Math.abs(n);
                const denom = Math.pow(b, posN);
                result = 1 / denom;
                stepText = `Negative Exponent Rule: ${b}${toSuperscript(n)} = 1 / (${b}${toSuperscript(posN)}) = 1 / ${denom.toLocaleString('en-US')} = ${formatNumber(result, prec)}`;
            } else if (isFractional) {
                result = Math.pow(b, n);
                stepText = `Fractional Exponent Radical Rule: ${b}^(${p}/${q}) = ᑫ√(${b}ᵖ) = ${q}√(${Math.pow(b, p)}) = ${formatNumber(result, prec)}`;
            } else {
                result = Math.pow(b, n);
                stepText = `Exponential Evaluation: e^(${n} · ln(${b})) = ${formatNumber(result, prec)}`;
            }
        }

        // Display results
        if (isComplex) {
            resExpPrimary.textContent = 'Complex Number';
            resExpEquation.textContent = `(${b})^(${n}) ∉ ℝ (Imaginary)`;
            resExpScinot.textContent = 'N/A';
            resExpLog10.textContent = 'N/A';
            resExpLn.textContent = 'N/A';
        } else {
            resExpPrimary.textContent = formatNumber(result, prec);
            const eqStr = isFractional
                ? `${b}^(${p}/${q}) = ${formatNumber(result, prec)}`
                : `${b}${toSuperscript(n)} = ${formatNumber(result, prec)}`;
            resExpEquation.textContent = eqStr;
            resExpScinot.textContent = toScientific(result);

            if (result > 0) {
                const log10Val = Math.log10(result);
                const lnVal = Math.log(result);
                resExpLog10.textContent = log10Val.toFixed(4);
                resExpLn.textContent = `ln(x) = ${lnVal.toFixed(4)}`;
            } else {
                resExpLog10.textContent = 'Undefined (x ≤ 0)';
                resExpLn.textContent = 'N/A';
            }
        }

        stepBox.textContent = stepText;

        // Render Reference Table
        renderReferenceTable();
    }

    function renderReferenceTable() {
        refTableBody.innerHTML = '';

        if (currentMode === 'binary') {
            tableTitle.textContent = 'Binary Memory & Address Architecture Powers (2ⁿ)';
            tableDesc.textContent = 'Hardware registers, memory address ceilings, and byte groupings.';
            thPower.textContent = 'Power (2ⁿ)';
            thContext.textContent = 'Standard Computing Unit';

            const binaryUnits = [
                { exp: 0, desc: '1 Bit / Boolean State' },
                { exp: 1, desc: 'Pair / Dual States' },
                { exp: 2, desc: 'Nibble Half-Byte (4 bits)' },
                { exp: 3, desc: '1 Byte (8 bits)' },
                { exp: 4, desc: '16-state Hexadecimal digit' },
                { exp: 8, desc: '256 states (8-bit ASCII / RGBA channel)' },
                { exp: 10, desc: '1 KiB (Kibibyte = 1,024 Bytes)' },
                { exp: 16, desc: '64 KiB (16-bit address space / 65,536)' },
                { exp: 20, desc: '1 MiB (Mebibyte = 1,048,576 Bytes)' },
                { exp: 24, desc: '16 MiB (24-bit True Color 16.7M colors)' },
                { exp: 30, desc: '1 GiB (Gibibyte = 1,073,741,824 Bytes)' },
                { exp: 32, desc: '4 GiB (32-bit CPU memory ceiling: 4,294,967,296)' },
                { exp: 40, desc: '1 TiB (Tebibyte = 1,099,511,627,776 Bytes)' }
            ];

            binaryUnits.forEach(item => {
                const bigVal = BigInt(2) ** BigInt(item.exp);
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--color-border-subtle)';
                tr.innerHTML = `
                    <td style="padding: 10px 12px; font-weight: 700; color: #38bdf8;">2${toSuperscript(item.exp)}</td>
                    <td class="td-right" style="padding: 10px 12px; font-weight: 700; color: var(--color-text);">${bigVal.toLocaleString('en-US')}</td>
                    <td class="td-right" style="padding: 10px 12px; color: var(--color-text-muted);">${toScientific(Number(bigVal))}</td>
                    <td style="padding: 10px 12px; font-size: 0.85rem; color: #10b981;">${item.desc}</td>
                `;
                refTableBody.appendChild(tr);
            });
        } else {
            tableTitle.textContent = 'Decimal Orders of Magnitude (10ⁿ)';
            tableDesc.textContent = 'Metric SI prefixes, scientific scales, and orders of magnitude.';
            thPower.textContent = 'Power (10ⁿ)';
            thContext.textContent = 'SI Prefix & Physical Context';

            const decimalScales = [
                { exp: -9, val: '0.000000001', desc: 'Nano (n) • Atomic & molecular scale' },
                { exp: -6, val: '0.000001', desc: 'Micro (μ) • Bacterial cell dimensions' },
                { exp: -3, val: '0.001', desc: 'Milli (m) • Millimeter, milligram' },
                { exp: -2, val: '0.01', desc: 'Centi (c) • Centimeter, financial percent' },
                { exp: -1, val: '0.1', desc: 'Deci (d) • Decibel baseline' },
                { exp: 0, val: '1', desc: 'Unit (10⁰ = 1) • Dimensional baseline' },
                { exp: 1, val: '10', desc: 'Deca (da) • Decade' },
                { exp: 2, val: '100', desc: 'Hecto (h) • Century' },
                { exp: 3, val: '1,000', desc: 'Kilo (k) • Kilometer, kilogram, kilohertz' },
                { exp: 6, val: '1,000,000', desc: 'Mega (M) • Megabyte, Megawatt (Million)' },
                { exp: 9, val: '1,000,000,000', desc: 'Giga (G) • Gigahertz, Gigabyte (Billion)' },
                { exp: 12, val: '1,000,000,000,000', desc: 'Tera (T) • Terabyte, national GDP (Trillion)' }
            ];

            decimalScales.forEach(item => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--color-border-subtle)';
                tr.innerHTML = `
                    <td style="padding: 10px 12px; font-weight: 700; color: #38bdf8;">10${toSuperscript(item.exp)}</td>
                    <td class="td-right" style="padding: 10px 12px; font-weight: 700; color: var(--color-text);">${item.val}</td>
                    <td class="td-right" style="padding: 10px 12px; color: var(--color-text-muted);">1.0 × 10${toSuperscript(item.exp)}</td>
                    <td style="padding: 10px 12px; font-size: 0.85rem; color: #10b981;">${item.desc}</td>
                `;
                refTableBody.appendChild(tr);
            });
        }
    }

    // Input listeners
    [baseInput, exponentInput, fracPInput, fracQInput].forEach(inp => {
        inp.addEventListener('input', calculatePower);
    });

    precisionSelect.addEventListener('change', calculatePower);

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculatePower);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            modeButtons.forEach(b => b.classList.remove('active'));
            modeButtons[0].classList.add('active');

            presetButtons.forEach(b => b.classList.remove('active'));
            presetButtons[0].classList.add('active');

            baseInput.value = '2';
            exponentInput.value = '8';
            fracPInput.value = '3';
            fracQInput.value = '4';
            precisionSelect.value = 'auto';

            setMode('standard');
        });
    }

    // Initial calculation
    calculatePower();
});
