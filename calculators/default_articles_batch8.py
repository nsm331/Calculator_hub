"""
Technical SEO Articles with formal KaTeX mathematical models for Batch #7 Calculators:
1. Investment Calculator
2. Pregnancy Due Date Calculator
3. Random Number Generator
4. IPv4 Subnet Mask Calculator
"""

INVESTMENT_ARTICLE = """
<article class="calculator-article">
    <h2>Financial Mathematics &amp; Compound Capital Accumulation Models</h2>
    <p>
        Wealth accumulation through compounding investment assets represents the foundational engine of modern quantitative personal finance. An investment portfolio combines an initial lump-sum principal balance $PV$ with periodic recurring deposits $PMT$, compounding continuously or at discrete intervals across an investment horizon of $t$ years to generate terminal future value $FV$.
    </p>

    <h3>The General Annuity Future Value Formula with Discrete Compounding</h3>
    <p>
        When capital compounds at an annual nominal interest rate $r$ with compounding frequency $n$ times per year (e.g., $n = 12$ for monthly compounding, $n = 365$ for daily compounding), the periodic interest rate per compounding period evaluates to $i = \\frac{r}{n}$. Over an accumulation span of $N = n \\cdot t$ compounding cycles with regular periodic contributions $PMT$, terminal portfolio value $FV$ obeys the classical compound annuity model:
    </p>
    <div class="math-display">
        $$FV = PV \\cdot \\left(1 + \\frac{r}{n}\\right)^{nt} + PMT \\cdot \\left[ \\frac{\\left(1 + \\frac{r}{n}\\right)^{nt} - 1}{\\frac{r}{n}} \\right] \\cdot \\left(1 + \\frac{r}{n}\\right)^d$$
    </div>
    <p>
        where parameter $d \\in \\{0, 1\\}$ defines deposit timing: $d = 0$ corresponds to an <strong>ordinary annuity</strong> (deposits made at the end of each accumulation period), whereas $d = 1$ denotes an <strong>annuity due</strong> (deposits made at the commencement of each period, enjoying an extra compounding interval).
    </p>

    <h3>The Continuous Compounding Limit</h3>
    <p>
        Taking the mathematical limit as compounding frequency approaches infinity ($n \\to \\infty$), Euler's constant $e$ establishes continuous capital compounding:
    </p>
    <div class="math-display">
        $$\\lim_{n \\to \\infty} PV \\cdot \\left(1 + \\frac{r}{n}\\right)^{nt} = PV \\cdot e^{rt}$$
    </div>

    <h3>The Fisher Relation: Nominal vs. Real Purchasing Power</h3>
    <p>
        Over multi-decade investment horizons, macroeconomic currency depreciation caused by annual inflation rate $\\pi$ erodes nominal purchasing power. Applying the exact <strong>Fisher Equation</strong>, real investment yield $r_{\\text{real}}$ and real terminal purchasing power $FV_{\\text{real}}$ evaluate to:
    </p>
    <div class="math-display">
        $$r_{\\text{real}} = \\frac{r - \\pi}{1 + \\pi}, \\qquad FV_{\\text{real}} = \\frac{FV}{(1 + \\pi)^t}$$
    </div>

    <h3>The Rule of 72 Doubling Time Approximation</h3>
    <p>
        Derived from logarithmic natural expansion $\\ln(2) \\approx 0.693$, the Rule of 72 provides a rapid heuristic for the number of years $T_{\\text{double}}$ required for an investment to double in size given constant annual yield $r\\%$ without additional contributions:
    </p>
    <div class="math-display">
        $$T_{\\text{double}} = \\frac{\\ln(2)}{\\ln(1 + r)} \\approx \\frac{72}{100 \\cdot r}$$
    </div>

    <h3>Comprehensive Investment Accumulation Example</h3>
    <p>
        An investor establishes a portfolio with an initial deposit $PV = \\$10{,}000$, commits monthly contributions $PMT = \\$500$ at the start of each month ($d = 1$), over a $20$-year investment horizon ($t = 20, nt = 240$), assuming an average annual equity return $r = 8.0\\%$ ($i = 0.08 / 12 \\approx 0.006667$) and annual inflation $\\pi = 2.5\\%$:
    </p>
    <ol class="example-steps">
        <li><strong>Principal Lump-Sum Compounded Value:</strong>
            $$FV_{\\text{principal}} = 10{,}000 \\cdot (1 + 0.006667)^{240} = \\$10{,}000 \\cdot 4.9268 = \\mathbf{\\$49{,}268.03}$$
        </li>
        <li><strong>Compounded Recurring Annuity Contributions:</strong>
            $$FV_{\\text{contributions}} = 500 \\cdot \\left[ \\frac{(1.006667)^{240} - 1}{0.006667} \\right] \\cdot (1.006667) = 500 \\cdot 589.02 \\cdot 1.006667 = \\mathbf{\\$296{,}473.61}$$
        </li>
        <li><strong>Total Terminal Portfolio Value:</strong>
            $$FV = \\$49{,}268.03 + \\$296{,}473.61 = \\mathbf{\\$345{,}741.64}$$
        </li>
        <li><strong>Total Capital Contributed vs Interest Earned:</strong>
            $$\\text{Total Principal Deposited} = \\$10{,}000 + (240 \\times \\$500) = \\mathbf{\\$130{,}000.00}$$
            $$\\text{Total Compound Growth Earned} = \\$345{,}741.64 - \\$130{,}000 = \\mathbf{\\$215{,}741.64} \\quad (62.4\\% \\text{ of portfolio!})$$
        </li>
        <li><strong>Inflation-Adjusted Purchasing Power:</strong>
            $$FV_{\\text{real}} = \\frac{\\$345{,}741.64}{(1 + 0.025)^{20}} = \\frac{\\$345{,}741.64}{1.6386} = \\mathbf{\\$210{,}995.53}$$
        </li>
    </ol>
</article>
"""

PREGNANCY_ARTICLE = """
<article class="calculator-article">
    <h2>Obstetric Chronology, Gestational Biometrics &amp; Due Date Estimation</h2>
    <p>
        Accurate determination of <strong>Estimated Due Date (EDD)</strong> and chronological gestational age is critical in perinatal medicine for guiding biochemical screenings, fetal anatomical sonography, maternal biometric monitoring, and timed clinical interventions. A full human term pregnancy spans an average biological duration of <strong>280 days (40 completed weeks)</strong> measured from the commencement of the last menstrual period.
    </p>

    <h3>Mathematical Formulation of Naegele's Rule</h3>
    <p>
        Established by German obstetrician Franz Karl Naegele in 1812, <strong>Naegele's Rule</strong> calculates the delivery date by assuming a standard 28-day ovarian cycle with ovulation occurring exactly on day 14. Adjusting for individualized menstrual cycle length $L_{\\text{cycle}}$ (varying typically between 21 and 35 days), the formalized calendar offset is:
    </p>
    <div class="math-display">
        $$\\text{EDD} = \\text{LMP} + 1 \\text{ year} - 3 \\text{ calendar months} + 7 \\text{ days} + (L_{\\text{cycle}} - 28 \\text{ days})$$
    </div>
    <p>
        where $\\text{LMP}$ denotes the first calendar day of the Last Menstrual Period.
    </p>

    <h3>Conception and Assisted Reproductive Technology (IVF) Dating</h3>
    <p>
        When fertilization timing is precisely known through basal body temperature spikes, luteinizing hormone surge testing, or Assisted Reproductive Technology (ART), gestational age skips follicular variability:
    </p>
    <ul>
        <li><strong>Known Ovulation / Conception Date:</strong> Fertilization occurs at post-LMP day 14. Thus:
            $$\\text{EDD} = \\text{Conception Date} + 266 \\text{ days} \\quad (38 \\text{ completed weeks})$$
        </li>
        <li><strong>In Vitro Fertilization (IVF) Embryo Transfer:</strong> Depending on the blastocyst embryological maturation stage at uterine transfer:
            $$\\text{EDD (Day 3 Transfer)} = \\text{Transfer Date} + 263 \\text{ days} \\quad (266 - 3)$$
            $$\\text{EDD (Day 5 Blastocyst Transfer)} = \\text{Transfer Date} + 261 \\text{ days} \\quad (266 - 5)$$
        </li>
    </ul>

    <h3>First-Trimester Ultrasound Biometry (Crown-Rump Length)</h3>
    <p>
        When menstrual dates are irregular or unknown, high-resolution first-trimester ultrasonography between 7 and 14 gestational weeks measures fetal <strong>Crown-Rump Length (CRL)</strong> in millimeters. According to the validated Hadlock and Robinson polynomial regression models:
    </p>
    <div class="math-display">
        $$\\text{Gestational Age (Days)} = 5.287 + 0.3543 \\cdot \\text{CRL} + 0.0001 \\cdot \\text{CRL}^2$$
    </div>
    <p>
        A first-trimester sonographic measurement provides a high degree of clinical accuracy with a 95% confidence interval margin of $\\pm 3$ to $5$ days.
    </p>

    <h3>Chronological Trimester Partitioning &amp; Key Fetal Milestones</h3>
    <table class="article-table">
        <thead>
            <tr>
                <th>Obstetric Phase</th>
                <th>Gestational Weeks</th>
                <th>Embryological &amp; Fetal Milestones</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>First Trimester</strong></td>
                <td>Weeks 1 &ndash; 13 (Days 1 &ndash; 91)</td>
                <td>Organogenesis, embryological neural tube closure, cardiovascular pulsation starts (~wk 6), nuchal translucency scan.</td>
            </tr>
            <tr>
                <td><strong>Second Trimester</strong></td>
                <td>Weeks 14 &ndash; 27 (Days 92 &ndash; 189)</td>
                <td>Fetal movement perception (quickening), detailed anatomy survey ultrasound (wk 18&ndash;20), clinical viability threshold (~wk 24).</td>
            </tr>
            <tr>
                <td><strong>Third Trimester</strong></td>
                <td>Weeks 28 &ndash; 40+ (Days 190 &ndash; 280)</td>
                <td>Alveolar surfactant pulmonary maturation, rapid subcutaneous adipose accumulation, vertex descent engagement.</td>
            </tr>
            <tr>
                <td><strong>Full Term Classification</strong></td>
                <td>Weeks 39w0d &ndash; 40w6d</td>
                <td>ACOG optimal physiological maturity window for spontaneous unassisted labor and neonatal thermal regulation.</td>
            </tr>
        </tbody>
    </table>

    <h3>Step-by-Step Gestational Calculation Example</h3>
    <p>
        Consider a woman whose last menstrual period began on <strong>March 12</strong> with a typical <strong>31-day</strong> menstrual cycle:
    </p>
    <ol class="example-steps">
        <li><strong>Base Naegele Offset:</strong> March 12 + 1 year = March 12 next year; subtract 3 months = December 12; add 7 days = <strong>December 19</strong>.</li>
        <li><strong>Cycle Length Adjustment:</strong> Since cycle is 31 days ($31 - 28 = +3$ days), add 3 days: December 19 + 3 days = <strong>December 22</strong>.</li>
        <li><strong>Estimated Delivery Date (EDD):</strong> <strong>December 22</strong> of the same clinical year.</li>
        <li><strong>Gestational Age Tracking:</strong> If today is June 15 (95 days since LMP), gestational age is $\\lfloor 95 / 7 \\rfloor = 13$ weeks and $95 \\pmod 7 = 4$ days, placing the patient at the transition into the <strong>Second Trimester</strong>.</li>
    </ol>
</article>
"""

RANDOM_NUMBER_ARTICLE = """
<article class="calculator-article">
    <h2>Probability Theory, Pseudorandom Algorithms &amp; Cryptographic Entropy</h2>
    <p>
        Random number generation is a fundamental primitive in applied mathematics, Monte Carlo numerical simulations, stochastic statistical modeling, algorithmic cryptography, and computational game theory. A <strong>discrete uniform random variable</strong> $X \\sim \\mathcal{U}\\{a, b\\}$ assigns equal probability mass across all finite integers within the closed interval $[a, b] \\subset \\mathbb{Z}$.
    </p>

    <h3>Discrete Uniform Probability Distribution</h3>
    <p>
        For any discrete integer $k$ within the contiguous domain $a \\le k \\le b$, the Probability Mass Function (PMF), cumulative distribution function (CDF), expected value (mean $\\mu$), and variance $\\sigma^2$ evaluate to:
    </p>
    <div class="math-display">
        $$P(X = k) = \\frac{1}{b - a + 1}, \\qquad E[X] = \\frac{a + b}{2}, \\qquad \\operatorname{Var}(X) = \\frac{(b - a + 1)^2 - 1}{12}$$
    </div>

    <h3>Pseudorandom Number Generators (PRNG) &amp; Linear Congruential Recurrence</h3>
    <p>
        Deterministic computing architectures approximate physical randomness through algorithmic <strong>Pseudorandom Number Generators (PRNGs)</strong>. One of the most historically significant PRNG formulations is the <strong>Linear Congruential Generator (LCG)</strong>, parameterized by modulus $m$, multiplier $a$, increment $c$, and seed value $X_0$:
    </p>
    <div class="math-display">
        $$X_{n+1} = (a X_n + c) \\pmod m$$
    </div>
    <p>
        According to the <em>Hull-Dobell Theorem</em>, an LCG achieves its maximum theoretical period of length $m$ if and only if:
    </p>
    <ul>
        <li>$\\gcd(c, m) = 1$ (increment $c$ and modulus $m$ are coprime).</li>
        <li>Every prime factor of $m$ divides $a - 1$.</li>
        <li>If $m$ is divisible by 4, then $a - 1$ must be divisible by 4.</li>
    </ul>

    <h3>Box-Muller Transform for Gaussian (Normal) Distributions</h3>
    <p>
        When sampling continuous random variables distributed normally $Z \\sim \\mathcal{N}(\\mu, \\sigma^2)$, the <strong>Box-Muller transformation</strong> projects two independent standard uniform variables $U_1, U_2 \\sim \\mathcal{U}(0, 1)$ onto independent standard normal variates $Z_0, Z_1$:
    </p>
    <div class="math-display">
        $$Z_0 = \\sqrt{-2 \\ln U_1} \\cos(2\\pi U_2), \\qquad Z_1 = \\sqrt{-2 \\ln U_1} \\sin(2\\pi U_2)$$
    </div>
    <p>
        Scaling and shifting converts standard normal $Z_0$ to any targeted mean $\\mu$ and standard deviation $\\sigma$:
        $$X = \\mu + \\sigma \\cdot Z_0$$
    </p>

    <h3>Cryptographically Secure PRNG (CSPRNG) vs. Standard PRNG</h3>
    <p>
        Standard runtime random functions (such as `Math.random()`, typically backed by the <em>xorshift128+</em> algorithm) prioritize computational throughput over cryptographic security and are predictable if prior internal state registers are exposed. In contrast, <strong>Cryptographically Secure PRNGs (CSPRNG)</strong> (such as `crypto.getRandomValues()` utilizing hardware entropy pools and AES-CTR or ChaCha20 primitives) satisfy the <em>next-bit unpredictability test</em>: given the first $k$ output bits, no polynomial-time algorithm can predict bit $k+1$ with probability exceeding $\\frac{1}{2} + \\epsilon$.
    </p>

    <h3>Fisher-Yates Non-Replacing Sampling Algorithm</h3>
    <p>
        Generating $k$ unique random integers from $[a, b]$ without duplicates uses the optimal $O(k)$ <strong>Fisher-Yates (Knuth) Shuffle</strong>. Starting with array $A$ of length $n = b - a + 1$:
    </p>
    <ol class="example-steps">
        <li>For index $i$ descending from $n - 1$ down to $n - k$:
            $$\\text{Pick random integer } j \\in [0, i]$$
            $$\\text{Swap elements } A[i] \\longleftrightarrow A[j]$$
        </li>
        <li>The trailing $k$ elements form a perfectly unbiased, uniformly distributed random subset without replacement.</li>
    </ol>
</article>
"""

SUBNET_ARTICLE = """
<article class="calculator-article">
    <h2>IPv4 Network Architecture, Binary Boolean Masking &amp; VLSM Subnetting</h2>
    <p>
        In telecommunications and computer networking, the <strong>Internet Protocol Version 4 (IPv4)</strong> architecture structures communication over packet-switched networks using 32-bit logical addresses. Subnetting systematically partitions a monolithic network into smaller, topologically isolated routing domains—optimizing broadcast traffic containment, routing table convergence, and address allocation efficiency.
    </p>

    <h3>The 32-Bit Dual-Field Topology</h3>
    <p>
        An IPv4 address comprises 32 contiguous binary bits grouped into four 8-bit octets separated by decimal periods. A subnet mask divides this 32-bit vector into a <strong>Network Prefix</strong> of length $p$ bits (identifying the administrative routing domain) and a <strong>Host Field</strong> of length $32 - p$ bits (identifying discrete host network interfaces).
    </p>
    <div class="math-display">
        $$\\text{Total Bits} = \\underbrace{b_1 b_2 \\dots b_p}_{\\text{Network Identification Bits}} \\quad \\underbrace{b_{p+1} b_{p+2} \\dots b_{32}}_{\\text{Host Identification Bits}} = 32 \\text{ bits}$$
    </div>

    <h3>Boolean Algebraic Network &amp; Broadcast Derivation</h3>
    <p>
        Routers identify the base <strong>Network Address</strong> by performing a bitwise logical AND operation ($\land$) between the 32-bit IP address vector and the Subnet Mask vector:
    </p>
    <div class="math-display">
        $$\\mathbf{NetID} = \\mathbf{IP} \\land \\mathbf{Mask}$$
    </div>
    <p>
        The <strong>Directed Broadcast Address</strong> (which addresses all hosts on the subnet simultaneously) is derived by setting all host field bits to binary 1, equivalent to a bitwise logical OR ($\\lor$) with the bitwise NOT ($\\neg$) of the mask:
    </p>
    <div class="math-display">
        $$\\mathbf{Broadcast} = \\mathbf{IP} \\lor (\\neg \\mathbf{Mask})$$
    </div>

    <h3>Host Capacity &amp; Usable Address Formulas</h3>
    <p>
        For a given Classless Inter-Domain Routing (CIDR) prefix length $p$ ($1 \\le p \\le 32$), the total address capacity $N_{\\text{total}}$ and usable host address capacity $N_{\\text{usable}}$ evaluate to:
    </p>
    <div class="math-display">
        $$N_{\\text{total}} = 2^{32 - p}, \\qquad N_{\\text{usable}} = \\max\\left(0, 2^{32 - p} - 2\\right)$$
    </div>
    <p>
        The subtraction of $2$ accounts for the reserved base <strong>Network Address</strong> (all host bits $0$) and the <strong>Broadcast Address</strong> (all host bits $1$). Point-to-point links using $/31$ subnetting adhere to RFC 3021 which permits 2 usable hosts without broadcast reservation.
    </p>

    <h3>Classful IPv4 Boundaries vs. RFC 1918 Private Scopes</h3>
    <table class="article-table">
        <thead>
            <tr>
                <th>Address Classification</th>
                <th>Leading Bits / Range</th>
                <th>Default Mask</th>
                <th>RFC 1918 Private Non-Routable Range</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Class A</strong></td>
                <td>$0\\dots$ (1.0.0.0 &ndash; 126.255.255.255)</td>
                <td>255.0.0.0 (/8)</td>
                <td>10.0.0.0 /8 (10.0.0.0 &ndash; 10.255.255.255)</td>
            </tr>
            <tr>
                <td><strong>Class B</strong></td>
                <td>$10\\dots$ (128.0.0.0 &ndash; 191.255.255.255)</td>
                <td>255.255.0.0 (/16)</td>
                <td>172.16.0.0 /12 (172.16.0.0 &ndash; 172.31.255.255)</td>
            </tr>
            <tr>
                <td><strong>Class C</strong></td>
                <td>$110\\dots$ (192.0.0.0 &ndash; 223.255.255.255)</td>
                <td>255.255.255.0 (/24)</td>
                <td>192.168.0.0 /16 (192.168.0.0 &ndash; 192.168.255.255)</td>
            </tr>
            <tr>
                <td><strong>Class D (Multicast)</strong></td>
                <td>$1110\\dots$ (224.0.0.0 &ndash; 239.255.255.255)</td>
                <td>N/A (Group Address)</td>
                <td>239.0.0.0 /8 (Administratively Scoped)</td>
            </tr>
        </tbody>
    </table>

    <h3>Step-by-Step Subnet Calculation Example</h3>
    <p>
        Analyze the host IP address <strong>192.168.10.77</strong> with CIDR prefix <strong>/26</strong>:
    </p>
    <ol class="example-steps">
        <li><strong>Prefix &amp; Subnet Mask:</strong> Prefix $p = 26$. The mask contains 26 consecutive ones followed by 6 zeros:
            $$11111111.11111111.11111111.11000000_2 = \\mathbf{255.255.255.192}$$
        </li>
        <li><strong>Wildcard Mask (Bit Inversion):</strong>
            $$255.255.255.255 - 255.255.255.192 = \\mathbf{0.0.0.63}$$
        </li>
        <li><strong>4th Octet Boolean AND:</strong>
            $$77_{10} = 01001101_2, \\quad 192_{10} = 11000000_2 \\implies 01001101_2 \\land 11000000_2 = 01000000_2 = 64_{10}$$
            $$\\mathbf{Network Address} = \\mathbf{192.168.10.64}$$
        </li>
        <li><strong>Broadcast Address Calculation:</strong>
            $$64 + 63 = 127 \\implies \\mathbf{Broadcast Address} = \\mathbf{192.168.10.127}$$
        </li>
        <li><strong>Usable Host Range:</strong> $\\mathbf{192.168.10.65}$ through $\\mathbf{192.168.10.126}$ ($2^{32-26} - 2 = 64 - 2 = \\mathbf{62 \\text{ usable hosts}}$).</li>
    </ol>
</article>
"""
