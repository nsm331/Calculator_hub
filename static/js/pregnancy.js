/**
 * Pregnancy Due Date Calculator - Pure Vanilla JavaScript Engine
 * Clinical obstetric algorithms including Naegele's Rule, cycle adjustments,
 * conception dating, IVF blastocyst stages, ultrasound Crown-Rump regressions,
 * trimester tracking, and fetal size milestones.
 */

document.addEventListener('DOMContentLoaded', function () {
    // DOM Tab Elements
    const tabBtns = document.querySelectorAll('.preg-tab-btn');
    const tabPanes = {
        lmp: document.getElementById('pane-lmp'),
        conception: document.getElementById('pane-conception'),
        ivf: document.getElementById('pane-ivf'),
        ultrasound: document.getElementById('pane-ultrasound')
    };

    // Form Inputs
    const lmpDateInput = document.getElementById('lmp-date');
    const cycleLengthInput = document.getElementById('cycle-length');
    const conceptionDateInput = document.getElementById('conception-date');
    const ivfDateInput = document.getElementById('ivf-date');
    const ivfTypeSelect = document.getElementById('ivf-type');
    const usDateInput = document.getElementById('us-date');
    const usWeeksInput = document.getElementById('us-weeks');
    const usDaysInput = document.getElementById('us-days');

    const calcBtn = document.getElementById('preg-calc-btn');
    const todayBtn = document.getElementById('preg-today-btn');

    // Result DOM Elements
    const resDueDate = document.getElementById('res-due-date');
    const resDueDay = document.getElementById('res-due-day');
    const resGestAge = document.getElementById('res-gest-age');
    const resDaysPassed = document.getElementById('res-days-passed');
    const resTrimester = document.getElementById('res-trimester');
    const resTrimesterDesc = document.getElementById('res-trimester-desc');
    const resDaysLeft = document.getElementById('res-days-left');
    const resWeeksLeft = document.getElementById('res-weeks-left');
    const resBabySize = document.getElementById('res-baby-size');
    const resBabyDim = document.getElementById('res-baby-dim');
    const resProgressPct = document.getElementById('res-progress-pct');
    const timelineProgressBar = document.getElementById('timeline-progress-bar');
    const milestonesTableBody = document.getElementById('milestones-table-body');

    let currentMode = 'lmp';

    // Fetal Size Comparison Map by gestational week
    const babySizes = [
        { week: 4, name: 'Poppy Seed 🌱', dim: '0.04 in • < 0.01 oz' },
        { week: 5, name: 'Apple Seed 🍎', dim: '0.05 in • < 0.01 oz' },
        { week: 6, name: 'Sweet Pea 🟢', dim: '0.15 in • 0.01 oz' },
        { week: 7, name: 'Blueberry 🫐', dim: '0.5 in • 0.02 oz' },
        { week: 8, name: 'Raspberry 🍇', dim: '0.6 in • 0.04 oz' },
        { week: 9, name: 'Cherry 🍒', dim: '0.9 in • 0.07 oz' },
        { week: 10, name: 'Strawberry 🍓', dim: '1.2 in • 0.14 oz' },
        { week: 11, name: 'Lime 🍈', dim: '1.6 in • 0.25 oz' },
        { week: 12, name: 'Plum 🟣', dim: '2.1 in • 0.5 oz' },
        { week: 13, name: 'Peach 🍑', dim: '2.9 in • 0.8 oz' },
        { week: 14, name: 'Lemon 🍋', dim: '3.4 in • 1.5 oz' },
        { week: 15, name: 'Apple 🍏', dim: '4.0 in • 2.5 oz' },
        { week: 16, name: 'Avocado 🥑', dim: '4.6 in • 3.5 oz' },
        { week: 17, name: 'Pomegranate 🌰', dim: '5.1 in • 5.0 oz' },
        { week: 18, name: 'Bell Pepper 🫑', dim: '5.6 in • 6.7 oz' },
        { week: 19, name: 'Mango 🥭', dim: '6.0 in • 8.5 oz' },
        { week: 20, name: 'Banana 🍌', dim: '6.5 in • 10.6 oz' },
        { week: 21, name: 'Carrot 🥕', dim: '10.5 in • 12.7 oz' },
        { week: 22, name: 'Papaya 🍈', dim: '11.0 in • 15.0 oz' },
        { week: 23, name: 'Grapefruit 🍊', dim: '11.4 in • 1.1 lb' },
        { week: 24, name: 'Cantaloupe 🍈', dim: '11.8 in • 1.3 lb' },
        { week: 25, name: 'Cauliflower 🥦', dim: '13.6 in • 1.5 lb' },
        { week: 26, name: 'Kale / Lettuce 🥬', dim: '14.0 in • 1.7 lb' },
        { week: 27, name: 'Rutabaga 🥔', dim: '14.4 in • 1.9 lb' },
        { week: 28, name: 'Eggplant 🍆', dim: '14.8 in • 2.2 lb' },
        { week: 29, name: 'Acorn Squash 🌰', dim: '15.2 in • 2.5 lb' },
        { week: 30, name: 'Cabbage 🥬', dim: '15.7 in • 3.0 lb' },
        { week: 31, name: 'Coconut 🥥', dim: '16.2 in • 3.3 lb' },
        { week: 32, name: 'Jicama 🥔', dim: '16.7 in • 3.8 lb' },
        { week: 33, name: 'Pineapple 🍍', dim: '17.2 in • 4.2 lb' },
        { week: 34, name: 'Cantaloupe 🍈', dim: '17.7 in • 4.7 lb' },
        { week: 35, name: 'Honeydew 🍈', dim: '18.2 in • 5.3 lb' },
        { week: 36, name: 'Romaine Lettuce 🥬', dim: '18.7 in • 5.8 lb' },
        { week: 37, name: 'Swiss Chard 🥬', dim: '19.1 in • 6.3 lb' },
        { week: 38, name: 'Winter Melon 🍈', dim: '19.6 in • 6.8 lb' },
        { week: 39, name: 'Pumpkin 🎃', dim: '20.0 in • 7.3 lb' },
        { week: 40, name: 'Watermelon 🍉', dim: '20.2 in • 7.6 lb' }
    ];

    // Helper: Format Date string
    function formatDate(d) {
        if (!d || isNaN(d.getTime())) return '—';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return d.toLocaleDateString('en-US', options);
    }

    function formatShortDate(d) {
        if (!d || isNaN(d.getTime())) return '—';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return d.toLocaleDateString('en-US', options);
    }

    function addDays(d, days) {
        const result = new Date(d);
        result.setDate(result.getDate() + days);
        return result;
    }

    // Set initial realistic default dates (approx 14 weeks pregnant)
    function setRealisticDefaults() {
        const today = new Date();
        const defaultLmp = addDays(today, -100); // 14w 2d ago
        lmpDateInput.value = defaultLmp.toISOString().split('T')[0];

        const defaultConception = addDays(today, -86);
        conceptionDateInput.value = defaultConception.toISOString().split('T')[0];

        const defaultIvf = addDays(today, -81);
        ivfDateInput.value = defaultIvf.toISOString().split('T')[0];

        const defaultUs = addDays(today, -42);
        usDateInput.value = defaultUs.toISOString().split('T')[0];
        usWeeksInput.value = '8';
        usDaysInput.value = '2';

        calculatePregnancy();
    }

    // Main Pregnancy Calculation
    function calculatePregnancy() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let syntheticLMP = null;
        let dueDate = null;

        if (currentMode === 'lmp') {
            const lmpVal = lmpDateInput.value;
            if (!lmpVal) return;
            const lmpParts = lmpVal.split('-');
            const lmpDate = new Date(parseInt(lmpParts[0], 10), parseInt(lmpParts[1], 10) - 1, parseInt(lmpParts[2], 10));
            const cycleDays = parseInt(cycleLengthInput.value, 10) || 28;
            const cycleOffset = cycleDays - 28;

            syntheticLMP = addDays(lmpDate, cycleOffset);
            // 280 days total human gestation
            dueDate = addDays(syntheticLMP, 280);

        } else if (currentMode === 'conception') {
            const concVal = conceptionDateInput.value;
            if (!concVal) return;
            const concParts = concVal.split('-');
            const concDate = new Date(parseInt(concParts[0], 10), parseInt(concParts[1], 10) - 1, parseInt(concParts[2], 10));

            // Standard fertilization is at cycle day 14 (266 days post-conception)
            syntheticLMP = addDays(concDate, -14);
            dueDate = addDays(concDate, 266);

        } else if (currentMode === 'ivf') {
            const ivfVal = ivfDateInput.value;
            if (!ivfVal) return;
            const ivfParts = ivfVal.split('-');
            const ivfDate = new Date(parseInt(ivfParts[0], 10), parseInt(ivfParts[1], 10) - 1, parseInt(ivfParts[2], 10));
            const embryoDays = parseInt(ivfTypeSelect.value, 10) || 5;

            // 266 days total embryonic development minus embryo age at transfer
            dueDate = addDays(ivfDate, 266 - embryoDays);
            syntheticLMP = addDays(dueDate, -280);

        } else if (currentMode === 'ultrasound') {
            const usVal = usDateInput.value;
            if (!usVal) return;
            const usParts = usVal.split('-');
            const usDate = new Date(parseInt(usParts[0], 10), parseInt(usParts[1], 10) - 1, parseInt(usParts[2], 10));
            const usWeeks = parseInt(usWeeksInput.value, 10) || 0;
            const usDays = parseInt(usDaysInput.value, 10) || 0;
            const totalUsDays = (usWeeks * 7) + usDays;

            syntheticLMP = addDays(usDate, -totalUsDays);
            dueDate = addDays(syntheticLMP, 280);
        }

        if (!dueDate || !syntheticLMP) return;

        // Render Hero Due Date
        const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        resDueDate.textContent = `${monthNames[dueDate.getMonth()]} ${dueDate.getDate()}, ${dueDate.getFullYear()}`;
        resDueDay.textContent = `${weekdayNames[dueDate.getDay()]} • 40 completed weeks of gestation`;

        // Calculate Gestational Age
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysPassed = Math.floor((today.getTime() - syntheticLMP.getTime()) / msPerDay);
        const daysLeft = Math.floor((dueDate.getTime() - today.getTime()) / msPerDay);

        const currentWeeks = Math.floor(Math.max(0, daysPassed) / 7);
        const currentDays = Math.max(0, daysPassed) % 7;

        resGestAge.textContent = `${currentWeeks} Weeks, ${currentDays} Days`;
        resDaysPassed.textContent = `${Math.max(0, daysPassed)} days elapsed`;

        // Trimester Identification
        if (daysPassed < 0) {
            resTrimester.textContent = 'Pre-conception';
            resTrimester.style.color = 'var(--color-text-muted)';
            resTrimesterDesc.textContent = 'Awaiting ovulation/conception';
        } else if (currentWeeks < 14) {
            resTrimester.textContent = '1st Trimester';
            resTrimester.style.color = '#3b82f6';
            resTrimesterDesc.textContent = 'Organogenesis & foundational growth';
        } else if (currentWeeks < 28) {
            resTrimester.textContent = '2nd Trimester';
            resTrimester.style.color = '#10b981';
            resTrimesterDesc.textContent = 'Golden period of energy & movement';
        } else {
            resTrimester.textContent = '3rd Trimester';
            resTrimester.style.color = '#ec4899';
            resTrimesterDesc.textContent = 'Rapid growth & final lung maturation';
        }

        // Days left
        if (daysLeft < 0) {
            resDaysLeft.textContent = 'Past Due';
            resDaysLeft.style.color = '#f59e0b';
            resWeeksLeft.textContent = `${Math.abs(daysLeft)} days overdue`;
        } else {
            resDaysLeft.textContent = `${daysLeft} Days`;
            resDaysLeft.style.color = '#10b981';
            resWeeksLeft.textContent = `Approx. ${(daysLeft / 7).toFixed(1)} weeks to go`;
        }

        // Baby Size Lookup
        const clampedWeek = Math.min(40, Math.max(4, currentWeeks));
        const matchedSize = babySizes.find(b => b.week >= clampedWeek) || babySizes[babySizes.length - 1];
        resBabySize.textContent = matchedSize.name;
        resBabyDim.textContent = `Approx ${matchedSize.dim}`;

        // Timeline Progress Bar
        const progressPct = Math.min(100, Math.max(0, (daysPassed / 280) * 100));
        resProgressPct.textContent = `${progressPct.toFixed(1)}%`;
        timelineProgressBar.style.width = `${progressPct.toFixed(1)}%`;

        // Render Milestones Table
        renderMilestones(syntheticLMP, today);
    }

    // Render Milestones Schedule Table
    function renderMilestones(syntheticLMP, today) {
        const milestones = [
            { name: 'Estimated Conception Date', week: 2, days: 14 },
            { name: 'Embryo Implantation Window', week: 3, days: 21 },
            { name: 'Neural Tube Closes & Cardiac Tube Pulses', week: 6, days: 42 },
            { name: 'First Trimester Screening / Nuchal Translucency', week: 12, days: 84 },
            { name: 'End of 1st Trimester (Organogenesis Complete)', week: 13, days: 91 },
            { name: 'Early Fetal Movement Perception (Quickening)', week: 17, days: 119 },
            { name: 'Mid-Pregnancy Comprehensive Anatomy Scan', week: 20, days: 140 },
            { name: 'Clinical Fetal Viability Milestone (24 Weeks)', week: 24, days: 168 },
            { name: 'End of 2nd Trimester', week: 27, days: 189 },
            { name: 'Third Trimester Growth & Surfactant Synthesis', week: 32, days: 224 },
            { name: 'Early Full Term Window (ACOG Guidelines)', week: 37, days: 259 },
            { name: 'Full Term Optimal Delivery Window', week: 39, days: 273 },
            { name: 'Estimated Due Date (40 Completed Weeks)', week: 40, days: 280 },
        ];

        let html = '';

        milestones.forEach(m => {
            const mDate = addDays(syntheticLMP, m.days);
            const isCompleted = mDate < today;
            const isCurrentWeek = Math.abs(mDate.getTime() - today.getTime()) <= (3.5 * 24 * 60 * 60 * 1000);

            let statusBadge = '';
            if (isCurrentWeek) {
                statusBadge = '<span style="background: rgba(59, 130, 246, 0.2); color: #60a5fa; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">Current Phase</span>';
            } else if (isCompleted) {
                statusBadge = '<span style="background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">Completed ✓</span>';
            } else {
                statusBadge = '<span style="color: var(--color-text-muted); font-size: 0.8rem;">Upcoming</span>';
            }

            html += `
                <tr style="border-bottom: 1px solid var(--color-border);">
                    <td style="padding: 10px 12px; font-weight: 600; color: ${isCompleted ? 'var(--color-text-muted)' : 'var(--color-text-main)'};">
                        ${m.name}
                    </td>
                    <td style="padding: 10px 12px; color: var(--color-text-muted);">
                        Week ${m.week}
                    </td>
                    <td style="padding: 10px 12px; font-weight: 500; color: ${isCurrentWeek ? '#ec4899' : 'var(--color-text-main)'};">
                        ${formatShortDate(mDate)}
                    </td>
                    <td style="padding: 10px 12px; text-align: right;">
                        ${statusBadge}
                    </td>
                </tr>
            `;
        });

        milestonesTableBody.innerHTML = html;
    }

    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            currentMode = this.getAttribute('data-tab');

            Object.keys(tabPanes).forEach(paneKey => {
                if (paneKey === currentMode) {
                    tabPanes[paneKey].style.display = 'block';
                } else {
                    tabPanes[paneKey].style.display = 'none';
                }
            });

            calculatePregnancy();
        });
    });

    // Real-time Event Listeners
    const allInputs = [
        lmpDateInput, cycleLengthInput, conceptionDateInput,
        ivfDateInput, ivfTypeSelect, usDateInput, usWeeksInput, usDaysInput
    ];

    allInputs.forEach(el => {
        el.addEventListener('input', calculatePregnancy);
        el.addEventListener('change', calculatePregnancy);
    });

    calcBtn.addEventListener('click', calculatePregnancy);
    todayBtn.addEventListener('click', setRealisticDefaults);

    // Initial default execution
    setRealisticDefaults();
});
