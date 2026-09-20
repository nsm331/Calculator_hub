/**
 * Auto Loan Calculator Logic
 * Calculates monthly car payments, total interest, sales tax, fees,
 * trade-in net equity, and lifetime purchase outlay.
 */
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('auto-loan-form');
    if (!form) return;

    // Form inputs
    const priceInput = document.getElementById('auto-price');
    const termSelect = document.getElementById('auto-term');
    const rateInput = document.getElementById('auto-rate');
    const downInput = document.getElementById('auto-down');
    const tradeinInput = document.getElementById('auto-tradein');
    const tradeinOwedInput = document.getElementById('auto-tradein-owed');
    const taxRateInput = document.getElementById('auto-tax-rate');
    const feesInput = document.getElementById('auto-fees');
    const clearBtn = document.getElementById('btn-clear-auto');

    // Result elements
    const resultPanel = document.getElementById('auto-result-panel');
    const monthlyDisplay = document.getElementById('auto-monthly-payment');
    const statusBadge = document.getElementById('auto-status-badge');
    const netLoanDisplay = document.getElementById('auto-net-loan');
    const totalInterestDisplay = document.getElementById('auto-total-interest');
    const salesTaxDisplay = document.getElementById('auto-sales-tax');
    const netTradeinDisplay = document.getElementById('auto-net-tradein');
    const totalPaymentsDisplay = document.getElementById('auto-total-loan-payments');
    const totalAllCostDisplay = document.getElementById('auto-total-all-cost');

    // Visual bar elements
    const barPLabel = document.getElementById('bar-auto-p-label');
    const barILabel = document.getElementById('bar-auto-i-label');
    const barTaxLabel = document.getElementById('bar-auto-tax-label');
    const barP = document.getElementById('bar-auto-principal');
    const barI = document.getElementById('bar-auto-interest');
    const barTax = document.getElementById('bar-auto-tax');

    // Number formatters
    const currencyFmt = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const numFmt = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    function calculateAutoLoan() {
        const vehiclePrice = parseFloat(priceInput.value) || 0;
        const termMonths = parseInt(termSelect.value, 10) || 60;
        const annualRate = parseFloat(rateInput.value) || 0;
        const downPayment = parseFloat(downInput.value) || 0;
        const tradeinVal = parseFloat(tradeinInput.value) || 0;
        const tradeinOwed = parseFloat(tradeinOwedInput.value) || 0;
        const salesTaxRate = parseFloat(taxRateInput.value) || 0;
        const fees = parseFloat(feesInput.value) || 0;

        if (vehiclePrice <= 0) {
            resultPanel.style.display = 'none';
            return;
        }

        // Net Trade-in allowance
        const netTradein = tradeinVal - tradeinOwed;

        // Sales tax calculation (trade-in reduces taxable base in most states if positive)
        const taxableBase = Math.max(0, vehiclePrice - Math.max(0, netTradein));
        const salesTax = taxableBase * (salesTaxRate / 100);

        // Net Amount Financed
        const netLoan = Math.max(0, (vehiclePrice + salesTax + fees) - downPayment - netTradein);

        // Monthly Payment calculation
        const monthlyRate = annualRate > 0 ? (annualRate / 100) / 12 : 0;
        let monthlyPayment = 0;

        if (netLoan > 0) {
            if (monthlyRate > 0) {
                const comp = Math.pow(1 + monthlyRate, termMonths);
                monthlyPayment = netLoan * (monthlyRate * comp) / (comp - 1);
            } else {
                monthlyPayment = netLoan / termMonths;
            }
        }

        const totalLoanPayments = monthlyPayment * termMonths;
        const totalInterest = Math.max(0, totalLoanPayments - netLoan);
        const totalAllInCost = totalLoanPayments + downPayment + Math.max(0, netTradein);

        // Update displays
        monthlyDisplay.textContent = numFmt.format(monthlyPayment);
        netLoanDisplay.textContent = currencyFmt.format(netLoan);
        totalInterestDisplay.textContent = currencyFmt.format(totalInterest);
        salesTaxDisplay.textContent = currencyFmt.format(salesTax);
        netTradeinDisplay.textContent = currencyFmt.format(netTradein);
        totalPaymentsDisplay.textContent = currencyFmt.format(totalLoanPayments);
        totalAllCostDisplay.textContent = currencyFmt.format(totalAllInCost);

        if (statusBadge) {
            statusBadge.textContent = `${termMonths} Months @ ${annualRate.toFixed(2)}% APR`;
        }

        // Visual ratio bar
        const totalChartSum = netLoan + totalInterest + salesTax;
        if (totalChartSum > 0) {
            const pPct = (netLoan / totalChartSum) * 100;
            const iPct = (totalInterest / totalChartSum) * 100;
            const taxPct = (salesTax / totalChartSum) * 100;

            barP.style.width = pPct.toFixed(1) + '%';
            barI.style.width = iPct.toFixed(1) + '%';
            barTax.style.width = taxPct.toFixed(1) + '%';

            barPLabel.textContent = currencyFmt.format(netLoan);
            barILabel.textContent = currencyFmt.format(totalInterest);
            barTaxLabel.textContent = currencyFmt.format(salesTax);
        }

        resultPanel.style.display = 'block';
    }

    // Input listeners
    const inputs = [priceInput, termSelect, rateInput, downInput, tradeinInput, tradeinOwedInput, taxRateInput, feesInput];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', calculateAutoLoan);
            input.addEventListener('change', calculateAutoLoan);
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateAutoLoan();
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            priceInput.value = 32000;
            termSelect.value = '60';
            rateInput.value = '5.5';
            downInput.value = 4000;
            tradeinInput.value = 6000;
            tradeinOwedInput.value = 2000;
            taxRateInput.value = 8.0;
            feesInput.value = 500;
            calculateAutoLoan();
        });
    }

    // Initial calculation on page load
    calculateAutoLoan();
});
