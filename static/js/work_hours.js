/**
 * Work Hours & Timesheet Calculator Engine
 * Calculates shift durations, unpaid break deductions, decimal payroll hours,
 * FLSA overtime, and gross wages.
 */

(function () {
    'use strict';

    // DOM Elements
    const hourlyRateInput = document.getElementById('wh-hourly-rate');
    const otThresholdInput = document.getElementById('wh-ot-threshold');
    const otMultiplierSelect = document.getElementById('wh-ot-rate-mult');

    const timesheetTbody = document.getElementById('wh-timesheet-tbody');
    const calculateBtn = document.getElementById('wh-calculate-btn');
    const resetBtn = document.getElementById('wh-reset-btn');

    // Preset Buttons
    const presetStandardBtn = document.getElementById('wh-preset-standard');
    const preset8to5Btn = document.getElementById('wh-preset-8to5');
    const presetClearBtn = document.getElementById('wh-preset-clear');

    // Outputs
    const grossPayEl = document.getElementById('wh-gross-pay');
    const hoursSubtextEl = document.getElementById('wh-hours-subtext');

    const regHoursEl = document.getElementById('wh-reg-hours');
    const regPayEl = document.getElementById('wh-reg-pay');
    const otHoursEl = document.getElementById('wh-ot-hours');
    const otPayEl = document.getElementById('wh-ot-pay');
    const totalBreaksEl = document.getElementById('wh-total-breaks');
    const effectiveRateEl = document.getElementById('wh-effective-rate');

    const sumRegHrs = document.getElementById('sum-reg-hrs');
    const sumRegRate = document.getElementById('sum-reg-rate');
    const sumRegEarnings = document.getElementById('sum-reg-earnings');
    const sumOtHrs = document.getElementById('sum-ot-hrs');
    const sumOtRate = document.getElementById('sum-ot-rate');
    const sumOtEarnings = document.getElementById('sum-ot-earnings');
    const sumTotalEarnings = document.getElementById('sum-total-earnings');

    function formatCurrency(val) {
        return '$' + Number(val).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function parseTimeToMinutes(timeStr) {
        if (!timeStr) return null;
        const parts = timeStr.split(':');
        if (parts.length !== 2) return null;
        const h = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        if (isNaN(h) || isNaN(m)) return null;
        return (h * 60) + m;
    }

    function calculateTimesheet() {
        const hourlyRate = parseFloat(hourlyRateInput.value) || 0;
        const otThreshold = parseFloat(otThresholdInput.value) || 40;
        const otMultiplier = parseFloat(otMultiplierSelect.value) || 1.5;

        let totalWeeklyMinutes = 0;
        let totalBreakMinutes = 0;

        const rows = timesheetTbody.querySelectorAll('tr');

        rows.forEach(function (row) {
            const timeInInput = row.querySelector('.wh-time-in');
            const timeOutInput = row.querySelector('.wh-time-out');
            const breakInput = row.querySelector('.wh-break');
            const dailyTotalCell = row.querySelector('.wh-daily-total');

            const inMins = parseTimeToMinutes(timeInInput.value);
            const outMins = parseTimeToMinutes(timeOutInput.value);
            const breakMins = parseFloat(breakInput.value) || 0;

            if (inMins !== null && outMins !== null) {
                let shiftMinutes = outMins - inMins;
                // Overnight shift handling
                if (shiftMinutes < 0) {
                    shiftMinutes += 24 * 60; // 1440 mins
                }

                const netMinutes = Math.max(0, shiftMinutes - breakMins);
                const dailyDecimalHours = netMinutes / 60;

                totalWeeklyMinutes += netMinutes;
                totalBreakMinutes += breakMins;

                dailyTotalCell.textContent = `${dailyDecimalHours.toFixed(2)} hrs`;
                dailyTotalCell.style.color = dailyDecimalHours > 0 ? 'var(--accent-primary)' : 'var(--text-muted)';
            } else {
                dailyTotalCell.textContent = '0.00 hrs';
                dailyTotalCell.style.color = 'var(--text-muted)';
            }
        });

        const totalHours = totalWeeklyMinutes / 60;
        const totalBreaksHours = totalBreakMinutes / 60;

        // Overtime Calculation (Standard weekly FLSA)
        const regularHours = Math.min(totalHours, otThreshold);
        const overtimeHours = Math.max(0, totalHours - otThreshold);

        const regularEarnings = regularHours * hourlyRate;
        const otHourlyRate = hourlyRate * otMultiplier;
        const overtimeEarnings = overtimeHours * otHourlyRate;
        const grossEarnings = regularEarnings + overtimeEarnings;

        const effectiveRate = totalHours > 0 ? (grossEarnings / totalHours) : hourlyRate;

        // Total hours in HH:MM format
        const totalWholeHours = Math.floor(totalWeeklyMinutes / 60);
        const totalRemainingMins = Math.round(totalWeeklyMinutes % 60);

        const breakWholeHours = Math.floor(totalBreakMinutes / 60);
        const breakRemainingMins = Math.round(totalBreakMinutes % 60);

        // Update UI Elements
        grossPayEl.textContent = formatCurrency(grossEarnings);
        hoursSubtextEl.innerHTML = `Total Hours Worked: <strong>${totalHours.toFixed(2)} Decimal Hours (${totalWholeHours} hrs ${totalRemainingMins} mins)</strong>`;

        regHoursEl.textContent = `${regularHours.toFixed(2)} hrs`;
        regPayEl.textContent = formatCurrency(regularEarnings);

        otHoursEl.textContent = `${overtimeHours.toFixed(2)} hrs`;
        otPayEl.textContent = `${formatCurrency(overtimeEarnings)} (@ ${otMultiplier.toFixed(1)}&times;)`;

        if (breakWholeHours > 0) {
            totalBreaksEl.textContent = `${breakWholeHours} hrs ${breakRemainingMins} mins`;
        } else {
            totalBreaksEl.textContent = `${breakRemainingMins} mins`;
        }

        effectiveRateEl.textContent = `${formatCurrency(effectiveRate)} / hr`;

        // Summary details box
        sumRegHrs.textContent = regularHours.toFixed(2);
        sumRegRate.textContent = hourlyRate.toFixed(2);
        sumRegEarnings.textContent = formatCurrency(regularEarnings);

        sumOtHrs.textContent = overtimeHours.toFixed(2);
        sumOtRate.textContent = otHourlyRate.toFixed(2);
        sumOtEarnings.textContent = formatCurrency(overtimeEarnings);

        sumTotalEarnings.textContent = formatCurrency(grossEarnings);
    }

    // Attach Event Listeners to Timesheet Inputs
    timesheetTbody.addEventListener('input', calculateTimesheet);
    timesheetTbody.addEventListener('change', calculateTimesheet);

    [hourlyRateInput, otThresholdInput, otMultiplierSelect].forEach(function (el) {
        if (el) {
            el.addEventListener('input', calculateTimesheet);
            el.addEventListener('change', calculateTimesheet);
        }
    });

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateTimesheet);
    }

    // Presets
    if (presetStandardBtn) {
        presetStandardBtn.addEventListener('click', function () {
            const rows = timesheetTbody.querySelectorAll('tr');
            rows.forEach(function (row, idx) {
                const inInput = row.querySelector('.wh-time-in');
                const outInput = row.querySelector('.wh-time-out');
                const breakInput = row.querySelector('.wh-break');

                if (idx < 5) { // Mon-Fri
                    inInput.value = '09:00';
                    outInput.value = '17:00';
                    breakInput.value = '30';
                } else { // Sat-Sun
                    inInput.value = '';
                    outInput.value = '';
                    breakInput.value = '0';
                }
            });
            calculateTimesheet();
        });
    }

    if (preset8to5Btn) {
        preset8to5Btn.addEventListener('click', function () {
            const rows = timesheetTbody.querySelectorAll('tr');
            rows.forEach(function (row, idx) {
                const inInput = row.querySelector('.wh-time-in');
                const outInput = row.querySelector('.wh-time-out');
                const breakInput = row.querySelector('.wh-break');

                if (idx < 5) { // Mon-Fri
                    inInput.value = '08:00';
                    outInput.value = '17:00';
                    breakInput.value = '60';
                } else { // Sat-Sun
                    inInput.value = '';
                    outInput.value = '';
                    breakInput.value = '0';
                }
            });
            calculateTimesheet();
        });
    }

    if (presetClearBtn) {
        presetClearBtn.addEventListener('click', function () {
            const rows = timesheetTbody.querySelectorAll('tr');
            rows.forEach(function (row) {
                row.querySelector('.wh-time-in').value = '';
                row.querySelector('.wh-time-out').value = '';
                row.querySelector('.wh-break').value = '0';
            });
            calculateTimesheet();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            hourlyRateInput.value = '25.00';
            otThresholdInput.value = '40';
            otMultiplierSelect.value = '1.5';

            // Reset back to initial table schedule
            const schedule = [
                { in: '08:00', out: '17:00', brk: 60 },
                { in: '08:00', out: '17:30', brk: 60 },
                { in: '08:00', out: '18:00', brk: 60 },
                { in: '08:30', out: '17:30', brk: 45 },
                { in: '08:00', out: '17:00', brk: 30 },
                { in: '', out: '', brk: 0 },
                { in: '', out: '', brk: 0 }
            ];

            const rows = timesheetTbody.querySelectorAll('tr');
            rows.forEach(function (row, idx) {
                const item = schedule[idx];
                row.querySelector('.wh-time-in').value = item.in;
                row.querySelector('.wh-time-out').value = item.out;
                row.querySelector('.wh-break').value = item.brk;
            });

            calculateTimesheet();
        });
    }

    // Initial Calculation
    calculateTimesheet();
})();
