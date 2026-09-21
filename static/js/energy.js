/**
 * CalculatorHub - Kinetic & Potential Energy Calculator Engine
 * Classical mechanics work-energy solver, gravitational potential,
 * mechanical conservation, free fall kinematics, and multi-unit conversions.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mode Buttons
    const modeBtns = document.querySelectorAll('.energy-mode-btn');
    const kineticSection = document.getElementById('energy-kinetic-section');
    const potentialSection = document.getElementById('energy-potential-section');
    const conservationSection = document.getElementById('energy-conservation-section');

    // Kinetic Section Elements
    const keSolveSelect = document.getElementById('ke-solve-select');
    const keMassVal = document.getElementById('ke-mass-val');
    const keMassUnit = document.getElementById('ke-mass-unit');
    const keVelVal = document.getElementById('ke-vel-val');
    const keVelUnit = document.getElementById('ke-vel-unit');
    const keEnergyVal = document.getElementById('ke-energy-val');
    const keEnergyUnit = document.getElementById('ke-energy-unit');

    const keMassGroup = document.getElementById('ke-mass-group');
    const keVelGroup = document.getElementById('ke-vel-group');
    const keEnergyGroup = document.getElementById('ke-energy-group');

    // Potential Section Elements
    const peSolveSelect = document.getElementById('pe-solve-select');
    const peMassVal = document.getElementById('pe-mass-val');
    const peMassUnit = document.getElementById('pe-mass-unit');
    const peHeightVal = document.getElementById('pe-height-val');
    const peHeightUnit = document.getElementById('pe-height-unit');
    const peGravityVal = document.getElementById('pe-gravity-val');
    const pePlanetSelect = document.getElementById('pe-planet-select');
    const peEnergyVal = document.getElementById('pe-energy-val');
    const peEnergyUnit = document.getElementById('pe-energy-unit');

    const peMassGroup = document.getElementById('pe-mass-group');
    const peHeightGroup = document.getElementById('pe-height-group');
    const peGravityGroup = document.getElementById('pe-gravity-group');
    const peEnergyGroup = document.getElementById('pe-energy-group');

    // Conservation Section Elements
    const meMassVal = document.getElementById('me-mass-val');
    const meMassUnit = document.getElementById('me-mass-unit');
    const meHeightVal = document.getElementById('me-height-val');
    const meHeightUnit = document.getElementById('me-height-unit');
    const meGravitySelect = document.getElementById('me-gravity-select');

    // Hero Outputs
    const primaryResult = document.getElementById('energy-primary-result');
    const secondaryResult = document.getElementById('energy-secondary-result');
    const resTitle = document.getElementById('energy-res-title');
    const formulaBadge = document.getElementById('energy-formula-badge');

    // Matrix Table & Real-world Equivalents
    const matrixTbody = document.getElementById('energy-matrix-tbody');
    const eqSmartphoneVal = document.getElementById('energy-eq-phone');
    const eqFoodVal = document.getElementById('energy-eq-food');
    const eqTntVal = document.getElementById('energy-eq-tnt');
    const eqLedVal = document.getElementById('energy-eq-led');

    // Conversion Factors to SI (Mass -> kg, Velocity -> m/s, Height -> m, Energy -> Joules)
    const MASS_FACTORS = { kg: 1.0, g: 0.001, lb: 0.45359237, oz: 0.028349523125, ton: 1000.0 };
    const VEL_FACTORS = { m_s: 1.0, km_h: 1.0 / 3.6, mph: 0.44704, ft_s: 0.3048, knots: 0.514444 };
    const HEIGHT_FACTORS = { m: 1.0, ft: 0.3048, km: 1000.0, mi: 1609.344, cm: 0.01 };
    const ENERGY_FACTORS = {
        J: 1.0,
        kJ: 1000.0,
        MJ: 1000000.0,
        Wh: 3600.0,
        kWh: 3600000.0,
        cal: 4.184,
        kcal: 4184.0,
        ft_lbf: 1.3558179483314,
        BTU: 1055.05585,
        eV: 1.602176634e-19
    };

    let currentMode = 'kinetic'; // 'kinetic', 'potential', 'conservation'

    // Mode Toggle
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentMode = this.dataset.mode;
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            kineticSection.style.display = currentMode === 'kinetic' ? 'block' : 'none';
            potentialSection.style.display = currentMode === 'potential' ? 'block' : 'none';
            conservationSection.style.display = currentMode === 'conservation' ? 'block' : 'none';

            calculateEnergy();
        });
    });

    // Sub-mode Selectors
    if (keSolveSelect) {
        keSolveSelect.addEventListener('change', () => {
            const target = keSolveSelect.value;
            keEnergyGroup.style.display = target === 'energy' ? 'none' : 'block';
            keMassGroup.style.display = target === 'mass' ? 'none' : 'block';
            keVelGroup.style.display = target === 'vel' ? 'none' : 'block';
            calculateEnergy();
        });
    }

    if (peSolveSelect) {
        peSolveSelect.addEventListener('change', () => {
            const target = peSolveSelect.value;
            peEnergyGroup.style.display = target === 'energy' ? 'none' : 'block';
            peMassGroup.style.display = target === 'mass' ? 'none' : 'block';
            peHeightGroup.style.display = target === 'height' ? 'none' : 'block';
            calculateEnergy();
        });
    }

    if (pePlanetSelect && peGravityVal) {
        pePlanetSelect.addEventListener('change', () => {
            peGravityVal.value = pePlanetSelect.value;
            calculateEnergy();
        });
    }

    // Input Event Listeners
    const allInputs = [
        keMassVal, keMassUnit, keVelVal, keVelUnit, keEnergyVal, keEnergyUnit,
        peMassVal, peMassUnit, peHeightVal, peHeightUnit, peGravityVal, peEnergyVal, peEnergyUnit,
        meMassVal, meMassUnit, meHeightVal, meHeightUnit, meGravitySelect
    ];

    allInputs.forEach(el => {
        if (el) {
            el.addEventListener('input', calculateEnergy);
            el.addEventListener('change', calculateEnergy);
        }
    });

    function calculateEnergy() {
        let energyInJoules = 0;

        if (currentMode === 'kinetic') {
            resTitle.textContent = 'Calculated Kinetic Dynamics';
            formulaBadge.textContent = 'Ek = ½ · m · v²';

            const solveFor = keSolveSelect.value;
            const massRaw = parseFloat(keMassVal.value);
            const velRaw = parseFloat(keVelVal.value);
            const energyRaw = parseFloat(keEnergyVal.value);

            const mKg = massRaw * (MASS_FACTORS[keMassUnit.value] || 1);
            const vMs = velRaw * (VEL_FACTORS[keVelUnit.value] || 1);
            const eJ = energyRaw * (ENERGY_FACTORS[keEnergyUnit.value] || 1);

            if (solveFor === 'energy') {
                if (isNaN(massRaw) || massRaw < 0 || isNaN(velRaw)) {
                    showError();
                    return;
                }
                energyInJoules = 0.5 * mKg * vMs * vMs;
                primaryResult.textContent = `${formatOutput(energyInJoules)} Joules (J)`;
                secondaryResult.innerHTML = `Kinetic energy of <strong>${massRaw} ${keMassUnit.value}</strong> at <strong>${velRaw} ${keVelUnit.value}</strong> &bull; <strong>${formatOutput(energyInJoules / 1000)} kJ</strong>`;
            } else if (solveFor === 'mass') {
                if (isNaN(energyRaw) || energyRaw < 0 || isNaN(velRaw) || Math.abs(vMs) < 1e-12) {
                    showError('Velocity must not be zero to solve for mass.');
                    return;
                }
                const calcMassKg = (2 * eJ) / (vMs * vMs);
                const convertedMass = calcMassKg / (MASS_FACTORS[keMassUnit.value] || 1);
                energyInJoules = eJ;
                primaryResult.textContent = `${formatOutput(convertedMass)} ${keMassUnit.value}`;
                secondaryResult.innerHTML = `Required mass to generate <strong>${formatOutput(eJ)} J</strong> at <strong>${velRaw} ${keVelUnit.value}</strong>`;
            } else if (solveFor === 'vel') {
                if (isNaN(energyRaw) || energyRaw < 0 || isNaN(massRaw) || mKg <= 0) {
                    showError('Mass must be greater than zero.');
                    return;
                }
                const calcVelMs = Math.sqrt((2 * eJ) / mKg);
                const convertedVel = calcVelMs / (VEL_FACTORS[keVelUnit.value] || 1);
                energyInJoules = eJ;
                primaryResult.textContent = `${formatOutput(convertedVel)} ${keVelUnit.value}`;
                secondaryResult.innerHTML = `Velocity achieved: <strong>${calcVelMs.toFixed(3)} m/s</strong> (${(calcVelMs * 3.6).toFixed(2)} km/h &bull; ${(calcVelMs * 2.23694).toFixed(2)} mph)`;
            }

        } else if (currentMode === 'potential') {
            resTitle.textContent = 'Calculated Potential Energy';
            formulaBadge.textContent = 'Ep = m · g · h';

            const solveFor = peSolveSelect.value;
            const massRaw = parseFloat(peMassVal.value);
            const heightRaw = parseFloat(peHeightVal.value);
            const gVal = parseFloat(peGravityVal.value) || 9.80665;
            const energyRaw = parseFloat(peEnergyVal.value);

            const mKg = massRaw * (MASS_FACTORS[peMassUnit.value] || 1);
            const hM = heightRaw * (HEIGHT_FACTORS[peHeightUnit.value] || 1);
            const eJ = energyRaw * (ENERGY_FACTORS[peEnergyUnit.value] || 1);

            if (solveFor === 'energy') {
                if (isNaN(massRaw) || massRaw < 0 || isNaN(heightRaw)) {
                    showError();
                    return;
                }
                energyInJoules = mKg * gVal * hM;
                primaryResult.textContent = `${formatOutput(energyInJoules)} Joules (J)`;
                secondaryResult.innerHTML = `Gravitational potential of <strong>${massRaw} ${peMassUnit.value}</strong> at height <strong>${heightRaw} ${peHeightUnit.value}</strong> with g = ${gVal} m/s²`;
            } else if (solveFor === 'mass') {
                if (isNaN(energyRaw) || energyRaw < 0 || isNaN(heightRaw) || Math.abs(hM) < 1e-12 || gVal <= 0) {
                    showError();
                    return;
                }
                const calcMassKg = eJ / (gVal * hM);
                const convertedMass = calcMassKg / (MASS_FACTORS[peMassUnit.value] || 1);
                energyInJoules = eJ;
                primaryResult.textContent = `${formatOutput(convertedMass)} ${peMassUnit.value}`;
                secondaryResult.innerHTML = `Required mass: <strong>${formatOutput(calcMassKg)} kg</strong> to store ${formatOutput(eJ)} J at height ${heightRaw} ${peHeightUnit.value}`;
            } else if (solveFor === 'height') {
                if (isNaN(energyRaw) || energyRaw < 0 || isNaN(massRaw) || mKg <= 0 || gVal <= 0) {
                    showError();
                    return;
                }
                const calcHeightM = eJ / (mKg * gVal);
                const convertedHeight = calcHeightM / (HEIGHT_FACTORS[peHeightUnit.value] || 1);
                energyInJoules = eJ;
                primaryResult.textContent = `${formatOutput(convertedHeight)} ${peHeightUnit.value}`;
                secondaryResult.innerHTML = `Elevation required: <strong>${calcHeightM.toFixed(3)} meters</strong> (${(calcHeightM * 3.28084).toFixed(2)} ft)`;
            }

        } else if (currentMode === 'conservation') {
            resTitle.textContent = 'Conservation of Mechanical Energy';
            formulaBadge.textContent = 'E_total = Ek + Ep = Constant';

            const massRaw = parseFloat(meMassVal.value);
            const heightRaw = parseFloat(meHeightVal.value);
            const gVal = parseFloat(meGravitySelect.value) || 9.80665;

            if (isNaN(massRaw) || massRaw <= 0 || isNaN(heightRaw) || heightRaw < 0) {
                showError('Mass and drop height must be positive values.');
                return;
            }

            const mKg = massRaw * (MASS_FACTORS[meMassUnit.value] || 1);
            const hM = heightRaw * (HEIGHT_FACTORS[meHeightUnit.value] || 1);

            energyInJoules = mKg * gVal * hM;
            const vImpact = Math.sqrt(2 * gVal * hM);

            primaryResult.textContent = `${formatOutput(energyInJoules)} Joules (J)`;
            secondaryResult.innerHTML = `Free-Fall Impact Velocity: <strong>${vImpact.toFixed(2)} m/s</strong> (<strong>${(vImpact * 3.6).toFixed(2)} km/h</strong> &bull; <strong>${(vImpact * 2.23694).toFixed(2)} mph</strong>)`;
        }

        // Update Matrix Table and Equivalencies
        renderMatrix(energyInJoules);
        updateEquivalents(energyInJoules);
    }

    function renderMatrix(eJoules) {
        if (!matrixTbody) return;

        const rows = [
            { name: 'Joules (J)', factor: 1.0, desc: 'SI Coherent Base Unit (1 N·m = 1 kg·m²/s²)' },
            { name: 'Kilojoules (kJ)', factor: 1000.0, desc: 'Standard engineering & chemistry metric' },
            { name: 'Megajoules (MJ)', factor: 1000000.0, desc: 'High-energy industrial & ballistic scale' },
            { name: 'Watt-hours (Wh)', factor: 3600.0, desc: 'Electrical energy over 1 hour (3,600 J)' },
            { name: 'Kilowatt-hours (kWh)', factor: 3600000.0, desc: 'Utility electrical consumption (3.6 MJ)' },
            { name: 'Foot-pounds (ft·lbf)', factor: 1.3558179, desc: 'Imperial mechanical work standard' },
            { name: 'Calories (cal)', factor: 4.184, desc: 'Heat to raise 1g water by 1°C' },
            { name: 'Dietary Calories (kcal)', factor: 4184.0, desc: 'Nutritional food calorie (1,000 cal)' },
            { name: 'British Thermal Units (BTU)', factor: 1055.056, desc: 'HVAC & thermal heating metric' },
            { name: 'Electron-volts (eV)', factor: 1.6021766e-19, desc: 'Quantum particle physics energy' }
        ];

        let html = '';
        rows.forEach(r => {
            const converted = eJoules / r.factor;
            html += `
                <tr style="border-bottom: 1px solid var(--color-border-light);">
                    <td style="padding: 8px 12px; font-weight: 600; color: var(--color-accent-blue); white-space: nowrap;">${r.name}</td>
                    <td style="padding: 8px 12px; font-weight: 700; color: var(--color-text-main); font-family: monospace; white-space: nowrap;">${formatOutput(converted)}</td>
                    <td style="padding: 8px 12px; color: var(--color-text-muted); font-size: 0.8rem; min-width: 140px;">${r.desc}</td>
                </tr>
            `;
        });

        matrixTbody.innerHTML = html;
    }

    function updateEquivalents(eJoules) {
        if (eJoules <= 0) {
            if (eqSmartphoneVal) eqSmartphoneVal.textContent = '0 charges';
            if (eqFoodVal) eqFoodVal.textContent = '0 kcal';
            if (eqTntVal) eqTntVal.textContent = '0 g';
            if (eqLedVal) eqLedVal.textContent = '0 sec';
            return;
        }

        // Smartphone battery ≈ 12 Watt-hours = 43,200 Joules
        const phoneCharges = eJoules / 43200;
        if (eqSmartphoneVal) eqSmartphoneVal.textContent = phoneCharges >= 1 ? `${phoneCharges.toFixed(2)} full charges` : `${(phoneCharges * 100).toFixed(1)}% battery`;

        // Food kcal (1 kcal = 4,184 J)
        const kcal = eJoules / 4184;
        if (eqFoodVal) eqFoodVal.textContent = `${kcal.toFixed(2)} kcal`;

        // TNT equivalent: 1 gram TNT ≈ 4,184 Joules (same as 1 kcal)
        const tntGrams = eJoules / 4184;
        if (eqTntVal) eqTntVal.textContent = `${tntGrams.toFixed(2)} g TNT`;

        // 10W LED lightbulb runtime: seconds = Joules / 10 Watts
        const ledSeconds = eJoules / 10;
        if (eqLedVal) {
            if (ledSeconds < 60) eqLedVal.textContent = `${ledSeconds.toFixed(1)} sec`;
            else if (ledSeconds < 3600) eqLedVal.textContent = `${(ledSeconds / 60).toFixed(1)} min`;
            else eqLedVal.textContent = `${(ledSeconds / 3600).toFixed(1)} hrs`;
        }
    }

    function showError(msg) {
        primaryResult.textContent = 'Invalid Input';
        secondaryResult.textContent = msg || 'Please verify physical domain values.';
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
        return parseFloat(num.toFixed(4)).toString();
    }

    // Initial Execution
    calculateEnergy();
});
