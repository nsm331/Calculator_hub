"""Default technical and SEO article content with formal KaTeX formulas for Batch #3 Calculators:
1. Compound Interest Calculator (Financial)
2. Basal Metabolic Rate (BMR) Calculator (Fitness & Health)
3. Binary & Hexadecimal Converter (Math)
4. Time & Duration Calculator (Other)
"""

COMPOUND_INTEREST_ARTICLE = """
<article class="calculator-article">
    <h2>Understanding Compound Interest: The Mathematical Engine of Wealth</h2>
    <p>
        Compound interest is often referred to as the mathematical cornerstone of modern finance. Unlike simple interest, which computes yields solely on the original principal sum, compound interest accrues on both the initial principal and the accumulated interest from all prior compounding cycles. This creates an exponential growth trajectory over extended time horizons, where your money generates returns that subsequently earn their own returns.
    </p>

    <h3>The Core Compound Interest Formula</h3>
    <p>
        When an initial principal amount $P$ is invested at an annual nominal interest rate $r$ (expressed as a decimal) compounded $n$ times per year over a time horizon of $t$ years, the ending future balance $A$ is given by the standard compounding equation:
    </p>
    <div class="math-display">
        $$A = P \\left(1 + \\frac{r}{n}\\right)^{nt}$$
    </div>

    <p>
        Where each variable represents:
    </p>
    <ul>
        <li><strong>$A$:</strong> Future value of the investment, including both principal and accrued interest.</li>
        <li><strong>$P$:</strong> Initial principal sum invested at time zero.</li>
        <li><strong>$r$:</strong> Annual nominal interest rate (e.g., $7.5\\% = 0.075$).</li>
        <li><strong>$n$:</strong> Compounding frequency per annum (e.g., $n=1$ for annually, $n=4$ for quarterly, $n=12$ for monthly, $n=365$ for daily).</li>
        <li><strong>$t$:</strong> Investment duration in years.</li>
    </ul>

    <h3>Incorporating Regular Periodic Contributions (Future Value of an Annuity)</h3>
    <p>
        In practical wealth building, investors make regular recurring contributions (such as monthly deposits into a retirement account or index fund). When a fixed periodic payment $PMT$ is deposited at the conclusion of each compounding period matching the compounding frequency $n$, the combined terminal value is derived using the future value of an ordinary annuity:
    </p>
    <div class="math-display">
        $$A = P \\left(1 + \\frac{r}{n}\\right)^{nt} + PMT \\times \\left[ \\frac{\\left(1 + \\frac{r}{n}\\right)^{nt} - 1}{\\frac{r}{n}} \\right]$$
    </div>
    <p>
        If deposits are made at the <em>beginning</em> of each period (an annuity due), the periodic payment term is multiplied by an additional compounding factor of $\\left(1 + \\frac{r}{n}\\right)$, reflecting that each contribution enjoys an extra cycle of compound growth:
    </p>
    <div class="math-display">
        $$A_{\\text{due}} = P \\left(1 + \\frac{r}{n}\\right)^{nt} + PMT \\times \\left[ \\frac{\\left(1 + \\frac{r}{n}\\right)^{nt} - 1}{\\frac{r}{n}} \\right] \\times \\left(1 + \\frac{r}{n}\\right)$$
    </div>

    <h3>Annual Percentage Yield (APY) vs. Nominal APR</h3>
    <p>
        Because intra-year compounding generates interest on intermediate interest, the actual effective annual return earned&mdash;known as the <strong>Annual Percentage Yield (APY)</strong> or Effective Annual Rate (EAR)&mdash;surpasses the stated nominal rate $r$:
    </p>
    <div class="math-display">
        $$\\text{APY} = \\left(1 + \\frac{r}{n}\\right)^n - 1$$
    </div>
    <p>
        As $n \\to \\infty$ (continuous compounding), the compounding factor converges to the natural exponential base $e$:
    </p>
    <div class="math-display">
        $$A_{\\text{continuous}} = P e^{rt}, \\quad \\text{APY}_{\\text{continuous}} = e^r - 1$$
    </div>

    <h3>Step-by-Step Practical Calculation Example</h3>
    <p>
        Consider an investor who deposits an initial principal of <strong>$10,000</strong> into a diversified index fund yielding an annual nominal return of <strong>$8\\%$</strong> ($r = 0.08$), compounding <strong>monthly</strong> ($n = 12$). The investor also commits to a monthly contribution of <strong>$250</strong> at the end of each month for <strong>15 years</strong> ($t = 15$):
    </p>
    <ol class="example-steps">
        <li><strong>Periodic Interest Rate:</strong> $i = \\frac{r}{n} = \\frac{0.08}{12} \\approx 0.0066667$ (or $0.6667\\%$ per month).</li>
        <li><strong>Total Compounding Periods:</strong> $N = n \\times t = 12 \\times 15 = 180$ monthly intervals.</li>
        <li><strong>Future Value of Initial Principal:</strong> $FV_{\\text{principal}} = 10{,}000 \\times (1 + 0.0066667)^{180} = 10{,}000 \\times 3.306924 = \\mathbf{\\$33{,}069.24}$.</li>
        <li><strong>Future Value of Monthly Deposits:</strong> $FV_{\\text{deposits}} = 250 \\times \\left[ \\frac{(1 + 0.0066667)^{180} - 1}{0.0066667} \\right] = 250 \\times 346.0386 = \\mathbf{\\$86{,}509.66}$.</li>
        <li><strong>Combined Terminal Portfolio:</strong> $A = \\$33{,}069.24 + \\$86{,}509.66 = \\mathbf{\\$119{,}578.90}$.</li>
        <li><strong>Total Cumulative Contributions:</strong> $10{,}000 + (250 \\times 180) = \\$55{,}000.00$.</li>
        <li><strong>Total Compound Interest Earned:</strong> $\\$119{,}578.90 - \\$55{,}000.00 = \\mathbf{\\$64{,}578.90}$ (Interest exceeds total capital invested by over $117\\%$).</li>
    </ol>

    <h3>The Rule of 72: Quick Mental Estimation</h3>
    <p>
        To approximate how many years it takes for an initial lump-sum investment to double at a given annual compound rate $R$ (in percent), the Rule of 72 provides a remarkably accurate shortcut derived from the natural logarithm of 2:
    </p>
    <div class="math-display">
        $$t_{\\text{double}} \\approx \\frac{72}{R} \\quad \\left(\\text{derived from } t = \\frac{\\ln(2)}{\\ln(1 + r)} \\approx \\frac{0.693}{r} \\right)$$
    </div>
    <p>
        At an $8\\%$ annual return, your capital doubles approximately every $\\frac{72}{8} = 9.0$ years. Over a 36-year investment horizon, that represents four successive doublings: a $16\\times$ multiplication of initial principal.
    </p>
</article>
"""


BMR_ARTICLE = """
<article class="calculator-article">
    <h2>Basal Metabolic Rate (BMR): The Physiology of Human Energy Expenditure</h2>
    <p>
        <strong>Basal Metabolic Rate (BMR)</strong> represents the absolute minimum quantity of caloric energy your body requires to sustain vital physiological functions in a thermoneutral environment while in a post-absorptive, fully rested state. Even when completely motionless, your organs demand substantial energy: the liver and skeletal muscle account for approximately $27\\%$ and $18\\%$ of resting energy respectively, followed by the brain ($19\\%$), kidneys ($10\\%$), and heart ($7\\%$).
    </p>

    <h3>The Scientific Equations: Mifflin-St Jeor vs. Harris-Benedict</h3>
    <p>
        Clinical dietetics utilizes mathematical models validated against indirect calorimetry measurements. The primary and most accurate equation for the general adult population is the <strong>Mifflin-St Jeor Formula</strong> (introduced in 1990), which exhibits a clinical accuracy rate within $\\pm 10\\%$ of measured resting metabolic rate:
    </p>

    <div class="math-display">
        $$\\text{BMR}_{\\text{male}} = (10 \\times m) + (6.25 \\times h) - (5 \\times a) + 5$$
    </div>
    <div class="math-display">
        $$\\text{BMR}_{\\text{female}} = (10 \\times m) + (6.25 \\times h) - (5 \\times a) - 161$$
    </div>

    <p>Where metric variables are defined as:</p>
    <ul>
        <li><strong>$m$:</strong> Body mass in kilograms ($\\text{kg}$). If measuring in pounds, $m = \\frac{\\text{lbs}}{2.20462}$.</li>
        <li><strong>$h$:</strong> Stature / height in centimeters ($\\text{cm}$). If measuring in inches, $h = \\text{inches} \\times 2.54$.</li>
        <li><strong>$a$:</strong> Chronological age in completed years.</li>
    </ul>

    <h3>Revised Harris-Benedict Equation (Roza &amp; Shizgal, 1984)</h3>
    <p>
        Originally formulated in 1919 and rigorously re-evaluated in 1984, the revised Harris-Benedict model remains widely referenced in medical literature:
    </p>
    <div class="math-display">
        $$\\text{BMR}_{\\text{male}} = 88.362 + (13.397 \\times m) + (4.799 \\times h) - (5.677 \\times a)$$
    </div>
    <div class="math-display">
        $$\\text{BMR}_{\\text{female}} = 447.593 + (9.247 \\times m) + (3.098 \\times h) - (4.330 \\times a)$$
    </div>

    <h3>Katch-McArdle Equation: Accounting for Lean Body Mass (LBM)</h3>
    <p>
        For athletes, bodybuilders, or individuals with known body fat percentages, the <strong>Katch-McArdle Formula</strong> provides superior precision by computing metabolic demand directly from metabolically active lean tissue $L$ rather than total gross body weight:
    </p>
    <div class="math-display">
        $$L = m \\times \\left(1 - \\frac{\\%BF}{100}\\right), \\quad \\text{BMR} = 370 + (21.6 \\times L)$$
    </div>

    <h3>From BMR to Total Daily Energy Expenditure (TDEE)</h3>
    <p>
        BMR accounts for approximately $60\\%$ to $75\\%$ of an average person's daily energy output. To determine your total daily calorie requirement, your BMR is multiplied by a Physical Activity Level (PAL) coefficient:
    </p>
    <div class="math-display">
        $$\\text{TDEE} = \\text{BMR} \\times \\text{Activity Factor}$$
    </div>

    <table class="article-table">
        <thead>
            <tr>
                <th>Activity Category</th>
                <th>Multiplier</th>
                <th>Lifestyle Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Sedentary</td>
                <td><strong>1.200</strong></td>
                <td>Desk job, minimal or no deliberate physical exercise</td>
            </tr>
            <tr>
                <td>Lightly Active</td>
                <td><strong>1.375</strong></td>
                <td>Light exercise or sports 1 to 3 days per week</td>
            </tr>
            <tr>
                <td>Moderately Active</td>
                <td><strong>1.550</strong></td>
                <td>Moderate exercise or intense physical training 3 to 5 days per week</td>
            </tr>
            <tr>
                <td>Very Active</td>
                <td><strong>1.725</strong></td>
                <td>Hard exercise or physical labor 6 to 7 days per week</td>
            </tr>
            <tr>
                <td>Extremely Active</td>
                <td><strong>1.900</strong></td>
                <td>Heavy daily training, endurance athletics, or double workout sessions</td>
            </tr>
        </tbody>
    </table>

    <h3>Step-by-Step Practical Calculation Example</h3>
    <p>
        Consider a <strong>32-year-old male</strong> weighing <strong>82 kg</strong> (180.8 lbs) with a height of <strong>180 cm</strong> (5 ft 11 in) who exercises moderately 4 days per week:
    </p>
    <ol class="example-steps">
        <li><strong>Mifflin-St Jeor BMR:</strong>
            $$\\text{BMR} = (10 \\times 82) + (6.25 \\times 180) - (5 \\times 32) + 5 = 820 + 1125 - 160 + 5 = \\mathbf{1{,}790 \\text{ kcal/day}}$$
        </li>
        <li><strong>Harris-Benedict BMR:</strong>
            $$\\text{BMR} = 88.362 + (13.397 \\times 82) + (4.799 \\times 180) - (5.677 \\times 32) = 88.362 + 1098.55 + 863.82 - 181.66 = \\mathbf{1{,}869 \\text{ kcal/day}}$$
        </li>
        <li><strong>TDEE Calculation (Moderately Active = 1.55):</strong>
            $$\\text{TDEE} = 1{,}790 \\times 1.55 = \\mathbf{2{,}775 \\text{ kcal/day}}$$
        </li>
        <li><strong>Target for Safe Fat Loss (0.5 kg / 1.1 lb per week):</strong>
            $$\\text{Daily Target} = 2{,}775 - 500 = \\mathbf{2{,}275 \\text{ kcal/day}}$$
        </li>
    </ol>
</article>
"""


BINARY_HEX_ARTICLE = """
<article class="calculator-article">
    <h2>Positional Number Systems: Binary, Decimal, Hexadecimal &amp; Octal</h2>
    <p>
        In computational science and digital electronics, positional numeral systems represent numerical quantities through radix (base) mathematics. Modern computing architectures operate natively on binary logic (base 2) governed by Boolean algebra and physical transistor states (voltage high vs. voltage low). To render binary byte structures readable to humans, hexadecimal (base 16) and octal (base 8) serve as compact, aligned representations.
    </p>

    <h3>Mathematical Foundations of Radix Systems</h3>
    <p>
        Any positive real integer $N$ represented in a positional base $b$ with digits $d_i \\in \\{0, 1, \\dots, b-1\\}$ evaluates to its standard decimal equivalent through polynomial summation:
    </p>
    <div class="math-display">
        $$N_{10} = \\sum_{i=0}^{k-1} d_i \\cdot b^i = d_{k-1} b^{k-1} + d_{k-2} b^{k-2} + \\dots + d_1 b^1 + d_0 b^0$$
    </div>

    <p>The primary computational radices include:</p>
    <ul>
        <li><strong>Binary (Base 2):</strong> Allowed digits $\\{0, 1\\}$. Weights correspond to powers of two ($2^0=1, 2^1=2, 2^2=4, 2^3=8, \\dots$).</li>
        <li><strong>Octal (Base 8):</strong> Allowed digits $\\{0, 1, 2, 3, 4, 5, 6, 7\\}$. Each octal digit directly encodes exactly 3 binary bits ($2^3 = 8$).</li>
        <li><strong>Decimal (Base 10):</strong> Standard Hindu-Arabic system with digits $\\{0, 1, 2, 3, 4, 5, 6, 7, 8, 9\\}$.</li>
        <li><strong>Hexadecimal (Base 16):</strong> Digits $\\{0, 1, 2, 3, 4, 5, 6, 7, 8, 9, \\text{A}, \\text{B}, \\text{C}, \\text{D}, \\text{E}, \\text{F}\\}$ where $\\text{A}=10, \\dots, \\text{F}=15$. Each hex digit represents exactly one 4-bit nibble ($2^4 = 16$).</li>
    </ul>

    <h3>Conversion Algorithms: The Euclidean Division Chain</h3>
    <p>
        Converting an integer from Decimal (base 10) to any target base $b$ utilizes successive Euclidean integer division with remainders:
    </p>
    <div class="math-display">
        $$N = q_0 \\cdot b + r_0, \\quad q_0 = q_1 \\cdot b + r_1, \\quad \\dots, \\quad q_{m-1} = 0 \\cdot b + r_m$$
    </div>
    <p>
        The digits in base $b$ are the remainders $r_0, r_1, \\dots, r_m$ read in reverse sequence (from most significant digit $r_m$ down to least significant digit $r_0$).
    </p>

    <h3>Direct Bit Grouping: Binary $\\longleftrightarrow$ Hexadecimal</h3>
    <p>
        Because $16 = 2^4$, the conversion between binary and hexadecimal requires zero arithmetic division. Bits are grouped into 4-bit sequences (nibbles) from right to left:
    </p>
    <table class="article-table">
        <thead>
            <tr>
                <th>Hex Digit</th>
                <th>Binary (4-Bit)</th>
                <th>Decimal Value</th>
                <th>Hex Digit</th>
                <th>Binary (4-Bit)</th>
                <th>Decimal Value</th>
            </tr>
        </thead>
        <tbody>
            <tr><td><code>0x0</code></td><td><code>0000</code></td><td>0</td><td><code>0x8</code></td><td><code>1000</code></td><td>8</td></tr>
            <tr><td><code>0x1</code></td><td><code>0001</code></td><td>1</td><td><code>0x9</code></td><td><code>1001</code></td><td>9</td></tr>
            <tr><td><code>0x2</code></td><td><code>0010</code></td><td>2</td><td><code>0xA</code></td><td><code>1010</code></td><td>10</td></tr>
            <tr><td><code>0x3</code></td><td><code>0011</code></td><td>3</td><td><code>0xB</code></td><td><code>1011</code></td><td>11</td></tr>
            <tr><td><code>0x4</code></td><td><code>0100</code></td><td>4</td><td><code>0xC</code></td><td><code>1100</code></td><td>12</td></tr>
            <tr><td><code>0x5</code></td><td><code>0101</code></td><td>5</td><td><code>0xD</code></td><td><code>1101</code></td><td>13</td></tr>
            <tr><td><code>0x6</code></td><td><code>0110</code></td><td>6</td><td><code>0xE</code></td><td><code>1110</code></td><td>14</td></tr>
            <tr><td><code>0x7</code></td><td><code>0111</code></td><td>7</td><td><code>0xF</code></td><td><code>1111</code></td><td>15</td></tr>
        </tbody>
    </table>

    <h3>Two's Complement Signed Integer Representation</h3>
    <p>
        In computer hardware, negative integers are encoded using <strong>Two's Complement</strong>. In an $n$-bit register, the most significant bit (MSB) carries a negative positional weight of $-2^{n-1}$. To negate an integer $X$:
    </p>
    <div class="math-display">
        $$[-X]_{2\\text{'s}} = 2^n - X = (\\sim X) + 1$$
    </div>
    <p>
        Where $\\sim X$ denotes bitwise inversion (flipping all $0$s to $1$s and $1$s to $0$s), followed by incrementing the least significant bit by 1.
    </p>

    <h3>Step-by-Step Conversion Example</h3>
    <p>
        Convert decimal number <strong>$N = 437_{10}$</strong> into Binary and Hexadecimal:
    </p>
    <ol class="example-steps">
        <li><strong>Decimal to Binary via Division by 2:</strong>
            $$\\begin{aligned}
            437 \\div 2 &= 218 \\text{ R } 1 \\\\
            218 \\div 2 &= 109 \\text{ R } 0 \\\\
            109 \\div 2 &= 54 \\text{ R } 1 \\\\
            54 \\div 2 &= 27 \\text{ R } 0 \\\\
            27 \\div 2 &= 13 \\text{ R } 1 \\\\
            13 \\div 2 &= 6 \\text{ R } 1 \\\\
            6 \\div 2 &= 3 \\text{ R } 0 \\\\
            3 \\div 2 &= 1 \\text{ R } 1 \\\\
            1 \\div 2 &= 0 \\text{ R } 1
            \\end{aligned}$$
            Reading remainders bottom to top yields: $\\mathbf{110110101_2}$.
        </li>
        <li><strong>Binary to Hexadecimal via Nibble Grouping:</strong>
            Pad with leading zeros to form 4-bit nibbles:
            $$[0001] \\quad [1011] \\quad [0101]_2$$
            $$0001_2 = 1_{16}, \\quad 1011_2 = \\text{B}_{16} \\, (11), \\quad 0101_2 = 5_{16}$$
            Combining gives: $\\mathbf{0x1B5_{16}}$.
        </li>
        <li><strong>Verification via Hexadecimal Polynomial Expansion:</strong>
            $$1 \\cdot 16^2 + 11 \\cdot 16^1 + 5 \\cdot 16^0 = 256 + 176 + 5 = 437_{10} \\quad \\checkmark$$
        </li>
    </ol>
</article>
"""


TIME_DURATION_ARTICLE = """
<article class="calculator-article">
    <h2>Time and Duration Arithmetic: Sexagesimal Mechanics and Calendrical Precision</h2>
    <p>
        Time calculation involves sexagesimal (base 60) modular arithmetic inherited from ancient Sumerian and Babylonian astronomy. Unlike standard base 10 arithmetic, the subdivisions of time vary across non-uniform units: 60 seconds compose a minute, 60 minutes compose an hour, 24 hours compose a solar day, and months span 28, 29, 30, or 31 days under the Gregorian calendar system.
    </p>

    <h3>Continuous Second Normalization Algorithm</h3>
    <p>
        To execute rigorous operations between arbitrary time spans (such as shift work durations, flight plans, or athletic split times), complex multi-unit values are converted into a singular scalar representing total seconds $T$:
    </p>
    <div class="math-display">
        $$T_{\\text{total}} = (86{,}400 \\times D) + (3{,}600 \\times H) + (60 \\times M) + S$$
    </div>

    <p>
        Where $D$ represents elapsed days, $H$ hours ($0 \\le H < 24$), $M$ minutes ($0 \\le M < 60$), and $S$ seconds ($0 \\le S < 60$). Once mathematical addition or subtraction is performed on $T_{\\text{total}}$, the canonical decomposed components are reconstructed using integer floor division and modulo operators:
    </p>

    <div class="math-display">
        $$\\begin{aligned}
        D &= \\lfloor T / 86{,}400 \\rfloor \\\\
        H &= \\lfloor (T \\pmod{86{,}400}) / 3{,}600 \\rfloor \\\\
        M &= \\lfloor (T \\pmod{3{,}600}) / 60 \\rfloor \\\\
        S &= T \\pmod{60}
        \\end{aligned}$$
    </div>

    <h3>Decimal Time Representation in Payroll and Timesheets</h3>
    <p>
        Corporate payroll and project management systems require converting hours and minutes into a decimal hour float $H_{\\text{decimal}}$ to compute billable compensation:
    </p>
    <div class="math-display">
        $$H_{\\text{decimal}} = H + \\frac{M}{60} + \\frac{S}{3{,}600}$$
    </div>
    <p>
        For instance, an employee who works <strong>7 hours and 45 minutes</strong> has logged:
    </p>
    <div class="math-display">
        $$7 + \\frac{45}{60} = 7 + 0.75 = \\mathbf{7.75 \\text{ decimal hours}}$$
    </div>

    <h3>Time Addition and Subtraction with Sexagesimal Carry/Borrow</h3>
    <p>
        When performing manual multi-unit arithmetic without converting to raw seconds, sexagesimal carry and borrow rules must be applied systematically:
    </p>
    <ul>
        <li><strong>Addition (Carry):</strong> If $S_1 + S_2 \\ge 60$, subtract $60$ from the seconds sum and carry $+1$ to the minutes column. If $M_1 + M_2 \\ge 60$, subtract $60$ from the minutes sum and carry $+1$ to the hours column. If $H_1 + H_2 \\ge 24$, carry $+1$ to elapsed days.</li>
        <li><strong>Subtraction (Borrow):</strong> If $S_1 < S_2$, borrow $1$ minute (converting it to $+60$ seconds). If $M_1 < M_2$, borrow $1$ hour (converting it to $+60$ minutes). If $H_1 < H_2$, borrow $1$ day (converting it to $+24$ hours).</li>
    </ul>

    <h3>Step-by-Step Practical Calculation Example</h3>
    <p>
        A flight departs at <strong>09:42:35 AM</strong> and arrives at destination at <strong>04:18:12 PM</strong> on the same calendar day. Calculate the exact elapsed flight duration:
    </p>
    <ol class="example-steps">
        <li><strong>Convert Times to 24-Hour Military Format:</strong>
            Departure = <code>09:42:35</code>, Arrival = <code>16:18:12</code> ($12 + 4 = 16$).
        </li>
        <li><strong>Seconds Subtraction ($12 - 35$):</strong>
            Because $12 < 35$, borrow 1 minute from the arrival minutes ($18 - 1 = 17$ minutes). Add 60 seconds to arrival seconds: $12 + 60 = 72$. Now, $72 - 35 = \\mathbf{37 \\text{ seconds}}$.
        </li>
        <li><strong>Minutes Subtraction ($17 - 42$):</strong>
            Because $17 < 42$, borrow 1 hour from arrival hours ($16 - 1 = 15$ hours). Add 60 minutes to arrival minutes: $17 + 60 = 77$. Now, $77 - 42 = \\mathbf{35 \\text{ minutes}}$.
        </li>
        <li><strong>Hours Subtraction ($15 - 9$):</strong>
            Compute $15 - 9 = \\mathbf{6 \\text{ hours}}$.
        </li>
        <li><strong>Total Duration:</strong> $\\mathbf{6 \\text{ hours, } 35 \\text{ minutes, } 37 \\text{ seconds}}$.</li>
        <li><strong>Decimal Verification:</strong>
            $$T = (6 \\times 3600) + (35 \\times 60) + 37 = 21{,}600 + 2{,}100 + 37 = 23{,}737 \\text{ seconds}$$
            $$H_{\\text{decimal}} = \\frac{23{,}737}{3600} \\approx \\mathbf{6.5936 \\text{ hours}}$$
        </li>
    </ol>
</article>
"""
