/**
 * 2D Function Graphing Tool Engine
 * 100% Vanilla JS - HTML5 Canvas Coordinate Plotter & Numerical Calculus
 */

document.addEventListener('DOMContentLoaded', () => {
    // Canvas & Context Setup
    const canvas = document.getElementById('function-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // DOM Controls
    const exprInput1 = document.getElementById('func-expr-1');
    const exprInput2 = document.getElementById('func-expr-2');
    const toggleFunc2 = document.getElementById('toggle-func-2');

    const xminInput = document.getElementById('view-xmin');
    const xmaxInput = document.getElementById('view-xmax');
    const yminInput = document.getElementById('view-ymin');
    const ymaxInput = document.getElementById('view-ymax');

    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnReset = document.getElementById('btn-reset-viewport');

    const hudCoords = document.getElementById('hud-coords');
    const hudSlope = document.getElementById('hud-slope');

    const evalXInput = document.getElementById('eval-x-val');
    const evalF1Val = document.getElementById('eval-f1-val');
    const evalF1Deriv = document.getElementById('eval-f1-deriv');
    const evalF1Status = document.getElementById('eval-f1-status');
    const evalF1Tangent = document.getElementById('eval-f1-tangent');
    const evalF2Card = document.getElementById('eval-f2-card');
    const evalF2Val = document.getElementById('eval-f2-val');
    const evalF2Diff = document.getElementById('eval-f2-diff');

    const presetPills = document.querySelectorAll('.preset-pill-btn');

    // Viewport State (Mathematical World Coordinates)
    let view = {
        xmin: -5,
        xmax: 5,
        ymin: -5,
        ymax: 5
    };

    // Interaction State
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let dragStartView = { ...view };
    let mousePos = null; // Canvas pixel position {x, y}

    // Function Presets Definitions
    const PRESETS = {
        cubic: { expr1: 'x^3 - 3*x', xmin: -3, xmax: 3, ymin: -4, ymax: 4 },
        sine: { expr1: 'sin(x)', xmin: -10, xmax: 10, ymin: -2, ymax: 2 },
        rational: { expr1: '1/x', xmin: -5, xmax: 5, ymin: -5, ymax: 5 },
        parabola: { expr1: 'x^2 - 4', xmin: -4, xmax: 4, ymin: -6, ymax: 10 },
        gaussian: { expr1: 'exp(-x^2)', xmin: -4, xmax: 4, ymin: -0.5, ymax: 1.5 },
        damped: { expr1: 'exp(-0.2*x) * cos(3*x)', xmin: -2, xmax: 12, ymin: -1.5, ymax: 1.5 }
    };

    // Expression Compiler: Safely converts string to f(x)
    function compileExpression(rawExpr) {
        if (!rawExpr || !rawExpr.trim()) return null;

        let sanitized = rawExpr.trim().toLowerCase();

        // Check for disallowed keywords to prevent code execution
        const disallowed = /(window|document|eval|function|console|alert|fetch|xmlhttprequest|cookie|localstorage|sessionstorage|script|prototype|constructor|this)/i;
        if (disallowed.test(sanitized)) {
            console.warn('Forbidden token in mathematical expression');
            return null;
        }

        // Implicit multiplication conversions
        // 2x -> 2*x
        sanitized = sanitized.replace(/(\d)\s*x/g, '$1*x');
        // x( -> x*(
        sanitized = sanitized.replace(/x\s*\(/g, 'x*(');
        // )x -> )*x
        sanitized = sanitized.replace(/\)\s*x/g, ')*x');
        // )( -> )*(
        sanitized = sanitized.replace(/\)\s*\(/g, ')*(');
        // digit( -> digit*(
        sanitized = sanitized.replace(/(\d)\s*\(/g, '$1*(');
        // )digit -> )*digit
        sanitized = sanitized.replace(/\)\s*(\d)/g, ')*$1');

        // Powers: replace ^ with **
        sanitized = sanitized.replace(/\^/g, '**');

        // Replace constants
        sanitized = sanitized.replace(/\bpi\b/g, 'Math.PI');
        sanitized = sanitized.replace(/\be\b/g, 'Math.E');

        // Replace supported math functions with Math.<func>
        const mathFuncs = [
            'sinh', 'cosh', 'tanh', 'asin', 'acos', 'atan',
            'sin', 'cos', 'tan', 'sqrt', 'cbrt', 'abs',
            'exp', 'round', 'floor', 'ceil'
        ];
        mathFuncs.forEach(fn => {
            const regex = new RegExp('\\b' + fn + '\\b', 'g');
            sanitized = sanitized.replace(regex, `Math.${fn}`);
        });

        // Special handling for log / ln
        sanitized = sanitized.replace(/\bln\b/g, 'Math.log');
        sanitized = sanitized.replace(/\blog10\b/g, 'Math.log10');
        sanitized = sanitized.replace(/\blog\b/g, 'Math.log10');

        // Security check: only allowed characters
        // Letters allowed: 'x', 'Math', and math function names
        const validCharsRegex = /^[0-9xX\.\+\-\*\/\%\(\)\,\s\=\>\<\!\:\?MathPIEsinhcotasqrtabexplongdcfr]+$/;
        if (!validCharsRegex.test(sanitized)) {
            return null;
        }

        try {
            const fn = new Function('x', `
                try {
                    const y = ${sanitized};
                    return (typeof y === 'number' && !isNaN(y)) ? y : NaN;
                } catch(e) {
                    return NaN;
                }
            `);
            // Quick test run
            fn(1);
            return fn;
        } catch (e) {
            return null;
        }
    }

    // High-resolution Retina Canvas Resizing
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        const displayWidth = Math.round(rect.width);
        const displayHeight = 480;

        if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
            canvas.width = displayWidth * dpr;
            canvas.height = displayHeight * dpr;
        }

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    // Coordinate Transformations
    function toScreenX(xw, width) {
        return ((xw - view.xmin) / (view.xmax - view.xmin)) * width;
    }

    function toScreenY(yw, height) {
        return ((view.ymax - yw) / (view.ymax - view.ymin)) * height;
    }

    function toWorldX(xp, width) {
        return view.xmin + (xp / width) * (view.xmax - view.xmin);
    }

    function toWorldY(yp, height) {
        return view.ymax - (yp / height) * (view.ymax - view.ymin);
    }

    // Compute Nice Adaptive Grid Step
    function calculateGridStep(range) {
        const roughSteps = range / 8;
        const exponent = Math.floor(Math.log10(roughSteps));
        const fraction = roughSteps / Math.pow(10, exponent);

        let niceFraction;
        if (fraction < 1.5) niceFraction = 1;
        else if (fraction < 3) niceFraction = 2;
        else if (fraction < 7) niceFraction = 5;
        else niceFraction = 10;

        return niceFraction * Math.pow(10, exponent);
    }

    // Main Canvas Render Loop
    function render() {
        resizeCanvas();
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = 480;

        // Clear Canvas Background (Sleek deep navy dark theme)
        ctx.fillStyle = '#0b1120';
        ctx.fillRect(0, 0, width, height);

        // Draw Coordinate Grid & Axes
        drawGrid(width, height);

        // Compile & Plot Functions
        const f1 = compileExpression(exprInput1.value);
        if (f1) {
            plotCurve(f1, '#38bdf8', width, height);
        }

        if (toggleFunc2.checked) {
            const f2 = compileExpression(exprInput2.value);
            if (f2) {
                plotCurve(f2, '#fb923c', width, height);
            }
        }

        // Draw Evaluated Point / Tangent Line
        drawEvaluatedPoint(f1, width, height);

        // Draw Interactive Crosshair & Cursor HUD
        if (mousePos && f1) {
            drawCursorTracer(f1, width, height);
        }
    }

    // Draw Grid & Axes
    function drawGrid(width, height) {
        const xStep = calculateGridStep(view.xmax - view.xmin);
        const yStep = calculateGridStep(view.ymax - view.ymin);

        // Grid Lines
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.font = '10px Inter, -apple-system, sans-serif';
        ctx.fillStyle = '#64748b';

        // Vertical grid lines (X)
        const firstX = Math.floor(view.xmin / xStep) * xStep;
        for (let x = firstX; x <= view.xmax; x += xStep) {
            const xp = toScreenX(x, width);
            ctx.beginPath();
            ctx.moveTo(xp, 0);
            ctx.lineTo(xp, height);
            ctx.stroke();

            // Label
            if (Math.abs(x) > 1e-6) {
                const label = parseFloat(x.toFixed(4)).toString();
                const yAxisPos = Math.min(Math.max(toScreenY(0, height) + 14, 14), height - 4);
                ctx.fillText(label, xp - 8, yAxisPos);
            }
        }

        // Horizontal grid lines (Y)
        const firstY = Math.floor(view.ymin / yStep) * yStep;
        for (let y = firstY; y <= view.ymax; y += yStep) {
            const yp = toScreenY(y, height);
            ctx.beginPath();
            ctx.moveTo(0, yp);
            ctx.lineTo(width, yp);
            ctx.stroke();

            // Label
            if (Math.abs(y) > 1e-6) {
                const label = parseFloat(y.toFixed(4)).toString();
                const xAxisPos = Math.min(Math.max(toScreenX(0, width) + 4, 4), width - 36);
                ctx.fillText(label, xAxisPos, yp + 4);
            }
        }

        // Primary Coordinate Axes (X = 0, Y = 0)
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';

        // X-Axis (y = 0)
        if (view.ymin <= 0 && view.ymax >= 0) {
            const y0 = toScreenY(0, height);
            ctx.beginPath();
            ctx.moveTo(0, y0);
            ctx.lineTo(width, y0);
            ctx.stroke();
        }

        // Y-Axis (x = 0)
        if (view.xmin <= 0 && view.xmax >= 0) {
            const x0 = toScreenX(0, width);
            ctx.beginPath();
            ctx.moveTo(x0, 0);
            ctx.lineTo(x0, height);
            ctx.stroke();
        }
    }

    // Plot Curve with Discontinuity & Asymptote Detection
    function plotCurve(fn, color, width, height) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.beginPath();
        let inPath = false;
        let prevYp = 0;
        let prevYw = 0;

        // Sample across screen pixels
        for (let xp = 0; xp <= width; xp++) {
            const xw = toWorldX(xp, width);
            const yw = fn(xw);

            if (isNaN(yw) || !isFinite(yw)) {
                if (inPath) {
                    ctx.stroke();
                    ctx.beginPath();
                    inPath = false;
                }
                continue;
            }

            const yp = toScreenY(yw, height);

            // Asymptote / Discontinuity Detection
            // If delta Y is gigantic and function sign flipped across a pole, break path
            if (inPath) {
                const deltaYp = Math.abs(yp - prevYp);
                const signFlipped = (prevYw * yw < 0);
                if (deltaYp > height * 0.7 && signFlipped) {
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(xp, yp);
                    prevYp = yp;
                    prevYw = yw;
                    continue;
                }
            }

            if (!inPath) {
                ctx.moveTo(xp, yp);
                inPath = true;
            } else {
                ctx.lineTo(xp, yp);
            }

            prevYp = yp;
            prevYw = yw;
        }

        if (inPath) {
            ctx.stroke();
        }
        ctx.restore();
    }

    // Numerical Derivative via Symmetrical Central Difference
    function numericalDerivative(fn, x) {
        const h = 1e-5;
        const yPlus = fn(x + h);
        const yMinus = fn(x - h);
        if (isNaN(yPlus) || isNaN(yMinus)) return NaN;
        return (yPlus - yMinus) / (2 * h);
    }

    // Draw Evaluated Point and Tangent Line
    function drawEvaluatedPoint(f1, width, height) {
        const c = parseFloat(evalXInput.value);
        if (isNaN(c) || !f1) return;

        const fc = f1(c);
        if (isNaN(fc) || !isFinite(fc)) return;

        const cp = toScreenX(c, width);
        const fcp = toScreenY(fc, height);

        // Draw Tangent Line if derivative exists
        const slope = numericalDerivative(f1, c);
        if (!isNaN(slope) && isFinite(slope)) {
            ctx.save();
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);

            // Tangent equation: y - fc = slope * (x - c) => y = fc + slope * (x - c)
            const x1 = c - (view.xmax - view.xmin) * 0.2;
            const x2 = c + (view.xmax - view.xmin) * 0.2;
            const y1 = fc + slope * (x1 - c);
            const y2 = fc + slope * (x2 - c);

            ctx.beginPath();
            ctx.moveTo(toScreenX(x1, width), toScreenY(y1, height));
            ctx.lineTo(toScreenX(x2, width), toScreenY(y2, height));
            ctx.stroke();
            ctx.restore();
        }

        // Draw Glowing Point at (c, f(c))
        ctx.save();
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(cp, fcp, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }

    // Draw Cursor Crosshair Tracer
    function drawCursorTracer(f1, width, height) {
        const xw = toWorldX(mousePos.x, width);
        const yw = toWorldY(mousePos.y, height);
        const f1w = f1(xw);

        // Update HUD display
        hudCoords.textContent = `Cursor: x = ${xw.toFixed(2)}, y = ${yw.toFixed(2)}`;

        if (!isNaN(f1w) && isFinite(f1w)) {
            const slope = numericalDerivative(f1, xw);
            const slopeStr = isNaN(slope) ? 'N/A' : slope.toFixed(2);
            hudSlope.textContent = `| f₁(${xw.toFixed(2)}) = ${f1w.toFixed(2)} | f₁' = ${slopeStr}`;

            // Draw tracer circle on curve
            const f1yp = toScreenY(f1w, height);
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(mousePos.x, f1yp, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else {
            hudSlope.textContent = `| f₁(${xw.toFixed(2)}) = undefined`;
        }

        // Crosshairs
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);

        ctx.beginPath();
        ctx.moveTo(mousePos.x, 0);
        ctx.lineTo(mousePos.x, height);
        ctx.moveTo(0, mousePos.y);
        ctx.lineTo(width, mousePos.y);
        ctx.stroke();
        ctx.restore();
    }

    // Sync Viewport Inputs
    function updateViewInputs() {
        xminInput.value = view.xmin.toFixed(2);
        xmaxInput.value = view.xmax.toFixed(2);
        yminInput.value = view.ymin.toFixed(2);
        ymaxInput.value = view.ymax.toFixed(2);
    }

    function applyViewInputs() {
        const xmin = parseFloat(xminInput.value);
        const xmax = parseFloat(xmaxInput.value);
        const ymin = parseFloat(yminInput.value);
        const ymax = parseFloat(ymaxInput.value);

        if (xmin < xmax && ymin < ymax) {
            view = { xmin, xmax, ymin, ymax };
            render();
        }
    }

    // Point Evaluation Box
    function updatePointEvaluation() {
        const c = parseFloat(evalXInput.value);
        const f1 = compileExpression(exprInput1.value);

        if (isNaN(c) || !f1) {
            evalF1Val.textContent = 'NaN';
            evalF1Deriv.textContent = 'NaN';
            evalF1Status.textContent = 'Invalid expression';
            return;
        }

        const fc = f1(c);
        if (isNaN(fc) || !isFinite(fc)) {
            evalF1Val.textContent = 'Undefined';
            evalF1Deriv.textContent = 'Undefined';
            evalF1Status.textContent = 'Vertical asymptote or pole';
            evalF1Tangent.textContent = 'No tangent exists';
        } else {
            evalF1Val.textContent = fc.toFixed(4);
            evalF1Status.textContent = `Point: (${c.toFixed(2)}, ${fc.toFixed(4)})`;

            const slope = numericalDerivative(f1, c);
            if (isNaN(slope) || !isFinite(slope)) {
                evalF1Deriv.textContent = 'Undefined';
                evalF1Tangent.textContent = 'Non-differentiable';
            } else {
                evalF1Deriv.textContent = slope.toFixed(4);
                if (Math.abs(slope) < 0.001) {
                    evalF1Tangent.textContent = 'Critical Point / Stationary (f\' ≈ 0)';
                } else if (slope > 0) {
                    evalF1Tangent.textContent = `Increasing (Angle: ${(Math.atan(slope) * 180 / Math.PI).toFixed(1)}°)`;
                } else {
                    evalF1Tangent.textContent = `Decreasing (Angle: ${(Math.atan(slope) * 180 / Math.PI).toFixed(1)}°)`;
                }
            }
        }

        // Secondary function evaluation
        if (toggleFunc2.checked) {
            evalF2Card.style.display = 'block';
            const f2 = compileExpression(exprInput2.value);
            if (f2) {
                const f2c = f2(c);
                if (!isNaN(f2c) && isFinite(f2c)) {
                    evalF2Val.textContent = f2c.toFixed(4);
                    if (!isNaN(fc) && isFinite(fc)) {
                        const diff = f2c - fc;
                        evalF2Diff.textContent = `Difference (f₂ - f₁): ${(diff >= 0 ? '+' : '')}${diff.toFixed(4)}`;
                    }
                } else {
                    evalF2Val.textContent = 'Undefined';
                    evalF2Diff.textContent = '';
                }
            }
        } else {
            evalF2Card.style.display = 'none';
        }
    }

    // Event Handlers for Inputs
    exprInput1.addEventListener('input', () => {
        render();
        updatePointEvaluation();
    });

    exprInput2.addEventListener('input', () => {
        render();
        updatePointEvaluation();
    });

    toggleFunc2.addEventListener('change', () => {
        exprInput2.disabled = !toggleFunc2.checked;
        render();
        updatePointEvaluation();
    });

    [xminInput, xmaxInput, yminInput, ymaxInput].forEach(input => {
        input.addEventListener('change', applyViewInputs);
    });

    evalXInput.addEventListener('input', () => {
        render();
        updatePointEvaluation();
    });

    // Zoom and Pan Controls
    function zoom(factor) {
        const xCenter = (view.xmin + view.xmax) / 2;
        const yCenter = (view.ymin + view.ymax) / 2;
        const xHalf = ((view.xmax - view.xmin) / 2) * factor;
        const yHalf = ((view.ymax - view.ymin) / 2) * factor;

        view.xmin = xCenter - xHalf;
        view.xmax = xCenter + xHalf;
        view.ymin = yCenter - yHalf;
        view.ymax = yCenter + yHalf;

        updateViewInputs();
        render();
    }

    btnZoomIn.addEventListener('click', () => zoom(0.8));
    btnZoomOut.addEventListener('click', () => zoom(1.25));

    btnReset.addEventListener('click', () => {
        view = { xmin: -5, xmax: 5, ymin: -5, ymax: 5 };
        updateViewInputs();
        render();
    });

    // Function Presets
    presetPills.forEach(pill => {
        pill.addEventListener('click', () => {
            presetPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const key = pill.getAttribute('data-preset');
            const preset = PRESETS[key];
            if (preset) {
                exprInput1.value = preset.expr1;
                view = {
                    xmin: preset.xmin,
                    xmax: preset.xmax,
                    ymin: preset.ymin,
                    ymax: preset.ymax
                };
                updateViewInputs();
                render();
                updatePointEvaluation();
            }
        });
    });

    // Canvas Mouse & Drag Interaction
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStart = { x: e.clientX, y: e.clientY };
        dragStartView = { ...view };
        canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        if (isDragging) {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;

            const xSpan = dragStartView.xmax - dragStartView.xmin;
            const ySpan = dragStartView.ymax - dragStartView.ymin;

            const worldDx = (dx / rect.width) * xSpan;
            const worldDy = (dy / 480) * ySpan;

            view.xmin = dragStartView.xmin - worldDx;
            view.xmax = dragStartView.xmax - worldDx;
            view.ymin = dragStartView.ymin + worldDy;
            view.ymax = dragStartView.ymax + worldDy;

            updateViewInputs();
            render();
        }

        // Check if hovering over canvas
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
            mousePos = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            render();
        } else if (!isDragging && mousePos) {
            mousePos = null;
            render();
        }
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            canvas.style.cursor = 'crosshair';
        }
    });

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const worldX = toWorldX(mouseX, rect.width);
        const worldY = toWorldY(mouseY, 480);

        const zoomFactor = e.deltaY > 0 ? 1.15 : 0.85;

        view.xmin = worldX - (worldX - view.xmin) * zoomFactor;
        view.xmax = worldX + (view.xmax - worldX) * zoomFactor;
        view.ymin = worldY - (worldY - view.ymin) * zoomFactor;
        view.ymax = worldY + (view.ymax - worldY) * zoomFactor;

        updateViewInputs();
        render();
    }, { passive: false });

    // Window Resize Handler
    window.addEventListener('resize', render);

    // Initial Execution
    updateViewInputs();
    updatePointEvaluation();
    render();
});
