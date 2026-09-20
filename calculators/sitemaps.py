from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import Calculator


class CalculatorSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.9

    def items(self):
        return Calculator.objects.all()

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return obj.get_absolute_url()


class StaticViewSitemap(Sitemap):
    priority = 0.7
    changefreq = "monthly"

    def items(self):
        return ['home', 'html_sitemap', 'about', 'terms', 'privacy', 'contact']

    def location(self, item):
        return reverse(item)
