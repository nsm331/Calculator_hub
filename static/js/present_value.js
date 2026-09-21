/**
 * Present Value (PV) Calculator Engine
 * Solves:
 *   - Lump sum discounting: PV = FV / (1 + r/n)^(nt) or FV * e^(-rt)
 *   - Ordinary Annuity & Annuity Due: PV = PMT * [(1 - (1+i)^(-N)) / i] * (1 + i*due)
 *   - Combined lump sum + regular cash flows
 * 100% Client-Side Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
    // Form inputs
    const fvInput = document.getElementById('pv-fv');
    const pmtInput = document.getElementById('pv-pmt');
    const timingSelect = document.getElementById('pv-timing');
    const rateInput = document.getElementById('pv-rate');
    const termInput = document.getElementById('pv-term');
    const freqSelect = document.getElementById('pv-freq');

    // Output elements
    const pvHeroEl = document.getElementById('pv-hero-val');
    const totalFutureEl = document.getElementById('pv-total-future');
    const totalDiscountEl = document.getElementById('pv-total-discount');
    const discountPctEl = document.getElementById('pv-discount-pct');
    const discountFactorEl = document.getElementById('pv-discount-factor');

    const scheduleBody = document.getElementById('pv-schedule-body');
    const sensitivityBody = document.getElementById('pv-sensitivity-body');

    function formatMoney(num) {
        if (isNaN(num) || !isFinite(num)) return '$0.00';
        return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function calculate() {
        const FV = parseFloat(fvInput.value) || 0;
        const PMT = parseFloat(pmtInput.value) || 0;
        const timing = timingSelect ? timingSelect.value : 'end';
        const isDue = timing === 'begin' ? 1 : 0;
        const annualRate = (parseFloat(rateInput.value) || 0) / 100;
        const termYears = parseFloat(termInput.value) || 0;
        const freq = freqSelect ? freqSelect.value : '1';

        if ((FV <= 0 && PMT <= 0) || annualRate <= 0 || termYears <= 0) {
            resetOutputs();
            return;
        }

        let pvLump = 0;
        let pvAnnuity = 0;
        let discountFactor = 1;
        let totalCashInflow = FV;

        if (freq === 'continuous') {
            // Continuous discounting: PV = FV * e^(-r*t)
            discountFactor = Math.exp(-annualRate * termYears);
            pvLump = FV * discountFactor;

            if (PMT > 0) {
                // Annual continuous annuity approximation: PMT * (1 - e^(-rt)) / r
                pvAnnuity = PMT * ((1 - Math.exp(-annualRate * termYears)) / annualRate);
                totalCashInflow += PMT * termYears;
            }
        } else {
            const n = parseFloat(freq) || 1;
            const i = annualRate / n;
            const N = n * termYears;

            discountFactor = Math.pow(1 + i, -N);
            pvLump = FV * discountFactor;

            if (PMT > 0 && i > 0) {
                const annuityFactor = (1 - Math.pow(1 + i, -N)) / i;
                pvAnnuity = PMT * annuityFactor * (1 + (i * isDue));
                totalCashInflow += PMT * N;
            }
        }

        const totalPV = pvLump + pvAnnuity;
        const totalDiscount = Math.max(0, totalCashInflow - totalPV);
        const discountPct = totalCashInflow > 0 ? (totalDiscount / totalCashInflow) * 100 : 0;

        // Render summary hero
        if (pvHeroEl) pvHeroEl.textContent = formatMoney(totalPV);
        if (totalFutureEl) totalFutureEl.textContent = formatMoney(totalCashInflow);
        if (totalDiscountEl) totalDiscountEl.textContent = formatMoney(totalDiscount);
        if (discountPctEl) discountPctEl.textContent = `${discountPct.toFixed(1)}%`;
        if (discountFactorEl) discountFactorEl.textContent = discountFactor.toFixed(4);

        // Render schedule
        renderSchedule(FV, PMT, annualRate, termYears, freq, isDue);

        // Render sensitivity table
        renderSensitivity(FV, PMT, annualRate, termYears, freq, isDue);
    }

    function renderSchedule(FV, PMT, r, years, freq, isDue) {
        if (!scheduleBody) return;
        scheduleBody.innerHTML = '';

        const maxYears = Math.min(Math.ceil(years), 40);
        let cumulativePV = 0;

        for (let yr = 1; yr <= maxYears; yr++) {
            let yearDuration = 1.0;
            if (yr > years) {
                yearDuration = years - (yr - 1);
            }
            if (yearDuration <= 0) break;

            let yearCashFlow = 0;
            if (freq === 'continuous') {
                yearCashFlow += PMT * yearDuration;
            } else {
                const n = parseFloat(freq) || 1;
                yearCashFlow += PMT * (n * yearDuration);
            }

            // If final year, add lump sum FV
            if (yr === maxYears || yr >= years) {
                yearCashFlow += FV;
            }

            // Discount factor for end of year yr
            let df = 0;
            if (freq === 'continuous') {
                df = Math.exp(-r * yr);
            } else {
                const n = parseFloat(freq) || 1;
                df = Math.pow(1 + (r / n), -(n * yr));
            }

            const discountedYearPV = yearCashFlow * df;
            cumulativePV += discountedYearPV;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Year ${yr}</td>
                <td>${formatMoney(yearCashFlow)}</td>
                <td style="font-family: monospace;">${df.toFixed(4)}</td>
                <td style="font-weight: 700; color: var(--color-primary);">${formatMoney(discountedYearPV)}</td>
                <td style="font-weight: 600;">${formatMoney(cumulativePV)}</td>
            `;
            scheduleBody.appendChild(row);
        }
    }

    function renderSensitivity(FV, PMT, baseRate, termYears, freq, isDue) {
        if (!sensitivityBody) return;
        sensitivityBody.innerHTML = '';

        const offsets = [-0.02, -0.01, 0, 0.01, 0.02];

        offsets.forEach(offset => {
            const testRate = baseRate + offset;
            if (testRate <= 0) return;

            let pvLump = 0;
            let pvAnnuity = 0;

            if (freq === 'continuous') {
                pvLump = FV * Math.exp(-testRate * termYears);
                if (PMT > 0) {
                    pvAnnuity = PMT * ((1 - Math.exp(-testRate * termYears)) / testRate);
                }
            } else {
                const n = parseFloat(freq) || 1;
                const i = testRate / n;
                const N = n * termYears;
                pvLump = FV * Math.pow(1 + i, -N);
                if (PMT > 0 && i > 0) {
                    pvAnnuity = PMT * ((1 - Math.pow(1 + i, -N)) / i) * (1 + (i * isDue));
                }
            }

            const testPV = pvLump + pvAnnuity;
            const isBase = offset === 0;

            const row = document.createElement('tr');
            if (isBase) {
                row.style.background = 'rgba(0, 122, 255, 0.1)';
                row.style.fontWeight = '700';
            }

            row.innerHTML = `
                <td>${(testRate * 100).toFixed(2)}% ${isBase ? '<span class="badge" style="background: var(--color-primary); color: #fff; font-size: 0.7rem; margin-left: 4px;">Current</span>' : ''}</td>
                <td style="font-weight: 700; color: var(--color-primary);">${formatMoney(testPV)}</td>
                <td>${formatMoney(testPV - (pvLump + pvAnnuity))}</td>
            `;
            sensitivityBody.appendChild(row);
        });
    }

    function resetOutputs() {
        if (pvHeroEl) pvHeroEl.textContent = '$0.00';
        if (totalFutureEl) totalFutureEl.textContent = '$0.00';
        if (totalDiscountEl) totalDiscountEl.textContent = '$0.00';
        if (discountPctEl) discountPctEl.textContent = '0%';
        if (discountFactorEl) discountFactorEl.textContent = '1.0000';
        if (scheduleBody) scheduleBody.innerHTML = '';
        if (sensitivityBody) sensitivityBody.innerHTML = '';
    }

    // Event listeners
    const inputs = [fvInput, pmtInput, rateInput, termInput];
    inputs.forEach(input => {
        if (input) input.addEventListener('input', calculate);
    });

    if (timingSelect) timingSelect.addEventListener('change', calculate);
    if (freqSelect) freqSelect.addEventListener('change', calculate);

    // Initial calculation
    calculate();
});
