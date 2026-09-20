/**
 * calculator_net - Modular Loan Calculator Engine
 * Pure Client-Side Vanilla JavaScript (Zero Page Reload)
 */

document.addEventListener('DOMContentLoaded', () => {
    const loanForm = document.getElementById('loan-form');
    const clearBtn = document.getElementById('btn-clear-loan');
    const resultPanel = document.getElementById('loan-result-panel');

    const monthlyPaymentEl = document.getElementById('loan-monthly-payment');
    const totalPrincipalEl = document.getElementById('loan-total-principal');
    const totalInterestEl = document.getElementById('loan-total-interest');
    const totalPaymentsEl = document.getElementById('loan-total-payments');
    const ratioValEl = document.getElementById('loan-ratio-val');
    const payoffDateBadge = document.getElementById('loan-payoff-date');

    const barPrincipal = document.getElementById('loan-bar-principal');
    const barInterest = document.getElementById('loan-bar-interest');
    const labelPrincipal = document.getElementById('loan-label-principal');
    const labelInterest = document.getElementById('loan-label-interest');

    function formatCurrency(num) {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function calculateLoan(event) {
        if (event) {
            event.preventDefault(); // Prevent page reload strictly
        }

        const principal = parseFloat(document.getElementById('loan-amount').value) || 0;
        const annualRate = parseFloat(document.getElementById('loan-rate').value) || 0;
        const years = parseFloat(document.getElementById('loan-term-years').value) || 0;
        const months = parseFloat(document.getElementById('loan-term-months').value) || 0;
        const frequency = parseInt(document.getElementById('loan-frequency').value, 10) || 12;

        if (principal <= 0) {
            alert('Please enter a valid loan amount greater than zero.');
            return;
        }

        const totalYears = years + (months / 12);
        const totalPeriods = Math.round(totalYears * frequency);

        if (totalPeriods <= 0) {
            alert('Please enter a valid loan term greater than zero.');
            return;
        }

        let periodicPayment = 0;
        let totalInterest = 0;
        let totalRepayment = 0;

        const periodicRate = (annualRate / 100) / frequency;

        if (periodicRate === 0) {
            periodicPayment = principal / totalPeriods;
            totalRepayment = principal;
            totalInterest = 0;
        } else {
            const growthFactor = Math.pow(1 + periodicRate, totalPeriods);
            periodicPayment = principal * ((periodicRate * growthFactor) / (growthFactor - 1));
            totalRepayment = periodicPayment * totalPeriods;
            totalInterest = totalRepayment - principal;
        }

        const interestRatio = principal > 0 ? ((totalInterest / principal) * 100).toFixed(1) : 0;
        const principalPct = totalRepayment > 0 ? ((principal / totalRepayment) * 100).toFixed(1) : 100;
        const interestPct = totalRepayment > 0 ? ((totalInterest / totalRepayment) * 100).toFixed(1) : 0;

        // Update DOM elements
        monthlyPaymentEl.textContent = formatCurrency(periodicPayment);
        totalPrincipalEl.textContent = `$${formatCurrency(principal)}`;
        totalInterestEl.textContent = `$${formatCurrency(totalInterest)}`;
        totalPaymentsEl.textContent = `$${formatCurrency(totalRepayment)}`;
        ratioValEl.textContent = `${interestRatio}%`;
        payoffDateBadge.textContent = `${totalPeriods} Payments Scheduled`;

        labelPrincipal.textContent = `$${formatCurrency(principal)}`;
        labelInterest.textContent = `$${formatCurrency(totalInterest)}`;

        if (barPrincipal && barInterest) {
            barPrincipal.style.width = `${principalPct}%`;
            barInterest.style.width = `${interestPct}%`;
        }

        resultPanel.style.display = 'block';
        resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (loanForm) {
        loanForm.addEventListener('submit', calculateLoan);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.getElementById('loan-amount').value = '';
            document.getElementById('loan-rate').value = '';
            document.getElementById('loan-term-years').value = '';
            document.getElementById('loan-term-months').value = '';
            resultPanel.style.display = 'none';
        });
    }

    // Auto-calculate initial state for user convenience
    calculateLoan(null);
});
