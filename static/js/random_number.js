/**
 * Random Number Generator - Pure Vanilla JavaScript Engine
 * Cryptographically Secure PRNG (CSPRNG) hardware entropy pool,
 * discrete uniform integers, continuous decimals, Box-Muller Gaussian normal,
 * Fisher-Yates non-replacing sampling, and quick dice/lottery tools.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Mode Tabs & Panes
    const modeBtns = document.querySelectorAll('.rng-tab-btn');
    const modePanes = {
        integer: document.getElementById('pane-integer'),
        decimal: document.getElementById('pane-decimal'),
        gaussian: document.getElementById('pane-gaussian')
    };
    const quickPresetsContainer = document.getElementById('quick-presets-container');
    const quickBtns = document.querySelectorAll('.rng-quick-btn');

    // Integer Inputs
    const intMinInput = document.getElementById('int-min');
    const intMaxInput = document.getElementById('int-max');
    const intCountInput = document.getElementById('int-count');

    // Decimal Inputs
    const decMinInput = document.getElementById('dec-min');
    const decMaxInput = document.getElementById('dec-max');
    const decPlacesInput = document.getElementById('dec-places');
    const decCountInput = document.getElementById('dec-count');

    // Gaussian Inputs
    const gaussMeanInput = document.getElementById('gauss-mean');
    const gaussSdInput = document.getElementById('gauss-sd');
    const gaussCountInput = document.getElementById('gauss-count');

    // Common Option Inputs
    const duplicatesSelect = document.getElementById('rng-duplicates');
    const sortSelect = document.getElementById('rng-sort');
    const csprngCheckbox = document.getElementById('rng-csprng');

    // Buttons
    const generateBtn = document.getElementById('rng-generate-btn');
    const copyBtn = document.getElementById('rng-copy-btn');
    const downloadBtn = document.getElementById('rng-download-btn');

    // Result DOM Elements
    const singleResultHero = document.getElementById('single-result-hero');
    const heroNumberDisplay = document.getElementById('hero-number-display');
    const heroSubtitle = document.getElementById('hero-subtitle');

    const multiResultContainer = document.getElementById('multi-result-container');
    const resultsCountLabel = document.getElementById('results-count-label');
    const entropyBadge = document.getElementById('entropy-badge');
    const numbersGrid = document.getElementById('numbers-grid');

    const statsContainer = document.getElementById('stats-container');
    const statSum = document.getElementById('stat-sum');
    const statMean = document.getElementById('stat-mean');
    const statMedian = document.getElementById('stat-median');
    const statRange = document.getElementById('stat-range');

    let currentMode = 'integer'; // 'integer', 'decimal', 'gaussian', or 'quick'
    let lastGeneratedData = [];
    let customQuickString = null;

    // Cryptographically Secure Uniform [0, 1) Float Generator
    function getSecureRandomFloat() {
        if (csprngCheckbox.checked && window.crypto && window.crypto.getRandomValues) {
            const buffer = new Uint32Array(1);
            window.crypto.getRandomValues(buffer);
            // Divide by 2^32 to get [0, 1)
            return buffer[0] / (0xFFFFFFFF + 1);
        }
        return Math.random();
    }

    // Uniform Integer [min, max] inclusive
    function getSecureRandomInt(min, max) {
        const range = max - min + 1;
        if (range <= 0) return min;
        return min + Math.floor(getSecureRandomFloat() * range);
    }

    // Box-Muller Normal Variable
    function getSecureGaussian(mean, stdDev) {
        let u1 = getSecureRandomFloat();
        let u2 = getSecureRandomFloat();
        // Prevent log(0)
        while (u1 <= 1e-15) u1 = getSecureRandomFloat();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return mean + (z0 * stdDev);
    }

    // Main Generate Handler
    function generateRandomNumbers() {
        customQuickString = null;
        let results = [];
        const allowDuplicates = duplicatesSelect.value === 'yes';
        const sortOrder = sortSelect.value; // 'none', 'asc', 'desc'

        if (currentMode === 'integer') {
            let min = parseInt(intMinInput.value, 10);
            let max = parseInt(intMaxInput.value, 10);
            let count = Math.min(1000, Math.max(1, parseInt(intCountInput.value, 10) || 1));

            if (isNaN(min)) min = 1;
            if (isNaN(max)) max = 100;
            if (min > max) {
                const temp = min;
                min = max;
                max = temp;
                intMinInput.value = min;
                intMaxInput.value = max;
            }

            const totalAvailable = max - min + 1;

            if (!allowDuplicates && count > totalAvailable) {
                count = totalAvailable;
                intCountInput.value = count;
            }

            if (!allowDuplicates) {
                // Fisher-Yates sample without replacement
                const pool = [];
                for (let i = min; i <= max; i++) pool.push(i);
                for (let i = pool.length - 1; i > 0; i--) {
                    const j = Math.floor(getSecureRandomFloat() * (i + 1));
                    const tmp = pool[i];
                    pool[i] = pool[j];
                    pool[j] = tmp;
                }
                results = pool.slice(0, count);
            } else {
                // With replacement
                for (let i = 0; i < count; i++) {
                    results.push(getSecureRandomInt(min, max));
                }
            }

            heroSubtitle.textContent = `Uniform Integer Distribution • Range [${min}, ${max}]`;

        } else if (currentMode === 'decimal') {
            let min = parseFloat(decMinInput.value) || 0;
            let max = parseFloat(decMaxInput.value) || 1;
            const places = Math.min(10, Math.max(1, parseInt(decPlacesInput.value, 10) || 4));
            const count = Math.min(1000, Math.max(1, parseInt(decCountInput.value, 10) || 5));

            if (min > max) {
                const temp = min;
                min = max;
                max = temp;
                decMinInput.value = min;
                decMaxInput.value = max;
            }

            const range = max - min;
            for (let i = 0; i < count; i++) {
                const val = min + (getSecureRandomFloat() * range);
                results.push(parseFloat(val.toFixed(places)));
            }

            heroSubtitle.textContent = `Continuous Uniform Decimal Distribution • [${min}, ${max}] (${places} decimals)`;

        } else if (currentMode === 'gaussian') {
            const mean = parseFloat(gaussMeanInput.value) || 0;
            const stdDev = Math.max(0.0001, parseFloat(gaussSdInput.value) || 1);
            const count = Math.min(1000, Math.max(1, parseInt(gaussCountInput.value, 10) || 6));

            for (let i = 0; i < count; i++) {
                const val = getSecureGaussian(mean, stdDev);
                results.push(parseFloat(val.toFixed(4)));
            }

            heroSubtitle.textContent = `Gaussian Normal Distribution • Mean μ = ${mean}, Std Dev σ = ${stdDev}`;
        }

        // Apply Sorting
        if (sortOrder === 'asc') {
            results.sort((a, b) => a - b);
        } else if (sortOrder === 'desc') {
            results.sort((a, b) => b - a);
        }

        lastGeneratedData = results;
        renderResults(results);
    }

    // Quick Utilities Handler
    function handleQuickAction(type) {
        let results = [];
        let subtitle = '';

        if (type === 'coin') {
            const flip = getSecureRandomInt(0, 1) === 0 ? 'Heads' : 'Tails';
            customQuickString = flip;
            results = [flip];
            subtitle = 'Fair Binary Bernoulli Trial (p = 0.5)';
        } else if (type === 'd6') {
            const roll = getSecureRandomInt(1, 6);
            results = [roll];
            subtitle = 'Standard 6-Sided Cubic Die (1d6)';
        } else if (type === '2d6') {
            const d1 = getSecureRandomInt(1, 6);
            const d2 = getSecureRandomInt(1, 6);
            results = [d1, d2];
            subtitle = `Two 6-Sided Dice: ${d1} + ${d2} = ${d1 + d2}`;
        } else if (type === 'd20') {
            const d20 = getSecureRandomInt(1, 20);
            results = [d20];
            let note = '';
            if (d20 === 20) note = ' — CRITICAL HIT! 🌟';
            if (d20 === 1) note = ' — CRITICAL FAILURE! 💀';
            subtitle = `20-Sided Icosahedron Die (1d20)${note}`;
        } else if (type === 'lottery649') {
            // Pick 6 unique from 1 to 49
            const pool = [];
            for (let i = 1; i <= 49; i++) pool.push(i);
            for (let i = pool.length - 1; i > 0; i--) {
                const j = Math.floor(getSecureRandomFloat() * (i + 1));
                const tmp = pool[i];
                pool[i] = pool[j];
                pool[j] = tmp;
            }
            results = pool.slice(0, 6).sort((a, b) => a - b);
            subtitle = 'National Lottery 6/49 (6 Unique Numbers from 1 to 49)';
        } else if (type === 'powerball') {
            // 5 white balls 1 to 69 + 1 red Powerball 1 to 26
            const pool = [];
            for (let i = 1; i <= 69; i++) pool.push(i);
            for (let i = pool.length - 1; i > 0; i--) {
                const j = Math.floor(getSecureRandomFloat() * (i + 1));
                const tmp = pool[i];
                pool[i] = pool[j];
                pool[j] = tmp;
            }
            const whiteBalls = pool.slice(0, 5).sort((a, b) => a - b);
            const powerBall = getSecureRandomInt(1, 26);
            results = [...whiteBalls, `Powerball: ${powerBall}`];
            subtitle = 'Powerball: 5 White Balls (1–69) + 1 Red Powerball (1–26)';
        }

        lastGeneratedData = results;
        heroSubtitle.textContent = subtitle;
        renderResults(results);
    }

    // Render Results in DOM
    function renderResults(results) {
        const count = results.length;
        resultsCountLabel.textContent = count;

        if (csprngCheckbox.checked) {
            entropyBadge.style.display = 'inline-block';
            entropyBadge.textContent = 'Cryptographically Secure (CSPRNG)';
            entropyBadge.style.background = 'rgba(16, 185, 129, 0.15)';
            entropyBadge.style.color = '#10b981';
        } else {
            entropyBadge.style.display = 'inline-block';
            entropyBadge.textContent = 'Pseudorandom (Standard PRNG)';
            entropyBadge.style.background = 'rgba(245, 158, 11, 0.15)';
            entropyBadge.style.color = '#f59e0b';
        }

        if (count === 1) {
            singleResultHero.style.display = 'block';
            heroNumberDisplay.textContent = results[0];
            multiResultContainer.style.display = 'none';
            statsContainer.style.display = 'none';
        } else {
            singleResultHero.style.display = 'none';
            multiResultContainer.style.display = 'block';

            let pillsHtml = '';
            results.forEach((val, idx) => {
                pillsHtml += `
                    <div style="background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: 6px; padding: 8px 14px; font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 1.1rem; font-weight: 700; color: #818cf8; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 0.72rem; color: var(--color-text-muted); font-weight: 500;">#${idx + 1}</span>
                        <span>${val}</span>
                    </div>
                `;
            });
            numbersGrid.innerHTML = pillsHtml;

            // Check if numeric for descriptive stats
            const numericResults = results.filter(v => typeof v === 'number' && !isNaN(v));
            if (numericResults.length >= 2) {
                statsContainer.style.display = 'block';
                computeDescriptiveStats(numericResults);
            } else {
                statsContainer.style.display = 'none';
            }
        }
    }

    // Calculate Descriptive Statistics
    function computeDescriptiveStats(nums) {
        const sum = nums.reduce((acc, v) => acc + v, 0);
        const mean = sum / nums.length;

        const sorted = [...nums].sort((a, b) => a - b);
        let median = 0;
        const mid = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
            median = (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
            median = sorted[mid];
        }

        const min = sorted[0];
        const max = sorted[sorted.length - 1];

        statSum.textContent = Number.isInteger(sum) ? sum.toLocaleString('en-US') : sum.toFixed(2);
        statMean.textContent = mean.toFixed(2);
        statMedian.textContent = Number.isInteger(median) ? median : median.toFixed(2);
        statRange.textContent = `${min} … ${max}`;
    }

    // Mode Tab Switcher
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            currentMode = this.getAttribute('data-mode');

            if (currentMode === 'quick') {
                quickPresetsContainer.style.display = 'block';
                Object.keys(modePanes).forEach(k => modePanes[k].style.display = 'none');
                handleQuickAction('d6');
            } else {
                quickPresetsContainer.style.display = 'none';
                Object.keys(modePanes).forEach(k => {
                    modePanes[k].style.display = (k === currentMode) ? 'block' : 'none';
                });
                generateRandomNumbers();
            }
        });
    });

    // Quick Action Buttons
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            quickBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            handleQuickAction(this.getAttribute('data-quick'));
        });
    });

    // Main Generate Button
    generateBtn.addEventListener('click', function () {
        if (currentMode === 'quick') {
            const activeQuick = document.querySelector('.rng-quick-btn.active') || quickBtns[0];
            handleQuickAction(activeQuick.getAttribute('data-quick'));
        } else {
            generateRandomNumbers();
        }
    });

    // Copy to Clipboard
    copyBtn.addEventListener('click', function () {
        if (!lastGeneratedData || lastGeneratedData.length === 0) return;
        const textToCopy = lastGeneratedData.join(', ');
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✓ Copied!';
            copyBtn.style.borderColor = '#10b981';
            copyBtn.style.color = '#10b981';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.borderColor = '';
                copyBtn.style.color = '';
            }, 1800);
        });
    });

    // Download as CSV / TXT
    downloadBtn.addEventListener('click', function () {
        if (!lastGeneratedData || lastGeneratedData.length === 0) return;
        const csvContent = "data:text/csv;charset=utf-8," + lastGeneratedData.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `random_numbers_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Initial Execution
    generateRandomNumbers();
});
