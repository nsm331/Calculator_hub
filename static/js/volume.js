/**
 * 3D Geometric Volume Calculator Engine
 * Solves Volume (V) and Surface Area (A) across 10 3D shapes:
 * Sphere, Cylinder, Cone, Rectangular Prism, Pyramid, Ellipsoid, Torus, Frustum, Triangular Prism, Hemisphere.
 * 100% Client-Side Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
    // Shape picker buttons
    const shapeBtns = document.querySelectorAll('.vol-shape-btn');
    const shapeSections = document.querySelectorAll('.vol-shape-form');
    let currentShape = 'cylinder'; // default

    const unitSelect = document.getElementById('vol-unit-select');

    // Outputs
    const volValEl = document.getElementById('vol-result-val');
    const volUnitTagEl = document.getElementById('vol-unit-tag');
    const areaValEl = document.getElementById('vol-area-val');
    const areaUnitTagEl = document.getElementById('vol-area-tag');
    const extraMetricEl = document.getElementById('vol-extra-metric');

    // Unit conversion breakdown elements
    const litersEl = document.getElementById('vol-conv-liters');
    const gallonsEl = document.getElementById('vol-conv-gallons');
    const cuMetersEl = document.getElementById('vol-conv-m3');
    const cuFeetEl = document.getElementById('vol-conv-ft3');

    // SVG preview container
    const svgContainer = document.getElementById('vol-svg-preview');

    function formatNumber(num) {
        if (isNaN(num) || !isFinite(num)) return '0.00';
        if (num >= 1e9 || (num < 0.001 && num > 0)) {
            return num.toExponential(4);
        }
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    }

    // Convert length from selected unit to meters
    const TO_METERS = {
        'cm': 0.01,
        'm': 1.0,
        'mm': 0.001,
        'in': 0.0254,
        'ft': 0.3048,
        'yd': 0.9144
    };

    function calculate() {
        const u = unitSelect ? unitSelect.value : 'cm';
        let volume = 0;
        let surfaceArea = 0;
        let extraInfo = '';

        if (currentShape === 'sphere') {
            const r = parseFloat(document.getElementById('sph-r').value) || 0;
            if (r > 0) {
                volume = (4 / 3) * Math.PI * Math.pow(r, 3);
                surfaceArea = 4 * Math.PI * Math.pow(r, 2);
                extraInfo = `Diameter = ${(2 * r).toFixed(2)} ${u}`;
            }
        } else if (currentShape === 'cylinder') {
            const r = parseFloat(document.getElementById('cyl-r').value) || 0;
            const h = parseFloat(document.getElementById('cyl-h').value) || 0;
            if (r > 0 && h > 0) {
                volume = Math.PI * Math.pow(r, 2) * h;
                const lateralArea = 2 * Math.PI * r * h;
                const baseArea = Math.PI * Math.pow(r, 2);
                surfaceArea = lateralArea + (2 * baseArea);
                extraInfo = `Lateral Area = ${lateralArea.toFixed(2)} ${u}², Base = ${baseArea.toFixed(2)} ${u}²`;
            }
        } else if (currentShape === 'cone') {
            const r = parseFloat(document.getElementById('cone-r').value) || 0;
            const h = parseFloat(document.getElementById('cone-h').value) || 0;
            if (r > 0 && h > 0) {
                volume = (1 / 3) * Math.PI * Math.pow(r, 2) * h;
                const slant = Math.sqrt(Math.pow(r, 2) + Math.pow(h, 2));
                surfaceArea = Math.PI * r * (r + slant);
                extraInfo = `Slant Height (s) = ${slant.toFixed(2)} ${u}`;
            }
        } else if (currentShape === 'box') {
            const l = parseFloat(document.getElementById('box-l').value) || 0;
            const w = parseFloat(document.getElementById('box-w').value) || 0;
            const h = parseFloat(document.getElementById('box-h').value) || 0;
            if (l > 0 && w > 0 && h > 0) {
                volume = l * w * h;
                surfaceArea = 2 * (l * w + l * h + w * h);
                const diag = Math.sqrt(Math.pow(l, 2) + Math.pow(w, 2) + Math.pow(h, 2));
                extraInfo = `Space Diagonal = ${diag.toFixed(2)} ${u}`;
            }
        } else if (currentShape === 'pyramid') {
            const l = parseFloat(document.getElementById('pyr-l').value) || 0;
            const w = parseFloat(document.getElementById('pyr-w').value) || 0;
            const h = parseFloat(document.getElementById('pyr-h').value) || 0;
            if (l > 0 && w > 0 && h > 0) {
                volume = (1 / 3) * l * w * h;
                const slL = Math.sqrt(Math.pow(w / 2, 2) + Math.pow(h, 2));
                const slW = Math.sqrt(Math.pow(l / 2, 2) + Math.pow(h, 2));
                surfaceArea = (l * w) + (l * slL) + (w * slW);
                extraInfo = `Base Area = ${(l * w).toFixed(2)} ${u}²`;
            }
        } else if (currentShape === 'ellipsoid') {
            const a = parseFloat(document.getElementById('elp-a').value) || 0;
            const b = parseFloat(document.getElementById('elp-b').value) || 0;
            const c = parseFloat(document.getElementById('elp-c').value) || 0;
            if (a > 0 && b > 0 && c > 0) {
                volume = (4 / 3) * Math.PI * a * b * c;
                const p = 1.6075;
                const pSum = (Math.pow(a * b, p) + Math.pow(a * c, p) + Math.pow(b * c, p)) / 3;
                surfaceArea = 4 * Math.PI * Math.pow(pSum, 1 / p);
                extraInfo = `Semi-axes = ${a} × ${b} × ${c} ${u}`;
            }
        } else if (currentShape === 'torus') {
            const R = parseFloat(document.getElementById('tor-R').value) || 0;
            const r = parseFloat(document.getElementById('tor-r').value) || 0;
            if (R > r && r > 0) {
                volume = 2 * Math.pow(Math.PI, 2) * R * Math.pow(r, 2);
                surfaceArea = 4 * Math.pow(Math.PI, 2) * R * r;
                extraInfo = `Outer Diameter = ${(2 * (R + r)).toFixed(2)} ${u}, Hole = ${(2 * (R - r)).toFixed(2)} ${u}`;
            } else {
                extraInfo = 'Error: Major radius (R) must be greater than minor radius (r)';
            }
        } else if (currentShape === 'frustum') {
            const R = parseFloat(document.getElementById('fru-R').value) || 0;
            const r = parseFloat(document.getElementById('fru-r').value) || 0;
            const h = parseFloat(document.getElementById('fru-h').value) || 0;
            if (R > 0 && r > 0 && h > 0) {
                volume = (1 / 3) * Math.PI * h * (Math.pow(R, 2) + (R * r) + Math.pow(r, 2));
                const s = Math.sqrt(Math.pow(R - r, 2) + Math.pow(h, 2));
                surfaceArea = Math.PI * (s * (R + r) + Math.pow(R, 2) + Math.pow(r, 2));
                extraInfo = `Slant Height (s) = ${s.toFixed(2)} ${u}`;
            }
        } else if (currentShape === 'triangular-prism') {
            const b = parseFloat(document.getElementById('tp-b').value) || 0;
            const h = parseFloat(document.getElementById('tp-h').value) || 0;
            const L = parseFloat(document.getElementById('tp-L').value) || 0;
            if (b > 0 && h > 0 && L > 0) {
                volume = 0.5 * b * h * L;
                // Assuming isosceles triangle for surface area
                const side = Math.sqrt(Math.pow(b / 2, 2) + Math.pow(h, 2));
                surfaceArea = (b * h) + (2 * side * L) + (b * L);
                extraInfo = `Triangular Base Area = ${(0.5 * b * h).toFixed(2)} ${u}²`;
            }
        } else if (currentShape === 'hemisphere') {
            const r = parseFloat(document.getElementById('hemi-r').value) || 0;
            if (r > 0) {
                volume = (2 / 3) * Math.PI * Math.pow(r, 3);
                surfaceArea = 3 * Math.PI * Math.pow(r, 2);
                extraInfo = `Curved Dome Area = ${(2 * Math.PI * Math.pow(r, 2)).toFixed(2)} ${u}²`;
            }
        }

        // Render main results
        if (volValEl) volValEl.textContent = formatNumber(volume);
        if (volUnitTagEl) volUnitTagEl.textContent = `${u}³`;
        if (areaValEl) areaValEl.textContent = formatNumber(surfaceArea);
        if (areaUnitTagEl) areaUnitTagEl.textContent = `${u}²`;
        if (extraMetricEl) extraMetricEl.textContent = extraInfo;

        // Convert to cubic meters to calculate multi-unit conversions
        const meterFactor = TO_METERS[u] || 0.01;
        const volumeInM3 = volume * Math.pow(meterFactor, 3);

        const liters = volumeInM3 * 1000;
        const gallons = volumeInM3 * 264.172; // US Liquid Gallons
        const cuFeet = volumeInM3 * 35.3147;

        if (litersEl) litersEl.textContent = formatNumber(liters);
        if (gallonsEl) gallonsEl.textContent = formatNumber(gallons);
        if (cuMetersEl) cuMetersEl.textContent = formatNumber(volumeInM3);
        if (cuFeetEl) cuFeetEl.textContent = formatNumber(cuFeet);

        // Update SVG wireframe illustration
        renderSvg(currentShape);
    }

    function renderSvg(shape) {
        if (!svgContainer) return;
        let svg = '';

        if (shape === 'sphere' || shape === 'hemisphere') {
            svg = `
                <circle cx="90" cy="70" r="50" fill="rgba(0,122,255,0.15)" stroke="var(--color-primary)" stroke-width="2"/>
                <ellipse cx="90" cy="70" rx="50" ry="16" fill="none" stroke="var(--color-primary)" stroke-width="1.5" stroke-dasharray="4,3"/>
                <line x1="90" y1="70" x2="140" y2="70" stroke="#f59e0b" stroke-width="2"/>
                <text x="110" y="65" fill="#f59e0b" font-size="11" font-weight="700">r</text>
            `;
        } else if (shape === 'cylinder') {
            svg = `
                <ellipse cx="90" cy="35" rx="45" ry="14" fill="rgba(0,122,255,0.2)" stroke="var(--color-primary)" stroke-width="2"/>
                <line x1="45" y1="35" x2="45" y2="105" stroke="var(--color-primary)" stroke-width="2"/>
                <line x1="135" y1="35" x2="135" y2="105" stroke="var(--color-primary)" stroke-width="2"/>
                <path d="M 45 105 A 45 14 0 0 0 135 105" fill="none" stroke="var(--color-primary)" stroke-width="2"/>
                <path d="M 45 105 A 45 14 0 0 1 135 105" fill="none" stroke="var(--color-primary)" stroke-width="1.5" stroke-dasharray="4,3"/>
                <line x1="90" y1="35" x2="135" y2="35" stroke="#f59e0b" stroke-width="2"/>
                <text x="105" y="30" fill="#f59e0b" font-size="11" font-weight="700">r</text>
                <line x1="145" y1="35" x2="145" y2="105" stroke="#10b981" stroke-width="1.5"/>
                <text x="152" y="75" fill="#10b981" font-size="11" font-weight="700">h</text>
            `;
        } else if (shape === 'cone') {
            svg = `
                <line x1="90" y1="20" x2="45" y2="110" stroke="var(--color-primary)" stroke-width="2"/>
                <line x1="90" y1="20" x2="135" y2="110" stroke="var(--color-primary)" stroke-width="2"/>
                <path d="M 45 110 A 45 14 0 0 0 135 110" fill="rgba(0,122,255,0.15)" stroke="var(--color-primary)" stroke-width="2"/>
                <path d="M 45 110 A 45 14 0 0 1 135 110" fill="none" stroke="var(--color-primary)" stroke-width="1.5" stroke-dasharray="4,3"/>
                <line x1="90" y1="20" x2="90" y2="110" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,2"/>
                <line x1="90" y1="110" x2="135" y2="110" stroke="#f59e0b" stroke-width="2"/>
                <text x="105" y="105" fill="#f59e0b" font-size="11" font-weight="700">r</text>
                <text x="75" y="70" fill="#10b981" font-size="11" font-weight="700">h</text>
            `;
        } else if (shape === 'box') {
            svg = `
                <!-- Back lines -->
                <line x1="55" y1="35" x2="125" y2="35" stroke="var(--color-primary)" stroke-width="1.5" stroke-dasharray="3,3"/>
                <line x1="55" y1="35" x2="55" y2="95" stroke="var(--color-primary)" stroke-width="1.5" stroke-dasharray="3,3"/>
                <line x1="55" y1="35" x2="35" y2="55" stroke="var(--color-primary)" stroke-width="1.5" stroke-dasharray="3,3"/>
                <!-- Front rect -->
                <rect x="35" y="55" width="70" height="60" fill="rgba(0,122,255,0.15)" stroke="var(--color-primary)" stroke-width="2"/>
                <!-- Connectors -->
                <line x1="105" y1="55" x2="125" y2="35" stroke="var(--color-primary)" stroke-width="2"/>
                <line x1="105" y1="115" x2="125" y2="95" stroke="var(--color-primary)" stroke-width="2"/>
                <line x1="125" y1="35" x2="125" y2="95" stroke="var(--color-primary)" stroke-width="2"/>
                <text x="65" y="128" fill="#f59e0b" font-size="11" font-weight="700">l</text>
                <text x="22" y="90" fill="#10b981" font-size="11" font-weight="700">h</text>
                <text x="120" y="60" fill="#ec4899" font-size="11" font-weight="700">w</text>
            `;
        } else {
            // General 3D polygonal wireframe
            svg = `
                <polygon points="90,20 40,110 140,110" fill="rgba(0,122,255,0.15)" stroke="var(--color-primary)" stroke-width="2"/>
                <line x1="90" y1="20" x2="90" y2="110" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,3"/>
                <text x="96" y="70" fill="#10b981" font-size="11" font-weight="700">h</text>
            `;
        }

        svgContainer.innerHTML = `<svg viewBox="0 0 180 140" style="width: 100%; height: 100%; max-height: 140px;">${svg}</svg>`;
    }

    // Switch shape buttons
    shapeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            shapeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentShape = btn.dataset.shape;

            shapeSections.forEach(sec => {
                sec.style.display = sec.id === `vol-sec-${currentShape}` ? 'block' : 'none';
            });

            calculate();
        });
    });

    if (unitSelect) unitSelect.addEventListener('change', calculate);

    // Add input listener on all inputs
    const allInputs = document.querySelectorAll('.vol-shape-form input');
    allInputs.forEach(inp => inp.addEventListener('input', calculate));

    // Run initial calculation
    calculate();
});
