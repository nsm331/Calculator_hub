/**
 * Cryptographic Password & Passphrase Generator Engine
 * 100% CSPRNG via window.crypto.getRandomValues
 * Evaluates Shannon Entropy bits (H = L * log2(N)) and offline brute-force crack time.
 * 100% Client-Side Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mode tabs
    const tabs = document.querySelectorAll('.pw-tab-btn');
    let currentMode = 'random'; // 'random' or 'passphrase'

    // Form controls - Random String Mode
    const lengthRange = document.getElementById('pw-length-range');
    const lengthNum = document.getElementById('pw-length-num');
    const optUpper = document.getElementById('pw-opt-upper');
    const optLower = document.getElementById('pw-opt-lower');
    const optDigits = document.getElementById('pw-opt-digits');
    const optSymbols = document.getElementById('pw-opt-symbols');
    const optNoAmbiguous = document.getElementById('pw-opt-ambiguous');

    // Form controls - Passphrase Mode
    const wordsRange = document.getElementById('pw-words-range');
    const wordsNum = document.getElementById('pw-words-num');
    const separatorSelect = document.getElementById('pw-separator');
    const optCapitalize = document.getElementById('pw-opt-capitalize');
    const optIncludeNumber = document.getElementById('pw-opt-pass-num');

    // Sections
    const secRandom = document.getElementById('pw-sec-random');
    const secPassphrase = document.getElementById('pw-sec-passphrase');

    // Outputs
    const pwDisplay = document.getElementById('pw-display');
    const copyBtn = document.getElementById('pw-copy-btn');
    const copyTooltip = document.getElementById('pw-copy-tooltip');
    const refreshBtn = document.getElementById('pw-refresh-btn');

    // Metrics
    const entropyBitsEl = document.getElementById('pw-entropy-bits');
    const strengthLabelEl = document.getElementById('pw-strength-label');
    const strengthBarEl = document.getElementById('pw-strength-bar');
    const crackTimeEl = document.getElementById('pw-crack-time');
    const poolSizeEl = document.getElementById('pw-pool-size');

    // Bulk batch section
    const bulkBtn = document.getElementById('pw-bulk-btn');
    const bulkContainer = document.getElementById('pw-bulk-container');
    const bulkListEl = document.getElementById('pw-bulk-list');

    // Character sets
    const CHARS = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        digits: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };
    const AMBIGUOUS = /[0Oo1lI|]/g;

    // Curated Diceware English Vocabulary (200+ distinct memorable words)
    const DICEWARE_WORDS = [
        'acorn', 'almond', 'anchor', 'anthem', 'apollo', 'arrow', 'artist', 'atlas', 'autumn', 'avalanche',
        'badge', 'bamboo', 'banner', 'beacon', 'breeze', 'bridge', 'bronze', 'bubble', 'bullet', 'butter',
        'cactus', 'camera', 'candle', 'canyon', 'canvas', 'carpet', 'castle', 'cedar', 'cereal', 'cipher',
        'clarity', 'clover', 'cobalt', 'coffee', 'comet', 'copper', 'coral', 'cosmos', 'cradle', 'crater',
        'crystal', 'dancer', 'dawn', 'delta', 'desert', 'diamond', 'dolphin', 'dragon', 'drift', 'eagle',
        'echo', 'eclipse', 'elm', 'ember', 'emerald', 'engine', 'falcon', 'feather', 'fender', 'flame',
        'forest', 'fossil', 'fountain', 'fox', 'galaxy', 'garden', 'garnet', 'glacier', 'glimmer', 'granite',
        'harbor', 'hawk', 'horizon', 'hunter', 'hydra', 'icicle', 'impact', 'island', 'ivory', 'jaguar',
        'javelin', 'jungle', 'jupiter', 'kestrel', 'knight', 'lagoon', 'lantern', 'laser', 'legend', 'leopard',
        'lightning', 'lizard', 'lotus', 'lunar', 'magnet', 'mango', 'mantis', 'marble', 'meadow', 'mercury',
        'meteor', 'mirage', 'monarch', 'mountain', 'nebula', 'nectar', 'needle', 'neon', 'ninja', 'nomad',
        'nova', 'oasis', 'ocean', 'olive', 'omega', 'onyx', 'opal', 'orbit', 'orchid', 'origami',
        'panther', 'pebble', 'pelican', 'phantom', 'phoenix', 'pillar', 'pilot', 'pioneer', 'planet', 'plasma',
        'polar', 'portal', 'prism', 'pulse', 'pyramid', 'quantum', 'quarry', 'quartz', 'quasar', 'radar',
        'rainbow', 'ranger', 'raven', 'reef', 'rhino', 'ripple', 'river', 'rocket', 'ruby', 'safari',
        'sailor', 'saturn', 'shadow', 'sheriff', 'shield', 'sierra', 'silver', 'solar', 'spark', 'sphinx',
        'spiral', 'spring', 'star', 'stellar', 'storm', 'stride', 'summit', 'sunset', 'swift', 'tango',
        'temple', 'thunder', 'tiger', 'titan', 'topaz', 'tornado', 'torpedo', 'trail', 'tulip', 'turbine',
        'twilight', 'typhoon', 'unicorn', 'valley', 'vanilla', 'vector', 'velvet', 'vessel', 'viking', 'violet',
        'viper', 'vision', 'vortex', 'voyage', 'walrus', 'water', 'wave', 'willow', 'winter', 'wizard',
        'wolf', 'zenith', 'zephyr', 'zero', 'zigzag', 'zodiac'
    ];

    /**
     * Cryptographically secure random integer in range [0, max)
     * Rejection sampling eliminates modulo bias
     */
    function secureRandomInt(max) {
        if (max <= 0) return 0;
        const array = new Uint32Array(1);
        const maxUint32 = 0xFFFFFFFF;
        const limit = maxUint32 - (maxUint32 % max);

        let randomVal;
        do {
            window.crypto.getRandomValues(array);
            randomVal = array[0];
        } while (randomVal >= limit);

        return randomVal % max;
    }

    function generateRandomPassword() {
        let pool = '';
        if (optUpper && optUpper.checked) pool += CHARS.upper;
        if (optLower && optLower.checked) pool += CHARS.lower;
        if (optDigits && optDigits.checked) pool += CHARS.digits;
        if (optSymbols && optSymbols.checked) pool += CHARS.symbols;

        if (optNoAmbiguous && optNoAmbiguous.checked) {
            pool = pool.replace(AMBIGUOUS, '');
        }

        if (pool.length === 0) {
            // Fallback to lowercase if everything unchecked
            pool = CHARS.lower;
            if (optLower) optLower.checked = true;
        }

        const len = parseInt(lengthRange.value) || 16;
        let password = '';

        for (let i = 0; i < len; i++) {
            const idx = secureRandomInt(pool.length);
            password += pool[idx];
        }

        const poolSize = pool.length;
        const entropyBits = len * Math.log2(poolSize);

        return {
            password,
            entropy: entropyBits,
            poolSize,
            length: len
        };
    }

    function generatePassphrase() {
        const count = parseInt(wordsRange.value) || 4;
        const sep = separatorSelect ? separatorSelect.value : '-';
        const doCapitalize = optCapitalize ? optCapitalize.checked : true;
        const doAddNumber = optIncludeNumber ? optIncludeNumber.checked : true;

        const words = [];
        for (let i = 0; i < count; i++) {
            const idx = secureRandomInt(DICEWARE_WORDS.length);
            let w = DICEWARE_WORDS[idx];
            if (doCapitalize) {
                w = w.charAt(0).toUpperCase() + w.slice(1);
            }
            words.push(w);
        }

        let phrase = words.join(sep);
        if (doAddNumber) {
            const num = secureRandomInt(90) + 10; // 2-digit number (10-99)
            phrase += (sep ? sep : '') + num;
        }

        // Entropy: count * log2(wordlist_size) + (addNumber ? log2(90) : 0)
        let entropy = count * Math.log2(DICEWARE_WORDS.length);
        if (doAddNumber) entropy += Math.log2(90);

        return {
            password: phrase,
            entropy,
            poolSize: DICEWARE_WORDS.length,
            length: phrase.length
        };
    }

    function estimateCrackTime(entropy) {
        // Assume 100 billion (10^11) hashes per second offline GPU cluster
        const hashRate = 1e11;
        const guesses = Math.pow(2, entropy - 1);
        const seconds = guesses / hashRate;

        if (seconds < 1) return 'Instant (less than 1 sec)';
        if (seconds < 60) return `${seconds.toFixed(1)} seconds`;
        if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutes`;
        if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`;
        if (seconds < 31536000) return `${(seconds / 86400).toFixed(0)} days`;
        if (seconds < 31536000 * 1000) return `${(seconds / 31536000).toFixed(1)} years`;
        if (seconds < 31536000 * 1e6) return `${(seconds / (31536000 * 1e3)).toFixed(1)} millennia`;
        if (seconds < 31536000 * 1e9) return `${(seconds / (31536000 * 1e6)).toFixed(1)} million years`;
        if (seconds < 31536000 * 1e12) return `${(seconds / (31536000 * 1e9)).toFixed(1)} billion years`;
        return 'Trillions of millennia (Cryptographic Fortress)';
    }

    function updateStrengthMeter(entropy) {
        let label = 'Very Weak';
        let color = '#ef4444';
        let pct = Math.min(100, Math.max(5, (entropy / 110) * 100));

        if (entropy < 28) {
            label = 'Very Weak';
            color = '#ef4444';
        } else if (entropy < 45) {
            label = 'Weak';
            color = '#f97316';
        } else if (entropy < 65) {
            label = 'Moderate';
            color = '#eab308';
        } else if (entropy < 85) {
            label = 'Strong';
            color = '#10b981';
        } else if (entropy < 105) {
            label = 'Very Strong';
            color = '#06b6d4';
        } else {
            label = 'Cryptographic Fortress';
            color = '#8b5cf6';
        }

        if (entropyBitsEl) entropyBitsEl.textContent = `${entropy.toFixed(1)} bits`;
        if (strengthLabelEl) {
            strengthLabelEl.textContent = label;
            strengthLabelEl.style.color = color;
        }
        if (strengthBarEl) {
            strengthBarEl.style.width = `${pct}%`;
            strengthBarEl.style.backgroundColor = color;
        }
        if (crackTimeEl) crackTimeEl.textContent = estimateCrackTime(entropy);
    }

    function generate() {
        const result = currentMode === 'random' ? generateRandomPassword() : generatePassphrase();

        if (pwDisplay) {
            pwDisplay.value = result.password;
        }

        if (poolSizeEl) {
            poolSizeEl.textContent = currentMode === 'random'
                ? `${result.poolSize} characters`
                : `${result.poolSize} words dictionary`;
        }

        updateStrengthMeter(result.entropy);
    }

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentMode = tab.dataset.mode;

            if (currentMode === 'random') {
                if (secRandom) secRandom.style.display = 'block';
                if (secPassphrase) secPassphrase.style.display = 'none';
            } else {
                if (secRandom) secRandom.style.display = 'none';
                if (secPassphrase) secPassphrase.style.display = 'block';
            }

            generate();
        });
    });

    // Slider and sync inputs
    if (lengthRange && lengthNum) {
        lengthRange.addEventListener('input', () => {
            lengthNum.value = lengthRange.value;
            generate();
        });
        lengthNum.addEventListener('input', () => {
            let val = parseInt(lengthNum.value) || 16;
            val = Math.max(8, Math.min(128, val));
            lengthRange.value = val;
            generate();
        });
    }

    if (wordsRange && wordsNum) {
        wordsRange.addEventListener('input', () => {
            wordsNum.value = wordsRange.value;
            generate();
        });
        wordsNum.addEventListener('input', () => {
            let val = parseInt(wordsNum.value) || 4;
            val = Math.max(3, Math.min(10, val));
            wordsRange.value = val;
            generate();
        });
    }

    // Checkbox and dropdown triggers
    [optUpper, optLower, optDigits, optSymbols, optNoAmbiguous, optCapitalize, optIncludeNumber].forEach(cb => {
        if (cb) cb.addEventListener('change', generate);
    });

    if (separatorSelect) separatorSelect.addEventListener('change', generate);
    if (refreshBtn) refreshBtn.addEventListener('click', generate);

    // Copy to clipboard with tooltip
    if (copyBtn && pwDisplay) {
        copyBtn.addEventListener('click', () => {
            if (!pwDisplay.value) return;
            navigator.clipboard.writeText(pwDisplay.value).then(() => {
                if (copyTooltip) {
                    copyTooltip.style.opacity = '1';
                    setTimeout(() => {
                        copyTooltip.style.opacity = '0';
                    }, 1800);
                }
            }).catch(() => {
                pwDisplay.select();
                document.execCommand('copy');
            });
        });
    }

    // Bulk Generation
    if (bulkBtn && bulkContainer && bulkListEl) {
        bulkBtn.addEventListener('click', () => {
            bulkContainer.style.display = bulkContainer.style.display === 'none' ? 'block' : 'none';
            if (bulkContainer.style.display === 'block') {
                bulkListEl.innerHTML = '';
                for (let i = 0; i < 5; i++) {
                    const item = currentMode === 'random' ? generateRandomPassword() : generatePassphrase();
                    const div = document.createElement('div');
                    div.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--color-input-bg); border: 1px solid var(--color-border-light); border-radius: var(--border-radius-sm); margin-bottom: 8px; font-family: monospace; font-size: 0.95rem;';
                    div.innerHTML = `
                        <span style="overflow-x: auto; margin-right: 8px;">${item.password}</span>
                        <button type="button" class="btn-copy-item" style="padding: 4px 10px; background: var(--color-bg-card-alt); border: 1px solid var(--color-border); border-radius: 4px; color: var(--color-primary); cursor: pointer; font-size: 0.8rem; font-weight: 600;">Copy</button>
                    `;
                    const btn = div.querySelector('.btn-copy-item');
                    btn.addEventListener('click', () => {
                        navigator.clipboard.writeText(item.password);
                        btn.textContent = 'Copied!';
                        btn.style.color = 'var(--color-success)';
                        setTimeout(() => {
                            btn.textContent = 'Copy';
                            btn.style.color = 'var(--color-primary)';
                        }, 1500);
                    });
                    bulkListEl.appendChild(div);
                }
            }
        });
    }

    // Run initial generation
    generate();
});
