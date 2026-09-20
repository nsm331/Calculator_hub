/**
 * Speed, Distance & Time Calculator - Pure Vanilla JavaScript Engine
 * Kinematic 3-variable solver (v = d/t, d = v*t, t = d/v),
 * comprehensive dimensional unit conversions, and running pace metrics.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Mode Tabs
    const tabBtns = document.querySelectorAll('.sdt-tab-btn');
    const presetBtns = document.querySelectorAll('.sdt-preset-btn');

    // Form Groups & Inputs
    const speedGroup = document.getElementById('group-speed');
    const distGroup = document.getElementById('group-distance');
    const timeGroup = document.getElementById('group-time');

    const speedInput = document.getElementById('sdt-speed');
    const speedUnitSelect = document.getElementById('sdt-speed-unit');

    const distInput = document.getElementById('sdt-distance');
    const distUnitSelect = document.getElementById('sdt-dist-unit');

    const hoursInput = document.getElementById('sdt-hours');
    const minsInput = document.getElementById('sdt-mins');
    const secsInput = document.getElementById('sdt-secs');

    const calcBtn = document.getElementById('sdt-calc-btn');
    const resetBtn = document.getElementById('sdt-reset-btn');

    // Hero Elements
    const heroLabel = document.getElementById('hero-sdt-label');
    const primaryValEl = document.getElementById('res-primary-val');
    const sdtSubEl = document.getElementById('res-sdt-sub');

    // Metrics Cards
    const kmhEl = document.getElementById('res-speed-kmh');
    const msEl = document.getElementById('res-speed-ms');
    const knotsEl = document.getElementById('res-speed-knots');
    const paceEl = document.getElementById('res-speed-pace');

    // Table Body
    const tableBody = document.getElementById('sdt-table-body');

    let currentMode = 'speed'; // 'speed', 'distance', or 'time'

    // Dimensional Conversion Factors relative to SI Base Units (meters and seconds)
    const DISTANCE_TO_METERS = {
        meters: 1.0,
        km: 1000.0,
        miles: 1609.344,
        feet: 0.3048,
        yards: 0.9144,
        nmi: 1852.0
    };

    const SPEED_TO_MS = {
        ms: 1.0,
        kmh: 1.0 / 3.6,
        mph: 1609.344 / 3600.0, // ~0.44704
        knots: 1852.0 / 3600.0, // ~0.514444
        fts: 0.3048
    };

    // Helper: Convert total seconds into hh:mm:ss format string
    function formatTimeCompound(totalSeconds) {
        if (isNaN(totalSeconds) || totalSeconds <= 0) return '0s';
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = Math.round(totalSeconds % 60);

        const parts = [];
        if (hrs > 0) parts.push(`${hrs}h`);
        if (mins > 0 || hrs > 0) parts.push(`${mins}m`);
        parts.push(`${secs}s`);
        return parts.join(' ');
    }

    function calculateKinematics() {
        // Read Elapsed Time in Seconds
        const h = Math.max(0, parseFloat(hoursInput.value) || 0);
        const m = Math.max(0, parseFloat(minsInput.value) || 0);
        const s = Math.max(0, parseFloat(secsInput.value) || 0);
        let timeInSeconds = (h * 3600) + (m * 60) + s;

        // Read Distance in Meters
        const rawDist = Math.max(0, parseFloat(distInput.value) || 0);
        const distUnit = distUnitSelect.value;
        let distInMeters = rawDist * (DISTANCE_TO_METERS[distUnit] || 1.0);

        // Read Speed in m/s
        const rawSpeed = Math.max(0, parseFloat(speedInput.value) || 0);
        const speedUnit = speedUnitSelect.value;
        let speedInMs = rawSpeed * (SPEED_TO_MS[speedUnit] || 1.0);

        // 1. Solve for Target Variable
        if (currentMode === 'speed') {
            if (timeInSeconds > 0) {
                speedInMs = distInMeters / timeInSeconds;
            } else {
                speedInMs = 0;
            }
            // Update Speed Input Field in active unit
            const convertedSpeed = speedInMs / (SPEED_TO_MS[speedUnit] || 1.0);
            speedInput.value = convertedSpeed.toFixed(2);

        } else if (currentMode === 'distance') {
            distInMeters = speedInMs * timeInSeconds;
            const convertedDist = distInMeters / (DISTANCE_TO_METERS[distUnit] || 1.0);
            distInput.value = convertedDist.toFixed(2);

        } else if (currentMode === 'time') {
            if (speedInMs > 0) {
                timeInSeconds = distInMeters / speedInMs;
            } else {
                timeInSeconds = 0;
            }
            // Update Time Input Fields
            const hrs = Math.floor(timeInSeconds / 3600);
            const remainderSecs = timeInSeconds % 3600;
            const mins = Math.floor(remainderSecs / 60);
            const secs = Math.round(remainderSecs % 60);

            hoursInput.value = hrs;
            minsInput.value = mins;
            secsInput.value = secs;
        }

        // 2. Compute Velocity Equivalents across all metrics
        const speedMph = speedInMs / SPEED_TO_MS.mph;
        const speedKmh = speedInMs / SPEED_TO_MS.kmh;
        const speedKnots = speedInMs / SPEED_TO_MS.knots;
        const speedFts = speedInMs / SPEED_TO_MS.fts;

        // Running Pace: seconds per mile / seconds per km
        let paceMileStr = '—';
        let paceKmStr = '—';
        if (speedInMs > 0) {
            const secPerMile = 1609.344 / speedInMs;
            const secPerKm = 1000.0 / speedInMs;
            paceMileStr = formatTimeCompound(secPerMile) + ' / mi';
            paceKmStr = formatTimeCompound(secPerKm) + ' / km';
        }

        // 3. Compute Distance Equivalents
        const distMiles = distInMeters / DISTANCE_TO_METERS.miles;
        const distKm = distInMeters / DISTANCE_TO_METERS.km;
        const distFeet = distInMeters / DISTANCE_TO_METERS.feet;
        const distNmi = distInMeters / DISTANCE_TO_METERS.nmi;

        // 4. Update Hero Banner according to Active Mode
        if (currentMode === 'speed') {
            heroLabel.textContent = "Calculated Speed (v)";
            primaryValEl.textContent = `${(speedInMs / SPEED_TO_MS[speedUnit]).toFixed(2)} ${speedUnit}`;
            sdtSubEl.textContent = `Distance: ${distMiles.toFixed(2)} miles (${distKm.toFixed(2)} km) • Elapsed Time: ${formatTimeCompound(timeInSeconds)}`;
        } else if (currentMode === 'distance') {
            heroLabel.textContent = "Calculated Distance (d)";
            primaryValEl.textContent = `${(distInMeters / DISTANCE_TO_METERS[distUnit]).toFixed(2)} ${distUnit}`;
            sdtSubEl.textContent = `Speed: ${speedMph.toFixed(2)} mph (${speedKmh.toFixed(2)} km/h) • Elapsed Time: ${formatTimeCompound(timeInSeconds)}`;
        } else if (currentMode === 'time') {
            heroLabel.textContent = "Calculated Elapsed Time (t)";
            primaryValEl.textContent = formatTimeCompound(timeInSeconds);
            sdtSubEl.textContent = `Distance: ${distMiles.toFixed(2)} miles (${distKm.toFixed(2)} km) • Speed: ${speedMph.toFixed(2)} mph`;
        }

        // 5. Update Metrics Grid
        kmhEl.textContent = `${speedKmh.toFixed(2)} km/h`;
        msEl.textContent = `${speedInMs.toFixed(2)} m/s`;
        knotsEl.textContent = `${speedKnots.toFixed(2)} kn`;
        paceEl.textContent = paceMileStr;

        // 6. Build Comprehensive Kinematic Dimensional Breakdown Table
        tableBody.innerHTML = `
            <tr style="border-bottom: 1px solid var(--color-border-light);">
                <td style="padding: 10px 12px; font-weight: 700;">Speed (v)</td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 700; color: #38bdf8;">${speedMph.toFixed(2)} mph</td>
                <td class="td-right" style="padding: 10px 12px; color: #10b981;">${speedKmh.toFixed(2)} km/h &bull; ${speedInMs.toFixed(2)} m/s</td>
                <td class="td-right" style="padding: 10px 12px; color: #a855f7;">${speedKnots.toFixed(2)} knots &bull; ${speedFts.toFixed(2)} ft/s</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--color-border-light);">
                <td style="padding: 10px 12px; font-weight: 700;">Distance (d)</td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 700; color: #38bdf8;">${distMiles.toFixed(2)} miles</td>
                <td class="td-right" style="padding: 10px 12px; color: #10b981;">${distKm.toFixed(2)} km &bull; ${distInMeters.toFixed(0)} meters</td>
                <td class="td-right" style="padding: 10px 12px; color: #a855f7;">${distFeet.toLocaleString('en-US', {maximumFractionDigits: 0})} feet &bull; ${distNmi.toFixed(2)} nmi</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--color-border-light);">
                <td style="padding: 10px 12px; font-weight: 700;">Elapsed Time (t)</td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 700; color: #38bdf8;">${formatTimeCompound(timeInSeconds)}</td>
                <td class="td-right" style="padding: 10px 12px; color: #10b981;">${(timeInSeconds / 3600).toFixed(4)} hours</td>
                <td class="td-right" style="padding: 10px 12px; color: #a855f7;">${(timeInSeconds / 60).toFixed(2)} mins &bull; ${timeInSeconds.toFixed(0)} secs</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--color-border-light);">
                <td style="padding: 10px 12px; font-weight: 700;">Travel Pace</td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 700; color: #38bdf8;">${paceMileStr}</td>
                <td class="td-right" style="padding: 10px 12px; color: #10b981;">${paceKmStr}</td>
                <td class="td-right" style="padding: 10px 12px; color: #fbbf24;">${(speedInMs > 0 ? (60 / speedMph).toFixed(2) : '0')} min/mile equivalent</td>
            </tr>
        `;
    }

    // Mode Switcher Tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            currentMode = this.getAttribute('data-mode');

            // Visual Cue: Highlight target field & make it read-only
            if (currentMode === 'speed') {
                speedInput.setAttribute('readonly', 'true');
                speedInput.style.opacity = '0.7';
                distInput.removeAttribute('readonly');
                distInput.style.opacity = '1';
                hoursInput.removeAttribute('readonly');
                minsInput.removeAttribute('readonly');
                secsInput.removeAttribute('readonly');
            } else if (currentMode === 'distance') {
                distInput.setAttribute('readonly', 'true');
                distInput.style.opacity = '0.7';
                speedInput.removeAttribute('readonly');
                speedInput.style.opacity = '1';
                hoursInput.removeAttribute('readonly');
                minsInput.removeAttribute('readonly');
                secsInput.removeAttribute('readonly');
            } else if (currentMode === 'time') {
                hoursInput.setAttribute('readonly', 'true');
                minsInput.setAttribute('readonly', 'true');
                secsInput.setAttribute('readonly', 'true');
                distInput.removeAttribute('readonly');
                distInput.style.opacity = '1';
                speedInput.removeAttribute('readonly');
                speedInput.style.opacity = '1';
            }

            calculateKinematics();
        });
    });

    // Preset Velocity Buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            presetBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            speedInput.value = this.getAttribute('data-speed');
            speedUnitSelect.value = 'mph';

            distInput.value = this.getAttribute('data-dist');
            distUnitSelect.value = 'miles';

            hoursInput.value = this.getAttribute('data-hours') || '0';
            minsInput.value = this.getAttribute('data-mins') || '0';
            secsInput.value = this.getAttribute('data-secs') || '0';

            calculateKinematics();
        });
    });

    // Event Listeners for Live Recalculation
    [speedInput, speedUnitSelect, distInput, distUnitSelect, hoursInput, minsInput, secsInput].forEach(elem => {
        elem.addEventListener('input', calculateKinematics);
        elem.addEventListener('change', calculateKinematics);
    });

    calcBtn.addEventListener('click', calculateKinematics);

    // Reset Defaults
    resetBtn.addEventListener('click', function () {
        currentMode = 'speed';
        tabBtns.forEach(b => {
            if (b.getAttribute('data-mode') === 'speed') b.classList.add('active');
            else b.classList.remove('active');
        });

        speedInput.setAttribute('readonly', 'true');
        distInput.removeAttribute('readonly');
        hoursInput.removeAttribute('readonly');
        minsInput.removeAttribute('readonly');
        secsInput.removeAttribute('readonly');

        speedInput.value = '65';
        speedUnitSelect.value = 'mph';
        distInput.value = '130';
        distUnitSelect.value = 'miles';
        hoursInput.value = '2';
        minsInput.value = '0';
        secsInput.value = '0';

        presetBtns.forEach(b => {
            if (b.getAttribute('data-speed') === '65') b.classList.add('active');
            else b.classList.remove('active');
        });

        calculateKinematics();
    });

    // Initialize Mode Visuals & Run First Calculation
    speedInput.setAttribute('readonly', 'true');
    speedInput.style.opacity = '0.7';
    calculateKinematics();
});
