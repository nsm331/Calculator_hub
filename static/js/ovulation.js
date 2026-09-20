/**
 * Ovulation & Fertility Calculator - Pure Vanilla JavaScript Engine
 * Clinical cycle kinetics, fertile window calculation, conception probability,
 * pregnancy test timing, and future cycle forecasting.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Form Inputs
    const lmpInput = document.getElementById('ovu-lmp');
    const cycleLenInput = document.getElementById('ovu-cycle-len');
    const lutealLenInput = document.getElementById('ovu-luteal-len');
    const calcBtn = document.getElementById('ovu-calc-btn');
    const todayBtn = document.getElementById('ovu-today-btn');
    const resetBtn = document.getElementById('ovu-reset-btn');
    const cycleBtns = document.querySelectorAll('.ovu-cycle-btn');

    // Result Elements
    const ovulationDateEl = document.getElementById('res-ovulation-date');
    const ovulationSubEl = document.getElementById('res-ovulation-sub');
    const fertileWindowEl = document.getElementById('res-fertile-window');
    const peakDaysEl = document.getElementById('res-peak-days');
    const nextPeriodEl = document.getElementById('res-next-period');
    const testDateEl = document.getElementById('res-test-date');
    const projectedEddEl = document.getElementById('res-projected-edd');

    const milestonesBody = document.getElementById('ovu-milestones-body');

    // Date formatting helper
    function formatDate(date, includeYear = true) {
        if (!date || isNaN(date.getTime())) return '—';
        const options = { month: 'short', day: 'numeric' };
        if (includeYear) options.year = 'numeric';
        return date.toLocaleDateString('en-US', options);
    }

    function addDays(date, days) {
        const result = new Date(date.getTime());
        result.setDate(result.getDate() + days);
        return result;
    }

    // Set Default LMP Date (14 days ago)
    function setDefaultLmp() {
        const today = new Date();
        const defaultLmp = addDays(today, -14);
        const yyyy = defaultLmp.getFullYear();
        const mm = String(defaultLmp.getMonth() + 1).padStart(2, '0');
        const dd = String(defaultLmp.getDate()).padStart(2, '0');
        lmpInput.value = `${yyyy}-${mm}-${dd}`;
    }

    setDefaultLmp();

    function calculateFertility() {
        if (!lmpInput.value) return;

        const parts = lmpInput.value.split('-');
        const lmpDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        if (isNaN(lmpDate.getTime())) return;

        const cycleLen = Math.min(45, Math.max(20, parseInt(cycleLenInput.value, 10) || 28));
        const lutealLen = Math.min(18, Math.max(10, parseInt(lutealLenInput.value, 10) || 14));

        // Ovulation Day = LMP + (Cycle Length - Luteal Phase Length)
        const follicularDays = cycleLen - lutealLen;
        const ovulationDate = addDays(lmpDate, follicularDays);

        // Fertile Window: 5 days prior to ovulation + ovulation day
        const fertileStart = addDays(ovulationDate, -5);
        const fertileEnd = ovulationDate;

        // Peak Conception Days: Day before ovulation and Ovulation Day
        const peakStart = addDays(ovulationDate, -1);
        const peakEnd = ovulationDate;

        // Next Expected Period: LMP + Cycle Length
        const nextPeriod = addDays(lmpDate, cycleLen);

        // Earliest Reliable Home Pregnancy Test Date: Ovulation + 14 days
        const testDate = addDays(ovulationDate, 14);

        // Projected Due Date if conception occurs: Ovulation + 266 days (post-conception gestation)
        const projectedEdd = addDays(ovulationDate, 266);

        // Update Hero Banner
        ovulationDateEl.textContent = formatDate(ovulationDate, true);
        ovulationSubEl.textContent = `Cycle Day ${follicularDays + 1} • ~33% single-intercourse conception probability`;

        // Update Metric Cards
        fertileWindowEl.textContent = `${formatDate(fertileStart, false)} – ${formatDate(fertileEnd, false)}`;
        peakDaysEl.textContent = `${formatDate(peakStart, false)} & ${formatDate(peakEnd, false)}`;
        nextPeriodEl.textContent = formatDate(nextPeriod, true);
        testDateEl.textContent = formatDate(testDate, true);
        projectedEddEl.textContent = formatDate(projectedEdd, true);

        // Build Upcoming 3 Cycles Milestones Table
        let tableHtml = '';
        for (let c = 1; c <= 3; c++) {
            const cLmp = addDays(lmpDate, (c - 1) * cycleLen);
            const cOvu = addDays(cLmp, follicularDays);
            const cFertileStart = addDays(cOvu, -5);
            const cNext = addDays(cLmp, cycleLen);
            const cEdd = addDays(cOvu, 266);

            tableHtml += `
                <tr style="border-bottom: 1px solid var(--color-border-light);">
                    <td style="padding: 10px 12px; font-weight: 700; color: ${c === 1 ? '#ec4899' : 'var(--color-text-main)'};">
                        Cycle ${c} ${c === 1 ? '<span style="font-size: 0.72rem; background: rgba(236,72,153,0.15); color: #ec4899; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">Current</span>' : ''}
                    </td>
                    <td style="padding: 10px 12px; color: #38bdf8;">${formatDate(cFertileStart, false)} – ${formatDate(cOvu, false)}</td>
                    <td style="padding: 10px 12px; font-weight: 700; color: #ec4899;">${formatDate(cOvu, true)}</td>
                    <td style="padding: 10px 12px; color: #a78bfa;">${formatDate(cNext, true)}</td>
                    <td style="padding: 10px 12px; font-weight: 600; color: #10b981;">${formatDate(cEdd, true)}</td>
                </tr>
            `;
        }
        milestonesBody.innerHTML = tableHtml;
    }

    // Preset Cycle Buttons
    cycleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            cycleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            cycleLenInput.value = this.getAttribute('data-cycle');
            calculateFertility();
        });
    });

    // Set LMP to Today
    todayBtn.addEventListener('click', function () {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        lmpInput.value = `${yyyy}-${mm}-${dd}`;
        calculateFertility();
    });

    // Event Listeners for Live Recalculation
    [lmpInput, cycleLenInput, lutealLenInput].forEach(inp => {
        inp.addEventListener('input', calculateFertility);
        inp.addEventListener('change', calculateFertility);
    });

    calcBtn.addEventListener('click', calculateFertility);

    // Reset Defaults
    resetBtn.addEventListener('click', function () {
        setDefaultLmp();
        cycleLenInput.value = '28';
        lutealLenInput.value = '14';

        cycleBtns.forEach(b => {
            if (b.getAttribute('data-cycle') === '28') {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        calculateFertility();
    });

    // Initial Calculation
    calculateFertility();
});
