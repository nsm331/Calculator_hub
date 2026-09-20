/**
 * Salary to Hourly & Compensation Schedule Calculator
 * CalculatorHub - Client-Side Vanilla JS
 */

document.addEventListener('DOMContentLoaded', function () {
    // Mode State
    let currentMode = 'salary-to-hourly'; // 'salary-to-hourly' or 'hourly-to-salary'

    // Form elements
    const salAmountInput = document.getElementById('sal-amount');
    const salAmountLabel = document.getElementById('sal-amount-label');
    const salAmountHint = document.getElementById('sal-amount-hint');
    const salHoursWeek = document.getElementById('sal-hours-week');
    const salWeeksYear = document.getElementById('sal-weeks-year');
    const salVacationDays = document.getElementById('sal-vacation-days');
    const salHolidays = document.getElementById('sal-holidays');
    const salUnpaidDays = document.getElementById('sal-unpaid-days');
    const salBonus = document.getElementById('sal-bonus');
    const salOtHours = document.getElementById('sal-ot-hours');

    // Display elements
    const resMainRate = document.getElementById('res-main-rate');
    const resMainRateLabel = document.getElementById('res-main-rate-label');
    const resMainRateSubtitle = document.getElementById('res-main-rate-subtitle');
    const resAdjustedRate = document.getElementById('res-adjusted-rate');
    const resAdjustedRateSubtitle = document.getElementById('res-adjusted-rate-subtitle');
    const resTotalGross = document.getElementById('res-total-gross');
    const resOvertimeRate = document.getElementById('res-overtime-rate');
    const salTableBody = document.getElementById('sal-table-body');

    // Controls
    const tabButtons = document.querySelectorAll('.salary-tab-btn');
    const presetButtons = document.querySelectorAll('.salary-preset-btn');
    const calculateBtn = document.getElementById('lbm-calculate-btn') || document.getElementById('salary-calculate-btn');
    const resetBtn = document.getElementById('salary-reset-btn');

    // Number formatters
    const currencyFmt = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const numFmt = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    // Tab Mode Toggle
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentMode = this.dataset.mode;

            if (currentMode === 'salary-to-hourly') {
                salAmountLabel.textContent = 'Annual Base Salary ($)';
                salAmountHint.textContent = 'Gross base earnings before taxes';
                salAmountInput.step = '500';
                salAmountInput.value = '75000';
                resMainRateLabel.textContent = 'Equivalent Hourly Rate';
                resMainRateSubtitle.textContent = 'Based on standard unadjusted schedule';
            } else {
                salAmountLabel.textContent = 'Hourly Wage Rate ($)';
                salAmountHint.textContent = 'Regular hourly base compensation';
                salAmountInput.step = '0.25';
                salAmountInput.value = '36.06';
                resMainRateLabel.textContent = 'Equivalent Annual Base Salary';
                resMainRateSubtitle.textContent = 'Based on standard full-time year';
            }
            calculateCompensation();
        });
    });

    // Preset Benchmarks
    presetButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            presetButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            if (currentMode === 'salary-to-hourly') {
                salAmountInput.value = this.dataset.salary;
            } else {
                salAmountInput.value = this.dataset.hourly;
            }
            calculateCompensation();
        });
    });

    function calculateCompensation() {
        const rawAmount = parseFloat(salAmountInput.value) || 0;
        const hoursPerWeek = parseFloat(salHoursWeek.value) || 40;
        const weeksPerYear = parseFloat(salWeeksYear.value) || 52;
        const vacationDays = parseFloat(salVacationDays.value) || 0;
        const holidays = parseFloat(salHolidays.value) || 0;
        const unpaidDays = parseFloat(salUnpaidDays.value) || 0;
        const bonus = parseFloat(salBonus.value) || 0;
        const otHoursPerWeek = parseFloat(salOtHours.value) || 0;

        if (rawAmount <= 0 || hoursPerWeek <= 0 || weeksPerYear <= 0) {
            return;
        }

        const totalNominalHours = hoursPerWeek * weeksPerYear; // e.g. 40 * 52 = 2080
        const dailyHours = hoursPerWeek / 5; // e.g. 8
        const totalPaidPtoDays = vacationDays + holidays;
        const totalPaidPtoHours = totalPaidPtoDays * dailyHours;
        const totalUnpaidHours = unpaidDays * dailyHours;

        // Actual hours worked on the clock (excluding paid holidays & vacations and unpaid leave)
        const actualHoursWorked = Math.max(1, totalNominalHours - totalPaidPtoHours - totalUnpaidHours);

        let baseSalary = 0;
        let unadjustedHourlyRate = 0;

        if (currentMode === 'salary-to-hourly') {
            baseSalary = rawAmount;
            unadjustedHourlyRate = baseSalary / totalNominalHours;
        } else {
            unadjustedHourlyRate = rawAmount;
            baseSalary = unadjustedHourlyRate * totalNominalHours;
        }

        // Adjusted real rate: Effective earning rate per actual productive hour worked
        // Since PTO is paid, you receive your full annual salary over fewer actual worked hours.
        const adjustedHourlyRate = baseSalary / actualHoursWorked;

        // Overtime (1.5x regular unadjusted rate)
        const overtimeRate = unadjustedHourlyRate * 1.5;
        const annualOtEarnings = otHoursPerWeek * 52 * overtimeRate;

        // Total Gross Compensation
        const totalGrossPay = baseSalary + bonus + annualOtEarnings;

        // Render KPI cards
        if (currentMode === 'salary-to-hourly') {
            resMainRate.textContent = currencyFmt.format(unadjustedHourlyRate) + '/hr';
        } else {
            resMainRate.textContent = currencyFmt.format(baseSalary) + '/yr';
        }

        resAdjustedRate.textContent = currencyFmt.format(adjustedHourlyRate) + '/hr';
        resAdjustedRateSubtitle.textContent = `Adjusted for ${numFmt.format(totalPaidPtoDays)} paid time off days (${numFmt.format(actualHoursWorked)} hrs worked)`;

        resTotalGross.textContent = currencyFmt.format(totalGrossPay);
        resOvertimeRate.textContent = currencyFmt.format(overtimeRate) + '/hr';

        // Multi-frequency pay breakdown table
        const frequencies = [
            { name: 'Hourly (Standard 2,080 hrs)', periods: totalNominalHours, isHourly: true },
            { name: 'Daily (8 hrs / 5-day week)', periods: weeksPerYear * 5, isDaily: true },
            { name: 'Weekly', periods: weeksPerYear },
            { name: 'Bi-Weekly (Every 2 weeks)', periods: 26 },
            { name: 'Semi-Monthly (Twice a month)', periods: 24 },
            { name: 'Monthly', periods: 12 },
            { name: 'Quarterly', periods: 4 },
            { name: 'Annual (1 Year)', periods: 1 }
        ];

        salTableBody.innerHTML = '';
        frequencies.forEach(freq => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--color-border-subtle)';

            let baseFreqPay = 0;
            let totalFreqPay = 0;

            if (freq.isHourly) {
                baseFreqPay = unadjustedHourlyRate;
                totalFreqPay = totalGrossPay / totalNominalHours;
            } else {
                baseFreqPay = baseSalary / freq.periods;
                totalFreqPay = totalGrossPay / freq.periods;
            }

            tr.innerHTML = `
                <td style="padding: 10px 12px; font-weight: 600;">${freq.name}</td>
                <td class="td-right" style="padding: 10px 12px; color: var(--color-text-muted);">${numFmt.format(freq.periods)}</td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 700; color: var(--color-text);">${currencyFmt.format(baseFreqPay)}</td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 700; color: var(--color-primary);">${currencyFmt.format(totalFreqPay)}</td>
            `;
            salTableBody.appendChild(tr);
        });
    }

    // Event listeners
    const liveInputs = [
        salAmountInput, salHoursWeek, salWeeksYear, salVacationDays,
        salHolidays, salUnpaidDays, salBonus, salOtHours
    ];

    liveInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', calculateCompensation);
        }
    });

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateCompensation);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            if (currentMode === 'salary-to-hourly') {
                salAmountInput.value = '75000';
            } else {
                salAmountInput.value = '36.06';
            }
            salHoursWeek.value = '40';
            salWeeksYear.value = '52';
            salVacationDays.value = '10';
            salHolidays.value = '10';
            salUnpaidDays.value = '0';
            salBonus.value = '0';
            salOtHours.value = '0';
            calculateCompensation();
        });
    }

    // Initial run
    calculateCompensation();
});
