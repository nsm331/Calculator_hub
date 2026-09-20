"""Default technical and SEO article content with formal KaTeX formulas for Batch #5 Calculators:
1. Refinance Calculator (Financial)
2. Running Pace Calculator (Fitness & Health)
3. 2D Function Graphing Tool (Math)
4. College GPA Calculator (Other)
"""

REFINANCE_ARTICLE = """
<article class="calculator-article">
    <h2>The Quantitative Economics of Mortgage Refinancing: Net Benefit &amp; Break-Even Analysis</h2>
    <p>
        In personal and corporate debt management, <strong>mortgage refinancing</strong> involves replacing an existing debt obligation with a new financial contract possessing modified principal, nominal interest rate, or amortization duration. Refinancing decisions demand rigorous quantitative modeling to evaluate whether cumulative interest reduction exceeds the transactional friction of closing costs, origination fees, and title insurance.
    </p>

    <h3>Monthly Installment Differential &amp; Cash-Flow Optimization</h3>
    <p>
        Let an unamortized principal balance $B_0$ currently carry a nominal monthly rate $r_{\\text{old}} = \\frac{\\text{APR}_{\\text{old}}}{12}$ with $n_{\\text{old}}$ remaining monthly payments. The baseline monthly installment is given by:
    </p>
    <div class="math-display">
        $$M_{\\text{old}} = B_0 \\left[ \\frac{r_{\\text{old}}(1 + r_{\\text{old}})^{n_{\\text{old}}}}{(1 + r_{\\text{old}})^{n_{\\text{old}}} - 1} \\right]$$
    </div>
    <p>
        Under a refinancing agreement, closing costs $C_{\\text{closing}}$ are either paid out-of-pocket or capitalized into the new loan principal $P_{\\text{new}} = B_0 + C_{\\text{financed}}$. At new periodic rate $r_{\\text{new}}$ over a new amortization horizon $n_{\\text{new}}$, the new monthly payment evaluates to:
    </p>
    <div class="math-display">
        $$M_{\\text{new}} = P_{\\text{new}} \\left[ \\frac{r_{\\text{new}}(1 + r_{\\text{new}})^{n_{\\text{new}}}}{(1 + r_{\\text{new}})^{n_{\\text{new}}} - 1} \\right]$$
    </div>
    <p>
        The immediate periodic cash-flow dividend $\\Delta M$ is expressed as:
    </p>
    <div class="math-display">
        $$\\Delta M = M_{\\text{old}} - M_{\\text{new}}$$
    </div>

    <h3>The Break-Even Horizon Formula</h3>
    <p>
        The <strong>break-even point</strong> $T_{\\text{be}}$ defines the exact operational duration required for cumulative monthly payment reductions to fully recoup aggregate upfront refinancing expenses:
    </p>
    <div class="math-display">
        $$T_{\\text{be}} = \\frac{C_{\\text{closing}}}{\\Delta M} = \\frac{C_{\\text{closing}}}{M_{\\text{old}} - M_{\\text{new}}} \\quad \\text{(in months)}$$
    </div>
    <p>
        If the borrower liquidates the collateral asset or transfers title before interval $T_{\\text{be}}$, refinancing incurs a net capital loss despite lower nominal rates.
    </p>

    <h3>Lifetime Interest Liability Differential</h3>
    <p>
        A lower monthly payment does not inherently guarantee lifetime savings if the term is extended back to 30 years. The total lifetime financial savings $\\Delta S_{\\text{total}}$ evaluates total principal and interest liabilities across both alternatives:
    </p>
    <div class="math-display">
        $$\\Delta S_{\\text{total}} = (n_{\\text{old}} \\times M_{\\text{old}}) - \\left[(n_{\\text{new}} \\times M_{\\text{new}}) + C_{\\text{closing}}\\right]$$
    </div>

    <h3>Step-by-Step Refinancing Appraisal Example</h3>
    <p>
        Consider a homeowner evaluating a refinance scenario under the following parameters:
    </p>
    <ul>
        <li><strong>Current Mortgage:</strong> Remaining Balance $B_0 = \\$300{,}000$, Remaining Term $n_{\\text{old}} = 25 \\text{ years (300 months)}$, Current Rate $= 6.75\\%$, Current Payment $M_{\\text{old}} = \\mathbf{\\$2{,}072.77}$.</li>
        <li><strong>Refinance Offer:</strong> New Rate $= 5.25\\%$, New Term $n_{\\text{new}} = 15 \\text{ years (180 months)}$, Closing Costs $C_{\\text{closing}} = \\$4{,}500$ (paid upfront).</li>
    </ul>
    <ol class="example-steps">
        <li><strong>New Monthly Payment ($M_{\\text{new}}$):</strong>
            <div class="math-display">
                $$r_{\\text{new}} = \\frac{0.0525}{12} = 0.004375, \\quad M_{\\text{new}} = 300{,}000 \\left[\\frac{0.004375(1.004375)^{180}}{(1.004375)^{180} - 1}\\right] = \\mathbf{\\$2{,}411.72}$$
            </div>
        </li>
        <li><strong>Remaining Interest on Current Loan:</strong> $(300 \\times \\$2{,}072.77) - \\$300{,}000 = \\mathbf{\\$321{,}831.00}$.</li>
        <li><strong>Total Interest on 15-Year Refinance:</strong> $(180 \\times \\$2{,}411.72) - \\$300{,}000 = \\mathbf{\\$134{,}109.60}$.</li>
        <li><strong>Net Lifetime Savings:</strong> $\\$321{,}831.00 - \\$134{,}109.60 - \\$4{,}500 = \\mathbf{\\$183{,}221.40}$ in saved interest, retiring debt 10 years earlier!</li>
    </ol>
</article>
"""

RUNNING_PACE_ARTICLE = """
<article class="calculator-article">
    <h2>Exercise Physiology &amp; Kinematics of Running Pace Calculations</h2>
    <p>
        In exercise physiology, athletic conditioning, and competitive distance running, <strong>pace</strong> measures the elapsed duration required to traverse a standardized unit distance (typically minutes per mile or minutes per kilometer). It serves as the fundamental scalar for aerobic threshold pacing, lactate threshold calibration, and race day time management.
    </p>

    <h3>Mathematical Formulation of Velocity and Pace</h3>
    <p>
        Linear velocity $v$ and temporal pace $P$ exist in an inverse proportional relationship derived from classical kinematics:
    </p>
    <div class="math-display">
        $$v = \\frac{d}{t} \\iff P = \\frac{1}{v} = \\frac{t}{d}$$
    </div>
    <p>
        Converting sexagesimal time coordinates ($H$ hours, $M$ minutes, $S$ seconds) into continuous decimal minutes yields:
    </p>
    <div class="math-display">
        $$t_{\\text{minutes}} = 60H + M + \\frac{S}{60}$$
    </div>
    <p>
        Given total distance $d$, the pace per unit distance evaluates to:
    </p>
    <div class="math-display">
        $$P_{\\text{decimal}} = \\frac{t_{\\text{minutes}}}{d} \\implies \\text{Pace Seconds} = (P_{\\text{decimal}} - \\lfloor P_{\\text{decimal}} \\rfloor) \\times 60$$
    </div>

    <h3>Conversion Between Imperial &amp; Metric Pacing</h3>
    <p>
        Because $1 \\text{ mile} = 1.609344 \\text{ kilometers}$, unit paces convert according to fixed international conversion factors:
    </p>
    <div class="math-display">
        $$P_{\\text{km}} = \\frac{P_{\\text{mile}}}{1.609344} = P_{\\text{mile}} \\times 0.621371$$
    </div>
    <div class="math-display">
        $$v_{\\text{mph}} = \\frac{60}{P_{\\text{mile}}}, \\qquad v_{\\text{km/h}} = \\frac{60}{P_{\\text{km}}}$$
    </div>

    <h3>Pete Riegel's Race Time Prediction Formula</h3>
    <p>
        To project performance across disparate race distances (e.g., predicting a marathon time based on a known 10K split), exercise physiologists rely on engineer Pete Riegel's empirical fatigue model:
    </p>
    <div class="math-display">
        $$T_2 = T_1 \\times \\left( \\frac{d_2}{d_1} \\right)^{1.06}$$
    </div>
    <p>
        where $T_1$ is achieved time over distance $d_1$, $T_2$ is estimated completion time for distance $d_2$, and the exponent $1.06$ accounts for cumulative neuromuscular glycogen depletion and lactate accumulation.
    </p>

    <h3>Step-by-Step Pacing Calculation Example</h3>
    <p>
        A runner finishes a <strong>10-kilometer (6.2137-mile)</strong> race in exactly <strong>48 minutes and 30 seconds</strong>:
    </p>
    <ol class="example-steps">
        <li><strong>Decimal Minutes:</strong> $t = 48 + \\frac{30}{60} = \\mathbf{48.50 \\text{ minutes}}$.</li>
        <li><strong>Metric Pace ($P_{\\text{km}}$):</strong> $\\frac{48.50}{10.0} = 4.85 \\text{ min/km} \\implies 4\\text{ mins and } (0.85 \\times 60) = \\mathbf{4\\text{m } 51\\text{s / km}}$.</li>
        <li><strong>Imperial Pace ($P_{\\text{mile}}$):</strong> $\\frac{48.50}{6.21371} = 7.8053 \\text{ min/mile} \\implies 7\\text{ mins and } (0.8053 \\times 60) = \\mathbf{7\\text{m } 48\\text{s / mile}}$.</li>
        <li><strong>Linear Speed:</strong> $v = \\frac{60}{7.8053} = \\mathbf{7.69 \\text{ mph}} \\; (\\mathbf{12.37 \\text{ km/h}})$.</li>
        <li><strong>Predicted Half-Marathon Time ($d_2 = 21.0975 \\text{ km}$):</strong>
            $$T_2 = 48.50 \\times \\left( \\frac{21.0975}{10} \\right)^{1.06} = 48.50 \\times 2.213 = \\mathbf{107.33 \\text{ mins}} \\; (\\mathbf{1\\text{h } 47\\text{m } 20\\text{s}})$$
        </li>
    </ol>
</article>
"""

GRAPHING_ARTICLE = """
<article class="calculator-article">
    <h2>Computational Coordinate Geometry &amp; 2D Function Plotting Architecture</h2>
    <p>
        A <strong>2D function grapher</strong> visualizes continuous and discrete single-variable real mappings $f: \\mathbb{R} \\to \\mathbb{R}$ within the Cartesian coordinate plane $\\mathbb{R}^2$. Modern browser graphics leverage the HTML5 Canvas API and affine geometric transformations to map mathematical world-space coordinates into raster device pixels at 60 frames per second.
    </p>

    <h3>Affine World-to-Screen Coordinate Transformations</h3>
    <p>
        Let the viewport viewing window be bounded by domain $[X_{\\min}, X_{\\max}]$ and codomain $[Y_{\\min}, Y_{\\max}]$. Given a canvas display raster of dimensions $W \\times H$ pixels, any mathematical point $(x_w, y_w)$ transforms into device viewport pixel coordinates $(x_p, y_p)$ via the affine projection:
    </p>
    <div class="math-display">
        $$x_p = W \\cdot \\left[ \\frac{x_w - X_{\\min}}{X_{\\max} - X_{\\min}} \\right]$$
    </div>
    <div class="math-display">
        $$y_p = H \\cdot \\left[ \\frac{Y_{\\max} - y_w}{Y_{\\max} - Y_{\\min}} \\right]$$
    </div>
    <p>
        The vertical component is inverted ($Y_{\\max} - y_w$) because computer graphics display buffers define the origin $(0,0)$ at the <em>top-left</em> corner with positive $y$ descending downwards, contrary to the standard Cartesian orientation.
    </p>

    <h3>Numerical Discontinuity &amp; Asymptote Detection</h3>
    <p>
        When graphing rational and trigonometric functions containing vertical asymptotes (e.g., $f(x) = \\frac{1}{x}$ at $x=0$, or $f(x) = \\tan(x)$ at $x = \\frac{\\pi}{2} + k\\pi$), adjacent sampled pixel vertices would erroneously produce solid vertical connecting lines if naive linear pathing is executed. To prevent graphing artifacts, the plotting engine computes the differential derivative:
    </p>
    <div class="math-display">
        $$\\Delta y_p = |y_p(x_k) - y_p(x_{k-1})|$$
    </div>
    <p>
        If $\\Delta y_p > 0.8H$ and the sign of $f(x)$ abruptly inverts, the engine invokes <code>ctx.moveTo()</code> rather than <code>ctx.lineTo()</code>, breaking the stroke continuity across infinite poles.
    </p>

    <h3>Numerical Derivative Estimation via Central Difference</h3>
    <p>
        Interactive curve analysis calculates instantaneous tangent slopes using the symmetrical central difference algorithm:
    </p>
    <div class="math-display">
        $$f'(x) \\approx \\frac{f(x + h) - f(x - h)}{2h}$$
    </div>
    <p>
        With perturbation step $h = 10^{-5}$, truncation error is $O(h^2)$, providing 10 decimal digits of precision for tangent vectors and local extrema identification.
    </p>

    <h3>Canonical Curve Analysis Example</h3>
    <p>
        Analyzing the cubic polynomial $f(x) = x^3 - 3x$ across the symmetric domain $x \\in [-3, 3]$:
    </p>
    <ol class="example-steps">
        <li><strong>Roots (Zero Crossings):</strong> $x(x^2 - 3) = 0 \\implies x \\in \\{-\\sqrt{3}, 0, \\sqrt{3}\\} \\approx \\{-1.732, 0, 1.732\\}$.</li>
        <li><strong>Critical Points:</strong> $f'(x) = 3x^2 - 3 = 0 \\implies x^2 = 1 \\implies x = \\pm 1$.</li>
        <li><strong>Second Derivative Test:</strong> $f''(x) = 6x$.
            <ul>
                <li>At $x = -1$: $f''(-1) = -6 < 0 \\implies$ <strong>Local Maximum</strong> at $(-1, 2)$.</li>
                <li>At $x = +1$: $f''(1) = +6 > 0 \\implies$ <strong>Local Minimum</strong> at $(1, -2)$.</li>
            </ul>
        </li>
        <li><strong>Inflection Point:</strong> $f''(x) = 0 \\implies (0, 0)$.</li>
    </ol>
</article>
"""

GPA_ARTICLE = """
<article class="calculator-article">
    <h2>Academic Quality Point Systems: The Mathematical Mechanics of GPA</h2>
    <p>
        The <strong>Grade Point Average (GPA)</strong> is a standardized metric utilized across secondary and higher education institutions globally to quantify cumulative academic achievement. Calculating GPA requires a credit-weighted scalar aggregation of discrete alphabetical course evaluations converted into continuous numeric grade quality points.
    </p>

    <h3>The Standard 4.0 Academic Grade Scale</h3>
    <p>
        Most American colleges and universities adhere to the standard 4.0 grading scale established by the College Board and AACRAO:
    </p>
    <table class="article-table">
        <thead>
            <tr>
                <th>Letter Grade</th>
                <th>Percentage Bracket</th>
                <th>Standard Grade Points ($GP$)</th>
                <th>Honors / AP Weighted (+0.5 / +1.0)</th>
            </tr>
        </thead>
        <tbody>
            <tr><td><strong>A+ / A</strong></td><td>93 &ndash; 100%</td><td>4.00</td><td>4.50 / 5.00</td></tr>
            <tr><td><strong>A-</strong></td><td>90 &ndash; 92%</td><td>3.70</td><td>4.20 / 4.70</td></tr>
            <tr><td><strong>B+</strong></td><td>87 &ndash; 89%</td><td>3.30</td><td>3.80 / 4.30</td></tr>
            <tr><td><strong>B</strong></td><td>83 &ndash; 86%</td><td>3.00</td><td>3.50 / 4.00</td></tr>
            <tr><td><strong>B-</strong></td><td>80 &ndash; 82%</td><td>2.70</td><td>3.20 / 3.70</td></tr>
            <tr><td><strong>C+</strong></td><td>77 &ndash; 79%</td><td>2.30</td><td>2.80 / 3.30</td></tr>
            <tr><td><strong>C</strong></td><td>73 &ndash; 76%</td><td>2.00</td><td>2.50 / 3.00</td></tr>
            <tr><td><strong>C-</strong></td><td>70 &ndash; 72%</td><td>1.70</td><td>2.20 / 2.70</td></tr>
            <tr><td><strong>D</strong></td><td>65 &ndash; 69%</td><td>1.00</td><td>1.50 / 2.00</td></tr>
            <tr><td><strong>F</strong></td><td>Below 65%</td><td>0.00</td><td>0.00 / 0.00</td></tr>
        </tbody>
    </table>

    <h3>The Weighted Grade Point Average Formula</h3>
    <p>
        For a student enrolled in $k$ academic courses where course $i$ carries credit weight $C_i$ and earned grade points $GP_i$, the term Grade Point Average evaluates to the weighted arithmetic mean:
    </p>
    <div class="math-display">
        $$\\text{GPA}_{\\text{term}} = \\frac{\\sum_{i=1}^k (C_i \\times GP_i)}{\\sum_{i=1}^k C_i} = \\frac{\\text{Total Quality Points}}{\\text{Total Attempted Credits}}$$
    </div>

    <h3>Cumulative Multi-Semester Aggregation</h3>
    <p>
        Consolidating current semester performance with historical transcripts requires factoring previous cumulative units $C_{\\text{prior}}$ and established cumulative grade point average $\\text{GPA}_{\\text{prior}}$:
    </p>
    <div class="math-display">
        $$\\text{GPA}_{\\text{cum}} = \\frac{(C_{\\text{prior}} \\cdot \\text{GPA}_{\\text{prior}}) + \\sum_{i=1}^k (C_i \\cdot GP_i)}{C_{\\text{prior}} + \\sum_{i=1}^k C_i}$$
    </div>

    <h3>Target GPA Requirement Simulation</h3>
    <p>
        To compute the required target GPA ($GP_{\\text{req}}$) across $C_{\\text{future}}$ upcoming credits needed to graduate with target goal $G_{\\text{target}}$:
    </p>
    <div class="math-display">
        $$GP_{\\text{req}} = \\frac{G_{\\text{target}}(C_{\\text{current}} + C_{\\text{future}}) - (C_{\\text{current}} \\cdot \\text{GPA}_{\\text{current}})}{C_{\\text{future}}}$$
    </div>
    <p>
        If $GP_{\\text{req}} > 4.0$, attaining the target goal is mathematically impossible without retaking previous failed coursework for credit forgiveness.
    </p>

    <h3>Comprehensive Semester GPA Calculation Example</h3>
    <p>
        A student completes 16 semester units with the following academic record:
    </p>
    <ul>
        <li>Organic Chemistry (4.0 credits): Grade <strong>A- (3.70)</strong> $\\implies 4.0 \\times 3.70 = 14.80$ Quality Points</li>
        <li>Linear Algebra (4.0 credits): Grade <strong>A (4.00)</strong> $\\implies 4.0 \\times 4.00 = 16.00$ Quality Points</li>
        <li>Microeconomics (3.0 credits): Grade <strong>B+ (3.30)</strong> $\\implies 3.0 \\times 3.30 = 9.90$ Quality Points</li>
        <li>Academic Writing (3.0 credits): Grade <strong>B (3.00)</strong> $\\implies 3.0 \\times 3.00 = 9.00$ Quality Points</li>
        <li>Physics Laboratory (2.0 credits): Grade <strong>A (4.00)</strong> $\\implies 2.0 \\times 4.00 = 8.00$ Quality Points</li>
    </ul>
    <ol class="example-steps">
        <li><strong>Total Credits Attempted:</strong> $4.0 + 4.0 + 3.0 + 3.0 + 2.0 = \\mathbf{16.0 \\text{ credits}}$.</li>
        <li><strong>Total Quality Points Earned:</strong> $14.80 + 16.00 + 9.90 + 9.00 + 8.00 = \\mathbf{57.70 \\text{ points}}$.</li>
        <li><strong>Semester GPA:</strong> $\\frac{57.70}{16.0} = \\mathbf{3.606 \\approx 3.61}$ (Dean's List Standing).</li>
        <li><strong>Cumulative Update:</strong> If the student previously had 45 credits at a $3.40$ GPA:
            $$\\text{GPA}_{\\text{cum}} = \\frac{(45 \\times 3.40) + 57.70}{45 + 16} = \\frac{153.00 + 57.70}{61.0} = \\frac{210.70}{61.0} = \\mathbf{3.454 \\approx 3.45}$$
        </li>
    </ol>
</article>
"""
