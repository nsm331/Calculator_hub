/**
 * CalculatorHub - Physical Density Calculator Engine
 * Three-way solver (Density, Mass, Volume), multi-unit matrix, specific gravity, and buoyancy behavior.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mode Buttons
    const modeBtns = document.querySelectorAll('.density-mode-btn');
    const materialSelect = document.getElementById('density-material-select');

    // Inputs & Groups
    const densGroup = document.getElementById('density-val-group');
    const massGroup = document.getElementById('density-mass-group');
    const volGroup = document.getElementById('density-vol-group');

    const densInput = document.getElementById('density-val');
    const densUnit = document.getElementById('density-unit');

    const massInput = document.getElementById('density-mass');
    const massUnit = document.getElementById('density-mass-unit');

    const volInput = document.getElementById('density-vol');
    const volUnit = document.getElementById('density-vol-unit');

    const calcBtn = document.getElementById('density-calc-btn');

    // Results
    const resLabel = document.getElementById('density-res-label');
    const formulaBadge = document.getElementById('density-formula-badge');
    const primaryRes = document.getElementById('density-primary-res');
    const secondaryRes = document.getElementById('density-secondary-res');
    const sgVal = document.getElementById('density-sg-val');
    const buoyancyVal = document.getElementById('density-buoyancy-val');
    const buoyancySub = document.getElementById('density-buoyancy-sub');
    const siVal = document.getElementById('density-si-val');
    const matrixTbody = document.getElementById('density-matrix-tbody');

    // Unit conversion factors (Normalized to Base Units: Mass = g, Volume = cm³, Density = g/cm³)
    const MASS_FACTORS = {
        g: 1,
        kg: 1000,
        mg: 0.001,
        lb: 453.59237,
        oz: 28.349523125,
        ton_metric: 1000000
    };

    const VOL_FACTORS = {
        cm3: 1,
        ml: 1,
        m3: 1000000,
        l: 1000,
        in3: 16.387064,
        ft3: 28316.846592,
        gal_us: 3785.411784
    };

    const DENS_FACTORS = {
        g_cm3: 1,
        g_ml: 1,
        kg_l: 1,
        kg_m3: 0.001,
        lb_ft3: 0.016018463,
        lb_in3: 27.679904
    };

    let currentSolve = 'density'; // 'density', 'mass', 'volume'

    // Mode Switcher
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentSolve = this.dataset.solve;
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateUIForSolveMode();
            calculateDensity();
        });
    });

    function updateUIForSolveMode() {
        if (currentSolve === 'density') {
            densInput.disabled = true;
            densInput.style.opacity = '0.7';
            massInput.disabled = false;
            massInput.style.opacity = '1';
            volInput.disabled = false;
            volInput.style.opacity = '1';
            resLabel.textContent = 'Calculated Density (ρ)';
            formulaBadge.textContent = 'ρ = m / V';
        } else if (currentSolve === 'mass') {
            densInput.disabled = false;
            densInput.style.opacity = '1';
            massInput.disabled = true;
            massInput.style.opacity = '0.7';
            volInput.disabled = false;
            volInput.style.opacity = '1';
            resLabel.textContent = 'Calculated Mass (m)';
            formulaBadge.textContent = 'm = ρ · V';
        } else if (currentSolve === 'volume') {
            densInput.disabled = false;
            densInput.style.opacity = '1';
            massInput.disabled = false;
            massInput.style.opacity = '1';
            volInput.disabled = true;
            volInput.style.opacity = '0.7';
            resLabel.textContent = 'Calculated Volume (V)';
            formulaBadge.textContent = 'V = m / ρ';
        }
    }

    // Material Selection
    if (materialSelect) {
        materialSelect.addEventListener('change', function() {
            const val = this.value;
            if (val === 'custom') return;
            const densityGcm3 = parseFloat(val);
            if (isNaN(densityGcm3)) return;

            // Convert to selected density unit
            const unit = densUnit.value;
            const factor = DENS_FACTORS[unit] || 1;
            const converted = densityGcm3 / factor;
            densInput.value = formatNumber(converted, 6);

            // If in density mode, switch to mass solving to make preset practical
            if (currentSolve === 'density') {
                currentSolve = 'mass';
                modeBtns.forEach(b => b.classList.remove('active'));
                const massBtn = document.querySelector('.density-mode-btn[data-solve="mass"]');
                if (massBtn) massBtn.classList.add('active');
                updateUIForSolveMode();
            }

            calculateDensity();
        });
    }

    // Input listeners
    [densInput, densUnit, massInput, massUnit, volInput, volUnit].forEach(el => {
        if (el) {
            el.addEventListener('input', calculateDensity);
            el.addEventListener('change', calculateDensity);
        }
    });

    if (calcBtn) {
        calcBtn.addEventListener('click', calculateDensity);
    }

    function calculateDensity() {
        let densityGcm3 = 1;

        if (currentSolve === 'density') {
            const massRaw = parseFloat(massInput.value);
            const volRaw = parseFloat(volInput.value);

            if (isNaN(massRaw) || massRaw <= 0 || isNaN(volRaw) || volRaw <= 0) {
                primaryRes.textContent = 'Invalid Input';
                return;
            }

            const massG = massRaw * (MASS_FACTORS[massUnit.value] || 1);
            const volCm3 = volRaw * (VOL_FACTORS[volUnit.value] || 1);
            densityGcm3 = massG / volCm3;

            // Convert back to current density unit
            const unitFactor = DENS_FACTORS[densUnit.value] || 1;
            const resVal = densityGcm3 / unitFactor;
            densInput.value = formatNumber(resVal, 6);

            primaryRes.textContent = `${formatNumber(resVal, 6)} ${getDensityUnitLabel(densUnit.value)}`;
            secondaryRes.innerHTML = `Equivalent: <strong>${(densityGcm3 * 1000).toLocaleString(undefined, {maximumFractionDigits: 2})} kg/m³</strong> &bull; <strong>${(densityGcm3 * 62.42796).toFixed(2)} lb/ft³</strong>`;

        } else if (currentSolve === 'mass') {
            const densRaw = parseFloat(densInput.value);
            const volRaw = parseFloat(volInput.value);

            if (isNaN(densRaw) || densRaw <= 0 || isNaN(volRaw) || volRaw <= 0) {
                primaryRes.textContent = 'Invalid Input';
                return;
            }

            densityGcm3 = densRaw * (DENS_FACTORS[densUnit.value] || 1);
            const volCm3 = volRaw * (VOL_FACTORS[volUnit.value] || 1);
            const massG = densityGcm3 * volCm3;

            // Convert to selected mass unit
            const unitFactor = MASS_FACTORS[massUnit.value] || 1;
            const resVal = massG / unitFactor;
            massInput.value = formatNumber(resVal, 6);

            primaryRes.textContent = `${formatNumber(resVal, 6)} ${getMassUnitLabel(massUnit.value)}`;
            secondaryRes.innerHTML = `Density: <strong>${(densityGcm3 * 1000).toLocaleString(undefined, {maximumFractionDigits: 2})} kg/m³</strong> &bull; Volume: <strong>${formatNumber(volRaw, 4)} ${volUnit.value}</strong>`;

        } else if (currentSolve === 'volume') {
            const massRaw = parseFloat(massInput.value);
            const densRaw = parseFloat(densInput.value);

            if (isNaN(massRaw) || massRaw <= 0 || isNaN(densRaw) || densRaw <= 0) {
                primaryRes.textContent = 'Invalid Input';
                return;
            }

            const massG = massRaw * (MASS_FACTORS[massUnit.value] || 1);
            densityGcm3 = densRaw * (DENS_FACTORS[densUnit.value] || 1);
            const volCm3 = massG / densityGcm3;

            // Convert to selected volume unit
            const unitFactor = VOL_FACTORS[volUnit.value] || 1;
            const resVal = volCm3 / unitFactor;
            volInput.value = formatNumber(resVal, 6);

            primaryRes.textContent = `${formatNumber(resVal, 6)} ${getVolUnitLabel(volUnit.value)}`;
            secondaryRes.innerHTML = `Equivalent to: <strong>${(volCm3 / 1000).toFixed(4)} Liters</strong> &bull; <strong>${(volCm3 / 28316.85).toFixed(4)} ft³</strong>`;
        }

        // Specific Gravity (SG = rho / rho_water at 4°C, where rho_water = 1.0 g/cm³)
        const sg = densityGcm3;
        sgVal.textContent = sg.toFixed(4);

        // Buoyancy in Water
        if (sg < 0.999) {
            buoyancyVal.textContent = '🏊 Floats in Water';
            buoyancyVal.style.color = 'var(--color-accent-blue, #3b82f6)';
            const submergedPct = (sg * 100).toFixed(1);
            buoyancySub.textContent = `Positive buoyancy: ~${submergedPct}% submerged, ${(100 - submergedPct).toFixed(1)}% above surface`;
        } else if (sg > 1.001) {
            buoyancyVal.textContent = '⚓ Sinks in Water';
            buoyancyVal.style.color = 'var(--color-accent-rose, #ef4444)';
            buoyancySub.textContent = `Negative buoyancy: Denser than pure water (SG > 1.0)`;
        } else {
            buoyancyVal.textContent = '⚖️ Neutrally Buoyant';
            buoyancyVal.style.color = 'var(--color-accent-emerald, #10b981)';
            buoyancySub.textContent = `Neutral equilibrium: density closely matches water at 4°C`;
        }

        // SI Standard
        const siDensity = densityGcm3 * 1000;
        siVal.textContent = `${siDensity.toLocaleString(undefined, {maximumFractionDigits: 2})} kg/m³`;

        // Update Matrix Table
        updateMatrixTable(densityGcm3);
    }

    function updateMatrixTable(rhoGcm3) {
        if (!matrixTbody) return;

        const rows = [
            { unit: 'g/cm³ (or g/mL)', mag: rhoGcm3.toFixed(6), type: 'CGS Standard / Metric Laboratory' },
            { unit: 'kg/m³', mag: (rhoGcm3 * 1000).toLocaleString(undefined, {maximumFractionDigits: 4}), type: 'SI Standard International Metric' },
            { unit: 'kg/L', mag: rhoGcm3.toFixed(6), type: 'Fluid Bulk Density' },
            { unit: 'lb/ft³', mag: (rhoGcm3 * 62.42796).toFixed(4), type: 'US Customary & British Imperial' },
            { unit: 'lb/in³', mag: (rhoGcm3 / 27.679904).toFixed(6), type: 'Aerospace & Mechanical Engineering' },
            { unit: 'oz/in³', mag: (rhoGcm3 * 0.5780367).toFixed(4), type: 'Imperial Light Engineering' },
            { unit: 'metric tons / m³', mag: rhoGcm3.toFixed(6), type: 'Bulk Maritime & Geological Cargo' }
        ];

        let html = '';
        rows.forEach(r => {
            html += `
                <tr style="border-bottom: 1px solid var(--color-border-light);">
                    <td style="padding: 8px 12px; font-weight: 600; color: var(--color-accent-blue);">${r.unit}</td>
                    <td style="padding: 8px 12px; font-weight: 700; color: var(--color-text-main);">${r.mag}</td>
                    <td style="padding: 8px 12px; color: var(--color-text-muted);">${r.type}</td>
                </tr>
            `;
        });

        matrixTbody.innerHTML = html;
    }

    function getDensityUnitLabel(u) {
        const map = {
            g_cm3: 'g/cm³',
            kg_m3: 'kg/m³',
            g_ml: 'g/mL',
            kg_l: 'kg/L',
            lb_ft3: 'lb/ft³',
            lb_in3: 'lb/in³'
        };
        return map[u] || u;
    }

    function getMassUnitLabel(u) {
        const map = {
            g: 'grams (g)',
            kg: 'kilograms (kg)',
            mg: 'milligrams (mg)',
            lb: 'pounds (lb)',
            oz: 'ounces (oz)',
            ton_metric: 'metric tons (t)'
        };
        return map[u] || u;
    }

    function getVolUnitLabel(u) {
        const map = {
            cm3: 'cm³ (mL)',
            m3: 'm³',
            l: 'liters (L)',
            ml: 'milliliters (mL)',
            in3: 'in³',
            ft3: 'ft³',
            gal_us: 'gallons (US)'
        };
        return map[u] || u;
    }

    function formatNumber(num, maxDec) {
        if (Math.abs(num - Math.round(num)) < 1e-9) {
            return Math.round(num).toString();
        }
        return parseFloat(num.toFixed(maxDec)).toString();
    }

    // Initial Execution
    updateUIForSolveMode();
    calculateDensity();
});
