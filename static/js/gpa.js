/**
 * College GPA Calculator Engine
 * 100% Vanilla JS - Academic Quality Point Modeling & Target Simulation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Grade Point Scale Definition
    const GRADE_POINTS = {
        'A+': 4.0,
        'A': 4.0,
        'A-': 3.7,
        'B+': 3.3,
        'B': 3.0,
        'B-': 2.7,
        'C+': 2.3,
        'C': 2.0,
        'C-': 1.7,
        'D+': 1.3,
        'D': 1.0,
        'F': 0.0
    };

    const WEIGHT_BONUS = {
        'regular': 0.0,
        'honors': 0.5,
        'ap': 1.0
    };

    // DOM Elements
    const tbody = document.getElementById('course-rows-tbody');
    const btnAddCourse = document.getElementById('btn-add-course');
    const btnLoadSample = document.getElementById('btn-load-sample');
    const btnClearCourses = document.getElementById('btn-clear-courses');

    const togglePriorGpa = document.getElementById('toggle-prior-gpa');
    const priorGpaContainer = document.getElementById('prior-gpa-container');
    const priorCumGpaInput = document.getElementById('prior-cum-gpa');
    const priorCumCreditsInput = document.getElementById('prior-cum-credits');

    const toggleTargetGpa = document.getElementById('toggle-target-gpa');
    const targetGpaContainer = document.getElementById('target-gpa-container');
    const targetDesiredGpaInput = document.getElementById('target-desired-gpa');
    const targetFutureCreditsInput = document.getElementById('target-future-credits');
    const targetGpaVerdict = document.getElementById('target-gpa-verdict');

    const gpaHeroValue = document.getElementById('gpa-hero-value');
    const gpaHeroBadge = document.getElementById('gpa-hero-badge');

    const cardSemCredits = document.getElementById('card-sem-credits');
    const cardCourseCount = document.getElementById('card-course-count');
    const cardQualityPoints = document.getElementById('card-quality-points');
    const cardCumContainer = document.getElementById('card-cum-container');
    const cardCumGpa = document.getElementById('card-cum-gpa');
    const cardCumCredits = document.getElementById('card-cum-credits');
    const cardLetterGrade = document.getElementById('card-letter-grade');

    // Default Sample Courses
    const SAMPLE_COURSES = [
        { name: 'Organic Chemistry', grade: 'A-', credits: 4, weight: 'regular' },
        { name: 'Linear Algebra', grade: 'A', credits: 4, weight: 'regular' },
        { name: 'Microeconomics', grade: 'B+', credits: 3, weight: 'regular' },
        { name: 'Academic Writing', grade: 'B', credits: 3, weight: 'regular' },
        { name: 'Physics Laboratory', grade: 'A', credits: 2, weight: 'regular' }
    ];

    // Create a new table row
    function createCourseRow(course = { name: '', grade: 'A', credits: 3, weight: 'regular' }) {
        const tr = document.createElement('tr');

        // Build Grade Options
        let gradeOptions = '';
        for (const [letter, val] of Object.entries(GRADE_POINTS)) {
            const selected = (letter === course.grade) ? 'selected' : '';
            gradeOptions += `<option value="${letter}" ${selected}>${letter} (${val.toFixed(2)})</option>`;
        }

        tr.innerHTML = `
            <td>
                <input type="text" class="form-control course-name" value="${course.name}" placeholder="e.g. History 101" style="font-size: 0.9rem;">
            </td>
            <td>
                <select class="form-control course-grade" style="font-size: 0.9rem;">
                    ${gradeOptions}
                </select>
            </td>
            <td>
                <input type="number" class="form-control course-credits" value="${course.credits}" min="0.5" max="20" step="0.5" style="font-size: 0.9rem;">
            </td>
            <td>
                <select class="form-control course-weight" style="font-size: 0.9rem;">
                    <option value="regular" ${course.weight === 'regular' ? 'selected' : ''}>Standard (College)</option>
                    <option value="honors" ${course.weight === 'honors' ? 'selected' : ''}>Honors (+0.5)</option>
                    <option value="ap" ${course.weight === 'ap' ? 'selected' : ''}>AP / IB (+1.0)</option>
                </select>
            </td>
            <td style="text-align: center;">
                <button type="button" class="btn btn-secondary btn-delete-row" title="Remove Course" style="padding: 4px 8px; font-size: 0.85rem; border-color: transparent; color: #ef4444;">
                    ✕
                </button>
            </td>
        `;

        // Row listeners
        tr.querySelectorAll('input, select').forEach(elem => {
            elem.addEventListener('input', calculateGPA);
            elem.addEventListener('change', calculateGPA);
        });

        tr.querySelector('.btn-delete-row').addEventListener('click', () => {
            if (tbody.children.length > 1) {
                tr.remove();
                calculateGPA();
            } else {
                // If only 1 row left, just clear inputs
                tr.querySelector('.course-name').value = '';
                tr.querySelector('.course-credits').value = '3';
                calculateGPA();
            }
        });

        tbody.appendChild(tr);
    }

    // Populate Sample Data
    function loadSampleData() {
        tbody.innerHTML = '';
        SAMPLE_COURSES.forEach(c => createCourseRow(c));
        priorCumGpaInput.value = '3.40';
        priorCumCreditsInput.value = '45';
        togglePriorGpa.checked = true;
        priorGpaContainer.style.display = 'grid';
        calculateGPA();
    }

    // Clear all rows
    function clearAllCourses() {
        tbody.innerHTML = '';
        createCourseRow({ name: '', grade: 'A', credits: 3, weight: 'regular' });
        calculateGPA();
    }

    // Prior GPA toggle
    togglePriorGpa.addEventListener('change', () => {
        priorGpaContainer.style.display = togglePriorGpa.checked ? 'grid' : 'none';
        calculateGPA();
    });

    [priorCumGpaInput, priorCumCreditsInput].forEach(inp => {
        inp.addEventListener('input', calculateGPA);
        inp.addEventListener('change', calculateGPA);
    });

    // Target GPA toggle
    toggleTargetGpa.addEventListener('change', () => {
        targetGpaContainer.style.display = toggleTargetGpa.checked ? 'block' : 'none';
        calculateGPA();
    });

    [targetDesiredGpaInput, targetFutureCreditsInput].forEach(inp => {
        inp.addEventListener('input', calculateGPA);
        inp.addEventListener('change', calculateGPA);
    });

    // Button Listeners
    btnAddCourse.addEventListener('click', () => {
        createCourseRow({ name: '', grade: 'A', credits: 3, weight: 'regular' });
        calculateGPA();
    });

    btnLoadSample.addEventListener('click', loadSampleData);
    btnClearCourses.addEventListener('click', clearAllCourses);

    // Main GPA Calculation
    function calculateGPA() {
        const rows = tbody.querySelectorAll('tr');
        let semTotalCredits = 0;
        let semTotalQualityPoints = 0;
        let validCourseCount = 0;

        rows.forEach(tr => {
            const gradeLetter = tr.querySelector('.course-grade').value;
            const credits = parseFloat(tr.querySelector('.course-credits').value) || 0;
            const weightType = tr.querySelector('.course-weight').value;

            if (credits > 0 && GRADE_POINTS[gradeLetter] !== undefined) {
                const basePoints = GRADE_POINTS[gradeLetter];
                const bonus = WEIGHT_BONUS[weightType] || 0.0;
                const effectivePoints = basePoints > 0 ? (basePoints + bonus) : 0; // F remains 0.0

                semTotalCredits += credits;
                semTotalQualityPoints += (credits * effectivePoints);
                validCourseCount++;
            }
        });

        // Semester GPA
        const semGPA = semTotalCredits > 0 ? (semTotalQualityPoints / semTotalCredits) : 0.00;

        // Display Hero
        gpaHeroValue.innerHTML = `${semGPA.toFixed(2)} <span style="font-size: 1.25rem; font-weight: 500; color: var(--color-text-muted);">/ 4.00</span>`;
        gpaHeroBadge.textContent = getHonorsBadge(semGPA);

        // Update Breakdown Cards
        cardSemCredits.textContent = semTotalCredits.toFixed(1);
        cardCourseCount.textContent = `${validCourseCount} courses active`;
        cardQualityPoints.textContent = semTotalQualityPoints.toFixed(2);
        cardLetterGrade.textContent = getLetterGradeEquivalent(semGPA);

        // Cumulative Calculation
        let effectiveCumGPA = semGPA;
        let totalAllCredits = semTotalCredits;

        if (togglePriorGpa.checked) {
            const priorGPA = parseFloat(priorCumGpaInput.value) || 0;
            const priorCredits = parseFloat(priorCumCreditsInput.value) || 0;

            const priorQualityPoints = priorGPA * priorCredits;
            totalAllCredits = priorCredits + semTotalCredits;

            if (totalAllCredits > 0) {
                effectiveCumGPA = (priorQualityPoints + semTotalQualityPoints) / totalAllCredits;
            } else {
                effectiveCumGPA = 0;
            }

            cardCumContainer.style.display = 'block';
            cardCumGpa.textContent = effectiveCumGPA.toFixed(2);
            cardCumCredits.textContent = `Across ${totalAllCredits.toFixed(1)} total credits`;
        } else {
            cardCumContainer.style.display = 'none';
        }

        // Target GPA Simulation
        if (toggleTargetGpa.checked) {
            simulateTargetGPA(effectiveCumGPA, totalAllCredits);
        }
    }

    // Target GPA Math:
    // GP_req = [G_target * (C_current + C_future) - (C_current * GPA_current)] / C_future
    function simulateTargetGPA(currentCumGPA, currentCredits) {
        const targetGoal = parseFloat(targetDesiredGpaInput.value) || 0;
        const futureCredits = parseFloat(targetFutureCreditsInput.value) || 0;

        if (targetGoal <= 0 || futureCredits <= 0) {
            targetGpaVerdict.innerHTML = '<span style="color: var(--color-text-muted);">Enter desired graduation GPA and remaining credits to see projection.</span>';
            return;
        }

        const totalProjectedCredits = currentCredits + futureCredits;
        const targetTotalPoints = targetGoal * totalProjectedCredits;
        const currentPoints = currentCumGPA * currentCredits;
        const requiredFuturePoints = targetTotalPoints - currentPoints;
        const requiredGPA = requiredFuturePoints / futureCredits;

        if (requiredGPA > 4.0) {
            targetGpaVerdict.innerHTML = `
                <div style="font-weight: 600; color: #ef4444; margin-bottom: 4px;">
                    ⚠️ Target Mathematically Infeasible: Requires ${requiredGPA.toFixed(2)} GPA
                </div>
                <div style="color: var(--color-text-muted);">
                    To attain a <strong>${targetGoal.toFixed(2)}</strong> cumulative GPA over your next <strong>${futureCredits} credits</strong>, you would need to average a <strong>${requiredGPA.toFixed(2)}</strong>, which exceeds the standard 4.0 unweighted ceiling. Consider grade forgiveness retakes or increasing future credit hours.
                </div>
            `;
        } else if (requiredGPA <= 0) {
            targetGpaVerdict.innerHTML = `
                <div style="font-weight: 600; color: #10b981; margin-bottom: 4px;">
                    🎉 Goal Already Secured!
                </div>
                <div style="color: var(--color-text-muted);">
                    Your current cumulative GPA of <strong>${currentCumGPA.toFixed(2)}</strong> already guarantees meeting or exceeding your target of <strong>${targetGoal.toFixed(2)}</strong> across the remaining <strong>${futureCredits} credits</strong>.
                </div>
            `;
        } else if (requiredGPA <= 3.20) {
            targetGpaVerdict.innerHTML = `
                <div style="font-weight: 600; color: #10b981; margin-bottom: 4px;">
                    ✅ Readily Achievable: Requires an average GPA of <strong>${requiredGPA.toFixed(2)}</strong> (${getLetterGradeEquivalent(requiredGPA)})
                </div>
                <div style="color: var(--color-text-muted);">
                    Maintaining solid B/B+ performance over your remaining <strong>${futureCredits} credits</strong> will successfully achieve your graduation goal of <strong>${targetGoal.toFixed(2)}</strong>.
                </div>
            `;
        } else if (requiredGPA <= 3.70) {
            targetGpaVerdict.innerHTML = `
                <div style="font-weight: 600; color: #f59e0b; margin-bottom: 4px;">
                    ⚡ Moderate Challenge: Requires an average GPA of <strong>${requiredGPA.toFixed(2)}</strong> (${getLetterGradeEquivalent(requiredGPA)})
                </div>
                <div style="color: var(--color-text-muted);">
                    You will need mostly A- and B+ grades across your next <strong>${futureCredits} credits</strong> to reach <strong>${targetGoal.toFixed(2)}</strong>.
                </div>
            `;
        } else {
            targetGpaVerdict.innerHTML = `
                <div style="font-weight: 600; color: #a855f7; margin-bottom: 4px;">
                    🔥 High Academic Rigor: Requires an average GPA of <strong>${requiredGPA.toFixed(2)}</strong> (${getLetterGradeEquivalent(requiredGPA)})
                </div>
                <div style="color: var(--color-text-muted);">
                    Near-perfect academic performance (predominantly straight As) is mandatory across all remaining <strong>${futureCredits} credits</strong> to reach <strong>${targetGoal.toFixed(2)}</strong>.
                </div>
            `;
        }
    }

    // Honors Standing Description
    function getHonorsBadge(gpa) {
        if (gpa >= 3.90) return '🏆 Summa Cum Laude / Highest Honors Trajectory';
        if (gpa >= 3.75) return '🎖️ Magna Cum Laude / High Honors Standing';
        if (gpa >= 3.50) return '🏅 Dean\'s List Standing (Cum Laude)';
        if (gpa >= 3.00) return '📘 Good Academic Standing';
        if (gpa >= 2.00) return '📙 Satisfactory Academic Progress';
        return '⚠️ Academic Warning / Academic Probation Standing';
    }

    // Letter Grade Equivalent
    function getLetterGradeEquivalent(gpa) {
        if (gpa >= 3.85) return 'A (Superior)';
        if (gpa >= 3.50) return 'A- (Excellent)';
        if (gpa >= 3.15) return 'B+ (Very Good)';
        if (gpa >= 2.85) return 'B (Above Average)';
        if (gpa >= 2.50) return 'B- (Average)';
        if (gpa >= 2.15) return 'C+ (Satisfactory)';
        if (gpa >= 1.85) return 'C (Fair)';
        if (gpa >= 1.50) return 'C- (Passing)';
        if (gpa >= 1.00) return 'D (Minimum Passing)';
        return 'F (Failing)';
    }

    // Initial Population
    loadSampleData();
});
