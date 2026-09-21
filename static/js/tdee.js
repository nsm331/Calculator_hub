/**
 * CalculatorHub - Total Daily Energy Expenditure (TDEE) Calculator Engine
 * Bioenergetic human metabolism solver: Mifflin-St Jeor, Katch-McArdle, Harris-Benedict,
 * 4-component thermogenesis partitioning, and caloric deficit/surplus macros.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inputs & Switchers
    const genderBtns = document.querySelectorAll('.tdee-gender-btn');
    const unitBtns = document.querySelectorAll('.tdee-unit-btn');
    const formulaSelect = document.getElementById('tdee-formula-select');

    const ageInput = document.getElementById('tdee-age-val');
    const weightInput = document.getElementById('tdee-weight-val');
    const weightUnitLabel = document.getElementById('tdee-weight-unit');

    const heightMetricGroup = document.getElementById('tdee-height-metric-group');
    const heightImperialGroup = document.getElementById('tdee-height-imperial-group');
    const heightCmInput = document.getElementById('tdee-height-cm');
    const heightFtInput = document.getElementById('tdee-height-ft');
    const heightInInput = document.getElementById('tdee-height-in');

    const bodyFatGroup = document.getElementById('tdee-fat-group');
    const bodyFatInput = document.getElementById('tdee-fat-val');
    const activitySelect = document.getElementById('tdee-activity-select');
    const calcBtn = document.getElementById('tdee-calc-btn');

    // Outputs - Hero
    const primaryResult = document.getElementById('tdee-primary-result');
    const secondaryResult = document.getElementById('tdee-secondary-result');
    const bmrVal = document.getElementById('tdee-bmr-val');
    const palBadge = document.getElementById('tdee-pal-badge');

    // Component Breakdown
    const bmrCompVal = document.getElementById('tdee-comp-bmr');
    const neatCompVal = document.getElementById('tdee-comp-neat');
    const tefCompVal = document.getElementById('tdee-comp-tef');
    const eatCompVal = document.getElementById('tdee-comp-eat');

    // Caloric Goals
    const goalMaintainVal = document.getElementById('tdee-goal-maintain');
    const goalMildLossVal = document.getElementById('tdee-goal-mild-loss');
    const goalStdLossVal = document.getElementById('tdee-goal-std-loss');
    const goalFastLossVal = document.getElementById('tdee-goal-fast-loss');
    const goalLeanBulkVal = document.getElementById('tdee-goal-bulk');

    // Macro Table Body
    const macroTbody = document.getElementById('tdee-macro-tbody');

    let currentGender = 'male'; // 'male' or 'female'
    let currentUnit = 'imperial'; // 'imperial' or 'metric'

    // Gender Switcher
    genderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentGender = this.dataset.gender;
            genderBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            calculateTdee();
        });
    });

    // Unit Switcher
    unitBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const newUnit = this.dataset.unit;
            if (newUnit === currentUnit) return;

            unitBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const currentWeight = parseFloat(weightInput.value);
            if (!isNaN(currentWeight) && currentWeight > 0) {
                if (newUnit === 'metric') {
                    weightInput.value = (currentWeight * 0.453592).toFixed(1);
                    weightUnitLabel.textContent = 'kg';
                } else {
                    weightInput.value = (currentWeight / 0.453592).toFixed(1);
                    weightUnitLabel.textContent = 'lbs';
                }
            } else {
                weightUnitLabel.textContent = newUnit === 'metric' ? 'kg' : 'lbs';
            }

            if (newUnit === 'metric') {
                const ft = parseFloat(heightFtInput.value) || 0;
                const inches = parseFloat(heightInInput.value) || 0;
                const totalIn = (ft * 12) + inches;
                if (totalIn > 0) {
                    heightCmInput.value = Math.round(totalIn * 2.54);
                }
                heightMetricGroup.style.display = 'block';
                heightImperialGroup.style.display = 'none';
            } else {
                const cm = parseFloat(heightCmInput.value) || 0;
                if (cm > 0) {
                    const totalIn = cm / 2.54;
                    heightFtInput.value = Math.floor(totalIn / 12);
                    heightInInput.value = Math.round(totalIn % 12);
                }
                heightMetricGroup.style.display = 'none';
                heightImperialGroup.style.display = 'grid';
            }

            currentUnit = newUnit;
            calculateTdee();
        });
    });

    if (formulaSelect) {
        formulaSelect.addEventListener('change', function() {
            if (formulaSelect.value === 'katch') {
                bodyFatGroup.style.display = 'block';
            } else {
                bodyFatGroup.style.display = 'block'; // Keep visible for completeness
            }
            calculateTdee();
        });
    }

    const allInputs = [
        ageInput, weightInput, heightCmInput, heightFtInput, heightInInput,
        bodyFatInput, activitySelect
    ];

    allInputs.forEach(el => {
        if (el) {
            el.addEventListener('input', calculateTdee);
            el.addEventListener('change', calculateTdee);
        }
    });

    if (calcBtn) {
        calcBtn.addEventListener('click', calculateTdee);
    }

    function calculateTdee() {
        const age = parseFloat(ageInput.value);
        const rawWeight = parseFloat(weightInput.value);
        const pal = parseFloat(activitySelect.value) || 1.2;
        const formula = formulaSelect.value;
        const bodyFat = parseFloat(bodyFatInput.value);

        if (isNaN(age) || age < 10 || age > 110 || isNaN(rawWeight) || rawWeight <= 0) {
            showError('Please verify age and body weight.');
            return;
        }

        // Standardize Weight to kg, Height to cm
        let weightKg = currentUnit === 'metric' ? rawWeight : rawWeight * 0.45359237;
        let heightCm = 0;

        if (currentUnit === 'metric') {
            heightCm = parseFloat(heightCmInput.value);
        } else {
            const ft = parseFloat(heightFtInput.value) || 0;
            const inches = parseFloat(heightInInput.value) || 0;
            heightCm = ((ft * 12) + inches) * 2.54;
        }

        if (isNaN(heightCm) || heightCm < 50 || heightCm > 280) {
            showError('Please enter a valid height.');
            return;
        }

        let bmr = 0;

        if (formula === 'katch') {
            if (!isNaN(bodyFat) && bodyFat > 2 && bodyFat < 70) {
                const ffm = weightKg * (1 - (bodyFat / 100));
                bmr = 370 + (21.6 * ffm);
            } else {
                // Fallback to Mifflin if body fat missing
                bmr = currentGender === 'male'
                    ? (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
                    : (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
            }
        } else if (formula === 'harris') {
            // Revised Harris-Benedict (Roza & Shizgal, 1984)
            bmr = currentGender === 'male'
                ? 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age)
                : 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
        } else {
            // Mifflin-St Jeor (Default clinical gold standard)
            bmr = currentGender === 'male'
                ? (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
                : (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
        }

        const tdee = bmr * pal;

        // Display Hero Results
        primaryResult.textContent = `${Math.round(tdee).toLocaleString()} kcal / day`;
        secondaryResult.innerHTML = `Your maintenance energy baseline with PAL <strong>${pal}x</strong> based on <strong>${getFormulaName(formula)}</strong>.`;

        if (bmrVal) bmrVal.textContent = `${Math.round(bmr).toLocaleString()} kcal`;
        if (palBadge) palBadge.textContent = `${pal}x PAL`;

        // 4 Components Decomposition
        // BMR: ~60-70%, TEF: 10% of TDEE, EAT + NEAT makes up the rest
        const tef = tdee * 0.10;
        const totalActivityEnergy = Math.max(0, tdee - bmr - tef);
        const eat = totalActivityEnergy * 0.45;
        const neat = totalActivityEnergy * 0.55;

        if (bmrCompVal) bmrCompVal.textContent = `${Math.round(bmr).toLocaleString()} kcal (${Math.round((bmr / tdee) * 100)}%)`;
        if (neatCompVal) neatCompVal.textContent = `${Math.round(neat).toLocaleString()} kcal (${Math.round((neat / tdee) * 100)}%)`;
        if (tefCompVal) tefCompVal.textContent = `${Math.round(tef).toLocaleString()} kcal (10%)`;
        if (eatCompVal) eatCompVal.textContent = `${Math.round(eat).toLocaleString()} kcal (${Math.round((eat / tdee) * 100)}%)`;

        // Caloric Goal Tiers
        const mildLoss = Math.max(1200, Math.round(tdee - 250));
        const stdLoss = Math.max(1200, Math.round(tdee - 500));
        const fastLoss = Math.max(1000, Math.round(tdee - 750));
        const leanBulk = Math.round(tdee + 300);

        if (goalMaintainVal) goalMaintainVal.textContent = `${Math.round(tdee).toLocaleString()} kcal`;
        if (goalMildLossVal) goalMildLossVal.textContent = `${mildLoss.toLocaleString()} kcal (-0.5 lb/wk)`;
        if (goalStdLossVal) goalStdLossVal.textContent = `${stdLoss.toLocaleString()} kcal (-1.0 lb/wk)`;
        if (goalFastLossVal) goalFastLossVal.textContent = `${fastLoss.toLocaleString()} kcal (-1.5 lb/wk)`;
        if (goalLeanBulkVal) goalLeanBulkVal.textContent = `${leanBulk.toLocaleString()} kcal (+0.5 lb/wk)`;

        // Render Macronutrient Matrix (Maintenance, Fat Loss, Lean Bulk)
        renderMacroTable(Math.round(tdee), stdLoss, leanBulk, weightKg);
    }

    function renderMacroTable(maintainCals, lossCals, bulkCals, weightKg) {
        if (!macroTbody) return;

        // Profiles:
        // Balanced (30% Protein, 40% Carb, 30% Fat)
        // High Protein Athletic (40% Protein, 35% Carb, 25% Fat)
        // Low Carb / Keto (25% Protein, 5% Carb, 70% Fat)
        const plans = [
            {
                name: 'Maintenance (TDEE)',
                cals: maintainCals,
                pPct: 0.30, cPct: 0.40, fPct: 0.30,
                tag: 'Energy Balance'
            },
            {
                name: 'Fat Loss (-500 kcal)',
                cals: lossCals,
                pPct: 0.35, cPct: 0.35, fPct: 0.30,
                tag: '1 lb/wk Fat Loss'
            },
            {
                name: 'Lean Bulk (+300 kcal)',
                cals: bulkCals,
                pPct: 0.25, cPct: 0.50, fPct: 0.25,
                tag: 'Muscle Hypertrophy'
            }
        ];

        let html = '';
        plans.forEach(p => {
            const pGrams = Math.round((p.cals * p.pPct) / 4);
            const cGrams = Math.round((p.cals * p.cPct) / 4);
            const fGrams = Math.round((p.cals * p.fPct) / 9);

            html += `
                <tr style="border-bottom: 1px solid var(--color-border-light);">
                    <td style="padding: 10px 12px; white-space: nowrap;">
                        <strong>${p.name}</strong>
                        <span style="display:block; font-size: 0.75rem; color: var(--color-text-muted);">${p.tag}</span>
                    </td>
                    <td style="padding: 10px 12px; font-weight: 700; color: var(--color-accent-blue); white-space: nowrap;">${p.cals.toLocaleString()} kcal</td>
                    <td style="padding: 10px 12px; color: var(--color-accent-emerald); white-space: nowrap;">${pGrams}g (${Math.round(p.pPct*100)}%)</td>
                    <td style="padding: 10px 12px; color: var(--color-text-main); white-space: nowrap;">${cGrams}g (${Math.round(p.cPct*100)}%)</td>
                    <td style="padding: 10px 12px; color: #f59e0b; white-space: nowrap;">${fGrams}g (${Math.round(p.fPct*100)}%)</td>
                </tr>
            `;
        });

        macroTbody.innerHTML = html;
    }

    function getFormulaName(key) {
        if (key === 'katch') return 'Katch-McArdle (LBM)';
        if (key === 'harris') return 'Revised Harris-Benedict';
        return 'Mifflin-St Jeor';
    }

    function showError(msg) {
        primaryResult.textContent = 'Invalid Input';
        secondaryResult.textContent = msg || 'Please verify bioenergetic parameters.';
    }

    // Initial Execution
    calculateTdee();
});
