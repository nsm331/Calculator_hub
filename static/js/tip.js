/**
 * Tip & Split Bill Gratuity Engine
 * CalculatorHub - Client-Side Vanilla JS
 */

document.addEventListener('DOMContentLoaded', function () {
    // State
    let selectedTipPct = 18;
    let isCustomTip = false;

    // Form controls
    const billInput = document.getElementById('tip-bill');
    const partyInput = document.getElementById('tip-party');
    const currencySelect = document.getElementById('tip-currency');
    const currencyPrefix = document.getElementById('tip-currency-symbol');
    const taxRateInput = document.getElementById('tip-tax-rate');
    const roundingSelect = document.getElementById('tip-rounding');
    const basisRadios = document.querySelectorAll('input[name="tip_basis"]');

    // Tip percentage buttons & custom input
    const tipPercentButtons = document.querySelectorAll('.tip-percent-btn');
    const tipCustomWrapper = document.getElementById('tip-custom-wrapper');
    const tipCustomInput = document.getElementById('tip-custom-input');

    // Preset scenario buttons
    const scenarioButtons = document.querySelectorAll('.tip-scenario-btn');
    const calculateBtn = document.getElementById('tip-calculate-btn');
    const resetBtn = document.getElementById('tip-reset-btn');

    // Outputs
    const resTotalTip = document.getElementById('res-total-tip');
    const resEffectiveTipPct = document.getElementById('res-effective-tip-pct');
    const resGrandTotal = document.getElementById('res-grand-total');
    const resTipPerPerson = document.getElementById('res-tip-per-person');
    const resPartyLabelTip = document.getElementById('res-party-label-tip');
    const resTotalPerPerson = document.getElementById('res-total-per-person');
    const resPartyLabelTotal = document.getElementById('res-party-label-total');
    const resRoundingTag = document.getElementById('res-rounding-tag');
    const thPerPerson = document.getElementById('th-per-person');
    const breakdownBody = document.getElementById('tip-breakdown-body');

    // Currency update
    currencySelect.addEventListener('change', function () {
        currencyPrefix.textContent = this.value;
        calculateTip();
    });

    // Tip percentage buttons
    tipPercentButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            tipPercentButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const pctVal = this.dataset.pct;
            if (pctVal === 'custom') {
                isCustomTip = true;
                tipCustomWrapper.style.display = 'block';
                selectedTipPct = parseFloat(tipCustomInput.value) || 18;
            } else {
                isCustomTip = false;
                tipCustomWrapper.style.display = 'none';
                selectedTipPct = parseFloat(pctVal) || 18;
            }
            calculateTip();
        });
    });

    tipCustomInput.addEventListener('input', function () {
        if (isCustomTip) {
            selectedTipPct = parseFloat(this.value) || 0;
            calculateTip();
        }
    });

    // Preset Scenarios
    scenarioButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            scenarioButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            billInput.value = this.dataset.bill;
            partyInput.value = this.dataset.split;
            taxRateInput.value = this.dataset.tax;

            const targetPct = this.dataset.tip;
            isCustomTip = false;
            tipCustomWrapper.style.display = 'none';

            tipPercentButtons.forEach(b => {
                b.classList.toggle('active', b.dataset.pct === targetPct);
            });
            selectedTipPct = parseFloat(targetPct);

            calculateTip();
        });
    });

    function getSelectedBasis() {
        for (const r of basisRadios) {
            if (r.checked) return r.value;
        }
        return 'pretax';
    }

    function formatMoney(amount, cur) {
        return `${cur}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    function calculateTip() {
        const bill = parseFloat(billInput.value) || 0;
        const party = Math.max(1, parseInt(partyInput.value, 10) || 1);
        const cur = currencySelect.value;
        const taxRate = parseFloat(taxRateInput.value) || 0;
        const basis = getSelectedBasis();
        const roundingMode = roundingSelect.value;

        if (bill <= 0) return;

        const tipPct = selectedTipPct;
        const taxAmount = bill * (taxRate / 100);

        let rawTipAmount = 0;
        if (basis === 'pretax') {
            rawTipAmount = bill * (tipPct / 100);
        } else {
            // post-tax total basis
            rawTipAmount = (bill + taxAmount) * (tipPct / 100);
        }

        let initialTotal = bill + taxAmount + rawTipAmount;
        let finalTotal = initialTotal;
        let finalTipAmount = rawTipAmount;
        let roundingAdjustment = 0;
        let roundingText = 'Exact Cents';

        if (roundingMode === 'round-total') {
            finalTotal = Math.round(initialTotal);
            roundingAdjustment = finalTotal - initialTotal;
            finalTipAmount = Math.max(0, rawTipAmount + roundingAdjustment);
            roundingText = 'Rounded Grand Total ($)';
        } else if (roundingMode === 'ceil-total') {
            finalTotal = Math.ceil(initialTotal);
            roundingAdjustment = finalTotal - initialTotal;
            finalTipAmount = Math.max(0, rawTipAmount + roundingAdjustment);
            roundingText = 'Rounded Up Grand Total ($)';
        } else if (roundingMode === 'round-per-person') {
            const rawPerPerson = initialTotal / party;
            const ceilPerPerson = Math.ceil(rawPerPerson);
            finalTotal = ceilPerPerson * party;
            roundingAdjustment = finalTotal - initialTotal;
            finalTipAmount = Math.max(0, rawTipAmount + roundingAdjustment);
            roundingText = 'Per-Person Rounded Up ($)';
        }

        const effectiveTipPct = bill > 0 ? (finalTipAmount / bill) * 100 : 0;
        const tipPerPerson = finalTipAmount / party;
        const totalPerPerson = finalTotal / party;
        const taxPerPerson = taxAmount / party;
        const subtotalPerPerson = bill / party;

        // Render KPI cards
        resTotalTip.textContent = formatMoney(finalTipAmount, cur);
        resEffectiveTipPct.textContent = `${effectiveTipPct.toFixed(1)}% of subtotal (${tipPct}% setting)`;

        resGrandTotal.textContent = formatMoney(finalTotal, cur);
        resTipPerPerson.textContent = formatMoney(tipPerPerson, cur);
        resPartyLabelTip.textContent = `Split across ${party} ${party === 1 ? 'guest' : 'guests'}`;

        resTotalPerPerson.textContent = formatMoney(totalPerPerson, cur);
        resPartyLabelTotal.textContent = `${party === 1 ? 'Total amount due' : 'Each person pays'}`;

        resRoundingTag.textContent = roundingText;
        thPerPerson.textContent = `Per Guest (1 of ${party})`;

        // Build itemized breakdown table
        const lineItems = [
            {
                name: 'Food & Beverage Subtotal',
                total: bill,
                perGuest: subtotalPerPerson,
                notes: 'Base restaurant order charges'
            },
            {
                name: `Sales Tax (${taxRate.toFixed(2)}%)`,
                total: taxAmount,
                perGuest: taxPerPerson,
                notes: basis === 'pretax' ? 'Excluded from tip calculation' : 'Included in tip basis'
            },
            {
                name: `Gratuity / Tip (${tipPct}%)`,
                total: finalTipAmount,
                perGuest: tipPerPerson,
                notes: `Calculated on ${basis === 'pretax' ? 'pre-tax subtotal' : 'post-tax total'}`
            }
        ];

        if (Math.abs(roundingAdjustment) > 0.001) {
            lineItems.push({
                name: 'Rounding Adjustment',
                total: roundingAdjustment,
                perGuest: roundingAdjustment / party,
                notes: `${roundingAdjustment >= 0 ? '+' : ''}${formatMoney(roundingAdjustment, cur)} to meet clean payment`
            });
        }

        breakdownBody.innerHTML = '';
        lineItems.forEach(item => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--color-border-subtle)';
            tr.innerHTML = `
                <td style="padding: 10px 12px; font-weight: 600;">${item.name}</td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 600; color: var(--color-text);">${formatMoney(item.total, cur)}</td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 600; color: var(--color-primary);">${formatMoney(item.perGuest, cur)}</td>
                <td style="padding: 10px 12px; font-size: 0.82rem; color: var(--color-text-muted);">${item.notes}</td>
            `;
            breakdownBody.appendChild(tr);
        });

        // Final total row
        const totalTr = document.createElement('tr');
        totalTr.style.background = 'rgba(16, 185, 129, 0.08)';
        totalTr.style.borderTop = '2px solid #10b981';
        totalTr.innerHTML = `
            <td style="padding: 12px; font-weight: 800; color: #10b981; font-size: 1rem;">FINAL GRAND TOTAL</td>
            <td class="td-right" style="padding: 12px; font-weight: 800; color: #10b981; font-size: 1.1rem;">${formatMoney(finalTotal, cur)}</td>
            <td class="td-right" style="padding: 12px; font-weight: 800; color: #10b981; font-size: 1.1rem;">${formatMoney(totalPerPerson, cur)}</td>
            <td style="padding: 12px; font-size: 0.82rem; color: #10b981; font-weight: 600;">Total payable across ${party} ${party === 1 ? 'person' : 'people'}</td>
        `;
        breakdownBody.appendChild(totalTr);
    }

    // Input listeners
    [billInput, partyInput, taxRateInput].forEach(inp => {
        inp.addEventListener('input', calculateTip);
    });

    roundingSelect.addEventListener('change', calculateTip);

    basisRadios.forEach(r => {
        r.addEventListener('change', calculateTip);
    });

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateTip);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            billInput.value = '75.00';
            partyInput.value = '2';
            taxRateInput.value = '8.25';
            currencySelect.value = '$';
            currencyPrefix.textContent = '$';
            roundingSelect.value = 'none';
            basisRadios[0].checked = true;

            tipPercentButtons.forEach(b => {
                b.classList.toggle('active', b.dataset.pct === '18');
            });
            selectedTipPct = 18;
            isCustomTip = false;
            tipCustomWrapper.style.display = 'none';

            scenarioButtons.forEach(b => {
                b.classList.toggle('active', b.dataset.bill === '75.00');
            });

            calculateTip();
        });
    }

    // Initial calculation
    calculateTip();
});
