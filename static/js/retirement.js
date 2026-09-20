/**
 * Retirement Calculator Engine
 * 100% Vanilla JS - Actuarial Wealth Accumulation & Decumulation Simulation
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Inputs
    const currentAgeInput = document.getElementById('ret-current-age');
    const retireAgeInput = document.getElementById('ret-retire-age');
    const lifeExpectancyInput = document.getElementById('ret-life-expectancy');
    const currentSavingsInput = document.getElementById('ret-current-savings');
    const monthlyContribInput = document.getElementById('ret-monthly-contribution');

    const preReturnInput = document.getElementById('ret-pre-return');
    const postReturnInput = document.getElementById('ret-post-return');
    const inflationRateInput = document.getElementById('ret-inflation-rate');
    const desiredIncomeInput = document.getElementById('ret-desired-income');
    const otherIncomeInput = document.getElementById('ret-other-income');

    const form = document.getElementById('retirement-form');
    const resetBtn = document.getElementById('btn-reset-retirement');
    const presetPills = document.querySelectorAll('.preset-pill-btn[data-return]');

    // Table view mode: '5yr' | 'annual'
    let scheduleViewMode = '5yr';
    const tabSched5yr = document.getElementById('tab-sched-5yr');
    const tabSchedAnnual = document.getElementById('tab-sched-annual');
    const scheduleTbody = document.getElementById('retirement-schedule-tbody');

    // Hero & Cards
    const heroRetireAge = document.getElementById('hero-retire-age');
    const heroNestEgg = document.getElementById('hero-nest-egg');
    const heroVerdict = document.getElementById('hero-verdict-status');

    const cardTotalContrib = document.getElementById('card-total-contrib');
    const cardContribPct = document.getElementById('card-contrib-pct');
    const cardTotalInterest = document.getElementById('card-total-interest');
    const cardInterestPct = document.getElementById('card-interest-pct');
    const cardSwrAnnual = document.getElementById('card-swr-annual');
    const cardSwrMonthly = document.getElementById('card-swr-monthly');
    const cardDepletionAge = document.getElementById('card-depletion-age');
    const cardShortfallNote = document.getElementById('card-shortfall-note');

    // Preset Buttons
    presetPills.forEach(pill => {
        pill.addEventListener('click', () => {
            presetPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            preReturnInput.value = pill.getAttribute('data-return');
            postReturnInput.value = pill.getAttribute('data-post');
            calculateRetirement();
        });
    });

    // Schedule Tabs
    tabSched5yr.addEventListener('click', () => {
        scheduleViewMode = '5yr';
        tabSched5yr.classList.add('active');
        tabSchedAnnual.classList.remove('active');
        calculateRetirement();
    });

    tabSchedAnnual.addEventListener('click', () => {
        scheduleViewMode = 'annual';
        tabSchedAnnual.classList.add('active');
        tabSched5yr.classList.remove('active');
        calculateRetirement();
    });

    // Auto-update listeners
    [
        currentAgeInput, retireAgeInput, lifeExpectancyInput,
        currentSavingsInput, monthlyContribInput, preReturnInput,
        postReturnInput, inflationRateInput, desiredIncomeInput, otherIncomeInput
    ].forEach(input => {
        input.addEventListener('input', calculateRetirement);
        input.addEventListener('change', calculateRetirement);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateRetirement();
    });

    resetBtn.addEventListener('click', () => {
        currentAgeInput.value = '30';
        retireAgeInput.value = '65';
        lifeExpectancyInput.value = '90';
        currentSavingsInput.value = '50000';
        monthlyContribInput.value = '800';
        preReturnInput.value = '7.5';
        postReturnInput.value = '5.0';
        inflationRateInput.value = '2.5';
        desiredIncomeInput.value = '5000';
        otherIncomeInput.value = '1800';

        presetPills.forEach(p => p.classList.remove('active'));
        document.querySelector('[data-return="7.5"]').classList.add('active');
        calculateRetirement();
    });

    // Formatting Utility
    function fmtCurrency(val) {
        if (!isFinite(val) || isNaN(val)) return '$0';
        return '$' + Math.round(val).toLocaleString('en-US');
    }

    // Main Simulation Engine
    function calculateRetirement() {
        const currentAge = parseInt(currentAgeInput.value) || 30;
        const retireAge = parseInt(retireAgeInput.value) || 65;
        const lifeExpectancy = parseInt(lifeExpectancyInput.value) || 90;

        if (retireAge <= currentAge || lifeExpectancy <= retireAge) {
            heroNestEgg.textContent = '--';
            heroVerdict.textContent = 'Retirement age must be greater than current age, and life expectancy greater than retirement age.';
            return;
        }

        heroRetireAge.textContent = retireAge;

        const currentSavings = parseFloat(currentSavingsInput.value) || 0;
        const monthlyContrib = parseFloat(monthlyContribInput.value) || 0;
        const preReturn = (parseFloat(preReturnInput.value) || 0) / 100;
        const postReturn = (parseFloat(postReturnInput.value) || 0) / 100;
        const inflation = (parseFloat(inflationRateInput.value) || 0) / 100;
        const desiredMonthlyToday = parseFloat(desiredIncomeInput.value) || 0;
        const otherMonthlyToday = parseFloat(otherIncomeInput.value) || 0;

        const yearsToRetire = retireAge - currentAge;
        const monthsToRetire = yearsToRetire * 12;
        const monthlyPreRate = preReturn / 12;

        // 1. Accumulation Phase (Month by Month)
        let balance = currentSavings;
        let totalContributions = currentSavings;
        const scheduleRows = [];

        for (let year = 1; year <= yearsToRetire; year++) {
            const age = currentAge + year;
            const startOfYearBalance = balance;
            let yearContributions = 0;
            let yearInterest = 0;

            for (let m = 1; m <= 12; m++) {
                const interestEarned = balance * monthlyPreRate;
                balance += interestEarned + monthlyContrib;
                yearInterest += interestEarned;
                yearContributions += monthlyContrib;
                totalContributions += monthlyContrib;
            }

            scheduleRows.push({
                age: age,
                phase: 'Accumulation',
                startBalance: startOfYearBalance,
                contributions: yearContributions,
                interest: yearInterest,
                drawdown: 0,
                endBalance: balance
            });
        }

        const terminalNestEgg = balance;
        const totalInterestEarned = Math.max(0, terminalNestEgg - totalContributions);

        // 2. Decumulation Phase (Month by Month)
        const retirementYears = lifeExpectancy - retireAge;
        const monthlyPostRate = postReturn / 12;
        
        // Adjust desired spending and pension for inflation at retirement
        const inflationFactorAtRetire = Math.pow(1 + inflation, yearsToRetire);
        let desiredMonthlyRetire = desiredMonthlyToday * inflationFactorAtRetire;
        let otherMonthlyRetire = otherMonthlyToday * inflationFactorAtRetire;

        let depletionAge = null;
        let decumulationBalance = terminalNestEgg;

        for (let year = 1; year <= retirementYears; year++) {
            const age = retireAge + year;
            const startOfYearBalance = decumulationBalance;
            let yearInterest = 0;
            let yearDrawdown = 0;

            // Annual inflation adjustment during retirement
            const yearInflationFactor = Math.pow(1 + inflation, year - 1);
            const currentYearDesiredMonthly = desiredMonthlyRetire * yearInflationFactor;
            const currentYearOtherMonthly = otherMonthlyRetire * yearInflationFactor;
            const netMonthlyNeeded = Math.max(0, currentYearDesiredMonthly - currentYearOtherMonthly);

            for (let m = 1; m <= 12; m++) {
                if (decumulationBalance > 0) {
                    const interestEarned = decumulationBalance * monthlyPostRate;
                    yearInterest += interestEarned;
                    decumulationBalance += interestEarned;

                    const actualDraw = Math.min(decumulationBalance, netMonthlyNeeded);
                    decumulationBalance -= actualDraw;
                    yearDrawdown += actualDraw;

                    if (decumulationBalance <= 0 && depletionAge === null) {
                        depletionAge = age;
                    }
                }
            }

            scheduleRows.push({
                age: age,
                phase: 'Retirement',
                startBalance: startOfYearBalance,
                contributions: 0,
                interest: yearInterest,
                drawdown: yearDrawdown,
                endBalance: Math.max(0, decumulationBalance)
            });
        }

        // 3. Update Hero Metrics
        heroNestEgg.textContent = fmtCurrency(terminalNestEgg);

        // Sustainable Income from 4% Rule + Other Income (in retirement dollars)
        const annualSwrNestEgg = terminalNestEgg * 0.04;
        const monthlySwrNestEgg = annualSwrNestEgg / 12;
        const totalMonthlySustainable = monthlySwrNestEgg + otherMonthlyRetire;

        if (depletionAge === null) {
            heroVerdict.innerHTML = `🎉 <strong>Fully Funded</strong>: Generates ${fmtCurrency(totalMonthlySustainable)}/mo vs ${fmtCurrency(desiredMonthlyRetire)}/mo target budget at age ${retireAge}.`;
            cardDepletionAge.textContent = `Age ${lifeExpectancy}+ (Enduring)`;
            cardDepletionAge.style.color = '#10b981';
            cardShortfallNote.textContent = `Covers all ${retirementYears} years of retirement comfortably`;
        } else {
            const shortfallYears = lifeExpectancy - depletionAge;
            heroVerdict.innerHTML = `⚠️ <strong>Funding Gap Detected</strong>: Portfolio depletes at <strong>Age ${depletionAge}</strong> (${shortfallYears} years before age ${lifeExpectancy}).`;
            cardDepletionAge.textContent = `Depletes at Age ${depletionAge}`;
            cardDepletionAge.style.color = '#ef4444';
            cardShortfallNote.textContent = `Consider increasing monthly savings by $350-$600`;
        }

        // 4. Update Breakdown Cards
        cardTotalContrib.textContent = fmtCurrency(totalContributions);
        const contribPct = ((totalContributions / terminalNestEgg) * 100).toFixed(1);
        cardContribPct.textContent = `${contribPct}% of total nest egg`;

        cardTotalInterest.textContent = fmtCurrency(totalInterestEarned);
        const interestPct = ((totalInterestEarned / terminalNestEgg) * 100).toFixed(1);
        cardInterestPct.textContent = `${interestPct}% pure compound growth`;

        cardSwrAnnual.textContent = `${fmtCurrency(annualSwrNestEgg)} / yr`;
        cardSwrMonthly.textContent = `${fmtCurrency(monthlySwrNestEgg)} / mo (from portfolio)`;

        // 5. Render Schedule Table
        renderSchedule(scheduleRows);
    }

    function renderSchedule(rows) {
        scheduleTbody.innerHTML = '';
        if (rows.length === 0) return;

        const is5yr = (scheduleViewMode === '5yr');

        rows.forEach((row, idx) => {
            const isMilestone = (row.age % 5 === 0) || (idx === 0) || (idx === rows.length - 1) || (row.phase === 'Retirement' && rows[idx - 1] && rows[idx - 1].phase === 'Accumulation');

            if (!is5yr || isMilestone) {
                const tr = document.createElement('tr');
                const isRetire = row.phase === 'Retirement';

                tr.innerHTML = `
                    <td><strong>Age ${row.age}</strong></td>
                    <td><span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.78rem; font-weight: 600; background: ${isRetire ? 'rgba(251, 146, 60, 0.15)' : 'rgba(56, 189, 248, 0.15)'}; color: ${isRetire ? '#fb923c' : '#38bdf8'};">${row.phase}</span></td>
                    <td>${fmtCurrency(row.startBalance)}</td>
                    <td style="color: ${row.contributions > 0 ? '#10b981' : 'var(--color-text-muted)'};">${row.contributions > 0 ? '+' + fmtCurrency(row.contributions) : '$0'}</td>
                    <td style="color: #38bdf8;">+${fmtCurrency(row.interest)}</td>
                    <td style="color: ${row.drawdown > 0 ? '#ef4444' : 'var(--color-text-muted)'};">${row.drawdown > 0 ? '-' + fmtCurrency(row.drawdown) : '$0'}</td>
                    <td style="font-weight: 700; color: ${row.endBalance > 0 ? 'var(--color-text-main)' : '#ef4444'};">${fmtCurrency(row.endBalance)}</td>
                `;
                scheduleTbody.appendChild(tr);
            }
        });
    }

    // Initial Execution
    calculateRetirement();
});
