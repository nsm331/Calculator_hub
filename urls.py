from django.contrib import admin
from django.urls import path, include
from django.contrib.sitemaps.views import sitemap
from calculators.sitemaps import CalculatorSitemap, StaticViewSitemap
from calculators import views as calc_views

sitemaps = {
    'calculators': CalculatorSitemap,
    'static': StaticViewSitemap,
}

urlpatterns = [
    path('admin/', admin.site.urls),
    path(
        'sitemap.xml',
        sitemap,
        {'sitemaps': sitemaps},
        name='django.contrib.sitemaps.views.sitemap'
    ),
    path('robots.txt', calc_views.robots_txt, name='robots_txt'),
    path('ads.txt', calc_views.ads_txt, name='ads_txt'),
    path('favicon.ico', calc_views.favicon, name='favicon'),
    path('', include('calculators.urls')),
]
