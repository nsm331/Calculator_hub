/**
 * Date Difference Calculator Logic
 * Calculates exact calendar differences (years, months, days), total days,
 * working business days (excluding Saturdays/Sundays), weeks, hours, and visual ratios.
 */
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('date-diff-form');
    if (!form) return;

    const startDateInput = document.getElementById('diff-start-date');
    const endDateInput = document.getElementById('diff-end-date');
    const includeEndCheckbox = document.getElementById('diff-include-end');
    const clearBtn = document.getElementById('btn-clear-diff');

    // Result elements
    const resultPanel = document.getElementById('date-diff-result-panel');
    const daysBadge = document.getElementById('diff-total-days-badge');
    const yearsDisplay = document.getElementById('diff-res-years');
    const monthsDisplay = document.getElementById('diff-res-months');
    const daysDisplay = document.getElementById('diff-res-days');
    const daynamesInfo = document.getElementById('diff-daynames-info');

    const barWorkLabel = document.getElementById('bar-work-label');
    const barWendLabel = document.getElementById('bar-wend-label');
    const barWork = document.getElementById('bar-diff-work');
    const barWend = document.getElementById('bar-diff-wend');

    const totalDaysDisplay = document.getElementById('diff-total-days');
    const businessDaysDisplay = document.getElementById('diff-business-days');
    const weekendDaysDisplay = document.getElementById('diff-weekend-days');
    const totalWeeksDisplay = document.getElementById('diff-total-weeks');
    const totalHoursDisplay = document.getElementById('diff-total-hours');
    const yearPercentDisplay = document.getElementById('diff-year-percent');

    const numFmt = new Intl.NumberFormat('en-US');

    function calculateDateDifference() {
        const startStr = startDateInput.value;
        const endStr = endDateInput.value;
        const isInclusive = includeEndCheckbox.checked;

        if (!startStr || !endStr) {
            resultPanel.style.display = 'none';
            return;
        }

        const [sY, sM, sD] = startStr.split('-').map(Number);
        const [eY, eM, eD] = endStr.split('-').map(Number);

        const startDate = new Date(Date.UTC(sY, sM - 1, sD));
        const endDate = new Date(Date.UTC(eY, eM - 1, eD));

        if (endDate < startDate) {
            alert('End date cannot be earlier than start date.');
            resultPanel.style.display = 'none';
            return;
        }

        // Calendar component difference
        let years = eY - sY;
        let months = eM - sM;
        let days = eD - sD;

        if (days < 0) {
            months -= 1;
            const daysInPrevMonth = new Date(eY, eM - 1, 0).getDate();
            days += daysInPrevMonth;
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        if (isInclusive) {
            days += 1;
            const daysInEndMonth = new Date(eY, eM, 0).getDate();
            if (days > daysInEndMonth) {
                days -= daysInEndMonth;
                months += 1;
                if (months >= 12) {
                    months -= 12;
                    years += 1;
                }
            }
        }

        // Total Days difference
        const diffMs = endDate.getTime() - startDate.getTime();
        let totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (isInclusive) {
            totalDays += 1;
        }

        // Business Days vs Weekend Days calculation
        let businessDays = 0;
        let weekendDays = 0;

        const curDate = new Date(startDate.getTime());
        const countLimit = isInclusive ? totalDays : totalDays;

        for (let i = 0; i < countLimit; i++) {
            const dayOfWeek = curDate.getUTCDay(); // 0 = Sunday, 6 = Saturday
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                weekendDays++;
            } else {
                businessDays++;
            }
            curDate.setUTCDate(curDate.getUTCDate() + 1);
        }

        // Day names
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const startDayName = dayNames[startDate.getUTCDay()];
        const endDayName = dayNames[endDate.getUTCDay()];

        // Weeks, hours, year %
        const totalWeeks = Math.floor(totalDays / 7);
        const remDays = totalDays % 7;
        const totalHours = totalDays * 24;

        // Leap year check for year percentage
        const isLeap = (sY % 4 === 0 && sY % 100 !== 0) || (sY % 400 === 0);
        const daysInYear = isLeap ? 366 : 365;
        const yearPct = (totalDays / daysInYear) * 100;

        // Render UI
        yearsDisplay.textContent = years;
        monthsDisplay.textContent = months;
        daysDisplay.textContent = days;
        daysBadge.textContent = `${numFmt.format(totalDays)} Days Total`;
        daynamesInfo.textContent = `From ${startDayName} to ${endDayName}${isInclusive ? ' (Both Days Inclusive)' : ''}`;

        totalDaysDisplay.textContent = `${numFmt.format(totalDays)} days`;
        businessDaysDisplay.textContent = `${numFmt.format(businessDays)} days`;
        weekendDaysDisplay.textContent = `${numFmt.format(weekendDays)} days`;
        totalWeeksDisplay.textContent = `${numFmt.format(totalWeeks)} weeks and ${remDays} days`;
        totalHoursDisplay.textContent = `${numFmt.format(totalHours)} hours`;
        yearPercentDisplay.textContent = `${yearPct.toFixed(2)}%`;

        // Ratio Bar
        if (totalDays > 0) {
            const workPct = ((businessDays / totalDays) * 100).toFixed(1);
            const wendPct = ((weekendDays / totalDays) * 100).toFixed(1);

            barWork.style.width = workPct + '%';
            barWend.style.width = wendPct + '%';

            barWorkLabel.textContent = `${numFmt.format(businessDays)} days (${workPct}%)`;
            barWendLabel.textContent = `${numFmt.format(weekendDays)} days (${wendPct}%)`;
        }

        resultPanel.style.display = 'block';
    }

    [startDateInput, endDateInput, includeEndCheckbox].forEach(el => {
        el.addEventListener('change', calculateDateDifference);
        el.addEventListener('input', calculateDateDifference);
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateDateDifference();
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            startDateInput.value = '2026-01-15';
            endDateInput.value = '2026-09-20';
            includeEndCheckbox.checked = false;
            calculateDateDifference();
        });
    }

    calculateDateDifference();
});
