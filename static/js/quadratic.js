/**
 * CalculatorHub - Quadratic Equation Solver Engine
 * Complete algebraic quadratic formula solver, discriminant analysis,
 * canonical forms, and dynamic SVG parabola graphing canvas.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inputs
    const aInput = document.getElementById('quad-a-val');
    const bInput = document.getElementById('quad-b-val');
    const cInput = document.getElementById('quad-c-val');
    const calcBtn = document.getElementById('quad-calc-btn');
    const presetBtns = document.querySelectorAll('.quad-preset-btn');

    // Outputs - Primary
    const primaryResult = document.getElementById('quad-primary-result');
    const secondaryResult = document.getElementById('quad-secondary-result');
    const discVal = document.getElementById('quad-disc-val');
    const discBadge = document.getElementById('quad-disc-badge');
    const vertexVal = document.getElementById('quad-vertex-val');
    const axisVal = document.getElementById('quad-axis-val');
    const yIntVal = document.getElementById('quad-yint-val');
    const vertexFormVal = document.getElementById('quad-vform-val');
    const factoredFormVal = document.getElementById('quad-fform-val');

    // Canvas & Steps
    const svgCanvas = document.getElementById('quad-svg-graph');
    const stepsContainer = document.getElementById('quad-steps-container');

    const PRESETS = {
        two_real: { a: 1, b: -5, c: 6 },
        double_root: { a: 1, b: 6, c: 9 },
        complex: { a: 1, b: -2, c: 5 },
        inverted: { a: -1, b: 4, c: -3 }
    };

    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const key = this.dataset.preset;
            if (PRESETS[key]) {
                aInput.value = PRESETS[key].a;
                bInput.value = PRESETS[key].b;
                cInput.value = PRESETS[key].c;
                calculateQuadratic();
            }
        });
    });

    [aInput, bInput, cInput].forEach(el => {
        if (el) {
            el.addEventListener('input', calculateQuadratic);
            el.addEventListener('change', calculateQuadratic);
        }
    });

    if (calcBtn) {
        calcBtn.addEventListener('click', calculateQuadratic);
    }

    function calculateQuadratic() {
        const a = parseFloat(aInput.value);
        const b = parseFloat(bInput.value) || 0;
        const c = parseFloat(cInput.value) || 0;

        if (isNaN(a) || Math.abs(a) < 1e-12) {
            showError('Coefficient "a" must not be zero (otherwise linear equation).');
            return;
        }

        // Discriminant Delta = b^2 - 4ac
        const delta = (b * b) - (4 * a * c);

        // Vertex (h, k)
        const h = -b / (2 * a);
        const k = c - (b * b) / (4 * a);

        let root1Str = '';
        let root2Str = '';
        let root1Real = null;
        let root2Real = null;

        if (delta > 1e-11) {
            // Two distinct real roots
            const sqrtDelta = Math.sqrt(delta);
            root1Real = (-b + sqrtDelta) / (2 * a);
            root2Real = (-b - sqrtDelta) / (2 * a);

            root1Str = `x₁ = ${formatNum(root1Real, 5)}`;
            root2Str = `x₂ = ${formatNum(root2Real, 5)}`;

            primaryResult.innerHTML = `${root1Str} &nbsp;&bull;&nbsp; ${root2Str}`;
            secondaryResult.innerHTML = `Discriminant &Delta; = <strong>${formatNum(delta, 4)} &gt; 0</strong> &bull; Two distinct real roots.`;

            if (discBadge) {
                discBadge.textContent = 'Two Real Roots (Δ > 0)';
                discBadge.style.background = 'rgba(16, 185, 129, 0.15)';
                discBadge.style.color = 'var(--color-accent-emerald)';
            }
            if (factoredFormVal) {
                factoredFormVal.textContent = `y = ${a !== 1 ? formatNum(a, 3) : ''}(x ${root1Real >= 0 ? '- ' + formatNum(root1Real, 4) : '+ ' + formatNum(Math.abs(root1Real), 4)})(x ${root2Real >= 0 ? '- ' + formatNum(root2Real, 4) : '+ ' + formatNum(Math.abs(root2Real), 4)})`;
            }
        } else if (Math.abs(delta) <= 1e-11) {
            // One repeated real root
            root1Real = -b / (2 * a);
            root2Real = root1Real;

            root1Str = `x = ${formatNum(root1Real, 5)}`;
            primaryResult.innerHTML = `${root1Str} <span style="font-size: 0.95rem; font-weight: 600; color: var(--color-text-muted);">(Double Root)</span>`;
            secondaryResult.innerHTML = `Discriminant &Delta; = <strong>0</strong> &bull; Single repeated real root tangent to x-axis.`;

            if (discBadge) {
                discBadge.textContent = 'One Double Root (Δ = 0)';
                discBadge.style.background = 'rgba(59, 130, 246, 0.15)';
                discBadge.style.color = 'var(--color-accent-blue)';
            }
            if (factoredFormVal) {
                factoredFormVal.textContent = `y = ${a !== 1 ? formatNum(a, 3) : ''}(x ${root1Real >= 0 ? '- ' + formatNum(root1Real, 4) : '+ ' + formatNum(Math.abs(root1Real), 4)})²`;
            }
        } else {
            // Two complex conjugate roots
            const realPart = -b / (2 * a);
            const imagPart = Math.sqrt(-delta) / Math.abs(2 * a);

            root1Str = `${formatNum(realPart, 4)} + ${formatNum(imagPart, 4)}i`;
            root2Str = `${formatNum(realPart, 4)} - ${formatNum(imagPart, 4)}i`;

            primaryResult.innerHTML = `x = ${formatNum(realPart, 4)} &plusmn; ${formatNum(imagPart, 4)}i`;
            secondaryResult.innerHTML = `Discriminant &Delta; = <strong>${formatNum(delta, 4)} &lt; 0</strong> &bull; Two complex conjugate roots.`;

            if (discBadge) {
                discBadge.textContent = 'Complex Roots (Δ < 0)';
                discBadge.style.background = 'rgba(245, 158, 11, 0.15)';
                discBadge.style.color = 'var(--color-accent-amber)';
            }
            if (factoredFormVal) {
                factoredFormVal.textContent = 'Non-factorable over real numbers';
            }
        }

        // Analytical Metrics
        if (discVal) discVal.textContent = formatNum(delta, 4);
        if (vertexVal) vertexVal.textContent = `(${formatNum(h, 4)}, ${formatNum(k, 4)})`;
        if (axisVal) axisVal.textContent = `x = ${formatNum(h, 4)}`;
        if (yIntVal) yIntVal.textContent = `(0, ${formatNum(c, 4)})`;
        if (vertexFormVal) {
            const hSign = h >= 0 ? `- ${formatNum(h, 4)}` : `+ ${formatNum(Math.abs(h), 4)}`;
            const kSign = k >= 0 ? `+ ${formatNum(k, 4)}` : `- ${formatNum(Math.abs(k), 4)}`;
            vertexFormVal.textContent = `y = ${a !== 1 ? formatNum(a, 3) : ''}(x ${hSign})² ${kSign}`;
        }

        // Render Graph
        renderSvgGraph(a, b, c, h, k, root1Real, root2Real);

        // Render Steps
        renderSteps(a, b, c, delta, h, k, root1Str, root2Str);
    }

    function renderSvgGraph(a, b, c, h, k, r1, r2) {
        if (!svgCanvas) return;

        const w = 480;
        const hSvg = 260;

        // Determine view bounding box centered near vertex
        let spanX = 6;
        if (r1 !== null && r2 !== null) {
            const rootSpan = Math.abs(r1 - r2);
            spanX = Math.max(6, rootSpan * 1.6);
        }
        const minX = h - spanX / 2;
        const maxX = h + spanX / 2;

        let minY = k;
        let maxY = k;
        const samplePts = [];
        for (let i = 0; i <= 60; i++) {
            const x = minX + (maxX - minX) * (i / 60);
            const y = a * x * x + b * x + c;
            samplePts.push({ x, y });
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }

        // Include y=0 in bounds
        if (minY > 0) minY = -0.5;
        if (maxY < 0) maxY = 0.5;
        const spanY = Math.max(4, (maxY - minY) * 1.2);
        const yCenter = (minY + maxY) / 2;
        const actualMinY = yCenter - spanY / 2;
        const actualMaxY = yCenter + spanY / 2;

        // Coordinate transforms
        const toSvgX = (x) => ((x - minX) / (maxX - minX)) * w;
        const toSvgY = (y) => hSvg - ((y - actualMinY) / (actualMaxY - actualMinY)) * hSvg;

        let pathD = '';
        samplePts.forEach((pt, idx) => {
            const sx = toSvgX(pt.x);
            const sy = toSvgY(pt.y);
            pathD += idx === 0 ? `M ${sx.toFixed(1)} ${sy.toFixed(1)}` : ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
        });

        const axisX = toSvgY(0);
        const axisY = toSvgX(0);

        let elements = `
            <!-- Background Grid Lines -->
            <line x1="0" y1="${axisX.toFixed(1)}" x2="${w}" y2="${axisX.toFixed(1)}" stroke="var(--color-border-light)" stroke-width="1.5" stroke-dasharray="3,3" />
            <line x1="${axisY.toFixed(1)}" y1="0" x2="${axisY.toFixed(1)}" y2="${hSvg}" stroke="var(--color-border-light)" stroke-width="1.5" stroke-dasharray="3,3" />

            <!-- Parabola Curve -->
            <path d="${pathD}" fill="none" stroke="var(--color-accent-blue)" stroke-width="3" stroke-linecap="round" />

            <!-- Vertex Point -->
            <circle cx="${toSvgX(h).toFixed(1)}" cy="${toSvgY(k).toFixed(1)}" r="5" fill="#f59e0b" />
            <text x="${(toSvgX(h) + 8).toFixed(1)}" y="${(toSvgY(k) - 8).toFixed(1)}" fill="#f59e0b" font-size="11" font-weight="700">Vertex (${formatNum(h, 2)}, ${formatNum(k, 2)})</text>
        `;

        // Draw Real Roots if applicable
        if (r1 !== null) {
            elements += `
                <circle cx="${toSvgX(r1).toFixed(1)}" cy="${toSvgY(0).toFixed(1)}" r="5" fill="#10b981" />
                <text x="${(toSvgX(r1) - 15).toFixed(1)}" y="${(toSvgY(0) + 16).toFixed(1)}" fill="#10b981" font-size="11" font-weight="700">r₁: ${formatNum(r1, 2)}</text>
            `;
        }
        if (r2 !== null && Math.abs(r1 - r2) > 0.05) {
            elements += `
                <circle cx="${toSvgX(r2).toFixed(1)}" cy="${toSvgY(0).toFixed(1)}" r="5" fill="#10b981" />
                <text x="${(toSvgX(r2) - 15).toFixed(1)}" y="${(toSvgY(0) + 16).toFixed(1)}" fill="#10b981" font-size="11" font-weight="700">r₂: ${formatNum(r2, 2)}</text>
            `;
        }

        svgCanvas.innerHTML = elements;
    }

    function renderSteps(a, b, c, delta, h, k, r1, r2) {
        if (!stepsContainer) return;

        stepsContainer.innerHTML = `
            <div style="background: var(--color-bg-card-alt); border: 1px solid var(--color-border-light); border-radius: var(--border-radius-md); padding: 14px; margin-bottom: 12px;">
                <h5 style="font-size: 0.85rem; font-weight: 700; color: var(--color-accent-blue); margin-bottom: 6px;">1. Standard Form Equation</h5>
                <p style="font-size: 0.85rem; color: var(--color-text-muted); margin: 0;">
                    $$${formatNum(a, 4)}x^2 ${b >= 0 ? '+ ' + formatNum(b, 4) : '- ' + formatNum(Math.abs(b), 4)}x ${c >= 0 ? '+ ' + formatNum(c, 4) : '- ' + formatNum(Math.abs(c), 4)} = 0$$
                </p>
            </div>
            <div style="background: var(--color-bg-card-alt); border: 1px solid var(--color-border-light); border-radius: var(--border-radius-md); padding: 14px; margin-bottom: 12px;">
                <h5 style="font-size: 0.85rem; font-weight: 700; color: var(--color-accent-emerald); margin-bottom: 6px;">2. Discriminant Evaluation (&Delta; = b² - 4ac)</h5>
                <p style="font-size: 0.85rem; color: var(--color-text-muted); margin: 0;">
                    $$\\Delta = (${formatNum(b, 3)})^2 - 4(${formatNum(a, 3)})(${formatNum(c, 3)}) = ${formatNum(b * b, 3)} - (${formatNum(4 * a * c, 3)}) = \\mathbf{${formatNum(delta, 4)}}$$
                </p>
            </div>
            <div style="background: var(--color-bg-card-alt); border: 1px solid var(--color-border-light); border-radius: var(--border-radius-md); padding: 14px;">
                <h5 style="font-size: 0.85rem; font-weight: 700; color: var(--color-accent-amber); margin-bottom: 6px;">3. Quadratic Formula Application</h5>
                <p style="font-size: 0.85rem; color: var(--color-text-muted); margin: 0;">
                    $$x = \\frac{-(${formatNum(b, 3)}) \\pm \\sqrt{${formatNum(delta, 4)}}}{2(${formatNum(a, 3)})} \\implies \\mathbf{${primaryResult.textContent}}$$
                </p>
            </div>
        `;

        if (window.renderMathInElement) {
            renderMathInElement(stepsContainer, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ]
            });
        }
    }

    function showError(msg) {
        primaryResult.textContent = 'Invalid Input';
        secondaryResult.textContent = msg || 'Please verify coefficients.';
    }

    function formatNum(num, dec) {
        if (isNaN(num)) return 'NaN';
        if (Math.abs(num - Math.round(num)) < 1e-9) {
            return Math.round(num).toString();
        }
        return parseFloat(num.toFixed(dec)).toString();
    }

    // Initial Execution
    calculateQuadratic();
});
