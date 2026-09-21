/**
 * Kitchen Cooking Measurements Converter Engine
 * Converts:
 *   1. Ingredient Density-Based Volume <-> Weight (Flour, Sugar, Butter, Oils, etc.)
 *   2. Kitchen Volume Multi-Unit Ladder (Cups, Tbsp, Tsp, Fl Oz, mL, Liters)
 *   3. Recipe Servings Multiplier
 *   4. Oven Temperature Converter (Fahrenheit, Celsius, Gas Mark, Fan-Forced)
 * 100% Client-Side Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mode tabs
    const tabs = document.querySelectorAll('.cook-tab-btn');
    const sections = {
        ingredient: document.getElementById('cook-sec-ingredient'),
        volume: document.getElementById('cook-sec-volume'),
        scaler: document.getElementById('cook-sec-scaler'),
        oven: document.getElementById('cook-sec-oven')
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const targetMode = tab.dataset.mode;
            Object.keys(sections).forEach(sec => {
                if (sections[sec]) {
                    sections[sec].style.display = sec === targetMode ? 'block' : 'none';
                }
            });
        });
    });

    // -------------------------------------------------------------
    // Ingredient Density Database: grams per 1 US Cup (236.588 mL)
    // -------------------------------------------------------------
    const INGREDIENT_DENSITIES = {
        'flour-ap': { name: 'All-Purpose Flour (spooned & leveled)', gPerCup: 125 },
        'flour-cake': { name: 'Cake Flour', gPerCup: 114 },
        'flour-bread': { name: 'Bread Flour', gPerCup: 127 },
        'flour-whole': { name: 'Whole Wheat Flour', gPerCup: 130 },
        'sugar-white': { name: 'Granulated White Sugar', gPerCup: 200 },
        'sugar-brown': { name: 'Brown Sugar (packed)', gPerCup: 220 },
        'sugar-powdered': { name: 'Powdered / Confectioners Sugar', gPerCup: 120 },
        'butter': { name: 'Unsalted Butter', gPerCup: 227 },
        'water': { name: 'Water', gPerCup: 236.6 },
        'milk': { name: 'Milk (whole)', gPerCup: 244 },
        'oil-veg': { name: 'Vegetable / Canola Oil', gPerCup: 218 },
        'oil-olive': { name: 'Olive Oil', gPerCup: 216 },
        'honey': { name: 'Honey / Maple Syrup', gPerCup: 340 },
        'oats': { name: 'Rolled Oats (dry)', gPerCup: 90 },
        'cocoa': { name: 'Cocoa Powder (unsweetened)', gPerCup: 100 },
        'rice': { name: 'White Rice (uncooked)', gPerCup: 185 },
        'salt': { name: 'Table Salt', gPerCup: 288 },
        'baking-powder': { name: 'Baking Powder / Soda', gPerCup: 220 },
        'yogurt': { name: 'Greek Yogurt', gPerCup: 245 },
        'cream': { name: 'Heavy Cream', gPerCup: 238 }
    };

    // Unit conversion factors to/from base units:
    // Base volume = US Cups
    const VOLUME_IN_US_CUPS = {
        'us-cup': 1.0,
        'metric-cup': 250 / 236.5882365,
        'tbsp': 1 / 16,
        'tsp': 1 / 48,
        'fl-oz': 1 / 8,
        'ml': 1 / 236.5882365,
        'liter': 1000 / 236.5882365,
        'pint': 2.0,
        'quart': 4.0,
        'gallon': 16.0
    };

    // Base weight = Grams
    const WEIGHT_IN_GRAMS = {
        'g': 1.0,
        'kg': 1000.0,
        'oz': 28.349523,
        'lb': 453.59237
    };

    function isVolumeUnit(unit) {
        return unit in VOLUME_IN_US_CUPS;
    }

    // -------------------------------------------------------------
    // Section 1: Ingredient Density Converter
    // -------------------------------------------------------------
    const ingSelect = document.getElementById('ing-select');
    const ingAmount = document.getElementById('ing-amount');
    const ingFromUnit = document.getElementById('ing-from-unit');
    const ingToUnit = document.getElementById('ing-to-unit');
    const ingResultEl = document.getElementById('ing-result');
    const ingFormulaEl = document.getElementById('ing-formula');

    function convertIngredient() {
        const amount = parseFloat(ingAmount.value);
        if (isNaN(amount) || amount < 0) {
            if (ingResultEl) ingResultEl.innerHTML = '<span style="color: var(--color-text-muted);">Enter a valid quantity</span>';
            if (ingFormulaEl) ingFormulaEl.textContent = '';
            return;
        }

        const ingKey = ingSelect.value;
        const fromUnit = ingFromUnit.value;
        const toUnit = ingToUnit.value;
        const densityData = INGREDIENT_DENSITIES[ingKey] || { name: 'Standard Ingredient', gPerCup: 236.6 };
        const gPerCup = densityData.gPerCup;

        // Convert input to base grams
        let grams = 0;
        if (isVolumeUnit(fromUnit)) {
            const cups = amount * VOLUME_IN_US_CUPS[fromUnit];
            grams = cups * gPerCup;
        } else {
            grams = amount * WEIGHT_IN_GRAMS[fromUnit];
        }

        // Convert base grams to target unit
        let targetAmount = 0;
        if (isVolumeUnit(toUnit)) {
            const cups = grams / gPerCup;
            targetAmount = cups / VOLUME_IN_US_CUPS[toUnit];
        } else {
            targetAmount = grams / WEIGHT_IN_GRAMS[toUnit];
        }

        const formattedTarget = formatNumber(targetAmount);
        const toUnitLabel = ingToUnit.options[ingToUnit.selectedIndex].text;
        const fromUnitLabel = ingFromUnit.options[ingFromUnit.selectedIndex].text;

        if (ingResultEl) {
            ingResultEl.innerHTML = `
                <div style="font-size: 28px; font-weight: 800; color: var(--color-primary);">
                    ${formattedTarget} <span style="font-size: 18px; color: var(--color-text-primary); font-weight: 600;">${toUnitLabel}</span>
                </div>
            `;
        }

        if (ingFormulaEl) {
            ingFormulaEl.textContent = `${amount} ${fromUnitLabel} of ${densityData.name} = ${formattedTarget} ${toUnitLabel} (Bulk density: ${gPerCup} g/US Cup)`;
        }
    }

    function formatNumber(num) {
        if (num === 0) return '0';
        if (num >= 100) return num.toFixed(1);
        if (num >= 10) return num.toFixed(2);
        return parseFloat(num.toFixed(3)).toString();
    }

    if (ingSelect) ingSelect.addEventListener('change', convertIngredient);
    if (ingAmount) ingAmount.addEventListener('input', convertIngredient);
    if (ingFromUnit) ingFromUnit.addEventListener('change', convertIngredient);
    if (ingToUnit) ingToUnit.addEventListener('change', convertIngredient);

    // Swap units button
    const swapBtn = document.getElementById('ing-swap-btn');
    if (swapBtn) {
        swapBtn.addEventListener('click', () => {
            const temp = ingFromUnit.value;
            ingFromUnit.value = ingToUnit.value;
            ingToUnit.value = temp;
            convertIngredient();
        });
    }

    // -------------------------------------------------------------
    // Section 2: Universal Kitchen Volume Ladder
    // -------------------------------------------------------------
    const volAmount = document.getElementById('vol-amount');
    const volUnit = document.getElementById('vol-unit');
    const volTableBody = document.getElementById('vol-table-body');

    function updateVolumeLadder() {
        const val = parseFloat(volAmount.value);
        if (isNaN(val) || val < 0 || !volTableBody) return;

        const baseUnit = volUnit.value;
        const totalCups = val * VOLUME_IN_US_CUPS[baseUnit];

        const volumeLadder = [
            { label: 'US Teaspoons (tsp)', factor: 1 / 48 },
            { label: 'US Tablespoons (tbsp)', factor: 1 / 16 },
            { label: 'US Fluid Ounces (fl oz)', factor: 1 / 8 },
            { label: 'US Cups', factor: 1.0 },
            { label: 'Metric Cups (250 mL)', factor: 250 / 236.5882365 },
            { label: 'Milliliters (mL)', factor: 1 / 236.5882365 },
            { label: 'US Pints', factor: 2.0 },
            { label: 'US Quarts', factor: 4.0 },
            { label: 'Liters (L)', factor: 1000 / 236.5882365 },
            { label: 'US Gallons', factor: 16.0 }
        ];

        volTableBody.innerHTML = '';
        volumeLadder.forEach(item => {
            const converted = totalCups / item.factor;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${item.label}</strong></td>
                <td style="font-weight: 700; color: var(--color-primary);">${formatNumber(converted)}</td>
            `;
            volTableBody.appendChild(row);
        });
    }

    if (volAmount) volAmount.addEventListener('input', updateVolumeLadder);
    if (volUnit) volUnit.addEventListener('change', updateVolumeLadder);

    // -------------------------------------------------------------
    // Section 3: Recipe Servings Multiplier
    // -------------------------------------------------------------
    const origServingsInput = document.getElementById('scaler-orig');
    const targetServingsInput = document.getElementById('scaler-target');
    const factorBadgeEl = document.getElementById('scaler-factor');
    const recipeTextInput = document.getElementById('scaler-recipe-text');
    const recipeOutputEl = document.getElementById('scaler-recipe-output');

    function scaleRecipe() {
        const orig = parseFloat(origServingsInput.value) || 1;
        const target = parseFloat(targetServingsInput.value) || 1;
        const factor = target / orig;

        if (factorBadgeEl) {
            factorBadgeEl.textContent = `${factor.toFixed(2)}x`;
        }

        const rawText = recipeTextInput ? recipeTextInput.value : '';
        if (!rawText.trim() || !recipeOutputEl) return;

        const lines = rawText.split('\n');
        const scaledLines = lines.map(line => {
            if (!line.trim()) return '';
            // Regex to match leading numbers/fractions (e.g. "1 1/2", "2.5", "3/4", "4")
            const match = line.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d*\.?\d+)\s*(.*)/);
            if (match) {
                const rawNum = match[1].trim();
                const rest = match[2];
                const numericVal = parseFractionOrDecimal(rawNum);
                const scaledVal = numericVal * factor;
                return `<strong>${formatScaledNumber(scaledVal)}</strong> ${rest}`;
            }
            return line;
        });

        recipeOutputEl.innerHTML = scaledLines.map(l => `<div>${l}</div>`).join('');
    }

    function parseFractionOrDecimal(str) {
        if (str.includes(' ')) {
            const parts = str.split(' ');
            return parseFloat(parts[0]) + parseFraction(parts[1]);
        }
        if (str.includes('/')) {
            return parseFraction(str);
        }
        return parseFloat(str) || 0;
    }

    function parseFraction(fracStr) {
        const parts = fracStr.split('/');
        if (parts.length === 2 && parseFloat(parts[1]) !== 0) {
            return parseFloat(parts[0]) / parseFloat(parts[1]);
        }
        return 0;
    }

    function formatScaledNumber(num) {
        if (num === 0) return '0';
        // Common kitchen fractions
        const whole = Math.floor(num);
        const rem = num - whole;

        const fractions = [
            { val: 0.125, str: '1/8' },
            { val: 0.25, str: '1/4' },
            { val: 0.333, str: '1/3' },
            { val: 0.5, str: '1/2' },
            { val: 0.666, str: '2/3' },
            { val: 0.75, str: '3/4' }
        ];

        for (let f of fractions) {
            if (Math.abs(rem - f.val) < 0.05) {
                return whole > 0 ? `${whole} ${f.str}` : f.str;
            }
        }

        return num >= 10 ? num.toFixed(1) : parseFloat(num.toFixed(2)).toString();
    }

    if (origServingsInput) origServingsInput.addEventListener('input', scaleRecipe);
    if (targetServingsInput) targetServingsInput.addEventListener('input', scaleRecipe);
    if (recipeTextInput) recipeTextInput.addEventListener('input', scaleRecipe);

    // -------------------------------------------------------------
    // Section 4: Oven Temperature Converter
    // -------------------------------------------------------------
    const ovenF = document.getElementById('oven-f');
    const ovenC = document.getElementById('oven-c');
    const ovenFanC = document.getElementById('oven-fan-c');
    const ovenGas = document.getElementById('oven-gas');
    const ovenDescEl = document.getElementById('oven-desc');

    const GAS_MARKS = [
        { mark: '1/4', f: 225, c: 110, desc: 'Very slow, meringues' },
        { mark: '1/2', f: 250, c: 120, desc: 'Very slow, rich fruit cakes' },
        { mark: '1', f: 275, c: 140, desc: 'Slow, shortbread' },
        { mark: '2', f: 300, c: 150, desc: 'Slow, slow-roasts' },
        { mark: '3', f: 325, c: 165, desc: 'Moderately slow, sponge cakes' },
        { mark: '4', f: 350, c: 177, desc: 'Moderate, standard cakes & cookies' },
        { mark: '5', f: 375, c: 190, desc: 'Moderate, muffins & pies' },
        { mark: '6', f: 400, c: 204, desc: 'Moderately hot, roasting poultry' },
        { mark: '7', f: 425, c: 218, desc: 'Hot, puff pastry & scones' },
        { mark: '8', f: 450, c: 232, desc: 'Very hot, pizza & bread loaves' },
        { mark: '9', f: 475, c: 246, desc: 'Extremely hot, flatbreads' }
    ];

    function updateOvenFromF() {
        const f = parseFloat(ovenF.value);
        if (isNaN(f)) return;
        const c = (f - 32) * (5 / 9);
        const fanC = c - 20;

        ovenC.value = Math.round(c);
        ovenFanC.value = Math.round(fanC);

        // Find closest gas mark
        let closest = GAS_MARKS[0];
        let minDiff = Math.abs(f - closest.f);
        GAS_MARKS.forEach(gm => {
            const diff = Math.abs(f - gm.f);
            if (diff < minDiff) {
                minDiff = diff;
                closest = gm;
            }
        });

        ovenGas.value = closest.mark;
        if (ovenDescEl) ovenDescEl.textContent = `Gas Mark ${closest.mark}: ${closest.desc}`;
    }

    function updateOvenFromC() {
        const c = parseFloat(ovenC.value);
        if (isNaN(c)) return;
        const f = (c * (9 / 5)) + 32;
        ovenF.value = Math.round(f);
        updateOvenFromF();
    }

    if (ovenF) ovenF.addEventListener('input', updateOvenFromF);
    if (ovenC) ovenC.addEventListener('input', updateOvenFromC);
    if (ovenGas) {
        ovenGas.addEventListener('change', () => {
            const gm = GAS_MARKS.find(g => g.mark === ovenGas.value);
            if (gm) {
                ovenF.value = gm.f;
                updateOvenFromF();
            }
        });
    }

    // Run initial calculations
    convertIngredient();
    updateVolumeLadder();
    scaleRecipe();
    updateOvenFromF();
});
