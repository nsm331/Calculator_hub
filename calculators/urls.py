from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    
    # Batch 1 Calculators
    path(
        'fitness-and-health-calculators/bmi-calculator/',
        views.bmi_calculator,
        name='bmi_calculator'
    ),
    path(
        'financial-calculators/loan-calculator/',
        views.loan_calculator,
        name='loan_calculator'
    ),
    path(
        'math-calculators/percentage-calculator/',
        views.percentage_calculator,
        name='percentage_calculator'
    ),

    # Batch 2 Calculators
    path(
        'financial-calculators/mortgage-calculator/',
        views.mortgage_calculator,
        name='mortgage_calculator'
    ),
    path(
        'fitness-and-health-calculators/calorie-calculator/',
        views.calorie_calculator,
        name='calorie_calculator'
    ),
    path(
        'math-calculators/scientific-calculator/',
        views.scientific_calculator,
        name='scientific_calculator'
    ),
    path(
        'other-calculators/age-calculator/',
        views.age_calculator,
        name='age_calculator'
    ),

    # Batch 3 Calculators
    path(
        'financial-calculators/auto-loan-calculator/',
        views.auto_loan_calculator,
        name='auto_loan_calculator'
    ),
    path(
        'fitness-and-health-calculators/body-fat-calculator/',
        views.body_fat_calculator,
        name='body_fat_calculator'
    ),
    path(
        'math-calculators/fraction-calculator/',
        views.fraction_calculator,
        name='fraction_calculator'
    ),
    path(
        'other-calculators/date-difference-calculator/',
        views.date_difference_calculator,
        name='date_difference_calculator'
    ),

    # Batch 4 Calculators (User Batch #3)
    path(
        'financial-calculators/compound-interest-calculator/',
        views.compound_interest_calculator,
        name='compound_interest_calculator'
    ),
    path(
        'fitness-and-health-calculators/bmr-calculator/',
        views.bmr_calculator,
        name='bmr_calculator'
    ),
    path(
        'math-calculators/binary-hex-converter/',
        views.binary_hex_converter,
        name='binary_hex_converter'
    ),
    path(
        'other-calculators/time-duration-calculator/',
        views.time_duration_calculator,
        name='time_duration_calculator'
    ),

    # Batch 5 Calculators (User Batch #4)
    path(
        'financial-calculators/amortization-calculator/',
        views.amortization_calculator,
        name='amortization_calculator'
    ),
    path(
        'fitness-and-health-calculators/ideal-weight-calculator/',
        views.ideal_weight_calculator,
        name='ideal_weight_calculator'
    ),
    path(
        'math-calculators/decimal-to-fraction-calculator/',
        views.decimal_to_fraction_calculator,
        name='decimal_to_fraction_calculator'
    ),
    path(
        'other-calculators/work-hours-calculator/',
        views.work_hours_calculator,
        name='work_hours_calculator'
    ),

    # Sitemap & Institutional Informational Pages
    path('sitemap/', views.html_sitemap, name='html_sitemap'),
    path('about/', views.about, name='about'),
    path('terms-of-use/', views.terms, name='terms'),
    path('privacy-policy/', views.privacy, name='privacy'),
]
