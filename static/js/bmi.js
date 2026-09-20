/**
 * calculator_net - Modular BMI Calculator Engine
 * Pure Client-Side Vanilla JavaScript (Zero Page Reload)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Unit Tab Switching
    const tabUs = document.getElementById('tab-us');
    const tabMetric = document.getElementById('tab-metric');
    const usContainer = document.getElementById('us-inputs-container');
    const metricContainer = document.getElementById('metric-inputs-container');
    let currentUnit = 'us';

    if (tabUs && tabMetric) {
        tabUs.addEventListener('click', () => {
            currentUnit = 'us';
            tabUs.classList.add('active');
            tabUs.setAttribute('aria-selected', 'true');
            tabMetric.classList.remove('active');
            tabMetric.setAttribute('aria-selected', 'false');
            usContainer.style.display = 'block';
            metricContainer.style.display = 'none';
        });

        tabMetric.addEventListener('click', () => {
            currentUnit = 'metric';
            tabMetric.classList.add('active');
            tabMetric.setAttribute('aria-selected', 'true');
            tabUs.classList.remove('active');
            tabUs.setAttribute('aria-selected', 'false');
            metricContainer.style.display = 'block';
            usContainer.style.display = 'none';
        });
    }

    // 2. BMI Calculation Logic
    const bmiForm = document.getElementById('bmi-form');
    const clearBtn = document.getElementById('btn-clear-bmi');
    const resultPanel = document.getElementById('bmi-result-panel');
    const valueDisplay = document.getElementById('bmi-value-display');
    const statusBadge = document.getElementById('bmi-status-badge');
    const gaugeMarker = document.getElementById('bmi-gauge-marker');
    const markerVal = document.getElementById('marker-val');
    const healthyWeightRange = document.getElementById('bmi-healthy-weight-range');
    const primeVal = document.getElementById('bmi-prime-val');
    const ponderalVal = document.getElementById('bmi-ponderal-val');

    function calculateBMI(event) {
        if (event) {
            event.preventDefault(); // Prevent page reload strictly
        }

        let heightMeters = 0;
        let weightKg = 0;
        let heightInches = 0;

        if (currentUnit === 'us') {
            const ft = parseFloat(document.getElementById('bmi-height-ft').value) || 0;
            const inch = parseFloat(document.getElementById('bmi-height-in').value) || 0;
            const lbs = parseFloat(document.getElementById('bmi-weight-lbs').value) || 0;

            heightInches = (ft * 12) + inch;
            if (heightInches <= 0 || lbs <= 0) {
                alert('Please enter valid height and weight values.');
                return;
            }

            heightMeters = heightInches * 0.0254;
            weightKg = lbs * 0.45359237;
        } else {
            const cm = parseFloat(document.getElementById('bmi-height-cm').value) || 0;
            const kg = parseFloat(document.getElementById('bmi-weight-kg').value) || 0;

            if (cm <= 0 || kg <= 0) {
                alert('Please enter valid height and weight values.');
                return;
            }

            heightMeters = cm / 100;
            weightKg = kg;
            heightInches = cm / 2.54;
        }

        // Standard BMI formula: kg / (m^2)
        const bmi = weightKg / (heightMeters * heightMeters);
        const roundedBMI = Math.round(bmi * 10) / 10;

        // Determine WHO Classification Category
        let categoryName = 'Normal Weight';
        let badgeClass = 'badge-normal';

        if (bmi < 18.5) {
            categoryName = 'Underweight';
            badgeClass = 'badge-underweight';
        } else if (bmi < 25.0) {
            categoryName = 'Normal Weight';
            badgeClass = 'badge-normal';
        } else if (bmi < 30.0) {
            categoryName = 'Overweight';
            badgeClass = 'badge-overweight';
        } else if (bmi < 35.0) {
            categoryName = 'Obesity Class I';
            badgeClass = 'badge-obese1';
        } else if (bmi < 40.0) {
            categoryName = 'Obesity Class II';
            badgeClass = 'badge-obese2';
        } else {
            categoryName = 'Obesity Class III (Severe)';
            badgeClass = 'badge-obese3';
        }

        // Calculate Healthy Weight Range (BMI 18.5 - 24.9)
        const minHealthyKg = 18.5 * (heightMeters * heightMeters);
        const maxHealthyKg = 24.9 * (heightMeters * heightMeters);

        let healthyWeightText = '';
        if (currentUnit === 'us') {
            const minLbs = Math.round((minHealthyKg * 2.20462) * 10) / 10;
            const maxLbs = Math.round((maxHealthyKg * 2.20462) * 10) / 10;
            healthyWeightText = `${minLbs} – ${maxLbs} lbs`;
        } else {
            const minKg = Math.round(minHealthyKg * 10) / 10;
            const maxKg = Math.round(maxHealthyKg * 10) / 10;
            healthyWeightText = `${minKg} – ${maxKg} kg`;
        }

        // BMI Prime (BMI / 25)
        const bmiPrime = (bmi / 25).toFixed(2);

        // Ponderal Index (kg / m^3)
        const ponderal = (weightKg / Math.pow(heightMeters, 3)).toFixed(1);

        // Gauge scale position: mapped from 16 to 40
        let gaugePercent = ((bmi - 16) / (40 - 16)) * 100;
        gaugePercent = Math.max(3, Math.min(97, gaugePercent));

        // Update DOM elements instantly
        valueDisplay.textContent = roundedBMI.toFixed(1);
        statusBadge.textContent = categoryName;
        statusBadge.className = 'result-status-badge ' + badgeClass;

        if (gaugeMarker && markerVal) {
            gaugeMarker.style.left = `${gaugePercent}%`;
            markerVal.textContent = roundedBMI.toFixed(1);
        }

        healthyWeightRange.textContent = healthyWeightText;
        primeVal.textContent = bmiPrime;
        ponderalVal.textContent = `${ponderal} kg/m³`;

        resultPanel.style.display = 'block';
        resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (bmiForm) {
        bmiForm.addEventListener('submit', calculateBMI);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.getElementById('bmi-age').value = '25';
            document.getElementById('bmi-height-ft').value = '';
            document.getElementById('bmi-height-in').value = '';
            document.getElementById('bmi-weight-lbs').value = '';
            document.getElementById('bmi-height-cm').value = '';
            document.getElementById('bmi-weight-kg').value = '';
            resultPanel.style.display = 'none';
        });
    }

    // Auto-calculate initial state for user convenience
    calculateBMI(null);
});
