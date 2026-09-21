/**
 * Calories Burned by Activity Calculator Engine
 * Uses clinical ACSM MET formulas:
 *   kcal/min = (MET * 3.5 * weight_kg) / 200
 *   Gross kcal = kcal/min * duration_min
 *   Net kcal = ((MET - 1) * 3.5 * weight_kg) / 200 * duration_min
 * 100% Client-Side Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
    // Input elements
    const activitySelect = document.getElementById('cb-activity');
    const customMetGroup = document.getElementById('cb-custom-met-group');
    const customMetInput = document.getElementById('cb-custom-met');
    const weightInput = document.getElementById('cb-weight');
    const weightUnitSelect = document.getElementById('cb-weight-unit');
    const hoursInput = document.getElementById('cb-hours');
    const minutesInput = document.getElementById('cb-minutes');

    // Output elements
    const grossCaloriesEl = document.getElementById('cb-gross-calories');
    const netCaloriesEl = document.getElementById('cb-net-calories');
    const burnRateHourEl = document.getElementById('cb-burn-rate-hour');
    const burnRateMinEl = document.getElementById('cb-burn-rate-min');
    const metDisplayEl = document.getElementById('cb-met-display');

    // Food equivalents
    const foodPizzaEl = document.getElementById('cb-food-pizza');
    const foodDonutEl = document.getElementById('cb-food-donut');
    const foodSodaEl = document.getElementById('cb-food-soda');
    const foodBananaEl = document.getElementById('cb-food-banana');

    // Comparison table body
    const compTableBody = document.getElementById('cb-comp-body');

    // Popular activities for duration comparison: [name, met]
    const comparisonActivities = [
        { name: 'Walking (Brisk, 3.5 mph)', met: 4.3 },
        { name: 'Jogging (5.0 mph)', met: 8.3 },
        { name: 'Running (7.0 mph)', met: 11.0 },
        { name: 'Cycling (Moderate, 12-14 mph)', met: 8.0 },
        { name: 'Swimming (Moderate Freestyle)', met: 8.0 },
        { name: 'Jump Rope (Moderate)', met: 12.3 },
        { name: 'Circuit / HIIT Training', met: 8.0 },
        { name: 'Weight Training (Vigorous)', met: 5.0 },
        { name: 'Yoga / Hatha', met: 3.0 }
    ];

    function calculate() {
        let met = 1.0;
        const selectedOption = activitySelect.options[activitySelect.selectedIndex];

        if (activitySelect.value === 'custom') {
            if (customMetGroup) customMetGroup.style.display = 'block';
            met = parseFloat(customMetInput.value) || 1.0;
        } else {
            if (customMetGroup) customMetGroup.style.display = 'none';
            met = parseFloat(selectedOption.dataset.met) || 3.5;
        }

        let weight = parseFloat(weightInput.value) || 0;
        const weightUnit = weightUnitSelect ? weightUnitSelect.value : 'kg';
        let weightKg = weightUnit === 'lbs' ? weight * 0.45359237 : weight;

        let hours = parseFloat(hoursInput.value) || 0;
        let mins = parseFloat(minutesInput.value) || 0;
        let totalMinutes = (hours * 60) + mins;

        if (weightKg <= 0 || totalMinutes <= 0 || met <= 0) {
            resetOutputs();
            return;
        }

        // ACSM Formula
        const kcalPerMin = (met * 3.5 * weightKg) / 200;
        const grossCalories = kcalPerMin * totalMinutes;
        const netKcalPerMin = Math.max(0, ((met - 1.0) * 3.5 * weightKg) / 200);
        const netCalories = netKcalPerMin * totalMinutes;
        const kcalPerHour = kcalPerMin * 60;

        // Render metrics
        if (grossCaloriesEl) grossCaloriesEl.textContent = Math.round(grossCalories).toLocaleString();
        if (netCaloriesEl) netCaloriesEl.textContent = Math.round(netCalories).toLocaleString();
        if (burnRateHourEl) burnRateHourEl.textContent = `${Math.round(kcalPerHour).toLocaleString()} kcal/hr`;
        if (burnRateMinEl) burnRateMinEl.textContent = `${kcalPerMin.toFixed(1)} kcal/min`;
        if (metDisplayEl) metDisplayEl.textContent = `${met.toFixed(1)} METs`;

        // Food equivalents:
        // 1 slice cheese pizza ~ 285 kcal
        // 1 glazed donut ~ 260 kcal
        // 1 12oz can cola ~ 140 kcal
        // 1 medium banana ~ 105 kcal
        if (foodPizzaEl) foodPizzaEl.textContent = (grossCalories / 285).toFixed(1);
        if (foodDonutEl) foodDonutEl.textContent = (grossCalories / 260).toFixed(1);
        if (foodSodaEl) foodSodaEl.textContent = (grossCalories / 140).toFixed(1);
        if (foodBananaEl) foodBananaEl.textContent = (grossCalories / 105).toFixed(1);

        // Render comparative activity duration table
        renderComparisons(grossCalories, weightKg);
    }

    function renderComparisons(targetCalories, weightKg) {
        if (!compTableBody) return;
        compTableBody.innerHTML = '';

        comparisonActivities.forEach(act => {
            const actKcalPerMin = (act.met * 3.5 * weightKg) / 200;
            const requiredMins = actKcalPerMin > 0 ? targetCalories / actKcalPerMin : 0;

            const reqHours = Math.floor(requiredMins / 60);
            const reqRemMins = Math.round(requiredMins % 60);

            let durationStr = '';
            if (reqHours > 0) {
                durationStr = `${reqHours}h ${reqRemMins}m`;
            } else {
                durationStr = `${reqRemMins} min`;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${act.name}</strong></td>
                <td><span class="badge" style="background: rgba(255,255,255,0.06);">${act.met} MET</span></td>
                <td>${(actKcalPerMin * 60).toFixed(0)} kcal/hr</td>
                <td style="font-weight: 700; color: var(--color-primary);">${durationStr}</td>
            `;
            compTableBody.appendChild(row);
        });
    }

    function resetOutputs() {
        if (grossCaloriesEl) grossCaloriesEl.textContent = '0';
        if (netCaloriesEl) netCaloriesEl.textContent = '0';
        if (burnRateHourEl) burnRateHourEl.textContent = '0 kcal/hr';
        if (burnRateMinEl) burnRateMinEl.textContent = '0.0 kcal/min';
        if (metDisplayEl) metDisplayEl.textContent = '-';
        if (foodPizzaEl) foodPizzaEl.textContent = '0';
        if (foodDonutEl) foodDonutEl.textContent = '0';
        if (foodSodaEl) foodSodaEl.textContent = '0';
        if (foodBananaEl) foodBananaEl.textContent = '0';
        if (compTableBody) compTableBody.innerHTML = '';
    }

    // Event listeners
    if (activitySelect) {
        activitySelect.addEventListener('change', calculate);
    }

    const inputs = [customMetInput, weightInput, hoursInput, minutesInput];
    inputs.forEach(input => {
        if (input) input.addEventListener('input', calculate);
    });

    if (weightUnitSelect) {
        weightUnitSelect.addEventListener('change', calculate);
    }

    // Initial calculation
    calculate();
});
