/**
 * Amortization Calculator Engine
 * Handles exact loan liquidation schedule with monthly and annual prepayments.
 */

(function () {
    'use strict';

    // DOM Elements
    const amountInput = document.getElementById('amort-amount');
    const rateInput = document.getElementById('amort-rate');
    const yearsInput = document.getElementById('amort-term-years');
    const monthsInput = document.getElementById('amort-term-months');
    const startDateInput = document.getElementById('amort-start-date');
    const extraMonthlyInput = document.getElementById('amort-extra-monthly');
    const extraAnnualInput = document.getElementById('amort-extra-annual');

    const calculateBtn = document.getElementById('amort-calculate-btn');
    const resetBtn = document.getElementById('amort-reset-btn');

    // Outputs
    const monthlyPmtEl = document.getElementById('amort-monthly-pmt');
    const payoffDateEl = document.getElementById('amort-payoff-date');
    const savingsCardEl = document.getElementById('amort-savings-card');
    const savingsTextEl = document.getElementById('amort-savings-text');
    const savingsAmountEl = document.getElementById('amort-savings-amount');

    const barPrincipalPct = document.getElementById('amort-bar-principal-pct');
    const barPrincipalVal = document.getElementById('amort-bar-principal-val');
    const barInterestPct = document.getElementById('amort-bar-interest-pct');
    const barInterestVal = document.getElementById('amort-bar-interest-val');
    const barPrincipal = document.getElementById('amort-bar-principal');
    const barInterest = document.getElementById('amort-bar-interest');

    const totalPrincipalEl = document.getElementById('amort-total-principal');
    const totalInterestEl = document.getElementById('amort-total-interest');
    const totalCostEl = document.getElementById('amort-total-cost');
    const paymentsCountEl = document.getElementById('amort-payments-count');
    const totalExtraEl = document.getElementById('amort-total-extra');
    const interestRatioEl = document.getElementById('amort-interest-ratio');

    const viewAnnualBtn = document.getElementById('amort-view-annual-btn');
    const viewMonthlyBtn = document.getElementById('amort-view-monthly-btn');
    const tableHeaderRow = document.getElementById('amort-table-header-row');
    const tableTbody = document.getElementById('amort-schedule-tbody');
    const tableRowCountEl = document.getElementById('amort-table-row-count');

    let currentViewMode = 'annual'; // 'annual' or 'monthly'
    let currentMonthlyData = [];
    let currentAnnualData = [];

    // Currency Formatter
    function formatCurrency(num) {
        return '$' + Number(num).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Month Names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    function calculateAmortization() {
        const principal = parseFloat(amountInput.value) || 0;
        const annualRate = parseFloat(rateInput.value) || 0;
        const termYears = parseInt(yearsInput.value, 10) || 0;
        const termMonthsExtra = parseInt(monthsInput.value, 10) || 0;
        const totalMonths = (termYears * 12) + termMonthsExtra;

        const extraMonthly = parseFloat(extraMonthlyInput.value) || 0;
        const extraAnnual = parseFloat(extraAnnualInput.value) || 0;

        if (principal <= 0 || totalMonths <= 0) {
            return;
        }

        const monthlyRate = annualRate > 0 ? (annualRate / 100 / 12) : 0;

        // Calculate standard monthly payment M
        let standardMonthlyPmt = 0;
        if (monthlyRate === 0) {
            standardMonthlyPmt = principal / totalMonths;
        } else {
            const factor = Math.pow(1 + monthlyRate, totalMonths);
            standardMonthlyPmt = principal * (monthlyRate * factor) / (factor - 1);
        }

        // Baseline (no extra payments)
        let baselineTotalInterest = 0;
        if (monthlyRate === 0) {
            baselineTotalInterest = 0;
        } else {
            baselineTotalInterest = (standardMonthlyPmt * totalMonths) - principal;
        }

        // Parse starting date
        let startYear = 2026;
        let startMonthIndex = 9; // October (0-indexed)
        if (startDateInput.value) {
            const parts = startDateInput.value.split('-');
            if (parts.length === 2) {
                startYear = parseInt(parts[0], 10);
                startMonthIndex = parseInt(parts[1], 10) - 1;
            }
        }

        // Simulate Actual Month-by-Month Amortization
        let balance = principal;
        let totalInterestPaid = 0;
        let totalPrincipalPaid = 0;
        let totalExtraPaid = 0;
        let paymentNumber = 0;

        currentMonthlyData = [];
        let annualBuckets = {};

        while (balance > 0.001 && paymentNumber < 1200) {
            paymentNumber++;

            // Date of this payment
            const curDate = new Date(startYear, startMonthIndex + paymentNumber - 1, 1);
            const curMonth = curDate.getMonth();
            const curYear = curDate.getFullYear();

            const begBalance = balance;
            const interestPayment = balance * monthlyRate;

            // Base principal scheduled
            let scheduledPrincipal = standardMonthlyPmt - interestPayment;
            if (scheduledPrincipal < 0) scheduledPrincipal = 0;

            // Extra payments
            let extraThisMonth = extraMonthly;
            if (curMonth === 11 && extraAnnual > 0) { // December
                extraThisMonth += extraAnnual;
            }

            let principalPayment = scheduledPrincipal + extraThisMonth;
            let actualExtra = extraThisMonth;

            // Check if final payoff
            if (principalPayment >= balance) {
                principalPayment = balance;
                if (scheduledPrincipal >= balance) {
                    scheduledPrincipal = balance;
                    actualExtra = 0;
                } else {
                    actualExtra = balance - scheduledPrincipal;
                }
                balance = 0;
            } else {
                balance -= principalPayment;
            }

            totalInterestPaid += interestPayment;
            totalPrincipalPaid += principalPayment;
            totalExtraPaid += actualExtra;

            const monthEntry = {
                num: paymentNumber,
                dateStr: monthNames[curMonth].slice(0, 3) + ' ' + curYear,
                year: curYear,
                month: curMonth,
                begBalance: begBalance,
                principalPaid: principalPayment,
                interestPaid: interestPayment,
                extraPaid: actualExtra,
                endBalance: balance
            };
            currentMonthlyData.push(monthEntry);

            // Group into annual bucket
            if (!annualBuckets[curYear]) {
                annualBuckets[curYear] = {
                    year: curYear,
                    begBalance: begBalance,
                    principalPaid: 0,
                    interestPaid: 0,
                    extraPaid: 0,
                    endBalance: 0
                };
            }
            annualBuckets[curYear].principalPaid += principalPayment;
            annualBuckets[curYear].interestPaid += interestPayment;
            annualBuckets[curYear].extraPaid += actualExtra;
            annualBuckets[curYear].endBalance = balance;
        }

        currentAnnualData = Object.values(annualBuckets);

        // Update UI
        monthlyPmtEl.textContent = formatCurrency(standardMonthlyPmt);

        // Payoff Date
        const lastEntry = currentMonthlyData[currentMonthlyData.length - 1];
        if (lastEntry) {
            payoffDateEl.innerHTML = `Estimated Payoff Date: <strong>${monthNames[lastEntry.month]} ${lastEntry.year}</strong>`;
        }

        // Savings analysis
        const totalPaid = totalPrincipalPaid + totalInterestPaid;
        const monthsSaved = totalMonths - paymentNumber;
        const interestSaved = Math.max(0, baselineTotalInterest - totalInterestPaid);

        if ((extraMonthly > 0 || extraAnnual > 0) && (monthsSaved > 0 || interestSaved > 10)) {
            const yearsSaved = Math.floor(monthsSaved / 12);
            const remainingMonthsSaved = monthsSaved % 12;
            let timeSavedStr = '';
            if (yearsSaved > 0) {
                timeSavedStr += `${yearsSaved} year${yearsSaved > 1 ? 's' : ''} `;
            }
            if (remainingMonthsSaved > 0 || yearsSaved === 0) {
                timeSavedStr += `${remainingMonthsSaved} month${remainingMonthsSaved > 1 ? 's' : ''}`;
            }

            savingsTextEl.innerHTML = `By making extra payments, you will retire your debt <strong>${timeSavedStr} earlier</strong> and save <strong>${formatCurrency(interestSaved)}</strong> in total interest!`;
            savingsAmountEl.textContent = formatCurrency(interestSaved);
            savingsCardEl.style.display = 'block';
        } else {
            savingsCardEl.style.display = 'none';
        }

        // Ratio Bar
        const principalPct = (principal / totalPaid) * 100;
        const interestPct = (totalInterestPaid / totalPaid) * 100;

        barPrincipalPct.textContent = principalPct.toFixed(1) + '%';
        barPrincipalVal.textContent = formatCurrency(principal);
        barInterestPct.textContent = interestPct.toFixed(1) + '%';
        barInterestVal.textContent = formatCurrency(totalInterestPaid);

        barPrincipal.style.width = principalPct + '%';
        barInterest.style.width = interestPct + '%';

        // Breakdown Cards
        totalPrincipalEl.textContent = formatCurrency(principal);
        totalInterestEl.textContent = formatCurrency(totalInterestPaid);
        totalCostEl.textContent = formatCurrency(totalPaid);
        paymentsCountEl.textContent = `${paymentNumber} Payments (${(paymentNumber / 12).toFixed(1)} Yrs)`;
        totalExtraEl.textContent = formatCurrency(totalExtraPaid);
        interestRatioEl.textContent = ((totalInterestPaid / principal) * 100).toFixed(1) + '%';

        renderScheduleTable();
    }

    function renderScheduleTable() {
        tableTbody.innerHTML = '';

        if (currentViewMode === 'annual') {
            tableHeaderRow.innerHTML = `
                <th>Year</th>
                <th>Starting Balance</th>
                <th>Principal Paid</th>
                <th>Interest Paid</th>
                <th>Extra Paid</th>
                <th>Ending Balance</th>
            `;

            currentAnnualData.forEach(function (row) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${row.year}</strong></td>
                    <td>${formatCurrency(row.begBalance)}</td>
                    <td style="color: #3b82f6;">${formatCurrency(row.principalPaid)}</td>
                    <td style="color: #ef4444;">${formatCurrency(row.interestPaid)}</td>
                    <td style="color: #22c55e;">${formatCurrency(row.extraPaid)}</td>
                    <td><strong>${formatCurrency(row.endBalance)}</strong></td>
                `;
                tableTbody.appendChild(tr);
            });

            tableRowCountEl.textContent = `Showing ${currentAnnualData.length} annual interval${currentAnnualData.length > 1 ? 's' : ''}`;
        } else {
            tableHeaderRow.innerHTML = `
                <th>#</th>
                <th>Date</th>
                <th>Beginning Balance</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Extra</th>
                <th>Ending Balance</th>
            `;

            currentMonthlyData.forEach(function (row) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.num}</td>
                    <td><strong>${row.dateStr}</strong></td>
                    <td>${formatCurrency(row.begBalance)}</td>
                    <td style="color: #3b82f6;">${formatCurrency(row.principalPaid)}</td>
                    <td style="color: #ef4444;">${formatCurrency(row.interestPaid)}</td>
                    <td style="color: #22c55e;">${formatCurrency(row.extraPaid)}</td>
                    <td><strong>${formatCurrency(row.endBalance)}</strong></td>
                `;
                tableTbody.appendChild(tr);
            });

            tableRowCountEl.textContent = `Showing all ${currentMonthlyData.length} monthly payments`;
        }
    }

    // View Toggle Handlers
    if (viewAnnualBtn && viewMonthlyBtn) {
        viewAnnualBtn.addEventListener('click', function () {
            currentViewMode = 'annual';
            viewAnnualBtn.classList.add('active');
            viewAnnualBtn.style.background = 'var(--accent-primary)';
            viewAnnualBtn.style.color = '#fff';

            viewMonthlyBtn.classList.remove('active');
            viewMonthlyBtn.style.background = 'transparent';
            viewMonthlyBtn.style.color = 'var(--text-secondary)';
            renderScheduleTable();
        });

        viewMonthlyBtn.addEventListener('click', function () {
            currentViewMode = 'monthly';
            viewMonthlyBtn.classList.add('active');
            viewMonthlyBtn.style.background = 'var(--accent-primary)';
            viewMonthlyBtn.style.color = '#fff';

            viewAnnualBtn.classList.remove('active');
            viewAnnualBtn.style.background = 'transparent';
            viewAnnualBtn.style.color = 'var(--text-secondary)';
            renderScheduleTable();
        });
    }

    // Event Listeners for Instant Recalculation
    const inputs = [
        amountInput, rateInput, yearsInput, monthsInput,
        startDateInput, extraMonthlyInput, extraAnnualInput
    ];

    inputs.forEach(function (el) {
        if (el) {
            el.addEventListener('input', calculateAmortization);
            el.addEventListener('change', calculateAmortization);
        }
    });

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateAmortization);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            amountInput.value = '250000';
            rateInput.value = '6.50';
            yearsInput.value = '30';
            monthsInput.value = '0';
            startDateInput.value = '2026-10';
            extraMonthlyInput.value = '100';
            extraAnnualInput.value = '0';
            calculateAmortization();
        });
    }

    // Initial Execution
    calculateAmortization();
})();
