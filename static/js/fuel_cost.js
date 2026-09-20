/**
 * Fuel Cost & Mileage Trip Planner Engine
 * CalculatorHub - Client-Side Vanilla JS
 */

document.addEventListener('DOMContentLoaded', function () {
    // State
    let currentUnit = 'us'; // 'us' or 'metric'

    // Form inputs
    const distInput = document.getElementById('fuel-distance');
    const distLabel = document.getElementById('fuel-dist-label');
    const distSuffix = document.getElementById('fuel-dist-suffix');

    const econInput = document.getElementById('fuel-economy');
    const econLabel = document.getElementById('fuel-econ-label');
    const econSuffix = document.getElementById('fuel-econ-suffix');
    const econHint = document.getElementById('fuel-econ-hint');

    const priceInput = document.getElementById('fuel-price');
    const priceLabel = document.getElementById('fuel-price-label');
    const priceSuffix = document.getElementById('fuel-price-suffix');

    const tripRadios = document.querySelectorAll('input[name="fuel_trip_type"]');
    const ridersInput = document.getElementById('fuel-riders');
    const tollsInput = document.getElementById('fuel-tolls');
    const parkingInput = document.getElementById('fuel-parking');

    // Controls
    const unitButtons = document.querySelectorAll('.fuel-unit-btn');
    const presetButtons = document.querySelectorAll('.fuel-preset-btn');
    const calculateBtn = document.getElementById('fuel-calculate-btn');
    const resetBtn = document.getElementById('fuel-reset-btn');

    // Outputs
    const resTotalCost = document.getElementById('res-fuel-total-cost');
    const resTotalSub = document.getElementById('res-fuel-total-sub');
    const resPerRider = document.getElementById('res-fuel-per-rider');
    const resRiderLabel = document.getElementById('res-fuel-rider-label');
    const resVolume = document.getElementById('res-fuel-volume');
    const resDistTotal = document.getElementById('res-fuel-dist-total');
    const resCostPermile = document.getElementById('res-fuel-cost-permile');
    const resBarSummary = document.getElementById('res-fuel-bar-summary');

    // Bar segments
    const barFuel = document.getElementById('bar-fuel-segment');
    const barTolls = document.getElementById('bar-tolls-segment');
    const barParking = document.getElementById('bar-parking-segment');

    // Table
    const speedTableBody = document.getElementById('fuel-speed-table-body');
    const thSensEcon = document.getElementById('th-sens-econ');

    // Currency Formatter
    const curFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

    // Unit toggle
    unitButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            unitButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const newUnit = this.dataset.unit;

            if (newUnit !== currentUnit) {
                currentUnit = newUnit;
                if (currentUnit === 'metric') {
                    // Miles to KM
                    const curMiles = parseFloat(distInput.value) || 25;
                    distInput.value = Math.round(curMiles * 1.60934);
                    distLabel.textContent = 'Trip Distance (One-Way)';
                    distSuffix.textContent = 'km';

                    // MPG to L/100km
                    const curMpg = parseFloat(econInput.value) || 30;
                    econInput.value = (235.215 / curMpg).toFixed(1);
                    econLabel.textContent = 'Fuel Consumption (L/100km)';
                    econSuffix.textContent = 'L/100km';
                    econHint.textContent = 'Volume consumed per 100 kilometers';
                    thSensEcon.textContent = 'Realized Economy (L/100km)';

                    // $/gal to $/L
                    const curPpg = parseFloat(priceInput.value) || 3.45;
                    priceInput.value = (curPpg / 3.78541).toFixed(2);
                    priceLabel.textContent = 'Fuel Price ($ / Liter)';
                    priceSuffix.textContent = '/ L';
                } else {
                    // KM to Miles
                    const curKm = parseFloat(distInput.value) || 40;
                    distInput.value = Math.round(curKm / 1.60934);
                    distLabel.textContent = 'Trip Distance (One-Way)';
                    distSuffix.textContent = 'Miles';

                    // L/100km to MPG
                    const curL100 = parseFloat(econInput.value) || 7.8;
                    econInput.value = (235.215 / curL100).toFixed(1);
                    econLabel.textContent = 'Fuel Efficiency (MPG)';
                    econSuffix.textContent = 'MPG';
                    econHint.textContent = 'Miles traveled per gallon of fuel';
                    thSensEcon.textContent = 'Realized Economy (MPG)';

                    // $/L to $/gal
                    const curPpl = parseFloat(priceInput.value) || 0.91;
                    priceInput.value = (curPpl * 3.78541).toFixed(2);
                    priceLabel.textContent = 'Fuel Price ($ / Gallon)';
                    priceSuffix.textContent = '/ gal';
                }
                calculateTrip();
            }
        });
    });

    // Presets
    presetButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            presetButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const distMiles = parseFloat(this.dataset.dist);
            const mpg = parseFloat(this.dataset.mpg);
            const price = parseFloat(this.dataset.price);
            const isRound = this.dataset.round === 'true';
            const riders = parseInt(this.dataset.riders, 10);
            const tolls = parseFloat(this.dataset.tolls);
            const parking = parseFloat(this.dataset.parking);

            if (currentUnit === 'us') {
                distInput.value = distMiles;
                econInput.value = mpg;
                priceInput.value = price.toFixed(2);
            } else {
                distInput.value = Math.round(distMiles * 1.60934);
                econInput.value = (235.215 / mpg).toFixed(1);
                priceInput.value = (price / 3.78541).toFixed(2);
            }

            tripRadios.forEach(r => {
                r.checked = isRound ? (r.value === 'round') : (r.value === 'oneway');
            });

            ridersInput.value = riders;
            tollsInput.value = tolls;
            parkingInput.value = parking;

            calculateTrip();
        });
    });

    function isRoundTrip() {
        for (const r of tripRadios) {
            if (r.checked) return r.value === 'round';
        }
        return true;
    }

    function calculateTrip() {
        const rawDist = parseFloat(distInput.value) || 0;
        const rawEcon = parseFloat(econInput.value) || 1;
        const rawPrice = parseFloat(priceInput.value) || 0;
        const isRound = isRoundTrip();
        const riders = Math.max(1, parseInt(ridersInput.value, 10) || 1);
        const tolls = parseFloat(tollsInput.value) || 0;
        const parking = parseFloat(parkingInput.value) || 0;

        if (rawDist <= 0 || rawEcon <= 0 || rawPrice <= 0) return;

        const mult = isRound ? 2 : 1;
        const totalDist = rawDist * mult;

        let fuelVolume = 0;
        let distUnitName = (currentUnit === 'us') ? 'Miles' : 'km';
        let volUnitName = (currentUnit === 'us') ? 'Gallons' : 'Liters';

        if (currentUnit === 'us') {
            // Volume in gallons = miles / MPG
            fuelVolume = totalDist / rawEcon;
        } else {
            // Volume in liters = (km * L/100km) / 100
            fuelVolume = (totalDist * rawEcon) / 100;
        }

        const fuelCost = fuelVolume * rawPrice;
        const totalTripCost = fuelCost + tolls + parking;
        const costPerRider = totalTripCost / riders;
        const costPerDist = totalDist > 0 ? (totalTripCost / totalDist) : 0;

        // Populate KPIs
        resTotalCost.textContent = curFmt.format(totalTripCost);
        resTotalSub.textContent = `Fuel: ${curFmt.format(fuelCost)} • Tolls/Fees: ${curFmt.format(tolls + parking)}`;

        resPerRider.textContent = curFmt.format(costPerRider);
        resRiderLabel.textContent = (riders === 1)
            ? 'Solo driver (1 person)'
            : `Split across ${riders} passengers`;

        resVolume.textContent = `${fuelVolume.toFixed(2)} ${volUnitName}`;
        resDistTotal.textContent = `Total Travel: ${totalDist.toLocaleString()} ${distUnitName} (${isRound ? 'Round Trip' : 'One-Way'})`;

        resCostPermile.textContent = `${curFmt.format(costPerDist)} / ${currentUnit === 'us' ? 'mi' : 'km'}`;
        resBarSummary.textContent = `Total Travel Budget: ${curFmt.format(totalTripCost)}`;

        // Update Proportional Stacked Bar
        const pctFuel = totalTripCost > 0 ? (fuelCost / totalTripCost) * 100 : 100;
        const pctTolls = totalTripCost > 0 ? (tolls / totalTripCost) * 100 : 0;
        const pctParking = totalTripCost > 0 ? (parking / totalTripCost) * 100 : 0;

        barFuel.style.width = `${pctFuel.toFixed(1)}%`;
        barFuel.textContent = pctFuel > 15 ? `Fuel (${pctFuel.toFixed(0)}%)` : '';

        if (pctTolls > 0) {
            barTolls.style.display = 'flex';
            barTolls.style.width = `${pctTolls.toFixed(1)}%`;
            barTolls.textContent = pctTolls > 12 ? `Tolls (${pctTolls.toFixed(0)}%)` : '';
        } else {
            barTolls.style.display = 'none';
        }

        if (pctParking > 0) {
            barParking.style.display = 'flex';
            barParking.style.width = `${pctParking.toFixed(1)}%`;
            barParking.textContent = pctParking > 12 ? `Park (${pctParking.toFixed(0)}%)` : '';
        } else {
            barParking.style.display = 'none';
        }

        // Cruising Speed & Aerodynamic Drag Sensitivity Table
        // Aerodynamic drag increases quadratically with velocity (v^2).
        // Standard highway sensitivity:
        // Tier 1: 50 mph / 80 km/h -> +10% economy (higher efficiency)
        // Tier 2: 60 mph / 96 km/h -> Baseline (0% variance)
        // Tier 3: 70 mph / 112 km/h -> -12% economy (approx 14% more fuel)
        // Tier 4: 80 mph / 128 km/h -> -25% economy (approx 33% more fuel)
        const speedProfiles = (currentUnit === 'us') ? [
            { speed: '50 mph (80 km/h)', econFactor: 1.10, desc: 'Eco Highway' },
            { speed: '60 mph (96 km/h)', econFactor: 1.00, desc: 'Standard Baseline' },
            { speed: '70 mph (112 km/h)', econFactor: 0.88, desc: 'Interstate Cruising' },
            { speed: '80 mph (128 km/h)', econFactor: 0.75, desc: 'Fast Highway Lane' }
        ] : [
            { speed: '80 km/h (50 mph)', econFactor: 1.10, desc: 'Eco Speed' },
            { speed: '100 km/h (62 mph)', econFactor: 1.00, desc: 'Standard Baseline' },
            { speed: '120 km/h (75 mph)', econFactor: 0.88, desc: 'Motorway / Highway' },
            { speed: '135 km/h (84 mph)', econFactor: 0.75, desc: 'Fast Express Lane' }
        ];

        speedTableBody.innerHTML = '';
        speedProfiles.forEach(sp => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--color-border-subtle)';

            let altEcon = 0;
            let altVol = 0;

            if (currentUnit === 'us') {
                altEcon = rawEcon * sp.econFactor;
                altVol = totalDist / altEcon;
            } else {
                // In L/100km, a lower factor means higher consumption: L/100km / factor
                altEcon = rawEcon / sp.econFactor;
                altVol = (totalDist * altEcon) / 100;
            }

            const altFuelCost = altVol * rawPrice;
            const diffCost = altFuelCost - fuelCost;
            const diffPct = ((altFuelCost - fuelCost) / fuelCost) * 100;

            let varianceClass = '#10b981';
            let varianceText = 'Baseline';
            if (Math.abs(diffCost) > 0.05) {
                if (diffCost < 0) {
                    varianceText = `-${curFmt.format(Math.abs(diffCost))} (${diffPct.toFixed(1)}% savings)`;
                    varianceClass = '#10b981';
                } else {
                    varianceText = `+${curFmt.format(diffCost)} (+${diffPct.toFixed(1)}% cost)`;
                    varianceClass = '#ef4444';
                }
            }

            tr.innerHTML = `
                <td style="padding: 10px 12px; font-weight: 600;">
                    ${sp.speed}
                    <div style="font-size: 0.78rem; color: var(--color-text-muted);">${sp.desc}</div>
                </td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 700; color: #38bdf8;">
                    ${altEcon.toFixed(1)} ${currentUnit === 'us' ? 'MPG' : 'L/100km'}
                </td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 600;">
                    ${altVol.toFixed(2)} ${volUnitName}
                </td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 700; color: var(--color-text);">
                    ${curFmt.format(altFuelCost)}
                </td>
                <td class="td-right" style="padding: 10px 12px; font-weight: 700; color: ${varianceClass};">
                    ${varianceText}
                </td>
            `;
            speedTableBody.appendChild(tr);
        });
    }

    // Input listeners
    [distInput, econInput, priceInput, ridersInput, tollsInput, parkingInput].forEach(inp => {
        inp.addEventListener('input', calculateTrip);
    });

    tripRadios.forEach(r => {
        r.addEventListener('change', calculateTrip);
    });

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateTrip);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            unitButtons.forEach(b => b.classList.remove('active'));
            unitButtons[0].classList.add('active');
            currentUnit = 'us';

            presetButtons.forEach(b => b.classList.remove('active'));
            presetButtons[0].classList.add('active');

            distInput.value = '25';
            distLabel.textContent = 'Trip Distance (One-Way)';
            distSuffix.textContent = 'Miles';

            econInput.value = '30';
            econLabel.textContent = 'Fuel Efficiency (MPG)';
            econSuffix.textContent = 'MPG';

            priceInput.value = '3.45';
            priceLabel.textContent = 'Fuel Price ($ / Gallon)';
            priceSuffix.textContent = '/ gal';

            tripRadios[0].checked = true;
            ridersInput.value = '1';
            tollsInput.value = '0';
            parkingInput.value = '0';

            calculateTrip();
        });
    }

    // Initial calculation
    calculateTrip();
});
