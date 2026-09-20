from django.db import models
from django.urls import reverse


class Calculator(models.Model):
    CATEGORY_CHOICES = [
        ('financial', 'Financial Calculators'),
        ('fitness-and-health', 'Fitness and Health Calculators'),
        ('math', 'Math Calculators'),
        ('other', 'Other Calculators'),
    ]

    title = models.CharField(max_length=200, help_text="Calculator display title")
    slug = models.SlugField(max_length=200, unique=True, help_text="URL slug identifier")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    meta_title = models.CharField(max_length=255, blank=True, help_text="SEO Meta Title")
    meta_description = models.TextField(blank=True, help_text="SEO Meta Description")
    article_content = models.TextField(
        help_text="Comprehensive SEO article content in HTML with KaTeX formulas"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['title']
        verbose_name = "Calculator"
        verbose_name_plural = "Calculators"

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        # Dedicated named route mappings for primary calculators
        slug_to_url_name = {
            'bmi-calculator': 'bmi_calculator',
            'loan-calculator': 'loan_calculator',
            'percentage-calculator': 'percentage_calculator',
            'mortgage-calculator': 'mortgage_calculator',
            'calorie-calculator': 'calorie_calculator',
            'scientific-calculator': 'scientific_calculator',
            'age-calculator': 'age_calculator',
            'auto-loan-calculator': 'auto_loan_calculator',
            'body-fat-calculator': 'body_fat_calculator',
            'fraction-calculator': 'fraction_calculator',
            'date-difference-calculator': 'date_difference_calculator',
            'compound-interest-calculator': 'compound_interest_calculator',
            'bmr-calculator': 'bmr_calculator',
            'binary-hex-converter': 'binary_hex_converter',
            'time-duration-calculator': 'time_duration_calculator',
            'amortization-calculator': 'amortization_calculator',
            'ideal-weight-calculator': 'ideal_weight_calculator',
            'decimal-to-fraction-calculator': 'decimal_to_fraction_calculator',
            'work-hours-calculator': 'work_hours_calculator',
        }
        if self.slug in slug_to_url_name:
            return reverse(slug_to_url_name[self.slug])
        return f"/{self.category}-calculators/{self.slug}/"
