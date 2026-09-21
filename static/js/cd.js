/**
 * Certificate of Deposit (CD) Calculator Engine
 * CalculatorHub - 100% Client-Side Pure Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Input elements
    const principalInput = document.getElementById('cd-principal');
    const apyInput = document.getElementById('cd-apy');
    const termLengthInput = document.getElementById('cd-term-length');
    const termUnitSelect = document.getElementById('cd-term-unit');
    const compoundingSelect = document.getElementById('cd-compounding');
    const taxRateInput = document.getElementById('cd-tax-rate');
    const penaltySelect = document.getElementById('cd-penalty-months');
    const calculateBtn = document.getElementById('cd-calculate-btn');

    // Advanced toggle
    const advancedToggle = document.getElementById('cd-advanced-toggle');
    const advancedBody = document.getElementById('cd-advanced-body');
    const toggleIcon = document.getElementById('cd-toggle-icon');

    // Preset buttons
    const presetButtons = document.querySelectorAll('.cd-preset-btn');

    // Output elements
    const resBalance = document.getElementById('res-cd-balance');
    const resInterest = document.getElementById('res-cd-interest');
    const resRoi = document.getElementById('res-cd-roi');
    const resAfterTaxBalance = document.getElementById('res-cd-aftertax-balance');
    const resTaxPaid = document.getElementById('res-cd-tax-paid');
    const resPenaltyBalance = document.getElementById('res-cd-penalty-balance');
    const resPenaltyAmount = document.getElementById('res-cd-penalty-amount');
    const barPrincipal = document.getElementById('bar-principal');
    const barInterest = document.getElementById('bar-interest');
    const barPrincipalLabel = document.getElementById('bar-principal-label');
    const barInterestLabel = document.getElementById('bar-interest-label');
    const scheduleTbody = document.getElementById('cd-schedule-tbody');

    if (!principalInput || !calculateBtn) return;

    // Advanced toggle click handler
    if (advancedToggle && advancedBody) {
        advancedToggle.addEventListener('click', () => {
            const isHidden = advancedBody.style.display === 'none';
            advancedBody.style.display = isHidden ? 'block' : 'none';
            if (toggleIcon) {
                toggleIcon.textContent = isHidden ? '▲' : '▼';
            }
        });
    }

    // Preset button handlers
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            presetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const months = parseInt(btn.dataset.months, 10);
            if (months >= 12 && months % 12 === 0 && termUnitSelect.value === 'years') {
                termLengthInput.value = months / 12;
            } else {
                termLengthInput.value = months;
                termUnitSelect.value = 'months';
            }
            calculateCD();
        });
    });

    function formatCurrency(val) {
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function calculateCD() {
        const principal = Math.max(1, parseFloat(principalInput.value) || 0);
        const apyPercent = Math.max(0.001, parseFloat(apyInput.value) || 0);
        const apy = apyPercent / 100;
        let termUnits = termUnitSelect.value;
        let termLength = Math.max(0.1, parseFloat(termLengthInput.value) || 1);

        // Convert duration to total years
        const totalYears = termUnits === 'months' ? (termLength / 12) : termLength;
        const totalMonths = totalYears * 12;

        const n = parseInt(compoundingSelect.value, 10) || 12; // compounding per year
        const taxRate = Math.max(0, Math.min(100, parseFloat(taxRateInput ? taxRateInput.value : 0) || 0)) / 100;
        const penaltyMonths = parseFloat(penaltySelect ? penaltySelect.value : 3) || 0;

        // Convert APY to nominal rate r: r = n * ((1 + APY)^(1/n) - 1)
        const nominalRate = n * (Math.pow(1 + apy, 1 / n) - 1);

        // Calculate maturity balance: A = P * (1 + r/n)^(n * t)
        const maturityBalance = principal * Math.pow(1 + nominalRate / n, n * totalYears);
        const totalInterest = Math.max(0, maturityBalance - principal);
        const roiPercent = (totalInterest / principal) * 100;

        // Taxes
        const taxLiability = totalInterest * taxRate;
        const afterTaxBalance = maturityBalance - taxLiability;

        // Early withdrawal penalty: Penalty = P * (nominalRate / 12) * penaltyMonths
        const penaltyAmount = principal * (nominalRate / 12) * penaltyMonths;
        const liquidatedBalance = Math.max(0, maturityBalance - penaltyAmount);

        // Update DOM Cards
        resBalance.textContent = formatCurrency(maturityBalance);
        resInterest.textContent = '+' + formatCurrency(totalInterest);
        resRoi.textContent = `+${roiPercent.toFixed(2)}% gross return on deposit`;

        resAfterTaxBalance.textContent = formatCurrency(afterTaxBalance);
        resTaxPaid.textContent = `Tax liability: ${formatCurrency(taxLiability)}`;

        resPenaltyBalance.textContent = formatCurrency(liquidatedBalance);
        resPenaltyAmount.textContent = `Penalty deduction: ${formatCurrency(penaltyAmount)}`;

        // Proportional Bar
        const principalRatio = (principal / maturityBalance) * 100;
        const interestRatio = (totalInterest / maturityBalance) * 100;
        barPrincipal.style.width = principalRatio.toFixed(1) + '%';
        barInterest.style.width = interestRatio.toFixed(1) + '%';
        barPrincipalLabel.textContent = `${formatCurrency(principal)} (${principalRatio.toFixed(1)}%)`;
        barInterestLabel.textContent = `${formatCurrency(totalInterest)} (${interestRatio.toFixed(1)}%)`;

        // Build Schedule Table
        buildSchedule(principal, nominalRate, n, totalYears, totalMonths);
    }

    function buildSchedule(principal, r, n, totalYears, totalMonths) {
        scheduleTbody.innerHTML = '';

        // If term is <= 24 months, show month-by-month; if longer, show year-by-year plus final partial year
        const isMonthly = totalMonths <= 24;
        const steps = isMonthly ? Math.ceil(totalMonths) : Math.ceil(totalYears);
        let currentBalance = principal;
        let cumInterest = 0;

        for (let i = 1; i <= steps; i++) {
            const timeElapsed = isMonthly ? (i / 12) : Math.min(i, totalYears);
            const periodBalance = principal * Math.pow(1 + r / n, n * timeElapsed);
            const periodInterest = periodBalance - currentBalance;
            cumInterest += periodInterest;

            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid var(--color-border-light)';
            if (i % 2 === 0) row.style.background = 'var(--color-bg-card-alt)';

            const label = isMonthly 
                ? (i === steps && totalMonths % 1 !== 0 ? `Month ${totalMonths.toFixed(1)} (End)` : `Month ${i}`)
                : (i === steps && totalYears % 1 !== 0 ? `Year ${totalYears.toFixed(1)} (End)` : `Year ${i}`);

            row.innerHTML = `
                <td style="padding: 10px 14px; text-align: left; font-weight: 600; color: var(--color-text-main);">${label}</td>
                <td style="padding: 10px 14px; color: var(--color-text-muted);">${formatCurrency(currentBalance)}</td>
                <td style="padding: 10px 14px; color: var(--color-accent-emerald); font-weight: 600;">+${formatCurrency(periodInterest)}</td>
                <td style="padding: 10px 14px; color: var(--color-text-main);">${formatCurrency(cumInterest)}</td>
                <td style="padding: 10px 14px; font-weight: 700; color: var(--color-accent-blue);">${formatCurrency(periodBalance)}</td>
            `;
            scheduleTbody.appendChild(row);
            currentBalance = periodBalance;
        }
    }

    // Event listeners
    calculateBtn.addEventListener('click', calculateCD);
    [principalInput, apyInput, termLengthInput, termUnitSelect, compoundingSelect, taxRateInput, penaltySelect].forEach(elem => {
        if (elem) {
            elem.addEventListener('input', calculateCD);
            elem.addEventListener('change', calculateCD);
        }
    });

    // Initial calculation on page load
    calculateCD();
});
