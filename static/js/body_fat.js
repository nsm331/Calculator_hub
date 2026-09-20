/**
 * Body Fat Percentage Calculator Logic
 * Implements the U.S. Navy tape measure method (Hodgdon and Beckett regression formulas).
 * Calculates Body Fat %, Fat Mass, Lean Body Mass, ACE categories, and goal targets.
 */
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('body-fat-form');
    if (!form) return;

    // Unit toggle buttons
    const tabUs = document.getElementById('tab-bf-us');
    const tabMetric = document.getElementById('tab-bf-metric');
    const usContainer = document.getElementById('bf-us-container');
    const metricContainer = document.getElementById('bf-metric-container');

    // Demographics
    const ageInput = document.getElementById('bf-age');
    const rowHipUs = document.getElementById('row-hip-us');
    const rowHipMetric = document.getElementById('row-hip-metric');
    const hintWaistUs = document.getElementById('hint-waist-us');
    const hintWaistMetric = document.getElementById('hint-waist-metric');
    const clearBtn = document.getElementById('btn-clear-bf');

    // US Inputs
    const weightLbsInput = document.getElementById('bf-weight-lbs');
    const heightFtInput = document.getElementById('bf-height-ft');
    const heightInInput = document.getElementById('bf-height-in');
    const neckInInput = document.getElementById('bf-neck-in');
    const waistInInput = document.getElementById('bf-waist-in');
    const hipInInput = document.getElementById('bf-hip-in');

    // Metric Inputs
    const weightKgInput = document.getElementById('bf-weight-kg');
    const heightCmInput = document.getElementById('bf-height-cm');
    const neckCmInput = document.getElementById('bf-neck-cm');
    const waistCmInput = document.getElementById('bf-waist-cm');
    const hipCmInput = document.getElementById('bf-hip-cm');

    // Result elements
    const resultPanel = document.getElementById('body-fat-result-panel');
    const percentageDisplay = document.getElementById('bf-percentage-display');
    const categoryBadge = document.getElementById('bf-category-badge');
    const barLeanLabel = document.getElementById('bar-lean-label');
    const barFatLabel = document.getElementById('bar-fat-label');
    const barBfLean = document.getElementById('bar-bf-lean');
    const barBfFat = document.getElementById('bar-bf-fat');

    const fatMassDisplay = document.getElementById('bf-fat-mass');
    const leanMassDisplay = document.getElementById('bf-lean-mass');
    const categoryNameDisplay = document.getElementById('bf-category-name');
    const idealTargetDisplay = document.getElementById('bf-ideal-target');
    const fatToLoseDisplay = document.getElementById('bf-fat-to-lose');
    const bmiEquivDisplay = document.getElementById('bf-bmi-equiv');

    let currentUnit = 'us';

    // Toggle female hip row visibility & label hints
    function updateGenderUI() {
        const genderElem = document.querySelector('input[name="bf-gender"]:checked');
        const isFemale = genderElem && genderElem.value === 'female';

        if (rowHipUs) rowHipUs.style.display = isFemale ? 'grid' : 'none';
        if (rowHipMetric) rowHipMetric.style.display = isFemale ? 'grid' : 'none';

        if (isFemale) {
            if (hintWaistUs) hintWaistUs.textContent = 'Measure horizontally at the narrowest point of the waist';
            if (hintWaistMetric) hintWaistMetric.textContent = 'Measure horizontally at the narrowest point of the waist';
        } else {
            if (hintWaistUs) hintWaistUs.textContent = 'Measure at the navel line horizontally';
            if (hintWaistMetric) hintWaistMetric.textContent = 'Horizontal circumference at navel level';
        }
    }

    document.querySelectorAll('input[name="bf-gender"]').forEach(radio => {
        radio.addEventListener('change', function () {
            updateGenderUI();
            calculateBodyFat();
        });
    });

    // Tab Switching with unit conversion
    function switchTab(targetUnit) {
        if (targetUnit === currentUnit) return;

        if (targetUnit === 'metric') {
            const lbs = parseFloat(weightLbsInput.value) || 0;
            const ft = parseFloat(heightFtInput.value) || 0;
            const inches = parseFloat(heightInInput.value) || 0;
            const neckIn = parseFloat(neckInInput.value) || 0;
            const waistIn = parseFloat(waistInInput.value) || 0;
            const hipIn = parseFloat(hipInInput.value) || 0;

            const totalInches = (ft * 12) + inches;
            const cmHeight = totalInches * 2.54;
            const kg = lbs * 0.45359237;

            if (kg > 0) weightKgInput.value = (Math.round(kg * 10) / 10).toFixed(1);
            if (cmHeight > 0) heightCmInput.value = (Math.round(cmHeight * 10) / 10).toFixed(1);
            if (neckIn > 0) neckCmInput.value = (Math.round(neckIn * 2.54 * 10) / 10).toFixed(1);
            if (waistIn > 0) waistCmInput.value = (Math.round(waistIn * 2.54 * 10) / 10).toFixed(1);
            if (hipIn > 0) hipCmInput.value = (Math.round(hipIn * 2.54 * 10) / 10).toFixed(1);

            tabUs.classList.remove('active');
            tabUs.setAttribute('aria-selected', 'false');
            tabMetric.classList.add('active');
            tabMetric.setAttribute('aria-selected', 'true');

            usContainer.style.display = 'none';
            metricContainer.style.display = 'block';
            currentUnit = 'metric';
        } else {
            const kg = parseFloat(weightKgInput.value) || 0;
            const cmHeight = parseFloat(heightCmInput.value) || 0;
            const neckCm = parseFloat(neckCmInput.value) || 0;
            const waistCm = parseFloat(waistCmInput.value) || 0;
            const hipCm = parseFloat(hipCmInput.value) || 0;

            const lbs = kg * 2.20462262;
            const totalInches = cmHeight / 2.54;
            const ft = Math.floor(totalInches / 12);
            const remainingInches = Math.round(totalInches % 12);

            if (lbs > 0) weightLbsInput.value = (Math.round(lbs * 10) / 10).toFixed(1);
            if (cmHeight > 0) {
                heightFtInput.value = ft;
                heightInInput.value = remainingInches;
            }
            if (neckCm > 0) neckInInput.value = (Math.round((neckCm / 2.54) * 10) / 10).toFixed(1);
            if (waistCm > 0) waistInInput.value = (Math.round((waistCm / 2.54) * 10) / 10).toFixed(1);
            if (hipCm > 0) hipInInput.value = (Math.round((hipCm / 2.54) * 10) / 10).toFixed(1);

            tabMetric.classList.remove('active');
            tabMetric.setAttribute('aria-selected', 'false');
            tabUs.classList.add('active');
            tabUs.setAttribute('aria-selected', 'true');

            metricContainer.style.display = 'none';
            usContainer.style.display = 'block';
            currentUnit = 'us';
        }

        calculateBodyFat();
    }

    if (tabUs && tabMetric) {
        tabUs.addEventListener('click', () => switchTab('us'));
        tabMetric.addEventListener('click', () => switchTab('metric'));
    }

    // Input listeners
    const allInputs = [
        ageInput, weightLbsInput, heightFtInput, heightInInput, neckInInput, waistInInput, hipInInput,
        weightKgInput, heightCmInput, neckCmInput, waistCmInput, hipCmInput
    ];
    allInputs.forEach(inp => {
        if (inp) {
            inp.addEventListener('input', calculateBodyFat);
            inp.addEventListener('change', calculateBodyFat);
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateBodyFat();
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            ageInput.value = 30;
            const maleRadio = document.querySelector('input[name="bf-gender"][value="male"]');
            if (maleRadio) maleRadio.checked = true;

            weightLbsInput.value = 180;
            heightFtInput.value = 5;
            heightInInput.value = 11;
            neckInInput.value = 15;
            waistInInput.value = 34;
            hipInInput.value = 38;

            weightKgInput.value = 82;
            heightCmInput.value = 180;
            neckCmInput.value = 38;
            waistCmInput.value = 86;
            hipCmInput.value = 97;

            updateGenderUI();
            calculateBodyFat();
        });
    }

    function calculateBodyFat() {
        const genderElem = document.querySelector('input[name="bf-gender"]:checked');
        const isFemale = genderElem && genderElem.value === 'female';

        let weightKg = 0;
        let heightCm = 0;
        let neckCm = 0;
        let waistCm = 0;
        let hipCm = 0;

        if (currentUnit === 'us') {
            const lbs = parseFloat(weightLbsInput.value) || 0;
            const ft = parseFloat(heightFtInput.value) || 0;
            const inches = parseFloat(heightInInput.value) || 0;
            const neckIn = parseFloat(neckInInput.value) || 0;
            const waistIn = parseFloat(waistInInput.value) || 0;
            const hipIn = parseFloat(hipInInput.value) || 0;

            weightKg = lbs * 0.45359237;
            heightCm = ((ft * 12) + inches) * 2.54;
            neckCm = neckIn * 2.54;
            waistCm = waistIn * 2.54;
            hipCm = hipIn * 2.54;
        } else {
            weightKg = parseFloat(weightKgInput.value) || 0;
            heightCm = parseFloat(heightCmInput.value) || 0;
            neckCm = parseFloat(neckCmInput.value) || 0;
            waistCm = parseFloat(waistCmInput.value) || 0;
            hipCm = parseFloat(hipCmInput.value) || 0;
        }

        if (weightKg <= 0 || heightCm <= 0 || neckCm <= 0 || waistCm <= 0) {
            resultPanel.style.display = 'none';
            return;
        }

        // U.S. Navy Formula regression
        let bfp = 0;

        if (isFemale) {
            if (waistCm + hipCm <= neckCm) {
                resultPanel.style.display = 'none';
                return;
            }
            // BFP = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
            const logCirc = Math.log10(waistCm + hipCm - neckCm);
            const logHeight = Math.log10(heightCm);
            bfp = (163.205 * logCirc) - (97.684 * logHeight) - 78.387;
        } else {
            if (waistCm <= neckCm) {
                resultPanel.style.display = 'none';
                return;
            }
            // BFP = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
            const logCirc = Math.log10(waistCm - neckCm);
            const logHeight = Math.log10(heightCm);
            bfp = (86.010 * logCirc) - (70.041 * logHeight) + 36.76;
        }

        if (isNaN(bfp) || bfp < 2 || bfp > 65) {
            resultPanel.style.display = 'none';
            return;
        }

        bfp = Math.round(bfp * 10) / 10;
        const fatMassKg = weightKg * (bfp / 100);
        const leanMassKg = Math.max(0, weightKg - fatMassKg);

        const weightLbs = weightKg * 2.20462262;
        const fatMassLbs = fatMassKg * 2.20462262;
        const leanMassLbs = leanMassKg * 2.20462262;

        // BMI Equivalent
        const heightM = heightCm / 100;
        const bmi = weightKg / (heightM * heightM);

        // ACE Categorization
        let category = '';
        let badgeClass = 'badge-normal';

        if (isFemale) {
            if (bfp < 14) { category = 'Essential Fat'; badgeClass = 'badge-underweight'; }
            else if (bfp <= 20.9) { category = 'Athletes'; badgeClass = 'badge-normal'; }
            else if (bfp <= 24.9) { category = 'Fitness'; badgeClass = 'badge-normal'; }
            else if (bfp <= 31.9) { category = 'Average / Acceptable'; badgeClass = 'badge-overweight'; }
            else { category = 'Obese'; badgeClass = 'badge-obese1'; }
        } else {
            if (bfp < 6) { category = 'Essential Fat'; badgeClass = 'badge-underweight'; }
            else if (bfp <= 13.9) { category = 'Athletes'; badgeClass = 'badge-normal'; }
            else if (bfp <= 17.9) { category = 'Fitness'; badgeClass = 'badge-normal'; }
            else if (bfp <= 24.9) { category = 'Average / Acceptable'; badgeClass = 'badge-overweight'; }
            else { category = 'Obese'; badgeClass = 'badge-obese1'; }
        }

        // Target body fat calculation (15% for men, 22% for women)
        const targetBfp = isFemale ? 22.0 : 15.0;
        let fatToLoseKg = 0;
        if (bfp > targetBfp) {
            const desiredWeightKg = leanMassKg / (1 - (targetBfp / 100));
            fatToLoseKg = Math.max(0, weightKg - desiredWeightKg);
        }
        const fatToLoseLbs = fatToLoseKg * 2.20462262;

        // Update UI
        percentageDisplay.textContent = bfp.toFixed(1);
        categoryBadge.textContent = category;
        categoryBadge.className = `result-status-badge ${badgeClass}`;

        const leanPct = (100 - bfp).toFixed(1);
        barLeanLabel.textContent = `${leanMassKg.toFixed(1)} kg (${leanPct}%)`;
        barFatLabel.textContent = `${fatMassKg.toFixed(1)} kg (${bfp.toFixed(1)}%)`;
        barBfLean.style.width = leanPct + '%';
        barBfFat.style.width = bfp.toFixed(1) + '%';

        fatMassDisplay.textContent = `${fatMassKg.toFixed(1)} kg (${fatMassLbs.toFixed(1)} lbs)`;
        leanMassDisplay.textContent = `${leanMassKg.toFixed(1)} kg (${leanMassLbs.toFixed(1)} lbs)`;
        categoryNameDisplay.textContent = category;
        idealTargetDisplay.textContent = isFemale ? '21 – 24% (Women\'s Fitness)' : '14 – 17% (Men\'s Fitness)';

        if (fatToLoseKg > 0) {
            fatToLoseDisplay.textContent = `${fatToLoseKg.toFixed(1)} kg (${fatToLoseLbs.toFixed(1)} lbs)`;
        } else {
            fatToLoseDisplay.textContent = 'Goal Reached! (At or below target)';
        }

        bmiEquivDisplay.textContent = `${bmi.toFixed(1)} kg/m²`;

        resultPanel.style.display = 'block';
    }

    updateGenderUI();
    calculateBodyFat();
});
