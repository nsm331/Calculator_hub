"""
Default educational articles for Batch #16 calculators.
Contains comprehensive, 400+ word SEO articles formatted with KaTeX for mathematical notation.
"""

SIMPLE_INTEREST_ARTICLE = r"""
<div class="article-content">
    <h2>Financial Mathematics: Theory, Mechanics & Applications of Simple Interest</h2>
    <p>
        <strong>Simple interest</strong> is the most fundamental contractual mechanism for quantifying the cost of borrowing capital or the remuneration earned on deposited funds. Unlike compound interest—where accumulated interest is periodically capitalized into the principal balance to generate interest upon interest—simple interest is assessed exclusively against the unamortized initial principal across the entire tenure of the obligation. It forms the statutory benchmark for short-term promissory notes, automotive installment contracts, commercial bridge loans, and peer-to-peer lending agreements.
    </p>

    <h3>1. Core Derivation & Fundamental Equations</h3>
    <p>
        The magnitude of simple interest accrued is directly proportional to three underlying financial variables: the initial principal investment or debt obligation ($P$), the nominal annual interest rate expressed as a decimal ($r$), and the temporal duration of the transaction ($t$) measured in years:
    </p>
    <p>
        $$I = P \cdot r \cdot t$$
    </p>
    <p>
        The total terminal value or future balance ($A$) payable upon maturity represents the aggregate summation of original principal and total accrued interest:
    </p>
    <p>
        $$A = P + I = P + (P \cdot r \cdot t) = P(1 + r \cdot t)$$
    </p>
    <p>
        From this algebraic relation, any single unknown parameter can be analytically isolated whenever the remaining three variables are established:
    </p>
    <ul>
        <li><strong>Required Initial Principal:</strong> $$P = \frac{A}{1 + r \cdot t} = \frac{I}{r \cdot t}$$</li>
        <li><strong>Implied Nominal Rate:</strong> $$r = \frac{I}{P \cdot t} = \frac{A - P}{P \cdot t}$$</li>
        <li><strong>Required Temporal Horizon:</strong> $$t = \frac{I}{P \cdot r} = \frac{A - P}{P \cdot r}$$</li>
    </ul>

    <h3>2. Day-Count Conventions: Exact vs. Ordinary (Banker's Rule)</h3>
    <p>
        When loans or commercial paper are transacted over fractional annual periods specified in days ($d$), institutional day-count conventions dictate how $t$ is translated into annual units:
    </p>
    <ul>
        <li>
            <strong>Exact Simple Interest (Actual/365 Convention):</strong> Commonly mandated in consumer credit laws and sovereign debt markets (e.g., US Treasury notes), this method divides elapsed calendar days by the exact number of days in an astronomical solar year (365, or 366 during a leap year):
            $$t = \frac{d}{365}, \quad I_{\text{exact}} = P \cdot r \cdot \left(\frac{d}{365}\right)$$
        </li>
        <li>
            <strong>Ordinary Simple Interest (Banker's Rule, Actual/360 Convention):</strong> Standardized across institutional money markets, commercial paper, and international interbank lending (e.g., SOFR, EURIBOR, commercial lines of credit), this method standardizes the annual denominator to exactly 360 days:
            $$t = \frac{d}{360}, \quad I_{\text{ordinary}} = P \cdot r \cdot \left(\frac{d}{360}\right)$$
        </li>
    </ul>
    <p>
        Because the denominator $360 < 365$, ordinary interest yields a factor of $\frac{365}{360} \approx 1.013889$ (an extra $1.39\%$ in interest charges) compared to exact interest on identical capital, delivering an implicit yield premium to institutional lenders.
    </p>

    <h3>3. Mathematical Comparison: Simple vs. Compound Growth</h3>
    <p>
        The definitive behavioral divergence between simple and compound growth lies in the mathematical progression of the terminal capital curve. Whereas simple interest follows a <strong>strictly linear trajectory</strong> with constant first-derivative rate of change:
    </p>
    <p>
        $$\frac{dA_{\text{simple}}}{dt} = P \cdot r \quad (\text{Constant Marginal Capital Gain})$$
    </p>
    <p>
        Compound interest follows a <strong>strictly convex exponential trajectory</strong> where interest is capitalized at frequency $n$ times per annum:
    </p>
    <p>
        $$A_{\text{compound}} = P \left(1 + \frac{r}{n}\right)^{n \cdot t} \quad \text{or for continuous compounding: } A_{\text{cont}} = P e^{r \cdot t}$$
    </p>
    <p>
        Over short durations ($t < 1$ year), differences between simple and compound interest are virtually negligible. However, as $t$ scales toward long-term horizons, the opportunity cost of simple interest widens exponentially due to the compounding geometric expansion of reinvested yields.
    </p>

    <h3>4. Practical Financial Applications</h3>
    <ul>
        <li><strong>Commercial Paper & Promissory Notes:</strong> Short-term unsecured promissory notes issued by multinational corporations to fund payroll and inventories trade on discounted simple yield mechanics.</li>
        <li><strong>Retail Auto Installment Contracts:</strong> Many automotive financings calculate interest on a simple daily basis rather than precomputed rule-of-78s, meaning extra principal payments immediately curtail future daily interest accrual.</li>
        <li><strong>Short-Term Certificates of Deposit (CDs):</strong> Non-compounding fixed-term deposits pay flat simple annual interest at maturity.</li>
    </ul>
</div>
"""

CALORIES_BURNED_ARTICLE = r"""
<div class="article-content">
    <h2>Exercise Bioenergetics: The Science of Metabolic Equivalents & Energy Expenditure</h2>
    <p>
        Human locomotion and physical exercise demand the biochemical conversion of substrate macronutrients (glycogen, glucose, fatty acids, and amino acids) into adenosine triphosphate (ATP) to drive muscular actin-myosin cross-bridge cycling. Quantifying the thermodynamic cost of physical activity is central to exercise physiology, sports conditioning, nutritional prescription, and metabolic health management. The global gold-standard clinical metric utilized by exercise physiologists and medical researchers is the <strong>Metabolic Equivalent of Task (MET)</strong>.
    </p>

    <h3>1. Physiological Foundations of the MET Unit</h3>
    <p>
        By international physiological consensus established through the landmark work of Dr. Barbara Ainsworth and the <em>Compendium of Physical Activities</em>, one Metabolic Equivalent ($1\text{ MET}$) is defined as the resting metabolic rate (RMR) of an average adult seated quietly at thermoneutral ambient conditions:
    </p>
    <p>
        $$1 \text{ MET} \equiv 3.5 \text{ mL } \text{O}_2 \cdot \text{kg}^{-1} \cdot \text{min}^{-1}$$
    </p>
    <p>
        In energetic terms, the combustion of carbohydrate and lipid substrates consumes approximately $5.0 \text{ kcal}$ of thermal energy per liter of molecular oxygen consumed ($\text{VO}_2$). Substituting this caloric equivalent into the resting oxygen uptake equation establishes the standardized mass-specific energetic equivalent:
    </p>
    <p>
        $$1 \text{ MET} = 3.5 \frac{\text{mL } \text{O}_2}{\text{kg} \cdot \text{min}} \times \frac{1 \text{ L}}{1000 \text{ mL}} \times \frac{5.0 \text{ kcal}}{\text{L } \text{O}_2} \times 60 \frac{\text{min}}{\text{hr}} = 1.05 \frac{\text{kcal}}{\text{kg} \cdot \text{hr}} \approx 1.0 \frac{\text{kcal}}{\text{kg} \cdot \text{hr}}$$
    </p>

    <h3>2. The ACSM Energy Expenditure Formula</h3>
    <p>
        The American College of Sports Medicine (ACSM) formulates the instantaneous rate of gross caloric expenditure ($\dot{E}_{\text{gross}}$, in kilocalories per minute) as a function of activity MET intensity and subject body mass ($M$ in kilograms):
    </p>
    <p>
        $$\dot{E}_{\text{gross}} \left(\frac{\text{kcal}}{\text{min}}\right) = \frac{\text{MET} \times 3.5 \times M_{\text{kg}}}{200}$$
    </p>
    <p>
        Integrating over an exercise duration $T$ expressed in minutes yields the total gross energy expenditure:
    </p>
    <p>
        $$E_{\text{total}} (\text{kcal}) = \left(\frac{\text{MET} \times 3.5 \times M_{\text{kg}}}{200}\right) \times T_{\text{min}}$$
    </p>

    <h3>3. Gross vs. Net Caloric Expenditure</h3>
    <p>
        A vital distinction in clinical weight management and athletic programming is the separation between <strong>gross</strong> and <strong>net</strong> caloric expenditure:
    </p>
    <ul>
        <li>
            <strong>Gross Energy Expenditure ($E_{\text{gross}}$):</strong> The total quantity of kilocalories expended during the training duration, encompassing both baseline resting metabolic operations and the supplementary work performed by skeletal muscles.
        </li>
        <li>
            <strong>Net Energy Expenditure ($E_{\text{net}}$):</strong> The incremental calories burned <em>purely due to exercise</em>, calculated by subtracting the resting basal calories the individual would have burned had they remained completely sedentary over that same interval:
            $$E_{\text{net}} (\text{kcal}) = \frac{(\text{MET} - 1.0) \times 3.5 \times M_{\text{kg}}}{200} \times T_{\text{min}}$$
        </li>
    </ul>
    <p>
        Failing to account for the $1.0\text{ MET}$ baseline baseline leads many recreational exercisers to double-count baseline metabolic calories when reconciling exercise tracking with daily nutritional caloric targets.
    </p>

    <h3>4. Compendium MET Classifications Across Physical Disciplines</h3>
    <p>
        The Compendium categorizes physical activity into three broad intensity strata based on physiological strain:
    </p>
    <ul>
        <li><strong>Light Intensity ($\text{MET} < 3.0$):</strong> Leisure walking ($2.0\text{ mph} \approx 2.5\text{ MET}$), desk work ($1.3\text{ MET}$), light stretching ($2.3\text{ MET}$).</li>
        <li><strong>Moderate Intensity ($3.0 \le \text{MET} < 6.0$):</strong> Brisk walking ($3.5\text{ mph} \approx 4.3\text{ MET}$), recreational cycling ($10\text{–}12\text{ mph} \approx 5.8\text{ MET}$), doubles tennis ($5.0\text{ MET}$), resistance weight training ($3.5\text{–}5.0\text{ MET}$).</li>
        <li><strong>Vigorous Intensity ($\text{MET} \ge 6.0$):</strong> Jogging ($5.0\text{ mph} \approx 8.3\text{ MET}$), running ($7.5\text{ mph} \approx 11.8\text{ MET}$), competitive swimming ($9.8\text{ MET}$), jumping rope ($12.3\text{ MET}$), HIIT sprinting ($11.0\text{–}14.0\text{ MET}$).</li>
    </ul>

    <h3>5. Individual Modulators of Metabolic Cost</h3>
    <p>
        While MET-based modeling provides reliable population-level estimates, individual real-world caloric expenditure is modulated by biomechanical efficiency (running economy), ambient environmental thermal strain, body composition (fat-free lean mass vs. adipose mass), and cardiovascular conditioning level.
    </p>
</div>
"""

RATIO_PROPORTION_ARTICLE = r"""
<div class="article-content">
    <h2>Mathematical Theory: Proportion Solving, GCD Reduction & Dimensional Scaling</h2>
    <p>
        A <strong>ratio</strong> is a mathematical comparison of two or more quantitative magnitudes expressing how many times one value is contained within another. When two distinct ratios are declared algebraically equivalent, they establish a <strong>proportion</strong>. The mathematical principles governing ratios and proportions trace back to Book V of Euclid's <em>Elements</em> and form the bedrock of stoichiometry, coordinate geometry, dimensional scaling, architectural blueprints, financial leverage analysis, and digital computer graphics.
    </p>

    <h3>1. Formal Definition & The Fundamental Cross-Multiplication Theorem</h3>
    <p>
        A proportion between four real numbers $a, b, c, d$ (with $b \neq 0$ and $d \neq 0$) is formally expressed in colon notation as $a : b = c : d$, or in fractional form as:
    </p>
    <p>
        $$\frac{a}{b} = \frac{c}{d}$$
    </p>
    <p>
        Here, $a$ and $d$ are designated as the <strong>extremes</strong>, while $b$ and $c$ are designated as the <strong>means</strong>. The <em>Fundamental Law of Proportions</em> asserts that the product of the extremes is unconditionally equal to the product of the means:
    </p>
    <p>
        $$\frac{a}{b} = \frac{c}{d} \iff a \cdot d = b \cdot c$$
    </p>
    <p>
        This allows the analytic isolation of any single unknown parameter $x$ in a four-term proportion through direct cross-multiplication:
    </p>
    <ul>
        <li>$$\text{Solving for } a: \quad a = \frac{b \cdot c}{d}$$</li>
        <li>$$\text{Solving for } b: \quad b = \frac{a \cdot d}{c}$$</li>
        <li>$$\text{Solving for } c: \quad c = \frac{a \cdot d}{b}$$</li>
        <li>$$\text{Solving for } d: \quad d = \frac{b \cdot c}{a}$$</li>
    </ul>

    <h3>2. Ratio Simplification & The Euclidean GCD Algorithm</h3>
    <p>
        A ratio $a : b$ where $a, b \in \mathbb{Z}^+$ is expressed in its irreducible <strong>simplest canonical form</strong> when its terms are coprime, meaning their Greatest Common Divisor satisfies $\gcd(a, b) = 1$. The reduction is accomplished by dividing each term by their mutual GCD:
    </p>
    <p>
        $$\text{Simplified Ratio} = \left(\frac{a}{\gcd(a, b)}\right) : \left(\frac{b}{\gcd(a, b)}\right)$$
    </p>
    <p>
        Computationally, $\gcd(a, b)$ is determined in logarithmic time $O(\log(\min(a, b)))$ via the recursive Euclidean algorithm:
    </p>
    <p>
        $$\gcd(a, b) = \begin{cases} a & \text{if } b = 0 \\ \gcd(b, a \pmod b) & \text{if } b > 0 \end{cases}$$
    </p>
    <p>
        For continuous empirical scales (such as chemical dilutions or currency exchange rates), ratios are alternatively standardized into unit representations ($1 : n$ or $n : 1$) where $n = \frac{b}{a}$ or $n = \frac{a}{b}$.
    </p>

    <h3>3. Partitive Proportion: Partitioning a Whole Quantity</h3>
    <p>
        In commercial partnerships, inheritance distribution, and chemical blending, a finite aggregate quantity $S$ must be divided among $k$ entities in accordance with a specified multi-part ratio $r_1 : r_2 : \dots : r_k$. The fractional allocation coefficient for component $i$ is determined by summing all ratio parts:
    </p>
    <p>
        $$R_{\text{total}} = \sum_{j=1}^k r_j = r_1 + r_2 + \dots + r_k$$
    </p>
    <p>
        The discrete portion $S_i$ awarded to partition $i$ is given by:
    </p>
    <p>
        $$S_i = S \times \left(\frac{r_i}{R_{\text{total}}}\right) \quad \text{such that} \quad \sum_{i=1}^k S_i = S$$
    </p>

    <h3>4. Aspect Ratio & Geometric Dimensional Scaling</h3>
    <p>
        In digital display engineering, cinematography, and responsive web design, the <strong>aspect ratio</strong> characterizes the proportional relationship between image width ($W$) and height ($H$):
    </p>
    <p>
        $$\text{Aspect Ratio} = \frac{W}{H}$$
    </p>
    <p>
        When resizing digital assets while strictly preserving geometric similarity without optical distortion or anamorphic stretching, scaling one dimension enforces an automatic proportional transformation upon the other:
    </p>
    <p>
        $$H_{\text{new}} = W_{\text{new}} \times \left(\frac{H_{\text{orig}}}{W_{\text{orig}}}\right), \quad W_{\text{new}} = H_{\text{new}} \times \left(\frac{W_{\text{orig}}}{H_{\text{orig}}}\right)$$
    </p>
    <p>
        Standard industry aspect ratios include $16:9$ (High Definition video, $1.778$), $4:3$ (Standard definition, $1.333$), $21:9$ (Ultrawide cinematic, $2.333$), and $1:1$ (Square social media formats).
    </p>
</div>
"""

COOKING_MEASUREMENTS_ARTICLE = r"""
<div class="article-content">
    <h2>Culinary Physics: Volume vs. Mass Conversions, Ingredient Densities & Temperature Scales</h2>
    <p>
        Culinary preparation and precision pastry baking sit at the intersection of gastronomy, thermodynamics, and physical chemistry. In home cooking, recipes frequently specify quantities using volumetric measures (such as cups, tablespoons, and fluid ounces), whereas commercial bakeries and professional culinary institutions formulate recipes strictly by mass (grams or ounces). Because volumetric packing varies drastically based on ingredient particle size, aeration, and moisture content, converting between culinary volume and weight requires rigorous application of physical density equations.
    </p>

    <h3>1. The Fundamental Mass-Volume Density Relationship</h3>
    <p>
        The transformation between volumetric culinary units and gravimetric mass is governed by the physical density equation:
    </p>
    <p>
        $$m = V \cdot \rho$$
    </p>
    <p>
        Where $m$ represents mass (in grams), $V$ represents volumetric displacement (in milliliters), and $\rho$ represents the bulk density of the specific ingredient (in $\text{g/cm}^3$ or $\text{g/mL}$).
    </p>
    <p>
        While pure water exhibits a baseline density of exactly $\rho_{\text{water}} \approx 1.00 \text{ g/mL}$ at standard kitchen temperatures ($1 \text{ cup} = 236.588 \text{ mL} \approx 237 \text{ g}$), granular baking ingredients exhibit wide density departures:
    </p>
    <ul>
        <li><strong>All-Purpose Flour (unbleached, spooned & leveled):</strong> $\rho \approx 0.51\text{–}0.53 \text{ g/mL} \implies 1 \text{ US Cup} \approx 120\text{–}125 \text{ grams}$</li>
        <li><strong>Granulated White Sugar (sucrose crystals):</strong> $\rho \approx 0.85 \text{ g/mL} \implies 1 \text{ US Cup} \approx 200 \text{ grams}$</li>
        <li><strong>Brown Sugar (packed molasses sucrose):</strong> $\rho \approx 0.93 \text{ g/mL} \implies 1 \text{ US Cup} \approx 220 \text{ grams}$</li>
        <li><strong>Confectioner's / Powdered Sugar (aerated):</strong> $\rho \approx 0.51 \text{ g/mL} \implies 1 \text{ US Cup} \approx 120 \text{ grams}$</li>
        <li><strong>Unsalted Butter (fat emulsion):</strong> $\rho \approx 0.96 \text{ g/mL} \implies 1 \text{ US Cup (2 sticks)} \approx 227 \text{ grams}$</li>
        <li><strong>Pure Honey / Corn Syrup:</strong> $\rho \approx 1.42 \text{ g/mL} \implies 1 \text{ US Cup} \approx 340 \text{ grams}$</li>
        <li><strong>Vegetable / Olive Oil:</strong> $\rho \approx 0.92 \text{ g/mL} \implies 1 \text{ US Cup} \approx 218 \text{ grams}$</li>
        <li><strong>Rolled Oats (whole flakes):</strong> $\rho \approx 0.38 \text{ g/mL} \implies 1 \text{ US Cup} \approx 90 \text{ grams}$</li>
    </ul>

    <h3>2. Imperial vs. Metric Culinary Volumetric Hierarchies</h3>
    <p>
        A persistent source of international recipe error stems from diverging definitions of volumetric units across jurisdictions:
    </p>
    <ul>
        <li>
            <strong>United States Customary System (USCS):</strong>
            $$1 \text{ US Cup} = 16 \text{ US Tablespoons} = 48 \text{ US Teaspoons} = 8 \text{ US fl oz} \approx 236.588 \text{ mL}$$
            $$1 \text{ US Tablespoon (tbsp)} = 3 \text{ US Teaspoons (tsp)} \approx 14.787 \text{ mL}$$
            $$1 \text{ US Fluid Ounce (fl oz)} \approx 29.574 \text{ mL}$$
        </li>
        <li>
            <strong>Metric / Commonwealth System (UK, Canada, Australia):</strong>
            $$1 \text{ Metric Cup} \equiv 250.0 \text{ mL} \quad (\approx 5.7\% \text{ larger than a US Cup})$$
            $$1 \text{ Australian Tablespoon} \equiv 20.0 \text{ mL} \quad (\text{4 teaspoons}), \quad \text{UK/Canadian Tablespoon} \equiv 15.0 \text{ mL}$$
        </li>
    </ul>
    <p>
        The volumetric conversion ladder links imperial kitchen measures systematically:
    </p>
    <p>
        $$1 \text{ Gallon} = 4 \text{ Quarts} = 8 \text{ Pints} = 16 \text{ Cups} = 128 \text{ fl oz} = 256 \text{ tbsp} = 768 \text{ tsp} \approx 3.785 \text{ Liters}$$
    </p>

    <h3>3. Recipe Scaling Factor Mechanics</h3>
    <p>
        When altering recipe yields from an initial serving count $Y_{\text{orig}}$ to a target yield $Y_{\text{target}}$, the universal linear scaling factor $k$ is applied:
    </p>
    <p>
        $$k = \frac{Y_{\text{target}}}{Y_{\text{orig}}}, \quad Q_{\text{scaled}} = k \cdot Q_{\text{orig}}$$
    </p>
    <p>
        While physical ingredients scale linearly with factor $k$, cooking times and heat conduction rates do not scale linearly due to surface-area-to-volume ratio thermodynamics ($A/V \propto 1/L$).
    </p>

    <h3>4. Oven Temperature Scale Transformations</h3>
    <p>
        Baking reactions (such as Maillard browning, starch gelatinization, and protein denaturation) depend critically on oven chamber temperature. Converting between Fahrenheit ($^\circ\text{F}$), Celsius ($^\circ\text{C}$), and British Gas Marks follows:
    </p>
    <p>
        $$T_{^\circ\text{C}} = (T_{^\circ\text{F}} - 32) \times \frac{5}{9}, \quad T_{^\circ\text{F}} = \left(T_{^\circ\text{C}} \times \frac{9}{5}\right) + 32$$
    </p>
    <p>
        The British Gas Mark ($G$) scale for $G \ge 1$ corresponds approximately to:
    </p>
    <p>
        $$T_{^\circ\text{F}} = 250 + 25 \times (G - 1) \quad (\text{for integer gas marks } 1 \le G \le 9)$$
    </p>
    <p>
        For instance, Gas Mark $4 \approx 350^\circ\text{F} \approx 177^\circ\text{C}$, standard for cookie and cake baking; Gas Mark $6 \approx 400^\circ\text{F} \approx 204^\circ\text{C}$, standard for roasting poultry and vegetables.
    </p>
</div>
"""
