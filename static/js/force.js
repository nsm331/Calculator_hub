/**
 * CalculatorHub - Newton Force Calculator Engine
 * Three-way kinematics solver (F = ma), planetary gravity weight, friction physics, and centripetal force.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mode Buttons
    const modeBtns = document.querySelectorAll('.force-mode-btn');
    const planetGroup = document.getElementById('force-planet-group');
    const planetSelect = document.getElementById('force-planet-select');

    // Input Groups
    const fGroup = document.getElementById('force-f-group');
    const mGroup = document.getElementById('force-m-group');
    const aGroup = document.getElementById('force-a-group');
    const muGroup = document.getElementById('force-mu-group');
    const vGroup = document.getElementById('force-v-group');
    const rGroup = document.getElementById('force-r-group');

    // Inputs & Units
    const fVal = document.getElementById('force-f-val');
    const fUnit = document.getElementById('force-f-unit');
    const mVal = document.getElementById('force-m-val');
    const mUnit = document.getElementById('force-m-unit');
    const aVal = document.getElementById('force-a-val');
    const aUnit = document.getElementById('force-a-unit');
    const aLabel = document.getElementById('force-a-label');
    const muVal = document.getElementById('force-mu-val');
    const vVal = document.getElementById('force-v-val');
    const vUnit = document.getElementById('force-v-unit');
    const rVal = document.getElementById('force-r-val');
    const rUnit = document.getElementById('force-r-unit');

    const calcBtn = document.getElementById('force-calc-btn');

    // Outputs
    const resTitle = document.getElementById('force-res-title');
    const formulaBadge = document.getElementById('force-formula-badge');
    const primaryResult = document.getElementById('force-primary-result');
    const secondaryResult = document.getElementById('force-secondary-result');
    const siVal = document.getElementById('force-si-val');
    const gVal = document.getElementById('force-g-val');
    const weightVal = document.getElementById('force-weight-val');
    const matrixTbody = document.getElementById('force-matrix-tbody');

    // Conversion factors to SI (Force: N, Mass: kg, Acceleration: m/s²)
    const FORCE_FACTORS = {
        N: 1.0,
        kN: 1000.0,
        lbf: 4.4482216152605,
        dyn: 0.00001,
        kgf: 9.80665,
        ozf: 0.27801385
    };

    const MASS_FACTORS = {
        kg: 1.0,
        g: 0.001,
        lb: 0.45359237,
        ton_metric: 1000.0,
        slug: 14.5939029,
        oz: 0.028349523125
    };

    const ACCEL_FACTORS = {
        m_s2: 1.0,
        ft_s2: 0.3048,
        g: 9.80665,
        cm_s2: 0.01
    };

    const VEL_FACTORS = {
        m_s: 1.0,
        km_h: 1.0 / 3.6,
        mph: 0.44704
    };

    const RAD_FACTORS = {
        m: 1.0,
        ft: 0.3048,
        km: 1000.0
    };

    let currentMode = 'solve_f'; // 'solve_f', 'solve_m', 'solve_a', 'gravity', 'friction', 'centripetal'

    // Mode Switching
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentMode = this.dataset.mode;
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateUI();
            calculateForce();
        });
    });

    function updateUI() {
        planetGroup.style.display = currentMode === 'gravity' ? 'block' : 'none';
        muGroup.style.display = currentMode === 'friction' ? 'block' : 'none';
        vGroup.style.display = currentMode === 'centripetal' ? 'block' : 'none';
        rGroup.style.display = currentMode === 'centripetal' ? 'block' : 'none';

        // Reset display and enabled states
        fGroup.style.display = 'block';
        mGroup.style.display = 'block';
        aGroup.style.display = 'block';

        fVal.disabled = false;
        fVal.style.opacity = '1';
        mVal.disabled = false;
        mVal.style.opacity = '1';
        aVal.disabled = false;
        aVal.style.opacity = '1';

        if (currentMode === 'solve_f') {
            fVal.disabled = true;
            fVal.style.opacity = '0.7';
            resTitle.textContent = 'Calculated Net Force (F)';
            formulaBadge.textContent = 'F = m · a';
            aLabel.textContent = 'Acceleration (a)';
        } else if (currentMode === 'solve_m') {
            mVal.disabled = true;
            mVal.style.opacity = '0.7';
            resTitle.textContent = 'Calculated Inertial Mass (m)';
            formulaBadge.textContent = 'm = F / a';
            aLabel.textContent = 'Acceleration (a)';
        } else if (currentMode === 'solve_a') {
            aVal.disabled = true;
            aVal.style.opacity = '0.7';
            resTitle.textContent = 'Calculated Acceleration (a)';
            formulaBadge.textContent = 'a = F / m';
            aLabel.textContent = 'Acceleration (a)';
        } else if (currentMode === 'gravity') {
            fVal.disabled = true;
            fVal.style.opacity = '0.7';
            aVal.disabled = true;
            aVal.style.opacity = '0.7';
            aLabel.textContent = 'Gravitational Acceleration (g)';
            const gPlanet = parseFloat(planetSelect.value) || 9.80665;
            aVal.value = (gPlanet / (ACCEL_FACTORS[aUnit.value] || 1)).toFixed(4);
            resTitle.textContent = 'Calculated Gravitational Weight (Fg)';
            formulaBadge.textContent = 'Fg = m · g';
        } else if (currentMode === 'friction') {
            aGroup.style.display = 'none';
            fVal.disabled = false;
            fVal.style.opacity = '1';
            mGroup.style.display = 'none';
            resTitle.textContent = 'Calculated Frictional Resistance Force (Ff)';
            formulaBadge.textContent = 'Ff = μ · FN';
        } else if (currentMode === 'centripetal') {
            aGroup.style.display = 'none';
            fVal.disabled = true;
            fVal.style.opacity = '0.7';
            resTitle.textContent = 'Calculated Centripetal Force (Fc)';
            formulaBadge.textContent = 'Fc = m · v² / r';
        }
    }

    if (planetSelect) {
        planetSelect.addEventListener('change', function() {
            const gPlanet = parseFloat(this.value) || 9.80665;
            aVal.value = (gPlanet / (ACCEL_FACTORS[aUnit.value] || 1)).toFixed(4);
            calculateForce();
        });
    }

    // Input listeners
    [fVal, fUnit, mVal, mUnit, aVal, aUnit, muVal, vVal, vUnit, rVal, rUnit].forEach(el => {
        if (el) {
            el.addEventListener('input', calculateForce);
            el.addEventListener('change', calculateForce);
        }
    });

    if (calcBtn) {
        calcBtn.addEventListener('click', calculateForce);
    }

    // Calculation Logic
    function calculateForce() {
        let forceN = 100;
        let massKg = 10;
        let accelMs2 = 10;

        if (currentMode === 'solve_f') {
            const mRaw = parseFloat(mVal.value);
            const aRaw = parseFloat(aVal.value);
            if (isNaN(mRaw) || mRaw < 0 || isNaN(aRaw)) {
                showError();
                return;
            }

            massKg = mRaw * (MASS_FACTORS[mUnit.value] || 1);
            accelMs2 = aRaw * (ACCEL_FACTORS[aUnit.value] || 1);
            forceN = massKg * accelMs2;

            const fConverted = forceN / (FORCE_FACTORS[fUnit.value] || 1);
            fVal.value = formatNum(fConverted, 6);

            primaryResult.textContent = `${formatNum(fConverted, 6)} ${fUnit.value}`;
            secondaryResult.innerHTML = `Equivalent: <strong>${(forceN / 4.44822).toFixed(2)} lbf</strong> &bull; <strong>${(forceN / 1000).toFixed(4)} kN</strong>`;

        } else if (currentMode === 'solve_m') {
            const fRaw = parseFloat(fVal.value);
            const aRaw = parseFloat(aVal.value);
            if (isNaN(fRaw) || fRaw < 0 || isNaN(aRaw) || Math.abs(aRaw) < 1e-12) {
                showError('Acceleration must not be zero.');
                return;
            }

            forceN = fRaw * (FORCE_FACTORS[fUnit.value] || 1);
            accelMs2 = aRaw * (ACCEL_FACTORS[aUnit.value] || 1);
            massKg = forceN / accelMs2;

            const mConverted = massKg / (MASS_FACTORS[mUnit.value] || 1);
            mVal.value = formatNum(mConverted, 6);

            primaryResult.textContent = `${formatNum(mConverted, 6)} ${mUnit.value}`;
            secondaryResult.innerHTML = `In SI Units: <strong>${formatNum(massKg, 4)} kg</strong> &bull; <strong>${(massKg * 2.20462).toFixed(2)} lbs</strong>`;

        } else if (currentMode === 'solve_a') {
            const fRaw = parseFloat(fVal.value);
            const mRaw = parseFloat(mVal.value);
            if (isNaN(fRaw) || isNaN(mRaw) || mRaw <= 0) {
                showError('Mass must be strictly greater than 0.');
                return;
            }

            forceN = fRaw * (FORCE_FACTORS[fUnit.value] || 1);
            massKg = mRaw * (MASS_FACTORS[mUnit.value] || 1);
            accelMs2 = forceN / massKg;

            const aConverted = accelMs2 / (ACCEL_FACTORS[aUnit.value] || 1);
            aVal.value = formatNum(aConverted, 6);

            primaryResult.textContent = `${formatNum(aConverted, 6)} ${aUnit.value}`;
            secondaryResult.innerHTML = `In SI Units: <strong>${formatNum(accelMs2, 4)} m/s²</strong> &bull; <strong>${(accelMs2 / 9.80665).toFixed(3)} g-force</strong>`;

        } else if (currentMode === 'gravity') {
            const mRaw = parseFloat(mVal.value);
            const gRaw = parseFloat(planetSelect.value) || 9.80665;
            if (isNaN(mRaw) || mRaw < 0) {
                showError();
                return;
            }

            massKg = mRaw * (MASS_FACTORS[mUnit.value] || 1);
            accelMs2 = gRaw;
            forceN = massKg * accelMs2;

            const fConverted = forceN / (FORCE_FACTORS[fUnit.value] || 1);
            fVal.value = formatNum(fConverted, 6);

            primaryResult.textContent = `${formatNum(fConverted, 6)} ${fUnit.value}`;
            secondaryResult.innerHTML = `Weight on celestial surface: <strong>${(forceN / 4.44822).toFixed(2)} lbf</strong> &bull; <strong>${(forceN / 9.80665).toFixed(2)} kgf</strong>`;

        } else if (currentMode === 'friction') {
            const nRaw = parseFloat(fVal.value);
            const mu = parseFloat(muVal.value) || 0;
            if (isNaN(nRaw) || nRaw < 0 || isNaN(mu) || mu < 0) {
                showError();
                return;
            }

            const normalN = nRaw * (FORCE_FACTORS[fUnit.value] || 1);
            forceN = mu * normalN;

            const fConverted = forceN / (FORCE_FACTORS[fUnit.value] || 1);

            primaryResult.textContent = `${formatNum(fConverted, 6)} ${fUnit.value}`;
            secondaryResult.innerHTML = `Normal Force FN = <strong>${formatNum(nRaw, 2)} ${fUnit.value}</strong> with μ = <strong>${mu.toFixed(2)}</strong>`;
            accelMs2 = 0;
            massKg = normalN / 9.80665;

        } else if (currentMode === 'centripetal') {
            const mRaw = parseFloat(mVal.value);
            const vRaw = parseFloat(vVal.value);
            const rRaw = parseFloat(rVal.value);

            if (isNaN(mRaw) || mRaw <= 0 || isNaN(vRaw) || isNaN(rRaw) || rRaw <= 0) {
                showError('Mass and radius must be greater than zero.');
                return;
            }

            massKg = mRaw * (MASS_FACTORS[mUnit.value] || 1);
            const vMs = vRaw * (VEL_FACTORS[vUnit.value] || 1);
            const rM = rRaw * (RAD_FACTORS[rUnit.value] || 1);

            accelMs2 = (vMs * vMs) / rM;
            forceN = massKg * accelMs2;

            const fConverted = forceN / (FORCE_FACTORS[fUnit.value] || 1);
            fVal.value = formatNum(fConverted, 6);

            primaryResult.textContent = `${formatNum(fConverted, 6)} ${fUnit.value}`;
            secondaryResult.innerHTML = `Centripetal Acceleration: <strong>${accelMs2.toFixed(3)} m/s²</strong> (${(accelMs2 / 9.80665).toFixed(2)} g)`;
        }

        // Update Indicators
        if (siVal) siVal.textContent = `${formatNum(forceN, 4)} N`;
        if (gVal) gVal.textContent = `${(accelMs2 / 9.80665).toFixed(3)} g`;
        if (weightVal) weightVal.textContent = `${(forceN / 9.80665).toFixed(3)} kgf`;

        // Update Multi-Unit Matrix
        updateMatrix(forceN);
    }

    function updateMatrix(fInNewtons) {
        if (!matrixTbody) return;

        const rows = [
            { sys: 'Newtons (N)', mag: fInNewtons.toFixed(4), desc: 'SI Base Metric Standard (kg·m/s²)' },
            { sys: 'Kilonewtons (kN)', mag: (fInNewtons / 1000).toFixed(6), desc: 'Heavy Civil & Structural Engineering' },
            { sys: 'Pounds-force (lbf)', mag: (fInNewtons / 4.4482216).toFixed(4), desc: 'US Customary & Aviation / Aerospace' },
            { sys: 'Ounces-force (ozf)', mag: (fInNewtons / 0.27801385).toFixed(4), desc: 'Precision Mechanical Instruments' },
            { sys: 'Kilograms-force (kgf)', mag: (fInNewtons / 9.80665).toFixed(4), desc: 'Gravitational Weight of 1 kg mass' },
            { sys: 'Dynes (dyn)', mag: (fInNewtons * 100000).toLocaleString(undefined, {maximumFractionDigits: 2}), desc: 'CGS Scientific Laboratory Physics' }
        ];

        let html = '';
        rows.forEach(r => {
            html += `
                <tr style="border-bottom: 1px solid var(--color-border-light);">
                    <td style="padding: 8px 12px; font-weight: 600; color: var(--color-accent-blue);">${r.sys}</td>
                    <td style="padding: 8px 12px; font-weight: 700; color: var(--color-text-main);">${r.mag}</td>
                    <td style="padding: 8px 12px; color: var(--color-text-muted);">${r.desc}</td>
                </tr>
            `;
        });
        matrixTbody.innerHTML = html;
    }

    function showError(msg) {
        primaryResult.textContent = 'Invalid Input';
        secondaryResult.textContent = msg || 'Please verify physical domain values.';
    }

    function formatNum(num, dec) {
        if (Math.abs(num - Math.round(num)) < 1e-9) {
            return Math.round(num).toString();
        }
        return parseFloat(num.toFixed(dec)).toString();
    }

    // Initial Execution
    updateUI();
    calculateForce();
});
