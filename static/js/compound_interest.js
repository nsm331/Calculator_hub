/**
 * Compound Interest Calculator Engine
 * 100% Client-Side Vanilla JavaScript
 * Zero external dependencies. Instant recalculation.
 */

(function () {
    'use strict';

    // DOM Elements
    var form = document.getElementById('compound-form');
    var principalInput = document.getElementById('ci-principal');
    var rateInput = document.getElementById('ci-rate');
    var yearsInput = document.getElementById('ci-years');
    var freqSelect = document.getElementById('ci-frequency');
    var additionInput = document.getElementById('ci-addition');
    var additionFreqSelect = document.getElementById('ci-addition-freq');
    var timingSelect = document.getElementById('ci-timing');

    var calcBtn = document.getElementById('ci-calc-btn');
    var resetBtn = document.getElementById('ci-reset-btn');

    var futureValEl = document.getElementById('ci-future-val');
    var futureSubEl = document.getElementById('ci-future-sub');
    var totalInvestedEl = document.getElementById('ci-total-invested');
    var totalInterestEl = document.getElementById('ci-total-interest');
    var apyValEl = document.getElementById('ci-apy-val');
    var multiplierValEl = document.getElementById('ci-multiplier-val');
    var doublingTimeEl = document.getElementById('ci-doubling-time');
    var ratioValEl = document.getElementById('ci-ratio-val');

    var barPrincipal = document.getElementById('ci-bar-principal');
    var barDeposits = document.getElementById('ci-bar-deposits');
    var barInterest = document.getElementById('ci-bar-interest');

    var legendPrincipal = document.getElementById('ci-legend-principal');
    var legendDeposits = document.getElementById('ci-legend-deposits');
    var legendInterest = document.getElementById('ci-legend-interest');

    var scheduleTbody = document.getElementById('ci-schedule-tbody');

    function formatCurrency(amount) {
        return '$' + amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function calculateCompoundInterest() {
        var P = parseFloat(principalInput.value) || 0;
        var annualRatePercent = parseFloat(rateInput.value) || 0;
        var r = annualRatePercent / 100;
        var t = parseInt(yearsInput.value, 10) || 1;
        var compoundPerYear = parseInt(freqSelect.value, 10) || 12;
        var pmt = parseFloat(additionInput.value) || 0;
        var pmtFreq = parseInt(additionFreqSelect.value, 10) || 12;
        var timing = timingSelect.value; // 'beginning' or 'end'

        if (P < 0) P = 0;
        if (r < 0) r = 0;
        if (t < 1) t = 1;
        if (t > 60) t = 60;
        if (pmt < 0) pmt = 0;

        // Effective Annual Rate (APY)
        var apy = Math.pow(1 + (r / compoundPerYear), compoundPerYear) - 1;

        // Simulate year-by-year growth
        // For standard financial fidelity with periodic additions and compounding:
        // We use monthly sub-steps as the common simulation resolution (12 periods/year)
        var simulationStepsPerYear = 12;
        var totalSteps = t * simulationStepsPerYear;
        var monthlyRate = Math.pow(1 + (r / compoundPerYear), compoundPerYear / simulationStepsPerYear) - 1;

        var currentBalance = P;
        var cumulativeDeposits = 0;
        var cumulativeInterest = 0;

        var yearlyData = [];
        var yearStartBalance = P;
        var yearDeposits = 0;
        var yearInterest = 0;

        for (var step = 1; step <= totalSteps; step++) {
            // Check if regular addition occurs at this step
            var depositThisStep = 0;
            if (pmtFreq === 12) {
                // Monthly addition
                depositThisStep = pmt;
            } else if (pmtFreq === 1) {
                // Annual addition (once every 12 steps, e.g. at step % 12 === 1 or 0)
                if ((timing === 'beginning' && (step % 12 === 1)) || (timing === 'end' && (step % 12 === 0))) {
                    depositThisStep = pmt;
                }
            }

            if (timing === 'beginning') {
                currentBalance += depositThisStep;
                cumulativeDeposits += depositThisStep;
                yearDeposits += depositThisStep;

                var stepInterest = currentBalance * monthlyRate;
                currentBalance += stepInterest;
                cumulativeInterest += stepInterest;
                yearInterest += stepInterest;
            } else {
                var stepInterestEnd = currentBalance * monthlyRate;
                currentBalance += stepInterestEnd;
                cumulativeInterest += stepInterestEnd;
                yearInterest += stepInterestEnd;

                currentBalance += depositThisStep;
                cumulativeDeposits += depositThisStep;
                yearDeposits += depositThisStep;
            }

            if (step % simulationStepsPerYear === 0) {
                var currentYear = step / simulationStepsPerYear;
                yearlyData.push({
                    year: currentYear,
                    startBal: yearStartBalance,
                    annualDeposits: yearDeposits,
                    interestEarned: yearInterest,
                    endBal: currentBalance
                });
                yearStartBalance = currentBalance;
                yearDeposits = 0;
                yearInterest = 0;
            }
        }

        var totalInvested = P + cumulativeDeposits;
        var finalFutureValue = currentBalance;
        var totalInterest = finalFutureValue - totalInvested;
        if (totalInterest < 0) totalInterest = 0;

        // Rule of 72 Doubling Time
        var doublingTime = annualRatePercent > 0 ? (72 / annualRatePercent).toFixed(1) + ' Years' : 'N/A';
        var growthMultiplier = totalInvested > 0 ? (finalFutureValue / totalInvested).toFixed(2) + 'x' : '1.00x';
        var interestRatio = totalInvested > 0 ? ((totalInterest / totalInvested) * 100).toFixed(1) + '%' : '0.0%';

        // DOM Updates
        futureValEl.textContent = formatCurrency(finalFutureValue);
        futureSubEl.textContent = 'Over ' + t + ' years at ' + annualRatePercent.toFixed(2) + '% nominal annual return';

        totalInvestedEl.textContent = formatCurrency(totalInvested);
        totalInterestEl.textContent = formatCurrency(totalInterest);
        apyValEl.textContent = (apy * 100).toFixed(2) + '%';
        multiplierValEl.textContent = growthMultiplier;
        doublingTimeEl.textContent = doublingTime;
        ratioValEl.textContent = interestRatio;

        // Asset composition percentages
        var pctPrincipal = finalFutureValue > 0 ? (P / finalFutureValue) * 100 : 0;
        var pctDeposits = finalFutureValue > 0 ? (cumulativeDeposits / finalFutureValue) * 100 : 0;
        var pctInterest = finalFutureValue > 0 ? (totalInterest / finalFutureValue) * 100 : 0;

        barPrincipal.style.width = pctPrincipal.toFixed(1) + '%';
        barDeposits.style.width = pctDeposits.toFixed(1) + '%';
        barInterest.style.width = pctInterest.toFixed(1) + '%';

        legendPrincipal.textContent = formatCurrency(P) + ' (' + pctPrincipal.toFixed(1) + '%)';
        legendDeposits.textContent = formatCurrency(cumulativeDeposits) + ' (' + pctDeposits.toFixed(1) + '%)';
        legendInterest.textContent = formatCurrency(totalInterest) + ' (' + pctInterest.toFixed(1) + '%)';

        // Render schedule table
        renderScheduleTable(yearlyData);
    }

    function renderScheduleTable(data) {
        if (!scheduleTbody) return;
        var html = '';
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            html += '<tr>' +
                '<td><strong>Year ' + row.year + '</strong></td>' +
                '<td>' + formatCurrency(row.startBal) + '</td>' +
                '<td>' + formatCurrency(row.annualDeposits) + '</td>' +
                '<td style="color: #f59e0b;">+' + formatCurrency(row.interestEarned) + '</td>' +
                '<td><strong>' + formatCurrency(row.endBal) + '</strong></td>' +
                '</tr>';
        }
        scheduleTbody.innerHTML = html;
    }

    function resetDefaults() {
        principalInput.value = '10000';
        rateInput.value = '7.5';
        yearsInput.value = '10';
        freqSelect.value = '12';
        additionInput.value = '200';
        additionFreqSelect.value = '12';
        timingSelect.value = 'end';
        calculateCompoundInterest();
    }

    // Attach event listeners
    [
        principalInput, rateInput, yearsInput, freqSelect,
        additionInput, additionFreqSelect, timingSelect
    ].forEach(function (el) {
        if (el) {
            el.addEventListener('input', calculateCompoundInterest);
            el.addEventListener('change', calculateCompoundInterest);
        }
    });

    if (calcBtn) calcBtn.addEventListener('click', calculateCompoundInterest);
    if (resetBtn) resetBtn.addEventListener('click', resetDefaults);

    // Initial calculation on load
    calculateCompoundInterest();
})();
