/**
 * Mortgage Refinance Calculator Engine
 * Compares existing financing versus new loan terms, calculates break-even months and lifetime interest savings.
 */

(function () {
    'use strict';

    // DOM Inputs
    const currentBalanceInput = document.getElementById('ref-current-balance');
    const currentRateInput = document.getElementById('ref-current-rate');
    const currentYearsInput = document.getElementById('ref-current-term-years');
    const currentMonthsInput = document.getElementById('ref-current-term-months');

    const newRateInput = document.getElementById('ref-new-rate');
    const newTermInput = document.getElementById('ref-new-term');
    const closingCostsInput = document.getElementById('ref-closing-costs');
    const rollClosingCostsCheck = document.getElementById('ref-roll-closing-costs');

    const termPresetBtns = document.querySelectorAll('.ref-term-btn');
    const calculateBtn = document.getElementById('ref-calculate-btn');
    const resetBtn = document.getElementById('ref-reset-btn');

    // Hero & Metric Outputs
    const heroLabel = document.getElementById('ref-hero-label');
    const monthlyDiffEl = document.getElementById('ref-monthly-diff');
    const heroSubtext = document.getElementById('ref-hero-subtext');

    const breakevenValEl = document.getElementById('ref-breakeven-val');
    const lifetimeSavingsEl = document.getElementById('ref-lifetime-savings');
    const newPaymentEl = document.getElementById('ref-new-payment');
    const currentPaymentEl = document.getElementById('ref-current-payment');

    // Table Cells
    const tblCurrBalance = document.getElementById('tbl-curr-balance');
    const tblNewBalance = document.getElementById('tbl-new-balance');
    const tblDiffBalance = document.getElementById('tbl-diff-balance');

    const tblCurrRate = document.getElementById('tbl-curr-rate');
    const tblNewRate = document.getElementById('tbl-new-rate');
    const tblDiffRate = document.getElementById('tbl-diff-rate');

    const tblCurrPmt = document.getElementById('tbl-curr-pmt');
    const tblNewPmt = document.getElementById('tbl-new-pmt');
    const tblDiffPmt = document.getElementById('tbl-diff-pmt');

    const tblCurrTerm = document.getElementById('tbl-curr-term');
    const tblNewTerm = document.getElementById('tbl-new-term');
    const tblDiffTerm = document.getElementById('tbl-diff-term');

    const tblCurrInterest = document.getElementById('tbl-curr-interest');
    const tblNewInterest = document.getElementById('tbl-new-interest');
    const tblDiffInterest = document.getElementById('tbl-diff-interest');

    const tblCurrTotal = document.getElementById('tbl-curr-total');
    const tblNewTotal = document.getElementById('tbl-new-total');
    const tblDiffTotal = document.getElementById('tbl-diff-total');

    const verdictNote = document.getElementById('ref-verdict-note');

    function formatCurrency(val) {
        return '$' + Number(val).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function calculatePayment(p, r, n) {
        if (n <= 0) return 0;
        if (r === 0) return p / n;
        const factor = Math.pow(1 + r, n);
        return p * (r * factor) / (factor - 1);
    }

    function calculateRefinance() {
        const curBalance = parseFloat(currentBalanceInput.value) || 0;
        const curAnnualRate = parseFloat(currentRateInput.value) || 0;
        const curYears = parseInt(currentYearsInput.value, 10) || 0;
        const curMonths = parseInt(currentMonthsInput.value, 10) || 0;
        const curTotalMonths = (curYears * 12) + curMonths;

        const newAnnualRate = parseFloat(newRateInput.value) || 0;
        const newTermYears = parseInt(newTermInput.value, 10) || 0;
        const newTotalMonths = newTermYears * 12;

        const closingCosts = parseFloat(closingCostsInput.value) || 0;
        const rollClosingCosts = rollClosingCostsCheck.checked;

        if (curBalance <= 0 || curTotalMonths <= 0 || newTotalMonths <= 0) {
            return;
        }

        const curMonthlyRate = curAnnualRate > 0 ? (curAnnualRate / 100 / 12) : 0;
        const newMonthlyRate = newAnnualRate > 0 ? (newAnnualRate / 100 / 12) : 0;

        // Current Loan Monthly Payment & Cost
        const curPayment = calculatePayment(curBalance, curMonthlyRate, curTotalMonths);
        const curTotalCost = curPayment * curTotalMonths;
        const curTotalInterest = curTotalCost - curBalance;

        // New Loan Principal & Financing
        let newBalance = curBalance;
        let upfrontPaid = 0;

        if (rollClosingCosts) {
            newBalance += closingCosts;
        } else {
            upfrontPaid = closingCosts;
        }

        const newPayment = calculatePayment(newBalance, newMonthlyRate, newTotalMonths);
        const newTotalCost = (newPayment * newTotalMonths) + upfrontPaid;
        const newTotalInterest = (newPayment * newTotalMonths) - curBalance; // true interest above original debt

        // Monthly Difference (positive = savings, negative = higher payment)
        const monthlySavings = curPayment - newPayment;
        const lifetimeSavings = curTotalCost - newTotalCost;

        // Break-even months calculation
        let breakevenMonthsText = 'N/A';
        let breakevenMonths = 0;

        if (monthlySavings > 0) {
            breakevenMonths = Math.ceil(closingCosts / monthlySavings);
            const beYears = (breakevenMonths / 12).toFixed(1);
            breakevenMonthsText = `${breakevenMonths} Months (${beYears} Yrs)`;
        } else if (lifetimeSavings > 0) {
            breakevenMonthsText = 'Shortened Term (Equity Accelerated)';
        } else {
            breakevenMonthsText = 'Never (Higher Total Cost)';
        }

        // Update Hero Banner
        if (monthlySavings >= 0) {
            heroLabel.textContent = 'Monthly Payment Reduction';
            monthlyDiffEl.textContent = `-${formatCurrency(monthlySavings)} / mo`;
            monthlyDiffEl.style.color = '#22c55e';
            heroSubtext.innerHTML = `Break-even in <strong>${breakevenMonthsText}</strong> with total lifetime interest savings of <strong>${formatCurrency(lifetimeSavings)}</strong>.`;
        } else {
            heroLabel.textContent = 'Monthly Payment Increase (Accelerated Amortization)';
            monthlyDiffEl.textContent = `+${formatCurrency(Math.abs(monthlySavings))} / mo`;
            monthlyDiffEl.style.color = '#38bdf8';
            if (lifetimeSavings > 0) {
                heroSubtext.innerHTML = `You pay higher monthly, but save <strong>${formatCurrency(lifetimeSavings)}</strong> overall by retiring your debt ${(curTotalMonths - newTotalMonths) / 12} years earlier!`;
            } else {
                heroSubtext.innerHTML = `Warning: This refinance increases both monthly payments and total financing costs.`;
            }
        }

        // Key Cards
        breakevenValEl.textContent = breakevenMonthsText;
        lifetimeSavingsEl.textContent = formatCurrency(lifetimeSavings);
        lifetimeSavingsEl.style.color = lifetimeSavings >= 0 ? '#22c55e' : '#ef4444';
        newPaymentEl.textContent = formatCurrency(newPayment);
        currentPaymentEl.textContent = formatCurrency(curPayment);

        // Table Rows
        tblCurrBalance.textContent = formatCurrency(curBalance);
        tblNewBalance.textContent = formatCurrency(newBalance);
        tblDiffBalance.textContent = formatCurrency(newBalance - curBalance);

        tblCurrRate.textContent = `${curAnnualRate.toFixed(2)}%`;
        tblNewRate.textContent = `${newAnnualRate.toFixed(2)}%`;
        const rateDiff = newAnnualRate - curAnnualRate;
        tblDiffRate.textContent = `${rateDiff > 0 ? '+' : ''}${rateDiff.toFixed(2)}%`;
        tblDiffRate.style.color = rateDiff <= 0 ? '#22c55e' : '#ef4444';

        tblCurrPmt.textContent = formatCurrency(curPayment);
        tblNewPmt.textContent = formatCurrency(newPayment);
        tblDiffPmt.textContent = `${monthlySavings >= 0 ? '-' : '+'}${formatCurrency(Math.abs(monthlySavings))} / mo`;
        tblDiffPmt.style.color = monthlySavings >= 0 ? '#22c55e' : '#ef4444';

        tblCurrTerm.textContent = `${curYears} Yrs (${curTotalMonths} Mos)`;
        tblNewTerm.textContent = `${newTermYears} Yrs (${newTotalMonths} Mos)`;
        const termDiffMos = newTotalMonths - curTotalMonths;
        tblDiffTerm.textContent = `${termDiffMos >= 0 ? '+' : ''}${(termDiffMos / 12).toFixed(1)} Yrs (${termDiffMos >= 0 ? '+' : ''}${termDiffMos} Mos)`;

        tblCurrInterest.textContent = formatCurrency(curTotalInterest);
        tblNewInterest.textContent = formatCurrency(newTotalInterest);
        const intDiff = newTotalInterest - curTotalInterest;
        tblDiffInterest.textContent = `${intDiff >= 0 ? '+' : ''}${formatCurrency(intDiff)}`;
        tblDiffInterest.style.color = intDiff <= 0 ? '#22c55e' : '#ef4444';

        tblCurrTotal.textContent = formatCurrency(curTotalCost);
        tblNewTotal.textContent = formatCurrency(newTotalCost);
        const totDiff = newTotalCost - curTotalCost;
        tblDiffTotal.textContent = `${totDiff >= 0 ? '+' : ''}${formatCurrency(totDiff)}`;
        tblDiffTotal.style.color = totDiff <= 0 ? '#22c55e' : '#ef4444';

        // Verdict Note
        if (lifetimeSavings > 0 && monthlySavings > 0) {
            verdictNote.innerHTML = `✅ <strong>Optimal Refinance Opportunity:</strong> You lower your monthly payments by <strong>${formatCurrency(monthlySavings)}</strong> and save a net total of <strong>${formatCurrency(lifetimeSavings)}</strong> after fully recouping the <strong>${formatCurrency(closingCosts)}</strong> closing costs in <strong>${breakevenMonths} months</strong>.`;
        } else if (lifetimeSavings > 0 && monthlySavings <= 0) {
            verdictNote.innerHTML = `⚡ <strong>Wealth Accelerator Refinance:</strong> Shortening your loan term increases your monthly commitment by <strong>${formatCurrency(Math.abs(monthlySavings))}</strong>, but eliminates <strong>${formatCurrency(lifetimeSavings)}</strong> in total debt interest.`;
        } else {
            verdictNote.innerHTML = `⚠️ <strong>Caution:</strong> This combination of closing costs and amortization extension results in paying <strong>${formatCurrency(Math.abs(lifetimeSavings))} more</strong> over the loan's duration. Consider negotiating lower points or matching the remaining term.`;
        }
    }

    // Preset term buttons
    termPresetBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const y = btn.getAttribute('data-years');
            if (y) {
                newTermInput.value = y;
                calculateRefinance();
            }
        });
    });

    // Input Event Listeners
    const allInputs = [
        currentBalanceInput, currentRateInput, currentYearsInput, currentMonthsInput,
        newRateInput, newTermInput, closingCostsInput, rollClosingCostsCheck
    ];

    allInputs.forEach(function (el) {
        if (el) {
            el.addEventListener('input', calculateRefinance);
            el.addEventListener('change', calculateRefinance);
        }
    });

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateRefinance);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            currentBalanceInput.value = '280000';
            currentRateInput.value = '6.75';
            currentYearsInput.value = '25';
            currentMonthsInput.value = '0';
            newRateInput.value = '5.25';
            newTermInput.value = '30';
            closingCostsInput.value = '4500';
            rollClosingCostsCheck.checked = false;
            calculateRefinance();
        });
    }

    // Initial Execution
    calculateRefinance();
})();
