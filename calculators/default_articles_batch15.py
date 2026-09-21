"""
Default educational articles for Batch #15 calculators.
Contains comprehensive, 400+ word SEO articles formatted with KaTeX for mathematical notation.
"""

CREDIT_CARD_PAYOFF_ARTICLE = r"""
<div class="article-content">
    <h2>Financial Mathematics: Revolving Credit Amortization & Debt Elimination Dynamics</h2>
    <p>
        A <strong>credit card</strong> represents an unsecured revolving credit facility governed by open-end consumer lending regulations. Unlike closed-end installment loans (such as fixed mortgages or auto financing where equal periodic amortizing payments systematically extinguish debt over a predefined term), credit card issuers assess finance charges daily or monthly on the outstanding balance while mandating only a nominal <strong>minimum monthly payment</strong>. Understanding the mathematical mechanics of credit card compounding and amortization is crucial for minimizing finance charges and accelerating financial freedom.
    </p>

    <h3>1. Daily Periodic Rate (DPR) & Finance Charge Calculation</h3>
    <p>
        Credit card interest rates are legally quoted as an <strong>Annual Percentage Rate (APR)</strong>. However, finance charges compound on an intra-monthly basis using the <strong>Average Daily Balance (ADB)</strong> method. The issuer first computes the <strong>Daily Periodic Rate (DPR)</strong>:
    </p>
    <p>
        $$\text{DPR} = \frac{\text{APR}}{365} \quad (\text{or } 360 \text{ in select institutional conventions})$$
    </p>
    <p>
        For each billing cycle of length $d$ days (typically 28 to 31 days), the finance charge $I$ is calculated by summing the end-of-day balances $B_k$ across each day $k$, dividing by $d$ to establish the ADB, and multiplying by DPR:
    </p>
    <p>
        $$\text{ADB} = \frac{1}{d} \sum_{k=1}^d B_k, \quad I = \text{ADB} \cdot \text{DPR} \cdot d = \text{ADB} \cdot \left( \frac{\text{APR}}{365} \right) \cdot d$$
    </p>

    <h3>2. The Amortization Recurrence Relation</h3>
    <p>
        Let $B_n$ represent the balance at billing cycle $n$, $P_n$ represent the total monthly payment applied, and $i = \frac{\text{APR}}{12}$ represent the effective monthly interest rate. The balance evolution follows the discrete linear recurrence relation:
    </p>
    <p>
        $$B_{n+1} = B_n (1 + i) - P_n = B_n \left( 1 + \frac{\text{APR}}{12} \right) - P_n$$
    </p>
    <p>
        If the borrower maintains a constant monthly payment $P$, the balance after $n$ periods expands via geometric summation to:
    </p>
    <p>
        $$B_n = B_0 (1 + i)^n - P \sum_{k=0}^{n-1} (1 + i)^k = B_0 (1 + i)^n - P \left[ \frac{(1 + i)^n - 1}{i} \right]$$
    </p>
    <p>
        Setting $B_n = 0$ and solving algebraically for the number of months $N$ required to achieve complete debt payoff yields the logarithmic payoff formula:
    </p>
    <p>
        $$N = -\frac{\ln\left(1 - \frac{B_0 \cdot i}{P}\right)}{\ln(1 + i)} = -\frac{\ln\left(1 - \frac{B_0 \cdot \text{APR}}{12 \cdot P}\right)}{\ln\left(1 + \frac{\text{APR}}{12}\right)}$$
    </p>

    <h3>3. The Critical Solvability Condition & Minimum Payment Trap</h3>
    <p>
        For the logarithmic term to remain within the real number domain ($\ln(x)$ where $x > 0$), the denominator inside the argument must satisfy:
    </p>
    <p>
        $$1 - \frac{B_0 \cdot i}{P} > 0 \implies P > B_0 \cdot i$$
    </p>
    <p>
        If the monthly payment $P \le B_0 \cdot i$, the payment is insufficient to even offset accrued monthly interest. The debt enters <strong>negative amortization</strong>, where the principal balance grows unboundedly toward infinity.
    </p>
    <p>
        <strong>The Bank Minimum Payment Trap:</strong> Credit card issuers routinely set the minimum required payment to the greater of $1\%$ to $2\%$ of the principal balance plus accrued finance charges, or a nominal floor (e.g., $\$25$ or $\$35$):
    </p>
    <p>
        $$P_{\text{min}} = \max\left( \delta \cdot B_n + B_n \cdot i, \; P_{\text{floor}} \right) \quad (\delta \approx 0.01 \text{ to } 0.02)$$
    </p>
    <p>
        Because $P_{\text{min}}$ declines as the balance drops, paying only the minimum asymptotically stretches payoff durations to 15–30 years and can cause total interest paid to exceed double or triple the original purchase value. Under the US <em>Credit Card Accountability Responsibility and Disclosure (CARD) Act of 2009</em>, issuers are legally required to disclose the "3-Year Payoff Table" on billing statements to highlight this economic disparity.
    </p>

    <h3>4. Strategic Debt Repayment Methodologies</h3>
    <ul>
        <li><strong>Debt Avalanche (Mathematically Optimal):</strong> Allocate all surplus discretionary cash flow to the debt carrying the highest APR while maintaining minimum payments on remaining balances. This strategy minimizes total cumulative interest paid across the loan portfolio.</li>
        <li><strong>Debt Snowball (Behavioral Psychology):</strong> Target the smallest absolute balance first regardless of interest rate. Eliminating individual accounts rapidly generates psychological momentum and frees up cash flow.</li>
    </ul>
</div>
"""

TDEE_ARTICLE = r"""
<div class="article-content">
    <h2>Human Bioenergetics: Components of Total Daily Energy Expenditure (TDEE)</h2>
    <p>
        In nutritional science, metabolic physiology, and sports dietetics, <strong>Total Daily Energy Expenditure (TDEE)</strong> defines the aggregate quantity of chemical energy—quantified in kilocalories ($\text{kcal}$) or megajoules ($\text{MJ}$)—that a human body oxidizes over a 24-hour period to maintain cellular homeostasis, support autonomic physiological functions, digest nutrients, and perform physical locomotion.
    </p>

    <h3>1. The Four Bioenergetic Components of TDEE</h3>
    <p>
        TDEE is not a static constant but a dynamic thermodynamic sum of four physiological components:
    </p>
    <p>
        $$\text{TDEE} = \text{BMR} + \text{NEAT} + \text{TEF} + \text{EAT}$$
    </p>
    <ul>
        <li>
            <strong>Basal Metabolic Rate (BMR) [60%–75% of TDEE]:</strong> The obligatory energy required to sustain vital organ functions (central nervous system, cardiovascular circulation, renal filtration, hepatic biochemical synthesis, and cellular ion pumps) in a post-absorptive, thermoneutral, resting state.
        </li>
        <li>
            <strong>Non-Exercise Activity Thermogenesis (NEAT) [15%–30% of TDEE]:</strong> Energy expended for all spontaneous physical movement excluding formal athletic exercise—including occupational movement, postural control, walking, typing, and fidgeting. NEAT exhibits the highest inter-individual variability (differing by up to $2,000\text{ kcal/day}$).
        </li>
        <li>
            <strong>Thermic Effect of Food (TEF) [~10% of TDEE]:</strong> The metabolic cost of gastrointestinal ingestion, enzymatic breakdown, absorption, and substrate assimilation. Substrate-specific thermic costs are:
            $$\text{Protein: } 20\% - 30\%, \quad \text{Carbohydrates: } 5\% - 10\%, \quad \text{Dietary Fats: } 0\% - 3\%$$
        </li>
        <li>
            <strong>Exercise Activity Thermogenesis (EAT) [0%–15% of TDEE]:</strong> Energy expended during planned athletic training, resistance exercise, and cardiovascular conditioning.
        </li>
    </ul>

    <h3>2. Mathematical BMR Formulations</h3>
    <p>
        Because direct whole-room calorimetry is clinically impractical, validated predictive indirect calorimetry equations estimate BMR from anthropometric parameters:
    </p>

    <h4>A. The Mifflin-St Jeor Equation (Clinical Gold Standard)</h4>
    <p>
        Validated by the Academy of Nutrition and Dietetics as the most accurate empirical equation for the general population ($W$ in $\text{kg}$, $H$ in $\text{cm}$, $A$ in years):
    </p>
    <p>
        $$\text{BMR}_{\text{male}} = 10 \cdot W + 6.25 \cdot H - 5 \cdot A + 5$$
    </p>
    <p>
        $$\text{BMR}_{\text{female}} = 10 \cdot W + 6.25 \cdot H - 5 \cdot A - 161$$
    </p>

    <h4>B. The Katch-McArdle Equation (Lean Body Mass Specific)</h4>
    <p>
        When body composition is known via DEXA, hydrostatic weighing, or skinfold caliper analysis, the Katch-McArdle formula bypasses biological gender distinctions by calculating BMR directly from <strong>Fat-Free Mass (FFM)</strong> in kilograms:
    </p>
    <p>
        $$\text{FFM} = W \cdot \left( 1 - \frac{\text{BF}\%}{100} \right)$$
    </p>
    <p>
        $$\text{BMR} = 370 + 21.6 \cdot \text{FFM}$$
    </p>

    <h4>C. Revised Harris-Benedict Equation (Roza and Shizgal, 1984)</h4>
    <p>
        $$\text{BMR}_{\text{male}} = 88.362 + 13.397 \cdot W + 4.799 \cdot H - 5.677 \cdot A$$
    </p>
    <p>
        $$\text{BMR}_{\text{female}} = 447.593 + 9.247 \cdot W + 3.098 \cdot H - 4.330 \cdot A$$
    </p>

    <h3>3. Physical Activity Level (PAL) Multipliers</h3>
    <p>
        To scale BMR into TDEE, the World Health Organization (WHO) and Food and Agriculture Organization (FAO) established standard Physical Activity Level multipliers:
    </p>
    <p>
        $$\text{TDEE} = \text{BMR} \times \text{PAL}$$
    </p>
    <ul>
        <li><strong>Sedentary ($\text{PAL} = 1.20$):</strong> Desk job, minimal walking, negligible intentional physical activity.</li>
        <li><strong>Lightly Active ($\text{PAL} = 1.375$):</strong> Light walking or exercise 1–3 days per week.</li>
        <li><strong>Moderately Active ($\text{PAL} = 1.55$):</strong> Moderate exercise, athletic training 3–5 days per week.</li>
        <li><strong>Very Active ($\text{PAL} = 1.725$):</strong> Hard exercise, sports training 6–7 days per week.</li>
        <li><strong>Extra Active / Athlete ($\text{PAL} = 1.90$):</strong> Twice-daily athletic training or intensive manual labor.</li>
    </ul>

    <h3>4. Energy Balance & Weight Regulation Dynamics</h3>
    <p>
        Governed by the First Law of Thermodynamics, body mass shifts according to net energy balance:
    </p>
    <p>
        $$\Delta E_{\text{stored}} = E_{\text{intake}} - \text{TDEE}$$
    </p>
    <p>
        One pound of adipose tissue stores approximately $3,500\text{ kcal}$ of metabolizable energy ($7,700\text{ kcal/kg}$). Consequently, an intentional caloric deficit of $-500\text{ kcal/day}$ induces an empirical loss of approximately $1.0\text{ lb}$ of adipose mass per week, while a caloric surplus of $+300$ to $+500\text{ kcal/day}$ supports hypertrophic muscular protein synthesis during structured resistance training.
    </p>
</div>
"""

CIRCLE_ARTICLE = r"""
<div class="article-content">
    <h2>Euclidean Geometry of the Circle: Metric Relations, Calculus & Sector Topology</h2>
    <p>
        In Euclidean planar geometry, a <strong>circle</strong> is defined as the locus of all coplanar points equidistant from a fixed central point $O$. The constant distance between any point on the perimeter and the center is the <strong>radius</strong> ($r$). A circle represents the geometric plane figure possessing maximal area for a given perimeter (isoperimetric inequality) and complete continuous rotational symmetry of group $\text{SO}(2)$.
    </p>

    <h3>1. Fundamental Metric Relations & The Transcendental Constant $\pi$</h3>
    <p>
        The mathematical constant $\pi$ (pi) is defined as the invariant ratio of a circle's perimeter (circumference $C$) to its diameter ($d = 2r$):
    </p>
    <p>
        $$\pi = \frac{C}{d} = \frac{C}{2r} \approx 3.141592653589793\dots$$
    </p>
    <p>
        From this definition, the fundamental metric equations immediately follow:
    </p>
    <ul>
        <li><strong>Circumference ($C$):</strong> $$C = 2\pi r = \pi d$$</li>
        <li><strong>Radius from Circumference:</strong> $$r = \frac{C}{2\pi}$$</li>
        <li><strong>Diameter from Circumference:</strong> $$d = \frac{C}{\pi}$$</li>
    </ul>

    <h3>2. Rigorous Derivation of Circular Surface Area ($A$)</h3>
    <p>
        The classic formula $A = \pi r^2$ can be rigorously derived through Archimedean polygon exhaustion or polar coordinate integral calculus. Dividing the circular disk into concentric differential rings of infinitesimal thickness $dr$ and perimeter $2\pi r$:
    </p>
    <p>
        $$A = \int_0^r 2\pi \rho \, d\rho = 2\pi \left[ \frac{\rho^2}{2} \right]_0^r = \pi r^2$$
    </p>
    <p>
        Expressed in terms of diameter $d$ and circumference $C$:
    </p>
    <p>
        $$A = \frac{\pi d^2}{4} = \frac{C^2}{4\pi} = \frac{1}{2} C r$$
    </p>

    <h3>3. Circular Sector, Arc Length & Chord Trigonometry</h3>
    <p>
        A <strong>circular sector</strong> is a region bounded by two radii and an intercepted arc of central angle $\theta$:
    </p>
    <h4>A. Arc Length ($s$)</h4>
    <p>
        When angle $\theta$ is measured in radians ($\text{rad}$):
        $$s = r \cdot \theta$$
        When angle $\alpha$ is measured in degrees ($^\circ$):
        $$s = 2\pi r \left( \frac{\alpha}{360^\circ} \right) = \frac{\pi r \alpha}{180^\circ}$$
    </p>

    <h4>B. Sector Area ($A_{\text{sector}}$)</h4>
    <p>
        In radians:
        $$A_{\text{sector}} = \frac{1}{2} r^2 \theta = \frac{1}{2} r s$$
        In degrees:
        $$A_{\text{sector}} = \pi r^2 \left( \frac{\alpha}{360^\circ} \right)$$
    </p>

    <h4>C. Geometric Chord Length ($L_c$)</h4>
    <p>
        The straight-line segment connecting the two endpoints of an arc subtended by central angle $\theta$:
    </p>
    <p>
        $$L_c = 2r \sin\left(\frac{\theta}{2}\right)$$
    </p>

    <h4>D. Circular Segment Area ($A_{\text{segment}}$)</h4>
    <p>
        The area between a chord and its arc equals the sector area minus the area of the isosceles triangle formed by the radii and chord:
    </p>
    <p>
        $$A_{\text{segment}} = A_{\text{sector}} - A_{\text{triangle}} = \frac{1}{2} r^2 (\theta - \sin\theta) \quad (\theta \text{ in radians})$$
    </p>

    <h3>4. Concentric Annulus (Circular Ring) Geometry</h3>
    <p>
        An <strong>annulus</strong> is the planar region enclosed between two concentric circles of outer radius $R$ and inner radius $r$ ($R > r$):
    </p>
    <p>
        $$A_{\text{annulus}} = \pi R^2 - \pi r^2 = \pi (R^2 - r^2) = \pi (R - r)(R + r)$$
    </p>
    <p>
        By the Pythagorean theorem, if a chord of the outer circle is tangent to the inner circle and has length $2c$, the annular area simplifies to:
    </p>
    <p>
        $$A_{\text{annulus}} = \pi c^2$$
    </p>
</div>
"""

PRESSURE_ARTICLE = r"""
<div class="article-content">
    <h2>Thermodynamics & Continuum Mechanics: Atmospheric Pressure & Barometric Hypsometry</h2>
    <p>
        In fluid mechanics, meteorology, and thermodynamics, <strong>pressure</strong> ($P$) is defined as the perpendicular normal force ($F_\perp$) exerted per unit surface area ($A$) of an enclosed boundary:
    </p>
    <p>
        $$P = \lim_{\Delta A \to 0} \frac{\Delta F_\perp}{\Delta A} = \frac{dF_\perp}{dA}$$
    </p>
    <p>
        <strong>Atmospheric pressure</strong> (barometric pressure) represents the hydrostatic weight per unit area of the column of terrestrial air extending from a reference elevation to the top of the atmosphere. At sea level, Earth's standard atmospheric pressure is universally calibrated to $101,325\text{ Pascals}$ ($101.325\text{ kPa}$ or $1.01325\text{ bar}$).
    </p>

    <h3>1. Hydrostatic Fundamental Equation</h3>
    <p>
        For an incompressible fluid of uniform density $\rho$ subject to gravitational acceleration $g$, pressure increases linearly with depth $h$:
    </p>
    <p>
        $$P = P_0 + \rho g h$$
    </p>
    <p>
        This equation forms the mathematical operating basis of mercury and liquid manometers. In 1643, Evangelista Torricelli demonstrated that atmospheric pressure supports a column of liquid mercury ($\rho_{\text{Hg}} \approx 13,595.1\text{ kg/m}^3$) to a height of exactly $760\text{ mm}$ at $0^\circ\text{C}$, establishing the conventional unit <strong>Torr</strong> ($1\text{ Torr} \equiv 1\text{ mmHg} \approx 133.322\text{ Pa}$).
    </p>

    <h3>2. The Barometric Formula & Hypsometric Elevation Modeling</h3>
    <p>
        Unlike liquids, atmospheric air is a compressible ideal gas governed by the ideal gas law $\rho = \frac{P \cdot M}{R \cdot T}$, where $M$ is molar mass of dry air ($M \approx 0.0289644\text{ kg/mol}$), $R$ is the universal gas constant ($8.31446\text{ J/(mol}\cdot\text{K)}$), and $T$ is absolute thermodynamic temperature in Kelvin.
    </p>
    <p>
        Combining the differential hydrostatic condition $dP = -\rho g \, dh$ with the ideal gas density equation yields:
    </p>
    <p>
        $$\frac{dP}{P} = -\frac{M g}{R T} \, dh$$
    </p>
    <p>
        Assuming an isothermal atmosphere of constant temperature $T$:
    </p>
    <p>
        $$P(h) = P_0 \exp\left( -\frac{M g h}{R T} \right) = P_0 \exp\left( -\frac{h}{H_s} \right)$$
    </p>
    <p>
        where $H_s = \frac{R T}{M g} \approx 8,400\text{ meters}$ represents the atmospheric <strong>scale height</strong>—the vertical distance over which atmospheric pressure drops by a factor of Euler's constant $e \approx 2.71828$.
    </p>

    <h3>3. Comprehensive Pressure Unit Definitions & Conversion Matrix</h3>
    <p>
        The SI base derived unit of pressure is the <strong>Pascal</strong> ($1\text{ Pa} = 1\text{ N/m}^2 = 1\text{ kg}/(\text{m}\cdot\text{s}^2)$). Standard engineering conversions include:
    </p>
    <ul>
        <li><strong>Standard Atmosphere ($atm$):</strong> $$1\text{ atm} \equiv 101,325\text{ Pa} = 1.01325\text{ bar}$$</li>
        <li><strong>Bar ($bar$):</strong> Metric industrial standard: $$1\text{ bar} \equiv 100,000\text{ Pa} = 100\text{ kPa} = 0.1\text{ MPa}$$</li>
        <li><strong>Hectopascal / Millibar ($hPa$ / $mbar$):</strong> Meteorological standard: $$1\text{ hPa} \equiv 100\text{ Pa} = 1\text{ mbar}$$</li>
        <li><strong>Pounds per Square Inch ($psi$):</strong> US Imperial standard ($1\text{ lbf/in}^2$): $$1\text{ psi} \approx 6,894.757\text{ Pa} \implies 1\text{ atm} \approx 14.69595\text{ psi}$$</li>
        <li><strong>Inches of Mercury ($inHg$):</strong> Aviation altimeter setting standard: $$1\text{ inHg} \approx 3,386.389\text{ Pa} \implies 1\text{ atm} = 29.9213\text{ inHg}$$</li>
        <li><strong>Technical Atmosphere ($at$):</strong> $$1\text{ at} \equiv 1\text{ kgf/cm}^2 \approx 98,066.5\text{ Pa}$$</li>
    </ul>

    <h3>4. Clausius-Clapeyron Relation & Water Boiling Point Variation</h3>
    <p>
        As atmospheric pressure drops with altitude, the boiling point of liquids decreases according to the Clausius-Clapeyron equation:
    </p>
    <p>
        $$\ln\left(\frac{P_2}{P_1}\right) = -\frac{\Delta H_{\text{vap}}}{R} \left( \frac{1}{T_2} - \frac{1}{T_1} \right)$$
    </p>
    <p>
        At sea level ($101.325\text{ kPa}$), water boils at $100^\circ\text{C}$ ($212^\circ\text{F}$). At the summit of Mount Everest ($8,848\text{ m}$, $P \approx 33.7\text{ kPa}$), the boiling point drops to approximately $71^\circ\text{C}$ ($160^\circ\text{F}$), preventing conventional culinary cooking.
    </p>
</div>
"""
