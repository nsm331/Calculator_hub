/**
 * Matrix Operations Calculator Engine
 * 100% Vanilla JS - Linear Algebra Computations & KaTeX Rendering
 */

document.addEventListener('DOMContentLoaded', () => {
    // Dimension Selectors
    const aRowsSelect = document.getElementById('matrix-a-rows');
    const aColsSelect = document.getElementById('matrix-a-cols');
    const bRowsSelect = document.getElementById('matrix-b-rows');
    const bColsSelect = document.getElementById('matrix-b-cols');

    // Matrix Grid Containers
    const gridA = document.getElementById('grid-matrix-a');
    const gridB = document.getElementById('grid-matrix-b');

    // Tool Buttons
    const btnAIdentity = document.getElementById('btn-a-identity');
    const btnAZero = document.getElementById('btn-a-zero');
    const btnARandom = document.getElementById('btn-a-random');

    const btnBIdentity = document.getElementById('btn-b-identity');
    const btnBZero = document.getElementById('btn-b-zero');
    const btnBRandom = document.getElementById('btn-b-random');

    const btnSwap = document.getElementById('btn-swap-matrices');
    const scalarInput = document.getElementById('scalar-k');
    const opButtons = document.querySelectorAll('.op-btn');
    const presetPills = document.querySelectorAll('.preset-pill-btn[data-dim]');

    // Results Elements
    const resTitle = document.getElementById('matrix-res-title');
    const resDisplay = document.getElementById('matrix-res-display');
    const resMeta = document.getElementById('matrix-res-meta');
    const stepByStep = document.getElementById('matrix-step-by-step');

    let currentOp = 'multiply';

    // Sample Initial Matrices (3x3)
    const initialA = [
        [1, 2, 3],
        [0, 1, 4],
        [5, 6, 0]
    ];

    const initialB = [
        [2, 0, -1],
        [1, 3, 2],
        [0, -2, 1]
    ];

    // Build Grid Input Cells
    function renderGrid(container, prefix, rows, cols, values = null) {
        container.innerHTML = '';
        container.style.gridTemplateColumns = `repeat(${cols}, minmax(45px, 1fr))`;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'form-control matrix-cell';
                input.id = `${prefix}-${r}-${c}`;
                input.style.textAlign = 'center';
                input.style.padding = '8px 4px';
                input.style.fontFamily = 'monospace';
                input.style.fontSize = '0.95rem';
                input.style.fontWeight = '600';
                input.step = 'any';

                let defaultVal = 0;
                if (values && values[r] && values[r][c] !== undefined) {
                    defaultVal = values[r][c];
                } else if (r === c) {
                    defaultVal = 1;
                }
                input.value = defaultVal;

                input.addEventListener('input', executeCurrentOperation);
                container.appendChild(input);
            }
        }
    }

    // Extract values into 2D Array
    function getMatrixValues(prefix, rows, cols) {
        const mat = [];
        for (let r = 0; r < rows; r++) {
            const row = [];
            for (let c = 0; c < cols; c++) {
                const el = document.getElementById(`${prefix}-${r}-${c}`);
                const val = el ? parseFloat(el.value) : 0;
                row.push(isNaN(val) ? 0 : val);
            }
            mat.push(row);
        }
        return mat;
    }

    // Populate grid with array
    function setMatrixValues(prefix, rows, cols, data) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const el = document.getElementById(`${prefix}-${r}-${c}`);
                if (el && data[r] && data[r][c] !== undefined) {
                    el.value = Math.round(data[r][c] * 1000) / 1000;
                }
            }
        }
        executeCurrentOperation();
    }

    // Preset Pill Click
    presetPills.forEach(pill => {
        pill.addEventListener('click', () => {
            presetPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const dim = pill.getAttribute('data-dim');
            if (dim !== 'custom') {
                const n = parseInt(dim);
                aRowsSelect.value = n;
                aColsSelect.value = n;
                bRowsSelect.value = n;
                bColsSelect.value = n;
                initGrids();
            }
        });
    });

    // Dimension Change Listeners
    [aRowsSelect, aColsSelect].forEach(sel => sel.addEventListener('change', () => {
        renderGrid(gridA, 'a', parseInt(aRowsSelect.value), parseInt(aColsSelect.value));
        executeCurrentOperation();
    }));

    [bRowsSelect, bColsSelect].forEach(sel => sel.addEventListener('change', () => {
        renderGrid(gridB, 'b', parseInt(bRowsSelect.value), parseInt(bColsSelect.value));
        executeCurrentOperation();
    }));

    // Quick Fill Tools
    btnAIdentity.addEventListener('click', () => {
        const r = parseInt(aRowsSelect.value);
        const c = parseInt(aColsSelect.value);
        const mat = Array.from({ length: r }, (_, i) => Array.from({ length: c }, (_, j) => (i === j ? 1 : 0)));
        setMatrixValues('a', r, c, mat);
    });

    btnAZero.addEventListener('click', () => {
        const r = parseInt(aRowsSelect.value);
        const c = parseInt(aColsSelect.value);
        const mat = Array.from({ length: r }, () => Array(c).fill(0));
        setMatrixValues('a', r, c, mat);
    });

    btnARandom.addEventListener('click', () => {
        const r = parseInt(aRowsSelect.value);
        const c = parseInt(aColsSelect.value);
        const mat = Array.from({ length: r }, () => Array.from({ length: c }, () => Math.floor(Math.random() * 19) - 9));
        setMatrixValues('a', r, c, mat);
    });

    btnBIdentity.addEventListener('click', () => {
        const r = parseInt(bRowsSelect.value);
        const c = parseInt(bColsSelect.value);
        const mat = Array.from({ length: r }, (_, i) => Array.from({ length: c }, (_, j) => (i === j ? 1 : 0)));
        setMatrixValues('b', r, c, mat);
    });

    btnBZero.addEventListener('click', () => {
        const r = parseInt(bRowsSelect.value);
        const c = parseInt(bColsSelect.value);
        const mat = Array.from({ length: r }, () => Array(c).fill(0));
        setMatrixValues('b', r, c, mat);
    });

    btnBRandom.addEventListener('click', () => {
        const r = parseInt(bRowsSelect.value);
        const c = parseInt(bColsSelect.value);
        const mat = Array.from({ length: r }, () => Array.from({ length: c }, () => Math.floor(Math.random() * 19) - 9));
        setMatrixValues('b', r, c, mat);
    });

    // Swap Matrices
    btnSwap.addEventListener('click', () => {
        const aR = parseInt(aRowsSelect.value);
        const aC = parseInt(aColsSelect.value);
        const bR = parseInt(bRowsSelect.value);
        const bC = parseInt(bColsSelect.value);

        const aData = getMatrixValues('a', aR, aC);
        const bData = getMatrixValues('b', bR, bC);

        aRowsSelect.value = bR;
        aColsSelect.value = bC;
        bRowsSelect.value = aR;
        bColsSelect.value = aC;

        renderGrid(gridA, 'a', bR, bC, bData);
        renderGrid(gridB, 'b', aR, aC, aData);
        executeCurrentOperation();
    });

    // Operation Buttons
    opButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            opButtons.forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');

            currentOp = btn.getAttribute('data-op');
            executeCurrentOperation();
        });
    });

    if (scalarInput) {
        scalarInput.addEventListener('input', () => {
            if (currentOp === 'scalar') executeCurrentOperation();
        });
    }

    // Mathematical Formatting (LaTeX)
    function matrixToLatex(mat) {
        if (!mat || mat.length === 0) return '\\begin{pmatrix} 0 \\end{pmatrix}';
        const rowsLatex = mat.map(row => row.map(v => {
            const num = Math.round(v * 10000) / 10000;
            return num.toString();
        }).join(' & ')).join(' \\\\ ');
        return `\\begin{pmatrix} ${rowsLatex} \\end{pmatrix}`;
    }

    function renderLatex(latex, targetElement) {
        if (window.katex) {
            try {
                window.katex.render(latex, targetElement, { displayMode: true, throwOnError: false });
            } catch (e) {
                targetElement.textContent = latex;
            }
        } else {
            targetElement.textContent = latex;
        }
    }

    // Mathematical Algorithms
    function determinant(mat) {
        const n = mat.length;
        if (n === 1) return mat[0][0];
        if (n === 2) return (mat[0][0] * mat[1][1]) - (mat[0][1] * mat[1][0]);

        let det = 0;
        for (let c = 0; c < n; c++) {
            const sub = getSubmatrix(mat, 0, c);
            const sign = (c % 2 === 0) ? 1 : -1;
            det += sign * mat[0][c] * determinant(sub);
        }
        return det;
    }

    function getSubmatrix(mat, remRow, remCol) {
        return mat.filter((_, r) => r !== remRow).map(row => row.filter((_, c) => c !== remCol));
    }

    function invertMatrix(mat) {
        const det = determinant(mat);
        if (Math.abs(det) < 1e-12) return null;

        const n = mat.length;
        if (n === 1) return [[1 / mat[0][0]]];

        // Adjugate matrix
        const adj = [];
        for (let r = 0; r < n; r++) {
            const adjRow = [];
            for (let c = 0; c < n; c++) {
                const sub = getSubmatrix(mat, r, c);
                const sign = ((r + c) % 2 === 0) ? 1 : -1;
                const cofactor = sign * determinant(sub);
                adjRow.push(cofactor);
            }
            adj.push(adjRow);
        }

        // Transpose of cofactor matrix divided by det
        const inv = [];
        for (let r = 0; r < n; r++) {
            const row = [];
            for (let c = 0; c < n; c++) {
                row.push(adj[c][r] / det);
            }
            inv.push(row);
        }
        return inv;
    }

    function computeRank(mat) {
        const rows = mat.length;
        const cols = mat[0].length;
        const A = mat.map(row => [...row]);

        let rank = 0;
        let lead = 0;

        for (let r = 0; r < rows; r++) {
            if (lead >= cols) break;
            let i = r;
            while (Math.abs(A[i][lead]) < 1e-10) {
                i++;
                if (i === rows) {
                    i = r;
                    lead++;
                    if (lead === cols) return rank;
                }
            }

            // Swap rows
            [A[i], A[r]] = [A[r], A[i]];

            // Normalize pivot
            const pivot = A[r][lead];
            for (let j = 0; j < cols; j++) A[r][j] /= pivot;

            // Eliminate column
            for (let k = 0; k < rows; k++) {
                if (k !== r) {
                    const factor = A[k][lead];
                    for (let j = 0; j < cols; j++) A[k][j] -= factor * A[r][j];
                }
            }
            lead++;
            rank++;
        }
        return rank;
    }

    // Main Operation Execution
    function executeCurrentOperation() {
        const aR = parseInt(aRowsSelect.value);
        const aC = parseInt(aColsSelect.value);
        const bR = parseInt(bRowsSelect.value);
        const bC = parseInt(bColsSelect.value);

        const A = getMatrixValues('a', aR, aC);
        const B = getMatrixValues('b', bR, bC);

        if (currentOp === 'multiply') {
            resTitle.textContent = `Matrix Product: C = A × B (${aR}×${aC} by ${bR}×${bC})`;

            if (aC !== bR) {
                resDisplay.innerHTML = `<div style="color: #ef4444; font-weight: 600; padding: 10px 0;">⚠️ Dimension Incompatible: Matrix multiplication requires columns of A (${aC}) to equal rows of B (${bR}).</div>`;
                resMeta.textContent = 'Cannot multiply: Inner dimensions must match.';
                stepByStep.innerHTML = `<p>To multiply two matrices $A \\in \\mathbb{R}^{m \\times k}$ and $B \\in \\mathbb{R}^{p \\times n}$, condition $k = p$ must be satisfied. Currently, A has ${aC} columns and B has ${bR} rows.</p>`;
                return;
            }

            const C = [];
            const steps = [];

            for (let r = 0; r < aR; r++) {
                const row = [];
                for (let c = 0; c < bC; c++) {
                    let dot = 0;
                    const terms = [];
                    for (let k = 0; k < aC; k++) {
                        dot += A[r][k] * B[k][c];
                        terms.push(`(${A[r][k]} \\times ${B[k][c]})`);
                    }
                    row.push(dot);
                    if (r < 2 && c < 2) {
                        steps.push(`$$c_{${r + 1}${c + 1}} = ${terms.join(' + ')} = \\mathbf{${dot}}$$`);
                    }
                }
                C.push(row);
            }

            const latex = `${matrixToLatex(A)} \\times ${matrixToLatex(B)} = ${matrixToLatex(C)}`;
            renderLatex(latex, resDisplay);
            resMeta.textContent = `Result Dimension: ${aR} × ${bC} • Rank: ${computeRank(C)}`;
            stepByStep.innerHTML = `
                <p>Each cell $c_{ij}$ is computed as the Euclidean dot product of row $i$ of Matrix A and column $j$ of Matrix B:</p>
                ${steps.join('')}
                <p style="margin-top: 8px; font-size: 0.82rem; color: var(--color-text-subtle);">Showing first calculated dot product terms.</p>
            `;
            if (window.renderMathInElement) window.renderMathInElement(stepByStep);

        } else if (currentOp === 'add') {
            resTitle.textContent = `Matrix Addition: C = A + B (${aR}×${aC})`;

            if (aR !== bR || aC !== bC) {
                resDisplay.innerHTML = `<div style="color: #ef4444; font-weight: 600; padding: 10px 0;">⚠️ Dimension Incompatible: Matrix addition requires identical dimensions (${aR}×${aC} vs ${bR}×${bC}).</div>`;
                resMeta.textContent = 'Cannot add: Dimensions must match exactly.';
                stepByStep.innerHTML = `<p>Addition $(A + B)_{ij} = A_{ij} + B_{ij}$ requires identical topologies.</p>`;
                return;
            }

            const C = A.map((row, r) => row.map((val, c) => val + B[r][c]));
            const latex = `${matrixToLatex(A)} + ${matrixToLatex(B)} = ${matrixToLatex(C)}`;
            renderLatex(latex, resDisplay);
            resMeta.textContent = `Result Dimension: ${aR} × ${aC} • Rank: ${computeRank(C)}`;
            stepByStep.innerHTML = `<p>Element-wise sum computed: $(A + B)_{ij} = A_{ij} + B_{ij}$.</p>`;

        } else if (currentOp === 'subtract') {
            resTitle.textContent = `Matrix Subtraction: C = A − B (${aR}×${aC})`;

            if (aR !== bR || aC !== bC) {
                resDisplay.innerHTML = `<div style="color: #ef4444; font-weight: 600; padding: 10px 0;">⚠️ Dimension Incompatible: Matrix subtraction requires identical dimensions (${aR}×${aC} vs ${bR}×${bC}).</div>`;
                resMeta.textContent = 'Cannot subtract: Dimensions must match exactly.';
                stepByStep.innerHTML = `<p>Subtraction $(A - B)_{ij} = A_{ij} - B_{ij}$ requires identical topologies.</p>`;
                return;
            }

            const C = A.map((row, r) => row.map((val, c) => val - B[r][c]));
            const latex = `${matrixToLatex(A)} - ${matrixToLatex(B)} = ${matrixToLatex(C)}`;
            renderLatex(latex, resDisplay);
            resMeta.textContent = `Result Dimension: ${aR} × ${aC} • Rank: ${computeRank(C)}`;
            stepByStep.innerHTML = `<p>Element-wise subtraction computed: $(A - B)_{ij} = A_{ij} - B_{ij}$.</p>`;

        } else if (currentOp === 'det') {
            resTitle.textContent = `Determinant: det(A) or |A|`;

            if (aR !== aC) {
                resDisplay.innerHTML = `<div style="color: #ef4444; font-weight: 600; padding: 10px 0;">⚠️ Non-Square Matrix: Determinants exist only for square matrices ($n \\times n$). Currently ${aR}×${aC}.</div>`;
                resMeta.textContent = 'Square matrix required.';
                stepByStep.innerHTML = '<p>Determinants map square matrix spaces $\\mathbb{R}^{n \\times n} \\to \\mathbb{R}$.</p>';
                return;
            }

            const det = determinant(A);
            const isSingular = Math.abs(det) < 1e-12;
            const latex = `\\det ${matrixToLatex(A)} = \\mathbf{${Math.round(det * 10000) / 10000}}`;
            renderLatex(latex, resDisplay);

            resMeta.textContent = `det(A) = ${det} • ${isSingular ? 'Singular (Non-Invertible)' : 'Non-Singular (Invertible)'}`;
            stepByStep.innerHTML = `
                <p>Computed via Laplace cofactor expansion along the top row. The determinant represents the hyper-volume expansion factor of the transformation.</p>
                <p><strong>Invertibility:</strong> Since $\\det(A) ${isSingular ? '= 0' : '\\neq 0'}$, matrix A is <strong>${isSingular ? 'Singular (cannot be inverted)' : 'Invertible'}</strong>.</p>
            `;
            if (window.renderMathInElement) window.renderMathInElement(stepByStep);

        } else if (currentOp === 'inv') {
            resTitle.textContent = `Multiplicative Inverse: A⁻¹`;

            if (aR !== aC) {
                resDisplay.innerHTML = `<div style="color: #ef4444; font-weight: 600; padding: 10px 0;">⚠️ Non-Square Matrix: Only square matrices have two-sided inverses.</div>`;
                resMeta.textContent = 'Square matrix required.';
                return;
            }

            const det = determinant(A);
            if (Math.abs(det) < 1e-12) {
                resDisplay.innerHTML = `<div style="color: #ef4444; font-weight: 600; padding: 10px 0;">⚠️ Singular Matrix: det(A) = 0. Matrix A has no inverse.</div>`;
                resMeta.textContent = 'Singular matrix (rank deficient).';
                stepByStep.innerHTML = `<p>Because $\\det(A) = 0$, dividing by the determinant produces a divide-by-zero pole ($A^{-1} = \\frac{1}{\\det(A)} \\text{adj}(A)$).</p>`;
                return;
            }

            const inv = invertMatrix(A);
            const latex = `A^{-1} = ${matrixToLatex(inv)}`;
            renderLatex(latex, resDisplay);
            resMeta.textContent = `det(A) = ${Math.round(det * 1000) / 1000} • Full Rank (${aR})`;
            stepByStep.innerHTML = `
                <p>Inverse evaluated using the Adjugate method: $A^{-1} = \\frac{1}{\\det(A)} \\text{adj}(A)$.</p>
                <p><strong>Verification:</strong> $A \\cdot A^{-1} = I_{${aR}}$.</p>
            `;
            if (window.renderMathInElement) window.renderMathInElement(stepByStep);

        } else if (currentOp === 'transpose') {
            resTitle.textContent = `Transpose: Aᵀ (${aC}×${aR})`;
            const AT = [];
            for (let c = 0; c < aC; c++) {
                const row = [];
                for (let r = 0; r < aR; r++) row.push(A[r][c]);
                AT.push(row);
            }
            const latex = `${matrixToLatex(A)}^T = ${matrixToLatex(AT)}`;
            renderLatex(latex, resDisplay);
            resMeta.textContent = `Swapped rows and columns: ${aR}×${aC} → ${aC}×${aR}`;
            stepByStep.innerHTML = `<p>The transpose reflects matrix elements across the main diagonal: $(A^T)_{ij} = A_{ji}$.</p>`;

        } else if (currentOp === 'trace') {
            resTitle.textContent = `Trace: Tr(A) (Sum of Diagonal Elements)`;
            if (aR !== aC) {
                resDisplay.innerHTML = `<div style="color: #ef4444; font-weight: 600; padding: 10px 0;">⚠️ Square Matrix Required for Trace.</div>`;
                return;
            }
            let tr = 0;
            const terms = [];
            for (let i = 0; i < aR; i++) {
                tr += A[i][i];
                terms.push(A[i][i].toString());
            }
            const latex = `\\text{Tr}${matrixToLatex(A)} = ${terms.join(' + ')} = \\mathbf{${tr}}`;
            renderLatex(latex, resDisplay);
            resMeta.textContent = `Sum of ${aR} diagonal elements.`;
            stepByStep.innerHTML = `<p>The trace is invariant under cyclic permutations: $\\text{Tr}(A) = \\sum_{i=1}^n A_{ii}$.</p>`;

        } else if (currentOp === 'power2') {
            resTitle.textContent = `Matrix Square: A² = A × A`;
            if (aR !== aC) {
                resDisplay.innerHTML = `<div style="color: #ef4444; font-weight: 600; padding: 10px 0;">⚠️ Square Matrix Required for Powers.</div>`;
                return;
            }
            const A2 = [];
            for (let r = 0; r < aR; r++) {
                const row = [];
                for (let c = 0; c < aC; c++) {
                    let dot = 0;
                    for (let k = 0; k < aC; k++) dot += A[r][k] * A[k][c];
                    row.push(dot);
                }
                A2.push(row);
            }
            const latex = `${matrixToLatex(A)}^2 = ${matrixToLatex(A2)}`;
            renderLatex(latex, resDisplay);
            resMeta.textContent = `Self-product A × A.`;
            stepByStep.innerHTML = `<p>Evaluated as the standard inner product of matrix A with itself.</p>`;

        } else if (currentOp === 'scalar') {
            const k = parseFloat(scalarInput ? scalarInput.value : 2) || 2;
            resTitle.textContent = `Scalar Multiplication: ${k} × A`;
            const kA = A.map(row => row.map(v => v * k));
            const latex = `${k} \\cdot ${matrixToLatex(A)} = ${matrixToLatex(kA)}`;
            renderLatex(latex, resDisplay);
            resMeta.textContent = `Every element multiplied by scalar k = ${k}.`;
            stepByStep.innerHTML = `<p>Scalar multiplication scales every cell proportionally: $(\\lambda A)_{ij} = \\lambda \\cdot A_{ij}$.</p>`;

        } else if (currentOp === 'rank') {
            const rk = computeRank(A);
            resTitle.textContent = `Matrix Rank: Rank(A) = ${rk}`;
            const latex = `\\text{Rank}${matrixToLatex(A)} = \\mathbf{${rk}}`;
            renderLatex(latex, resDisplay);
            resMeta.textContent = `Rank: ${rk} of min(${aR}, ${aC}) possible dimensions.`;
            stepByStep.innerHTML = `
                <p>The rank is the dimension of the vector space spanned by its columns (or rows). Computed via Gaussian elimination to row echelon form.</p>
                <p><strong>Rank Condition:</strong> Since $\\text{Rank}(A) = ${rk}$ ${rk === Math.min(aR, aC) ? '(Full Rank)' : '(Rank Deficient)'}.</p>
            `;
            if (window.renderMathInElement) window.renderMathInElement(stepByStep);
        }
    }

    // Initialize Default Grids
    function initGrids() {
        renderGrid(gridA, 'a', parseInt(aRowsSelect.value), parseInt(aColsSelect.value), initialA);
        renderGrid(gridB, 'b', parseInt(bRowsSelect.value), parseInt(bColsSelect.value), initialB);
        executeCurrentOperation();
    }

    initGrids();
});
