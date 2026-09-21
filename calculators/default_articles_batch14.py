"""
Default KaTeX-formatted SEO educational articles for Batch #14 Calculators.
Each article contains comprehensive, academic, 400+ word guides with LaTeX formulas.
"""

APR_APY_ARTICLE = r"""
<div class="article-content">
    <h2>Financial Mathematics: APR vs. APY and Compounding Mechanics</h2>
    <p>
        In banking, consumer credit, and institutional capital markets, interest rates are quoted under two distinct regulatory standards: <strong>Annual Percentage Rate (APR)</strong> and <strong>Annual Percentage Yield (APY)</strong> (also known as the <em>Effective Annual Rate</em> or <em>EAR</em>). While both metrics quantify the cost of debt or the return on an investment over a one-year horizon, their fundamental mathematical divergence stems from the treatment of <strong>intra-year compound interest</strong>.
    </p>

    <h3>Mathematical Definition of Nominal APR</h3>
    <p>
        The <strong>Annual Percentage Rate (APR)</strong> represents a simple, nominal interest rate annualized without compounding. If an institution assesses a periodic interest rate $i$ over $m$ compounding periods per calendar year (e.g., monthly where $m = 12$, or daily where $m = 365$), the nominal APR is defined as:
    </p>
    <p>
        $$\text{APR} = m \cdot i$$
    </p>
    <p>
        Because APR multiplies the periodic rate linearly, it ignores the critical reality that interest accumulated during early cycles generates its own interest in subsequent cycles. Consequently, APR systematically understates the true economic compounding cost of borrowing and the true wealth accumulation of savings.
    </p>

    <h3>Mathematical Formulation of Effective APY (EAR)</h3>
    <p>
        The <strong>Annual Percentage Yield (APY)</strong> reflects the total interest earned or paid over a full year, incorporating compound interest across all discrete intervals:
    </p>
    <p>
        $$\text{APY} = \left( 1 + \frac{\text{APR}}{m} \right)^m - 1$$
    </p>
    <p>
        Conversely, when converting a stated target APY back into its nominal equivalent APR:
    </p>
    <p>
        $$\text{APR} = m \cdot \left[ (1 + \text{APY})^{1/m} - 1 \right]$$
    </p>

    <h3>The Continuous Compounding Limit</h3>
    <p>
        As the compounding frequency approaches infinity ($m \to \infty$), the discrete compounding equation converges to Euler's exponential constant $e$:
    </p>
    <p>
        $$\lim_{m \to \infty} \left( 1 + \frac{\text{APR}}{m} \right)^m = e^{\text{APR}}$$
    </p>
    <p>
        Hence, under continuous compounding:
    </p>
    <p>
        $$\text{APY}_{\text{continuous}} = e^{\text{APR}} - 1, \quad \text{APR}_{\text{continuous}} = \ln(1 + \text{APY})$$
    </p>

    <h3>The Impact of Compounding Frequency</h3>
    <p>
        For any non-zero interest rate ($\text{APR} > 0$), as the number of compounding cycles per year $m$ increases, the resulting APY increases monotonically:
    </p>
    <p>
        $$\text{APY}_{\text{annual}} < \text{APY}_{\text{quarterly}} < \text{APY}_{\text{monthly}} < \text{APY}_{\text{daily}} < \text{APY}_{\text{continuous}}$$
    </p>
    <p>
        For example, a nominal APR of $18.0\%$ (common on credit cards) compounded monthly ($m=12$) yields an effective APY of:
    </p>
    <p>
        $$\text{APY} = \left( 1 + \frac{0.18}{12} \right)^{12} - 1 = (1.015)^{12} - 1 \approx 19.56\%$$
    </p>
    <p>
        If compounded daily ($m=365$), the APY rises to $19.72\%$, creating a $172\text{ basis point}$ divergence from the advertised nominal APR.
    </p>

    <h3>Regulatory Disclosure Asymmetry: Borrowers vs. Savers</h3>
    <p>
        In consumer finance law (such as the US <em>Truth in Lending Act</em> [TILA] and <em>Truth in Savings Act</em> [TISA]), financial institutions strategically utilize these mathematical differences:
    </p>
    <ul>
        <li><strong>Lenders (Credit Cards, Auto Loans, Mortgages):</strong> Primarily emphasize <strong>APR</strong> because a nominal number appears lower, minimizing consumer perception of high borrowing costs.</li>
        <li><strong>Deposit Institutions (High-Yield Savings, CDs):</strong> Prominently advertise <strong>APY</strong> because compounding inflation renders the yield figure higher, maximizing marketing appeal to depositors.</li>
    </ul>
</div>
"""

BAC_ARTICLE = r"""
<div class="article-content">
    <h2>Forensic Pharmacokinetics of Blood Alcohol Concentration (BAC)</h2>
    <p>
        <strong>Blood Alcohol Concentration (BAC)</strong>, also termed Blood Alcohol Content or blood ethanol concentration, measures the mass of ethyl alcohol (ethanol, $\text{C}_2\text{H}_5\text{OH}$) present in a specified volume of blood, conventionally expressed as grams of ethanol per $100\text{ mL}$ of blood (grams percent, $\% \text{w/v}$). In clinical toxicology and forensic traffic jurisprudence, BAC serves as the universal objective metric of physiological alcohol impairment.
    </p>

    <h3>The Classical Widmark Kinetic Equation</h3>
    <p>
        In 1932, Swedish forensic scientist Erik M. P. Widmark formulated the foundational pharmacokinetic single-compartment model predicting blood ethanol absorption and elimination:
    </p>
    <p>
        $$\text{BAC}(t) = \left[ \frac{A}{W \cdot r} \times 100 \right] - (\beta \cdot t)$$
    </p>
    <p>
        Where the variables denote:
    </p>
    <ul>
        <li><strong>$A$:</strong> Total mass of pure ethanol ingested, measured in grams ($\text{g}$).</li>
        <li><strong>$W$:</strong> Total body mass of the subject, measured in grams ($\text{g}$). ($1\text{ lb} \approx 453.592\text{ g}$, $1\text{ kg} = 1000\text{ g}$).</li>
        <li><strong>$r$:</strong> Gender-specific Widmark volume of distribution factor ($\text{L/kg}$ or unitless ratio), quantifying the fraction of total body weight consisting of aqueous tissue into which alcohol dissolves.</li>
        <li><strong>$\beta$:</strong> Metabolic elimination rate of ethanol from the bloodstream per hour (linear clearance rate, typically $\beta \approx 0.015\%\text{ per hour}$).</li>
        <li><strong>$t$:</strong> Total elapsed time in hours since the onset of alcohol consumption ($t \ge 0$).</li>
    </ul>

    <h3>Gender Divergence in Volume of Distribution ($r$)</h3>
    <p>
        Ethanol is a polar, water-soluble hydrophilic molecule that dissolves readily in aqueous body water but does not partition into lipid adipose tissue. Because average female body composition exhibits a higher percentage of adipose tissue and lower total body water ($TBW$) relative to males of identical body weight, Widmark established distinct distribution constants:
    </p>
    <ul>
        <li><strong>Male Distribution Constant:</strong> $r_{\text{male}} \approx 0.68$ (range $0.60 - 0.75$).</li>
        <li><strong>Female Distribution Constant:</strong> $r_{\text{female}} \approx 0.55$ (range $0.50 - 0.62$).</li>
    </ul>
    <p>
        Consequently, an identical mass of alcohol consumed by a female will yield a substantially higher peak BAC than in an identically weighted male.
    </p>

    <h3>Standard Drink Quantification</h3>
    <p>
        Under United States public health guidelines, one standard drink contains exactly $14.0\text{ grams}$ ($0.6\text{ fluid ounces}$ or $17.7\text{ mL}$) of pure ethanol:
    </p>
    <ul>
        <li><strong>Beer:</strong> $12\text{ fl oz}$ ($355\text{ mL}$) of standard lager at $5.0\%\text{ ABV} = 14.0\text{ g ethanol}$.</li>
        <li><strong>Wine:</strong> $5\text{ fl oz}$ ($148\text{ mL}$) of table wine at $12.0\%\text{ ABV} = 14.0\text{ g ethanol}$.</li>
        <li><strong>Distilled Spirits:</strong> $1.5\text{ fl oz}$ ($44\text{ mL}$) shot of $80\text{-proof}$ liquor at $40.0\%\text{ ABV} = 14.0\text{ g ethanol}$.</li>
    </ul>

    <h3>Hepatic Zero-Order Elimination Rate ($\beta$)</h3>
    <p>
        Unlike most pharmaceutical xenobiotics that clear via first-order kinetics (proportional to concentration), ethanol metabolism in the liver follows <strong>zero-order (Michaelis-Menten saturated) kinetics</strong> at clinically relevant blood concentrations. The primary hepatic enzyme, <em>alcohol dehydrogenase</em> ($\text{ADH}$), becomes fully saturated at low concentrations ($\text{BAC} \ge 0.02\%$), resulting in a constant linear clearance rate:
    </p>
    <p>
        $$\beta_{\text{average}} \approx 0.015\%\text{ to } 0.017\%\text{ BAC per hour}$$
    </p>
    <p>
        To determine the post-drinking duration required to achieve complete physiological sobriety ($\text{BAC} = 0.000\%$):
    </p>
    <p>
        $$t_{\text{sober}} = \frac{\text{BAC}_{\text{peak}}}{\beta} = \frac{\text{BAC}_{\text{peak}}}{0.015}$$
    </p>

    <h3>Clinical & Legal Impairment Spectrum</h3>
    <p>
        Neurochemical depression of the central nervous system ($\text{GABA}_A$ receptor agonism and $\text{NMDA}$ glutamate inhibition) correlates directly with systemic BAC:
    </p>
    <ul>
        <li><strong>$0.020\% - 0.039\%$:</strong> Mild euphoria, relaxation, minor loss of fine motor coordination.</li>
        <li><strong>$0.040\% - 0.079\%$:</strong> Lowered inhibitions, delayed braking reaction times, impaired peripheral vision and divided attention.</li>
        <li><strong>$0.080\%$ (US Legal Limit):</strong> Gross motor coordination loss, slurred speech, marked sensory processing impairment. Driving is illegal in all 50 US states.</li>
        <li><strong>$0.150\% - 0.250\%$:</strong> Severe dysphoria, motor ataxia, blackout risk, vomiting.</li>
        <li><strong>$\ge 0.350\%$:</strong> Critical risk of fatal respiratory depression, coma, and autonomic arrest.</li>
    </ul>
</div>
"""

QUADRATIC_ARTICLE = r"""
<div class="article-content">
    <h2>Algebraic Theory of Quadratic Equations, Discriminant Analysis & Parabolic Geometry</h2>
    <p>
        A <strong>quadratic equation</strong> is a second-degree polynomial equation in a single variable $x$, defined in standard form as:
    </p>
    <p>
        $$a x^2 + b x + c = 0 \quad (a \ne 0)$$
    </p>
    <p>
        where $a$, $b$, and $c$ represent real (or complex) numerical coefficients, with quadratic coefficient $a$, linear coefficient $b$, and constant term $c$. The solution set of this equation represents the $x$-intercepts (roots or zeros) of the corresponding quadratic parabola function $f(x) = a x^2 + b x + c$.
    </p>

    <h3>Rigorous Derivation of the Quadratic Formula</h3>
    <p>
        The universal quadratic formula is derived algebraically via the method of <strong>completing the square</strong>:
    </p>
    <ol>
        <li>Divide all terms by the non-zero leading coefficient $a$:
        $$x^2 + \frac{b}{a} x + \frac{c}{a} = 0$$</li>
        <li>Transpose the constant term to the right-hand side:
        $$x^2 + \frac{b}{a} x = -\frac{c}{a}$$</li>
        <li>Add the square of half the linear coefficient, $\left( \frac{b}{2a} \right)^2 = \frac{b^2}{4a^2}$, to both sides:
        $$x^2 + \frac{b}{a} x + \frac{b^2}{4a^2} = \frac{b^2}{4a^2} - \frac{c}{a}$$</li>
        <li>Factor the left-hand perfect square trinomial and obtain a common denominator on the right:
        $$\left( x + \frac{b}{2a} \right)^2 = \frac{b^2 - 4ac}{4a^2}$$</li>
        <li>Extract the square root of both sides:
        $$x + \frac{b}{2a} = \frac{\pm \sqrt{b^2 - 4ac}}{2a}$$</li>
        <li>Isolate $x$ to yield the canonical quadratic formula:
        $$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$</li>
    </ol>

    <h3>The Discriminant ($\Delta$) and Root Topology</h3>
    <p>
        The radical radicand term $\Delta = b^2 - 4ac$ is termed the <strong>discriminant</strong>. The numerical sign of $\Delta$ completely governs the nature, multiplicity, and geometry of the roots:
    </p>
    <ul>
        <li>
            <strong>Case 1: $\Delta > 0$ (Two Distinct Real Roots):</strong>
            The parabola intersects the $x$-axis at two unique points:
            $$x_1 = \frac{-b + \sqrt{\Delta}}{2a}, \quad x_2 = \frac{-b - \sqrt{\Delta}}{2a}$$
        </li>
        <li>
            <strong>Case 2: $\Delta = 0$ (One Repeated Real Root / Double Root):</strong>
            The parabola's vertex is tangent to the $x$-axis:
            $$x = -\frac{b}{2a}$$
        </li>
        <li>
            <strong>Case 3: $\Delta < 0$ (Two Complex Conjugate Roots):</strong>
            The parabola does not intersect the real $x$-axis. Defining imaginary unit $i = \sqrt{-1}$:
            $$x = -\frac{b}{2a} \pm i \frac{\sqrt{-\Delta}}{2a}$$
        </li>
    </ul>

    <h3>Parabolic Geometry: Vertex, Axis of Symmetry & Canonical Forms</h3>
    <p>
        The geometric graph of $y = ax^2 + bx + c$ is a symmetric parabola:
    </p>
    <ul>
        <li><strong>Concavity:</strong> Opens upward if $a > 0$ (possessing a global minimum); opens downward if $a < 0$ (possessing a global maximum).</li>
        <li><strong>Axis of Symmetry:</strong> The vertical line passing through the extremum:
        $$x = h = -\frac{b}{2a}$$</li>
        <li><strong>Vertex Coordinates:</strong> The turning point $(h, k)$ where:
        $$h = -\frac{b}{2a}, \quad k = f(h) = c - \frac{b^2}{4a} = \frac{4ac - b^2}{4a} = -\frac{\Delta}{4a}$$</li>
        <li><strong>Vertex Form:</strong> $y = a(x - h)^2 + k$.</li>
        <li><strong>Factored (Root) Form:</strong> $y = a(x - x_1)(x - x_2)$ (for real roots).</li>
    </ul>

    <h3>Vieta's Formulas & Root Relationships</h3>
    <p>
        François Viète established fundamental identities relating root sums and products directly to polynomial coefficients without requiring root extraction:
    </p>
    <p>
        $$x_1 + x_2 = -\frac{b}{a}$$
    </p>
    <p>
        $$x_1 \cdot x_2 = \frac{c}{a}$$
    </p>
</div>
"""

ENERGY_ARTICLE = r"""
<div class="article-content">
    <h2>Classical Mechanics: Kinetic Energy, Potential Fields & Conservation Laws</h2>
    <p>
        In Newtonian mechanics and modern thermodynamics, <strong>energy</strong> is defined as the quantitative scalar capacity of a physical system to perform mechanical work ($W$). Work is the process of energy transfer occurring when an external net force ($\vec{F}$) acts across a displacement ($\Delta \vec{x}$). Energy exists in diverse operational modalities, governed by the primary dichotomy between <strong>kinetic energy</strong> (energy of motion) and <strong>potential energy</strong> (energy stored within a configuration or force field).
    </p>

    <h3>1. Translational Kinetic Energy ($E_k$)</h3>
    <p>
        Consider a rigid body of constant mass $m$ accelerated from rest ($v_0 = 0$) to velocity $v$ by a net external force $F = m \cdot a$. By Newton's Second Law and kinematic calculus, the work done $W$ on the body across distance $s$ is:
    </p>
    <p>
        $$W = \int F \, ds = \int (m \cdot a) \, ds = m \int \frac{dv}{dt} \, ds = m \int v \, dv = \frac{1}{2} m v^2$$
    </p>
    <p>
        By the <strong>Work-Energy Theorem</strong>, the net work performed equals the resulting kinetic energy ($E_k$):
    </p>
    <p>
        $$E_k = \frac{1}{2} m v^2$$
    </p>
    <p>
        <strong>Quadratic Velocity Dependence:</strong> Because kinetic energy scales quadratically with velocity ($v^2$), doubling an object's speed quadruples its kinetic energy ($2^2 = 4\times$). Tripling speed increases kinetic energy by a factor of nine ($3^2 = 9\times$). This non-linear relationship dictates vehicular braking distances, ballistic penetration mechanics, and fluid dynamic aerodynamic drag.
    </p>

    <h3>2. Gravitational Potential Energy ($E_p$)</h3>
    <p>
        <strong>Gravitational potential energy</strong> is the stored energy possessed by a body by virtue of its elevated position within a gravitational field. For displacements near a planetary surface where gravitational acceleration $g$ is approximately uniform:
    </p>
    <p>
        $$E_p = m \cdot g \cdot h$$
    </p>
    <p>
        where $m$ is mass, $g$ is local gravitational acceleration (Earth standard $g_0 \approx 9.80665\text{ m/s}^2$), and $h$ is vertical height relative to an arbitrary reference datum plane ($h = 0$).
    </p>

    <h3>3. The Law of Conservation of Mechanical Energy</h3>
    <p>
        In an isolated physical system subject exclusively to conservative forces (where friction, aerodynamic drag, and inelastic thermal dissipations are absent), the total mechanical energy ($E_{\text{total}}$) remains strictly constant across time:
    </p>
    <p>
        $$E_{\text{total}} = E_k + E_p = \frac{1}{2} m v^2 + m g h = \text{constant}$$
    </p>

    <h4>Free Fall Kinematics & Impact Velocity</h4>
    <p>
        When an object drops from rest ($v_0 = 0$) at initial height $h$, its initial potential energy converts entirely into kinetic energy at the instant prior to ground impact ($h=0$):
    </p>
    <p>
        $$m g h = \frac{1}{2} m v_{\text{impact}}^2$$
    </p>
    <p>
        Dividing by mass $m$ and solving for impact velocity $v_{\text{impact}}$:
    </p>
    <p>
        $$v_{\text{impact}} = \sqrt{2 g h}$$
    </p>
    <p>
        Remarkably, impact velocity in a vacuum is completely independent of the object's mass—a fundamental principle famously demonstrated by Galileo Galilei and confirmed on the lunar surface during Apollo 15.
    </p>

    <h3>Universal Energy Unit Conversions</h3>
    <p>
        The SI base unit of energy is the <strong>Joule</strong> ($J = 1\text{ N}\cdot\text{m} = 1\text{ kg}\cdot\text{m}^2/\text{s}^2$). Key multi-disciplinary unit equivalencies include:
    </p>
    <ul>
        <li><strong>Kilowatt-hour ($kWh$):</strong> $1\text{ kWh} = 3.6 \times 10^6\text{ J} = 3.6\text{ MJ}$ (electrical utility standard).</li>
        <li><strong>Foot-pound ($ft\cdot lbf$):</strong> $1\text{ ft}\cdot\text{lbf} \approx 1.355818\text{ J}$ (Imperial mechanical standard).</li>
        <li><strong>Thermochemical Calorie ($cal$):</strong> $1\text{ cal} = 4.184\text{ J}$; $1\text{ dietary Calorie (kcal)} = 4,184\text{ J}$.</li>
        <li><strong>British Thermal Unit ($BTU$):</strong> $1\text{ BTU} \approx 1,055.056\text{ J}$.</li>
        <li><strong>Electron-volt ($eV$):</strong> $1\text{ eV} \approx 1.602176634 \times 10^{-19}\text{ J}$ (quantum particle physics).</li>
    </ul>
</div>
"""
