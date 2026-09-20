/**
 * Inflation Calculator - Pure Vanilla JavaScript Engine
 * Compound forward inflation, future equivalent costs, purchasing power erosion,
 * and annual value decay schedule.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Form Inputs
    const amountInput = document.getElementById('infl-amount');
    const rateInput = document.getElementById('infl-rate');
    const yearsInput = document.getElementById('infl-years');
    const calcBtn = document.getElementById('infl-calc-btn');
    const resetBtn = document.getElementById('infl-reset-btn');
    const presetBtns = document.querySelectorAll('.infl-preset-btn');

    // Result DOM Elements
    const futureCostEl = document.getElementById('res-future-cost');
    const futureSubEl = document.getElementById('res-future-sub');
    const realPowerEl = document.getElementById('res-real-power');
    const cumInflationEl = document.getElementById('res-cum-inflation');
    const powerLostEl = document.getElementById('res-power-lost');
    const halvingYearsEl = document.getElementById('res-halving-years');

    const barRetained = document.getElementById('bar-retained');
    const barEroded = document.getElementById('bar-eroded');
    const barRetainedLabel = document.getElementById('bar-retained-label');
    const barErodedLabel = document.getElementById('bar-eroded-label');

    const scheduleBody = document.getElementById('infl-schedule-body');

    function formatCurrency(num) {
        if (isNaN(num) || !isFinite(num)) return '$0';
        return '$' + Math.round(num).toLocaleString('en-US');
    }

    function calculateInflation() {
        const principal = Math.max(0, parseFloat(amountInput.value) || 0);
        const annualRatePct = parseFloat(rateInput.value) || 0;
        const rate = annualRatePct / 100;
        const years = Math.min(100, Math.max(1, parseInt(yearsInput.value, 10) || 1));

        // Future Equivalent Cost of Today's Principal: FV = PV * (1 + r)^t
        const growthFactor = Math.pow(1 + rate, years);
        const futureCost = principal * growthFactor;

        // Terminal Purchasing Power of Fixed Principal: PP = PV / (1 + r)^t
        const realPurchasingPower = growthFactor !== 0 ? (principal / growthFactor) : 0;

        // Cumulative Inflation %: (growthFactor - 1) * 100
        const cumulativeInflation = (growthFactor - 1) * 100;

        // Purchasing Power Loss %: [1 - 1/(1 + r)^t] * 100
        const powerLostPct = growthFactor > 0 ? (1 - (1 / growthFactor)) * 100 : 0;

        // Halving Time (Rule of 72 / Exact): ln(2) / ln(1 + r)
        let halvingYearsText = 'N/A';
        if (rate > 0) {
            const exactHalving = Math.log(2) / Math.log(1 + rate);
            halvingYearsText = exactHalving.toFixed(1) + ' Years';
        } else if (rate === 0) {
            halvingYearsText = 'Infinite';
        } else {
            halvingYearsText = 'Deflationary';
        }

        // Update Hero Banner
        futureCostEl.textContent = formatCurrency(futureCost);
        futureSubEl.textContent = `Required in ${years} year${years > 1 ? 's' : ''} to match the purchasing power of ${formatCurrency(principal)} today`;

        // Update Metric Cards
        realPowerEl.textContent = formatCurrency(realPurchasingPower);
        cumInflationEl.textContent = (cumulativeInflation >= 0 ? '+' : '') + cumulativeInflation.toFixed(2) + '%';
        powerLostEl.textContent = (powerLostPct >= 0 ? '-' : '+') + Math.abs(powerLostPct).toFixed(2) + '%';
        halvingYearsEl.textContent = halvingYearsText;

        // Update Visual Bar
        const retainedPct = Math.max(0, Math.min(100, 100 - powerLostPct));
        const erodedPct = Math.max(0, Math.min(100, powerLostPct));

        barRetained.style.width = retainedPct.toFixed(1) + '%';
        barEroded.style.width = erodedPct.toFixed(1) + '%';
        barRetainedLabel.textContent = retainedPct.toFixed(1) + '%';
        barErodedLabel.textContent = erodedPct.toFixed(1) + '%';

        // Generate Year-by-Year Schedule Table
        let rowsHtml = '';
        for (let y = 1; y <= years; y++) {
            const curFactor = Math.pow(1 + rate, y);
            const curCost = principal * curFactor;
            const curPower = curFactor !== 0 ? (principal / curFactor) : 0;
            const curCumInfl = (curFactor - 1) * 100;
            const curLost = (1 - (1 / curFactor)) * 100;

            rowsHtml += `
                <tr style="border-bottom: 1px solid var(--color-border-light);">
                    <td style="padding: 9px 12px; font-weight: 600;">Year ${y}</td>
                    <td class="td-right" style="padding: 9px 12px; font-weight: 700; color: #f87171;">${formatCurrency(curCost)}</td>
                    <td class="td-right" style="padding: 9px 12px; color: #38bdf8;">${formatCurrency(curPower)}</td>
                    <td class="td-right" style="padding: 9px 12px; color: #fbbf24;">${(curCumInfl >= 0 ? '+' : '') + curCumInfl.toFixed(1)}%</td>
                    <td class="td-right" style="padding: 9px 12px; color: #f43f5e;">-${Math.abs(curLost).toFixed(1)}%</td>
                </tr>
            `;
        }
        scheduleBody.innerHTML = rowsHtml;
    }

    // Preset Rate Buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            presetBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            rateInput.value = this.getAttribute('data-rate');
            calculateInflation();
        });
    });

    // Event Listeners for Live Recalculation
    [amountInput, rateInput, yearsInput].forEach(inp => {
        inp.addEventListener('input', calculateInflation);
        inp.addEventListener('change', calculateInflation);
    });

    calcBtn.addEventListener('click', calculateInflation);

    // Reset Defaults
    resetBtn.addEventListener('click', function () {
        amountInput.value = '10000';
        rateInput.value = '3.2';
        yearsInput.value = '15';

        presetBtns.forEach(b => {
            if (b.getAttribute('data-rate') === '3.2') {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        calculateInflation();
    });

    // Initial Calculation
    calculateInflation();
});
