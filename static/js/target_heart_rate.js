/**
 * Target Heart Rate Zones Calculator Engine
 * 100% Vanilla JS - Cardiovascular Bioenergetics & Karvonen Reserve
 */

document.addEventListener('DOMContentLoaded', () => {
    let currentMethod = 'karvonen'; // 'karvonen' | 'mhr'

    // DOM Elements
    const tabKarvonen = document.getElementById('tab-method-karvonen');
    const tabMhr = document.getElementById('tab-method-mhr');

    const ageInput = document.getElementById('thr-age');
    const rhrInput = document.getElementById('thr-rhr');
    const rhrGroup = document.getElementById('group-rhr');
    const formulaSelect = document.getElementById('thr-formula');
    const customMhrInput = document.getElementById('thr-custom-mhr');
    const customMhrGroup = document.getElementById('group-custom-mhr');

    const intensitySlider = document.getElementById('thr-custom-intensity');
    const labelCustomPct = document.getElementById('label-custom-pct');
    const labelCustomBpm = document.getElementById('label-custom-bpm');

    const form = document.getElementById('thr-form');
    const resetBtn = document.getElementById('btn-reset-thr');

    // Hero elements
    const heroMhrVal = document.getElementById('hero-mhr-val');
    const heroZone2Val = document.getElementById('hero-zone2-val');

    // Zone range displays
    const z1Range = document.getElementById('z1-bpm-range');
    const z2Range = document.getElementById('z2-bpm-range');
    const z3Range = document.getElementById('z3-bpm-range');
    const z4Range = document.getElementById('z4-bpm-range');
    const z5Range = document.getElementById('z5-bpm-range');

    const tableTbody = document.getElementById('thr-table-tbody');

    // Method Tabs
    tabKarvonen.addEventListener('click', () => {
        currentMethod = 'karvonen';
        tabKarvonen.classList.add('active');
        tabMhr.classList.remove('active');
        rhrGroup.style.display = 'block';
        calculateZones();
    });

    tabMhr.addEventListener('click', () => {
        currentMethod = 'mhr';
        tabMhr.classList.add('active');
        tabKarvonen.classList.remove('active');
        rhrGroup.style.display = 'none';
        calculateZones();
    });

    // Formula Select change
    formulaSelect.addEventListener('change', () => {
        if (formulaSelect.value === 'custom') {
            customMhrGroup.style.display = 'block';
        } else {
            customMhrGroup.style.display = 'none';
        }
        calculateZones();
    });

    // Custom Intensity Slider
    intensitySlider.addEventListener('input', () => {
        labelCustomPct.textContent = `${intensitySlider.value}%`;
        calculateCustomIntensity();
    });

    // Inputs listener
    [ageInput, rhrInput, customMhrInput].forEach(inp => {
        inp.addEventListener('input', calculateZones);
        inp.addEventListener('change', calculateZones);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateZones();
    });

    resetBtn.addEventListener('click', () => {
        ageInput.value = '35';
        rhrInput.value = '55';
        formulaSelect.value = 'tanaka';
        customMhrInput.value = '185';
        customMhrGroup.style.display = 'none';
        intensitySlider.value = '72';
        labelCustomPct.textContent = '72%';
        currentMethod = 'karvonen';
        tabKarvonen.classList.add('active');
        tabMhr.classList.remove('active');
        rhrGroup.style.display = 'block';
        calculateZones();
    });

    // Calculate Max Heart Rate based on chosen formula
    function computeMHR(age) {
        const formula = formulaSelect.value;
        if (formula === 'custom') {
            return parseFloat(customMhrInput.value) || 185;
        } else if (formula === 'gellish') {
            return 207 - (0.7 * age);
        } else if (formula === 'fox') {
            return 220 - age;
        }
        // Tanaka default
        return 208 - (0.7 * age);
    }

    // Calculate BPM at specific fractional intensity (0.50 to 1.00)
    function computeTargetBpm(mhr, rhr, intensity) {
        if (currentMethod === 'karvonen') {
            const hrr = Math.max(0, mhr - rhr);
            return rhr + (hrr * intensity);
        }
        return mhr * intensity;
    }

    // Dynamic Zone Calculator
    function calculateZones() {
        const age = parseFloat(ageInput.value) || 35;
        const rhr = parseFloat(rhrInput.value) || 55;

        const mhr = Math.round(computeMHR(age));
        const hrr = Math.max(0, mhr - rhr);

        // Zone Boundaries
        const z1Low = Math.round(computeTargetBpm(mhr, rhr, 0.50));
        const z1High = Math.round(computeTargetBpm(mhr, rhr, 0.60));

        const z2Low = z1High;
        const z2High = Math.round(computeTargetBpm(mhr, rhr, 0.70));

        const z3Low = z2High;
        const z3High = Math.round(computeTargetBpm(mhr, rhr, 0.80));

        const z4Low = z3High;
        const z4High = Math.round(computeTargetBpm(mhr, rhr, 0.90));

        const z5Low = z4High;
        const z5High = mhr;

        // Update Hero
        heroMhrVal.innerHTML = `${mhr} <span style="font-size: 1.25rem; font-weight: 500; color: var(--color-text-muted);">BPM</span>`;
        if (currentMethod === 'karvonen') {
            heroZone2Val.innerHTML = `Zone 2 (Aerobic Base / FatMax): <strong>${z2Low} &ndash; ${z2High} BPM</strong> &bull; Reserve (HRR): <strong>${hrr} BPM</strong>`;
        } else {
            heroZone2Val.innerHTML = `Zone 2 (Aerobic Base / FatMax): <strong>${z2Low} &ndash; ${z2High} BPM</strong> &bull; Formula: Tanaka MHR`;
        }

        // Update Zone Cards
        z1Range.textContent = `${z1Low} – ${z1High} BPM`;
        z2Range.textContent = `${z2Low} – ${z2High} BPM`;
        z3Range.textContent = `${z3Low} – ${z3High} BPM`;
        z4Range.textContent = `${z4Low} – ${z4High} BPM`;
        z5Range.textContent = `${z5Low} – ${z5High} BPM`;

        // Update Slider
        calculateCustomIntensity();

        // Render Table
        renderBioenergeticsTable(z1Low, z1High, z2Low, z2High, z3Low, z3High, z4Low, z4High, z5Low, z5High);
    }

    function calculateCustomIntensity() {
        const age = parseFloat(ageInput.value) || 35;
        const rhr = parseFloat(rhrInput.value) || 55;
        const mhr = Math.round(computeMHR(age));
        const pct = parseFloat(intensitySlider.value) / 100;

        const targetBpm = Math.round(computeTargetBpm(mhr, rhr, pct));
        labelCustomBpm.textContent = `${targetBpm} BPM`;
    }

    function renderBioenergeticsTable(z1L, z1H, z2L, z2H, z3L, z3H, z4L, z4H, z5L, z5H) {
        const zones = [
            {
                name: 'Zone 1: Active Recovery',
                intensity: '50% – 60%',
                pulse: `${z1L} – ${z1H} BPM`,
                rpe: 'RPE 1 – 2 (Very Light)',
                talk: 'Can comfortably sing and talk continuously',
                workout: 'Warm-up, cool-down, post-race recovery walk'
            },
            {
                name: 'Zone 2: Aerobic Base (FatMax)',
                intensity: '60% – 70%',
                pulse: `${z2L} – ${z2H} BPM`,
                rpe: 'RPE 3 – 4 (Light & Controlled)',
                talk: 'Full conversational sentences without pausing for breath',
                workout: 'Long slow distance (LSD), foundational aerobic base'
            },
            {
                name: 'Zone 3: Aerobic Endurance & Tempo',
                intensity: '70% – 80%',
                pulse: `${z3L} – ${z3H} BPM`,
                rpe: 'RPE 5 – 6 (Moderate Exertion)',
                talk: 'Can speak short phrases; breathing is rhythmic',
                workout: 'Marathon pace tempo runs, sustained cycling intervals'
            },
            {
                name: 'Zone 4: Anaerobic / Lactate Threshold',
                intensity: '80% – 90%',
                pulse: `${z4L} – ${z4H} BPM`,
                rpe: 'RPE 7 – 8 (Vigorous & Heavy)',
                talk: 'Broken 1–3 word phrases only; heavy breathing',
                workout: 'Threshold repeats, 5K/10K race pace, HIIT intervals'
            },
            {
                name: 'Zone 5: Neuromuscular / VO₂ Max',
                intensity: '90% – 100%',
                pulse: `${z5L} – ${z5H} BPM`,
                rpe: 'RPE 9 – 10 (Maximum Effort)',
                talk: 'Cannot speak; gasping for breath',
                workout: 'Sprint intervals (100m–400m), tabata, peak power bursts'
            }
        ];

        tableTbody.innerHTML = '';
        zones.forEach(z => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${z.name}</strong></td>
                <td>${z.intensity}</td>
                <td style="font-weight: 700; font-family: monospace; color: var(--color-accent-blue);">${z.pulse}</td>
                <td>${z.rpe}</td>
                <td>${z.talk}</td>
                <td>${z.workout}</td>
            `;
            tableTbody.appendChild(tr);
        });
    }

    // Initial Execution
    calculateZones();
});
