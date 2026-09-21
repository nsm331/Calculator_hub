/**
 * CalculatorHub - Permutations & Combinations Engine
 * Exact BigInt factorial computation, factorial cancellations, and 4-way combinatorial matrix.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mode Buttons
    const modeBtns = document.querySelectorAll('.perm-mode-btn');
    const presetBtns = document.querySelectorAll('.perm-preset-btn');

    const nInput = document.getElementById('perm-n');
    const rInput = document.getElementById('perm-r');
    const rHint = document.getElementById('perm-r-hint');
    const calcBtn = document.getElementById('perm-calc-btn');

    // Results DOM
    const permExpr = document.getElementById('perm-expression');
    const modeBadge = document.getElementById('perm-mode-badge');
    const mainResult = document.getElementById('perm-main-result');
    const sciNotation = document.getElementById('perm-scientific-notation');
    const stepFormula = document.getElementById('perm-step-formula');
    const stepExpansion = document.getElementById('perm-step-expansion');

    const matrixN = document.querySelectorAll('.matrix-n');
    const matrixR = document.querySelectorAll('.matrix-r');
    const comparisonTbody = document.getElementById('perm-comparison-tbody');

    const subsetsCard = document.getElementById('perm-subsets-card');
    const subsetsList = document.getElementById('perm-subsets-list');

    let currentMode = 'comb'; // 'comb', 'perm', 'perm_rep', 'comb_rep'

    // Mode Switcher
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentMode = this.dataset.mode;
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateHints();
            calculateCombinatorics();
        });
    });

    function updateHints() {
        if (currentMode === 'perm_rep' || currentMode === 'comb_rep') {
            rHint.textContent = 'Subset size r can be any non-negative integer (r >= 0, can exceed n).';
        } else {
            rHint.textContent = 'Subset sample size (0 <= r <= n).';
        }
    }

    // Presets
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            presetBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            if (this.dataset.mode) {
                currentMode = this.dataset.mode;
                modeBtns.forEach(b => {
                    b.classList.remove('active');
                    if (b.dataset.mode === currentMode) b.classList.add('active');
                });
                updateHints();
            }
            if (this.dataset.n) nInput.value = this.dataset.n;
            if (this.dataset.r) rInput.value = this.dataset.r;

            calculateCombinatorics();
        });
    });

    [nInput, rInput].forEach(el => {
        if (el) {
            el.addEventListener('input', calculateCombinatorics);
            el.addEventListener('change', calculateCombinatorics);
        }
    });

    if (calcBtn) {
        calcBtn.addEventListener('click', calculateCombinatorics);
    }

    // Core BigInt Calculations
    function calculateCombinatorics() {
        const nVal = parseInt(nInput.value, 10);
        const rVal = parseInt(rInput.value, 10);

        if (isNaN(nVal) || nVal < 0 || isNaN(rVal) || rVal < 0) {
            showError('Values for n and r must be non-negative integers.');
            return;
        }

        if ((currentMode === 'comb' || currentMode === 'perm') && rVal > nVal) {
            showError(`For non-repetition ${currentMode === 'comb' ? 'combinations' : 'permutations'}, r cannot exceed n (r <= n).`);
            return;
        }

        const nBig = BigInt(nVal);
        const rBig = BigInt(rVal);

        // Update Matrix labels
        matrixN.forEach(el => el.textContent = nVal);
        matrixR.forEach(el => el.textContent = rVal);

        // Calculate all 4 values for matrix
        const valP = (rVal <= nVal) ? calcPermutation(nBig, rBig) : null;
        const valC = (rVal <= nVal) ? calcCombination(nBig, rBig) : null;
        const valPrep = calcPermutationWithRep(nBig, rBig);
        const valCrep = (nVal > 0) ? calcCombinationWithRep(nBig, rBig) : null;

        // Select active mode result
        let activeVal = 0n;
        if (currentMode === 'comb') {
            activeVal = valC;
            permExpr.innerHTML = `C(${nVal}, ${rVal}) = \\binom{${nVal}}{${rVal}}`;
            modeBadge.textContent = 'Combinations (Order Irrelevant, No Repetition)';
            modeBadge.style.color = 'var(--color-accent-blue)';
            stepFormula.textContent = `C(n, r) = n! / [r! (n - r)!]`;
            renderCombinationSteps(nVal, rVal, activeVal);
        } else if (currentMode === 'perm') {
            activeVal = valP;
            permExpr.innerHTML = `P(${nVal}, ${rVal}) = {}_${nVal}P_{${rVal}}`;
            modeBadge.textContent = 'Permutations (Order Matters, No Repetition)';
            modeBadge.style.color = 'var(--color-accent-emerald)';
            stepFormula.textContent = `P(n, r) = n! / (n - r)!`;
            renderPermutationSteps(nVal, rVal, activeVal);
        } else if (currentMode === 'perm_rep') {
            activeVal = valPrep;
            permExpr.innerHTML = `P_R(${nVal}, ${rVal}) = ${nVal}^{${rVal}}`;
            modeBadge.textContent = 'Permutations With Repetition Allowed';
            modeBadge.style.color = 'var(--color-accent-amber)';
            stepFormula.textContent = `P_R(n, r) = n^r`;
            stepExpansion.innerHTML = `
                <span>Formula: ${nVal} multiplied by itself ${rVal} times:</span><br>
                <code>${nVal}<sup>${rVal}</sup> = ${formatBigInt(activeVal)}</code>
            `;
        } else if (currentMode === 'comb_rep') {
            activeVal = valCrep;
            const topVal = nVal + rVal - 1;
            permExpr.innerHTML = `C_R(${nVal}, ${rVal}) = \\binom{${topVal}}{${rVal}}`;
            modeBadge.textContent = 'Combinations With Repetition (Stars & Bars)';
            modeBadge.style.color = 'var(--color-accent-rose)';
            stepFormula.textContent = `C_R(n, r) = (n + r - 1)! / [r! (n - 1)!]`;
            renderCombinationWithRepSteps(nVal, rVal, topVal, activeVal);
        }

        // Display formatted main result
        mainResult.textContent = formatBigInt(activeVal);
        const strVal = activeVal.toString();
        if (strVal.length > 15) {
            const exp = strVal.length - 1;
            const mantissa = (parseFloat(strVal.slice(0, 7)) / 1000000).toFixed(6);
            sciNotation.innerHTML = `Scientific Notation: <strong>${mantissa} &times; 10<sup>${exp}</sup></strong> (${strVal.length} digits)`;
        } else {
            sciNotation.textContent = 'Exact integer representation';
        }

        // Render Comparative Table
        renderComparisonTable(valP, valC, valPrep, valCrep);

        // Render Sample Subsets for small inputs
        renderSubsets(nVal, rVal);
    }

    function calcPermutation(n, r) {
        if (r < 0n || r > n) return 0n;
        let res = 1n;
        for (let i = n; i > n - r; i--) {
            res *= i;
        }
        return res;
    }

    function calcCombination(n, r) {
        if (r < 0n || r > n) return 0n;
        if (r === 0n || r === n) return 1n;
        const k = (r > n - r) ? n - r : r;
        let num = 1n;
        let den = 1n;
        for (let i = 1n; i <= k; i++) {
            num *= (n - i + 1n);
            den *= i;
        }
        return num / den;
    }

    function calcPermutationWithRep(n, r) {
        if (n === 0n && r === 0n) return 1n;
        if (n === 0n) return 0n;
        return n ** r;
    }

    function calcCombinationWithRep(n, r) {
        if (n === 0n) return 0n;
        const top = n + r - 1n;
        return calcCombination(top, r);
    }

    function renderCombinationSteps(n, r, result) {
        if (n > 20) {
            stepExpansion.innerHTML = `
                <span>Cancelled form: \\(\\frac{${n}!}{( ${r}! \\cdot ${n - r}! )} = \\mathbf{${formatBigInt(result)}}\\)</span>
            `;
            return;
        }
        let numTerms = [];
        let denTerms = [];
        for (let i = 0; i < r; i++) {
            numTerms.push(n - i);
            denTerms.push(r - i);
        }
        const numStr = numTerms.join(' &times; ') || '1';
        const denStr = denTerms.join(' &times; ') || '1';
        stepExpansion.innerHTML = `
            <span>1. Falling factorial numerator: <code>${numStr}</code></span><br>
            <span>2. Permutations of subset (r!): <code>${denStr}</code></span><br>
            <strong>Ratio: (${numStr}) &divide; (${denStr}) = ${formatBigInt(result)}</strong>
        `;
    }

    function renderPermutationSteps(n, r, result) {
        if (n > 20) {
            stepExpansion.innerHTML = `
                <span>Formula cancellation: \\(\\frac{${n}!}{( ${n - r}! )} = \\mathbf{${formatBigInt(result)}}\\)</span>
            `;
            return;
        }
        let terms = [];
        for (let i = 0; i < r; i++) {
            terms.push(n - i);
        }
        const termStr = terms.join(' &times; ') || '1';
        stepExpansion.innerHTML = `
            <span>Sequential product of choices:</span><br>
            <code>P(${n}, ${r}) = ${termStr} = ${formatBigInt(result)}</code>
        `;
    }

    function renderCombinationWithRepSteps(n, r, top, result) {
        stepExpansion.innerHTML = `
            <span>Stars and Bars equivalence: Choosing ${r} items from ${n} bins:</span><br>
            <span>Equivalent to \\(\\binom{n + r - 1}{r} = \\binom{${top}}{${r}}\\) = <strong>${formatBigInt(result)}</strong></span>
        `;
    }

    function renderComparisonTable(valP, valC, valPrep, valCrep) {
        const rows = [
            { label: 'Combinations (nCr)', formula: 'C(n, r) = n! / [r!(n-r)!]', order: 'No', rep: 'No', val: valC !== null ? formatBigInt(valC) : 'Undefined (r > n)' },
            { label: 'Permutations (nPr)', formula: 'P(n, r) = n! / (n-r)!', order: 'Yes', rep: 'No', val: valP !== null ? formatBigInt(valP) : 'Undefined (r > n)' },
            { label: 'Permutations With Repetition', formula: 'P_R(n, r) = n^r', order: 'Yes', rep: 'Yes', val: formatBigInt(valPrep) },
            { label: 'Combinations With Repetition', formula: 'C_R(n, r) = (n+r-1)! / [r!(n-1)!]', order: 'No', rep: 'Yes', val: valCrep !== null ? formatBigInt(valCrep) : 'Undefined' },
        ];

        let html = '';
        rows.forEach(r => {
            html += `
                <tr style="border-bottom: 1px solid var(--color-border-light);">
                    <td style="padding: 8px 10px; font-weight: 600; color: var(--color-text-main);">${r.label}</td>
                    <td style="padding: 8px 10px; font-family: monospace; color: var(--color-accent-blue);">${r.formula}</td>
                    <td style="padding: 8px 10px; color: var(--color-text-muted);">${r.order}</td>
                    <td style="padding: 8px 10px; color: var(--color-text-muted);">${r.rep}</td>
                    <td style="padding: 8px 10px; font-weight: 700; text-align: right; color: var(--color-text-main);">${r.val}</td>
                </tr>
            `;
        });
        comparisonTbody.innerHTML = html;
    }

    function renderSubsets(n, r) {
        if (n <= 6 && r <= 4 && r <= n && currentMode === 'comb') {
            subsetsCard.style.display = 'block';
            const symbols = ['A', 'B', 'C', 'D', 'E', 'F'].slice(0, n);
            const subsets = getCombinationsSubsets(symbols, r);
            let html = '';
            subsets.slice(0, 60).forEach(s => {
                html += `<span style="background: var(--color-pill-bg, rgba(0,0,0,0.05)); border: 1px solid var(--color-border-light); padding: 2px 8px; border-radius: 4px;">{${s.join(', ')}}</span>`;
            });
            if (subsets.length > 60) {
                html += `<span style="color: var(--color-text-muted);">... +${subsets.length - 60} more</span>`;
            }
            subsetsList.innerHTML = html;
        } else {
            subsetsCard.style.display = 'none';
        }
    }

    function getCombinationsSubsets(arr, k) {
        if (k === 0) return [[]];
        if (arr.length === 0) return [];
        const head = arr[0];
        const tail = arr.slice(1);
        const withHead = getCombinationsSubsets(tail, k - 1).map(c => [head, ...c]);
        const withoutHead = getCombinationsSubsets(tail, k);
        return [...withHead, ...withoutHead];
    }

    function formatBigInt(b) {
        if (b === null || b === undefined) return '--';
        return b.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function showError(msg) {
        mainResult.textContent = 'Error';
        permExpr.textContent = 'Invalid Input Bounds';
        sciNotation.textContent = msg;
        stepExpansion.textContent = msg;
    }

    // Initial Execution
    calculateCombinatorics();
});
