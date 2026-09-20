/**
 * Right Triangle Solver & Trigonometric Geometry Engine
 * CalculatorHub - Client-Side Vanilla JS
 */

document.addEventListener('DOMContentLoaded', function () {
    // Mode State
    let currentMode = 'legs'; // 'legs', 'leg-hyp', 'leg-angle', 'hyp-angle', 'area-leg'

    // Form controls
    const val1Input = document.getElementById('tri-val1');
    const val2Input = document.getElementById('tri-val2');
    const label1 = document.getElementById('tri-label1');
    const label2 = document.getElementById('tri-label2');
    const unit1 = document.getElementById('tri-unit1');
    const unit2 = document.getElementById('tri-unit2');
    const hint1 = document.getElementById('tri-hint1');
    const hint2 = document.getElementById('tri-hint2');
    const precisionSelect = document.getElementById('tri-precision');

    const modeButtons = document.querySelectorAll('.tri-mode-btn');
    const presetButtons = document.querySelectorAll('.tri-preset-btn');
    const calculateBtn = document.getElementById('tri-calculate-btn');
    const resetBtn = document.getElementById('tri-reset-btn');

    // Outputs
    const resSideA = document.getElementById('res-side-a');
    const resSideB = document.getElementById('res-side-b');
    const resSideC = document.getElementById('res-side-c');
    const resAngleAlpha = document.getElementById('res-angle-alpha');
    const resAngleAlphaRad = document.getElementById('res-angle-alpha-rad');
    const resAngleBeta = document.getElementById('res-angle-beta');
    const resAngleBetaRad = document.getElementById('res-angle-beta-rad');
    const resArea = document.getElementById('res-area');
    const resPerimeter = document.getElementById('res-perimeter');
    const resAltitude = document.getElementById('res-altitude');
    const resInradius = document.getElementById('res-inradius');
    const resCircumradius = document.getElementById('res-circumradius');
    const resSemiperimeter = document.getElementById('res-semiperimeter');
    const resRatio = document.getElementById('res-ratio');
    const trigTableBody = document.getElementById('tri-trig-table-body');
    const triSvg = document.getElementById('tri-svg');

    // Mode Configuration Map
    const modeConfigs = {
        'legs': {
            l1: 'Leg a (Opposite to α)', u1: 'units', h1: 'Length of vertical leg side a', v1: 3,
            l2: 'Leg b (Adjacent to α)', u2: 'units', h2: 'Length of base horizontal leg side b', v2: 4
        },
        'leg-hyp': {
            l1: 'Leg a', u1: 'units', h1: 'Length of one leg side (must be less than c)', v1: 3,
            l2: 'Hypotenuse c', u2: 'units', h2: 'Length of longest opposite right-angle side', v2: 5
        },
        'leg-angle': {
            l1: 'Leg a (Opposite to α)', u1: 'units', h1: 'Length of side opposite to acute angle α', v1: 1,
            l2: 'Acute Angle α', u2: 'degrees (°)', h2: 'Angle between 0° and 90°', v2: 30
        },
        'hyp-angle': {
            l1: 'Hypotenuse c', u1: 'units', h1: 'Length of hypotenuse side c', v1: 10,
            l2: 'Acute Angle α', u2: 'degrees (°)', h2: 'Angle opposite to leg a (0° to 90°)', v2: 36.87
        },
        'area-leg': {
            l1: 'Triangle Area (K)', u1: 'sq units', h1: 'Total enclosed 2D area (K = 0.5 · a · b)', v1: 6,
            l2: 'Leg a', u2: 'units', h2: 'Length of leg side a', v2: 3
        }
    };

    function applyMode(mode) {
        currentMode = mode;
        const cfg = modeConfigs[mode];
        if (!cfg) return;

        label1.textContent = cfg.l1;
        unit1.textContent = cfg.u1;
        hint1.textContent = cfg.h1;
        val1Input.value = cfg.v1;

        label2.textContent = cfg.l2;
        unit2.textContent = cfg.u2;
        hint2.textContent = cfg.h2;
        val2Input.value = cfg.v2;

        solveTriangle();
    }

    modeButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            modeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            applyMode(this.dataset.mode);
        });
    });

    presetButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            presetButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const mode = this.dataset.mode;
            currentMode = mode;

            modeButtons.forEach(b => {
                b.classList.toggle('active', b.dataset.mode === mode);
            });

            const cfg = modeConfigs[mode];
            label1.textContent = cfg.l1;
            unit1.textContent = cfg.u1;
            hint1.textContent = cfg.h1;
            val1Input.value = this.dataset.v1;

            label2.textContent = cfg.l2;
            unit2.textContent = cfg.u2;
            hint2.textContent = cfg.h2;
            val2Input.value = this.dataset.v2;

            solveTriangle();
        });
    });

    function solveTriangle() {
        const v1 = parseFloat(val1Input.value);
        const v2 = parseFloat(val2Input.value);
        const precision = parseInt(precisionSelect.value, 10) || 4;

        if (isNaN(v1) || isNaN(v2) || v1 <= 0 || v2 <= 0) {
            return;
        }

        let a = 0, b = 0, c = 0, alphaDeg = 0, betaDeg = 0;

        try {
            if (currentMode === 'legs') {
                a = v1;
                b = v2;
                c = Math.sqrt(a * a + b * b);
                alphaDeg = Math.atan(a / b) * (180 / Math.PI);
                betaDeg = 90 - alphaDeg;
            } else if (currentMode === 'leg-hyp') {
                a = v1;
                c = v2;
                if (a >= c) {
                    alert('Error: Leg a must be strictly less than hypotenuse c.');
                    return;
                }
                b = Math.sqrt(c * c - a * a);
                alphaDeg = Math.asin(a / c) * (180 / Math.PI);
                betaDeg = 90 - alphaDeg;
            } else if (currentMode === 'leg-angle') {
                a = v1;
                alphaDeg = v2;
                if (alphaDeg <= 0 || alphaDeg >= 90) {
                    alert('Error: Acute angle α must be strictly between 0° and 90°.');
                    return;
                }
                const alphaRad = alphaDeg * (Math.PI / 180);
                betaDeg = 90 - alphaDeg;
                b = a / Math.tan(alphaRad);
                c = a / Math.sin(alphaRad);
            } else if (currentMode === 'hyp-angle') {
                c = v1;
                alphaDeg = v2;
                if (alphaDeg <= 0 || alphaDeg >= 90) {
                    alert('Error: Acute angle α must be strictly between 0° and 90°.');
                    return;
                }
                const alphaRad = alphaDeg * (Math.PI / 180);
                betaDeg = 90 - alphaDeg;
                a = c * Math.sin(alphaRad);
                b = c * Math.cos(alphaRad);
            } else if (currentMode === 'area-leg') {
                const area = v1;
                a = v2;
                b = (2 * area) / a;
                c = Math.sqrt(a * a + b * b);
                alphaDeg = Math.atan(a / b) * (180 / Math.PI);
                betaDeg = 90 - alphaDeg;
            }
        } catch (e) {
            console.error(e);
            return;
        }

        const alphaRad = alphaDeg * (Math.PI / 180);
        const betaRad = betaDeg * (Math.PI / 180);
        const area = 0.5 * a * b;
        const perimeter = a + b + c;
        const semiPerimeter = perimeter / 2;
        const altitude = (a * b) / c;
        const inradius = (a + b - c) / 2;
        const circumradius = c / 2;
        const legRatio = a / b;

        // Populate KPIs
        resSideA.textContent = a.toFixed(precision);
        resSideB.textContent = b.toFixed(precision);
        resSideC.textContent = c.toFixed(precision);

        resAngleAlpha.textContent = `${alphaDeg.toFixed(precision)}°`;
        resAngleAlphaRad.textContent = `${alphaRad.toFixed(precision)} rad`;

        resAngleBeta.textContent = `${betaDeg.toFixed(precision)}°`;
        resAngleBetaRad.textContent = `${betaRad.toFixed(precision)} rad`;

        resArea.textContent = area.toFixed(precision);
        resPerimeter.textContent = perimeter.toFixed(precision);
        resAltitude.textContent = altitude.toFixed(precision);

        resInradius.textContent = inradius.toFixed(precision);
        resCircumradius.textContent = circumradius.toFixed(precision);
        resSemiperimeter.textContent = semiPerimeter.toFixed(precision);
        resRatio.textContent = legRatio.toFixed(precision);

        // Render Dynamic SVG
        drawSvgTriangle(a, b, c, alphaDeg, betaDeg);

        // Populate Trig Function Table
        populateTrigTable(a, b, c, precision);
    }

    function drawSvgTriangle(a, b, c, alphaDeg, betaDeg) {
        // SVG dimensions: 320 x 220
        const svgW = 320;
        const svgH = 220;
        const marginX = 40;
        const marginY = 30;
        const maxDrawW = svgW - (marginX * 2); // 240
        const maxDrawH = svgH - (marginY * 2); // 160

        // Scale factors: Triangle vertex C is at bottom-left right angle (marginX, svgH - marginY)
        const scale = Math.min(maxDrawW / b, maxDrawH / a);
        const drawB = b * scale;
        const drawA = a * scale;

        const xC = marginX;
        const yC = svgH - marginY; // e.g. 190

        const xB = xC + drawB;
        const yB = yC;

        const xA = xC;
        const yA = yC - drawA;

        // Right angle marker size
        const sq = Math.min(16, Math.min(drawA, drawB) * 0.25);

        // Foot of altitude D on hypotenuse AB
        // Projection of vector CA on AB:
        // C=(xC, yC), A=(xA, yA), B=(xB, yB)
        const cA = (a * a) / c;
        const cB = (b * b) / c;
        const t = cB / c; // parameter from B towards A
        const xD = xB + (xA - xB) * t;
        const yD = yB + (yA - yB) * t;

        triSvg.innerHTML = `
            <!-- Triangle Area Fill -->
            <polygon points="${xC},${yC} ${xB},${yB} ${xA},${yA}" 
                fill="rgba(59, 130, 246, 0.12)" stroke="#3b82f6" stroke-width="2.5" stroke-linejoin="round" />

            <!-- Right Angle Square at C -->
            <path d="M ${xC + sq} ${yC} L ${xC + sq} ${yC - sq} L ${xC} ${yC - sq}" 
                fill="none" stroke="#60a5fa" stroke-width="1.5" />

            <!-- Altitude Line (Dashed) -->
            <line x1="${xC}" y1="${yC}" x2="${xD}" y2="${yD}" 
                stroke="#ec4899" stroke-width="1.8" stroke-dasharray="4,4" />

            <!-- Vertex Dots -->
            <circle cx="${xC}" cy="${yC}" r="4" fill="#3b82f6" />
            <circle cx="${xB}" cy="${yB}" r="4" fill="#10b981" />
            <circle cx="${xA}" cy="${yA}" r="4" fill="#f59e0b" />

            <!-- Vertex Labels -->
            <text x="${xC - 16}" y="${yC + 16}" fill="#94a3b8" font-size="12" font-weight="700">C (90°)</text>
            <text x="${xB + 6}" y="${yB + 16}" fill="#10b981" font-size="12" font-weight="700">B (α)</text>
            <text x="${xA - 18}" y="${yA - 6}" fill="#f59e0b" font-size="12" font-weight="700">A (β)</text>

            <!-- Side Labels -->
            <!-- Leg a (Vertical) -->
            <text x="${xC - 12}" y="${(yC + yA) / 2}" fill="#f59e0b" font-size="11" font-weight="600" text-anchor="end">a = ${a.toFixed(1)}</text>
            <!-- Leg b (Base) -->
            <text x="${(xC + xB) / 2}" y="${yC + 18}" fill="#10b981" font-size="11" font-weight="600" text-anchor="middle">b = ${b.toFixed(1)}</text>
            <!-- Hypotenuse c -->
            <text x="${(xA + xB) / 2 + 10}" y="${(yA + yB) / 2 - 8}" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="start">c = ${c.toFixed(1)}</text>
            <!-- Altitude hc label -->
            <text x="${(xC + xD) / 2 + 4}" y="${(yC + yD) / 2 + 10}" fill="#ec4899" font-size="10" font-style="italic">hc</text>
        `;
    }

    function populateTrigTable(a, b, c, prec) {
        const trigRows = [
            { fn: 'Sine (sin)', vA: a / c, fA: 'a / c = Opp / Hyp', vB: b / c, fB: 'b / c = Adj / Hyp' },
            { fn: 'Cosine (cos)', vA: b / c, fA: 'b / c = Adj / Hyp', vB: a / c, fB: 'a / c = Opp / Hyp' },
            { fn: 'Tangent (tan)', vA: a / b, fA: 'a / b = Opp / Adj', vB: b / a, fB: 'b / a = Adj / Opp' },
            { fn: 'Cotangent (cot)', vA: b / a, fA: 'b / a = 1 / tan', vB: a / b, fB: 'a / b = 1 / tan' },
            { fn: 'Secant (sec)', vA: c / b, fA: 'c / b = 1 / cos', vB: c / a, fB: 'c / a = 1 / cos' },
            { fn: 'Cosecant (csc)', vA: c / a, fA: 'c / a = 1 / sin', vB: c / b, fB: 'c / b = 1 / sin' }
        ];

        trigTableBody.innerHTML = '';
        trigRows.forEach(row => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--color-border-subtle)';
            tr.innerHTML = `
                <td style="padding: 10px 12px; font-weight: 700;">${row.fn}</td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 700; color: #3b82f6;">${row.vA.toFixed(prec)}</td>
                <td style="padding: 10px 12px; font-size: 0.82rem; color: var(--color-text-muted);">${row.fA}</td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 700; color: #10b981;">${row.vB.toFixed(prec)}</td>
                <td style="padding: 10px 12px; font-size: 0.82rem; color: var(--color-text-muted);">${row.fB}</td>
            `;
            trigTableBody.appendChild(tr);
        });
    }

    // Input event listeners
    [val1Input, val2Input].forEach(inp => {
        inp.addEventListener('input', solveTriangle);
    });

    precisionSelect.addEventListener('change', solveTriangle);

    if (calculateBtn) {
        calculateBtn.addEventListener('click', solveTriangle);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            modeButtons.forEach(b => b.classList.remove('active'));
            modeButtons[0].classList.add('active');
            presetButtons.forEach(b => b.classList.remove('active'));
            presetButtons[0].classList.add('active');
            applyMode('legs');
        });
    }

    // Initialize
    solveTriangle();
});
