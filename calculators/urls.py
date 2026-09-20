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

    # Batch 6 Calculators (User Batch #5)
    path(
        'financial-calculators/refinance-calculator/',
        views.refinance_calculator,
        name='refinance_calculator'
    ),
    path(
        'fitness-and-health-calculators/running-pace-calculator/',
        views.running_pace_calculator,
        name='running_pace_calculator'
    ),
    path(
        'math-calculators/graphing-calculator/',
        views.graphing_calculator,
        name='graphing_calculator'
    ),
    path(
        'other-calculators/gpa-calculator/',
        views.gpa_calculator,
        name='gpa_calculator'
    ),

    # Batch 7 Calculators (User Batch #6)
    path(
        'financial-calculators/retirement-calculator/',
        views.retirement_calculator,
        name='retirement_calculator'
    ),
    path(
        'fitness-and-health-calculators/target-heart-rate-calculator/',
        views.target_heart_rate_calculator,
        name='target_heart_rate_calculator'
    ),
    path(
        'math-calculators/matrix-calculator/',
        views.matrix_calculator,
        name='matrix_calculator'
    ),
    path(
        'other-calculators/final-grade-calculator/',
        views.final_grade_calculator,
        name='final_grade_calculator'
    ),

    # Batch 8 Calculators (User Batch #7)
    path(
        'financial-calculators/investment-calculator/',
        views.investment_calculator,
        name='investment_calculator'
    ),
    path(
        'fitness-and-health-calculators/pregnancy-calculator/',
        views.pregnancy_calculator,
        name='pregnancy_calculator'
    ),
    path(
        'math-calculators/random-number-generator/',
        views.random_number_generator,
        name='random_number_generator'
    ),
    path(
        'other-calculators/subnet-calculator/',
        views.subnet_calculator,
        name='subnet_calculator'
    ),

    # Batch 9 Calculators (User Batch #8)
    path(
        'financial-calculators/inflation-calculator/',
        views.inflation_calculator,
        name='inflation_calculator'
    ),
    path(
        'fitness-and-health-calculators/ovulation-calculator/',
        views.ovulation_calculator,
        name='ovulation_calculator'
    ),
    path(
        'math-calculators/standard-deviation-calculator/',
        views.standard_deviation_calculator,
        name='standard_deviation_calculator'
    ),
    path(
        'other-calculators/speed-distance-time-calculator/',
        views.speed_distance_time_calculator,
        name='speed_distance_time_calculator'
    ),

    # Sitemap & Institutional Informational Pages
    path('sitemap/', views.html_sitemap, name='html_sitemap'),
    path('about/', views.about, name='about'),
    path('terms-of-use/', views.terms, name='terms'),
    path('privacy-policy/', views.privacy, name='privacy'),
]
