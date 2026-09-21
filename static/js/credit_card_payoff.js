/**
 * CalculatorHub - Credit Card Payoff Calculator Engine
 * Revolving credit amortization, CARD Act minimum payment trap modeling,
 * fixed payment vs target timeline optimization, and monthly schedule generation.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mode Buttons
    const modeBtns = document.querySelectorAll('.cc-mode-btn');
    const balanceInput = document.getElementById('cc-balance-val');
    const aprInput = document.getElementById('cc-apr-val');
    const paymentGroup = document.getElementById('cc-payment-group');
    const paymentInput = document.getElementById('cc-payment-val');
    const monthsGroup = document.getElementById('cc-months-group');
    const monthsInput = document.getElementById('cc-months-val');
    const calcBtn = document.getElementById('cc-calc-btn');

    // Outputs - Hero
    const primaryResult = document.getElementById('cc-primary-result');
    const secondaryResult = document.getElementById('cc-secondary-result');
    const resTitle = document.getElementById('cc-res-title');
    const formulaBadge = document.getElementById('cc-formula-badge');

    // Metrics
    const totalInterestVal = document.getElementById('cc-total-interest');
    const totalPaidVal = document.getElementById('cc-total-paid');
    const payoffDateVal = document.getElementById('cc-payoff-date');
    const interestRatioVal = document.getElementById('cc-interest-ratio');

    // Visual Distribution Bar
    const barPrincipal = document.getElementById('cc-bar-principal');
    const barInterest = document.getElementById('cc-bar-interest');
    const barPrincipalText = document.getElementById('cc-bar-principal-text');
    const barInterestText = document.getElementById('cc-bar-interest-text');

    // CARD Act Comparison Card
    const cardActCard = document.getElementById('cc-cardact-card');
    const cardActInterestSavings = document.getElementById('cc-cardact-savings');
    const cardActTimeSavings = document.getElementById('cc-cardact-time-savings');

    // Amortization Table
    const scheduleTbody = document.getElementById('cc-schedule-tbody');

    let currentMode = 'fixed_payment'; // 'fixed_payment', 'target_months', 'minimum_only'

    // Mode Toggle
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentMode = this.dataset.mode;
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            if (currentMode === 'fixed_payment') {
                paymentGroup.style.display = 'block';
                monthsGroup.style.display = 'none';
                resTitle.textContent = 'Estimated Payoff Duration';
                formulaBadge.textContent = 'N = -ln(1 - B·i/P) / ln(1+i)';
            } else if (currentMode === 'target_months') {
                paymentGroup.style.display = 'none';
                monthsGroup.style.display = 'block';
                resTitle.textContent = 'Required Monthly Payment';
                formulaBadge.textContent = 'P = B·i / [1 - (1+i)^(-N)]';
            } else if (currentMode === 'minimum_only') {
                paymentGroup.style.display = 'none';
                monthsGroup.style.display = 'none';
                resTitle.textContent = 'Minimum Payment Trap Timeline';
                formulaBadge.textContent = 'P_min = max(1%·B + Interest, $25)';
            }

            calculateCreditCard();
        });
    });

    [balanceInput, aprInput, paymentInput, monthsInput].forEach(el => {
        if (el) {
            el.addEventListener('input', calculateCreditCard);
            el.addEventListener('change', calculateCreditCard);
        }
    });

    if (calcBtn) {
        calcBtn.addEventListener('click', calculateCreditCard);
    }

    function calculateCreditCard() {
        const balance = parseFloat(balanceInput.value);
        const apr = parseFloat(aprInput.value);

        if (isNaN(balance) || balance <= 0 || isNaN(apr) || apr < 0) {
            showError('Please enter a valid credit card balance and APR.');
            return;
        }

        const monthlyRate = (apr / 100) / 12;

        if (currentMode === 'fixed_payment') {
            const monthlyPayment = parseFloat(paymentInput.value);
            if (isNaN(monthlyPayment) || monthlyPayment <= 0) {
                showError('Please enter your planned monthly payment.');
                return;
            }

            const firstMonthInterest = balance * monthlyRate;
            if (monthlyPayment <= firstMonthInterest) {
                showError(`Payment must exceed first month interest ($${firstMonthInterest.toFixed(2)}) to avoid negative amortization.`);
                return;
            }

            simulateAmortization(balance, monthlyRate, monthlyPayment, false);

        } else if (currentMode === 'target_months') {
            const targetMonths = parseInt(monthsInput.value, 10);
            if (isNaN(targetMonths) || targetMonths <= 0 || targetMonths > 600) {
                showError('Please enter a realistic target payoff timeline (1 - 600 months).');
                return;
            }

            let requiredPayment = 0;
            if (monthlyRate === 0) {
                requiredPayment = balance / targetMonths;
            } else {
                requiredPayment = balance * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -targetMonths)));
            }

            simulateAmortization(balance, monthlyRate, requiredPayment, false, targetMonths);

        } else if (currentMode === 'minimum_only') {
            simulateMinimumOnly(balance, monthlyRate);
        }
    }

    function simulateAmortization(principal, monthlyRate, fixedPayment, isMinPaymentOnly, targetMonthsOverride) {
        let currentBalance = principal;
        let totalInterest = 0;
        let monthCount = 0;
        let scheduleRows = [];

        const maxMonths = 1200; // 100 years guard

        while (currentBalance > 0.005 && monthCount < maxMonths) {
            monthCount++;
            const interest = currentBalance * monthlyRate;
            let payment = fixedPayment;

            if (currentBalance + interest < payment) {
                payment = currentBalance + interest;
            }

            const principalPaid = payment - interest;
            const endBalance = Math.max(0, currentBalance - principalPaid);
            totalInterest += interest;

            scheduleRows.push({
                month: monthCount,
                startBal: currentBalance,
                payment: payment,
                principalPaid: principalPaid,
                interestPaid: interest,
                endBal: endBalance
            });

            currentBalance = endBalance;
        }

        const totalPaid = principal + totalInterest;

        // Render Outputs
        if (currentMode === 'target_months') {
            primaryResult.textContent = formatCurrency(fixedPayment) + ' / mo';
            secondaryResult.innerHTML = `To be debt-free in <strong>${targetMonthsOverride} months</strong> (${(targetMonthsOverride / 12).toFixed(1)} years).`;
        } else {
            const years = (monthCount / 12).toFixed(1);
            primaryResult.textContent = `${monthCount} Months (${years} Yrs)`;
            secondaryResult.innerHTML = `Paying <strong>${formatCurrency(fixedPayment)}/month</strong> eliminates debt in <strong>${monthCount} billing cycles</strong>.`;
        }

        const today = new Date();
        const payoffDate = new Date(today.getFullYear(), today.getMonth() + monthCount, 1);
        const dateStr = payoffDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        if (totalInterestVal) totalInterestVal.textContent = formatCurrency(totalInterest);
        if (totalPaidVal) totalPaidVal.textContent = formatCurrency(totalPaid);
        if (payoffDateVal) payoffDateVal.textContent = dateStr;

        const interestPct = totalPaid > 0 ? (totalInterest / totalPaid) * 100 : 0;
        const principalPct = totalPaid > 0 ? (principal / totalPaid) * 100 : 0;

        if (interestRatioVal) interestRatioVal.textContent = `${interestPct.toFixed(1)}% of payments`;

        // Bar
        if (barPrincipal) barPrincipal.style.width = `${principalPct}%`;
        if (barInterest) barInterest.style.width = `${interestPct}%`;
        if (barPrincipalText) barPrincipalText.textContent = `Principal: ${formatCurrency(principal)} (${principalPct.toFixed(0)}%)`;
        if (barInterestText) barInterestText.textContent = `Interest: ${formatCurrency(totalInterest)} (${interestPct.toFixed(0)}%)`;

        // Render Schedule Table
        renderSchedule(scheduleRows);

        // Compare against 3-Year Plan (CARD Act Benchmark)
        updateCardActComparison(principal, monthlyRate, totalInterest, monthCount);
    }

    function simulateMinimumOnly(principal, monthlyRate) {
        let currentBalance = principal;
        let totalInterest = 0;
        let monthCount = 0;
        let scheduleRows = [];
        const maxMonths = 1200;

        while (currentBalance > 0.005 && monthCount < maxMonths) {
            monthCount++;
            const interest = currentBalance * monthlyRate;

            // Bank standard: Greater of 1% of balance + finance charge, or $25 floor
            let minPayment = Math.max(25.0, (currentBalance * 0.01) + interest);

            if (currentBalance + interest < minPayment) {
                minPayment = currentBalance + interest;
            }

            const principalPaid = minPayment - interest;
            const endBalance = Math.max(0, currentBalance - principalPaid);
            totalInterest += interest;

            scheduleRows.push({
                month: monthCount,
                startBal: currentBalance,
                payment: minPayment,
                principalPaid: principalPaid,
                interestPaid: interest,
                endBal: endBalance
            });

            currentBalance = endBalance;
        }

        const totalPaid = principal + totalInterest;
        const years = (monthCount / 12).toFixed(1);

        primaryResult.textContent = `${monthCount} Months (${years} Yrs)`;
        secondaryResult.innerHTML = `Paying only the minimum drags payoff out for <strong>${years} years</strong> with <strong>${formatCurrency(totalInterest)}</strong> in interest fees!`;

        const today = new Date();
        const payoffDate = new Date(today.getFullYear(), today.getMonth() + monthCount, 1);
        const dateStr = payoffDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        if (totalInterestVal) totalInterestVal.textContent = formatCurrency(totalInterest);
        if (totalPaidVal) totalPaidVal.textContent = formatCurrency(totalPaid);
        if (payoffDateVal) payoffDateVal.textContent = dateStr;

        const interestPct = totalPaid > 0 ? (totalInterest / totalPaid) * 100 : 0;
        const principalPct = totalPaid > 0 ? (principal / totalPaid) * 100 : 0;

        if (interestRatioVal) interestRatioVal.textContent = `${interestPct.toFixed(1)}% of payments`;

        if (barPrincipal) barPrincipal.style.width = `${principalPct}%`;
        if (barInterest) barInterest.style.width = `${interestPct}%`;
        if (barPrincipalText) barPrincipalText.textContent = `Principal: ${formatCurrency(principal)} (${principalPct.toFixed(0)}%)`;
        if (barInterestText) barInterestText.textContent = `Interest: ${formatCurrency(totalInterest)} (${interestPct.toFixed(0)}%)`;

        renderSchedule(scheduleRows);
        updateCardActComparison(principal, monthlyRate, totalInterest, monthCount);
    }

    function updateCardActComparison(principal, monthlyRate, currentInterest, currentMonths) {
        if (!cardActCard) return;

        // 3-Year (36-month) Fixed Benchmark
        const targetMonths = 36;
        const req36Payment = principal * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -targetMonths)));
        let balance36 = principal;
        let interest36 = 0;

        for (let m = 0; m < targetMonths; m++) {
            const int = balance36 * monthlyRate;
            const princ = req36Payment - int;
            balance36 -= princ;
            interest36 += int;
        }

        const savings = Math.max(0, currentInterest - interest36);
        const timeSavedMonths = Math.max(0, currentMonths - targetMonths);

        if (cardActInterestSavings) cardActInterestSavings.textContent = formatCurrency(savings);
        if (cardActTimeSavings) {
            const yrs = (timeSavedMonths / 12).toFixed(1);
            cardActTimeSavings.textContent = timeSavedMonths > 0 ? `${timeSavedMonths} months earlier (${yrs} yrs)` : 'N/A';
        }
    }

    function renderSchedule(rows) {
        if (!scheduleTbody) return;

        let html = '';
        // Show all if <= 60 rows, otherwise show first 24, last 12, and sample every 6th
        const displayRows = rows.length <= 60 ? rows : rows.filter((r, idx) => idx < 24 || idx >= rows.length - 12 || idx % 6 === 0);

        displayRows.forEach(r => {
            html += `
                <tr style="border-bottom: 1px solid var(--color-border-light);">
                    <td style="padding: 8px 10px; font-weight: 600; white-space: nowrap;">Month ${r.month}</td>
                    <td style="padding: 8px 10px; color: var(--color-text-muted); white-space: nowrap;">${formatCurrency(r.startBal)}</td>
                    <td style="padding: 8px 10px; font-weight: 700; color: var(--color-accent-blue); white-space: nowrap;">${formatCurrency(r.payment)}</td>
                    <td style="padding: 8px 10px; color: var(--color-accent-emerald); white-space: nowrap;">${formatCurrency(r.principalPaid)}</td>
                    <td style="padding: 8px 10px; color: #ef4444; white-space: nowrap;">${formatCurrency(r.interestPaid)}</td>
                    <td style="padding: 8px 10px; font-weight: 600; color: var(--color-text-main); white-space: nowrap;">${formatCurrency(r.endBal)}</td>
                </tr>
            `;
        });

        scheduleTbody.innerHTML = html;
    }

    function showError(msg) {
        primaryResult.textContent = 'Invalid Input';
        secondaryResult.textContent = msg || 'Please verify credit card parameters.';
    }

    function formatCurrency(val) {
        return '$' + Math.max(0, val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Initial Execution
    calculateCreditCard();
});
