/**
 * CalculatorHub - APR vs APY Calculator Engine
 * Nominal vs effective compounding, bidirectional conversion, and multi-frequency scheduling.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mode Buttons
    const modeBtns = document.querySelectorAll('.apr-mode-btn');
    const inputRateLabel = document.getElementById('apr-rate-label');
    const inputRateVal = document.getElementById('apr-rate-val');
    const freqGroup = document.getElementById('apr-freq-group');
    const freqSelect = document.getElementById('apr-freq');
    const principalGroup = document.getElementById('apr-principal-group');
    const principalVal = document.getElementById('apr-principal-val');
    const yearsGroup = document.getElementById('apr-years-group');
    const yearsVal = document.getElementById('apr-years-val');
    const calcBtn = document.getElementById('apr-calc-btn');

    // Outputs
    const resTitle = document.getElementById('apr-res-title');
    const formulaBadge = document.getElementById('apr-formula-badge');
    const primaryResult = document.getElementById('apr-primary-result');
    const secondaryResult = document.getElementById('apr-secondary-result');
    const diffBadge = document.getElementById('apr-diff-badge');

    // Investment Cards
    const investCard = document.getElementById('apr-invest-card');
    const simpleBalanceVal = document.getElementById('apr-simple-balance');
    const compoundBalanceVal = document.getElementById('apr-compound-balance');
    const compoundAdvantageVal = document.getElementById('apr-compound-advantage');

    // Table
    const matrixTbody = document.getElementById('apr-matrix-tbody');

    const FREQUENCIES = [
        { key: '1', name: 'Annually (1x/yr)', m: 1 },
        { key: '2', name: 'Semiannually (2x/yr)', m: 2 },
        { key: '4', name: 'Quarterly (4x/yr)', m: 4 },
        { key: '12', name: 'Monthly (12x/yr)', m: 12 },
        { key: '26', name: 'Bi-Weekly (26x/yr)', m: 26 },
        { key: '52', name: 'Weekly (52x/yr)', m: 52 },
        { key: '365', name: 'Daily (365x/yr)', m: 365 },
        { key: 'continuous', name: 'Continuously (e^r)', m: Infinity }
    ];

    let currentMode = 'apr_to_apy'; // 'apr_to_apy', 'apy_to_apr', 'compare'

    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentMode = this.dataset.mode;
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            if (currentMode === 'apr_to_apy') {
                inputRateLabel.textContent = 'Nominal APR (%)';
                resTitle.textContent = 'Effective Annual Percentage Yield (APY)';
                formulaBadge.textContent = 'APY = (1 + r/m)^m - 1';
                principalGroup.style.display = 'block';
                yearsGroup.style.display = 'block';
            } else if (currentMode === 'apy_to_apr') {
                inputRateLabel.textContent = 'Effective APY (%)';
                resTitle.textContent = 'Equivalent Nominal APR';
                formulaBadge.textContent = 'APR = m · [(1+APY)^(1/m) - 1]';
                principalGroup.style.display = 'block';
                yearsGroup.style.display = 'block';
            } else {
                inputRateLabel.textContent = 'Nominal Interest Rate (%)';
                resTitle.textContent = 'Effective Yield & Investment Growth';
                formulaBadge.textContent = 'Multi-Horizon Analysis';
                principalGroup.style.display = 'block';
                yearsGroup.style.display = 'block';
            }

            calculateAprApy();
        });
    });

    [inputRateVal, freqSelect, principalVal, yearsVal].forEach(el => {
        if (el) {
            el.addEventListener('input', calculateAprApy);
            el.addEventListener('change', calculateAprApy);
        }
    });

    if (calcBtn) {
        calcBtn.addEventListener('click', calculateAprApy);
    }

    function calculateAprApy() {
        const rate = parseFloat(inputRateVal.value);
        const freqKey = freqSelect.value;
        const principal = parseFloat(principalVal.value) || 10000;
        const years = parseFloat(yearsVal.value) || 5;

        if (isNaN(rate) || rate < 0) {
            showError('Please enter a valid positive interest rate.');
            return;
        }

        let computedApy = 0;
        let computedApr = 0;
        let m = freqKey === 'continuous' ? Infinity : parseFloat(freqKey);

        if (currentMode === 'apr_to_apy' || currentMode === 'compare') {
            const aprDecimal = rate / 100;
            if (m === Infinity) {
                computedApy = (Math.exp(aprDecimal) - 1) * 100;
            } else {
                computedApy = (Math.pow(1 + aprDecimal / m, m) - 1) * 100;
            }
            computedApr = rate;

            primaryResult.textContent = `${computedApy.toFixed(4)}% APY`;
            const spreadBps = Math.round((computedApy - rate) * 100);
            secondaryResult.innerHTML = `Compounding adds <strong>+${(computedApy - rate).toFixed(4)}%</strong> (+${spreadBps} basis points) over nominal ${rate}% APR.`;

            if (diffBadge) {
                diffBadge.textContent = `+${(computedApy - rate).toFixed(3)}% Compounding Boost`;
                diffBadge.style.display = 'inline-block';
            }
        } else {
            // APY to APR
            const apyDecimal = rate / 100;
            if (m === Infinity) {
                computedApr = Math.log(1 + apyDecimal) * 100;
            } else {
                computedApr = (m * (Math.pow(1 + apyDecimal, 1 / m) - 1)) * 100;
            }
            computedApy = rate;

            primaryResult.textContent = `${computedApr.toFixed(4)}% APR`;
            const spreadBps = Math.round((rate - computedApr) * 100);
            secondaryResult.innerHTML = `A nominal APR of <strong>${computedApr.toFixed(4)}%</strong> is required to achieve your target ${rate}% APY.`;

            if (diffBadge) {
                diffBadge.textContent = `Nominal Discount: -${(rate - computedApr).toFixed(3)}%`;
                diffBadge.style.display = 'inline-block';
            }
        }

        // Update Investment Simulation Card
        const nominalRate = currentMode === 'apy_to_apr' ? computedApr : rate;
        const effectiveRate = currentMode === 'apy_to_apr' ? rate : computedApy;

        const simpleFuture = principal * (1 + (nominalRate / 100) * years);
        let compoundFuture = 0;

        if (m === Infinity) {
            compoundFuture = principal * Math.exp((nominalRate / 100) * years);
        } else {
            compoundFuture = principal * Math.pow(1 + (nominalRate / 100) / m, m * years);
        }

        const compoundingAdvantage = Math.max(0, compoundFuture - simpleFuture);

        if (simpleBalanceVal) simpleBalanceVal.textContent = formatCurrency(simpleFuture);
        if (compoundBalanceVal) compoundBalanceVal.textContent = formatCurrency(compoundFuture);
        if (compoundAdvantageVal) {
            compoundAdvantageVal.textContent = `+${formatCurrency(compoundingAdvantage)}`;
        }

        // Populate Comprehensive Matrix Table
        renderMatrixTable(nominalRate, freqKey);
    }

    function renderMatrixTable(nominalApr, selectedFreqKey) {
        if (!matrixTbody) return;

        const r = nominalApr / 100;
        let html = '';

        FREQUENCIES.forEach(f => {
            let apy = 0;
            let growth10k = 0;
            if (f.m === Infinity) {
                apy = (Math.exp(r) - 1) * 100;
                growth10k = 10000 * Math.exp(r);
            } else {
                apy = (Math.pow(1 + r / f.m, f.m) - 1) * 100;
                growth10k = 10000 * Math.pow(1 + r / f.m, f.m);
            }

            const isSelected = f.key === selectedFreqKey;
            const rowStyle = isSelected ? 'style="background: rgba(59, 130, 246, 0.08); font-weight: 700;"' : '';
            const tag = isSelected ? ' <span style="background: var(--color-accent-blue); color:#fff; font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">Active</span>' : '';

            html += `
                <tr ${rowStyle} style="border-bottom: 1px solid var(--color-border-light);">
                    <td style="padding: 10px 12px; white-space: nowrap;">${f.name}${tag}</td>
                    <td style="padding: 10px 12px; font-weight: 700; color: var(--color-accent-blue); white-space: nowrap;">${apy.toFixed(4)}%</td>
                    <td style="padding: 10px 12px; color: var(--color-text-muted); font-size: 0.85rem; white-space: nowrap;">+${(apy - nominalApr).toFixed(4)}%</td>
                    <td style="padding: 10px 12px; font-weight: 600; color: var(--color-text-main); white-space: nowrap;">${formatCurrency(growth10k)}</td>
                </tr>
            `;
        });

        matrixTbody.innerHTML = html;
    }

    function showError(msg) {
        primaryResult.textContent = 'Invalid Input';
        secondaryResult.textContent = msg || 'Please verify interest rate values.';
        if (diffBadge) diffBadge.style.display = 'none';
    }

    function formatCurrency(val) {
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Initial Execution
    calculateAprApy();
});
