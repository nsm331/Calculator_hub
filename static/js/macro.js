/**
 * CalculatorHub - Macronutrient Ratio Calculator Engine
 * Mifflin-St Jeor BMR, TDEE, Caloric Goal Target, and Gram Substrate Partitioning (Client-side ONLY)
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Inputs
    const unitBtns = document.querySelectorAll('.macro-unit-btn');
    const genderBtns = document.querySelectorAll('.macro-gender-btn');
    const goalBtns = document.querySelectorAll('.macro-goal-btn');
    const presetBtns = document.querySelectorAll('.macro-preset-btn');

    const ageInput = document.getElementById('macro-age');
    const weightInput = document.getElementById('macro-weight');
    const weightLabel = document.getElementById('macro-weight-label');
    const heightGroupMetric = document.getElementById('macro-height-metric-group');
    const heightGroupImperial = document.getElementById('macro-height-imperial-group');
    const heightMetricInput = document.getElementById('macro-height');
    const heightFtInput = document.getElementById('macro-height-feet');
    const heightInInput = document.getElementById('macro-height-inches');
    const activitySelect = document.getElementById('macro-activity');

    const sliderProtein = document.getElementById('slider-protein');
    const sliderCarbs = document.getElementById('slider-carbs');
    const sliderFats = document.getElementById('slider-fats');
    const sliderProteinVal = document.getElementById('slider-protein-val');
    const sliderCarbsVal = document.getElementById('slider-carbs-val');
    const sliderFatsVal = document.getElementById('slider-fats-val');
    const sumIndicator = document.getElementById('macro-sum-indicator');

    const calculateBtn = document.getElementById('macro-calculate-btn');
    const mealsSelect = document.getElementById('macro-meals-count');

    // DOM Elements - Results
    const resCalories = document.getElementById('res-macro-calories');
    const resGoalDesc = document.getElementById('res-macro-goal-desc');
    const resTdee = document.getElementById('res-macro-tdee');
    const resBmr = document.getElementById('res-macro-bmr');

    const resProteinPct = document.getElementById('res-protein-pct');
    const resProteinGrams = document.getElementById('res-protein-grams');
    const resProteinCal = document.getElementById('res-protein-cal');
    const resProteinRatio = document.getElementById('res-protein-ratio');

    const resCarbsPct = document.getElementById('res-carbs-pct');
    const resCarbsGrams = document.getElementById('res-carbs-grams');
    const resCarbsCal = document.getElementById('res-carbs-cal');
    const resCarbsRatio = document.getElementById('res-carbs-ratio');

    const resFatsPct = document.getElementById('res-fats-pct');
    const resFatsGrams = document.getElementById('res-fats-grams');
    const resFatsCal = document.getElementById('res-fats-cal');
    const resFatsRatio = document.getElementById('res-fats-ratio');

    const barP = document.getElementById('bar-p');
    const barC = document.getElementById('bar-c');
    const barF = document.getElementById('bar-f');
    const barPText = document.getElementById('bar-p-text');
    const barCText = document.getElementById('bar-c-text');
    const barFText = document.getElementById('bar-f-text');

    const mealsTbody = document.getElementById('macro-meals-tbody');

    // State Variables
    let currentUnit = 'metric';
    let currentGender = 'male';
    let currentGoalDelta = 0.0; // 0.0 = maintenance

    // Unit Toggle
    unitBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const unit = this.dataset.unit;
            if (unit === currentUnit) return;
            currentUnit = unit;
            unitBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            if (currentUnit === 'metric') {
                // Imperial -> Metric
                const lbs = parseFloat(weightInput.value) || 165;
                weightInput.value = Math.round((lbs / 2.20462) * 2) / 2;
                weightLabel.textContent = 'Body Weight (kg)';
                weightInput.min = '30';
                weightInput.max = '300';
                weightInput.step = '0.5';

                const ft = parseFloat(heightFtInput.value) || 5;
                const inches = parseFloat(heightInInput.value) || 10;
                const totalInches = (ft * 12) + inches;
                heightMetricInput.value = Math.round(totalInches * 2.54);

                heightGroupMetric.style.display = '';
                heightGroupImperial.style.display = 'none';
            } else {
                // Metric -> Imperial
                const kg = parseFloat(weightInput.value) || 75;
                weightInput.value = Math.round(kg * 2.20462);
                weightLabel.textContent = 'Body Weight (lbs)';
                weightInput.min = '65';
                weightInput.max = '650';
                weightInput.step = '1';

                const cm = parseFloat(heightMetricInput.value) || 178;
                const totalInches = cm / 2.54;
                const ft = Math.floor(totalInches / 12);
                const inches = Math.round(totalInches % 12);
                heightFtInput.value = ft;
                heightInInput.value = inches;

                heightGroupMetric.style.display = 'none';
                heightGroupImperial.style.display = '';
            }
            calculateMacros();
        });
    });

    // Gender Toggle
    genderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentGender = this.dataset.gender;
            genderBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            calculateMacros();
        });
    });

    // Goal Toggle
    goalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentGoalDelta = parseFloat(this.dataset.delta) || 0.0;
            goalBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            calculateMacros();
        });
    });

    // Preset Distribution Buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const p = parseInt(this.dataset.p, 10);
            const c = parseInt(this.dataset.c, 10);
            const f = parseInt(this.dataset.f, 10);

            presetBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            sliderProtein.value = p;
            sliderCarbs.value = c;
            sliderFats.value = f;

            updateSliderLabels();
            calculateMacros();
        });
    });

    // Slider Updates
    function updateSliderLabels() {
        const p = parseInt(sliderProtein.value, 10);
        const c = parseInt(sliderCarbs.value, 10);
        const f = parseInt(sliderFats.value, 10);

        sliderProteinVal.textContent = p + '%';
        sliderCarbsVal.textContent = c + '%';
        sliderFatsVal.textContent = f + '%';

        const sum = p + c + f;
        sumIndicator.textContent = `Sum: ${sum}%`;
        if (sum === 100) {
            sumIndicator.style.color = 'var(--color-accent-emerald, #10b981)';
        } else {
            sumIndicator.style.color = 'var(--color-accent-rose, #ef4444)';
        }
    }

    [sliderProtein, sliderCarbs, sliderFats].forEach(slider => {
        slider.addEventListener('input', function() {
            presetBtns.forEach(b => b.classList.remove('active'));
            updateSliderLabels();
            calculateMacros();
        });
    });

    // Meals per Day dropdown
    if (mealsSelect) {
        mealsSelect.addEventListener('change', calculateMacros);
    }

    // Calculate Button
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateMacros);
    }

    // Input changes
    [ageInput, weightInput, heightMetricInput, heightFtInput, heightInInput, activitySelect].forEach(el => {
        if (el) {
            el.addEventListener('input', calculateMacros);
            el.addEventListener('change', calculateMacros);
        }
    });

    // Core Calculation Logic
    function calculateMacros() {
        const age = parseFloat(ageInput.value) || 28;
        let weightKg = 75;
        let heightCm = 178;

        if (currentUnit === 'metric') {
            weightKg = parseFloat(weightInput.value) || 75;
            heightCm = parseFloat(heightMetricInput.value) || 178;
        } else {
            const lbs = parseFloat(weightInput.value) || 165;
            weightKg = lbs * 0.45359237;
            const ft = parseFloat(heightFtInput.value) || 5;
            const inches = parseFloat(heightInInput.value) || 10;
            heightCm = ((ft * 12) + inches) * 2.54;
        }

        const pal = parseFloat(activitySelect.value) || 1.55;

        // Mifflin-St Jeor BMR
        // Men: 10 * w + 6.25 * h - 5 * a + 5
        // Women: 10 * w + 6.25 * h - 5 * a - 161
        let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
        if (currentGender === 'male') {
            bmr += 5;
        } else {
            bmr -= 161;
        }
        if (bmr < 500) bmr = 500;

        const tdee = bmr * pal;
        const targetCalories = Math.max(800, Math.round(tdee * (1 + currentGoalDelta)));

        // Percentages
        let rawP = parseInt(sliderProtein.value, 10);
        let rawC = parseInt(sliderCarbs.value, 10);
        let rawF = parseInt(sliderFats.value, 10);
        let sum = rawP + rawC + rawF;
        if (sum <= 0) sum = 100;

        // Normalized proportions for calculations
        const pctP = rawP / sum;
        const pctC = rawC / sum;
        const pctF = rawF / sum;

        const displayPctP = Math.round(pctP * 100);
        const displayPctC = Math.round(pctC * 100);
        const displayPctF = 100 - displayPctP - displayPctC;

        // Calories per macronutrient
        const calP = targetCalories * pctP;
        const calC = targetCalories * pctC;
        const calF = targetCalories * pctF;

        // Grams: 4 kcal/g for Protein, 4 kcal/g for Carbs, 9 kcal/g for Fats
        const gramsP = Math.round(calP / 4);
        const gramsC = Math.round(calC / 4);
        const gramsF = Math.round(calF / 9);

        // g per kg ratios
        const ratioP = (gramsP / weightKg).toFixed(2);
        const ratioC = (gramsC / weightKg).toFixed(2);
        const ratioF = (gramsF / weightKg).toFixed(2);

        // Update Energy Display
        if (resCalories) resCalories.textContent = targetCalories.toLocaleString() + ' kcal';
        if (resTdee) resTdee.textContent = Math.round(tdee).toLocaleString() + ' kcal';
        if (resBmr) resBmr.textContent = Math.round(bmr).toLocaleString() + ' kcal';

        if (resGoalDesc) {
            if (currentGoalDelta === -0.20) {
                resGoalDesc.textContent = 'Aggressive Fat Loss (-20% deficit)';
            } else if (currentGoalDelta === -0.10) {
                resGoalDesc.textContent = 'Moderate Fat Loss (-10% deficit)';
            } else if (currentGoalDelta === 0.0) {
                resGoalDesc.textContent = 'Energy for body weight maintenance';
            } else if (currentGoalDelta === 0.10) {
                resGoalDesc.textContent = 'Lean Hypertrophy (+10% surplus)';
            } else {
                resGoalDesc.textContent = 'Heavy Bulking (+20% surplus)';
            }
        }

        // Update Macro Pillars
        if (resProteinPct) resProteinPct.textContent = displayPctP + '%';
        if (resProteinGrams) resProteinGrams.textContent = gramsP + ' g';
        if (resProteinCal) resProteinCal.textContent = Math.round(calP).toLocaleString() + ' kcal';
        if (resProteinRatio) resProteinRatio.textContent = ratioP + ' g/kg';

        if (resCarbsPct) resCarbsPct.textContent = displayPctC + '%';
        if (resCarbsGrams) resCarbsGrams.textContent = gramsC + ' g';
        if (resCarbsCal) resCarbsCal.textContent = Math.round(calC).toLocaleString() + ' kcal';
        if (resCarbsRatio) resCarbsRatio.textContent = ratioC + ' g/kg';

        if (resFatsPct) resFatsPct.textContent = displayPctF + '%';
        if (resFatsGrams) resFatsGrams.textContent = gramsF + ' g';
        if (resFatsCal) resFatsCal.textContent = Math.round(calF).toLocaleString() + ' kcal';
        if (resFatsRatio) resFatsRatio.textContent = ratioF + ' g/kg';

        // Update Macro Distribution Bar
        if (barP) barP.style.width = displayPctP + '%';
        if (barC) barC.style.width = displayPctC + '%';
        if (barF) barF.style.width = displayPctF + '%';

        if (barPText) barPText.textContent = `${displayPctP}% (${Math.round(calP)} kcal)`;
        if (barCText) barCText.textContent = `${displayPctC}% (${Math.round(calC)} kcal)`;
        if (barFText) barFText.textContent = `${displayPctF}% (${Math.round(calF)} kcal)`;

        // Update Meal Distribution Table
        const mealsCount = parseInt(mealsSelect.value, 10) || 4;
        populateMealsTable(mealsCount, targetCalories, gramsP, gramsC, gramsF);
    }

    function populateMealsTable(numMeals, totalCal, totalP, totalC, totalF) {
        if (!mealsTbody) return;

        const calPerMeal = Math.round(totalCal / numMeals);
        const pPerMeal = Math.round(totalP / numMeals);
        const cPerMeal = Math.round(totalC / numMeals);
        const fPerMeal = Math.round(totalF / numMeals);

        let rowsHtml = '';
        const mealLabels = ['Breakfast', 'Lunch', 'Post-Workout / Snack', 'Dinner', 'Evening Fuel', 'Late Supper'];

        for (let i = 1; i <= numMeals; i++) {
            const label = mealLabels[i - 1] || `Meal ${i}`;
            rowsHtml += `
                <tr style="border-bottom: 1px solid var(--color-border-light);">
                    <td style="padding: 10px 14px; text-align: left; font-weight: 600; color: var(--color-text-main);">
                        ${label}
                    </td>
                    <td style="padding: 10px 14px; font-weight: 700; color: var(--color-accent-blue);">
                        ${calPerMeal} kcal
                    </td>
                    <td style="padding: 10px 14px; color: var(--color-text-muted);">
                        <strong style="color: var(--color-accent-blue);">${pPerMeal} g</strong> (${pPerMeal * 4} kcal)
                    </td>
                    <td style="padding: 10px 14px; color: var(--color-text-muted);">
                        <strong style="color: var(--color-accent-amber);">${cPerMeal} g</strong> (${cPerMeal * 4} kcal)
                    </td>
                    <td style="padding: 10px 14px; color: var(--color-text-muted);">
                        <strong style="color: var(--color-accent-rose);">${fPerMeal} g</strong> (${fPerMeal * 9} kcal)
                    </td>
                </tr>
            `;
        }

        mealsTbody.innerHTML = rowsHtml;
    }

    // Initial Run
    updateSliderLabels();
    calculateMacros();
});
