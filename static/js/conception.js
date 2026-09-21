/**
 * Conception Date Calculator Engine
 * Calculates:
 *   - Probable conception date from Due Date, LMP, or Ultrasound
 *   - Fertile intercourse window (Conception - 5 days to + 1 day)
 *   - Current gestational age, trimester, progress bar, and clinical milestones
 * 100% Client-Side Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mode tabs
    const tabs = document.querySelectorAll('.conc-tab-btn');
    const sections = {
        edd: document.getElementById('conc-sec-edd'),
        lmp: document.getElementById('conc-sec-lmp'),
        ultrasound: document.getElementById('conc-sec-ultrasound')
    };

    let currentMode = 'edd'; // 'edd', 'lmp', 'ultrasound'

    // Form inputs
    const eddInput = document.getElementById('conc-edd-date');
    const lmpInput = document.getElementById('conc-lmp-date');
    const cycleInput = document.getElementById('conc-cycle-len');
    const usDateInput = document.getElementById('conc-us-date');
    const usWeeksInput = document.getElementById('conc-us-weeks');
    const usDaysInput = document.getElementById('conc-us-days');

    // Output elements
    const concDateEl = document.getElementById('conc-result-date');
    const windowStartEl = document.getElementById('conc-window-start');
    const windowEndEl = document.getElementById('conc-window-end');
    const gestAgeEl = document.getElementById('conc-gest-age');
    const trimesterBadgeEl = document.getElementById('conc-trimester-badge');
    const progressBarEl = document.getElementById('conc-progress-bar');
    const progressPctEl = document.getElementById('conc-progress-pct');
    const eddResultEl = document.getElementById('conc-result-edd');

    // Milestones elements
    const msImplantationEl = document.getElementById('ms-implantation');
    const msHeartbeatEl = document.getElementById('ms-heartbeat');
    const msTrimester1El = document.getElementById('ms-trimester1');
    const msAnatomyEl = document.getElementById('ms-anatomy');
    const msViabilityEl = document.getElementById('ms-viability');
    const msFullTermEl = document.getElementById('ms-fullterm');

    // Set default dates: EDD ~ 6 months from today, LMP ~ 3 months ago, US ~ 1 month ago
    const today = new Date();
    const defaultEdd = new Date(today.getTime() + (180 * 24 * 60 * 60 * 1000));
    const defaultLmp = new Date(today.getTime() - (70 * 24 * 60 * 60 * 1000));
    const defaultUs = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

    if (eddInput) eddInput.value = formatDateForInput(defaultEdd);
    if (lmpInput) lmpInput.value = formatDateForInput(defaultLmp);
    if (usDateInput) usDateInput.value = formatDateForInput(defaultUs);

    function formatDateForInput(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function formatDateDisplay(date) {
        if (!date || isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function parseInputDate(str) {
        if (!str) return null;
        const parts = str.split('-');
        if (parts.length !== 3) return null;
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }

    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function calculate() {
        let conceptionDate = null;
        let estimatedEdd = null;
        let estimatedLmp = null;

        if (currentMode === 'edd') {
            const edd = parseInputDate(eddInput.value);
            if (!edd) return;
            estimatedEdd = edd;
            conceptionDate = addDays(edd, -266);
            estimatedLmp = addDays(edd, -280);
        } else if (currentMode === 'lmp') {
            const lmp = parseInputDate(lmpInput.value);
            if (!lmp) return;
            const cycleLen = parseInt(cycleInput.value) || 28;
            const ovulationDay = cycleLen - 14;
            conceptionDate = addDays(lmp, ovulationDay);
            estimatedEdd = addDays(lmp, 280 + (cycleLen - 28));
            estimatedLmp = lmp;
        } else if (currentMode === 'ultrasound') {
            const usDate = parseInputDate(usDateInput.value);
            if (!usDate) return;
            const weeks = parseInt(usWeeksInput.value) || 0;
            const days = parseInt(usDaysInput.value) || 0;
            const totalScanDays = (weeks * 7) + days;

            estimatedLmp = addDays(usDate, -totalScanDays);
            conceptionDate = addDays(estimatedLmp, 14);
            estimatedEdd = addDays(estimatedLmp, 280);
        }

        if (!conceptionDate || !estimatedEdd || !estimatedLmp) return;

        // Fertile Window: Conception - 5 days through Conception + 1 day
        const windowStart = addDays(conceptionDate, -5);
        const windowEnd = addDays(conceptionDate, 1);

        // Current Gestational Age: from estimatedLmp to today
        const diffMs = today.getTime() - estimatedLmp.getTime();
        const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
        const gestWeeks = Math.max(0, Math.floor(diffDays / 7));
        const gestDays = Math.max(0, diffDays % 7);

        // Render main results
        if (concDateEl) concDateEl.textContent = formatDateDisplay(conceptionDate);
        if (windowStartEl) windowStartEl.textContent = formatDateDisplay(windowStart);
        if (windowEndEl) windowEndEl.textContent = formatDateDisplay(windowEnd);
        if (eddResultEl) eddResultEl.textContent = formatDateDisplay(estimatedEdd);

        if (gestAgeEl) {
            if (diffDays > 0 && diffDays <= 294) {
                gestAgeEl.textContent = `${gestWeeks} weeks, ${gestDays} days`;
            } else if (diffDays <= 0) {
                gestAgeEl.textContent = 'Early / Pre-gestational';
            } else {
                gestAgeEl.textContent = 'Post-term (>42 weeks)';
            }
        }

        // Trimester and Progress
        const progressPct = Math.min(100, Math.max(0, (diffDays / 280) * 100));
        if (progressBarEl) progressBarEl.style.width = `${progressPct}%`;
        if (progressPctEl) progressPctEl.textContent = `${progressPct.toFixed(0)}%`;

        if (trimesterBadgeEl) {
            if (gestWeeks < 14) {
                trimesterBadgeEl.textContent = '1st Trimester';
                trimesterBadgeEl.style.background = 'rgba(59, 130, 246, 0.15)';
                trimesterBadgeEl.style.color = '#60a5fa';
            } else if (gestWeeks < 28) {
                trimesterBadgeEl.textContent = '2nd Trimester';
                trimesterBadgeEl.style.background = 'rgba(16, 185, 129, 0.15)';
                trimesterBadgeEl.style.color = '#34d399';
            } else {
                trimesterBadgeEl.textContent = '3rd Trimester';
                trimesterBadgeEl.style.background = 'rgba(245, 158, 11, 0.15)';
                trimesterBadgeEl.style.color = '#fbbf24';
            }
        }

        // Clinical milestones
        if (msImplantationEl) msImplantationEl.textContent = formatDateDisplay(addDays(conceptionDate, 8));
        if (msHeartbeatEl) msHeartbeatEl.textContent = formatDateDisplay(addDays(estimatedLmp, 42)); // ~6 weeks
        if (msTrimester1El) msTrimester1El.textContent = formatDateDisplay(addDays(estimatedLmp, 91)); // 13 weeks
        if (msAnatomyEl) msAnatomyEl.textContent = formatDateDisplay(addDays(estimatedLmp, 133)); // 19 weeks
        if (msViabilityEl) msViabilityEl.textContent = formatDateDisplay(addDays(estimatedLmp, 168)); // 24 weeks
        if (msFullTermEl) msFullTermEl.textContent = formatDateDisplay(addDays(estimatedLmp, 259)); // 37 weeks
    }

    // Switch modes
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentMode = tab.dataset.mode;

            Object.keys(sections).forEach(sec => {
                if (sections[sec]) {
                    sections[sec].style.display = sec === currentMode ? 'block' : 'none';
                }
            });

            calculate();
        });
    });

    // Event listeners
    const inputs = [eddInput, lmpInput, cycleInput, usDateInput, usWeeksInput, usDaysInput];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', calculate);
            input.addEventListener('change', calculate);
        }
    });

    // Run initial calculation
    calculate();
});
