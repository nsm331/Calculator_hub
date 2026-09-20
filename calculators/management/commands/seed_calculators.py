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
