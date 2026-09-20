"""Default technical and SEO article content with formal KaTeX formulas for Batch #4 Calculators:
1. Amortization Calculator (Financial)
2. Ideal Body Weight (IBW) Calculator (Fitness & Health)
3. Decimal to Fraction Converter (Math)
4. Work Hours & Timesheet Calculator (Other)
"""

AMORTIZATION_ARTICLE = """
<article class="calculator-article">
    <h2>The Mathematics of Loan Amortization: Debt Liquidation Mechanics</h2>
    <p>
        In mathematical finance, <strong>amortization</strong> refers to the structured process of gradually retiring a financial debt obligation through a scheduled sequence of periodic level annuity payments. Each fixed installment comprises two interdependent components: an interest charge assessed by the lender on the unamortized principal balance, and a principal reduction component that liquidates the underlying debt.
    </p>

    <h3>The Classical Amortization Formula</h3>
    <p>
        Given a principal borrowing sum $P$ financed at a periodic interest rate $r = \\frac{\\text{APR}}{m}$ across $n = m \\times t$ total compounding payment intervals (where $m$ is annual frequency and $t$ is duration in years), the uniform periodic payment $M$ is derived from the present value of an ordinary annuity:
    </p>
    <div class="math-display">
        $$M = P \\left[ \\frac{r(1 + r)^n}{(1 + r)^n - 1} \\right]$$
    </div>

    <h3>Decomposition of Payment Intervals (Principal vs. Interest)</h3>
    <p>
        Because interest is computed strictly on the remaining outstanding balance, the proportions of principal and interest evolve continuously across the life of the loan. At any given installment interval $k \\in \\{1, 2, \\dots, n\\}$:
    </p>
    <ul>
        <li><strong>Interest Component ($I_k$):</strong> The interest liability accrued over period $k$ depends on the preceding balance $B_{k-1}$:
            <div class="math-display">
                $$I_k = B_{k-1} \\cdot r$$
            </div>
        </li>
        <li><strong>Principal Amortization Component ($PR_k$):</strong> The remaining fraction of the monthly installment directly retires the loan balance:
            <div class="math-display">
                $$PR_k = M - I_k = M - (B_{k-1} \\cdot r)$$
            </div>
        </li>
        <li><strong>Unamortized Remaining Balance ($B_k$):</strong> The loan balance immediately following payment $k$ evaluates to:
            <div class="math-display">
                $$B_k = P \\left[ \\frac{(1 + r)^n - (1 + r)^k}{(1 + r)^n - 1} \\right]$$
            </div>
        </li>
    </ul>

    <h3>The Transformative Impact of Extra Principal Curtailments</h3>
    <p>
        When a borrower contributes an additional lump-sum or recurring prepayment $\\Delta P$ toward principal, it reduces $B_k$ directly without generating interest. This shortens the remaining term $n^*$ according to logarithmic reduction:
    </p>
    <div class="math-display">
        $$n^* = - \\frac{\\ln\\left(1 - \\frac{r \\cdot B_k}{M + \\Delta P}\\right)}{\\ln(1 + r)}$$
    </div>
    <p>
        Even modest recurring prepayments dramatically diminish the total cumulative interest paid over a 30-year fixed loan, frequently trimming 4 to 8 years off the repayment schedule.
    </p>

    <h3>Step-by-Step Amortization Example</h3>
    <p>
        Consider a loan of <strong>$200,000</strong> financed at an annual interest rate of <strong>$6.0\\%$</strong> ($r = \\frac{0.06}{12} = 0.005$) over a <strong>30-year term</strong> ($n = 360$ months):
    </p>
    <ol class="example-steps">
        <li><strong>Fixed Monthly Payment ($M$):</strong>
            $$M = 200{,}000 \\times \\left[ \\frac{0.005(1.005)^{360}}{(1.005)^{360} - 1} \\right] = 200{,}000 \\times 0.0059955 = \\mathbf{\\$1{,}199.10}$$
        </li>
        <li><strong>Month 1 Breakdown:</strong>
            <ul>
                <li>Interest Charge: $I_1 = \\$200{,}000 \\times 0.005 = \\mathbf{\\$1{,}000.00}$ ($83.4\\%$ of payment).</li>
                <li>Principal Paid: $PR_1 = \\$1{,}199.10 - \\$1{,}000.00 = \\mathbf{\\$199.10}$ ($16.6\\%$ of payment).</li>
                <li>Ending Balance: $B_1 = \\$200{,}000 - \\$199.10 = \\mathbf{\\$199{,}800.90}$.</li>
            </ul>
        </li>
        <li><strong>Month 180 (Year 15 Milestone):</strong>
            <ul>
                <li>Remaining Balance: $B_{180} = \\mathbf{\\$142{,}217.48}$.</li>
                <li>Interest Charge: $I_{181} = \\$142{,}217.48 \\times 0.005 = \\mathbf{\\$711.09}$.</li>
                <li>Principal Paid: $PR_{181} = \\$1{,}199.10 - \\$711.09 = \\mathbf{\\$488.01}$.</li>
            </ul>
        </li>
        <li><strong>Total Interest Over 30 Years:</strong> $(360 \\times \\$1{,}199.10) - \\$200{,}000 = \\mathbf{\\$231{,}676.00}$ (Interest exceeds initial borrowed capital).</li>
    </ol>
</article>
"""


IDEAL_WEIGHT_ARTICLE = """
<article class="calculator-article">
    <h2>Ideal Body Weight (IBW): Clinical Pharmacology &amp; Anthropometric Models</h2>
    <p>
        <strong>Ideal Body Weight (IBW)</strong> is a standardized medical benchmark originally developed in clinical pharmacology to compute therapeutic drug dosages for narrow therapeutic index medications (such as aminoglycosides, theophylline, and anaesthetic agents). In obese or severely underweight individuals, gross body mass fails to represent drug distribution volume accurately because adipose tissue has lower metabolic clearance and blood perfusion than lean tissue.
    </p>

    <h3>The Classical Anthropometric Formulations</h3>
    <p>
        Clinical algorithms model ideal body weight based on stature (height) relative to a 5-foot (60-inch / 152.4 cm) baseline. Letting $h_{\\text{over5ft}} = \\text{height (inches)} - 60$:
    </p>

    <h4>1. Devine Formula (1974) &mdash; Medical Gold Standard</h4>
    <p>
        Formulated by Dr. Ben J. Devine, this is the most universally adopted benchmark in pharmacokinetics:
    </p>
    <div class="math-display">
        $$\\begin{aligned}
        \\text{IBW}_{\\text{male}} &= 50.0 \\text{ kg} + 2.3 \\text{ kg} \\times h_{\\text{over5ft}} \\\\
        \\text{IBW}_{\\text{female}} &= 45.5 \\text{ kg} + 2.3 \\text{ kg} \\times h_{\\text{over5ft}}
        \\end{aligned}$$
    </div>

    <h4>2. Robinson Formula (1983)</h4>
    <p>
        An empirical modification of Devine based on metropolitan life insurance actuarial studies:
    </p>
    <div class="math-display">
        $$\\begin{aligned}
        \\text{IBW}_{\\text{male}} &= 52.0 \\text{ kg} + 1.9 \\text{ kg} \\times h_{\\text{over5ft}} \\\\
        \\text{IBW}_{\\text{female}} &= 49.0 \\text{ kg} + 1.7 \\text{ kg} \\times h_{\\text{over5ft}}
        \\end{aligned}$$
    </div>

    <h4>3. Miller Formula (1983)</h4>
    <p>
        Introduced to better align recommendations with athletic populations:
    </p>
    <div class="math-display">
        $$\\begin{aligned}
        \\text{IBW}_{\\text{male}} &= 56.2 \\text{ kg} + 1.41 \\text{ kg} \\times h_{\\text{over5ft}} \\\\
        \\text{IBW}_{\\text{female}} &= 53.1 \\text{ kg} + 1.36 \\text{ kg} \\times h_{\\text{over5ft}}
        \\end{aligned}$$
    </div>

    <h4>4. Hamwi Formula (1964) &mdash; Clinical Nutrition Rule of Thumb</h4>
    <div class="math-display">
        $$\\begin{aligned}
        \\text{IBW}_{\\text{male}} &= 48.0 \\text{ kg} + 2.7 \\text{ kg} \\times h_{\\text{over5ft}} \\quad (106 \\text{ lbs} + 6 \\text{ lbs/in}) \\\\
        \\text{IBW}_{\\text{female}} &= 45.5 \\text{ kg} + 2.2 \\text{ kg} \\times h_{\\text{over5ft}} \\quad (100 \\text{ lbs} + 5 \\text{ lbs/in})
        \\end{aligned}$$
    </div>

    <h3>World Health Organization (WHO) Healthy Weight Range</h3>
    <p>
        Because physiological body types vary across bone density and muscle mass, modern epidemiologists recommend an <strong>optimal weight target range</strong> derived from healthy Body Mass Index thresholds ($18.5 \\le \\text{BMI} \\le 24.9\\text{ kg/m}^2$):
    </p>
    <div class="math-display">
        $$W_{\\text{min}} = 18.5 \\times h_{\\text{m}}^2, \\quad W_{\\text{max}} = 24.9 \\times h_{\\text{m}}^2$$
    </div>

    <h3>Step-by-Step Practical Calculation Example</h3>
    <p>
        Determine the ideal body weight for a <strong>female measuring 5 ft 7 in (170.2 cm)</strong>:
    </p>
    <ol class="example-steps">
        <li><strong>Inches Above 5 Feet:</strong> $h = 67 - 60 = 7\\text{ inches}$.</li>
        <li><strong>Devine Formula:</strong> $\\text{IBW} = 45.5 + (2.3 \\times 7) = 45.5 + 16.1 = \\mathbf{61.6\\text{ kg}} \\, (135.8\\text{ lbs})$.</li>
        <li><strong>Robinson Formula:</strong> $\\text{IBW} = 49.0 + (1.7 \\times 7) = 49.0 + 11.9 = \\mathbf{60.9\\text{ kg}} \\, (134.3\\text{ lbs})$.</li>
        <li><strong>Miller Formula:</strong> $\\text{IBW} = 53.1 + (1.36 \\times 7) = 53.1 + 9.52 = \\mathbf{62.6\\text{ kg}} \\, (138.0\\text{ lbs})$.</li>
        <li><strong>WHO Normal Weight Range ($h = 1.702\\text{ m}$):</strong>
            $$\\begin{aligned}
            W_{\\text{min}} &= 18.5 \\times (1.702)^2 = \\mathbf{53.6\\text{ kg}} \\, (118.2\\text{ lbs}) \\\\
            W_{\\text{max}} &= 24.9 \\times (1.702)^2 = \\mathbf{72.1\\text{ kg}} \\, (159.0\\text{ lbs})
            \\end{aligned}$$
        </li>
    </ol>
</article>
"""


DECIMAL_TO_FRACTION_ARTICLE = """
<article class="calculator-article">
    <h2>Converting Decimals to Fractions: Number Theory &amp; Algebraic Reduction</h2>
    <p>
        In real arithmetic, rational numbers $\\mathbb{Q}$ represent numerical quantities expressible as the quotient of two coprime integers $\\frac{p}{q}$ ($q \\ne 0$). Decimal representations divide fundamentally into two categories: <strong>terminating decimals</strong>, whose prime factors of the denominator consist strictly of powers of 2 and 5 ($q = 2^a 5^b$), and <strong>periodic repeating decimals</strong>, which feature an infinitely recurring digit sequence (repetend).
    </p>

    <h3>1. Terminating Decimals: Base-10 Integer Decoupling</h3>
    <p>
        A terminating decimal with $k$ fractional digits is expressed as an integer fraction over $10^k$:
    </p>
    <div class="math-display">
        $$x = \\frac{N}{10^k}, \\quad \\text{where } N = x \\times 10^k$$
    </div>
    <p>
        The resulting fraction is reduced to canonical lowest terms by dividing both numerator and denominator by their <strong>Greatest Common Divisor (GCD)</strong> using the Euclidean Algorithm:
    </p>
    <div class="math-display">
        $$p = \\frac{N}{\\gcd(N, 10^k)}, \\quad q = \\frac{10^k}{\\gcd(N, 10^k)}$$
    </div>

    <h3>2. Periodic Repeating Decimals: Algebraic Elimination Method</h3>
    <p>
        For repeating decimals having a non-repeating transient part $a$ of length $m$ followed by a repeating repetend $b$ of length $n$ ($x = 0.a\\overline{b}$), algebra eliminates the infinite fractional tail:
    </p>
    <div class="math-display">
        $$\\begin{aligned}
        10^m x &= a.\\overline{b} \\\\
        10^{m+n} x &= ab.\\overline{b}
        \\end{aligned}$$
    </div>
    <p>
        Subtracting the two equations cancels the infinite decimal mantissa:
    </p>
    <div class="math-display">
        $$(10^{m+n} - 10^m) x = ab - a \\implies x = \\frac{ab - a}{10^m (10^n - 1)}$$
    </div>

    <h3>Architectural &amp; Construction Standard Inch Fractions</h3>
    <p>
        In manufacturing, carpentry, and mechanical engineering, decimal dimensions must map to standard fractional inch increments ($\\frac{1}{16}$, $\\frac{1}{32}$, or $\\frac{1}{64}$). To find the nearest $D$-th of an inch:
    </p>
    <div class="math-display">
        $$\\text{Fraction Numerator} = \\text{round}(x \\times D), \\quad \\text{Nearest Inch} = \\frac{\\text{round}(x \\times D)}{D}$$
    </div>

    <h3>Step-by-Step Conversion Examples</h3>
    <h4>Example A: Terminating Decimal ($x = 0.375$)</h4>
    <ol class="example-steps">
        <li>Count decimal digits: $k = 3 \\implies \\text{Denominator} = 10^3 = 1{,}000$.</li>
        <li>Set up raw fraction: $\\frac{375}{1000}$.</li>
        <li>Find $\\gcd(375, 1000) = 125$.</li>
        <li>Divide: $\\frac{375 \\div 125}{1000 \\div 125} = \\mathbf{\\frac{3}{8}}$.</li>
    </ol>

    <h4>Example B: Repeating Decimal ($x = 0.1666\\dots = 0.1\\overline{6}$)</h4>
    <ol class="example-steps">
        <li>Transient length $m = 1$ ($a = 1$), repetend length $n = 1$ ($b = 6$).</li>
        <li>Set up equations:
            $$\\begin{aligned}
            10^1 x &= 1.\\overline{6} \\\\
            10^2 x &= 16.\\overline{6}
            \\end{aligned}$$
        </li>
        <li>Subtract: $100x - 10x = 16 - 1 \\implies 90x = 15$.</li>
        <li>Reduce fraction: $\\frac{15}{90} = \\frac{15 \\div 15}{90 \\div 15} = \\mathbf{\\frac{1}{6}}$.</li>
    </ol>
</article>
"""


WORK_HOURS_ARTICLE = """
<article class="calculator-article">
    <h2>Work Hours, Timesheets &amp; Overtime Payroll Accounting</h2>
    <p>
        Accurate work hours tracking is governed by labor compliance standards such as the Fair Labor Standards Act (FLSA) in the United States and the Working Time Directive in the European Union. Precise timesheet computation requires converting clock-in and clock-out timestamps from non-uniform sexagesimal hours and minutes into normalized <strong>decimal hours</strong> to calculate gross employee compensation and statutory overtime liabilities.
    </p>

    <h3>Sexagesimal to Decimal Hours Transformation</h3>
    <p>
        In enterprise payroll software, recorded work durations $H$ hours and $M$ minutes must be converted into a continuous floating-point scalar:
    </p>
    <div class="math-display">
        $$H_{\\text{decimal}} = H + \\frac{M}{60} + \\frac{S}{3{,}600}$$
    </div>
    <p>
        For instance, an employee who works from <strong>08:30 AM</strong> to <strong>05:15 PM</strong> with a <strong>45-minute unpaid lunch break</strong> has logged:
    </p>
    <div class="math-display">
        $$\\text{Total Elapsed} = 8\\text{ hrs } 45\\text{ mins}, \\quad \\text{Net Worked} = 8\\text{ hrs } 0\\text{ mins} = \\mathbf{8.000 \\text{ decimal hours}}$$
    </div>

    <h3>Overtime Remuneration Models</h3>
    <p>
        Statutory employment regulations mandate premium overtime pay rates when working hours exceed standard contractual thresholds:
    </p>
    <ul>
        <li><strong>Weekly Overtime Threshold:</strong> In most jurisdictions, hours worked beyond 40.0 hours in a 7-day workweek are compensated at $1.5\\times$ the base regular hourly rate $R$ (time-and-a-half):
            <div class="math-display">
                $$\\text{Weekly Gross} = (H_{\\text{reg}} \\times R) + (H_{\\text{OT}} \\times 1.5 R)$$
            </div>
        </li>
        <li><strong>Daily Overtime Threshold:</strong> Jurisdictions such as California mandate overtime for all hours worked in excess of 8.0 hours in a single 24-hour workday, and double-time ($2.0\\times R$) for hours worked past 12.0 hours.</li>
    </ul>

    <h3>The 7-Minute / 15-Minute Payroll Rounding Rule (FLSA 29 CFR &sect; 785.48)</h3>
    <p>
        Under FLSA guidelines, employers are legally permitted to round employee punch times to the nearest quarter-hour (15 minutes). The standard <strong>7-minute rule</strong> states:
    </p>
    <ul>
        <li>Punches within 1 to 7 minutes past the quarter-hour round <em>down</em> to the prior quarter-hour.</li>
        <li>Punches within 8 to 14 minutes past the quarter-hour round <em>up</em> to the next quarter-hour.</li>
    </ul>

    <h3>Step-by-Step Weekly Timesheet Calculation Example</h3>
    <table class="article-table">
        <thead>
            <tr>
                <th>Day</th>
                <th>Shift In / Out</th>
                <th>Unpaid Break</th>
                <th>Daily Total</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Monday</td><td>08:00 &ndash; 17:00</td><td>60 mins</td><td>8.00 hrs</td></tr>
            <tr><td>Tuesday</td><td>08:00 &ndash; 17:30</td><td>60 mins</td><td>8.50 hrs</td></tr>
            <tr><td>Wednesday</td><td>08:00 &ndash; 18:00</td><td>60 mins</td><td>9.00 hrs</td></tr>
            <tr><td>Thursday</td><td>08:30 &ndash; 17:30</td><td>45 mins</td><td>8.25 hrs</td></tr>
            <tr><td>Friday</td><td>08:00 &ndash; 17:00</td><td>30 mins</td><td>8.50 hrs</td></tr>
            <tr><td><strong>Total Weekly</strong></td><td colspan="2"><strong>Base Rate: $25.00 / hr</strong></td><td><strong>42.25 hrs</strong></td></tr>
        </tbody>
    </table>

    <ol class="example-steps">
        <li><strong>Regular Hours ($H_{\\text{reg}}$):</strong> $\\min(42.25, 40.0) = \\mathbf{40.00 \\text{ hours}}$.</li>
        <li><strong>Overtime Hours ($H_{\\text{OT}}$):</strong> $\\max(0, 42.25 - 40.0) = \\mathbf{2.25 \\text{ hours}}$.</li>
        <li><strong>Regular Pay:</strong> $40.00 \\times \\$25.00 = \\mathbf{\\$1{,}000.00}$.</li>
        <li><strong>Overtime Pay ($1.5 \\times \\$25.00 = \\$37.50$):</strong> $2.25 \\times \\$37.50 = \\mathbf{\\$84.38}$.</li>
        <li><strong>Total Gross Earnings:</strong> $\\$1{,}000.00 + \\$84.38 = \\mathbf{\\$1{,}084.38}$.</li>
    </ol>
</article>
"""
