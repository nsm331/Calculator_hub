/**
 * CalculatorHub - Blood Alcohol Content (BAC) Calculator Engine
 * Clinical forensic Widmark pharmacokinetics, drink logging, and sobriety timeline modeling.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Subject Parameters
    const genderBtns = document.querySelectorAll('.bac-gender-btn');
    const unitBtns = document.querySelectorAll('.bac-unit-btn');
    const weightInput = document.getElementById('bac-weight-val');
    const weightUnitLabel = document.getElementById('bac-weight-unit');
    const hoursElapsedInput = document.getElementById('bac-hours-val');
    const calcBtn = document.getElementById('bac-calc-btn');

    // Drink Counters
    const beerCountSpan = document.getElementById('bac-beer-count');
    const wineCountSpan = document.getElementById('bac-wine-count');
    const shotCountSpan = document.getElementById('bac-shot-count');

    const beerPlusBtn = document.getElementById('bac-beer-plus');
    const beerMinusBtn = document.getElementById('bac-beer-minus');
    const winePlusBtn = document.getElementById('bac-wine-plus');
    const wineMinusBtn = document.getElementById('bac-wine-minus');
    const shotPlusBtn = document.getElementById('bac-shot-plus');
    const shotMinusBtn = document.getElementById('bac-shot-minus');

    // Custom Drink Inputs
    const customVolInput = document.getElementById('bac-custom-vol');
    const customAbvInput = document.getElementById('bac-custom-abv');
    const customAddBtn = document.getElementById('bac-custom-add');
    const customLogList = document.getElementById('bac-custom-list');

    // Outputs
    const primaryResult = document.getElementById('bac-primary-result');
    const secondaryResult = document.getElementById('bac-secondary-result');
    const legalBadge = document.getElementById('bac-legal-badge');
    const peakBacVal = document.getElementById('bac-peak-val');
    const timeToDriveVal = document.getElementById('bac-time-drive');
    const timeToSoberVal = document.getElementById('bac-time-sober');
    const totalGramsVal = document.getElementById('bac-grams-val');
    const stageDescVal = document.getElementById('bac-stage-desc');

    let currentGender = 'male'; // 'male' (r=0.68) or 'female' (r=0.55)
    let currentUnit = 'imperial'; // 'imperial' (lbs) or 'metric' (kg)
    let drinkCounts = {
        beer: 3,
        wine: 0,
        shots: 0
    };
    let customDrinks = []; // Array of { name, grams }

    // Ethanol grams per standard US drink:
    // Beer: 12 oz * 29.5735 ml/oz * 0.05 * 0.789 g/ml = 13.99g ≈ 14g
    // Wine: 5 oz * 29.5735 ml/oz * 0.12 * 0.789 g/ml = 14.00g
    // Shot: 1.5 oz * 29.5735 ml/oz * 0.40 * 0.789 g/ml = 13.99g
    const GRAMS_PER_STD_DRINK = 14.0;
    const METABOLIC_RATE_BETA = 0.015; // 0.015% BAC per hour

    // Gender Switcher
    genderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentGender = this.dataset.gender;
            genderBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            calculateBac();
        });
    });

    // Unit Switcher
    unitBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const newUnit = this.dataset.unit;
            if (newUnit === currentUnit) return;

            unitBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const currentVal = parseFloat(weightInput.value);
            if (!isNaN(currentVal) && currentVal > 0) {
                if (newUnit === 'metric') {
                    weightInput.value = (currentVal * 0.453592).toFixed(1);
                    weightUnitLabel.textContent = 'kg';
                } else {
                    weightInput.value = (currentVal / 0.453592).toFixed(1);
                    weightUnitLabel.textContent = 'lbs';
                }
            } else {
                weightUnitLabel.textContent = newUnit === 'metric' ? 'kg' : 'lbs';
            }

            currentUnit = newUnit;
            calculateBac();
        });
    });

    // Drink Increments
    function bindCounter(plusBtn, minusBtn, key, countEl) {
        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                drinkCounts[key]++;
                countEl.textContent = drinkCounts[key];
                calculateBac();
            });
        }
        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                if (drinkCounts[key] > 0) {
                    drinkCounts[key]--;
                    countEl.textContent = drinkCounts[key];
                    calculateBac();
                }
            });
        }
    }

    bindCounter(beerPlusBtn, beerMinusBtn, 'beer', beerCountSpan);
    bindCounter(winePlusBtn, wineMinusBtn, 'wine', wineCountSpan);
    bindCounter(shotPlusBtn, shotMinusBtn, 'shots', shotCountSpan);

    // Custom Drink Addition
    if (customAddBtn && customVolInput && customAbvInput) {
        customAddBtn.addEventListener('click', () => {
            const volOz = parseFloat(customVolInput.value);
            const abvPct = parseFloat(customAbvInput.value);
            if (isNaN(volOz) || volOz <= 0 || isNaN(abvPct) || abvPct <= 0) return;

            // Volume in oz to grams of ethanol
            // Vol(oz) * 29.5735 ml * (abv / 100) * 0.789 g/ml (density of ethanol)
            const grams = volOz * 29.5735 * (abvPct / 100) * 0.789;
            customDrinks.push({
                name: `${volOz} oz @ ${abvPct}% ABV`,
                grams: grams
            });

            customVolInput.value = '';
            customAbvInput.value = '';
            renderCustomDrinks();
            calculateBac();
        });
    }

    function renderCustomDrinks() {
        if (!customLogList) return;
        if (customDrinks.length === 0) {
            customLogList.innerHTML = '';
            return;
        }

        customLogList.innerHTML = customDrinks.map((d, idx) => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--color-bg-card-alt); border: 1px solid var(--color-border-light); border-radius: 4px; padding: 4px 10px; margin-top: 6px; font-size: 0.82rem;">
                <span>${d.name} (<strong>${d.grams.toFixed(1)}g</strong> ethanol)</span>
                <button type="button" class="remove-custom-btn" data-idx="${idx}" style="background: none; border: none; color: #ef4444; font-weight: 700; cursor: pointer;">&times;</button>
            </div>
        `).join('');

        const removeBtns = customLogList.querySelectorAll('.remove-custom-btn');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.dataset.idx, 10);
                customDrinks.splice(idx, 1);
                renderCustomDrinks();
                calculateBac();
            });
        });
    }

    [weightInput, hoursElapsedInput].forEach(el => {
        if (el) {
            el.addEventListener('input', calculateBac);
            el.addEventListener('change', calculateBac);
        }
    });

    if (calcBtn) {
        calcBtn.addEventListener('click', calculateBac);
    }

    function calculateBac() {
        const weightRaw = parseFloat(weightInput.value);
        const hoursElapsed = parseFloat(hoursElapsedInput.value);

        if (isNaN(weightRaw) || weightRaw <= 0 || isNaN(hoursElapsed) || hoursElapsed < 0) {
            showError('Please enter a valid body weight and hours elapsed.');
            return;
        }

        // Weight in grams
        const weightInGrams = currentUnit === 'metric' ? weightRaw * 1000 : weightRaw * 453.59237;

        // Widmark distribution factor r
        const r = currentGender === 'male' ? 0.68 : 0.55;

        // Total ethanol ingested (A) in grams
        let totalGrams = (drinkCounts.beer + drinkCounts.wine + drinkCounts.shots) * GRAMS_PER_STD_DRINK;
        for (let cd of customDrinks) {
            totalGrams += cd.grams;
        }

        // Peak BAC (prior to metabolism) = (A / (W * r)) * 100
        const peakBac = (totalGrams / (weightInGrams * r)) * 100;

        // Current BAC after metabolic decay = peakBac - (beta * hoursElapsed)
        const currentBac = Math.max(0, peakBac - (METABOLIC_RATE_BETA * hoursElapsed));

        // Time until legal to drive (< 0.08%)
        let hoursToLegal = 0;
        if (currentBac > 0.08) {
            hoursToLegal = (currentBac - 0.08) / METABOLIC_RATE_BETA;
        }

        // Time until fully sober (BAC = 0.000%)
        let hoursToSober = 0;
        if (currentBac > 0) {
            hoursToSober = currentBac / METABOLIC_RATE_BETA;
        }

        // Render Primary Results
        primaryResult.textContent = `${currentBac.toFixed(3)}%`;

        // Legal & Safety Status Badge
        updateStatusBadge(currentBac);

        // Subtitles and metrics
        secondaryResult.innerHTML = `Peak BAC was <strong>${peakBac.toFixed(3)}%</strong>. Consumed <strong>${totalGrams.toFixed(1)}g</strong> pure ethanol over <strong>${hoursElapsed} hours</strong>.`;

        if (peakBacVal) peakBacVal.textContent = `${peakBac.toFixed(3)}%`;
        if (totalGramsVal) totalGramsVal.textContent = `${totalGrams.toFixed(1)} g`;
        if (timeToDriveVal) {
            timeToDriveVal.textContent = hoursToLegal > 0 ? formatHours(hoursToLegal) : 'Legally Safe (Under 0.08%)';
            timeToDriveVal.style.color = hoursToLegal > 0 ? '#ef4444' : 'var(--color-accent-emerald)';
        }
        if (timeToSoberVal) {
            timeToSoberVal.textContent = hoursToSober > 0 ? formatHours(hoursToSober) : '0 Hours (Fully Sober)';
            timeToSoberVal.style.color = hoursToSober > 0 ? 'var(--color-accent-amber)' : 'var(--color-accent-emerald)';
        }

        if (stageDescVal) {
            stageDescVal.textContent = getImpairmentDescription(currentBac);
        }
    }

    function updateStatusBadge(bac) {
        if (!legalBadge) return;

        if (bac === 0) {
            legalBadge.innerHTML = '&#10003; Completely Sober (0.000%)';
            legalBadge.style.background = 'rgba(16, 185, 129, 0.15)';
            legalBadge.style.color = 'var(--color-accent-emerald)';
        } else if (bac < 0.05) {
            legalBadge.innerHTML = '&#9432; Under Legal Limit (Mild Impairment)';
            legalBadge.style.background = 'rgba(59, 130, 246, 0.15)';
            legalBadge.style.color = 'var(--color-accent-blue)';
        } else if (bac < 0.08) {
            legalBadge.innerHTML = '&#9888; Caution: Reduced Driving Reflexes';
            legalBadge.style.background = 'rgba(245, 158, 11, 0.15)';
            legalBadge.style.color = 'var(--color-accent-amber)';
        } else if (bac < 0.15) {
            legalBadge.innerHTML = '&#9888; Legally Intoxicated (Exceeds 0.08% Limit)';
            legalBadge.style.background = 'rgba(239, 68, 68, 0.15)';
            legalBadge.style.color = '#ef4444';
        } else {
            legalBadge.innerHTML = '&#9760; Severe Intoxication &amp; Health Risk';
            legalBadge.style.background = 'rgba(220, 38, 38, 0.25)';
            legalBadge.style.color = '#dc2626';
        }
    }

    function getImpairmentDescription(bac) {
        if (bac === 0) return 'Normal physiological function; zero ethanol in bloodstream.';
        if (bac < 0.04) return 'Mild euphoria, relaxation, slight body warmth, minor speech chattiness.';
        if (bac < 0.08) return 'Lowered alertness, impaired judgment, reduced peripheral perception, delayed braking response.';
        if (bac < 0.15) return 'Motor control loss, balance instability, slurred speech, marked visual blurring, legal intoxication.';
        if (bac < 0.25) return 'Severe sensory motor ataxia, disorientation, nausea, blackout memory risk.';
        return 'Life-threatening intoxication: risk of unconsciousness, respiratory depression, and alcohol poisoning.';
    }

    function formatHours(hrs) {
        const wholeHours = Math.floor(hrs);
        const mins = Math.round((hrs - wholeHours) * 60);
        if (wholeHours === 0) return `${mins} min`;
        if (mins === 0) return `${wholeHours} hr`;
        return `${wholeHours} hr ${mins} min`;
    }

    function showError(msg) {
        primaryResult.textContent = '--';
        secondaryResult.textContent = msg || 'Please verify weight and hours elapsed.';
    }

    // Initial Execution
    calculateBac();
});
