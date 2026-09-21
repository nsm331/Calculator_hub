/**
 * CalculatorHub - Power & Wattage Converter Engine
 * Comprehensive multi-standard power conversion (SI Metric, Imperial, HVAC, Logarithmic dBm)
 * and household electrical energy consumption cost estimator.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mode Switcher
    const modeBtns = document.querySelectorAll('.power-mode-btn');
    const pairSection = document.getElementById('power-pair-section');
    const matrixSection = document.getElementById('power-matrix-section');
    const applianceSection = document.getElementById('power-appliance-section');

    // Quick Pair Inputs
    const pairInputVal = document.getElementById('power-pair-val');
    const pairFromUnit = document.getElementById('power-pair-from');
    const pairToUnit = document.getElementById('power-pair-to');
    const pairSwapBtn = document.getElementById('power-pair-swap');
    const pairPrimaryResult = document.getElementById('power-pair-result');
    const pairSecondaryResult = document.getElementById('power-pair-secondary');

    // Multi-Unit Matrix Inputs
    const matrixInputVal = document.getElementById('power-matrix-val');
    const matrixUnitSelect = document.getElementById('power-matrix-unit');
    const matrixTbody = document.getElementById('power-matrix-tbody');

    // Appliance Estimator Inputs
    const appWattVal = document.getElementById('app-power-val');
    const appWattUnit = document.getElementById('app-power-unit');
    const appHoursVal = document.getElementById('app-hours-val');
    const appRateVal = document.getElementById('app-rate-val');
    const appDailyCostVal = document.getElementById('app-daily-cost');
    const appMonthlyCostVal = document.getElementById('app-monthly-cost');
    const appAnnualCostVal = document.getElementById('app-annual-cost');
    const appKwhDailyVal = document.getElementById('app-kwh-daily');
    const appPresets = document.querySelectorAll('.app-preset-btn');

    // Conversion Factors to Base Watts (W)
    const POWER_UNITS = {
        W: { name: 'Watts (W)', factor: 1.0, type: 'linear', cat: 'SI Metric' },
        kW: { name: 'Kilowatts (kW)', factor: 1000.0, type: 'linear', cat: 'SI Metric' },
        MW: { name: 'Megawatts (MW)', factor: 1000000.0, type: 'linear', cat: 'SI Metric' },
        GW: { name: 'Gigawatts (GW)', factor: 1000000000.0, type: 'linear', cat: 'SI Metric' },
        mW: { name: 'Milliwatts (mW)', factor: 0.001, type: 'linear', cat: 'SI Metric' },
        J_s: { name: 'Joules per second (J/s)', factor: 1.0, type: 'linear', cat: 'SI Metric' },
        hp_I: { name: 'Mechanical Horsepower (hp)', factor: 745.69987158227, type: 'linear', cat: 'Mechanical / Imperial' },
        hp_M: { name: 'Metric Horsepower (PS / cv)', factor: 735.49875, type: 'linear', cat: 'Mechanical / Metric' },
        hp_E: { name: 'Electrical Horsepower (hp(E))', factor: 746.0, type: 'linear', cat: 'Electrical' },
        hp_S: { name: 'Boiler Horsepower (hp(S))', factor: 9809.5, type: 'linear', cat: 'Thermal' },
        BTU_h: { name: 'BTU per hour (BTU/h)', factor: 0.29307107, type: 'linear', cat: 'Thermal / HVAC' },
        TR: { name: 'Tons of Refrigeration (TR)', factor: 3516.85284, type: 'linear', cat: 'Thermal / HVAC' },
        kcal_h: { name: 'Kilocalories per hour (kcal/h)', factor: 1.1622222, type: 'linear', cat: 'Thermal' },
        ft_lbf_s: { name: 'Foot-pounds per sec (ft·lbf/s)', factor: 1.3558179483314, type: 'linear', cat: 'Mechanical / Imperial' },
        dBm: { name: 'Decibel-milliwatts (dBm)', factor: 0, type: 'log_dbm', cat: 'RF / Telecom' },
        dBW: { name: 'Decibel-watts (dBW)', factor: 0, type: 'log_dbw', cat: 'RF / Telecom' }
    };

    let currentMode = 'pair'; // 'pair', 'matrix', 'appliance'

    // Mode Toggle
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentMode = this.dataset.mode;
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            pairSection.style.display = currentMode === 'pair' ? 'block' : 'none';
            matrixSection.style.display = currentMode === 'matrix' ? 'block' : 'none';
            applianceSection.style.display = currentMode === 'appliance' ? 'block' : 'none';

            if (currentMode === 'pair') calculatePair();
            if (currentMode === 'matrix') calculateMatrix();
            if (currentMode === 'appliance') calculateAppliance();
        });
    });

    // Pair Mode Handlers
    [pairInputVal, pairFromUnit, pairToUnit].forEach(el => {
        if (el) {
            el.addEventListener('input', calculatePair);
            el.addEventListener('change', calculatePair);
        }
    });

    if (pairSwapBtn) {
        pairSwapBtn.addEventListener('click', function() {
            const temp = pairFromUnit.value;
            pairFromUnit.value = pairToUnit.value;
            pairToUnit.value = temp;
            calculatePair();
        });
    }

    function toWatts(val, unitKey) {
        const u = POWER_UNITS[unitKey];
        if (!u) return val;
        if (u.type === 'linear') {
            return val * u.factor;
        } else if (u.type === 'log_dbm') {
            return Math.pow(10, val / 10) / 1000;
        } else if (u.type === 'log_dbw') {
            return Math.pow(10, val / 10);
        }
        return val;
    }

    function fromWatts(watts, unitKey) {
        const u = POWER_UNITS[unitKey];
        if (!u) return watts;
        if (u.type === 'linear') {
            return watts / u.factor;
        } else if (u.type === 'log_dbm') {
            if (watts <= 0) return -Infinity;
            return 10 * Math.log10(watts * 1000);
        } else if (u.type === 'log_dbw') {
            if (watts <= 0) return -Infinity;
            return 10 * Math.log10(watts);
        }
        return watts;
    }

    function calculatePair() {
        const val = parseFloat(pairInputVal.value);
        const fromU = pairFromUnit.value;
        const toU = pairToUnit.value;

        if (isNaN(val)) {
            pairPrimaryResult.textContent = '--';
            pairSecondaryResult.textContent = 'Please enter a valid power value.';
            return;
        }

        const watts = toWatts(val, fromU);
        const converted = fromWatts(watts, toU);

        const fromName = POWER_UNITS[fromU] ? POWER_UNITS[fromU].name : fromU;
        const toName = POWER_UNITS[toU] ? POWER_UNITS[toU].name : toU;

        pairPrimaryResult.textContent = `${formatOutput(converted)} ${toU}`;
        pairSecondaryResult.innerHTML = `<strong>${formatOutput(val)} ${fromU}</strong> is equal to <strong>${formatOutput(watts)} Watts (SI)</strong> &bull; <strong>${formatOutput(converted)} ${toName}</strong>`;
    }

    // Multi-Unit Matrix Handlers
    [matrixInputVal, matrixUnitSelect].forEach(el => {
        if (el) {
            el.addEventListener('input', calculateMatrix);
            el.addEventListener('change', calculateMatrix);
        }
    });

    function calculateMatrix() {
        if (!matrixTbody) return;
        const val = parseFloat(matrixInputVal.value);
        const unitKey = matrixUnitSelect.value;

        if (isNaN(val)) {
            matrixTbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 12px; color: var(--color-text-muted);">Please enter a valid number.</td></tr>';
            return;
        }

        const watts = toWatts(val, unitKey);
        let html = '';

        for (let key in POWER_UNITS) {
            const u = POWER_UNITS[key];
            const converted = fromWatts(watts, key);
            const isSelected = key === unitKey;
            const highlightClass = isSelected ? 'style="font-weight: 700; color: var(--color-accent-blue);"' : '';

            html += `
                <tr style="border-bottom: 1px solid var(--color-border-light);">
                    <td style="padding: 8px 12px; ${highlightClass} white-space: nowrap;">${u.name}</td>
                    <td style="padding: 8px 12px; font-weight: 700; color: var(--color-text-main); font-family: monospace; white-space: nowrap;">${formatOutput(converted)}</td>
                    <td style="padding: 8px 12px; color: var(--color-text-muted); font-size: 0.8rem; white-space: nowrap;">${u.cat}</td>
                    <td style="padding: 8px 12px; color: var(--color-text-muted); font-size: 0.8rem; min-width: 140px;">${getEquivFormula(key)}</td>
                </tr>
            `;
        }

        matrixTbody.innerHTML = html;
    }

    function getEquivFormula(key) {
        switch(key) {
            case 'W': return '1 J/s (SI Standard)';
            case 'kW': return '1,000 Watts';
            case 'MW': return '1,000,000 Watts';
            case 'GW': return '1,000,000,000 Watts';
            case 'mW': return '0.001 Watts';
            case 'hp_I': return '550 ft·lbf/s ≈ 745.7 W';
            case 'hp_M': return '75 kgf·m/s ≈ 735.5 W';
            case 'hp_E': return 'Exact 746 Watts';
            case 'BTU_h': return '≈ 0.29307 Watts';
            case 'TR': return '12,000 BTU/h ≈ 3,516.85 W';
            case 'kcal_h': return '≈ 1.1622 Watts';
            case 'ft_lbf_s': return '≈ 1.3558 Watts';
            case 'dBm': return '10·log10(P / 1 mW)';
            case 'dBW': return '10·log10(P / 1 W)';
            default: return '--';
        }
    }

    // Appliance Energy Cost Estimator
    [appWattVal, appWattUnit, appHoursVal, appRateVal].forEach(el => {
        if (el) {
            el.addEventListener('input', calculateAppliance);
            el.addEventListener('change', calculateAppliance);
        }
    });

    const APPLIANCE_PRESETS = {
        ac: { watts: 3500, unit: 'W', hours: 8 },
        fridge: { watts: 150, unit: 'W', hours: 24 },
        pc: { watts: 300, unit: 'W', hours: 6 },
        ev: { watts: 7.2, unit: 'kW', hours: 4 },
        heater: { watts: 1500, unit: 'W', hours: 5 },
        tv: { watts: 100, unit: 'W', hours: 4 }
    };

    appPresets.forEach(btn => {
        btn.addEventListener('click', function() {
            const key = this.dataset.app;
            if (APPLIANCE_PRESETS[key]) {
                appWattVal.value = APPLIANCE_PRESETS[key].watts;
                appWattUnit.value = APPLIANCE_PRESETS[key].unit;
                appHoursVal.value = APPLIANCE_PRESETS[key].hours;
                calculateAppliance();
            }
        });
    });

    function calculateAppliance() {
        const rawPower = parseFloat(appWattVal.value);
        const hoursPerDay = parseFloat(appHoursVal.value);
        const ratePerKwh = parseFloat(appRateVal.value);

        if (isNaN(rawPower) || rawPower < 0 || isNaN(hoursPerDay) || hoursPerDay < 0 || isNaN(ratePerKwh) || ratePerKwh < 0) {
            if (appDailyCostVal) appDailyCostVal.textContent = '--';
            if (appMonthlyCostVal) appMonthlyCostVal.textContent = '--';
            if (appAnnualCostVal) appAnnualCostVal.textContent = '--';
            return;
        }

        const powerInKw = appWattUnit.value === 'kW' ? rawPower : rawPower / 1000;
        const dailyKwh = powerInKw * hoursPerDay;
        const dailyCost = dailyKwh * ratePerKwh;
        const monthlyCost = dailyCost * 30.4167; // Average days per month
        const annualCost = dailyCost * 365.25;

        if (appDailyCostVal) appDailyCostVal.textContent = `$${dailyCost.toFixed(2)}`;
        if (appMonthlyCostVal) appMonthlyCostVal.textContent = `$${monthlyCost.toFixed(2)}`;
        if (appAnnualCostVal) appAnnualCostVal.textContent = `$${annualCost.toFixed(2)}`;
        if (appKwhDailyVal) appKwhDailyVal.textContent = `${dailyKwh.toFixed(2)} kWh/day`;
    }

    function formatOutput(num) {
        if (!isFinite(num)) return num.toString();
        const abs = Math.abs(num);
        if (abs === 0) return '0';
        if (abs >= 1e9 || (abs < 0.0001 && abs > 0)) {
            return num.toExponential(4);
        }
        if (abs >= 10000) {
            return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
        }
        return parseFloat(num.toFixed(6)).toString();
    }

    // Initial Execution
    calculatePair();
    calculateMatrix();
    calculateAppliance();
});
