/**
 * Final Grade Needed Calculator Engine
 * 100% Vanilla JS - Academic Weighted Projections & Feasibility Solver
 */

document.addEventListener('DOMContentLoaded', () => {
    let currentMode = 'simple'; // 'simple' | 'categories'

    // Mode Tabs
    const tabSimple = document.getElementById('tab-mode-simple');
    const tabCategories = document.getElementById('tab-mode-categories');
    const secSimple = document.getElementById('section-simple-mode');
    const secCategories = document.getElementById('section-categories-mode');

    // Simple Mode Inputs
    const currentGradeInput = document.getElementById('fg-current-grade');
    const finalWeightInput = document.getElementById('fg-final-weight');
    const targetGradeInput = document.getElementById('fg-target-grade');
    const presetPills = document.querySelectorAll('.preset-pill-btn[data-target]');

    // Categories Mode Inputs
    const catTbody = document.getElementById('categories-tbody');
    const btnAddCategory = document.getElementById('btn-add-category');
    const catTargetInput = document.getElementById('fg-cat-target-grade');
    const catWeightBadge = document.getElementById('cat-weight-sum-badge');

    // Form & Buttons
    const form = document.getElementById('final-grade-form');
    const resetBtn = document.getElementById('btn-reset-final');

    // Results Elements
    const heroFinalScore = document.getElementById('hero-final-score');
    const heroVerdict = document.getElementById('hero-feasibility-verdict');

    const cardPointsSecured = document.getElementById('card-points-secured');
    const cardPointsSub = document.getElementById('card-points-sub');
    const cardPointsNeeded = document.getElementById('card-points-needed');
    const cardWeightSub = document.getElementById('card-weight-sub');
    const cardTargetVal = document.getElementById('card-target-val');
    const cardVerdictTitle = document.getElementById('card-verdict-title');
    const cardVerdictDesc = document.getElementById('card-verdict-desc');

    const gradeMatrixTbody = document.getElementById('grade-matrix-tbody');

    // Default Categories
    const sampleCategories = [
        { name: 'Homework & Problem Sets', weight: 20, score: 95 },
        { name: 'Weekly Quizzes', weight: 15, score: 85 },
        { name: 'Midterm Examination', weight: 25, score: 78 },
        { name: 'Laboratory & Projects', weight: 15, score: 92 },
        { name: 'Final Comprehensive Exam', weight: 25, score: null } // The target final
    ];

    // Mode Switching
    tabSimple.addEventListener('click', () => {
        currentMode = 'simple';
        tabSimple.classList.add('active');
        tabCategories.classList.remove('active');
        secSimple.style.display = 'block';
        secCategories.style.display = 'none';
        calculateFinalGrade();
    });

    tabCategories.addEventListener('click', () => {
        currentMode = 'categories';
        tabCategories.classList.add('active');
        tabSimple.classList.remove('active');
        secSimple.style.display = 'none';
        secCategories.style.display = 'block';
        calculateFinalGrade();
    });

    // Target Presets
    presetPills.forEach(pill => {
        pill.addEventListener('click', () => {
            presetPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            targetGradeInput.value = pill.getAttribute('data-target');
            calculateFinalGrade();
        });
    });

    // Auto-update Listeners
    [currentGradeInput, finalWeightInput, targetGradeInput, catTargetInput].forEach(inp => {
        inp.addEventListener('input', calculateFinalGrade);
        inp.addEventListener('change', calculateFinalGrade);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateFinalGrade();
    });

    resetBtn.addEventListener('click', () => {
        currentGradeInput.value = '84.5';
        finalWeightInput.value = '30';
        targetGradeInput.value = '90.0';
        catTargetInput.value = '90';

        presetPills.forEach(p => p.classList.remove('active'));
        document.querySelector('[data-target="90"]').classList.add('active');

        loadDefaultCategories();
        currentMode = 'simple';
        tabSimple.classList.add('active');
        tabCategories.classList.remove('active');
        secSimple.style.display = 'block';
        secCategories.style.display = 'none';

        calculateFinalGrade();
    });

    // Dynamic Category Rows
    function renderCategoryRow(cat) {
        const tr = document.createElement('tr');
        const isFinal = (cat.score === null);

        tr.innerHTML = `
            <td>
                <input type="text" class="form-control cat-name" value="${cat.name}" style="font-size: 0.88rem;">
            </td>
            <td>
                <div class="input-with-addon">
                    <input type="number" class="form-control cat-weight" value="${cat.weight}" min="0" max="100" step="1" style="font-size: 0.88rem;">
                    <span class="input-addon">%</span>
                </div>
            </td>
            <td>
                ${isFinal ? 
                    '<span style="display: block; padding: 6px 12px; font-weight: 700; color: #38bdf8; background: rgba(56, 189, 248, 0.1); border-radius: 6px; text-align: center;">Target Final Exam</span>' :
                    '<div class="input-with-addon"><input type="number" class="form-control cat-score" value="' + cat.score + '" min="0" max="150" step="0.5" style="font-size: 0.88rem;"><span class="input-addon">%</span></div>'
                }
            </td>
            <td style="text-align: center;">
                ${isFinal ? '<span style="color: var(--color-text-muted); font-size: 0.8rem;">Final</span>' : '<button type="button" class="btn btn-secondary btn-del-cat" style="padding: 3px 8px; color: #ef4444; border-color: transparent;">✕</button>'}
            </td>
        `;

        tr.querySelectorAll('input').forEach(inp => {
            inp.addEventListener('input', calculateFinalGrade);
            inp.addEventListener('change', calculateFinalGrade);
        });

        const delBtn = tr.querySelector('.btn-del-cat');
        if (delBtn) {
            delBtn.addEventListener('click', () => {
                tr.remove();
                calculateFinalGrade();
            });
        }

        catTbody.appendChild(tr);
    }

    function loadDefaultCategories() {
        catTbody.innerHTML = '';
        sampleCategories.forEach(cat => renderCategoryRow(cat));
    }

    btnAddCategory.addEventListener('click', () => {
        // Insert right before the last row (which is the final exam)
        const newCat = { name: 'New Course Component', weight: 10, score: 85 };
        const rows = catTbody.querySelectorAll('tr');
        const finalRow = rows[rows.length - 1];

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" class="form-control cat-name" value="${newCat.name}" style="font-size: 0.88rem;"></td>
            <td><div class="input-with-addon"><input type="number" class="form-control cat-weight" value="${newCat.weight}" min="0" max="100" step="1" style="font-size: 0.88rem;"><span class="input-addon">%</span></div></td>
            <td><div class="input-with-addon"><input type="number" class="form-control cat-score" value="${newCat.score}" min="0" max="150" step="0.5" style="font-size: 0.88rem;"><span class="input-addon">%</span></div></td>
            <td style="text-align: center;"><button type="button" class="btn btn-secondary btn-del-cat" style="padding: 3px 8px; color: #ef4444; border-color: transparent;">✕</button></td>
        `;

        tr.querySelectorAll('input').forEach(inp => {
            inp.addEventListener('input', calculateFinalGrade);
            inp.addEventListener('change', calculateFinalGrade);
        });

        tr.querySelector('.btn-del-cat').addEventListener('click', () => {
            tr.remove();
            calculateFinalGrade();
        });

        catTbody.insertBefore(tr, finalRow);
        calculateFinalGrade();
    });

    // Main Calculation Solver
    function calculateFinalGrade() {
        let currentGrade = 0;
        let finalWeight = 0;
        let targetGrade = 0;
        let currentWeight = 0;
        let pointsSecured = 0;

        if (currentMode === 'simple') {
            currentGrade = parseFloat(currentGradeInput.value) || 0;
            finalWeight = (parseFloat(finalWeightInput.value) || 0) / 100;
            targetGrade = parseFloat(targetGradeInput.value) || 90;

            if (finalWeight <= 0 || finalWeight > 1) {
                heroFinalScore.textContent = '--';
                heroVerdict.textContent = 'Final exam weight must be between 1% and 100%.';
                return;
            }

            currentWeight = 1 - finalWeight;
            pointsSecured = currentGrade * currentWeight;

        } else {
            // Category Mode
            const rows = catTbody.querySelectorAll('tr');
            let totalWeightSum = 0;
            let finalCatWeight = 0;
            pointsSecured = 0;

            rows.forEach(r => {
                const weight = parseFloat(r.querySelector('.cat-weight').value) || 0;
                const scoreInput = r.querySelector('.cat-score');
                totalWeightSum += weight;

                if (scoreInput) {
                    const score = parseFloat(scoreInput.value) || 0;
                    pointsSecured += (score * (weight / 100));
                } else {
                    finalCatWeight = weight;
                }
            });

            catWeightBadge.textContent = `Total Weight: ${totalWeightSum}%`;
            if (totalWeightSum === 100) {
                catWeightBadge.style.background = 'rgba(16, 185, 129, 0.15)';
                catWeightBadge.style.color = '#10b981';
            } else {
                catWeightBadge.style.background = 'rgba(245, 158, 11, 0.15)';
                catWeightBadge.style.color = '#f59e0b';
            }

            finalWeight = finalCatWeight / 100;
            currentWeight = (totalWeightSum - finalCatWeight) / 100;
            currentGrade = currentWeight > 0 ? (pointsSecured / currentWeight) : 0;
            targetGrade = parseFloat(catTargetInput.value) || 90;

            if (finalWeight <= 0) {
                heroFinalScore.textContent = '--';
                heroVerdict.textContent = 'Please specify a positive weight for the final exam category.';
                return;
            }
        }

        // Target points needed from final exam
        const pointsNeeded = targetGrade - pointsSecured;
        const requiredFinalScore = pointsNeeded / finalWeight;

        // Display Hero Result
        heroFinalScore.textContent = `${requiredFinalScore.toFixed(1)}%`;

        // Update Breakdown Cards
        cardPointsSecured.textContent = `${pointsSecured.toFixed(2)} pts`;
        cardPointsSub.textContent = `Out of ${(currentWeight * 100).toFixed(0)}% available weight`;

        cardPointsNeeded.textContent = `${pointsNeeded.toFixed(2)} pts`;
        cardWeightSub.textContent = `Out of ${(finalWeight * 100).toFixed(0)}% final weight`;

        cardTargetVal.textContent = `${targetGrade.toFixed(1)}% Target`;

        // Verdict Evaluation
        if (requiredFinalScore <= 0) {
            heroVerdict.innerHTML = `🎉 <strong>Grade Secured!</strong> You have already locked in a <strong>${targetGrade.toFixed(1)}%</strong>, even with a 0% on the final exam.`;
            cardVerdictTitle.textContent = 'Guaranteed';
            cardVerdictTitle.style.color = '#10b981';
            cardVerdictDesc.textContent = 'No exam pressure';
        } else if (requiredFinalScore <= 60) {
            heroVerdict.innerHTML = `✅ <strong>Very Achievable:</strong> You only need a <strong>${requiredFinalScore.toFixed(1)}%</strong> on the final exam.`;
            cardVerdictTitle.textContent = 'Easy Target';
            cardVerdictTitle.style.color = '#10b981';
            cardVerdictDesc.textContent = 'Minimal study pressure';
        } else if (requiredFinalScore <= 85) {
            heroVerdict.innerHTML = `📘 <strong>Realistic Goal:</strong> You need an achievable <strong>${requiredFinalScore.toFixed(1)}%</strong> on the final exam.`;
            cardVerdictTitle.textContent = 'Realistic';
            cardVerdictTitle.style.color = '#38bdf8';
            cardVerdictDesc.textContent = 'Standard preparation';
        } else if (requiredFinalScore <= 100) {
            heroVerdict.innerHTML = `⚡ <strong>Demanding:</strong> Securing this grade requires a strong <strong>${requiredFinalScore.toFixed(1)}%</strong> on the final.`;
            cardVerdictTitle.textContent = 'Demanding';
            cardVerdictTitle.style.color = '#f59e0b';
            cardVerdictDesc.textContent = 'Near-perfect score needed';
        } else {
            heroVerdict.innerHTML = `⚠️ <strong>Mathematically Infeasible:</strong> Requires <strong>${requiredFinalScore.toFixed(1)}%</strong> (exceeds 100% without extra credit or grading curve).`;
            cardVerdictTitle.textContent = 'Infeasible';
            cardVerdictTitle.style.color = '#ef4444';
            cardVerdictDesc.textContent = 'Check alternative grades below';
        }

        // Render Letter Grade Matrix Table
        renderGradeMatrix(pointsSecured, finalWeight);
    }

    function renderGradeMatrix(pointsSecured, finalWeight) {
        const letterThresholds = [
            { grade: 'A+ (Top Honors)', minPct: 97.0 },
            { grade: 'A (Excellent)', minPct: 93.0 },
            { grade: 'A- (Superior)', minPct: 90.0 },
            { grade: 'B+ (Very Good)', minPct: 87.0 },
            { grade: 'B (Good)', minPct: 83.0 },
            { grade: 'B- (Above Average)', minPct: 80.0 },
            { grade: 'C+ (Average)', minPct: 77.0 },
            { grade: 'C (Satisfactory)', minPct: 73.0 },
            { grade: 'C- (Passing)', minPct: 70.0 },
            { grade: 'D (Minimum Credit)', minPct: 65.0 }
        ];

        gradeMatrixTbody.innerHTML = '';

        letterThresholds.forEach(item => {
            const needed = (item.minPct - pointsSecured) / finalWeight;
            const tr = document.createElement('tr');

            let statusBadge = '';
            if (needed <= 0) {
                statusBadge = '<span style="color: #10b981; font-weight: 600;">🎉 Secured (≤ 0%)</span>';
            } else if (needed <= 70) {
                statusBadge = '<span style="color: #10b981; font-weight: 600;">✅ Easy</span>';
            } else if (needed <= 85) {
                statusBadge = '<span style="color: #38bdf8; font-weight: 600;">📘 Realistic</span>';
            } else if (needed <= 100) {
                statusBadge = '<span style="color: #f59e0b; font-weight: 600;">⚡ Demanding</span>';
            } else {
                statusBadge = '<span style="color: #ef4444; font-weight: 600;">⚠️ Infeasible (> 100%)</span>';
            }

            tr.innerHTML = `
                <td><strong>${item.grade}</strong></td>
                <td>${item.minPct.toFixed(1)}%</td>
                <td style="font-weight: 700; font-family: monospace; font-size: 1rem; color: ${needed <= 100 ? 'var(--color-text-main)' : '#ef4444'};">
                    ${needed <= 0 ? '0.0%' : needed.toFixed(1) + '%'}
                </td>
                <td>${statusBadge}</td>
            `;
            gradeMatrixTbody.appendChild(tr);
        });
    }

    // Initial Population
    loadDefaultCategories();
    calculateFinalGrade();
});
