/**
 * Daily Water Intake & Hydration Pacing Engine
 * CalculatorHub - Client-Side Vanilla JS
 */

document.addEventListener('DOMContentLoaded', function () {
    // State
    let currentUnit = 'metric'; // 'metric' or 'imperial'

    // Form inputs
    const sexRadios = document.querySelectorAll('input[name="water_sex"]');
    const weightInput = document.getElementById('water-weight');
    const weightLabel = document.getElementById('water-weight-label');
    const weightSuffix = document.getElementById('water-weight-suffix');
    const exerciseInput = document.getElementById('water-exercise');
    const climateSelect = document.getElementById('water-climate');
    const gestationGroup = document.getElementById('water-gestation-group');
    const gestationRadios = document.querySelectorAll('input[name="water_gestation"]');

    // Controls
    const unitButtons = document.querySelectorAll('.water-unit-btn');
    const presetButtons = document.querySelectorAll('.water-preset-btn');
    const calculateBtn = document.getElementById('water-calculate-btn');
    const resetBtn = document.getElementById('water-reset-btn');

    // Results elements
    const resWaterVolume = document.getElementById('res-water-volume');
    const resWaterVolumeSub = document.getElementById('res-water-volume-sub');
    const resWaterCups = document.getElementById('res-water-cups');
    const resWaterTotalFluid = document.getElementById('res-water-total-fluid');
    const resWaterBoost = document.getElementById('res-water-boost');
    const resWaterBoostDesc = document.getElementById('res-water-boost-desc');
    const resWaterStatusLabel = document.getElementById('res-water-status-label');

    // Bar elements
    const barBeverage = document.getElementById('bar-beverage-segment');
    const barFood = document.getElementById('bar-food-segment');

    // Table
    const scheduleBody = document.getElementById('water-schedule-body');

    // Unit toggle
    unitButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            unitButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const newUnit = this.dataset.unit;

            if (newUnit !== currentUnit) {
                currentUnit = newUnit;
                if (currentUnit === 'imperial') {
                    const curKg = parseFloat(weightInput.value) || 75;
                    weightInput.value = (curKg * 2.20462).toFixed(1);
                    weightLabel.textContent = 'Body Weight (lbs)';
                    weightSuffix.textContent = 'lbs';
                } else {
                    const curLbs = parseFloat(weightInput.value) || 165;
                    weightInput.value = (curLbs / 2.20462).toFixed(1);
                    weightLabel.textContent = 'Body Weight (kg)';
                    weightSuffix.textContent = 'kg';
                }
                calculateHydration();
            }
        });
    });

    // Preset buttons
    presetButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            presetButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const gender = this.dataset.gender;
            const weightKg = parseFloat(this.dataset.weight);
            const activity = parseInt(this.dataset.activity, 10);
            const climate = this.dataset.climate;
            const gestation = this.dataset.gestation || 'none';

            sexRadios.forEach(r => {
                r.checked = (r.value === gender);
            });
            handleSexChange(gender);

            if (currentUnit === 'metric') {
                weightInput.value = weightKg;
            } else {
                weightInput.value = (weightKg * 2.20462).toFixed(1);
            }

            exerciseInput.value = activity;
            climateSelect.value = climate;

            gestationRadios.forEach(r => {
                r.checked = (r.value === gestation);
            });

            calculateHydration();
        });
    });

    function getSelectedSex() {
        for (const r of sexRadios) {
            if (r.checked) return r.value;
        }
        return 'male';
    }

    function getSelectedGestation() {
        for (const r of gestationRadios) {
            if (r.checked) return r.value;
        }
        return 'none';
    }

    function handleSexChange(sex) {
        if (sex === 'female') {
            gestationGroup.style.display = 'block';
        } else {
            gestationGroup.style.display = 'none';
            gestationRadios[0].checked = true;
        }
    }

    sexRadios.forEach(r => {
        r.addEventListener('change', function () {
            handleSexChange(this.value);
            calculateHydration();
        });
    });

    gestationRadios.forEach(r => {
        r.addEventListener('change', calculateHydration);
    });

    function calculateHydration() {
        const sex = getSelectedSex();
        const rawWeight = parseFloat(weightInput.value) || 0;
        const exerciseMins = parseFloat(exerciseInput.value) || 0;
        const climate = climateSelect.value;
        const gestation = getSelectedGestation();

        if (rawWeight <= 0) return;

        let weightKg = (currentUnit === 'metric') ? rawWeight : (rawWeight / 2.20462);

        // 1. Baseline volumetric turnover (mL)
        // Males: ~35 mL/kg; Females: ~31 mL/kg (IOM reference)
        const baselineCoeff = (sex === 'male') ? 35 : 31;
        let baselineMl = weightKg * baselineCoeff;

        // 2. Exercise sweat loss replacement (~350 mL per 30 mins)
        const exerciseAddonMl = (exerciseMins / 30) * 350;

        // 3. Climate thermal coefficient
        let climateCoeff = 1.0;
        if (climate === 'warm') climateCoeff = 1.10;
        else if (climate === 'hot') climateCoeff = 1.20;

        // 4. Gestational demand
        let gestationAddonMl = 0;
        if (sex === 'female') {
            if (gestation === 'pregnant') gestationAddonMl = 300;
            else if (gestation === 'lactating') gestationAddonMl = 750;
        }

        // Total Fluid Intake (Total water from beverages + food)
        const totalFluidMl = (baselineMl + exerciseAddonMl) * climateCoeff + gestationAddonMl;

        // Beverage Target: ~80% from drinking water & beverages
        const drinkingFluidMl = totalFluidMl * 0.80;
        const foodFluidMl = totalFluidMl * 0.20;

        // Exercise & climate boost display
        const totalBoostMl = totalFluidMl - baselineMl;

        // Conversions
        const drinkingLiters = drinkingFluidMl / 1000;
        const totalFluidLiters = totalFluidMl / 1000;
        const drinkingFlOz = drinkingFluidMl / 29.5735;
        const totalFluidFlOz = totalFluidMl / 29.5735;
        const cupsCount = drinkingFluidMl / 237; // Standard 8 oz cup = 237 mL

        // Render KPI cards
        if (currentUnit === 'metric') {
            resWaterVolume.textContent = `${drinkingLiters.toFixed(1)} Liters`;
            resWaterVolumeSub.textContent = `${Math.round(drinkingFluidMl).toLocaleString()} mL drinking fluids`;
            resWaterTotalFluid.textContent = `${totalFluidLiters.toFixed(1)} Liters`;
            resWaterBoost.textContent = `+${Math.round(totalBoostMl).toLocaleString()} mL`;
        } else {
            resWaterVolume.textContent = `${drinkingFlOz.toFixed(0)} fl oz`;
            resWaterVolumeSub.textContent = `${(drinkingFlOz / 128).toFixed(1)} Gallons drinking fluids`;
            resWaterTotalFluid.textContent = `${totalFluidFlOz.toFixed(0)} fl oz`;
            resWaterBoost.textContent = `+${(totalBoostMl / 29.5735).toFixed(0)} fl oz`;
        }

        resWaterCups.textContent = `${cupsCount.toFixed(1)} Cups`;
        resWaterBoostDesc = (exerciseMins > 0 || climate !== 'temperate' || gestation !== 'none')
            ? `${exerciseMins} min exercise & ${climate} climate`
            : 'Sedentary baseline';

        // Pacing Schedule Table
        const phases = [
            {
                window: 'Morning Awakening (7:00 AM - 9:00 AM)',
                pct: 20,
                desc: 'Cellular rehydration after overnight fast; kickstarts renal filtration.'
            },
            {
                window: 'Midday Work Focus (10:00 AM - 1:00 PM)',
                pct: 35,
                desc: 'Sustained cognitive hydration during peak metabolic hours and lunch.'
            },
            {
                window: 'Afternoon & Activity (2:00 PM - 6:00 PM)',
                pct: 30,
                desc: 'Pre/post-workout perspiratory fluid restoration and endurance support.'
            },
            {
                window: 'Evening Wind-Down (7:00 PM - 9:30 PM)',
                pct: 15,
                desc: 'Tapered gentle hydration to avoid nocturia and sleep fragmentation.'
            }
        ];

        scheduleBody.innerHTML = '';
        phases.forEach(p => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--color-border-subtle)';

            const phaseMl = drinkingFluidMl * (p.pct / 100);
            const phaseCups = cupsCount * (p.pct / 100);

            const displayTarget = (currentUnit === 'metric')
                ? `${Math.round(phaseMl)} mL (${(phaseMl / 1000).toFixed(2)} L)`
                : `${(phaseMl / 29.5735).toFixed(0)} fl oz`;

            tr.innerHTML = `
                <td style="padding: 10px 12px; font-weight: 600;">${p.window}</td>
                <td class="td-right" style="padding: 10px 12px; color: var(--color-primary); font-weight: 700;">${p.pct}%</td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 700; color: #0284c7;">${displayTarget}</td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 600; color: #06b6d4;">${phaseCups.toFixed(1)} cups</td>
                <td style="padding: 10px 12px; font-size: 0.82rem; color: var(--color-text-muted);">${p.desc}</td>
            `;
            scheduleBody.appendChild(tr);
        });
    }

    // Input listeners
    [weightInput, exerciseInput].forEach(inp => {
        inp.addEventListener('input', calculateHydration);
    });

    climateSelect.addEventListener('change', calculateHydration);

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateHydration);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            sexRadios[0].checked = true;
            handleSexChange('male');

            unitButtons.forEach(b => b.classList.remove('active'));
            unitButtons[0].classList.add('active');
            currentUnit = 'metric';

            presetButtons.forEach(b => b.classList.remove('active'));
            presetButtons[0].classList.add('active');

            weightInput.value = '75';
            weightLabel.textContent = 'Body Weight (kg)';
            weightSuffix.textContent = 'kg';

            exerciseInput.value = '0';
            climateSelect.value = 'temperate';

            calculateHydration();
        });
    }

    // Initial calculation
    calculateHydration();
});
