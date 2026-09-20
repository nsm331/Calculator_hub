/**
 * Standard Deviation & Variance Calculator - Pure Vanilla JavaScript Engine
 * Sample & Population standard deviation, Bessel's degrees of freedom correction (n - 1),
 * sum of squares, five-number summary, and step-by-step residual table.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Form Inputs
    const dataInput = document.getElementById('sd-data');
    const modeRadios = document.querySelectorAll('input[name="sd-mode"]');
    const countBadge = document.getElementById('data-count-badge');
    const calcBtn = document.getElementById('sd-calc-btn');
    const clearBtn = document.getElementById('sd-clear-btn');
    const resetBtn = document.getElementById('sd-reset-btn');
    const presetBtns = document.querySelectorAll('.sd-preset-btn');

    // Hero Elements
    const heroLabel = document.getElementById('hero-target-label');
    const primarySdEl = document.getElementById('res-primary-val') || document.getElementById('res-primary-sd');
    const sdSubEl = document.getElementById('res-sd-sub');

    // Metric Elements
    const sampleSdEl = document.getElementById('res-sample-sd');
    const popSdEl = document.getElementById('res-pop-sd');
    const sampleVarEl = document.getElementById('res-sample-var');
    const popVarEl = document.getElementById('res-pop-var');
    const meanEl = document.getElementById('res-mean');
    const sumEl = document.getElementById('res-sum');
    const ssEl = document.getElementById('res-ss');
    const semEl = document.getElementById('res-sem');

    // Five-Number Summary Elements
    const minEl = document.getElementById('res-min');
    const q1El = document.getElementById('res-q1');
    const medianEl = document.getElementById('res-median');
    const q3El = document.getElementById('res-q3');
    const maxEl = document.getElementById('res-max');
    const rangeEl = document.getElementById('res-range');
    const iqrEl = document.getElementById('res-iqr');
    const cvEl = document.getElementById('res-cv');

    const stepsBody = document.getElementById('sd-steps-body');

    // Helper: Parse raw text into array of numbers
    function parseData(text) {
        if (!text) return [];
        // Split on commas, spaces, tabs, newlines, semicolons
        const tokens = text.split(/[\s,;]+/);
        const nums = [];
        for (const tok of tokens) {
            if (tok.trim().length > 0) {
                const val = parseFloat(tok);
                if (!isNaN(val) && isFinite(val)) {
                    nums.push(val);
                }
            }
        }
        return nums;
    }

    // Helper: Quantile calculation (linear interpolation)
    function getPercentile(sorted, p) {
        if (sorted.length === 0) return 0;
        if (sorted.length === 1) return sorted[0];
        const index = p * (sorted.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        const weight = index - lower;
        return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    }

    function calculateStatistics() {
        const nums = parseData(dataInput.value);
        const n = nums.length;

        countBadge.textContent = `N = ${n} Value${n === 1 ? '' : 's'} Detected`;

        if (n < 1) {
            primarySdEl.textContent = '0.0000';
            sdSubEl.textContent = 'Please enter at least 1 numeric observation';
            stepsBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 14px; color: var(--color-text-muted);">No valid numbers to display.</td></tr>';
            return;
        }

        let isSample = true;
        modeRadios.forEach(r => {
            if (r.checked && r.value === 'population') isSample = false;
        });

        // 1. Sum & Mean
        const sum = nums.reduce((acc, v) => acc + v, 0);
        const mean = sum / n;

        // 2. Sum of Squared Deviations (SS)
        let ss = 0;
        const deviations = [];
        for (let i = 0; i < n; i++) {
            const dev = nums[i] - mean;
            const devSq = dev * dev;
            ss += devSq;
            deviations.push({ val: nums[i], dev: dev, devSq: devSq });
        }

        // 3. Sample vs Population Variance & SD
        const popVar = ss / n;
        const popSd = Math.sqrt(popVar);

        const sampleVar = n > 1 ? (ss / (n - 1)) : 0;
        const sampleSd = Math.sqrt(sampleVar);

        // 4. Standard Error & CV
        const sem = n > 1 ? (sampleSd / Math.sqrt(n)) : 0;
        const cv = mean !== 0 ? (sampleSd / Math.abs(mean)) * 100 : 0;

        // 5. Five-Number Summary
        const sorted = [...nums].sort((a, b) => a - b);
        const min = sorted[0];
        const max = sorted[n - 1];
        const q1 = getPercentile(sorted, 0.25);
        const median = getPercentile(sorted, 0.50);
        const q3 = getPercentile(sorted, 0.75);
        const range = max - min;
        const iqr = q3 - q1;

        // 6. Update Hero Display
        if (isSample) {
            heroLabel.textContent = "Sample Standard Deviation (s)";
            primarySdEl.textContent = sampleSd.toFixed(4);
            sdSubEl.textContent = `Sample Variance: s² = ${sampleVar.toFixed(4)} • Degrees of Freedom: n - 1 = ${Math.max(0, n - 1)}`;
        } else {
            heroLabel.textContent = "Population Standard Deviation (σ)";
            primarySdEl.textContent = popSd.toFixed(4);
            sdSubEl.textContent = `Population Variance: σ² = ${popVar.toFixed(4)} • Divisor: N = ${n}`;
        }

        // 7. Update Metrics Grid
        sampleSdEl.textContent = sampleSd.toFixed(4);
        popSdEl.textContent = popSd.toFixed(4);
        sampleVarEl.textContent = sampleVar.toFixed(4);
        popVarEl.textContent = popVar.toFixed(4);
        meanEl.textContent = mean.toFixed(4);
        sumEl.textContent = Number.isInteger(sum) ? sum.toLocaleString('en-US') : sum.toFixed(4);
        ssEl.textContent = ss.toFixed(4);
        semEl.textContent = sem.toFixed(4);

        // 8. Update Five-Number Summary
        minEl.textContent = Number.isInteger(min) ? min : min.toFixed(2);
        q1El.textContent = Number.isInteger(q1) ? q1 : q1.toFixed(2);
        medianEl.textContent = Number.isInteger(median) ? median : median.toFixed(2);
        q3El.textContent = Number.isInteger(q3) ? q3 : q3.toFixed(2);
        maxEl.textContent = Number.isInteger(max) ? max : max.toFixed(2);
        rangeEl.textContent = Number.isInteger(range) ? range : range.toFixed(2);
        iqrEl.textContent = Number.isInteger(iqr) ? iqr : iqr.toFixed(2);
        cvEl.textContent = cv.toFixed(2) + '%';

        // 9. Generate Step-by-Step Table (Limit display to first 100 rows for performance if N > 100)
        const displayLimit = Math.min(n, 100);
        let tableHtml = '';
        for (let i = 0; i < displayLimit; i++) {
            const d = deviations[i];
            tableHtml += `
                <tr style="border-bottom: 1px solid var(--color-border-light);">
                    <td style="padding: 9px 12px; font-weight: 600; font-family: var(--font-mono); color: var(--color-text-muted);">${i + 1}</td>
                    <td class="td-right" style="padding: 9px 12px; font-weight: 700; font-family: var(--font-mono);">${d.val}</td>
                    <td class="td-right" style="padding: 9px 12px; font-family: var(--font-mono); color: ${d.dev >= 0 ? '#38bdf8' : '#f87171'};">
                        ${(d.dev >= 0 ? '+' : '') + d.dev.toFixed(4)}
                    </td>
                    <td class="td-right" style="padding: 9px 12px; font-weight: 600; font-family: var(--font-mono); color: #a78bfa;">
                        ${d.devSq.toFixed(4)}
                    </td>
                </tr>
            `;
        }
        if (n > 100) {
            tableHtml += `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 12px; font-weight: 600; color: var(--color-text-muted);">
                        ... and ${n - 100} more observations included in calculation.
                    </td>
                </tr>
            `;
        }
        stepsBody.innerHTML = tableHtml;
    }

    // Dataset Preset Buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            presetBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            dataInput.value = this.getAttribute('data-dataset');
            calculateStatistics();
        });
    });

    // Mode Radio Listeners
    modeRadios.forEach(radio => {
        radio.addEventListener('change', calculateStatistics);
    });

    // Live Input Listeners
    dataInput.addEventListener('input', calculateStatistics);
    calcBtn.addEventListener('click', calculateStatistics);

    // Clear Data
    clearBtn.addEventListener('click', function () {
        dataInput.value = '';
        calculateStatistics();
    });

    // Reset Defaults
    resetBtn.addEventListener('click', function () {
        dataInput.value = '82, 88, 90, 78, 92, 85, 79, 94, 88, 86';
        modeRadios[0].checked = true;

        presetBtns.forEach((b, idx) => {
            if (idx === 0) b.classList.add('active');
            else b.classList.remove('active');
        });

        calculateStatistics();
    });

    // Initial Calculation
    calculateStatistics();
});
