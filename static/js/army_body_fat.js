/**
 * CalculatorHub - US Army Body Fat Calculator Engine
 * Official AR 600-9 Department of Defense tape test anthropometric algorithm.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Unit & Gender Toggles
    const genderBtns = document.querySelectorAll('.army-gender-btn');
    const unitBtns = document.querySelectorAll('.army-unit-btn');
    const hipGroup = document.getElementById('army-hip-group');

    // Inputs
    const ageInput = document.getElementById('army-age');
    const heightInput = document.getElementById('army-height');
    const neckInput = document.getElementById('army-neck');
    const waistInput = document.getElementById('army-waist');
    const hipInput = document.getElementById('army-hip');
    const weightInput = document.getElementById('army-weight');
    const calcBtn = document.getElementById('army-calc-btn');

    // Input Labels for Units
    const heightUnitLabel = document.getElementById('army-height-unit');
    const neckUnitLabel = document.getElementById('army-neck-unit');
    const waistUnitLabel = document.getElementById('army-waist-unit');
    const hipUnitLabel = document.getElementById('army-hip-unit');
    const weightUnitLabel = document.getElementById('army-weight-unit');

    // Outputs
    const primaryResult = document.getElementById('army-primary-result');
    const secondaryResult = document.getElementById('army-secondary-result');
    const statusBadge = document.getElementById('army-status-badge');
    const maxAllowedVal = document.getElementById('army-max-allowed');
    const fatMassVal = document.getElementById('army-fat-mass');
    const leanMassVal = document.getElementById('army-lean-mass');
    const deltaStandardVal = document.getElementById('army-delta-standard');
    const bodyFatCategoryVal = document.getElementById('army-category');

    let currentGender = 'male'; // 'male' or 'female'
    let currentUnit = 'imperial'; // 'imperial' (inches, lbs) or 'metric' (cm, kg)

    // Standard Maximum Allowed Body Fat by Age (AR 600-9)
    const ARMY_STANDARDS = {
        male: [
            { minAge: 17, maxAge: 20, maxBf: 20.0 },
            { minAge: 21, maxAge: 27, maxBf: 22.0 },
            { minAge: 28, maxAge: 39, maxBf: 24.0 },
            { minAge: 40, maxAge: 999, maxBf: 26.0 }
        ],
        female: [
            { minAge: 17, maxAge: 20, maxBf: 30.0 },
            { minAge: 21, maxAge: 27, maxBf: 32.0 },
            { minAge: 28, maxAge: 39, maxBf: 34.0 },
            { minAge: 40, maxAge: 999, maxBf: 36.0 }
        ]
    };

    // Gender Switcher
    genderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentGender = this.dataset.gender;
            genderBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            if (currentGender === 'female') {
                hipGroup.style.display = 'block';
            } else {
                hipGroup.style.display = 'none';
            }
            calculateArmyBodyFat();
        });
    });

    // Unit Switcher
    unitBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const newUnit = this.dataset.unit;
            if (newUnit === currentUnit) return;

            unitBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Convert values between units
            if (newUnit === 'metric') {
                // Imperial to Metric (in -> cm, lb -> kg)
                if (heightInput.value) heightInput.value = (parseFloat(heightInput.value) * 2.54).toFixed(1);
                if (neckInput.value) neckInput.value = (parseFloat(neckInput.value) * 2.54).toFixed(1);
                if (waistInput.value) waistInput.value = (parseFloat(waistInput.value) * 2.54).toFixed(1);
                if (hipInput.value) hipInput.value = (parseFloat(hipInput.value) * 2.54).toFixed(1);
                if (weightInput.value) weightInput.value = (parseFloat(weightInput.value) * 0.453592).toFixed(1);

                heightUnitLabel.textContent = 'cm';
                neckUnitLabel.textContent = 'cm';
                waistUnitLabel.textContent = 'cm';
                hipUnitLabel.textContent = 'cm';
                weightUnitLabel.textContent = 'kg';
            } else {
                // Metric to Imperial (cm -> in, kg -> lb)
                if (heightInput.value) heightInput.value = (parseFloat(heightInput.value) / 2.54).toFixed(1);
                if (neckInput.value) neckInput.value = (parseFloat(neckInput.value) / 2.54).toFixed(1);
                if (waistInput.value) waistInput.value = (parseFloat(waistInput.value) / 2.54).toFixed(1);
                if (hipInput.value) hipInput.value = (parseFloat(hipInput.value) / 2.54).toFixed(1);
                if (weightInput.value) weightInput.value = (parseFloat(weightInput.value) / 0.453592).toFixed(1);

                heightUnitLabel.textContent = 'in';
                neckUnitLabel.textContent = 'in';
                waistUnitLabel.textContent = 'in';
                hipUnitLabel.textContent = 'in';
                weightUnitLabel.textContent = 'lbs';
            }

            currentUnit = newUnit;
            calculateArmyBodyFat();
        });
    });

    // Real-time calculation listeners
    [ageInput, heightInput, neckInput, waistInput, hipInput, weightInput].forEach(el => {
        if (el) {
            el.addEventListener('input', calculateArmyBodyFat);
            el.addEventListener('change', calculateArmyBodyFat);
        }
    });

    if (calcBtn) {
        calcBtn.addEventListener('click', calculateArmyBodyFat);
    }

    function calculateArmyBodyFat() {
        const age = parseInt(ageInput.value, 10);
        let height = parseFloat(heightInput.value);
        let neck = parseFloat(neckInput.value);
        let waist = parseFloat(waistInput.value);
        let hip = parseFloat(hipInput.value);
        let weight = parseFloat(weightInput.value);

        if (isNaN(age) || age < 17 || isNaN(height) || height <= 0 || isNaN(neck) || neck <= 0 || isNaN(waist) || waist <= 0) {
            showError('Please enter valid anthropometric measurements.');
            return;
        }

        // Convert measurements to inches if metric
        let hInches = currentUnit === 'metric' ? height / 2.54 : height;
        let neckInches = currentUnit === 'metric' ? neck / 2.54 : neck;
        let waistInches = currentUnit === 'metric' ? waist / 2.54 : waist;
        let hipInches = currentUnit === 'metric' ? (hip / 2.54) : hip;

        let bodyFat = 0;

        if (currentGender === 'male') {
            if (waistInches <= neckInches) {
                showError('Waist circumference must be strictly greater than neck circumference.');
                return;
            }
            bodyFat = 86.010 * Math.log10(waistInches - neckInches) - 70.041 * Math.log10(hInches) + 36.76;
        } else {
            if (isNaN(hip) || hip <= 0) {
                showError('Hip circumference is mandatory for female assessment.');
                return;
            }
            if ((waistInches + hipInches) <= neckInches) {
                showError('Combined waist and hip must be strictly greater than neck circumference.');
                return;
            }
            bodyFat = 163.205 * Math.log10(waistInches + hipInches - neckInches) - 97.684 * Math.log10(hInches) - 78.387;
        }

        bodyFat = Math.max(2.0, Math.min(65.0, bodyFat));

        // Find Maximum Allowed for Age Bracket
        const brackets = ARMY_STANDARDS[currentGender];
        let maxAllowed = 26.0;
        for (let b of brackets) {
            if (age >= b.minAge && age <= b.maxAge) {
                maxAllowed = b.maxBf;
                break;
            }
        }

        const isCompliant = bodyFat <= maxAllowed;
        const delta = bodyFat - maxAllowed;

        // Render Primary Results
        primaryResult.textContent = `${bodyFat.toFixed(1)}%`;

        if (isCompliant) {
            statusBadge.className = 'army-badge pass-badge';
            statusBadge.innerHTML = '&#10003; Meets AR 600-9 Standard';
            statusBadge.style.background = 'rgba(16, 185, 129, 0.15)';
            statusBadge.style.color = 'var(--color-accent-emerald)';
            secondaryResult.innerHTML = `Compliant: <strong>${Math.abs(delta).toFixed(1)}% below</strong> the regulatory ceiling of <strong>${maxAllowed.toFixed(1)}%</strong> for age ${age}.`;
        } else {
            statusBadge.className = 'army-badge fail-badge';
            statusBadge.innerHTML = '&#9888; Exceeds AR 600-9 Standard';
            statusBadge.style.background = 'rgba(239, 68, 68, 0.15)';
            statusBadge.style.color = '#ef4444';
            secondaryResult.innerHTML = `Non-compliant: <strong>+${delta.toFixed(1)}% above</strong> the regulatory maximum of <strong>${maxAllowed.toFixed(1)}%</strong> for age ${age}.`;
        }

        // Analytical Cards
        if (maxAllowedVal) maxAllowedVal.textContent = `${maxAllowed.toFixed(1)}%`;

        if (deltaStandardVal) {
            if (isCompliant) {
                deltaStandardVal.textContent = `-${Math.abs(delta).toFixed(1)}%`;
                deltaStandardVal.style.color = 'var(--color-accent-emerald)';
            } else {
                deltaStandardVal.textContent = `+${delta.toFixed(1)}%`;
                deltaStandardVal.style.color = '#ef4444';
            }
        }

        // Fat Mass & Lean Mass
        if (weight && !isNaN(weight) && weight > 0) {
            const fatMass = weight * (bodyFat / 100);
            const leanMass = weight - fatMass;
            const wUnit = currentUnit === 'metric' ? 'kg' : 'lbs';

            if (fatMassVal) fatMassVal.textContent = `${fatMass.toFixed(1)} ${wUnit}`;
            if (leanMassVal) leanMassVal.textContent = `${leanMass.toFixed(1)} ${wUnit}`;
        } else {
            if (fatMassVal) fatMassVal.textContent = '--';
            if (leanMassVal) leanMassVal.textContent = '--';
        }

        // Body Composition Category
        if (bodyFatCategoryVal) {
            let cat = '';
            if (currentGender === 'male') {
                if (bodyFat < 6) cat = 'Essential Fat';
                else if (bodyFat <= 13) cat = 'Athletic / Tactical';
                else if (bodyFat <= 17) cat = 'Fit / Operational';
                else if (bodyFat <= 24) cat = 'Moderate / Acceptable';
                else cat = 'Overweight / At Risk';
            } else {
                if (bodyFat < 14) cat = 'Essential Fat';
                else if (bodyFat <= 20) cat = 'Athletic / Tactical';
                else if (bodyFat <= 24) cat = 'Fit / Operational';
                else if (bodyFat <= 31) cat = 'Moderate / Acceptable';
                else cat = 'Overweight / At Risk';
            }
            bodyFatCategoryVal.textContent = cat;
        }
    }

    function showError(msg) {
        primaryResult.textContent = '--';
        secondaryResult.textContent = msg || 'Please verify physical measurements.';
        statusBadge.className = 'army-badge';
        statusBadge.textContent = 'Awaiting Valid Input';
        statusBadge.style.background = 'rgba(255, 255, 255, 0.1)';
        statusBadge.style.color = 'var(--color-text-muted)';
    }

    // Initial Execution
    calculateArmyBodyFat();
});
