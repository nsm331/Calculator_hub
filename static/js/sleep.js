/**
 * CalculatorHub - Sleep Cycle Calculator Engine
 * 90-minute ultradian sleep cycle architecture, sleep latency offsets, and power naps.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mode Buttons
    const modeBtns = document.querySelectorAll('.sleep-mode-btn');
    const ampmBtns = document.querySelectorAll('.sleep-ampm-btn');

    const timeInputGroup = document.getElementById('sleep-time-input-group');
    const hourSelect = document.getElementById('sleep-hour');
    const minuteSelect = document.getElementById('sleep-minute');
    const latencySelect = document.getElementById('sleep-latency');
    const latencyDisplay = document.getElementById('sleep-latency-display');
    const calculateBtn = document.getElementById('sleep-calculate-btn');

    const resultsTitle = document.getElementById('sleep-results-title');
    const cyclesContainer = document.getElementById('sleep-cycles-container');

    let currentMode = 'wake'; // 'wake', 'now', 'nap'
    let currentAmPm = 'AM';

    // Set initial AM/PM based on default 7 AM
    currentAmPm = 'AM';
    ampmBtns.forEach(b => {
        b.classList.remove('active');
        if (b.dataset.ampm === 'AM') b.classList.add('active');
    });

    // Mode Switcher
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentMode = this.dataset.mode;
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            if (currentMode === 'wake') {
                timeInputGroup.style.display = 'block';
            } else {
                timeInputGroup.style.display = 'none';
            }
            calculateSleep();
        });
    });

    // AM/PM Toggle
    ampmBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentAmPm = this.dataset.ampm;
            ampmBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            calculateSleep();
        });
    });

    // Latency change
    latencySelect.addEventListener('change', function() {
        const mins = this.value;
        latencyDisplay.textContent = `${mins} minutes latency`;
        calculateSleep();
    });

    [hourSelect, minuteSelect].forEach(el => {
        if (el) {
            el.addEventListener('change', calculateSleep);
        }
    });

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateSleep);
    }

    // Calculation Routine
    function calculateSleep() {
        const latencyMins = parseInt(latencySelect.value, 10) || 14;

        if (currentMode === 'wake') {
            calculateBedtimesForWake(latencyMins);
        } else if (currentMode === 'now') {
            calculateWakeTimesFromNow(latencyMins);
        } else if (currentMode === 'nap') {
            calculatePowerNaps(latencyMins);
        }
    }

    function calculateBedtimesForWake(latency) {
        let hour = parseInt(hourSelect.value, 10) || 7;
        const minute = parseInt(minuteSelect.value, 10) || 0;

        if (currentAmPm === 'PM' && hour < 12) hour += 12;
        if (currentAmPm === 'AM' && hour === 12) hour = 0;

        const now = new Date();
        const wakeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);

        resultsTitle.textContent = `Optimal Bedtimes to Wake Up Refreshed at ${formatTime12h(wakeDate)}`;

        // Calculate for 6, 5, 4, 3 cycles
        const cycles = [
            { k: 6, hrs: 9.0, label: 'Optimal Restorative (Recommended)', badge: 'Recommended', color: 'var(--color-accent-emerald, #10b981)' },
            { k: 5, hrs: 7.5, label: 'Standard Adult Benchmark', badge: 'Standard', color: 'var(--color-accent-emerald, #10b981)' },
            { k: 4, hrs: 6.0, label: 'Acceptable Short Sleep', badge: 'Minimum', color: 'var(--color-accent-amber, #f59e0b)' },
            { k: 3, hrs: 4.5, label: 'Emergency / Partial Sleep', badge: 'Sleep Debt', color: 'var(--color-accent-rose, #ef4444)' }
        ];

        let cardsHtml = '';
        cycles.forEach(c => {
            const totalMinutesToSubtract = (c.k * 90) + latency;
            const bedtime = new Date(wakeDate.getTime() - (totalMinutesToSubtract * 60000));
            const timeFormatted = formatTime12h(bedtime);

            cardsHtml += `
                <div style="background: var(--color-bg-card-alt); border: 1px solid var(--color-border-light); border-top: 4px solid ${c.color}; border-radius: var(--border-radius-md); padding: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.8rem; font-weight: 700; color: ${c.color};">${c.k} Cycles (${c.hrs} hrs)</span>
                        <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 9999px; background: rgba(16, 185, 129, 0.1); color: ${c.color};">${c.badge}</span>
                    </div>
                    <div style="font-size: 2.1rem; font-weight: 900; color: var(--color-text-main); margin: 8px 0 4px;">
                        ${timeFormatted}
                    </div>
                    <div style="font-size: 0.78rem; color: var(--color-text-muted);">
                        ${c.label}
                    </div>
                </div>
            `;
        });

        cyclesContainer.innerHTML = cardsHtml;
    }

    function calculateWakeTimesFromNow(latency) {
        const now = new Date();
        resultsTitle.textContent = `If You Fall Asleep Now (${formatTime12h(now)}), Wake Up At:`;

        const cycles = [
            { k: 6, hrs: 9.0, label: 'Optimal 9-Hour Restorative Sleep', badge: 'Recommended', color: 'var(--color-accent-emerald, #10b981)' },
            { k: 5, hrs: 7.5, label: 'Standard 7.5-Hour Recovery', badge: 'Standard', color: 'var(--color-accent-emerald, #10b981)' },
            { k: 4, hrs: 6.0, label: '6-Hour Light Awakening', badge: 'Adequate', color: 'var(--color-accent-amber, #f59e0b)' },
            { k: 3, hrs: 4.5, label: '4.5-Hour Short Rest', badge: 'Emergency', color: 'var(--color-accent-rose, #ef4444)' }
        ];

        let cardsHtml = '';
        cycles.forEach(c => {
            const totalMinutesToAdd = (c.k * 90) + latency;
            const wakeTime = new Date(now.getTime() + (totalMinutesToAdd * 60000));
            const timeFormatted = formatTime12h(wakeTime);

            cardsHtml += `
                <div style="background: var(--color-bg-card-alt); border: 1px solid var(--color-border-light); border-top: 4px solid ${c.color}; border-radius: var(--border-radius-md); padding: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.8rem; font-weight: 700; color: ${c.color};">${c.k} Cycles (${c.hrs} hrs)</span>
                        <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 9999px; background: rgba(16, 185, 129, 0.1); color: ${c.color};">${c.badge}</span>
                    </div>
                    <div style="font-size: 2.1rem; font-weight: 900; color: var(--color-text-main); margin: 8px 0 4px;">
                        ${timeFormatted}
                    </div>
                    <div style="font-size: 0.78rem; color: var(--color-text-muted);">
                        ${c.label}
                    </div>
                </div>
            `;
        });

        cyclesContainer.innerHTML = cardsHtml;
    }

    function calculatePowerNaps(latency) {
        const now = new Date();
        resultsTitle.textContent = `Scientific Power Nap Alarms (Starting Now: ${formatTime12h(now)})`;

        const nap20 = new Date(now.getTime() + ((20 + latency) * 60000));
        const nap90 = new Date(now.getTime() + ((90 + latency) * 60000));

        const cardsHtml = `
            <div style="background: var(--color-bg-card-alt); border: 1px solid var(--color-border-light); border-top: 4px solid var(--color-accent-blue); border-radius: var(--border-radius-md); padding: 18px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.82rem; font-weight: 700; color: var(--color-accent-blue);">⚡ 20-Minute Power Nap</span>
                    <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 9999px; background: rgba(59, 130, 246, 0.1); color: var(--color-accent-blue);">Stage N2 Rest</span>
                </div>
                <div style="font-size: 2.3rem; font-weight: 900; color: var(--color-text-main); margin: 8px 0 4px;">
                    ${formatTime12h(nap20)}
                </div>
                <div style="font-size: 0.8rem; color: var(--color-text-muted); line-height: 1.4;">
                    Boosts cognitive alertness and motor memory. Halts before Stage N3 Slow-Wave sleep, eliminating grogginess.
                </div>
            </div>

            <div style="background: var(--color-bg-card-alt); border: 1px solid var(--color-border-light); border-top: 4px solid var(--color-accent-emerald); border-radius: var(--border-radius-md); padding: 18px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.82rem; font-weight: 700; color: var(--color-accent-emerald);">🔄 90-Minute Full Restorative Nap</span>
                    <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 9999px; background: rgba(16, 185, 129, 0.1); color: var(--color-accent-emerald);">Full Cycle</span>
                </div>
                <div style="font-size: 2.3rem; font-weight: 900; color: var(--color-text-main); margin: 8px 0 4px;">
                    ${formatTime12h(nap90)}
                </div>
                <div style="font-size: 0.8rem; color: var(--color-text-muted); line-height: 1.4;">
                    Encapsulates both physical slow-wave tissue repair and REM emotional memory consolidation without sleep inertia.
                </div>
            </div>
        `;

        cyclesContainer.innerHTML = cardsHtml;
    }

    function formatTime12h(date) {
        let h = date.getHours();
        const m = date.getMinutes();
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        if (h === 0) h = 12;
        const mStr = m < 10 ? '0' + m : m;
        return `${h}:${mStr} ${ampm}`;
    }

    // Initial Execution
    calculateSleep();
});
