/**
 * Age Calculator Logic
 * Calculates exact chronological age in completed years, months, and days.
 * Computes multi-unit totals (days, weeks, hours, minutes), next birthday countdown,
 * day of the week of birth, and astrological sign.
 */
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('age-form');
    if (!form) return;

    const birthDateInput = document.getElementById('birth-date');
    const targetDateInput = document.getElementById('target-date');
    const clearBtn = document.getElementById('btn-clear-age');

    // Results
    const resultPanel = document.getElementById('age-result-panel');
    const yearsDisplay = document.getElementById('age-years');
    const monthsDisplay = document.getElementById('age-months');
    const daysDisplay = document.getElementById('age-days');
    const birthDayName = document.getElementById('age-birth-dayname');
    const nextBdayCountdown = document.getElementById('next-bday-countdown');
    const zodiacBadge = document.getElementById('age-zodiac-badge');
    const zodiacSign = document.getElementById('age-zodiac-sign');

    const totalMonthsDisplay = document.getElementById('age-total-months');
    const totalWeeksDisplay = document.getElementById('age-total-weeks');
    const totalDaysDisplay = document.getElementById('age-total-days');
    const totalHoursDisplay = document.getElementById('age-total-hours');
    const totalMinutesDisplay = document.getElementById('age-total-minutes');

    const numFmt = new Intl.NumberFormat('en-US');

    // Default target date to today in local YYYY-MM-DD
    function getTodayString() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    if (!targetDateInput.value) {
        targetDateInput.value = getTodayString();
    }

    // Astrological Sign helper
    function getZodiac(month, day) {
        // month is 1-indexed (1 = Jan, 12 = Dec)
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { name: 'Aries ♈', full: 'Aries (Fire)' };
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { name: 'Taurus ♉', full: 'Taurus (Earth)' };
        if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { name: 'Gemini ♊', full: 'Gemini (Air)' };
        if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { name: 'Cancer ♋', full: 'Cancer (Water)' };
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { name: 'Leo ♌', full: 'Leo (Fire)' };
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { name: 'Virgo ♍', full: 'Virgo (Earth)' };
        if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { name: 'Libra ♎', full: 'Libra (Air)' };
        if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { name: 'Scorpio ♏', full: 'Scorpio (Water)' };
        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { name: 'Sagittarius ♐', full: 'Sagittarius (Fire)' };
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { name: 'Capricorn ♑', full: 'Capricorn (Earth)' };
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { name: 'Aquarius ♒', full: 'Aquarius (Air)' };
        return { name: 'Pisces ♓', full: 'Pisces (Water)' };
    }

    function calculateAge() {
        const birthStr = birthDateInput.value;
        const targetStr = targetDateInput.value;

        if (!birthStr || !targetStr) {
            resultPanel.style.display = 'none';
            return;
        }

        const [bY, bM, bD] = birthStr.split('-').map(Number);
        const [tY, tM, tD] = targetStr.split('-').map(Number);

        const birthDate = new Date(Date.UTC(bY, bM - 1, bD));
        const targetDate = new Date(Date.UTC(tY, tM - 1, tD));

        if (targetDate < birthDate) {
            alert('Target date cannot be earlier than birth date.');
            resultPanel.style.display = 'none';
            return;
        }

        // Exact Gregorian chronological subtraction
        let years = tY - bY;
        let months = tM - bM;
        let days = tD - bD;

        if (days < 0) {
            months -= 1;
            // Days in previous month of target date
            const prevMonthDays = new Date(tY, tM - 1, 0).getDate();
            days += prevMonthDays;
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        // Day of the week
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = dayNames[birthDate.getUTCDay()];

        // Total time calculations
        const diffMs = targetDate.getTime() - birthDate.getTime();
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const remainingWeekDays = totalDays % 7;
        const totalMonths = (years * 12) + months;
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;

        // Next Birthday Calculation
        let nextBdayYear = tY;
        let bdayThisYear = new Date(Date.UTC(nextBdayYear, bM - 1, bD));

        // If Feb 29 on non-leap year, fallback to Feb 28
        if (bM === 2 && bD === 29 && new Date(Date.UTC(nextBdayYear, 1, 29)).getUTCMonth() !== 1) {
            bdayThisYear = new Date(Date.UTC(nextBdayYear, 1, 28));
        }

        if (bdayThisYear <= targetDate) {
            nextBdayYear += 1;
        }

        let nextBdayDate = new Date(Date.UTC(nextBdayYear, bM - 1, bD));
        if (bM === 2 && bD === 29 && new Date(Date.UTC(nextBdayYear, 1, 29)).getUTCMonth() !== 1) {
            nextBdayDate = new Date(Date.UTC(nextBdayYear, 1, 28));
        }

        // Calculate countdown to next birthday
        let nbMonths = nextBdayDate.getUTCMonth() - targetDate.getUTCMonth();
        let nbDays = nextBdayDate.getUTCDate() - targetDate.getUTCDate();
        if (nbMonths < 0) nbMonths += 12;
        if (nbDays < 0) {
            nbMonths -= 1;
            if (nbMonths < 0) nbMonths += 12;
            const daysInTargetMonth = new Date(tY, tM, 0).getDate();
            nbDays += daysInTargetMonth;
        }

        let countdownText = '';
        if (nbMonths === 0 && nbDays === 0) {
            countdownText = '🎉 Happy Birthday today! 🎉';
        } else {
            const mPart = nbMonths > 0 ? `${nbMonths} month${nbMonths > 1 ? 's' : ''}` : '';
            const dPart = nbDays > 0 ? `${nbDays} day${nbDays > 1 ? 's' : ''}` : '';
            if (mPart && dPart) {
                countdownText = `${mPart} and ${dPart} remaining`;
            } else {
                countdownText = `${mPart || dPart} remaining`;
            }
        }

        // Astrological Sign
        const zodiac = getZodiac(bM, bD);

        // Update UI
        yearsDisplay.textContent = years;
        monthsDisplay.textContent = months;
        daysDisplay.textContent = days;
        birthDayName.textContent = `Born on a ${dayOfWeek}`;
        nextBdayCountdown.textContent = countdownText;

        zodiacBadge.textContent = zodiac.name;
        zodiacSign.textContent = zodiac.full;

        totalMonthsDisplay.textContent = `${numFmt.format(totalMonths)} months and ${days} days`;
        totalWeeksDisplay.textContent = `${numFmt.format(totalWeeks)} weeks and ${remainingWeekDays} days`;
        totalDaysDisplay.textContent = `${numFmt.format(totalDays)} days`;
        totalHoursDisplay.textContent = `${numFmt.format(totalHours)} hours`;
        totalMinutesDisplay.textContent = `${numFmt.format(totalMinutes)} minutes`;

        resultPanel.style.display = 'block';
    }

    [birthDateInput, targetDateInput].forEach(inp => {
        inp.addEventListener('change', calculateAge);
        inp.addEventListener('input', calculateAge);
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateAge();
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            birthDateInput.value = '1995-03-15';
            targetDateInput.value = getTodayString();
            calculateAge();
        });
    }

    // Initial calculation
    calculateAge();
});
