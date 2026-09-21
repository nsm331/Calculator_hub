/**
 * CalculatorHub - Atmospheric Pressure Converter Engine
 * 14-unit hydrostatic matrix, instant dual-way converter, barometric altitude
 * hypsometry, water boiling point variation, and meteorological presets.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Dual-Way Converter Elements
    const fromValInput = document.getElementById('press-from-val');
    const fromUnitSelect = document.getElementById('press-from-unit');
    const toValInput = document.getElementById('press-to-val');
    const toUnitSelect = document.getElementById('press-to-unit');
    const swapBtn = document.getElementById('press-swap-btn');
    const calcBtn = document.getElementById('press-calc-btn');

    // Outputs - Hero
    const primaryResult = document.getElementById('press-primary-result');
    const secondaryResult = document.getElementById('press-secondary-result');
    const resTitle = document.getElementById('press-res-title');
    const formulaBadge = document.getElementById('press-formula-badge');

    // 14-Unit Matrix
    const matrixTbody = document.getElementById('press-matrix-tbody');

    // Barometric Altitude Elements
    const altInput = document.getElementById('press-alt-val');
    const altUnitSelect = document.getElementById('press-alt-unit');
    const altTempInput = document.getElementById('press-alt-temp');
    const altResVal = document.getElementById('press-alt-res');
    const altBoilVal = document.getElementById('press-alt-boil');

    // Preset Buttons
    const presetBtns = document.querySelectorAll('.press-preset-btn');

    // Unit Factors to Pascals (SI coherent base unit 1 Pa = 1 N/m²)
    const PRESSURE_UNITS = {
        atm: { name: 'Standard Atmosphere', symbol: 'atm', toPa: 101325.0, desc: 'Mean sea-level atmospheric standard (101.325 kPa)' },
        Pa: { name: 'Pascal', symbol: 'Pa', toPa: 1.0, desc: 'SI Base Coherent Unit (1 N/m² = 1 kg·m⁻¹·s⁻²)' },
        hPa: { name: 'Hectopascal', symbol: 'hPa', toPa: 100.0, desc: 'Meteorological standard (equivalent to 1 mbar)' },
        kPa: { name: 'Kilopascal', symbol: 'kPa', toPa: 1000.0, desc: 'Engineering & HVAC structural fluid pressure' },
        MPa: { name: 'Megapascal', symbol: 'MPa', toPa: 1000000.0, desc: 'High-pressure hydraulics & materials tensile strength' },
        bar: { name: 'Bar', symbol: 'bar', toPa: 100000.0, desc: 'Metric industrial standard (100,000 Pa)' },
        mbar: { name: 'Millibar', symbol: 'mbar', toPa: 100.0, desc: 'Meteorological barometric measurement' },
        psi: { name: 'Pounds per Square Inch', symbol: 'psi', toPa: 6894.757293168, desc: 'US Customary imperial standard (1 lbf/in²)' },
        mmHg: { name: 'Millimeter of Mercury / Torr', symbol: 'mmHg', toPa: 133.322387415, desc: 'Hydrostatic blood pressure & vacuum physics' },
        inHg: { name: 'Inches of Mercury', symbol: 'inHg', toPa: 3386.388666667, desc: 'Aviation altimeter setting standard' },
        mmH2O: { name: 'Millimeter of Water', symbol: 'mmH₂O', toPa: 9.80665, desc: 'Ventilation & low-differential gas pressure' },
        inH2O: { name: 'Inches of Water', symbol: 'inH₂O', toPa: 249.08891, desc: 'Building air pressure & HVAC ducting' },
        at: { name: 'Technical Atmosphere', symbol: 'at', toPa: 98066.5, desc: '1 Kilogram-force per square centimeter (1 kgf/cm²)' },
        ba: { name: 'Barye', symbol: 'Ba', toPa: 0.1, desc: 'CGS Gaussian unit (1 dyn/cm²)' }
    };

    // Preset Benchmarks
    const BENCHMARKS = {
        sealevel: { val: 1.0, unit: 'atm' },
        hurricane: { val: 870.0, unit: 'hPa' },
        airliner: { val: 750.0, unit: 'hPa' },
        everest: { val: 337.0, unit: 'hPa' },
        trench: { val: 108.6, unit: 'MPa' }
    };

    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const key = this.dataset.preset;
            if (BENCHMARKS[key]) {
                fromValInput.value = BENCHMARKS[key].val;
                fromUnitSelect.value = BENCHMARKS[key].unit;
                calculatePressure();
            }
        });
    });

    if (swapBtn) {
        swapBtn.addEventListener('click', function() {
            const tempUnit = fromUnitSelect.value;
            fromUnitSelect.value = toUnitSelect.value;
            toUnitSelect.value = tempUnit;

            const tempVal = fromValInput.value;
            if (toValInput && toValInput.value) {
                fromValInput.value = toValInput.value;
            }
            calculatePressure();
        });
    }

    [fromValInput, fromUnitSelect, toUnitSelect].forEach(el => {
        if (el) {
            el.addEventListener('input', calculatePressure);
            el.addEventListener('change', calculatePressure);
        }
    });

    if (calcBtn) {
        calcBtn.addEventListener('click', calculatePressure);
    }

    [altInput, altUnitSelect, altTempInput].forEach(el => {
        if (el) {
            el.addEventListener('input', calculateAltitudePressure);
            el.addEventListener('change', calculateAltitudePressure);
        }
    });

    function calculatePressure() {
        const rawVal = parseFloat(fromValInput.value);
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;

        if (isNaN(rawVal)) {
            showError('Please enter a valid numeric pressure value.');
            return;
        }

        const fromFactor = PRESSURE_UNITS[fromUnit]?.toPa || 1.0;
        const toFactor = PRESSURE_UNITS[toUnit]?.toPa || 1.0;

        // Convert to Pascals first, then to Target Unit
        const valInPa = rawVal * fromFactor;
        const convertedVal = valInPa / toFactor;

        if (toValInput) toValInput.value = formatVal(convertedVal);

        // Update Hero
        primaryResult.textContent = `${formatVal(convertedVal)} ${PRESSURE_UNITS[toUnit].symbol}`;
        secondaryResult.innerHTML = `<strong>${formatVal(rawVal)} ${PRESSURE_UNITS[fromUnit].symbol}</strong> = <strong>${formatVal(valInPa)} Pascals (Pa)</strong> &bull; <strong>${(valInPa / 101325).toFixed(4)} atm</strong>`;

        formulaBadge.textContent = `1 ${PRESSURE_UNITS[fromUnit].symbol} = ${(fromFactor / toFactor).toPrecision(6)} ${PRESSURE_UNITS[toUnit].symbol}`;

        // Render Comprehensive Matrix
        renderMatrix(valInPa, toUnit);

        // Calculate altitude equivalent if positive
        calculateAltitudePressure();
    }

    function renderMatrix(valInPa, activeUnitKey) {
        if (!matrixTbody) return;

        let html = '';
        for (const [key, u] of Object.entries(PRESSURE_UNITS)) {
            const val = valInPa / u.toPa;
            const isSelected = key === activeUnitKey;
            const rowStyle = isSelected ? 'style="background: rgba(59, 130, 246, 0.08); font-weight: 700;"' : '';
            const tag = isSelected ? ' <span style="background: var(--color-accent-blue); color:#fff; font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">Target</span>' : '';

            html += `
                <tr ${rowStyle} style="border-bottom: 1px solid var(--color-border-light);">
                    <td style="padding: 9px 12px; font-weight: 600; color: var(--color-text-main); white-space: nowrap;">${u.name} (${u.symbol})${tag}</td>
                    <td style="padding: 9px 12px; font-weight: 700; color: var(--color-accent-blue); font-family: monospace; white-space: nowrap;">${formatVal(val)}</td>
                    <td style="padding: 9px 12px; color: var(--color-text-muted); font-size: 0.82rem;">${u.desc}</td>
                </tr>
            `;
        }

        matrixTbody.innerHTML = html;
    }

    function calculateAltitudePressure() {
        if (!altResVal || !altBoilVal) return;

        const rawAlt = parseFloat(altInput.value);
        const altUnit = altUnitSelect.value;
        const tempC = parseFloat(altTempInput.value) || 15.0;

        if (isNaN(rawAlt)) {
            altResVal.textContent = '—';
            altBoilVal.textContent = '—';
            return;
        }

        // Convert Altitude to meters
        const altM = altUnit === 'ft' ? rawAlt * 0.3048 : rawAlt;
        const tempK = tempC + 273.15;

        // Barometric formula: P = P0 * exp(-M * g * h / (R * T))
        // M = 0.0289644 kg/mol, g = 9.80665 m/s2, R = 8.31446 J/(mol*K), P0 = 101325 Pa
        const scaleHeight = (8.31446 * tempK) / (0.0289644 * 9.80665);
        const pPa = 101325.0 * Math.exp(-altM / scaleHeight);
        const pkPa = pPa / 1000.0;
        const phPa = pPa / 100.0;

        altResVal.innerHTML = `<strong>${phPa.toFixed(1)} hPa</strong> (${pkPa.toFixed(2)} kPa &bull; ${(pPa / 101325).toFixed(3)} atm)`;

        // Water Boiling Point via Antoine Equation:
        // log10(P_mmHg) = A - B / (C + T_C)
        // For water: A = 8.07131, B = 1730.63, C = 233.426 (P in mmHg, T in °C)
        const pMmHg = pPa / 133.322387415;
        if (pMmHg > 1.0) {
            const logP = Math.log10(pMmHg);
            const boilingC = (1730.63 / (8.07131 - logP)) - 233.426;
            const boilingF = (boilingC * 9 / 5) + 32;
            altBoilVal.innerHTML = `<strong>${boilingC.toFixed(1)}°C</strong> (${boilingF.toFixed(1)}°F)`;
        } else {
            altBoilVal.textContent = '< 0°C (Sublimation)';
        }
    }

    function formatVal(num) {
        if (!isFinite(num)) return num.toString();
        const abs = Math.abs(num);
        if (abs === 0) return '0';
        if (abs >= 1e8 || (abs < 0.0001 && abs > 0)) {
            return num.toExponential(4);
        }
        if (abs >= 10000) {
            return num.toLocaleString('en-US', { maximumFractionDigits: 3 });
        }
        return parseFloat(num.toFixed(4)).toString();
    }

    function showError(msg) {
        primaryResult.textContent = 'Invalid Input';
        secondaryResult.textContent = msg || 'Please verify numerical pressure input.';
    }

    // Initial Execution
    calculatePressure();
});
