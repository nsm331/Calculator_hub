/**
 * CalculatorHub - Annuity Payout Calculator Engine
 * Actuarial periodic distribution, capital longevity/perpetuity, ordinary annuity vs. annuity due.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mode Buttons
    const modeBtns = document.querySelectorAll('.annuity-mode-btn');
    const durationGroup = document.getElementById('annuity-duration-group');
    const pmtGroup = document.getElementById('annuity-pmt-group');

    // Inputs
    const principalInput = document.getElementById('annuity-principal');
    const rateInput = document.getElementById('annuity-rate');
    const yearsInput = document.getElementById('annuity-years');
    const pmtInput = document.getElementById('annuity-pmt-val');
    const freqSelect = document.getElementById('annuity-freq');
    const timingSelect = document.getElementById('annuity-timing');
    const calcBtn = document.getElementById('annuity-calc-btn');

    // Outputs
    const resTitle = document.getElementById('annuity-res-title');
    const formulaBadge = document.getElementById('annuity-formula-badge');
    const primaryResult = document.getElementById('annuity-primary-result');
    const secondaryResult = document.getElementById('annuity-secondary-result');
    const totalPayoutVal = document.getElementById('annuity-total-payout');
    const totalInterestVal = document.getElementById('annuity-total-interest');
    const principalPctVal = document.getElementById('annuity-principal-pct');
    const interestPctVal = document.getElementById('annuity-interest-pct');
    const balanceBarPrincipal = document.getElementById('annuity-bar-principal');
    const balanceBarInterest = document.getElementById('annuity-bar-interest');
    const scheduleTbody = document.getElementById('annuity-schedule-tbody');

    let currentMode = 'payout'; // 'payout' or 'longevity'

    // Mode Toggle
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentMode = this.dataset.mode;
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            if (currentMode === 'payout') {
                durationGroup.style.display = 'block';
                pmtGroup.style.display = 'none';
                resTitle.textContent = 'Estimated Periodic Payout';
                formulaBadge.textContent = 'Fixed Duration Solve';
            } else {
                durationGroup.style.display = 'none';
                pmtGroup.style.display = 'block';
                resTitle.textContent = 'Estimated Capital Longevity';
                formulaBadge.textContent = 'Exhaustion Horizon Solve';
            }
            calculateAnnuity();
        });
    });

    // Real-time calculation listeners
    [principalInput, rateInput, yearsInput, pmtInput, freqSelect, timingSelect].forEach(el => {
        if (el) {
            el.addEventListener('input', calculateAnnuity);
            el.addEventListener('change', calculateAnnuity);
        }
    });

    if (calcBtn) {
        calcBtn.addEventListener('click', calculateAnnuity);
    }

    function calculateAnnuity() {
        const principal = parseFloat(principalInput.value);
        const annualRate = parseFloat(rateInput.value);
        const freq = parseInt(freqSelect.value, 10) || 12; // 12, 4, 2, 1
        const isAnnuityDue = timingSelect.value === 'beginning';

        if (isNaN(principal) || principal <= 0 || isNaN(annualRate) || annualRate < 0) {
            showError('Please enter a valid starting principal and interest rate.');
            return;
        }

        const r = annualRate / 100;
        const i = r / freq; // Periodic discount rate

        const freqLabels = {
            12: 'Month',
            4: 'Quarter',
            2: 'Semi-Annual Period',
            1: 'Year'
        };
        const periodName = freqLabels[freq] || 'Period';

        if (currentMode === 'payout') {
            const years = parseFloat(yearsInput.value);
            if (isNaN(years) || years <= 0) {
                showError('Please enter a positive payout duration in years.');
                return;
            }

            const totalPeriods = Math.round(years * freq);
            let pmt = 0;

            if (i === 0) {
                pmt = principal / totalPeriods;
            } else {
                const discountFactor = 1 - Math.pow(1 + i, -totalPeriods);
                pmt = (principal * i) / discountFactor;
                if (isAnnuityDue) {
                    pmt = pmt / (1 + i);
                }
            }

            const totalReceived = pmt * totalPeriods;
            const totalInterest = Math.max(0, totalReceived - principal);

            primaryResult.textContent = formatCurrency(pmt) + ` / ${periodName}`;
            secondaryResult.innerHTML = `Total Distributions Over <strong>${years} Years</strong>: <strong>${formatCurrency(totalReceived)}</strong>`;

            updateSummaryMetrics(principal, totalReceived, totalInterest);
            generateSchedule(principal, i, pmt, totalPeriods, freq, isAnnuityDue);

        } else {
            // Longevity Mode
            const desiredPmt = parseFloat(pmtInput.value);
            if (isNaN(desiredPmt) || desiredPmt <= 0) {
                showError('Please enter a valid periodic withdrawal amount.');
                return;
            }

            // Check for Perpetuity (interest earned >= payout)
            const minPerpetualWithdrawal = isAnnuityDue ? (principal * i) / (1 + i) : (principal * i);

            if (i > 0 && desiredPmt <= minPerpetualWithdrawal) {
                primaryResult.textContent = 'Infinite (Perpetual)';
                secondaryResult.innerHTML = `Distributions of <strong>${formatCurrency(desiredPmt)}</strong> are fully covered by period earnings (<strong>${formatCurrency(principal * i)}/period</strong>). Principal will never deplete!`;

                totalPayoutVal.textContent = 'Perpetual Income';
                totalInterestVal.textContent = 'Compound Surplus';
                principalPctVal.textContent = '100% Preserved';
                interestPctVal.textContent = 'Endless Flow';

                if (balanceBarPrincipal && balanceBarInterest) {
                    balanceBarPrincipal.style.width = '100%';
                    balanceBarInterest.style.width = '0%';
                }

                generatePerpetualSchedule(principal, i, desiredPmt, freq, isAnnuityDue);
                return;
            }

            // Finite Longevity: Solve for n
            let nPeriods = 0;
            if (i === 0) {
                nPeriods = principal / desiredPmt;
            } else {
                let numeratorArg = 0;
                if (isAnnuityDue) {
                    numeratorArg = 1 - (principal * i) / (desiredPmt * (1 + i));
                } else {
                    numeratorArg = 1 - (principal * i) / desiredPmt;
                }

                if (numeratorArg <= 0) {
                    nPeriods = 999 * freq;
                } else {
                    nPeriods = -Math.log(numeratorArg) / Math.log(1 + i);
                }
            }

            const totalYears = nPeriods / freq;
            const wholeYears = Math.floor(totalYears);
            const remainingMonths = Math.round((totalYears - wholeYears) * 12);

            let longevityStr = '';
            if (wholeYears === 0) {
                longevityStr = `${remainingMonths} Months`;
            } else if (remainingMonths === 0) {
                longevityStr = `${wholeYears} Years`;
            } else {
                longevityStr = `${wholeYears} Yrs, ${remainingMonths} Mos`;
            }

            primaryResult.textContent = longevityStr;
            const totalReceived = desiredPmt * nPeriods;
            const totalInterest = Math.max(0, totalReceived - principal);

            secondaryResult.innerHTML = `Capital lasts approximately <strong>${Math.ceil(nPeriods)} ${periodName.toLowerCase()}s</strong> with total payouts of <strong>${formatCurrency(totalReceived)}</strong>`;

            updateSummaryMetrics(principal, totalReceived, totalInterest);
            generateSchedule(principal, i, desiredPmt, Math.ceil(nPeriods), freq, isAnnuityDue);
        }
    }

    function updateSummaryMetrics(principal, totalReceived, totalInterest) {
        totalPayoutVal.textContent = formatCurrency(totalReceived);
        totalInterestVal.textContent = formatCurrency(totalInterest);

        const principalPct = totalReceived > 0 ? (principal / totalReceived) * 100 : 100;
        const interestPct = totalReceived > 0 ? (totalInterest / totalReceived) * 100 : 0;

        principalPctVal.textContent = `${principalPct.toFixed(1)}% Principal`;
        interestPctVal.textContent = `${interestPct.toFixed(1)}% Interest`;

        if (balanceBarPrincipal && balanceBarInterest) {
            balanceBarPrincipal.style.width = `${Math.min(100, Math.max(0, principalPct))}%`;
            balanceBarInterest.style.width = `${Math.min(100, Math.max(0, interestPct))}%`;
        }
    }

    function generateSchedule(principal, periodicRate, pmt, totalPeriods, freq, isAnnuityDue) {
        if (!scheduleTbody) return;

        let balance = principal;
        let cumulativePayout = 0;
        let cumulativeInterest = 0;
        let html = '';

        // Display annual summary if many periods, or periodic if <= 24 periods
        const isAnnualSummary = totalPeriods > 24 && freq > 1;
        const maxDisplayPeriods = Math.min(totalPeriods, 360); // Cap at 30 years to protect DOM

        let yearCount = 1;
        let yearPayout = 0;
        let yearInterest = 0;
        let yearStartBalance = balance;

        for (let p = 1; p <= maxDisplayPeriods; p++) {
            let interestEarned = 0;
            let currentPayout = pmt;

            if (isAnnuityDue) {
                if (balance < currentPayout) {
                    currentPayout = balance;
                }
                balance -= currentPayout;
                interestEarned = balance * periodicRate;
                balance += interestEarned;
            } else {
                interestEarned = balance * periodicRate;
                balance += interestEarned;
                if (balance < currentPayout) {
                    currentPayout = balance;
                }
                balance -= currentPayout;
            }

            balance = Math.max(0, balance);
            cumulativePayout += currentPayout;
            cumulativeInterest += interestEarned;
            yearPayout += currentPayout;
            yearInterest += interestEarned;

            if (isAnnualSummary) {
                if (p % freq === 0 || p === maxDisplayPeriods || balance <= 0) {
                    html += `
                        <tr style="border-bottom: 1px solid var(--color-border-light);">
                            <td style="padding: 10px 12px; font-weight: 600;">Year ${yearCount}</td>
                            <td style="padding: 10px 12px;">${formatCurrency(yearStartBalance)}</td>
                            <td style="padding: 10px 12px; color: var(--color-accent-blue); font-weight: 600;">${formatCurrency(yearPayout)}</td>
                            <td style="padding: 10px 12px; color: var(--color-accent-emerald);">${formatCurrency(yearInterest)}</td>
                            <td style="padding: 10px 12px; font-weight: 700;">${formatCurrency(balance)}</td>
                        </tr>
                    `;
                    yearCount++;
                    yearPayout = 0;
                    yearInterest = 0;
                    yearStartBalance = balance;
                }
            } else {
                html += `
                    <tr style="border-bottom: 1px solid var(--color-border-light);">
                        <td style="padding: 10px 12px; font-weight: 600;">P${p}</td>
                        <td style="padding: 10px 12px;">${formatCurrency(balance + currentPayout - interestEarned)}</td>
                        <td style="padding: 10px 12px; color: var(--color-accent-blue); font-weight: 600;">${formatCurrency(currentPayout)}</td>
                        <td style="padding: 10px 12px; color: var(--color-accent-emerald);">${formatCurrency(interestEarned)}</td>
                        <td style="padding: 10px 12px; font-weight: 700;">${formatCurrency(balance)}</td>
                    </tr>
                `;
            }

            if (balance <= 0) break;
        }

        scheduleTbody.innerHTML = html;
    }

    function generatePerpetualSchedule(principal, periodicRate, pmt, freq, isAnnuityDue) {
        if (!scheduleTbody) return;

        let html = '';
        const annualPayout = pmt * freq;
        const annualInterest = (principal * periodicRate) * freq;

        for (let y = 1; y <= 5; y++) {
            html += `
                <tr style="border-bottom: 1px solid var(--color-border-light);">
                    <td style="padding: 10px 12px; font-weight: 600;">Year ${y} (Perpetual)</td>
                    <td style="padding: 10px 12px;">${formatCurrency(principal)}</td>
                    <td style="padding: 10px 12px; color: var(--color-accent-blue); font-weight: 600;">${formatCurrency(annualPayout)}</td>
                    <td style="padding: 10px 12px; color: var(--color-accent-emerald);">${formatCurrency(annualInterest)}</td>
                    <td style="padding: 10px 12px; font-weight: 700;">${formatCurrency(principal)}</td>
                </tr>
            `;
        }
        scheduleTbody.innerHTML = html;
    }

    function showError(msg) {
        primaryResult.textContent = 'Invalid Input';
        secondaryResult.textContent = msg || 'Please verify numerical inputs.';
    }

    function formatCurrency(val) {
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Initial Calculation
    calculateAnnuity();
});
