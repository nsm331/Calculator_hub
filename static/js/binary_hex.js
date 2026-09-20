/**
 * Binary & Hexadecimal Converter Engine
 * 100% Client-Side Vanilla JavaScript with BigInt precision
 * Two-way live synchronization across Decimal, Binary, Hex, Octal, ASCII, and Bit Matrix.
 */

(function () {
    'use strict';

    var currentBitLength = 16;
    var currentValue = 437n; // Internal BigInt representation

    // DOM Elements
    var bitPills = document.querySelectorAll('.unit-toggle-pill[data-bits]');
    var decimalInput = document.getElementById('num-decimal');
    var binaryInput = document.getElementById('num-binary');
    var hexInput = document.getElementById('num-hex');
    var octalInput = document.getElementById('num-octal');
    var asciiInput = document.getElementById('num-ascii');

    var matrixContainer = document.getElementById('bit-matrix-container');
    var clearBtn = document.getElementById('bit-clear-btn');
    var invertBtn = document.getElementById('bit-invert-btn');
    var fillBtn = document.getElementById('bit-fill-btn');

    var signedValEl = document.getElementById('bit-signed-val');
    var unsignedValEl = document.getElementById('bit-unsigned-val');
    var hammingValEl = document.getElementById('bit-hamming-val');
    var notValEl = document.getElementById('bit-not-val');
    var leadingZerosEl = document.getElementById('bit-leading-zeros');
    var byteCountEl = document.getElementById('bit-byte-count');
    var stepsListEl = document.getElementById('base-steps-list');

    var copyButtons = document.querySelectorAll('.copy-btn');

    // Bitwise mask helper
    function getBitMask(bits) {
        return (1n << BigInt(bits)) - 1n;
    }

    function formatBinaryNibbles(binStr, totalBits) {
        while (binStr.length < totalBits) {
            binStr = '0' + binStr;
        }
        var chunks = [];
        for (var i = 0; i < binStr.length; i += 4) {
            chunks.push(binStr.substr(i, 4));
        }
        return chunks.join(' ');
    }

    function updateFromValue(sourceField) {
        var mask = getBitMask(currentBitLength);
        currentValue = currentValue & mask;

        var unsignedVal = currentValue;
        var totalBits = currentBitLength;

        // Two's complement signed evaluation
        var signBit = 1n << BigInt(totalBits - 1);
        var signedVal = unsignedVal;
        if ((unsignedVal & signBit) !== 0n) {
            signedVal = unsignedVal - (1n << BigInt(totalBits));
        }

        // 1. Decimal field
        if (sourceField !== 'decimal') {
            decimalInput.value = unsignedVal.toString(10);
        }

        // 2. Binary field
        var binStr = unsignedVal.toString(2);
        if (sourceField !== 'binary') {
            binaryInput.value = formatBinaryNibbles(binStr, totalBits);
        }

        // 3. Hexadecimal field
        var hexStr = unsignedVal.toString(16).toUpperCase();
        var targetHexLen = totalBits / 4;
        while (hexStr.length < targetHexLen) {
            hexStr = '0' + hexStr;
        }
        if (sourceField !== 'hex') {
            hexInput.value = hexStr;
        }

        // 4. Octal field
        if (sourceField !== 'octal') {
            octalInput.value = unsignedVal.toString(8);
        }

        // 5. ASCII text preview
        var charCode = Number(unsignedVal & 0xFFn);
        if (charCode >= 32 && charCode <= 126) {
            asciiInput.value = String.fromCharCode(charCode) + ' (ASCII ' + charCode + ')';
        } else if (charCode === 0) {
            asciiInput.value = '[NUL / Null Byte]';
        } else {
            asciiInput.value = '[Non-printable: ' + charCode + ']';
        }

        // 6. Metrics & Two's Complement
        signedValEl.textContent = (signedVal >= 0n ? '+' : '') + signedVal.toString(10);
        unsignedValEl.textContent = unsignedVal.toString(10);

        // Hamming Weight (count 1s)
        var setBits = 0;
        var fullBin = binStr;
        for (var b = 0; b < fullBin.length; b++) {
            if (fullBin[b] === '1') setBits++;
        }
        var pct = ((setBits / totalBits) * 100).toFixed(1);
        hammingValEl.textContent = setBits + ' bits set (' + pct + '%)';

        // Inverted NOT
        var notVal = (~unsignedVal) & mask;
        notValEl.textContent = '0x' + notVal.toString(16).toUpperCase() + ' (' + notVal.toString(10) + ')';

        // Leading zeros
        var leadingZeros = totalBits - binStr.length;
        if (unsignedVal === 0n) leadingZeros = totalBits;
        leadingZerosEl.textContent = leadingZeros + ' leading zeros';

        // Byte alignment
        byteCountEl.textContent = (totalBits / 8) + ' Byte' + (totalBits > 8 ? 's' : '') + ' (' + totalBits + ' bits)';

        // 7. Render Interactive Bit Matrix
        renderBitMatrix(unsignedVal, totalBits);

        // 8. Render Derivation Steps
        renderDerivationSteps(unsignedVal, totalBits);
    }

    function renderBitMatrix(val, totalBits) {
        if (!matrixContainer) return;
        matrixContainer.innerHTML = '';

        for (var i = totalBits - 1; i >= 0; i--) {
            var bitMask = 1n << BigInt(i);
            var isSet = (val & bitMask) !== 0n;

            var cell = document.createElement('button');
            cell.type = 'button';
            cell.className = 'bit-cell' + (isSet ? ' bit-active' : '');
            cell.dataset.bitIndex = i;

            var labelSpan = document.createElement('span');
            labelSpan.className = 'bit-index-label';
            labelSpan.textContent = 'b' + i;

            var valSpan = document.createElement('span');
            valSpan.className = 'bit-val-digit';
            valSpan.textContent = isSet ? '1' : '0';

            cell.appendChild(labelSpan);
            cell.appendChild(valSpan);

            cell.addEventListener('click', function () {
                var idx = BigInt(this.dataset.bitIndex);
                currentValue = currentValue ^ (1n << idx);
                updateFromValue(null);
            });

            matrixContainer.appendChild(cell);
        }
    }

    function renderDerivationSteps(val, totalBits) {
        if (!stepsListEl) return;
        var html = '';

        // Step 1: Decimal to Binary Division
        html += '<li><strong>Decimal to Binary via Division by 2:</strong> ';
        if (val === 0n) {
            html += '$0_{10} = 0_2$</li>';
        } else {
            var temp = val;
            var divisions = [];
            var count = 0;
            while (temp > 0n && count < 8) {
                var q = temp / 2n;
                var rem = temp % 2n;
                divisions.push(temp.toString() + ' \\div 2 = ' + q.toString() + ' \\text{ R } ' + rem.toString());
                temp = q;
                count++;
            }
            if (temp > 0n) divisions.push('\\dots');
            html += '$$\\begin{aligned}' + divisions.join(' \\\\ ') + '\\end{aligned}$$ Reading remainders in reverse yields the binary representation.</li>';
        }

        // Step 2: Nibble Grouping to Hexadecimal
        var binPadded = val.toString(2);
        while (binPadded.length < totalBits) binPadded = '0' + binPadded;
        var nibbleList = [];
        var hexList = [];
        for (var j = 0; j < binPadded.length; j += 4) {
            var nib = binPadded.substr(j, 4);
            var h = parseInt(nib, 2).toString(16).toUpperCase();
            nibbleList.push('<code>' + nib + '</code>');
            hexList.push('<code>' + h + '</code>');
        }

        html += '<li><strong>4-Bit Nibble Grouping to Hexadecimal:</strong><br>' +
            'Binary nibbles: ' + nibbleList.join(' &bull; ') + '<br>' +
            'Hex equivalents: ' + hexList.join(' &bull; ') + ' &rarr; <strong>0x' + val.toString(16).toUpperCase() + '</strong></li>';

        stepsListEl.innerHTML = html;
        if (window.renderMathInElement) {
            window.renderMathInElement(stepsListEl, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false }
                ]
            });
        }
    }

    // Input Event Handlers
    decimalInput.addEventListener('input', function () {
        var clean = this.value.trim();
        if (clean === '' || clean === '-') {
            currentValue = 0n;
            updateFromValue('decimal');
            return;
        }
        try {
            var num = BigInt(clean);
            var mask = getBitMask(currentBitLength);
            if (num < 0n) {
                num = (1n << BigInt(currentBitLength)) + num;
            }
            currentValue = num & mask;
            updateFromValue('decimal');
        } catch (e) {
            // Invalid input
        }
    });

    binaryInput.addEventListener('input', function () {
        var clean = this.value.replace(/\s+/g, '');
        if (/^[01]*$/.test(clean)) {
            currentValue = clean === '' ? 0n : BigInt('0b' + clean);
            updateFromValue('binary');
        }
    });

    hexInput.addEventListener('input', function () {
        var clean = this.value.replace(/^0x/i, '').replace(/\s+/g, '');
        if (/^[0-9a-fA-F]*$/.test(clean)) {
            currentValue = clean === '' ? 0n : BigInt('0x' + clean);
            updateFromValue('hex');
        }
    });

    octalInput.addEventListener('input', function () {
        var clean = this.value.replace(/^0o/i, '').replace(/\s+/g, '');
        if (/^[0-7]*$/.test(clean)) {
            currentValue = clean === '' ? 0n : BigInt('0o' + clean);
            updateFromValue('octal');
        }
    });

    // Bit Depth Selector
    bitPills.forEach(function (pill) {
        pill.addEventListener('click', function () {
            bitPills.forEach(function (p) { p.classList.remove('active'); });
            this.classList.add('active');
            currentBitLength = parseInt(this.dataset.bits, 10);
            updateFromValue(null);
        });
    });

    // Bitwise Controls
    if (clearBtn) clearBtn.addEventListener('click', function () {
        currentValue = 0n;
        updateFromValue(null);
    });

    if (invertBtn) invertBtn.addEventListener('click', function () {
        var mask = getBitMask(currentBitLength);
        currentValue = (~currentValue) & mask;
        updateFromValue(null);
    });

    if (fillBtn) fillBtn.addEventListener('click', function () {
        currentValue = getBitMask(currentBitLength);
        updateFromValue(null);
    });

    // Copy to clipboard
    copyButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetId = this.dataset.target;
            var targetInput = document.getElementById(targetId);
            if (targetInput) {
                navigator.clipboard.writeText(targetInput.value).then(function () {
                    btn.textContent = '✓';
                    setTimeout(function () { btn.innerHTML = '&#128203;'; }, 1200);
                });
            }
        });
    });

    // Initial run
    updateFromValue(null);
})();
