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
