/**
 * Basal Metabolic Rate (BMR) Calculator Engine
 * 100% Client-Side Vanilla JavaScript
 * Instant calculation with zero page reload.
 */

(function () {
    'use strict';

    var currentUnit = 'us'; // 'us' or 'metric'

    // DOM Elements
    var unitUsBtn = document.getElementById('bmr-unit-us');
    var unitMetricBtn = document.getElementById('bmr-unit-metric');
    var fieldsUs = document.getElementById('bmr-fields-us');
    var fieldsMetric = document.getElementById('bmr-fields-metric');

    var genderMale = document.getElementById('bmr-gender-male');
    var genderFemale = document.getElementById('bmr-gender-female');
    var ageInput = document.getElementById('bmr-age');
    var bodyfatInput = document.getElementById('bmr-bodyfat');

    var heightFtInput = document.getElementById('bmr-height-ft');
    var heightInInput = document.getElementById('bmr-height-in');
    var weightLbsInput = document.getElementById('bmr-weight-lbs');

    var heightCmInput = document.getElementById('bmr-height-cm');
    var weightKgInput = document.getElementById('bmr-weight-kg');

    var activitySelect = document.getElementById('bmr-activity');
    var calcBtn = document.getElementById('bmr-calc-btn');
    var resetBtn = document.getElementById('bmr-reset-btn');

    // Output Elements
    var heroValEl = document.getElementById('bmr-hero-val');
    var heroTdeeEl = document.getElementById('bmr-hero-tdee');
    var mifflinValEl = document.getElementById('bmr-mifflin-val');
    var harrisValEl = document.getElementById('bmr-harris-val');
    var katchValEl = document.getElementById('bmr-katch-val');
    var hourlyValEl = document.getElementById('bmr-hourly-val');
    var joulesValEl = document.getElementById('bmr-joules-val');
    var bmiValEl = document.getElementById('bmr-bmi-val');
    var tdeeSummaryEl = document.getElementById('bmr-tdee-summary');

    var goalMaintainEl = document.getElementById('bmr-goal-maintain');
    var goalMildLossEl = document.getElementById('bmr-goal-mild-loss');
    var goalStandardLossEl = document.getElementById('bmr-goal-standard-loss');
    var goalFastLossEl = document.getElementById('bmr-goal-fast-loss');
    var goalMildGainEl = document.getElementById('bmr-goal-mild-gain');
    var goalFastGainEl = document.getElementById('bmr-goal-fast-gain');

    function switchUnit(unit) {
        if (currentUnit === unit) return;
        currentUnit = unit;

        if (unit === 'us') {
            unitUsBtn.classList.add('active');
            unitMetricBtn.classList.remove('active');
            fieldsUs.style.display = 'block';
            fieldsMetric.style.display = 'none';

            // Sync metric to US
            var cm = parseFloat(heightCmInput.value) || 178;
            var totalInches = cm / 2.54;
            var ft = Math.floor(totalInches / 12);
            var inches = Math.round((totalInches % 12) * 10) / 10;
            heightFtInput.value = ft;
            heightInInput.value = inches;

            var kg = parseFloat(weightKgInput.value) || 79.5;
            weightLbsInput.value = Math.round(kg * 2.20462 * 10) / 10;
        } else {
            unitMetricBtn.classList.add('active');
            unitUsBtn.classList.remove('active');
            fieldsMetric.style.display = 'block';
            fieldsUs.style.display = 'none';

            // Sync US to metric
            var ftVal = parseFloat(heightFtInput.value) || 5;
            var inVal = parseFloat(heightInInput.value) || 10;
            var cmVal = ((ftVal * 12) + inVal) * 2.54;
            heightCmInput.value = Math.round(cmVal * 10) / 10;

            var lbs = parseFloat(weightLbsInput.value) || 175;
            weightKgInput.value = Math.round((lbs / 2.20462) * 10) / 10;
        }

        calculateBMR();
    }

    function calculateBMR() {
        var isMale = genderMale.checked;
        var age = parseInt(ageInput.value, 10) || 28;
        if (age < 15) age = 15;
        if (age > 115) age = 115;

        var weightKg = 0;
        var heightCm = 0;

        if (currentUnit === 'us') {
            var ft = parseFloat(heightFtInput.value) || 0;
            var inches = parseFloat(heightInInput.value) || 0;
            heightCm = ((ft * 12) + inches) * 2.54;

            var lbs = parseFloat(weightLbsInput.value) || 0;
            weightKg = lbs / 2.20462;
        } else {
            heightCm = parseFloat(heightCmInput.value) || 0;
            weightKg = parseFloat(weightKgInput.value) || 0;
        }

        if (weightKg <= 0 || heightCm <= 0) return;

        // 1. Mifflin-St Jeor Formula
        var bmrMifflin = 0;
        if (isMale) {
            bmrMifflin = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
        } else {
            bmrMifflin = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
        }

        // 2. Revised Harris-Benedict (1984) Formula
        var bmrHarris = 0;
        if (isMale) {
            bmrHarris = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
        } else {
            bmrHarris = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
        }

        // 3. Katch-McArdle Formula
        var userBf = parseFloat(bodyfatInput.value);
        var bmrKatch = 0;
        if (!isNaN(userBf) && userBf > 2 && userBf < 70) {
            var lbmKg = weightKg * (1 - (userBf / 100));
            bmrKatch = 370 + (21.6 * lbmKg);
        } else {
            // Default baseline estimate (~18% male, ~25% female)
            var defaultBf = isMale ? 18 : 25;
            var defaultLbm = weightKg * (1 - (defaultBf / 100));
            bmrKatch = 370 + (21.6 * defaultLbm);
        }

        // 4. Activity Multiplier & TDEE
        var activityFactor = parseFloat(activitySelect.value) || 1.55;
        var tdee = Math.round(bmrMifflin * activityFactor);
        var bmrRounded = Math.round(bmrMifflin);

        // 5. Secondary Metrics
        var hourlyKcal = (bmrMifflin / 24).toFixed(1);
        var dailyJoules = Math.round(bmrMifflin * 4.184).toLocaleString();
        var heightM = heightCm / 100;
        var bmi = (weightKg / (heightM * heightM)).toFixed(1);

        // Activity category label for subtitle
        var actText = activitySelect.options[activitySelect.selectedIndex].text.split(':')[0];

        // Update DOM
        heroValEl.textContent = bmrRounded.toLocaleString() + ' Calories/day';
        heroTdeeEl.textContent = 'Maintenance TDEE: ' + tdee.toLocaleString() + ' Calories/day (' + actText + ')';

        mifflinValEl.textContent = bmrRounded.toLocaleString() + ' kcal';
        harrisValEl.textContent = Math.round(bmrHarris).toLocaleString() + ' kcal';
        katchValEl.textContent = Math.round(bmrKatch).toLocaleString() + ' kcal';
        hourlyValEl.textContent = hourlyKcal + ' kcal/hr';
        joulesValEl.textContent = dailyJoules + ' kJ/day';
        bmiValEl.textContent = bmi + ' kg/m²';
        tdeeSummaryEl.textContent = tdee.toLocaleString() + ' kcal';

        // Goals
        goalMaintainEl.textContent = tdee.toLocaleString() + ' kcal/day';
        goalMildLossEl.textContent = Math.max(1000, tdee - 250).toLocaleString() + ' kcal/day';
        goalStandardLossEl.textContent = Math.max(1000, tdee - 500).toLocaleString() + ' kcal/day';
        goalFastLossEl.textContent = Math.max(1000, tdee - 1000).toLocaleString() + ' kcal/day';
        goalMildGainEl.textContent = (tdee + 250).toLocaleString() + ' kcal/day';
        goalFastGainEl.textContent = (tdee + 500).toLocaleString() + ' kcal/day';
    }

    function resetDefaults() {
        genderMale.checked = true;
        ageInput.value = '28';
        bodyfatInput.value = '';
        activitySelect.value = '1.55';

        if (currentUnit === 'us') {
            heightFtInput.value = '5';
            heightInInput.value = '10';
            weightLbsInput.value = '175';
        } else {
            heightCmInput.value = '178';
            weightKgInput.value = '79.5';
        }
        calculateBMR();
    }

    // Attach Event Listeners
    if (unitUsBtn) unitUsBtn.addEventListener('click', function () { switchUnit('us'); });
    if (unitMetricBtn) unitMetricBtn.addEventListener('click', function () { switchUnit('metric'); });

    [genderMale, genderFemale].forEach(function (radio) {
        if (radio) radio.addEventListener('change', calculateBMR);
    });

    [
        ageInput, bodyfatInput, heightFtInput, heightInInput,
        weightLbsInput, heightCmInput, weightKgInput, activitySelect
    ].forEach(function (el) {
        if (el) {
            el.addEventListener('input', calculateBMR);
            el.addEventListener('change', calculateBMR);
        }
    });

    if (calcBtn) calcBtn.addEventListener('click', calculateBMR);
    if (resetBtn) resetBtn.addEventListener('click', resetDefaults);

    // Initial calculation on load
    calculateBMR();
})();
