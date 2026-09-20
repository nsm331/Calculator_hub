/**
 * Investment Calculator - Pure Vanilla JavaScript Engine
 * Compound interest with periodic contributions, compounding frequencies,
 * inflation adjustments, and annual contribution step-up schedules.
 */

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const initialInput = document.getElementById('invest-initial');
    const contributionInput = document.getElementById('invest-contribution');
    const freqSelect = document.getElementById('invest-freq');
    const timingSelect = document.getElementById('invest-timing');
    const yearsInput = document.getElementById('invest-years');
    const rateInput = document.getElementById('invest-rate');
    const compoundSelect = document.getElementById('invest-compound');
    const inflationInput = document.getElementById('invest-inflation');
    const stepupInput = document.getElementById('invest-stepup');
    const calcBtn = document.getElementById('invest-calc-btn');
    const resetBtn = document.getElementById('invest-reset-btn');
    const presetBtns = document.querySelectorAll('.invest-preset-btn');

    // Result DOM Elements
    const endBalanceEl = document.getElementById('res-end-balance');
    const balanceSubEl = document.getElementById('res-balance-sub');
    const totalPrincipalEl = document.getElementById('res-total-principal');
    const principalPctEl = document.getElementById('res-principal-pct');
    const totalInterestEl = document.getElementById('res-total-interest');
    const interestPctEl = document.getElementById('res-interest-pct');
    const realValueEl = document.getElementById('res-real-value');
    const multiplierEl = document.getElementById('res-multiplier');

    const barPrincipal = document.getElementById('bar-principal');
    const barInterest = document.getElementById('bar-interest');
    const barPrincipalLabel = document.getElementById('bar-principal-label');
    const barInterestLabel = document.getElementById('bar-interest-label');

    const scheduleBody = document.getElementById('invest-schedule-body');
    const tabAnnual = document.getElementById('tab-annual');
    const tab5yr = document.getElementById('tab-5yr') || document.getElementById('tab-milestones');

    let scheduleFilter = 'annual'; // 'annual' or '5yr'
    let cachedSchedule = [];

    // Currency Formatter
    function formatCurrency(num) {
        if (isNaN(num) || !isFinite(num)) return '$0';
        return '$' + Math.round(num).toLocaleString('en-US');
    }

    // Main Calculation Function
    function calculateInvestment() {
        const initial = Math.max(0, parseFloat(initialInput.value) || 0);
        let baseContribution = Math.max(0, parseFloat(contributionInput.value) || 0);
        const freq = parseInt(freqSelect.value, 10) || 12; // periods per year
        const timing = parseInt(timingSelect.value, 10) || 0; // 1 = start, 0 = end
        const years = Math.min(60, Math.max(1, parseInt(yearsInput.value, 10) || 20));
        const annualRate = Math.max(0, parseFloat(rateInput.value) || 0) / 100;
        const compoundFreq = parseInt(compoundSelect.value, 10) || 12; // compound per year
        const inflationRate = Math.max(0, parseFloat(inflationInput.value) || 0) / 100;
        const stepupRate = Math.max(0, parseFloat(stepupInput.value) || 0) / 100;

        // Rate per compound period
        const r_c = annualRate / compoundFreq;

        // Effective annual rate (EAR)
        const ear = Math.pow(1 + r_c, compoundFreq) - 1;

        // Effective rate per contribution period
        const r_period = Math.pow(1 + ear, 1 / freq) - 1;

        let currentBalance = initial;
        let totalDeposited = initial;
        let totalInterest = 0;
        const schedule = [];

        let currentPeriodContrib = baseContribution;

        for (let year = 1; year <= years; year++) {
            const startBalance = currentBalance;
            let yearDeposits = 0;
            let yearInterest = 0;

            for (let p = 0; p < freq; p++) {
                if (timing === 1) {
                    // Beginning of period: add contribution before growth
                    currentBalance += currentPeriodContrib;
                    yearDeposits += currentPeriodContrib;
                    const periodInterest = currentBalance * r_period;
                    currentBalance += periodInterest;
                    yearInterest += periodInterest;
                } else {
                    // End of period: growth first, then deposit
                    const periodInterest = currentBalance * r_period;
                    currentBalance += periodInterest;
                    yearInterest += periodInterest;
                    currentBalance += currentPeriodContrib;
                    yearDeposits += currentPeriodContrib;
                }
            }

            totalDeposited += yearDeposits;
            totalInterest += yearInterest;

            schedule.push({
                year: year,
                startBalance: startBalance,
                deposits: yearDeposits,
                interest: yearInterest,
                totalInterest: totalInterest,
                endBalance: currentBalance
            });

            // Step up contribution for next year if configured
            if (stepupRate > 0) {
                currentPeriodContrib *= (1 + stepupRate);
            }
        }

        cachedSchedule = schedule;

        // Inflation adjustment (Purchasing power in today's dollars)
        const realValue = currentBalance / Math.pow(1 + inflationRate, years);
        const multiplier = totalDeposited > 0 ? (currentBalance / totalDeposited) : 1;

        const principalPct = currentBalance > 0 ? (totalDeposited / currentBalance * 100) : 0;
        const interestPct = currentBalance > 0 ? (totalInterest / currentBalance * 100) : 0;

        // Render Summary
        endBalanceEl.textContent = formatCurrency(currentBalance);
        balanceSubEl.textContent = `After ${years} years of compound accumulation`;

        totalPrincipalEl.textContent = formatCurrency(totalDeposited);
        principalPctEl.textContent = `${principalPct.toFixed(1)}% of total portfolio`;

        totalInterestEl.textContent = `+${formatCurrency(totalInterest)}`;
        interestPctEl.textContent = `${interestPct.toFixed(1)}% pure growth`;

        realValueEl.textContent = formatCurrency(realValue);
        multiplierEl.innerHTML = `${multiplier.toFixed(2)}&times;`;

        // Proportion Bar
        const barP = Math.min(100, Math.max(0, principalPct));
        const barI = Math.min(100, Math.max(0, interestPct));
        barPrincipal.style.width = `${barP}%`;
        barInterest.style.width = `${barI}%`;
        barPrincipalLabel.textContent = `${formatCurrency(totalDeposited)} (${barP.toFixed(0)}%)`;
        barInterestLabel.textContent = `${formatCurrency(totalInterest)} (${barI.toFixed(0)}%)`;

        // Render Table
        renderScheduleTable();
    }

    // Render Schedule Table
    function renderScheduleTable() {
        if (!cachedSchedule || cachedSchedule.length === 0) return;

        let rowsHtml = '';
        const totalYears = cachedSchedule.length;

        cachedSchedule.forEach(row => {
            const is5yr = (row.year % 5 === 0) || (row.year === totalYears);
            if (scheduleFilter === '5yr' && !is5yr) {
                return;
            }

            rowsHtml += `
                <tr style="border-bottom: 1px solid var(--color-border-light);">
                    <td style="padding: 9px 12px; text-align: left; font-weight: 600;">
                        Year ${row.year}
                    </td>
                    <td class="td-right" style="padding: 9px 12px; color: var(--color-text-muted);">
                        ${formatCurrency(row.startBalance)}
                    </td>
                    <td class="td-right" style="padding: 9px 12px; color: var(--color-text-main);">
                        ${formatCurrency(row.deposits)}
                    </td>
                    <td class="td-right" style="padding: 9px 12px; color: #10b981;">
                        +${formatCurrency(row.interest)}
                    </td>
                    <td class="td-right" style="padding: 9px 12px; color: var(--color-text-muted);">
                        ${formatCurrency(row.totalInterest)}
                    </td>
                    <td class="td-right" style="padding: 9px 12px; font-weight: 700; color: #10b981;">
                        ${formatCurrency(row.endBalance)}
                    </td>
                </tr>
            `;
        });

        scheduleBody.innerHTML = rowsHtml;
    }

    // Tab Filters
    if (tabAnnual && tab5yr) {
        tabAnnual.addEventListener('click', function () {
            scheduleFilter = 'annual';
            tabAnnual.classList.add('active');
            tab5yr.classList.remove('active');
            renderScheduleTable();
        });

        tab5yr.addEventListener('click', function () {
            scheduleFilter = '5yr';
            tab5yr.classList.add('active');
            tabAnnual.classList.remove('active');
            renderScheduleTable();
        });
    }

    // Preset Return Buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            presetBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            rateInput.value = this.getAttribute('data-return');
            calculateInvestment();
        });
    });

    // Input Event Listeners for Real-time recalculation
    const liveInputs = [
        initialInput, contributionInput, freqSelect, timingSelect,
        yearsInput, rateInput, compoundSelect, inflationInput, stepupInput
    ];

    liveInputs.forEach(input => {
        input.addEventListener('input', calculateInvestment);
        input.addEventListener('change', calculateInvestment);
    });

    calcBtn.addEventListener('click', calculateInvestment);

    // Reset Defaults
    resetBtn.addEventListener('click', function () {
        initialInput.value = '10000';
        contributionInput.value = '500';
        freqSelect.value = '12';
        timingSelect.value = '1';
        yearsInput.value = '20';
        rateInput.value = '8.5';
        compoundSelect.value = '12';
        inflationInput.value = '2.5';
        stepupInput.value = '0';

        presetBtns.forEach(b => {
            if (b.getAttribute('data-return') === '8.5') {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        calculateInvestment();
    });

    // Initial Calculation on Load
    calculateInvestment();
});
