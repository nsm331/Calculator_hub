/**
 * Federal & State Progressive Income Tax Engine
 * CalculatorHub - Client-Side Vanilla JS
 */

document.addEventListener('DOMContentLoaded', function () {
    // State
    let filingStatus = 'single'; // 'single', 'mfj', 'mfs', 'hoh'

    // Form inputs
    const grossIncomeInput = document.getElementById('tax-gross-income');
    const taxYearSelect = document.getElementById('tax-year');
    const stateRateInput = document.getElementById('tax-state-rate');
    const k401Input = document.getElementById('tax-401k');
    const hsaInput = document.getElementById('tax-hsa');
    const deductionRadios = document.querySelectorAll('input[name="tax_deduction_type"]');
    const itemizedWrapper = document.getElementById('wrapper-itemized');
    const itemizedInput = document.getElementById('tax-itemized-amount');
    const labelStandardDeduction = document.getElementById('label-standard-deduction');

    // Controls
    const statusButtons = document.querySelectorAll('.tax-status-btn');
    const presetButtons = document.querySelectorAll('.tax-preset-btn');
    const calculateBtn = document.getElementById('tax-calculate-btn');
    const resetBtn = document.getElementById('tax-reset-btn');

    // Results elements
    const resTakeHomeAnnual = document.getElementById('res-take-home-annual');
    const resTakeHomeMonthly = document.getElementById('res-take-home-monthly');
    const resFederalTax = document.getElementById('res-federal-tax');
    const resEffectiveRate = document.getElementById('res-effective-rate');
    const resFicaTotal = document.getElementById('res-fica-total');
    const resFicaBreakdown = document.getElementById('res-fica-breakdown');
    const resStateTax = document.getElementById('res-state-tax');
    const resStateRateDesc = document.getElementById('res-state-rate-desc');
    const resTotalTaxBurden = document.getElementById('res-total-tax-burden');

    // Bar segments
    const barTakehome = document.getElementById('bar-takehome-segment');
    const barFed = document.getElementById('bar-fed-segment');
    const barFica = document.getElementById('bar-fica-segment');
    const barState = document.getElementById('bar-state-segment');
    const barPretax = document.getElementById('bar-pretax-segment');

    // Tables
    const taxBracketsBody = document.getElementById('tax-brackets-body');
    const taxFrequencyBody = document.getElementById('tax-frequency-body');
    const taxBracketSubtext = document.getElementById('tax-bracket-subtext');

    // Formatting utilities
    const curFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    const curExactFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // 2024 & 2025 IRS Bracket Data
    const taxData = {
        '2024': {
            standardDeduction: { single: 14600, mfj: 29200, mfs: 14600, hoh: 21900 },
            ssWageCap: 168600,
            brackets: {
                single: [
                    { rate: 0.10, min: 0, max: 11600 },
                    { rate: 0.12, min: 11600, max: 47150 },
                    { rate: 0.22, min: 47150, max: 100525 },
                    { rate: 0.24, min: 100525, max: 191950 },
                    { rate: 0.32, min: 191950, max: 243725 },
                    { rate: 0.35, min: 243725, max: 609350 },
                    { rate: 0.37, min: 609350, max: Infinity }
                ],
                mfj: [
                    { rate: 0.10, min: 0, max: 23200 },
                    { rate: 0.12, min: 23200, max: 94300 },
                    { rate: 0.22, min: 94300, max: 201050 },
                    { rate: 0.24, min: 201050, max: 383900 },
                    { rate: 0.32, min: 383900, max: 487450 },
                    { rate: 0.35, min: 487450, max: 731200 },
                    { rate: 0.37, min: 731200, max: Infinity }
                ],
                mfs: [
                    { rate: 0.10, min: 0, max: 11600 },
                    { rate: 0.12, min: 11600, max: 47150 },
                    { rate: 0.22, min: 47150, max: 100525 },
                    { rate: 0.24, min: 100525, max: 191950 },
                    { rate: 0.32, min: 191950, max: 243725 },
                    { rate: 0.35, min: 243725, max: 365600 },
                    { rate: 0.37, min: 365600, max: Infinity }
                ],
                hoh: [
                    { rate: 0.10, min: 0, max: 16550 },
                    { rate: 0.12, min: 16550, max: 63100 },
                    { rate: 0.22, min: 63100, max: 100500 },
                    { rate: 0.24, min: 100500, max: 191950 },
                    { rate: 0.32, min: 191950, max: 243700 },
                    { rate: 0.35, min: 243700, max: 609350 },
                    { rate: 0.37, min: 609350, max: Infinity }
                ]
            }
        },
        '2025': {
            standardDeduction: { single: 15000, mfj: 30000, mfs: 15000, hoh: 22500 },
            ssWageCap: 176100,
            brackets: {
                single: [
                    { rate: 0.10, min: 0, max: 11925 },
                    { rate: 0.12, min: 11925, max: 48475 },
                    { rate: 0.22, min: 48475, max: 103350 },
                    { rate: 0.24, min: 103350, max: 197300 },
                    { rate: 0.32, min: 197300, max: 250525 },
                    { rate: 0.35, min: 250525, max: 626350 },
                    { rate: 0.37, min: 626350, max: Infinity }
                ],
                mfj: [
                    { rate: 0.10, min: 0, max: 23850 },
                    { rate: 0.12, min: 23850, max: 96950 },
                    { rate: 0.22, min: 96950, max: 206700 },
                    { rate: 0.24, min: 206700, max: 394600 },
                    { rate: 0.32, min: 394600, max: 501050 },
                    { rate: 0.35, min: 501050, max: 751600 },
                    { rate: 0.37, min: 751600, max: Infinity }
                ],
                mfs: [
                    { rate: 0.10, min: 0, max: 11925 },
                    { rate: 0.12, min: 11925, max: 48475 },
                    { rate: 0.22, min: 48475, max: 103350 },
                    { rate: 0.24, min: 103350, max: 197300 },
                    { rate: 0.32, min: 197300, max: 250525 },
                    { rate: 0.35, min: 250525, max: 375800 },
                    { rate: 0.37, min: 375800, max: Infinity }
                ],
                hoh: [
                    { rate: 0.10, min: 0, max: 17000 },
                    { rate: 0.12, min: 17000, max: 64850 },
                    { rate: 0.22, min: 64850, max: 103350 },
                    { rate: 0.24, min: 103350, max: 197300 },
                    { rate: 0.32, min: 197300, max: 250500 },
                    { rate: 0.35, min: 250500, max: 626350 },
                    { rate: 0.37, min: 626350, max: Infinity }
                ]
            }
        }
    };

    function updateStandardDeductionLabel() {
        const year = taxYearSelect.value;
        const std = taxData[year].standardDeduction[filingStatus];
        labelStandardDeduction.textContent = `Standard Deduction (${curFmt.format(std)})`;
    }

    // Filing Status Buttons
    statusButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            statusButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filingStatus = this.dataset.status;
            updateStandardDeductionLabel();
            calculateTaxes();
        });
    });

    // Preset Buttons
    presetButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            presetButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            grossIncomeInput.value = this.dataset.income;
            calculateTaxes();
        });
    });

    // Deduction Type Radio
    deductionRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            itemizedWrapper.style.display = (this.value === 'itemized') ? 'block' : 'none';
            calculateTaxes();
        });
    });

    function getDeductionAmount(year) {
        let isItemized = false;
        deductionRadios.forEach(r => {
            if (r.checked && r.value === 'itemized') isItemized = true;
        });

        if (isItemized) {
            return parseFloat(itemizedInput.value) || 0;
        }
        return taxData[year].standardDeduction[filingStatus] || 14600;
    }

    function calculateTaxes() {
        const grossIncome = parseFloat(grossIncomeInput.value) || 0;
        const year = taxYearSelect.value || '2024';
        const stateRate = parseFloat(stateRateInput.value) || 0;
        const preTax401k = parseFloat(k401Input.value) || 0;
        const preTaxHsa = parseFloat(hsaInput.value) || 0;
        const totalPreTax = preTax401k + preTaxHsa;

        const deductionAmount = getDeductionAmount(year);
        const taxableIncome = Math.max(0, grossIncome - totalPreTax - deductionAmount);

        // 1. Federal Income Tax Progressive Brackets
        const brackets = taxData[year].brackets[filingStatus];
        let totalFedTax = 0;
        let marginalRate = 0;
        const bracketRows = [];

        for (let i = 0; i < brackets.length; i++) {
            const b = brackets[i];
            const rate = b.rate;
            const min = b.min;
            const max = b.max;

            let taxableInBracket = 0;
            if (taxableIncome > min) {
                taxableInBracket = Math.min(taxableIncome, max) - min;
                marginalRate = rate;
            }

            const taxInBracket = taxableInBracket * rate;
            totalFedTax += taxInBracket;

            bracketRows.push({
                tier: `${(rate * 100).toFixed(0)}% Bracket`,
                rate: `${(rate * 100).toFixed(0)}%`,
                range: max === Infinity ? `Over ${curFmt.format(min)}` : `${curFmt.format(min)} - ${curFmt.format(max)}`,
                taxable: taxableInBracket,
                tax: taxInBracket,
                isActive: taxableInBracket > 0
            });
        }

        // 2. FICA Payroll Taxes
        // Social Security: 6.2% up to ssWageCap
        const ssCap = taxData[year].ssWageCap;
        const ssTaxable = Math.min(grossIncome, ssCap);
        const ssTax = ssTaxable * 0.062;

        // Medicare: 1.45% baseline + 0.9% additional above threshold
        const medThreshold = (filingStatus === 'mfj') ? 250000 : 200000;
        const medBase = grossIncome * 0.0145;
        const medAdditional = Math.max(0, grossIncome - medThreshold) * 0.009;
        const medTax = medBase + medAdditional;
        const totalFica = ssTax + medTax;

        // 3. State Income Tax Estimate
        const stateTaxable = Math.max(0, grossIncome - totalPreTax);
        const stateTax = stateTaxable * (stateRate / 100);

        // 4. Totals & Net Take-Home
        const totalTaxes = totalFedTax + totalFica + stateTax;
        const netTakeHome = Math.max(0, grossIncome - totalTaxes - totalPreTax);
        const effectiveRate = grossIncome > 0 ? (totalFedTax / grossIncome) * 100 : 0;
        const totalTaxRate = grossIncome > 0 ? (totalTaxes / grossIncome) * 100 : 0;

        // Populate KPIs
        resTakeHomeAnnual.textContent = curFmt.format(netTakeHome);
        resTakeHomeMonthly.textContent = `${curFmt.format(netTakeHome / 12)} / month`;

        resFederalTax.textContent = curFmt.format(totalFedTax);
        resEffectiveRate.textContent = `${effectiveRate.toFixed(2)}% Effective (${(marginalRate * 100).toFixed(0)}% Marginal)`;

        resFicaTotal.textContent = curFmt.format(totalFica);
        resFicaBreakdown.textContent = `SS: ${curFmt.format(ssTax)} • Med: ${curFmt.format(medTax)}`;

        resStateTax.textContent = curFmt.format(stateTax);
        resStateRateDesc.textContent = `Based on ${stateRate.toFixed(1)}% state estimate`;
        resTotalTaxBurden.textContent = `Total Taxes: ${curFmt.format(totalTaxes)} (${totalTaxRate.toFixed(1)}%)`;

        // Update Stacked Bar
        const pctTakeHome = grossIncome > 0 ? (netTakeHome / grossIncome) * 100 : 100;
        const pctFed = grossIncome > 0 ? (totalFedTax / grossIncome) * 100 : 0;
        const pctFica = grossIncome > 0 ? (totalFica / grossIncome) * 100 : 0;
        const pctState = grossIncome > 0 ? (stateTax / grossIncome) * 100 : 0;
        const pctPre = grossIncome > 0 ? (totalPreTax / grossIncome) * 100 : 0;

        barTakehome.style.width = `${pctTakeHome.toFixed(1)}%`;
        barTakehome.textContent = pctTakeHome > 12 ? `Take-Home (${pctTakeHome.toFixed(1)}%)` : '';

        barFed.style.width = `${pctFed.toFixed(1)}%`;
        barFed.textContent = pctFed > 8 ? `Fed (${pctFed.toFixed(1)}%)` : '';

        barFica.style.width = `${pctFica.toFixed(1)}%`;
        barFica.textContent = pctFica > 6 ? `FICA` : '';

        barState.style.width = `${pctState.toFixed(1)}%`;
        barState.textContent = pctState > 5 ? `State` : '';

        barPretax.style.width = `${pctPre.toFixed(1)}%`;
        barPretax.textContent = pctPre > 4 ? `Pre` : '';

        // Bracket Subtext
        taxBracketSubtext.textContent = `Taxable Income: ${curFmt.format(taxableIncome)} after ${curFmt.format(deductionAmount)} deduction and ${curFmt.format(totalPreTax)} pre-tax deferrals.`;

        // Populate Progressive Brackets Table
        taxBracketsBody.innerHTML = '';
        bracketRows.forEach(row => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--color-border-subtle)';
            if (row.isActive) {
                tr.style.background = 'rgba(59, 130, 246, 0.07)';
            }
            tr.innerHTML = `
                <td style="padding: 10px 12px; font-weight: ${row.isActive ? '700' : '500'};">
                    ${row.tier} ${row.isActive ? '<span style="font-size:0.75rem; background:rgba(59,130,246,0.25); color:#60a5fa; padding:2px 6px; border-radius:4px; margin-left:6px;">Active</span>' : ''}
                </td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 600;">${row.rate}</td>
                <td class="td-right" style="padding: 10px 12px; color: var(--color-text-muted); font-size: 0.85rem;">${row.range}</td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 600;">${curFmt.format(row.taxable)}</td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 700; color: var(--color-primary);">${curFmt.format(row.tax)}</td>
            `;
            taxBracketsBody.appendChild(tr);
        });

        // Populate Frequency Table
        const frequencies = [
            { name: 'Annual (1 Year)', periods: 1 },
            { name: 'Monthly', periods: 12 },
            { name: 'Semi-Monthly (Twice/mo)', periods: 24 },
            { name: 'Bi-Weekly (Every 2 wks)', periods: 26 },
            { name: 'Weekly', periods: 52 }
        ];

        taxFrequencyBody.innerHTML = '';
        frequencies.forEach(freq => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--color-border-subtle)';
            const freqGross = grossIncome / freq.periods;
            const freqTaxes = totalTaxes / freq.periods;
            const freqNet = netTakeHome / freq.periods;

            tr.innerHTML = `
                <td style="padding: 10px 12px; font-weight: 600;">${freq.name}</td>
                <td class="td-right" style="padding: 10px 12px; color: var(--color-text-muted);">${freq.periods}</td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 600;">${curExactFmt.format(freqGross)}</td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 600; color: #ef4444;">${curExactFmt.format(freqTaxes)}</td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 800; color: #10b981;">${curExactFmt.format(freqNet)}</td>
            `;
            taxFrequencyBody.appendChild(tr);
        });
    }

    // Event listeners
    [grossIncomeInput, stateRateInput, k401Input, hsaInput, itemizedInput].forEach(inp => {
        inp.addEventListener('input', calculateTaxes);
    });

    taxYearSelect.addEventListener('change', function () {
        updateStandardDeductionLabel();
        calculateTaxes();
    });

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateTaxes);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            statusButtons.forEach(b => b.classList.remove('active'));
            statusButtons[0].classList.add('active');
            filingStatus = 'single';

            presetButtons.forEach(b => b.classList.remove('active'));
            presetButtons[1].classList.add('active'); // 85k

            grossIncomeInput.value = '85000';
            taxYearSelect.value = '2024';
            stateRateInput.value = '4.5';
            k401Input.value = '5000';
            hsaInput.value = '1500';

            deductionRadios[0].checked = true;
            itemizedWrapper.style.display = 'none';

            updateStandardDeductionLabel();
            calculateTaxes();
        });
    }

    // Initial run
    updateStandardDeductionLabel();
    calculateTaxes();
});
