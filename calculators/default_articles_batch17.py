"""
Default educational articles for Batch #17 calculators.
Contains comprehensive, 400+ word SEO articles formatted with KaTeX for mathematical notation.
"""

PRESENT_VALUE_ARTICLE = r"""
<div class="article-content">
    <h2>Financial Economics: Discounted Cash Flow Theory & Present Value Mathematics</h2>
    <p>
        The <strong>Time Value of Money (TVM)</strong> is the foundational tenet of corporate finance, asset valuation, actuarial science, and investment appraisal. It asserts that a unit of currency received today possesses greater purchasing utility than an identical nominal unit received in the future. This value differential arises from three macroeconomic forces: the opportunity cost of foregone capital returns, systemic inflation eroding future purchasing power, and counterparty default or liquidity risk. <strong>Present Value (PV)</strong> determines the exact lump-sum equivalent today of one or more expected future cash flows discounted at an appropriate opportunity cost of capital.
    </p>

    <h3>1. Mathematical Derivation of Lump-Sum Discounting</h3>
    <p>
        If a capital sum $PV$ grows at an annual nominal interest rate $r$ compounded $n$ times per year over a temporal horizon of $t$ years, its Future Value ($FV$) expands exponentially:
    </p>
    <p>
        $$FV = PV \left(1 + \frac{r}{n}\right)^{n \cdot t}$$
    </p>
    <p>
        Solving algebraically for $PV$ by applying the inverse compound growth factor yields the canonical lump-sum discounting formula:
    </p>
    <p>
        $$PV = \frac{FV}{\left(1 + \frac{r}{n}\right)^{n \cdot t}} = FV \left(1 + \frac{r}{n}\right)^{-n \cdot t}$$
    </p>
    <p>
        When compounding occurs continuously as $n \to \infty$, the discrete discount factor converges to the natural exponential base $e$:
    </p>
    <p>
        $$PV = \lim_{n \to \infty} FV \left(1 + \frac{r}{n}\right)^{-n \cdot t} = FV \cdot e^{-r \cdot t}$$
    </p>

    <h3>2. Annuities: Ordinary Annuity vs. Annuity Due</h3>
    <p>
        When cash flows arrive not as an isolated terminal lump sum, but as a systematic stream of equal periodic payments ($PMT$) across $N$ total periods at an effective periodic discount rate $i = \frac{r}{n}$, the aggregate present value is the finite geometric summation of individual discounted installments:
    </p>
    <p>
        $$PV_{\text{ordinary}} = \sum_{k=1}^N \frac{PMT}{(1 + i)^k} = PMT \left[ \frac{1 - (1 + i)^{-N}}{i} \right]$$
    </p>
    <p>
        The bracketed term $\left[ \frac{1 - (1 + i)^{-N}}{i} \right]$ is designated in actuarial literature as the <strong>Present Value Interest Factor of an Annuity (PVIFA)</strong>.
    </p>
    <p>
        If cash disbursements occur at the beginning of each interval rather than the end (an <strong>Annuity Due</strong>, standard in commercial lease agreements and structured payouts), every installment experiences one less period of temporal discounting:
    </p>
    <p>
        $$PV_{\text{due}} = PV_{\text{ordinary}} \cdot (1 + i) = PMT \left[ \frac{1 - (1 + i)^{-N}}{i} \right] (1 + i)$$
    </p>

    <h3>3. Combined Hybrid Valuation: Bond & Pension Mechanics</h3>
    <p>
        In debt capital markets, a coupon-bearing corporate or sovereign bond represents a hybrid structure: a regular annuity of coupon payments $C$ paired with a terminal par value bullet repayment $F$ at maturity $N$. Its intrinsic present value (clean price) is expressed by combining both discounting equations:
    </p>
    <p>
        $$PV_{\text{bond}} = C \left[ \frac{1 - (1 + y)^{-N}}{y} \right] + \frac{F}{(1 + y)^N}$$
    </p>
    <p>
        Where $y$ represents the prevailing market <em>Yield to Maturity (YTM)</em>. When market yields rise above the stated coupon rate ($y > C/F$), the bond trades at a discount ($PV < F$); conversely, when yields decline below coupon payments ($y < C/F$), the present value commands a market premium.
    </p>

    <h3>4. Inflation Adjustments: Real vs. Nominal Present Value</h3>
    <p>
        If future cash inflows are anticipated in nominal terms during inflationary environments, utilizing a nominal discount rate $r_{\text{nom}}$ yields nominal present value. To isolate true constant-dollar purchasing power, the analyst must compute the <strong>real discount rate</strong> ($r_{\text{real}}$) via the exact Fisher equation:
    </p>
    <p>
        $$1 + r_{\text{nom}} = (1 + r_{\text{real}})(1 + \pi) \implies r_{\text{real}} = \frac{1 + r_{\text{nom}}}{1 + \pi} - 1 \approx r_{\text{nom}} - \pi$$
    </p>
    <p>
        Where $\pi$ represents the annualized rate of consumer price inflation. Incorporating $r_{\text{real}}$ ensures that long-term capital allocation decisions accurately reflect real thermodynamic consumption power.
    </p>
</div>
"""

CONCEPTION_DATE_ARTICLE = r"""
<div class="article-content">
    <h2>Reproductive Endocrinology: Follicular Dynamics & Conception Date Estimation</h2>
    <p>
        Determining the biological timing of human conception is essential in clinical obstetrics, prenatal diagnostic scheduling, and reproductive healthcare. While obstetric gestational age is traditionally tabulated from the first day of the <strong>Last Menstrual Period (LMP)</strong>—a historical convention established because menstrual bleeding is a conspicuous clinical event—actual biological fertilization occurs roughly two weeks later, contingent upon follicular maturation and spontaneous ovulation.
    </p>

    <h3>1. The Ovarian Cycle & Ovulation Chronology</h3>
    <p>
        The human menstrual cycle is divided into two endocrinological phases bisected by ovulation:
    </p>
    <ul>
        <li>
            <strong>The Follicular Phase:</strong> Governed by follicle-stimulating hormone (FSH) and estradiol, this phase exhibits biological variability between women and across cycles (ranging from 10 to 24+ days).
        </li>
        <li>
            <strong>The Luteal Phase:</strong> Following the LH (luteinizing hormone) surge that triggers follicular rupture and oocyte release, the collapsed follicle transforms into the <em>corpus luteum</em>, secreting progesterone to prepare the endometrium. The luteal phase is remarkably consistent, lasting almost universally between $13$ and $15$ days (clinical standard: $14$ days).
        </li>
    </ul>
    <p>
        Consequently, for any regular menstrual cycle of length $C$ days, the day of ovulation is estimated as:
    </p>
    <p>
        $$\text{Ovulation Day} = C - 14 \quad (\text{counted from Day 1 of LMP})$$
    </p>

    <h3>2. The Biologic Fertile Window</h3>
    <p>
        Conception does not require intercourse to coincide strictly with the precise hour of ovulation. Because cryo-tolerant human spermatozoa remain viable and capable of fertilization within cervical crypts and the fallopian tubes for up to $120 \text{ hours}$ ($5 \text{ days}$), while the secondary oocyte remains viable for only $12 \text{–} 24 \text{ hours}$ post-extrusion, the physiological fertile window spans:
    </p>
    <p>
        $$\text{Fertile Window} = [\text{Ovulation} - 5 \text{ days}, \, \text{Ovulation} + 1 \text{ day}]$$
    </p>
    <p>
        Clinical epidemiological studies demonstrate that peak conception probabilities occur with sexual intercourse $1 \text{ to } 2 \text{ days}$ prior to ovulation ($\approx 25\text{–}30\%$ pregnancy probability per cycle), whereas intercourse occurring 24 hours after ovulation yields near-zero probability due to rapid oocyte degeneration and cortical hardening.
    </p>

    <h3>3. Reverse Calculation from Estimated Due Date (EDD)</h3>
    <p>
        Human full-term gestation follows <strong>Naegele's Rule</strong>, which standardizes pregnancy duration to $280 \text{ days}$ ($40 \text{ completed weeks}$) from the LMP for an idealized 28-day cycle. Because biological conception occurs at post-ovulatory day 14, post-conception fetal embryogenesis spans exactly $266 \text{ days}$ ($38 \text{ completed weeks}$):
    </p>
    <p>
        $$\text{Conception Date} = \text{EDD} - 266 \text{ days}$$
    </p>
    <p>
        $$\text{Estimated LMP} = \text{EDD} - 280 \text{ days}$$
    </p>

    <h3>4. Dating via Ultrasound Crown-Rump Length (CRL)</h3>
    <p>
        When menstrual history is irregular, oligomenorrheic, or uncertain, first-trimester obstetric ultrasonography provides the gold-standard dating method. Measuring the embryonic <strong>Crown-Rump Length (CRL)</strong> between gestational weeks 7 and 13 yields dating accuracy within $\pm 3 \text{ to } 5 \text{ days}$, superseding menstrual recall:
    </p>
    <p>
        $$\text{Gestational Age (weeks)} = 5.28 + 0.119 \cdot \text{CRL} - 0.00056 \cdot \text{CRL}^2 \quad (\text{CRL in mm})$$
    </p>
    <p>
        Subtracting $14 \text{ days}$ from the ultrasound-derived gestational age immediately pinpoints the biological conception interval with clinical precision.
    </p>
</div>
"""

VOLUME_3D_ARTICLE = r"""
<div class="article-content">
    <h2>Solid Geometry: Stereometry, Volumetric Integrals & Surface Area Formulations</h2>
    <p>
        <strong>Solid geometry (stereometry)</strong> investigates the dimensional properties, volumetric capacities, and boundary surface areas of three-dimensional Euclidean solids. Volumetric calculations are central to mechanical engineering, structural architecture, fluid dynamics, manufacturing material optimization, and chemical stoichiometry. Analytically, three-dimensional volumes represent triple integrals of differential volume elements $dV = dx\,dy\,dz$, or solids of revolution governed by Cavalieri's Principle and the Pappus-Guldinus theorems.
    </p>

    <h3>1. Cavalieri's Principle & Solids of Revolution</h3>
    <p>
        Formulated by Italian mathematician Bonaventura Cavalieri in 1635, <em>Cavalieri's Principle</em> establishes that if two three-dimensional solids of identical altitude possess equal cross-sectional areas at every horizontal slicing plane parallel to their base, both solids encompass identical volumetric capacities.
    </p>
    <p>
        For continuous solids generated by revolving a function $y = f(x)$ around the Cartesian $x$-axis between bounds $a$ and $b$, the volume of revolution is derived via the disc integration method:
    </p>
    <p>
        $$V = \pi \int_{a}^{b} [f(x)]^2 \, dx$$
    </p>

    <h3>2. Formulations for Canonical 3D Geometries</h3>
    <p>
        The mathematical relationships governing canonical solids are derived through rigorous geometric integration:
    </p>
    <ul>
        <li>
            <strong>Sphere (Radius $r$):</strong>
            Revolving $y = \sqrt{r^2 - x^2}$ from $-r$ to $+r$ yields:
            $$V = \pi \int_{-r}^r (r^2 - x^2) \, dx = \frac{4}{3}\pi r^3, \quad A = \frac{d}{dr}\left(\frac{4}{3}\pi r^3\right) = 4\pi r^2$$
        </li>
        <li>
            <strong>Right Circular Cylinder (Radius $r$, Height $h$):</strong>
            Uniform circular cross-section $\pi r^2$ extruded over height $h$:
            $$V = \pi r^2 h, \quad A_{\text{total}} = 2\pi r^2 + 2\pi rh = 2\pi r(r + h)$$
        </li>
        <li>
            <strong>Right Circular Cone (Radius $r$, Height $h$, Slant Height $s = \sqrt{r^2 + h^2}$):</strong>
            $$V = \frac{1}{3}\pi r^2 h, \quad A = \pi r^2 + \pi r s = \pi r(r + \sqrt{r^2 + h^2})$$
        </li>
        <li>
            <strong>Rectangular Prism / Cuboid (Length $l$, Width $w$, Height $h$):</strong>
            $$V = l \cdot w \cdot h, \quad A = 2(lw + lh + wh), \quad d_{\text{space}} = \sqrt{l^2 + w^2 + h^2}$$
        </li>
        <li>
            <strong>Regular Square/Rectangular Pyramid (Base $l \times w$, Vertical Height $h$):</strong>
            $$V = \frac{1}{3} l \cdot w \cdot h$$
        </li>
        <li>
            <strong>Triaxial Ellipsoid (Semi-axes $a, b, c$):</strong>
            Generalization of the spherical volume formula:
            $$V = \frac{4}{3}\pi a b c$$
        </li>
        <li>
            <strong>Torus (Major Radius $R$, Minor Tube Radius $r$):</strong>
            Applying Pappus's Centroid Theorem (area $\pi r^2$ swept along circular path $2\pi R$):
            $$V = (\pi r^2)(2\pi R) = 2\pi^2 R r^2, \quad A = (2\pi r)(2\pi R) = 4\pi^2 R r$$
        </li>
        <li>
            <strong>Conical Frustum (Truncated Cone with Radii $R, r$ and Height $h$):</strong>
            $$V = \frac{1}{3}\pi h (R^2 + Rr + r^2)$$
        </li>
    </ul>

    <h3>3. The Isoperimetric Theorem & Surface-to-Volume Ratios</h3>
    <p>
        The 3D <strong>Isoperimetric Inequality</strong> proves that among all closed three-dimensional solids enclosing a fixed volume $V$, the <strong>sphere</strong> uniquely minimizes the total surface area $A$:
    </p>
    <p>
        $$A^3 \ge 36\pi V^2$$
    </p>
    <p>
        Equality holds strictly for spheres. This thermodynamic property explains why soap bubbles form spheres (minimizing surface tension energy), why warm-blooded mammals conserve heat via spherical body morphologies in polar climates, and why chemical catalyst pellets maximize active surface-to-volume ratio ($A/V$) via complex multi-channel geometries.
    </p>
</div>
"""

PASSWORD_GENERATOR_ARTICLE = r"""
<div class="article-content">
    <h2>Applied Cryptography: Shannon Entropy, CSPRNGs & Password Resilience</h2>
    <p>
        In digital identity authentication and cryptographic access control, the security of symmetric encryption keys, master passwords, and administrative credentials rests upon mathematical <strong>information-theoretic entropy</strong>. Weak, predictable, or dictionary-derived passwords enable adversaries to execute high-throughput offline dictionary attacks and specialized GPU hash-cracking routines that can test billions of permutations per second. Generating robust, cryptographically uncrackable authentication tokens requires true non-deterministic pseudo-random number generation.
    </p>

    <h3>1. Shannon Information Entropy Formulation</h3>
    <p>
        Formulated by Claude Shannon in 1948, the entropy $H$ of a discrete random password generation scheme measures the average information content or degree of uncertainty possessed by an attacker attempting blind guessing. If a password of length $L$ is assembled by selecting characters uniformly and independently at random from a character alphabet pool of size $N$, the total search space equals $S = N^L$. The resulting entropy, quantified in <strong>bits</strong>, is given by:
    </p>
    <p>
        $$H = \log_2(S) = \log_2(N^L) = L \cdot \log_2(N)$$
    </p>
    <p>
        Standard character set pools include:
    </p>
    <ul>
        <li><strong>Lowercase English ($a\text{–}z$):</strong> $N = 26 \implies \log_2(26) \approx 4.70 \text{ bits/char}$</li>
        <li><strong>Alphanumeric ($a\text{–}z, A\text{–}Z, 0\text{–}9$):</strong> $N = 62 \implies \log_2(62) \approx 5.95 \text{ bits/char}$</li>
        <li><strong>Full Printable ASCII (Alphanumeric + 33 Symbols):</strong> $N = 95 \implies \log_2(95) \approx 6.57 \text{ bits/char}$</li>
    </ul>
    <p>
        For example, a random 16-character password generated across the full 95-character ASCII pool possesses:
    </p>
    <p>
        $$H = 16 \cdot \log_2(95) \approx 16 \times 6.5698 = 105.12 \text{ bits of entropy}$$
    </p>

    <h3>2. Cryptographic PRNGs vs. Linear Congruential PRNGs</h3>
    <p>
        A catastrophic implementation error in web software is generating security keys using standard pseudo-random functions such as JavaScript's <code>Math.random()</code> or C's <code>rand()</code>. Standard browser engines implement <code>Math.random()</code> using the <strong>xorshift128+</strong> algorithm. While computationally fast, it is mathematically predictable: observing just 2 to 3 consecutive random numbers allows an adversary to reconstruct internal generator state and forecast all past and future keys.
    </p>
    <p>
        Secure implementations mandate the <strong>Web Crypto API</strong> (<code>window.crypto.getRandomValues()</code>). This interface interfaces directly with operating system entropy pools (e.g., Linux <code>/dev/urandom</code>, Windows <code>BCryptGenRandom</code>) harvesting hardware thermal noise, keystroke interrupts, and disk controller timing variations to provide non-deterministic CSPRNG security.
    </p>

    <h3>3. Diceware Passphrases & Human Usability</h3>
    <p>
        Originated by Arnold Reinhold, the <strong>Diceware</strong> methodology constructs memorable, high-entropy passphrases by concatenating natural language words selected randomly from a standardized dictionary of $V = 7,776$ distinct words ($6^5$ permutations). Because each word is drawn independently with probability $P = \frac{1}{7776}$, the entropy contribution per word is:
    </p>
    <p>
        $$H_{\text{word}} = \log_2(7776) = 5 \cdot \log_2(6) \approx 12.92 \text{ bits}$$
    </p>
    <p>
        A 6-word Diceware passphrase (e.g., <em>correct-horse-battery-staple-galaxy-orbit</em>) delivers $6 \times 12.92 \approx 77.5 \text{ bits}$ of entropy—sufficient to withstand exhaustive supercomputer brute-forcing while remaining easily memorized by human cognitive memory systems.
    </p>

    <h3>4. Offline GPU Hash Rate Attack Dynamics</h3>
    <p>
        Modern password-cracking rigs equipped with multi-GPU clusters (e.g., 8 $\times$ NVIDIA RTX 4090) achieve hash evaluation rates of exceeding $100 \text{ billion hashes/sec}$ ($10^{11} \text{ H/s}$) for unsalted fast cryptographic hashes like MD5, NTLM, and SHA-256. The expected time $T$ to crack a keyspace of entropy $H$ at guess rate $R$ is:
    </p>
    <p>
        $$T = \frac{2^{H - 1}}{R}$$
    </p>
    <p>
        At $R = 10^{11} \text{ H/s}$, an 8-character alphanumeric password ($H \approx 47.6 \text{ bits}$) falls in less than 2.3 seconds. In contrast, an authentic 16-character password ($H \approx 105 \text{ bits}$) demands over $3.2 \times 10^{12}$ years—outlasting the cosmological age of the universe by multiple orders of magnitude.
    </p>
</div>
"""
