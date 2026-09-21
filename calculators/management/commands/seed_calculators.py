from django.core.management.base import BaseCommand
from calculators.models import Calculator
from calculators.default_articles import BMI_ARTICLE, LOAN_ARTICLE, PERCENTAGE_ARTICLE
from calculators.default_articles_batch2 import (
    MORTGAGE_ARTICLE,
    CALORIE_ARTICLE,
    SCIENTIFIC_ARTICLE,
    AGE_ARTICLE,
)
from calculators.default_articles_batch3 import (
    AUTO_LOAN_ARTICLE,
    BODY_FAT_ARTICLE,
    FRACTION_ARTICLE,
    DATE_DIFFERENCE_ARTICLE,
)
from calculators.default_articles_batch4 import (
    COMPOUND_INTEREST_ARTICLE,
    BMR_ARTICLE,
    BINARY_HEX_ARTICLE,
    TIME_DURATION_ARTICLE,
)
from calculators.default_articles_batch5 import (
    AMORTIZATION_ARTICLE,
    IDEAL_WEIGHT_ARTICLE,
    DECIMAL_TO_FRACTION_ARTICLE,
    WORK_HOURS_ARTICLE,
)
from calculators.default_articles_batch6 import (
    REFINANCE_ARTICLE,
    RUNNING_PACE_ARTICLE,
    GRAPHING_ARTICLE,
    GPA_ARTICLE,
)
from calculators.default_articles_batch7 import (
    RETIREMENT_ARTICLE,
    TARGET_HEART_RATE_ARTICLE,
    MATRIX_ARTICLE,
    FINAL_GRADE_ARTICLE,
)
from calculators.default_articles_batch8 import (
    INVESTMENT_ARTICLE,
    PREGNANCY_ARTICLE,
    RANDOM_NUMBER_ARTICLE,
    SUBNET_ARTICLE,
)
from calculators.default_articles_batch8_new import (
    INFLATION_ARTICLE,
    OVULATION_ARTICLE,
    STANDARD_DEVIATION_ARTICLE,
    SPEED_DISTANCE_TIME_ARTICLE,
)
from calculators.default_articles_batch9 import (
    SALARY_TO_HOURLY_ARTICLE,
    LEAN_BODY_MASS_ARTICLE,
    RIGHT_TRIANGLE_ARTICLE,
    TIP_CALCULATOR_ARTICLE,
)
from calculators.default_articles_batch10 import (
    INCOME_TAX_ARTICLE,
    WATER_INTAKE_ARTICLE,
    EXPONENT_ARTICLE,
    FUEL_COST_ARTICLE,
)
from calculators.default_articles_batch11 import (
    CD_ARTICLE,
    MACRO_ARTICLE,
    LOG_ARTICLE,
    DENSITY_ARTICLE,
)
from calculators.default_articles_batch12 import (
    FOUR_ZERO_ONE_K_ARTICLE,
    SLEEP_ARTICLE,
    PERMUTATIONS_COMBINATIONS_ARTICLE,
    FORCE_ARTICLE,
)
from calculators.default_articles_batch13 import (
    ANNUITY_PAYOUT_ARTICLE,
    ARMY_BODY_FAT_ARTICLE,
    MEAN_MEDIAN_MODE_ARTICLE,
    POWER_CONVERTER_ARTICLE,
)


CALCULATORS_DATA = [
    # Batch 1 Calculators
    {
        'slug': 'bmi-calculator',
        'title': 'BMI Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'BMI Calculator - Body Mass Index & Weight Classification | CalculatorHub',
        'meta_description': 'Free online BMI Calculator calculating Body Mass Index for adults using Metric or US imperial units. Includes WHO weight categories and step-by-step math.',
        'article_content': BMI_ARTICLE,
    },
    {
        'slug': 'loan-calculator',
        'title': 'Loan Calculator',
        'category': 'financial',
        'meta_title': 'Loan Calculator - Monthly Payments, Total Interest & Amortization | CalculatorHub',
        'meta_description': 'Calculate monthly loan payments, total interest paid, and full payoff schedules for mortgages, auto loans, or personal financing.',
        'article_content': LOAN_ARTICLE,
    },
    {
        'slug': 'percentage-calculator',
        'title': 'Percentage Calculator',
        'category': 'math',
        'meta_title': 'Percentage Calculator - Calculate Percentages, Discounts & Change | CalculatorHub',
        'meta_description': 'Instant percentage calculations: what is X% of Y, X is what percent of Y, and percentage increase or decrease with detailed formulas.',
        'article_content': PERCENTAGE_ARTICLE,
    },
    # Batch 2 Calculators
    {
        'slug': 'mortgage-calculator',
        'title': 'Mortgage Calculator',
        'category': 'financial',
        'meta_title': 'Mortgage Calculator - Estimate P&I, Property Tax, Insurance & HOA | CalculatorHub',
        'meta_description': 'Free online Mortgage Calculator. Calculate monthly PITI payments, total interest, down payment impact, and full 15/30-year amortization schedule.',
        'article_content': MORTGAGE_ARTICLE,
    },
    {
        'slug': 'calorie-calculator',
        'title': 'Calorie Needs Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Calorie Calculator - Daily Caloric Needs & Weight Loss Targets | CalculatorHub',
        'meta_description': 'Calculate your daily calorie needs and TDEE based on the Mifflin-St Jeor BMR equation. Includes deficit targets for sustainable fat loss.',
        'article_content': CALORIE_ARTICLE,
    },
    {
        'slug': 'scientific-calculator',
        'title': 'Scientific Calculator',
        'category': 'math',
        'meta_title': 'Scientific Calculator - Online Advanced Engineering & Math Tools | CalculatorHub',
        'meta_description': 'Free online scientific calculator with trigonometric, logarithmic, exponential, and algebraic functions. Supports DEG and RAD angle modes.',
        'article_content': SCIENTIFIC_ARTICLE,
    },
    {
        'slug': 'age-calculator',
        'title': 'Age Calculator',
        'category': 'other',
        'meta_title': 'Age Calculator - Exact Chronological Age in Years, Months, Days | CalculatorHub',
        'meta_description': 'Calculate your exact age in years, months, weeks, days, hours, and minutes. Includes next birthday countdown and astrological information.',
        'article_content': AGE_ARTICLE,
    },
    # Batch 3 Calculators
    {
        'slug': 'auto-loan-calculator',
        'title': 'Auto Loan Calculator',
        'category': 'financial',
        'meta_title': 'Auto Loan Calculator - Car Payment, Interest & Trade-in | CalculatorHub',
        'meta_description': 'Free online Auto Loan Calculator. Calculate monthly car payments, total interest, sales tax, fees, and trade-in equity impact.',
        'article_content': AUTO_LOAN_ARTICLE,
    },
    {
        'slug': 'body-fat-calculator',
        'title': 'Body Fat Percentage Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Body Fat Calculator - U.S. Navy Method & Body Composition | CalculatorHub',
        'meta_description': 'Calculate body fat percentage using the scientific U.S. Navy tape measure method. Evaluates lean body mass, fat mass, and ACE categories.',
        'article_content': BODY_FAT_ARTICLE,
    },
    {
        'slug': 'fraction-calculator',
        'title': 'Fraction Calculator',
        'category': 'math',
        'meta_title': 'Fraction Calculator - Add, Subtract, Multiply & Divide Fractions | CalculatorHub',
        'meta_description': 'Free online Fraction Calculator with step-by-step simplification, mixed numbers, common denominators, and decimal conversion.',
        'article_content': FRACTION_ARTICLE,
    },
    {
        'slug': 'date-difference-calculator',
        'title': 'Date Difference Calculator',
        'category': 'other',
        'meta_title': 'Date Difference Calculator - Days, Weeks, Business Days Between Dates | CalculatorHub',
        'meta_description': 'Calculate exact time between two dates in years, months, weeks, days, and working business days with leap year precision.',
        'article_content': DATE_DIFFERENCE_ARTICLE,
    },
    # Batch 4 Calculators (User Batch #3)
    {
        'slug': 'compound-interest-calculator',
        'title': 'Compound Interest Calculator',
        'category': 'financial',
        'meta_title': 'Compound Interest Calculator - Future Value & Investment Growth | CalculatorHub',
        'meta_description': 'Calculate compound interest with periodic monthly deposits, compounding frequencies, APY, and year-by-year schedule.',
        'article_content': COMPOUND_INTEREST_ARTICLE,
    },
    {
        'slug': 'bmr-calculator',
        'title': 'Basal Metabolic Rate (BMR) Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'BMR Calculator - Basal Metabolic Rate & Daily Energy Expenditure | CalculatorHub',
        'meta_description': 'Calculate your Basal Metabolic Rate using Mifflin-St Jeor, Harris-Benedict, and Katch-McArdle equations. Includes TDEE activity multipliers.',
        'article_content': BMR_ARTICLE,
    },
    {
        'slug': 'binary-hex-converter',
        'title': 'Binary & Hexadecimal Converter',
        'category': 'math',
        'meta_title': 'Binary to Hexadecimal & Decimal Converter - Multi-Base Calculator | CalculatorHub',
        'meta_description': 'Instant multi-base converter for Binary, Hexadecimal, Decimal, and Octal numbers with interactive bit array and two\'s complement.',
        'article_content': BINARY_HEX_ARTICLE,
    },
    {
        'slug': 'time-duration-calculator',
        'title': 'Time & Duration Calculator',
        'category': 'other',
        'meta_title': 'Time & Duration Calculator - Add, Subtract & Measure Elapsed Time | CalculatorHub',
        'meta_description': 'Calculate duration between two times, add or subtract hours/minutes/seconds, and convert elapsed time to decimal hours for payroll.',
        'article_content': TIME_DURATION_ARTICLE,
    },
    # Batch 5 Calculators (User Batch #4)
    {
        'slug': 'amortization-calculator',
        'title': 'Amortization Calculator',
        'category': 'financial',
        'meta_title': 'Amortization Calculator - Loan Schedule, Extra Payments & Payoff | CalculatorHub',
        'meta_description': 'Free online Amortization Calculator with comprehensive annual and monthly payoff schedules, principal-interest breakdown, and extra prepayment savings analysis.',
        'article_content': AMORTIZATION_ARTICLE,
    },
    {
        'slug': 'ideal-weight-calculator',
        'title': 'Ideal Body Weight Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Ideal Body Weight Calculator - Devine, Robinson, Miller & Hamwi Formulas | CalculatorHub',
        'meta_description': 'Calculate your ideal body weight (IBW) using scientific formulas (Devine, Robinson, Miller, Hamwi) and WHO healthy BMI ranges for men and women.',
        'article_content': IDEAL_WEIGHT_ARTICLE,
    },
    {
        'slug': 'decimal-to-fraction-calculator',
        'title': 'Decimal to Fraction Converter',
        'category': 'math',
        'meta_title': 'Decimal to Fraction Converter - Repeating Decimals & Mixed Fractions | CalculatorHub',
        'meta_description': 'Convert terminating and repeating decimals to simplified fractions and mixed numbers. Features Euclidean GCD reduction, algebraic proofs, and inch fraction rulers.',
        'article_content': DECIMAL_TO_FRACTION_ARTICLE,
    },
    {
        'slug': 'work-hours-calculator',
        'title': 'Work Hours & Timesheet Calculator',
        'category': 'other',
        'meta_title': 'Work Hours Calculator - Weekly Timesheet, Overtime & Gross Pay | CalculatorHub',
        'meta_description': 'Free online Work Hours & Timesheet Calculator. Track daily shift hours, unpaid meal breaks, 40-hour overtime rates, and gross payroll earnings.',
        'article_content': WORK_HOURS_ARTICLE,
    },
    # Batch 6 Calculators (User Batch #5)
    {
        'slug': 'refinance-calculator',
        'title': 'Refinance Calculator',
        'category': 'financial',
        'meta_title': 'Refinance Calculator - Compare Monthly Payments & Break-Even | CalculatorHub',
        'meta_description': 'Free online Mortgage Refinance Calculator. Compare current vs new interest rates, monthly savings, closing cost break-even point, and lifetime interest reduction.',
        'article_content': REFINANCE_ARTICLE,
    },
    {
        'slug': 'running-pace-calculator',
        'title': 'Running Pace Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Running Pace Calculator - Target Pace, Splits & Race Time Predictor | CalculatorHub',
        'meta_description': 'Calculate running pace per mile or km, split times, and linear speeds (mph/kmh). Predict marathon and half-marathon finishes using Riegel\'s formula.',
        'article_content': RUNNING_PACE_ARTICLE,
    },
    {
        'slug': 'graphing-calculator',
        'title': '2D Function Graphing Tool',
        'category': 'math',
        'meta_title': '2D Function Graphing Tool - Plot Functions, Roots & Derivatives | CalculatorHub',
        'meta_description': 'Interactive online 2D function grapher. Plot multiple curves with zoom, pan, coordinate tracing, numerical derivative evaluation, and roots inspection.',
        'article_content': GRAPHING_ARTICLE,
    },
    {
        'slug': 'gpa-calculator',
        'title': 'College GPA Calculator',
        'category': 'other',
        'meta_title': 'College GPA Calculator - Weighted Semester, Cumulative & Target GPA | CalculatorHub',
        'meta_description': 'Calculate semester and cumulative college GPA on the 4.0 scale with course credit weighting, honors/AP bonuses, and target graduation GPA simulation.',
        'article_content': GPA_ARTICLE,
    },
    # Batch 7 Calculators (User Batch #6)
    {
        'slug': 'retirement-calculator',
        'title': 'Retirement Calculator',
        'category': 'financial',
        'meta_title': 'Retirement Calculator - Nest Egg, Savings & 4% Drawdown | CalculatorHub',
        'meta_description': 'Free online Retirement Calculator. Project compound savings nest egg, safe withdrawal rates, inflation-adjusted spending, and pension/social security.',
        'article_content': RETIREMENT_ARTICLE,
    },
    {
        'slug': 'target-heart-rate-calculator',
        'title': 'Target Heart Rate Zones Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Target Heart Rate Zones - Karvonen HRR & Tanaka Formula | CalculatorHub',
        'meta_description': 'Calculate 5 cardiovascular training zones using Karvonen Heart Rate Reserve (HRR) and Tanaka MHR formulas. Tailored for fat-burn, aerobic base, and VO2 max.',
        'article_content': TARGET_HEART_RATE_ARTICLE,
    },
    {
        'slug': 'matrix-calculator',
        'title': 'Matrix Operations Calculator',
        'category': 'math',
        'meta_title': 'Matrix Calculator - Determinant, Inverse, Multiply & Transpose | CalculatorHub',
        'meta_description': 'Free online Matrix Calculator. Compute determinants, inverse matrices, matrix multiplication, addition, subtraction, trace, and transpose up to 4x4.',
        'article_content': MATRIX_ARTICLE,
    },
    {
        'slug': 'final-grade-calculator',
        'title': 'Final Grade Needed Calculator',
        'category': 'other',
        'meta_title': 'Final Grade Needed Calculator - Target Exam Score Solver | CalculatorHub',
        'meta_description': 'Calculate the exact score needed on your final exam to secure your desired course grade. Supports weighted grading categories and feasibility analysis.',
        'article_content': FINAL_GRADE_ARTICLE,
    },
    # Batch 8 Calculators (User Batch #7)
    {
        'slug': 'investment-calculator',
        'title': 'Investment Calculator',
        'category': 'financial',
        'meta_title': 'Investment Calculator - Compound Growth, Contributions & Returns | CalculatorHub',
        'meta_description': 'Free online Investment Calculator. Calculate future portfolio value, compound returns with periodic contributions, inflation adjustments, and annual growth schedules.',
        'article_content': INVESTMENT_ARTICLE,
    },
    {
        'slug': 'pregnancy-calculator',
        'title': 'Pregnancy Due Date Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Pregnancy Due Date Calculator - EDD, Trimester & Conception | CalculatorHub',
        'meta_description': 'Estimate your baby\'s due date, gestational age, and pregnancy trimesters using LMP (Naegele\'s rule), conception date, IVF embryo transfer, or ultrasound scan.',
        'article_content': PREGNANCY_ARTICLE,
    },
    {
        'slug': 'random-number-generator',
        'title': 'Random Number Generator',
        'category': 'math',
        'meta_title': 'Random Number Generator - True Random, Decimals & Gaussian | CalculatorHub',
        'meta_description': 'Generate true random integers, floating point decimals, Gaussian normal distributions, dice rolls, and lottery picks with CSPRNG cryptographic security.',
        'article_content': RANDOM_NUMBER_ARTICLE,
    },
    {
        'slug': 'subnet-calculator',
        'title': 'IPv4 Subnet Mask Calculator',
        'category': 'other',
        'meta_title': 'IPv4 Subnet Mask Calculator - CIDR, Network, Broadcast & Usable Hosts | CalculatorHub',
        'meta_description': 'Calculate IPv4 network address, broadcast address, usable host IP range, CIDR prefix masks, wildcard mask, and 32-bit binary octet breakdowns.',
        'article_content': SUBNET_ARTICLE,
    },
    # Batch 8 Calculators
    {
        'slug': 'inflation-calculator',
        'title': 'Inflation Calculator',
        'category': 'financial',
        'meta_title': 'Inflation Calculator - Cumulative CPI, Future Value & Purchasing Power | CalculatorHub',
        'meta_description': 'Calculate compound forward inflation, future equivalent costs, purchasing power erosion, and real vs nominal rates with historical CPI trends and Rule of 72.',
        'article_content': INFLATION_ARTICLE,
    },
    {
        'slug': 'ovulation-calculator',
        'title': 'Ovulation & Fertility Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Ovulation & Fertility Calculator - Fertile Window & Conception Days | CalculatorHub',
        'meta_description': 'Estimate your most fertile days, ovulation date, peak conception probability window, next period, and earliest pregnancy test timing using clinical cycle algorithms.',
        'article_content': OVULATION_ARTICLE,
    },
    {
        'slug': 'standard-deviation-calculator',
        'title': 'Standard Deviation & Variance Calculator',
        'category': 'math',
        'meta_title': 'Standard Deviation Calculator - Sample vs Population Variance (n-1) | CalculatorHub',
        'meta_description': 'Calculate sample and population standard deviation, variance with Bessel\'s correction (n-1), mean, sum of squares, and step-by-step statistical deviation tables.',
        'article_content': STANDARD_DEVIATION_ARTICLE,
    },
    {
        'slug': 'speed-distance-time-calculator',
        'title': 'Speed, Distance & Time Calculator',
        'category': 'other',
        'meta_title': 'Speed, Distance & Time Calculator - Kinematic Travel & Pace Solver | CalculatorHub',
        'meta_description': 'Solve for speed (v=d/t), distance (d=vt), or elapsed time (t=d/v) with multi-unit conversions (mph, km/h, m/s, knots), running pace, and multi-leg harmonic average speed.',
        'article_content': SPEED_DISTANCE_TIME_ARTICLE,
    },
    # Batch 9 Calculators
    {
        'slug': 'salary-to-hourly-calculator',
        'title': 'Salary to Hourly Calculator',
        'category': 'financial',
        'meta_title': 'Salary to Hourly Calculator - Annual, Bi-Weekly, Daily & Overtime | CalculatorHub',
        'meta_description': 'Convert annual salary to hourly wage and vice versa with paid time off (PTO) adjustments, statutory holidays, overtime multipliers, and pay schedule breakdowns.',
        'article_content': SALARY_TO_HOURLY_ARTICLE,
    },
    {
        'slug': 'lean-body-mass-calculator',
        'title': 'Lean Body Mass Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Lean Body Mass Calculator - Boer, James & Hume Clinical Models | CalculatorHub',
        'meta_description': 'Calculate lean body mass (LBM), fat mass, and body fat percentage using validated Boer, James, and Hume clinical anthropometric formulas in metric or imperial.',
        'article_content': LEAN_BODY_MASS_ARTICLE,
    },
    {
        'slug': 'right-triangle-solver',
        'title': 'Right Triangle Solver',
        'category': 'math',
        'meta_title': 'Right Triangle Solver - Pythagorean Sides, Angles, Area & Inradius | CalculatorHub',
        'meta_description': 'Solve any right-angled triangle from any two inputs with Pythagorean theorem, trigonometry (sin, cos, tan), area, perimeter, altitude, inradius, and circumradius.',
        'article_content': RIGHT_TRIANGLE_ARTICLE,
    },
    {
        'slug': 'tip-calculator',
        'title': 'Tip & Split Bill Calculator',
        'category': 'other',
        'meta_title': 'Tip & Split Bill Calculator - Group Dining, Tax & Tip Per Person | CalculatorHub',
        'meta_description': 'Calculate restaurant tips, split bills evenly among dining parties, isolate pre-tax food charges, and apply convenient rounding to the nearest dollar.',
        'article_content': TIP_CALCULATOR_ARTICLE,
    },
    # Batch 11 Calculators (User Batch #10)
    {
        'slug': 'income-tax-calculator',
        'title': 'Income Tax Calculator',
        'category': 'financial',
        'meta_title': 'Income Tax Calculator - 2024/2025 Federal Brackets, FICA & Take-Home Pay | CalculatorHub',
        'meta_description': 'Calculate federal income tax, FICA Social Security and Medicare, state tax estimation, and net take-home pay with progressive bracket breakdowns.',
        'article_content': INCOME_TAX_ARTICLE,
    },
    {
        'slug': 'water-intake-calculator',
        'title': 'Daily Water Intake Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Daily Water Intake Calculator - Hydration Goals, Sweat Loss & Pacing | CalculatorHub',
        'meta_description': 'Calculate your optimal daily water intake based on body weight, exercise duration, ambient climate, and physiological state with customized hydration pacing.',
        'article_content': WATER_INTAKE_ARTICLE,
    },
    {
        'slug': 'exponent-calculator',
        'title': 'Exponent & Power Calculator',
        'category': 'math',
        'meta_title': 'Exponent & Power Calculator - Large Numbers, Negative & Fractional Powers | CalculatorHub',
        'meta_description': 'Solve exponents and power functions online. Supports integer, negative, and fractional rational exponents with step-by-step algebraic expansion rules.',
        'article_content': EXPONENT_ARTICLE,
    },
    {
        'slug': 'fuel-cost-calculator',
        'title': 'Fuel Cost & Mileage Trip Planner',
        'category': 'other',
        'meta_title': 'Fuel Cost & Mileage Trip Planner - Gas Mileage, Tolls & Carpool Split | CalculatorHub',
        'meta_description': 'Calculate road trip fuel costs, gas consumption, toll charges, and passenger carpool splits using MPG or L/100km fuel economy metrics.',
        'article_content': FUEL_COST_ARTICLE,
    },
    # Batch 12 Calculators (User Batch #11)
    {
        'slug': 'cd-calculator',
        'title': 'Certificate of Deposit (CD) Calculator',
        'category': 'financial',
        'meta_title': 'Certificate of Deposit (CD) Calculator - APY & Growth Schedule | CalculatorHub',
        'meta_description': 'Calculate certificate of deposit maturity value, compound interest earnings, early withdrawal penalties, and after-tax growth schedules with daily or monthly compounding.',
        'article_content': CD_ARTICLE,
    },
    {
        'slug': 'macro-calculator',
        'title': 'Macronutrient Ratio Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Macronutrient Ratio Calculator - Protein, Carb & Fat Grams by Goal | CalculatorHub',
        'meta_description': 'Calculate optimal daily macronutrient gram targets for protein, carbohydrates, and healthy fats based on TDEE, metabolic profile, cutting, bulking, or maintenance.',
        'article_content': MACRO_ARTICLE,
    },
    {
        'slug': 'log-calculator',
        'title': 'Logarithm (Natural & Base 10) Calculator',
        'category': 'math',
        'meta_title': 'Logarithm Calculator - Log10, Natural Log (ln), Binary & Custom Base | CalculatorHub',
        'meta_description': 'Evaluate common log, natural log (ln), binary log, and custom base logarithms with step-by-step change-of-base derivations, exponential proofs, and anti-logarithms.',
        'article_content': LOG_ARTICLE,
    },
    {
        'slug': 'density-calculator',
        'title': 'Physical Density Calculator',
        'category': 'other',
        'meta_title': 'Physical Density Calculator - Mass, Volume & Specific Gravity Solver | CalculatorHub',
        'meta_description': 'Calculate physical density, mass, or volume with multi-unit conversions across SI and Imperial metrics. Includes specific gravity, buoyancy simulation, and material presets.',
        'article_content': DENSITY_ARTICLE,
    },
    # Batch 13 Calculators (User Batch #12)
    {
        'slug': '401k-calculator',
        'title': '401(k) Retirement Calculator',
        'category': 'financial',
        'meta_title': '401(k) Calculator - Retirement Savings, Employer Match & Growth | CalculatorHub',
        'meta_description': 'Estimate your 401(k) retirement balance, employer match earnings, compound growth, and projected retirement income with inflation and safe withdrawal models.',
        'article_content': FOUR_ZERO_ONE_K_ARTICLE,
    },
    {
        'slug': 'sleep-calculator',
        'title': 'Sleep Cycle Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Sleep Calculator - 90-Minute Sleep Cycles & Optimal Bedtimes | CalculatorHub',
        'meta_description': 'Calculate ideal bedtime and wake-up times synchronized with natural 90-minute ultradian sleep cycles to eliminate morning sleep inertia and maximize restorative rest.',
        'article_content': SLEEP_ARTICLE,
    },
    {
        'slug': 'permutations-combinations-calculator',
        'title': 'Permutations & Combinations Calculator',
        'category': 'math',
        'meta_title': 'Permutations and Combinations Calculator - nPr & nCr Solver | CalculatorHub',
        'meta_description': 'Compute permutations (nPr) and combinations (nCr) with and without repetition. Features step-by-step factorial algebraic expansion and subset sample generation.',
        'article_content': PERMUTATIONS_COMBINATIONS_ARTICLE,
    },
    {
        'slug': 'force-calculator',
        'title': 'Newton Force Calculator',
        'category': 'other',
        'meta_title': 'Newton Force Calculator - F = ma, Weight, Friction & Centripetal Solver | CalculatorHub',
        'meta_description': 'Solve Newton’s Second Law of Motion (F = ma) for force, mass, or acceleration. Features planetary gravity weight presets, friction physics, and multi-unit conversions.',
        'article_content': FORCE_ARTICLE,
    },
    # Batch 14 Calculators (User Batch #13)
    {
        'slug': 'annuity-payout-calculator',
        'title': 'Annuity Payout Calculator',
        'category': 'financial',
        'meta_title': 'Annuity Payout Calculator - Fixed Period & Income Stream | CalculatorHub',
        'meta_description': 'Calculate periodic annuity payouts, total interest earnings, portfolio longevity, and ordinary annuity vs annuity due distributions with full amortization schedules.',
        'article_content': ANNUITY_PAYOUT_ARTICLE,
    },
    {
        'slug': 'army-body-fat-calculator',
        'title': 'Army Body Fat Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Army Body Fat Calculator - AR 600-9 Tape Test Standard | CalculatorHub',
        'meta_description': 'Official US Army Body Composition Program (AR 600-9) tape test calculator. Compute military body fat percentage for males and females with pass/fail standards.',
        'article_content': ARMY_BODY_FAT_ARTICLE,
    },
    {
        'slug': 'mean-median-mode-calculator',
        'title': 'Mean, Median & Mode Calculator',
        'category': 'math',
        'meta_title': 'Mean, Median, Mode Calculator - Statistics & Variance Solver | CalculatorHub',
        'meta_description': 'Compute mean, median, mode, sample and population variance, standard deviation, range, quartiles, and IQR with step-by-step statistical distributions.',
        'article_content': MEAN_MEDIAN_MODE_ARTICLE,
    },
    {
        'slug': 'power-converter',
        'title': 'Power & Wattage Converter',
        'category': 'other',
        'meta_title': 'Power Converter - Watts, Horsepower, kW, BTU/h & dBm | CalculatorHub',
        'meta_description': 'Convert power units across Watts, Kilowatts, Mechanical & Metric Horsepower, BTU/h, Tons of Refrigeration, and dBm. Includes appliance energy cost estimation.',
        'article_content': POWER_CONVERTER_ARTICLE,
    },
]


class Command(BaseCommand):
    help = 'Populates or updates the Calculator database models with comprehensive SEO articles and KaTeX formulas.'

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0

        for item in CALCULATORS_DATA:
            calc, created = Calculator.objects.update_or_create(
                slug=item['slug'],
                defaults={
                    'title': item['title'],
                    'category': item['category'],
                    'meta_title': item['meta_title'],
                    'meta_description': item['meta_description'],
                    'article_content': item['article_content'],
                }
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created calculator: {calc.title} ({calc.slug})"))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f"Updated calculator: {calc.title} ({calc.slug})"))

        self.stdout.write(self.style.SUCCESS(
            f"\nFinished seeding calculators! Created: {created_count}, Updated: {updated_count}. Total in DB: {Calculator.objects.count()}"
        ))
