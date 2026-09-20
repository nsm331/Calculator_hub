from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.urls import reverse
from .models import Calculator
from .default_articles import BMI_ARTICLE, LOAN_ARTICLE, PERCENTAGE_ARTICLE
from .default_articles_batch2 import (
    MORTGAGE_ARTICLE,
    CALORIE_ARTICLE,
    SCIENTIFIC_ARTICLE,
    AGE_ARTICLE,
)
from .default_articles_batch3 import (
    AUTO_LOAN_ARTICLE,
    BODY_FAT_ARTICLE,
    FRACTION_ARTICLE,
    DATE_DIFFERENCE_ARTICLE,
)
from .default_articles_batch4 import (
    COMPOUND_INTEREST_ARTICLE,
    BMR_ARTICLE,
    BINARY_HEX_ARTICLE,
    TIME_DURATION_ARTICLE,
)
from .default_articles_batch5 import (
    AMORTIZATION_ARTICLE,
    IDEAL_WEIGHT_ARTICLE,
    DECIMAL_TO_FRACTION_ARTICLE,
    WORK_HOURS_ARTICLE,
)
from .default_articles_batch6 import (
    REFINANCE_ARTICLE,
    RUNNING_PACE_ARTICLE,
    GRAPHING_ARTICLE,
    GPA_ARTICLE,
)
from .default_articles_batch7 import (
    RETIREMENT_ARTICLE,
    TARGET_HEART_RATE_ARTICLE,
    MATRIX_ARTICLE,
    FINAL_GRADE_ARTICLE,
)
from .default_articles_batch8 import (
    INVESTMENT_ARTICLE,
    PREGNANCY_ARTICLE,
    RANDOM_NUMBER_ARTICLE,
    SUBNET_ARTICLE,
)
from .default_articles_batch8_new import (
    INFLATION_ARTICLE,
    OVULATION_ARTICLE,
    STANDARD_DEVIATION_ARTICLE,
    SPEED_DISTANCE_TIME_ARTICLE,
)
from .default_articles_batch9 import (
    SALARY_TO_HOURLY_ARTICLE,
    LEAN_BODY_MASS_ARTICLE,
    RIGHT_TRIANGLE_ARTICLE,
    TIP_CALCULATOR_ARTICLE,
)
from .default_articles_batch10 import (
    INCOME_TAX_ARTICLE,
    WATER_INTAKE_ARTICLE,
    EXPONENT_ARTICLE,
    FUEL_COST_ARTICLE,
)


def _get_or_seed_calculator(slug, default_data):
    """Retrieve calculator by slug or automatically seed it if not yet in database."""
    calc = Calculator.objects.filter(slug=slug).first()
    if not calc:
        calc = Calculator.objects.create(
            slug=slug,
            title=default_data['title'],
            category=default_data['category'],
            meta_title=default_data['meta_title'],
            meta_description=default_data['meta_description'],
            article_content=default_data['article_content'],
        )
    return calc


def home(request):
    """Home view with search bar, featured tools, and category directories."""
    featured_calculators = [
        {
            'title': 'Loan Calculator',
            'category': 'Financial',
            'desc': 'Determine monthly payments, total interest burden, and full loan amortization.',
            'url': reverse('loan_calculator'),
            'badge': 'Finance',
            'icon': 'finance'
        },
        {
            'title': 'Mortgage Calculator',
            'category': 'Financial',
            'desc': 'Estimate complete monthly PITI payment, property taxes, insurance, and interest.',
            'url': reverse('mortgage_calculator'),
            'badge': 'Mortgage',
            'icon': 'finance'
        },
        {
            'title': 'BMI Calculator',
            'category': 'Fitness & Health',
            'desc': 'Compute accurate Body Mass Index, health category, and optimal weight targets.',
            'url': reverse('bmi_calculator'),
            'badge': 'Health',
            'icon': 'fitness'
        },
        {
            'title': 'Calorie Calculator',
            'category': 'Fitness & Health',
            'desc': 'Determine daily caloric needs and TDEE based on the Mifflin-St Jeor equation.',
            'url': reverse('calorie_calculator'),
            'badge': 'Nutrition',
            'icon': 'fitness'
        },
        {
            'title': 'Percentage Calculator',
            'category': 'Math',
            'desc': 'Solve percentage proportions, percent changes, discounts, and tips instantly.',
            'url': reverse('percentage_calculator'),
            'badge': 'Math',
            'icon': 'math'
        },
        {
            'title': 'Scientific Calculator',
            'category': 'Math',
            'desc': 'Evaluate advanced trigonometric, logarithmic, root, and power equations.',
            'url': reverse('scientific_calculator'),
            'badge': 'Science',
            'icon': 'math'
        },
        {
            'title': 'Age Calculator',
            'category': 'Other',
            'desc': 'Calculate your exact chronological age in years, months, days, hours, and minutes.',
            'url': reverse('age_calculator'),
            'badge': 'Tools',
            'icon': 'other'
        },
    ]
    context = {
        'meta_title': 'Free Online Calculators - Math, Fitness, Finance & Scientific Tools | CalculatorHub',
        'meta_description': 'CalculatorHub provides instant, transparent, and completely free online calculators for financial planning, fitness tracking, mathematical equations, and daily life.',
        'featured_calculators': featured_calculators,
    }
    return render(request, 'index.html', context)


# --------------------------------------------------------------------------
# Batch 1 Calculators
# --------------------------------------------------------------------------
def bmi_calculator(request):
    """Dynamic view for BMI Calculator."""
    default_data = {
        'title': 'BMI Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'BMI Calculator - Body Mass Index & Weight Classification | CalculatorHub',
        'meta_description': 'Free online BMI Calculator calculating Body Mass Index for adults using Metric or US imperial units. Includes WHO weight categories and step-by-step math.',
        'article_content': BMI_ARTICLE,
    }
    calculator = _get_or_seed_calculator('bmi-calculator', default_data)
    return render(request, 'calculators/bmi_calculator.html', {'calculator': calculator})


def loan_calculator(request):
    """Dynamic view for Loan Calculator."""
    default_data = {
        'title': 'Loan Calculator',
        'category': 'financial',
        'meta_title': 'Loan Calculator - Monthly Payments, Total Interest & Amortization | CalculatorHub',
        'meta_description': 'Calculate monthly loan payments, total interest paid, and full payoff schedules for mortgages, auto loans, or personal financing.',
        'article_content': LOAN_ARTICLE,
    }
    calculator = _get_or_seed_calculator('loan-calculator', default_data)
    return render(request, 'calculators/loan_calculator.html', {'calculator': calculator})


def percentage_calculator(request):
    """Dynamic view for Percentage Calculator."""
    default_data = {
        'title': 'Percentage Calculator',
        'category': 'math',
        'meta_title': 'Percentage Calculator - Calculate Percentages, Discounts & Change | CalculatorHub',
        'meta_description': 'Instant percentage calculations: what is X% of Y, X is what percent of Y, and percentage increase or decrease with detailed formulas.',
        'article_content': PERCENTAGE_ARTICLE,
    }
    calculator = _get_or_seed_calculator('percentage-calculator', default_data)
    return render(request, 'calculators/percentage_calculator.html', {'calculator': calculator})


# --------------------------------------------------------------------------
# Batch 2 Calculators
# --------------------------------------------------------------------------
def mortgage_calculator(request):
    """Dynamic view for Mortgage Calculator."""
    default_data = {
        'title': 'Mortgage Calculator',
        'category': 'financial',
        'meta_title': 'Mortgage Calculator - Estimate P&I, Property Tax, Insurance & HOA | CalculatorHub',
        'meta_description': 'Free online Mortgage Calculator. Calculate monthly PITI payments, total interest, down payment impact, and full 15/30-year amortization schedule.',
        'article_content': MORTGAGE_ARTICLE,
    }
    calculator = _get_or_seed_calculator('mortgage-calculator', default_data)
    return render(request, 'calculators/mortgage_calculator.html', {'calculator': calculator})


def calorie_calculator(request):
    """Dynamic view for Calorie Needs Calculator."""
    default_data = {
        'title': 'Calorie Needs Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Calorie Calculator - Daily Caloric Needs & Weight Loss Targets | CalculatorHub',
        'meta_description': 'Calculate your daily calorie needs and TDEE based on the Mifflin-St Jeor BMR equation. Includes deficit targets for sustainable fat loss.',
        'article_content': CALORIE_ARTICLE,
    }
    calculator = _get_or_seed_calculator('calorie-calculator', default_data)
    return render(request, 'calculators/calorie_calculator.html', {'calculator': calculator})


def scientific_calculator(request):
    """Dynamic view for Scientific Calculator."""
    default_data = {
        'title': 'Scientific Calculator',
        'category': 'math',
        'meta_title': 'Scientific Calculator - Online Advanced Engineering & Math Tools | CalculatorHub',
        'meta_description': 'Free online scientific calculator with trigonometric, logarithmic, exponential, and algebraic functions. Supports DEG and RAD angle modes.',
        'article_content': SCIENTIFIC_ARTICLE,
    }
    calculator = _get_or_seed_calculator('scientific-calculator', default_data)
    return render(request, 'calculators/scientific_calculator.html', {'calculator': calculator})


def age_calculator(request):
    """Dynamic view for Age Calculator."""
    default_data = {
        'title': 'Age Calculator',
        'category': 'other',
        'meta_title': 'Age Calculator - Exact Chronological Age in Years, Months, Days | CalculatorHub',
        'meta_description': 'Calculate your exact age in years, months, weeks, days, hours, and minutes. Includes next birthday countdown and astrological information.',
        'article_content': AGE_ARTICLE,
    }
    calculator = _get_or_seed_calculator('age-calculator', default_data)
    return render(request, 'calculators/age_calculator.html', {'calculator': calculator})


# --------------------------------------------------------------------------
# Batch 3 Calculators
# --------------------------------------------------------------------------
def auto_loan_calculator(request):
    """Dynamic view for Auto Loan Calculator."""
    default_data = {
        'title': 'Auto Loan Calculator',
        'category': 'financial',
        'meta_title': 'Auto Loan Calculator - Car Payment, Interest & Trade-in | CalculatorHub',
        'meta_description': 'Free online Auto Loan Calculator. Calculate monthly car payments, total interest, sales tax, fees, and trade-in equity impact.',
        'article_content': AUTO_LOAN_ARTICLE,
    }
    calculator = _get_or_seed_calculator('auto-loan-calculator', default_data)
    return render(request, 'calculators/auto_loan_calculator.html', {'calculator': calculator})


def body_fat_calculator(request):
    """Dynamic view for Body Fat Percentage Calculator."""
    default_data = {
        'title': 'Body Fat Percentage Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Body Fat Calculator - U.S. Navy Method & Body Composition | CalculatorHub',
        'meta_description': 'Calculate body fat percentage using the scientific U.S. Navy tape measure method. Evaluates lean body mass, fat mass, and ACE categories.',
        'article_content': BODY_FAT_ARTICLE,
    }
    calculator = _get_or_seed_calculator('body-fat-calculator', default_data)
    return render(request, 'calculators/body_fat_calculator.html', {'calculator': calculator})


def fraction_calculator(request):
    """Dynamic view for Fraction Calculator."""
    default_data = {
        'title': 'Fraction Calculator',
        'category': 'math',
        'meta_title': 'Fraction Calculator - Add, Subtract, Multiply & Divide Fractions | CalculatorHub',
        'meta_description': 'Free online Fraction Calculator with step-by-step simplification, mixed numbers, common denominators, and decimal conversion.',
        'article_content': FRACTION_ARTICLE,
    }
    calculator = _get_or_seed_calculator('fraction-calculator', default_data)
    return render(request, 'calculators/fraction_calculator.html', {'calculator': calculator})


def date_difference_calculator(request):
    """Dynamic view for Date Difference Calculator."""
    default_data = {
        'title': 'Date Difference Calculator',
        'category': 'other',
        'meta_title': 'Date Difference Calculator - Days, Weeks, Business Days Between Dates | CalculatorHub',
        'meta_description': 'Calculate exact time between two dates in years, months, weeks, days, and working business days with leap year precision.',
        'article_content': DATE_DIFFERENCE_ARTICLE,
    }
    calculator = _get_or_seed_calculator('date-difference-calculator', default_data)
    return render(request, 'calculators/date_difference_calculator.html', {'calculator': calculator})


def compound_interest_calculator(request):
    """Dynamic view for Compound Interest Calculator."""
    default_data = {
        'title': 'Compound Interest Calculator',
        'category': 'financial',
        'meta_title': 'Compound Interest Calculator - Future Value & Investment Growth | CalculatorHub',
        'meta_description': 'Calculate compound interest with periodic monthly deposits, compounding frequencies, APY, and year-by-year schedule.',
        'article_content': COMPOUND_INTEREST_ARTICLE,
    }
    calculator = _get_or_seed_calculator('compound-interest-calculator', default_data)
    return render(request, 'calculators/compound_interest_calculator.html', {'calculator': calculator})


def bmr_calculator(request):
    """Dynamic view for Basal Metabolic Rate (BMR) Calculator."""
    default_data = {
        'title': 'Basal Metabolic Rate (BMR) Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'BMR Calculator - Basal Metabolic Rate & Daily Energy Expenditure | CalculatorHub',
        'meta_description': 'Calculate your Basal Metabolic Rate using Mifflin-St Jeor, Harris-Benedict, and Katch-McArdle equations. Includes TDEE activity multipliers.',
        'article_content': BMR_ARTICLE,
    }
    calculator = _get_or_seed_calculator('bmr-calculator', default_data)
    return render(request, 'calculators/bmr_calculator.html', {'calculator': calculator})


def binary_hex_converter(request):
    """Dynamic view for Binary & Hexadecimal Converter."""
    default_data = {
        'title': 'Binary & Hexadecimal Converter',
        'category': 'math',
        'meta_title': 'Binary to Hexadecimal & Decimal Converter - Multi-Base Calculator | CalculatorHub',
        'meta_description': 'Instant multi-base converter for Binary, Hexadecimal, Decimal, and Octal numbers with interactive bit array and two\'s complement.',
        'article_content': BINARY_HEX_ARTICLE,
    }
    calculator = _get_or_seed_calculator('binary-hex-converter', default_data)
    return render(request, 'calculators/binary_hex_converter.html', {'calculator': calculator})


def time_duration_calculator(request):
    """Dynamic view for Time & Duration Calculator."""
    default_data = {
        'title': 'Time & Duration Calculator',
        'category': 'other',
        'meta_title': 'Time & Duration Calculator - Add, Subtract & Measure Elapsed Time | CalculatorHub',
        'meta_description': 'Calculate duration between two times, add or subtract hours/minutes/seconds, and convert elapsed time to decimal hours for payroll.',
        'article_content': TIME_DURATION_ARTICLE,
    }
    calculator = _get_or_seed_calculator('time-duration-calculator', default_data)
    return render(request, 'calculators/time_duration_calculator.html', {'calculator': calculator})


def amortization_calculator(request):
    """Dynamic view for Amortization Calculator."""
    default_data = {
        'title': 'Amortization Calculator',
        'category': 'financial',
        'meta_title': 'Amortization Calculator - Monthly Schedule, Principal & Extra Payments | CalculatorHub',
        'meta_description': 'Calculate complete loan and mortgage amortization schedules with principal reduction, monthly interest, and early payoff acceleration.',
        'article_content': AMORTIZATION_ARTICLE,
    }
    calculator = _get_or_seed_calculator('amortization-calculator', default_data)
    return render(request, 'calculators/amortization_calculator.html', {'calculator': calculator})


def ideal_weight_calculator(request):
    """Dynamic view for Ideal Body Weight (IBW) Calculator."""
    default_data = {
        'title': 'Ideal Body Weight Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Ideal Weight Calculator - Devine, Robinson, Miller & WHO Formulas | CalculatorHub',
        'meta_description': 'Determine your ideal healthy body weight range based on clinical pharmacology formulas (Devine, Robinson, Miller, Hamwi) and WHO standards.',
        'article_content': IDEAL_WEIGHT_ARTICLE,
    }
    calculator = _get_or_seed_calculator('ideal-weight-calculator', default_data)
    return render(request, 'calculators/ideal_weight_calculator.html', {'calculator': calculator})


def decimal_to_fraction_calculator(request):
    """Dynamic view for Decimal to Fraction Converter."""
    default_data = {
        'title': 'Decimal to Fraction Converter',
        'category': 'math',
        'meta_title': 'Decimal to Fraction Converter - Terminating & Repeating Decimals | CalculatorHub',
        'meta_description': 'Convert any terminating or repeating decimal into its exact simplified fraction and mixed number with step-by-step algebraic proof.',
        'article_content': DECIMAL_TO_FRACTION_ARTICLE,
    }
    calculator = _get_or_seed_calculator('decimal-to-fraction-calculator', default_data)
    return render(request, 'calculators/decimal_to_fraction_calculator.html', {'calculator': calculator})


def work_hours_calculator(request):
    """Dynamic view for Work Hours & Timesheet Calculator."""
    default_data = {
        'title': 'Work Hours & Timesheet Calculator',
        'category': 'other',
        'meta_title': 'Work Hours & Timesheet Calculator - Gross Pay, Overtime & Decimal Hours | CalculatorHub',
        'meta_description': 'Calculate weekly work hours, lunch breaks, overtime compensation, and decimal payroll hours with standard overtime rules.',
        'article_content': WORK_HOURS_ARTICLE,
    }
    calculator = _get_or_seed_calculator('work-hours-calculator', default_data)
    return render(request, 'calculators/work_hours_calculator.html', {'calculator': calculator})


def refinance_calculator(request):
    """Dynamic view for Mortgage Refinance Calculator."""
    default_data = {
        'title': 'Refinance Calculator',
        'category': 'financial',
        'meta_title': 'Refinance Calculator - Compare Monthly Payments & Break-Even | CalculatorHub',
        'meta_description': 'Free online Mortgage Refinance Calculator. Compare current vs new interest rates, monthly savings, closing cost break-even point, and lifetime interest reduction.',
        'article_content': REFINANCE_ARTICLE,
    }
    calculator = _get_or_seed_calculator('refinance-calculator', default_data)
    return render(request, 'calculators/refinance_calculator.html', {'calculator': calculator})


def running_pace_calculator(request):
    """Dynamic view for Running Pace Calculator."""
    default_data = {
        'title': 'Running Pace Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Running Pace Calculator - Target Pace, Splits & Race Time Predictor | CalculatorHub',
        'meta_description': 'Calculate running pace per mile or km, split times, and linear speeds (mph/kmh). Predict marathon and half-marathon finishes using Riegel\'s formula.',
        'article_content': RUNNING_PACE_ARTICLE,
    }
    calculator = _get_or_seed_calculator('running-pace-calculator', default_data)
    return render(request, 'calculators/running_pace_calculator.html', {'calculator': calculator})


def graphing_calculator(request):
    """Dynamic view for 2D Function Graphing Tool."""
    default_data = {
        'title': '2D Function Graphing Tool',
        'category': 'math',
        'meta_title': '2D Function Graphing Tool - Plot Functions, Roots & Derivatives | CalculatorHub',
        'meta_description': 'Interactive online 2D function grapher. Plot multiple curves with zoom, pan, coordinate tracing, numerical derivative evaluation, and roots inspection.',
        'article_content': GRAPHING_ARTICLE,
    }
    calculator = _get_or_seed_calculator('graphing-calculator', default_data)
    return render(request, 'calculators/graphing_calculator.html', {'calculator': calculator})


def gpa_calculator(request):
    """Dynamic view for College GPA Calculator."""
    default_data = {
        'title': 'College GPA Calculator',
        'category': 'other',
        'meta_title': 'College GPA Calculator - Weighted Semester, Cumulative & Target GPA | CalculatorHub',
        'meta_description': 'Calculate semester and cumulative college GPA on the 4.0 scale with course credit weighting, honors/AP bonuses, and target graduation GPA simulation.',
        'article_content': GPA_ARTICLE,
    }
    calculator = _get_or_seed_calculator('gpa-calculator', default_data)
    return render(request, 'calculators/gpa_calculator.html', {'calculator': calculator})


def retirement_calculator(request):
    """Dynamic view for Retirement Calculator."""
    default_data = {
        'title': 'Retirement Calculator',
        'category': 'financial',
        'meta_title': 'Retirement Calculator - Nest Egg, Savings & 4% Drawdown | CalculatorHub',
        'meta_description': 'Free online Retirement Calculator. Project compound savings nest egg, safe withdrawal rates, inflation-adjusted spending, and pension/social security.',
        'article_content': RETIREMENT_ARTICLE,
    }
    calculator = _get_or_seed_calculator('retirement-calculator', default_data)
    return render(request, 'calculators/retirement_calculator.html', {'calculator': calculator})


def target_heart_rate_calculator(request):
    """Dynamic view for Target Heart Rate Zones Calculator."""
    default_data = {
        'title': 'Target Heart Rate Zones Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Target Heart Rate Zones - Karvonen HRR & Tanaka Formula | CalculatorHub',
        'meta_description': 'Calculate 5 cardiovascular training zones using Karvonen Heart Rate Reserve (HRR) and Tanaka MHR formulas. Tailored for fat-burn, aerobic base, and VO2 max.',
        'article_content': TARGET_HEART_RATE_ARTICLE,
    }
    calculator = _get_or_seed_calculator('target-heart-rate-calculator', default_data)
    return render(request, 'calculators/target_heart_rate_calculator.html', {'calculator': calculator})


def matrix_calculator(request):
    """Dynamic view for Matrix Operations Calculator."""
    default_data = {
        'title': 'Matrix Operations Calculator',
        'category': 'math',
        'meta_title': 'Matrix Calculator - Determinant, Inverse, Multiply & Transpose | CalculatorHub',
        'meta_description': 'Free online Matrix Calculator. Compute determinants, inverse matrices, matrix multiplication, addition, subtraction, trace, and transpose up to 4x4.',
        'article_content': MATRIX_ARTICLE,
    }
    calculator = _get_or_seed_calculator('matrix-calculator', default_data)
    return render(request, 'calculators/matrix_calculator.html', {'calculator': calculator})


def final_grade_calculator(request):
    """Dynamic view for Final Grade Needed Calculator."""
    default_data = {
        'title': 'Final Grade Needed Calculator',
        'category': 'other',
        'meta_title': 'Final Grade Needed Calculator - Target Exam Score Solver | CalculatorHub',
        'meta_description': 'Calculate the exact score needed on your final exam to secure your desired course grade. Supports weighted grading categories and feasibility analysis.',
        'article_content': FINAL_GRADE_ARTICLE,
    }
    calculator = _get_or_seed_calculator('final-grade-calculator', default_data)
    return render(request, 'calculators/final_grade_calculator.html', {'calculator': calculator})


def investment_calculator(request):
    """Dynamic view for Investment Calculator."""
    default_data = {
        'title': 'Investment Calculator',
        'category': 'financial',
        'meta_title': 'Investment Calculator - Compound Growth, Contributions & Returns | CalculatorHub',
        'meta_description': 'Free online Investment Calculator. Calculate future portfolio value, compound returns with periodic contributions, inflation adjustments, and annual growth schedules.',
        'article_content': INVESTMENT_ARTICLE,
    }
    calculator = _get_or_seed_calculator('investment-calculator', default_data)
    return render(request, 'calculators/investment_calculator.html', {'calculator': calculator})


def pregnancy_calculator(request):
    """Dynamic view for Pregnancy Due Date Calculator."""
    default_data = {
        'title': 'Pregnancy Due Date Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Pregnancy Due Date Calculator - EDD, Trimester & Conception | CalculatorHub',
        'meta_description': 'Estimate your baby\'s due date, gestational age, and pregnancy trimesters using LMP (Naegele\'s rule), conception date, IVF embryo transfer, or ultrasound scan.',
        'article_content': PREGNANCY_ARTICLE,
    }
    calculator = _get_or_seed_calculator('pregnancy-calculator', default_data)
    return render(request, 'calculators/pregnancy_calculator.html', {'calculator': calculator})


def random_number_generator(request):
    """Dynamic view for Random Number Generator."""
    default_data = {
        'title': 'Random Number Generator',
        'category': 'math',
        'meta_title': 'Random Number Generator - True Random, Decimals & Gaussian | CalculatorHub',
        'meta_description': 'Generate true random integers, floating point decimals, Gaussian normal distributions, dice rolls, and lottery picks with CSPRNG cryptographic security.',
        'article_content': RANDOM_NUMBER_ARTICLE,
    }
    calculator = _get_or_seed_calculator('random-number-generator', default_data)
    return render(request, 'calculators/random_number_generator.html', {'calculator': calculator})


def subnet_calculator(request):
    """Dynamic view for IPv4 Subnet Mask Calculator."""
    default_data = {
        'title': 'IPv4 Subnet Mask Calculator',
        'category': 'other',
        'meta_title': 'IPv4 Subnet Mask Calculator - CIDR, Network, Broadcast & Usable Hosts | CalculatorHub',
        'meta_description': 'Calculate IPv4 network address, broadcast address, usable host IP range, CIDR prefix masks, wildcard mask, and 32-bit binary octet breakdowns.',
        'article_content': SUBNET_ARTICLE,
    }
    calculator = _get_or_seed_calculator('subnet-calculator', default_data)
    return render(request, 'calculators/subnet_calculator.html', {'calculator': calculator})


def inflation_calculator(request):
    """Dynamic view for Inflation Calculator."""
    default_data = {
        'title': 'Inflation Calculator',
        'category': 'financial',
        'meta_title': 'Inflation Calculator - Cumulative CPI, Future Value & Purchasing Power | CalculatorHub',
        'meta_description': 'Calculate compound forward inflation, future equivalent costs, purchasing power erosion, and real vs nominal rates with historical CPI trends and Rule of 72.',
        'article_content': INFLATION_ARTICLE,
    }
    calculator = _get_or_seed_calculator('inflation-calculator', default_data)
    return render(request, 'calculators/inflation_calculator.html', {'calculator': calculator})


def ovulation_calculator(request):
    """Dynamic view for Ovulation & Fertility Calculator."""
    default_data = {
        'title': 'Ovulation & Fertility Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Ovulation & Fertility Calculator - Fertile Window & Conception Days | CalculatorHub',
        'meta_description': 'Estimate your most fertile days, ovulation date, peak conception probability window, next period, and earliest pregnancy test timing using clinical cycle algorithms.',
        'article_content': OVULATION_ARTICLE,
    }
    calculator = _get_or_seed_calculator('ovulation-calculator', default_data)
    return render(request, 'calculators/ovulation_calculator.html', {'calculator': calculator})


def standard_deviation_calculator(request):
    """Dynamic view for Standard Deviation & Variance Calculator."""
    default_data = {
        'title': 'Standard Deviation & Variance Calculator',
        'category': 'math',
        'meta_title': 'Standard Deviation Calculator - Sample vs Population Variance (n-1) | CalculatorHub',
        'meta_description': 'Calculate sample and population standard deviation, variance with Bessel\'s correction (n-1), mean, sum of squares, and step-by-step statistical deviation tables.',
        'article_content': STANDARD_DEVIATION_ARTICLE,
    }
    calculator = _get_or_seed_calculator('standard-deviation-calculator', default_data)
    return render(request, 'calculators/standard_deviation_calculator.html', {'calculator': calculator})


def speed_distance_time_calculator(request):
    """Dynamic view for Speed, Distance & Time Calculator."""
    default_data = {
        'title': 'Speed, Distance & Time Calculator',
        'category': 'other',
        'meta_title': 'Speed, Distance & Time Calculator - Kinematic Travel & Pace Solver | CalculatorHub',
        'meta_description': 'Solve for speed (v=d/t), distance (d=vt), or elapsed time (t=d/v) with multi-unit conversions (mph, km/h, m/s, knots), running pace, and multi-leg harmonic average speed.',
        'article_content': SPEED_DISTANCE_TIME_ARTICLE,
    }
    calculator = _get_or_seed_calculator('speed-distance-time-calculator', default_data)
    return render(request, 'calculators/speed_distance_time_calculator.html', {'calculator': calculator})


def salary_to_hourly_calculator(request):
    """Dynamic view for Salary to Hourly Calculator."""
    default_data = {
        'title': 'Salary to Hourly Calculator',
        'category': 'financial',
        'meta_title': 'Salary to Hourly Calculator - Annual, Bi-Weekly, Daily & Overtime | CalculatorHub',
        'meta_description': 'Convert annual salary to hourly wage and vice versa with paid time off (PTO) adjustments, statutory holidays, overtime multipliers, and pay schedule breakdowns.',
        'article_content': SALARY_TO_HOURLY_ARTICLE,
    }
    calculator = _get_or_seed_calculator('salary-to-hourly-calculator', default_data)
    return render(request, 'calculators/salary_to_hourly_calculator.html', {'calculator': calculator})


def lean_body_mass_calculator(request):
    """Dynamic view for Lean Body Mass Calculator."""
    default_data = {
        'title': 'Lean Body Mass Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Lean Body Mass Calculator - Boer, James & Hume Clinical Models | CalculatorHub',
        'meta_description': 'Calculate lean body mass (LBM), fat mass, and body fat percentage using validated Boer, James, and Hume clinical anthropometric formulas in metric or imperial.',
        'article_content': LEAN_BODY_MASS_ARTICLE,
    }
    calculator = _get_or_seed_calculator('lean-body-mass-calculator', default_data)
    return render(request, 'calculators/lean_body_mass_calculator.html', {'calculator': calculator})


def right_triangle_solver(request):
    """Dynamic view for Right Triangle Solver."""
    default_data = {
        'title': 'Right Triangle Solver',
        'category': 'math',
        'meta_title': 'Right Triangle Solver - Pythagorean Sides, Angles, Area & Inradius | CalculatorHub',
        'meta_description': 'Solve any right-angled triangle from any two inputs with Pythagorean theorem, trigonometry (sin, cos, tan), area, perimeter, altitude, inradius, and circumradius.',
        'article_content': RIGHT_TRIANGLE_ARTICLE,
    }
    calculator = _get_or_seed_calculator('right-triangle-solver', default_data)
    return render(request, 'calculators/right_triangle_solver.html', {'calculator': calculator})


def tip_calculator(request):
    """Dynamic view for Tip & Split Bill Calculator."""
    default_data = {
        'title': 'Tip & Split Bill Calculator',
        'category': 'other',
        'meta_title': 'Tip & Split Bill Calculator - Group Dining, Tax & Tip Per Person | CalculatorHub',
        'meta_description': 'Calculate restaurant tips, split bills evenly among dining parties, isolate pre-tax food charges, and apply convenient rounding to the nearest dollar.',
        'article_content': TIP_CALCULATOR_ARTICLE,
    }
    calculator = _get_or_seed_calculator('tip-calculator', default_data)
    return render(request, 'calculators/tip_calculator.html', {'calculator': calculator})


def income_tax_calculator(request):
    """Dynamic view for Income Tax Calculator."""
    default_data = {
        'title': 'Income Tax Calculator',
        'category': 'financial',
        'meta_title': 'Income Tax Calculator - 2024/2025 Federal Brackets, FICA & Take-Home Pay | CalculatorHub',
        'meta_description': 'Calculate federal income tax, FICA Social Security and Medicare, state tax estimation, and net take-home pay with progressive bracket breakdowns.',
        'article_content': INCOME_TAX_ARTICLE,
    }
    calculator = _get_or_seed_calculator('income-tax-calculator', default_data)
    return render(request, 'calculators/income_tax_calculator.html', {'calculator': calculator})


def water_intake_calculator(request):
    """Dynamic view for Daily Water Intake Calculator."""
    default_data = {
        'title': 'Daily Water Intake Calculator',
        'category': 'fitness-and-health',
        'meta_title': 'Daily Water Intake Calculator - Hydration Goals, Sweat Loss & Pacing | CalculatorHub',
        'meta_description': 'Calculate your optimal daily water intake based on body weight, exercise duration, ambient climate, and physiological state with customized hydration pacing.',
        'article_content': WATER_INTAKE_ARTICLE,
    }
    calculator = _get_or_seed_calculator('water-intake-calculator', default_data)
    return render(request, 'calculators/water_intake_calculator.html', {'calculator': calculator})


def exponent_calculator(request):
    """Dynamic view for Exponent & Power Calculator."""
    default_data = {
        'title': 'Exponent & Power Calculator',
        'category': 'math',
        'meta_title': 'Exponent & Power Calculator - Large Numbers, Negative & Fractional Powers | CalculatorHub',
        'meta_description': 'Solve exponents and power functions online. Supports integer, negative, and fractional rational exponents with step-by-step algebraic expansion rules.',
        'article_content': EXPONENT_ARTICLE,
    }
    calculator = _get_or_seed_calculator('exponent-calculator', default_data)
    return render(request, 'calculators/exponent_power_calculator.html', {'calculator': calculator})


def fuel_cost_calculator(request):
    """Dynamic view for Fuel Cost & Mileage Trip Planner."""
    default_data = {
        'title': 'Fuel Cost & Mileage Trip Planner',
        'category': 'other',
        'meta_title': 'Fuel Cost & Mileage Trip Planner - Gas Mileage, Tolls & Carpool Split | CalculatorHub',
        'meta_description': 'Calculate road trip fuel costs, gas consumption, toll charges, and passenger carpool splits using MPG or L/100km fuel economy metrics.',
        'article_content': FUEL_COST_ARTICLE,
    }
    calculator = _get_or_seed_calculator('fuel-cost-calculator', default_data)
    return render(request, 'calculators/fuel_cost_calculator.html', {'calculator': calculator})




# --------------------------------------------------------------------------
# Sitemap, SEO & Institutional Views
# --------------------------------------------------------------------------
def html_sitemap(request):
    """Clean 4-column responsive HTML sitemap directory with 88+ calculators."""
    context = {
        'meta_title': 'Calculator Sitemap & Directory - Over 88+ Free Online Calculators | CalculatorHub',
        'meta_description': 'Comprehensive directory of free online calculators organized into Financial, Fitness & Health, Math, and Other categories.',
    }
    return render(request, 'sitemap.html', context)


def robots_txt(request):
    """Technical SEO: dynamic robots.txt route referencing sitemap.xml."""
    try:
        sitemap_url = request.build_absolute_uri(reverse('django.contrib.sitemaps.views.sitemap'))
    except Exception:
        sitemap_url = request.build_absolute_uri('/sitemap.xml')

    lines = [
        "User-agent: *",
        "Allow: /",
        "",
        f"Sitemap: {sitemap_url}",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain; charset=utf-8")


def about(request):
    """About us page for complete institutional navigation."""
    context = {
        'meta_title': 'About Us - CalculatorHub Free Calculation Tools',
        'meta_description': 'Learn about CalculatorHub mission to deliver fast, accurate, zero-latency calculation utilities and transparent educational formulas.',
    }
    return render(request, 'about.html', context)


def terms(request):
    """Terms of Use page."""
    context = {
        'meta_title': 'Terms of Use - CalculatorHub',
        'meta_description': 'Terms of use and disclaimer policy for CalculatorHub online tools and calculation algorithms.',
    }
    return render(request, 'terms.html', context)


def privacy(request):
    """Privacy Policy page."""
    context = {
        'meta_title': 'Privacy Policy - CalculatorHub',
        'meta_description': 'Privacy policy outlining data handling, cookie usage, and user protection standards at CalculatorHub.',
    }
    return render(request, 'privacy.html', context)
