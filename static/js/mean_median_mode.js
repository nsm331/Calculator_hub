/**
 * CalculatorHub - Mean, Median & Mode Calculator Engine
 * Descriptive statistics: central tendency, dispersion, quartiles, and frequency distributions.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inputs
    const dataInput = document.getElementById('mmm-data-input');
    const calcBtn = document.getElementById('mmm-calc-btn');
    const clearBtn = document.getElementById('mmm-clear-btn');
    const presetBtns = document.querySelectorAll('.mmm-preset-btn');

    // Outputs - Primary Hero
    const meanVal = document.getElementById('mmm-mean-val');
    const medianVal = document.getElementById('mmm-median-val');
    const modeVal = document.getElementById('mmm-mode-val');

    // Dispersion Metrics
    const sampleVarVal = document.getElementById('mmm-sample-var');
    const popVarVal = document.getElementById('mmm-pop-var');
    const sampleStdVal = document.getElementById('mmm-sample-std');
    const popStdVal = document.getElementById('mmm-pop-std');
    const rangeVal = document.getElementById('mmm-range-val');
    const minVal = document.getElementById('mmm-min-val');
    const maxVal = document.getElementById('mmm-max-val');
    const countVal = document.getElementById('mmm-count-val');
    const sumVal = document.getElementById('mmm-sum-val');
    const q1Val = document.getElementById('mmm-q1-val');
    const q3Val = document.getElementById('mmm-q3-val');
    const iqrVal = document.getElementById('mmm-iqr-val');
    const geomMeanVal = document.getElementById('mmm-geom-mean');

    // Step-by-Step Breakdown
    const sortedDataContainer = document.getElementById('mmm-sorted-data');
    const freqTbody = document.getElementById('mmm-freq-tbody');
    const stepsContainer = document.getElementById('mmm-steps-container');

    // Preset Data Sets
    const PRESETS = {
        scores: '88, 92, 75, 88, 95, 68, 84, 91, 78, 88, 90, 82',
        temps: '72, 75, 68, 71, 74, 79, 75, 70, 73, 76, 75',
        bimodal: '12, 15, 12, 18, 22, 15, 25, 29, 30',
        integers: '3, 7, 5, 13, 20, 23, 39, 23, 40, 23, 14, 12, 56, 23'
    };

    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const presetKey = this.dataset.preset;
            if (PRESETS[presetKey]) {
                dataInput.value = PRESETS[presetKey];
                calculateStatistics();
            }
        });
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            dataInput.value = '';
            dataInput.focus();
        });
    }

    if (calcBtn) {
        calcBtn.addEventListener('click', calculateStatistics);
    }

    dataInput.addEventListener('input', calculateStatistics);

    function parseNumbers(rawStr) {
        if (!rawStr) return [];
        // Split on commas, spaces, tabs, newlines, semicolons
        const tokens = rawStr.split(/[\s,;]+/);
        const numbers = [];
        for (let t of tokens) {
            const trimmed = t.trim();
            if (trimmed !== '') {
                const num = parseFloat(trimmed);
                if (!isNaN(num)) {
                    numbers.push(num);
                }
            }
        }
        return numbers;
    }

    function calculateStatistics() {
        const numbers = parseNumbers(dataInput.value);

        if (numbers.length === 0) {
            showEmpty();
            return;
        }

        const n = numbers.length;
        const sorted = [...numbers].sort((a, b) => a - b);

        // 1. Sum and Mean
        let sum = 0;
        for (let val of numbers) {
            sum += val;
        }
        const mean = sum / n;

        // 2. Median
        let median = 0;
        let medianIndexInfo = '';
        if (n % 2 === 1) {
            const midIdx = Math.floor(n / 2);
            median = sorted[midIdx];
            medianIndexInfo = `Position ${(n + 1) / 2} = ${formatNum(median, 4)}`;
        } else {
            const mid1 = sorted[n / 2 - 1];
            const mid2 = sorted[n / 2];
            median = (mid1 + mid2) / 2;
            medianIndexInfo = `Average of (${formatNum(mid1, 4)} + ${formatNum(mid2, 4)}) / 2 = ${formatNum(median, 4)}`;
        }

        // 3. Mode & Frequency
        const freqMap = {};
        for (let num of sorted) {
            const key = num.toString();
            freqMap[key] = (freqMap[key] || 0) + 1;
        }

        let maxFreq = 0;
        for (let key in freqMap) {
            if (freqMap[key] > maxFreq) {
                maxFreq = freqMap[key];
            }
        }

        const modeList = [];
        for (let key in freqMap) {
            if (freqMap[key] === maxFreq) {
                modeList.push(parseFloat(key));
            }
        }

        let modeDisplay = '';
        let isNoMode = false;
        if (maxFreq === 1 || modeList.length === Object.keys(freqMap).length) {
            modeDisplay = 'No Mode (All values unique)';
            isNoMode = true;
        } else if (modeList.length === 1) {
            modeDisplay = `${formatNum(modeList[0], 4)} (Frequency: ${maxFreq})`;
        } else if (modeList.length === 2) {
            modeDisplay = `${modeList.map(v => formatNum(v, 4)).join(', ')} (Bimodal, Freq: ${maxFreq})`;
        } else {
            modeDisplay = `${modeList.map(v => formatNum(v, 4)).join(', ')} (Multimodal, Freq: ${maxFreq})`;
        }

        // 4. Dispersion Metrics
        const min = sorted[0];
        const max = sorted[n - 1];
        const range = max - min;

        let sumSqDiff = 0;
        for (let val of numbers) {
            const diff = val - mean;
            sumSqDiff += diff * diff;
        }

        const popVar = sumSqDiff / n;
        const popStd = Math.sqrt(popVar);

        let sampleVar = 0;
        let sampleStd = 0;
        if (n > 1) {
            sampleVar = sumSqDiff / (n - 1);
            sampleStd = Math.sqrt(sampleVar);
        }

        // 5. Quartiles (Tukey's hinges)
        let q1 = 0;
        let q3 = 0;
        if (n === 1) {
            q1 = sorted[0];
            q3 = sorted[0];
        } else {
            const lowerHalf = sorted.slice(0, Math.floor(n / 2));
            const upperHalf = (n % 2 === 0) ? sorted.slice(n / 2) : sorted.slice(Math.floor(n / 2) + 1);

            q1 = getMedianOfArray(lowerHalf);
            q3 = getMedianOfArray(upperHalf);
        }
        const iqr = q3 - q1;

        // 6. Geometric Mean (if all positive)
        let geomMean = null;
        const allPositive = numbers.every(v => v > 0);
        if (allPositive) {
            let logSum = 0;
            for (let v of numbers) {
                logSum += Math.log(v);
            }
            geomMean = Math.exp(logSum / n);
        }

        // Render Primary Results
        meanVal.textContent = formatNum(mean, 4);
        medianVal.textContent = formatNum(median, 4);
        modeVal.textContent = modeDisplay;

        // Render Summary Grid
        if (sampleVarVal) sampleVarVal.textContent = n > 1 ? formatNum(sampleVar, 4) : 'N/A (n=1)';
        if (popVarVal) popVarVal.textContent = formatNum(popVar, 4);
        if (sampleStdVal) sampleStdVal.textContent = n > 1 ? formatNum(sampleStd, 4) : 'N/A (n=1)';
        if (popStdVal) popStdVal.textContent = formatNum(popStd, 4);
        if (rangeVal) rangeVal.textContent = formatNum(range, 4);
        if (minVal) minVal.textContent = formatNum(min, 4);
        if (maxVal) maxVal.textContent = formatNum(max, 4);
        if (countVal) countVal.textContent = n.toString();
        if (sumVal) sumVal.textContent = formatNum(sum, 4);
        if (q1Val) q1Val.textContent = formatNum(q1, 4);
        if (q3Val) q3Val.textContent = formatNum(q3, 4);
        if (iqrVal) iqrVal.textContent = formatNum(iqr, 4);
        if (geomMeanVal) geomMeanVal.textContent = geomMean !== null ? formatNum(geomMean, 4) : 'N/A (Non-positive values)';

        // Render Sorted Sequence Badges
        renderSortedBadges(sorted, n);

        // Render Frequency Table
        renderFreqTable(freqMap, n, maxFreq, isNoMode);

        // Render Step-by-Step Explanations
        renderSteps(n, sum, mean, median, medianIndexInfo, modeDisplay, sampleVar, sampleStd, popVar, popStd);
    }

    function getMedianOfArray(arr) {
        if (arr.length === 0) return 0;
        const len = arr.length;
        if (len % 2 === 1) {
            return arr[Math.floor(len / 2)];
        }
        return (arr[len / 2 - 1] + arr[len / 2]) / 2;
    }

    function renderSortedBadges(sorted, n) {
        if (!sortedDataContainer) return;
        const maxDisplay = Math.min(n, 100);
        let badgesHtml = sorted.slice(0, maxDisplay).map(val => 
            `<span style="display: inline-block; padding: 3px 8px; margin: 3px; background: var(--color-bg-card); border: 1px solid var(--color-border-light); border-radius: var(--border-radius-sm); font-size: 0.82rem; font-weight: 600; color: var(--color-text-main); font-family: monospace;">${formatNum(val, 4)}</span>`
        ).join('');

        if (n > 100) {
            badgesHtml += `<span style="font-size: 0.8rem; color: var(--color-text-muted); margin-left: 6px;">... (${n - 100} more items)</span>`;
        }
        sortedDataContainer.innerHTML = badgesHtml;
    }

    function renderFreqTable(freqMap, totalCount, maxFreq, isNoMode) {
        if (!freqTbody) return;

        const entries = Object.keys(freqMap).map(k => ({
            num: parseFloat(k),
            freq: freqMap[k],
            pct: (freqMap[k] / totalCount) * 100
        })).sort((a, b) => b.freq - a.freq || a.num - b.num);

        let html = '';
        entries.slice(0, 15).forEach(e => {
            const isModeVal = !isNoMode && e.freq === maxFreq;
            const highlightStyle = isModeVal ? 'font-weight: 700; color: var(--color-accent-blue);' : '';

            html += `
                <tr style="border-bottom: 1px solid var(--color-border-light);">
                    <td style="padding: 8px 12px; font-family: monospace; ${highlightStyle}">${formatNum(e.num, 4)}</td>
                    <td style="padding: 8px 12px; font-weight: 600; ${highlightStyle}">${e.freq} ${isModeVal ? '★ Mode' : ''}</td>
                    <td style="padding: 8px 12px; color: var(--color-text-muted);">${e.pct.toFixed(1)}%</td>
                </tr>
            `;
        });

        if (entries.length > 15) {
            html += `
                <tr>
                    <td colspan="3" style="padding: 8px 12px; text-align: center; color: var(--color-text-muted); font-size: 0.8rem;">
                        Showing top 15 most frequent values of ${entries.length} distinct items.
                    </td>
                </tr>
            `;
        }
        freqTbody.innerHTML = html;
    }

    function renderSteps(n, sum, mean, median, medianIndexInfo, modeDisplay, sampleVar, sampleStd, popVar, popStd) {
        if (!stepsContainer) return;

        stepsContainer.innerHTML = `
            <div style="background: var(--color-bg-card-alt); border: 1px solid var(--color-border-light); border-radius: var(--border-radius-md); padding: 14px; margin-bottom: 12px;">
                <h5 style="font-size: 0.85rem; font-weight: 700; color: var(--color-accent-blue); margin-bottom: 6px;">1. Arithmetic Mean Calculation</h5>
                <p style="font-size: 0.82rem; color: var(--color-text-muted); margin: 0;">
                    $$\\bar{x} = \\frac{\\sum x}{n} = \\frac{${formatNum(sum, 4)}}{${n}} = \\mathbf{${formatNum(mean, 4)}}$$
                </p>
            </div>
            <div style="background: var(--color-bg-card-alt); border: 1px solid var(--color-border-light); border-radius: var(--border-radius-md); padding: 14px; margin-bottom: 12px;">
                <h5 style="font-size: 0.85rem; font-weight: 700; color: var(--color-accent-emerald); margin-bottom: 6px;">2. Median Position Identification</h5>
                <p style="font-size: 0.82rem; color: var(--color-text-muted); margin: 0;">
                    Arranged ${n} items in ascending numerical rank order. ${medianIndexInfo}.
                </p>
            </div>
            <div style="background: var(--color-bg-card-alt); border: 1px solid var(--color-border-light); border-radius: var(--border-radius-md); padding: 14px; margin-bottom: 12px;">
                <h5 style="font-size: 0.85rem; font-weight: 700; color: var(--color-accent-amber); margin-bottom: 6px;">3. Mode Frequency Analysis</h5>
                <p style="font-size: 0.82rem; color: var(--color-text-muted); margin: 0;">
                    Identified most frequent occurrences in dataset: <strong>${modeDisplay}</strong>.
                </p>
            </div>
            <div style="background: var(--color-bg-card-alt); border: 1px solid var(--color-border-light); border-radius: var(--border-radius-md); padding: 14px;">
                <h5 style="font-size: 0.85rem; font-weight: 700; color: var(--color-accent-purple, #a855f7); margin-bottom: 6px;">4. Dispersion &amp; Sample Standard Deviation</h5>
                <p style="font-size: 0.82rem; color: var(--color-text-muted); margin: 0;">
                    Sample Variance $s^2 = \\frac{\\sum (x - \\bar{x})^2}{n - 1} = \\mathbf{${n > 1 ? formatNum(sampleVar, 4) : 'N/A'}}$ &bull; Sample Std Dev $s = \\mathbf{${n > 1 ? formatNum(sampleStd, 4) : 'N/A'}}$.
                </p>
            </div>
        `;

        if (window.renderMathInElement) {
            renderMathInElement(stepsContainer, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ]
            });
        }
    }

    function showEmpty() {
        meanVal.textContent = '--';
        medianVal.textContent = '--';
        modeVal.textContent = '--';
        if (sortedDataContainer) sortedDataContainer.innerHTML = '<span style="color: var(--color-text-muted); font-size: 0.85rem;">Enter numerical values above to see statistics.</span>';
        if (freqTbody) freqTbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--color-text-muted); padding: 12px;">No data entered.</td></tr>';
        if (stepsContainer) stepsContainer.innerHTML = '';
    }

    function formatNum(num, dec) {
        if (isNaN(num)) return 'NaN';
        if (Math.abs(num - Math.round(num)) < 1e-9) {
            return Math.round(num).toString();
        }
        return parseFloat(num.toFixed(dec)).toString();
    }

    // Initial Execution
    calculateStatistics();
});
