/**
 * IPv4 Subnet Mask Calculator - Pure Vanilla JavaScript Engine
 * 32-bit unsigned binary boolean logic, CIDR parsing, wildcard masks,
 * RFC 1918 private scope classification, and VLSM sub-division tables.
 */

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const ipInput = document.getElementById('subnet-ip');
    const cidrSelect = document.getElementById('subnet-cidr');
    const validationMsg = document.getElementById('ip-validation-msg');
    const calcBtn = document.getElementById('subnet-calc-btn');
    const resetBtn = document.getElementById('subnet-reset-btn');
    const presetBtns = document.querySelectorAll('.subnet-preset-btn');

    // Result DOM Elements
    const resNetworkCidr = document.getElementById('res-network-cidr');
    const resHostRange = document.getElementById('res-host-range');
    const resMask = document.getElementById('res-mask');
    const resWildcard = document.getElementById('res-wildcard');
    const resBroadcast = document.getElementById('res-broadcast');
    const resUsableHosts = document.getElementById('res-usable-hosts');
    const resTotalAddresses = document.getElementById('res-total-addresses');
    const resIpClass = document.getElementById('res-ip-class');
    const resIpScope = document.getElementById('res-ip-scope');
    const resPrefixRatio = document.getElementById('res-prefix-ratio');

    const binIp = document.getElementById('bin-ip');
    const binMask = document.getElementById('bin-mask');
    const binNet = document.getElementById('bin-net');
    const binBcast = document.getElementById('bin-bcast');
    const subdivisionTableBody = document.getElementById('subdivision-table-body');

    // Helper: Convert 32-bit unsigned int to dotted decimal string
    function intToIp(num) {
        return [
            (num >>> 24) & 255,
            (num >>> 16) & 255,
            (num >>> 8) & 255,
            num & 255
        ].join('.');
    }

    // Helper: Convert dotted decimal string to 32-bit unsigned int
    function ipToInt(ipStr) {
        const parts = ipStr.trim().split('.');
        if (parts.length !== 4) return null;
        let num = 0;
        for (let i = 0; i < 4; i++) {
            const octet = parseInt(parts[i], 10);
            if (isNaN(octet) || octet < 0 || octet > 255) return null;
            num = ((num << 8) | octet) >>> 0;
        }
        return num;
    }

    // Helper: Create mask integer from CIDR prefix (1 to 32)
    function cidrToMaskInt(cidr) {
        if (cidr === 0) return 0;
        if (cidr >= 32) return 0xFFFFFFFF >>> 0;
        return ((0xFFFFFFFF << (32 - cidr)) & 0xFFFFFFFF) >>> 0;
    }

    // Helper: Convert integer to 32-bit binary formatted with octet dots
    function intToBinaryString(num) {
        const octets = [
            ((num >>> 24) & 255).toString(2).padStart(8, '0'),
            ((num >>> 16) & 255).toString(2).padStart(8, '0'),
            ((num >>> 8) & 255).toString(2).padStart(8, '0'),
            (num & 255).toString(2).padStart(8, '0')
        ];
        return octets.join('.');
    }

    // Populate CIDR Dropdown (/1 to /32)
    function populateCidrOptions() {
        let optionsHtml = '';
        for (let p = 32; p >= 1; p--) {
            const maskInt = cidrToMaskInt(p);
            const maskStr = intToIp(maskInt);
            const isSelected = p === 24 ? 'selected' : '';
            optionsHtml += `<option value="${p}" ${isSelected}>/${p} &mdash; ${maskStr}</option>`;
        }
        cidrSelect.innerHTML = optionsHtml;
    }

    // Classify IP Class & Scope
    function classifyIp(firstOctet, ipInt) {
        let ipClass = 'Class C';
        if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'Class A';
        else if (firstOctet === 127) ipClass = 'Loopback';
        else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'Class B';
        else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'Class C';
        else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'Class D (Multicast)';
        else if (firstOctet >= 240) ipClass = 'Class E (Reserved)';

        // RFC 1918 Scope check
        const octet1 = (ipInt >>> 24) & 255;
        const octet2 = (ipInt >>> 16) & 255;

        let scope = 'Public Internet Routable';
        if (octet1 === 10) {
            scope = 'Private Non-Routable (RFC 1918)';
        } else if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) {
            scope = 'Private Non-Routable (RFC 1918)';
        } else if (octet1 === 192 && octet2 === 168) {
            scope = 'Private Non-Routable (RFC 1918)';
        } else if (octet1 === 127) {
            scope = 'Internal Localhost Loopback';
        } else if (octet1 === 169 && octet2 === 254) {
            scope = 'Link-Local APIPA (RFC 3927)';
        } else if (octet1 >= 224 && octet1 <= 239) {
            scope = 'Multicast Group Routing';
        }

        return { ipClass, scope };
    }

    // Main Calculation Function
    function calculateSubnet() {
        const ipStr = ipInput.value.trim();
        const ipInt = ipToInt(ipStr);

        if (ipInt === null) {
            validationMsg.textContent = '⚠️ Invalid IPv4 format! Use 4 decimal octets (0–255) separated by dots.';
            validationMsg.style.color = '#ef4444';
            return;
        } else {
            validationMsg.textContent = '✓ Valid IPv4 address format.';
            validationMsg.style.color = '#10b981';
        }

        const cidr = parseInt(cidrSelect.value, 10) || 24;
        const maskInt = cidrToMaskInt(cidr);
        const wildcardInt = ((~maskInt) & 0xFFFFFFFF) >>> 0;

        const networkInt = (ipInt & maskInt) >>> 0;
        const broadcastInt = (ipInt | wildcardInt) >>> 0;

        const networkStr = intToIp(networkInt);
        const broadcastStr = intToIp(broadcastInt);
        const maskStr = intToIp(maskInt);
        const wildcardStr = intToIp(wildcardInt);

        // Host Calculations
        const hostBits = 32 - cidr;
        const totalAddresses = Math.pow(2, hostBits);
        let usableHosts = 0;
        let firstUsableStr = '';
        let lastUsableStr = '';

        if (cidr === 32) {
            usableHosts = 1;
            firstUsableStr = networkStr;
            lastUsableStr = networkStr;
            resHostRange.textContent = `Single Host: ${networkStr}`;
        } else if (cidr === 31) {
            // RFC 3021 Point-to-Point
            usableHosts = 2;
            firstUsableStr = networkStr;
            lastUsableStr = broadcastStr;
            resHostRange.textContent = `Point-to-Point (RFC 3021): ${firstUsableStr} — ${lastUsableStr}`;
        } else {
            usableHosts = Math.max(0, totalAddresses - 2);
            firstUsableStr = intToIp((networkInt + 1) >>> 0);
            lastUsableStr = intToIp((broadcastInt - 1) >>> 0);
            resHostRange.textContent = `Usable Hosts: ${firstUsableStr} — ${lastUsableStr}`;
        }

        // Render Hero
        resNetworkCidr.textContent = `${networkStr} /${cidr}`;

        // Render Metric Cards
        resMask.textContent = maskStr;
        resWildcard.textContent = wildcardStr;
        resBroadcast.textContent = broadcastStr;
        resUsableHosts.textContent = `${usableHosts.toLocaleString('en-US')} Host${usableHosts === 1 ? '' : 's'}`;
        resTotalAddresses.textContent = `${totalAddresses.toLocaleString('en-US')} total IP addresses`;

        const firstOctet = (ipInt >>> 24) & 255;
        const { ipClass, scope } = classifyIp(firstOctet, ipInt);
        resIpClass.textContent = ipClass;
        resIpScope.textContent = scope;
        resPrefixRatio.textContent = `${cidr} Net / ${hostBits} Host`;

        // Render Binary Breakdown with colored bits
        binIp.textContent = intToBinaryString(ipInt);
        binNet.textContent = intToBinaryString(networkInt);
        binBcast.textContent = intToBinaryString(broadcastInt);

        // Highlight Network vs Host bits in mask
        renderBinaryMask(cidr);

        // Render Sub-Division Table
        renderSubdivisionTable(cidr);
    }

    // Render 32-bit Mask with styled spans for Network vs Host bits
    function renderBinaryMask(cidr) {
        let maskBits = '';
        for (let i = 1; i <= 32; i++) {
            if (i <= cidr) {
                maskBits += '<span class="bin-bit-one">1</span>';
            } else {
                maskBits += '<span class="bin-bit-zero">0</span>';
            }
            if (i % 8 === 0 && i < 32) {
                maskBits += '<span style="color: var(--color-border-subtle); font-weight: bold;">.</span>';
            }
        }
        binMask.innerHTML = maskBits;
    }

    // Render Sub-Division & VLSM Scaling Table
    function renderSubdivisionTable(currentCidr) {
        let html = '';
        const maxSubnetLevels = Math.min(32, currentCidr + 6);

        for (let p = currentCidr; p <= maxSubnetLevels; p++) {
            const diff = p - currentCidr;
            const subnetsCount = Math.pow(2, diff);
            const hostBits = 32 - p;
            const totalIps = Math.pow(2, hostBits);
            let usable = 0;
            if (p === 32) usable = 1;
            else if (p === 31) usable = 2;
            else usable = Math.max(0, totalIps - 2);

            const maskInt = cidrToMaskInt(p);
            const isCurrent = p === currentCidr;

            html += `
                <tr style="border-bottom: 1px solid var(--color-border-light); ${isCurrent ? 'background: rgba(56, 189, 248, 0.12);' : ''}">
                    <td style="padding: 9px 12px; font-weight: 700; color: ${isCurrent ? '#38bdf8' : 'var(--color-text-main)'};">
                        /${p} ${isCurrent ? '<span style="font-size: 0.72rem; color: #38bdf8; margin-left: 6px; font-weight: 700;">(Current)</span>' : ''}
                    </td>
                    <td style="padding: 9px 12px; font-family: 'JetBrains Mono', monospace; color: var(--color-text-muted);">
                        ${intToIp(maskInt)}
                    </td>
                    <td class="td-right" style="padding: 9px 12px; font-weight: 600;">
                        ${subnetsCount.toLocaleString('en-US')}
                    </td>
                    <td class="td-right" style="padding: 9px 12px; color: var(--color-text-muted);">
                        ${totalIps.toLocaleString('en-US')}
                    </td>
                    <td class="td-right" style="padding: 9px 12px; font-weight: 700; color: #10b981;">
                        ${usable.toLocaleString('en-US')}
                    </td>
                </tr>
            `;
        }

        subdivisionTableBody.innerHTML = html;
    }

    // Preset Buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            presetBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            ipInput.value = this.getAttribute('data-ip');
            cidrSelect.value = this.getAttribute('data-cidr');
            calculateSubnet();
        });
    });

    // Event Listeners
    ipInput.addEventListener('input', calculateSubnet);
    cidrSelect.addEventListener('change', calculateSubnet);
    calcBtn.addEventListener('click', calculateSubnet);

    resetBtn.addEventListener('click', function () {
        ipInput.value = '192.168.1.1';
        cidrSelect.value = '24';
        presetBtns.forEach(b => {
            if (b.getAttribute('data-cidr') === '24') b.classList.add('active');
            else b.classList.remove('active');
        });
        calculateSubnet();
    });

    // Initialize
    populateCidrOptions();
    calculateSubnet();
});
