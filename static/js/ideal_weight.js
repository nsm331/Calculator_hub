/**
 * Ideal Body Weight (IBW) Calculator Engine
 * Calculates Devine, Robinson, Miller, Hamwi, and WHO healthy BMI intervals.
 */

(function () {
    'use strict';

    // Unit Toggle
    let isMetric = false;

    const unitUsBtn = document.getElementById('ibw-unit-us');
    const unitMetricBtn = document.getElementById('ibw-unit-metric');
    const heightUsContainer = document.getElementById('ibw-height-us-container');
    const heightMetricContainer = document.getElementById('ibw-height-metric-container');
    const weightAddon = document.getElementById('ibw-weight-addon');

    // Inputs
    const heightFtInput = document.getElementById('ibw-height-ft');
    const heightInInput = document.getElementById('ibw-height-in');
    const heightCmInput = document.getElementById('ibw-height-cm');
    const weightInput = document.getElementById('ibw-current-weight');
    const frameSizeSelect = document.getElementById('ibw-frame-size');
    const genderInputs = document.querySelectorAll('input[name="ibw-gender"]');

    const calculateBtn = document.getElementById('ibw-calculate-btn');
    const resetBtn = document.getElementById('ibw-reset-btn');

    // Output Elements
    const rangeHeroEl = document.getElementById('ibw-range-hero');
    const medianHeroEl = document.getElementById('ibw-median-hero');
    const deltaCardEl = document.getElementById('ibw-delta-card');
    const deltaStatusEl = document.getElementById('ibw-delta-status');
    const deltaValEl = document.getElementById('ibw-delta-val');
    const whoRangeEl = document.getElementById('ibw-who-range');
    const whoHeightTextEl = document.getElementById('ibw-who-height-text');

    const devineValEl = document.getElementById('ibw-devine-val');
    const robinsonValEl = document.getElementById('ibw-robinson-val');
    const millerValEl = document.getElementById('ibw-miller-val');
    const hamwiValEl = document.getElementById('ibw-hamwi-val');

    const tblDevineUs = document.getElementById('tbl-devine-us');
    const tblDevineMetric = document.getElementById('tbl-devine-metric');
    const tblRobinsonUs = document.getElementById('tbl-robinson-us');
    const tblRobinsonMetric = document.getElementById('tbl-robinson-metric');
    const tblMillerUs = document.getElementById('tbl-miller-us');
    const tblMillerMetric = document.getElementById('tbl-miller-metric');
    const tblHamwiUs = document.getElementById('tbl-hamwi-us');
    const tblHamwiMetric = document.getElementById('tbl-hamwi-metric');
    const tblWhoUs = document.getElementById('tbl-who-us');
    const tblWhoMetric = document.getElementById('tbl-who-metric');

    const KG_TO_LBS = 2.20462262;
    const LBS_TO_KG = 0.45359237;

    function getSelectedGender() {
        for (let i = 0; i < genderInputs.length; i++) {
            if (genderInputs[i].checked) {
                return genderInputs[i].value;
            }
        }
        return 'male';
    }

    function getHeightInches() {
        if (isMetric) {
            const cm = parseFloat(heightCmInput.value) || 178;
            return cm / 2.54;
        } else {
            const ft = parseFloat(heightFtInput.value) || 0;
            const inches = parseFloat(heightInInput.value) || 0;
            return (ft * 12) + inches;
        }
    }

    function calculateIBW() {
        const gender = getSelectedGender();
        const totalInches = getHeightInches();
        const totalCm = totalInches * 2.54;
        const heightMeters = totalCm / 100;
        const deltaInches = totalInches - 60; // inches over 5 feet (can be negative if < 5ft)
        const frameSize = frameSizeSelect.value;

        if (totalInches <= 0) return;

        // 1. Devine Formula (kg)
        let devineKg = 0;
        if (gender === 'male') {
            devineKg = 50.0 + (2.3 * deltaInches);
        } else {
            devineKg = 45.5 + (2.3 * deltaInches);
        }

        // 2. Robinson Formula (kg)
        let robinsonKg = 0;
        if (gender === 'male') {
            robinsonKg = 52.0 + (1.9 * deltaInches);
        } else {
            robinsonKg = 49.0 + (1.7 * deltaInches);
        }

        // 3. Miller Formula (kg)
        let millerKg = 0;
        if (gender === 'male') {
            millerKg = 56.2 + (1.41 * deltaInches);
        } else {
            millerKg = 53.1 + (1.36 * deltaInches);
        }

        // 4. Hamwi Formula (lbs)
        let hamwiLbs = 0;
        if (gender === 'male') {
            hamwiLbs = 106 + (6 * deltaInches);
        } else {
            hamwiLbs = 100 + (5 * deltaInches);
        }

        // Apply Frame Size Adjustment to Hamwi
        if (frameSize === 'small') {
            hamwiLbs *= 0.90;
        } else if (frameSize === 'large') {
            hamwiLbs *= 1.10;
        }
        const hamwiKg = hamwiLbs * LBS_TO_KG;

        // 5. WHO BMI (18.5 - 24.9 kg/m^2)
        const whoMinKg = 18.5 * (heightMeters * heightMeters);
        const whoMaxKg = 24.9 * (heightMeters * heightMeters);

        // Convert all formula results to lbs
        const devineLbs = devineKg * KG_TO_LBS;
        const robinsonLbs = robinsonKg * KG_TO_LBS;
        const millerLbs = millerKg * KG_TO_LBS;

        // Formula consensus average
        const allKg = [devineKg, robinsonKg, millerKg, hamwiKg];
        const minFormulaKg = Math.min(...allKg);
        const maxFormulaKg = Math.max(...allKg);
        const avgFormulaKg = allKg.reduce((a, b) => a + b, 0) / allKg.length;
        const avgFormulaLbs = avgFormulaKg * KG_TO_LBS;

        // Display height text
        const ftDisplay = Math.floor(totalInches / 12);
        const inDisplay = Math.round(totalInches % 12);
        whoHeightTextEl.textContent = isMetric ? `${Math.round(totalCm)} cm` : `${ftDisplay}'${inDisplay}"`;

        // Hero Banner Text
        if (isMetric) {
            rangeHeroEl.textContent = `${minFormulaKg.toFixed(1)} – ${maxFormulaKg.toFixed(1)} kg`;
            medianHeroEl.innerHTML = `Clinical Formula Average: <strong>${avgFormulaKg.toFixed(1)} kg (${avgFormulaLbs.toFixed(1)} lbs)</strong>`;
        } else {
            rangeHeroEl.textContent = `${(minFormulaKg * KG_TO_LBS).toFixed(1)} – ${(maxFormulaKg * KG_TO_LBS).toFixed(1)} lbs`;
            medianHeroEl.innerHTML = `Clinical Formula Average: <strong>${avgFormulaLbs.toFixed(1)} lbs (${avgFormulaKg.toFixed(1)} kg)</strong>`;
        }

        // WHO Range Banner
        if (isMetric) {
            whoRangeEl.textContent = `${whoMinKg.toFixed(1)} – ${whoMaxKg.toFixed(1)} kg`;
        } else {
            whoRangeEl.textContent = `${(whoMinKg * KG_TO_LBS).toFixed(1)} – ${(whoMaxKg * KG_TO_LBS).toFixed(1)} lbs`;
        }

        // Formula Breakdown Cards
        if (isMetric) {
            devineValEl.textContent = `${devineKg.toFixed(1)} kg`;
            robinsonValEl.textContent = `${robinsonKg.toFixed(1)} kg`;
            millerValEl.textContent = `${millerKg.toFixed(1)} kg`;
            hamwiValEl.textContent = `${hamwiKg.toFixed(1)} kg`;
        } else {
            devineValEl.textContent = `${devineLbs.toFixed(1)} lbs`;
            robinsonValEl.textContent = `${robinsonLbs.toFixed(1)} lbs`;
            millerValEl.textContent = `${millerLbs.toFixed(1)} lbs`;
            hamwiValEl.textContent = `${hamwiLbs.toFixed(1)} lbs`;
        }

        // Table Rows
        tblDevineUs.textContent = `${devineLbs.toFixed(1)} lbs`;
        tblDevineMetric.textContent = `${devineKg.toFixed(1)} kg`;
        tblRobinsonUs.textContent = `${robinsonLbs.toFixed(1)} lbs`;
        tblRobinsonMetric.textContent = `${robinsonKg.toFixed(1)} kg`;
        tblMillerUs.textContent = `${millerLbs.toFixed(1)} lbs`;
        tblMillerMetric.textContent = `${millerKg.toFixed(1)} kg`;
        tblHamwiUs.textContent = `${hamwiLbs.toFixed(1)} lbs`;
        tblHamwiMetric.textContent = `${hamwiKg.toFixed(1)} kg`;
        tblWhoUs.textContent = `${(whoMinKg * KG_TO_LBS).toFixed(1)} – ${(whoMaxKg * KG_TO_LBS).toFixed(1)} lbs`;
        tblWhoMetric.textContent = `${whoMinKg.toFixed(1)} – ${whoMaxKg.toFixed(1)} kg`;

        // Current Weight Delta Analysis
        const currentWeightRaw = parseFloat(weightInput.value);
        if (!isNaN(currentWeightRaw) && currentWeightRaw > 0) {
            deltaCardEl.style.display = 'flex';
            let curWeightKg = isMetric ? currentWeightRaw : currentWeightRaw * LBS_TO_KG;
            let curWeightLbs = isMetric ? currentWeightRaw * KG_TO_LBS : currentWeightRaw;

            let deltaKg = curWeightKg - avgFormulaKg;
            let deltaLbs = curWeightLbs - avgFormulaLbs;

            let deltaDisplay = isMetric ? `${deltaKg > 0 ? '+' : ''}${deltaKg.toFixed(1)} kg` : `${deltaLbs > 0 ? '+' : ''}${deltaLbs.toFixed(1)} lbs`;
            deltaValEl.textContent = deltaDisplay;

            if (Math.abs(deltaKg) < 2.5) {
                deltaStatusEl.textContent = `${isMetric ? curWeightKg.toFixed(1) + ' kg' : curWeightLbs.toFixed(1) + ' lbs'} — Ideal Target Range`;
                deltaStatusEl.style.color = '#10b981';
                deltaValEl.style.color = '#10b981';
            } else if (deltaKg > 0) {
                deltaStatusEl.textContent = `${isMetric ? curWeightKg.toFixed(1) + ' kg' : curWeightLbs.toFixed(1) + ' lbs'} — Above Median Target`;
                deltaStatusEl.style.color = '#f59e0b';
                deltaValEl.style.color = '#f59e0b';
            } else {
                deltaStatusEl.textContent = `${isMetric ? curWeightKg.toFixed(1) + ' kg' : curWeightLbs.toFixed(1) + ' lbs'} — Below Median Target`;
                deltaStatusEl.style.color = '#38bdf8';
                deltaValEl.style.color = '#38bdf8';
            }
        } else {
            deltaCardEl.style.display = 'none';
        }
    }

    // Toggle Unit Mode
    function setUnitMode(metric) {
        if (isMetric === metric) return;
        isMetric = metric;

        if (isMetric) {
            unitMetricBtn.classList.add('active');
            unitUsBtn.classList.remove('active');
            unitMetricBtn.setAttribute('aria-selected', 'true');
            unitUsBtn.setAttribute('aria-selected', 'false');

            heightUsContainer.style.display = 'none';
            heightMetricContainer.style.display = 'block';

            // Convert height to cm
            const ft = parseFloat(heightFtInput.value) || 5;
            const inches = parseFloat(heightInInput.value) || 10;
            const cm = Math.round(((ft * 12) + inches) * 2.54);
            heightCmInput.value = cm;

            // Convert weight to kg
            const curLbs = parseFloat(weightInput.value);
            if (!isNaN(curLbs) && curLbs > 0) {
                weightInput.value = (curLbs * LBS_TO_KG).toFixed(1);
            }
            weightAddon.textContent = 'kg';
        } else {
            unitUsBtn.classList.add('active');
            unitMetricBtn.classList.remove('active');
            unitUsBtn.setAttribute('aria-selected', 'true');
            unitMetricBtn.setAttribute('aria-selected', 'false');

            heightMetricContainer.style.display = 'none';
            heightUsContainer.style.display = 'flex';

            // Convert height to ft/in
            const cm = parseFloat(heightCmInput.value) || 178;
            const totalInches = cm / 2.54;
            const ft = Math.floor(totalInches / 12);
            const inRemaining = Math.round(totalInches % 12);
            heightFtInput.value = ft;
            heightInInput.value = inRemaining;

            // Convert weight to lbs
            const curKg = parseFloat(weightInput.value);
            if (!isNaN(curKg) && curKg > 0) {
                weightInput.value = (curKg * KG_TO_LBS).toFixed(1);
            }
            weightAddon.textContent = 'lbs';
        }

        calculateIBW();
    }

    if (unitUsBtn && unitMetricBtn) {
        unitUsBtn.addEventListener('click', () => setUnitMode(false));
        unitMetricBtn.addEventListener('click', () => setUnitMode(true));
    }

    // Event Listeners for Reactive Calculation
    const allInputs = [
        heightFtInput, heightInInput, heightCmInput,
        weightInput, frameSizeSelect
    ];

    allInputs.forEach(function (el) {
        if (el) {
            el.addEventListener('input', calculateIBW);
            el.addEventListener('change', calculateIBW);
        }
    });

    genderInputs.forEach(function (radio) {
        radio.addEventListener('change', calculateIBW);
    });

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateIBW);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            if (isMetric) {
                heightCmInput.value = '178';
                weightInput.value = '79.4';
            } else {
                heightFtInput.value = '5';
                heightInInput.value = '10';
                weightInput.value = '175';
            }
            frameSizeSelect.value = 'medium';
            genderInputs[0].checked = true;
            calculateIBW();
        });
    }

    // Initial Calculation
    calculateIBW();
})();
