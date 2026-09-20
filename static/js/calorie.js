/**
 * Calorie Needs Calculator Logic
 * Calculates BMR using the Mifflin-St Jeor equation and TDEE based on activity multiplier.
 * Provides target caloric intakes for maintenance, weight loss, and weight gain.
 */
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('calorie-form');
    if (!form) return;

    // Unit toggle buttons
    const tabUs = document.getElementById('tab-cal-us');
    const tabMetric = document.getElementById('tab-cal-metric');
    const usContainer = document.getElementById('cal-us-container');
    const metricContainer = document.getElementById('cal-metric-container');

    // Demographics
    const ageInput = document.getElementById('cal-age');
    const activitySelect = document.getElementById('cal-activity');
    const clearBtn = document.getElementById('btn-clear-cal');

    // US Inputs
    const heightFtInput = document.getElementById('cal-height-ft');
    const heightInInput = document.getElementById('cal-height-in');
    const weightLbsInput = document.getElementById('cal-weight-lbs');

    // Metric Inputs
    const heightCmInput = document.getElementById('cal-height-cm');
    const weightKgInput = document.getElementById('cal-weight-kg');

    // Result elements
    const resultPanel = document.getElementById('calorie-result-panel');
    const bmrBadge = document.getElementById('cal-bmr-badge');
    const tdeeDisplay = document.getElementById('cal-tdee-display');
    const maintainDisplay = document.getElementById('cal-maintain');
    const lossMildDisplay = document.getElementById('cal-loss-mild');
    const lossStdDisplay = document.getElementById('cal-loss-std');
    const lossFastDisplay = document.getElementById('cal-loss-fast');
    const gainMildDisplay = document.getElementById('cal-gain-mild');
    const gainStdDisplay = document.getElementById('cal-gain-std');

    let currentUnit = 'us';

    const numFmt = new Intl.NumberFormat('en-US');

    // Tab Switching with bidirectional conversion
    function switchTab(targetUnit) {
        if (targetUnit === currentUnit) return;

        if (targetUnit === 'metric') {
            // Convert US to Metric
            const ft = parseFloat(heightFtInput.value) || 0;
            const inches = parseFloat(heightInInput.value) || 0;
            const totalInches = (ft * 12) + inches;
            const cm = totalInches * 2.54;
            if (cm > 0) heightCmInput.value = Math.round(cm * 10) / 10;

            const lbs = parseFloat(weightLbsInput.value) || 0;
            const kg = lbs * 0.45359237;
            if (kg > 0) weightKgInput.value = Math.round(kg * 10) / 10;

            tabUs.classList.remove('active');
            tabUs.setAttribute('aria-selected', 'false');
            tabMetric.classList.add('active');
            tabMetric.setAttribute('aria-selected', 'true');

            usContainer.style.display = 'none';
            metricContainer.style.display = 'block';
            currentUnit = 'metric';
        } else {
            // Convert Metric to US
            const cm = parseFloat(heightCmInput.value) || 0;
            const totalInches = cm / 2.54;
            const ft = Math.floor(totalInches / 12);
            const remainingInches = Math.round(totalInches % 12);
            if (cm > 0) {
                heightFtInput.value = ft;
                heightInInput.value = remainingInches;
            }

            const kg = parseFloat(weightKgInput.value) || 0;
            const lbs = kg * 2.20462262;
            if (kg > 0) weightLbsInput.value = Math.round(lbs * 10) / 10;

            tabMetric.classList.remove('active');
            tabMetric.setAttribute('aria-selected', 'false');
            tabUs.classList.add('active');
            tabUs.setAttribute('aria-selected', 'true');

            metricContainer.style.display = 'none';
            usContainer.style.display = 'block';
            currentUnit = 'us';
        }

        calculateCalories();
    }

    if (tabUs && tabMetric) {
        tabUs.addEventListener('click', () => switchTab('us'));
        tabMetric.addEventListener('click', () => switchTab('metric'));
    }

    // Input change listeners
    const allInputs = [
        ageInput, heightFtInput, heightInInput, weightLbsInput,
        heightCmInput, weightKgInput, activitySelect
    ];

    allInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', calculateCalories);
            input.addEventListener('change', calculateCalories);
        }
    });

    document.querySelectorAll('input[name="cal-gender"]').forEach(radio => {
        radio.addEventListener('change', calculateCalories);
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateCalories();
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            ageInput.value = 30;
            const maleRadio = document.querySelector('input[name="cal-gender"][value="male"]');
            if (maleRadio) maleRadio.checked = true;

            heightFtInput.value = 5;
            heightInInput.value = 11;
            weightLbsInput.value = 176;
            heightCmInput.value = 180;
            weightKgInput.value = 80;
            activitySelect.value = '1.55';

            calculateCalories();
        });
    }

    function calculateCalories() {
        const age = parseFloat(ageInput.value) || 0;
        const genderElem = document.querySelector('input[name="cal-gender"]:checked');
        const gender = genderElem ? genderElem.value : 'male';
        const activity = parseFloat(activitySelect.value) || 1.2;

        let weightKg = 0;
        let heightCm = 0;

        if (currentUnit === 'us') {
            const ft = parseFloat(heightFtInput.value) || 0;
            const inches = parseFloat(heightInInput.value) || 0;
            const lbs = parseFloat(weightLbsInput.value) || 0;

            const totalInches = (ft * 12) + inches;
            heightCm = totalInches * 2.54;
            weightKg = lbs * 0.45359237;
        } else {
            heightCm = parseFloat(heightCmInput.value) || 0;
            weightKg = parseFloat(weightKgInput.value) || 0;
        }

        if (age < 10 || weightKg <= 0 || heightCm <= 0) {
            resultPanel.style.display = 'none';
            return;
        }

        // Mifflin-St Jeor BMR Equation:
        // Men: BMR = 10*W + 6.25*H - 5*A + 5
        // Women: BMR = 10*W + 6.25*H - 5*A - 161
        let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
        if (gender === 'male') {
            bmr += 5;
        } else {
            bmr -= 161;
        }

        // Total Daily Energy Expenditure (TDEE)
        const tdee = Math.round(bmr * activity);
        const roundedBmr = Math.round(bmr);

        // Targets (with safe caloric minimums)
        const lossMild = Math.max(1200, tdee - 250);
        const lossStd = Math.max(1200, tdee - 500);
        const lossFast = Math.max(1000, tdee - 1000);
        const gainMild = tdee + 250;
        const gainStd = tdee + 500;

        // Render UI
        bmrBadge.textContent = `BMR: ${numFmt.format(roundedBmr)} kcal/day`;
        tdeeDisplay.textContent = numFmt.format(tdee);
        maintainDisplay.textContent = `${numFmt.format(tdee)} kcal/day`;
        lossMildDisplay.textContent = `${numFmt.format(lossMild)} kcal/day`;
        lossStdDisplay.textContent = `${numFmt.format(lossStd)} kcal/day`;
        lossFastDisplay.textContent = `${numFmt.format(lossFast)} kcal/day`;
        gainMildDisplay.textContent = `${numFmt.format(gainMild)} kcal/day`;
        gainStdDisplay.textContent = `${numFmt.format(gainStd)} kcal/day`;

        resultPanel.style.display = 'block';
    }

    // Initial calculation on page load
    calculateCalories();
});
