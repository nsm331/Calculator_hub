/**
 * Time & Duration Calculator Engine
 * 100% Client-Side Vanilla JavaScript
 * Zero reload. Sexagesimal arithmetic, timesheets, and decimal hours.
 */

(function () {
    'use strict';

    var currentMode = 'between'; // 'between', 'addsub', 'sum'

    // Mode Buttons
    var modeBtnBetween = document.getElementById('mode-btn-between');
    var modeBtnAddsub = document.getElementById('mode-btn-addsub');
    var modeBtnSum = document.getElementById('mode-btn-sum');

    var panelBetween = document.getElementById('panel-mode-between');
    var panelAddsub = document.getElementById('panel-mode-addsub');
    var panelSum = document.getElementById('panel-mode-sum');

    // Mode 1: Between Elements
    var timeStartInput = document.getElementById('time-start');
    var dateStartInput = document.getElementById('date-start');
    var timeEndInput = document.getElementById('time-end');
    var dateEndInput = document.getElementById('date-end');
    var btnStartNow = document.getElementById('btn-start-now');
    var btnEndNow = document.getElementById('btn-end-now');
    var btnCalcBetween = document.getElementById('btn-calc-between');
    var btnResetBetween = document.getElementById('btn-reset-between');

    // Mode 2: Add/Sub Elements
    var addsubStartTime = document.getElementById('addsub-start-time');
    var addsubStartDate = document.getElementById('addsub-start-date');
    var opAdd = document.getElementById('op-add');
    var opSubtract = document.getElementById('op-subtract');
    var asDays = document.getElementById('as-days');
    var asHours = document.getElementById('as-hours');
    var asMinutes = document.getElementById('as-minutes');
    var asSeconds = document.getElementById('as-seconds');
    var presetChips = document.querySelectorAll('.time-preset-chip');
    var btnCalcAddsub = document.getElementById('btn-calc-addsub');
    var btnResetAddsub = document.getElementById('btn-reset-addsub');

    // Mode 3: Sum Elements
    var sumRowsContainer = document.getElementById('sum-rows-container');
    var btnAddSumRow = document.getElementById('btn-add-sum-row');
    var btnCalcSum = document.getElementById('btn-calc-sum');
    var btnResetSum = document.getElementById('btn-reset-sum');

    // Output Elements
    var heroLabelEl = document.getElementById('time-hero-label');
    var heroValEl = document.getElementById('time-hero-val');
    var heroSubEl = document.getElementById('time-hero-sub');
    var decimalHoursEl = document.getElementById('time-decimal-hours');
    var totalMinutesEl = document.getElementById('time-total-minutes');
    var totalSecondsEl = document.getElementById('time-total-seconds');
    var elapsedDaysEl = document.getElementById('time-elapsed-days');
    var portionDayEl = document.getElementById('time-portion-day');
    var targetMomentEl = document.getElementById('time-target-moment');

    function getTodayString() {
        var d = new Date();
        var yyyy = d.getFullYear();
        var mm = String(d.getMonth() + 1).padStart(2, '0');
        var dd = String(d.getDate()).padStart(2, '0');
        return yyyy + '-' + mm + '-' + dd;
    }

    function getNowTimeString() {
        var d = new Date();
        var hh = String(d.getHours()).padStart(2, '0');
        var mm = String(d.getMinutes()).padStart(2, '0');
        var ss = String(d.getSeconds()).padStart(2, '0');
        return hh + ':' + mm + ':' + ss;
    }

    function initDates() {
        var today = getTodayString();
        if (dateStartInput && !dateStartInput.value) dateStartInput.value = today;
        if (dateEndInput && !dateEndInput.value) dateEndInput.value = today;
        if (addsubStartDate && !addsubStartDate.value) addsubStartDate.value = today;
    }

    function setMode(mode) {
        currentMode = mode;
        [modeBtnBetween, modeBtnAddsub, modeBtnSum].forEach(function (btn) {
            btn.classList.remove('active');
        });
        panelBetween.style.display = 'none';
        panelAddsub.style.display = 'none';
        panelSum.style.display = 'none';

        if (mode === 'between') {
            modeBtnBetween.classList.add('active');
            panelBetween.style.display = 'block';
            calculateBetween();
        } else if (mode === 'addsub') {
            modeBtnAddsub.classList.add('active');
            panelAddsub.style.display = 'block';
            calculateAddSub();
        } else if (mode === 'sum') {
            modeBtnSum.classList.add('active');
            panelSum.style.display = 'block';
            calculateSum();
        }
    }

    function formatDurationString(totalSeconds) {
        var isNegative = totalSeconds < 0;
        totalSeconds = Math.abs(totalSeconds);

        var days = Math.floor(totalSeconds / 86400);
        var rem = totalSeconds % 86400;
        var hours = Math.floor(rem / 3600);
        rem = rem % 3600;
        var minutes = Math.floor(rem / 60);
        var seconds = rem % 60;

        var parts = [];
        if (days > 0) parts.push(days + (days === 1 ? ' day' : ' days'));
        if (hours > 0 || days > 0) parts.push(hours + (hours === 1 ? ' hour' : ' hours'));
        parts.push(minutes + (minutes === 1 ? ' minute' : ' minutes'));
        parts.push(seconds + (seconds === 1 ? ' second' : ' seconds'));

        return (isNegative ? '- ' : '') + parts.join(', ');
    }

    function updateResultDisplay(totalSeconds, heroTitle, targetMomentStr) {
        var isNegative = totalSeconds < 0;
        var absSec = Math.abs(totalSeconds);

        heroLabelEl.textContent = heroTitle || 'Total Elapsed Duration';
        heroValEl.textContent = formatDurationString(totalSeconds);

        var decHours = (absSec / 3600).toFixed(4);
        heroSubEl.textContent = 'Equivalent to ' + (isNegative ? '-' : '') + decHours + ' decimal hours';

        decimalHoursEl.textContent = (isNegative ? '-' : '') + decHours + ' hrs';
        totalMinutesEl.textContent = (isNegative ? '-' : '') + (absSec / 60).toFixed(2) + ' minutes';
        totalSecondsEl.textContent = (isNegative ? '-' : '') + absSec.toLocaleString() + ' seconds';
        elapsedDaysEl.textContent = (isNegative ? '-' : '') + (absSec / 86400).toFixed(3) + ' Days';

        var pctDay = ((absSec / 86400) * 100).toFixed(1);
        portionDayEl.textContent = pctDay + '% of 24h day';

        targetMomentEl.textContent = targetMomentStr || 'N/A';
    }

    // --- Mode 1: Duration Between ---
    function calculateBetween() {
        var dStartStr = dateStartInput.value || getTodayString();
        var tStartStr = timeStartInput.value || '09:00';
        var dEndStr = dateEndInput.value || getTodayString();
        var tEndStr = timeEndInput.value || '17:45';

        // Parse datetime strings
        var dtStart = new Date(dStartStr + 'T' + (tStartStr.length === 5 ? tStartStr + ':00' : tStartStr));
        var dtEnd = new Date(dEndStr + 'T' + (tEndStr.length === 5 ? tEndStr + ':00' : tEndStr));

        if (isNaN(dtStart.getTime()) || isNaN(dtEnd.getTime())) return;

        // If same date and end < start, assume next day if dates were not deliberately changed
        if (dStartStr === dEndStr && dtEnd < dtStart) {
            dtEnd.setDate(dtEnd.getDate() + 1);
        }

        var diffMs = dtEnd.getTime() - dtStart.getTime();
        var totalSec = Math.floor(diffMs / 1000);

        var endFormatted = dtEnd.toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric'
        }) + ', ' + dtEnd.toLocaleTimeString('en-US');

        updateResultDisplay(totalSec, 'Total Elapsed Duration', endFormatted);
    }

    // --- Mode 2: Add or Subtract Time ---
    function calculateAddSub() {
        var dStartStr = addsubStartDate.value || getTodayString();
        var tStartStr = addsubStartTime.value || '08:30';
        var isAdd = opAdd.checked;

        var d = parseInt(asDays.value, 10) || 0;
        var h = parseInt(asHours.value, 10) || 0;
        var m = parseInt(asMinutes.value, 10) || 0;
        var s = parseInt(asSeconds.value, 10) || 0;

        var changeSeconds = (d * 86400) + (h * 3600) + (m * 60) + s;
        if (!isAdd) changeSeconds = -changeSeconds;

        var dtStart = new Date(dStartStr + 'T' + (tStartStr.length === 5 ? tStartStr + ':00' : tStartStr));
        if (isNaN(dtStart.getTime())) return;

        var dtResult = new Date(dtStart.getTime() + (changeSeconds * 1000));
        var targetStr = dtResult.toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
        }) + ' at ' + dtResult.toLocaleTimeString('en-US');

        updateResultDisplay(
            Math.abs(changeSeconds),
            isAdd ? 'Time Added (Interval)' : 'Time Subtracted (Interval)',
            'Resulting Moment: ' + targetStr
        );
    }

    // --- Mode 3: Timesheet / Duration Sum ---
    function initSumRows() {
        sumRowsContainer.innerHTML = '';
        addSumRow(3, 30, 0, 'Morning Project Task');
        addSumRow(4, 15, 0, 'Afternoon Operations');
        addSumRow(1, 0, 0, 'Code Review & Deployment');
    }

    function addSumRow(h, m, s, label) {
        var rowId = 'sum-row-' + Math.random().toString(36).substr(2, 6);
        var div = document.createElement('div');
        div.className = 'form-row sum-item-row';
        div.id = rowId;
        div.style.alignItems = 'center';
        div.style.marginBottom = '0.5rem';

        div.innerHTML =
            '<div class="form-group" style="flex: 2;">' +
                '<input type="text" class="form-control sum-label" value="' + (label || 'Task Interval') + '" placeholder="Task Description">' +
            '</div>' +
            '<div class="form-group" style="flex: 1;">' +
                '<div class="input-with-addon">' +
                    '<input type="number" class="form-control sum-h" value="' + (h || 0) + '" min="0" max="500">' +
                    '<span class="input-addon">h</span>' +
                '</div>' +
            '</div>' +
            '<div class="form-group" style="flex: 1;">' +
                '<div class="input-with-addon">' +
                    '<input type="number" class="form-control sum-m" value="' + (m || 0) + '" min="0" max="59">' +
                    '<span class="input-addon">m</span>' +
                '</div>' +
            '</div>' +
            '<div class="form-group" style="flex: 1;">' +
                '<div class="input-with-addon">' +
                    '<input type="number" class="form-control sum-s" value="' + (s || 0) + '" min="0" max="59">' +
                    '<span class="input-addon">s</span>' +
                '</div>' +
            '</div>' +
            '<button type="button" class="btn btn-sm btn-outline-danger btn-remove-row" style="margin-bottom: 0.5rem;" title="Remove row">&times;</button>';

        div.querySelector('.btn-remove-row').addEventListener('click', function () {
            div.remove();
            calculateSum();
        });

        div.querySelectorAll('input').forEach(function (inp) {
            inp.addEventListener('input', calculateSum);
            inp.addEventListener('change', calculateSum);
        });

        sumRowsContainer.appendChild(div);
    }

    function calculateSum() {
        var rows = sumRowsContainer.querySelectorAll('.sum-item-row');
        var totalSec = 0;

        rows.forEach(function (row) {
            var h = parseInt(row.querySelector('.sum-h').value, 10) || 0;
            var m = parseInt(row.querySelector('.sum-m').value, 10) || 0;
            var s = parseInt(row.querySelector('.sum-s').value, 10) || 0;
            totalSec += (h * 3600) + (m * 60) + s;
        });

        updateResultDisplay(totalSec, 'Cumulative Summed Duration', rows.length + ' Total Intervals Recorded');
    }

    // Attach Event Handlers
    modeBtnBetween.addEventListener('click', function () { setMode('between'); });
    modeBtnAddsub.addEventListener('click', function () { setMode('addsub'); });
    modeBtnSum.addEventListener('click', function () { setMode('sum'); });

    // Mode 1 listeners
    [timeStartInput, dateStartInput, timeEndInput, dateEndInput].forEach(function (el) {
        if (el) {
            el.addEventListener('input', calculateBetween);
            el.addEventListener('change', calculateBetween);
        }
    });

    if (btnStartNow) {
        btnStartNow.addEventListener('click', function () {
            timeStartInput.value = getNowTimeString();
            dateStartInput.value = getTodayString();
            calculateBetween();
        });
    }

    if (btnEndNow) {
        btnEndNow.addEventListener('click', function () {
            timeEndInput.value = getNowTimeString();
            dateEndInput.value = getTodayString();
            calculateBetween();
        });
    }

    if (btnCalcBetween) btnCalcBetween.addEventListener('click', calculateBetween);
    if (btnResetBetween) {
        btnResetBetween.addEventListener('click', function () {
            timeStartInput.value = '09:00:00';
            timeEndInput.value = '17:45:00';
            initDates();
            calculateBetween();
        });
    }

    // Mode 2 listeners
    [addsubStartTime, addsubStartDate, opAdd, opSubtract, asDays, asHours, asMinutes, asSeconds].forEach(function (el) {
        if (el) {
            el.addEventListener('input', calculateAddSub);
            el.addEventListener('change', calculateAddSub);
        }
    });

    presetChips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            var d = parseInt(this.dataset.d || '0', 10);
            var h = parseInt(this.dataset.h || '0', 10);
            var m = parseInt(this.dataset.m || '0', 10);
            asDays.value = d;
            asHours.value = h;
            asMinutes.value = m;
            asSeconds.value = 0;
            calculateAddSub();
        });
    });

    if (btnCalcAddsub) btnCalcAddsub.addEventListener('click', calculateAddSub);
    if (btnResetAddsub) {
        btnResetAddsub.addEventListener('click', function () {
            addsubStartTime.value = '08:30:00';
            asDays.value = 0;
            asHours.value = 8;
            asMinutes.value = 30;
            asSeconds.value = 0;
            opAdd.checked = true;
            initDates();
            calculateAddSub();
        });
    }

    // Mode 3 listeners
    if (btnAddSumRow) {
        btnAddSumRow.addEventListener('click', function () {
            addSumRow(1, 0, 0, 'Additional Work Block');
            calculateSum();
        });
    }
    if (btnCalcSum) btnCalcSum.addEventListener('click', calculateSum);
    if (btnResetSum) {
        btnResetSum.addEventListener('click', function () {
            initSumRows();
            calculateSum();
        });
    }

    // Initialization
    initDates();
    initSumRows();
    setMode('between');
})();
