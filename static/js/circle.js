/**
 * CalculatorHub - Circle (Area & Circumference) Calculator Engine
 * Planar Euclidean circle solver: multi-variable bidirectional recalculation,
 * sector arc trigonometry, concentric annulus, and dynamic SVG vector visualization.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Primary Metric Inputs
    const radiusInput = document.getElementById('circle-r-val');
    const diameterInput = document.getElementById('circle-d-val');
    const circumInput = document.getElementById('circle-c-val');
    const areaInput = document.getElementById('circle-a-val');
    const calcBtn = document.getElementById('circle-calc-btn');

    // Sector & Arc Inputs
    const angleInput = document.getElementById('circle-angle-val');
    const angleUnitBtns = document.querySelectorAll('.circle-angle-unit-btn');

    // Annulus Inputs
    const outerRInput = document.getElementById('circle-ann-R');
    const innerRInput = document.getElementById('circle-ann-r');

    // Outputs - Hero
    const primaryResult = document.getElementById('circle-primary-result');
    const secondaryResult = document.getElementById('circle-secondary-result');
    const resTitle = document.getElementById('circle-res-title');
    const formulaBadge = document.getElementById('circle-formula-badge');

    // Metrics Box
    const outRadius = document.getElementById('circle-out-r');
    const outDiameter = document.getElementById('circle-out-d');
    const outCircum = document.getElementById('circle-out-c');
    const outArea = document.getElementById('circle-out-a');

    // Sector Outputs
    const outArcLength = document.getElementById('circle-out-arc');
    const outSectorArea = document.getElementById('circle-out-sector-area');
    const outChord = document.getElementById('circle-out-chord');
    const outSegmentArea = document.getElementById('circle-out-segment-area');

    // Annulus Outputs
    const outAnnulusArea = document.getElementById('circle-out-annulus');
    const outAnnulusWidth = document.getElementById('circle-out-annulus-w');

    // SVG Canvas
    const svgCanvas = document.getElementById('circle-svg-canvas');

    let currentAngleUnit = 'deg'; // 'deg' or 'rad'
    let lastEdited = 'radius'; // 'radius', 'diameter', 'circum', 'area'

    // Track which field user touched last
    radiusInput.addEventListener('input', () => { lastEdited = 'radius'; solveCircle(); });
    diameterInput.addEventListener('input', () => { lastEdited = 'diameter'; solveCircle(); });
    circumInput.addEventListener('input', () => { lastEdited = 'circum'; solveCircle(); });
    areaInput.addEventListener('input', () => { lastEdited = 'area'; solveCircle(); });

    angleUnitBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const newUnit = this.dataset.unit;
            if (newUnit === currentAngleUnit) return;

            angleUnitBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const currentAngle = parseFloat(angleInput.value);
            if (!isNaN(currentAngle)) {
                if (newUnit === 'rad') {
                    angleInput.value = ((currentAngle * Math.PI) / 180).toFixed(4);
                } else {
                    angleInput.value = ((currentAngle * 180) / Math.PI).toFixed(2);
                }
            }
            currentAngleUnit = newUnit;
            solveCircle();
        });
    });

    [angleInput, outerRInput, innerRInput].forEach(el => {
        if (el) {
            el.addEventListener('input', solveCircle);
            el.addEventListener('change', solveCircle);
        }
    });

    if (calcBtn) {
        calcBtn.addEventListener('click', solveCircle);
    }

    function solveCircle() {
        let r = 0;

        if (lastEdited === 'radius') {
            r = parseFloat(radiusInput.value);
        } else if (lastEdited === 'diameter') {
            const d = parseFloat(diameterInput.value);
            r = d / 2;
        } else if (lastEdited === 'circum') {
            const c = parseFloat(circumInput.value);
            r = c / (2 * Math.PI);
        } else if (lastEdited === 'area') {
            const a = parseFloat(areaInput.value);
            r = Math.sqrt(a / Math.PI);
        }

        if (isNaN(r) || r <= 0) {
            showError('Please enter a positive non-zero dimension.');
            return;
        }

        const d = 2 * r;
        const c = 2 * Math.PI * r;
        const a = Math.PI * r * r;

        // Synchronize inputs without interrupting active input focus
        if (lastEdited !== 'radius') radiusInput.value = formatNum(r, 4);
        if (lastEdited !== 'diameter') diameterInput.value = formatNum(d, 4);
        if (lastEdited !== 'circum') circumInput.value = formatNum(c, 4);
        if (lastEdited !== 'area') areaInput.value = formatNum(a, 4);

        // Update Hero Card
        primaryResult.textContent = `Area = ${formatNum(a, 4)}`;
        secondaryResult.innerHTML = `Circumference: <strong>${formatNum(c, 4)}</strong> &bull; Diameter: <strong>${formatNum(d, 4)}</strong> &bull; Radius: <strong>${formatNum(r, 4)}</strong>`;

        if (outRadius) outRadius.textContent = formatNum(r, 4);
        if (outDiameter) outDiameter.textContent = formatNum(d, 4);
        if (outCircum) outCircum.textContent = formatNum(c, 4);
        if (outArea) outArea.textContent = formatNum(a, 4);

        // Sector & Arc Trigonometry
        let angleVal = parseFloat(angleInput.value) || 60;
        let thetaRad = currentAngleUnit === 'deg' ? (angleVal * Math.PI) / 180 : angleVal;

        // Bound theta between 0 and 2*pi for geometry
        const normTheta = Math.max(0, Math.min(2 * Math.PI, thetaRad));
        const arcLength = r * normTheta;
        const sectorArea = 0.5 * r * r * normTheta;
        const chordLength = 2 * r * Math.sin(normTheta / 2);
        const segmentArea = 0.5 * r * r * (normTheta - Math.sin(normTheta));

        if (outArcLength) outArcLength.textContent = formatNum(arcLength, 4);
        if (outSectorArea) outSectorArea.textContent = formatNum(sectorArea, 4);
        if (outChord) outChord.textContent = formatNum(chordLength, 4);
        if (outSegmentArea) outSegmentArea.textContent = formatNum(Math.max(0, segmentArea), 4);

        // Concentric Annulus
        const outerR = parseFloat(outerRInput.value) || (r * 1.5);
        const innerR = parseFloat(innerRInput.value) || r;
        if (outerR > innerR && innerR > 0) {
            const annArea = Math.PI * ((outerR * outerR) - (innerR * innerR));
            const annWidth = outerR - innerR;
            if (outAnnulusArea) outAnnulusArea.textContent = formatNum(annArea, 4);
            if (outAnnulusWidth) outAnnulusWidth.textContent = formatNum(annWidth, 4);
        } else {
            if (outAnnulusArea) outAnnulusArea.textContent = 'R must be > r';
            if (outAnnulusWidth) outAnnulusWidth.textContent = '—';
        }

        // Render Dynamic SVG Parabola/Circle Visualizer
        renderSvg(r, normTheta);
    }

    function renderSvg(radius, thetaRad) {
        if (!svgCanvas) return;

        const w = 400;
        const h = 280;
        const cx = w / 2;
        const cy = h / 2;
        const maxR = 95; // SVG drawing radius in px

        // Sweep coordinates for sector arc
        const startAngle = 0; // Starts at 3 o'clock (positive x-axis)
        const endAngle = -thetaRad; // Negative because SVG y is inverted downwards

        const startX = cx + maxR * Math.cos(startAngle);
        const startY = cy + maxR * Math.sin(startAngle);
        const endX = cx + maxR * Math.cos(endAngle);
        const endY = cy + maxR * Math.sin(endAngle);

        const largeArcFlag = thetaRad > Math.PI ? 1 : 0;

        let sectorPath = '';
        if (thetaRad >= 2 * Math.PI - 1e-4) {
            sectorPath = `<circle cx="${cx}" cy="${cy}" r="${maxR}" fill="rgba(59, 130, 246, 0.15)" stroke="none" />`;
        } else if (thetaRad > 0.001) {
            sectorPath = `
                <path d="M ${cx} ${cy} L ${startX} ${startY} A ${maxR} ${maxR} 0 ${largeArcFlag} 0 ${endX} ${endY} Z"
                      fill="rgba(59, 130, 246, 0.25)" stroke="#3b82f6" stroke-width="1.5" />
            `;
        }

        let svgHtml = `
            <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                </marker>
            </defs>

            <!-- Background Grid Rings -->
            <circle cx="${cx}" cy="${cy}" r="${maxR * 0.5}" fill="none" stroke="rgba(255, 255, 255, 0.05)" stroke-dasharray="3 3" />
            <circle cx="${cx}" cy="${cy}" r="${maxR}" fill="none" stroke="var(--color-border-light)" stroke-width="2" />

            <!-- Sector Area Fill -->
            ${sectorPath}

            <!-- Central Axes -->
            <line x1="${cx - maxR - 20}" y1="${cy}" x2="${cx + maxR + 20}" y2="${cy}" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
            <line x1="${cx}" y1="${cy - maxR - 20}" x2="${cx}" y2="${cy + maxR + 20}" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />

            <!-- Radius Line (to start of arc) -->
            <line x1="${cx}" y1="${cy}" x2="${startX}" y2="${startY}" stroke="#10b981" stroke-width="2.5" />

            <!-- Chord Line (if theta > 0) -->
            ${thetaRad > 0.05 && thetaRad < 2*Math.PI - 0.05 ? `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 3" />` : ''}

            <!-- Center Point -->
            <circle cx="${cx}" cy="${cy}" r="4.5" fill="#3b82f6" />
            <text x="${cx - 14}" y="${cy - 8}" fill="var(--color-text-muted)" font-size="12" font-weight="700">O</text>

            <!-- Radius Label -->
            <text x="${cx + (maxR / 2)}" y="${cy - 7}" fill="#10b981" font-size="12" font-weight="700" text-anchor="middle">r = ${formatNum(radius, 2)}</text>

            <!-- Arc Dimension Label -->
            <text x="${w - 15}" y="25" fill="var(--color-text-muted)" font-size="11" text-anchor="end">θ = ${(thetaRad * 180 / Math.PI).toFixed(1)}°</text>
        `;

        svgCanvas.innerHTML = svgHtml;
    }

    function showError(msg) {
        primaryResult.textContent = 'Invalid Input';
        secondaryResult.textContent = msg || 'Please verify circle radius or diameter.';
    }

    function formatNum(num, dec) {
        if (isNaN(num) || !isFinite(num)) return '—';
        return parseFloat(num.toFixed(dec || 4)).toLocaleString('en-US', { maximumFractionDigits: dec || 4 });
    }

    // Initial Execution
    solveCircle();
});
