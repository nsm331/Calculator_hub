/**
 * Lean Body Mass (LBM) & Body Composition Calculator
 * Boer, James, and Hume Clinical Formulations
 * CalculatorHub - Client-Side Vanilla JS
 */

document.addEventListener('DOMContentLoaded', function () {
    // State
    let currentUnit = 'metric'; // 'metric' or 'imperial'

    // Form inputs
    const sexRadios = document.querySelectorAll('input[name="lbm_sex"]');
    const weightInput = document.getElementById('lbm-weight');
    const weightLabel = document.getElementById('lbm-weight-label');
    const weightSuffix = document.getElementById('lbm-weight-suffix');
    const heightMetricGroup = document.getElementById('lbm-height-metric-group');
    const heightImperialGroup = document.getElementById('lbm-height-imperial-group');
    const heightCmInput = document.getElementById('lbm-height-cm');
    const heightFtInput = document.getElementById('lbm-height-ft');
    const heightInInput = document.getElementById('lbm-height-in');
    const ageInput = document.getElementById('lbm-age');

    // Controls
    const unitButtons = document.querySelectorAll('.lbm-unit-btn');
    const presetButtons = document.querySelectorAll('.lbm-preset-btn');
    const calculateBtn = document.getElementById('lbm-calculate-btn');
    const resetBtn = document.getElementById('lbm-reset-btn');

    // Output elements
    const resLbmValue = document.getElementById('res-lbm-value');
    const resLbmPercent = document.getElementById('res-lbm-percent');
    const resFatValue = document.getElementById('res-fat-value');
    const resFatPercent = document.getElementById('res-fat-percent');
    const resTbwValue = document.getElementById('res-tbw-value');
    const resFfmiValue = document.getElementById('res-ffmi-value');
    const resFfmiStatus = document.getElementById('res-ffmi-status');
    const resWeightDisplay = document.getElementById('res-weight-display');
    const barLeanSegment = document.getElementById('bar-lean-segment');
    const barFatSegment = document.getElementById('bar-fat-segment');
    const comparisonTableBody = document.getElementById('lbm-comparison-table-body');

    // Unit Toggle
    unitButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            unitButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const newUnit = this.dataset.unit;

            if (newUnit !== currentUnit) {
                currentUnit = newUnit;
                if (currentUnit === 'imperial') {
                    // Convert kg to lbs
                    const curKg = parseFloat(weightInput.value) || 75;
                    weightInput.value = (curKg * 2.20462).toFixed(1);
                    weightLabel.textContent = 'Total Body Weight (lbs)';
                    weightSuffix.textContent = 'lbs';

                    // Convert cm to ft & in
                    const curCm = parseFloat(heightCmInput.value) || 178;
                    const totalInches = curCm / 2.54;
                    const feet = Math.floor(totalInches / 12);
                    const inches = (totalInches % 12).toFixed(1);
                    heightFtInput.value = feet;
                    heightInInput.value = inches;

                    heightMetricGroup.style.display = 'none';
                    heightImperialGroup.style.display = 'block';
                } else {
                    // Convert lbs to kg
                    const curLbs = parseFloat(weightInput.value) || 165;
                    weightInput.value = (curLbs / 2.20462).toFixed(1);
                    weightLabel.textContent = 'Total Body Weight (kg)';
                    weightSuffix.textContent = 'kg';

                    // Convert ft & in to cm
                    const ft = parseFloat(heightFtInput.value) || 5;
                    const inch = parseFloat(heightInInput.value) || 10;
                    const totalInches = (ft * 12) + inch;
                    heightCmInput.value = (totalInches * 2.54).toFixed(1);

                    heightMetricGroup.style.display = 'block';
                    heightImperialGroup.style.display = 'none';
                }
                calculateLBM();
            }
        });
    });

    // Preset Benchmarks
    presetButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            presetButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const gender = this.dataset.gender;
            const weightKg = parseFloat(this.dataset.weight);
            const heightCm = parseFloat(this.dataset.height);
            const age = parseInt(this.dataset.age, 10);

            // Set sex radio
            sexRadios.forEach(radio => {
                radio.checked = (radio.value === gender);
            });

            ageInput.value = age;

            if (currentUnit === 'metric') {
                weightInput.value = weightKg;
                heightCmInput.value = heightCm;
            } else {
                weightInput.value = (weightKg * 2.20462).toFixed(1);
                const totalIn = heightCm / 2.54;
                heightFtInput.value = Math.floor(totalIn / 12);
                heightInInput.value = (totalIn % 12).toFixed(1);
            }

            calculateLBM();
        });
    });

    function getSelectedSex() {
        for (const radio of sexRadios) {
            if (radio.checked) return radio.value;
        }
        return 'male';
    }

    function calculateLBM() {
        const sex = getSelectedSex();
        let weightKg = 0;
        let heightCm = 0;

        if (currentUnit === 'metric') {
            weightKg = parseFloat(weightInput.value) || 0;
            heightCm = parseFloat(heightCmInput.value) || 0;
        } else {
            const weightLbs = parseFloat(weightInput.value) || 0;
            weightKg = weightLbs / 2.20462;
            const ft = parseFloat(heightFtInput.value) || 0;
            const inches = parseFloat(heightInInput.value) || 0;
            heightCm = ((ft * 12) + inches) * 2.54;
        }

        if (weightKg <= 10 || heightCm <= 50) {
            return;
        }

        const isMale = (sex === 'male');

        // 1. Boer Formula (1984)
        let lbmBoer = 0;
        if (isMale) {
            lbmBoer = (0.407 * weightKg) + (0.267 * heightCm) - 19.2;
        } else {
            lbmBoer = (0.252 * weightKg) + (0.473 * heightCm) - 48.3;
        }

        // 2. James Formula (1976)
        let lbmJames = 0;
        const whRatio = weightKg / heightCm;
        if (isMale) {
            lbmJames = 1.1 * weightKg - 128 * Math.pow(whRatio, 2);
        } else {
            lbmJames = 1.07 * weightKg - 148 * Math.pow(whRatio, 2);
        }

        // 3. Hume Formula (1966)
        let lbmHume = 0;
        if (isMale) {
            lbmHume = (0.32810 * weightKg) + (0.33929 * heightCm) - 29.5336;
        } else {
            lbmHume = (0.29569 * weightKg) + (0.41813 * heightCm) - 43.2933;
        }

        // Boundary safety clamps
        lbmBoer = Math.min(weightKg * 0.96, Math.max(weightKg * 0.4, lbmBoer));
        lbmJames = Math.min(weightKg * 0.96, Math.max(weightKg * 0.4, lbmJames));
        lbmHume = Math.min(weightKg * 0.96, Math.max(weightKg * 0.4, lbmHume));

        const lbmAvg = (lbmBoer + lbmJames + lbmHume) / 3;

        // Baseline uses Boer (widely accepted clinical standard)
        const primaryLbmKg = lbmBoer;
        const primaryFatKg = Math.max(0, weightKg - primaryLbmKg);
        const primaryLbmPct = (primaryLbmKg / weightKg) * 100;
        const primaryFatPct = (primaryFatKg / weightKg) * 100;

        // Total Body Water (TBW) ~ 73.2% of fat-free mass
        const tbwLiters = primaryLbmKg * 0.732;

        // Fat-Free Mass Index (FFMI) = LBM(kg) / (Height in m)^2
        const heightM = heightCm / 100;
        const ffmi = primaryLbmKg / (heightM * heightM);

        let ffmiDesc = 'Normal Muscularity';
        if (isMale) {
            if (ffmi < 18) ffmiDesc = 'Below Average Muscularity';
            else if (ffmi < 20) ffmiDesc = 'Normal Muscularity';
            else if (ffmi < 22) ffmiDesc = 'Above Average / Athletic';
            else if (ffmi < 25) ffmiDesc = 'Exceptional Muscularity';
            else ffmiDesc = 'Superior / Elite (Near Natural Limit)';
        } else {
            if (ffmi < 15) ffmiDesc = 'Below Average Muscularity';
            else if (ffmi < 17) ffmiDesc = 'Normal Muscularity';
            else if (ffmi < 19) ffmiDesc = 'Above Average / Athletic';
            else if (ffmi < 22) ffmiDesc = 'Exceptional Muscularity';
            else ffmiDesc = 'Superior / Elite';
        }

        // Format outputs according to unit
        const massUnit = currentUnit === 'metric' ? 'kg' : 'lbs';
        const displayFactor = currentUnit === 'metric' ? 1 : 2.20462;

        resLbmValue.textContent = `${(primaryLbmKg * displayFactor).toFixed(1)} ${massUnit}`;
        resLbmPercent.textContent = `${primaryLbmPct.toFixed(1)}% of Total Weight`;

        resFatValue.textContent = `${(primaryFatKg * displayFactor).toFixed(1)} ${massUnit}`;
        resFatPercent.textContent = `${primaryFatPct.toFixed(1)}% Body Fat`;

        resTbwValue.textContent = `${tbwLiters.toFixed(1)} L`;
        resFfmiValue.textContent = `${ffmi.toFixed(1)} kg/m²`;
        resFfmiStatus.textContent = ffmiDesc;

        resWeightDisplay.textContent = `Total Scale Weight: ${(weightKg * displayFactor).toFixed(1)} ${massUnit}`;

        // Progress Stacked Bar
        const barLeanWidth = Math.min(100, Math.max(0, primaryLbmPct));
        const barFatWidth = Math.min(100, Math.max(0, primaryFatPct));
        barLeanSegment.style.width = `${barLeanWidth}%`;
        barLeanSegment.textContent = `Lean Mass (${primaryLbmPct.toFixed(1)}%)`;
        barFatSegment.style.width = `${barFatWidth}%`;
        barFatSegment.textContent = `Fat (${primaryFatPct.toFixed(1)}%)`;

        // Comparative Table
        const models = [
            {
                name: 'Boer Formula (1984)',
                lbm: lbmBoer,
                desc: 'Standard clinical reference for ICU intravenous dosing'
            },
            {
                name: 'James Formula (1976)',
                lbm: lbmJames,
                desc: 'First recognized anthropometric ratio model'
            },
            {
                name: 'Hume Formula (1966)',
                lbm: lbmHume,
                desc: 'Pharmacological body water & drug clearance standard'
            },
            {
                name: 'Consensus Average (Boer / James / Hume)',
                lbm: lbmAvg,
                desc: 'Blended multi-dataset average for fitness tracking'
            }
        ];

        comparisonTableBody.innerHTML = '';
        models.forEach((m, idx) => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--color-border-subtle)';
            if (idx === 0) {
                tr.style.background = 'rgba(59, 130, 246, 0.08)';
            }

            const lbmVal = m.lbm * displayFactor;
            const fatVal = Math.max(0, (weightKg - m.lbm) * displayFactor);
            const fatPct = Math.max(0, ((weightKg - m.lbm) / weightKg) * 100);

            tr.innerHTML = `
                <td style="padding: 10px 12px; font-weight: ${idx === 0 ? '700' : '600'};">
                    ${m.name} ${idx === 0 ? '<span style="font-size:0.75rem; background:rgba(59,130,246,0.2); color:#60a5fa; padding:2px 6px; border-radius:4px; margin-left:6px;">Baseline</span>' : ''}
                </td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 700; color: var(--color-primary);">
                    ${lbmVal.toFixed(1)} ${massUnit}
                </td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 600; color: #10b981;">
                    ${fatVal.toFixed(1)} ${massUnit}
                </td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 600; color: #f59e0b;">
                    ${fatPct.toFixed(1)}%
                </td>
                <td style="padding: 10px 12px; font-size: 0.82rem; color: var(--color-text-muted);">
                    ${m.desc}
                </td>
            `;
            comparisonTableBody.appendChild(tr);
        });
    }

    // Input listeners
    const inputs = [weightInput, heightCmInput, heightFtInput, heightInInput, ageInput];
    inputs.forEach(input => {
        if (input) input.addEventListener('input', calculateLBM);
    });

    sexRadios.forEach(radio => {
        radio.addEventListener('change', calculateLBM);
    });

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateLBM);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            sexRadios[0].checked = true;
            currentUnit = 'metric';
            unitButtons.forEach(b => b.classList.remove('active'));
            unitButtons[0].classList.add('active');

            weightInput.value = '75';
            weightLabel.textContent = 'Total Body Weight (kg)';
            weightSuffix.textContent = 'kg';

            heightCmInput.value = '178';
            heightMetricGroup.style.display = 'block';
            heightImperialGroup.style.display = 'none';

            ageInput.value = '30';
            calculateLBM();
        });
    }

    // Initial calculation
    calculateLBM();
});
