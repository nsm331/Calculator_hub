/**
 * calculator_net - Modular Percentage Calculator Engine
 * Pure Client-Side Vanilla JavaScript (Zero Page Reload)
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // Tool 1: What is X% of Y?
    // -------------------------------------------------------------------------
    const formTool1 = document.getElementById('percent-tool-1');
    const clearBtn1 = document.getElementById('btn-clear-p1');
    const resultBox1 = document.getElementById('p1-result');
    const answer1 = document.getElementById('p1-answer');
    const steps1 = document.getElementById('p1-steps');

    function calcTool1(e) {
        if (e) e.preventDefault();

        const x = parseFloat(document.getElementById('p1-percent').value);
        const y = parseFloat(document.getElementById('p1-value').value);

        if (isNaN(x) || isNaN(y)) {
            alert('Please enter valid numeric values for Tool 1.');
            return;
        }

        const res = (x / 100) * y;
        const roundedRes = Math.round(res * 10000) / 10000;
        const decimal = (x / 100).toFixed(4).replace(/\.?0+$/, '');

        answer1.textContent = roundedRes.toLocaleString('en-US');
        steps1.innerHTML = `Calculation: (${x} &divide; 100) &times; ${y} = ${decimal} &times; ${y} = <strong>${roundedRes}</strong>`;
        resultBox1.style.display = 'block';
    }

    if (formTool1) formTool1.addEventListener('submit', calcTool1);
    if (clearBtn1) {
        clearBtn1.addEventListener('click', () => {
            document.getElementById('p1-percent').value = '';
            document.getElementById('p1-value').value = '';
            resultBox1.style.display = 'none';
        });
    }

    // -------------------------------------------------------------------------
    // Tool 2: X is what % of Y?
    // -------------------------------------------------------------------------
    const formTool2 = document.getElementById('percent-tool-2');
    const clearBtn2 = document.getElementById('btn-clear-p2');
    const resultBox2 = document.getElementById('p2-result');
    const answer2 = document.getElementById('p2-answer');
    const steps2 = document.getElementById('p2-steps');

    function calcTool2(e) {
        if (e) e.preventDefault();

        const x = parseFloat(document.getElementById('p2-value-x').value);
        const y = parseFloat(document.getElementById('p2-value-y').value);

        if (isNaN(x) || isNaN(y) || y === 0) {
            alert('Please enter valid numeric values with a non-zero denominator for Tool 2.');
            return;
        }

        const res = (x / y) * 100;
        const roundedRes = Math.round(res * 1000) / 1000;

        answer2.textContent = `${roundedRes}%`;
        steps2.innerHTML = `Calculation: (${x} &divide; ${y}) &times; 100% = ${(x / y).toFixed(4)} &times; 100% = <strong>${roundedRes}%</strong>`;
        resultBox2.style.display = 'block';
    }

    if (formTool2) formTool2.addEventListener('submit', calcTool2);
    if (clearBtn2) {
        clearBtn2.addEventListener('click', () => {
            document.getElementById('p2-value-x').value = '';
            document.getElementById('p2-value-y').value = '';
            resultBox2.style.display = 'none';
        });
    }

    // -------------------------------------------------------------------------
    // Tool 3: Percentage Increase / Decrease from X to Y
    // -------------------------------------------------------------------------
    const formTool3 = document.getElementById('percent-tool-3');
    const clearBtn3 = document.getElementById('btn-clear-p3');
    const resultBox3 = document.getElementById('p3-result');
    const answer3 = document.getElementById('p3-answer');
    const changeType3 = document.getElementById('p3-change-type');
    const steps3 = document.getElementById('p3-steps');

    function calcTool3(e) {
        if (e) e.preventDefault();

        const v1 = parseFloat(document.getElementById('p3-from').value);
        const v2 = parseFloat(document.getElementById('p3-to').value);

        if (isNaN(v1) || isNaN(v2) || v1 === 0) {
            alert('Please enter valid starting and ending values with a non-zero starting baseline for Tool 3.');
            return;
        }

        const diff = v2 - v1;
        const pctChange = (diff / Math.abs(v1)) * 100;
        const roundedChange = Math.round(pctChange * 1000) / 1000;

        const isIncrease = diff >= 0;
        const sign = isIncrease ? '+' : '';

        answer3.textContent = `${sign}${roundedChange}%`;

        if (isIncrease) {
            changeType3.textContent = 'Increase';
            changeType3.className = 'change-tag change-increase';
        } else {
            changeType3.textContent = 'Decrease';
            changeType3.className = 'change-tag change-decrease';
        }

        steps3.innerHTML = `Calculation: ((${v2} - ${v1}) &divide; |${v1}|) &times; 100% = (${diff} &divide; ${Math.abs(v1)}) &times; 100% = <strong>${sign}${roundedChange}%</strong>`;
        resultBox3.style.display = 'block';
    }

    if (formTool3) formTool3.addEventListener('submit', calcTool3);
    if (clearBtn3) {
        clearBtn3.addEventListener('click', () => {
            document.getElementById('p3-from').value = '';
            document.getElementById('p3-to').value = '';
            resultBox3.style.display = 'none';
        });
    }

    // Auto-calculate initial states for demonstration
    calcTool1(null);
    calcTool2(null);
    calcTool3(null);
});
