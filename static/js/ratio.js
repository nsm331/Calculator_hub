/**
 * Ratio & Proportion Calculator Engine
 * Solves:
 *   1. Proportion Solver: A : B = C : D
 *   2. Ratio Simplifier: Reduce 2 or 3 term ratios to simplest form via Euclidean GCD
 *   3. Partitive Proportion: Divide a total amount into ratio components
 *   4. Aspect Ratio & Dimension Scaler: Resize dimensions while locking ratio
 * 100% Client-Side Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mode tabs
    const tabs = document.querySelectorAll('.ratio-tab-btn');
    const sections = {
        proportion: document.getElementById('ratio-sec-proportion'),
        simplify: document.getElementById('ratio-sec-simplify'),
        partition: document.getElementById('ratio-sec-partition'),
        aspect: document.getElementById('ratio-sec-aspect')
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const targetMode = tab.dataset.mode;
            Object.keys(sections).forEach(sec => {
                if (sections[sec]) {
                    sections[sec].style.display = sec === targetMode ? 'block' : 'none';
                }
            });
        });
    });

    // -------------------------------------------------------------
    // Helper: Euclidean Greatest Common Divisor
    // -------------------------------------------------------------
    function gcd(a, b) {
        a = Math.abs(Math.round(a));
        b = Math.abs(Math.round(b));
        while (b) {
            let t = b;
            b = a % b;
            a = t;
        }
        return a;
    }

    // -------------------------------------------------------------
    // Section 1: Proportion Solver (A : B = C : D)
    // -------------------------------------------------------------
    const propA = document.getElementById('prop-a');
    const propB = document.getElementById('prop-b');
    const propC = document.getElementById('prop-c');
    const propD = document.getElementById('prop-d');
    const propResultEl = document.getElementById('prop-result');
    const propStepsEl = document.getElementById('prop-steps');

    function solveProportion() {
        const aVal = propA.value.trim();
        const bVal = propB.value.trim();
        const cVal = propC.value.trim();
        const dVal = propD.value.trim();

        // Determine which field is blank / unknown
        const fields = [
            { id: 'A', val: aVal, el: propA },
            { id: 'B', val: bVal, el: propB },
            { id: 'C', val: cVal, el: propC },
            { id: 'D', val: dVal, el: propD }
        ];

        const blanks = fields.filter(f => f.val === '' || f.val.toLowerCase() === 'x');

        if (blanks.length !== 1) {
            if (propResultEl) propResultEl.innerHTML = '<span style="color: var(--color-text-muted);">Please leave exactly one input empty to solve for it.</span>';
            if (propStepsEl) propStepsEl.innerHTML = '';
            return;
        }

        const unknown = blanks[0].id;
        const a = parseFloat(propA.value);
        const b = parseFloat(propB.value);
        const c = parseFloat(propC.value);
        const d = parseFloat(propD.value);

        let ans = 0;
        let stepText = '';

        if (unknown === 'A') {
            // A / B = C / D => A = (B * C) / D
            if (d === 0) { showPropError("Cannot divide by zero (D = 0)"); return; }
            ans = (b * c) / d;
            stepText = `$$\\frac{A}{${b}} = \\frac{${c}}{${d}} \\implies A \\cdot ${d} = ${b} \\cdot ${c} \\implies A = \\frac{${b * c}}{${d}} = ${formatResult(ans)}$$`;
        } else if (unknown === 'B') {
            // A / B = C / D => B = (A * D) / C
            if (c === 0) { showPropError("Cannot divide by zero (C = 0)"); return; }
            ans = (a * d) / c;
            stepText = `$$\\frac{${a}}{B} = \\frac{${c}}{${d}} \\implies B \\cdot ${c} = ${a} \\cdot ${d} \\implies B = \\frac{${a * d}}{${c}} = ${formatResult(ans)}$$`;
        } else if (unknown === 'C') {
            // A / B = C / D => C = (A * D) / B
            if (b === 0) { showPropError("Cannot divide by zero (B = 0)"); return; }
            ans = (a * d) / b;
            stepText = `$$\\frac{${a}}{${b}} = \\frac{C}{${d}} \\implies C \\cdot ${b} = ${a} \\cdot ${d} \\implies C = \\frac{${a * d}}{${b}} = ${formatResult(ans)}$$`;
        } else if (unknown === 'D') {
            // A / B = C / D => D = (B * C) / A
            if (a === 0) { showPropError("Cannot divide by zero (A = 0)"); return; }
            ans = (b * c) / a;
            stepText = `$$\\frac{${a}}{${b}} = \\frac{${c}}{D} \\implies D \\cdot ${a} = ${b} \\cdot ${c} \\implies D = \\frac{${b * c}}{${a}} = ${formatResult(ans)}$$`;
        }

        if (propResultEl) {
            propResultEl.innerHTML = `<div class="result-highlight">${unknown} = <span style="color: var(--color-primary);">${formatResult(ans)}</span></div>`;
        }

        if (propStepsEl) {
            propStepsEl.innerHTML = `<div style="margin-top: 12px; font-size: 14px;"><strong>Step-by-step cross-multiplication:</strong></div><div>${stepText}</div>`;
            if (window.renderMathInElement) {
                window.renderMathInElement(propStepsEl, { delimiters: [{left: '$$', right: '$$', display: true}] });
            }
        }
    }

    function showPropError(msg) {
        if (propResultEl) propResultEl.innerHTML = `<span style="color: var(--color-danger);">${msg}</span>`;
        if (propStepsEl) propStepsEl.innerHTML = '';
    }

    function formatResult(num) {
        if (Number.isInteger(num)) return num.toString();
        return parseFloat(num.toFixed(4)).toString();
    }

    [propA, propB, propC, propD].forEach(inp => {
        if (inp) inp.addEventListener('input', solveProportion);
    });

    // -------------------------------------------------------------
    // Section 2: Ratio Simplifier (A : B or A : B : C)
    // -------------------------------------------------------------
    const simpA = document.getElementById('simp-a');
    const simpB = document.getElementById('simp-b');
    const simpC = document.getElementById('simp-c');
    const simpResultEl = document.getElementById('simp-result');
    const simpUnitEl = document.getElementById('simp-unit-ratio');
    const simpPctEl = document.getElementById('simp-pct-composition');

    function simplifyRatio() {
        const a = parseFloat(simpA.value) || 0;
        const b = parseFloat(simpB.value) || 0;
        const cVal = simpC.value.trim();
        const hasC = cVal !== '';
        const c = parseFloat(cVal) || 0;

        if (a <= 0 || b <= 0 || (hasC && c <= 0)) {
            if (simpResultEl) simpResultEl.innerHTML = '<span style="color: var(--color-text-muted);">Enter positive values to simplify.</span>';
            if (simpUnitEl) simpUnitEl.innerHTML = '';
            if (simpPctEl) simpPctEl.innerHTML = '';
            return;
        }

        if (!hasC) {
            // 2-term ratio A : B
            // Handle possible decimal values by multiplying by 10^decimals
            const factor = Math.max(getDecimals(a), getDecimals(b));
            const multiplier = Math.pow(10, factor);
            const intA = Math.round(a * multiplier);
            const intB = Math.round(b * multiplier);

            const divisor = gcd(intA, intB);
            const redA = intA / divisor;
            const redB = intB / divisor;

            if (simpResultEl) {
                simpResultEl.innerHTML = `<span style="font-size: 28px; font-weight: 800; color: var(--color-primary);">${redA} : ${redB}</span>`;
            }

            const unit1 = (b / a).toFixed(4);
            const unit2 = (a / b).toFixed(4);
            if (simpUnitEl) {
                simpUnitEl.innerHTML = `<div>Unit Ratios: <strong>1 : ${parseFloat(unit1)}</strong> &nbsp;|&nbsp; <strong>${parseFloat(unit2)} : 1</strong></div>`;
            }

            const total = a + b;
            const pctA = ((a / total) * 100).toFixed(1);
            const pctB = ((b / total) * 100).toFixed(1);
            if (simpPctEl) {
                simpPctEl.innerHTML = `Percentage Share: Part 1 = <strong>${pctA}%</strong>, Part 2 = <strong>${pctB}%</strong>`;
            }
        } else {
            // 3-term ratio A : B : C
            const factor = Math.max(getDecimals(a), getDecimals(b), getDecimals(c));
            const multiplier = Math.pow(10, factor);
            const intA = Math.round(a * multiplier);
            const intB = Math.round(b * multiplier);
            const intC = Math.round(c * multiplier);

            const divisor = gcd(gcd(intA, intB), intC);
            const redA = intA / divisor;
            const redB = intB / divisor;
            const redC = intC / divisor;

            if (simpResultEl) {
                simpResultEl.innerHTML = `<span style="font-size: 28px; font-weight: 800; color: var(--color-primary);">${redA} : ${redB} : ${redC}</span>`;
            }

            if (simpUnitEl) {
                simpUnitEl.innerHTML = `<div>Unit Ratio (normalized to A): <strong>1 : ${(b / a).toFixed(3)} : ${(c / a).toFixed(3)}</strong></div>`;
            }

            const total = a + b + c;
            const pctA = ((a / total) * 100).toFixed(1);
            const pctB = ((b / total) * 100).toFixed(1);
            const pctC = ((c / total) * 100).toFixed(1);
            if (simpPctEl) {
                simpPctEl.innerHTML = `Share: A = <strong>${pctA}%</strong>, B = <strong>${pctB}%</strong>, C = <strong>${pctC}%</strong>`;
            }
        }
    }

    function getDecimals(num) {
        const str = num.toString();
        if (str.includes('.')) {
            return str.split('.')[1].length;
        }
        return 0;
    }

    [simpA, simpB, simpC].forEach(inp => {
        if (inp) inp.addEventListener('input', simplifyRatio);
    });

    // -------------------------------------------------------------
    // Section 3: Partitive Proportion (Divide Total)
    // -------------------------------------------------------------
    const partTotal = document.getElementById('part-total');
    const partRatioStr = document.getElementById('part-ratio');
    const partResultsEl = document.getElementById('part-results-body');

    function partitionTotal() {
        const total = parseFloat(partTotal.value) || 0;
        const ratioInput = partRatioStr.value.trim();

        if (total <= 0 || !ratioInput) {
            if (partResultsEl) partResultsEl.innerHTML = '';
            return;
        }

        // Split ratio string by ':' or ',' or spaces
        const parts = ratioInput.split(/[:,\s]+/).map(p => parseFloat(p)).filter(p => !isNaN(p) && p > 0);

        if (parts.length < 2) {
            if (partResultsEl) partResultsEl.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--color-text-muted);">Please enter at least 2 ratio terms (e.g. 2:3:5)</td></tr>';
            return;
        }

        const sumOfParts = parts.reduce((acc, curr) => acc + curr, 0);
        if (partResultsEl) partResultsEl.innerHTML = '';

        parts.forEach((part, idx) => {
            const shareAmount = (part / sumOfParts) * total;
            const sharePct = (part / sumOfParts) * 100;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>Part ${idx + 1}</strong></td>
                <td><span class="badge">${part}</span></td>
                <td>${sharePct.toFixed(1)}%</td>
                <td style="font-weight: 700; color: var(--color-primary);">${formatResult(shareAmount)}</td>
            `;
            partResultsEl.appendChild(row);
        });
    }

    if (partTotal) partTotal.addEventListener('input', partitionTotal);
    if (partRatioStr) partRatioStr.addEventListener('input', partitionTotal);

    // -------------------------------------------------------------
    // Section 4: Aspect Ratio & Dimension Scaler
    // -------------------------------------------------------------
    const aspectOrigW = document.getElementById('aspect-orig-w');
    const aspectOrigH = document.getElementById('aspect-orig-h');
    const aspectNewW = document.getElementById('aspect-new-w');
    const aspectNewH = document.getElementById('aspect-new-h');
    const aspectPresetBtns = document.querySelectorAll('.aspect-preset-btn');
    const aspectInfoEl = document.getElementById('aspect-info');
    const aspectBoxPreview = document.getElementById('aspect-box-preview');

    function updateAspectRatio(trigger) {
        let origW = parseFloat(aspectOrigW.value) || 0;
        let origH = parseFloat(aspectOrigH.value) || 0;

        if (origW <= 0 || origH <= 0) return;

        const ratio = origW / origH;

        if (trigger === 'new-w') {
            const newW = parseFloat(aspectNewW.value) || 0;
            if (newW > 0) {
                aspectNewH.value = formatResult(newW / ratio);
            }
        } else if (trigger === 'new-h') {
            const newH = parseFloat(aspectNewH.value) || 0;
            if (newH > 0) {
                aspectNewW.value = formatResult(newH * ratio);
            }
        } else {
            // Orig dimensions changed -> update new H based on current new W
            const newW = parseFloat(aspectNewW.value) || 0;
            if (newW > 0) {
                aspectNewH.value = formatResult(newW / ratio);
            }
        }

        // Display simplified aspect ratio tag
        const g = gcd(origW, origH);
        const simpW = Math.round(origW / g);
        const simpH = Math.round(origH / g);

        if (aspectInfoEl) {
            aspectInfoEl.textContent = `Aspect Ratio: ${simpW}:${simpH} (${ratio.toFixed(3)})`;
        }

        // Update preview box
        if (aspectBoxPreview) {
            let maxDim = 120;
            let boxW = maxDim;
            let boxH = maxDim;
            if (ratio >= 1) {
                boxH = maxDim / ratio;
            } else {
                boxW = maxDim * ratio;
            }
            aspectBoxPreview.style.width = `${Math.max(20, Math.round(boxW))}px`;
            aspectBoxPreview.style.height = `${Math.max(20, Math.round(boxH))}px`;
        }
    }

    if (aspectOrigW) aspectOrigW.addEventListener('input', () => updateAspectRatio('orig'));
    if (aspectOrigH) aspectOrigH.addEventListener('input', () => updateAspectRatio('orig'));
    if (aspectNewW) aspectNewW.addEventListener('input', () => updateAspectRatio('new-w'));
    if (aspectNewH) aspectNewH.addEventListener('input', () => updateAspectRatio('new-h'));

    aspectPresetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const w = parseFloat(btn.dataset.w);
            const h = parseFloat(btn.dataset.h);
            if (aspectOrigW) aspectOrigW.value = w;
            if (aspectOrigH) aspectOrigH.value = h;
            updateAspectRatio('preset');
        });
    });

    // Run initials
    solveProportion();
    simplifyRatio();
    partitionTotal();
    updateAspectRatio('init');
});
