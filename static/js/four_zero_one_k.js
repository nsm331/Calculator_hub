/**
 * CalculatorHub - 401(k) Retirement Calculator Engine
 * Tax-deferred wealth accumulation, employer match mechanics, and safe withdrawal income.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inputs
    const presetBtns = document.querySelectorAll('.k401-preset-btn');
    const ageInput = document.getElementById('k401-age');
    const retireAgeInput = document.getElementById('k401-retire-age');
    const salaryInput = document.getElementById('k401-salary');
    const balanceInput = document.getElementById('k401-balance');
    const contribInput = document.getElementById('k401-contrib');
    const matchInput = document.getElementById('k401-match');
    const matchCapInput = document.getElementById('k401-matchcap');
    const returnInput = document.getElementById('k401-return');
    const growthInput = document.getElementById('k401-growth');
    const inflationInput = document.getElementById('k401-inflation');
    const swrInput = document.getElementById('k401-swr');
    const calculateBtn = document.getElementById('k401-calculate-btn');

    // Outputs
    const retireAgeDisplay = document.getElementById('res-k401-retire-age-display');
    const matchBadge = document.getElementById('res-k401-match-badge');
    const totalBalanceDisplay = document.getElementById('res-k401-total-balance');
    const inflationAdjDisplay = document.getElementById('res-k401-inflation-adj');
    const annualIncomeDisplay = document.getElementById('res-k401-annual-income');
    const monthlyIncomeDisplay = document.getElementById('res-k401-monthly-income');
    const swrLabel = document.getElementById('res-k401-swr-label');

    const empTotalDisplay = document.getElementById('res-k401-employee-total');
    const empPctDisplay = document.getElementById('res-k401-employee-pct');
    const matchTotalDisplay = document.getElementById('res-k401-employer-total');
    const matchPctDisplay = document.getElementById('res-k401-employer-pct');
    const growthTotalDisplay = document.getElementById('res-k401-growth-total');
    const growthPctDisplay = document.getElementById('res-k401-growth-pct');

    const barEmp = document.getElementById('bar-k401-emp');
    const barMatch = document.getElementById('bar-k401-match');
    const barGrowth = document.getElementById('bar-k401-growth');
    const barEmpText = document.getElementById('bar-k401-emp-text');
    const barMatchText = document.getElementById('bar-k401-match-text');
    const barGrowthText = document.getElementById('bar-k401-growth-text');

    const scheduleTbody = document.getElementById('k401-schedule-tbody');

    // Presets
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            presetBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            if (this.dataset.age) ageInput.value = this.dataset.age;
            if (this.dataset.retire) retireAgeInput.value = this.dataset.retire;
            if (this.dataset.salary) salaryInput.value = this.dataset.salary;
            if (this.dataset.bal) balanceInput.value = this.dataset.bal;
            if (this.dataset.contrib) contribInput.value = this.dataset.contrib;
            if (this.dataset.match) matchInput.value = this.dataset.match;
            if (this.dataset.matchcap) matchCapInput.value = this.dataset.matchcap;
            if (this.dataset.return) returnInput.value = this.dataset.return;

            calculate401k();
        });
    });

    // Real-time event listeners
    [ageInput, retireAgeInput, salaryInput, balanceInput, contribInput, matchInput, matchCapInput, returnInput, growthInput, inflationInput, swrInput].forEach(el => {
        if (el) {
            el.addEventListener('input', () => {
                presetBtns.forEach(b => b.classList.remove('active'));
                calculate401k();
            });
            el.addEventListener('change', calculate401k);
        }
    });

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculate401k);
    }

    // Core Calculation Logic
    function calculate401k() {
        const curAge = parseInt(ageInput.value, 10) || 28;
        const retireAge = parseInt(retireAgeInput.value, 10) || 65;
        const years = Math.max(1, retireAge - curAge);

        let curSalary = parseFloat(salaryInput.value) || 65000;
        const initBalance = parseFloat(balanceInput.value) || 0;
        const contribPct = (parseFloat(contribInput.value) || 0) / 100;
        const matchRate = (parseFloat(matchInput.value) || 0) / 100;
        const matchCap = (parseFloat(matchCapInput.value) || 0) / 100;
        const annualReturn = (parseFloat(returnInput.value) || 0) / 100;
        const wageGrowth = (parseFloat(growthInput.value) || 0) / 100;
        const inflation = (parseFloat(inflationInput.value) || 0) / 100;
        const swr = (parseFloat(swrInput.value) || 4.0) / 100;

        let runningBalance = initBalance;
        let cumulativeEmployee = 0;
        let cumulativeEmployer = 0;
        let scheduleRowsHtml = '';

        // Check match capture status badge
        if (matchBadge) {
            if (contribPct >= matchCap) {
                matchBadge.textContent = '100% Employer Match Captured';
                matchBadge.style.background = 'rgba(16, 185, 129, 0.15)';
                matchBadge.style.color = 'var(--color-accent-emerald, #10b981)';
            } else {
                const capturedPct = Math.round((contribPct / matchCap) * 100);
                matchBadge.textContent = `Warning: Capturing only ${capturedPct}% of available match`;
                matchBadge.style.background = 'rgba(239, 68, 68, 0.15)';
                matchBadge.style.color = 'var(--color-accent-rose, #ef4444)';
            }
        }

        const currentYear = new Date().getFullYear();

        for (let i = 1; i <= years; i++) {
            const ageAtYear = curAge + i;
            // IRS elective deferral limits (with catch-up for age 50+)
            const irsLimit = ageAtYear >= 50 ? 30500 : 23000;
            const empContrib = Math.min(curSalary * contribPct, irsLimit);

            // Match formula: matchRate on contributions up to matchCap
            const eligibleForMatch = Math.min(curSalary * contribPct, curSalary * matchCap);
            const employerMatch = eligibleForMatch * matchRate;

            const totalYearDeposit = empContrib + employerMatch;
            cumulativeEmployee += empContrib;
            cumulativeEmployer += employerMatch;

            // Investment gain (balance gains full year return, new deposits gain average mid-year return)
            const gain = (runningBalance * annualReturn) + (totalYearDeposit * annualReturn * 0.5);
            runningBalance += (totalYearDeposit + gain);

            scheduleRowsHtml += `
                <tr style="border-bottom: 1px solid var(--color-border-light);">
                    <td style="padding: 8px 12px; text-align: left; font-weight: 600; color: var(--color-text-main);">${ageAtYear}</td>
                    <td style="padding: 8px 12px; color: var(--color-text-muted);">${currentYear + i}</td>
                    <td style="padding: 8px 12px; color: var(--color-text-main);">$${Math.round(curSalary).toLocaleString()}</td>
                    <td style="padding: 8px 12px; color: var(--color-accent-blue); font-weight: 600;">$${Math.round(empContrib).toLocaleString()}</td>
                    <td style="padding: 8px 12px; color: var(--color-accent-emerald); font-weight: 600;">$${Math.round(employerMatch).toLocaleString()}</td>
                    <td style="padding: 8px 12px; color: var(--color-accent-amber); font-weight: 600;">$${Math.round(gain).toLocaleString()}</td>
                    <td style="padding: 8px 12px; font-weight: 700; color: var(--color-text-main);">$${Math.round(runningBalance).toLocaleString()}</td>
                </tr>
            `;

            curSalary *= (1 + wageGrowth);
        }

        // Summary Statistics
        const totalPortfolio = Math.round(runningBalance);
        const totalInvestGains = Math.max(0, totalPortfolio - initBalance - cumulativeEmployee - cumulativeEmployer);

        const empPct = Math.max(0, (cumulativeEmployee / totalPortfolio) * 100);
        const matchPct = Math.max(0, (cumulativeEmployer / totalPortfolio) * 100);
        const gainsPct = Math.max(0, 100 - empPct - matchPct);

        // Inflation adjusted purchasing power in today's dollars
        const inflationFactor = Math.pow(1 + inflation, years);
        const todayDollars = Math.round(totalPortfolio / inflationFactor);

        // Safe withdrawal distributions
        const annualIncome = Math.round(totalPortfolio * swr);
        const monthlyIncome = Math.round(annualIncome / 12);

        // Update DOM
        if (retireAgeDisplay) retireAgeDisplay.textContent = retireAge;
        if (totalBalanceDisplay) totalBalanceDisplay.textContent = `$${totalPortfolio.toLocaleString()}`;
        if (inflationAdjDisplay) inflationAdjDisplay.innerHTML = `Purchasing power in today's dollars (inflation-adjusted): <strong>$${todayDollars.toLocaleString()}</strong>`;

        if (annualIncomeDisplay) annualIncomeDisplay.textContent = `$${annualIncome.toLocaleString()} / yr`;
        if (monthlyIncomeDisplay) monthlyIncomeDisplay.textContent = `$${monthlyIncome.toLocaleString()} / mo`;
        if (swrLabel) swrLabel.textContent = `${(swr * 100).toFixed(1)}%`;

        if (empTotalDisplay) empTotalDisplay.textContent = `$${Math.round(cumulativeEmployee).toLocaleString()}`;
        if (empPctDisplay) empPctDisplay.textContent = `${empPct.toFixed(1)}% of total retirement portfolio`;

        if (matchTotalDisplay) matchTotalDisplay.textContent = `$${Math.round(cumulativeEmployer).toLocaleString()}`;
        if (matchPctDisplay) matchPctDisplay.textContent = `${matchPct.toFixed(1)}% free corporate matching`;

        if (growthTotalDisplay) growthTotalDisplay.textContent = `$${Math.round(totalInvestGains).toLocaleString()}`;
        if (growthPctDisplay) growthPctDisplay.textContent = `${gainsPct.toFixed(1)}% generated purely by compound growth`;

        // Update Proportional Bar
        if (barEmp) barEmp.style.width = `${empPct}%`;
        if (barMatch) barMatch.style.width = `${matchPct}%`;
        if (barGrowth) barGrowth.style.width = `${gainsPct}%`;

        if (barEmpText) barEmpText.textContent = `${empPct.toFixed(0)}%`;
        if (barMatchText) barMatchText.textContent = `${matchPct.toFixed(0)}%`;
        if (barGrowthText) barGrowthText.textContent = `${gainsPct.toFixed(0)}%`;

        // Update Table
        if (scheduleTbody) scheduleTbody.innerHTML = scheduleRowsHtml;
    }

    // Initial Execution
    calculate401k();
});
