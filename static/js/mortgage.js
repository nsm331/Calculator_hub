/**
 * Mortgage Calculator Logic
 * Calculates monthly PITI (Principal, Interest, Taxes, Insurance) + HOA,
 * total loan cost, total interest, and visual payment composition.
 */
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('mortgage-form');
    if (!form) return;

    // Inputs
    const homePriceInput = document.getElementById('mortgage-home-price');
    const downPaymentInput = document.getElementById('mortgage-down-payment');
    const downPercentInput = document.getElementById('mortgage-down-percent');
    const termSelect = document.getElementById('mortgage-term');
    const rateInput = document.getElementById('mortgage-rate');
    const taxInput = document.getElementById('mortgage-tax');
    const insInput = document.getElementById('mortgage-insurance');
    const hoaInput = document.getElementById('mortgage-hoa');
    const clearBtn = document.getElementById('btn-clear-mortgage');

    // Result elements
    const resultPanel = document.getElementById('mortgage-result-panel');
    const totalMonthlyDisplay = document.getElementById('mortgage-total-monthly');
    const piVal = document.getElementById('mortgage-pi-val');
    const taxVal = document.getElementById('mortgage-tax-val');
    const insVal = document.getElementById('mortgage-ins-val');
    const loanAmountVal = document.getElementById('mortgage-loan-amount');
    const totalInterestVal = document.getElementById('mortgage-total-interest');
    const totalCostVal = document.getElementById('mortgage-total-cost');
    const statusBadge = document.getElementById('mortgage-status-badge');

    // Visual Ratio Bar elements
    const barPiLabel = document.getElementById('bar-pi-label');
    const barTaxLabel = document.getElementById('bar-tax-label');
    const barInsLabel = document.getElementById('bar-ins-label');
    const barPi = document.getElementById('bar-pi');
    const barTax = document.getElementById('bar-tax');
    const barIns = document.getElementById('bar-ins');

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

    // Synchronize down payment $ and %
    let isSyncing = false;

    function syncFromPercent() {
        if (isSyncing) return;
        isSyncing = true;
        const price = parseFloat(homePriceInput.value) || 0;
        const pct = parseFloat(downPercentInput.value) || 0;
        const downDollar = (price * pct) / 100;
        downPaymentInput.value = Math.round(downDollar);
        isSyncing = false;
    }

    function syncFromDollar() {
        if (isSyncing) return;
        isSyncing = true;
        const price = parseFloat(homePriceInput.value) || 0;
        const dollar = parseFloat(downPaymentInput.value) || 0;
        if (price > 0) {
            const pct = (dollar / price) * 100;
            downPercentInput.value = (Math.round(pct * 10) / 10).toFixed(1);
        }
        isSyncing = false;
    }

    downPercentInput.addEventListener('input', function () {
        syncFromPercent();
        calculateMortgage();
    });

    downPaymentInput.addEventListener('input', function () {
        syncFromDollar();
        calculateMortgage();
    });

    homePriceInput.addEventListener('input', function () {
        syncFromPercent();
        calculateMortgage();
    });

    [termSelect, rateInput, taxInput, insInput, hoaInput].forEach(elem => {
        if (elem) {
            elem.addEventListener('input', calculateMortgage);
            elem.addEventListener('change', calculateMortgage);
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateMortgage();
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            homePriceInput.value = 400000;
            downPercentInput.value = 20;
            downPaymentInput.value = 80000;
            termSelect.value = '30';
            rateInput.value = '6.5';
            taxInput.value = 4800;
            insInput.value = 1200;
            hoaInput.value = 0;
            calculateMortgage();
        });
    }

    function calculateMortgage() {
        const homePrice = parseFloat(homePriceInput.value) || 0;
        let downPayment = parseFloat(downPaymentInput.value) || 0;
        const termYears = parseFloat(termSelect.value) || 30;
        const annualRate = parseFloat(rateInput.value) || 0;
        const annualTax = parseFloat(taxInput.value) || 0;
        const annualIns = parseFloat(insInput.value) || 0;
        const monthlyHoa = parseFloat(hoaInput.value) || 0;

        if (homePrice <= 0) {
            resultPanel.style.display = 'none';
            return;
        }

        // Down payment cannot exceed home price
        if (downPayment > homePrice) {
            downPayment = homePrice;
            downPaymentInput.value = downPayment;
            downPercentInput.value = 100;
        }

        const loanPrincipal = Math.max(0, homePrice - downPayment);
        const monthlyRate = annualRate > 0 ? (annualRate / 100) / 12 : 0;
        const totalPayments = termYears * 12;

        // Principal & Interest (P&I)
        let monthlyPI = 0;
        if (loanPrincipal > 0) {
            if (monthlyRate > 0) {
                const comp = Math.pow(1 + monthlyRate, totalPayments);
                monthlyPI = loanPrincipal * (monthlyRate * comp) / (comp - 1);
            } else {
                monthlyPI = loanPrincipal / totalPayments;
            }
        }

        // Monthly Tax, Insurance, Total
        const monthlyTax = annualTax / 12;
        const monthlyIns = annualIns / 12;
        const totalMonthly = monthlyPI + monthlyTax + monthlyIns + monthlyHoa;

        // Lifetime totals
        const totalPaidPI = monthlyPI * totalPayments;
        const totalInterest = Math.max(0, totalPaidPI - loanPrincipal);

        // Update displays
        totalMonthlyDisplay.textContent = numFmt.format(totalMonthly);
        piVal.textContent = currencyFmt.format(monthlyPI);
        taxVal.textContent = currencyFmt.format(monthlyTax);
        insVal.textContent = currencyFmt.format(monthlyIns);
        loanAmountVal.textContent = currencyFmt.format(loanPrincipal);
        totalInterestVal.textContent = currencyFmt.format(totalInterest);
        totalCostVal.textContent = currencyFmt.format(totalPaidPI);

        // Update visual ratio bar
        if (totalMonthly > 0) {
            const piPct = (monthlyPI / totalMonthly) * 100;
            const taxPct = (monthlyTax / totalMonthly) * 100;
            const insPct = (monthlyIns / totalMonthly) * 100;

            barPi.style.width = piPct.toFixed(1) + '%';
            barTax.style.width = taxPct.toFixed(1) + '%';
            barIns.style.width = insPct.toFixed(1) + '%';

            barPiLabel.textContent = currencyFmt.format(monthlyPI);
            barTaxLabel.textContent = currencyFmt.format(monthlyTax);
            barInsLabel.textContent = currencyFmt.format(monthlyIns);
        }

        if (statusBadge) {
            const downPct = (downPayment / homePrice) * 100;
            if (downPct < 20 && loanPrincipal > 0) {
                statusBadge.textContent = 'Down < 20% (PMI May Apply)';
                statusBadge.className = 'result-status-badge badge-finance-status text-amber';
            } else {
                statusBadge.textContent = 'PITI + HOA Included';
                statusBadge.className = 'result-status-badge badge-finance-status';
            }
        }

        resultPanel.style.display = 'block';
    }

    // Initial calculation on page load
    calculateMortgage();
});
