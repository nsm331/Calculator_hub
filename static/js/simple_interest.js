/**
 * Simple Interest Calculator Engine
 * Formula: I = P * r * t,  A = P + I = P(1 + rt)
 * Supports Exact (365-day) and Ordinary (360-day Banker's Rule) day-count conventions.
 * 100% Client-Side Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mode tabs
    const modeTabs = document.querySelectorAll('.si-tab-btn');
    let currentMode = 'standard'; // 'standard', 'principal', 'rate', 'time'

    // Form elements - Standard mode
    const principalInput = document.getElementById('si-principal');
    const rateInput = document.getElementById('si-rate');
    const termInput = document.getElementById('si-term');
    const termUnitSelect = document.getElementById('si-term-unit');
    const dayCountSelect = document.getElementById('si-day-count');

    // Solve-for specific inputs
    const targetInterestGroup = document.getElementById('si-target-interest-group');
    const targetInterestInput = document.getElementById('si-target-interest');
    const principalGroup = document.getElementById('si-principal-group');
    const rateGroup = document.getElementById('si-rate-group');
    const termGroup = document.getElementById('si-term-group');

    // Output elements
    const totalInterestEl = document.getElementById('si-total-interest');
    const endBalanceEl = document.getElementById('si-end-balance');
    const principalRatioEl = document.getElementById('si-principal-ratio');
    const interestRatioEl = document.getElementById('si-interest-ratio');
    const ratioBarPrincipal = document.getElementById('si-bar-principal');
    const ratioBarInterest = document.getElementById('si-bar-interest');

    const periodicYearEl = document.getElementById('si-periodic-year');
    const periodicMonthEl = document.getElementById('si-periodic-month');
    const periodicDayEl = document.getElementById('si-periodic-day');
    const compoundDiffEl = document.getElementById('si-compound-diff');
    const compoundCompNoticeEl = document.getElementById('si-compound-notice');

    const scheduleBody = document.getElementById('si-schedule-body');
    const scheduleCard = document.getElementById('si-schedule-card');

    function formatMoney(amount) {
        if (isNaN(amount) || !isFinite(amount)) return '$0.00';
        return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatNumber(num, decimals = 2) {
        if (isNaN(num) || !isFinite(num)) return '0';
        return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }

    function getTermInYears(term, unit, convention) {
        const daysInYear = convention === '360' ? 360 : 365;
        if (unit === 'years') return term;
        if (unit === 'months') return term / 12;
        if (unit === 'days') return term / daysInYear;
        return term;
    }

    function calculate() {
        const convention = dayCountSelect ? dayCountSelect.value : '365';
        const unit = termUnitSelect ? termUnitSelect.value : 'years';

        let P = parseFloat(principalInput.value) || 0;
        let r = (parseFloat(rateInput.value) || 0) / 100;
        let rawTerm = parseFloat(termInput.value) || 0;
        let tYears = getTermInYears(rawTerm, unit, convention);
        let targetI = parseFloat(targetInterestInput ? targetInterestInput.value : 0) || 0;

        let interest = 0;
        let balance = 0;

        if (currentMode === 'standard') {
            if (P <= 0 || r <= 0 || tYears <= 0) {
                resetOutputs();
                return;
            }
            interest = P * r * tYears;
            balance = P + interest;
        } else if (currentMode === 'principal') {
            // Solve P = I / (r * t)
            if (targetI <= 0 || r <= 0 || tYears <= 0) {
                resetOutputs();
                return;
            }
            P = targetI / (r * tYears);
            interest = targetI;
            balance = P + interest;
        } else if (currentMode === 'rate') {
            // Solve r = I / (P * t)
            if (P <= 0 || targetI <= 0 || tYears <= 0) {
                resetOutputs();
                return;
            }
            r = targetI / (P * tYears);
            interest = targetI;
            balance = P + interest;
            if (rateInput) rateInput.value = (r * 100).toFixed(2);
        } else if (currentMode === 'time') {
            // Solve t = I / (P * r)
            if (P <= 0 || targetI <= 0 || r <= 0) {
                resetOutputs();
                return;
            }
            tYears = targetI / (P * r);
            interest = targetI;
            balance = P + interest;
            const daysInYear = convention === '360' ? 360 : 365;
            if (unit === 'years' && termInput) termInput.value = tYears.toFixed(2);
            if (unit === 'months' && termInput) termInput.value = (tYears * 12).toFixed(1);
            if (unit === 'days' && termInput) termInput.value = Math.round(tYears * daysInYear);
        }

        // Render summary cards
        if (totalInterestEl) totalInterestEl.textContent = formatMoney(interest);
        if (endBalanceEl) endBalanceEl.textContent = formatMoney(balance);

        const principalPct = balance > 0 ? (P / balance) * 100 : 100;
        const interestPct = balance > 0 ? (interest / balance) * 100 : 0;

        if (principalRatioEl) principalRatioEl.textContent = `${principalPct.toFixed(1)}%`;
        if (interestRatioEl) interestRatioEl.textContent = `${interestPct.toFixed(1)}%`;

        if (ratioBarPrincipal) ratioBarPrincipal.style.width = `${principalPct}%`;
        if (ratioBarInterest) ratioBarInterest.style.width = `${interestPct}%`;

        // Periodic breakdown
        const interestPerYear = P * r;
        const interestPerMonth = interestPerYear / 12;
        const daysInYear = convention === '360' ? 360 : 365;
        const interestPerDay = interestPerYear / daysInYear;

        if (periodicYearEl) periodicYearEl.textContent = formatMoney(interestPerYear);
        if (periodicMonthEl) periodicMonthEl.textContent = formatMoney(interestPerMonth);
        if (periodicDayEl) periodicDayEl.textContent = formatMoney(interestPerDay);

        // Compound interest opportunity comparison (annual compounding)
        const compoundBalance = P * Math.pow(1 + r, tYears);
        const compoundInterest = compoundBalance - P;
        const compDiff = compoundInterest - interest;

        if (compoundDiffEl) compoundDiffEl.textContent = formatMoney(compDiff);
        if (compoundCompNoticeEl) {
            compoundCompNoticeEl.textContent = `Compound interest would yield ${formatMoney(compoundBalance)} total (${formatMoney(compDiff)} more).`;
        }

        // Generate schedule table
        renderSchedule(P, r, tYears, balance);
    }

    function renderSchedule(P, r, tYears, totalBalance) {
        if (!scheduleBody) return;
        scheduleBody.innerHTML = '';

        const fullYears = Math.min(Math.ceil(tYears), 50); // limit to 50 rows
        let runningPrincipal = P;
        let cumulativeInterest = 0;
        const annualRate = r;

        for (let year = 1; year <= fullYears; year++) {
            let yearDuration = 1.0;
            if (year > tYears) {
                yearDuration = tYears - (year - 1);
            }
            if (yearDuration <= 0) break;

            const yearInterest = P * annualRate * yearDuration;
            cumulativeInterest += yearInterest;
            const endYearBalance = P + cumulativeInterest;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Year ${year} ${yearDuration < 1 ? `(${(yearDuration * 100).toFixed(0)}% yr)` : ''}</td>
                <td>${formatMoney(runningPrincipal)}</td>
                <td style="color: var(--color-success); font-weight: 600;">+${formatMoney(yearInterest)}</td>
                <td>${formatMoney(cumulativeInterest)}</td>
                <td style="font-weight: 700; color: var(--color-primary);">${formatMoney(endYearBalance)}</td>
            `;
            scheduleBody.appendChild(row);
        }

        if (scheduleCard) scheduleCard.style.display = 'block';
    }

    function resetOutputs() {
        if (totalInterestEl) totalInterestEl.textContent = '$0.00';
        if (endBalanceEl) endBalanceEl.textContent = '$0.00';
        if (principalRatioEl) principalRatioEl.textContent = '100%';
        if (interestRatioEl) interestRatioEl.textContent = '0%';
        if (ratioBarPrincipal) ratioBarPrincipal.style.width = '100%';
        if (ratioBarInterest) ratioBarInterest.style.width = '0%';
        if (periodicYearEl) periodicYearEl.textContent = '$0.00';
        if (periodicMonthEl) periodicMonthEl.textContent = '$0.00';
        if (periodicDayEl) periodicDayEl.textContent = '$0.00';
        if (compoundDiffEl) compoundDiffEl.textContent = '$0.00';
        if (compoundCompNoticeEl) compoundCompNoticeEl.textContent = 'Compound interest comparison will display here.';
        if (scheduleBody) scheduleBody.innerHTML = '';
    }

    // Switch modes
    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            modeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentMode = tab.dataset.mode;

            // Toggle visibility of input fields according to mode
            if (currentMode === 'standard') {
                if (targetInterestGroup) targetInterestGroup.style.display = 'none';
                if (principalGroup) principalGroup.style.display = 'block';
                if (rateGroup) rateGroup.style.display = 'block';
                if (termGroup) termGroup.style.display = 'block';
            } else if (currentMode === 'principal') {
                if (targetInterestGroup) targetInterestGroup.style.display = 'block';
                if (principalGroup) principalGroup.style.display = 'none';
                if (rateGroup) rateGroup.style.display = 'block';
                if (termGroup) termGroup.style.display = 'block';
            } else if (currentMode === 'rate') {
                if (targetInterestGroup) targetInterestGroup.style.display = 'block';
                if (principalGroup) principalGroup.style.display = 'block';
                if (rateGroup) rateGroup.style.display = 'none';
                if (termGroup) termGroup.style.display = 'block';
            } else if (currentMode === 'time') {
                if (targetInterestGroup) targetInterestGroup.style.display = 'block';
                if (principalGroup) principalGroup.style.display = 'block';
                if (rateGroup) rateGroup.style.display = 'block';
                if (termGroup) termGroup.style.display = 'none';
            }

            calculate();
        });
    });

    // Event listeners
    const inputs = [principalInput, rateInput, termInput, targetInterestInput];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', calculate);
        }
    });

    if (termUnitSelect) termUnitSelect.addEventListener('change', calculate);
    if (dayCountSelect) dayCountSelect.addEventListener('change', calculate);

    // Initial calculation
    calculate();
});
