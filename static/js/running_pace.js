/**
 * Running Pace Calculator Engine
 * 100% Vanilla JS - Client-Side Aerobic Kinematics & Race Projections
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mode Tracking: 'pace' | 'time' | 'distance'
    let currentMode = 'pace';
    let splitUnit = 'km'; // 'km' | 'mi'

    // DOM Elements
    const tabModePace = document.getElementById('tab-mode-pace');
    const tabModeTime = document.getElementById('tab-mode-time');
    const tabModeDistance = document.getElementById('tab-mode-distance');

    const sectionDistance = document.getElementById('section-distance');
    const sectionTime = document.getElementById('section-time');
    const sectionPace = document.getElementById('section-pace');

    const distInput = document.getElementById('race-distance');
    const distUnitSelect = document.getElementById('race-distance-unit');

    const hoursInput = document.getElementById('time-hours');
    const minutesInput = document.getElementById('time-minutes');
    const secondsInput = document.getElementById('time-seconds');

    const paceMinInput = document.getElementById('pace-minutes');
    const paceSecInput = document.getElementById('pace-seconds');
    const paceUnitSelect = document.getElementById('pace-unit');

    const form = document.getElementById('running-pace-form');
    const resetBtn = document.getElementById('btn-reset-pace');
    const presetPills = document.querySelectorAll('.preset-pill-btn');

    // Split toggles
    const splitToggleKm = document.getElementById('split-toggle-km');
    const splitToggleMi = document.getElementById('split-toggle-mi');
    const splitsTbody = document.getElementById('splits-table-body');
    const riegelTbody = document.getElementById('riegel-table-body');

    // Hero and Card elements
    const heroLabel = document.getElementById('pace-hero-label');
    const heroValue = document.getElementById('pace-hero-value');
    const heroSubvalue = document.getElementById('pace-hero-subvalue');

    const cardPaceMile = document.getElementById('card-pace-mile');
    const cardSpeedMph = document.getElementById('card-speed-mph');
    const cardPaceKm = document.getElementById('card-pace-km');
    const cardSpeedKmh = document.getElementById('card-speed-kmh');
    const cardTotalTime = document.getElementById('card-total-time');
    const cardDecimalMinutes = document.getElementById('card-decimal-minutes');
    const cardTotalDist = document.getElementById('card-total-dist');
    const cardDistSecondary = document.getElementById('card-dist-secondary');

    const KM_PER_MILE = 1.609344;
    const METERS_PER_KM = 1000;
    const YARDS_PER_KM = 1093.61;

    // Mode Switching
    function setMode(mode) {
        currentMode = mode;
        [tabModePace, tabModeTime, tabModeDistance].forEach(tab => tab.classList.remove('active'));

        if (mode === 'pace') {
            tabModePace.classList.add('active');
            sectionDistance.style.display = 'block';
            sectionTime.style.display = 'block';
            sectionPace.style.display = 'none';
            heroLabel.textContent = 'Calculated Running Pace';
        } else if (mode === 'time') {
            tabModeTime.classList.add('active');
            sectionDistance.style.display = 'block';
            sectionTime.style.display = 'none';
            sectionPace.style.display = 'block';
            heroLabel.textContent = 'Calculated Finish Time';
        } else if (mode === 'distance') {
            tabModeDistance.classList.add('active');
            sectionDistance.style.display = 'none';
            sectionTime.style.display = 'block';
            sectionPace.style.display = 'block';
            heroLabel.textContent = 'Calculated Total Distance';
        }
        calculateAll();
    }

    tabModePace.addEventListener('click', () => setMode('pace'));
    tabModeTime.addEventListener('click', () => setMode('time'));
    tabModeDistance.addEventListener('click', () => setMode('distance'));

    // Distance Presets
    presetPills.forEach(pill => {
        pill.addEventListener('click', () => {
            presetPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const dist = parseFloat(pill.getAttribute('data-dist'));
            const unit = pill.getAttribute('data-unit');

            distInput.value = dist;
            distUnitSelect.value = unit;
            calculateAll();
        });
    });

    distInput.addEventListener('input', () => {
        presetPills.forEach(p => p.classList.remove('active'));
        calculateAll();
    });
    distUnitSelect.addEventListener('change', calculateAll);

    // Split unit toggling
    splitToggleKm.addEventListener('click', () => {
        splitUnit = 'km';
        splitToggleKm.classList.add('active');
        splitToggleMi.classList.remove('active');
        calculateAll();
    });

    splitToggleMi.addEventListener('click', () => {
        splitUnit = 'mi';
        splitToggleMi.classList.add('active');
        splitToggleKm.classList.remove('active');
        calculateAll();
    });

    // Inputs listener
    [hoursInput, minutesInput, secondsInput, paceMinInput, paceSecInput, paceUnitSelect].forEach(elem => {
        elem.addEventListener('input', calculateAll);
        elem.addEventListener('change', calculateAll);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateAll();
    });

    resetBtn.addEventListener('click', () => {
        distInput.value = '10';
        distUnitSelect.value = 'km';
        hoursInput.value = '0';
        minutesInput.value = '48';
        secondsInput.value = '30';
        paceMinInput.value = '4';
        paceSecInput.value = '51';
        paceUnitSelect.value = 'km';
        presetPills.forEach(p => p.classList.remove('active'));
        document.querySelector('[data-dist="10"][data-unit="km"]').classList.add('active');
        setMode('pace');
    });

    // Formatting utilities
    function formatTime(totalSeconds) {
        if (!isFinite(totalSeconds) || totalSeconds < 0) return '0h 00m 00s';
        const hrs = Math.floor(totalSeconds / 3600);
        const rem = totalSeconds % 3600;
        const mins = Math.floor(rem / 60);
        const secs = Math.round(rem % 60);

        const sStr = secs < 10 ? '0' + secs : secs;
        const mStr = (hrs > 0 && mins < 10) ? '0' + mins : mins;

        if (hrs > 0) {
            return `${hrs}h ${mStr}m ${sStr}s`;
        }
        return `${mins}m ${sStr}s`;
    }

    function formatPace(paceSecPerUnit) {
        if (!isFinite(paceSecPerUnit) || paceSecPerUnit <= 0) return '--:--';
        const mins = Math.floor(paceSecPerUnit / 60);
        const secs = Math.round(paceSecPerUnit % 60);
        const sStr = secs < 10 ? '0' + secs : secs;
        return `${mins}:${sStr}`;
    }

    function parseTimeSeconds() {
        const h = parseFloat(hoursInput.value) || 0;
        const m = parseFloat(minutesInput.value) || 0;
        const s = parseFloat(secondsInput.value) || 0;
        return (h * 3600) + (m * 60) + s;
    }

    function parsePaceSeconds() {
        const m = parseFloat(paceMinInput.value) || 0;
        const s = parseFloat(paceSecInput.value) || 0;
        return (m * 60) + s;
    }

    function getDistanceInKm() {
        const d = parseFloat(distInput.value) || 0;
        const unit = distUnitSelect.value;
        if (unit === 'km') return d;
        if (unit === 'mi') return d * KM_PER_MILE;
        if (unit === 'm') return d / METERS_PER_KM;
        if (unit === 'yd') return d / YARDS_PER_KM;
        return d;
    }

    // Main Calculation
    function calculateAll() {
        let totalSeconds = 0;
        let distKm = 0;
        let distMiles = 0;
        let paceSecKm = 0;
        let paceSecMile = 0;

        if (currentMode === 'pace') {
            distKm = getDistanceInKm();
            distMiles = distKm / KM_PER_MILE;
            totalSeconds = parseTimeSeconds();

            if (distKm <= 0 || totalSeconds <= 0) {
                displayInvalidState();
                return;
            }

            paceSecKm = totalSeconds / distKm;
            paceSecMile = totalSeconds / distMiles;

            // Update pace inputs in background
            const pKmMin = Math.floor(paceSecKm / 60);
            const pKmSec = Math.round(paceSecKm % 60);
            paceMinInput.value = pKmMin;
            paceSecInput.value = pKmSec;
            paceUnitSelect.value = 'km';

            heroValue.innerHTML = `${formatPace(paceSecKm)} <span style="font-size: 1.25rem; font-weight: 500; color: var(--color-text-muted);">/ km</span>`;
            const speedKmh = (distKm / (totalSeconds / 3600)).toFixed(2);
            const speedMph = (distMiles / (totalSeconds / 3600)).toFixed(2);
            heroSubvalue.textContent = `Equivalent to ${formatPace(paceSecMile)} / mi • Speed: ${speedKmh} km/h (${speedMph} mph)`;

        } else if (currentMode === 'time') {
            distKm = getDistanceInKm();
            distMiles = distKm / KM_PER_MILE;
            const inputPaceSec = parsePaceSeconds();
            const paceUnit = paceUnitSelect.value;

            if (distKm <= 0 || inputPaceSec <= 0) {
                displayInvalidState();
                return;
            }

            if (paceUnit === 'km') {
                paceSecKm = inputPaceSec;
                paceSecMile = inputPaceSec * KM_PER_MILE;
                totalSeconds = distKm * paceSecKm;
            } else {
                paceSecMile = inputPaceSec;
                paceSecKm = inputPaceSec / KM_PER_MILE;
                totalSeconds = distMiles * paceSecMile;
            }

            // Sync time inputs
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = Math.round(totalSeconds % 60);
            hoursInput.value = h;
            minutesInput.value = m;
            secondsInput.value = s;

            heroValue.innerHTML = `${formatTime(totalSeconds)}`;
            const speedKmh = (distKm / (totalSeconds / 3600)).toFixed(2);
            const speedMph = (distMiles / (totalSeconds / 3600)).toFixed(2);
            heroSubvalue.textContent = `Pace: ${formatPace(paceSecKm)} / km (${formatPace(paceSecMile)} / mi) • Speed: ${speedKmh} km/h (${speedMph} mph)`;

        } else if (currentMode === 'distance') {
            totalSeconds = parseTimeSeconds();
            const inputPaceSec = parsePaceSeconds();
            const paceUnit = paceUnitSelect.value;

            if (totalSeconds <= 0 || inputPaceSec <= 0) {
                displayInvalidState();
                return;
            }

            if (paceUnit === 'km') {
                paceSecKm = inputPaceSec;
                paceSecMile = inputPaceSec * KM_PER_MILE;
                distKm = totalSeconds / paceSecKm;
                distMiles = distKm / KM_PER_MILE;
            } else {
                paceSecMile = inputPaceSec;
                paceSecKm = inputPaceSec / KM_PER_MILE;
                distMiles = totalSeconds / paceSecMile;
                distKm = distMiles * KM_PER_MILE;
            }

            // Sync distance inputs
            distInput.value = distKm.toFixed(2);
            distUnitSelect.value = 'km';

            heroValue.innerHTML = `${distKm.toFixed(2)} <span style="font-size: 1.25rem; font-weight: 500; color: var(--color-text-muted);">km</span>`;
            const speedKmh = (distKm / (totalSeconds / 3600)).toFixed(2);
            const speedMph = (distMiles / (totalSeconds / 3600)).toFixed(2);
            heroSubvalue.textContent = `Equivalent to ${distMiles.toFixed(2)} miles • Pace: ${formatPace(paceSecKm)} / km • Speed: ${speedKmh} km/h (${speedMph} mph)`;
        }

        // Speed Metrics
        const hoursTotal = totalSeconds / 3600;
        const speedMphVal = hoursTotal > 0 ? (distMiles / hoursTotal).toFixed(2) : '0.00';
        const speedKmhVal = hoursTotal > 0 ? (distKm / hoursTotal).toFixed(2) : '0.00';

        // Update Breakdown Cards
        cardPaceMile.textContent = `${formatPace(paceSecMile)} / mi`;
        cardSpeedMph.textContent = `${speedMphVal} mph`;

        cardPaceKm.textContent = `${formatPace(paceSecKm)} / km`;
        cardSpeedKmh.textContent = `${speedKmhVal} km/h`;

        cardTotalTime.textContent = formatTime(totalSeconds);
        cardDecimalMinutes.textContent = `${(totalSeconds / 60).toFixed(2)} decimal minutes`;

        cardTotalDist.textContent = `${distKm.toFixed(2)} km`;
        cardDistSecondary.textContent = `${distMiles.toFixed(2)} miles`;

        // Render Cumulative Splits
        renderSplits(distKm, distMiles, paceSecKm, paceSecMile);

        // Render Pete Riegel Race Projections
        renderRiegelProjections(distKm, totalSeconds);
    }

    function displayInvalidState() {
        heroValue.textContent = '--:--';
        heroSubvalue.textContent = 'Please provide valid positive distance, pace, or duration values.';
        cardPaceMile.textContent = '--:--';
        cardPaceKm.textContent = '--:--';
        splitsTbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--color-text-muted);">Enter race values to view splits</td></tr>';
        riegelTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--color-text-muted);">Enter race values to view race predictions</td></tr>';
    }

    function renderSplits(distKm, distMiles, paceSecKm, paceSecMile) {
        splitsTbody.innerHTML = '';
        const isKm = splitUnit === 'km';
        const maxDist = isKm ? distKm : distMiles;
        const paceSec = isKm ? paceSecKm : paceSecMile;
        const unitLabel = isKm ? 'km' : 'mi';

        if (maxDist <= 0 || !isFinite(maxDist)) return;

        const count = Math.ceil(maxDist);
        // Limit to 60 splits to prevent DOM slowdown on ultramarathons
        const effectiveCount = Math.min(count, 60);

        for (let i = 1; i <= effectiveCount; i++) {
            const tr = document.createElement('tr');
            const isLast = (i === effectiveCount) && (maxDist < i);
            const currentDist = isLast ? maxDist : i;
            const splitDuration = isLast ? (maxDist - (i - 1)) * paceSec : paceSec;
            const cumulativeSec = currentDist * paceSec;

            tr.innerHTML = `
                <td><strong>Split ${i}</strong></td>
                <td>${currentDist.toFixed(2)} ${unitLabel}</td>
                <td>${formatPace(paceSec)} / ${unitLabel}</td>
                <td style="font-weight: 600; color: var(--color-accent-blue);">${formatTime(cumulativeSec)}</td>
            `;
            splitsTbody.appendChild(tr);
        }

        if (count > 60) {
            const noticeRow = document.createElement('tr');
            noticeRow.innerHTML = `<td colspan="4" style="text-align: center; font-size: 0.85rem; color: var(--color-text-muted);">Showing first 60 splits of ${count} total. Final finish: ${formatTime(maxDist * paceSec)}</td>`;
            splitsTbody.appendChild(noticeRow);
        }
    }

    function renderRiegelProjections(t1DistKm, t1Seconds) {
        riegelTbody.innerHTML = '';
        if (t1DistKm <= 0 || t1Seconds <= 0) return;

        const events = [
            { name: '1 Mile', km: 1.609344 },
            { name: '5K', km: 5.0 },
            { name: '10K', km: 10.0 },
            { name: '15K', km: 15.0 },
            { name: '10 Miles', km: 16.09344 },
            { name: 'Half Marathon', km: 21.0975 },
            { name: 'Marathon', km: 42.195 }
        ];

        events.forEach(evt => {
            // Pete Riegel: T2 = T1 * (d2 / d1)^1.06
            const ratio = evt.km / t1DistKm;
            const t2Sec = t1Seconds * Math.pow(ratio, 1.06);
            const evtMiles = evt.km / KM_PER_MILE;
            const avgPaceSecKm = t2Sec / evt.km;
            const speedKmh = (evt.km / (t2Sec / 3600)).toFixed(2);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${evt.name}</strong></td>
                <td>${evt.km.toFixed(2)} km (${evtMiles.toFixed(2)} mi)</td>
                <td style="font-weight: 700; color: var(--color-accent-blue);">${formatTime(t2Sec)}</td>
                <td>${formatPace(avgPaceSecKm)} / km</td>
                <td>${speedKmh} km/h</td>
            `;
            riegelTbody.appendChild(tr);
        });
    }

    // Initial Calculation
    setMode('pace');
});
